import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { SessionsModule } from '../sessions/sessions.module.js';
import { EmailVerificationMailer } from './email-verification.mailer.js';
import { EmailVerificationController } from './email-verification.controller.js';

@Module({
  imports: [UsersModule, SessionsModule],
  providers: [CredentialsService, EmailVerificationMailer],
  controllers: [AuthController, EmailVerificationController],
})
export class AuthModule {}
