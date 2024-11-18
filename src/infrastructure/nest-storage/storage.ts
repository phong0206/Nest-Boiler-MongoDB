import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';

@Injectable()
export class Storage {
  static disk(disk = '') {
    return StorageService.getDriver(disk);
  }
}
