import type { Mood } from '../../types/pet';
export function PetEyes({ mood }: { mood: Mood }) { const sleepy = mood === 'tired'; return <g className="pet-eyes" fill="none" stroke="#4b3030" strokeWidth="7" strokeLinecap="round"><path d={sleepy ? 'M112 130l11 5 11-5' : 'M113 130v2'} /><path d={sleepy ? 'M177 130l11 5 11-5' : 'M178 130v2'} /></g> }
