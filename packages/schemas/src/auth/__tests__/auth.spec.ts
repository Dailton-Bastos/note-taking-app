import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';
import { signUpSchema } from '../index';

describe('signUpSchema', () => {
  it('should pass with valid data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123',
    };
    expect(() => signUpSchema.parse(validData)).not.toThrow();
  });

  it('should fail with invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'password123',
    };
    expect(() => signUpSchema.parse(invalidData)).toThrow(ZodError);
  });

  it('should fail with short password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'short',
    };
    expect(() => signUpSchema.parse(invalidData)).toThrow(ZodError);
  });
});
