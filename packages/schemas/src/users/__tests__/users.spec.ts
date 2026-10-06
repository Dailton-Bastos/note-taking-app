import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';
import { userSchema } from '../index';

describe('userSchema', () => {
  it('should validate a correct user object', () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(() => userSchema.parse(user)).not.toThrow();
  });

  it('should throw an error for an invalid user object', () => {
    const user = {
      id: 'not-a-number',
      email: 'invalid-email',
      createdAt: 'not-a-date',
      updatedAt: 'not-a-date',
    };
    expect(() => userSchema.parse(user)).toThrow(ZodError);
  });
});
