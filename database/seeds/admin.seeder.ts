import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BcryptService } from '../../src/infrastructure/services/bcrypt/bcrypt.service';
import { Admin } from 'src/infrastructure/models/admin.model';

@Injectable()
export default class AdminSeeder implements Seeder {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private bcryptService: BcryptService,
  ) {}

  public async seed(): Promise<void> {
    await this.adminModel.deleteMany({});

    const hashedPassword = await this.bcryptService.hash('admin@123');
    await this.adminModel.create({
      name: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
    });
  }

  public async drop(): Promise<void> {
    await this.adminModel.deleteMany({});
  }
}
