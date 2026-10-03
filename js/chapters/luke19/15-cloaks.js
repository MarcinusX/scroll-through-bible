// Łk 19,35–36 — on the road over the Mount of Olives, Jerusalem across the valley. The two lead the colt in and bring
// it to Jesus. Peter and James pull off their cloaks and throw them over its back, and the disciples lift Him up and
// set Him on it. As He rides on, the people ahead of Him take off their cloaks one after another and spread them on
// the road — a patchwork carpet of blue, rose, wheat and teal under the colt's hooves. (Luke tells only of cloaks.)
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { olivetSet, OV, TWELVE, TWO, still, folk, colt, coltRig, saddleCloaks, riderLeg, roadCloak, flyingCloak, sparkle, headAt, hand, kf, es, ease, bump, seg, PI, mix } from './lib.js';

const GY = OV.GY, JX = 700;

export default {
  id: 'lk19-cloaks',
  beats: [
    { v: 35, text: 'I przyprowadzili je do Jezusa,' },
    { v: 35, cont: true, text: 'a zarzuciwszy na nie swe płaszcze, wsadzili na nie Jezusa.' },
    { v: 36 },
  ],
  cam: { x: [-80, 520], y: [-40, 60], z: [1, 1.2] },
  build(S) {
    const O = olivetSet(S, { cityX: 1300, cityY: 450, cityS: 0.36, sunAt: [S.portrait ? 720 : 420, 140], slopeY: 560, seed: 'lk19-olivet-b' });
    const c = S.c;
    const A = O.act;
    /* the carpet of cloaks on the road */
    const carpetL = S.layer({ par: 0.5, sh: 2 });
    const COLS = [C.dustyBlue, C.roseRobe, C.wheatRobe, C.tealRobe, C.mauve, C.clayMantle, C.sageRobe, C.ochreRobe, C.plumRobe, C.skyVeil];
    const carpet = COLS.map((col, i) => ({ i, col, x: 1000 + i * 84 + c.rr(-8, 8), y: GY + 14 + c.rr(-6, 6), r: c.rr(-6, 6), lie: carpetL.add(`<g>${roadCloak(c, col, 112)}</g>`), fly: carpetL.add(`<g>${flyingCloak(c, col, 84)}</g>`) }));
    /* people along the road ahead who spread their cloaks (with / without the cloak) */
    const SP = [1200, 1310, 1420, 1530, 1640, 1750].map((x, i) => {
      const o = folk(c, i % 2 === 0);
      return { i, x, y: GY - 40 + (i % 2) * 6, pM: S.puppet(A.add(person(c, { ...o, mantle: COLS[i + 2] }))), p0: S.puppet(A.add(person(c, { ...o, mantle: null }))) };
    });
    /* disciples, Jesus, the colt */
    const back = A.sprite(still(c, [3, 6, 5, 8].map((k, i) => ({ x: -i * 50, y: (i % 2) * 8 - 10, s: 0.86, head: 2, armF: 20 + (i % 2) * 40, o: TWELVE[k].o }))), 460, GY + 2);
    const TH = [{ o: CAST.peter, x: 560 }, { o: CAST.james, x: 620 }].map((d, i) => ({ ...d, i, pM: S.puppet(A.add(person(c, d.o))), p0: S.puppet(A.add(person(c, { ...d.o, mantle: null }))), fly: A.add(`<g>${flyingCloak(c, d.o.mantle, 80)}</g>`) }));
    const two = TWO.map((o, i) => ({ i, p: S.puppet(A.add(person(c, o))) }));
    const jStand = S.puppet(A.add(person(c, CAST.jesus)));
    const rider = person(c, { ...CAST.jesus, pose: 'sit' });
    const coltEl = A.add(colt(c, {
      over: `<g data-k="saddle">${saddleCloaks(c, [CAST.peter.mantle, CAST.james.mantle])}</g>`,
      rider: `<g data-k="rider" transform="translate(-16 -106) scale(.95)">${rider}</g><g data-k="rleg">${riderLeg(c)}</g>`,
    }));
    const cR = coltRig(coltEl);
    const saddle = coltEl.querySelector('[data-k="saddle"]'), riderG = coltEl.querySelector('[data-k="rider"]'), rleg = coltEl.querySelector('[data-k="rleg"]');
    const jRide = S.puppet(riderG.firstElementChild);
    const glow = A.add(`<g>${sparkle(c, 12)}</g>`);
    O.front();

    return (t, time) => {
      const T = time;
      O.update(T, { glow: 0.45 });
      back.set({ x: 460 + es(t, 2.0, 3.0) * 140, y: GY + 2 });
      /* v35a — they bring the colt to Jesus */
      const lead = es(t, -0.3, 0.6, ease.out);
      const turn = es(t, 0.62, 0.7);
      const cx0 = lerp(1300, JX + 150, lead);
      /* v35b — cloaks on its back; they set Him on it */
      const mount = es(t, 1.6, 1.66);
      const ride = es(t, 2.05, 2.95);
      const cx = cx0 - mount * 140 + ride * 360;
      cR.set({ x: cx, y: GY + 8, s: 1.0, flip: turn < 0.5, walk: (lead > 0 && lead < 1) || (ride > 0 && ride < 1) ? cx * 0.05 : undefined, nod: bump(t, 0.7, 1.0) * 10 + (T ? Math.sin(T * 0.8) * 1.5 : 0), ear: T ? Math.sin(T * 1.3) * 7 : 0, tail: T ? Math.sin(T * 1.7) * 8 : 0 });
      const on = es(t, 1.3, 1.45);
      Array.from(saddle.querySelectorAll('.cl')).forEach((el, i) => pose(el, { o: es(t, 1.25 + i * 0.1, 1.35 + i * 0.1) }));
      pose(riderG, { x: -16, y: -106, s: 0.95, o: mount });
      pose(rleg, { o: mount });
      jRide.set({ x: 0, y: 0, s: 1, armF: 20 + bump(t, 2.1, 2.9) * 30, armB: 10 + es(t, 2.3, 2.7) * 50, head: -2, blink: blinkAt(T) });
      const lift = bump(t, 1.45, 1.7);
      jStand.set({ x: JX + lift * 40, y: GY - lift * 30, s: 1.02, o: 1 - mount, armF: bump(t, 0.4, 1.0) * 50, armB: lift * 40, head: bump(t, 0.4, 1.0) * 8, blink: blinkAt(T) });
      pose(glow, { x: JX + 150 - 140 + 10, y: GY - 260, s: bump(t, 1.62, 2.1) * 1.4, r: t * 80, o: bump(t, 1.62, 2.1) > 0.02 ? 1 : 0 });
      two.forEach((m) => {
        const aside = es(t, 0.7, 1.0);
        const x = lerp(1300 + 90 + m.i * 70, JX + 270 + m.i * 60, lead) + aside * 60;
        const y = GY + 10 - m.i * 12 - aside * 26;
        m.p.set({ x, y, s: (0.92 - m.i * 0.04) * (1 - aside * 0.08), flip: true, walk: (lead > 0 && lead < 1) || (aside > 0 && aside < 1) ? x * 0.05 + m.i : undefined, armF: m.i === 0 ? 60 * (1 - on) + 20 : 20, head: 2, blink: blinkAt(T, m.i + 3) });
      });
      TH.forEach((d) => {
        const k = seg(t, 1.05 + d.i * 0.12, 1.4 + d.i * 0.1);
        const off = k > 0.02;
        d.pM.set({ x: d.x + ride * 180, y: GY + 6 - d.i * 8, s: 0.94, o: off ? 0 : 1, armF: es(t, 0.8, 0.95) * 50, blink: blinkAt(T, d.i + 5) });
        d.p0.set({ x: d.x + ride * 180, y: GY + 6 - d.i * 8, s: 0.94, o: off ? 1 : 0, walk: ride > 0 && ride < 1 ? d.x * 0.05 + ride * 40 : undefined, armF: bump(t, 1.05, 1.5) * 120 + bump(t, 1.45, 1.75) * 100 + es(t, 2.2, 2.5) * 30, armB: bump(t, 1.05, 1.5) * 80 + bump(t, 1.45, 1.75) * 80 + es(t, 2.2, 2.5) * 100, blink: blinkAt(T, d.i + 5) });
        const bx = cx0 - 10 + d.i * 16, by = GY - 100;
        pose(d.fly, { x: lerp(d.x, bx, k), y: lerp(GY - 130, by, k) - Math.sin(k * PI) * 90, r: -20 + k * 30, s: 0.8 + Math.sin(k * PI) * 0.3, o: k > 0 && k < 1 ? 1 : 0 });
      });
      /* v36 — as He rides, they spread their cloaks on the road */
      SP.forEach((m) => {
        const t0 = 2.08 + m.i * 0.08;
        const k = seg(t, t0 + 0.12, t0 + 0.4);
        const off = k > 0.02;
        const bend = bump(t, t0, t0 + 0.5);
        m.pM.set({ x: m.x, y: m.y, s: 0.86, flip: true, o: off ? 0 : 1, armF: bend * 60, blink: blinkAt(T, m.i + 12) });
        m.p0.set({ x: m.x, y: m.y, s: 0.86, flip: true, o: off ? 1 : 0, armF: bend * 70 + es(t, 2.6, 2.8) * 40, armB: es(t, 2.6, 2.8) * 130, lean: -bend * 10, head: bend * 8, blink: blinkAt(T, m.i + 12) });
      });
      carpet.forEach((cl) => {
        const src = SP[Math.min(SP.length - 1, Math.floor(cl.i * 0.6))];
        const t0 = 2.2 + cl.i * 0.05;
        const k = es(t, t0, t0 + 0.3, ease.out);
        pose(cl.fly, { x: lerp(src.x - 20, cl.x, k), y: lerp(src.y - 120, cl.y, k) - Math.sin(k * PI) * 50, r: lerp(-30, cl.r, k), s: 0.8, o: k > 0 && k < 1 ? 1 : 0 });
        pose(cl.lie, { x: cl.x, y: cl.y, r: cl.r * 0.3, o: k >= 1 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, 120], [0.6, 60], [1.0, 40], [2.0, 60], [2.9, 440]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.6, 30], [1.5, 40], [2.4, 50]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.6, 1.14], [1.5, 1.18], [2.4, 1.16]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, 160], [0.6, 80], [1.0, 60], [2.0, 80], [2.9, 520]]); S.cam.z = 1.0; }
      void hand; void headAt; void mix; void on;
    };
  },
};
