import { useEffect, useState } from 'react';

type ThemeId =
  | 'apple'
  | 'sunprint'
  | 'nordic'
  | 'storm'
  | 'citrus'
  | 'moss'
  | 'neon'
  | 'coastal'
  | 'terminal'
  | 'alpine'
  | 'desert'
  | 'aurora'
  | 'metro'
  | 'ink'
  | 'playroom'
  | 'brutalist'
  | 'zen'
  | 'vintage'
  | 'midnight';

const THEME_STORAGE_KEY = 'weather-starter.theme';

const THEME_OPTIONS: Array<{ id: ThemeId; label: string }> = [
  { id: 'apple', label: 'Apple' },
  { id: 'sunprint', label: 'Sunprint Editorial' },
  { id: 'nordic', label: 'Nordic Air' },
  { id: 'storm', label: 'Storm Radar Pro' },
  { id: 'citrus', label: 'Citrus Pop' },
  { id: 'moss', label: 'Moss & Mist' },
  { id: 'neon', label: 'Neon Night Transit' },
  { id: 'coastal', label: 'Coastal Postcard' },
  { id: 'terminal', label: 'Terminal Isobar' },
  { id: 'alpine', label: 'Alpine Signal' },
  { id: 'desert', label: 'Desert Weather Bureau' },
  { id: 'aurora', label: 'Aurora Glass' },
  { id: 'metro', label: 'Metro Fold' },
  { id: 'ink', label: 'Ink Rain' },
  { id: 'playroom', label: 'Playroom Forecast' },
  { id: 'brutalist', label: 'Brutalist Climate Board' },
  { id: 'zen', label: 'Zen Observatory' },
  { id: 'vintage', label: 'Vintage Instrument Panel' },
  { id: 'midnight', label: 'Midnight' },
];

function readStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return 'apple';

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (
    stored === 'apple' ||
    stored === 'sunprint' ||
    stored === 'nordic' ||
    stored === 'storm' ||
    stored === 'citrus' ||
    stored === 'moss' ||
    stored === 'neon' ||
    stored === 'coastal' ||
    stored === 'terminal' ||
    stored === 'alpine' ||
    stored === 'desert' ||
    stored === 'aurora' ||
    stored === 'metro' ||
    stored === 'ink' ||
    stored === 'playroom' ||
    stored === 'brutalist' ||
    stored === 'zen' ||
    stored === 'vintage' ||
    stored === 'midnight'
  ) {
    return stored;
  }
  return 'apple';
}

export function ThemeSelector() {
  const [theme, setTheme] = useState<ThemeId>(() => readStoredTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div className="theme-selector rounded-2xl border border-white/20 bg-black/25 px-3 py-2 backdrop-blur-2xl">
      <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
        <span>Theme</span>
        <select
          value={theme}
          onChange={(event) => setTheme(event.target.value as ThemeId)}
          aria-label="Select visual theme"
          className="rounded-md border border-white/20 bg-white/[0.12] px-2 py-1 text-xs font-medium normal-case tracking-normal text-white outline-none hover:bg-white/[0.18]"
        >
          {THEME_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}