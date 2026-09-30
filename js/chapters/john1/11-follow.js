// J 1,35–39 — The next day John stands with two of his disciples. Jesus walks by: "Behold, the Lamb of God!"
// The two go after Jesus; He turns: "What are you looking for?" — "Rabbi, where are you staying?" — "Come and see."
// A house opens like a doll's house: they sit with Him for the rest of the day; golden light, the tenth hour.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, olive, cypress, sun, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { DAY, GOLDEN, JOHN_B, jordanSet, headAt, bubble, hungPlate, hungWord, lamb, houseSection, handLamp, sundial, glowDisc, voiceRings, PI } from './lib.js';

const BANK = 770;
const HOUSE = { x0: 520, x1: 1080, floor: 650, ceil: 330 };

export default {
  id: 'j1-follow',
  beats: [
    { v: 35 },
    { v: 36 },
    { v: 37 },
    { v: 38, text: 'Jezus zaś odwróciwszy się i ujrzawszy, że oni idą za Nim, rzekł do nich: «Czego szukacie?»' },
    { v: 38, cont: true, text: 'Oni powiedzieli do Niego: «Rabbi! - to znaczy: Nauczycielu - gdzie mieszkasz?»' },
    { v: 39, text: 'Odpowiedział im: «Chodźcie, a zobaczycie».' },
    { v: 39, cont: true, text: 'Poszli więc i zobaczyli, gdzie mieszka, i tego dnia pozostali u Niego.' },
    { v: 39, cont: true, text: 'Było to około godziny dziesiątej.' },
  ],
  cam: { x: [-40, 260], y: [-30, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const PT = S.portrait;             // phone: John and his two disciples stand together in view; Jesus has passed them by the end of the beat
    const MORN = ['#d3e3dd', '#f1e6cb', '#f7e9ce'];
    const J = jordanSet(S, { skyCols: MORN, sunAt: [1230, 170] });
    const farPeople = crowd(S, J.far, [{ y: 584, s: 0.4, n: 8, x0: 150, x1: 1450 }]);
    const R = J.riverLayer();
    J.waterFront(R);
    const { N } = J.nearBank();
    const JOX = PT ? 520 : 470;
    const john = S.puppet(N.add(person(c, { ...JOHN_B })));
    const andrew = S.puppet(N.add(person(c, { ...CAST.andrew })));
    const jn = S.puppet(N.add(person(c, { ...CAST.john })));
    const jesus = S.puppet(N.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(N, c, { n: 3, color: C.clay, r: 36, w: 5, both: false });
    const T = S.layer({ par: 0.45, sh: 6 });
    const lambPlate = T.add(hungPlate(c, `<g transform="translate(-4 22) scale(1.1)">${lamb(c)}</g>`, { r: 46 }));
    const askEl = T.add(`<g>${bubble(c, tr('Czego szukacie?', 'What are you looking for?'), { size: 21, tail: 1 })}</g>`);
    const ansEl = T.add(`<g>${bubble(c, [tr('Rabbi,', 'Rabbi,'), tr('gdzie mieszkasz?', 'where are you staying?')], { size: 20, tail: -1 })}</g>`);
    const rabbi = T.add(hungWord(c, tr('Rabbi = Nauczycielu', 'Rabbi = Teacher'), { size: 20 }));
    const comeEl = T.add(`<g>${bubble(c, tr('Chodźcie, a zobaczycie', 'Come, and see'), { size: 21, tail: 1 })}</g>`);
    J.foreground();

    /* ---------- the house where He stays, at the tenth hour ---------- */
    const house = [];
    const hs = sky(S, GOLDEN, { name: 'gold' });
    house.push(hs.layer);
    const hH = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hH, sun(c, 52, { rays: C.sunDeep, disc: C.apricot, inner: '#f3c98f' }), { x: 1230, y: 300, len: 700 });
    house.push(hH);
    const hB = S.layer({ par: 0.12, sh: 2 });
    hB.add(band(c, { y: 520, amps: [18, 8, 3], lens: [1000, 360, 130], color: mix(C.hillMid, C.peach, 0.35) }).markup);
    hB.add(olive(c, 300, 600, 0.9) + cypress(c, 1330, 600, 150) + olive(c, 1460, 610, 0.8));
    hB.add(sheet().p(c.ridge(c.wave(606, [8, 3], [600, 180]), -900, 2500, 1700, 12, 1), mix(C.hillNear, C.wheat, 0.3)).out());
    house.push(hB);
    const hsec = houseSection(c, { ...HOUSE, doorX: 70 });
    const hIn = S.layer({ par: 0.3, sh: 3 });
    hIn.add(hsec.back);
    const beam = hIn.add(`<path d="${c.poly([[HOUSE.x1 - 170, HOUSE.ceil + 64], [HOUSE.x1 - 96, HOUSE.ceil + 64], [HOUSE.x1 - 260, HOUSE.floor + 20], [HOUSE.x1 - 520, HOUSE.floor + 20]])}" fill="#ffd98a" opacity=".0"/>`);
    const lampEl = hIn.add(`<g>${handLamp(c, { glowR: 90 })}</g>`);
    house.push(hIn);
    const hP = S.layer({ par: 0.3, sh: 4 });
    const jS = S.puppet(hP.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const aS = S.puppet(hP.add(person(c, { ...CAST.andrew, pose: 'sit' })));
    const jnS = S.puppet(hP.add(person(c, { ...CAST.john, pose: 'sit' })));
    hP.add(hsec.front + hsec.stairs);
    house.push(hP);
    const hT = S.layer({ par: 0.3, sh: 6 });
    const dial = hT.add(hungPlate(c, `<g transform="translate(0 16)">${sundial(c, 44, 10)}</g><text x="0" y="46" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="16" font-style="italic" fill="${C.ink}">${tr('godzina X', 'the tenth hour')}</text>`, { r: 60 }));
    house.push(hT);
    const warm = S.layer({ par: 0, sh: 1, flat: true });
    warm.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#f2a64e"/>`);
    house.push(warm);

    return (t, time) => {
      J.update(t, es(t, 5.85, 6.2) > 0.98 ? 0 : time);
      /* v35: John with two of his disciples */
      /* v36: Jesus walks by — "Behold, the Lamb of God" */
      const pass = es(t, 0.9, PT ? 1.9 : 2.2, ease.sine);
      const jx = lerp(-200, PT ? 980 : 900, pass);
      const point = es(t, 1.15, 1.35) * (1 - es(t, 2.1, 2.3));
      /* v37: the two go after Jesus */
      const go = es(t, 2.05, 2.9);
      /* v38a: He turns */
      const turn = es(t, 3.1, 3.2);
      const jxs = jx + go * 0 ;
      /* v39a: come and see — they walk off to the right */
      const away = PT ? es(t, 5.76, 6.05) : es(t, 5.62, 6.0);
      const jxf = jxs + away * 700;
      const walking = (pass > 0 && pass < 1) || (away > 0 && away < 1);
      jesus.set({ x: jxf, y: BANK, s: 1.05, flip: turn > 0.5 && away < 0.05, walk: walking ? jxf * 0.05 : undefined, armF: 12 + bump(t, 3.2, 3.9) * 40 + es(t, 5.05, 5.3) * (1 - es(t, 5.5, 5.6)) * 70, armB: es(t, 5.05, 5.3) * (1 - es(t, 5.5, 5.6)) * 40, head: turn * 4, blink: blinkAt(time, 2) });
      const ax = (PT ? lerp(630, 720, go) : lerp(560, 640, go)) + away * 700, jnx = (PT ? lerp(740, 822, go) : lerp(330, 720, go)) + away * 700;
      const walkD = (go > 0 && go < 1) || (away > 0 && away < 1);
      andrew.set({ x: ax, y: BANK + 6, s: 1.0, flip: false, walk: walkD ? ax * 0.05 : undefined, armF: 10 + bump(t, 4.1, 4.9) * 60, head: -bump(t, 1.2, 2.0) * 4, blink: blinkAt(time, 3) });
      jn.set({ x: jnx, y: BANK + 10, s: 0.97, flip: false, walk: walkD ? jnx * 0.05 : undefined, armF: 10 + bump(t, 4.2, 4.9) * 40, blink: blinkAt(time, 4) });
      john.set({ x: JOX, y: BANK - 2, s: 1.03, flip: false, armF: 16 + point * 90 + es(t, 2.6, 2.9) * 20, armB: es(t, 2.6, 2.9) * 30, head: -point * 4 + es(t, 2.6, 2.9) * 8, blink: blinkAt(time, 1) });
      const [hx, hy] = headAt(JOX, BANK - 2, 1.03, false);
      voice(hx + 22, hy + 4, point, time, { spread: 2.2, s0: 0.6, dir: 1 });
      const lp = es(t, 1.2, 1.45, ease.out) * (1 - es(t, 2.5, 2.8, ease.in));
      const [jhx, jhy] = headAt(jx, BANK, 1.05, false);
      pose(lambPlate, { x: jhx, y: lerp(-400, jhy - 110, lp), r: Math.sin(t * 3.6) * 1.6, o: lp > 0.01 ? 1 : 0 });
      pose(askEl, { x: jhx - 60, y: jhy - 30, s: es(t, 3.2, 3.4, ease.back), o: seg(t, 3.18, 3.22) * (1 - seg(t, 3.95, 4.0)) });
      const [ahx, ahy] = headAt(ax, BANK + 6, 1, false);
      pose(ansEl, { x: ahx + 50, y: ahy - 20, s: es(t, 4.1, 4.3, ease.back), o: seg(t, 4.08, 4.12) * (1 - seg(t, 4.95, 5.0)) });
      const rb = es(t, 4.3, 4.6, ease.out) * (1 - es(t, 5.0, 5.2, ease.in));
      pose(rabbi, { x: 720, y: lerp(-400, 330, rb), r: Math.sin(t * 4.0) * 1.5, o: rb > 0.01 ? 1 : 0 });
      pose(comeEl, { x: jhx - 60, y: jhy - 30, s: es(t, 5.05, 5.2, ease.back), o: seg(t, 5.03, 5.07) * (1 - (PT ? seg(t, 5.78, 5.83) : seg(t, 5.55, 5.6))) });
      farPeople.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > jx, blink: blinkAt(time, m.seed) }));

      /* v39b: they came and saw where He was staying, and stayed with Him */
      const inK = es(t, 5.85, 6.2);
      house.forEach((L) => L.fade(L === warm ? 0 : inK));
      const gold = es(t, 7.02, 7.5);
      warm.fade(inK * gold * 0.12);
      hs.set(...GOLDEN.map((col, i) => mix(col, ['#e2a57a', '#eeb780', '#f4cf9c'][i], gold)));
      pose(sunEl, { x: 1230, y: lerp(260, 380, gold), r: Math.sin(time * 0.5) });
      pose(beam, { o: 0.12 + gold * 0.25 });
      pose(lampEl, { x: 640, y: HOUSE.floor + 4, s: 1, o: 1 });
      const talk = time ? Math.sin(time * 1.4) : 0;
      jS.set({ x: 800, y: HOUSE.floor + 4, s: 1.02, flip: false, armF: 30 + talk * 10 * es(t, 6.2, 6.5), armB: 20 + es(t, 6.3, 6.6) * 30, head: -2, blink: blinkAt(time, 2) });
      aS.set({ x: 950, y: HOUSE.floor + 8, s: 0.95, flip: true, armF: 30, head: 6, blink: blinkAt(time, 3) });
      jnS.set({ x: 1010, y: HOUSE.floor + 14, s: 0.92, flip: true, armF: 40, armB: 20, head: 8, blink: blinkAt(time, 4) });
      const dk = es(t, 7.1, 7.4, ease.out);
      pose(dial, { x: 690, y: lerp(-400, 250, dk), r: Math.sin(t * 3.2) * 1.4, o: dk > 0.01 ? 1 : 0 });

      S.cam.x = (PT ? 0 : 60) * es(t, 2.2, 3.1) * (1 - es(t, 5.7, 6.0));
      S.cam.z = 1.02 + 0.05 * es(t, 3.0, 3.3) * (1 - es(t, 5.0, 5.4));
    };
  },
};
