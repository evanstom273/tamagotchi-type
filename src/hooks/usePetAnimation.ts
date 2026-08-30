import { useEffect, useRef, useState } from 'react';
import type { PetAnimationState, PetBehavior, PetReaction, PetState } from '../types/pet';
import { getMood } from '../game/personality';

function moodAnimation(pet: PetState): PetAnimationState {
  const mood = getMood(pet);
  if (mood === 'tired') return 'tired';
  if (mood === 'hungry') return 'hungry';
  if (mood === 'sad') return 'sad';
  if (mood === 'happy') return 'happy';
  return 'idle';
}

function behaviorAnimation(pet: PetState, behavior: PetBehavior): PetAnimationState {
  if (pet.isSleeping || behavior === 'sleeping') return 'sleeping';
  if (behavior === 'playing') return 'playing';
  if (behavior === 'resting') return 'tired';
  return moodAnimation(pet);
}

export function usePetAnimation(pet: PetState | null, behavior: PetBehavior, reaction: PetReaction | null) {
  const [state, setState] = useState<PetAnimationState>(() => pet ? moodAnimation(pet) : 'idle');
  const [motionNonce, setMotionNonce] = useState(0);
  const reactionNonce = reaction?.nonce ?? 0;
  const lastReaction = useRef(0);
  const reactionUntil = useRef(0);

  useEffect(() => {
    if (!pet || !reaction || reaction.nonce === lastReaction.current) return;
    lastReaction.current = reaction.nonce;
    reactionUntil.current = Date.now() + (reaction.state === 'going-to-sleep' ? 1300 : 950);
    setState(reaction.state);
    setMotionNonce((value) => value + 1);
    const timer = window.setTimeout(() => setState(behaviorAnimation(pet, behavior)), reaction.state === 'going-to-sleep' ? 1300 : 950);
    return () => window.clearTimeout(timer);
  }, [behavior, pet, reaction, reactionNonce]);

  useEffect(() => {
    if (!pet || Date.now() < reactionUntil.current) return;
    setState(behaviorAnimation(pet, behavior));
  }, [behavior, pet, reactionNonce]);

  useEffect(() => {
    if (!pet || pet.isSleeping) return;
    const delay = 4200 + Math.random() * 5200;
    const timer = window.setTimeout(() => {
      const next: PetAnimationState = pet.needs.sleep < 42 ? 'yawning' : pet.needs.fun < 42 ? 'bored' : pet.personality.curiosity > 68 ? 'look' : pet.personality.activity > 68 ? 'stretching' : 'blink';
      setState(next);
      setMotionNonce((value) => value + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [pet, state]);

  useEffect(() => {
    const node = document.querySelector('.room-canvas .pet');
    if (!node) return;
    [...node.classList].filter((name) => name.startsWith('pet--anim-')).forEach((name) => node.classList.remove(name));
    node.classList.add(`pet--anim-${state}`);
    node.setAttribute('data-motion', String(motionNonce));
  }, [motionNonce, state]);

  return { state, motionNonce };
}
