import { Injectable } from '@nestjs/common';
import {
  type EmailTokenStore,
  EmailTokenPurpose,
  EmailTokenRecord,
  AuthenticationStorage,
} from '@nestjs/authentication';
import { EmailTokenRepository } from './email-token.repository.js';

@Injectable()
export class EmailTokenAuthStore implements EmailTokenStore {
  constructor(
    private readonly emailTokenRepository: EmailTokenRepository,
    storage: AuthenticationStorage,
  ) {
    storage.registerSource({ emailTokens: this });
  }

  async saveEmailToken(record: EmailTokenRecord): Promise<void> {
    await this.emailTokenRepository.saveEmailToken(record);
  }

  async consumeEmailToken(
    id: string,
    purpose: EmailTokenPurpose,
  ): Promise<EmailTokenRecord | undefined> {
    return this.emailTokenRepository.consumeEmailToken(id, purpose);
  }

  async deleteUserEmailTokens(userId: string, purpose: EmailTokenPurpose): Promise<void> {
    await this.emailTokenRepository.deleteUserEmailTokens(userId, purpose);
  }
}
