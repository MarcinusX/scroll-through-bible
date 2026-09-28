// Mt 2,4–5 — Herod summons all the chief priests and the scribes of the people. They come in from both sides with
// their scrolls. "Where is the Messiah to be born?" The oldest scribe unrolls the prophet's scroll and reads:
// "In Bethlehem of Judea."
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, attr } from '../../core/anim.js';
import {
  HALL, HY, palaceSet, herodPuppet, priest, scribe, scrollOpen, scrollRolled, say, placeTag, hangAt, vpose, kf, moving,
  bigStar, sparkle, tr, PI,
} from './lib.js';

const PRI = [[360, 0], [440, 1], [520, 2]];
const SCR = [[1000, 1], [1080, 2], [1160, 3]];
const RX = 590;             // where the reading scribe stands

export default {
  id: 'mt2-scribes',
  beats: [
    { v: 4, text: 'Zebrał więc wszystkich arcykapłanów i uczonych ludu' },
    { v: 4, cont: true, text: 'i wypytywał ich, gdzie ma się narodzić Mesjasz.' },
    { v: 5 },
  ],
  cam: { x: [-60, 60], y: [0, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const set = palaceSet(S, { skyCols: HALL });

    const act = S.layer({ par: 0.55, sh: 5 });
    const scroll = (i) => `<g transform="translate(0 4) rotate(${-60 + i * 8})">${scrollRolled(c, 40)}</g>`;
    const pri = PRI.map(([x, i], k) => ({ x, i, k, p: S.puppet(act.add(priest(c, i, { holdF: k === 1 ? scroll(k) : '' }))), seed: c.rr(0, 6) }));
    const scr = SCR.map(([x, i], k) => ({ x, i, k, p: S.puppet(act.add(scribe(c, i, { holdF: k !== 0 ? scroll(k) : '' }))), seed: c.rr(0, 6) }));
    const reader = S.puppet(act.add(scribe(c, 0, { hair: '#e8e2d6', beardColor: '#eee8dc' })));
    const hSit = S.puppet(act.add(herodPuppet(c, { pose: 'sit' })));

    const fx = S.layer({ par: 0.58, sh: 5 });
    const ask = fx.add(`<g>${say(c, tr(['Gdzie ma się', 'narodzić Mesjasz?'], ['Where will', 'the Christ be born?']), { size: 21, side: -1 })}</g>`);
    const bigScroll = fx.add(`<g>${scrollOpen(c, 170, 110)}</g>`);
    const glow = fx.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    const place = hanging(fx, placeTag(c, tr('W Betlejem judzkim', 'In Bethlehem of Judea'), 22), { x: 0, y: 0, len: 600 });
    const prophet = hanging(fx, placeTag(c, tr('tak napisał Prorok', 'thus wrote the prophet'), 17), { x: 0, y: 0, len: 600 });
    const star = fx.add(`<g>${bigStar(c, 12)}</g>`);
    const glints = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 9)}</g>`));

    return (t, time) => {
      const T = time;
      set.update(T);

      /* v4a — the chief priests and the scribes come in from both sides */
      const come = (k) => es(t, 0.05 + k * 0.12, 0.6 + k * 0.12, ease.out);
      pri.forEach((m) => {
        const kk = come(m.k), x = lerp(m.x - 700, m.x, kk);
        const talk = m.k === 2 ? bump(t, 2.1, 2.6) : 0;
        m.p.set({ x, y: HY + 26 + (m.k % 2) * 8, s: 0.9, walk: kk > 0 && kk < 1 ? x * 0.06 + m.k : undefined, armF: 30 + talk * 50, armB: 10, head: -es(t, 1.2, 1.4) * 6, blink: blinkAt(T, m.seed) });
      });
      scr.forEach((m) => {
        const kk = come(m.k), x = lerp(m.x + 700, m.x, kk);
        m.p.set({ x, y: HY + 26 + (m.k % 2) * 8, s: 0.9, flip: true, walk: kk > 0 && kk < 1 ? x * 0.06 + m.k : undefined, armF: 30, armB: 10, head: -es(t, 1.2, 1.4) * 6 + bump(t, 2.2, 2.9) * 8, blink: blinkAt(T, m.seed) });
      });
      /* v5 — the eldest scribe steps up, unrolls the scroll and reads */
      const RK = [[0.3, RX + 800], [0.9, RX + 330], [2.0, RX + 330], [2.35, RX]];
      const rx = kf(t, RK, ease.io);
      const read = es(t, 2.35, 2.6);
      reader.set({ x: rx, y: HY + 30, s: 0.92, flip: read < 0.5, walk: moving(t, RK) ? rx * 0.06 : undefined, armF: 20 + read * 70, armB: 10 + read * 70, head: 6 * read, blink: blinkAt(T, 4) });
      vpose(bigScroll, { x: rx + 70, y: HY - 150, s: (0.4 + read * 0.6) * 0.72, r: 4 * read, o: read > 0.01 ? 1 : 0 });
      vpose(glow, { x: rx + 70, y: HY - 150, s: 0.6 + es(t, 2.55, 2.8) * 0.6, o: es(t, 2.55, 2.8) * 0.8 });

      /* v4b — Herod asks where the Messiah is to be born */
      const askK = es(t, 1.1, 1.25, ease.back) * (1 - es(t, 2.0, 2.1));
      vpose(ask, { x: 760, y: HY - 200, s: askK, o: askK > 0.01 ? 1 : 0 });
      const lean = bump(t, 1.05, 2.0);
      const listen = es(t, 2.3, 2.6);
      hSit.set({ x: 808, y: HY - 38, s: 1.08, armF: 20 + lean * 70, armB: 10 + lean * 30, head: -lean * 6 + listen * 10, lean: lean * 6 - listen * 4, blink: blinkAt(T, 1) });
      const sk = es(t, 1.2, 1.4, ease.back) * (1 - es(t, 2.0, 2.1));
      vpose(star, { x: 640, y: HY - 250, s: sk, r: T * 20, o: sk > 0.01 ? 1 : 0 });

      const pk = es(t, 2.55, 2.85, ease.out);
      hangAt(place, 800, lerp(-500, 250, pk), T, pk > 0.001 ? 1 : 0, 1.3, 0.9, 1);
      const qk = es(t, 2.75, 3.0, ease.out);
      hangAt(prophet, 560, lerp(-500, 330, qk), T, qk > 0.001 ? 1 : 0, 1.3, 0.9, 3);
      glints.forEach((g, i) => {
        const k = es(t, 2.6 + i * 0.05, 2.8 + i * 0.05), a = T * 0.8 + i * 2.1;
        vpose(g, { x: rx + 70 + Math.cos(a) * 100, y: HY - 150 + Math.sin(a) * 60, s: k * 0.8, r: T * 30, o: k });
      });

      S.cam.z = 1.02 + es(t, 0.9, 1.3) * 0.08 - es(t, 1.9, 2.3) * 0.02;
      S.cam.y = 40 - es(t, 0.9, 1.3) * 10;
      S.cam.x = lerp(0, -30, es(t, 2.1, 2.5));
    };
  },
};
