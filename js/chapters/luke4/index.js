// Luke 4 — scenes in reading order.
import desert from './01-desert.js';
import kingdoms from './02-kingdoms.js';
import pinnacle from './03-pinnacle.js';
import galilee from './04-galilee.js';
import nazareth from './05-nazareth.js';
import isaiah from './06-isaiah.js';
import today from './07-today.js';
import physician from './08-physician.js';
import elijah from './09-elijah.js';
import wrath from './10-wrath.js';
import brow from './11-brow.js';
import capernaum from './12-capernaum.js';
import demon from './13-demon.js';
import word from './14-word.js';
import fever from './15-fever.js';
import sunset from './16-sunset.js';
import dawn from './17-dawn.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [desert, kingdoms, pinnacle, galilee, nazareth, isaiah, today, physician, elijah, wrath, brow, capernaum, demon, word, fever, sunset, dawn].filter((s) => s.beats.length);
