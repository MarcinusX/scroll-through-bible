// John 1 — scenes in reading order.
import word from './01-word.js';
import creation from './02-creation.js';
import witness from './03-witness.js';
import world from './04-world.js';
import flesh from './05-flesh.js';
import fullness from './06-fullness.js';
import who from './07-who.js';
import baptize from './08-baptize.js';
import lambScene from './09-lamb.js';
import doveScene from './10-dove.js';
import follow from './11-follow.js';
import cephas from './12-cephas.js';
import philip from './13-philip.js';
import israelite from './14-israelite.js';
import ladderScene from './15-ladder.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [word, creation, witness, world, flesh, fullness, who, baptize, lambScene, doveScene, follow, cephas, philip, israelite, ladderScene].filter((s) => s.beats.length);
