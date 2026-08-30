import { useWorldClock } from '../hooks/useWorldClock';

export function WorldClockHud() {
  const { date, speed, setSpeed } = useWorldClock();
  return <div className="world-clock-hud" aria-label="Pocket Pals world clock"><div className="world-clock-copy"><strong>{date.timeLabel}</strong><span>{date.weekdayName.slice(0, 3)} · {date.day} {date.monthName.slice(0, 3)} · Y{date.year}</span></div><div className="world-speed" role="group" aria-label="Simulation speed">{([1, 2, 4, 8] as const).map((value) => <button key={value} type="button" className={speed === value ? 'is-selected' : ''} aria-pressed={speed === value} onClick={() => setSpeed(value)}>{value}×</button>)}</div></div>;
}
