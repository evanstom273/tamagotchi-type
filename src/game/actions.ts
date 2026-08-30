import { clampStat } from './constants';
import { progressPet } from './simulation';
import type { PetActionResult, PetState } from '../types/pet';

const ready = (pet: PetState, message: string): PetActionResult => ({ state: { ...pet, lastUpdatedAt: Date.now() }, message });

export function feed(pet: PetState): PetActionResult {
  const current = progressPet(pet);
  return ready({ ...current, needs: { ...current.needs, hunger: clampStat(current.needs.hunger + 25), bladder: clampStat(current.needs.bladder - 9), nutrition: clampStat(current.needs.nutrition + 8), affection: clampStat(current.needs.affection + 3) }, health: clampStat(current.health + 2) }, `${current.name} had a crunchy little snack.`);
}

export function play(pet: PetState): PetActionResult {
  const current = progressPet(pet);
  if (current.needs.sleep < 14) return ready(current, `${current.name} is too sleepy to play right now.`);
  return ready({ ...current, needs: { ...current.needs, fun: clampStat(current.needs.fun + 18), social: clampStat(current.needs.social + 10), affection: clampStat(current.needs.affection + 8), sleep: clampStat(current.needs.sleep - 12), hunger: clampStat(current.needs.hunger - 5), hygiene: clampStat(current.needs.hygiene - 4) } }, `${current.name} chased the ball in happy circles.`);
}

export function clean(pet: PetState): PetActionResult {
  const current = progressPet(pet);
  return ready({ ...current, needs: { ...current.needs, hygiene: clampStat(current.needs.hygiene + 34), affection: clampStat(current.needs.affection + 3) }, health: clampStat(current.health + 3) }, `${current.name} is sparkling fresh.`);
}

export function toggleSleep(pet: PetState): PetActionResult {
  const current = progressPet(pet);
  const sleeping = !current.isSleeping;
  return ready({ ...current, isSleeping: sleeping }, sleeping ? `${current.name} curled up for a nap.` : `${current.name} woke up refreshed.`);
}
