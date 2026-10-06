import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '../database/schema/index.js';
import type { User } from '@repo/schemas';
import type { Database } from '../database/database.js';

@Injectable()
export class UsersRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async findByEmail({ email }: { email: string }): Promise<User | null> {
    const [user = null] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) return null;

    return user;
  }
}
