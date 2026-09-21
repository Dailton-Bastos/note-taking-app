import { validate } from '../env.validation';
import { describe, it, expect } from 'vitest';

describe('validate', () => {
  it('should validate environment variables correctly', () => {
    const env = { NODE_ENV: 'development', PORT: 3000 };
    const result = validate(env);
    expect(result.NODE_ENV).toBe('development');
    expect(result.PORT).toBe(3000);
  });

  it('should throw an error for invalid environment variables', () => {
    const env = { NODE_ENV: 'invalid', PORT: 'not-a-number' };
    expect(() => validate(env)).toThrow();
  });
});
