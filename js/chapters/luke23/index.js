// Luke 23 — scenes in reading order.
import pilate from './01-pilate.js';
import herod from './02-herod.js';
import scorn from './03-scorn.js';
import again from './04-again.js';
import barabbas from './05-barabbas.js';
import third from './06-third.js';
import handed from './07-handed.js';
import simon from './08-simon.js';
import daughters from './09-daughters.js';
import skull from './10-skull.js';
import scoff from './11-scoff.js';
import thief from './12-thief.js';
import darkness from './13-darkness.js';
import veil from './14-veil.js';
import spirit from './15-spirit.js';
import centurion from './16-centurion.js';
import joseph from './17-joseph.js';
import tomb from './18-tomb.js';
import sabbath from './19-sabbath.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [pilate, herod, scorn, again, barabbas, third, handed, simon, daughters, skull, scoff, thief, darkness, veil, spirit, centurion, joseph, tomb, sabbath].filter((s) => s.beats.length);
