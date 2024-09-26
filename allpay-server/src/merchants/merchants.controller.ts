import {
  Request,
  Body,
  Controller,
  Put,
  UseGuards,
  Post,
} from '@nestjs/common';
import { AuthRequest } from 'src/auth/common/interfaces';
import { MerchantsService } from './merchants.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { uuid } from 'uuidv4';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MerchantResponseDto } from './dto/merchant-response.dto';
import { SubscriptionsDto } from './dto/subscriptions.dto';
import { BadRequestResponseDto } from '../common/dto/bad-request-response.dto';
import { ConflictResponseDto } from '../common/dto/conflict-response.dto';

@ApiTags('Merchants')
@ApiBadRequestResponse({ type: BadRequestResponseDto })
@ApiConflictResponse({ type: ConflictResponseDto })
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Put('subscriptions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: MerchantResponseDto })
  async putSubscriptions(
    @Request() req: AuthRequest,
    @Body() data: SubscriptionsDto,
  ): Promise<MerchantResponseDto> {
    return new MerchantResponseDto(
      await this.merchantsService.update(req.user, {
        subscriptionUrls: data.subscriptionUrls,
      }),
    );
  }

  @Post('rotate-secret')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: MerchantResponseDto })
  async putSubscriptionSecret(
    @Request() req: AuthRequest,
  ): Promise<MerchantResponseDto> {
    return new MerchantResponseDto(
      await this.merchantsService.update(req.user, {
        subscriptionSecret: uuid(),
      }),
    );
  }

  @Post('wallet')
  @UseGuards(JwtAuthGuard)
  async setWalletAddress(
    @Request() req: AuthRequest,
    @Body() data: { walletAddress: string },
  ) {
    return this.merchantsService.update(req.user, {
      walletAddress: data.walletAddress,
    });
  }
}
