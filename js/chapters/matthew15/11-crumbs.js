// Mt 15,25–28a — on the coast road in the evening light. She comes and kneels before Him: "Lord, help me!" A little
// stage comes down on strings (after Mark 7): children at their table with a loaf, two puppies underneath. "It is not
// right to take the children's bread and throw it to the dogs" — the loaf lifts, drifts towards the puppies… and goes
// back to the children. "Yes, Lord, but even the dogs eat the crumbs from their masters' table" — crumbs fall, the
// puppies catch them, tails wagging. "O woman, great is your faith!" — Jesus lifts His hand over her, a warm light
// opens round her, and the picture of her girl in her heart turns bright.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { bush, rock, town } from '../../assets/nature.js';
import { bed } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { coastSet, COAST2, woman, L7, puppy, loaf, bowl, heart, spark, hang2, thought, bubble, spiritCloud, headAt, voiceRings, kid, tr, PI } from './lib.js';

const GY = 700;
const JX = 880;             // Jesus
const WX = 690;             // the woman, kneeling
const MINI = { x: 760, y: 400 };
const MS = 1.3;

export default {
  id: 'mt15-crumbs',
  beats: [
    { v: 25 },
    { v: 26 },
    { v: 27 },
    { v: 28, text: 'Wtedy Jezus jej odpowiedział: «O niewiasto wielka jest twoja wiara; niech ci się stanie, jak chcesz!»' },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const set = coastSet(S, { gy: GY, skyCols: ['#ab9cc6', '#ecbca6', '#f4d4b6'], sky2: ['#d9c7a8', '#f6dcb4', '#fae9cc'], city: 1250 });
    const c = set.c;

    /* ---------- people ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = [{ o: CAST.peter, x: 1010 }, { o: CAST.john, x: 1070 }, { o: CAST.andrew, x: 1126 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, d.o))) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const wStand = S.puppet(L.add(woman(c)));
    const wKneel = S.puppet(L.add(woman(c, { pose: 'kneel' })));
    const fx0 = S.layer({ par: 0.5, sh: 6 });
    const help = fx0.add(`<g>${bubble(c, tr('Panie, dopomóż mi!', 'Lord, help me!'), { size: 22, dir: 1 })}</g>`);
    const yes = fx0.add(`<g>${bubble(c, [tr('Tak, Panie,', 'Yes, Lord,'), tr('lecz i szczenięta…', 'but even the dogs…')], { size: 19, dir: 1 })}</g>`);
    const light = fx0.add(`<g><circle r="170" fill="url(#halo-glow)"/></g>`);
    const voice = voiceRings(fx0, c, { n: 3, r: 28, color: shade(C.ochre, 0.3) });

    /* ---------- the little stage on strings ---------- */
    const mini = S.layer({ par: 0.5, sh: 6 });
    const board = sheet();
    board.p(c.cut(c.rect(-190, 0, 380, 14), 0.5, 10), C.wood);
    board.x(c.ribbon([[-186, 7], [186, 7]], 1.4), shade(C.wood, -0.25), 'opacity=".6"');
    board.p(c.cut([[-170, 0], [-170, -150], ...c.arc(0, -150, 170, 60, PI, 2 * PI, 16), [170, 0]], 0.6, 8), mix(C.cream, C.blushVeil, 0.4));
    const tbl = sheet();
    tbl.p(c.cut(c.rect(-110, -64, 220, 9), 0.4, 8), C.wood3);
    tbl.p(c.cut(c.rect(-100, -55, 7, 55), 0.3, 4) + c.cut(c.rect(93, -55, 7, 55), 0.3, 4), C.wood2);
    tbl.p(c.cut([[-106, -60], [106, -60], [102, -44], [-102, -44]], 0.4, 6), C.cream);
    const miniEl = mini.add(`<g>${hang2(`<g transform="scale(${MS})">${board.out()}${tbl.out()}<g transform="translate(40 -64)">${bowl(c, { w: 30, food: 'bread' })}</g></g>`, 170 * MS, 400)}</g>`);
    const kids = [{ x: -130, i: 0, flip: false }, { x: 130, i: 2, flip: true }].map((k) => ({ ...k, p: S.puppet(mini.add(kid(c, k.i, { pose: 'sit' }))), seed: c.rr(0, 9) }));
    const pups = [{ x: -44, col: C.ochre, patch: C.cream }, { x: 44, col: C.wood3, patch: C.linen, flip: true }].map((p, i) => ({ ...p, i, el: mini.add(`<g>${puppy(c, { col: p.col, patch: p.patch, sc: 1.1 })}</g>`) }));
    pups.forEach((p) => { p.tail = p.el.querySelector('.tail'); p.head = p.el.querySelector('.head'); });
    const bigLoaf = mini.add(`<g>${loaf(c, 16)}</g>`);
    const crumbs = Array.from({ length: 10 }, (_, i) => ({ i, el: mini.add(`<path d="${c.cut(c.blob(0, 0, 5, 3.6, 7, 0.3), 0.3, 2)}" fill="${C.wheat2}"/>`), dx: (i % 2 ? 1 : -1) * c.rr(20, 90), ph: c.rr(0, 1) }));
    const hearts = pups.map(() => mini.add(`<g>${heart(c, 7)}</g>`));

    /* ---------- her daughter, in her heart ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const plea = fx.add(`<g>${thought(c, `<g transform="translate(-26 12) scale(.36)">${bed(c, 150)}</g><g transform="translate(-14 -8) rotate(-90) scale(.22)">${person(c, { ...L7.girl, eyes: 'closed' })}</g><g data-g="dark" transform="translate(-20 -32) scale(.5)">${spiritCloud(c, { tails: false })}</g><g data-g="light" opacity="0" transform="translate(-20 -26)"><circle r="30" fill="url(#halo-glow)"/></g>`, { w: 110, h: 84 })}</g>`);
    const pleaDark = plea.querySelector('[data-g="dark"]'), pleaLight = plea.querySelector('[data-g="light"]');
    const glints = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${spark(c, 8)}</g>`), a: (i / 6) * PI * 2 }));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, -600, 890, 220, C.sage, C.moss) + bush(c, 1420, 890, 220, C.moss, C.sage) + rock(c, 300, 910, 170, 60, C.rock2));

    return (t, time) => {
      const T = time;
      set.update(T);
      set.sk2.fade(es(t, 3.05, 3.4) * 0.8);

      /* v25 — she comes and kneels: "Lord, help me!" */
      const wx = lerp(470, WX, es(t, -0.2, 0.35));
      const kneel = es(t, 0.35, 0.42);
      wStand.set({ x: wx, y: GY + 2, s: 1.0, o: 1 - kneel, walk: t < 0.35 ? wx * 0.06 : undefined, armF: 30, lean: 6, blink: blinkAt(T, 3) });
      const her = es(t, 0.45, 0.65) * (1 - es(t, 1.0, 1.1)) + es(t, 2.05, 2.25) * (1 - es(t, 2.95, 3.05));
      const listen = es(t, 1.05, 1.2) * (1 - es(t, 2.0, 2.1));
      const blessed = es(t, 3.1, 3.3);
      wKneel.set({ x: WX, y: GY + 4, s: 1.0, o: kneel, armF: 60 + her * 70 - listen * 20 + blessed * 40, armB: 30 + her * 110 + blessed * 60, head: -10 - her * 10 + listen * 12 - blessed * 10, lean: 12 - her * 6, blink: blinkAt(T, 3) });
      const [whx, why] = headAt(WX, GY + 4, 1.0, false, 46);
      const hk = es(t, 0.5, 0.7, ease.back) * (1 - es(t, 0.95, 1.08));
      pose(help, { x: whx + 30, y: why - 26, s: hk, o: hk > 0.02 ? 1 : 0 });
      const yk = es(t, 2.08, 2.28, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(yes, { x: whx + 10, y: why - 36, s: yk, o: yk > 0.02 ? 1 : 0 });

      /* Jesus: listens, speaks (v26), blesses (v28) */
      const speak = es(t, 1.05, 1.25) * (1 - es(t, 1.95, 2.05));
      const bless = es(t, 3.05, 3.3);
      jesus.set({ x: JX, y: GY, s: 1.04, flip: true, armF: 16 + bump(t, 0.4, 1.0) * 20 + speak * (40 + Math.sin(t * 9) * 8) + bless * 60, armB: 8 + speak * 20 + bless * 50, head: 8 + es(t, 2.2, 2.5) * 6 * (1 - bless) - bless * 2, blink: blinkAt(T, 1) });
      const [jhx, jhy] = headAt(JX, GY, 1.04, true);
      voice(jhx - 8, jhy + 4, speak + bless * 0.8, T, { dir: -1 });
      DIS.forEach((d) => d.p.set({ x: d.x, y: GY - 6 + (d.i % 2) * 10, s: 0.94, flip: true, head: -bump(t, 2.1, 3.0) * 8 + bless * 6, armF: d.i === 0 ? bump(t, 3.1, 3.9) * 40 : 0, blink: blinkAt(T, d.seed) }));
      pose(light, { x: WX, y: GY - 90, s: 0.6 + bless * 0.5, o: bless * 0.9 });

      /* the little stage comes down (v26), goes up again (v28) */
      const mK = es(t, 0.95, 1.3, ease.out) * (1 - es(t, 3.0, 3.3, ease.in));
      const my = MINI.y - (1 - mK) * 1150 + (T ? Math.sin(T * 0.8) * 2 : 0);
      pose(miniEl, { x: MINI.x, y: my });
      const eat = (i) => Math.max(0, Math.sin(t * 16 + i * 1.7));
      kids.forEach((k, i) => {
        k.p.set({ x: MINI.x + k.x * MS, y: my, s: 0.62 * MS, flip: k.flip, armF: 40 + eat(i) * 60, armB: 10, head: 4 - eat(i) * 4, blink: blinkAt(T, k.seed), o: mK > 0.01 ? 1 : 0 });
      });
      // v26 — the children's loaf lifts, drifts toward the puppies… and goes back to the children
      const lift = bump(t, 1.35, 1.95);
      const toward = bump(t, 1.4, 1.9);
      pose(bigLoaf, { x: MINI.x + (-40 + toward * 70) * MS, y: my + (-64 - lift * 40 + toward * 22) * MS, s: MS, r: toward * 10, o: mK > 0.01 ? 1 : 0 });
      // v27 — crumbs fall, the puppies catch them, tails wag
      const crumbsOn = es(t, 2.15, 2.3) * (1 - es(t, 2.95, 3.05));
      crumbs.forEach((cr) => {
        const k = T ? ((T * 0.7 + cr.ph) % 1) : cr.ph;
        pose(cr.el, { x: MINI.x + (cr.dx * 0.6 + cr.dx * 0.1 * k) * MS, y: my + (-58 + k * k * 36) * MS, s: MS, o: crumbsOn * (1 - k * 0.5) });
      });
      pups.forEach((p, i) => {
        const happy = es(t, 2.2, 2.4);
        const look = es(t, 1.45, 1.6) * (1 - es(t, 1.9, 2.05)) + happy;
        pose(p.el, { x: MINI.x + p.x * MS, y: my, s: MS, sx: p.flip ? -1 : 1, o: mK > 0.01 ? 1 : 0 });
        pose(p.tail, { x: -24 * 1.1, y: -26 * 1.1, r: (T ? Math.sin(T * (8 + i)) : 0.5) * (6 + happy * 22) });
        pose(p.head, { x: 24 * 1.1, y: -32 * 1.1 - (T ? Math.max(0, Math.sin(T * 4 + i)) : 0) * 4 * happy, r: -look * 30 + (T ? Math.sin(T * 5 + i) : 0) * 5 * happy });
        const hk2 = es(t, 2.4 + i * 0.12, 2.6 + i * 0.12, ease.back) * (1 - es(t, 2.95, 3.05));
        pose(hearts[i], { x: MINI.x + (p.x + (p.flip ? -20 : 20)) * MS, y: my + (-56 - hk2 * 10) * MS, s: hk2 * MS, o: hk2 > 0.02 ? 1 : 0 });
      });

      /* v28a — great is your faith: the girl in her heart turns bright */
      const pK = es(t, 3.1, 3.3, ease.back);
      pose(plea, { x: whx - 10, y: why - 34, s: pK, o: pK > 0.02 ? 1 : 0 });
      const heal = es(t, 3.35, 3.6);
      fade(pleaDark, 1 - heal); fade(pleaLight, heal);
      glints.forEach((g) => {
        const k = seg(t, 3.4, 3.9);
        pose(g.el, { x: whx + 14 + Math.cos(g.a) * 40 * (0.5 + k), y: why - 100 + Math.sin(g.a) * 30 * (0.5 + k), s: bump(t, 3.4, 3.98), o: bump(t, 3.4, 3.98) });
      });

      S.cam.z = 1.04 + es(t, 0, 0.6) * 0.03 - es(t, 0.95, 1.3) * 0.02 + es(t, 3.0, 3.4) * 0.05;
      S.cam.y = -es(t, 0.95, 1.3) * 30 + es(t, 3.0, 3.4) * 40;
      S.cam.x = -es(t, 3.0, 3.4) * 20;
    };
  },
};
