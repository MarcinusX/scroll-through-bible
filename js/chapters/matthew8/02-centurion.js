// Mt 8,5–8 — Jesus comes into Capernaum along the street, the crowd behind Him. By his red-roofed house the
// centurion comes to meet Him. "My servant lies at home paralysed": the front of the house lifts away like a flat and
// there he lies, grey lines of pain around him. "I will come and heal him" — Jesus turns towards the house. But the
// centurion kneels in the street: "I am not worthy that you should come under my roof" — the roof glows; "only say
// the word": in his thought a golden word flies to the bed and the servant stands.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { capStreet, HOUSE, bedCut, centurion, soldier, SERVANT, mob, painMarks, thoughtCloud, goldSlip, hungWord, hangAt, bubble, headAt, voiceRings, sparkle, tr, PI } from './lib.js';

const FEET = HOUSE.FEET, JX = 700, CX = 905;

export default {
  id: 'mt8-centurion',
  beats: [
    { v: 5 },
    { v: 6 },
    { v: 7 },
    { v: 8, text: 'Lecz setnik odpowiedział: «Panie, nie jestem godzien, abyś wszedł pod dach mój,' },
    { v: 8, cont: true, text: 'ale powiedz tylko słowo, a mój sługa odzyska zdrowie.' },
  ],
  cam: { x: [0, 180], y: [0, 40], z: [1, 1.12] },
  build(S) {
    const st = capStreet(S);
    const c = st.c;

    /* ---------- inside the house: the servant on his bed ---------- */
    const B = HOUSE.BEDX;
    const lying = S.puppet(st.houseL.add(person(c, { ...SERVANT, eyes: 'closed' })));
    const pain = st.houseL.add(`<g opacity="0">${painMarks(c, 46)}</g>`);
    const H = st.addFront();

    /* ---------- the crowd that follows, the soldiers at the house ---------- */
    const crowdL = S.layer({ par: 0.4, sh: 4 });
    const crowd = [0, 1].map((i) => ({ i, sp: crowdL.sprite(mob(makeCutter('mt8-cen-c' + i), 5, { s: 0.82, spread: 44 }), 300, 718) }));
    const P = S.layer({ par: 0.4, sh: 5 });
    // phone: the two guards stand past the right edge, out of the progress thread
    const SOLD = (S.portrait ? [[1250, 1], [1330, 2]] : [[1150, 1], [1235, 2]]).map(([x, i]) => ({ x, i, p: S.puppet(P.add(soldier(c, i, { spear: 30 }))) }));
    const DIS = [CAST.peter, CAST.andrew, CAST.john, CAST.james].map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const cen = S.puppet(P.add(centurion(c)));
    const cenK = S.puppet(P.add(centurion(c, { pose: 'kneel' })));
    const talk = voiceRings(P, c, { n: 2, color: C.clay, r: 28, w: 4 });

    /* ---------- words, the sign, the centurion's thought ---------- */
    const W = S.layer({ par: 0.42, sh: 3 });
    const come = W.add(`<g opacity="0">${bubble(c, tr('Przyjdę i uzdrowię go', 'I will come and heal him'), { size: 22, fill: C.halo, dir: -1 })}</g>`);
    const notW = W.add(`<g opacity="0">${bubble(c, tr('Panie, nie jestem godzien…', 'Lord, I’m not worthy…'), { size: 21, dir: -1 })}</g>`);
    const TC = thoughtCloud(c, 250, 150, { dir: -1 });
    const cloudEl = W.add(`<g opacity="0">${TC.m}</g>`);
    const tp = makeCutter('mt8-thought');
    const icon = (o, pose) => `<g transform="scale(.4)">${person(tp, { ...SERVANT, ...o, pose })}</g>`;
    const tBed = W.add(`<g opacity="0"><g transform="scale(.4)">${bedCut(c, 210)}</g></g>`);
    const tLie = W.add(`<g opacity="0"><g transform="rotate(-90) scale(.36)">${person(tp, { ...SERVANT, eyes: 'closed' })}</g></g>`);
    const tUp = W.add(`<g opacity="0">${icon({}, 'stand')}</g>`);
    const tWord = W.add(`<g opacity="0">${goldSlip(c, 44)}</g>`);
    const tSpark = W.add(`<g opacity="0">${sparkle(c, 12)}</g>`);
    const flyL = S.layer({ par: 0.2, sh: 6 });
    const sign = flyL.add(hungWord(c, tr('Kafarnaum', 'Capernaum'), { size: 26 }));

    return (t, time) => {
      const T = time;
      st.update(T);

      /* v5 — He comes into Capernaum; the centurion comes to meet Him */
      const enter = es(t, 0.0, 0.7, (u) => u * (2 - u));
      const toHouse = es(t, 2.2, 2.6) * (1 - es(t, 3.1, 3.4));
      const jx = lerp(-120, JX, enter) + toHouse * 60;
      const walkJ = (enter > 0 && enter < 1) || (t > 2.2 && t < 2.6) || (t > 3.1 && t < 3.4);
      const speak = es(t, 2.1, 2.3) * (1 - es(t, 2.85, 3.0));
      const listen = es(t, 3.2, 3.5);
      jesus.set({ x: jx, y: FEET, s: 1.04, flip: t > 3.1 && t < 3.4, walk: walkJ ? jx * 0.045 : undefined, amt: 0.8, armF: 12 + speak * 60 + listen * 20, armB: 8 + speak * 30, head: listen * 8, blink: blinkAt(T) });
      const [hx, hy] = headAt(jx, FEET, 1.04);
      talk(hx, hy, speak, T, { dir: 1, spread: 1.8 });
      DIS.forEach((d) => {
        const x = lerp(-300 - d.i * 90, 560 - d.i * 82, enter);
        d.p.set({ x, y: FEET + (d.i % 2 ? 8 : -2), s: 0.98, walk: enter > 0 && enter < 1 ? x * 0.05 + d.i : undefined, amt: 0.8, armF: 12 + bump(t, 1.1, 1.9) * (d.i % 2 ? 20 : 40), head: -bump(t, 3.1, 4.9) * 4, blink: blinkAt(T, d.seed) });
      });
      crowd.forEach((g) => {
        const x = lerp(-700 - g.i * 260, 250 - g.i * 230, enter);
        g.sp.set({ x, y: 716 - g.i * 10 - (enter > 0 && enter < 1 ? Math.abs(Math.sin(x * 0.04 + g.i)) * 3 : 0), s: 1 - g.i * 0.1 });
      });
      const sk = es(t, 0.05, 0.35, ease.out) * (1 - es(t, 0.85, 1.05, ease.in));
      hangAt(sign, 780, lerp(-500, 250, sk), T, 1.2, 0.7);

      // the centurion steps out of his doorway, bows, asks
      const out = es(t, 0.3, 0.8);
      const cx = lerp(HOUSE.DOOR, CX, out);
      const kneel = es(t, 3.08, 3.14);
      const ask = es(t, 0.8, 1.0);
      const point = es(t, 1.1, 1.35) * (1 - es(t, 1.9, 2.1));
      const beg = es(t, 4.1, 4.35);
      cen.set({ x: cx, y: FEET + 2, s: 1.02, flip: true, o: 1 - kneel, walk: out > 0 && out < 1 ? cx * 0.05 : undefined, armF: 14 + ask * 50 * (1 - point) + point * 20, armB: 10 + point * 110, lean: ask * 6 * (1 - point), head: ask * 6 - point * 16, blink: blinkAt(T, 4) });
      cenK.set({ x: CX, y: FEET + 2, s: 1.02, flip: true, o: kneel, armF: 60 + beg * 40, armB: 90 - beg * 30, lean: 10 - beg * 10, head: 12 - beg * 22, blink: blinkAt(T, 4) });
      SOLD.forEach((sd) => sd.p.set({ x: sd.x, y: FEET - 8 + sd.i * 4, s: 0.96, flip: true, armF: 30, head: -bump(t, 3.1, 4.9) * 4, blink: blinkAt(T, sd.i + 7) }));

      /* v6 — "my servant lies at home paralysed": the front of the house lifts away */
      const open = es(t, 1.05, 1.35) * (1 - es(t, 2.0, 2.25));
      pose(H.front, { y: -open * 140, o: 1 - open });
      lying.set({ x: B + 88, y: HOUSE.BASE - 90, s: 0.84, r: -90, armF: 10, head: T ? Math.sin(T * 2.4) * 3 : 0 });
      pose(pain, { x: B - 30, y: HOUSE.BASE - 110, s: 1 + (T ? Math.sin(T * 5) * 0.06 : 0), o: open * 0.9 });

      /* v7 — "I will come and heal him" */
      const cb = es(t, 2.12, 2.3, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(come, { x: hx + 20, y: hy - 64, s: cb, o: cb > 0.02 ? 1 : 0 });

      /* v8a — "not worthy that you should come under my roof" */
      const nb = es(t, 3.2, 3.4, ease.back) * (1 - es(t, 3.92, 4.02));
      pose(notW, { x: S.portrait ? CX - 150 : CX + 16, y: FEET - 140, s: nb, o: nb > 0.02 ? 1 : 0 });
      pose(H.glow, { o: bump(t, 3.2, 4.1) * (0.6 + (T ? Math.sin(T * 4) * 0.15 : 0.15)) });

      /* v8b — "only say the word": in his thought the word flies to the bed and the servant stands */
      const tk = es(t, 4.12, 4.32, ease.back);
      const ox = CX + 10, oy = FEET - 170;
      pose(cloudEl, { x: ox, y: oy, s: tk, o: tk > 0.02 ? 1 : 0 });
      const ccx = ox + TC.cx, ccy = oy + TC.cy;
      const wk = es(t, 4.35, 4.6);
      const up = es(t, 4.6, 4.66);
      pose(tBed, { x: ccx + 30, y: ccy + 50, o: tk > 0.5 ? 1 : 0 });
      pose(tLie, { x: ccx + 66, y: ccy + 14, o: tk > 0.5 ? 1 - up : 0 });
      pose(tUp, { x: ccx + 92, y: ccy + 52, o: up });
      pose(tWord, { x: lerp(ccx - 90, ccx + 50, wk), y: ccy - 10 - Math.sin(wk * PI) * 20, r: Math.sin(T * 3) * 6, o: tk > 0.5 && wk < 1 ? 1 : 0 });
      const sp = bump(t, 4.6, 5.0);
      pose(tSpark, { x: ccx + 40, y: ccy - 30, s: sp, r: T * 40, o: sp });

      S.cam.z = 1.04 + es(t, 0.6, 1.1) * 0.05 + es(t, 3.0, 3.4) * 0.03;
      S.cam.x = (S.portrait ? 120 : 0) + 20 + es(t, 0.6, 1.1) * 30;   // phone: the house and the servant's bed in view
      S.cam.y = 20 + es(t, 0.6, 1.1) * 10;
    };
  },
};
