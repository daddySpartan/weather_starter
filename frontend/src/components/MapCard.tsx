import { useMemo, useState } from 'react';
import { ExpandIcon, MapIcon } from './icons';
import { FullscreenMap } from './FullscreenMap';
import { WeatherMap } from './WeatherMap';
import type { Location } from '../types';

interface MapCardProps {
  locations: Location[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function MapCard({ locations, selectedId, onSelect }: MapCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const summary = useMemo(() => {
    const count = locations.length;
    const selected = locations.find((location) => location.id === selectedId) ?? locations[0] ?? null;
    const area = selected?.weather.area ?? (selected ? formatCoordinates(selected) : 'Singapore');

    return {
      countLabel: `${count} saved location${count === 1 ? '' : 's'}`,
      area,
    };
  }, [locations, selectedId]);

  return (
    <>
      <section className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.08] p-4 backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                <MapIcon className="h-3.5 w-3.5" />
                <span>Weather Map</span>
              </div>
              <h2 className="mt-2 text-2xl font-light text-white">Saved locations across Singapore</h2>
              <p className="mt-1 text-sm text-white/72">
                {summary.countLabel}. Tap a pin to switch the dashboard to that location.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.09] px-3.5 py-2 text-sm font-medium text-white/88 backdrop-blur-xl hover:bg-white/[0.16]"
            >
              <ExpandIcon className="h-4 w-4" />
              <span>Expand map</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-white/12">
            <div className="h-[18rem] sm:h-[20rem]">
              <WeatherMap
                locations={locations}
                selectedId={selectedId}
                onSelect={onSelect}
                mode="card"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <p>Focused on {summary.area}</p>
            <p>Labels show the latest temperature and conditions from each saved location.</p>
          </div>
        </div>
      </section>

      <FullscreenMap
        isOpen={isFullscreen}
        locations={locations}
        selectedId={selectedId}
        onSelect={onSelect}
        onClose={() => setIsFullscreen(false)}
      />
    </>
  );
}

function formatCoordinates(location: Location): string {
  return `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`;
}
