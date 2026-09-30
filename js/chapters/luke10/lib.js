// Luke 10 — the cast and cut-outs of this chapter. The hill country on the road to Jerusalem, with its villages and
// the roads the seventy-two take two by two ahead of Him; the ripe valley of the harvest; the village street of the
// mission (the house of the son of peace, the town that receives them, the town that shuts its doors); the hillside
// over the lake with Chorazin, Bethsaida and Capernaum; the night sky where Satan falls like lightning and the names are
// written in heaven; the shade tree where the lawyer stands up; the steep desert road from Jerusalem down to Jericho,
// the robbers' rocks and the inn; and Martha's house with its busy hearth and its still centre.
// New faces here: the pair of the seventy-two we follow on their mission, the son of peace and his household, the
// lawyer, the man who fell among robbers, the Samaritan and his donkey, the innkeeper.
// Parallel drawings are reused from Mark 1–3, 6, 11–12, Matthew 4, 9–12 and John 6, 10–11 (origins noted per piece).
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt } from '../kit.js';
import { band, hillsWith, waterBand, town, house, sun, moon, cloud, stars, rock, grass, flowers, olive, cypress, bush, palm, reeds } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { seg, es, ease, bump, fade, clamp } from '../../core/anim.js';
import { figure, bake } from '../luke4/lib.js';
import { addToHead, addToBody } from '../mark2/lib.js';
import { walledCity } from '../mark1/lib.js';

export { kf, moving, hand, addToHead, addToBody, wordSlip, thought, speech, dust, coin, loaf, bowl, cup, jug, lantern } from '../mark2/lib.js';
export { nameTag, strip, bubble, question, heart, handAt, headAt, shadowPerson, silhouette, withFace, faceBits, card, wisp, stoneHeart } from '../mark3/lib.js';
export { sparkle, voiceRings, snake, flame, footprint, signpost, walledCity, shadowShards, POSSESSED, crutch, mat } from '../mark1/lib.js';
export { dove as whiteDove } from '../mark1/lib.js';
export { staff, bag, purse, tunic, sandals, crossX, tick, oilFlask, storyFrame, SEPIA } from '../mark6/lib.js';
export { wolf, ewe, sheepRig } from '../john10/lib.js';
export { folk, group } from '../john6/lib.js';
export { figure, bake, manO, womanO } from '../luke4/lib.js';
export { stillGroup, cameo, halo, kfl } from '../luke6/lib.js';
export { PRIEST, LEVITE, sinKnot } from '../matthew12/lib.js';
export { priest, colt, coltRig, jerusalem, lamb } from '../mark11/lib.js';
export { TEMPTER, tempterAura } from '../matthew4/lib.js';
export { MARTHA, MARY, martha, mary } from '../john11/lib.js';
export { TWELVE } from '../mark3/lib.js';
export { balance, ruinsIcon, openHouse, hungStrip, plateCard, drop } from '../matthew10/lib.js';
export { cityIcon, ship, ashFlake, ashPile, penitent, SACK, throng } from '../matthew11/lib.js';
export { REAPER, sickleHeld, wheatBand } from '../matthew9/lib.js';
export { loveIcon, headBandage, denarius, disc, lightArc } from '../mark12/lib.js';
export { ISAIAH, DAVID } from '../matthew1/lib.js';
export { SOLOMON } from '../matthew12/lib.js';
export { lightning, rays } from '../../assets/things.js';
export { seg, es, ease, bump, fade, clamp, tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ====================================================================== skies */
export const MORNING = ['#c7dfda', '#eef0d8', '#f8ecd0'];
export const DAY = ['#c3dcd8', '#ecedd6', '#f7ebd0'];
export const GOLDEN = ['#d9c3aa', '#f2d2a0', '#f7e1b8'];
export const EVENING = ['#a09ac0', '#e8b596', '#f5d4ae'];
export const DUSK = ['#6f6c9e', '#d59e92', '#f0c39e'];
export const NIGHT = ['#161c42', '#29316a', '#4b5590'];
export const DESERT = ['#d4dbd3', '#f2dfb8', '#f6dcb0'];
export const HOT = ['#dccfb6', '#f3d8a8', '#f6d9a6'];
export const GREY = ['#bcc1cb', '#d9d4cc', '#e7ddcd'];
export const WRATH = ['#5e4c6c', '#b97e76', '#e2a987'];
export const WARM = ['#d9dcc4', '#f2e2c0', '#f8e6c6'];

/* ====================================================================== the cast */
export const JESUS = CAST.jesus;
/** the pair of the seventy-two we follow: an older man with a grey beard and a head-cloth, and a young curly-haired one */
export const SENT_A = { robe: C.ochreRobe, mantle: mix(C.moss, C.sage, 0.45), hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.stone2, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather };
export const SENT_B = { robe: C.skyVeil, mantle: mix(C.clay, C.roseRobe, 0.45), hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.rope };
/** another pair of the seventy-two (the house that will not have them) */
export const SENT_C = { robe: C.wheatRobe, mantle: mix(C.teal2, C.sage, 0.5), hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin4, belt: C.leather };
export const SENT_D = { robe: mix(C.mauve, C.linen2, 0.4), hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin, belt: C.rope };
/** the son of peace, his wife and his little son */
export const HOST = { robe: C.linen2, mantle: mix(C.sageRobe, C.teal2, 0.3), hair: C.greyHair, hairStyle: 'bald', beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.ochre };
export const HOSTWIFE = { robe: mix(C.roseRobe, C.ochreRobe, 0.45), hairStyle: 'veil', veil: C.cream, veil2: C.linen2, hair: C.hair2, skin: C.skin3, beard: 'none', belt: C.clay };
export const HOSTBOY = { robe: C.wheatRobe, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin3, belt: C.clay };
/** the man who will not open (the house that is not worthy) */
export const SURLY = { robe: mix(C.plumRobe, C.stone, 0.3), hair: C.hair3, hairStyle: 'short', beard: 'short', beardColor: C.hair3, skin: C.skin4, belt: C.leather };
/** the rich neighbour who would lure them from house to house */
export const RICH = { robe: C.plumRobe, mantle: C.sun, hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: C.ochre, beard: 'full', skin: C.skin2, belt: C.sun };
/** the lawyer who stands up to test Him: deep blue robe, a white prayer-shawl mantle and head-wrap */
export const LAWYER = { robe: mix(C.indigo, C.dustyBlue, 0.55), mantle: C.linen, hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: mix(C.dustyBlue, C.indigo, 0.35), beard: 'full', beardColor: C.hair3, skin: C.skin2, belt: C.sun };
/** the man going down from Jerusalem to Jericho, and the same man stripped */
export const TRAVELLER = { robe: C.linen2, mantle: C.clayMantle, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin, belt: C.leather };
export const STRIPPED = { ...TRAVELLER, robe: mix(C.linen2, C.sand2, 0.3), mantle: null, belt: null };
/** the Samaritan: an ochre robe, a striped teal mantle and a teal-and-ochre head-cloth */
export const SAMARITAN = { robe: mix(C.ochreRobe, C.sand, 0.25), mantle: C.teal2, hair: C.hair3, hairStyle: 'wrap', veil: C.ochre, veil2: C.teal2, beard: 'full', beardColor: C.hair3, skin: C.skin3, belt: C.terracotta };
/** the innkeeper of the inn on the Jericho road */
export const INNKEEPER = { robe: mix(C.clay, C.wheatRobe, 0.5), hair: C.hair2, hairStyle: 'bald', beard: 'full', beardColor: C.hair2, skin: C.skin4, belt: C.leather };
/** children (small puppets) */
export const CHILDREN = [
  { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, hair: C.hair2, skin: C.skin2, beard: 'none', belt: C.ochre },
  { robe: C.skyVeil, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin3, belt: C.clay },
  { robe: C.wheatRobe, hair: C.hair, hairStyle: 'short', beard: 'none', skin: C.skin, belt: C.moss },
  { robe: C.sageRobe, hairStyle: 'veil', veil: C.cream, hair: C.hair3, skin: C.skin4, beard: 'none', belt: C.terracotta },
];

/** bare feet: repaint the sandals of a puppet's markup in its skin colour */
export function barefoot(markup, skin = C.skin) {
  return markup.split(`fill="${C.sandal}"`).join(`fill="${shade(skin, -0.08)}"`).split(`fill="${shade(C.sandal, 0.08)}"`).join(`fill="${skin}"`);
}
/** the lawyer's phylactery on his brow and his puppet */
function phylactery(c) {
  const box = sheet().p(c.cut([[-5, -9], [5, -9], [5, 0], [-5, 0]], 0.2, 3), C.ink).out();
  return `<path d="${c.ribbon(c.arc(0, 0, 19.5, 19.5, PI * 1.1, PI * 1.9, 10), 2.4)}" fill="${C.ink}"/><g transform="translate(6 -18) rotate(20)">${box}</g>`;
}
export const lawyer = (c, extra = {}) => addToHead(person(c, { ...LAWYER, ...extra }), phylactery(c));
/** the Samaritan's striped mantle (body coords): three thin ochre stripes over the teal */
export function samaritan(c, extra = {}) {
  const P = extra.pose || 'stand', dy = DY[P];
  const st = [0, 1, 2].map((i) => c.ribbon([[22 - i * 7, -132 + dy + i * 6], [2 - i * 8, -110 + dy + i * 6], [-16 - i * 6, -80 + dy + i * 8]], 2.2)).join('');
  return addToBody(person(c, { ...SAMARITAN, ...extra }), `<path d="${st}" fill="${C.ochre}" opacity=".85"/>`);
}

/* ====================================================================== small helpers */
/** a soft glow disc (flat; goes behind what it lights) */
export const glow = (r = 120, o = 1, grad = 'halo-glow') => `<circle r="${r}" fill="url(#${grad})" opacity="${o}"/>`;
/** move along a polyline: u 0..1 → [x, y, i] */
export function along(pts, u) {
  u = clamp(u);
  let L = 0;
  const seg_ = [];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg_.push(d); L += d; }
  let d = u * L;
  for (let i = 0; i < seg_.length; i++) {
    if (d <= seg_[i] || i === seg_.length - 1) { const k = seg_[i] ? Math.min(1, d / seg_[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k), i]; }
    d -= seg_[i];
  }
  return [...pts[pts.length - 1], pts.length - 1];
}
/** a still pair of walkers as one cut-out (two figures side by side, mid-stride), origin at their feet */
export function pairWalk(c, a, b, { s = 1, flip = false, bare = false } = {}) {
  const f = (o, x, y, armF, armB) => {
    let m = bake(person(c, o), armF, armB, -2);
    if (bare) m = barefoot(m, o.skin);
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${m}</g>`;
  };
  return f(b, flip ? 26 * s : -26 * s, -6 * s, 14, -12) + f(a, flip ? -24 * s : 24 * s, 0, -10, 16);
}
/** a small golden lamp flame on a village (origin: its base) */
export function villageLamp(c) {
  const s = sheet().p(c.cut([[-9, 0], [-12, -6], [-6, -10], [8, -10], [12, -6], [9, 0]], 0.2, 3), C.pot);
  return `${glow(46, 0.95, 'warm-glow')}${s.out()}<path d="M2 -10C-4 -15 -3 -23 2 -32C7 -23 8 -15 2 -10Z" fill="${C.lampFlame}"/><path d="M2 -12C0 -15 0 -19 2 -23C4 -19 4 -15 2 -12Z" fill="#fff4d2"/>`;
}
/** a dotted golden trail along a polyline (the way He Himself will come) */
export function goldTrail(c, pts, { n = 14, r = 3.4, col = C.sun } = {}) {
  let d = '';
  for (let i = 1; i <= n; i++) { const [x, y] = along(pts, i / (n + 1)); d += c.poly(c.ell(x, y, r * 1.5, r * 0.8, 8)); }
  return `<path d="${d}" fill="${col}" opacity=".9"/>`;
}
/** a warm orb of peace with an olive sprig inside (origin centre) */
export function peaceOrb(c, r = 22) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r, 22), 0.4, 4), C.halo);
  s.p(c.cut(c.circ(0, 0, r * 0.74, 20), 0.3, 4), '#fff6dc');
  s.p(c.ribbon(c.qbez([-r * 0.5, r * 0.4], [0, 0], [r * 0.45, -r * 0.45], 8), 2), C.wood3);
  let lv = '';
  [[-0.3, 0.2, 0.9], [-0.05, 0.02, -0.7], [0.15, -0.18, 0.9], [0.32, -0.36, -0.6]].forEach(([u, v, a]) => { lv += c.cut(c.ell(u * r, v * r, r * 0.26, r * 0.1, 8, a), 0.1, 2); });
  s.p(lv, C.olive);
  return `${glow(r * 3, 0.9)}${s.out()}`;
}
/** golden rays from a point downwards (the Father's light: never a figure); origin: the source */
export function lightFall(c, { n = 9, len = 900, spread = 0.55, w = 0.05, col = '#fff3cf' } = {}) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = PI / 2 + (i / (n - 1) - 0.5) * spread * 2, ww = w * c.rr(0.7, 1.3);
    d += c.poly([[Math.cos(a - ww * 0.2) * 30, Math.sin(a - ww * 0.2) * 30], [Math.cos(a - ww) * len, Math.sin(a - ww) * len], [Math.cos(a + ww) * len, Math.sin(a + ww) * len], [Math.cos(a + ww * 0.2) * 30, Math.sin(a + ww * 0.2) * 30]]);
  }
  return `<path d="${d}" fill="${col}" opacity=".55"/><circle r="160" fill="url(#halo-glow)"/>`;
}

/* ====================================================================== the hill country and its roads */
/**
 * The hill country on the way to Jerusalem: far hills with villages, a valley of meadows with roads fanning out from
 * the foot of the knoll (HUB) to every village, and the knoll in front where Jesus stands (at KN). Always cut with the
 * same scissors. Returns { sk, sk2, hangL, sunEl, far, mid, valley, walk, lampL, knoll, kfn, update(time, o) }.
 * VILLAGES: [x, y] of each village on the mid hills (where the roads end); ROADS: polyline from the hub to each.
 */
export const KN = { X: 800, Y: 704 };
export const HUB = [800, 612];
export const VILLAGES = [[250, 470], [470, 482], [640, 470], [980, 474], [1150, 484], [1350, 470]];
export const ROADS = VILLAGES.map(([vx, vy], i) => {
  const [hx, hy] = HUB, mx = lerp(hx, vx, 0.55) + (i % 2 ? 40 : -40), my = lerp(hy, vy, 0.45) + 18;
  return [[hx + (vx - hx) * 0.06, hy], [lerp(hx, mx, 0.5), lerp(hy, my, 0.6)], [mx, my], [lerp(mx, vx, 0.6), lerp(my, vy, 0.7)], [vx, vy + 6]];
});
/** the scale of a walker at height y in the valley (near the hub ~0.5, at the villages ~0.2) */
export const roadS = (y) => lerp(0.1, 0.46, Math.pow(clamp((y - 470) / (612 - 470)), 1.3));
export function countrySet(S, { skyCols = MORNING, sky2 = null, sky3 = null, sunAt = [1240, 150], fields = false, knoll = true, seed = 'lk10-country', behind = null } = {}) {
  const c = makeCutter(seed);
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }) : null;
  if (sk2) sk2.layer.fade(0);
  const sk3 = sky3 ? sky(S, sky3, { name: 'sky3', rise: 0 }) : null;
  if (sk3) sk3.layer.fade(0);
  const starL = sky2 ? S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 }) : null;
  if (starL) { starL.add(stars(c, { x0: -800, x1: 2400, y0: -600, y1: 420, n: 130 })); starL.fade(0); }
  const extra = behind ? behind(S) : null;
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cls = [[520, 220, 200], [1010, 180, 150]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 900 }), x, y, i }));
  const far = S.layer({ par: 0.07, sh: 2 });
  const fb = band(c, { y: 410, amps: [18, 8, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.2) });
  far.add(fb.markup + town(c, { x: 60, y: fb.fn(60) + 12, n: 5, spread: 160, sc: 0.36 }) + town(c, { x: 1560, y: fb.fn(1560) + 12, n: 5, spread: 160, sc: 0.36 }) + walledCity(c, 1800, fb.fn(1800) + 4, 0.34));
  const mid = S.layer({ par: 0.14, sh: 3 });
  const mfn = (x) => 470 + 10 * Math.sin(x / 190) + 6 * Math.sin(x / 70 + 1);
  const ms = sheet().p(c.ridge(mfn, -900, 2500, 1700, 12, 1), fields ? mix(C.hillMid, C.wheat, 0.25) : C.hillMid);
  mid.add(ms.out());
  let vil = '';
  VILLAGES.forEach(([vx, vy], i) => { vil += town(c, { x: vx, y: vy + 8, n: 4, spread: 110, sc: 0.62 }); });
  let trees = '';
  for (let i = 0; i < 24; i++) { const x = c.rr(-600, 2200); if (VILLAGES.some(([vx]) => Math.abs(vx - x) < 60)) continue; trees += c.cut(c.blob(x, mfn(x) - 8, c.rr(8, 13), c.rr(9, 14), 9, 0.15), 0.5, 4); }
  mid.add(sheet().p(trees, C.sage).out() + vil);
  const lampL = S.layer({ par: 0.14, sh: 3 });
  const lamps = VILLAGES.map(([vx, vy]) => lampL.add(`<g>${villageLamp(c)}</g>`));
  // the valley with its meadows (or its ripe fields) and the roads
  const valley = S.layer({ par: 0.24, sh: 3 });
  const vfn = (x) => 500 + 6 * Math.sin(x / 260 + 2);
  const vs = sheet();
  vs.p(c.ridge(vfn, -900, 2500, 1700, 12, 1), fields ? mix(C.wheat, C.hillNear, 0.35) : mix(C.hillNear, C.sage2, 0.4));
  if (fields) {
    let f1 = '', f2 = '';
    for (let i = 0; i < 14; i++) { const x = c.rr(-500, 2100), y = c.rr(520, 620), w = c.rr(140, 260), h = c.rr(24, 46); const p = c.cut([[x, y], [x + w, y - 6], [x + w + 20, y + h], [x + 16, y + h + 4]], 0.8, 10); if (i % 2) f1 += p; else f2 += p; }
    vs.p(f1, C.wheat).p(f2, mix(C.wheat2, C.wheat, 0.4));
  } else {
    let pat = '';
    for (let i = 0; i < 12; i++) { const x = c.rr(-500, 2100), y = c.rr(520, 610); pat += c.cut(c.blob(x, y, c.rr(60, 120), c.rr(10, 18), 10, 0.2), 0.6, 8); }
    vs.x(pat, mix(C.sage2, C.hillNear, 0.3), 'opacity=".8"');
  }
  let rd = '', rd2 = '';
  ROADS.forEach((r) => { rd += c.ribbon(r, (u) => lerp(26, 6, u), 0.8); rd2 += c.ribbon(r.map(([x, y]) => [x, y + 2]), (u) => lerp(10, 2, u)); });
  vs.p(rd, mix(C.sand, C.cream, 0.3));
  vs.x(rd2, C.sand2, 'opacity=".5"');
  valley.add(vs.out());
  valley.add(olive(c, 330, 590, 0.55) + olive(c, 1260, 596, 0.6) + cypress(c, 1120, 560, 70) + cypress(c, 540, 562, 60));
  const trailL = S.layer({ par: 0.24, sh: 1, flat: true });
  const trails = ROADS.map((r) => trailL.add(`<g>${goldTrail(c, r)}</g>`));
  const walk = S.layer({ par: 0.24, sh: 3 });
  // the knoll
  let kn = null, kfn = null;
  if (knoll) {
    kn = S.layer({ par: 0.45, sh: 4 });
    kfn = (x) => KN.Y + 8 - 58 * Math.exp(-Math.pow((x - KN.X) / 300, 2)) + 6 * Math.sin(x / 150);
    const ks = sheet().p(c.ridge((x) => kfn(x) + 20, -900, 2500, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.2));
    kn.add(ks.out());
    kn.add(grass(c, { x0: -800, x1: 2400, y: 0, fn: (x) => kfn(x) + 22, n: 70, h: 14, color: C.moss }) + flowers(c, { x0: -300, x1: 1900, y: 0, fn: (x) => kfn(x) + c.rr(30, 120), n: 26, h: 14 }));
    kn.add(olive(c, 170, kfn(170) + 26, 1.2) + rock(c, 1420, kfn(1420) + 30, 140, 46, C.rock2) + bush(c, 1560, kfn(1560) + 30, 110, C.sage, C.moss));
  }
  const dim = sky2 ? S.layer({ par: 0.45, sh: 1, flat: true, rise: 0 }) : null;
  if (dim) { dim.add(`<rect x="-3000" y="380" width="8000" height="3000" fill="${C.night2}" opacity=".5"/>`); dim.fade(0); }
  return {
    c, sk, sk2, sk3, starL, dim, extra, hangL, sunEl, cls, far, mid, valley, trailL, trails, walk, lampL, lamps, knoll: kn, kfn, mfn, vfn,
    update(time, { sunX = sunAt[0], sunY = sunAt[1], sunO = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6), o: sunO });
      cls.forEach((k) => swing(k.el, k.x + Math.sin(time * 0.1 + k.i * 2) * 22, k.y, time, 1.2, 0.6, k.i));
    },
    /** light the village lamps (k per village 0..1) */
    lampsOn(ks, time = 0) {
      lamps.forEach((el, i) => { const k = ks[i] || 0; const [vx, vy] = VILLAGES[i]; pose(el, { x: vx + 4, y: vy - 22, s: 0.4 + k * 0.6 + (time ? Math.sin(time * 3 + i) * 0.03 : 0), o: k }); });
    },
  };
}

/* ====================================================================== the village lane of the mission */
/**
 * A village lane in the hill country: sky with sun and clouds, far hills, a backdrop row of small houses, the beaten
 * earth of the lane (ground at GY) and a fig tree. Houses with doors are added by the scene with doorHouse().
 * Returns { c, sk, sk2, hangL, sunEl, back, ground, gfn, update(time) }.
 */
export function laneSet(S, { skyCols = DAY, sky2 = null, sunAt = [1260, 150], seed = 'lk10-lane', tint = 0, GY = 716 } = {}) {
  const c = makeCutter(seed);
  const T = (col) => (tint ? mix(col, C.duskViolet, tint) : col);
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }) : null;
  if (sk2) sk2.layer.fade(0);
  const starL = sky2 ? S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 }) : null;
  if (starL) { starL.add(stars(c, { x0: -800, x1: 2400, y0: -500, y1: 400, n: 90 })); starL.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 42), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cls = [[480, 200, 190], [980, 170, 140]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w, T(C.cream), T('#eadcc0')), { x, y, len: 900 }), x, y, i }));
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [16, 7, 3], lens: [1000, 380, 130], color: T(mix(C.hillFar, C.duskViolet, 0.18)) }).markup);
  const hl = S.layer({ par: 0.16, sh: 3 });
  const hw = hillsWith(c, { y: 474, amps: [12, 6, 2], lens: [900, 300, 110], color: T(C.hillMid), trees: 16, treeColor: T(C.sage), treeH: 20 });
  hl.add(hw.markup + town(c, { x: 200, y: hw.fn(200) + 14, n: 6, spread: 300, sc: 0.5 }) + town(c, { x: 1420, y: hw.fn(1420) + 14, n: 6, spread: 300, sc: 0.5 }));
  const back = S.layer({ par: 0.28, sh: 3 });
  let hs = '';
  let x = -700, i = 0;
  while (x < 2300) {
    const w = c.rr(90, 140), h = c.rr(80, 120);
    hs += house(c, x, GY - 74 + c.rr(-4, 4), w, h, { wall: T(i % 3 === 1 ? C.plaster2 : mix(C.plaster, C.sand, 0.2)), shadow: T(shade(C.plaster2, -0.06)), stairs: i % 2 === 0 });
    x += w + c.rr(30, 70); i++;
  }
  back.add(hs + cypress(c, 180, GY - 70, 120, T(C.moss2)) + palm(c, 1500, GY - 72, 170));
  const ground = S.layer({ par: 0.4, sh: 3 });
  const gfn = c.wave(GY - 28, [3, 1.5], [700, 180]);
  ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1800, 12, 1), T(mix(C.sand, C.stone, 0.25))).out());
  let stones = '';
  for (let k = 0; k < 60; k++) { const px = c.rr(-600, 2200), py = c.rr(GY - 10, GY + 260); stones += c.cut(c.blob(px, py, c.rr(8, 16), c.rr(4, 7), 8, 0.2), 0.4, 4); }
  ground.add(sheet().x(stones, T(C.sand2), 'opacity=".7"').out() + grass(c, { x0: -600, x1: 2200, y: 0, fn: (x) => gfn(x) + 2, n: 24, h: 12, color: T(C.olive) }));
  return {
    c, sk, sk2, starL, hangL, sunEl, back, ground, gfn, T,
    update(time, { sunX = sunAt[0], sunY = sunAt[1], sunO = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6), o: sunO });
      cls.forEach((k) => swing(k.el, k.x + Math.sin(time * 0.1 + k.i * 2) * 22, k.y, time, 1.2, 0.6, k.i));
    },
  };
}
/**
 * A house with a door that opens, added to layers (dark inside + glow behind the wall; wall; the leaf on `leafL`).
 * origin: bottom-left at (x0, base). Returns { wall, dark, glow, leaf, door:[x, w, h], win, open(k), lit(k) }.
 */
export function doorHouse(S, L, leafL, c, { x0, base, w = 250, h = 230, wall = C.plaster, dw = 68, dh = 144 }) {
  const o = openHouseLk(c, { w, h, dw, dh, wall });
  const g = { x0, base, w, h, door: [x0 + o.door[0], o.door[1], o.door[2]] };
  g.dark = L.add(`<g transform="translate(${x0} ${base})">${o.inside}</g>`);
  g.glow = L.add(`<g opacity="0"><g transform="translate(${x0} ${base})">${o.glow}</g></g>`);
  g.wall = L.add(`<g transform="translate(${x0} ${base})">${o.wall}</g>`);
  g.leaf = leafL.add(`<g>${o.leaf}</g>`);
  g.open = (k) => pose(g.leaf, { x: g.door[0], y: base, sx: Math.max(0.06, 1 - clamp(k) * 0.94), o: 1 });
  g.lit = (k) => fade(g.glow, k);
  return g;
}
import { openHouse as openHouseLk } from '../matthew10/lib.js';

/* ====================================================================== a town square with its gate */
/**
 * A small walled town seen from inside its square: the town wall across the back with an arched gate in the middle
 * (GATE), and beyond it the hills and the road that comes to the town (ROADIN, where far walkers go on layer `beyond`);
 * houses with doors in front of the wall on both sides (houses[]: doorHouse handles); the paved square at GY.
 * tint: pull everything toward grey-violet (the town that will not receive them).
 */
export const GATE = { X: 800, W: 150, H: 196, B: 632 };
export const ROADIN = [[800, 632], [770, 590], [830, 548], [900, 516], [960, 494], [1040, 476]];
export function squareSet(S, { skyCols = DAY, sky2 = null, sunAt = [1250, 150], seed = 'lk10-square', tint = 0, GY = 724, closed = false } = {}) {
  const c = makeCutter(seed);
  const T = (col, k = tint) => (k ? mix(col, mix(C.duskViolet, C.stone2, 0.4), k) : col);
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }) : null;
  if (sk2) sk2.layer.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 42), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cls = [[500, 190, 190], [1000, 160, 140]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w, T(C.cream), T('#eadcc0')), { x, y, len: 900 }), x, y, i }));
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [18, 8, 3], lens: [1000, 380, 130], color: T(mix(C.hillFar, C.duskViolet, 0.18)) }).markup);
  const hills = S.layer({ par: 0.16, sh: 3 });
  const hfn = (x) => 470 + 12 * Math.sin(x / 200) + 5 * Math.sin(x / 70);
  const hs_ = sheet().p(c.ridge(hfn, -900, 2500, 1700, 12, 1), T(C.hillMid));
  hs_.p(c.ribbon(ROADIN, (u) => lerp(70, 12, u), 1), T(mix(C.sand, C.cream, 0.3)));
  let tr_ = '';
  for (let i = 0; i < 18; i++) { const x = c.rr(-500, 2100); tr_ += c.cut(c.blob(x, hfn(x) - 6, c.rr(8, 14), c.rr(9, 14), 9, 0.15), 0.5, 4); }
  hs_.p(tr_, T(C.sage));
  hills.add(hs_.out() + olive(c, 640, 560, 0.6, { leaf: T(C.olive), leaf2: T(C.sage) }) + cypress(c, 1010, 530, 80, T(C.moss2)));
  const beyond = S.layer({ par: 0.16, sh: 3 });
  // the town wall with its gate
  const wall = S.layer({ par: 0.3, sh: 4 });
  const { X, W, H, B } = GATE;
  const w = sheet();
  const top = B - 250;
  const gatePts = [[X - W / 2, B + 2], [X - W / 2, B - H + W / 2], ...c.arc(X, B - H + W / 2, W / 2, W / 2, PI, 2 * PI, 12), [X + W / 2, B - H + W / 2], [X + W / 2, B + 2]];
  const crn = [];
  for (let x = -900; x < 2500; x += 44) crn.push([x, top], [x, top - 18], [x + 24, top - 18], [x + 24, top]);
  w.p(c.cut([[-900, B + 50], ...crn, [2500, top], [2500, B + 50]], 0.6, 12) + c.hole(gatePts, 0.4, 6), T(mix(C.stone, C.sand, 0.3)));
  w.p(c.cut([[-900, B], [X - W / 2, B], [X - W / 2, B + 50], [-900, B + 50]], 0.4, 12) + c.cut([[X + W / 2, B], [2500, B], [2500, B + 50], [X + W / 2, B + 50]], 0.4, 12), T(mix(C.stone2, C.sand2, 0.3)));
  let blocks = '';
  for (let y = top + 20; y < B; y += 30) for (let x = -900 + ((y / 30) % 2) * 30; x < 2500; x += 60) { if (Math.abs(x - X) < W / 2 + 30 && y > B - H - 30) continue; blocks += c.ribbon([[x, y], [x + 50, y + c.rr(-1, 1)]], 1.4); }
  w.x(blocks, T(shade(C.stone2, -0.1)), 'opacity=".45"');
  w.p(c.ribbon([[X - W / 2 - 8, B], [X - W / 2 - 8, B - H + W / 2], ...c.arc(X, B - H + W / 2, W / 2 + 8, W / 2 + 8, PI, 2 * PI, 12), [X + W / 2 + 8, B - H + W / 2], [X + W / 2 + 8, B]], 14), T(mix(C.stone2, C.sand2, 0.4)));
  if (closed) w.p(c.cut([[X - W / 2, B + 2], [X - W / 2, B - H + W / 2], ...c.arc(X, B - H + W / 2, W / 2, W / 2, PI, 2 * PI, 12), [X + W / 2, B - H + W / 2], [X + W / 2, B + 2]], 0.3, 6), T(C.wood2));
  wall.add(w.out());
  // houses with doors, in front of the wall
  const HL = S.layer({ par: 0.36, sh: 4 });
  const HG = S.layer({ par: 0.36, sh: 1, flat: true });
  const HD = S.layer({ par: 0.36, sh: 4 });
  const LF = S.layer({ par: 0.36, sh: 4 });
  const houses = [
    doorHouse(S, HL, LF, c, { x0: 150, base: GY - 26, w: 250, h: 250, wall: T(mix(C.plaster, C.peach, 0.12)), dw: 76, dh: 160 }),
    doorHouse(S, HL, LF, c, { x0: 440, base: GY - 44, w: 190, h: 200, wall: T(C.plaster2), dw: 64, dh: 140 }),
    doorHouse(S, HL, LF, c, { x0: 1000, base: GY - 44, w: 190, h: 210, wall: T(mix(C.plaster, C.sand, 0.2)), dw: 64, dh: 140 }),
    doorHouse(S, HL, LF, c, { x0: 1220, base: GY - 26, w: 260, h: 240, wall: T(mix(C.plaster2, C.stone, 0.3)), dw: 76, dh: 160 }),
  ];
  // the paved square
  const ground = S.layer({ par: 0.4, sh: 3 });
  const gfn = (x) => GY - 60 + 3 * Math.sin(x / 150);
  const g = sheet().p(c.ridge(gfn, -900, 2500, 1800, 12, 1), T(mix(C.sand, C.stone, 0.35)));
  let pv = '';
  for (let k = 0; k < 80; k++) { const px = c.rr(-600, 2200), py = c.rr(GY - 50, GY + 260); pv += c.cut(c.blob(px, py, c.rr(12, 24), c.rr(5, 9), 8, 0.2), 0.4, 4); }
  g.x(pv, T(C.stone2), 'opacity=".6"');
  ground.add(g.out());
  return {
    c, sk, sk2, hangL, sunEl, beyond, wall, HL, HG, HD, LF, houses, ground, gfn, T,
    update(time, { sunX = sunAt[0], sunY = sunAt[1], sunO = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6), o: sunO });
      cls.forEach((k) => swing(k.el, k.x + Math.sin(time * 0.1 + k.i * 2) * 22, k.y, time, 1.2, 0.6, k.i));
    },
  };
}

/* ====================================================================== the lake and its towns */
/**
 * The hillside high over the Sea of Galilee: far shore, the lake, and along the near shore the three towns where most
 * of His mighty works were done — Chorazin on its hill of black basalt (left), Capernaum on the water (middle),
 * Bethsaida at the mouth of the Jordan (right). The near hillside (par 0.5, ground at GY) is where Jesus stands.
 * TOWNS: { k, x, y, w } with their markup in townL (each its own cut-out: towns[k].el).
 */
export const LAKE_TOWNS = [
  { k: 'chorazin', x: 470, y: 474, w: 150, name: ['Korozain', 'Chorazin'] },
  { k: 'capernaum', x: 800, y: 540, w: 190, name: ['Kafarnaum', 'Capernaum'] },
  { k: 'bethsaida', x: 1130, y: 530, w: 150, name: ['Betsaida', 'Bethsaida'] },
];
export function lakeView(S, { skyCols = DAY, sky2 = null, sunAt = [1250, 150], GY = 748, seed = 'lk10-lake' } = {}) {
  const c = makeCutter(seed);
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }) : null;
  if (sk2) sk2.layer.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 40), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cl = hanging(hangL, cloud(c, 170), { x: 620, y: 180, len: 900 });
  S.layer({ par: 0.06, sh: 2 }).add(band(c, { y: 382, amps: [14, 6, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.22) }).markup);
  const lake = S.layer({ par: 0.1, sh: 2 });
  lake.add(waterBand(c, { y: 410, color: mix(C.lake, C.skyBlue, 0.2), foamN: 22, bottom: 900 }).markup);
  const shore = S.layer({ par: 0.16, sh: 3 });
  const sh = sheet();
  sh.p(c.cut([[-900, 1400], [-900, 520], [180, 506], [320, 450], [470, 432], [600, 470], [690, 540], [1000, 552], [1100, 540], [1300, 532], [2500, 528], [2500, 1400]], 1.2, 12), C.hillMid);
  sh.p(c.cut([[330, 452], [470, 434], [590, 468], [560, 480], [400, 476]], 0.8, 8), mix(C.hillMid, C.rock3, 0.35));        // the basalt hill of Chorazin
  sh.x(c.ribbon([[1230, 548], [1280, 610], [1300, 720]], 12), C.lake2, 'opacity=".85"');                                   // the Jordan
  let tr_ = '';
  for (let i = 0; i < 16; i++) { const x = c.rr(-400, 2000); if (LAKE_TOWNS.some((tw) => Math.abs(tw.x - x) < 90)) continue; tr_ += c.cut(c.blob(x, 560 + c.rr(0, 60), c.rr(9, 14), c.rr(8, 12), 9, 0.15), 0.5, 4); }
  sh.p(tr_, C.sage);
  shore.add(sh.out());
  const towns = {};
  const townL = S.layer({ par: 0.16, sh: 3 });
  LAKE_TOWNS.forEach((tw) => {
    const basalt = tw.k === 'chorazin';
    towns[tw.k] = { ...tw, el: townL.add(`<g transform="translate(${tw.x} ${tw.y})">${cityIconLk(makeCutter('lk10-t-' + tw.k), tw.w, basalt ? { wall: mix(C.rock3, C.storm, 0.2), wall2: mix(C.rock3, C.storm2, 0.35), tower: false } : { dome: tw.k === 'capernaum' })}</g>`) };
  });
  const near = S.layer({ par: 0.5, sh: 3 });
  const gfn = c.wave(GY - 40, [8, 3], [800, 200]);
  near.add(sheet().p(c.ridge(gfn, -900, 2500, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.4)).out());
  near.add(grass(c, { x0: -900, x1: 2500, y: 0, fn: gfn, n: 50, h: 14, color: C.moss }) + olive(c, 220, GY - 24, 1.1) + rock(c, 1360, GY - 16, 120, 38, C.rock2));
  return {
    c, sk, sk2, hangL, sunEl, cl, lake, shore, townL, towns, near, gfn,
    update(time, { sunO = 1, sunY = sunAt[1] } = {}) {
      pose(sunEl, { x: sunAt[0], y: sunY, r: Math.sin(time * 0.6), o: sunO });
      pose(cl, { x: 620 + Math.sin(time * 0.1) * 20, y: 180, r: Math.sin(time * 0.6 + 1) });
    },
  };
}
import { cityIcon as cityIconLk } from '../matthew11/lib.js';
/** a small round medallion of a mighty work (origin centre), with an icon inside; grey: its colour gone */
export function medallion(c, icon, { r = 26, grey = false } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 5, 24), 0.4, 4), grey ? mix(C.rock3, C.stone2, 0.4) : C.sun).p(c.cut(c.circ(0, 0, r, 24), 0.3, 4), grey ? mix(C.stone2, C.stone, 0.5) : C.cream).out();
  return `${grey ? '' : glow(r * 2.4, 0.9)}${s}${icon}`;
}
/** tiny icons for the medallions (origin centre, ~r 20) */
export function workIcon(c, kind) {
  const s = sheet();
  if (kind === 'eye') {
    s.p(c.cut([...c.arc(0, 2, 16, 10, PI, 2 * PI, 10), ...c.arc(0, -2, 16, 10, 0, PI, 10)], 0.2, 3), C.linen);
    s.x(c.poly(c.circ(0, 0, 5.4, 10)), C.inkSoft);
  } else if (kind === 'crutch') {
    s.p(c.ribbon([[-6, -16], [4, 16]], 3.4), C.wood);
    s.p(c.cut([[-15, -18], [3, -14], [2, -10], [-15, -14]], 0.2, 3), C.wood2);
    s.p(c.ribbon([[6, -14], [10, -4], [8, 6]], 2.6), C.moss);
  } else if (kind === 'loaves') {
    s.p(c.cut([[-16, 12], [16, 12], [12, 2], [-12, 2]], 0.3, 3), C.basket);
    s.p(c.cut(c.ell(-6, -2, 9, 6, 10), 0.3, 3) + c.cut(c.ell(7, -4, 8, 5.4, 10), 0.3, 3), C.wheat2);
    s.p(c.cut([[-2, -10], [8, -15], [16, -11], [8, -7]], 0.2, 2), C.lake3);
  } else if (kind === 'hand') {
    s.p(c.cut([[-8, 16], [-9, -2], [-12, -12], [-8, -14], [-5, -4], [-4, -16], [0, -17], [1, -6], [3, -16], [7, -15], [6, -4], [10, -12], [13, -10], [8, 4], [7, 16]], 0.3, 3), C.skin2);
  } else if (kind === 'leper') {
    s.p(c.cut(c.circ(0, -4, 11, 14), 0.3, 3), C.skin);
    s.p(c.cut([[-12, 16], [-10, 6], [10, 6], [12, 16]], 0.3, 3), C.linen);
    s.x(c.poly(c.star(10, -12, 7, 3, 4, 0)), C.sun);
  }
  return s.out();
}

/** a paper scorpion facing right (origin: between its feet, ~70 long); .tail curls over its back */
export function scorpion(c, col = mix(C.wood2, C.soilDark, 0.35)) {
  const s = sheet();
  let legs = '';
  for (let i = 0; i < 4; i++) legs += c.ribbon([[-8 + i * 7, -8], [-16 + i * 9, 0]], 2.2) + c.ribbon([[-8 + i * 7, -8], [-2 + i * 8, 0]], 2.2);
  s.p(legs, shade(col, -0.15));
  s.p(c.cut(c.ell(0, -9, 18, 7, 14), 0.3, 3), col);
  s.p(c.ribbon([[14, -10], [26, -16], [34, -12]], 3) + c.cut(c.ell(38, -14, 6, 4, 8, 0.4), 0.2, 2) + c.cut(c.ell(38, -8, 5, 3, 8, -0.3), 0.2, 2), col);
  const tail = sheet().p(c.ribbon(c.cbez([-16, -10], [-34, -14], [-38, -40], [-20, -46], 12), (u) => 7 - u * 3), col).p(c.cut([[-20, -46], [-12, -44], [-16, -38]], 0.2, 2), shade(col, -0.3)).out();
  return `<g>${s.out()}<g class="tail">${tail}</g></g>`;
}
/** a great paper scroll: two rollers and the sheet between (origin: the left roller's middle); the sheet is w wide */
export function heavenScroll(c, w = 700, h = 170) {
  const sheetM = sheet().p(c.cut([[0, -h / 2], [w, -h / 2 - 3], [w, h / 2 + 2], [0, h / 2]], 0.8, 10), mix(C.parchment, C.halo, 0.35)).x(c.ribbon([[10, -h / 2 + 12], [w - 10, -h / 2 + 10]], 2) + c.ribbon([[10, h / 2 - 12], [w - 10, h / 2 - 10]], 2), C.haloRim, 'opacity=".7"').out();
  const roller = sheet().p(c.cut(c.rect(-9, -h / 2 - 16, 18, h + 32), 0.3, 6), C.wood2).p(c.cut(c.ell(0, -h / 2 - 18, 12, 6, 10), 0.2, 3) + c.cut(c.ell(0, h / 2 + 18, 12, 6, 10), 0.2, 3), C.sun).out();
  return { sheet: sheetM, roller };
}
/** a line of golden writing (a name) with a little star before it; origin: its left end */
export function goldName(c, w = 120) {
  let d = '';
  let x = 22;
  while (x < w) { const l = c.rr(6, 16); d += c.ribbon([[x, c.rr(-1.5, 1.5)], [Math.min(x + l, w), c.rr(-1.5, 1.5)]], 2.4) + (c.chance(0.4) ? c.ribbon([[x + l * 0.5, -6], [x + l * 0.5 + 2, 3]], 1.8) : ''); x += l + c.rr(3, 8); }
  return `<path d="${d}" fill="${shade(C.ochre, -0.15)}"/><path d="${c.cut(c.star(8, 0, 8, 3.4, 5), 0.2, 2)}" fill="${C.sun}"/>`;
}

/* ====================================================================== the shade tree where the lawyer stands up */
/**
 * Morning at the edge of a village on the road to Jerusalem: the hills fall away behind, Jerusalem far off on the right
 * horizon, and the road going down between them; a great old terebinth spreads its shade over the knoll where Jesus
 * sits on a stone (SEAT); listeners sit on the grass around. Returns { sk, sk2, hangL, sunEl, back, ground, front(), update }.
 */
export const SHADE = { JX: 800, JY: 700, GY: 716 };
export function shadeSet(S, { skyCols = MORNING, sky2 = null, sunAt = [1250, 160], seed = 'lk10-shade' } = {}) {
  const c = makeCutter(seed);
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }) : null;
  if (sk2) sk2.layer.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 42), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cls = [[470, 200, 180], [1000, 170, 140]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 900 }), x, y, i }));
  const far = S.layer({ par: 0.07, sh: 2 });
  const fb = band(c, { y: 432, amps: [18, 8, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.22) });
  far.add(fb.markup + walledCity(c, 1330, fb.fn(1330) + 6, 0.42, { wall: mix(C.stone, C.duskViolet, 0.15), wall2: mix(C.stone2, C.duskViolet, 0.2), temple: C.cream }));
  const mid = S.layer({ par: 0.16, sh: 3 });
  const mfn = (x) => 500 + 14 * Math.sin(x / 210) + 5 * Math.sin(x / 80);
  const ms = sheet().p(c.ridge(mfn, -900, 2500, 1700, 12, 1), mix(C.hillMid, C.sand, 0.2));
  ms.p(c.ribbon([[1280, 452], [1200, 482], [1120, 506], [1060, 530], [1010, 560]], (u) => lerp(8, 26, u), 1), mix(C.sand, C.cream, 0.3));
  let tr_ = '';
  for (let i = 0; i < 18; i++) { const x = c.rr(-500, 2100); tr_ += c.cut(c.blob(x, mfn(x) - 6, c.rr(8, 14), c.rr(9, 14), 9, 0.15), 0.5, 4); }
  ms.p(tr_, C.sage);
  mid.add(ms.out() + town(c, { x: 260, y: mfn(260) + 14, n: 6, spread: 260, sc: 0.55 }));
  const back = S.layer({ par: 0.36, sh: 4 });
  // the great terebinth, its trunk behind the seat
  const tree = sheet();
  tree.p(c.cut([[760, 700], [770, 560], [720, 470], [700, 420], [740, 430], [790, 520], [830, 440], [880, 400], [890, 420], [840, 520], [850, 700]], 1, 8), C.wood2);
  tree.p(c.ribbon([[790, 520], [640, 440], [560, 430]], 12) + c.ribbon([[840, 500], [990, 420], [1060, 420]], 12), C.wood2);
  let lv = '', lv2 = '';
  for (let i = 0; i < 16; i++) { const x = c.rr(470, 1140), y = c.rr(300, 450); const b = c.cut(c.blob(x, y, c.rr(60, 100), c.rr(40, 60), 12, 0.2), 1, 7); if (i % 2) lv += b; else lv2 += b; }
  tree.p(lv2, C.moss).p(lv, C.leaf);
  back.add(tree.out());
  const ground = S.layer({ par: 0.4, sh: 3 });
  const gfn = (x) => 660 + 30 * Math.pow((x - 800) / 800, 2) + 5 * Math.sin(x / 130);
  ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.25)).out());
  ground.add(grass(c, { x0: -800, x1: 2400, y: 0, fn: (x) => gfn(x) + 2, n: 50, h: 14, color: C.moss }) + flowers(c, { x0: -300, x1: 1900, y: 0, fn: (x) => gfn(x) + c.rr(20, 120), n: 26, h: 14 }));
  ground.add(rock(c, 800, 704, 120, 40, C.rock2));
  return {
    c, sk, sk2, hangL, sunEl, back, ground, gfn,
    update(time, { sunO = 1 } = {}) {
      pose(sunEl, { x: sunAt[0], y: sunAt[1], r: Math.sin(time * 0.6), o: sunO });
      cls.forEach((k) => swing(k.el, k.x + Math.sin(time * 0.1 + k.i * 2) * 22, k.y, time, 1.2, 0.6, k.i));
    },
  };
}
/** a Torah scroll opened between two rollers, hung on strings (origin: the top middle) */
export function lawScroll(c, w = 260, h = 150) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.6, 8), C.parchment);
  let ln = '';
  for (let col = 0; col < 3; col++) for (let y = 16; y < h - 12; y += 10) { const x0 = -w / 2 + 20 + col * (w - 40) / 3; ln += c.ribbon([[x0, y], [x0 + (w - 40) / 3 - 16 - c.rr(0, 14), y + c.rr(-0.6, 0.6)]], 1.6); }
  s.x(ln, C.ink, 'opacity=".5"');
  s.p(c.cut(c.rect(-w / 2 - 14, -10, 14, h + 20), 0.3, 5) + c.cut(c.rect(w / 2, -10, 14, h + 20), 0.3, 5), C.wood2);
  s.p(c.cut(c.circ(-w / 2 - 7, -14, 7, 10), 0.2, 3) + c.cut(c.circ(w / 2 + 7, -14, 7, 10), 0.2, 3) + c.cut(c.circ(-w / 2 - 7, h + 14, 7, 10), 0.2, 3) + c.cut(c.circ(w / 2 + 7, h + 14, 7, 10), 0.2, 3), C.sun);
  return `<path d="M${-w / 2 - 7} -2000V-20M${w / 2 + 7} -2000V-20" stroke="${STRING}" stroke-width="1.3" fill="none"/>${s.out()}`;
}

/* ====================================================================== the road down from Jerusalem to Jericho */
/**
 * The steep desert road: Jerusalem on its hill far up on the left, Jericho's green oasis of palms far down on the
 * right, the bare hills between with the road winding down them, and in front the stretch of road where it happens —
 * its far side at ROAD.FAR, its near side at ROAD.NEAR — with the robbers' rocks on the right and a boulder on the left.
 * Returns { sk, sk2, starL, hangL, sunEl, back, rocksL, road, front(), update(time, o) }.
 */
export const ROAD = { FAR: 636, MID: 684, NEAR: 716, LIE: [770, 718] };
export function jerichoSet(S, { skyCols = HOT, sky2 = null, sunAt = [1180, 150], seed = 'lk10-jericho', robbersRocks = true } = {}) {
  const c = makeCutter(seed);
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }) : null;
  if (sk2) sk2.layer.fade(0);
  const starL = sky2 ? S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 }) : null;
  if (starL) { starL.add(stars(c, { x0: -800, x1: 2400, y0: -600, y1: 420, n: 110 })); starL.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46, { rays: C.sunDeep, disc: C.sun, inner: '#f3cf8c' }), { x: sunAt[0], y: sunAt[1], len: 900 });
  const far = S.layer({ par: 0.07, sh: 2 });
  const ffn = (x) => 400 - 70 * Math.exp(-Math.pow((x - 440) / 260, 2)) + 10 * Math.sin(x / 150);
  far.add(sheet().p(c.ridge(ffn, -900, 2500, 1700, 12, 1.2), mix(C.hillFar, C.dune, 0.35)).out());
  far.add(`<g transform="translate(440 ${ffn(440) + 26}) scale(.2)">${jerusalemLk(makeCutter('lk10-jer'), 1, { tglow: false })}</g>`);
  // Jericho, green, far below on the right
  const oasis = sheet().p(c.cut(c.blob(1380, 488, 170, 22, 14, 0.2), 0.8, 8), mix(C.sage, C.hillNear, 0.3)).out();
  far.add(oasis + palm(c, 1320, 494, 70) + palm(c, 1370, 490, 84) + palm(c, 1440, 496, 66) + town(c, { x: 1390, y: 494, n: 5, spread: 130, sc: 0.36 }));
  const mid = S.layer({ par: 0.16, sh: 3 });
  const mfn = (x) => 500 - 60 * Math.exp(-Math.pow((x - 300) / 300, 2)) + 8 * Math.sin(x / 110);
  const ms = sheet().p(c.ridge(mfn, -900, 2500, 1700, 12, 1.4), mix(C.dune, C.sand2, 0.4));
  // the road winding down from the top left toward Jericho
  ms.p(c.ribbon([[440, 440], [480, 470], [600, 500], [760, 520], [900, 540], [1080, 548], [1240, 560], [1400, 580], [1700, 610]], (u) => lerp(8, 30, u), 1), mix(C.sand, C.cream, 0.25));
  let st = '';
  for (let i = 0; i < 26; i++) { const x = c.rr(-500, 2100); st += c.cut(c.blob(x, mfn(x) + c.rr(10, 90), c.rr(12, 30), c.rr(6, 14), 8, 0.25), 0.6, 5); }
  ms.p(st, mix(C.rock2, C.dune, 0.3));
  mid.add(ms.out());
  const back = S.layer({ par: 0.3, sh: 3 });
  const bfn = (x) => 600 + 14 * Math.sin(x / 160 + 1);
  back.add(sheet().p(c.ridge(bfn, -900, 2500, 1700, 10, 1.4), mix(C.sand2, C.dune, 0.4)).out());
  back.add(rock(c, 300, 620, 200, 90, C.rock2) + rock(c, 1400, 626, 220, 110, mix(C.rock2, C.dune, 0.3)));
  const road = S.layer({ par: 0.4, sh: 3 });
  const r = sheet();
  r.p(c.cut([[-900, ROAD.FAR - 10], [2500, ROAD.FAR - 16], [2500, 1800], [-900, 1800]], 1, 16), mix(C.sand2, C.rock, 0.3));
  r.p(c.cut([[-900, ROAD.FAR], [2500, ROAD.FAR - 6], [2500, ROAD.NEAR + 16], [-900, ROAD.NEAR + 20]], 0.8, 16), mix(C.sand, C.cream, 0.25));
  let ruts = '';
  for (let i = 0; i < 40; i++) { const x = c.rr(-600, 2200), y = c.rr(ROAD.FAR + 10, ROAD.NEAR); ruts += c.cut(c.blob(x, y, c.rr(6, 14), c.rr(2, 4), 6, 0.2), 0.3, 3); }
  r.x(ruts, C.sand2, 'opacity=".7"');
  road.add(r.out());
  const rocksL = S.layer({ par: 0.42, sh: 5 });
  if (robbersRocks) rocksL.add(rock(c, 1160, ROAD.FAR + 6, 260, 170, mix(C.rock, C.dune, 0.2)) + rock(c, 1330, ROAD.FAR + 10, 200, 120, mix(C.rock2, C.dune, 0.2)));
  rocksL.add(rock(c, 250, ROAD.FAR + 4, 190, 110, mix(C.rock2, C.dune, 0.25)) + reeds(c, 420, ROAD.FAR, 5, 40, mix(C.olive, C.sand2, 0.4), C.wood3));
  return {
    c, sk, sk2, starL, hangL, sunEl, back, road, rocksL,
    front() {
      const f = S.layer({ par: 0.8, sh: 6 });
      f.add(rock(c, -60, 1000, 300, 110, mix(C.rock2, C.dune, 0.25)) + rock(c, 1660, 1000, 300, 120, mix(C.rock, C.dune, 0.25)));
      return f;
    },
    update(time, { sunX = sunAt[0], sunY = sunAt[1], sunO = 1 } = {}) { pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6), o: sunO }); },
  };
}
import { jerusalem as jerusalemLk } from '../mark11/lib.js';
/** a person cut-out laid down on the ground (origin: the feet; the body stretches to the left, face up) */
export function lying(markup, s = 1) {
  return `<g transform="scale(${s}) translate(0 -40) rotate(-90)">${markup}</g>`;
}

/* ====================================================================== the Samaritan's donkey */
import { colt as coltLk } from '../mark11/lib.js';
/** the Samaritan's donkey (mark11's colt), with a saddle cloth and two skins of oil and wine; rider: 'samaritan' | 'man' | '' */
export function samDonkey(c, rider = '') {
  const skins = sheet().p(c.cut(c.blob(-40, -84, 12, 18, 10, 0.15), 0.4, 4), mix(C.clay, C.wood3, 0.4)).p(c.cut(c.blob(-22, -80, 10, 15, 10, 0.15), 0.4, 4), C.leather).out();
  const saddle = sheet().p(c.cut([[-50, -104], [-10, -114], [30, -110], [36, -86], [32, -64], [-46, -66], [-52, -84]], 0.7, 6), C.teal2).x(c.ribbon([[-44, -70], [28, -72]], 3), C.ochre, 'opacity=".8"').out();
  let r = '';
  if (rider === 'samaritan') {
    const leg = sheet().p(c.cut([[14, -106], [40, -104], [44, -78], [42, -48], [30, -44], [22, -70]], 0.5, 6), SAMARITAN.robe).p(c.cut(c.ell(40, -42, 11, 4.6, 12), 0.3, 4), C.sandal).out();
    r = `<g transform="translate(-16 -106) scale(.95)">${samaritan(c, { pose: 'sit' })}</g>${leg}`;
  } else if (rider === 'man') {
    // the wounded man, slumped forward over the donkey's neck, bandaged
    const m = addToHead(person(c, { ...STRIPPED, pose: 'sit', eyes: 'closed' }), headBandageLk(c));
    const leg = sheet().p(c.cut([[14, -106], [40, -104], [44, -78], [42, -48], [30, -44], [22, -70]], 0.5, 6), STRIPPED.robe).p(c.cut(c.ell(40, -42, 11, 4.6, 12), 0.3, 4), shade(STRIPPED.skin, -0.08)).out();
    r = `<g transform="translate(-10 -104) scale(.95) rotate(22)">${bake(m, 60, 40, 20)}</g>${leg}`;
  }
  return coltLk(c, { over: skins + saddle, rider: r });
}
import { headBandage as headBandageLk } from '../mark12/lib.js';

/* ====================================================================== Martha's house */
/**
 * Martha's house cut open like a doll's house, in the warm afternoon: on the left the quiet corner with a rug and a
 * cushion where Jesus sits (SEAT) with Mary at His feet; on the right the busy corner — the clay oven with its fire,
 * the shelf of jars, the water jar, the kneading trough. Returns { back, props, front(), oven fire el, update }.
 */
export const MR = { X0: 330, X1: 1290, FLOOR: 706, CEIL: 286, SEAT: 700, OVEN: 1140 };
import { houseSection as houseSectionLk } from '../mark3/lib.js';
export function marthaRoom(S, { skyCols = WARM } = {}) {
  const c = makeCutter('lk10-martha');
  sky(S, skyCols);
  const outL = S.layer({ par: 0.12, sh: 2 });
  const h1 = hillsWith(c, { y: 470, amps: [16, 6, 2], lens: [700, 240, 90], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22 });
  outL.add(`<g transform="translate(1180 330)">${sun(c, 30)}</g>` + h1.markup + band(c, { y: 560, amps: [4, 2], lens: [400, 140], color: mix(C.hillNear, C.sand, 0.4) }).markup);
  const hs = houseSectionLk(c, { x0: MR.X0, x1: MR.X1, floor: MR.FLOOR, ceil: MR.CEIL, doorX: 40, doorW: 96, doorH: 196 });
  const back = S.layer({ par: 0.3, sh: 3 });
  back.add(hs.back);
  // the busy corner: the clay oven, jars, the trough
  const b = sheet();
  const OX = MR.OVEN;
  b.p(c.cut([[OX - 70, MR.FLOOR], [OX - 64, MR.FLOOR - 70], ...c.arc(OX, MR.FLOOR - 70, 64, 50, PI, 2 * PI, 12), [OX + 70, MR.FLOOR]], 0.6, 6), mix(C.clay, C.sand2, 0.35));
  b.p(c.cut([[OX - 26, MR.FLOOR], [OX - 26, MR.FLOOR - 40], ...c.arc(OX, MR.FLOOR - 40, 26, 22, PI, 2 * PI, 8), [OX + 26, MR.FLOOR]], 0.3, 5), C.soilDark);
  b.p(c.cut([[OX + 130, MR.FLOOR - 170], [OX + 130, MR.FLOOR - 176], [OX - 180, MR.FLOOR - 176], [OX - 180, MR.FLOOR - 170]], 0.3, 6), C.wood2);
  let jars = '';
  [[-160, 30, 26], [-110, 22, 34], [-60, 26, 24], [20, 20, 30], [80, 24, 22]].forEach(([dx, w, h]) => { jars += c.cut([[OX + dx - w / 2, MR.FLOOR - 176], [OX + dx - w / 2 - 4, MR.FLOOR - 176 - h * 0.6], [OX + dx - w * 0.3, MR.FLOOR - 176 - h], [OX + dx + w * 0.3, MR.FLOOR - 176 - h], [OX + dx + w / 2 + 4, MR.FLOOR - 176 - h * 0.6], [OX + dx + w / 2, MR.FLOOR - 176]], 0.3, 4); });
  b.p(jars, C.pot);
  b.p(c.cut([[OX - 230, MR.FLOOR], [OX - 238, MR.FLOOR - 56], [OX - 200, MR.FLOOR - 72], [OX - 170, MR.FLOOR - 56], [OX - 176, MR.FLOOR]], 0.4, 5), C.clay);
  // the quiet corner: a rug and a cushion
  b.p(c.cut([[430, MR.FLOOR + 4], [880, MR.FLOOR + 2], [896, MR.FLOOR + 26], [414, MR.FLOOR + 28]], 0.5, 8), C.terracotta);
  let pat = '';
  for (let x = 450; x < 870; x += 30) pat += c.poly([[x, MR.FLOOR + 14], [x + 8, MR.FLOOR + 8], [x + 16, MR.FLOOR + 14], [x + 8, MR.FLOOR + 20]]);
  b.x(pat, C.sun, 'opacity=".8"');
  b.p(c.cut([[700, MR.FLOOR], [704, MR.FLOOR - 30], [880, MR.FLOOR - 34], [886, MR.FLOOR]], 0.5, 6), C.dustyBlue);
  back.add(b.out());
  const fireL = S.layer({ par: 0.3, sh: 2 });
  const fire = fireL.add(`<g>${glow(120, 0.9, 'warm-glow')}<path d="${c.cut([[-18, 0], [-10, -26], [-2, -12], [4, -34], [12, -14], [18, 0]], 0.4, 3)}" fill="${C.sunDeep}"/><path d="${c.cut([[-9, 0], [-2, -18], [7, 0]], 0.3, 3)}" fill="${C.lampFlame}"/></g>`);
  return {
    back, fire, c,
    front() { const f = S.layer({ par: 0.32, sh: 6 }); f.add(hs.front); return f; },
    update(time) { pose(fire, { x: OX, y: MR.FLOOR - 4, sy: 1 + Math.sin(time * 8) * 0.08 }); },
  };
}
