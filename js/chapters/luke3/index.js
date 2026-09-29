// Luke 3 — scenes in reading order.
import rulers from './01-rulers.js';
import word from './02-word.js';
import jordan from './03-jordan.js';
import isaiah from './04-isaiah.js';
import vipers from './05-vipers.js';
import fruit from './06-fruit.js';
import coats from './07-coats.js';
import tax from './08-tax.js';
import soldiers from './09-soldiers.js';
import messiah from './10-messiah.js';
import winnow from './11-winnow.js';
import prison from './12-prison.js';
import baptism from './13-baptism.js';
import thirty from './14-thirty.js';
import ret from './15-return.js';
import kings from './16-kings.js';
import fathers from './17-fathers.js';
import flood from './18-flood.js';
import adam from './19-adam.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [rulers, word, jordan, isaiah, vipers, fruit, coats, tax, soldiers, messiah, winnow, prison, baptism, thirty, ret, kings, fathers, flood, adam].filter((s) => s.beats.length);
