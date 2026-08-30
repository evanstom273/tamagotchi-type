import { clampStat, DEFAULT_SCHEDULE, INITIAL_HEALTH, INITIAL_NEEDS, WORLD_MINUTE_REAL_MS, WORLD_MINUTES_PER_DAY } from './constants';
import type { PetState } from '../types/pet';
import type { PetArchetype } from '../types/pet';
import { generateAppearance, generateHabitat, generatePersonality } from './generation';

function minutes(time: string, fallback: number) { const [hour, minute] = time.split(':').map(Number); return Number.isFinite(hour) && Number.isFinite(minute) ? hour * 60 + minute : fallback; }
function scheduledSleep(totalMinutes: number, bedtime: string, wakeTime: string) { const now = ((totalMinutes % WORLD_MINUTES_PER_DAY) + WORLD_MINUTES_PER_DAY) % WORLD_MINUTES_PER_DAY; const bed = minutes(bedtime, 23 * 60); const wake = minutes(wakeTime, 8 * 60); return bed > wake ? now >= bed || now < wake : now >= bed && now < wake; }

export function createPet(name: string, archetype: PetArchetype = 'dog', now = Date.now()): PetState {
  const generationSeed = (now ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
  return { name: name.trim() || 'Mochi', age: 0, needs: { ...INITIAL_NEEDS }, health: INITIAL_HEALTH, isSleeping: false, schedule: { ...DEFAULT_SCHEDULE }, personality: generatePersonality(generationSeed), id: `${generationSeed.toString(16)}-${Math.random().toString(36).slice(2, 8)}`, generationSeed, archetype, appearance: generateAppearance(archetype, generationSeed), habitat: generateHabitat(archetype, generationSeed), lastUpdatedAt: now };
}

export function progressPet(pet: PetState, now = Date.now(), timeScale = 1, worldMinutes?: number): PetState {
  const elapsedMs = Math.max(0, now - pet.lastUpdatedAt);
  const worldElapsedMinutes = elapsedMs * timeScale / WORLD_MINUTE_REAL_MS;
  const days = worldElapsedMinutes / WORLD_MINUTES_PER_DAY;
  const hours = worldElapsedMinutes / 60;
  if (hours < 0.01) return pet;
  const steps = Math.min(192, Math.max(1, Math.ceil(hours * 4)));
  const stepHours = hours / steps;
  let needs = { ...pet.needs };
  let health = pet.health;
  let sleeping = pet.isSleeping;
  for (let index = 1; index <= steps; index += 1) {
    const sampleRealTimestamp = pet.lastUpdatedAt + elapsedMs * index / steps;
    const sampleWorldMinutes = (worldMinutes ?? 0) - worldElapsedMinutes + worldElapsedMinutes * index / steps;
    const routineWindow = scheduledSleep(sampleWorldMinutes, pet.schedule.bedtime, pet.schedule.wakeTime);
    if (sleeping && !routineWindow && needs.sleep > 72) sleeping = false;
    const manuallyAwake = pet.scheduleOverrideUntil !== undefined && sampleRealTimestamp < pet.scheduleOverrideUntil;
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
