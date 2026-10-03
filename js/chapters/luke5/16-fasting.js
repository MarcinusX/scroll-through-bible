// Łk 5,33 — the Pharisees at the gate go on: two round pictures come down on strings above them — John's disciples
// kneeling in the desert over empty bowls turned upside down, their hands raised in prayer; and the disciples of the
// Pharisees at prayer with their scrolls, fasting too. "But yours eat and drink" — the pictures swing up and away and
// they point at the table, where Peter is breaking bread and John lifts his cup.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  levisFeast, FP, FT, bubble, loaf, cup, johnsOpts, scribe, sparkle, headAt, kf, es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const camFor = (x) => (x - 800) / FP;

/** an upturned empty bowl (fasting); origin: its rim */
function upBowl(c, w = 30) {
  return sheet().p(c.cut([[-w / 2, 0], [w / 2, 0], [w * 0.3, -w * 0.34], [-w * 0.3, -w * 0.34]], 0.3, 4), C.pot).x(c.ribbon([[-w * 0.4, -4], [w * 0.4, -4]], 1.4), shade(C.pot, -0.2), 'opacity=".6"').out();
}
/** a round hung picture with a small scene inside (origin centre) */
function picture(c, inner, { r = 88, bg = mix(C.parchment, C.sand, 0.3), ground = mix(C.sand2, C.dune, 0.4), id }) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 8, 40), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, r, 40), 0.5, 5), bg);
  const g = sheet().p(c.cut([[-r, r * 0.3], [0, r * 0.22], [r, r * 0.32], [r, r], [-r, r]], 0.5, 6), ground).out();
  return `<path d="M0 -1600V${-r - 8}" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${s.out()}<clipPath id="${id}"><circle r="${r - 2}"/></clipPath><g clip-path="url(#${id})">${g}${inner}</g>`;
}

export default {
  id: 'lk5-fasting',
  beats: [
    { v: 33, text: 'Wówczas oni rzekli do Niego: «Uczniowie Jana dużo poszczą i modły odprawiają, tak samo uczniowie faryzeuszów;' },
    { v: 33, cont: true, text: 'Twoi zaś jedzą i piją».' },
  ],
  cam: { x: [camFor(560), camFor(900)], y: [20, 130], z: [1.0, 1.2] },
  build(S) {
    const c = S.c;
    const F = levisFeast(S);
    const peter = F.places.find((p) => p.who === 'peter'), john = F.places.find((p) => p.who === 'john');
    const peterP = S.puppet(F.L.add(person(c, { ...CAST.peter, pose: 'sit', holdF: `<g transform="translate(0 4)">${loaf(c, 14)}</g>` })));
    const johnP = S.puppet(F.L.add(person(c, { ...CAST.john, pose: 'sit', holdF: `<g transform="translate(2 12)">${cup(c)}</g>` })));
    const glints = [0, 1].map(() => F.fx.add(`<g>${sparkle(c, 12)}</g>`));

    /* the two pictures */
    const PL = S.layer({ par: FP, sh: 6, rise: 0 });
    const jd = [0, 1, 2].map((i) => `<g transform="translate(${-50 + i * 50} 40) scale(.34)">${person(c, { ...johnsOpts(c), pose: 'kneel' }).replace('<g class="armBr">', '<g class="armBr" transform="rotate(-160)">').replace('<g class="armFr">', '<g class="armFr" transform="rotate(-60)">')}</g><g transform="translate(${-32 + i * 50} 42)">${upBowl(c, 20)}</g>`).join('');
    const ph = [0, 1, 2].map((i) => `<g transform="translate(${-48 + i * 48} 46) scale(.34)">${scribe(c, i).replace('<g class="armBr">', '<g class="armBr" transform="rotate(-150)">').replace('<g class="armFr">', '<g class="armFr" transform="rotate(-50)">')}</g>`).join('') + `<g transform="translate(0 -40)">${sheet().p(c.cut(c.rect(-50, -20, 100, 40), 0.4, 5), C.cream).p(c.cut([[-60, -20], [0, -46], [60, -20]], 0.4, 5), C.plaster2).out()}</g>`;
    const pic1 = PL.add(`<g>${picture(c, jd, { id: S.id('p1') })}</g>`);
    const pic2 = PL.add(`<g>${picture(c, ph, { id: S.id('p2'), bg: mix(C.parchment, C.stone, 0.3), ground: mix(C.stone2, C.sand, 0.4) })}</g>`);
    const tags = [tr('uczniowie Jana', 'John’s disciples'), tr('uczniowie faryzeuszów', 'the Pharisees’ disciples')].map((txt) => PL.add(`<g>${bubble(c, txt, { size: 15, tail: 0 })}</g>`));

    return (t, time) => {
      const T = time;
      F.idle(T, 1);
      F.seatAll(1);
      pose(peter.el, { o: 0 }); pose(john.el, { o: 0 });
      F.leviSit.set({ x: 773, y: FT.SEAT, s: 1.0, o: 1, armF: 40, armB: 14, head: 4, blink: blinkAt(T, 4) });
      F.leviStand.set({ o: 0 });
      F.jSit.set({ o: 0 });
      F.jStand.set({ x: 845, y: FT.FLOOR - 70, s: 1.02, flip: true, armF: 20 + es(t, 0.3, 0.6) * 20, armB: 12, head: 2, blink: blinkAt(T) });

      /* v33a — they speak of fasting and prayer; the two pictures come down */
      const speak = es(t, 0.05, 0.25);
      const point = es(t, 1.05, 1.25);
      F.PH.forEach((m) => {
        m.p.set({ x: m.x, y: FT.FLOOR - 6 + m.i * 3, s: 1, armF: 20 + (m.i === 1 ? speak * 60 * (1 - point) : 0) + (m.i === 2 ? point * 80 : 0), armB: 10 + (m.i === 0 ? speak * 90 * (1 - point) : 0) + (m.i === 1 ? point * 40 : 0), lean: m.i === 2 ? point * 8 : 0, head: m.i === 1 ? 6 : 0, blink: blinkAt(T, m.seed) });
        fade(m.angry, 1);
      });
      const p1 = es(t, 0.15, 0.5, ease.out) * (1 - es(t, 1.0, 1.25, ease.in));
      const p2 = es(t, 0.4, 0.75, ease.out) * (1 - es(t, 1.02, 1.28, ease.in));
      pose(pic1, { x: 410, y: lerp(-500, 330, p1), r: T ? Math.sin(T * 0.8) * 1.5 : 0, o: p1 > 0.01 ? 1 : 0 });
      pose(pic2, { x: 630, y: lerp(-500, 320, p2), r: T ? Math.sin(T * 0.8 + 1) * 1.5 : 0, o: p2 > 0.01 ? 1 : 0 });
      pose(tags[0], { x: 410, y: lerp(-500, 330, p1) + 132, s: 1, o: p1 > 0.01 ? 1 : 0 });
      pose(tags[1], { x: 630, y: lerp(-500, 320, p2) + 132, s: 1, o: p2 > 0.01 ? 1 : 0 });

      /* v33b — "but yours eat and drink": Peter breaks bread, John drinks */
      const eat = es(t, 1.1, 1.35);
      peterP.set({ x: peter.x, y: FT.SEAT, s: 1, flip: true, armF: 60 + eat * 60, armB: 20, head: -eat * 4, blink: blinkAt(T, 2) });
      johnP.set({ x: john.x, y: FT.SEAT, s: 1, flip: true, armF: 50 + eat * 70, armB: 16, head: -eat * 8, blink: blinkAt(T, 6) });
      glints.forEach((g, i) => { const k = bump(t, 1.3 + i * 0.12, 1.8 + i * 0.12); const [hx, hy] = headAt(i ? john.x : peter.x, FT.SEAT, 1, true, 62); pose(g, { x: hx - 40, y: hy + 10, s: k, r: T * 50, o: k }); });

      S.cam.x = kf(t, [[0, camFor(S.portrait ? 610 : 660)], [0.9, camFor(S.portrait ? 600 : 650)],   // phone: the speakers and both pictures on the screen
        [1.2, camFor(820)], [2, camFor(840)]]);
      S.cam.y = kf(t, [[0, 60], [0.9, 60], [1.2, 110], [2, 110]]);
      S.cam.z = kf(t, [[0, 1.06], [0.9, 1.08], [1.2, 1.14], [2, 1.16]]);
    };
  },
};
