// Mt 26,26 — the heart of the chapter, one gesture to a beat. As they eat, He takes a loaf in His hands (a soft glow).
// He gives thanks: He lifts it and His eyes, and a beam of light comes down from above. He breaks it: the two halves
// shine. He gives it to the disciples: a piece of light goes from His hands to each of them. "Take, eat; this is my
// body": they hold the bread, the light stays in their hands, and He opens His hands over the table.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { upperRoom, supperTable, seatAll, kf, hand, loaf, loafHalves, radiance, vis, PI } from './lib.js';

export default {
  id: 'mt26-bread',
  beats: [
    { v: 26, text: 'A gdy oni jedli, Jezus wziął chleb' },
    { v: 26, cont: true, text: 'i odmówiwszy błogosławieństwo,' },
    { v: 26, cont: true, text: 'połamał' },
    { v: 26, cont: true, text: 'i dał uczniom, mówiąc:' },
    { v: 26, cont: true, text: '«Bierzcie i jedzcie, to jest Ciało moje».' },
  ],
  cam: { x: [-40, 40], y: [-40, 260], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    const R = upperRoom(S, { skyCols: ['#2a2f60', '#4d4a7c', '#7d6a8a'] });
    const { SEAT, TOP, FLOOR } = R;
    R.stars.fade(1);

    // a beam of light from above onto Him
    const gid = S.id('beam');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6dc" stop-opacity=".0"/><stop offset=".25" stop-color="#fff6dc" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></linearGradient>`);
    const beamL = S.layer({ par: 0.5, sh: 0, flat: true });
    beamL.add(`<path d="${c.poly([[740, 180], [860, 180], [960, TOP + 10], [640, TOP + 10]])}" fill="url(#${gid})"/>`);
    beamL.fade(0);
    const auraL = S.layer({ par: 0.51, sh: 0, flat: true });
    const aura = auraL.add(`<g><circle r="150" fill="url(#halo-glow)"/><g opacity=".35">${radiance(c, 70)}</g></g>`);

    const seatL = S.layer({ par: 0.52, sh: 5 });
    const at = seatAll(S, seatL);
    const J = at.find((m) => m.k === 'jesus');
    const others = at.filter((m) => m.k !== 'jesus');
    const tabL = S.layer({ par: 0.55, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${supperTable(c, 860)}</g>`);
    const shadeL = S.layer({ par: 0.56, sh: 0, flat: true });
    shadeL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d1830" opacity=".22"/>`);

    // the loaf, its halves, the pieces
    const fx = S.layer({ par: 0.57, sh: 4 });
    const H = loafHalves(c, 26);
    const breadGlow = fx.add(`<g><circle r="60" fill="url(#halo-glow)"/></g>`);
    const whole = fx.add(`<g>${loaf(c, 26)}</g>`);
    const halfL = fx.add(`<g>${H.left}</g>`), halfR = fx.add(`<g>${H.right}</g>`);
    const pieces = others.map((m, n) => ({ m, n, el: fx.add(`<g><circle r="13" fill="url(#halo-glow)" opacity=".7"/>${sheet().p(c.cut(c.blob(0, -4, 10, 6, 8, 0.25), 0.3, 3), C.wheat2).out()}</g>`) }));

    return (t, time) => {
      const T = time;
      R.lamps.forEach((l, i) => {
        swing(l.el, l.x, l.y, T, 1, 0.7, i);
        pose(l.fl, { x: 26, y: 36, sx: 0.8 + Math.sin(T * 7 + i) * 0.06, sy: 0.8 + Math.sin(T * 5.3 + i) * 0.1 });
        fade(l.gl, 0.65);
      });
      /* one gesture to a beat */
      const take = es(t, 0.05, 0.4);
      const bless = es(t, 1.05, 1.4) * (1 - es(t, 2.0, 2.2));
      const breakK = es(t, 2.1, 2.45);
      const give = es(t, 3.05, 3.3) * (1 - es(t, 3.85, 4.0));
      const body = es(t, 4.05, 4.35);
      beamL.fade(bless * 0.9 + breakK * 0.3 * (1 - body) + body * 0.6);
      const armF = 40 + take * 30 + bless * 36 + breakK * (1 - give) * (1 - body) * 10 + give * 30 - body * 10;
      const armB = 20 + take * 40 + bless * 70 + breakK * 30 * (1 - give) * (1 - body) + body * 90;
      J.p.set({ x: 800, y: SEAT, s: 1.04, flip: false, armF, armB, head: -bless * 16 + take * 6 * (1 - bless) + give * 4 - body * 4, blink: blinkAt(T) });
      fade(J.sad, 0);
      const [hx, hy] = hand(800, SEAT, 1.04, false, armF, 0, 62);
      const breadShow = es(t, -0.1, 0.05) * (1 - breakK);
      vis(whole, { x: lerp(830, hx - 6, take), y: lerp(TOP - 2, hy + 10, take), o: breadShow > 0.01 ? 1 : 0 });
      const apart = breakK * 22;
      const halvesOn = breakK > 0 && t < 3.1 ? 1 : 0;
      vis(halfL, { x: hx - 8 - apart, y: hy + 10, r: -breakK * 12, o: halvesOn });
      vis(halfR, { x: hx - 4 + apart, y: hy + 10, r: breakK * 12, o: halvesOn });
      const glowK = Math.max(take * 0.5, bless, breakK * (1 - es(t, 3.0, 3.15)));
      vis(breadGlow, { x: hx - 6, y: hy, s: 0.6 + bless * 0.4 + breakK * 0.6, o: glowK });
      vis(aura, { x: 800, y: SEAT - 130, s: 0.7 + bless * 0.3 + body * 0.4, r: T * 2, o: bless * 0.6 + body * 0.8 });
      pieces.forEach((p) => {
        const d = Math.abs(p.m.i - 6);
        const k = es(t, 3.1 + d * 0.05, 3.4 + d * 0.05);
        const eat = body;
        const [tx, ty] = hand(p.m.x, SEAT, p.m.s, p.m.flip, 60, 0, 62);
        vis(p.el, { x: lerp(hx, tx, k), y: lerp(hy, ty, k) - Math.sin(k * PI) * 50, s: 0.9, o: k > 0 ? 1 : 0 });
      });
      others.forEach((m) => {
        const d = Math.abs(m.i - 6);
        let aF = 36 + es(t, 3.15 + d * 0.05, 3.35 + d * 0.05) * 24;
        const head = bless * 6 - breakK * 4 * (1 - body) + es(t, 3.2, 3.5) * 4 + body * 6;
        m.p.set({ x: m.x, y: SEAT + (m.i % 2) * 3, s: m.s, flip: m.flip, armF: aF, armB: 14, head, blink: blinkAt(T, m.seed) });
      });

      S.cam.x = 0;
      S.cam.z = kf(t, [[-0.5, 1.3], [0.4, 1.56], [1.3, 1.5], [2.3, 1.6], [3.0, 1.52], [3.4, 1.2], [4.3, 1.16]]);
      S.cam.y = kf(t, [[-0.5, 180], [0.4, 240], [1.3, 200], [2.3, 240], [3.0, 230], [3.4, 140], [4.3, 110]]);
    };
  },
};
