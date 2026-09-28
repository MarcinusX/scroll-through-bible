// Mt 8,33–34 — the herdsmen run up the hill road to the town; "!" at every door. In the town they tell everything:
// the pigs ran into the lake, the spirits left the two men, who now sit quiet. Then the whole town pours down the road
// to meet Jesus on the shore — and when they see Him, they beg Him to leave their country. He turns towards the boat.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { rock, reeds, house } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { shoreSet, L5, HEALED2, pig, spirit, glyphTag, staff, bubble, mob, along, kf, tr, PI } from './lib.js';

const JX = 700, FEET = 722, MX = 610;

export default {
  id: 'mt8-town',
  beats: [
    { v: 33, text: 'Pasterze zaś uciekli' },
    { v: 33, cont: true, text: 'i przyszedłszy do miasta rozpowiedzieli wszystko, a także zdarzenie z opętanymi.' },
    { v: 34, text: 'Wtedy całe miasto wyszło na spotkanie Jezusa;' },
    { v: 34, cont: true, text: 'a gdy Go ujrzeli, prosili, żeby odszedł z ich granic.' },
  ],
  cam: { x: [-60, 1020], y: [-90, 60], z: [0.95, 1.12] },
  build(S) {
    const SKY = ['#bfd7da', '#f0e5cb', '#f7e8cc'];
    const set = shoreSet(S, { skyCols: SKY, sunAt: [1180, 110], sunR: 44 });
    const c = S.c;

    /* ---------- the town on the hill ---------- */
    const townL = S.layer({ par: 0.3, sh: 3 });
    const TOWN = [1100, 1170, 1240, 1310, 1380, 1450].map((x, i) => ({ x, y: set.hfn(x) - 82 + i * 2, i }));
    let tm = '';
    TOWN.forEach((h, i) => { tm += house(c, h.x - 34, h.y + (i % 2) * 6, c.rr(52, 70), c.rr(38, 50), { stairs: i % 2 === 0 }); });
    townL.add(tm);
    const alarms = TOWN.filter((_, i) => i % 2 === 0).map((h, i) => ({ h, i, el: townL.add(`<g opacity="0">${glyphTag(c, '!', { size: 20 })}</g>`) }));
    const road = [[1240, set.hfn(1240) - 76], [1190, set.hfn(1190) - 20], [1130, 676], [1090, FEET - 4]];
    const townsF = S.layer({ par: 0.3, sh: 4 });
    const listeners = townsF.sprite(mob(makeCutter('mt8-town-l'), 5, { s: 0.5, spread: 26, rows: 1, flip: false }), 1330, set.hfn(1330) - 74);

    /* ---------- the boat, the disciples, the two men, Jesus ---------- */
    const backL = S.layer({ par: 0.5, sh: 4 });
    const B = boat(c, {});
    backL.add(`<g transform="translate(250 760) scale(.86)">${B.back}${B.front}</g>`);
    const DIS = [CAST.james, CAST.andrew, CAST.peter, CAST.john].map((o, i) => ({ i, x: 400 + i * 58, p: S.puppet(backL.add(person(c, o))), seed: c.rr(0, 9) }));
    const midL = S.layer({ par: 0.5, sh: 5 });
    const MEN = [L5.healed, HEALED2].map((o, i) => ({ i, p: S.puppet(midL.add(person(c, { ...o, pose: 'sit' }))) }));
    const jesus = S.puppet(midL.add(person(c, { ...CAST.jesus })));

    /* ---------- the herdsmen and the town ---------- */
    const pL = S.layer({ par: 0.5, sh: 4 });
    const HERD = [L5.herdsman, L5.herdsman2].map((o, i) => ({ i, p: S.puppet(pL.add(person(c, { ...o, holdF: i ? '' : `<g transform="rotate(-10)">${staff(c, 190)}</g>` }))), seed: c.rr(0, 9) }));
    const GROUPS = [0, 1, 2, 3].map((i) => ({ i, d: i * 0.12, home: [960 + i * 110, FEET - 8 + (i % 2) * 14], sp: pL.sprite(mob(makeCutter('mt8-town-g' + i), 3, { s: 0.94, spread: 40, flip: true, arms: 10 }), 960 + i * 110, FEET), beg: pL.sprite(mob(makeCutter('mt8-town-g' + i), 3, { s: 0.94, spread: 40, flip: true, arms: 0 }).replace(/<g class="armFr"[^>]*>/g, '<g class="armFr" transform="rotate(-80)">').replace(/<g class="armBr"[^>]*>/g, '<g class="armBr" transform="rotate(-40)">'), 960 + i * 110, FEET) }));

    /* ---------- words ---------- */
    const wL = S.layer({ par: 0.5, sh: 3 });
    const arrow = (x0, y0, x1, y1) => `<path d="${c.ribbon(c.qbez([x0, y0], [(x0 + x1) / 2, Math.min(y0, y1) - 16], [x1, y1], 8), 2.4)}" fill="${C.ink}"/><path d="${c.cut([[x1 - 6, y1 - 7], [x1 + 4, y1 + 2], [x1 - 8, y1 + 4]], 0.2, 2)}" fill="${C.ink}"/>`;
    const waves = sheet().p(c.cut([[-26, 0], ...c.arc(-13, 0, 13, 7, PI, 2 * PI, 6), ...c.arc(13, 0, 13, 7, PI, 2 * PI, 6), [26, 0], [26, 12], [-26, 12]], 0.3, 4), C.lake2).out();
    const tellIcon = `<g transform="translate(-40 6)">${pig(c, {})}</g>${arrow(-18, -14, 16, 0)}<g transform="translate(40 8)">${waves}</g>`;
    const tell = wL.add(`<g opacity="0">${bubble(c, [' ', ' '], { w: 170, size: 22, dir: -1 })}<g transform="translate(67 -60) scale(1.25)">${tellIcon}</g></g>`);
    const manIcon = `<g transform="translate(-40 4)">${spirit(c, 1.1)}</g>${arrow(-22, -6, 6, -2)}<g transform="translate(26 22) scale(.24)">${person(c, { ...L5.healed, pose: 'sit' })}</g><g transform="translate(48 24) scale(.24)">${person(c, { ...HEALED2, pose: 'sit' })}</g>`;
    const tell2 = wL.add(`<g opacity="0">${bubble(c, [' ', ' '], { w: 170, size: 22, dir: -1 })}<g transform="translate(62 -60) scale(1.25)">${manIcon}</g></g>`);
    const leave = wL.add(`<g opacity="0">${bubble(c, [tr('Odejdź', 'Depart'), tr('z naszych granic!', 'from our borders!')], { size: 22, dir: 1 })}</g>`);

    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 1420, 960, 260, 100, C.rock2) + reeds(c, 170, 940, 14, 220, C.moss) + rock(c, 260, 985, 170, 60, C.rock));

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunY: 110 + es(t, 0, 4) * 30 });

      /* v33a — the herdsmen run up to the town; alarm at every door */
      HERD.forEach((h) => {
        const u = es(t, 0.05 + h.i * 0.08, 0.7 + h.i * 0.08, (x) => x);
        const [x, y] = along([[980 + h.i * 50, FEET + 4], ...road.slice().reverse().slice(1)], u);
        const inTown = u >= 1;
        const tellK = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
        const running = u > 0 && u < 1;
        const tx = inTown ? 1236 + h.i * 34 : x, ty = inTown ? set.hfn(1240) - 74 : y;
        h.p.set({
          x: tx, y: ty, s: lerp(0.96, 0.56, u), flip: inTown ? false : false, o: 1,
          walk: running ? t * 36 + h.i : undefined, amt: 1.5,
          armF: running ? (h.i ? 60 : 20) : 20 + tellK * (h.i ? 100 : 40), armB: running ? 120 + Math.sin(t * 30 + h.i) * 20 : 10 + tellK * (h.i ? 30 : 130),
          lean: running ? 6 : 0, blink: blinkAt(T, h.seed),
        });
      });
      alarms.forEach((a) => {
        const k = es(t, 0.55 + a.i * 0.08, 0.72 + a.i * 0.08, ease.back) * (1 - es(t, 1.9, 2.1));
        pose(a.el, { x: a.h.x, y: a.h.y - 60, s: k, r: k > 0.02 && T ? Math.sin(T * 6 + a.i) * 6 : 0, o: k > 0.02 ? 1 : 0 });
      });
      listeners.set({ x: 1330, y: set.hfn(1330) - 74, o: es(t, 0.8, 1.0) * (1 - es(t, 2.0, 2.2)) });

      /* v33b — they tell everything: the pigs in the lake, the two men set free */
      const show = (el, a, b, x, y) => { const k = es(t, a, a + 0.2, ease.back) * (1 - es(t, b - 0.12, b)); pose(el, { x, y, s: k * 0.8, o: k > 0.02 ? 1 : 0 }); };
      const [thx, thy] = [1120, set.hfn(1240) - 190];
      show(tell, 1.08, 1.5, thx, thy);
      show(tell2, 1.45, 2.0, thx, thy);

      /* v34a — the whole town comes out to meet Jesus */
      const beg = es(t, 3.1, 3.4);
      GROUPS.forEach((g) => {
        const u = es(t, 2.05 + g.d, 2.75 + g.d, (x) => x);
        const [rx, ry] = along([...road, g.home], u);
        const s = lerp(0.56, 1, u);
        const bob = u > 0 && u < 1 ? Math.abs(Math.sin(rx * 0.05 + g.i)) * 3 : 0;
        g.sp.set({ x: rx - beg * 20, y: ry - bob, s, o: seg(t, 2.0 + g.d, 2.1 + g.d) * (1 - beg) });
        g.beg.set({ x: rx - beg * 20, y: ry, s, o: beg });
      });

      /* the two men sit quiet at His feet; the disciples by the boat */
      MEN.forEach((m) => m.p.set({ x: MX - m.i * 90, y: FEET + m.i * 6, s: 0.96, armF: 30, armB: 20, head: -4, blink: blinkAt(T, 3 + m.i) }));
      DIS.forEach((d) => d.p.set({ x: d.x, y: FEET - 12 + d.i * 3, s: 0.92, armF: 10 + es(t, 2.5, 2.9) * 20, head: -2, blink: blinkAt(T, d.seed) }));

      /* v34b — they beg Him to leave; He turns towards the boat */
      const turn = es(t, 3.5, 3.6);
      jesus.set({ x: JX, y: FEET, s: 1.02, flip: turn > 0.5, armF: 14 + es(t, 2.6, 2.9) * 40 * (1 - turn) + turn * 20, armB: 8, head: beg * 4, blink: blinkAt(T) });
      const lk = es(t, 3.12, 3.32, ease.back);
      pose(leave, { x: 1010, y: FEET - 214, s: lk, o: lk > 0.02 ? 1 : 0 });

      /* camera: up the hill to the town, back down to the shore */
      const far = S.portrait ? 1000 : 340;
      S.cam.x = far * es(t, 0.1, 0.8) - (far - 40) * es(t, 2.0, 2.7);
      S.cam.y = -70 * es(t, 0.1, 0.8) + 100 * es(t, 2.0, 2.7);
      S.cam.z = 1.0 - es(t, 0.1, 0.8) * 0.04 + es(t, 2.0, 2.7) * 0.06;
    };
  },
};
