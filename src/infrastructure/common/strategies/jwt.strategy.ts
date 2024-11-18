import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Req } from '@nestjs/common';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { LoggerService } from '../../logger/logger.service';
import { AuthUsecases } from '@usecase/auth.usecases';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AuthUsecasesProxy')
    private readonly authUsecasesProxy: UseCaseProxy<AuthUsecases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(@Req() request: any, payload: any) {
    console.log(123, payload);
    const user = await this.authUsecasesProxy.getInstance().validateUserForJWTStrategy(payload.email);
    const accessToken = request.headers['authorization'].replace('Bearer ', '');
    if (!user || payload.type !== 'user' || user.access_token !== accessToken) {
      this.logger.warn('JwtStrategy', `User not found`);
      this.exceptionService.unauthorizedException({ message: 'Your login session has expired.' });
    }
    return user;
  }
}
