// J 14,21–24 — love revealed. Close on John: "whoever has My commandments and keeps them loves Me" — he holds a small
// scroll to his heart and a heart glows there; "he will be loved by My Father, and I will love him and show Myself to
// him" — light falls on him from above and Jesus' own light opens round him. Then Judas (not Iscariot) lifts his hand
// by the dark window: "why to us, and not to the world?" Two little paper houses come down from the flies. "If anyone
// loves Me he will keep My word": at the door of the first a small figure holds a scroll; "and My Father will love him,
// and We will come to him and make Our home with him": a light from above and a light from Jesus fly to it — its
// windows and door fill with light, its edges turn gold. "Whoever does not love Me does not keep My words": at the
// shut door of the second, word-slips flutter down and fall away. "The word you hear is not Mine but the Father's who
// sent Me": a long scroll unrolls from the light above down into His hands.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  nightRoom, seatEleven, sitAt, emptySeat, afterTable, EMPTY_X, seatX, NAME, smallHouse, dwellingLight, heart, scrollRolled,
  wordSlip, soulLight, radiance, glowDisc, nameTag, question, hanging, swing, kf, vis, headAt, hand, PI,
} from './lib.js';

const H1 = [590, 455], H2 = [1010, 455];

export default {
  id: 'j14-dwelling',
  beats: [
    { v: 21, text: 'Kto ma przykazania moje i zachowuje je, ten Mnie miłuje.' },
    { v: 21, cont: true, text: 'Kto zaś Mnie miłuje, ten będzie umiłowany przez Ojca mego, a również Ja będę go miłował i objawię mu siebie».' },
    { v: 22 },
    { v: 23, text: 'W odpowiedzi rzekł do niego Jezus: «Jeśli Mnie kto miłuje, będzie zachowywał moją naukę,' },
    { v: 23, cont: true, text: 'a Ojciec mój umiłuje go, i przyjdziemy do niego, i będziemy u niego przebywać.' },
    { v: 24, text: 'Kto Mnie nie miłuje, ten nie zachowuje słów moich.' },
    { v: 24, cont: true, text: 'A nauka, którą słyszycie, nie jest moja, ale Tego, który Mnie posłał, Ojca.' },
  ],
  cam: { x: [-300, 60], y: [-100, 200], z: [1, 1.8] },
  build(S) {
    const c = S.c;
    const R = nightRoom(S);
    const { SEAT, TOP, FLOOR } = R;
    // the light above (flat), the beam onto John
    const hiL = S.layer({ par: 0.33, sh: 0, flat: true });
    const above = hiL.add(`<g>${glowDisc(200, 'halo-glow', 0.9)}<g transform="scale(.34)">${radiance(c, 150)}</g></g>`);
    const gid = S.id('beam');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6dc" stop-opacity="0"/><stop offset=".3" stop-color="#fff6dc" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></linearGradient>`);
    const beam = hiL.add(`<g><path d="${c.poly([[-30, 0], [30, 0], [90, 460], [-90, 460]])}" fill="url(#${gid})"/></g>`);
    // the two little houses on strings, the unrolling scroll
    const hL = S.layer({ par: 0.34, sh: 4 });
    const house1 = hanging(hL, `<g transform="scale(.9)">${smallHouse(c)}</g>`, { x: H1[0], y: H1[1], len: 1000 });
    const light1 = hL.add(`<g><g transform="scale(.9)">${dwellingLight(c)}</g></g>`);
    const keeper = S.puppet(hL.add(person(c, { ...CAST.andrew, robe: C.sageRobe, holdF: `<g transform="rotate(20) scale(.6)">${scrollRolled(c, 40)}</g>` })));
    const house2 = hanging(hL, `<g transform="scale(.9)">${smallHouse(c, { wall: mix(C.stone2, C.night, 0.45), roof: mix(C.roof, C.night, 0.55) })}</g>`, { x: H2[0], y: H2[1], len: 1000 });
    const slips = Array.from({ length: 4 }, () => hL.add(`<g>${wordSlip(c, 26)}</g>`));
    const scrollId = S.id('sc');
    const scroll = hL.add(`<g><path d="${c.cut([[-26, 0], [26, 0], [26, 340], [-26, 340]], 0.5, 10)}" fill="${C.parchment}"/><path d="${Array.from({ length: 18 }, (_, i) => c.ribbon([[-17, 14 + i * 18], [c.rr(4, 17), 14 + i * 18]], 1.4)).join('')}" fill="${C.inkSoft}" opacity=".5"/><path d="${c.cut(c.rect(-32, -8, 64, 10), 0.3, 5)}" fill="${C.wood2}"/></g>`);
    const scrollEnd = hL.add(`<g><path d="${c.cut(c.rect(-32, -5, 64, 10), 0.3, 5)}" fill="${C.wood2}"/><circle r="30" fill="url(#halo-glow)"/></g>`);

    const seatL = S.layer({ par: 0.52, sh: 5 });
    const at = seatEleven(S, seatL);
    seatL.add(`<g transform="translate(${EMPTY_X} ${TOP + 16})">${emptySeat(c)}</g>`);
    const J = at.find((m) => m.k === 'jesus'), JN = at.find((m) => m.k === 'john'), TD = at.find((m) => m.k === 'thaddaeus');
    const tabL = S.layer({ par: 0.55, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${afterTable(c, 860)}</g>`);
    const fx = S.layer({ par: 0.57, sh: 4 });
    const jHeart = fx.add(`<g>${heart(c, 11)}</g>`);
    const jScroll = fx.add(`<g transform="rotate(-20)">${scrollRolled(c, 34)}</g>`);
    const glowJN = fx.add(`<g>${glowDisc(90, 'halo-glow', 1)}</g>`);
    const q = fx.add(`<g>${question(c)}</g>`);
    const tagL = S.layer({ par: 0.52, sh: 4 });
    const tag = hanging(tagL, nameTag(c, NAME.thaddaeus(), { size: 15 }), { x: seatX('thaddaeus'), y: 440, len: 800 });
    const lightA = fx.add(`<g>${soulLight(c, 12)}</g>`), lightB = fx.add(`<g>${soulLight(c, 12)}</g>`);

    return (t, time) => {
      const T = time;
      R.update(T, 1);
      const [jnx, jny] = headAt(JN.x, SEAT, JN.s, false, 62);
      /* v21a — John keeps the word, his heart glows */
      const keep = es(t, 0.1, 0.4) * (1 - es(t, 2.0, 2.3));
      vis(jScroll, { x: JN.x + 12, y: SEAT - 40, s: keep * 0.9, r: -20, o: keep > 0.01 ? 1 : 0 });
      vis(jHeart, { x: JN.x + 2, y: jny - 44, s: es(t, 0.35, 0.6, ease.back) * (1 - es(t, 2.0, 2.3)), o: es(t, 0.35, 0.45) * (1 - es(t, 2.0, 2.3)) });
      /* v21b — loved by the Father (light from above); Jesus shows Himself */
      const loved = es(t, 1.05, 1.35) * (1 - es(t, 2.0, 2.3));
      vis(above, { x: JN.x + 10, y: 250, s: 0.7 + loved * 0.3, o: loved * 0.9 + es(t, 3.95, 4.2) * (1 - es(t, 5.0, 5.3)) + es(t, 6.02, 6.2) });
      if (t > 3.5) pose(above, { x: t < 5.5 ? H1[0] + 30 : 800, y: t < 5.5 ? 230 : 190, s: 1, o: es(t, 3.95, 4.2) * (1 - es(t, 5.0, 5.3)) + es(t, 6.02, 6.2) });
      vis(beam, { x: JN.x + 4, y: 250, o: loved });
      vis(glowJN, { x: (JN.x + 800) / 2, y: jny + 10, s: 0.6 + es(t, 1.4, 1.7) * 0.8, o: es(t, 1.4, 1.7) * (1 - es(t, 2.0, 2.3)) });
      /* v22 — Judas (not Iscariot) asks, pointing to the dark world outside */
      const ask = es(t, 2.05, 2.3) * (1 - es(t, 2.95, 3.2));
      swing(tag, seatX('thaddaeus'), 440 - (1 - ask) * 800, ask > 0.001 ? T : 0, 1, 0.8);
      fade(tag, ask > 0.001 ? 1 : 0);
      const [tdx, tdy] = headAt(TD.x, SEAT, TD.s, false, 62);
      vis(q, { x: tdx + 16, y: tdy - 190, s: ask * 0.9, r: T ? Math.sin(T * 1.4) * 6 : 0, o: ask > 0.01 ? 1 : 0 });
      /* v23 — the little houses; the keeper; two lights come and dwell */
      const hk = es(t, 3.02, 3.35, ease.out) * (1 - es(t, 6.02, 6.3, ease.in) * 0.0);
      const hk2 = es(t, 4.95, 5.25, ease.out);
      swing(house1, H1[0], H1[1] - (1 - hk) * 1000, hk > 0.001 ? T : 0, 0.6, 0.6, 1); fade(house1, hk > 0.001 ? 1 : 0);
      swing(house2, H2[0], H2[1] - (1 - hk2) * 1000, hk2 > 0.001 ? T : 0, 0.6, 0.6, 2); fade(house2, hk2 > 0.001 ? 1 : 0);
      const kp = es(t, 3.3, 3.5);
      keeper.set({ x: H1[0] + 26, y: H1[1] - 6 - (1 - hk) * 1000, s: 0.34, flip: true, o: kp * (1 - es(t, 4.35, 4.55)), armF: 60, blink: blinkAt(T, 4) });
      const dwell = es(t, 4.4, 4.7);
      vis(light1, { x: H1[0], y: H1[1] - (1 - hk) * 1000, s: 1, o: dwell });
      const fl = es(t, 4.05, 4.45, ease.inOut);
      vis(lightA, { x: lerp(H1[0] + 30, H1[0] + 30, fl), y: lerp(250, H1[1] - 60, fl), s: 1, o: fl > 0 && fl < 1 ? 1 : 0 });
      vis(lightB, { x: lerp(800, H1[0] + 30, fl), y: lerp(560, H1[1] - 50, fl) - Math.sin(fl * PI) * 90, s: 1, o: fl > 0 && fl < 1 ? 1 : 0 });
      /* v24a — words fall away from the shut door */
      slips.forEach((el, i) => {
        const k = seg(t, 5.25 + i * 0.1, 5.75 + i * 0.1);
        const x = H2[0] + 34 - 90 + i * 30 + k * 60 + Math.sin(k * 8 + i) * 12, y = lerp(200, H2[1] - 40, Math.min(1, k * 1.6)) + Math.max(0, k - 0.62) * 600;
        vis(el, { x, y, r: k * 300 + i * 30, s: 1, o: k > 0 && k < 1 ? 1 - Math.max(0, k - 0.8) * 5 : 0 });
      });
      /* v24b — the word of the Father unrolls down into His hands */
      const un = es(t, 6.05, 6.55, ease.out);
      const sy = Math.max(0.01, un);
      vis(scroll, { x: 800, y: 200, s: 1, sy: sy * 1.03, o: un > 0.01 ? 1 : 0 });
      vis(scrollEnd, { x: 800, y: 200 + 350 * un, s: 1, o: un > 0.01 ? 1 : 0 });
      // houses step aside for the scroll
      if (t > 6) { swing(house1, H1[0] - un * 30, H1[1], T, 0.6, 0.6, 1); vis(light1, { x: H1[0] - un * 30, y: H1[1], o: dwell }); }

      at.forEach((m) => {
        if (m.k === 'jesus') {
          sitAt(m, SEAT, T, { flip: true, armF: 30 + es(t, 1.35, 1.6) * (1 - es(t, 2.0, 2.2)) * 40 + es(t, 4.0, 4.3) * (1 - es(t, 4.7, 4.9)) * 60 + es(t, 6.05, 6.4) * 10, armB: 14 + es(t, 6.05, 6.4) * 140 + bump(t, 3.1, 3.9) * 70, head: -es(t, 6.05, 6.4) * 10 });
          return;
        }
        if (m.k === 'john') {
          sitAt(m, SEAT, T, { armF: 36 - keep * 18, armB: 14, head: -loved * 12 });
          return;
        }
        if (m.k === 'thaddaeus') {
          sitAt(m, SEAT, T, { armF: 36 + ask * 50, armB: 14 + ask * 130, head: -ask * 6 });
          return;
        }
        sitAt(m, SEAT, T, { head: -es(t, 3.05, 3.4) * 8 * (1 - es(t, 6.8, 7)) });
      });

      S.cam.x = kf(t, [[0, -110], [1.9, -110], [2.3, -280], [2.9, -280], [3.2, 0], [5, 0], [6, 0], [7, 0]]);
      S.cam.y = kf(t, [[0, 150], [1.1, 130], [1.9, 120], [2.3, 100], [2.9, 100], [3.2, 30], [5, 30], [6, 0], [7, 0]]);
      S.cam.z = kf(t, [[0, 1.75], [1.1, 1.6], [1.9, 1.6], [2.3, 1.55], [2.9, 1.55], [3.2, 1.12], [5, 1.12], [6, 1.04], [7, 1.02]]);
    };
  },
};
