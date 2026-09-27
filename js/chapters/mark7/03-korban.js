// Mk 7,10–13 — Jesus' example, played out as a little illustrated set that flies in:
// Moses' tablets say "honour your father and your mother"; a son brings bread to his old parents.
// Then the tradition: a tag "Korban — given to God" on his basket, the basket locked in the Temple
// chest, a rope drawn between the son and his parents. Rule-scrolls cover the word of God.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, bush, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { hand, headAt, pharisee, LOOK, tablets, ruleScroll, nameTag, bubble, heart, loaf, bowl, candle, shadowPerson, marketBasket, hang2, spark } from './lib.js';

const PI = Math.PI;
const FLOOR = 690;
const TAB = { x: 800, y: 132 };          // tablets hang here (their string top)
const CHEST = { x: 1046, y: FLOOR - 58 }; // the Temple gift-chest (on its plinth)
const PAR = 0.6;

export default {
  id: 'm7-korban',
  enter: 'fly',
  beats: [
    { v: 10, text: 'Mojżesz tak powiedział: Czcij ojca swego i matkę swoją,' },
    { v: 10, cont: true, text: 'oraz: Kto złorzeczy ojcu lub matce, niech śmiercią zginie.' },
    { v: 11 },
    { v: 12 },
    { v: 13, text: 'I znosicie słowo Boże przez waszą tradycję, którąście sobie przekazali.' },
    { v: 13, cont: true, text: 'Wiele też innych tym podobnych rzeczy czynicie».' },
  ],
  cam: { x: [-40, 40], y: [-60, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const SKY = ['#e9dcc8', '#f3e6cc', '#f8eed9'];
    const DARK = ['#b8adb8', '#d9cbbd', '#ece0cb'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 38), { x: 420, y: 150, len: 700 });
    const cl = hanging(hangL, cloud(c, 150), { x: 1180, y: 190, len: 700 });

    /* ---------- a painted flat: hills, Jerusalem's walls in the distance ---------- */
    const back = S.layer({ par: 0.15, sh: 2 });
    back.add(band(c, { y: 470, amps: [16, 6, 2], lens: [1000, 360, 120], color: mix(C.hillFar, C.sand, 0.3) }).markup);
    const ground = S.layer({ par: 0.4, sh: 3 });
    ground.add(sheet().p(c.cut([[-900, 640], [2500, 640], [2500, 1700], [-900, 1700]], 1, 30), mix(C.sand, C.sand2, 0.5)).out());
    ground.add(grass(c, { x0: -600, x1: 2200, y: 642, n: 30, h: 12, color: C.olive }));

    /* ---------- the parents' home (left), cut away ---------- */
    const home = S.layer({ par: PAR, sh: 4 });
    const hs = sheet();
    hs.p(c.cut([[380, FLOOR + 4], [380, 400], [700, 400], [700, FLOOR + 4]], 0.8, 10), mix(C.plaster2, C.sand2, 0.3));
    hs.p(c.cut([[366, 400], [714, 400], [714, 386], [366, 386]], 0.6, 8), C.roof);
    hs.p(c.cut([[430, 470], [430, 440], ...c.arc(454, 440, 24, 22, PI, 2 * PI, 8), [478, 470]], 0.4, 5), '#d8e4dc');
    hs.p(c.ribbon([[426, 472], [482, 472]], 6), C.wood2);
    hs.p(c.cut(c.rect(560, 456, 110, 6), 0.3, 6), C.wood2);
    hs.p(c.cut([[574, 456], [570, 436], [580, 426], [590, 436], [586, 456]], 0.3, 4) + c.cut(c.arc(630, 456, 14, 12, PI, 2 * PI, 6), 0.3, 4), C.pot);
    hs.p(c.cut(c.rect(380, FLOOR - 8, 320, 12), 0.5, 10), mix(C.clay, C.sand2, 0.5));
    // pillars of the cut-away edge
    hs.p(c.cut(c.rect(372, 392, 16, FLOOR - 388), 0.4, 8) + c.cut(c.rect(692, 392, 16, FLOOR - 388), 0.4, 8), C.plaster);
    home.add(hs.out());
    const bench = sheet().p(c.cut(c.rect(430, FLOOR - 40, 170, 9), 0.4, 8), C.wood).p(c.cut(c.rect(440, FLOOR - 31, 8, 32), 0.3, 4) + c.cut(c.rect(582, FLOOR - 31, 8, 32), 0.3, 4), C.wood2).out();
    home.add(bench);
    const candleEl = home.add(`<g transform="translate(652 ${FLOOR - 6}) scale(.6)">${candle(c, 40)}</g>`);
    const flame = candleEl.querySelector('.flame'), cGlow = candleEl.querySelector('.glow');
    const father = S.puppet(home.add(person(c, { ...LOOK.father, pose: 'sit' })));
    const mother = S.puppet(home.add(person(c, { ...LOOK.mother, pose: 'sit', holdF: `<g transform="translate(6 4) rotate(-80)">${bowl(c, { w: 30, food: null })}</g>` })));

    /* ---------- the Temple corner (right): columns, a plinth, the gift chest ---------- */
    const tmp = S.layer({ par: PAR, sh: 4 });
    const ts = sheet();
    ts.p(c.cut(c.rect(930, 380, 32, FLOOR - 380), 0.5, 8) + c.cut(c.rect(1150, 380, 32, FLOOR - 380), 0.5, 8), C.stone);
    ts.x(c.ribbon([[940, 390], [940, FLOOR - 4]], 2) + c.ribbon([[952, 390], [952, FLOOR - 4]], 2) + c.ribbon([[1160, 390], [1160, FLOOR - 4]], 2) + c.ribbon([[1172, 390], [1172, FLOOR - 4]], 2), shade(C.stone, -0.12), 'opacity=".7"');
    ts.p(c.cut([[910, 382], [1206, 382], [1206, 360], [910, 360]], 0.5, 8), C.stone2);
    ts.p(c.cut([[900, 360], [1216, 360], [1180, 326], [936, 326]], 0.5, 8), C.cream);
    ts.p(c.cut([[900, 356], [1216, 356], [1216, 362], [900, 362]], 0.3, 8), C.sun);
    ts.p(c.cut(c.rect(976, FLOOR - 44, 140, 48), 0.5, 8), C.stone2);
    ts.x(c.ribbon([[976, FLOOR - 22], [1116, FLOOR - 22]], 1.4), shade(C.stone2, -0.2), 'opacity=".6"');
    tmp.add(ts.out());
    const chestS = sheet();
    chestS.p(c.cut(c.rect(-50, -58, 100, 58), 0.5, 7), C.wood);
    chestS.p(c.cut([[-54, -58], [54, -58], [48, -74], [-48, -74]], 0.4, 6), C.wood2);
    chestS.p(c.ribbon([[-50, -40], [50, -40]], 5) + c.ribbon([[-50, -14], [50, -14]], 5), C.sun);
    chestS.p(c.cut(c.rect(-8, -52, 16, 18), 0.3, 4), C.ochre);
    chestS.x(c.ribbon([[-14, -66], [14, -66]], 3), C.soilDark);
    tmp.add(`<g transform="translate(${CHEST.x} ${CHEST.y + 58 - 44})">${chestS.out()}</g>`);
    const PHS = [{ i: 0, x: 1128 }, { i: 1, x: 1186, back: true }, { i: 2, x: 1240, back: true }].map((m) => ({ ...m, seed: c.rr(0, 9), p: S.puppet(tmp.add(pharisee(c, m.i))) }));

    /* ---------- the son ---------- */
    const sonL = S.layer({ par: PAR, sh: 5 });
    const son = S.puppet(sonL.add(person(c, LOOK.son)));
    const basketEl = sonL.add(`<g>${marketBasket(c, 50).replace(C.lake3, C.wheat2)}</g>`);
    const gift = sonL.add(`<g>${loaf(c, 12)}</g>`);
    const shadowSon = S.puppet(sonL.add(shadowPerson(c, LOOK.son, mix(C.night2, C.soilDark, 0.4))));
    const curse = sonL.add(`<g>${jagBubble(c)}</g>`);
    // a dark little drape drops over the curse (the lowered curtain)
    const drape = sonL.add(`<g>${hang2(drapeCloth(c, 170, 250), 70, 300)}</g>`);

    /* ---------- the flies: tablets, the Korban tag, the rope, scrolls ---------- */
    const fx = S.layer({ par: PAR, sh: 6 });
    const tab = hanging(fx, `<g transform="translate(0 150)">${tablets(c, { w: 90, h: 124 })}</g>`, { x: TAB.x, y: TAB.y, len: 700 });
    const tabGlow = tab.querySelector('[data-g="iv"]');
    const covers = Array.from({ length: 12 }, (_, i) => ({ i, el: fx.add(`<g>${ruleScroll(c, [C.terracotta, C.teal2, C.ochre, C.plumRobe][i % 4], 1.25)}</g>`), to: [TAB.x + ((i % 4) - 1.5) * 44 + c.rr(-6, 6), TAB.y + 190 - Math.floor(i / 4) * 34 + c.rr(-4, 4)], r: c.rr(-40, 40) + 90 }));
    const love = fx.add(`<g>${heart(c, 14)}</g>`);
    const tag = fx.add(`<g>${nameTag(c, tr('Korban', 'Corban'), { size: 22, sub: tr('dar dla Boga', 'given to God'), subSize: 14 })}</g>`);
    const say = fx.add(`<g>${bubble(c, tr('«Korban!»', '“Corban!”'), { size: 20, tail: -1 })}</g>`);
    const ropeEl = fx.add(`<g>${ropeBarrier(c)}</g>`);
    const rain = Array.from({ length: 22 }, (_, i) => ({ i, el: fx.add(`<g>${i % 5 === 0 ? nameTag(c, tr('Korban', 'Corban'), { size: 13 }) : ruleScroll(c, [C.terracotta, C.teal2, C.ochre, C.plumRobe][i % 4], 1)}</g>`), x: c.rr(420, 1180), y1: FLOOR - c.rr(4, 30), r: c.rr(0, 360), sp: c.rr(0.8, 1.3), d: c.rr(0, 0.5) }));

    return (t, time) => {
      const T = time;
      const dim = bump(t, 1.05, 2.1) * 0.8;
      sk.blend(SKY, DARK, dim);
      swing(sunEl, 420, 150, T, 1, 0.6);
      swing(cl, 1180 + Math.sin(T * 0.1) * 20, 190, T, 1.2, 0.7, 1);

      /* the tablets hang over everything; the fourth commandment glows */
      const tabK = es(t, -0.3, 0.3, ease.out);
      const covered = es(t, 4.1, 4.9);
      swing(tab, TAB.x, TAB.y - (1 - tabK) * 1150, T, 0.7, 0.6);
      fade(tabGlow, es(t, 0.25, 0.5) * (1 - es(t, 1.0, 1.2)) + bump(t, 1.1, 1.9) * 0.6 + es(t, 2.0, 2.3) * 0.35 * (1 - covered));

      /* v10a — the son brings bread to his father and mother */
      const walkKeys = [[0.1, 860], [0.5, 690], [2.1, 690], [2.45, 900], [3.05, 900], [3.25, 930]];
      const sx = kfLin(t, walkKeys);
      const walking = (t > 0.1 && t < 0.5) || (t > 2.1 && t < 2.45) || (t > 3.05 && t < 3.25);
      const give = bump(t, 0.5, 0.95);
      const facingRight = t > 2.1;
      const blocked = es(t, 3.3, 3.6);
      // the basket on his back arm, until he sets it on the gift chest (v12)
      const [bx, by] = hand(sx, FLOOR, 0.92, !facingRight, 24 - blocked * 10);
      const onChest = es(t, 3.1, 3.3);
      pose(basketEl, { x: lerp(bx + (facingRight ? -6 : 6), CHEST.x, onChest), y: lerp(by + 34, CHEST.y - 18, onChest) - Math.sin(onChest * PI) * 30 });
      const [gx, gy] = hand(sx, FLOOR, 0.92, true, 70);
      const gk = seg(t, 0.55, 0.9);
      pose(gift, { x: lerp(gx, 590, ease.io(gk)), y: lerp(gy, FLOOR - 104, ease.io(gk)) - Math.sin(gk * PI) * 20, o: t > 0.5 && t < 2.3 ? 1 : 0 });
      const loveK = es(t, 0.8, 1.0, ease.back) * (1 - es(t, 1.05, 1.2));
      pose(love, { x: 560, y: 470 - loveK * 20, s: loveK, o: loveK > 0.02 ? 1 : 0 });
      const sad = es(t, 3.4, 3.8);
      father.set({ x: 500, y: FLOOR - 32, s: 0.86, armF: bump(t, 0.7, 1.4) * 60 + sad * 10, head: -sad * 14 + bump(t, 0.7, 1.4) * 4, blink: blinkAt(T, 1) });
      mother.set({ x: 566, y: FLOOR - 32, s: 0.86, armF: 50 + bump(t, 0.4, 1.0) * 20 + sad * 22, head: sad * 16, blink: blinkAt(T, 5) });

      /* v10b — whoever curses father or mother: a shadow, a jagged word, a lowered drape */
      const shK = es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.05));
      shadowSon.set({ x: 780, y: FLOOR, s: 0.92, flip: true, o: shK, armF: 80, armB: 40, head: -6 });
      const cK = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.6, 1.75));
      pose(curse, { x: 700, y: 440, s: cK, o: cK > 0.02 ? 1 : 0 });
      const drop_ = es(t, 1.45, 1.7, ease.out) * (1 - es(t, 1.95, 2.25, ease.in));
      pose(drape, { x: 780, y: 440 - (1 - drop_) * 1150 });
      const snuff = es(t, 1.55, 1.7) * (1 - es(t, 2.2, 2.4));
      fade(flame, 1 - snuff); fade(cGlow, 1 - snuff);
      son.set({
        x: sx, y: FLOOR, s: 0.92, flip: !facingRight, walk: walking ? sx * 0.05 : undefined, o: 1 - shK,
        armF: give * 70 + (t > 2.5 && t < 3.3 ? 30 : 0) + bump(t, 2.5, 2.95) * 50 + blocked * 70 * (1 - es(t, 3.7, 3.9)), armB: 24 - blocked * 10,
        head: blocked * 10 * (1 - es(t, 3.7, 3.9)) + es(t, 3.7, 3.9) * 14, blink: blinkAt(T, 3),
      });

      /* v11 — the Pharisee hands him a tag: "Korban — given to God" */
      PHS.forEach((m, j) => {
        const lead = j === 0;
        const offer = lead ? es(t, 2.2, 2.45) * (1 - es(t, 2.9, 3.1)) : 0;
        const stop = lead ? es(t, 3.3, 3.55) : 0;
        const pass = bump(t, 4.05 + j * 0.2, 4.6 + j * 0.2);
        m.p.set({ x: m.x - stop * 40, y: FLOOR + (m.back ? -8 : 0), s: 0.9, flip: true, armF: offer * 80 + stop * 95 + pass * 110, armB: stop * 20 + pass * 60, head: -pass * 10, blink: blinkAt(T, m.seed) });
      });
      const [tx, ty] = hand(PHS[0].x, FLOOR, 0.9, true, 80);
      const tagMove = es(t, 2.55, 2.85);
      const tagK = es(t, 2.2, 2.4);
      pose(tag, { x: lerp(tx - 6, bx + (facingRight ? -6 : 6), tagMove), y: lerp(ty - 10, by - 10, tagMove) - Math.sin(tagMove * PI) * 40, r: Math.sin(T * 2) * 4, o: tagK });
      if (t > 3.1) pose(tag, { x: lerp(bx, CHEST.x, onChest) + 30, y: lerp(by - 10, CHEST.y - 70, onChest), r: -10 + Math.sin(T * 1.5) * 3, o: 1 - es(t, 5.6, 5.9) * 0 });
      const sayK = es(t, 2.6, 2.8, ease.back) * (1 - es(t, 3.05, 3.2));
      const [hx, hy] = headAt(sx, FLOOR, 0.92, false);
      pose(say, { x: hx - 40, y: hy - 24, s: sayK, o: sayK > 0.02 ? 1 : 0 });

      /* v12 — a rope between the son and his parents */
      const ropeK = es(t, 3.35, 3.7, ease.out);
      pose(ropeEl, { x: 790, y: 470 - (1 - ropeK) * 1150 + Math.sin(T * 0.9) * 2, o: ropeK > 0.01 ? 1 : 0 });

      /* v13a — scrolls passed from hand to hand, stuck over the tablets */
      covers.forEach((cv) => {
        const k = es(t, 4.1 + cv.i * 0.055, 4.45 + cv.i * 0.055);
        const from = PHS[cv.i % 3];
        const [fx0, fy0] = headAt(from.x, FLOOR, 0.9, true);
        const x = lerp(fx0, cv.to[0], k), y = lerp(fy0 - 40, cv.to[1] - (1 - tabK) * 1150, k) - Math.sin(k * PI) * 90;
        pose(cv.el, { x, y, r: cv.r * k, o: k > 0.01 ? 1 : 0 });
      });
      pose(tab.querySelector('.obj'), { o: 1 - covered * 0.35 });

      /* v13b — many other such things: scrolls and tags flutter down everywhere */
      rain.forEach((r) => {
        const k = seg(t, 5.05 + r.d, 5.75 + r.d * 0.5);
        const y = lerp(40, r.y1, ease.out(k));
        pose(r.el, { x: r.x + Math.sin(k * 7 + r.i) * 20 * (1 - k), y, r: r.r + k * 200 * r.sp, s: 0.9, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.z = 1 + es(t, 0, 1) * 0.03 + es(t, 4.0, 4.6) * 0.03;
      S.cam.y = -es(t, 4.0, 4.6) * 50 + es(t, 5.0, 5.6) * 30;
      S.cam.x = es(t, 2.1, 2.6) * 30 * (1 - es(t, 4, 4.5));
    };
  },
};

/** linear keyframes (walking at a steady pace) */
function kfLin(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [a, va] = keys[i - 1], [b, vb] = keys[i]; return va + (vb - va) * ((t - a) / (b - a)); }
  return keys[keys.length - 1][1];
}
/** a jagged dark speech bubble (a curse); origin at its tail */
function jagBubble(c) {
  const s = sheet();
  const p = [];
  for (let i = 0; i < 22; i++) { const a = (i / 22) * PI * 2, r = i % 2 ? 0.72 : 1; p.push([Math.cos(a) * 46 * r, -44 + Math.sin(a) * 30 * r]); }
  s.p(c.cut(p, 0.4, 4), mix(C.night2, C.soilDark, 0.4));
  s.p(c.cut([[-8, -20], [20, 4], [6, -22]], 0.3, 3), mix(C.night2, C.soilDark, 0.4));
  let z = '';
  [[-26, -48], [-6, -40], [16, -50]].forEach(([x, y]) => { z += c.poly([[x - 7, y + 6], [x - 2, y - 6], [x + 2, y + 2], [x + 7, y - 8]].flatMap((q, i, a) => i < a.length - 1 ? [q] : [q])); });
  s.x(c.ribbon([[-30, -44], [-22, -54], [-14, -40], [-4, -54], [6, -40], [16, -54], [26, -42]], 3), C.terracotta);
  return s.out();
}
/** a dark drape with a fringe; origin: top centre */
function drapeCloth(c, w, h) {
  const s = sheet();
  const pts = [[-w / 2, 0], [w / 2, 0], [w / 2 - 4, h]];
  for (let x = w / 2 - 4; x > -w / 2 + 4; x -= 20) pts.push(...c.arc(x - 10, h, 10, 7, 0, PI, 4));
  s.p(c.cut(pts, 0.8, 10), mix(C.night2, C.plumRobe, 0.3));
  let f = '';
  for (let x = -w / 2 + 16; x < w / 2; x += 26) f += c.ribbon([[x, 6], [x + c.rr(-4, 4), h - 8]], 2.4);
  s.x(f, shade(mix(C.night2, C.plumRobe, 0.3), 0.18), 'opacity=".6"');
  s.p(c.ribbon([[-w / 2 - 6, 2], [w / 2 + 6, 2]], 7), C.wood2);
  return s.out();
}
/** a rope strung between two posts with a red seal in the middle; origin: centre of the rope */
function ropeBarrier(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-120, -14, 10, 240), 0.3, 6) + c.cut(c.rect(110, -14, 10, 240), 0.3, 6), C.wood2);
  s.p(c.cut(c.circ(-115, -16, 8, 10), 0.2, 3) + c.cut(c.circ(115, -16, 8, 10), 0.2, 3), C.wood3);
  s.p(c.ribbon(c.qbez([-115, -6], [0, 30], [115, -6], 18), 4), C.rope);
  s.p(c.cut(c.circ(0, 14, 16, 16), 0.4, 4), C.terracotta);
  s.p(c.cut(c.star(0, 14, 9, 4, 6), 0.2, 3), shade(C.terracotta, -0.25));
  s.p(c.cut([[-6, 28], [-12, 50], [-2, 44]], 0.3, 3) + c.cut([[6, 28], [12, 50], [2, 44]], 0.3, 3), C.terracotta);
  return s.out();
}
