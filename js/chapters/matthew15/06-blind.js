// Mt 15,14b–c — a painted flat, gently comic, the ground cut away like a stage trap: a dusty road over the hills, and
// under it the brown earth with a pit dug into it. A Pharisee with a band over his eyes leads the way, head held high,
// tapping with his stick; a blind man follows with a hand on his shoulder — "blind guides of the blind". "If the blind
// lead the blind, both fall into a pit": the guide steps over the edge and drops, the other after him; a puff of dust,
// the stick spins away, and there they sit in a heap at the bottom, little stars going round their heads.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, bush, rock, grass } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { pharisee, addToHead, blindBand, stick, BLIND, dust, kfLin, sparkle, PI } from './lib.js';

const GY = 566;                        // the road surface
const PIT = { x0: 820, x1: 1050, bot: 706 };
const PX = (PIT.x0 + PIT.x1) / 2;

export default {
  id: 'mt15-blind',
  enter: 'fly',
  beats: [
    { v: 14, cont: true, text: 'To są ślepi przewodnicy ślepych.' },
    { v: 14, cont: true, text: 'Lecz jeśli ślepy ślepego prowadzi, obaj w dół wpadną».' },
  ],
  cam: { x: [-40, 40], y: [-20, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#d8e3d8', '#f1e6c9', '#f7e6c6']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1150, y: 140, len: 700 });
    const cl = hanging(hangL, cloud(c, 160), { x: 720, y: 130, len: 700 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 380, amps: [26, 10, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.dune, 0.3) }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    const h2 = hillsWith(c, { y: 470, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.sand, 0.3), trees: 12, treeColor: C.olive, treeH: 20 });
    mid.add(h2.markup + rock(c, 340, h2.fn(340) + 10, 80, 30, C.rock2));

    /* ---------- the road and the earth cut away beneath it, with the pit ---------- */
    const G = S.layer({ par: 0.45, sh: 3 });
    const road = sheet();
    road.p(c.cut([[-900, GY - 22], [PIT.x0 + 4, GY - 22], [PIT.x0, GY + 14], [-900, GY + 14]], 0.8, 16) + c.cut([[PIT.x1 - 4, GY - 24], [2500, GY - 26], [2500, GY + 14], [PIT.x1, GY + 14]], 0.8, 16), mix(C.sand2, C.dune, 0.3));
    G.add(road.out() + grass(c, { x0: -700, x1: 2300, y: GY - 22, n: 40, h: 12, color: C.olive }));
    const earth = sheet();
    const EC = mix(C.soil, C.clay, 0.5);
    const pitPts = [[PIT.x0, GY - 20], [PIT.x0 + 8, PIT.bot - 30], [PIT.x0 + 30, PIT.bot], [PIT.x1 - 30, PIT.bot], [PIT.x1 - 8, PIT.bot - 30], [PIT.x1, GY - 20]];
    earth.p(c.cut([[-900, GY + 8], [2500, GY + 8], [2500, 1700], [-900, 1700]], 1, 20) + c.hole(pitPts.map(([x, y]) => [x, Math.max(y, GY + 10)]), 1.2, 8), EC);
    let strata = '', stones = '';
    for (let i = 0; i < 4; i++) strata += c.ribbon([[-900, GY + 40 + i * 44], [PIT.x0 - 4, GY + 40 + i * 44 + c.rr(-6, 6)]], 3) + c.ribbon([[PIT.x1 + 4, GY + 40 + i * 44 + c.rr(-6, 6)], [2500, GY + 40 + i * 44]], 3);
    for (let i = 0; i < 40; i++) { const x = c.rr(-700, 2300); if (x > PIT.x0 - 20 && x < PIT.x1 + 20) continue; stones += c.cut(c.blob(x, c.rr(GY + 30, 900), c.rr(6, 14), c.rr(4, 8), 8, 0.2), 0.3, 4); }
    earth.x(strata, shade(EC, -0.12), 'opacity=".6"');
    earth.p(stones, mix(C.rock2, EC, 0.4));
    let roots = '';
    for (let i = 0; i < 8; i++) { const x = c.rr(-500, 2100); if (x > PIT.x0 - 60 && x < PIT.x1 + 60) continue; roots += c.ribbon(c.qbez([x, GY + 12], [x + c.rr(-20, 20), GY + 40], [x + c.rr(-30, 30), GY + 70], 8), (u) => 3 - u * 2.4); }
    earth.x(roots, mix(C.soil, C.wood3, 0.3), 'opacity=".8"');
    G.add(earth.out());
    G.add(sheet().p(c.cut(pitPts, 1, 8), mix(C.soilDark, C.night2, 0.25)).out());

    /* ---------- the two ---------- */
    const L = S.layer({ par: 0.45, sh: 5 });
    const guide = S.puppet(L.add(addToHead(pharisee(c, 1, { eyes: 'closed', holdF: stick(c, 160) }), blindBand(c))));
    const b1 = S.puppet(L.add(addToHead(person(c, { ...BLIND, eyes: 'closed' }), blindBand(c))));
    const guideSit = S.puppet(L.add(addToHead(pharisee(c, 1, { eyes: 'closed', pose: 'sit' }), blindBand(c))));
    const b1Sit = S.puppet(L.add(addToHead(person(c, { ...BLIND, eyes: 'closed', pose: 'sit' }), blindBand(c))));
    const fx = S.layer({ par: 0.45, sh: 5 });
    const puff = fx.add(`<g>${dust(c, 34, C.sand2)}</g>`);
    const puff2 = fx.add(`<g>${dust(c, 26, C.sand)}</g>`);
    const spin = fx.add(`<g>${stick(c, 130)}</g>`);
    const stars = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${sparkle(c, 9, i % 2 ? C.star : C.halo)}</g>`) }));
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 1380, 900, 220, C.sage, C.moss) + bush(c, 150, 900, 230, C.moss, C.sage));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1150, 140, T, 1, 0.6);
      swing(cl, 720 + (T ? Math.sin(T * 0.1) * 20 : 0), 130, T, 1.2, 0.7, 1);

      /* v14b — the guide in front, proud, tapping; the blind man holding on behind */
      const tap = Math.max(0, Math.sin(t * 22));
      const GX = kfLin(t, [[-0.2, 400], [1.25, 846]]);
      const f1 = seg(t, 1.25, 1.42);
      guide.set({
        x: GX + f1 * 50, y: GY + ease.in(f1) * 150, s: 0.92, r: f1 * 35, walk: t < 1.25 ? GX * 0.05 : undefined, amt: 0.8,
        armF: 40 + tap * 10 + f1 * 90, armB: 20 + f1 * 140, head: -14 + f1 * 20, o: 1 - seg(t, 1.38, 1.42), blink: 0,
      });
      const X1 = kfLin(t, [[-0.2, 310], [1.25, 756], [1.4, 820]]);
      const f2 = seg(t, 1.4, 1.56);
      b1.set({ x: X1 + f2 * 60, y: GY + 6 + ease.in(f2) * 140, s: 0.9, r: f2 * 40, walk: t < 1.4 ? X1 * 0.05 + 1 : undefined, amt: 0.7, armF: 70 + f2 * 60, armB: 10 + f2 * 150, head: 6 - f2 * 10, lean: 6, o: 1 - seg(t, 1.52, 1.56), blink: 0 });

      /* v14c — both at the bottom of the pit, in a heap, dazed */
      const g = es(t, 1.38, 1.42), b = es(t, 1.52, 1.56);
      const daze = Math.sin(t * 14);
      guideSit.set({ x: PX - 52, y: PIT.bot - 2, s: 0.86, r: -6, armF: 60 + daze * 10, armB: 130, head: 14 + daze * 6, lean: -6, o: g, blink: 0 });
      b1Sit.set({ x: PX + 56, y: PIT.bot + 2, s: 0.84, flip: true, r: 8, armF: 40, armB: 150 - daze * 10, head: 18 - daze * 6, lean: 10, o: b, blink: 0 });
      const pk = seg(t, 1.38, 1.8);
      pose(puff, { x: PX - 10, y: GY - 10 - pk * 40, s: 0.5 + pk * 1.1, o: Math.sin(pk * PI) * 0.95 });
      const pk2 = seg(t, 1.52, 1.95);
      pose(puff2, { x: PX + 50, y: GY - 6 - pk2 * 30, s: 0.5 + pk2, o: Math.sin(pk2 * PI) * 0.9 });
      const sk = seg(t, 1.36, 1.72);
      pose(spin, { x: PX + 60 + sk * 140, y: GY - 60 - Math.sin(sk * PI) * 160 + sk * 70, r: sk * 540, o: sk > 0 && sk < 1 ? 1 : 0 });
      stars.forEach((st) => {
        const who = st.i < 3 ? [PX - 50, PIT.bot - 116] : [PX + 52, PIT.bot - 114];
        const a = (T ? T * 2.2 : 0) + (st.i % 3) * (PI * 2 / 3);
        const on = es(t, st.i < 3 ? 1.5 : 1.62, st.i < 3 ? 1.6 : 1.72);
        pose(st.el, { x: who[0] + Math.cos(a) * 26, y: who[1] + Math.sin(a) * 8, s: 0.8, o: on });
      });

      S.cam.x = lerp(-30, 30, es(t, 0.1, 1.2));
      S.cam.z = 1.02 + es(t, 1.1, 1.5) * 0.06;
      S.cam.y = 10 + es(t, 1.1, 1.5) * 30;
    };
  },
};
