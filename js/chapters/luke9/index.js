// Luke 9 — scenes in reading order.
import power from './01-power.js';
import nothing from './02-nothing.js';
import herod from './03-herod.js';
import bethsaida from './04-bethsaida.js';
import evening from './05-evening.js';
import fifty from './06-fifty.js';
import loaves from './07-loaves.js';
import christ from './08-christ.js';
import must from './09-must.js';
import daily from './10-daily.js';
import world from './11-world.js';
import pray from './12-pray.js';
import exodus from './13-exodus.js';
import tents from './14-tents.js';
import only from './15-only.js';
import father from './16-father.js';
import ears from './17-ears.js';
import least from './18-least.js';
import forbid from './19-forbid.js';
import face from './20-face.js';
import fire from './21-fire.js';
import foxes from './22-foxes.js';
import plough from './23-plough.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [power, nothing, herod, bethsaida, evening, fifty, loaves, christ, must, daily, world, pray, exodus, tents, only, father, ears, least, forbid, face, fire, foxes, plough].filter((s) => s.beats.length);
