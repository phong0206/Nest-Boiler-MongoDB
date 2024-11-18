import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

export function ApiFile($ref: any, fieldName = 'file') {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(FileInterceptor(fieldName)),
    ApiBody({
      type: $ref,
      required: true,
    }),
    ApiOperation({ description: 'Upload file.' }),
  );
}
