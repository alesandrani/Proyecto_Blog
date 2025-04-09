import { IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterPostDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  blogId?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;
}
