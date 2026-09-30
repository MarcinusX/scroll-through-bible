// Luke 7 — scenes in reading order.
import capernaum from './01-capernaum.js';
import elders from './02-elders.js';
import roof from './03-roof.js';
import authority from './04-authority.js';
import faith from './05-faith.js';
import nain from './06-nain.js';
import arise from './07-arise.js';
import visited from './08-visited.js';
import prison from './09-prison.js';
import hour from './10-hour.js';
import tell from './11-tell.js';
import reed from './12-reed.js';
import prophet from './13-prophet.js';
import counsel from './14-counsel.js';
import market from './15-market.js';
import wisdom from './16-wisdom.js';
import invite from './17-invite.js';
import tears from './18-tears.js';
import debtors from './19-debtors.js';
import judged from './20-judged.js';
import peace from './21-peace.js';

export { BEATS_EN } from './beats-en.js';
export { META } from './meta.js';

export const SCENES = [capernaum, elders, roof, authority, faith, nain, arise, visited, prison, hour, tell, reed, prophet, counsel, market, wisdom, invite, tears, debtors, judged, peace].filter((s) => s.beats.length);
