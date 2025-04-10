import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'The name of the user' })
  @IsString()
  @MinLength(2)
  name: string;

  // @ApiProperty({ example: 'Doe', description: 'The surname of the user' })
  // @IsString()
  // @MinLength(2)
  // surname: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  @IsString()
  @MinLength(6)
  password: string;
}
