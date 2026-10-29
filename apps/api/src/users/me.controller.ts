import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import {
  ApiTags,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import type { User } from '@repo/schemas';
import { MeResponseDto } from './dto/me-response.dto.js';

@ApiTags('Me')
@Controller('me')
export class MeController {
  @Get()
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOkResponse({ description: 'User retrieved successfully', type: MeResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: { message: 'Unauthorized', statusCode: 401 },
  })
  getMe(@CurrentUser() user: User): MeResponseDto {
    return user;
  }
}
