//Pipe executes the validation of size, number file and dto metadata files

import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';
import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common/pipes';

@Injectable()
export class CustomParseFilePipe implements PipeTransform {
  private readonly parseFilePipe: ParseFilePipe;
  private readonly isFileArray: boolean;
  private readonly maxFileCount: number;
  private readonly fileIsRequired: boolean;

  constructor(
    fileType?: string | RegExp,
    maxSize?: number,
    maxFileCount?: number,
    isFileArray = false,
    fileIsRequired = true,
  ) {
    const validators = [
      ...(fileType ? [new FileTypeValidator({ fileType })] : []),
      ...(maxSize
        ? [
            new MaxFileSizeValidator({
              maxSize,
              message: `Please make sure the size of the file you upload does not exceed ${maxSize / 1024}KB.`,
            }),
          ]
        : []),
    ];

    this.parseFilePipe = new ParseFilePipe({ validators, fileIsRequired });
    this.isFileArray = isFileArray;
    this.maxFileCount = maxFileCount;
    this.fileIsRequired = fileIsRequired;
  }

  async transform(value: any) {
    if (this.fileIsRequired) {
      if (!value) {
        throw new BadRequestException(this.isFileArray ? 'Files are required' : 'File is required');
      }
    } else {
      if (!value) {
        return;
      }
    }

    const files = this.isFileArray ? value : [value];
    if (files.length > this.maxFileCount) {
      throw new BadRequestException(`The number of uploaded files must be less than or equal to ${this.maxFileCount} `);
    }

    for (const file of files) {
      try {
        file.originalname = Buffer.from(file.originalname, 'binary').toString('utf8');
        const lastDotIndex = file.originalname.lastIndexOf('.');
        file.filename = file.originalname.substring(0, lastDotIndex);
        file.path = encodeURIComponent(`${new Date().getTime()}_${file.originalname}`);
        await this.parseFilePipe.transform(file);
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw new BadRequestException(error.message || 'File is invalid');
        }
        throw error;
      }
    }

    return value;
  }
}
