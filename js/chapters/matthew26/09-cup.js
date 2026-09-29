// Mt 26,27–29 — He takes the golden cup; He gives thanks (the beam from above again); He gives it to them: "Drink of
// it, all of you" — it goes round the table, hand to hand. "This is my blood of the covenant, poured out for many for
// the forgiveness of sins": the light of the cup streams out through both windows into the night, and dark scraps
// drifting in the room turn to light. "I will not drink again of this fruit of the vine": He sets the cup down.
// "…until I drink it new with you in my Father's Kingdom": a golden plate of the Kingdom's table comes down.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { upperRoom, supperTable, seatAll, kf, hand, chalice, glory, discPlate, lowTable, lightCrown, scrap, spark, vis, PI } from './lib.js';

export default {
  id: 'mt26-cup',
  beats: [
    { v: 27, text: 'Następnie wziął kielich' },
    { v: 27, cont: true, text: 'i odmówiwszy dziękczynienie,' },
    { v: 27, cont: true, text: 'dał im, mówiąc: «Pijcie z niego wszyscy,' },
    { v: 28 },
    { v: 29, text: 'Lecz powiadam wam: Odtąd nie będę już pił z tego owocu winnego krzewu' },
    { v: 29, cont: true, text: 'aż do owego dnia, kiedy pić go będę z wami nowy, w królestwie Ojca mojego».' },
  ],
  cam: { x: [-40, 40], y: [-40, 260], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    const R = upperRoom(S, { skyCols: ['#2a2f60', '#4d4a7c', '#7d6a8a'] });
    const { SEAT, TOP, FLOOR } = R;
    R.stars.fade(1);
    const gid = S.id('beam');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6dc" stop-opacity=".0"/><stop offset=".25" stop-color="#fff6dc" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></linearGradient>`);
    const beamL = S.layer({ par: 0.5, sh: 0, flat: true });
    beamL.add(`<path d="${c.poly([[740, 180], [860, 180], [960, TOP + 10], [640, TOP + 10]])}" fill="url(#${gid})"/>`);
    beamL.fade(0);

    const seatL = S.layer({ par: 0.52, sh: 5 });
    const at = seatAll(S, seatL);
    const J = at.find((m) => m.k === 'jesus');
    const others = at.filter((m) => m.k !== 'jesus');
    const tabL = S.layer({ par: 0.55, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${supperTable(c, 860)}</g>`);
    const shadeL = S.layer({ par: 0.56, sh: 0, flat: true });
    shadeL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d1830" opacity=".22"/>`);

    const fx = S.layer({ par: 0.57, sh: 4 });
    const cupGlow = fx.add(`<g><circle r="120" fill="url(#halo-glow)"/><g opacity=".45">${glory(c, 120, 18).replace('<circle', '<circle opacity="0"')}</g></g>`);
    const cupEl = fx.add(`<g>${chalice(c, 46)}</g>`);
    const motes = Array.from({ length: 16 }, (_, i) => ({ i, el: fx.add(`<g><circle r="9" fill="url(#warm-glow)"/><path d="${c.poly(c.star(0, 0, 4.5, 1.6, 4, 0))}" fill="#fff4d6"/></g>`), side: i % 2 ? 1 : -1, off: i / 16 + c.rr(-0.02, 0.02), dy: c.rr(-30, 30) }));
    // sins: dark scraps in the air that turn to light
    const sins = Array.from({ length: 7 }, (_, i) => ({ i, x: 430 + i * 125 + c.rr(-30, 30), y: c.rr(300, 430), dark: fx.add(`<g>${scrap(c, 13)}</g>`), light: fx.add(`<g>${spark(c, 12)}</g>`) }));
    const kingdom = hanging(fx, discPlate(c, `<g transform="translate(0 30) scale(.5)">${lowTable(c, 150, 40)}</g><g transform="translate(0 6)">${chalice(c, 40, { dark: false })}</g><g transform="translate(0 -30) scale(.36)">${lightCrown(c, 46)}</g>`, { r: 64, rim: C.sun, fill: mix(C.cream, C.halo, 0.4) }), { x: 800, y: -1500, len: 700 });

    return (t, time) => {
      const T = time;
      R.lamps.forEach((l, i) => {
        swing(l.el, l.x, l.y, T, 1, 0.7, i);
        pose(l.fl, { x: 26, y: 36, sx: 0.8 + Math.sin(T * 7 + i) * 0.06, sy: 0.8 + Math.sin(T * 5.3 + i) * 0.1 });
        fade(l.gl, 0.65);
      });
      const take = es(t, 0.05, 0.4);
      const thanks = es(t, 1.05, 1.4) * (1 - es(t, 1.95, 2.15));
      const covenant = es(t, 3.05, 3.4) * (1 - es(t, 4.1, 4.4));
      const setDown = es(t, 4.05, 4.4);
      beamL.fade(thanks * 0.9 + covenant * 0.7 + es(t, 5.05, 5.4) * 0.4);

      const cupUp = take * (1 - es(t, 2.05, 2.15)) + es(t, 2.95, 3.2) * (1 - setDown);
      const armF = 40 + cupUp * 40 + thanks * 20 + setDown * 10 - es(t, 5.05, 5.3) * 10;
      const armB = 20 + thanks * 60 + cupUp * 10 + es(t, 5.05, 5.4) * 80;
      J.p.set({ x: 800, y: SEAT, s: 1.04, flip: false, armF, armB, head: -thanks * 14 - covenant * 4 + setDown * 8 * (1 - es(t, 5.05, 5.3)) - es(t, 5.05, 5.4) * 12, blink: blinkAt(T) });
      fade(J.sad, setDown * 0.5 * (1 - es(t, 5.05, 5.3)));
      const [hx, hy] = hand(800, SEAT, 1.04, false, armF, 0, 62);

      // the cup goes round: left side, then right side, then back to Him
      const round = seg(t, 2.1, 2.95);
      const leftSide = others.filter((m) => m.x < 800).sort((a, b) => b.x - a.x), rightSide = others.filter((m) => m.x > 800).sort((a, b) => a.x - b.x);
      const path = [[hx, hy], ...leftSide.map((m) => hand(m.x, SEAT, m.s, m.flip, 60, 0, 62)), [800, TOP + 14], ...rightSide.map((m) => hand(m.x, SEAT, m.s, m.flip, 60, 0, 62)), [hx, hy]];
      const sgi = round * (path.length - 1), si = Math.min(path.length - 2, Math.floor(sgi)), sf = sgi - si;
      const inRound = round > 0 && round < 1;
      const [cx0, cy0] = inRound ? [lerp(path[si][0], path[si + 1][0], ease.io(sf)), lerp(path[si][1], path[si + 1][1], ease.io(sf)) - Math.sin(sf * PI) * 12] : [hx, hy];
      const start = [860, TOP];
      const [dx, dy] = t < 0.5 ? [lerp(start[0], hx, take), lerp(start[1], hy, take)] : setDown > 0 ? [lerp(hx, 856, setDown), lerp(hy, TOP, setDown)] : [cx0, cy0];
      vis(cupEl, { x: dx, y: dy + 6, o: 1 });
      vis(cupGlow, { x: dx, y: dy - 30, s: 0.5 + covenant * 0.7, o: Math.max(take * 0.3 * (1 - inRound), thanks, covenant, es(t, 5.05, 5.4) * 0.4) });

      others.forEach((m) => {
        let aF = 36, head = 0;
        const near = inRound ? Math.max(0, 1 - Math.abs(cx0 - hand(m.x, SEAT, m.s, m.flip, 60, 0, 62)[0]) / 50) : 0;
        aF += near * 24;
        head -= near * 10;
        head += thanks * 6 - covenant * 10 - es(t, 5.05, 5.4) * 8 + setDown * 6 * (1 - es(t, 5.05, 5.4));
        m.p.set({ x: m.x, y: SEAT + (m.i % 2) * 3, s: m.s, flip: m.flip, armF: aF, armB: 14, head, blink: blinkAt(T, m.seed) });
      });

      // poured out for many: motes of light stream out through both windows
      motes.forEach((mo) => {
        const k = ((T * 0.22 + mo.off) % 1 + 1) % 1;
        const on = covenant;
        const tx = mo.side < 0 ? 530 : 1070, ty = 420;
        const x = lerp(dx, tx, k) + Math.sin(k * 5 + mo.i) * 10, y = lerp(dy - 40, ty + mo.dy, k) - Math.sin(k * PI) * 90;
        vis(mo.el, { x: k < 0.75 ? x : lerp(tx, tx + mo.side * 200, (k - 0.75) * 4), y: k < 0.75 ? y : ty + mo.dy - (k - 0.75) * 120, s: 0.7 + k * 0.5, o: on * Math.min(1, k * 6) * (1 - Math.max(0, k - 0.8) * 5) });
      });
      // for the forgiveness of sins: the dark scraps turn to light
      sins.forEach((s) => {
        const on = es(t, 2.9, 3.1) * (1 - es(t, 3.9, 4.1));
        const turn = es(t, 3.3 + s.i * 0.05, 3.45 + s.i * 0.05);
        const bob = Math.sin(T * 1.3 + s.i) * 5;
        vis(s.dark, { x: s.x, y: s.y + bob, r: Math.sin(T + s.i) * 10, s: 1 - turn * 0.6, o: on * (1 - turn) });
        vis(s.light, { x: s.x, y: s.y + bob - turn * 30, s: 0.6 + turn * 0.6, o: on * turn });
      });

      // v29b — the Kingdom
      const kin = es(t, 5.05, 5.4, ease.out);
      vis(kingdom, { x: 800, y: 290 - (1 - kin) * 800, r: Math.sin(T * 0.8) * 1.5, o: kin > 0.01 ? 1 : 0 });

      S.cam.x = 0;
      S.cam.z = kf(t, [[-0.5, 1.2], [0.4, 1.5], [1.3, 1.56], [2.0, 1.3], [2.95, 1.2], [3.3, 1.08], [4.05, 1.4], [4.5, 1.46], [5.05, 1.2], [5.4, 1.08]]);
      S.cam.y = kf(t, [[-0.5, 150], [0.4, 220], [1.3, 230], [2.0, 150], [2.95, 120], [3.3, 40], [4.05, 200], [4.5, 210], [5.05, 80], [5.4, 20]]);
    };
  },
};
