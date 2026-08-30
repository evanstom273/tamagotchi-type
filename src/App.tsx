import { useState } from 'react';
import { ActionBar } from './components/ActionBar';
import { EventMessage } from './components/EventMessage';
import { GameDrawer } from './components/GameDrawer';
import { Pet } from './components/Pet';
import { PetRoom } from './components/PetRoom';
import { usePet } from './hooks/usePet';
import { useTheme } from './hooks/useTheme';
import { useWorldLighting } from './hooks/useWorldLighting';
import { getMood, moodCopy } from './game/personality';
import './App.css';
import './theme.css';
import './responsive.css';

function DrawerIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }

function App() {
  const { pet, message, start, feed, play, clean, toggleSleep } = usePet();
  const { preference, setPreference } = useTheme();
  const lighting = useWorldLighting();
  const [name, setName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  if (!pet) return <main className="welcome"><div className="welcome__mark"><span /><span /><span /></div><p className="eyebrow">Pocket Pals · v0.1</p><h1>A tiny room<br /><em>for a tiny friend.</em></h1><p className="welcome__copy">Name your new companion. They’ll be waiting in their room whenever you come back.</p><form onSubmit={(event) => { event.preventDefault(); start(name); }}><label htmlFor="pet-name">What should we call them?</label><div className="name-input"><input id="pet-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={18} placeholder="Mochi" autoFocus /><button type="submit">Bring them home <span aria-hidden="true">→</span></button></div></form><div className="welcome__note"><span className="note-dot" /> All progress is saved on this device</div></main>;
  const mood = getMood(pet);
  return <main className="game-screen"><section className="room-stage" aria-label="Pocket Pals room"><PetRoom pet={pet} lighting={lighting} /><Pet pet={pet} /><div className="game-hud game-hud--identity"><span className="hud-name">{pet.name}</span><span className="hud-meta">{moodCopy[mood].label} · Day {Math.max(1, Math.floor(pet.age) + 1)}</span></div><div className="game-hud game-hud--world"><span className="hud-signal" />{lighting.label}</div><EventMessage message={message} /><button className="drawer-trigger" aria-label={drawerOpen ? 'Close game drawer' : 'Open game drawer'} aria-expanded={drawerOpen} onClick={() => setDrawerOpen((open) => !open)}><DrawerIcon /></button></section><section className="action-dock" aria-label="Primary interactions"><ActionBar onFeed={feed} onPlay={play} onClean={clean} onSleep={toggleSleep} sleeping={pet.isSleeping} /></section><GameDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} pet={pet} preference={preference} onThemeChange={setPreference} onNewPal={() => { localStorage.removeItem('pocket-pals-pet-v1'); window.location.reload(); }} /></main>;
}

export default App;
