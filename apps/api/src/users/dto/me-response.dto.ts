import type { User } from '@repo/schemas';

export class MeResponseDto implements User {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
