// sharp 0.35's package.json `exports` map has no "types" condition, so under
// TypeScript's "bundler" module resolution its bundled declarations can't be
// resolved. sharp is only passed by value into payload.config.ts (no methods
// are called on it here), so treating the module as untyped is safe.
declare module "sharp";
