import * as migration_20260612_131259_initial from './20260612_131259_initial';

export const migrations = [
  {
    up: migration_20260612_131259_initial.up,
    down: migration_20260612_131259_initial.down,
    name: '20260612_131259_initial'
  },
];
