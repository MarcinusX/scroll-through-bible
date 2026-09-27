// J 9,13–17 — Act two: the hall. The door opens and two neighbours bring him in, before the Pharisees on their
// stone bench. It was the Sabbath: a tag with two candles comes down beside a card of the clay. "How did you
// come to see?" — "He put clay on my eyes, I washed, and I see" (three little pictures). Some of them: "Not
// from God — he does not keep the Sabbath" (the candles, the clay crossed out). Others: "How can a sinner do such
// signs?" (a gold sign-seal with an open eye, and a question). And the bench itself splits in two, the halves
// drawing apart. "What do you say about Him?" — "He is a prophet": a plate with a prophet's face comes down.
import { C, person, CAST, blinkAt, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  hallSet, H, SEER, manPuppet, facePuppet, neighbour, officials, offSet, iconBubble, say, sabbathTag, storyTile, clayLump, clayEye, poolIcon, eyeIcon,
  threeTiles, twoCandles, signSeal, crack, crossX, qmark, medallion, prophetIcon, hungPlate, iconWord, hanging, drop, kf, moving, headAt, vis, tr, pose, mix, PI, DY,
} from './lib.js';
import { pose as pose0 } from '../../core/anim.js';

const MX = H.MANX;

export default {
  id: 'j9-sabbath',
  beats: [
    { v: 13 },
    { v: 14 },
    { v: 15, text: 'I znów faryzeusze pytali go o to, w jaki sposób przejrzał.' },
    { v: 15, cont: true, text: 'Powiedział do nich: «Położył mi błoto na oczy, obmyłem się i widzę».' },
    { v: 16, text: 'Niektórzy więc spośród faryzeuszów rzekli: «Człowiek ten nie jest od Boga, bo nie zachowuje szabatu».' },
    { v: 16, cont: true, text: 'Inni powiedzieli: «Ale w jaki sposób człowiek grzeszny może czynić takie znaki?»' },
    { v: 16, cont: true, text: 'I powstało wśród nich rozdwojenie.' },
    { v: 17, text: 'Ponownie więc zwrócili się do niewidomego: «A ty, co o Nim myślisz w związku z tym, że ci otworzył oczy?»' },
    { v: 17, cont: true, text: 'Odpowiedział: «To prorok».' },
  ],
  cam: { x: [-40, 200], y: [-80, 40], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    const hall = hallSet(S);
    const offL = S.layer({ par: 0.46, sh: 5 });
    const offs = officials(S, offL);
    const act = S.layer({ par: 0.5, sh: 5 });
    const nb = [0, 1].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, neighbour(c, i, { robe: [C.dustyBlue, C.lavender][i], mantle: null, veil: C.blushVeil })))) }));
    const man = manPuppet(S, act, SEER, {});

    /* words and pictures */
    const fx = S.layer({ par: 0.52, sh: 5 });
    const X = `<g transform="scale(.8)">${crossX(c, 26)}</g>`;
    const askHow = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-16 0)">${eyeIcon(c, { r: 18 })}</g><g transform="translate(30 2)">${qmark(c, C.terracotta, 1.3)}</g>`, { w: 120, h: 76, side: -1 })}</g>`);
    const told = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="scale(.62)">${threeTiles(c)}</g>`, { w: 210, h: 84, side: 1 })}</g>`);
    const noSab = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-30 22)">${twoCandles(c, 0.46)}</g><g transform="translate(34 10)">${clayLump(c, 16)}</g><g transform="translate(34 2)">${X}</g>`, { w: 150, h: 96, side: -1 })}</g>`);
    const howSin = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-22 0) scale(.8)">${signSeal(c, eyeIcon(c, { r: 16 }), 26)}</g><g transform="translate(40 2)">${qmark(c, C.terracotta, 1.3)}</g>`, { w: 150, h: 100, side: -1 })}</g>`);
    const what = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-18 0)"><circle r="26" fill="${C.halo}" opacity=".7"/>${medallion(c, CAST.jesus, { r: 20 })}</g><g transform="translate(30 2)">${qmark(c, C.terracotta, 1.3)}</g>`, { w: 120, h: 76, side: -1 })}</g>`);

    const crk = offL.add(`<g>${crack(c, 250)}</g>`);
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const sab = hanging(hangL, sabbathTag(c, tr('szabat', 'Sabbath')), { x: 0, y: 0, len: 900 });
    const clayCard = hanging(hangL, storyTile(c, `<g transform="translate(-22 10)">${clayLump(c, 18)}</g><g transform="translate(22 -2)">${eyeIcon(c, { r: 16 })}</g>`, { w: 110 }), { x: 0, y: 0, len: 900 });
    const prophet = hanging(hangL, hungPlate(c, iconWord(prophetIcon(c), tr('prorok', 'a prophet'), { y: 42 }), { r: 64 }), { x: 0, y: 0, len: 900 });

    hall.front();

    return (t, time) => {
      const T = time;
      /* v13 — the door opens, they bring him in; it closes behind them */
      const open = es(t, -0.1, 0.2) * (1 - es(t, 0.8, 1.0));
      hall.door(open, 0);
      const inK = es(t, 0.08, 0.75, ease.out);
      const walkIn = inK > 0.01 && inK < 0.99;
      const mx = lerp(H.DOORX + 50, MX, inK), my = lerp(H.BASE - 2, H.FLOOR + 8, inK), ms = lerp(0.8, 1.02, inK);
      const tell = bump(t, 3.05, 3.95), proph = es(t, 8.1, 8.4);
      man.p.set({ x: mx, y: my, s: ms, o: seg(t, 0.06, 0.14), walk: walkIn ? mx * 0.07 : undefined, armF: 20 + tell * 60 + proph * 50, armB: 14 + tell * 30 + proph * 30, head: -proph * 10, blink: blinkAt(T, 3) });
      fade(man.angry, 0);
      nb.forEach((n) => {
        const k = es(t, 0.02 + n.i * 0.08, 0.6 + n.i * 0.08, ease.out);
        const back = es(t, 0.75, 1.1);
        const x = lerp(H.DOORX + 40 - n.i * 10, MX - 110 - n.i * 60, k) - back * 40;
        const y = lerp(H.BASE - 2, H.FLOOR + 4 - n.i * 8, k), s = lerp(0.8, 0.96 - n.i * 0.03, k);
        n.p.set({ x, y, s, o: seg(t, 0.02 + n.i * 0.08, 0.1 + n.i * 0.08), walk: k > 0.01 && k < 0.99 || (back > 0 && back < 1) ? x * 0.07 : undefined, armF: 20 + (n.i === 0 ? 50 * bump(t, 0.2, 0.9) : 0), head: 4, blink: blinkAt(T, n.seed) });
      });

      /* the officials: take note (v14), ask (v15a), argue (v16), split (v16c), ask again (v17a) */
      const split = es(t, 6.1, 6.5);
      hall.split(split);
      pose(crk, { x: H.SPLIT, y: 520, sy: Math.max(0.01, es(t, 6.05, 6.4)), o: t > 6.05 ? 1 : 0 });
      const [mhx, mhy] = headAt(MX, H.FLOOR + 8, 1.02, false);
      offs.forEach((o) => {
        const dir = o.side ? 1 : -1;
        const dx = dir * split * (26 + (o.pose === 'stand' ? 14 : 0));
        const ask = bump(t, 2.05, 2.95) * (o.i === 0 ? 1 : 0.4);
        const say0 = o.side === 0 ? bump(t, 4.05, 4.95) : 0;
        const say1 = o.side === 1 ? bump(t, 5.05, 5.95) : 0;
        const turnAway = bump(t, 6.1, 6.98);
        const again = bump(t, 7.05, 7.95);
        const flip = turnAway > 0.3 ? o.side === 1 ? false : true : true;
        const faceEachOther = (say0 || say1) ? (o.side === 0 ? false : true) : true;
        offSet(o, T, {
          x: o.x + dx, flip: turnAway > 0.3 ? !flip : faceEachOther && t > 4 && t < 6 ? faceEachOther : flip,
          armF: 18 + ask * 50 + say0 * 70 + say1 * 60 + again * (o.i === 0 ? 70 : 20) + (o.i === 2 ? bump(t, 1.1, 1.9) * 40 : 0),
          armB: 8 + say0 * 40 + (o.i === 3 ? say1 * 120 : 0), head: -ask * 4 + turnAway * 8 - again * 4,
          lean: ask * 4 + again * 5, angry: Math.max(es(t, 1.2, 1.6) * 0.6 * (o.side ? 0.3 : 1), say0, split * 0.8), sad: say1 * 0.6,
        });
      });

      /* v14 — the Sabbath tag, and the card of the clay */
      const sk = es(t, 1.1, 1.45, ease.out) * (1 - es(t, 1.95, 2.25, ease.in));
      drop(sab, 820, 240, sk, T, { amp: 1.1 });
      drop(clayCard, 1010, 196, es(t, 1.2, 1.55, ease.out) * (1 - es(t, 1.95, 2.25, ease.in)), T, { amp: 1, seed: 1 });

      /* bubbles */
      const B = (el, a, b, x, y) => { const k = es(t, a, a + 0.2, ease.back) * (1 - es(t, b - 0.08, b)); vis(el, { x, y, s: k, o: k > 0.01 ? 1 : 0 }); };
      const [o0x, o0y] = headAt(1180, H.FLOOR + 4, 1, true);
      const [o4x, o4y] = headAt(880 - 40 * split, H.FLOOR + 10, 1, true);
      const [o2x, o2y] = headAt(1050, H.SEAT + 12, 0.98, true, DY.sit);
      B(askHow, 2.12, 3.0, o0x - 16, o0y - 26);
      B(told, 3.12, 4.0, mhx + 18, mhy - 28);
      B(noSab, 4.12, 5.0, o4x - 16, o4y - 28);
      B(howSin, 5.12, 6.0, o2x - 10, o2y - 24);
      B(what, 7.12, 8.0, o0x - 16, o0y - 26);

      /* v17b — "He is a prophet" */
      drop(prophet, MX + 20, 250, es(t, 8.12, 8.45, ease.out), T, { amp: 1.2 });

      S.cam.x = kf(t, [[0, -20], [0.9, 40], [1.9, 120], [2.1, 160], [3, 60], [3.3, 40], [4, 160], [6.1, 180], [7, 180], [7.3, 140], [8.1, 60], [9, 40]]);
      S.cam.y = kf(t, [[0, 0], [1, -40], [2, -40], [2.2, 0], [7, 0], [8.1, -60], [9, -60]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.04], [2.2, 1.12], [4, 1.14], [6.1, 1.08], [7, 1.12], [8.1, 1.04], [9, 1.04]]);
    };
  },
};
