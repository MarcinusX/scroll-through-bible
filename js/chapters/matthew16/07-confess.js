// Mt 16,15–16 — "But who do you say that I am?" The portraits are pulled up into the flies; Jesus opens His hands to
// the Twelve; question marks over their heads. Simon Peter steps forward and kneels: "You are the Christ" — a crown of
// light comes down over Jesus' head, the horn of anointing pours, the banner "Messiah" is let down. "…the Son of the
// living God" — the sky turns to gold, the light of the Father opens high above (light, never a figure) and pours down
// on Him, and the springs under the rock burst out: living water.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { headAt, speech, GLYPH, say, portrait, lightCrown, oilHorn, glory, radiance, rayBurst, tag, gush, hangAt, caesareaSet, caesareaFront, CZ, DIS16, LOOK, JEREMIAH, tr, PI } from './lib.js';

const GY = CZ.GROUND, JX = 780, PK = 872;

export default {
  id: 'mt16-confess',
  beats: [
    { v: 15 },
    { v: 16, text: 'Odpowiedział Szymon Piotr: «Ty jesteś Mesjasz,' },
    { v: 16, cont: true, text: 'Syn Boga żywego».' },
  ],
  cam: { x: [-20, 20], y: [-80, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const W = {};
    const Z = caesareaSet(S, {
      between(S2) {
        /* living water bursting from the grotto (behind the near ground) */
        const wL = S2.layer({ par: 0.26, sh: 2 });
        W.spurts = [0, 1, 2, 3].map(() => wL.add(`<g>${gush(c, 5)}</g>`));
        W.brook = wL.add(`<g><path d="${c.ribbon(c.qbez([CZ.GX - 120, CZ.GY + 10], [CZ.GX - 360, CZ.GY + 44], [CZ.GX - 780, CZ.GY + 74], 18), (u) => 10 + u * 22)}" fill="#f4f2e6" opacity=".75"/></g>`);
      },
    });

    /* ---------- the light of the Father, high above ---------- */
    const lightL = S.layer({ par: 0.03, sh: 1, flat: true, rise: 0 });
    const rays = lightL.add(`<g>${rayBurst(c, { n: 26, r0: 60, r1: 1300, spread: 0.05, o: 0.5 })}</g>`);
    const rad = lightL.add(`<g><circle r="330" fill="url(#halo-glow)"/>${radiance(c, 90)}</g>`);

    /* ---------- the portraits (still hanging from the answers) ---------- */
    const pL = S.layer({ par: 0.1, sh: 7 });
    const PORTS = S.portrait ? [510, 680, 860, 1040] : [480, 690, 910, 1120];
    const ports = [LOOK.baptist, LOOK.elijah, JEREMIAH, LOOK.prophet].map((o, i) => ({ i, x: PORTS[i], el: pL.add(`<g><path d="M0 -84V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${portrait(S, o, [tr('Jan Chrzciciel', 'John the Baptist'), tr('Eliasz', 'Elijah'), tr('Jeremiasz', 'Jeremiah'), tr('jeden z proroków', 'one of the prophets')][i], { w: 112, h: 144 })}</g>`) }));

    /* ---------- the glory behind Him ---------- */
    const glL = S.layer({ par: 0.5, sh: 1, flat: true });
    const gl = glL.add(`<g>${glory(c, 520, 24)}</g>`);

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const dis = DIS16.map((d, i) => ({ ...d, i, p: S.puppet(P.add(person(c, d.o))), seed: c.rr(0, 9) }));
    const peterK = S.puppet(P.add(person(c, { ...CAST.peter, pose: 'kneel' })));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const crownEl = fx.add(`<g>${lightCrown(c, 40)}</g>`);
    const horn = fx.add(`<g>${oilHorn(c)}</g>`);
    const drops = [0, 1, 2].map(() => fx.add(`<path d="M0 -8C-4 -2 -4 3 0 5C4 3 4 -2 0 -8Z" fill="${C.sun}"/>`));
    const bn1 = fx.add(`<g><path d="M0 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${tag(c, tr('Mesjasz', 'the Christ'), { size: 30, w: 190, fill: C.halo })}</g>`);
    const bn2 = fx.add(`<g><path d="M0 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${tag(c, tr('Syn Boga żywego', 'the Son of the living God'), { size: 26, fill: C.halo })}</g>`);
    const youQ = fx.add(`<g>${speech(c, GLYPH.q(c), { w: 54, h: 54 })}</g>`);
    const qs = [0, 2, 4, 5].map((i) => ({ i, el: fx.add(`<g>${speech(c, GLYPH.q(c), { w: 36, h: 36, flip: DIS16[i].x > JX })}</g>`) }));
    const peterSay = fx.add(`<g>${say(c, tr('Ty jesteś Mesjasz', 'You are the Christ'), { size: 21, side: 1 })}</g>`);
    const peterSay2 = fx.add(`<g>${say(c, tr('Syn Boga żywego!', 'the Son of the living God!'), { size: 21, side: 1 })}</g>`);
    caesareaFront(S);

    return (t, time) => {
      const T = time;
      const living = es(t, 2.05, 2.4);
      const lum = es(t, 1.08, 1.4);
      Z.update(T, { gold: living * 0.9 });

      /* v15 — the portraits go up; He turns to them */
      ports.forEach((p) => {
        const on = 1 - es(t, 0.05 + p.i * 0.05, 0.4 + p.i * 0.05, ease.in);
        hangAt(p.el, p.x, 250 - (1 - on) * 800 + (p.i % 2) * 18, T, 1.2, 0.8, p.i * 2);
      });
      const you = es(t, 0.1, 0.35) * (1 - es(t, 0.95, 1.1));
      jesus.set({ x: JX, y: GY, s: 1, flip: false, armF: 16 + you * 50 + lum * 14 + living * 30, armB: 8 + you * 60 + living * 90, head: -living * 8, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1, false);
      const yq = es(t, 0.2, 0.35, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(youQ, { x: hx + 18, y: hy - 34, s: yq, o: yq > 0.02 ? 1 : 0 });
      qs.forEach((q, j) => {
        const k = es(t, 0.45 + j * 0.08, 0.6 + j * 0.08, ease.back) * (1 - es(t, 0.98, 1.05));
        const d = DIS16[q.i];
        const [ax, ay] = headAt(d.x, GY + 4 + (q.i % 2) * 8, 0.88, d.x > JX);
        pose(q.el, { x: ax + (d.x > JX ? -10 : 10), y: ay - 34, s: k * 0.9, r: T ? Math.sin(T * 2 + j) * 5 : 0, o: k > 0.02 ? 1 : 0 });
      });

      /* v16a — Peter steps forward and kneels */
      const kneel = es(t, 1.1, 1.18);
      dis.forEach((d) => {
        const step = d.k === 'peter' ? es(t, 0.9, 1.1) * 30 : 0;
        const awe = es(t, 1.2, 1.5);
        const up = living * (d.i % 2 ? 1 : 0.7);
        d.p.set({
          x: d.x - step, y: GY + 4 + (d.i % 2) * 8, s: 0.88, flip: d.x > JX, o: d.k === 'peter' ? 1 - kneel : 1,
          armF: 18 + awe * (d.i % 2 ? 40 : 20) + up * 30 + (d.k === 'peter' ? bump(t, 0.9, 1.15) * 50 : 0), armB: 10 + up * 90,
          head: -awe * 6 - up * 14 + bump(t, 0.5, 0.95) * 8, blink: blinkAt(T, d.seed),
        });
      });
      peterK.set({ x: PK, y: GY + 6, s: 0.9, flip: true, o: kneel, armF: 60 + lum * 20 + living * 20, armB: 30 + living * 100, head: -12 - living * 8, blink: blinkAt(T, 1) });
      const [px, py] = headAt(PK, GY + 6, 0.9, true, 46);
      const ps = es(t, 1.12, 1.28, ease.back) * (1 - es(t, 1.95, 2.02));
      pose(peterSay, { x: px - 4, y: py - 40, s: ps, o: ps > 0.02 ? 1 : 0 });
      const ps2 = es(t, 2.08, 2.22, ease.back) * (1 - es(t, 2.95, 3));
      pose(peterSay2, { x: px - 4, y: py - 40, s: ps2, o: ps2 > 0.02 ? 1 : 0 });

      /* the Christ: the crown of light, the horn of oil, the banner */
      pose(gl, { x: hx, y: hy + 10, s: 0.5 + lum * 0.5 + living * 0.3, r: T * 3, o: lum });
      const cr = es(t, 1.2, 1.55);
      pose(crownEl, { x: hx, y: hy - 38 - (1 - cr) * 260, s: 0.7 + cr * 0.3, o: cr > 0.01 ? cr : 0 });
      const hornOn = bump(t, 1.3, 2.0);
      pose(horn, { x: hx + 26, y: hy - 72 - (1 - Math.min(1, hornOn * 2)) * 120, r: -hornOn * 38, o: hornOn > 0.02 ? 1 : 0 });
      drops.forEach((d, i) => {
        const k = T ? ((T * 0.9 + i / 3) % 1) : i / 3;
        pose(d, { x: hx + 22 - k * 16, y: hy - 66 + k * 50, s: 1.2, o: hornOn > 0.3 ? Math.sin(k * PI) : 0 });
      });
      const b1 = es(t, 1.3, 1.6, ease.back) * (1 - es(t, 2.05, 2.3));
      hangAt(bn1, JX, 190 - (1 - b1) * 600, T, 1, 0.8, 4);
      const b2 = es(t, 2.2, 2.55, ease.back);
      hangAt(bn2, JX, 190 - (1 - b2) * 600, T, 1, 0.8, 5);

      /* v16b — the light of the Father; living water */
      pose(rad, { x: JX, y: lerp(-420, 110, living), s: 0.8 + living * 0.3, o: living > 0.01 ? 1 : 0 });
      pose(rays, { x: JX, y: 110, s: 0.6 + living * 0.4, r: T ? T * 1.5 : 0, o: living * 0.9 });
      W.spurts.forEach((sp, i) => {
        const k = T ? ((T * 0.8 + i / 4) % 1) : i / 4;
        pose(sp, { x: CZ.GX - 20 - k * 110, y: CZ.GY - 6 + k * 16, s: 0.6 + k * 0.6, o: living * Math.sin(k * PI) });
      });
      pose(W.brook, { o: living });

      S.cam.z = 1.04 + es(t, 0.05, 0.4) * 0.06 + es(t, 1.05, 1.4) * 0.06 - es(t, 2.05, 2.4) * 0.12;
      S.cam.y = 10 + es(t, 0.05, 0.4) * 20 + es(t, 1.05, 1.4) * 20 - es(t, 2.05, 2.4) * 90;
    };
  },
};
