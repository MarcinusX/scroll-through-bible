// Mt 28,12–14 — In a room above the city, in the afternoon light, the chief priests gather with the elders coming in at
// the door; heads together, a grey knot of whispering over them. After their counsel the chest is opened and heavy bags
// of silver go into the soldiers' hands. "Say this: his disciples came by night and stole him while we slept" — a grey
// flat of the made-up story comes down: the tomb at night, the guards asleep, two dark figures creeping off with a
// bundle. "If this comes to the governor's ears": Pilate's portrait comes down, with a big ear — "we will persuade him":
// one more bag is lifted towards it — "and keep you out of trouble": the soldiers' shoulders drop, relieved.
import { C, person, blinkAt, pose, lerp, hanging, swing, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { EVE, chamber, table, soldier, priest, elder, silverBag, silver, lieFlat, medallion, L15, ear, headAt, handAt, withFace, faceBits, shakeLines, whisper, sparkle, PI } from './lib.js';

const FLOOR = 700;

export default {
  id: 'mt28-council',
  beats: [
    { v: 12, text: 'Ci zebrali się ze starszymi,' },
    { v: 12, cont: true, text: 'a po naradzie dali żołnierzom sporo pieniędzy' },
    { v: 13 },
    { v: 14 },
  ],
  cam: { x: [-60, 60], y: [-40, 40], z: [0.88, 1.08] },
  build(S) {
    const c = S.c;
    const R = chamber(S, { skyCols: EVE });
    const PL = S.layer({ par: 0.5, sh: 5 });
    /* the chief priests behind the table; the elders coming in at the door */
    const PR = [{ i: 0, x: 760 }, { i: 1, x: 660 }, { i: 3, x: 860 }].map((p) => {
      const el = PL.add(withFace(priest(c, p.i), faceBits(c)));
      return { ...p, seed: c.rr(0, 9), p: S.puppet(el), angry: el.querySelector('[data-part="angry"]') };
    });
    const EL = (S.portrait ? [{ i: 0, x: 945 }, { i: 1, x: 1015 }, { i: 2, x: 1085 }] : [{ i: 0, x: 960 }, { i: 1, x: 1050 }, { i: 2, x: 1140 }]).map(   // phone: the last elder clear of the thread
      (e) => ({ ...e, seed: c.rr(0, 9), p: S.puppet(PL.add(elder(c, e.i))) }));
    const knot = PL.add(`<g>${[0, 1, 2, 3].map((i) => `<g transform="rotate(${i * 90 + 20}) translate(14 0)">${whisper(c)}</g>`).join('')}</g>`);
    /* the table and the chest */
    const TL = S.layer({ par: 0.52, sh: 5 });
    TL.add(`<g transform="translate(800 ${FLOOR + 30})">${table(c, 420, 110)}</g>`);
    const chestLid = TL.add(`<g><path d="${c.cut([[-46, 0], [46, 0], [42, -22], [-42, -22]], 0.4, 5)}" fill="${C.wood}"/><path d="${c.ribbon([[-44, -10], [44, -10]], 3)}" fill="${C.sun}"/></g>`);
    TL.add(`<g transform="translate(800 ${FLOOR - 80})"><path d="${c.cut([[-46, 0], [46, 0], [44, -38], [-44, -38]], 0.4, 5)}" fill="${C.wood2}"/><path d="${c.ribbon([[-46, -12], [46, -12]], 3)}" fill="${C.sun}"/></g>`);
    const glint = TL.add(`<g><circle r="60" fill="url(#halo-glow)"/>${sparkle(c, 16)}</g>`);
    /* the soldiers, on the left */
    const SO = (S.portrait ? [{ i: 0, x: 520 }, { i: 1, x: 455 }] : [{ i: 0, x: 470 }, { i: 1, x: 380 }]).map(   // phone: both soldiers inside the left edge
      (s) => ({ ...s, seed: c.rr(0, 9), p: S.puppet(TL.add(soldier(c, s.i, { spear: false }))), sh: TL.add(`<g>${shakeLines(c, 24)}</g>`) }));
    const bags = [0, 1, 2].map((i) => ({ i, el: TL.add(`<g>${silverBag(c, i === 2 ? 1.1 : 0.9)}</g>`) }));
    const coins = [0, 1, 2, 3, 4].map(() => TL.add(`<g>${silver(c, 7)}</g>`));

    /* the made-up story, and the governor's ear */
    const fx = S.layer({ par: 0.56, sh: 7 });
    const lie = hanging(fx, `<g transform="translate(0 20)">${lieFlat(c)}</g>`, { x: 0, y: -1500, len: 900 });
    const gov = hanging(fx, `<g>${medallion(c, L15.pilate, { r: 42, back: mix(C.plumRobe, C.cream, 0.6) })}</g>`, { x: 0, y: -1500, len: 900 });
    const earEl = fx.add(`<g>${ear(c, C.skin)}</g>`);
    const relief = [0, 1].map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));

    return (t, time) => {
      R.stars.fade(0);
      R.crowd.fade(0);
      /* v12a: they gather with the elders */
      const enter = es(t, 0.02, 0.5, ease.out);
      const huddle = es(t, 0.45, 0.7) * (1 - es(t, 1.1, 1.3));
      PR.forEach((p, k) => {
        const give = k === 0 ? es(t, 1.1, 1.3) * (1 - es(t, 1.7, 1.9)) : 0;
        const dictate = k === 0 ? es(t, 2.05, 2.25) : 0;
        const lift = k === 0 ? es(t, 3.35, 3.55) : 0;
        p.p.set({ x: p.x + huddle * (800 - p.x) * 0.15, y: FLOOR - 6 + k * 3, s: 1.0, flip: k === 0 ? t > 1.05 : p.x > 800, armF: 20 + huddle * 30 + give * 70 + dictate * (60 + Math.sin(t * 30) * 10) + lift * 80, armB: 10 + huddle * 20 + lift * 40, head: huddle * (k === 0 ? 0 : 10) - dictate * 4, lean: huddle * 6 * (p.x > 800 ? -1 : 1), blink: blinkAt(time, p.seed) });
        fade(p.angry, huddle + dictate * 0.8);
      });
      EL.forEach((e, k) => {
        const x = lerp(1270, e.x, es(t, 0.02 + k * 0.08, 0.45 + k * 0.08, ease.out)) - huddle * 30;
        e.p.set({ x, y: FLOOR - 2 + k * 3, s: 1.0, flip: true, walk: enter < 1 ? x * 0.06 + k : undefined, amt: 0.8, armF: 18 + huddle * 30, armB: 10, head: huddle * 10, lean: -huddle * 6, blink: blinkAt(time, e.seed) });
      });
      const kn = es(t, 0.5, 0.7) * (1 - es(t, 1.05, 1.2));
      pose(knot, { x: 880, y: 420, s: kn * 1.6, r: t * 200, o: kn });

      /* v12b: the chest opens, the silver goes to the soldiers */
      const open = es(t, 1.05, 1.2);
      pose(chestLid, { x: 800, y: FLOOR - 118, r: -open * 70, ox: -46, oy: 0, o: 1 });
      const gl = bump(t, 1.1, 1.9);
      pose(glint, { x: 800, y: FLOOR - 140, s: gl, r: time * 30, o: gl });
      const hands = SO.map((s, k) => {
        const take = es(t, 1.35 + k * 0.1, 1.6 + k * 0.1);
        const relax = es(t, 3.6, 3.9);
        const a = 20 + take * 50 - relax * 20;
        s.p.set({ x: s.x, y: FLOOR + 8 + k * 4, s: 1.0, armF: a, armB: 8 + es(t, 2.2, 2.5) * (1 - relax) * 20, head: -es(t, 2.2, 2.4) * 8 * (1 - relax) + relax * 6 + (t > 2.3 && t < 3.3 ? Math.sin(t * 24) * 3 : 0), blink: blinkAt(time, s.seed) });
        pose(s.sh, { x: headAt(s.x, FLOOR + 8 + k * 4, 1, false)[0], y: headAt(s.x, FLOOR + 8 + k * 4, 1, false)[1], o: es(t, 3.05, 3.2) * (1 - relax) * 0.8 });
        return handAt(s.x, FLOOR + 8 + k * 4, 1.0, false, a);
      });
      bags.forEach((b) => {
        if (b.i < 2) {
          const u = es(t, 1.2 + b.i * 0.1, 1.55 + b.i * 0.1, ease.io);
          const [hx, hy] = hands[b.i];
          pose(b.el, { x: lerp(800 + (b.i - 0.5) * 30, hx + 4, u), y: lerp(FLOOR - 118, hy + 44, u) - Math.sin(u * PI) * 90, s: 1, o: seg(t, 1.15, 1.2) });
        } else {
          /* v14: one more bag lifted towards the governor */
          const up = es(t, 3.35, 3.55);
          const [px, py] = handAt(PR[0].x, FLOOR - 6, 1.0, true, 20 + up * 80);
          pose(b.el, { x: px, y: py + 36, s: 1, o: up > 0.01 ? 1 : 0 });
        }
      });
      coins.forEach((el, i) => {
        const u = ((t * 1.1 + i / 5) % 1);
        const on = bump(t, 1.2, 1.95);
        const [hx, hy] = hands[i % 2];
        pose(el, { x: lerp(800, hx, u) + (i - 2) * 6, y: lerp(FLOOR - 130, hy + 30, u) - Math.sin(u * PI) * 110, r: u * 360, o: on * (1 - u * 0.3) });
      });

      /* v13: "say this…" — the grey story comes down */
      const lk = es(t, 2.05, 2.45, ease.back) * (1 - es(t, 3.05, 3.3, ease.in));
      swing(lie, 800, lerp(-1000, 190, lk), time, 1, 0.6, 3);

      /* v14: the governor's ear; persuaded; relieved */
      const gk = es(t, 3.05, 3.35, ease.back);
      swing(gov, 1000, lerp(-1000, 270, gk), time, 1, 0.7, 1);
      const ek = es(t, 3.2, 3.4, ease.back);
      pose(earEl, { x: 1068, y: 270, s: ek * 0.9, r: 8, o: ek > 0.01 ? 1 : 0 });
      relief.forEach((el, i) => { const b = bump(t, 3.65 + i * 0.1, 4.0); const [hx, hy] = headAt(SO[i].x, FLOOR + 8 + i * 4, 1, false); pose(el, { x: hx + 24, y: hy - 30, s: b, r: time * 30, o: b }); });

      S.cam.x = -es(t, 1.05, 1.4) * 40 * (1 - es(t, 2.0, 2.3)) + es(t, 3.05, 3.4) * 30;
      S.cam.y = 20 - es(t, 2.0, 2.3) * 40;
      S.cam.z = S.portrait ? 0.9 : 1.02;
    };
  },
};
