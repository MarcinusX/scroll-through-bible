// Mt 15,23–24 — further along the coast road, the sun lower. Jesus walks on and answers her not a word; she follows
// behind, crying out, her jagged cries flying after them. The disciples come up to Him — Peter points back at her, John
// covers his ears: "Send her away, for she cries after us!" Jesus stops: "I was sent only to the lost sheep of the house
// of Israel" — a painted board of the hills of Israel comes down, sheep scattered and lost among the rocks, and they
// come together round a shepherd's crook in a warm light.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { bush, rock } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { coastSet, COAST2, tyreHouse, dyeLine, woman, cry, bubble, voiceRings, headAt, kf, moving, sheep, sheepBoard, crook, ship, tr, PI } from './lib.js';

const GY = 700;
const BW = 540, BH = 250, BY = 110;

export default {
  id: 'mt15-silence',
  beats: [
    { v: 23, text: 'Lecz On nie odezwał się do niej ani słowem.' },
    { v: 23, cont: true, text: 'Na to podeszli Jego uczniowie i prosili Go: «Odpraw ją, bo krzyczy za nami!»' },
    { v: 24 },
  ],
  cam: { x: [-60, 60], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    const set = coastSet(S, { gy: GY, skyCols: COAST2, sky2: ['#ab9cc6', '#ecbca6', '#f4d4b6'], city: 700 });
    const c = set.c;
    const shipEl = set.seaL.add(`<g>${ship(c, 200)}</g>`);

    const road = S.layer({ par: 0.5, sh: 4 });
    road.add(dyeLine(c, 1180, 1400, 570, GY - 10) + dyeLine(c, -200, 20, 560, GY - 10));
    road.add(`<g transform="translate(180 ${GY - 2})">${tyreHouse(c, 240, 190)}</g>`);

    /* ---------- walkers ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const W = S.puppet(L.add(woman(c)));
    const DIS = [
      { o: CAST.thomas, dx: -170, dy: -6 }, { o: CAST.james, dx: -118, dy: 6 }, { o: CAST.andrew, dx: 108, dy: -8 },
      { o: CAST.john, dx: -60, dy: 10 }, { o: CAST.peter, dx: 64, dy: 6 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, d.o))) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const cries = [0, 1, 2].map((i) => fx.add(`<g>${cry(c, i === 1 ? tr('Panie!', 'Lord!') : tr('Ulituj się!', 'Have mercy!'), { size: 18, dir: 1, fill: mix(C.plumRobe, C.night2, 0.45) })}</g>`));
    const quiet = fx.add(`<g>${sheet().x(c.poly(c.circ(-10, 0, 3, 8)) + c.poly(c.circ(0, 0, 3, 8)) + c.poly(c.circ(10, 0, 3, 8)), C.inkSoft, 'opacity=".5"').out()}</g>`);
    const send = fx.add(`<g>${bubble(c, tr('Odpraw ją!', 'Send her away!'), { size: 22, dir: -1 })}</g>`);
    const rings = voiceRings(fx, c, { n: 3, r: 28, color: mix(C.plumRobe, C.cream, 0.3) });

    /* ---------- the board of the lost sheep ---------- */
    const bL = S.layer({ par: 0.5, sh: 6 });
    const board = bL.add(`<g>${sheepBoard(c, BW, BH)}</g>`);
    const SH = [[-210, 120], [-150, 196], [-60, 150], [30, 214], [120, 128], [170, 190], [230, 150]].map(([x, y], i) => ({
      i, x, y, to: [-60 + (i % 4) * 40 - (i > 3 ? 20 : 0), 216 - (i > 3 ? 16 : 0)], el: bL.add(`<g>${sheep(c)}</g>`), flip: x > 0,
    }));
    const glow = bL.add(`<g><ellipse rx="190" ry="80" fill="url(#halo-glow)"/></g>`);
    const crookEl = bL.add(`<g>${crook(c, 150)}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, -600, 890, 220, C.sage, C.moss) + bush(c, 1420, 890, 220, C.moss, C.sage) + rock(c, 1150, 910, 170, 60, C.rock2));

    return (t, time) => {
      const T = time;
      set.update(T);
      pose(shipEl, { x: 1300 + t * 20, y: 462, s: 0.28, r: T ? Math.sin(T * 1.2) * 2 : 0 });
      const glowSky = es(t, 0, 3) * 0.6;
      set.sk2 && set.sk2.fade(glowSky);

      /* v23a — He walks on and answers not a word; she follows, crying out */
      const JK = [[-0.2, 660], [1.9, 860]];
      const jx = kf(t, JK, (u) => u);
      const stop = t > 1.9;
      const turn = es(t, 2.0, 2.15);
      const speak = es(t, 2.1, 2.3);
      jesus.set({ x: jx, y: GY, s: 1.0, flip: turn > 0.5, walk: !stop ? jx * 0.05 : undefined, armF: 14 + speak * 30, armB: 8 + speak * 110 * es(t, 2.2, 2.4), head: 4 - speak * 10, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(jx, GY, 1.0, false);
      const qk = es(t, 0.3, 0.5) * (1 - es(t, 0.95, 1.1));
      pose(quiet, { x: jhx + 40, y: jhy - 34, s: qk, o: qk });
      DIS.forEach((d) => {
        let x = jx + d.dx;
        const up = d.i === 4 ? es(t, 1.05, 1.3) : 0;
        if (d.i === 4) x += up * -20;
        const cover = d.i === 3 ? bump(t, 0.4, 1.95) : 0;
        const point = d.i === 4 ? bump(t, 1.1, 1.95) : 0;
        const look = d.i < 2 ? bump(t, 0.3, 1.9) : 0;
        d.p.set({ x, y: GY + d.dy, s: 0.9, flip: point > 0.3 || look > 0.5 ? true : turn > 0.5 && d.dx > 0, walk: !stop ? x * 0.05 + d.i : undefined, armF: 10 + point * 80 + cover * 150, armB: cover * 160 + point * 30, head: cover * 10 - look * 6 + (turn > 0.5 ? 4 : 0), blink: blinkAt(T, d.seed) });
      });
      const WK = [[-0.2, 330], [1.9, 560]];
      const wx = kf(t, WK, (u) => u);
      const hush = es(t, 2.05, 2.3);
      W.set({ x: wx, y: GY + 4, s: 0.94, walk: t < 1.9 ? wx * 0.06 : undefined, armF: 30 + (60 + Math.sin(t * 24) * 12) * (1 - hush * 0.5), armB: 20 + 140 * (1 - hush * 0.6), head: -14 + hush * 10, lean: -4, blink: blinkAt(T, 3) });
      const [whx, why] = headAt(wx, GY + 4, 0.94, false);
      rings(whx + 8, why + 4, 1 - hush, T, { dir: 1 });
      cries.forEach((cr, i) => {
        const k = T ? (T * 0.35 + i / 3) % 1 : (i + 0.5) / 3;
        const on = 1 - es(t, 1.9, 2.1);
        pose(cr, { x: whx + 40 + k * 160, y: why - 50 - k * 60 + i * 10, s: 0.6 + k * 0.3, r: -6 + k * 10, o: on * Math.sin(k * PI) });
      });

      /* v23b — "Send her away, for she cries after us!" */
      const [phx, phy] = headAt(jx + 64 - 20, GY + 6, 0.9, true);
      const sk = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(send, { x: phx + 16, y: phy - 30, s: sk, o: sk > 0.02 ? 1 : 0 });

      /* v24 — the lost sheep of the house of Israel */
      const bk = es(t, 2.05, 2.4, ease.out);
      const by = BY - (1 - bk) * 1150 + (T ? Math.sin(T * 0.8) * 2 : 0);
      pose(board, { x: 800, y: by });
      const gather = es(t, 2.45, 2.72);
      SH.forEach((s) => {
        const k = es(t, 2.45 + s.i * 0.02, 2.72 + s.i * 0.02);
        const x = lerp(s.x, s.to[0], k), y = lerp(s.y, s.to[1], k);
        pose(s.el, { x: 800 + x, y: by + y - Math.abs(Math.sin(k * PI * 3)) * 6, s: 0.8, sx: (k > 0.5 ? (s.to[0] > s.x ? 1 : -1) : s.flip ? -1 : 1) });
      });
      pose(glow, { x: 800, y: by + 200, o: gather });
      pose(crookEl, { x: 800 + 60, y: by + 150, r: 10, o: es(t, 2.35, 2.5) });

      S.cam.x = lerp(-40, 20, es(t, 0, 1.9));
      S.cam.y = -es(t, 2.0, 2.4) * 40;
      S.cam.z = 1.04 - es(t, 2.0, 2.4) * 0.04;
    };
  },
};
