// Matthew 6 — scenes in reading order.
import mount from './01-mount.js';
import alms from './02-alms.js';
import pray from './03-pray.js';
import babble from './04-babble.js';
import teach from './05-teach.js';
import heaven from './06-heaven.js';
import home from './07-home.js';
import evil from './08-evil.js';
import forgive from './09-forgive.js';
import fast from './10-fast.js';
import treasure from './11-treasure.js';
import eye from './12-eye.js';
import masters from './13-masters.js';
import worry from './14-worry.js';
import birds from './15-birds.js';
import lilies from './16-lilies.js';
import seek from './17-seek.js';
import tomorrow from './18-tomorrow.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [mount, alms, pray, babble, teach, heaven, home, evil, forgive, fast, treasure, eye, masters, worry, birds, lilies, seek, tomorrow].filter((s) => s.beats.length);
