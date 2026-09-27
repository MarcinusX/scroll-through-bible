// Mark 1 — scenes in reading order.
import beginning from './01-beginning.js';
import john from './02-john.js';
import sandal from './03-sandal.js';
import baptism from './04-baptism.js';
import desert from './05-desert.js';
import galilee from './06-galilee.js';
import fishers from './07-fishers.js';
import synagogue from './08-synagogue.js';
import demon from './09-demon.js';
import house from './10-house.js';
import evening from './11-evening.js';
import dawn from './12-dawn.js';
import leper from './13-leper.js';
import news from './14-news.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [beginning, john, sandal, baptism, desert, galilee, fishers, synagogue, demon, house, evening, dawn, leper, news].filter((s) => s.beats.length);
