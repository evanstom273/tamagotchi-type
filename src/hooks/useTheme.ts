import { useEffect, useState } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
const THEME_KEY = 'pocket-pals-theme-v1';

function readPreference(): ThemePreference {
  const saved = localStorage.getItem(THEME_KEY);
  return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(readPreference);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const resolvedTheme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useEffect(() => { localStorage.setItem(THEME_KEY, preference); document.documentElement.dataset.theme = resolvedTheme; }, [preference, resolvedTheme]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return { preference, resolvedTheme, setPreference };
}
