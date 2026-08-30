export type Mood = 'content' | 'happy' | 'hungry' | 'tired' | 'sad' | 'dirty' | 'unwell';

export interface PetState {
  name: string;
  age: number;
  hunger: number;
  happiness: number;
  energy: number;
  hygiene: number;
  health: number;
  isSleeping: boolean;
  lastUpdatedAt: number;
}

export interface PetActionResult {
  state: PetState;
  message: string;
}
