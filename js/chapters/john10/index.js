// John 10 — scenes in reading order.
import amen from './01-amen.js';
import fold from './02-fold.js';
import door from './03-door.js';
import good from './04-good.js';
import hireling from './05-hireling.js';
import know from './06-know.js';
import lay from './07-lay.js';
import division from './08-division.js';
import winter from './09-winter.js';
import hand from './10-hand.js';
import stones from './11-stones.js';
import gods from './12-gods.js';
import believe from './13-believe.js';
import jordan from './14-jordan.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [amen, fold, door, good, hireling, know, lay, division, winter, hand, stones, gods, believe, jordan].filter((s) => s.beats.length);
