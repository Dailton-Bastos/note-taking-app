import { Injectable } from '@nestjs/common';
import {
  type EmailVerificationLink,
  AuthenticationRegistry,
  EmailVerificationHandler,
} from '@nestjs/authentication';
import { type Mailable, Mailer } from '@nestjs/mail';

@Injectable()
export class VerifyEmailMail implements Mailable<EmailVerificationLink> {
  render({ url }: EmailVerificationLink) {
    return {
      subject: 'Confirm your email address',
      template: 'verify-email',
      context: { url },
    };
  }
}

@Injectable()
export class EmailVerificationMailer extends EmailVerificationHandler {
  constructor(
    private readonly mailer: Mailer,
    registry: AuthenticationRegistry,
  ) {
    super();
    registry.registerHandler('emailVerification', this);
  }

  async send(link: EmailVerificationLink): Promise<void> {
    await this.mailer.send(VerifyEmailMail, { to: link.email, data: link });
  }

  markVerified(): boolean {
    // TODO: Implement logic to mark the email as verified in the database or authentication system.
    return true;
  }

  isVerified(): boolean {
    // TODO: Implement logic to check if the email is verified in the database or authentication system.
    return false;
  }
}
