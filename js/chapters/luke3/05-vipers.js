// Łk 3,7 — the crowds keep coming out to the Jordan to be baptised: families along the far bank, groups on
// the near bank, a line of people stepping up to the water. John turns to them and cries, "Brood of vipers!
// Who warned you to flee from the wrath to come?" — the day darkens, a storm glows red on the horizon, a line of
// fire runs through the dry grass of the far bank, and the vipers come slithering out of the reeds, fleeing
// before it into the river. The people draw back; a question hangs over them.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { lightning } from '../../assets/things.js';
import {
  JOHN_B, headAt, jordanSet, shell, voiceRings, folk, group, viper, fireLine, question, JORDAN_DAY, WRATH,
  es, ease, bump, seg, fade, PI,
} from './lib.js';

const JX = 700, WADE = 702, BANK = 776;

export default {
  id: 'lk3-vipers',
  beats: [
    { v: 7, text: 'Mówił więc do tłumów, które wychodziły, żeby przyjąć chrzest od niego:' },
    { v: 7, cont: true, text: '«Plemię żmijowe, kto wam pokazał, jak uciec przed nadchodzącym gniewem?' },
  ],
  cam: { x: [-20, 50], y: [0, 70], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const J = jordanSet(S, { skyCols: JORDAN_DAY, sunAt: [1250, 150], city: false, path: false });
    const { fbFn, far } = J;

    /* families coming along the far bank */
    const FAR = [[-1, 230, 3], [-1, 420, 2], [1, 1130, 3], [1, 1330, 2]].map(([side, x, n], i) => {
      const mem = Array.from({ length: n }, (_, k) => ({ x: (k - (n - 1) / 2) * 30 + c.rr(-5, 5), y: c.rr(-4, 4), s: 1, flip: side > 0, o: folk(c) }));
      return { side, x, i, sp: far.sprite(`<g transform="scale(.42)">${group(c, mem)}</g>`, x, fbFn(x) + 8) };
    });

    /* the day darkens (a violet wash over sky and far bank) */
    const gid = S.id('dim');
    S.defs(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="-600" x2="0" y2="720"><stop offset="0" stop-color="${WRATH[0]}" stop-opacity=".9"/><stop offset=".7" stop-color="${WRATH[1]}" stop-opacity=".55"/><stop offset="1" stop-color="${WRATH[1]}" stop-opacity=".35"/></linearGradient>`);
    const dark = S.layer({ par: 0, sh: 1, flat: true });
    dark.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${gid})"/>`);
    dark.fade(0);

    /* the wrath to come: a storm with a red glow on the horizon */
    const storm = S.layer({ par: 0.05, sh: 4 });
    const redGlow = storm.add(`<ellipse rx="560" ry="210" fill="url(#warm-glow)"/>`);
    const cloudEl = storm.add(`<g><g transform="translate(-120 10)">${cloud(c, 280, mix(C.storm, C.plumRobe, 0.35), C.storm2)}</g><g transform="translate(90 -24)">${cloud(c, 320, mix(C.storm, C.plumRobe, 0.2), C.storm2)}</g><g transform="translate(0 40)">${cloud(c, 240, mix(C.storm2, C.plumRobe, 0.3), C.storm2)}</g></g>`);
    const bolt = storm.add(`<g opacity="0">${lightning(c, 240)}</g>`);

    /* fire in the dry grass of the far bank, vipers fleeing it into the river */
    const fireL = S.layer({ par: 0.45, sh: 2 });
    const fireGlow = fireL.add(`<g><ellipse cx="-420" rx="300" ry="80" fill="url(#warm-glow)"/><ellipse cx="410" rx="300" ry="80" fill="url(#warm-glow)"/></g>`);
    const fires = [[380, 420], [1210, 420]].map(([x, w]) => ({ x, el: fireL.add(`<g>${fireLine(c, w, 46)}</g>`) }));
    const snakes = [0, 1, 2, 3].map((i) => ({ i, x0: [330, 470, 1130, 1280][i], dir: i < 2 ? 1 : -1, el: fireL.add(viper(c, { len: 150 - (i % 2) * 20, col: [mix(C.moss2, C.soilDark, 0.35), mix(C.teal, C.soilDark, 0.3), mix(C.olive, C.soilDark, 0.45), mix(C.moss, C.soilDark, 0.4)][i] })) }));

    /* the river: John */
    const R = J.riverLayer();
    const john = S.puppet(R.add(person(c, { ...JOHN_B, holdF: `<g data-k="v-shell" transform="rotate(-20)">${shell(c, 15)}</g>` })));
    const shellEl = S.$('v-shell');
    J.waterFront(R);
    const voice = voiceRings(R, c, { n: 3, color: C.clay, r: 40, w: 6, both: false });
    const ripples = [0, 1].map(() => R.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 22, 5, 0, PI * 2, 18), 2.2)}" fill="${C.foam}"/></g>`));

    /* the near bank: the crowds */
    const { N } = J.nearBank();
    const NEAR = [[-1, 250, 3], [1, 1420, 3]].map(([side, x, n], i) => {
      const mem = Array.from({ length: n }, (_, k) => ({ x: (k - (n - 1) / 2) * 44 + c.rr(-6, 6), y: c.rr(-6, 6), s: 1, flip: side > 0, o: folk(c) }));
      return { side, x, i, sp: N.sprite(`<g transform="scale(.82)">${group(c, mem)}</g>`, x, BANK + 4) };
    });
    const LIS = [[880, 0.96], [975, 0.9], [1070, 0.98], [1165, 0.92], [1255, 0.95]].map(([x, s], i) => ({ x, s, i, p: S.puppet(N.add(person(c, folk(c, i % 2 === 0 ? true : null)))), seed: c.rr(0, 9) }));
    const qEl = N.add(`<g opacity="0">${question(c)}</g>`);
    J.foreground();

    return (t, time) => {
      J.update(t, time);

      /* v7a — the crowds come out to him */
      FAR.forEach((f) => {
        const k = es(t, 0.05 + f.i * 0.07, 0.45 + f.i * 0.07);
        const flee = es(t, 1.1, 1.5);
        f.sp.set({ x: lerp(f.x + f.side * 700, f.x, k) + f.side * flee * 600, y: fbFn(f.x) + 8 - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 20)) * 2 : 0), o: 1 });
      });
      NEAR.forEach((n) => {
        const k = es(t, 0.15 + n.i * 0.08, 0.55 + n.i * 0.08);
        n.sp.set({ x: lerp(n.x + n.side * 600, n.x, k), y: BANK + 4 - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 20)) * 3 : 0), o: 1 });
      });
      const rage = es(t, 1.02, 1.2);
      LIS.forEach((m) => {
        const k = es(t, 0.1 + m.i * 0.06, 0.55 + m.i * 0.05);
        const x = lerp(m.x + 520, m.x, k);
        const recoil = es(t, 1.1 + m.i * 0.03, 1.3 + m.i * 0.03);
        const look = es(t, 1.35 + m.i * 0.04, 1.55 + m.i * 0.04) * (m.i % 2);
        m.p.set({
          x: x + recoil * 16, y: BANK + (m.i % 2) * 6, s: m.s, flip: look < 0.5, walk: k > 0 && k < 1 ? x * 0.05 + m.i : undefined,
          head: bump(t, 0.6, 0.95) * -4 + recoil * 8 - look * 10, lean: -recoil * 5, armF: 16 + recoil * 40 + look * 30, armB: 8 + recoil * 60,
          blink: blinkAt(time, m.seed),
        });
      });
      pose(qEl, { x: 1060, y: BANK - 250, s: es(t, 1.55, 1.72, ease.back), o: seg(t, 1.55, 1.6) });

      /* v7b — "Brood of vipers!": he points at them */
      const talk = es(t, 0.55, 0.75);
      john.set({ x: JX, y: WADE, s: 1.06, armF: 24 + talk * 30 * (1 - rage) + rage * 76, armB: 10 + talk * 40 + rage * 50, head: -talk * 4 - rage * 6, lean: -rage * 3, blink: blinkAt(time) });
      fade(shellEl, 1 - es(t, 0.5, 0.6));
      const [hx, hy] = headAt(JX, WADE, 1.06);
      voice(hx + 16, hy, Math.max(talk * (1 - es(t, 0.9, 1.0)) * 0.6, rage * (1 - es(t, 1.9, 2.0))), time, { spread: 2.6, dir: 1 });

      /* the wrath to come: dark, a red storm, fire in the grass, vipers fleeing into the water */
      const w = es(t, 1.08, 1.45);
      dark.fade(w * 0.62);
      pose(cloudEl, { x: 1120 + (1 - w) * 420, y: 250, s: 0.8 + w * 0.2, o: w });
      pose(redGlow, { x: 1100, y: 360, s: 1, o: w * 0.7 });
      const fl = time ? (Math.sin(time * 1.7) > 0.93 ? 1 : 0) : 0;
      pose(bolt, { x: 1170, y: 290, o: w * fl * 0.9 });
      const fk = es(t, 1.18, 1.45);
      const flick = time ? 1 + Math.sin(time * 9) * 0.08 : 1;
      fires.forEach((f, i) => pose(f.el, { x: f.x, y: 584, sx: 1, sy: Math.max(0.001, fk * (i ? 2 - flick : flick)), o: fk > 0.01 ? 1 : 0 }));
      pose(fireGlow, { x: 800, y: 570, o: fk * 0.8 });
      snakes.forEach((sn) => {
        const u = seg(t, 1.3 + sn.i * 0.08, 1.9 + sn.i * 0.06);
        const x = sn.x0 + sn.dir * u * 170, y = lerp(596, 650, Math.min(1, u * 1.4));
        const wig = time ? Math.sin(time * 7 + sn.i * 2) * 0.12 : 0;
        const dive = es(t, 1.78 + sn.i * 0.06, 1.95 + sn.i * 0.06);
        pose(sn.el, { x, y, s: 1, sx: -sn.dir * 1.1, sy: 1.1 * (1 + wig), r: sn.dir * 16 * (1 - Math.min(1, u * 1.4)), o: u > 0 ? 1 - dive : 0 });
      });
      ripples.forEach((r, i) => {
        const k = seg(t, 1.8 + i * 0.1, 2.0);
        pose(r, { x: [500, 1100][i], y: 652, s: 0.6 + k * 1.2, o: bump(t, 1.8 + i * 0.1, 2.0) * 0.8 });
      });

      S.cam.z = 1.02 + es(t, 0.6, 1.0) * 0.05 - es(t, 1.1, 1.5) * 0.04;
      S.cam.x = 20 + es(t, 0.6, 1.0) * 20;
      S.cam.y = 40 - es(t, 1.1, 1.5) * 20;
    };
  },
};
