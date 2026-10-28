import { Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { Public, SignInService } from '@nestjs/authentication';
import {
  ApiTags,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class SessionsController {
  constructor(private readonly signInService: SignInService) {}

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Sign out the current user' })
  @ApiNoContentResponse({ description: 'Successfully signed out' })
  @ApiUnauthorizedResponse({
    description: 'No active session found',
    example: new UnauthorizedException().getResponse(),
  })
  @Post('sign-out')
  async signOut() {
    const result = await this.signInService.signOut();

    // No session cookie found, throw an unauthorized exception if sign-out failed
    if (!result) throw new UnauthorizedException();
  }
}
