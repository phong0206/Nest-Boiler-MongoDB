import { Injectable } from '@nestjs/common';
import { Admin } from 'src/infrastructure/models/admin.model';
import { IAdminService } from '@repository/adminService.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DatabaseAdminRepository extends IAdminService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminEntityRepository: Model<Admin>,
  ) {
    super(adminEntityRepository);
  }
  notFoundMessage = 'Admin not found.';
}
