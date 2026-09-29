// Luke 18 — scenes in reading order.
import pray from './01-pray.js';
import judge from './02-judge.js';
import elect from './03-elect.js';
import trusted from './04-trusted.js';
import temple from './05-temple.js';
import mercy from './06-mercy.js';
import infants from './07-infants.js';
import ruler from './08-ruler.js';
import lack from './09-lack.js';
import camelS from './10-camel.js';
import left from './11-left.js';
import upto from './12-upto.js';
import beggar from './13-beggar.js';
import cry from './14-cry.js';
import sight from './15-sight.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [pray, judge, elect, trusted, temple, mercy, infants, ruler, lack, camelS, left, upto, beggar, cry, sight].filter((s) => s.beats.length);
