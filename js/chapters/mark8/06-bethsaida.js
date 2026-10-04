// Mk 8,22–26 — the blind man of Bethsaida. Jesus leads him by the hand out of the village,
// touches his eyes: first he sees people "like trees, walking" (we look through his eyes — a hazy,
// blurred view with tree-shaped walkers); a second touch, and everything is sharp and bright.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, house, olive, palm, bush, rock, sun, cloud, grass, flowers } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, hand, headAt, speech, GLYPH, spark, say, man, staff, signpost, treeWalker, eyeWindow, LOOK, PI } from './lib.js';

const GY = 660;
const MEET = 700, HEAL = 930;

export default {
  id: 'm8-bethsaida',
  beats: [
    { v: 22, text: 'Potem przyszli do Betsaidy.' },
    { v: 22, cont: true, text: 'Tam przyprowadzili Mu niewidomego i prosili, żeby się go dotknął.' },
    { v: 23, text: 'On ujął niewidomego za rękę i wyprowadził go poza wieś.' },
    { v: 23, cont: true, text: 'Zwilżył mu oczy śliną, położył na niego ręce i zapytał: «Czy widzisz co?»' },
    { v: 24 },
    { v: 25, text: 'Potem znowu położył ręce na jego oczy.' },
    { v: 25, cont: true, text: 'I przejrzał [on] zupełnie, i został uzdrowiony; wszystko widział teraz jasno i wyraźnie.' },
    { v: 26 },
  ],
  cam: { x: [-280, 280], y: [-20, 90], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const SKY = ['#cfe2df', '#eee8d2', '#f6ead3'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const SUNX = S.portrait ? 1010 : 1180;   // phone: the sun clear of the thread
    const sunEl = hanging(hangL, sun(c, 48), { x: SUNX, y: 160, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 450, y: 150, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 150), { x: 1150, y: 250, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 240, speed: 45, scale: 0.5 });

    /* ---------- land: the lake behind, hills, Bethsaida on the left, fields and olives on the right ---------- */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1100, 380, 140], color: C.hillFar, x0: -1400, x1: 3000 }).markup);
    S.layer({ par: 0.14, sh: 1 }).add(band(c, { y: 474, amps: [2, 1], lens: [300, 90], color: C.lake, x0: -1400, x1: 800, j: 0.5 }).markup);
    const hills = S.layer({ par: 0.22, sh: 3 });
    const h2 = hillsWith(c, { y: 520, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 20, treeColor: C.sage, treeH: 22, x0: -1400, x1: 3000 });
    hills.add(h2.markup);
    hills.add(house(c, 1560, h2.fn(1560) + 10, 50, 34) + olive(c, 1500, h2.fn(1500) + 10, 0.45));
    const village = S.layer({ par: 0.45, sh: 4 });
    const vfn = c.wave(GY - 60, [4, 2], [600, 160]);
    village.add(sheet().p(c.ridge(vfn, -1400, 3000, 1700, 12, 1), C.sand).out());
    village.add(grass(c, { x0: 700, x1: 2400, y: GY - 60, fn: vfn, n: 40, h: 12, color: C.olive }) + flowers(c, { x0: 950, x1: 2000, y: GY - 60, fn: vfn, n: 22 }));
    let vh = '';
    [[-120, 90, 64], [-20, 70, 52], [70, 100, 72], [190, 80, 58], [290, 110, 76], [410, 86, 60]].forEach(([x, w, h]) => { vh += house(c, x, vfn(x) + 8, w, h); });
    village.add(vh + palm(c, 30, vfn(30) + 10, 200) + palm(c, 480, vfn(480) + 10, 170));
    // a low village wall with a gate
    const wall = sheet();
    wall.p(c.cut([[-400, vfn(-400) + 10], [500, vfn(500) + 10], [500, vfn(500) - 26], [-400, vfn(-400) - 26]], 0.8, 10), C.stone2);
    wall.p(c.cut(c.rect(500, vfn(500) - 80, 18, 92), 0.5, 6) + c.cut(c.rect(590, vfn(590) - 80, 18, 92), 0.5, 6) + c.cut([[492, vfn(500) - 84], [616, vfn(590) - 84], [616, vfn(590) - 70], [492, vfn(500) - 70]], 0.5, 6), C.stone);
    village.add(wall.out());
    village.add(`<g transform="translate(650 ${vfn(650) + 20})">${signpost(c, tr('Betsaida', 'Bethsaida'), { size: 19, dir: -1 })}</g>`);
    village.add(olive(c, 1130, vfn(1130) + 12, 1.1) + olive(c, 1380, vfn(1380) + 12, 0.9) + bush(c, 820, vfn(820) + 10, 60, C.sage));

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.6, sh: 5 });
    const dis = [CAST.peter, CAST.john, CAST.andrew].map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));
    const friends = [0, 1].map((i) => ({ i, p: S.puppet(P.add(person(c, man(c)))), seed: c.rr(0, 9) }));
    const blind = S.puppet(P.add(person(c, { ...LOOK.blind, eyes: 'closed', holdB: staff(c, 170) })));
    const seer = S.puppet(P.add(person(c, { ...LOOK.blind, holdB: staff(c, 170) })));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.6, sh: 3 });
    const plead = fx.add(`<g>${speech(c, GLYPH.bang(c, C.teal), { w: 40, h: 40, flip: true })}</g>`);
    const touch = fx.add(`<g>${spark(c, 12)}</g>`);
    const touch2 = fx.add(`<g>${spark(c, 16)}</g>`);
    const ask = fx.add(`<g>${say(c, tr('Czy widzisz co?', 'Do you see anything?'), { size: 20 })}</g>`);
    const joy = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g>${spark(c, 9)}</g>`) }));
    const noVillage = fx.add(`<g>${speech(c, `<g transform="scale(.28) translate(0 40)">${house(c, -30, 0, 60, 44, { stairs: false })}</g><path d="M-18 -18L18 18M18 -18L-18 18" stroke="${C.terracotta}" stroke-width="4.5" stroke-linecap="round"/>`, { w: 58, h: 52, flip: true })}</g>`);

    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(bush(c, 60, 900, 220, C.sage, C.moss) + rock(c, 1560, 920, 240, 90, C.rock2) + bush(c, 1700, 900, 180, C.moss));

    /* ---------- through his eyes: the hazy view, and the clear one ---------- */
    const povHaze = S.layer({ par: 0, sh: 1, flat: true, blur: 6 });
    povHaze.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#d9d6cb"/><g>${sheet().p(c.ridge(c.wave(560, [14, 5], [500, 160]), -900, 2500, 1700, 20, 2), '#c3c6ae').p(c.ridge(c.wave(630, [8, 3], [400, 130]), -900, 2500, 1700, 20, 2), '#d2c7a8').out(false)}</g>`);
    const walkers = [[470, 1.25, 1], [640, 1.0, -1], [950, 1.05, 1], [1110, 1.3, -1]].map(([x, s, dir], i) => {
      const el = povHaze.add(`<g><g data-k="tw${i}">${treeWalker(c, { h: 210, leaf: ['#7f9470', '#8c9c78', '#74886a'][i % 3], trunk: ['#86705a', '#7a6650', '#8f765c'][i % 3] })}</g></g>`);
      const g = S.$('tw' + i);
      return { i, g, legF: g.querySelector('.legF'), legB: g.querySelector('.legB'), x, s, dir, y: 640 + (i % 2) * 20 };
    });
    povHaze.add(`<g><g transform="translate(790 960) scale(2.4)">${person(c, { ...CAST.jesus })}</g></g>`);
    povHaze.add(`<g><path d="${c.cut(c.blob(560, 430, 260, 70, 12, 0.2), 1, 12)}" fill="#e9e6dc" opacity=".6"/><path d="${c.cut(c.blob(1080, 520, 300, 80, 12, 0.2), 1, 12)}" fill="#e9e6dc" opacity=".55"/></g>`);
    const povClear = S.layer({ par: 0, sh: 3 });
    povClear.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#bfe0e2"/>`);
    povClear.add(sheet().p(c.ridge(c.wave(540, [18, 6], [500, 160]), -900, 2500, 1700, 12, 1), C.hillNear).out());
    povClear.add(sheet().p(c.ridge(c.wave(640, [8, 3], [400, 130]), -900, 2500, 1700, 12, 1), C.sand).out() + olive(c, 280, 650, 1.2) + olive(c, 1300, 650, 1.1) + flowers(c, { x0: 380, x1: 1250, y: 650, n: 26, h: 26, colors: [C.jesusMantle, C.terracotta, C.sun, C.lavender] }));
    const clearPeople = [[470, 1.15, 1, CAST.peter], [640, 0.95, -1, CAST.john], [950, 1.0, 1, CAST.andrew], [1110, 1.2, -1, man(c)]].map(([x, s, dir, o], i) => ({ i, x, s, dir, p: S.puppet(povClear.add(person(c, o))), y: 640 + (i % 2) * 20 }));
    const clearJ = S.puppet(povClear.add(person(c, { ...CAST.jesus })));
    const eyeL = S.layer({ par: 0, sh: 1, flat: true });
    const eyeEl = eyeL.add(`<g>${eyeWindow(c, 840, 540, '#2e2622')}</g>`);

    return (t, time) => {
      const T = time;
      sk.blend(SKY, ['#c3e0e2', '#f3ecd4', '#f8efd8'], es(t, 5.9, 6.3));
      swing(sunEl, SUNX, 160, T, 1.1, 0.7);
      swing(cl1, 450 + Math.sin(T * 0.1) * 26, 150, T, 1.4, 0.6, 1);
      swing(cl2, 1150 + Math.sin(T * 0.13 + 2) * 26, 250, T, 1.4, 0.8, 2);
      birds(T, 1);

      /* v22a — arrival */
      const jKeys = [[0.02, [1150, GY]], [0.7, [MEET, GY]], [2.1, [MEET, GY]], [2.85, [HEAL, GY]], [7.1, [HEAL, GY]]];
      const [jx] = kf(t, jKeys, (u) => u);
      const jw = moving(t, jKeys, 1);
      // disciples follow him in and stay by the gate
      dis.forEach((d) => {
        const keys = [[0.08 + d.i * (S.portrait ? 0.04 : 0.06), 1260 + d.i * 70], [(S.portrait ? 0.56 : 0.8) + d.i * (S.portrait ? 0.04 : 0.06), 780 + d.i * 60], [2.3, 780 + d.i * 60], [3.0, S.portrait ? 680 + d.i * 50 : 610 + d.i * 55]]   // phone: they wait in view;
        const x = kf(t, keys, (u) => u);
        const w = moving(t, keys, 1);
        const lookAt = t > 2.9 ? x < HEAL : true;
        d.p.set({ x, y: GY - 22 - d.i * 4, s: 0.76, flip: w ? true : !lookAt, walk: w ? x * 0.05 : undefined, head: bump(t, 6, 7) * -6, armF: bump(t, 6.1, 7) * 60, blink: blinkAt(T, d.seed) });
      });

      /* v22b — friends bring the blind man and beg */
      const bKeys = [[1.02, 380], [1.6, MEET - 90], [2.1, MEET - 90], [2.85, HEAL - 72], [7.05, HEAL - 72], [7.9, 1560]];
      const bx = kf(t, bKeys, (u) => u);
      const bw = moving(t, bKeys, 1);
      friends.forEach((f) => {
        const keys = [[1.0 + f.i * 0.05, 330 - f.i * 60], [1.6 + f.i * 0.05, MEET - 150 - f.i * 60]];
        const x = kf(t, keys, (u) => u);
        const w = moving(t, keys, 1);
        const beg = bump(t, 1.55, 2.0);
        f.p.set({ x, y: GY + 4 + f.i * 6, s: 0.84, flip: false, o: seg(t, 0.95, 1.05), walk: w ? x * 0.05 : undefined, armF: 20 + beg * 70 + (f.i === 0 && w ? 50 : 0), armB: beg * 40, head: -beg * 10 + es(t, 2.1, 2.5) * 6, blink: blinkAt(T, f.seed) });
      });
      const healed = es(t, 6.05, 6.12);
      const seeing = es(t, 4.05, 4.2);
      const followJ = t > 2.0 && t < 2.9;
      const bArmF = bw && !followJ ? 40 : followJ ? 72 : 20 + bump(t, 3.1, 3.5) * 10;
      const home = t > 7.05;
      blind.set({ x: bx, y: GY + 6, s: 0.86, flip: false, o: seg(t, 0.95, 1.05) * (1 - healed), walk: bw ? bx * 0.045 : undefined, amt: 0.6, armF: bArmF, armB: 30, head: -6 + seeing * -10, lean: bw ? 3 : 0, blink: 0 });
      const wave = home ? bump(t, 7.05, 7.9) : 0;
      seer.set({ x: bx, y: GY + 6, s: 0.86, flip: false, o: healed, walk: bw ? bx * 0.05 : undefined, armF: 20 + bump(t, 6.2, 7) * 40 + wave * 120, armB: 30 + bump(t, 6.2, 7) * 90, head: -bump(t, 6.1, 6.9) * 16, blink: blinkAt(T, 2) });

      /* Jesus: arrives, takes his hand, leads him out, touches his eyes twice, sends him home */
      const lead = followJ;
      const touch1 = bump(t, 3.05, 3.7);
      const ask_ = es(t, 3.65, 3.8);
      const again = bump(t, 5.05, 5.9);
      const send = es(t, 7.02, 7.3);
      jesus.set({
        x: jx, y: GY, s: 0.9, flip: jw ? jx > kf(t + 0.02, jKeys, (u) => u)[0] : t < 2.0 || (t > 2.9 && t < 7.0),
        walk: jw ? jx * 0.05 : undefined,
        armF: 16 + bump(t, 1.95, 2.15) * 50 + touch1 * 88 + again * 92 + ask_ * (1 - es(t, 3.95, 4.1)) * 30 + send * 70,
        armB: lead ? -35 : 8 + touch1 * 30 + again * 70 + send * 20,
        head: touch1 * 4 + send * -4, lean: (touch1 + again) * -4, blink: blinkAt(T),
      });
      const [hx, hy] = headAt(bx, GY + 6, 0.86, false);
      pose(touch, { x: hx + 14, y: hy, s: bump(t, 3.2, 3.6), r: T * 40, o: t > 3.2 && t < 3.6 ? 1 : 0 });
      pose(touch2, { x: hx + 14, y: hy, s: bump(t, 5.3, 5.95) * 1.3, r: T * 40, o: t > 5.3 && t < 5.95 ? 1 : 0 });
      const aq = es(t, 3.7, 3.85, ease.back) * (1 - es(t, 4.0, 4.06));
      const [jhx, jhy] = headAt(HEAL, GY, 0.9, false);
      pose(ask, { x: jhx + 10, y: jhy - 36, s: aq, o: aq > 0.02 ? 1 : 0 });
      const pl = es(t, 1.55, 1.7, ease.back) * (1 - es(t, 2.0, 2.1));
      pose(plead, { x: MEET - 180, y: GY - 200, s: pl, o: pl > 0.02 ? 1 : 0 });
      const nv = es(t, 7.2, 7.4, ease.back) * (1 - es(t, 7.95, 8));
      pose(noVillage, { x: jhx - 24, y: jhy - 36, s: nv, o: nv > 0.02 ? 1 : 0 });
      joy.forEach((j) => {
        const k = ((T * 0.6 + j.i / 5) % 1);
        const [sx, sy] = headAt(bx, GY + 6, 0.86, false);
        pose(j.el, { x: sx + Math.cos(j.i * 1.3) * 40, y: sy - 20 - k * 60, s: 0.6 + k * 0.5, o: es(t, 6.9, 7.1) * Math.sin(k * PI) * (1 - es(t, 7.8, 8)) });
      });

      /* through his eyes */
      const hazy = es(t, 4.02, 4.2) * (1 - es(t, 4.88, 5.02));
      const clear = es(t, 6.1, 6.3) * (1 - es(t, 6.88, 7.02));
      povHaze.fade(hazy);
      povClear.fade(clear);
      eyeL.fade(Math.max(hazy, clear));
      pose(eyeEl, { x: 800, y: 470, s: 1 + clear * 0.25 + Math.sin(T * 0.8) * 0.01, sy: 1 - bump(t, 4.02, 4.3) * 0.3 });
      walkers.forEach((w) => {
        const x = w.x + w.dir * (hazy > 0 ? seg(t, 4.0, 5.0) * 110 : 0);
        const ph = x * 0.06;
        pose(w.g, { x, y: w.y, s: w.s, sx: w.dir < 0 ? -1 : 1 });
        pose(w.legF, { x: 6 + Math.sin(ph) * 8, y: -63 - Math.max(0, Math.cos(ph)) * 4 });
        pose(w.legB, { x: -6 - Math.sin(ph) * 8, y: -63 - Math.max(0, -Math.cos(ph)) * 4 });
      });
      clearPeople.forEach((m) => {
        const x = m.x + m.dir * seg(t, 6.0, 7.0) * 110;
        m.p.set({ x, y: m.y, s: m.s, flip: m.dir < 0, walk: clear > 0 ? x * 0.06 : undefined, blink: blinkAt(T, m.i) });
      });
      clearJ.set({ x: 790, y: 960, s: 2.4, armF: 30 + Math.sin(T * 1.3) * 3, head: 4, blink: blinkAt(T, 1.5) });

      /* camera: the village → out to the fields */
      S.cam.x = lerp(-240, -80, es(t, 0, 1.2)) + es(t, 2.05, 2.9) * 300 + es(t, 7.1, 7.9) * 60;
      S.cam.z = 1.04 + es(t, 0.8, 1.3) * 0.08 - es(t, 2.05, 2.6) * 0.04 + es(t, 2.9, 3.3) * 0.1 - es(t, 7.1, 7.8) * 0.1;
      S.cam.y = 30 + es(t, 2.9, 3.3) * 40 - es(t, 7.1, 7.8) * 30;
    };
  },
};
