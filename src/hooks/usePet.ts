import { useCallback, useEffect, useState } from 'react';
import { feed, play, clean, toggleSleep } from '../game/actions';
import { progressPet, createPet } from '../game/simulation';
import type { PetArchetype, PetState } from '../types/pet';
import { DEFAULT_SCHEDULE, INITIAL_HEALTH, INITIAL_NEEDS } from '../game/constants';
import type { PetSchedule } from '../types/pet';
import { generateAppearance, generateHabitat } from '../game/generation';

const STORAGE_KEY = 'pocket-pals-pet-v1';

function migratePet(saved: Partial<PetState> & Record<string, unknown>): PetState {
  const oldNeeds = saved.needs as Partial<typeof INITIAL_NEEDS> | undefined;
  const archetype = (saved.archetype as PetArchetype) || 'dog';
  const generationSeed = typeof saved.generationSeed === 'number' ? saved.generationSeed : Date.now() >>> 0;
  const appearance = saved.appearance && typeof saved.appearance === 'object' ? { ...generateAppearance(archetype, generationSeed), ...(saved.appearance as Partial<PetState['appearance']>) } : generateAppearance(archetype, generationSeed);
  const habitat = saved.habitat && typeof saved.habitat === 'object' ? { ...generateHabitat(archetype, generationSeed), ...(saved.habitat as Partial<PetState['habitat']>) } : generateHabitat(archetype, generationSeed);
  return {
    name: typeof saved.name === 'string' ? saved.name : 'Mochi',
    age: typeof saved.age === 'number' ? saved.age : 0,
    needs: {
      ...INITIAL_NEEDS,
      ...oldNeeds,
      ...(typeof saved.hunger === 'number' ? { hunger: saved.hunger } : {}),
      ...(typeof saved.energy === 'number' ? { sleep: saved.energy } : {}),
      ...(typeof saved.hygiene === 'number' ? { hygiene: saved.hygiene } : {}),
      ...(typeof saved.happiness === 'number' ? { social: saved.happiness, fun: saved.happiness } : {}),
    },
    health: typeof saved.health === 'number' ? saved.health : INITIAL_HEALTH,
    isSleeping: saved.isSleeping === true,
    schedule: { ...DEFAULT_SCHEDULE, ...(saved.schedule as Partial<PetSchedule> | undefined) },
    id: typeof saved.id === 'string' ? saved.id : `${generationSeed.toString(16)}-legacy`, generationSeed, archetype, appearance, habitat,
    lastUpdatedAt: typeof saved.lastUpdatedAt === 'number' ? saved.lastUpdatedAt : Date.now(),
  };
}

export function usePet() {
  const [pet, setPet] = useState<PetState | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    try { return progressPet(migratePet(JSON.parse(saved) as Partial<PetState> & Record<string, unknown>)); } catch { return null; }
  });
  const [message, setMessage] = useState('');

  useEffect(() => { if (pet) localStorage.setItem(STORAGE_KEY, JSON.stringify(pet)); }, [pet]);
  useEffect(() => {
    if (!pet) return;
    const interval = window.setInterval(() => setPet((current) => current ? progressPet(current) : current), 60_000);
    return () => window.clearInterval(interval);
  }, [pet]);

  const start = useCallback((name: string, archetype: PetArchetype) => { setPet(createPet(name, archetype)); setMessage(`Welcome home, ${name.trim() || 'Mochi'}!`); }, []);
  const adopt = useCallback((candidate: PetState) => { setPet(candidate); setMessage(`Welcome home, ${candidate.name}!`); }, []);
  const act = useCallback((action: (state: PetState) => { state: PetState; message: string }) => setPet((current) => { if (!current) return current; const result = action(current); setMessage(result.message); return result.state; }), []);
  const setSchedule = useCallback((schedule: PetSchedule) => setPet((current) => current ? { ...current, schedule } : current), []);
  return { pet, message, start, adopt, feed: () => act(feed), play: () => act(play), clean: () => act(clean), toggleSleep: () => act(toggleSleep), setSchedule };
}
