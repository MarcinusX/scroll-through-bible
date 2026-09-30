// J 6,1–4 — the curtains open on the Sea of Galilee, the Sea of Tiberias: a boat with Jesus and His disciples
// crosses to the far side. A great crowd follows along the shore road — medallions of the signs He did for the
// sick come down on their strings (a healed man carries his mat). Jesus goes up the green hill and sits there
// with His disciples. Passover is near: a plate with the lamb and the unleavened bread, and spring flowers open.
import { C, person, CAST, blinkAt, pose, lerp, curtains, hanging, sky, sheet, shade, mix } from '../kit.js';
import { band, waterBand, town, sun, cloud, grass, flowers, olive, cypress, rock, bush } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { SPRING, LOOK, DISC, TW, folk, group, hull, smallSail, signMedal, hungWord, rolledMat, matzahRound, heart, sparkle, kf, moving, tr, PI } from './lib.js';
import { lamb } from '../mark11/lib.js';

const KX = 800;            // the top of the knoll where Jesus sits
const ROADY = 792;

export default {
  id: 'j6-crowd',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'Szedł za Nim wielki tłum,' },
    { v: 2, cont: true, text: 'bo widziano znaki, jakie czynił na tych, którzy chorowali.' },
    { v: 3 },
    { v: 4 },
  ],
  cam: { x: [-40, 40], y: [-30, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const sk = sky(S, SPRING);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1210, y: 150, len: 800 });
    const cls = [[470, 150, 200], [980, 112, 150]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 800 }), x, y, i }));

    /* the far shore with Tiberias, the lake */
    const far = S.layer({ par: 0.08, sh: 2 });
    const fb = band(c, { y: 380, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) });
    far.add(fb.markup + town(c, { x: 400, y: fb.fn(400) + 14, n: 7, spread: 240, sc: 0.42 }));
    const lakeL = S.layer({ par: 0.12, sh: 1 });
    lakeL.add(waterBand(c, { y: 404, color: mix(C.lake, C.skyBlue, 0.25), foamN: 26, bottom: 1200 }).markup);
    const sails = [[560, 440, 0.5], [1300, 452, 0.42]].map(([x, y, s], i) => ({ x, y, s, i, el: lakeL.add(`<g>${smallSail(c, { w: 60 })}</g>`) }));

    /* the boat crossing with Jesus and four disciples */
    const boatL = S.layer({ par: 0.2, sh: 4 });
    const H = hull(c, { w: 300 });
    const crew = [[-90, CAST.andrew], [-40, CAST.peter], [70, CAST.john], [120, CAST.james]];
    const boat = boatL.add(`<g><g>${H.back}</g><g data-k="jboat">${crew.map(([x, o]) => `<g transform="translate(${x} -30)">${person(c, o)}</g>`).join('')}<g transform="translate(14 -30)">${person(c, { ...CAST.jesus })}</g></g><g transform="translate(-30 -30) rotate(0)"><path d="${c.ribbon([[0, -250], [0, -30]], 5)}" fill="${C.wood2}"/><path d="${c.cut([[4, -246], [110, -70], [4, -64]], 0.5, 6)}" fill="${C.sail}"/></g><g>${H.front}</g></g>`);
    const jBoat = S.$('jboat');
    const wake = boatL.add(`<path d="${c.ribbon([[0, 0], [-60, 3], [-140, 1]], (u) => 5 - u * 4)}" fill="${C.foam}" opacity=".8"/>`);

    /* the green hill (knoll) rising in front of the lake, and the shore road */
    const hill = S.layer({ par: 0.3, sh: 3 });
    const hfn = (x) => 712 - Math.max(0, 1 - Math.abs(x - KX) / 600) ** 1.5 * 150 + Math.sin(x * 0.013) * 5;
    hill.add(sheet().p(c.ridge(hfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.3)).out());
    hill.add(olive(c, 400, hfn(400) + 20, 0.8) + cypress(c, 1180, hfn(1180) + 14, 120) + olive(c, 1300, hfn(1300) + 22, 0.7) + rock(c, KX + 10, hfn(KX) + 22, 170, 40, C.rock2));
    hill.add(grass(c, { x0: -800, x1: 2400, y: 700, fn: hfn, n: 50, h: 12, color: C.moss }));
    const blooms = [0, 1, 2, 3, 4, 5].map((i) => {
      const x = 470 + i * 130 + c.rr(-20, 20);
      return { i, x, y: hfn(x) + 20, el: hill.add(`<g>${flowers(c, { x0: -40, x1: 40, y: 0, n: 5 })}</g>`) };
    });

    /* Jesus and the disciples: walking puppets, then seated ones */
    const act = S.layer({ par: 0.34, sh: 5 });
    const SEAT = [[-120, CAST.andrew], [-60, CAST.peter], [60, CAST.john], [120, CAST.james], [175, LOOK.philip], [-175, LOOK.nathanael]];
    const dis = SEAT.map(([dx, o], i) => ({ dx, i, seed: c.rr(0, 9), w: S.puppet(act.add(person(c, o))), s: S.puppet(act.add(person(c, { ...o, pose: 'sit' }))) }));
    const jW = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const jS = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'sit' })));

    /* the road in front and the crowd that follows */
    const road = S.layer({ par: 0.5, sh: 3 });
    const rfn = (x) => ROADY - 30 + Math.sin(x * 0.004) * 6;
    road.add(sheet().p(c.ridge((x) => rfn(x) - 36, -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.45)).p(c.ribbon([[-900, rfn(-900)], [2500, rfn(2500)]], 44, 2), mix(C.sand, C.cream, 0.35)).out());
    road.add(grass(c, { x0: -800, x1: 2400, y: 740, fn: (x) => rfn(x) - 34, n: 40, h: 12, color: C.moss }));
    const walkL = S.layer({ par: 0.55, sh: 5 });
    const GROUPS = Array.from({ length: 7 }, (_, g) => {
      const mem = Array.from({ length: 3 }, (_, k) => ({ x: k * 46 - 46 + c.rr(-8, 8), y: c.rr(-8, 6), s: 0.78 * c.rr(0.92, 1.05), flip: false, o: folk(c, null, k === 1 && g === 3 ? { holdF: `<g transform="translate(0 4)">${rolledMat(c, 70)}</g>` } : {}) }));
      return { g, x0: -380 - g * 190, el: walkL.add(`<g>${group(c, mem)}</g>`) };
    });
    // the man healed at the pool, carrying his mat, and a mother with her child
    const mat = S.puppet(walkL.add(person(c, { ...folk(c, true, { robe: C.linen2, mantle: C.sageRobe }), holdF: `<g transform="translate(0 2)">${rolledMat(c, 96)}</g>` })));
    const kid = S.puppet(walkL.add(person(c, { ...LOOK.boy, robe: C.roseRobe, hair: C.hair2, hairStyle: 'short' })));
    const mum = S.puppet(walkL.add(person(c, folk(c, false))));

    /* from the flies: the name of the lake, the medallions of the signs, the Passover plate */
    const fly = S.layer({ par: 0.2, sh: 6 });
    const lakeName = fly.add(hungWord(c, tr('Jezioro Galilejskie · Tyberiadzkie', 'the Sea of Galilee · of Tiberias'), { size: 22 }));
    const bedIcon = `<g transform="translate(0 6)"><path d="${c.cut(c.rect(-18, -4, 36, 8), 0.3, 3)}" fill="${C.wood3}"/><path d="${c.cut(c.circ(-12, -10, 6, 10), 0.2, 3)}" fill="${C.skin2}"/><path d="${c.cut([[-6, -10], [18, -8], [18, -3], [-6, -3]], 0.3, 3)}" fill="${C.linen}"/></g><g transform="translate(6 -16)">${heart(c, 8)}</g>`;
    const matIcon = `<g transform="translate(0 4) rotate(-10)">${rolledMat(c, 44)}</g>`;
    const medals = [[2, bedIcon, 660], [3, matIcon, 940]].map(([n, icon, x], i) => ({ i, x, el: hanging(fly, signMedal(c, n, icon, 44), { x, y: 0, len: 800 }) }));
    const plateInner = (() => {
      const s = sheet().p(c.cut(c.circ(0, 0, 66, 40), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 60, 40), 0.5, 5), C.cream).out();
      return `${s}<g transform="translate(-20 12) scale(.6)">${lamb(c)}</g><g transform="translate(26 -12) scale(.66)">${matzahRound(c, 30)}</g><text x="0" y="42" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="19" font-style="italic" fill="${C.terracotta}">${tr('Pascha', 'Passover')}</text>`;
    })();
    const plate = hanging(fly, plateInner, { x: 0, y: 0, len: 800 });
    const sparks = [0, 1, 2, 3].map((i) => fly.add(`<g>${sparkle(c, 12)}</g>`));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 90, 960, 260, C.sage, C.moss) + bush(c, 1530, 960, 260, C.moss, C.sage));

    const cur = curtains(S);

    // Jesus' path: out of the boat on the right shore, up to the top of the knoll
    // phone: the boat lands inside the narrow screen, and the crowd is already in view during its own sentence
    const P = S.portrait;
    const LAND = P ? 1040 : 1190;
    const PX = P ? 960 : 1040;
    const JK = [[4.05, P ? 1050 : 1200], [4.6, KX]];
    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      pose(sunEl, { x: 1210, y: 150, r: Math.sin(T * 0.6) });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(T * 0.1 + cl.i) * 24, y: cl.y, r: Math.sin(T * 0.6 + cl.i) * 1.2 }));
      sails.forEach((s) => pose(s.el, { x: s.x + Math.sin(T * 0.08 + s.i) * 30, y: s.y + Math.sin(T * 1.1 + s.i) * 1.5, s: s.s, r: Math.sin(T * 0.9 + s.i) * 2 }));

      /* v1 — across the sea */
      const cross = es(t, 1.0, 1.85, ease.io);
      const bx = lerp(250, LAND, cross), by = lerp(470, 640, cross), bs = lerp(0.34, 0.5, cross);
      pose(boat, { x: bx, y: by + Math.sin(T * 1.2) * 2, s: bs, r: Math.sin(T * 0.9) * 1.4 });
      pose(wake, { x: bx - 70 * bs * 2, y: by + 2, s: bs * 1.6, r: 8, o: cross > 0.02 && cross < 0.98 ? 0.8 : 0 });
      const nk = es(t, 1.1, 1.4, ease.out) * (1 - es(t, 1.95, 2.15));
      pose(lakeName, { x: 800, y: lerp(-420, 250, nk), r: Math.sin(T * 0.8) * 1.2, o: nk > 0.01 ? 1 : 0 });

      /* v2a — a great crowd follows along the shore road */
      const flow = es(t, 2.0, 4.9, (u) => u);
      GROUPS.forEach((g) => {
        const x = P ? g.x0 + 690 + kf(t, [[2.0, 0], [2.7, 560], [4.9, 810]], (u) => u) : g.x0 + flow * 1500;
        const walking = t > 2.0 && t < 4.9;
        pose(g.el, { x, y: rfn(x) - (walking ? Math.abs(Math.sin(x * 0.05 + g.g)) * 3 : 0), o: x > -300 && x < 1900 ? 1 : 0 });
      });
      /* v2b — the signs He did for the sick: two medallions; the healed man lifts his mat */
      const mx = lerp(-160, 700, es(t, 2.1, 3.6, (u) => u)) + es(t, 3.6, 4.6) * 120;
      const lift = es(t, 3.2, 3.45) * (1 - es(t, 4.3, 4.6));
      mat.set({ x: mx, y: ROADY + 8, s: 0.94, walk: t > 2.1 && t < 4.6 && lift < 0.5 ? mx * 0.06 : undefined, armF: 30 + lift * 130, armB: 20 + lift * 140, head: -lift * 8, blink: blinkAt(T, 3) });
      const kx = lerp(-300, 560, es(t, 2.2, 3.8, (u) => u)) + es(t, 3.8, 4.8) * 110;
      const hop = bump(t, 3.25, 3.6) + bump(t, 3.6, 3.95);
      kid.set({ x: kx + 60, y: ROADY + 14 - hop * 22, s: 0.6, walk: t > 2.2 && t < 4.8 ? kx * 0.09 : undefined, armF: 30 + hop * 100, armB: 20 + hop * 120, blink: blinkAt(T, 5) });
      mum.set({ x: kx, y: ROADY + 10, s: 0.92, walk: t > 2.2 && t < 4.8 ? kx * 0.06 : undefined, armF: 40 + bump(t, 3.2, 3.9) * 50, armB: 10, head: -bump(t, 3.2, 3.9) * 6, blink: blinkAt(T, 7) });
      medals.forEach((m) => {
        const k = es(t, 3.05 + m.i * 0.12, 3.4 + m.i * 0.12, ease.out) * (1 - es(t, 4.0, 4.25));
        pose(m.el, { x: m.x, y: lerp(-480, 250, k), r: Math.sin(T * 0.9 + m.i) * 2, o: k > 0.01 ? 1 : 0 });
      });

      /* v3 — He goes up the hill and sits there with His disciples */
      const jx = kf(t, JK, ease.io);
      const up = es(t, 4.05, 4.6);
      const sitK = es(t, 4.62, 4.7);
      const onShore = seg(t, 3.98, 4.06);
      const jy = hfn(jx) + 8;
      jW.set({ x: jx, y: jy, s: 0.8, flip: true, walk: moving(t, JK) ? jx * 0.07 : undefined, o: onShore * (1 - sitK), armF: 10, blink: blinkAt(T, 1) });
      const blessK = es(t, 5.1, 5.45);
      jS.set({ x: KX, y: hfn(KX) + 8, s: 0.82, flip: false, o: sitK, armF: 20 + blessK * 50, armB: 10 + blessK * 30, head: -blessK * 4, blink: blinkAt(T, 1) });
      dis.forEach((d) => {
        const k = es(t, 4.1 + d.i * 0.04, 4.62 + d.i * 0.03);
        const sx = KX + d.dx;
        const x = lerp(P ? 1050 + d.i * 10 : 1200 + d.i * 30, sx, k);
        const sk_ = es(t, 4.66 + d.i * 0.02, 4.74 + d.i * 0.02);
        const turn = sx > KX;
        d.w.set({ x, y: hfn(x) + 10, s: 0.74, flip: true, walk: k > 0 && k < 1 ? x * 0.07 + d.i : undefined, o: onShore * (1 - sk_), blink: blinkAt(T, d.seed) });
        d.s.set({ x: sx, y: hfn(sx) + 12, s: 0.74, flip: turn, o: sk_, armF: 20 + (d.i % 2) * 20, armB: 10, head: turn ? 4 : -4, blink: blinkAt(T, d.seed) });
      });
      pose(jBoat, { o: 1 - onShore });   // Jesus steps out of the boat

      /* v4 — Passover is near */
      const pk = es(t, 5.05, 5.4, ease.out);
      pose(plate, { x: PX, y: lerp(-480, 250, pk), r: Math.sin(T * 0.8) * 1.6, o: pk > 0.01 ? 1 : 0 });
      sparks.forEach((sp, i) => {
        const k = es(t, 5.3 + i * 0.06, 5.5 + i * 0.06);
        const a = i * 1.6 + T * 0.4;
        pose(sp, { x: PX + Math.cos(a) * 90, y: 250 + Math.sin(a) * 60, s: k * (0.7 + Math.sin(T * 2 + i) * 0.2), r: T * 40, o: k * 0.9 });
      });
      blooms.forEach((b) => {
        const k = es(t, 5.1 + b.i * 0.07, 5.35 + b.i * 0.07, ease.back);
        pose(b.el, { x: b.x, y: b.y, s: k, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.z = 1 + es(t, 0.5, 1.2) * 0.02 + es(t, 4.0, 4.8) * 0.06;
      S.cam.y = es(t, 0.5, 1.2) * 20 - es(t, 4.0, 4.8) * 40 + es(t, 5.0, 5.5) * 20;
      S.cam.x = lerp(-30, 20, es(t, 1.0, 1.9)) - es(t, 4.1, 4.7) * 20;
    };
  },
};
