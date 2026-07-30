import * as migration_20260613_075801_initial from './20260613_075801_initial';
import * as migration_20260730_164423_add_cta_band_fields from './20260730_164423_add_cta_band_fields';

export const migrations = [
  {
    up: migration_20260613_075801_initial.up,
    down: migration_20260613_075801_initial.down,
    name: '20260613_075801_initial',
  },
  {
    up: migration_20260730_164423_add_cta_band_fields.up,
    down: migration_20260730_164423_add_cta_band_fields.down,
    name: '20260730_164423_add_cta_band_fields'
  },
];
