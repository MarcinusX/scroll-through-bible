// J 6,38–40 — the walls of the synagogue give way to the night of heaven: a path of light runs down from the
// radiance of the Father to Jesus — He came down not to do His own will; He bows His head. Of all the Father gave
// Him He is to lose nothing: little lights come down and gather round Him; one drifts off — and is brought back.
// He will raise it up on the last day: the heaven turns to dawn and the lights rise. Everyone who sees the Son and
// believes has eternal life — rings without end — and He will raise him up: they all stand in the morning light.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { stars } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { synagogueInterior, radiance, soulLight, eternityRing, drawRing, dawnDisc, hungWord, rayBurst, glowDisc, heart, eyeIcon, headAt, hand, kf, tr, PI } from './lib.js';

const JX = 800, FEET = 742;

export default {
  id: 'j6-will',
  beats: [
    { v: 38 },
    { v: 39, text: 'Jest wolą Tego, który Mię posłał, abym ze wszystkiego, co Mi dał, niczego nie stracił,' },
    { v: 39, cont: true, text: 'ale żebym to wskrzesił w dniu ostatecznym.' },
    { v: 40, text: 'To bowiem jest wolą Ojca mego, aby każdy, kto widzi Syna i wierzy w Niego, miał życie wieczne.' },
    { v: 40, cont: true, text: 'A ja go wskrzeszę w dniu ostatecznym».' },
  ],
  cam: { x: [-20, 20], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const I = synagogueInterior(S);
    /* heaven opens above the floor */
    const night = S.layer({ par: I.P, sh: 3, flat: true });
    const nid = S.id('nightg'), did = S.id('dawng');
    S.defs(`<linearGradient id="${nid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141a3d"/><stop offset=".7" stop-color="#2b3468"/><stop offset="1" stop-color="#4b5791"/></linearGradient><linearGradient id="${did}" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="600"><stop offset="0" stop-color="#8d8fb5"/><stop offset=".6" stop-color="#e3b3a6"/><stop offset="1" stop-color="#f7d7a8"/></linearGradient>`);
    night.add(`<g><rect x="-3000" y="-3000" width="8000" height="3602" fill="url(#${nid})"/>${stars(c, { x0: -600, x1: 2200, y0: -300, y1: 560, n: 120 })}</g>`);
    const dawn = S.layer({ par: I.P, sh: 1, flat: true });
    dawn.add(`<rect x="-3000" y="-3000" width="8000" height="3602" fill="url(#${did})"/>`);
    const hiL = S.layer({ par: I.P, sh: 4 });
    const rad = hiL.add(`<g><circle r="260" fill="url(#halo-glow)"/>${radiance(c, 64)}</g>`);
    const beam = hiL.add(`<path d="${c.poly([[-26, 0], [26, 0], [120, 600], [-120, 600]])}" fill="#fff4d0" opacity="0"/>`);
    const rising = hiL.add(`<g>${rayBurst(c, { n: 18, r0: 50, r1: 700, spread: 0.026, color: '#fff3cf', o: 0.3 })}${glowDisc(320, 'warm-glow', 1)}</g>`);

    const L = S.layer({ par: I.P, sh: 4 });
    const cong = I.congregation(L);
    // the same people, standing up in the morning light
    const stand = cong.map((m) => S.puppet(L.add(person(c, { ...m.opts, pose: 'stand' }))));
    const jGlow = L.add(`<g>${glowDisc(150, 'halo-glow', 1)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    I.addColumns();

    // phone: the plate of the last day hangs further in; the signs appear over the people who are on the screen
    const P = S.portrait;
    const DX = P ? 975 : 1080;
    const fx = S.layer({ par: 0.6, sh: 4 });
    const N = 12;
    const souls = Array.from({ length: N }, (_, i) => ({ i, a: (i / N) * PI * 2, el: fx.add(`<g>${soulLight(c, 10)}</g>`) }));
    const lastDay = hanging(fx, `${dawnDisc(c, 52)}<text x="0" y="82" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="19" font-style="italic" fill="${C.ink}"></text>`, { x: 0, y: 0, len: 900 });
    const dayWord = fx.add(hungWord(c, tr('dzień ostateczny', 'the last day'), { size: 20 }));
    const WHO = P ? cong.map((m, i) => i).sort((a, b) => Math.abs(cong[a].x - JX) - Math.abs(cong[b].x - JX)).slice(0, 4) : [0, 3, 6, 8];
    const rings = WHO.map((ci, i) => ({ m: cong[ci], i, el: fx.add(`<g>${eternityRing(c, 34, 3, 18)}</g>`) }));
    const eyes = WHO.map((ci, i) => ({ m: cong[ci], i, el: fx.add(`<g>${eyeIcon(c, true, 10)}</g>`) }));
    const hearts = WHO.map((ci) => fx.add(`<g>${heart(c, 8)}</g>`));

    return (t, time) => {
      const T = time;
      I.flicker(T);
      /* v38 — down from heaven, to do the will of the One who sent Him */
      const open = es(t, 0.05, 0.45);
      night.fade(open * (1 - es(t, 2.1, 2.5) * 0));
      const dz = es(t, 2.05, 2.5) * (1 - es(t, 3.0, 3.3) * 0.3) + es(t, 4.05, 4.4);
      dawn.fade(Math.min(1, dz));
      pose(rad, { x: JX, y: 150, s: 0.8 + open * 0.2, r: T * 3, o: open * (1 - Math.min(1, dz) * 0.4) });
      pose(beam, { x: JX, y: 150, o: es(t, 0.25, 0.5) * 0.4 * (1 - es(t, 1.0, 1.3) * 0.6) });
      pose(rising, { x: JX, y: 600, s: 0.3 + Math.min(1, dz) * 0.8, r: t * 4, o: Math.min(1, dz) * 0.8 });
      const bow = bump(t, 0.5, 1.0);
      jesus.set({ x: JX, y: FEET, s: 1.08, armF: 20 + bow * 70 + bump(t, 1.1, 2.0) * 40 + es(t, 4.05, 4.4) * 60, armB: 10 + bump(t, 1.1, 2.0) * 100 + bump(t, 2.1, 2.9) * 140 + es(t, 4.05, 4.4) * 130, head: bow * 12 - bump(t, 2.1, 2.9) * 10, blink: blinkAt(T, 1) });
      pose(jGlow, { x: JX, y: FEET - 140, s: 0.8 + bump(t, 1.2, 2.9) * 0.5, o: 0.3 + open * 0.3 });

      /* v39a — lose nothing of all He has given Me */
      const down = es(t, 1.05, 1.5);
      const gone = souls[7];
      souls.forEach((s) => {
        const a = s.a + T * 0.25;
        const r = 150;
        let x = JX + Math.cos(a) * r, y = FEET - 150 + Math.sin(a) * r * 0.55;
        if (s === gone) {
          const stray = bump(t, 1.5, 2.0);
          x += stray * (P ? 190 : 330); y -= stray * 60;
        }
        /* v39b — raised up on the last day */
        const rise = es(t, 2.2, 2.7);
        const sx = lerp(JX, x, down), sy = lerp(150, y, down) - rise * 260;
        pose(s.el, { x: sx, y: sy, s: 0.8 + rise * 0.4, o: seg(t, 1.05, 1.12) * (1 - es(t, 2.9, 3.05)) });
      });
      const dk = es(t, 2.1, 2.4, ease.out) * (1 - es(t, 2.95, 3.1)) + es(t, 4.1, 4.4, ease.out);
      pose(lastDay, { x: DX, y: lerp(-500, 240, Math.min(1, dk)), r: Math.sin(T * 0.8) * 1.4, o: dk > 0.01 ? 1 : 0 });
      pose(dayWord, { x: DX, y: lerp(-500, 350, Math.min(1, dk)), r: Math.sin(T * 1.1 + 1) * 2, o: dk > 0.01 ? 1 : 0 });

      /* v40a — everyone who sees the Son and believes: eternal life */
      const see = es(t, 3.05, 3.3);
      rings.forEach((r) => {
        const [hx, hy] = headAt(r.m.x, r.m.y, r.m.s, r.m.x > JX, 62);
        const e = es(t, 3.05 + r.i * 0.06, 3.25 + r.i * 0.06, ease.back) * (1 - es(t, 3.5, 3.6));
        pose(eyes[r.i].el, { x: hx, y: hy - 42, s: e, o: e > 0.01 ? 1 : 0 });
        const hk = es(t, 3.4 + r.i * 0.06, 3.6 + r.i * 0.06, ease.back) * (1 - es(t, 4.0, 4.1));
        pose(hearts[r.i], { x: hx, y: hy - 42, s: hk, o: hk > 0.01 ? 1 : 0 });
        drawRing(r.el, es(t, 3.5 + r.i * 0.06, 3.9 + r.i * 0.06));
        pose(r.el, { x: hx, y: hy + 24, r: t * 30, o: seg(t, 3.5, 3.55) * (1 - es(t, 4.9, 5.0) * 0.5) });
      });

      /* v40b — I will raise him up on the last day: they rise in the morning light */
      const up = es(t, 4.2, 4.28);
      cong.forEach((m, i) => {
        const o = { x: m.x, y: m.y, s: m.s, flip: m.x > JX, blink: blinkAt(T, m.seed) };
        m.p.set({ ...o, o: 1 - up, armF: 20 + see * 30, armB: see * (i % 3 ? 20 : 80), head: -see * 8 - open * 4 });
        stand[i].set({ ...o, y: m.y - 4, o: up, armF: 60 + (i % 2) * 40, armB: 120 + (i % 3) * 20, head: -10 });
      });

      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.04], [2.2, 1.0], [3.1, 1.06], [4.2, 1.02]]);
      S.cam.y = kf(t, [[0, 10], [1.0, 0], [2.2, -30], [3.1, 20], [4.2, 0]]);
    };
  },
};
