import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { WeatherSnapshot } from '../weather.js';
import { WeatherProviderError } from '../weather.js';
import { logger } from '../logger.js';

const weather: WeatherSnapshot = {
  condition: 'Cloudy',
  observed_at: '2026-05-04T00:00:00Z',
  source: 'test',
  area: 'Bishan',
  valid_period_text: 'Now',
  temperature_c: 29,
  humidity_percent: 80,
  rainfall_mm: 0,
  wind_speed_knots: 4,
  wind_direction_degrees: 180,
  forecast_low_c: 25,
  forecast_high_c: 32,
  uv_index: 7,
  psi_twenty_four_hourly: 42,
  pm25_one_hourly: 9,
  air_quality_region: 'central',
  forecast_periods: [{ label: 'Now', forecast: 'Cloudy' }],
  daily_forecast: [
    { date: '2026-05-04', forecast: 'Cloudy', temperature_low_c: 25, temperature_high_c: 32 },
  ],
};

describe('locations API', () => {
  let tempDir: string;
  let app: Awaited<ReturnType<typeof import('../server.js').createApp>>;
  let createApp: typeof import('../server.js').createApp;
  let resetStore: typeof import('../db.js').resetStore;

  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'weather-starter-test-'));
    process.env.DATABASE_PATH = join(tempDir, 'weather.db');
    process.env.LOG_LEVEL = 'silent';

    ({ createApp } = await import('../server.js'));
    ({ resetStore } = await import('../db.js'));
    app = await createApp({
      serveFrontend: false,
      enableRequestLogging: false,
      weatherClient: {
        async getCurrentWeather() {
          return weather;
        },
      },
    });
  });

  beforeEach(async () => {
    vi.restoreAllMocks();
    await resetStore();
  });

  afterAll(async () => {
    try {
      await rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      if (!(error instanceof Error) || !('code' in error) || error.code !== 'EBUSY') {
        throw error;
      }
    }
  });

  it('refreshes weather when a location is created', async () => {
    const response = await request(app)
      .post('/api/locations')
      .send({ latitude: 1.35, longitude: 103.85 })
      .expect(201);

    expect(response.body).toMatchObject({
      id: 1,
      latitude: 1.35,
      longitude: 103.85,
      weather: {
        condition: 'Cloudy',
        area: 'Bishan',
        temperature_c: 29,
        humidity_percent: 80,
        rainfall_mm: 0,
      },
    });

    const listResponse = await request(app).get('/api/locations').expect(200);
    expect(listResponse.body.locations).toHaveLength(1);
    expect(listResponse.body.locations[0].weather.condition).toBe('Cloudy');
  });

  it('returns healthy status from the health endpoint', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body).toEqual({ status: 'healthy' });
  });

  it('accepts frontend logs for valid events', async () => {
    const infoSpy = vi.spyOn(logger, 'info').mockImplementation(() => logger);

    await request(app)
      .post('/api/logs')
      .send({
        event: 'dashboard.card_opened',
        metadata: { id: 3 },
        page: '/dashboard',
      })
      .expect(204);

    expect(infoSpy).toHaveBeenCalledTimes(1);
  });

  it('rejects frontend logs when event is missing or invalid', async () => {
    await request(app).post('/api/logs').send({ metadata: { id: 3 } }).expect(422, {
      detail: 'event is required',
    });

    await request(app).post('/api/logs').send({ event: 'Invalid Event' }).expect(422, {
      detail: 'event is required',
    });
  });

  it('lists no locations when the store is empty', async () => {
    const response = await request(app).get('/api/locations').expect(200);
    expect(response.body).toEqual({ locations: [] });
  });

  it('returns a location by id', async () => {
    const created = await request(app)
      .post('/api/locations')
      .send({ latitude: 1.31, longitude: 103.81 })
      .expect(201);

    const response = await request(app).get(`/api/locations/${created.body.id}`).expect(200);

    expect(response.body).toMatchObject({
      id: created.body.id,
      latitude: 1.31,
      longitude: 103.81,
      weather: {
        condition: 'Cloudy',
      },
    });
  });

  it('returns 404 when fetching a missing location', async () => {
    await request(app).get('/api/locations/999').expect(404, {
      detail: 'Location not found',
    });
  });

  it('rejects create when coordinates are missing', async () => {
    await request(app).post('/api/locations').send({ latitude: 1.35 }).expect(422, {
      detail: 'latitude and longitude are required',
    });
  });

  it('rejects create when coordinates are outside Singapore bounds', async () => {
    await request(app).post('/api/locations').send({ latitude: 2.0, longitude: 103.85 }).expect(422, {
      detail: 'Coordinates must be within Singapore (lat 1.1-1.5, lon 103.6-104.1)',
    });
  });

  it('rejects duplicate locations', async () => {
    await request(app).post('/api/locations').send({ latitude: 1.35, longitude: 103.85 }).expect(201);

    await request(app).post('/api/locations').send({ latitude: 1.35, longitude: 103.85 }).expect(409, {
      detail: 'Location already exists',
    });
  });

  it('falls back to unrefreshed weather when provider fails during create', async () => {
    const createWithFailingWeather = await createApp({
      serveFrontend: false,
      enableRequestLogging: false,
      weatherClient: {
        async getCurrentWeather() {
          throw new WeatherProviderError('upstream failure');
        },
      },
    });

    const response = await request(createWithFailingWeather)
      .post('/api/locations')
      .send({ latitude: 1.36, longitude: 103.84 })
      .expect(201);

    expect(response.body.weather).toMatchObject({
      condition: 'Not refreshed',
      source: 'not-refreshed',
    });
  });

  it('refreshes an existing location', async () => {
    const created = await request(app)
      .post('/api/locations')
      .send({ latitude: 1.33, longitude: 103.83 })
      .expect(201);

    const refreshedWeather: WeatherSnapshot = {
      ...weather,
      condition: 'Heavy Rain',
      rainfall_mm: 12.5,
      observed_at: '2026-05-04T01:00:00Z',
    };
    const refreshApp = await createApp({
      serveFrontend: false,
      enableRequestLogging: false,
      weatherClient: {
        async getCurrentWeather() {
          return refreshedWeather;
        },
      },
    });

    const refreshResponse = await request(refreshApp)
      .post(`/api/locations/${created.body.id}/refresh`)
      .expect(200);

    expect(refreshResponse.body.weather).toMatchObject({
      condition: 'Heavy Rain',
      rainfall_mm: 12.5,
      observed_at: '2026-05-04T01:00:00Z',
    });
  });

  it('returns 404 when refreshing a missing location', async () => {
    await request(app).post('/api/locations/999/refresh').expect(404, {
      detail: 'Location not found',
    });
  });

  it('returns 502 when weather refresh fails for an existing location', async () => {
    const created = await request(app)
      .post('/api/locations')
      .send({ latitude: 1.34, longitude: 103.84 })
      .expect(201);

    const failingRefreshApp = await createApp({
      serveFrontend: false,
      enableRequestLogging: false,
      weatherClient: {
        async getCurrentWeather() {
          throw new WeatherProviderError('provider unavailable');
        },
      },
    });

    await request(failingRefreshApp).post(`/api/locations/${created.body.id}/refresh`).expect(502, {
      detail: 'provider unavailable',
    });
  });

  it('deletes a saved location', async () => {
    const createResponse = await request(app)
      .post('/api/locations')
      .send({ latitude: 1.32, longitude: 103.82 })
      .expect(201);

    await request(app).delete(`/api/locations/${createResponse.body.id}`).expect(204);

    const listResponse = await request(app).get('/api/locations').expect(200);
    expect(listResponse.body.locations).toEqual([]);
  });

  it('returns 404 when deleting a missing location', async () => {
    await request(app).delete('/api/locations/999').expect(404, {
      detail: 'Location not found',
    });
  });

});
