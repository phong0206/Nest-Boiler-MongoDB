export interface StorageConfig {
  getDefaultStorage(): string;
  getS3Bucket(): string;
  getS3Region(): string;
  getLocalStorageBasePath(): string;
  getS3StorageBasePath(): string;
}
