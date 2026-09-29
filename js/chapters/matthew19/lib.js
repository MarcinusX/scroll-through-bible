// Matthew 19 — beyond the Jordan, on the road up to Jerusalem. Most of the set and cast is Mark 10's, so the
// same road, the same Pharisees, the same rich young man and his cart, the same paper dolls, rings, needle and
// camel appear in both Gospels. Here, our own pieces: the little "any reason" plates (a burnt loaf, a cracked
// jug, a spilled cup), the Genesis scroll, the three painted panels of Mt 19,12 (a cradle, a king's door-keeper,
// a lamp before the gate of the Kingdom), a lily, the twelve banners of the tribes, picture cards for Mt 19,29,
// and a sprite crowd.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, hanging, swing, sky } from '../kit.js';
import { house, band, hillsWith, sun as sunCut, cloud, grass } from '../../assets/nature.js';
import { oilLamp } from '../../assets/things.js';
import { tr, LANG } from '../../core/i18n.js';
import { pose3 } from '../matthew4/lib.js';
import { doll, walledCity, DAY } from '../mark10/lib.js';

export {
  DAY, LOOK, child, shadeTree, say, bang, qmark, slip, doll, scissors, snip, ring, lightKnot, tablet, lawTablets, tick,
  sack, cart, treasureStar, bigNeedle, lightThrone, face, frown, TWELVE, pharisee, heart, stoneHeart, withFace, faceBits, headAt,
  handAt, spark, sparkle, coin, camel, walkCamel, scrollParts, footprint, thought, wordSlip, beggarBowl, FONT, DY, kf, nameTag, walledCity,
} from '../mark10/lib.js';
export { sickOnMat } from '../mark6/lib.js';
export { throneOfLight } from '../john12/lib.js';
export { pose3, tr, LANG };

export const PI = Math.PI;
const FONT_ = 'EB Garamond, Georgia, serif';


/* ================================================================== the road (Mark 10's, with a second sky) */
/**
 * roadSet(S, o): Mark 10's road set — sky, hanging sun and clouds, far hills with Jerusalem (jer 0…1 = how near),
 * near hills and the ground with a road. sky2: a second sky, cross-faded on the compositor via sk2.layer.fade().
 * Returns { sk, sk2, hangL, farL, hillL, groundL, gy(x), update(t, time, { sunY }) }.
 */
export function roadSet(S, o = {}) {
  const c = S.c;
  const {
    skyCols = DAY, sky2 = null, jer = 0.3, jerX = 1130, farY = 430, hillY = 500, groundY = 575, hillCol = C.hillMid, farCol = C.hillFar,
    groundCol = mix(C.sand, C.sage2, 0.4), sunAt = [1235, 150], sunR = 40, clouds = [[470, 130, 190], [1010, 210, 140]],
    trees = 16, treeCol = C.sage, roadX = 760, roadCol = mix(C.sand2, C.dune, 0.25), road = true,
  } = o;
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2' }) : null;
  if (sk2) sk2.layer.fade(0);
  const behind = o.behind ? o.behind(S) : null;
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const sunEl = hanging(hangL, sunCut(c, sunR), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cls = clouds.map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 600 }), x, y, i }));
  const farL = S.layer({ par: 0.1, sh: 2 });
  const far = band(c, { y: farY, amps: [20, 8, 3], lens: [1000, 360, 130], color: farCol });
  const sc = 0.22 + jer * 0.55, jy = far.fn(jerX) + 10;
  farL.add(`<g><circle cx="${jerX}" cy="${jy - 60 * sc}" r="${150 * sc + 30}" fill="url(#halo-glow)" opacity="${0.35 + jer * 0.3}"/>${walledCity(c, jerX, jy, sc)}</g>`);
  farL.add(far.markup);
  const hillL = S.layer({ par: 0.2, sh: 3 });
  hillL.add(hillsWith(c, { y: hillY, amps: [16, 7, 3], lens: [900, 300, 110], color: hillCol, trees, treeColor: treeCol, treeH: 22 }).markup);
  const groundL = S.layer({ par: 0.35, sh: 3 });
  const gfn = c.wave(groundY, [6, 3], [700, 170]);
  const g = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), groundCol);
  const rp = [];
  for (let i = 0; i <= 18; i++) { const u = i / 18; rp.push([roadX + Math.sin(u * 4.2 + 0.6) * 140 * (1 - u) + (1 - u) * 60, 1700 + (gfn(roadX) + 4 - 1700) * Math.pow(u, 0.7)]); }
  if (road) g.p(c.ribbon(rp, (u) => 330 * (1 - u) + 24), roadCol);
  let stones = '';
  for (let i = 0; i < 40; i++) { const x = c.rr(-600, 2200), y = c.rr(gfn(x) + 30, 1100); stones += c.cut(c.blob(x, y, c.rr(4, 11), c.rr(2, 5), 7, 0.2), 0.3, 3); }
  g.x(stones, shade(groundCol, -0.14), 'opacity=".6"');
  groundL.add(g.out());
  groundL.add(grass(c, { x0: -500, x1: 2100, y: groundY, fn: gfn, n: 34, h: 14, color: C.olive }));
  return {
    sk, sk2, behind, hangL, farL, hillL, groundL, gy: gfn, sunEl, cls,
    update(t, time, { sunY = 0, drift = 1 } = {}) {
      swing(sunEl, sunAt[0], sunAt[1] + sunY, time, 1.1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i * 2) * 26 * drift + t * 6, cl.y, time, 1.4, 0.7, cl.i));
    },
  };
}

/* ================================================================== people */
/** a man / woman of the crowd (men are never veiled) */
export function folk(c, isMan = null, extra = {}) {
  const o = crowdPerson(c);
  const m = isMan === null ? o.hairStyle !== 'veil' : isMan;
  if (m && o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); }
  if (!m) { o.hairStyle = 'veil'; o.beard = 'none'; }
  return { ...o, ...extra };
}
/**
 * a still crowd as one cut-out (for L.sprite): n people in `rows` rows, feet around (0, 0).
 * face: 1 = all face right, -1 = all face left, 0 = face the centre (x = 0)
 */
export function throng(c, n, { s = 0.62, spread = 40, rows = 2, face = 1, arms = [0, 30], armB = [0, 10], head = [-6, 3], P = 'stand', kids = 0 } = {}) {
  const per = Math.ceil(n / rows);
  const ms = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / per), k = i % per;
    const x = (k - (per - 1) / 2) * spread + (r % 2) * spread * 0.5 + c.rr(-6, 6);
    const kid = i < kids;
    ms.push({
      x, y: r * 16 + c.rr(-3, 3), s: s * (kid ? 0.62 : c.rr(0.92, 1.05)) * (1 + r * 0.06), flip: face === 0 ? x > 0 : face < 0,
      head: c.rr(head[0], head[1]), armF: c.rr(arms[0], arms[1]), armB: c.rr(armB[0], armB[1]), o: kid ? { ...folk(c), beard: 'none', pose: P } : { ...folk(c), pose: P },
    });
  }
  return pose3(c, ms);
}

/* ================================================================== "for any reason" */
/** a round paper plate with a little picture on it; origin: its centre */
export function plate(c, inner, { r = 40, rim = C.ochre, face = C.cream } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r, 30), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r - 6, 30), 0.4, 5), face).out();
  return `${s}${inner}`;
}
/** a loaf burnt black in the oven, with a wisp of smoke */
export function burntLoaf(c) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 4, 24, 13, 14, 0.12), 0.6, 5), mix(C.soilDark, C.ink, 0.4));
  s.x(c.ribbon([[-12, 0], [-4, -4]], 2) + c.ribbon([[2, -2], [12, 2]], 2), C.soil, 'opacity=".8"');
  s.x(c.ribbon(c.cbez([4, -10], [12, -18], [-2, -24], [6, -32], 10), 2.6), C.rock2, 'opacity=".75"');
  return s.out();
}
/** a clay jug with a crack down its side */
export function crackedJug(c) {
  const s = sheet();
  s.p(c.cut([[-12, 18], [-17, 4], [-14, -8], [-6, -14], [-6, -22], [6, -22], [6, -14], [14, -8], [17, 4], [12, 18]], 0.5, 5), C.pot);
  s.p(c.ribbon(c.qbez([12, -12], [26, -6], [15, 6], 6), 3.4), shade(C.pot, -0.12));
  s.x(c.ribbon([[-2, -14], [2, -6], [-3, 2], [3, 10], [0, 17]], 1.8), C.soilDark);
  return s.out();
}
/** a cup tipped over, its wine spilling */
export function spilledCup(c) {
  const s = sheet();
  s.p(c.cut(c.blob(4, 22, 22, 6, 10, 0.2), 0.5, 4), mix(C.plumRobe, C.terracotta, 0.35));
  s.p(c.cut([[-22, -6], [0, -18], [6, -10], [-16, 4]], 0.4, 4), C.sun);
  s.p(c.cut([[-2, -14], [8, -4], [10, -6], [0, -16]], 0.3, 3) + c.ribbon([[4, -10], [12, 2]], 3), C.sun);
  s.x(c.cut(c.ell(3, -12, 3, 6, 8, 0.8), 0.2, 3), mix(C.plumRobe, C.terracotta, 0.35));
  return s.out();
}

/* ================================================================== the beginning */
/** a sunrise disc over a tiny garden with the first man and woman hand in hand (for "from the beginning"); origin centre */
export function beginningDisc(c, r = 62) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 8, 36), 0.5, 5), C.haloRim);
  s.p(c.cut(c.circ(0, 0, r, 36), 0.4, 5), mix(C.dawn, C.halo, 0.4));
  s.p(c.cut([...c.arc(0, r * 0.2, r * 0.36, r * 0.36, PI, 2 * PI, 12)], 0.3, 4), C.sun);
  // green ground cut to the circle
  const g = [];
  for (let a = 0.18; a <= PI - 0.18; a += 0.12) g.push([Math.cos(a) * r, Math.sin(a) * r]);
  g.push([-Math.cos(0.18) * r, r * 0.2]);
  s.p(c.cut([[r * 0.98, r * 0.2], ...g, [-r * 0.98, r * 0.2]], 0.4, 5), C.hillNear);
  const dm = `<g transform="translate(-12 ${r * 0.62}) scale(.5)">${doll(c, C.dustyBlue)}</g><g transform="translate(12 ${r * 0.62}) scale(.5)">${doll(c, C.roseRobe, { woman: true, skin: C.skin })}</g>`;
  return `<circle r="${r * 1.9}" fill="url(#halo-glow)" opacity=".7"/>${s.out()}${dm}<path d="${c.ribbon([[-4, r * 0.3], [4, r * 0.3]], 3)}" fill="${C.sun}"/>`;
}

/* ================================================================== Mt 19,12 — three painted panels */
/** a painted flat (a card with a frame) with a picture inside and a caption strip; origin: top centre.
 *  inner is drawn with (0,0) at the bottom centre of the picture area */
export function panel(c, inner, { w = 200, h = 176, face = C.parchment, frame = C.cream, ground = null, word = '', size = 16 } = {}) {
  const s = sheet();
  const ph = word ? h - 34 : h - 8;
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.6, 8), frame);
  s.p(c.cut(c.rect(-w / 2 + 8, 8, w - 16, ph - 8), 0.4, 8), face);
  if (ground) s.p(c.cut([[-w / 2 + 8, ph - 34], [w / 2 - 8, ph - 40], [w / 2 - 8, ph], [-w / 2 + 8, ph]], 0.4, 6), ground);
  const lbl = word ? `<text x="0" y="${h - 13}" text-anchor="middle" font-family="${FONT_}" font-size="${size}" font-style="italic" fill="${C.ink}">${word}</text>` : '';
  return `${s.out()}<g transform="translate(0 ${ph - 6})">${inner}</g>${lbl}`;
}
/** a wooden cradle with a swaddled baby, a star above; origin: floor centre */
export function cradle(c) {
  const s = sheet();
  s.p(c.cut([[-46, -12], [46, -12], [38, -46], [-38, -46]], 0.5, 6), C.wood3);
  s.p(c.ribbon(c.arc(0, -4, 44, 16, 0.1, PI - 0.1, 10), 6), C.wood2);
  s.p(c.cut(c.blob(4, -50, 30, 11, 12, 0.1), 0.5, 5), C.linen);
  s.x(c.ribbon([[-10, -54], [-8, -44]], 1.6) + c.ribbon([[6, -56], [8, -44]], 1.6), shade(C.linen, -0.18));
  s.p(c.cut(c.circ(-28, -54, 10, 14), 0.3, 4), C.skin);
  s.p(c.cut([...c.arc(-28, -55, 11, 11, PI * 0.95, PI * 1.9, 8), [-20, -58]], 0.3, 3), C.hair2);
  s.x(c.ribbon(c.arc(-25, -54, 2.2, 1.4, 0.2, PI - 0.2, 4), 1) + c.ribbon(c.arc(-31, -54, 2.2, 1.4, 0.2, PI - 0.2, 4), 1), C.inkSoft);
  s.p(c.cut(c.star(0, -118, 12, 5, 5, 0), 0.2, 3), C.sun);
  return `<circle cy="-118" r="30" fill="url(#halo-glow)"/>${s.out()}`;
}
/** a palace door (a king's hall) with a crown over it; origin: threshold centre */
export function palaceDoor(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-70, -124, 140, 124), 0.5, 7), mix(C.stone, C.dune, 0.2));
  s.p(c.cut([[-34, 0], [-34, -80], ...c.arc(0, -80, 34, 30, PI, 2 * PI, 12), [34, 0]], 0.4, 6), C.plumRobe);
  s.p(c.cut([[-26, 0], [-26, -78], ...c.arc(0, -78, 26, 22, PI, 2 * PI, 10), [26, 0]], 0.3, 5), shade(C.plumRobe, -0.3));
  s.p(c.cut(c.rect(-60, -124, 14, 124), 0.3, 5) + c.cut(c.rect(46, -124, 14, 124), 0.3, 5), C.stone);
  s.p(c.cut([[-78, -124], [78, -124], [70, -136], [-70, -136]], 0.3, 5), C.ochre);
  s.p(c.cut([[-15, -140], [15, -140], [16, -150], [10, -158], [6, -150], [0, -162], [-6, -150], [-10, -158], [-16, -150]], 0.3, 3), C.sun);
  return s.out();
}
/** the king's door-keeper: a court servant with a ring of keys (a person look) */
export const KEEPER = { robe: C.indigo, mantle: C.ochreRobe, belt: C.sun, skin: C.skin4, hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: C.stone2, beard: 'none' };
/** a ring of keys, held in the hand (arm coords) */
export function keys(c) {
  const s = sheet();
  s.p(c.ribbon(c.arc(0, 8, 8, 8, 0, PI * 2, 14), 2.4), C.sun);
  s.p(c.ribbon([[4, 14], [8, 36]], 3) + c.ribbon([[6, 30], [12, 30]], 2.6) + c.ribbon([[-4, 14], [-9, 32]], 3) + c.ribbon([[-8, 28], [-14, 28]], 2.6), C.sun);
  return s.out();
}
/** a lily: long stem, a few leaves and three white blooms; origin: base */
export function lily(c, h = 110) {
  const s = sheet();
  s.p(c.ribbon(c.qbez([0, 0], [6, -h * 0.5], [0, -h], 10), 3), C.moss);
  s.p(c.cut([[0, -h * 0.3], [-20, -h * 0.5], [-6, -h * 0.4]], 0.3, 3) + c.cut([[1, -h * 0.5], [22, -h * 0.7], [7, -h * 0.58]], 0.3, 3) + c.cut([[0, -h * 0.12], [16, -h * 0.28], [5, -h * 0.2]], 0.3, 3), C.leaf);
  const bloom = (x, y, r, a) => c.cut([[x, y], ...[0, 1, 2, 3, 4].flatMap((i) => { const b = a - 0.9 + i * 0.45; return [[x + Math.cos(b) * r, y + Math.sin(b) * r], [x + Math.cos(b + 0.22) * r * 0.45, y + Math.sin(b + 0.22) * r * 0.45]]; })], 0.3, 3);
  s.p(bloom(0, -h, 20, -PI / 2) + bloom(-10, -h * 0.78, 15, -PI * 0.8) + bloom(10, -h * 0.84, 14, -PI * 0.2), C.linen);
  s.x(c.poly(c.circ(0, -h - 4, 2.6, 6)) + c.poly(c.circ(-12, -h * 0.8, 2, 6)), C.sun);
  return s.out();
}
/** the gate of the Kingdom: an arch of light; origin: threshold centre */
export function kingdomGate(c, w = 60, h = 118) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 12, 2], [-w / 2 - 12, -h], ...c.arc(0, -h, w / 2 + 12, 30, PI, 2 * PI, 12), [w / 2 + 12, 2]], 0.5, 6), C.sun);
  s.x(c.cut([[-w / 2, 2], [-w / 2, -h + 4], ...c.arc(0, -h + 4, w / 2, 20, PI, 2 * PI, 12), [w / 2, 2]], 0.3, 5), '#fff6d6');
  return `<circle cy="${-h * 0.55}" r="${h * 1.15}" fill="url(#halo-glow)"/>${s.out()}`;
}
/** an oil lamp with a warm glow (for the one keeping watch before the Kingdom); origin: base */
export function glowLamp(c, sc = 0.8) {
  return `<circle cy="-14" r="34" fill="url(#warm-glow)"/><g transform="scale(${sc})">${oilLamp(c)}</g>`;
}

/* ================================================================== the twelve tribes */
const TRIBE_COL = [C.terracotta, C.dustyBlue, C.sun, C.moss, C.plumRobe, C.tealRobe, C.ochre, C.roseRobe, C.indigo, C.sageRobe, C.clayMantle, C.lavender];
/** a tribe's banner on a pole with a simple emblem; origin: foot of the pole */
export function banner(c, i, h = 150) {
  const col = TRIBE_COL[i % 12];
  const s = sheet();
  s.p(c.ribbon([[0, 0], [0, -h]], 4), C.wood2);
  s.p(c.cut(c.circ(0, -h - 4, 5, 8), 0.2, 2), C.sun);
  s.p(c.cut([[2, -h + 4], [52, -h + 8], [44, -h + 30], [52, -h + 52], [2, -h + 50]], 0.5, 5), col);
  const ex = 24, ey = -h + 29, ink = shade(col, 0.55);
  const em = [
    c.star(ex, ey, 11, 5, 5, 0), c.circ(ex, ey, 9, 12), c.star(ex, ey, 10, 4, 6, 0), [[ex - 10, ey + 8], [ex, ey - 10], [ex + 10, ey + 8]],
    c.ell(ex, ey, 11, 6, 12), [[ex - 9, ey - 9], [ex + 9, ey - 9], [ex + 9, ey + 9], [ex - 9, ey + 9]], c.star(ex, ey, 11, 7, 4, 0.4), [[ex, ey - 11], [ex + 9, ey], [ex, ey + 11], [ex - 9, ey]],
    c.arc(ex, ey + 4, 11, 11, PI, 2 * PI, 10), c.star(ex, ey, 10, 3, 8, 0), [[ex - 11, ey + 6], [ex + 11, ey + 6], [ex, ey - 10]], c.blob(ex, ey, 10, 8, 10, 0.2),
  ][i % 12];
  s.x(c.cut(em, 0.2, 3), ink);
  return s.out();
}

/* ================================================================== Mt 19,29 — picture cards */
/** a small picture card; origin top-centre */
export function card(c, icon, w = 80, h = 80) {
  const s = sheet().p(c.cut(c.rect(-w / 2, 0, w, h), 0.5, 6), C.cream).p(c.cut(c.rect(-w / 2 + 5, 5, w - 10, h - 10), 0.3, 6), C.parchment).out();
  return `${s}<g transform="translate(0 ${h * 0.84})">${icon}</g>`;
}
/** a patch of field: furrows and wheat; origin: bottom centre */
export function field(c, w = 56) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 + 8, -26], [w / 2 - 8, -26], [w / 2, 0]], 0.4, 5), C.wheat);
  let f = '';
  for (let i = 0; i < 5; i++) f += c.ribbon([[-w / 2 + 4 + i * 2, -4 - i * 5], [w / 2 - 4 - i * 2, -4 - i * 5]], 1.4);
  s.x(f, C.wheat2, 'opacity=".8"');
  return s.out();
}
/** the icons of Mt 19,29 in order (the WEB also names "wife"); each drawn at the bottom centre of a card */
export function leftIcons(c) {
  const d = (col, o = {}) => doll(c, col, o);
  const list = [
    [tr('dom', 'houses'), `<g transform="translate(-20 0)">${house(c, 0, 0, 40, 32, { stairs: false })}</g>`],
    [tr('bracia', 'brothers'), `<g transform="translate(-12 0) scale(.6)">${d(C.dustyBlue)}</g><g transform="translate(12 0) scale(.6)">${d(C.sageRobe)}</g>`],
    [tr('siostry', 'sisters'), `<g transform="translate(-12 0) scale(.6)">${d(C.roseRobe, { woman: true, skin: C.skin })}</g><g transform="translate(12 0) scale(.6)">${d(C.lavender, { woman: true })}</g>`],
    [tr('ojciec', 'father'), `<g transform="scale(.7)">${d(C.tealRobe, { skin: C.skin3 })}</g>`],
    [tr('matka', 'mother'), `<g transform="scale(.7)">${d(C.mauve, { woman: true, skin: C.skin3 })}</g>`],
  ];
  if (LANG === 'en') list.push(['wife', `<g transform="scale(.7)">${d(C.peach, { woman: true, skin: C.skin })}</g>`]);
  list.push(
    [tr('dzieci', 'children'), `<g transform="translate(-12 0) scale(.45)">${d(C.wheatRobe)}</g><g transform="translate(12 0) scale(.45)">${d(C.peach, { woman: true, skin: C.skin })}</g>`],
    [tr('pole', 'lands'), field(c)],
  );
  return list;
}

/* ================================================================== odds and ends */
/** Peter's memory: a sepia card of the lake, the boat, the nets and the house by the shore; origin top-centre */
export function memoryCard(c, boatMarkup) {
  const inner = sheet().p(c.cut(c.rect(-110, 0, 220, 140), 0.6, 7), C.cream).p(c.cut(c.rect(-102, 8, 204, 124), 0.4, 7), mix(C.parchment, C.dune, 0.35)).p(c.cut([[-102, 84], [102, 80], [102, 132], [-102, 132]], 0.4, 7), mix(C.lake, C.parchment, 0.45)).out();
  let net = '';
  for (let i = 0; i < 6; i++) net += c.ribbon([[-90 + i * 8, 40], [-96 + i * 10, 82]], 1);
  for (let j = 0; j < 4; j++) net += c.ribbon([[-92, 48 + j * 10], [-44, 46 + j * 10]], 1);
  return `${inner}<g transform="translate(-10 104) scale(.34)">${boatMarkup}</g><g transform="translate(40 80)">${house(c, 26, 0, 40, 30, { stairs: false })}</g><path d="${c.ribbon([[-94, 36], [-40, 36]], 2)}" fill="${C.wood2}"/><path d="${net}" fill="${C.rope}" opacity=".85"/>`;
}
/** a word-plate hung on a string: text on a torn cream slip; origin: its centre */
export function word(c, text, { size = 22, fill = C.cream, ink = C.ink, w } = {}) {
  const ww = w || text.length * size * 0.5 + size * 1.4;
  const hh = size * 1.55;
  return `${sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill).out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT_}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** hang + pose helper: a hanging element dropped in from the flies by k (0 up, 1 down) */
export function drop(el, x, y, k, time = 0, seed = 0, amp = 1.2) {
  swing(el, x, y - (1 - k) * 1100, time, amp, 0.7, seed);
}
export { pose, hanging, swing, person, CAST, sheet, shade, mix, C };
