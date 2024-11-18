import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';

export function ApiFiles($ref: any, fieldName = 'files[]') {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(FilesInterceptor(fieldName)),
    ApiBody({
      type: $ref,
      required: true,
    }),
    ApiOperation({ description: 'Upload files' }),
  );
}
