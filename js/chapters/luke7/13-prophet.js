// Łk 7,26–28 — the teaching goes on, the flats keep coming down over the crowds. "What then did you go out to see?
// A prophet?" — John on his rock by the Jordan, crying out to the people. "Yes, and more than a prophet": the prophets
// of old rise pale on the ridge behind him, and a light rises behind John, nearer than all of them. "This is he of
// whom it is written: I send my messenger before your face": a road runs across the next flat; John goes ahead on
// it, rolling the stones out of the way, and far behind comes the One in the light. "Among those born of women none
// is greater than John": Elizabeth with her baby, and John grown, on the highest of the plinths of Israel's great
// ones. "Yet the least in the kingdom of God is greater than he": over them the golden gate opens, and on its
// threshold, higher still, stands a small child; John bows to it.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { rock } from '../../assets/nature.js';
import {
  teachSet, TS, flatY, JOHN_B, ISAIAH, MOSES, ABRAHAM, DAVID, L9, ELIZABETH, KID_LOOKS, flat, flatSky, flatHills, fig, figure, johnInArms, plinth,
  kingdomGate, scrollOpen, sparkle, headAt, hangAt, childPerson, kf, tr, PI, FONT,
} from './lib.js';

const { GY, JX, FX, FW, FH, K } = TS;
const pale = (o) => ({ ...o, robe: mix(o.robe, C.parchment, 0.55), mantle: o.mantle ? mix(o.mantle, C.parchment, 0.55) : null, skin: mix(o.skin || C.skin, C.parchment, 0.4) });

export default {
  id: 'lk7-prophet',
  beats: [
    { v: 26, text: 'Ale coście wyszli zobaczyć? Proroka?' },
    { v: 26, cont: true, text: 'Tak, mówię wam, nawet więcej niż proroka.' },
    { v: 27 },
    { v: 28, text: 'Powiadam wam: Między narodzonymi z niewiast nie ma większego od Jana.' },
    { v: 28, cont: true, text: 'Lecz najmniejszy w królestwie Bożym większy jest niż on».' },
  ],
  cam: { x: [-20, 40], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const T0 = teachSet(S, { johnCameo: true });
    const c = T0.c;
    const X = (dx) => FX + dx * K;
    const B = T0.bits;

    /* flat A — the prophet at the Jordan; the prophets of old behind */
    const fA = T0.FL.add(flat(S, flatSky(S, FW, FH, ['#d4dcd2', '#f3e1bf']) + flatHills(c, FW, 10, mix(C.dune, C.sand2, 0.35), 8)
      + `<path d="${c.ribbon([[-210, 100], [0, 94], [210, 102]], 26, 2)}" fill="${C.lake}"/>`
      + `<g transform="translate(-40 86)">${rock(c, 0, 0, 90, 36, C.rock2)}</g>`
      + [[-170, 1], [-140, 0], [110, 1], [150, 0], [180, 1]].map(([x, f], i) => fig(c, { robe: [C.dustyBlue, C.sageRobe, C.mauve, C.wheatRobe, C.tealRobe][i], hairStyle: i % 2 ? 'veil' : 'short', veil: C.linen2, beard: i % 2 ? 'none' : 'short', hair: C.hair3 }, x, 104, 0.4, x > 0)).join(''), { w: FW, h: FH }));
    const aLight = B.add(`<g opacity="0"><circle r="90" fill="url(#halo-glow)"/></g>`);
    const oldOnes = [ISAIAH, L9.elijah, MOSES].map((o, i) => B.add(`<g opacity="0">${fig(c, pale(o), 0, 0, 0.42, i === 2)}</g>`));
    const johnA = B.add(`<g>${figure(c, JOHN_B, { s: 0.52, armF: 40, armB: 150, head: -8 })}</g>`);

    /* flat B — the messenger before His face */
    const road = [[-200, 110], [-120, 80], [-40, 60], [40, 30], [120, 0], [200, -20]];
    const fB = T0.FL.add(flat(S, flatSky(S, FW, FH, ['#cfdcd8', '#f4e3c3']) + flatHills(c, FW, -10, mix(C.hillMid, C.sand2, 0.3), 10)
      + `<path d="${c.ribbon(road, (u) => 40 - u * 24, 2)}" fill="${mix(C.sand, C.cream, 0.4)}"/>`, { w: FW, h: FH }));
    const bLight = B.add(`<g opacity="0"><circle r="70" fill="url(#halo-glow)"/><circle r="36" fill="url(#warm-glow)"/></g>`);
    const jesusB = B.add(`<g opacity="0">${figure(c, CAST.jesus, { s: 0.32, armF: 20 })}</g>`);
    const johnB = B.add(`<g opacity="0">${figure(c, JOHN_B, { s: 0.36, armF: 70, armB: 30, lean: 12 })}</g>`);
    const stones = [0, 1, 2].map((i) => ({ i, el: B.add(`<g opacity="0">${rock(c, 0, 0, 26 - i * 4, 14 - i * 2, C.rock2)}</g>`) }));
    const scroll = B.add(`<g opacity="0">${scrollOpen(c, 200, 56)}<text x="0" y="5" text-anchor="middle" font-family="${FONT}" font-size="14" font-style="italic" fill="${C.terracotta}">${tr('Oto posyłam mego wysłańca', 'Behold, I send my messenger')}</text></g>`);

    /* flat C — born of women; the least in the Kingdom */
    const fC = T0.FL.add(flat(S, flatSky(S, FW, FH, ['#cfdcd8', '#f3e6c8']) + flatHills(c, FW, 70, mix(C.hillMid, C.sage2, 0.3), 6), { w: FW, h: FH }));
    const gateGlow = B.add(`<g opacity="0"><circle r="90" fill="url(#halo-glow)"/></g>`);
    const KG = kingdomGate(c);
    const gate = B.add(`<g opacity="0"><g transform="scale(.42)">${KG.light}${KG.frame}</g></g>`);
    const child = B.add(`<g opacity="0"><g transform="scale(.3)">${childPerson(c, KID_LOOKS[2])}</g></g>`);
    const eliz = B.add(`<g opacity="0">${figure(c, ELIZABETH, { s: 0.4, armF: 70, armB: 60, head: 8 })}<g transform="translate(${(8 * 0.4).toFixed(1)} ${(-86 * 0.4).toFixed(1)}) scale(.4)">${johnInArms(c)}</g></g>`);
    const plinths = [[-120, 84, ABRAHAM], [-66, 72, MOSES], [66, 72, DAVID], [120, 84, L9.elijah]].map(([x, top, o], i) => ({ x, top, i, el: B.add(`<g opacity="0"><g transform="scale(.4)">${plinth(c, 90, (110 - top) / 0.4, C.stone)}</g>${fig(c, o, 0, 0, 0.3, x > 0)}</g>`) }));
    const johnP = B.add(`<g opacity="0"><g transform="scale(.4)">${plinth(c, 100, 150, mix(C.stone, C.sun, 0.25))}</g></g>`);
    const johnC = B.add(`<g opacity="0">${figure(c, JOHN_B, { s: 0.34, armF: 30, armB: 20 })}</g>`);
    const johnBow = B.add(`<g opacity="0">${figure(c, JOHN_B, { s: 0.34, armF: 60, armB: 140, head: -14, lean: 0 })}</g>`);

    return (t, time) => {
      const T = time;
      T0.update(t, T);
      const speak = 1;
      const point = es(t, 0.15, 0.3);
      T0.jesus.set({ x: JX, y: GY, s: 1.06, flip: t < 0.1, armF: 16 + point * 30, armB: 10 + point * 120 * (1 - bump(t, 1.95, 2.3) * 0.5), head: -point * 12, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1.06);
      T0.voice(hx, hy, speak * 0.7, T, { dir: 1, spread: 1.8 });
      hangAt(T0.jc, S.portrait ? 800 : 1118, S.portrait ? 20 : 150, T, 1, 0.6);

      const kA = es(t, 0.0, 0.26, ease.out) * (1 - es(t, 1.9, 2.15, ease.in));
      const kB = es(t, 2.0, 2.28, ease.out) * (1 - es(t, 2.92, 3.18, ease.in));
      const kC = es(t, 3.02, 3.3, ease.out);
      const yA = flatY(kA), yB = flatY(kB), yC = flatY(kC);
      const onA = kA > 0.002 ? 1 : 0, onB = kB > 0.002 ? 1 : 0, onC = kC > 0.002 ? 1 : 0;
      pose(fA, { x: FX, y: yA, s: K, o: onA });
      pose(fB, { x: FX, y: yB, s: K, o: onB });
      pose(fC, { x: FX, y: yC, s: K, o: onC });

      /* b0 — a prophet crying in the wilderness; b1 — more than a prophet */
      const more = es(t, 1.1, 1.4);
      oldOnes.forEach((el, i) => { const k = es(t, 1.08 + i * 0.08, 1.3 + i * 0.08); pose(el, { x: X(90 + i * 36), y: yA + (6 - i * 4) * K, s: K * (0.9 - i * 0.06), o: onA * k }); });
      pose(aLight, { x: X(-40), y: yA + 10 * K, s: K * (0.5 + more * 0.8), o: onA * more * 0.9 });
      pose(johnA, { x: X(-40 + more * 10), y: yA + 70 * K, s: K * (1 + more * 0.15), o: onA });

      /* b2 — "I send my messenger before your face, to prepare your way" */
      const walk = es(t, 2.2, 2.95);
      const along = (u) => { const f = u * (road.length - 1), j = Math.min(road.length - 2, Math.floor(f)), g = f - j; return [lerp(road[j][0], road[j + 1][0], g), lerp(road[j][1], road[j + 1][1], g)]; };
      const [jbx, jby] = along(0.18 + walk * 0.55);
      pose(johnB, { x: X(jbx), y: yB + jby * K, s: K * (1 - walk * 0.25), o: onB });
      const [cbx, cby] = along(0.02 + walk * 0.25);
      pose(jesusB, { x: X(cbx - 10), y: yB + cby * K, s: K, o: onB * es(t, 2.3, 2.5) });
      pose(bLight, { x: X(cbx - 10), y: yB + (cby - 44) * K, s: K, o: onB * es(t, 2.3, 2.5) * 0.9 });
      stones.forEach((s) => {
        const u = 0.3 + s.i * 0.18;
        const [sx, sy] = along(u);
        const push = es(t, 2.3 + s.i * 0.18, 2.5 + s.i * 0.18);
        pose(s.el, { x: X(sx + push * 36), y: yB + (sy + push * 30) * K, r: push * 140, s: K, o: onB });
      });
      const sk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(scroll, { x: X(-100), y: yB + -80 * K, s: sk * K, o: onB * (sk > 0.02 ? 1 : 0) });

      /* b3 — none born of women greater than John */
      pose(eliz, { x: X(-176), y: yC + 108 * K, s: K, o: onC * es(t, 3.2, 3.4) });
      const sink = 0, JT = 50;
      plinths.forEach((p) => { const k = es(t, 3.3 + p.i * 0.06, 3.5 + p.i * 0.06, ease.out); pose(p.el, { x: X(p.x), y: yC + (p.top + sink + (1 - k) * 60) * K, s: K, o: onC * (k > 0.01 ? 1 : 0) }); });
      const jk = es(t, 3.5, 3.72, ease.out);
      pose(johnP, { x: X(0), y: yC + (JT + sink + (1 - jk) * 80) * K, s: K, o: onC * (jk > 0.01 ? 1 : 0) });
      const bowK = es(t, 4.45, 4.55);
      pose(johnC, { x: X(0), y: yC + (JT + sink + (1 - jk) * 80) * K, s: K, o: onC * (jk > 0.01 ? 1 : 0) * (1 - bowK) });
      pose(johnBow, { x: X(0), y: yC + (JT + sink) * K, s: K, o: onC * bowK });
      /* b4 — the least in the Kingdom is greater than he */
      const gk = es(t, 4.05, 4.3, ease.out);
      pose(gateGlow, { x: X(0), y: yC + -70 * K, s: K * (0.6 + gk * 0.6), o: onC * gk });
      pose(gate, { x: X(0), y: yC + (-30 - (1 - gk) * 40) * K, s: K, o: onC * (gk > 0.01 ? 1 : 0) });
      const ck = es(t, 4.25, 4.4);
      pose(child, { x: X(0), y: yC + -32 * K, s: K, o: onC * ck });

      S.cam.y = kf(t, [[0, -20], [5, -20]]);
      S.cam.z = 1.04;
      S.cam.x = 0;
      void seg; void shade; void sheet; void sparkle; void lerp;
    };
  },
};
