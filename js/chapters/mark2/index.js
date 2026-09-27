// Mark 2 — scenes in reading order.
import house from './01-house.js';
import forgiven from './02-forgiven.js';
import levi from './03-levi.js';
import banquet from './04-banquet.js';
import fasting from './05-fasting.js';
import wedding from './06-wedding.js';
import newold from './07-newold.js';
import grain from './08-grain.js';
import david from './09-david.js';
import lord from './10-lord.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [house, forgiven, levi, banquet, fasting, wedding, newold, grain, david, lord].filter((s) => s.beats.length);
