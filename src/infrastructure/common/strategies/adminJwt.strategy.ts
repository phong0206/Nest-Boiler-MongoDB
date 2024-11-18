import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Req } from '@nestjs/common';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { LoggerService } from '../../logger/logger.service';
import { AuthUsecases } from '@usecase/auth.usecases';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
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
    console.log(payload);
    const admin = await this.authUsecasesProxy.getInstance().validateAdminForJWTStrategy(payload.email);
    const accessToken = request.headers['authorization'].replace('Bearer ', '');
    if (!admin || payload.type !== 'admin' || admin.access_token !== accessToken) {
      this.logger.warn('JwtStrategy', `Admin not found`);
      this.exceptionService.unauthorizedException({ message: 'Your login session has expired.' });
    }
    return admin;
  }
}
