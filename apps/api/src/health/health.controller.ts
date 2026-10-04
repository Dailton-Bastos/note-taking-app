import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseHealthIndicator } from '../database/database.health.js';
import { EnvService } from '../env/env.service.js';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly database: DatabaseHealthIndicator,
    private readonly envService: EnvService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // TODO: Add HTTP health check once the web URL is available
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          threshold: this.envService.get('HEALTH_DISK_THRESHOLD'),
        }),
      () => this.memory.checkHeap('memory_heap', this.envService.get('HEALTH_HEAP_THRESHOLD')),
      () => this.memory.checkRSS('memory_rss', this.envService.get('HEALTH_RSS_THRESHOLD')),
      () => this.database.pingCheck('database'),
    ]);
  }
}
