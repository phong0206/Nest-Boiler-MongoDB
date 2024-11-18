import { BaseModel, createSchema, Schema } from '../common/base/base.model';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { Prop } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User> & BaseModel;

@Schema('user')
export class User extends BaseModel {
  @Prop()
  name!: string;

  @Prop()
  @Exclude()
  password!: string;

  @IsEmail()
  @Prop()
  email!: string;

  @Prop()
  refresh_token: string;

  @Prop()
  access_token: string;
}

export const UserSchema = createSchema(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.index({ email: 'text' }, { weights: { email: 1 } });
