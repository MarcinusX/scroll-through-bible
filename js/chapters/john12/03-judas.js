// J 12,4–8 — the fragrance still hangs in the room. Judas rises at the end of the table; his tag is cut from dark
// paper and his shadow grows long on the wall. "Three hundred denarii — for the poor!" — a stack of coins over the
// jar, a little plate of the poor. But he turns from the plate to the money-bag at his belt: a few coins slip out
// into his hand and behind his back. Jesus: "Leave her alone!" — Judas sits down; a gentle plate comes down: linen
// cloths, spices and the jar laid by a tomb in moonlight, "for the day of my burial". The poor you always have: at
// the doorway two beggars, and Martha goes to them with bread — while the six days hang over Him, counted.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  supperRoom, SR, EVE, LAZ, MARY, TW, JUDAS, martha, maryHair, outLegs, cushion, nardJar, nardSprig, platter, jug, loaf, cup, grapes, bowl,
  nameTag, bubble, hanging, swing, kf, vis, hand, sparkle, moneybag, denar, poorOpts, shadowPerson, framed, linenCloths, spiceJar, sixDays, litDays, tr, PI, FONT,
} from './lib.js';

export default {
  id: 'j12-judas',
  beats: [
    { v: 4 },
    { v: 5 },
    { v: 6, text: 'Powiedział zaś to nie dlatego, jakoby dbał o biednych,' },
    { v: 6, cont: true, text: 'ale ponieważ był złodziejem, i mając trzos wykradał to, co składano.' },
    { v: 7, text: 'Na to Jezus powiedział: «Zostaw ją!' },
    { v: 7, cont: true, text: 'Przechowała to, aby [Mnie namaścić] na dzień mojego pogrzebu.' },
    { v: 8 },
  ],
  cam: { x: [-380, 680], y: [-60, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const PT = S.portrait;               // phone: the camera goes to Judas at the far end of the table, then to the door
    const R = supperRoom(S, { skyCols: ['#3f416f', '#6f5f86', '#a98594'] });
    const { FLOOR, SEAT, TOP, JX, MX } = SR;
    // Judas' long shadow on the wall
    const shadowL = S.layer({ par: 0.32, sh: 0, flat: true });
    shadowL.add(`<g transform="translate(${PT ? 1270 : 1340} ${FLOOR}) scale(1.7 1.55) skewX(-12)" opacity=".22">${shadowPerson(c, JUDAS, '#2a1d2c')}</g>`);
    // the poor at the doorway
    const poor = [0, 1].map((i) => S.puppet(R.backL.add(person(c, { ...poorOpts(i), holdF: `<g transform="rotate(70)">${bowl(c, { food: '', color: C.clay })}</g>` }))));
    const mar = S.puppet(R.backL.add(martha(c, { holdF: `<g transform="rotate(80) translate(0 -6)">${platter(c)}</g>` })));
    const guests = [LAZ, CAST.peter, CAST.john, CAST.thomas].map((o, i) => ({ i, x: SR.GUESTS[i], p: S.puppet(R.backL.add(person(c, { ...o, pose: 'sit' }))) }));
    const judSit = S.puppet(R.backL.add(person(c, { ...JUDAS, pose: 'sit' })));
    const judUp = S.puppet(R.backL.add(person(c, JUDAS)));
    const bag = R.backL.add(`<g>${moneybag(c)}</g>`);
    const slips = Array.from({ length: 3 }, () => R.backL.add(`<g>${denar(c, 6)}</g>`));
    ;[[960, cup(c)], [1000, loaf(c, 16)], [1055, grapes(c, 4.4)], [1110, bowl(c, { food: 'fruit', color: C.skyVeil })], [1160, loaf(c, 14)], [1205, cup(c, C.clay)], [905, bowl(c, { food: 'bread', color: C.stone2 })]]
      .forEach(([x, m]) => R.tableL.add(`<g transform="translate(${x} ${TOP - 4})">${m}</g>`));
    R.frontL.add(`<g transform="translate(${JX + 20} ${FLOOR + 2})">${cushion(c, 170)}</g>`);
    R.frontL.add(`<g transform="translate(${JX} ${FLOOR}) scale(-1 1)">${outLegs(c)}</g>`);
    const jesus = S.puppet(R.frontL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const maryH = S.puppet(R.frontL.add(maryHair(c, 'kneel')));
    const hairEl = maryH.el.querySelector('.lhair');
    const jarEl = R.frontL.add(`<g><circle cy="-30" r="40" fill="url(#halo-glow)" opacity=".5"/>${nardJar(c, 56)}</g>`);
    const shelter = R.fx.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    /* devices */
    const tagL = S.layer({ par: 0.3, sh: 4 });
    const tagJ = hanging(tagL, nameTag(c, [tr('Judasz', 'Judas'), tr('Iskariota', 'Iscariot')], { size: 16, dark: true }), { x: 1290, y: 360, len: 600 });
    const fx = R.fx;
    const say = fx.add(`<g>${bubble(c, [tr('Czemu nie sprzedano', 'Why not sold'), tr('za trzysta denarów?', 'for 300 denarii?')], { size: 18, tail: 1 })}</g>`);
    let stack = '';
    for (let i = 0; i < 9; i++) stack += `<g transform="translate(${(i % 3) * 22 - 22} ${-Math.floor(i / 3) * 9 - (i % 2) * 2})">${denar(c, 9)}</g>`;
    const coins = fx.add(`<g><circle r="70" fill="url(#halo-glow)" opacity=".5"/>${stack}<text x="0" y="36" text-anchor="middle" font-family="${FONT}" font-size="22" font-style="italic" fill="${C.cream}">300</text></g>`);
    // a plate of the poor: two figures with bowls
    const pp = sheet().p(c.cut(c.circ(0, 0, 76, 36), 0.5, 5), C.wood3).p(c.cut(c.circ(0, 0, 70, 36), 0.5, 5), C.parchment).out();
    const poorPlate = hanging(tagL, `${pp}<g transform="translate(-22 52) scale(.42)">${person(c, { ...poorOpts(0), holdF: `<g transform="rotate(70)">${bowl(c, { food: '', color: C.clay })}</g>` })}</g><g transform="translate(24 54) scale(.38)">${person(c, { ...poorOpts(1), holdF: `<g transform="rotate(70)">${bowl(c, { food: '', color: C.clay })}</g>` })}</g><text x="0" y="-44" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${C.ink}">${tr('ubodzy', 'the poor')}</text>`, { x: 1090, y: 330, len: 600 });
    const bagTag = fx.add(`<g>${nameTag(c, tr('trzos', 'the money box'), { size: 14, dark: true })}</g>`);
    const leave = fx.add(`<g>${bubble(c, tr('Zostaw ją!', 'Leave her alone!'), { size: 22, tail: -1 })}</g>`);
    // the burial plate: linen, spices, the jar, by a tomb in moonlight
    const inner = `<rect width="330" height="210" fill="${mix(C.night, C.lavender, 0.45)}"/><circle cx="270" cy="50" r="22" fill="${C.moon}"/><circle cx="270" cy="50" r="60" fill="url(#halo-glow)"/>` +
      `<path d="${c.cut([[20, 210], [30, 110], [80, 70], [150, 64], [210, 90], [240, 140], [250, 210]], 1, 8)}" fill="${mix(C.rock, C.lavender, 0.3)}"/><path d="${c.cut([[110, 210], [110, 150], ...c.arc(135, 150, 25, 22, PI, 2 * PI, 8), [160, 210]], 0.4, 5)}" fill="${mix(C.soilRich, C.night, 0.3)}"/>` +
      `<g transform="translate(200 196) scale(1)">${linenCloths(c)}</g><g transform="translate(258 196)">${spiceJar(c, C.cream, C.clay)}</g><g transform="translate(282 196) scale(.7)">${nardJar(c, 56)}</g><g transform="translate(60 204)">${nardSprig(c, 30)}</g><g transform="translate(74 206) scale(.8)">${nardSprig(c, 30)}</g>`;
    const burial = fx.add(`<g>${framed(S, inner, { w: 330, h: 210, rim: C.wood3, k: 'bur' })}<g transform="translate(0 238)">${nameTag(c, tr('na dzień mojego pogrzebu', 'for the day of my burial'), { size: 15 })}</g></g>`);
    const days = hanging(tagL, `<g transform="translate(-230 0)">${sixDays(c, { gap: 64, r: 19 })}</g>`, { x: 800, y: 170, len: 0 });

    return (t, time) => {
      const T = time;
      R.update(t, T, { scent: 0.55 - es(t, 0.2, 1) * 0.2, lit: 1 });
      /* v4 — Judas rises */
      const up = es(t, 0.3, 0.37) * (1 - es(t, 4.3, 4.37));
      shadowL.fade(es(t, 0.35, 0.8) * (1 - es(t, 4.3, 4.6)) + bump(t, 3.1, 3.9) * 0.3);
      judSit.set({ x: SR.JUD, y: SEAT, s: 0.92, flip: true, o: 1 - up, armF: 14, head: -2, blink: blinkAt(T, 7) });
      const point = bump(t, 1.05, 1.95);
      const turn = es(t, 2.1, 2.3) * (1 - es(t, 4.1, 4.3));
      const steal = es(t, 3.1, 3.6);
      judUp.set({ x: 1300, y: SEAT + 30, s: 0.95, flip: turn < 0.5, o: up, armF: 16 + point * 70 + bump(t, 3.2, 3.9) * 30, armB: 10 + steal * 40 * (1 - es(t, 3.9, 4.1)), head: -4 + bump(t, 2.1, 2.9) * 6 + steal * 10, blink: blinkAt(T, 7) });
      const tj = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 1.9, 2.1));
      swing(tagJ, PT ? 1190 : 1240, (PT ? 310 : 360) - (1 - tj) * 600, tj > 0.001 ? T : 0, 1.1, 0.7);
      fade(tagJ, tj > 0.001 ? 1 : 0);
      /* v5 — "300 denarii for the poor?" */
      const sk = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 2.0, 2.15));
      vis(say, { x: PT ? 1170 : 1180, y: PT ? 485 : 480, s: sk * (PT ? 1.3 : 1), o: sk > 0.01 ? 1 : 0 });
      const ck = es(t, 1.35, 1.6, ease.back) * (1 - es(t, 2.8, 3.0));
      vis(coins, { x: PT ? 900 : MX + 10, y: (PT ? 330 : 500) - ck * 20, s: ck * 1.4, o: ck > 0.01 ? 1 : 0 });
      const pk = es(t, 1.45, 1.75, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      swing(poorPlate, PT ? 1128 : 1060, (PT ? 225 : 250) - (1 - pk) * 600 + es(t, 2.25, 2.7) * 0, pk > 0.001 ? T : 0, 1.2 + turn * 4, 0.8, 2);
      fade(poorPlate, pk > 0.001 ? 1 - es(t, 2.2, 2.5) * 0.55 : 0);
      /* v6b — the money-bag: coins slip out into his hand */
      const bx = 1300 + (turn > 0.5 ? 18 : -18), by = SEAT + 30 - 92;
      vis(bag, { x: bx, y: by, r: bump(t, 3.2, 3.7) * 10, s: 0.9, o: up * es(t, 2.9, 3.1) });
      slips.forEach((el, i) => {
        const k = seg(t, 3.25 + i * 0.1, 3.55 + i * 0.1);
        vis(el, { x: bx + k * 24 + i * 3, y: by + 44 + k * 26, r: k * 90, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const tk2 = es(t, 3.15, 3.35, ease.back) * (1 - es(t, 3.95, 4.1));
      vis(bagTag, { x: bx + (turn > 0.5 ? 50 : -50), y: by + 60, s: tk2, o: tk2 > 0.01 ? 1 : 0 });
      /* v7a — "Leave her alone!" */
      const lk = es(t, 4.05, 4.25, ease.back) * (1 - es(t, 4.9, 5.05));
      vis(leave, { x: JX + 60, y: 500, s: lk, o: lk > 0.01 ? 1 : 0 });
      const prot = es(t, 4.05, 4.35) * (1 - es(t, 6.0, 6.3));
      vis(shelter, { x: MX + 20, y: FLOOR - 90, s: 0.8 + prot * 0.4, o: prot * 0.35 });
      jesus.set({ x: JX, y: FLOOR, s: 1.0, flip: true, armF: 20 + prot * 50, armB: 12 + bump(t, 4.05, 4.9) * 60 + bump(t, 6.1, 6.9) * 60, head: 4 - bump(t, 4.05, 4.9) * 12 + bump(t, 5.1, 5.8) * 6, blink: blinkAt(T) });
      maryH.set({ x: MX, y: FLOOR, s: 1, armF: 50, armB: 30, lean: 16 + prot * 6, head: 10 + prot * 6, blink: blinkAt(T, 4) });
      pose(hairEl, { r: -(16 + prot * 6 + 10 + prot * 6) * 0.85 });
      vis(jarEl, { x: MX - 50, y: FLOOR + 4, o: 1 });
      /* v7b — the burial plate */
      const bk = es(t, 5.05, 5.4, ease.out) * (1 - es(t, 5.95, 6.15, ease.in));
      vis(burial, { x: 790, y: 190 - (1 - bk) * 700, r: bk > 0.01 && T ? Math.sin(T * 0.7) * 0.8 : 0, o: bk > 0.001 ? 1 : 0 });
      /* v8 — the poor at the door; the days are counted */
      const pIn = es(t, 6.05, 6.4);
      poor.forEach((p, i) => p.set({ x: lerp(330, 360 + i * 70, pIn), y: FLOOR - 4, s: 0.9, o: pIn > 0.01 ? Math.min(1, pIn * 3) : 0, armF: 60 + i * 6, head: 4, blink: blinkAt(T, i + 11) }));
      const give = es(t, 6.1, 6.6);
      const mx = lerp(872, 520, give);
      mar.set({ x: mx, y: SEAT - 8, s: 0.96, flip: true, walk: give > 0 && give < 1 ? mx * 0.06 : undefined, armF: 70 + bump(t, 6.6, 7) * 10, armB: 16, blink: blinkAt(T, 3) });
      guests.forEach((g) => g.p.set({ x: g.x, y: SEAT, s: 0.92, flip: true, armF: 20, armB: 10, head: -2 + bump(t, 1.1, 1.9) * (g.i === 3 ? 0 : 0) + (turn > 0.5 && g.i === 3 ? 6 : 0), blink: blinkAt(T, g.i + 1) }));
      const dk = es(t, 6.2, 6.5, ease.out);
      swing(days, PT ? 690 : 800, 150 - (1 - dk) * 500, T, 0.6, 0.5);
      fade(days, dk > 0.001 ? 1 : 0);
      litDays(days, (i) => (i === 0 ? 1 : 0));

      S.cam.x = PT ? kf(t, [[0, 500], [0.4, 560], [2.9, 560], [3.2, 680], [3.85, 680], [4.25, 40], [4.8, 0], [5.4, 0], [6.1, -200], [6.5, -380]]) : kf(t, [[0, 120], [1, 140], [1.8, 80], [2.3, 120], [3.2, 150], [4.0, 40], [4.8, 0], [5.4, 0], [6.1, -40], [6.9, -20]]);
      S.cam.y = kf(t, [[0, 0], [1, 10], [3.2, 20], [4.0, 30], [5.1, -30], [6.1, 0]]);
      S.cam.z = PT ? kf(t, [[0, 1], [2.9, 1], [3.2, 1.1], [4.0, 1.1], [5.1, 1.02], [6.1, 1.04]]) : kf(t, [[0, 1.08], [1, 1.12], [1.8, 1.02], [3.2, 1.16], [4.0, 1.12], [5.1, 1.02], [6.1, 1.04]]);
    };
  },
};
