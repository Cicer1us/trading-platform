import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Merchant } from '@prisma/client';
import Strategy from 'passport-headerapikey';
import { MerchantsService } from 'src/merchants/merchants.service';

type DoneCallback = (error: Error | null, data: Merchant | null) => void;

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private merchantsService: MerchantsService) {
    super(
      { header: 'X-CC-API-KEY', prefix: '' },
      true,
      async (apiKey: string, done: DoneCallback) => {
        return this.validate(apiKey, done);
      },
    );
  }

  public async validate(apiKey: string, done: DoneCallback): Promise<void> {
    const merchant = await this.merchantsService.findBy({ apiKey });

    if (merchant) {
      done(null, merchant);
    }
    done(new UnauthorizedException(), null);
  }
}
