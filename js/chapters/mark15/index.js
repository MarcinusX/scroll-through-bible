// Mark 15 — scenes in reading order.
import dawn from './01-dawn.js';
import pilate from './02-pilate.js';
import barabbas from './03-barabbas.js';
import crucify from './04-crucify.js';
import mocked from './05-mocked.js';
import simon from './06-simon.js';
import cross from './07-cross.js';
import mocking from './08-mocking.js';
import darkness from './09-darkness.js';
import veil from './10-veil.js';
import centurion from './11-centurion.js';
import women from './12-women.js';
import joseph from './13-joseph.js';
import burial from './14-burial.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [dawn, pilate, barabbas, crucify, mocked, simon, cross, mocking, darkness, veil, centurion, women, joseph, burial].filter((s) => s.beats.length);
