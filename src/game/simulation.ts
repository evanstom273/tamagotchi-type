import { clampStat, INITIAL_STATS, MS_PER_DAY } from './constants';
import type { PetState } from '../types/pet';
import { getWorldLighting } from './worldTime';

export function createPet(name: string, now = Date.now()): PetState {
  return { name: name.trim() || 'Mochi', age: 0, ...INITIAL_STATS, isSleeping: false, lastUpdatedAt: now };
}

export function progressPet(pet: PetState, now = Date.now()): PetState {
  const elapsedMs = Math.max(0, now - pet.lastUpdatedAt);
  const days = elapsedMs / MS_PER_DAY;
  const hours = elapsedMs / 3_600_000;
  if (hours < 0.01) return pet;
  const lighting = getWorldLighting(new Date(now));
  // Sleep is still player-controllable, but low-energy pets begin settling down
  // during the evening/night so their routine can grow more naturally later.
  const autonomousSleep = !pet.isSleeping && lighting.isNight && pet.energy < 34;
  const sleeping = pet.isSleeping || autonomousSleep;
  return {
    ...pet,
    age: pet.age + days,
    hunger: clampStat(pet.hunger - hours * 2.7),
    happiness: clampStat(pet.happiness - hours * 1.15),
    energy: clampStat(pet.energy + (sleeping ? hours * 8.5 : -hours * 3.4)),
    hygiene: clampStat(pet.hygiene - hours * 1.4),
    health: clampStat(pet.health - hours * (pet.hunger < 25 || pet.hygiene < 25 ? 1.5 : 0.12)),
    isSleeping: sleeping,
    lastUpdatedAt: now,
  };
}
