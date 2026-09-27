// Mk 5,14–17 — the herdsmen run to the town and the farms; the people come down to see; they find the man
// sitting there, clothed (John has put a mantle round him) and in his right mind — and they are afraid;
// the herdsmen tell about the man and the pigs; and they beg Jesus to leave their country.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { rock, reeds, house } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK, kf, shoreSet, bubble, glyphTag, staff, pig, townsfolk, headAt, spirit } from './lib.js';

const PI = Math.PI;
const JX = 790, FEET = 722, MX = 690;

export default {
  id: 'm5-town',
  beats: [
    { v: 14, text: 'Pasterze zaś uciekli i rozpowiedzieli to w mieście i po zagrodach,' },
    { v: 14, cont: true, text: 'a ludzie wyszli zobaczyć, co się stało.' },
    { v: 15, text: 'Gdy przyszli do Jezusa, ujrzeli opętanego, który miał w sobie "legion", jak siedział ubrany i przy zdrowych zmysłach.' },
    { v: 15, cont: true, text: 'Strach ich ogarnął.' },
    { v: 16 },
    { v: 17 },
  ],
  cam: { x: [-20, 300], y: [-80, 50], z: [0.95, 1.12] },
  build(S) {
    const c = S.c;
    const SKY = ['#bfd7da', '#f0e5cb', '#f7e8cc'];
    const set = shoreSet(S, { skyCols: SKY, sunAt: [1180, 110], sunR: 44 });

    /* ---------- the town on the hill, farmsteads on its slopes ---------- */
    const townL = S.layer({ par: 0.3, sh: 3 });
    const TOWN = [[1230, 0], [1290, 1], [1350, 2], [1420, 3], [1490, 4], [1560, 5]].map(([x, i]) => {
      const y = set.hfn(x) - 60 + i * 2;
      return { x, y };
    });
    let tm = '';
    TOWN.forEach((h, i) => { tm += house(c, h.x - 30, h.y + (i % 2) * 6, c.rr(42, 58), c.rr(30, 40), { stairs: i % 2 === 0 }); });
    townL.add(tm);
    const FARMS = [[1050, 0.8], [1150, 0.75], [1660, 0.8]].map(([x, sc], i) => {
      const y = set.hfn(x) + 2;
      townL.add(house(c, x - 22, y, 44 * sc, 32 * sc, { stairs: false }) + sheet().p(c.ribbon([[x - 40, y + 2], [x + 40, y + 2]], 3), C.wood2).out());
      return { x, y };
    });
    const alarms = [...TOWN.filter((_, i) => i % 2 === 0), ...FARMS].map((h, i) => ({ h, i, el: townL.add(`<g>${glyphTag(c, '!', { size: 20 })}</g>`) }));

    /* ---------- the boat, the disciples ---------- */
    const backL = S.layer({ par: 0.5, sh: 4 });
    const B = boat(c, {});
    backL.add(`<g transform="translate(240 760) scale(.86)">${B.back}${B.front}</g>`);
    const DIS = [
      { cast: CAST.james, x: 470 }, { cast: CAST.andrew, x: 530 }, { cast: CAST.peter, x: 590 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(backL.add(person(c, { ...d.cast }))) }));
    const mantle = sheet().p(c.cut([[-30, -6], [30, -8], [36, 30], [-34, 32]], 0.6, 6), LOOK.healed.mantle).x(c.ribbon([[-28, 0], [28, -2]], 2), shade(LOOK.healed.mantle, 0.3), 'opacity=".7"').out();
    const john = S.puppet(backL.add(person(c, { ...CAST.john, holdF: `<g data-k="cloth" transform="translate(6 18)">${mantle}</g>` })));
    const cloth = S.$('cloth');

    /* ---------- the man, Jesus ---------- */
    const midL = S.layer({ par: 0.5, sh: 5 });
    const glow = midL.add(`<circle r="120" fill="url(#halo-glow)"/>`);
    const wildSit = S.puppet(midL.add(person(c, { ...LOOK.wild, pose: 'sit' })));
    const healedSit = S.puppet(midL.add(person(c, { ...LOOK.healed, pose: 'sit' })));
    const jesus = S.puppet(midL.add(person(c, { ...CAST.jesus })));

    /* ---------- the herdsmen and the people of the town ---------- */
    const pL = S.layer({ par: 0.5, sh: 4 });
    const HERD = [LOOK.herdsman, LOOK.herdsman2].map((o, i) => ({ i, p: S.puppet(pL.add(person(c, { ...o, holdF: i ? '' : `<g transform="rotate(-10)">${staff(c, 190)}</g>` }))), seed: c.rr(0, 9) }));
    const N = 11;
    const folk = Array.from({ length: N }, (_, i) => {
      const row = i % 3;
      return {
        i, row, seed: c.rr(0, 9), d: c.rr(0, 0.5),
        home: [990 + Math.floor(i / 3) * 62 + row * 26 + c.rr(-8, 8), FEET - 16 + row * 12],
        p: null, o: townsfolk(c, i % 4 === 0 ? { man: true } : {}),
      };
    }).sort((a, b) => a.home[1] - b.home[1]);
    folk.forEach((f) => { f.p = S.puppet(pL.add(person(c, f.o))); });
    // the road down from the town
    const road = [[1300, set.hfn(1300) - 58], [1230, set.hfn(1230) + 6], [1160, 670], [1100, FEET - 4]];

    /* ---------- words ---------- */
    const wL = S.layer({ par: 0.52, sh: 3 });
    const arrow = (x0, y0, x1, y1) => `<path d="${c.ribbon(c.qbez([x0, y0], [(x0 + x1) / 2, Math.min(y0, y1) - 16], [x1, y1], 8), 2.4)}" fill="${C.ink}"/><path d="${c.cut([[x1 - 6, y1 - 7], [x1 + 4, y1 + 2], [x1 - 8, y1 + 4]], 0.2, 2)}" fill="${C.ink}"/>`;
    const waves = sheet().p(c.cut([[-26, 0], ...c.arc(-13, 0, 13, 7, PI, 2 * PI, 6), ...c.arc(13, 0, 13, 7, PI, 2 * PI, 6), [26, 0], [26, 12], [-26, 12]], 0.3, 4), C.lake2).out();
    // what the herdsmen tell: the pigs ran into the lake / the spirits left the man, who now sits clothed
    const tellIcon = `<g transform="translate(-40 6)">${pig(c, {})}</g>${arrow(-18, -14, 16, 0)}<g transform="translate(40 8)">${waves}</g>`;
    const tell = wL.add(`<g>${bubble(c, [' ', ' '], { w: 170, size: 22, dir: -1 })}<g transform="translate(67 -60) scale(1.25)">${tellIcon}</g></g>`);
    const manIcon = `<g transform="translate(-36 4)">${spirit(c, 1.1)}</g>${arrow(-18, -6, 10, -2)}<g transform="translate(36 22) scale(.26)">${person(c, { ...LOOK.healed, pose: 'sit' })}</g>`;
    const tell2 = wL.add(`<g>${bubble(c, [' ', ' '], { w: 160, size: 22, dir: -1 })}<g transform="translate(62 -60) scale(1.25)">${manIcon}</g></g>`);
    const leave = wL.add(`<g>${bubble(c, [tr('Odejdź od nas!', 'Leave our country!')], { size: 22, dir: -1 })}</g>`);
    const fear = [0, 1, 2].map(() => wL.add(`<g>${glyphTag(c, '!', { size: 22 })}</g>`));

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 1420, 960, 260, 100, C.rock2) + reeds(c, 170, 940, 14, 220, C.moss) + rock(c, 260, 985, 170, 60, C.rock));

    const along = (pts, u) => {
      const n = pts.length - 1, f = Math.min(n - 1e-6, Math.max(0, u) * n), i = Math.floor(f), k = f - i;
      return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)];
    };

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunY: 110 + es(t, 0, 6) * 30 });
      set.sk.blend(SKY, ['#c9dfdc', '#f2e8cf', '#f7e6c8'], seg(t, 0, 6));

      /* v14a — the herdsmen run up to the town; alarm at every door */
      HERD.forEach((h) => {
        const u = es(t, 0.05 + h.i * 0.08, 0.75 + h.i * 0.08, (x) => x);
        const back = es(t, 1.2 + h.i * 0.1, 1.9 + h.i * 0.1, (x) => x);
        const ru = u - back;
        const [x, y] = along([[1000 + h.i * 50, FEET + 4], ...road.slice().reverse().slice(1)], Math.max(0, ru));
        const tellK = es(t, 4.05, 4.3) * (1 - es(t, 4.9, 5.1));
        const hx = back > 0 ? lerp(x, 960 + h.i * 48, es(t, 1.85, 2.2)) : x;
        const running = (u > 0 && u < 1) || (back > 0 && back < 1);
        h.p.set({
          x: hx, y: back >= 1 ? FEET + 2 + h.i * 6 : y, s: lerp(0.96, 0.46, Math.max(0, ru)), flip: back > 0 && back < 1 ? true : back >= 1 ? true : false, o: 1 - bump(t, 0.9, 1.3) * 0.0,
          walk: running ? t * 36 + h.i : undefined, amt: 1.5,
          armF: running ? (h.i ? 60 : 20) : 20 + tellK * (h.i ? 100 : 0), armB: running ? 120 + Math.sin(t * 30 + h.i) * 20 : 10 + tellK * (h.i ? 30 : 130) + bump(t, 4.95, 5.4) * 60,
          lean: running ? 6 : 0, head: tellK * -6, blink: blinkAt(T, h.seed),
        });
      });
      alarms.forEach((a) => {
        const k = es(t, 0.55 + a.i * 0.06, 0.72 + a.i * 0.06, ease.back) * (1 - es(t, 1.4, 1.6));
        pose(a.el, { x: a.h.x, y: a.h.y - 60, s: k, r: k > 0.02 ? Math.sin(T * 6 + a.i) * 6 : 0, o: k > 0.02 ? 1 : 0 });
      });

      /* v14b–15 — the people come down; then fear; then they beg Him to go */
      const afraid = es(t, 3.05, 3.3);
      const beg = es(t, 5.05, 5.4);
      folk.forEach((f) => {
        const u = es(t, 1.05 + f.d, 1.85 + f.d, (x) => x);
        const [rx, ry] = along([...road, f.home], u);
        const walking = u > 0 && u < 1;
        const x = rx + afraid * (30 + f.row * 10) - beg * 20;
        const fromTop = 1 - seg(t, 1.05 + f.d, 1.4 + f.d);
        f.p.set({
          x, y: ry, s: lerp(0.46, 0.92, u), flip: true, o: seg(t, 1.0 + f.d, 1.1 + f.d),
          walk: walking ? t * 30 + f.seed : undefined,
          armF: 10 + afraid * (1 - beg) * (f.i % 2 ? 110 : 40) + beg * (70 + (f.i % 3) * 10) + bump(t, 2.05, 2.9) * (f.i % 3 === 0 ? 70 : 0),
          armB: 6 + afraid * (1 - beg) * (f.i % 2 ? 40 : 140) + beg * 40,
          lean: -afraid * 6 * (1 - beg) + beg * 6, head: -afraid * 6 + beg * 4 + fromTop * 0, blink: blinkAt(T, f.seed),
        });
      });
      fear.forEach((g, i) => {
        const f = folk[2 + i * 3];
        const k = es(t, 3.05 + i * 0.08, 3.25 + i * 0.08, ease.back) * (1 - es(t, 3.85, 4.0));
        pose(g, { x: f.home[0] + 40, y: FEET - 200, s: k, r: k > 0.02 ? Math.sin(T * 7 + i) * 6 : 0, o: k > 0.02 ? 1 : 0 });
      });

      /* the man: John wraps a mantle round him; he sits clothed and quiet */
      const dress = es(t, 1.8, 1.86);
      wildSit.set({ x: MX, y: FEET, s: 1, flip: false, o: 1 - dress, armF: 20, armB: 16, head: 8, lean: 6, blink: blinkAt(T, 3) });
      healedSit.set({ x: MX, y: FEET, s: 1, flip: false, o: dress, armF: 30 + bump(t, 5.2, 6) * 30, armB: 20, head: -es(t, 2.1, 2.6) * 4, blink: blinkAt(T, 3) });
      pose(glow, { x: MX + 6, y: FEET - 100, s: 1 + (t > 1.8 && t < 3.2 ? Math.sin(T * 1.2) * 0.04 : 0), o: bump(t, 1.8, 3.2) * 0.8 });
      const jx = kf(t, [[1.1, 640], [1.6, MX - 64], [2.1, MX - 64], [2.5, 620]]);
      const give = bump(t, 1.55, 2.0);
      john.set({ x: jx, y: FEET - 8, s: 0.94, flip: t > 2.05, walk: (t > 1.1 && t < 1.6) || (t > 2.1 && t < 2.5) ? jx * 0.06 : undefined, armF: 30 + give * 60, armB: 10 + give * 40, lean: give * 8, blink: blinkAt(T, 7) });
      pose(cloth, { x: 6, y: 18, s: 1, o: 1 - dress });
      DIS.forEach((d) => d.p.set({ x: d.x, y: FEET - 12 + d.i * 3, s: 0.92, flip: false, armF: 10 + afraid * 20, armB: 8, head: -2, blink: blinkAt(T, d.seed) }));

      /* Jesus */
      const turn = es(t, 5.6, 5.8);
      jesus.set({ x: JX, y: FEET, s: 1, flip: turn > 0.5, armF: 14 + bump(t, 2.05, 3.0) * 40 + beg * (1 - turn) * 30, armB: 8, head: -bump(t, 2.1, 3) * 4 + beg * 4, blink: blinkAt(T) });

      /* bubbles */
      const show = (el, a, b, x, y) => { const k = es(t, a, a + 0.2, ease.back) * (1 - es(t, b - 0.12, b)); pose(el, { x, y, s: k, o: k > 0.02 ? 1 : 0 }); };
      show(tell2, 4.1, 4.62, 1000, FEET - 226);
      show(tell, 4.55, 5.05, 980, FEET - 230);
      show(leave, 5.12, 6.0, 1040, FEET - 220);

      /* camera: up the hill to the town, back down to the shore */
      const far = S.portrait ? 270 : 150;
      S.cam.x = far * es(t, 0, 0.6) - (far - 40) * es(t, 1.3, 2.1) + es(t, 3.9, 4.4) * 30;
      S.cam.y = -60 * es(t, 0, 0.6) + 80 * es(t, 1.3, 2.1);
      S.cam.z = 1.0 - es(t, 0, 0.6) * 0.04 + es(t, 1.3, 2.1) * 0.08 + bump(t, 2.1, 3.1) * 0.04;
    };
  },
};
