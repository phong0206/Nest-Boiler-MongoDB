import {
  DiskOptions,
  FileOptions,
  StorageDriver,
  StorageDriver$FileMetadataResponse,
  StorageDriver$PutFileResponse,
  StorageDriver$RenameFileResponse,
} from '../interfaces';
import { Credentials, S3, SharedIniFileCredentials } from 'aws-sdk';
import { getMimeFromExtension } from '../helpers';
import { HeadObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3';

export class S3Storage implements StorageDriver {
  private disk: string;
  private config: DiskOptions;
  private client: S3;

  constructor(disk: string, config: DiskOptions) {
    this.disk = disk;
    this.config = config;
    const options = {
      signatureVersion: 'v4',
      region: this.config.region,
    } as Record<string, any>;

    if (config.profile) {
      options['credentials'] = new SharedIniFileCredentials({
        profile: config.profile,
      });
    } else if (config.accessKey && config.secretKey) {
      options['credentials'] = new Credentials({
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      });
    }

    this.client = new S3(options);
  }

  /**
   * Put file content to the path specified.
   *
   * @param path
   * @param fileContent
   * @param options
   */
  async put(path: string, fileContent: any, options?: FileOptions): Promise<StorageDriver$PutFileResponse> {
    const { mimeType } = options || {};
    const params = {
      Bucket: this.config.bucket,
      Key: this.getPath(path),
      Body: fileContent,
      ContentType: mimeType ? mimeType : getMimeFromExtension(path),
      ...(options?.s3Meta || {}),
    } as PutObjectRequest;

    await this.client.upload(params).promise();
    return { url: this.url(this.getPath(path)), path: this.getPath(path) };
  }

  /**
   * Get Signed Urls
   * @param path
   * @param expireInMinutes
   */
  signedUrl(path: string, expireInMinutes = 20): string {
    const params = {
      Bucket: this.config.bucket,
      Key: this.getPath(path),
      Expires: 60 * expireInMinutes,
    };

    return this.client.getSignedUrl('getObject', params);
  }

  /**
   * Get file stored at the specified path.
   *
   * @param path
   */
  async get(path: string): Promise<Buffer | null> {
    try {
      const params = {
        Bucket: this.config.bucket || '',
        Key: this.getPath(path),
      };
      const res = await this.client.getObject(params).promise();
      return res.Body as Buffer;
    } catch (e) {
      console.log('error while reading file ==> ', e);
      return null;
    }
  }

  /**
   * Get file base64 stored at the specified path.
   *
   * @param path
   */
  async getBase64(path: string): Promise<string | null> {
    try {
      const params = {
        Bucket: this.config.bucket || '',
        Key: this.getPath(path),
      };
      const res = await this.client.getObject(params).promise();
      const base64Image = (res.Body as Buffer).toString('base64');
      const extension = path.split('.').pop();
      let contentType = res.ContentType || 'application/octet-stream';
      if (!res.ContentType) {
        switch (extension) {
          case 'jpg':
          case 'jpeg':
            contentType = 'image/jpeg';
            break;
          case 'png':
            contentType = 'image/png';
            break;
          case 'gif':
            contentType = 'image/gif';
            break;
        }
      }
      return `data:${contentType};base64,${base64Image}`;
    } catch (e) {
      console.log('Error while reading file ==> ', e);
      return null;
    }
  }

  /**
   * Check if file exists at the path.
   *
   * @param path
   */
  async exists(path: string): Promise<boolean> {
    const meta = await this.meta(path);
    return Object.keys(meta).length > 0;
  }

  /**
   * Get object's metadata
   * @param path
   */
  async meta(path: string): Promise<StorageDriver$FileMetadataResponse> {
    const params = {
      Bucket: this.config.bucket,
      Key: this.getPath(path),
    };

    try {
      const res = await this.client.headObject(params as HeadObjectRequest).promise();
      return {
        path: this.getPath(path),
        contentType: res.ContentType,
        contentLength: res.ContentLength,
        lastModified: res.LastModified,
      };
    } catch (e) {
      return {};
    }
  }

  /**
   * Check if file is missing at the path.
   *
   * @param path
   */
  async missing(path: string): Promise<boolean> {
    const meta = await this.meta(this.getPath(path));
    return Object.keys(meta).length === 0;
  }

  /**
   * Get URL for path mentioned.
   *
   * @param path
   */
  url(path: string): string {
    return this.signedUrl(this.getPath(path), 20).split('?')[0];
  }

  /**
   * Delete file at the given path.
   *
   * @param path
   */
  async delete(path: string): Promise<boolean> {
    const params = {
      Bucket: this.config.bucket || '',
      Key: this.getPath(path),
    };
    try {
      await this.client.deleteObject(params).promise();
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Copy file internally in the same disk
   *
   * @param path
   * @param newPath
   */
  async copy(path: string, newPath: string): Promise<StorageDriver$RenameFileResponse> {
    await this.client
      .copyObject({
        Bucket: this.config.bucket || '',
        CopySource: this.config.bucket + '/' + this.getPath(path),
        Key: newPath,
      })
      .promise();
    return { path: newPath, url: this.url(newPath) };
  }

  /**
   * Move file internally in the same disk
   *
   * @param path
   * @param newPath
   */
  async move(path: string, newPath: string): Promise<StorageDriver$RenameFileResponse> {
    await this.copy(this.getPath(path), newPath);
    await this.delete(this.getPath(path));
    return { path: newPath, url: this.url(newPath) };
  }

  /**
   * Get instance of driver's client.
   */
  getClient(): S3 {
    return this.client;
  }

  /**
   * Get config of the driver's instance.
   */
  getConfig(): Record<string, any> {
    return this.config;
  }

  /**
   * Get path of the driver's instance.
   */
  getPath(path: string): string {
    return this.config.basePath ? `${this.config.basePath}/${path}` : path;
  }
}
