export type Mood = 'content' | 'happy' | 'hungry' | 'tired' | 'sad' | 'dirty' | 'unwell';
export type PetArchetype = 'dog' | 'cat' | 'rabbit' | 'bear' | 'fox' | 'bird' | 'frog' | 'turtle' | 'axolotl' | 'bat' | 'dinosaur' | 'dragon' | 'monster' | 'blob' | 'ghost' | 'elemental' | 'mushroom' | 'golem' | 'alien' | 'robot';

export interface PetNeeds {
  hunger: number;
  sleep: number;
  hygiene: number;
  social: number;
  bladder: number;
  fun: number;
  affection: number;
  nutrition: number;
}

export interface PetSchedule {
  bedtime: string;
  wakeTime: string;
}
export interface PetAppearance { palette: string; accent: string; eyeStyle: number; bodyVariant: number; marking: number; rareTrait?: string; element?: 'fire' | 'water' | 'earth' | 'air'; }
export interface HabitatState { archetype: string; seed: number; palette: number; layout: number; variant: number; waypoints: { sleepArea: number; feedArea: number; playArea: number; idleArea: number; viewArea: number }; }

export interface PetState {
  name: string;
  age: number;
  needs: PetNeeds;
  health: number;
  isSleeping: boolean;
  schedule: PetSchedule;
  scheduleOverrideUntil?: number;
  id: string;
  generationSeed: number;
  archetype: PetArchetype;
  appearance: PetAppearance;
  habitat: HabitatState;
  lastUpdatedAt: number;
}

export interface PetActionResult {
  state: PetState;
  message: string;
}
