import { useEffect, useRef, useState } from 'react';
import type { PetBehavior, PetState } from '../types/pet';

type Runtime = { petId: string | undefined; position: number; target: number; behavior: PetBehavior; pauseUntil: number };
const fallbackPersonality = { activity: 60, sociability: 55, curiosity: 50, sleepiness: 45, mischief: 35, touchTolerance: 60, preferredActivity: 'explore' as const };

function chooseDestination(pet: PetState) {
  const personality = pet.personality ?? fallbackPersonality;
  const needs = pet.needs;
  if (needs.sleep < 34 || personality.sleepiness > 82 && needs.sleep < 58) return { target: pet.habitat.waypoints.sleepArea, behavior: 'resting' as PetBehavior };
  if (needs.hunger < 35 || needs.nutrition < 35) return { target: pet.habitat.waypoints.feedArea, behavior: 'inspecting' as PetBehavior };
  if (needs.fun < 38 || personality.preferredActivity === 'play' && personality.mischief > 55) return { target: pet.habitat.waypoints.playArea, behavior: 'playing' as PetBehavior };
  if (needs.social < 38 || needs.affection < 38 || personality.preferredActivity === 'social') return { target: pet.habitat.waypoints.idleArea, behavior: 'inspecting' as PetBehavior };
  if (personality.preferredActivity === 'rest' || Math.random() > personality.activity / 100) return { target: pet.habitat.waypoints.idleArea, behavior: 'idle' as PetBehavior };
  if (personality.curiosity > 55 && Math.random() > .35) return { target: pet.habitat.waypoints.viewArea, behavior: 'inspecting' as PetBehavior };
  const choices = [pet.habitat.waypoints.playArea, pet.habitat.waypoints.idleArea, pet.habitat.waypoints.viewArea];
  return { target: choices[Math.floor(Math.random() * choices.length)], behavior: 'wandering' as PetBehavior };
}

export function usePetBehavior(pet: PetState | null, interactionAt?: number, speed = 1) {
  const [runtime, setRuntime] = useState<Runtime>(() => ({ petId: pet?.id, position: pet?.habitat.waypoints.idleArea ?? 50, target: pet?.habitat.waypoints.idleArea ?? 50, behavior: 'idle', pauseUntil: Date.now() + 1800 }));
  const petId = pet?.id;
  const petRef = useRef<PetState | null>(null);
  useEffect(() => { petRef.current = pet; }, [pet]);
  useEffect(() => {
    if (!petId) return;
    const timer = window.setInterval(() => setRuntime((current) => {
      const activePet = petRef.current;
      if (!activePet) return current;
      const now = Date.now();
      if (interactionAt && now - interactionAt < 1250) return { ...current, pauseUntil: Math.max(current.pauseUntil, interactionAt + 1250) };
      if (current.petId !== activePet.id) return { petId: activePet.id, position: activePet.habitat.waypoints.idleArea, target: activePet.habitat.waypoints.idleArea, behavior: 'idle', pauseUntil: now + 1200 };
      if (activePet.isSleeping) return { petId: activePet.id, position: activePet.habitat.waypoints.sleepArea, target: activePet.habitat.waypoints.sleepArea, behavior: 'sleeping', pauseUntil: now + 1000 };
      if (now < current.pauseUntil) return current;
      if (Math.abs(current.target - current.position) > 1.5) {
        const direction = current.target > current.position ? 1 : -1;
        return { ...current, position: current.position + direction * Math.min(4 * speed, Math.abs(current.target - current.position)), behavior: current.behavior === 'idle' ? 'wandering' : current.behavior };
      }
      const destination = chooseDestination(activePet);
      return { petId: activePet.id, position: current.position, target: destination.target, behavior: destination.behavior, pauseUntil: now + (1800 + Math.random() * 4200) / speed };
    }), 700);
    return () => window.clearInterval(timer);
  }, [interactionAt, petId, speed]);
  return runtime;
}
