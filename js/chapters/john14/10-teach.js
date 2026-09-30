// J 14,25–26 — the mission of the Spirit. "I have said these things to you while I am still with you": over the
// table a garland of small rolled scrolls hangs down — all the words of these years, tied up, not yet understood.
// "But the Advocate, the Holy Spirit, whom the Father will send in My name": a light opens above and the dove of
// light comes down, passing close by Him. "He will teach you all things and remind you of all that I said to you":
// the dove flies along the garland and every scroll it touches opens and shines — "I am the bread of life",
// "the light of the world", "the door", "the good shepherd", "the resurrection", "the way" — and small lights go
// from the words to the disciples' heads.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  nightRoom, seatEleven, sitAt, emptySeat, afterTable, EMPTY_X, garlandString, sayingScroll, rolledSaying, dove, flapWings,
  radiance, glowDisc, soulLight, kf, vis, headAt, tr, PI,
} from './lib.js';

const SAY = [
  [['Ja jestem', 'chlebem życia'], ['I am', 'the bread of life']],
  [['Ja jestem', 'światłością świata'], ['I am', 'the light of the world']],
  [['Ja jestem', 'bramą'], ['I am', 'the door']],
  [['Ja jestem', 'dobrym pasterzem'], ['I am', 'the good shepherd']],
  [['Ja jestem', 'zmartwychwstaniem'], ['I am', 'the resurrection']],
  [['Ja jestem', 'drogą'], ['I am', 'the way']],
];

export default {
  id: 'j14-teach',
  beats: [
    { v: 25 },
    { v: 26, text: 'A Pocieszyciel, Duch Święty, którego Ojciec pośle w moim imieniu,' },
    { v: 26, cont: true, text: 'On was wszystkiego nauczy i przypomni wam wszystko, co Ja wam powiedziałem.' },
  ],
  cam: { x: [-40, 40], y: [-80, 100], z: [0.98, 1.2] },
  build(S) {
    const c = S.c;
    const R = nightRoom(S);
    const { SEAT, TOP, FLOOR } = R;
    const hiL = S.layer({ par: 0.33, sh: 0, flat: true });
    const above = hiL.add(`<g>${glowDisc(200, 'halo-glow', 0.9)}<g transform="scale(.34)">${radiance(c, 150)}</g></g>`);
    // the garland of sayings
    const gL = S.layer({ par: 0.36, sh: 4, pad: 500 });
    gL.add(garlandString(c, 400, 1200, 300, 60));
    // phone: the six sayings hang closer together, in two rows, so none is cut by the screen edge
    const pts = SAY.map((_, i) => { const x = S.portrait ? 530 + i * 108 : 470 + i * 132; const u = (x - 400) / 800; return [x, 300 + Math.sin(u * PI) * 60]; });
    const scrolls = SAY.map(([pl, en], i) => {
      const [x, y] = pts[i];
      const dy = i % 2 ? (S.portrait ? 112 : 56) : 30;
      const rolled = gL.add(`<g><path d="M0 ${-dy}V-27" stroke="${C.rope}" stroke-width="1.4"/>${rolledSaying(c, 54)}</g>`);
      const open = gL.add(`<g><path d="M0 ${-dy}V-26" stroke="${C.rope}" stroke-width="1.4"/>${sayingScroll(c, tr(pl, en), { w: 138, size: 14 })}</g>`);
      return { i, x, y: y + dy, rolled, open };
    });

    const seatL = S.layer({ par: 0.52, sh: 5 });
    const at = seatEleven(S, seatL);
    seatL.add(`<g transform="translate(${EMPTY_X} ${TOP + 16})">${emptySeat(c)}</g>`);
    const J = at.find((m) => m.k === 'jesus');
    const others = at.filter((m) => m.k !== 'jesus');
    const tabL = S.layer({ par: 0.55, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${afterTable(c, 860)}</g>`);
    const fx = S.layer({ par: 0.58, sh: 4 });
    const minds = others.map(() => fx.add(`<g>${soulLight(c, 7)}</g>`));
    const doveL = S.layer({ par: 0.6, sh: 4 });
    const dv = doveL.add(`<g><circle r="46" fill="url(#halo-glow)"/>${dove(c)}</g>`);
    const bird = dv.querySelector('.bird');

    return (t, time) => {
      const T = time;
      R.update(T, 1);
      /* v25 — the garland of rolled words comes down */
      const gk = es(t, 0.08, 0.5, ease.out);
      gL.shift(0, -(1 - gk) * 500);
      gL.fade(gk > 0.001 ? 1 : 0);
      /* v26a — the light above; the dove comes down past Him */
      vis(above, { x: 800, y: 180, s: 0.7 + es(t, 1.05, 1.3) * 0.3, o: es(t, 1.05, 1.3) * (1 - es(t, 2.6, 2.9) * 0.5) });
      const d1 = es(t, 1.2, 1.75, ease.inOut);
      const sweep = seg(t, 2.05, 2.65);
      let dx = lerp(800, 860, d1), dy = lerp(170, 520, d1) - Math.sin(d1 * PI) * 30, face = 1;
      if (t > 1.75) { const u = es(t, 1.75, 2.05, ease.inOut); dx = lerp(860, 430, u); dy = lerp(520, 400, u) - Math.sin(u * PI) * 40; face = -1; }
      if (sweep > 0) { dx = lerp(430, 1190, ease.io(sweep)); dy = 390 + Math.sin(sweep * PI * 5) * 16; face = 1; }
      if (t > 2.65) { const u = es(t, 2.65, 2.9, ease.inOut); dx = lerp(1190, 1080, u); dy = lerp(390, 360, u); face = -1; }
      const dvo = es(t, 1.15, 1.3);
      vis(dv, { x: dx, y: dy + (T ? Math.sin(T * 2.2) * 3 : 0), s: 0.9, sx: face, o: dvo });
      if (dvo > 0.01) flapWings(bird, T || t * 3, 30, 7);
      /* v26b — each scroll the dove passes opens and shines; the words go to their minds */
      scrolls.forEach((sc) => {
        const k = es(t, 2.08 + ((sc.x - 430) / 760) * 0.55, 2.16 + ((sc.x - 430) / 760) * 0.55);
        const sw = T ? Math.sin(T * 0.9 + sc.i) * 2 : 0;
        pose(sc.rolled, { x: sc.x, y: sc.y, r: sw, s: 1 - k * 0.3, o: 1 - k });
        vis(sc.open, { x: sc.x, y: sc.y, r: sw, sx: 0.2 + k * 0.8, s: 1, o: k > 0.01 ? 1 : 0 });
      });
      others.forEach((m, i) => {
        const near = scrolls.reduce((a, b) => (Math.abs(b.x - m.x) < Math.abs(a.x - m.x) ? b : a));
        const k = es(t, 2.35 + ((near.x - 430) / 760) * 0.5, 2.6 + ((near.x - 430) / 760) * 0.5, ease.inOut);
        const [hx, hy] = headAt(m.x, SEAT, m.s, m.flip, 62);
        vis(minds[i], { x: lerp(near.x, hx, k), y: lerp(near.y + 20, hy - 40, k), s: 1, o: k > 0.01 ? 1 : 0 });
      });
      at.forEach((m) => {
        if (m.k === 'jesus') {
          sitAt(m, SEAT, T, { armF: 30 + bump(t, 0.1, 0.9) * 50, armB: 14 + bump(t, 0.1, 0.9) * 60 + bump(t, 1.1, 1.8) * 100, head: -bump(t, 1.1, 1.8) * 12 });
          return;
        }
        const up = es(t, 1.25, 1.5) * (1 - es(t, 2.9, 3));
        sitAt(m, SEAT, T, { head: -up * 12, flip: t > 2.1 && t < 2.9 ? (m.x > dx) : m.flip });
      });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 20], [1, 0], [1.4, -50], [2, -20], [3, -20]]);
      S.cam.z = kf(t, S.portrait ? [[0, 1.08], [1, 1.04], [2, 0.98], [3, 0.98]] : [[0, 1.08], [1, 1.04], [2, 1.02], [3, 1.06]]);
    };
  },
};
