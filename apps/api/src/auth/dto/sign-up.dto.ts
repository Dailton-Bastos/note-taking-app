import { ApiProperty } from '@nestjs/swagger';
import type { IssuedSession, SessionRecord } from '@nestjs/authentication';

export class ValidationErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: ['email: Invalid email address'] })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class SignUpResponseDto {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SignInResponseDto implements IssuedSession {
  session: SessionRecord;
  token: string;
  cookie: string;
}
