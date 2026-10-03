// Łk 4,20–22 — He rolls up the scroll (the great scroll in the flies rolls up too and is pulled away), gives it
// back to the attendant and sits down in the teacher's seat. Every eye in the synagogue is fixed on Him: thin gold
// threads run from every face to His. "Today this Scripture has been fulfilled in your hearing": a gold word TODAY
// comes down, and the six pictures of the prophecy come back as round medallions, lighting up one by one round
// Him. They all speak well of Him and wonder at the gracious words — slips of gold float out to them — and then,
// "Isn't this Joseph's son?": the plate of the carpenter's workshop comes down, and question marks rise.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, hanging } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  nazSynagogue, isaiahScroll, PICS, HAZZAN, scrollOpen, scrollRolled, headAt, voiceRings, labelTag, hangAt, sparkle, goldSlip, memoryPlate,
  speech, GLYPH, paperLabel, disc, tr, DY, PI,
} from './lib.js';

const SX = 815, SY = 292;
const JX = 800;

export default {
  id: 'lk4-today',
  beats: [
    { v: 20, text: 'Zwinąwszy księgę oddał słudze i usiadł;' },
    { v: 20, cont: true, text: 'a oczy wszystkich w synagodze były w Nim utkwione.' },
    { v: 21 },
    { v: 22, text: 'A wszyscy przyświadczali Mu i dziwili się pełnym wdzięku słowom, które płynęły z ust Jego.' },
    { v: 22, cont: true, text: 'I mówili: «Czy nie jest to syn Józefa?»' },
  ],
  cam: { x: [-30, 30], y: [-40, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const N = nazSynagogue(S);
    const { FLOOR, FRONT } = N;
    // phone: the scroll hangs a little smaller (as in the scene before) and the medallions close in round Him
    const PH = S.portrait, K = PH ? 0.84 : 1, SC = PH ? 792 : SX;
    const poseS = (el, o) => pose(el, PH ? { ...o, x: SC + (o.x - SX) * K, y: SY + (o.y - SY) * K, s: (o.s ?? 1) * K } : o);
    const [MRX, MRY] = PH ? [285, 320] : [390, 300];

    /* ---------- the great scroll (as it was left) rolls up ---------- */
    const flies = S.layer({ par: 0.3, sh: 6 });
    const sc = isaiahScroll(c, { w: 700, h: 262 });
    const parch = flies.add(`<g transform="translate(0 -1500)">${sc.sheet}</g>`);
    const shut = PICS.map((fn, k) => {
      const p = fn(c);
      const win = sheet().p(c.cut(c.rect(-52, -94, 104, 188), 0.5, 6), shade(C.parchment, -0.09)).out();
      const extra = k === 3 ? p.seeing + `<g transform="translate(21 -10)">${p.eyeO}</g>` : k === 4 ? p.free : k === 2 ? `<g transform="translate(-24 0) scale(.15 1)">${p.act.replace('translate(-24 0)', '')}</g>` : k === 1 ? `<g transform="translate(23 10)">${p.act}</g>` : k === 0 ? `<g transform="translate(0 -60)">${p.act}</g>` : `<g transform="translate(0 -34)">${p.act}</g>`;
      return { k, el: flies.add(`<g>${win}<g transform="scale(1.12)">${p.base}${extra}</g></g>`) };
    });
    const rollL = flies.add(`<g transform="translate(0 -1500)">${sc.rollerL}</g>`);
    const rollR = flies.add(`<g transform="translate(0 -1500)">${sc.rollerR}</g>`);

    /* ---------- TODAY, the medallions, the carpenter's plate ---------- */
    const hi = S.layer({ par: 0.3, sh: 6 });
    const today = hanging(hi, `<circle r="120" fill="url(#warm-glow)" opacity=".8"/>${paperLabel(tr('Dziś', 'Today'), { size: 44, fill: C.halo, ink: C.sunRay })}`, { x: 0, y: -1500, len: 600 });
    const MED = PICS.map((fn, k) => {
      const p = fn(c);
      const inner = `<g transform="translate(0 -8) scale(.6)">${p.base}${k === 3 ? p.seeing + `<g transform="translate(21 -10)">${p.eyeO}</g>` : k === 4 ? p.free : k === 2 ? '' : k === 1 ? `<g transform="translate(23 10)">${p.act}</g>` : k === 0 ? `<g transform="translate(0 -60)">${p.act}</g>` : `<g transform="translate(0 -34)">${p.act}</g>`}</g>`;
      const ang = PI * (1.12 + (k / 5) * 0.76);
      return { k, x: JX + Math.cos(ang) * MRX, y: 480 + Math.sin(ang) * MRY, el: hi.add(`<g class="hang" transform="translate(0 -1500)"><path d="M0 -1600V-50" stroke="rgba(74,54,34,.5)" stroke-width="1.2" fill="none"/><g class="obj"><circle r="70" fill="url(#halo-glow)"/>${disc(c, inner, { r: 54, rim: C.haloRim })}</g></g>`) };
    });
    const carp = hanging(hi, memoryPlate(c, 96) + `<g transform="translate(0 124)">${labelTag(tr('syn Józefa?', 'Joseph’s son?'), 19)}</g>`, { x: 0, y: -1500, len: 700 });

    /* ---------- the people ---------- */
    const backL = S.layer({ par: 0.45, sh: 4 });
    const back = N.backRow(backL);
    const act = S.layer({ par: 0.55, sh: 5 });
    N.lectern(act);
    const seat = act.add(sheet().p(c.cut([[JX - 44, FLOOR + 2], [JX - 40, 612], [JX + 40, 612], [JX + 44, FLOOR + 2]], 0.5, 6), C.stone2).p(c.cut([[JX - 48, 604], [JX + 48, 604], [JX + 48, 614], [JX - 48, 614]], 0.4, 6), shade(C.stone2, 0.2)).out());
    const heldOpen = `<g transform="translate(6 6) rotate(-60) scale(.5)">${scrollOpen(c, 70, 50)}</g>`;
    const heldRolled = `<g transform="translate(2 4) rotate(-30)">${scrollRolled(c, 46)}</g>`;
    const hz = S.puppet(act.add(person(c, { ...HAZZAN })));
    const hzHold = S.puppet(act.add(person(c, { ...HAZZAN, holdF: heldRolled })));
    const jOpen = S.puppet(act.add(person(c, { ...CAST.jesus, holdF: heldOpen })));
    const jRolled = S.puppet(act.add(person(c, { ...CAST.jesus, holdF: heldRolled })));
    const jFree = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const jSit = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 40, w: 5 });
    N.bench(act);
    const front = N.frontLooks().filter((m) => m.i !== 4).map((m) => ({ ...m, p: S.puppet(act.add(person(c, { ...m.o, pose: 'sit' }))) }));

    /* ---------- eyes fixed on Him: threads of gold, all converging ---------- */
    const [shx, shy] = headAt(JX, 618, 1.0, false, DY.sit);
    const fx = S.layer({ par: 0.55, sh: 1, flat: true });
    let th = '';
    [...back.map((m) => headAt(m.x, m.y, m.s, m.x > JX, DY.sit)), ...front.map((m) => headAt(m.x, FRONT - 6, 0.8, !m.left, DY.sit))].forEach(([x, y]) => {
      const ex = x + (shx - x) * 0.86, ey = y + (shy - y) * 0.86;
      th += c.ribbon([[x + (x < JX ? 14 : -14), y - 2], [ex, ey]], 1.6);
    });
    const threads = fx.add(`<g opacity="0"><path d="${th}" fill="${C.haloRim}" opacity=".75"/></g>`);
    const fx2 = S.layer({ par: 0.56, sh: 4 });
    const slips = Array.from({ length: 9 }, (_, i) => ({ i, el: fx2.add(`<g opacity="0">${goldSlip(c, 38 + (i % 3) * 6)}</g>`) }));
    const wows = [back[1], back[7], front[2], front[6], back[4]].map((m, i) => ({ m, i, el: fx2.add(`<g opacity="0">${paperLabel('!', { size: 24, w: 30 })}</g>`) }));
    const asks = [back[2], back[6], front[1], front[7], back[9], front[4]].map((m, i) => ({ m, i, el: fx2.add(`<g opacity="0">${speech(c, GLYPH.q(c), { w: 44, h: 38, flip: m.x > JX })}</g>`) }));
    N.columns(S.portrait ? { ceilTop: -50 } : undefined);   // phone: the ceiling is a band, not a third of the screen of wood

    return (t, time) => {
      N.flicker(time);

      /* v20a: He rolls up the scroll, gives it back, sits down */
      const roll = es(t, 0.05, 0.45);
      const lift = es(t, 0.45, 0.8, ease.in);
      const yy = SY - lift * (PH ? 1700 : 700) + Math.sin(time * 0.8) * 2;   // phone: pulled right up, out of sight above the ceiling band
      const half = sc.w / 2;
      poseS(parch, { x: SX, y: yy, sx: 0.02 + (1 - roll) * 0.98, o: roll < 0.99 ? 1 : 0 });
      poseS(rollL, { x: SX - (8 + (1 - roll) * half), y: yy, o: lift < 0.99 ? 1 : 0 });
      poseS(rollR, { x: SX + (8 + (1 - roll) * half), y: yy, o: lift < 0.99 ? 1 : 0 });
      shut.forEach((s) => poseS(s.el, { x: SX + sc.colX(s.k) * (1 - roll), y: yy + sc.winY, sx: 1 - roll, o: 1 - seg(roll, 0.6, 0.9) }));
      const rolled = es(t, 0.3, 0.36);
      const given = es(t, 0.55, 0.61);
      const sit = es(t, 0.62, 0.68);
      jFree.set({ x: JX, y: FLOOR, s: 1.0, o: given * (1 - sit), armF: 30, head: 4, blink: blinkAt(time) });
      jOpen.set({ x: JX, y: FLOOR, s: 1.0, o: 1 - rolled, armF: 60, armB: 30, head: 4, blink: blinkAt(time) });
      jRolled.set({ x: JX, y: FLOOR, s: 1.0, o: rolled * (1 - given), armF: 40 + es(t, 0.4, 0.55) * 30, head: 4, blink: blinkAt(time) });
      /* v21: "today": He lifts His hand */
      const speak = es(t, 2.05, 2.3);
      const grace = es(t, 3.05, 3.3) * (1 - es(t, 4.0, 4.2));
      jSit.set({ x: JX, y: 618, s: 1.0, o: sit, armF: 20 + speak * 50 + grace * 20, armB: 10 + speak * 60 * (1 - es(t, 3.0, 3.2)), head: -speak * 4 + es(t, 4.1, 4.4) * 6, blink: blinkAt(time) });
      pose(seat, { o: 1 });
      if (t < 0.62) { const [x, y] = headAt(JX, FLOOR, 1, false); voice(x, y, 0, time); } else voice(shx, shy, (speak * (1 - es(t, 4.0, 4.3))) * 0.8, time, { spread: 2.6 });
      const hin = es(t, 0.3, 0.5), hout = es(t, 0.65, 0.95);
      const hx = lerp(1050, 905, hin) + hout * 150;
      const hMove = (hin > 0 && hin < 1) || (hout > 0 && hout < 1);
      hz.set({ x: hx, y: FLOOR, s: 0.98, flip: hout < 0.05 || hout > 0.97, o: 1 - given, walk: hMove ? hx * 0.05 : undefined, armF: 20 + hin * 40, head: 4, blink: blinkAt(time, 3) });
      hzHold.set({ x: hx, y: FLOOR, s: 0.98, flip: hout < 0.05 || hout > 0.97, o: given, walk: hMove ? hx * 0.05 : undefined, armF: 50 - hout * 20, head: 4, blink: blinkAt(time, 3) });

      /* v20b: every eye fixed on Him */
      const eyes = es(t, 1.1, 1.4) * (1 - es(t, 2.0, 2.25));
      fade(threads, eyes);
      const lean = es(t, 1.05, 1.3);
      const tell = es(t, 4.05, 4.3);
      const nod = es(t, 3.1, 3.4) * (1 - tell);
      back.forEach((m, i) => {
        const towards = m.x > JX;
        const turnAway = tell > 0.5 && i % 3 === 0;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: turnAway ? !towards : towards, armF: 30 + nod * (i % 2 ? 40 : 10) + tell * 20, armB: nod * (i % 3 === 1 ? 120 : 0), head: -lean * 6 + nod * (i % 2 ? 8 : -6) - tell * 4, lean: -lean * 4, blink: blinkAt(time, m.seed) });
      });
      front.forEach((m, i) => {
        const turnAway = tell > 0.5 && i % 3 === 1;
        m.p.set({ x: m.x, y: FRONT - 6, s: 0.8, flip: turnAway ? m.left : !m.left, armF: 24 + nod * 40, armB: nod * (i % 2 ? 110 : 0), head: -lean * 8 + nod * 6, blink: blinkAt(time, m.seed) });
      });

      /* v21: TODAY — the pictures come true round Him */
      const tk = es(t, 2.05, 2.35, ease.back) * (1 - es(t, 3.9, 4.15));
      hangAt(today, JX, lerp(-500, 300, tk), time, 1.2, 0.8);
      MED.forEach((m) => {
        const k = es(t, 2.2 + m.k * 0.09, 2.45 + m.k * 0.09, ease.back) * (1 - es(t, 3.0 + m.k * 0.03, 3.25 + m.k * 0.03));
        hangAt(m.el, m.x, lerp(-500, m.y, k), time, 1.3, 0.8, m.k);
      });

      /* v22a: the gracious words go out; they all bear witness */
      slips.forEach((s) => {
        const k = seg(t, 3.08 + s.i * 0.07, 3.6 + s.i * 0.05);
        const tx = lerp(420, 1200, s.i / 8), ty = 470 + (s.i % 2) * 60;
        pose(s.el, { x: lerp(shx + 20, tx, ease.out(k)), y: lerp(shy + 10, ty, k) - Math.sin(k * PI) * 90, r: Math.sin(k * 6 + s.i) * 16, s: 0.9 + k * 0.2, o: k > 0 && k < 1 ? Math.min(1, k * 6) * (1 - seg(k, 0.8, 1)) : 0 });
      });
      wows.forEach((w) => {
        const k = es(t, 3.3 + w.i * 0.06, 3.46 + w.i * 0.06, ease.back) * (1 - es(t, 3.95, 4.1));
        const [x, y] = headAt(w.m.x, w.m.y ?? FRONT - 6, w.m.s ?? 0.8, false, DY.sit);
        pose(w.el, { x: x + 16, y: y - 42, s: k, r: Math.sin(time + w.i) * 6, o: k > 0 ? 1 : 0 });
      });

      /* v22b: "Isn't this Joseph's son?" */
      const ck = es(t, 4.05, 4.35, ease.back);
      hangAt(carp, 800, lerp(-500, 240, ck), time, 1.2, 0.8, 3);
      asks.forEach((a) => {
        const k = es(t, 4.2 + a.i * 0.06, 4.38 + a.i * 0.06, ease.back);
        const x0 = a.m.x, y0 = a.m.y ?? FRONT - 6, s0 = a.m.s ?? 0.8;
        const [x, y] = headAt(x0, y0, s0, x0 > JX, DY.sit);
        pose(a.el, { x: x + (x0 > JX ? -16 : 16), y: y - 22, s: k * 0.9, r: Math.sin(time * 2 + a.i) * 5, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.z = 1.04 + es(t, 1.0, 1.4) * 0.06 - es(t, 2.0, 2.3) * 0.06;
      S.cam.y = 10 + es(t, 1.0, 1.4) * 30 - es(t, 2.0, 2.3) * 30 + es(t, 3.0, 3.3) * 20 - es(t, 4.0, 4.3) * 20;
      S.cam.x = 0;
    };
  },
};
