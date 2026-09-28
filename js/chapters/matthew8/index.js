// Matthew 8 — scenes in reading order.
import leper from './01-leper.js';
import centurionS from './02-centurion.js';
import authority from './03-authority.js';
import faith from './04-faith.js';
import feast from './05-feast.js';
import hour from './06-hour.js';
import fever from './07-fever.js';
import evening from './08-evening.js';
import scribe from './09-scribe.js';
import foxes from './10-foxes.js';
import dead from './11-dead.js';
import storm from './12-storm.js';
import calm from './13-calm.js';
import tombs from './14-tombs.js';
import pigs from './15-pigs.js';
import town from './16-town.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [leper, centurionS, authority, faith, feast, hour, fever, evening, scribe, foxes, dead, storm, calm, tombs, pigs, town].filter((s) => s.beats.length);
