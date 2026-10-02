// Mt 24,45–47 — the parable, on Mark 13's house in a golden afternoon. "Who then is the faithful and wise servant,
// whom his lord has set over his household, to give them their food in due season?": the master puts the key of the
// house in his steward's hand and sets off down the road; the steward takes loaves from the basket and gives one into
// every servant's bowl. "Blessed is that servant whom his lord finds doing so when he comes": the master is back at
// the gate and sees him at it — a warm light round the steward. "He will set him over all that he has": the master
// gives him the great keys and a mantle, and all his goods — the money chest, the flock, the field, the house — hang
// round them on their strings.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { houseSet, HOUSE, MASTER, SERVANTS, keyProp, bowl, loaf, along, hand, coinChest, beast, roundel, STEWARD, AFTERNOON, PI } from './lib.js';

const F = HOUSE.FLOOR;
const QUEUE_W = [470, 548, 626, 704];
const QUEUE_P = [505, 578, 651, 724];   // phone: the first in the queue is not sliced by the frame
const BASKET = [880, F];

export default {
  id: 'mt24-servant',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 45 },
    { v: 46 },
    { v: 47 },
  ],
  cam: { x: [-30, 60], y: [-50, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const QUEUE = S.portrait ? QUEUE_P : QUEUE_W;
    sky(S, AFTERNOON);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1260, y: -1500, len: 700 });
    const cl = hanging(hangL, cloud(c, 170), { x: 620, y: -1500, len: 700 });
    const H = houseSet(S);

    const P = S.layer({ par: 0.45, sh: 5 });
    const basket = P.add(`<g transform="translate(${BASKET[0]} ${BASKET[1]})">${sheet().p(c.cut([[-34, 0], [-40, -40], [40, -40], [34, 0]], 0.5, 6), C.basket).p(c.cut(c.blob(-14, -46, 16, 9, 10, 0.1), 0.3, 3) + c.cut(c.blob(12, -48, 16, 9, 10, 0.1), 0.3, 3) + c.cut(c.blob(0, -54, 14, 8, 10, 0.1), 0.3, 3), C.wheat2).out()}</g>`);
    const serv = SERVANTS.map((o, i) => ({ i, x: QUEUE[i], seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...o, holdF: `<g transform="translate(0 -2)">${bowl(c, { w: 28, food: null })}</g>` }))) }));
    const loaves = serv.map(() => P.add(`<g transform="translate(0 -1500)">${loaf(c, 11)}</g>`));
    const steward = S.puppet(P.add(person(c, { ...STEWARD, holdF: `<g transform="translate(0 2)">${loaf(c, 11)}</g>` })));
    const steward2 = S.puppet(P.add(person(c, { ...STEWARD, mantle: C.sun, mantleArm: true, holdF: `<g transform="translate(0 2) rotate(70)">${keyProp(c, C.ochre)}</g>` })));
    const master = S.puppet(P.add(person(c, { ...MASTER, holdB: `<path d="M-2 30L2 30L3 -120L-1 -120Z" fill="${C.wood2}"/>` })));
    const key = P.add(`<g transform="translate(0 -1500)">${keyProp(c)}</g>`);
    const glow = P.add(`<g transform="translate(0 -1500)"><circle r="170" fill="url(#warm-glow)"/></g>`);

    /* all that he has, on strings */
    const goodsL = S.layer({ par: 0.2, sh: 6 });
    const flock = `<g transform="translate(-22 16)">${beast(c, 'sheep')}</g><g transform="translate(14 22)">${beast(c, 'sheep', C.cream)}</g>`;
    const field = `<g transform="translate(0 6)">${sheet().p(c.cut(c.rect(-34, -8, 68, 26), 0.4, 5), C.wheat2).x(c.ribbon([[-30, -2], [30, -2]], 1.4) + c.ribbon([[-30, 6], [30, 6]], 1.4) + c.ribbon([[-30, 13], [30, 13]], 1.4), shade(C.wheat2, -0.2), 'opacity=".7"').out()}</g>`;
    const home = `<g transform="translate(0 18)">${sheet().p(c.cut(c.rect(-26, -30, 52, 30), 0.3, 5), C.plaster).p(c.cut([[-32, -28], [32, -28], [32, -36], [-32, -36]], 0.3, 5), C.roof).p(c.cut(c.rect(-8, -18, 12, 18), 0.2, 4), C.wood2).out()}</g>`;
    const GOODS = [`<g transform="translate(0 22) scale(.7)">${coinChest(c)}</g>`, flock, field, home].map((ic, i) => ({ i, x: 560 + i * 160, el: goodsL.add(`<g transform="translate(0 -1500)"><path d="M0 -1500V-50" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${roundel(c, 46, { face: C.parchment })}${ic}</g>`) }));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1260, 180, T, 1, 0.6);
      swing(cl, 620 + (T ? Math.sin(T * 0.1) * 20 : 0), 150, T, 1.2, 0.7, 1);
      pose(H.gateDoor, { x: HOUSE.GATE - 36, y: F + 38, sx: 0.2 });
      pose(H.ovenEl.querySelector('.glow'), { x: 0, y: 0, o: 0.4 });

      /* v45 — the key given; the master leaves; the steward gives out the bread */
      const give = es(t, 0.05, 0.3);
      const away = seg(t, 0.35, 1.1);
      const back = seg(t, 1.05, 1.45);
      let mx = 960, my = F, ms = 1, walking = false, flip = true;
      if (away > 0 && back <= 0) { const k = Math.min(1, away * 1.25); if (k < 0.3) { mx = lerp(960, 1052, k / 0.3); } else { const [rx, ry] = along(HOUSE.ROAD, (k - 0.3) / 0.7 * 0.4); mx = rx; my = ry; ms = 1 - (k - 0.3) / 0.7 * 0.2; } walking = away < 1; flip = false; }
      if (back > 0) { const k = back; if (k < 0.7) { const [rx, ry] = along(HOUSE.ROAD, (1 - k / 0.7) * 0.4); mx = rx; my = ry; ms = 1 - (1 - k / 0.7) * 0.2; } else { mx = lerp(1052, 1010, (k - 0.7) / 0.3); } walking = back < 1; flip = true; }
      const bless = es(t, 1.5, 1.7) * (1 - es(t, 2.0, 2.1));
      const grant = es(t, 2.05, 2.3);
      master.set({ x: mx, y: my, s: ms, flip, o: 1, walk: walking ? mx * 0.08 : undefined, amt: 1.2, armB: 30, armF: give * 60 * (1 - away) + bless * 100 + grant * 80, head: -2 + bless * 4, blink: blinkAt(T, 3) });
      const [kx, ky] = hand(960, F, 1, true, 60);
      pose(key, { x: lerp(kx, 900, es(t, 0.2, 0.3)), y: ky, r: 80, o: give * (1 - es(t, 0.3, 0.35)) });

      /* the steward goes to and fro between the basket and the bowls */
      const SLOT = (i, base) => base + i * 0.13;
      const cycle = (t0) => { let who = -1, u = 0; for (let i = 0; i < 4; i++) { const a = SLOT(i, t0); if (t >= a && t < a + 0.13) { who = i; u = (t - a) / 0.13; } } return [who, u]; };
      let [who, u] = t < 1 ? cycle(0.38) : cycle(1.1);
      const target = who >= 0 ? QUEUE[who] + 64 : 820;
      const sx = who >= 0 ? lerp(840, target, Math.sin(u * PI)) : 820;
      const sw = steward2.el && es(t, 2.25, 2.32);
      steward.set({ x: sx, y: F + 2, s: 0.96, flip: true, o: 1 - sw, walk: who >= 0 ? sx * 0.08 : undefined, armF: who >= 0 ? 30 + Math.sin(u * PI) * 50 : 20, head: 6, blink: blinkAt(T, 5) });
      steward2.set({ x: 860, y: F + 2, s: 0.98, flip: false, o: sw, armF: 60, head: -4, blink: blinkAt(T, 5) });
      serv.forEach((m) => {
        const got = (t >= SLOT(m.i, 0.38) + 0.07) || (t >= SLOT(m.i, 1.1) + 0.07) ? 1 : 0;
        m.p.set({ x: m.x, y: F + (m.i % 2) * 4, s: 0.9, flip: false, armF: 50 + (got ? 0 : 10), head: got ? -4 : 4, blink: blinkAt(T, m.seed) });
        const [bx, by] = hand(m.x, F + (m.i % 2) * 4, 0.9, false, 50);
        pose(loaves[m.i], { x: bx, y: by - 12, s: 0.9, o: t >= SLOT(m.i, 0.38) + 0.07 ? 1 : 0 });
      });
      pose(glow, { x: sx, y: F - 110, o: es(t, 1.5, 1.75) * 0.9 * (1 - es(t, 2.9, 3)) });

      /* v47 — all his goods */
      GOODS.forEach((g) => {
        const k = es(t, 2.1 + g.i * 0.08, 2.4 + g.i * 0.08, ease.back);
        pose(g.el, { x: g.x, y: lerp(-300, 200 + (g.i % 2) * 24, k), r: T ? Math.sin(T * 1.1 + g.i) * 3 * k : 0, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = es(t, 1.0, 1.4) * 40 * (1 - es(t, 1.8, 2.1));
      S.cam.y = -es(t, 2.0, 2.4) * 30;
      S.cam.z = 1.02 + es(t, 1.0, 1.4) * 0.04 * (1 - es(t, 1.8, 2.1));
    };
  },
};
