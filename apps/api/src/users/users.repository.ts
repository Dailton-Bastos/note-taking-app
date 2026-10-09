import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { eq } from 'drizzle-orm';
import type { User, SignUpDto } from '@repo/schemas';
import type { Database } from '../database/database.js';
import { users } from '../database/schema/index.js';

@Injectable()
export class UsersRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async findByEmail({ email }: { email: string }): Promise<User | null> {
    const [user = null] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) return null;

    return user;
  }

  async create({ email, password }: SignUpDto): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values({ email, password })
      .onConflictDoNothing()
      .returning();

    if (!user) throw new Error('User could not be created');

    return user;
  }
}
