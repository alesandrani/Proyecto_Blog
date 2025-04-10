import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  // Registro de nuevos usuarios
  async createUser(name: string, email: string, password: string) {
    // Verificar si el usuario ya existe
    const userExists = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new Error('El correo electrónico ya está en uso');
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    const user = await this.prisma.usuario.create({
      data: {
        name,
        // surname,
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  // Inicio de sesión con generación de token JWT
  async loginUser(email: string, password: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Comparar la contraseña proporcionada con la almacenada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Generar token JWT
    const payload = { 
      sub: user.id,
      email: user.email,
      name: user.name
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  async updateUser(id: number, name: string, email: string) {
    // Verificar si el usuario existe
    const user = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si el nuevo email ya está en uso por otro usuario
    if (email !== user.email) {
      const emailExists = await this.prisma.usuario.findUnique({
        where: { email },
      });

      if (emailExists) {
        throw new Error('El correo electrónico ya está en uso');
      }
    }

    return this.prisma.usuario.update({
      where: { id },
      data: {
        name,
        // surname,
        email,
      },
      select: {
        id: true,
        name: true,
        // surname: true,
        email: true,
      },
    });
  }

  async deleteUser(id: number) {
    // Verificar si el usuario existe
    const user = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await this.prisma.usuario.delete({
      where: { id },
    });

    return { message: 'Usuario eliminado correctamente' };
  }

  async getAllUsers() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        name: true,
        // surname: true,
        email: true,
      },
    });
  }
}