// Mt 24,23–26 — night on the Mount. "If anyone tells you: 'Look, here is the Messiah!' or 'There!'": signposts spring
// up left and right with men beckoning beside them — Jesus lifts His hand: do not believe it. False messiahs and
// false prophets rise with great signs and wonders, glitter and false fire; the four lean towards them, and His hand
// holds them back. "Behold, I have told you beforehand": a scroll unrolls with all that He has foretold. Then two
// plates: "Look, he is in the wilderness" — a man points far out over the dunes; Peter turns his back on it. "Look,
// he is in the inner rooms" — a whisperer at a curtained door; John turns away.
import { C, person, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { olivesSet, circle, SKIES, JX, JY, pointer, mask, crownIcon, addToHead, sparkle, voiceRings, handLamp, ashlar, emptyBowl, banner, globe, hourglass, flake, plate, word, innerRoomHouse, man, tr, PI } from './lib.js';

const PW = 330, PH = 230;

/** the wilderness plate painting (origin: plate top centre) */
function desertPainting(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-PW / 2 + 10, 10, PW - 20, PH - 20), 0.3, 8), mix(C.dawn, C.parchment, 0.4));
  s.p(c.cut([[-PW / 2 + 10, 130], [-80, 104], [-10, 122], [60, 98], [PW / 2 - 10, 116], [PW / 2 - 10, PH - 10], [-PW / 2 + 10, PH - 10]], 0.8, 8), mix(C.dune, C.sand, 0.4));
  s.p(c.cut([[-PW / 2 + 10, 170], [-40, 150], [80, 166], [PW / 2 - 10, 150], [PW / 2 - 10, PH - 10], [-PW / 2 + 10, PH - 10]], 0.8, 8), C.sand2);
  let prints = '';
  for (let i = 0; i < 7; i++) { const u = i / 7; prints += c.cut(c.ell(lerp(-40, 70, u) + (i % 2) * 5, lerp(196, 118, u), 4 - u * 2, 2, 8), 0.1, 2); }
  s.x(prints, shade(C.sand2, -0.2), 'opacity=".7"');
  return s.out() + `<g transform="translate(70 114) scale(.18)">${person(c, { robe: '#3b2a22', mantle: '#3b2a22', skin: '#3b2a22', hair: '#3b2a22', hairStyle: 'wrap', veil: '#3b2a22', beard: 'none' }).split(`fill="${C.blush}"`).join('fill="#3b2a22"')}</g>`;
}
/** the inner-rooms plate painting */
function roomPainting(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-PW / 2 + 10, 10, PW - 20, PH - 20), 0.3, 8), mix(C.night, C.plumRobe, 0.3));
  s.p(c.cut([[-PW / 2 + 10, PH - 40], [PW / 2 - 10, PH - 40], [PW / 2 - 10, PH - 10], [-PW / 2 + 10, PH - 10]], 0.4, 8), mix(C.sand2, C.night2, 0.3));
  return s.out() + `<g transform="translate(10 ${PH - 40})">${innerRoomHouse(c, 230, 140)}</g><g transform="translate(${10 + 230 * 0.22} ${PH - 70})"><circle r="40" fill="url(#warm-glow)"/></g>`;
}

export default {
  id: 'mt24-falsechrist',
  beats: [
    { v: 23 },
    { v: 24 },
    { v: 25 },
    { v: 26, text: 'Jeśli więc wam powiedzą: "Oto jest na pustyni", nie chodźcie tam!;' },
    { v: 26, cont: true, text: '"Oto wewnątrz domu", nie wierzcie!' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const TK = 0.42, NIGHTC = mix(C.night, C.duskViolet, 0.3);
    const set = olivesSet(S, { skyCols: SKIES.night, tintCol: NIGHTC, tintK: TK, moonXY: [1240, 110], templeGlow: 0.2 });

    /* "here!" — "there!" with men beckoning; false messiahs and prophets with wonders */
    const fx = S.layer({ par: 0.4, sh: 5 });
    const posts = [
      { x: 470, dir: -1, text: tr('Oto tu!', 'Look, here!') },
      { x: 1130, dir: 1, text: tr('Tam!', 'There!') },
    ].map((p, i) => ({ ...p, i, el: fx.add(`<g transform="translate(0 -1500)">${pointer(c, p.text, { dir: p.dir, size: 20, col: C.ochre })}</g>`), who: S.puppet(fx.add(person(c, man(c, { robe: [C.ochreRobe, C.tealRobe][i] })))), seed: c.rr(0, 9) }));
    const PROPH = [[C.plumRobe, C.sun, 520, true], [C.indigo, C.halo, 1080, true], [C.terracotta, C.sun, 620, false], [C.teal2, C.halo, 980, false]].map(([robe, gold, x, king], i) => ({
      i, x, p: S.puppet(fx.add(addToHead(person(c, { robe, mantle: gold, hairStyle: 'wrap', veil: robe, veil2: gold, beard: 'none', skin: C.skin2, belt: gold }), `<g transform="translate(6 0)">${mask(c, { col: gold, r: 22, stick: false })}</g>${king ? `<g transform="translate(2 -18)">${crownIcon(c, 32, gold)}</g>` : ''}`))),
      bursts: [0, 1, 2].map((k) => fx.add(`<g transform="translate(0 -1500)">${sparkle(c, 16, k % 2 ? C.halo : C.star)}</g>`)),
      fire: fx.add(`<g transform="translate(0 -1500)"><circle r="40" fill="url(#warm-glow)"/><path d="M0 0C-12 -10 -10 -30 0 -52C10 -30 12 -10 0 0Z" fill="${C.sunRay}"/><path d="M0 -4C-6 -10 -6 -22 0 -34C6 -22 6 -10 0 -4Z" fill="${C.lampFlame}"/></g>`),
    }));

    /* the scroll of all that He foretold */
    const scL = S.layer({ par: 0.3, sh: 6 });
    const SW = 640, SH = 120;
    const icons = [
      `<g transform="translate(-14 -14) scale(.3)">${ashlar(c, 90, 50)}</g><g transform="translate(-4 4) rotate(20) scale(.3)">${ashlar(c, 70, 44)}</g>`,
      `<g transform="scale(.8)">${mask(c, { r: 16, stick: false })}</g><g transform="translate(0 -16) scale(.7)">${crownIcon(c, 30)}</g>`,
      `<g transform="translate(-10 14)">${banner(c, C.terracotta, { h: 34, w: 18 })}</g><g transform="translate(10 14)">${banner(c, C.teal2, { h: 30, w: 16 })}</g>`,
      `<path d="${c.ribbon([[-20, -8], [-8, 2], [0, -6], [10, 6], [20, -2]], 3)}" fill="${C.soilDark}"/><g transform="translate(0 16)">${emptyBowl(c, 30)}</g>`,
      `<g transform="scale(.42)">${globe(c, 50)}</g>`,
      `<path d="${c.cut([[-16, 16], [0, -18], [16, 16]], 0.4, 4)}" fill="${C.rock2}"/>`,
      `<g transform="scale(1.4)">${flake(c, 8)}</g>`,
      `<g transform="scale(.3)">${hourglass(c, 80)}</g>`,
    ];
    const paper = sheet().p(c.cut(c.rect(-SW / 2, 0, SW, SH), 0.5, 10), C.parchment).x(c.ribbon([[-SW / 2 + 14, 12], [SW / 2 - 14, 12]], 1.2) + c.ribbon([[-SW / 2 + 14, SH - 12], [SW / 2 - 14, SH - 12]], 1.2), C.terracotta, 'opacity=".4"').out();
    const rod = sheet().p(c.cut(c.rect(-8, -10, 16, SH + 20), 0.3, 6), C.wood2).p(c.cut(c.ell(0, -14, 7, 6, 10), 0.2, 3) + c.cut(c.ell(0, SH + 14, 7, 6, 10), 0.2, 3), C.wood).out();
    const scrollPaper = scL.add(`<g transform="translate(0 -1500)">${paper}${icons.map((ic, i) => `<g transform="translate(${-SW / 2 + 50 + i * ((SW - 100) / 7)} ${SH / 2})">${ic}</g>`).join('')}</g>`);
    const rodL = scL.add(`<g transform="translate(0 -1500)">${rod}</g>`), rodR = scL.add(`<g transform="translate(0 -1500)">${rod}</g>`);
    const SX = 800, SY = 200;

    /* the two plates: the wilderness, the inner rooms */
    const plL = S.layer({ par: 0.32, sh: 6 });
    const tempter = (o, face) => person(c, { ...man(c, o) });
    const desert = plL.add(`<g transform="translate(0 -1500)">${plate(c, PW, PH, { face: C.parchment })}${desertPainting(c)}</g>`);
    const dMan = S.puppet(plL.add(tempter({ robe: C.ochreRobe, mantle: C.clay })));
    const dTag = plL.add(`<g transform="translate(0 -1500)">${word(c, tr('Oto jest na pustyni!', 'He is in the wilderness!'), { size: 15, fill: mix(C.halo, C.cream, 0.4) })}</g>`);
    const room = plL.add(`<g transform="translate(0 -1500)">${plate(c, PW, PH, { face: C.parchment })}${roomPainting(c)}</g>`);
    const curtain = plL.add(`<g transform="translate(0 -1500)"><path d="${c.cut([[0, 0], [92, 0], [92, 104], [70, 110], [60, 60], [40, 104], [0, 110]], 0.4, 5)}" fill="${C.mauve}"/></g>`);
    const rMan = S.puppet(plL.add(tempter({ robe: C.plumRobe, hairStyle: 'wrap', veil: C.stone })));
    const rTag = plL.add(`<g transform="translate(0 -1500)">${word(c, tr('Oto wewnątrz domu!', 'He is in the inner rooms!'), { size: 15, fill: mix(C.halo, C.cream, 0.4) })}</g>`);

    /* the circle and the lamp */
    const P = S.layer({ par: 0.55, sh: 5 });
    const lampEl = P.add(`<g transform="translate(734 712)">${handLamp(c, { glowR: 170 })}</g>`);
    const flame = lampEl.querySelector('.flame');
    const circ = circle(S, P, { tintCol: NIGHTC, tintK: 0.18 });
    const J = circ.jesus;
    const voice = voiceRings(P, c, { n: 3, r: 24, w: 4, color: shade(C.ochre, 0.35) });

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T, { sun: 800, sunO: 0, moon: 110, moonO: 1, glow: 0.2, starsO: 1 });
      pose(flame, { x: 27, y: -12, sy: 1 + (T ? Math.sin(T * 7) * 0.08 : 0) });

      /* v23 — "here!" "there!" */
      posts.forEach((p) => {
        const k = es(t, 0.05 + p.i * 0.18, 0.3 + p.i * 0.18, ease.back) * (1 - es(t, 0.95, 1.15));
        pose(p.el, { x: p.x, y: 610 + (1 - k) * 220, r: p.dir * (T ? Math.sin(T * 5) : 0) * 2 * k, s: 0.9, o: k > 0.01 ? 1 : 0 });
        const wx = p.x + p.dir * -52;
        p.who.set({ x: wx, y: 612 + (1 - k) * 200, s: 0.62, flip: p.dir < 0, o: k > 0.01 ? 1 : 0, armB: 20 + k * 120 + (T ? Math.sin(T * 4 + p.i) : 0) * 14 * k, armF: 60, blink: blinkAt(T, p.seed) });
      });
      /* v24 — signs and wonders */
      PROPH.forEach((m) => {
        const k = es(t, 1.02 + m.i * 0.08, 1.3 + m.i * 0.08, ease.out) * (1 - es(t, 1.9, 2.15));
        const flip = m.x > 800;
        m.p.set({ x: m.x, y: 600 + (1 - k) * 160, s: 0.62, flip, armB: 150 * k, armF: 60 + (T ? Math.sin(T * 3 + m.i) : 0) * 20, o: k > 0.01 ? 1 : 0 });
        m.bursts.forEach((b, j) => {
          const ph = T ? (T * 0.9 + j / 3 + m.i * 0.2) % 1 : (j + 0.5) / 3;
          pose(b, { x: m.x + (flip ? -1 : 1) * (30 + j * 18) + Math.sin(j * 2 + m.i) * 20, y: 470 - ph * 60 - j * 12, s: (0.4 + ph) * k, r: T * 60 + j * 30, o: k * (1 - ph) });
        });
        const fk = es(t, 1.3 + m.i * 0.05, 1.5 + m.i * 0.05, ease.back) * (1 - es(t, 1.9, 2.1));
        pose(m.fire, { x: m.x + (flip ? -40 : 40), y: 470, s: fk * (1 + (T ? Math.sin(T * 9 + m.i) * 0.06 : 0)), o: fk > 0.01 ? 1 : 0 });
      });

      /* v25 — the scroll unrolls */
      const sIn = es(t, 2.0, 2.18) * (1 - es(t, 2.95, 3.15));
      const un = es(t, 2.1, 2.55);
      const sy = lerp(-300, SY, sIn);
      pose(scrollPaper, { x: SX, y: sy, sx: Math.max(0.001, un), o: sIn > 0.01 ? 1 : 0 });
      pose(rodL, { x: SX - (SW / 2) * un - 6, y: sy, o: sIn > 0.01 ? 1 : 0 });
      pose(rodR, { x: SX + (SW / 2) * un + 6, y: sy, o: sIn > 0.01 ? 1 : 0 });

      /* v26a — the wilderness plate (left) */
      const dk = es(t, 3.02, 3.35, ease.back) * (1 - es(t, 4.7, 5.2) * 0);
      const dx = 610, dy = lerp(-420, 176, dk), don = dk > 0.001 ? 1 : 0;
      pose(desert, { x: dx, y: dy, r: (T ? Math.sin(T * 0.8) : 0) * 0.8 * dk, o: don });
      const pt = es(t, 3.3, 3.5);
      dMan.set({ x: dx - 100, y: dy + PH - 26, s: 0.42, flip: false, armF: 20 + pt * 80, armB: 10 + pt * 30, o: don, head: -4, blink: blinkAt(T, 3) });
      const dt = es(t, 3.4, 3.6, ease.back);
      pose(dTag, { x: dx - 40, y: dy + PH - 138, s: dt, r: (T ? Math.sin(T * 1.4) : 0) * 2, o: don * (dt > 0.01 ? 1 : 0) });

      /* v26b — the inner-rooms plate (right) */
      const rk = es(t, 4.02, 4.35, ease.back);
      const rx = 1010, ry = lerp(-420, 176, rk), ron = rk > 0.001 ? 1 : 0;
      pose(room, { x: rx, y: ry, r: (T ? Math.sin(T * 0.8 + 1) : 0) * 0.8 * rk, o: ron });
      const cu = es(t, 4.35, 4.6);
      pose(curtain, { x: rx + 10 + 230 * 0.02 - 115 + 115, y: ry + PH - 40 - 140 * 0.8, sx: 1 - cu * 0.45, o: ron });
      rMan.set({ x: rx + 10 - 115 + 230 * 0.3, y: ry + PH - 40, s: 0.42, flip: true, armB: 30 + es(t, 4.35, 4.55) * 110, armF: 60, o: ron, head: 6, blink: blinkAt(T, 4) });
      const rt = es(t, 4.4, 4.6, ease.back);
      pose(rTag, { x: rx - 20, y: ry + PH - 150, s: rt, r: (T ? Math.sin(T * 1.4 + 1) : 0) * 2, o: ron * (rt > 0.01 ? 1 : 0) });

      /* Jesus: "do not believe" (0), holds them back (1), "I have told you" (2), no (3, 4) */
      const no0 = es(t, 0.55, 0.75) * (1 - es(t, 0.95, 1.05));
      const hold = es(t, 1.3, 1.5) * (1 - es(t, 1.9, 2.05));
      const told = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.05));
      const noL = es(t, 3.55, 3.75) * (1 - es(t, 3.95, 4.05));
      const noR = es(t, 4.55, 4.75);
      const shake = (T ? Math.sin(T * 4) : 0) * 6;
      J.set({
        x: JX, y: JY, s: circ.s, flip: noL > 0.5,
        armB: 10 + no0 * 140 + told * 150 + (noL + noR) * 120, armF: 25 + hold * 80 + told * 20,
        head: (no0 + noL + noR) * shake * 0.7 - told * 6 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2),
      });
      voice(JX - 4, JY - 158, Math.max(no0, told, noL, noR) * 0.8, T, { s0: 0.7 });

      /* the four: drawn to the wonders (1); Peter turns from the wilderness, John from the room */
      circ.four.forEach((m) => {
        const drawn = es(t, 1.1, 1.3) * (1 - es(t, 1.45, 1.7));
        const lookUp = es(t, 2.1, 2.3) * (1 - es(t, 2.9, 3.0));
        let flip = m.flip, head = -10 - lookUp * 6, lean = m.dir * (3 + drawn * 10), armF = 20 + drawn * 40, armB = 0;
        if (m.k === 'peter' && t > 3.0) { const look = es(t, 3.22, 3.28), turn = es(t, 3.58, 3.64); flip = look > 0.5 && turn < 0.5; head = -12 + turn * 12; armF = 20 + turn * 40; armB = turn * 60; }
        if (m.k === 'john' && t > 4.0) { const look = es(t, 4.22, 4.28), turn = es(t, 4.58, 4.64); flip = !(look > 0.5 && turn < 0.5); head = -12 + turn * 12; armF = 20 + turn * 40; armB = turn * 60; }
        m.p.set({ x: m.x, y: m.y, s: m.s, flip, lean, armF, armB, head, blink: blinkAt(T, m.seed) });
      });

      S.cam.y = -es(t, 1.9, 2.3) * 20 - es(t, 2.95, 3.3) * 20;
      S.cam.z = 1 + es(t, 0.9, 1.3) * 0.03;
    };
  },
};
