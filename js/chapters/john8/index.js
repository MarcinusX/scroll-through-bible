// John 8 — scenes in reading order.
import olives from './01-olives.js';
import accused from './02-accused.js';
import writing from './03-writing.js';
import alone from './04-alone.js';
import light from './05-light.js';
import witness from './06-witness.js';
import treasury from './07-treasury.js';
import going from './08-going.js';
import lifted from './09-lifted.js';
import free from './10-free.js';
import abraham from './11-abraham.js';
import devil from './12-devil.js';
import honour from './13-honour.js';
import prophets from './14-prophets.js';
import iam from './15-iam.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [olives, accused, writing, alone, light, witness, treasury, going, lifted, free, abraham, devil, honour, prophets, iam].filter((s) => s.beats.length);
