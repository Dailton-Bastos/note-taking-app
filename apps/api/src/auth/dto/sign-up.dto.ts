import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorSignUpResponseDto {
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
