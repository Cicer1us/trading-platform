import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { DISABLE_2FA_DECORATOR_KEY } from '../common/disable-2fa.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const parentCanActivate = (await super.canActivate(context)) as boolean;

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const disable2fa = this.reflector.get<boolean>(
      DISABLE_2FA_DECORATOR_KEY,
      context.getHandler(),
    );

    if (user.requiresOtp && !disable2fa) {
      throw new UnauthorizedException('2FA turned on. Requires otp to login');
    }

    return parentCanActivate;
  }
}
