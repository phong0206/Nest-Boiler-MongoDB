import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { UsecasesProxyModule } from './infrastructure/usecases-proxy/usecases-proxy.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module';
import { JwtModule as JwtServiceModule } from './infrastructure/services/jwt/jwt.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CustomStorageModule } from './infrastructure/nest-storage/storage.module';
import { EnvironmentConfigModule, storageConfig } from '@config';
import { providers } from './app.provider';
import { QueueModule } from './infrastructure/config/queue/queue.module';

@Module({
  imports: [
    ...(process.env.DEFAULT_STORAGE === 'local'
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'storage'),
          }),
        ]
      : []),
    PassportModule,
    JwtModule.register({
      secret: process.env.secret,
    }),
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    BcryptModule,
    JwtServiceModule,
    EnvironmentConfigModule,
    CustomStorageModule.register(storageConfig()),
    QueueModule,
  ],
  providers,
})
export class AppModule {}
