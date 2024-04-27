import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export const GENDERS = ['male', 'female', 'unisex', 'kid'];

export class CreateProductDto {
  @ApiProperty({
    description: 'The title of the product',
    example: 'Nike Air Max 90',
    required: true,
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  readonly title: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 100.0,
    required: false,
    // type: 'number',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly price?: number;

  @ApiProperty({
    description: 'The description of the product',
    example: 'The best sneakers in the market',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    description: 'The slug of the product',
    example: 'nike-air-max-90',
    required: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'The stock of the product',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly stock?: number;

  @ApiProperty({
    description: 'The sizes available for the product',
    example: ['S', 'M', 'L'],
    required: true,
    type: 'array',
  })
  @IsString({ each: true })
  @IsArray()
  readonly sizes: string[];

  @ApiProperty({
    example: 'male',
    description: 'The gender of the product',
    enum: GENDERS,
  })
  @IsString()
  @IsIn(GENDERS)
  readonly gender: string;

  @ApiProperty({
    description: 'The category of the product',
    example: '[sneakers, shoes]',
    required: true,
    type: 'array',
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly tags: string[];

  @ApiProperty({
    description: 'The images of the product',
    example: ['image1.jpg', 'image2.jpg'],
    required: false,
    type: 'array',
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly images: string[];
}
