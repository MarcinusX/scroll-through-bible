// Mark 11 — scenes in reading order.
import approach from './01-approach.js';
import colt from './02-colt.js';
import cloaks from './03-cloaks.js';
import hosanna from './04-hosanna.js';
import temple from './05-temple.js';
import figtree from './06-figtree.js';
import cleansing from './07-cleansing.js';
import prayer from './08-prayer.js';
import withered from './09-withered.js';
import mountainScene from './10-mountain.js';
import authority from './11-authority.js';
import answer from './12-answer.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [approach, colt, cloaks, hosanna, temple, figtree, cleansing, prayer, withered, mountainScene, authority, answer].filter((s) => s.beats.length);
