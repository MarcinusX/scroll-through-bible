// Łk 22,1–2 — the curtains open on the Temple court in the evening light: Jesus teaching, the people all round Him
// (as Luke left them, coming early to hear Him). The feast is near — pilgrims come in with a lamb, the Passover plates
// come down from the flies. On the left, under the portico, the chief priests and the scribes put their heads together:
// a thought of a net over the little haloed figure — and they glance back at the crowd, afraid of the people.
import { es, ease, bump, seg } from '../../core/anim.js';
import { curtains, swing } from '../kit.js';
import {
  templeCourt, courtFront, priest, scribe, withFace, faceBits, folk, group, discPlate, lamb, matzahRound, wordTag, thought, speech,
  snare, miniJesus, hanging, vis, kf, headAt, person, pose, fade, lerp, mix, shade, sheet, blinkAt, tr, C, CAST,
} from './lib.js';

const FLOOR = 676, JX = 820;

export default {
  id: 'lk22-plot',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
  ],
  cam: { x: [-170, 40], y: [-40, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const SKY = ['#a69abf', '#eab99c', '#f5d6b0'];
    const T0 = templeCourt(S, { skyCols: SKY, floorY: FLOOR + 40, sanctX: 820, sunAt: [1250, 210] });

    // the chief priests and the scribes under the portico on the left
    const prL = S.layer({ par: 0.44, sh: 4 });
    const PR = [
      { m: () => scribe(c, 0), x: 436, y: FLOOR - 26, s: 0.84 },
      { m: () => priest(c, 1), x: 496, y: FLOOR - 40, s: 0.82 },
      { m: () => priest(c, 3), x: 560, y: FLOOR - 24, s: 0.86, flip: true },
      { m: () => scribe(c, 2), x: 612, y: FLOOR - 38, s: 0.8, flip: true },
    ].map((d, i) => {
      const el = prL.add(withFace(d.m(), faceBits(c)));
      return { ...d, i, el, p: S.puppet(el), sad: el.querySelector('[data-part="sad"]'), angry: el.querySelector('[data-part="angry"]'), seed: c.rr(0, 9) };
    });

    // the people round Him: sprites (drawn once, never repainted)
    const crL = S.layer({ par: 0.46, sh: 4 });
    const mem = (n, x0, x1, pose, flip) => Array.from({ length: n }, (_, k) => ({ x: lerp(x0, x1, (k + 0.5) / n) + c.rr(-8, 8), y: c.rr(-6, 6), s: 1, flip, o: { ...folk(c), pose } }));
    const backL = crL.sprite(`<g transform="scale(.72)">${group(c, mem(5, -110, 110, 'stand', false))}</g>`, 730, FLOOR - 30);
    const backR = crL.sprite(`<g transform="scale(.72)">${group(c, mem(8, -200, 200, 'stand', true))}</g>`, 1040, FLOOR - 28);
    const sitL = crL.sprite(`<g transform="scale(.86)">${group(c, mem(3, -80, 80, 'sit', false))}</g>`, 700, FLOOR + 34);
    const sitR = crL.sprite(`<g transform="scale(.86)">${group(c, mem(5, -150, 150, 'sit', true))}</g>`, 1010, FLOOR + 40);

    // Jesus, teaching
    const JL = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(JL.add(person(c, CAST.jesus)));

    // the plates of the feast, the thought of the net, the fear of the crowd
    const fx = S.layer({ par: 0.52, sh: 5 });
    const plLamb = hanging(fx, discPlate(c, `<g transform="translate(-4 22) scale(.95)">${lamb(c)}</g>`, { r: 50, rim: C.ochre }), { x: 0, y: -1500, len: 600 });
    const plBread = hanging(fx, discPlate(c, matzahRound(c, 30), { r: 50, rim: C.ochre }), { x: 0, y: -1500, len: 600 });
    const plTag = hanging(fx, wordTag(c, tr('Święto Przaśników', 'Unleavened Bread'), { size: 19 }), { x: 0, y: -1500, len: 600 });
    const net = (() => {
      let d = '';
      for (let i = 0; i <= 5; i++) { const x = -26 + i * 10.4; d += c.ribbon(c.qbez([x * 0.4, -30], [x * 1.1, -8], [x, 14], 6), 1.2); }
      for (let j = 0; j < 4; j++) { const y = -22 + j * 11, w = 10 + j * 5; d += c.ribbon(c.qbez([-w, y], [0, y + 5], [w, y], 6), 1.2); }
      return `<path d="${d}" fill="${mix(C.rope, C.ink, 0.45)}"/>`;
    })();
    const plotB = fx.add(`<g>${thought(c, `<g transform="translate(-2 16)">${miniJesus(c, 0.78)}</g><g transform="translate(-2 -6)">${net}</g>`, { w: 84, h: 70 })}</g>`);
    const crowdIcon = (() => {
      const s = sheet();
      let d = '';
      [[-16, 4], [0, 0], [16, 4]].forEach(([x, y]) => { d += c.cut(c.circ(x, y - 8, 5.5, 10), 0.2, 3) + c.cut([[x - 8, y + 12], [x - 6, y - 2], [x + 6, y - 2], [x + 8, y + 12]], 0.2, 3); });
      s.p(d, mix(C.plumRobe, C.ink, 0.3));
      let jag = '';
      [-1, 1].forEach((sd) => { jag += c.ribbon([[sd * 26, -12], [sd * 32, -18]], 2.4) + c.ribbon([[sd * 27, -2], [sd * 35, -2]], 2.4) + c.ribbon([[sd * 26, 8], [sd * 32, 14]], 2.4); });
      s.x(jag, C.terracotta);
      return s.out();
    })();
    const fearB = fx.add(`<g>${speech(c, `<g transform="scale(.9)">${crowdIcon}</g>`, { w: 92, h: 56 })}</g>`);

    courtFront(S, { xs: [180, 1440] });
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      swing(T0.sunEl, 1250, 210 + es(t, 0.5, 3) * 60, T, 1.1, 0.7);
      swing(T0.cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);

      /* Jesus teaching the people */
      const teach = 0.5 + 0.5 * Math.sin(t * PI2);
      jesus.set({ x: JX, y: FLOOR + 8, s: 1.04, flip: false, armF: 30 + teach * 36, armB: 12 + teach * 16, head: -4, blink: blinkAt(T) });

      /* v1 — the feast draws near: the pilgrims with a lamb, the plates */
      // pilgrims come up for the feast and fill the court round Him
      const fill = es(t, 0.9, 1.7, ease.out);
      backL.set({ x: backL.bx - (1 - fill) * 700 + es(t, 2.4, 2.8) * 10, y: backL.by, o: fill > 0.01 ? 1 : 0 });
      backR.set({ x: backR.bx + (1 - fill) * 800 - es(t, 2.4, 2.8) * 10, y: backR.by, o: fill > 0.01 ? 1 : 0 });
      const pin = es(t, 1.0, 1.45, ease.out) * (1 - es(t, 1.95, 2.25, ease.in));
      const tin = es(t, 1.15, 1.6, ease.out) * (1 - es(t, 1.95, 2.25, ease.in));
      vis(plLamb, { x: 700, y: 330 - (1 - pin) * 700, r: T ? Math.sin(T * 0.9) * 2 : 0, o: pin > 0.01 ? 1 : 0 });
      vis(plBread, { x: 940, y: 330 - (1 - pin) * 700, r: T ? Math.sin(T * 0.9 + 2) * 2 : 0, o: pin > 0.01 ? 1 : 0 });
      vis(plTag, { x: 820, y: 236 - (1 - tin) * 700, r: T ? Math.sin(T * 1.1 + 1) * 3 : 0, o: tin > 0.01 ? 1 : 0 });

      /* v2 — the chief priests and scribes: heads together; a glance back at the people */
      const huddle = es(t, 2.02, 2.3);
      const glance = es(t, 2.45, 2.62);
      PR.forEach((m) => {
        const inward = m.flip ? -1 : 1;
        let armF = 14 + huddle * 20, armB = 6, head = huddle * 10, lean = huddle * 7;
        if (m.i === 1) { armF += huddle * 40; }
        if (m.i === 2) { armF = 14 + huddle * 30 * (1 - glance) + glance * 64; armB = 6 + glance * 40; head = huddle * 10 * (1 - glance) - glance * 8; lean = huddle * 7 * (1 - glance) - glance * 4; }
        if (m.i === 3) { head = huddle * 8 * (1 - glance) - glance * 6; }
        const flip = m.i === 2 || m.i === 3 ? glance > 0.5 ? false : true : false;
        m.p.set({ x: m.x + inward * huddle * 12, y: m.y, s: m.s, flip, armF, armB, head, lean, blink: blinkAt(T, m.seed) });
        fade(m.angry, huddle * (1 - glance) * 0.8);
        fade(m.sad, glance * (m.i >= 2 ? 1 : 0.5));
      });
      const pb = es(t, 2.12, 2.32, ease.back);
      vis(plotB, { x: P ? 530 : 470, y: P ? 440 : 470, s: pb * 1.25, o: pb > 0.01 ? 1 : 0 });
      const fb = es(t, 2.52, 2.7, ease.back);
      const [hx, hy] = headAt(560 - 12, FLOOR - 24, 0.86, false);
      vis(fearB, { x: hx + 26, y: hy - 30, s: fb * 1.1, o: fb > 0.01 ? 1 : 0 });
      sitL.set({ o: 1 }); sitR.set({ o: 1 });

      S.cam.x = kf(t, [[0, -20], [1.0, -10], [2.0, -10], [2.3, P ? -150 : -90], [3, P ? -150 : -90]]);   // phone: the priests and their thought inside the screen
      S.cam.y = kf(t, [[0, 20], [1.0, 0], [2.0, 0], [2.3, 50], [3, 50]]);
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.0], [2.0, 1.02], [2.3, 1.14], [3, 1.16]]);
    };
  },
};
const PI2 = Math.PI * 2;
