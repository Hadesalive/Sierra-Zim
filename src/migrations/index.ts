import * as migration_20260613_075801_initial from './20260613_075801_initial';

export const migrations = [
  {
    up: migration_20260613_075801_initial.up,
    down: migration_20260613_075801_initial.down,
    name: '20260613_075801_initial'
  },
];
