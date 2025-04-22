import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class BlogDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    summary: string;

    @IsBoolean()
    isPublic: boolean;

    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @IsString()
    @IsOptional()
    imageUrl?: string;
}
