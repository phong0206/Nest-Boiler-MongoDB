import { ClassSerializerInterceptor, Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './infrastructure/common/interceptors/response.interceptor';
import { AllExceptionFilter } from './infrastructure/common/filter/exception.filter';
import { LoggerService } from './infrastructure/logger/logger.service';
import {
  AdminJwtRefreshTokenStrategy,
  AdminJwtStrategy,
  JwtRefreshTokenStrategy,
  JwtStrategy,
  TrimStringsPipe,
} from '@common';

export const providers: Provider[] = [
  JwtStrategy,
  AdminJwtStrategy,
  AdminJwtRefreshTokenStrategy,
  JwtRefreshTokenStrategy,
  {
    provide: APP_PIPE,
    useClass: TrimStringsPipe,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  },
  {
    provide: APP_FILTER,
    useFactory: (loggerService: LoggerService) => new AllExceptionFilter(loggerService),
    inject: [LoggerService],
  },
];
