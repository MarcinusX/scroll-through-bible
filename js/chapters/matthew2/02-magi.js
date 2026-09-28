// Mt 2,1b–2 — morning over Jerusalem: three Magi in Phrygian caps ride in from the East on their camels and stop
// before the city gate. They get down and ask the townspeople: "Where is the newborn King of the Jews?" A medallion
// of their faraway tower shows the star rising in the East, and they bow: we have come to worship Him.
import { C, person, blinkAt, pose, lerp, hanging, sky, sheet, shade, mix } from '../kit.js';
import { band, cloud, sun, palm, grass, rock, bush } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import {
  LOOK, DAWN, magus, camelRider, walkCamel, jerusalem, folk, group, speech, placeTag, infant, ziggurat, bigStar,
  hangAt, vpose, sparkle, kf, GLYPH, crown, tr, PI,
} from './lib.js';

const Y = 700;
const CX = [1010, 1150, 1290];      // where the camels stop
const MX = [760, 870, 980];          // where the Magi stand

export default {
  id: 'mt2-magi',
  beats: [
    { v: 1, cont: true, text: 'oto Mędrcy ze Wschodu przybyli do Jerozolimy' },
    { v: 2, text: 'i pytali: «Gdzie jest nowo narodzony król żydowski?' },
    { v: 2, cont: true, text: 'Ujrzeliśmy bowiem jego gwiazdę na Wschodzie i przybyliśmy oddać mu pokłon».' },
  ],
  cam: { x: [-40, 120], y: [0, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, DAWN);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 40, { rays: C.apricot, disc: mix(C.sun, C.peach, 0.3), inner: C.dawn }), { x: 0, y: 0, len: 800 });
    const cl = hanging(hangL, cloud(c, 170, C.cream, mix(C.dawn, C.lavender, 0.3)), { x: 0, y: 0, len: 800 });

    /* the city on its hill behind the wall */
    const far = S.layer({ par: 0.06, sh: 2 });
    far.add(band(c, { y: 470, amps: [18, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.lavender, 0.25) }).markup);
    const city = S.layer({ par: 0.14, sh: 3 });
    city.add(`<g transform="translate(560 575)">${jerusalem(c, 0.66, { tglow: false })}</g>`);

    /* the city wall with its gate, and the square before it */
    const wallL = S.layer({ par: 0.3, sh: 4 });
    const W = sheet();
    const WT = 500, WB = 650, GX = 430;
    const gate = [[GX - 58, WB + 2], [GX - 58, WB - 110], ...c.arc(GX, WB - 110, 58, 56, PI, 2 * PI, 10), [GX + 58, WB + 2]];
    W.p(c.cut([[-900, WB + 4], [-900, WT], [2500, WT], [2500, WB + 4]], 0.6, 12) + c.hole(gate, 0.4, 6), mix(C.stone, C.sand, 0.35));
    let cr = '';
    for (let x = -900; x < 2500; x += 46) cr += c.cut(c.rect(x, WT - 20, 26, 22), 0.3, 5);
    W.p(cr, mix(C.stone, C.sand, 0.35));
    let courses = '';
    for (let y = WT + 26; y < WB; y += 30) courses += c.ribbon([[-900, y], [2500, y + c.rr(-2, 2)]], 1.3);
    W.x(courses, shade(C.stone, -0.18), 'opacity=".45"');
    W.p(c.cut(c.rect(GX - 90, WT - 70, 180, 74), 0.4, 6) + c.cut(c.rect(GX - 100, WT - 84, 200, 16), 0.3, 6), mix(C.stone2, C.sand2, 0.3));
    wallL.add(`<g><path d="${c.cut(gate, 0.4, 6)}" fill="${mix(C.soilDark, C.wood2, 0.3)}"/></g>`);
    wallL.add(W.out());
    const ground = S.layer({ par: 0.4, sh: 3 });
    ground.add(sheet().p(c.ridge(c.wave(WB + 4, [2, 1], [500, 140]), -900, 2500, 1700, 12, 0.6), mix(C.sand, C.sand2, 0.4)).out());
    ground.add(palm(c, 180, WB + 30, 230) + palm(c, 1560, WB + 40, 250) + bush(c, 1420, WB + 40, 90, C.sage, C.moss));
    ground.add(grass(c, { x0: -800, x1: 2400, y: WB + 12, n: 24, h: 12, color: C.olive }));

    /* the townspeople by the gate */
    const P = S.layer({ par: 0.5, sh: 5 });
    P.add(`<g>${group(c, [
      { x: 470, y: Y - 8, s: 0.86, flip: true, o: folk(c, false) },
      { x: 540, y: Y + 4, s: 0.9, flip: true, o: folk(c, true) },
    ])}</g>`);
    const answer = S.puppet(P.add(person(c, folk(c, true, { robe: C.sageRobe, mantle: C.wood3 }))));
    const kid = S.puppet(P.add(person(c, folk(c, true, { robe: C.skyVeil, beard: 'none', hairStyle: 'curly' }))));

    /* the camels, the riders; then the Magi on foot */
    const camL = S.layer({ par: 0.5, sh: 5 });
    const camels = [2, 1, 0].map((i) => ({ i, el: camL.add(camelRider(c, i)), plain: null }));
    const plainL = S.layer({ par: 0.5, sh: 5 });
    const plains = [2, 1, 0].map((i) => ({ i, el: plainL.add(camelRider(c, i, { rider: false })) }));
    const M = S.layer({ par: 0.5, sh: 5 });
    const magi = [0, 1, 2].map((i) => ({ i, st: S.puppet(M.add(magus(c, i))), kn: S.puppet(M.add(magus(c, i, { pose: 'kneel' }))), seed: c.rr(0, 9) }));

    /* words and pictures */
    const X = S.layer({ par: 0.45, sh: 5 });
    const name = hanging(X, placeTag(c, tr('Jerozolima', 'Jerusalem'), 22), { x: 0, y: 0, len: 600 });
    const east = hanging(X, placeTag(c, tr('Mędrcy ze Wschodu', 'wise men from the east'), 19), { x: 0, y: 0, len: 600 });
    const askIcon = `<g transform="translate(-26 8) scale(.7)">${infant(c)}</g><g transform="translate(-8 -20) scale(.8)">${crown(c)}</g><g transform="translate(34 -2) scale(1.1)">${GLYPH.q(c)}</g>`;
    const ask = X.add(`<g>${speech(c, askIcon, { w: 118, h: 78, flip: true })}</g>`);
    const qs = [0, 1].map(() => X.add(`<g>${GLYPH.q(c, C.wood2)}</g>`));
    // the medallion: their tower in the East, the star rising
    const id = S.id('clipE');
    const R = 92;
    const medInner = `<clipPath id="${id}"><circle r="${R}"/></clipPath><g clip-path="url(#${id})"><rect x="-120" y="-120" width="240" height="240" fill="${C.night}"/><path d="${c.poly(c.circ(-50, -40, 1.6, 6)) + c.poly(c.circ(40, -60, 1.4, 6)) + c.poly(c.circ(64, -10, 1.8, 6)) + c.poly(c.circ(-70, 10, 1.3, 6)) + c.poly(c.circ(10, -80, 1.5, 6))}" fill="${C.star}"/><g transform="translate(34 -40)">${bigStar(c, 12)}</g><path d="${c.ridge(c.wave(58, [4, 2], [120, 50]), -120, 120, 130, 8, 0.6)}" fill="${mix(C.dune, C.indigo, 0.45)}"/><g transform="translate(-30 58)">${ziggurat(c, 90, mix(C.dune, C.indigo, 0.3))}</g>${[-44, -30, -16].map((x, k) => `<g transform="translate(${x} ${-30 + (k % 2) * 2}) scale(.2)">${magus(c, k, { robe: mix(C.indigo, C.night, 0.4), mantle: null })}</g>`).join('')}</g>`;
    const med = hanging(X, `${sheet().p(c.cut(c.circ(0, 0, R + 8, 40), 0.5, 5), C.ochre).out()}${medInner}<g transform="translate(0 ${R + 28})">${placeTag(c, tr('Jego gwiazda na Wschodzie', 'his star in the east'), 17)}</g>`, { x: 0, y: 0, len: 700 });
    const glints = [0, 1, 2].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1260, y: 170, r: Math.sin(T * 0.5) });
      pose(cl, { x: 560 + Math.sin(T * 0.1) * 20, y: 140, r: Math.sin(T * 0.6) * 1.2 });

      /* v1b — the Magi ride in from the East and stop before the gate */
      const ride = es(t, -0.25, 0.7, ease.out);
      const off = t < 1.0 ? 1 : 0;
      const down = es(t, 1.0, 1.08);
      camels.forEach((m) => {
        const x = lerp(CX[m.i] + 900 + m.i * 60, CX[m.i], ride);
        const walking = ride > 0 && ride < 0.995;
        pose(m.el, { x, y: Y + 6 - m.i * 4, s: 0.78, sx: -1, o: 1 - down });
        walkCamel(m.el, walking ? x * 0.05 + m.i : 0, walking ? 1 : 0);
      });
      plains.forEach((m) => pose(m.el, { x: CX[m.i], y: Y + 6 - m.i * 4, s: 0.78, sx: -1, o: down }));
      const nk = es(t, 0.15, 0.45, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      hangAt(name, 430, lerp(-500, 330, nk), T, nk > 0.001 ? 1 : 0, 1.3, 0.9, 1);
      const ek = es(t, 0.35, 0.6, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      hangAt(east, 1150, lerp(-500, 250, ek), T, ek > 0.001 ? 1 : 0, 1.3, 0.9, 3);

      /* v2a — they get down and ask the people at the gate */
      const kneel = es(t, 2.42, 2.5);
      magi.forEach((m) => {
        const x = lerp(CX[m.i] - 60, MX[m.i], es(t, 1.02, 1.4));
        const walking = t > 1.02 && t < 1.4;
        const speak = m.i === 0 ? bump(t, 1.35, 1.95) : 0;
        const tellEast = m.i === 1 ? bump(t, 2.05, 2.5) : 0;
        m.st.set({ x, y: Y + 2 + m.i * 2, s: 0.94, flip: true, o: down * (1 - kneel), walk: walking ? x * 0.06 + m.i : undefined, armF: 20 + speak * 70 + tellEast * 120, armB: 10 + speak * 30, head: -speak * 6 - tellEast * 14, blink: blinkAt(T, m.seed) });
        const bow = es(t, 2.5, 2.8);
        m.kn.set({ x: MX[m.i] - 6, y: Y + 2 + m.i * 2, s: 0.94, flip: true, o: kneel, armF: 60 - bow * 20, armB: 40, head: bow * 22, lean: bow * 20, blink: 0 });
      });
      const ak = es(t, 1.35, 1.5, ease.back) * (1 - es(t, 2.02, 2.1));
      vpose(ask, { x: MX[0] - 30, y: Y - 200, s: ak, o: ak > 0.01 ? 1 : 0 });
      const puzzled = es(t, 1.55, 1.8);
      answer.set({ x: 610, y: Y + 8, s: 0.92, flip: false, armF: puzzled * 50 * (1 - es(t, 2.1, 2.3)), armB: puzzled * 70 * (1 - es(t, 2.1, 2.3)), head: -puzzled * 8, blink: blinkAt(T, 2) });
      kid.set({ x: 580, y: Y + 14, s: 0.55, flip: false, armF: 30, head: -6, blink: blinkAt(T, 5) });
      qs.forEach((q, i) => {
        const k = es(t, 1.6 + i * 0.1, 1.8 + i * 0.1, ease.back) * (1 - es(t, 2.02, 2.12));
        vpose(q, { x: 560 + i * 60, y: Y - 230 - i * 20 + Math.sin(T * 2 + i) * 4, s: k * 1.2, r: Math.sin(T * 1.5 + i) * 10, o: k > 0.01 ? 1 : 0 });
      });

      /* v2b — the star seen in the East; they bow: we have come to worship Him */
      const mk = es(t, 2.05, 2.4, ease.out);
      hangAt(med, 820, lerp(-500, 250, mk), T, mk > 0.001 ? 1 : 0, 1.1, 0.8, 5);
      glints.forEach((g, i) => {
        const k = es(t, 2.3 + i * 0.06, 2.5 + i * 0.06), a = T * 0.7 + i * 2.1;
        vpose(g, { x: 820 + Math.cos(a) * 118, y: 250 + Math.sin(a) * 110, s: k * 0.9, r: T * 30, o: k });
      });

      S.cam.x = lerp(110, 40, es(t, 0.2, 1.3));
      S.cam.y = lerp(20, 40, es(t, 1.0, 1.4));
      S.cam.z = 1 + es(t, 1.1, 1.5) * 0.06 - es(t, 2.0, 2.4) * 0.04;
    };
  },
};
