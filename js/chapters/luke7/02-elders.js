// Łk 7,4–5 — the three elders of Capernaum come down the street to Jesus. The eldest kneels, the others open their
// hands: "He is worthy that you should do this for him." Why? A painted flat comes down over the street: the
// centurion among the people of the town, a warm heart over him — "he loves our nation" — and beside him the
// synagogue of Capernaum rising stone by stone, its columns and its gable set in place — "he built it for us himself".
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  capStreet, HOUSE, ELDERS, KID_LOOKS, centurion, flat, flatSky, flatHills, fig, womanO, manO, heart, bubble, headAt, voiceRings, kf, moving, dropK, tr, PI,
} from './lib.js';

const FEET = HOUSE.FEET, JX = 540;
const FX = 800, FY = 270, W = 380, H = 230, K = 1.1;
const X = (dx) => FX + dx * K;
const kidO = () => ({ ...KID_LOOKS[2] });

export default {
  id: 'lk7-elders',
  beats: [
    { v: 4 },
    { v: 5 },
  ],
  cam: { x: [-40, 40], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const st = capStreet(S);
    const c = st.c;
    const H0 = st.addFront();

    const P = S.layer({ par: 0.4, sh: 5 });
    const DIS = [CAST.peter, CAST.john, CAST.andrew].map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const eld = ELDERS.map((o, i) => ({ i, st: S.puppet(P.add(person(c, o))), kn: i === 0 ? S.puppet(P.add(person(c, { ...o, pose: 'kneel' }))) : null, seed: c.rr(0, 9) }));
    const talk = voiceRings(P, c, { n: 2, color: C.clay, r: 26, w: 4 });
    const W1 = S.layer({ par: 0.42, sh: 3 });
    const worthy = W1.add(`<g opacity="0">${bubble(c, [tr('Godzien jest,', 'He is worthy'), tr('żebyś mu to wyświadczył', 'for you to do this for him')], { size: 20, dir: 1 })}</g>`);

    /* ---------- the painted flat: the centurion, his heart for the town, the synagogue he built ---------- */
    const FL = S.layer({ par: 0.3, sh: 6 });
    const bits = S.layer({ par: 0.3, sh: 5 });
    const people = fig(c, womanO(c), -168, 112, 0.4) + fig(c, manO(c), -142, 116, 0.42) + fig(c, kidO(c), -150, 118, 0.3);
    const fl = FL.add(flat(S, flatSky(S, W, H, [mix(C.skyBlue, C.cream, 0.2), mix(C.dawn, C.cream, 0.5)]) + flatHills(c, W, 60, mix(C.hillMid, C.sage2, 0.3), 6)
      + `<path d="${c.cut([[-W / 2 - 4, 88], [W / 2 + 4, 86], [W / 2 + 4, H / 2 + 4], [-W / 2 - 4, H / 2 + 4]], 0.5, 8)}" fill="${mix(C.sand, C.stone, 0.3)}"/>` + people, { w: W, h: H }));
    const cen = bits.add(`<g><g transform="scale(.46)">${centurion(c)}</g></g>`);
    const love = bits.add(`<g>${heart(c, 16)}</g>`);
    // the synagogue in pieces (flat coords, drawn around its own origin; they drop into place)
    const SC = [40, 110];   // synagogue foot in flat coords
    const wallC = mix(C.stone, C.cream, 0.3), wallD = shade(wallC, -0.1);
    const piece = (m) => bits.add(`<g>${m}</g>`);
    const base = piece(sheet().p(c.cut(c.rect(-86, -10, 172, 12), 0.3, 6), C.stone2).out());
    const rows = [0, 1, 2].map((r) => {
      const s = sheet();
      let d = '';
      for (let x = -76 + (r % 2) * 14; x < 70; x += 30) d += c.cut(c.rect(x, -18, 27, 16), 0.3, 4);
      s.p(d, r % 2 ? wallD : wallC);
      return piece(s.out());
    });
    const cols = piece(sheet().p([-60, -30, 30, 60].map((x) => c.cut(c.rect(x - 6, -70, 12, 70), 0.3, 4)).join(''), C.cream).p(c.cut([[-18, 0], [-18, -46], ...c.arc(0, -46, 18, 16, PI, 2 * PI, 8), [18, 0]], 0.3, 4), C.soilDark).out());
    const roof = piece(sheet().p(c.cut([[-92, 0], [0, -40], [92, 0]], 0.3, 5), C.plaster).p(c.cut(c.rect(-94, -2, 188, 8), 0.3, 5), C.stone2).p(c.cut(c.star(0, -18, 9, 4, 6, 0), 0.2, 3), C.sun).out());

    return (t, time) => {
      const T = time;
      st.update(T);
      pose(H0.dark, { o: 1 });

      /* v4 — the elders come and beg Him earnestly */
      jesus.set({ x: JX, y: FEET, s: 1.04, armF: 14 + es(t, 1.3, 1.6) * 20, armB: 8, head: es(t, 1.0, 1.3) * -10 + es(t, 0.4, 0.6) * 4, blink: blinkAt(T) });
      DIS.forEach((d) => d.p.set({ x: JX - 110 - d.i * 84, y: FEET + (d.i % 2 ? 8 : -2), s: 0.98, armF: 12, head: -es(t, 1.0, 1.3) * 8, blink: blinkAt(T, d.seed) }));
      const kneel = es(t, 0.36, 0.42);
      eld.forEach((e) => {
        const tx = [690, 790, 880][e.i];
        const KX = [[0, 1120 + e.i * 90], [0.34 + e.i * 0.03, tx]];
        const x = kf(t, KX);
        const beg = es(t, 0.38, 0.55) * (1 - es(t, 1.0, 1.2) * 0.6);
        const look = es(t, 1.0, 1.3);
        e.st.set({ x, y: FEET - 2 + (e.i % 2) * 8, s: 0.98, flip: true, o: e.kn ? 1 - kneel : 1, walk: moving(t, KX) ? x * 0.05 + e.i : undefined, armF: 14 + beg * (e.i === 1 ? 70 : 50), armB: 8 + beg * (e.i === 1 ? 110 : 40), lean: beg * 6, head: beg * 8 - look * 14, blink: blinkAt(T, e.seed) });
        if (e.kn) e.kn.set({ x: tx, y: FEET - 2, s: 0.98, flip: true, o: kneel, armF: 80 - look * 20, armB: 100, head: 10 - look * 22, lean: 6, blink: blinkAt(T, e.seed) });
      });
      const [ehx, ehy] = headAt(790, FEET + 6, 0.98, true);
      talk(ehx, ehy, bump(t, 0.4, 1.9) > 0 ? 0.8 * (t < 1.95 ? 1 : 0) : 0, T, { dir: -1, spread: 1.8 });
      const wb = es(t, 0.45, 0.58, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(worthy, { x: ehx - 20, y: ehy - 40, s: wb, o: wb > 0.02 ? 1 : 0 });

      /* v5 — "he loves our nation, and he built our synagogue himself" */
      const k = dropK(t, 0.98, 2.4, 0.26);
      const fy = lerp(-1500, FY, k);
      const on = k > 0.002 ? 1 : 0;
      pose(fl, { x: FX, y: fy, s: K, o: on });
      const Y = (dy) => fy + dy * K;
      pose(cen, { x: X(-104), y: Y(114), o: on });
      const hk = es(t, 1.12, 1.3, ease.back);
      pose(love, { x: X(-104), y: Y(-8) + (T ? Math.sin(T * 2) * 3 : 0), s: hk * (1 + (T ? Math.sin(T * 3) * 0.05 : 0)), o: on * (hk > 0.02 ? 1 : 0) });
      const drop = (el, a, dy, i = 0) => { const u = es(t, a, a + 0.12, ease.out); pose(el, { x: X(SC[0]), y: Y(SC[1] + dy) - (1 - u) * 220, s: K, o: on * (u > 0.01 ? 1 : 0) }); };
      drop(base, 1.3, 0);
      rows.forEach((r, i) => drop(r, 1.38 + i * 0.07, -10 - i * 16));
      drop(cols, 1.58, -58);
      drop(roof, 1.66, -126);

      S.cam.x = kf(t, [[0, 10], [0.9, -10], [1.3, 0]]);
      S.cam.y = kf(t, [[0, 20], [0.9, 20], [1.2, -20]]);
      S.cam.z = kf(t, [[0, 1.08], [0.9, 1.1], [1.2, 1.04]]);
    };
  },
};
