// Mt 12,15–16 — the shore at Capernaum. Over the white synagogue a dark curl of plotting hangs; Jesus knows it, and
// walks away from the town along the beach with Peter and John, looking back once. Great crowds come after Him, and
// the sick among them are healed one after another: a lame man drops his crutch and lifts his arms, a blind woman
// opens her eyes, a feverish boy sits up on his mother's arm — light runs through the whole crowd. The healed start
// to cry out the news, but He raises His hand: "Do not make me known" — and their bubbles of words are taped shut.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { capShore, NOON, crowdMarkup, crutch, manOf, womanOf, handAt, headAt, kf, moving, wisp, speech, bang, tapeCross, bubble, sparkle, glow, tr, PI } from './lib.js';

const Y = 712;
const JX = 800;

export default {
  id: 'mt12-withdraw',
  beats: [
    { v: 15, text: 'Gdy się Jezus dowiedział o tym, oddalił się stamtąd.' },
    { v: 15, cont: true, text: 'A wielu poszło za Nim i uzdrowił ich wszystkich.' },
    { v: 16 },
  ],
  cam: { x: [-40, 60], y: [0, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const K = capShore(S, { skyCols: NOON, sunAt: [1250, 190], beachY: 640 });
    /* the plot over the synagogue */
    const plotL = S.layer({ par: 0.2, sh: 3 });
    const plot = plotL.add(`<g>${wisp(c, 1.8, '#4a3f52')}</g>`);

    /* the crowds that follow (sprites), with their "healed" twins (arms up) */
    const crowdL = S.layer({ par: 0.36, sh: 4 });
    const GR = [
      { seed: 'mt12-wd-a', x: 1010, y: 654, n: 10, s: 0.64 },
      { seed: 'mt12-wd-b', x: 560, y: 650, n: 8, s: 0.62 },
    ].map((g, i) => ({
      ...g, i,
      a: crowdL.sprite(crowdMarkup(g.seed, g.n, { s: g.s, rows: 2, faceIn: 0, flip: i === 0 })),
      b: crowdL.sprite(crowdMarkup(g.seed, g.n, { s: g.s, rows: 2, flip: i === 0, armF: [60, 110], armB: [100, 160], head: [-10, -2] })),
    }));
    const crowdSp = [0, 1, 2, 3, 4, 5].map((i) => crowdL.add(`<g opacity="0">${sparkle(c, 10 + (i % 3) * 3)}</g>`));

    /* the sick in front */
    const act = S.layer({ par: 0.5, sh: 5 });
    const lameO = manOf(c, { robe: C.stone2, mantle: null, hairStyle: 'short', beard: 'full', skin: C.skin3 });
    const lame = S.puppet(act.add(person(c, lameO)));
    const cr = act.add(`<g>${crutch(c)}</g>`);
    const blindO = womanOf(c, { robe: C.roseRobe, veil: C.skyVeil, skin: C.skin2 });
    const blind = S.puppet(act.add(person(c, { ...blindO, eyes: 'closed' })));
    const seer = S.puppet(act.add(person(c, blindO)));
    const momO = womanOf(c, { robe: C.tealRobe, veil: C.linen2, skin: C.skin3 });
    const boyUp = `<g transform="translate(-4 -2) rotate(-70) scale(.42)">${person(c, { robe: C.wheatRobe, skin: C.skin3, hair: C.hair2, hairStyle: 'curly', beard: 'none' })}</g>`;
    const boyDown = `<g transform="translate(10 -6) rotate(-100) scale(.42)">${person(c, { robe: C.wheatRobe, skin: C.skin3, hair: C.hair2, hairStyle: 'curly', beard: 'none', eyes: 'closed' })}</g>`;
    const mom = S.puppet(act.add(person(c, { ...momO, holdF: `<g data-k="boyD">${boyDown}</g><g data-k="boyU" opacity="0">${boyUp}</g>` })));
    const boyD = S.$('boyD'), boyU = S.$('boyU');
    const DIS = [{ k: 'peter' }, { k: 'john' }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[d.k] }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const heals = [0, 1, 2].map(() => act.add(`<g opacity="0">${glow(90, 1)}${sparkle(c, 16)}</g>`));

    /* words */
    const fx = S.layer({ par: 0.52, sh: 4 });
    const cries = [0, 1, 2].map(() => {
      const el = fx.add(`<g opacity="0">${speech(c, bang(c, 28), { w: 46, h: 46 })}<g data-part="tape" opacity="0" transform="translate(24 -40)">${tapeCross(c, 50, 40, 10)}</g></g>`);
      return { el, tape: el.querySelector('[data-part="tape"]') };
    });
    const hush = fx.add(`<g opacity="0">${bubble(c, tr('Nie rozgłaszajcie Mnie', 'Do not make me known'), { size: 20, fill: C.halo, tail: -1 })}</g>`);

    const jK = [[-0.6, 1180], [0.8, JX]];
    const SICK = [
      { x: 570, at: 1.2 }, { x: 1060, at: 1.4 }, { x: 660, at: 1.6 },
    ];

    return (t, time) => {
      const T = time;
      K.update(T, { sunX: 1250, sunY: 190 });

      /* v15a — He knows of the plot and withdraws */
      const pk = es(t, -0.3, 0.2) * (1 - es(t, 1.0, 1.3));
      pose(plot, { x: 1200, y: 400, s: 0.8 + pk * 0.3, r: Math.sin(T * 0.8) * 8, o: pk * 0.9 });
      const jx = kf(t, jK, (u) => ease.sine(u));
      const walking = moving(t, jK);
      const back = bump(t, 0.2, 0.7);
      const stop = es(t, 2.05, 2.25);
      let flip = back < 0.3;
      if (t >= 1.05 && t < 1.9) flip = !(t >= 1.32 && t < 1.52);
      if (t >= 1.9) flip = false;
      jesus.set({ x: jx, y: Y, s: 1.06, flip, walk: walking ? jx * 0.055 : undefined, armF: 12 + bump(t, 1.12, 1.35) * 60 + bump(t, 1.32, 1.55) * 60 + bump(t, 1.52, 1.78) * 60, armB: 8 + stop * 140, head: -2 + back * 6, blink: blinkAt(T, 2) });
      DIS.forEach((d) => {
        const x = jx + 96 + d.i * 70;
        d.p.set({ x, y: Y - 26 + (d.i ? 4 : 0), s: 0.9, flip: true, walk: walking ? x * 0.055 + d.i : undefined, armF: 8, armB: 6, head: -2, blink: blinkAt(T, d.seed) });
      });

      /* v15b — crowds follow; He heals them all */
      const come = es(t, 0.9, 1.4, ease.out);
      const glad = es(t, 1.6, 1.85);
      GR.forEach((g) => {
        const x = g.i === 0 ? lerp(1450, g.x, come) : lerp(200, g.x, come);
        g.a.set({ x, y: g.y, o: come * (1 - glad) });
        g.b.set({ x, y: g.y, o: come * glad });
      });
      crowdSp.forEach((sp, i) => {
        const k = es(t, 1.62 + i * 0.03, 1.8 + i * 0.03, ease.back) * (1 - es(t, 2.3, 2.5));
        pose(sp, { x: [470, 560, 650, 930, 1030, 1130][i], y: 520 + (i % 2) * 24, s: k, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });
      const sickIn = es(t, 0.95, 1.2);
      const h = SICK.map((sk) => es(t, sk.at, sk.at + 0.12));
      lame.set({ x: 570, y: Y - 6, s: 0.95, flip: false, o: sickIn, armF: 20 + h[0] * 110, armB: 10 + h[0] * 150, head: 8 - h[0] * 16, lean: 8 * (1 - h[0]), blink: blinkAt(T, 4) });
      const fall = es(t, 1.22, 1.4, ease.in);
      pose(cr, { x: 556 + fall * 40, y: Y - 128 + fall * 118, r: fall * 80, o: sickIn });
      const opened = h[1];
      blind.set({ x: 1060, y: Y - 2, s: 0.94, flip: true, o: sickIn * (1 - opened), armF: 60, armB: 20, head: -6, blink: 0 });
      seer.set({ x: 1060, y: Y - 2, s: 0.94, flip: true, o: sickIn * opened, armF: 50 + es(t, 1.5, 1.7) * 60, armB: 30 + es(t, 1.5, 1.7) * 100, head: -8, blink: blinkAt(T, 6) });
      mom.set({ x: 660, y: Y + 4, s: 0.93, flip: false, o: sickIn, armF: 60, armB: 40 + h[2] * 60, head: 6 - h[2] * 10, blink: blinkAt(T, 7) });
      fade(boyD, 1 - h[2]); fade(boyU, h[2]);
      heals.forEach((el, i) => {
        const sk = SICK[i];
        const k = bump(t, sk.at - 0.05, sk.at + 0.4);
        const [hx, hy] = headAt(sk.x, Y, 0.95, sk.x > JX);
        pose(el, { x: hx, y: hy + 30, s: 0.6 + k * 0.6, r: T * 20, o: k });
      });

      /* v16 — the healed cry out; He tells them not to make Him known */
      const who = [[570, false], [1060, true], [660, false]];
      cries.forEach((cr_, i) => {
        const k = es(t, 1.9 + i * 0.06, 2.05 + i * 0.06, ease.back);
        const tape = es(t, 2.35 + i * 0.07, 2.45 + i * 0.07, ease.back);
        const [hx, hy] = headAt(who[i][0], Y, 0.95, who[i][1]);
        pose(cr_.el, { x: hx + (who[i][1] ? -26 : 20), y: hy - 30, s: k * (1 - tape * 0.25), o: k > 0.01 ? 1 : 0 });
        pose(cr_.tape, { x: 24, y: -40, s: 0.6 + tape * 0.4, o: tape });
      });
      const hk = es(t, 2.12, 2.3, ease.back);
      const [jhx, jhy] = headAt(JX, Y, 1.06, false);
      pose(hush, { x: jhx + 40, y: jhy - 70, s: hk, o: hk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.6, 60], [0.8, 0], [2.0, 0]]);
      S.cam.z = kf(t, [[-0.6, 1.06], [0.8, 1.08], [1.1, 1.1], [2.0, 1.1]]);
      S.cam.y = kf(t, [[-0.6, 30], [1.1, 40], [2.0, 40]]);
    };
  },
};
