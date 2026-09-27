// Mk 3,28–30 — "Amen, I tell you": the dark little tags of sin hanging over the people turn white
// and fly away as birds. Then, reverently, the dove of the Holy Spirit comes down in light — and those
// who turn their backs on it keep their dark tags: they had said, "He has an unclean spirit."
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, hanging, swing, flap, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, rock, grass, cloud, olive, palm, house, bush } from '../../assets/nature.js';
import { bird, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { scribe, headAt, handAt, bubble, dove } from './lib.js';

const PI = Math.PI;
const JX = 800, JY = 668;

/** a little tag of sin: an ink blot on one side, clean white paper on the other */
function sinTag(c) {
  const s = sheet();
  s.p(c.cut([[-14, 4], [14, 4], [18, 10], [18, 38], [-18, 38], [-18, 10]], 0.4, 5), C.cream);
  s.x(c.poly(c.circ(0, 9, 2, 6)), C.wood2);
  const blot = sheet().p(c.cut(c.star(0, 23, 13, 7, 9, c.rr(0, 2)), 1, 3), '#3d3346').x(c.poly(c.circ(9, 30, 2.4, 6)) + c.poly(c.circ(-10, 16, 1.8, 6)), '#3d3346').out();
  const clean = sheet().p(c.cut(c.star(0, 23, 8, 3, 4, 0), 0.2, 3), C.halo).out();
  return `${s.out()}<g data-part="blot">${blot}</g><g data-part="clean" opacity="0">${clean}</g>`;
}

export default {
  id: 'm3-spirit',
  beats: [
    { v: 28, text: 'Zaprawdę, powiadam wam:' },
    { v: 28, cont: true, text: 'wszystkie grzechy i bluźnierstwa, których by się ludzie dopuścili, będą im odpuszczone.' },
    { v: 29 },
    { v: 30 },
  ],
  cam: { x: [-20, 40], y: [-60, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const DAY = ['#d4e2dc', '#efe6cf', '#f4e2c6'];
    const GLOW = [mix('#d4e2dc', C.halo, 0.3), mix(C.cream, C.halo, 0.4), C.dawn];
    const sk = sky(S, DAY);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 430, y: 150, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 120), { x: 1210, y: 120, len: 600 });

    const far = S.layer({ par: 0.12, sh: 2 });
    far.add(band(c, { y: 450, amps: [20, 8, 3], lens: [900, 320, 120], color: C.hillFar }).markup);
    const mid = S.layer({ par: 0.22, sh: 3 });
    mid.add(hillsWith(c, { y: 505, amps: [12, 6, 2], lens: [800, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 }).markup);
    const square = S.layer({ par: 0.34, sh: 3 });
    square.add(sheet().p(c.ridge(c.wave(565, [5, 2], [700, 170]), -900, 2500, 1700, 12, 1), C.sand).out());
    square.add(house(c, 150, 566, 150, 110) + house(c, 330, 560, 100, 80) + olive(c, 1250, 572, 0.9) + palm(c, 1420, 570, 200));

    /* light from above, and a shadow that stays where it is refused */
    const lightL = S.layer({ par: 0.36, sh: 1, flat: true });
    const beam = lightL.add(`<g opacity="0"><path d="${c.poly([[740, -400], [860, -400], [1010, 760], [590, 760]])}" fill="#fff4d6" opacity=".35"/>${rays(c, { n: 18, r0: 60, r1: 700, spread: 0.035, color: '#fff3cf' }).replace('<path', '<path opacity=".3" transform="translate(800 250)"')}</g>`);
    const shId = S.id('shade');
    S.defs(`<radialGradient id="${shId}"><stop offset="0" stop-color="#3d3346" stop-opacity=".32"/><stop offset=".6" stop-color="#3d3346" stop-opacity=".16"/><stop offset="1" stop-color="#3d3346" stop-opacity="0"/></radialGradient>`);
    const shadow = lightL.add(`<g opacity="0"><ellipse cx="1070" cy="590" rx="230" ry="240" fill="url(#${shId})"/></g>`);

    /* the people (left) with their tags; the scribes (right) with theirs */
    const folkL = S.layer({ par: 0.42, sh: 3 });
    const tagL = S.layer({ par: 0.42, sh: 4 });
    const FOLK = [[395, 612, 0.72, 'stand'], [455, 606, 0.7, 'stand'], [515, 614, 0.74, 'stand'], [575, 608, 0.72, 'stand'], [425, 652, 0.82, 'sit'], [495, 658, 0.84, 'sit'], [565, 654, 0.82, 'sit'], [635, 650, 0.8, 'sit']].map(([x, y, s, p], i) => {
      const m = { x, y, s, pose: p, i, seed: c.rr(0, 9), p: S.puppet(folkL.add(person(c, { ...crowdPerson(c), pose: p }))) };
      const [hx, hy] = headAt(x, y, s, false, p);
      m.tx = hx; m.ty = hy - 70 * s - 30;
      m.tag = tagL.add(`<g>${sinTag(c)}</g>`);
      m.blot = m.tag.querySelector('[data-part="blot"]'); m.clean = m.tag.querySelector('[data-part="clean"]');
      m.bird = tagL.add(bird(c, { color: C.cream, belly: C.linen }));
      return m;
    });
    const act = S.layer({ par: 0.5, sh: 5 });
    const SCR = [0, 1, 2].map((i) => {
      const m = { i, x: [960, 1040, 1116][i], y: [664, 672, 660][i], s: [0.96, 0.98, 0.94][i], seed: c.rr(0, 9), p: S.puppet(act.add(person(c, scribe(c, i)))) };
      const [hx, hy] = headAt(m.x, m.y, m.s, true);
      m.tx = hx; m.ty = hy - 70 * m.s - 30;
      m.tag = tagL.add(`<g>${sinTag(c)}</g>`);
      return m;
    });
    const jGlow = act.add(`<g opacity="0"><circle r="170" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const accuse = act.add(`<g opacity="0">${bubble(c, tr('Ma ducha nieczystego!', 'He has an unclean spirit!'), { size: 19, fill: mix(C.storm2, C.plumRobe, 0.3), ink: C.cream, tail: -1 })}</g>`);

    /* the dove, coming down in light */
    const doveL = S.layer({ par: 0.5, sh: 4 });
    const doveEl = doveL.add(`<g opacity="0"><circle r="90" fill="url(#halo-glow)"/><circle r="46" fill="url(#warm-glow)"/><g transform="scale(-1.25 1.25)">${dove(c)}</g></g>`);
    const wings = [doveEl.querySelector('.wingF'), doveEl.querySelector('.wingB')];

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(bush(c, 230, 970, 220, C.sage, C.moss) + rock(c, 1360, 985, 190, 64, C.rock2) + grass(c, { x0: 0, x1: 1600, y: 940, n: 30, h: 20, color: C.moss }));

    return (t, time) => {
      const T = time;
      const holy = es(t, 2.0, 2.5);
      sk.blend(DAY, GLOW, holy * 0.8);
      swing(cl1, 430 + t * 6, 150, T, 1.4, 0.6, 1);
      swing(cl2, 1210 - t * 5, 120, T, 1.4, 0.7, 2);

      /* Jesus: "Amen, I tell you" — hand raised; then open to the people; then to the light */
      const solemn = es(t, 0.05, 0.35);
      const give = es(t, 1.05, 1.35) * (1 - es(t, 2.0, 2.2));
      const up = es(t, 2.05, 2.35);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: t > 1 && t < 2 ? true : false, armF: 14 + solemn * 88 * (1 - give) * (1 - up) + give * 70 + up * 60, armB: 8 + solemn * 30 * (1 - give) + give * 40 + up * 100, head: -3 - up * 8 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2) });
      pose(jGlow, { x: JX, y: JY - 170, s: 0.7 + solemn * 0.3 + bump(t, 0, 0.9) * 0.2, o: solemn * 0.5 + holy * 0.4 });

      /* the people's tags: blots → clean → away as birds */
      FOLK.forEach((m) => {
        const turn = seg(t, 1.1 + m.i * 0.05, 1.3 + m.i * 0.05);
        const away = es(t, 1.35 + m.i * 0.05, 1.8 + m.i * 0.05, ease.in);
        const look = es(t, 0.05, 0.4);
        const joy = es(t, 1.4 + m.i * 0.05, 1.6 + m.i * 0.05);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: false, armF: joy * (m.i % 2 ? 60 : 30) + holy * 20, armB: joy * (m.i % 3 === 0 ? 130 : 0), head: -look * 4 - joy * 8 - holy * 6, blink: blinkAt(T, m.seed) });
        pose(m.tag, { x: m.tx, y: m.ty + 26, sx: Math.max(0.05, Math.abs(Math.cos(turn * PI))), o: away > 0.05 ? 0 : 1 });
        fade(m.blot, turn < 0.5 ? 1 : 0); fade(m.clean, turn < 0.5 ? 0 : 1);
        pose(m.bird, { x: m.tx + away * (120 + m.i * 20), y: m.ty + 20 - away * (380 + m.i * 20), s: 0.8, o: away > 0.05 && away < 1 ? 1 : 0 });
        if (away > 0.05 && away < 1) flap(m.bird, T + m.seed);
      });

      /* the scribes: shaken, then they turn their backs on the light; then accuse */
      const back = es(t, 2.35, 2.5) * (1 - es(t, 3.02, 3.12));
      const point = es(t, 3.1, 3.3);
      SCR.forEach((m) => {
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: back < 0.5, armF: 20 + point * (m.i === 0 ? 80 : 40) + back * 10, armB: back * 20 + point * (m.i === 1 ? 110 : 0), head: back * 8 - point * 6 + es(t, 0.05, 0.4) * -4, lean: back * 6 - point * 4, blink: blinkAt(T, m.seed) });
        pose(m.tag, { x: m.tx + (back > 0.5 ? 0 : 0), y: m.ty + 26, o: 1 });
      });
      fade(shadow, es(t, 2.3, 2.6) * 0.9);
      pose(accuse, { x: 1010, y: 470 + Math.sin(T * 2) * 2, s: es(t, 3.15, 3.35, ease.back), o: t > 3.12 ? 1 : 0 });

      /* the Holy Spirit */
      const d = es(t, 2.02, 2.5, ease.out);
      pose(doveEl, { x: JX + 10 + (1 - d) * 60, y: lerp(-160, 270, d) + Math.sin(T * 1.2) * 5, r: -8 + (1 - d) * -10, o: d > 0.01 ? 1 : 0 });
      const f = Math.sin(T * 3) * 14 * (1 - d * 0.6) + 6;
      pose(wings[0], { r: f });
      pose(wings[1], { r: f * 0.8 });
      pose(beam, { o: holy * 0.95 });

      S.cam.y = -es(t, 1.9, 2.4) * 50 + es(t, 2.95, 3.3) * 40;
      S.cam.z = 1 + es(t, -0.2, 0.5) * 0.05 - es(t, 1.9, 2.4) * 0.05;
      S.cam.x = -es(t, 0.9, 1.3) * 20 + es(t, 1.9, 2.4) * 20 + es(t, 2.95, 3.3) * 30;
    };
  },
};
