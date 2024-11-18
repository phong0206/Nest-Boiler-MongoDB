import { BaseService } from '@common';
import { ImageUpload } from 'src/infrastructure/models/image.model';
export abstract class IImageUploadService extends BaseService<ImageUpload> {
  abstract uploadFile(file: Express.Multer.File);
  abstract uploadFiles(files: Express.Multer.File[]);
}
