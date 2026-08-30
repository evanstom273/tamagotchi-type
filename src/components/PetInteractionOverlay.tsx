import type { ReactNode } from 'react';
import type { PetAppearance, PetArchetype, PetInteractionRegion, PetState } from '../types/pet';

function Regions({ type, appearance, onInteract }: { type: PetArchetype; appearance: PetAppearance; onInteract: (region: PetInteractionRegion, gesture: 'tap' | 'stroke') => void }) {
  const regions: Array<{ id: PetInteractionRegion; shape: ReactNode; label: string }> = [];
  const add = (id: PetInteractionRegion, shape: ReactNode, label: string) => regions.push({ id, shape, label });
  if (type === 'robot') { add('display', <rect x="90" y="105" width="120" height="65" rx="16" />, 'display'); if (appearance.appendageFamily !== 'none') add('antenna', <rect x="132" y="45" width="36" height="55" rx="16" />, 'antenna'); add('body', <rect x="72" y="88" width="156" height="110" rx="24" />, 'body'); }
  else if (type === 'blob') add('body', <path d="M45 100h210v105H45Z" />, 'body');
  else if (type === 'ghost') add('body', <path d="M65 65h170v145H65Z" />, 'ghost body');
  else if (type === 'elemental') { add('core', <circle cx="150" cy="145" r="35" />, 'core'); add('body', <path d="M65 65h170v145H65Z" />, 'body'); }
  else if (type === 'mushroom') { add('cap', <path d="M60 45h180v100H60Z" />, 'cap'); add('body', <rect x="100" y="115" width="100" height="95" rx="20" />, 'stalk'); }
  else if (type === 'golem') { add('core', <circle cx="150" cy="148" r="28" />, 'core'); add('body', <path d="M55 60h190v155H55Z" />, 'stone body'); }
  else if (type === 'alien') { add('eye', <ellipse cx="150" cy="100" rx="82" ry="48" />, 'eyes'); add('body', <ellipse cx="150" cy="155" rx="82" ry="62" />, 'body'); if (appearance.appendageFamily !== 'none') add('antenna', <path d="M75 85 35 35m115 45 40-50" />, 'antennae'); }
  else if (type === 'turtle') { add('shell', <ellipse cx="150" cy="145" rx="100" ry="70" />, 'shell'); add('head', <circle cx="225" cy="150" r="32" />, 'head'); }
  else if (type === 'axolotl') { add('gills', <path d="M45 55h65v75H45Zm195 0h-65v75h65Z" />, 'gills'); add('body', <ellipse cx="150" cy="150" rx="92" ry="72" />, 'body'); }
  else if (type === 'bird' || type === 'bat') { add('wings', <path d="M20 70h105v120H20Zm260 0H175v120h105Z" />, 'wings'); add('body', <ellipse cx="150" cy="145" rx="70" ry="80" />, 'body'); }
  else if (type === 'dragon') { add('wings', <path d="M20 55h115v125H20Zm260 0H165v125h115Z" />, 'wings'); add('head', <ellipse cx="150" cy="105" rx="70" ry="55" />, 'head'); add('tail', <path d="M190 160h100v55H190Z" />, 'tail'); }
  else { add('head', <ellipse cx="150" cy="105" rx="78" ry="58" />, 'head'); add('body', <ellipse cx="150" cy="160" rx="90" ry="65" />, 'body'); if (appearance.tailFamily !== 'none') add('tail', <path d="M195 150h100v70H195Z" />, 'tail'); if (appearance.appendageFamily !== 'none') add('head', <path d="M55 90h190v50H55Z" />, 'ears'); }
  return <>{regions.map(({ id, shape, label }) => <g key={id} role="button" tabIndex={0} aria-label={`Interact with ${label}`} onPointerUp={(event) => { const started = Number(event.currentTarget.getAttribute('data-pressed-at') || Date.now()); onInteract(id, Date.now() - started > 280 ? 'stroke' : 'tap'); }} onPointerDown={(event) => event.currentTarget.setAttribute('data-pressed-at', String(Date.now()))} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onInteract(id, 'tap'); } }}>{shape}</g>)}</>;
}

export function PetInteractionOverlay({ pet, position, onInteract }: { pet: PetState; position: number; onInteract: (region: PetInteractionRegion, gesture: 'tap' | 'stroke') => void }) {
  return <div className={`pet-interaction-overlay pet--${pet.archetype}`} style={{ left: `${position}%` }}><svg viewBox="0 0 300 230" aria-label={`${pet.name} interaction areas`}><Regions type={pet.archetype} appearance={pet.appearance} onInteract={onInteract} /></svg></div>;
}
