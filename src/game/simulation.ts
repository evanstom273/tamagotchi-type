import { clampStat, DEFAULT_SCHEDULE, INITIAL_HEALTH, INITIAL_NEEDS, MS_PER_DAY } from './constants';
import type { PetState } from '../types/pet';
import type { PetArchetype } from '../types/pet';
import { generateAppearance, generateHabitat } from './generation';

const HOUR_MS = 3_600_000;
function minutes(time: string, fallback: number) { const [hour, minute] = time.split(':').map(Number); return Number.isFinite(hour) && Number.isFinite(minute) ? hour * 60 + minute : fallback; }
function scheduledSleep(date: Date, bedtime: string, wakeTime: string) { const now = date.getHours() * 60 + date.getMinutes(); const bed = minutes(bedtime, 23 * 60); const wake = minutes(wakeTime, 8 * 60); return bed > wake ? now >= bed || now < wake : now >= bed && now < wake; }

export function createPet(name: string, archetype: PetArchetype = 'dog', now = Date.now()): PetState {
  const generationSeed = (now ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
  return { name: name.trim() || 'Mochi', age: 0, needs: { ...INITIAL_NEEDS }, health: INITIAL_HEALTH, isSleeping: false, schedule: { ...DEFAULT_SCHEDULE }, id: `${generationSeed.toString(16)}-${Math.random().toString(36).slice(2, 8)}`, generationSeed, archetype, appearance: generateAppearance(archetype, generationSeed), habitat: generateHabitat(archetype, generationSeed), lastUpdatedAt: now };
}

export function progressPet(pet: PetState, now = Date.now()): PetState {
  const elapsedMs = Math.max(0, now - pet.lastUpdatedAt);
  const days = elapsedMs / MS_PER_DAY;
  const hours = elapsedMs / HOUR_MS;
  if (hours < 0.01) return pet;
  const steps = Math.min(192, Math.max(1, Math.ceil(hours * 4)));
  const stepHours = hours / steps;
  let needs = { ...pet.needs };
  let health = pet.health;
  let sleeping = pet.isSleeping;
  for (let index = 1; index <= steps; index += 1) {
    const sample = new Date(pet.lastUpdatedAt + (elapsedMs * index) / steps);
    const routineWindow = scheduledSleep(sample, pet.schedule.bedtime, pet.schedule.wakeTime);
    if (sleeping && !routineWindow && needs.sleep > 72) sleeping = false;
    const manuallyAwake = pet.scheduleOverrideUntil !== undefined && sample.getTime() < pet.scheduleOverrideUntil;
    if (!sleeping && routineWindow && needs.sleep < 72 && !manuallyAwake) sleeping = true;
    needs = {
      hunger: clampStat(needs.hunger - stepHours * 2.7), sleep: clampStat(needs.sleep + (sleeping ? stepHours * 8.5 : -stepHours * 3.4)),
      hygiene: clampStat(needs.hygiene - stepHours * 1.4), social: clampStat(needs.social - stepHours * 1.15), bladder: clampStat(needs.bladder - stepHours * 2.15),
      fun: clampStat(needs.fun - stepHours * 1.05), affection: clampStat(needs.affection - stepHours * 0.38), nutrition: clampStat(needs.nutrition - stepHours * 0.18),
    };
    health = clampStat(health - stepHours * (needs.hunger < 25 || needs.hygiene < 25 || needs.nutrition < 25 ? 1.5 : 0.12));
  }
  return {
    ...pet,
    age: pet.age + days,
    needs,
    health,
    isSleeping: sleeping,
    lastUpdatedAt: now,
  };
}
