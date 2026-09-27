// Mk 14,1–2 — two days before the Passover. In a lamp-lit chamber above the crowded city the chief priests
// and scribes bend over a table: a little paper figure of Jesus, a net lowered over it — "but not during the feast".
import { C, person, blinkAt, pose, lerp, curtains, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  chamber, table, priest, priestOpts, highPriest, HP, scribe, scribeOpts, shadowPerson, hangingLamp, lampGlow, pawn, snare, discPlate,
  matzahRound, wordTag, speech, headAt, scrollOpen, lamb, PI,
vis, } from './lib.js';

export default {
  id: 'm14-plot',
  beats: [
    { cover: true },
    { v: 1, text: 'Za dwa dni była Pascha i Święto Przaśników.' },
    { v: 1, cont: true, text: 'Arcykapłani i uczeni w Piśmie szukali sposobu, jak by Jezusa podstępnie ująć i zabić.' },
    { v: 2 },
  ],
  cam: { x: [-40, 40], y: [-60, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const R = chamber(S);
    const { FLOOR } = R;
    const TOP = FLOOR - 100;

    // the priests' shadows on the wall
    const SH = '#2a2034';
    const cast = [
      { k: 'sc0', o: scribeOpts(0), m: () => scribe(c, 0), x: 540, y: FLOOR + 8, s: 1.0, flip: false, front: true },
      { k: 'pr1', o: priestOpts(1), m: () => priest(c, 1), x: 700, y: FLOOR - 26, s: 0.94, flip: false },
      { k: 'hp', o: HP, m: () => highPriest(c), x: 905, y: FLOOR - 26, s: 0.98, flip: true },
      { k: 'sc1', o: scribeOpts(2), m: () => scribe(c, 2), x: 1065, y: FLOOR + 8, s: 1.0, flip: true, front: true },
    ];
    cast.forEach((m, i) => {
      m.i = i; m.seed = c.rr(0, 9);
      m.sh = S.puppet(R.shadows.add(`<g clip-path="url(#${R.clipId})" opacity=".16">${shadowPerson(c, m.o, SH)}</g>`).firstElementChild);
    });

    // hanging lamp over the table
    const lampL = S.layer({ par: 0.44, sh: 3 });
    const lampGl = lampL.add(lampGlow(800, 330));
    const lampEl = hanging(lampL, `<g transform="translate(-6 0)">${hangingLamp(c)}</g>`, { x: 800, y: 330, len: 100 });
    const lampFl = lampEl.querySelector('.flame');

    // the feast, announced: lamb, unleavened bread, "in two days"
    const plL = S.layer({ par: 0.45, sh: 5 });
    const plLamb = hanging(plL, discPlate(c, `<g transform="translate(-4 22) scale(.95)">${lamb(c)}</g>`, { r: 50, rim: C.ochre }), { x: 700, y: 390, len: 500 });
    const plBread = hanging(plL, discPlate(c, matzahRound(c, 30), { r: 50, rim: C.ochre }), { x: 900, y: 390, len: 500 });
    const plDays = hanging(plL, wordTag(c, tr('za dwa dni', 'in two days'), { size: 20 }), { x: 800, y: 300, len: 500 });

    // people behind the table
    const back = S.layer({ par: 0.5, sh: 5 });
    cast.filter((m) => !m.front).forEach((m) => { m.p = S.puppet(back.add(m.m())); });
    const tabL = S.layer({ par: 0.52, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR})">${table(c, 330, 100)}</g>`);
    tabL.add(`<g transform="translate(700 ${TOP - 12}) rotate(-4)">${scrollOpen(c, 80, 40)}</g>`);
    const pawnEl = tabL.add(`<g>${pawn(c)}</g>`);
    const front = S.layer({ par: 0.56, sh: 5 });
    cast.filter((m) => m.front).forEach((m) => { m.p = S.puppet(front.add(m.m())); });

    // the net of their scheming, and the voice of caution
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

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      // dusk deepens across the scene
      R.sky.blend(['#5b5a8c', '#b58a9b', '#e7ae93'], ['#343a6e', '#6d5f8a', '#b88592'], es(t, 0.5, 4));
      R.stars.fade(es(t, 1, 3.5) * 0.9);
      R.crowd.fade(es(t, 2.95, 3.3));
      swing(lampEl, 800, 330, T, 1, 0.8);
      pose(lampFl, { x: 32, y: 36, sx: 1 + Math.sin(T * 7) * 0.08, sy: 1 + Math.sin(T * 5.3) * 0.12 });
      fade(lampGl, 0.75);

      // v1a — the feast is coming: the plates fly in
      const pin = es(t, 0.95, 1.45, ease.out) * (1 - es(t, 1.95, 2.25, ease.in));
      const tin = es(t, 1.1, 1.55, ease.out) * (1 - es(t, 1.95, 2.25, ease.in));
      vis(plLamb, { x: 690, y: 400 - (1 - pin) * 600, r: Math.sin(T * 0.9) * 2, o: pin > 0.01 ? 1 : 0 });
      vis(plBread, { x: 910, y: 400 - (1 - pin) * 600, r: Math.sin(T * 0.9 + 2) * 2, o: pin > 0.01 ? 1 : 0 });
      vis(plDays, { x: 800, y: 312 - (1 - tin) * 600, r: Math.sin(T * 1.1 + 1) * 3, o: tin > 0.01 ? 1 : 0 });

      // v1b — they bend over the table; a net is lowered over the little figure
      const plot = es(t, 2.0, 2.4) * (1 - es(t, 3.6, 3.95) * 0.4);
      const netK = es(t, 2.3, 2.75, ease.out) * (1 - es(t, 3.25, 3.7));
      vis(pawnEl, { x: 800, y: TOP + 1, s: 1, o: es(t, 1.9, 2.1) });
      vis(net, { x: 800, y: lerp(120, TOP - 78, netK), s: 1, r: Math.sin(T * 1.3) * 2 * netK, o: netK > 0.01 ? 1 : 0 });
      const wsp = es(t, 2.45, 2.65, ease.back) * (1 - es(t, 2.9, 3.0));

      // v2 — "not during the feast": the high priest raises his hand; the crowd fills the streets
      const stop = es(t, 3.1, 3.35);
      cast.forEach((m) => {
        const look = es(t, 1.0, 1.3) * (1 - es(t, 1.9, 2.2));
        let armF = 12, armB = 6, head = -look * 12, lean = 0;
        const x = m.x + (m.x < 800 ? 1 : -1) * plot * (m.front ? 30 : 16);
        if (m.k === 'hp') { armF = 20 + plot * 50 * (1 - stop) + stop * 60; armB = 10 + stop * 140; head = head + plot * 8 * (1 - stop) - stop * 4 + Math.sin(T * 4) * 3 * bump(t, 3.2, 3.9); lean = plot * 6 * (1 - stop); }
        if (m.k === 'pr1') { armF = 20 + plot * 55 + bump(t, 3.3, 3.95) * 30; head = head + plot * 10; lean = plot * 8; }
        if (m.k === 'sc0') { armF = 10 + plot * 30 + bump(t, 2.4, 3.0) * 30; armB = plot * 20; head = head + plot * 6; lean = plot * 5; }
        if (m.k === 'sc1') { armF = 14 + plot * 60 * (1 - stop * 0.6); head = head + plot * 8 + stop * -6; lean = plot * 6; }
        const blink = blinkAt(T, m.seed);
        m.p.set({ x, y: m.y, s: m.s, flip: m.flip, armF, armB, head, lean, blink });
        // the shadow on the wall: larger, thrown away from the lamp
        const dx = (x - 800) * 0.55;
        m.sh.set({ x: x + dx, y: 700, s: m.s * (1.18 + plot * 0.22), flip: m.flip, armF, armB, head, lean });
      });
      const [hx, hy] = headAt(505 + plot * 30, FLOOR + 8, 1, false);
      vis(whisper, { x: hx + 26, y: hy - 16, s: wsp, o: wsp > 0.01 ? 1 : 0 });
      const nf = es(t, 3.25, 3.5, ease.back);
      const [px, py] = headAt(905 - plot * 16, FLOOR - 26, 0.98, true);
      vis(noFeast, { x: px - 30, y: py - 20, s: nf, o: nf > 0.01 ? 1 : 0, r: -3 });

      S.cam.z = 1 + es(t, 0.6, 1.4) * 0.04 + es(t, 1.9, 2.5) * 0.1 - es(t, 2.95, 3.4) * 0.08;
      S.cam.y = es(t, 0.6, 1.4) * -20 + es(t, 1.9, 2.5) * 50 - es(t, 2.95, 3.4) * 40;
    };
  },
};
