// Mark 9 — scenes in reading order.
import kingdom from './01-kingdom.js';
import ascent from './02-ascent.js';
import glory from './03-glory.js';
import descent from './04-descent.js';
import crowdScene from './05-crowd.js';
import boy from './06-boy.js';
import prayer from './07-prayer.js';
import galilee from './08-galilee.js';
import greatest from './09-greatest.js';
import nameScene from './10-name.js';
import stumble from './11-stumble.js';
import salt from './12-salt.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [kingdom, ascent, glory, descent, crowdScene, boy, prayer, galilee, greatest, nameScene, stumble, salt].filter((s) => s.beats.length);
