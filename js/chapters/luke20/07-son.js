// Łk 20,13–14 — "Then the lord of the vineyard said: What shall I do?": the far land on its strings comes close and
// large; the owner stands in it with his hand at his chin, and a great "?" hangs beside him. "I will send my beloved
// son; perhaps they will respect him": his son steps up beside him, a heart between them, and his words go with him:
// "perhaps they will respect him". "But when the tenants saw him, they reasoned among themselves, saying": the plate
// goes back up, the son comes in at the gate, and the three tenants put their heads together while the light begins
// to go to dusk. "This is the heir; let us kill him, so that the inheritance may be ours": "This is the heir!" — and
// in their thought the key of the vineyard and a bunch of grapes; their brows darken.
import { person, blinkAt, pose, lerp, mix, C } from '../kit.js';
import { vineyardSet, vineBack, vineFront, VY, VINE_DAY, VINE_DUSK, LOOK, tenant, hoe, basketCut, bigKey, grapeBunch, moodPuppet, glowHeart, bigQuestion, bubble, thought, kf, tr, es, ease, bump, seg } from './lib.js';

const G = VY.G;
const TX = [724, 792, 860];
const SX = 968;

export default {
  id: 'lk20-son',
  parable: true,
  beats: [
    { v: 13, text: 'Wówczas rzekł pan winnicy: "Co mam począć?' },
    { v: 13, cont: true, text: 'Poślę mojego syna ukochanego, chyba go uszanują".' },
    { v: 14, text: 'Lecz rolnicy, zobaczywszy go, naradzali się między sobą mówiąc:' },
    { v: 14, cont: true, text: '"To jest dziedzic, zabijmy go, a dziedzictwo stanie się nasze".' },
  ],
  cam: { x: [-20, 30], y: [0, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    // phone: the far land hangs further in, clear of the frame and the progress thread
    const AB = S.portrait ? [990, 236] : VY.ABROAD;
    const set = vineyardSet(S);
    vineBack(set);
    const veil = S.layer({ par: 0.4, sh: 1, flat: true });
    veil.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.plumRobe, 0.4)}" opacity=".36"/>`);
    const near = S.layer({ par: 0.12, sh: 5 });
    const qEl = near.add(`<g>${bigQuestion(c, 56, C.terracotta)}</g>`);
    const heartEl = near.add(`<g>${glowHeart(c, 20)}</g>`);
    const says = near.add(`<g>${bubble(c, [tr('Może jego', 'Perhaps they'), tr('uszanują', 'will respect him')], { size: 19, tail: -1 })}</g>`);
    const pl = S.layer({ par: 0.5, sh: 5 });
    const ten = [0, 1, 2].map((i) => ({ i, p: moodPuppet(S, pl, c, { ...tenant(i), holdF: i === 1 ? hoe(c) : '' }), seed: c.rr(0, 9) }));
    const baskets = [0, 2].map((i) => ({ i, el: pl.add(`<g>${basketCut(c, { full: true })}</g>`) }));
    const son = moodPuppet(S, pl, c, { ...LOOK.son });
    const whisper = pl.add(`<g>${bubble(c, tr('To jest dziedzic!', 'This is the heir!'), { size: 18, tail: -1 })}</g>`);
    const plot = pl.add(`<g>${thought(c, `<g transform="translate(-16 -4) scale(1.1)">${grapeBunch(c, 4)}</g><g transform="translate(2 4) scale(.8)">${bigKey(c)}</g>`, { w: 100, h: 74 })}</g>`);
    const fr = set.front();
    vineFront(fr);

    return (t, time) => {
      const T = time;
      const dusk = es(t, 2.1, 3.6);
      veil.fade(dusk);
      set.update(t, T, { sunX: 700 - es(t, 2, 4) * (S.portrait ? 130 : 200), sunY: 150 + es(t, 2, 4) * 240 });

      /* v13 — the plate comes close: "what shall I do?"; the beloved son; the heart */
      const big = es(t, 0.05, 0.35) * (1 - es(t, 1.62, 1.9));
      pose(set.plateEl, { x: lerp(AB[0], 800, big), y: lerp(AB[1], 300, big), s: 1 + big * 1.1, r: T ? Math.sin(T * 0.8) * 1.2 * (1 - big) : 0 });
      const ponder = es(t, 0.2, 0.4) * (1 - es(t, 1.05, 1.2));
      const sonIn = es(t, 1.05, 1.25);
      const sonGone = seg(t, 1.86, 1.9);
      set.pOwner.set({ x: 0, y: 0, s: 1, flip: false, armF: 20 + ponder * 115 + sonIn * 50, armB: 20 + sonIn * 30, head: ponder * 12 + sonIn * 6, blink: blinkAt(T, 4) });
      set.pSon.set({ x: lerp(30, 0, sonIn), y: 0, s: 1, flip: true, o: sonIn * (1 - sonGone), armF: sonIn * 30, head: -sonIn * 6, blink: blinkAt(T, 7) });
      const qk = es(t, 0.3, 0.45, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(qEl, { x: 990, y: 250 + (T ? Math.sin(T * 1.4) * 4 : 0), s: qk, r: T ? Math.sin(T * 1.2) * 5 : 0, o: qk > 0.02 ? 1 : 0 });
      const hk = es(t, 1.2, 1.35, ease.back) * (1 - es(t, 1.82, 1.92));
      pose(heartEl, { x: 790, y: 160 + (T ? Math.sin(T * 2) * 3 : 0), s: hk * (1 + (T ? Math.sin(T * 3) * 0.05 : 0)), o: hk > 0.02 ? 1 : 0 });
      const sk = es(t, 1.3, 1.42, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(says, { x: 1010, y: 300, s: sk, o: sk > 0.02 ? 1 : 0 });

      /* v14a — the son comes in at the gate; they see him and confer */
      const inK = es(t, 1.9, 2.3);
      const sonX = lerp(1440, SX, inK);
      son.set({ x: sonX, y: G + 2, s: 0.98, flip: true, walk: inK > 0 && inK < 1 ? sonX * 0.05 : undefined, armF: 20 + bump(t, 2.3, 2.7) * 40, head: -es(t, 2.9, 3.2) * 4, blink: blinkAt(T, 3), o: inK > 0 ? 1 : 0 });
      son.mood({ sad: es(t, 3.3, 3.6) * 0.6 });
      const see = es(t, 2.1, 2.25);
      const huddle = es(t, 2.3, 2.55);
      ten.forEach((m) => {
        const x = TX[m.i] + huddle * [30, 0, -30][m.i];
        const flip = m.i === 2 && huddle > 0.5 ? true : false;
        m.p.set({
          x, y: G + (m.i === 1 ? 6 : 0), s: 0.96, flip, blink: blinkAt(T, m.seed),
          armF: 20 + see * (m.i === 2 ? 70 : 0) * (1 - huddle) + bump(t, 3.1, 3.7) * (m.i === 0 ? 80 : 0) + (m.i === 1 ? es(t, 3.3, 3.5) * 40 : 0), armB: 10 + (m.i !== 1 ? 34 : 0),
          head: huddle * [8, 14, -8][m.i] - see * 4 * (1 - huddle), lean: huddle * [10, 0, -10][m.i],
        });
        m.p.mood({ angry: es(t, 3.05, 3.25) });
      });
      baskets.forEach((b) => { const x = TX[b.i] + huddle * [30, 0, -30][b.i]; pose(b.el, { x: x - 22 * (b.i === 2 && huddle > 0.5 ? -1 : 1), y: G - 88, s: 0.9, o: 1 - es(t, 2.3, 2.4) }); });
      /* v14b — "This is the heir"; the key and the grapes in their thought */
      const wk = es(t, 3.05, 3.2, ease.back);
      pose(whisper, { x: TX[0] + 30, y: G - 212, s: wk, o: wk > 0.02 ? 1 : 0 });
      const pk = es(t, 3.3, 3.45, ease.back);
      pose(plot, { x: TX[2] - 10, y: G - 196, s: pk, o: pk > 0.02 ? 1 : 0 });

      S.cam.z = kf(t, [[0, 1.12], [0.4, 1.06], [1.8, 1.06], [2.3, 1.14]]);
      S.cam.y = kf(t, [[0, 40], [0.4, 0], [1.8, 0], [2.3, 40]]);
      S.cam.x = kf(t, [[0, 0], [2.3, 0], [3.0, 10]]);
    };
  },
};
