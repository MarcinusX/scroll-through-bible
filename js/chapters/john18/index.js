// John 18 — scenes in reading order.
import kidron from './01-kidron.js';
import iam from './02-iam.js';
import letgo from './03-letgo.js';
import malchus from './04-malchus.js';
import bound from './05-bound.js';
import courtyard from './06-courtyard.js';
import annas from './07-annas.js';
import struck from './08-struck.js';
import rooster from './09-rooster.js';
import praetorium from './10-praetorium.js';
import kingdom from './11-kingdom.js';
import truth from './12-truth.js';
import barabbas from './13-barabbas.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [kidron, iam, letgo, malchus, bound, courtyard, annas, struck, rooster, praetorium, kingdom, truth, barabbas].filter((s) => s.beats.length);
