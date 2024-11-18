import { Type, applyDecorators } from '@nestjs/common';
import { Schema as NestMongooseSchema, Prop, SchemaFactory } from '@nestjs/mongoose';

export class BaseModel {
  id!: string;

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;
}

export const Schema = (collection?: string) =>
  applyDecorators(NestMongooseSchema({ timestamps: true, versionKey: false, collection }));

export const createSchema = (target: Type<BaseModel>) => {
  const schema = SchemaFactory.createForClass(target);
  schema.set('toJSON', {
    virtuals: true,
  });
  schema.set('toObject', {
    virtuals: true,
  });
  schema.virtual('id').get(function () {
    return this._id.toString();
  });
  return schema;
};
