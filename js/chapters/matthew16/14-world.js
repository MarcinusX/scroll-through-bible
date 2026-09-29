// Mt 16,26 — a great balance is let down from the flies, a small glowing soul resting on its right pan. "What will it
// profit a man if he gains the whole world…": a man reaches up and the whole world is set on the left pan — down it
// goes, and the soul drifts off its pan and dims: "…and forfeits his life?" "Or what will a man give in exchange for
// his life?": he heaps on coins, a crown, a house — the soul comes back to its pan, and the beam tips its way: nothing
// piled against it weighs as much.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet } from '../kit.js';
import { band, hillsWith, olive, cypress, grass, house, cloud, sun } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import { balance, globe, soulLight, coinStack, crown, speech, GLYPH, folk4, hangAt, DAY, PI } from './lib.js';

const GY = 690, JX = 820;
const PX = 800, PY = 240, ARM = 190;   // the balance pivot

export default {
  id: 'mt16-world',
  beats: [
    { v: 26, text: 'Cóż bowiem za korzyść odniesie człowiek, choćby cały świat zyskał, a na swej duszy szkodę poniósł?' },
    { v: 26, cont: true, text: 'Albo co da człowiek w zamian za swoją duszę?' },
  ],
  cam: { x: [-20, 20], y: [-100, 40], z: [0.96, 1.1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    hanging(hangL, sun(c, 44), { x: 1270, y: 150, len: 800 });
    hanging(hangL, cloud(c, 190), { x: 400, y: 140, len: 700 });

    /* ---------- land ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [16, 7, 3], lens: [1100, 380, 140], color: C.hillFar }).markup);
    const hills = S.layer({ par: 0.18, sh: 2 });
    const h2 = hillsWith(c, { y: 520, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 });
    hills.add(h2.markup + house(c, 1250, h2.fn(1250) + 8, 40, 28) + house(c, 1300, h2.fn(1300) + 6, 30, 22));
    const groundL = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(GY - 60, [4, 2], [600, 160]);
    groundL.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand).out() + grass(c, { x0: -600, x1: 2200, y: GY - 60, fn: gfn, n: 30, h: 12, color: C.olive }) + olive(c, 300, GY - 56, 1) + cypress(c, 1330, GY - 54, 170));

    /* ---------- the balance, hanging from the flies ---------- */
    const balL = S.layer({ par: 0.1, sh: 7 });
    const B = balance(c, { arm: ARM, drop: 100 });
    const beam = hanging(balL, B.beam, { x: PX, y: PY, len: 900 });
    const beamObj = beam.querySelector('.obj');
    const panL = balL.add(`<g>${B.pan}</g>`), panR = balL.add(`<g>${B.pan}</g>`);
    const world = balL.add(`<g>${globe(c, 46)}</g>`);
    const soul = balL.add(`<g>${soulLight(c, 20)}</g>`);
    const riches = [
      balL.add(`<g>${coinStack(c, 6, 11)}</g>`), balL.add(`<g>${crown(c, 42)}</g>`), balL.add(`<g>${coinStack(c, 4, 10)}</g>`),
      balL.add(`<g><g transform="scale(.6)">${house(c, -30, 0, 60, 44, { stairs: false })}</g></g>`),
    ];

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const manA = S.puppet(P.add(person(c, { ...folk4(c, true), robe: C.tealRobe, mantle: C.ochreRobe, belt: C.leather })));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const dis = [{ o: CAST.peter, x: 1000 }, { o: CAST.john, x: 1070 }, { o: CAST.james, x: 1140 }].map((d, i) => ({ ...d, i, p: S.puppet(P.add(person(c, d.o))) }));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const q = fx.add(`<g>${speech(c, GLYPH.q(c), { w: 44, h: 44 })}</g>`);

    return (t, time) => {
      const T = time;
      sk.set(...DAY);
      /* v26a — the world gained, the soul lost; v26b — nothing can buy it back */
      const on = es(t, -0.3, 0.12, ease.back);
      const by = PY - (1 - on) * 700;
      const worldIn = es(t, 0.15, 0.45);
      const soulOff = es(t, 0.5, 0.85) * (1 - es(t, 1.35, 1.6));
      const outweigh = es(t, 1.5, 1.8);
      const tilt = -worldIn * 12 * (1 - outweigh) + outweigh * 14 + (T ? Math.sin(T * 1.2) * 0.8 : 0);
      hangAt(beam, PX, by, T, 0, 0, 0);
      pose(beamObj, { r: tilt });
      const a = (tilt * PI) / 180;
      const lx = PX - Math.cos(a) * ARM, ly = by - Math.sin(a) * ARM, rx = PX + Math.cos(a) * ARM, ry = by + Math.sin(a) * ARM;
      const vis = by > -200 ? 1 : 0;
      pose(panL, { x: lx, y: ly, r: T ? Math.sin(T * 1.4) * 1.5 : 0, o: vis });
      pose(panR, { x: rx, y: ry, r: T ? Math.sin(T * 1.4 + 1) * 1.5 : 0, o: vis });
      const panTop = 98;
      pose(world, { x: lerp(560, lx, worldIn), y: lerp(540, ly + panTop - 44, worldIn) - Math.sin(worldIn * PI) * 90, r: T * 6, o: vis * (t > 0.1 ? 1 : 0) });
      pose(soul, { x: rx + soulOff * 150, y: ry + panTop - 26 - soulOff * 50, s: 1 - soulOff * 0.3 + outweigh * 0.25 + (T ? Math.sin(T * 4) * 0.04 : 0), o: vis * (1 - soulOff * 0.45) });
      riches.forEach((r, i) => {
        const k = es(t, 1.05 + i * 0.08, 1.3 + i * 0.08);
        pose(r, { x: lerp(470 - i * 30, lx - 40 + i * 26, k), y: lerp(600, ly + panTop - 6 - (i === 3 ? 10 : 0), k) - Math.sin(k * PI) * 90, o: k > 0.01 && vis ? 1 : 0 });
      });

      /* the man who wants the world, then piles his riches, then stands with empty hands */
      const reach = bump(t, 0.05, 0.6);
      const grab = es(t, 0.4, 0.6) * (1 - es(t, 1.0, 1.1));
      const pile = bump(t, 1.02, 1.5);
      const empty = es(t, 1.6, 1.8);
      manA.set({ x: 560, y: GY + 10, s: 0.94, flip: false, armF: 20 + reach * 120 + grab * 30 + pile * 90 + empty * 40, armB: 10 + reach * 100 + pile * 60 + empty * 40, head: -reach * 20 - pile * 10 - empty * 8, blink: blinkAt(T, 3) });
      const qk = es(t, 1.62, 1.78, ease.back);
      pose(q, { x: 580, y: GY - 200, s: qk, o: qk > 0.02 ? 1 : 0 });

      /* Jesus teaching; the three listen */
      jesus.set({ x: JX, y: GY, s: 1, flip: false, armF: 20 + bump(t, 0.05, 0.95) * 40 + bump(t, 1.05, 1.95) * 50, armB: 10 + bump(t, 1.05, 1.95) * 60, head: -4, blink: blinkAt(T) });
      dis.forEach((d) => d.p.set({ x: d.x, y: GY + 6 + (d.i % 2) * 8, s: 0.88, flip: true, armF: 18 + outweigh * 20, head: -es(t, 0.5, 0.9) * 10, blink: blinkAt(T, d.i + 2) }));

      S.cam.z = 1.02 - es(t, 0, 0.3) * 0.04 + es(t, 1.5, 1.9) * 0.02;
      S.cam.y = -40 - es(t, 0, 0.3) * 40 + es(t, 1.5, 1.9) * 20;
    };
  },
};
