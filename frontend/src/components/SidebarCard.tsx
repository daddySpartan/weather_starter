import { useStore } from '../state/store';
import { CloseIcon, CloudIcon, HomeIcon } from './icons';
import { formatTemperature, formatTime } from './format';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { Location } from '../types';

interface SidebarCardProps {
  location: Location;
  isHome: boolean;
}

export function SidebarCard({ location, isHome }: SidebarCardProps) {
  const { selectedId, select, remove } = useStore();
  const isSelected = selectedId === location.id;
  const observed = formatTime(location.weather.observed_at);
  const area =
    location.weather.area || `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`;
  const condition = location.weather.condition || '-';
  const temperature = formatTemperature(location.weather.temperature_c);
  const high = formatTemperature(location.weather.forecast_high_c);
  const low = formatTemperature(location.weather.forecast_low_c);
  const humidity = formatPercent(location.weather.humidity_percent);
  const rainfall = formatRainfall(location.weather.rainfall_mm);

  const onSelect = () => select(location.id);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  const onDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    await remove(location.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      aria-pressed={isSelected}
      className={`relative w-full cursor-pointer overflow-hidden rounded-2xl border text-left backdrop-blur-xl transition ${
        isSelected
          ? 'border-white/30 bg-white/20 shadow-lg shadow-black/20'
          : 'border-white/10 bg-white/[0.07] hover:bg-white/[0.12]'
      }`}
    >
      <button
        type="button"
        aria-label={`Delete ${area}`}
        onClick={onDelete}
        onKeyDown={(event) => event.stopPropagation()}
        className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-black/20 p-1.5 text-white/65 transition hover:bg-black/35 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
      <div className="flex items-start justify-between gap-3 px-4 pt-3">
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold leading-tight text-white">{area}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/70">
            {isHome ? (
              <>
                <span>My Location</span>
                <span className="text-white/40">·</span>
                <HomeIcon className="h-3 w-3" />
                <span>Home</span>
              </>
            ) : observed ? (
              <span>{observed}</span>
            ) : (
              <span className="text-white/50">Not refreshed</span>
            )}
          </div>
        </div>
        <div className="text-3xl font-light tabular-nums text-white/90">{temperature}</div>
      </div>
      <div className="mt-3 space-y-2 border-t border-white/10 px-4 py-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/80">
            <CloudIcon className="h-4 w-4 text-white/70" />
            <span>{condition}</span>
          </div>
          <div className="text-white/60 tabular-nums">
            H:{high} L:{low}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-white/65">
          <div className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1">
            Humidity <span className="tabular-nums text-white/80">{humidity}</span>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1">
            Rain <span className="tabular-nums text-white/80">{rainfall}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPercent(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '--';
  return `${Math.round(value)}%`;
}

function formatRainfall(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-- mm';
  return `${value.toFixed(1)} mm`;
}
