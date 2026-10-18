import {
  Controller,
  ConflictException,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { Public, SignInService } from '@nestjs/authentication';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { type SignUpDto, SignInDto, signUpSchema, signInSchema } from '@repo/schemas';
import { CredentialsService } from './credentials.service.js';
import { SignUpResponseDto } from './dto/sign-up.dto.js';
import { SignInResponseDto } from './dto/sign-in.dto.js';
import { AuthInputValidationDto } from './dto/auth-input-validation.dto.js';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly credentialsService: CredentialsService,
    private readonly signInService: SignInService,
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully registered.',
    type: SignUpResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data.',
    type: AuthInputValidationDto,
  })
  @ApiConflictResponse({
    description: 'Email is already in use.',
    example: new ConflictException('Email is already in use').getResponse(),
  })
  async signUp(
    @Body({ schema: signUpSchema }) { email, password }: SignUpDto,
  ): Promise<SignUpResponseDto> {
    return this.credentialsService.register({ email, password });
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiOkResponse({
    description: 'The user has been successfully signed in.',
    type: SignInResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data.',
    type: AuthInputValidationDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Email or password is incorrect.',
    example: new UnauthorizedException('Email or password is incorrect').getResponse(),
  })
  async signIn(
    @Body({ schema: signInSchema }) { email, password }: SignInDto,
  ): Promise<SignInResponseDto> {
    const user = await this.credentialsService.verify({ email, password });

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    return this.signInService.signIn(String(user.id), { method: 'password' });
  }
}
