import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
    @IsString()
    @IsOptional()
    summary?: string;

    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
}
