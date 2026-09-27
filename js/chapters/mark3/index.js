// Mark 3 — scenes in reading order.
import synagogue from './01-synagogue.js';
import multitude from './02-multitude.js';
import shore from './03-shore.js';
import mountain from './04-mountain.js';
import twelve from './05-twelve.js';
import house from './06-house.js';
import scribes from './07-scribes.js';
import strongman from './08-strongman.js';
import spirit from './09-spirit.js';
import family from './10-family.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [synagogue, multitude, shore, mountain, twelve, house, scribes, strongman, spirit, family].filter((s) => s.beats.length);
