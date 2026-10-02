// Mt 26,40–46 — He comes back from the rock and finds them asleep (paper Zs rise). "Could you not watch with me one
// hour?" (an hourglass). "Watch and pray" — dark scraps of temptation creep in from the dark, and draw back; "the
// spirit is willing" (a little flame over Peter) "but the flesh is weak" (his head nods). A second time He kneels at the
// rock: "if this cup cannot pass unless I drink it, your will be done" — the cup of light comes down and He lifts His
// hands to it. Back: asleep again, their eyes heavy. A third time, the same words (a card with three marks). "Sleep
// on now" — "the hour is at hand": the hourglass runs out, dark hands reach up, torches appear on the far hill.
// "Arise, let us go" — they stand; "he who betrays me is at hand": Judas, and the torches behind him.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  garden, TW, kf, moving, headAt, withFace, faceBits, zzz, hourglassParts, cupOfLight, soulLight, speech, wordSlip, tally, shadowHand,
  torch, shadowPerson, guardOpts, tr, vis, PI,
} from './lib.js';

const GY = 700, ROCK = 1180, JS = 810;
const SLEEP = [{ k: 'john', x: 560 }, { k: 'james', x: 636 }, { k: 'peter', x: 712 }];
const INK = '#1d1830';

export default {
  id: 'mt26-watch',
  beats: [
    { v: 40, text: 'Potem przyszedł do uczniów i zastał ich śpiących.' },
    { v: 40, cont: true, text: 'Rzekł więc do Piotra: «Tak, jednej godziny nie mogliście czuwać ze Mną?' },
    { v: 41, text: 'Czuwajcie i módlcie się, abyście nie ulegli pokusie;' },
    { v: 41, cont: true, text: 'duch wprawdzie ochoczy, ale ciało słabe».' },
    { v: 42 },
    { v: 43 },
    { v: 44 },
    { v: 45, text: 'Potem wrócił do uczniów i rzekł do nich: «Śpicie jeszcze i odpoczywacie?' },
    { v: 45, cont: true, text: 'A oto nadeszła godzina i Syn Człowieczy będzie wydany w ręce grzeszników.' },
    { v: 46, text: 'Wstańcie, chodźmy!' },
    { v: 46, cont: true, text: 'Oto blisko jest mój zdrajca».' },
  ],
  cam: { x: [-120, 340], y: [-40, 200], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const RX = S.portrait ? ROCK - 50 : ROCK;   // phone: the praying rock a little nearer, so He kneels clear of the thread with the three asleep still in view
    const G = garden(S, { moonAt: [1000, 160], rockX: RX + 40, city: true });
    const cl = hanging(G.hang, cloud(c, 230, mix(C.storm2, C.indigo, 0.3), mix(C.storm2, C.night, 0.4)), { x: 1400, y: 180, len: 700 });
    const farT = S.layer({ par: 0.2, sh: 0, flat: true });
    const glints = Array.from({ length: 7 }, (_, i) => ({ i, el: farT.add(`<g><circle r="18" fill="url(#warm-glow)"/><circle r="3.4" fill="${C.lampFlame}"/></g>`), x: 150 + i * 36 + c.rr(-10, 10), y: 520 + c.rr(-8, 8) }));
    const darkL = S.layer({ par: 0.4, sh: 0, flat: true });
    darkL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#120f24" opacity=".32"/>`);

    // the hour, the cup, the card of three (hung in the flies)
    const hangL2 = S.layer({ par: 0.3, sh: 4 });
    const hg = hourglassParts(c, 100);
    const hour = hanging(hangL2, `<g>${hg.frame}<g class="top">${hg.top}</g><g class="bot" transform="translate(0 ${hg.h / 2 - 12})">${hg.bottom}</g><g class="strm">${hg.stream}</g></g>`, { x: 900, y: -1500, len: 600 });
    const hTop = hour.querySelector('.top'), hBot = hour.querySelector('.bot'), hStream = hour.querySelector('.strm');
    const cupEl = hanging(hangL2, `<g transform="scale(.7)">${cupOfLight(c, 60)}</g>`, { x: ROCK, y: -1500, len: 700 });
    const marks = hanging(hangL2, `${sheet().p(c.cut(c.rect(-44, 0, 88, 50), 0.5, 6), C.cream).out()}<g transform="translate(-12 40)">${tally(c, 3, C.ink, 28)}</g>`, { x: 900, y: -1500, len: 700 });

    // the three: asleep (eyes closed), awake (sitting), standing
    const P = S.layer({ par: 0.52, sh: 5 });
    const three = SLEEP.map((d, i) => {
      const asleep = S.puppet(P.add(person(c, { ...TW[d.k], pose: 'sit', eyes: 'closed' })));
      const wEl = P.add(withFace(person(c, { ...TW[d.k], pose: 'sit' }), faceBits(c)));
      const stand = S.puppet(P.add(person(c, TW[d.k])));
      return { ...d, i, seed: c.rr(0, 9), asleep, awake: S.puppet(wEl), sad: wEl.querySelector('[data-part="sad"]'), stand };
    });
    const jStand = S.puppet(P.add(withFace(person(c, CAST.jesus), faceBits(c))));
    const jSad = jStand.el.querySelector('[data-part="sad"]');
    const jKneel = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'kneel' })));

    // the band with torches, and Judas at their head (v46b)
    const bandL = S.layer({ par: 0.52, sh: 5 });
    const band = Array.from({ length: 6 }, (_, i) => {
      const el = bandL.add(`<g>${shadowPerson(c, guardOpts(c), INK)}<g transform="translate(24 -120)">${torch(c, 50)}</g></g>`);
      return { i, el, fl: el.querySelector('.flame') };
    });
    const judas = S.puppet(bandL.add(withFace(person(c, TW.judas), faceBits(c))));

    const fx = S.layer({ par: 0.55, sh: 4 });
    const zs = three.map((d) => ({ d, el: fx.add(`<g>${zzz(c)}</g>`) }));
    const zParts = zs.map((z) => [0, 1, 2].map((k) => z.el.querySelector('.z' + k)));
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(-4 0) scale(.9)">${zzz(c, C.ink).replace(/class="z\d"/g, '')}</g>`, { w: 70, h: 50, flip: true })}</g>`);
    const flameP = fx.add(`<g>${soulLight(c, 14)}</g>`);
    const words = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(wordSlip(c, 30)) }));
    const tempt = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g><path d="${c.cut(c.blob(0, 0, 26, 18, 10, 0.35), 1.4, 4)}" fill="#1c1630" opacity=".85"/></g>`) }));
    const hands = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g>${shadowHand(c, '#191428', 1.1 + (i % 3) * 0.2)}</g>`), x: 420 + i * 190 + c.rr(-30, 30) }));
    const accept = fx.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      swing(G.moon, 1000, 160, T, 1, 0.6);
      const hourK = es(t, 8.05, 8.6);
      vis(cl, { x: lerp(1400, 1010, hourK), y: 176, r: Math.sin(T * 0.6), o: 1 });
      darkL.fade(0.6 + hourK * 0.4);

      /* Jesus: between the rock and the sleepers */
      const jK = [[-0.5, [RX - 20, GY]], [0.1, [RX - 20, GY]], [0.8, [JS, GY]], [4.05, [JS, GY]], [4.4, [RX - 20, GY]], [4.95, [RX - 20, GY]], [5.3, [JS, GY]], [6.0, [JS, GY]], [6.3, [RX - 20, GY]], [6.9, [RX - 20, GY]], [7.2, [JS, GY]], [9.1, [JS, GY]], [9.9, [JS - 60, GY]]];
      const [jx, jy] = kf(t, jK, ease.sine);
      const kneelK = t < 0.12 ? 1 - es(t, 0.02, 0.1) : es(t, 4.4, 4.46) * (1 - es(t, 4.92, 4.98)) + es(t, 6.3, 6.36) * (1 - es(t, 6.87, 6.93));
      const walking = moving(t, jK, 1);
      const toRock = (t > 4.05 && t < 4.4) || (t > 6.0 && t < 6.3);
      const touch = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const teach = es(t, 2.05, 2.3) * (1 - es(t, 3.9, 4.05));
      const enough = es(t, 7.2, 7.4) * (1 - es(t, 9.0, 9.1));
      const rise = es(t, 9.05, 9.3);
      jStand.set({
        x: jx, y: jy, s: 1.04, flip: !toRock && t > 0.1, o: 1 - kneelK, walk: walking ? jx * 0.05 : undefined,
        armF: 16 + touch * 60 + teach * 40 + enough * 50 + rise * 40, armB: 8 + teach * 70 + enough * 50 * (1 - es(t, 8.05, 8.3)) + rise * 100, head: touch * 10 - enough * 6 + es(t, 8.05, 8.3) * 10 * (1 - rise) + es(t, 5.3, 5.6) * 10 * (1 - es(t, 5.9, 6.0)), blink: blinkAt(T),
      });
      fade(jSad, es(t, 5.3, 5.6) * 0.8 * (1 - es(t, 7.2, 7.4)) + es(t, 8.05, 8.3) * 0.5);
      const acc = es(t, 4.6, 4.85) * (1 - es(t, 4.9, 5.0));
      jKneel.set({ x: RX - 30, y: GY, s: 1.04, flip: false, o: kneelK, armF: 70 + acc * 30, armB: 120 + acc * 20, head: -14 - acc * 6, blink: blinkAt(T) });
      const cup = (1 - es(t, 0.05, 0.3)) + bump(t, 4.4, 5.0) + bump(t, 6.3, 6.9);
      vis(cupEl, { x: RX + (S.portrait ? -30 : 20), y: 290 - (1 - Math.min(1, cup)) * 700 + acc * 30, r: Math.sin(T * 0.7) * 2, o: cup > 0.01 ? 1 : 0 });
      vis(accept, { x: RX - 20, y: GY - 150, s: 0.8 + acc * 0.5, o: acc * 0.9 });
      words.forEach((w) => {
        const k = ((T * 0.35 + w.i / 5) % 1);
        const on = es(t, 4.45, 4.6) * (1 - es(t, 4.9, 5.0)) + es(t, 6.35, 6.5) * (1 - es(t, 6.85, 6.95));
        vis(w.el, { x: RX - 10 + k * 40, y: 540 - k * 140, r: Math.sin(T * 2 + w.i) * 8, s: 0.8, o: on * (1 - k) });
      });
      const mk = es(t, 6.35, 6.6, ease.out) * (1 - es(t, 6.9, 7.1));
      vis(marks, { x: 980, y: 290 - (1 - mk) * 700, r: Math.sin(T * 1.1) * 2, o: mk > 0.01 ? 1 : 0 });

      /* the three: asleep / awake / standing */
      const awake1 = es(t, 1.2, 1.3) * (1 - es(t, 3.4, 3.5));
      const awake3 = es(t, 7.35, 7.45);
      const up = es(t, 9.1, 9.18);
      three.forEach((d) => {
        const aw = Math.max(d.k === 'peter' ? awake1 : es(t, 1.35, 1.45) * (1 - es(t, 3.5, 3.6)), awake3) * (1 - up);
        const nod = d.k === 'peter' ? es(t, 3.05, 3.4) : 0;
        const heavy = es(t, 5.35, 5.6) * (1 - es(t, 5.9, 6.0));
        d.asleep.set({ x: d.x, y: GY + 4 + d.i * 3, s: 0.92, flip: false, o: (1 - aw) * (1 - up), armF: 20, armB: 10, head: 26 + heavy * 6, lean: 6 + heavy * 3, blink: 0 });
        d.awake.set({ x: d.x, y: GY + 4 + d.i * 3, s: 0.92, flip: false, o: aw, armF: 30 + teach * 20, armB: 10 + (d.k === 'peter' ? teach * 40 : 0), head: -4 + nod * 22 + awake3 * 10 * (1 - es(t, 8.05, 8.3)), lean: nod * 4, blink: blinkAt(T, d.seed) });
        fade(d.sad, awake3);
        d.stand.set({ x: d.x + up * 20, y: GY + d.i * 3, s: 0.92, flip: es(t, 10.05, 10.2) > 0.5, o: up, armF: 14 + up * 20 + es(t, 10.1, 10.3) * 30, head: -4, blink: blinkAt(T, d.seed) });
      });
      zs.forEach((z, i) => {
        const sleeping = (t > -0.5 && t < 1.2) || (t > 3.4 && t < 7.4);
        const [hx, hy] = headAt(z.d.x, GY, 0.92, false, 62);
        vis(z.el, { x: hx + 14, y: hy - 20, o: sleeping ? 1 : 0 });
        zParts[i].forEach((p, k) => { const u = ((T * 0.5 + k / 3 + i * 0.2) % 1); vis(p, { x: u * 10, y: -u * 16, o: time ? Math.sin(u * PI) : 1 }); });
      });
      const a = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.85, 2.0));
      const [jhx, jhy] = headAt(JS, GY, 1.04, true);
      vis(ask, { x: jhx - 20, y: jhy - 20, s: a, o: a > 0.01 ? 1 : 0 });
      tempt.forEach((p) => {
        const k = es(t, 2.05 + p.i * 0.05, 2.5 + p.i * 0.05) * (1 - es(t, 2.7, 3.0));
        vis(p.el, { x: lerp(300, 470 + p.i * 12, k), y: 600 + p.i * 20 + Math.sin(T * 2 + p.i) * 6, s: 0.7 + k * 0.4, r: T * 20 * (p.i % 2 ? 1 : -1), o: k * 0.9 });
      });
      const [phx, phy] = headAt(712, GY, 0.92, false, 62);
      const fl = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.05));
      vis(flameP, { x: phx, y: phy - 60 + Math.sin(T * 3) * 3, s: fl * (1 + Math.sin(T * 5) * 0.05), o: fl });

      // the hour: one hour (v40b) — and at the end, run out (v45b)
      const hIn = es(t, 1.2, 1.5, ease.out) * (1 - es(t, 1.9, 2.1)) + es(t, 8.05, 8.3, ease.out) * (1 - es(t, 8.9, 9.2));
      vis(hour, { x: 900, y: 290 - (1 - Math.min(1, hIn)) * 700, r: Math.sin(T * 0.8) * 2, o: hIn > 0.01 ? 1 : 0 });
      const sand = t < 5 ? seg(t, 1.2, 2.0) * 0.5 : 0.5 + seg(t, 8.05, 8.6) * 0.5;
      pose(hTop, { x: 0, y: -4, sy: Math.max(0.02, 1 - sand), oy: -4 });
      pose(hBot, { x: 0, y: hg.h / 2 - 12, sy: 0.15 + sand * 0.85 });
      fade(hStream, sand >= 0.999 ? 0 : 1);

      // v45b — into the hands of sinners: dark hands reach up; torches far off
      hands.forEach((h) => {
        const k = es(t, 8.3 + h.i * 0.05, 8.6 + h.i * 0.05) * (1 - es(t, 8.95, 9.2));
        vis(h.el, { x: h.x, y: 1000 - k * 200, r: (h.i - 2.5) * 6, o: k > 0.01 ? 0.9 : 0 });
      });
      glints.forEach((g) => {
        const on = es(t, 8.4 + g.i * 0.05, 8.6 + g.i * 0.05);
        vis(g.el, { x: g.x + es(t, 9, 10) * 120, y: g.y + Math.sin(T * 5 + g.i) * 1.5, s: 1 + Math.sin(T * 7 + g.i) * 0.1, o: on * (1 - es(t, 9.8, 10.1)) });
      });
      // v46b — the betrayer at hand
      band.forEach((b) => {
        const k = es(t, 10.05 + b.i * 0.04, 10.55 + b.i * 0.04, ease.out);
        vis(b.el, { x: lerp(-360 - b.i * 40, 60 + b.i * 44, k), y: GY - 8 + (b.i % 2) * 8, s: 0.86, o: k > 0.01 ? 1 : 0 });
      });
      const jdK = [[10.0, [-200, GY + 6]], [10.6, [380, GY + 6]]];
      const [jdx] = kf(t, jdK, ease.out);
      judas.set({ x: jdx, y: GY + 6, s: 0.98, flip: false, o: es(t, 10.0, 10.05), walk: moving(t, jdK, 1) ? jdx * 0.05 : undefined, armF: 20, armB: 6, head: 4, blink: blinkAt(T, 2) });

      // phone: at the rock the camera stands wide, so He and the cup stay clear of the edge and the three asleep show whole
      const RK = S.portrait ? 160 : 220;
      S.cam.x = kf(t, [[-0.5, RK], [0.1, RK], [0.8, 20], [4.05, 20], [4.4, RK], [4.95, RK], [5.3, 20], [6.0, 20], [6.3, RK], [6.9, RK], [7.2, 20], [9.9, 20], [10.4, -60]]);
      S.cam.z = S.portrait
        ? kf(t, [[-0.5, 1.1], [0.8, 1.2], [1.1, 1.36], [2.0, 1.3], [3.0, 1.4], [4.05, 1.3], [4.4, 1.0], [4.95, 1.0], [5.3, 1.3], [6.0, 1.3], [6.3, 1.0], [6.9, 1.0], [7.2, 1.3], [8.0, 1.16], [9.0, 1.1], [10.0, 1.1]])
        : kf(t, [[-0.5, 1.1], [0.8, 1.2], [1.1, 1.36], [2.0, 1.3], [3.0, 1.4], [4.05, 1.3], [4.4, 1.34], [5.3, 1.3], [6.0, 1.3], [6.3, 1.3], [7.2, 1.3], [8.0, 1.16], [9.0, 1.1], [10.0, 1.1]]);
      S.cam.y = kf(t, [[-0.5, 60], [0.8, 110], [1.1, 170], [2.0, 150], [3.0, 180], [4.05, 150], [4.4, 130], [5.3, 150], [6.9, 140], [8.0, 110], [9.0, 60], [10.0, 80]]);
    };
  },
};
