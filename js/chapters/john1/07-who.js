// J 1,19–22 — John's testimony: priests and Levites come down the road from Jerusalem and ask "Who are you?".
// Three picture plates come down from the flies — the Messiah's crown, Elijah's wheel of fire, the prophet's
// scroll — and John crosses out each one. "What do you say about yourself?" — a fourth plate hangs empty.
import { C, person, crowd, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { DAY, JOHN_B, LEVITE, jordanSet, priest, bubble, question, hungPlate, iconWord, crossOut, crown, oilHorn, fireWheel, headAt, hand, along, drops, shell, voiceRings, PI } from './lib.js';
import { scrollRoll } from '../mark3/lib.js';

const BANK = 772, WADE = 702, JX = 930;

export default {
  id: 'j1-who',
  beats: [
    { v: 19, text: 'Takie jest świadectwo Jana.' },
    { v: 19, cont: true, text: 'Gdy Żydzi wysłali do niego z Jerozolimy kapłanów i lewitów z zapytaniem: «Kto ty jesteś?»,' },
    { v: 20 },
    { v: 21, text: 'Zapytali go: «Cóż zatem? Czy jesteś Eliaszem?» Odrzekł: «Nie jestem».' },
    { v: 21, cont: true, text: '«Czy ty jesteś prorokiem?» Odparł: «Nie!»' },
    { v: 22, text: 'Powiedzieli mu więc: «Kim jesteś, abyśmy mogli dać odpowiedź tym, którzy nas wysłali?' },
    { v: 22, cont: true, text: 'Co mówisz sam o sobie?»' },
  ],
  cam: { x: [-320, 40], y: [-60, 60], z: [0.96, 1.2] },
  build(S) {
    const c = S.c;
    const PT = S.portrait;             // phone: the delegation and John stand closer, the plates hang in one narrow row
    const JXP = 1010;
    const J = jordanSet(S, { skyCols: DAY, sunAt: [1230, 150], city: true });

    /* ---------- the delegation, small, on the road down from Jerusalem ---------- */
    const far = [0, 1, 2, 3].map((i) => ({ i, p: S.puppet(J.hill.add(i < 2 ? priest(c, i) : person(c, LEVITE(i)))) }));
    // people on the far bank who came to be baptised
    const fbPeople = crowd(S, J.far, [{ y: 584, s: 0.4, n: 9, x0: 150, x1: 1450 }]).filter((m) => Math.abs(m.x - JX) > 120 && !(PT && Math.abs(m.x - JXP) < 90));

    /* ---------- John in the river ---------- */
    const R = J.riverLayer();
    const john = S.puppet(R.add(person(c, { ...JOHN_B, holdF: `<g transform="rotate(-20)">${shell(c, 15)}</g>` })));
    const kneeler = S.puppet(R.add(person(c, { robe: C.dustyBlue, hairStyle: 'short', hair: C.hair2, beard: 'short', skin: C.skin2, pose: 'kneel' })));
    const pourEl = R.add(`<g>${drops(c, 5, C.lake2)}</g>`);
    J.waterFront(R);

    /* ---------- the near bank: priests and Levites ---------- */
    const { N } = J.nearBank();
    const DEL = [
      { m: priest(c, 0, { holdB: '' }), x: PT ? 545 : 470, s: 1.0 },
      { m: priest(c, 1), x: PT ? 660 : 600, s: 0.98 },
      { m: person(c, { ...LEVITE(0), holdF: `<g transform="translate(2 4) rotate(80)">${scrollRoll(c)}</g>` }), x: PT ? 440 : 350, s: 0.95 },
      { m: person(c, LEVITE(1)), x: PT ? 765 : 710, s: 0.95 },
    ].map((d, i) => ({ ...d, i, p: S.puppet(N.add(d.m)) }));
    const voice = voiceRings(N, c, { n: 3, color: C.clay, r: 34, w: 5, both: false });

    /* ---------- words and plates ---------- */
    const T = S.layer({ par: 0.45, sh: 6 });
    const askEl = T.add(`<g>${bubble(c, tr('Kto ty jesteś?', 'Who are you?'), { size: 22, tail: -1 })}</g>`);
    const noEl = T.add(`<g>${bubble(c, tr('Nie!', 'No!'), { size: 22, tail: 1 })}</g>`);
    const ask2El = T.add(`<g>${bubble(c, [tr('Co mówisz', 'What do you say'), tr('sam o sobie?', 'about yourself?')], { size: 20, tail: -1 })}</g>`);
    const qEl = T.add(`<g>${question(c)}</g>`);
    const P2 = S.layer({ par: 0.3, sh: 6 });
    const PL = [
      { icon: `<g transform="translate(-6 6) scale(1.4)">${crown(c)}</g><g transform="translate(14 6) scale(.55) rotate(-10)">${oilHorn(c)}</g>`, w: tr('Mesjasz', 'the Christ'), a: 2.2 },
      { icon: `<g transform="translate(0 -4) scale(.55)">${fireWheel(c, 40)}</g>`, w: tr('Eliasz', 'Elijah'), a: 3.2 },
      { icon: `<g transform="translate(0 -2) scale(1.5)">${scrollRoll(c)}</g>`, w: tr('prorok', 'the prophet'), a: 4.2 },
    ].map((p, i) => ({ ...p, i, x: PT ? 575 + i * 150 : 600 + i * 170, el: P2.add(hungPlate(c, iconWord(p.icon, p.w), { r: 58 })), cr: P2.add(`<g>${crossOut(c, 34)}</g>`) }));
    const emptyEl = P2.add(hungPlate(c, `<g transform="translate(0 -4) scale(1.3)">${question(c)}</g>`, { r: 58 }));

    J.foreground();

    return (t, time) => {
      J.update(t, time);

      /* v19a: John's testimony — baptising in the Jordan */
      const pour = bump(t, 0.2, 0.8);
      const wet = es(t, 1.0, 1.3);
      /* v19b: they come down from Jerusalem, then stand on the bank */
      far.forEach((f) => {
        const u = seg(t, 1.05 + f.i * 0.06, 1.55 + f.i * 0.06);
        const [x, y, dir] = along(J.PATH, u);
        f.p.set({ x, y: y + 2, s: 0.13, flip: dir < 0, o: u > 0 && u < 1 ? 1 : 0, walk: u * 60 });
      });
      const arrive = es(t, 1.45, 1.8);
      DEL.forEach((d) => {
        const x = lerp(d.x - 520, d.x, arrive);
        const askA = d.i === 0 ? bump(t, 1.7, 2.1) * 60 + es(t, 5.1, 5.35) * (1 - es(t, 5.7, 5.9)) * 100 : 0;
        const writeA = d.i === 2 ? es(t, 5.3, 5.5) * 40 : 0;
        const lean = d.i === 1 ? bump(t, 3.05, 3.5) * 8 + bump(t, 6.05, 6.5) * 8 : 0;
        d.p.set({
          x, y: BANK + (d.i % 2) * 6, s: d.s, flip: d.i === 0 && es(t, 5.1, 5.25) > 0.5 && t < 5.75,
          o: seg(t, 1.43, 1.47), walk: arrive > 0 && arrive < 1 ? x * 0.05 : undefined,
          armF: 12 + askA + writeA + (d.i === 1 ? bump(t, 3.05, 3.5) * 70 + bump(t, 4.05, 4.4) * 60 + es(t, 6.05, 6.3) * 70 : 0),
          armB: d.i === 3 ? bump(t, 4.05, 4.5) * 40 : 0, head: -6 + lean, lean, blink: blinkAt(time, d.i),
        });
      });
      const [ax, ay] = headAt(DEL[0].x, BANK, 1, false);
      pose(askEl, { x: ax + 40, y: ay - 18, s: es(t, 1.72, 1.92, ease.back), o: seg(t, 1.7, 1.75) * (1 - seg(t, 2.1, 2.2)) });

      /* John: out of the water to face them; hand on his chest; shaking his head at each plate */
      const turn = es(t, 1.5, 1.7);
      const jx = PT ? lerp(JX - 30, JXP, es(t, 1.1, 1.6)) : JX;   // phone: he wades aside as they arrive
      const shake = Math.sin(seg(t, 2.35, 2.9) * PI * 6) * 12 * bump(t, 2.35, 2.9) + Math.sin(seg(t, 3.4, 3.9) * PI * 6) * 12 * bump(t, 3.4, 3.9) + Math.sin(seg(t, 4.4, 4.9) * PI * 6) * 12 * bump(t, 4.4, 4.9);
      const chest = Math.max(bump(t, 2.3, 3.0), es(t, 6.1, 6.4));
      john.set({ x: jx, y: WADE, s: 1.05, flip: turn > 0.5, armF: 30 + pour * 80 - turn * 10 + chest * 50, armB: 10 + bump(t, 3.3, 3.9) * 60 + bump(t, 4.3, 4.9) * 80, head: pour * 8 + shake - chest * 4, blink: blinkAt(time, 1) });
      const [jhx, jhy] = headAt(jx, WADE, 1.05, true);
      voice(jhx - 22, jhy + 4, bump(t, 4.4, 4.95), time, { spread: 2, s0: 0.6, dir: -1 });
      pose(noEl, { x: jhx - 60, y: jhy - 30, s: es(t, 4.45, 4.6, ease.back), o: seg(t, 4.44, 4.47) * (1 - seg(t, 4.95, 5.0)) });
      kneeler.set({ x: jx + 100 + es(t, 1.1, 1.5) * 400, y: WADE, s: 1, flip: true, o: 1 - es(t, 1.35, 1.5), head: 10 + pour * 6, armF: 60 - pour * 30, armB: 40, blink: blinkAt(time, 4) });
      const [px, py] = hand(jx, WADE, 1.05, false, 30 + pour * 80);
      const fall = time ? (time * 1.6) % 1 : 0.5;
      pose(pourEl, { x: px + 12 + fall * 10, y: py + 6 + fall * 50, o: seg(t, 0.35, 0.45) * (1 - seg(t, 0.7, 0.78)) });
      fbPeople.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, head: es(t, 1.5, 1.8) * 6, armF: bump(t, 2.3, 3) * 20, blink: blinkAt(time, m.seed) }));

      /* v20, v21: the plates — each crossed out */
      PL.forEach((p) => {
        const dn = es(t, p.a, p.a + 0.25, ease.out);
        const cr = es(t, p.a + 0.45, p.a + 0.6, ease.back);
        const up = es(t, 5.0, 5.3) * 0.35;
        const y = lerp(-500, 300, dn) - up * 60;
        pose(p.el, { x: p.x, y, r: Math.sin(t * 3.6 + p.i) * 1.5 * dn, o: dn > 0.01 ? 1 : 0 });
        pose(p.cr, { x: p.x, y, s: cr, o: cr > 0.01 ? 1 : 0 });
      });

      /* v22a: "so that we can take an answer to those who sent us" — the priest points back to the city */
      /* v22b: "what do you say about yourself?" — an empty plate */
      pose(ask2El, { x: ax + 50, y: ay - 16, s: es(t, 6.05, 6.25, ease.back), o: seg(t, 6.03, 6.08) });
      const ek = es(t, 6.2, 6.5, ease.out);
      pose(emptyEl, { x: PT ? 575 + 3 * 150 : 1110, y: lerp(-500, 280, ek), r: Math.sin(t * 3.6 + 4) * 1.5 * ek, o: ek > 0.01 ? 1 : 0 });
      pose(qEl, { x: jhx - 40, y: jhy - 40, s: es(t, 6.4, 6.6, ease.back) * 0.9, r: Math.sin(t * 8.0) * 6, o: seg(t, 6.38, 6.42) });

      /* camera: to the road from Jerusalem, then onto the bank */
      const toCity1 = es(t, 0.9, 1.2) * (1 - es(t, 1.45, 1.75)), toCity2 = es(t, 5.1, 5.35) * (1 - es(t, 5.75, 6.0));
      const toCity = toCity1 + toCity2;
      S.cam.x = PT ? -260 * toCity1 - 110 * toCity2 : -120 * toCity;
      S.cam.y = -40 * toCity;
      S.cam.z = 1.04 + 0.08 * toCity;
    };
  },
};
