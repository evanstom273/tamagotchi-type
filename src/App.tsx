import { useEffect, useState } from 'react';
import { ActionBar } from './components/ActionBar';
import { EventMessage } from './components/EventMessage';
import { GameDrawer } from './components/GameDrawer';
import { Pet } from './components/Pet';
import { PetRoom } from './components/PetRoom';
import { usePet } from './hooks/usePet';
import { useTheme } from './hooks/useTheme';
import { useWorldLighting } from './hooks/useWorldLighting';
import { getMood, moodCopy } from './game/personality';
import { ARCHETYPES } from './data/archetypes';
import type { PetArchetype } from './types/pet';
import './App.css';
import './theme.css';
import './responsive.css';

function App() {
  const { pet, message, start, feed, play, clean, toggleSleep, setSchedule } = usePet();
  const { preference, setPreference } = useTheme();
  const lighting = useWorldLighting();
  const [name, setName] = useState('');
  const [archetype, setArchetype] = useState<PetArchetype>('dog');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setClock(new Date()), 30_000); return () => window.clearInterval(timer); }, []);
  if (!pet) return <main className="welcome"><div className="welcome__mark"><span /><span /><span /></div><p className="eyebrow">Pocket Pals · v0.1</p><h1>A tiny room<br /><em>for a tiny friend.</em></h1><p className="welcome__copy">Choose a kind of companion. Their individual look and home will be a surprise.</p><fieldset className="archetype-picker"><legend>Choose a kind of pal</legend><div>{ARCHETYPES.map((item) => <button type="button" key={item.id} className={archetype === item.id ? 'is-selected' : ''} onClick={() => setArchetype(item.id)} aria-pressed={archetype === item.id}><svg viewBox="0 0 48 40" aria-hidden="true"><circle cx="24" cy="21" r="13" fill="currentColor" opacity=".25" /><path d={item.id === 'robot' ? 'M15 14h18v16H15z' : item.id === 'bird' ? 'm14 23 10-12 10 12-10 9Z' : item.id === 'rabbit' ? 'M19 15 17 4m12 11 2-11' : item.id === 'dragon' ? 'M12 24 5 16l10 2 9-9 9 9 10-2-7 8' : 'M12 25c0-10 7-15 12-15s12 5 12 15c-4 7-20 7-24 0Z'} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><span>{item.label}</span></button>)}</div></fieldset><form onSubmit={(event) => { event.preventDefault(); start(name, archetype); }}><label htmlFor="pet-name">What should we call them?</label><div className="name-input"><input id="pet-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={18} placeholder="Mochi" autoFocus /><button type="submit">Bring them home <span aria-hidden="true">→</span></button></div></form><div className="welcome__note"><span className="note-dot" /> All progress is saved on this device</div></main>;
  const mood = getMood(pet);
  return <main className="game-screen"><header className="app-topbar"><div className="topbar-pet"><strong>{pet.name}</strong><span>{moodCopy[mood].label} · Day {Math.max(1, Math.floor(pet.age) + 1)}</span></div><time dateTime={clock.toISOString()}>{new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(clock)}</time></header><section className="room-stage" aria-label="Pocket Pals room"><div className="room-canvas"><PetRoom pet={pet} lighting={lighting} /><Pet pet={pet} /></div><EventMessage message={message} /></section><section className="action-dock" aria-label="Primary interactions"><ActionBar onFeed={feed} onPlay={play} onClean={clean} onSleep={toggleSleep} onMenu={() => setDrawerOpen(true)} sleeping={pet.isSleeping} /></section><GameDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} pet={pet} preference={preference} onThemeChange={setPreference} onScheduleChange={setSchedule} onNewPal={() => { localStorage.removeItem('pocket-pals-pet-v1'); window.location.reload(); }} /></main>;
}

export default App;
