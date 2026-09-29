// Matthew 17 — scenes in reading order.
import ascent from './01-ascent.js';
import glory from './02-glory.js';
import descent from './03-descent.js';
import father from './04-father.js';
import healed from './05-healed.js';
import why from './06-why.js';
import mustard from './07-mustard.js';
import galilee from './08-galilee.js';
import collectors from './09-collectors.js';
import kings from './10-kings.js';
import fish from './11-fish.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [ascent, glory, descent, father, healed, why, mustard, galilee, collectors, kings, fish].filter((s) => s.beats.length);
