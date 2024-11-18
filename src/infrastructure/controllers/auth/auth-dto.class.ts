import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ required: true })
  @Transform(({ value }) => value?.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;
}

export class AuthSignupDto {
  @ApiProperty({ required: true })
  @Transform(({ value }) => value?.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly name: string;
}

export class ResetPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
