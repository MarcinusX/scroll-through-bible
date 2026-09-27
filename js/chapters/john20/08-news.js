// J 20,18 — The upper room in the morning, shutters closed, the disciples sitting in grief. The door flies open,
// daylight floods across the floor, and Mary Magdalene runs in — the first witness. "I have seen the Lord!" — and
// a slip with what He told her: a stair of light up to the Father. Heads lift, brows clear, one after another.
import { C, person, blinkAt, pose, lerp, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { MAGD, TW, room20, RDOOR, tenAt, headAt, bubble, risenIcon, sparkle, withFace, faceBits, GLYPH, tr } from './lib.js';

export default {
  id: 'j20-news',
  beats: [
    { v: 18, text: 'Poszła Maria Magdalena oznajmiając uczniom:' },
    { v: 18, cont: true, text: '«Widziałam Pana i to mi powiedział».' },
  ],
  cam: { x: [0, 80], y: [0, 50], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const { R, door, FLOOR } = room20(S, { night: false });
    const gid = S.id('flood');
    S.defs(`<linearGradient id="${gid}" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff3cf" stop-opacity=".75"/><stop offset="1" stop-color="#fff3cf" stop-opacity="0"/></linearGradient>`);
    const floodL = S.layer({ par: 0.4, sh: 0, flat: true });
    const flood = floodL.add(`<path d="${c.poly([[RDOOR.d0, FLOOR - 40], [RDOOR.d1, FLOOR - 40], [RDOOR.d1 - 40, FLOOR + 200], [RDOOR.d0 - 620, FLOOR + 200]])}" fill="url(#${gid})"/>`);

    const PL = S.layer({ par: 0.52, sh: 5 });
    const ten = tenAt(c).map((m) => {
      const el = PL.add(withFace(person(c, { ...TW[m.k], pose: 'sit' }), faceBits(c)));
      return { ...m, p: S.puppet(el), sad: el.querySelector('[data-part="sad"]') };
    });
    const mEl = PL.add(withFace(person(c, { ...MAGD }), faceBits(c)));
    const mary = S.puppet(mEl);
    const fx = S.layer({ par: 0.56, sh: 5 });
    const say = fx.add(`<g>${bubble(c, tr('Widziałam Pana!', 'I have seen the Lord!'), { size: 22, tail: 1 })}</g>`);
    const icon = fx.add(`<g>${risenIcon(c)}</g>`);
    const slip = fx.add(`<g>${bubble(c, ' ', { size: 20, tail: 1, w: 92 })}<path d="M-24 -20C-14 -26 -2 -34 8 -44" stroke="${C.haloRim}" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 5" fill="none"/><circle cx="16" cy="-46" r="9" fill="${C.sun}"/></g>`);
    const wow = ten.map(() => fx.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, T) => {
      R.update(T, 0);
      /* v18a: the door flies open, she runs in */
      const open = es(t, 0.08, 0.3, ease.out);
      door.set(open);
      door.bolt(0);
      fade(flood, open);
      const run = es(t, 0.2, 0.85, ease.out);
      const dx = RDOOR.d0 + 50 + S.cam.x * 0.22;
      const mx = lerp(dx, 840, run);
      const tell = es(t, 1.02, 1.2);
      mary.set({ x: mx, y: 744, s: 1.0, flip: true, o: seg(t, 0.2, 0.26), walk: run > 0 && run < 1 ? mx * 0.09 : undefined, amt: 1.3, lean: (run < 1 ? 8 : 0) - tell * 4, armF: 30 + tell * 60 + bump(t, 1.4, 2) * 20, armB: 20 + tell * 90, head: -4 - tell * 4, blink: blinkAt(T, 3) });
      const [mhx, mhy] = headAt(mx, 744, 1.0, true);

      ten.forEach((m) => {
        const d = Math.abs(m.x - mx);
        const hear = es(t, 0.3 + d * 0.0006, 0.55 + d * 0.0006);
        const joy = es(t, 1.2 + d * 0.0008, 1.5 + d * 0.0008);
        const toMary = m.x < mx;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: hear > 0.5 ? !toMary : m.flip, armF: 30 + joy * 30, armB: 12 + joy * (m.i % 3 === 0 ? 90 : 20), head: 12 * (1 - hear) - joy * 8, lean: hear * 3, blink: blinkAt(T, m.seed) });
        fade(m.sad, 1 - joy);
      });
      wow.forEach((el, i) => {
        const m = ten[i];
        const [hx, hy] = headAt(m.x, m.y, m.s, false, 62);
        const b = bump(t, 1.3 + (i % 5) * 0.08, 1.9 + (i % 5) * 0.08);
        pose(el, { x: hx + 14, y: hy - 36, s: b, r: T * 30, o: b });
      });

      /* v18b: "I have seen the Lord" — and what He told her */
      const k = es(t, 1.05, 1.25, ease.back);
      pose(say, { x: mhx - 60, y: mhy - 24, s: k, o: k > 0.01 ? 1 : 0 });
      pose(icon, { x: mhx - 60, y: mhy - 126, s: es(t, 1.15, 1.35, ease.back), o: k > 0.01 ? 1 : 0 });
      const sk = es(t, 1.5, 1.7, ease.back);
      pose(slip, { x: mhx - 210, y: mhy - 10, s: sk, o: sk > 0.01 ? 1 : 0 });

      S.cam.x = 60 - es(t, 0.8, 1.3) * 40;
      S.cam.y = 30;
      S.cam.z = 1.04 + es(t, 1, 1.5) * 0.03;
    };
  },
};
