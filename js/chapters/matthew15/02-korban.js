// Mt 15,4–6 — Jesus' example, played out on a little painted set that flies in (after Mark 7): the stone tablets
// hang over it, the fourth commandment glowing; a son brings bread to his old father and mother. "Whoever curses
// father or mother" — a dark shadow of him, a jagged word, a dark drape let down and a candle snuffed. "But you say":
// a Pharisee hands him a tag, "Korban — a gift to God", and the basket meant for his parents goes into the Temple
// chest; a sealed rope is drawn between the son and his parents, who are left with nothing. "So you have made void
// the commandment of God": the Pharisees pass their rule-scrolls up and paste them over the tablets.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { candle } from '../mark2/lib.js';
import {
  hand, headAt, pharisee, L7, tablets, ruleScroll, nameTag, bubble, heart, loaf, bowl, shadowPerson, marketBasket, hang2,
  jagBubble, drapeCloth, ropeBarrier, giftChest, kfLin, tr, PI,
} from './lib.js';

const FLOOR = 690;
const TAB = { x: 800, y: 132 };            // the tablets hang here (their string top)
const CHEST = { x: 1046, y: FLOOR - 58 };  // the Temple gift-chest (on its plinth)
const PAR = 0.6;

export default {
  id: 'mt15-korban',
  enter: 'fly',
  beats: [
    { v: 4, text: 'Bóg przecież powiedział: Czcij ojca i matkę' },
    { v: 4, cont: true, text: 'oraz: Kto złorzeczy ojcu lub matce, niech śmierć poniesie.' },
    { v: 5 },
    { v: 6, text: 'ten nie potrzebuje czcić swego ojca ni matki".' },
    { v: 6, cont: true, text: 'I tak ze względu na waszą tradycję znieśliście przykazanie Boże.' },
  ],
  cam: { x: [-40, 40], y: [-60, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    // phone: the set is wider than the screen — the parents' home slides right, the Temple corner left
    const P = S.portrait, HX = P ? 60 : 0, TX = P ? -112 : 0;
    sky(S, ['#e9dcc8', '#f3e6cc', '#f8eed9']);
    const dim = sky(S, ['#b8adb8', '#d9cbbd', '#ece0cb'], { name: 'dim', rise: 0 }).layer;
    dim.fade(0);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 38), { x: 1220, y: 150, len: 700 });
    const cl = hanging(hangL, cloud(c, 150), { x: 690, y: 110, len: 700 });

    /* ---------- a painted flat: soft hills, the ground ---------- */
    S.layer({ par: 0.15, sh: 2 }).add(band(c, { y: 470, amps: [16, 6, 2], lens: [1000, 360, 120], color: mix(C.hillFar, C.sand, 0.3) }).markup);
    const ground = S.layer({ par: 0.4, sh: 3 });
    ground.add(sheet().p(c.cut([[-900, 640], [2500, 640], [2500, 1700], [-900, 1700]], 1, 30), mix(C.sand, C.sand2, 0.5)).out());
    ground.add(grass(c, { x0: -600, x1: 2200, y: 642, n: 30, h: 12, color: C.olive }));

    /* ---------- the parents' home (left), cut away ---------- */
    const home = S.layer({ par: PAR, sh: 4, ...(P ? { pad: HX } : {}) });
    const hs = sheet();
    hs.p(c.cut([[380, FLOOR + 4], [380, 400], [700, 400], [700, FLOOR + 4]], 0.8, 10), mix(C.plaster2, C.sand2, 0.3));
    hs.p(c.cut([[366, 400], [714, 400], [714, 386], [366, 386]], 0.6, 8), C.roof);
    hs.p(c.cut([[430, 470], [430, 440], ...c.arc(454, 440, 24, 22, PI, 2 * PI, 8), [478, 470]], 0.4, 5), '#d8e4dc');
    hs.p(c.ribbon([[426, 472], [482, 472]], 6), C.wood2);
    hs.p(c.cut(c.rect(560, 456, 110, 6), 0.3, 6), C.wood2);
    hs.p(c.cut([[574, 456], [570, 436], [580, 426], [590, 436], [586, 456]], 0.3, 4) + c.cut(c.arc(630, 456, 14, 12, PI, 2 * PI, 6), 0.3, 4), C.pot);
    hs.p(c.cut(c.rect(380, FLOOR - 8, 320, 12), 0.5, 10), mix(C.clay, C.sand2, 0.5));
    hs.p(c.cut(c.rect(372, 392, 16, FLOOR - 388), 0.4, 8) + c.cut(c.rect(692, 392, 16, FLOOR - 388), 0.4, 8), C.plaster);
    home.add(hs.out());
    home.add(sheet().p(c.cut(c.rect(430, FLOOR - 40, 170, 9), 0.4, 8), C.wood).p(c.cut(c.rect(440, FLOOR - 31, 8, 32), 0.3, 4) + c.cut(c.rect(582, FLOOR - 31, 8, 32), 0.3, 4), C.wood2).out());
    const candleEl = home.add(`<g transform="translate(652 ${FLOOR - 6}) scale(.6)">${candle(c, 40)}</g>`);
    const flame = candleEl.querySelector('.flame'), cGlow = candleEl.querySelector('.glow');
    const father = S.puppet(home.add(person(c, { ...L7.father, pose: 'sit' })));
    const mother = S.puppet(home.add(person(c, { ...L7.mother, pose: 'sit', holdF: `<g transform="translate(6 4) rotate(-80)">${bowl(c, { w: 30, food: null })}</g>` })));

    /* ---------- the Temple corner (right): columns, a plinth, the gift chest ---------- */
    const tmp = S.layer({ par: PAR, sh: 4, ...(P ? { pad: -TX } : {}) });
    const ts = sheet();
    ts.p(c.cut(c.rect(930, 380, 32, FLOOR - 380), 0.5, 8) + c.cut(c.rect(1150, 380, 32, FLOOR - 380), 0.5, 8), C.stone);
    ts.x(c.ribbon([[940, 390], [940, FLOOR - 4]], 2) + c.ribbon([[952, 390], [952, FLOOR - 4]], 2) + c.ribbon([[1160, 390], [1160, FLOOR - 4]], 2) + c.ribbon([[1172, 390], [1172, FLOOR - 4]], 2), shade(C.stone, -0.12), 'opacity=".7"');
    ts.p(c.cut([[910, 382], [1206, 382], [1206, 360], [910, 360]], 0.5, 8), C.stone2);
    ts.p(c.cut([[900, 360], [1216, 360], [1180, 326], [936, 326]], 0.5, 8), C.cream);
    ts.p(c.cut([[900, 356], [1216, 356], [1216, 362], [900, 362]], 0.3, 8), C.sun);
    ts.p(c.cut(c.rect(976, FLOOR - 44, 140, 48), 0.5, 8), C.stone2);
    ts.x(c.ribbon([[976, FLOOR - 22], [1116, FLOOR - 22]], 1.4), shade(C.stone2, -0.2), 'opacity=".6"');
    tmp.add(ts.out());
    tmp.add(`<g transform="translate(${CHEST.x} ${CHEST.y + 14})">${giftChest(c)}</g>`);
    const PHS = [{ i: 0, x: 1128 }, { i: 1, x: P ? 1154 : 1186, back: true }, { i: 3, x: P ? 1178 : 1240, back: true }].map((m) => ({ ...m, seed: c.rr(0, 9), p: S.puppet(tmp.add(pharisee(c, m.i))) }));

    /* ---------- the son ---------- */
    const sonL = S.layer({ par: PAR, sh: 5 });
    const son = S.puppet(sonL.add(person(c, L7.son)));
    const basketEl = sonL.add(`<g>${marketBasket(c, 50).replace(C.lake3, C.wheat2)}</g>`);
    const gift = sonL.add(`<g>${loaf(c, 12)}</g>`);
    const shadowSon = S.puppet(sonL.add(shadowPerson(c, L7.son, mix(C.night2, C.soilDark, 0.4))));
    const curse = sonL.add(`<g>${jagBubble(c)}</g>`);
    const drape = sonL.add(`<g>${hang2(drapeCloth(c, 170, 250), 70, 300)}</g>`);

    /* ---------- the flies: tablets, the Korban tag, the rope, the scrolls ---------- */
    const fx = S.layer({ par: PAR, sh: 6 });
    const tab = hanging(fx, `<g transform="translate(0 150)">${tablets(c, { w: 90, h: 124 })}</g>`, { x: TAB.x, y: TAB.y, len: 700 });
    const tabGlow = tab.querySelector('[data-g="iv"]'), tabObj = tab.querySelector('.obj');
    const covers = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(`<g>${ruleScroll(c, [C.terracotta, C.teal2, C.ochre, C.plumRobe][i % 4], 1.25)}</g>`), to: [TAB.x + ((i % 4) - 1.5) * 44 + c.rr(-6, 6), TAB.y + 190 - Math.floor(i / 4) * 34 + c.rr(-4, 4)], r: c.rr(-40, 40) + 90 }));
    const love = fx.add(`<g>${heart(c, 14)}</g>`);
    const tagEl = fx.add(`<g>${nameTag(c, tr('Korban', 'Corban'), { size: 22, sub: tr('dar dla Boga', 'a gift to God'), subSize: 14 })}</g>`);
    const say = fx.add(`<g>${bubble(c, tr('«Korban!»', '“Corban!”'), { size: 20, dir: 1 })}</g>`);
    const ropeEl = fx.add(`<g>${ropeBarrier(c, P ? { half: 86 } : undefined)}</g>`);   // phone: a shorter rope
    const tears = [0, 1].map(() => fx.add(`<path d="${c.cut([[0, -8], [4, 0], [2.6, 3.4], [-2.6, 3.4], [-4, 0]], 0.1, 2)}" fill="#bfe0ee"/>`));

    return (t, time) => {
      const T = time;
      home.shift(HX, 0);
      tmp.shift(TX, 0);
      const CX = CHEST.x + TX;
      const dk = bump(t, 1.05, 2.1) * 0.8 + es(t, 3.3, 3.7) * 0.35 + es(t, 4.1, 4.6) * 0.3;
      dim.fade(Math.min(0.9, dk));
      swing(sunEl, 1220, 150, T, 1, 0.6);
      swing(cl, 690 + Math.sin(T * 0.1) * 20, 110, T, 1.2, 0.7, 1);

      /* the tablets hang over everything; the fourth commandment glows */
      const tabK = es(t, -0.3, 0.3, ease.out);
      const covered = es(t, 4.1, 4.8);
      swing(tab, TAB.x, TAB.y - (1 - tabK) * 1150, T, 0.7, 0.6);
      fade(tabGlow, es(t, 0.25, 0.5) * (1 - es(t, 1.0, 1.2)) + bump(t, 1.1, 1.9) * 0.6 + es(t, 2.0, 2.3) * 0.35 * (1 - covered));
      pose(tabObj, { o: 1 - covered * 0.35 });

      /* v4a — the son brings bread to his father and mother */
      const walkKeys = P ? [[0.1, 870], [0.5, 750], [1.95, 750], [2.2, 850], [3.05, 850], [3.25, 876]] : [[0.1, 860], [0.5, 690], [1.95, 690], [2.2, 900], [3.05, 900], [3.25, 930]];
      const sx = kfLin(t, walkKeys);
      const walking = (t > 0.1 && t < 0.5) || (t > 1.95 && t < 2.2) || (t > 3.05 && t < 3.25);
      const give = bump(t, 0.5, 0.95);
      const facingRight = t > 1.95;
      const blocked = es(t, 3.3, 3.6);
      const [bx, by] = hand(sx, FLOOR, 0.92, !facingRight, 24 - blocked * 10);
      const onChest = es(t, 2.48, 2.7);
      pose(basketEl, { x: lerp(bx + (facingRight ? -6 : 6), CX, onChest), y: lerp(by + 34, CHEST.y - 18, onChest) - Math.sin(onChest * PI) * 40 });
      const [gx, gy] = hand(sx, FLOOR, 0.92, true, 70);
      const gk = seg(t, 0.55, 0.9);
      pose(gift, { x: lerp(gx, 590 + HX, ease.io(gk)), y: lerp(gy, FLOOR - 104, ease.io(gk)) - Math.sin(gk * PI) * 20, o: t > 0.5 && t < 2.3 ? 1 : 0 });
      const loveK = es(t, 0.75, 0.95, ease.back) * (1 - es(t, 1.05, 1.2));
      pose(love, { x: 560 + HX, y: 470 - loveK * 20, s: loveK, o: loveK > 0.02 ? 1 : 0 });
      const sad = es(t, 3.4, 3.8);
      father.set({ x: 500, y: FLOOR - 32, s: 0.86, armF: bump(t, 0.7, 1.4) * 60 + sad * 10, head: -sad * 14 + bump(t, 0.7, 1.4) * 4, blink: blinkAt(T, 1) });
      mother.set({ x: 566, y: FLOOR - 32, s: 0.86, armF: 50 + bump(t, 0.4, 1.0) * 20 + sad * 22, head: sad * 16, blink: blinkAt(T, 5) });
      tears.forEach((te, i) => {
        const k = ((T * 0.6 + i * 0.5) % 1);
        const [hx, hy] = headAt((i ? 566 : 500) + HX, FLOOR - 32, 0.86, false, 62);
        pose(te, { x: hx + 10, y: hy + 6 + k * 30, o: es(t, 3.7, 3.9) * (1 - k) * (1 - es(t, 4.9, 5)) });
      });

      /* v4b — whoever curses father or mother: a shadow, a jagged word, a lowered drape */
      const shK = es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.05));
      shadowSon.set({ x: 780 + HX, y: FLOOR, s: 0.92, flip: true, o: shK, armF: 80, armB: 40, head: -6 });
      const cK = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.6, 1.75));
      pose(curse, { x: 700 + HX, y: 440, s: cK, o: cK > 0.02 ? 1 : 0 });
      const drop_ = es(t, 1.45, 1.7, ease.out) * (1 - es(t, 1.95, 2.25, ease.in));
      pose(drape, { x: 780 + HX, y: 440 - (1 - drop_) * 1150 });
      const snuff = es(t, 1.55, 1.7) * (1 - es(t, 2.2, 2.4)) + es(t, 3.5, 3.7);
      fade(flame, 1 - Math.min(1, snuff)); fade(cGlow, 1 - Math.min(1, snuff));
      son.set({
        x: sx, y: FLOOR, s: 0.92, flip: !facingRight, walk: walking ? sx * 0.05 : undefined, o: 1 - shK,
        armF: give * 70 + (t > 2.3 && t < 2.75 ? 30 : 0) + bump(t, 2.35, 2.75) * 50 + blocked * 70 * (1 - es(t, 3.7, 3.9)), armB: 24 - blocked * 10,
        head: blocked * 10 * (1 - es(t, 3.7, 3.9)) + es(t, 3.7, 3.9) * 14, blink: blinkAt(T, 3),
      });

      /* v5 — "But you say…": the Pharisee hands him a tag — Korban, a gift to God — and the basket goes into the chest */
      PHS.forEach((m, j) => {
        const lead = j === 0;
        const offer = lead ? es(t, 2.02, 2.2) * (1 - es(t, 2.5, 2.7)) : 0;
        const stop = lead ? es(t, 3.3, 3.55) : 0;
        const pass = bump(t, 4.05 + j * 0.2, 4.6 + j * 0.2);
        m.p.set({ x: m.x - stop * 40, y: FLOOR + (m.back ? -8 : 0), s: 0.9, flip: true, armF: offer * 80 + stop * 95 + pass * 110, armB: stop * 20 + pass * 60, head: -pass * 10, blink: blinkAt(T, m.seed) });
      });
      const [tx, ty] = hand(PHS[0].x + TX, FLOOR, 0.9, true, 80);
      const tagMove = es(t, 2.2, 2.4);
      const tagK = es(t, 2.08, 2.2);
      if (t < 2.48) pose(tagEl, { x: lerp(tx - 6, bx - 6, tagMove), y: lerp(ty - 10, by - 10, tagMove) - Math.sin(tagMove * PI) * 40, r: Math.sin(T * 2) * 4, o: tagK });
      else pose(tagEl, { x: lerp(bx, CX, onChest) + 30, y: lerp(by - 10, CHEST.y - 70, onChest), r: -10 + Math.sin(T * 1.5) * 3, o: 1 });
      const sayK = es(t, 2.3, 2.45, ease.back) * (1 - es(t, 2.95, 3.05));
      const [hx, hy] = headAt(sx, FLOOR, 0.92, false);
      pose(say, { x: hx - 20, y: hy - 24, s: sayK, o: sayK > 0.02 ? 1 : 0 });

      /* v6a — he need not honour his father: a sealed rope between the son and his parents */
      const ropeK = es(t, 3.2, 3.55, ease.out);
      pose(ropeEl, { x: P ? 762 : 790, y: 470 - (1 - ropeK) * 1150 + Math.sin(T * 0.9) * 2, o: ropeK > 0.01 ? 1 : 0 });

      /* v6b — so for your tradition you have made void the commandment of God: scrolls pasted over the tablets */
      covers.forEach((cv) => {
        const k = es(t, 4.1 + cv.i * 0.06, 4.45 + cv.i * 0.06);
        const from = PHS[cv.i % 3];
        const [fx0, fy0] = headAt(from.x + TX, FLOOR, 0.9, true);
        const x = lerp(fx0, cv.to[0], k), y = lerp(fy0 - 40, cv.to[1] - (1 - tabK) * 1150, k) - Math.sin(k * PI) * 90;
        pose(cv.el, { x, y, r: cv.r * k, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.z = 1 + es(t, 0, 1) * 0.03 + es(t, 4.0, 4.6) * 0.03;
      S.cam.y = -es(t, 4.0, 4.6) * 50;
      S.cam.x = (P ? 0 : 30) * es(t, 2.0, 2.5) * (1 - es(t, 4, 4.5));
    };
  },
};
