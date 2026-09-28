// Mt 3,13–15 — a map comes down and a pin travels from Nazareth in Galilee down the Jordan, while Jesus
// walks along the bank to John. John wades to meet Him with both hands up to stop Him, then kneels in
// the water and holds his shell up to Jesus: "I need to be baptised by You." Jesus reaches out to him;
// a golden balance comes down and settles level — all righteousness fulfilled. John rises, steps aside
// with a bow, and Jesus goes down into the river.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { JOHN_B, hand, headAt, jordanSet, shell, landMap, LAND, pin, question, strip, folk, group, sparkle, DAY, tr } from './lib.js';
import { balance } from '../mark8/lib.js';

const PI = Math.PI;
const WADE = 702, BANK = 776;
const MX = 1020, MY = 250, MS = 0.44;        // the map
const BAL = [800, 250];                      // the balance's pivot

export default {
  id: 'mt3-comes',
  beats: [
    { v: 13 },
    { v: 14, text: 'Lecz Jan powstrzymywał Go, mówiąc:' },
    { v: 14, cont: true, text: '«To ja potrzebuję chrztu od Ciebie, a Ty przychodzisz do mnie?»' },
    { v: 15, text: 'Jezus mu odpowiedział: «Pozwól teraz, bo tak godzi się nam wypełnić wszystko, co sprawiedliwe».' },
    { v: 15, cont: true, text: 'Wtedy Mu ustąpił.' },
  ],
  cam: { x: [-40, 40], y: [0, 90], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const J = jordanSet(S, { skyCols: DAY, sunAt: [1240, 150], city: false, path: false });
    const { far, fbFn } = J;
    [[260, 3], [480, 2], [1150, 3], [1360, 2]].forEach(([x, n], i) => {
      const mem = Array.from({ length: n }, (_, k) => ({ x: (k - (n - 1) / 2) * 30 + c.rr(-5, 5), y: c.rr(-4, 4), s: 1, flip: x > 800, o: folk(c) }));
      far.add(`<g transform="translate(${x} ${fbFn(x) + 8}) scale(.4)">${group(c, mem)}</g>`);
    });

    /* in the river: John, standing and kneeling */
    const R = J.riverLayer();
    const shellM = (k) => `<g data-k="${k}" transform="rotate(-20)">${shell(c, 15)}</g>`;
    const john = S.puppet(R.add(person(c, { ...JOHN_B, holdF: shellM('cs1') })));
    const johnK = S.puppet(R.add(person(c, { ...JOHN_B, pose: 'kneel', holdF: `<g transform="translate(2 0) rotate(160)">${shell(c, 16)}</g>` })));
    const jesusW = S.puppet(R.add(person(c, { ...CAST.jesus })));
    J.waterFront(R);
    const ripple = R.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 60, 12, 0, PI * 2, 30), 3)}" fill="${C.foam}"/></g>`);
    const qEl = R.add(`<g opacity="0">${question(c)}</g>`);

    /* the near bank: Jesus arrives */
    const { N } = J.nearBank();
    [[-1, 250, 3], [1, 1350, 3]].forEach(([side, x, n]) => {
      const mem = Array.from({ length: n }, (_, k) => ({ x: (k - (n - 1) / 2) * 44 + c.rr(-6, 6), y: c.rr(-6, 6), s: 1, flip: side > 0, o: folk(c) }));
      N.add(`<g transform="translate(${x} ${BANK + 4}) scale(.8)">${group(c, mem)}</g>`);
    });
    const jesusB = S.puppet(N.add(person(c, { ...CAST.jesus })));
    J.foreground();

    /* the map with its travelling pin */
    const fly = S.layer({ par: 0.2, sh: 6 });
    const mapEl = fly.add(`<g><path d="M-150 -1600V-${(LAND.h / 2) * MS}M150 -1600V-${(LAND.h / 2) * MS}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g transform="scale(${MS})">${landMap(c)}</g></g>`);
    const ROUTE = [LAND.naz, [-40, -110], [30, -100], [48, -40], [44, 30], [66, 80], LAND.beth];
    const route = fly.add(`<g><path d="${c.line(ROUTE.map(([x, y]) => [x * MS, y * MS]))}" stroke="${C.terracotta}" stroke-width="2.4" stroke-dasharray="5 5" fill="none"/></g>`);
    const pinEl = fly.add(`<g>${pin(c)}</g>`);
    const segL = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]));
    const tot = segL.reduce((a, b) => a + b, 0);
    const at = (u) => { let d = u * tot; for (let i = 0; i < segL.length; i++) { if (d <= segL[i] || i === segL.length - 1) { const k = Math.min(1, d / segL[i]); return [lerp(ROUTE[i][0], ROUTE[i + 1][0], k), lerp(ROUTE[i][1], ROUTE[i + 1][1], k)]; } d -= segL[i]; } return ROUTE[ROUTE.length - 1]; };

    /* the golden balance of righteousness */
    const B = balance(c, { arm: 130, h: 200, drop: 76 });
    const balL = S.layer({ par: 0.2, sh: 6 });
    const bGlow = balL.add(`<circle r="210" fill="url(#halo-glow)" opacity="0"/>`);
    const bString = balL.add(`<g><path d="M0 -1600V-8" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g transform="translate(0 -40)">${strip(c, tr('wszystko, co sprawiedliwe', 'all righteousness'), { size: 17 })}</g></g>`);
    const beam = balL.add(`<g>${B.beam}</g>`);
    const pans = [-1, 1].map((sd) => balL.add(`<g>${B.pan}</g>`));
    const sparks = [0, 1, 2, 3].map(() => balL.add(`<g opacity="0">${sparkle(c, 12, C.halo)}</g>`));

    return (t, time) => {
      J.update(t, time);

      /* v13 — from Galilee to the Jordan */
      const mk = es(t, 0.02, 0.3, ease.out), mUp = es(t, 1.0, 1.2, ease.in);
      const my = lerp(-420, MY, mk) - mUp * 800;
      pose(mapEl, { x: MX, y: my, o: mk > 0.01 && mUp < 1 ? 1 : 0 });
      const u = es(t, 0.25, 0.9);
      const [px, py] = at(u);
      pose(route, { x: MX, y: my, o: mk > 0.99 && mUp < 1 ? 1 : 0 });
      pose(pinEl, { x: MX + px * MS, y: my + py * MS, s: 0.9, o: mk > 0.99 && mUp < 1 ? 1 : 0 });

      const walk = seg(t, 0.05, 0.9);
      const toWater = es(t, 1.05, 1.3);
      const jx = lerp(260, 720, ease.sine(walk)) + toWater * 20;
      const intoRiver = es(t, 4.35, 4.42);
      const stepK = es(t, 4.4, 4.8);
      jesusB.set({
        x: jx + es(t, 4.2, 4.38) * 30, y: BANK - es(t, 4.2, 4.38) * 20, s: 1.05, flip: false, o: 1 - intoRiver,
        walk: (walk > 0 && walk < 1) || (toWater > 0 && toWater < 1) || (t > 4.2 && t < 4.38) ? jx * 0.05 : undefined,
        armF: 12 + es(t, 3.05, 3.3) * 60 * (1 - es(t, 4.0, 4.2)), armB: 10 + bump(t, 3.3, 3.9) * 20,
        head: 4 * bump(t, 2.1, 2.9) + bump(t, 3.3, 3.8) * 8, blink: blinkAt(time),
      });
      const rx = lerp(780, 800, stepK);
      jesusW.set({ x: rx, y: WADE, s: 1.05, o: intoRiver, walk: stepK > 0 && stepK < 1 ? rx * 0.05 : undefined, armF: 14, head: 6, blink: blinkAt(time, 3) });
      pose(ripple, { x: 790, y: 656, s: 0.6 + stepK * 1.2, o: bump(t, 4.35, 4.95) * 0.8 });

      /* v14a — John goes to stop Him; v14b — kneels and holds up his shell */
      const see = es(t, 0.55, 0.7);
      const wade = es(t, 1.02, 1.35);
      const kneel = es(t, 2.05, 2.1) * (1 - es(t, 3.4, 3.46));
      const aside = es(t, 4.05, 4.35);
      const jnx = lerp(lerp(960, 850, wade), 990, aside);
      const stop = es(t, 1.25, 1.45) * (1 - es(t, 1.95, 2.05));
      const bow = bump(t, 4.3, 4.9);
      john.set({
        x: jnx, y: WADE, s: 1.05, flip: see > 0.5, o: 1 - kneel,
        walk: (wade > 0 && wade < 1) || (aside > 0 && aside < 1) ? jnx * 0.05 : undefined,
        armF: 30 - see * 10 + stop * 70 + aside * 50, armB: 10 + stop * 100 + bump(t, 3.45, 3.9) * 20,
        head: stop * Math.sin(seg(t, 1.45, 1.95) * PI * 4) * 5 + bow * 16, lean: bow * 10, blink: blinkAt(time, 2),
      });
      fade(S.$('cs1'), 1 - es(t, 3.95, 4.05));
      johnK.set({ x: 850, y: WADE + 6, s: 1.05, flip: true, o: kneel, armF: 60 + es(t, 2.12, 2.35) * 55, armB: 30, head: 14 - es(t, 2.12, 2.35) * 6, lean: 4, blink: blinkAt(time, 2) });
      const [qx, qy] = headAt(850, WADE + 6 + 46, 1.05, true);
      pose(qEl, { x: qx - 12, y: qy - 70, s: es(t, 2.25, 2.4, ease.back), o: seg(t, 2.25, 2.3) * (1 - seg(t, 3.0, 3.1)) });

      /* v15a — the balance comes down and settles level */
      const bk = es(t, 3.05, 3.4, ease.out), bUp = es(t, 4.1, 4.4, ease.in);
      const by = lerp(-400, BAL[1], bk) - bUp * 700;
      const tilt = (1 - es(t, 3.35, 3.75, ease.back)) * 16;
      pose(bString, { x: BAL[0], y: by });
      pose(beam, { x: BAL[0], y: by, r: tilt });
      pans.forEach((p, i) => {
        const sd = i ? 1 : -1, a = (tilt * PI) / 180;
        pose(p, { x: BAL[0] + sd * 130 * Math.cos(a), y: by + sd * 130 * Math.sin(a) });
      });
      const lvl = es(t, 3.6, 3.8) * (1 - bUp);
      pose(bGlow, { x: BAL[0], y: by + 40, s: 0.8 + lvl * 0.4, o: lvl * 0.9 });
      sparks.forEach((sp, i) => {
        const k = es(t, 3.65 + i * 0.04, 3.8 + i * 0.04) * (1 - bUp);
        const a = i * 1.57 + time * 0.5;
        pose(sp, { x: BAL[0] + Math.cos(a) * 170, y: by + 50 + Math.sin(a) * 50, s: k, r: time * 40, o: k });
      });

      S.cam.z = 1.02 + es(t, 0.9, 1.4) * 0.12 - es(t, 2.9, 3.3) * 0.08 + es(t, 4.0, 4.5) * 0.04;
      S.cam.x = lerp(-30, 20, es(t, 0.3, 1.2));
      S.cam.y = 30 + es(t, 0.9, 1.4) * 50 - es(t, 2.9, 3.3) * 50 + es(t, 4.0, 4.5) * 30;
    };
  },
};
