import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/infrastructure/models/user.model';
import { IUserService } from '@repository/userService.interface';
import { Model } from 'mongoose';

@Injectable()
export class DatabaseUserRepository extends IUserService {
  constructor(
    @InjectModel(User.name)
    private readonly userEntityRepository: Model<User>,
  ) {
    super(userEntityRepository);
  }
  notFoundMessage = 'User not found.';
}
