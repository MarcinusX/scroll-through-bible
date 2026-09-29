// Łk 21,12–13 — "But before all these things": a lit shadow-play screen comes down over the court, and on it the
// story of a disciple of His. "They will lay their hands on you and persecute you": he walks along with his small
// lamp, and two guards come in from either side and seize him. "Delivering you up to synagogues and prisons, bringing
// you before kings and governors for my name's sake": they lead him on past the arched door of a synagogue with its
// lamp, past the bars of a prison, and bring him before a crowned king with his sceptre and a governor's standard behind. "It
// will turn out as a testimony for you": he stands up before the throne and holds out his little flame; the screen
// warms, the guards lower their spears and the king leans forward to listen.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  templeTeach, TT, flat, silP, WITNESS, soldierSil, eagleStandard, bars, headAt, handAt, warm,
  es, ease, bump, seg, tr, PI,
} from './lib.js';

const { GY, JX, JS } = TT;
const INK = '#3b2a22';
const SW = 580, SH = 270, SX = 800, SY = 300;   // the screen (centre)
const G = SY + 112;                             // its ground line
const SS = 0.56;                                // silhouettes' scale

export default {
  id: 'lk21-hands',
  beats: [
    { v: 12, text: 'Lecz przed tym wszystkim podniosą na was ręce i będą was prześladować.' },
    { v: 12, cont: true, text: 'Wydadzą was do synagog i do więzień oraz z powodu mojego imienia wlec was będą do królów i namiestników.' },
    { v: 13 },
  ],
  cam: { x: [-20, 20], y: [-50, 30], z: [1, 1.08] },
  build(S) {
    const T0 = templeTeach(S);
    const c = S.c;
    const B = T0.bits;
    const warmId = S.id('scr');
    S.defs(`<radialGradient id="${warmId}"><stop offset="0" stop-color="#fff1cf"/><stop offset="1" stop-color="#f3dcae"/></radialGradient>`);
    const screenEl = T0.FL.add(flat(S, `<rect x="${-SW / 2}" y="${-SH / 2}" width="${SW}" height="${SH}" fill="url(#${warmId})"/>`, { w: SW, h: SH, face: '#f6e4c0', rim: C.wood3, frame: C.wood2 }));
    const warmEl = T0.FL.add(`<g><rect x="${-SW / 2}" y="${-SH / 2}" width="${SW}" height="${SH}" fill="${C.lampGlow}" opacity=".35"/><ellipse cx="60" cy="10" rx="200" ry="110" fill="url(#warm-glow)" opacity=".8"/></g>`);
    // the places (silhouettes on the screen)
    const synagogue = sheet().p(c.cut([[-60, 0], [-60, -120], [-36, -150], [36, -150], [60, -120], [60, 0]], 0.5, 6) + c.hole([[-22, 0], [-22, -70], ...c.arc(0, -70, 22, 22, PI, 2 * PI, 10), [22, 0]], 0.4, 5), INK).p(c.cut([[-70, -150], [70, -150], [60, -164], [-60, -164]], 0.4, 5), INK).out() + `<g transform="translate(0 -104)"><path d="M0 0C-4 -4 -4 -10 0 -16C4 -10 4 -4 0 0Z" fill="${C.lampFlame}"/></g>`;
    const places = [
      { x: 600, m: synagogue },
      { x: 780, m: `<g transform="translate(-45 -150)">${bars(c, 90, 110, INK)}</g>${sheet().p(c.cut(c.rect(-64, -164, 128, 20), 0.4, 6) + c.cut(c.rect(-64, -40, 128, 40), 0.4, 6), INK).out()}` },
      { x: 1030, m: `<g transform="translate(46 0) scale(.66)">${eagleStandard(c, 300).replace(/fill="#[0-9a-fA-F]{6}"/g, `fill="${INK}"`)}</g>${sheet().p(c.cut(c.rect(-50, -14, 90, 14), 0.4, 5) + c.cut([[-40, -14], [-40, -150], [-30, -150], [-30, -14]], 0.3, 5), INK).out()}` },
    ].map((p, i) => ({ ...p, i, el: B.add(`<g>${p.m}</g>`) }));
    const king = S.puppet(B.add(silP(c, { robe: INK, mantle: INK, hairStyle: 'short', beard: 'full', holdF: sheet().p(c.cut(c.rect(-2, -70, 4, 110), 0.2, 5) + c.cut(c.circ(0, -74, 7, 10), 0.2, 3), INK).out() }, INK)));
    const kingCrown = B.add(`<g>${sheet().p(c.cut([[-17, -12], [17, -12], [18, -22], [12, -30], [8, -21], [4, -34], [-1, -22], [-6, -33], [-10, -21], [-14, -30], [-19, -22]], 0.3, 3), INK).out()}</g>`);
    const wit = S.puppet(B.add(silP(c, WITNESS, INK)));
    const guards = [0, 1].map((i) => ({ i, p: S.puppet(B.add(soldierSil(c, i, { col: INK }))) }));
    const flame = B.add(`<g>${warm(26, 0.9)}<path d="M0 0C-5 -5 -5 -13 0 -21C5 -13 5 -5 0 0Z" fill="${C.lampFlame}"/><path d="M0 -3C-2 -6 -2 -9 0 -13C2 -9 2 -6 0 -3Z" fill="#fff4d2"/></g>`);

    return (t, time) => {
      const T = time;
      T0.update(t, T, { look: es(t, 0.1, 0.4) });

      /* Jesus tells it */
      const sp = es(t, 0.02, 0.2);
      T0.jesus.set({ x: JX, y: GY, s: JS, armF: 20 + sp * 60 + es(t, 2.05, 2.3) * 30, armB: 10 + bump(t, 0.05, 0.9) * 60 + es(t, 2.05, 2.3) * 80, head: -sp * 8, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, JS, false);
      T0.voice(hx, hy, sp * 0.7, T, { spread: 1.8 });

      /* the screen */
      const kS = es(t, 0.0, 0.25, ease.out);
      const sy = lerp(-1300, SY, kS), on = kS > 0.002 ? 1 : 0;
      pose(screenEl, { x: SX, y: sy, o: on });
      pose(warmEl, { x: SX, y: sy, o: on * es(t, 2.1, 2.5) });
      const gy = G + (sy - SY);

      /* the places appear as he is led past them (v12b) */
      places.forEach((p) => {
        const k = es(t, 1.02 + p.i * 0.22, 1.2 + p.i * 0.22);
        pose(p.el, { x: p.x, y: gy, s: 1, o: on * k });
      });
      const kk = es(t, 1.5, 1.7);
      const lean = es(t, 2.2, 2.5);
      king.set({ x: 1024, y: gy - 14, s: SS * 1.08, flip: true, o: on * kk, armF: 40 - lean * 20, armB: lean * 60, head: lean * 10, lean: lean * 6 });
      const [kx, ky] = headAt(1024, gy - 14, SS * 1.08, true);
      pose(kingCrown, { x: kx - lean * 4, y: ky - 20 * SS * 1.08 + lean * 2, s: SS * 1.3, r: -lean * 10, o: on * kk });

      /* the disciple: walks (v12a), seized, led along (v12b), stands and holds up his flame (v13) */
      const walk1 = es(t, 0.15, 0.55, (u) => u);
      const lead = es(t, 1.05, 1.9, (u) => u);
      const wx = lead > 0 ? lerp(600, 866, lead) : lerp(540, 600, walk1);
      const stand = es(t, 2.05, 2.3);
      const seized = es(t, 0.5, 0.62);
      const walking = (walk1 > 0 && walk1 < 1) || (lead > 0 && lead < 1);
      wit.set({ x: wx, y: gy, s: SS, flip: false, o: on, walk: walking ? wx * 0.08 : undefined, amt: 0.7, head: seized * (1 - stand) * 10 - stand * 6, lean: seized * (1 - stand) * 8, armF: 40 * (1 - seized) + stand * 70, armB: seized * (1 - stand) * 20, blink: 0 });
      const [fx0, fy0] = handAt(wx, gy, SS, false, 40 * (1 - seized) + stand * 70);
      pose(flame, { x: fx0 + 2, y: fy0 - 4, s: 0.9 + stand * 0.5 + (T ? Math.sin(T * 7) * 0.05 : 0), o: on * (1 - seized * (1 - stand)) });
      guards.forEach((g) => {
        const inG = es(t, 0.35 + g.i * 0.05, 0.62 + g.i * 0.05);
        const side = g.i ? 1 : -1;
        const gx = lerp(side < 0 ? 525 : 1060, wx + side * 46, inG);
        const back = stand;
        g.p.set({ x: gx + (side < 0 ? -back * 30 : -back * 8), y: gy, s: SS, flip: side > 0, o: on * es(t, 0.33 + g.i * 0.05, 0.38 + g.i * 0.05), walk: (inG > 0 && inG < 1) || walking ? gx * 0.08 : undefined, armF: inG * 90 * (1 - back) + back * 10, armB: 10, head: back * 10, blink: 0 });
      });

      S.cam.y = -es(t, 0.0, 0.5) * 30;
      S.cam.z = 1 + es(t, 0.0, 0.5) * 0.04;
      void mix; void shade; void seg; void tr; void blinkAt;
    };
  },
};
