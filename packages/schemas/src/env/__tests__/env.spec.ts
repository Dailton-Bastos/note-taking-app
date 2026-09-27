import { validationApiSchema } from '../';
import { describe, it, expect } from 'vitest';

describe('validationApiSchema', () => {
  it('should have default values', () => {
    const parsed = validationApiSchema.parse({
      POSTGRES_URL: 'postgres://user:password@localhost:5432/db',
    });
    expect(parsed.NODE_ENV).toBe('development');
    expect(parsed.PORT).toBe(3000);
  });

  it('should parse custom values correctly', () => {
    const parsed = validationApiSchema.parse({
      NODE_ENV: 'production',
      PORT: 4000,
      POSTGRES_URL: 'postgres://user:password@localhost:5432/db',
    });
    expect(parsed.NODE_ENV).toBe('production');
    expect(parsed.PORT).toBe(4000);
    expect(parsed.POSTGRES_URL).toBe('postgres://user:password@localhost:5432/db');
  });

  it('should throw an error for invalid values', () => {
    expect(() =>
      validationApiSchema.parse({
        NODE_ENV: 'invalid',
        PORT: 'not-a-number',
        POSTGRES_URL: 'invalid-url',
      }),
    ).toThrow();
  });
});
