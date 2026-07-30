import * as migration_20260613_075801_initial from './20260613_075801_initial';
import * as migration_20260730_164423_add_cta_band_fields from './20260730_164423_add_cta_band_fields';
import * as migration_20260730_165156_add_proof_rail_contact_services_fields from './20260730_165156_add_proof_rail_contact_services_fields';

export const migrations = [
  {
    up: migration_20260613_075801_initial.up,
    down: migration_20260613_075801_initial.down,
    name: '20260613_075801_initial',
  },
  {
    up: migration_20260730_164423_add_cta_band_fields.up,
    down: migration_20260730_164423_add_cta_band_fields.down,
    name: '20260730_164423_add_cta_band_fields',
  },
  {
    up: migration_20260730_165156_add_proof_rail_contact_services_fields.up,
    down: migration_20260730_165156_add_proof_rail_contact_services_fields.down,
    name: '20260730_165156_add_proof_rail_contact_services_fields'
  },
];
