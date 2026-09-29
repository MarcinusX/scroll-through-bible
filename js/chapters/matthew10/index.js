// Matthew 10 — scenes in reading order.
import call from './01-call.js';
import names from './02-names.js';
import lost from './03-lost.js';
import heal from './04-heal.js';
import pack from './05-pack.js';
import house from './06-house.js';
import dust from './07-dust.js';
import wolves from './08-wolves.js';
import courts from './09-courts.js';
import family from './10-family.js';
import flee from './11-flee.js';
import teacher from './12-teacher.js';
import housetops from './13-housetops.js';
import fear from './14-fear.js';
import sparrows from './15-sparrows.js';
import confess from './16-confess.js';
import sword from './17-sword.js';
import cross from './18-cross.js';
import receive from './19-receive.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [call, names, lost, heal, pack, house, dust, wolves, courts, family, flee, teacher, housetops, fear, sparrows, confess, sword, cross, receive].filter((s) => s.beats.length);
