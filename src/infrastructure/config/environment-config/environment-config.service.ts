import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../../domain/config/database.interface';
import { JWTConfig } from '../../../domain/config/jwt.interface';
import { StorageConfig } from 'src/domain/config/storage.interface';
import { RedisConfig } from 'src/domain/config/redis.interface';

@Injectable()
export class EnvironmentConfigService implements DatabaseConfig, JWTConfig, StorageConfig, RedisConfig {
  constructor(private configService: ConfigService) {}

  //env jwt
  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  getJwtRefreshExpirationTime(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }

  // env config database
  getDatabaseEngine(): string {
    return this.configService.get<string>('DATABASE_ENGINE');
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST');
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT');
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME');
  }

  //env config storage
  getDefaultStorage(): string {
    return this.configService.get<string>('DEFAULT_STORAGE');
  }

  getS3Bucket(): string {
    return this.configService.get<string>('S3_BUCKET');
  }

  getS3Region(): string {
    return this.configService.get<string>('AWS_REGION');
  }

  getLocalStorageBasePath(): string {
    return this.configService.get<string>('LOCAL_STORAGE_BASE_PATH');
  }

  getS3StorageBasePath(): string {
    return this.configService.get<string>('S3_STORAGE_BASE_PATH') + '/';
  }

  //env config mailserver
  getUserMailer(): string {
    return this.configService.get<string>('NODEMAILER_USER');
  }

  getPasswordMailer(): string {
    return this.configService.get<string>('NODEMAILER_PASS');
  }

  getSESRegion(): string {
    return this.configService.get<string>('SES_REGION');
  }

  getPortMailer(): number {
    return this.configService.get<number>('NODEMAILER_PORT');
  }

  getHostMailer(): string {
    return this.configService.get<string>('NODEMAILER_HOST');
  }

  getMailFrom(): string {
    return this.configService.get<string>('NODEMAILER_FROM');
  }

  //env redis config
  getRedisHost(): string {
    return this.configService.get<string>('REDIS_HOST');
  }

  getRedisPort(): number {
    return this.configService.get<number>('REDIS_PORT');
  }

  getRedisPassword(): string {
    return this.configService.get<string>('REDIS_PASSWORD');
  }

  getRedisPrefix(): string {
    return this.configService.get<string>('REDIS_PREFIX');
  }
}
