export type Mood = 'content' | 'happy' | 'hungry' | 'tired' | 'sad' | 'dirty' | 'unwell';

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

export interface PetState {
  name: string;
  age: number;
  needs: PetNeeds;
  health: number;
  isSleeping: boolean;
  lastUpdatedAt: number;
}

export interface PetActionResult {
  state: PetState;
  message: string;
}
