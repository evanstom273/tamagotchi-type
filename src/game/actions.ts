import { clampStat } from './constants';
import { progressPet } from './simulation';
import type { PetActionResult, PetState } from '../types/pet';

const ready = (pet: PetState, message: string): PetActionResult => ({ state: { ...pet, lastUpdatedAt: Date.now() }, message });

export function feed(pet: PetState): PetActionResult {
  const current = progressPet(pet);
  return ready({ ...current, hunger: clampStat(current.hunger + 25), happiness: clampStat(current.happiness + 4), health: clampStat(current.health + 2) }, `${current.name} had a crunchy little snack.`);
}

export function play(pet: PetState): PetActionResult {
  const current = progressPet(pet);
  if (current.energy < 14) return ready(current, `${current.name} is too sleepy to play right now.`);
  return ready({ ...current, happiness: clampStat(current.happiness + 18), energy: clampStat(current.energy - 12), hunger: clampStat(current.hunger - 5) }, `${current.name} chased the ball in happy circles.`);
}

export function clean(pet: PetState): PetActionResult {
  const current = progressPet(pet);
  return ready({ ...current, hygiene: clampStat(current.hygiene + 34), happiness: clampStat(current.happiness + 3), health: clampStat(current.health + 3) }, `${current.name} is sparkling fresh.`);
}

export function toggleSleep(pet: PetState): PetActionResult {
  const current = progressPet(pet);
  const sleeping = !current.isSleeping;
  return ready({ ...current, isSleeping: sleeping }, sleeping ? `${current.name} curled up for a nap.` : `${current.name} woke up refreshed.`);
}
