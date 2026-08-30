import { getWorldLighting } from '../game/worldTime';

export function useWorldLighting(totalMinutes = 720) {
  return getWorldLighting(totalMinutes);
}
