import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

const GENDERS = ['male', 'female', 'unisex', 'kid'];

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  readonly title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly price?: number;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly stock?: number;

  @IsString({ each: true })
  @IsArray()
  readonly sizes: string[];

  @IsString()
  @IsIn(GENDERS)
  readonly gender: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly tags: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly images: string[];
}
