import { clampStat, INITIAL_HEALTH, INITIAL_NEEDS, MS_PER_DAY } from './constants';
import type { PetState } from '../types/pet';
import { getWorldLighting } from './worldTime';

export function createPet(name: string, now = Date.now()): PetState {
  return { name: name.trim() || 'Mochi', age: 0, needs: { ...INITIAL_NEEDS }, health: INITIAL_HEALTH, isSleeping: false, lastUpdatedAt: now };
}

export function progressPet(pet: PetState, now = Date.now()): PetState {
  const elapsedMs = Math.max(0, now - pet.lastUpdatedAt);
  const days = elapsedMs / MS_PER_DAY;
  const hours = elapsedMs / 3_600_000;
  if (hours < 0.01) return pet;
  const lighting = getWorldLighting(new Date(now));
  // Sleep is still player-controllable, but low-energy pets begin settling down
  // during the evening/night so their routine can grow more naturally later.
  const autonomousSleep = !pet.isSleeping && lighting.isNight && pet.needs.sleep < 34;
  const sleeping = pet.isSleeping || autonomousSleep;
  return {
    ...pet,
    age: pet.age + days,
    needs: {
      hunger: clampStat(pet.needs.hunger - hours * 2.7),
      sleep: clampStat(pet.needs.sleep + (sleeping ? hours * 8.5 : -hours * 3.4)),
      hygiene: clampStat(pet.needs.hygiene - hours * 1.4),
      social: clampStat(pet.needs.social - hours * 1.15),
      bladder: clampStat(pet.needs.bladder - hours * 2.15),
      fun: clampStat(pet.needs.fun - hours * 1.05),
      affection: clampStat(pet.needs.affection - hours * 0.38),
      nutrition: clampStat(pet.needs.nutrition - hours * 0.18),
    },
    health: clampStat(pet.health - hours * (pet.needs.hunger < 25 || pet.needs.hygiene < 25 || pet.needs.nutrition < 25 ? 1.5 : 0.12)),
    isSleeping: sleeping,
    lastUpdatedAt: now,
  };
}
