import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { SessionAuthProvider } from './session-auth.provider.js';
import { SessionAuthStore } from './session-auth.store.js';

@Module({
  imports: [UsersModule],
  providers: [SessionAuthProvider, SessionAuthStore],
})
export class SessionsModule {}
