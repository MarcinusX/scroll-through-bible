// Luke 16 — scenes in reading order.
import disciples from './01-disciples.js';
import account from './02-account.js';
import dig from './03-dig.js';
import debtors from './04-debtors.js';
import shrewd from './05-shrewd.js';
import friends from './06-friends.js';
import little from './07-little.js';
import masters from './08-masters.js';
import scoff from './09-scoff.js';
import law from './10-law.js';
import divorce from './11-divorce.js';
import purple from './12-purple.js';
import angels from './13-angels.js';
import hades from './14-hades.js';
import chasm from './15-chasm.js';
import brothers from './16-brothers.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [disciples, account, dig, debtors, shrewd, friends, little, masters, scoff, law, divorce, purple, angels, hades, chasm, brothers].filter((s) => s.beats.length);
