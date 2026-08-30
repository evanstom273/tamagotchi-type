import type { Mood, PetState } from '../types/pet';
import { getMood } from '../game/personality';
import { PetBody } from '../art/pets/PetBody';
import { PetEyes } from '../art/pets/PetEyes';
import { PetMouth } from '../art/pets/PetMouth';
import { PetEffects } from '../art/pets/PetEffects';
export function Pet({ pet }: { pet: PetState }) { const mood: Mood = getMood(pet); return <div className={`pet pet--${mood} ${pet.isSleeping ? 'pet--sleeping' : ''}`}><svg viewBox="0 0 300 230" role="img" aria-label={`${pet.name}, feeling ${mood}`}><PetEffects mood={mood}/><PetBody/><PetEyes mood={mood}/><PetMouth mood={mood}/>{pet.isSleeping && <g className="zzz"><text x="220" y="65">z</text><text x="245" y="40">z</text></g>}</svg></div> }
