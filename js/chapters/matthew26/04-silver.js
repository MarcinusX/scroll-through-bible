// Mt 26,14–16 — night in the same chamber. Judas Iscariot comes in through the door to the chief priests. "What will
// you give me?" — a thought of coins, and his hand held out. They weigh out thirty pieces of silver: a small balance on
// the table, coins falling one by one into its pan until it sinks, the number on a tag. Judas sweeps them into his
// purse; from then on he stands at the window watching the Master far off in the streets, his shadow long on the wall.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  chamber, table, priest, priestOpts, highPriest, HP, scribe, scribeOpts, shadowPerson, hangingLamp, lampGlow, TW, kf, moving, hand, headAt,
  withFace, faceBits, purse, silver, silverStack, balance, thought, GLYPH, wordTag, nameTag, vignette, tr, vis, PI,
} from './lib.js';

const BX = 800;           // the balance on the table

export default {
  id: 'mt26-silver',
  beats: [
    { v: 14 },
    { v: 15, text: 'i rzekł: «Co chcecie mi dać, a ja wam Go wydam».' },
    { v: 15, cont: true, text: 'A oni wyznaczyli mu trzydzieści srebrników.' },
    { v: 16 },
  ],
  cam: { x: [-60, 160], y: [-40, 140], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const R = chamber(S, { skyCols: ['#232a5a', '#3a3f70', '#5d5a86'] });
    const { FLOOR } = R;
    const TOP = FLOOR - 100;

    // the Master far off in the streets (through the window): a tiny halo among a few friends
    const farL = S.layer({ par: 0.17, sh: 1 });
    const group = farL.add(`<g><circle cx="0" cy="-26" r="30" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.circ(0, -22, 5, 10), 0.2, 2), C.halo).p(c.cut([[-4, 0], [-3, -16], [3, -16], [4, 0]], 0.2, 3), C.linen).out()}${[-14, -24, 12, 22, -32].map((x, i) => `<path d="${c.cut([[x - 3.4, 0], [x - 2.6, -13], [x + 2.6, -13], [x + 3.4, 0]], 0.2, 3) + c.cut(c.circ(x, -16, 3, 8), 0.2, 2)}" fill="${mix([C.dustyBlue, C.wheatRobe, C.mauve, C.sageRobe, C.tealRobe][i], C.indigo, 0.3)}"/>`).join('')}</g>`);

    const SH = '#2a2034';
    const cast = [
      { k: 'pr1', o: priestOpts(1), m: () => priest(c, 1), x: 650, y: FLOOR - 26, s: 0.94, flip: false },
      { k: 'hp', o: HP, m: () => highPriest(c), x: 900, y: FLOOR - 26, s: 0.98, flip: true },
      { k: 'sc0', o: scribeOpts(0), m: () => scribe(c, 0), x: 520, y: FLOOR + 8, s: 1.0, flip: false, front: true },
    ];
    cast.forEach((m) => {
      m.seed = c.rr(0, 9);
      m.sh = S.puppet(R.shadows.add(`<g clip-path="url(#${R.clipId})" opacity=".16">${shadowPerson(c, m.o, SH)}</g>`).firstElementChild);
    });
    const jSh = S.puppet(R.shadows.add(`<g clip-path="url(#${R.clipId})" opacity=".22">${shadowPerson(c, TW.judas, SH)}</g>`).firstElementChild);
    const lampL = S.layer({ par: 0.44, sh: 3 });
    const lampGl = lampL.add(lampGlow(800, 300));
    const lampEl = hanging(lampL, `<g transform="translate(-6 0)">${hangingLamp(c)}</g>`, { x: 800, y: 300, len: 100 });
    const lampFl = lampEl.querySelector('.flame');

    const back = S.layer({ par: 0.5, sh: 5 });
    cast.filter((m) => !m.front).forEach((m) => { m.p = S.puppet(back.add(m.m())); });
    const tabL = S.layer({ par: 0.52, sh: 6 });
    tabL.add(`<g transform="translate(790 ${FLOOR})">${table(c, 330, 100)}</g>`);
    // the balance: post, beam (turns), two pans (hang from the beam's ends)
    const B = balance(c, { arm: 180, h: 330, drop: 110 });
    const BS = 0.36, PIV = TOP - 330 * BS;
    tabL.add(`<g transform="translate(${BX} ${PIV}) scale(${BS})">${B.post}</g>`);
    const beam = tabL.add(`<g>${B.beam}</g>`);
    const panL = tabL.add(`<g>${B.pan}<g transform="translate(0 ${B.drop - 2})">${sheet().p(c.cut(c.blob(0, -14, 26, 16, 10, 0.2), 0.4, 4), C.rock2).out()}</g></g>`);
    const panR = tabL.add(`<g>${B.pan}</g>`);
    const pile = tabL.add(`<g>${[-24, 0, 24].map((x) => `<g transform="translate(${x} 0)">${silverStack(c, 10, 11)}</g>`).join('')}</g>`);
    const front = S.layer({ par: 0.56, sh: 5 });
    cast.filter((m) => m.front).forEach((m) => { m.p = S.puppet(front.add(m.m())); });
    const jEl = front.add(withFace(person(c, TW.judas), faceBits(c)));
    const judas = S.puppet(jEl);
    const jBrow = jEl.querySelector('[data-part="angry"]');

    const fx = S.layer({ par: 0.58, sh: 4 });
    const ask = fx.add(`<g>${thought(c, `<g transform="translate(-12 8)"><circle r="12" fill="url(#halo-glow)"/>${silver(c, 7)}</g><g transform="translate(4 -2)">${silver(c, 7)}</g><g transform="translate(22 4) scale(.9)">${GLYPH.q(c)}</g>`, { w: 90, h: 62 })}</g>`);
    const coins = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(`<g>${silver(c, 8)}</g>`) }));
    const thirty = hanging(fx, wordTag(c, tr('trzydzieści srebrników', 'thirty pieces of silver'), { size: 20 }), { x: 0, y: -1500, len: 700 });
    const purseEl = fx.add(`<g>${purse(c)}</g>`);
    S.layer({ par: 0.6, sh: 0, flat: true }).add(vignette(S, { cx: 800, cy: 500, r: 700, o: 0.38 }));

    return (t, time) => {
      const T = time;
      R.stars.fade(0.9);
      R.crowd.fade(0.4);
      R.dim.fade(1);
      swing(lampEl, 800, 300, T, 1, 0.8);
      pose(lampFl, { x: 32, y: 36, sx: 1 + Math.sin(T * 7) * 0.08, sy: 1 + Math.sin(T * 5.3) * 0.12 });
      fade(lampGl, 0.75 - es(t, 3.0, 3.6) * 0.2);

      /* v14 — Judas comes in through the door, to the chief priests; v16 — to the window */
      const jK = [[-0.3, [1340, FLOOR + 8]], [0.7, [1030, FLOOR + 8]], [3.05, [1030, FLOOR + 8]], [3.55, [960, FLOOR + 8]]];
      const [jx, jy] = kf(t, jK);
      const jw = moving(t, jK, 1);
      const askK = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const take = es(t, 2.75, 2.95);
      const toWin = es(t, 3.05, 3.1);
      const peer = es(t, 3.5, 3.8);
      const jArm = 20 + bump(t, 0.7, 1.0) * 20 + askK * 60 + take * 40 * (1 - toWin) + toWin * 34;
      judas.set({ x: jx, y: jy, s: 1.0, flip: toWin < 0.5, walk: jw ? jx * 0.05 : undefined, armF: jArm, armB: 10 + askK * 30, head: askK * -6 + bump(t, 2.1, 2.7) * 12 - peer * 14, lean: askK * 6 + bump(t, 2.1, 2.7) * 6, blink: blinkAt(T, 2) });
      fade(jBrow, es(t, 3.2, 3.6));
      jSh.set({ x: jx + (jx - 800) * 0.6, y: 700, s: 1.2 + peer * 0.35, flip: toWin < 0.5, armF: jArm, head: -peer * 14 });

      /* the priests: listen, glad; the high priest counts out the silver */
      const glad = es(t, 1.4, 1.7) * (1 - es(t, 3.1, 3.4));
      const count = es(t, 2.05, 2.15) * (1 - es(t, 2.7, 2.8));
      const gone = es(t, 3.1, 3.5);
      cast.forEach((m) => {
        let armF = 14 + es(t, 0.6, 0.9) * 10, armB = 6, head = -es(t, 0.5, 0.9) * 4;
        if (m.k === 'hp') { armF = 20 + glad * 30 * (1 - count) + count * (70 + Math.sin(t * PI * 20) * 12); armB = 10 + glad * 40; head = -glad * 6 + count * 14; }
        else { armF += glad * 50; armB += glad * (m.k === 'sc0' ? 120 : 80); head -= glad * 10; }
        const flip = gone > 0.5 ? m.k === 'hp' : m.flip;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip, armF: armF * (1 - gone) + gone * 30, armB: armB * (1 - gone), head: head * (1 - gone) + gone * 6, blink: blinkAt(T, m.seed) });
        m.sh.set({ x: m.x + (m.x - 800) * 0.55, y: 700, s: m.s * 1.2, flip, armF, armB, head });
      });
      const [ax, ay] = headAt(jx, jy, 1.0, true);
      const ak = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(ask, { x: ax - 70, y: ay - 30, s: ak, o: ak > 0.01 ? 1 : 0 });

      /* v15b — thirty pieces of silver weighed out */
      const fill = seg(t, 2.1, 2.7);
      const tilt = -10 + fill * 18;           // the stone side is heavier at first; the silver side sinks
      const r = (tilt * PI) / 180, arm = 180 * BS;
      pose(beam, { x: BX, y: PIV, s: BS, r: tilt });
      const lx = BX - Math.cos(r) * arm, ly = PIV - Math.sin(r) * arm, rx = BX + Math.cos(r) * arm, ry = PIV + Math.sin(r) * arm;
      pose(panL, { x: lx, y: ly, s: BS });
      pose(panR, { x: rx, y: ry, s: BS });
      const pileK = Math.min(1, fill * 1.1);
      vis(pile, { x: rx, y: ry + (B.drop - 2) * BS, s: BS, sy: BS * Math.max(0.05, pileK), o: take < 0.5 && fill > 0 ? 1 : 0 });
      const [hpx, hpy] = hand(900, FLOOR - 26, 0.98, true, 75);
      coins.forEach((k) => {
        const u = seg(t, 2.1 + k.i * 0.055, 2.22 + k.i * 0.055);
        vis(k.el, { x: lerp(hpx, rx + (k.i % 3 - 1) * 6, u), y: lerp(hpy, ry + (B.drop - 10) * BS, u) - Math.sin(u * PI) * 20, r: u * 180, s: 0.9, o: u > 0 && u < 1 ? 1 : 0 });
      });
      const tk = es(t, 2.35, 2.6, ease.out) * (1 - es(t, 3.0, 3.2, ease.in));
      vis(thirty, { x: BX, y: 330 - (1 - tk) * 700, r: Math.sin(T * 0.9) * 2, o: tk > 0.01 ? 1 : 0 });
      // the purse: Judas sweeps it up
      const [jhx, jhy] = hand(jx, jy, 1.0, toWin < 0.5, jArm);
      const pk = es(t, 2.7, 2.85);
      vis(purseEl, { x: lerp(rx, jhx, es(t, 2.8, 2.95)), y: lerp(ry + 10, jhy, es(t, 2.8, 2.95)) - 4, s: pk, r: Math.sin(T * 2) * 4, o: pk > 0.01 ? 1 : 0 });

      /* v16 — far off, the Master walks with His friends; Judas watches for his chance */
      const walkK = seg(t, 3.1, 4.0);
      vis(group, { x: lerp(660, 900, walkK), y: 548, s: 1.4, o: es(t, 3.1, 3.3) });

      S.cam.x = kf(t, [[-0.5, 120], [0.7, 110], [1.1, 90], [2.0, 20], [2.8, 20], [3.1, 60], [3.6, 110]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.8, 1.14], [1.1, 1.24], [2.0, 1.46], [2.8, 1.46], [3.1, 1.2], [3.6, 1.3]]);
      S.cam.y = kf(t, [[-0.5, 30], [1.1, 70], [2.0, 120], [2.8, 120], [3.1, 60], [3.6, 40]]);
    };
  },
};
