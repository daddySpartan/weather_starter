import { afterEach, describe, expect, it, vi } from 'vitest';
import { SingaporeWeatherClient } from './weather.js';

describe('SingaporeWeatherClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('combines two-hour forecast with nearest current-condition readings', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input);
      const payload = payloadForUrl(url);
      return {
        ok: true,
        status: 200,
        async json() {
          return payload;
        },
      } as Response;
    });

    const client = new SingaporeWeatherClient({ timeoutMs: 2000 });
    const weather = await client.getCurrentWeather(1.35, 103.84);

    expect(weather.condition).toBe('Showers');
    expect(weather.area).toBe('Bishan');
    expect(weather.valid_period_text).toBe('8.30 am to 10.30 am');
    expect(weather.forecast_low_c).toBe(24);
    expect(weather.forecast_high_c).toBe(33);
    expect(weather.forecast_periods).toHaveLength(3);
    expect(weather.daily_forecast).toHaveLength(4);
    expect(weather.temperature_c).toBe(30.2);
    expect(weather.humidity_percent).toBe(79);
    expect(weather.rainfall_mm).toBe(0.2);
    expect(weather.wind_speed_knots).toBe(8.1);
    expect(weather.wind_direction_degrees).toBe(145);
    expect(weather.uv_index).toBe(6);
    expect(weather.psi_twenty_four_hourly).toBe(47);
    expect(weather.pm25_one_hourly).toBe(14);
    expect(weather.air_quality_region).toBe('central');
    expect(weather.observed_at).toBe('2026-05-28T08:43:00+08:00');

    expect(fetchMock).toHaveBeenCalledTimes(11);
  });

  it('keeps forecast data when one station-reading endpoint fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input);
      if (url.endsWith('/relative-humidity')) {
        return {
          ok: false,
          status: 429,
          async json() {
            return {};
          },
        } as Response;
      }

      const payload = payloadForUrl(url);
      return {
        ok: true,
        status: 200,
        async json() {
          return payload;
        },
      } as Response;
    });

    const client = new SingaporeWeatherClient({ timeoutMs: 2000 });
    const weather = await client.getCurrentWeather(1.35, 103.84);

    expect(weather.condition).toBe('Showers');
    expect(weather.forecast_low_c).toBe(24);
    expect(weather.forecast_high_c).toBe(33);
    expect(weather.forecast_periods).toHaveLength(3);
    expect(weather.daily_forecast).toHaveLength(4);
    expect(weather.temperature_c).toBe(30.2);
    expect(weather.humidity_percent).toBeNull();
    expect(weather.rainfall_mm).toBe(0.2);
    expect(weather.wind_speed_knots).toBe(8.1);
    expect(weather.wind_direction_degrees).toBe(145);
    expect(weather.uv_index).toBe(6);
    expect(weather.psi_twenty_four_hourly).toBe(47);
    expect(weather.pm25_one_hourly).toBe(14);
    expect(weather.air_quality_region).toBe('central');
  });
});

function payloadForUrl(url: string) {
  if (url.endsWith('/two-hr-forecast')) {
    return {
      code: 0,
      data: {
        area_metadata: [
          {
            name: 'Bishan',
            label_location: { latitude: 1.35, longitude: 103.84 },
          },
        ],
        items: [
          {
            update_timestamp: '2026-05-28T08:31:29+08:00',
            timestamp: '2026-05-28T08:34:00+08:00',
            valid_period: { text: '8.30 am to 10.30 am' },
            forecasts: [{ area: 'Bishan', forecast: 'Showers' }],
          },
        ],
      },
    };
  }

  if (url.endsWith('/air-temperature')) {
    return {
      code: 0,
      data: {
        stations: [
          { id: 'S1', location: { latitude: 1.35, longitude: 103.84 } },
          { id: 'S2', location: { latitude: 1.4, longitude: 103.9 } },
        ],
        readings: [
          {
            timestamp: '2026-05-28T08:40:00+08:00',
            data: [
              { stationId: 'S1', value: 30.2 },
              { stationId: 'S2', value: 29.4 },
            ],
          },
        ],
      },
    };
  }

  if (url.endsWith('/twenty-four-hr-forecast')) {
    return {
      code: 0,
      data: {
        records: [
          {
            timestamp: '2026-05-28T05:34:00+08:00',
            updatedTimestamp: '2026-05-28T08:43:00+08:00',
            general: {
              temperature: {
                low: 24,
                high: 33,
              },
            },
            periods: [
              {
                timePeriod: { text: 'Now to Midday' },
                regions: { central: { text: 'Sunny' } },
              },
              {
                timePeriod: { text: 'Midday to 6 pm' },
                regions: { central: { text: 'Cloudy' } },
              },
              {
                timePeriod: { text: '6 pm to 6 am' },
                regions: { central: { text: 'Showers' } },
              },
            ],
          },
        ],
      },
    };
  }

  if (url.endsWith('/4-day-weather-forecast')) {
    return {
      items: [
        {
          update_timestamp: '2026-05-28T08:43:00+08:00',
          timestamp: '2026-05-28T08:42:00+08:00',
          forecasts: [
            {
              date: '2026-05-28',
              forecast: 'Cloudy',
              temperature: { low: 24, high: 33 },
            },
            {
              date: '2026-05-29',
              forecast: 'Showers',
              temperature: { low: 25, high: 34 },
            },
            {
              date: '2026-05-30',
              forecast: 'Fair',
              temperature: { low: 26, high: 35 },
            },
            {
              date: '2026-05-31',
              forecast: 'Sunny',
              temperature: { low: 25, high: 34 },
            },
          ],
        },
      ],
    };
  }

  if (url.endsWith('/relative-humidity')) {
    return {
      code: 0,
      data: {
        stations: [{ id: 'S1', location: { latitude: 1.35, longitude: 103.84 } }],
        readings: [
          {
            timestamp: '2026-05-28T08:39:00+08:00',
            data: [{ stationId: 'S1', value: 79 }],
          },
        ],
      },
    };
  }

  if (url.endsWith('/rainfall')) {
    return {
      code: 0,
      data: {
        stations: [{ id: 'S1', location: { latitude: 1.35, longitude: 103.84 } }],
        readings: [
          {
            timestamp: '2026-05-28T08:38:00+08:00',
            data: [{ stationId: 'S1', value: 0.2 }],
          },
        ],
      },
    };
  }

  if (url.endsWith('/wind-speed')) {
    return {
      code: 0,
      data: {
        stations: [{ id: 'S1', location: { latitude: 1.35, longitude: 103.84 } }],
        readings: [
          {
            timestamp: '2026-05-28T08:40:00+08:00',
            data: [{ stationId: 'S1', value: 8.1 }],
          },
        ],
      },
    };
  }

  if (url.endsWith('/wind-direction')) {
    return {
      code: 0,
      data: {
        stations: [{ id: 'S1', location: { latitude: 1.35, longitude: 103.84 } }],
        readings: [
          {
            timestamp: '2026-05-28T08:40:00+08:00',
            data: [{ stationId: 'S1', value: 145 }],
          },
        ],
      },
    };
  }

  if (url.endsWith('/uv')) {
    return {
      code: 0,
      data: {
        records: [
          {
            timestamp: '2026-05-28T08:00:00+08:00',
            updatedTimestamp: '2026-05-28T08:41:00+08:00',
            index: [{ hour: '2026-05-28T08:00:00+08:00', value: 6 }],
          },
        ],
      },
    };
  }

  if (url.endsWith('/psi')) {
    return {
      code: 0,
      data: {
        regionMetadata: [
          {
            name: 'central',
            labelLocation: { latitude: 1.35, longitude: 103.84 },
          },
          {
            name: 'east',
            labelLocation: { latitude: 1.36, longitude: 103.94 },
          },
        ],
        items: [
          {
            timestamp: '2026-05-28T08:40:00+08:00',
            updatedTimestamp: '2026-05-28T08:42:00+08:00',
            readings: {
              psi_twenty_four_hourly: {
                central: 47,
                east: 51,
              },
            },
          },
        ],
      },
    };
  }

  if (url.endsWith('/pm25')) {
    return {
      code: 0,
      data: {
        regionMetadata: [
          {
            name: 'central',
            labelLocation: { latitude: 1.35, longitude: 103.84 },
          },
        ],
        items: [
          {
            timestamp: '2026-05-28T08:39:00+08:00',
            updatedTimestamp: '2026-05-28T08:41:00+08:00',
            readings: {
              pm25_one_hourly: {
                central: 14,
              },
            },
          },
        ],
      },
    };
  }

  throw new Error(`Unhandled URL in test mock: ${url}`);
}
