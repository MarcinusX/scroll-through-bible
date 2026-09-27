// John 16 — scenes in reading order.
import lamps from './01-lamps.js';
import hour from './02-hour.js';
import going from './03-going.js';
import convict from './04-convict.js';
import truth from './05-truth.js';
import glory from './06-glory.js';
import whilee from './07-while.js';
import sorrow from './08-sorrow.js';
import joy from './09-joy.js';
import plainly from './10-plainly.js';
import arc from './11-arc.js';
import overcome from './12-overcome.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [lamps, hour, going, convict, truth, glory, whilee, sorrow, joy, plainly, arc, overcome].filter((s) => s.beats.length);
