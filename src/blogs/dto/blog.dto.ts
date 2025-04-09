import { IsString, IsNotEmpty } from 'class-validator';

export class BlogDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
