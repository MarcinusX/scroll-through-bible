// Mark 16 — scenes in reading order. Scenes without beats are not drawn yet and are skipped.
import spices from './01-spices.js';
import garden from './02-garden.js';
import tomb from './03-tomb.js';
import fled from './04-fled.js';
import magdalene from './05-magdalene.js';
import mourning from './06-mourning.js';
import road from './07-road.js';
import eleven from './08-eleven.js';
import world from './09-world.js';
import signs from './10-signs.js';
import ascension from './11-ascension.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [spices, garden, tomb, fled, magdalene, mourning, road, eleven, world, signs, ascension].filter((s) => s.beats.length);
