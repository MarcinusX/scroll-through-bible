// Mt 20,13–15 — the householder comes round the table to the loudest of the first and lays a hand on his shoulder:
// "Friend, I am doing you no wrong." A round picture is let down: the dawn, the two of them shaking hands under the
// silver coin — "didn't you agree with me for a denarius?" "Take what is yours and go": the man closes his fist on his
// coin and turns away. "I want to give to this last one as much as to you": he turns to the poorest of the last hour and
// puts his hand on him; the old man's coin shines. "Isn't it lawful for me to do what I want with what is mine?" — arms
// open towards his vineyard, glowing in the last light. "Or is your eye evil because I am good?" The grumbler looks
// back over his shoulder, and above him a dark, narrowed eye comes down; on the householder's breast a warm heart glows.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vineWorld, VW, SKY, OWNER, STEWARD, FIRST, LAST, PAY, PAID, qSpot, worker, payTable, silver, sparkle, discPlate, pose3, denarius, evilEye, heartGlow, face, handAt, headAt, hangAt, say, tr, bush, rock, sheet, mix, PI } from './lib.js';

const OX = 782;                 // where the householder stands, behind the table's end
const GX = 850;                 // the grumbler

export default {
  id: 'mt20-friend',
  parable: true,
  beats: [
    { v: 13, text: 'Na to odrzekł jednemu z nich: "Przyjacielu, nie czynię ci krzywdy;' },
    { v: 13, cont: true, text: 'czy nie o denara umówiłeś się ze mną?' },
    { v: 14, text: 'Weź, co twoje i odejdź!' },
    { v: 14, cont: true, text: 'Chcę też i temu ostatniemu dać tak samo jak tobie.' },
    { v: 15, text: 'Czy mi nie wolno uczynić ze swoim, co chcę?' },
    { v: 15, cont: true, text: 'Czy na to złym okiem patrzysz, że ja jestem dobry?"' },
  ],
  cam: { x: [-110, 60], y: [0, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const W = vineWorld(S, { sky: SKY.evening, sky2: SKY.dusk, tags: [] });
    const glowL = S.layer({ par: 0.42, sh: 1, flat: true });
    const vGlow = glowL.add(`<g><ellipse cx="0" cy="0" rx="420" ry="170" fill="url(#warm-glow)"/></g>`);
    W.front({ fg: false });

    const Q = S.layer({ par: 0.6, sh: 5 });
    const paid = LAST.map((o, i) => { const el = Q.add(worker(c, o, '')); return { i, el, p: S.puppet(el), seed: c.rr(0, 9) }; });
    const owner = S.puppet(Q.add(person(c, OWNER)));
    Q.add(`<g transform="translate(${PAY.TABLE - 40} ${PAY.QY + 8})">${payTable(c)}</g>`);
    const first = FIRST.map((o, k) => ({ o, k })).reverse().map(({ o, k }) => { const el = Q.add(worker(c, o, '')); return { k, el, p: S.puppet(el), seed: c.rr(0, 9) }; });
    const g0 = first.find((m) => m.k === 0);

    const fx = S.layer({ par: 0.6, sh: 6 });
    const paidCoins = paid.map(() => fx.add(`<g>${silver(c, 10)}</g>`));
    const gCoin = fx.add(`<g>${silver(c, 10)}</g>`);
    const shine = fx.add(`<g>${sparkle(c, 18)}</g>`);
    const heart = fx.add(`<g>${heartGlow(c, 16)}</g>`);
    const B = [
      say(c, tr(['Przyjacielu,', 'nie czynię ci krzywdy.'], ['Friend,', 'I am doing you no wrong.']), { size: 19, side: 1 }),
      say(c, tr(['Czy nie o denara', 'umówiłeś się ze mną?'], ['Didn’t you agree with me', 'for a denarius?']), { size: 19, side: 1 }),
      say(c, tr(['Weź, co twoje,', 'i odejdź!'], ['Take what is yours,', 'and go your way.']), { size: 19, side: 1 }),
      say(c, tr(['Chcę temu ostatniemu', 'dać tak samo jak tobie.'], ['I want to give to this last', 'just as much as to you.']), { size: 19, side: -1 }),
      say(c, tr(['Czy mi nie wolno uczynić', 'ze swoim, co chcę?'], ['Isn’t it lawful for me to do', 'what I want with what I own?']), { size: 19, side: 1 }),
      say(c, tr(['Czy złym okiem patrzysz,', 'że ja jestem dobry?'], ['Is your eye evil,', 'because I am good?']), { size: 19, side: 1 }),
    ].map((m) => fx.add(`<g>${m}</g>`));

    // the memory of the dawn: the handshake under the coin
    const pid = S.id('dawnclip');
    const pc = S.c;
    const memory = `<defs><clipPath id="${pid}"><circle r="84"/></clipPath></defs><g clip-path="url(#${pid})"><rect x="-90" y="-90" width="180" height="180" fill="#f2cdb2"/><circle cx="-40" cy="10" r="16" fill="${C.sun}"/><path d="${pc.ridge(pc.wave(18, [4, 2], [120, 50]), -100, 100, 100, 8, 0.5)}" fill="${C.hillMid}"/><path d="${pc.ridge(pc.wave(50, [2, 1], [90, 40]), -100, 100, 100, 8, 0.5)}" fill="${mix(C.sand, C.sage2, 0.35)}"/>
      ${pose3(pc, [{ x: -24, y: 76, s: 0.4, flip: false, armF: 62, o: OWNER }, { x: 26, y: 76, s: 0.4, flip: true, armF: 62, o: FIRST[0] }])}
      <g transform="translate(0 -46) scale(.28)">${denarius(pc, 70)}</g></g>`;
    const plate = fx.add(`<g><path d="M0 -92V-1400" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${discPlate(c, memory, { r: 90 })}</g>`);
    const eyeEl = fx.add(`<g><path d="M0 -70V-1400" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${evilEye(c, 52)}</g>`);
    const lid = eyeEl.querySelector('.lid'), brow = eyeEl.querySelector('.brow');
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 150, 1010, 230, C.sage, C.moss) + rock(c, 1470, 1000, 220, 70, C.rock2));

    return (t, time) => {
      const T = time;
      W.update(t, T, { h: 12.35, drift: 0.4 });
      W.sk2L.fade(0.55 + es(t, 0, 6) * 0.3);

      /* the householder: to the grumbler (0), the coin (1), away with you (2), to the last (3), his own (4), good (5) */
      const OK = [[0.04, PAY.OWN], [0.42, OX]];
      const ox = t < 0.42 ? lerp(PAY.OWN, OX, es(t, 0.04, 0.42, (u) => u)) : OX;
      const walkO = t > 0.04 && t < 0.42;
      const touch = es(t, 0.45, 0.6) * (1 - es(t, 1.9, 2.02));
      const away = es(t, 2.04, 2.2) * (1 - es(t, 2.9, 3.0));
      const toLast = es(t, 3.02, 3.14) * (1 - es(t, 3.9, 4.02));
      const open = es(t, 4.04, 4.25);
      owner.set({
        x: ox, y: PAY.QY - 10, s: 0.98, flip: toLast > 0.5, walk: walkO ? ox * 0.05 : undefined,
        armF: 14 + touch * 66 + away * 90 + toLast * 66 + open * 60, armB: bump(t, 1.05, 1.95) * 40 + open * 110, head: -open * 8 + toLast * 6, blink: blinkAt(T),
      });
      void OK;

      /* the grumbler: listens (0–1), closes his hand and turns away (2), looks back with an evil eye (5) */
      first.forEach((m) => {
        const [qx, qy] = qSpot(m.k);
        let x = qx - 26 + (m.k === 0 ? GX - (PAY.Q0 - 26) : 0), flip = true, armF = 30 - (m.k % 2) * 16, armB = (m.k % 2) * 60, head = 0;
        const angry = 1 - es(t, 0.5, 1.0) * 0.6 + es(t, 5.04, 5.2) * 0.6;
        if (m.k === 0) {
          const turn = es(t, 2.3, 2.36);
          const walkA = es(t, 2.36, 2.8, (u) => u);
          x = lerp(GX, 1000, walkA);
          const yy = qy + walkA * 34;
          flip = turn < 0.5 || t > 5.04;
          armF = 50 * (1 - turn) + 20;
          armB = 0;
          head = t > 5.04 ? -4 : turn * 10;
          m.p.set({ x, y: yy, s: 1 + walkA * 0.04, flip, walk: walkA > 0 && walkA < 1 ? x * 0.06 : undefined, armF, armB, head, blink: blinkAt(T, m.seed) });
          const [hx, hy] = handAt(x, yy, 1 + walkA * 0.04, flip, armF);
          pose(gCoin, { x: hx, y: hy - 6, s: 1 - turn * 0.4, o: 1 });
        } else m.p.set({ x: x + 14, y: qy, s: 1, flip, armF, armB, head: -2, blink: blinkAt(T, m.seed) });
        face(m.el, 'angry', m.k === 0 ? angry : 0.5 + es(t, 5.04, 5.2) * 0.5);
      });

      /* the last: the old man steps up to the householder */
      paid.forEach((m) => {
        let [x, y] = PAID[m.i];
        const up = m.i === 2 ? es(t, 3.04, 3.3) : 0;
        x = lerp(x, OX - 92, up);
        y = lerp(y, PAY.QY - 4, up);
        const lift = m.i === 2 ? es(t, 3.3, 3.45) : 0;
        const armF = 60 + lift * 40;
        m.p.set({ x, y, s: lerp(0.95, 0.98, up), flip: false, walk: up > 0 && up < 1 ? x * 0.06 : undefined, armF, armB: m.i === 1 ? 30 : 10, head: -4 - lift * 8, blink: blinkAt(T, m.seed) });
        const [hx, hy] = handAt(x, y, 0.95, false, armF);
        pose(paidCoins[m.i], { x: hx, y: hy - 6, s: 1 + lift * 0.3 });
        if (m.i === 2) { const g = bump(t, 3.35, 3.95); pose(shine, { x: hx + 8, y: hy - 20, s: 0.5 + g * 0.6, r: T * 30, o: g }); }
      });

      /* the words */
      const [ohx, ohy] = headAt(ox, PAY.QY - 10, 0.98, toLast > 0.5);
      B.forEach((b, i) => {
        const k = es(t, i + 0.06, i + 0.22, ease.back) * (1 - es(t, i + 0.9, i + 1.0));
        const x = i === 3 ? ohx - 30 : i === 5 ? ohx + 40 : ohx + 30;
        pose(b, { x, y: ohy - 52, s: k, o: k > 0.02 ? 1 : 0 });
      });
      const pd = es(t, 1.1, 1.4, ease.back) * (1 - es(t, 1.95, 2.2, ease.in));
      hangAt(plate, 900, lerp(-300, 290, pd), T, 1.2, 0.7);
      pose(vGlow, { x: 1180, y: 600, o: open * (0.9 - es(t, 5, 5.3) * 0.3) });
      const ed = es(t, 5.12, 5.4, ease.back);
      hangAt(eyeEl, 1010, lerp(-300, 360, ed), T, 1.2, 0.7);
      pose(lid, { sy: 0.5 + es(t, 5.3, 5.5) * 0.5, oy: -30 });
      pose(brow, { y: es(t, 5.3, 5.5) * 10 });
      pose(heart, { x: ohx + 4, y: ohy + 70, s: es(t, 5.1, 5.3, ease.back), o: es(t, 5.1, 5.2) });

      S.cam.x = 10 - es(t, 2.9, 3.2) * 110 * (1 - es(t, 3.9, 4.2)) + es(t, 3.9, 4.2) * 40;
      S.cam.z = 1.1 - es(t, 3.9, 4.2) * 0.06;
      S.cam.y = 24;
    };
  },
};
