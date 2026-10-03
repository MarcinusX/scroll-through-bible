// Łk 24,36–40 — While they are still talking, a soft light gathers in the middle of the room and Jesus Himself stands
// among them: "Peace to you!" (the word in gold, a dove with an olive sprig). They start back, terrified, thinking they
// see a spirit — pale wisps in their thought-bubbles. "Why are you troubled, why do doubts rise in your hearts?" —
// little clouds of doubt over them. "See my hands and my feet, that it is I myself": He holds out His hands, and in
// each palm a small light. "Touch me and see": Peter reaches out and takes His hand — the wisps vanish. And He shows
// them His hands and His feet, the marks shining softly, and they lean in close.
import { C, blinkAt, pose, lerp } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { gatherRoom, MID, headAt, handAt, handB, goldWord, peaceDove, flapWings, thought, ghost, worryCloud, markLight, sparkle, tr } from './lib.js';

const SCARED = ['thomas', 'friend', 'john', 'thaddaeus', 'simonZ'];

export default {
  id: 'lk24-peace',
  beats: [
    { v: 36 },
    { v: 37 },
    { v: 38 },
    { v: 39, text: 'Popatrzcie na moje ręce i nogi: to Ja jestem.' },
    { v: 39, cont: true, text: 'Dotknijcie się Mnie i przekonajcie: duch nie ma ciała ani kości, jak widzicie, że Ja mam».' },
    { v: 40 },
  ],
  cam: { x: [-40, 60], y: [-20, 60], z: [0.9, 1.2] },
  build(S) {
    const c = S.c;
    const G = gatherRoom(S);
    const fx = S.layer({ par: 0.56, sh: 5 });
    const word = fx.add(`<g>${goldWord(c, tr('Pokój wam!', 'Peace be to you!'), { size: 28 })}</g>`);
    const dove = fx.add(`<g>${peaceDove(c)}</g>`);
    const ghosts = SCARED.map((k) => ({ m: G.by[k], el: fx.add(`<g>${thought(c, `<g transform="translate(0 20)">${ghost(c, 40)}</g>`, { w: 66, h: 58 })}</g>`) }));
    const doubts = ['peter', 'andrew', 'cleopas', 'james', 'bartholomew', 'matthew'].map((k) => ({ m: G.by[k], el: fx.add(`<g>${worryCloud(c, 46)}</g>`) }));
    const lights = [0, 1, 2, 3].map(() => fx.add(`<g>${markLight(c, 6)}</g>`));
    const touch = fx.add(`<g>${sparkle(c, 12)}</g>`);

    return (t, T) => {
      G.RR.R.update(T, 1);
      G.RR.door.set(0); G.RR.door.bolt(1);
      /* v36: He stands among them — "Peace to you!" */
      const come = es(t, 0.1, 0.5);
      pose(G.glow, { x: MID.x, y: MID.y, s: 0.5 + come * 0.5, o: come * 0.95 });
      const peace = es(t, 0.5, 0.7) * (1 - es(t, 0.95, 1.1));
      const calm = es(t, 2.05, 2.3) * (1 - es(t, 3.0, 3.1));
      const hands = es(t, 3.05, 3.3);
      const feet = es(t, 5.05, 5.3);
      const aF = 20 + peace * 40 + calm * 40 + hands * 60 - feet * 30;
      const aB = 14 + peace * 110 + calm * 30 + hands * 90 - feet * 50;
      G.jesus.set({ x: MID.x, y: MID.y, s: MID.s, o: es(t, 0.2, 0.55), armF: aF, armB: aB, head: 2 + feet * 8, blink: blinkAt(T) });
      const wk = es(t, 0.55, 0.75, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(word, { x: MID.x, y: 380, s: wk, o: wk > 0.01 ? 1 : 0 });
      const dv = es(t, 0.6, 1.0, ease.out);
      pose(dove, { x: lerp(MID.x + 20, 1030, dv), y: lerp(560, 330, dv) + Math.sin(dv * 6) * 16, s: 0.4 + dv * 0.5, o: dv > 0.01 ? 1 - es(t, 1.0, 1.1) : 0 });
      if (T) flapWings(dove, T, 30, 9);

      /* the gathered: v37 terror; v38 doubts; v39b Peter touches; v40 they lean in */
      const fear = es(t, 1.03, 1.2) * (1 - es(t, 4.1, 4.4));
      const reach = es(t, 4.05, 4.5);
      const lean = es(t, 5.1, 5.4);
      G.crew.forEach((m) => {
        const flip = come > 0.5 ? m.x > MID.x : m.flip;
        const tremble = fear * (T ? Math.sin(T * 30 + m.i) * 1.5 : 0);
        if (m.k === 'peter') {
          const px = m.x + reach * (S.portrait ? 24 : 60);   // phone: he stands nearer already (the room is drawn closer)
          m.p.set({ x: px, y: m.y, s: m.s, flip, lean: -fear * 10 + reach * 8 + lean * 4, armF: 26 + fear * 50 * (1 - reach) + reach * 60, armB: 12 + fear * 90 * (1 - reach), head: -fear * 8 + reach * 4 + lean * 8, blink: blinkAt(T, m.seed) });
        } else {
          m.p.set({ x: m.x + tremble, y: m.y, s: m.s, flip, lean: -fear * 12 + lean * 6, armF: 22 + fear * 60 + lean * 20, armB: 10 + fear * (m.i % 2 ? 110 : 50), head: -fear * 10 + lean * 8, blink: fear > 0.5 ? 0 : blinkAt(T, m.seed) });
        }
        fade(m.sad, fear * 0.8);
      });
      ghosts.forEach((g, i) => {
        const [hx, hy] = headAt(g.m.x, g.m.y, g.m.s, g.m.x > MID.x);
        const k = es(t, 1.15 + i * 0.06, 1.35 + i * 0.06, ease.back) * (1 - es(t, 4.2, 4.4));
        pose(g.el, { x: hx + (g.m.x > MID.x ? -40 : 0), y: hy - 20, s: k * 0.9, o: k > 0.01 ? 1 : 0 });
      });
      doubts.forEach((d, i) => {
        const [hx, hy] = headAt(d.m.x, d.m.y, d.m.s, d.m.x > MID.x);
        const k = es(t, 2.1 + i * 0.05, 2.3 + i * 0.05, ease.back) * (1 - es(t, 3.9, 4.2));
        pose(d.el, { x: hx, y: hy - 60 + (T ? Math.sin(T * 1.4 + i) * 2 : 0), s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v39–40: the marks on His hands and feet — only light */
      const [f1x, f1y] = handAt(MID.x, MID.y, MID.s, false, aF);
      const [b1x, b1y] = handB(MID.x, MID.y, MID.s, false, aB);
      const lk = [hands, hands, feet, feet];
      [[f1x, f1y], [b1x, b1y], [MID.x + 10 * MID.s, MID.y - 4], [MID.x - 10 * MID.s, MID.y - 4]].forEach(([x, y], i) => {
        pose(lights[i], { x, y, s: lk[i] * (1 + (T ? Math.sin(T * 3 + i) * 0.08 : 0)) * (1 + lean * 0.2), o: lk[i] });
      });
      const tb = bump(t, 4.35, 4.95);
      pose(touch, { x: b1x - 6, y: b1y - 20, s: tb * 1.2, r: T * 30, o: tb });

      S.cam.x = S.portrait ? 0 : 0;
      S.cam.y = 40 - es(t, 3.0, 3.4) * 10 + es(t, 5.0, 5.4) * 16;
      S.cam.z = (S.portrait ? 0.92 : 1.04) + es(t, 3.0, 3.4) * 0.06 + es(t, 5.0, 5.4) * 0.04;
      void seg;
    };
  },
};
