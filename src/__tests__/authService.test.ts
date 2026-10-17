import {
  validateCredentials,
  normalizeEmail,
  formatAuthError,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from '@/lib/authService';

describe('authService', () => {
  test('validateCredentials accepts valid email and password', () => {
    expect(validateCredentials('user@example.com', 'secret123')).toBeNull();
  });

  test('validateCredentials rejects empty or malformed emails and emails over max length', () => {
    expect(validateCredentials('   ', 'secret123')).toBe(
      'Please enter your email address.',
    );
    expect(validateCredentials('not-an-email', 'secret123')).toBe(
      'Please enter a valid email address format.',
    );
    const longEmail = `${'a'.repeat(EMAIL_MAX_LENGTH)}@example.com`;
    expect(validateCredentials(longEmail, 'secret123')).toBe(
      `Email address must not exceed ${EMAIL_MAX_LENGTH} characters.`,
    );
  });

  test('validateCredentials enforces password min/max length and rejects whitespace-only passwords', () => {
    expect(validateCredentials('user@example.com', '12345')).toBe(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
    );
    expect(
      validateCredentials(
        'user@example.com',
        'a'.repeat(PASSWORD_MAX_LENGTH + 1),
      ),
    ).toBe(`Password must not exceed ${PASSWORD_MAX_LENGTH} characters.`);
    expect(validateCredentials('user@example.com', '      ')).toBe(
      'Password cannot consist solely of whitespace spaces.',
    );
    expect(validateCredentials('user@example.com', '   abc   ', true)).toBe(
      `Password must contain at least ${PASSWORD_MIN_LENGTH} non-space characters.`,
    );
  });

  test('normalizeEmail trims and lowercases email', () => {
    expect(normalizeEmail('  User@Example.COM ')).toBe('user@example.com');
  });

  test('formatAuthError returns generic message for login failures to prevent user enumeration', () => {
    const expected = 'Invalid email or password. Please verify your credentials.';
    expect(formatAuthError('auth/user-not-found')).toBe(expected);
    expect(formatAuthError('auth/wrong-password')).toBe(expected);
    expect(formatAuthError('auth/invalid-credential')).toBe(expected);
    expect(formatAuthError('auth/user-disabled')).toBe(expected);
  });
});
