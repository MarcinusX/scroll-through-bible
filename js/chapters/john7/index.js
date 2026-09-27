// John 7 — scenes in reading order.
import galilee from './01-galilee.js';
import brothers from './02-brothers.js';
import time from './03-time.js';
import pilgrims from './04-pilgrims.js';
import where from './05-where.js';
import teach from './06-teach.js';
import moses from './07-moses.js';
import sabbath from './08-sabbath.js';
import whence from './09-whence.js';
import hour from './10-hour.js';
import seek from './11-seek.js';
import rivers from './12-rivers.js';
import division from './13-division.js';
import officers from './14-officers.js';
import nicodemus from './15-nicodemus.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [galilee, brothers, time, pilgrims, where, teach, moses, sabbath, whence, hour, seek, rivers, division, officers, nicodemus].filter((s) => s.beats.length);
