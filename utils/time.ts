/**
 * Formats milliseconds into a HH:MM:SS string.
 */
export const formatTimeRemaining = (ms: number): string => {
  if (ms <= 0) return "00:00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Returns a readable string for the next available time.
 */
export const getNextAvailableTime = (lastTakenTimestamp: number, durationMs: number): string => {
  const nextTime = new Date(lastTakenTimestamp + durationMs);
  return nextTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};