import { Controller, ConflictException, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { Public } from '@nestjs/authentication';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { type SignUpDto, signUpSchema } from '@repo/schemas';
import { CredentialsService } from './credentials.service.js';
import { ValidationErrorSignUpResponseDto, SignUpResponseDto } from './dto/sign-up.dto.js';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully registered.',
    type: SignUpResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data.',
    type: ValidationErrorSignUpResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email is already in use.',
    example: new ConflictException('Email is already in use').getResponse(),
  })
  async signUp(@Body({ schema: signUpSchema }) { email, password }: SignUpDto) {
    return this.credentialsService.register({ email, password });
  }
}
