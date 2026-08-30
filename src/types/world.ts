export type WorldPeriod = 'morning' | 'daytime' | 'evening' | 'nighttime';

export interface WorldLighting {
  period: WorldPeriod;
  label: string;
  hour: number;
  darkness: number;
  isNight: boolean;
}

export type SimulationSpeed = 1 | 2 | 4 | 8;
export interface PocketWorldDate {
  totalMinutes: number;
  minute: number;
  hour: number;
  day: number;
  month: number;
  monthName: string;
  year: number;
  weekday: number;
  weekdayName: string;
  timeLabel: string;
  dateLabel: string;
}
