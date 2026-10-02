// Mt 3,16–17 — Jesus goes down under the water and at once comes up out of it. The sky over the Jordan is
// two painted doors: they swing apart and the heavens stand open, gold beyond. The Spirit of God comes down
// through the opening like a dove and rests over Him. A voice from heaven: rings of light roll down, John
// kneels in the river, and the words appear on a ribbon of light — "This is my beloved Son".
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { JOHN_B, hand, headAt, riverSet, heavenDoor, lightBanner, dove, flapWings, drops, folk, group, HEAVEN, tr } from './lib.js';

const PI = Math.PI;
const JX = 800, WADE = 702, JOX = 675, BANK = 776;

export default {
  id: 'mt3-heavens',
  beats: [
    { v: 16, text: 'A gdy Jezus został ochrzczony, natychmiast wyszedł z wody.' },
    { v: 16, cont: true, text: 'A oto otworzyły Mu się niebiosa' },
    { v: 16, cont: true, text: 'i ujrzał Ducha Bożego zstępującego jak gołębicę i przychodzącego na Niego.' },
    { v: 17, text: 'A głos z nieba mówił:' },
    { v: 17, cont: true, text: '«Ten jest mój Syn umiłowany, w którym mam upodobanie».' },
  ],
  cam: { x: [-30, 30], y: [-70, 60], z: [0.96, 1.16] },
  build(S) {
    const c = S.c;

    /* behind the sky: gold and rays */
    sky(S, HEAVEN, { name: 'gold' });
    const burstL = S.layer({ par: 0, sh: 1, flat: true, rise: 0 });
    burstL.add(`<g transform="translate(800 110)">${rays(c, { n: 24, r0: 30, r1: 1200, spread: 0.035, color: '#fff6dc' })}</g><circle cx="800" cy="110" r="440" fill="url(#halo-glow)"/>`);

    /* the day sky: two doors that swing apart; a seamless copy on top until they open */
    const gid = S.id('daysky');
    const y0 = Math.min(-200, S.view().y0);
    S.defs(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="${y0.toFixed(0)}" x2="0" y2="700"><stop offset="0" stop-color="#bcd8d6"/><stop offset=".55" stop-color="#e3ecdd"/><stop offset="1" stop-color="#f4ecd4"/></linearGradient>`);
    const doorL = S.layer({ par: 0, sh: 6, pad: 520, rise: 0 });
    doorL.add(`<g transform="translate(800 0)">${heavenDoor(c, -1, gid)}</g>`);
    const doorR = S.layer({ par: 0, sh: 6, pad: 520, rise: 0 });
    doorR.add(`<g transform="translate(800 0)">${heavenDoor(c, 1, gid)}</g>`);
    const whole = S.layer({ par: 0, sh: 1, flat: true, rise: 0 });
    whole.add(`<rect x="-3000" y="-3000" width="8000" height="3760" fill="url(#${gid})"/><rect class="grain" x="-3000" y="-3000" width="8000" height="3760"/>`);

    /* the Jordan */
    const J = riverSet(S, { sunAt: [1250, 150] });
    const { far, fbFn } = J;
    const farCrowd = [[330, 3], [520, 2], [1080, 3], [1290, 3]].map(([x, n]) => {
      const mem = Array.from({ length: n }, (_, k) => ({ x: (k - (n - 1) / 2) * 30 + c.rr(-5, 5), y: c.rr(-4, 4), s: 1, flip: x > JX, o: folk(c) }));
      return far.sprite(`<g transform="scale(.42)">${group(c, mem)}</g>`, x, fbFn(x) + 8);
    });

    /* in the river */
    const R = J.riverLayer();
    const beam = R.add(`<path d="${c.poly([[760, 60], [840, 60], [900, 700], [700, 700]])}" fill="#fff4cf" opacity="0"/>`);
    const glow = R.add(`<circle r="170" fill="url(#halo-glow)" opacity="0"/>`);
    const jesus = S.puppet(R.add(person(c, { ...CAST.jesus })));
    const john = S.puppet(R.add(person(c, { ...JOHN_B })));
    const johnK = S.puppet(R.add(person(c, { ...JOHN_B, pose: 'kneel' })));
    const dripEl = R.add(`<g>${drops(c, 7, C.lake)}</g>`);
    J.waterFront(R);
    const splash = R.add(`<g opacity="0">${[-1, 1].map((sd) => `<path d="${c.cut([[0, 0], [sd * 24, -40], [sd * 36, -34], [sd * 14, 2]], 0.4, 4)}" fill="${C.foam}"/>`).join('')}</g>`);
    const ripples = [0, 1, 2].map(() => R.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 60, 12, 0, PI * 2, 30), 3)}" fill="${C.foam}"/></g>`));

    /* the near bank */
    const { N } = J.nearBank();
    const LIS = (S.portrait ? [[515, false, 0.84], [600, false, 0.8], [990, true, 0.82], [1045, true, 0.86]]   // phone: the listeners inside the frame
      : [[430, false, 0.84], [535, false, 0.8], [1070, true, 0.82], [1175, true, 0.86]]).map(([x, flip, s], i) => ({ x, flip, s, i, p: S.puppet(N.add(person(c, folk(c)))), seed: c.rr(0, 9) }));
    [[-1, 260, 3], [1, 1350, 3]].forEach(([side, x, n]) => {
      const mem = Array.from({ length: n }, (_, k) => ({ x: (k - (n - 1) / 2) * 44 + c.rr(-6, 6), y: c.rr(-6, 6), s: 1, flip: side > 0, o: folk(c) }));
      N.add(`<g transform="translate(${x} ${BANK + 4}) scale(.8)">${group(c, mem)}</g>`);
    });
    J.foreground();

    /* the dove, the rings of the voice, the words */
    const V = S.layer({ par: 0.45, sh: 5 });
    const doveEl = V.add(dove(c));
    const rings = [0, 1, 2, 3].map(() => V.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 90, 36, PI * 0.08, PI * 0.92, 18), 8)}" fill="#fffaf0"/></g>`));
    const words = V.add(`<g>${lightBanner(c, tr('«Ten jest mój Syn umiłowany»', '“This is my beloved Son”'), { size: 30 })}</g>`);

    return (t, time) => {
      J.update(t, time);

      /* v16a — down under the water, and at once up out of it */
      const under = es(t, 0.08, 0.3) * (1 - es(t, 0.42, 0.62));
      const up = es(t, 0.5, 0.75);
      const jy = WADE + under * 142 - up * 14;
      const look = es(t, 1.1, 1.4);
      const dv = es(t, 2.05, 2.8);
      const voice = es(t, 3.05, 3.3);
      const words_ = es(t, 4.05, 4.35, ease.out);
      jesus.set({
        x: JX, y: jy, s: 1.05,
        head: -look * 14 + dv * 6 + words_ * 4, armF: 14 + bump(t, 0.5, 1.0) * 20 + look * 24 + words_ * 50, armB: 10 + look * 30 + words_ * 110,
        blink: blinkAt(time, 3),
      });
      const [hx, hy] = headAt(JX, jy, 1.05);
      pose(splash, { x: JX, y: 652, s: bump(t, 0.05, 0.3) + bump(t, 0.45, 0.7) * 1.3, o: Math.max(bump(t, 0.05, 0.3), bump(t, 0.45, 0.7)) });
      pose(dripEl, { x: JX + 10, y: hy + 30 + ((time * 1.3) % 1) * 90, o: bump(t, 0.55, 1.3) * 0.9 });
      ripples.forEach((r, i) => {
        const k = time ? ((time * 0.4 + i / 3) % 1) : (i + 1) / 3.5;
        pose(r, { x: JX + 6, y: 656, s: 0.6 + k * 1.6, o: bump(t, 0.1, 1.2) * (1 - k) * 0.8 });
      });
      const kneel = es(t, 3.1, 3.16);
      const awe = es(t, 1.1, 1.4);
      john.set({
        x: JOX, y: WADE, s: 1.03, o: 1 - kneel,
        armF: 20 + bump(t, 0.0, 0.8) * 60 + awe * 40, armB: 10 + awe * 100, head: bump(t, 0.0, 0.8) * 10 - awe * 14, blink: blinkAt(time, 1),
      });
      johnK.set({ x: JOX - 10, y: WADE - 22, s: 1.03, o: kneel, armF: 60, armB: 40 + words_ * 60, head: 16 - words_ * 20, lean: 8, blink: blinkAt(time, 1) });

      /* v16b — the heavens open */
      const open = es(t, 1.08, 1.6, ease.out);
      whole.fade(1 - seg(t, 1.06, 1.1));
      doorL.shift(-open * 460, 0);
      doorR.shift(open * 460, 0);
      burstL.fade(open);
      pose(beam, { o: open * 0.1 + dv * 0.2 + voice * 0.1 });

      /* v16c — the Spirit like a dove, coming down upon Him */
      const dy = lerp(40, hy - 74, ease.out(dv));
      pose(doveEl, { x: JX + Math.sin(dv * PI * 2) * 50 * (1 - dv), y: dy + (time ? Math.sin(time * 2) * 4 * dv : 0), s: 1.25, o: seg(t, 2.0, 2.08) });
      flapWings(doveEl, time, 30 + (1 - dv) * 10, 7 - dv * 3, -10);
      pose(glow, { x: hx, y: hy + 10, s: 0.8 + dv * 0.8 + voice * 0.6, o: Math.max(dv, voice) * 0.9 });

      /* v17 — the voice from heaven: rings of light, and the words */
      rings.forEach((r, i) => {
        const k = time ? ((time * 0.35 + i / 4) % 1) : (i + 1) / 4.5;
        pose(r, { x: JX, y: 110 + k * 300, s: 0.8 + k * 2.6, sy: 0.8 + k * 1.8, o: voice * (1 - k) * 0.85 * (1 - words_ * 0.5) });
      });
      pose(words, { x: JX, y: 250, s: 0.6 + words_ * 0.4, o: words_ });

      /* the people look up; hands rise */
      LIS.forEach((l) => l.p.set({ x: l.x, y: BANK + (l.i % 2) * 6, s: l.s, flip: l.flip, armF: 20 + awe * (l.i % 2 ? 90 : 40) + voice * 20, armB: awe * (l.i % 2 ? 30 : 130), head: -awe * 12, blink: blinkAt(time, l.seed) }));
      farCrowd.forEach((sp) => sp.set({ o: 1 }));

      S.cam.y = 30 - es(t, 1.05, 1.5) * 60 + es(t, 2.2, 2.8) * 30;
      S.cam.z = 1.08 - es(t, 1.05, 1.5) * 0.1 + es(t, 2.2, 2.8) * 0.06;
    };
  },
};
