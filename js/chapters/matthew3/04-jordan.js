// Mt 3,5–6 — the Jordan. Name tags come down one after another — Jerusalem, all Judea, the whole region
// of the Jordan — and from each, people stream down to the river: pilgrims on the road from the city gate,
// families along the far bank, villagers up the valley. John baptises them in the river; kneeling in the
// water they confess their sins, and the dark scraps they held slip into the current and wash away.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { JOHN_B, hand, headAt, jordanSet, shell, scrap, drops, hungWord, folk, group, DAY, tr } from './lib.js';

const PI = Math.PI;
const JX = 800, WADE = 702;

export default {
  id: 'mt3-jordan',
  beats: [
    { v: 5 },
    { v: 6, text: 'Przyjmowano od niego chrzest w rzece Jordan,' },
    { v: 6, cont: true, text: 'wyznając przy tym swe grzechy.' },
  ],
  cam: { x: [-60, 60], y: [0, 140], z: [0.94, 1.34] },
  build(S) {
    const c = S.c;
    const J = jordanSet(S, { skyCols: DAY, sunAt: [1230, 150], city: true, tents: true });
    const { fbFn, far, PATH, hill } = J;

    /* pilgrims on the road down from Jerusalem (tiny sprites) */
    const segLen = PATH.slice(1).map((p, i) => Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1]));
    const total = segLen.reduce((a, b) => a + b, 0);
    const along = (u) => {
      let d = u * total;
      for (let i = 0; i < segLen.length; i++) {
        if (d <= segLen[i] || i === segLen.length - 1) { const k = Math.min(1, d / segLen[i]); const a = PATH[i], b = PATH[i + 1]; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]; }
        d -= segLen[i];
      }
      return PATH[PATH.length - 1];
    };
    const pilgrims = Array.from({ length: 9 }, (_, i) => ({ i, sp: hill.sprite(`<g transform="scale(.14)">${person(c, folk(c))}</g>`, PATH[0][0], PATH[0][1]) }));

    /* families arriving along the far bank: from Judea (left) and up the valley (right) */
    const FAR = [];
    [[-1, 180], [-1, 330], [-1, 470], [1, 1150], [1, 1300], [1, 1440]].forEach(([side, x], i) => {
      const mem = Array.from({ length: 3 }, (_, k) => ({ x: (k - 1) * 30 + c.rr(-6, 6), y: c.rr(-5, 5), s: 1, flip: side > 0, o: folk(c) }));
      FAR.push({ i, side, x, from: x - side * -900, sp: far.sprite(`<g transform="scale(.4)">${group(c, mem)}</g>`, x, fbFn(x) + 8) });
    });

    /* the river: John, a man kneeling in the water, two more waiting */
    const R = J.riverLayer();
    const john = S.puppet(R.add(person(c, { ...JOHN_B, holdF: `<g transform="rotate(-20)">${shell(c, 15)}</g>` })));
    const pourEl = R.add(`<g>${drops(c, 5, C.lake2)}</g>`);
    const SIN = `<g data-k="s0" transform="translate(0 4)">${scrap(c, 9)}</g>`;
    const kneel = S.puppet(R.add(person(c, { robe: C.dustyBlue, hairStyle: 'short', hair: C.hair2, beard: 'short', skin: C.skin2, pose: 'kneel', holdF: SIN })));
    const held0 = S.$('s0');
    const queue = [{ robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin }, { robe: C.sageRobe, hairStyle: 'curly', hair: C.hair3, beard: 'full', skin: C.skin4, belt: C.leather }]
      .map((o, i) => ({ p: S.puppet(R.add(person(c, { ...o, holdF: `<g data-k="s${i + 1}" transform="translate(0 4)">${scrap(c, 9)}</g>` }))), held: S.$(`s${i + 1}`), x: 1000 + i * 92, i }));
    J.waterFront(R);
    const splash = R.add(`<g opacity="0">${[-1, 1].map((sd) => `<path d="${c.cut([[0, 0], [sd * 20, -30], [sd * 30, -26], [sd * 12, 2]], 0.4, 4)}" fill="${C.foam}"/>`).join('')}</g>`);
    const SC = [{ x: 890, y: 610 }, { x: 1004, y: 590 }, { x: 1096, y: 590 }].map((s, i) => ({ ...s, i, el: R.add(`<g>${scrap(c, 11 + (i % 2) * 3)}</g>`), foam: R.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 18, 5, 0, PI * 2, 16), 2.4)}" fill="${C.foam}"/></g>`) }));

    /* the near bank and its people */
    const { N } = J.nearBank();
    const NEAR = [[-1, 330, 3], [-1, 520, 2], [1, 1110, 2], [1, 1300, 3]].map(([side, x, n], i) => {
      const mem = Array.from({ length: n }, (_, k) => ({ x: (k - (n - 1) / 2) * 44 + c.rr(-6, 6), y: c.rr(-6, 6), s: 1, flip: side > 0, o: folk(c) }));
      return { i, side, x, sp: N.sprite(`<g transform="scale(.82)">${group(c, mem)}</g>`, x, 776) };
    });
    J.foreground();

    /* the three names, from the flies */
    const fly = S.layer({ par: 0.12, sh: 6 });
    const NAMES = [
      { el: fly.add(hungWord(c, tr('Jerozolima', 'Jerusalem'), { size: 22 })), x: 590, y: 214, a: 0.05 },
      { el: fly.add(hungWord(c, tr('cała Judea', 'all Judea'), { size: 22 })), x: 860, y: 262, a: 0.25 },
      { el: fly.add(hungWord(c, tr('okolica nad Jordanem', 'the region around the Jordan'), { size: 22 })), x: 1140, y: 318, a: 0.42 },
    ];

    return (t, time) => {
      J.update(t, time);

      /* v5 — the streams of people */
      NAMES.forEach((n, i) => {
        const k = es(t, n.a, n.a + 0.28, ease.out), up = es(t, 0.95, 1.15, ease.in);
        pose(n.el, { x: n.x, y: lerp(-420, n.y, k) - up * 700, r: Math.sin(time * 0.8 + i) * 1.2, o: k > 0.01 && up < 1 ? 1 : 0 });
      });
      pilgrims.forEach((p) => {
        const u = seg(t, 0.08 + p.i * 0.05, 0.62 + p.i * 0.05);
        const [x, y] = along(u);
        p.sp.set({ x, y: y + 2, o: u > 0 && u < 1 ? 1 : 0 });
      });
      FAR.forEach((f) => {
        const a = f.side < 0 ? 0.25 : 0.42;
        const k = es(t, a + (f.i % 3) * 0.05, a + 0.28 + (f.i % 3) * 0.05);
        const x = lerp(f.x + f.side * 900, f.x, k);
        f.sp.set({ x, y: fbFn(f.x) + 8 - (k > 0 && k < 1 ? Math.abs(Math.sin(x * 0.05)) * 2 : 0), o: 1 });
      });
      NEAR.forEach((n) => {
        const k = es(t, 0.3 + n.i * 0.05, 0.62 + n.i * 0.04);
        n.sp.set({ x: lerp(n.x + n.side * 700, n.x, k), y: 776 - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 20)) * 3 : 0), o: 1 });
      });

      /* v6a — baptism in the river */
      const pour = es(t, 1.2, 1.4) * (1 - es(t, 1.8, 1.95));
      const hand2 = es(t, 2.1, 2.3);
      john.set({
        x: JX, y: WADE, s: 1.05, flip: false,
        armF: 30 + pour * 80 - hand2 * 10, armB: 10 + hand2 * 40, head: 6 + pour * 4 - bump(t, 2.3, 2.9) * 4, blink: blinkAt(time, 2),
      });
      const [px, py] = hand(JX, WADE, 1.05, false, 30 + pour * 80);
      const fall = time ? (time * 1.6) % 1 : 0.5;
      pose(pourEl, { x: px + 12 + fall * 10, y: py + 6 + fall * 50, o: seg(t, 1.35, 1.45) * (1 - seg(t, 1.78, 1.86)) });
      const kIn = es(t, 1.02, 1.2);
      pose(splash, { x: 905, y: 650, s: bump(t, 1.05, 1.3) * 1.3, o: bump(t, 1.05, 1.3) });

      /* v6b — confessing: heads bow, hands open, the dark scraps drop and are carried away */
      const confess = es(t, 1.95, 2.12);
      kneel.set({ x: lerp(1000, 905, kIn), y: WADE, s: 1, flip: true, o: kIn, head: 10 + bump(t, 1.3, 1.8) * 6 + confess * 12, armF: 60 - bump(t, 1.3, 1.8) * 20 + confess * 20 - es(t, 2.12, 2.22) * 30, armB: 40, blink: blinkAt(time, 4) });
      queue.forEach((q) => {
        const k = es(t, 1.05 + q.i * 0.08, 1.3 + q.i * 0.08);
        const x = q.x + (1 - k) * 220;
        q.p.set({ x, y: WADE, s: 0.96, flip: true, o: k, head: 8 + confess * 14, armF: 40 + confess * 30 - es(t, 2.2 + q.i * 0.08, 2.3 + q.i * 0.08) * 40, walk: k > 0 && k < 1 ? x * 0.05 : undefined, blink: blinkAt(time, q.i + 5) });
      });
      [held0, ...queue.map((q) => q.held)].forEach((h, i) => fade(h, 1 - seg(t, 2.12 + i * 0.08, 2.15 + i * 0.08)));
      SC.forEach((s) => {
        const a = 2.12 + s.i * 0.08;
        const drop = es(t, a, a + 0.1, ease.in), drift = seg(t, a + 0.08, a + 1.1);
        const x = s.x - drift * (250 + s.i * 70), y = lerp(s.y, 672 + s.i * 7, drop) + Math.sin(drift * 10 + s.i) * 3;
        pose(s.el, { x, y, r: drift * 160 + s.i * 40, s: 1.6 - drift * 0.8, o: seg(t, a - 0.01, a) * (1 - seg(t, a + 0.7, a + 1.0)) });
        const fk = seg(t, a + 0.5, a + 1.0);
        pose(s.foam, { x: x - 10, y: 674 + s.i * 7, s: 0.5 + fk * 1.2, o: bump(t, a + 0.45, a + 1.1) * 0.9 });
      });

      /* camera: wide for the crowds, then in to the river */
      const close = es(t, 0.95, 1.35);
      S.cam.z = 0.96 + close * 0.3;
      S.cam.x = close * 45;
      S.cam.y = 30 + close * 90;
    };
  },
};
