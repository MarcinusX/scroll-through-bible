// Matthew 5 — the Sermon on the Mount, part one. Most of the chapter is Jesus speaking, so it is told
// in two ways: on the green Mount of the Beatitudes over the Sea of Galilee (Jesus seated on His rock,
// Peter, Andrew, James and John around Him, the crowd sitting on the slope below), with painted
// medallions and plates coming down from the flies; and in small painted flats for the sayings.
// Every "You have heard that it was said" brings down an old sepia stone tablet; every "But I tell you"
// answers it in gold.
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, waterBand, olive, cypress, bush, rock, grass, flowers, sun, cloud, town, house, stars } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { folk, group, smallSail, meadowRows, TW } from '../john6/lib.js';
import { hillSet, mountFront } from '../matthew6/lib.js';
import { tint } from '../mark13/lib.js';

export { tint, folk, group, smallSail, tr };
export { kf, moving, hand, headAt, speech, thought, heart, coin, coinStack, bowl, loaf, cup, taxBooth } from '../mark2/lib.js';
export { voiceRings, dove, flapWings, sparkle, prisonWall, bars, signpost } from '../mark1/lib.js';
export { bubble, question, nameTag, shadowPerson, silhouette, man, woman, pharisee, stoneHeart } from '../mark3/lib.js';
export { say, bang, qmark, slip, doll, scissors, snip, ring, lightKnot, tablet, lawTablets, shadeTree } from '../mark10/lib.js';
export { altar, puff, kingdomGate, gateDoor, throne, footstool, littleHouse, longScroll, lepton, purse } from '../mark12/lib.js';
export { lamb, jerusalem, cage, smallDove, flyingCloak } from '../mark11/lib.js';
export { lightCrown, soulLight, globe } from '../mark8/lib.js';
export { paperEye, paperHand, stumbleCard, lifeGate, firePit, saltBowl, saltGrains, labelOnString } from '../mark9/lib.js';
export { shadowScreen, hourglass, plate, roundel } from '../mark13/lib.js';
export { soldier } from '../mark15/lib.js';
export { hungWord, hungGold, goldWord, radiance, glowDisc } from '../john1/lib.js';
export { paperSun, greyCloud, rainStreaks } from '../john16/lib.js';
export { scribe } from '../mark12/lib.js';

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';
export const DY = { stand: 0, kneel: 46, sit: 62 };

/* ================================================================== skies */
export const SKY = {
  morning: ['#c9e0da', '#eef0d8', '#f8ecd0'],
  day: ['#bfdbd8', '#ecefd9', '#f7eccf'],
  gold: ['#d9c9b2', '#f1d7a6', '#f7e3bb'],
  dusk: ['#7d77a4', '#dca592', '#f2c79c'],
  night: ['#1d2349', '#2d3566', '#55598a'],
  sepia: ['#cdb892', '#e3d2ad', '#efe2c4'],
};
/** re-colour markup towards old paper (for what "was said to them of old") */
export const SEPIA_COL = '#c9ae86';
export const sep = (m, k = 0.55) => tint(m, SEPIA_COL, k);

/* ================================================================== the cast */
export const LOOK = {
  // a thin, poor man
  poor: { robe: mix(C.stone2, C.sand2, 0.3), hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3 },
  mourner: { robe: C.dustyBlue, hairStyle: 'veil', veil: mix(C.indigo, C.dustyBlue, 0.4), veil2: C.indigo, beard: 'none', skin: C.skin },
  friend: { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, beard: 'none', skin: C.skin2, belt: C.ochre },
  shepherd: { robe: C.sageRobe, mantle: C.wheatRobe, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.leather },
  child: { robe: C.skyVeil, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.ochre },
  girl: { robe: C.wheatRobe, hairStyle: 'veil', veil: C.linen2, beard: 'none', skin: C.skin },
  elder: { robe: C.linen2, mantle: C.tealRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.tealRobe, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather },
  brotherA: { robe: C.ochreRobe, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather },
  brotherB: { robe: C.tealRobe, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather },
  wife: { robe: C.mauve, hairStyle: 'veil', veil: C.blushVeil, beard: 'none', skin: C.skin },
  husband: { robe: C.clayMantle, mantle: C.wood3, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.leather },
  pagan: { robe: C.linen, mantle: C.curtain, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin },
  taxman: { robe: C.plumRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.sun },
};

/* ================================================================== the Mount of the Beatitudes */
// The sermon's mountain is the same set as in Matthew 6 and 7 (John 6's green hill over the lake, with the
// seated rows of the crowd and six of the disciples around Jesus), so the three chapters read as one sermon.
export const JX = 800, JY = 672, JS = 0.92;
const SEATS = [[-300, 'thomas'], [-220, 'andrew'], [-135, 'peter'], [135, 'john'], [220, 'james'], [300, 'matthew']];

/** little lights in the hands of everyone in the seated rows (one still markup relative to (ox, oy)) */
export function meadowLights(c, rows, { ox = 800, oy = 560 } = {}) {
  let m = '';
  rows.forEach((row) => {
    const dir = row.x > 800 ? -1 : 1;
    for (let k = 0; k < 5; k++) {
      const lx = row.x + ((k - 2) * 30 + dir * 12) * row.s - ox, ly = row.y - 62 * row.s - oy, s = row.s;
      m += `<circle cx="${lx.toFixed(1)}" cy="${(ly - 6 * s).toFixed(1)}" r="${(22 * s).toFixed(1)}" fill="url(#warm-glow)"/><path d="${c.poly([[lx, ly + 4 * s], [lx - 5 * s, ly - 4 * s], [lx, ly - 16 * s], [lx + 5 * s, ly - 4 * s]])}" fill="${C.lampFlame}"/>`;
    }
  });
  return m;
}

/**
 * The mountain (Matthew 6's hillSet: sky, sun and clouds on strings, the far shore, the lake, hills, the meadow
 * slope, the knoll) with the seated rows of the crowd. tintK > 0 lays a wash of tintCol over the land and the
 * crowd (for evening and night). Call .circle() after adding your own back layers (plates), then .front().
 */
export function mountSet(S, { skyCols = SKY.morning, sky2Cols = null, tintCol = C.indigo, tintK = 0, sunXY = [1250, 150], starsN = 0 } = {}) {
  const c = S.c;
  const H = hillSet(S, { skyCols, sky2: sky2Cols, sunAt: sunXY, knollX: JX });
  let starL = null;
  if (starsN) { starL = S.layer({ par: 0.02, sh: 1, flat: true }); starL.add(stars(c, { x0: -900, x1: 2500, y0: -600, y1: 370, n: starsN })); }
  const crowd = meadowRows(S, H.sfn, { par: 0.3 });
  let wash = null;
  if (tintK) { wash = S.layer({ par: 0, sh: 1, flat: true }); wash.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${tintCol}"/>`); wash.fade(tintK); }
  const set = {
    c, sk: H.sk, sk2: H.sky2 ? { layer: H.sky2 } : null, starL, hangL: H.hangL, sunEl: H.sunEl, sfn: H.sfn, gfn: H.gfn, G: H.G, crowd, wash,
    lights: () => meadowLights(c, crowd.rows),
    /** Jesus seated on the knoll with six of the disciples; returns { L, jesus, jStand, four, jGlow } */
    circle({ par = 0.5, stand = false, glow = false } = {}) {
      const L = S.layer({ par, sh: 5 });
      const jGlow = glow ? L.add(`<g><circle r="200" fill="url(#warm-glow)"/></g>`) : null;
      const four = SEATS.map(([dx, k], i) => {
        const x = JX + dx, y = H.gfn(x) + 14, s = 0.78, flip = dx > 0;
        return { k, i, x, y, s, flip, dir: flip ? -1 : 1, seed: c.rr(0, 9), hx: x + (flip ? -2 : 2) * s, hy: y - 105 * s, p: S.puppet(L.add(person(c, { ...(TW[k] || CAST[k]), pose: 'sit' }))) };
      });
      const jesus = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'sit' })));
      const jStand = stand ? S.puppet(L.add(person(c, { ...CAST.jesus }))) : null;
      Object.assign(set, { L, jesus, jStand, four, jGlow });
      return { L, jesus, jStand, four, jGlow };
    },
    /** the foreground bushes (as in Matthew 6) */
    front() { return mountFront(S); },
    /** idle life (sun and clouds on their strings) */
    update(time, { sunX = sunXY[0], sunY = sunXY[1], sunO = 1 } = {}) { H.update(time, { sunX, sunY, o: sunO }); },
  };
  return set;
}

/** a flat seat-rock for Jesus; origin: ground centre */
export function seatRock(c, w = 150, h = 44, col = C.rock2) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 4], [-w / 2 + 8, -h * 0.7], [-w * 0.2, -h], [w * 0.25, -h * 0.96], [w / 2 - 6, -h * 0.6], [w / 2, 4]], 1, 7), col);
  s.x(c.ribbon([[-w * 0.3, -h * 0.55], [w * 0.1, -h * 0.7]], 2), shade(col, 0.25), 'opacity=".6"');
  return s.out();
}

/** a low olive bough hanging into the top of the frame (foreground); origin world */
export function bough8(c, x, y) {
  const s = sheet();
  const br = c.qbez([x + 500, y - 40], [x + 120, y + 60], [x - 160, y + 120], 18);
  s.p(c.ribbon(br, (u) => 18 - u * 13), C.wood2);
  let lv = '', lv2 = '';
  br.forEach(([bx, by], i) => {
    if (i < 3) return;
    for (let k = 0; k < 3; k++) {
      const a = c.rr(0.6, 2.6), l = c.rr(26, 40);
      const d = c.cut(c.ell(bx + Math.cos(a) * l * 0.6, by + Math.sin(a) * l * 0.6, l * 0.55, 6, 10, a), 0.3, 4);
      if (k % 2) lv += d; else lv2 += d;
    }
  });
  s.p(lv, C.olive).p(lv2, mix(C.sage, C.olive, 0.4));
  return s.out();
}

/** Jesus teaching (seated): a calm open hand, with optional extra gesture (no idle sway: a still figure is never repainted) */
export function teach(J, time, { armF = 0, armB = 0, head = 0, x = JX, y = JY, s = JS, blink } = {}) {
  J.set({ x, y, s, armF: 28 + armF, armB: 10 + armB, head: -3 + head, blink });
}

/* ================================================================== medallions & plates */
/**
 * A round painted medallion hung on one string: rim, cream mount and a clipped painting (inner, drawn in local
 * coords around the centre). origin: centre.
 */
export function medallion(c, id, r, inner, { rim = C.haloRim, mount = C.cream, len = 2600 } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 12, 48), 0.5, 6), rim).p(c.cut(c.circ(0, 0, r + 5, 48), 0.4, 6), mount);
  const ring = sheet().x(c.ribbon(c.arc(0, 0, r + 1, r + 1, 0, PI * 2, 48), 2.4), shade(rim, -0.15), 'opacity=".7"').out(false);
  return `<path d="M0 ${-len}V${-r - 12}" stroke="${STRING}" stroke-width="1.4" fill="none"/>${s.out()}<defs><clipPath id="${id}"><circle r="${r}"/></clipPath></defs><g clip-path="url(#${id})">${inner}</g>${ring}`;
}
/** a rectangular hanging picture plate with a clipped painting; origin: centre */
export function picture(c, id, w, h, inner, { frame = C.wood3, mount = C.cream, len = 2400 } = {}) {
  const s = sheet().p(c.cut(c.rect(-w / 2 - 14, -h / 2 - 14, w + 28, h + 28), 0.6, 10), frame).p(c.cut(c.rect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12), 0.5, 10), mount);
  return `<path d="M${-w * 0.32} ${-len}V${-h / 2 - 14}M${w * 0.32} ${-len}V${-h / 2 - 14}" stroke="${STRING}" stroke-width="1.3" fill="none"/>${s.out()}<defs><clipPath id="${id}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})">${inner}</g>`;
}
/** a little painted landscape for inside a medallion / plate: sky, one hill line, ground; local coords */
export function paintedLand(c, { w = 300, h = 300, skyCol = C.skyBlue, far = C.hillFar, near = C.hillNear, horizon = 20, ground } = {}) {
  const s = sheet();
  s.p(c.poly(c.rect(-w / 2 - 10, -h / 2 - 10, w + 20, h + 20)), skyCol);
  s.p(c.cut([[-w / 2 - 10, horizon], ...Array.from({ length: 9 }, (_, i) => [-w / 2 + (i * w) / 8, horizon - 16 - Math.sin(i * 1.3) * 12]), [w / 2 + 10, horizon], [w / 2 + 10, h / 2 + 10], [-w / 2 - 10, h / 2 + 10]], 0.8, 8), far);
  s.p(c.cut([[-w / 2 - 10, horizon + 26], [-w * 0.2, horizon + 16], [w * 0.2, horizon + 24], [w / 2 + 10, horizon + 12], [w / 2 + 10, h / 2 + 10], [-w / 2 - 10, h / 2 + 10]], 0.8, 8), ground || near);
  return s.out();
}

/** the old sepia stone tablet of "what was said to them of old": lines of text; hung on two strings; origin: top centre */
export function oldTablet(c, lines, { w = 280, size = 24 } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const col = mix(C.stone, C.rock2, 0.4);
  const h = 44 + lines.length * size * 1.2;
  const s = sheet();
  s.p(c.cut([[-w / 2, h], [-w / 2, 26], ...c.arc(0, 26, w / 2, 26, PI, 2 * PI, 16), [w / 2, h]], 0.9, 7), col);
  s.x(c.ribbon([[-w / 2 + 12, h - 7], [w / 2 - 12, h - 7]], 2.4) + c.ribbon([[-w / 2 + 12, 30], [w / 2 - 12, 30]], 1.6), shade(col, -0.22), 'opacity=".55"');
  let cracks = '';
  cracks += c.ribbon([[w / 2 - 20, 40], [w / 2 - 34, 58], [w / 2 - 28, 70]], 1.2) + c.ribbon([[-w / 2 + 16, h - 20], [-w / 2 + 34, h - 34]], 1.2);
  s.x(cracks, shade(col, -0.3), 'opacity=".5"');
  const txt = lines.map((l, i) => `<text x="0" y="${(40 + (i + 0.78) * size * 1.2).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" fill="${shade(col, -0.62)}">${l}</text>`).join('');
  return sep(`<path d="M${-w * 0.36} -2400V14M${w * 0.36} -2400V14" stroke="${STRING}" stroke-width="1.3" fill="none"/>${s.out()}${txt}`, 0.35);
}
/** the answer in gold ("But I tell you"): a gold word on a dark-blue strip with a soft glow; origin centre */
export function goldAnswer(c, text, { size = 26 } = {}) {
  const ww = text.length * size * 0.5 + size * 1.6, hh = size * 1.55;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 2], [ww / 2 + 2, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.6, 7), '#2a2e5a');
  s.x(c.ribbon([[-ww / 2 + 8, -hh / 2 + 6], [ww / 2 - 8, -hh / 2 + 5]], 1.2) + c.ribbon([[-ww / 2 + 8, hh / 2 - 6], [ww / 2 - 8, hh / 2 - 5]], 1.2), C.haloRim, 'opacity=".7"');
  return `<circle r="${ww * 0.7}" fill="url(#halo-glow)" opacity=".7"/><path d="M${-ww * 0.3} -2400V${-hh / 2}M${ww * 0.3} -2400V${-hh / 2}" stroke="rgba(233,196,111,.6)" stroke-width="1.2" fill="none"/>${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.halo}">${text}</text>`;
}
/** a small cream label hung on a string; origin at the label's centre */
export function tagWord(c, text, { size = 20, fill = C.cream, ink = C.ink, len = 2400, w } = {}) {
  const ww = w || text.length * size * 0.5 + size * 1.3, hh = size * 1.5;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `<path d="M0 ${-len}V${-hh / 2}" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a word lying on paper (no string); origin centre */
export function wordCard(c, text, { size = 20, fill = C.cream, ink = C.ink, w } = {}) {
  const ww = w || text.length * size * 0.5 + size * 1.3, hh = size * 1.5;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}

/* ================================================================== props */
/** a shaft of light falling from above (origin: top centre) */
export function beam(c, w0 = 40, w1 = 160, h = 400, col = '#fff4d0') {
  return `<path d="${c.poly([[-w0 / 2, 0], [w0 / 2, 0], [w1 / 2, h], [-w1 / 2, h]])}" fill="${col}" opacity=".55"/><path d="${c.poly([[-w0 / 4, 0], [w0 / 4, 0], [w1 / 4, h], [-w1 / 4, h]])}" fill="#fffaf0" opacity=".5"/>`;
}
/** a dark scribbled speech bubble (lies, insults); origin at the tail */
export function darkSay(c, { w = 70, h = 44, side = 1, col = mix(C.storm2, C.soilDark, 0.35) } = {}) {
  const d = side;
  const s = sheet();
  const cx = d * (w / 2 - 6), cy = -h / 2 - 14;
  const p = [], n = 18;
  for (let i = 0; i < n; i++) { const a = (i / n) * PI * 2, k = i % 2 ? 1 : 1.14; p.push([cx + Math.cos(a) * (w / 2) * k, cy + Math.sin(a) * (h / 2) * k]); }
  s.p(c.cut(p, 0.6, 5) + c.cut([[d * 10, -12], [0, 0], [d * 3, -14]], 0.2, 3), col);
  const pts = [];
  for (let i = 0; i <= 10; i++) pts.push([cx - w * 0.3 + (i / 10) * w * 0.6, cy + (i % 2 ? -6 : 6) + c.rr(-2, 2)]);
  s.x(c.ribbon(pts, 2.2), mix(C.sunRay, C.terracotta, 0.5), 'opacity=".9"');
  return s.out();
}
/** a pointing shadow hand (accusing); points +x; origin: wrist */
export function pointHand(c, col = '#3b2a22') {
  const s = sheet();
  s.p(c.cut([[0, -8], [22, -9], [30, -12], [62, -10], [62, -4], [34, -3], [36, 4], [30, 10], [18, 12], [4, 9]], 0.4, 4), col);
  return s.out();
}
/** a bushel basket (korzec) with a handle; origin: rim centre (it covers things below it) */
export function bushelBasket(c, w = 70, h = 56) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [w / 2, 0], [w / 2 - 7, -h], [-w / 2 + 7, -h]], 0.6, 6), C.basket);
  let bands = '';
  [0.2, 0.52, 0.84].forEach((f) => { const y = -h * f, ww = w / 2 - 7 * f; bands += c.ribbon([[-ww - 1, y], [ww + 1, y]], 4.4); });
  s.p(bands, shade(C.basket, -0.25));
  s.p(c.ribbon(c.arc(0, -h, w * 0.22, 14, PI, 2 * PI, 8), 4), shade(C.basket, -0.3));
  return s.out();
}
/** a milestone with a Roman numeral; origin: base centre */
export function milestone(c, text) {
  const s = sheet();
  s.p(c.cut([[-18, 0], [-16, -70], ...c.arc(0, -70, 16, 14, PI, 2 * PI, 8), [16, -70], [18, 0]], 0.6, 6), mix(C.stone, C.rock, 0.35));
  s.x(c.ribbon([[-14, -8], [14, -8]], 2), shade(C.stone, -0.25), 'opacity=".5"');
  return `${s.out()}<text x="0" y="-42" text-anchor="middle" font-family="${FONT}" font-size="22" font-weight="600" fill="${shade(C.rock3, -0.3)}">${text}</text>`;
}
/** a soldier's pack on a carrying pole (furca); origin: the carrier's shoulder */
export function pack(c) {
  const s = sheet();
  s.p(c.ribbon([[-40, 10], [30, -40]], 5), C.wood2);
  s.p(c.cut(c.blob(28, -34, 22, 16, 10, 0.15), 0.6, 5), mix(C.leather, C.ochre, 0.3));
  s.p(c.cut(c.blob(12, -22, 12, 10, 8, 0.15), 0.4, 4), C.pot);
  s.x(c.ribbon([[14, -44], [40, -24]], 2.4), C.rope);
  return s.out();
}
/** a single hair, magnified on a round lens; .hairW / .hairB colours can be faded. origin: centre */
export function hairLens(c, r = 70) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 8, 40), 0.4, 5), C.wood2).p(c.cut(c.ribbon([[r * 0.6, r * 0.6], [r * 1.5, r * 1.5]], 16), 0.3, 6), C.wood);
  const glass = `<circle r="${r}" fill="${mix(C.skin, C.dawn, 0.4)}"/><circle r="${r}" fill="url(#halo-glow)" opacity=".35"/>`;
  const path = c.qbez([-r * 0.7, r * 0.3], [0, -r * 0.6], [r * 0.7, r * 0.1], 16);
  const hairB = `<g class="hairB"><path d="${c.ribbon(path, 5)}" fill="${C.hair3}"/></g>`;
  const hairW = `<g class="hairW" opacity="0"><path d="${c.ribbon(path, 5)}" fill="${C.linen}"/></g>`;
  return `${s.out()}${glass}${hairB}${hairW}<path d="${c.ribbon(c.arc(0, 0, r - 8, r - 8, PI * 1.1, PI * 1.45, 8), 3)}" fill="#fff" opacity=".7"/>`;
}
/** the yod — the smallest letter — and a tittle; origin centre */
export function yod(c, h = 30, col = C.ink) {
  return sheet().p(c.cut([[-h * 0.3, -h * 0.5], [h * 0.3, -h * 0.55], [h * 0.34, -h * 0.25], [h * 0.12, -h * 0.1], [0, h * 0.5], [-h * 0.1, h * 0.46], [-h * 0.02, -h * 0.18], [-h * 0.3, -h * 0.26]], 0.3, 4), col).out();
}
/** a scroll of the Law open between two rods, with rows of "letters"; origin: centre. .letters lines are drawn */
export function lawScroll(c, w = 420, h = 200, { title = '' } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.6, 10), C.parchment);
  const rod = (x) => c.cut(c.rect(x - 11, -h / 2 - 16, 22, h + 32), 0.4, 8) + c.cut(c.ell(x, -h / 2 - 22, 9, 7, 10), 0.3, 3) + c.cut(c.ell(x, h / 2 + 22, 9, 7, 10), 0.3, 3);
  s.p(rod(-w / 2 - 8) + rod(w / 2 + 8), C.wood2);
  let ln = '';
  const cols = 3, cw = (w - 60) / cols;
  for (let k = 0; k < cols; k++) {
    for (let y = -h / 2 + 24 + (title ? 20 : 0); y < h / 2 - 16; y += 16) {
      let x = -w / 2 + 24 + k * (cw + 6);
      const end = x + cw - 10;
      while (x < end) { const l = Math.min(end - x, c.rr(6, 16)); ln += c.poly([[x, y - 5], [x + l, y - 5], [x + l, y - 2], [x + l * 0.4, y - 2], [x + l * 0.4, y + 4], [x, y + 4]]); x += l + c.rr(4, 7); }
    }
  }
  s.x(ln, C.ink, 'opacity=".55"');
  const t = title ? `<text x="0" y="${-h / 2 + 30}" text-anchor="middle" font-family="${FONT}" font-size="22" font-style="italic" fill="${C.terracotta}">${title}</text>` : '';
  return s.out() + t;
}
/** a judge's seat under a little awning; origin: base centre */
export function judgeSeat(c) {
  const s = sheet();
  s.p(c.cut([[-60, 0], [-60, -40], [60, -40], [60, 0]], 0.5, 6), mix(C.stone, C.plaster2, 0.4));
  s.p(c.cut([[-40, -40], [-40, -120], [-34, -130], [34, -130], [40, -120], [40, -40]], 0.4, 6), C.wood);
  s.p(c.cut(c.rect(-46, -58, 92, 12), 0.3, 5), C.wood2);
  s.p(c.cut([[-80, -170], [80, -170], [70, -150], [-70, -150]], 0.5, 6), C.curtain);
  s.p(c.ribbon([[-70, -150], [-70, 0]], 5) + c.ribbon([[70, -150], [70, 0]], 5), C.wood2);
  return s.out();
}
/** a small arched stone house front with a barred window (a prison); origin: base centre. .door separate */
export function prisonHouse(c, w = 200, h = 190) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2, -h], [w / 2, -h], [w / 2, 0]], 0.8, 10), C.stone2);
  let bl = '';
  for (let y = -h + 10, r = 0; y < -10; y += 30, r++) for (let x = -w / 2 + 6 + (r % 2) * 24; x < w / 2 - 30; x += 48) bl += c.cut(c.rect(x, y, 42, 24), 0.5, 6);
  s.p(bl, C.stone);
  s.p(c.cut([[-w / 2 - 8, -h - 12], [w / 2 + 8, -h - 12], [w / 2 + 8, -h], [-w / 2 - 8, -h]], 0.4, 8), shade(C.stone2, -0.15));
  // the barred window
  s.p(c.cut(c.rect(w * 0.12, -h * 0.72, w * 0.28, h * 0.26), 0.3, 5), C.soilDark);
  let b = '';
  for (let i = 0; i < 4; i++) b += c.cut(c.rect(w * 0.12 + 6 + i * (w * 0.28 - 12) / 3 - 2, -h * 0.72, 4, h * 0.26), 0.1, 4);
  s.x(b, '#4c4452');
  // the door frame (dark opening)
  s.p(c.cut([[-w * 0.36, 0], [-w * 0.36, -h * 0.5], ...c.arc(-w * 0.22, -h * 0.5, w * 0.14, w * 0.12, PI, 2 * PI, 8), [-w * 0.08, -h * 0.5], [-w * 0.08, 0]], 0.3, 5), C.soilDark);
  return s.out();
}
/** a heavy door leaf with iron bands; origin: hinge side bottom (left) */
export function doorLeaf(c, w = 56, h = 96) {
  const s = sheet().p(c.cut(c.rect(0, -h, w, h), 0.4, 6), C.wood2);
  s.x(c.ribbon([[2, -h + 18], [w - 2, -h + 18]], 4) + c.ribbon([[2, -22], [w - 2, -22]], 4), '#4c4452', 'opacity=".8"');
  s.x(c.poly(c.circ(w - 10, -h / 2, 3.6, 8)), '#4c4452');
  return s.out();
}
/** a big paper key (the guard's); origin: ring centre */
export function bigKey(c, len = 60) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 11, 16), 0.3, 3) + c.hole(c.circ(0, 0, 5.5, 10), 0.2, 3), '#6d6272');
  s.p(c.cut([[9, -3], [len, -3], [len, 3], [9, 3]], 0.3, 5), '#6d6272');
  s.p(c.cut([[len - 16, 3], [len - 16, 12], [len - 10, 12], [len - 10, 7], [len - 5, 7], [len - 5, 12], [len, 12], [len, 3]], 0.2, 3), '#6d6272');
  return s.out();
}
/** a small flame (a light held in the hands); origin: base */
export function smallFlame(c, h = 22) {
  return `<circle cy="${-h * 0.4}" r="${h * 2.2}" fill="url(#warm-glow)"/><path d="M0 0C${-h * 0.34} ${-h * 0.25} ${-h * 0.26} ${-h * 0.62} 0 ${-h}C${h * 0.26} ${-h * 0.62} ${h * 0.34} ${-h * 0.25} 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C${-h * 0.14} ${-h * 0.2} ${-h * 0.1} ${-h * 0.4} 0 ${-h * 0.56}C${h * 0.1} ${-h * 0.4} ${h * 0.14} ${-h * 0.2} 0 -2Z" fill="#fff4d2"/>`;
}
/** a lit little oil lamp to hold (origin: base) */
export function heldLamp(c) {
  const s = sheet().p(c.cut([[-14, 0], [-17, -5], [-9, -9], [6, -9], [13, -7], [19, -9], [21, -7], [14, -1], [7, 1], [-9, 1]], 0.3, 4), C.pot);
  return `${s.out()}<g transform="translate(19 -8)">${smallFlame(c, 14)}</g>`;
}
/** a tiny sepia prophet in a small oval frame; origin: centre */
export function prophetCameo(c, id, look, name, { w = 74, h = 92 } = {}) {
  const oval = c.ell(0, 0, w / 2, h / 2, 30);
  const fr = sheet().p(c.cut(c.ell(0, 0, w / 2 + 7, h / 2 + 7, 30), 0.4, 5), C.ochre).p(c.cut(oval, 0.3, 5), mix(C.parchment, C.dawn, 0.3)).out();
  const bust = `<g clip-path="url(#${id})"><g transform="translate(-2 ${h * 1.08}) scale(${h / 150})">${person(c, look)}</g></g>`;
  const lab = `<g transform="translate(0 ${h / 2 + 18})">${sheet().p(c.cut([[-w * 0.62, -11], [w * 0.62, -12], [w * 0.64, 11], [-w * 0.63, 12]], 0.3, 4), C.cream).out()}<text x="0" y="5" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${C.ink}">${name}</text></g>`;
  return `<defs><clipPath id="${id}"><path d="${c.poly(oval)}"/></clipPath></defs>${sep(fr + bust, 0.45)}${lab}`;
}
export { lerp, swing };
