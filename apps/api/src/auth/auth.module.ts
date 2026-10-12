import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';

@Module({
  imports: [UsersModule],
  providers: [CredentialsService],
  controllers: [AuthController],
})
export class AuthModule {}
