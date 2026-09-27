// John 14 — scenes in reading order.
import hearts from './01-hearts.js';
import house from './02-house.js';
import way from './03-way.js';
import philip from './04-philip.js';
import inme from './05-inme.js';
import greater from './06-greater.js';
import advocate from './07-advocate.js';
import orphans from './08-orphans.js';
import dwelling from './09-dwelling.js';
import teach from './10-teach.js';
import peace from './11-peace.js';
import arise from './12-arise.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [hearts, house, way, philip, inme, greater, advocate, orphans, dwelling, teach, peace, arise].filter((s) => s.beats.length);
