import type { PetState } from '../types/pet';
import type { ThemePreference } from '../hooks/useTheme';
import { StatusBar } from './StatusBar';
import { ThemeControl } from './ThemeControl';

function CloseIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }

export function GameDrawer({ open, onClose, pet, preference, onThemeChange, onNewPal }: { open: boolean; onClose: () => void; pet: PetState; preference: ThemePreference; onThemeChange: (value: ThemePreference) => void; onNewPal: () => void }) {
  return <><button className={`drawer-backdrop ${open ? 'is-open' : ''}`} aria-label="Close game drawer" tabIndex={open ? 0 : -1} onClick={onClose} /><aside className={`game-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open} aria-label="Game drawer"><div className="drawer-head"><div><span className="eyebrow">Pocket Pals</span><h2>{pet.name}'s drawer</h2></div><button className="drawer-close" aria-label="Close game drawer" onClick={onClose}><CloseIcon /></button></div><div className="drawer-scroll"><StatusBar pet={pet} /><section className="drawer-settings"><span className="eyebrow">Atmosphere</span><div className="drawer-setting-row"><div><strong>Theme</strong><small>Choose your room-side palette</small></div><ThemeControl preference={preference} onChange={onThemeChange} /></div></section><section className="drawer-settings"><span className="eyebrow">Housekeeping</span><button className="new-pal" onClick={onNewPal}>Start with a new pal <span aria-hidden="true">→</span></button></section></div></aside></>;
}
