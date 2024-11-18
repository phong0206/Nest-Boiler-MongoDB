import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { JwtModule } from '../services/jwt/jwt.module';
import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { EnvironmentConfigModule } from '@config';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { QueueModule } from '../config/queue/queue.module';
import { ModuleProxyBase } from './module-proxy.base';
import { usecasesProxyProviders } from './usecases-proxy.provider';
import { usecasesProxyExports } from './usecases-proxy.export';

@Module({
  imports: [
    LoggerModule,
    JwtModule,
    BcryptModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
    QueueModule,
  ],
})
export class UsecasesProxyModule extends ModuleProxyBase {
  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [...usecasesProxyProviders],
      exports: [...usecasesProxyExports],
    };
  }
}
