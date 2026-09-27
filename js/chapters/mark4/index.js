// Mark 4 — scenes in reading order. Scenes without beats are not drawn yet and are skipped.
import lake from './01-lake.js';
import sower from './02-sower.js';
import ears from './03-ears.js';
import secret from './04-secret.js';
import explain from './05-explain.js';
import lamp from './06-lamp.js';
import measure from './07-measure.js';
import growing from './08-growing.js';
import mustard from './09-mustard.js';
import conclusion from './10-conclusion.js';
import storm from './11-storm.js';

export const SCENES = [lake, sower, ears, secret, explain, lamp, measure, growing, mustard, conclusion, storm].filter((s) => s.beats.length);
