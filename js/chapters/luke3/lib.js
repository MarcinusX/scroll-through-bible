// Luke 3 — cut-outs, looks and sets shared by this chapter's scenes.
// John, the Jordan, the dove, the axe and the threshing floor are the same cut-outs as in Mark 1 and Matthew 3
// (so John looks the same in every Gospel); Herod and Herodias are Mark 6's, Pilate Mark 15's, Annas John 18's,
// Caiaphas Mark 14's, the medallions of the line Matthew 1's. This file adds Luke's own pieces: the map of the
// tetrarchies, Tiberius and his laurel, the heavy sack of sins, the cloak given away, and the road of the
// generations — garlands of medallions hung between poles that recede towards the horizon, back to Adam.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, clamp } from '../kit.js';
import { rock, grass } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { medal, RIM, ICON, nameStrip, elder } from '../matthew1/lib.js';
import { LOOK as L6 } from '../mark6/lib.js';
import { LOOK as L15 } from '../mark15/lib.js';
import { ANNAS } from '../john18/lib.js';
import { HP } from '../mark14/lib.js';
import { turban, breastplate, addToHead, addToBody, circlet } from '../mark2/lib.js';
import { crown as crownM } from '../mark6/lib.js';

export {
  JOHN_B, hand, headAt, voiceRings, hang2, dove, flapWings, acacia, scrub, shell, scrap, drops, flame, plate, sparkle,
  jordanSet, hungWord, rayBurst, glowDisc, kf, moving, speech, strip, nameTag, question, firePit, fireFlames, portrait,
  storyFrame, folk, group, paperCrown, ABRAHAM, viper, fireLine, orchardTree, fruit, blossom, axe, chip, winnowFork,
  granary, sack, chaffFlake, kernel, lightBanner, riverSet, manOf, womanOf, standRock, badlands, child,
  DESERT, MORNING, KINGDOM, HEAVEN, WRATH, HARVEST, DAY,
} from '../matthew3/lib.js';
export { medal, RIM, ICON, nameStrip, elder, JOSEPH, DAVID, ISAIAH, numberCard, bead, glowStar, sheep, crown, harp } from '../matthew1/lib.js';
export { thought, GLYPH, wordSlip, coin, coinStack, ledger, coinScale, taxBooth, loaf, addToHead, addToBody, circlet, turban, breastplate } from '../mark2/lib.js';
export { tunic, helmet, labelTag, throne, crossX, tick, purse as bagPurse } from '../mark6/lib.js';
export { withFace, faceBits } from '../mark3/lib.js';
export { soldier, pilate, SOLDIER, romanHelmet, spearHeld, eagleStandard } from '../mark15/lib.js';
export { annas } from '../john18/lib.js';
export { highPriest } from '../mark14/lib.js';
export { sandalBig, prisonWall, bars, breadBasket } from '../mark1/lib.js';
export { tr, seg, es, ease, bump, fade, clamp };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const ROMAN = ['#cadbd8', '#efe2c4', '#f7e7c9'];
export const PREDAWN = ['#3d3f6e', '#8e7c9e', '#dcae98'];
export const FIRSTLIGHT = ['#8e9cc0', '#e8bca6', '#f6d9b4'];
export const JORDAN_DAY = ['#c6dcd8', '#eee6cc', '#f7ead0'];
export const DUSKGOLD = ['#b99fb4', '#eec39c', '#f6dcb4'];

/* ================================================================== the cast */
/** Tiberius Caesar: an old emperor, clean-shaven, grey, in white and purple with a gold laurel */
export const TIBERIUS = { robe: C.linen, mantle: mix(C.plumRobe, C.indigo, 0.3), belt: null, skin: C.skin, hair: C.greyHair, hairStyle: 'short', beard: 'none' };
/** Pontius Pilate — as in Mark 15 */
export const PILATE = { ...L15.pilate };
/** Herod Antipas and Herodias — as in Mark 6 */
export const HEROD = L6.herod;
export const HERODIAS = L6.herodias;
export const GUARD = L6.guard;
/** Philip the tetrarch, Herod's brother (the family face, a teal robe) and Lysanias of Abilene */
export const PHILIP_T = { robe: C.tealRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.sun };
export const LYSANIAS = { robe: C.dustyBlue, mantle: C.wheatRobe, hair: C.hair, hairStyle: 'curly', beard: 'short', skin: C.skin3, belt: C.sun };
/** Annas (John 18) and Caiaphas (Mark 14) */
export const ANNAS_O = ANNAS;
export const CAIAPHAS = HP;

/* ================================================================== head pieces (head coords) */
/** a gold laurel wreath */
export function laurel(c) {
  const s = sheet();
  s.p(c.ribbon(c.arc(0, -2, 20, 19, PI * 0.82, PI * 2.12, 16), 2.4), shade(C.sun, -0.12));
  let lv = '';
  for (let i = 0; i < 11; i++) {
    const a = PI * (0.86 + i * 0.12), x = Math.cos(a) * 20, y = -2 + Math.sin(a) * 19, t = a + PI / 2 + 0.5;
    lv += c.cut(c.ell(x + Math.cos(t) * 5, y + Math.sin(t) * 5, 6, 2.6, 10, t), 0.2, 2);
  }
  s.p(lv, C.sun);
  return s.out();
}
/** a medallion with a head piece (laurel, crown, turban…) — Matthew 1's medal plus a piece placed on the head */
export function medalHead(S, o, head, opts = {}) {
  const r = opts.r || 50, k = (r / 52) * (opts.figS || 1), d = opts.flip ? -1 : 1, hy = -0.12 * r;
  const front = `<g transform="translate(0 ${hy.toFixed(1)}) scale(${(k * d).toFixed(3)} ${k.toFixed(3)})">${head}</g>` + (opts.front || '');
  return medal(S, o, { ...opts, front });
}
export const priestHead = (c) => turban(c);
export const kingHead = (c) => `<g transform="translate(0 2)">${crownM(c)}</g>`;

/* ================================================================== the map of the land (origin: centre) */
export const MAP = { w: 470, h: 580 };
/** the parchment map of the land and its tetrarchies: { base, regions: { judea, galilee, iturea, trachon, abilene }, spots } */
export function landOfRulers(c) {
  const { w, h } = MAP;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 2, 10), C.parchment);
  s.x(c.ribbon([[-w / 2 + 14, -h / 2 + 14], [w / 2 - 14, -h / 2 + 14], [w / 2 - 14, h / 2 - 14], [-w / 2 + 14, h / 2 - 14], [-w / 2 + 14, -h / 2 + 16]], 2), C.clay, 'opacity=".5"');
  // the Great Sea on the left
  const coast = [[-w / 2 + 16, -h / 2 + 16], [-150, -h / 2 + 16], [-146, -210], [-160, -120], [-168, -40], [-178, 60], [-188, 160], [-200, h / 2 - 16], [-w / 2 + 16, h / 2 - 16]];
  s.p(c.cut(coast, 1, 8), mix(C.lake, C.parchment, 0.35));
  let wv = '';
  for (let i = 0; i < 9; i++) { const y = -220 + i * 52, x = -214 + (i % 2) * 14; wv += c.ribbon([[x - 10, y], [x - 4, y - 3], [x + 2, y], [x + 8, y - 3]], 1.4); }
  s.x(wv, shade(C.lake, -0.1), 'opacity=".6"');
  // hills
  let hl = '';
  [[-90, -170], [-40, -40], [-90, 20], [-60, 110], [-110, 200], [110, -210], [140, -110], [120, 40], [150, 150], [-20, -250]].forEach(([x, y]) => { hl += c.cut([[x - 18, y + 7], [x, y - 13], [x + 18, y + 7]], 0.5, 6); });
  s.x(hl, shade(C.parchment, -0.13));
  // the lake, the Jordan, the Salt Sea
  const LK = [18, -110];
  s.p(c.cut(c.blob(LK[0], LK[1], 20, 34, 12, 0.1), 0.5, 5), C.lake);
  const river = [[LK[0] - 2, LK[1] + 32], [26, -30], [12, 20], [30, 70], [16, 120], [28, 166]];
  s.p(c.ribbon(river, 5), C.lake2);
  s.p(c.ribbon([[14, -250], [20, -200], [16, -150]], 3.4), C.lake2);
  s.p(c.cut(c.blob(30, 214, 20, 50, 12, 0.1), 0.5, 5), C.lake2);
  const txt = (x, y, t, size = 15, col = C.inkSoft, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${col}">${t}</text>`;
  const labels = txt(-218, -250, tr('Morze', 'the Sea'), 14, shade(C.lakeDeep, -0.1), 'start') + txt(52, 20, tr('Jordan', 'Jordan'), 13, shade(C.lakeDeep, -0.1), 'start');
  // regions (drawn separately so each can be coloured in when its ruler is named)
  const reg = (pts, col, label, lx, ly, size = 17) => {
    const r = sheet();
    r.p(c.cut(pts, 2.6, 9), col, 'opacity=".78"');
    r.x(c.ribbon([...pts, pts[0]], 2), shade(col, -0.3), 'opacity=".7"');
    return r.out() + (label ? txt(lx, ly, label, size, shade(col, -0.62)) : '');
  };
  const regions = {
    galilee: reg([[-150, -196], [-4, -198], [-4, -142], [0, -80], [-6, -58], [-160, -52]], mix(C.sageRobe, C.parchment, 0.25), tr('Galilea', 'Galilee'), -80, -118),
    judea: reg([[-172, 44], [30, 40], [14, 120], [14, 262], [-150, 262], [-186, 160]], mix(C.ochreRobe, C.parchment, 0.2), tr('Judea', 'Judea'), -78, 206),
    abilene: reg([[40, -272], [214, -272], [214, -214], [40, -212]], mix(C.tealRobe, C.parchment, 0.25), tr('Abilena', 'Abilene'), 127, -236, 16),
    iturea: reg([[36, -206], [196, -206], [196, -152], [110, -140], [40, -150]], mix(C.mauve, C.parchment, 0.2), tr('Iturea', 'Ituraea'), 116, -170, 16),
    trachon: reg([[110, -134], [214, -148], [214, -30], [120, -26], [88, -72]], mix(C.lavender, C.parchment, 0.1), tr('Trachonitis', 'Trachonitis'), 154, -80, 14),
  };
  const JER = [-40, 120];
  const town = (x, y) => c.cut(c.rect(x - 9, y - 7, 18, 11), 0.3, 4) + c.cut([[x - 11, y - 7], [x, y - 17], [x + 11, y - 7]], 0.3, 4);
  s.p(town(...JER), C.clay);
  const base = s.out() + labels + txt(JER[0] + 16, JER[1] + 2, tr('Jerozolima', 'Jerusalem'), 14, C.inkSoft, 'start');
  return { base, regions, JER, LK };
}

/* ================================================================== John's world */
/** a heavy dark sack of sins carried on the back (origin: its bottom centre) */
export function sinSack(c, w = 50, h = 56) {
  const col = mix('#4a3a33', C.soilDark, 0.4);
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 - 6, -h * 0.45], [-w / 2 + 2, -h * 0.85], [-8, -h], [0, -h - 9], [8, -h], [w / 2 - 2, -h * 0.85], [w / 2 + 6, -h * 0.45], [w / 2, 0]], 0.8, 5), col);
  s.x(c.ribbon([[-10, -h * 0.3], [0, -h * 0.4], [12, -h * 0.28]], 1.6) + c.ribbon([[-16, -h * 0.62], [-4, -h * 0.7]], 1.4), shade(col, 0.28), 'opacity=".6"');
  s.x(c.ribbon([[-7, -h + 3], [7, -h + 3]], 3), C.rope);
  return s.out();
}
/** a flat-bottomed cloud of dark ink dissolving in water (a stain); origin centre */
export function stain(c, r = 22) {
  const col = mix('#4a3a33', C.lake3, 0.35);
  return sheet().x(c.cut(c.blob(0, 0, r, r * 0.4, 12, 0.3), 1, 5), col, 'opacity=".75"').x(c.cut(c.blob(r * 0.4, -2, r * 0.5, r * 0.22, 8, 0.3), 0.6, 4), col, 'opacity=".5"').out();
}
/** a coat / tunic folded over the arm (hand coords), and flat for giving (origin centre) */
export function cloak(c, col = C.sageRobe) {
  const s = sheet();
  s.p(c.cut([[-18, -26], [-8, -22], [8, -22], [18, -26], [30, -14], [24, -6], [16, -12], [20, 30], [-20, 30], [-16, -12], [-24, -6], [-30, -14]], 0.6, 5), col);
  s.x(c.ribbon(c.arc(0, -22, 6, 4, 0, PI, 6), 1.6), shade(col, -0.25));
  s.x(c.ribbon([[-14, 4], [14, 3]], 1.6), shade(col, -0.18), 'opacity=".6"');
  return s.out();
}
/** a flat loaf of bread (origin centre) */
export function flatbread(c, r = 16) {
  return sheet().p(c.cut(c.ell(0, 0, r, r * 0.55, 16), 0.4, 4), C.wheat2).x(c.ribbon([[-r * 0.5, -1], [-r * 0.1, 2]], 1.4) + c.ribbon([[r * 0.1, -3], [r * 0.5, 0]], 1.4), shade(C.wheat2, -0.25), 'opacity=".7"').out();
}
/** a leather money pouch (origin: top centre) */
export function pouch(c, col = C.leather) {
  const s = sheet();
  s.p(c.cut([[-6, 0], [6, 0], [8, 4], [16, 12], [18, 26], [10, 34], [-10, 34], [-18, 26], [-16, 12], [-8, 4]], 0.4, 4), col);
  s.x(c.ribbon([[-8, 5], [8, 5]], 2.4), C.rope);
  return s.out();
}
/** a hand-cut wooden tablet with a sum written on it (the appointed tax) — origin centre */
export function taxTablet(c, text, { w = 92, h = 56 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 10), 0.5, 6), C.wood2);
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 6), mix(C.wood3, C.parchment, 0.45));
  return `${s.out()}<text x="0" y="${(h * 0.14).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${(h * 0.5).toFixed(0)}" font-style="italic" fill="${C.ink}">${text}</text>`;
}
/** a whip / club raised by a bullying soldier (hand coords) */
export function club(c, len = 60) {
  return sheet().p(c.ribbon([[0, 6], [0, -len]], (u) => 5 + u * 5), C.wood2).out();
}
/** a pointing finger of false accusation on a speech bubble — origin: tail tip */
export function accuse(c) {
  const s = sheet();
  s.p(c.cut([...c.blob(22, -30, 26, 18, 12, 0.06), [8, -14], [0, 0], [4, -16]], 0.5, 5), C.cream);
  s.p(c.cut([[6, -34], [26, -34], [34, -32], [44, -32], [44, -27], [28, -27], [26, -24], [8, -24]], 0.3, 3), C.skin2);
  return s.out();
}

/* ================================================================== the road of the generations */
/** the vanishing point of the road back through time */
export const VP = [800, 560];
/** where a garland at depth d sits: scale towards VP (d ≥ 0 recedes, d < 0 passes over the viewer) */
export function depthPose(d) {
  if (d >= 0) return { s: Math.pow(0.38, d), o: d > 2.6 ? 0 : 1 };
  return { s: 1 - d * 0.7, o: d < -0.34 ? 0 : clamp(1 + d * 3) };
}
/**
 * One garland of the line: two poles at the roadside, a cord sagging between them, and the medallions hung on
 * short strings. Drawn in world coords, wrapped so it scales about VP. people: [{ o, name, r, icon, rim, back,
 * key, head, front, dotted, flip }]. Returns { markup, spots: [{ x, y, r }] }.
 */
export function garland(S, people, { x0 = 380, x1 = 1220, top = 176, sag = 46, poleCol = C.wood2, base = 930, cord = mix(C.rope, C.wood3, 0.4), blank = false, size = 20, gold = false, inner = 70 } = {}) {
  const c = S.c;
  const n = people.length;
  const mid = (x0 + x1) / 2, half = (x1 - x0) / 2;
  const cordY = (x) => top + sag * (1 - Math.pow((x - mid) / half, 2));
  const s = sheet();
  // poles with a knob and a little pennant
  [x0, x1].forEach((px, i) => {
    s.p(c.cut([[px - 7, base], [px - 6, top - 14], [px + 6, top - 14], [px + 7, base]], 0.5, 12), poleCol);
    s.p(c.cut(c.circ(px, top - 18, 10, 12), 0.3, 3), gold ? C.sun : shade(poleCol, 0.2));
  });
  // the cord
  const cp = [];
  for (let i = 0; i <= 30; i++) { const x = lerp(x0, x1, i / 30); cp.push([x, cordY(x)]); }
  s.p(c.ribbon(cp, 4), gold ? C.haloRim : cord);
  const span = x1 - x0 - inner * 2;
  const spots = [];
  let strings = '', dots = '', meds = '';
  people.forEach((p, j) => {
    const x = x0 + inner + (span * (j + 0.5)) / n;
    const r = p.r || (n > 5 ? 40 : 46);
    const len = 22 + (j % 2) * 26 + (p.drop || 0);
    const cy = cordY(x), y = cy + len + r + 8;
    spots.push({ x, y, r });
    if (p.dotted) for (let k = 0; k < 6; k++) dots += c.cut(c.circ(x, cy + 3 + (k * (len + 6)) / 6, 2.2, 6), 0.1, 2);
    else strings += c.ribbon([[x, cy], [x + 0.6, y - r - 6]], 1.6);
    if (p.light) {
      const at = `transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"`;
      meds = `<g ${at}><circle r="${(r * 2.6).toFixed(0)}" fill="url(#halo-glow)"/>${rays(c, { n: 16, r0: r * 0.9, r1: r * 2.5, spread: 0.06, color: '#fff3cf' })}</g>` + meds;
      meds += `<g ${at}>${sheet().p(c.cut(c.circ(0, 0, r + 6, 30), 0.4, 4), C.haloRim).p(c.cut(c.circ(0, 0, r, 30), 0.3, 4), '#fff6dc').x(c.poly(c.circ(0, 0, r * 0.62, 24)), '#fffaf0').out()}</g>`;
    }
    else if (blank) meds += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${sheet().p(c.cut(c.circ(0, 0, r + 6, 20), 0.4, 4), p.rimCol || C.haloRim).p(c.cut(c.circ(0, 0, r, 20), 0.3, 4), mix(C.parchment, C.sand, 0.3)).out()}</g>`;
    else {
      const rim = RIM[p.rim || 'humble'];
      const opts = { r, ...rim, ...(p.back ? { back: p.back } : {}), name: p.name, icon: p.icon || '', flip: p.flip ?? x > mid + 20, size: p.size || size, front: p.front || '' };
      const m = p.head ? medalHead(S, p.o, p.head, opts) : medal(S, p.o, opts);
      meds += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${m}</g>`;
    }
    s.p(c.cut(c.circ(x, cy + 1, 4, 8), 0.2, 2), gold ? C.sun : shade(cord, -0.2));
  });
  if (strings) s.x(strings, 'rgba(74,54,34,.55)');
  if (dots) s.x(dots, C.inkSoft, 'opacity=".75"');
  return { markup: `<g><g transform="translate(${-VP[0]} ${-VP[1]})">${s.out()}${meds}</g></g>`, spots };
}

/**
 * The road of the generations: garlands receding along a road to VP. Garland i is read on beat `at[i]`; on each
 * read beat every garland steps one place nearer (the one before passes over the viewer), then the medallions
 * of the new front garland light up one by one. extra: garlands of blank beads further back (the line goes on).
 * Returns update(t) and the list (with spots) so a scene can add its own touches.
 */
export function lineRoad(S, list, at, { par = 0.3, extra = 2, lightStep = 0.08, glowR = 1.9, arrive = 0.45, start = 1, tweak = null, gopts = null } = {}) {
  const c = S.c;
  const glowL = S.layer({ par, sh: 1, flat: true });
  const L = S.layer({ par, sh: 5 });
  const all = [];
  // further garlands first (the nearer ones are laid over them)
  for (let e = extra; e >= 1; e--) {
    const g = garland(S, Array.from({ length: 5 }, () => ({})), { ...(gopts || {}), blank: true, sag: 40 + e * 3 });
    all.push({ i: list.length - 1 + e, el: L.add(g.markup), spots: [], glows: [] });
  }
  for (let i = list.length - 1; i >= 0; i--) {
    const g = garland(S, list[i].people, { ...(gopts || {}), ...(list[i].opts || {}) });
    const glows = g.spots.map((sp) => glowL.add(`<circle r="${(sp.r * glowR).toFixed(0)}" fill="url(#warm-glow)"/>`));
    all.push({ i, el: L.add(g.markup), spots: g.spots, glows, key: list[i] });
  }
  all.sort((a, b) => a.i - b.i);
  const adv = (t) => at.reduce((k, b) => k + es(t, b, b + arrive), 0);
  const update = (t) => {
    const a = adv(t);
    all.forEach((g) => {
      const d = g.i + start - a;
      let { s, o } = depthPose(d);
      const tw = tweak ? tweak(g.i, t, d) : null;
      const dy = tw ? tw.dy || 0 : 0;
      if (tw && tw.s) s *= tw.s;
      pose(g.el, { x: VP[0], y: VP[1] + dy, s, o });
      const read = at[g.i];
      g.glows.forEach((gl, j) => {
        const k = read === undefined ? 0 : es(t, read + arrive - 0.05 + j * lightStep, read + arrive + 0.12 + j * lightStep);
        const sp = g.spots[j];
        pose(gl, { x: VP[0] + (sp.x - VP[0]) * s, y: VP[1] + dy + (sp.y - VP[1]) * s, s: s * (0.6 + k * 0.4), o: k * o * (d > 0.6 ? 0 : 1) });
      });
    });
  };
  return { update, all, adv, layer: L, glowL };
}
/** the road itself and its verges (a ground band from the horizon down) */
export function roadGround(c, { hy = VP[1], ground = mix(C.sand, C.sand2, 0.4), road = mix(C.sand, C.cream, 0.45), edge = C.dune } = {}) {
  const s = sheet();
  s.p(c.ridge(c.wave(hy, [2, 1], [500, 140]), -1100, 2700, 1900, 14, 0.6), ground);
  s.p(c.cut([[VP[0] - 3, hy], [VP[0] + 3, hy], [VP[0] + 520, 1900], [VP[0] - 520, 1900]], 0.8, 10), road);
  let st = '';
  for (let i = 0; i < 26; i++) { const u = Math.pow(c.rr(0.05, 1), 1.6), y = hy + u * 700, x = VP[0] + c.rr(-0.8, 0.8) * u * 380; st += c.cut(c.ell(x, y, 2 + u * 8, 1 + u * 3, 8), 0.2, 3); }
  s.x(st, edge, 'opacity=".5"');
  s.x(c.ribbon([[VP[0] - 3, hy], [VP[0] - 520, 1900]], 3) + c.ribbon([[VP[0] + 3, hy], [VP[0] + 520, 1900]], 3), edge, 'opacity=".45"');
  return s.out();
}

/* ================================================================== small icons for the medallions (origin centre, r ≈ 20) */
export const ICON3 = {
  ark: (c) => sheet().p(c.cut([[-18, 2], [18, 2], [13, 12], [-13, 12]], 0.3, 3), C.wood2).p(c.cut(c.rect(-10, -8, 20, 10), 0.3, 3), C.wood3).p(c.cut([[-12, -8], [0, -15], [12, -8]], 0.2, 3), C.roof).x(c.ribbon([[-22, 15], [-10, 13], [0, 16], [12, 13], [22, 15]], 2.4), C.lake).out(),
  rainbow: (c) => { let o = ''; [C.terracotta, C.sun, C.sageRobe, C.dustyBlue, C.plumRobe].forEach((col, i) => { o += `<path d="${c.ribbon(c.arc(0, 10, 20 - i * 3.4, 18 - i * 3.4, PI, 2 * PI, 14), 3.2)}" fill="${col}"/>`; }); return o; },
  hourglass: (c) => sheet().p(c.cut([[-11, -16], [11, -16], [2, 0], [11, 16], [-11, 16], [-2, 0]], 0.3, 3), '#eef3ee').p(c.cut([[-8, 14], [8, 14], [0, 5]], 0.2, 2) + c.cut([[-5, -9], [5, -9], [0, -3]], 0.2, 2), C.sand2).p(c.cut(c.rect(-14, -19, 28, 4), 0.2, 3) + c.cut(c.rect(-14, 15, 28, 4), 0.2, 3), C.wood2).out(),
  up: (c) => `<path d="${c.poly(c.star(0, 0, 18, 5, 8, 0))}" fill="${C.sun}"/><path d="${c.cut([[0, -16], [8, -4], [3, -4], [3, 12], [-3, 12], [-3, -4], [-8, -4]], 0.2, 3)}" fill="${C.star}"/>`,
  tree: (c) => sheet().p(c.ribbon([[0, 18], [0, 0]], 4), C.wood2).p(c.cut(c.blob(0, -6, 16, 13, 12, 0.14), 0.4, 3), C.leaf).x(c.poly(c.circ(-6, -4, 3, 8)) + c.poly(c.circ(6, -9, 3, 8)) + c.poly(c.circ(3, 1, 2.6, 8)), mix(C.terracotta, C.roseRobe, 0.3)).out(),
  split: (c) => sheet().p(c.cut([...c.arc(-2, 0, 16, 16, PI * 0.5, PI * 1.5, 10), [-4, -10], [2, -4], [-4, 2], [2, 8]], 0.3, 3), C.sageRobe).p(c.cut([...c.arc(4, 0, 16, 16, -PI * 0.5, PI * 0.5, 10), [6, 8], [10, 2], [4, -4], [10, -10]], 0.3, 3), C.ochreRobe).out(),
  tower: (c) => sheet().p(c.cut([[-16, 16], [16, 16], [12, 6], [-12, 6]], 0.2, 3) + c.cut([[-11, 6], [11, 6], [8, -4], [-8, -4]], 0.2, 3) + c.cut([[-7, -4], [7, -4], [4, -14], [-4, -14]], 0.2, 3), mix(C.clay, C.dune, 0.4)).out(),
  temple: ICON.temple,
  chain: ICON.chain,
  harp: ICON.harp,
  crook: ICON.crook,
  sheaf: ICON.sheaf,
  banner: ICON.banner,
  lion: ICON.lion,
  ladder: ICON.ladder,
  ram: ICON.ram,
  stars: ICON.stars,
  square: ICON.square,
  scroll: ICON.scroll,
  plough: ICON.plough,
};

/* ================================================================== light */
/** a soft round light (a radial glow) + optional rays; origin centre */
export function lightDisc(c, r = 160, { rayN = 0, rayCol = '#fff3cf', grad = 'halo-glow' } = {}) {
  return `<circle r="${r}" fill="url(#${grad})"/>${rayN ? rays(c, { n: rayN, r0: r * 0.2, r1: r * 2.6, spread: 0.05, color: rayCol }) : ''}`;
}
/** a narrow beam of light from above (origin at its foot) */
export function beam(c, h = 700, w0 = 40, w1 = 150, col = '#fff4d0') {
  return `<path d="${c.poly([[-w0 / 2, -h], [w0 / 2, -h], [w1 / 2, 0], [-w1 / 2, 0]])}" fill="${col}" opacity=".55"/><path d="${c.poly([[-w0 / 4, -h], [w0 / 4, -h], [w1 / 4, 0], [-w1 / 4, 0]])}" fill="${col}" opacity=".5"/>`;
}
export { rays, rock, grass, person, CAST, crowdPerson, sheet, shade, mix, pose, lerp, C };

/* ================================================================== the meadow by the ford (the counsel scenes) */
import { sky as skyK, hanging as hangingK, swing as swingK } from '../kit.js';
import { band as bandN, hillsWith as hillsN, sun as sunN, cloud as cloudN, flowers as flowersN, reeds as reedsN, stars as starsN } from '../../assets/nature.js';
/**
 * A meadow on the near side of the Jordan: sky, hills, the river band behind, grass and flowers.
 * People stand at GY (690). Returns { GY, update(time) }.
 */
export function meadowSet(S, { skyCols = JORDAN_DAY, sunAt = [1250, 150], ground = mix(C.sage2, C.sand, 0.35), far = mix(C.duskViolet, C.dune, 0.5), crowd = null } = {}) {
  const c = S.c;
  skyK(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hangingK(hangL, sunN(c, 44), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cl1 = hangingK(hangL, cloudN(c, 170), { x: 540, y: 160, len: 700 });
  S.layer({ par: 0.08, sh: 2 }).add(bandN(c, { y: 470, amps: [18, 8, 3], lens: [1000, 340, 120], color: far }).markup);
  S.layer({ par: 0.14, sh: 3 }).add(hillsN(c, { y: 520, amps: [12, 5, 2], lens: [900, 320, 120], color: mix(C.dune, C.sand2, 0.4), trees: 10, treeColor: C.olive, treeH: 16 }).markup);
  const river = S.layer({ par: 0.2, sh: 2 });
  river.add(sheet().p(c.ridge(c.wave(560, [3, 1.2], [300, 90]), -1100, 2700, 1900, 12, 0.6), C.lake).p(c.ridge(c.wave(596, [3, 1], [260, 80]), -1100, 2700, 1900, 12, 0.6), mix(C.sand, C.sage3, 0.4)).out());
  river.add(reedsN(c, 300, 600, 8, 60) + reedsN(c, 1320, 600, 9, 64));
  const back = S.layer({ par: 0.26, sh: 3 });
  const G = S.layer({ par: 0.35, sh: 3 });
  const gfn = c.wave(640, [4, 2], [600, 170]);
  G.add(sheet().p(c.ridge(gfn, -1100, 2700, 1900, 12, 1), ground).out());
  G.add(grass(c, { x0: -1100, x1: 2700, y: 640, fn: gfn, n: 60, h: 14, color: C.moss }) + flowersN(c, { x0: -600, x1: 2200, y: 720, n: 22 }));
  return {
    GY: 690, back, G,
    update(time) {
      swingK(sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      swingK(cl1, 540 + Math.sin(time * 0.1) * 20, 160, time, 1.2, 0.6, 1);
    },
  };
}

/* ================================================================== the people of the line */
/** a medallion spec for one name of the line: an elder's face unless a look is given */
export function gen(c, name, { o, rim = 'humble', icon, head, ...rest } = {}) {
  return { name, o: o || elder(c), rim, icon: icon ? icon(c) : '', head: head ? head(c) : '', ...rest };
}
/** the era's ground and road with a verge of grass (a still sheet) and the sky; returns the road layer */
export function eraSet(S, { skyCols, far, mid, ground, road, grassCol = C.moss, hy = VP[1], night = null, behind = null } = {}) {
  const c = S.c;
  skyK(S, skyCols);
  let nightL = null;
  if (night) {
    nightL = skyK(S, night, { name: 'night' }).layer;
    nightL.add(starsN(c, { x0: -1000, x1: 2600, y0: -900, y1: hy - 40, n: 160 }));
    nightL.fade(0);
  }
  const behindOut = behind ? behind(S) : null;
  const back = S.layer({ par: 0.06, sh: 2 });
  back.add(bandN(c, { y: hy - 30, amps: [14, 6, 2], lens: [900, 320, 120], color: far }).markup);
  const midL = S.layer({ par: 0.12, sh: 3 });
  if (mid) midL.add(bandN(c, { y: hy - 8, amps: [8, 4, 2], lens: [700, 260, 100], color: mid }).markup);
  const R = S.layer({ par: 0.3, sh: 3 });
  R.add(roadGround(c, { hy, ground, road }));
  R.add(grass(c, { x0: -1100, x1: 2700, y: hy + 6, n: 40, h: 8, color: grassCol }));
  return { back, midL, R, nightL, behind: behindOut };
}
