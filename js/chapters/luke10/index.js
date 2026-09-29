// Luke 10 — scenes in reading order.
import seventy from './01-seventy.js';
import harvest from './02-harvest.js';
import lambs from './03-lambs.js';
import barefoot from './04-barefoot.js';
import peace from './05-peace.js';
import stay from './06-stay.js';
import welcome from './07-welcome.js';
import dust from './08-dust.js';
import woe from './09-woe.js';
import tyre from './10-tyre.js';
import capernaum from './11-capernaum.js';
import hears from './12-hears.js';
import joy from './13-joy.js';
import satan from './14-satan.js';
import names from './15-names.js';
import rejoice from './16-rejoice.js';
import eyes from './17-eyes.js';
import lawyer from './18-lawyer.js';
import law from './19-law.js';
import robbers from './20-robbers.js';
import passby from './21-passby.js';
import compassion from './22-compassion.js';
import inn from './23-inn.js';
import likewise from './24-likewise.js';
import village from './25-village.js';
import portion from './26-portion.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [seventy, harvest, lambs, barefoot, peace, stay, welcome, dust, woe, tyre, capernaum, hears, joy, satan, names, rejoice, eyes, lawyer, law, robbers, passby, compassion, inn, likewise, village, portion].filter((s) => s.beats.length);
