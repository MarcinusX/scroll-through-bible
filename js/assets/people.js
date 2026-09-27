// Paper puppets. Every person is a rigid cut-out with hinged arms and head,
// like a shadow-theatre figure: facing right, feet at (0, 0), about 210 units tall.

import { sheet, shade } from '../core/paper.js';
import { pose, attr } from '../core/anim.js';
import { C } from './palette.js';

const PI = Math.PI;

const ROBES = {
  stand: [[-14, -147], [14, -147], [26, -137], [30, -110], [33, -70], [38, -30], [43, -8], [22, -4], [0, -6], [-22, -4], [-42, -8], [-37, -30], [-32, -70], [-30, -110], [-26, -137]],
  kneel: [[-14, -101], [14, -101], [26, -91], [29, -65], [33, -42], [48, -32], [58, -14], [56, -2], [20, -2], [-30, -2], [-46, -6], [-42, -20], [-31, -42], [-29, -65], [-26, -91]],
  sit: [[-14, -85], [14, -85], [26, -75], [29, -52], [31, -30], [52, -22], [60, -9], [52, 0], [-44, 0], [-50, -10], [-35, -26], [-30, -52], [-26, -75]],
};
const DY = { stand: 0, kneel: 46, sit: 62 };

function head(c, o, s) {
  const skin = o.skin, hair = o.hair;
  const hs = o.hairStyle;
  // behind the face
  if (o.halo) {
    s.x(c.poly(c.circ(0, 0, 64, 20)), 'url(#halo-glow)', 'class="halo-glow"');
    s.p(c.cut(c.star(0, 0, 33, 30, 18, 0), 0.3, 5), C.haloRim, 'class="halo"');
    s.p(c.cut(c.circ(0, 0, 28.5, 30), 0.3, 5), C.halo, 'class="halo"');
  }
  if (hs === 'long') s.p(c.cut([[-19, -6], [-17, -17], [-9, -23], [3, -24], [14, -20], [20, -10], [20, 2], [16, 8], [8, 6], [0, 10], [-2, 26], [-8, 34], [-18, 33], [-23, 20], [-22, 6]], 0.6, 5), hair);
  if (hs === 'wild') s.p(c.cut(c.star(-1, 2, 29, 20, 11, 0.3), 1.2, 4), hair);
  if (hs === 'veil' || hs === 'wrap') {
    const long = hs === 'veil';
    s.p(c.cut([...c.arc(0, -1, 23, 23, PI * 0.72, PI * 2.02, 14), [22, 10], [16, long ? 22 : 14], [6, long ? 30 : 18], [-10, long ? 38 : 22], [-26, long ? 40 : 24], [-24, 14]], 0.6, 5), o.veil);
  }
  // face
  s.p(c.cut(c.circ(0, 0, 17.5, 22), 0.25, 5), skin);
  s.p(c.poly([[16, -4], [21, 3.5], [16.5, 5]]), skin);
  if (hs === 'short' || hs === 'bald' || hs === 'curly') s.p(c.cut(c.ell(-3, 3, 3.6, 4.6, 10), 0.2, 3), shade(skin, -0.12));
  // hair on top
  if (hs === 'long' || hs === 'short') s.p(c.cut([...c.arc(0, 0, 19, 19, PI * 0.93, PI * 1.93, 14), [15, -8], [8, -11], [0, -9], [-7, -5], [-10, 3], [-15, 6]], 0.5, 4), hair);
  if (hs === 'curly') {
    let d = '';
    for (let i = 0; i < 9; i++) { const a = PI * (0.95 + i * 0.12); d += c.cut(c.circ(Math.cos(a) * 16.5, Math.sin(a) * 16.5 + 1, 5.6, 9), 0.2, 3); }
    s.p(d + c.cut([...c.arc(0, 0, 17, 17, PI * 1.0, PI * 1.9, 10), [4, -9], [-10, -2]], 0.3, 4), hair);
  }
  if (hs === 'wild') s.p(c.cut([...c.arc(0, 0, 20, 20, PI * 0.9, PI * 1.95, 14), [16, -6], [10, -12], [4, -8], [-2, -12], [-6, -4], [-12, 0], [-16, 8]], 1.4, 3), hair);
  if (hs === 'bald') s.p(c.cut([...c.arc(0, 0, 18.5, 18.5, PI * 0.72, PI * 1.12, 6), [-12, -2], [-10, 8]], 0.4, 4), hair);
  if (hs === 'veil' || hs === 'wrap') s.p(c.cut([...c.arc(0, 0, 21, 21, PI * 1.02, PI * 1.98, 12), ...c.arc(1, 1, 16.5, 16.5, PI * 1.92, PI * 1.12, 10)], 0.4, 4), o.veil2 || shade(o.veil, -0.1));
  // beard
  const bc = o.beardColor || hair;
  if (o.beard === 'full') s.p(c.cut([[-13, 1], [-10, 10], [-3, 18], [5, 20], [12, 16], [16, 8], [17.5, 2], [13, 6], [9, 4], [4, 7], [-4, 4], [-8, 0]], 0.5, 4), bc);
  if (o.beard === 'short') s.p(c.cut([[-11, 4], [-7, 11], [1, 15], [9, 14], [15, 8], [17, 3], [12, 6], [8, 5], [3, 8], [-4, 6]], 0.4, 4), bc);
  if (o.beard === 'wild') s.p(c.cut([[-15, 0], [-12, 14], [-6, 24], [2, 30], [8, 24], [14, 18], [18, 6], [18, 1], [13, 6], [9, 4], [4, 7], [-4, 4], [-9, -1]], 1.2, 3), bc);
  // face details (no grain)
  const eye = C.inkSoft;
  if (o.eyes === 'closed') {
    s.x(c.ribbon(c.arc(4, -3, 3, 2, 0.1, PI - 0.1, 5), 1.1), eye, 'data-e="1"');
    s.x(c.ribbon(c.arc(12.5, -3, 2.6, 2, 0.1, PI - 0.1, 5), 1.1), eye, 'data-e="1"');
  } else {
    s.x(c.poly(c.circ(4, -2.5, 1.9, 8)), eye, 'class="eye"');
    s.x(c.poly(c.circ(12.5, -2.5, 1.7, 8)), eye, 'class="eye"');
  }
  s.x(c.poly(c.circ(1, 6, 3.4, 10)), C.blush, 'opacity=".55"');
  s.x(c.poly(c.circ(15, 6, 2.4, 10)), C.blush, 'opacity=".5"');
  if (!o.beard || o.beard === 'none') s.x(c.ribbon(c.arc(10, 8, 3.2, 2, 0.3, PI - 0.3, 5), 1.1), shade(skin, -0.45), 'class="mouth"');
}

function arm(c, color, skin, hold = '') {
  const s = sheet();
  s.p(c.cut([[-7, -4], [7, -4], [8.5, 30], [10.5, 50], [-7.5, 52], [-8.5, 30]], 0.5, 6), color);
  s.p(c.cut(c.circ(1.5, 57, 6.3, 12), 0.2, 4), skin);
  return s.out() + (hold ? `<g class="hold" transform="translate(1.5 57)">${hold}</g>` : '');
}

/**
 * person(c, opts) → SVG markup for a puppet. Wrap it with S.puppet(el) to animate.
 * opts: k, robe, mantle, belt, skin, hair, hairStyle, veil, beard, beardColor, halo, fur, pose, eyes, holdF, holdB, scale
 */
export function person(c, o = {}) {
  o = {
    robe: C.linen, skin: C.skin, hair: C.hair, hairStyle: 'short', beard: 'none', pose: 'stand', eyes: 'open',
    ...o,
  };
  const P = o.pose, dy = DY[P];
  const robe = o.robe, rs = shade(robe, -0.12);
  const S = (pts) => pts.map(([x, y]) => [x, y < -40 || P === 'stand' ? y + dy : y]);
  // back arm
  const armB = `<g class="armB" transform="translate(-9 ${-138 + dy})"><g class="armBr">${arm(c, rs, shade(o.skin, -0.06), o.holdB)}</g></g>`;
  // feet
  const feet = P === 'stand'
    ? `<g class="footB">${sheet().p(c.cut(c.ell(-9, -4, 11, 4.6, 12), 0.3, 4), C.sandal).out(false)}</g><g class="footF">${sheet().p(c.cut(c.ell(9, -3.5, 12, 4.8, 12), 0.3, 4), shade(C.sandal, 0.08)).out(false)}</g>`
    : P === 'kneel' ? `<g>${sheet().p(c.cut(c.ell(-44, -4, 10, 4.4, 10), 0.3, 4), C.sandal).out(false)}</g>` : '';
  // robe
  const r = sheet();
  const robePts = ROBES[P];
  r.p(o.fur ? c.cut(robePts, 2.2, 5) : c.cut(robePts, 0.6, 8), robe);
  r.p(c.cut(S([[-26, -137], [-16, -140], [-20, -100], [-23, -60], [-27, -6], [-42, -8], [-37, -30], [-32, -70], [-30, -110]]).map(([x, y]) => [x, Math.min(y, -3)]), 0.5, 8), rs);
  if (o.fur) {
    let d = '';
    for (let i = 0; i < 26; i++) {
      const y = c.rr(-140, -12) + dy * (P === 'stand' ? 0 : 1), x = c.rr(-24, 26) * (P === 'stand' ? 1 + (y + 140) / 300 : 1);
      if (y > -2) continue;
      d += c.poly([[x - 3, y], [x, y + 5], [x + 3, y], [x, y + 2.5]]);
    }
    r.x(d, shade(robe, -0.25));
  }
  if (o.mantle) {
    const m = S([[-26, -137], [-12, -147], [4, -148], [18, -143], [28, -136], [22, -126], [4, -110], [-14, -88], [-26, -60], [-34, -30], [-36, -14], [-40, -10], [-36, -36], [-32, -70], [-30, -110]]).map(([x, y]) => [x, Math.min(y, -3)]);
    r.p(c.cut(m, 0.6, 8), o.mantle);
    r.x(c.ribbon(S([[26, -134], [20, -125], [3, -109], [-14, -87], [-25, -60]]), 1.6), shade(o.mantle, 0.25), 'opacity=".7"');
  }
  if (o.belt) r.p(c.cut([[-31, -97 + dy], [31, -97 + dy], [31.5, -89 + dy], [-31.5, -89 + dy]], 0.4, 6), o.belt);
  // neck
  r.p(c.poly([[-5, -153 + dy], [7, -153 + dy], [7, -144 + dy], [-5, -144 + dy]]), shade(o.skin, -0.08));
  const hs = sheet();
  head(c, o, hs);
  const headM = `<g class="head" transform="translate(2 ${-167 + dy})"><g class="headr">${hs.out()}</g></g>`;
  const armF = `<g class="armF" transform="translate(7 ${-138 + dy})"><g class="armFr">${arm(c, o.mantle && o.mantleArm ? o.mantle : robe, o.skin, o.holdF)}</g></g>`;
  const k = o.k ? ` data-k="${o.k}"` : '';
  return `<g class="fig"${k}><g class="flip"><g class="body">${armB}${feet}${r.out()}${headM}${armF}</g></g></g>`;
}

/* ---------- presets ---------- */
export const CAST = {
  jesus: { robe: C.linen, mantle: C.jesusMantle, hair: C.hairJesus, hairStyle: 'long', beard: 'full', halo: true, belt: null, skin: C.skin },
  peter: { robe: C.dustyBlue, mantle: C.ochre, hair: C.greyHair, hairStyle: 'curly', beard: 'full', skin: C.skin2, belt: C.leather },
  andrew: { robe: C.sageRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather },
  james: { robe: C.mauve, mantle: C.clayMantle, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin3 },
  john: { robe: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin, belt: C.leather },
  matthew: { robe: C.plumRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'short', skin: C.skin3 },
  thomas: { robe: C.tealRobe, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin2 },
};
export const DISCIPLES = ['peter', 'andrew', 'james', 'john', 'matthew', 'thomas'];

const CROWD_ROBES = [C.dustyBlue, C.sageRobe, C.mauve, C.wheatRobe, C.plumRobe, C.tealRobe, C.clayMantle, C.stone, C.roseRobe, C.ochreRobe, C.linen2];
const SKINS = [C.skin, C.skin2, C.skin3, C.skin4];
const HAIRS = [C.hair, C.hair2, C.hair3, C.greyHair];
export function crowdPerson(c, extra = {}) {
  const woman = c.chance(0.45);
  const robe = c.pick(CROWD_ROBES);
  return {
    robe,
    mantle: c.chance(0.35) ? c.pick(CROWD_ROBES) : null,
    skin: c.pick(SKINS),
    hair: c.pick(HAIRS),
    hairStyle: woman ? 'veil' : c.pick(['short', 'short', 'curly', 'wrap', 'bald']),
    veil: c.pick([C.linen2, C.stone, C.blushVeil, C.skyVeil, C.ochreRobe]),
    beard: woman ? 'none' : c.pick(['full', 'short', 'none']),
    belt: c.chance(0.4) ? C.leather : null,
    ...extra,
  };
}

/* ---------- puppet controller ---------- */
export class Puppet {
  constructor(el) {
    this.el = el;
    this.flipEl = el.querySelector('.flip');
    this.body = el.querySelector('.body');
    this.armF = el.querySelector('.armFr');
    this.armB = el.querySelector('.armBr');
    this.head = el.querySelector('.headr');
    this.footF = el.querySelector('.footF');
    this.footB = el.querySelector('.footB');
    this.eyes = el.querySelectorAll('.eye');
  }
  /**
   * set({x, y, s, flip, o, r, armF, armB, head, walk, amt, bob, lean, blink})
   * armF/armB: degrees raised forward (0 = hanging, 90 = pointing ahead, 170 = up)
   * walk: phase in radians (omit to stand still)
   */
  set({ x = 0, y = 0, s = 1, flip = false, o, r = 0, armF = 0, armB = 0, head = 0, walk, amt = 1, bob = 0, lean = 0, blink = 0 } = {}) {
    let b = bob, aF = armF, aB = armB;
    if (walk !== undefined && walk !== null) {
      const sw = Math.sin(walk);
      pose(this.footF, { x: sw * 10 * amt, y: -Math.max(0, Math.cos(walk)) * 3 * amt });
      pose(this.footB, { x: -sw * 10 * amt, y: -Math.max(0, -Math.cos(walk)) * 3 * amt });
      b -= Math.abs(Math.cos(walk)) * 3.5 * amt;
      aF += -sw * 14 * amt; aB += sw * 14 * amt;
    } else if (this.footF) { pose(this.footF, {}); pose(this.footB, {}); }
    pose(this.el, { x, y, s, r, o });
    pose(this.flipEl, { sx: flip ? -1 : 1 });
    pose(this.body, { y: b, r: lean });
    pose(this.armF, { r: -aF });
    pose(this.armB, { r: -aB });
    pose(this.head, { r: head });
    if (this.eyes.length) this.eyes.forEach((e) => attr(e, 'transform', blink ? `translate(0 -2.5) scale(1 ${Math.max(0.12, 1 - blink)}) translate(0 2.5)` : ''));
  }
}

/** a natural blink curve from a clock value */
export const blinkAt = (time, seed = 0) => { const p = (time + seed * 1.7) % 4.3; return p < 0.14 ? Math.sin((p / 0.14) * PI) : 0; };
