// John 9 — scenes in reading order.
import passing from './01-passing.js';
import works from './02-works.js';
import clay from './03-clay.js';
import siloam from './04-siloam.js';
import neighbours from './05-neighbours.js';
import sabbath from './06-sabbath.js';
import parents from './07-parents.js';
import onething from './08-onething.js';
import moses from './09-moses.js';
import marvel from './10-marvel.js';
import believe from './11-believe.js';
import judgment from './12-judgment.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [passing, works, clay, siloam, neighbours, sabbath, parents, onething, moses, marvel, believe, judgment].filter((s) => s.beats.length);
