// John 21 — the Sea of Tiberias at night and at dawn: the fishing boat with its lantern, the net (empty, then
// bursting with silver fish), the pebbled beach with the charcoal fire (the same fire as the night of the denial),
// fish laid on the coals and bread; the seven disciples with their looks from Mark 3 / John 1; Peter bare-armed in
// his tunic, Peter swimming; the lambs and sheep of John 10; the rooster plate of John 13 whose three marks become
// hearts; footprints of light; old Peter's picture; the beloved disciple at his desk, and the books of the world.
// Everything returns SVG markup (origin noted), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging, lerp, blinkAt } from '../kit.js';
import { band, waterBand, waveStrip, stars, sun, moon, cloud, grass, rock, reeds, town, cypress, olive } from '../../assets/nature.js';
export { waveStrip, band, grass, rock, reeds, town, cypress, olive, cloud } from '../../assets/nature.js';
import { fade, attr, es } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK as L3 } from '../mark3/lib.js';
import { hull } from '../john6/lib.js';
import { firePit } from '../mark14/lib.js';
import { bust, rayBurst as rayBurst1, hungPlate as hungPlate1 } from '../john1/lib.js';
import { ewe, sheepRig } from '../john10/lib.js';
import { lightHeart as lightHeart1 } from '../john13/lib.js';
import { dawnDisc as dawnDisc1 } from '../john6/lib.js';
import { withFace as withFace3, faceBits as faceBits3 } from '../mark3/lib.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, heart, addToHead, addToBody, scrollOpen, wordSlip, lowTable, candle } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, strip, question, sparkle, shadowPerson, silhouette } from '../mark3/lib.js';
export { castNet, netDrape, footprint, flame, voiceRings, hang2 } from '../mark1/lib.js';
export { fishCut, staff, tick, labelTag, storyFrame, SEPIA, basket } from '../mark6/lib.js';
export { rooster, tally, vis, firePit, fireFlames, oilLamp, seal, lampGlow, hangingLamp, supperTable, chalice } from '../mark14/lib.js';
export { rayBurst, radiance, glowDisc, hungGold, hungWord, hungPlate, iconWord, goldWord, darkSheet, bust } from '../john1/lib.js';
export { hull, floatTag, barleyLoaf, dawnDisc } from '../john6/lib.js';
export { ewe, sheepRig };
export { lightHeart, mini, stepPath, lightDrop } from '../john13/lib.js';
export { iAm, framed, numberCard, lightPath, drawPath } from '../john8/lib.js';
export { skyKeys, medallion, miniHead, tombIcon } from '../mark16/lib.js';
export { lightCrown, glory, globe } from '../mark8/lib.js';
export { tr, sky, hanging, pose, fade, attr, sheet, shade, mix, C, CAST, person, crowdPerson, lerp, blinkAt };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
export const INK = '#3b2a22';

/* ====================================================================== skies */
export const DUSK = ['#7d77a6', '#dca390', '#f1c79e'];
export const NIGHT = ['#141a3d', '#232b5e', '#3c4478'];
export const PREDAWN = ['#3a3f6e', '#8a7b9c', '#d6a99a'];
export const DAWN = ['#b9b3cf', '#f0c9ad', '#f8dfbd'];
export const SUNRISE = ['#c9d4d8', '#f3dcb8', '#f9e6c6'];
export const MORNING = ['#cfe2dd', '#f1e9cf', '#f8ecd2'];
export const EVENING = ['#8b83ad', '#e0aa92', '#f3cfa6'];
export const LAMPLIT = ['#1a1c3a', '#272a52', '#3a3b66'];

/* ====================================================================== the cast */
export const JESUS = CAST.jesus;
export const PETER = CAST.peter;
/** Peter at work in the boat: stripped to his tunic, the outer garment laid aside */
export const PETER_BARE = { ...CAST.peter, mantle: null, belt: C.rope };
/** Peter grown old (white hair and beard) */
export const PETER_OLD = { ...CAST.peter, hair: '#ece6da', beardColor: '#ece6da' };
/** the beloved disciple grown old — the writer of the Gospel (same robe, grey hair, a short beard) */
export const JOHN_OLD = { ...CAST.john, hair: '#d9d2c4', beard: 'short', beardColor: '#d9d2c4', mantle: C.skyVeil };
/** "another" who will gird him — a plain stone-grey figure, no face features that matter */
export const OTHER = { robe: mix(C.stone2, C.storm, 0.25), mantle: mix(C.rock2, C.storm, 0.2), hair: C.hair3, hairStyle: 'wrap', veil: mix(C.stone2, C.storm, 0.3), beard: 'short', skin: C.skin3, belt: C.leather };

/** the seven by the lake (v2), in the order named; tag = the index of the name tag they share */
export const SEVEN = [
  { k: 'peter', o: CAST.peter, bare: PETER_BARE, tag: 0 },
  { k: 'thomas', o: CAST.thomas, tag: 1 },
  { k: 'nathanael', o: L3.bartholomew, tag: 2 },
  { k: 'james', o: CAST.james, tag: 3 },
  { k: 'john', o: CAST.john, tag: 3 },
  { k: 'other1', o: CAST.andrew, tag: 4 },
  { k: 'other2', o: L3.philip, tag: 4 },
];
export const TAGS = () => [
  tr(['Szymon', 'Piotr'], ['Simon', 'Peter']),
  tr(['Tomasz,', 'zwany Didymos'], ['Thomas,', 'called Didymus']),
  tr(['Natanael', 'z Kany'], ['Nathanael', 'of Cana']),
  tr(['synowie', 'Zebedeusza'], ['the sons', 'of Zebedee']),
  tr(['i dwaj', 'inni'], ['and two', 'others']),
];
/** a working disciple (tunic, no mantle) */
export const bare = (o) => ({ ...o, mantle: null });

/* ====================================================================== the lake & the shore */
/**
 * The Sea of Tiberias with a beach in front. Sky (+ a night sky and stars that can fade in), sun and moon on strings,
 * the far hills with Tiberias, the lake, slow waves, the beach (its edge `bfn(x)`), pebbles and tufts.
 * opts: skyCols, beachFn(x) → y of the waterline, night (build the night sky/stars), sunAt, moonAt, far: hill tint.
 * Returns handles; `idle(time, o)` sways the sun/moon/cloud and slides the waves.
 */
export function shoreSet(S, { skyCols = DAWN, beachFn, night = false, sunAt = [1180, 520], moonAt = null, cloudAt = [520, 170], waves = true, beach = true } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  let nightSky = null, starL = null;
  if (night) {
    nightSky = sky(S, NIGHT, { name: 'night' });
    starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -900, x1: 2500, y0: -500, y1: 420, n: 170 }));
  }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, `<circle r="140" fill="url(#warm-glow)" opacity=".7"/>${sun(c, 46)}`, { x: sunAt[0], y: sunAt[1], len: 1400 });
  const moonEl = moonAt ? hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 34)}`, { x: moonAt[0], y: moonAt[1], len: 1100 }) : null;
  const cl = hanging(hangL, cloud(c, 220, mix(C.cream, C.dawn, 0.4), mix(C.duskViolet, C.dawn, 0.5)), { x: cloudAt[0], y: cloudAt[1], len: 900 });
  const far = S.layer({ par: 0.08, sh: 2 });
  const fb = band(c, { y: 410, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.25) });
  far.add(fb.markup + town(c, { x: 1320, y: fb.fn(1320) + 10, n: 6, spread: 200, sc: 0.36 }) + town(c, { x: 260, y: fb.fn(260) + 12, n: 4, spread: 140, sc: 0.32 }));
  const lakeL = S.layer({ par: 0.12, sh: 1 });
  lakeL.add(waterBand(c, { y: 436, color: mix(C.lake, C.skyBlue, 0.25), foamN: 26, bottom: 1700 }).markup);
  const sunPath = lakeL.add(`<g opacity="0">${Array.from({ length: 9 }, (_, i) => `<path d="${c.cut([[-46, 0], [0, -2.4], [46, 0], [0, 2]], 0.2, 8)}" fill="${C.halo}" transform="translate(${c.rr(-16, 16).toFixed(0)} ${i * 20}) scale(${(1 - i * 0.07).toFixed(2)} 1)"/>`).join('')}</g>`);
  let wB = null;
  if (waves) {
    wB = S.layer({ par: 0.2, sh: 2, pad: 260 });
    wB.add(waveStrip(c, { y: 560, len: 220, amp: 9, color: mix(C.lake, C.lake2, 0.35), x0: -1400, x1: 3000 }));
  }
  let beachL = null, bfn = null;
  if (beach) {
    bfn = beachFn || c.wave(650, [5, 2], [600, 170]);
    beachL = S.layer({ par: 0.4, sh: 3 });
    const b = sheet().p(c.ridge(bfn, -1400, 2800, 1700, 12, 1), mix(C.sand, C.stone, 0.3));
    let peb = '';
    for (let i = 0; i < 90; i++) { const x = c.rr(-700, 2300); peb += c.cut(c.blob(x, bfn(x) + c.rr(16, 260), c.rr(4, 9), c.rr(2.5, 5), 7, 0.2), 0.2, 3); }
    b.x(peb, C.stone2, 'opacity=".7"');
    beachL.add(b.out());
    beachL.add(`<path d="${c.ribbon(Array.from({ length: 48 }, (_, i) => { const x = -1400 + i * 90; return [x, bfn(x) + 2]; }), 4)}" fill="${C.foam}" opacity=".85"/>`);
    beachL.add(rock(c, 300, bfn(300) + 60, 90, 34, C.rock2) + rock(c, 1420, bfn(1420) + 70, 110, 40, C.rock) + reeds(c, 170, bfn(170) + 14, 8, 70) + grass(c, { x0: -700, x1: 420, y: 0, fn: (x) => bfn(x) + 150, n: 14, h: 12, color: C.olive }));
  }
  return {
    sk, nightSky, starL, hangL, sunEl, moonEl, cl, far, lakeL, sunPath, wB, beachL, bfn,
    idle(time, { sun: so = 1, sunX = sunAt[0], sunY = sunAt[1], moon: mo = 0, moonX = moonAt?.[0], moonY = moonAt?.[1], cloud: co = 1, calm = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.5) * 0.8, o: so });
      if (moonEl) pose(moonEl, { x: moonX, y: moonY, r: Math.sin(time * 0.5 + 1) * 0.8, o: mo });
      pose(cl, { x: cloudAt[0] + Math.sin(time * 0.08) * 30, y: cloudAt[1], r: Math.sin(time * 0.6 + 2) * 1, o: co });
      if (wB) wB.shift(-((time * 12 * calm) % 220) + 110, Math.sin(time * 0.8) * 3);
    },
  };
}

/* ====================================================================== the boat */
/** the lantern hung on the prow post (origin at the hook) — .flame and .glow fade */
export function prowLantern(c) {
  const s = sheet();
  s.x(c.ribbon([[0, 0], [0, 14]], 1.4), C.soilDark);
  s.p(c.cut([[-9, 14], [9, 14], [11, 20], [11, 38], [8, 42], [-8, 42], [-11, 38], [-11, 20]], 0.3, 4), mix(C.wood2, C.soilDark, 0.3));
  s.p(c.cut([[-7, 20], [7, 20], [7, 37], [-7, 37]], 0.2, 3), mix(C.lampGlow, C.soilDark, 0.35));
  return `<g class="glow" opacity="0"><circle cx="0" cy="28" r="120" fill="url(#warm-glow)"/></g>${s.out()}<g class="flame" opacity="0"><path d="${c.cut([[-5, 36], [0, 21], [5, 36]], 0.2, 3)}" fill="${C.lampFlame}"/><path d="${c.cut(c.ell(0, 32, 5, 5, 8), 0.1, 2)}" fill="#fff4d2"/></g>`;
}
/**
 * The fishing boat with people in it. Returns { el, back, front, post, lantern, parts }: add `el` to a layer;
 * people go in `<g data-k="crewN">` slots between back and front (made by the caller through `inner`).
 * origin: waterline centre, ~ 420 wide.
 */
export function fishingBoat(c, inner = '', { w = 420, col = C.wood, stripe = C.terracotta, lantern = true } = {}) {
  const H = hull(c, { w, col, stripe });
  const post = sheet().p(c.ribbon([[w / 2 - 8, -76], [w / 2 + 2, -150]], 5), C.wood2).out();
  return `<g>${H.back}</g>${inner}<g>${H.front}</g>${post}${lantern ? `<g class="lantern" transform="translate(${w / 2 + 2} -148)">${prowLantern(c)}</g>` : ''}`;
}
/** a folded mantle lying on the boat's bench (origin: bottom centre) */
export function foldedMantle(c, col = C.ochre) {
  return sheet().p(c.cut([[-24, 0], [-22, -10], [20, -12], [26, -2], [24, 0]], 0.4, 4), col).x(c.ribbon([[-18, -6], [20, -7]], 1.2), shade(col, -0.2), 'opacity=".6"').out();
}
/** a mantle flying through the air (origin centre) */
export function flyingMantle(c, col = C.ochre) {
  const pts = [[-30, -10], [-10, -22], [18, -18], [34, -4], [22, 12], [0, 8], [-20, 16], [-34, 4]];
  return sheet().p(c.cut(pts, 0.8, 5), col).x(c.ribbon([[-20, 0], [16, -8]], 1.4), shade(col, -0.2), 'opacity=".6"').out();
}

/* ====================================================================== the net & the fish */
export const SILVER = ['#b9c9cc', '#a7bcc2', '#cfd8d6', '#98b0b6', '#c3cfd0'];
/** a silver paper fish facing right (origin centre, ~ 54 long at r 1) */
export function silverFish(c, i = 0, r = 1) {
  const col = SILVER[i % SILVER.length];
  const s = sheet();
  s.p(c.cut([[-22, 0], [-6, -9], [10, -8], [22, 0], [10, 8], [-6, 8], [-22, 0], [-32, -9], [-30, 0], [-32, 9]].map(([x, y]) => [x * r, y * r]), 0.3, 4), col);
  s.x(c.ribbon(c.arc(4 * r, 0, 5 * r, 7 * r, -1.2, 1.2, 6), 1.2), shade(col, -0.3), 'opacity=".6"');
  s.x(c.ribbon([[-14 * r, -2 * r], [12 * r, -3 * r]], 1.3 * r), '#f4f7f2', 'opacity=".7"');
  s.x(c.poly(c.circ(12 * r, -2 * r, 1.6 * r, 6)), C.ink);
  return s.out();
}
/**
 * The net full of fish: a bulging bag of mesh, fish packed inside. Origin at the left end (where the rope is tied);
 * it spreads to the right, w × h (hangs down). .fish[data-i] are the fish (for counting / glinting).
 */
export function fullNet(c, { w = 300, h = 120, n = 34, col = C.rope } = {}) {
  const top = (x) => -Math.sin((x / w) * PI) * 8;
  const bot = (x) => Math.sin((x / w) * PI) * h * 0.95 + (x / w) * h * 0.1;
  let fish = '';
  const rows = Math.ceil(n / 8);
  for (let i = 0; i < n; i++) {
    const x = c.rr(0.08, 0.92) * w;
    const y = lerp(top(x) + 14, bot(x) - 12, c.rr(0, 1));
    fish += `<g class="fish" data-i="${i}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${c.rr(-35, 35).toFixed(0)}) scale(${c.rr(0.55, 0.85).toFixed(2)} ${(c.chance(0.5) ? 1 : -1) * c.rr(0.55, 0.85)})">${silverFish(c, i)}</g>`;
  }
  void rows;
  const bag = [];
  for (let i = 0; i <= 20; i++) bag.push([(i / 20) * w, top((i / 20) * w)]);
  for (let i = 20; i >= 0; i--) bag.push([(i / 20) * w, bot((i / 20) * w)]);
  let mesh = '';
  for (let i = 1; i < 16; i++) { const x = (i / 16) * w; mesh += c.ribbon([[x - 10, top(x)], [x + 10, bot(x)]], 1.1) + c.ribbon([[x + 10, top(x)], [x - 10, bot(x)]], 1.1); }
  for (let k = 1; k < 4; k++) mesh += c.ribbon(Array.from({ length: 13 }, (_, i) => { const x = (i / 12) * w; return [x, lerp(top(x), bot(x), k / 4)]; }), 1.1);
  mesh += c.ribbon(Array.from({ length: 13 }, (_, i) => { const x = (i / 12) * w; return [x, top(x)]; }), 2.6);
  let floats = '';
  for (let i = 1; i < 8; i++) { const x = (i / 8) * w; floats += c.cut(c.ell(x, top(x) - 1, 6, 3.6, 8), 0.2, 3); }
  return `<path d="${c.poly(bag)}" fill="${mix(C.lake3, C.lakeDeep, 0.3)}" opacity=".35"/>${fish}<path d="${mesh}" fill="${col}"/><path d="${floats}" fill="${C.terracotta}"/>`;
}
/** a hanging net, empty and dripping (origin at the top centre, where hands hold it) */
export function emptyNet(c, { w = 120, h = 90, col = C.rope } = {}) {
  let d = '';
  for (let i = 0; i <= 8; i++) { const x = -w / 2 + (i / 8) * w; d += c.ribbon([[x, 0], [x * 0.35, h]], 2.2); }
  for (let k = 1; k <= 4; k++) { const y = (k / 4) * h; const hw = lerp(w / 2, w * 0.18, k / 4); d += c.ribbon(c.qbez([-hw, y], [0, y + 6], [hw, y], 8), 2); }
  d += c.ribbon([[-w / 2, 0], [w / 2, 0]], 3.4);
  const drops = [0, 1, 2].map((i) => `<path class="drip" data-i="${i}" d="${c.cut([[0, -5], [3, 0], [0, 3], [-3, 0]], 0.1, 2)}" fill="#cfe6ea" transform="translate(${-14 + i * 14} ${h + 6})"/>`).join('');
  return `<path d="${d}" fill="${col}"/>${drops}`;
}
/** a splash (origin at the water surface): drops fly up and out; .drop[data-i] */
export function splashCrown(c, r = 40, n = 9, col = '#dcecf0') {
  let out = `<path d="${c.cut([[-r, 0], [-r * 0.7, -r * 0.5], [-r * 0.35, -r * 0.2], [0, -r * 0.9], [r * 0.35, -r * 0.2], [r * 0.7, -r * 0.55], [r, 0]], 0.6, 5)}" fill="${C.foam}"/>`;
  for (let i = 0; i < n; i++) out += `<g class="drop" data-i="${i}"><path d="${c.cut(c.ell(0, 0, 4, 6, 8), 0.2, 2)}" fill="${col}"/></g>`;
  return out;
}
/** a patch of lake water with a foam lip, to hide a swimmer's body (origin at its surface centre) */
export function waterPatch(c, w = 150, col = C.lake2) {
  const pts = [];
  for (let i = 0; i <= 12; i++) pts.push([-w / 2 + (i / 12) * w, Math.sin(i * 1.3) * 2.5]);
  pts.push([w / 2, 160], [-w / 2, 160]);
  return sheet().p(c.cut(pts, 0.4, 6), col).x(c.ribbon(pts.slice(0, 13), 3.4), C.foam, 'opacity=".9"').out();
}

/* ====================================================================== the fire on the beach */
/**
 * The charcoal fire: a ring of stones and glowing coals (static piece), and small flames (.tongue[data-i]) + the glow.
 * Returns markup parts { base, coals, flames, glow } — origin: ground centre. Laid on it (optional): fish & bread.
 */
export function coalFire(c, w = 120) {
  const s = sheet();
  let st = '';
  for (let i = 0; i < 9; i++) { const a = PI + (i / 8) * PI; st += c.cut(c.blob(Math.cos(a) * w * 0.52, -4 + Math.sin(a) * -6 + 6, 11, 8, 8, 0.2), 0.4, 3); }
  s.p(st, C.rock3);
  const coals = sheet();
  let cd = '';
  for (let i = 0; i < 16; i++) cd += c.cut(c.blob(c.rr(-w * 0.4, w * 0.4), c.rr(-14, -3), c.rr(6, 10), c.rr(4, 7), 7, 0.25), 0.3, 3);
  coals.p(cd, mix(C.soilDark, C.terracotta, 0.35));
  let hot = '';
  for (let i = 0; i < 12; i++) hot += c.cut(c.blob(c.rr(-w * 0.36, w * 0.36), c.rr(-13, -4), c.rr(3, 6), c.rr(2, 4), 6, 0.25), 0.2, 2);
  const tongues = [[-26, 34, C.sunDeep], [18, 40, C.sunDeep], [-6, 52, C.sun], [10, 36, C.lampFlame], [-16, 30, C.lampFlame], [2, 28, '#fff4d2']];
  const flames = tongues.map(([x, h, col], i) => `<g class="tongue" data-i="${i}" transform="translate(${x} -10)"><path d="M0 0C${-h * 0.32} ${-h * 0.2} ${-h * 0.24} ${-h * 0.6} 0 ${-h}C${h * 0.26} ${-h * 0.6} ${h * 0.32} ${-h * 0.2} 0 0Z" fill="${col}"/></g>`).join('');
  return {
    base: s.out() + coals.out() + `<path class="hot" d="${hot}" fill="${C.sunDeep}"/>`,
    hot: `<path d="${hot}" fill="#ffcf7a"/>`,
    flames,
    glow: `<circle r="${w * 2.2}" fill="url(#warm-glow)"/>`,
  };
}
/** fish laid on the coals + a round loaf beside (origin: ground centre of the fire) */
export function onTheCoals(c) {
  const s = sheet();
  s.p(c.ribbon([[-44, -18], [44, -20]], 3) + c.ribbon([[-40, -12], [42, -13]], 2.4), mix(C.soilDark, C.rock3, 0.4));
  return s.out() + `<g transform="translate(-14 -26) scale(.8)">${roastFish(c)}</g><g transform="translate(20 -24) scale(.7) rotate(8)">${roastFish(c)}</g>`;
}
/** a roasted fish (origin centre, ~ 54 long) */
export function roastFish(c) {
  const col = mix(C.clay, C.wheat2, 0.35);
  const s = sheet();
  s.p(c.cut([[-22, 0], [-6, -9], [10, -8], [22, 0], [10, 8], [-6, 8], [-22, 0], [-32, -9], [-30, 0], [-32, 9]], 0.3, 4), col);
  s.x(c.ribbon([[-12, -6], [-8, 6]], 1.4) + c.ribbon([[-2, -7], [2, 7]], 1.4) + c.ribbon([[8, -6], [11, 5]], 1.4), shade(col, -0.35), 'opacity=".6"');
  s.x(c.poly(c.circ(13, -2, 1.5, 6)), C.ink);
  return s.out();
}
/** a flat round loaf (origin centre) */
export function flatLoaf(c, r = 16) {
  const s = sheet().p(c.cut(c.ell(0, 0, r, r * 0.55, 16), 0.4, 4), C.wheat2).p(c.cut(c.ell(-1, -2, r * 0.78, r * 0.36, 14), 0.3, 4), mix(C.wheat, C.wheat2, 0.4));
  s.x(c.ribbon([[-r * 0.4, -3], [r * 0.3, -4]], 1.2), shade(C.wheat2, -0.25), 'opacity=".6"');
  return s.out();
}
/** a curl of steam / smoke (origin at its foot) */
export function steamCurl(c, h = 60) {
  return `<path d="${c.ribbon(c.cbez([0, 0], [-12, -h * 0.35], [12, -h * 0.6], [-4, -h], 14), (u) => 3.2 * (1 - u) + 0.8)}" fill="#fbf4e6" opacity=".65"/>`;
}
/** the bread-and-fish on a small board, handed round (origin centre) */
export function breadBit(c) { return `<g transform="scale(.7)">${flatLoaf(c, 14)}</g>`; }
export function fishBit(c) { return `<g transform="scale(.55)">${roastFish(c)}</g>`; }

/* ====================================================================== plates & devices */
/** a round plate (inner r ~ 70) with the courtyard fire + the rooster of the denial, faint; three .mark[data-i] */
export const DENIAL_FACE = mix(C.night, C.duskViolet, 0.4);
export function denialPlate(c, r = 78) {
  return `<circle cx="-8" cy="${r * 0.2}" r="${r * 0.55}" fill="url(#warm-glow)" opacity=".55"/>`
    + `<g transform="translate(-18 ${r * 0.58}) scale(.42)">${firePit(c, 110)}</g>`
    + `<g transform="translate(26 ${r * 0.62}) scale(.62)">${roosterDark(c)}</g>`
    + `<circle cx="${-r * 0.42}" cy="${-r * 0.38}" r="12" fill="${C.moon}" opacity=".8"/>`;
}
function roosterDark(c) {
  // a small rooster silhouette (no import cycle: drawn here like mark14's, dark)
  const s = sheet();
  const D = '#2a2233';
  let tl = '';
  for (let i = 0; i < 4; i++) tl += c.ribbon(c.qbez([-20, -44], [-50 - i * 4, -80 + i * 8], [-44 - i * 6, -20 + i * 5], 12), (u) => 7 - u * 5);
  s.p(tl, D);
  s.p(c.cut([[-26, -44], [-10, -58], [8, -60], [22, -52], [26, -34], [16, -20], [0, -16], [-18, -22], [-28, -34]], 0.6, 5), D);
  s.p(c.cut([[6, -54], [12, -74], [18, -86], [28, -88], [34, -80], [30, -66], [24, -52]], 0.4, 4), D);
  s.p(c.cut([[16, -88], [18, -98], [22, -92], [25, -100], [28, -92], [32, -96], [32, -86]], 0.3, 3), D);
  s.p(c.poly([[33, -84], [42, -81], [33, -79]]), D);
  s.p(c.ribbon([[-4, -22], [-6, 0]], 3) + c.ribbon([[6, -22], [8, 0]], 3), D);
  return s.out();
}
/** a dark mark (one denial), origin centre */
export function darkMark(c) { return `<path d="${c.ribbon([[0, 14], [2, -14]], 6)}" fill="#2a2233"/>`; }

/** a small numeral medallion: I, II, III (origin centre) */
export function numeral(c, text, { r = 20, fill = C.cream, ink = C.terracotta, rim = C.haloRim } = {}) {
  return sheet().p(c.cut(c.circ(0, 0, r + 3, 20), 0.3, 3), rim).p(c.cut(c.circ(0, 0, r, 20), 0.3, 3), fill).out()
    + `<text x="0" y="${(r * 0.36).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${r * 1.05}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a heart with a question mark (the question "do you love Me?"), origin centre */
export function heartQ(c, r = 26) {
  const pts = [...c.arc(-r * 0.5, -r * 0.2, r * 0.52, r * 0.52, PI * 0.8, PI * 2, 12), ...c.arc(r * 0.5, -r * 0.2, r * 0.52, r * 0.52, PI, PI * 2.2, 12), [0, r * 0.95]];
  return sheet().p(c.cut(pts, 0.5, 5), C.jesusMantle).out() + `<text x="0" y="${(r * 0.3).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${r * 1.1}" font-style="italic" fill="${C.cream}">?</text>`;
}
/** a path of glowing footprints (each a <g data-i>), from (0,0) along pts; origin: world coords of pts */
export function lightSteps(c, pts, { n = 10, s0 = 0.5, s1 = 1, col = C.halo } = {}) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const k = u * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(k)), f = k - j;
    const x = lerp(pts[j][0], pts[j + 1][0], f), y = lerp(pts[j][1], pts[j + 1][1], f);
    const sc = lerp(s0, s1, u), side = i % 2 ? 1 : -1;
    const ang = Math.atan2(pts[j + 1][1] - pts[j][1], pts[j + 1][0] - pts[j][0]) * 180 / PI;
    out += `<g data-i="${i}" opacity="0" transform="translate(${x.toFixed(1)} ${(y + side * 5 * sc).toFixed(1)}) rotate(${ang.toFixed(0)}) scale(${sc.toFixed(2)} ${(sc * 0.55).toFixed(2)})"><circle r="22" fill="url(#halo-glow)"/><path d="${c.cut([[-15, -5], [-4, -8], [10, -6], [16, -1], [12, 5], [-2, 6], [-14, 4]], 0.3, 3)}" fill="${col}"/></g>`;
  }
  return out;
}
/** a book lying flat or standing: spine view; origin: bottom centre. col = cover */
export function book(c, { w = 70, h = 16, col = C.terracotta, band: bnd = C.haloRim } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h, w, h), 0.3, 5), col);
  s.p(c.cut(c.rect(-w / 2 + 4, -h + 2, w - 8, 2.6), 0.1, 4), mix(C.parchment, col, 0.2));
  s.x(c.ribbon([[-w * 0.3, -h], [-w * 0.3, 0]], 2) + c.ribbon([[w * 0.3, -h], [w * 0.3, 0]], 2), bnd, 'opacity=".8"');
  return s.out();
}
export const BOOK_COLS = [C.terracotta, C.teal2, C.plumRobe, C.ochre, C.dustyBlue, C.clay, C.sageRobe, C.jesusMantle, C.wood3, C.mauve];
/** a stack of n books, varied (origin: bottom centre) */
export function bookStack(c, n = 5, { w = 70 } = {}) {
  let out = '', y = 0;
  for (let i = 0; i < n; i++) {
    const bw = w * c.rr(0.8, 1.05), bh = c.rr(11, 18), dx = c.rr(-6, 6);
    out += `<g transform="translate(${dx.toFixed(1)} ${y.toFixed(1)})">${book(c, { w: bw, h: bh, col: c.pick(BOOK_COLS) })}</g>`;
    y -= bh;
  }
  return out;
}
/** a rolled scroll lying down (origin: bottom centre) */
export function scrollLying(c, w = 70, col = C.parchment) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -14, w, 14), 0.3, 5), col);
  s.p(c.cut(c.ell(-w / 2, -7, 5, 7, 10), 0.2, 3) + c.cut(c.ell(w / 2, -7, 5, 7, 10), 0.2, 3), mix(col, C.wood3, 0.4));
  s.x(c.ribbon([[-4, -14], [-4, 0]], 3), C.terracotta, 'opacity=".8"');
  return s.out();
}
/** an open book (origin: bottom centre of the spine), pages with lines */
export function openBook(c, w = 90, col = C.terracotta) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 4, 2], [-w / 2 - 4, -w * 0.36], [0, -w * 0.3], [w / 2 + 4, -w * 0.36], [w / 2 + 4, 2]], 0.3, 5), col);
  s.p(c.cut([[-w / 2, 0], [-w / 2, -w * 0.38], [-w * 0.2, -w * 0.42], [0, -w * 0.34], [0, 0]], 0.3, 5), C.cream);
  s.p(c.cut([[0, 0], [0, -w * 0.34], [w * 0.2, -w * 0.42], [w / 2, -w * 0.38], [w / 2, 0]], 0.3, 5), C.linen2);
  let l = '';
  for (let i = 0; i < 4; i++) { const y = -w * 0.3 + i * w * 0.065; l += c.ribbon([[-w * 0.44, y], [-w * 0.06, y - 1]], 1) + c.ribbon([[w * 0.06, y - 1], [w * 0.44, y]], 1); }
  s.x(l, C.inkSoft, 'opacity=".5"');
  return s.out();
}
/** the writing desk: a low slanted board on legs (origin: floor centre); top edge at y ≈ -64 */
export function writingDesk(c, w = 200) {
  const s = sheet();
  s.p(c.cut([[-w / 2 + 14, 0], [-w / 2 + 22, -60], [-w / 2 + 34, -60], [-w / 2 + 28, 0]], 0.3, 5) + c.cut([[w / 2 - 28, 0], [w / 2 - 34, -60], [w / 2 - 22, -60], [w / 2 - 14, 0]], 0.3, 5), C.wood2);
  s.p(c.cut([[-w / 2, -58], [w / 2, -70], [w / 2 + 2, -60], [-w / 2 + 2, -48]], 0.4, 6), C.wood);
  s.x(c.ribbon([[-w / 2 + 6, -53], [w / 2 - 6, -65]], 1.4), shade(C.wood, 0.2), 'opacity=".6"');
  return s.out();
}
/** a sheet of parchment on the desk with lines of writing (.ln[data-i] fade in), origin: its bottom-left corner */
export function writtenSheet(c, w = 130, h = 62, n = 7) {
  const s = sheet().p(c.cut([[0, 0], [w, -10], [w + 2, -h - 8], [2, -h + 2]], 0.4, 5), C.parchment);
  let lines = '';
  for (let i = 0; i < n; i++) {
    const y0 = -h + 12 + i * ((h - 18) / (n - 1));
    const len = i === n - 1 ? w * 0.5 : w * c.rr(0.72, 0.86);
    const pts = [];
    for (let k = 0; k <= 10; k++) { const x = 10 + (k / 10) * len; pts.push([x, y0 - (x / w) * 10 + Math.sin(k * 2.1 + i) * 0.8]); }
    lines += `<path class="ln" data-i="${i}" opacity="0" d="${c.ribbon(pts, 1.3)}" fill="${C.inkSoft}"/>`;
  }
  return s.out() + lines;
}
/** a reed pen (held; arm-local: hand at 0,0, arm pointing +y) */
export function reedPen(c) {
  return `<g transform="rotate(-150)">${sheet().p(c.ribbon([[0, -6], [0, 44]], 2.6), C.wood3).out()}</g>`;
}
/** a hanging picture frame: a gilt rectangular frame on two strings; inner drawn in (0..w, 0..h) (origin: top centre) */
export function pictureFrame(c, inner, { w = 260, h = 180, bg = C.parchment, rim = C.wood3, clipId } = {}) {
  const fr = sheet().p(c.cut(c.rect(-w / 2 - 12, -12, w + 24, h + 24), 0.6, 8), rim).p(c.cut(c.rect(-w / 2 - 5, -5, w + 10, h + 10), 0.4, 8), shade(rim, 0.2)).out();
  return `<path d="M${-w * 0.3} -1600V-12M${w * 0.3} -1600V-12" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${fr}<g${clipId ? ` clip-path="url(#${clipId})"` : ''}><rect x="${-w / 2}" y="0" width="${w}" height="${h}" fill="${bg}"/><g transform="translate(${-w / 2} 0)">${inner}</g></g>`;
}
/** a belt / girdle cord (origin: centre; ~ 70 wide) */
export function girdle(c, col = C.rope, w = 70) {
  return sheet().p(c.ribbon(c.qbez([-w / 2, 0], [0, 6], [w / 2, 0], 10), 5) + c.ribbon([[w * 0.1, 3], [w * 0.2, 26]], 3) + c.ribbon([[w * 0.14, 3], [w * 0.32, 22]], 3), col).out();
}
/** a far city on a hill (Rome, for the picture) — small, origin: ground centre */
export function farWalls(c, sc = 1, col = mix(C.stone2, C.duskViolet, 0.2)) {
  const s = sheet();
  const W = 120 * sc, H = 34 * sc;
  s.p(c.cut([[-W / 2, 0], [-W / 2, -H], [-W * 0.3, -H], [-W * 0.3, -H * 1.5], [-W * 0.18, -H * 1.5], [-W * 0.18, -H], [W * 0.1, -H], [W * 0.1, -H * 1.9], [W * 0.26, -H * 1.9], [W * 0.26, -H], [W / 2, -H], [W / 2, 0]], 0.3, 5), col);
  let bat = '';
  for (let x = -W / 2; x < W / 2; x += 10 * sc) bat += c.cut(c.rect(x, -H - 5 * sc, 5 * sc, 5 * sc), 0.1, 3);
  s.p(bat, col);
  return s.out();
}

/** a round hanging plate with a clipped portrait (head & shoulders) of `o`; origin: plate centre */
export function portraitPlate(S, o, { r = 64, face = C.halo, rim = C.haloRim, sc = 0.62, dy = 10, glow = true } = {}) {
  const c = S.c;
  const id = S.id('pp');
  S.defs(`<clipPath id="${id}"><circle r="${r - 6}"/></clipPath>`);
  const s = sheet().p(c.cut(c.circ(0, 0, r + 6, 36), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r, 34), 0.5, 5), C.cream).p(c.cut(c.circ(0, 0, r - 6, 32), 0.4, 5), face);
  return `<g class="hang"><path d="M0 -1600V${-r - 6}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${glow ? `<circle r="${r * 2.4}" fill="url(#halo-glow)"/>` : ''}${s.out()}<g clip-path="url(#${id})"><g transform="translate(0 ${dy})">${bust(c, o, sc)}</g></g></g>`;
}
/** a little fish icon for bubbles (origin centre) */
export const fishIcon = (c, i = 0, r = 0.8) => silverFish(c, i, r);
/** a bundled net slung over the shoulder, hanging down the back (body coords; insert with addToBody) */
export function netBundle(c, col = mix(C.rope, C.linen, 0.35)) {
  const cl = c.qbez([6, -146], [-12, -112], [-34, -54], 12);
  const L = [], R = [];
  let d = '';
  cl.forEach(([x, y], i) => {
    const u = i / (cl.length - 1), w = 16 - u * 3;
    L.push([x - w, y + 2]); R.push([x + w, y - 2]);
    if (i % 2 === 0 && i < cl.length - 1) { const [x2, y2] = cl[i + 1]; d += c.ribbon([[x - w, y], [x2 + w, y2 + 8]], 1.5) + c.ribbon([[x + w, y], [x2 - w, y2 + 8]], 1.5); }
  });
  d += c.ribbon(L, 1.8) + c.ribbon(R, 1.8);
  const fl = [0.1, 0.3, 0.5].map((u) => { const [x, y] = cl[Math.round(u * (cl.length - 1))]; return c.cut(c.ell(x + 12, y - 2, 5, 3.2, 8), 0.2, 3); }).join('');
  return `<path d="${c.poly([...L, ...R.reverse()])}" fill="${col}" opacity=".3"/><path d="${d}" fill="${col}"/><path d="${fl}" fill="${C.terracotta}"/>`;
}

/* ====================================================================== the crew in the boat */
/** where each of the seven stands in the boat (local x; the boat is mirrored so +x is its prow, on screen left) */
export const CREW = [
  { k: 'peter', x: 150 }, { k: 'john', x: 96 }, { k: 'james', x: 42 }, { k: 'nathanael', x: -12 }, { k: 'thomas', x: -66 }, { k: 'other1', x: -118 }, { k: 'other2', x: -168 },
];
/**
 * The boat with the seven in it. Returns { el, crew[{k, x, i, p, sad, tear}], lantern{glow, flame}, set({x, y, s, r, flip}) }.
 * `extra` markup goes between the crew and the front of the hull (e.g. a folded mantle).
 */
export function crewBoat(S, L, { peterBare = true, lantern = true, extra = '', skip = [] } = {}) {
  const c = S.c;
  const slots = CREW.map((m, i) => {
    if (skip.includes(m.k)) return '';
    const look = SEVEN.find((s) => s.k === m.k);
    const o = m.k === 'peter' && peterBare ? PETER_BARE : look.o;
    return `<g data-k="crew${i}">${withFace3(person(c, o), faceBits3(c))}</g>`;
  }).join('');
  // the crew show only above the gunwale: no feet or hems below the hull or past its slanting ends
  const el = L.add(`<g>${fishingBoat(c, clipAbove(S, slots + extra, -50, { x0: -700, x1: 700, y0: -900 }), { lantern })}</g>`);
  const crew = CREW.map((m, i) => {
    if (skip.includes(m.k)) return { ...m, i, p: null };
    const g = S.$('crew' + i).firstElementChild;
    return { ...m, i, p: S.puppet(g), sad: g.querySelector('[data-part="sad"]'), tear: g.querySelector('[data-part="tear"]'), seed: c.rr(0, 9) };
  });
  const lan = el.querySelector('.lantern');
  return {
    el, crew,
    lantern: lan ? { glow: lan.querySelector('.glow'), flame: lan.querySelector('.flame') } : null,
    set({ x, y, s = 1, r = 0, flip = true, o = 1 }) { pose(el, { x, y, s, sx: flip ? -1 : 1, r, o }); },
    /** screen position of a crew member's feet, for a boat set at (x, y, s, flip) */
    at(k, B) { const m = CREW.find((q) => q.k === k); return [B.x + (B.flip === false ? 1 : -1) * m.x * B.s, B.y]; },
  };
}

/* ====================================================================== the near shore at dawn */
export const SHORE = { jx: 720, jy: 752, bx: 1070, by: 604, bs: 0.72 };
/** the near beach at dawn (front, left), sloping into the water on the right; returns { L, fn } */
export function frontShore(S, { par = 0.62, sh = 5, pad = 0, col = mix(C.sand, C.stone, 0.25) } = {}) {
  const c = S.c;
  const w = c.wave(706, [5, 2], [500, 150]);
  const fn = (x) => (x < 860 ? w(x) : w(x) + (x - 860) * (x - 860) * 0.012);
  const L = S.layer({ par, sh, pad });
  const s = sheet().p(c.ridge(fn, -1400, 1180, 1800, 10, 1), col);
  let peb = '';
  for (let i = 0; i < 60; i++) { const x = c.rr(-700, 1000); const y0 = fn(x); peb += c.cut(c.blob(x, y0 + c.rr(20, 300), c.rr(4, 10), c.rr(2.5, 5), 7, 0.2), 0.2, 3); }
  s.x(peb, C.stone2, 'opacity=".75"');
  L.add(s.out());
  L.add(`<path d="${c.ribbon(Array.from({ length: 34 }, (_, i) => { const x = -1400 + i * 76; return [x, fn(x) + 1]; }).filter(([x]) => x < 1180), 4.4)}" fill="${C.foam}" opacity=".9"/>`);
  L.add(rock(c, 250, fn(250) + 40, 120, 44, C.rock2) + reeds(c, 330, fn(330) + 10, 8, 80) + grass(c, { x0: -700, x1: 520, y: 0, fn: (x) => fn(x) + 4, n: 20, h: 14, color: C.olive }));
  return { L, fn };
}
/** a band of soft morning mist (origin centre; ~ w wide) */
export function mistBand(c, w = 900, h = 60, col = '#f7efe6') {
  let d = '';
  for (let i = 0; i < 7; i++) d += c.cut(c.blob(-w / 2 + (i + 0.5) * (w / 7), c.rr(-h * 0.2, h * 0.2), w / 7 * 0.8, h * c.rr(0.3, 0.5), 12, 0.15), 0.8, 8);
  return `<path d="${d}" fill="${col}" opacity=".3"/><path d="${d}" fill="${col}" opacity=".2" transform="translate(${w * 0.04} ${-h * 0.18}) scale(.8 .7)"/>`;
}

/* ====================================================================== the dawn set (J 21,4–8) */
/**
 * The lake at dawn from the near shore: the boat out on the water (crew in it), the near beach in front with Jesus
 * standing on it (with a soft glow), morning mist. Returns handles:
 * { K, boatL, B, wF, FS, jL, jesus, jGlow, mistL, fx, idle(t, T, o) }.
 */
export function dawnSet(S, { skyCols = DAWN, sunY = 420, boatOpts = {}, jesusOpts = {}, mist = true, burst = false } = {}) {
  const c = S.c;
  const K = shoreSet(S, { skyCols, sunAt: [1250, sunY], cloudAt: [560, 150], beach: false });
  const boatL = S.layer({ par: 0.5, sh: 5 });
  const B = crewBoat(S, boatL, boatOpts);
  const wF = S.layer({ par: 0.7, sh: 4, pad: 300 });
  wF.add(waveStrip(c, { y: 780, len: 240, amp: 12, color: mix(C.lake2, C.lake3, 0.4), x0: -1400, x1: 3000 }));
  const FS = frontShore(S, {});
  const jL = S.layer({ par: 0.62, sh: 5 });
  const burstEl = burst ? jL.add(`<g>${rayBurst1(c, { n: 18, r0: 60, r1: 330, spread: 0.03, o: 0.35 })}</g>`) : null;
  const jGlow = jL.add(`<circle r="170" fill="url(#halo-glow)"/>`);
  const jesus = S.puppet(jL.add(person(c, { ...JESUS, ...jesusOpts })));
  let mistL = null;
  if (mist) {
    mistL = S.layer({ par: 0.66, sh: 0, flat: true, pad: 500 });
    mistL.add(`<g transform="translate(640 690)">${mistBand(c, 700, 70)}</g><g transform="translate(760 600)">${mistBand(c, 520, 50)}</g><g transform="translate(560 520)">${mistBand(c, 380, 44)}</g>`);
  }
  const fx = S.layer({ par: 0.56, sh: 3 });
  return { K, boatL, B, wF, FS, jL, jGlow, jesus, mistL, fx, burst: burstEl };
}
/** wrap markup in a clip that keeps only what lies above local y = yCut (for things half under water) */
export function clipAbove(S, markup, yCut, { x0 = -600, x1 = 600, y0 = -800 } = {}) {
  const id = S.id('ca' + Math.round(S.c.rr(0, 1e6)));
  S.defs(`<clipPath id="${id}"><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${yCut - y0}"/></clipPath>`);
  return `<g clip-path="url(#${id})">${markup}</g>`;
}

/* ====================================================================== the breakfast beach (J 21,9–23) */
export const FIRE = { x: 800, y: 726 };
export const JFIRE = { x: 700, y: 694 };        // Jesus beside the fire
/**
 * The beach in the morning: the lake behind, the boat drawn up on the sand (right), the charcoal fire in front
 * with fish laid on the coals and bread beside it. Returns { K, boatL, fireL, glow, tongues, hot, coalsFish,
 * loaves, smoke, idle(T, heat) } — heat 0…1 scales the flames.
 */
export function beachSet(S, { skyCols = SUNRISE, sunY = 300, sunX = 1250, boat = true, fishOn = true, deferFire = false } = {}) {
  const c = S.c;
  const K = shoreSet(S, { skyCols, sunAt: [sunX, sunY], cloudAt: [520, 150], beachFn: c.wave(640, [4, 2], [600, 170]) });
  const boatL = S.layer({ par: 0.42, sh: 4 });
  if (boat) boatL.add(`<g transform="translate(1330 690) rotate(-4) scale(-.84 .84)">${fishingBoat(c, `<g transform="translate(60 -46)">${foldedMantle(c, C.clay)}</g>`, { lantern: true })}</g>`);
  const R = { K, boatL, idle() {} };
  R.makeFire = () => Object.assign(R, fireParts(S, fishOn));
  if (!deferFire) R.makeFire();
  return R;
}
function fireParts(S, fishOn) {
  const c = S.c;
  const fireL = S.layer({ par: 0.6, sh: 3 });
  const F = coalFire(c, 120);
  const glow = fireL.add(`<g>${F.glow}</g>`);
  fireL.add(`<g transform="translate(${FIRE.x} ${FIRE.y})">${F.base}</g>`);
  const hot = fireL.add(`<g transform="translate(${FIRE.x} ${FIRE.y})">${F.hot}</g>`);
  const tongues = [];
  F.flames.split('</g>').filter((m) => m.trim()).forEach((m) => tongues.push(fireL.add(m + '</g>')));
  const coalsFish = fishOn ? fireL.add(`<g>${onTheCoals(c)}</g>`) : null;
  const loaves = fireL.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 34, 10, 10, 0.2), 0.4, 4), C.rock2).out()}<g transform="translate(-12 -10)">${flatLoaf(c, 15)}</g><g transform="translate(14 -12)">${flatLoaf(c, 13)}</g><g transform="translate(2 -22)">${flatLoaf(c, 12)}</g></g>`);
  const smoke = [0, 1, 2].map(() => fireL.add(`<g>${steamCurl(c, 70)}</g>`));
  const tx = tongues.map((el) => { const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(el.getAttribute('transform')); return [+m[1], +m[2]]; });
  return {
    fireL, glow, tongues, hot, coalsFish, loaves, smoke,
    idle(T, heat = 1, { fishO = 1, breadO = 1, smokeO = 1 } = {}) {
      pose(glow, { x: FIRE.x, y: FIRE.y - 20, s: 0.9 + heat * 0.2 + (T ? Math.sin(T * 3.1) * 0.03 : 0), o: 0.55 + heat * 0.35 });
      fade(hot, 0.5 + (T ? Math.sin(T * 2.3) * 0.3 : 0.2));
      tongues.forEach((el, i) => pose(el, { x: FIRE.x + tx[i][0], y: FIRE.y + tx[i][1], sx: 1, sy: heat * (0.75 + (T ? Math.sin(T * (5 + i) + i * 2) * 0.25 : 0)), o: heat > 0.02 ? 1 : 0 }));
      if (coalsFish) pose(coalsFish, { x: FIRE.x, y: FIRE.y - 6, o: fishO });
      pose(loaves, { x: FIRE.x - 120, y: FIRE.y + 18, o: breadO });
      smoke.forEach((el, i) => { const k = ((T * 0.25 + i / 3) % 1); pose(el, { x: FIRE.x - 20 + i * 20 + k * 12, y: FIRE.y - 40 - k * 90, s: 0.7 + k * 0.6, o: smokeO * (1 - k) * Math.min(1, k * 4) }); });
    },
  };
}

/** where the seven sit round the fire for breakfast (and stay for J 21,15–17) */
export const RING = {
  other2: { x: 470, y: 722, flip: false }, other1: { x: 548, y: 712, flip: false }, thomas: { x: 626, y: 704, flip: false },
  peter: { x: 930, y: 704, flip: true }, john: { x: 1004, y: 712, flip: true }, james: { x: 1078, y: 720, flip: true }, nathanael: { x: 1150, y: 728, flip: true },
};
/** phone: the ring drawn in a little, so the outermost two are not sliced by the screen edges */
export const RING_P = {
  other2: { x: 508, y: 722, flip: false }, other1: { x: 574, y: 712, flip: false }, thomas: { x: 640, y: 704, flip: false },
  peter: { x: 930, y: 704, flip: true }, john: { x: 994, y: 712, flip: true }, james: { x: 1058, y: 720, flip: true }, nathanael: { x: 1122, y: 728, flip: true },
};
export const ringFor = (S) => (S.portrait ? RING_P : RING);
export const JMID = { x: 800, y: 686 };          // Jesus behind the fire, in the middle
/** a closed door with light at its edges (upper room, J 20,19) — for a small plate; origin centre */
export function doorIcon(c, r = 30) {
  const s = sheet();
  s.x(c.poly(c.rect(-r * 0.62, -r * 0.9, r * 1.24, r * 1.7)), C.halo, 'opacity=".9"');
  s.p(c.cut(c.rect(-r * 0.55, -r * 0.84, r * 1.1, r * 1.64), 0.3, 4), C.wood2);
  s.x(c.ribbon([[0, -r * 0.8], [0, r * 0.78]], 1.4) + c.ribbon([[-r * 0.5, 0], [r * 0.5, 0]], 1.4), shade(C.wood2, -0.3), 'opacity=".6"');
  s.p(c.cut(c.rect(-r * 0.2, -r * 0.1, r * 0.4, r * 0.1), 0.1, 2), C.ink);
  return s.out();
}
/** two hands: one reaching to the other's palm, which bears a small mark (Thomas, J 20,27); origin centre */
export function handsIcon(c, r = 30) {
  const s = sheet();
  s.p(c.cut([[-r, r * 0.5], [-r * 0.2, r * 0.1], [r * 0.1, -r * 0.05], [r * 0.25, r * 0.1], [-r * 0.1, r * 0.3], [-r * 0.9, r * 0.8]], 0.3, 3), C.skin2);
  s.p(c.cut([[r, r * 0.2], [r * 0.2, -r * 0.2], [-r * 0.05, -r * 0.5], [r * 0.15, -r * 0.62], [r * 0.4, -r * 0.35], [r * 1, -r * 0.3]], 0.3, 3), C.skin);
  s.x(c.poly(c.circ(r * 0.28, -r * 0.3, r * 0.08, 6)), mix(C.terracotta, C.jesusMantle, 0.5));
  return s.out();
}

/* ====================================================================== "Do you love Me?" (J 21,15–17) */
export const JQ = { x: 716, y: 694 };            // Jesus, left of the fire
export const PQ = { x: 894, y: 700 };            // Peter, right of the fire, facing Him
export const PLATE_Q = { x: 805, y: 300 };       // the plate of the denial, hung between them
export const MARKS = [[-40, 104], [0, 112], [40, 104]];   // the three marks under the plate (relative)
/**
 * The dialogue by the fire: the beach set, the others sitting round (without Peter), Jesus and Peter standing
 * (Peter also kneeling, and holding the staff), the plate of the denial with three dark marks that can turn into
 * hearts of light, and a little flock (a lamb + sheep) that can come to Peter. Returns handles.
 */
export function lovestSet(S, { skyCols = MORNING, sunY = 200 } = {}) {
  const c = S.c;
  const BS = beachSet(S, { skyCols, sunY, deferFire: true, fishOn: false });
  const PL = S.layer({ par: 0.55, sh: 5 });
  const sitters = SEVEN.filter((m) => m.k !== 'peter').map((m, i) => ({ ...m, i, ...ringFor(S)[m.k], seed: c.rr(0, 9) }));
  sitters.sort((a, b) => a.y - b.y).forEach((m) => { m.p = S.puppet(PL.add(withFace3(person(c, { ...m.o, pose: 'sit' }), faceBits3(c)))); });
  const sheepL = S.layer({ par: 0.58, sh: 4 });
  const flock = [
    { lamb: true, wool: C.linen, from: [1500, 760], to: [960, 756] },
    { lamb: false, wool: mix(C.cream, C.wheat, 0.25), from: [1560, 740], to: [1070, 742] },
    { lamb: false, wool: C.linen, from: [60, 760], to: [600, 762] },
    { lamb: false, wool: mix(C.linen, C.stone, 0.35), from: [1600, 780], to: [1010, 790] },
    { lamb: true, wool: C.cream, from: [0, 790], to: [660, 796] },
  ].map((f, i) => ({ ...f, i, rig: sheepRig(sheepL.add(ewe(c, { lamb: f.lamb, wool: f.wool })), f.lamb) }));
  const QL = S.layer({ par: 0.6, sh: 5 });
  const jesus = S.puppet(QL.add(person(c, JESUS)));
  const pStand = S.puppet(QL.add(withFace3(person(c, PETER), faceBits3(c))));
  const pKneel = S.puppet(QL.add(withFace3(person(c, { ...PETER, pose: 'kneel' }), faceBits3(c))));
  const staffM = `<g transform="rotate(20)">${sheet().p(c.ribbon([[0, -120], [1.5, 0], [0, 70]], 5.5), C.wood2).p(c.ribbon(c.arc(-10, -120, 10, 12, 0, -PI, 8), 5), C.wood2).out()}</g>`;
  const pStaff = S.puppet(QL.add(withFace3(person(c, { ...PETER, holdF: staffM }), faceBits3(c))));
  const face = (p) => ({ sad: p.el.querySelector('[data-part="sad"]'), tear: p.el.querySelector('[data-part="tear"]') });
  BS.makeFire();
  const hangL = S.layer({ par: 0.5, sh: 4 });
  const plate = hangL.add(hungPlate1(c, denialPlate(c, 78), { r: 78, face: DENIAL_FACE, rim: C.stone2 }));
  const dawnPlate = hangL.add(hungPlate1(c, `<circle r="70" fill="url(#warm-glow)"/>${dawnDisc1(c, 62)}`, { r: 78, face: mix(C.dawn, C.peach, 0.4) }));
  const marks = MARKS.map(() => hangL.add(`<g>${darkMark(c)}</g>`));
  const hearts = MARKS.map(() => hangL.add(`<g>${lightHeart1(c, 16)}</g>`));
  const fx = S.layer({ par: 0.62, sh: 3 });
  return { BS, K: BS.K, PL, sitters, flock, jesus, pStand, pKneel, pStaff, face, plate, dawnPlate, marks, hearts, fx };
}
