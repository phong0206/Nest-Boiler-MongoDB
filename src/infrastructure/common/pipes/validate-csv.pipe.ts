import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { allowedCsvMimeTypes, MAX_CSV_FILE_SIZE } from '@common';

@Injectable()
export class CsvFileValidationPipe implements PipeTransform {
  private readonly maxFileSize: number;

  constructor(maxFileSize: number = MAX_CSV_FILE_SIZE) {
    this.maxFileSize = maxFileSize;
  }

  transform(file: any) {
    if (!file) {
      throw new BadRequestException('File not found.');
    }

    if (!allowedCsvMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('File format or data format in the file is incorrect.');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size is too large.');
    }

    return file;
  }
}
