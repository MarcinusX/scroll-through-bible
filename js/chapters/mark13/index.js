// Mark 13 — scenes in reading order.
import stones from './01-stones.js';
import olives from './02-olives.js';
import signs from './03-signs.js';
import trials from './04-trials.js';
import family from './05-family.js';
import flee from './06-flee.js';
import distress from './07-distress.js';
import heavens from './08-heavens.js';
import fig from './09-fig.js';
import words from './10-words.js';
import journey from './11-journey.js';
import watch from './12-watch.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [stones, olives, signs, trials, family, flee, distress, heavens, fig, words, journey, watch].filter((s) => s.beats.length);
