import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { Public } from '@nestjs/authentication';
import type { SignUpDto } from '@repo/schemas';
import { CredentialsService } from './credentials.service.js';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() { email, password }: SignUpDto) {
    return this.credentialsService.register({ email, password });
  }
}
