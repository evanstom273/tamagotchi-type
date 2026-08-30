import { createPet } from '../game/simulation';
import { generateAppearance, generateHabitat } from '../game/generation';
import { Pet } from './Pet';
import { PetRoom } from './PetRoom';
import { getWorldLighting } from '../game/worldTime';
import type { PetArchetype } from '../types/pet';

const PETS: PetArchetype[] = ['cat', 'robot', 'alien', 'dragon', 'blob'];
const HABITATS = ['cosy-house', 'spaceship', 'crystal-cavern', 'haunted-mansion', 'woodland-den'];
const sampleTime = new Date(2026, 5, 15, 14, 0);

function PetSample({ archetype, index }: { archetype: PetArchetype; index: number }) { const pet = createPet('', archetype, 1_750_000_000_000 + index); return <div className="showcase-pet"><Pet pet={pet} /></div>; }
function HabitatSample({ habitat, index }: { habitat: string; index: number }) { const pet = createPet('', 'dog', 1_750_000_000_000 + index); pet.habitat = { ...generateHabitat('dog', pet.generationSeed + index), archetype: habitat }; pet.appearance = generateAppearance('dog', pet.generationSeed + index); return <div className="showcase-habitat"><PetRoom pet={pet} lighting={getWorldLighting(sampleTime)} /></div>; }

export function Showcase({ mode }: { mode: 'pets' | 'habitats' }) { const isPets = mode === 'pets'; return <main className={`showcase showcase--${mode}`} aria-label="Unlabeled visual showcase"><div className="showcase-grid">{isPets ? PETS.map((archetype, index) => <PetSample key={archetype} archetype={archetype} index={index} />) : HABITATS.map((habitat, index) => <HabitatSample key={habitat} habitat={habitat} index={index} />)}</div></main>; }
