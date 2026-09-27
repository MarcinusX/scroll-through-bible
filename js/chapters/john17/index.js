// John 17 — scenes in reading order.
import hour from './01-hour.js';
import life from './02-life.js';
import work from './03-work.js';
import name from './04-name.js';
import pray from './05-pray.js';
import keep from './06-keep.js';
import world from './07-world.js';
import truth from './08-truth.js';
import future from './09-future.js';
import glory from './10-glory.js';
import love from './11-love.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [hour, life, work, name, pray, keep, world, truth, future, glory, love].filter((s) => s.beats.length);
