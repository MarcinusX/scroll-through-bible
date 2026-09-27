// Mark 10 — the road up to Jerusalem. Shared sets and cut-outs for this chapter:
// the road landscape (Jerusalem on the horizon, closer in every scene), paper dolls for the
// teaching on marriage, rings and ribbons, stone tablets, the rich man's cart, a giant needle,
// thrones of light, a cup, a basin and towel, shadow-play pieces, Jericho and a blind man's cloak.
// Everything returns SVG markup (origin noted per piece) cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, sun as sunCut, cloud, olive, palm, rock, bush, grass } from '../../assets/nature.js';
import { walledCity } from '../mark1/lib.js';
import { addToHead } from '../mark2/lib.js';
import { fade } from '../../core/anim.js';

export { kf, moving, speech, thought, GLYPH, spark, coin, coinStack, cup, bowl, loaf, addToHead, addToBody, wordSlip, dust, turban, scrollOpen } from '../mark2/lib.js';
export { along, headAt, handAt, withFace, faceBits, heart, stoneHeart, bubble, strip, nameTag, question, TWELVE, pharisee, scribe, man, woman, shadowPerson, sparkle, houseSection, scrollRoll } from '../mark3/lib.js';
export { walledCity, camel, walkCamel, hang2, voiceRings, signpost, scrollParts, footprint } from '../mark1/lib.js';

const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ---------- the cast of this chapter ---------- */
export const LOOK = {
  rich: { robe: mix(C.plumRobe, C.indigo, 0.18), mantle: C.ochre, belt: C.sun, skin: C.skin, hair: C.hair2, hairStyle: 'curly', beard: 'none' },
  bart: { robe: mix(C.stone2, C.rock2, 0.5), mantle: mix(C.tealRobe, C.rock2, 0.45), belt: C.rope, skin: C.skin3, hair: C.hair3, hairStyle: 'wrap', veil: C.stone2, veil2: shade(C.stone2, -0.12), beard: 'full', eyes: 'closed' },
  moses: { robe: C.linen2, mantle: C.clayMantle, skin: C.skin2, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.stone2, beard: 'wild', beardColor: C.linen2 },
  man0: { robe: C.sageRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather },
  wife0: { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), skin: C.skin, hair: C.hair },
  father: { robe: C.dustyBlue, mantle: C.stone, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather },
  mother: { robe: C.mauve, hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.greyHair, skin: C.skin2 },
  king: { robe: C.indigo, mantle: C.terracotta, belt: C.sun, skin: C.skin2, hair: C.hair3, hairStyle: 'short', beard: 'full' },
};
/** a child (boy or girl): draw at s ≈ 0.5 */
export function child(c, i = 0) {
  const girl = i % 2 === 1;
  const robes = [C.wheatRobe, C.roseRobe, C.tealRobe, C.peach, C.sageRobe, C.lavender, C.ochreRobe, C.skyVeil];
  return {
    robe: robes[i % robes.length], skin: [C.skin, C.skin2, C.skin3, C.skin4][(i * 3) % 4], hair: [C.hair, C.hair2, C.hair3][i % 3],
    hairStyle: girl ? 'veil' : ['short', 'curly'][i % 2 ? 0 : (i >> 1) % 2], veil: [C.blushVeil, C.cream, C.skyVeil][i % 3], beard: 'none', belt: i % 3 === 0 ? C.terracotta : null,
  };
}

/* ---------- the road: sky, Jerusalem on the far hills, a winding road through the ground ---------- */
export const DAY = ['#cfe0da', '#efe6cd', '#f6e8cf'];
/**
 * roadSet(S, o) builds sky, hanging sun/clouds, far hills with Jerusalem, near hills and the ground with
 * a road running up towards the city. jer (0…1) = how close Jerusalem is (it grows through the chapter).
 * Returns { sk, hangL, farL, hillL, groundL, gy(x), update(t, time, { sunY }) }.
 */
export function roadSet(S, o = {}) {
  const c = S.c;
  const {
    skyCols = DAY, jer = 0.3, jerX = 1130, farY = 430, hillY = 500, groundY = 575, hillCol = C.hillMid, farCol = C.hillFar,
    groundCol = mix(C.sand, C.sage2, 0.4), sunAt = [1235, 150], sunR = 40, clouds = [[470, 130, 190], [1010, 210, 140]],
    trees = 16, treeCol = C.sage, roadX = 760, roadCol = mix(C.sand2, C.dune, 0.25), jerusalem = true, road = true,
  } = o;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const sunEl = hanging(hangL, sunCut(c, sunR), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cls = clouds.map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 600 }), x, y, i }));
  const farL = S.layer({ par: 0.1, sh: 2 });
  const far = band(c, { y: farY, amps: [20, 8, 3], lens: [1000, 360, 130], color: farCol });
  let jerEl = null;
  if (jerusalem) {
    const sc = 0.22 + jer * 0.55, jy = far.fn(jerX) + 10;
    jerEl = farL.add(`<g><circle cx="${jerX}" cy="${jy - 60 * sc}" r="${150 * sc + 30}" fill="url(#halo-glow)" opacity="${0.35 + jer * 0.3}"/>${walledCity(c, jerX, jy, sc)}</g>`);
  }
  farL.add(far.markup);
  const hillL = S.layer({ par: 0.2, sh: 3 });
  const hills = hillsWith(c, { y: hillY, amps: [16, 7, 3], lens: [900, 300, 110], color: hillCol, trees, treeColor: treeCol, treeH: 22 });
  hillL.add(hills.markup);
  const groundL = S.layer({ par: 0.35, sh: 3 });
  const gfn = c.wave(groundY, [6, 3], [700, 170]);
  const g = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), groundCol);
  // the road: wide in front, narrowing to the horizon
  const rp = [];
  for (let i = 0; i <= 18; i++) { const u = i / 18; rp.push([roadX + Math.sin(u * 4.2 + 0.6) * 140 * (1 - u) + (1 - u) * 60, lerpN(1700, gfn(roadX) + 4, Math.pow(u, 0.7))]); }
  if (road) g.p(c.ribbon(rp, (u) => 330 * (1 - u) + 24), roadCol);
  let stones = '';
  for (let i = 0; i < 40; i++) { const x = c.rr(-600, 2200), y = c.rr(gfn(x) + 30, 1100); stones += c.cut(c.blob(x, y, c.rr(4, 11), c.rr(2, 5), 7, 0.2), 0.3, 3); }
  g.x(stones, shade(groundCol, -0.14), 'opacity=".6"');
  groundL.add(g.out());
  groundL.add(grass(c, { x0: -500, x1: 2100, y: groundY, fn: gfn, n: 34, h: 14, color: C.olive }));
  return {
    sk, hangL, farL, hillL, groundL, gy: gfn, jerEl, sunEl, cls,
    update(t, time, { sunY = 0, drift = 1 } = {}) {
      swing(sunEl, sunAt[0], sunAt[1] + sunY, time, 1.1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i * 2) * 26 * drift + t * 6, cl.y, time, 1.4, 0.7, cl.i));
    },
  };
}
const lerpN = (a, b, t) => a + (b - a) * t;

/** Jericho — the city of palms: a low walled town with palms around it; origin: ground centre */
export function jericho(c, sc = 1) {
  let out = walledCity(c, 0, 0, sc, { wall: mix(C.sand2, C.stone, 0.4), wall2: mix(C.dune, C.stone2, 0.4), temple: C.plaster });
  [-150, -118, 128, 160, -190].forEach((x, i) => { out += palm(c, x * sc, 4, (150 + i * 14) * sc); });
  return out;
}

/** a broad shade tree (fig / terebinth): trunk, a few boughs and a crown of leaf blobs; origin: foot of the trunk */
export function shadeTree(c, x, y, sc = 1, { trunk = C.wood2, leaf = C.moss, leaf2 = C.leaf, leaf3 = C.sage } = {}) {
  const s = sheet();
  const P = (pts) => pts.map(([px, py]) => [x + px * sc, y + py * sc]);
  s.p(c.cut(P([[-16, 0], [-12, -70], [-40, -120], [-30, -126], [-4, -92], [6, -140], [18, -138], [12, -90], [44, -124], [52, -116], [14, -64], [16, 0]]), 0.8, 6), trunk);
  const blobs = [[-70, -150, 70, 44], [0, -178, 84, 54], [72, -148, 66, 44], [-30, -120, 60, 34], [40, -118, 62, 34], [-110, -118, 40, 26], [112, -120, 42, 26]];
  let a = '', b = '', d = '';
  blobs.forEach(([bx, by, rx, ry], i) => { const p = c.cut(P(c.blob(bx, by, rx, ry, 14, 0.16)), 1, 7); if (i % 3 === 0) a += p; else if (i % 3 === 1) b += p; else d += p; });
  s.p(d, leaf3).p(a, leaf).p(b, leaf2);
  return s.out();
}

/* ---------- speech ---------- */
/** a speech bubble with lines of text (jag: a shout); origin at the tip of the tail. side: 1 bubble to the right */
export function say(c, lines, { size = 20, fill = C.cream, ink = C.ink, side = 1, w, jag = false, bold = false } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.5 + size * 1.6;
  const hh = lines.length * size * 1.15 + size * 0.9;
  const cx = side * (ww / 2 - 18), cy = -hh / 2 - 24;
  const s = sheet();
  if (jag) {
    const p = [], n = Math.max(22, Math.round(ww / 13) * 2);
    for (let i = 0; i < n; i++) { const a = (i / n) * PI * 2, k = i % 2 ? 1 : 1.16; p.push([cx + Math.cos(a) * (ww / 2 + 8) * k, cy + Math.sin(a) * (hh / 2 + 6) * k]); }
    s.p(c.cut(p, 0.4, 5), fill);
  } else s.p(c.cut(c.blob(cx, cy, ww / 2, hh / 2, 18, 0.04), 0.6, 6), fill);
  s.p(c.cut([[side * 8, -hh * 0.2 - 18], [0, 0], [side * 26, -hh * 0.2 - 16]], 0.3, 4), fill);
  const t0 = cy - ((lines.length - 1) * size * 1.15) / 2 + size * 0.34;
  const txt = lines.map((l, i) => `<text x="${cx.toFixed(1)}" y="${(t0 + i * size * 1.15).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic"${bold ? ' font-weight="600"' : ''} fill="${ink}">${l}</text>`).join('');
  return s.out() + txt;
}
/** a hand-cut "!" (amazement) */
export function bang(c, col = C.terracotta, h = 1) {
  return sheet().x(c.cut([[-3.6 * h, -18 * h], [3.6 * h, -18 * h], [1.8 * h, 6 * h], [-1.8 * h, 6 * h]], 0.3, 4), col).x(c.cut(c.circ(0, 13 * h, 3.2 * h, 8), 0.2, 2), col).out();
}
/** a hand-cut "?" */
export function qmark(c, col = C.terracotta, h = 1) {
  const hook = c.arc(0, -8 * h, 8 * h, 8 * h, PI * 1.02, PI * 2.5, 12);
  hook.push([0, 5 * h]);
  return sheet().x(c.ribbon(hook, 4.4 * h), col).x(c.cut(c.circ(0, 13 * h, 3.1 * h, 8), 0.2, 2), col).out();
}
/** a word on a torn slip of paper hanging on a string: origin at the slip's centre */
export function slip(c, text, { size = 22, fill = C.cream, ink = C.ink, w, italic = true } = {}) {
  const ww = w || text.length * size * 0.5 + size * 1.3;
  const hh = size * 1.5;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}"${italic ? ' font-style="italic"' : ''} fill="${ink}">${text}</text>`;
}

/* ---------- marriage: paper dolls, scissors, ribbons, rings, a knot of light ---------- */
/** a folded-paper doll (the kind cut from a strip); origin at its feet. woman: skirt + veil */
export function doll(c, col, { woman = false, h = 90, skin = C.skin2 } = {}) {
  const s = sheet();
  const k = h / 90;
  const P = (pts) => pts.map(([x, y]) => [x * k, y * k]);
  if (woman) s.p(c.cut(P([[-8, -62], [8, -62], [15, -52], [30, -46], [30, -40], [16, -42], [22, 0], [-22, 0], [-16, -42], [-30, -40], [-30, -46], [-15, -52]]), 0.5, 5), col);
  else s.p(c.cut(P([[-8, -62], [8, -62], [15, -52], [30, -46], [30, -40], [15, -42], [14, -18], [16, 0], [4, 0], [2, -18], [-2, -18], [-4, 0], [-16, 0], [-14, -18], [-15, -42], [-30, -40], [-30, -46], [-15, -52]]), 0.5, 5), col);
  s.p(c.cut(P(c.circ(0, -74, 12, 16)), 0.3, 3), skin);
  if (woman) s.p(c.cut(P([...c.arc(0, -75, 14, 14, PI * 0.9, PI * 2.1, 12), [12, -64], [16, -52], [-16, -52], [-12, -64]]), 0.4, 4), shade(col, 0.3));
  else s.p(c.cut(P([...c.arc(0, -75, 13, 13, PI * 1.02, PI * 1.98, 10), [10, -78], [-10, -78]]), 0.3, 3), C.hair2);
  s.x(c.poly(P(c.circ(-4, -75, 1.5, 6))) + c.poly(P(c.circ(4, -75, 1.5, 6))), C.inkSoft);
  s.x(c.ribbon(P(c.arc(0, -70, 3.5, 2.2, 0.3, PI - 0.3, 5)), 1.1 * k), C.inkSoft);
  return s.out();
}
/** a pair of scissors (two blades on a pivot at the origin, pointing +x); set the blades' angle via .bladeA/.bladeB */
export function scissors(c, len = 110) {
  const blade = (sgn) => sheet()
    .p(c.cut([[-6, 0], [len, sgn * -2], [len * 0.2, sgn * 8]], 0.3, 6), C.stone)
    .x(c.ribbon([[0, sgn * 2], [len * 0.9, sgn * 0.5]], 1.2), '#fffaf0', 'opacity=".8"')
    .p(c.ribbon(c.arc(-34, sgn * 16, 16, 12, 0, PI * 2, 18), 6), C.terracotta)
    .p(c.ribbon([[-6, sgn * 3], [-20, sgn * 10]], 6), C.terracotta).out();
  return `<g class="bladeA">${blade(1)}</g><g class="bladeB">${blade(-1)}</g><circle r="4" fill="${C.ink}"/>`;
}
/** set a scissors' opening (deg) */
export function snip(el, open) {
  pose(el.querySelector('.bladeA'), { r: -open / 2 });
  pose(el.querySelector('.bladeB'), { r: open / 2 });
}
/** a golden ring seen slightly from above; origin centre. crack: a split that can be shown via [data-part=crack] */
export function ring(c, r = 26, col = C.sun) {
  const s = sheet();
  s.p(c.ribbon(c.arc(0, 0, r, r * 0.8, 0, PI * 2, 30), r * 0.26), col);
  s.x(c.ribbon(c.arc(0, 0, r, r * 0.8, PI * 1.1, PI * 1.6, 8), r * 0.08), '#fff8e0', 'opacity=".8"');
  s.p(c.cut(c.star(r * 0.1, -r * 0.8, r * 0.26, r * 0.12, 4, 0), 0.2, 3), C.skyVeil);
  const crack = `<g data-part="crack" opacity="0"><path d="${c.cut([[r * 0.78, -r * 0.62], [r * 1.14, -r * 0.1], [r * 0.9, -r * 0.2], [r * 1.12, r * 0.4], [r * 0.7, 0], [r * 0.9, -r * 0.24]], 0.1, 3)}" fill="${C.cream}"/></g>`;
  return `<circle r="${r * 2.1}" fill="url(#warm-glow)" opacity=".55"/>${s.out()}${crack}`;
}
/** a knot of light (two loops tied); origin centre */
export function lightKnot(c, r = 40) {
  const pts = [];
  for (let i = 0; i <= 60; i++) { const a = (i / 60) * PI * 2; pts.push([Math.sin(a) * r * 1.4, Math.sin(a * 2) * r * 0.55]); }
  return `<circle r="${r * 3.2}" fill="url(#halo-glow)"/>${sheet().p(c.ribbon(pts, 9), C.sun).x(c.ribbon(pts.slice(8, 22), 3), '#fff8e0', 'opacity=".85"').p(c.cut(c.circ(0, 0, 9, 12), 0.3, 3), C.halo).out()}`;
}

/* ---------- stone and law ---------- */
/** a small stone tablet with a rounded top and words on it; origin top-centre (hang it) */
export function tablet(c, lines, { w = 120, size = 15, col = mix(C.stone, C.rock, 0.45) } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const h = 34 + lines.length * size * 1.15;
  const s = sheet();
  s.p(c.cut([[-w / 2, h], [-w / 2, 16], ...c.arc(0, 16, w / 2, 16, PI, 2 * PI, 12), [w / 2, h]], 0.8, 6), col);
  s.x(c.ribbon([[-w / 2 + 6, h - 5], [w / 2 - 6, h - 5]], 2.4), shade(col, -0.18), 'opacity=".6"');
  s.x(c.poly(c.circ(0, 9, 3.2, 8)), shade(col, -0.45));
  const txt = lines.map((l, i) => `<text x="0" y="${(28 + (i + 0.8) * size * 1.15).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" fill="${shade(col, -0.62)}">${l}</text>`).join('');
  return s.out() + txt;
}
/** the two tablets of the Law (Moses); origin: bottom centre */
export function lawTablets(c, { w = 70, h = 96, col = mix(C.stone, C.rock, 0.5) } = {}) {
  const s = sheet();
  const one = (x0) => c.cut([[x0, 0], [x0, -h + w / 2], ...c.arc(x0 + w / 2, -h + w / 2, w / 2, w / 2, PI, 2 * PI, 12), [x0 + w, 0]], 0.8, 6);
  s.p(one(-w - 3) + one(3), col);
  let ln = '';
  for (let k = 0; k < 2; k++) for (let i = 0; i < 5; i++) { const x0 = k ? 12 : -w + 9, y = -h + w * 0.42 + i * 11; ln += c.ribbon([[x0, y], [x0 + w - 22 - c.rr(0, 12), y]], 2); }
  s.x(ln, shade(col, -0.45), 'opacity=".7"');
  return s.out();
}
/** a tick (✓) cut from paper; origin centre */
export function tick(c, r = 16, col = C.moss) {
  return sheet().p(c.ribbon([[-r * 0.8, 0], [-r * 0.2, r * 0.6], [r * 0.9, -r * 0.8]], r * 0.34), col).out();
}

/* ---------- riches ---------- */
/** a bulging money sack tied at the neck; origin: bottom centre */
export function sack(c, w = 50, col = mix(C.basket, C.wood3, 0.4)) {
  const s = sheet();
  s.p(c.cut([[-w * 0.46, 0], [-w * 0.55, -w * 0.5], [-w * 0.3, -w * 0.86], [-w * 0.12, -w * 0.96], [-w * 0.2, -w * 1.12], [w * 0.2, -w * 1.14], [w * 0.12, -w * 0.96], [w * 0.32, -w * 0.84], [w * 0.56, -w * 0.46], [w * 0.46, 0]], 0.8, 5), col);
  s.p(c.ribbon([[-w * 0.16, -w * 0.96], [w * 0.16, -w * 0.98]], 4), C.rope);
  s.x(c.cut(c.circ(0, -w * 0.46, w * 0.16, 10), 0.3, 3), C.sun, 'opacity=".9"');
  return s.out();
}
/** a cart piled with belongings; { body, wheel } — body origin: axle at (0,0); wheel origin: its hub */
export function cart(c, w = 230) {
  const s = sheet();
  // load: chests, rolled carpets, sacks, a jar, a lamp, a little house-deed scroll
  s.p(c.cut([[-w * 0.44, -60], [-w * 0.2, -100], [-w * 0.2, -60]], 0.5, 6) + c.cut(c.rect(-w * 0.38, -128, w * 0.32, 68), 0.5, 6), C.wood2);
  s.p(c.cut(c.rect(-w * 0.36, -122, w * 0.28, 10), 0.3, 4) + c.cut(c.rect(-w * 0.25, -104, 14, 12), 0.2, 3), C.ochre);
  s.p(c.cut(c.ell(w * 0.02, -118, w * 0.2, 18, 18), 0.5, 5), C.terracotta);
  s.x(c.ribbon([[-w * 0.14, -126], [w * 0.18, -126]], 3) + c.ribbon([[-w * 0.16, -110], [w * 0.2, -110]], 3), C.wheat, 'opacity=".8"');
  s.p(c.cut([[w * 0.1, -60], [w * 0.06, -110], [w * 0.14, -150], [w * 0.2, -150], [w * 0.28, -110], [w * 0.24, -60]], 0.5, 5), C.pot);
  s.p(c.cut(c.rect(w * 0.12, -158, w * 0.1, 10), 0.2, 3), C.wood2);
  s.p(c.cut(c.blob(w * 0.36, -84, 34, 26, 10, 0.18), 0.8, 5) + c.cut(c.blob(-w * 0.05, -84, 30, 24, 10, 0.18), 0.8, 5), mix(C.basket, C.wood3, 0.4));
  s.p(c.cut(c.rect(w * 0.26, -170, 44, 34), 0.4, 4), C.plumRobe);
  s.x(c.ribbon([[w * 0.26, -160], [w * 0.26 + 44, -160]], 3), C.sun);
  // bed of the cart
  s.p(c.cut([[-w / 2, -62], [w / 2, -62], [w / 2 - 6, -20], [-w / 2 + 6, -20]], 0.5, 8), C.wood);
  let pl = '';
  for (let y = -52; y < -24; y += 10) pl += c.ribbon([[-w / 2 + 8, y], [w / 2 - 8, y]], 1.2);
  s.x(pl, shade(C.wood, -0.25), 'opacity=".6"');
  // the shafts he pulls by
  s.p(c.ribbon([[w / 2 - 10, -34], [w / 2 + 110, -70]], 7), C.wood2);
  const wh = sheet();
  wh.p(c.ribbon(c.arc(0, 0, 34, 34, 0, PI * 2, 24), 7), C.wood2);
  let sp = '';
  for (let i = 0; i < 6; i++) { const a = (i / 6) * PI; sp += c.ribbon([[Math.cos(a) * 32, Math.sin(a) * 32], [-Math.cos(a) * 32, -Math.sin(a) * 32]], 3.4); }
  wh.p(sp, C.wood3).p(c.cut(c.circ(0, 0, 7, 10), 0.2, 3), C.wood2);
  return { body: s.out(), wheel: wh.out() };
}
/** a gold star of heavenly treasure (glows); origin centre */
export function treasureStar(c, r = 14) {
  return `<circle r="${r * 2.6}" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.star(0, 0, r, r * 0.45, 5), 0.3, 3), C.halo).x(c.poly(c.star(0, 0, r * 0.5, r * 0.22, 5)), C.star).out()}`;
}
/** a giant sewing needle standing up, eye at the top; origin: point (bottom); eye centre at (0, -h + 60) */
export function bigNeedle(c, h = 420, col = mix(C.rock2, C.skyBlue2, 0.35)) {
  const s = sheet();
  const w = 32;
  const body = [[0, 0], [-w * 0.35, -h * 0.3], [-w / 2, -h * 0.6], [-w / 2, -h + 22], ...c.arc(0, -h + 22, w / 2, 20, PI, 2 * PI, 10), [w / 2, -h * 0.6], [w * 0.35, -h * 0.3]];
  const eye = [...c.arc(0, -h + 40, 7, 7, PI, 2 * PI, 6), [7, -h + 86], ...c.arc(0, -h + 86, 7, 7, 0, PI, 6)];
  s.p(c.cut(body, 0.4, 8) + c.hole(eye, 0.2, 4), col);
  s.x(c.ribbon([[-5, -h * 0.2], [-8, -h + 100]], 3), '#fffaf0', 'opacity=".7"');
  return s.out();
}

/* ---------- glory, cup and baptism ---------- */
/** a seat of light (a throne of glory); origin: ground centre */
export function lightThrone(c, sc = 1, col = C.halo) {
  const s = sheet();
  const P = (pts) => pts.map(([x, y]) => [x * sc, y * sc]);
  s.p(c.cut(P([[-36, 0], [-36, -150], [-24, -170], [0, -182], [24, -170], [36, -150], [36, -62], [-18, -62], [-18, 0]]), 0.5, 6), col);
  s.p(c.cut(P([[-40, -58], [48, -58], [48, -46], [-40, -46]]), 0.4, 5), shade(col, -0.12));
  s.p(c.cut(P([[36, -46], [46, -46], [44, 0], [38, 0]]), 0.3, 4), shade(col, -0.18));
  s.x(c.cut(P(c.star(0, -136, 12, 5, 8, 0)), 0.2, 3), '#fffaf0');
  return `<circle cx="0" cy="${-100 * sc}" r="${150 * sc}" fill="url(#halo-glow)"/>${s.out()}`;
}
/** a chalice; origin: base. dark: the cup of suffering (dark wine) */
export function chalice(c, h = 70, { dark = true } = {}) {
  const s = sheet();
  const k = h / 70;
  s.p(c.cut([[-22 * k, 0], [-14 * k, -8 * k], [-4 * k, -10 * k], [-4 * k, -34 * k], [-24 * k, -46 * k], [-28 * k, -70 * k], [28 * k, -70 * k], [24 * k, -46 * k], [4 * k, -34 * k], [4 * k, -10 * k], [14 * k, -8 * k], [22 * k, 0]], 0.4, 5), C.sun);
  s.x(c.cut(c.ell(0, -69 * k, 26 * k, 5 * k, 14), 0.2, 3), dark ? shade(C.plumRobe, -0.45) : C.star);
  s.x(c.ribbon([[-18 * k, -60 * k], [-14 * k, -46 * k]], 3 * k), '#fff8e0', 'opacity=".7"');
  return s.out();
}
/** a basin and a towel over the arm (for serving); basin origin: base */
export function basinBowl(c, w = 86) {
  const cop = mix(C.clay, C.sun, 0.35);
  const s = sheet();
  s.p(c.cut([[-w / 2, -30], [w / 2, -30], [w * 0.34, -8], [w * 0.2, 0], [-w * 0.2, 0], [-w * 0.34, -8]], 0.4, 5), cop);
  s.p(c.cut(c.ell(0, -30, w / 2 + 3, 5, 18), 0.3, 4), shade(cop, 0.15));
  s.x(c.cut(c.ell(0, -30, w / 2 - 4, 3, 16), 0.2, 3), C.lake);
  return s.out();
}
export function towel(c, len = 60) {
  return sheet().p(c.cut([[-8, 0], [8, 0], [10, len], [0, len + 4], [-10, len]], 0.5, 5), C.linen).x(c.ribbon([[-9, len - 10], [9, len - 10]], 2.2), C.dustyBlue, 'opacity=".7"').out();
}
/** a jug for pouring water; origin base, spout at about (26, -60) */
export function ewer(c, col = C.pot) {
  const s = sheet();
  s.p(c.cut([[-16, 0], [-24, -22], [-20, -44], [-10, -54], [-8, -62], [12, -64], [26, -62], [12, -54], [16, -44], [22, -22], [16, 0]], 0.5, 5), col);
  s.p(c.ribbon(c.qbez([-18, -52], [-38, -44], [-20, -24], 8), 4.6), shade(col, -0.12));
  return s.out();
}

/* ---------- power ---------- */
/** a high stepped dais with a throne on top; origin: ground centre; the seat is at (0, -h - 58) */
export function highSeat(c, h = 170) {
  const s = sheet();
  for (let i = 0; i < 4; i++) { const w = 220 - i * 40, y = -i * (h / 4); s.p(c.cut(c.rect(-w / 2, y - h / 4, w, h / 4 + 2), 0.5, 7), i % 2 ? C.stone2 : C.stone); }
  const th = sheet();
  th.p(c.cut([[-40, -h], [-40, -h - 150], [-26, -h - 170], [0, -h - 182], [26, -h - 170], [40, -h - 150], [40, -h - 60], [-22, -h - 60], [-22, -h]], 0.5, 6), C.sun);
  th.p(c.cut([[-32, -h - 64], [-32, -h - 150], [0, -h - 166], [32, -h - 150], [32, -h - 64]], 0.4, 6), C.plumRobe);
  th.p(c.cut([[-44, -h - 58], [50, -h - 58], [50, -h - 46], [-44, -h - 46]], 0.4, 6), shade(C.sun, -0.15));
  return s.out() + th.out();
}
/** a king's crown (head coords) */
export function crown(c, col = C.sun) {
  const s = sheet();
  s.p(c.cut([[-17, -12], [17, -12], [18, -22], [12, -31], [8, -21], [4, -35], [-1, -22], [-6, -34], [-10, -21], [-14, -31], [-19, -22]], 0.3, 3), col);
  s.x(c.poly(c.circ(4, -17, 2.2, 6)) + c.poly(c.circ(-7, -17, 2, 6)), C.terracotta);
  return s.out();
}
/** a Roman helmet (head coords) */
export function helmet(c, col = C.rock2) {
  const s = sheet();
  s.p(c.cut([...c.arc(0, -2, 21, 21, PI * 0.98, PI * 2.02, 14), [21, -2], [-21, -2]], 0.4, 4), col);
  s.p(c.cut([[-8, -22], [-2, -36], [10, -38], [5, -22]], 0.4, 3), shade(col, 0.1));
  return s.out();
}
/** a tall priestly head-dress (head coords) */
export function priestHat(c, col = C.linen) {
  return sheet().p(c.cut([[-19, -8], [-17, -30], [-6, -42], [8, -42], [18, -30], [20, -8]], 0.4, 4), col).out();
}
/** a crown of thorns — a dark, restrained silhouette; origin centre */
export function thornCrown(c, r = 46, col = '#3b2a22') {
  let d = c.ribbon(c.arc(0, 0, r, r * 0.34, 0, PI * 2, 36), 5) + c.ribbon(c.arc(0, -3, r * 0.94, r * 0.3, 0.4, PI * 2 + 0.4, 36), 3.4);
  for (let i = 0; i < 22; i++) { const a = (i / 22) * PI * 2, x = Math.cos(a) * r, y = Math.sin(a) * r * 0.34, sd = i % 2 ? 1 : -1; d += c.poly([[x - 2, y], [x + c.rr(-8, 8), y + sd * c.rr(9, 15)], [x + 2, y]]); }
  return `<path d="${d}" fill="${col}"/>`;
}
/** a whip (restrained: a dark cord-and-handle silhouette); origin: handle end */
export function whip(c, col = '#3b2a22') {
  let d = c.ribbon([[0, 0], [0, -40]], 6);
  [-0.4, 0, 0.4].forEach((a) => { d += c.ribbon(c.qbez([0, -40], [30 * Math.sin(a) - 10, -70], [60 * Math.sin(a) + 10, -100 + Math.abs(a) * 20], 10), 2.2); });
  return `<path d="${d}" fill="${col}"/>`;
}

/* ---------- Jericho: the blind beggar ---------- */
/** the beggar's bowl with a couple of coins; origin: base */
export function beggarBowl(c) {
  return sheet().p(c.cut([[-18, -12], [18, -12], [12, -2], [5, 0], [-5, 0], [-12, -2]], 0.4, 4), mix(C.pot, C.soil, 0.3))
    .p(c.cut(c.ell(0, -12, 18, 3.5, 12), 0.2, 3), shade(C.pot, -0.35))
    .p(c.cut(c.circ(-5, -14, 4, 8), 0.2, 2) + c.cut(c.circ(4, -15, 3.6, 8), 0.2, 2), C.sun).out();
}
/** the beggar's cloak, flying off (shape spread wide); origin centre */
export function cloakFly(c, col = LOOK.bart.mantle) {
  const s = sheet();
  s.p(c.cut([[-70, -20], [-30, -40], [10, -34], [60, -44], [84, -10], [64, 20], [70, 50], [30, 38], [0, 56], [-40, 40], [-80, 44], [-66, 10]], 1.2, 7), col);
  s.x(c.ribbon([[-50, 20], [50, 10]], 3) + c.ribbon([[-40, 32], [40, 30]], 2), shade(col, -0.2), 'opacity=".5"');
  return s.out();
}
/** the cloak spread on the ground in front of him for alms; origin centre */
export function cloakSpread(c, col = LOOK.bart.mantle) {
  const s = sheet();
  s.p(c.cut([[-80, 0], [-64, -10], [0, -14], [70, -10], [86, 2], [70, 12], [0, 14], [-66, 12]], 0.9, 7), col);
  s.x(c.ribbon([[-60, 4], [60, 2]], 2) + c.ribbon([[-52, -4], [50, -6]], 1.6), shade(col, -0.2), 'opacity=".5"');
  return s.out();
}

/* ---------- helpers ---------- */
/** a frown that covers the paper smile (head coords); show with face(el, 'frown', 1). Beardless faces only. */
export function frown(c, skin = C.skin) {
  return `<g data-part="frown" opacity="0"><path d="${c.poly(c.ell(10, 8.6, 5, 3.4, 12))}" fill="${skin}"/><path d="${c.ribbon(c.arc(10, 11.6, 3.4, 2.6, Math.PI + 0.35, 2 * Math.PI - 0.35, 6), 1.2)}" fill="${shade(skin, -0.45)}"/></g>`;
}
/** a disciple puppet markup with brows/tear bits (for amazement, indignation) */
export function withBits(c, markup, bits) { return markup.replace('</g></g><g class="armF"', `${bits}</g></g><g class="armF"`); }
/** show / hide face bits inside a puppet element: part 'angry' | 'sad' | 'tear' */
export function face(el, part, o) {
  if (!el) return;
  if (!el.__parts) el.__parts = {};
  if (!(part in el.__parts)) el.__parts[part] = el.querySelector(`[data-part="${part}"]`);
  fade(el.__parts[part], o);
}
/** a little paper crowd-person look that is never a child */
export const adult = (c, extra = {}) => crowdPerson(c, extra);
export { CAST, person, sheet, shade, mix, pose, olive, palm, rock, bush, cloud, band, hillsWith, grass, hanging, swing, sunCut };
