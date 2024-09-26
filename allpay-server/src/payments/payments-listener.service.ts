import { Injectable } from '@nestjs/common';
import { Payment as PaymentEvent, getBuiltGraphSDK } from '../../.graphclient';
import {
  Chain,
  DEFAULT_PAY_OUT_TOKEN,
  FINALIZED_TX_BLOCK_AMOUNT,
} from 'src/common/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { Merchant, Payment, PaymentStatus } from '@prisma/client';
import { BigNumber } from 'ethers';
import { excludeProperties, isObjectId } from 'src/common/utils';
import { PaymentsService } from './payments.service';
import {
  convertFromHuman,
  convertToHuman,
  getCurrentBlock,
} from './utils/token-price';
import { Cron, CronExpression } from '@nestjs/schedule';

const graphSdk = getBuiltGraphSDK();

@Injectable()
export class PaymentsListenerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkNotCompletedPayments() {
    const pendingPayments = await this.prisma.payment.findMany({
      where: { status: { notIn: [PaymentStatus.COMPLETED] } },
    });
    if (pendingPayments.length) {
      await this.verifyAndCompletePayments(pendingPayments.map((p) => p.id));
    }
  }

  // could be used to update payment status by request
  // and not wait for cron job to update it
  async checkPayment(paymentId: string) {
    await this.verifyAndCompletePayments([paymentId]);
  }

  async verifyAndCompletePayments(paymentIds: string[]) {
    const paymentEventsQuery = await graphSdk.Payments({
      chainIds: [Chain.POLYGON, Chain.MAINNET, Chain.BSC],
      orderId_in: paymentIds,
    });

    const paymentEvents = paymentEventsQuery.crossPayments;

    const payments = await this.prisma.payment.findMany({
      where: {
        id: {
          in: paymentEvents
            .map((p) => p.orderId)
            .filter((id) => isObjectId(id)),
        },
      },
      include: { merchant: true },
    });

    for (const payment of payments) {
      const paymentEvent = paymentEvents.find((p) => p.orderId === payment.id);
      if (paymentEvent && this.isPaymentAccepted(payment, paymentEvent)) {
        const isPaymentFinalized = await this.isPaymentFinalized(paymentEvent);
        const status = isPaymentFinalized
          ? PaymentStatus.COMPLETED
          : PaymentStatus.ACCEPTED;

        // TODO Rework hardcoded decimals for usdc to use decimals from token
        const transaction = {
          ...paymentEvent,
          payOutHumanAmount: Number(
            convertToHuman(
              paymentEvent.payOutAmount,
              DEFAULT_PAY_OUT_TOKEN[paymentEvent.chainId as Chain].decimals,
            ),
          ),
        };

        if (payment.status !== status) {
          await this.paymentsService.setStatus(
            payment.id,
            status,
            excludeProperties(transaction, ['id', 'orderId']),
          );
        }
      }
    }
  }

  // payment is considered accepted if:
  // 1. PayOutToken is USDC (at least for current implementation)
  // 2. PayOutAmount is not less than price.fiatPrice in USDC equivalent
  // 3. Merchant address (address which receives all funds) in the event is the same as in Merchant DB
  isPaymentAccepted(
    payment: Payment & { merchant: Merchant },
    paymentEvent: PaymentEvent,
  ) {
    const expectedPayOutToken =
      DEFAULT_PAY_OUT_TOKEN[paymentEvent.chainId as Chain];

    const expectedPayOutAmount = convertFromHuman(
      payment.price.fiatPrice,
      expectedPayOutToken.decimals,
    );

    if (paymentEvent.payOutToken !== expectedPayOutToken.address) {
      return false;
    }

    if (BigNumber.from(paymentEvent.payOutAmount).lt(expectedPayOutAmount)) {
      return false;
    }

    if (paymentEvent.merchant === payment.merchant.walletAddress) {
      return false;
    }

    return true;
  }

  // finalized means that transaction is mined and there is no chance that it will be reverted
  async isPaymentFinalized(paymentEvent: PaymentEvent) {
    const chainId = paymentEvent.chainId as Chain;
    const currentBlockNumber = await getCurrentBlock(chainId);

    return (
      currentBlockNumber - Number(paymentEvent.blockNumber) >
      FINALIZED_TX_BLOCK_AMOUNT[chainId]
    );
  }
}
