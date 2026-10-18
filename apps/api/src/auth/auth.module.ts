import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { SessionAuthProvider } from './session-auth.provider.js';

@Module({
  imports: [UsersModule],
  providers: [CredentialsService, SessionAuthProvider],
  controllers: [AuthController],
})
export class AuthModule {}
