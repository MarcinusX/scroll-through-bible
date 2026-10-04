// Mk 16,10–11 — The upper room, shutters fastened. Those who had been with Him sit in grief round a
// guttering candle; a grey cloud rains tears over them. The door opens on the morning: Mary Magdalene
// runs in — "He is alive! I have seen Him!" (a sunburst in her bubble). They shake their heads: in their
// thoughts the tomb is still closed.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { MAGD, LOOK, upperRoom, ROOM, headAt, withFace, faceBits, speech, thought, risenIcon, tombIcon, sorrowCloud, candle, GLYPH, PI } from './lib.js';

const F = ROOM.floor;

export default {
  id: 'm16-mourning',
  beats: [
    { v: 10, text: 'Ona poszła i oznajmiła to tym, którzy byli z Nim,' },
    { v: 10, cont: true, text: 'pogrążonym w smutku i płaczącym.' },
    { v: 11 },
  ],
  cam: { x: [-40, 80], y: [0, 50], z: [0.9, 1.12] },
  build(S) {
    const c = S.c;
    const R = upperRoom(S, { dusk: 0.6 });
    const cand = R.floorL.add(`<g>${candle(c, 40)}</g>`);
    const flame = cand.querySelector('.flame'), cglow = cand.querySelector('.glow');

    /* the mourners, sitting on the floor round the candle */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const SEATS = [
      { o: CAST.thomas, x: 470, y: F + 24, s: 1.1, flip: false },
      { o: CAST.james, x: 610, y: F + 12, s: 1.08, flip: false },
      { o: CAST.peter, x: 760, y: F + 6, s: 1.1, flip: false },
      { o: CAST.john, x: 900, y: F + 12, s: 1.08, flip: true },
      { o: LOOK.philip, x: 1030, y: F + 24, s: 1.1, flip: true },
      { o: CAST.andrew, x: 560, y: F + 80, s: 1.2, flip: false },
      { o: CAST.matthew, x: 960, y: F + 80, s: 1.2, flip: true },
    ].map((m, i) => {
      // phone: the circle drawn in towards the candle, so Thomas and Philip keep their whole bodies
      if (S.portrait) m.x = 760 + (m.x - 760) * 0.86;
      const el = PL.add(withFace(person(c, { ...m.o, pose: 'sit' }), faceBits(c)));
      return { ...m, i, seed: c.rr(0, 9), p: S.puppet(el), sad: el.querySelector('[data-part="sad"]'), tear: el.querySelector('[data-part="tear"]') };
    });
    const doubt = SEATS.filter((m) => m.i % 2 === 0).map((m) => ({ m, el: PL.add(`<g>${thought(c, `<g transform="translate(-8 6) scale(.8)">${tombIcon(c)}</g><g transform="translate(24 -4) scale(.8)">${GLYPH.q(c)}</g>`, { w: 84, h: 64 })}</g>`) }));
    const cloud = PL.add(`<g>${sorrowCloud(c, 220)}</g>`);
    const drops = Array.from(cloud.querySelectorAll('.drop'));

    /* Mary Magdalene comes in from the morning */
    const mary = S.puppet(PL.add(person(c, { ...MAGD })));
    const news = PL.add(`<g>${speech(c, `<g transform="scale(1.05)">${risenIcon(c)}</g>`, { w: 90, h: 76, flip: true })}</g>`);
    const lightFloor = R.floorL.add(`<path d="${c.poly([[ROOM.doorX, F + 2], [ROOM.doorX + ROOM.doorW, F + 2], [ROOM.doorX - 60, F + 200], [ROOM.doorX - 380, F + 200]])}" fill="${C.lampGlow}" opacity="0"/>`);

    return (t, time) => {
      /* v10a: the door opens, she comes in and tells them */
      const open = es(t, 0.05, 0.3);
      pose(R.door, { x: ROOM.doorX + ROOM.doorW, y: ROOM.doorTop, sx: 1 - open * 0.85 });
      fade(lightFloor, open * 0.45);
      const inK = es(t, 0.2, 0.6, ease.out);
      const mx = lerp(ROOM.doorX + 50, S.portrait ? 1060 : 1120, inK);   // phone: she stops clear of the thread
      const tell = es(t, 0.55, 0.7);
      const droop = es(t, 2.4, 2.8);
      mary.set({ x: mx, y: F + 40, s: 1.18, flip: true, o: seg(t, 0.15, 0.22), walk: inK > 0 && inK < 1 ? mx * 0.06 : undefined, amt: 1.2, armF: 30 + tell * 70 * (1 - droop * 0.6) + Math.sin(time * 2) * 6 * tell * (1 - droop), armB: 10 + tell * 100 * (1 - droop), head: -tell * 4 + droop * 10, blink: blinkAt(time, 2) });
      const [mhx, mhy] = headAt(mx, F + 40, 1.18, true);
      const nb = es(t, 0.6, 0.85, ease.back) * (1 - es(t, 2.6, 2.9) * 0.6);
      pose(news, { x: mhx - 18 + (S.portrait ? droop * 14 : 0), y: mhy - 24 - (S.portrait ? droop * 46 : 0), s: nb,   // phone: lifted clear of Philip's doubt
        o: nb > 0.01 ? 1 : 0, r: droop * -6 });

      pose(cand, { x: 760, y: F + 120, s: 1.3 });
      pose(flame, { x: 0, y: -54, sx: 1 + Math.sin(time * 7) * 0.08, sy: 1 + Math.sin(time * 5.3) * 0.1 });
      fade(cglow, 0.6 + open * 0.2);

      /* v10b: in grief, weeping — the grey cloud rains */
      const grief = es(t, 1.05, 1.4);
      const cl = es(t, 1.1, 1.5, ease.out) * (1 - es(t, 2.2, 2.5) * 0.5);
      pose(cloud, { x: 760, y: lerp(120, 330, es(t, 1.1, 1.5, ease.out)), o: cl });
      drops.forEach((d, i) => {
        const k = time ? (time * 0.8 + i / drops.length) % 1 : i / drops.length;
        pose(d, { x: -80 + i * 40, y: 14 + k * 70, o: cl * (1 - k) });
      });
      /* v11: they will not believe — heads shake, the tomb in their thoughts is still shut */
      const shake = es(t, 2.1, 2.3) * (1 - es(t, 2.8, 2.95));
      SEATS.forEach((m) => {
        const lookUp = es(t, 0.5, 0.8) * (1 - grief * 0.6);
        m.p.set({
          x: m.x, y: m.y, s: m.s, flip: m.i === 3 || m.i === 4 || m.i === 6 ? true : lookUp > 0.5 && m.x > 700 ? false : m.flip,
          armF: 60 - grief * 20 + (m.i === 2 ? shake * 50 : 0), armB: 20 + (m.i % 3 === 1 ? grief * 100 * (1 - shake) : 0),
          head: 14 * (1 - lookUp) + grief * 6 + Math.sin(time * 9 + m.i) * 10 * shake - lookUp * 8,
          blink: blinkAt(time, m.seed),
        });
        fade(m.sad, 0.3 + grief * 0.7);
        fade(m.tear, grief * (m.i % 2 ? 1 : 0.6) * (1 - shake * 0.5));
      });
      doubt.forEach(({ m, el }, i) => {
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip, 62);
        const b = es(t, 2.2 + i * 0.08, 2.4 + i * 0.08, ease.back);
        pose(el, { x: hx + (m.flip ? -14 : 10), y: hy - 20, s: b * 0.9, o: b > 0.01 ? 1 : 0 });
      });

      S.cam.x = 40 - es(t, 1.0, 1.5) * 50 + es(t, 2.0, 2.5) * 30;
      S.cam.y = 50;
      S.cam.z = (1.06 + es(t, 1.0, 1.5) * 0.05) * (S.portrait ? 0.88 : 1);
    };
  },
};
