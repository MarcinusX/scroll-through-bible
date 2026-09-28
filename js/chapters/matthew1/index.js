// Matthew 1 — scenes in reading order.
import book from './01-book.js';
import abraham from './02-abraham.js';
import tamar from './03-tamar.js';
import ruth from './04-ruth.js';
import david from './05-david.js';
import kings from './06-kings.js';
import exile from './07-exile.js';
import hidden from './08-hidden.js';
import christ from './09-christ.js';
import fourteen from './10-fourteen.js';
import betrothed from './11-betrothed.js';
import righteous from './12-righteous.js';
import dream from './13-dream.js';
import emmanuel from './14-emmanuel.js';
import wake from './15-wake.js';
import born from './16-born.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [book, abraham, tamar, ruth, david, kings, exile, hidden, christ, fourteen, betrothed, righteous, dream, emmanuel, wake, born].filter((s) => s.beats.length);
