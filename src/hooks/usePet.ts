import { useCallback, useEffect, useRef, useState } from 'react';
import { feed, play, clean, toggleSleep } from '../game/actions';
import { progressPet, createPet } from '../game/simulation';
import type { PetAnimationState, PetArchetype, PetInteractionRegion, PetReaction, PetState } from '../types/pet';
import { DEFAULT_SCHEDULE, INITIAL_HEALTH, INITIAL_NEEDS } from '../game/constants';
import type { PetSchedule } from '../types/pet';
import { generateAppearance, generateHabitat, generatePersonality } from '../game/generation';
import { getPersistedWorldMinutes } from './useWorldClock';
import type { SimulationSpeed } from '../types/world';

const STORAGE_KEY = 'pocket-pals-pet-v1';

function migratePet(saved: Partial<PetState> & Record<string, unknown>): PetState {
  const oldNeeds = saved.needs as Partial<typeof INITIAL_NEEDS> | undefined;
  const archetype = (saved.archetype as PetArchetype) || 'dog';
  const generationSeed = typeof saved.generationSeed === 'number' ? saved.generationSeed : Date.now() >>> 0;
  const appearance = saved.appearance && typeof saved.appearance === 'object' ? { ...generateAppearance(archetype, generationSeed), ...(saved.appearance as Partial<PetState['appearance']>) } : generateAppearance(archetype, generationSeed);
  const habitat = saved.habitat && typeof saved.habitat === 'object' ? { ...generateHabitat(archetype, generationSeed), ...(saved.habitat as Partial<PetState['habitat']>) } : generateHabitat(archetype, generationSeed);
  const personality = saved.personality && typeof saved.personality === 'object' ? { ...generatePersonality(generationSeed), ...(saved.personality as Partial<PetState['personality']>) } : generatePersonality(generationSeed);
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
    personality,
    id: typeof saved.id === 'string' ? saved.id : `${generationSeed.toString(16)}-legacy`, generationSeed, archetype, appearance, habitat,
    lastUpdatedAt: typeof saved.lastUpdatedAt === 'number' ? saved.lastUpdatedAt : Date.now(),
  };
}

export function usePet(worldMinutes = getPersistedWorldMinutes(), speed: SimulationSpeed = 1) {
  const [pet, setPet] = useState<PetState | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    try { return progressPet(migratePet(JSON.parse(saved) as Partial<PetState> & Record<string, unknown>), Date.now(), 1, getPersistedWorldMinutes()); } catch { return null; }
  });
  const [message, setMessage] = useState('');
  const [reaction, setReaction] = useState<PetReaction | null>(null);
  const interactionRef = useRef({ region: '' as PetInteractionRegion | '', at: 0, count: 0 });

  useEffect(() => { if (pet) localStorage.setItem(STORAGE_KEY, JSON.stringify(pet)); }, [pet]);
  useEffect(() => {
    if (!pet) return;
    const interval = window.setInterval(() => setPet((current) => current ? progressPet(current, Date.now(), speed, worldMinutes) : current), 1_000);
    return () => window.clearInterval(interval);
  }, [pet, speed, worldMinutes]);

  const start = useCallback((name: string, archetype: PetArchetype) => { setPet(createPet(name, archetype)); setMessage(`Welcome home, ${name.trim() || 'Mochi'}!`); }, []);
  const adopt = useCallback((candidate: PetState) => { setPet(candidate); setMessage(`Welcome home, ${candidate.name}!`); }, []);
  const act = useCallback((action: (state: PetState, now: number, scale: SimulationSpeed, worldTime: number) => { state: PetState; message: string }, animation: PetAnimationState) => setPet((current) => { if (!current) return current; const now = Date.now(); const result = action(current, now, speed, worldMinutes); setReaction({ state: animation, nonce: now }); setMessage(result.message); return result.state; }), [speed, worldMinutes]);
  const setSchedule = useCallback((schedule: PetSchedule) => setPet((current) => current ? { ...current, schedule } : current), []);
  const interact = useCallback((region: PetInteractionRegion, gesture: 'tap' | 'stroke', continuous = false) => setPet((current) => {
    if (!current) return current;
    const now = Date.now(); const previous = interactionRef.current; const count = continuous ? previous.count : previous.region === region && now - previous.at < 1600 ? previous.count + 1 : 1; interactionRef.current = { region, at: now, count };
    const tolerance = current.personality?.touchTolerance ?? 60; const positive = region === 'head' || region === 'body' || region === 'core' || region === 'display' || region === 'shell' || region === 'cap'; const annoyed = count >= (tolerance > 65 ? 4 : 3) || (region === 'tail' || region === 'antenna') && count > 1;
    const delta = annoyed ? { affection: -2, fun: -1 } : positive ? { affection: gesture === 'stroke' ? 5 : 3, social: 2, fun: 1 } : { fun: 2 };
    const interactionState: PetAnimationState = annoyed ? 'irritated' : gesture === 'stroke' ? 'interacting' : current.personality.mischief > 60 ? 'excited' : 'happy';
    const next = { ...current, needs: { ...current.needs, affection: Math.max(0, Math.min(100, current.needs.affection + (delta.affection ?? 0))), social: Math.max(0, Math.min(100, current.needs.social + (delta.social ?? 0))), fun: Math.max(0, Math.min(100, current.needs.fun + (delta.fun ?? 0))) }, isSleeping: current.isSleeping && !annoyed ? false : current.isSleeping, scheduleOverrideUntil: current.isSleeping && !annoyed ? now + 90 * 60_000 : current.scheduleOverrideUntil, lastUpdatedAt: now };
    setReaction({ state: interactionState, nonce: now, region, gesture });
    setMessage(annoyed ? `${current.name} wriggled away from the repeated ${region} pokes.` : `${current.name} enjoyed that ${gesture === 'stroke' ? 'gentle stroke' : 'little tap'}.`);
    return next;
  }), []);
  return { pet, message, reaction, start, adopt, feed: () => act(feed, 'eating'), play: () => act(play, 'playing'), clean: () => act(clean, 'cleaning'), toggleSleep: () => act(toggleSleep, pet?.isSleeping ? 'waking' : 'going-to-sleep'), setSchedule, interact };
}
