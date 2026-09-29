// Mt 27,66 — the garden and the tomb in the rock again, in the grey light of the Sabbath. The chief priests come
// with the guard: a cord is stretched across the great stone and a red seal pressed on it — Pilate's eagle; the
// soldiers take their places at the door with their spears. The priests go away satisfied; the guard stands, and
// the stone stays shut — with a faint light still waiting behind it.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, olive, cypress, rock, grass } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import { tombStone } from '../mark6/lib.js';
import { kf, moving, hand, priest, soldier, sealCord, waxSeal, skullHill, crossSil, MT, PI } from './lib.js';

const GY = 694;
const DX = 1080, DB = 650, DW = 100, DH = 146;     // the tomb door
const SR = 76;                                     // the stone

export default {
  id: 'mt27-sealed',
  beats: [
    { v: 66 },
  ],
  cam: { x: [0, 170], y: [-20, 20], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    const sk = sky(S, MT.tombDay);
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 500, amps: [14, 7, 3], lens: [900, 320, 120], color: mix(C.hillFar, C.stone2, 0.35) }).markup);
    const hillL = S.layer({ par: 0.16, sh: 3 });
    hillL.add(`<g transform="translate(420 440)">${skullHill(c, { w: 620, h: 210 })}</g>`);
    hillL.add(`<g transform="translate(310 460)">${crossSil(c, { h: 130, figure: false })}</g><g transform="translate(530 460)">${crossSil(c, { h: 130, figure: false })}</g><g transform="translate(420 440)">${crossSil(c, { h: 170, figure: false })}</g>`);
    const garden = S.layer({ par: 0.3, sh: 3 });
    const gfn = c.wave(600, [6, 3], [700, 200]);
    garden.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.hillNear).out());
    garden.add(cypress(c, 1470, 604, 200, C.moss2) + cypress(c, 1520, 606, 150, C.moss2) + olive(c, 720, 604, 0.9) + grass(c, { x0: -600, x1: 2300, y: 600, fn: gfn, n: 30, h: 12, color: C.moss }));
    const tombL = S.layer({ par: 0.4, sh: 5 });
    const R = sheet();
    const rockPts = [[DX - 280, DB + 40], [DX - 250, DB - 170], [DX - 160, DB - 280], [DX - 20, DB - 320], [DX + 140, DB - 300], [DX + 260, DB - 210], [DX + 300, DB - 60], [DX + 320, DB + 40]];
    const arch = [[DX - DW / 2, DB + 2], [DX - DW / 2, DB - DH + DW / 2], ...c.arc(DX, DB - DH + DW / 2, DW / 2, DW / 2, PI, 2 * PI, 12), [DX + DW / 2, DB + 2]];
    R.p(c.cut(rockPts, 3, 12) + c.hole(arch, 0.5, 6), C.rock);
    R.x(c.cut(c.blob(DX + 150, DB - 200, 70, 30, 9, 0.3), 1, 6) + c.cut(c.blob(DX - 170, DB - 140, 50, 24, 9, 0.3), 1, 6), shade(C.rock, 0.2), 'opacity=".5"');
    R.x(c.ribbon([[DX - 110, DB + 4], [DX + 260, DB + 4]], 8), C.rock3, 'opacity=".7"');
    const inside = S.layer({ par: 0.4, sh: 1 });
    inside.add(`<path d="${c.poly(arch)}" fill="${C.soilRich}"/>`);
    tombL.add(R.out());
    const stoneL = S.layer({ par: 0.4, sh: 6 });
    const glow = stoneL.add(`<g><circle r="140" fill="url(#halo-glow)"/></g>`);
    stoneL.add(`<g transform="translate(${DX} ${DB - SR + 4})">${tombStone(c, SR)}</g>`);
    const cord = stoneL.add(`<g>${sealCord(c, SR)}</g>`);
    const seal = stoneL.add(`<g><circle r="40" fill="url(#warm-glow)" opacity=".5"/>${waxSeal(c, 16, 'eagle')}</g>`);
    const ground = S.layer({ par: 0.45, sh: 2 });
    ground.add(sheet().p(c.cut([[-900, 660], [2500, 654], [2500, 1700], [-900, 1700]], 1, 14), mix(C.sand2, C.stone2, 0.3)).out());
    ground.add(rock(c, 420, 700, 120, 34, C.rock2));
    const P = S.layer({ par: 0.55, sh: 5 });
    const pr = [0, 1].map((i) => ({ i, p: S.puppet(P.add(priest(c, i))) }));
    const sols = [[DX - 150, GY - 4, false], [DX - 250, GY + 6, false], [DX + 150, GY, true]].map(([x, y, f], i) => ({ i, x, y, f, p: S.puppet(P.add(soldier(c, i, { spear: 34 }))) }));

    return (t, time) => {
      const T = time;
      sk.set(...MT.tombDay);
      /* the chief priests stretch the cord and press the seal */
      const pK = [[-0.3, [560, GY]], [0.2, [900, GY]], [0.5, [900, GY]], [0.85, [620, GY]]];
      const [px, py] = kf(t, pK);
      const press = bump(t, 0.2, 0.45);
      pr.forEach((m) => m.p.set({ x: px - m.i * 90, y: py + m.i * 6, s: 0.98, flip: t > 0.5, walk: moving(t, pK) ? px * 0.05 : undefined, armF: 20 + (m.i === 0 ? press * 80 : 20), armB: 10, head: m.i === 0 ? -press * 6 : -4, blink: blinkAt(T, 3 + m.i) }));
      const ck = es(t, 0.05, 0.25);
      pose(cord, { x: DX, y: DB - SR + 4, sx: Math.max(0.01, ck), o: ck > 0.01 ? 1 : 0 });
      const sk2 = es(t, 0.3, 0.42, ease.back);
      pose(seal, { x: DX, y: DB - SR + 8, s: sk2 * (1 + bump(t, 0.38, 0.48) * 0.2), o: sk2 > 0.02 ? 1 : 0 });
      /* the guard takes its place */
      sols.forEach((s) => {
        const K = [[-0.2 + s.i * 0.05, [s.x + (s.f ? 400 : -500), s.y]], [0.45 + s.i * 0.05, [s.x, s.y]]];
        const [x, y] = kf(t, K);
        s.p.set({ x, y, s: 1, flip: s.f, walk: moving(t, K) ? x * 0.06 : undefined, armF: 34, armB: 8, blink: blinkAt(T, 5 + s.i) });
      });
      pose(glow, { x: DX, y: DB - 70, o: 0.25 + Math.sin(T * 0.8) * 0.05 });
      S.cam.x = S.portrait ? 160 : 40;
      S.cam.y = 0;
      S.cam.z = 1.02 + es(t, 0, 0.8) * 0.03;
    };
  },
};
