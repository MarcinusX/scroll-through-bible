// John 12 — scenes in reading order.
import bethany from './01-bethany.js';
import supper from './02-supper.js';
import judas from './03-judas.js';
import lazarus from './04-lazarus.js';
import palms from './05-palms.js';
import colt from './06-colt.js';
import world from './07-world.js';
import greeks from './08-greeks.js';
import grain from './09-grain.js';
import follow from './10-follow.js';
import voice from './11-voice.js';
import lifted from './12-lifted.js';
import light from './13-light.js';
import isaiah from './14-isaiah.js';
import rulers from './15-rulers.js';
import word from './16-word.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [bethany, supper, judas, lazarus, palms, colt, world, greeks, grain, follow, voice, lifted, light, isaiah, rulers, word].filter((s) => s.beats.length);
