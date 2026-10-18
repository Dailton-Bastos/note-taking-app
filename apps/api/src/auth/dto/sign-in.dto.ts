import type { IssuedSession } from '@nestjs/authentication';

export class SignInResponseDto implements IssuedSession {
  session: {
    id: string;
    userId: string;
    createdAt: Date;
    expiresAt: Date;
    lastActiveAt: Date;
  };
  token: string;
  cookie: string;
}
