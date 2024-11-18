import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FormImagesDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: true })
  @IsNotEmpty()
  'images[]': string[];
}
