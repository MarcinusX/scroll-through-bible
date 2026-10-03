// Luke 20 — the cast and cut-outs of this chapter. The whole chapter plays in the Temple court (Luke 2's court of the
// Gentiles: the sanctuary over its inner wall, the porticoes, the soreg): Jesus on a low step in the middle, Peter and
// John on the left, his questioners of the moment on the right — the chief priests with the scribes and the elders, the
// spies, the Sadducees — and the people all round (two sprites with an "amazed" twin each). The parable of the tenants
// plays in Mark 12's vineyard; the sayings hang over the court as painted panels (Luke 11's panel).
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt } from '../kit.js';
import { hillsWith, sun, cloud, cypress } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { es, ease, bump, seg, fade, attr } from '../../core/anim.js';
import { crowdMarkup as crowdMarkupM } from '../matthew12/lib.js';
import { sanctuary as sanct11, portico as portico11, priest as priest11, elder as elder11 } from '../mark11/lib.js';
import { scribeOpts as scribeOptsL, figure as figureL, panelSky as panelSkyL, panelGround as panelGroundL, label as labelL } from '../luke11/lib.js';
import { JOHN_B as JOHN_B1 } from '../mark1/lib.js';
import { sadducee as sadducee12, tenant as tenant12, LOOK as L12 } from '../mark12/lib.js';

export {
  panel, panelSky, panelGround, figure, label, say, speech, thought, heart, glow, qMark, tagText, pointHand, goldWord, hungWord,
  rayBurst, kf, moving, sparkle, hand, headAt, handAt, bubble, question, strip, stoneHeart, shadowPerson, silhouette, crossX, tick,
  glowDisc, radiance, fatherLight, lightBeam, beamGrad, hangAt, roundel, pose3, JOHN_B, crown, throne, purse, coin, scribeOpts, phOpts,
  manOf, womanOf, pop, bang, crowdMarkup, firstChairs, streetFlat, stall, plainTable, woeTag, dove,
} from '../luke11/lib.js';
export {
  vineyardSet, VY, VINE_DAY, VINE_DUSK, VINE_NIGHT, tenant, servant, newTenant, hoe, bigKey, basketCut, burst, headBandage, drapeCloth,
  moodPuppet, archStones, keystone, stoneBlock, denarius, taxChest, snare, sadducee, burningBush, flipPortrait, footstool, shard, harp,
  davidPuppet, littleHouse, longScroll, honourSeat, warnTag, robeTrain, ring, glowHeart, disc, gatePost, grapeBunch, towerParts, lightArc,
} from '../mark12/lib.js';
export { angel, glory, soulLight, bigQuestion } from '../mark8/lib.js';
import { angel as angel8 } from '../mark8/lib.js';
export { wisp } from '../mark3/lib.js';
export { scrollOpen, scrollRolled, candle, addToHead, addToBody } from '../mark2/lib.js';
export { curuleSeat, eagleStandard, hourglass, sealedScroll, pilate } from '../mark15/lib.js';
import { curuleSeat as curule15, eagleStandard as eagle15, pilate as pilate15 } from '../mark15/lib.js';
export { caesar, laurel, cameo } from '../luke2/lib.js';
export { tombIcon } from '../mark16/lib.js';
export { scalesParts, poseScales } from '../john8/lib.js';
export { stormCloud, lightning } from '../../assets/things.js';
export { es, ease, bump, seg, fade, attr, tr, makeCutter };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const COURT_DAY = ['#d0dfd8', '#f1e3c5', '#f6dfbd'];
export const COURT_AFTER = ['#d6d9cf', '#f2dcb8', '#f5d7b0'];
export const COURT_EVE = ['#9d8db0', '#e3ad90', '#f3cda4'];
export const GOLD = ['#efd29a', '#f7e1b3', '#fbeed2'];

/* ================================================================== the cast */
export const JESUS = CAST.jesus;
/** the chief priest, the scribe and the elder who come to question His authority (markup makers) */
export const LEADERS = [
  (c) => priest11(c, 1),
  (c) => person(c, scribeOptsL(1)),
  (c) => elder11(c, 0),
];
export const priest = priest11;
export const elder = elder11;
/** the spies, who pretend to be righteous: plain pious men with prayer shawls */
export const SPY = [
  { robe: C.linen2, mantle: mix(C.dustyBlue, C.linen, 0.35), hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: C.dustyBlue, beard: 'full', skin: C.skin3, belt: C.leather },
  { robe: mix(C.stone, C.wheatRobe, 0.4), mantle: mix(C.sageRobe, C.linen, 0.3), hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.rope },
  { robe: C.linen, mantle: mix(C.mauve, C.linen, 0.35), hair: C.hair2, hairStyle: 'wrap', veil: C.stone, veil2: C.mauve, beard: 'full', skin: C.skin4, belt: C.leather },
];
export const SADDUCEES = [0, 1, 2].map((i) => sadducee12(i));
/** the seven brothers and the woman they married one after another */
export const BROTHERS = [
  { robe: C.dustyBlue, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.leather },
  { robe: C.sageRobe, hair: C.hair, hairStyle: 'curly', beard: 'short', skin: C.skin2, belt: C.rope },
  { robe: C.ochreRobe, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.leather },
  { robe: C.tealRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, beard: 'short', skin: C.skin4, belt: C.rope },
  { robe: C.mauve, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather },
  { robe: C.wheatRobe, hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin, belt: C.rope },
  { robe: C.clayMantle, hair: C.hair3, hairStyle: 'short', beard: 'none', skin: C.skin3, belt: C.leather },
];
export const BRIDE = { robe: C.linen, mantle: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.1), hair: C.hair2, skin: C.skin2, beard: 'none', belt: C.sun };
export const WIDOW = L12.widow;
export const LOOK = L12;
export const TENANT = [0, 1, 2].map((i) => tenant12(i));

/* ================================================================== little helpers */
const DYP = { stand: 0, kneel: 46, sit: 62 };
/** pop a cut-out in with a little overshoot at (x, y), out again at t1 */
export function popAt(el, t, t0, t1, x, y, { d = 0.1, s = 1, r = 0 } = {}) {
  const k = es(t, t0, t0 + d, ease.back) * (t1 === undefined ? 1 : 1 - es(t, t1 - d * 0.6, t1));
  pose(el, { x, y, s: Math.max(0.001, k) * s, r, o: k > 0.01 ? 1 : 0 });
  return k;
}
/** a piece that drops in from the flies on its string and goes up again */
export function dropIn(el, t, t0, t1, x, y, { d = 0.3, T = 0, sw = 1.2, s = 1 } = {}) {
  const k = es(t, t0, t0 + d, ease.out) * (t1 === undefined ? 1 : 1 - es(t, t1 - d, t1, ease.in));
  pose(el, { x, y: lerp(-1500, y, k), s, r: T ? Math.sin(T * 0.9 + x) * sw * k : 0, o: k > 0.002 ? 1 : 0 });
  return k;
}

/* ================================================================== the Temple court */
/**
 * The court of the Gentiles in the bright forenoon: the sanctuary rising white and gold over its inner wall, the Mount
 * of Olives behind, the porticoes round the court and the low soreg in front of the inner courts. Jesus stands on a low
 * step at the centre; two disciples on the left; three questioners on the right (opp: markup makers (c, i)); the people
 * all round (sprites with an amazed twin). Free layers: holyL (a flat glow behind the sanctuary), flyL (panels hung over
 * the court), rayFx (flat, behind the crowd), backFx (flat, behind the actors), act, W (words over the people).
 */
export const CQ = { JX: 800, FEET: 704, DX: [560, 640], PX: [990, 1070, 1150], IW: 580, PY: 660 };
/** phone (portrait): the questioners stand closer in, clear of the frame and the progress thread */
const PX_PORTRAIT = [930, 995, 1060];
let pxNow = CQ.PX;
export function courtSet(S, { skyCols = COURT_DAY, sky2 = null, dis = ['peter', 'john'], opp = LEADERS, crowd = true, crowdSeeds = ['lk20-cL', 'lk20-cR'], crowdN = 9, rise = 1 } = {}) {
  const c = S.c;
  pxNow = S.portrait ? PX_PORTRAIT : CQ.PX;
  const q = makeCutter('lk20-court');
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }) : null;
  if (sk2) sk2.layer.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5, rise });
  const sunEl = hanging(hangL, sun(q, 44), { x: 1230, y: 160, len: 700 });
  const cl1 = hanging(hangL, cloud(q, 180), { x: 470, y: 150, len: 700 });
  S.layer({ par: 0.08, sh: 2, rise }).add(hillsWith(q, { y: 420, amps: [20, 8, 3], lens: [1200, 400, 140], color: mix(C.hillMid, C.hillFar, 0.5), trees: 34, treeColor: mix(C.olive, C.hillMid, 0.3), treeH: 16, x0: -1400, x1: 3000 }).markup);
  const holyL = S.layer({ par: 0.16, sh: 1, flat: true, rise });
  const sanctL = S.layer({ par: 0.16, sh: 4, rise });
  const IW = CQ.IW, sx = 800;
  const inner = sheet();
  inner.p(q.cut([[sx - 520, IW + 80], [sx - 500, IW], [sx + 500, IW], [sx + 520, IW + 80]], 0.6, 12), mix(C.cream, C.stone, 0.3));
  let iw = '';
  for (let x = sx - 480; x < sx + 480; x += 30) iw += q.cut(q.rect(x, IW + 6, 10, 40), 0.2, 5);
  inner.x(iw, shade(C.stone, -0.08), 'opacity=".7"');
  inner.p(q.cut(q.rect(sx - 520, IW - 10, 1040, 12), 0.3, 12), C.sun);
  sanctL.add(`<g transform="translate(${sx} ${IW})">${sanct11(q, 1.3)}</g>`);
  sanctL.add(inner.out() + cypress(q, 250, IW + 40, 150) + cypress(q, 1350, IW + 40, 170));
  const back = S.layer({ par: 0.3, sh: 4, rise });
  const PY = CQ.PY;
  back.add(portico11(q, -1300, sx - 330, PY, 240) + portico11(q, sx + 330, 2900, PY, 240));
  const floorL = S.layer({ par: 0.4, sh: 3, rise });
  const f = sheet();
  f.p(q.cut([[-1800, PY - 6], [3400, PY - 6], [3400, 1800], [-1800, 1800]], 0.8, 30), mix(C.stone, C.sand, 0.35));
  let tiles = '';
  for (let i = 0; i < 9; i++) { const y = PY + 8 + i * i * 7 + i * 10; tiles += q.ribbon([[-1800, y], [3400, y + q.rr(-2, 2)]], 1.3); }
  for (let x = -1800; x < 3400; x += 90) tiles += q.ribbon([[x, PY], [800 + (x - 800) * 2.2, 1800]], 1.2);
  f.x(tiles, shade(C.stone, -0.16), 'opacity=".45"');
  floorL.add(f.out());
  const sor = sheet();
  sor.p(q.cut(q.rect(-1800, PY - 30, 5200, 8), 0.4, 20), mix(C.cream, C.stone, 0.2));
  let posts = '';
  for (let x = -1800; x < 3400; x += 22) posts += q.poly(q.rect(x, PY - 24, 5, 24));
  sor.p(posts, mix(C.cream, C.stone, 0.35));
  floorL.add(sor.out());
  const flyL = S.layer({ par: 0.42, sh: 6, rise: 0 });
  const rayFx = S.layer({ par: 0.44, sh: 0, flat: true });
  const crowdL = crowd ? S.layer({ par: 0.45, sh: 4, rise }) : null;
  const CROWD = crowd ? [
    { seed: crowdSeeds[0], x: 440, y: 664, flip: false },
    { seed: crowdSeeds[1], x: 1160, y: 664, flip: true },
  ].map((g) => ({
    ...g,
    calm: crowdL.sprite(crowdMarkupM(g.seed, crowdN, { s: 0.62, spread: 46, rows: 2, flip: g.flip }), g.x, g.y),
    wow: crowdL.sprite(crowdMarkupM(g.seed, crowdN, { s: 0.62, spread: 46, rows: 2, flip: g.flip, armF: [60, 110], armB: [100, 160], head: [-10, -2] }), g.x, g.y),
  })) : [];
  CROWD.forEach((g) => g.wow.set({ o: 0 }));
  const backFx = S.layer({ par: 0.5, sh: 0, flat: true });
  const act = S.layer({ par: 0.5, sh: 5, rise });
  act.add(sheet().p(q.cut([[CQ.JX - 110, CQ.FEET + 2], [CQ.JX - 96, CQ.FEET - 14], [CQ.JX + 96, CQ.FEET - 14], [CQ.JX + 110, CQ.FEET + 2]], 0.5, 8), C.stone2).p(q.cut([[CQ.JX - 116, CQ.FEET], [CQ.JX + 116, CQ.FEET], [CQ.JX + 116, CQ.FEET + 16], [CQ.JX - 116, CQ.FEET + 16]], 0.4, 8), shade(C.stone2, -0.08)).out());
  const disc = dis.map((k, i) => ({ k, i, x: CQ.DX[i], seed: q.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[k] }))) }));
  const phs = opp.map((mk, i) => ({ i, x: pxNow[i], seed: q.rr(0, 9), p: S.puppet(act.add(typeof mk === 'function' ? mk(c, i) : person(c, mk))) }));
  const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
  const W = S.layer({ par: 0.52, sh: 3 });
  return {
    c, q, sk, sk2, hangL, sunEl, cl1, holyL, sanctL, back, floorL, flyL, rayFx, crowdL, CROWD, backFx, act, disc, phs, jesus, W,
    amaze(k, k2 = k) { CROWD.forEach((g, i) => { const a = i ? k2 : k; g.calm.set({ o: 1 - a }); g.wow.set({ o: a }); }); },
    update(time) {
      swing(sunEl, 1230, 160, time, 1, 0.6);
      swing(cl1, 470 + Math.sin(time * 0.1) * 20, 150, time, 1.1, 0.6, 1);
    },
    pose(t, time, J = {}, D = () => ({}), P = () => ({})) {
      this.update(time);
      jesus.set({ x: CQ.JX, y: CQ.FEET - 14, s: 1.04, flip: false, armF: 16, armB: 8, head: 0, blink: blinkAt(time), ...J });
      disc.forEach((d) => d.p.set({ x: d.x, y: CQ.FEET + (d.i % 2 ? 6 : 0), s: 0.96, flip: false, armF: 10, armB: 6, head: -2, blink: blinkAt(time, d.seed), ...D(d) }));
      phs.forEach((m) => m.p.set({ x: m.x, y: CQ.FEET + (m.i % 2 ? -4 : 4), s: 0.96, flip: true, armF: 8, armB: 4, head: 0, blink: blinkAt(time, m.seed), ...P(m) }));
    },
  };
}
/** the head of an opponent standing at slot i (for words and thoughts) */
export const oppHead = (i, dx = 0) => [pxNow[i] - 2 * 0.96 + dx, CQ.FEET + (i % 2 ? -4 : 4) - 167 * 0.96];
/** Jesus' head on His step */
export const jHead = () => [CQ.JX + 2, CQ.FEET - 14 - 167 * 1.04];

/* ================================================================== props: authority */
/** a great wax seal on two ribbons (the stamp of authority); blank: an empty dotted ring with a "?" in it. origin centre */
export function waxSeal(c, r = 46, { blank = false } = {}) {
  const s = sheet();
  const wax = blank ? mix(C.cream, C.parchment, 0.4) : C.terracotta;
  s.p(c.ribbon([[-r * 0.3, r * 0.6], [-r * 0.55, r * 1.7]], r * 0.28) + c.ribbon([[r * 0.3, r * 0.6], [r * 0.5, r * 1.75]], r * 0.28), blank ? C.stone2 : mix(C.terracotta, C.plumRobe, 0.3));
  s.p(c.cut(c.blob(0, 0, r, r * 0.96, 16, 0.08), 0.8, 5), wax);
  if (blank) {
    let dots = '';
    for (let i = 0; i < 22; i++) { const a = (i / 22) * PI * 2; dots += c.poly(c.circ(Math.cos(a) * r * 0.74, Math.sin(a) * r * 0.74, r * 0.045, 6)); }
    s.x(dots, C.rock3);
    const hook = c.arc(0, -r * 0.2, r * 0.26, r * 0.26, PI * 1.02, PI * 2.5, 14);
    hook.push([0, r * 0.2]);
    s.x(c.ribbon(hook, r * 0.1), C.terracotta).x(c.cut(c.circ(0, r * 0.42, r * 0.08, 8), 0.2, 2), C.terracotta);
  } else {
    s.p(c.cut(c.circ(0, 0, r * 0.72, 24), 0.4, 4), shade(wax, -0.1));
    // a seven-branched lampstand pressed into the wax
    let m = c.ribbon([[0, r * 0.45], [0, -r * 0.4]], r * 0.07) + c.ribbon([[-r * 0.28, r * 0.5], [r * 0.28, r * 0.5]], r * 0.07);
    [0.14, 0.27, 0.4].forEach((w) => { m += c.ribbon(c.arc(0, -r * 0.4, w * r, w * r * 1.3, 0, PI, 8), r * 0.06); });
    s.x(m, shade(wax, 0.28));
  }
  return s.out();
}

/* ================================================================== John's baptism: from heaven, or from men? */
/** John baptizing in the Jordan, in panel coords (face w × h, centre 0,0) */
export function jordanInner(S, c, w = 300, h = 190) {
  let m = panelSkyL(S, w, h, ['#cfe2dc', '#f3e6c8']);
  m += sheet().p(c.cut([[-w / 2 - 10, 0], [-w * 0.2, -22], [w * 0.15, -10], [w / 2 + 10, -26], [w / 2 + 10, 40], [-w / 2 - 10, 40]], 0.8, 10), mix(C.hillMid, C.sand, 0.25)).out();
  m += sheet().p(c.cut([[-w / 2 - 10, 20], [w / 2 + 10, 14], [w / 2 + 10, h], [-w / 2 - 10, h]], 0.6, 10), mix(C.lake, C.skyBlue2, 0.3)).x(c.ribbon([[-w / 2, 34], [-40, 32]], 2) + c.ribbon([[20, 44], [w / 2, 42]], 2) + c.ribbon([[-90, 62], [60, 60]], 2), C.foam, 'opacity=".7"').out();
  m += reedsLite(c, -w / 2 + 24, 22) + reedsLite(c, w / 2 - 30, 18);
  // the penitent kneeling in the river, John over him with the shell of water
  m += figureL(c, { robe: C.wheatRobe, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope, pose: 'kneel' }, { x: 26, y: 70, s: 0.5, flip: true, head: 16, armF: 60, armB: 40, lean: 6 });
  m += figureL(c, JOHN_B1, { x: -30, y: 76, s: 0.56, armF: 108, armB: 20, head: 8 });
  m += sheet().p(c.cut(c.ell(0, -36, 7, 4, 10), 0.2, 3), C.cream).out();
  let drops = '';
  for (let i = 0; i < 5; i++) drops += c.poly(c.ell(4 + i * 3, -26 + i * 6, 1.6, 2.6, 6));
  m += `<path d="${drops}" fill="${C.lake3}"/>`;
  // the river in front of their legs
  m += sheet().p(c.cut([[-w / 2 - 10, 58], [w / 2 + 10, 54], [w / 2 + 10, h], [-w / 2 - 10, h]], 0.6, 10), mix(C.lake, C.lake2, 0.4)).out();
  return m;
}
function reedsLite(c, x, y) {
  let d = '';
  for (let i = 0; i < 6; i++) d += c.ribbon(c.qbez([x + i * 5, y], [x + i * 5 + 4, y - 30], [x + i * 6 - 6 + c.rr(-3, 3), y - 50 - c.rr(0, 16)], 6), 2);
  return `<path d="${d}" fill="${C.olive}"/>`;
}
/** a round plate on its string with an icon and a word under it: 'heaven' (a cloud and light) or 'men' (three people) */
export function choicePlate(c, kind, word, r = 52) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 6, 36), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, r, 34), 0.5, 5), kind === 'heaven' ? mix(C.halo, C.cream, 0.5) : C.parchment);
  let icon = '';
  if (kind === 'heaven') {
    let rays = '';
    for (let i = 0; i < 7; i++) { const a = PI * (0.62 + i * 0.13); rays += c.poly([[Math.cos(a - 0.03) * 8, 12 + Math.sin(a - 0.03) * 8], [Math.cos(a - 0.06) * 40, 12 + Math.sin(a - 0.06) * 40], [Math.cos(a + 0.06) * 40, 12 + Math.sin(a + 0.06) * 40], [Math.cos(a + 0.03) * 8, 12 + Math.sin(a + 0.03) * 8]]); }
    icon = `<path d="${rays}" fill="${C.sun}" opacity=".75"/>${cloudLite(c, 0, 8, 34)}`;
  } else {
    icon = figureL(c, crowdPerson(makeCutter('lk20-m1')), { x: -22, y: 36, s: 0.34 }) + figureL(c, { ...crowdPerson(makeCutter('lk20-m3')), hairStyle: 'veil', beard: 'none' }, { x: 22, y: 36, s: 0.33, flip: true }) + figureL(c, crowdPerson(makeCutter('lk20-m2')), { x: 0, y: 40, s: 0.37 });
  }
  const id = 'cp' + Math.round(c.rr(0, 1e6));
  return `<path d="M0 -1600V${-r - 6}" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}<clipPath id="${id}"><circle r="${r - 1}"/></clipPath><g clip-path="url(#${id})">${icon}</g><g transform="translate(0 ${r + 20})">${labelL(c, word, { size: 17 })}</g>`;
}
function cloudLite(c, x, y, w) {
  return sheet().p(c.cut(c.blob(x - w * 0.3, y, w * 0.4, w * 0.26, 10, 0.1), 0.4, 4) + c.cut(c.blob(x + w * 0.25, y + 2, w * 0.45, w * 0.28, 10, 0.1), 0.4, 4) + c.cut(c.blob(x, y - w * 0.16, w * 0.38, w * 0.3, 10, 0.1), 0.4, 4), C.cream).out();
}
/** a big thought cloud (origin: its tail, just above the thinker's head; the cloud floats up to (dx, -h/2 - 30)) */
export function bigThought(c, inner, { w = 220, h = 120, dx = 0, fill = C.cream } = {}) {
  const s = sheet();
  const cx = dx, cy = -h / 2 - 34;
  const pts = [], n = 11;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2, a2 = ((i + 1) / n) * PI * 2;
    const x1 = cx + Math.cos(a) * w / 2, y1 = cy + Math.sin(a) * h / 2, x2 = cx + Math.cos(a2) * w / 2, y2 = cy + Math.sin(a2) * h / 2;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, ang = Math.atan2(my - cy, mx - cx);
    pts.push(...c.qbez([x1, y1], [mx + Math.cos(ang) * 14, my + Math.sin(ang) * 14], [x2, y2], 5).slice(0, -1));
  }
  s.p(c.cut(pts, 0.4, 5), fill);
  s.p(c.cut(c.circ(dx * 0.3, -22, 7, 10), 0.2, 3) + c.cut(c.circ(0, -8, 4.4, 8), 0.2, 2), fill);
  return `${s.out()}<g transform="translate(${cx} ${cy})">${inner}</g>`;
}
/** a little man with a stone raised in his back hand (for the leaders' fear), markup at (x, y) scale s */
export function stoner(c, seed, { x = 0, y = 0, s = 0.4, flip = false } = {}) {
  const k = makeCutter(seed);
  const o = crowdPerson(k);
  if (o.hairStyle === 'veil') { o.hairStyle = 'short'; o.beard = 'full'; }
  const stone = sheet().p(c.cut(c.blob(0, 8, 20, 16, 8, 0.2), 0.8, 3), shade(C.rock3, -0.1)).x(c.cut(c.blob(-5, 3, 8, 5, 6, 0.2), 0.3, 2), shade(C.rock3, 0.3)).out();
  return figureL(c, { ...o, holdB: stone }, { x, y, s, flip, armB: 132, armF: 24, head: -8, lean: -8 });
}
/** John the Baptist in a round medallion (origin centre) */
export function johnMedal(c, id, r = 50) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 6, 36), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, r, 34), 0.5, 5), mix(C.sand, C.cream, 0.5));
  return `${s.out()}<defs><clipPath id="${id}"><circle r="${r - 1}"/></clipPath></defs><g clip-path="url(#${id})">${figureL(c, JOHN_B1, { x: -4, y: r * 2.55, s: r / 50 * 0.95 })}</g>`;
}

/* ================================================================== the vineyard, all grown */
import { VY as VY12 } from '../mark12/lib.js';
/** pose the back of Mark 12's vineyard set as planted and ripe (no tower in Luke's telling) */
export function vineBack(set, { grapes = true } = {}) {
  set.wallB.forEach((w) => pose(w.el, { x: w.x, y: w.y }));
  set.tower.forEach((el) => pose(el, { o: 0 }));
  pose(set.gateBack, { x: VY12.GATE0, y: VY12.WALL_F - 4 });
  set.backRow.forEach((v) => pose(v.el, { x: v.x, y: v.y }));
  set.grapesB.forEach((g) => pose(g.el, { x: g.x, y: g.y, o: grapes ? 1 : 0 }));
}
/** and its front (call with what set.front() returned) */
export function vineFront(fr, { grapes = true } = {}) {
  fr.frontRow.forEach((v) => pose(v.el, { x: v.x, y: v.y }));
  fr.grapesF.forEach((g) => pose(g.el, { x: g.x, y: g.y, o: grapes ? 1 : 0 }));
  fr.wallF.forEach((w) => pose(w.el, { x: w.x, y: w.y }));
  pose(fr.gateFront, { x: VY12.GATE1, y: VY12.WALL_F });
  pose(fr.lintel, { x: VY12.GATE0 - 12, y: VY12.WALL_F - 170 });
  pose(fr.press, { o: 0 });
}
/** a head-cloth knocked off (origin centre) */
export function headCloth(c, col = C.linen2) {
  return sheet().p(c.cut([[-20, -6], [-6, -12], [12, -12], [22, -4], [18, 8], [2, 12], [-16, 8]], 0.6, 4), col).x(c.ribbon([[-14, 0], [14, -2]], 1.4), shade(col, -0.15)).out();
}

/* ================================================================== pottery, the mirror */
/** a clay jar (origin: its base centre); kind 1 is a jug with a handle */
export function clayJar(c, h = 60, kind = 0, col = C.pot) {
  const s = sheet();
  const w = h * 0.36;
  if (kind === 0) s.p(c.cut([[-w * 0.5, 0], [-w, -h * 0.35], [-w * 0.9, -h * 0.7], [-w * 0.4, -h * 0.86], [-w * 0.45, -h], [w * 0.45, -h], [w * 0.4, -h * 0.86], [w * 0.9, -h * 0.7], [w, -h * 0.35], [w * 0.5, 0]], 0.5, 5), col);
  else {
    s.p(c.ribbon(c.arc(w * 0.9, -h * 0.66, w * 0.4, h * 0.2, -PI / 2, PI / 2, 8), 4), shade(col, -0.1));
    s.p(c.cut([[-w * 0.6, 0], [-w * 0.95, -h * 0.4], [-w * 0.7, -h * 0.75], [-w * 0.5, -h], [w * 0.5, -h], [w * 0.7, -h * 0.75], [w * 0.95, -h * 0.4], [w * 0.6, 0]], 0.5, 5), col);
  }
  s.x(c.ribbon([[-w * 0.8, -h * 0.45], [w * 0.8, -h * 0.45]], 2) + c.ribbon([[-w * 0.85, -h * 0.55], [w * 0.85, -h * 0.55]], 1.4), shade(col, -0.2), 'opacity=".7"');
  return s.out();
}
/** a potsherd (origin centre) */
export function sherd(c, r = 10, col = C.pot) { return sheet().p(c.cut(c.blob(0, 0, r, r * 0.7, 6, 0.45), 1, 3), col).out(); }
/** a puff of dust (origin centre) */
export function dustPuff(c, r = 18, col = mix(C.sand2, C.stone2, 0.5)) { return `<path d="${c.cut(c.blob(0, 0, r, r * 0.7, 10, 0.25), 0.8, 4)}" fill="${col}" opacity=".85"/>`; }
/** an oval hand-mirror on a string that shows `inner` (origin: the glass centre) */
export function mirror(c, id, inner, { rx = 90, ry = 66 } = {}) {
  const s = sheet().p(c.cut(c.ell(0, 0, rx + 9, ry + 9, 40), 0.5, 5), mix(C.sun, C.ochre, 0.3)).p(c.cut(c.ell(0, 0, rx, ry, 40), 0.4, 5), mix(C.skyVeil, C.cream, 0.4));
  const hl = c.ribbon(c.arc(0, 0, rx * 0.8, ry * 0.8, PI * 1.1, PI * 1.35, 6), 4);
  return `<path d="M0 -1600V${-ry - 9}" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}<defs><clipPath id="${id}"><ellipse rx="${rx - 1}" ry="${ry - 1}"/></clipPath></defs><g clip-path="url(#${id})">${inner}</g><path d="${hl}" fill="#fffaf0" opacity=".6"/>`;
}

/** the governor on his judgement seat, in panel coords (face w × h) */
export function governorInner(S, c, w = 260, h = 170) {
  let m = panelSkyL(S, w, h, ['#e6dccb', '#f2e6d0']);
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 4, -h / 2 - 4, w + 8, h * 0.62), 0.4, 8), mix(C.plaster2, C.stone, 0.4));
  [-90, -30, 30, 90].forEach((x) => s.p(c.cut(c.rect(x - 9, -h / 2, 18, h * 0.6), 0.3, 6), mix(C.cream, C.stone, 0.3)));
  s.p(c.cut([[-w / 2 - 4, 22], [w / 2 + 4, 22], [w / 2 + 4, h], [-w / 2 - 4, h]], 0.4, 8), mix(C.stone, C.sand, 0.4));
  s.p(c.cut(c.rect(-70, 30, 140, 18), 0.3, 6) + c.cut(c.rect(-50, 14, 100, 18), 0.3, 6), mix(C.stone, C.plaster2, 0.2));
  m += s.out();
  m += `<g transform="translate(-92 64) scale(.42)">${eagle15(c, 300)}</g><g transform="translate(92 64) scale(.42)">${eagle15(c, 300)}</g>`;
  m += `<g transform="translate(0 16) scale(.8)">${curule15(c)}</g>`;
  m += `<g transform="translate(0 26) scale(.5)">${pilate15(c, { pose: 'sit' })}</g>`;
  return m;
}
/** a golden path (the way of God) running back from (0,0) to (dx, -h), widening towards the viewer */
export function goldPath(c, dx = 0, h = 120, w0 = 120, w1 = 26) {
  const s = sheet();
  s.p(c.cut([[-w0 / 2, 0], [w0 / 2, 0], [dx + w1 / 2, -h], [dx - w1 / 2, -h]], 0.5, 8), mix(C.sun, C.halo, 0.4));
  let d = '';
  for (let i = 1; i < 6; i++) { const k = i / 6, y = -h * (1 - Math.pow(1 - k, 1.6)), ww = lerp(w0, w1, 1 - Math.pow(1 - k, 1.6)); d += c.ribbon([[dx * (1 - Math.pow(1 - k, 1.6)) - ww / 2 + 4, y], [dx * (1 - Math.pow(1 - k, 1.6)) + ww / 2 - 4, y]], 1.4); }
  s.x(d, C.haloRim, 'opacity=".8"');
  return s.out();
}
/** a small silver coin (origin centre) */
export function silverCoin(c, r = 8) {
  const ag = mix(C.stone, C.cream, 0.2);
  return sheet().p(c.cut(c.circ(0, 0, r, 14), 0.2, 3), shade(ag, -0.08)).x(c.poly(c.ell(r * 0.1, 0, r * 0.4, r * 0.55, 10)), shade(ag, -0.3), 'opacity=".6"').x(c.ribbon(c.arc(0, 0, r * 0.78, r * 0.78, 0, PI * 2, 14), 1), shade(ag, -0.3), 'opacity=".5"').out();
}
/** three ink dots — lost for words (origin centre) */
export function dots(c, col = C.ink) {
  return sheet().p(c.cut(c.circ(-14, 0, 3.4, 8), 0.2, 2) + c.cut(c.circ(0, 0, 3.4, 8), 0.2, 2) + c.cut(c.circ(14, 0, 3.4, 8), 0.2, 2), col).out();
}

/* ================================================================== the seven brothers */
export const ROW = { W: 660, H: 210, X: 800, Y: 290, FEET: 84, DX: 90, S: 0.5 };
/** the flat the seven brothers stand on: a village street at evening-gold (panel coords) */
export function rowInner(S, c) {
  const w = ROW.W, h = ROW.H;
  let m = panelSkyL(S, w, h, ['#e3d6c4', '#f4e4c6']);
  const s = sheet();
  let hs = '';
  for (let x = -w / 2 - 10; x < w / 2; x += 84) { const hh = 70 + ((x * 7) % 40 + 40) % 40; hs += c.cut(c.rect(x, 40 - hh, 78, hh + 30), 0.4, 6); }
  s.p(hs, mix(C.plaster2, C.sand, 0.3));
  let wins = '';
  for (let x = -w / 2 + 20; x < w / 2; x += 84) wins += c.cut(c.rect(x, -4, 12, 16), 0.2, 3);
  s.x(wins, mix(C.soilDark, C.plaster2, 0.5));
  m += s.out();
  m += panelGroundL(c, w, ROW.FEET - 8, mix(C.sand, C.stone, 0.4), 2);
  return m;
}
/** a rounded grave-stone with a snuffed candle before it (origin: its foot) */
export function stele(c, h = 70, col = mix(C.stone2, C.rock2, 0.5)) {
  const s = sheet();
  s.p(c.cut([[-h * 0.26, 0], [-h * 0.26, -h * 0.7], ...c.arc(0, -h * 0.7, h * 0.26, h * 0.3, PI, 2 * PI, 10), [h * 0.26, -h * 0.7], [h * 0.26, 0]], 0.5, 5), col);
  s.x(c.ribbon([[-h * 0.12, -h * 0.62], [h * 0.12, -h * 0.62]], 2) + c.ribbon([[-h * 0.12, -h * 0.5], [h * 0.1, -h * 0.5]], 2), shade(col, -0.2), 'opacity=".7"');
  s.p(c.cut(c.rect(h * 0.3, -14, 6, 14), 0.2, 3), C.cream);
  s.x(c.ribbon(c.cbez([h * 0.3 + 3, -15], [h * 0.3 + 7, -22], [h * 0.3, -26], [h * 0.3 + 4, -34], 8), 1.6), '#cfc8bd', 'opacity=".9"');
  return s.out();
}
/** a red thread 100 long along +x (origin at its start); pose it with r and sx = length / 100 */
export function thread(c, col = C.terracotta) { return `<path d="${c.ribbon([[0, 0], [30, -3], [70, -2], [100, 0]], 2.2)}" fill="${col}"/>`; }

/** bake a person's markup with arms / head set and place it (like figure(), for any person-shaped markup) */
export function bake(m, { x = 0, y = 0, s = 1, flip = false, armF = 0, armB = 0, head = 0, lean = 0 } = {}) {
  if (armF) m = m.replace('<g class="armFr">', `<g class="armFr" transform="rotate(${-armF})">`);
  if (armB) m = m.replace('<g class="armBr">', `<g class="armBr" transform="rotate(${-armB})">`);
  if (head) m = m.replace('<g class="headr">', `<g class="headr" transform="rotate(${head})">`);
  if (lean) m = m.replace('<g class="body">', `<g class="body" transform="rotate(${lean})">`);
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${flip ? -s : s} ${s})">${m}</g>`;
}
/** an angel baked in a pose (Mark 8's angel) */
export const angelFig = (c, o = {}, extra = {}) => bake(angel8(c, extra), o);
/** the risen: a figure in white (look turned to white linen) */
export const risen = (o) => ({ ...o, robe: C.linen, mantle: o.mantle ? mix(C.halo, C.linen, 0.5) : null, belt: C.sun });
/** a tiny lamp flame (origin: its foot) */
export function tinyFlame(c, h = 16) {
  return `<circle cy="${-h * 0.4}" r="${h * 1.3}" fill="url(#warm-glow)" opacity=".8"/>${sheet().p(c.cut([[-h * 0.28, 0], [-h * 0.3, -h * 0.4], [0, -h], [h * 0.3, -h * 0.4], [h * 0.28, 0]], 0.2, 3), C.lampFlame).p(c.cut([[-h * 0.12, 0], [-h * 0.12, -h * 0.3], [0, -h * 0.6], [h * 0.12, -h * 0.3], [h * 0.12, 0]], 0.1, 2), '#fff4d2').out()}`;
}
