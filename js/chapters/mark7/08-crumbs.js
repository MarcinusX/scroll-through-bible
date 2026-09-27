// Mk 7,27–29 — inside the house at Tyre. A little stage comes down on strings: children at their
// table with bread, two puppies underneath. "Let the children be filled first" — the loaf stays with
// the children. "Yet even the puppies under the table eat the children's crumbs" — crumbs fall and the
// puppies catch them, tails wagging. "For this saying, go" — light goes out of the window towards
// her home, and the dark cloud over her daughter melts away.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { bed } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { hand, headAt, woman, LOOK, PURPLE, MUREX, SEA, DARK, puppy, loaf, bowl, cup, thought, heart, spark, hang2, townsfolk } from './lib.js';

const PI = Math.PI;
const FLOOR = 690;
const JX = 890;                         // Jesus on his stool
const WX = 650;                         // the woman, kneeling
const MINI = { x: 690, y: 400 };        // the little hanging stage (its floor)
const MS = 1.4;                         // …and its scale

export default {
  id: 'm7-crumbs',
  beats: [
    { v: 27 },
    { v: 28 },
    { v: 29 },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const sk = sky(S, ['#bdb6d8', '#ecd2c4', '#f5e0cc']);
    // the sea through the window
    const out = S.layer({ par: 0.1, sh: 1 });
    out.add(sheet().p(c.ridge(c.wave(520, [3, 1], [200, 70]), -900, 2500, 1700, 10, 0.6), SEA).out());
    out.add(`<g transform="translate(360 520) scale(.8)">${sun(c, 40, { disc: C.apricot, inner: '#f4cfa4', rays: C.dusk })}</g>`);

    /* ---------- the room ---------- */
    const roomL = S.layer({ par: 0.3, sh: 3 });
    const wcol = mix(C.plaster2, C.sand2, 0.3);
    const win = [[300, 600], [300, 470], ...c.arc(360, 470, 60, 56, PI, 2 * PI, 12), [420, 600]];
    const w = sheet();
    w.p(c.cut([[-900, -1200], [2500, -1200], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + c.hole(win, 0.5, 6), wcol);
    let blotch = '';
    for (let i = 0; i < 14; i++) blotch += c.cut(c.blob(c.rr(-300, 1900), c.rr(250, FLOOR - 70), c.rr(24, 64), c.rr(10, 24), 10, 0.2), 0.8, 6);
    w.x(blotch, shade(wcol, -0.06), 'opacity=".55"');
    w.p(c.ribbon([[294, 602], [426, 602]], 9) + c.ribbon([[360, 416], [360, 600]], 5), C.wood2);
    const door = [[150, FLOOR + 4], [150, 500], ...c.arc(205, 500, 55, 50, PI, 2 * PI, 12), [260, FLOOR + 4]];
    w.p(c.cut(door, 0.5, 6), mix(C.soilDark, PURPLE, 0.3));
    w.p(c.ribbon([[146, FLOOR + 4], [146, 498]], 9) + c.ribbon([[264, FLOOR + 4], [264, 498]], 9) + c.ribbon(c.arc(205, 500, 60, 55, PI, 2 * PI, 12), 9), C.wood2);
    // a lamp niche and a potted palm
    w.p(c.cut([[600, 500], [600, 460], ...c.arc(630, 460, 30, 26, PI, 2 * PI, 8), [660, 500]], 0.4, 5), shade(wcol, -0.16));
    w.p(c.cut([[612, 500], [616, 490], [636, 490], [646, 495], [642, 500]], 0.2, 3), C.pot);
    w.x(`M644 490C640 485 640 480 644 472C648 480 648 485 644 490Z`, C.lampFlame);
    // purple textile with a border, a shelf with a jug
    w.p(c.cut([[960, 300], [1180, 300], [1170, 560], [970, 560]], 0.8, 10), PURPLE);
    let st = '';
    for (let y = 330; y < 560; y += 44) for (let x = 990; x < 1160; x += 40) st += c.cut(c.star(x + (y % 88 ? 20 : 0), y, 7, 3, 4, 0), 0.2, 3);
    w.x(st, C.cream, 'opacity=".7"');
    w.p(c.ribbon([[950, 298], [1190, 298]], 6), C.wood2);
    w.p(c.cut([[-900, FLOOR - 46], [2500, FLOOR - 46], [2500, FLOOR + 6], [-900, FLOOR + 6]], 0.8, 14), shade(wcol, -0.05));
    roomL.add(w.out());
    roomL.add(sheet().p(c.cut([[-900, FLOOR], [2500, FLOOR], [2500, 1700], [-900, 1700]], 1, 30), mix(C.clay, C.sand2, 0.55)).out());
    roomL.add(sheet().p(c.cut([[500, FLOOR + 30], [1100, FLOOR + 30], [1140, FLOOR + 120], [460, FLOOR + 120]], 0.8, 12), MUREX).x((() => { let d = ''; for (let x = 520; x < 1100; x += 40) d += c.cut(c.star(x, FLOOR + 75, 6, 2.6, 4, 0), 0.2, 3); return d; })(), C.cream, 'opacity=".7"').out());
    const beam = roomL.add(`<path d="M300 480L420 480L200 ${FLOOR + 40}L-120 ${FLOOR + 40}Z" fill="#fff1c4" opacity="0"/>`);

    /* ---------- people ---------- */
    const ppl = S.layer({ par: 0.55, sh: 5 });
    const peter = S.puppet(ppl.add(person(c, CAST.peter)));
    const john = S.puppet(ppl.add(person(c, CAST.john)));
    ppl.add(sheet().p(c.cut(c.rect(JX - 34, FLOOR - 34, 68, 8), 0.3, 5), C.wood).p(c.cut(c.rect(JX - 24, FLOOR - 26, 6, 26), 0.2, 3) + c.cut(c.rect(JX + 18, FLOOR - 26, 6, 26), 0.2, 3), C.wood2).out());
    const jesus = S.puppet(ppl.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const wKneel = S.puppet(ppl.add(woman(c, { pose: 'kneel' })));
    const wStand = S.puppet(ppl.add(woman(c)));

    /* ---------- the little stage on strings: children at table, puppies beneath ---------- */
    const mini = S.layer({ par: 0.55, sh: 6 });
    const board = sheet();
    board.p(c.cut(c.rect(-190, 0, 380, 14), 0.5, 10), C.wood);
    board.x(c.ribbon([[-186, 7], [186, 7]], 1.4), shade(C.wood, -0.25), 'opacity=".6"');
    // a painted backdrop: a pale arch
    board.p(c.cut([[-170, 0], [-170, -150], ...c.arc(0, -150, 170, 60, PI, 2 * PI, 16), [170, 0]], 0.6, 8), mix(C.cream, C.blushVeil, 0.4));
    const tbl = sheet();
    tbl.p(c.cut(c.rect(-110, -64, 220, 9), 0.4, 8), C.wood3);
    tbl.p(c.cut(c.rect(-100, -55, 7, 55), 0.3, 4) + c.cut(c.rect(93, -55, 7, 55), 0.3, 4), C.wood2);
    tbl.p(c.cut([[-106, -60], [106, -60], [102, -44], [-102, -44]], 0.4, 6), C.cream);
    const kids = [
      { x: -130, o: { ...LOOK.girl, robe: C.skyVeil }, flip: false }, { x: 130, o: townsfolk(c, { man: true, beard: 'none', hairStyle: 'short', robe: C.sageRobe, mantle: null }), flip: true },
    ];
    const miniEl = mini.add(`<g>${hang2(`<g transform="scale(${MS})">${board.out()}<g data-g="kids"></g>${tbl.out()}<g transform="translate(-40 -64)">${loaf(c, 14)}</g><g transform="translate(40 -64)">${bowl(c, { w: 30, food: 'bread' })}</g></g>`, 170 * MS, 400)}</g>`);
    // kids are separate puppets placed on the board each frame
    const kidP = kids.map((k) => ({ ...k, p: S.puppet(mini.add(person(c, { ...k.o, pose: 'sit' }))), seed: c.rr(0, 9) }));
    const pups = [{ x: -44, col: C.ochre, patch: C.cream }, { x: 44, col: C.wood3, patch: C.linen, flip: true }].map((p, i) => ({ ...p, i, el: mini.add(`<g>${puppy(c, { col: p.col, patch: p.patch, sc: 1.1 })}</g>`) }));
    pups.forEach((p) => { p.tail = p.el.querySelector('.tail'); p.head = p.el.querySelector('.head'); });
    const bigLoaf = mini.add(`<g>${loaf(c, 16)}</g>`);
    const crumbs = Array.from({ length: 10 }, (_, i) => ({ i, el: mini.add(`<path d="${c.cut(c.blob(0, 0, 5, 3.6, 7, 0.3), 0.3, 2)}" fill="${C.wheat2}"/>`), dx: (i % 2 ? 1 : -1) * c.rr(20, 90), ph: c.rr(0, 1) }));
    const hearts = pups.map(() => mini.add(`<g>${heart(c, 7)}</g>`));

    /* ---------- her daughter, far away, in a thought ---------- */
    const fx = S.layer({ par: 0.55, sh: 6 });
    const plea = fx.add(`<g>${thought(c, `<g transform="translate(-26 12) scale(.36)">${bed(c, 150)}</g><g transform="translate(-14 -8) rotate(-90) scale(.22)">${person(c, { ...LOOK.girl, eyes: 'closed' })}</g><g data-g="dark" transform="translate(-20 -32) scale(.5)">${spiritCloudS(c)}</g><g data-g="light" opacity="0" transform="translate(-20 -26)"><circle r="30" fill="url(#halo-glow)"/></g>`, { w: 110, h: 84 })}</g>`);
    const pleaDark = plea.querySelector('[data-g="dark"]'), pleaLight = plea.querySelector('[data-g="light"]');
    const glints = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${spark(c, 8)}</g>`), a: (i / 6) * PI * 2 }));

    return (t, time) => {
      const T = time;

      /* the little stage comes down */
      const mK = es(t, -0.2, 0.3, ease.out) * (1 - es(t, 2.55, 2.95, ease.in));
      const my = MINI.y - (1 - mK) * 1150 + Math.sin(T * 0.8) * 2;
      pose(miniEl, { x: MINI.x, y: my });
      const eat = (i) => Math.max(0, Math.sin(T * 3 + i * 1.7));
      kidP.forEach((k, i) => {
        k.p.set({ x: MINI.x + k.x * MS, y: my, s: 0.5 * MS, flip: k.flip, armF: 40 + eat(i) * 60, armB: 10, head: 4 - eat(i) * 4, blink: blinkAt(T, k.seed), o: mK > 0.01 ? 1 : 0 });
      });
      // v27 — the children's loaf lifts, drifts toward the puppies… and goes back to the children
      const lift = bump(t, 0.4, 0.95);
      const toward = bump(t, 0.45, 0.9);
      pose(bigLoaf, { x: MINI.x + (-40 + toward * 70) * MS + Math.sin(t * 40) * 3 * (t > 0.7 && t < 0.8 ? 1 : 0), y: my + (-64 - lift * 40 + toward * 22) * MS, s: MS, o: t > 0.4 && t < 0.95 ? 1 : 0, r: toward * 10 });
      // v28 — crumbs fall, the puppies catch them, tails wag
      const crumbsOn = es(t, 1.15, 1.3) * (1 - es(t, 2.5, 2.6));
      crumbs.forEach((cr) => {
        const k = ((T * 0.7 + cr.ph) % 1);
        pose(cr.el, { x: MINI.x + (cr.dx * 0.6 + cr.dx * 0.1 * k) * MS, y: my + (-58 + k * k * 36) * MS, s: MS, o: crumbsOn * (1 - k * 0.5) });
      });
      pups.forEach((p, i) => {
        const happy = es(t, 1.2, 1.4);
        const look = es(t, 0.45, 0.6) * (1 - es(t, 0.95, 1.1)) + happy;
        pose(p.el, { x: MINI.x + p.x * MS, y: my, s: MS, sx: p.flip ? -1 : 1, o: mK > 0.01 ? 1 : 0 });
        pose(p.tail, { x: -24 * 1.1, y: -26 * 1.1, r: Math.sin(T * (8 + i)) * (6 + happy * 22) });
        pose(p.head, { x: 24 * 1.1, y: -32 * 1.1 - Math.max(0, Math.sin(T * 4 + i)) * 4 * happy, r: -look * 30 + Math.sin(T * 5 + i) * 5 * happy });
        const hk = es(t, 1.6 + i * 0.15, 1.8 + i * 0.15, ease.back) * (1 - es(t, 2.5, 2.6));
        pose(hearts[i], { x: MINI.x + (p.x + (p.flip ? -20 : 20)) * MS, y: my + (-56 - hk * 10) * MS, s: hk * MS, o: hk > 0.02 ? 1 : 0 });
      });

      /* the people */
      const speak = es(t, 0.05, 0.3) * (1 - es(t, 1.0, 1.1));
      const her = es(t, 1.05, 1.3) * (1 - es(t, 2.2, 2.4));
      const bless = es(t, 2.05, 2.3);
      jesus.set({
        x: JX, y: FLOOR - 30, s: 1.1, flip: true,
        armF: 20 + speak * (40 + Math.sin(T * 1.5) * 8) + bless * 70, armB: 10 + speak * 20 + bless * 20,
        head: 6 + es(t, 1.2, 1.5) * 6 * (1 - bless) - bless * 4, blink: blinkAt(T, 1),
      });
      const rise = es(t, 2.5, 2.58);
      wKneel.set({ x: WX, y: FLOOR + 2, s: 1.06, o: 1 - rise, armF: 60 + her * 70, armB: 30 + her * 20, head: -8 - her * 10 + es(t, 2.1, 2.3) * 6, lean: 10 - her * 6, blink: blinkAt(T, 3) });
      const wx = lerp(WX, 205, es(t, 2.6, 3.05, ease.in));
      wStand.set({ x: wx, y: FLOOR, s: 1.06, flip: t > 2.62, o: rise * (1 - es(t, 2.95, 3.05)), walk: t > 2.6 ? wx * 0.06 : undefined, head: t < 2.62 ? -6 : 0, blink: blinkAt(T, 3) });
      peter.set({ x: 1040, y: FLOOR - 6, s: 1.0, flip: true, head: -bump(t, 1.2, 2.2) * 6, armF: bump(t, 2.1, 2.8) * 40, blink: blinkAt(T, 4) });
      john.set({ x: 1104, y: FLOOR - 10, s: 0.98, flip: true, head: bump(t, 1.2, 2.2) * 8, blink: blinkAt(T, 7) });

      /* v29 — the word: light goes out towards home; the dark cloud melts */
      const pK = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.5, 2.62));
      const [hx, hy] = headAt(WX, FLOOR + 2, 1.06, false, 46);
      pose(plea, { x: hx - 20, y: hy - 30, s: pK, o: pK > 0.02 ? 1 : 0 });
      const heal = es(t, 2.2, 2.45);
      fade(pleaDark, 1 - heal); fade(pleaLight, heal);
      glints.forEach((g) => {
        const k = seg(t, 2.25, 2.6);
        pose(g.el, { x: hx - 40 + Math.cos(g.a) * 30 * (0.5 + k), y: hy - 110 + Math.sin(g.a) * 22 * (0.5 + k), s: bump(t, 2.25, 2.7), o: bump(t, 2.25, 2.7) });
      });
      fade(beam, es(t, 2.1, 2.4) * 0.5);

      S.cam.z = 1.04 + es(t, 0, 1) * 0.03 + es(t, 2.0, 2.4) * 0.03;
      S.cam.y = -es(t, -0.2, 0.4) * 20 + es(t, 2.0, 2.5) * 30;
      S.cam.x = -es(t, 2.4, 3.0) * 40;
    };
  },
};

function spiritCloudS(c) {
  const s = sheet();
  s.p(c.cut([...c.arc(-18, 0, 20, 16, PI, 2 * PI, 8), ...c.arc(6, -8, 24, 22, PI, 2 * PI, 9), ...c.arc(30, 2, 16, 14, PI * 1.1, 2 * PI, 6), [44, 12], [-36, 12]], 0.8, 5), mix(DARK, C.lavender, 0.25));
  return s.out();
}
