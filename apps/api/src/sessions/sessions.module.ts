import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { SessionAuthProvider } from './session-auth.provider.js';
import { SessionAuthStore } from './session-auth.store.js';
import { SessionsRepository } from './sessions.repository.js';
import { SessionsController } from './sessions.controller.js';

@Module({
  imports: [UsersModule],
  providers: [SessionAuthProvider, SessionAuthStore, SessionsRepository],
  exports: [SessionsRepository],
  controllers: [SessionsController],
})
export class SessionsModule {}
