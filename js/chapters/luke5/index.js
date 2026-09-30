// Luke 5 — scenes in reading order.
import shore from './01-shore.js';
import deep from './02-deep.js';
import cat from './03-catch.js';
import sinful from './04-sinful.js';
import left from './05-left.js';
import leper from './06-leper.js';
import desert from './07-desert.js';
import teachers from './08-teachers.js';
import roof from './09-roof.js';
import forgiven from './10-forgiven.js';
import easier from './11-easier.js';
import rise from './12-rise.js';
import levi from './13-levi.js';
import feast from './14-feast.js';
import physician from './15-physician.js';
import fasting from './16-fasting.js';
import bridegroom from './17-bridegroom.js';
import patch from './18-patch.js';
import wine from './19-wine.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [shore, deep, cat, sinful, left, leper, desert, teachers, roof, forgiven, easier, rise, levi, feast, physician, fasting, bridegroom, patch, wine].filter((s) => s.beats.length);
