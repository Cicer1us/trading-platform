import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Merchant, Payment, PaymentStatus, Prisma } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { MerchantsService } from 'src/merchants/merchants.service';
import { PaymentPrice } from './payments.interface';
import { ENV } from '../config/env.validation';
import { buildCompletePaymentTx } from 'src/payments/utils/build-tx';
import { calculatePaymentTokenPrice } from './utils/token-price';
import { PaymentFindManyDto } from './dto/payment-find-many.dto';
import {
  TransactionsVolumeDto,
  TransactionsVolumeResponseDto,
} from './dto/transactions-volume.dto';
import { getVolumeRawQueryArgs } from './utils/get-volume-raw-query-args';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly merchantService: MerchantsService,
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}
  private readonly logger = new Logger(PaymentsService.name);

  async create(
    merchant: Merchant,
    data: Omit<Prisma.PaymentUncheckedCreateInput, 'merchantId'>,
  ) {
    const payment = await this.prisma.payment.create({
      data: { ...data, merchantId: merchant.id },
    });

    return {
      data: {
        paymentUrl: new URL(
          `payment/${payment.id}`,
          ENV.CLIENT_HOST,
        ).toString(),
      },
    };
  }

  async findBy(where: Prisma.PaymentWhereUniqueInput) {
    return this.prisma.payment.findUniqueOrThrow({ where });
  }

  async findMany(merchantId: string, query: PaymentFindManyDto) {
    const args: Prisma.PaymentFindManyArgs = {
      take: query.take,
      skip: query.skip,
      where: {
        merchantId,
        transaction: {
          payInToken: query.payInToken,
          payOutToken: query.payOutToken,
        },
        updatedAt: {
          gte: query.fromDate,
          lte: query.toDate,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        transaction: true,
      },
    };

    const total = await this.prisma.payment.count({ where: args.where });
    const data = await this.prisma.payment.findMany(args);
    return { total, data };
  }

  async getPaymentsVolume(
    merchantId: string,
    query: TransactionsVolumeDto,
  ): Promise<TransactionsVolumeResponseDto> {
    const args = getVolumeRawQueryArgs(merchantId, query);
    const res = (await this.prisma.payment.aggregateRaw(args)) as unknown as {
      total: number;
    }[];
    return { volume: res[0]?.total ?? 0 };
  }

  async setStatus(
    paymentId: string,
    status: PaymentStatus,
    transaction: Prisma.TransactionCreateWithoutPaymentInput,
  ) {
    this.logger.log(`Set payment ${paymentId} status to ${status}`);
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    });
    await this.prisma.transaction.upsert({
      create: { ...transaction, paymentId },
      update: transaction,
      where: { paymentId },
    });
    await this.sendStatusUpdateNotifications(updatedPayment);
    return updatedPayment;
  }

  async sendStatusUpdateNotifications(payment: Payment): Promise<void> {
    const merchant = await this.merchantService.findBy({
      id: payment.merchantId,
    });
    if (!merchant) {
      this.logger.error(`Failed to get merchant ${payment.id}`);
      return;
    }

    for (const url of merchant.subscriptionUrls) {
      this.httpService
        .post(
          url,
          {
            orderId: payment.metadata.orderId,
            status: payment.status,
          },
          {
            headers: {
              'X-CC-WEBHOOK-SECRET': merchant.subscriptionSecret,
            },
          },
        )
        .pipe()
        .subscribe({
          error: (err) => {
            this.logger.warn(
              `Failed to send notification to merchant for payment ${payment.id} to ${url}`,
            );
            this.logger.warn(err);
          },
        });
    }
  }

  async getPaymentTokenPrice(
    id: string,
    token: string,
    chainId: number,
    decimals: number,
    slippage: number,
  ): Promise<PaymentPrice> {
    const payment = await this.findBy({ id });

    try {
      const paymentTokenPrice = await calculatePaymentTokenPrice(
        payment.price.fiatPrice,
        { address: token, chainId, decimals },
        slippage,
      );

      return {
        ...paymentTokenPrice,
        chainId,
        paymentId: payment.id,
        fiatPrice: payment.price.fiatPrice,
        fiatCurrency: payment.price.fiatCurrency,
      };
    } catch (error: unknown) {
      throw new BadRequestException((error as Error)?.message);
    }
  }

  async createCompletePaymentTx(initiator: string, price: PaymentPrice) {
    const payment = await this.prisma.payment.findUniqueOrThrow({
      where: { id: price.paymentId },
      include: { merchant: true },
    });

    if (!payment.merchant.walletAddress) {
      throw new NotFoundException(
        'Failed to build payment tx: empty merchant wallet address',
      );
    }

    try {
      const tx = await buildCompletePaymentTx(
        initiator,
        payment.merchant.walletAddress,
        price,
      );
      return tx;
    } catch (error) {
      throw new BadRequestException((error as Error)?.message);
    }
  }
}
