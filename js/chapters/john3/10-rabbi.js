// J 3,26–28 — By the springs of Aenon John's disciples come to him, upset. A sepia memory-plate: John on
// the far bank of the Jordan pointing to Jesus. "Now He baptizes and everyone goes to Him": on the hills a
// path of little people walks away towards a small figure in a glow. John stands, calm: "A man can receive
// nothing unless it is given him from heaven" — a light comes down into his open hands. "I am not the
// Messiah": a crown comes down towards him; he waves it off and it floats away to the One on the hill.
// "I have been sent before Him": he steps onto the path as a herald and points the way.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix, sky } from '../kit.js';
import { band, hillsWith, reeds, rock, sun, cloud, palm, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  JOHN_B, johnsOpts, springRock, roundel, say, word, crown, soulLight, beamGrad, lightBeam, headAt, hand, along, SEPIA, glory, lamb, tr, PI, DAY, kf, moving,
  hangAt,
  vpose,
} from './lib.js';

const GY = 700, JBX = 690, HX = 1170;
const PATH = [[880, 665], [980, 630], [930, 592], [1040, 560], [1110, 530], [1170, 505]];

export default {
  id: 'j3-rabbi',
  beats: [
    { v: 26, text: 'Przyszli więc do Jana i powiedzieli do niego:' },
    { v: 26, cont: true, text: '«Nauczycielu, oto Ten, który był z tobą po drugiej stronie Jordanu i o którym ty wydałeś świadectwo,' },
    { v: 26, cont: true, text: 'teraz udziela chrztu i wszyscy idą do Niego».' },
    { v: 27, text: 'Na to Jan odrzekł:' },
    { v: 27, cont: true, text: '«Człowiek nie może otrzymać niczego, co by mu nie było dane z nieba.' },
    { v: 28, text: 'Wy sami jesteście mi świadkami, że powiedziałem: Ja nie jestem Mesjaszem,' },
    { v: 28, cont: true, text: 'ale zostałem przed Nim posłany.' },
  ],
  cam: { x: [-60, 140], y: [-20, 80], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1230, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 460, y: 160, len: 700 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [24, 10, 3], lens: [1000, 340, 130], color: mix(C.hillFar, C.duskViolet, 0.25) }).markup);
    const H = S.layer({ par: 0.3, sh: 3 });
    H.add(hillsWith(c, { y: 520, amps: [22, 8, 3], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22 }).markup);

    /* ---------- the ground, the springs, the path up the hill ---------- */
    const L = S.layer({ par: 0.5, sh: 3 });
    const hp = [[-900, 1700], [-900, 610], [860, 610], [1000, 590], [1100, 530], [1180, 500], [1320, 520], [2500, 540], [2500, 1700]];
    L.add(sheet().p(c.cut(hp, 1, 12), mix(C.sage3, C.sand, 0.3)).out());
    L.add(sheet().p(c.ribbon(c.cbez(PATH[0], PATH[1], PATH[3], PATH[5], 24), (u) => 30 - u * 22, 1), C.sand).out());
    L.add(grass(c, { x0: -900, x1: 2500, y: 612, n: 40, h: 14, color: C.moss }) + palm(c, 260, 616, 210));
    const springs = [[250, 620, 0.9], [410, 612, 0.7]].map(([x, y, s], i) => L.add(`<g transform="translate(${x} ${y}) scale(${s})">${springRock(c, 110, 56, i ? C.rock : C.rock2)}</g>`).querySelector('.jet'));
    L.add(sheet().p(c.cut(c.ell(300, 680, 190, 28, 30), 0.6, 8), C.lake).out());
    L.add(`<g transform="translate(${JBX + 30} ${GY + 6})">${rock(c, 0, 0, 120, 44, C.rock2)}</g>`);
    // the glow on the hill and the tiny figure of Jesus in it
    const Gl = S.layer({ par: 0.5, sh: 0, flat: true });
    const hillGlow = Gl.add(`<g>${glory(c, 190, 18)}</g>`);
    const P = S.layer({ par: 0.5, sh: 5 });
    const jTiny = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const walkers = Array.from({ length: 9 }, (_, i) => ({ i, p: S.puppet(P.add(person(c, { ...(i % 3 ? {} : {}), ...crowd(c, i) }))) }));
    function crowd(cc, i) { return { robe: [C.dustyBlue, C.roseRobe, C.sageRobe, C.wheatRobe, C.mauve, C.tealRobe][i % 6], hairStyle: i % 2 ? 'veil' : 'short', veil: [C.linen2, C.skyVeil, C.blushVeil][i % 3], beard: i % 2 ? 'none' : 'short', skin: [C.skin, C.skin2, C.skin3][i % 3], hair: C.hair }; }

    /* ---------- John and his disciples ---------- */
    const johnSit = S.puppet(P.add(person(c, { ...JOHN_B, pose: 'sit' })));
    const johnSt = S.puppet(P.add(person(c, JOHN_B)));
    const DS = [0, 1, 2].map((i) => ({ i, p: S.puppet(P.add(person(c, { ...johnsOpts(c), hairStyle: i === 1 ? 'short' : 'wild' }))), seed: c.rr(0, 9) }));
    const F = S.layer({ par: 0.62, sh: 4 });
    F.add(reeds(c, 120, 860, 14, 200, C.moss) + reeds(c, 1500, 860, 12, 190, C.moss) + rock(c, 1340, 880, 180, 60, C.rock2));

    /* ---------- plates and words ---------- */
    const X = S.layer({ par: 0.5, sh: 5 });
    const b1 = X.add(`<g>${say(c, tr('Nauczycielu!', 'Rabbi!'), { size: 20, side: 1 })}</g>`);
    // the memory: John on the far side of the Jordan pointing to Jesus (with the Lamb)
    const memId = S.id('mem');
    const memIn = `<path d="${c.poly(c.rect(-110, -110, 220, 220))}" fill="${SEPIA.sky[1]}"/><path d="${c.cut([[-110, 20], [110, 14], [110, 110], [-110, 110]], 0.6, 8)}" fill="${mix(C.dune, SEPIA.wall, 0.4)}"/><path d="${c.cut([[-110, 30], [110, 26], [110, 48], [-110, 54]], 0.5, 8)}" fill="${mix(C.lake, SEPIA.wall, 0.4)}"/>`;
    const mem = hanging(X, roundel(c, memIn, { r: 100, face: SEPIA.sky[1], rim: C.wood3, id: memId }), { x: 930, y: 320, len: 700 });
    const memJohn = S.puppet(X.add(person(c, { ...JOHN_B, robe: mix(JOHN_B.robe, SEPIA.wall, 0.3) })));
    const memJesus = S.puppet(X.add(person(c, { ...CAST.jesus, robe: mix(C.linen, SEPIA.wall, 0.2), mantle: mix(C.jesusMantle, SEPIA.wall, 0.35) })));
    const memLamb = X.add(`<g>${lamb(c)}</g>`);
    const memT = X.add(`<g>${word(c, tr('za Jordanem', 'beyond the Jordan'), { size: 15 })}</g>`);
    const allT = X.add(`<g>${word(c, tr('wszyscy idą do Niego', 'everyone is coming to Him'), { size: 16 })}</g>`);
    const bid = beamGrad(S, 'beam');
    const beam = X.add(`<g>${lightBeam(bid, 20, 110, 380)}</g>`);
    const gift = X.add(`<g>${soulLight(c, 16)}</g>`);
    const heavenT = X.add(`<g>${word(c, tr('dane z nieba', 'given from heaven'), { size: 16 })}</g>`);
    const crownEl = hanging(X, `<g transform="scale(2.2)">${crown(c)}</g>`, { x: JBX, y: 300, len: 700 });
    const messT = X.add(`<g>${word(c, tr('nie jestem Mesjaszem', 'I am not the Christ'), { size: 16 })}</g>`);
    const sentT = X.add(`<g>${word(c, tr('posłany przed Nim', 'sent before Him'), { size: 18 })}</g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 150, T, 1, 0.6);
      swing(cl1, 460 + Math.sin(T * 0.1) * 24, 160, T, 1.3, 0.6, 1);
      springs.forEach((j, i) => vpose(j, { x: 0, y: -45, sy: 1 + Math.sin(T * 7 + i) * 0.07 }));

      /* the one on the hill */
      const far = es(t, 1.95, 2.3);
      vpose(hillGlow, { x: HX, y: 460, s: 0.6 + far * 0.3 + es(t, 5.4, 5.8) * 0.2, r: far * 12, o: 0.35 + far * 0.55 });
      jTiny.set({ x: HX, y: 506, s: 0.3, flip: true, armF: 30 + far * 40, blink: blinkAt(T, 2) });
      walkers.forEach((w) => {
        const u = seg(t, 2.05 + w.i * 0.06, 2.95 + w.i * 0.04) * (0.95 - w.i * 0.06);
        const [x, y, dir] = along(PATH, u);
        const s = lerp(0.5, 0.26, u);
        w.p.set({ x, y, s, flip: dir < 0, walk: u > 0 && u < 0.95 ? (x + y) * 0.12 : undefined, o: seg(t, 2.02 + w.i * 0.06, 2.1 + w.i * 0.06) });
      });

      /* v26 — the disciples come */
      DS.forEach((d) => {
        const k = [[-0.2, [-120 - d.i * 90, GY]], [0.75 + d.i * 0.05, [[500, 570, 420][d.i], GY + (d.i % 2) * 10]]];
        const [x, y] = kf(t, k, ease.sine);
        d.p.set({ x, y, s: 0.95, walk: moving(t, k, 1) ? x * 0.05 : undefined, armF: 20 + bump(t, 0.8, 1.9) * 40 * (d.i === 0 ? 1 : 0.4) + bump(t, 2.1, 2.9) * (d.i === 1 ? 110 : 40) + bump(t, 1.2, 1.8) * 20, armB: 10 + bump(t, 2.2, 2.8) * 60 * (d.i === 0 ? 1 : 0), head: -bump(t, 2.2, 2.9) * 6 + bump(t, 3.9, 5) * -8, blink: blinkAt(T, d.seed) });
      });
      vpose(b1, { x: 580, y: GY - 200, s: es(t, 0.6, 0.8, ease.back) * 0.9, o: seg(t, 0.6, 0.65) * (1 - es(t, 1.3, 1.45)) });

      /* the memory-plate */
      const mk = es(t, 1.05, 1.4, ease.out), mu = es(t, 1.95, 2.15, ease.in);
      const my = lerp(-400, 320, mk) - mu * 800, mo = mk > 0 && mu < 1 ? 1 : 0;
      vpose(mem, { x: 930, y: my, o: mo });
      memJohn.set({ x: 870, y: my + 60, s: 0.44, armF: 60 + es(t, 1.35, 1.55) * 40, armB: 20, o: mo, blink: blinkAt(T, 3) });
      memJesus.set({ x: 980, y: my + 36, s: 0.36, flip: true, o: mo, blink: blinkAt(T, 1) });
      vpose(memLamb, { x: 945, y: my + 40, s: 0.4, o: mo });
      vpose(memT, { x: 930, y: my + 124, o: mo * seg(t, 1.35, 1.45) });
      vpose(allT, { x: 1010, y: 420, s: es(t, 2.3, 2.5, ease.back), r: -4, o: seg(t, 2.3, 2.35) * (1 - es(t, 3.0, 3.2)) });

      /* v27 — John stands; what is given from heaven */
      const up = es(t, 3.1, 3.18);
      const recv = es(t, 4.05, 4.3) * (1 - es(t, 4.95, 5.1));
      const wave = bump(t, 5.35, 5.95);
      const go = es(t, 6.05, 6.5);
      const jx = lerp(JBX, 850, go);
      johnSit.set({ x: JBX + 10, y: GY - 8, s: 1.05, flip: false, o: 1 - up, armF: 30, armB: 10, head: 4, blink: blinkAt(T, 5) });
      johnSt.set({ x: jx, y: GY, s: 1.05, flip: false, o: up, walk: go > 0 && go < 1 ? jx * 0.05 : undefined, armF: 20 + bump(t, 3.2, 3.9) * 30 + recv * 60 + wave * 90 + es(t, 6.5, 6.7) * 80, armB: 10 + recv * 60 + wave * 40, head: -recv * 10 + Math.sin(T * 6) * 6 * wave, blink: blinkAt(T, 5) });
      const [hx, hy] = hand(jx, GY, 1.05, false, 20 + recv * 60);
      vpose(beam, { x: hx, y: hy - 380, sx: 0.4 + recv * 0.6, o: recv });
      const gk = es(t, 4.2, 4.6, ease.out);
      vpose(gift, { x: hx, y: lerp(hy - 320, hy - 14, gk), s: 0.6 + gk * 0.5 + Math.sin(T * 4) * 0.04, o: seg(t, 4.2, 4.25) * (1 - es(t, 5.0, 5.15)) });
      vpose(heavenT, { x: hx - 150, y: hy - 190, s: es(t, 4.35, 4.55, ease.back), r: -4, o: seg(t, 4.35, 4.4) * (1 - es(t, 5.0, 5.1)) });

      /* v28a — not the Messiah: the crown is waved away to the One on the hill */
      const [jhx, jhy] = headAt(jx, GY, 1.05, false);
      const cd = es(t, 5.05, 5.35, ease.out), cf = es(t, 5.8, 6.25);
      const ccx = lerp(jhx, HX, cf), ccy = lerp(lerp(-200, jhy - 90, cd), 400, cf) - Math.sin(cf * PI) * 120;
      hangAt(crownEl, ccx, ccy, T, cd > 0 ? 1 - es(t, 6.2, 6.3) : 0, 2, 1.2, 1);
      vpose(messT, { x: jhx - 180, y: jhy - 70, s: es(t, 5.4, 5.6, ease.back), r: -3, o: seg(t, 5.4, 5.45) * (1 - es(t, 6.0, 6.1)) });

      /* v28b — sent before Him */
      vpose(sentT, { x: 930, y: 360, s: es(t, 6.35, 6.55, ease.back), r: 3, o: seg(t, 6.35, 6.4) });

      S.cam.x = es(t, 1.9, 2.4) * 110 * (1 - es(t, 3.0, 3.4)) + es(t, 5.5, 6.2) * 90 - (S.portrait ? 60 * (1 - es(t, 1.9, 2.4)) : 0);
      S.cam.y = 20;
      S.cam.z = 1.08 + es(t, 3.9, 4.3) * 0.06 * (1 - es(t, 5.0, 5.3));
    };
  },
};
