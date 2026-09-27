// J 20,26–28 — Eight days later: a string of eight little suns lights up one by one across the top of the room. The
// disciples are inside again, and Thomas with them; the bar is across the door. Light gathers in the middle and Jesus
// stands among them: "Peace be with you." He turns to Thomas and holds out His hands — only a small light shines in
// each palm — "put your finger here… see my hands"; Thomas' hand reaches out, slowly, and stops just short of the
// light; "reach out your hand, put it into my side" — the light at His side; "do not be unbelieving, but believing":
// the grey cloud over Thomas melts into a flame. And Thomas falls on his knees: "My Lord and my God!" — the light
// bursts out over the whole room.
import { C, person, blinkAt, pose, lerp, hanging, swing } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  THOMAS, eveningRoom, MID, headAt, handAt, handB, bodyAt, markLight, daysString, goldWord, nameTag, worryCloud, question, soulLight,
  rayBurst, peaceDove, flapWings, withFace, faceBits, sparkle, tr,
} from './lib.js';

export default {
  id: 'j20-eight',
  beats: [
    { v: 26, text: 'A po ośmiu dniach, kiedy uczniowie Jego byli znowu wewnątrz [domu] i Tomasz z nimi,' },
    { v: 26, cont: true, text: 'Jezus przyszedł mimo drzwi zamkniętych, stanął pośrodku' },
    { v: 26, cont: true, text: 'i rzekł: «Pokój wam!»' },
    { v: 27, text: 'Następnie rzekł do Tomasza: «Podnieś tutaj swój palec' },
    { v: 27, cont: true, text: 'i zobacz moje ręce.' },
    { v: 27, cont: true, text: 'Podnieś rękę i włóż [ją] do mego boku,' },
    { v: 27, cont: true, text: 'i nie bądź niedowiarkiem, lecz wierzącym!»' },
    { v: 28 },
  ],
  cam: { x: [-150, 60], y: [-30, 50], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const E = eveningRoom(S, { withThomas: true });
    const { door, crew, jesus, gl, by } = E;
    const T0 = by.thomas;
    const kEl = E.PL.add(withFace(person(c, { ...THOMAS, pose: 'kneel' }), faceBits(c)));
    const tKneel = S.puppet(kEl);

    const top = S.layer({ par: 0.4, sh: 4 });
    const days = hanging(top, `<g transform="translate(-245 0)">${daysString(c, 8, 70, 20)}</g>`, { x: 0, y: 0, len: 700 });
    const dayEls = Array.from(days.querySelectorAll('.day')).map((d) => ({ off: d.querySelector('.off'), lit: d.querySelector('.lit') }));
    const fx = S.layer({ par: 0.56, sh: 4 });
    const tTag = fx.add(`<g>${nameTag(c, tr('Tomasz', 'Thomas'), { size: 16 })}</g>`);
    const barGlint = fx.add(`<g>${sparkle(c, 14)}</g>`);
    const word = fx.add(`<g>${goldWord(c, tr('Pokój wam!', 'Peace be to you!'), { size: 28 })}</g>`);
    const dove = fx.add(`<g>${peaceDove(c)}</g>`);
    const lights = [0, 1, 2].map(() => fx.add(`<g>${markLight(c, 6)}</g>`));
    const cloud = fx.add(`<g>${worryCloud(c, 64)}</g>`);
    const q = fx.add(`<g>${question(c)}</g>`);
    const faith = fx.add(`<g>${soulLight(c, 13)}</g>`);
    const burstL = S.layer({ par: 0.5, sh: 0, flat: true });
    const burst = burstL.add(`<g><circle r="330" fill="url(#halo-glow)"/>${rayBurst(c, { n: 24, r0: 40, r1: 520, spread: 0.045, o: 0.3 })}</g>`);
    const fx2 = S.layer({ par: 0.58, sh: 5 });
    const lordWord = fx2.add(`<g>${goldWord(c, tr('Pan mój i Bóg mój!', 'My Lord and my God!'), { size: 30 })}</g>`);

    return (t, T) => {
      E.R.update(T, 0.9 + es(t, 7.05, 7.4) * 0.2);
      door.set(0); door.bolt(1);
      /* v26a: eight days — and Thomas with them */
      const dk = es(t, 0.02, 0.2, ease.back) * (1 - es(t, 1.0, 1.25, ease.in));
      swing(days, 800, lerp(-700, 210, dk), dk > 0.001 ? T : 0, 0.8, 0.6);
      fade(days, dk > 0.001 ? 1 : 0);
      dayEls.forEach((d, i) => { const k = es(t, 0.15 + i * 0.07, 0.22 + i * 0.07); fade(d.lit, k); fade(d.off, 1 - k); });
      const tg = es(t, 0.55, 0.75, ease.back) * (1 - es(t, 0.95, 1.08));
      const tx = T0.x + es(t, 5.05, 5.4) * 8;
      const [thx0, thy0] = headAt(tx, T0.y, T0.s, false);
      pose(tTag, { x: thx0, y: thy0 - 120, s: tg, o: tg > 0.01 ? 1 : 0 });

      /* v26b: through the locked doors He came and stood in the middle */
      const come = es(t, 1.05, 1.5);
      pose(gl, { x: MID.x, y: MID.y - 120, s: 0.3 + come * 0.8, r: t * 4, o: come * (1 - es(t, 2.6, 3) * 0.3) });
      const gb = bump(t, 1.4, 1.95);
      pose(barGlint, { x: 1205, y: 604, s: gb * 1.3, r: T * 40, o: gb });
      const peace = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const toT = es(t, 3.02, 3.2);
      const hands = es(t, 3.2, 3.6);
      const both = es(t, 4.05, 4.35);
      const side = es(t, 5.05, 5.35);
      const kneel = seg(t, 7.05, 7.12);
      const aF = 20 + peace * 30 + hands * 35 + both * 6 - side * 10 + kneel * 10;
      const aB = 14 + peace * 110 + both * 70 * (1 - side * 0.6);
      jesus.set({ x: MID.x, y: MID.y, s: MID.s, flip: toT > 0.5, o: es(t, 1.2, 1.55), armF: aF, armB: aB, head: toT * 4 + kneel * 6, blink: blinkAt(T) });
      const flipJ = toT > 0.5;
      const [f1x, f1y] = handAt(MID.x, MID.y, MID.s, flipJ, aF);
      const [b1x, b1y] = handB(MID.x, MID.y, MID.s, flipJ, aB);
      const [s1x, s1y] = bodyAt(MID.x, MID.y, MID.s, flipJ, 14, -96);
      const lk = [hands, both, side];
      [[f1x, f1y], [b1x, b1y], [s1x, s1y]].forEach(([x, y], i) => pose(lights[i], { x, y, s: lk[i] * (1 + (T ? Math.sin(T * 3 + i) * 0.08 : 0)) * (1 + es(t, 7.05, 7.4) * 0.3), o: lk[i] }));

      /* v26c: "Peace be with you" */
      const wk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.92, 3.02));
      pose(word, { x: MID.x, y: 400, s: wk, o: wk > 0.01 ? 1 : 0 });
      const dv = es(t, 2.1, 2.9, ease.out);
      pose(dove, { x: lerp(MID.x + 10, 1080, dv), y: lerp(560, 330, dv) + Math.sin(dv * 6) * 20, s: 0.4 + dv * 0.5, o: dv > 0.01 ? 1 - es(t, 2.9, 3.1) : 0 });
      if (T) flapWings(dove, T, 30, 9);

      /* the disciples */
      crew.forEach((m) => {
        if (m.k === 'thomas') return;
        const flip = come > 0.5 ? m.x > MID.x : m.flip;
        const joy = es(t, 2.3, 2.6), lift = es(t, 7.1, 7.4);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip, lean: -bump(t, 1.2, 1.9) * 6, armF: 26 + joy * 20 + lift * 40, armB: 12 + bump(t, 1.2, 1.9) * 50 + lift * 80, head: -bump(t, 1.2, 1.9) * 6 + (t > 3 && t < 7 ? 4 : 0), blink: blinkAt(T, m.seed) });
        fade(m.sad, 0);
      });

      /* Thomas: reaches out his finger, his hand — and kneels */
      const reach = es(t, 4.05, 4.8) * (1 - es(t, 5.0, 5.2)) * 70 + es(t, 5.1, 5.8) * 86 * (1 - kneel);
      const tremble = (T ? Math.sin(T * 14) * 2 : 0) * es(t, 4.4, 4.8) * (1 - es(t, 6.2, 6.5));
      T0.p.set({ x: tx, y: T0.y, s: T0.s, o: 1 - kneel, armF: 22 + reach + tremble, armB: 12 + bump(t, 1.2, 1.9) * 40, head: -toT * 6 - es(t, 6.1, 6.4) * 4, lean: es(t, 5.1, 5.6) * 6, blink: blinkAt(T, T0.seed) });
      fade(T0.sad, es(t, 0.3, 0.6) * (1 - es(t, 6.1, 6.4)));
      tKneel.set({ x: tx + 10, y: T0.y, s: T0.s, o: kneel, armF: 70 + (T ? Math.sin(T * 1.2) * 2 : 0), armB: 110, head: -14, blink: 0 });
      const [thx, thy] = headAt(tx, T0.y, T0.s, false);
      const unbelief = es(t, 0.6, 0.9) * (1 - es(t, 6.1, 6.45));
      pose(cloud, { x: thx - 44, y: thy - 58 + (T ? Math.sin(T * 1.4) * 2 : 0), s: unbelief * (1 - es(t, 6.1, 6.45) * 0.4), o: unbelief });
      const qk = es(t, 6.02, 6.2, ease.back) * (1 - es(t, 6.3, 6.5));
      pose(q, { x: thx - 40, y: thy - 70, s: qk, o: qk > 0.01 ? 1 : 0 });
      const fk = es(t, 6.35, 6.6, ease.back);
      const [khx, khy] = headAt(tx + 10, T0.y, T0.s, false, 46);
      pose(faith, { x: lerp(thx - 30, khx - 30, kneel), y: lerp(thy - 50, khy - 50, kneel) + (T ? Math.sin(T * 2) * 1.5 : 0), s: fk * (1 + es(t, 7.05, 7.4) * 0.3), o: fk > 0.01 ? 1 : 0 });

      /* v28: "My Lord and my God!" */
      const bk = es(t, 7.05, 7.5);
      pose(burst, { x: MID.x - 40, y: MID.y - 150, s: 0.4 + bk * 0.7, r: T * 3, o: bk * 0.7 });
      const lw = es(t, 7.15, 7.4, ease.back);
      pose(lordWord, { x: 760, y: 360, s: lw, o: lw > 0.01 ? 1 : 0 });

      S.cam.x = 20 - es(t, 3.0, 3.5) * 120 + es(t, 6.9, 7.3) * 60;
      S.cam.y = 30 - es(t, 0, 0.3) * 40 * (1 - es(t, 0.9, 1.2)) - es(t, 3.0, 3.5) * 10;
      S.cam.z = (1.04 + es(t, 3.0, 3.5) * 0.12 * (1 - es(t, 6.9, 7.3) * 0.6)) * (S.portrait ? 0.96 : 1);
    };
  },
};
