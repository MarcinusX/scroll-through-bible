// Mt 6,11–12 — the Our Father in an ordinary house, cut open. Dawn: the family sits at an empty low table; the day's
// disc hangs in the window ("today"). "Give us today our daily bread": they lift their hands, a shaft of morning light
// falls on the table and a warm loaf comes down into it on a string. "Forgive us our debts": on the wall hangs the
// household's slate of debts — the dark marks peel off one by one and rise into the light, and the slate is clean.
// "As we also forgive our debtors": the door opens, a neighbour comes in with bowed head and holds out his note of
// debt; the man takes it, tears it in two, and lifts him up by the shoulder.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { sun, band } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { QUIET, WIFE, CHILD, manOf, loaf, scrap, slate, noteHalf, dayDisc, secretShaft, handAt, headAt, sparkle, kf, moving, tr, PI } from './lib.js';

const GY = 668;                   // the floor line where they sit
const TX = 760;                   // the table
const WX0 = 330, WX1 = 1270, WT = 200;  // the room
const SLX = 530, SLY = 330;       // the slate of debts
const DX = 1130;                  // the door (centre)

/** a low table (origin: floor centre) */
function table(c, w = 220) {
  return sheet().p(c.cut([[-w / 2, -44], [w / 2, -44], [w / 2 - 4, -32], [-w / 2 + 4, -32]], 0.4, 6), C.wood)
    .p(c.cut(c.rect(-w / 2 + 12, -34, 12, 34), 0.3, 4) + c.cut(c.rect(w / 2 - 24, -34, 12, 34), 0.3, 4), C.wood2)
    .p(c.cut(c.ell(60, -48, 20, 5, 12), 0.3, 4), C.pot).p(c.cut([[-80, -44], [-70, -64], [-58, -64], [-50, -44]], 0.3, 4), mix(C.pot, C.clay, 0.3)).out();
}
export default {
  id: 'mt6-home',
  beats: [
    { v: 11 },
    { v: 12, text: 'i przebacz nam nasze winy,' },
    { v: 12, cont: true, text: 'jak i my przebaczamy tym, którzy przeciw nam zawinili;' },
  ],
  cam: { x: [-30, 60], y: [-60, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, ['#b8b4cf', '#f1c9ad', '#f8dfbd']);
    const sunL = S.layer({ par: 0.05, sh: 2 });
    const sunEl = sunL.add(`<g>${sun(c, 38)}</g>`);
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.duskViolet, 0.15) }).markup);

    /* the room: back wall with a window cut through it, the door, the floor */
    const room = S.layer({ par: 0.4, sh: 4 });
    const wall = mix(C.plaster, C.dawn, 0.25);
    const rs = sheet();
    const win = c.rect(740, 236, 120, 96);
    rs.p(c.cut([[WX0, WT], [WX1, WT], [WX1, GY], [WX0, GY]], 0.5, 10) + c.hole(win, 0.3, 6), wall);
    rs.p(c.cut([[-1100, -1400], [2700, -1400], [2700, WT], [-1100, WT]], 0.5, 12), mix(C.roof, C.wood2, 0.3));
    rs.p(c.cut([[-1100, WT], [WX0, WT], [WX0, GY], [-1100, GY]], 0.5, 12) + c.cut([[WX1, WT], [2700, WT], [2700, GY], [WX1, GY]], 0.5, 12), mix(C.plaster2, C.dawn, 0.2));
    let beams = '';
    for (let x = WX0 + 10; x < WX1; x += 56) beams += c.cut(c.rect(x, WT, 14, 14), 0.2, 4);
    rs.p(beams, C.wood2);
    rs.p(c.cut([[736, 232], [864, 232], [864, 238], [736, 238]], 0.2, 5) + c.cut([[734, 330], [866, 330], [870, 340], [730, 340]], 0.3, 5), C.wood2);
    rs.x(c.ribbon([[800, 236], [800, 332]], 4), C.wood2);
    // the doorway (dark until the door opens)
    rs.p(c.cut([[DX - 50, GY], [DX - 50, GY - 170], ...c.arc(DX, GY - 170, 50, 34, PI, 2 * PI, 10), [DX + 50, GY]], 0.4, 6), mix(C.cream, C.sand, 0.4));
    room.add(rs.out());
    const door = room.add(`<g>${sheet().p(c.cut([[0, 0], [0, -170], ...c.arc(50, -170, 50, 34, PI, 1.5 * PI, 5), [50, -204], ...c.arc(50, -170, 50, 34, 1.5 * PI, 2 * PI, 5), [100, 0]], 0.4, 6), C.wood).x(c.ribbon([[30, -190], [30, -4]], 1.6) + c.ribbon([[70, -190], [70, -4]], 1.6), shade(C.wood, -0.25), 'opacity=".6"').out()}</g>`);
    room.add(sheet().p(c.cut([[-1100, GY - 6], [2700, GY - 6], [2700, 1900], [-1100, 1900]], 0.5, 20), mix(C.wood3, C.sand, 0.45)).out());
    // a shelf, a lamp niche
    room.add(sheet().p(c.cut(c.rect(930, 360, 110, 8), 0.3, 5), C.wood).p(c.cut([[950, 360], [946, 340], [958, 330], [970, 340], [966, 360]], 0.3, 4) + c.cut([[990, 360], [984, 346], [1000, 336], [1014, 346], [1008, 360]], 0.3, 4), C.pot).out());

    /* the day's disc in the window */
    const dayL = S.layer({ par: 0.4, sh: 5 });
    const day = hanging(dayL, dayDisc(c, tr('dziś', 'today'), 26), { x: 0, y: 0, len: 900 });
    const dayLit = day.querySelector('.lit'), dayOff = day.querySelector('.off');

    /* the slate of debts and its marks */
    const slateEl = dayL.add(`<g>${slate(c)}</g>`);
    const MARKS = Array.from({ length: 7 }, (_, i) => ({ i, x: SLX - 50 + (i % 4) * 32 + c.rr(-4, 4), y: SLY - 22 + Math.floor(i / 4) * 34 + c.rr(-4, 4), el: dayL.add(`<g>${scrap(c, 11)}</g>`), sp: dayL.add(`<g>${sparkle(c, 9)}</g>`) }));
    const slateGlow = dayL.add(`<circle r="110" fill="url(#halo-glow)"/>`);

    /* the morning light on the table, the loaf */
    const lightL = S.layer({ par: 0.4, sh: 0, flat: true });
    const shaft = lightL.add(`<g>${secretShaft(c, { w0: 110, w1: 240, h: 420 })}</g>`);
    const act = S.layer({ par: 0.4, sh: 5 });
    act.add(`<g transform="translate(${TX} ${GY + 6})">${table(c)}</g>`);
    const bread = hanging(act, `<circle r="46" fill="url(#warm-glow)"/>${loaf(c, 30)}`, { x: 0, y: 0, len: 1200 });
    const steam = [0, 1, 2].map((i) => act.add(`<path d="${c.ribbon(c.cbez([0, 0], [8, -12], [-8, -24], [0, -36], 10), (u) => 3 - u * 2)}" fill="#fff" opacity=".7"/>`));

    /* the family */
    const wife = S.puppet(act.add(person(c, { ...WIFE, pose: 'sit' })));
    const kid = S.puppet(act.add(person(c, { ...CHILD, pose: 'sit' })));
    const manS = S.puppet(act.add(person(c, { ...QUIET, pose: 'sit' })));
    const manW = S.puppet(act.add(person(c, QUIET)));
    const nb = S.puppet(act.add(person(c, manOf(c, { robe: C.clayMantle, mantle: null, hairStyle: 'short', beard: 'short', holdF: `<g data-k="h-note" transform="translate(4 8)">${noteHalf(c, -1)}${noteHalf(c, 1)}</g>` }))));
    const note = S.$('h-note');
    const halfL = act.add(`<g>${noteHalf(c, -1)}</g>`), halfR = act.add(`<g>${noteHalf(c, 1)}</g>`);

    const fg = S.layer({ par: 0.8, sh: 6 });
    fg.add(sheet().p(c.cut([[-1100, 900], [WX0 - 10, 900], [WX0 - 30, GY - 200], [WX0 - 120, WT - 80], [-1100, WT - 80]], 0.5, 12) + c.cut([[WX1 + 10, 900], [2700, 900], [2700, WT - 80], [WX1 + 120, WT - 80], [WX1 + 30, GY - 200]], 0.5, 12), mix(C.plaster2, C.clay, 0.2)).out());

    return (t, time) => {
      const T = time;
      /* v11 — dawn: the sun rises in the window, the day's disc is lit */
      const rise = es(t, 0.0, 0.5);
      pose(sunEl, { x: 812, y: lerp(380, 290, rise), r: T ? Math.sin(T * 0.4) * 2 : 0 });
      const dk = es(t, 0.05, 0.3, ease.out);
      pose(day, { x: 680, y: lerp(-400, 270, dk), r: T ? Math.sin(T * 0.8) * 1.5 : 0, o: dk > 0.01 ? 1 : 0 });
      const lit = es(t, 0.3, 0.5);
      fade(dayLit, lit); fade(dayOff, 1 - lit);
      const ask = es(t, 0.1, 0.35) * (1 - es(t, 0.95, 1.15));
      const sk = es(t, 0.3, 0.55) * (1 - es(t, 1.9, 2.2) * 0.5);
      pose(shaft, { x: TX, y: GY - 36, sx: 0.4 + sk * 0.6, o: sk });
      const bk = es(t, 0.4, 0.72, ease.out);
      pose(bread, { x: TX - 6, y: lerp(-420, GY - 58, bk), r: T ? Math.sin(T * 0.9) * 2 * (1 - bk) : 0, o: bk > 0.01 ? 1 : 0 });
      steam.forEach((st, i) => {
        const k = T ? (T * 0.5 + i / 3) % 1 : i / 3;
        pose(st, { x: TX - 20 + i * 18 + Math.sin(k * 5) * 4, y: GY - 80 - k * 40, s: 0.6 + k * 0.6, o: es(t, 0.7, 0.85) * (1 - k) });
      });

      /* the family: hands lifted for the bread; then to the slate */
      const toSlate = es(t, 1.02, 1.3) * (1 - es(t, 2.0, 2.2));
      wife.set({ x: 580, y: GY + 10, s: 1.02, armF: 30 + ask * 70, armB: 20 + ask * 70, head: -ask * 10 - toSlate * 8, blink: blinkAt(T, 3) });
      kid.set({ x: 660, y: GY + 16, s: 0.66, armF: 30 + ask * 90, armB: 20 + ask * 60 + bump(t, 0.72, 1.0) * 40, head: -ask * 10, blink: blinkAt(T, 5) });
      const up = es(t, 2.08, 2.18);
      manS.set({ x: 940, y: GY + 10, s: 1.04, flip: true, armF: 30 + ask * 70 + toSlate * 30, armB: 20 + ask * 80 + toSlate * 40, head: -ask * 10 - toSlate * 14, blink: blinkAt(T, 1), o: 1 - up });

      /* v12a — the slate: the dark marks peel off and rise into the light */
      pose(slateEl, { x: SLX, y: SLY });
      MARKS.forEach((m) => {
        const k = es(t, 1.2 + m.i * 0.06, 1.55 + m.i * 0.06);
        pose(m.el, { x: m.x + Math.sin(k * 5 + m.i) * 14 * k, y: m.y - k * 170, r: k * 90 * (m.i % 2 ? 1 : -1), s: 1 - k * 0.6, o: 1 - es(t, 1.4 + m.i * 0.06, 1.55 + m.i * 0.06) });
        const f = bump(t, 1.42 + m.i * 0.06, 1.72 + m.i * 0.06);
        pose(m.sp, { x: m.x, y: m.y - 150, s: f, r: T * 60, o: f });
      });
      const clean = es(t, 1.55, 1.9);
      pose(slateGlow, { x: SLX, y: SLY, s: 0.6 + clean * 0.4, o: clean * 0.8 * (1 - es(t, 2.3, 2.6) * 0.5) });

      /* v12b — the neighbour at the door; the note is torn in two */
      const open = es(t, 2.02, 2.15);
      pose(door, { x: DX - 50, y: GY, sx: 1 - open * 0.88 });
      const NK = [[2.06, DX + 10], [2.3, 1060]];
      const nx = kf(t, NK);
      const hold = es(t, 2.28, 2.4);
      const tear = es(t, 2.5, 2.58);
      const lifted = es(t, 2.62, 2.8);
      nb.set({ x: nx, y: GY + 2, s: 1.02, flip: true, walk: moving(t, NK) ? nx * 0.06 : undefined, armF: 14 + hold * 60 * (1 - tear), armB: 8, head: 14 * (1 - lifted) - lifted * 4, lean: 6 * (1 - lifted), blink: blinkAt(T, 7), o: seg(t, 2.04, 2.08) });
      fade(note, tear > 0 ? 0 : 1);
      manW.set({ x: 930, y: GY + 2, s: 1.04, flip: false, armF: 16 + hold * 50 + bump(t, 2.44, 2.62) * 20 + lifted * 40, armB: 10 + hold * 50 * (1 - lifted), head: 6 * (1 - lifted), blink: blinkAt(T, 1), o: up });
      const [hx, hy] = handAt(930, GY + 2, 1.04, false, 70);
      const fall = es(t, 2.58, 2.95);
      pose(halfL, { x: hx - 8 - fall * 30, y: hy + fall * 90, r: -fall * 140, o: tear > 0 && fall < 1 ? 1 : 0 });
      pose(halfR, { x: hx + 8 + fall * 26, y: hy + fall * 96, r: fall * 160, o: tear > 0 && fall < 1 ? 1 : 0 });

      S.cam.z = 1.04 + es(t, 0.0, 0.8) * 0.04 - es(t, 0.95, 1.3) * 0.02 + es(t, 1.95, 2.3) * 0.04;
      S.cam.x = -es(t, 0.95, 1.3) * 20 + es(t, 1.95, 2.3) * 60;
      S.cam.y = 10 - es(t, 0.95, 1.3) * 30 + es(t, 1.95, 2.3) * 40;
    };
  },
};
