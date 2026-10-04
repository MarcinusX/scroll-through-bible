// Mk 2,23–25a — on the Sabbath, walking through the ripe grain; the disciples pluck ears and rub
// out the kernels; Pharisees rise out of the wheat: "Look!" — "Have you never read what David did?"
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, olive } from '../../assets/nature.js';
import { wheatStalk, bird, seedPath } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, hand, headAt, scribe, wheatField, sabbathTag, speech, scrollOpen, GLYPH } from './lib.js';

const PI = Math.PI;
const PATH = 690;
const PAR = 0.6;
const WALK = 520;                    // how far the field slides past while they walk (world units)

export default {
  id: 'm2-grain',
  beats: [
    { v: 23, text: 'Pewnego razu, gdy Jezus przechodził w szabat wśród zbóż,' },
    { v: 23, cont: true, text: 'uczniowie Jego zaczęli po drodze zrywać kłosy.' },
    { v: 24 },
    { v: 25, text: 'On im odpowiedział: «Czy nigdy nie czytaliście, co uczynił Dawid,' },
  ],
  cam: { x: [-40, 150], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, ['#d8e3d6', '#f4e6c4', '#f8e9cf']);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const SUNX = S.portrait ? 980 : 1180;   // phone: not under the progress thread
    const sunEl = hanging(hangL, sun(c, 50), { x: SUNX, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 420, y: 150, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 250, speed: 45, scale: 0.5 });
    const tag = hanging(hangL, sabbathTag(c, tr('szabat', 'Sabbath')), { x: 800, y: 110, len: 700 });
    const tagFl = Array.from(tag.querySelectorAll('.flame'));

    /* far hills, then the fields (the field layers slide while they walk) */
    const far = S.layer({ par: 0.1, sh: 2, pad: 100 });
    far.add(hillsWith(c, { y: 430, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar, trees: 14, treeColor: C.sage2, treeH: 20, x0: -1400, x1: 3000 }).markup);
    const hills = S.layer({ par: 0.2, sh: 3, pad: 200 });
    const h2 = band(c, { y: 500, amps: [14, 6, 2], lens: [900, 300, 120], color: mix(C.hillMid, C.wheat, 0.35), x0: -1400, x1: 3000 });
    hills.add(h2.markup + olive(c, 200, h2.fn(200) + 8, 0.7) + olive(c, 1400, h2.fn(1400) + 8, 0.8) + olive(c, 2100, h2.fn(2100) + 8, 0.6));
    const backF = S.layer({ par: PAR, sh: 3, pad: WALK + 200 });
    backF.add(sheet().p(c.cut([[-1600, 590], [3400, 590], [3400, 1700], [-1600, 1700]], 1, 30), mix(C.wheat2, C.dune, 0.4)).out());
    backF.add(wheatField(c, { x0: -1600, x1: 3400, y: 600, h: 70, n: 320, color: shade(C.wheat2, -0.05), ear: C.wheat2 }));
    backF.add(wheatField(c, { x0: -1600, x1: 3400, y: 640, h: 96, n: 300, color: C.wheat2, ear: C.wheat }));
    // the path
    backF.add(sheet().p(c.cut([[-1600, 668], [3400, 668], [3400, 720], [-1600, 720]], 1.2, 12), C.sand).out());

    /* the people on the path */
    const act = S.layer({ par: PAR, sh: 5 });
    // ears at the edge of the path the disciples will pluck
    const STALKS = [590, 668, 900, 996].map((x, i) => {
      const el = act.add(`<g>${wheatStalk(c, { h: 120 + i * 6, color: C.wheat2, ear: C.wheat })}</g>`);
      const ear = el.querySelector('.ear');
      const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(ear.getAttribute('transform')) || [0, 0, -120];
      return { x, i, el, ear, stem: el.querySelector('.stem'), ex0: +m[1], ey0: +m[2] };
    });
    // phone: the Pharisees rise closer, where the camera can reach them
    const PH = (S.portrait ? [1098, 1156] : [1236, 1312]).map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(act.add(scribe(c, i + 1, { holdB: i === 0 ? `<g transform="translate(0 6) rotate(90) scale(.5)">${scrollOpen(c, 60, 30)}</g>` : '' }))) }));
    const DIS = [
      { k: 'james', x: 560 }, { k: 'andrew', x: 640 }, { k: 'peter', x: 930 }, { k: 'john', x: 1020 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[d.k] }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const grains = [];
    DIS.forEach((d, i) => { for (let j = 0; j < 5; j++) grains.push({ d, j, el: act.add(`<path d="${seedPath(c, 0, 0, 3.4, c.rr(0, 3))}" fill="${C.wheat}"/>`), dx: c.rr(-8, 8), ph: c.rr(0, 1) }); });

    /* wheat in front of the path */
    const frontF = S.layer({ par: 0.7, sh: 5, pad: WALK + 250 });
    frontF.add(wheatField(c, { x0: -1600, x1: 3400, y: 790, h: 120, n: 260, color: C.wheat2, ear: C.wheat, back: mix(C.wheat2, C.dune, 0.3) }));

    /* voices: "Look!", and the scroll He answers with */
    const fx = S.layer({ par: 0.62, sh: 5 });
    const earIcon = `<g transform="translate(-12 22) scale(.5)">${wheatStalk(c, { h: 50 }).replace(/class="stalk"/, '')}</g>`;
    const look = fx.add(`<g>${speech(c, `${earIcon}<g transform="translate(14 0)">${GLYPH.bang(c)}</g>`, { w: 60, h: 50, flip: true })}</g>`);
    const crown = sheet().p(c.cut([[-16, 8], [-18, -10], [-9, -2], [0, -14], [9, -2], [18, -10], [16, 8]], 0.3, 3), C.sun).x(c.poly(c.circ(0, -1, 2.4, 6)), C.terracotta).out();
    const harp = sheet().p(c.ribbon(c.qbez([-10, 14], [-14, -12], [8, -16], 10), 3) + c.ribbon([[-10, 14], [10, 12], [8, -16]], 3), C.wood2).x(c.ribbon([[-6, 10], [-4, -10]], 0.8) + c.ribbon([[0, 11], [1, -12]], 0.8) + c.ribbon([[5, 11], [5, -13]], 0.8), C.ink).out();
    const scrollEl = fx.add(`<g>${scrollOpen(c, 110, 74)}<g transform="translate(-24 4)">${crown}</g><g transform="translate(22 4)">${harp}</g></g>`);

    // the field slides left as they walk (so they stay in the middle of the stage)
    const walkK = [[-0.6, 0], [0.95, WALK]];

    return (t, time) => {
      const T = time;
      swing(sunEl, SUNX, 150, T, 1, 0.6);
      swing(cl1, 420 + Math.sin(T * 0.1) * 24, 150, T, 1.2, 0.7, 1);
      birds(T, 1);
      const tg = es(t, 0.15, 0.55, ease.back);
      pose(tag, { x: 800, y: lerp(-120, 175, tg), r: Math.sin(T * 0.9) * 2 });
      tagFl.forEach((f, i) => pose(f, { y: -60, sx: 1 + Math.sin(T * 7 + i) * 0.1, sy: 1 + Math.sin(T * 5 + i) * 0.1 }));

      const shift = kf(t, walkK, (u) => u);
      const walking = t > -0.6 && t < 0.95;
      far.shift(-shift * 0.15, 0);
      hills.shift(-shift * 0.35, 0);
      backF.shift(-shift, 0);
      frontF.shift(-shift * 1.15, 0);

      /* Jesus and the four */
      const answer = es(t, 3.02, 3.25);
      const toPh = es(t, 2.1, 2.3);
      jesus.set({ x: 800, y: PATH, s: 1.04, flip: false, walk: walking ? shift * 0.05 : undefined, armF: bump(t, 1.1, 1.8) * 20 + answer * 110 * (1 - es(t, 3.7, 3.9) * 0.3), armB: answer * 30, head: -answer * 8 + toPh * 2, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const pl = STALKS[d.i];
        const reach = es(t, 1.05 + d.i * 0.08, 1.25 + d.i * 0.08);
        const rub = es(t, 1.3 + d.i * 0.08, 1.4 + d.i * 0.08) * (1 - es(t, 2.0, 2.2));
        const eat = bump(t, 1.7 + d.i * 0.05, 2.0 + d.i * 0.05);
        const startle = es(t, 2.05, 2.25);
        const faceStalk = pl.x < d.x;
        d.p.set({
          x: d.x, y: PATH + (d.i % 2 ? 4 : -4), s: 0.95, flip: reach > 0 && reach < 1 && faceStalk ? true : startle > 0.5 ? d.x < 800 ? false : true : false,
          walk: walking ? shift * 0.05 + d.i : undefined,
          armF: reach * (1 - rub) * 50 + rub * (70 + Math.sin(t * 50) * 10) * (1 - startle) + eat * 40, armB: rub * (60 + Math.sin(t * 50 + 1) * 10) * (1 - startle),
          head: rub * 10 - eat * 8 - startle * 4, blink: blinkAt(T, d.seed),
        });
      });
      // stalks slide with the field, then their ears are plucked into the disciples' hands
      STALKS.forEach((st) => {
        const d = DIS[st.i];
        const fx_ = st.x + WALK - shift;
        pose(st.el, { x: fx_, y: PATH - 16, r: Math.sin(T * 1.2 + st.i) * 1.5 });
        const pick = es(t, 1.15 + st.i * 0.08, 1.3 + st.i * 0.08);
        const gone = es(t, 1.45 + st.i * 0.08, 1.6 + st.i * 0.08);
        const [hx, hy] = hand(d.x, PATH, 0.95, st.x < d.x, 50);
        const ex = lerp(st.ex0, hx - fx_, pick), ey = lerp(st.ey0, hy - (PATH - 16), pick);
        pose(st.ear, { x: ex, y: ey, r: pick * 60, s: 1 - gone * 0.8, o: 1 - gone });
        pose(st.stem, { r: pick * 4 });
      });
      grains.forEach((g) => {
        const k = seg(t, 1.35 + g.d.i * 0.08 + g.ph * 0.3, 1.75 + g.d.i * 0.08 + g.ph * 0.3);
        const [hx, hy] = hand(g.d.x, PATH, 0.95, false, 70);
        pose(g.el, { x: hx + g.dx, y: hy + k * 110, r: k * 300, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* the Pharisees rise out of the wheat and object */
      PH.forEach((m) => {
        const up = es(t, 1.95 + m.i * 0.08, 2.3 + m.i * 0.08, ease.out);
        const point = m.i === 0 ? bump(t, 2.3, 3.2) : 0;
        m.p.set({ x: m.x - up * 30, y: lerp(PATH + 150, PATH + 4, up), s: 0.98, flip: true, o: up > 0.01 ? 1 : 0, armF: point * 90 + up * 10, armB: m.i === 1 ? es(t, 2.35, 2.6) * 60 : 20, head: -point * 4 + es(t, 3.2, 3.5) * 8, lean: point * 4, blink: blinkAt(T, m.seed) });
      });
      const lk = es(t, 2.3, 2.5, ease.back) * (1 - es(t, 2.95, 3.1));
      const [lhx, lhy] = headAt(PH[0].x - 30, PATH + 4, 0.98, true);
      pose(look, { x: lhx - 20, y: lhy - 14, s: lk, o: lk > 0.01 ? 1 : 0 });

      /* "Have you never read…?" — the scroll rises and opens */
      const [jhx, jhy] = hand(800, PATH, 1.04, false, 110);
      const rise = es(t, 3.2, 3.75, ease.out);
      pose(scrollEl, { x: lerp(jhx, 800, rise), y: lerp(jhy - 10, 380, rise), s: lerp(0.3, 1.5, rise), sx: 0.15 + 0.85 * es(t, 3.3, 3.7), r: Math.sin(T * 0.9) * 1.5 * rise, o: seg(t, 3.08, 3.2) });

      S.cam.z = kf(t, [[-0.5, 1.02], [0.9, 1.04], [1.2, 1.1], [1.9, 1.1], [2.2, 1.04], [3.1, 1.04], [3.8, 1.0]]);
      S.cam.y = kf(t, [[-0.5, 10], [1.2, 30], [1.9, 30], [2.2, 10], [3.1, 10], [3.8, -30]]);
      S.cam.x = S.portrait ? kf(t, [[1.9, 0], [2.3, 150], [3.1, 130]]) : kf(t, [[1.9, 0], [2.3, 30], [3.1, 0]]);
    };
  },
};
