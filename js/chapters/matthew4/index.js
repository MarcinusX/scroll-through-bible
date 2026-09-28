// Matthew 4 — scenes in reading order.
import desert from './01-desert.js';
import bread from './02-bread.js';
import temple from './03-temple.js';
import mountain from './04-mountain.js';
import angels from './05-angels.js';
import news from './06-news.js';
import capernaum from './07-capernaum.js';
import dawn from './08-dawn.js';
import net from './09-net.js';
import zebedee from './10-zebedee.js';
import synagogue from './11-synagogue.js';
import sick from './12-sick.js';
import crowds from './13-crowds.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [desert, bread, temple, mountain, angels, news, capernaum, dawn, net, zebedee, synagogue, sick, crowds].filter((s) => s.beats.length);
