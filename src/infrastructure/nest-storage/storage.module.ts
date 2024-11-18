import { Module, DynamicModule } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageOptions } from './interfaces';
import { STORAGE_OPTIONS } from './constants';

@Module({
  providers: [],
  exports: [],
})
export class CustomStorageModule {
  static register(options: StorageOptions): DynamicModule {
    return {
      global: true,
      module: CustomStorageModule,
      providers: [
        StorageService,
        {
          provide: STORAGE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
