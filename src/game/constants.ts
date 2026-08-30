export const STAT_MIN = 0;
export const STAT_MAX = 100;
export const MS_PER_DAY = 86_400_000;
export const INITIAL_NEEDS = { hunger: 78, sleep: 82, hygiene: 86, social: 72, bladder: 91, fun: 74, affection: 80, nutrition: 88 } as const;
export const INITIAL_HEALTH = 96;
export const TICK_MS = 60_000;
export const DEFAULT_SCHEDULE = { bedtime: '23:00', wakeTime: '08:00' } as const;
export const WORLD_MINUTE_REAL_MS = 2_000;
export const WORLD_MINUTES_PER_DAY = 1_440;

export const clampStat = (value: number): number => Math.max(STAT_MIN, Math.min(STAT_MAX, Math.round(value)));
