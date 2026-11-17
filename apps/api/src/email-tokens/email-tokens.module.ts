import { Module } from '@nestjs/common';
import { EmailTokenAuthStore } from './email-token-auth.store.js';
import { EmailTokenRepository } from './email-token.repository.js';

@Module({
  providers: [EmailTokenAuthStore, EmailTokenRepository],
})
export class EmailTokensModule {}
