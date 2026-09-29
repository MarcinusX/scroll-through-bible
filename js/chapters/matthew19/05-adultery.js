// Mt 19,9–10 — "And I say to you…" Two small cards come down on strings, each a couple of paper dolls under a golden
// ring. On the first, the husband lets go of his wife and turns to another: the ring cracks, she weeps. On the
// second, a man takes the wife who was sent away: that ring cracks too. The disciples are dismayed — "if that is
// how it is, it is better not to marry!" — and Peter throws up his hands.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix, hanging, swing } from '../kit.js';
import { olive, house, bush, rock } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { roadSet, pharisee, TWELVE, doll, ring, say, bang, throng, headAt, withFace, faceBits, face, stoneHeart, tr } from './lib.js';

const GY = 668;
const JX = 780;

export default {
  id: 'mt19-adultery',
  beats: [
    { v: 9, text: 'A powiadam wam: Kto oddala swoją żonę - chyba w wypadku nierządu - a bierze inną, popełnia cudzołóstwo.' },
    { v: 9, cont: true, text: 'I kto oddaloną bierze za żonę, popełnia cudzołóstwo».' },
    { v: 10 },
  ],
  cam: { x: [-30, 30], y: [-40, 20], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.11, jerX: 1200, roadX: 780, trees: 18, clouds: [[450, 150, 170], [1100, 110, 130]] });
    const vil = S.layer({ par: 0.28, sh: 3 });
    vil.add(house(c, 1230, 592, 90, 64) + house(c, 1330, 598, 70, 50) + olive(c, 330, 600, 1) + olive(c, 1440, 600, 0.8) + bush(c, 460, 604, 60, C.sage, C.moss));
    const back = S.layer({ par: 0.4, sh: 3 });
    back.sprite(throng(c, 6, { s: 0.5, spread: 34, rows: 1, face: 1, arms: [0, 20] }), 360, 614);

    /* the two cards */
    const cardL = S.layer({ par: 0.3, sh: 4 });
    const W = 236, Hc = 156;
    const makeCard = (x, other) => {
      const faceM = sheet().p(c.cut(c.rect(-W / 2, 0, W, Hc), 0.6, 7), C.cream).p(c.cut(c.rect(-W / 2 + 7, 7, W - 14, Hc - 14), 0.4, 7), mix(C.parchment, C.lavender, 0.18)).out();
      const el = hanging(cardL, `<g>${faceM}</g>`, { x, y: 170, len: 900 });
      const his = cardL.add(`<g>${doll(c, C.dustyBlue, { h: 72 })}</g>`);
      const her = cardL.add(`<g>${doll(c, C.roseRobe, { woman: true, h: 72, skin: C.skin })}</g>`);
      const third = cardL.add(`<g>${doll(c, other === 'woman' ? C.ochreRobe : C.tealRobe, { woman: other === 'woman', h: 72, skin: C.skin3 })}</g>`);
      const rg = cardL.add(`<g>${ring(c, 13)}</g>`);
      const tear = cardL.add(`<g opacity="0"><path d="${c.cut([[0, 0], [3.4, 6], [2.6, 9.4], [0, 10], [-2.6, 9.4], [-3.4, 6]], 0.1, 2)}" fill="#bfe0ee"/></g>`);
      return { el, his, her, third, rg, crack: rg.querySelector('[data-part="crack"]'), tear, x };
    };
    const A = makeCard(640, 'woman');
    const B = makeCard(975, 'man');

    /* people */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const PHs = [{ x: 1080, s: 0.94 }, { x: 1170, s: 0.9 }].map((ph, i) => ({ ...ph, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, pharisee(c, i + 2)))) }));
    const phHearts = PHs.map(() => pL.add(`<g>${stoneHeart(c, 12)}</g>`));
    const DIS = [TWELVE[0], TWELVE[7], TWELVE[3], TWELVE[2], TWELVE[1]].map((d, i) => {
      const el = pL.add(withFace(person(c, d.o), faceBits(c)));
      return { ...d, i, el, p: S.puppet(el), seed: c.rr(0, 9), x: [640, 560, 480, 590, 510][i], y: GY - [0, 22, 30, 44, 50][i], s: [0.96, 0.9, 0.86, 0.82, 0.8][i] };
    });
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));

    const wordL = S.layer({ par: 0.5, sh: 6 });
    const notWorth = wordL.add(`<g opacity="0">${say(c, tr(['…to nie warto', 'się żenić!'], ['…it is not expedient', 'to marry!']), { size: 19, side: 1 })}</g>`);
    const bangs = [0, 1, 2].map(() => wordL.add(`<g opacity="0">${bang(c, C.terracotta, 1)}</g>`));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 180, 990, 220, C.sage, C.moss) + rock(c, 1420, 990, 200, 70, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 3) * 16 });

      const teach = es(t, 0.02, 0.25) * (1 - es(t, 1.95, 2.1));
      const turnToDis = es(t, 2.1, 2.3);
      jesus.set({ x: JX, y: GY, s: 1.02, flip: turnToDis > 0.5, armF: 20 + teach * (45 + bump(t, 0.3, 0.9) * 25 + bump(t, 1.3, 1.9) * 25) + turnToDis * 20, armB: teach * 40, head: -teach * 3 + Math.sin(T * 0.6) * 1.2, blink: blinkAt(T) });
      PHs.forEach((ph) => {
        const leave = es(t, 2.0, 2.6);
        const x = ph.x + leave * 460;
        ph.p.set({ x, y: GY, s: ph.s, flip: leave < 0.05, walk: leave > 0 && leave < 1 ? x * 0.05 : undefined, head: 5, blink: blinkAt(T, ph.seed) });
        pose(phHearts[ph.i], { x: x - 6 * ph.s * (leave < 0.05 ? 1 : -1), y: GY - 112 * ph.s, s: ph.s });
      });

      /* the cards: one each for beat 0 and beat 1 */
      const card = (K, t0, hisLeaves) => {
        const drop = es(t, t0 - 0.05, t0 + 0.25, ease.back) * (1 - es(t, 2.35, 2.7));
        const y = 214 - (1 - drop) * 1100;
        swing(K.el, K.x, y, T, 0.9, 0.7, K.x);
        const come = es(t, t0 + 0.25, t0 + 0.45), turn = es(t, t0 + 0.42, t0 + 0.65);
        const bx = K.x, fy = y + 138, side = hisLeaves ? -1 : 1;
        const leaver = hisLeaves ? K.his : K.her, stays = hisLeaves ? K.her : K.his;
        pose(K.third, { x: bx + side * 76, y: fy, o: come, r: side * -4 * come });
        pose(leaver, { x: bx + side * 24 + side * turn * 22, y: fy, r: side * turn * 7 });
        pose(stays, { x: bx - side * 24 - side * turn * 8, y: fy, r: -side * turn * 9, o: 1 - turn * 0.25 });
        pose(K.rg, { x: bx, y: y + 44 + turn * 6, r: turn * 16 });
        fade(K.crack, turn);
        pose(K.tear, { x: bx - side * 24 - side * turn * 8 + 8, y: fy - 60 + es(t, t0 + 0.62, t0 + 0.95) * 12, o: es(t, t0 + 0.6, t0 + 0.7) });
      };
      card(A, 0.0, true);
      card(B, 1.0, false);

      /* beat 2: the disciples — better not to marry */
      DIS.forEach((d) => {
        const shrug = d.i === 0 ? es(t, 2.25, 2.45) : d.i === 1 ? es(t, 2.4, 2.6) * 0.8 : 0;
        const dismay = es(t, 2.1 + d.i * 0.05, 2.35 + d.i * 0.05);
        d.p.set({ x: d.x, y: d.y, s: d.s, flip: false, armF: 12 + shrug * 70, armB: shrug * 110, head: -4 + dismay * 6, lean: -shrug * 2, blink: blinkAt(T, d.seed) });
        face(d.el, 'sad', dismay * 0.9);
      });
      pose(notWorth, { x: DIS[0].x + 30, y: GY - 200, s: es(t, 2.2, 2.42, ease.back), o: t > 2.2 ? 1 : 0 });
      bangs.forEach((b, i) => {
        const d = DIS[i + 1];
        const [hx, hy] = headAt(d.x, d.y, d.s, false);
        pose(b, { x: hx + 6, y: hy - 40, s: es(t, 2.35 + i * 0.08, 2.55 + i * 0.08, ease.back), r: -10 + i * 10, o: t > 2.35 + i * 0.08 ? 1 : 0 });
      });

      S.cam.x = -es(t, -0.2, 0.3) * 20 * (1 - es(t, 0.9, 1.3)) + es(t, 0.9, 1.3) * 20 * (1 - es(t, 1.9, 2.3)) - es(t, 1.9, 2.3) * 20;
      S.cam.z = 1 + es(t, -0.3, 0.4) * 0.04 + es(t, 1.9, 2.4) * 0.03;
      S.cam.y = -es(t, -0.3, 0.4) * 20 + es(t, 1.9, 2.4) * 20;
    };
  },
};
