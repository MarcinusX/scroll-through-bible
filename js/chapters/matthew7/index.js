// Matthew 7 — scenes in reading order.
import judge from './01-judge.js';
import speck from './02-speck.js';
import pearls from './03-pearls.js';
import ask from './04-ask.js';
import father from './05-father.js';
import golden from './06-golden.js';
import gates from './07-gates.js';
import wolves from './08-wolves.js';
import thorns from './09-thorns.js';
import trees from './10-trees.js';
import lord from './11-lord.js';
import rockS from './12-rock.js';
import sand from './13-sand.js';
import authority from './14-authority.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [judge, speck, pearls, ask, father, golden, gates, wolves, thorns, trees, lord, rockS, sand, authority].filter((s) => s.beats.length);
