import type { PocketWorldDate, WorldLighting } from '../types/world';
import { WORLD_MINUTES_PER_DAY } from './constants';

export const WORLD_MONTHS = [
  { name: 'January', days: 31 }, { name: 'February', days: 28 }, { name: 'March', days: 31 },
  { name: 'April', days: 30 }, { name: 'May', days: 31 }, { name: 'June', days: 30 },
  { name: 'July', days: 31 }, { name: 'August', days: 31 }, { name: 'September', days: 30 },
  { name: 'October', days: 31 }, { name: 'November', days: 30 }, { name: 'December', days: 31 },
] as const;
export const WORLD_WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export const WORLD_YEAR_MINUTES = 365 * WORLD_MINUTES_PER_DAY;

export function getPocketWorldDate(totalMinutes: number): PocketWorldDate {
  const safeMinutes = Math.max(0, Math.floor(totalMinutes));
  const dayIndex = Math.floor(safeMinutes / WORLD_MINUTES_PER_DAY);
  const dayOfYear = dayIndex % 365;
  let remaining = dayOfYear;
  let month = 0;
  while (remaining >= WORLD_MONTHS[month].days) { remaining -= WORLD_MONTHS[month].days; month += 1; }
  const hour = Math.floor((safeMinutes % WORLD_MINUTES_PER_DAY) / 60);
  const minute = safeMinutes % 60;
  return { totalMinutes: safeMinutes, minute, hour, day: remaining + 1, month: month + 1, monthName: WORLD_MONTHS[month].name, year: Math.floor(dayIndex / 365) + 1, weekday: dayIndex % 7, weekdayName: WORLD_WEEKDAYS[dayIndex % 7], timeLabel: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`, dateLabel: `${WORLD_WEEKDAYS[dayIndex % 7]} ${remaining + 1} ${WORLD_MONTHS[month].name} · Year ${Math.floor(dayIndex / 365) + 1}` };
}

// Broad, overlapping-feeling periods keep the room from flipping between two colors.
export function getWorldLighting(totalMinutes = 720): WorldLighting {
  const hour = ((totalMinutes % WORLD_MINUTES_PER_DAY) + WORLD_MINUTES_PER_DAY) % WORLD_MINUTES_PER_DAY / 60;
  if (hour >= 6 && hour < 9) return { period: 'morning', label: 'Morning light', hour, darkness: 0.08, isNight: false };
  if (hour >= 9 && hour < 17) return { period: 'daytime', label: 'Daytime', hour, darkness: 0, isNight: false };
  if (hour >= 17 && hour < 21) return { period: 'evening', label: 'Evening glow', hour, darkness: 0.35, isNight: true };
  return { period: 'nighttime', label: 'Nighttime', hour, darkness: 0.78, isNight: true };
}
