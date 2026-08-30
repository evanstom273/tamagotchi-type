export type WorldPeriod = 'morning' | 'daytime' | 'evening' | 'nighttime';

export interface WorldLighting {
  period: WorldPeriod;
  label: string;
  hour: number;
  darkness: number;
  isNight: boolean;
}
