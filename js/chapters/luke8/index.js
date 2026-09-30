// Luke 8 — scenes in reading order.
import women from './01-women.js';
import crowd from './02-crowd.js';
import sower from './03-sower.js';
import ears from './04-ears.js';
import meaning from './05-meaning.js';
import fruit from './06-fruit.js';
import lamp from './07-lamp.js';
import family from './08-family.js';
import storm from './09-storm.js';
import calm from './10-calm.js';
import tombs from './11-tombs.js';
import legion from './12-legion.js';
import herd from './13-herd.js';
import town from './14-town.js';
import depart from './15-depart.js';
import jairus from './16-jairus.js';
import fringe from './17-fringe.js';
import who from './18-who.js';
import news from './19-news.js';
import arise from './20-arise.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [women, crowd, sower, ears, meaning, fruit, lamp, family, storm, calm, tombs, legion, herd, town, depart, jairus, fringe, who, news, arise].filter((s) => s.beats.length);
