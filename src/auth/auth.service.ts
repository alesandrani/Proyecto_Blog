import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.prisma.usuario.findUnique({ where: { email } });
      if (user && bcrypt.compareSync(password, user.password)) {
        return user;
      }
      throw new UnauthorizedException('Invalid email or password');
    } catch (error) {
      throw new UnauthorizedException('Error validating user');
    }
  }

  async register(name: string, surname: string, email: string, password: string) {
    try {
      const existingUser = await this.prisma.usuario.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      return this.prisma.usuario.create({
        data: {
          name,
          surname,
          email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw new ConflictException('Error registering user');
    }
  }
}
