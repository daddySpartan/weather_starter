import { useEffect, useMemo } from 'react';
import { divIcon, latLngBounds } from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { formatTemperature } from './format';
import type { Location } from '../types';

interface WeatherMapProps {
  locations: Location[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  mode: 'card' | 'fullscreen';
}

interface MapMarkerModel {
  id: number;
  position: [number, number];
  area: string;
  weatherLabel: string;
}

const DEFAULT_CENTER: [number, number] = [1.3521, 103.8198];
const CARD_ZOOM = 10;
const FULLSCREEN_ZOOM = 11;
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors &copy; CARTO';

export function WeatherMap({ locations, selectedId, onSelect, mode }: WeatherMapProps) {
  const markers = useMemo(() => locations.map(toMarkerModel), [locations]);
  const selectedMarker = markers.find((marker) => marker.id === selectedId) ?? markers[0] ?? null;
  const center = selectedMarker?.position ?? DEFAULT_CENTER;
  const zoom = mode === 'fullscreen' ? FULLSCREEN_ZOOM : CARD_ZOOM;

  return (
    <div className="h-full w-full overflow-hidden rounded-[1.75rem]">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom={mode === 'fullscreen'}
        dragging
        className="h-full w-full"
      >
        <TileLayer attribution={TILE_ATTRIBUTION} subdomains="abcd" url={TILE_URL} />
        <MapViewportController markers={markers} selectedMarker={selectedMarker} mode={mode} />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={createMarkerIcon(marker, marker.id === selectedId)}
            eventHandlers={{
              click: () => onSelect(marker.id),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}

interface MapViewportControllerProps {
  markers: MapMarkerModel[];
  selectedMarker: MapMarkerModel | null;
  mode: 'card' | 'fullscreen';
}

function MapViewportController({ markers, selectedMarker, mode }: MapViewportControllerProps) {
  const map = useMap();
  const markerKey = markers.map((marker) => marker.id).join(',');

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      map.invalidateSize();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [map, mode, markerKey]);

  useEffect(() => {
    if (markers.length === 0) {
      map.setView(DEFAULT_CENTER, mode === 'fullscreen' ? FULLSCREEN_ZOOM : CARD_ZOOM, {
        animate: false,
      });
      return;
    }

    if (markers.length === 1) {
      map.setView(markers[0].position, mode === 'fullscreen' ? FULLSCREEN_ZOOM : CARD_ZOOM, {
        animate: false,
      });
      return;
    }

    const bounds = latLngBounds(markers.map((marker) => marker.position));
    map.fitBounds(bounds, {
      animate: false,
      padding: mode === 'fullscreen' ? [84, 84] : [48, 48],
      maxZoom: mode === 'fullscreen' ? 12 : 11,
    });
  }, [map, markerKey, mode, markers]);

  useEffect(() => {
    if (!selectedMarker) return;

    map.flyTo(selectedMarker.position, Math.max(map.getZoom(), mode === 'fullscreen' ? 11 : 10), {
      animate: true,
      duration: 0.65,
    });
  }, [map, selectedMarker, mode]);

  return null;
}

function toMarkerModel(location: Location): MapMarkerModel {
  const area = location.weather.area ?? formatCoordinates(location.latitude, location.longitude);
  const condition = collapseWhitespace(location.weather.condition ?? 'No recent data');
  const shortCondition = condition.length > 18 ? `${condition.slice(0, 17)}...` : condition;
  const temperature = formatTemperature(location.weather.temperature_c);

  return {
    id: location.id,
    position: [location.latitude, location.longitude],
    area,
    weatherLabel: `${temperature} ${shortCondition}`,
  };
}

function createMarkerIcon(marker: MapMarkerModel, isSelected: boolean) {
  return divIcon({
    className: 'weather-pin-icon',
    html: [
      `<div class="weather-map-marker${isSelected ? ' is-selected' : ''}">`,
      '<div class="weather-map-label">',
      `<strong>${escapeHtml(marker.area)}</strong>`,
      `<span>${escapeHtml(marker.weatherLabel)}</span>`,
      '</div>',
      '<div class="weather-map-pin" aria-hidden="true"></div>',
      '</div>',
    ].join(''),
    iconSize: [132, 82],
    iconAnchor: [66, 70],
  });
}

function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
}

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
