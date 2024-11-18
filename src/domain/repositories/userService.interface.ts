import { BaseService } from '@common';
import { User } from 'src/infrastructure/models/user.model';

export abstract class IUserService extends BaseService<User> {}
