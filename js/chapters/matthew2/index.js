// Matthew 2 — scenes in reading order.
import bethlehem from './01-bethlehem.js';
import magi from './02-magi.js';
import herod from './03-herod.js';
import scribes from './04-scribes.js';
import micah from './05-micah.js';
import secret from './06-secret.js';
import star from './07-star.js';
import gifts from './08-gifts.js';
import otherway from './09-otherway.js';
import angelS from './10-angel.js';
import flight from './11-flight.js';
import egypt from './12-egypt.js';
import rage from './13-rage.js';
import rachel from './14-rachel.js';
import death from './15-death.js';
import call from './16-call.js';
import back from './17-return.js';
import nazareth from './18-nazareth.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [bethlehem, magi, herod, scribes, micah, secret, star, gifts, otherway, angelS, flight, egypt, rage, rachel, death, call, back, nazareth].filter((s) => s.beats.length);
