import { ApiProperty } from '@nestjs/swagger';

export class AuthInputValidationDto {
  @ApiProperty({ example: ['email: Invalid email address'] })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}
