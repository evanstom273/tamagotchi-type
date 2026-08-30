import { useState } from 'react';
import type { ReactNode } from 'react';
import { ARCHETYPES } from '../data/archetypes';
import { createPet } from '../game/simulation';
import { useWorldLighting } from '../hooks/useWorldLighting';
import type { PetArchetype, PetState } from '../types/pet';
import { Pet } from './Pet';
import { PetRoom } from './PetRoom';

function ArchetypePreview({ id }: { id: PetArchetype }) {
  let artwork: ReactNode;
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (id) {
    case 'dog': artwork = <g {...common}><path d="M13 25c0-8 5-12 11-12s11 4 11 12c-4 5-18 5-22 0Zm3-10-4-7 8 4m12 3 4-7-8 4m-1 11c7-2 10 3 5 6" /></g>; break;
    case 'cat': artwork = <g {...common}><path d="M14 25V12l5 4 5-6 5 6 5-4v13c-4 5-16 5-20 0Zm20-1c7-2 8 3 4 5" /></g>; break;
    case 'rabbit': artwork = <g {...common}><path d="M18 17c-4-11 1-14 4-4 0-11 6-11 5 4 5 2 5 8 0 10-6 3-14 0-14-5 0-3 2-5 5-5Z" /></g>; break;
    case 'bear': artwork = <g {...common}><path d="M12 24c0-7 5-11 12-11s12 4 12 11c-2 7-22 7-24 0Zm4-10a4 4 0 1 1 7 1 4 4 0 1 1 7-1" /><path d="M21 23h6" /></g>; break;
    case 'fox': artwork = <g {...common}><path d="m12 11 3 6c1-2 4-4 9-4s8 2 9 4l3-6-1 15c-4 5-18 5-22 0Z" /><path d="m35 24 7 1-6 4" /></g>; break;
    case 'bird': artwork = <g {...common}><path d="M15 25c0-8 5-12 10-12s10 4 10 12c-6 5-14 5-20 0Zm2-2-8-4 4 8m19-4 8-4-4 8m-7-9 6-2-6-3" /></g>; break;
    case 'frog': artwork = <g {...common}><path d="M13 25c0-6 5-9 11-9s11 3 11 9c-5 5-17 5-22 0Z" /><circle cx="18" cy="14" r="4" /><circle cx="30" cy="14" r="4" /><path d="m15 26-5 4m23-4 5 4" /></g>; break;
    case 'turtle': artwork = <g {...common}><path d="M11 24c0-8 6-12 13-12s13 4 13 12c-5 6-21 6-26 0Z" /><path d="M17 24q7-8 14 0m-14-7 14 7m-7-11v11m13 2 5 2m-29-2-5 2" /></g>; break;
    case 'axolotl': artwork = <g {...common}><path d="M12 24c0-7 5-11 12-11s12 4 12 11c-4 6-20 6-24 0Z" /><path d="m15 14-7-5m8 7-8 1m25-3 7-5m-8 7 8 1m-12 12 4 5m-9-5-4 5" /></g>; break;
    case 'bat': artwork = <g {...common}><path d="M24 16 7 9l5 9-7 4 12 2c3 6 11 6 14 0l12-2-7-4 5-9-17 7Z" /><path d="m19 15-2-6 7 5 7-5-2 6" /></g>; break;
    case 'dinosaur': artwork = <g {...common}><path d="M12 25c0-7 5-11 12-11s12 4 12 11c-5 5-19 5-24 0Z" /><path d="m16 14 3-5 3 5 3-5 3 5 3-5 3 7m-1 8 8 2-8 3m-14-1-2 4m12-4 2 4" /></g>; break;
    case 'dragon': artwork = <g {...common}><path d="M13 25c0-7 5-11 11-11s11 4 11 11c-4 5-18 5-22 0Zm4-10-5-7 8 4m12 3 5-7-8 4m-1 4 7-7 1 9m-15-2-7-7-1 9" /></g>; break;
    case 'monster': artwork = <g {...common}><path d="M12 25c-1-8 5-13 12-13s13 5 12 13c-5 5-19 5-24 0Z" /><path d="m17 14-3-6 7 4m13 2 3-6-7 4" /><circle cx="18" cy="19" r="2" /><circle cx="24" cy="18" r="2" /><circle cx="30" cy="19" r="2" /><path d="m19 25 2 2 3-2 3 2 2-2" /></g>; break;
    case 'blob': artwork = <g {...common}><path d="M9 25c2-6 7-4 9-9 3-6 9-5 11 0 7-2 11 4 8 9-5 6-24 6-28 0Z" /><path d="M15 27 11 31m22-4 4 4" /></g>; break;
    case 'ghost': artwork = <g {...common}><path d="M13 29c-2-12 1-18 11-18s13 6 11 18l-5-3-4 4-4-4-4 4-5-4Z" /><path d="M15 29c3 3 5-2 9 1 4-3 6 2 9-1" /></g>; break;
    case 'elemental': artwork = <g {...common}><path d="M24 7c5 7 11 11 11 17 0 6-5 8-11 8s-11-2-11-8c0-6 6-10 11-17Z" /><path d="m24 13 3 6 5-2-4 6" /></g>; break;
    case 'mushroom': artwork = <g {...common}><path d="M13 18c0-8 22-8 22 0H13Z" /><path d="M18 18h12l-1 12c-3 2-7 2-10 0Z" /><circle cx="19" cy="14" r="1" /><circle cx="28" cy="13" r="1" /></g>; break;
    case 'golem': artwork = <g {...common}><path d="m12 27 2-13 8-5 10 3 5 9-3 8-11 2Z" /><path d="m23 13 2-5 3 4m-9 7 5-3 4 3" /><circle cx="25" cy="23" r="2" /></g>; break;
    case 'alien': artwork = <g {...common}><ellipse cx="24" cy="20" rx="12" ry="8" /><path d="M18 14 13 7m12 7 5-7" /><circle cx="19" cy="20" r="2" /><circle cx="24" cy="18" r="2" /><circle cx="29" cy="20" r="2" /><path d="m18 27-4 4m16-4 4 4" /></g>; break;
    case 'robot': artwork = <g {...common}><rect x="13" y="11" width="22" height="16" rx="4" /><path d="M24 11V6m-3 0h6M13 20H8m27 0h5" /><circle cx="19" cy="19" r="2" /><circle cx="29" cy="19" r="2" /><circle cx="17" cy="31" r="3" /><circle cx="31" cy="31" r="3" /></g>; break;
  }
  return <svg viewBox="0 0 48 40" aria-hidden="true"><circle cx="24" cy="21" r="13" fill="currentColor" opacity=".12" />{artwork}</svg>;
}

function Setup({ archetype, setArchetype, name, setName, onContinue, onCancel }: { archetype: PetArchetype; setArchetype: (value: PetArchetype) => void; name: string; setName: (value: string) => void; onContinue: () => void; onCancel?: () => void }) { return <section className="new-pal-card new-pal-card--setup"><div className="new-pal-heading"><span className="eyebrow">A new beginning</span><h1>Meet your next pal</h1><p>Choose a kind of creature. Their individual look and home will be a surprise.</p></div><fieldset className="archetype-picker"><legend>Choose an archetype</legend><div>{ARCHETYPES.map((item) => <button type="button" key={item.id} className={archetype === item.id ? 'is-selected' : ''} onClick={() => setArchetype(item.id)} aria-pressed={archetype === item.id}><ArchetypePreview id={item.id} /><span>{item.label}</span></button>)}</div></fieldset><form onSubmit={(event) => { event.preventDefault(); onContinue(); }}><label htmlFor="new-pal-name">What should we call them?</label><div className="name-input"><input id="new-pal-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={18} placeholder="Mochi" autoFocus /><button type="submit">Reveal my pal <span aria-hidden="true">→</span></button></div></form>{onCancel && <button className="new-pal-cancel" onClick={onCancel}>Keep my current pal</button>}</section>; }

function Reveal({ candidate, onCandidateName, onAdopt, onReroll, onBack }: { candidate: PetState; onCandidateName: (name: string) => void; onAdopt: () => void; onReroll: () => void; onBack: () => void }) { const lighting = useWorldLighting(); return <section className="new-pal-card new-pal-card--reveal"><div className="preview-heading"><div><span className="eyebrow">A little reveal</span><h1>Say hello to {candidate.name}</h1><p>{candidate.archetype[0].toUpperCase() + candidate.archetype.slice(1)} · {candidate.habitat.archetype.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ')}</p></div><label className="preview-name">Name<input value={candidate.name} onChange={(event) => onCandidateName(event.target.value)} maxLength={18} /></label></div><div className="preview-room"><PetRoom pet={candidate} lighting={lighting} /><Pet pet={candidate} /></div><div className="reveal-actions"><button className="reveal-secondary" onClick={onBack}>Back</button><button className="reveal-secondary" onClick={onReroll}>Reroll</button><button className="reveal-adopt" onClick={onAdopt}>Adopt {candidate.name} <span aria-hidden="true">→</span></button></div></section>; }

export function NewPalFlow({ onAdopt, onCancel }: { onAdopt: (candidate: PetState) => void; onCancel?: () => void }) { const [stage, setStage] = useState<'setup' | 'reveal'>('setup'); const [archetype, setArchetype] = useState<PetArchetype>('dog'); const [name, setName] = useState(''); const [candidate, setCandidate] = useState<PetState | null>(null); const continueToReveal = () => { const next = createPet(name, archetype); setCandidate(next); setStage('reveal'); }; const reroll = () => { const next = createPet(candidate?.name || name, archetype); setCandidate(next); }; return <main className={`new-pal-flow new-pal-flow--${stage}`}><div className="new-pal-backdrop" />{stage === 'setup' || !candidate ? <Setup archetype={archetype} setArchetype={setArchetype} name={name} setName={setName} onContinue={continueToReveal} onCancel={onCancel} /> : <Reveal candidate={candidate} onCandidateName={(nextName) => setCandidate({ ...candidate, name: nextName })} onAdopt={() => onAdopt(candidate)} onReroll={reroll} onBack={() => { setName(candidate.name); setCandidate(null); setStage('setup'); }} />}</main>; }
