// John 4 — scenes in reading order.
import jordan from './01-jordan.js';
import well from './02-well.js';
import apart from './03-apart.js';
import deep from './04-deep.js';
import spring from './05-spring.js';
import husband from './06-husband.js';
import mountain from './07-mountain.js';
import spirit from './08-spirit.js';
import jar from './09-jar.js';
import food from './10-food.js';
import harvest from './11-harvest.js';
import believe from './12-believe.js';
import galilee from './13-galilee.js';
import official from './14-official.js';
import lives from './15-lives.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [jordan, well, apart, deep, spring, husband, mountain, spirit, jar, food, harvest, believe, galilee, official, lives].filter((s) => s.beats.length);
