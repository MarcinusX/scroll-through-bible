// J 3,1–2 — Jerusalem asleep under the stars. A Pharisee, Nicodemus, a ruler of the Jews, steps out of a group
// of his colleagues; when they go home he lights a lantern and climbs the outside stairs to the roof
// where Jesus sits by a lamp. "Rabbi, we know you are a teacher come from God": a beam of light
// falls on Jesus; the signs He did (the jars of Cana) hang down around Him.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix, curtains } from '../kit.js';
import { band, stars, moon, cypress, olive, house } from '../../assets/nature.js';
import { oilLamp } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  nicodemus, NICO, pharisee, jerusalem, lantern, nameTag, say, roundel, beamGrad, lightBeam, stoneJar, glory, spark,
  kf, moving, headAt, flicker, NIGHT, word, tr, PI,
  hangAt,
  vpose,
} from './lib.js';
import { sky } from '../kit.js';

const ST = 720;          // the street
const RF = 470;          // the roof of the house
const HX0 = 660, HX1 = 1110;
const NX = 868, JX = 985, LX = 930;
// Nicodemus' way: along the street, up the stairs, onto the roof
const PATH = [[-2.0, [585, ST]], [2.05, [585, ST]], [2.4, [700, ST]], [2.85, [842, RF + 4]], [3.0, [NX, RF]]];

export default {
  id: 'j3-night',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'Ten przyszedł do Niego nocą i powiedział Mu:' },
    { v: 2, cont: true, text: '«Rabbi, wiemy, że od Boga przyszedłeś jako nauczyciel.' },
    { v: 2, cont: true, text: 'Nikt bowiem nie mógłby czynić takich znaków, jakie Ty czynisz, gdyby Bóg nie był z Nim».' },
  ],
  cam: { x: [-420, 300], y: [-160, 40], z: [1, 1.55] },
  build(S) {
    const c = S.c;
    const sk = sky(S, NIGHT);
    const hangL = S.layer({ par: 0.03, sh: 4 });
    hangL.add(`<g>${stars(c, { x0: -900, x1: 2500, y0: -700, y1: 430, n: 150 })}</g>`);
    const moonEl = hanging(hangL, moon(c, 40), { x: 1230, y: 140, len: 800 });

    S.layer({ par: 0.07, sh: 2 }).add(band(c, { y: 450, amps: [22, 8, 3], lens: [1000, 360, 130], color: mix(C.indigo, C.storm2, 0.5) }).markup);
    const city = S.layer({ par: 0.14, sh: 3 });
    city.add(`<g transform="translate(560 560)">${jerusalem(c, 0.6, { tglow: false })}</g>`);
    city.add(`<rect x="-3000" y="-600" width="8000" height="2600" fill="${mix(C.night, C.indigo, 0.3)}" opacity=".5"/>`);
    let win = '';
    [[300, 500], [342, 488], [390, 506], [220, 512], [582, 520], [860, 522], [930, 512], [1030, 528], [700, 470]].forEach(([x, y]) => { win += c.poly(c.rect(x, y, 5, 6)); });
    city.add(`<path d="${win}" fill="${C.lampFlame}" opacity=".8"/>`);

    /* ---------- the street: houses behind, our house with its outside stairs ---------- */
    const back = S.layer({ par: 0.32, sh: 3 });
    const dim = (col, k = 0.42) => mix(col, C.indigo, k);
    let bh = '';
    [[-700, 90, 120], [-560, 120, 150], [-380, 100, 130], [-220, 130, 170], [-40, 110, 140], [140, 130, 160], [330, 96, 120], [1180, 120, 150], [1360, 100, 130], [1520, 130, 160], [1720, 110, 140], [1900, 120, 150]].forEach(([x, w, h]) => {
      bh += house(c, x, 640, w, h, { wall: dim(C.plaster), shadow: dim(C.plaster2), roofEdge: dim(C.roof), door: dim(C.wood2), win: dim(C.soilDark, 0.2), lit: c.chance(0.35), stairs: false });
    });
    back.add(bh);
    back.add(cypress(c, 470, 640, 190, dim(C.moss2, 0.35)) + cypress(c, 1290, 640, 160, dim(C.moss2, 0.35)));

    const L = S.layer({ par: 0.5, sh: 4 });
    const street = sheet();
    street.p(c.ridge(c.wave(ST - 14, [3, 1.5], [500, 140]), -900, 2500, 1700, 12, 0.8), dim(C.sand2, 0.4));
    let cob = '';
    for (let i = 0; i < 70; i++) { const x = c.rr(-900, 2500), y = c.rr(ST, 1000); cob += c.cut(c.ell(x, y, c.rr(8, 16), c.rr(3, 5), 8), 0.3, 4); }
    street.x(cob, dim(C.sand, 0.35), 'opacity=".6"');
    L.add(street.out());
    // our house
    const hs = sheet();
    const wall = dim(C.plaster, 0.3), wall2 = dim(C.plaster2, 0.34);
    hs.p(c.cut([[HX0, ST - 8], [HX0, RF], [HX1, RF], [HX1, ST - 8]], 0.6, 10), wall);
    hs.p(c.cut([[HX1, RF + 8], [HX1 + 60, RF + 22], [HX1 + 60, ST - 6], [HX1, ST - 8]], 0.4, 8), wall2);
    hs.p(c.cut([[HX0 - 8, RF - 6], [HX1 + 8, RF - 6], [HX1 + 8, RF + 6], [HX0 - 8, RF + 6]], 0.3, 8), dim(C.roof, 0.3));
    // door, a lit window
    hs.p(c.cut([[1010, ST - 8], [1010, ST - 110], ...c.arc(1036, ST - 110, 26, 22, PI, 2 * PI, 8), [1062, ST - 110], [1062, ST - 8]], 0.3, 5), dim(C.wood2, 0.3));
    hs.x(c.poly(c.rect(1050, RF + 50, 26, 22)) + c.poly(c.rect(900, RF + 60, 22, 20)), C.lampFlame, 'opacity=".8"');
    let lat = '';
    for (let i = 0; i < 3; i++) lat += c.ribbon([[1050 + i * 9, RF + 50], [1050 + i * 9, RF + 72]], 1.2);
    hs.x(lat, dim(C.wood2, 0.2));
    hs.p(c.cut([[1044, RF + 74], [1082, RF + 74], [1080, RF + 80], [1046, RF + 80]], 0.2, 4), dim(C.stone2, 0.3));
    L.add(`<circle cx="1063" cy="${RF + 61}" r="60" fill="url(#warm-glow)" opacity=".5"/>` + hs.out());
    // the outside stairs, rising left-to-right along the front wall
    const stp = sheet();
    stp.p(c.cut([[672, ST - 4], [826, RF + 12], [852, RF + 12], [852, RF + 34], [722, ST - 4]], 0.4, 6), dim(C.stone2, 0.3));
    let steps = '';
    for (let i = 0; i < 9; i++) { const u = i / 9; const x = lerp(690, 840, u), y = lerp(ST - 4, RF + 10, u); steps += c.cut(c.rect(x - 8, y - 3, 34, 6), 0.2, 4); }
    stp.p(steps, dim(C.stone, 0.25));
    L.add(stp.out());
    // a small olive on the street
    L.add(olive(c, 330, ST - 4, 0.8, { leaf: dim(C.olive, 0.3), leaf2: dim(C.sage, 0.3), trunk: dim(C.wood2, 0.3) }));

    /* ---------- people ---------- */
    const G = S.layer({ par: 0.5, sh: 0, flat: true });
    const glor = G.add(`<g>${glory(c, 170, 16)}</g>`);
    const P = S.layer({ par: 0.5, sh: 5 });
    // on the roof: Jesus by his lamp
    const lampEl = P.add(`<g transform="translate(${LX - 10} ${RF - 14}) scale(.72)">${oilLamp(c)}</g>`);
    const lamp = { glow: lampEl.querySelector('.glow'), flame: lampEl.querySelector('.flame') };
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    // the Pharisees in the street
    const phs = [0, 2].map((i, k) => ({ p: S.puppet(P.add(person(c, pharisee(c, i + 1)))), x: k ? 700 : 470, k }));
    const nEl = P.add(nicodemus(c, { holdF: `<g class="lh"><g data-k="lantern" transform="scale(.9)">${lantern(c, { col: C.apricot })}</g></g>` }));
    const nico = S.puppet(nEl);
    const lan = S.$('lantern'), lanGlow = lan.querySelector('.glow'), lanHold = nEl.querySelector('.armFr .hold');
    const nSit = S.puppet(P.add(nicodemus(c, { pose: 'sit' })));
    // the roof's front edge (in front of the people up there)
    const F = S.layer({ par: 0.5, sh: 4 });
    F.add(sheet().p(c.cut([[HX0 - 10, RF - 16], [HX1 + 10, RF - 16], [HX1 + 10, RF + 8], [HX0 - 10, RF + 8]], 0.4, 8), dim(C.plaster, 0.26)).x(c.ribbon([[HX0 - 8, RF - 14], [HX1 + 8, RF - 14]], 2), dim(C.roof, 0.2), 'opacity=".8"').out());

    /* ---------- words and pictures ---------- */
    const X = S.layer({ par: 0.5, sh: 5 });
    const tagN = hanging(X, nameTag(c, tr('Nikodem', 'Nicodemus'), { size: 19 }), { x: 585, y: 330, len: 500 });
    const tagF = hanging(X, nameTag(c, tr('faryzeusz', 'a Pharisee'), { size: 15 }), { x: 470, y: 400, len: 500 });
    const tagD = hanging(X, nameTag(c, tr(['dostojnik', 'żydowski'], ['a ruler', 'of the Jews']), { size: 15 }), { x: 712, y: 390, len: 500 });
    const bid = beamGrad(S, 'beam');
    const beam = X.add(`<g>${lightBeam(bid, 30, 200, 420)}</g>`);
    const rabbi = X.add(`<g>${say(c, tr('Rabbi', 'Rabbi'), { size: 24, side: -1 })}</g>`);
    const teach = hanging(X, `<g transform="translate(0 40)">${word(c, tr('nauczyciel od Boga', 'a teacher from God'), { size: 17 })}</g>`, { x: JX, y: 270, len: 500 });
    const WINE = shade(C.plumRobe, -0.3);
    const jar = () => `<g transform="translate(-16 40) rotate(-28)">${stoneJar(c, 54)}</g><path d="${c.ribbon(c.qbez([4, -12], [22, -22], [26, 8], 10), (u) => 7 - u * 3)}" fill="${WINE}"/><g transform="translate(28 40)">${sheet().p(c.cut([[-16, -30], [16, -30], [10, -8], [3, -4], [3, 0], [-3, 0], [-3, -4], [-10, -8]], 0.3, 4), C.sun).p(c.cut(c.ell(0, -28, 14, 4, 12), 0.2, 3), WINE).out()}</g><g transform="translate(-30 -34)">${spark(c, 9)}</g>`;
    const signs = [
      { el: hanging(X, roundel(c, jar(), { r: 58, face: mix(C.parchment, C.halo, 0.3) }), { x: 1110, y: 250, len: 600 }), x: 1110, y: 245, d: 0 },
      { el: hanging(X, roundel(c, `<g transform="scale(1.4)">${spark(c, 16)}</g>`, { r: 44, face: mix(C.parchment, C.halo, 0.3) }), { x: 850, y: 230, len: 600 }), x: 820, y: 225, d: 0.15 },
    ];
    const signTag = hanging(X, word(c, tr('znaki: Kana', 'signs: Cana'), { size: 17 }), { x: 1110, y: 330, len: 600 });

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      swing(moonEl, 1230, 140, T, 1, 0.5);
      flicker({ glow: lamp.glow, flame: lamp.flame }, T);

      /* v1 — three Pharisees walk in; the middle one is Nicodemus */
      const come = es(t, 0.7, 1.35);
      const home = es(t, 2.0, 2.45);
      phs.forEach((m) => {
        const x = lerp(m.x - 700, m.x, come) + (m.k ? home * 700 : -home * 800);
        const mv = (come > 0 && come < 1) || (home > 0 && home < 1);
        m.p.set({ x, y: ST, s: 0.96, flip: m.k ? come >= 1 && home < 0.02 : home > 0.02, walk: mv ? x * 0.05 : undefined, armF: bump(t, 1.4, 1.9) * 30, head: bump(t, 1.5, 2) * -5, blink: blinkAt(T, m.k + 3), o: come > 0 && home < 1 ? 1 : 0 });
      });
      /* v2 — he lights his lantern and climbs to the roof */
      const [nx, ny] = t < 1.35 ? [lerp(-115, 585, come), ST] : kf(t, PATH, ease.sine);
      const walking = (come > 0 && come < 1) || moving(t, PATH, 0.4);
      const sit = es(t, 3.3, 3.37);
      const lookL = bump(t, 1.95, 2.25), lookR = bump(t, 2.2, 2.45);
      const bow = bump(t, 2.95, 3.3);
      const armN = 38 + bump(t, 1.4, 1.95) * 30;
      nico.set({ x: nx, y: ny, s: 0.98, flip: lookL > 0.5, o: 1 - sit, walk: walking ? (nx + ny) * 0.05 : undefined, armF: armN, armB: 10 + bump(t, 1.4, 1.9) * 40, head: bow * 16 - lookR * 4, lean: bow * 8, blink: blinkAt(T, 1) });
      vpose(lanHold, { x: 1.5, y: 57, r: armN });
      const lit = es(t, 2.02, 2.15);
      fade(lan, t < 3.3 ? 1 : 0);
      fade(lanGlow, lit * 0.85);
      const speak = bump(t, 3.2, 3.9) + bump(t, 4.1, 4.6);
      nSit.set({ x: NX - 8, y: RF + 2, s: 0.98, o: sit, armF: 30 + speak * 50 + bump(t, 4.15, 4.9) * 30, armB: 20 + bump(t, 3.3, 3.8) * 40, head: -4 + bump(t, 4.2, 4.9) * -6, blink: blinkAt(T, 2) });
      // Jesus looks up as he comes, and welcomes him
      const welcome = es(t, 2.85, 3.05) * (1 - es(t, 3.4, 3.7));
      jesus.set({ x: JX, y: RF + 2, s: 1, flip: true, armF: 20 + welcome * 60 + bump(t, 4.3, 4.9) * 20, armB: 10 + welcome * 30, head: t < 2.6 ? 8 : -2, blink: blinkAt(T, 4) });

      /* the name tags */
      [[tagN, 585, 330, 1.1], [tagF, 470, 402, 1.2], [tagD, 712, 392, 1.3]].forEach(([el, x, y, a], i) => {
        const k = es(t, a, a + 0.3, ease.out), up = es(t, 1.95, 2.2, ease.in);
        hangAt(el, x, lerp(-300, y, k) - up * 700, T, k > 0 && up < 1 ? 1 : 0, 1.4, 0.9, i);
      });

      /* v2b — Rabbi… a teacher come from God: light falls on Him */
      vpose(rabbi, { x: NX + 4, y: RF - 128, s: es(t, 3.15, 3.3, ease.back) * 0.9, o: es(t, 3.15, 3.25) * (1 - es(t, 4.0, 4.1)) });
      const bm = es(t, 3.35, 3.8);
      vpose(beam, { x: JX + 4, y: RF - 420, sx: 0.4 + bm * 0.6, sy: 1, o: bm * (1 - es(t, 4.6, 4.95) * 0.5) });
      const tk = es(t, 3.5, 3.85, ease.out), tu = es(t, 4.05, 4.3, ease.in);
      hangAt(teach, JX + 60, lerp(-300, 205, tk) - tu * 700, T, tk > 0 && tu < 1 ? 1 : 0, 1.2, 0.9, 2);

      /* v2c — the signs He does; God is with Him */
      signs.forEach((sg, i) => {
        const k = es(t, 4.05 + sg.d, 4.4 + sg.d, ease.out);
        hangAt(sg.el, sg.x, lerp(-300, sg.y, k), T, k > 0 ? 1 : 0, 1.5, 0.8, i * 2);
      });
      const sk2 = es(t, 4.15, 4.45, ease.out);
      hangAt(signTag, 1110, lerp(-300, 330, sk2), T, sk2 > 0 ? 1 : 0, 1.5, 0.8, 5);
      const gl = es(t, 4.45, 4.85);
      vpose(glor, { x: JX, y: RF - 100, s: 0.5 + gl * 0.5, r: gl * 20, o: gl * 0.55 });

      /* camera: the street, then up to the roof */
      const up = es(t, 2.2, 3.05);
      const intro = es(t, 0.5, 1.3) * (1 - up);
      S.cam.x = lerp(-60, -400, intro) * (1 - up) + up * 270;
      S.cam.y = lerp(0, 30, intro) * (1 - up) + up * -150;
      S.cam.z = 1 + intro * 0.12 + up * 0.5;
    };
  },
};
