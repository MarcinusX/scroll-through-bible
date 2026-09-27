// J 5,8–9 — "Rise, take up your mat, and walk!": Jesus lifts His hand, and three little plates come down —
// a man standing, a rolled mat, footprints. At once the man is well: he springs up in a burst of light, rolls
// up the mat he lay on for thirty-eight years, swings it onto his shoulder and walks, and walks. The third sign
// hangs over the pool. But that day was the Sabbath — a Sabbath tag with two candles swings down, and behind a
// column a leader of the people has seen it all.
import { C, person, CAST, blinkAt, lerp } from '../kit.js';
import { seg, es, ease, bump, attr, pose } from '../../core/anim.js';
import {
  bethesdaSet, bethesdaIdle, backSick, BZ, DAY, WARM, LAME, HEALED, sickLook, blindBand, withFace, faceBits, lyingOn, matFlat, matRoll, staff,
  hungPlate, footprint, signBadge, sabbathTag, hang2, spark, glory, leaderOpts, vis, kf, headAt, handAt, tr, PI,
} from './lib.js';

const F = BZ.floor;
const MX = 900;
const JX = 650;

export default {
  id: 'j5-rise',
  beats: [
    { v: 8 },
    { v: 9, text: 'Natychmiast wyzdrowiał ów człowiek,' },
    { v: 9, cont: true, text: 'wziął swoje łoże i chodził.' },
    { v: 9, cont: true, text: 'Jednakże dnia tego był szabat.' },
  ],
  cam: { x: [0, 120], y: [-60, 40], z: [1.02, 1.18] },
  build(S) {
    const c = S.c;
    const set = bethesdaSet(S, { skyCols: DAY });
    backSick(S, set);
    set.sickBackL.fade(1);
    set.waterline();
    const A = set.actL;

    /* others around the pool watch */
    const blind = S.puppet(A.add(withFace(person(c, { ...sickLook(c, 8), pose: 'sit', eyes: 'closed' }), blindBand(c))));
    const blindStaff = A.add(`<g>${staff(c, 150)}</g>`);
    const lier = A.add(lyingOn(c, sickLook(c, 9), { s: 0.7, w: 176, eyes: 'open' }));
    const lierP = S.puppet(lier.querySelector('.fig'));
    const lead = S.puppet(A.add(withFace(person(c, leaderOpts(0)), faceBits(c))));
    const angry = lead.el.querySelector('[data-part="angry"]');

    /* the man: sitting → standing; the mat flat → rolled → on his shoulder */
    const mat = A.add(`<g>${matFlat(c, 190)}</g>`);
    const glow = A.add(`<g>${glory(c, 260, 18)}</g>`);
    const sit = S.puppet(A.add(withFace(person(c, { ...LAME, pose: 'sit' }), faceBits(c))));
    const sadS = sit.el.querySelector('[data-part="sad"]');
    const roll = A.add(`<g>${matRoll(c, 120)}</g>`);
    const man = S.puppet(A.add(person(c, HEALED)));
    const jesus = S.puppet(A.add(person(c, { ...CAST.jesus })));
    const sparks = [0, 1, 2, 3, 4, 5].map(() => A.add(`<g>${spark(c, 11)}</g>`));

    /* the flies: three plates (rise · take · walk), the sign, the Sabbath */
    const X = set.flyL;
    const icons = [
      `<g transform="translate(0 30) scale(.3)">${person(c, HEALED)}</g><path d="${c.ribbon([[30, 10], [30, -24]], 4)}" fill="${C.terracotta}"/><path d="${c.poly([[22, -20], [30, -34], [38, -20]])}" fill="${C.terracotta}"/>`,
      `<g transform="scale(.62)">${matRoll(c, 120)}</g>`,
      `<g transform="translate(-10 12) rotate(-70) scale(.8)">${footprint(c, true)}</g><g transform="translate(12 -10) rotate(-70) scale(.8)">${footprint(c, false)}</g>`,
    ];
    const plates = icons.map((ic, i) => ({ i, el: X.add(hungPlate(c, ic, { r: 44 })) }));
    const badge = X.add(`<g>${hang2(`${signBadge(c, 3, { r: 56, icon: 'mat' })}<g transform="translate(-22 -6) scale(.36)">${matRoll(c, 110)}</g>`, 0.01, 400)}</g>`);
    const sab = X.add(`<g>${hang2(`<g transform="scale(1.3)">${sabbathTag(c, tr('szabat', 'the Sabbath'))}</g>`, 60, 400)}</g>`);

    return (t, time) => {
      const T = time;
      /* the day leans towards evening as the Sabbath is named */
      const eve = es(t, 3.05, 3.6);
      set.sk.blend(DAY, WARM, eve);
      bethesdaIdle(set, T, { sunY: 150 + eve * 60 });

      /* v8 — "Rise, take up your mat, and walk!" */
      const cmd = es(t, 0.1, 0.35) * (1 - es(t, 1.0, 1.2));
      jesus.set({ x: JX, y: F + 12, s: 1.04, flip: false, armF: 30 + cmd * 50 + es(t, 1.2, 1.5) * 20, armB: 10 + cmd * 130 + es(t, 1.2, 1.5) * 40 * (1 - es(t, 2.6, 2.9)), head: -cmd * 6 + es(t, 1.2, 1.4) * 4, blink: blinkAt(T, 1) });
      plates.forEach((p) => {
        const k = es(t, 0.25 + p.i * 0.17, 0.5 + p.i * 0.17, ease.back) * (1 - es(t, 1.05, 1.3));
        vis(p.el, { x: 690 + p.i * 150, y: 230 - (1 - k) * 440, r: Math.sin(T * 0.8 + p.i) * 2, o: k > 0.01 ? 1 : 0 });
      });

      /* v9a — at once he is well: up he springs */
      const upK = es(t, 1.08, 1.16);
      const joy = bump(t, 1.2, 2.0);
      sit.set({ x: MX, y: F + 2, s: 0.94, flip: true, armF: 40 + cmd * 30, armB: 20, lean: -4, head: -cmd * 12, blink: blinkAt(T, 2), o: 1 - upK });
      attr(sadS, 'opacity', (1 - es(t, 0.2, 0.5)).toFixed(2));
      const gk = bump(t, 1.05, 1.9);
      vis(glow, { x: MX - 20, y: F - 110, s: 0.5 + gk * 0.6, r: T * 6, o: gk * 0.9 });
      sparks.forEach((sp, i) => {
        const a = (i / 6) * PI * 2 + T * 0.5, k = es(t, 1.1, 1.5, ease.out);
        vis(sp, { x: MX - 20 + Math.cos(a) * 110 * k, y: F - 120 + Math.sin(a) * 90 * k, s: 0.5 + k * 0.5, o: bump(t, 1.1, 2.0) });
      });

      /* v9b — he rolls up his mat, shoulders it, and walks about */
      const bend = bump(t, 2.02, 2.4);
      const rolled = es(t, 2.08, 2.32);
      const lift = es(t, 2.3, 2.45);
      const WK = [[2.45, 880], [2.85, 1130], [2.95, 1150], [3.35, 980]];
      const mx = kf(t, WK, ease.sine);
      const walking = t > 2.45 && t < 3.35 && Math.abs(kf(t + 0.01, WK) - kf(t - 0.01, WK)) > 0.5;
      const mflip = t < 2.45 ? true : t < 2.9 ? false : true;
      man.set({ x: t < 2.45 ? 880 : mx, y: F + 4, s: 1.0, flip: mflip, walk: walking ? mx * 0.09 : undefined, armF: 20 + joy * 110 + bend * 40 + lift * 20, armB: 20 + joy * 150 + lift * 150, head: -joy * 8 + bend * 20, lean: bend * (mflip ? -14 : 14), blink: blinkAt(T, 2), o: upK });
      pose(mat, { x: MX + 10 + rolled * 70, y: F - 10, sx: Math.max(0.05, 1 - rolled), o: 1 - seg(t, 2.3, 2.34) });
      const [hx, hy] = headAt(t < 2.45 ? 880 : mx, F + 4, 1.0, mflip);
      const onSh = lift;
      const dir = mflip ? -1 : 1;
      const rx = lerp(MX + 80, hx - dir * 18, onSh), ry = lerp(F - 16, hy + 44, onSh);
      pose(roll, { x: rx, y: ry, r: dir * 28 * onSh, o: rolled > 0.6 ? 1 : 0 });
      const bk = es(t, 2.5, 2.85, ease.out) * (1 - es(t, 3.1, 3.4));
      vis(badge, { x: 800, y: 200 - (1 - bk) * 520, r: Math.sin(T * 0.7) * 1.2, o: bk > 0.01 ? 1 : 0 });

      /* v9c — but it was the Sabbath */
      const sk = es(t, 3.1, 3.4, ease.back);
      vis(sab, { x: 800, y: 170 - (1 - sk) * 480, r: Math.sin(T * 0.8) * 1.5, o: sk > 0.01 ? 1 : 0 });
      const peek = es(t, 3.35, 3.7, ease.out);
      lead.set({ x: lerp(1460, 1290, peek), y: F + 8, s: 1.0, flip: true, armF: 20 + peek * 40, armB: 10, lean: -peek * 6, head: peek * 6, blink: blinkAt(T, 6), o: seg(t, 3.3, 3.4) });
      attr(angry, 'opacity', es(t, 3.6, 3.8).toFixed(2));

      /* the others marvel */
      const wonder = es(t, 1.15, 1.5);
      blind.set({ x: 470, y: F + 6, s: 0.92, flip: false, armF: 50, armB: 10 + wonder * 60, head: 6 - wonder * 10, blink: 0 });
      const [bx, by] = handAt(470, F + 6, 0.92, false, 50, 'sit');
      pose(blindStaff, { x: bx, y: by + 60 });
      pose(lier, { x: 1330, y: F + 10, sx: -1 });
      lierP.set({ armF: 20 + wonder * 70, armB: 10 + wonder * 40, head: -wonder * 24, blink: blinkAt(T, 5) });

      S.cam.x = kf(t, [[0, 40], [1.0, 60], [2.0, 70], [3.0, 90], [3.6, 110]]);
      S.cam.y = kf(t, [[0, 10], [1.0, 20], [2.4, 0], [3.0, -40], [3.6, -20]]);
      S.cam.z = kf(t, [[0, 1.12], [1.0, 1.16], [2.4, 1.08], [3.0, 1.04], [3.6, 1.08]]);
    };
  },
};
