import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    required: false,
    default: 10,
    minimum: 1,
    description: 'The amount of items to retrieve',
  })
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number) // The same as having transformOptions: { enableImplicitConversion: true } in main.ts
  limit?: number;

  @ApiProperty({
    required: false,
    default: 0,
    minimum: 0,
    description: 'The amount of items to skip',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
