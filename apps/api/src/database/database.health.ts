import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { InjectDrizzle } from '@nestjs/drizzle';
import { sql } from 'drizzle-orm';
import type { Database } from './database.js';

@Injectable()
export class DatabaseHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    @InjectDrizzle()
    private readonly database: Database,
  ) {}

  async pingCheck(key: string) {
    return this.healthIndicatorService
      .check(key)
      .attempt(async () => {
        await this.database.execute(sql`SELECT 1`);
      })
      .withTimeout(1500)
      .cacheFor(5000);
  }
}
