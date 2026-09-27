// John 8 — the cast and cut-outs of the chapter: the woman brought before Jesus and her accusers with their
// stones, the writing in the dust, the Temple court at morning (the John 2 cut) and the Court of the Women at
// night with the four great golden lampstands of the Feast of Tabernacles and the trumpet-chests of the treasury.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging, swing, lerp } from '../kit.js';
import { band, moon, stars, cypress, cloud } from '../../assets/nature.js';
import { fade, attr } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';

export { kf, moving, hand, headAt, addToHead, speech, thought, GLYPH, spark, heart, dust, scrollOpen, wordSlip } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, strip, question, shadowPerson, silhouette, sparkle, stoneHeart, along } from '../mark3/lib.js';
export { voiceRings, hang2, flame, tagOnString } from '../mark1/lib.js';
export { glory, soulLight, lightCrown, globe } from '../mark8/lib.js';
export { storyFrame, SEPIA, tick, crossX } from '../mark6/lib.js';
export { vis } from '../mark14/lib.js';
export { templeCourt, courtFront, elder, priest, sanctuary, portico } from '../mark11/lib.js';
export { trumpetChest, lepton, coin as coin12, snare } from '../mark12/lib.js';
export { olivesSet, SKIES as OLIVE_SKIES, tint, hourglass, mask, handLamp } from '../mark13/lib.js';
export { crossSil, skullHill, farCity, guard } from '../mark15/lib.js';
export { chain, fetter, link } from '../mark5/lib.js';
export { roundel as plateR, panel, sepia, hourglassJ } from '../john4/lib.js';
export { lawTablets } from '../mark10/lib.js';
export { rayBurst, radiance, eternityRing, drawRing, darkSheet, glowDisc } from '../john1/lib.js';
export { beamGrad, lightBeam, darkPool, word } from '../john3/lib.js';
export { tr, sky, hanging, swing, pose, sheet, shade, mix, C, CAST, person, crowdPerson };

import { addToHead, headAt as headAt2, hand as hand2 } from '../mark2/lib.js';
import { pharisee as ph3, scribe as sc3, withFace as withFace3, faceBits as faceBits3 } from '../mark3/lib.js';
import { elder as elder11, sanctuary as sanct11, portico as portico11, templeCourt as court11, courtFront as front11 } from '../mark11/lib.js';
import { trumpetChest as chest12 } from '../mark12/lib.js';
import { tint as tint13 } from '../mark13/lib.js';
import { vis as vis14 } from '../mark14/lib.js';
import { blinkAt } from '../../assets/people.js';

export const PI = Math.PI;
const LK = makeCutter('j8-looks');
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
export const INK = '#3b2a22';

/* ====================================================================== the cast */
/** the woman brought before Him: a long dusk-violet veil drawn close, plain robe — dignity, not display */
export const WOMAN = {
  robe: mix(C.stone2, C.lavender, 0.45), mantle: mix(C.plumRobe, C.storm, 0.35), hairStyle: 'veil', veil: mix(C.plumRobe, C.storm, 0.35),
  veil2: shade(mix(C.plumRobe, C.storm, 0.35), 0.16), hair: C.hair3, skin: C.skin2, belt: null,
};
/** the same woman sent away in peace: the veil turned to morning colours */
export const WOMAN_FREE = { ...WOMAN, robe: mix(C.linen, C.lavender, 0.3), mantle: C.skyVeil, veil: C.skyVeil, veil2: shade(C.skyVeil, 0.3), belt: C.sun };
/** her accusers, eldest first: two elders, a Pharisee, a scribe, a Pharisee, a young scribe */
export function accuser(i) {
  const L = [
    () => elder11Opts(0, { hair: '#ece6da', beardColor: '#ece6da' }),
    () => elder11Opts(1),
    () => ph3(LK, 0),
    () => sc3(LK, 1),
    () => ph3(LK, 2),
    () => ({ ...sc3(LK, 2), beard: 'short', beardColor: C.hair3, hair: C.hair3, holdF: '' }),
  ];
  const o = L[i % L.length]();
  return { ...o, holdF: '' };
}
function elder11Opts(i, extra = {}) {
  return {
    robe: [C.stone2, C.wheatRobe, C.linen2][i % 3], mantle: [C.wood3, C.sageRobe, C.clayMantle][i % 3], hair: C.greyHair, hairStyle: 'wrap',
    veil: [C.linen2, C.stone, C.parchment][i % 3], veil2: [C.wood3, C.moss, C.clay][i % 3], beard: i % 2 ? 'wild' : 'full', beardColor: C.greyHair, skin: [C.skin3, C.skin2, C.skin4][i % 3], belt: C.leather, ...extra,
  };
}
/** one of "some of the leaders" in the discourse (never a whole people): Pharisee / scribe / elder looks */
export function leader(i) {
  const L = [() => ph3(LK, 1), () => elder11Opts(2), () => sc3(LK, 0), () => ph3(LK, 3), () => elder11Opts(0), () => sc3(LK, 2), () => ph3(LK, 4)];
  return { ...L[i % L.length](), holdF: '' };
}
/** a listener from the crowd; i fixes man / woman */
export function listener(c, i, extra = {}) {
  const o = crowdPerson(c);
  if (i % 3 === 1) { o.hairStyle = 'veil'; o.beard = 'none'; } else if (o.hairStyle === 'veil') { o.hairStyle = ['short', 'wrap', 'curly'][i % 3]; o.beard = ['full', 'short', 'none'][i % 3]; }
  return { ...o, ...extra };
}
export const JESUS = CAST.jesus;

/* ====================================================================== props */
/** a stone (origin: its centre); r ≈ size */
export function stone(c, r = 11, col = mix(C.rock, C.rock2, 0.5)) {
  return sheet().p(c.cut(c.blob(0, 0, r, r * 0.8, 9, 0.2), 0.6, 4), col).x(c.cut([[-r * 0.4, -r * 0.35], [r * 0.1, -r * 0.6], [r * 0.3, -r * 0.2], [-r * 0.1, -r * 0.1]], 0.3, 3), shade(col, 0.3), 'opacity=".7"').out();
}
/** marks in the dust: n unreadable little scratches written with a finger, each a <g data-i>; origin: left end */
export function dustMarks(c, n = 9, w = 120) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = (i / n) * w + c.rr(-3, 3), y = (i % 3) * 7 + c.rr(-2, 2);
    const pts = [];
    const kind = i % 4;
    if (kind === 0) pts.push(...c.arc(x + 4, y, 5, 4, PI * 0.9, PI * 2.6, 8));
    else if (kind === 1) pts.push([x, y + 3], [x + 3, y - 4], [x + 6, y + 3], [x + 9, y - 3]);
    else if (kind === 2) pts.push([x, y - 4], [x + 1, y + 4], [x + 8, y + 2]);
    else pts.push(...c.qbez([x, y + 2], [x + 5, y - 7], [x + 10, y + 2], 6));
    out += `<g data-i="${i}" opacity="0"><path d="${c.ribbon(pts, 2)}" fill="${mix(C.soil, C.sand2, 0.35)}"/><path d="${c.ribbon(pts, 0.9)}" fill="${C.halo}" opacity=".85"/></g>`;
  }
  return `<circle class="glow" cx="${w / 2}" cy="6" r="${w * 0.7}" fill="url(#halo-glow)" opacity="0"/>${out}`;
}
/** reveal dust marks by k (0..1) and the faint glow under them */
export function writeMarks(el, k, glow = 1) {
  const ms = el.__ms || (el.__ms = Array.from(el.querySelectorAll('[data-i]')));
  const g = el.__g || (el.__g = el.querySelector('.glow'));
  const n = ms.length;
  ms.forEach((m, i) => attr(m, 'opacity', Math.max(0, Math.min(1, k * n - i))));
  attr(g, 'opacity', Math.min(1, k * 3) * 0.55 * glow);
}
/** a sad, down-turned mouth (a face bit for withFace), hidden: data-part="down" */
export function mouthDown(c, skin = C.skin) {
  return `<g data-part="down" opacity="0"><path d="${c.ribbon(c.arc(10, 11.5, 3.2, 2, PI + 0.35, 2 * PI - 0.35, 5), 1.1)}" fill="${shade(skin, -0.45)}"/></g>`;
}
/** a small dust puff (origin: ground centre) */
export function puff(c, r = 16, col = mix(C.sand, C.stone, 0.4)) {
  let d = '';
  for (let i = 0; i < 4; i++) d += c.cut(c.blob((i - 1.5) * r * 0.6, -r * 0.4 - (i % 2) * r * 0.3, r * 0.5, r * 0.36, 8, 0.25), 0.4, 3);
  return `<path d="${d}" fill="${col}" opacity=".8"/>`;
}

/* ====================================================================== the morning court (Jn 8,2–11) */
export const MORNING = ['#d6e5de', '#f3e8cc', '#f9ecd2'];
export const DAWN = ['#c9b6c4', '#f0cfb2', '#f8e2c4'];
/** where everyone stands in the morning court */
export const CT = { FLOOR: 700, JX: 760, WX: 905, ACC: [[995, 704], [1058, 706], [1122, 704], [1186, 706], [1026, 668], [1152, 668]] };

/**
 * The trial in the morning court: Jesus (seated / stooping to write / standing), the woman, six accusers with
 * stones, the seated listeners. Puppets and props go in layers the caller passes: { back, mid, act, front }.
 * Returns handles; set* helpers keep the choreography the same across the three scenes.
 */
export function trialCast(S, { back, mid, act }) {
  const c = S.c;
  const cc = makeCutter('j8-trial-cast');
  // the seated listeners: a back row standing (left), two rows sitting on the pavement
  const rows = [
    { y: 664, s: 0.84, pose: 'stand', xs: [430, 486, 548, 606] },
    { y: 690, s: 0.9, pose: 'sit', xs: [418, 488, 556, 620] },
  ];
  const crowd = [];
  rows.forEach((r, ri) => r.xs.forEach((x, i) => {
    const k = ri * 5 + i;
    const L = ri === 0 ? back : mid;
    crowd.push({ x, y: r.y, s: r.s, ri, i: k, seed: cc.rr(0, 9), p: S.puppet(L.add(person(cc, { ...listener(cc, k), pose: r.pose }))) });
  }));
  // Peter and John among the listeners, nearest to Him
  crowd.push({ x: 652, y: 724, s: 0.98, ri: 2, i: 20, seed: 3, p: S.puppet(mid.add(person(cc, { ...CAST.john, pose: 'sit' }))) });
  // the accusers (back pair first so the front row overlaps them)
  const acc = [4, 5, 0, 1, 2, 3].map((i) => {
    const [x, y] = CT.ACC[i];
    const L = i >= 4 ? back : act;
    return { i, x, y, s: i >= 4 ? 0.9 : 1, seed: cc.rr(0, 9), p: S.puppet(L.add(withFace3(person(cc, accuser(i)), faceBits3(cc)))), L };
  }).sort((a, b) => a.i - b.i);
  acc.forEach((a) => {
    a.el = a.p.el;
    a.angry = a.el.querySelector('[data-part="angry"]');
    a.stone = a.L.add(`<g>${stone(cc, 15, mix(C.rock2, C.rock3, 0.35))}</g>`);
  });
  const puffs = acc.map((a) => a.L.add(`<g>${puff(cc, 14)}</g>`));
  // the woman (bowed, veiled) and her freed self
  const woman = S.puppet(act.add(withFace3(person(cc, WOMAN), faceBits3(cc) + mouthDown(cc, WOMAN.skin)).replace('class="mouth"', 'class="mouth" data-part="smile"')));
  const womanFree = S.puppet(act.add(person(cc, WOMAN_FREE)));
  const wTear = woman.el.querySelector('[data-part="tear"]'), wSad = woman.el.querySelector('[data-part="sad"]'), wSmile = woman.el.querySelector('[data-part="smile"]'), wDown = woman.el.querySelector('[data-part="down"]');
  // Jesus: seated teaching, stooping to write, standing
  const jSit = S.puppet(act.add(person(cc, { ...CAST.jesus, pose: 'sit' })));
  const jBend = S.puppet(act.add(person(cc, { ...CAST.jesus, pose: 'kneel' })));
  const jStand = S.puppet(act.add(person(cc, CAST.jesus)));
  // the teaching seat: a low stone step
  const seat = mid.add(sheet().p(cc.cut(cc.rect(CT.JX - 56, CT.FLOOR - 38, 112, 40), 0.6, 8), mix(C.stone, C.cream, 0.3)).x(cc.ribbon([[CT.JX - 54, CT.FLOOR - 36], [CT.JX + 54, CT.FLOOR - 36]], 2), C.cream, 'opacity=".8"').out());
  // the writing in the dust
  const marks = act.add(`<g>${dustMarks(cc, 11, 110)}</g>`);
  const marks2 = act.add(`<g>${dustMarks(cc, 8, 80)}</g>`);
  return {
    crowd, acc, puffs, woman, womanFree, wTear, wSad, wSmile, wDown, jSit, jBend, jStand, seat, marks, marks2,
    /** Jesus: which = 'sit' | 'bend' | 'stand' blend by weights; common pose p */
    jesus(T, { sit = 0, bend = 0, stand = 0, x = CT.JX, armF = 20, armB = 10, head = 0, lean = 0, flip = false, walk } = {}) {
      jSit.set({ x, y: CT.FLOOR - 26, s: 1.04, o: sit, flip, armF, armB, head, lean, blink: blinkAt(T, 1) });
      jBend.set({ x: x + 6, y: CT.FLOOR + 6, s: 1.04, o: bend, flip, armF, armB, head, lean, blink: blinkAt(T, 1) });
      jStand.set({ x, y: CT.FLOOR + 8, s: 1.04, o: stand, flip, armF, armB, head, lean, walk, blink: blinkAt(T, 1) });
    },
    /** the finger of the stooping Jesus (for marks) */
    finger(armF, lean) { return hand2(CT.JX + 6, CT.FLOOR + 6, 1.04, false, armF, lean, DY.kneel); },
    /** an accuser with his stone: hold (the stone in the hand) or dropped at (gx) on the floor */
    accuser(a, T, { x = a.x, y = a.y, o = 1, flip = true, armF = 30, armB = 10, head = 0, lean = 0, walk, angry = 0, drop = 0, grip = 1 } = {}) {
      a.p.set({ x, y, s: a.s, o, flip, armF, armB, head, lean, walk, blink: blinkAt(T, a.seed) });
      fade(a.angry, angry);
      const [hx, hy] = hand2(x, y, a.s, flip, armF, lean);
      if (a.gx === undefined) { a.gx = a.x - 22 - (a.i % 2) * 10; a.gy = a.y + 2; }
      // falls from the hand to the floor, one small bounce
      const f = Math.min(1, drop * 1.25), b = drop > 0.8 ? Math.sin(((drop - 0.8) / 0.2) * PI) * 6 : 0;
      const sx = lerp(hx, a.gx, f), sy = lerp(hy + 4, a.gy - 6, f * f) - b;
      pose(a.stone, { x: sx, y: sy, r: f * 140, s: a.s, o: drop > 0 ? 1 : o * grip });
    },
  };
}


/** the morning court of the trial: the John 2 Temple court, the people's layers, the cast, the front columns */
export function trialSet(S, { skyCols = MORNING, sunAt = [1230, 150] } = {}) {
  const court = court11(S, { skyCols, floorY: CT.FLOOR + 40, sanctX: 800, sunAt });
  const glowL = S.layer({ par: 0.44, sh: 0, flat: true });
  const back = S.layer({ par: 0.46, sh: 4 });
  const mid = S.layer({ par: 0.5, sh: 5 });
  const act = S.layer({ par: 0.54, sh: 6 });
  const cast = trialCast(S, { back, mid, act });
  const fx = S.layer({ par: 0.58, sh: 5 });
  const front = front11(S);
  return {
    court, glowL, back, mid, act, fx, front, cast,
    update(t, time) {
      swing(court.sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      swing(court.cl1, 470 + Math.sin(time * 0.1) * 26, 140, time, 1.3, 0.6, 1);
    },
  };
}

/* ====================================================================== the court of the women at night (Jn 8,12–59) */
export const NIGHT = ['#1c2148', '#2e3566', '#56547f'];
export const EVE = ['#3a3e70', '#7d6886', '#c79a8f'];
export const LC = { FLOOR: 700, LAMPS: [300, 545, 1055, 1300], GATE: 800, STEP0: 612, STEP1: 470 };

/** one of the four great golden lampstands of the feast: origin base centre, ~h tall. Flames are a separate piece. */
export function greatLamp(c, h = 440) {
  const s = sheet();
  const gold = mix(C.sun, C.ochre, 0.3), gold2 = shade(gold, -0.22), gold3 = shade(gold, 0.25);
  // three-footed base
  s.p(c.cut([[-58, 0], [-40, -16], [-14, -30], [-12, -46], [12, -46], [14, -30], [40, -16], [58, 0], [44, 2], [0, -18], [-44, 2]], 0.5, 6), gold2);
  // the shaft with knops
  s.p(c.cut([[-8, -44], [-6, -h + 60], [6, -h + 60], [8, -44]], 0.3, 10), gold);
  let knops = '';
  for (let i = 1; i <= 4; i++) { const y = -44 - (h - 104) * (i / 5); knops += c.cut(c.ell(0, y, 13, 6, 12), 0.2, 3); }
  s.p(knops, gold2);
  s.x(c.ribbon([[-3, -60], [-3, -h + 70]], 2), gold3, 'opacity=".8"');
  // the four arms and bowls on top
  const top = -h + 60;
  let arms = '';
  [-1, 1].forEach((d) => {
    arms += c.ribbon(c.qbez([0, top], [d * 30, top + 10], [d * 44, top - 34], 8), 6);
    arms += c.ribbon(c.qbez([0, top + 6], [d * 14, top + 4], [d * 16, top - 30], 6), 5);
  });
  s.p(arms, gold);
  s.p(c.cut(c.rect(-8, top - 30, 16, 32), 0.2, 5), gold);
  let bowls = '';
  [-44, -16, 16, 44].forEach((x) => { bowls += c.cut([[x - 14, top - 40], [x + 14, top - 40], [x + 9, top - 30], [x - 9, top - 30]], 0.2, 4); });
  bowls += c.cut([[-12, top - 40], [12, top - 40], [8, top - 32], [-8, top - 32]], 0.2, 4);
  s.p(bowls, gold2);
  // a ladder leaning on it (the young priests climbed up with jars of oil)
  const lad = sheet();
  const L0 = [70, 0], L1 = [18, top + 20];
  lad.p(c.ribbon([L0, L1], 5) + c.ribbon([[L0[0] + 22, 0], [L1[0] + 20, L1[1]]], 5), C.wood2);
  let rungs = '';
  for (let i = 1; i < 12; i++) { const u = i / 12; rungs += c.ribbon([[lerp(L0[0], L1[0], u), lerp(0, L1[1], u)], [lerp(L0[0] + 22, L1[0] + 20, u), lerp(0, L1[1], u)]], 3); }
  lad.p(rungs, C.wood);
  return lad.out() + s.out();
}
/** the flames of a great lampstand (origin: the lamp's base, like greatLamp); .fl pieces flicker */
export function greatFlames(c, h = 440) {
  const top = -h + 60 - 40;
  let out = '';
  [-44, -16, 16, 44].forEach((x, i) => {
    out += `<g class="fl" data-i="${i}" transform="translate(${x} ${top})"><path d="M0 0C-12 -8 -10 -26 0 -46C10 -26 12 -8 0 0Z" fill="${C.lampFlame}"/><path d="M0 -3C-5 -9 -5 -17 0 -27C5 -17 5 -9 0 -3Z" fill="#fff4d2"/></g>`;
  });
  return out;
}
/** the glow of a great lampstand (flat; origin like greatLamp) */
export function greatGlow(h = 440) {
  const top = -h + 60 - 40;
  return `<circle cx="0" cy="${top}" r="330" fill="url(#warm-glow)"/><circle cx="0" cy="${top - 6}" r="120" fill="url(#halo-glow)"/>`;
}
/** flicker flames of a greatFlames element */
export function flickerLamp(el, time, on, seed = 0) {
  const fl = el.__fl || (el.__fl = Array.from(el.querySelectorAll('.fl')));
  const x0 = el.__x0 || (el.__x0 = fl.map((f) => { const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(f.getAttribute('transform')); return [+m[1], +m[2]]; }));
  fl.forEach((f, i) => {
    const w = time ? Math.sin(time * 7.3 + i * 1.9 + seed) * 0.08 + Math.sin(time * 11.1 + i + seed) * 0.05 : 0;
    pose(f, { x: x0[i][0], y: x0[i][1], sx: on * (1 + w * 0.6), sy: on * (1 + w), r: w * 20 });
  });
}

/**
 * lampCourt(S, o) — the Court of the Women at night: sky and stars, a hanging moon, the sanctuary above the wall,
 * the fifteen steps up to the Nicanor gate, colonnades, the four great lampstands, the trumpet-chests of the
 * treasury along the wall, the paving. Returns layers and update(t, T, { lit, moonY }).
 * o: skyCols, chests (bool), lamps (bool), gate (bool)
 */
export function lampCourt(S, { skyCols = NIGHT, chests = true, lamps = true, starsN = 80, moonAt = [1180, 150], tintK = 0.42 } = {}) {
  const c = makeCutter('j8-lamp-court');
  const T = (m, k = tintK) => tint13(m, C.night, k);
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(stars(c, { x0: -700, x1: 2300, y0: -600, y1: 330, n: starsN }));
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const moonEl = hanging(hangL, moon(c, 32), { x: moonAt[0], y: moonAt[1], len: 700 });
  const cl = hanging(hangL, T(cloud(c, 170), 0.55), { x: 420, y: 170, len: 700 });

  // the sanctuary rising behind the inner wall
  const sanL = S.layer({ par: 0.1, sh: 3 });
  const holyGlow = sanL.add(`<g><circle r="260" fill="url(#halo-glow)" opacity=".55"/></g>`);
  sanL.add(T(`<g transform="translate(800 ${LC.STEP1 - 20})">${sanct11(c, 1.12, { glow: false })}</g>`, 0.3));
  // the wall of the inner court with the Nicanor gate at the top of the steps
  const wall = sheet();
  const wc = mix(C.stone, C.cream, 0.3);
  wall.p(c.cut([[-900, LC.STEP1 + 4], [-900, LC.STEP1 - 90], [2500, LC.STEP1 - 90], [2500, LC.STEP1 + 4]], 0.6, 16), wc);
  let crenel = '';
  for (let x = -900; x < 2500; x += 34) crenel += c.poly(c.rect(x, LC.STEP1 - 102, 18, 14));
  wall.p(crenel, wc);
  wall.p(c.cut([[704, LC.STEP1 + 4], [704, LC.STEP1 - 150], [896, LC.STEP1 - 150], [896, LC.STEP1 + 4]], 0.5, 8), mix(C.stone, C.cream, 0.5));
  wall.p(c.cut([[736, LC.STEP1 + 4], [736, LC.STEP1 - 84], ...c.arc(800, LC.STEP1 - 84, 64, 50, PI, 2 * PI, 12), [864, LC.STEP1 + 4]], 0.4, 6), mix(C.sun, C.clay, 0.25));
  wall.x(c.ribbon([[800, LC.STEP1 + 2], [800, LC.STEP1 - 128]], 2.4), shade(C.sun, -0.3), 'opacity=".6"');
  wall.p(c.cut(c.rect(698, LC.STEP1 - 158, 204, 10), 0.3, 6), C.sun);
  sanL.add(T(wall.out(), 0.36));
  const gateGlow = sanL.add(`<g><circle r="140" fill="url(#warm-glow)"/></g>`);

  // the fifteen curved steps
  const stepL = S.layer({ par: 0.2, sh: 2 });
  const st = sheet();
  st.p(c.cut([[-1800, LC.STEP1 - 2], [3400, LC.STEP1 - 2], [3400, LC.STEP0 + 12], [-1800, LC.STEP0 + 12]], 0.6, 20), mix(C.stone2, C.plaster2, 0.5));
  let courses = '';
  for (let y = LC.STEP1 + 18; y < LC.STEP0; y += 22) courses += c.ribbon([[-1800, y], [3400, y + c.rr(-1, 1)]], 1.2);
  st.x(courses, shade(C.stone2, -0.15), 'opacity=".5"');
  let edges = '';
  for (let i = 0; i < 15; i++) {
    const y = lerp(LC.STEP1, LC.STEP0, i / 15), yb = lerp(LC.STEP1, LC.STEP0, (i + 1) / 15), w = lerp(96, 250, i / 14);
    st.p(c.cut([[800 - w, y], [800 + w, y], [800 + w + 6, yb + 1], [800 - w - 6, yb + 1]], 0.3, 10), mix(C.stone, C.cream, 0.35 + (i % 2) * 0.1));
    edges += c.ribbon([[800 - w, y + 1], [800 + w, y + 1]], 1.4);
  }
  st.x(edges, C.cream, 'opacity=".7"');
  stepL.add(T(st.out(), 0.32));

  // colonnades around the court (with the treasury chambers)
  const colL = S.layer({ par: 0.28, sh: 4 });
  colL.add(T(portico11(c, -1300, 520, LC.STEP0 - 4, 250) + portico11(c, 1080, 2900, LC.STEP0 - 4, 250), 0.4));
  // the trumpet chests of the treasury along the colonnade
  const chestL = S.layer({ par: 0.34, sh: 4 });
  const CH = [];
  if (chests) [150, 250, 350, 450, 1150, 1250, 1350, 1450].forEach((x, i) => {
    CH.push({ x, y: LC.STEP0 + 30, el: chestL.add(`<g transform="translate(${x} ${LC.STEP0 + 30}) scale(.72)">${T(chest12(c, { h: 118, w: 64 }), 0.22)}</g>`) });
  });
  // the paving
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const f = sheet();
  const fc = mix(C.stone, C.sand, 0.35);
  f.p(c.cut([[-1800, LC.STEP0 + 6], [3400, LC.STEP0 + 6], [3400, 1800], [-1800, 1800]], 0.8, 30), fc);
  let tiles = '';
  for (let i = 0; i < 9; i++) { const y = LC.STEP0 + 18 + i * i * 7 + i * 10; tiles += c.ribbon([[-1800, y], [3400, y + c.rr(-2, 2)]], 1.3); }
  for (let x = -1800; x < 3400; x += 90) tiles += c.ribbon([[x, LC.STEP0 + 8], [800 + (x - 800) * 2.2, 1800]], 1.2);
  f.x(tiles, shade(fc, -0.16), 'opacity=".45"');
  floorL.add(T(f.out(), 0.38));
  // pools of lamplight on the paving (faded in with the lamps)
  const poolL = S.layer({ par: 0.41, sh: 0, flat: true });
  const pools = poolL.add(`<g>${LC.LAMPS.map((x) => `<ellipse cx="${x}" cy="${LC.FLOOR - 40}" rx="300" ry="70" fill="url(#warm-glow)" opacity=".55"/>`).join('')}<ellipse cx="800" cy="${LC.FLOOR}" rx="420" ry="90" fill="url(#warm-glow)" opacity=".35"/></g>`);

  // the four great lampstands (their glows on a flat sheet behind them)
  const lampGL = S.layer({ par: 0.36, sh: 0, flat: true });
  const lampL = S.layer({ par: 0.36, sh: 5 });
  const LS = [];
  if (lamps) LC.LAMPS.forEach((x, i) => {
    const glow = lampGL.add(`<g transform="translate(${x} ${LC.FLOOR - 50})">${greatGlow(440)}</g>`);
    lampL.add(`<g transform="translate(${x} ${LC.FLOOR - 50})">${T(greatLamp(c, 440), 0.12)}</g>`);
    LS.push({ x, glow, fl: lampL.add(`<g transform="translate(${x} ${LC.FLOOR - 50})">${greatFlames(c, 440)}</g>`), i });
  });

  return {
    c, sk, starL, hangL, moonEl, sanL, stepL, colL, chestL, floorL, poolL, lampL, lampGL, LS, CH, T, holyGlow, gateGlow,
    /** lit: 0..1 lamps burning; i-th lamp can lag (stagger); moonY: moon height */
    update(t, time, { lit = 1, stagger = 0, moonY = moonAt[1], glowO = 0.7, gate = 0.5, starsO = 1 } = {}) {
      swing(moonEl, moonAt[0], moonY, time, 1, 0.6);
      swing(cl, 420 + Math.sin(time * 0.08) * 24, 170, time, 1.2, 0.5, 1);
      pose(holyGlow, { x: 800, y: LC.STEP1 - 200, s: 1 + Math.sin(time * 1.1) * 0.03, o: glowO });
      pose(gateGlow, { x: 800, y: LC.STEP1 - 50, o: gate });
      starL.fade(starsO);
      LS.forEach((L) => {
        const k = Math.max(0, Math.min(1, (lit - L.i * stagger) / Math.max(0.001, 1 - 3 * stagger)));
        flickerLamp(L.fl, k > 0.01 ? time : 0, k, L.i * 2);
        attr(L.glow, 'opacity', Math.round(k * 50) / 50);
      });
      poolL.fade(Math.min(1, lit));
    },
  };
}

/** a lamp-lit leader / listener row helper: puppets on a layer at given spots; returns array of {p, x, y, s, seed} */
export function people(S, L, list) {
  const c = makeCutter('j8-people-' + L.el.childElementCount);
  return list.map((o, i) => ({ ...o, i, seed: c.rr(0, 9), p: S.puppet(L.add(o.face ? withFace3(person(c, o.look), faceBits3(c)) : person(c, o.look))) }))
    .map((m) => { m.angry = m.p.el.querySelector('[data-part="angry"]'); m.sad = m.p.el.querySelector('[data-part="sad"]'); return m; });
}
/** set a puppet from a people() entry with overrides */
export function place(m, T, o = {}) {
  m.p.set({ x: m.x, y: m.y, s: m.s ?? 1, flip: m.flip, blink: blinkAt(T, m.seed), ...o });
}

/* ====================================================================== plates & devices */
/** a hanging framed picture (origin top centre, two strings); inner drawn in its own coords (0,0 = top-left) */
export function framed(S, inner, { w = 300, h = 200, rim = C.wood3, bg = C.parchment, k, sepiaK = 0 } = {}) {
  const c = S.c;
  const id = S.id('fr' + (k || Math.round(c.rr(0, 1e6))));
  S.defs(`<clipPath id="${id}"><rect x="${-w / 2}" y="0" width="${w}" height="${h}"/></clipPath>`);
  const fr = sheet().p(c.cut(c.rect(-w / 2 - 12, -12, w + 24, h + 24), 0.6, 8), rim).p(c.cut(c.rect(-w / 2 - 5, -5, w + 10, h + 10), 0.4, 8), shade(rim, 0.2)).out();
  const inn = sepiaK ? tint13(inner, mix(C.parchment, C.dune, 0.5), sepiaK) : inner;
  return `<path d="M${-w * 0.3} -1600V-12M${w * 0.3} -1600V-12" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${fr}<g clip-path="url(#${id})"><rect x="${-w / 2}" y="0" width="${w}" height="${h}" fill="${bg}"/><g transform="translate(${-w / 2} 0)">${inn}</g></g>`;
}
/** a big paper word glowing gold on dark paper (the I AM) — origin centre */
export function iAm(c, text, { size = 44, w } = {}) {
  const ww = w || text.length * size * 0.62 + size * 1.6;
  const hh = size * 1.7;
  const s = sheet();
  s.p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 3], [ww / 2 + 3, hh / 2], [-ww / 2 - 2, hh / 2 + 2]], 0.6, 8), '#2a2e5a');
  s.x(c.ribbon([[-ww / 2 + 10, -hh / 2 + 8], [ww / 2 - 10, -hh / 2 + 6]], 1.6) + c.ribbon([[-ww / 2 + 10, hh / 2 - 8], [ww / 2 - 10, hh / 2 - 7]], 1.6), C.haloRim, 'opacity=".8"');
  return `<circle r="${ww * 0.75}" fill="url(#halo-glow)"/>${s.out()}<text x="0" y="${(size * 0.35).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" letter-spacing="2" fill="${C.halo}">${text}</text>`;
}
/** a dark cord binding a figure: loops around at y offsets; origin at the figure's feet, figure ~210 tall */
export function bonds(c, col = '#2c2436', { w = 40 } = {}) {
  let d = '';
  [-40, -70, -100, -128].forEach((y, i) => { d += c.ribbon(c.arc(0, y, w - i * 2, 9, 0.1, PI * 2.1, 16), 3.2); });
  d += c.ribbon(c.cbez([w - 4, -40], [w + 30, -20], [w + 50, 10], [w + 90, 4], 12), 3);
  return `<path d="${d}" fill="${col}"/>`;
}
/** a small fixed-point number plate (origin centre) */
export function numberCard(c, text, { size = 40, fill = C.cream, ink = C.terracotta } = {}) {
  const w = size * (0.62 * String(text).length + 1.1), h = size * 1.35;
  return sheet().p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.5, 6), fill).out() + `<text x="0" y="${(size * 0.35).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a crooked forked tongue — the lie (origin at its root, pointing +x) */
export function forkTongue(c, len = 70, col = '#b8404f') {
  const pts = c.qbez([0, 0], [len * 0.5, -8], [len * 0.8, 0], 8);
  return `<path d="${c.ribbon(pts, (u) => 7 - u * 3) + c.ribbon([[len * 0.78, 0], [len, -10]], 3) + c.ribbon([[len * 0.78, 0], [len, 9]], 3)}" fill="${col}"/>`;
}
/** a serpent shadow — a coiling dark ribbon with a head; origin at its tail; rises to the right */
export function shadowSerpent(c, col = '#241d33', len = 300) {
  const pts = c.cbez([0, 0], [len * 0.3, -70], [len * 0.5, 60], [len * 0.8, -40], 30);
  const body = c.ribbon(pts, (u) => 4 + Math.sin(u * PI) * 14);
  const [hx, hy] = pts[pts.length - 1];
  const head = c.cut(c.ell(hx + 14, hy - 4, 20, 11, 14, -0.3), 0.4, 4);
  const eye = c.poly(c.circ(hx + 22, hy - 9, 2.6, 8));
  return `<g class="body"><path d="${body}" fill="${col}"/><path d="${head}" fill="${col}"/><path d="${eye}" fill="#e7b25e"/></g><g class="tongue" transform="translate(${(hx + 32).toFixed(1)} ${(hy - 2).toFixed(1)}) rotate(-15) scale(.5)">${forkTongue(c, 60, '#9e3446')}</g>`;
}
/** a heavy door-house for "the slave does not stay in the house for ever" — { wall, leaf } markup */
export function houseFront(c, { w = 230, h = 170, wall = C.plaster, roof = C.roof, dw = 58, dh = 100 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h, w, h + 2), 0.5, 8), wall);
  s.p(c.cut([[-w / 2 - 14, -h], [0, -h - 60], [w / 2 + 14, -h], [w / 2 + 14, -h + 10], [-w / 2 - 14, -h + 10]], 0.5, 8), roof);
  s.p(c.cut(c.rect(-dw / 2 - 6, -dh - 6, dw + 12, dh + 8), 0.4, 6), shade(wall, -0.12));
  s.x(c.poly(c.rect(-dw / 2, -dh, dw, dh)), '#5a4436');
  s.x(c.poly(c.rect(w * 0.22, -h * 0.72, 30, 26)), '#f3d38e');
  const leaf = sheet().p(c.cut(c.rect(0, -dh, dw, dh), 0.3, 6), C.wood).x(c.ribbon([[dw * 0.33, -dh + 4], [dw * 0.33, -4]], 1.4) + c.ribbon([[dw * 0.66, -dh + 4], [dw * 0.66, -4]], 1.4), shade(C.wood, -0.25), 'opacity=".7"').x(c.poly(c.circ(dw - 9, -dh / 2, 3, 8)), C.sun).out();
  return { wall: s.out(), leaf, dw, dh };
}
/** Abraham (sepia-able): the patriarch of chapter 12's portraits */
export const ABRAHAM = { robe: C.wheatRobe, mantle: C.clayMantle, hair: '#e9e2d6', hairStyle: 'wrap', veil: C.linen2, beard: 'wild', beardColor: '#eee7da', skin: C.skin3, belt: C.leather };
/** an open tent (Mamre): origin base centre */
export function tentMamre(c, w = 220, h = 150, col = mix(C.wheatRobe, C.dune, 0.4)) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w * 0.3, -h], [w * 0.3, -h * 0.92], [w / 2, 0]], 0.6, 8), col);
  s.x(c.poly([[-w * 0.12, 0], [-w * 0.02, -h * 0.72], [w * 0.14, 0]]), mix(C.soilDark, C.wood2, 0.4));
  let st = '';
  for (let i = 0; i < 5; i++) st += c.ribbon([[-w * 0.4 + i * w * 0.2, 0], [-w * 0.26 + i * w * 0.13, -h * 0.96]], 3);
  s.x(st, shade(col, -0.15), 'opacity=".6"');
  s.p(c.ribbon([[-w * 0.3, -h], [-w * 0.3, 8]], 5) + c.ribbon([[w * 0.3, -h * 0.92], [w * 0.3, 8]], 5), C.wood2);
  return s.out();
}
export { vis14 as visible, blinkAt };

/* ====================================================================== the discourse cast (Jn 8,12–59) */
export const DC = {
  JX: 800, FLOOR: 700,
  LIS: [[452, 686, 0.9], [512, 696, 0.94], [574, 704, 0.98], [636, 712, 1.0], [486, 664, 0.84], [556, 668, 0.86]],
  LEAD: [[966, 712, 1.0], [1030, 704, 0.98], [1094, 696, 0.95], [1156, 688, 0.92], [1002, 668, 0.86], [1126, 664, 0.84]],
};
/**
 * The people of the night court: listeners and believers on the left (Peter and John among them), some of the
 * leaders on the right, Jesus in the middle. Layers: { back, act }. Each member has .angry/.sad face bits.
 * set(T, { j: {...}, lis(i) → {...}, lead(i) → {...} }) poses everyone with sensible defaults.
 */
export function courtCast(S, { back, act }, { nLis = 6, nLead = 6, jesusOn = act } = {}) {
  const cc = makeCutter('j8-court-cast');
  const lisLooks = [CAST.peter, listener(cc, 1), CAST.john, listener(cc, 4), listener(cc, 7), listener(cc, 3)];
  const mk = (L, look) => { const el = L.add(withFace3(person(cc, look), faceBits3(cc))); return { p: S.puppet(el), angry: el.querySelector('[data-part="angry"]'), sad: el.querySelector('[data-part="sad"]') }; };
  const lis = DC.LIS.slice(0, nLis).map(([x, y, s], i) => ({ i, x, y, s, seed: cc.rr(0, 9), ...mk(i >= 4 ? back : act, lisLooks[i]) }));
  const lead = DC.LEAD.slice(0, nLead).map(([x, y, s], i) => ({ i, x, y, s, seed: cc.rr(0, 9), ...mk(i >= 4 ? back : act, leader(i)) }));
  const jesus = S.puppet(jesusOn.add(person(cc, CAST.jesus)));
  return {
    lis, lead, jesus,
    set(T, { j = {}, lisF = () => ({}), leadF = () => ({}) } = {}) {
      jesus.set({ x: DC.JX, y: DC.FLOOR + 8, s: 1.06, armF: 16, armB: 10, blink: blinkAt(T, 1), ...j });
      lis.forEach((m) => { const o = lisF(m) || {}; m.p.set({ x: m.x, y: m.y, s: m.s, armF: 14, armB: 8, blink: blinkAt(T, m.seed), ...o }); fade(m.angry, 0); fade(m.sad, o.sad || 0); });
      lead.forEach((m) => { const o = leadF(m) || {}; m.p.set({ x: m.x, y: m.y, s: m.s, flip: true, armF: 20, armB: 10, blink: blinkAt(T, m.seed), ...o }); fade(m.angry, o.angry ?? 0.3); fade(m.sad, o.sad || 0); });
    },
  };
}
/** the standard night-court scene: set + people layers + fx layers. Returns { set, back, act, fx, cast } */
export function nightStage(S, o = {}) {
  const set = lampCourt(S, o);
  const glowL = S.layer({ par: 0.42, sh: 0, flat: true });
  const back = S.layer({ par: 0.48, sh: 4 });
  const act = S.layer({ par: 0.54, sh: 6 });
  const cast = courtCast(S, { back, act }, o);
  const fx = S.layer({ par: 0.58, sh: 5 });
  return { set, glowL, back, act, fx, cast };
}

/* ====================================================================== more devices */
/** a hanging pair of scales: { frame, beam, pan } markups. frame origin = pivot (post hangs from the flies);
 *  beam rotates about the pivot (arms ±arm); each pan hangs from its hook (origin at the hook). */
export function scalesParts(c, { arm = 110, drop = 70, col = mix(C.ochre, C.clay, 0.25) } = {}) {
  const frame = `<path d="M0 -1600V-8" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${sheet().p(c.cut(c.circ(0, 0, 9, 12), 0.2, 3), shade(col, -0.2)).out()}`;
  const beam = sheet().p(c.cut([[-arm - 4, -4], [arm + 4, -4], [arm + 4, 4], [-arm - 4, 4]], 0.3, 8), col).p(c.cut(c.circ(-arm, 0, 6, 10), 0.2, 3) + c.cut(c.circ(arm, 0, 6, 10), 0.2, 3), shade(col, -0.2)).out();
  const pan = `<path d="M0 0L-30 ${drop}M0 0L30 ${drop}" stroke="${shade(col, -0.3)}" stroke-width="1.6" fill="none"/>${sheet().p(c.cut([[-40, drop], [40, drop], [28, drop + 16], [-28, drop + 16]], 0.3, 5), col).out()}`;
  return { frame, beam, pan, arm, drop };
}
/** pose a scales rig built from scalesParts (els: { frame, beam, panL, panR }) at (x, y) with tilt a (degrees) */
export function poseScales(els, x, y, a, o = 1, s = 1, arm = 110) {
  const r = (a * PI) / 180;
  pose(els.frame, { x, y, s, o });
  pose(els.beam, { x, y, r: a, s, o });
  pose(els.panL, { x: x - Math.cos(r) * arm * s, y: y - Math.sin(r) * arm * s, s, o });
  pose(els.panR, { x: x + Math.cos(r) * arm * s, y: y + Math.sin(r) * arm * s, s, o });
}
/** a draw-on path of light: <path pathLength=1> with a dashed stroke revealed by k (use drawPath) */
export function lightPath(d, { w = 5, col = C.halo, dash = '' } = {}) {
  return `<path d="${d}" pathLength="1" stroke="${col}" stroke-width="${w}" stroke-linecap="round" fill="none" stroke-dasharray="1 1" stroke-dashoffset="1"/>`;
}
export function drawPath(el, k) { attr(el, 'stroke-dashoffset', 1 - k); }
/** a Temple guard (a Levite of the watch) with a staff in the back hand */
export function templeGuard(c, i = 0) {
  const staff = `<path d="${c.ribbon([[0, -70], [2, 90]], 5)}" fill="${C.wood2}"/>`;
  return person(c, { robe: [C.tealRobe, C.dustyBlue][i % 2], mantle: null, belt: C.leather, skin: [C.skin3, C.skin2][i % 2], hair: C.hair3, hairStyle: 'wrap', veil: [C.stone, C.linen2][i % 2], veil2: C.teal2, beard: 'short', holdB: staff });
}
