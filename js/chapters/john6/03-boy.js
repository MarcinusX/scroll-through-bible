// J 6,8–10 — Andrew, Simon Peter's brother, stands up; he brings a small boy with a basket, who sets out on a
// cloth his five barley loaves and two fish — "but what are these among so many?": the camera draws back and the
// hillside is full of people. "Make the people sit down": the disciples wave the crowd down; there was much
// grass — it springs up green and tall; the men sit down in rows, about five thousand.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { flowers } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { hillSet, SPRING, LOOK, TW, folk, group, basket, barleyLoaf, fishCut, cloth, nameTag, speech, bigQuestion, labelTag, headAt, hand, kf, moving, tr, PI } from './lib.js';

const JX = 800;

export default {
  id: 'j6-boy',
  beats: [
    { v: 8 },
    { v: 9, text: '«Jest tu jeden chłopiec, który ma pięć chlebów jęczmiennych i dwie ryby,' },
    { v: 9, cont: true, text: 'lecz cóż to jest dla tak wielu?»' },
    { v: 10, text: 'Jezus zatem rzekł: «Każcie ludziom usiąść!»' },
    { v: 10, cont: true, text: 'A w miejscu tym było wiele trawy.' },
    { v: 10, cont: true, text: 'Usiedli więc mężczyźni, a liczba ich dochodziła do pięciu tysięcy.' },
  ],
  cam: { x: [-30, 30], y: [-40, 60], z: [0.94, 1.16] },
  build(S) {
    const c = S.c;
    const H = hillSet(S, { skyCols: SPRING });
    const { sfn, gfn } = H;

    /* the crowd on the meadow: standing groups (near), a far crowd, then the seated rows */
    const crowdL = S.layer({ par: 0.3, sh: 3 });
    const farMem = [];
    for (let i = 0; i < 70; i++) { const x = c.rr(-300, 1900); farMem.push({ x, y: sfn(x) - c.rr(0, 8), s: 0.2, flip: x > JX, o: folk(c) }); }
    // the crowds are sprites: drawn once, then moved and faded on the compositor (never repainted)
    const farCrowd = crowdL.sprite(group(c, farMem), 0, 0);
    const STAND = Array.from({ length: 12 }, (_, i) => {
      const x = 250 + i * 100 + c.rr(-20, 20), dy = (i % 2) * 34 + c.rr(14, 28);
      const mem = Array.from({ length: 5 }, (_, k) => ({ x: (k - 2) * 24 + c.rr(-6, 6), y: c.rr(-10, 10), s: 1, flip: x > JX, o: folk(c) }));
      const y = sfn(x) + dy;
      return { i, x, y, sp: crowdL.sprite(`<g transform="scale(${(0.34 + dy * 0.0024).toFixed(4)})">${group(c, mem)}</g>`, x, y) };
    });
    // the seated rows (men in front, as John counts them)
    const ROWS = [];
    [[14, 0.28, 12], [40, 0.34, 11], [68, 0.4, 10]].forEach(([dy, s, n], r) => {
      for (let i = 0; i < n; i++) {
        const x = 200 + (i + 0.5 + (r % 2) * 0.4) * (1300 / n);
        if (r === 2 && Math.abs(x - JX) < 120) continue;
        const mem = Array.from({ length: 5 }, (_, k) => ({ x: (k - 2) * 30 + c.rr(-5, 5), y: c.rr(-4, 4), s: 1, flip: x > JX, o: { ...folk(c, k !== 2), pose: 'sit' } }));
        const y = sfn(x) + dy;
        ROWS.push({ r, x, y, i: ROWS.length, sp: crowdL.sprite(`<g transform="scale(${s})">${group(c, mem)}</g>`, x, y) });
      }
    });
    // much grass: strips of tall blades that grow up in front of each row
    const grassL = S.layer({ par: 0.31, sh: 2 });
    const strips = [6, 30, 56, 84].map((dy, r) => {
      let d = '', d2 = '';
      for (let x = -700; x < 2300; x += c.rr(7, 13)) {
        const y = sfn(x) + dy + 10, hh = c.rr(14, 26) * (1 + r * 0.25);
        const b = c.ribbon(c.qbez([x, y], [x + c.rr(-4, 4), y - hh * 0.6], [x + c.rr(-10, 10), y - hh], 5), (u) => 3.6 - u * 3.2);
        if (c.chance(0.6)) d += b; else d2 += b;
      }
      const base = sfn(800) + dy + 10;
      return { r, base, el: grassL.add(`<g><path d="${d}" fill="${C.leaf}"/><path d="${d2}" fill="${C.wheatGreen}"/></g>`) };
    });
    const blooms = grassL.add(`<g>${flowers(c, { x0: 200, x1: 1400, y: 0, n: 30, fn: (x) => sfn(x) + 90 })}</g>`);

    /* Jesus and the disciples on the knoll; Andrew and the boy */
    const L = S.layer({ par: 0.5, sh: 5 });
    const SEAT = [[-340, TW.james, false], [260, LOOK.philip, true], [340, TW.john, true]];
    const seated = SEAT.map(([dx, o, fl], i) => ({ i, x: JX + dx, fl, seed: c.rr(0, 9), st: S.puppet(L.add(person(c, o))), si: S.puppet(L.add(person(c, { ...o, pose: 'sit' }))) }));
    const peter = S.puppet(L.add(person(c, { ...TW.peter, pose: 'sit' })));
    const andrew = S.puppet(L.add(person(c, { ...TW.andrew })));
    const cl = L.add(`<g>${cloth(c, 170, 22)}</g>`);
    const loaves = [0, 1, 2, 3, 4].map((i) => ({ i, el: L.add(`<g>${barleyLoaf(c, 15)}</g>`) }));
    const fish = [0, 1].map((i) => ({ i, el: L.add(`<g>${fishCut(c, { color: i ? C.lake3 : C.teal2, r: 0.8 })}</g>`) }));
    const boy = S.puppet(L.add(person(c, { ...LOOK.boy, holdF: `<g transform="translate(-36 13) rotate(70)">${basket(c, { w: 38, h: 22 })}</g>` })));
    const boyHold = boy.el.querySelector('.hold');
    const basketDown = L.add(`<g>${basket(c, { w: 38, h: 22 })}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'sit' })));

    /* tags and bubbles */
    const fx = S.layer({ par: 0.56, sh: 5 });
    const aTag = hanging(fx, nameTag(c, tr(['Andrzej,', 'brat Szymona Piotra'], ['Andrew,', 'Simon Peter’s brother']), { size: 17 }), { x: 0, y: 0, len: 700 });
    const nums = [0, 1, 2, 3, 4, 5, 6].map((i) => fx.add(`<g>${labelTag(String(i < 5 ? i + 1 : i - 4), 14)}</g>`));
    const q = fx.add(`<g>${speech(c, `<g transform="scale(.44) translate(0 -4)">${bigQuestion(c, 40, C.terracotta)}</g>`, { w: 48, h: 48, flip: true })}</g>`);
    const sitSay = fx.add(`<g>${speech(c, `<path d="${c.ribbon([[-14, -10], [0, 8], [14, -10]], 4)}" fill="${C.terracotta}"/><path d="${c.ribbon([[-20, 14], [20, 14]], 3)}" fill="${C.moss}"/>`, { w: 60, h: 48 })}</g>`);
    const t5000 = hanging(fx, `<g transform="scale(1.25)">${labelTag(tr('ok. 5000 mężczyzn', 'about 5000 men'), 22)}</g>`, { x: 0, y: 0, len: 800 });

    const BK = [[0.7, 330], [1.25, 690]];
    return (t, time) => {
      const T = time;
      H.update(T);

      /* v8 — Andrew, Simon Peter's brother, speaks up */
      const aUp = es(t, 0.05, 0.3);
      const ax = lerp(560, 620, aUp);
      const wide = es(t, 2.05, 2.3) * (1 - es(t, 2.95, 3.1));
      andrew.set({ x: ax, y: gfn(ax) + 16, s: 1.0, flip: false, armF: 20 + bump(t, 0.3, 1.0) * 60 + es(t, 1.05, 1.3) * 30 * (1 - es(t, 1.9, 2.05)) + wide * 60, armB: wide * 140 + bump(t, 0.35, 0.9) * 30, head: wide * -6, o: aUp > 0.01 ? 1 : 1, blink: blinkAt(T, 2) });
      peter.set({ x: 540, y: gfn(540) + 16, s: 0.94, flip: false, armF: 30 + bump(t, 0.3, 1.0) * 30, armB: 10, head: bump(t, 0.3, 1.0) * 6, blink: blinkAt(T, 4) });
      const tk = es(t, 0.15, 0.45, ease.out) * (1 - es(t, 0.95, 1.15));
      const [ahx, ahy] = headAt(ax, gfn(ax) + 16, 1.0, false);
      pose(aTag, { x: ahx, y: lerp(-500, ahy - 150, tk), r: Math.sin(T * 1.1) * 2, o: tk > 0.01 ? 1 : 0 });

      /* v9a — a boy with five barley loaves and two fish */
      const bx = kf(t, BK);
      const set = es(t, 1.3, 1.45);
      const hop = moving(t, BK) ? Math.abs(Math.sin(bx * 0.09)) * 5 : 0;
      boy.set({ x: bx, y: gfn(bx) + 18 - hop, s: 0.62, flip: false, walk: moving(t, BK) ? bx * 0.1 : undefined, armF: lerp(70, 10, set) + bump(t, 1.45, 1.9) * 40, armB: 20 + bump(t, 1.5, 1.9) * 60, head: -set * 8 + Math.sin(T * 1.3) * 2 * set, blink: blinkAt(T, 6) });
      if (boyHold) boyHold.setAttribute('opacity', String(1 - seg(t, 1.3, 1.34)));
      pose(basketDown, { x: bx + 40, y: gfn(bx + 40) + 16, o: seg(t, 1.3, 1.34) });
      const CLX = 730, CLY = gfn(CLX) + 22;
      pose(cl, { x: CLX, y: CLY, sx: es(t, 1.2, 1.35), o: seg(t, 1.2, 1.25) });
      loaves.forEach((l) => {
        const k = es(t, 1.35 + l.i * 0.07, 1.47 + l.i * 0.07, ease.back);
        pose(l.el, { x: CLX - 64 + l.i * 26, y: CLY - 4, s: k, o: k > 0.01 ? 1 : 0 });
      });
      fish.forEach((f) => {
        const k = es(t, 1.72 + f.i * 0.07, 1.84 + f.i * 0.07, ease.back);
        pose(f.el, { x: CLX + 70 + f.i * 4, y: CLY - 8 - f.i * 12, s: k, r: f.i ? -8 : 6, o: k > 0.01 ? 1 : 0 });
      });
      nums.forEach((n, i) => {
        const a = i < 5 ? 1.38 + i * 0.07 : 1.75 + (i - 5) * 0.07;
        const k = es(t, a, a + 0.1, ease.back) * (1 - es(t, 2.0, 2.15));
        const x = i < 5 ? CLX - 64 + i * 26 : CLX + 70 + (i - 5) * 26;
        pose(n, { x, y: CLY - 44, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v9b — but what is that for so many? */
      farCrowd.set({ o: es(t, 2.05, 2.4) });
      const qk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(q, { x: ahx - 6, y: ahy - 20, s: qk, o: qk > 0.01 ? 1 : 0 });

      /* v10a — "Make the people sit down" */
      const cmd = es(t, 3.05, 3.3);
      const go = es(t, 3.25, 3.6) * (1 - es(t, 4.8, 5.1));
      const sk = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.9, 4.05));
      jesus.set({ x: JX, y: gfn(JX) + 10, s: 1.04, flip: false, armF: 20 + cmd * 60 - es(t, 4.0, 4.3) * 40, armB: 10 + cmd * 70 * (1 - es(t, 4.0, 4.3)), head: -bump(t, 2.05, 2.9) * 4, blink: blinkAt(T, 1) });
      const [jhx, jhy] = headAt(JX, gfn(JX) + 10, 1.04, false, 62);
      pose(sitSay, { x: jhx + 26, y: jhy - 18, s: sk, o: sk > 0.01 ? 1 : 0 });
      seated.forEach((d) => {
        const up = es(t, 3.2 + d.i * 0.05, 3.3 + d.i * 0.05) * (1 - es(t, 5.4, 5.5));
        const dir = d.fl ? 1 : -1;
        const x = d.x + dir * go * 60;
        const o = { x, y: gfn(x) + 14, s: 0.94, blink: blinkAt(T, d.seed) };
        d.st.set({ ...o, flip: !d.fl, o: up, armF: 60 + Math.sin(T * 3 + d.i) * 20 * go, armB: 100 + Math.sin(T * 3 + d.i + 1) * 30 * go, walk: go > 0.02 && go < 0.98 ? x * 0.06 : undefined });
        d.si.set({ ...o, x: d.x, y: gfn(d.x) + 14, flip: d.fl, o: 1 - up, armF: 20, armB: 10, head: -es(t, 2.05, 2.3) * 6 });
      });

      /* standing groups → seated rows; the grass grows */
      const sat = es(t, 5.05, 5.4);
      STAND.forEach((g) => g.sp.set({ y: g.y - bump(t, 3.4, 3.9) * 3, o: 1 - es(t, 5.05 + (g.i % 4) * 0.05, 5.2 + (g.i % 4) * 0.05) }));
      ROWS.forEach((r) => {
        const k = es(t, 5.05 + (r.i % 12) * 0.025, 5.25 + (r.i % 12) * 0.025);
        r.sp.set({ y: r.y + (1 - k) * 8, o: k });
      });
      const grow = es(t, 4.05, 4.5, ease.out);
      strips.forEach((g) => pose(g.el, { y: g.base, sy: 0.05 + grow * 0.95, oy: g.base, o: grow > 0.01 ? 1 : 0 }));
      pose(blooms, { o: es(t, 4.3, 4.6) });
      H.slopeL.fade(1);

      /* v10c — about five thousand */
      const k5 = es(t, 5.3, 5.55, ease.back);
      pose(t5000, { x: 800, y: lerp(-500, 250, k5), r: Math.sin(T * 1.1) * 2, o: k5 > 0.01 ? 1 : 0 });

      S.cam.z = kf(t, [[0, 1.1], [0.9, 1.12], [1.3, 1.14], [2.0, 1.12], [2.4, 0.98], [3.0, 0.98], [3.3, 1.02], [4.0, 1.0], [4.5, 0.96], [5.5, 0.94]]);
      S.cam.y = kf(t, [[0, 50], [1.3, 60], [2.0, 50], [2.4, 0], [3.3, 10], [4.5, -20], [5.5, -30]]);
      S.cam.x = kf(t, [[0, -20], [1.0, -10], [1.5, 0], [2.4, 0]]);
    };
  },
};
