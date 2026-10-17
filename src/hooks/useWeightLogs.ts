'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isFirebaseConfigured } from '@/lib/firebase';
import { subscribeToWeightLogs } from '@/lib/weightService';
import { WeightEntry } from '@/types/weight';

interface LogsState {
  uid: string | undefined;
  logs: WeightEntry[];
}

export function useWeightLogs() {
  const { user } = useAuth();
  const currentUid = user?.uid;

  const [state, setState] = useState<LogsState>({
    uid: undefined,
    logs: [],
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !currentUid) {
      return;
    }

    const unsubscribe = subscribeToWeightLogs(
      (newLogs) => {
        setState({ uid: currentUid, logs: newLogs });
        setErrorMessage(null);
      },
      () => {
        setState((prev) => ({
          uid: currentUid,
          logs: prev.uid === currentUid ? prev.logs : [],
        }));
        setErrorMessage(
          'Unable to load weight logs. Please check your network connection or try again.',
        );
      },
      currentUid,
    );

    return () => unsubscribe();
  }, [currentUid]);

  const isActiveUser = Boolean(isFirebaseConfigured && currentUid);
  const logs = isActiveUser && state.uid === currentUid ? state.logs : [];
  const isLoading = isActiveUser && state.uid !== currentUid;

  return {
    logs,
    isLoading,
    errorMessage,
    setErrorMessage,
    currentUid,
  };
}
