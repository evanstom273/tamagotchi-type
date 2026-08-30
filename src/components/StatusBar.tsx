import type { PetNeeds, PetState } from '../types/pet';

type NeedKey = keyof PetNeeds;
type Need = { key: NeedKey; label: string; tone: string; symbol: string };
const NEEDS: Need[] = [
  { key: 'hunger', label: 'Hunger', tone: 'peach', symbol: 'M5 13h14l-2 6H7l-2-6Zm2-3c2 2 8 2 10 0M8 7c1-2 2-2 3 0m3 0c1-2 2-2 3 0' },
  { key: 'sleep', label: 'Sleep', tone: 'lilac', symbol: 'M7 6h9l-8 8h9M5 18h4' },
  { key: 'hygiene', label: 'Hygiene', tone: 'blue', symbol: 'M9 4h6m-7 0v4l-2 10h10L14 8V4M8 12h8' },
  { key: 'social', label: 'Social', tone: 'yellow', symbol: 'M9 9a3 3 0 1 0 0 .1M16 11a2 2 0 1 0 0 .1M3.5 19c.4-3 2.1-4.5 5.5-4.5s5.1 1.5 5.5 4.5m.5-5c2.2.2 3.4 1.6 3.7 3.5' },
  { key: 'bladder', label: 'Bladder', tone: 'sage', symbol: 'M8 4c0 2-2 3-2 6v4a6 6 0 0 0 12 0v-4c0-3-2-4-2-6M9 7h6' },
  { key: 'fun', label: 'Fun', tone: 'coral', symbol: 'm12 4 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z' },
  { key: 'affection', label: 'Affection', tone: 'rose', symbol: 'M12 19S5 15 5 9a3.5 3.5 0 0 1 7-1 3.5 3.5 0 0 1 7 1c0 6-7 10-7 10Z' },
  { key: 'nutrition', label: 'Nutrition', tone: 'ochre', symbol: 'M7 16c0-5 2-8 5-8s5 3 5 8M6 16h12v3H6zM10 5h4' },
];

function Need({ need, value }: { need: Need; value: number }) { const radius = 21; const circumference = 2 * Math.PI * radius; return <button className={`radial-need radial-need--${need.tone}`} title={`${need.label}: ${value} out of 100`} aria-label={`${need.label}: ${value} out of 100`}><span className="radial-need__ring"><svg viewBox="0 0 52 52" aria-hidden="true"><circle className="radial-need__track" cx="26" cy="26" r={radius} /><circle className="radial-need__value" cx="26" cy="26" r={radius} style={{ strokeDasharray: circumference, strokeDashoffset: circumference * (1 - value / 100) }} /></svg><span className="radial-need__symbol"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={need.symbol} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span></span><span>{need.label}</span></button>; }

export function StatusBar({ pet }: { pet: PetState }) { return <section className="drawer-needs"><div className="drawer-section-heading"><div><span className="eyebrow">The little things</span><h2>Needs</h2></div><span className="drawer-hint">Tap to check in</span></div><div className="radial-grid">{NEEDS.map((need) => <Need key={need.key} need={need} value={pet.needs[need.key]} />)}</div></section>; }
