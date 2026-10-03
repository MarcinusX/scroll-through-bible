// Mk 5,18–20 — at the boat the healed man begs to stay with Jesus; Jesus sends him home to tell what the
// Lord has done for him; a paper map of the Decapolis comes down from the flies and his little figure
// walks from town to town — each of the ten towns lights up, and everyone marvels.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { rock, reeds, house } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr, LANG } from '../../core/i18n.js';
import { LOOK, kf, shoreSet, bubble, heart, glyphTag, mapSheet, mapTown, DECAPOLIS, spark, townsfolk } from './lib.js';

const PI = Math.PI;
const JX = 760, FEET = 722;
const MAP0 = { x: 500, y: 172, s: 1.08 };            // map top-left in world units, scale
const ROUTE = ['Hippos', 'Gadara', 'Scytopolis', 'Pella', 'Dion', 'Geraza', 'Filadelfia', 'Kanata', 'Rafana', 'Damaszek'];

export default {
  id: 'm5-decapolis',
  beats: [
    { v: 18 },
    { v: 19, text: 'Ale nie zgodził się na to, tylko rzekł do niego:' },
    { v: 19, cont: true, text: '«Wracaj do domu, do swoich, i opowiadaj im wszystko, co Pan ci uczynił i jak ulitował się nad tobą».' },
    { v: 20, text: 'Poszedł więc i zaczął rozgłaszać w Dekapolu wszystko, co Jezus z nim uczynił,' },
    { v: 20, cont: true, text: 'a wszyscy się dziwili.' },
  ],
  cam: { x: [-60, 60], y: [-60, 50], z: [0.96, 1.14] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const MAP = P ? { x: 476, y: 172, s: 0.98 } : MAP0;   // phone: the whole map inside the screen, Kanata clear of the thread
    const SKY = ['#c2d6d8', '#f1e1c4', '#f5dcb4'];
    const set = shoreSet(S, { skyCols: SKY, sunAt: [1200, 170], sunR: 42 });

    /* ---------- the boat at the water's edge ---------- */
    const boatL = S.layer({ par: 0.5, sh: 5 });
    const B = boat(c, { mast: true });
    const DIS = [CAST.andrew, CAST.james, CAST.john, CAST.peter];
    const boatG = boatL.add(`<g><g>${B.back}</g>${DIS.map((d, i) => `<g data-k="bd${i}">${person(c, { ...d })}</g>`).join('')}<g data-k="jb">${person(c, { ...CAST.jesus })}</g><g>${B.front}</g></g>`);
    const dis = DIS.map((_, i) => ({ i, p: S.puppet(S.$('bd' + i).firstElementChild), seed: c.rr(0, 9) }));
    const jBoat = S.puppet(S.$('jb').firstElementChild);

    /* ---------- Jesus on the shore, the man ---------- */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const manK = S.puppet(pL.add(person(c, { ...LOOK.healed, pose: 'kneel' })));
    const man = S.puppet(pL.add(person(c, { ...LOOK.healed })));
    const ask = pL.add(`<g>${bubble(c, [tr('Pozwól mi zostać', 'Let me stay'), tr('z Tobą!', 'with you!')], { size: 20, dir: -1 })}</g>`);
    const home = house(c, -34, 0, 50, 36, { stairs: false, lit: true });
    const fam = [0, 1, 2].map((i) => `<g transform="translate(${26 + i * 16} 0) scale(${i === 2 ? 0.16 : 0.2})">${person(c, townsfolk(c, i === 2 ? { hairStyle: 'long', beard: 'none' } : {}))}</g>`).join('');
    const send = pL.add(`<g>${bubble(c, [' ', ' ', ' '], { w: 190, size: 22, dir: 1 })}<g transform="translate(-80 -60)">${home}${fam}<g transform="translate(0 -52) scale(.8)">${heart(c, 12)}</g></g></g>`);

    /* ---------- the map of the Decapolis ---------- */
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#3a2a1e"/>`);
    const mapL = S.layer({ par: 0.2, sh: 7 });
    const lab = (name, x, y) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="15" font-style="italic" fill="${C.ink}">${name}</text>`;
    const towns = ROUTE.map((pl) => DECAPOLIS.find((d) => d[0] === pl)).map(([pl, en, x, y], i) => ({ i, pl, en, x, y }));
    const mapInner = `${mapSheet(c, tr('Jezioro Galilejskie', 'Sea of Galilee'))}${towns.map((tw) => `<g transform="translate(${tw.x} ${tw.y})">${mapTown(c, 1)}</g>${lab(LANG === 'en' ? tw.en : tw.pl, tw.x, tw.y + 20)}`).join('')}<text x="300" y="44" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="26" fill="${C.terracotta}" letter-spacing="3">${tr('DEKAPOL', 'DECAPOLIS')}</text>`;
    const mapEl = mapL.add(`<g>${[80, 520].map((x) => `<path d="M${x} -1400V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>`).join('')}${mapInner}</g>`);
    // the route, segment by segment, as a dotted line
    const segs = towns.slice(1).map((tw, i) => {
      const a = towns[i];
      const n = Math.max(3, Math.round(Math.hypot(tw.x - a.x, tw.y - a.y) / 14));
      let d = '';
      for (let k = 1; k < n; k++) d += c.poly(c.circ(lerp(a.x, tw.x, k / n), lerp(a.y, tw.y, k / n) - 8, 2.2, 6));
      return { el: mapL.add(`<path d="${d}" fill="${C.terracotta}"/>`) };
    });
    const lights = towns.map((tw) => ({ tw, el: mapL.add(`<g>${spark(c, 12)}</g>`) }));
    const bangs = towns.map((tw) => ({ tw, el: mapL.add(`<g>${glyphTag(c, '!', { size: 16 })}</g>`) }));
    const token = S.puppet(mapL.add(person(c, { ...LOOK.healed })));

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 1420, 960, 260, 100, C.rock2) + reeds(c, 170, 940, 14, 220, C.moss) + rock(c, 260, 985, 170, 60, C.rock));

    const W = (x, y) => [MAP.x + x * MAP.s, MAP.y + y * MAP.s];

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunY: 170 + es(t, 0, 5) * 80 });
      set.sk.blend(SKY, ['#d8c7c9', '#f0cfb0', '#f3c796'], seg(t, 0, 5));

      /* v18 — Jesus steps into the boat; the man kneels and begs to come too */
      const inBoat = es(t, 0.5, 0.56);
      const sail = es(t, 3.0, 4.6);
      const bx = lerp(P ? 640 : 600, -200, sail), by = 758;   // phone: the boat a little further in, the stern clear of the frame
      pose(boatG, { x: bx, y: by + Math.sin(T * 1.3) * 2, s: 0.9, r: Math.sin(T * 1.1) * 0.8 });
      const jx = kf(t, [[0.1, JX], [0.5, P ? 730 : 690]]);
      jesus.set({ x: jx, y: FEET, s: 1, flip: true, o: 1 - inBoat, walk: t > 0.1 && t < 0.5 ? jx * 0.06 : undefined, blink: blinkAt(T) });
      const bless = es(t, 1.05, 1.35) * (1 - es(t, 2.0, 2.2));
      const point = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const wave = es(t, 3.1, 3.3) * (1 - es(t, 4.2, 4.5));
      jBoat.set({
        x: 110, y: -6, s: 1.02, flip: t < 1.0 || t > 3.05 ? true : false, o: inBoat,
        armF: 20 + bless * 70 + point * 100 + wave * (90 + Math.sin(T * 5) * 20), armB: 10 + point * 20,
        head: bless * (8 + Math.sin(t * 18) * 5) - point * 12, blink: blinkAt(T),
      });
      dis.forEach((d) => d.p.set({ x: -130 + d.i * 52, y: 0, s: 0.92, flip: false, armF: 20 + (d.i === 3 ? es(t, 0.2, 0.6) * 40 : 0), armB: 10, head: 2, blink: blinkAt(T, d.seed) }));

      const rise = es(t, 2.2, 2.3);
      const mx = kf(t, [[0, 1100], [0.55, 870], [2.3, 870], [3.2, P ? 1090 : 1420]]);   // phone: he sets off home on screen
      manK.set({ x: 870, y: FEET, s: 1, flip: true, o: seg(t, 0.5, 0.56) * (1 - rise), armF: 90 + bless * -20, armB: 110 - bless * 40, lean: 14 - bless * 10, head: -8 + bless * 14, blink: blinkAt(T, 4) });
      man.set({ x: mx, y: FEET, s: 1, flip: t < 2.35, o: ((1 - seg(t, 0.5, 0.56)) + rise) * (1 - seg(t, 2.95, 3.2)), walk: (t < 0.55 || t > 2.35) ? mx * 0.05 : undefined, armF: 30 + bump(t, 2.3, 2.9) * 40, armB: 10, head: -point * 6, blink: blinkAt(T, 4) });
      const k1 = es(t, 0.6, 0.8, ease.back) * (1 - es(t, 1.0, 1.1));
      pose(ask, { x: 880, y: FEET - 150, s: k1, o: k1 > 0.02 ? 1 : 0 });
      const k2 = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.85, 3.0));
      pose(send, { x: bx + 110 * 0.9 - 6, y: FEET - 200, s: k2, o: k2 > 0.02 ? 1 : 0 });

      /* v20 — the map comes down; he goes from town to town */
      const drop = es(t, 2.85, 3.3, ease.out);
      tint.fade(drop * 0.25);
      const my = lerp(-1300, MAP.y, drop) + Math.sin(T * 0.8) * 3 * drop;
      pose(mapEl, { x: MAP.x, y: my, s: MAP.s });
      const dy = my - MAP.y;
      const tour = seg(t, 3.2, 4.05) * (towns.length - 1);
      segs.forEach((sg, i) => {
        const k = seg(tour, i, i + 1);
        pose(sg.el, { x: MAP.x, y: MAP.y + dy, s: MAP.s, o: k > 0 ? Math.min(1, k * 2) : 0 });
      });
      const ti = Math.min(towns.length - 2, Math.floor(tour)), tk = tour - ti;
      const a = towns[ti], b = towns[ti + 1];
      const [tx, ty] = W(lerp(a.x, b.x, tk), lerp(a.y, b.y, tk));
      token.set({ x: tx, y: ty - 6 + dy, s: 0.2, flip: b.x < a.x, o: seg(t, 3.15, 3.25), walk: t > 3.2 && t < 4.05 ? t * 60 : undefined, amt: 1.5, armF: 30 + bump(t, 4.0, 5) * 90, armB: bump(t, 4.0, 5) * 110 });
      lights.forEach((l, i) => {
        const on = seg(tour, i - 0.2, i + 0.1);
        const [lx, ly] = W(l.tw.x, l.tw.y - 8);
        pose(l.el, { x: lx, y: ly + dy, s: (0.4 + on * 0.6) * (1 + (on > 0 && t > 3.1 ? Math.sin(T * 2 + i) * 0.06 : 0)), o: t > 3.1 ? on : 0 });
      });
      bangs.forEach((g, i) => {
        const k = es(t, 4.08 + i * 0.05, 4.25 + i * 0.05, ease.back);
        const [lx, ly] = W(g.tw.x + 16, g.tw.y - 34);
        const Tg = k > 0.02 ? T : 0;
        pose(g.el, { x: lx, y: ly + dy - Math.sin(Tg * 2 + i) * 2, s: k, r: Math.sin(Tg * 3 + i) * 8, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.z = 1.04 + bump(t, 0.5, 2.9) * 0.06 - es(t, 2.9, 3.4) * 0.06;
      S.cam.x = -30 + es(t, 0.3, 1) * 30 - es(t, 2.9, 3.4) * 20;
      S.cam.y = 10 - es(t, 2.9, 3.4) * 40;
    };
  },
};
