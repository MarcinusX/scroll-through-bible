// Mark 5 — scenes in reading order.
import gerasa from './01-gerasa.js';
import tombs from './02-tombs.js';
import legion from './03-legion.js';
import herd from './04-herd.js';
import town from './05-town.js';
import decapolis from './06-decapolis.js';
import jairus from './07-jairus.js';
import woman from './08-woman.js';
import who from './09-who.js';
import news from './10-news.js';
import mourners from './11-mourners.js';
import talitha from './12-talitha.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [gerasa, tombs, legion, herd, town, decapolis, jairus, woman, who, news, mourners, talitha].filter((s) => s.beats.length);
