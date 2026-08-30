import { useCallback, useEffect, useState } from 'react';
import { WORLD_MINUTE_REAL_MS } from '../game/constants';
import { getPocketWorldDate } from '../game/worldTime';
import type { SimulationSpeed } from '../types/world';

const STORAGE_KEY = 'pocket-pals-world-clock-v1';
type StoredClock = { totalMinutes: number; lastRealTimestamp: number; speed: SimulationSpeed };
let sharedClock: StoredClock | null = null;
const subscribers = new Set<(clock: StoredClock) => void>();
let timer: number | undefined;
const getSharedClock = () => sharedClock ?? (sharedClock = readClock());
function publish(next: StoredClock, persist = true) { sharedClock = next; if (persist) localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); subscribers.forEach((listener) => listener(next)); }
function startClock() {
  if (timer !== undefined) return;
  let lastPersist = Date.now();
  timer = window.setInterval(() => { const current = getSharedClock(); const now = Date.now(); const elapsed = Math.max(0, now - current.lastRealTimestamp); const visibleMinutes = document.visibilityState === 'visible' ? elapsed * current.speed / WORLD_MINUTE_REAL_MS : elapsed / WORLD_MINUTE_REAL_MS; const shouldPersist = now - lastPersist >= 1_000; if (shouldPersist) lastPersist = now; publish({ ...current, totalMinutes: current.totalMinutes + visibleMinutes, lastRealTimestamp: now }, shouldPersist); }, 100);
}

function validSpeed(value: unknown): SimulationSpeed { return value === 2 || value === 4 || value === 8 ? value : 1; }
function readClock(): StoredClock {
  const now = Date.now();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as Partial<StoredClock> | null;
    const totalMinutes = typeof saved?.totalMinutes === 'number' ? saved.totalMinutes : 0;
    const lastRealTimestamp = typeof saved?.lastRealTimestamp === 'number' ? saved.lastRealTimestamp : now;
    return { totalMinutes: totalMinutes + Math.max(0, now - lastRealTimestamp) / WORLD_MINUTE_REAL_MS, lastRealTimestamp: now, speed: validSpeed(saved?.speed) };
  } catch { return { totalMinutes: 0, lastRealTimestamp: now, speed: 1 }; }
}

export function getPersistedWorldMinutes() { return readClock().totalMinutes; }

export function useWorldClock() {
  const [clock, setClock] = useState<StoredClock>(getSharedClock);
  const setSpeed = useCallback((speed: SimulationSpeed) => { const current = getSharedClock(); publish({ ...current, speed }); }, []);
  useEffect(() => {
    const listener = (next: StoredClock) => setClock(next);
    subscribers.add(listener); startClock();
    const persist = () => { const current = getSharedClock(); const now = Date.now(); publish({ ...current, totalMinutes: current.totalMinutes + Math.max(0, now - current.lastRealTimestamp) / WORLD_MINUTE_REAL_MS, lastRealTimestamp: now }); };
    document.addEventListener('visibilitychange', persist);
    window.addEventListener('pagehide', persist);
    return () => { subscribers.delete(listener); document.removeEventListener('visibilitychange', persist); window.removeEventListener('pagehide', persist); };
  }, []);
  return { ...clock, date: getPocketWorldDate(clock.totalMinutes), setSpeed };
}
