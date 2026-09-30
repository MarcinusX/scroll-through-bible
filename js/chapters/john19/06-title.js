// J 19,19–22 — the title. At his writing stand Pilate writes, and the words appear on a great whitened board
// hung in the sky, line by line: Hebrew, Latin, Greek; a small copy flies to the top of the middle cross.
// People come out of the nearby city along the road and stop to read it; the three tongues are named one by one.
// The chief priests hurry to Pilate and hold up a grey slip — "He said: I am the King of the Jews" — but Pilate
// raises his hand, the slip falls, and his red seal is pressed on the board: "What I have written, I have written."
import { C, person, crowdPerson, blinkAt, pose, lerp, sheet, shade } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, hand, headAt, pilate, priest, golgothaSet, setCrosses, clearClouds, lightClouds, glory, titleBoard, miniTitle, waxSeal, strip, taunt, crossHead, swing, tr, GOL, J19 } from './lib.js';

const RY = 704;
const BW = 560, BH = 168;

export default {
  id: 'j19-title',
  beats: [
    { v: 19, text: 'Wypisał też Piłat tytuł winy i kazał go umieścić na krzyżu.' },
    { v: 19, cont: true, text: 'A było napisane: «Jezus Nazarejczyk, Król Żydowski».' },
    { v: 20, text: 'Ten napis czytało wielu Żydów, ponieważ miejsce, gdzie ukrzyżowano Jezusa, było blisko miasta.' },
    { v: 20, cont: true, text: 'A było napisane w języku hebrajskim, łacińskim i greckim.' },
    { v: 21, text: 'Arcykapłani żydowscy mówili do Piłata:' },
    { v: 21, cont: true, text: '«Nie pisz: Król Żydowski, ale że On powiedział: Jestem Królem Żydowskim».' },
    { v: 22 },
  ],
  cam: { x: [-60, 60], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    // phone: the board hangs in the middle above the crosses, a little larger; Pilate, the priests and the readers stand closer in
    const ph = S.portrait;
    const PX = ph ? 1050 : 1130, PRX = ph ? 860 : 930, PRD = ph ? 85 : 90;
    const BX = ph ? 800 : 995, BY = ph ? 36 : 140, BS = ph ? 0.74 : 0.6;
    const G = golgothaSet(S, { pal: J19.gold });
    clearClouds(G);
    const gl = G.hangL.add(`<g>${glory(c, 380, 18)}</g>`);
    const [chx, chy] = crossHead(GOL.H);
    const mini = G.onHill.add(`<g>${miniTitle(c, 38)}</g>`);

    /* people from the city, Pilate at his writing stand, the chief priests */
    const P = G.P;
    const readers = [0, 1, 2, 3, 4].map((i) => ({ i, p: S.puppet(P.add(person(c, crowdPerson(c)))), x: (ph ? [490, 545, 600, 655, 710] : [300, 390, 470, 560, 640])[i], d: i * (ph ? 0.03 : 0.12) }));
    const pr = [0, 1].map((i) => S.puppet(P.add(priest(c, i))));
    const stand = P.add(sheet().p(c.cut([[-6, 0], [-4, -96], [4, -96], [6, 0]], 0.3, 5) + c.cut([[-22, 2], [22, 2], [18, -6], [-18, -6]], 0.3, 4), C.wood2).p(c.cut([[-30, -92], [28, -104], [30, -96], [-28, -84]], 0.3, 4), C.wood3).p(c.cut([[-24, -94], [22, -104], [23, -99], [-23, -89]], 0.2, 3), '#fbf6ea').out());
    const pil = S.puppet(P.add(pilate(c)));
    const fx = G.fx;
    const flyer = fx.add(`<g>${miniTitle(c, 38)}</g>`);
    const ask = fx.add(`<g>${taunt(c, tr('Nie pisz: Król Żydowski!', 'Don’t write, “The King of the Jews”!'), { size: 17, side: 1 })}</g>`);

    /* the board in the sky */
    const bL = S.layer({ par: 0.3, sh: 6 });
    const board = bL.add(`<g><path d="M${-BW / 2 + 30} 0V-1200M${BW / 2 - 30} 0V-1200" stroke="rgba(74,54,34,.5)" stroke-width="1.6"/>${titleBoard(c, { w: BW, h: BH })}<g class="seal" opacity="0" transform="translate(${BW / 2 - 34} ${BH - 10})">${waxSeal(c, 26, 'eagle')}</g></g>`);
    const lines = [0, 1, 2].map((i) => board.querySelector(`.l${i}`));
    const seal = board.querySelector('.seal');
    const trans = bL.add(`<g>${strip(c, tr('Jezus Nazarejczyk, Król Żydowski', 'Jesus of Nazareth, the King of the Jews'), { size: 18 })}</g>`);
    const langs = [tr('po hebrajsku', 'Hebrew'), tr('po łacinie', 'Latin'), tr('po grecku', 'Greek')].map((l) => bL.add(`<g>${strip(c, l, { size: 15, fill: C.parchment })}</g>`));
    const slip = S.layer({ par: 0.3, sh: 6 }).add(`<g>${strip(c, tr('On powiedział: Jestem Królem Żydowskim', 'He said, “I am King of the Jews”'), { size: 17, fill: '#b9b5bd' })}</g>`);
    const pen = bL.add(`<g><path d="${c.ribbon([[0, 0], [16, -40]], 2.6)}" fill="${C.ink}"/><path d="${c.poly([[14, -38], [30, -70], [20, -36]])}" fill="${C.linen2}"/></g>`);

    return (t, time) => {
      const T = time;
      G.sk.set(...J19.gold);
      setCrosses(G, 1, 1, 1);
      pose(gl, { x: GOL.x, y: GOL.top - 150, s: 0.85, r: T * 1.2, o: 0.28 });
      fade(G.crossC.querySelector('.hl'), 0.8);

      /* v19a — Pilate writes; the lines appear; a copy flies up to the cross */
      const bk = es(t, -0.2, 0.25);
      const by = BY - (1 - bk) * 600;
      pose(board, { x: BX, y: by + Math.sin(T * 0.6) * 1.5, s: BS, r: Math.sin(T * 0.5) * 0.4 });
      const wr = (i) => es(t, 0.15 + i * 0.22, 0.35 + i * 0.22);
      lines.forEach((l, i) => fade(l, wr(i)));
      const writing = t > 0.1 && t < 0.85;
      const li = Math.min(2, Math.floor(Math.max(0, t - 0.15) / 0.22));
      const lk = Math.min(1, Math.max(0, t - 0.15 - li * 0.22) / 0.22);
      const u = li === 0 ? BW / 2 - 40 - lk * (BW - 80) : -BW / 2 + 40 + lk * (BW - 80);
      pose(pen, { x: BX + u * BS, y: by + (BH / 3) * (li + 0.6) * BS, o: writing ? 1 : 0, r: -10 });
      const fly = es(t, 0.6, 0.95);
      const fx0 = PX - 10, fy0 = RY - 150, tx = GOL.x, ty = GOL.top - GOL.H + 12;
      pose(flyer, { x: lerp(fx0, tx, fly), y: lerp(fy0, ty, fly) - Math.sin(fly * Math.PI) * 160, s: 1 - fly * 0.1, r: (1 - fly) * 20, o: fly > 0 && fly < 1 ? 1 : 0 });
      pose(mini, { x: tx, y: ty, s: 0.9, o: fly >= 1 ? 1 : 0 });
      /* v19b — the words */
      const tk = es(t, 1.1, 1.35) * (1 - es(t, 1.95, 2.1));
      pose(trans, { x: BX, y: by + BH * BS + 26, s: tk, o: tk > 0.02 ? 1 : 0 });
      /* v20b — Hebrew, Latin, Greek */
      langs.forEach((el, i) => {
        const k = es(t, 3.1 + i * 0.22, 3.3 + i * 0.22) * (1 - es(t, 3.95, 4.1));
        pose(el, { x: ph ? 520 : 640, y: by + (BH / 3) * (i + 0.5) * BS, s: k, o: k > 0.02 ? 1 : 0 });
        fade(lines[i], wr(i) * (1 - bump(t, 3.1, 4.0) * 0.5 + (bump(t, 3.1 + i * 0.22, 3.5 + i * 0.22) * 0.5)));
      });

      /* Pilate */
      const writeArm = writing ? 60 + Math.sin(T * 14) * 6 : 30;
      const turnP = t > 4.3;
      const refuse = es(t, 6.05, 6.3);
      pil.set({ x: PX, y: RY, s: 0.84, flip: true, armF: writing ? writeArm : 20 + refuse * 20, armB: 10 + refuse * 150, head: writing ? 8 : turnP ? -2 - refuse * 6 : 0, blink: blinkAt(T, 2) });
      pose(stand, { x: PX - 58, y: RY + 2 });

      /* v20a — people from the nearby city read it */
      readers.forEach((m) => {
        const k = [[2.0 + m.d, [m.x - 480, RY + 8]], [2.6 + m.d, [m.x, RY + 8 - (m.i % 2) * 10]]];
        const [x, y] = kf(t, k);
        const look = es(t, 2.5 + m.d, 2.7 + m.d);
        m.p.set({ x, y, s: 0.6, flip: false, walk: moving(t, k) ? x * 0.07 : undefined, armF: 20 + look * 50 * (m.i % 2), armB: 10, head: -look * 14, blink: blinkAt(T, m.i), o: es(t, 2.0 + m.d, 2.15 + m.d) });
      });

      /* v21 — the chief priests hurry to Pilate */
      const prK = (i) => [[4.0 + i * 0.1, [150 - i * 80, RY + 6]], [4.8 + i * 0.1, [PRX - i * PRD, RY + 6]]];
      pr.forEach((p, i) => {
        const k = prK(i), [x, y] = kf(t, k);
        const hold = es(t, 5.05, 5.3) * (1 - es(t, 6.2, 6.4));
        p.set({ x, y, s: 0.82, walk: moving(t, k) ? x * 0.06 : undefined, armF: 30 + (i === 0 ? hold * 110 : bump(t, 4.8, 5.8) * 60), armB: 10 + hold * 60, head: -hold * 8, blink: blinkAt(T, 5 + i), o: es(t, 4.0, 4.2) });
      });
      const ak = es(t, 4.85, 5.05, ease.back) * (1 - es(t, 5.4, 5.6));
      const [qx, qy] = headAt(PRX, RY + 6, 0.82, false);
      pose(ask, { x: qx + 14, y: qy - 6, s: ak, o: ak > 0.02 ? 1 : 0 });
      const up = es(t, 5.1, 5.5);
      const drop = es(t, 6.1, 6.6, ease.in);
      const [sx0, sy0] = hand(PRX, RY + 6, 0.82, false, 140);
      pose(slip, { x: lerp(sx0 + 40, BX, up), y: lerp(sy0 - 10, by + (BH / 3) * 1.5 * BS + 16, up) + drop * 520, r: lerp(-8, -3, up) + drop * 40, s: lerp(0.7, 0.9, up), o: up > 0.01 ? 1 - es(t, 6.45, 6.7) : 0 });
      /* v22 — "What I have written, I have written": the seal */
      const st = es(t, 6.3, 6.5, ease.back);
      pose(seal, { x: BW / 2 - 34, y: BH - 10, s: 1.5 - st * 0.5, o: st > 0.01 ? 1 : 0 });

      S.cam.x = ph ? 0 : es(t, 0, 0.3) * 30 * (1 - es(t, 1.9, 2.3)) - es(t, 1.9, 2.4) * 40 * (1 - es(t, 3.9, 4.4)) + es(t, 4.6, 5.2) * 40;
      S.cam.y = -30;
      S.cam.z = 1.02 + es(t, 5.9, 6.4) * 0.04;
    };
  },
};
