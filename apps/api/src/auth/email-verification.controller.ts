import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CurrentUser, EmailVerificationService, Public } from '@nestjs/authentication';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { emailVerificationSchema } from '@repo/schemas';
import type { User } from '@repo/schemas';
import { EmailVerificationDto } from './dto/email-verification.dto.js';
import { EmailVerificationResponseDto } from './dto/email-verification-response.dto.js';

@ApiTags('Auth')
@Controller('auth/email')
export class EmailVerificationController {
  constructor(private readonly emailVerificationService: EmailVerificationService) {}

  @Public()
  @ApiOperation({ summary: 'Verify user email' })
  @ApiBadRequestResponse({
    description: 'Invalid or expired link',
    example: new BadRequestException('Invalid or expired link').getResponse(),
  })
  @ApiOkResponse({
    description: 'Email verified successfully',
    type: EmailVerificationResponseDto,
  })
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body({ schema: emailVerificationSchema }) { token }: EmailVerificationDto) {
    const verified = await this.emailVerificationService.verify(token);

    if (!verified) {
      throw new BadRequestException('Invalid or expired link');
    }

    return { email: verified.email, verified: true };
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: "Send the link again, to the signed-in customer's current address" })
  @ApiConflictResponse({
    description: 'Email is already verified',
    example: new ConflictException('Email is already verified').getResponse(),
  })
  @ApiAcceptedResponse({
    description: 'Verification link resent successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: { message: 'Unauthorized', statusCode: 401 },
  })
  @Post('verification')
  @HttpCode(HttpStatus.ACCEPTED)
  async resend(@CurrentUser() user: User) {
    if (user.emailVerified) {
      throw new ConflictException('Email is already verified');
    }

    await this.emailVerificationService.send({ ...user, id: String(user.id) });
  }
}
