import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Merchant } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MerchantsService } from 'src/merchants/merchants.service';
import { ENV } from 'src/config/env.validation';
import { JwtPayload } from '../common/interfaces';
import { ACCESS_TOKEN_LIFETIME } from '../common/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private merchantsService: MerchantsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      expiresIn: ACCESS_TOKEN_LIFETIME,
      secretOrKey: `${ENV.ACCESS_TOKEN_SECRET}`,
    });
  }

  async validate(
    jwt: JwtPayload,
  ): Promise<(Merchant & { requiresOtp: boolean }) | null> {
    // set merchant to req.user
    const user = await this.merchantsService.findBy({ email: jwt.email });
    if (user) {
      return { ...user, requiresOtp: !!jwt.requiresOtp };
    }

    return null;
  }
}
