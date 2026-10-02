// Mt 21,23–25a — Jesus teaches in the Temple courts, people sitting round Him; the chief priests and the elders of
// the people come up: "By what authority do you do these things? Who gave you this authority?" — a seal with a
// question mark comes down. "I also will ask you one question" — a single card with a "?"; "answer it, and I will
// tell you" — the card swings between them. Then it opens in two: John's baptism — from heaven, or from men?
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { templeCourt, courtFront, priest, elder, heavenIcon, peopleIcon, TWELVE_O, headAt, bubble, card, nameTag, withFace, faceBits, question, pose3, folk4, JOHN_B, tr, DAY, FONT } from './lib.js';

const FLOOR = 676;
const JX0 = 700;

/** John the Baptist pouring water in the Jordan — a little medallion */
export function johnMedallion(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 54, 36), 0.5, 5), C.ochre).p(c.cut(c.circ(0, 0, 48, 36), 0.5, 5), C.skyBlue);
  s.p(c.cut([[-48, 14], [48, 12], [44, 30], [-44, 30]], 0.4, 6), C.lake2);
  return `${s.out()}<g transform="translate(-6 30) scale(.3)">${person(c, { ...JOHN_B })}</g><path d="${c.ribbon([[12, -4], [16, 20]], 3)}" fill="${C.lake}" opacity=".8"/>`;
}

export default {
  id: 'mt21-authority',
  beats: [
    { v: 23, text: 'Gdy przyszedł do świątyni i nauczał, przystąpili do Niego arcykapłani i starsi ludu z pytaniem:' },
    { v: 23, cont: true, text: '«Jakim prawem to czynisz?' },
    { v: 23, cont: true, text: 'I kto Ci dał tę władzę?»' },
    { v: 24, text: 'Jezus im odpowiedział: «Ja też zadam wam jedno pytanie;' },
    { v: 24, cont: true, text: 'jeśli odpowiecie Mi na nie, i Ja powiem wam, jakim prawem to czynię.' },
    { v: 25, text: 'Skąd pochodził chrzest Janowy: z nieba czy od ludzi?»' },
  ],
  cam: { x: [-80, 120], y: [-70, 40], z: [0.95, 1.14] },
  build(S) {
    const c = S.c;
    // phone: Jesus a little left and the leaders, their tags and the seal moved in from the right edge
    const JX = S.portrait ? 630 : JX0, LX = S.portrait ? -120 : 0;
    const { sunEl, cl1 } = templeCourt(S, { skyCols: DAY, floorY: FLOOR + 40, sanctX: 800, sunAt: [1230, 140] });

    /* ---------- the listeners sitting round Him (drawn once) ---------- */
    const sitL = S.layer({ par: 0.46, sh: 4 });
    const sitters = [[430, false], [560, false]].map(([x, flip], i) => {
      const mem = Array.from({ length: 3 }, (_, k) => ({ x: (k - 1) * 48 + c.rr(-6, 6), y: (k % 2) * 12, s: 1, flip, head: c.rr(-8, 0), armF: c.rr(10, 40), o: { ...folk4(c), pose: 'sit' } }));
      return { i, x, sp: sitL.sprite(`<g transform="scale(.82)">${pose3(c, mem)}</g>`, x, FLOOR - 4) };
    });

    /* ---------- the leaders ---------- */
    const LD = S.layer({ par: 0.46, sh: 4 });
    const LEADERS = [
      { m: priest(c, 0), x: 900, y: FLOOR - 6 }, { m: priest(c, 1), x: 980, y: FLOOR - 22 },
      { m: priest(c, 2), x: 1050, y: FLOOR - 4 }, { m: elder(c, 0), x: 1120, y: FLOOR - 20 },
      { m: elder(c, 1), x: 1190, y: FLOOR - 2 }, { m: elder(c, 2), x: 1260, y: FLOOR - 18 },
    ].map((d, i) => ({ ...d, x: S.portrait ? 900 + (d.x - 900) * 0.86 : d.x, i, seed: c.rr(0, 9), p: S.puppet(LD.add(withFace(d.m, faceBits(c)))) }));   // phone: closer together, the last elder clear of the thread
    LEADERS.forEach((d) => { d.angry = d.p.el.querySelector('[data-part="angry"]'); });
    const tags = [
      { text: tr('arcykapłani', 'chief priests'), x: 975 + LX, y: 300 },
      { text: tr('starsi ludu', 'elders of the people'), x: 1190 + LX, y: 320 },
    ].map((g, i) => ({ ...g, i, el: hanging(LD, nameTag(c, g.text, { size: 16 }), { x: g.x, y: g.y, len: 800 }) }));

    /* ---------- Jesus and the disciples ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = [0, 2, 1].map((k, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, TWELVE_O[k]))) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));

    /* ---------- words and cards ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const ask1 = fx.add(`<g>${bubble(c, [tr('Jakim prawem', 'By what authority'), tr('to czynisz?', 'do you do these things?')], { size: 18, tail: -1 })}</g>`);
    const ask2 = fx.add(`<g>${bubble(c, [tr('Kto Ci dał', 'Who gave you'), tr('tę władzę?', 'this authority?')], { size: 18, tail: 1 })}</g>`);
    const sealM = sheet().p(c.cut(c.circ(0, 0, 34, 24), 0.8, 4), C.terracotta).p(c.cut(c.star(0, 0, 22, 14, 8, 0), 0.4, 3), shade(C.terracotta, -0.15)).out();
    const seal = hanging(fx, `${sealM}<g transform="translate(40 -24) scale(.8)">${question(c)}</g>`, { x: 1060, y: 250, len: 800 });
    const oneCard = hanging(fx, card(c, `<text x="0" y="12" text-anchor="middle" font-family="${FONT}" font-size="56" fill="${C.terracotta}">?</text>`, tr('jedno pytanie', 'one question'), { w: 120, h: 132 }), { x: 800, y: 170, len: 800 });
    const deal = fx.add(`<g>${bubble(c, [tr('Odpowiedzcie,', 'Answer me,'), tr('a i Ja wam powiem', 'and I will tell you')], { size: 18, tail: -1 })}</g>`);
    const skyCard = hanging(fx, card(c, heavenIcon(c), tr('z nieba?', 'from heaven?'), { w: 128, h: 140, face: C.skyVeil }), { x: 620, y: 150, len: 800 });
    const menCard = hanging(fx, card(c, peopleIcon(c), tr('od ludzi?', 'from men?'), { w: 128, h: 140 }), { x: 980, y: 150, len: 800 });
    const john = hanging(fx, johnMedallion(c), { x: 800, y: 230, len: 800 });
    courtFront(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 140, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);
      sitters.forEach((g) => g.sp.set({ x: g.x, y: FLOOR - 4, o: 1 }));

      /* v23a — He teaches; the chief priests and elders come up */
      const approach = es(t, 0.1, 0.6, ease.out);
      const teach = 1 - es(t, 0.5, 0.7);
      const one = es(t, 3.05, 3.3) * (1 - es(t, 4.9, 5.1));
      const choice = es(t, 5.05, 5.3);
      jesus.set({ x: JX, y: FLOOR, s: 1.04, armB: choice * 60 + teach * 30, armF: teach * (50 + bump(t, 0, 0.5) * 20) + one * 100 * (1 - choice) + choice * 70 + bump(t, 4.1, 4.9) * 30, head: -one * 6 + teach * 4, blink: blinkAt(T) });
      DIS.forEach((d) => { d.p.set({ x: 300 - d.i * 56, y: FLOOR - 12 + (d.i % 2) * 10, s: 0.88, head: -choice * 8, blink: blinkAt(T, d.seed) }); });
      LEADERS.forEach((d) => {
        const x = d.x + LX + (1 - approach) * 520 - es(t, 1.0, 1.4) * (d.i === 0 ? 30 : 0);
        const lean = es(t, 4.05, 4.4) * (1 - es(t, 5.0, 5.3)) * 6;
        d.p.set({ x, y: d.y, s: 0.9, flip: true, walk: approach > 0 && approach < 1 ? x * 0.05 + d.i : undefined, armF: d.i === 0 ? bump(t, 1.05, 1.95) * 80 : d.i === 3 ? bump(t, 2.05, 2.95) * 80 : 0, armB: d.i === 1 ? bump(t, 2.05, 2.95) * 110 : 0, lean: -lean, head: -choice * 10 * (d.i % 2 ? 1 : 0.5), blink: blinkAt(T, d.seed), o: seg(t, 0.08, 0.14) });
        fade(d.angry, es(t, 1.0, 1.3) * (1 - es(t, 5.0, 5.3)));
      });
      tags.forEach((g) => {
        const k = es(t, 0.35 + g.i * 0.1, 0.65 + g.i * 0.1, ease.back) * (1 - es(t, 0.95, 1.15));
        swing(g.el, g.x, g.y - (1 - k) * 700, T, 1.4, 0.8, g.i);
      });

      /* v23b/c — "By what authority? Who gave you this authority?" */
      const [p0x, p0y] = headAt(LEADERS[0].x + LX - 30, LEADERS[0].y, 0.9, true);
      const a1 = es(t, 1.05, 1.25, ease.back) * (1 - es(t, 1.95, 2.1));
      pose(ask1, { x: p0x - 30, y: p0y - 34, s: a1, o: a1 > 0.02 ? 1 : 0 });
      const [p2x, p2y] = headAt(LEADERS[3].x + LX, LEADERS[3].y, 0.9, true);
      const a2 = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.95, 3.1));
      pose(ask2, { x: p2x - 40, y: p2y - 34, s: a2, o: a2 > 0.02 ? 1 : 0 });
      const sd = es(t, 2.1, 2.45, ease.back) * (1 - es(t, 2.95, 3.2));
      swing(seal, 1070 + LX, 230 - (1 - sd) * 700, T, 1.6, 0.9, 2);

      /* v24 — "I also will ask you one question; answer it, and I will tell you" */
      const oc = es(t, 3.1, 3.45, ease.back) * (1 - es(t, 5.0, 5.2));
      swing(oneCard, 800, 200 - (1 - oc) * 700, T, 1.4 + bump(t, 4.1, 4.9) * 2.5, 0.8, 1);
      const [jhx, jhy] = headAt(JX, FLOOR, 1.04, false);
      const dk = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.85, 5.0));
      pose(deal, { x: jhx - 40, y: jhy - 30, s: dk, o: dk > 0.02 ? 1 : 0 });
      /* v25a — John's baptism: from heaven, or from men? */
      const sc = es(t, 5.05, 5.4, ease.back);
      const mc = es(t, 5.2, 5.55, ease.back);
      swing(skyCard, 610, 190 - (1 - sc) * 700, T, 1.2, 1.1, 1);
      swing(menCard, 990, 190 - (1 - mc) * 700, T, 1.2, 1.1, 2);
      swing(john, 800, 250 - (1 - es(t, 5.1, 5.45, ease.back)) * 700, T, 1, 0.8, 3);

      S.cam.x = -20 + approach * 60 - es(t, 3.0, 3.4) * 20;
      S.cam.y = -es(t, 3.0, 3.4) * 30 - es(t, 5.0, 5.4) * 30;
      S.cam.z = 1.04 - es(t, 5.0, 5.4) * 0.06;
    };
  },
};
