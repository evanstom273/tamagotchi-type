import { useCallback, useEffect, useState } from 'react';
import { feed, play, clean, toggleSleep } from '../game/actions';
import { progressPet, createPet } from '../game/simulation';
import type { PetState } from '../types/pet';

const STORAGE_KEY = 'pocket-pals-pet-v1';

export function usePet() {
  const [pet, setPet] = useState<PetState | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    try { return progressPet(JSON.parse(saved) as PetState); } catch { return null; }
  });
  const [message, setMessage] = useState('');

  useEffect(() => { if (pet) localStorage.setItem(STORAGE_KEY, JSON.stringify(pet)); }, [pet]);
  useEffect(() => {
    if (!pet) return;
    const interval = window.setInterval(() => setPet((current) => current ? progressPet(current) : current), 60_000);
    return () => window.clearInterval(interval);
  }, [pet]);

  const start = useCallback((name: string) => { setPet(createPet(name)); setMessage(`Welcome home, ${name.trim() || 'Mochi'}!`); }, []);
  const act = useCallback((action: (state: PetState) => { state: PetState; message: string }) => setPet((current) => { if (!current) return current; const result = action(current); setMessage(result.message); return result.state; }), []);
  return { pet, message, start, feed: () => act(feed), play: () => act(play), clean: () => act(clean), toggleSleep: () => act(toggleSleep) };
}
