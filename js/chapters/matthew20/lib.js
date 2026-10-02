// Matthew 20 — the cast and cut-outs of this chapter. The parable of the labourers is played on one painted set,
// the same in every scene (its own scissors, so it is cut identically): the householder's house and the village
// market on the left, the walled vineyard with its gate and watchtower on the right, and a sun that hangs on its
// string and travels across the sky hour by hour, a paper slip under it naming the hour. The labourers come in
// groups (dawn, the third, sixth, ninth and eleventh hour) and keep their looks from scene to scene.
// The road to Jerusalem, the thrones of light, the cup, the ruler's board, the basin and towel, Jericho and the
// beggar's things are Mark 10's cut-outs, so the parallel chapters look the same.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, clamp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, sun as sunCut, cloud, olive, cypress, house, bush, rock, grass, palm } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { withFace as withFace3, faceBits as faceBits3 } from '../mark3/lib.js';
import { LOOK as L12, tenant, vineStock, grapeBunch, stoneWall, towerParts, gatePost, hoe, basketCut, purse, denarius } from '../mark12/lib.js';

export {
  roadSet, jericho, shadeTree, TWELVE, say, slip, bang, qmark, lightThrone, chalice, highSeat, crown, helmet, priestHat, thornCrown, whip,
  basinBowl, towel, ewer, beggarBowl, cloakSpread, cloakFly, withBits, face, walledCity, voiceRings, headAt, withFace, faceBits, heart, sparkle,
  nameTag, shadowPerson, pharisee, man, addToHead, spark, coin, coinStack, cup, kf, moving, handAt, thought, speech, DAY as ROAD_DAY,
} from '../mark10/lib.js';
export { vineStock, grapeBunch, stoneWall, gatePost, hoe, basketCut, purse, denarius, tenant };
export { balance, glory } from '../mark8/lib.js';
export { discPlate } from '../matthew13/lib.js';
export { heartGlow, stick } from '../matthew9/lib.js';
export { hangAt, mob } from '../matthew8/lib.js';
export { pose3 } from '../matthew4/lib.js';
export { rays } from '../../assets/things.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const INK = '#3b2a22';

/* ================================================================== the cast */
export const OWNER = L12.owner;                 // the householder (Mark 12's owner of the vineyard)
export const STEWARD = { robe: C.wheatRobe, mantle: C.dustyBlue, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather };
/** the labourers hired at dawn: strong, sunburnt men with hoes */
export const FIRST = [
  tenant(0), tenant(1), tenant(2),
  { robe: C.dustyBlue, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin4, belt: C.rope },
  { robe: mix(C.clay, C.wheatRobe, 0.4), hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, beard: 'short', skin: C.skin3, belt: C.leather },
];
/** hired at the third hour */
export const THIRD = [
  { robe: C.sageRobe, hair: C.hair, hairStyle: 'curly', beard: 'short', skin: C.skin2, belt: C.rope },
  { robe: C.tealRobe, hair: C.hair3, hairStyle: 'short', beard: 'none', skin: C.skin, belt: C.leather },
  { robe: C.ochreRobe, hair: C.hair2, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin3 },
];
/** hired at the sixth and the ninth hour */
export const MIDDAY = [
  { robe: C.mauve, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin4, belt: C.rope },
  { robe: C.wheatRobe, hair: C.greyHair, hairStyle: 'short', beard: 'short', skin: C.skin2 },
  { robe: C.roseRobe, hair: C.hair, hairStyle: 'curly', beard: 'none', skin: C.skin3, belt: C.leather },
  { robe: C.stone, hair: C.hair2, hairStyle: 'wrap', veil: C.ochreRobe, beard: 'short', skin: C.skin, belt: C.rope },
];
/** the last, hired at the eleventh hour: poor, patched, one old and grey */
export const LAST = [
  { robe: mix(C.stone2, C.rock2, 0.5), hair: C.greyHair, hairStyle: 'wrap', veil: C.stone2, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.rope },
  { robe: mix(C.sageRobe, C.rock2, 0.4), hair: C.hair3, hairStyle: 'short', beard: 'none', skin: C.skin4 },
  { robe: mix(C.dustyBlue, C.rock2, 0.45), hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin2, belt: C.rope },
];
/** the mother of the sons of Zebedee */
export const MOTHER = { robe: C.plumRobe, mantle: C.clayMantle, hairStyle: 'veil', veil: C.linen2, veil2: shade(C.linen2, -0.12), hair: C.greyHair, skin: C.skin2 };
/** the two blind men at Jericho: Mark's Bartimaeus and his companion */
export const BLIND2 = [
  { robe: mix(C.wheatRobe, C.clay, 0.35), mantle: C.tealRobe, belt: C.rope, skin: C.skin3, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, veil2: C.stone2, beard: 'full' },
  { robe: C.dustyBlue, mantle: C.clayMantle, belt: C.rope, skin: C.skin2, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair },
];

/* ================================================================== skies & hours */
export const SKY = {
  dawn: ['#b3a4c4', '#efc4ad', '#f7dcc0'],
  morning: ['#c9dfda', '#efe6cd', '#f6e8cf'],
  noon: ['#b9d6db', '#e5ecd8', '#f4efd6'],
  afternoon: ['#c6d6cc', '#f0e0bc', '#f6e2bd'],
  late: ['#c7ae9f', '#efc696', '#f5d6a8'],
  evening: ['#8f6d8a', '#e59a7a', '#f4c890'],
  dusk: ['#5b547d', '#b77f86', '#e2a482'],
};
/** where the sun hangs at hour h (0 = sunrise, 12 = sunset); it rises on the left and sets on the right */
export function sunPos(h) {
  const u = clamp(h / 12, -0.05, 1.05);
  return [lerp(430, 1180, u), 452 - Math.sin(PI * clamp(u, 0, 1)) * 285];
}
/** sunPos for a phone in portrait: the same arc squeezed into the screen's width (x 540–1050) */
export function sunPosPortrait(h) {
  const u = clamp(h / 12, -0.05, 1.05);
  // after sunset it sinks behind the hills (on a phone the set point is on screen, not past the edge)
  return [lerp(540, 1050, u), 452 - Math.sin(PI * clamp(u, 0, 1)) * 285 + Math.max(0, u - 1) * 4000];
}
const HOUR_NAMES = {
  dawn: () => tr('wczesny ranek', 'early morning'),
  3: () => tr('godzina trzecia', 'the third hour'),
  6: () => tr('godzina szósta', 'the sixth hour'),
  9: () => tr('godzina dziewiąta', 'the ninth hour'),
  11: () => tr('godzina jedenasta', 'the eleventh hour'),
  eve: () => tr('wieczór', 'evening'),
};

/* ================================================================== the painted set of the parable */
export const VW = { G: 690, IN: 690, GATE0: 902, GATE1: 968, WALL: 716, DOOR: 416, DOORY: 632, TABLE: 772, Q: 736 };
/**
 * vineWorld(S, o): sky (and a second sky to cross-fade into), the hanging sun and hour slips, far hills with
 * terraced vineyards, the village (the householder's house on the left, the market houses), the market square with
 * its well, and inside the vineyard wall the tower and two rows of vines.
 * Add people in layers after it, then call .front() for the vineyard's front wall and gate and the foreground.
 * o: { sky, sky2, tags: ['dawn', 3, …], grapes: 0..1 (ripe grapes shown) }
 */
export function vineWorld(S, o = {}) {
  const c = makeCutter('mt20-vineyard-set');
  const sk = sky(S, o.sky || SKY.morning);
  const sk2L = o.sky2 ? sky(S, o.sky2, { name: 'sky2' }).layer : null;
  if (sk2L) sk2L.fade(0);
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const sunEl = hanging(hangL, `<circle r="120" fill="url(#warm-glow)" opacity=".55"/>${sunCut(c, 40)}`, { x: 800, y: -1500, len: 900 });
  const cls = [[610, 150, 170], [1010, 120, 130]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));

  const far = S.layer({ par: 0.1, sh: 2 });
  const fb = band(c, { y: 440, amps: [18, 8, 3], lens: [1100, 380, 130], color: C.hillFar });
  far.add(fb.markup);
  // terraced vineyards on the far slopes
  let ter = '';
  for (let r = 0; r < 4; r++) for (let x = 1060 + r * 20; x < 1700; x += c.rr(14, 20)) ter += c.cut(c.blob(x, fb.fn(x) + 16 + r * 12, 5, 3.4, 7, 0.2), 0.3, 3);
  for (let r = 0; r < 3; r++) for (let x = -200 + r * 20; x < 420; x += c.rr(14, 20)) ter += c.cut(c.blob(x, fb.fn(x) + 18 + r * 12, 5, 3.4, 7, 0.2), 0.3, 3);
  far.add(sheet().p(ter, mix(C.hillMid, C.moss, 0.35)).out());

  const mid = S.layer({ par: 0.2, sh: 3 });
  const mh = hillsWith(c, { y: 512, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 });
  mid.add(mh.markup + olive(c, 1500, mh.fn(1500) + 12, 0.7) + cypress(c, 1180, mh.fn(1180) + 8, 96) + cypress(c, 1214, mh.fn(1214) + 8, 76));

  // the hour slips hang in front of the hills
  const tagL = S.layer({ par: 0.12, sh: 4 });
  const tags = {};
  (o.tags || []).forEach((k) => { tags[k] = hanging(tagL, slipTag(c, HOUR_NAMES[k]()), { x: 800, y: -1500, len: 900 }); });

  // the village: the market houses behind the square, the householder's house on the left
  const townL = S.layer({ par: 0.3, sh: 3 });
  townL.add(house(c, 572, 606, 92, 70, { wall: mix(C.plaster, C.sand, 0.3) }) + house(c, 690, 598, 78, 60, { wall: C.plaster2, stairs: false }) + house(c, 790, 604, 70, 56, { wall: mix(C.plaster, C.clay, 0.12) }));
  // an awning over a market stall
  const aw = sheet();
  aw.p(c.cut(c.rect(598, 560, 6, 70), 0.3, 4) + c.cut(c.rect(716, 560, 6, 70), 0.3, 4), C.wood2);
  const stripes = [];
  for (let i = 0; i < 6; i++) stripes.push([590 + i * 23, 552]);
  aw.p(c.cut([[586, 548], [728, 546], [736, 574], [580, 576]], 0.5, 6), C.linen2);
  aw.p(stripes.map(([x, y]) => c.cut([[x, y - 2], [x + 11, y - 2], [x + 12, y + 24], [x + 1, y + 24]], 0.2, 4)).join(''), C.terracotta);
  aw.p(c.cut([[606, 628], [712, 628], [708, 604], [610, 604]], 0.4, 5), C.wood3);
  aw.p(c.cut(c.blob(628, 600, 12, 8, 9, 0.2), 0.3, 4) + c.cut(c.blob(684, 600, 12, 8, 9, 0.2), 0.3, 4), C.basket);
  aw.p(c.cut(c.circ(630, 594, 5, 8), 0.2, 3) + c.cut(c.circ(625, 596, 4.4, 8), 0.2, 3) + c.cut(c.circ(688, 594, 5, 8), 0.2, 3), C.apricot);
  townL.add(aw.out());

  // the ground: the square, the road to the gate, the vineyard's soil
  const groundL = S.layer({ par: 0.36, sh: 3 });
  const gfn = c.wave(606, [4, 2], [700, 170]);
  const g = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sage2, 0.35));
  // paving of the square
  let flags = '';
  for (let r = 0; r < 5; r++) for (let x = 360 + (r % 2) * 22; x < 880 - r * 6; x += c.rr(40, 56)) flags += c.cut(c.blob(x, 640 + r * 26, c.rr(16, 22), c.rr(7, 10), 8, 0.12), 0.4, 4);
  g.x(flags, shade(mix(C.sand, C.stone2, 0.5), -0.06), 'opacity=".55"');
  // the vineyard's dark soil, furrowed
  g.p(c.cut([[960, 612], [2500, 604], [2500, 712], [960, 712]], 1, 12), mix(C.soil, C.sand2, 0.55));
  let fur = '';
  for (let i = 0; i < 3; i++) fur += c.ribbon([[980, 640 + i * 26], [2500, 636 + i * 26]], 3);
  g.x(fur, shade(mix(C.soil, C.sand2, 0.55), -0.18), 'opacity=".5"');
  groundL.add(g.out());
  groundL.add(grass(c, { x0: -600, x1: 380, y: 606, fn: gfn, n: 12, h: 14, color: C.olive }));
  // the householder's house (standing on the ground, nearer than the market houses)
  const homeL = S.layer({ par: 0.38, sh: 4 });
  homeL.add(house(c, VW.DOOR - 58, VW.DOORY, 200, 160, { wall: mix(C.plaster, C.sand, 0.15), door: C.soilDark }));

  // inside the wall: the back wall, the tower, two rows of vines with their grapes
  const vineL = S.layer({ par: 0.4, sh: 4 });
  let bw = '';
  for (let x = 980; x < 2100; x += 130) bw += `<g transform="translate(${x} 612)">${stoneWall(c, 132, 30)}</g>`;
  vineL.add(`<g>${bw}</g>`);
  vineL.add(`<g transform="translate(1300 616)">${towerParts(c, 80, 210).join('')}</g>`);
  let rows = '';
  const bunches = [];
  [[626, 0.84], [654, 0.94]].forEach(([y, s], r) => {
    for (let x = 1000 + r * 36; x < 1800; x += 72) {
      rows += `<g transform="translate(${x} ${y}) scale(${s})">${vineStock(c, 96)}</g>`;
      if (r === 1 || x % 144 < 72) bunches.push([x + c.rr(-18, 14) * s, y - 62 * s, s]);
    }
  });
  vineL.add(`<g>${rows}</g>`);
  const ripe = vineL.add(`<g>${bunches.map(([x, y, s]) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})">${grapeBunch(c, 4)}</g>`).join('')}</g>`);

  // the well in the square (with a stone rim to lean on)
  const wellL = S.layer({ par: 0.45, sh: 4 });
  const w = sheet();
  w.p(c.cut(c.rect(608, 632, 6, -96), 0.3, 4) + c.cut(c.rect(686, 632, 6, -96), 0.3, 4), C.wood2);
  w.p(c.cut([[600, 540], [700, 538], [700, 548], [600, 550]], 0.3, 5), C.wood);
  w.p(c.cut(c.circ(650, 552, 8, 10), 0.2, 3), C.wood3);
  w.x(c.ribbon([[650, 552], [650, 612]], 1.4), C.rope);
  w.p(c.cut([[638, 612], [662, 612], [660, 632], [640, 632]], 0.3, 4), C.pot);
  w.p(c.cut([[590, 700], [590, 640], [710, 638], [710, 700]], 0.6, 7), mix(C.stone, C.rock, 0.4));
  w.p(c.cut(c.ell(650, 640, 62, 9, 20), 0.4, 5), shade(mix(C.stone, C.rock, 0.4), 0.12));
  w.p(c.cut(c.ell(650, 641, 50, 5, 18), 0.3, 4), C.soilDark);
  let st = '';
  for (let r = 0; r < 3; r++) for (let x = 596 + (r % 2) * 12; x < 704; x += c.rr(20, 28)) st += c.cut(c.blob(x + 8, 656 + r * 15, c.rr(8, 11), c.rr(4, 6), 7, 0.2), 0.3, 3);
  w.x(st, shade(mix(C.stone, C.rock, 0.4), -0.2), 'opacity=".6"');
  wellL.add(w.out());
  // the householder's door (a leaf that can swing open)
  const doorEl = homeL.add(`<g>${sheet().p(c.cut([[0, 2], [0, -67], ...c.arc(18, -67, 18, 18, PI, 2 * PI, 8), [36, 2]], 0.3, 4), shade(C.wood2, 0.1)).x(c.ribbon([[5, -54], [31, -54]], 1.8) + c.ribbon([[5, -18], [31, -18]], 1.8), shade(C.wood2, -0.2)).out()}</g>`);

  return {
    c, sk, sk2L, hangL, sunEl, tags, cls, ripe, doorEl, groundL, vineL, wellL,
    /** the vineyard's front wall and gate, bushes in front */
    front({ fg = true } = {}) {
      const fr = S.layer({ par: 0.55, sh: 5 });
      let fw = '';
      for (let x = VW.GATE1 + 12; x < 2200; x += 132) fw += `<g transform="translate(${x} ${VW.WALL})">${stoneWall(c, 134, 46)}</g>`;
      fr.add(`<g>${fw}</g>`);
      fr.add(`<g transform="translate(${VW.GATE0} ${VW.WALL})">${gatePost(c, 150)}</g>`);
      fr.add(`<g transform="translate(${VW.GATE1} ${VW.WALL})">${gatePost(c, 156)}</g>`);
      fr.add(sheet().p(c.cut([[VW.GATE0 - 20, VW.WALL - 162], [VW.GATE1 + 22, VW.WALL - 170], [VW.GATE1 + 20, VW.WALL - 156], [VW.GATE0 - 18, VW.WALL - 150]], 0.4, 6), C.wood2).out());
      // a vine trained over the gate
      let lv = '', lv2 = '';
      for (let i = 0; i < 9; i++) { const x = VW.GATE0 - 10 + i * 10 + c.rr(-4, 4), y = VW.WALL - 170 + c.rr(-12, 6); const l = c.cut(c.star(x, y, c.rr(10, 13), c.rr(6, 8), 5, c.rr(0, 6)), 0.4, 3); if (i % 2) lv += l; else lv2 += l; }
      fr.add(sheet().p(lv2, C.moss).p(lv, C.leaf).out());
      let fgL = null;
      if (fg) {
        fgL = S.layer({ par: 0.9, sh: 6 });
        fgL.add(bush(c, 150, 1010, 230, C.sage, C.moss) + rock(c, 1470, 1000, 220, 70, C.rock2) + bush(c, 1580, 990, 180, C.olive));
      }
      return { fr, fgL };
    },
    /** place the sun at hour h; show the slip of hour `tag` (o: 0..1) */
    update(t, time, { h = 3, tag = null, tagO = 1, drift = 1 } = {}) {
      // phone: the sun travels a narrower arc and its slip stays clear of the edges and the progress thread
      const [sx, sy] = S.portrait ? sunPosPortrait(h) : sunPos(h);
      swing(sunEl, sx, sy, time, 0.8, 0.6);
      Object.entries(tags).forEach(([k, el]) => {
        const on = String(k) === String(tag) ? tagO : 0;
        const tx = S.portrait ? clamp(sx, 580, 1000) : clamp(sx, 520, 1070), ty = clamp(sy + 80, 170, 318);
        pose(el, { x: tx, y: ty - (1 - on) * 60, r: Math.sin(time * 0.9 + 1) * 1.5, oy: 0, o: on });
      });
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i * 2) * 24 * drift + t * 4, cl.y, time, 1.2, 0.7, cl.i));
    },
  };
}
/** a paper slip with the hour (hangs on its own string); origin: top */
function slipTag(c, text, { size = 20 } = {}) {
  const ww = text.length * size * 0.46 + size * 1.4, hh = size * 1.55;
  const s = sheet().p(c.cut([[-ww / 2, 0], [ww / 2, -1.5], [ww / 2 + 1.5, hh], [-ww / 2 - 1, hh + 1]], 0.5, 6), C.cream);
  s.p(c.cut(c.circ(0, 7, 3, 8), 0.1, 2), shade(C.ochre, -0.2));
  return `${s.out()}<text x="0" y="${(hh * 0.5 + size * 0.42).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
}

/* ================================================================== people helpers */
/** a labourer puppet (with brows that frown or grieve) holding a tool: 'hoe' | 'basket' | '' */
export function worker(c, o, tool = '') {
  const hold = tool === 'hoe' ? { holdF: hoe(c) } : tool === 'basket' ? { holdB: `<g transform="translate(-2 -12)">${basketCut(c, { full: true })}</g>` } : {};
  return withFace3(person(c, { ...o, ...hold }), faceBits3(c));
}
/** a man of the crowd (never veiled) */
export function manOf(c, extra = {}) { const o = crowdPerson(c); if (o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); } return { ...o, ...extra }; }

/* ================================================================== money */
/** a small silver denarius (held in a hand, dropped on a table); origin centre */
export function silver(c, r = 8) {
  const col = mix(C.stone, C.cream, 0.2);
  return `<circle r="${r * 2.4}" fill="url(#halo-glow)" opacity=".55"/>` + sheet().p(c.cut(c.circ(0, 0, r, 16), 0.2, 3), shade(col, -0.05)).p(c.cut(c.circ(0, 0, r * 0.72, 14), 0.2, 3), col)
    .x(c.poly([[-r * 0.3, r * 0.45], [-r * 0.36, -r * 0.1], [-r * 0.12, -r * 0.45], [r * 0.22, -r * 0.4], [r * 0.38, -r * 0.05], [r * 0.2, r * 0.45]]), shade(col, -0.25), 'opacity=".7"').out();
}
/** a row of silver coins stacked (what they hoped for); origin: bottom centre */
export function silverStack(c, n = 6, r = 10) {
  const col = mix(C.stone2, C.rock2, 0.3);
  const s = sheet();
  let d = '', e = '';
  for (let i = 0; i < n; i++) { const y = -i * 4.6, x = c.rr(-1.4, 1.4); d += c.cut([[x - r, y], [x - r, y - 4.4], [x + r, y - 4.4], [x + r, y]], 0.2, 4); e += c.ribbon([[x - r + 1, y - 2.2], [x + r - 1, y - 2.2]], 0.8); }
  s.p(d, shade(col, -0.08)).x(e, shade(col, -0.35), 'opacity=".6"');
  s.p(c.cut(c.ell(0, -n * 4.6 - 1, r, 2.8, 12), 0.2, 3), shade(col, 0.2));
  return s.out();
}
/** the steward's pay table: a board on trestles with a cloth, a money bag and the ledger; origin: floor centre */
export function payTable(c, w = 150) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 + 10, -52, 10, 52), 0.3, 4) + c.cut(c.rect(w / 2 - 20, -52, 10, 52), 0.3, 4), C.wood2);
  s.p(c.cut([[-w / 2, -60], [w / 2, -62], [w / 2, -50], [-w / 2, -48]], 0.4, 6), C.wood);
  s.p(c.cut([[-w / 2 + 4, -62], [w * 0.1, -63], [w * 0.14, -36], [-w / 2 + 10, -34]], 0.5, 5), C.linen2);
  s.p(c.cut([[w * 0.06, -62], [w * 0.4, -64], [w * 0.38, -70], [w * 0.08, -68]], 0.3, 4), C.parchment);
  s.x(c.ribbon([[w * 0.1, -66], [w * 0.34, -67]], 1), C.ink, 'opacity=".5"');
  return s.out() + `<g transform="translate(${-w * 0.26} -62)">${purse(c, { full: true })}</g>`;
}

/* ================================================================== pictures */
/** the evil eye: an almond eye on a plate, with a lid that can droop (.lid) and a dark squinting brow (.brow); origin centre */
export function evilEye(c, r = 56) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 12, 36), 0.4, 5), mix(C.storm2, C.soilDark, 0.35));
  const almond = [...c.arc(0, r * 0.62, r * 1.02, r * 1.02, PI * 1.21, PI * 1.79, 12), ...c.arc(0, -r * 0.62, r * 1.02, r * 1.02, PI * 0.21, PI * 0.79, 12)];
  s.p(c.cut(almond, 0.3, 4), C.linen);
  s.p(c.cut(c.circ(0, 0, r * 0.36, 20), 0.2, 3), mix(C.moss2, C.storm2, 0.5));
  s.x(c.poly(c.circ(0, 0, r * 0.16, 12)), C.ink);
  s.x(c.poly(c.circ(-r * 0.1, -r * 0.1, r * 0.06, 6)), '#fff');
  const lid = sheet().p(c.cut([...c.arc(0, r * 0.62, r * 1.04, r * 1.04, PI * 1.2, PI * 1.8, 12), [r * 0.62, -r * 0.05], [-r * 0.62, -r * 0.05]], 0.3, 4), mix(C.skin3, C.storm2, 0.25)).out();
  const brow = sheet().p(c.ribbon([[-r * 0.8, -r * 0.62], [0, -r * 0.4], [r * 0.8, -r * 0.5]], r * 0.14), INK).out();
  return `${s.out()}<g class="lid">${lid}</g><g class="brow">${brow}</g>`;
}
/** a length of chain (links alternately side-on and face-on); origin: left end, running +x */
export function chain(c, len = 60, col = mix(C.rock3, C.storm, 0.3)) {
  let d = '';
  for (let x = 0, i = 0; x < len; x += 9, i++) d += i % 2 ? c.ribbon([[x - 2, 0], [x + 9, 0]], 3) : c.ribbon(c.arc(x + 4, 0, 6.5, 4.4, 0, PI * 2, 12), 2.2);
  return `<path d="${d}" fill="${col}"/>`;
}
/** a heavy yoke laid across bowed shoulders (for the ruler's board); origin centre */
export function yoke(c, w = 90) {
  return sheet().p(c.cut([[-w / 2, -6], [-w * 0.2, -10], [w * 0.2, -10], [w / 2, -6], [w / 2, 5], [-w / 2, 5]], 0.4, 5), C.wood2).out();
}
/** a great low sun (a disc that fills with light) for the shadow play on the horizon; origin centre */
export function bigSun(S, r = 230) {
  const id = S.id('bigsun');
  S.defs(`<radialGradient id="${id}"><stop offset="0" stop-color="#fff4d0"/><stop offset=".55" stop-color="#fbd98f"/><stop offset=".82" stop-color="#f2b56c"/><stop offset="1" stop-color="#f2b56c" stop-opacity="0"/></radialGradient>`);
  return `<circle r="${r * 1.8}" fill="url(#warm-glow)" opacity=".7"/><circle r="${r}" fill="url(#${id})"/>`;
}
/** a small cross on a hill in silhouette; origin: foot of the hill */
export function hillCross(c, col = INK) {
  return `<path d="${c.cut([[-150, 0], [-80, -26], [0, -38], [80, -26], [150, 0]], 0.6, 6)}" fill="${col}"/><path d="${c.poly([[-3.5, -38], [-3.5, -150], [3.5, -150], [3.5, -38]]) + c.poly([[-30, -124], [30, -124], [30, -117], [-30, -117]])}" fill="${col}"/>`;
}
/** a spear, upright; origin: grip */
export function spear(c, col = INK) { return `<path d="${c.ribbon([[0, 60], [0, -150]], 3)}" fill="${col}"/><path d="${c.poly([[-6, -146], [0, -170], [6, -146]])}" fill="${col}"/>`; }
/** a reed held like a sceptre (mockery); origin: grip */
export function reed(c, col = INK) { return `<path d="${c.ribbon(c.qbez([0, 30], [4, -40], [10, -110], 8), 2.4)}" fill="${col}"/><path d="${c.cut(c.ell(11, -118, 4, 12, 10, 0.1), 0.2, 3)}" fill="${col}"/>`; }

export { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, clamp, sky, hanging, swing, band, hillsWith, sunCut, cloud, olive, cypress, house, bush, rock, grass, palm, makeCutter };

/** is a keyframed [x, y] point changing around t? (drives the walk cycle) */
export function movingXY(t, keys, fn, eps = 0.3) {
  const a = kfXY(t - 0.012, keys, fn), b = kfXY(t + 0.012, keys, fn);
  return Math.hypot(a[0] - b[0], a[1] - b[1]) > eps * 0.024;
}
function kfXY(t, keys, fn = (u) => u) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [a, va] = keys[i - 1], [b, vb] = keys[i]; const u = fn(b > a ? (t - a) / (b - a) : 1); return [va[0] + (vb[0] - va[0]) * u, va[1] + (vb[1] - va[1]) * u]; }
  return keys[keys.length - 1][1];
}
export { kfXY };

/* ================================================================== the labourers' places in the vineyard */
export const SLOTS = {
  first: [[1030, 690], [1096, 686], [1162, 690], [1228, 686], [1294, 690]],
  third: [[1062, 668], [1130, 666], [1198, 668]],
  midday: [[1266, 668], [1334, 666], [1362, 690], [1424, 688]],
  last: [[992, 704], [1040, 706], [1088, 704]],
};
export const S_IN = { 690: 0.86, 686: 0.86, 704: 0.9, 706: 0.9 };
/** a labourer at work among the vines (still: arms and heads posed once) */
export function workPose(i, k = 1) {
  return { flip: i % 2 === 1, lean: (8 + (i % 3) * 3) * k, armF: 20 + (40 + (i % 4) * 8) * k, armB: (i % 3 === 1 ? 50 : 10) * k, head: (10 + (i % 2) * 4) * k };
}
/** the labourers already at work: returns [{ p, x, y, s, i }] placed at their slots (call .set yourself) */
export function crew(S, L, c, groups) {
  const specs = [];
  groups.forEach((g) => {
    const looks = g === 'first' ? FIRST : g === 'third' ? THIRD : g === 'midday' ? MIDDAY : LAST;
    looks.forEach((o, i) => { const [x, y] = SLOTS[g][i]; specs.push({ g, i, wi: { first: 0, third: 5, midday: 8, last: 12 }[g] + i, o, x, y, s: y > 680 ? 0.86 : 0.8, tool: g === 'first' ? (i === 1 || i === 3 ? 'basket' : 'hoe') : i % 2 ? 'basket' : '' }); });
  });
  specs.sort((a, b) => a.y - b.y);
  return specs.map((m, k) => { const el = L.add(worker(c, m.o, m.tool)); return { ...m, k, el, p: S.puppet(el), seed: c.rr(0, 9) }; });
}

/* ================================================================== evening: the pay line */
/** the order they are paid in: the last first … the first last */
export const QUEUE = [
  ...LAST.map((o, i) => ({ g: 'last', i, o })),
  ...[3, 2, 1, 0].map((i) => ({ g: 'midday', i, o: MIDDAY[i] })),
  ...[2, 1, 0].map((i) => ({ g: 'third', i, o: THIRD[i] })),
  ...FIRST.map((o, i) => ({ g: 'first', i, o })),
];
export const PAY = { STEW: 716, TABLE: 766, Q0: 874, DQ: 50, QY: 744, OWN: 640 };
/** where the paid men of the last hour stand, in front on the left */
export const PAID = [[446, 714], [508, 718], [570, 714]];
export const qSpot = (k) => [PAY.Q0 + k * PAY.DQ, PAY.QY + (k % 2) * 6];

/* ================================================================== the rulers of the nations (a picture board) */
import { LOOK as L10, highSeat as highSeat10, crown as crown10, addToHead as addToHead10 } from '../mark10/lib.js';
/** a rod held by the ruler's great men; origin: grip */
function rod(c) { return `<path d="${c.ribbon([[0, 30], [0, -70]], 4)}" fill="${C.wood2}"/>`; }
/**
 * rulerBoard(S, L, c): a framed board let down on a string: a crowned king on a high stepped seat, his great men with
 * rods, and people bowed under yokes. Returns { el, fold, king, bowed[], guards[] } (puppets posed via .set).
 */
export function rulerBoard(S, L, c, { BW = 420, BH = 240 } = {}) {
  const board = sheet().p(c.cut(c.rect(-BW / 2, 0, BW, BH), 0.6, 8), C.wood2).p(c.cut(c.rect(-BW / 2 + 10, 10, BW - 20, BH - 20), 0.5, 8), mix(C.parchment, C.dune, 0.4)).out();
  const k = 0.44;
  const kingM = addToHead10(person(c, { ...L10.king, pose: 'sit' }), crown10(c));
  const bowedM = () => person(c, { ...crowdPerson(c), pose: 'kneel' });
  const guardM = () => person(c, { robe: mix(C.storm, C.clay, 0.3), mantle: C.terracotta, belt: C.leather, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, holdF: rod(c) });
  const el = hanging(L, `<g class="fold">${board}
    <g transform="translate(0 ${BH - 14}) scale(.5)">${highSeat10(c, 150)}</g>
    <g transform="translate(-2 ${BH - 14 - 104}) scale(${k})"><g class="king">${kingM}</g></g>
    ${[-165, -120, 112, 157].map((x, i) => `<g transform="translate(${x} ${BH - 14}) scale(${k * 0.9}) ${x > 0 ? 'scale(-1 1)' : ''}"><g class="bow" data-i="${i}">${bowedM()}</g><g transform="translate(-6 -120) rotate(-18)">${yoke(c, 70)}</g></g>`).join('')}
    ${[-72, 66].map((x) => `<g transform="translate(${x} ${BH - 14}) scale(${k}) ${x > 0 ? 'scale(-1 1)' : ''}"><g class="guard">${guardM()}</g></g>`).join('')}
  </g>`, { x: 800, y: -1500, len: 900 });
  return {
    el, fold: el.querySelector('.fold'),
    king: S.puppet(el.querySelector('.king .fig')),
    bowed: Array.from(el.querySelectorAll('.bow .fig')).map((e) => S.puppet(e)),
    guards: Array.from(el.querySelectorAll('.guard .fig')).map((e) => S.puppet(e)),
  };
}

/* ================================================================== Jericho */
import { roadSet as roadSet10, jericho as jericho10, beggarBowl as bowl10, cloakSpread as cloak10 } from '../mark10/lib.js';
export const JR = { G: 684, CITY: 250, B: [[950, 704], [1022, 712]] };
/** the road out of Jericho towards Jerusalem (Mark 10's Jericho), with the blind men's cloaks and bowl by the road */
export function jerichoSet(S) {
  const c = S.c;
  const R = roadSet10(S, { skyCols: ['#d3e0d8', '#f1e4c6', '#f7e3c2'], road: false, jer: 0.85, jerX: 1330, farY: 400, hillY: 470, groundY: 570, trees: 10, treeCol: C.olive, hillCol: mix(C.hillMid, C.dune, 0.35), groundCol: mix(C.sand, C.dune, 0.3), sunAt: [1260, 150], clouds: [[560, 130, 170], [1040, 100, 120]] });
  const road = [];
  for (let i = 0; i <= 26; i++) { const x = -700 + i * 120; road.push([x, 700 - Math.max(0, x - 900) * 0.12]); }
  R.groundL.add(sheet().p(c.ribbon(road, 96), mix(C.sand2, C.dune, 0.15)).out());
  const cityL = S.layer({ par: 0.32, sh: 3 });
  cityL.add(`<g transform="translate(${JR.CITY} 600)">${jericho10(c, 1.5)}</g>`);
  cityL.add(palm(c, 560, 620, 200) + palm(c, 640, 624, 170) + palm(c, 1480, 620, 190));
  const matL = S.layer({ par: 0.5, sh: 4 });
  const mats = JR.B.map(([x, y], i) => matL.add(`<g transform="translate(${x + 6} ${y + 2}) scale(.72)">${cloak10(c, i ? C.clayMantle : C.tealRobe)}</g>`));
  matL.add(`<g transform="translate(${JR.B[0][0] - 58} ${JR.B[0][1] + 4})">${bowl10(c)}</g>`);
  return { R, cityL, matL, mats };
}
