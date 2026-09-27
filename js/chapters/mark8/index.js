// Mark 8 — scenes in reading order.
import hungry from './01-hungry.js';
import loaves from './02-loaves.js';
import sign from './03-sign.js';
import leaven from './04-leaven.js';
import remember from './05-remember.js';
import bethsaida from './06-bethsaida.js';
import caesarea from './07-caesarea.js';
import passion from './08-passion.js';
import follow from './09-follow.js';
import glory from './10-glory.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [hungry, loaves, sign, leaven, remember, bethsaida, caesarea, passion, follow, glory].filter((s) => s.beats.length);
