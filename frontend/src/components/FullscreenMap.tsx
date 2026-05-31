import { useEffect, useRef } from 'react';
import { CloseIcon, MapIcon } from './icons';
import { WeatherMap } from './WeatherMap';
import type { Location } from '../types';

interface FullscreenMapProps {
  isOpen: boolean;
  locations: Location[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onClose: () => void;
}

export function FullscreenMap({
  isOpen,
  locations,
  selectedId,
  onSelect,
  onClose,
}: FullscreenMapProps) {
  const previousOverflow = useRef<string>('');

  useEffect(() => {
    if (!isOpen) return;

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow.current;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-slate-950/55 px-3 py-3 backdrop-blur-md sm:px-5 sm:py-5"
      role="dialog"
      aria-modal="true"
      aria-label="Weather map"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="weather-map-overlay relative flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-slate-900/80 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950/45 to-transparent" />
        <div className="relative z-10 flex items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
              <MapIcon className="h-3.5 w-3.5" />
              <span>Weather Map</span>
            </div>
            <p className="mt-2 max-w-xl text-sm text-white/78">
              All saved locations on one map. Click any pin to sync the dashboard forecast.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-2 text-sm font-medium text-white/88 backdrop-blur-xl hover:bg-white/[0.15]"
          >
            <CloseIcon className="h-4 w-4" />
            <span>Close</span>
          </button>
        </div>
        <div className="relative z-10 flex-1 px-3 pb-3 sm:px-4 sm:pb-4">
          <div className="h-full min-h-[24rem] overflow-hidden rounded-[1.75rem] border border-white/12">
            <WeatherMap
              locations={locations}
              selectedId={selectedId}
              onSelect={onSelect}
              mode="fullscreen"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
