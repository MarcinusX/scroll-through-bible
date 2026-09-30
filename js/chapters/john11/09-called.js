// J 11,28–31 — back in the house the bed stands empty. Mary sits on the floor among the mourners. Martha slips in
// through the door, bends to her sister and whispers behind her hand: "The Teacher is here and is calling you" — a
// tiny bubble with His portrait. Mary lifts her head, rises at once and hurries out; through the doorway we see her
// running up the road. A plate shows where Jesus still waits: outside the village, under an olive tree, where Martha
// met Him. The mourners get up and follow her out, thinking she is going to the tomb to weep there.
import { C, person, CAST, blinkAt } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { house as houseM, olive as oliveM, band as bandM } from '../../assets/nature.js';
import {
  homeSet, HOME, SOFT, DISC, mournerOpts, martha, mary, faceBits, medallion, iconBubble, thought, caveIcon, framed, strip,
  vis, kf, moving, pose, sheet, shade, mix, lerp, tr, PI,
} from './lib.js';

const F = HOME.floor;

export default {
  id: 'j11-called',
  beats: [
    { v: 28, text: 'Gdy to powiedziała, odeszła i przywołała po kryjomu swoją siostrę, mówiąc:' },
    { v: 28, cont: true, text: '«Nauczyciel jest i woła cię».' },
    { v: 29 },
    { v: 30 },
    { v: 31, text: 'Żydzi, którzy byli z nią w domu i pocieszali ją, widząc, że Maria szybko wstała i wyszła, udali się za nią,' },
    { v: 31, cont: true, text: 'przekonani, że idzie do grobu, aby tam płakać.' },
  ],
  cam: { x: [-80, 40], y: [-80, 30], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = homeSet(S, { skyCols: SOFT });
    const outRun = S.puppet(set.outL.add(mary(c)));
    const outM = [0, 1, 2].map((i) => S.puppet(set.outL.add(person(c, mournerOpts(i + 1)))));
    // the empty bed: a folded blanket
    set.props.add(`<g transform="translate(${HOME.bedX + 70} ${F - 48})">${sheet().p(c.cut(c.rect(-34, -12, 68, 16), 0.4, 5), C.blushVeil).out()}</g>`);
    const A = S.layer({ par: 0.32, sh: 5 });
    // mourners: sitting ones and standing ones
    const MS = [
      { x: 910, sit: true, f: 1 }, { x: 1000, sit: false, f: 1 }, { x: 1075, sit: false, f: 1 }, { x: 1140, sit: true, f: 1 },
    ].map((m, i) => ({ ...m, x: S.portrait ? [900, 975, 1040, 1100][i] : m.x, i, o: mournerOpts(i + 2) }));   // phone: the four mourners inside the room
    MS.forEach((m) => {
      m.sitP = m.sit ? S.puppet(A.add(person(c, { ...m.o, pose: 'sit' }))) : null;
      m.standP = S.puppet(A.add(person(c, m.o)));
    });
    const marySit = S.puppet(A.add(mary(c, { pose: 'sit' }, faceBits(c))));
    const maryUp = S.puppet(A.add(mary(c)));
    const mt = S.puppet(A.add(martha(c)));
    set.front();

    const X = S.layer({ par: 0.36, sh: 6 });
    const whisper = X.add(`<g>${iconBubble(c, `${medallion(c, CAST.jesus, { r: 20, rim: C.haloRim, back: C.halo })}<path d="${c.ribbon([[26, 6], [34, -2], [40, 4]], 2.4)}" fill="${C.terracotta}"/>`, { w: 96, h: 70, side: 1 })}</g>`);
    // where Jesus waits: a small landscape plate
    const PW = 340, PH = 190;
    const bb = bandM(c, { y: 40, amps: [6, 3], lens: [300, 100], x0: -PW / 2 - 10, x1: PW / 2 + 10, bottom: PH / 2 + 10, color: C.hillMid });
    let vil = '';
    [[70, 1], [110, 0.8], [140, 1.1]].forEach(([x, s]) => { vil += houseM(c, x, bb.fn(x) + 8, 34 * s, 26 * s, { stairs: false }); });
    const inner = `<rect x="${-PW / 2}" y="${-PH / 2}" width="${PW}" height="${PH}" fill="${mix(C.skyBlue, C.cream, 0.5)}"/>${bb.markup}${vil}` +
      `<path d="${c.ribbon([[-PW / 2, 80], [-60, 70], [60, 64], [PW / 2, 56]], 16, 1)}" fill="${C.sand}"/>` + oliveM(c, -110, 72, 0.5) +
      `<g transform="translate(-90 74) scale(.32)">${person(c, CAST.jesus)}</g><g transform="translate(-130 72) scale(.28)">${person(c, DISC[0])}</g><g transform="translate(-150 76) scale(.28)">${person(c, DISC[3])}</g>` +
      `<path d="${Array.from({ length: 9 }, (_, i) => c.cut(c.circ(lerp(60, -60, i / 8), lerp(56, 70, i / 8), 2.6, 6), 0.1, 2)).join('')}" fill="${C.terracotta}"/>`;
    const place = X.add(`<g>${framed(S, inner, { w: PW, h: PH, rim: C.wood3, k: 'waits' })}</g>`);
    const placeT = X.add(`<g>${strip(c, tr('jeszcze przed wsią', 'not yet in the village'), { size: 16 })}</g>`);
    const think = X.add(`<g>${thought(c, `<g transform="translate(0 26) scale(.9)">${caveIcon(c)}</g><path d="${c.cut([[30, -30], [36, -18], [33, -12], [27, -12], [24, -18]], 0.2, 2)}" fill="#bfe0ee"/>`, { w: 110, h: 84 })}</g>`);

    return (t, time) => {
      const T = time;
      /* v28a — Martha comes in and whispers */
      const MK = [[0.05, 470], [0.55, 680]];
      const mx = kf(t, MK);
      const bend = es(t, 0.55, 0.8);
      const MK2 = [[2.1, 680], [2.35, 640]];
      const bb2 = bend * (1 - es(t, 1.9, 2.1));
      mt.set({ x: t < 2.1 ? mx : kf(t, MK2), y: F + 10, s: 0.98, flip: false, walk: moving(t, MK) || moving(t, MK2) ? mx * 0.11 : undefined, armF: 20 + bb2 * 78, armB: 10, lean: bb2 * 10, head: bb2 * 12, blink: blinkAt(T, 2) });
      const wk = es(t, 0.85, 1.15, ease.back) * (1 - es(t, 1.85, 2.0));
      vis(whisper, { x: 740, y: 520, s: wk, o: wk > 0.01 ? 1 : 0 });

      /* v29 — Mary rises quickly and goes out */
      const lift = es(t, 1.2, 1.5);
      const up = seg(t, 2.05, 2.1);
      marySit.set({ x: 780, y: F + 12, s: 0.96, flip: true, armF: 40 - lift * 20, armB: 10, head: 14 - lift * 20, blink: blinkAt(T, 4), o: 1 - up });
      const RK = [[2.1, 780], [2.7, 520]];
      const rx = kf(t, RK, ease.in);
      maryUp.set({ x: rx, y: F + 12, s: 0.96, flip: true, walk: moving(t, RK) ? rx * 0.13 : undefined, amt: 1.5, lean: -6, armF: 30, blink: blinkAt(T, 4), o: up * (1 - seg(t, 2.66, 2.72)) });
      const ok = es(t, 2.7, 3.4, ease.sine);
      outRun.set({ x: lerp(560, 440, ok), y: 640 - ok * 12, s: 0.45, flip: true, walk: T * 12, amt: 1.6, lean: -6, o: ok > 0.001 && ok < 0.99 ? 1 : 0 });

      /* v30 — where Jesus still waits */
      const pk = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 3.95, 4.15));
      vis(place, { x: 830, y: 330 - (1 - pk) * 560, r: Math.sin(T * 0.6) * 0.6, o: pk > 0.01 ? 1 : 0 });
      vis(placeT, { x: 830, y: 330 + PH / 2 + 26 - (1 - pk) * 560, o: pk > 0.01 ? es(t, 3.35, 3.5) : 0 });

      /* v31 — the mourners rise and follow her */
      MS.forEach((m) => {
        const notice = es(t, 4.0, 4.15);
        const rise = seg(t, 4.1 + m.i * 0.05, 4.15 + m.i * 0.05);
        const K = [[4.15 + m.i * 0.1, m.x], [5.0 + m.i * 0.1, 520]];
        const x = kf(t, K, ease.in);
        const gone = seg(t, 4.95 + m.i * 0.1, 5.02 + m.i * 0.1);
        const weep = m.i % 2 ? 1 : 0;
        if (m.sitP) m.sitP.set({ x: m.x, y: F + 12, s: 0.9, flip: !!m.f, armF: 20 + weep * 24, armB: 10 + weep * 14, head: 16 - notice * 12, blink: blinkAt(T, m.i + 6), o: 1 - rise });
        m.standP.set({ x, y: F + 10 + (m.i % 2) * 6, s: 0.9, flip: m.sit ? true : (t > 4.35 ? true : !!m.f), walk: moving(t, K) ? x * 0.11 : undefined, armF: 14 + weep * (t < 4.3 ? 26 : 10), armB: 8 + weep * 16, head: (t < 4.3 ? 16 : 4) - notice * 10, blink: blinkAt(T, m.i + 6), o: (m.sit ? rise : 1) * (1 - gone) });
      });
      outM.forEach((p, i) => {
        const k = es(t, 5.0 + i * 0.12, 5.95 + i * 0.02, ease.sine);
        p.set({ x: lerp(560, 440, k), y: 640 - k * 12, s: 0.44, flip: true, walk: T * 9 + i, o: k > 0.001 && k < 0.99 ? 1 : 0 });
      });
      const th = es(t, 5.1, 5.4, ease.back);
      vis(think, { x: 640, y: 470, s: th, o: th > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1, 20], [2, 0], [2.8, -60], [3, 0], [4, 0], [5, -40], [6, -60]]);
      S.cam.y = kf(t, [[0, 0], [1, 10], [2, 0], [3, -60], [4, -40], [5, 0], [6, 0]]);
      S.cam.z = kf(t, [[0, 1.04], [1, 1.12], [2, 1.06], [3, 1.0], [4, 1.02], [5, 1.04], [6, 1.06]]);
    };
  },
};
