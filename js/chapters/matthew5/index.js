// Matthew 5 — scenes in reading order.
import mount from './01-mount.js';
import blessed from './02-blessed.js';
import salt from './03-salt.js';
import city from './04-city.js';
import lamp from './05-lamp.js';
import law from './06-law.js';
import least from './07-least.js';
import anger from './08-anger.js';
import altarS from './09-altar.js';
import road from './10-road.js';
import heartS from './11-heart.js';
import divorce from './12-divorce.js';
import oaths from './13-oaths.js';
import yes from './14-yes.js';
import cheek from './15-cheek.js';
import mile from './16-mile.js';
import enemies from './17-enemies.js';
import tax from './18-tax.js';
import perfect from './19-perfect.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [mount, blessed, salt, city, lamp, law, least, anger, altarS, road, heartS, divorce, oaths, yes, cheek, mile, enemies, tax, perfect].filter((s) => s.beats.length);
