import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { ActionBar } from './components/ActionBar';
import { EventMessage } from './components/EventMessage';
import { GameDrawer } from './components/GameDrawer';
import { NewPalFlow } from './components/NewPalFlow';
import { Pet } from './components/Pet';
import { PetRoom } from './components/PetRoom';
import { PetInteractionOverlay } from './components/PetInteractionOverlay';
import { usePet } from './hooks/usePet';
import { useTheme } from './hooks/useTheme';
import { useWorldLighting } from './hooks/useWorldLighting';
import { getMood, moodCopy } from './game/personality';
import { usePetBehavior } from './hooks/usePetBehavior';
import { usePetAnimation } from './hooks/usePetAnimation';
import { useWorldClock } from './hooks/useWorldClock';
import './App.css';
import './theme.css';
import './responsive.css';

function App() {
  const worldClock = useWorldClock();
  const { pet, message, reaction, adopt, feed, play, clean, toggleSleep, setSchedule, interact } = usePet(worldClock.totalMinutes, worldClock.speed);
  const behavior = usePetBehavior(pet, reaction?.nonce, worldClock.speed);
  usePetAnimation(pet, behavior.behavior, reaction);
  const { preference, setPreference } = useTheme();
  const lighting = useWorldLighting(worldClock.totalMinutes);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newPalOpen, setNewPalOpen] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setClock(new Date()), 30_000); return () => window.clearInterval(timer); }, []);
  if (!pet) return <NewPalFlow onAdopt={adopt} />;
  const mood = getMood(pet);
  return <main className="game-screen"><header className="app-topbar"><div className="topbar-pet"><strong>{pet.name}</strong><span>{moodCopy[mood].label} · Day {Math.max(1, Math.floor(pet.age) + 1)}</span></div><time dateTime={clock.toISOString()}>{new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(clock)}</time></header><section className="room-stage" aria-label="Pocket Pals room"><div className="room-canvas" style={{ '--pet-position': `${behavior.position}%` } as CSSProperties}><PetRoom pet={pet} lighting={lighting} /><Pet pet={pet} /><PetInteractionOverlay pet={pet} position={behavior.position} onInteract={interact} /></div><EventMessage message={message} /></section><section className="action-dock" aria-label="Primary interactions"><ActionBar onFeed={feed} onPlay={play} onClean={clean} onSleep={toggleSleep} onMenu={() => setDrawerOpen(true)} sleeping={pet.isSleeping} /></section><GameDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} pet={pet} preference={preference} onThemeChange={setPreference} onScheduleChange={setSchedule} onNewPal={() => { setDrawerOpen(false); setNewPalOpen(true); }} />{newPalOpen && <NewPalFlow onAdopt={(candidate) => { adopt(candidate); setNewPalOpen(false); }} onCancel={() => setNewPalOpen(false)} />}</main>;
}

export default App;
