// J 21,12–14 — "Come and eat breakfast": Jesus opens His arms behind the glowing fire, and they sit down round it one
// by one. A thought-bubble — "Who are You?" — trembles over them and folds itself away unasked: they know it is the
// Lord (a quiet light; heads bow). He comes, takes the bread and gives it to them — a piece into every pair of hands —
// and the fish likewise. Then three medallions hang in the morning sky: the locked door, Thomas's hand, this fire on
// the shore — the third time the Risen One showed Himself to His disciples.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  beachSet, FIRE, RING, JMID, SEVEN, JESUS, PETER, MORNING, thought, hungGold, hungPlate, numeral, doorIcon, handsIcon, coalFire, onTheCoals,
  breadBit, fishBit, flatLoaf, rayBurst, heart, skyKeys, kf, moving, headAt, hand, vis, pose, fade, person, sheet, shade, mix, C, lerp, blinkAt, tr, FONT, PI,
} from './lib.js';

const ORDER = ['peter', 'john', 'james', 'nathanael', 'thomas', 'other1', 'other2'];   // the order He serves them

export default {
  id: 'j21-breakfast',
  beats: [
    { v: 12, text: 'Rzekł do nich Jezus: «Chodźcie, posilcie się!»' },
    { v: 12, cont: true, text: 'Żaden z uczniów nie odważył się zadać Mu pytania: «Kto Ty jesteś?»' },
    { v: 12, cont: true, text: 'bo wiedzieli, że to jest Pan.' },
    { v: 13, text: 'A Jezus przyszedł, wziął chleb i podał im -' },
    { v: 13, cont: true, text: 'podobnie i rybę.' },
    { v: 14 },
  ],
  cam: { x: [-40, 60], y: [-60, 160], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const BS = beachSet(S, { skyCols: MORNING, sunY: 240, deferFire: true });
    const { K } = BS;

    const PL = S.layer({ par: 0.55, sh: 5 });
    const burst = PL.add(`<g>${rayBurst(c, { n: 16, r0: 60, r1: 280, spread: 0.03, o: 0.3 })}</g>`);
    const M = SEVEN.map((m, i) => ({ ...m, i, ...RING[m.k], seed: c.rr(0, 9), look: m.k === 'peter' ? PETER : m.o }));
    // standing (at the start) and sitting puppets
    M.forEach((m) => { m.st = S.puppet(PL.add(person(c, m.look))); });
    const jesus = S.puppet(PL.add(person(c, { ...JESUS, holdF: `<g transform="translate(0 4)">${breadBit(c)}</g>` })));
    const jFish = S.puppet(PL.add(person(c, { ...JESUS, holdF: `<g transform="translate(0 4)">${fishBit(c)}</g>` })));
    [...M].sort((a, b) => a.y - b.y).forEach((m) => { m.sit = S.puppet(PL.add(person(c, { ...m.look, pose: 'sit' }))); });
    // the pieces they receive (bread, then fish), in their hands
    M.forEach((m) => { m.bread = PL.add(`<g>${breadBit(c)}</g>`); m.fish = PL.add(`<g>${fishBit(c)}</g>`); });
    BS.makeFire();

    /* words and plates */
    const fx = S.layer({ par: 0.5, sh: 3 });
    const who = fx.add(`<g>${thought(c, `<text x="0" y="6" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.ink}">${tr('Kto Ty jesteś?', 'Who are You?')}</text>`, { w: 140, h: 54 })}</g>`);
    const lord = fx.add(hungGold(c, tr('Pan', 'the Lord'), { size: 32 }));
    const hearts = [0, 1, 2].map(() => fx.add(`<g>${heart(c, 9)}</g>`));
    const PLATES = [
      { icon: `<g transform="translate(0 -4)">${doorIcon(c, 26)}</g>`, n: 'I' },
      { icon: `<g transform="translate(0 0)">${handsIcon(c, 28)}</g>`, n: 'II' },
      { icon: `<circle r="40" cy="8" fill="url(#warm-glow)"/><g transform="translate(-4 22) scale(.9)">${coalFire(c, 60).base}${onTheCoals(c)}</g>`, n: 'III' },
    ].map((p, i) => ({ i, el: fx.add(hungPlate(c, p.icon, { r: 50, face: i === 2 ? mix(C.dawn, C.peach, 0.4) : mix(C.cream, C.skyBlue, 0.4) })), num: fx.add(`<g>${numeral(c, p.n, { r: 17 })}</g>`) }));
    const third = fx.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      skyKeys(K.sk, t, [[0, MORNING], [6, MORNING]]);
      K.idle(T, { sunY: 240 - es(t, 0, 6) * 30 });
      pose(K.sunPath, { x: 1250, y: 450, o: 0.5 });
      BS.idle(T, 0.55, { fishO: 1 - es(t, 4.05, 4.3) * 0.7, breadO: 1 - es(t, 3.1, 3.4) * 0.6 });

      /* v12a — "come and eat": they sit down round the fire */
      const welcome = es(t, 0.05, 0.3) * (1 - es(t, 1.0, 1.3));
      M.forEach((m, j) => {
        const sd = seg(t, 0.3 + j * 0.045, 0.35 + j * 0.045);
        const bow = es(t, 2.1, 2.4) * (1 - es(t, 2.9, 3.1) * 0.6);
        const k = ORDER.indexOf(m.k);
        const getB = es(t, 3.2 + k * 0.08, 3.3 + k * 0.08), getF = es(t, 4.1 + k * 0.08, 4.2 + k * 0.08);
        const eat = getB * (1 - getF) + getF;
        const up = es(t, 5.1, 5.4);
        m.st.set({ x: m.x + (m.flip ? 30 : -30), y: m.y - 4, s: 0.9, flip: m.flip, o: 1 - sd, armF: 14, blink: blinkAt(T, m.seed) });
        const aF = 30 + eat * 30 * (1 - up * 0.7);
        m.sit.set({ x: m.x, y: m.y, s: 0.9, flip: m.flip, o: sd, armF: aF, armB: 16 + eat * 20, head: bow * 10 - up * 10, blink: blinkAt(T, m.seed) });
        const [hx, hy] = hand(m.x, m.y, 0.9, m.flip, aF, 0, 62);
        vis(m.bread, { x: hx, y: hy - 4, s: 1, o: getB * (1 - getF) });
        vis(m.fish, { x: hx, y: hy - 4, s: 1, o: getF });
      });

      /* Jesus: welcomes, shines, comes and gives */
      const serveK = [[3.05, JMID.x], [3.2, 880], [3.5, 880], [3.6, 720], [3.9, 720], [4.05, 880], [4.35, 880], [4.45, 720], [4.8, 720], [5.0, JMID.x]];
      const jx = kf(t, serveK);
      const walking = moving(t, serveK);
      const giving = t > 3.05 && t < 5.0;
      const right = jx > JMID.x;
      const give = giving && !walking ? 1 : 0;
      const jo = { x: jx, y: JMID.y + (Math.abs(jx - JMID.x) > 10 ? 14 : 0), s: 1.0, flip: giving ? !right : false, walk: walking ? jx * 0.05 : undefined, armF: 16 + welcome * 60 + give * 60 + es(t, 5.1, 5.4) * 30, armB: 10 + welcome * 110 + es(t, 5.1, 5.4) * 60, head: give * 8, blink: blinkAt(T) };
      const fishTime = seg(t, 3.98, 4.02);
      jesus.set({ ...jo, o: 1 - fishTime * (t < 5.0 ? 1 : 0) });
      jFish.set({ ...jo, o: fishTime * (t < 5.0 ? 1 : 0) });
      const shine = es(t, 2.05, 2.4) * (1 - es(t, 3.0, 3.3) * 0.6) + es(t, 5.2, 5.6) * 0.5;
      vis(burst, { x: jx, y: JMID.y - 120, s: 0.6 + shine * 0.5, r: T * 3, o: shine * 0.7 });

      /* v12b — the question folds away, unasked */
      const qk = es(t, 1.1, 1.35, ease.back) * (1 - es(t, 1.7, 1.95, ease.in));
      const tremble = T ? Math.sin(T * 12) * 2 * qk : 0;
      vis(who, { x: 610 + tremble, y: 530, s: 1, sx: qk, sy: qk, o: qk > 0.01 ? 0.55 + qk * 0.35 : 0 });
      /* v12c — they know: the Lord */
      const lk = es(t, 2.1, 2.4, ease.out) * (1 - es(t, 2.9, 3.1, ease.in));
      vis(lord, { x: JMID.x, y: lerp(-300, 380, lk), r: T ? Math.sin(T * 0.9) * 1.5 : 0, o: lk > 0.01 ? 1 : 0 });
      hearts.forEach((h, i) => {
        const k = bump(t, 2.2 + i * 0.1, 2.95);
        const m = M.find((q) => q.k === ['thomas', 'peter', 'james'][i]);
        vis(h, { x: m.x, y: m.y - 150 - k * 30, s: k * 0.9, o: k });
      });

      /* v14 — the third time */
      PLATES.forEach((p) => {
        const k = es(t, 5.05 + p.i * 0.12, 5.4 + p.i * 0.12, ease.out);
        const x = 640 + p.i * 160, y = lerp(-300, 330, k);
        vis(p.el, { x, y, r: T ? Math.sin(T * 0.8 + p.i) * 1.5 : 0, o: k > 0.01 ? 1 : 0 });
        vis(p.num, { x: x + 38, y: y - 38, s: es(t, 5.3 + p.i * 0.12, 5.5 + p.i * 0.12, ease.back), o: k > 0.01 ? 1 : 0 });
      });
      const tk = es(t, 5.55, 5.8);
      vis(third, { x: 960, y: 330, s: 0.9 + (T ? Math.sin(T * 2) * 0.05 : 0), o: tk * 0.9 });

      S.cam.x = kf(t, [[0, 0], [1, 0], [1.2, -20], [2, -10], [3, 0], [5, 0], [6, 10]]);
      S.cam.y = kf(t, [[0, 120], [1, 120], [2, 100], [3, 120], [5, 120], [5.2, 20], [6, 10]]);
      S.cam.z = kf(t, [[0, 1.1], [1, 1.14], [2, 1.12], [3, 1.16], [5, 1.14], [5.3, 1.04], [6, 1.04]]);
    };
  },
};
