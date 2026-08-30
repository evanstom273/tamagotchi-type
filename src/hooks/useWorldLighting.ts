import { useEffect, useState } from 'react';
import { getWorldLighting } from '../game/worldTime';

export function useWorldLighting() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 60_000); return () => window.clearInterval(timer); }, []);
  return getWorldLighting(now);
}
