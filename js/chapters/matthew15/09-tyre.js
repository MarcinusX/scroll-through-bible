// Mt 15,21–22 — beyond Galilee: the rosy coast of Tyre and Sidon, snow on the Lebanon, Tyre on its island with its
// purple-sailed ships, purple dye-cloths drying by the road. Jesus comes along the coast road with His disciples past
// the signpost. A woman runs out of a house on the right — a Canaanite, in the purple of Tyre — and cries out after
// Him with her arms up: "Have mercy on me, Lord, Son of David!" Over her comes a hanging picture of what she carries in
// her heart: her little girl in bed at home, a grey storm of a spirit over her.
import { C, person, CAST, blinkAt, pose, lerp, clamp, hanging, sheet, shade, mix } from '../kit.js';
import { bush, rock } from '../../assets/nature.js';
import { bed } from '../../assets/things.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { coastSet, tyreHouse, dyeLine, vat, signpost, woman, L7, spiritCloud, plate, bubble, cry, voiceRings, headAt, kf, moving, ship, tr, PI } from './lib.js';

const GY = 700;
const DOOR = 1150;
const JX = 760;

export default {
  id: 'mt15-tyre',
  beats: [
    { v: 21 },
    { v: 22, text: 'A oto kobieta kananejska, wyszedłszy z tamtych okolic, wołała:' },
    { v: 22, cont: true, text: '«Ulituj się nade mną, Panie, Synu Dawida!' },
    { v: 22, cont: true, text: 'Moja córka jest ciężko dręczona przez złego ducha».' },
  ],
  cam: { x: [-500, 60], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const set = coastSet(S, { gy: GY });
    const c = set.c;
    const ships = [[880, 470, 0.3], [1480, 458, 0.24]].map(([x, y, s], i) => ({ i, x, y, s, el: set.seaL.add(`<g>${ship(c, 200)}</g>`) }));

    /* ---------- the road: dye-lines, vats, the signpost, the woman's house ---------- */
    const road = S.layer({ par: 0.5, sh: 4 });
    road.add(dyeLine(c, -300, -80, 560, GY - 10) + dyeLine(c, 330, 520, 570, GY - 10));
    road.add(`<g transform="translate(250 ${GY - 4})">${vat(c)}</g><g transform="translate(-160 ${GY - 4})">${vat(c, 0.8)}</g>`);
    road.add(`<g transform="translate(${DOOR} ${GY - 2})">${tyreHouse(c, 260, 200)}</g>`);
    road.add(`<g transform="translate(560 ${GY})">${signpost(c, tr('Tyr · Sydon', 'Tyre · Sidon'), { size: 18 })}</g>`);

    /* ---------- the walkers, the woman ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = [CAST.john, CAST.james, CAST.andrew, CAST.peter].map((o, i) => ({ i, off: -250 + i * 56, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, o))) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const W = S.puppet(L.add(woman(c)));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const plea = fx.add(`<g>${cry(c, [tr('Ulituj się nade mną, Panie,', 'Have mercy on me, Lord,'), tr('Synu Dawida!', 'son of David!')], { size: 21, dir: 1, fill: mix(C.plumRobe, C.night2, 0.45) })}</g>`);
    const rings = voiceRings(fx, c, { n: 3, r: 30, color: mix(C.plumRobe, C.cream, 0.3) });
    const girl = person(c, { ...L7.girl, eyes: 'closed' });
    const pic = hanging(fx, `<g>${plate(c, `<g transform="translate(0 34) scale(.72)">${bed(c, 200)}</g><g transform="translate(30 -4) rotate(-90) scale(.46)">${girl}</g><g transform="translate(-6 -40)">${spiritCloud(c)}</g>`, { r: 88, fill: mix(C.cream, C.lavender, 0.2) })}</g>`, { x: 1000, y: 270, len: 800 });

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, -700, 890, 220, C.sage, C.moss) + bush(c, 1400, 890, 220, C.moss, C.sage) + rock(c, 300, 910, 170, 60, C.rock2));

    return (t, time) => {
      const T = time;
      set.update(T);
      ships.forEach((s) => pose(s.el, { x: s.x + (T ? Math.sin(T * 0.05 + s.i) * 30 : 0) + t * 10, y: s.y + (T ? Math.sin(T * 1.1 + s.i) * 2 : 0), s: s.s, r: T ? Math.sin(T * 1.2 + s.i) * 2 : 0 }));

      /* v21 — along the coast road into the region of Tyre and Sidon */
      const JK = [[-0.1, -420], [0.9, JX]];
      const jx = kf(t, JK, (u) => u);
      const turn = es(t, 1.2, 1.4);
      jesus.set({ x: jx, y: GY, s: 0.96, flip: false, walk: moving(t, JK) ? jx * 0.05 : undefined, armF: 14 + bump(t, 1.2, 1.9) * 10, head: turn * 6, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const x = jx + d.off + (d.i % 2) * 8;
        const look = es(t, 1.2 + d.i * 0.05, 1.45 + d.i * 0.05);
        d.p.set({ x, y: GY + (d.i % 2 ? 8 : -4), s: 0.9, walk: moving(t, JK) ? x * 0.05 + d.i : undefined, armF: 10 + look * (d.i === 3 ? 40 : 0), head: -look * 4, blink: blinkAt(T, d.seed) });
      });

      /* v22a — the Canaanite woman comes out and cries */
      const WK = [[1.05, DOOR], [1.5, 960]];
      const wx = kf(t, WK);
      const out = es(t, 1.0, 1.1);
      const up = es(t, 1.45, 1.6);
      const beg = es(t, 2.9, 3.1);
      W.set({
        x: wx, y: GY + 2, s: 0.94, flip: true, o: out, walk: moving(t, WK) ? wx * 0.06 : undefined,
        armF: 20 + up * (80 + Math.sin(t * 24) * 10) * (1 - beg * 0.4), armB: 10 + up * 150 * (1 - beg * 0.5), head: -up * 14 + beg * 16, lean: -up * 6 + beg * 6, blink: blinkAt(T, 3),
      });
      const [hx, hy] = headAt(wx, GY + 2, 0.94, true);
      rings(hx - 8, hy + 4, up * (1 - beg * 0.7), T, { dir: -1 });

      /* v22b — "Have mercy on me, Lord, Son of David!" */
      const pk = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(plea, { x: hx - 30, y: hy - 30, s: pk, o: pk > 0.02 ? 1 : 0 });

      /* v22c — "My daughter is severely possessed by a demon": her daughter at home, the grey spirit over her */
      const ik = es(t, 3.0, 3.35, ease.out);
      pose(pic, { x: 1000, y: 280 - (1 - ik) * 1150, r: T ? Math.sin(T * 0.8) * 1.2 : 0 });

      /* camera: follow the road, then between Jesus and the woman */
      const follow = clamp((jx - 800) / 0.5, -500, 0);
      S.cam.x = t < 1 ? follow : lerp(follow, 50, es(t, 1.0, 1.6));
      S.cam.y = es(t, 1.0, 1.6) * 10 - es(t, 2.9, 3.3) * 30;
      S.cam.z = 1 + es(t, 1.0, 1.6) * 0.06;
    };
  },
};
