// Mt 3,4 — a closer look at John by his cliff in the wilderness. A camel ambles up behind him and a few
// tufts of its hair drift over onto his rough coat; labels name the camel's hair and the leather belt.
// Then his food: John reaches into a cleft in the rock where wild bees keep their comb, and locusts
// hop about his feet.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, rock, sun, cloud, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { JOHN_B, hand, acacia, scrub, camel, walkCamel, honeycomb, bee, locust, tagOnString, caveMouth, badlands, DESERT, tr } from './lib.js';

const PI = Math.PI;
const JX = 800, GY = 706;
const CLEFT = [610, 468];          // the bees' comb in the rock

export default {
  id: 'mt3-camel',
  beats: [
    { v: 4, text: 'Sam zaś Jan nosił odzienie z sierści wielbłądziej i pas skórzany około bioder,' },
    { v: 4, cont: true, text: 'a jego pokarmem była szarańcza i miód leśny.' },
  ],
  cam: { x: [-90, 40], y: [0, 120], z: [1, 1.42] },
  build(S) {
    const c = S.c;
    sky(S, DESERT);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1220, y: 160, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 180), { x: 900, y: 130, len: 700 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [18, 8, 3], lens: [1000, 340, 120], color: mix(C.duskViolet, C.dune, 0.5) }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    mid.add(badlands(c, [[900, 560], [1060, 470], [1240, 420], [1500, 400], [2500, 430]], mix(C.dune, C.clay, 0.38)));
    mid.add(`<g transform="translate(1330 560)">${caveMouth(c, 120, 100)}</g>`);

    /* the ground */
    const G = S.layer({ par: 0.45, sh: 3 });
    const gfn = c.wave(620, [5, 2], [600, 170]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sand2, 0.45)).out());
    G.add(grass(c, { x0: 600, x1: 2400, y: 620, fn: gfn, n: 26, h: 12, color: C.olive }) + scrub(c, 1180, 640, 40) + acacia(c, 1480, 640, 1.1) + rock(c, 960, 690, 60, 20, C.rock2));

    /* the camel, behind John */
    const camL = S.layer({ par: 0.45, sh: 4 });
    const camelEl = camL.add(`<g>${camel(c)}</g>`);
    const wisps = [0, 1, 2, 3].map((i) => camL.add(`<g opacity="0"><path d="${c.ribbon(c.qbez([0, 0], [8, -6], [16, 2], 6), 3)}" fill="${shade('#c79d68', -0.1)}"/></g>`));

    /* the cliff with the bees' cleft (in front, on the left) */
    const cliff = S.layer({ par: 0.45, sh: 5 });
    const cs = sheet();
    cs.p(c.cut([[-900, 1700], [-900, 240], [-300, 200], [200, 250], [420, 300], [560, 370], [640, 470], [620, 560], [650, 660], [690, 760], [720, 1700]], 1.4, 10), mix(C.clay, C.dune, 0.4));
    cs.x(c.ribbon([[300, 320], [360, 560]], 5) + c.ribbon([[460, 380], [520, 640]], 4) + c.ribbon([[120, 300], [150, 620]], 5), shade(C.clay, -0.18), 'opacity=".5"');
    cs.p(c.cut(c.ell(CLEFT[0], CLEFT[1] + 4, 30, 42, 14), 0.8, 5), mix(C.soilDark, C.clay, 0.3));
    cliff.add(cs.out());
    const combEl = cliff.add(`<g>${honeycomb(c, 44, 36)}</g>`);
    const drip = cliff.add(`<g><path d="${c.cut([[0, 0], [4, 8], [0, 14], [-4, 8]], 0.2, 3)}" fill="${C.sun}"/></g>`);
    const bees = [0, 1, 2, 3, 4, 5].map((i) => ({ el: cliff.add(`<g>${bee(c)}</g>`), i, r: 26 + i * 8, ph: i * 1.1 }));

    /* John */
    const J = S.layer({ par: 0.45, sh: 5 });
    const combH = `<g data-k="c-comb" opacity="0" transform="translate(4 6) scale(.4)">${honeycomb(c)}</g>`;
    const locH = `<g data-k="c-loc" opacity="0" transform="translate(0 2) scale(.6)">${locust(c)}</g>`;
    const john = S.puppet(J.add(person(c, { ...JOHN_B, holdF: combH, holdB: locH })));
    const combHeld = S.$('c-comb'), locHeld = S.$('c-loc');
    const locusts = [0, 1, 2, 3, 4].map((i) => ({ el: J.add(`<g>${locust(c, { color: i % 2 ? C.olive : C.wheatGreen })}</g>`), x: 700 + i * 52 + (i > 1 ? 90 : 0), i }));

    /* labels */
    const T = S.layer({ par: 0.45, sh: 6 });
    const tags = [
      { el: T.add(tagOnString(tr('sierść wielbłądzia', 'camel’s hair'), { size: 17, dx: -110, dy: 110 })), x: 960, y: 390, a: 0.3, b: 1.0 },
      { el: T.add(tagOnString(tr('pas skórzany', 'leather belt'), { size: 17, dx: 116, dy: 72 })), x: 700, y: 540, a: 0.5, b: 1.0 },
      { el: T.add(tagOnString(tr('szarańcza', 'locusts'), { size: 17, dx: 0, dy: 52 })), x: 930, y: 610, a: 1.35, b: 9 },
      { el: T.add(tagOnString(tr('miód leśny', 'wild honey'), { size: 17, dx: -60, dy: 50 })), x: 680, y: 360, a: 1.2, b: 9 },
    ];

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(rock(c, 1420, 990, 240, 110, C.rock2) + scrub(c, 1280, 950, 70, C.olive) + rock(c, 120, 990, 200, 90, C.rock));

    return (t, time) => {
      swing(sunEl, 1220, 160, time, 1, 0.6);
      swing(cl1, 900 + Math.sin(time * 0.1) * 20, 130, time, 1.2, 0.6, 1);

      /* v4a — the camel comes up behind him; its hair drifts over to John's coat */
      const cw = es(t, 0.02, 0.55);
      const cx = lerp(1640, 1060, cw);
      pose(camelEl, { x: cx, y: gfn(cx) + 40, s: 1.02, sx: -1.02, sy: 1.02 });
      walkCamel(camelEl, cx * 0.06, cw > 0 && cw < 1 ? 1 : 0);
      wisps.forEach((w, i) => {
        const k = seg(t, 0.5 + i * 0.08, 0.95 + i * 0.08);
        const x = lerp(1030 + i * 10, JX + 6 + (i - 1.5) * 10, k), y = lerp(gfn(1060) - 150, GY - 110 + i * 22, k) - Math.sin(k * PI) * 50;
        pose(w, { x, y, r: k * 200 + i * 40, s: 1.2, o: seg(t, 0.5 + i * 0.08, 0.55 + i * 0.08) * (1 - seg(t, 0.95 + i * 0.08, 1.05 + i * 0.08)) });
      });

      /* v4b — honey from the cleft, locusts from the scrub */
      const reach = es(t, 1.18, 1.32) * (1 - es(t, 1.38, 1.5));
      const hold = es(t, 1.38, 1.42);
      const eat = es(t, 1.6, 1.8);
      const turnL = t > 1.02;
      const go = es(t, 1.0, 1.2);
      const jx = lerp(JX, 700, go);
      john.set({
        x: jx, y: GY, s: 1.12, flip: turnL, walk: go > 0 && go < 1 ? jx * 0.05 : undefined,
        armF: 14 + bump(t, 0.3, 0.9) * 20 + reach * 150 + hold * (70 + eat * 20), armB: 10 + hold * 50 + es(t, 1.45, 1.6) * 20,
        head: -reach * 16 + eat * 6 + bump(t, 0.35, 0.9) * 6, blink: blinkAt(time),
      });
      fade(combHeld, hold);
      fade(locHeld, es(t, 1.48, 1.52));
      fade(combEl, 1 - hold * 0.6);
      const dk = time ? (time * 0.8) % 1 : 0.5;
      pose(drip, { x: CLEFT[0] + 4, y: CLEFT[1] + 18 + dk * 30, s: 1 - dk * 0.4, o: seg(t, 1.0, 1.1) * (1 - dk) });
      pose(combEl, { x: CLEFT[0], y: CLEFT[1] });
      bees.forEach((b) => {
        const on = seg(t, 0.95, 1.1);
        const a = time * (1.5 + b.i * 0.2) + b.ph;
        const [hx, hy] = hand(jx, GY, 1.12, true, 14 + reach * 150);
        const cxb = lerp(CLEFT[0], hx, bump(t, 1.2, 1.7) * 0.5), cyb = lerp(CLEFT[1], hy, bump(t, 1.2, 1.7) * 0.5);
        pose(b.el, { x: cxb + Math.cos(a) * b.r, y: cyb + Math.sin(a * 1.3) * b.r * 0.6, s: 1.2, o: on });
      });
      locusts.forEach((l) => {
        const on = seg(t, 1.1, 1.2);
        const hop = Math.max(0, Math.sin((t - 1.1) * 10 + l.i * 1.7)) * es(t, 1.15, 1.3);
        const x = l.x + Math.sin((t - 1) * 3 + l.i) * 22 * on;
        pose(l.el, { x, y: gfn(x) + 70 - hop * 26 + (l.i % 2) * 8, r: -hop * 20, s: 0.62, sx: l.i % 2 ? -0.62 : 0.62, sy: 0.62, o: on });
      });

      tags.forEach((tg) => {
        const k = es(t, tg.a, tg.a + 0.3, ease.out), up = es(t, tg.b, tg.b + 0.25, ease.in);
        swing(tg.el, tg.x, lerp(-300, tg.y, k) - up * 700, time, 1.4, 0.9, tg.a);
        fade(tg.el, k > 0 && up < 1 ? 1 : 0);
      });

      /* camera: a close look at John, then over towards the cleft */
      const close = es(t, 0, 0.5);
      const toL = es(t, 1.0, 1.4);
      S.cam.z = 1.08 + close * 0.22 - toL * 0.06;
      S.cam.x = lerp(40, -70, toL);
      S.cam.y = 60 + close * 30 - toL * 20;
    };
  },
};
