// Łk 12,42–44 — the parable, on the master's house in the golden afternoon. "Who then is the faithful and wise steward,
// whom his lord will set over his household, to give them their portion of food at the right times?": the master puts
// the key of the house into his steward's hand and sets off down the road; the sun climbs to noon, the servants line up
// with their bowls, and the steward gives each one a loaf and ladles out his portion. "Blessed is that servant whom his
// lord will find doing so when he comes": the master is back in the gate and sees him at it — a warm light round the
// steward. "He will set him over all that he has": the master hangs the great ring of keys on him and lays a gold
// mantle on his shoulders, and all he has comes down round them on strings — the money chest, the flock, the field,
// the house.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { beast } from '../matthew24/lib.js';
import { behindOf, houseSet, HOUSE, MASTER, SERVANTS, STEWARD, keyProp, bowl, loaf, coinChest, roundel, hand, headAt, alongPts, warm, PI } from './lib.js';

const F = HOUSE.FLOOR;
const QUEUE = [470, 548, 626];
const BASKET = [860, F];
const ROAD = [[1060, 694], [1150, 684], [1250, 656], [1360, 614], [1460, 574]];

export default {
  id: 'lk12-steward',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 42 },
    { v: 43 },
    { v: 44 },
  ],
  cam: { x: [-30, 80], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#d2e0d6', '#f2e3c2', '#f8e8c8']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1260, y: 260, len: 700 });
    const cl = hanging(hangL, cloud(c, 170), { x: 620, y: 150, len: 700 });
    const H = houseSet(S);
    const P = S.layer({ par: 0.45, sh: 5 });
    const glowL = behindOf(S.layer({ par: 0.45, sh: 0, flat: true }), P);
    const glow = glowL.add(`<g opacity="0">${warm(180, 1)}</g>`);
    P.add(`<g transform="translate(${BASKET[0]} ${BASKET[1]})">${sheet().p(c.cut([[-34, 0], [-40, -40], [40, -40], [34, 0]], 0.5, 6), C.basket).p(c.cut(c.blob(-14, -46, 16, 9, 10, 0.1), 0.3, 3) + c.cut(c.blob(12, -48, 16, 9, 10, 0.1), 0.3, 3) + c.cut(c.blob(0, -54, 14, 8, 10, 0.1), 0.3, 3), C.wheat2).out()}</g>`);
    const serv = SERVANTS.slice(0, 3).map((o, i) => ({ i, x: QUEUE[i], seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...o, holdF: `<g transform="translate(0 -2)">${bowl(c, { w: 28, food: null })}</g>` }))) }));
    const loaves = serv.map(() => P.add(`<g opacity="0">${loaf(c, 11)}</g>`));
    const steward = S.puppet(P.add(person(c, STEWARD)));
    const steward2 = S.puppet(P.add(person(c, { ...STEWARD, mantle: C.sun, mantleArm: true })));
    const master = S.puppet(P.add(person(c, { ...MASTER, holdB: `<path d="M-2 30L2 30L3 -120L-1 -120Z" fill="${C.wood2}"/>` })));
    const key = P.add(`<g>${keyProp(c)}</g>`);
    const keyRing = P.add(`<g opacity="0">${[0, 1, 2].map((i) => `<g transform="rotate(${-30 + i * 30}) translate(0 10) scale(.6)">${keyProp(c, i === 1 ? C.sun : C.ochre)}</g>`).join('')}</g>`);
    /* all that he has */
    const goodsL = S.layer({ par: 0.2, sh: 6 });
    const flock = `<g transform="translate(-22 16)">${beast(c, 'sheep')}</g><g transform="translate(14 22)">${beast(c, 'sheep', C.cream)}</g>`;
    const field = `<g transform="translate(0 6)">${sheet().p(c.cut(c.rect(-34, -8, 68, 26), 0.4, 5), C.wheat2).x(c.ribbon([[-30, -2], [30, -2]], 1.4) + c.ribbon([[-30, 6], [30, 6]], 1.4) + c.ribbon([[-30, 13], [30, 13]], 1.4), shade(C.wheat2, -0.2), 'opacity=".7"').out()}</g>`;
    const home = `<g transform="translate(0 18)">${sheet().p(c.cut(c.rect(-26, -30, 52, 30), 0.3, 5), C.plaster).p(c.cut([[-32, -28], [32, -28], [32, -36], [-32, -36]], 0.3, 5), C.roof).p(c.cut(c.rect(-8, -18, 12, 18), 0.2, 4), C.wood2).out()}</g>`;
    const GOODS = [`<g transform="translate(0 22) scale(.7)">${coinChest(c)}</g>`, flock, field, home].map((ic, i) => ({ i, x: 560 + i * 160, el: goodsL.add(`<g transform="translate(0 -1500)"><path d="M0 -1500V-50" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${roundel(c, 46, { face: C.parchment })}${ic}</g>`) }));

    return (t, time) => {
      const T = time;
      /* the sun climbs to noon: the right time */
      const noon = es(t, 0.3, 0.6);
      swing(sunEl, lerp(1260, 900, noon), lerp(260, 130, noon), T, 1, 0.6);
      swing(cl, 560 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.7, 1);
      pose(H.ovenEl.querySelector('.glow'), { x: 0, y: 0, o: 0.4 });
      /* v42 — set over the household; the portion at the right time */
      const give = es(t, 0.05, 0.22);
      const leave = es(t, 0.25, 0.6);
      const back = es(t, 1.02, 1.35);
      const mx = back > 0 ? lerp(1460, 1080, back) : lerp(760, 1460, leave);
      const my = back > 0 ? alongPts(ROAD.slice().reverse(), back)[1] : leave > 0 ? alongPts([[760, F], ...ROAD], leave)[1] : F;
      const ms = back > 0 ? lerp(0.6, 0.98, back) : lerp(0.98, 0.6, leave);
      const invest = es(t, 2.1, 2.35);
      const mX = invest > 0 ? lerp(1080, 870, invest) : mx;
      master.set({ x: mX, y: invest > 0 ? F + 4 : my + 4, s: invest > 0 ? 0.98 : ms, flip: (leave <= 0 && t < 0.3) || back > 0, walk: (leave > 0 && leave < 1) || (back > 0 && back < 1) || (invest > 0 && invest < 1) ? mX * 0.05 : undefined, o: back > 0 || leave < 0.98 ? 1 : 0, armF: 20 + give * 60 * (1 - leave) + bump(t, 1.4, 1.9) * 60 + es(t, 2.35, 2.55) * 70, armB: 10 + es(t, 2.35, 2.55) * 60, head: bump(t, 1.4, 1.9) * -6, blink: blinkAt(T, 1) });
      const SX = 790;
      const dealing = seg(t, 0.55, 1.95);
      const reach = Math.abs(Math.sin(dealing * PI * 3)) * (dealing > 0 && dealing < 1 ? 1 : 0);
      const mantle = es(t, 2.5, 2.6);
      const sSet = { x: SX, y: F + 2, s: 0.96, flip: true, armF: 30 + reach * 50 + give * 30 * (1 - leave), armB: 10 + reach * 30, head: 6, blink: blinkAt(T, 2) };
      steward.set({ ...sSet, o: 1 - mantle });
      steward2.set({ ...sSet, flip: t > 2.3 ? false : true, o: mantle, armF: 30, head: -4 });
      const [shx, shy] = hand(SX, F + 2, 0.96, true, 30 + give * 30);
      const [mhx, mhy] = hand(760, F + 4, 0.98, true, 20 + give * 60);
      pose(key, { x: lerp(mhx, shx, give), y: lerp(mhy, shy, give) - 4, r: -40, s: 0.8, o: t < 0.55 ? 1 : 0 });
      serv.forEach((s) => {
        const at = 0.62 + s.i * 0.42;
        const k = es(t, at, at + 0.2);
        const bx = s.x + (s.i === 0 ? 0 : 0);
        s.p.set({ x: bx, y: F + 4 + (s.i % 2) * 4, s: 0.92, armF: 50 + bump(t, at - 0.1, at + 0.3) * 20, armB: 10, head: 4, blink: blinkAt(T, s.seed) });
        const [bhx, bhy] = hand(bx, F + 4 + (s.i % 2) * 4, 0.92, false, 50);
        pose(loaves[s.i], { x: lerp(BASKET[0] - 10, bhx, k), y: lerp(BASKET[1] - 52, bhy - 10, k) - Math.sin(k * PI) * 40, o: k > 0 ? 1 : 0 });
      });
      /* v43 — found doing so */
      pose(glow, { x: SX, y: F - 110, o: es(t, 1.4, 1.7) * (1 - es(t, 2.4, 2.6) * 0.3) });
      /* v44 — over all that he has */
      const [ksx, ksy] = headAt(SX, F + 2, 0.96, false);
      const kr = es(t, 2.35, 2.5);
      pose(keyRing, { x: lerp(900, ksx + 2, kr), y: lerp(F - 100, ksy + 64, kr), o: kr > 0 ? 1 : 0 });
      GOODS.forEach((g) => {
        const k = es(t, 2.38 + g.i * 0.06, 2.62 + g.i * 0.06, ease.out);
        pose(g.el, { x: g.x, y: lerp(-1500, 330 - (g.i % 2) * 34, k), r: time ? Math.sin(T * 0.8 + g.i) * 1.5 : 0, oy: 0 });
      });

      S.cam.x = lerp(0, 60, es(t, 0.3, 0.6)) - es(t, 0.6, 0.9) * 60 + es(t, 1.0, 1.3) * 40 - es(t, 2.0, 2.3) * 40;
      S.cam.y = 10 - es(t, 2.3, 2.6) * 60;
      S.cam.z = 1.06 - es(t, 2.3, 2.6) * 0.04;
    };
  },
};
