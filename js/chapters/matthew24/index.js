// Matthew 24 — scenes in reading order.
import stones from './01-stones.js';
import olives from './02-olives.js';
import astray from './03-astray.js';
import wars from './04-wars.js';
import hated from './05-hated.js';
import cold from './06-cold.js';
import gospel from './07-gospel.js';
import flee from './08-flee.js';
import tribulation from './09-tribulation.js';
import falsechrist from './10-falsechrist.js';
import lightning from './11-lightning.js';
import heavens from './12-heavens.js';
import fig from './13-fig.js';
import words from './14-words.js';
import noah from './15-noah.js';
import taken from './16-taken.js';
import thief from './17-thief.js';
import servant from './18-servant.js';
import wicked from './19-wicked.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [stones, olives, astray, wars, hated, cold, gospel, flee, tribulation, falsechrist, lightning, heavens, fig, words, noah, taken, thief, servant, wicked].filter((s) => s.beats.length);
