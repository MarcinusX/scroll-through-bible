// Luke 2 — scenes in reading order.
import decree from './01-decree.js';
import roads from './02-roads.js';
import manger from './03-manger.js';
import shepherds from './04-shepherds.js';
import joy from './05-joy.js';
import gloria from './06-gloria.js';
import found from './07-found.js';
import name from './08-name.js';
import present from './09-present.js';
import simeon from './10-simeon.js';
import arms from './11-arms.js';
import light from './12-light.js';
import sword from './13-sword.js';
import anna from './14-anna.js';
import ret from './15-return.js';
import passover from './16-passover.js';
import search from './17-search.js';
import teachers from './18-teachers.js';
import father from './19-father.js';
import grew from './20-grew.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [decree, roads, manger, shepherds, joy, gloria, found, name, present, simeon, arms, light, sword, anna, ret, passover, search, teachers, father, grew].filter((s) => s.beats.length);
