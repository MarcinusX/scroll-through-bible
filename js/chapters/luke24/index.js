// Luke 24 — scenes in reading order.
import dawn from './01-dawn.js';
import empty from './02-empty.js';
import risen from './03-risen.js';
import remembered from './04-remembered.js';
import told from './05-told.js';
import peter from './06-peter.js';
import emmaus from './07-emmaus.js';
import stranger from './08-stranger.js';
import cleopas from './09-cleopas.js';
import hoped from './10-hoped.js';
import vision from './11-vision.js';
import slow from './12-slow.js';
import moses from './13-moses.js';
import stay from './14-stay.js';
import bread from './15-bread.js';
import night from './16-night.js';
import simon from './17-simon.js';
import peace from './18-peace.js';
import fish from './19-fish.js';
import opened from './20-opened.js';
import witnesses from './21-witnesses.js';
import bethany from './22-bethany.js';
import temple from './23-temple.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [dawn, empty, risen, remembered, told, peter, emmaus, stranger, cleopas, hoped, vision, slow, moses, stay, bread, night, simon, peace, fish, opened, witnesses, bethany, temple].filter((s) => s.beats.length);
