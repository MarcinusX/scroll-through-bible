// Łk 7,24–25 — John's messengers go off down the road; Jesus turns to the crowds on the slope and begins to speak about
// John, whose cameo comes down beside Him. "What did you go out into the wilderness to see?" — a painted flat: the
// desert by the Jordan and the long lines of people walking out from the towns to the river. "A reed shaken by the
// wind?" — reeds spring up along the bank and a gust bends and tosses them. "A man dressed in soft clothing?" — a
// second flat: a courtier in a shimmering silk mantle, a feather fan swaying over him. "Those who are gorgeously
// dressed and live in luxury are in kings' courts" — a third: the king on his golden throne, his table heaped with
// gold cups and fruit, his courtiers in silk.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import {
  teachSet, TS, flatY, JD, COURTIERS, HEROD, flat, flatSky, flatHills, fig, cityIcon, reedClump, crown, throne, cup, loaf, sparkle, headAt, hangAt,
  kf, moving, tr, PI,
} from './lib.js';

const { GY, JX, FX, FW, FH, K } = TS;

export default {
  id: 'lk7-reed',
  beats: [
    { v: 24, text: 'Gdy wysłannicy Jana odeszli, Jezus zaczął mówić do tłumów o Janie:' },
    { v: 24, cont: true, text: '«Coście wyszli oglądać na pustyni?' },
    { v: 24, cont: true, text: 'Trzcinę kołyszącą się na wietrze?' },
    { v: 25, text: 'Ale coście wyszli zobaczyć? Człowieka w miękkie szaty ubranego?' },
    { v: 25, cont: true, text: 'Oto w pałacach królewskich przebywają ci, którzy noszą okazałe stroje i żyją w zbytkach.' },
  ],
  cam: { x: [-20, 40], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    const T0 = teachSet(S, { johnCameo: true });
    const c = T0.c;
    const X = (dx) => FX + dx * K;
    const cut = (o, x, y, s, flip = false) => fig(c, o, x, y, s, flip);

    /* flat 1 — the wilderness by the Jordan */
    const f1 = T0.FL.add(flat(S, flatSky(S, FW, FH, ['#cfdcd4', '#f4e2c2']) + flatHills(c, FW, -20, mix(C.duskViolet, C.dune, 0.45), 12) + flatHills(c, FW, 30, mix(C.dune, C.sand2, 0.4), 6)
      + `<path d="${c.ribbon([[-210, 96], [-80, 84], [40, 90], [210, 80]], 30, 2)}" fill="${C.lake}"/>`
      + `<path d="${c.ribbon([[-170, 18], [-120, 40], [-60, 50], [0, 66], [60, 76]], 10, 1)}" fill="${mix(C.sand, C.cream, 0.4)}"/>`
      + `<g transform="translate(-170 22) scale(.5)">${cityIcon(c, 90)}</g>`, { w: FW, h: FH }));
    const walkers = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => T0.bits.add(`<g>${cut(i % 2 ? { robe: [C.sageRobe, C.mauve, C.wheatRobe][i % 3], hairStyle: 'veil', veil: C.linen2, beard: 'none' } : { robe: [C.dustyBlue, C.ochreRobe, C.tealRobe][i % 3], hairStyle: 'short', beard: 'short', hair: C.hair3 }, 0, 0, 0.26)}</g>`));
    const reeds = [[-150, 92, 90], [-96, 96, 110], [-40, 90, 80], [70, 90, 100], [130, 94, 120], [185, 88, 86]].map(([x, y, h], i) => ({ i, x, y, el: T0.bits.add(`<g>${reedClump(makeCutter('lk7-reed' + i), { n: 7, h, col: i % 2 ? C.moss : C.olive })}</g>`) }));
    let wd = '';
    for (let i = 0; i < 7; i++) { const y = -90 + i * 22, x = -180 + (i % 3) * 60; wd += c.ribbon(c.qbez([x, y], [x + 50, y - 10], [x + 110, y + 4], 8), (u) => 0.8 + Math.sin(u * PI) * 3); }
    const wind = T0.bits.add(`<g><path d="${wd}" fill="#fffaf0" opacity=".85"/></g>`);

    /* flat 2 — a man in soft clothing */
    const silkCol = mix(C.lavender, C.roseRobe, 0.35);
    const f2 = T0.FL.add(flat(S, flatSky(S, FW, FH, [mix(C.plumRobe, C.roseRobe, 0.5), mix(C.peach, C.cream, 0.4)])
      + sheet().p(c.cut([[-FW / 2 - 4, 70], [FW / 2 + 4, 66], [FW / 2 + 4, FH / 2 + 4], [-FW / 2 - 4, FH / 2 + 4]], 0.4, 8), mix(C.stone, C.peach, 0.3)).out()
      + [-150, 150].map((x) => sheet().p(c.cut(c.rect(x - 16, -FH / 2, 32, 190), 0.4, 6), mix(C.stone, C.cream, 0.4)).p(c.cut([[x - 60, -FH / 2], [x + 60, -FH / 2], [x + 40, -60], [x, -90], [x - 40, -60]], 0.5, 6), mix(C.plumRobe, C.roseRobe, 0.3)).out()).join(''), { w: FW, h: FH }));
    const courtier = T0.bits.add(`<g>${cut({ ...COURTIERS[0], mantle: silkCol }, 0, 0, 0.62)}</g>`);
    const fan = T0.bits.add(`<g>${sheet().p(c.ribbon([[0, 30], [0, -110]], 3), C.wood2).p((() => { let f = ''; for (let i = 0; i < 7; i++) { const a = -PI / 2 + (i - 3) * 0.24; f += c.cut([[0, -110], [Math.cos(a - 0.1) * 54, -110 + Math.sin(a - 0.1) * 54], [Math.cos(a) * 62, -110 + Math.sin(a) * 62], [Math.cos(a + 0.1) * 54, -110 + Math.sin(a + 0.1) * 54]], 0.4, 5); } return f; })(), mix(C.skyVeil, C.cream, 0.3)).out()}</g>`);
    const fanBoy = T0.bits.add(`<g>${cut({ robe: C.linen2, hairStyle: 'curly', hair: C.hair3, beard: 'none', skin: C.skin4, belt: C.sun }, 0, 0, 0.5)}</g>`);
    const glints = [0, 1, 2].map(() => T0.bits.add(`<g>${sparkle(c, 8, '#fff6dc')}</g>`));

    /* flat 3 — kings' courts */
    const f3 = T0.FL.add(flat(S, flatSky(S, FW, FH, [mix(C.sun, C.peach, 0.5), mix(C.cream, C.peach, 0.3)])
      + sheet().p(c.cut([[-FW / 2 - 4, 76], [FW / 2 + 4, 72], [FW / 2 + 4, FH / 2 + 4], [-FW / 2 - 4, FH / 2 + 4]], 0.4, 8), mix(C.sun, C.stone, 0.55)).out()
      + [-170, -60, 60, 170].map((x) => sheet().p(c.cut(c.rect(x - 12, -FH / 2, 24, 200), 0.4, 6), mix(C.stone, C.cream, 0.5)).p(c.cut(c.rect(x - 18, -FH / 2 + 10, 36, 10), 0.3, 4), C.sun).out()).join('')
      + `<g transform="translate(0 66) scale(.5)">${throne(c)}</g>`
      + cut({ ...HEROD, pose: 'sit' }, -6, 66, 0.52)
      + `<g transform="translate(-4 -22) scale(.62)">${crown(c)}</g>`
      + sheet().p(c.cut([[-190, 86], [-70, 86], [-74, 96], [-186, 96]], 0.4, 5), C.wood).p(c.cut([[70, 86], [190, 86], [186, 96], [74, 96]], 0.4, 5), C.wood).out()
      + [-170, -130, -95, 95, 130, 170].map((x, i) => `<g transform="translate(${x} 84)">${i % 2 ? cup(c, C.sun) : loaf(c, 8, C.sun)}</g>`).join('')
      + cut({ ...COURTIERS[1], pose: 'sit' }, -150, 108, 0.46, true) + cut({ ...COURTIERS[3], pose: 'sit' }, -110, 108, 0.44) + cut({ ...COURTIERS[2], pose: 'sit' }, 120, 108, 0.46) + cut({ ...COURTIERS[0], pose: 'sit' }, 160, 108, 0.44, true), { w: FW, h: FH }));

    /* the messengers going away */
    const dis = JD.map((o, i) => ({ i, p: S.puppet(T0.P.add(person(c, o))), seed: c.rr(0, 9) }));

    return (t, time) => {
      const T = time;
      T0.update(t, T);
      /* b0 — the messengers go; He turns to the crowds and speaks about John */
      dis.forEach((d) => {
        const Kx = [[0, 930 + d.i * 90], [1.0, 1320 + d.i * 90], [1.3, 1700 + d.i * 90]];
        const x = kf(t, Kx);
        d.p.set({ x, y: GY + d.i * 6, s: 1.0, walk: moving(t, Kx) ? x * 0.05 + d.i : undefined, armF: 16, blink: blinkAt(T, d.seed) });
      });
      const turn = t > 0.3 && t < 0.95;
      const speak = es(t, 0.3, 0.45);
      const point = es(t, 1.2, 1.35) * (1 - es(t, 4.8, 5.0));
      jesus(T0, T, { x: JX, turn, speak, point: point * (0.6 + bump(t, 2.1, 2.9) * 0.4) });
      const jk = es(t, 0.4, 0.75, ease.out);
      hangAt(T0.jc, S.portrait ? 800 : 1118, lerp(-600, S.portrait ? 20 : 150, jk), T, 1, 0.6);

      /* flats: 1 wilderness [b1–b2], 2 soft clothing [b3], 3 palaces [b4] */
      const k1 = es(t, 1.0, 1.28, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      const k2 = es(t, 3.05, 3.32, ease.out) * (1 - es(t, 3.95, 4.2, ease.in));
      const k3 = es(t, 4.05, 4.32, ease.out);
      const y1 = flatY(k1), y2 = flatY(k2), y3 = flatY(k3);
      pose(f1, { x: FX, y: y1, s: K, o: k1 > 0.002 ? 1 : 0 });
      pose(f2, { x: FX, y: y2, s: K, o: k2 > 0.002 ? 1 : 0 });
      pose(f3, { x: FX, y: y3, s: K, o: k3 > 0.002 ? 1 : 0 });
      const on1 = k1 > 0.002 ? 1 : 0, on2 = k2 > 0.002 ? 1 : 0;
      // pilgrims walking out along the path to the river
      const PATH = [[-170, 22], [-120, 44], [-60, 54], [0, 70], [60, 80]];
      walkers.forEach((w, i) => {
        const u = Math.min(0.999, Math.max(0, es(t, 1.1, 2.0) * 0.55 + i * 0.11 - 0.1));
        const seg4 = u * (PATH.length - 1), j = Math.floor(seg4), f = seg4 - j;
        const px = lerp(PATH[j][0], PATH[j + 1][0], f), py = lerp(PATH[j][1], PATH[j + 1][1], f);
        pose(w, { x: X(px), y: y1 + (py + 4) * K, s: K * (0.8 + u * 0.4), o: on1 });
      });
      // the reeds spring up, then the gust tosses them
      const gust = bump(t, 2.08, 2.95);
      reeds.forEach((r) => {
        const g = es(t, 1.95 + r.i * 0.03, 2.15 + r.i * 0.03, ease.out);
        pose(r.el, { x: X(r.x), y: y1 + r.y * K, sx: K * 0.7, sy: K * 0.7 * Math.max(0.01, g), r: gust * (18 + Math.sin(T * 5 + r.i) * 10) + (T ? Math.sin(T * 1.3 + r.i) * 2 : 0), o: on1 * (g > 0.01 ? 1 : 0) });
      });
      const wk = seg(t, 2.05, 2.95);
      pose(wind, { x: X(-60 + wk * 160), y: y1, s: K, o: on1 * bump(t, 2.05, 2.95) });
      // the courtier in silk; the fan sways; the silk glints
      pose(courtier, { x: X(-10), y: y2 + 104 * K, s: K, o: on2 });
      pose(fanBoy, { x: X(80), y: y2 + 104 * K, s: K, o: on2 });
      pose(fan, { x: X(92), y: y2 + 56 * K, s: K, r: -30 + (T ? Math.sin(T * 1.6) * 14 : 0), o: on2 });
      glints.forEach((g, i) => { const k = T ? (Math.sin(T * 2.4 + i * 2.1) * 0.5 + 0.5) : 0.6; pose(g, { x: X(-24 + i * 14), y: y2 + (22 + i * 20) * K, s: k * K, r: T * 30, o: on2 * bump(t, 3.2, 3.98) }); });

      S.cam.y = kf(t, [[0, 20], [0.9, 10], [1.2, -30]]);
      S.cam.z = kf(t, [[0, 1.06], [1.2, 1.04]]);
      S.cam.x = kf(t, [[0, 20], [0.9, 0]]);
    };
  },
};

/** Jesus teaching: facing the crowd on the left (turn), speaking, pointing up at the flat */
function jesus(T0, T, { x, turn, speak, point }) {
  T0.jesus.set({ x, y: TS.GY, s: 1.06, flip: turn, armF: 16 + speak * 30 * (1 - point) + point * 40, armB: 10 + point * 130, head: -point * 12, blink: blinkAt(T) });
  const [hx, hy] = headAt(x, TS.GY, 1.06, turn);
  T0.voice(hx, hy, speak * 0.8, T, { dir: turn ? -1 : 1, spread: 1.8 });
}
