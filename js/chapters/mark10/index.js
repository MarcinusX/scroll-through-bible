// Mark 10 — scenes in reading order.
import judea from './01-judea.js';
import test from './02-test.js';
import creation from './03-creation.js';
import house from './04-house.js';
import children from './05-children.js';
import rich from './06-rich.js';
import sad from './07-sad.js';
import camel from './08-camel.js';
import hundred from './09-hundred.js';
import ahead from './10-ahead.js';
import foretold from './11-foretold.js';
import zebedee from './12-zebedee.js';
import servant from './13-servant.js';
import jericho from './14-jericho.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [judea, test, creation, house, children, rich, sad, camel, hundred, ahead, foretold, zebedee, servant, jericho].filter((s) => s.beats.length);
