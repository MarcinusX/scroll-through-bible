// Łk 18,31–34 — the long road of Luke 9 again, Jerusalem small and far off on its height; the journey is nearly at its
// end. "He took the Twelve aside": the two knots of disciples draw in close round Him off the road. "Behold, we are going
// up to Jerusalem, and all the things that are written through the prophets concerning the Son of Man will be
// completed": He points, the city begins to shine, and a prophet's scroll unrolls in the sky over it. "He will be
// delivered up to the Gentiles, will be mocked, treated shamefully, and spit on": along the road to the city, dark
// little plates come down one after another, like a shadow play — the one with the halo handed to soldiers, a reed and
// a crown of thorns, faces turned away in scorn. "They will scourge and kill him": a whip; the sky darkens and a small
// cross stands on the hill beside the city. "On the third day, he will rise again": three days hang up, and on the
// third the dawn breaks behind the city and its light rays out. "They understood none of these things": the
// disciples look at one another, questions over their heads. "This saying was hidden from them": a heavy cloth is let
// down over the whole far view and hides it.
import { C, CAST, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  roadSet9, ROAD9, DIS, disciples, plate, soldierSil, shadowPerson, thornCrown, reed, whip, hillCross, numDisc, onString, question, scrollOpen, INK,
  headAt, kf, es, ease, bump, seg, tr, PI,
} from './lib.js';

const JX = 780, JY = 716;
const [CX, CY] = ROAD9.CITY;
const PL = [[640, 236], [800, 206], [960, 206], [1120, 236]];

export default {
  id: 'lk18-upto',
  beats: [
    { v: 31, text: 'Potem wziął Dwunastu i powiedział do nich:' },
    { v: 31, cont: true, text: '«Oto idziemy do Jerozolimy i spełni się wszystko, co napisali prorocy o Synu Człowieczym.' },
    { v: 32 },
    { v: 33, text: 'ubiczują Go i zabiją,' },
    { v: 33, cont: true, text: 'a trzeciego dnia zmartwychwstanie».' },
    { v: 34, text: 'Oni jednak nic z tego nie zrozumieli.' },
    { v: 34, cont: true, text: 'Rzecz ta była zakryta przed nimi i nie pojmowali tego, o czym była mowa.' },
  ],
  cam: { x: [-20, 60], y: [0, 50], z: [1, 1.12] },
  build(S) {
    const R = roadSet9(S, { village: false });
    const c = S.c;
    // the cross on the hill by the city (behind the middle hills)
    const crossL = S.layer({ par: 0.07, sh: 2 });
    R.mid.el.parentNode.insertBefore(crossL.el, R.mid.el);
    const cross = crossL.add(`<g opacity="0"><g transform="scale(.42)">${hillCross(c, mix(INK, C.plumRobe, 0.2))}</g></g>`);
    // the veil let down over the far view
    const veilL = S.layer({ par: 0.12, sh: 8 });
    R.G.el.parentNode.insertBefore(veilL.el, R.G.el);
    const vs = sheet();
    const vcol = mix(C.plumRobe, C.stone2, 0.35);
    const vp = [[-1400, -1800], [3000, -1800], [3000, 520]];
    for (let x = 3000; x >= -1400; x -= 60) vp.push([x, 540 + Math.sin(x * 0.05) * 10]);
    vs.p(c.cut(vp, 0.8, 16), vcol);
    let folds = '';
    for (let x = -1380; x < 3000; x += 70) folds += c.ribbon([[x, -1800], [x + c.rr(-6, 6), 540]], c.rr(8, 18));
    vs.x(folds, shade(vcol, -0.18), 'opacity=".45"');
    vs.p(c.cut([[-1400, 512], [3000, 512], [3000, 530], [-1400, 530]], 0.5, 20), C.ochre);
    const veil = veilL.add(`<g>${vs.out()}</g>`);

    /* the disciples and Jesus */
    const act = S.layer({ par: 0.45, sh: 5 });
    const LK = ['peter', 'andrew', 'james', 'john', 'philip', 'bartholomew'], RK = ['matthew', 'thomas', 'jamesA', 'simonZ', 'thaddaeus', 'judas'];
    const left = act.sprite(disciples(c, LK, { s: 0.9, spread: 46, rows: 2 }), 500, JY + 10);
    const leftQ = act.sprite(disciples(c, LK, { s: 0.9, spread: 46, rows: 2, heads: [16, 10, 20], arms: [60, 40] }), 500, JY + 10);
    const right = act.sprite(disciples(c, RK, { s: 0.9, spread: 46, rows: 2, flip: true }), 1080, JY + 14);
    const rightQ = act.sprite(disciples(c, RK, { s: 0.9, spread: 46, rows: 2, flip: true, heads: [16, 10, 20], arms: [60, 40] }), 1080, JY + 14);
    const J = S.puppet(act.add(person(c, CAST.jesus)));
    const fx = S.layer({ par: 0.3, sh: 6 });
    const scrollEl = fx.add(`<g>${onString(`<g transform="translate(0 40)">${scrollOpen(c, 150, 64)}</g>`, 1600)}</g>`);
    const dark = mix(INK, C.storm2, 0.15), paper = '#f3e2c2';
    const HALO = `<path d="${c.ribbon(c.arc(0, 0, 9, 9, 0, PI * 2, 16), 1.6)}" fill="${C.halo}"/>`;
    const him = (x, s = 0.26, bound = false) => `<g transform="translate(${x} 34) scale(${s})">${shadowPerson(c, { hairStyle: 'long', beard: 'full' }, dark)}<g transform="translate(2 -167)">${HALO.replace('<path', '<path transform="scale(3)"')}</g></g>`;
    const P1 = him(-16) + `<g transform="translate(22 34) scale(-.26 .26)">${soldierSil(c, 0, { col: dark })}</g><g transform="translate(40 34) scale(-.24 .24)">${soldierSil(c, 1, { col: dark, spear: false })}</g>`;
    const P2 = `<g transform="translate(-10 26) scale(.7)">${thornCrown(c, 26, dark)}</g><g transform="translate(20 30) rotate(18) scale(.6)">${reed(c, dark)}</g>`;
    const P3 = him(0) + `<g transform="translate(-34 34) scale(.22)">${shadowPerson(c, { hairStyle: 'short', beard: 'short' }, dark)}</g><g transform="translate(34 34) scale(-.22 .22)">${shadowPerson(c, { hairStyle: 'wrap', beard: 'full' }, dark)}</g>`;
    const P4 = `<g transform="translate(0 4) scale(1.1)">${whip(c, dark)}</g>`;
    const plates = [P1, P2, P3, P4].map((inner, i) => ({ i, el: fx.add(`<g>${plate(c, inner, { r: 50, face: paper })}</g>`) }));
    const days = ['I', 'II', 'III'].map((d, i) => ({ i, el: fx.add(`<g>${onString(numDisc(c, d, { r: 22, size: 20 }), 1600)}</g>`) }));
    const qs = [0, 1, 2, 3].map((i) => ({ i, el: fx.add(`<g opacity="0">${question(c)}</g>`) }));

    return (t, time) => {
      const T = time;
      /* the sky: evening falls at the killing, night, then dawn on the third day */
      const eveK = es(t, 3.05, 3.4) * (1 - es(t, 4.45, 4.7));
      const nightK = es(t, 3.4, 3.7) * (1 - es(t, 4.4, 4.65));
      R.update(T, { eveK, nightK });
      const dawn = es(t, 4.45, 4.75) * (1 - es(t, 5.9, 6.2));
      pose(R.cityGlow, { x: CX, y: CY - 20, s: 0.6 + Math.max(es(t, 1.1, 1.4) * (1 - es(t, 2.0, 2.3)) * 0.4, dawn * 0.8), o: Math.max(es(t, 1.1, 1.4) * (1 - es(t, 2.0, 2.3)), dawn) });
      pose(R.rays, { x: CX, y: CY - 30, o: dawn * 0.9 });

      /* v31a — the Twelve drawn aside, close round Him */
      const close = es(t, 0.05, 0.6);
      const lx = lerp(430, 590, close), rx = lerp(1180, 990, close);
      const puzzled = es(t, 5.05, 5.15);
      left.set({ x: lx, y: JY + 10, o: 1 - puzzled });
      leftQ.set({ x: lx, y: JY + 10, o: puzzled });
      right.set({ x: rx, y: JY + 14, o: 1 - puzzled });
      rightQ.set({ x: rx, y: JY + 14, o: puzzled });
      qs.forEach((q) => {
        const k = es(t, 5.1 + q.i * 0.06, 5.3 + q.i * 0.06, ease.back) * (1 - es(t, 6.2, 6.4));
        const x = [lx - 50, lx + 30, rx - 30, rx + 50][q.i];
        pose(q.el, { x, y: JY - 210 - (q.i % 2) * 18 + (T ? Math.sin(T * 1.5 + q.i) * 3 : 0), s: k, o: k > 0.02 ? 1 : 0 });
      });

      /* Jesus: gathers them, points to the city, speaks on; head bowed as the veil comes down */
      const point = es(t, 1.05, 1.25) * (1 - es(t, 4.9, 5.1));
      J.set({ x: JX, y: JY, s: 1.06, flip: false, armF: 20 + bump(t, 0.1, 0.9) * 40 + point * 70, armB: 10 + bump(t, 0.1, 0.9) * 80, head: -point * 10 + es(t, 6.1, 6.4) * 6, blink: blinkAt(T) });

      /* v31b — the prophets' scroll over the city */
      const sk = es(t, 1.1, 1.35, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      pose(scrollEl, { x: CX, y: lerp(-1500, 220, sk), sx: Math.max(0.05, es(t, 1.3, 1.6)) });

      /* v32–v33a — the plates of the passion, one by one; the cross; v33b — three days */
      plates.forEach((p) => {
        const a = [2.05, 2.3, 2.55, 3.05][p.i];
        const k = es(t, a, a + 0.22, ease.out) * (1 - es(t, 4.9 + p.i * 0.03, 5.15 + p.i * 0.03, ease.in));
        const [x, y] = PL[p.i];
        pose(p.el, { x, y: lerp(-1500, y, k) + (T ? Math.sin(T * 0.8 + p.i) * 2 : 0), r: T ? Math.sin(T * 0.6 + p.i) * 1.2 : 0 });
      });
      pose(cross, { x: 1150, y: 446, o: es(t, 3.3, 3.5) });
      days.forEach((d) => {
        const k = es(t, 4.05 + d.i * 0.12, 4.2 + d.i * 0.12, ease.out) * (1 - es(t, 4.95, 5.2, ease.in));
        pose(d.el, { x: 720 + d.i * 80, y: lerp(-1500, 330 + (d.i === 2 ? -10 : 0), k), s: d.i === 2 ? 1 + dawn * 0.3 : 1 });
      });

      /* v34b — the cloth let down over the far view */
      const vk = es(t, 6.05, 6.5, ease.out);
      pose(veil, { x: 0, y: lerp(-1800, 0, vk) });

      S.cam.x = kf(t, [[0, 0], [1.0, 20], [2.0, 30], [5.0, 30], [6.0, 10]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.05], [5.0, 1.05], [6.0, 1.03]]);
      void DIS; void seg; void lerp; void shade; void headAt; void tr;
    };
  },
};
