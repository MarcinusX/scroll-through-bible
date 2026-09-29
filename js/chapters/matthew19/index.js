// Matthew 19 — scenes in reading order.
import judea from './01-judea.js';
import test from './02-test.js';
import creation from './03-creation.js';
import moses from './04-moses.js';
import adultery from './05-adultery.js';
import eunuchs from './06-eunuchs.js';
import children from './07-children.js';
import good from './08-good.js';
import which from './09-which.js';
import perfect from './10-perfect.js';
import camel from './11-camel.js';
import peter from './12-peter.js';
import thrones from './13-thrones.js';
import hundred from './14-hundred.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [judea, test, creation, moses, adultery, eunuchs, children, good, which, perfect, camel, peter, thrones, hundred].filter((s) => s.beats.length);
