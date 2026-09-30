// Łk 10,39–42 — inside Martha's house, cut open like a doll's house: on the left the quiet corner with the rug and a
// cushion, on the right the busy corner with the clay oven and its fire, the shelf of jars and the water jar. "She had
// a sister called Mary, who sat at the Lord's feet and listened to His word": Jesus sits on the cushion, and Mary sits
// down on the rug at His feet, her face lifted; little golden slips of His words come to her. "But Martha was
// distracted with much serving": she hurries between the oven, the jars and the trough, and a whirl of pots, jugs,
// loaves and cups spins round her head. "She came up to Him and said: Lord, do you not care that my sister has left me
// to serve alone?" — hands on her hips, the whirl still spinning — "Tell her then to help me!" — and she points at Mary.
// "Martha, Martha, you are anxious and troubled about many things": He turns to her gently, and the whirl grows and
// grows. "But one thing is necessary": one by one the pots and jugs fall still and vanish, and a single small golden
// light is left. "Mary has chosen the good portion, which will not be taken from her": the light goes and rests in
// Mary's open hands; Martha sets down her jug, and the whole room glows warm.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { marthaRoom, MR, martha, mary, nameTag, glow, wordSlip, loaf, cup, bowl, jug, sparkle, kf, moving, handAt, headAt, tr, WARM, STRING, es, ease, bump, seg, PI } from './lib.js';

const JX = 800, JY = MR.SEAT;
const MX = 650;                         // Mary at His feet
const KITCHEN = [[0, 1080], [0.25, 1210], [0.45, 990], [0.65, 1180], [0.85, 1040]];

export default {
  id: 'lk10-portion',
  beats: [
    { v: 39 },
    { v: 40, text: 'Natomiast Marta uwijała się koło rozmaitych posług.' },
    { v: 40, cont: true, text: 'Przystąpiła więc do Niego i rzekła: «Panie, czy Ci to obojętne, że moja siostra zostawiła mnie samą przy usługiwaniu?' },
    { v: 40, cont: true, text: 'Powiedz jej, żeby mi pomogła».' },
    { v: 41 },
    { v: 42, text: 'a potrzeba <mało albo> tylko jednego.' },
    { v: 42, cont: true, text: 'Maria obrała najlepszą cząstkę, której nie będzie pozbawiona».' },
  ],
  cam: { x: [-40, 80], y: [-60, 70], z: [1, 1.16] },
  build(S) {
    const R = marthaRoom(S, { skyCols: WARM });
    const c = S.c;
    const warmL = S.layer({ par: 0.3, sh: 1, flat: true });
    warmL.add(`<g transform="translate(740 500)">${glow(380, 0.6, 'warm-glow')}</g>`);
    const backL = S.layer({ par: 0.3, sh: 1, flat: true });
    const oneGlow = backL.add(`<g>${glow(60, 1)}</g>`);
    warmL.fade(0);

    const P = S.layer({ par: 0.3, sh: 5 });
    const aura = P.add(`<g>${glow(160, 0.55)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const maryIn = S.puppet(P.add(mary(c)));
    const marySit = S.puppet(P.add(mary(c, { pose: 'sit' })));
    const jugHeld = `<g transform="rotate(60) translate(0 -8) scale(.5)">${jug(c, C.pot)}</g>`;
    const mar = S.puppet(P.add(martha(c, { holdF: jugHeld })));
    const marSit = S.puppet(P.add(martha(c, { pose: 'sit' })));
    const jugDown = P.add(`<g transform="scale(.5)">${jug(c, C.pot)}</g>`);
    const tagMary = P.add(`<g><path d="M0 -2000V6" stroke="${STRING}" stroke-width="1.2"/>${nameTag(c, tr('Maria', 'Mary'), { size: 18 })}</g>`);
    R.front();

    /* His words, Martha's whirl, the one thing */
    const fx = S.layer({ par: 0.34, sh: 4 });
    const words = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(wordSlip(c, c.rr(26, 36))) }));
    const ITEMS = ['pot', 'jug', 'loaf', 'cup', 'bowl', 'pot', 'loaf', 'cup', 'jug', 'bowl', 'loaf', 'cup'];
    const whirl = ITEMS.map((k, i) => {
      const m = k === 'jug' ? `<g transform="scale(.4)">${jug(c, i % 2 ? C.dustyBlue : C.sageRobe)}</g>` : k === 'loaf' ? loaf(c, 12) : k === 'cup' ? cup(c, C.sun) : k === 'bowl' ? bowl(c, { w: 30, color: C.tealRobe }) : `<g transform="scale(.36)">${jug(c, C.plumRobe)}</g>`;
      return { i, el: fx.add(`<g>${m}</g>`), a0: (i / ITEMS.length) * PI * 2, r: 80 + (i % 3) * 26 };
    });
    const one = fx.add(`<g><path d="${c.cut(c.star(0, 0, 13, 6, 8, 0), 0.2, 3)}" fill="${C.sun}"/><path d="${c.cut(c.circ(0, 0, 5, 10), 0.2, 2)}" fill="${C.star}"/></g>`);
    const steam = [0, 1, 2].map(() => fx.add(`<g><path d="${c.ribbon(c.cbez([0, 0], [-10, -20], [10, -34], [0, -54], 10), (u) => 6 - u * 4)}" fill="${C.cream}" opacity=".7"/></g>`));
    const sparks = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      R.update(T);

      /* v39 — Mary sits down at His feet and listens */
      const sitM = es(t, 0.25, 0.32);
      const inK = [[0, 470], [0.25, MX - 10]];
      const mx = kf(t, inK);
      maryIn.set({ x: mx, y: JY + 6, s: 0.94, flip: false, walk: moving(t, inK) ? mx * 0.05 : undefined, armF: 14, armB: 10, head: -2, o: 1 - sitM, blink: blinkAt(T, 4) });
      const receive = es(t, 5.45, 5.7);
      marySit.set({ x: MX, y: JY + 10, s: 0.94, flip: false, armF: 30 + receive * 50, armB: 20 + receive * 30, head: -14 + bump(t, 3.05, 3.4) * 8, o: sitM, blink: blinkAt(T, 4) });
      const tm = es(t, 0.3, 0.5, ease.out) * (1 - es(t, 1.0, 1.15));
      pose(tagMary, { x: MX, y: lerp(-500, 420, tm), r: T ? Math.sin(T) * 1.4 : 0, o: tm > 0.01 ? 1 : 0 });
      const [jhx, jhy] = headAt(JX, JY, 1.04, true, 'sit');
      const [mhx, mhy] = headAt(MX, JY + 10, 0.94, false, 'sit');
      words.forEach((w) => {
        const k = ((t * 1.3 + w.i / words.length) % 1);
        const on = es(t, 0.35, 0.5) * (1 - es(t, 0.95, 1.05));
        pose(w.el, { x: lerp(jhx - 20, mhx + 20, k), y: lerp(jhy, mhy, k) - Math.sin(k * PI) * 50, r: -10 + k * 20, s: 0.7, o: on * Math.sin(k * PI) });
      });

      /* v40a — Martha, busy; the whirl */
      const toJ = [[2.0, 1060], [2.25, 930]];
      const busyX = t < 1 ? 1080 : t < 2 ? kf(t - 1, KITCHEN) : kf(t, toJ);
      const busy = t > 1 && t < 2;
      const complain = es(t, 2.2, 2.35) * (1 - es(t, 2.95, 3.05));
      const pointM = es(t, 3.05, 3.2) * (1 - es(t, 3.95, 4.05));
      const settle = es(t, 6.2, 6.3);
      mar.set({ x: busyX, y: JY + 6, s: 0.98, flip: t > 2.0 || (busy && Math.cos((t - 1) * 30) < 0), walk: busy || moving(t, toJ) ? busyX * 0.07 : undefined, armF: 50 + complain * 10 + pointM * 60, armB: 20 + complain * 40, head: complain * -8 + es(t, 4.1, 4.3) * 8, lean: complain * -6, o: 1 - settle, blink: blinkAt(T, 6) });
      marSit.set({ x: 900, y: JY + 10, s: 0.96, flip: true, armF: 30, armB: 10, head: -6, o: settle, blink: blinkAt(T, 6) });
      pose(jugDown, { x: 960, y: JY + 6, o: settle });
      const [wx, wy] = headAt(busyX, JY + 6, 0.98, true);
      const many = es(t, 4.05, 4.4);
      const whirlOn = es(t, 1.05, 1.25);
      whirl.forEach((w) => {
        const shown = w.i < 6 ? whirlOn : many;
        const gone = es(t, 5.02 + w.i * 0.04, 5.1 + w.i * 0.04);
        const a = w.a0 + t * (2.4 + many * 1.2) + (T ? T * 0.4 : 0);
        const rr = w.r * (0.8 + many * 0.3);
        pose(w.el, { x: wx + Math.cos(a) * rr, y: wy - 70 + Math.sin(a) * rr * 0.42, r: a * 40, s: 1.25, o: shown * (1 - gone) });
      });
      steam.forEach((s_, i) => { const k = ((t * 0.9 + i / 3) % 1); pose(s_, { x: MR.OVEN - 10 + i * 12, y: MR.FLOOR - 120 - k * 40, s: 0.6 + k * 0.6, o: bump(t, 1.0, 2.2) * (1 - k) }); });

      /* v41–42 — He answers her; the one thing; the good portion */
      const turn = t > 2.1;
      const answer = es(t, 4.05, 4.25) * (1 - es(t, 6.0, 6.2));
      jesus.set({ x: JX, y: JY, s: 1.04, flip: !turn, armF: 30 + (t < 1 ? 10 : 0) + answer * 50, armB: 10 + answer * 30, head: -2 + answer * 6, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 100, o: 0.55 });
      const oneK = es(t, 5.3, 5.5);
      const toMary = es(t, 6.05, 6.4);
      const [mahx, mahy] = handAt(MX, JY + 10, 0.94, false, 80, 'sit');
      pose(one, { x: lerp(wx, mahx + 6, toMary), y: lerp(wy - 70, mahy - 16, toMary) - Math.sin(toMary * PI) * 60, s: 0.6 + oneK * 0.6, o: oneK });
      pose(oneGlow, { x: lerp(wx, mahx + 6, toMary), y: lerp(wy - 70, mahy - 16, toMary) - Math.sin(toMary * PI) * 60, s: 0.6 + oneK * 0.6, o: oneK });
      warmL.fade(es(t, 6.3, 6.6));
      sparks.forEach((s_, i) => { const k = bump(t, 6.4 + i * 0.1, 6.8 + i * 0.1); pose(s_, { x: mhx + (i - 1) * 40, y: mhy - 50 - (i % 2) * 20, s: k, r: T * 40, o: k }); });

      S.cam.x = kf(t, [[0, -20], [1, -20], [1.2, 60], [2, 60], [2.3, 30], [5, 30], [6, 0], [7, 0]]);
      S.cam.y = kf(t, [[0, 60], [2, 60], [5, 50], [6, 60], [7, 60]]);
      S.cam.z = kf(t, [[0, 1.14], [1, 1.14], [1.2, 1.12], [2.3, 1.14], [5, 1.12], [6.2, 1.14], [7, 1.14]]);
    };
  },
};
