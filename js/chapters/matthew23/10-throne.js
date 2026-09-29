// Mt 23,20–22 — the oaths gathered up, climbing from the altar to heaven. The man lifts his hand over the altar, and a
// ring of gold closes round the altar and everything on it, the lamb and the fire: "by it, and by everything on it".
// He turns to the sanctuary: behind the embroidered veil a light kindles and shines out at its edges — "and by Him who
// dwells in it" (light only). He looks up: a warm gold heaven opens over the whole court, the clouds draw apart, and
// there is the throne of light with its rays — "the throne of God, and Him who sits on it" — no figure, only light.
// The blindfolded Pharisee at the side sees none of it.
import { C, person, blinkAt, pose, lerp, hanging, sheet, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { templeCourt, pose3, folk, vain, PH, altar, lamb, throne, blindBand, addToHead, PI, SWEARER } from './lib.js';

const AX = 800;

export default {
  id: 'mt23-throne',
  beats: [
    { v: 20 },
    { v: 21 },
    { v: 22 },
  ],
  cam: { x: [-10, 10], y: [-30, 10], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;

    /* the light behind the veil (same depth as the sanctuary) */
    const veilL = S.layer({ par: 0.16, sh: 1, flat: true });
    const veil = veilL.add(`<g><circle r="220" fill="url(#halo-glow)"/><g opacity=".4">${rays(c, { n: 12, r0: 40, r1: 230, spread: 0.05, color: '#fff3cf' })}</g><path d="M-58 -96H-50V100H-58Z M50 -96H58V100H50Z M-54 -104H54V-96H-54Z" fill="#fff6d6"/></g>`);

    /* the altar in front, with the lamb and the fire, and the ring of gold */
    const P = S.layer({ par: 0.5, sh: 5 });
    P.add(`<g transform="translate(${AX} ${F + 20})">${altar(c, 210, 110)}</g>`);
    P.add(`<g transform="translate(${AX - 40} ${F - 94}) scale(1.05)">${lamb(c)}</g>`);
    const fire = P.add(`<g><circle cy="-30" r="100" fill="url(#warm-glow)"/><path d="M-30 0C-38 -20 -20 -40 -16 -64C-8 -40 0 -44 2 -80C10 -50 22 -46 20 -60C34 -40 36 -18 30 0Z" fill="${C.sunDeep}"/><path d="M-16 0C-20 -14 -8 -26 -4 -44C2 -26 12 -26 14 -36C22 -20 20 -8 16 0Z" fill="${C.lampFlame}"/></g>`);
    const ringBack = P.add(`<g><path d="${c.ribbon(c.arc(0, 0, 150, 34, PI, 2 * PI, 30), 5)}" fill="${mix(C.sun, C.ochre, 0.4)}"/></g>`);
    const ringFront = P.add(`<g><path d="${c.ribbon(c.arc(0, 0, 150, 34, 0, PI, 30), 6)}" fill="${C.sun}"/><path d="${c.ribbon(c.arc(0, 0, 150, 34, 0.2, PI - 0.2, 24), 2)}" fill="${C.star}" opacity=".8"/></g>`);

    /* heaven opening over everything */
    const hb = S.layer({ par: 0, sh: 1, flat: true });
    const hid = S.id('heaven');
    S.defs(`<linearGradient id="${hid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2cf8e"/><stop offset=".55" stop-color="#f8e0b0"/><stop offset="1" stop-color="#fbeed2"/></linearGradient>`);
    hb.add(`<rect x="-3000" y="-2000" width="8000" height="5000" fill="url(#${hid})"/>`);
    hb.fade(0);
    const HL = S.layer({ par: 0.05, sh: 4 });
    const glory = HL.add(`<g><circle r="360" fill="url(#halo-glow)"/><g opacity=".75">${rays(c, { n: 22, r0: 60, r1: 1100, spread: 0.04, color: '#fff6dc' })}</g></g>`);
    const thr = HL.add(`<g><circle cy="-130" r="150" fill="url(#halo-glow)"/>${throne(c)}</g>`);
    const CL = [[-1, 560, 330, 2.1], [1, 1040, 320, 2.2], [-1, 420, 520, 2.4], [1, 1180, 520, 2.3], [-1, 700, 640, 2.0], [1, 900, 650, 2.0]].map(([side, x, y, s], i) => ({ side, x, y, s, i, el: HL.add(`<g>${cloud(c, 220, mix(C.cream, C.halo, 0.3), mix(C.parchment, C.sun, 0.25))}</g>`) }));

    /* the man who swears; the blind Pharisee */
    const Q = S.layer({ par: 0.5, sh: 5 });
    const man = S.puppet(Q.add(person(c, SWEARER)));
    const phar = S.puppet(Q.add(addToHead(vain(c, PH, { eyes: 'closed' }), blindBand(c))));

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v20 — the ring of gold closes round the altar and all on it */
      const ring = es(t, 0.2, 0.55, ease.back);
      const ringO = (ring > 0.02 ? 1 : 0) * (1 - es(t, 2.0, 2.2));
      pose(ringBack, { x: AX, y: F - 60, sx: ring, sy: ring, o: ringO });
      pose(ringFront, { x: AX, y: F - 60, sx: ring, sy: ring, o: ringO });
      pose(fire, { x: AX + 50, y: F - 90, s: 0.7 + (T ? Math.sin(T * 6) * 0.04 : 0) });

      /* v21 — light behind the veil */
      const shine = es(t, 1.1, 1.45);
      pose(veil, { x: 800, y: 310, s: 0.9 + (T ? Math.sin(T * 1.3) * 0.03 : 0), o: shine });

      /* v22 — heaven opens */
      const open = es(t, 2.05, 2.4);
      hb.fade(open * 0.96);
      const part = es(t, 2.3, 2.7);
      CL.forEach((cl) => pose(cl.el, { x: cl.x + cl.side * part * 420, y: cl.y - part * 40, s: cl.s, o: open }));
      pose(thr, { x: 800, y: 470, s: 1.25, o: open });
      pose(glory, { x: 800, y: 320, s: 0.8 + part * 0.25, r: T ? T * 2 : 0, o: part });

      /* the man: over the altar, towards the sanctuary, up to heaven */
      const a = bump(t, 0.08, 0.95), b = bump(t, 1.08, 1.95), up = es(t, 2.08, 2.3);
      man.set({ x: 1040, y: F + 14, s: 1, flip: true, armB: 30 + a * 110 + b * 140 + up * 140, armF: 20 + a * 40 + up * 60, head: -b * 16 - up * 26 + a * 6, lean: -up * 5, blink: blinkAt(T, 3) });
      phar.set({ x: 550, y: F + 10, s: 0.98, armF: 30 + (T ? Math.sin(T * 0.9) * 10 : 0), armB: 20, head: 4, blink: 0 });

      S.cam.y = -es(t, 1.0, 1.4) * 20;
      S.cam.z = 1.02;
    };
  },
};
