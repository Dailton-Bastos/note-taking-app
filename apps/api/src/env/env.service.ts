import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentApi } from '@repo/schemas';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<EnvironmentApi, true>) {}

  get<T extends keyof EnvironmentApi>(key: T): EnvironmentApi[T] {
    return this.configService.get(key, { infer: true });
  }
}
