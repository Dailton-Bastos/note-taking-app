import type { User } from '@repo/schemas';

declare module '@nestjs/authentication' {
  interface AuthenticationTypes {
    user: User;
  }
}
