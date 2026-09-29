// Luke 19 — the cast and cut-outs of this chapter. New here: Jericho, the city of palms, with its street of flat-roofed
// houses, the chief tax collector's booth and the broad sycamore-fig by the road; Zacchaeus himself (small, rich, a
// ruddy mantle and a gold-banded turban) and his fine house with its gate; the parable of the minas as painted flats —
// the nobleman's hall and throne, the far country across the sea, the ten silver minas, the cities given as little
// walled towns on strings, the handkerchief, the banker's table; the Mount of Olives with Bethphage and Bethany and
// the road down to the Kidron, Jerusalem across the valley; the ring of stakes. Borrowed pieces are noted where they
// are imported.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt } from '../kit.js';
import { band, hillsWith, house, sun, cloud, grass, olive, cypress, bush, flowers, rock, palm } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { es, ease, bump, seg, clamp } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { pose3, bakeArms, tiltHead } from '../matthew4/lib.js';
import { folk } from '../john6/lib.js';
import { jericho } from '../mark10/lib.js';
import { walledCity } from '../mark1/lib.js';
import { jerusalem, cityWall } from '../mark11/lib.js';
import { addToHead, addToBody, taxBooth as taxBoothM2 } from '../mark2/lib.js';

export { kf, moving, hand, headAt, addToHead, addToBody, speech, thought, spark, heart, wordSlip, coin, coinStack, ledger, taxBooth, coinScale, dust, scrollOpen, scrollRolled, lowTable, loaf, cup, jug, bowl, grapes, lantern, garland } from '../mark2/lib.js';
export { bubble, nameTag, strip, question, withFace, faceBits, pharisee, TWELVE, tapeX, shadowPerson } from '../mark3/lib.js';
export { voiceRings, sparkle, hang2, flame, dove, flapWings } from '../mark1/lib.js';
export { colt, coltRig, saddleCloaks, riderLeg, roadCloak, flyingCloak, oliveBranch, jerusalem, templeCourt, courtFront, changerTable, balance, cage, smallDove, flapDove, bench, lamb, priest, scribe, elder, TWO, jarProp, basketProp, grove, clothBanner, cityWall, ropeHalf } from '../mark11/lib.js';
export { bundle, bankTable, hardShadow, talent } from '../matthew25/lib.js';
export { crown, storyFrame, staff } from '../mark6/lib.js';
export { popAt, flyTo, label, fig, tagOnString, angryFace, puff, POOR, POORW, LAMEM, BLINDM, MAIMED } from '../luke14/lib.js';
export { face } from '../mark10/lib.js';
export { CAESAR, caesar, laurel, cameo } from '../luke2/lib.js';
export { handLamp, roundel, ashlar, hourglass } from '../mark13/lib.js';
export { beggarBowl, say } from '../mark10/lib.js';
export { pose3, bakeArms, tiltHead, folk, tr, es, ease, bump, seg, clamp, sheet, shade, mix, makeCutter, jericho, walledCity as walledCityM };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';

/* ================================================================== skies */
export const OASIS = ['#c3ddd6', '#ede9cf', '#f8e8c6'];          // Jericho: warm, green-blue over the palms
export const HOTNOON = ['#cfdcce', '#f1e5c4', '#f8e3bd'];
export const GOLDEN = ['#dcc3a3', '#f2d3a2', '#f7e2bd'];
export const EVENING = ['#a69abf', '#eab99c', '#f5d6b0'];
export const DUSK = ['#8f86ad', '#e3a58e', '#f3c79e'];
export const NIGHT = ['#161c42', '#29316a', '#4b5590'];
export const HALL = ['#e3cdb4', '#f1dcbf', '#f7e8cf'];            // the nobleman's hall
export const SEA = ['#c4dcdc', '#e8ecdc', '#f5ecd4'];             // the far country over the sea
export const OLIVET = ['#cadfdb', '#efe7cd', '#f8ead0'];          // the Mount of Olives, morning
export const PRAISE = ['#d8dfe0', '#f4e6c6', '#fae5bd'];
export const LAMENT = ['#9e97b8', '#e2b3a0', '#f2d2b0'];          // the city seen through tears, late light
export const LAMENT2 = ['#6f6d97', '#c99a93', '#e8bfa2'];
export const TEMPLE = ['#d0e2dd', '#f1e6c9', '#f8ebd3'];

/* ================================================================== the cast */
/** Zacchaeus: a chief tax collector, rich and small — a ruddy mantle over fine linen, a gold-banded turban (draw at s ≈ 0.72) */
export const ZACC = { robe: C.linen, mantle: mix(C.terracotta, C.plumRobe, 0.35), mantleArm: true, belt: C.sun, hair: C.hair3, hairStyle: 'wrap', veil: mix(C.ochre, C.sun, 0.35), veil2: C.sunDeep, beard: 'short', skin: C.skin3 };
export const ZS = 0.72;                  // his scale beside ordinary people (≈ 0.95)
/** his clerk at the booth */
export const CLERK = { robe: C.linen2, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin2, belt: C.leather };
/** the man he once wronged, repaid fourfold */
export const WRONGED = { robe: mix(C.sageRobe, C.stone2, 0.35), mantle: null, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.rope };
/** grumblers at his gate */
export const GRUMBLE = [
  { robe: C.stone, mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.dustyBlue, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather },
  { robe: C.wheatRobe, mantle: null, hair: C.hair3, hairStyle: 'curly', beard: 'short', skin: C.skin3, belt: C.leather },
  { robe: C.roseRobe, mantle: null, hairStyle: 'veil', veil: C.linen2, veil2: C.roseRobe, hair: C.hair2, skin: C.skin2, beard: 'none' },
  { robe: C.linen2, mantle: C.tealRobe, hair: C.hair2, hairStyle: 'wrap', veil: C.stone, veil2: C.teal2, beard: 'wild', skin: C.skin4, belt: C.ochre },
  { robe: C.ochreRobe, mantle: null, hair: C.greyHair, hairStyle: 'bald', beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.rope },
];

/* the parable of the minas */
/** the nobleman (later the king): fine linen, a deep blue-violet mantle, a gold belt */
export const NOBLE = { robe: C.linen, mantle: mix(C.indigo, C.plumRobe, 0.45), mantleArm: true, belt: C.sun, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin2 };
/** his ten servants: the first three who come to the reckoning, then seven more */
export const SERV = [
  { robe: C.tealRobe, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.ochre },           // ten minas
  { robe: C.wheatRobe, mantle: null, hair: C.hair, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: C.leather },           // five
  { robe: mix(C.stone2, C.sageRobe, 0.4), mantle: null, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'short', skin: C.skin4, belt: C.rope }, // the handkerchief
  { robe: C.mauve, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin, belt: C.leather },
  { robe: C.dustyBlue, mantle: null, hair: C.hair3, hairStyle: 'curly', beard: 'short', skin: C.skin4, belt: C.ochre },
  { robe: C.sageRobe, mantle: null, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather },
  { robe: C.ochreRobe, mantle: null, hair: C.hair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', skin: C.skin3, belt: C.rope },
  { robe: C.roseRobe, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather },
  { robe: C.plumRobe, mantle: null, hair: C.hair3, hairStyle: 'short', beard: 'none', skin: C.skin3, belt: C.ochre },
  { robe: C.linen2, mantle: null, hair: C.hair, hairStyle: 'curly', beard: 'full', skin: C.skin4, belt: C.leather },
];
/** his citizens who hated him, and their envoy */
export const CITIZ = [
  { robe: C.stone2, mantle: mix(C.curtain2, C.soil, 0.25), hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.curtain2, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather },
  { robe: mix(C.plumRobe, C.stone2, 0.3), mantle: null, hair: C.hair3, hairStyle: 'curly', beard: 'wild', skin: C.skin4, belt: C.rope },
  { robe: C.ochreRobe, mantle: C.clayMantle, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather },
  { robe: mix(C.tealRobe, C.stone2, 0.3), mantle: null, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin2, belt: C.leather },
];
export const ENVOY = { robe: C.linen2, mantle: mix(C.curtain2, C.terracotta, 0.4), hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: C.curtain2, beard: 'full', skin: C.skin3, belt: C.ochre, mantleArm: true };
/** the bystanders / guards at the king's throne */
export const GUARD = { robe: mix(C.clayMantle, C.stone2, 0.3), mantle: null, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather };
/** the owners of the colt in Bethphage */
export const OWNER = { robe: C.sageRobe, mantle: C.wheatRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.olive, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather };
export const OWNER2 = { robe: C.clayMantle, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.rope };

/* ================================================================== small helpers */
export const onString = (inner, len = 2400) => `<g><path d="M0 ${-len}V0" stroke="${STRING}" stroke-width="1.3" fill="none"/>${inner}</g>`;
/** a still group baked into one cut-out: members [{x, y, s, flip, o, head, armF, armB}] */
export const still = (c, members) => pose3(c, members);
/** a point u ∈ [0, 1] along a polyline */
export function along(pts, u) {
  const lens = [];
  let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); lens.push(l); tot += l; }
  let d = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) { const k = lens[i] ? Math.min(1, d / lens[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; }
    d -= lens[i];
  }
  return pts[pts.length - 1];
}
/** a warm glow disc (behind things) */
export const glow = (r = 120, o = 1, id = 'warm-glow') => `<circle r="${r}" fill="url(#${id})" opacity="${o}"/>`;

/* ================================================================== the minas */
/** a silver mina: a broad bright silver coin with a stamped rosette (origin centre) */
export function mina(c, r = 12) {
  const s = sheet();
  const rim = mix(C.stone2, C.rock2, 0.45), face = mix(C.linen, C.skyBlue, 0.35);
  s.p(c.cut(c.circ(0, 0, r, 18), 0.3, 3), rim);
  s.p(c.cut(c.circ(0, 0, r * 0.76, 16), 0.2, 3), face);
  s.x(c.poly(c.star(0, 0, r * 0.44, r * 0.2, 6, 0)), mix(C.stone2, C.dustyBlue, 0.4));
  s.x(c.poly(c.ell(-r * 0.36, -r * 0.4, r * 0.24, r * 0.12, 8, -0.6)), '#ffffff', 'opacity=".9"');
  return s.out();
}
/** a pile of n minas, as one cut-out (origin: bottom centre), rows of 4, 3, 2, 1 … */
export function minaPile(c, n, r = 12) {
  let out = '';
  const rows = [];
  let left = n, w = Math.min(4, n);
  while (left > 0) { const k = Math.min(w, left); rows.push(k); left -= k; w = Math.max(1, w - 1); }
  rows.forEach((k, row) => { for (let i = 0; i < k; i++) out += `<g transform="translate(${((i - (k - 1) / 2) * r * 1.8).toFixed(1)} ${(-r - row * r * 1.45).toFixed(1)})">${mina(c, r)}</g>`; });
  return out;
}
/** a little walled city on a string, for the cities given to the faithful servant (origin: the knot; hangs below) */
export function cityToken(c, { r = 30, col = C.cream, len = 1800 } = {}) {
  const s = sheet();
  s.p(c.cut(c.circ(0, r + 4, r + 4, 26), 0.4, 4), C.haloRim).p(c.cut(c.circ(0, r + 4, r, 26), 0.4, 4), col);
  const town = walledCity(c, 0, r * 1.5, r / 70, { wall: mix(C.stone, C.sand, 0.3), wall2: mix(C.stone2, C.sand2, 0.3), temple: C.plaster });
  return `<path d="M0 ${-len}V0" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}${town}`;
}
/** a folded handkerchief with the mina laid in it; open 0 (a knotted bundle) … 1 (spread flat, the coin showing); origin centre */
export function kerchief(c, col = mix(C.linen2, C.stone, 0.35)) {
  const shut = sheet().p(c.cut([[-18, 4], [-22, -8], [-12, -18], [-4, -16], [0, -26], [6, -16], [14, -18], [22, -8], [18, 4]], 0.5, 4), col).x(c.ribbon([[-7, -16], [8, -15]], 2.4), C.rope).out();
  const open = sheet().p(c.cut([[-34, 0], [-20, -14], [0, -18], [22, -14], [36, 0], [22, 10], [0, 14], [-22, 10]], 0.6, 5), col).x(c.ribbon([[-26, -2], [28, -3]], 1.2) + c.ribbon([[-4, -14], [2, 10]], 1.2), shade(col, -0.2), 'opacity=".55"').out();
  return { shut, open };
}

/* ================================================================== Jericho */
/**
 * The sycamore-fig: a thick short trunk forking low into broad limbs and a wide dome of leaves; the crown is in two
 * pieces so a man can sit in it: back (trunk, limbs, the far leaves) and front (a few near leaf clusters that hide his
 * legs). Origin: foot of the trunk; the fork where he sits is at FORK.
 */
export const FORK = [-6, -232];
export function sycamore(c, sc = 1) {
  const P = (pts) => pts.map(([x, y]) => [x * sc, y * sc]);
  const b = sheet();
  // the dome of leaves: many ragged clumps in three greens, the far ones darker
  const tones = [mix(C.moss, C.moss2, 0.4), C.moss, mix(C.leaf, C.moss, 0.35)];
  const byTone = ['', '', ''];
  for (let i = 0; i < 46; i++) {
    const u = c.rr(0, 1), a = PI * (1.02 + u * 0.96), r = Math.sqrt(c.rr(0.15, 1));
    const bx = Math.cos(a) * 270 * r, by = -290 + Math.sin(a) * 150 * r + c.rr(-10, 10);
    const tone = by < -360 ? 0 : c.ri(0, 2);
    byTone[tone] += c.cut(P(c.blob(bx, by, c.rr(40, 62), c.rr(28, 42), 16, 0.2)), 1.3, 5);
  }
  // a skirt of clumps along the underside, over the limbs' ends
  for (let i = 0; i < 12; i++) { const bx = -250 + i * 45 + c.rr(-10, 10), by = -236 - Math.abs(bx) * 0.12 + c.rr(-8, 8); byTone[i % 2 ? 1 : 0] += c.cut(P(c.blob(bx, by, c.rr(34, 48), c.rr(20, 28), 14, 0.22)), 1.2, 5); }
  b.p(byTone[0], tones[0]).p(byTone[1], tones[1]);
  // trunk and limbs
  const bark = mix(C.wood3, C.rock2, 0.35);
  b.p(c.cut(P([[-44, 0], [-34, -60], [-30, -130], [-60, -180], [-150, -250], [-170, -262], [-150, -270], [-40, -214], [-8, -236], [-20, -300], [-6, -306], [14, -236], [60, -226], [170, -270], [190, -262], [176, -250], [70, -200], [34, -150], [30, -60], [46, 0]]), 0.9, 7), bark);
  b.x(c.ribbon(P([[-18, -10], [-14, -80], [-20, -150]]), 3) + c.ribbon(P([[14, -20], [10, -110]]), 2.4) + c.ribbon(P([[-70, -196], [-130, -240]]), 2), shade(bark, -0.2), 'opacity=".55"');
  // figs on the trunk (the sycamore fruits on its wood)
  let figs = '';
  [[-26, -120], [20, -90], [-10, -160], [40, -186], [-52, -186]].forEach(([x, y]) => { figs += c.cut(P(c.ell(x, y, 5.5, 7, 10)), 0.2, 3); });
  b.p(figs, mix(C.wheatGreen, C.clay, 0.45));
  // near clumps up on the limbs, still behind a sitter
  b.p(byTone[2], tones[2]);
  let hi = '';
  for (let i = 0; i < 40; i++) { const a = PI * c.rr(1.05, 1.95), r = Math.sqrt(c.rr(0.1, 1)); hi += c.cut(P(c.ell(Math.cos(a) * 250 * r, -300 + Math.sin(a) * 140 * r, c.rr(6, 10), c.rr(3.5, 5.5), 8, c.rr(-0.6, 0.6))), 0.3, 3); }
  b.x(hi, mix(C.leaf, C.sage3, 0.45), 'opacity=".7"');
  // in front of the sitter: a few low clumps that hide his legs
  const f = sheet();
  let n2 = '';
  [[-64, -204, 50, 22], [40, -200, 58, 22], [-8, -194, 36, 18], [110, -214, 40, 22]].forEach(([bx, by, rx, ry]) => { n2 += c.cut(P(c.blob(bx, by, rx, ry, 16, 0.22)), 1.2, 5); });
  f.p(n2, mix(C.leaf, C.moss, 0.25));
  let veins = '';
  for (let i = 0; i < 12; i++) { const x = c.rr(-100, 130), y = c.rr(-214, -186); veins += c.cut(P(c.ell(x, y, c.rr(6, 9), c.rr(3, 4.5), 8, c.rr(-0.6, 0.6))), 0.3, 3); }
  f.x(veins, mix(C.leaf, C.sage3, 0.45), 'opacity=".75"');
  return { back: b.out(), front: f.out() };
}

export const JR = { GY: 700, STREET: 640, TREE: 1180, BOOTH: 1180, CITY: 300 };
/**
 * Jericho: the oasis sky, the desert hills, the walled city of palms far behind on the left, a street of flat-roofed
 * houses, the paved road through town; optionally the tax booth (booth: true) or the sycamore-fig (tree: x).
 * Returns { c, sk, hangL, sunEl, cityL, streetL, groundL, gy, treeBack, treeFront(L), crowdL, act, fx, update(T) }.
 */
export function jerichoSet(S, { skyCols = OASIS, sunAt = [1250, 150], tree = null, treeS = 1, booth = null, houses = true, cityX = JR.CITY, seed = 'lk19-jericho' } = {}) {
  const c = makeCutter(seed);
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 40), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[520, 150, 170], [980, 110, 130]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  // the bare hills of the Judean desert, and Jericho's green oasis before them
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [26, 10, 3], lens: [1100, 380, 130], color: mix(C.dune, C.hillFar, 0.45) }).markup);
  const oasis = S.layer({ par: 0.14, sh: 2 });
  const ob = hillsWith(c, { y: 500, amps: [8, 4, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.sage2, 0.3), trees: 26, treeColor: mix(C.moss, C.olive, 0.4), treeH: 22 });
  let far = ob.markup;
  for (let i = 0; i < 12; i++) { const x = -600 + i * 260 + c.rr(-60, 60); far += palm(c, x, ob.fn(x) + 6, c.rr(70, 110)); }
  oasis.add(far);
  const cityL = S.layer({ par: 0.2, sh: 3 });
  cityL.add(`<g transform="translate(${cityX} 560)">${jericho(c, 1.25)}</g>`);
  // the street: houses both sides of the road through town
  const streetL = S.layer({ par: 0.32, sh: 3 });
  const gfn = c.wave(JR.STREET, [4, 2], [700, 200]);
  if (houses) {
    let hs = '';
    const cols = [C.plaster, mix(C.plaster, C.sand, 0.4), C.parchment, mix(C.plaster2, C.stone, 0.5), mix(C.sand, C.dawn, 0.4)];
    for (let x = -700; x < 2400; x += c.rr(120, 170)) {
      if (tree !== null && Math.abs(x + 50 - tree) < 260) continue;
      const w = c.rr(90, 140), h = c.rr(80, 130);
      hs += house(c, x, JR.STREET - 16, w, h, { wall: c.pick(cols), stairs: c.chance(0.5) });
      if (c.chance(0.35)) hs += palm(c, x + w + 20, JR.STREET - 12, c.rr(150, 210));
    }
    streetL.add(hs);
  }
  const groundL = S.layer({ par: 0.4, sh: 3 });
  const g = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.dune, 0.2));
  // the road through town, paved
  g.p(c.cut([[-900, JR.STREET + 26], [2500, JR.STREET + 22], [2500, JR.GY + 70], [-900, JR.GY + 74]], 1.2, 16), mix(C.stone, C.sand, 0.45));
  let cob = '';
  for (let i = 0; i < 70; i++) { const x = c.rr(-700, 2300), y = c.rr(JR.STREET + 34, JR.GY + 60); cob += c.cut(c.blob(x, y, c.rr(9, 16), c.rr(3, 6), 8, 0.2), 0.3, 4); }
  g.x(cob, shade(C.stone, -0.1), 'opacity=".55"');
  groundL.add(g.out() + grass(c, { x0: -700, x1: 2300, y: JR.GY + 80, n: 40, h: 14, color: C.olive }));
  let treeBack = null, treeFrontM = '', treeLayer = null;
  if (tree !== null) {
    treeLayer = S.layer({ par: 0.48, sh: 4 });
    const T = sycamore(c, treeS);
    treeBack = treeLayer.add(`<g transform="translate(${tree} ${JR.GY - 14})">${T.back}</g>`);
    treeFrontM = `<g transform="translate(${tree} ${JR.GY - 14})">${T.front}</g>`;
  }
  let boothFrontM = '';
  if (booth !== null) {
    const B = taxBoothM2(c, 260, 250);
    groundL.add(`<g transform="translate(${booth} ${JR.GY - 20})">${B.back}</g>`);
    boothFrontM = `<g transform="translate(${booth} ${JR.GY - 20})">${B.front}</g>`;
  }
  const crowdL = S.layer({ par: 0.45, sh: 4 });
  const act = S.layer({ par: 0.48, sh: 5 });
  const fx = S.layer({ par: 0.48, sh: 6 });
  return {
    c, sk, hangL, sunEl, cityL, streetL, groundL, gy: gfn, treeLayer, treeBack, crowdL, act, fx,
    /** the booth's counter in front of whoever sits in it (call with the layer to draw it in) */
    boothFront(L) { return booth !== null ? L.add(boothFrontM) : null; },
    /** the near leaves of the sycamore, in front of a sitter (call after his layer) */
    treeFront(L) { return tree !== null ? L.add(treeFrontM) : null; },
    update(T, { sunY = sunAt[1] } = {}) {
      swing(sunEl, sunAt[0], sunY, T, 1, 0.6);
      cls.forEach((k) => swing(k.el, k.x + (T ? Math.sin(T * 0.1 + k.i) * 18 : 0), k.y, T, 1.2, 0.6, k.i));
    },
  };
}

/* ================================================================== Zacchaeus' house */
export const ZH = { GY: 712, DX: 900, DW: 96, DH: 176, STEP: 30, X0: 640, X1: 1560, WIN: [-390, -250, -110, 150, 290, 440] };
/**
 * The rich man's house in Jericho: two storeys of pale plaster with a parapet, latticed windows above, an arched
 * doorway with its leaves open onto a lamp-lit room (inside can glow brighter: litK), two steps before it, palms in
 * tubs and jars; a garden wall runs off to the left; a paved court before it. sky2 (optional) fades in over the day.
 * Returns { c, sk2, hangL, houseL, inside, winGlow, groundL, act, fx, front, update(T, { lit }) }.
 */
export function zacHouse(S, { skyCols = OASIS, sky2 = null, seed = 'lk19-house', sunAt = [1300, 150] } = {}) {
  const c = makeCutter(seed);
  sky(S, skyCols);
  let sk2 = null;
  if (sky2) { sk2 = sky(S, sky2, { name: 'sky2', rise: 0 }).layer; sk2.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 38), { x: sunAt[0], y: sunAt[1], len: 800 });
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [26, 10, 3], lens: [1100, 380, 130], color: mix(C.dune, C.hillFar, 0.45) }).markup);
  const oasis = S.layer({ par: 0.14, sh: 2 });
  const ob = hillsWith(c, { y: 500, amps: [8, 4, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.sage2, 0.3), trees: 26, treeColor: mix(C.moss, C.olive, 0.4), treeH: 22 });
  let far = ob.markup;
  for (let i = 0; i < 10; i++) { const x = -600 + i * 300 + c.rr(-60, 60); far += palm(c, x, ob.fn(x) + 6, c.rr(80, 120)); }
  oasis.add(far);
  const { GY, DX, DW, DH, STEP, X0, X1 } = ZH;
  const FL = GY - STEP * 2;          // floor of the doorway
  // the lit room seen through the door (can brighten)
  const insideL = S.layer({ par: 0.4, sh: 1 });
  insideL.add(sheet().p(c.cut(c.rect(DX - DW / 2 - 4, FL - DH - 10, DW + 8, DH + 14), 0.4, 8), mix(C.ochre, C.wood2, 0.4)).out());
  const inside = insideL.add(`<g><circle cx="${DX}" cy="${FL - DH * 0.5}" r="120" fill="url(#warm-glow)"/><path d="${c.poly(c.rect(DX - DW / 2, FL - DH * 0.55, DW, DH * 0.55))}" fill="${mix(C.lampGlow, C.ochre, 0.35)}" opacity=".55"/></g>`);
  const houseL = S.layer({ par: 0.4, sh: 4 });
  const H = sheet();
  const wall = mix(C.plaster, C.parchment, 0.4), wall2 = mix(C.plaster2, C.sand, 0.3);
  const arch = [[DX - DW / 2, FL + 2], [DX - DW / 2, FL - DH + DW / 2], ...c.arc(DX, FL - DH + DW / 2, DW / 2, DW / 2, PI, 2 * PI, 14), [DX + DW / 2, FL - DH + DW / 2], [DX + DW / 2, FL + 2]];
  H.p(c.cut([[X0, GY - 380], [X1, GY - 380], [X1, FL + 4], [X0, FL + 4]], 0.8, 14) + c.hole(arch, 0.4, 6), wall);
  H.p(c.cut([[X0 - 12, GY - 396], [X1 + 12, GY - 396], [X1 + 12, GY - 378], [X0 - 12, GY - 378]], 0.4, 12), C.roof);
  let par = '';
  for (let x = X0; x < X1; x += 40) par += c.cut(c.rect(x, GY - 414, 26, 20), 0.3, 5);
  H.p(par, wall2);
  H.p(c.cut([[X0, GY - 210], [X1, GY - 210], [X1, GY - 200], [X0, GY - 200]], 0.3, 12), wall2);
  // the doorway frame and a lintel stone
  H.p(c.ribbon([[DX - DW / 2 - 8, FL + 2], [DX - DW / 2 - 8, FL - DH + DW / 2]], 14) + c.ribbon([[DX + DW / 2 + 8, FL + 2], [DX + DW / 2 + 8, FL - DH + DW / 2]], 14) + c.ribbon(c.arc(DX, FL - DH + DW / 2, DW / 2 + 8, DW / 2 + 8, PI, 2 * PI, 16), 14), C.stone2);
  // windows: latticed above, shuttered below
  let win = '', lat = '';
  ZH.WIN.map((w) => DX + w).forEach((x) => {
    win += c.cut(c.rect(x - 26, GY - 340, 52, 70), 0.3, 6);
    for (let k = 1; k < 4; k++) lat += c.ribbon([[x - 26 + k * 13, GY - 340], [x - 26 + k * 13, GY - 270]], 2) + c.ribbon([[x - 26, GY - 340 + k * 17], [x + 26, GY - 340 + k * 17]], 2);
  });
  H.p(win, mix(C.soilDark, C.wood2, 0.3));
  H.x(lat, C.wood3);
  [DX - 250, DX + 250, DX + 420].forEach((x) => { H.p(c.cut(c.rect(x - 22, GY - 170, 44, 50), 0.3, 5), mix(C.soilDark, C.wood2, 0.3)); H.p(c.cut(c.rect(x - 30, GY - 176, 16, 60), 0.3, 4) + c.cut(c.rect(x + 14, GY - 176, 16, 60), 0.3, 4), C.teal2); });
  // plaster wear
  let sp = '';
  for (let i = 0; i < 14; i++) sp += c.cut(c.blob(c.rr(X0 + 40, X1 - 40), c.rr(GY - 360, GY - 60), c.rr(12, 26), c.rr(5, 10), 8, 0.2), 0.5, 4);
  H.x(sp, wall2, 'opacity=".6"');
  // the garden wall to the left, with palms behind it
  houseL.add(palm(c, X0 - 150, GY - 60, 230) + palm(c, X0 - 330, GY - 60, 200));
  H.p(c.cut([[-900, GY - 150], [X0, GY - 150], [X0, GY], [-900, GY]], 0.6, 14), wall2);
  H.p(c.cut([[-900, GY - 162], [X0, GY - 162], [X0, GY - 148], [-900, GY - 148]], 0.4, 12), C.stone2);
  houseL.add(H.out());
  // the open door leaves
  const leaf = (x, sx) => `<g transform="translate(${x} ${FL}) scale(${sx} 1)">${sheet().p(c.cut([[0, 2], [0, -DH + DW / 2], ...c.arc(DW / 4, -DH + DW / 2, DW / 4, DW / 2, PI, 1.5 * PI, 8), [DW / 4, -DH], [DW / 2, -DH + 6], [DW / 2, 2]], 0.4, 6), C.wood).x(c.ribbon([[4, -50], [DW / 2 - 4, -50]], 3) + c.ribbon([[4, -130], [DW / 2 - 4, -130]], 3), C.wood2, 'opacity=".7"').out()}</g>`;
  houseL.add(leaf(DX - DW / 2, -0.34) + leaf(DX + DW / 2, 0.34));
  // steps, tubs, jars
  const st = sheet();
  st.p(c.cut(c.rect(DX - 110, GY - STEP, 220, STEP + 2), 0.4, 8), mix(C.stone, C.cream, 0.3));
  st.p(c.cut(c.rect(DX - 80, FL, 160, STEP + 2), 0.4, 8), C.stone);
  houseL.add(st.out());
  houseL.add(`<g transform="translate(${DX - 200} ${GY})">${tub(c)}${palm(c, 0, -34, 120)}</g><g transform="translate(${DX + 200} ${GY})">${tub(c)}${palm(c, 0, -34, 110)}</g>`);
  const groundL = S.layer({ par: 0.45, sh: 3 });
  const g = sheet().p(c.cut([[-900, GY - 4], [2500, GY - 4], [2500, 1700], [-900, 1700]], 0.6, 20), mix(C.stone, C.sand, 0.45));
  let fl = '';
  for (let y = GY + 10; y < 1100; y += 38) for (let x = -700 + (Math.round(y / 38) % 2) * 44; x < 2300; x += 88) fl += c.cut(c.rect(x + c.rr(0, 4), y, 82, 32), 0.5, 10);
  g.x(fl, shade(C.stone, -0.07), 'opacity=".45"');
  groundL.add(g.out());
  const act = S.layer({ par: 0.45, sh: 5 });
  const fx = S.layer({ par: 0.45, sh: 6 });
  return {
    c, sk2, hangL, sunEl, houseL, inside, groundL, act, fx, FL,
    update(T, { lit = 0, sunY = sunAt[1] } = {}) {
      swing(sunEl, sunAt[0], sunY, T, 1, 0.6);
      pose(inside, { o: 0.4 + lit * 0.6 });
    },
  };
}
/** a stone tub for a palm (origin: bottom centre) */
function tub(c) { return sheet().p(c.cut([[-26, 0], [-30, -34], [30, -34], [26, 0]], 0.4, 5), mix(C.pot, C.clay, 0.4)).p(c.ribbon([[-30, -30], [30, -30]], 4), shade(C.pot, -0.2)).out(); }

/* ================================================================== the nobleman's hall (the parable of the minas) */
/** a carved throne of dark wood with gold finials and a violet cushion (origin: floor centre, seat at y -64) */
export function kingThrone(c, { cushion = mix(C.plumRobe, C.indigo, 0.3) } = {}) {
  const s = sheet();
  const wood = mix(C.wood2, C.soilDark, 0.25);
  s.p(c.cut([[-58, 0], [-58, -66], [-50, -232], [-36, -250], [36, -250], [50, -232], [58, -66], [58, 0], [44, 0], [44, -40], [-44, -40], [-44, 0]], 0.5, 6), wood);
  s.p(c.cut([[-40, -80], [-38, -224], [38, -224], [40, -80]], 0.4, 6), cushion);
  s.x(c.ribbon([[-30, -150], [30, -150]], 2.4) + c.ribbon([[0, -214], [0, -90]], 2.4), shade(cushion, 0.25), 'opacity=".6"');
  s.p(c.cut(c.rect(-70, -74, 140, 14), 0.3, 5), mix(C.sun, C.ochre, 0.3));
  s.p(c.cut(c.rect(-62, -66, 124, 12), 0.3, 5), cushion);
  s.p(c.cut(c.circ(-52, -256, 9, 12), 0.3, 3) + c.cut(c.circ(52, -256, 9, 12), 0.3, 3) + c.cut(c.circ(0, -262, 11, 12), 0.3, 3), C.sun);
  s.x(c.poly(c.star(0, -120, 12, 5, 6, 0)), C.sun, 'opacity=".8"');
  return s.out();
}
export const KH = { FL: 720, THX: 470, DAIS: 32, WALL: 250 };
/**
 * The nobleman's hall as a painted flat: warm light through three tall arched windows (his town and the hills beyond
 * them), columns, a long violet hanging behind the dais on the left, the dais with its throne (empty until he is king:
 * throneK fades the throne in), a tiled floor. Returns { c, skyL, wallL, shadowL, daisL, throne, floorL, act, fx, update(T) }.
 */
export function hallSet(S, { skyCols = HALL, seed = 'lk19-hall', throneOn = true, mid = null } = {}) {
  const c = makeCutter(seed);
  const { FL, THX, DAIS } = KH;
  sky(S, skyCols, { rise: 0 });
  // the view through the windows: hills and the town
  const farL = S.layer({ par: 0.12, sh: 2 });
  const hb = hillsWith(c, { y: 470, amps: [16, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.hillFar, 0.4), trees: 20, treeColor: C.sage, treeH: 18 });
  farL.add(hb.markup + `<g>${townRow(c, 360, 1400, 520)}</g>`);
  const wallL = S.layer({ par: 0.3, sh: 4 });
  const w = sheet();
  const wc = mix(C.plaster, C.sand, 0.3);
  const WIN = [640, 900, 1160];
  let holes = '';
  WIN.forEach((x) => { holes += c.hole([[x - 70, 560], [x - 70, 330], ...c.arc(x, 330, 70, 70, PI, 2 * PI, 14), [x + 70, 330], [x + 70, 560]], 0.4, 6); });
  w.p(c.cut([[-900, -600], [2500, -600], [2500, FL + 10], [-900, FL + 10]], 0.6, 20) + holes, wc);
  // window frames and sills
  let fr = '';
  WIN.forEach((x) => { fr += c.ribbon([[x - 78, 562], [x - 78, 330]], 10) + c.ribbon([[x + 78, 562], [x + 78, 330]], 10) + c.ribbon(c.arc(x, 330, 78, 78, PI, 2 * PI, 16), 10) + c.ribbon([[x - 90, 566], [x + 90, 566]], 12); });
  w.p(fr, mix(C.stone2, C.sand2, 0.3));
  // columns between the windows
  let col = '';
  [770, 1030, 1300, 250].forEach((x) => { col += c.cut([[x - 26, FL + 4], [x - 22, 180], [x + 22, 180], [x + 26, FL + 4]], 0.4, 10); });
  w.p(col, mix(C.stone, C.cream, 0.3));
  let cap = '';
  [770, 1030, 1300, 250].forEach((x) => { cap += c.cut(c.rect(x - 38, 164, 76, 20), 0.3, 6) + c.cut(c.rect(x - 34, FL - 16, 68, 20), 0.3, 6); });
  w.p(cap, mix(C.stone2, C.sand2, 0.3));
  w.p(c.cut([[-900, 140], [2500, 140], [2500, 166], [-900, 166]], 0.4, 20), mix(C.roof, C.wood3, 0.3));
  // the hanging behind the throne
  w.p(c.cut([[THX - 110, 170], [THX + 110, 170], [THX + 104, FL - 40], [THX, FL - 70], [THX - 104, FL - 40]], 0.5, 8), mix(C.plumRobe, C.indigo, 0.35));
  w.x(c.ribbon([[THX - 96, 196], [THX + 96, 196]], 6) + c.ribbon([[THX - 96, FL - 60], [THX + 96, FL - 60]], 4), C.sun, 'opacity=".75"');
  w.x(c.poly(c.star(THX, 330, 30, 12, 8, 0)), C.sun, 'opacity=".55"');
  wallL.add(w.out());
  const shadowL = S.layer({ par: 0.3, sh: 0, flat: true });
  const floorL = S.layer({ par: 0.46, sh: 3 });
  const f = sheet().p(c.cut([[-900, FL - 6], [2500, FL - 6], [2500, 1700], [-900, 1700]], 0.6, 20), mix(C.stone, C.sand, 0.4));
  let tl = '';
  for (let i = 0; i < 8; i++) { const y = FL + 6 + i * i * 6 + i * 12; tl += c.ribbon([[-900, y], [2500, y]], 1.3); }
  for (let x = -900; x < 2500; x += 100) tl += c.ribbon([[x, FL], [800 + (x - 800) * 2, 1700]], 1.2);
  f.x(tl, shade(C.stone, -0.15), 'opacity=".4"');
  // a long carpet from the door to the dais
  f.p(c.cut([[THX + 60, FL + 10], [1700, FL + 6], [1760, FL + 60], [THX + 40, FL + 70]], 0.5, 12), mix(C.curtain2, C.plumRobe, 0.3));
  f.x(c.ribbon([[THX + 60, FL + 18], [1720, FL + 14]], 3) + c.ribbon([[THX + 44, FL + 62], [1750, FL + 54]], 3), C.sun, 'opacity=".6"');
  floorL.add(f.out());
  const daisL = S.layer({ par: 0.48, sh: 4 });
  const d = sheet();
  d.p(c.cut([[THX - 170, FL + 20], [THX - 150, FL - DAIS], [THX + 150, FL - DAIS], [THX + 170, FL + 20]], 0.5, 8), mix(C.stone, C.cream, 0.2));
  d.p(c.cut([[THX - 150, FL - DAIS], [THX - 140, FL - DAIS * 2], [THX + 140, FL - DAIS * 2], [THX + 150, FL - DAIS]], 0.5, 8), C.stone);
  daisL.add(d.out());
  const throne = throneOn ? daisL.add(`<g transform="translate(${THX} ${FL - DAIS * 2})">${kingThrone(c)}</g>`) : null;
  const midOut = mid ? mid(S, c) : null;
  const act = S.layer({ par: 0.5, sh: 5 });
  const fx = S.layer({ par: 0.5, sh: 6 });
  return { c, farL, wallL, shadowL, floorL, daisL, throne, mid: midOut, act, fx, SEAT: FL - DAIS * 2 - 38, update() {} };
}
/** a row of little town houses (for the view through the windows); origin world */
function townRow(c, x0, x1, y) {
  let out = '';
  const cols = [C.plaster, mix(C.plaster, C.sand, 0.4), C.parchment, mix(C.plaster2, C.stone, 0.5)];
  for (let x = x0; x < x1; x += c.rr(50, 80)) out += house(c, x, y + c.rr(-8, 8), c.rr(36, 60), c.rr(28, 46), { wall: c.pick(cols), stairs: false });
  return out;
}

/** an unrolled parchment with words, on two rods (origin: top centre); ink may be terracotta for a protest */
export function decree(c, lines, { size = 22, w, ink = C.ink, col = C.parchment, strings = true } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.5 + size * 2;
  const hh = lines.length * size * 1.25 + size * 1.2;
  const s = sheet();
  s.p(c.cut([[-ww / 2, 8], [ww / 2, 8], [ww / 2 + 2, hh + 8], [-ww / 2 - 1, hh + 8]], 0.6, 8), col);
  s.p(c.cut(c.rect(-ww / 2 - 12, 0, ww + 24, 12), 0.3, 6) + c.cut(c.rect(-ww / 2 - 12, hh + 4, ww + 24, 12), 0.3, 6), C.wood2);
  s.p(c.cut(c.circ(-ww / 2 - 14, 6, 6, 10), 0.2, 3) + c.cut(c.circ(ww / 2 + 14, 6, 6, 10), 0.2, 3) + c.cut(c.circ(-ww / 2 - 14, hh + 10, 6, 10), 0.2, 3) + c.cut(c.circ(ww / 2 + 14, hh + 10, 6, 10), 0.2, 3), C.ochre);
  const y0 = 8 + size * 0.6 + size;
  const txt = lines.map((l, i) => `<text x="0" y="${(y0 + i * size * 1.25).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${l}</text>`).join('');
  const str = strings ? `<path d="M${-ww / 2 + 20} -2000V0M${ww / 2 - 20} -2000V0" stroke="${STRING}" stroke-width="1.3" fill="none"/>` : '';
  return str + s.out() + txt;
}

/** the king as a great dark shadow on the wall (a hard man, as the frightened servant sees him); origin: feet */
export function kingShadow(c, col = mix(C.storm2, C.plumRobe, 0.25), { armF = 40, armB = 20 } = {}) {
  const sil = { ...NOBLE, robe: col, mantle: shade(col, 0.05), skin: col, hair: col, veil: col, veil2: col, beardColor: col, belt: shade(col, 0.08), halo: false, holdF: '', holdB: '' };
  let m = bakeArms(addToHead(person(c, sil), crownSil(c, col)), armF, armB);
  return m.split(`fill="${C.blush}"`).join(`fill="${col}"`).split(`fill="${C.inkSoft}"`).join(`fill="${shade(col, -0.2)}"`);
}
function crownSil(c, col) {
  return sheet().p(c.cut([[-17, -12], [17, -12], [18, -22], [12, -30], [8, -21], [4, -34], [-1, -22], [-6, -33], [-10, -21], [-14, -30], [-19, -22]], 0.3, 3), col).out();
}
/** a round painted plate on two strings (origin: centre); inner is drawn clipped inside */
export function hungPlate(S, c, r, inner = '', { face = C.parchment, rim = C.haloRim } = {}) {
  const id = S.id('plate' + Math.round(r) + '-' + Math.floor(c.rr(0, 1e6)));
  const s = sheet().p(c.cut(c.circ(0, 0, r + 9, 44), 0.5, 6), rim).p(c.cut(c.circ(0, 0, r, 44), 0.5, 6), face);
  return `<path d="M${-r * 0.5} -2000V${-r * 0.86}M${r * 0.5} -2000V${-r * 0.86}" stroke="${STRING}" stroke-width="1.3" fill="none"/>${s.out()}<clipPath id="${id}"><circle r="${r - 1}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
}

/* ================================================================== the Mount of Olives */
export const OV = { GY: 700 };
/**
 * The Mount of Olives: sky (and an optional second sky that can fade in), sun and cloud on strings; far across the
 * Kidron valley Jerusalem on its hill (cityX, cityS; its glow can brighten), the valley, the olive-grown slope of the
 * mount (villages: [{x, y, n, name}] sit on it), the road (roadY, its points in `road`), act/fx layers and a front
 * layer with olive boughs. Returns { c, sk2, hangL, sunEl, glowEl, cityL, city, valley, slope, roadL, act, fx, front, update(T) }.
 */
export function olivetSet(S, { skyCols = OLIVET, sky2 = null, cityX = 1200, cityY = 470, cityS = 0.4, sunAt = [1250, 150], villages = [], seed = 'lk19-olivet', slopeY = 560, road = null, grove2 = true, noCity = false, atCity = null } = {}) {
  const c = makeCutter(seed);
  sky(S, skyCols);
  let sk2 = null;
  if (sky2) { sk2 = sky(S, sky2, { name: 'sky2', rise: 0 }).layer; sk2.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 38), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cl = hanging(hangL, cloud(c, 160), { x: 560, y: 130, len: 800 });
  S.layer({ par: 0.07, sh: 2 }).add(band(c, { y: cityY - 30, amps: [14, 6, 2], lens: [1100, 380, 120], color: mix(C.hillFar, C.lavender, 0.15), x0: -1400, x1: 3000 }).markup);
  const glowL = S.layer({ par: 0.1, sh: 0, flat: true });
  const glowEl = glowL.add(`<g><circle r="${420 * cityS + 120}" fill="url(#halo-glow)"/></g>`);
  const cityL = S.layer({ par: 0.1, sh: 3 });
  const city = noCity ? null : cityL.add(`<g transform="translate(${cityX} ${cityY})">${jerusalem(c, cityS)}</g>`);
  const extra = atCity ? atCity(S, c) : null;
  const valley = S.layer({ par: 0.16, sh: 3 });
  const vfn = c.wave(cityY + 40, [8, 4], [700, 200]);
  valley.add(sheet().p(c.ridge(vfn, -1400, 3000, 1800, 12, 1), mix(C.hillMid, C.dune, 0.2)).out() + grove(c, vfn, -600, 2200, 14, 0.4));
  const slope = S.layer({ par: 0.3, sh: 3 });
  const sfn = c.wave(slopeY, [12, 5, 2], [900, 300, 110]);
  let sm = sheet().p(c.ridge(sfn, -1400, 3000, 1800, 12, 1), mix(C.hillMid, C.sage2, 0.45)).out();
  villages.forEach((v) => { sm += `<g>${villageCluster(c, v.x, sfn(v.x) + 8, v.n || 6, v.sc || 0.6)}</g>`; });
  if (grove2) sm += grove(c, (x) => sfn(x) + 20, -800, 2400, 16, 0.6);
  slope.add(sm);
  const roadL = S.layer({ par: 0.45, sh: 3 });
  const gfn = c.wave(OV.GY - 40, [6, 3], [700, 200]);
  const g = sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), mix(C.sand, C.sage2, 0.35));
  const rpts = road || [[-1400, OV.GY + 10], [0, OV.GY + 8], [800, OV.GY + 4], [1600, OV.GY + 10], [3000, OV.GY + 6]];
  g.p(c.ribbon(rpts, 84), mix(C.sand2, C.stone, 0.35));
  let pebbles = '';
  for (let i = 0; i < 50; i++) { const x = c.rr(-800, 2400), y = OV.GY + c.rr(-30, 36); pebbles += c.cut(c.blob(x, y, c.rr(4, 9), c.rr(2, 4), 7, 0.2), 0.3, 3); }
  g.x(pebbles, shade(C.stone, -0.15), 'opacity=".5"');
  roadL.add(g.out() + grass(c, { x0: -1000, x1: 2600, y: OV.GY - 40, fn: gfn, n: 40, h: 12, color: C.olive }) + grass(c, { x0: -1000, x1: 2600, y: OV.GY + 80, n: 40, h: 16, color: C.moss }));
  const act = S.layer({ par: 0.5, sh: 5 });
  const fx = S.layer({ par: 0.5, sh: 6 });
  return {
    c, sk2, hangL, sunEl, glowEl, cityL, city, extra, valley, slope, sfn, roadL, act, fx,
    front() { const f = S.layer({ par: 0.9, sh: 6 }); f.add(olive(c, -120, 1010, 1.5) + olive(c, 1760, 1020, 1.4) + bush(c, 180, 990, 200, C.sage, C.moss)); return f; },
    update(T, { sunY = sunAt[1], glow = 0.5 } = {}) {
      swing(sunEl, sunAt[0], sunY, T, 1, 0.6);
      swing(cl, 560 + (T ? Math.sin(T * 0.1) * 20 : 0), 130, T, 1.2, 0.6, 1);
      pose(glowEl, { x: cityX, y: cityY - 60 * cityS * 2, s: 0.7 + glow * 0.5, o: glow });
    },
  };
}
/** a little village of flat-roofed houses on a slope (origin world) */
export function villageCluster(c, x, y, n = 6, sc = 0.6) {
  let out = '';
  const cols = [C.plaster, mix(C.plaster, C.sand, 0.4), C.parchment, mix(C.plaster2, C.stone, 0.5)];
  for (let i = 0; i < n; i++) { const w = c.rr(36, 60) * sc, h = c.rr(28, 44) * sc; out += house(c, x + (i - n / 2) * 44 * sc + c.rr(-8, 8), y - (i % 2) * 10 * sc, w, h, { wall: c.pick(cols), stairs: false }); }
  out += olive(c, x - n * 26 * sc, y + 6, 0.45) + palm(c, x + n * 24 * sc, y + 4, 90 * sc / 0.6);
  return out;
}
import { grove } from '../mark11/lib.js';
