import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiKeyAuthGuard } from 'src/auth/guard/api-key-auth.guard';
import { AuthRequest } from 'src/auth/common/interfaces';
import { PaymentPrice } from './payments.interface';
import { PaymentsListenerService } from './payments-listener.service';
import { AuthGuard } from '@nestjs/passport';
import { PaymentPriceDto, PaymentPriceQueryDto } from './dto/payment-price.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaymentCreatedResponseDto,
  PaymentResponseDto,
} from './dto/payment.dto';
import { PaymentTxDto } from './dto/payment-tx.dto';
import { PaymentFindManyDto } from './dto/payment-find-many.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  TransactionsVolumeDto,
  TransactionsVolumeResponseDto,
} from './dto/transactions-volume.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paymentsListenerService: PaymentsListenerService,
  ) {}

  @Get()
  @UseGuards(AuthGuard(['jwt', 'api-key']))
  @ApiBearerAuth()
  getPayments(@Request() req: AuthRequest, @Query() query: PaymentFindManyDto) {
    return this.paymentsService.findMany(req.user.id, query);
  }

  @Get('volume')
  @ApiResponse({ status: HttpStatus.OK, type: TransactionsVolumeResponseDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getPaymentsVolume(
    @Request() req: AuthRequest,
    @Query() query: TransactionsVolumeDto,
  ): Promise<TransactionsVolumeResponseDto> {
    return this.paymentsService.getPaymentsVolume(req.user.id, query);
  }

  @Get(':id')
  @ApiResponse({ type: PaymentResponseDto })
  async getPayment(@Param('id') id: string): Promise<PaymentResponseDto> {
    return new PaymentResponseDto(await this.paymentsService.findBy({ id }));
  }

  @Get('price/:id')
  @ApiResponse({ type: PaymentPriceDto })
  getPaymentTokenPrice(
    @Param('id') id: string,
    @Query() query: PaymentPriceQueryDto,
  ): Promise<PaymentPriceDto> {
    return this.paymentsService.getPaymentTokenPrice(
      id,
      query.token,
      query.chainId,
      query.decimals,
      query.slippage,
    );
  }

  @Post()
  @UseGuards(ApiKeyAuthGuard)
  @ApiResponse({ type: PaymentCreatedResponseDto })
  @ApiBearerAuth()
  async createPayment(
    @Request() req: AuthRequest,
    @Body() data: CreatePaymentDto,
  ): Promise<PaymentCreatedResponseDto> {
    return this.paymentsService.create(req.user, data);
  }

  @Post('build-tx')
  @ApiResponse({ type: PaymentTxDto })
  async createCompletePaymentTransaction(
    @Body() data: { initiator: string; price: PaymentPrice },
  ): Promise<PaymentTxDto> {
    return this.paymentsService.createCompletePaymentTx(
      data.initiator,
      data.price,
    );
  }

  @Post('status/:id')
  async checkPaymentStatus(@Param('id') id: string) {
    return this.paymentsListenerService.checkPayment(id);
  }
}
