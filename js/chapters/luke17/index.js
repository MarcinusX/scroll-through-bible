// Luke 17 — scenes in reading order.
import woe from './01-woe.js';
import millstone from './02-millstone.js';
import rebuke from './03-rebuke.js';
import seven from './04-seven.js';
import mulberry from './05-mulberry.js';
import plough from './06-plough.js';
import supper from './07-supper.js';
import duty from './08-duty.js';
import lepers from './09-lepers.js';
import cleansed from './10-cleansed.js';
import thanks from './11-thanks.js';
import nine from './12-nine.js';
import kingdom from './13-kingdom.js';
import days from './14-days.js';
import lightning from './15-lightning.js';
import noah from './16-noah.js';
import lot from './17-lot.js';
import revealed from './18-revealed.js';
import wife from './19-wife.js';
import night from './20-night.js';
import where from './21-where.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [woe, millstone, rebuke, seven, mulberry, plough, supper, duty, lepers, cleansed, thanks, nine, kingdom, days, lightning, noah, lot, revealed, wife, night, where].filter((s) => s.beats.length);
