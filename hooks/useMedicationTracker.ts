import { useState, useEffect, useCallback } from 'react';

const INTERVAL_HOURS = 6;
const INTERVAL_MS = INTERVAL_HOURS * 60 * 60 * 1000;

export interface MedicationState {
  isAvailable: boolean;
  timeRemaining: number; // in ms
  lastTaken: number | null;
  takeMedication: () => void;
  resetMedication: () => void;
}

export const useMedicationTracker = (storageKey: string): MedicationState => {
  // Initialize state from localStorage
  const [lastTaken, setLastTaken] = useState<number | null>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? parseInt(stored, 10) : null;
  });

  const [now, setNow] = useState(Date.now());

  // Update "now" every second to drive the countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update localStorage when lastTaken changes
  useEffect(() => {
    if (lastTaken !== null) {
      localStorage.setItem(storageKey, lastTaken.toString());
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [lastTaken, storageKey]);

  const takeMedication = useCallback(() => {
    setLastTaken(Date.now());
  }, []);

  const resetMedication = useCallback(() => {
    if (confirm("Voulez-vous vraiment réinitialiser le minuteur ?")) {
      setLastTaken(null);
    }
  }, []);

  // Calculate derived state
  const timeSince = lastTaken ? now - lastTaken : Infinity;
  const isAvailable = timeSince >= INTERVAL_MS;
  const timeRemaining = Math.max(0, INTERVAL_MS - timeSince);

  return {
    isAvailable,
    timeRemaining,
    lastTaken,
    takeMedication,
    resetMedication,
  };
};