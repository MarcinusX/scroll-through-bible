// Mt 26,3–5 — the court of the high priest at dusk. The chief priests and elders come in through the door and
// gather at the table; Caiaphas takes his place (his name comes down on a tag). They bend over a little paper figure
// of Jesus and a net is lowered over it — "by deceit". "Not during the feast": the high priest lifts his hand, and in
// the window the streets fill with pilgrims — the people who might riot.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  chamber, table, priest, priestOpts, highPriest, HP, scribe, scribeOpts, shadowPerson, hangingLamp, lampGlow, pawn, snare, speech, headAt,
  scrollOpen, nameTag, kf, moving, tr, vis, PI,
} from './lib.js';

export default {
  id: 'mt26-plot',
  beats: [
    { v: 3 },
    { v: 4 },
    { v: 5 },
  ],
  cam: { x: [-40, 120], y: [-60, 80], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    const R = chamber(S, { skyCols: ['#434575', '#86708f', '#c4908f'] });
    const { FLOOR, DOOR } = R;
    const TOP = FLOOR - 100;

    const SH = '#2a2034';
    const cast = [
      { k: 'sc0', o: scribeOpts(0), m: () => scribe(c, 0), x: 540, y: FLOOR + 8, s: 1.0, flip: false, front: true, enter: 0.1 },
      { k: 'pr1', o: priestOpts(1), m: () => priest(c, 1), x: 700, y: FLOOR - 26, s: 0.94, flip: false, enter: 0.25 },
      { k: 'hp', o: HP, m: () => highPriest(c), x: 905, y: FLOOR - 26, s: 0.98, flip: true, enter: 0.45 },
      { k: 'sc1', o: scribeOpts(2), m: () => scribe(c, 2), x: 1065, y: FLOOR + 8, s: 1.0, flip: true, front: true, enter: 0.02 },
    ];
    cast.forEach((m, i) => {
      m.i = i; m.seed = c.rr(0, 9);
      m.sh = S.puppet(R.shadows.add(`<g clip-path="url(#${R.clipId})" opacity=".16">${shadowPerson(c, m.o, SH)}</g>`).firstElementChild);
    });
    const lampL = S.layer({ par: 0.44, sh: 3 });
    const lampGl = lampL.add(lampGlow(800, 330));
    const lampEl = hanging(lampL, `<g transform="translate(-6 0)">${hangingLamp(c)}</g>`, { x: 800, y: 330, len: 100 });
    const lampFl = lampEl.querySelector('.flame');
    const tagL = S.layer({ par: 0.45, sh: 5 });
    const caiaphas = hanging(tagL, nameTag(c, [tr('Kajfasz', 'Caiaphas'), tr('najwyższy kapłan', 'the high priest')], { size: 16 }), { x: 0, y: 0, len: 700 });

    const back = S.layer({ par: 0.5, sh: 5 });
    cast.filter((m) => !m.front).forEach((m) => { m.p = S.puppet(back.add(m.m())); });
    const tabL = S.layer({ par: 0.52, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR})">${table(c, 330, 100)}</g>`);
    tabL.add(`<g transform="translate(700 ${TOP - 12}) rotate(-4)">${scrollOpen(c, 80, 40)}</g>`);
    const pawnEl = tabL.add(`<g>${pawn(c)}</g>`);
    const front = S.layer({ par: 0.56, sh: 5 });
    cast.filter((m) => m.front).forEach((m) => { m.p = S.puppet(front.add(m.m())); });

    const fx = S.layer({ par: 0.56, sh: 5 });
    const net = fx.add(`<g>${snare(c, 110, 70, mix(C.rope, C.ink, 0.35))}</g>`);
    const crowdIcon = (() => {
      const s = sheet();
      let d = '';
      [[-16, 4], [0, 0], [16, 4]].forEach(([x, y]) => { d += c.cut(c.circ(x, y - 8, 5.5, 10), 0.2, 3) + c.cut([[x - 8, y + 12], [x - 6, y - 2], [x + 6, y - 2], [x + 8, y + 12]], 0.2, 3); });
      s.p(d, mix(C.plumRobe, C.ink, 0.3));
      let jag = '';
      [-1, 1].forEach((sd) => { jag += c.ribbon([[sd * 26, -12], [sd * 32, -18]], 2.4) + c.ribbon([[sd * 27, -2], [sd * 35, -2]], 2.4) + c.ribbon([[sd * 26, 8], [sd * 32, 14]], 2.4); });
      s.x(jag, C.terracotta);
      return s.out();
    })();
    const noFeast = fx.add(`<g>${speech(c, `<g transform="translate(0 -4) scale(.9)">${crowdIcon}</g><path d="${c.ribbon([[-30, 16], [30, -20]], 4)}" fill="${C.terracotta}" opacity=".85"/>`, { w: 96, h: 62, flip: true })}</g>`);
    const whisper = fx.add(`<g>${speech(c, `<path d="${c.ribbon(c.qbez([-18, 0], [0, -10], [18, 0], 8), 2)}" fill="${C.inkSoft}" opacity=".6"/><path d="${c.ribbon(c.qbez([-14, 8], [0, 0], [14, 8], 8), 2)}" fill="${C.inkSoft}" opacity=".6"/>`, { w: 60, h: 40 })}</g>`);

    return (t, time) => {
      const T = time;
      R.stars.fade(0.6 + es(t, 0.5, 2.5) * 0.3);
      R.crowd.fade(es(t, 2.1, 2.45));
      swing(lampEl, 800, 330, T, 1, 0.8);
      pose(lampFl, { x: 32, y: 36, sx: 1 + Math.sin(T * 7) * 0.08, sy: 1 + Math.sin(T * 5.3) * 0.12 });
      fade(lampGl, 0.75);

      /* v3 — they come in and gather; Caiaphas */
      const plot = es(t, 1.05, 1.4) * (1 - es(t, 2.6, 2.95) * 0.4);
      const netK = es(t, 1.3, 1.75, ease.out) * (1 - es(t, 2.2, 2.6));
      const stop = es(t, 2.1, 2.35);
      vis(pawnEl, { x: 800, y: TOP + 1, s: 1, o: es(t, 0.9, 1.05) });
      vis(net, { x: 800, y: lerp(120, TOP - 78, netK), s: 1, r: Math.sin(T * 1.3) * 2 * netK, o: netK > 0.01 ? 1 : 0 });
      const wsp = es(t, 1.45, 1.65, ease.back) * (1 - es(t, 1.9, 2.0));

      cast.forEach((m) => {
        const inK = [[m.enter - 0.6, [DOOR.x0 + 60, m.y]], [m.enter + 0.4, [m.x, m.y]]];
        const [ex] = kf(t, inK, ease.sine);
        const walking = moving(t, inK, 1);
        const arrived = es(t, m.enter + 0.3, m.enter + 0.42);
        let armF = 12, armB = 6, head = 0, lean = 0;
        const x = ex + (m.x < 800 ? 1 : -1) * plot * (m.front ? 30 : 16);
        if (m.k === 'hp') { armF = 20 + plot * 50 * (1 - stop) + stop * 60; armB = 10 + stop * 140; head = plot * 8 * (1 - stop) - stop * 4; lean = plot * 6 * (1 - stop); }
        if (m.k === 'pr1') { armF = 20 + plot * 55 + bump(t, 2.3, 2.95) * 30; head = plot * 10; lean = plot * 8; }
        if (m.k === 'sc0') { armF = 10 + plot * 30 + bump(t, 1.4, 2.0) * 30; armB = plot * 20; head = plot * 6; lean = plot * 5; }
        if (m.k === 'sc1') { armF = 14 + plot * 60 * (1 - stop * 0.6); head = plot * 8 - stop * 6; lean = plot * 6; }
        const flip = arrived > 0.5 ? m.flip : true;
        const o = seg(t, m.enter - 0.6, m.enter - 0.5);
        m.p.set({ x, y: m.y, s: m.s, flip, o, walk: walking ? x * 0.05 : undefined, armF, armB, head, lean, blink: blinkAt(T, m.seed) });
        const dx = (x - 800) * 0.55;
        m.sh.set({ x: x + dx, y: 700, s: m.s * (1.18 + plot * 0.22), flip, o, armF, armB, head, lean });
      });
      const tk = es(t, 0.55, 0.85, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      vis(caiaphas, { x: 1000, y: 360 - (1 - tk) * 700, r: Math.sin(T * 0.9) * 2, o: tk > 0.01 ? 1 : 0 });
      const [hx, hy] = headAt(505 + plot * 30, FLOOR + 8, 1, false);
      vis(whisper, { x: hx + 26, y: hy - 16, s: wsp, o: wsp > 0.01 ? 1 : 0 });
      const nf = es(t, 2.25, 2.5, ease.back);
      const [px, py] = headAt(905 - plot * 16, FLOOR - 26, 0.98, true);
      vis(noFeast, { x: px - 30, y: py - 20, s: nf, o: nf > 0.01 ? 1 : 0, r: -3 });

      S.cam.x = kf(t, [[-0.5, 100], [0.5, 90], [1.0, 0], [2.0, 0], [2.4, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.5, 1.1], [1.0, 1.14], [1.6, 1.2], [2.1, 1.06]]);
      S.cam.y = kf(t, [[-0.5, 0], [0.5, -10], [1.0, 30], [1.6, 50], [2.1, 0]]);
    };
  },
};
