// John 6 — scenes in reading order.
import crowd from './01-crowd.js';
import philip from './02-philip.js';
import boy from './03-boy.js';
import thanks from './04-thanks.js';
import king from './05-king.js';
import sea from './06-sea.js';
import boats from './07-boats.js';
import perish from './08-perish.js';
import manna from './09-manna.js';
import bread from './10-bread.js';
import will from './11-will.js';
import murmurS from './12-murmur.js';
import taught from './13-taught.js';
import living from './14-living.js';
import abide from './15-abide.js';
import synagogue from './16-synagogue.js';
import spirit from './17-spirit.js';
import away from './18-away.js';
import peter from './19-peter.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [crowd, philip, boy, thanks, king, sea, boats, perish, manna, bread, will, murmurS, taught, living, abide, synagogue, spirit, away, peter].filter((s) => s.beats.length);
