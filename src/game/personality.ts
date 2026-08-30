import type { Mood, PetState } from '../types/pet';

export function getMood(pet: PetState): Mood {
  if (pet.health < 38) return 'unwell';
  if (pet.hygiene < 30) return 'dirty';
  if (pet.energy < 25) return 'tired';
  if (pet.hunger < 28) return 'hungry';
  if (pet.happiness < 35) return 'sad';
  if (pet.happiness > 78 && pet.health > 75) return 'happy';
  return 'content';
}

export const moodCopy: Record<Mood, { label: string; hint: string }> = {
  content: { label: 'Content', hint: 'A gentle day in the room.' },
  happy: { label: 'Bubbly', hint: 'Little paws, big feelings.' },
  hungry: { label: 'Peckish', hint: 'Something tasty would help.' },
  tired: { label: 'Sleepy', hint: 'A quiet nap sounds perfect.' },
  sad: { label: 'Blue', hint: 'A little playtime could help.' },
  dirty: { label: 'Grubby', hint: 'Freshen-up time.' },
  unwell: { label: 'Under the weather', hint: 'Gentle care and rest, please.' },
};
