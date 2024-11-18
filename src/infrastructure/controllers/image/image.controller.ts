import {
  AdminJwtAuthGuard,
  ALLOW_IMAGE_TYPE_REGEX,
  ApiController,
  ApiCreate,
  ApiFiles,
  CustomParseFilePipe,
  IMAGE_MAX_COUNT,
  IMAGE_MAX_SIZE,
} from '@common';
import { Controller, Get, Inject, Post, UploadedFiles, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { ImageUploadUsecases } from '@usecase/image.usecase';
import { FormImagesDto } from './image-dto.class';
import { ImageUpload } from 'src/infrastructure/models/image.model';
@Controller('image')
@ApiController('image', [ImageUpload])
export class ImageController {
  constructor(
    @Inject(UsecasesProxyModule.IMAGE_PROXY)
    private readonly imageUsecasesProxy: UseCaseProxy<ImageUploadUsecases>,
  ) {}

  @Post()
  @ApiFiles(FormImagesDto, 'images[]')
  @ApiCreate(ImageUpload, 'images')
  async create(
    @UploadedFiles(new CustomParseFilePipe(ALLOW_IMAGE_TYPE_REGEX, IMAGE_MAX_SIZE, IMAGE_MAX_COUNT, true, false))
    images: Express.Multer.File[] = [],
  ) {
    await this.imageUsecasesProxy.getInstance().uploadFiles(images);
    return 'Upload images successfully';
  }
}
