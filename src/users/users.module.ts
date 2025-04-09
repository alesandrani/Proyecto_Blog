import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ secret: 'your-jwt-secret', signOptions: { expiresIn: '1h' } })],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
