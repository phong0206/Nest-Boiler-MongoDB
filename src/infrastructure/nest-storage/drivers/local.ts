import {
  DiskOptions,
  StorageDriver,
  StorageDriver$FileMetadataResponse,
  StorageDriver$PutFileResponse,
  StorageDriver$RenameFileResponse,
} from '../interfaces';
import { join } from 'path';
import * as fs from 'fs-extra';

export class Local implements StorageDriver {
  constructor(
    private disk: string,
    private config: DiskOptions,
  ) {}

  /**
   * Put file content to the path specified.
   *
   * @param filePath
   * @param fileContent
   */
  async put(filePath: string, fileContent: any): Promise<StorageDriver$PutFileResponse> {
    await fs.outputFile(join(this.config.basePath || '', filePath), fileContent);
    return { path: join(this.config.basePath || '', filePath), url: '' };
  }

  /**
   * Get file stored at the specified path.
   *
   * @param filePath
   */
  async get(filePath: string): Promise<Buffer> {
    return fs.readFile(join(this.config.basePath || '', filePath));
  }

  /**
   * Get file base64 stored at the specified path.
   *
   * @param path
   */
  async getBase64(filePath: string): Promise<string | null> {
    try {
      const fileBuffer = await this.get(filePath);
      const base64File = fileBuffer.toString('base64');
      const extension = filePath.split('.').pop();
      let contentType = 'application/octet-stream';

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

      return `data:${contentType};base64,${base64File}`;
    } catch (e) {
      console.log('Error while reading file ==> ', e);
      return null;
    }
  }

  /**
   * Get object's metadata
   * @param filePath
   */
  async meta(filePath: string): Promise<StorageDriver$FileMetadataResponse> {
    const path = join(this.config.basePath || '', filePath);
    const res = await fs.stat(path);
    return {
      path,
      contentLength: res.size,
      lastModified: res.mtime,
    };
  }

  /**
   * Get Signed Urls
   * @param filePath
   * @param expire
   */
  signedUrl(filePath: string, expire = 10): string {
    return '';
  }

  /**
   * Check if file exists at the path.
   *
   * @param filePath
   */
  async exists(filePath: string): Promise<boolean> {
    return fs.pathExists(join(this.config.basePath || '', filePath));
  }

  /**
   * Check if file is missing at the path.
   *
   * @param filePath
   */
  async missing(filePath: string): Promise<boolean> {
    return !(await this.exists(filePath));
  }

  /**
   * Get URL for path mentioned.
   *
   * @param fileName
   */
  url(fileName: string) {
    if (this.config.hasOwnProperty('baseUrl')) {
      const filePath = join('public', fileName);
      return `${this.config.basePath}/${filePath}`;
    } else {
      return '';
    }
  }

  /**
   * Delete file at the given path.
   *
   * @param filePath
   */
  async delete(filePath: string): Promise<boolean> {
    try {
      await fs.remove(join(this.config.basePath || '', filePath));
    } catch (e) {}
    return true;
  }

  /**
   * Copy file internally in the same disk
   *
   * @param path
   * @param newPath
   */
  async copy(path: string, newPath: string): Promise<StorageDriver$RenameFileResponse> {
    const res = await fs.copy(join(this.config.basePath || '', path), join(this.config.basePath || '', newPath), {
      overwrite: true,
    });
    return {
      path: join(this.config.basePath || '', newPath),
      url: this.url(newPath),
    };
  }

  /**
   * Move file internally in the same disk
   *
   * @param path
   * @param newPath
   */
  async move(path: string, newPath: string): Promise<StorageDriver$RenameFileResponse> {
    await this.copy(path, newPath);
    await this.delete(path);
    return {
      path: join(this.config.basePath || '', newPath),
      url: this.url(newPath),
    };
  }

  /**
   * Get instance of driver's client.
   */
  getClient(): null {
    return null;
  }

  /**
   * Get config of the driver's instance.
   */
  getConfig(): Record<string, any> {
    return this.config;
  }
}
