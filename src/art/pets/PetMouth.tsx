import type { Mood } from '../../types/pet';
export function PetMouth({ mood }: { mood: Mood }) { const sad = mood === 'sad' || mood === 'hungry'; return <path className="pet-mouth" d={sad ? 'M145 157c6-7 14-7 20 0' : 'M145 155c6 8 14 8 20 0'} fill="none" stroke="#4b3030" strokeWidth="6" strokeLinecap="round"/> }
