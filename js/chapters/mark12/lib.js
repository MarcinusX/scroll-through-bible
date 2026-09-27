// Mark 12 — the whole chapter plays in Jerusalem, in the Temple courts.
// This file holds the shared Temple-court set (the same cut in every scene), the cast of the chapter,
// the vineyard of the parable and the props. Everything returns SVG markup cut with the seeded scissors.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging, swing, lerp } from '../kit.js';
import { band, sun, cloud, town, olive, cypress, hang } from '../../assets/nature.js';
import { paperLabel } from '../../assets/things.js';
import { makeCutter } from '../../core/paper.js';
import { fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, coin, coinStack, scrollOpen, candle, dust, addToHead, addToBody, townsfolk, circlet, wordSlip } from '../mark2/lib.js';
export { withFace, faceBits, along, bubble, nameTag, strip, sparkle, question, dove, wisp, scrollRoll } from '../mark3/lib.js';
export { angel, glory, soulLight, bigQuestion, crown, balance } from '../mark8/lib.js';
export { voiceRings, hang2, flame } from '../mark1/lib.js';
import { addToHead, addToBody, circlet, heart as heartGlow } from '../mark2/lib.js';
import { pharisee as phariseeLook, herodian as herodianLook, scribe as scribeLook, LOOK as L3, shadowPerson as shadow3, withFace as withFace3, faceBits as faceBits3 } from '../mark3/lib.js';
import { LEADERS as L8, crown as crown8 } from '../mark8/lib.js';

const PI = Math.PI;
const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');
export { PI, FONT };

/* ====================================================================== */
/* the cast                                                               */
/* ====================================================================== */
export const LOOK = {
  ...L3,
  // the chief priests, the elder and the scribe who questioned his authority (as in chapter 8's shadow play)
  elder: L8[0], priest: L8[1], lscribe: L8[2],
  // the parable
  owner: { robe: C.linen2, mantle: C.teal2, hair: C.greyHair, hairStyle: 'wrap', veil: C.cream, veil2: C.ochre, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.ochre },
  son: { robe: C.linen, mantle: mix(C.roseRobe, C.jesusMantle, 0.5), hair: C.hair2, hairStyle: 'long', beard: 'short', skin: C.skin, belt: C.ochre },
  // Sadducees: priestly aristocrats — white linen, deep blue mantles, gold
  // Moses, David, the patriarchs
  moses: { robe: mix(C.dune, C.wood3, 0.35), mantle: C.clayMantle, hair: C.greyHair, hairStyle: 'wild', beard: 'wild', beardColor: '#e9e2d6', skin: C.skin3, belt: C.rope },
  david: { robe: C.roseRobe, mantle: C.terracotta, hair: '#a4552f', hairStyle: 'curly', beard: 'short', beardColor: '#a4552f', skin: C.skin, belt: C.leather },
  abraham: { robe: C.wheatRobe, mantle: C.clayMantle, hair: '#e9e2d6', hairStyle: 'wrap', veil: C.linen2, beard: 'wild', beardColor: '#eee7da', skin: C.skin3 },
  isaac: { robe: C.sageRobe, mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin2 },
  jacob: { robe: C.tealRobe, mantle: C.ochreRobe, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.leather },
  // the widow and the rich
  widow: { robe: mix(C.stone2, C.rock2, 0.5), hairStyle: 'veil', veil: mix(C.storm, C.stone2, 0.55), veil2: mix(C.storm, C.stone2, 0.4), hair: C.greyHair, skin: C.skin3, belt: null },
};
export const JESUS = CAST.jesus;
/** a tenant farmer of the parable: rough tunic, belt; i = 0..2 */
export function tenant(i = 0) {
  return [
    { robe: C.clay, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin4, belt: C.leather },
    { robe: C.olive, mantle: null, hair: C.hair, hairStyle: 'short', beard: 'wild', skin: C.skin3, belt: C.rope },
    { robe: shade(C.wood3, -0.05), hair: C.hair2, hairStyle: 'wrap', veil: C.ochreRobe, beard: 'short', skin: C.skin2, belt: C.leather },
  ][i % 3];
}
/** a servant sent by the owner (simple tunic, head cloth) */
export function servant(i = 0) {
  const robes = [C.sageRobe, C.dustyBlue, C.ochreRobe, C.tealRobe, C.wheatRobe, C.roseRobe, C.mauve];
  return { robe: robes[i % robes.length], hair: [C.hair, C.hair2, C.hair3][i % 3], hairStyle: i % 2 ? 'short' : 'wrap', veil: C.linen2, beard: ['short', 'none', 'full'][i % 3], skin: [C.skin2, C.skin, C.skin3, C.skin4][i % 4], belt: C.rope };
}
/** new, glad tenants who receive the vineyard at the end */
export function newTenant(i = 0) {
  return [
    { robe: C.sageRobe, mantle: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin, belt: C.leather },
    { robe: C.linen2, mantle: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin2 },
    { robe: C.tealRobe, hair: C.hair, hairStyle: 'curly', beard: 'none', skin: C.skin3, belt: C.rope },
  ][i % 3];
}
export function sadducee(i = 0) {
  return {
    robe: [C.linen, C.linen2, C.cream][i % 3], mantle: [C.indigo, mix(C.indigo, C.plumRobe, 0.4), C.teal][i % 3], belt: C.sun,
    hair: [C.hair3, C.hair, C.greyHair][i % 3], hairStyle: 'wrap', veil: C.cream, veil2: C.sun,
    beard: ['short', 'full', 'short'][i % 3], beardColor: [C.hair3, C.hair, C.greyHair][i % 3], skin: [C.skin, C.skin2, C.skin3][i % 3],
  };
}
export function rich(i = 0) {
  return {
    robe: [C.plumRobe, C.tealRobe, mix(C.indigo, C.mauve, 0.4)][i % 3], mantle: [C.ochre, C.sun, C.terracotta][i % 3], belt: C.sun,
    hair: [C.hair3, C.greyHair, C.hair][i % 3], hairStyle: 'wrap', veil: [C.cream, C.linen, C.parchment][i % 3], veil2: C.sun,
    beard: ['full', 'wild', 'full'][i % 3], beardColor: [C.hair3, C.greyHair, C.hair][i % 3], skin: [C.skin2, C.skin, C.skin3][i % 3],
  };
}
export const pharisee = (c, i = 0) => phariseeLook(c, i);
export const herodian = (c, i = 0) => herodianLook(c, i);
/** a scribe (chapter 3 look, scroll in the front hand) */
export const scribe = (c, i = 0) => scribeLook(c, i);
/** a man / woman from the crowd */
export function man(c, extra = {}) { const o = crowdPerson(c, extra); if (o.hairStyle === 'veil') { o.hairStyle = 'short'; o.beard = 'short'; } return o; }
export function woman(c, extra = {}) { return { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', ...extra }; }
export const shadowPerson = shadow3;
/** David with his royal circlet */
export const davidPuppet = (c, extra = {}) => addToHead(person(c, { ...LOOK.david, ...extra }), circlet(c));

/* ====================================================================== */
/* the Temple court — one set shared by most scenes                       */
/* ====================================================================== */
export const COURT = { FLOOR: 650, STYLO: 590, COLTOP: 398, ROOF: 372, GAP0: 690, GAP1: 910 };
export const DAY = ['#cfe0dc', '#eee6cf', '#f7ebd4'];
export const EVENING = ['#e9c6a8', '#f1d9b8', '#f6e6cc'];

function ashlar(c, x0, x1, y0, y1, h = 22, col) {
  let d = '';
  for (let y = y0, r = 0; y < y1 - 4; y += h, r++) {
    d += c.ribbon([[x0, y], [x1, y + c.rr(-1, 1)]], 1.1);
    for (let x = x0 + (r % 2) * 30 + c.rr(10, 40); x < x1 - 10; x += c.rr(56, 84)) d += c.ribbon([[x, y], [x + c.rr(-1, 1), Math.min(y1, y + h)]], 1);
  }
  return d;
}

/** the sanctuary: the tall gleaming front of the Temple with its golden vine; origin world coords */
export function sanctuary(c) {
  const s = sheet();
  const st = mix(C.plaster, C.cream, 0.5), st2 = mix(C.stone, C.plaster2, 0.5);
  // the terrace it stands on
  s.p(c.cut([[430, 560], [430, 408], [1170, 408], [1170, 560]], 0.6, 12), st2);
  s.x(ashlar(c, 432, 1168, 420, 560, 24), shade(st2, -0.14), 'opacity=".55"');
  // low side wings
  s.p(c.cut(c.rect(556, 262, 88, 150), 0.5, 8) + c.cut(c.rect(956, 262, 88, 150), 0.5, 8), C.plaster2);
  s.p(c.cut(c.rect(548, 254, 104, 11), 0.3, 6) + c.cut(c.rect(948, 254, 104, 11), 0.3, 6), shade(C.sun, -0.05));
  let wn = '';
  [582, 618, 982, 1018].forEach((x) => { wn += c.cut([[x - 8, 336], [x - 8, 308], ...c.arc(x, 308, 8, 8, PI, 2 * PI, 6), [x + 8, 336]], 0.2, 3); });
  s.p(wn, shade(C.plaster2, -0.32));
  // the great facade, wider at the top ("like a lion: broad in front, narrow behind")
  s.p(c.cut([[640, 410], [640, 172], [960, 172], [960, 410]], 0.6, 10), st);
  s.x(ashlar(c, 644, 956, 190, 408, 28), shade(st, -0.1), 'opacity=".4"');
  // pilasters
  let pil = '', caps = '';
  [664, 712, 888, 936].forEach((x) => { pil += c.cut(c.rect(x - 9, 190, 18, 218), 0.3, 8); caps += c.cut(c.rect(x - 13, 186, 26, 9), 0.2, 4); });
  s.p(pil, mix(st, C.stone2, 0.4));
  s.p(caps, C.sun);
  // gilded cornice and the golden spikes along the roof
  s.p(c.cut([[628, 176], [972, 176], [972, 161], [628, 161]], 0.4, 8), C.sun);
  s.x(c.ribbon([[630, 172], [970, 172]], 2), shade(C.sun, -0.25), 'opacity=".6"');
  let spikes = '';
  for (let x = 634; x <= 966; x += 14) spikes += c.poly([[x - 2.6, 162], [x, 149], [x + 2.6, 162]]);
  s.x(spikes, shade(C.sun, 0.1));
  // the portal with its lintel and the embroidered veil (blue, purple, scarlet, linen)
  s.p(c.cut(c.rect(746, 212, 108, 198), 0.4, 8), mix(C.soilDark, C.wood2, 0.3));
  s.p(c.cut(c.rect(738, 206, 124, 11), 0.3, 6), C.sun);
  const veilCols = [C.dustyBlue, C.plumRobe, C.terracotta, C.linen];
  veilCols.forEach((col, i) => {
    const x0 = 754 + i * 23;
    s.p(c.cut([[x0, 246], [x0 + 23, 246], [x0 + 23 + (i % 2 ? 1 : -1), 408], [x0 - (i % 2 ? 1 : -1), 408]], 0.4, 8), col);
  });
  let pleat = '';
  for (let x = 759; x < 846; x += 8) pleat += c.ribbon([[x, 250], [x + c.rr(-1.5, 1.5), 404]], 1.3);
  s.x(pleat, C.ink, 'opacity=".12"');
  s.x(c.ribbon(c.qbez([754, 248], [800, 258], [846, 248], 12), 3), C.sun);
  // the golden vine over the portal, heavy with clusters
  const vine = c.qbez([734, 230], [800, 221], [866, 230], 20);
  s.p(c.ribbon(vine, 3), shade(C.sun, -0.2));
  let lv = '', gr = '';
  vine.forEach(([x, y], i) => {
    if (i % 2) lv += c.cut([[x, y], [x - 6, y - 7], [x - 1, y - 12], [x + 5, y - 8]], 0.2, 3);
    if (i % 4 === 2) for (let r = 0; r < 3; r++) for (let k = 0; k <= 2 - r; k++) gr += c.cut(c.circ(x - (2 - r) * 2.3 + k * 4.6, y + 5 + r * 4, 2.3, 6), 0.1, 2);
  });
  s.p(lv, shade(C.sun, 0.05)).p(gr, shade(C.sun, -0.12));
  return s.out();
}

/** Solomon's porch: a long double colonnade across the court, open in the middle to the stairs */
export function colonnade(c, { gap0 = COURT.GAP0, gap1 = COURT.GAP1 } = {}) {
  const { STYLO, COLTOP, ROOF } = COURT;
  const s = sheet();
  const inner = mix(C.plaster2, C.rock2, 0.35), colC = mix(C.stone, C.cream, 0.35), ent = mix(C.stone, C.plaster2, 0.3);
  const runs = [[-900, gap0 - 28], [gap1 + 28, 2500]];
  runs.forEach(([x0, x1]) => {
    // the shaded back wall of the porch, with doorways
    s.p(c.cut([[x0, ROOF + 10], [x1, ROOF + 10], [x1, STYLO], [x0, STYLO]], 0.6, 14), inner);
    let doors = '';
    for (let x = x0 + 60; x < x1 - 40; x += 312) doors += c.cut([[x, STYLO - 2], [x, 480], ...c.arc(x + 22, 480, 22, 20, PI, 2 * PI, 8), [x + 44, STYLO - 2]], 0.3, 5);
    s.x(doors, shade(inner, -0.22), 'opacity=".8"');
  });
  // cedar ceiling beams seen between the columns
  let beams = '';
  runs.forEach(([x0, x1]) => { for (let x = x0 + 20; x < x1; x += 39) beams += c.cut(c.rect(x, COLTOP - 2, 10, 14), 0.2, 4); });
  s.p(beams, C.wood2);
  // columns
  let cols = '', caps = '', bases = '', flutes = '';
  runs.forEach(([x0, x1]) => {
    for (let x = x0 + 40; x < x1 - 10; x += 78) {
      cols += c.cut([[x - 13, COLTOP + 8], [x + 13, COLTOP + 8], [x + 14, STYLO - 12], [x - 14, STYLO - 12]], 0.4, 10);
      caps += c.cut([[x - 22, COLTOP], [x + 22, COLTOP], [x + 16, COLTOP + 10], [x - 16, COLTOP + 10]], 0.3, 5);
      bases += c.cut(c.rect(x - 19, STYLO - 14, 38, 12), 0.3, 5);
      flutes += c.ribbon([[x - 5, COLTOP + 16], [x - 5, STYLO - 18]], 1.6) + c.ribbon([[x + 5, COLTOP + 16], [x + 5, STYLO - 18]], 1.6);
    }
  });
  s.p(cols, colC);
  s.x(flutes, shade(colC, -0.12), 'opacity=".7"');
  s.p(caps + bases, ent);
  // entablature with dentils, then the tiled roof
  runs.forEach(([x0, x1]) => {
    s.p(c.cut([[x0, COLTOP + 1], [x1, COLTOP + 1], [x1, ROOF], [x0, ROOF]], 0.5, 12), ent);
    let dent = '';
    for (let x = x0 + 4; x < x1 - 6; x += 14) dent += c.poly(c.rect(x, ROOF + 4, 7, 6));
    s.x(dent, shade(ent, -0.16), 'opacity=".8"');
    s.x(c.ribbon([[x0, COLTOP - 4], [x1, COLTOP - 4]], 2), C.sun, 'opacity=".7"');
    const rf = [[x0, ROOF + 1], [x0, ROOF - 18]];
    for (let x = x0; x < x1; x += 22) rf.push(...c.arc(x + 11, ROOF - 18, 11, 6, PI, 2 * PI, 4));
    rf.push([x1, ROOF - 18], [x1, ROOF + 1]);
    s.p(c.cut(rf, 0.3, 6), mix(C.clay, C.roof, 0.5));
    let tiles = '';
    for (let x = x0 + 11; x < x1; x += 22) tiles += c.ribbon([[x, ROOF - 16], [x, ROOF - 2]], 1.2);
    s.x(tiles, shade(C.clay, -0.2), 'opacity=".5"');
  });
  // square piers closing each run of columns at the stairs
  [[gap0 - 46, gap0 - 10], [gap1 + 10, gap1 + 46]].forEach(([a, b]) => {
    s.p(c.cut([[a, STYLO], [a, ROOF - 22], [b, ROOF - 22], [b, STYLO]], 0.5, 10), mix(C.stone, C.plaster, 0.4));
    s.x(ashlar(c, a + 2, b - 2, ROOF, STYLO, 26), shade(C.stone, -0.14), 'opacity=".6"');
    s.p(c.cut([[a - 5, ROOF - 20], [b + 5, ROOF - 20], [b + 5, ROOF - 32], [a - 5, ROOF - 32]], 0.3, 5), C.sun);
  });
  // the stylobate: two long steps
  s.p(c.cut([[-900, STYLO - 4], [2500, STYLO - 4], [2500, STYLO + 30], [-900, STYLO + 30]], 0.6, 16), mix(C.stone, C.plaster2, 0.2));
  s.x(c.ribbon([[-900, STYLO + 12], [2500, STYLO + 12]], 1.4), shade(C.stone, -0.18), 'opacity=".7"');
  return s.out();
}

/** the stairs up to the sanctuary, seen through the gap in the porch */
export function stairs(c, { gap0 = COURT.GAP0, gap1 = COURT.GAP1 } = {}) {
  const s = sheet();
  const n = 9, y0 = 410, y1 = COURT.STYLO + 2;
  let d = '', e = '';
  for (let i = 0; i < n; i++) {
    const y = lerp(y0, y1, i / n), yb = lerp(y0, y1, (i + 1) / n), w = lerp(0.62, 1, i / n) * (gap1 - gap0) / 2 + 30;
    d += c.cut([[800 - w, y], [800 + w, y], [800 + w, yb + 1], [800 - w, yb + 1]], 0.3, 8);
    e += c.ribbon([[800 - w, y + 2], [800 + w, y + 2]], 1.6);
  }
  s.p(d, mix(C.stone, C.cream, 0.4)).x(e, C.cream, 'opacity=".8"');
  return s.out();
}

/** court paving in soft perspective; origin world coords */
export function courtFloor(c, { col = mix(C.stone, C.sand, 0.35) } = {}) {
  const s = sheet();
  const top = COURT.STYLO + 26;
  s.p(c.cut([[-900, top], [2500, top], [2500, 1700], [-900, 1700]], 0.6, 20), col);
  let lines = '';
  const rows = [top + 14, top + 34, top + 62, top + 100, top + 150, top + 216, top + 300, top + 410];
  rows.forEach((y) => { lines += c.ribbon([[-900, y], [2500, y + c.rr(-1, 1)]], 1.3); });
  for (let k = -24; k <= 24; k++) { const xb = 800 + k * 70; lines += c.ribbon([[800 + (xb - 800) * 0.35, top], [800 + (xb - 800) * 2.6, 1400]], 1.1); }
  s.x(lines, shade(col, -0.14), 'opacity=".55"');
  // a few worn, warmer slabs
  let warm = '';
  for (let i = 0; i < 16; i++) { const y = c.rr(top + 20, 900), x = c.rr(-200, 1800); warm += c.cut(c.blob(x, y, c.rr(20, 50), c.rr(5, 12), 8, 0.2), 0.4, 5); }
  s.x(warm, shade(col, 0.16), 'opacity=".5"');
  return s.out();
}

/** a trumpet-shaped offering chest (shofar): a wooden box with a flared bronze funnel; origin: base centre. Mouth ≈ (0, -h) */
export function trumpetChest(c, { h = 118, w = 64, label = '' } = {}) {
  const s = sheet();
  const bronze = mix(C.ochre, C.clay, 0.3);
  s.p(c.cut([[-w / 2, 0], [-w / 2, -54], [w / 2, -54], [w / 2, 0]], 0.4, 6), C.wood);
  s.x(c.ribbon([[-w / 2 + 2, -40], [w / 2 - 2, -40]], 2.4) + c.ribbon([[-w / 2 + 2, -14], [w / 2 - 2, -14]], 2.4), shade(C.wood, -0.25), 'opacity=".7"');
  s.p(c.cut(c.rect(-w / 2 - 4, -58, w + 8, 8), 0.3, 5), C.wood2);
  // the flaring horn
  const horn = [[-7, -56], [-9, -76], ...c.qbez([-9, -76], [-12, -h + 20], [-30, -h], 8).slice(1), [30, -h], ...c.qbez([30, -h], [12, -h + 20], [9, -76], 8).slice(1), [7, -56]];
  s.p(c.cut(horn, 0.3, 5), bronze);
  s.p(c.cut(c.ell(0, -h, 30, 7, 20), 0.3, 4), shade(bronze, -0.35));
  s.x(c.ribbon(c.qbez([-5, -62], [-6, -h + 24], [-20, -h + 4], 8), 2), shade(bronze, 0.35), 'opacity=".75"');
  s.x(c.ribbon([[-30, -h - 1], [30, -h - 1]], 1.6), shade(bronze, 0.3));
  const t = label ? `<text x="0" y="-22" text-anchor="middle" font-family="${FONT}" font-size="14" font-style="italic" fill="${C.cream}">${label}</text>` : '';
  return s.out() + t;
}

/** a big bronze lamp on a chain, for the foreground */
function hangingLamp(c) {
  const s = sheet();
  const b = mix(C.ochre, C.clay, 0.3);
  s.p(c.cut([[-40, 0], [40, 0], [26, 18], [-26, 18]], 0.4, 5), b);
  s.p(c.cut(c.ell(0, 0, 42, 8, 16), 0.3, 4), shade(b, -0.25));
  s.p(c.cut(c.circ(0, 26, 7, 8), 0.2, 3), b);
  const fl = [-26, -8, 10, 28].map((x) => `M${x} -4C${x - 5} -9 ${x - 4} -16 ${x} -24C${x + 4} -16 ${x + 5} -9 ${x} -4Z`).join('');
  return `<path d="M0 -1400V-10M-30 0L0 -46L30 0" stroke="${C.inkSoft}" stroke-width="1.5" fill="none" opacity=".55"/><circle cy="-10" r="90" fill="url(#warm-glow)" opacity=".55"/>${s.out()}<path d="${fl}" fill="${C.lampFlame}"/>`;
}

/**
 * Build the Temple court as layers: sky, hanging sun & clouds, the Mount of Olives, the sanctuary,
 * the smoke of the altar, the porch and the paving. People go in layers added after this call;
 * call .front() last for the foreground columns. Returns handles for the scene.
 */
export function templeCourt(S, { skyCols = DAY, sunX = 1240, sunY = 175, smoke = true, lamps = true } = {}) {
  const c = makeCutter('m12-temple-set');
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunX, y: sunY, len: 700 });
  const cl1 = hanging(hangL, cloud(c, 190), { x: 440, y: 150, len: 600 });
  const cl2 = hanging(hangL, cloud(c, 130), { x: 1080, y: 250, len: 700 });

  const far = S.layer({ par: 0.08, sh: 2 });
  const hill = band(c, { y: 330, amps: [22, 9, 3], lens: [1100, 380, 130], color: C.hillFar });
  far.add(hill.markup);
  let groves = '';
  for (let i = 0; i < 40; i++) { const x = c.rr(-600, 2200), y = hill.fn(x) + c.rr(6, 40); groves += c.cut(c.blob(x, y, c.rr(8, 14), c.rr(5, 8), 8, 0.2), 0.4, 4); }
  far.add(sheet().p(groves, mix(C.hillMid, C.sage, 0.4)).out());
  far.add(town(c, { x: 150, y: 400, n: 9, spread: 460, sc: 0.8 }) + town(c, { x: 1480, y: 400, n: 9, spread: 460, sc: 0.8 }));

  const sanL = S.layer({ par: 0.16, sh: 4 });
  const smokeEl = smoke ? sanL.add(`<g opacity=".55">${smokePlume(c)}</g>`) : null;
  sanL.add(sanctuary(c));
  sanL.add(cypress(c, 470, 410, 150) + cypress(c, 1130, 410, 170) + cypress(c, 440, 412, 110));

  const stairL = S.layer({ par: 0.26, sh: 3 });
  stairL.add(stairs(c));
  const colL = S.layer({ par: 0.3, sh: 5 });
  colL.add(colonnade(c));
  const floorL = S.layer({ par: 0.45, sh: 3 });
  floorL.add(courtFloor(c));

  let lampEls = [];
  return {
    c, sk, hangL, sunEl, cl1, cl2, far, sanL, colL, floorL, smokeEl, FLOOR: COURT.FLOOR,
    /** foreground columns & lamps (call after the people layers) */
    front({ lampsOn = lamps } = {}) {
      const fg = S.layer({ par: 0.9, sh: 8 });
      const col = (x) => {
        const s = sheet();
        const cc = mix(C.stone, C.cream, 0.25);
        s.p(c.cut([[x - 58, -1400], [x + 58, -1400], [x + 62, 1100], [x - 62, 1100]], 0.8, 18), cc);
        s.x(c.ribbon([[x - 26, -1400], [x - 26, 1100]], 4) + c.ribbon([[x + 2, -1400], [x + 2, 1100]], 4) + c.ribbon([[x + 30, -1400], [x + 30, 1100]], 4), shade(cc, -0.1), 'opacity=".6"');
        s.p(c.cut(c.rect(x - 84, 780, 168, 40), 0.5, 8), mix(C.stone, C.plaster2, 0.4));
        return s.out();
      };
      fg.add(col(150) + col(1450));
      if (lampsOn) lampEls = [[300, 60], [1300, 90]].map(([x, y]) => ({ el: fg.add(`<g transform="translate(${x} ${y})">${hangingLamp(c)}</g>`), x, y }));
      return fg;
    },
    /** idle life: sun & clouds on their strings, smoke curling, lamps swaying */
    update(t, time, { sunDY = 0 } = {}) {
      swing(sunEl, sunX, sunY + sunDY, time, 1.1, 0.7);
      swing(cl1, 440 + Math.sin(time * 0.1) * 24, 150, time, 1.3, 0.6, 1);
      swing(cl2, 1080 + Math.sin(time * 0.12 + 2) * 24, 250, time, 1.3, 0.8, 2);
      lampEls.forEach((l, i) => swing(l.el, l.x, l.y, time, 0.8, 0.9, i * 2));
    },
  };
}
/** a thin column of smoke rising behind the porch from the altar (left of the stairs) */
function smokePlume(c) {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const y = 330 - i * 44, x = 560 + Math.sin(i * 1.3) * 16 + i * 6, r = 14 + i * 5;
    d += c.cut(c.blob(x, y, r, r * 0.7, 10, 0.2), 0.6, 5);
  }
  return `<path d="${d}" fill="#efe9df"/>`;
}

/* ====================================================================== */
/* the vineyard of the parable (two scenes share it)                      */
/* ====================================================================== */
export const VINE = { GROUND: 640, WALL_Y: 612, GATE: [1080, 1150], TOWER: 520, PRESS: 690 };
/** one vine stock with leaves; grapes are a separate piece. origin: foot */
export function vineStock(c, h = 96) {
  const s = sheet();
  s.p(c.ribbon(c.cbez([0, 0], [-6, -h * 0.3], [8, -h * 0.6], [0, -h], 10), (t) => 7 - t * 3.5), C.wood2);
  s.p(c.ribbon([[-34, -h * 0.72], [34, -h * 0.72]], 3), C.wood3);
  s.p(c.ribbon([[0, -h], [-30, -h * 0.74]], 3) + c.ribbon([[0, -h], [30, -h * 0.76]], 3), C.wood2);
  let lv = '', lv2 = '';
  for (let i = 0; i < 8; i++) {
    const x = c.rr(-34, 34), y = -h * c.rr(0.7, 1.08);
    const leaf = c.cut(c.star(x, y, c.rr(11, 15), c.rr(7, 9), 5, c.rr(0, 6)), 0.4, 3);
    if (i % 2) lv += leaf; else lv2 += leaf;
  }
  s.p(lv2, C.moss).p(lv, C.leaf);
  return s.out();
}
/** a hanging bunch of grapes; origin: stem */
export function grapeBunch(c, r = 4.2, col = shade(C.plumRobe, -0.1)) {
  let d = '';
  const rows = [4, 3, 3, 2, 1];
  rows.forEach((n, row) => { for (let i = 0; i < n; i++) d += c.cut(c.circ((i - (n - 1) / 2) * r * 1.7, r + row * r * 1.45, r, 8), 0.15, 2); });
  return sheet().p(d, col).x(c.ribbon([[0, 0], [1, -6]], 1.6), C.moss2).x(c.poly(c.circ(-r * 0.6, r * 0.6, r * 0.35, 5)), shade(col, 0.4), 'opacity=".7"').out();
}
/** a stretch of dry-stone wall; origin: bottom-left, w wide, h high */
export function stoneWall(c, w = 120, h = 40, col = C.rock) {
  const s = sheet();
  const pts = [[0, 0], [0, -h + c.rr(-3, 3)]];
  for (let x = 12; x < w; x += 12) pts.push([x, -h + c.rr(-4, 3)]);
  pts.push([w, -h], [w, 0]);
  s.p(c.cut(pts, 0.8, 7), col);
  let st = '';
  for (let y = -h + 8, r = 0; y < -2; y += 11, r++) for (let x = (r % 2) * 9 + 4; x < w - 8; x += c.rr(16, 24)) st += c.cut(c.blob(x + 7, y + 4, c.rr(6, 9), c.rr(3.5, 5), 7, 0.2), 0.4, 3);
  s.x(st, shade(col, -0.16), 'opacity=".75"');
  return s.out();
}
/** the watchtower in three courses (so it can be built up stone by stone); origin: base centre */
export function towerParts(c, w = 84, h = 230) {
  const col = mix(C.rock, C.stone2, 0.5);
  const course = (i) => {
    const y0 = -(h / 3) * i, y1 = -(h / 3) * (i + 1), ww = w * (1 - i * 0.06), ww2 = w * (1 - (i + 1) * 0.06);
    const s = sheet();
    s.p(c.cut([[-ww / 2, y0], [-ww2 / 2, y1], [ww2 / 2, y1], [ww / 2, y0]], 0.6, 7), col);
    s.x(ashlar(c, -ww / 2 + 2, ww / 2 - 2, y1 + 4, y0, 16), shade(col, -0.2), 'opacity=".6"');
    if (i === 1) s.p(c.cut([[-8, y0 - 26], [-8, y0 - 48], ...c.arc(0, y0 - 48, 8, 8, PI, 2 * PI, 6), [8, y0 - 26]], 0.2, 3), C.soilDark);
    if (i === 0) s.p(c.cut([[-14, y0], [-14, y0 - 40], ...c.arc(0, y0 - 40, 14, 12, PI, 2 * PI, 6), [14, y0]], 0.2, 3), C.soilDark);
    return s.out();
  };
  const top = sheet();
  const y = -h, ww = w * 0.84;
  const pts = [[-ww / 2 - 6, y], [-ww / 2 - 6, y - 16]];
  for (let x = -ww / 2 - 6; x < ww / 2; x += 16) pts.push([x, y - 16], [x, y - 26], [x + 9, y - 26], [x + 9, y - 16]);
  pts.push([ww / 2 + 6, y - 16], [ww / 2 + 6, y]);
  top.p(c.cut(pts, 0.4, 5), shade(col, 0.08));
  return [course(0), course(1), course(2), top.out()];
}
/** the winepress: a rock-cut treading floor and a vat below; origin: ground centre */
export function winepress(c) {
  const s = sheet();
  s.p(c.cut([[-70, 0], [-66, -20], [66, -20], [70, 0]], 0.6, 6), mix(C.rock, C.stone2, 0.4));
  s.p(c.cut(c.ell(-10, -20, 58, 8, 20), 0.4, 5), shade(C.rock, -0.28));
  s.p(c.cut([[48, -8], [72, -8], [74, 18], [46, 18]], 0.4, 5), mix(C.rock2, C.stone2, 0.3));
  s.p(c.cut(c.ell(60, -8, 13, 4, 12), 0.2, 3), shade(C.rock2, -0.35));
  s.x(c.ribbon([[36, -18], [52, -10]], 3), shade(C.rock, -0.35));
  return s.out();
}
/** a little sailing ship on the far sea (the owner going abroad); origin: waterline centre */
export function farShip(c) {
  const s = sheet();
  s.p(c.cut([[-40, -10], [40, -10], [30, 4], [-30, 4]], 0.4, 5), C.wood);
  s.p(c.ribbon([[0, -10], [0, -64]], 3), C.wood2);
  s.p(c.cut([[-26, -60], [26, -60], [22, -18], [-22, -18]], 0.5, 5), C.sail);
  s.x(c.ribbon([[-24, -40], [24, -40]], 3), C.terracotta, 'opacity=".6"');
  return s.out();
}
/** the land far away: a round plate on two strings with a tiny palm, a house — where the owner lives abroad; origin centre */
export function abroadPlate(c, r = 92, id = 'abroad-clip') {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 8, 40), 0.4, 5), C.ochre);
  s.p(c.cut(c.circ(0, 0, r, 40), 0.4, 5), mix(C.skyBlue, C.cream, 0.4));
  const clip = `<clipPath id="${id}"><path d="${c.poly(c.circ(0, 0, r, 40))}"/></clipPath>`;
  const land = sheet();
  land.p(c.ridge(c.wave(r * 0.35, [6, 3], [120, 50]), -r - 20, r + 20, r + 20, 8, 0.6), mix(C.sand, C.dune, 0.4));
  land.p(c.ridge(c.wave(r * 0.18, [3, 1], [80, 30]), -r - 20, -r * 0.2, r * 0.35, 8, 0.4), C.lake2);
  land.p(c.cut(c.rect(r * 0.2, r * 0.02, r * 0.5, r * 0.36), 0.3, 5), C.plaster);
  land.p(c.cut([[r * 0.16, r * 0.04], [r * 0.45, -r * 0.2], [r * 0.74, r * 0.04]], 0.3, 5), C.terracotta);
  land.x(c.poly(c.rect(r * 0.38, r * 0.2, r * 0.1, r * 0.18)), C.soilDark);
  return `<defs>${clip}</defs>${s.out()}<g clip-path="url(#${id})">${land.out()}</g>`;
}

/* ====================================================================== */
/* props                                                                  */
/* ====================================================================== */
/** a stone block (origin centre); glow: add a warm halo */
export function stoneBlock(c, w = 70, h = 46, col = mix(C.stone, C.cream, 0.2)) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -h / 2 + 4], [-w / 2 + 6, -h / 2], [w / 2, -h / 2], [w / 2, h / 2 - 4], [w / 2 - 6, h / 2], [-w / 2, h / 2]], 0.8, 6), col);
  s.x(c.cut([[-w / 2 + 6, -h / 2], [w / 2, -h / 2], [w / 2 - 8, -h / 2 + 7], [-w / 2 + 12, -h / 2 + 7]], 0.3, 5), shade(col, 0.3), 'opacity=".8"');
  s.x(c.ribbon([[-w * 0.2, -h * 0.1], [w * 0.1, h * 0.2]], 1.2), shade(col, -0.25), 'opacity=".6"');
  return s.out();
}
/** the keystone: a wedge (wider at top); origin centre */
export function keystone(c, w = 64, h = 70, col = mix(C.stone, C.cream, 0.2)) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -h / 2], [w / 2, -h / 2], [w * 0.32, h / 2], [-w * 0.32, h / 2]], 0.6, 6), col);
  s.x(c.cut([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2 - 6, -h / 2 + 7], [-w / 2 + 6, -h / 2 + 7]], 0.3, 5), shade(col, 0.3), 'opacity=".8"');
  s.x(c.poly(c.star(0, 0, 10, 4, 4, 0)), C.sun);
  return s.out();
}
/** the voussoirs of an arch (without its keystone); returns an array of stone markups in world coords and the key slot */
export function archStones(c, cx, cy, r = 150, thick = 56, n = 9, col = mix(C.stone, C.plaster, 0.4)) {
  const out = [];
  const gap = 0.16; // radians left open for the keystone
  for (let i = 0; i < n; i++) {
    const side = i < n / 2 ? -1 : 1;
    const k = side < 0 ? i : i - Math.ceil(n / 2) + 0;
    // left half from PI to (1.5PI - gap), right half from (1.5PI + gap) to 2PI
    const half = Math.floor(n / 2);
    const a0 = side < 0 ? PI + (k / half) * (PI / 2 - gap) : 1.5 * PI + gap + (k / (n - half)) * (PI / 2 - gap);
    const a1 = side < 0 ? PI + ((k + 1) / half) * (PI / 2 - gap) : 1.5 * PI + gap + ((k + 1) / (n - half)) * (PI / 2 - gap);
    const pts = [...c.arc(cx, cy, r, r, a0, a1, 4), ...c.arc(cx, cy, r + thick, r + thick, a1, a0, 4)];
    out.push(sheet().p(c.cut(pts, 0.4, 5), shade(col, (i % 2) * -0.05)).out());
  }
  return { stones: out, key: [cx, cy - r - thick / 2] };
}
/** a denarius, big: Tiberius' laureate head and the legend round the rim; origin centre */
export function denarius(c, r = 120, { back = false } = {}) {
  const s = sheet();
  const silver = mix(C.stone, C.cream, 0.2), dk = shade(silver, -0.3);
  s.p(c.cut(c.blob(0, 0, r, r * 0.98, 30, 0.02), 0.6, 6), shade(silver, -0.06));
  s.p(c.cut(c.circ(0, 0, r * 0.9, 40), 0.4, 6), silver);
  let beads = '';
  for (let i = 0; i < 60; i++) { const a = (i / 60) * PI * 2; beads += c.poly(c.circ(Math.cos(a) * r * 0.94, Math.sin(a) * r * 0.94, r * 0.018, 5)); }
  s.x(beads, dk, 'opacity=".6"');
  if (!back) {
    // the emperor's head in profile, facing right, with a laurel wreath
    const k = r / 120;
    const head = [[-34, 58], [-40, 30], [-42, 0], [-36, -30], [-18, -52], [8, -58], [30, -48], [42, -28], [46, -12], [54, 0], [48, 4], [50, 14], [44, 18], [46, 28], [36, 34], [30, 42], [14, 44], [10, 62], [26, 74], [-44, 74]].map(([x, y]) => [x * k, y * k]);
    s.p(c.cut(head, 0.4, 4), shade(silver, -0.14));
    s.x(c.ribbon([[-30 * k, -44 * k], [0, -30 * k], [8 * k, -10 * k]], 2 * k), dk, 'opacity=".4"');
    s.x(c.poly(c.ell(30 * k, -10 * k, 4 * k, 2.4 * k, 8)), dk);
    s.x(c.ribbon(c.arc(-14 * k, -6 * k, 8 * k, 10 * k, -1, 1.6, 6), 1.6 * k), dk, 'opacity=".5"');
    let laurel = '';
    const lp = c.arc(0, -8 * k, 44 * k, 46 * k, PI * 0.95, PI * 1.62, 9);
    lp.forEach(([x, y], i) => { laurel += c.cut(c.ell(x, y, 7 * k, 3.2 * k, 8, i * 0.4 - 1.2), 0.2, 3); });
    s.x(laurel, mix(C.olive, dk, 0.4));
    s.x(c.ribbon([[-40 * k, -2 * k], [-58 * k, 16 * k]], 2.4 * k) + c.ribbon([[-40 * k, 0], [-54 * k, 24 * k]], 2.4 * k), mix(C.olive, dk, 0.4));
    const id = 'den' + Math.round(c.rr(0, 1e6));
    const rr = r * 0.78;
    const txt = `<defs><path id="${id}" d="M${-rr} ${r * 0.12}A${rr} ${rr} 0 1 1 ${rr} ${r * 0.12}"/></defs><text font-family="${FONT}" font-size="${(r * 0.13).toFixed(1)}" letter-spacing="${(r * 0.012).toFixed(1)}" fill="${dk}"><textPath href="#${id}" startOffset="50%" text-anchor="middle">TI·CAESAR·DIVI·AVG·F·AVGVSTVS</textPath></text>`;
    return s.out() + txt;
  }
  return s.out();
}
/** a smiling paper mask on a stick (held in the front hand); origin: the grip */
export function maskOnStick(c) {
  const s = sheet();
  s.p(c.ribbon([[0, 0], [2, -40]], 3), C.wood2);
  s.p(c.cut(c.ell(2, -56, 17, 20, 18), 0.4, 4), C.cream);
  s.x(c.poly(c.ell(-4, -62, 3.4, 2.2, 8)) + c.poly(c.ell(9, -62, 3.4, 2.2, 8)), C.ink);
  s.x(c.ribbon(c.arc(2.5, -52, 9, 6, 0.2, PI - 0.2, 8), 2), C.terracotta);
  s.x(c.poly(c.circ(-8, -52, 3.4, 8)) + c.poly(c.circ(13, -52, 3.4, 8)), C.blush, 'opacity=".6"');
  return s.out();
}
/** a paper fishing-net / snare, to lower over someone; origin: top centre */
export function snare(c, w = 170, h = 120) {
  let d = '';
  for (let i = 0; i <= 6; i++) { const x = -w / 2 + (w * i) / 6; d += c.ribbon(c.qbez([x * 0.5, 0], [x * 1.05, h * 0.5], [x, h], 8), 1.6); }
  for (let j = 1; j <= 4; j++) { const y = (h * j) / 4, ww = lerp(w * 0.25, w / 2, j / 4); d += c.ribbon(c.qbez([-ww, y], [0, y + 10], [ww, y], 10), 1.6); }
  let knots = '';
  for (let i = 0; i < 7; i++) knots += c.poly(c.circ(-w / 2 + (w * i) / 6, h, 3.4, 6));
  return `<path d="M0 -1400V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><path d="${d}" fill="${C.rope}"/><path d="${knots}" fill="${C.wood2}"/>`;
}
/** a leather purse; fill 0..1 (bulging or flat); origin: the neck */
export function purse(c, { full = true, col = C.leather } = {}) {
  const s = sheet();
  if (full) s.p(c.cut([[-6, 0], [6, 0], [10, 8], [22, 18], [26, 34], [18, 46], [-18, 46], [-26, 34], [-22, 18], [-10, 8]], 0.5, 4), col);
  else s.p(c.cut([[-5, 0], [5, 0], [8, 10], [12, 26], [8, 36], [-8, 36], [-12, 26], [-8, 10]], 0.8, 4), shade(col, 0.1));
  s.p(c.ribbon([[-8, 5], [8, 5]], 3.4), C.rope);
  if (full) s.x(c.ribbon(c.arc(0, 30, 14, 8, 0.4, PI - 0.4, 6), 1.2), shade(col, 0.3), 'opacity=".6"');
  return s.out();
}
/** a tiny copper coin (lepton); origin centre */
export function lepton(c, r = 4.2) {
  const cu = mix(C.clay, C.sun, 0.35);
  return sheet().p(c.cut(c.circ(0, 0, r, 10), 0.15, 2), cu).x(c.poly(c.circ(-r * 0.3, -r * 0.3, r * 0.3, 5)), shade(cu, 0.45)).out();
}
/** a glowing heart (God's part), origin centre */
export const glowHeart = (c, r = 22, col = C.jesusMantle) => heartGlow(c, r, col);
/** a small crowned emperor's bust plate (Caesar's things) — a Roman tax chest with an eagle; origin: base centre */
export function taxChest(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-50, -56, 100, 56), 0.4, 6), mix(C.curtain2, C.wood2, 0.4));
  s.p(c.cut(c.rect(-54, -64, 108, 10), 0.3, 5), C.wood2);
  s.p(c.cut(c.rect(-8, -40, 16, 18), 0.2, 3), C.sun);
  s.x(c.ribbon([[-50, -10], [50, -10]], 3), C.sun, 'opacity=".8"');
  // a little eagle on a pole
  const e = sheet();
  e.p(c.ribbon([[0, -64], [0, -120]], 4), C.wood2);
  e.p(c.cut([[0, -150], [-26, -160], [-34, -146], [-12, -140], [-4, -128], [4, -128], [12, -140], [34, -146], [26, -160]], 0.3, 4) + c.cut(c.circ(0, -154, 6, 8), 0.2, 3), C.sun);
  e.p(c.cut(c.rect(-20, -126, 40, 10), 0.2, 3), C.sun);
  return s.out() + e.out();
}
/** a smoking altar of unhewn stones; origin: base centre. The smoke is separate (.smoke) */
export function altar(c, w = 150, h = 90) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 + 6, -h], [w / 2 - 6, -h], [w / 2, 0]], 0.8, 7), mix(C.rock, C.stone2, 0.4));
  let st = '';
  for (let y = -h + 12, r = 0; y < -4; y += 16, r++) for (let x = -w / 2 + 8 + (r % 2) * 12; x < w / 2 - 12; x += c.rr(20, 30)) st += c.cut(c.blob(x + 9, y + 5, c.rr(8, 12), c.rr(5, 7), 7, 0.2), 0.4, 3);
  s.x(st, shade(C.rock, -0.18), 'opacity=".7"');
  // horns at the corners
  s.p(c.cut([[-w / 2 + 4, -h], [-w / 2 + 6, -h - 16], [-w / 2 + 18, -h]], 0.2, 3) + c.cut([[w / 2 - 18, -h], [w / 2 - 6, -h - 16], [w / 2 - 4, -h]], 0.2, 3), mix(C.rock, C.stone2, 0.2));
  // wood and fire on top
  s.p(c.ribbon([[-40, -h - 4], [36, -h - 8]], 7) + c.ribbon([[-30, -h - 10], [40, -h - 3]], 6), C.wood2);
  return s.out();
}
/** one puff of smoke; origin centre */
export function puff(c, r = 30, col = '#ece6dc') { return `<path d="${c.cut(c.blob(0, 0, r, r * 0.72, 11, 0.2), 0.6, 5)}" fill="${col}"/>`; }
/** the gate of the Kingdom: a golden paper gate with doors ajar and light behind; origin: base centre */
export function kingdomGate(c, w = 150, h = 210) {
  const s = sheet();
  const g = C.sun;
  s.p(c.cut([[-w / 2 - 14, 0], [-w / 2 - 14, -h + 50], ...c.arc(0, -h + 50, w / 2 + 14, 64, PI, 2 * PI, 14), [w / 2 + 14, -h + 50], [w / 2 + 14, 0], [w / 2, 0], [w / 2, -h + 50], ...c.arc(0, -h + 50, w / 2, 50, 2 * PI, PI, 14), [-w / 2, -h + 50], [-w / 2, 0]], 0.4, 6), g);
  let orn = '';
  for (let i = 0; i < 9; i++) { const a = PI + (i + 0.5) / 9 * PI; orn += c.poly(c.star(Math.cos(a) * (w / 2 + 7), -h + 50 + Math.sin(a) * 57, 4, 1.6, 4, 0)); }
  s.x(orn, C.star);
  const light = `<path d="${c.poly([[-w / 2, 0], [-w / 2, -h + 50], ...c.arc(0, -h + 50, w / 2, 50, PI, 2 * PI, 14), [w / 2, -h + 50], [w / 2, 0]])}" fill="#fff4d2"/>`;
  return { frame: s.out(), light };
}
export function gateDoor(c, w = 75, h = 160) {
  const s = sheet();
  s.p(c.cut(c.rect(0, -h, w, h), 0.4, 6), mix(C.sun, C.ochre, 0.4));
  s.x(c.ribbon([[6, -h + 20], [w - 6, -h + 20]], 2.4) + c.ribbon([[6, -20], [w - 6, -20]], 2.4) + c.ribbon([[w / 2, -h + 20], [w / 2, -20]], 2.4), shade(C.ochre, -0.2), 'opacity=".6"');
  return s.out();
}
/** a harp (kinnor) for David; origin: bottom of the frame */
export function harp(c) {
  const s = sheet();
  s.p(c.ribbon(c.qbez([0, 0], [-30, -40], [-8, -86], 10), 7), C.wood);
  s.p(c.ribbon(c.qbez([0, 0], [30, -34], [24, -80], 10), 7), C.wood);
  s.p(c.ribbon([[-12, -84], [28, -82]], 6), C.wood2);
  let str = '';
  for (let i = 0; i < 6; i++) str += c.ribbon([[-6 + i * 6, -80], [-2 + i * 4, -8 - i * 2]], 0.8);
  s.x(str, C.cream);
  return s.out();
}
/** a throne of light: a golden seat with rays; origin: foot of the seat */
export function throne(c) {
  const s = sheet();
  s.p(c.cut([[-60, 0], [-60, -70], [-72, -76], [-66, -200], ...c.arc(0, -200, 66, 40, PI, 2 * PI, 12), [66, -200], [72, -76], [60, -70], [60, 0]], 0.5, 6), C.sun);
  s.p(c.cut([[-44, -76], [-44, -186], ...c.arc(0, -186, 44, 26, PI, 2 * PI, 10), [44, -186], [44, -76]], 0.4, 6), mix(C.halo, C.cream, 0.4));
  s.p(c.cut(c.rect(-74, -84, 148, 16), 0.3, 5), shade(C.sun, -0.12));
  s.p(c.cut(c.rect(-58, -68, 116, 68), 0.4, 6), shade(C.sun, 0.05));
  s.x(c.poly(c.star(0, -40, 14, 6, 6, 0)), C.star);
  return s.out();
}
/** a low footstool; origin: base centre */
export function footstool(c, w = 110) {
  return sheet().p(c.cut([[-w / 2, -30], [w / 2, -30], [w / 2 - 6, 0], [-w / 2 + 6, 0]], 0.5, 6), mix(C.sun, C.ochre, 0.3)).x(c.ribbon([[-w / 2 + 6, -22], [w / 2 - 6, -22]], 2), C.star, 'opacity=".6"').out();
}
/** a crooked dark shard (an enemy, symbolic); origin centre */
export function shard(c, r = 22) {
  return sheet().p(c.cut(c.blob(0, 0, r, r * 0.7, 7, 0.45), 1.6, 4), mix(C.storm2, C.soilDark, 0.4)).out();
}
/** the burning bush: a thorny bush with layered paper flames (.fl1 .fl2 .fl3 flicker); origin: base centre */
export function burningBush(c, w = 150, parts = false) {
  const s = sheet();
  let br = '';
  for (let i = 0; i < 9; i++) { const a = PI + (i + 0.5) / 9 * PI; br += c.ribbon(c.qbez([0, 0], [Math.cos(a) * w * 0.3, -30], [Math.cos(a) * w * 0.55, Math.sin(a) * w * 0.6 - 10], 8), (t) => 5 - t * 3.5); }
  s.p(br, C.thorn);
  s.p(c.cut(c.blob(0, -40, w * 0.5, 40, 12, 0.2), 0.9, 5), mix(C.moss, C.olive, 0.5));
  const fl = (sc, col) => {
    let d = '';
    for (let i = 0; i < 7; i++) {
      const x = (i - 3) * w * 0.14 * sc, h = c.rr(70, 120) * sc, b = -30 * sc;
      d += `M${(x - 14 * sc).toFixed(1)} ${b}C${(x - 20 * sc).toFixed(1)} ${(b - h * 0.4).toFixed(1)} ${(x - 4 * sc).toFixed(1)} ${(b - h * 0.6).toFixed(1)} ${x.toFixed(1)} ${(b - h).toFixed(1)}C${(x + 6 * sc).toFixed(1)} ${(b - h * 0.6).toFixed(1)} ${(x + 20 * sc).toFixed(1)} ${(b - h * 0.4).toFixed(1)} ${(x + 14 * sc).toFixed(1)} ${b}Z`;
    }
    return `<path d="${d}" fill="${col}"/>`;
  };
  if (parts) return { glow: `<circle cy="-70" r="${w * 1.3}" fill="url(#warm-glow)"/>`, bush: s.out(), flames: [fl(1, C.sunDeep), fl(0.78, C.lampFlame), fl(0.5, '#fff4d2')] };
  return `<circle cy="-70" r="${w * 1.3}" fill="url(#warm-glow)"/>${s.out()}<g class="fl1">${fl(1, C.sunDeep)}</g><g class="fl2">${fl(0.78, C.lampFlame)}</g><g class="fl3">${fl(0.5, '#fff4d2')}</g>`;
}
/** a small house model (a widow's little house); origin: base centre */
export function littleHouse(c, w = 56, h = 44) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h, w, h), 0.4, 5), C.plaster);
  s.p(c.cut(c.rect(-w / 2 - 4, -h - 6, w + 8, 7), 0.3, 5), C.roof);
  s.p(c.cut([[-6, 0], [-6, -20], ...c.arc(0, -20, 6, 6, PI, 2 * PI, 5), [6, 0]], 0.2, 3), C.wood2);
  s.x(c.poly(c.rect(w * 0.18, -h * 0.72, 8, 8)), C.lampFlame);
  s.p(c.cut(c.ell(-w * 0.28, -h - 10, 7, 4, 8), 0.2, 3), C.pot);
  return s.out();
}
/** a very long prayer: a scroll unrolled down to the floor; origin: top rod (len = paper length) */
export function longScroll(c, len = 240, w = 38) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [w / 2, 0], [w / 2 + 2, len], [-w / 2 - 2, len]], 0.6, 10), C.parchment);
  let ln = '';
  for (let y = 12; y < len - 8; y += 9) ln += c.ribbon([[-w / 2 + 6, y], [w / 2 - 6 - c.rr(0, 10), y + c.rr(-0.5, 0.5)]], 1.3);
  s.x(ln, C.ink, 'opacity=".45"');
  s.p(c.cut(c.rect(-w / 2 - 6, -6, w + 12, 10), 0.2, 4), C.wood2);
  s.p(c.cut(c.ell(0, len + 4, w / 2 + 4, 7, 12), 0.3, 4), C.parchment);
  return s.out();
}
/** a raised seat of honour on a plinth; origin: base centre */
export function honourSeat(c) {
  const s = sheet();
  s.p(c.cut([[-40, 0], [-40, -60], [40, -60], [40, 0]], 0.4, 6), mix(C.stone, C.plaster2, 0.4));
  s.p(c.cut([[-30, -60], [-30, -140], [-24, -150], [24, -150], [30, -140], [30, -60]], 0.4, 6), C.wood);
  s.p(c.cut(c.rect(-36, -76, 72, 14), 0.3, 5), C.wood2);
  s.p(c.cut(c.blob(0, -80, 30, 8, 10, 0.1), 0.3, 4), C.curtain);
  s.x(c.poly(c.star(0, -120, 10, 4, 5, 0)), C.sun);
  return s.out();
}
/** a hanging warning tag with a big "!" (origin at the string hole) */
export function warnTag(c, text = '!') {
  const s = sheet();
  s.p(c.cut([[-34, 0], [34, 0], [42, 12], [42, 84], [-42, 84], [-42, 12]], 0.5, 6), C.cream);
  s.p(c.cut([[-34, 8], [34, 8], [36, 16], [36, 78], [-36, 78], [-36, 16]], 0.3, 6), C.parchment);
  s.x(c.poly(c.circ(0, 6, 3.4, 8)), C.wood2);
  return `${s.out()}<text x="0" y="68" text-anchor="middle" font-family="${FONT}" font-size="52" font-weight="600" fill="${C.terracotta}">${text}</text>`;
}
/** the four "all": heart, soul, mind, strength — icons on round plates (origin centre) */
export function loveIcon(c, kind, col = C.jesusMantle) {
  const s = sheet();
  if (kind === 'heart') {
    const r = 26, pts = [];
    for (let i = 0; i < 28; i++) { const a = (i / 28) * PI * 2; pts.push([16 * Math.pow(Math.sin(a), 3) * r / 16, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * r / 16 + 2]); }
    s.p(c.cut(pts, 0.3, 4), col);
  } else if (kind === 'soul') {
    s.p(c.cut([[0, -34], [16, -8], [18, 10], [8, 22], [-8, 22], [-18, 10], [-16, -8]], 0.3, 4), C.halo);
    s.x(c.poly(c.ell(0, 6, 7, 11, 12)), C.star);
  } else if (kind === 'mind') {
    // a head in profile with a little star inside
    s.p(c.cut([[-18, 26], [-22, 4], [-20, -14], [-8, -26], [8, -28], [20, -18], [24, -4], [30, 6], [24, 10], [22, 20], [8, 22], [6, 30]], 0.3, 4), mix(C.dustyBlue, C.skyVeil, 0.4));
    s.x(c.poly(c.star(0, -6, 11, 4.4, 5, -PI / 2)), C.sun);
  } else {
    // a pillar: strength
    s.p(c.cut(c.rect(-10, -22, 20, 44), 0.3, 4), mix(C.stone, C.cream, 0.3));
    s.p(c.cut(c.rect(-18, -30, 36, 9), 0.2, 3) + c.cut(c.rect(-18, 21, 36, 9), 0.2, 3), C.ochre);
    s.x(c.ribbon([[-3, -18], [-3, 18]], 1.4) + c.ribbon([[4, -18], [4, 18]], 1.4), shade(C.stone, -0.2));
  }
  return s.out();
}
/** a round plate (rim + face), origin centre */
export function disc(c, r = 50, { fill = C.cream, rim = C.ochre } = {}) {
  return sheet().p(c.cut(c.circ(0, 0, r + 6, 36), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r, 34), 0.5, 5), fill).out();
}
/** a portrait on a string that can flip: front (the person, warm) and back (grey, a snuffed candle); origin: centre */
export function flipPortrait(c, id, look, { w = 70, h = 88, label = '', frame = C.ochre } = {}) {
  const oval = c.ell(0, 0, w / 2, h / 2, 30);
  const front = sheet().p(c.cut(c.ell(0, 0, w / 2 + 6, h / 2 + 6, 30), 0.4, 5), frame).p(c.cut(oval, 0.3, 5), C.parchment).out();
  const bust = `<g clip-path="url(#${id})"><g transform="translate(-3 ${h * 1.05}) scale(${h / 150})">${person(c, look)}</g></g>`;
  const back = sheet().p(c.cut(c.ell(0, 0, w / 2 + 6, h / 2 + 6, 30), 0.4, 5), mix(frame, C.rock2, 0.55)).p(c.cut(oval, 0.3, 5), mix(C.stone2, C.rock2, 0.5)).out();
  const cand = sheet().p(c.cut(c.rect(-5, -8, 10, 26), 0.2, 3), C.cream).p(c.cut(c.ell(0, 18, 12, 3.4, 10), 0.2, 3), C.stone2).x(c.ribbon(c.cbez([0, -9], [4, -18], [-4, -24], [2, -34], 8), 2), '#cfc8bd', 'opacity=".9"').out();
  const lab = label ? `<g transform="translate(0 ${h / 2 + 8})">${sheet().p(c.cut([[-14, 0], [14, -1], [15, 18], [-15, 19]], 0.3, 4), C.cream).out()}<text x="0" y="14" text-anchor="middle" font-family="${FONT}" font-size="14" font-style="italic" fill="${C.ink}">${label}</text></g>` : '';
  return {
    defs: `<defs><clipPath id="${id}"><path d="${c.poly(oval)}"/></clipPath></defs>`,
    front: front + bust,
    back: back + cand,
    label: lab,
  };
}
/** a light bridge (an arc of warm light) from (0,0) to (w,0), origin left end */
export function lightArc(c, w = 200, h = 70) {
  return `<path d="${c.ribbon(c.qbez([0, 0], [w / 2, -h * 2], [w, 0], 26), (t) => 3 + Math.sin(t * PI) * 5)}" fill="#fff0c0"/><path d="${c.ribbon(c.qbez([0, 0], [w / 2, -h * 2], [w, 0], 26), (t) => 1 + Math.sin(t * PI) * 2)}" fill="#fffaf0"/>`;
}
/** a ring (for marriage), origin centre */
export function ring(c, r = 12) {
  return sheet().p(c.ribbon(c.arc(0, 0, r, r, 0, PI * 2, 24), 3.4), C.sun).p(c.cut(c.star(0, -r - 3, 4, 2, 4, 0), 0.2, 2), C.skyVeil).out();
}
/** a bandage wrapped round a head (head coords) */
export function headBandage(c) {
  return sheet().p(c.ribbon([[-19, -4], [-4, -10], [12, -12], [19, -9]], 7), C.linen).p(c.cut(c.blob(-19, -3, 5, 4, 8, 0.2), 0.3, 3), C.linen2).x(c.ribbon([[-20, -2], [-30, 8]], 3.4) + c.ribbon([[-20, -2], [-27, 12]], 3), C.linen2).out();
}
/** a long trailing train of robe for the vain scribe (body coords; draw behind feet) */
export function robeTrain(c, len = 140, col = C.plumRobe) {
  return sheet().p(c.cut([[-26, -60], [-20, -4], [-len, 4], [-len - 10, -4], [-len + 20, -14], [-40, -30]], 0.8, 8), shade(col, -0.08)).x(c.ribbon([[-40, -14], [-len + 10, -2]], 2), shade(col, 0.2), 'opacity=".6"').out();
}
/** a little hanging picture frame (vignette) with markup inside; origin: top centre */
export function vignette(c, id, inner, { w = 220, h = 150, frame = C.wood3, bg = C.parchment } = {}) {
  const s = sheet().p(c.cut(c.rect(-w / 2 - 10, 0, w + 20, h + 20), 0.5, 8), frame).p(c.cut(c.rect(-w / 2, 10, w, h), 0.4, 8), bg);
  return `<defs><clipPath id="${id}"><rect x="${-w / 2}" y="10" width="${w}" height="${h}"/></clipPath></defs>${s.out()}<g clip-path="url(#${id})">${inner}</g>`;
}
export { paperLabel, tr, sheet, shade, mix, pose, hang, makeCutter, crown8 };

/* ====================================================================== */
/* the vineyard set                                                       */
/* ====================================================================== */
export const VY = { G: 662, BACKROW: 600, FRONTROW: 708, WALL_B: 588, WALL_F: 740, GATE0: 1040, GATE1: 1112, TOWER: 490, PRESS: 884, ABROAD: [1060, 236] };
export const VINE_DAY = ['#c7ddd6', '#ece6c8', '#f6ead0'];
export const VINE_DUSK = ['#8f6d8a', '#e59a7a', '#f4c890'];
export const VINE_NIGHT = ['#4a4468', '#9a6f82', '#d69a7e'];
/**
 * The vineyard of the parable, as layers (sky → hills → sea → back wall, tower, back vines).
 * People go in layers added after this call; then call .front() for the front vines, press, wall and gate.
 * grown: everything already built (the second scene).
 */
export function vineyardSet(S, { skyCols = VINE_DAY } = {}) {
  const c = makeCutter('m12-vineyard-set');
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 40), { x: 470, y: 170, len: 700 });
  const cl1 = hanging(hangL, cloud(c, 170), { x: 700, y: 130, len: 600 });
  const cl2 = hanging(hangL, cloud(c, 120), { x: 930, y: 200, len: 700 });
  // the land far away, on two strings (where the owner goes)
  const plateOwner = person(c, { ...LOOK.owner, k: 'plateOwner' });
  const plateSon = person(c, { ...LOOK.son, k: 'plateSon' });
  const pid = S.id('abroad');
  const plateInner = `<g>${abroadPlate(c, 84, pid)}<g clip-path="url(#${pid})"><g transform="translate(-6 56) scale(.44)">${plateSon}</g><g transform="translate(-30 60) scale(.46)">${plateOwner}</g></g></g>`;
  const plateL = S.layer({ par: 0.08, sh: 5 });
  const plateEl = plateL.add(`<g>${hangTwo(plateInner, 60, 500)}</g>`);
  const pOwner = S.puppet(plateEl.querySelector('[data-k="plateOwner"]'));
  const pSon = S.puppet(plateEl.querySelector('[data-k="plateSon"]'));

  const far = S.layer({ par: 0.1, sh: 2 });
  far.add(band(c, { y: 408, amps: [26, 10, 3], lens: [900, 300, 120], x0: -900, x1: 760, color: C.hillFar }).markup);
  far.add(sheet().p(c.ridge(c.wave(432, [1.5, 0.6], [300, 90]), -900, 2500, 1700, 14, 0.5), mix(C.lake, C.skyBlue2, 0.4)).out());
  let glints = '';
  for (let i = 0; i < 14; i++) { const x = c.rr(700, 2000), y = c.rr(440, 470); glints += c.cut([[x, y], [x + 14, y - 1.4], [x + 28, y], [x + 14, y + 0.8]], 0.2, 6); }
  far.add(`<path d="${glints}" fill="${C.foam}" opacity=".6"/>`);
  const shipEl = far.add(`<g>${farShip(c)}</g>`);

  const mid = S.layer({ par: 0.18, sh: 3 });
  const m = band(c, { y: 486, amps: [16, 7, 3], lens: [800, 300, 110], color: C.hillMid });
  mid.add(m.markup);
  mid.add(olive(c, 300, m.fn(300) + 14, 0.6) + olive(c, 1300, m.fn(1300) + 14, 0.7) + cypress(c, 1400, m.fn(1400) + 10, 120) + cypress(c, 200, m.fn(200) + 10, 100));

  const ground = S.layer({ par: 0.3, sh: 3 });
  const gfn = c.wave(548, [6, 2.5], [700, 200]);
  ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.35)).out());
  // furrows between the rows
  let fur = '';
  for (let i = 0; i < 5; i++) { const y = 580 + i * 34; fur += c.ribbon([[-900, y], [2500, y + c.rr(-2, 2)]], 3); }
  ground.add(`<path d="${fur}" fill="${shade(C.hillNear, -0.1)}" opacity=".45"/>`);
  // the road coming in from the right
  ground.add(sheet().p(c.cut([[VY.GATE0 + 10, VY.G + 34], [VY.GATE0 + 30, VY.G - 14], [2500, VY.G - 34], [2500, VY.G + 56]], 1, 12), mix(C.sand, C.sand2, 0.4)).out());

  // back wall in pieces (they rise when the owner builds), then the tower, then the back row of vines
  const backL = S.layer({ par: 0.4, sh: 4 });
  const wallB = [];
  for (let x = 420; x < 1200; x += 130) wallB.push({ el: backL.add(`<g>${stoneWall(c, 132, 34)}</g>`), x, y: VY.WALL_B });
  const tower = towerParts(c, 90, 236).map((mk) => backL.add(`<g>${mk}</g>`));
  const backRow = [];
  for (let x = 590; x <= 1010; x += 70) backRow.push({ x, y: VY.BACKROW, el: backL.add(`<g>${vineStock(c, 96)}</g>`), row: 0 });
  const gateBack = backL.add(`<g>${gatePost(c, 150)}</g>`);
  const grapesB = backRow.map((v, i) => [-18, 16].map((dx, j) => ({ el: backL.add(`<g>${grapeBunch(c, 3.8)}</g>`), x: v.x + dx, y: v.y - 66 + j * 4, i: i * 2 + j })) ).flat();

  return {
    c, sk, hangL, sunEl, cl1, cl2, plateEl, pOwner, pSon, shipEl, wallB, tower, backRow, grapesB, gateBack,
    front() {
      const fr = S.layer({ par: 0.55, sh: 5 });
      const frontRow = [];
      for (let x = 420; x <= 780; x += 72) frontRow.push({ x, y: VY.FRONTROW, el: fr.add(`<g>${vineStock(c, 104)}</g>`), row: 1 });
      const grapesF = frontRow.map((v, i) => [-20, 14].map((dx, j) => ({ el: fr.add(`<g>${grapeBunch(c, 4.4)}</g>`), x: v.x + dx, y: v.y - 72 + j * 5, i: 20 + i * 2 + j }))).flat();
      const press = fr.add(`<g>${winepress(c)}</g>`);
      const wallF = [];
      for (let x = 250; x < VY.GATE0; x += 132) wallF.push({ el: fr.add(`<g>${stoneWall(c, Math.min(134, VY.GATE0 - x + 2), 34)}</g>`), x, y: VY.WALL_F });
      wallF.push({ el: fr.add(`<g>${stoneWall(c, 150, 34)}</g>`), x: VY.GATE1 + 6, y: VY.WALL_F });
      const gateFront = fr.add(`<g>${gatePost(c, 160)}</g>`);
      const lintel = fr.add(`<g>${sheet().p(c.cut([[-6, 0], [VY.GATE1 - VY.GATE0 + 18, -4], [VY.GATE1 - VY.GATE0 + 16, 10], [-4, 12]], 0.4, 6), C.wood2).out()}</g>`);
      const fg = S.layer({ par: 0.85, sh: 6 });
      fg.add(bushCut(c, 170, 860, 230) + bushCut(c, 1460, 870, 250));
      return { frontRow, grapesF, press, wallF, gateFront, lintel, fg };
    },
    update(t, time, { sunX = 470, sunY = 170 } = {}) {
      swing(sunEl, sunX, sunY, time, 1, 0.7);
      swing(cl1, 700 + Math.sin(time * 0.1) * 20, 130, time, 1.2, 0.6, 1);
      swing(cl2, 930 + Math.sin(time * 0.13 + 2) * 20, 200, time, 1.2, 0.8, 2);
    },
  };
}
function hangTwo(inner, half, len = 400) {
  return `<g class="hang"><path d="M${-half} ${-len - 1400}V-40M${half} ${-len - 1400}V-40" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${inner}</g></g>`;
}
/** a gate post (square stone pillar with a cap); origin: base centre */
export function gatePost(c, h = 150) {
  const col = mix(C.rock, C.stone2, 0.4);
  return sheet().p(c.cut([[-13, 0], [-12, -h], [12, -h], [13, 0]], 0.5, 7), col).p(c.cut(c.rect(-17, -h - 10, 34, 12), 0.3, 5), shade(col, 0.15)).x(ashlar(c, -11, 11, -h + 6, -2, 18), shade(col, -0.2), 'opacity=".6"').out();
}
function bushCut(c, x, y, w) {
  const s = sheet();
  s.p(c.cut(c.blob(x - w * 0.2, y - w * 0.3, w * 0.45, w * 0.32, 12, 0.2), 0.8, 6), C.moss);
  s.p(c.cut(c.blob(x + w * 0.1, y - w * 0.22, w * 0.5, w * 0.3, 12, 0.2), 0.8, 6), C.sage);
  return s.out();
}

/* ---------- tools of the vineyard ---------- */
/** a spade / hoe held in the front hand (origin: grip) */
export function hoe(c) {
  return sheet().p(c.ribbon([[0, -40], [2, 70]], 4), C.wood3).p(c.cut([[-12, 66], [14, 64], [12, 86], [-10, 86]], 0.3, 4), mix(C.stone2, C.rock3, 0.4)).out();
}
/** a key of the vineyard (origin: its bow) */
export function bigKey(c) {
  return sheet().p(c.ribbon(c.arc(0, 0, 9, 9, 0, PI * 2, 14), 4) + c.ribbon([[9, 0], [44, 0]], 4.4) + c.cut(c.rect(34, 0, 5, 10), 0.2, 3) + c.cut(c.rect(26, 0, 4, 8), 0.2, 3), C.sun).out();
}
/** a harvest basket (origin: its handle top) */
export function basketCut(c, { full = false } = {}) {
  const s = sheet();
  s.p(c.ribbon(c.arc(0, 14, 16, 16, PI, 2 * PI, 10), 2.6), C.wood2);
  if (full) { let g = ''; for (let i = 0; i < 7; i++) g += c.cut(c.circ(-12 + i * 4, 12 - (i % 2) * 5, 4.4, 8), 0.1, 2); s.p(g, shade(C.plumRobe, -0.1)); }
  s.p(c.cut([[-20, 14], [20, 14], [15, 36], [-15, 36]], 0.4, 5), C.basket);
  s.x(c.ribbon([[-18, 22], [18, 22]], 1.6) + c.ribbon([[-16, 30], [16, 30]], 1.6), shade(C.basket, -0.25), 'opacity=".7"');
  return s.out();
}
/** a white cloth laid over someone who has fallen (origin: centre of its bottom edge) */
export function clothCover(c, w = 130) {
  const s = sheet();
  const pts = [[-w / 2, 0], [-w / 2 + 6, -18], [-w * 0.3, -26], [-w * 0.05, -36], [w * 0.2, -32], [w * 0.42, -22], [w / 2, 0]];
  s.p(c.cut(pts, 0.8, 6), C.linen);
  s.x(c.ribbon([[-w * 0.3, -20], [w * 0.3, -18]], 1.4) + c.ribbon([[-w * 0.2, -10], [w * 0.4, -8]], 1.4), shade(C.linen, -0.12), 'opacity=".7"');
  return s.out();
}
/** a small starburst (a blow, shown the paper-theatre way); origin centre */
export function burst(c, r = 22, col = C.cream) {
  return sheet().p(c.cut(c.star(0, 0, r, r * 0.45, 9, 0.2), 0.3, 3), col).x(c.poly(c.star(0, 0, r * 0.5, r * 0.22, 7, 0.5)), C.sun).out();
}

/** a puppet with brows that can frown or grieve: p.mood({ angry, sad, tear }) (0..1) */
export function moodPuppet(S, L, c, o) {
  const el = L.add(withFace3(person(c, o), faceBits3(c)));
  const p = S.puppet(el);
  const parts = { angry: el.querySelector('[data-part="angry"]'), sad: el.querySelector('[data-part="sad"]'), tear: el.querySelector('[data-part="tear"]') };
  p.mood = ({ angry = 0, sad = 0, tear = 0 } = {}) => { fade(parts.angry, angry); fade(parts.sad, sad); fade(parts.tear, tear); };
  return p;
}
/** a white cloth lowered on a string over one who has fallen (a draped mound); origin: bottom centre */
export function drapeCloth(c, w = 120, h = 96) {
  const s = sheet();
  const pts = [[-w / 2, 0], [-w / 2 + 8, -h * 0.35], [-w * 0.3, -h * 0.8], [-w * 0.08, -h], [w * 0.12, -h * 0.98], [w * 0.32, -h * 0.72], [w / 2 - 6, -h * 0.3], [w / 2, 0]];
  s.p(c.cut(pts, 0.8, 6), C.linen);
  s.x(c.ribbon(c.qbez([-w * 0.28, -h * 0.7], [-w * 0.2, -h * 0.3], [-w * 0.3, -4], 8), 2) + c.ribbon(c.qbez([w * 0.18, -h * 0.8], [w * 0.1, -h * 0.4], [w * 0.2, -4], 8), 2), shade(C.linen, -0.14), 'opacity=".8"');
  return `<path d="M0 ${-h - 1400}V${-h + 2}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}`;
}
