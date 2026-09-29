// Matthew 12 — scenes in reading order.
import grain from './01-grain.js';
import david from './02-david.js';
import temple from './03-temple.js';
import lord from './04-lord.js';
import synagogue from './05-synagogue.js';
import sheep from './06-sheep.js';
import hand from './07-hand.js';
import withdraw from './08-withdraw.js';
import servant from './09-servant.js';
import reed from './10-reed.js';
import demoniac from './11-demoniac.js';
import divided from './12-divided.js';
import sons from './13-sons.js';
import strongman from './14-strongman.js';
import gather from './15-gather.js';
import spirit from './16-spirit.js';
import tree from './17-tree.js';
import words from './18-words.js';
import sign from './19-sign.js';
import jonah from './20-jonah.js';
import judgment from './21-judgment.js';
import returnS from './22-return.js';
import family from './23-family.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [grain, david, temple, lord, synagogue, sheep, hand, withdraw, servant, reed, demoniac, divided, sons, strongman, gather, spirit, tree, words, sign, jonah, judgment, returnS, family].filter((s) => s.beats.length);
