import {
  addWeightLog,
  updateWeightLog,
  deleteWeightLog,
  WEIGHT_MIN,
  WEIGHT_MAX,
  EXERCISE_DETAILS_MAX_LENGTH,
} from '@/lib/weightService';
import { addDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

jest.mock('@/lib/firebase', () => ({
  isFirebaseConfigured: true,
  db: {},
  auth: {
    currentUser: {
      uid: 'user-123',
      email: 'test@example.com',
    },
  },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => 'mock-collection'),
  doc: jest.fn((_, __, id) => ({ id })),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  writeBatch: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-timestamp'),
}));

describe('weightService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('addWeightLog saves valid weight log for authenticated user', async () => {
    (addDoc as jest.Mock).mockResolvedValue({ id: 'new-log-id' });

    const id = await addWeightLog(75.5, '2026-10-17', true, ' 5km run ');

    expect(id).toBe('new-log-id');
    expect(addDoc).toHaveBeenCalledWith('mock-collection', {
      weight: 75.5,
      date: '2026-10-17',
      didExercise: true,
      exerciseDetails: '5km run',
      userId: 'user-123',
      userEmail: 'test@example.com',
      createdAt: 'mock-timestamp',
    });
  });

  test('addWeightLog rejects out-of-range weight, invalid date, or overly long exercise details', async () => {
    await expect(
      addWeightLog(WEIGHT_MIN - 1, '2026-10-17'),
    ).rejects.toThrow(/Weight must be a valid number/);

    await expect(
      addWeightLog(WEIGHT_MAX + 1, '2026-10-17'),
    ).rejects.toThrow(/Weight must be a valid number/);

    await expect(addWeightLog(75, '17-10-2026')).rejects.toThrow(
      /valid date in YYYY-MM-DD format/,
    );

    await expect(
      addWeightLog(
        75,
        '2026-10-17',
        true,
        'a'.repeat(EXERCISE_DETAILS_MAX_LENGTH + 1),
      ),
    ).rejects.toThrow(/Exercise details must not exceed/);
  });

  test('updateWeightLog and deleteWeightLog block modifications when user does not own the log', async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ userId: 'another-user' }),
    });

    await expect(
      updateWeightLog('log-1', {
        weight: 74,
        date: '2026-10-17',
        didExercise: false,
        exerciseDetails: '',
      }),
    ).rejects.toThrow(/Unauthorized/);

    await expect(deleteWeightLog('log-1')).rejects.toThrow(/Unauthorized/);
    expect(updateDoc).not.toHaveBeenCalled();
    expect(deleteDoc).not.toHaveBeenCalled();
  });

  test('deleteWeightLog deletes document when owned by current user', async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ userId: 'user-123' }),
    });

    await deleteWeightLog('log-1');
    expect(deleteDoc).toHaveBeenCalledWith({ id: 'log-1' });
  });
});
