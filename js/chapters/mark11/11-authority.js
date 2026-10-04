// Mk 11,27–30 — walking in the Temple courts, Jesus is met by the chief priests, the scribes and the
// elders: "By what authority?" He answers with one question — a card comes down from the flies and
// opens in two: John's baptism, from heaven or from men?
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { templeCourt, courtFront, priest, scribe, elder, heavenIcon, peopleIcon, TWELVE_O, headAt, bubble, card, nameTag, withFace, faceBits, question, dove, townsfolk, FONT } from './lib.js';
import { JOHN_B } from '../mark1/lib.js';

const PI = Math.PI;
const FLOOR = 676;

/** John the Baptist pouring water in the Jordan — a little medallion */
function johnMedallion(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 54, 36), 0.5, 5), C.ochre).p(c.cut(c.circ(0, 0, 48, 36), 0.5, 5), C.skyBlue);
  s.p(c.cut([[-48, 14], [48, 12], [44, 30], [-44, 30]], 0.4, 6), C.lake2);
  const j = person(c, { ...JOHN_B });
  return `${s.out()}<g transform="translate(-6 30) scale(.3)">${j}</g><path d="${c.ribbon([[12, -4], [16, 20]], 3)}" fill="${C.lake}" opacity=".8"/>`;
}

export default {
  id: 'm11-authority',
  beats: [
    { v: 27, text: 'Przyszli znowu do Jerozolimy.' },
    { v: 27, cont: true, text: 'Kiedy chodził po świątyni, przystąpili do Niego arcykapłani, uczeni w Piśmie i starsi' },
    { v: 28, text: 'i zapytali Go: «Jakim prawem to czynisz?' },
    { v: 28, cont: true, text: 'I kto Ci dał tę władzę, żeby to czynić?»' },
    { v: 29, text: 'Jezus im odpowiedział: «Zadam wam jedno pytanie.' },
    { v: 29, cont: true, text: 'Odpowiedzcie Mi na nie, a powiem wam, jakim prawem to czynię.' },
    { v: 30, text: 'Czy chrzest Janowy pochodził z nieba, czy też od ludzi?' },
    { v: 30, cont: true, text: 'Odpowiedzcie Mi!»' },
  ],
  cam: { x: [-80, 120], y: [-70, 40], z: [0.95, 1.14] },
  build(S) {
    const c = S.c;
    // phone: the six leaders stand closer together, their name tags and the seal hang inside the screen
    const P = S.portrait;
    const LX = P ? [855, 895, 935, 975, 1015, 1055] : null;
    const SEALX = P ? 1000 : 1070;
    const SKY = ['#d0e2dd', '#f1e6c9', '#f8ebd3'];
    const { sk, sunEl, cl1 } = templeCourt(S, { skyCols: SKY, floorY: FLOOR + 40, sanctX: 800, sunAt: [1230, 140] });

    /* ---------- the leaders ---------- */
    const LD = S.layer({ par: 0.46, sh: 4 });
    const LEADERS = [
      { m: priest(c, 0), x: 930, y: FLOOR - 6, k: 'p' }, { m: priest(c, 1), x: 1010, y: FLOOR - 22, k: 'p' },
      { m: scribe(c, 0), x: 1080, y: FLOOR - 4, k: 's' }, { m: scribe(c, 2), x: 1150, y: FLOOR - 20, k: 's' },
      { m: elder(c, 0), x: 1220, y: FLOOR - 2, k: 'e' }, { m: elder(c, 1), x: 1290, y: FLOOR - 18, k: 'e' },
    ].map((d, i) => ({ ...d, x: LX ? LX[i] : d.x, i, seed: c.rr(0, 9), p: S.puppet(LD.add(withFace(d.m, faceBits(c)))) }));
    LEADERS.forEach((d) => { d.angry = d.p.el.querySelector('[data-part="angry"]'); });
    const tags = [
      { text: tr('arcykapłani', 'chief priests'), x: P ? 885 : 970, y: 300 },
      { text: tr(['uczeni', 'w Piśmie'], ['scribes']), x: P ? 985 : 1115, y: 330 },
      { text: tr('starsi', 'elders'), x: P ? 1070 : 1255, y: 300 },
    ].map((g, i) => ({ ...g, i, el: hanging(LD, nameTag(c, g.text, { size: 16 }), { x: g.x, y: g.y, len: 800 }) }));

    /* ---------- Jesus and the disciples, walking in the porch ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = [0, 2, 1, 3].map((k, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, TWELVE_O[k]))) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));

    /* ---------- words and cards ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const ask1 = fx.add(`<g>${bubble(c, [tr('Jakim prawem', 'By what authority'), tr('to czynisz?', 'do you do these things?')], { size: 18, tail: -1 })}</g>`);
    const ask2 = fx.add(`<g>${bubble(c, [tr('Kto Ci dał', 'Who gave you'), tr('tę władzę?', 'this authority?')], { size: 18, tail: 1 })}</g>`);
    // a seal of authority with a question
    const sealM = sheet().p(c.cut(c.circ(0, 0, 34, 24), 0.8, 4), C.terracotta).p(c.cut(c.star(0, 0, 22, 14, 8, 0), 0.4, 3), shade(C.terracotta, -0.15)).out();
    const seal = hanging(fx, `${sealM}<g transform="translate(40 -24) scale(.8)">${question(c)}</g>`, { x: SEALX, y: 250, len: 800 });
    // "one question": a single card with a big "1?"
    const oneCard = hanging(fx, card(c, `<text x="0" y="12" text-anchor="middle" font-family="${FONT}" font-size="56" fill="${C.terracotta}">?</text>`, tr('jedno pytanie', 'one question'), { w: 120, h: 132 }), { x: 800, y: 170, len: 800 });
    // the two answers
    const skyCard = hanging(fx, card(c, heavenIcon(c), tr('z nieba?', 'from heaven?'), { w: 128, h: 140, face: C.skyVeil }), { x: 620, y: 150, len: 800 });
    const menCard = hanging(fx, card(c, peopleIcon(c), tr('od ludzi?', 'from men?'), { w: 128, h: 140 }), { x: 980, y: 150, len: 800 });
    const john = hanging(fx, johnMedallion(c), { x: 800, y: 230, len: 800 });
    const jSay = fx.add(`<g>${bubble(c, [tr('Odpowiedzcie Mi!', 'Answer me!')], { size: 19, tail: 1 })}</g>`);
    courtFront(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 140, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);

      /* v27 — back in Jerusalem; walking in the Temple; the leaders come up to Him */
      const inK = es(t, 0.0, 0.8, ease.out);
      const stroll = es(t, 1.0, 1.5);
      const jx = lerp(260, 640, inK) + stroll * 80;
      const walking = (inK > 0 && inK < 1) || (stroll > 0 && stroll < 1);
      const approach = es(t, 1.05, 1.6, ease.out);
      const one = es(t, 4.05, 4.3) * (1 - es(t, 5.9, 6.1));
      const choice = es(t, 6.05, 6.3);
      const answerMe = es(t, 7.05, 7.25);
      jesus.set({ x: jx, y: FLOOR, s: 1.04, walk: walking ? jx * 0.05 : undefined, armB: choice * 60 + answerMe * 30, armF: one * 100 * (1 - choice) + choice * 70 + answerMe * 30 + bump(t, 5.1, 5.9) * 20, head: -one * 6 + answerMe * 4, blink: blinkAt(T) });
      DIS.forEach((d) => { const x = jx - 110 - d.i * 56; d.p.set({ x, y: FLOOR - 12 + (d.i % 2) * 10, s: 0.88, walk: walking ? x * 0.05 + d.i : undefined, head: -choice * 8, armF: bump(t, 2.1, 3.9) * (d.i === 0 ? 40 : 0), blink: blinkAt(T, d.seed) }); });
      LEADERS.forEach((d) => {
        const x = d.x + (1 - approach) * 520 - es(t, 2.0, 2.4) * (d.i === 0 ? 30 : 0);
        const lean = es(t, 5.05, 5.4) * (1 - es(t, 6.0, 6.3)) * 6;
        d.p.set({ x, y: d.y, s: 0.9, flip: true, walk: approach > 0 && approach < 1 ? x * 0.05 + d.i : undefined, armF: d.i === 0 ? bump(t, 2.05, 2.95) * 80 : d.i === 2 ? bump(t, 3.05, 3.95) * 80 : 0, armB: d.i === 1 ? bump(t, 3.05, 3.95) * 110 : 0, lean: -lean, head: -choice * 10 * (d.i % 2 ? 1 : 0.5), blink: blinkAt(T, d.seed), o: seg(t, 1.0, 1.1) });
        fade(d.angry, es(t, 2.0, 2.3) * (1 - es(t, 6.0, 6.3)));
      });
      tags.forEach((g) => {
        const k = es(t, 1.35 + g.i * 0.1, 1.7 + g.i * 0.1, ease.back) * (1 - es(t, 1.95, 2.2));
        swing(g.el, g.x, g.y - (1 - k) * 700, T, 1.4, 0.8, g.i);
      });

      /* v28 — "By what authority? Who gave you this authority?" */
      const [p0x, p0y] = headAt(LEADERS[0].x, LEADERS[0].y, 0.9, true);
      const a1 = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.95, 3.1));
      pose(ask1, { x: p0x - 30, y: p0y - 34, s: a1, o: a1 > 0.02 ? 1 : 0 });
      const [p2x, p2y] = headAt(LEADERS[2].x, LEADERS[2].y, 0.9, true);
      const a2 = es(t, 3.05, 3.25, ease.back) * (1 - es(t, 3.95, 4.1));
      pose(ask2, { x: p2x - 40, y: p2y - 34, s: a2, o: a2 > 0.02 ? 1 : 0 });
      const sd = es(t, 3.1, 3.45, ease.back) * (1 - es(t, 3.95, 4.2));
      swing(seal, SEALX, 230 - (1 - sd) * 700, T, 1.6, 0.9, 2);

      /* v29 — "I will ask you one question" */
      const oc = es(t, 4.1, 4.45, ease.back) * (1 - es(t, 6.0, 6.2));
      swing(oneCard, 800, 200 - (1 - oc) * 700, T, 1.4 + bump(t, 5.1, 5.9) * 2, 0.8, 1);
      /* v30 — John's baptism: from heaven, or from men? */
      const sc = es(t, 6.05, 6.4, ease.back);
      const mc = es(t, 6.2, 6.55, ease.back);
      const swingAmp = 1.2 + answerMe * 3;
      swing(skyCard, 610, 190 - (1 - sc) * 700, T, swingAmp, 1.1, 1);
      swing(menCard, 990, 190 - (1 - mc) * 700, T, swingAmp, 1.1, 2);
      swing(john, 800, 250 - (1 - es(t, 6.1, 6.45, ease.back)) * 700, T, 1, 0.8, 3);
      const [jhx, jhy] = headAt(jx, FLOOR, 1.04, false);
      const js = es(t, 7.05, 7.25, ease.back);
      pose(jSay, { x: jhx - 10, y: jhy - 36, s: js, o: js > 0.02 ? 1 : 0 });

      S.cam.x = -40 + inK * 40 + approach * (P ? 100 : 60) - es(t, 4.0, 4.4) * 40;
      S.cam.y = -es(t, 4.0, 4.4) * 30 - es(t, 6.0, 6.4) * 30;
      S.cam.z = 1.04 - es(t, 6.0, 6.4) * 0.06;
    };
  },
};
