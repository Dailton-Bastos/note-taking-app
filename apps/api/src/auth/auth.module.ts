import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { SessionsModule } from '../sessions/sessions.module.js';

@Module({
  imports: [UsersModule, SessionsModule],
  providers: [CredentialsService],
  controllers: [AuthController],
})
export class AuthModule {}
