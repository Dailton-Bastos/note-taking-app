import { validate } from '../env.validation';
import { describe, it, expect } from 'vitest';

describe('validate', () => {
  it('should validate environment variables correctly', () => {
    const env = {
      NODE_ENV: 'development',
      PORT: 3000,
      POSTGRES_URL: 'postgres://user:password@localhost:5432/db',
      APP_URL: 'http://localhost:5173',
      MAIL_FROM: 'no-reply@example.com',
      SMTP_URL: 'smtp://user:password@smtp.example.com:587',
    };
    const result = validate(env);
    expect(result.NODE_ENV).toBe('development');
    expect(result.PORT).toBe(3000);
    expect(result.POSTGRES_URL).toBe('postgres://user:password@localhost:5432/db');
  });

  it('should throw an error for invalid environment variables', () => {
    const env = {
      NODE_ENV: 'invalid',
      PORT: 'not-a-number',
      POSTGRES_URL: 'invalid-url',
      SMTP_URL: 'invalid-smtp-url',
    };
    expect(() => validate(env)).toThrow();
  });
});
