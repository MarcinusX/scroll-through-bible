// J 11,11–16 — "Our friend Lazarus has fallen asleep; I go to wake him": a round plate shows the friend asleep in his
// bed, little Z's rising, and a small sun comes up at its rim. Peter, relieved: "If he sleeps, he'll get well" — a
// thought of the sick man up on his feet. Two plates: over Jesus the closed cave (He meant death), over the disciples
// the bed and the Z's (they thought of sleep). "Lazarus is dead" — the sleep plate turns over to show the cave, and the
// disciples bow their heads. "I am glad, for your sakes, so that you may believe" — little heart-windows open over
// them, full of light. "Let us go to him!" He turns toward Judea. Thomas, the Twin, steps out to his companions:
// "Let us also go, that we may die with Him" — he lifts his arm and strides after Jesus, and all follow.
import { C, person, CAST, blinkAt } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  jordanSet, AFTERNOON, DISC, LAZARUS, bedIcon, caveIcon, zzz, hungPlate, thought, heartWindow, openWindow, heart, nameTag, hang2, strip, signpost,
  withFace, faceBits, vis, kf, moving, pose, sheet, shade, mix, lerp, tr, PI, FONT,
} from './lib.js';

const F = 700;

export default {
  id: 'j11-friend',
  beats: [
    { v: 11, text: 'To powiedział, a następnie rzekł do nich:' },
    { v: 11, cont: true, text: '«Łazarz, przyjaciel nasz, zasnął, lecz idę, aby go obudzić».' },
    { v: 12 },
    { v: 13 },
    { v: 14 },
    { v: 15, text: 'ale raduję się, że Mnie tam nie było, ze względu na was, abyście uwierzyli.' },
    { v: 15, cont: true, text: 'Lecz chodźmy do niego!»' },
    { v: 16, text: 'Na to Tomasz, zwany Didymos, rzekł do współuczniów:' },
    { v: 16, cont: true, text: '«Chodźmy także i my, aby razem z Nim umrzeć».' },
  ],
  cam: { x: [-240, 60], y: [-80, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const set = jordanSet(S, { skyCols: AFTERNOON, sunAt: [1180, 200] });
    const A = S.layer({ par: 0.52, sh: 5 });
    // two rows on the right: back row (smaller) then front row; Thomas front-left, Peter front-middle
    const ROWS = [
      { k: 1, x: 985, y: F - 8, s: 0.88 }, { k: 2, x: 1085, y: F - 8, s: 0.88 }, { k: 4, x: 1185, y: F - 8, s: 0.88 },
      { k: 5, x: 930, y: F + 16, s: 0.95 }, { k: 0, x: 1035, y: F + 16, s: 0.95 }, { k: 3, x: 1135, y: F + 16, s: 0.95 },
    ];
    const disc = ROWS.map((r, i) => ({ ...r, i, p: S.puppet(A.add(withFace(person(c, DISC[r.k]), faceBits(c)))) }));
    disc.forEach((d) => { d.sad = d.p.el.querySelector('[data-part="sad"]'); });
    const thomas = disc.find((d) => d.k === 5), peter = disc.find((d) => d.k === 0);
    const jesus = S.puppet(A.add(person(c, CAST.jesus)));
    set.front();

    const X = S.layer({ par: 0.56, sh: 6 });
    const sleepIcon = `<g transform="translate(0 26) scale(1.3)">${bedIcon(c, LAZARUS)}</g><g transform="translate(26 -18)">${zzz(c, C.dustyBlue)}</g>`;
    const sleep = X.add(`<g>${hungPlate(c, sleepIcon, { r: 72, fill: mix(C.skyBlue, C.cream, 0.4) })}</g>`);
    const zs = ['.z0', '.z1', '.z2'].map((q) => sleep.querySelector(q));
    const wake = X.add(`<g><circle r="40" fill="url(#warm-glow)"/>${sheet().p(c.cut(c.star(0, 0, 18, 13, 12, 0), 0.3, 3), C.sunRay).p(c.cut(c.circ(0, 0, 12, 14), 0.3, 3), C.sun).out()}</g>`);
    const friend = X.add(`<g>${strip(c, tr('przyjaciel nasz', 'our friend'), { size: 17 })}</g>`);
    // Peter's thought: the bed → up and well
    const well = `<g transform="translate(-30 24) scale(.62)">${bedIcon(c, LAZARUS)}</g><path d="${c.ribbon([[-4, 4], [12, 4]], 3)}" fill="${C.terracotta}"/><path d="${c.cut([[12, -2], [20, 4], [12, 10]], 0.2, 2)}" fill="${C.terracotta}"/><g transform="translate(38 36) scale(.28)">${person(c, { ...LAZARUS, holdF: '', holdB: '' })}</g>`;
    const think = X.add(`<g>${thought(c, well, { w: 140, h: 96 })}</g>`);
    // two readings: death (over Jesus) and sleep (over the disciples)
    const deathP = X.add(`<g>${hungPlate(c, `<g transform="translate(0 30)">${caveIcon(c, { sc: 1.1 })}</g>`, { r: 64, fill: mix(C.stone, C.cream, 0.4) })}</g>`);
    const deathT = X.add(`<g>${strip(c, tr('śmierć', 'death'), { size: 16 })}</g>`);
    const sleepT = X.add(`<g>${strip(c, tr('sen', 'sleep'), { size: 16 })}</g>`);
    // the sleep plate's back: the cave
    const back = X.add(`<g>${hungPlate(c, `<g transform="translate(0 30)">${caveIcon(c, { sc: 1.3 })}</g>`, { r: 72, fill: mix(C.stone, C.cream, 0.4) })}</g>`);
    // faith: heart windows over the disciples
    const wins = disc.map((d) => X.add(`<g>${hang2(heartWindow(c, 'bright', 15), 0.01, 300)}</g>`));
    const post = X.add(`<g>${signpost(c, tr('Betania', 'Bethany'), { size: 24, dir: -1 })}</g>`);
    const tag = X.add(`<g>${hang2(nameTag(c, [tr('Tomasz', 'Thomas'), tr('zwany Didymos', 'called Didymus')], { size: 16 }), 26, 300)}</g>`);
    const brave = X.add(`<g>${heart(c, 18, C.terracotta)}</g>`);

    return (t, time) => {
      const T = time;
      pose(set.sunEl, { x: 1180, y: 200, r: Math.sin(T * 0.6) * 1.5 });
      pose(set.cl, { x: 600 + Math.sin(T * 0.1) * 20, y: 150, r: 0 });

      /* v11 — the friend asleep; to wake him */
      const sk = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 2.1, 2.3)) + es(t, 3.05, 3.35, ease.out) * (1 - es(t, 4.0, 4.1));
      const sx = t < 2.5 ? 800 : 1060;
      const flipK = es(t, 4.05, 4.4);         // v14: the sleep plate turns over
      vis(sleep, { x: sx, y: 290 - (1 - sk) * 520, sx: Math.max(0.02, 1 - flipK * 2) * (t > 4.05 ? 1 : 1), sy: 1, r: Math.sin(T * 0.7) * 1.2, o: sk > 0.01 && flipK < 0.5 ? 1 : 0 });
      zs.forEach((z, i) => { if (z) z.setAttribute('opacity', (0.4 + 0.6 * Math.abs(Math.sin(T * 1.2 - i * 0.6))).toFixed(2)); });
      const wk = es(t, 1.55, 1.85, ease.back) * (1 - es(t, 2.1, 2.3));
      vis(wake, { x: 800 + 62, y: 290 - 56 + (1 - wk) * 30, s: wk, r: T * 20, o: wk > 0.01 ? 1 : 0 });
      const fk = es(t, 1.3, 1.5) * (1 - es(t, 2.1, 2.3));
      vis(friend, { x: 800, y: 390, o: fk });

      /* v12 — Peter: "he will get well" */
      const pk = es(t, 2.05, 2.35, ease.back) * (1 - es(t, 2.9, 3.05));
      vis(think, { x: 1050, y: 470, s: pk, o: pk > 0.01 ? 1 : 0 });

      /* v13 — two readings */
      const dk = es(t, 3.05, 3.35, ease.out) * (1 - es(t, 4.0, 4.2));
      vis(deathP, { x: 800, y: 290 - (1 - dk) * 520, r: Math.sin(T * 0.8) * 1.2, o: dk > 0.01 ? 1 : 0 });
      vis(deathT, { x: 800, y: 380 - (1 - dk) * 520, o: dk > 0.01 ? es(t, 3.3, 3.45) : 0 });
      vis(sleepT, { x: 1060, y: 388 - (1 - sk) * 520, o: t > 3 && sk > 0.01 ? es(t, 3.3, 3.45) * (1 - es(t, 4.0, 4.1)) : 0 });
      /* v14 — "Lazarus is dead": the plate turns over */
      const bk = es(t, 4.2, 4.4) * (1 - es(t, 4.95, 5.15, ease.in));
      vis(back, { x: t < 4.4 ? 1060 : lerp(1060, 800, es(t, 4.4, 4.8)), y: 290 - (1 - es(t, 4.95, 5.15, ease.in) * 0) * 0 - es(t, 4.95, 5.15, ease.in) * 520, sx: Math.max(0.02, (flipK - 0.5) * 2), sy: 1, r: Math.sin(T * 0.7) * 1.2, o: flipK >= 0.5 && bk > 0.01 ? 1 : 0 });
      const grief = es(t, 4.3, 4.6) * (1 - es(t, 5.3, 5.6));

      /* v15a — heart windows open: that you may believe */
      wins.forEach((w, i) => {
        const d = disc[i];
        const k = es(t, 5.1 + i * 0.06, 5.35 + i * 0.06, ease.back) * (1 - es(t, 5.95, 6.15));
        vis(w, { x: d.x, y: d.y - 250 * d.s - (1 - k) * 420, r: Math.sin(T + i) * 2, o: k > 0.01 ? 1 : 0 });
        openWindow(w, es(t, 5.4 + i * 0.05, 5.6 + i * 0.05), 15);
      });

      /* v15b — "Let us go to him": Jesus turns to Judea */
      const go = es(t, 6.1, 6.4);
      const sk2 = es(t, 6.2, 6.5, ease.back) * (1 - es(t, 7.0, 7.2));
      vis(post, { x: 560, y: 560 - (1 - sk2) * 560, r: Math.sin(T * 0.7) * 1.2, o: sk2 > 0.01 ? 1 : 0 });
      const JK = [[6.2, 800], [6.9, 740], [8.1, 740], [8.95, 540]];
      const jx = kf(t, JK);
      const speak = es(t, 1.0, 1.2) * (1 - es(t, 1.9, 2.05)) + es(t, 5.05, 5.3) * (1 - es(t, 5.9, 6.05));
      jesus.set({ x: jx, y: F + 12, s: 1.04, flip: go > 0.5, walk: moving(t, JK) ? jx * 0.1 : undefined, armF: 20 + speak * 50 + bump(t, 6.1, 6.9) * 60, armB: 10 + speak * 50, head: -grief * 0 + es(t, 4.1, 4.3) * (1 - es(t, 4.9, 5.0)) * 6, blink: blinkAt(T, 1) });

      /* v16 — Thomas */
      const step = es(t, 7.1, 7.5);
      const call = es(t, 8.05, 8.35);
      disc.forEach((d) => {
        const isT = d === thomas, isP = d === peter;
        const talk = isP ? es(t, 2.05, 2.3) * (1 - es(t, 2.85, 3.0)) : 0;
        const K = [[8.2 + d.i * 0.04, d.x], [8.95, d.x - 280]];
        let x = t < 8.2 ? d.x : kf(t, K);
        if (isT) x = t < 8.2 ? lerp(d.x, 880, step) : kf(t, [[8.2, 880], [8.95, 640]]);
        const fl = isT ? (t > 7.3 && t < 8.3 ? false : true) : true;
        const walking = isT ? (moving(t, [[7.1, d.x], [7.5, 880]]) || moving(t, [[8.2, 880], [8.95, 640]])) : moving(t, K);
        d.p.set({
          x, y: d.y, s: d.s, flip: fl, walk: walking ? x * 0.11 : undefined,
          armF: 10 + talk * 60 + (isT ? es(t, 7.4, 7.7) * 50 + call * 30 : 0), armB: 6 + talk * 40 + (isT ? call * 150 : 0),
          head: grief * 12 - (isT ? step * 4 : 0), lean: isT ? -call * 4 : 0, blink: blinkAt(T, d.i + 5), o: 1,
        });
        if (d.sad) d.sad.setAttribute('opacity', grief.toFixed(2));
      });
      const tk = es(t, 7.15, 7.45, ease.back) * (1 - es(t, 8.1, 8.3));
      vis(tag, { x: 880, y: 420 - (1 - tk) * 480, r: Math.sin(T * 0.8) * 1.5, o: tk > 0.01 ? 1 : 0 });
      const bh = es(t, 8.3, 8.6, ease.back);
      const tx = t < 8.2 ? 880 : kf(t, [[8.2, 880], [8.95, 640]]);
      vis(brave, { x: tx + 4, y: F + 16 - 250 * 0.95 + Math.sin(T * 2) * 3, s: bh * (1 + Math.sin(T * 3) * 0.05), o: bh > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1, 0], [2, 40], [3, 40], [4, 20], [5, 40], [6, 40], [7, 0], [8, 0], [9, -160]]);
      S.cam.y = kf(t, [[0, 0], [1, -60], [2, -30], [3, -60], [4, -60], [5, -40], [6, -20], [7, -20], [8, 0], [9, 0]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.0], [2, 1.04], [3, 1.0], [4, 1.02], [5, 1.02], [6, 1.0], [7, 1.06], [8, 1.08], [9, 1.02]]);
    };
  },
};
