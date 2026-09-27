// John 7 — shared cut-outs: the Feast of Tabernacles (booths of leafy branches, the lulav and the etrog,
// festive lanterns and the great golden lampstands of the Temple), Galilee and the family courtyard,
// the Temple court decked for the feast, the water-libation (golden pitcher, the altar, willows),
// living water, maps (Galilee–Bethlehem, the Dispersion), the hourglass, officers of the Temple guard.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, town, house, cypress, olive, palm, sun, cloud, grass, flowers, stars, moon } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { fade } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';

export { kf, moving, hand, headAt, addToHead, addToBody, speech, thought, GLYPH, spark, heart, scrap, dust, lantern, garland, candle, scrollOpen, scrollRolled, cup, wordSlip, turban } from '../mark2/lib.js';
export { nameTag, bubble, strip, question, withFace, faceBits, pharisee, man, woman, shadowPerson, silhouette, tornPair, stoneHeart, sparkle } from '../mark3/lib.js';
export { voiceRings, hang2, hourglassParts, dove, flapWings, signpost } from '../mark1/lib.js';
export { glory, soulLight, globe, bigQuestion, say, tag, heavenPanel, lightCrown } from '../mark8/lib.js';
export { storyFrame, SEPIA, crown, workbench } from '../mark6/lib.js';
export { jerusalem, cityWall, frond } from '../mark11/lib.js';
export { templeCourt, COURT, altar, puff, maskOnStick } from '../mark12/lib.js';
export { chamber, table, highPriest, priest, scribe as councilScribe, lampGlow, hangingLamp, DUSK, seal } from '../mark14/lib.js';
export { signBadge, heartWindow, openWindow, bigBalance, iconBubble, roadDashes } from '../john2/lib.js';
export { nicodemus, NICO, roundel, word, bang, beamGrad, lightBeam, vpose, hangAt, leaf } from '../john3/lib.js';
export { JESUS_HOODED, goldWord, glowDisc, rayBurst } from '../john1/lib.js';
export { tr, sky, hanging, swing, pose, lerp, sheet, shade, mix, C, CAST, person, crowdPerson };
import { LOOK as L2, along as along2 } from '../john2/lib.js';
import { pharisee as ph3, man as man3, woman as woman3 } from '../mark3/lib.js';
import { templeCourt } from '../mark12/lib.js';
import { lantern, garland, addToHead } from '../mark2/lib.js';
import { frond, sanctuary as sanct11 } from '../mark11/lib.js';
export const along = along2;

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const INK = '#3b2a22';
export const DY = { stand: 0, kneel: 46, sit: 62 };
export const JESUS = CAST.jesus;

/* ================================================================== the cast */

/** Jesus' brothers — the same looks as in Nazareth (Mk 6) and at Cana (J 2) */
export const BROS = [L2.bJames, L2.bJoses, L2.bSimon, L2.bJudas];
export const MARY = L2.mary;
/** the disciples who walk with Him in Galilee */
export const DISC = [CAST.peter, CAST.andrew, CAST.john, CAST.james, L2.philip];
/** Pharisees (mark3 look) */
export const PH = (c, i = 0) => ph3(c, i);
/** a man / a woman of the crowd */
export const townMan = (c, extra = {}) => man3(c, extra);
export const townWoman = (c, extra = {}) => woman3(c, extra);
/** an officer of the Temple guard: a plain tunic, a leather belt, a head cloth with a red band */
export function officerOpts(i = 0, extra = {}) {
  return {
    robe: [mix(C.dustyBlue, C.stone2, 0.35), mix(C.tealRobe, C.stone2, 0.3), mix(C.clay, C.stone2, 0.45), mix(C.sageRobe, C.stone2, 0.35)][i % 4],
    mantle: i % 2 ? null : shade(C.leather, 0.2), belt: C.leather, skin: [C.skin3, C.skin2, C.skin4, C.skin3][i % 4], hair: C.hair3,
    hairStyle: 'wrap', veil: C.stone, veil2: shade(C.terracotta, -0.05), beard: ['short', 'full', 'short', 'none'][i % 4], ...extra,
  };
}
/** a spear, grip at the origin, point straight up (rotate it by hand) */
export function spear(c, len = 250) {
  const s = sheet();
  s.p(c.ribbon([[0, len * 0.22], [0, -len * 0.78]], 3.6), C.wood2);
  s.p(c.poly([[-5.5, -len * 0.78], [0, -len * 0.78 - 26], [5.5, -len * 0.78]]), C.rock3);
  s.p(c.cut(c.rect(-4, -len * 0.78 + 2, 8, 6), 0.2, 3), C.leather);
  return s.out();
}
/** a pilgrim holding the lulav (and, in the back hand, the etrog) */
export function pilgrim(c, i = 0, { lulavA = 70, etrog = true, woman = null } = {}) {
  const w = woman === null ? i % 3 === 1 : woman;
  const o = w ? woman3(c) : man3(c);
  return person(c, { ...o, holdF: lulav(c, lulavA), holdB: etrog ? etrogHeld(c) : '' });
}

/* ================================================================== the feast */

/**
 * the lulav — a palm shoot bound with myrtle and willow — held in the front hand, drawn so that it stands
 * upright when the arm is raised `a` degrees (hold coords)
 */
export function lulav(c, a = 70, len = 150) {
  return `<g transform="rotate(${a.toFixed(1)})">${lulavUp(c, len)}</g>`;
}
/** the lulav standing up from its grip at (0,0) — palm spine to (0,-len), myrtle and willow bound at the base */
export function lulavUp(c, len = 150) {
  const s = sheet();
  // the palm shoot: a tall closed frond
  s.p(c.cut([[-4, 10], [-6, -len * 0.3], [-4, -len * 0.75], [0, -len], [4, -len * 0.75], [6, -len * 0.3], [4, 10]], 0.3, 6), C.moss);
  s.x(c.ribbon([[0, 6], [0, -len * 0.96]], 1.2), shade(C.moss, 0.3), 'opacity=".7"');
  // willow: two long narrow leaves on the left
  let wl = '';
  [[-12, -len * 0.42, -0.25], [-8, -len * 0.5, -0.1]].forEach(([x, y, a]) => { wl += c.cut(c.ell(x, y, 3.2, len * 0.2, 10, a), 0.2, 4); });
  s.p(wl, C.sage);
  // myrtle: little round leaves in tiers on the right
  let my = '';
  for (let i = 0; i < 9; i++) { const y = -8 - i * 7, x = 9 + (i % 2) * 3; my += c.cut(c.ell(x, y, 4, 2.6, 8, 0.5), 0.1, 2) + c.cut(c.ell(x + 5, y - 3, 3.4, 2.2, 8, -0.4), 0.1, 2); }
  s.p(my, C.moss2);
  // the woven holder
  s.p(c.cut(c.rect(-7, -16, 14, 18), 0.2, 3), C.wheat2);
  s.x(c.ribbon([[-7, -10], [7, -12]], 1.4) + c.ribbon([[-7, -3], [7, -5]], 1.4), shade(C.wheat2, -0.25), 'opacity=".7"');
  return s.out();
}
/** the etrog, a yellow citron, held in the back hand (hold coords) */
export function etrogHeld(c) { return `<g transform="translate(2 6)">${etrog(c, 9)}</g>`; }
export function etrog(c, r = 9) {
  return sheet().p(c.cut([[-r, 0], [-r * 0.8, -r * 0.8], [0, -r * 1.05], [r * 0.9, -r * 0.7], [r * 1.25, 0], [r * 0.9, r * 0.7], [0, r * 1.05], [-r * 0.8, r * 0.8]], 0.2, 3), mix(C.sun, C.wheat, 0.5))
    .x(c.poly(c.circ(r * 1.28, 0, 1.6, 6)), C.moss2).x(c.poly(c.ell(-r * 0.3, -r * 0.4, r * 0.3, r * 0.18, 8, -0.4)), '#fff4d2', 'opacity=".6"').out();
}
/** a pomegranate (origin centre) */
export function pomegranate(c, r = 9) {
  return sheet().p(c.cut(c.circ(0, 0, r, 14), 0.2, 3), shade(C.terracotta, -0.05)).p(c.cut([[-3, -r + 1], [-4, -r - 5], [0, -r - 2], [4, -r - 5], [3, -r + 1]], 0.2, 2), shade(C.terracotta, -0.3)).x(c.poly(c.ell(-r * 0.35, -r * 0.35, r * 0.28, r * 0.16, 8, -0.6)), C.blush, 'opacity=".7"').out();
}
/**
 * a sukkah — a booth of poles roofed with leafy branches, cloth walls, fruit hung from the roof; origin: ground centre.
 * front: draw the front poles and the hanging fruit (on by default).
 */
export function sukkah(c, { w = 200, h = 170, cloth = C.cream, stripe = C.terracotta, lamp = false, walls = true, fruit = true } = {}) {
  const s = sheet();
  const x0 = -w / 2, x1 = w / 2, top = -h;
  // back cloth wall (in the shade) and side panels
  if (walls) {
    s.p(c.cut([[x0 + 6, 0], [x0 + 8, top + 10], [x1 - 8, top + 10], [x1 - 6, 0]], 0.5, 8), shade(cloth, -0.16));
    let st = '';
    for (let x = x0 + 18; x < x1 - 10; x += 26) st += c.cut(c.rect(x, top + 12, 9, h - 12), 0.3, 6);
    s.x(st, shade(stripe, -0.1), 'opacity=".5"');
    // the side curtain, tied back
    s.p(c.cut([[x0, top + 6], [x0 + 40, top + 6], [x0 + 16, top + 70], [x0 + 12, 0], [x0 - 2, 0]], 0.5, 6), cloth);
    s.x(c.ribbon([[x0 + 4, top + 74], [x0 + 22, top + 70]], 3), stripe);
  }
  // poles
  s.p(c.cut(c.rect(x0 - 3, top, 7, h + 2), 0.2, 6) + c.cut(c.rect(x1 - 4, top, 7, h + 2), 0.2, 6), C.wood2);
  s.p(c.cut(c.rect(x0 - 10, top - 4, w + 20, 7), 0.3, 8), C.wood);
  // the roof of branches (s'chach): palm fronds laid across, leaves hanging over the edges
  let fr = '', fr2 = '', lv = '';
  for (let i = 0; i < 7; i++) {
    const x = lerp(x0 - 16, x1 + 16, i / 6) + c.rr(-8, 8);
    const pts = c.qbez([x - 40, top - 2], [x, top - 24 - c.rr(0, 10)], [x + 44, top + 2], 10);
    const leafy = c.ribbon(pts, (u) => 4 + Math.sin(u * PI) * 12, 1.4);
    if (i % 2) fr += leafy; else fr2 += leafy;
  }
  for (let i = 0; i < 16; i++) { const x = c.rr(x0 - 10, x1 + 10); lv += c.cut(c.ell(x, top + c.rr(2, 16), 4, 12, 8, c.rr(-0.5, 0.5)), 0.3, 3); }
  s.p(fr2, C.moss).p(fr, C.leaf).p(lv, C.olive);
  let out = s.out();
  if (fruit) {
    const f = sheet();
    let str = '';
    const spots = [x0 + w * 0.22, x0 + w * 0.46, x0 + w * 0.7, x0 + w * 0.88];
    spots.forEach((x, i) => { const len = 22 + (i % 2) * 14; str += c.ribbon([[x, top + 4], [x, top + 4 + len]], 1); });
    f.x(str, C.inkSoft, 'opacity=".5"');
    out += f.out();
    spots.forEach((x, i) => {
      const len = 22 + (i % 2) * 14, y = top + 4 + len + 8;
      out += `<g transform="translate(${x.toFixed(1)} ${y})">${i % 2 ? etrog(c, 7) : pomegranate(c, 8)}</g>`;
    });
  }
  if (lamp) out += `<g transform="translate(${(x0 + w * 0.55).toFixed(1)} ${top + 6}) scale(.62)">${lantern(c, { col: C.apricot })}</g>`;
  return out;
}
/** a roof-top booth, smaller and plainer (origin: roof level centre) */
export function roofBooth(c, w = 110, h = 80, col = C.leaf) {
  const s = sheet();
  // a back wall woven of branches, a striped cloth hung on one side
  let lat = '';
  for (let x = -w / 2 + 8; x < w / 2 - 4; x += 9) lat += c.ribbon([[x, 0], [x + c.rr(-2, 2), -h + 6]], 2.2);
  for (let y = -12; y > -h + 8; y -= 16) lat += c.ribbon([[-w / 2 + 4, y], [w / 2 - 4, y + c.rr(-2, 2)]], 2);
  s.p(lat, mix(C.wood3, C.olive, 0.3));
  s.p(c.cut([[w * 0.08, -h + 8], [w / 2 - 6, -h + 8], [w / 2 - 6, 0], [w * 0.2, 0]], 0.4, 6), mix(C.cream, C.stone, 0.2));
  let st = '';
  for (let x = w * 0.14; x < w / 2 - 8; x += 12) st += c.cut(c.rect(x, -h + 10, 5, h - 10), 0.2, 5);
  s.x(st, C.terracotta, 'opacity=".55"');
  s.p(c.cut(c.rect(-w / 2, -h, 5, h), 0.2, 5) + c.cut(c.rect(w / 2 - 5, -h, 5, h), 0.2, 5), C.wood2);
  // the leafy roof, spilling over the edges
  let fr = '', fr2 = '', lv = '';
  for (let i = 0; i < 6; i++) { const x = lerp(-w / 2 - 10, w / 2 + 10, i / 5); const r = c.ribbon(c.qbez([x - 30, -h + 2], [x, -h - 18], [x + 30, -h + 4], 8), (u) => 3 + Math.sin(u * PI) * 9, 1); if (i % 2) fr += r; else fr2 += r; }
  for (let i = 0; i < 10; i++) lv += c.cut(c.ell(c.rr(-w / 2, w / 2), -h + c.rr(2, 12), 3, 9, 8, c.rr(-0.5, 0.5)), 0.2, 3);
  s.p(fr2, shade(col, -0.12)).p(fr, col).p(lv, C.olive);
  return s.out();
}
/**
 * one of the great golden lampstands of the Court of the Women, lit for the feast: a tall shaft,
 * four golden bowls at the top (their flames .fl, their glow .lg), a ladder leaning against it; origin: base.
 */
export function greatLampstand(c, h = 360, { ladder = false } = {}) {
  const s = sheet();
  const g = C.sun, g2 = shade(C.sun, -0.18);
  s.p(c.cut([[-34, 0], [-22, -16], [-8, -22], [-7, -h + 30], [7, -h + 30], [8, -22], [22, -16], [34, 0]], 0.4, 8), g);
  s.x(c.ribbon([[-7, -h * 0.35], [7, -h * 0.35]], 5) + c.ribbon([[-7, -h * 0.62], [7, -h * 0.62]], 5), g2);
  // the crossbar and four bowls
  s.p(c.cut(c.rect(-70, -h + 22, 140, 9), 0.3, 6), g);
  let bowls = '';
  [-62, -22, 22, 62].forEach((x) => { bowls += c.cut([[x - 16, -h + 20], [x + 16, -h + 20], [x + 10, -h + 6], [x - 10, -h + 6]], 0.2, 4); });
  s.p(bowls, g2);
  // a ladder
  const lad = sheet();
  lad.p(c.ribbon([[44, 0], [26, -h + 40]], 4) + c.ribbon([[66, 0], [48, -h + 40]], 4), C.wood2);
  let rungs = '';
  for (let y = -20; y > -h + 50; y -= 26) { const u = -y / h; rungs += c.ribbon([[44 - u * 18, y], [66 - u * 18, y]], 3); }
  lad.p(rungs, C.wood);
  const fl = [-62, -22, 22, 62].map((x) => `M${x} ${-h + 8}C${x - 9} ${-h} ${x - 7} ${-h - 16} ${x} ${-h - 34}C${x + 7} ${-h - 16} ${x + 9} ${-h} ${x} ${-h + 8}Z`).join('');
  const fl2 = [-62, -22, 22, 62].map((x) => `M${x} ${-h + 4}C${x - 4} ${-h} ${x - 3} ${-h - 8} ${x} ${-h - 18}C${x + 3} ${-h - 8} ${x + 4} ${-h} ${x} ${-h + 4}Z`).join('');
  return {
    stand: (ladder ? lad.out() : '') + s.out(),
    flames: `<g class="lg"><circle cx="0" cy="${-h}" r="190" fill="url(#warm-glow)"/></g><g class="fl"><path d="${fl}" fill="${C.lampFlame}"/><path d="${fl2}" fill="#fff4d2"/></g>`,
    h,
  };
}
/** a golden pitcher for the water-drawing (hold coords: handle in the hand, spout forward-down) */
export function goldPitcher(c, { k } = {}) {
  const s = sheet();
  s.p(c.cut([[-14, 0], [-18, -14], [-16, -30], [-9, -38], [-9, -46], [9, -46], [9, -38], [16, -30], [18, -14], [14, 0]], 0.3, 4), C.sun);
  s.p(c.cut([[9, -40], [24, -50], [28, -46], [14, -34]], 0.2, 3), C.sun);
  s.p(c.ribbon(c.arc(-16, -24, 9, 12, PI * 0.5, PI * 1.5, 8), 3.4), shade(C.sun, -0.15));
  s.x(c.ribbon([[-15, -20], [15, -20]], 2) + c.ribbon([[-13, -8], [13, -8]], 1.6), shade(C.sun, -0.25), 'opacity=".7"');
  s.x(c.poly(c.ell(-7, -26, 3, 8, 8, 0.2)), '#fff4d2', 'opacity=".6"');
  return `<g${k ? ` data-k="${k}"` : ''}><circle cy="-24" r="46" fill="url(#halo-glow)" opacity=".6"/>${s.out()}</g>`;
}
/** a silver bowl with a spout, set on the altar's corner (origin base) */
export function silverBowl(c, w = 34) {
  return sheet().p(c.cut([[-w / 2, -14], [w / 2, -14], [w * 0.3, 0], [-w * 0.3, 0]], 0.2, 3), mix(C.stone, C.skyBlue2, 0.4)).p(c.cut(c.ell(0, -14, w / 2, 3.4, 12), 0.2, 3), mix(C.lake, C.skyBlue2, 0.3)).out();
}
/** a willow branch (aravah) leaning, from its foot upward (origin foot) */
export function willow(c, h = 240, lean = 0.1) {
  const s = sheet();
  const spine = c.qbez([0, 0], [h * lean * 0.3, -h * 0.5], [h * lean, -h], 12);
  s.p(c.ribbon(spine, (u) => 4 - u * 2.6), C.wood2);
  let lv = '', lv2 = '';
  spine.forEach(([x, y], i) => {
    if (i < 3) return;
    const d = i % 2 ? 1 : -1;
    const l = c.cut(c.ell(x + d * 10, y + 10, 3.2, 16, 10, d * 0.35), 0.2, 3);
    if (i % 3) lv += l; else lv2 += l;
  });
  s.p(lv, C.sage).p(lv2, C.sage2);
  return s.out();
}
/** a shofar held to the lips (hold coords, forward arm raised ~100) */
export function shofar(c) {
  return sheet().p(c.cut([[-3, -6], [4, -8], [12, 20], [26, 40], [40, 46], [44, 36], [30, 30], [16, 12], [6, -8]].map(([x, y]) => [x, y]), 0.3, 4), mix(C.wheat, C.wood3, 0.4)).out();
}

/* ================================================================== time */

/**
 * an hourglass rig (add to a layer): returns { el, set(level, flow, o) } — level 1 = all sand on top.
 * origin centre.
 */
export function hourglassRig(L, c, h = 130) {
  const w = h * 0.52, s = sheet();
  const glass = [[-w * 0.4, -h / 2 + 8], [w * 0.4, -h / 2 + 8], [4, -2], [w * 0.4, h / 2 - 8], [-w * 0.4, h / 2 - 8], [-4, -2]];
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, 10), 0.3, 6) + c.cut(c.rect(-w / 2, h / 2 - 10, w, 10), 0.3, 6), C.wood2);
  s.p(c.cut(c.rect(-w / 2 + 3, -h / 2 + 8, 5, h - 16), 0.2, 6) + c.cut(c.rect(w / 2 - 8, -h / 2 + 8, 5, h - 16), 0.2, 6), C.wood);
  const sand = shade(C.wheat2, -0.05);
  const top = `<g class="hgT"><path d="${c.poly([[-w * 0.36, -h / 2 + 12], [w * 0.36, -h / 2 + 12], [2, -4], [-2, -4]])}" fill="${sand}"/></g>`;
  const bottom = `<g class="hgB"><path d="${c.poly([[-w * 0.38, 0], [w * 0.38, 0], [w * 0.12, -h * 0.34], [-w * 0.12, -h * 0.34]])}" fill="${sand}"/></g>`;
  const stream = `<g class="hgS"><path d="M-1.4 -4H1.4V${h / 2 - 12}H-1.4Z" fill="${shade(sand, -0.15)}"/></g>`;
  const glassM = `<path d="${c.poly(glass)}" fill="#f4f7f1" opacity=".85"/><path d="${c.ribbon([[-w * 0.3, -h / 2 + 16], [-6, -8]], 3)}" fill="#fff" opacity=".6"/>`;
  const el = L.add(`<g><circle r="${h * 0.9}" fill="url(#halo-glow)" opacity=".45"/>${glassM}${top}<g transform="translate(0 ${h / 2 - 10})">${bottom}</g>${stream}${s.out()}</g>`);
  const T = el.querySelector('.hgT'), B = el.querySelector('.hgB'), St = el.querySelector('.hgS');
  return {
    el,
    set(level, flow = 1) {
      // the top cone empties towards its tip (scale about the neck), the bottom mound grows from the floor
      pose(T, { x: 0, y: -4, sx: Math.max(0.02, level), sy: Math.max(0.02, level), ox: 0, oy: -4 });
      pose(B, { sy: Math.max(0.02, 1 - level) });
      fade(St, flow);
    },
  };
}

/* ================================================================== sets */

export const GAL = ['#d1e1d8', '#efe6cb', '#f6e6c9'];          // a clear autumn day in Galilee
export const FEAST = ['#d3e0d6', '#f1e4c4', '#f7e3bd'];        // golden festival light
export const GREAT = ['#cfe2dc', '#f0e8cc', '#f8ecd2'];        // the bright last day
export const DUSKY = ['#5b5a8c', '#b58a9b', '#e7ae93'];

/**
 * Galilee: green hills, the lake far right, villages, a road across the near ground.
 * Returns { sk, hangL, sunEl, clouds, actL, fgL, gfn, update(t, time) }.
 */
export function galileeSet(S, { skyCols = GAL, sunAt = [1200, 160], groundY = 650, act = 0.5, fg = true, road = true } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cls = [[470, 150, 190], [990, 240, 130]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 600 }), x, y, i }));
  const farL = S.layer({ par: 0.1, sh: 2 });
  farL.add(band(c, { y: 440, amps: [22, 9, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.sage3, 0.35) }).markup);
  const lakeL = S.layer({ par: 0.16, sh: 2 });
  lakeL.add(sheet().p(c.cut([[1100, 500], [1260, 486], [1700, 480], [2600, 486], [2600, 540], [1060, 536]], 1, 10), C.lake).x(c.ribbon([[1160, 506], [1300, 504]], 2) + c.ribbon([[1340, 514], [1500, 512]], 2), C.foam, 'opacity=".7"').out());
  const midL = S.layer({ par: 0.22, sh: 3 });
  const h2 = hillsWith(c, { y: 540, amps: [18, 8, 3], lens: [900, 300, 110], color: mix(C.hillMid, C.hillNear, 0.45), trees: 40, treeColor: C.moss, treeH: 24, houses: 5, houseColor: C.plaster, x0: -900, x1: 2500 });
  midL.add(h2.markup);
  midL.add(town(c, { x: 330, y: h2.fn(330) + 10, n: 7, spread: 300, sc: 0.55 }));
  const groundL = S.layer({ par: 0.4, sh: 3 });
  const gfn = c.wave(groundY, [6, 2], [600, 150]);
  const gs = sheet();
  gs.p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.sand, 0.35));
  if (road) gs.p(c.ribbon([[-900, groundY + 110], [200, groundY + 88], [600, groundY + 74], [1000, groundY + 70], [1400, groundY + 80], [2500, groundY + 110]], 120), mix(C.sand2, C.dune, 0.25));
  groundL.add(gs.out());
  groundL.add(grass(c, { x0: -600, x1: 2200, y: groundY, fn: gfn, n: 44, h: 14, color: C.olive }) + flowers(c, { x0: -600, x1: 2200, y: groundY, fn: gfn, n: 22, h: 18 }));
  groundL.add(olive(c, 250, gfn(250) + 8, 0.9) + olive(c, 1440, gfn(1440) + 8, 0.8) + cypress(c, 360, gfn(360) + 6, 120) + cypress(c, 1330, gfn(1330) + 6, 100));
  const actL = S.layer({ par: act, sh: 5 });
  let fgL = null;
  if (fg) {
    fgL = S.layer({ par: 0.95, sh: 6 });
    const fgf = c.wave(990, [8, 4], [500, 150]);
    fgL.add(sheet().p(c.ridge(fgf, -1400, 3000, 1800, 14, 1.4), C.moss2).out());
    fgL.add(grass(c, { x0: -1400, x1: 3000, y: 990, fn: fgf, n: 60, h: 30, color: C.moss2 }));
  }
  return {
    sk, hangL, sunEl, farL, midL, groundL, actL, fgL, gfn, h2,
    update(t, time, { sunX = sunAt[0], sunY = sunAt[1] } = {}) {
      swing(sunEl, sunX, sunY, time, 1.1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i * 2) * 24, cl.y, time, 1.4, 0.7, cl.i));
    },
  };
}

/**
 * The family's house in Galilee: a courtyard behind a low wall, the house with its outside stairs,
 * a booth going up on the roof, a fig tree, a carpenter's bench. Built on galileeSet.
 * Returns { ...galilee, houseL, boothEl, F }.
 */
export const YARD = { F: 690, HX0: 900, HX1: 1330, ROOF: 470 };
export function yardSet(S, o = {}) {
  const c = S.c;
  const G = galileeSet(S, { groundY: 640, road: false, fg: false, act: 0.5, ...o });
  const { F, HX0, HX1, ROOF } = YARD;
  // (the house sits in its own layer between the ground and the actors)
  const H = S.layer({ par: 0.44, sh: 4 });
  const hs = sheet();
  const wall = mix(C.plaster, C.peach, 0.18), wall2 = mix(C.plaster2, C.peach, 0.2);
  hs.p(c.cut([[HX0, F - 30], [HX0, ROOF], [HX1, ROOF], [HX1, F - 30]], 0.6, 10), wall);
  hs.p(c.cut([[HX1, ROOF + 8], [HX1 + 70, ROOF + 24], [HX1 + 70, F - 26], [HX1, F - 30]], 0.4, 8), wall2);
  hs.p(c.cut([[HX0 - 10, ROOF - 8], [HX1 + 10, ROOF - 8], [HX1 + 10, ROOF + 6], [HX0 - 10, ROOF + 6]], 0.3, 8), C.roof);
  // the doorway, a small window
  hs.p(c.cut([[1080, F - 30], [1080, F - 140], ...c.arc(1110, F - 140, 30, 24, PI, 2 * PI, 8), [1140, F - 30]], 0.3, 5), mix(C.soilDark, C.wood2, 0.4));
  hs.p(c.cut(c.rect(1210, ROOF + 60, 44, 36), 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
  hs.p(c.cut(c.rect(1204, ROOF + 56, 8, 44), 0.2, 4) + c.cut(c.rect(1252, ROOF + 56, 8, 44), 0.2, 4), C.teal2);
  // the outside stairs rising left to right along the wall
  let steps = '';
  for (let i = 0; i < 8; i++) { const u = i / 8, x = lerp(920, 1030, u), y = lerp(F - 34, ROOF + 12, u); steps += c.cut(c.rect(x - 6, y - 4, 34, 8), 0.2, 4); }
  hs.p(c.cut([[912, F - 30], [1030, ROOF + 10], [1060, ROOF + 10], [1060, ROOF + 30], [962, F - 30]], 0.4, 6), wall2);
  hs.p(steps, mix(C.stone, C.plaster2, 0.4));
  H.add(hs.out());
  // the booth on the roof (built during the scene: data-k parts)
  const boothEl = H.add(`<g transform="translate(1190 ${ROOF - 6})">${roofBooth(c, 150, 92)}</g>`);
  // a fig tree over the wall on the left, the courtyard wall, the yard floor
  const Y = S.layer({ par: 0.46, sh: 3 });
  const ys = sheet();
  ys.p(c.cut([[-900, F - 30], [2500, F - 30], [2500, 1700], [-900, 1700]], 0.8, 30), mix(C.sand, C.stone, 0.4));
  let pav = '';
  for (let i = 0; i < 6; i++) pav += c.ribbon([[-900, F - 20 + i * i * 8 + i * 12], [2500, F - 20 + i * i * 8 + i * 12 + c.rr(-2, 2)]], 1.2);
  ys.x(pav, shade(C.sand2, -0.2), 'opacity=".35"');
  Y.add(ys.out());
  // low back wall of the courtyard running left of the house
  const lw = sheet();
  lw.p(c.cut([[-900, F - 30], [-900, F - 120], [HX0 - 4, F - 124], [HX0 - 4, F - 30]], 0.8, 14), mix(C.stone, C.peach, 0.15));
  let st = '';
  for (let y = F - 110; y < F - 36; y += 20) for (let x = -900 + c.rr(0, 30); x < HX0 - 10; x += c.rr(40, 70)) st += c.ribbon([[x, y], [x + c.rr(24, 40), y + c.rr(-1, 1)]], 1.1);
  lw.x(st, shade(C.stone, -0.18), 'opacity=".5"');
  lw.p(c.cut(c.rect(-900, F - 130, HX0 + 896, 10), 0.4, 14), C.stone2);
  H.add(lw.out());
  const fig = sheet();
  fig.p(c.cut([[472, F - 30], [466, F - 130], [440, F - 190], [456, F - 196], [478, F - 150], [500, F - 210], [516, F - 204], [492, F - 130], [490, F - 30]], 0.8, 6), C.wood2);
  let fl = '', fl2 = '';
  for (let i = 0; i < 11; i++) { const bx = 480 + c.rr(-90, 90), by = F - 190 - c.rr(0, 80); const b = c.cut(c.blob(bx, by, c.rr(34, 50), c.rr(24, 34), 12, 0.2), 1, 6); if (i % 2) fl += b; else fl2 += b; }
  fig.p(fl2, C.moss).p(fl, C.leaf);
  let figs = '';
  for (let i = 0; i < 9; i++) figs += c.cut(c.circ(480 + c.rr(-80, 80), F - 200 - c.rr(0, 60), 5, 8), 0.2, 3);
  fig.p(figs, C.plumRobe);
  H.add(fig.out());
  return { ...G, houseL: H, yardL: Y, boothEl, F };
}

/**
 * Jerusalem decked for the feast: the city and the Temple on the hill, a street of houses with booths on
 * their roofs, garlands and lanterns strung across, two booths standing in the street.
 * Returns { sk, hangL, sunEl, moonEl, lamps:[{el, glow, x, y, i}], windows, dusk (layer to fade), actL, F, update }.
 */
export const STREET = { F: 700 };
export function feastStreet(S, { skyCols = FEAST, sunAt = [1220, 150], lampsLit = 0 } = {}) {
  const c = S.c;
  const F = STREET.F;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 42), { x: sunAt[0], y: sunAt[1], len: 700 });
  const moonEl = hanging(hangL, `<circle r="90" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 34)}`, { x: 420, y: 150, len: 700 });
  const cl = hanging(hangL, cloud(c, 170), { x: 560, y: 170, len: 600 });
  // the hills and the city with the Temple above
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 430, amps: [18, 8, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.sage3, 0.3) }).markup);
  const city = S.layer({ par: 0.14, sh: 3 });
  city.add(`<g transform="translate(560 560)">${jerusalemMini(c)}</g>`);
  // the street: two rows of houses, their roofs crowned with booths
  const back = S.layer({ par: 0.3, sh: 4 });
  const bh = sheet();
  const rows = [[-700, 140, 150], [-540, 130, 190], [-390, 150, 160], [-220, 120, 200], [-80, 150, 170], [80, 130, 210], [230, 160, 180], [410, 140, 200], [1200, 150, 210], [1370, 130, 180], [1520, 160, 200], [1700, 140, 170], [1860, 150, 190], [2030, 130, 210]];
  let roofB = '';
  const wins = [];
  rows.forEach(([x, w, h], i) => {
    const wall = [C.plaster, mix(C.plaster, C.peach, 0.25), mix(C.plaster2, C.sand, 0.3)][i % 3];
    bh.p(c.cut([[x, F - 50], [x, F - 50 - h], [x + w, F - 50 - h], [x + w, F - 50]], 0.6, 10), wall);
    bh.p(c.cut(c.rect(x - 4, F - 56 - h, w + 8, 8), 0.3, 6), C.roof);
    bh.p(c.cut([[x + w * 0.2, F - 50], [x + w * 0.2, F - 110], ...c.arc(x + w * 0.2 + 16, F - 110, 16, 14, PI, 2 * PI, 6), [x + w * 0.2 + 32, F - 50]], 0.3, 4), mix(C.soilDark, C.wood2, 0.4));
    const wx = x + w * 0.62, wy = F - 50 - h * 0.62;
    bh.p(c.cut(c.rect(wx, wy, 22, 20), 0.2, 4), mix(C.soilDark, C.wood2, 0.3));
    wins.push([wx + 1, wy + 1]);
    if (i % 2 === 0 || i === 7 || i === 8) roofB += `<g transform="translate(${x + w / 2} ${F - 56 - h})">${roofBooth(c, Math.min(w - 20, 120), 70, i % 3 ? C.leaf : C.moss)}</g>`;
  });
  back.add(bh.out() + roofB);
  let wd = '';
  wins.forEach(([x, y]) => { wd += c.poly(c.rect(x, y, 20, 18)); });
  const windows = back.add(`<path d="${wd}" fill="${C.lampFlame}" opacity="0"/>`);
  // the street paving
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const f = sheet();
  f.p(c.cut([[-900, F - 50], [2500, F - 50], [2500, 1700], [-900, 1700]], 0.8, 30), mix(C.sand, C.stone, 0.45));
  let cob = '';
  for (let i = 0; i < 80; i++) { const x = c.rr(-900, 2500), y = c.rr(F - 40, 1000); cob += c.cut(c.ell(x, y, c.rr(10, 18), c.rr(3, 6), 8), 0.3, 4); }
  f.x(cob, shade(C.sand2, -0.12), 'opacity=".5"');
  floorL.add(f.out());
  // garlands and lanterns strung across the street
  const flyL = S.layer({ par: 0.36, sh: 4 });
  const garl = [[260, 320], [580, 280], [860, 300], [1160, 300]].map(([x, gw], i) => ({ x, i, el: flyL.add(`<g><path d="M0 -1600V0M${gw} -1600V0" stroke="rgba(74,54,34,.45)" stroke-width="1.1" fill="none"/>${garland(c, gw, 40)}</g>`) }));
  const lamps = [330, 470, 640, 820, 980, 1140, 1290].map((x, i) => {
    const el = hanging(flyL, lantern(c, { col: [C.apricot, C.roseRobe, C.wheat][i % 3] }), { x, y: 250, len: 800 });
    return { x, i, el, glow: el.querySelector('.glow'), y: 268 + (i % 2) * 30 };
  });
  // booths standing in the street, framing the stage
  const boothL = S.layer({ par: 0.62, sh: 5 });
  boothL.add(`<g transform="translate(250 ${F + 40})">${sukkah(c, { w: 240, h: 200, cloth: C.cream, stripe: C.terracotta, lamp: true })}</g>`);
  boothL.add(`<g transform="translate(1370 ${F + 44})">${sukkah(c, { w: 250, h: 206, cloth: mix(C.cream, C.skyVeil, 0.5), stripe: C.teal2, lamp: true })}</g>`);
  const actL = S.layer({ par: 0.5, sh: 5 });
  // dusk: a violet veil over the whole street (faded in by the scene)
  const dusk = S.layer({ par: 0.4, sh: 1, flat: true });
  dusk.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night}" opacity=".32"/>`);
  dusk.fade(0);
  return {
    sk, hangL, sunEl, moonEl, cl, lamps, garl, windows, back, floorL, flyL, boothL, actL, dusk, F,
    update(t, time, { lit = lampsLit, sunY = sunAt[1], moonY = -600 } = {}) {
      swing(sunEl, sunAt[0], sunY, time, 1, 0.6);
      swing(moonEl, 420, moonY, time, 1, 0.5, 2);
      swing(cl, 560 + Math.sin(time * 0.1) * 20, 170, time, 1.2, 0.6, 1);
      garl.forEach((g) => pose(g.el, { x: g.x, y: 230, r: Math.sin(time * 0.6 + g.i) * 0.6 }));
      lamps.forEach((l) => {
        pose(l.el, { x: l.x, y: l.y, r: Math.sin(time * 1.1 + l.i) * 2.2 });
        pose(l.glow, { o: lit * (0.8 + Math.sin(time * 3 + l.i) * 0.08) });
      });
      fade(windows, lit * 0.85);
    },
  };
}
/** Jerusalem in miniature on its hill: walls, houses, the Temple gleaming (origin: foot centre, ~ 900 wide) */
export function jerusalemMini(c) {
  const s = sheet();
  s.p(c.cut([[-520, 30], [-480, -60], [-320, -110], [-80, -130], [180, -128], [380, -110], [500, -50], [540, 30]], 1, 12), mix(C.sand2, C.dune, 0.35));
  let hs = '';
  for (let i = 0; i < 26; i++) { const x = c.rr(-470, 470), y = -60 - c.rr(0, 50) + Math.abs(x) * 0.05, w = c.rr(22, 40), h = c.rr(16, 30); if (Math.abs(x - 120) < 110) continue; hs += c.cut(c.rect(x, y - h, w, h + 4), 0.3, 5); }
  s.p(hs, mix(C.plaster, C.sand, 0.2));
  // the Temple platform
  s.p(c.cut(c.rect(10, -150, 220, 90), 0.4, 8), mix(C.stone, C.dawn, 0.25));
  let por = '';
  for (let x = 16; x < 226; x += 12) por += c.cut(c.rect(x, -146, 4, 22), 0.2, 4);
  s.x(por, shade(C.stone, -0.12), 'opacity=".6"');
  // walls
  const w = [[-520, 30], [-520, -12]];
  for (let x = -520; x < 540; x += 18) w.push([x, -12], [x, -20], [x + 9, -20], [x + 9, -12]);
  w.push([540, -12], [540, 30]);
  s.p(c.cut(w, 0.3, 6), mix(C.stone, C.sand, 0.3));
  // smoke of the altar rising
  let sm = '';
  for (let i = 0; i < 4; i++) sm += c.cut(c.blob(70 + i * 6, -250 - i * 30, 10 + i * 4, 8 + i * 3, 9, 0.2), 0.5, 4);
  s.x(sm, '#f1ece2', 'opacity=".7"');
  return `<circle cx="120" cy="-220" r="150" fill="url(#halo-glow)" opacity=".5"/>${s.out()}<g transform="translate(120 -148)">${sanct11(c, 0.62, { glow: false })}</g>`;
}

/**
 * The Temple court decked for the feast (built on Mark 12's court): willow branches leaning against the
 * porch, garlands along it, two great golden lampstands. Call .front() after the actors' layers.
 * Returns { ...templeCourt, deco, stands:[{fl, lg}], F, update(t, time, {lit}) }.
 */
export function feastCourt(S, { skyCols = FEAST, stands = true, willows = true, lit = 0.25 } = {}) {
  const set = templeCourt(S, { skyCols });
  const c = makeCutter(S.id('feast-court'));
  const deco = S.layer({ par: 0.32, sh: 4 });
  const { STYLO, COLTOP } = { STYLO: 590, COLTOP: 398 };
  // garlands swagged between the porch columns
  let sw = '';
  for (let x = -860; x < 2500; x += 156) {
    if (x > 640 && x < 930) continue;
    sw += `<g transform="translate(${x} ${COLTOP + 18})">${garland(c, 156, 26)}</g>`;
  }
  deco.add(sw);
  // willow branches standing against the porch
  if (willows) {
    let wl = '';
    [[410, 0.08], [460, -0.1], [1150, -0.08], [1200, 0.1], [-120, 0.1], [1700, -0.1]].forEach(([x, l]) => { wl += `<g transform="translate(${x} ${STYLO + 20})">${willow(c, 200 + c.rr(-20, 30), l)}</g>`; });
    deco.add(wl);
  }
  const standEls = [];
  if (stands) {
    const LS = S.layer({ par: 0.36, sh: 5 });
    [[330, 300], [1270, 310]].forEach(([x, h]) => {
      const g = greatLampstand(c, h);
      LS.add(`<g transform="translate(${x} ${STYLO + 36})">${g.stand}</g>`);
      const fl = LS.add(`<g transform="translate(${x} ${STYLO + 36})">${g.flames}</g>`);
      standEls.push({ fl: fl.querySelector('.fl'), lg: fl.querySelector('.lg'), x, h });
    });
  }
  return {
    ...set, deco, stands: standEls, F: set.FLOOR,
    update(t, time, { lit: L = lit, sunDY = 0 } = {}) {
      set.update(t, time, { sunDY });
      standEls.forEach((s, i) => {
        const on = L > 0.02 ? Math.min(1, L * 3) : 0;
        if (on) pose(s.fl, { y: -s.h, sy: 1 + Math.sin(time * 8 + i) * 0.05, oy: -s.h, o: on });
        else fade(s.fl, 0);
        fade(s.lg, L * 0.9);
      });
    },
  };
}

/* ================================================================== maps */

/** the land on parchment, north up: Galilee with Nazareth, Judea with Jerusalem and Bethlehem; origin centre */
export const LANDMAP = { w: 560, h: 640, naz: [-40, -190], jer: [10, 150], beth: [-6, 206], lake: [110, -200] };
export function landMap(c) {
  const { w, h } = LANDMAP;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 2, 10), C.parchment);
  s.x(c.ribbon([[-w / 2 + 16, -h / 2 + 16], [w / 2 - 16, -h / 2 + 16], [w / 2 - 16, h / 2 - 16], [-w / 2 + 16, h / 2 - 16], [-w / 2 + 16, -h / 2 + 18]], 2), C.clay, 'opacity=".5"');
  s.p(c.cut([[-w / 2 + 18, -h / 2 + 18], [-190, -h / 2 + 18], [-176, -160], [-200, -40], [-214, 80], [-234, h / 2 - 18], [-w / 2 + 18, h / 2 - 18]], 1.2, 8), mix(C.lake, C.skyBlue, 0.3));
  const gal = [[-176, -h / 2 + 22], [180, -h / 2 + 22], [170, -110], [-196, -100]];
  const jud = [[-212, 60], [170, 50], [190, h / 2 - 22], [-232, h / 2 - 22]];
  s.p(c.cut(gal, 1.2, 10), mix(C.parchment, C.sage2, 0.5));
  s.p(c.cut(jud, 1.2, 10), mix(C.parchment, C.clay, 0.28));
  let hills = '';
  [[-110, -150], [-60, -120], [40, -150], [-100, 0], [-20, 20], [60, -10], [-120, 120], [80, 110], [-80, 250], [60, 250]].forEach(([x, y]) => { hills += c.cut([[x - 16, y + 7], [x, y - 13], [x + 16, y + 7]], 0.5, 5); });
  s.x(hills, shade(C.parchment, -0.18), 'opacity=".7"');
  const [lx, ly] = LANDMAP.lake;
  s.p(c.ribbon([[lx + 6, ly + 34], [lx + 20, ly + 120], [lx + 6, ly + 220], [lx + 24, ly + 330], [lx + 16, ly + 400]], 5), C.lake2);
  s.p(c.cut(c.blob(lx, ly, 26, 38, 12, 0.12), 0.8, 5), C.lake);
  s.p(c.cut(c.blob(lx + 22, ly + 440, 18, 44, 12, 0.12), 0.8, 5), mix(C.lake, C.stone, 0.4));
  const T = (x, y, text, { size = 18, anchor = 'start', col = C.inkSoft } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${col}">${text}</text>`;
  const townD = (x, y, sz = 1) => c.cut(c.rect(x - 7 * sz, y - 5 * sz, 14 * sz, 10 * sz), 0.3, 4) + c.cut([[x - 9 * sz, y - 5 * sz], [x, y - 13 * sz], [x + 9 * sz, y - 5 * sz]], 0.3, 4);
  s.p(townD(...LANDMAP.naz) + townD(...LANDMAP.jer, 1.4) + townD(...LANDMAP.beth), C.clay);
  const labels = T(0, -254, tr('Galilea', 'Galilee'), { size: 34, anchor: 'middle', col: C.terracotta }) + T(-20, 296, tr('Judea', 'Judea'), { size: 32, anchor: 'middle', col: C.terracotta }) +
    T(LANDMAP.naz[0] + 16, LANDMAP.naz[1] + 6, tr('Nazaret', 'Nazareth')) + T(LANDMAP.jer[0] + 20, LANDMAP.jer[1] + 6, tr('Jerozolima', 'Jerusalem')) + T(LANDMAP.beth[0] + 16, LANDMAP.beth[1] + 8, tr('Betlejem', 'Bethlehem'), { size: 22, col: C.ink });
  return s.out() + labels;
}
/** the Mediterranean world on parchment: Judea in the east, the Greek lands, Rome, Egypt; origin centre */
export const WORLD = { w: 760, h: 440, judea: [300, 60], spots: [[40, -60], [-60, -40], [120, -90], [-10, 120], [170, 20], [-220, -70], [60, 10], [-130, 30]] };
export function dispersionMap(c) {
  const { w, h } = WORLD;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 2, 12), C.parchment);
  s.p(c.cut(c.rect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28), 0.8, 12), mix(C.lake, C.parchment, 0.4));
  const lands = [
    // Europe along the top
    [[-w / 2 + 14, -h / 2 + 14], [w / 2 - 14, -h / 2 + 14], [w / 2 - 14, -130], [220, -120], [150, -100], [90, -70], [60, -110], [20, -60], [-10, -90], [-60, -60], [-90, -110], [-150, -60], [-200, -100], [-260, -90], [-w / 2 + 14, -110]],
    // Africa along the bottom
    [[-w / 2 + 14, 120], [-200, 110], [-80, 130], [60, 110], [200, 120], [260, 150], [w / 2 - 14, 170], [w / 2 - 14, h / 2 - 14], [-w / 2 + 14, h / 2 - 14]],
    // the east coast: Syria, Judea
    [[w / 2 - 14, -130], [w / 2 - 14, 170], [290, 150], [280, 60], [300, -20], [290, -100]],
  ];
  lands.forEach((p) => s.p(c.cut(p, 1.4, 8), mix(C.sand, C.sage2, 0.45)));
  s.p(c.cut(c.blob(40, -40, 22, 12, 9, 0.3), 0.6, 4) + c.cut(c.blob(170, 0, 30, 10, 9, 0.3), 0.6, 4) + c.cut(c.blob(-170, 10, 20, 12, 9, 0.3), 0.6, 4), mix(C.sand, C.sage2, 0.45));
  // Judea highlighted
  s.p(c.cut(c.blob(WORLD.judea[0], WORLD.judea[1], 22, 30, 10, 0.15), 0.6, 4), mix(C.clay, C.parchment, 0.4));
  // little ships
  let sh = '';
  [[-120, 40], [110, 60], [-10, 60]].forEach(([x, y]) => { sh += c.cut([[x - 14, y], [x + 14, y], [x + 9, y + 7], [x - 9, y + 7]], 0.2, 3) + c.cut([[x, y - 2], [x, y - 22], [x + 12, y - 4]], 0.2, 3); });
  s.p(sh, C.wood3);
  const T = (x, y, text, { size = 17, anchor = 'middle', col = C.inkSoft } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${col}">${text}</text>`;
  const labels = T(WORLD.judea[0] - 40, WORLD.judea[1] + 6, tr('Judea', 'Judea'), { anchor: 'end', col: C.terracotta, size: 20 }) + T(20, -150, tr('Grecja', 'Greece')) + T(170, -150, tr('Azja', 'Asia')) + T(-230, -140, tr('Rzym', 'Rome')) + T(150, 190, tr('Egipt', 'Egypt')) +
    T(-70, 80, tr('Morze Wielkie', 'the Great Sea'), { size: 15, col: shade(C.lakeDeep, -0.1) });
  return s.out() + labels;
}

/* ================================================================== living water */

export const LIVING = '#9fd6e0';        // the living water: a clear, light-filled blue
export const LIVING2 = '#6fbfd0';
/** define the glow gradient for living water in a scene; returns its id */
export function waterGlowDef(S) {
  const id = S.id('living-glow');
  S.defs(`<radialGradient id="${id}"><stop offset="0" stop-color="#eafcff" stop-opacity=".95"/><stop offset=".45" stop-color="#bfeaf2" stop-opacity=".45"/><stop offset="1" stop-color="#bfeaf2" stop-opacity="0"/></radialGradient>`);
  return id;
}
/**
 * a stream of living water along the polyline pts, cut into n chunks that can be revealed one by one.
 * Returns [{ markup, u }] (u = where the chunk ends along the stream, 0..1). w: width at the source → at the end.
 */
export function waterChunks(c, pts, n = 10, [w0, w1] = [16, 26], glowId = null) {
  // resample the path evenly
  const seg = [];
  let tot = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
  const at = (u) => {
    let d = u * tot;
    for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const k = seg[i] ? Math.min(1, d / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= seg[i]; }
    return pts[pts.length - 1];
  };
  const out = [];
  for (let k = 0; k < n; k++) {
    const a = k / n, b = (k + 1) / n + 0.012;
    const sub = Array.from({ length: 7 }, (_, j) => at(Math.min(1, a + ((b - a) * j) / 6)));
    const wf = (u) => lerp(w0, w1, a + (b - a) * u);
    const glow = glowId && k % 2 === 0 ? `<circle cx="${sub[3][0].toFixed(1)}" cy="${sub[3][1].toFixed(1)}" r="${(wf(0.5) * 2.4).toFixed(1)}" fill="url(#${glowId})"/>` : '';
    const body = `<path d="${c.ribbon(sub, wf, 0.8)}" fill="${LIVING}"/><path d="${c.ribbon(sub.map(([x, y]) => [x - 2, y - 2]), (u) => wf(u) * 0.35)}" fill="#f2fdff" opacity=".8"/>`;
    out.push({ markup: glow + body, u: (k + 1) / n });
  }
  return { chunks: out, at, len: tot };
}

/* ================================================================== the council chamber (Mark 14's chamber) */

import { chamber as chamber14, table as table14, highPriest as hp14, priest as priest14, hangingLamp as hangLamp14, lampGlow as lampGlow14 } from '../mark14/lib.js';
import { nicodemus as nico3 } from '../john3/lib.js';
/**
 * The chief priests and Pharisees at dusk in their chamber: the table under a hanging lamp, the high priest and a
 * priest behind it, two Pharisees in front, Nicodemus among them; officers can come in through the door.
 * Returns { R, F, lamp: {el, flame, glow}, back, front, hp, pr, phA, phB, nico, update(t, time) }.
 */
export const COUNCIL = { TX: 690, HPX: 610, PRX: 770, PHA: 470, PHB: 900, NX: 360 };
export function councilSet(S, { skyCols } = {}) {
  const c = S.c;
  const R = chamber14(S, skyCols ? { skyCols } : {});
  const F = R.FLOOR;
  const lampL = S.layer({ par: 0.44, sh: 3 });
  const glow = lampL.add(lampGlow14(COUNCIL.TX, 330));
  const lampEl = hanging(lampL, `<g transform="translate(-6 0)">${hangLamp14(c)}</g>`, { x: COUNCIL.TX, y: 330, len: 100 });
  const flame = lampEl.querySelector('.flame');
  const back = S.layer({ par: 0.5, sh: 5 });
  const hp = S.puppet(back.add(hp14(c)));
  const pr = S.puppet(back.add(priest14(c, 1)));
  const tabL = S.layer({ par: 0.52, sh: 6 });
  tabL.add(`<g transform="translate(${COUNCIL.TX} ${F})">${table14(c, 300, 100)}</g>`);
  const front = S.layer({ par: 0.56, sh: 5 });
  const nico = S.puppet(front.add(nico3(c)));
  const phA = S.puppet(front.add(person(c, ph3(c, 1))));
  const phB = S.puppet(front.add(person(c, ph3(c, 4))));
  return {
    R, F, back, front, tabL, hp, pr, phA, phB, nico, lamp: { el: lampEl, flame, glow },
    update(t, time) {
      swing(lampEl, COUNCIL.TX, 330, time, 0.8, 0.9);
      pose(flame, { x: 32, y: 36, sy: 1 + Math.sin(time * 9) * 0.06 });
    },
  };
}
