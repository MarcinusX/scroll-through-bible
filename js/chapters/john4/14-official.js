// J 4,46–50a — Cana again: the six stone jars stand by the courtyard wall, and for a moment their water blushes into
// wine (where He made water wine). Meanwhile a picture hangs on the right: Capernaum — in a fine house a boy lies in
// fever, his mother beside him, the royal official watching. Hearing Jesus has come, the father leaves and comes up to
// Cana and kneels, begging; the boy is dying — in the picture the lamp burns low. "Unless you see signs and wonders
// you will not believe" — empty dashed stars over the onlookers who crane to see. "Sir, come down before my child
// dies!" "Go, your son lives" — the day-arc shows the seventh hour; a thread of light runs from His hand to the
// picture: the fever leaves, the lamp flares, the boy sits up in his mother's arms.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  galileeSet, samaritan, OFFICIAL, SON, MOTHER, stoneJar, panel, homeInside, HOUSE_P, bedFrame, bedBlanket, feverWaves, emptyStar, dayArc, hourAt, sunToken, say, strip, sparkle, vis, kf, headAt,
} from './lib.js';
import { lyingPerson } from '../mark5/lib.js';

const FLOOR = 716;
const PAN0 = { x: 1160, y: 140 };
const JX = 830;
const AR0 = { x: 600, y: 330, r: 80 };
const WINE = shade(C.plumRobe, -0.25);

export default {
  id: 'j4-official',
  beats: [
    { v: 46, text: 'Następnie przybył powtórnie do Kany Galilejskiej, gdzie przedtem przemienił wodę w wino.' },
    { v: 46, cont: true, text: 'A w Kafarnaum mieszkał pewien urzędnik królewski, którego syn chorował.' },
    { v: 47, text: 'Usłyszawszy, że Jezus przybył z Judei do Galilei, udał się do Niego z prośbą, aby przyszedł i uzdrowił jego syna:' },
    { v: 47, cont: true, text: 'był on bowiem już umierający.' },
    { v: 48 },
    { v: 49 },
    { v: 50, text: 'Rzekł do niego Jezus: «Idź, syn twój żyje».' },
  ],
  cam: { x: [-300, 160], y: [-60, 80], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const PAN = S.portrait ? { x: 820, y: 30 } : PAN0;
    const AR = S.portrait ? { ...AR0, x: 640, y: 480 } : AR0;     // phone: the hour of Cana under the picture, inside the frame
    const W = galileeSet(S, { cana: null });
    const L = W.actL;
    // the courtyard wall and the six stone jars of Cana
    const wall = sheet();
    wall.p(c.cut([[380, FLOOR - 4], [380, FLOOR - 130], [720, FLOOR - 124], [720, FLOOR - 4]], 0.8, 10), mix(C.plaster2, C.clay, 0.2));
    wall.p(c.cut(c.rect(372, FLOOR - 140, 356, 14), 0.5, 8), shade(C.plaster2, -0.1));
    L.add(wall.out());
    const JARS = [430, 472, 514, 556, 598, 640];
    JARS.forEach((x) => L.add(`<g transform="translate(${x} ${FLOOR + 4}) scale(.62)">${stoneJar(c, 96)}</g>`));
    const wine = JARS.map((x) => L.add(`<ellipse cx="${x}" cy="${FLOOR + 4 - 0.62 * 103}" rx="12" ry="4" fill="${WINE}" opacity="0"/>`));
    const jarSp = [0, 1, 2].map(() => L.add(`<g>${sparkle(c, 10)}</g>`));
    const canaTag = L.add(`<g>${strip(c, tr('Kana Galilejska', 'Cana of Galilee'), { size: 18 })}</g>`);
    const look = [0, 1, 2].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, samaritan(c, i + 130)))), x: 636 + i * 50 }));
    const jesus = S.puppet(L.add(person(c, CAST.jesus)));
    const offStand = S.puppet(L.add(person(c, OFFICIAL)));
    const offKneel = S.puppet(L.add(person(c, { ...OFFICIAL, pose: 'kneel' })));

    /* ---------- Capernaum: the picture ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const { floor, bedX, lampX } = HOUSE_P;
    const panEl = fx.add(`<g>${panel(S, homeInside(c), { w: HOUSE_P.w, h: HOUSE_P.h, k: 'home' })}</g>`);
    const pTag = fx.add(`<g>${strip(c, tr('Kafarnaum', 'Capernaum'), { size: 18 })}</g>`);
    const bedEl = fx.add(`<g transform="scale(.7)">${bedFrame(c, 230)}</g>`);
    const lying = fx.add(`<g transform="scale(.7)">${lyingPerson(c, SON, 0.5)}</g>`);
    const blanket = fx.add(`<g transform="scale(.7)">${bedBlanket(c, 230)}</g>`);
    const boyUp = S.puppet(fx.add(person(c, { ...SON, pose: 'sit' })));
    const mother = S.puppet(fx.add(person(c, { ...MOTHER, pose: 'kneel' })));
    const dadIn = S.puppet(fx.add(person(c, OFFICIAL)));
    const fever = fx.add(`<g>${feverWaves(c, 50)}</g>`);
    const lamp = fx.add(`<g><circle r="60" fill="url(#warm-glow)" class="lg"/><path d="M0 0C-6 -5 -5 -14 0 -26C5 -14 6 -5 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-3 -6 -3 -10 0 -15C3 -10 3 -6 0 -2Z" fill="#fff4d2"/></g>`);
    const lampG = lamp.querySelector('.lg');
    const miniArc = fx.add(`<g transform="scale(.42)">${dayArc(c, 70, { marks: [7] }).replace(/<path d="M0 -1600[^>]*>/, '')}</g>`);
    const miniSun = fx.add(`<g>${sunToken(c, 6)}</g>`);

    /* ---------- words, signs, the hour ---------- */
    const fx2 = S.layer({ par: 0.55, sh: 5 });
    const stars = [0, 1, 2, 3].map((i) => fx2.add(`<g>${emptyStar(c, 20)}</g>`));
    const plea = fx2.add(`<g>${say(c, tr('Panie, przyjdź!', 'Sir, come down!'), { size: 22, side: -1 })}</g>`);
    const lives = fx2.add(`<g>${say(c, tr('Idź, syn twój żyje', 'Go, your son lives'), { size: 22, side: 1 })}</g>`);
    const arc = fx2.add(`<g>${dayArc(c, AR.r, { label: tr('Kana', 'Cana'), marks: [7] })}</g>`);
    const tok = fx2.add(`<g>${sunToken(c, 11)}</g>`);
    const thread = fx2.add(`<path d="" pathLength="1" stroke="${C.halo}" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 1" stroke-dashoffset="1" fill="none"/>`);
    const hope = fx2.add(`<g><circle r="40" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      W.update(t, T);
      /* v46a — Cana, the jars */
      const walk = es(t, -0.3, 0.5, ease.out);
      const jx = lerp(1000, JX, walk);
      const speak48 = es(t, 4.05, 4.25) * (1 - es(t, 4.9, 5.05));
      const say50 = es(t, 6.05, 6.25);
      jesus.set({ x: jx, y: FLOOR, s: 1.06, flip: true, walk: walk > 0 && walk < 1 ? jx * 0.05 : undefined, armF: 16 + speak48 * 50 + say50 * 60, armB: 12 + speak48 * 30 + say50 * 90, head: -speak48 * 4 + es(t, 5.1, 5.3) * 8 * (1 - say50), blink: blinkAt(T) });
      const blush = bump(t, 0.35, 0.95);
      wine.forEach((w, i) => fade(w, blush * es(t, 0.35 + i * 0.04, 0.45 + i * 0.04)));
      jarSp.forEach((s, i) => vis(s, { x: JARS[i * 2 + 1], y: FLOOR - 70 - bump(t, 0.4 + i * 0.1, 0.95) * 20, s: bump(t, 0.4 + i * 0.1, 0.95), r: T * 30, o: bump(t, 0.4 + i * 0.1, 0.95) }));
      vis(canaTag, { x: 540, y: FLOOR - 170, r: -3, o: es(t, 0.2, 0.4) * (1 - (S.portrait ? es(t, 0.95, 1.15) : es(t, 1.8, 2.1))) });   // phone: gone before the camera leaves the jars
      look.forEach((l) => {
        const crane = es(t, 4.2, 4.4) * (1 - es(t, 4.9, 5.1));
        l.p.set({ x: l.x, y: FLOOR - 8 + (l.i % 2) * 6, s: 0.98, armF: 16 + crane * 40 * (l.i % 2), armB: 12 + crane * 60 * ((l.i + 1) % 2), head: -crane * 14 + es(t, 2.6, 2.9) * 6, blink: blinkAt(T, l.seed) });
      });
      /* v46b — Capernaum: the sick boy */
      const pk = es(t, 1.0, 1.35, ease.out);
      const px = PAN.x, py = PAN.y - (1 - pk) * 700;
      const on = pk > 0.01 ? 1 : 0;
      vis(panEl, { x: px, y: py, o: on });
      vis(pTag, { x: px - 120, y: py + 24, r: -3, o: on * es(t, 1.3, 1.45) });
      const B = [px + bedX, py + floor];
      vis(bedEl, { x: B[0], y: B[1], s: 0.7, o: on });
      const heal = es(t, 6.35, 6.6);
      const up = es(t, 6.5, 6.58);
      vis(lying, { x: B[0], y: B[1] - 54 * 0.7, s: 0.7, o: on * (1 - up) });
      vis(blanket, { x: B[0], y: B[1], s: 0.7, o: on });
      boyUp.set({ x: B[0] + 40, y: B[1] - 42, s: 0.36, flip: true, o: on * up, armF: 60 + heal * 40, armB: 40 + heal * 60, head: -4, blink: blinkAt(T, 6) });
      const leave = es(t, 2.05, 2.5, ease.in);
      dadIn.set({ x: lerp(px - 60, px + 230, leave), y: py + floor + 2, s: 0.5, flip: leave > 0.02 ? false : true, o: on * (1 - es(t, 2.4, 2.5)), walk: leave > 0 && leave < 1 ? leave * 30 : undefined, head: 6, armF: 20, blink: blinkAt(T, 4) });
      const sad = es(t, 3.05, 3.3) * (1 - heal);
      mother.set({ x: B[0] - 64, y: B[1] + 2, s: 0.46, o: on, armF: 50 + sad * 20 + heal * 40, armB: 30 + heal * 50, head: 8 + sad * 10 - heal * 14, lean: 6 + sad * 4, blink: blinkAt(T, 5) });
      const fk = on * (1 - heal) * (0.7 + 0.3 * es(t, 3.05, 3.3));
      vis(fever, { x: B[0] + 34, y: B[1] - 60 - ((T * 14) % 8), s: 0.8 + es(t, 3.05, 3.3) * 0.3, o: fk });
      const low = 1 - es(t, 3.05, 3.4) * 0.45 - es(t, 5.05, 5.4) * 0.3 + heal * 0.95;
      vis(lamp, { x: px + lampX, y: py + floor - 84, s: low * (1 + Math.sin(T * 7) * 0.05), o: on });
      fade(lampG, on * low * 0.9);
      const mk = es(t, 6.4, 6.6);
      vis(miniArc, { x: px + 150, y: py + 230, s: 0.42, o: on * mk });
      const [mhx, mhy] = hourAt(70 * 0.42, 7);
      vis(miniSun, { x: px + 150 + mhx, y: py + 230 + mhy, o: on * mk });
      /* v47a — the father comes to Cana and begs */
      const arrive = es(t, 2.3, 2.9, ease.out);
      const kneel = es(t, 2.88, 2.95);
      const ox = lerp(1500, 950, arrive);
      const rise = es(t, 6.8, 6.9) * 0;
      offStand.set({ x: ox, y: FLOOR + 4, s: 1.02, flip: true, o: (arrive > 0.01 ? 1 : 0) * (1 - kneel) + rise, walk: arrive > 0 && arrive < 1 ? ox * 0.06 : undefined, armF: 20, blink: blinkAt(T, 4) });
      const beg = bump(t, 2.95, 3.9) * 0.5 + es(t, 5.05, 5.25) * (1 - es(t, 6.2, 6.4));
      offKneel.set({ x: 950, y: FLOOR + 6, s: 1.02, flip: true, o: kneel, armF: 60 + beg * 60 + es(t, 6.3, 6.5) * -20, armB: 40 + beg * 110, head: -6 - beg * 10 + es(t, 4.1, 4.4) * 8 * (1 - es(t, 5.0, 5.1)), lean: -6, blink: blinkAt(T, 4) });
      /* v48 — signs and wonders */
      stars.forEach((s, i) => {
        const k = es(t, 4.15 + i * 0.07, 4.35 + i * 0.07, ease.back) * (1 - es(t, 4.9, 5.05));
        vis(s, { x: 640 + i * 60, y: 430 - (i % 2) * 30 + Math.sin(T + i) * 3, s: k, r: T * 6, o: k > 0.01 ? 1 : 0 });
      });
      /* v49 — come down before my child dies */
      const [ohx, ohy] = headAt(950, FLOOR + 6, 1.02, true, 46);
      const pl = es(t, 5.1, 5.3, ease.back) * (1 - es(t, 5.9, 6.0));
      vis(plea, { x: ohx - 12, y: ohy - 22, s: pl, o: pl > 0.01 ? 1 : 0 });
      /* v50a — Go, your son lives */
      const [jhx, jhy] = headAt(JX, FLOOR, 1.06, true);
      const lk = es(t, 6.1, 6.3, ease.back);
      vis(lives, { x: jhx + 10, y: jhy - 26, s: lk, o: lk > 0.01 ? 1 : 0 });
      const ak = es(t, 6.05, 6.35, ease.out);
      vis(arc, { x: AR.x, y: AR.y - (1 - ak) * 700, o: ak > 0.01 ? 1 : 0 });
      const [hx, hy] = hourAt(AR.r, lerp(5.5, 7, es(t, 6.2, 6.4)));
      vis(tok, { x: AR.x + hx, y: AR.y - (1 - ak) * 700 + hy, s: 1 + bump(t, 6.4, 6.7) * 0.4, o: ak > 0.01 ? 1 : 0 });
      const th = es(t, 6.25, 6.5);
      if (th > 0 && !thread.__d) { thread.__d = 1; }
      attr(thread, 'd', `M${JX - 40} ${FLOOR - 190}Q${(JX + px) / 2} ${py - 60} ${B[0] + 30} ${B[1] - 60}`);
      attr(thread, 'stroke-dashoffset', 1 - th);
      fade(thread, th > 0 ? 1 - es(t, 6.8, 6.95) * 0.6 : 0);
      vis(hope, { x: B[0] + 30, y: B[1] - 60, s: 0.5 + heal, o: bump(t, 6.35, 6.95) });

      // phone: first look left, to the six jars of Cana
      S.cam.x = S.portrait ? kf(t, [[-0.5, -160], [0.4, -280], [0.95, -280], [1.4, 60], [2.0, 80], [2.3, 40], [3.0, 60], [4.0, 20], [5.0, 40], [6.0, 60]]) : kf(t, [[-0.5, -20], [0.5, -40], [1.0, 60], [2.0, 80], [2.3, 40], [3.0, 60], [4.0, 20], [5.0, 40], [6.0, 60]]);
      S.cam.y = kf(t, [[-0.5, 40], [0.5, 40], [1.0, -20], [2.0, -20], [3.0, 10], [4.0, 20], [5.0, 20], [6.0, -20]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.5, 1.12], [1.0, 1.02], [2.0, 1.02], [3.0, 1.06], [4.0, 1.08], [5.0, 1.12], [6.0, 1.0]]);
    };
  },
};
