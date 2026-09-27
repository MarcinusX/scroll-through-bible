// John 3 — shared cut-outs: Nicodemus, the night rooftop in Jerusalem (vv. 1–13), beams of light,
// the wind's streamers and leaves, the bronze serpent, the springs of Aenon and small props.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging } from '../kit.js';
import { band, stars, moon, town, olive, cypress, grass, rock, reeds } from '../../assets/nature.js';
import { oilLamp } from '../../assets/things.js';
import { tr } from '../../core/i18n.js';
import { fade } from '../../core/anim.js';

export { kf, moving, hand, headAt, addToHead, addToBody, speech, thought, GLYPH, spark, heart, scrap, wordSlip, lantern, candle, scrollOpen, scrollRolled, johnsOpts, canopy, garland, tambourine, cup, loaf, bowl, coin, turban } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, strip, question, pharisee, man, woman, shadowPerson, silhouette, stoneHeart, sparkle, scrollRoll, along } from '../mark3/lib.js';
export { JOHN_B, voiceRings, hang2, tagOnString, plate, flame, drops, shell, snake, bars, dove, flapWings } from '../mark1/lib.js';
export { globe, glory, soulLight, bigQuestion, say, tag, heavenPanel, lightCrown } from '../mark8/lib.js';
export { storyFrame, SEPIA, sheep, crown, tassels } from '../mark6/lib.js';
export { jerusalem } from '../mark11/lib.js';
export { kingdomGate, gateDoor } from '../mark12/lib.js';
export { crossSil } from '../mark15/lib.js';
export { seal, lamb, worldMap } from '../mark14/lib.js';
export { lightThrone } from '../mark10/lib.js';
import { addToHead, addToBody } from '../mark2/lib.js';
import { jerusalem } from '../mark11/lib.js';
import { tassels } from '../mark6/lib.js';

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const INK = '#3b2a22';
export const JESUS = CAST.jesus;
export { tr };

/* ---------- the cast ---------- */
/** Nicodemus: a ruler of the Jews — deep teal-indigo mantle, gold belt, silver beard, tall banded cap */
export const NICO = {
  robe: C.linen, mantle: mix(C.indigo, C.teal2, 0.5), mantleArm: true, belt: C.sun, skin: C.skin2,
  hair: C.greyHair, hairStyle: 'wrap', veil: C.cream, veil2: C.sun, beard: 'full', beardColor: '#dcd5c8',
};
function nicoCap(c) {
  const s = sheet();
  s.p(c.cut([[-19, -12], [-17, -30], [-10, -37], [4, -38], [14, -34], [19, -26], [20, -12]], 0.4, 4), C.cream);
  s.p(c.cut([[-19, -18], [20, -18], [20, -13], [-19, -13]], 0.2, 4), mix(C.indigo, C.teal2, 0.4));
  s.x(c.ribbon([[-18, -24], [19, -24]], 2), C.sun);
  s.x(c.poly(c.star(10, -21, 3.2, 1.3, 4, 0)), C.sun);
  return s.out();
}
/** Nicodemus as a puppet (extra: pose, holdF, …) */
export function nicodemus(c, extra = {}) {
  return addToBody(addToHead(person(c, { ...NICO, ...extra }), nicoCap(c)), tassels(c));
}
/** Moses in the wilderness: white hair and beard, a shepherd's mantle */
export const MOSES = { robe: mix(C.dune, C.linen, 0.4), mantle: C.clay, hair: '#eee7da', hairStyle: 'wild', beard: 'wild', beardColor: '#f1ebdf', skin: C.skin3, belt: C.leather };
/** an old man with a cane (the comic of v. 4) */
export const OLDMAN = { robe: C.stone2, mantle: C.dustyBlue, hair: '#ece5d8', hairStyle: 'bald', beard: 'wild', beardColor: '#efe8dc', skin: C.skin2, belt: C.leather };

/* ---------- skies ---------- */
export const NIGHT = ['#1b2046', '#2d3565', '#505381'];
export const DAWN = ['#f2cfb4', '#f6dfc2', '#f8ead3'];
export const DAY = ['#cfe0da', '#efe6cd', '#f6e8cf'];

/* ---------- the rooftop in Jerusalem at night ---------- */
export const ROOF = { FLOOR: 700, JX: 840, NX: 600, LAMP: 722 };
/** the camera on the rooftop: close on the two of them */
export const ROOFCAM = { x: 0, y: 150, z: 1.45 };
/**
 * Night sky, the moon on a string, sleeping Jerusalem, the neighbouring roofs, the parapet and a lamp.
 * Returns { sk, hang, moon, lamp: {glow, flame}, fg, city }.
 */
export function roofSet(S, { lampOn = true, stairs = false } = {}) {
  const c = S.c;
  const sk = sky(S, NIGHT);
  const hangL = S.layer({ par: 0.03, sh: 4 });
  hangL.add(`<g>${stars(c, { x0: -900, x1: 2500, y0: -700, y1: 430, n: 140 })}</g>`);
  const moonEl = hanging(hangL, moon(c, 42), { x: 1210, y: 150, len: 800 });
  // far hills and the Mount of Olives
  S.layer({ par: 0.07, sh: 2 }).add(band(c, { y: 440, amps: [22, 8, 3], lens: [1000, 360, 130], color: mix(C.indigo, C.storm2, 0.5) }).markup);
  // Jerusalem asleep: the city in the moonlight, then a veil of night over it and a few lit windows
  const city = S.layer({ par: 0.14, sh: 3 });
  city.add(`<g transform="translate(600 560)">${jerusalem(c, 0.62, { tglow: false })}</g>`);
  city.add(`<rect x="-3000" y="-600" width="8000" height="2600" fill="${mix(C.night, C.indigo, 0.3)}" opacity=".5"/>`);
  let win = '';
  [[330, 500], [372, 488], [420, 506], [250, 512], [612, 520], [890, 522], [960, 512], [1060, 528], [720, 470]].forEach(([x, y]) => { win += c.poly(c.rect(x, y, 5, 6)); });
  city.add(`<path d="${win}" fill="${C.lampFlame}" opacity=".85"/>`);
  // neighbouring roofs, lower down
  const near = S.layer({ par: 0.3, sh: 3 });
  const nr = sheet();
  const roofs = [[-900, 590, 300], [-560, 610, 240], [-300, 596, 260], [-20, 612, 220], [230, 600, 240], [1240, 602, 260], [1520, 590, 300], [1840, 610, 300], [2160, 596, 340]];
  roofs.forEach(([x, y, w]) => { nr.p(c.cut(c.rect(x, y, w, 1100), 0.6, 10), mix(C.plaster2, C.indigo, 0.45)); nr.p(c.cut(c.rect(x - 4, y - 6, w + 8, 8), 0.4, 8), mix(C.roof, C.indigo, 0.45)); });
  near.add(nr.out());
  let nw = '';
  [[60, 640], [300, 650], [1300, 640], [1600, 632], [-200, 640]].forEach(([x, y]) => { nw += c.poly(c.rect(x, y, 12, 14)); });
  near.add(`<path d="${nw}" fill="${C.lampFlame}" opacity=".7"/>`);
  near.add(cypress(c, 460, 640, 170, mix(C.moss2, C.indigo, 0.4)) + cypress(c, 1180, 630, 140, mix(C.moss2, C.indigo, 0.4)));

  // our roof: the back parapet, the floor, an awning on poles, plants
  const R = S.layer({ par: 0.5, sh: 4 });
  const F = ROOF.FLOOR;
  const floorCol = mix(C.plaster2, C.indigo, 0.42), wallCol = mix(C.plaster2, C.indigo, 0.5);
  const rs = sheet();
  rs.p(c.cut([[-900, F - 64], [2500, F - 64], [2500, 1700], [-900, 1700]], 0.6, 14), floorCol);
  rs.p(c.cut([[-900, F - 118], [2500, F - 118], [2500, F - 64], [-900, F - 64]], 0.6, 12), wallCol);
  rs.p(c.cut([[-900, F - 126], [2500, F - 126], [2500, F - 114], [-900, F - 114]], 0.4, 12), mix(C.roof, C.indigo, 0.3));
  let joints = '';
  for (let x = -880; x < 2500; x += 70) joints += c.ribbon([[x + c.rr(-6, 6), F - 112], [x + c.rr(-6, 6), F - 68]], 1.2);
  rs.x(joints, shade(wallCol, -0.18), 'opacity=".45"');
  let tiles = '';
  for (let y = F - 40; y < 1000; y += 46 + (y - F) * 0.2) tiles += c.ribbon([[-900, y], [2500, y + c.rr(-2, 2)]], 1.2);
  rs.x(tiles, shade(floorCol, -0.12), 'opacity=".4"');
  R.add(rs.out());
  // awning on the left
  const aw = sheet();
  aw.p(c.cut(c.rect(318, F - 300, 9, 300), 0.3, 8) + c.cut(c.rect(508, F - 312, 9, 312), 0.3, 8), mix(C.wood2, C.indigo, 0.25));
  aw.p(c.cut([[300, F - 300], [540, F - 318], [548, F - 300], [306, F - 284]], 0.5, 8), mix(C.terracotta, C.indigo, 0.3));
  R.add(aw.out());
  // pots with plants
  const pt = sheet();
  [[250, 1.1], [1190, 0.8]].forEach(([x, k]) => {
    pt.p(c.cut([[x - 22 * k, F], [x - 26 * k, F - 40 * k], [x + 26 * k, F - 40 * k], [x + 22 * k, F]], 0.4, 5), mix(C.pot, C.indigo, 0.3));
  });
  R.add(pt.out() + olive(c, 250, F - 40, 0.5, { leaf: mix(C.olive, C.indigo, 0.3), leaf2: mix(C.sage, C.indigo, 0.3), trunk: mix(C.wood2, C.indigo, 0.3) }));
  if (stairs) {
    // the outside staircase climbing up to the roof on the right
    const st = sheet();
    st.p(c.cut([[1330, F - 64], [1640, F + 250], [1640, 1700], [1330, 1700]], 0.5, 10), mix(C.plaster2, C.indigo, 0.4));
    let steps = '';
    for (let i = 0; i < 9; i++) { const x = 1330 + i * 34, y = F - 64 + i * 34; steps += c.cut(c.rect(x, y - 4, 40, 8), 0.3, 5); }
    st.p(steps, mix(C.stone2, C.indigo, 0.3));
    R.add(st.out());
  }
  // mats and cushions, the low table with a lamp
  const P = S.layer({ par: 0.5, sh: 4 });
  const mt = sheet();
  mt.p(c.cut([[470, F + 8], [980, F + 8], [1010, F + 34], [440, F + 34]], 0.5, 8), mix(C.ochreRobe, C.indigo, 0.25));
  let stripes = '';
  for (let i = 0; i < 4; i++) stripes += c.ribbon([[450 + i * 2, F + 14 + i * 5], [1000 - i * 2, F + 14 + i * 5]], 1.4);
  mt.x(stripes, mix(C.terracotta, C.indigo, 0.25), 'opacity=".6"');
  mt.p(c.cut(c.blob(ROOF.JX + 20, F + 2, 48, 13, 12, 0.1), 0.5, 5) + c.cut(c.blob(ROOF.NX - 20, F + 2, 48, 13, 12, 0.1), 0.5, 5), mix(C.jesusMantle, C.indigo, 0.2));
  P.add(mt.out());
  const tb = sheet();
  tb.p(c.cut(c.rect(ROOF.LAMP - 44, F - 14, 88, 10), 0.3, 6), mix(C.wood, C.indigo, 0.2));
  tb.p(c.cut(c.rect(ROOF.LAMP - 36, F - 4, 8, 22), 0.2, 4) + c.cut(c.rect(ROOF.LAMP + 28, F - 4, 8, 22), 0.2, 4), mix(C.wood2, C.indigo, 0.2));
  P.add(tb.out());
  // the glow is its own still piece, so the flickering flame only repaints itself
  const lampT = `translate(${ROOF.LAMP - 14} ${F - 14}) scale(1.1)`;
  const glowEl = P.add(`<g transform="${lampT}"><circle class="glow" cx="34" cy="-30" r="150" fill="url(#warm-glow)"/></g>`);
  const lampEl = P.add(`<g transform="${lampT}">${oilLamp(c).replace(/<circle class="glow"[^>]*\/>/, '')}</g>`);
  const glow = glowEl.querySelector('.glow'), fl = lampEl.querySelector('.flame');
  if (!lampOn) { glow.setAttribute('opacity', '0'); fl.setAttribute('opacity', '0'); }
  return { sk, hang: hangL, moon: moonEl, lamp: { el: lampEl, glow, flame: fl }, R, P, city, near };
}
/** flicker a lamp's flame (flame pivot at its base) */
export function flicker(lamp, time, on = 1, bend = 0) {
  const k = 1 + Math.sin(time * 9) * 0.06 + Math.sin(time * 13.7) * 0.04;
  pose(lamp.flame, { x: 35, y: -16, sx: k * (1 - Math.abs(bend) * 0.15), sy: (1 / k) * (1 - Math.abs(bend) * 0.25), r: bend * 55 + Math.sin(time * 5) * 2, o: on });
  if (lamp.glow) fade(lamp.glow, on * 0.9);
}

/** pose, but a hidden piece only gets its opacity set (so it never repaints while invisible) */
export function vpose(el, p) {
  if (p.o !== undefined && p.o <= 0.001) { fade(el, 0); return; }
  pose(el, p);
}
/** a hung piece that sways only while it is shown (hidden pieces are frozen, so they never repaint) */
export function hangAt(el, x, y, time, on, amp = 1.4, speed = 0.9, seed = 0) {
  if (on <= 0.001) { pose(el, { x, y, o: 0 }); return; }
  pose(el, { x, y, r: Math.sin(time * speed + seed) * amp, oy: 0, o: on });
}

/* ---------- light ---------- */
/** a vertical gradient for beams of light; returns its id */
export function beamGrad(S, name = 'beam', col = '#fff3cf') {
  const id = S.id(name);
  S.defs(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity="0"/><stop offset=".25" stop-color="${col}" stop-opacity=".75"/><stop offset="1" stop-color="${col}" stop-opacity=".25"/></linearGradient>`);
  return id;
}
/** a beam of light falling from (0,0) down to y = h; widening from w0 to w1 */
export function lightBeam(id, w0 = 40, w1 = 160, h = 600) {
  return `<path d="M${-w0 / 2} 0L${w0 / 2} 0L${w1 / 2} ${h}L${-w1 / 2} ${h}Z" fill="url(#${id})"/><ellipse cx="0" cy="${h}" rx="${w1 * 0.6}" ry="${w1 * 0.12}" fill="#fff3cf" opacity=".35"/>`;
}
/** a radial pool of darkness with a clear middle — for the light-and-darkness stage */
export function darkPool(S, { cx = 800, cy = 560, r0 = 130, r1 = 520, col = '#120f24', name = 'pool' } = {}) {
  const id = S.id(name);
  S.defs(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r1}"><stop offset="${(r0 / r1).toFixed(3)}" stop-color="${col}" stop-opacity="0"/><stop offset=".72" stop-color="${col}" stop-opacity=".62"/><stop offset="1" stop-color="${col}" stop-opacity=".86"/></radialGradient>`);
  return `<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${id})"/>`;
}

/* ---------- plates, words ---------- */
/** a round hanging plate (cream disc on a gold rim) with an inner picture clipped to it; origin centre */
export function roundel(c, inner, { r = 80, face = C.parchment, rim = C.haloRim, id } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 7, 40), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r, 40), 0.5, 5), face);
  const clip = id ? `<defs><clipPath id="${id}"><circle r="${r - 1}"/></clipPath></defs><g clip-path="url(#${id})">${inner}</g>` : inner;
  return s.out() + clip;
}
/** a paper word on a strip (origin centre) */
export function word(c, text, { size = 22, fill = C.cream, ink = C.ink, w, bold = false } = {}) {
  const ww = w || Math.max(60, text.length * size * 0.5 + size * 1.3);
  const hh = size * 1.5;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 2], [ww / 2 + 2, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic"${bold ? ' font-weight="600"' : ''} fill="${ink}">${text}</text>`;
}
/** a hand-cut "!" (origin centre) */
export function bang(c, r = 20, col = C.terracotta) {
  return sheet().p(c.cut([[-r * 0.22, -r], [r * 0.22, -r], [r * 0.12, r * 0.35], [-r * 0.12, r * 0.35]], 0.3, 4), col).p(c.cut(c.circ(0, r * 0.7, r * 0.16, 8), 0.2, 3), col).out();
}

/* ---------- birth from above ---------- */
/** a bud on a stem: two petals (.petL / .petR, pivot at 0,-h) and a light inside (.core) */
export function bud(c, { h = 90, col = C.roseRobe, col2 = shade(C.roseRobe, -0.1) } = {}) {
  const s = sheet();
  s.p(c.ribbon(c.qbez([0, 0], [6, -h * 0.5], [0, -h], 10), (u) => 5 - u * 2), C.moss);
  s.p(c.cut([[0, -h * 0.35], [-26, -h * 0.55], [-34, -h * 0.5], [-4, -h * 0.3]], 0.3, 4) + c.cut([[2, -h * 0.55], [28, -h * 0.72], [34, -h * 0.66], [4, -h * 0.48]], 0.3, 4), C.leaf);
  const pet = (d) => c.cut([[0, 0], [d * 6, -12], [d * 20, -30], [d * 14, -52], [d * 2, -64], [0, -60], [d * -2, -30]], 0.3, 4);
  return `${s.out()}<g transform="translate(0 ${-h})"><g class="core" opacity="0"><circle cy="-34" r="60" fill="url(#halo-glow)"/><path d="${c.cut(c.ell(0, -34, 11, 16, 14), 0.2, 3)}" fill="${C.star}"/></g><g class="petL"><path d="${pet(-1)}" fill="${col2}"/></g><g class="petR"><path d="${pet(1)}" fill="${col}"/></g></g>`;
}
/** a wooden rocking cradle with a blanket; origin: floor centre */
export function cradle(c, w = 90) {
  const s = sheet();
  s.p(c.cut([...c.arc(0, -46, w / 2 + 10, 46, 0.1, PI - 0.1, 14)], 0.4, 5), C.wood2);
  s.p(c.cut([[-w / 2, -60], [w / 2, -60], [w / 2 - 6, -18], [-w / 2 + 6, -18]], 0.4, 6), C.wood3);
  s.p(c.cut([[-w / 2 - 2, -66], [-w / 2 + 10, -66], [-w / 2 + 8, -26], [-w / 2, -26]], 0.3, 4), C.wood);
  s.p(c.cut(c.blob(4, -60, w * 0.46, 12, 12, 0.12), 0.5, 5), C.skyVeil);
  return s.out();
}
/** a swaddled baby (origin centre) */
export function baby(c) {
  return sheet().p(c.cut(c.ell(0, 0, 22, 10, 16), 0.3, 4), C.linen).p(c.cut(c.circ(20, -3, 9, 12), 0.2, 3), C.skin).x(c.ribbon(c.arc(22, -2, 2, 1.4, 0.2, PI - 0.2, 5), 1), C.inkSoft).out();
}
/** a walking cane (holdF) */
export function cane(c, len = 118) {
  return sheet().p(c.ribbon([[0, -6], [3, len - 60]], 5), C.wood2).p(c.ribbon(c.arc(-6, -6, 7, 7, 0, -PI, 8), 5), C.wood2).out();
}

/* ---------- wind ---------- */
/** a curling wind-stroke: a paper strip that ends in a curl; origin at its tail */
export function windStroke(c, len = 180, col = '#e9e4f3') {
  const pts = [];
  for (let i = 0; i <= 18; i++) { const u = i / 18; pts.push([u * len, Math.sin(u * PI * 1.4) * 10]); }
  const curl = c.arc(len + 2, -12, 14, 14, PI * 0.5, PI * 2.3, 14);
  return `<path d="${c.ribbon([...pts, ...curl], (u) => 1.5 + Math.sin(u * PI) * 5)}" fill="${col}" opacity=".78"/>`;
}
/** a single leaf (origin centre) */
export function leaf(c, col = C.leaf, r = 11) {
  return sheet().p(c.cut([[-r, 0], [-r * 0.3, -r * 0.55], [r * 0.6, -r * 0.4], [r, 0], [r * 0.4, r * 0.45], [-r * 0.4, r * 0.4]], 0.3, 3), col).x(c.ribbon([[-r, 0], [r * 0.8, 0]], 1), shade(col, -0.2)).out();
}
/** a paper streamer tied at its top (origin); segments .seg0…3 each pivoting at their top */
export function streamer(c, col, len = 90) {
  const n = 4, sl = len / n;
  let out = '';
  for (let i = n - 1; i >= 0; i--) {
    const w = 12 - i * 1.6;
    const d = c.cut([[-w / 2, 0], [w / 2, 0], [w / 2 - 0.6, sl + 2], [-w / 2 + 0.6, sl + 2]], 0.3, 4);
    const tail = i === n - 1 ? `<path d="${c.poly([[-w / 2 + 0.6, sl], [0, sl + 10], [w / 2 - 0.6, sl]])}" fill="${col}"/>` : '';
    out = `<g class="seg${i}"><path d="${d}" fill="${i % 2 ? shade(col, -0.08) : col}"/>${tail}${out ? `<g transform="translate(0 ${sl.toFixed(1)})">${out}</g>` : ''}</g>`;
  }
  return out;
}
/** blow a streamer: bend (−1…1) sideways, flutter with time */
export function blowStreamer(el, bend, time, seed = 0) {
  if (!el._segs) el._segs = [0, 1, 2, 3].map((i) => el.querySelector(`.seg${i}`));
  el._segs.forEach((g, i) => {
    const f = Math.sin(time * 11 + seed + i * 1.3) * 9 * Math.abs(bend) * (0.4 + i * 0.25);
    pose(g, { r: -bend * (28 + i * 16) + f });
  });
}
/** a dandelion seed carrying a little light (origin: the seed) */
export function lightSeed(c) {
  let fil = '';
  for (let i = 0; i < 9; i++) { const a = -PI / 2 + (i - 4) * 0.28; fil += c.ribbon([[0, -10], [Math.cos(a) * 26, -10 + Math.sin(a) * 24]], 0.9); }
  return `<circle cy="-14" r="30" fill="url(#warm-glow)" opacity=".8"/><path d="${fil}" fill="#fbf4df"/><path d="${c.ribbon([[0, 0], [0, -10]], 1.4)}" fill="${C.wheat2}"/><path d="${c.cut(c.ell(0, 2, 3, 5, 8), 0.1, 2)}" fill="${C.halo}"/>`;
}

/* ---------- ladder of heaven ---------- */
/** a ladder of light from (0,0) down to (0,h); origin top */
export function ladder(c, h = 600, w = 70) {
  const s = sheet();
  s.p(c.ribbon([[-w / 2, 0], [-w / 2 - 20, h]], 7) + c.ribbon([[w / 2, 0], [w / 2 + 20, h]], 7), C.sun);
  let r = '';
  for (let y = 30; y < h; y += 42) { const k = y / h; r += c.ribbon([[-w / 2 - 20 * k, y], [w / 2 + 20 * k, y]], 4.5); }
  s.p(r, C.halo);
  return `<path d="M${-w / 2} 0L${w / 2} 0L${w / 2 + 20} ${h}L${-w / 2 - 20} ${h}Z" fill="#fff3cf" opacity=".4"/><circle cy="${h}" r="${w * 1.4}" fill="url(#halo-glow)"/>${s.out()}`;
}

/* ---------- the wilderness (Num 21) ---------- */
/** the bronze serpent on its pole; origin: foot of the pole */
export function serpentPole(c, h = 300) {
  const s = sheet();
  const bronze = mix(C.ochre, C.clay, 0.45);
  s.p(c.cut([[-5, 0], [-4, -h], [4, -h - 2], [5, 0]], 0.3, 8), C.wood2);
  s.p(c.cut([[-56, -h + 20], [56, -h + 18], [56, -h + 28], [-56, -h + 30]], 0.3, 6), C.wood2);
  // the snake coils around the pole and rears its head above the crossbar
  let coil = '';
  for (let i = 0; i < 4; i++) { const y = -h + 60 + i * 34; coil += c.ribbon(c.arc(0, y, 16, 8, -0.3, PI + 0.3, 10), 9); }
  s.p(coil, bronze);
  s.p(c.ribbon(c.cbez([12, -h + 60], [26, -h + 20], [-20, -h - 10], [8, -h - 44], 16), (u) => 9 - u * 2), bronze);
  s.p(c.cut(c.ell(14, -h - 48, 13, 8, 12, 0.3), 0.3, 3), bronze);
  s.x(c.poly(c.circ(19, -h - 51, 2, 6)), C.ink);
  s.x(c.ribbon(c.arc(0, -h + 94, 16, 8, 0.2, PI - 0.2, 8), 2), shade(bronze, 0.35), 'opacity=".7"');
  return `<circle cy="${-h - 20}" r="90" fill="url(#warm-glow)" class="glow" opacity="0"/>${s.out()}`;
}
/** a desert tent; origin: ground centre */
export function tent(c, w = 170, h = 100, col = mix(C.dune, C.wood3, 0.3)) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w * 0.35, -h * 0.8], [0, -h], [w * 0.35, -h * 0.8], [w / 2, 0]], 0.6, 7), col);
  s.p(c.cut([[-12, 0], [0, -h * 0.7], [14, 0]], 0.3, 5), shade(col, -0.4));
  let st = '';
  for (let i = -2; i <= 2; i++) st += c.ribbon([[i * w * 0.14, -h * 0.9 + Math.abs(i) * 12], [i * w * 0.2, -4]], 2.2);
  s.x(st, shade(col, -0.18), 'opacity=".5"');
  return s.out();
}
/** a small desert snake, lying (origin: its middle) */
export function desertSnake(c, col = mix(C.olive, C.dune, 0.4)) {
  const pts = [];
  for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push([-40 + u * 80, Math.sin(u * PI * 2.2) * 6]); }
  return sheet().p(c.ribbon(pts, (u) => 3 + Math.sin(u * PI) * 4), col).p(c.cut(c.ell(42, 2, 6, 4, 8), 0.2, 3), col).out();
}

/* ---------- water ---------- */
/** a spring gushing from a rock (origin: rock foot). .jet can be scaled */
export function springRock(c, w = 110, h = 60, col = C.rock2) {
  const s = sheet();
  s.p(c.cut(c.blob(0, -h * 0.45, w / 2, h / 2, 10, 0.18).map(([x, y]) => [x, Math.min(y, 0)]), 0.8, 6), col);
  s.x(c.cut([[-w * 0.25, -h * 0.6], [0, -h * 0.85], [w * 0.2, -h * 0.6], [0, -h * 0.5]], 0.4, 5), shade(col, 0.3), 'opacity=".6"');
  const jet = sheet().p(c.cut([[-4, 0], [-12, -26], [-8, -44], [0, -52], [8, -44], [12, -26], [4, 0]], 0.3, 4), C.lake).x(c.cut([[-2, -6], [-5, -26], [0, -44], [4, -26], [2, -6]], 0.2, 3), C.foam, 'opacity=".8"');
  return `${s.out()}<g class="jet" transform="translate(0 ${-h * 0.8})">${jet.out()}</g>`;
}
/** a stone water jar for purification (origin: base) */
export function stoneJar(c, h = 80, col = mix(C.stone, C.rock, 0.4)) {
  const s = sheet();
  s.p(c.cut([[-20, 0], [-26, -h * 0.35], [-24, -h * 0.8], [-18, -h], [18, -h], [24, -h * 0.8], [26, -h * 0.35], [20, 0]], 0.4, 5), col);
  s.p(c.cut(c.rect(-20, -h - 6, 40, 8), 0.3, 4), shade(col, -0.1));
  s.x(c.ribbon([[-24, -h * 0.55], [24, -h * 0.55]], 2) + c.ribbon([[-24, -h * 0.3], [24, -h * 0.3]], 2), shade(col, -0.15), 'opacity=".6"');
  return s.out();
}
/** a cup that fills and overflows (origin: base). .fill scales up from the bottom, .spill fades in */
export function joyCup(c, w = 70, h = 60) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -h], [w / 2, -h], [w * 0.3, -h * 0.25], [w * 0.1, -h * 0.12], [w * 0.1, -8], [w * 0.3, 0], [-w * 0.3, 0], [-w * 0.1, -8], [-w * 0.1, -h * 0.12], [-w * 0.3, -h * 0.25]], 0.4, 5), C.sun);
  const fill = `<g class="fill" transform="translate(0 ${-h * 0.25})"><path d="${c.cut([[-w * 0.3, 0], [w * 0.3, 0], [w / 2 - 3, -h * 0.72], [-w / 2 + 3, -h * 0.72]], 0.3, 4)}" fill="${C.halo}"/></g>`;
  const spill = `<g class="spill" opacity="0"><path d="${c.cut([[-w / 2 - 4, -h - 2], [-w / 2 + 10, -h - 10], [w / 2 - 10, -h - 10], [w / 2 + 4, -h - 2], [w / 2 + 12, -h * 0.4], [w / 2 + 4, -h * 0.4], [w / 2, -h + 4], [-w / 2, -h + 4], [-w / 2 - 4, -h * 0.35], [-w / 2 - 12, -h * 0.35]], 0.4, 4)}" fill="${C.halo}"/></g>`;
  return `<circle cy="${-h}" r="${w}" fill="url(#halo-glow)" class="glow" opacity="0"/>${fill}${s.out()}${spill}`;
}
/** a measuring bowl (origin base) */
export function measureBowl(c, w = 90) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -40], [w / 2, -40], [w * 0.36, 0], [-w * 0.36, 0]], 0.4, 5), C.wood3);
  let m = '';
  for (let i = 1; i < 4; i++) m += c.ribbon([[-w * 0.44 + i * 3, -40 + i * 9], [-w * 0.3 + i * 3, -40 + i * 9]], 1.6);
  s.x(m, C.ink, 'opacity=".6"');
  return s.out();
}
