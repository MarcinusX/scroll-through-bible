// Mk 14,37–42 — He comes back and finds them asleep (paper Zs rise). "Simon, are you asleep? Could you not watch
// one hour?" "Watch and pray… the spirit is willing, but the flesh is weak" — a little flame over Peter, his head
// nodding. He goes to pray again; again they sleep, and wake with nothing to say. The third time: "Enough! The hour
// has come" — the hourglass runs out, dark hands reach up from below, torches appear. "Rise, let us go."
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  garden, TW, kf, moving, hand, headAt, withFace, faceBits, zzz, hourglassParts, cupOfLight, soulLight, speech, wordSlip, tally, shadowHand,
  torch, shadowPerson, guardOpts, PI,
vis, } from './lib.js';

const GY = 700, ROCK = 1180;
const SLEEP = [{ k: 'john', x: 560 }, { k: 'james', x: 636 }, { k: 'peter', x: 712 }];

export default {
  id: 'm14-watch',
  beats: [
    { v: 37, text: 'Potem wrócił i zastał ich śpiących.' },
    { v: 37, cont: true, text: 'Rzekł do Piotra: «Szymonie, śpisz? Jednej godziny nie mogłeś czuwać?' },
    { v: 38, text: 'Czuwajcie i módlcie się, abyście nie ulegli pokusie;' },
    { v: 38, cont: true, text: 'duch wprawdzie ochoczy, ale ciało słabe».' },
    { v: 39 },
    { v: 40, text: 'Gdy wrócił, zastał ich śpiących, gdyż oczy ich były snem zmorzone,' },
    { v: 40, cont: true, text: 'i nie wiedzieli, co Mu odpowiedzieć.' },
    { v: 41, text: 'Gdy przyszedł po raz trzeci, rzekł do nich: «Śpicie dalej i odpoczywacie?' },
    { v: 41, cont: true, text: 'Dosyć! Przyszła godzina,' },
    { v: 41, cont: true, text: 'oto Syn Człowieczy będzie wydany w ręce grzeszników.' },
    { v: 42 },
  ],
  cam: { x: [-80, 320], y: [-40, 200], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const PT = S.portrait;
    const CUPX = PT ? ROCK - 70 : ROCK + 30;   // phone: the cup over Him at prayer, clear of the progress thread
    const MKX = PT ? 940 : 1000;                // phone: the marks' string not across the moon
    const G = garden(S, { moonAt: [1000, 160], rockX: ROCK + 40, city: true });
    const cl = hanging(G.hang, cloud(c, 230, mix(C.storm2, C.indigo, 0.3), mix(C.storm2, C.night, 0.4)), { x: 1400, y: 180, len: 700 });
    // torches far off on the hill (v41c–42)
    const farT = S.layer({ par: 0.2, sh: 0, flat: true });
    const glints = Array.from({ length: 7 }, (_, i) => ({ i, el: farT.add(`<g><circle r="18" fill="url(#warm-glow)"/><circle r="3.4" fill="${C.lampFlame}"/></g>`), x: 150 + i * 36 + c.rr(-10, 10), y: 520 + c.rr(-8, 8) }));
    const darkL = S.layer({ par: 0.4, sh: 0, flat: true });
    darkL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#120f24" opacity=".32"/>`);

    // the hour and the cup (hung in the flies)
    const hangL2 = S.layer({ par: 0.3, sh: 4 });
    const hg = hourglassParts(c, 100);
    const hour = hanging(hangL2, `<g>${hg.frame}<g class="top">${hg.top}</g><g class="bot" transform="translate(0 ${hg.h / 2 - 12})">${hg.bottom}</g><g class="strm">${hg.stream}</g></g>`, { x: 900, y: 290, len: 600 });
    const hTop = hour.querySelector('.top'), hBot = hour.querySelector('.bot'), hStream = hour.querySelector('.strm');
    const cupEl = hanging(hangL2, `<g transform="scale(.7)">${cupOfLight(c, 60)}</g>`, { x: CUPX, y: 320, len: 700 });
    const marks = hanging(hangL2, `${sheet().p(c.cut(c.rect(-44, 0, 88, 50), 0.5, 6), C.cream).out()}<g transform="translate(-12 40)">${tally(c, 3, C.ink, 28)}</g>`, { x: 900, y: 300, len: 700 });

    // the three: asleep (eyes closed) and awake
    const P = S.layer({ par: 0.52, sh: 5 });
    const three = SLEEP.map((d, i) => {
      const asleep = S.puppet(P.add(person(c, { ...TW[d.k], pose: 'sit', eyes: 'closed' })));
      const wEl = P.add(withFace(person(c, { ...TW[d.k], pose: 'sit' }), faceBits(c)));
      const stand = S.puppet(P.add(person(c, TW[d.k])));
      return { ...d, x: PT ? d.x + 26 : d.x, i, seed: c.rr(0, 9), asleep,   // phone: the three a little in from the left edge
        awake: S.puppet(wEl), sad: wEl.querySelector('[data-part="sad"]'), stand };
    });
    const jStand = S.puppet(P.add(withFace(person(c, CAST.jesus), faceBits(c))));
    const jSad = jStand.el.querySelector('[data-part="sad"]');
    const jKneel = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'kneel' })));

    const fx = S.layer({ par: 0.55, sh: 4 });
    const zs = three.map((d) => ({ d, el: fx.add(`<g>${zzz(c)}</g>`) }));
    const zParts = zs.map((z) => [0, 1, 2].map((k) => z.el.querySelector('.z' + k)));
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(-4 0) scale(.9)">${zzz(c, C.ink).replace(/class="z\d"/g, '')}</g>`, { w: 70, h: 50, flip: true })}</g>`);
    const flameP = fx.add(`<g>${soulLight(c, 14)}</g>`);
    const dots = three.map(() => fx.add(`<g>${speech(c, `<path d="${c.poly(c.circ(-12, 0, 3.4, 8)) + c.poly(c.circ(0, 0, 3.4, 8)) + c.poly(c.circ(12, 0, 3.4, 8))}" fill="${C.ink}"/>`, { w: 54, h: 34 })}</g>`));
    const words = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(wordSlip(c, 30)) }));
    const tempt = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g><path d="${c.cut(c.blob(0, 0, 26, 18, 10, 0.35), 1.4, 4)}" fill="#1c1630" opacity=".85"/></g>`) }));
    const hands = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g>${shadowHand(c, '#191428', 1.1 + (i % 3) * 0.2)}</g>`), x: 420 + i * 190 + c.rr(-30, 30) }));
    // the band with torches coming (v42)
    const band = Array.from({ length: 6 }, (_, i) => {
      const el = fx.add(`<g>${shadowPerson(c, guardOpts(c), '#1d1830')}<g transform="translate(24 -120)">${torch(c, 50)}</g></g>`);
      return { i, el, fl: el.querySelector('.flame') };
    });

    return (t, time) => {
      const T = time;
      swing(G.moon, 1000, 160, T, 1, 0.6);
      const hourK = es(t, 8.05, 8.6);
      vis(cl, { x: lerp(1400, 1010, hourK), y: 176, r: Math.sin(T * 0.6), o: 1 });
      darkL.fade(0.6 + hourK * 0.4);

      /* Jesus: back and forth between the rock and the sleepers */
      const jK = [[-0.5, [ROCK - 20, GY]], [0.1, [ROCK - 20, GY]], [0.8, [810, GY]], [4.05, [810, GY]], [4.5, [ROCK - 20, GY]], [4.95, [ROCK - 20, GY]], [5.4, [810, GY]], [6.9, [810, GY]], [7.2, [ROCK - 60, GY]], [7.25, [ROCK - 60, GY]], [7.6, [810, GY]]];
      const [jx, jy] = kf(t, jK, ease.sine);
      const praying = (t < 0.1) || (t > 4.5 && t < 4.95);
      const kneelK = t < 0.12 ? 1 - es(t, 0.02, 0.1) : es(t, 4.5, 4.56) * (1 - es(t, 4.9, 4.96));
      const walking = moving(t, jK, 1);
      const facingLeft = t > 0.1 && t < 4.05 || t > 4.95 && t < 7.0 || t > 7.3 && t < 10.05;
      const touch = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const teach = es(t, 2.05, 2.3) * (1 - es(t, 3.9, 4.05));
      const third = es(t, 7.6, 7.8);
      const enough = es(t, 8.05, 8.25);
      const rise = es(t, 10.05, 10.3);
      jStand.set({
        x: jx, y: jy, s: 1.04, flip: facingLeft && !(t > 7.0 && t < 7.3), o: 1 - kneelK, walk: walking ? jx * 0.05 : undefined,
        armF: 16 + touch * 60 + teach * 40 + enough * 50 * (1 - rise) + rise * 30, armB: 8 + teach * 70 + enough * 60 * (1 - es(t, 9.05, 9.3)) + rise * 90, head: touch * 10 - enough * 6 + es(t, 9.05, 9.3) * 10 * (1 - rise), blink: blinkAt(T),
      });
      fade(jSad, es(t, 5.4, 5.7) * 0.8 + es(t, 9.05, 9.3) * 0.5);
      jKneel.set({ x: ROCK - 30, y: GY, s: 1.04, flip: false, o: kneelK, armF: 70, armB: 120, head: -14, blink: blinkAt(T) });
      const cup = (1 - es(t, 0.05, 0.3)) + bump(t, 4.45, 5.0);
      vis(cupEl, { x: CUPX, y: 300 - (1 - Math.min(1, cup)) * 600, r: Math.sin(T * 0.7) * 2, o: cup > 0.01 ? 1 : 0 });
      words.forEach((w) => {
        const k = ((T * 0.35 + w.i / 5) % 1);
        const on = es(t, 4.55, 4.7) * (1 - es(t, 4.9, 5.0));
        vis(w.el, { x: ROCK - 10 + k * 40, y: 540 - k * 140, r: Math.sin(T * 2 + w.i) * 8, s: 0.8, o: on * (1 - k) });
      });

      /* the three: asleep / awake / standing */
      const awake1 = es(t, 1.2, 1.3) * (1 - es(t, 3.4, 3.5));       // after "Simon, are you sleeping?"
      const awake2 = es(t, 6.05, 6.15) * (1 - es(t, 6.9, 7.0));      // they wake, with nothing to say
      const awake3 = es(t, 7.75, 7.85);
      const up = es(t, 10.1, 10.18);
      three.forEach((d) => {
        const aw = Math.max(d.k === 'peter' ? awake1 : es(t, 1.35, 1.45) * (1 - es(t, 3.5, 3.6)), awake2, awake3) * (1 - up);
        const nod = d.k === 'peter' ? es(t, 3.05, 3.4) : 0;
        d.asleep.set({ x: d.x, y: GY + 4 + d.i * 3, s: 0.92, flip: false, o: (1 - aw) * (1 - up), armF: 20, armB: 10, head: 26 + (aw < 0.5 && up < 0.5 ? Math.sin(T * 0.9 + d.seed) * 2 : 0), lean: 6, blink: 0 });
        d.awake.set({ x: d.x, y: GY + 4 + d.i * 3, s: 0.92, flip: false, o: aw, armF: 30 + teach * 20, armB: 10 + (d.k === 'peter' ? teach * 40 : 0), head: -4 + nod * 22 + awake2 * 10, lean: nod * 4, blink: blinkAt(T, d.seed) });
        fade(d.sad, awake2 + third * 0.6);
        const sx = d.x + up * 20 - es(t, 10.5, 10.9) * 0;
        d.stand.set({ x: sx, y: GY + d.i * 3, s: 0.92, flip: true, o: up, armF: 14 + up * 20, head: -4, blink: blinkAt(T, d.seed) });
      });
      // the Zs rise while they sleep
      zs.forEach((z, i) => {
        const sleeping = (t > -0.5 && t < 1.2) || (t > 3.4 && t < 6.05) || (t > 6.95 && t < 7.8);
        const on = sleeping ? 1 : 0;
        const [hx, hy] = headAt(z.d.x, GY, 0.92, false, 62);
        vis(z.el, { x: hx + 14, y: hy - 20, o: on * (i === 2 && t > 3.4 && t < 3.6 ? 0 : 1) });
        zParts[i].forEach((p, k) => { const u = ((T * 0.5 + k / 3 + i * 0.2) % 1); vis(p, { x: u * 10, y: -u * 16, o: time ? Math.sin(u * PI) : 1 }); });
      });
      const [phx, phy] = headAt(712, GY, 0.92, false, 62);
      const a = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.85, 2.0));
      const [jhx, jhy] = headAt(810, GY, 1.04, true);
      vis(ask, { x: jhx - 20, y: jhy - 20, s: a, o: a > 0.01 ? 1 : 0 });
      // v38a — temptation: dark scraps creep in from the dark, and draw back
      tempt.forEach((p) => {
        const k = es(t, 2.05 + p.i * 0.05, 2.5 + p.i * 0.05) * (1 - es(t, 2.7, 3.0));
        vis(p.el, { x: lerp(300, 470 + p.i * 12, k), y: 600 + p.i * 20 + Math.sin(T * 2 + p.i) * 6, s: 0.7 + k * 0.4, r: T * 20 * (p.i % 2 ? 1 : -1), o: k * 0.9 });
      });
      // v38b — the spirit willing (a flame) but the flesh weak (the head nods)
      const fl = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.05));
      vis(flameP, { x: phx, y: phy - 60 + Math.sin(T * 3) * 3, s: fl * (1 + Math.sin(T * 5) * 0.05), o: fl });
      dots.forEach((dt, i) => {
        const d = three[i];
        const [hx, hy] = headAt(d.x, GY, 0.92, false, 62);
        const k = es(t, 6.1 + i * 0.08, 6.3 + i * 0.08, ease.back) * (1 - es(t, 6.85, 6.95));
        vis(dt, { x: hx + 10, y: hy - 26, s: k, o: k > 0.01 ? 1 : 0 });
      });

      // the hour: one hour (v37b) — and at the end, run out (v41b)
      const hIn = es(t, 1.2, 1.5, ease.out) * (1 - es(t, 1.9, 2.1)) + es(t, 8.05, 8.3, ease.out) * (1 - es(t, 9.9, 10.2));
      vis(hour, { x: 900, y: 290 - (1 - Math.min(1, hIn)) * 600, r: Math.sin(T * 0.8) * 2, o: hIn > 0.01 ? 1 : 0 });
      const sand = t < 5 ? seg(t, 1.2, 2.0) * 0.5 : 0.5 + seg(t, 8.05, 8.8) * 0.5;
      pose(hTop, { x: 0, y: -4, sy: Math.max(0.02, 1 - sand), oy: -4 });
      pose(hBot, { x: 0, y: hg.h / 2 - 12, sy: 0.15 + sand * 0.85 });
      fade(hStream, sand >= 0.999 ? 0 : 1);
      const mk = es(t, 7.1, 7.4, ease.out) * (1 - es(t, 7.9, 8.1));
      vis(marks, { x: MKX, y: 300 - (1 - mk) * 700, r: Math.sin(T * 1.1) * 2, o: mk > 0.01 ? 1 : 0 });

      // v41c — into the hands of sinners: dark hands reach up; torches appear far off
      hands.forEach((h) => {
        const k = es(t, 9.05 + h.i * 0.05, 9.4 + h.i * 0.05) * (1 - es(t, 9.95, 10.2));
        vis(h.el, { x: h.x, y: 1000 - k * 200, r: (h.i - 2.5) * 6, o: k > 0.01 ? 0.9 : 0 });
      });
      glints.forEach((g) => {
        const on = es(t, 9.2 + g.i * 0.05, 9.4 + g.i * 0.05);
        vis(g.el, { x: g.x + es(t, 10, 11) * 120, y: g.y + Math.sin(T * 5 + g.i) * 1.5, s: 1 + Math.sin(T * 7 + g.i) * 0.1, o: on * (1 - es(t, 10.4, 10.8)) });
      });
      // v42 — the band draws near
      band.forEach((b) => {
        const k = es(t, 10.2 + b.i * 0.04, 10.9 + b.i * 0.04, ease.out);
        vis(b.el, { x: lerp(-260 - b.i * 40, 150 + b.i * 44, k), y: GY - 8 + (b.i % 2) * 8, s: 0.86, o: k > 0.01 ? 1 : 0 });
        if (k > 0.01) pose(b.fl, { x: 0, y: -60, sy: 1 + Math.sin(T * 8 + b.i) * 0.1 });
      });

      // phone: at His prayer by the rock the camera goes a little further right and less close (Him clear of the thread)
      S.cam.x = kf(t, PT ? [[-0.5, 300], [0.1, 300], [0.8, 20], [4.05, 20], [4.5, 300], [4.95, 300], [5.4, 20], [6.9, 20], [7.2, 120], [7.6, 20], [10.0, 20], [10.6, -40]]
        : [[-0.5, 220], [0.1, 220], [0.8, 20], [4.05, 20], [4.5, 220], [4.95, 220], [5.4, 20], [6.9, 20], [7.2, 120], [7.6, 20], [10.0, 20], [10.6, -40]]);
      S.cam.z = kf(t, PT ? [[-0.5, 1.04], [0.1, 1.04], [0.8, 1.2], [1.1, 1.36], [2.0, 1.3], [3.0, 1.4], [4.05, 1.3], [4.5, 1.06], [4.95, 1.06], [5.4, 1.3], [6.9, 1.36], [8.0, 1.2], [9.0, 1.1], [10.0, 1.1]]
        : [[-0.5, 1.1], [0.8, 1.2], [1.1, 1.36], [2.0, 1.3], [3.0, 1.4], [4.05, 1.3], [4.5, 1.2], [5.4, 1.3], [6.9, 1.36], [8.0, 1.2], [9.0, 1.1], [10.0, 1.1]]);
      S.cam.y = kf(t, [[-0.5, 60], [0.8, 110], [1.1, 170], [2.0, 150], [3.0, 180], [4.05, 150], [4.5, 110], [5.4, 150], [6.9, 170], [8.0, 110], [9.0, 60], [10.0, 80]]);
    };
  },
};
