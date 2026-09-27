// John 13 — scenes in reading order.
import hour from './01-hour.js';
import towel from './02-towel.js';
import wash from './03-wash.js';
import peter from './04-peter.js';
import example from './05-example.js';
import servant from './06-servant.js';
import troubled from './07-troubled.js';
import morsel from './08-morsel.js';
import night from './09-night.js';
import glory from './10-glory.js';
import commandment from './11-commandment.js';
import rooster from './12-rooster.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [hour, towel, wash, peter, example, servant, troubled, morsel, night, glory, commandment, rooster].filter((s) => s.beats.length);
