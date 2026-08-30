import type { PetNeeds, PetState } from '../types/pet';
import { getMood, moodCopy } from '../game/personality';

const NEEDS: Array<{ key: keyof PetNeeds; label: string; tone: string }> = [
  { key: 'hunger', label: 'Hunger', tone: 'peach' }, { key: 'sleep', label: 'Sleep', tone: 'lilac' },
  { key: 'hygiene', label: 'Hygiene', tone: 'blue' }, { key: 'social', label: 'Social', tone: 'yellow' },
  { key: 'bladder', label: 'Bladder', tone: 'sage' }, { key: 'fun', label: 'Fun', tone: 'coral' },
  { key: 'affection', label: 'Affection', tone: 'rose' }, { key: 'nutrition', label: 'Nutrition', tone: 'ochre' },
];

function Need({ label, value, tone }: { label: string; value: number; tone: string }) { return <div className="need" title={`${label}: ${value} out of 100`}><div className="need__top"><span>{label}</span><strong>{value}</strong></div><div className="need__track"><div className={`need__fill need__fill--${tone}`} style={{ width: `${value}%` }} /></div></div>; }

export function StatusBar({ pet }: { pet: PetState }) { const mood = getMood(pet); return <aside className="status" aria-label="Pet needs and mood"><div className="mood"><span className={`mood__dot mood__dot--${mood}`} /><div><span className="eyebrow">Current mood</span><strong>{moodCopy[mood].label}</strong></div><span className="age">Day {Math.max(1, Math.floor(pet.age) + 1)}</span></div><div className="needs-heading"><span className="eyebrow">Needs</span><span>Higher is better</span></div><div className="needs-grid">{NEEDS.map(({ key, label, tone }) => <Need key={key} label={label} value={pet.needs[key]} tone={tone} />)}</div></aside>; }
