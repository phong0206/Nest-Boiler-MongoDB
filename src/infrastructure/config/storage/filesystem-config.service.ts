import * as process from 'node:process';
import { StorageOptions } from '@squareboat/nest-storage/lib/interfaces';

export function storageConfig(): StorageOptions {
  return {
    default: process.env.DEFAULT_STORAGE,
    disks: {
      s3: {
        driver: 's3',
        bucket: process.env.S3_BUCKET,
        region: process.env.AWS_REGION,
      },
      local: {
        driver: 'local',
        basePath: process.env.LOCAL_STORAGE_BASE_PATH,
      },
    },
  };
}
