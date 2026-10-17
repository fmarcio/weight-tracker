import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  writeBatch,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './firebase';
import { WeightEntry } from '@/types/weight';

const COLLECTION_NAME = 'weight_logs';
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const WEIGHT_MIN = 10;
export const WEIGHT_MAX = 500;
export const EXERCISE_DETAILS_MAX_LENGTH = 500;

function requireAuthenticatedUid(userId?: string): string {
  if (!isFirebaseConfigured) {
    throw new Error('Database is not configured.');
  }

  const uid = userId || auth.currentUser?.uid;
  if (!uid) {
    throw new Error('You must be logged in to perform this action.');
  }

  return uid;
}

function validateWeightInput(
  weight: number,
  date?: string,
  exerciseDetails?: string,
) {
  if (
    !Number.isFinite(weight) ||
    weight < WEIGHT_MIN ||
    weight > WEIGHT_MAX
  ) {
    throw new Error(
      `Weight must be a valid number between ${WEIGHT_MIN} and ${WEIGHT_MAX} kg.`,
    );
  }

  if (date !== undefined && !DATE_REGEX.test(date)) {
    throw new Error('Please provide a valid date in YYYY-MM-DD format.');
  }

  if (
    exerciseDetails !== undefined &&
    exerciseDetails.trim().length > EXERCISE_DETAILS_MAX_LENGTH
  ) {
    throw new Error(
      `Exercise details must not exceed ${EXERCISE_DETAILS_MAX_LENGTH} characters.`,
    );
  }
}

async function getVerifiedUserDocRef(id: string, uid: string) {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snap = await getDoc(docRef);

  if (!snap.exists() || snap.data().userId !== uid) {
    throw new Error('Unauthorized: You can only modify your own weight logs.');
  }

  return docRef;
}

export function subscribeToWeightLogs(
  onData: (logs: WeightEntry[]) => void,
  onError?: (error: Error) => void,
  userId?: string,
): Unsubscribe {
  const targetUid = userId || auth.currentUser?.uid;

  if (!isFirebaseConfigured || !targetUid) {
    onData([]);
    return () => {};
  }

  const logsQuery = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', targetUid),
  );

  return onSnapshot(
    logsQuery,
    (snapshot) => {
      const entries: WeightEntry[] = snapshot.docs
        .filter((docSnap) => docSnap.data().userId === targetUid)
        .map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            weight: data.weight,
            date: data.date,
            didExercise: Boolean(data.didExercise),
            exerciseDetails: data.exerciseDetails || '',
            userId: data.userId,
            userEmail: data.userEmail || undefined,
          };
        })
        .sort((a, b) => b.date.localeCompare(a.date));

      onData(entries);
    },
    (error) => {
      console.error(
        'Firestore subscription error:',
        error.code || error.message,
      );
      if (onError) onError(error);
    },
  );
}

export async function addWeightLog(
  weight: number,
  date: string,
  didExercise: boolean = false,
  exerciseDetails: string = '',
  userId?: string,
): Promise<string> {
  const currentUid = requireAuthenticatedUid(userId);
  validateWeightInput(weight, date, exerciseDetails);

  const currentEmail = auth.currentUser?.email
    ? auth.currentUser.email.trim().toLowerCase()
    : null;

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    weight,
    date,
    didExercise: Boolean(didExercise),
    exerciseDetails: didExercise
      ? exerciseDetails.trim().slice(0, EXERCISE_DETAILS_MAX_LENGTH)
      : '',
    userId: currentUid,
    userEmail: currentEmail,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function deleteWeightLog(id: string): Promise<void> {
  const currentUid = requireAuthenticatedUid();
  const docRef = await getVerifiedUserDocRef(id, currentUid);
  await deleteDoc(docRef);
}

export async function updateWeightLog(
  id: string,
  updates: {
    weight: number;
    date?: string;
    didExercise: boolean;
    exerciseDetails: string;
  },
): Promise<void> {
  const currentUid = requireAuthenticatedUid();
  validateWeightInput(updates.weight, updates.date, updates.exerciseDetails);

  const docRef = await getVerifiedUserDocRef(id, currentUid);

  await updateDoc(docRef, {
    weight: updates.weight,
    ...(updates.date ? { date: updates.date } : {}),
    didExercise: Boolean(updates.didExercise),
    exerciseDetails: updates.didExercise
      ? updates.exerciseDetails.trim().slice(0, EXERCISE_DETAILS_MAX_LENGTH)
      : '',
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMultipleWeightLogs(ids: string[]): Promise<void> {
  const currentUid = requireAuthenticatedUid();
  if (!ids || ids.length === 0) return;

  const BATCH_SIZE = 500;
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const chunk = ids.slice(i, i + BATCH_SIZE);
    const snaps = await Promise.all(
      chunk.map((id) => getDoc(doc(db, COLLECTION_NAME, id))),
    );

    const batch = writeBatch(db);
    let ownedCount = 0;

    snaps.forEach((snap) => {
      if (snap.exists() && snap.data().userId === currentUid) {
        batch.delete(snap.ref);
        ownedCount++;
      }
    });

    if (ownedCount > 0) {
      await batch.commit();
    }
  }
}
