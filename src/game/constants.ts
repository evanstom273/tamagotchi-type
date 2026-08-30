export const STAT_MIN = 0;
export const STAT_MAX = 100;
export const MS_PER_DAY = 86_400_000;
export const INITIAL_STATS = { hunger: 78, happiness: 72, energy: 82, hygiene: 86, health: 96 } as const;
export const TICK_MS = 60_000;

export const clampStat = (value: number): number => Math.max(STAT_MIN, Math.min(STAT_MAX, Math.round(value)));
