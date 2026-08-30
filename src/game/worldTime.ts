import type { WorldLighting } from '../types/world';

// Broad, overlapping-feeling periods keep the room from flipping between two colors.
export function getWorldLighting(date = new Date()): WorldLighting {
  const hour = date.getHours() + date.getMinutes() / 60;
  if (hour >= 6 && hour < 9) return { period: 'morning', label: 'Morning light', hour, darkness: 0.08, isNight: false };
  if (hour >= 9 && hour < 17) return { period: 'daytime', label: 'Daytime', hour, darkness: 0, isNight: false };
  if (hour >= 17 && hour < 21) return { period: 'evening', label: 'Evening glow', hour, darkness: 0.35, isNight: true };
  return { period: 'nighttime', label: 'Nighttime', hour, darkness: 0.78, isNight: true };
}
