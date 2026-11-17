import type { User } from '@repo/schemas';

export class MeResponseDto implements User {
  id: number;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
