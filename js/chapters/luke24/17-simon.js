// Łk 24,33b–35 — The upper room at night, lamps lit, the city asleep in the windows: the Eleven are gathered, and
// those with them (Mary Magdalene and Joanna at the back). The door is unbarred and the two come in, breathless.
// Before they can speak, the others tell them: "The Lord is risen indeed, and has appeared to Simon!" — the words in
// gold, and Peter, named on a tag, lifting his hands with the risen Lord in his bubble. Then the two tell theirs: the
// road with the Stranger walking between them, and the bread broken, shining.
import { C, CAST, blinkAt, pose, lerp, mix, sheet } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { gatherRoom, MID, headAt, goldWord, nameTag, hanging, speech, risenIcon, still, CLEOPAS, FRIEND, STRANGER, loafHalves, sparkle, hangK, tr } from './lib.js';

export default {
  id: 'lk24-simon',
  beats: [
    { v: 33, cont: true, text: 'Tam zastali zebranych Jedenastu i innych z nimi,' },
    { v: 34 },
    { v: 35 },
  ],
  cam: { x: [-40, 60], y: [0, 50], z: [0.9, 1.12] },
  build(S) {
    const c = S.c;
    const G = gatherRoom(S, { jesus: false });
    const { door } = G.RR;
    const fx = S.layer({ par: 0.56, sh: 5 });
    const word = fx.add(`<g>${goldWord(c, tr('Pan rzeczywiście zmartwychwstał!', 'The Lord is risen indeed!'), { size: 26 })}</g>`);
    const tag = hanging(fx, nameTag(c, tr('Szymon', 'Simon'), { size: 16 }), { x: 0, y: -1500, len: 700 });
    const pBub = fx.add(`<g>${speech(c, `<g transform="scale(1.1)">${risenIcon(c)}</g>`, { w: 96, h: 80 })}</g>`);
    const roadI = `<rect x="-48" y="-32" width="96" height="60" fill="${mix(C.dawn, C.sun, 0.25)}" rx="6"/><path d="${c.ribbon([[-48, 20], [48, 16]], 8)}" fill="${C.sand}"/>`
      + still(c, [{ x: -22, y: 20, s: 0.19, o: FRIEND, armF: 20 }, { x: 0, y: 21, s: 0.2, o: STRANGER, armF: 30 }, { x: 22, y: 20, s: 0.19, o: CLEOPAS, armF: 20 }]);
    const h = loafHalves(c, 20);
    const breadI = `<circle r="40" fill="url(#halo-glow)"/><g transform="translate(-14 12) rotate(-14)">${h.left}</g><g transform="translate(14 12) rotate(14)">${h.right}</g>`;
    const b1 = fx.add(`<g>${speech(c, roadI, { w: 120, h: 86, flip: true })}</g>`);
    const b2 = fx.add(`<g>${speech(c, breadI, { w: 100, h: 84, flip: true })}</g>`);
    const joy = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));
    void CAST;

    return (t, T) => {
      G.RR.R.update(T, 1);
      /* v33b: the door opens; the two come in and find them gathered */
      const open = es(t, 0.02, 0.2) * (1 - es(t, 0.75, 0.95));
      door.set(open);
      door.bolt(1 - es(t, 0.0, 0.12) + es(t, 0.8, 0.98));
      const annc = es(t, 1.05, 1.3);
      const tell = es(t, 2.05, 2.3);
      G.crew.forEach((m) => {
        if (m.k === 'cleopas' || m.k === 'friend') {
          const come = es(t, 0.1 + (m.k === 'friend' ? 0.12 : 0), 0.6 + (m.k === 'friend' ? 0.12 : 0), ease.out);
          const x = lerp(1205, m.x, come);
          const talk = tell * (m.k === 'cleopas' ? 1 : 0.7);
          m.p.set({ x, y: m.y, s: m.s, flip: true, walk: come > 0.001 && come < 0.999 ? x * 0.07 : undefined, amt: 1.1, o: come > 0.001 ? 1 : 0, lean: (1 - come) * 8, armF: 24 + talk * 50 + Math.sin(t * 8) * 8 * talk, armB: 10 + talk * 80, head: -talk * 6 - annc * (1 - tell) * 6, blink: blinkAt(T, m.seed) });
          fade(m.sad, 0);
          return;
        }
        const turn = es(t, 0.3, 0.6);
        const lift = annc * (1 - tell * 0.6);
        const isP = m.k === 'peter';
        m.p.set({ x: m.x + (isP ? annc * 50 : 0), y: m.y, s: m.s, flip: turn > 0.5 ? m.x < 1100 ? false : true : m.flip, armF: 26 + lift * (isP ? 70 : 40) + tell * 10, armB: 10 + lift * (isP ? 130 : m.i % 2 ? 110 : 40), head: -lift * 6 + tell * 4, blink: blinkAt(T, m.seed) });
        fade(m.sad, 0);
      });
      /* v34: "The Lord is risen indeed, and has appeared to Simon!" */
      const wk = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(word, { x: 800, y: 330, s: wk, o: wk > 0.01 ? 1 : 0 });
      const P = G.by.peter;
      const px = P.x + annc * 50;
      const [phx, phy] = headAt(px, P.y, P.s, false);
      hangK(tag, es(t, 1.3, 1.55, ease.back) * (1 - es(t, 2.0, 2.2, ease.in)), phx, phy - 160, T, 0);
      const pb = es(t, 1.45, 1.65, ease.back) * (1 - es(t, 2.0, 2.1));
      pose(pBub, { x: phx + 16, y: phy - 30, s: pb, o: pb > 0.01 ? 1 : 0 });
      joy.forEach((el, i) => {
        const b = bump(t, 1.2 + i * 0.08, 1.8 + i * 0.08);
        pose(el, { x: 460 + i * 170, y: 440 - (i % 2) * 40, s: b, r: T * 30, o: b });
      });
      /* v35: what happened on the road, and the bread broken */
      const [chx, chy] = headAt(G.by.cleopas.x, G.by.cleopas.y, G.by.cleopas.s, true);
      const k1 = es(t, 2.1, 2.3, ease.back);
      pose(b1, { x: chx - 16, y: chy - 34, s: k1 * (1 - es(t, 2.5, 2.6) * 0.15), o: k1 > 0.01 ? 1 : 0 });
      const k2 = es(t, 2.5, 2.7, ease.back);
      pose(b2, { x: chx - 150, y: chy - 70, s: k2, o: k2 > 0.01 ? 1 : 0 });

      S.cam.x = S.portrait ? lerp(80, 20, es(t, 0.9, 1.3)) : 20;
      S.cam.y = 40;
      S.cam.z = S.portrait ? 0.92 : 1.04;
      void sheet; void seg;
    };
  },
};
