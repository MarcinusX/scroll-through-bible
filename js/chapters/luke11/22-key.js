// Łk 11,52–54 — evening at the Pharisee's table, the lamps burning. "Woe to you lawyers, for you have taken away the key
// of knowledge": the sixth dark tag drops, and a panel comes down — the door of a house of the Scriptures, its scrolls
// glowing inside, and hanging by it a golden key; the teacher of the Law takes the key and holds it close. "You did not
// enter yourselves, and you hindered those who were entering": he locks the door and stands in front of it with his
// arms spread, and the people who come to go in are turned back. As Jesus goes out, the scribes and Pharisees rise
// and press hard round Him, firing question after question. And they lie in wait for Him to catch Him in something He
// might say: they crouch behind the table with a net, snatching at the golden words that come from His mouth.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { dinnerSet, SH, HOST, LAWYER, TABLE_GUESTS, woeTag, panel, panelSky, panelGround, keyProp, figure, question, goldSlip, glow, headAt, handAt, kf, moving, PI } from './lib.js';

const { FLOOR, JX, SEAT } = SH;
const PX = 900, PY = 300, PW = 420, PH_ = 240;

/** a net on a pole (hold coords: the grip at the origin, the net up and forward) */
function netPole(c) {
  let d = '';
  for (let i = 0; i < 5; i++) d += c.ribbon(c.arc(60, -70, 30 - i * 5, 22 - i * 4, 0, PI * 2, 12), 1.2);
  for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2; d += c.ribbon([[60, -70], [60 + Math.cos(a) * 30, -70 + Math.sin(a) * 22]], 1.2); }
  return sheet().p(c.ribbon([[0, 0], [40, -54]], 3), C.wood2).p(d, mix(C.rope, C.soilDark, 0.2)).out();
}

export default {
  id: 'lk11-key',
  beats: [
    { v: 52, text: 'Biada wam, uczonym w Prawie, bo wzięliście klucze poznania;' },
    { v: 52, cont: true, text: 'samiście nie weszli, a przeszkodziliście tym, którzy wejść chcieli».' },
    { v: 53 },
    { v: 54 },
  ],
  cam: { x: [0, 140], y: [60, 160], z: [0.84, 1.2] },
  build(S) {
    const c = S.c;
    const D = dinnerSet(S);
    const R = D.R;
    const PL = S.layer({ par: 0.3, sh: 6, rise: 0 });
    const B = S.layer({ par: 0.3, sh: 5, rise: 0 });
    const tag = hanging(PL, woeTag(c, 'VI'), { x: 0, y: -1500, len: 900 });
    /* the house of knowledge */
    const house = panelSky(S, PW, PH_, ['#8c7fa8', '#e2b59a']) + panelGround(c, PW, 80, mix(C.sand, C.stone, 0.4), 2)
      + sheet().p(c.cut([[-150, 82], [-150, -60], [-10, -100], [130, -60], [130, 82]], 0.5, 8), mix(C.plaster, C.sand, 0.25)).p(c.cut([[-40, 82], [-40, -10], ...c.arc(-10, -10, 30, 24, PI, 2 * PI, 8), [20, -10], [20, 82]], 0.4, 5), '#fff1c4').out()
      + `<circle cx="-10" cy="30" r="70" fill="url(#halo-glow)"/>` + [[-30, 50], [-14, 40], [2, 52]].map(([x, y]) => sheet().p(c.cut(c.rect(x - 5, y - 16, 10, 32), 0.2, 3), C.parchment).out()).join('');
    const p1 = PL.add(panel(S, house, { w: PW, h: PH_ }));
    const door = B.add(`<g opacity="0">${sheet().p(c.cut(c.rect(0, -92, 60, 92), 0.4, 5), C.wood).x(c.ribbon([[30, -84], [30, -6]], 1.4), shade(C.wood, -0.3), 'opacity=".6"').out()}</g>`);
    const key = B.add(`<g opacity="0"><circle r="18" fill="url(#halo-glow)"/><g transform="scale(1.1)">${keyProp(c, C.sun)}</g></g>`);
    const keeper = S.puppet(B.add(person(c, LAWYER)));
    const comers = [0, 1].map((i) => ({ i, p: S.puppet(B.add(person(c, [{ robe: C.sageRobe, hairStyle: 'short', beard: 'short', hair: C.hair2, skin: C.skin2 }, { robe: C.roseRobe, hairStyle: 'veil', veil: C.wheat, beard: 'none', skin: C.skin }][i]))) }));

    /* the court: Jesus going out; they press round Him; they lie in wait */
    const jUp = S.puppet(R.frontL.add(person(c, CAST.jesus)));
    const G = TABLE_GUESTS();
    const pressers = [G[0], G[1], G[2], HOST].map((o, i) => ({ i, p: S.puppet(R.frontL.add(person(c, o))) }));
    const Qs = [0, 1, 2, 3, 4, 5].map(() => R.fx.add(`<g opacity="0">${question(c)}</g>`));
    const lurk = [G[0], G[2]].map((o, i) => ({ i, p: S.puppet(R.frontL.add(person(c, { ...o, pose: 'kneel', holdF: i === 0 ? `<g transform="rotate(-20)">${netPole(c)}</g>` : '' }))) }));
    const words = [0, 1, 2].map(() => R.fx.add(`<g opacity="0">${goldSlip(c, 26)}</g>`));

    return (t, time) => {
      const T = time;
      /* the woe tag and the panel */
      const tk = es(t, 0.02, 0.27, ease.out) * (1 - es(t, 1.9, 2.1));
      pose(tag, { x: S.portrait ? 900 : 1150, y: lerp(-500, S.portrait ? 40 : 170, tk), r: T ? Math.sin(T * 0.9) * 2 : 0, o: tk > 0.004 ? 1 : 0 });
      const k1 = es(t, 0.05, 0.33, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      const Y1 = lerp(-1500, PY, k1), on1 = k1 > 0.9 ? 1 : 0;
      pose(p1, { x: PX, y: Y1, o: k1 > 0.002 ? 1 : 0 });
      /* v52a — he takes the key; v52b — he locks the door and turns the others away */
      const take = es(t, 0.45, 0.7);
      const KK = [[0.3, PX + 150], [0.5, PX + 60]];
      const kx = kf(t, KK);
      const block = es(t, 1.2, 1.35);
      keeper.set({ x: kx, y: Y1 + 108, s: 0.5, flip: true, o: on1, walk: moving(t, KK) ? kx * 0.2 : undefined, armF: 40 + take * 40 * (1 - block) + block * 70, armB: 10 + block * 120, head: -4, blink: blinkAt(T, 6) });
      const [hx, hy] = handAt(kx, Y1 + 108, 0.5, true, 80);
      pose(key, { x: lerp(PX + 50, hx - 4, take), y: lerp(Y1 - 30, hy, take), r: take * 40, o: on1 });
      const shut = es(t, 1.05, 1.2);
      pose(door, { x: PX - 40, y: Y1 + 82, sx: Math.max(0.1, shut), o: on1 });
      comers.forEach((m) => {
        const K = [[1.1 + m.i * 0.06, PX - 200 + m.i * 20], [1.4, PX - 100 - m.i * 40], [1.6, PX - 100 - m.i * 40], [1.9, PX - 190 - m.i * 20]];
        const x = kf(t, K);
        const back = t > 1.6;
        m.p.set({ x, y: Y1 + 110 + m.i * 3, s: 0.46, flip: back, o: on1, walk: moving(t, K) ? x * 0.2 + m.i : undefined, armF: 20 + (1 - es(t, 1.45, 1.6)) * 40 * es(t, 1.3, 1.4), head: back ? 10 : -4, blink: blinkAt(T, 8 + m.i) });
      });

      /* v53 — He rises to go; they press round Him with questions */
      const rise = seg(t, 2.05, 2.1);
      const JK = [[2.1, JX], [2.5, JX - 110]];
      const jx = kf(t, JK);
      const speak = es(t, 3.1, 3.25);
      jUp.set({ x: jx, y: FLOOR, s: 1.02, flip: t > 2.1 && t < 2.55, o: rise, walk: moving(t, JK) ? jx * 0.05 : undefined, armF: 16 + speak * 40, armB: 8, head: 2 - speak * 4, blink: blinkAt(T) });
      const stand = seg(t, 2.1, 2.16);
      const lurking = seg(t, 3.05, 3.1);
      D.seat(t, T, {
        lit: 1,
        J: { o: 1 - rise },
        H: { o: 1 - stand },
        g: () => ({ o: 1 - stand }),
      });
      pressers.forEach((m) => {
        const K = [[2.1, [SH.GUESTS[0] + m.i * 70, 0]], [2.55, [jx + 120 + m.i * 64, 0]]];
        const [x] = kf(t, K);
        const push = bump(t, 2.5 + m.i * 0.05, 2.95);
        m.p.set({ x: x - push * 12, y: FLOOR + (m.i % 2) * 6, s: 0.96, flip: true, o: stand * (1 - lurking), walk: moving(t, K) ? x * 0.05 + m.i : undefined, armF: 30 + push * 60, armB: 10 + push * 50, lean: -push * 10, head: -4, blink: blinkAt(T, m.i) });
      });
      Qs.forEach((q, i) => {
        const a = 2.45 + i * 0.07;
        const k = es(t, a, a + 0.1, ease.back) * (1 - es(t, 2.95, 3.05));
        const [qx, qy] = headAt(jx + 120 + (i % 4) * 64, FLOOR, 0.96, true);
        pose(q, { x: qx - 30 - (i > 3 ? 60 : 0), y: qy - 50 - (i % 2) * 30, s: k, r: T ? Math.sin(T * 2 + i) * 8 : 0, o: k > 0.01 ? 1 : 0 });
      });
      /* v54 — they lie in wait to catch Him in His words */
      lurk.forEach((m) => {
        const x = [1060, 1160][m.i];
        const snatch = bump(t, 3.35, 3.65) * (m.i === 0 ? 1 : 0);
        m.p.set({ x, y: FLOOR + 6, s: 0.94, flip: true, o: lurking, armF: 60 + snatch * 40, armB: 20 + m.i * 60, lean: -10 - snatch * 8, head: -10, blink: blinkAt(T, 4 + m.i) });
      });
      const [jhx, jhy] = headAt(jx, FLOOR, 1.02);
      words.forEach((w, i) => {
        const a = 3.15 + i * 0.12;
        const k = es(t, a, a + 0.5);
        pose(w, { x: jhx + 20 + k * (300 + i * 40), y: jhy - 10 - Math.sin(k * PI) * 50 + i * 16, r: T ? Math.sin(T * 2 + i) * 10 : 0, o: k > 0 ? 1 - es(t, a + 0.4, a + 0.5) * 0.4 : 0 });
      });

      S.cam.x = kf(t, [[0, 110], [2.0, 110], [2.4, 60]]);
      S.cam.y = kf(t, [[0, 100], [2.0, 100], [2.4, 150]]);
      S.cam.z = kf(t, [[0, 1.06], [2.0, 1.06], [2.4, 1.12]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, 110], [2.0, 110], [2.4, 60]]); S.cam.z = 0.88; }
    };
  },
};
