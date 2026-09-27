// J 12,12–13 — the next morning outside the east gate of Jerusalem: the festival crowd among its tents. A runner
// comes up the road — "He is coming!" — and heads turn. They reach up into the date palms, pull down branches and
// run out along the road towards Him; Jesus comes walking from the Mount of Olives with His disciples. "Hosanna!"
// — the pennants drop from the flies; "Blessed is He who comes in the name of the Lord, the King of Israel!" — a
// banner unrolls and a golden crown swings down above Him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { roadSet, RD, MORNING, man, crowdPerson, handFrond, pennant, clothBanner, hang2, voiceRings, headAt, nameTag, hanging, swing, kf, vis, sparkle, dayDisc, tr, PI, FONT } from './lib.js';

export default {
  id: 'j12-palms',
  beats: [
    { v: 12 },
    { v: 13, text: 'wziął gałązki palmowe i wybiegł Mu naprzeciw.' },
    { v: 13, cont: true, text: 'Wołali: Hosanna!' },
    { v: 13, cont: true, text: 'Błogosławiony, który przychodzi w imię Pańskie oraz «Król izraelski!»' },
  ],
  cam: { x: [-40, 200], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const set = roadSet(S, { skyCols: ['#e6d7c2', '#f4e3c4', '#f8ecd4'], sunAt: [1180, 240] });
    const G = RD.GROUND;
    const back = S.layer({ par: 0.48, sh: 4 });
    const act = S.layer({ par: 0.52, sh: 5 });
    /* the crowd: start by the tents, end on the road before Him */
    const spots = [
      [380, 440, G + 8, 0.95, 1], [450, 525, G + 8, 0.95, 0], [530, 610, G + 8, 0.95, 1], [610, 695, G + 8, 0.95, 0], [690, 775, G + 10, 0.95, 1],
      [420, 480, G - 16, 0.86, 0], [500, 570, G - 16, 0.86, 1], [580, 655, G - 16, 0.86, 0],
    ];
    const crowd = spots.map(([x0, x1, y, s, w], i) => {
      const o = w ? crowdPerson(c) : man(c);
      const p = S.puppet((i < 5 ? act : back).add(person(c, { ...o, holdB: handFrond(c, 96 + (i % 3) * 8) })));
      return { i, x0, x1, y, s, p, fr: p.el.querySelector('.fr'), seed: c.rr(0, 9), ph: c.rr(0, 6) };
    });
    const runner = S.puppet(act.add(person(c, man(c, { robe: C.tealRobe, hairStyle: 'curly', beard: 'none' }))));
    /* Jesus and the disciples come walking from the Mount of Olives */
    const disc = [CAST.andrew, CAST.john, CAST.peter].map((o) => S.puppet(act.add(person(c, o))));
    const jesus = S.puppet(act.add(person(c, CAST.jesus)));
    const fx = S.layer({ par: 0.4, sh: 5 });
    const LET = [...tr('HOSANNA', 'HOSANNA')];
    const PC = [C.terracotta, C.ochre, C.teal2, C.jesusMantle, C.dustyBlue, C.moss, C.plumRobe];
    const span = 560;
    const sag = (u) => Math.sin(u * PI) * 56;
    let pen = `<path d="${c.ribbon(Array.from({ length: 21 }, (_, i) => [-span / 2 + (i / 20) * span, sag(i / 20)]), 2)}" fill="${C.rope}"/>`;
    LET.forEach((ch, i) => { const u = (i + 0.5) / LET.length; pen += `<g transform="translate(${-span / 2 + u * span - 21} ${sag(u) + 1}) rotate(${(u - 0.5) * -14})">${pennant(c, ch, PC[i % PC.length])}</g>`; });
    const penEl = fx.add(`<g>${hang2(pen, span / 2, 500)}</g>`);
    const banner = fx.add(`<g>${clothBanner(c, tr('Błogosławiony, który przychodzi w imię Pańskie', 'Blessed is he who comes in the name of the Lord'), { size: 19, w: 520 })}</g>`);
    const crownS = sheet();
    crownS.p(c.cut([[-40, 8], [-46, -26], [-24, -10], [-16, -40], [0, -16], [16, -40], [24, -10], [46, -26], [40, 8]], 0.4, 4), C.sun);
    crownS.x(c.poly(c.circ(-16, -40, 4, 8)) + c.poly(c.circ(16, -40, 4, 8)) + c.poly(c.circ(-46, -26, 3.4, 8)) + c.poly(c.circ(46, -26, 3.4, 8)), C.terracotta);
    crownS.x(c.ribbon([[-38, -2], [38, -2]], 3), shade(C.sun, -0.25));
    const crown = hanging(fx, `<circle r="90" fill="url(#halo-glow)"/>${crownS.out()}<g transform="translate(0 30)">${nameTag(c, tr('Król Izraela', 'King of Israel'), { size: 16 })}</g>`, { x: 900, y: 340, len: 700 });
    const morning = hanging(fx, `${dayDisc(c, '', 28)}<g transform="translate(0 34)">${nameTag(c, tr('nazajutrz', 'the next day'), { size: 16 })}</g>`, { x: 720, y: 190, len: 700 });
    const vL = S.layer({ par: 0.52, sh: 2 });
    const voices = [0, 1, 2, 3].map(() => voiceRings(vL, c, { n: 3, r: 28, w: 5, color: shade(C.terracotta, 0.3) }));
    const runV = voiceRings(vL, c, { n: 3, r: 26, w: 4, color: shade(C.teal2, 0.2) });
    const glint = fx.add(`<g>${sparkle(c, 18)}</g>`);
    set.fg();

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunY: 240 - es(t, 0, 1.2) * 80 });
      const dk = es(t, 0.05, 0.35, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      swing(morning, 720, 190 - (1 - dk) * 600, dk > 0.001 ? T : 0, 1, 0.7);
      fade(morning, dk > 0.001 ? 1 : 0);
      fade(morning.querySelector('.lit'), es(t, 0.2, 0.5));
      /* v12 — the runner: "He is coming!" */
      const rk = es(t, 0.1, 0.55, ease.out);
      const rx = lerp(1450, 880, rk);
      const back2 = es(t, 1.1, 1.6);
      runner.set({ x: rx + back2 * 140, y: G + 12, s: 0.92, flip: back2 < 0.05, walk: rk > 0 && rk < 1 ? rx * 0.09 : back2 > 0 && back2 < 1 ? t * 30 : undefined, amt: 1.4, armF: 30 + bump(t, 0.55, 1.0) * 60, armB: bump(t, 0.5, 1.0) * 120, head: -4, blink: blinkAt(T, 9) });
      const [rhx, rhy] = headAt(rx, G + 12, 0.92, true);
      runV(rhx - 14, rhy + 4, bump(t, 0.4, 1.0), T, { dir: -1 });
      /* v13a — branches from the palms; they run out */
      const pick = (m) => es(t, 1.05 + (m.i % 4) * 0.06, 1.25 + (m.i % 4) * 0.06);
      const run = (m) => es(t, 1.3 + (m.i % 5) * 0.05, 1.85 + (m.i % 5) * 0.03, ease.io);
      const cry = es(t, 2.05, 2.3);
      const high = es(t, 3.05, 3.4);
      crowd.forEach((m, j) => {
        const pk = pick(m), rn = run(m);
        const x = lerp(m.x0, m.x1, rn);
        const turn = es(t, 0.45 + j * 0.03, 0.6 + j * 0.03);
        fade(m.fr, pk);
        const wave = Math.sin(t * 11 + j * 1.7) * 16 * cry;
        m.p.set({
          x, y: m.y, s: m.s, flip: turn < 0.5 && j % 2 === 1, walk: rn > 0 && rn < 1 ? x * 0.08 + m.ph : undefined, amt: 1.3,
          armB: pk < 1 ? bump(t, 1.0 + (m.i % 4) * 0.06, 1.3 + (m.i % 4) * 0.06) * 150 + pk * 40 : 40 + (rn > 0.99 ? 60 : 20) + cry * 50 + wave + high * 20,
          armF: 10 + cry * 30 + high * 40, head: -2 - cry * 6 - high * 6, blink: blinkAt(T, m.seed),
        });
      });
      /* Jesus comes */
      const jk = es(t, 1.2, 1.95, ease.out);
      const jx = lerp(1420, 900, jk);
      const walking = jk > 0 && jk < 0.995;
      jesus.set({ x: jx, y: G + 12, s: 1.02, flip: true, walk: walking ? jx * 0.055 : undefined, armF: 14 + es(t, 2.1, 2.4) * 40 + high * 20, armB: 10 + high * 60, head: -2 - high * 4, blink: blinkAt(T) });
      disc.forEach((p, i) => { const x = jx + 90 + i * 70; p.set({ x, y: G + 2 - i * 4, s: 0.94, flip: true, walk: walking ? x * 0.055 + i : undefined, armF: 12, head: 2, blink: blinkAt(T, i + 3) }); });
      /* v13b — Hosanna! */
      const pd = es(t, 2.05, 2.4, ease.back);
      pose(penEl, { x: 920, y: 110 - (1 - pd) * 600 - high * 30, r: T ? Math.sin(T * 2.2) * 1.2 : 0, oy: 0 });
      voices.forEach((v, i) => { const m = crowd[[4, 2, 3, 1][i]]; const x = lerp(m.x0, m.x1, run(m)); const [hx, hy] = headAt(x, m.y, m.s, false); v(hx + 14, hy + 4, cry * (0.7 + high * 0.3), T, { dir: 1 }); });
      /* v13c — the banner and the crown */
      const un = es(t, 3.05, 3.45);
      pose(banner, { x: 900, y: 205, sy: Math.max(0.01, un), o: un > 0.01 ? 1 : 0 });
      const ck = es(t, 3.25, 3.65, ease.back);
      swing(crown, 900, 340 - (1 - ck) * 700, ck > 0.001 ? T : 0, 1.6, 0.8, 2);
      fade(crown, ck > 0.001 ? 1 : 0);
      vis(glint, { x: 900, y: 330, s: bump(t, 3.4, 3.95) * 1.4 + 0.01, r: t * 60, o: bump(t, 3.4, 3.95) });

      S.cam.x = kf(t, [[0, 40], [0.6, 60], [1.1, 20], [1.9, 130], [2.5, 140], [3.2, 130], [4, 140]]);
      S.cam.y = kf(t, [[0, 0], [1, 0], [2, 10], [3.1, -20], [4, -30]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.04], [1.9, 1.08], [3, 1.06], [4, 1.02]]);
    };
  },
};
