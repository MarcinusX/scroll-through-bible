// Łk 11,45–48 — at the table the teacher of the Law at the far end gets up: "Teacher, by saying this you insult us too!"
// "Woe to you lawyers also!": a fourth dark tag drops. "For you load people with burdens hard to bear": a panel — in a
// street, porters, a mother and an old man bend lower and lower as great roped bundles stuffed with rule-scrolls come
// down on their shoulders — "and you yourselves do not touch the burdens with one of your fingers": a big finger
// comes down towards the heaviest bundle and stops just short of it, and draws back. "Woe to you, for you build the
// tombs of the prophets, and your fathers killed them": a panel of the valley of the tombs — the lawyers raise a fine
// monument, course by course; behind it, in grey shadow-play, the fathers of old with stones in their hands stand over
// a prophet kneeling (restrained: shadows only). "So you are witnesses and approve the deeds of your fathers": the
// cap is set on the monument and hung with a garland — and over it the shadow of a father and the builder clasp hands.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { dinnerSet, SH, LAWYER, woeTag, panel, panelSky, panelGround, loadBundle, monument, garland, pointHand, shadowPerson, figure, say, headAt, kf, moving, tr, PI } from './lib.js';

const { FLOOR, SEAT } = SH;
const PX = 900, PY = 300, PW = 420, PH_ = 240;
const LX = SH.GUESTS[2];

export default {
  id: 'lk11-lawyers',
  beats: [
    { v: 45 },
    { v: 46, text: 'On odparł: «I wam, uczonym w Prawie, biada!' },
    { v: 46, cont: true, text: 'Bo wkładacie na ludzi ciężary nie do uniesienia, a sami jednym palcem ciężarów tych nie dotykacie.' },
    { v: 47 },
    { v: 48 },
  ],
  cam: { x: [0, 220], y: [60, 160], z: [0.84, 1.2] },
  build(S) {
    const c = S.c;
    const D = dinnerSet(S, S.portrait ? { ceilTop: 0 } : {});   // phone: the ceiling is an eave band, not a third of the screen of planks
    const R = D.R;
    const lawyerUp = S.puppet(R.backL.add(person(c, LAWYER)));
    const insult = R.fx.add(`<g opacity="0">${say(c, [tr('Nauczycielu, i nam', 'Teacher, you insult'), tr('ubliżasz!', 'us too!')], { size: 18, side: -1 })}</g>`);
    const PL = S.layer({ par: 0.3, sh: 6, rise: 0 });
    const B = S.layer({ par: 0.3, sh: 5, rise: 0 });
    const tags = ['IV', 'V'].map((n) => hanging(PL, woeTag(c, n), { x: 0, y: -1500, len: 900 }));

    /* 1 — the burdens */
    const street = panelSky(S, PW, PH_, ['#d8e0d6', '#f4e4c4']) + sheet().p(c.cut([[-PW / 2 - 4, -60], [-60, -60], [-60, 60], [-PW / 2 - 4, 60]], 0.4, 6) + c.cut([[60, -80], [PW / 2 + 4, -80], [PW / 2 + 4, 60], [60, 60]], 0.4, 6), mix(C.plaster, C.sand, 0.3)).out() + panelGround(c, PW, 60, mix(C.sand, C.stone, 0.45), 2);
    const p1 = PL.add(panel(S, street, { w: PW, h: PH_ }));
    const LOOKS = [{ robe: C.ochreRobe, hairStyle: 'short', beard: 'full', hair: C.hair3, skin: C.skin4, belt: C.rope }, { robe: C.roseRobe, hairStyle: 'veil', veil: C.linen2, beard: 'none', skin: C.skin }, { robe: C.stone2, hairStyle: 'wrap', veil: C.stone, beard: 'wild', beardColor: C.greyHair, hair: C.greyHair, skin: C.skin2 }];
    const porters = LOOKS.map((o, i) => ({ i, p: S.puppet(B.add(person(c, o))), load: B.add(`<g opacity="0">${loadBundle(c, 60 + (i === 0 ? 14 : 0), 44 + (i === 0 ? 10 : 0))}</g>`) }));
    const finger = B.add(`<g opacity="0"><g transform="rotate(90) scale(.7)">${pointHand(c, { cuff: LAWYER.mantle })}</g></g>`);

    /* 2 — the tombs of the prophets, and the fathers who killed them */
    const valley = panelSky(S, PW, PH_, ['#d8c9a8', '#f2e2c2']) + sheet().p(c.cut([[-PW / 2 - 4, 10], [-120, -30], [-20, 0], [80, -40], [PW / 2 + 4, -10], [PW / 2 + 4, PH_ / 2 + 4], [-PW / 2 - 4, PH_ / 2 + 4]], 0.6, 8), mix(C.rock2, C.sand2, 0.4)).out() + panelGround(c, PW, 90, mix(C.sand2, C.dune, 0.4), 2);
    const p2 = PL.add(panel(S, valley, { w: PW, h: PH_ }));
    const shadowCol = mix(C.rock3, C.plumRobe, 0.2);
    const fathers = B.add(`<g opacity="0">${[[-150, 0, 70], [-100, 6, 110]].map(([x, y, a], i) => `<g transform="translate(${x} ${y}) scale(.46)">${shadowPerson(c, { hairStyle: 'wrap', beard: 'full', mantle: C.stone }, shadowCol).replace('<g class="armFr">', `<g class="armFr" transform="rotate(${-a})">`)}</g>`).join('')}<g transform="translate(-40 6) scale(.42)">${shadowPerson(c, { hairStyle: 'wild', beard: 'wild', pose: 'kneel' }, shadowCol).replace('<g class="armFr">', '<g class="armFr" transform="rotate(-120)">')}</g></g>`);
    const M = monument(c, 'pyr', 90, 80);
    const courses = [0, 1, 2, 3].map((i) => B.add(`<g opacity="0">${sheet().p(c.cut(c.rect(-45, -20, 90, 20), 0.4, 5), mix(C.stone, C.sand, 0.3)).out()}</g>`));
    const monBase = B.add(`<g opacity="0">${M.base}</g>`);
    const cap = B.add(`<g opacity="0">${M.cap}</g>`);
    const gar = B.add(`<g opacity="0">${garland(c, 100, 20)}</g>`);
    const builders = [0, 1].map((i) => ({ i, p: S.puppet(B.add(person(c, i ? { ...LAWYER, mantle: C.plumRobe } : LAWYER))) }));
    const clasp = B.add(`<g opacity="0">${shadowPerson(c, { hairStyle: 'wrap', beard: 'full' }, shadowCol).replace('<g class="armFr">', '<g class="armFr" transform="rotate(-80)">')}</g>`);

    return (t, time) => {
      const T = time;
      /* v45 — the lawyer stands up: "you insult us too" */
      const up = seg(t, 0.1, 0.14);
      const speak = es(t, 1.05, 1.2);
      D.seat(t, T, {
        J: { flip: false, armF: 30 + speak * 40, armB: 10 + speak * 50, head: 2 - speak * 4 },
        H: { head: 8, lean: 4 },
        g: (q) => (q.i === 2 ? { o: 1 - up } : { head: -2 + bump(t, 0.2, 0.9) * 6 }),
      });
      const wave = bump(t, 0.2, 0.95);
      lawyerUp.set({ x: LX + 20, y: SEAT + 50, s: 0.92, flip: true, o: up, armF: 30 + wave * 60, armB: 10 + wave * 50, head: -4, blink: blinkAt(T, 6) });
      const ik = es(t, 0.25, 0.38, ease.back) * (1 - es(t, 0.92, 1.0));
      const [lhx, lhy] = headAt(LX + 20, SEAT + 50, 0.92, true);
      pose(insult, { x: lhx - 16, y: lhy - 18, s: ik, o: ik > 0.02 ? 1 : 0 });
      /* the woe tags */
      tags.forEach((tg, i) => {
        const a = [1.02, 3.02][i];
        const k = es(t, a, a + 0.25, ease.out) * (1 - es(t, [2.9, 99][i], [3.1, 100][i]));
        pose(tg, { x: S.portrait ? 900 : 1150, y: lerp(-500, S.portrait ? 40 : 170, k), r: T ? Math.sin(T * 0.9 + i) * 2 : 0, o: k > 0.004 ? 1 : 0 });
      });
      const kin = (a, b) => es(t, a, a + 0.28, ease.out) * (1 - es(t, b - 0.2, b, ease.in));
      const k1 = kin(1.1, 3.1), k2 = kin(3.05, 99);
      pose(p1, { x: PX, y: lerp(-1500, PY, k1), o: k1 > 0.002 ? 1 : 0 });
      pose(p2, { x: PX, y: lerp(-1500, PY, k2), o: k2 > 0.002 ? 1 : 0 });

      /* v46b — the burdens come down; the finger will not touch them */
      const Y1 = lerp(-1500, PY, k1), on1 = k1 > 0.9 ? 1 : 0;
      porters.forEach((m) => {
        const a = 2.05 + m.i * 0.1;
        const k = es(t, a, a + 0.16, ease.in);
        const bend = es(t, a + 0.14, a + 0.3);
        const x = PX - 110 + m.i * 90;
        m.p.set({ x, y: Y1 + 104, s: 0.5, o: on1, armF: 50 + bend * 30, armB: 120, lean: bend * (18 + m.i * 4), head: bend * 14, blink: bend * 0.6 });
        pose(m.load, { x: x - 6 + bend * 18, y: lerp(Y1 - 140, Y1 + 104 - 86 + bend * 14, k), r: bend * 16, o: on1 * (k > 0 ? 1 : 0) });
      });
      const fk = es(t, 2.4, 2.6) * (1 - es(t, 2.85, 3.0));
      pose(finger, { x: PX + 90, y: lerp(Y1 - 200, Y1 - 40, fk), o: on1 * (fk > 0.01 ? 1 : 0) });

      /* v47 — they build the tomb of a prophet; the fathers' shadows behind */
      const Y2 = lerp(-1500, PY, k2), on2 = k2 > 0.9 ? 1 : 0;
      const MX = PX + 60, MY = Y2 + 104;
      pose(fathers, { x: PX, y: Y2 + 90, o: on2 * es(t, 3.4, 3.6) * 0.85 });
      courses.forEach((cr, i) => {
        const k = es(t, 3.2 + i * 0.1, 3.3 + i * 0.1);
        pose(cr, { x: MX, y: lerp(MY - 120, MY - i * 20, k), o: on2 * (k > 0 ? 1 : 0) * (1 - seg(t, 3.9, 3.95)) });
      });
      pose(monBase, { x: MX, y: MY, o: on2 * seg(t, 3.9, 3.95) });
      const ck = es(t, 4.1, 4.3);
      pose(cap, { x: MX, y: lerp(MY - 180, MY - 80, ck), o: on2 * (ck > 0 ? 1 : 0) });
      pose(gar, { x: MX - 50, y: MY - 70, o: on2 * es(t, 4.3, 4.45) });
      builders.forEach((b) => {
        const x = MX + (b.i ? 80 : -66);
        const lift = bump(t, 3.2 + b.i * 0.1, 3.6 + b.i * 0.1) + bump(t, 3.6 + b.i * 0.1, 4.0);
        b.p.set({ x, y: MY + 2, s: 0.46, flip: b.i === 1, o: on2, armF: 40 + lift * 60 + (b.i === 0 ? es(t, 4.45, 4.6) * 20 : 0), armB: 20 + lift * 60, head: -6, blink: blinkAt(T, 3 + b.i) });
      });
      /* v48 — they approve: a father's shadow and the builder clasp hands */
      const hk = es(t, 4.4, 4.6);
      pose(clasp, { x: MX - 120 + hk * 10, y: MY + 2, s: 0.46, o: on2 * hk * 0.85 });

      S.cam.x = kf(t, [[0, 110]]);
      S.cam.y = kf(t, [[0, 100]]);
      S.cam.z = kf(t, [[0, 1.06]]);
      if (S.portrait) { S.cam.x = 210; S.cam.z = 0.84; }   // phone: the host at the far end inside the screen
    };
  },
};
