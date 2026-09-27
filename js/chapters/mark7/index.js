// Mark 7 — scenes in reading order.
import washing from './01-washing.js';
import isaiah from './02-isaiah.js';
import korban from './03-korban.js';
import crowd from './04-crowd.js';
import house from './05-house.js';
import heart from './06-heart.js';
import tyre from './07-tyre.js';
import crumbs from './08-crumbs.js';
import daughter from './09-daughter.js';
import ephphatha from './10-ephphatha.js';
import proclaim from './11-proclaim.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [washing, isaiah, korban, crowd, house, heart, tyre, crumbs, daughter, ephphatha, proclaim].filter((s) => s.beats.length);
