import { useState } from 'react';
import { ActionBar } from './components/ActionBar';
import { EventMessage } from './components/EventMessage';
import { Pet } from './components/Pet';
import { PetRoom } from './components/PetRoom';
import { StatusBar } from './components/StatusBar';
import { usePet } from './hooks/usePet';
import './App.css';

function App() {
  const { pet, message, start, feed, play, clean, toggleSleep } = usePet();
  const [name, setName] = useState('');
  if (!pet) return <main className="welcome"><div className="welcome__mark"><span/><span/><span/></div><p className="eyebrow">Pocket Pals · v0.1</p><h1>A tiny room<br/><em>for a tiny friend.</em></h1><p className="welcome__copy">Name your new companion. They’ll be waiting in their room whenever you come back.</p><form onSubmit={(event) => { event.preventDefault(); start(name); }}><label htmlFor="pet-name">What should we call them?</label><div className="name-input"><input id="pet-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={18} placeholder="Mochi" autoFocus/><button type="submit">Bring them home <span>→</span></button></div></form><div className="welcome__note"><span className="note-dot"/> All progress is saved on this device</div></main>;
  return <main className="app-shell"><header className="topbar"><div className="brand"><span className="brand__dot"/><span>Pocket Pals</span><small>v0.1</small></div><div className="topbar__right"><span className="save-state"><span/>Saved locally</span><button className="reset" onClick={() => { localStorage.removeItem('pocket-pals-pet-v1'); window.location.reload(); }}>New pal</button></div></header><div className="game-layout"><section className="play-area"><div className="play-area__intro"><p className="eyebrow">A little world, all yours</p><h1>{pet.name}<span className="heart">♥</span></h1></div><div className="room-wrap"><PetRoom pet={pet}/><Pet pet={pet}/></div><EventMessage message={message}/></section><section className="control-area"><StatusBar pet={pet}/><ActionBar onFeed={feed} onPlay={play} onClean={clean} onSleep={toggleSleep} sleeping={pet.isSleeping}/><p className="tip">Tip: needs drift while you’re away, too.</p></section></div><footer className="footer"><span>Look after your pal a little each day.</span><span className="footer__paw">● · ●</span></footer></main>;
}
export default App;
