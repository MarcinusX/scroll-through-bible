// Luke 15 — scenes in reading order.
import near from './01-near.js';
import hundred from './02-hundred.js';
import seek from './03-seek.js';
import home from './04-home.js';
import heaven from './05-heaven.js';
import coin from './06-coin.js';
import friends from './07-friends.js';
import sons from './08-sons.js';
import riot from './09-riot.js';
import pigs from './10-pigs.js';
import arise from './11-arise.js';
import faroff from './12-faroff.js';
import robe from './13-robe.js';
import feast from './14-feast.js';
import elder from './15-elder.js';
import served from './16-served.js';
import yours from './17-yours.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [near, hundred, seek, home, heaven, coin, friends, sons, riot, pigs, arise, faroff, robe, feast, elder, served, yours].filter((s) => s.beats.length);
