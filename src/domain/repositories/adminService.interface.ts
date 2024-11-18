import { BaseService } from '@common';
import { Admin } from 'src/infrastructure/models/admin.model';

export abstract class IAdminService extends BaseService<Admin> {}
