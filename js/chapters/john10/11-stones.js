// J 10,31–33 — Solomon's Portico toward evening, the lamps burning, snow still falling. Beside the colonnade lie
// heaps of building stone: the leaders stoop and snatch up stones (held high — never thrown). Jesus answers: "Many
// good works I have shown you from the Father" — the plates of His works come down in a row, each hung on a thread
// of light from above. "For which of them do you stone Me?" — He points along them, one by one, and a question
// hangs over the stones. "Not for a good work" — they wave the plates away and the plates go dim; "but for
// blasphemy: because You, being a man, make Yourself God" — a dark bubble: a little man, an arrow, a crown of light.
import { C, person, blinkAt, pose, lerp, shade, mix, sheet, swing } from '../kit.js';
import { es, ease, bump, fade, attr } from '../../core/anim.js';
import {
  winterPortico, JESUS, leader, cast, mood, voiceRings, question, workPlate, stone, speech, hand, hanging, kf, vis, tr,
  WINTER_DUSK, WINTER, PI,
} from './lib.js';

const F = 704;
const LEAD = [[560, 704, 1.02, false, 0], [636, 670, 0.92, true, 1], [482, 724, 1.04, false, 2], [1040, 704, 1.02, false, 3], [964, 670, 0.92, true, 4], [1118, 726, 1.04, false, 5]];
const PILES = [[420, 716], [1180, 716]];
const WORKS = [['jar', 560], ['boy', 680], ['mat', 800], ['bread', 920], ['eye', 1040]];

export default {
  id: 'j10-stones',
  beats: [
    { v: 31 },
    { v: 32, text: 'Odpowiedział im Jezus: «Ukazałem wam wiele dobrych czynów pochodzących od Ojca.' },
    { v: 32, cont: true, text: 'Za który z tych czynów chcecie Mnie ukamienować?»' },
    { v: 33, text: 'Odpowiedzieli Mu Żydzi: «Nie chcemy Cię kamienować za dobry czyn,' },
    { v: 33, cont: true, text: 'ale za bluźnierstwo, za to, że Ty będąc człowiekiem uważasz siebie za Boga».' },
  ],
  cam: { x: [-60, 60], y: [-140, 40], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const W = winterPortico(S, { skyCols: WINTER_DUSK, FLOOR: F, veil: 0.12 });
    const pileL = S.layer({ par: 0.46, sh: 4 });
    PILES.forEach(([x, y]) => {
      let d = '';
      for (let i = 0; i < 9; i++) d += c.cut(c.blob(x + c.rr(-60, 60), y - c.rr(0, 30) - (i > 5 ? 20 : 0), c.rr(18, 28), c.rr(12, 18), 10, 0.18), 0.6, 5);
      pileL.add(sheet().p(d, mix(C.rock, C.stone2, 0.4)).out() + `<path d="${c.cut(c.blob(x, y - 44, 60, 8, 12, 0.3), 0.5, 6)}" fill="#fbf8f1"/>`);
    });
    const back = S.layer({ par: 0.48, sh: 4 });
    const act = S.layer({ par: 0.54, sh: 6 });
    const leads = LEAD.map(([x, y, s, b, li], i) => ({ ...cast(S, b ? back : act, [{ look: leader(li), x, y, s, face: true }], 'st' + i)[0], i, bk: b }));
    const stones = leads.map(() => act.add(`<g>${stone(c, 13, mix(C.rock2, C.rock3, 0.3))}</g>`));
    const jesus = S.puppet(act.add(person(c, JESUS)));
    const fx = S.layer({ par: 0.58, sh: 5 });
    const rings = voiceRings(fx, c, { n: 3, r: 34, w: 5, both: true, color: shade(C.halo, -0.05) });
    const threadsEl = fx.add(`<g>${WORKS.map(([, x]) => `<path d="M${x} -200V${250}" stroke="${C.halo}" stroke-width="2.4" opacity=".8"/>`).join('')}</g>`);
    const plates = WORKS.map(([ic, x], i) => ({ i, x, el: fx.add(`<g>${workPlate(c, ic, { r: 40 })}</g>`) }));
    const dim = plates.map((p) => fx.add(`<g><circle r="47" fill="${mix(C.stone2, C.storm, 0.4)}" opacity=".55"/></g>`));
    const q = hanging(fx, `<g transform="scale(1.7)">${question(c)}</g>`, { x: 800, y: 470, len: 700 });
    const blas = fx.add(`<g>${speech(c, `<g transform="translate(-34 12)"><path d="${c.cut([[-7, 0], [-8, -20], [8, -20], [7, 0]], 0.3, 3)}" fill="${C.stone2}"/><circle cx="0" cy="-26" r="7" fill="${C.skin3}"/></g><path d="${c.ribbon([[-18, -6], [10, -6]], 3)}" fill="${C.terracotta}"/><path d="${c.poly([[8, -13], [18, -6], [8, 1]])}" fill="${C.terracotta}"/><g transform="translate(34 -6)"><circle r="16" fill="url(#halo-glow)"/><path d="${c.cut(c.star(0, 0, 13, 7, 8, 0), 0.3, 3)}" fill="${C.sun}"/></g>`, { w: 120, h: 58, flip: true, fill: mix(C.stone2, C.storm, 0.25) })}</g>`);
    const snowF = W.snowFront();

    return (t, time) => {
      const T = time;
      W.sk.set(...WINTER_DUSK);
      W.update(T, { lit: 1, snow: 1 });
      snowF.update(T, 0.8);
      /* v31 — they snatch up stones */
      const bend = (i) => bump(t, 0.2 + (i % 3) * 0.08, 0.6 + (i % 3) * 0.08);
      const grab = (i) => es(t, 0.4 + (i % 3) * 0.08, 0.5 + (i % 3) * 0.08);
      const raise = es(t, 0.55, 0.85);
      /* v32a — the works hung on threads of light */
      const pk = (i) => es(t, 1.15 + i * 0.1, 1.45 + i * 0.1, ease.out);
      const off = es(t, 3.9, 4.15, ease.in);
      attr(threadsEl, 'opacity', Math.min(1, pk(0) * 1.2) * (1 - off));
      /* v32b — which one? */
      const point = es(t, 2.1, 2.3) * (1 - es(t, 2.85, 3.0));
      const which = Math.floor(es(t, 2.15, 2.85, (x) => x) * 4.99);
      const qk = es(t, 2.2, 2.5, ease.out) * (1 - es(t, 2.9, 3.05, ease.in));
      swing(q, 800, 380 - (1 - qk) * 700, qk > 0.001 ? T : 0, 1.4, 1.1);
      fade(q, qk > 0.001 ? 1 : 0);
      const PARK = S.portrait ? 800 : 500;     // phone: parked plates rest above the tall sky, not under the section tag
      /* v33a — not for a good work: the plates go dim */
      const dk = es(t, 3.2, 3.45);
      plates.forEach((p) => {
        const hot = point > 0.5 && which === p.i ? 1 : 0;
        vis(p.el, { x: p.x, y: 250 - (1 - pk(p.i)) * PARK - off * PARK, s: 1 + hot * 0.15, o: pk(p.i) > 0.001 ? 1 : 0 });
        vis(dim[p.i], { x: p.x, y: 250 - off * PARK, o: dk * (1 - off) });
      });
      /* v33b — for blasphemy */
      const bk = es(t, 4.1, 4.3, ease.back);
      vis(blas, { x: 1010, y: 430, s: bk * 1.4, o: bk > 0.01 ? 1 : 0 });
      const talk = Math.max(bump(t, 1.05, 1.95), bump(t, 2.05, 2.95));
      const PX = 800 + (which - 2) * 120;
      jesus.set({ x: 800, y: F + 4, s: 1.06, flip: point > 0.5 ? PX < 800 : false, armF: 14 + talk * 20 + point * 60, armB: 8 + bump(t, 1.1, 1.9) * 120, head: -bump(t, 1.1, 1.9) * 12 - point * 6, blink: blinkAt(T, 1) });
      rings(806, F - 176, talk * 0.9, T, { s0: 0.8, spread: 1.8 });
      leads.forEach((m) => {
        const i = m.i;
        const faceL = m.x > 800;
        const b = bend(i) * (m.bk ? 0.5 : 1);
        const g = grab(i);
        const wave = i === 0 ? bump(t, 3.1, 3.9) : 0;
        const accuse = i === 3 ? es(t, 4.05, 4.3) : 0;
        const aF = 20 + g * (40 + raise * 60) - wave * 30 + accuse * 30;
        const lean = b * 22;
        m.p.set({ x: m.x + (faceL ? 1 : -1) * b * 10, y: m.y, s: m.s, flip: faceL, lean: faceL ? -lean : lean, armF: aF, armB: 10 + wave * 120 + accuse * 20, head: b * 18 - wave * 10 * (i % 2 ? 1 : -1), blink: blinkAt(T, m.seed) });
        mood(m, { angry: 0.3 + raise * 0.4 + accuse * 0.3 });
        const [hx, hy] = hand(m.x + (faceL ? 1 : -1) * b * 10, m.y, m.s, faceL, aF, faceL ? -lean : lean);
        const onPile = g < 0.5;
        const pile = PILES[faceL ? 1 : 0];
        vis(stones[i], { x: onPile ? pile[0] + (i % 3 - 1) * 30 : hx, y: onPile ? pile[1] - 30 : hy + 6, s: m.s, o: g > 0.001 || t > 0.3 ? 1 : 0 });
      });
      // phone: drawn back a little, so the outermost leaders are not cut off at the screen edges
      S.cam.x = S.portrait ? 0 : kf(t, [[0, 0], [1, 0], [2, 0], [4, 40], [5, 40]]);
      S.cam.y = kf(t, [[0, 20], [1, 10], [1.6, -70], [3.2, -60], [4, 10], [5, 10]]);
      S.cam.z = S.portrait
        ? kf(t, [[0, 1.02], [1, 1.02], [1.6, 1.0], [3.2, 1.0], [4, 1.02], [5, 1.02]])
        : kf(t, [[0, 1.12], [1, 1.12], [1.6, 1.04], [3.2, 1.04], [4, 1.14], [5, 1.16]]);
    };
  },
};
