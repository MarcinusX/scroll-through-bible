// John 5 — scenes in reading order.
import bethesda from './01-bethesda.js';
import thirtyeight from './02-thirtyeight.js';
import rise from './03-rise.js';
import sabbath from './04-sabbath.js';
import temple from './05-temple.js';
import son from './06-son.js';
import life from './07-life.js';
import passed from './08-passed.js';
import tombs from './09-tombs.js';
import witness from './10-witness.js';
import works from './11-works.js';
import scriptures from './12-scriptures.js';
import moses from './13-moses.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [bethesda, thirtyeight, rise, sabbath, temple, son, life, passed, tombs, witness, works, scriptures, moses].filter((s) => s.beats.length);
