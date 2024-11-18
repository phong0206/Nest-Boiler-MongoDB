import { BaseModel, createSchema, Schema } from '../common/base/base.model';
import { HydratedDocument } from 'mongoose';
import { Prop } from '@nestjs/mongoose';

export type ImageUploadDocument = HydratedDocument<ImageUpload> & BaseModel;

@Schema('images')
export class ImageUpload extends BaseModel {
  @Prop()
  file_name: string;

  @Prop()
  path: string;
}

export const ImageUploadSchema = createSchema(ImageUpload);
