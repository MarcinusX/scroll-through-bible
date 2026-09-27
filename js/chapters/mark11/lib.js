// Mark 11 — shared cut-outs for this chapter: the colt, Jerusalem and its Temple, the Temple courts,
// the fig tree, branches and cloaks for the road, the market (tables, coins, dove cages),
// the mountain and the sea, a knot to untie, and the chief priests, scribes and elders.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging } from '../kit.js';
import { band, hillsWith, olive, cypress, palm, bush, grass, rock, sun, cloud } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';

export { kf, moving, hand, headAt, addToHead, addToBody, thought, speech, GLYPH, spark, heart, coin, coinStack, dust, townsfolk, turban, breastplate, scrollOpen, scrollRolled, rope, lantern, wordSlip } from '../mark2/lib.js';
export { dove, flapWings, voiceRings, hang2, tagOnString, sparkle, plate, signpost, flame } from '../mark1/lib.js';
export { TWELVE, LOOK, nameTag, card, bubble, strip, withFace, faceBits, along, question, man, woman } from '../mark3/lib.js';
import { addToHead, turban, breastplate } from '../mark2/lib.js';
import { dove as dove1 } from '../mark1/lib.js';
import { scribe as scribeOpts3, TWELVE as T12 } from '../mark3/lib.js';

const PI = Math.PI;
const k_ = (k) => (k ? ` data-k="${k}"` : '');
export const FONT = 'EB Garamond, Georgia, serif';
export { PI };

/* ================================================================== people */

/** the Twelve as puppet options (mark3 order: Peter, James, John, Andrew, Philip, …) */
export const TWELVE_O = T12.map((m) => m.o);
/** the two disciples who fetch the colt */
export const TWO = [CAST.andrew, T12[4].o];

/** a chief priest: linen robes, a coloured mantle, a gold sash and a white turban (lead: breastplate) */
export function priest(c, i = 0, extra = {}) {
  const mantles = [shade(C.indigo, 0.25), C.plumRobe, shade(C.teal2, 0.1), C.mauve];
  const o = { robe: C.linen, mantle: mantles[i % mantles.length], belt: C.sun, skin: [C.skin2, C.skin, C.skin3][i % 3], hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: [C.greyHair, C.hair3, C.hair2][i % 3], ...extra };
  let m = addToHead(person(c, o), turban(c));
  if (i === 0) m = m.replace('<g class="head"', `${breastplate(c)}<g class="head"`);
  return m;
}
/** a scribe: rich robe, head-wrap, a scroll in the hand */
export function scribe(c, i = 0, extra = {}) { return person(c, { ...scribeOpts3(c, i), ...extra }); }
/** an elder of the people: grey beard, plain mantle, head-wrap */
export function elder(c, i = 0, extra = {}) {
  const o = {
    robe: [C.stone2, C.wheatRobe, C.linen2][i % 3], mantle: [C.wood3, C.sageRobe, C.clayMantle][i % 3], hair: C.greyHair, hairStyle: 'wrap',
    veil: [C.linen2, C.stone, C.parchment][i % 3], veil2: [C.wood3, C.moss, C.clay][i % 3], beard: i % 2 ? 'wild' : 'full', beardColor: C.greyHair, skin: [C.skin3, C.skin2, C.skin4][i % 3], belt: C.leather, ...extra,
  };
  return person(c, o);
}

/* ================================================================== the colt */

const DONK = mix(C.rock2, C.wood3, 0.3);
/**
 * A young donkey, facing right, hooves at y=0, about 205 tall to the ear tips at scale 1.
 * Parts for the rig: .leg (4, pivot at the top), .chead (pivot at the neck), .ear (2), .tail.
 * over: markup drawn on the back (cloaks), rider: markup placed on the back before the near legs.
 */
export function colt(c, { k, col = DONK, over = '', rider = '', halter = true } = {}) {
  const dk = shade(col, -0.2), lt = mix(col, C.cream, 0.6), ink = C.inkSoft;
  const leg = (x, far, i) => {
    const s = sheet();
    const cc = far ? dk : col;
    s.p(c.cut([[-7.5, -4], [7.5, -4], [6, 20], [5.2, 38], [5.6, 52], [-5.2, 52], [-4.6, 38], [-6.2, 20]], 0.3, 5), cc);
    s.p(c.cut([[-6.6, 50], [6.4, 50], [7.4, 60], [-7.2, 60]], 0.2, 3), far ? C.soilDark : shade(C.soilDark, 0.15));
    s.x(c.ribbon([[-5, 44], [5, 44]], 3), lt, 'opacity=".55"');
    return `<g class="leg" data-i="${i}" data-x="${x}" transform="translate(${x} -60)">${s.out()}</g>`;
  };
  // far legs
  let out = leg(-44, true, 0) + leg(46, true, 1);
  // tail
  const tail = sheet().p(c.ribbon(c.qbez([0, 0], [-10, 16], [-8, 42], 8), (u) => 4 - u * 1.4), dk).p(c.cut(c.blob(-8, 48, 6, 11, 8, 0.25), 0.6, 3), shade(col, -0.35)).out();
  out += `<g class="tail" transform="translate(-76 -92)">${tail}</g>`;
  // body
  const b = sheet();
  b.p(c.cut([[-80, -80], [-76, -98], [-58, -108], [-24, -112], [12, -110], [40, -108], [58, -100], [64, -84], [58, -68], [34, -58], [0, -55], [-36, -56], [-64, -62], [-80, -72]], 0.7, 7), col);
  b.p(c.cut(c.ell(-6, -62, 44, 8, 18), 0.4, 5), lt, 'opacity=".9"');
  b.x(c.ribbon([[36, -110], [38, -88], [40, -66]], 4) + c.ribbon([[-70, -104], [0, -113], [40, -110]], 3.5), dk, 'opacity=".5"');
  out += b.out();
  out += over;
  // head & neck (nods around the withers)
  const h = sheet();
  h.p(c.cut([[36, -104], [54, -128], [66, -150], [84, -154], [92, -140], [76, -110], [64, -86], [48, -80]], 0.6, 6), col);
  h.p(c.cut([[66, -156], [80, -168], [96, -164], [108, -150], [126, -126], [128, -114], [118, -106], [104, -110], [88, -126], [72, -138]], 0.6, 5), col);
  h.p(c.cut(c.ell(118, -118, 12, 11, 14), 0.3, 4), lt);
  h.x(c.poly(c.ell(124, -122, 2.2, 1.5, 8)), ink, 'opacity=".7"');
  h.x(c.ribbon(c.arc(118, -110, 6, 3, 0.2, PI - 0.2, 6), 1.2), ink, 'opacity=".6"');
  // the mane: a short brush of cut teeth
  let mane = '';
  for (let i = 0; i < 9; i++) {
    const u = i / 8, x = lerp(40, 74, u), y = lerp(-104, -160, u);
    mane += c.poly([[x - 5, y + 4], [x - 10 + c.rr(-2, 2), y - 7], [x + 1, y - 3], [x + 4, y + 5]]);
  }
  h.p(mane, shade(col, -0.4));
  // ears (twitch around their bases)
  const ear = (x, y, lean, far) => {
    const e = sheet();
    e.p(c.cut([[-6, 0], [-8, -18], [-4, -38], [1, -44], [6, -38], [7, -18], [5, 0]], 0.3, 4), far ? dk : col);
    if (!far) e.x(c.ribbon([[0, -6], [0.6, -24], [0.8, -36]], 4.4), C.blush, 'opacity=".55"');
    e.x(c.poly([[-3, -38], [1, -45], [5, -38], [1, -41]]), shade(col, -0.45));
    return `<g class="ear" data-far="${far ? 1 : 0}" transform="translate(${x} ${y}) rotate(${lean})">${e.out()}</g>`;
  };
  const eyeM = `<path d="${c.poly(c.ell(94, -142, 3.6, 4.2, 10))}" fill="${ink}"/><path d="${c.poly(c.circ(95.4, -143.6, 1.3, 6))}" fill="#fff"/><path d="${c.ribbon([[89, -147], [92, -149.5]], 1)}${c.ribbon([[92, -148.4], [94.4, -150.6]], 1)}" fill="${ink}"/><path d="${c.poly(c.circ(104, -130, 4.6, 10))}" fill="${C.blush}" opacity=".55"/>`;
  const halt = halter ? `<path d="${c.ribbon([[103, -150], [111, -128], [116, -108]], 2.8) + c.ribbon([[96, -128], [124, -130]], 2.6)}" fill="${C.terracotta}"/><path d="${c.poly(c.circ(110, -129, 3, 8))}" fill="${C.sun}"/>` : '';
  out += `<g class="chead">${ear(70, -158, -16, true)}${h.out()}${eyeM}${halt}${ear(82, -162, 6, false)}</g>`;
  out += rider;
  // near legs
  out += leg(-58, false, 2) + leg(34, false, 3);
  return `<g${k_(k)} class="colt"><g class="cflip"><g class="cbody">${out}</g></g></g>`;
}
/** controller for a colt(): set({x, y, s, flip, o, walk, amt, nod, ear, tail}) */
export function coltRig(el) {
  const legs = Array.from(el.querySelectorAll('.leg')).map((g) => ({ g, x: +g.dataset.x, i: +g.dataset.i }));
  const head = el.querySelector('.chead'), ears = Array.from(el.querySelectorAll('.ear')), tail = el.querySelector('.tail');
  const flipEl = el.querySelector('.cflip'), body = el.querySelector('.cbody');
  const earBase = ears.map((e) => { const m = e.getAttribute('transform').match(/translate\(([-\d.]+) ([-\d.]+)\) rotate\(([-\d.]+)\)/); return [+m[1], +m[2], +m[3]]; });
  return {
    el,
    set({ x = 0, y = 0, s = 1, flip = false, o, r = 0, walk, amt = 1, nod = 0, ear = 0, tail: tl = 0 } = {}) {
      pose(el, { x, y, s, o, r });
      pose(flipEl, { sx: flip ? -1 : 1 });
      let bob = 0;
      legs.forEach((L) => {
        let a = 0;
        if (walk !== undefined && walk !== null) {
          const ph = walk + (L.i === 0 || L.i === 3 ? 0 : PI);
          a = Math.sin(ph) * 22 * amt;
          bob = -Math.abs(Math.cos(walk)) * 3 * amt;
        }
        pose(L.g, { x: L.x, y: -60, r: a });
      });
      pose(body, { y: bob });
      pose(head, { x: 56, y: -96, r: nod + (walk != null ? Math.sin(walk * 2) * 2.5 * amt : 0), ox: 56, oy: -96 });
      ears.forEach((e, i) => pose(e, { x: earBase[i][0], y: earBase[i][1], r: earBase[i][2] + ear * (i ? 1 : 0.7) }));
      pose(tail, { x: -76, y: -92, r: tl });
    },
  };
}
/** cloaks thrown over the colt's back (colt coords); cols: list of mantle colours */
export function saddleCloaks(c, cols = [C.ochre, C.dustyBlue, C.jesusMantle]) {
  let out = '';
  cols.forEach((col, i) => {
    const dx = (i - (cols.length - 1) / 2) * 16, s = sheet();
    const pts = [[-50 + dx, -106 - i * 2], [-10 + dx, -115 - i * 2], [30 + dx, -110 - i * 2], [36 + dx, -86], [32 + dx, -64 + (i % 2) * 6], [22 + dx, -60], [10 + dx, -66], [-4 + dx, -58], [-18 + dx, -64], [-34 + dx, -58], [-46 + dx, -66], [-52 + dx, -84]];
    s.p(c.cut(pts, 0.7, 6), col);
    s.x(c.ribbon([[-44 + dx, -70], [28 + dx, -72]], 3), shade(col, 0.3), 'opacity=".6"');
    s.x(c.ribbon([[-10 + dx, -110], [-8 + dx, -64]], 1.6) + c.ribbon([[12 + dx, -110], [16 + dx, -66]], 1.6), shade(col, -0.2), 'opacity=".5"');
    out += `<g class="cl" data-i="${i}">${s.out()}</g>`;
  });
  return out;
}
/** Jesus seated astride (colt coords): the sitting puppet goes on the back, with a leg hanging down the flank */
export function riderLeg(c) {
  const s = sheet();
  s.p(c.cut([[14, -106], [40, -104], [44, -78], [42, -48], [30, -44], [22, -70]], 0.5, 6), C.linen);
  s.x(c.ribbon([[24, -98], [34, -52]], 2), shade(C.linen, -0.12), 'opacity=".7"');
  s.p(c.cut(c.ell(40, -42, 11, 4.6, 12), 0.3, 4), C.sandal);
  return s.out();
}

/* ================================================================== Jerusalem */

const HOUSE_COLS = [C.plaster, mix(C.plaster, C.sand, 0.4), C.parchment, mix(C.plaster2, C.stone, 0.5), mix(C.sand, C.dawn, 0.4)];
function cityHouses(c, x0, x1, base, { h0 = 26, h1 = 50, gap = 4, skip, rows = 1, sc = 1 } = {}) {
  const s = sheet();
  const byCol = HOUSE_COLS.map(() => '');
  let wins = '', domes = '';
  for (let r = 0; r < rows; r++) {
    let x = x0 + c.rr(-10, 10);
    const by = base - r * 26 * sc;
    while (x < x1) {
      const w = c.rr(28, 58) * sc, h = c.rr(h0, h1) * sc;
      if (!skip || !skip(x + w / 2)) {
        const ci = c.ri(0, HOUSE_COLS.length - 1);
        byCol[ci] += c.cut(c.rect(x, by - h, w, h + 6), 0.4, 6);
        if (c.chance(0.7)) wins += c.poly(c.rect(x + w * c.rr(0.2, 0.6), by - h * c.rr(0.55, 0.8), 4.5 * sc, 6 * sc));
        if (c.chance(0.35)) wins += c.poly([[x + w * 0.3, by + 2], [x + w * 0.3, by - h * 0.35], [x + w * 0.42, by - h * 0.42], [x + w * 0.54, by - h * 0.35], [x + w * 0.54, by + 2]]);
        if (c.chance(0.16)) domes += c.cut([[x + w * 0.2, by - h], ...c.arc(x + w * 0.5, by - h, w * 0.3, w * 0.3, PI, 2 * PI, 8), [x + w * 0.8, by - h]], 0.3, 4);
      }
      x += w + c.rr(-6, gap);
    }
  }
  HOUSE_COLS.forEach((col, i) => byCol[i] && s.p(byCol[i], col));
  s.p(domes, mix(C.plaster2, C.stone2, 0.4));
  s.x(wins, mix(C.soilDark, C.wood2, 0.3), 'opacity=".75"');
  return s.out();
}
/** crenellated wall between x0 and x1 with its top at y and foot at yb */
export function cityWall(c, x0, x1, y, yb, { col = C.stone, col2 = C.stone2, merlon = 9, towers = [], gate = null, courses = true } = {}) {
  const s = sheet();
  const pts = [[x0, yb], [x0, y]];
  for (let xx = x0; xx < x1 - merlon; xx += merlon * 2) pts.push([xx, y], [xx, y - merlon * 0.8], [xx + merlon, y - merlon * 0.8], [xx + merlon, y]);
  pts.push([x1, y], [x1, yb]);
  let wall = c.cut(pts, 0.4, 8);
  if (gate) wall += c.hole([[gate.x - gate.w / 2, yb + 1], [gate.x - gate.w / 2, yb - gate.h + gate.w / 2], ...c.arc(gate.x, yb - gate.h + gate.w / 2, gate.w / 2, gate.w / 2, PI, 2 * PI, 10), [gate.x + gate.w / 2, yb + 1]], 0.3, 5);
  s.p(wall, col);
  if (courses) {
    let d = '';
    for (let yy = y + 12; yy < yb - 4; yy += 13) {
      d += c.ribbon([[x0 + 2, yy], [x1 - 2, yy + c.rr(-1, 1)]], 1.1);
      for (let xx = x0 + c.rr(4, 30); xx < x1 - 4; xx += c.rr(24, 44)) if (!gate || Math.abs(xx - gate.x) > gate.w / 2 + 4) d += c.ribbon([[xx, yy], [xx, yy + 12]], 1);
    }
    s.x(d, shade(col, -0.16), 'opacity=".55"');
  }
  towers.forEach(({ x, w = 44, h = 30 }) => {
    const tp = [[x - w / 2, yb], [x - w / 2, y - h]];
    for (let xx = x - w / 2; xx < x + w / 2 - 6; xx += 12) tp.push([xx, y - h], [xx, y - h - 7], [xx + 6, y - h - 7], [xx + 6, y - h]);
    tp.push([x + w / 2, y - h], [x + w / 2, yb]);
    s.p(c.cut(tp, 0.4, 6), col2);
    s.x(c.poly(c.rect(x - 3, y - h + 10, 6, 12)) + c.poly(c.rect(x - 3, y + 12, 6, 12)), mix(C.soilDark, C.wood2, 0.3), 'opacity=".7"');
  });
  if (gate) s.p(c.ribbon([...c.arc(gate.x, yb - gate.h + gate.w / 2, gate.w / 2 + 5, gate.w / 2 + 5, PI, 2 * PI, 10)], 7), col2);
  return s.out();
}
/** the sanctuary of the Temple, front view: origin at the middle of its base; w ≈ 180·sc, h ≈ 250·sc */
export function sanctuary(c, sc = 1, { glow = true, veil = C.plumRobe } = {}) {
  const s = sheet();
  const W = 90 * sc, H = 250 * sc, sh = 150 * sc, SW = 60 * sc;
  const white = mix(C.cream, C.linen, 0.5), white2 = mix(C.stone, C.cream, 0.4);
  // the lower, wider shoulders
  s.p(c.cut([[-W - 6 * sc, 0], [-W - 6 * sc, -sh], [W + 6 * sc, -sh], [W + 6 * sc, 0]], 0.5, 8), white2);
  // the tall front porch
  s.p(c.cut([[-SW, 0], [-SW, -H], [SW, -H], [SW, 0]], 0.5, 8), white);
  // gold cornices and spikes
  let spikes = '';
  for (let x = -SW + 5 * sc; x <= SW - 4 * sc; x += 10 * sc) spikes += c.poly([[x - 2.2 * sc, -H], [x, -H - 12 * sc], [x + 2.2 * sc, -H]]);
  for (let x = -W; x <= W; x += 12 * sc) if (Math.abs(x) > SW + 4 * sc) spikes += c.poly([[x - 2 * sc, -sh], [x, -sh - 9 * sc], [x + 2 * sc, -sh]]);
  s.p(spikes, C.sun);
  s.p(c.cut(c.rect(-SW - 4 * sc, -H - 2 * sc, SW * 2 + 8 * sc, 8 * sc), 0.3, 6) + c.cut(c.rect(-W - 8 * sc, -sh - 2 * sc, (W - SW) + 4 * sc, 7 * sc), 0.3, 5) + c.cut(c.rect(SW + 4 * sc, -sh - 2 * sc, (W - SW) + 4 * sc, 7 * sc), 0.3, 5), C.sun);
  // pilasters
  let pil = '';
  for (let i = 0; i < 4; i++) { const x = lerp(-SW + 10 * sc, SW - 10 * sc, i / 3); pil += c.ribbon([[x, -8 * sc], [x, -H + 16 * sc]], 5 * sc); }
  s.x(pil, shade(white, -0.08), 'opacity=".8"');
  // the great doorway, the veil, the golden vine
  const dw = 22 * sc, dh = 120 * sc;
  s.p(c.cut([[-dw, 0], [-dw, -dh], [dw, -dh], [dw, 0]], 0.3, 6), veil);
  s.x(c.ribbon([[-dw * 0.3, -dh + 4], [-dw * 0.36, -2]], 2 * sc) + c.ribbon([[dw * 0.35, -dh + 4], [dw * 0.3, -2]], 2 * sc), shade(veil, -0.25), 'opacity=".7"');
  s.p(c.ribbon([[-dw - 3 * sc, -dh - 4 * sc], [dw + 3 * sc, -dh - 4 * sc]], 5 * sc), C.sun);
  let vine = '';
  for (let i = 0; i < 7; i++) vine += c.cut(c.circ(-dw + (i + 0.5) * (dw * 2 / 7), -dh - 11 * sc, 3.2 * sc, 7), 0.2, 3);
  s.x(vine, C.sunDeep);
  // a gold lamp-plate high on the front
  s.p(c.cut(c.circ(0, -H + 42 * sc, 12 * sc, 16), 0.3, 4), C.sun);
  s.x(c.poly(c.star(0, -H + 42 * sc, 9 * sc, 4 * sc, 6, 0)), shade(C.sun, 0.35));
  // steps
  let st = '';
  for (let i = 0; i < 4; i++) st += c.cut(c.rect(-SW - 20 * sc + i * 5 * sc, -i * 5 * sc + 2, (SW + 20 * sc - i * 5 * sc) * 2, 6 * sc), 0.3, 6);
  s.p(st, white2);
  const g = glow ? `<circle class="tglow" cx="0" cy="${-H * 0.6}" r="${H * 0.9}" fill="url(#halo-glow)" opacity=".6"/>` : '';
  return g + s.out();
}
/**
 * Jerusalem across the valley, as the pilgrims saw it from the Mount of Olives.
 * Origin: middle of the foot of the east wall. Width ≈ 1300·sc. data-k="temple" wraps the sanctuary.
 */
export function jerusalem(c, sc = 1, { tglow = true } = {}) {
  const P = (v) => v * sc;
  let out = '';
  // the hill the city stands on
  const hill = sheet();
  const hp = [[P(-760), P(40)], [P(-700), P(-120)], [P(-560), P(-190)], [P(-380), P(-220)], [P(-120), P(-200)], [P(120), P(-190)], [P(420), P(-196)], [P(620), P(-140)], [P(720), P(-40)], [P(760), P(40)]];
  hill.p(c.cut(hp, 1.2, 12), mix(C.sand2, C.dune, 0.4));
  out += hill.out();
  // the upper city: rows of houses climbing to the west (left), Herod's towers
  out += cityHouses(c, P(-700), P(-40), P(-150), { rows: 3, sc, h0: 24, h1: 46 });
  const tw = sheet();
  [[-600, 120], [-560, 150], [-520, 110]].forEach(([x, h]) => {
    tw.p(c.cut(c.rect(P(x) - P(14), P(-150) - P(h), P(28), P(h)), 0.4, 6), mix(C.stone, C.sand, 0.3));
    let cr = '';
    for (let k = 0; k < 3; k++) cr += c.poly(c.rect(P(x) - P(14) + k * P(10), P(-150) - P(h) - P(6), P(6), P(6)));
    tw.p(cr, mix(C.stone, C.sand, 0.3));
    tw.x(c.poly(c.rect(P(x) - P(2), P(-150) - P(h) + P(16), P(4), P(8))), C.soilDark, 'opacity=".6"');
  });
  out += tw.out();
  out += cityHouses(c, P(-720), P(-10), P(-80), { rows: 3, sc, h0: 22, h1: 40 });
  // the Temple platform: the great retaining wall, its porches along the top
  const TX0 = P(-10), TX1 = P(520), TT = P(-150);
  const plat = sheet();
  plat.p(c.cut([[TX0, P(10)], [TX0, TT], [TX1, TT], [TX1, P(10)]], 0.6, 10), mix(C.stone, C.dawn, 0.25));
  let courses = '';
  for (let y = TT + P(14); y < 0; y += P(14)) {
    courses += c.ribbon([[TX0 + 2, y], [TX1 - 2, y + c.rr(-1, 1)]], 1.1 * sc);
    for (let x = TX0 + c.rr(4, 30) * sc; x < TX1 - 4; x += c.rr(30, 60) * sc) courses += c.ribbon([[x, y], [x, y + P(13)]], 1 * sc);
  }
  plat.x(courses, shade(C.stone, -0.18), 'opacity=".55"');
  // the porticoes: columns under a roof along the edge of the platform
  const por = sheet();
  por.p(c.cut(c.rect(TX0 - P(4), TT - P(34), TX1 - TX0 + P(8), P(8)), 0.3, 8), mix(C.roof, C.wood3, 0.3));
  por.p(c.cut(c.rect(TX0, TT - P(26), TX1 - TX0, P(26)), 0.3, 8), shade(C.stone2, -0.12));
  let cols = '';
  for (let x = TX0 + P(6); x < TX1 - P(4); x += P(13)) cols += c.cut(c.rect(x, TT - P(26), P(5), P(26)), 0.2, 5);
  por.p(cols, C.cream);
  // the inner courts step up towards the sanctuary
  const TC = P(280);
  por.p(c.cut([[TC - P(170), TT - P(26)], [TC - P(150), TT - P(62)], [TC + P(150), TT - P(62)], [TC + P(170), TT - P(26)]], 0.4, 8), mix(C.cream, C.stone, 0.3));
  let inner = '';
  for (let x = TC - P(140); x < TC + P(140); x += P(16)) inner += c.cut(c.rect(x, TT - P(58), P(4), P(26)), 0.2, 4);
  por.x(inner, shade(C.stone, -0.1), 'opacity=".8"');
  // Antonia fortress at the north-west corner
  const ant = sheet();
  const AX = P(-10);
  ant.p(c.cut(c.rect(AX - P(60), TT - P(80), P(110), P(84)), 0.4, 8), mix(C.stone2, C.sand2, 0.3));
  [AX - P(60), AX + P(34)].forEach((x, i) => {
    const h = i ? P(130) : P(110);
    ant.p(c.cut(c.rect(x, TT - h, P(26), h), 0.4, 6), mix(C.stone2, C.sand2, 0.45));
    ant.x(c.poly(c.rect(x + P(10), TT - h + P(14), P(5), P(9))), C.soilDark, 'opacity=".6"');
  });
  out += ant.out() + plat.out() + por.out();
  // the sanctuary itself, gleaming
  out += `<g data-k="temple" transform="translate(${TC} ${TT - P(60)})">${sanctuary(c, sc * 0.72, { glow: tglow })}</g>`;
  // the east wall of the city running along the brow of the valley, with the gate below the Temple
  out += cityWall(c, P(-760), TX0, P(-40), P(30), { towers: [{ x: P(-640), w: P(40), h: P(24) }, { x: P(-420), w: P(40), h: P(24) }, { x: P(-200), w: P(40), h: P(24) }], merlon: P(7) });
  out += cityWall(c, TX1, P(740), P(-40), P(30), { towers: [{ x: P(660), w: P(40), h: P(24) }], merlon: P(7) });
  const gate = sheet();
  const GX = P(170);
  gate.p(c.cut(c.rect(GX - P(46), P(-52), P(92), P(62)), 0.4, 6), mix(C.stone, C.dawn, 0.1));
  gate.p(c.cut([[GX - P(36), P(10)], [GX - P(36), P(-18)], ...c.arc(GX - P(20), P(-18), P(16), P(16), PI, 2 * PI, 6), [GX - P(4), P(10)]], 0.3, 4) + c.cut([[GX + P(4), P(10)], [GX + P(4), P(-18)], ...c.arc(GX + P(20), P(-18), P(16), P(16), PI, 2 * PI, 6), [GX + P(36), P(10)]], 0.3, 4), mix(C.wood2, C.soilDark, 0.3));
  out += gate.out();
  // cypresses and olives around the city
  out += cypress(c, P(-730), P(-30), P(90)) + cypress(c, P(600), P(-150), P(80)) + cypress(c, P(640), P(-140), P(70)) + cypress(c, P(-40), P(-150), P(60));
  return out;
}

/* ================================================================== the Temple courts */

const COL = mix(C.cream, C.stone, 0.4);
/** a row of columns under an entablature (a portico) from x0 to x1, floor at y; origin world */
export function portico(c, x0, x1, y, h = 230, { step = 62, col = COL, back = mix(C.plaster2, C.sand2, 0.35), roof = mix(C.roof, C.wood3, 0.3) } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(x0, y - h, x1 - x0, h), 0.6, 14), back);
  let doors = '';
  for (let x = x0 + step * 0.5; x < x1 - 10; x += step * 2) doors += c.cut([[x + 10, y], [x + 10, y - h * 0.42], ...c.arc(x + step / 2 + 0, y - h * 0.42, step / 2 - 10, 16, PI, 2 * PI, 6), [x + step - 10, y]], 0.3, 5);
  s.x(doors, shade(back, -0.14), 'opacity=".7"');
  let colsD = '', caps = '';
  for (let x = x0 + 10; x < x1 - 10; x += step) {
    colsD += c.cut([[x - 9, y], [x - 8, y - h + 26], [x + 8, y - h + 26], [x + 9, y]], 0.3, 8);
    caps += c.cut([[x - 14, y - h + 30], [x - 12, y - h + 20], [x + 12, y - h + 20], [x + 14, y - h + 30]], 0.2, 4) + c.cut(c.rect(x - 13, y - 8, 26, 8), 0.2, 4);
  }
  s.p(colsD, col);
  s.p(caps, shade(col, -0.08));
  let flutes = '';
  for (let x = x0 + 10; x < x1 - 10; x += step) flutes += c.ribbon([[x - 3, y - 12], [x - 3, y - h + 32]], 1.2) + c.ribbon([[x + 3, y - 12], [x + 3, y - h + 32]], 1.2);
  s.x(flutes, shade(col, -0.16), 'opacity=".5"');
  s.p(c.cut(c.rect(x0 - 6, y - h - 8, x1 - x0 + 12, 30), 0.4, 10), mix(col, C.sand, 0.25));
  s.p(c.cut(c.rect(x0 - 10, y - h - 22, x1 - x0 + 20, 16), 0.4, 10), roof);
  let dent = '';
  for (let x = x0; x < x1; x += 14) dent += c.poly(c.rect(x, y - h + 6, 7, 6));
  s.x(dent, shade(col, -0.2), 'opacity=".6"');
  return s.out();
}
/**
 * The Court of the Gentiles: sky, the sanctuary rising behind its inner wall, porticoes, paving.
 * Returns { sk, hangL, sunEl, sanct, floorY, back, mid, layers }. P: palette ('day' | 'dusk').
 */
export function templeCourt(S, { skyCols = ['#cfe0dc', '#eee6cc', '#f6ead2'], floorY = 640, sanctX = 800, sunAt = [1210, 150], wide = 1 } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cl1 = hanging(hangL, cloud(c, 190), { x: 470, y: 140, len: 700 });
  // the Mount of Olives far behind
  S.layer({ par: 0.08, sh: 2 }).add(hillsWith(c, { y: 420, amps: [20, 8, 3], lens: [1200, 400, 140], color: mix(C.hillMid, C.hillFar, 0.5), trees: 34, treeColor: mix(C.olive, C.hillMid, 0.3), treeH: 16, x0: -1400, x1: 3000 }).markup);
  // the sanctuary above the inner courts
  const sanctL = S.layer({ par: 0.16, sh: 4 });
  const IW = floorY - 150;
  const inner = sheet();
  inner.p(c.cut([[sanctX - 520, IW + 80], [sanctX - 500, IW], [sanctX + 500, IW], [sanctX + 520, IW + 80]], 0.6, 12), mix(C.cream, C.stone, 0.3));
  let iw = '';
  for (let x = sanctX - 480; x < sanctX + 480; x += 30) iw += c.cut(c.rect(x, IW + 6, 10, 40), 0.2, 5);
  inner.x(iw, shade(C.stone, -0.08), 'opacity=".7"');
  inner.p(c.cut(c.rect(sanctX - 520, IW - 10, 1040, 12), 0.3, 12), C.sun);
  const sanct = sanctL.add(`<g transform="translate(${sanctX} ${IW})">${sanctuary(c, 1.3)}</g>`);
  sanctL.add(inner.out());
  // the colonnades around the court
  const back = S.layer({ par: 0.3, sh: 4 });
  const PY = floorY - 70;
  back.add(portico(c, -1300 * wide, sanctX - 330, PY, 240) + portico(c, sanctX + 330, 2900 * wide, PY, 240));
  // the paved court
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const f = sheet();
  f.p(c.cut([[-1800, PY - 6], [3400, PY - 6], [3400, 1800], [-1800, 1800]], 0.8, 30), mix(C.stone, C.sand, 0.35));
  let tiles = '';
  for (let i = 0; i < 9; i++) { const y = PY + 8 + i * i * 7 + i * 10; tiles += c.ribbon([[-1800, y], [3400, y + c.rr(-2, 2)]], 1.3); }
  for (let x = -1800; x < 3400; x += 90) tiles += c.ribbon([[x, PY], [800 + (x - 800) * 2.2, 1800]], 1.2);
  f.x(tiles, shade(C.stone, -0.16), 'opacity=".45"');
  floorL.add(f.out());
  // the soreg: the low balustrade keeping the nations out of the inner court
  const sor = sheet();
  sor.p(c.cut(c.rect(-1800, PY - 30, 5200, 8), 0.4, 20), mix(C.cream, C.stone, 0.2));
  let posts = '';
  for (let x = -1800; x < 3400; x += 22) posts += c.poly(c.rect(x, PY - 24, 5, 24));
  sor.p(posts, mix(C.cream, C.stone, 0.35));
  floorL.add(sor.out());
  return { sk, hangL, sunEl, cl1, sanct, floorY, PY, back, floorL };
}

/** two great columns in the foreground, framing the court (call after the actors' layers) */
export function courtFront(S, { xs = [250, 1360], y = 1000, h = 860, par = 0.9 } = {}) {
  const c = S.c;
  const L = S.layer({ par, sh: 7 });
  const s = sheet();
  xs.forEach((x) => {
    s.p(c.cut([[x - 46, y], [x - 42, y - h], [x + 42, y - h], [x + 46, y]], 0.5, 12), COL);
    s.p(c.cut([[x - 66, y - h + 40], [x - 58, y - h], [x + 58, y - h], [x + 66, y - h + 40]], 0.4, 8) + c.cut([[x - 74, y - h - 10], [x + 74, y - h - 10], [x + 74, y - h + 6], [x - 74, y - h + 6]], 0.4, 8), shade(COL, -0.06));
    let fl = '';
    for (let k = -3; k <= 3; k++) fl += c.ribbon([[x + k * 11, y - 10], [x + k * 10.5, y - h + 50]], 2.4);
    s.x(fl, shade(COL, -0.14), 'opacity=".55"');
  });
  s.p(c.cut([[-900, -600], [2500, -600], [2500, y - h - 6], [-900, y - h - 6]], 0.6, 20), mix(COL, C.sand, 0.2));
  let dent = '';
  for (let x = -900; x < 2500; x += 22) dent += c.poly(c.rect(x, y - h - 26, 11, 12));
  s.x(dent, shade(COL, -0.2), 'opacity=".6"');
  L.add(s.out());
  return L;
}

/* ================================================================== the road and its things */

/** a palm frond held in a hand (hold coords: extends along +y, which points up when the arm is raised) */
export function frond(c, len = 110, col = C.leaf) {
  const s = sheet();
  const spine = c.qbez([0, 0], [6, len * 0.5], [-4, len], 12);
  s.p(c.ribbon(spine, (u) => 3 - u * 2), C.moss2);
  let a = '', b = '';
  spine.forEach(([x, y], i) => {
    if (i < 2) return;
    const l = (1 - i / spine.length) * 26 + 10;
    a += c.ribbon([[x, y], [x - l, y + l * 0.55]], (u) => 4.4 * (1 - u) + 0.6);
    b += c.ribbon([[x, y], [x + l, y + l * 0.5]], (u) => 4.4 * (1 - u) + 0.6);
  });
  s.p(a, shade(col, -0.1)).p(b, col);
  return s.out();
}
/** an olive branch held in a hand (hold coords like frond) */
export function oliveBranch(c, len = 90) {
  const s = sheet();
  const spine = c.qbez([0, 0], [-8, len * 0.5], [4, len], 10);
  s.p(c.ribbon(spine, (u) => 3 - u * 1.8), C.wood2);
  let lv = '', lv2 = '';
  spine.forEach(([x, y], i) => {
    if (i < 2) return;
    const d = i % 2 ? 1 : -1;
    const leaf = c.cut(c.ell(x + d * 9, y + 5, 11, 3.6, 10, d * 0.8), 0.2, 3);
    if (i % 3) lv += leaf; else lv2 += leaf;
  });
  s.p(lv, C.olive).p(lv2, C.sage);
  return s.out();
}
/** a leafy branch lying on the road (origin: centre) */
export function roadBranch(c, len = 90, kind = 'palm') {
  if (kind === 'palm') return `<g transform="rotate(-84) translate(0 ${-len / 2})">${frond(c, len)}</g>`;
  return `<g transform="rotate(-80) translate(0 ${-len / 2})">${oliveBranch(c, len)}</g>`;
}
/** a cloak spread on the road (origin: centre), a little crumpled */
export function roadCloak(c, col, w = 120) {
  const s = sheet();
  const pts = [[-w / 2, -6], [-w * 0.2, -10], [w * 0.2, -8], [w / 2, -5], [w / 2 + 4, 4], [w * 0.2, 9], [-w * 0.2, 8], [-w / 2 - 4, 5]];
  s.p(c.cut(pts, 0.8, 6), col);
  s.x(c.ribbon([[-w * 0.4, 1], [w * 0.4, 0]], 2.4) + c.ribbon([[-w * 0.2, -6], [-w * 0.1, 6]], 1.6), shade(col, -0.18), 'opacity=".6"');
  s.x(c.ribbon([[-w / 2 + 3, 5], [w / 2 - 2, 3]], 2), shade(col, 0.3), 'opacity=".55"');
  return s.out();
}
/** a cloak flying through the air (origin: centre), spread like a sail */
export function flyingCloak(c, col, w = 90) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -12], [-w * 0.1, -20], [w / 2, -14], [w * 0.4, 6], [w * 0.1, 18], [-w * 0.2, 14], [-w / 2 - 4, 8]], 0.8, 6), col);
  s.x(c.ribbon([[-w * 0.3, -10], [-w * 0.2, 10]], 1.6) + c.ribbon([[w * 0.1, -14], [w * 0.14, 12]], 1.6), shade(col, -0.2), 'opacity=".6"');
  return s.out();
}
/** a small hand-cut pennant with one letter (origin: top-left corner of the string) */
export function pennant(c, ch, col, w = 42, h = 56) {
  const s = sheet();
  s.p(c.cut([[0, 0], [w, 0], [w / 2, h]], 0.5, 6), col);
  s.x(c.ribbon([[0, 3], [w, 3]], 2.2), shade(col, -0.2), 'opacity=".6"');
  return `${s.out()}<text x="${w / 2}" y="${h * 0.46}" text-anchor="middle" font-family="${FONT}" font-size="${h * 0.44}" font-weight="600" fill="${C.cream}">${ch}</text>`;
}
/** a long cloth banner with words, hung on two strings (origin: middle of its top edge) */
export function clothBanner(c, text, { size = 24, w, col = C.cream, ink = C.terracotta, trim = C.ochre } = {}) {
  const ww = w || text.length * size * 0.48 + size * 2.2;
  const hh = size * 1.8;
  const s = sheet();
  const pts = [[-ww / 2, 0], [ww / 2, 0], [ww / 2, hh], [ww / 2 - 14, hh - 10], [ww / 2 - 28, hh], [-ww / 2 + 28, hh], [-ww / 2 + 14, hh - 10], [-ww / 2, hh]];
  s.p(c.cut(pts, 0.5, 8), col);
  s.p(c.ribbon([[-ww / 2 - 6, 1], [ww / 2 + 6, 1]], 7), C.wood2);
  s.x(c.ribbon([[-ww / 2 + 6, 7], [ww / 2 - 6, 7]], 2) + c.ribbon([[-ww / 2 + 30, hh - 6], [ww / 2 - 30, hh - 6]], 2), trim, 'opacity=".8"');
  return `${s.out()}<text x="0" y="${hh * 0.5 + size * 0.38}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}

/* ================================================================== trees, hills and the sea */

/** an olive grove as one still sheet along a ground function */
export function grove(c, fn, x0, x1, n = 8, sc = 0.7) {
  let out = '';
  for (let i = 0; i < n; i++) { const x = lerp(x0, x1, (i + c.rr(0.2, 0.8)) / n); out += olive(c, x, fn(x) + 4, sc * c.rr(0.8, 1.15)); }
  return out;
}
/**
 * A fig tree: { trunk, leaves, withered, roots }. Leaves are big three-lobed fig leaves.
 * origin: foot of the trunk. h ≈ 300·sc.
 */
export function figTree(c, sc = 1) {
  const P = (v) => v * sc;
  const t = sheet();
  const bark = mix(C.stone2, C.wood3, 0.45);
  t.p(c.cut([[P(-16), 0], [P(-12), P(-70)], [P(-40), P(-150)], [P(-70), P(-190)], [P(-60), P(-196)], [P(-26), P(-160)], [P(-6), P(-120)], [P(-2), P(-200)], [P(8), P(-204)], [P(12), P(-130)], [P(40), P(-172)], [P(80), P(-196)], [P(86), P(-188)], [P(50), P(-160)], [P(16), P(-90)], [P(18), 0]], 0.8, 7), bark);
  t.x(c.ribbon([[P(-4), P(-10)], [P(-2), P(-80)]], P(2)) + c.ribbon([[P(6), P(-20)], [P(8), P(-60)]], P(1.4)), shade(bark, -0.2), 'opacity=".6"');
  const leaf = (x, y, r, a) => {
    const pts = [];
    const n = 15;
    for (let i = 0; i < n; i++) {
      const u = (i / n) * PI * 2;
      const lobe = 0.62 + 0.38 * Math.abs(Math.cos(u * 1.5));
      pts.push([Math.cos(u) * r * lobe, Math.sin(u) * r * lobe * 0.95]);
    }
    return c.cut(pts.map(([px, py]) => [x + px * Math.cos(a) - py * Math.sin(a), y + px * Math.sin(a) + py * Math.cos(a)]), 0.3, 4);
  };
  const L = sheet();
  let l1 = '', l2 = '', l3 = '', veins = '';
  const crown = [[0, -220, 150, 100]];
  for (let i = 0; i < 70; i++) {
    const a = c.rr(0, PI * 2), rr = Math.sqrt(c.r());
    const x = P(Math.cos(a) * 160 * rr), y = P(-215 + Math.sin(a) * 92 * rr);
    const lf = leaf(x, y, P(c.rr(16, 24)), c.rr(0, PI * 2));
    if (i % 3 === 0) l1 += lf; else if (i % 3 === 1) l2 += lf; else l3 += lf;
    if (i % 4 === 0) veins += c.ribbon([[x, y], [x + P(c.rr(-8, 8)), y - P(10)]], 1);
  }
  L.p(c.cut(c.blob(0, P(-215), P(150), P(86), 16, 0.12), 1.4, 8), C.moss2);
  L.p(l1, C.moss).p(l2, C.leaf).p(l3, mix(C.leaf, C.sage, 0.5));
  L.x(veins, C.moss2, 'opacity=".5"');
  // the withered tree: grey twigs with a few curled dead leaves
  const W = sheet();
  let tw = '', dead = '';
  for (let i = 0; i < 16; i++) {
    const a = PI + (i + 0.5) / 16 * PI, l = P(c.rr(70, 140));
    const bx = P(c.rr(-50, 50)), by = P(-180 + c.rr(-20, 20));
    const ex = bx + Math.cos(a) * l, ey = by + Math.sin(a) * l * 0.7;
    tw += c.ribbon(c.qbez([bx, by], [(bx + ex) / 2 + P(c.rr(-14, 14)), (by + ey) / 2], [ex, ey + P(20)], 6), (u) => P(4) * (1 - u) + 0.8);
    if (i % 3 === 0) dead += c.cut(c.blob(ex, ey + P(24), P(6), P(4), 7, 0.4), 0.8, 3);
  }
  W.p(tw, mix(bark, C.rock3, 0.5)).p(dead, mix(C.wood3, C.ochre, 0.3));
  // roots in the ground (seen in a cut-away): living and dried
  const R = sheet();
  let rootsLive = '', rootsDry = '';
  for (let i = 0; i < 7; i++) {
    const a = PI * (0.12 + (i / 6) * 0.76), l = P(c.rr(70, 120));
    const pts = c.qbez([P(c.rr(-10, 10)), 0], [Math.cos(a) * l * 0.5, P(20)], [Math.cos(a) * l, Math.sin(a) * l * 0.7 + P(10)], 8);
    rootsLive += c.ribbon(pts, (u) => P(7) * (1 - u) + 1.2);
    rootsDry += c.ribbon(pts.map(([x, y], j) => [x + (j % 2 ? P(2) : P(-2)), y]), (u) => P(4.6) * (1 - u) + 0.8);
  }
  return {
    trunk: t.out(),
    leaves: L.out(),
    withered: W.out(),
    rootsLive: sheet().p(rootsLive, mix(C.wood2, C.soil, 0.3)).out(),
    rootsDry: sheet().p(rootsDry, mix(C.rock3, C.stone2, 0.4)).out(),
  };
}
/** a few ripe figs (origin centre) */
export function figs(c, n = 3, r = 9) {
  const s = sheet();
  let d = '';
  for (let i = 0; i < n; i++) d += c.cut([[i * r * 1.9 - r, 0], ...c.arc(i * r * 1.9, 0, r, r * 1.05, PI * 0.1, PI * 0.9, 8).map(([x, y]) => [x, y]), [i * r * 1.9 + 2, -r * 1.4], [i * r * 1.9 - 2, -r * 1.4]], 0.3, 3);
  s.p(d, mix(C.plumRobe, C.indigo, 0.25));
  return s.out();
}
/** the mountain on strings: a rocky cut-out with olive trees; origin at the middle of its base */
export function mountain(c, w = 460, h = 330) {
  const s = sheet();
  const pts = [[-w / 2, 0]];
  const n = 12;
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = -w / 2 + u * w;
    const y = -h * Math.pow(Math.sin(u * PI), 0.8) * (1 + (i % 2 ? 0.05 : -0.04)) + c.rr(-8, 8);
    pts.push([x, Math.min(0, y)]);
  }
  pts.push([w / 2, 0], [w * 0.4, 30], [w * 0.1, 44], [-w * 0.2, 38], [-w * 0.42, 26]);
  s.p(c.cut(pts, 1.2, 10), mix(C.rock, C.sand2, 0.35));
  s.p(c.cut([[-w * 0.08, -h * 0.98], [w * 0.1, -h * 0.9], [w * 0.2, -h * 0.6], [w * 0.05, -h * 0.66], [-w * 0.06, -h * 0.8]], 0.8, 6), shade(C.rock, 0.25));
  s.p(c.cut([[w * 0.1, -h * 0.5], [w * 0.36, -h * 0.3], [w * 0.4, -h * 0.05], [w * 0.2, -h * 0.12]], 0.8, 6) + c.cut([[-w * 0.3, -h * 0.4], [-w * 0.16, -h * 0.3], [-w * 0.2, -h * 0.1], [-w * 0.38, -h * 0.12]], 0.8, 6), mix(C.rock2, C.sand2, 0.3));
  // roots & soil under it — torn from the ground
  s.p(c.cut([[-w * 0.42, 22], [-w * 0.2, 36], [w * 0.1, 42], [w * 0.4, 28], [w * 0.3, 6], [-w * 0.3, 6]], 1.4, 6), C.soil);
  let roots = '';
  for (let i = 0; i < 8; i++) { const x = c.rr(-w * 0.36, w * 0.36); roots += c.ribbon([[x, 20], [x + c.rr(-14, 14), 50 + c.rr(0, 20)]], 2); }
  s.x(roots, C.soilDark, 'opacity=".8"');
  let trees = '';
  for (let i = 0; i < 7; i++) {
    const u = c.rr(0.15, 0.85), x = -w / 2 + u * w, y = -h * Math.pow(Math.sin(u * PI), 0.8) * c.rr(0.3, 0.9);
    trees += c.cut(c.blob(x, y - 10, 14, 11, 9, 0.2), 0.5, 4);
  }
  s.p(trees, C.olive);
  return s.out();
}

/* ================================================================== the market */

/** a money changer's table (origin: floor centre). Coins and stacks are separate pieces in scenes. */
export function changerTable(c, w = 150) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 + 10, -52, 10, 52), 0.3, 6) + c.cut(c.rect(w / 2 - 20, -52, 10, 52), 0.3, 6), C.wood2);
  s.p(c.cut([[-w / 2, -60], [w / 2, -60], [w / 2, -50], [-w / 2, -50]], 0.4, 8), C.wood);
  const pts = [[-w / 2 + 2, -56], [w / 2 - 2, -56], [w / 2 - 4, -34]];
  for (let x = w / 2 - 4; x > -w / 2 + 4; x -= 22) pts.push(...c.arc(x - 11, -34, 11, 5, 0, PI, 4));
  s.p(c.cut(pts, 0.5, 6), C.terracotta);
  s.x(c.ribbon([[-w / 2 + 6, -48], [w / 2 - 6, -48]], 2), C.ochre, 'opacity=".8"');
  return s.out();
}
/** a small balance for weighing coins (origin: base) */
export function balance(c) {
  const s = sheet();
  s.p(c.cut([[-9, 0], [9, 0], [3, -5], [1.6, -36], [-1.6, -36], [-3, -5]], 0.3, 4), C.ochre);
  s.p(c.ribbon([[-22, -35], [22, -35]], 2.6), C.ochre);
  s.x(c.ribbon([[-21, -35], [-26, -18]], 0.7) + c.ribbon([[-21, -35], [-16, -18]], 0.7) + c.ribbon([[21, -35], [16, -18]], 0.7) + c.ribbon([[21, -35], [26, -18]], 0.7), C.ink, 'opacity=".5"');
  s.p(c.cut(c.arc(-21, -18, 8, 4.5, 0, PI, 6), 0.2, 3) + c.cut(c.arc(21, -18, 8, 4.5, 0, PI, 6), 0.2, 3), shade(C.ochre, -0.12));
  return s.out();
}
/** a wicker dove cage (origin: bottom centre); doves are separate pieces. part .door can swing */
export function cage(c, w = 70, h = 60) {
  const s = sheet();
  s.x(c.cut([[-w / 2, 0], [-w / 2, -h * 0.7], ...c.arc(0, -h * 0.7, w / 2, h * 0.3, PI, 2 * PI, 10), [w / 2, 0]], 0.5, 6), mix(C.basket, C.cream, 0.2), 'opacity=".28"');
  let bars = '';
  for (let x = -w / 2 + 8; x < w / 2 - 4; x += 9) bars += c.ribbon([[x, -2], [x, -h * 0.7 - Math.sqrt(Math.max(0, 1 - (x / (w / 2)) ** 2)) * h * 0.28]], 2);
  s.p(bars, shade(C.basket, -0.22));
  s.p(c.ribbon([[-w / 2, -3], [w / 2, -3]], 5) + c.ribbon([[-w / 2, -h * 0.66], [w / 2, -h * 0.66]], 3), shade(C.basket, -0.15));
  s.p(c.ribbon(c.arc(0, -h - 4, 8, 7, PI, 2 * PI, 6), 2.4), C.wood2);
  return s.out();
}
/** a little white dove, perched (origin: feet) — wings .wingF/.wingB for flight */
export function smallDove(c, { k, col = '#fbf7ee', sh = '#e6ddcc' } = {}) {
  const s = sheet();
  s.p(c.cut([[-22, -8], [-12, -14], [2, -16], [12, -14], [16, -8], [10, -2], [-6, 0], [-18, -2]], 0.3, 4), col);
  s.p(c.cut([[-20, -8], [-34, -14], [-34, -4], [-20, -4]], 0.2, 3), sh);
  s.p(c.cut(c.circ(14, -18, 7, 12), 0.2, 3), col);
  s.x(c.poly([[20, -19], [26, -17], [20, -15]]), C.ochre);
  s.x(c.poly(c.circ(16, -19.5, 1.3, 6)), C.ink);
  const wing = (fill) => `<path d="${c.cut([[0, 0], [-6, -18], [-18, -30], [-28, -30], [-22, -18], [-12, -4]], 0.3, 3)}" fill="${fill}"/>`;
  return `<g${k_(k)} class="bird"><g class="wingB" transform="translate(-2 -12)">${wing(sh)}</g>${s.out()}<g class="wingF" transform="translate(-2 -10)">${wing(col)}</g></g>`;
}
/** flap a smallDove's wings */
export function flapDove(el, time, amp = 34, speed = 12, base = 0) {
  const f = Math.sin(time * speed) * amp + base;
  pose(el.querySelector('.wingF'), { x: -2, y: -10, r: f });
  pose(el.querySelector('.wingB'), { x: -2, y: -12, r: f * 0.8 + 6 });
}
/** a stool / bench (origin: floor centre) */
export function bench(c, w = 90, h = 34) {
  return sheet().p(c.cut(c.rect(-w / 2, -h, w, 8), 0.3, 6), C.wood)
    .p(c.cut(c.rect(-w / 2 + 6, -h + 8, 8, h - 8), 0.3, 5) + c.cut(c.rect(w / 2 - 14, -h + 8, 8, h - 8), 0.3, 5), C.wood2).out();
}
/** a jar carried on the shoulder, a basket, a bundle (origin: centre) */
export function jarProp(c, col = C.pot) {
  return sheet().p(c.cut([[-12, 22], [-18, 4], [-16, -12], [-8, -20], [-7, -28], [7, -28], [8, -20], [16, -12], [18, 4], [12, 22]], 0.4, 5), col)
    .x(c.ribbon([[-17, -2], [17, -2]], 2.4), C.cream, 'opacity=".5"').out();
}
export function basketProp(c, w = 48) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -18], [w / 2, -18], [w / 2 - 6, 12], [-w / 2 + 6, 12]], 0.4, 5), C.basket);
  let wv = '';
  for (let y = -12; y < 12; y += 6) wv += c.ribbon([[-w / 2 + 4, y], [w / 2 - 4, y]], 1.4);
  s.x(wv, shade(C.basket, -0.25), 'opacity=".6"');
  s.p(c.cut(c.blob(-8, -22, 10, 7, 8, 0.2), 0.3, 3) + c.cut(c.blob(8, -21, 9, 7, 8, 0.2), 0.3, 3), C.wheat2);
  return s.out();
}
/** a lamb (origin: feet, facing right) */
export function lamb(c, { k } = {}) {
  const s = sheet();
  const wool = C.linen, face = mix(C.inkSoft, C.stone2, 0.4);
  s.p(c.cut(c.rect(-22, -22, 6, 22), 0.2, 4) + c.cut(c.rect(14, -22, 6, 22), 0.2, 4), face);
  s.p(c.cut(c.blob(0, -34, 34, 18, 14, 0.18), 1.6, 4), wool);
  s.p(c.cut(c.ell(34, -42, 10, 8, 12, 0.3), 0.3, 3), face);
  s.p(c.cut(c.ell(28, -48, 7, 3, 8, -0.6), 0.2, 3), face);
  s.x(c.poly(c.circ(37, -44, 1.3, 6)), C.ink);
  return `<g${k_(k)}>${s.out()}</g>`;
}

/* ================================================================== faith & forgiveness */

/** half of a rope tied in a knot between two people: side -1 (left) or 1; origin at the knot */
export function ropeHalf(c, len = 110, side = 1) {
  return `<path d="${c.ribbon(c.qbez([0, 0], [side * len * 0.5, 10], [side * len, -4], 10), 4.2)}" fill="${C.rope}"/><path d="${c.ribbon(c.qbez([0, 0], [side * len * 0.5, 10], [side * len, -4], 10).map(([x, y], i) => [x + (i % 2 ? 1.5 : -1.5), y - 1]), 1)}" fill="${shade(C.rope, -0.3)}" opacity=".6"/>`;
}
export function knotBall(c, r = 13) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 0, r, r * 0.85, 10, 0.2), 0.5, 3), shade(C.rope, -0.06));
  s.x(c.ribbon(c.arc(0, 0, r * 0.7, r * 0.5, 0.4, PI * 1.6, 8), 1.8) + c.ribbon(c.arc(2, -2, r * 0.4, r * 0.7, PI * 1.2, PI * 2.4, 8), 1.6), shade(C.rope, -0.32));
  return s.out();
}

/* ================================================================== the question of authority */

/** the two answers, as picture cards: heaven (clouds, rays, the dove) and men (a little crowd) */
export function heavenIcon(c) {
  const s = sheet();
  let r = '';
  for (let i = 0; i < 7; i++) { const a = PI * (0.15 + i * 0.12); r += c.poly([[0, -26], [Math.cos(a) * 60, -26 + Math.sin(a) * 60 + 4], [Math.cos(a + 0.06) * 60, -26 + Math.sin(a + 0.06) * 60 + 4]]); }
  s.x(r, C.halo, 'opacity=".9"');
  s.p(c.cut([...c.arc(-14, -28, 16, 12, PI, 2 * PI, 6), ...c.arc(8, -32, 18, 16, PI, 2 * PI, 6), [28, -24], [-30, -24]], 0.4, 4), C.cream);
  return `${s.out()}<g transform="translate(0 10) scale(.5)">${dove1(c)}</g>`;
}
export function peopleIcon(c) {
  const s = sheet();
  const cols = [C.dustyBlue, C.roseRobe, C.sageRobe, C.wheatRobe, C.mauve];
  cols.forEach((col, i) => {
    const x = -34 + i * 17, y = i % 2 ? 6 : 12;
    s.p(c.cut([[x - 9, y + 26], [x - 7, y], [x + 7, y], [x + 9, y + 26]], 0.3, 4), col);
    s.p(c.cut(c.circ(x, y - 7, 7, 10), 0.2, 3), [C.skin, C.skin2, C.skin3, C.skin4][i % 4]);
  });
  return `<g transform="translate(0 -18)">${s.out()}</g>`;
}
/* ================================================================== labels */

/** a hand-lettered word on a torn strip, hung from the flies (origin at the string) */
export function hungWord(c, text, { size = 22, fill = C.cream, ink = C.ink, len = 600 } = {}) {
  const ww = text.length * size * 0.5 + size * 1.2, hh = size * 1.45;
  const s = sheet().p(c.cut([[-ww / 2, 0], [ww / 2, -1.5], [ww / 2 + 1.5, hh], [-ww / 2 - 1, hh + 1]], 0.5, 6), fill);
  return `<g class="hang"><path d="M0 ${-len - 1200}V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${s.out()}<text x="0" y="${(hh / 2 + size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text></g></g>`;
}
export { tr, sky, hanging, pose, lerp, mix, shade, sheet, C, CAST, person, crowdPerson };
