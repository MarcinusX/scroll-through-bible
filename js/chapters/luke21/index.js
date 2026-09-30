// Luke 21 — scenes in reading order.
import treasury from './01-treasury.js';
import stones from './02-stones.js';
import astray from './03-astray.js';
import wars from './04-wars.js';
import nations from './05-nations.js';
import hands from './06-hands.js';
import wisdom from './07-wisdom.js';
import family from './08-family.js';
import endure from './09-endure.js';
import armies from './10-armies.js';
import woe from './11-woe.js';
import coming from './12-coming.js';
import figtree from './13-figtree.js';
import words from './14-words.js';
import trap from './15-trap.js';
import pray from './16-pray.js';
import olivet from './17-olivet.js';
import morning from './18-morning.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [treasury, stones, astray, wars, nations, hands, wisdom, family, endure, armies, woe, coming, figtree, words, trap, pray, olivet, morning].filter((s) => s.beats.length);
