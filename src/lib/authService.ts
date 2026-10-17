import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

export const EMAIL_MAX_LENGTH = 100;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 64;

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function validateCredentials(
  email: string,
  password: string,
  isRegistration = false
): string | null {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return 'Please enter your email address.';
  }

  if (trimmedEmail.length > EMAIL_MAX_LENGTH) {
    return `Email address must not exceed ${EMAIL_MAX_LENGTH} characters.`;
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return 'Please enter a valid email address format.';
  }

  if (!password) {
    return 'Please enter your password.';
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must not exceed ${PASSWORD_MAX_LENGTH} characters.`;
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
  }

  if (password.trim().length === 0) {
    return 'Password cannot consist solely of whitespace spaces.';
  }

  if (isRegistration && password.trim().length < PASSWORD_MIN_LENGTH) {
    return `Password must contain at least ${PASSWORD_MIN_LENGTH} non-space characters.`;
  }

  return null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function formatAuthError(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    // Group non-existent, wrong password, and disabled user errors to prevent user enumeration (CWE-200)
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/user-disabled':
      return 'Invalid email or password. Please verify your credentials.';

    case 'auth/email-already-in-use':
      return 'An account with this email address already exists.';

    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';

    case 'auth/configuration-not-found':
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Console yet. Enable it under Authentication > Sign-in method.';

    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';

    case 'auth/too-many-requests':
      return 'Access temporarily restricted due to many failed attempts. Please try again later.';

    default:
      return 'Authentication failed. Please verify your credentials and try again.';
  }
}

export async function loginUser(email: string, password: string): Promise<User> {
  if (!isFirebaseConfigured) {
    throw new Error('Database / Auth service is not configured.');
  }

  const validationError = validateCredentials(email, password, false);
  if (validationError) {
    throw new Error(validationError);
  }

  const sanitizedEmail = normalizeEmail(email);
  const userCredential = await signInWithEmailAndPassword(
    auth,
    sanitizedEmail,
    password
  );
  return userCredential.user;
}

export async function registerUser(email: string, password: string): Promise<User> {
  if (!isFirebaseConfigured) {
    throw new Error('Database / Auth service is not configured.');
  }

  const validationError = validateCredentials(email, password, true);
  if (validationError) {
    throw new Error(validationError);
  }

  const sanitizedEmail = normalizeEmail(email);
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    sanitizedEmail,
    password
  );
  return userCredential.user;
}

export async function logoutUser(): Promise<void> {
  if (!isFirebaseConfigured) return;
  await signOut(auth);
}

export function subscribeToAuthState(
  callback: (user: User | null) => void
): () => void {
  if (!isFirebaseConfigured) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
