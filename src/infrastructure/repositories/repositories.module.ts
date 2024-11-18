import { Module } from '@nestjs/common';
import { DatabaseUserRepository } from './user.service';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { DatabaseAdminRepository } from './admin.service';
import { DatabaseImageUploadRepository } from './image.service';
import { DatabaseModule } from '@config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/infrastructure/models/user.model';
import { Admin, AdminSchema } from '@models/admin.model';
import { ImageUpload, ImageUploadSchema } from '@models/image.model';

@Module({
  imports: [
    DatabaseModule,
    ExceptionsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: ImageUpload.name, schema: ImageUploadSchema },
    ]),
  ],
  providers: [DatabaseUserRepository, DatabaseAdminRepository, DatabaseImageUploadRepository],
  exports: [DatabaseUserRepository, DatabaseAdminRepository, DatabaseImageUploadRepository],
})
export class RepositoriesModule {}
