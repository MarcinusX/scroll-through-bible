// John 21 — scenes in reading order.
import tiberias from './01-tiberias.js';
import night from './02-night.js';
import children from './03-children.js';
import lord from './04-lord.js';
import fire from './05-fire.js';
import breakfast from './06-breakfast.js';
import lovest from './07-lovest.js';
import third from './08-third.js';
import gird from './09-gird.js';
import beloved from './10-beloved.js';
import rumour from './11-rumour.js';
import books from './12-books.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [tiberias, night, children, lord, fire, breakfast, lovest, third, gird, beloved, rumour, books].filter((s) => s.beats.length);
