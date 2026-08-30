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
export type PetPreferredActivity = 'play' | 'explore' | 'rest' | 'social';
export interface PetPersonality { activity: number; sociability: number; curiosity: number; sleepiness: number; mischief: number; touchTolerance: number; preferredActivity: PetPreferredActivity; }
export type PetBehavior = 'idle' | 'wandering' | 'resting' | 'inspecting' | 'eating' | 'playing' | 'cleaning' | 'sleeping' | 'waking' | 'reacting';
export type PetInteractionRegion = 'head' | 'body' | 'shell' | 'cap' | 'core' | 'display' | 'eye' | 'wings' | 'gills' | 'tail' | 'feet' | 'antenna';
export interface PetAppearance { palette: string; accent: string; eyeStyle: number; bodyVariant: number; marking: number; headVariant: number; limbVariant: number; appendageVariant: number; tailVariant: number; visualScale: number; bodyFamily: string; headFamily: string; limbFamily: string; appendageFamily: string; tailFamily: string; rareTrait?: string; element?: 'fire' | 'water' | 'earth' | 'air'; }
export interface HabitatState { archetype: string; seed: number; palette: number; layout: number; variant: number; layoutTemplate: string; objectVariant: number; waypoints: { sleepArea: number; feedArea: number; playArea: number; idleArea: number; viewArea: number }; }

export interface PetState {
  name: string;
  age: number;
  needs: PetNeeds;
  health: number;
  isSleeping: boolean;
  schedule: PetSchedule;
  personality: PetPersonality;
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
