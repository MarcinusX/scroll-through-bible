// Luke 6 — scenes in reading order.
import grain from './01-grain.js';
import david from './02-david.js';
import lord from './03-lord.js';
import synagogue from './04-synagogue.js';
import hand from './05-hand.js';
import night from './06-night.js';
import twelve from './07-twelve.js';
import plain from './08-plain.js';
import blessed from './09-blessed.js';
import woe from './10-woe.js';
import enemies from './11-enemies.js';
import credit from './12-credit.js';
import mercy from './13-mercy.js';
import measure from './14-measure.js';
import blind from './15-blind.js';
import speck from './16-speck.js';
import fruit from './17-fruit.js';
import lordlord from './18-lordlord.js';
import houses from './19-houses.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [grain, david, lord, synagogue, hand, night, twelve, plain, blessed, woe, enemies, credit, mercy, measure, blind, speck, fruit, lordlord, houses].filter((s) => s.beats.length);
