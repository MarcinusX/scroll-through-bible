// Mark 12 — scenes in reading order. Scenes without beats are not drawn yet and are skipped.
import temple from './01-temple.js';
import vineyard from './02-vineyard.js';
import son from './03-son.js';
import stone from './04-stone.js';
import tax from './05-tax.js';
import sadducees from './06-sadducees.js';
import living from './07-living.js';
import first from './08-first.js';
import notfar from './09-notfar.js';
import david from './10-david.js';
import beware from './11-beware.js';
import treasury from './12-treasury.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [temple, vineyard, son, stone, tax, sadducees, living, first, notfar, david, beware, treasury].filter((s) => s.beats.length);
