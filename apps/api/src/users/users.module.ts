import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { MeController } from './me.controller.js';

@Module({
  providers: [UsersRepository],
  exports: [UsersRepository],
  controllers: [MeController],
})
export class UsersModule {}
