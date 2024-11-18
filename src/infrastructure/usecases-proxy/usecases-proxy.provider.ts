import { Provider } from '@nestjs/common';
import { UseCaseProxy } from './usecases-proxy';
import { AuthUsecases } from '@usecase/auth.usecases';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { DatabaseAdminRepository } from '../repositories/admin.service';
import { DatabaseUserRepository } from '../repositories/user.service';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { EnvironmentConfigService } from '@config';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { ModuleProxyBase } from './module-proxy.base';
import { DatabaseImageUploadRepository } from '../repositories/image.service';
import { ImageUploadUsecases } from '@usecase/image.usecase';

export const usecasesProxyProviders: Provider[] = [
  {
    inject: [
      ExceptionsService,
      DatabaseAdminRepository,
      DatabaseUserRepository,
      BcryptService,
      EnvironmentConfigService,
      JwtTokenService,
    ],
    provide: ModuleProxyBase.AUTH_USECASES_PROXY,
    useFactory: (
      exceptionsService: ExceptionsService,
      adminRepo: DatabaseAdminRepository,
      userRepo: DatabaseUserRepository,
      bcryptService: BcryptService,
      jwtConfig: EnvironmentConfigService,
      jwtTokenService: JwtTokenService,
    ) =>
      new UseCaseProxy(
        new AuthUsecases(exceptionsService, adminRepo, userRepo, bcryptService, jwtConfig, jwtTokenService),
      ),
  },
  {
    inject: [ExceptionsService, DatabaseImageUploadRepository],
    provide: ModuleProxyBase.IMAGE_PROXY,
    useFactory: (exceptionsService: ExceptionsService, imageDataRepo: DatabaseImageUploadRepository) =>
      new UseCaseProxy(new ImageUploadUsecases(exceptionsService, imageDataRepo)),
  },
];
