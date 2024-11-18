export interface DiskOptions {
  driver: 's3' | 'local';
  profile?: string;
  region?: string;
  bucket?: string;
  prefix?: string;
  basePath?: string;
  accessKey?: string;
  secretKey?: string;
  fetchRemoteCredentials?: boolean;
}

export interface StorageOptions {
  default: string;
  disks: Record<string, DiskOptions>;
}
