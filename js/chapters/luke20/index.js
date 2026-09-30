// Luke 20 — scenes in reading order.
import teach from './01-teach.js';
import baptism from './02-baptism.js';
import reason from './03-reason.js';
import unknown from './04-unknown.js';
import vineyard from './05-vineyard.js';
import servants from './06-servants.js';
import son from './07-son.js';
import heir from './08-heir.js';
import never from './09-never.js';
import stone from './10-stone.js';
import spies from './11-spies.js';
import denarius from './12-denarius.js';
import caesar from './13-caesar.js';
import sadducees from './14-sadducees.js';
import seven from './15-seven.js';
import age from './16-age.js';
import bush from './17-bush.js';
import david from './18-david.js';
import beware from './19-beware.js';
import widows from './20-widows.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [teach, baptism, reason, unknown, vineyard, servants, son, heir, never, stone, spies, denarius, caesar, sadducees, seven, age, bush, david, beware, widows].filter((s) => s.beats.length);
