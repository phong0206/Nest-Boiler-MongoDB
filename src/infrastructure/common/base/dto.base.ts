import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { FilterQuery, SortOrder } from 'mongoose';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +(value || 10))
  @ApiProperty({ description: 'Số item mỗi trang', example: '10', required: false })
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +(value || 1))
  @ApiProperty({ description: 'Số trang hiện tại', example: '1' })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value || '{}') : value))
  @ApiProperty({
    description: 'Sort theo field',
    example: '{ "createdAt": 1 }',
    type: 'string',
    required: false,
  })
  sort?: Record<string, SortOrder>;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value || '{}') : value))
  @ApiProperty({
    description: 'Filter theo field',
    example: '{ "name": "string" }',
    type: 'string',
    required: false,
  })
  filter?: FilterQuery<any>;

  @IsOptional()
  @ApiProperty({ description: 'Tìm kiếm', example: '', required: false })
  search?: string;
}

export class IPagination {
  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Total number of items' })
  total: number;
}
