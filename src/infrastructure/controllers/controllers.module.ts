import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { AuthController } from './auth/auth.controller';
import { ImageController } from './image/image.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [AuthController, ImageController],
})
export class ControllersModule {}
