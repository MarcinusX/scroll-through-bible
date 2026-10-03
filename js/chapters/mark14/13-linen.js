// Mk 14,51–52 — the torchlit band leads Him away; a young man wrapped only in a linen sheet follows.
// They reach for him — and he slips out of it: the empty linen is left hanging in their hands,
// and a dark little figure runs off into the night.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { garden, LOOK, kf, moving, hand, headAt, shadowPerson, silhouette, guardOpts, torch, cord, linenCloth, PI, vis } from './lib.js';

const GY = 700;
const INK = '#1d1830';

export default {
  id: 'm14-linen',
  beats: [
    { v: 51, text: 'A pewien młodzieniec szedł za Nim, odziany prześcieradłem na gołym ciele.' },
    { v: 51, cont: true, text: 'Chcieli go chwycić,' },
    { v: 52 },
  ],
  cam: { x: [-280, 80], y: [-40, 160], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const G = garden(S, { moonAt: [1200, 150], rockX: 1500, city: true });
    const darkL = S.layer({ par: 0.4, sh: 0, flat: true });
    darkL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#120f24" opacity=".45"/>`);
    // the procession (a little further back), Jesus bound in the middle of it
    const procL = S.layer({ par: 0.44, sh: 4 });
    const pool = procL.add(`<g><ellipse cx="0" cy="-100" rx="360" ry="220" fill="url(#warm-glow)" opacity=".5"/></g>`);
    const guards = Array.from({ length: 7 }, (_, i) => {
      const hasT = i % 2 === 0;
      const el = procL.add(`<g>${shadowPerson(c, guardOpts(c), INK)}${hasT ? `<g transform="translate(30 -96)">${torch(c, 50)}</g>` : ''}</g>`);
      return { i, el, fl: el.querySelector('.flame'), dx: [-230, -170, -110, 90, 150, 210, 270][i] * (S.portrait && i > 2 ? 0.55 : 1) };   // phone: the guards ahead of Him closer, not under the thread
    });
    const jesus = S.puppet(procL.add(person(c, { ...CAST.jesus, holdF: cord(c) })));
    // the two at the back who turn and grab
    const P = S.layer({ par: 0.52, sh: 5 });
    const g1 = S.puppet(P.add(shadowPerson(c, guardOpts(c), INK)));
    const g2 = S.puppet(P.add(shadowPerson(c, guardOpts(c), INK)));
    // the young man: wrapped in linen; then a dark figure running
    const youth = S.puppet(P.add(person(c, { ...LOOK.youth, mantle: C.linen2 })));
    const runner = S.puppet(P.add(shadowPerson(c, LOOK.youth, '#141022')));
    const cloth = P.add(`<g>${linenCloth(c, 60, 110)}</g>`);

    return (t, time) => {
      const T = time;
      swing(G.moon, 1200, 150, T, 1, 0.6);
      // the procession walks slowly to the right
      const px = lerp(620, 1000, seg(t, -0.5, 3.2));
      vis(pool, { x: px, y: GY - 30, o: 1 });
      guards.forEach((g) => {
        vis(g.el, { x: px + g.dx, y: GY - 34 + (g.i % 2) * 6, s: 0.78, o: 1 });
        if (g.fl) pose(g.fl, { x: 0, y: -60, sy: 1 + Math.sin(T * 8 + g.i) * 0.1 });
      });
      jesus.set({ x: px, y: GY - 30, s: 0.84, flip: false, walk: px * 0.05, armF: 24, armB: 14, head: 10, blink: blinkAt(T) });

      /* the young man follows; they reach for him; he slips out and runs */
      const yK = [[-0.5, [260, GY + 20]], [0.9, [470, GY + 20]], [1.1, [470, GY + 20]], [1.6, [440, GY + 20]]];
      const [yx, yy] = kf(t, yK, ease.sine);
      const escape = es(t, 2.05, 2.12);
      const startle = es(t, 1.2, 1.4);
      youth.set({ x: yx, y: yy, s: 0.92, flip: startle > 0.5, o: 1 - escape, walk: moving(t, yK, 1) ? yx * 0.05 : undefined, armF: 14 + startle * 40, armB: startle * 30, head: startle * -8, lean: -startle * 6, blink: blinkAt(T, 4) });
      const run = es(t, 2.1, 2.9, ease.in);
      const rx = lerp(yx - 10, -300, run);
      runner.set({ x: rx, y: yy, s: 0.92, flip: true, o: escape * (1 - es(t, 2.7, 2.95)), walk: rx * 0.1, amt: 1.8, armF: 40, armB: 60, lean: 14 });
      // the grabbers
      const turn = es(t, 1.05, 1.15);
      const reach = es(t, 1.1, 1.45);
      const g1x = lerp(px - 300, 560, turn), g2x = lerp(px - 360, 610, turn);
      g1.set({ x: g1x, y: GY + 14, s: 0.94, flip: turn > 0.5, armF: 20 + reach * 70, armB: reach * 40, lean: reach * 8, walk: t < 1.05 ? g1x * 0.05 : undefined });
      g2.set({ x: g2x, y: GY + 8, s: 0.94, flip: turn > 0.5, armF: 20 + reach * 50, armB: reach * 60, lean: reach * 6, walk: t < 1.05 ? g2x * 0.05 : undefined });
      // the linen: on him, then left hanging from the hand
      const [hx, hy] = hand(g1x, GY + 14, 0.94, true, 20 + reach * 70);
      const lift = es(t, 2.05, 2.4);
      vis(cloth, { x: lerp(yx + 2, hx, lift), y: lerp(yy - 150, hy - 6, lift), s: 0.9, r: lift * -10 + Math.sin(T * 1.5) * 2 * lift, o: escape });

      darkL.fade(0.8);
      // phone: the camera stands further left, so the young man (at the back of the band) is inside the screen
      S.cam.x = kf(t, S.portrait ? [[-0.5, -220], [1.0, -240], [2.0, -250], [2.6, -80], [2.9, -50]] : [[-0.5, -40], [1.0, -60], [2.0, -80], [2.9, -60]]);
      S.cam.z = kf(t, [[-0.5, 1.1], [1.0, 1.24], [2.0, 1.3], [2.9, 1.2]]);
      S.cam.y = kf(t, [[-0.5, 60], [1.0, 120], [2.0, 130], [2.9, 100]]);
    };
  },
};
