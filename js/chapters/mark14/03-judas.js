// Mk 14,10–11 — Judas comes through the door of the same lamp-lit chamber; the priests are glad and hand him
// a purse. From then on he watches from the window for his chance, his shadow long on the wall.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  chamber, table, priest, priestOpts, highPriest, HP, scribe, scribeOpts, shadowPerson, hangingLamp, lampGlow, pawn, snare, TW,
  kf, moving, hand, headAt, withFace, faceBits, purse, coin, vignette, PI,
vis, } from './lib.js';

export default {
  id: 'm14-judas',
  beats: [
    { v: 10 },
    { v: 11, text: 'Gdy to usłyszeli, ucieszyli się i przyrzekli dać mu pieniądze.' },
    { v: 11, cont: true, text: 'Odtąd szukał dogodnej sposobności, jak by Go wydać.' },
  ],
  cam: { x: [-60, 140], y: [-40, 120], z: [1, 1.35] },
  build(S) {
    const c = S.c;
    const R = chamber(S, { skyCols: ['#343a6e', '#6d5f8a', '#b88592'] });
    const { FLOOR, DOOR } = R;
    const TOP = FLOOR - 100;

    // the Master, far off in the city streets (seen through the window): a tiny halo among a small group
    const farL = S.layer({ par: 0.17, sh: 1 });
    const group = farL.add(`<g><circle cx="0" cy="-26" r="30" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.circ(0, -22, 5, 10), 0.2, 2), C.halo).p(c.cut([[-4, 0], [-3, -16], [3, -16], [4, 0]], 0.2, 3), C.linen).out()}${[-14, -24, 12, 22, -32].map((x, i) => `<path d="${c.cut([[x - 3.4, 0], [x - 2.6, -13], [x + 2.6, -13], [x + 3.4, 0]], 0.2, 3) + c.cut(c.circ(x, -16, 3, 8), 0.2, 2)}" fill="${mix([C.dustyBlue, C.wheatRobe, C.mauve, C.sageRobe, C.tealRobe][i], C.indigo, 0.3)}"/>`).join('')}</g>`);

    const SH = '#2a2034';
    const cast = [
      { k: 'sc0', o: scribeOpts(0), m: () => scribe(c, 0), x: 540, y: FLOOR + 8, s: 1.0, flip: false, front: true },
      { k: 'pr1', o: priestOpts(1), m: () => priest(c, 1), x: 700, y: FLOOR - 26, s: 0.94, flip: false },
      { k: 'hp', o: HP, m: () => highPriest(c), x: 880, y: FLOOR - 26, s: 0.98, flip: true },
    ];
    cast.forEach((m) => {
      m.seed = c.rr(0, 9);
      m.sh = S.puppet(R.shadows.add(`<g clip-path="url(#${R.clipId})" opacity=".16">${shadowPerson(c, m.o, SH)}</g>`).firstElementChild);
    });
    const jSh = S.puppet(R.shadows.add(`<g clip-path="url(#${R.clipId})" opacity=".2">${shadowPerson(c, TW.judas, SH)}</g>`).firstElementChild);

    const lampL = S.layer({ par: 0.44, sh: 3 });
    const lampGl = lampL.add(lampGlow(800, 330));
    const lampEl = hanging(lampL, `<g transform="translate(-6 0)">${hangingLamp(c)}</g>`, { x: 800, y: 330, len: 100 });
    const lampFl = lampEl.querySelector('.flame');

    const back = S.layer({ par: 0.5, sh: 5 });
    cast.filter((m) => !m.front).forEach((m) => { m.p = S.puppet(back.add(m.m())); });
    const tabL = S.layer({ par: 0.52, sh: 6 });
    tabL.add(`<g transform="translate(790 ${FLOOR})">${table(c, 330, 100)}</g>`);
    tabL.add(`<g transform="translate(760 ${TOP + 1})">${pawn(c)}</g>`);
    const front = S.layer({ par: 0.56, sh: 5 });
    cast.filter((m) => m.front).forEach((m) => { m.p = S.puppet(front.add(m.m())); });
    const jEl = front.add(withFace(person(c, TW.judas), faceBits(c)));
    const judas = S.puppet(jEl);
    const jBrow = jEl.querySelector('[data-part="angry"]');

    const fx = S.layer({ par: 0.56, sh: 4 });
    const purseEl = fx.add(`<g>${purse(c)}</g>`);
    const coins = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${coin(c, 7)}</g>`), dx: c.rr(-40, 40) }));
    S.layer({ par: 0.6, sh: 0, flat: true }).add(vignette(S, { cx: 800, cy: 500, r: 700, o: 0.35 }));

    return (t, time) => {
      const T = time;
      const night = es(t, 1.9, 2.6);
      R.sky.blend(['#343a6e', '#6d5f8a', '#b88592'], ['#1c2148', '#2e3566', '#4d4f7c'], night);
      R.stars.fade(0.9);
      R.crowd.fade(0.8 - night * 0.3);
      R.dim.fade(1);
      swing(lampEl, 800, 330, T, 1, 0.8);
      pose(lampFl, { x: 32, y: 36, sx: 1 + Math.sin(T * 7) * 0.08, sy: 1 + Math.sin(T * 5.3) * 0.12 });
      fade(lampGl, 0.75 - night * 0.2);

      // v10 — Judas in through the door, to the priests; v11b — to the window
      const jK = [[-0.2, [1340, FLOOR + 8]], [0.7, [1010, FLOOR + 8]], [2.05, [1010, FLOOR + 8]], [2.55, [930, FLOOR + 8]]];
      const [jx, jy] = kf(t, jK);
      const jw = moving(t, jK, 1);
      const take = es(t, 1.35, 1.6);
      const toWin = es(t, 2.05, 2.1);
      const peer = es(t, 2.5, 2.8);
      const jArm = 20 + bump(t, 0.7, 1.2) * 30 + take * 40 * (1 - toWin) + toWin * 34;
      judas.set({ x: jx, y: jy, s: 1.0, flip: toWin < 0.5, walk: jw ? jx * 0.05 : undefined, armF: jArm, armB: 10 + bump(t, 0.75, 1.1) * 20, head: bump(t, 0.75, 1.15) * 16 - peer * 14, lean: bump(t, 0.75, 1.15) * 6, blink: blinkAt(T, 2) });
      fade(jBrow, es(t, 2.2, 2.6));
      jSh.set({ x: jx + (jx - 800) * 0.6, y: 700, s: 1.2 + night * 0.35, flip: toWin < 0.5, armF: jArm, head: -peer * 14 });

      // the priests: listen, rejoice, give the purse; then withdraw into the dark
      const glad = es(t, 1.05, 1.3) * (1 - es(t, 2.1, 2.4));
      const gone = es(t, 2.1, 2.5);
      cast.forEach((m) => {
        let armF = 14 + es(t, 0.6, 0.9) * 10, armB = 6, head = -es(t, 0.5, 0.9) * 4;
        if (m.k === 'hp') { armF = 20 + take * 50 * (1 - toWin) + glad * 20; armB = 10 + glad * 120; head = -glad * 10; }
        else { armF += glad * 60; armB += glad * (m.k === 'sc0' ? 140 : 110); head -= glad * 10; }
        const bob = -glad * Math.abs(Math.sin(T * 6 + m.seed)) * 4;
        const flip = gone > 0.5 ? m.k !== 'sc0' && m.k !== 'pr1' ? true : false : false;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip, armF: armF * (1 - gone) + gone * (m.k === 'hp' ? 40 : 30), armB: armB * (1 - gone), head: head * (1 - gone) + gone * 6, bob, blink: blinkAt(T, m.seed) });
        m.sh.set({ x: m.x + (m.x - 800) * 0.55, y: 700, s: m.s * 1.2, flip, armF, armB, head });
      });
      // the purse: from the high priest's hand into Judas's
      const [hpx, hpy] = hand(880, FLOOR - 26, 0.98, false, 20 + take * 50 * (1 - toWin) + glad * 20);
      const [jhx, jhy] = hand(jx, jy, 1.0, toWin < 0.5, jArm);
      const pin = es(t, 1.1, 1.3);
      const hold = es(t, 1.45, 1.6);
      vis(purseEl, { x: lerp(hpx, jhx, hold), y: lerp(hpy, jhy, hold) - 4, s: pin, r: Math.sin(T * 2) * 4, o: pin > 0.01 ? 1 : 0 });
      coins.forEach((k) => {
        const u = seg(t, 1.2 + k.i * 0.06, 1.5 + k.i * 0.06);
        vis(k.el, { x: lerp(hpx, hpx + k.dx, u), y: hpy - Math.sin(u * PI) * 70, r: u * 400, o: u > 0 && u < 1 ? 1 : 0 });
      });

      // v11b — far off in the streets, the Master walks with His friends; Judas's eyes follow
      const walkK = seg(t, 2.1, 3.0);
      vis(group, { x: lerp(660, 900, walkK), y: 548, s: 1.4, o: es(t, 2.1, 2.3) });

      S.cam.x = kf(t, [[-0.5, 90], [0.8, 60], [1.1, 40], [2.0, 40], [2.6, 110]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.8, 1.12], [1.1, 1.2], [2.0, 1.2], [2.6, 1.3]]);
      S.cam.y = kf(t, [[-0.5, 40], [1.1, 70], [2.0, 70], [2.6, 40]]);
    };
  },
};
