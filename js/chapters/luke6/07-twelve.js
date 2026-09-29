// Łk 6,14–16 — morning on the summit; the Twelve stand in their half-ring round Jesus, the sun just risen behind Him.
// As each is named, he steps forward, a ray of the morning sun reaches out to him and his name tag comes down on its
// string, two by two as Luke pairs them, one on the left, one on the right: Simon — his tag turns over to "Peter", with
// a rock — and Andrew his brother; James and John; Philip and Bartholomew; Matthew and Thomas; James son of Alphaeus
// and Simon the Zealot; Judas son of James — and Judas Iscariot, whose tag is cut from dark paper: no ray reaches him,
// he turns his face aside, a long shadow runs out from his feet, and his tag turns over: "who became a traitor".
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { rockIcon } from '../matthew10/lib.js';
import { shadowPerson } from '../mark3/lib.js';
import { summitSet, SUMMIT, LK12, folk, stillGroup, kf, nameTag, strip, halo, sparkle, tr, PI } from './lib.js';
import { ringSlot, RING_OF } from './06-night.js';

// when each is named (scene time)
const AT = [0.04, 0.3, 0.42, 0.5, 0.6, 0.68, 1.04, 1.18, 1.32, 1.5, 2.04, 2.26];
const SUN = [800, 430];

export default {
  id: 'lk6-twelve',
  beats: [
    { v: 14 },
    { v: 15 },
    { v: 16 },
  ],
  cam: { x: [-30, 30], y: [-20, 50], z: [1, 1.1] },
  build(S) {
    const M = summitSet(S);
    const c = S.c;
    const pf = M.pf;

    /* the rays of the morning sun, one to each (behind everyone) */
    const rayL = S.layer({ par: 0.4, sh: 1, flat: true });
    const rays = LK12.map(() => rayL.add(`<g opacity="0"><path d="${c.poly([[0, -6], [1, -26], [1, 26], [0, 6]])}" fill="#fff0c2" opacity=".75"/></g>`));
    const jGlow = rayL.add(`<g>${halo(140, 0.8)}</g>`);
    const OL = S.layer({ par: 0.41, sh: 4 });
    [[-1, 560], [-1, 470], [1, 1040], [1, 1130]].forEach(([side, x]) => {
      const mem = Array.from({ length: 3 }, (_, k) => ({ x: (k - 1) * 34 + c.rr(-6, 6), y: c.rr(-4, 6), s: 1, flip: side > 0, o: folk(c), head: c.rr(-6, 2), armF: c.rr(0, 20) }));
      OL.add(`<g transform="translate(${x} ${(pf(x) - 26).toFixed(1)}) scale(.62)">${stillGroup(c, mem)}</g>`);
    });
    const shadowL = S.layer({ par: 0.42, sh: 1, flat: true });
    const L = S.layer({ par: 0.42, sh: 4 });
    const T12 = LK12.map((m, i) => ({ ...m, slot: ringSlot(pf, RING_OF[i]), seed: c.rr(0, 9), at: AT[i], p: S.puppet(L.add(person(c, m.o))) }));
    const judas = T12[11];
    const jShadow = shadowL.add(`<g opacity="0">${shadowPerson(c, judas.o, '#3a3040')}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));

    /* the name tags */
    const tagL = S.layer({ par: 0.42, sh: 5 });
    T12.forEach((m) => {
      const k = RING_OF[m.i] % 6;
      m.level = k % 2;
      m.tagY = m.slot.y - 185 * m.slot.s - 70 - m.level * (k >= 4 ? 96 : 80);
      const name = m.name();
      let inner = `<g data-part="front">${nameTag(c, name, { size: 15, dark: m.k === 'judas' })}</g>`;
      if (m.k === 'peter') inner += `<g data-part="back" opacity="0">${nameTag(c, tr('Piotr', 'Peter'), { size: 19, w: 92 })}<g transform="translate(0 64) scale(.8)">${rockIcon(c)}</g></g>`;
      if (m.k === 'judas') inner += `<g data-part="back" opacity="0">${nameTag(c, tr(['który stał się', 'zdrajcą'], ['who became', 'a traitor']), { size: 15, dark: true })}</g>`;
      m.tag = hanging(tagL, inner, { x: m.slot.x, y: m.tagY, len: 900 });
      m.front = m.tag.querySelector('[data-part="front"]');
      m.back = m.tag.querySelector('[data-part="back"]');
    });
    const sparks = T12.map(() => tagL.add(`<g opacity="0">${sparkle(c, 9)}</g>`));

    return (t, time) => {
      const T = time;
      M.update(T, { dark: 0, dawnK: 0, dayK: 1, moonU: -1, sunUp: 1.12, starsK: 0 });
      pose(jGlow, { x: 800, y: SUMMIT.TOP - 110, o: 0.8 });

      // who was named last?
      let cur = 0;
      T12.forEach((m) => { if (t >= m.at - 0.02) cur = m.i; });
      const curM = T12[cur];

      T12.forEach((m) => {
        const fw = es(t, m.at, m.at + 0.12);
        const back = m.k === 'judas' ? 0 : es(t, m.at + 0.3, m.at + 0.45) * 0.6;
        const step = fw * (1 - back);
        const judas = m.k === 'judas';
        const aside = judas ? es(t, 2.45, 2.7) : 0;
        const side = m.slot.flip ? 1 : -1;
        const x = m.slot.x + side * step * 6;
        const y = m.slot.y + step * 14;
        m.p.set({ x, y, s: m.slot.s * (1 + step * 0.06), flip: aside > 0.5 ? !m.slot.flip : m.slot.flip, armF: 20 + step * (judas ? 10 : 30), armB: step * (judas ? 20 : 110), head: -step * 6 + aside * 14, blink: blinkAt(T, m.seed) });
        // the ray
        const [hx, hy] = [x + side * -2, y - 150 * m.slot.s];
        const rk = judas ? 0 : es(t, m.at, m.at + 0.14);
        const len = Math.hypot(hx - SUN[0], hy - SUN[1]);
        pose(rays[m.i], { x: SUN[0], y: SUN[1], sx: len * rk, sy: 1, r: (Math.atan2(hy - SUN[1], hx - SUN[0]) * 180) / PI, o: rk > 0.01 ? 1 : 0 });
        // the tag
        const drop = es(t, m.at, m.at + 0.2, ease.back);
        pose(m.tag, { x: m.slot.x, y: lerp(-300, m.tagY, drop), r: Math.sin(T * 0.8 + m.seed) * 2, oy: 0, o: drop > 0.001 ? 1 : 0 });
        if (m.back) {
          const k = m.k === 'judas' ? seg(t, 2.42, 2.56) : seg(t, 0.14, 0.26);
          pose(m.front, { sx: k < 0.5 ? Math.max(0.04, Math.cos(k * PI)) : 0.04, o: k < 0.5 ? 1 : 0 });
          pose(m.back, { sx: k < 0.5 ? 0.04 : Math.max(0.04, -Math.cos(k * PI)), o: k < 0.5 ? 0 : 1 });
        }
        const sk = judas ? 0 : bump(t, m.at + 0.02, m.at + 0.4);
        pose(sparks[m.i], { x: hx, y: hy - 40, s: sk, r: T * 40, o: sk });
      });

      /* Judas who became a traitor */
      const sh = es(t, 2.4, 2.8);
      pose(jShadow, { x: judas.slot.x + 4, y: judas.slot.y + 14, s: judas.slot.s, sx: 0.8, sy: 0.2 + sh * 1.2, r: 104, o: sh * 0.55 });

      /* Jesus turns to each as he names him */
      const toRight = curM.slot.flip;
      jesus.set({ x: 800, y: SUMMIT.TOP, s: 1.0, flip: !toRight, armF: 16 + 44 + bump(t, curM.at - 0.04, curM.at + 0.3) * 30, armB: 10, head: -2, blink: blinkAt(T, 2) });

      S.cam.x = kf(t, [[-0.5, 0], [0.1, -20], [0.7, 0], [1.0, 0], [1.6, 10], [2.0, 10], [2.5, 30]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.3, 20], [2.0, 20], [2.5, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.3, 1.05], [2.0, 1.05], [2.5, 1.08]]);
    };
  },
};
