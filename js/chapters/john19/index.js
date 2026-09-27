// John 19 — scenes in reading order.
import crown from './01-crown.js';
import ecce from './02-ecce.js';
import power from './03-power.js';
import gabbatha from './04-gabbatha.js';
import golgotha from './05-golgotha.js';
import title from './06-title.js';
import tunic from './07-tunic.js';
import mother from './08-mother.js';
import finished from './09-finished.js';
import pierced from './10-pierced.js';
import witness from './11-witness.js';
import joseph from './12-joseph.js';
import spices from './13-spices.js';
import garden from './14-garden.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [crown, ecce, power, gabbatha, golgotha, title, tunic, mother, finished, pierced, witness, joseph, spices, garden].filter((s) => s.beats.length);
