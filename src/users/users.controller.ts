import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Registro de usuario
  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(
      createUserDto.name,
      createUserDto.surname,
      createUserDto.email,
      createUserDto.password,
    );
  }

  // Crear usuario directamente en /users
  @Post()
  async createUserDirect(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(
      createUserDto.name,
      createUserDto.surname,
      createUserDto.email,
      createUserDto.password,
    );
  }

  // Login de usuario
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(loginUserDto.email, loginUserDto.password);
  }

  // Actualizar perfil de usuario
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: CreateUserDto,
  ) {
    return this.userService.updateUser(
      id,
      updateUserDto.name,
      updateUserDto.surname,
      updateUserDto.email,
    );
  }

  // Eliminar cuenta de usuario
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  // Obtener todos los usuarios (solo para fines de prueba)
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
