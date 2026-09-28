// Matthew 3 — scenes in reading order.
import desert from './01-desert.js';
import voice from './02-voice.js';
import camel from './03-camel.js';
import jordan from './04-jordan.js';
import vipers from './05-vipers.js';
import stones from './06-stones.js';
import axeS from './07-axe.js';
import mightier from './08-mightier.js';
import winnow from './09-winnow.js';
import comes from './10-comes.js';
import heavens from './11-heavens.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [desert, voice, camel, jordan, vipers, stones, axeS, mightier, winnow, comes, heavens].filter((s) => s.beats.length);
