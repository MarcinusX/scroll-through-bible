// Łk 12,39–40 — the same house, deeper in the night; everyone asleep, the master of the house on his mat by the gate.
// "If the master of the house had known in what hour the thief was coming": the plate of midnight comes down with a
// small dark figure in it; outside, a thief creeps up the road to the outer wall and lifts his mattock to dig through it —
// "he would have watched, and not allowed his house to be broken into": the master is up, lamp raised and staff in hand
// at the gate; the thief sees the light, drops back and slinks away down the road, and the wall stands whole. "Therefore
// be ready also, for the Son of Man is coming in an hour that you do not expect": the household is up with its lamps in
// the courtyard — and behind the house, at no hour anyone expected, a great light rises over the roof; they all turn to it.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { moon, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { rayBurst } from '../john1/lib.js';
import { behindOf, houseSet, HOUSE, SERVANTS, SKIES, lampBody, lampFire, WICK, watchPlate, rooster, palm, mattock, cudgel, alongPts, halo, PI } from './lib.js';
import { THIEF, HOUSEHOLDER } from '../matthew24/lib.js';

const F = HOUSE.FLOOR;
const ROAD = [[1460, 574], [1360, 614], [1250, 656], [1165, 686]];

export default {
  id: 'lk12-thief',
  beats: [
    { v: 39 },
    { v: 40 },
  ],
  cam: { x: [-20, 300], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    // phone: the camera goes further right and the thief flees more slowly, so he is seen at the wall, not under the thread
    const PO = S.portrait, CX = PO ? 290 : 110;
    const NIGHTC = mix(C.night, C.duskViolet, 0.2);
    S.defs(`<clipPath id="lk12-watch-clip2"><circle r="47"/></clipPath>`);
    sky(S, SKIES.deep);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -600, y1: 440, n: 130 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    hanging(hangL, `${halo(100, 0.5)}${moon(c, 28)}`, { x: 300, y: 150, len: 800 });
    const riseL = S.layer({ par: 0.06, sh: 1, flat: true });
    const rise = riseL.add(`<g opacity="0"><circle r="520" fill="url(#halo-glow)"/>${rayBurst(c, { n: 28, r0: 60, r1: 900, spread: 0.035, color: '#fff3cf', o: 0.55 })}</g>`);
    const H = houseSet(S, { tintCol: NIGHTC, tintK: 0.45 });
    const P = S.layer({ par: 0.42, sh: 5 });
    const sleeper = S.puppet(P.add(person(c, { ...HOUSEHOLDER, pose: 'sit', eyes: 'closed' })));
    const mat = P.add(`<g>${sheet().p(c.cut([[-70, 0], [-66, -8], [70, -10], [74, 0]], 0.4, 5), mix(C.terracotta, NIGHTC, 0.3)).out()}</g>`);
    const master = S.puppet(P.add(person(c, { ...HOUSEHOLDER, holdB: `<g transform="rotate(-10)">${cudgel(c, 120)}</g>` })));
    const serv = SERVANTS.slice(0, 3).map((o, i) => ({ i, x: 520 + i * 90, seed: c.rr(0, 9), sit: S.puppet(P.add(person(c, { ...o, pose: 'sit', eyes: 'closed' }))), st: S.puppet(P.add(person(c, { ...o, belt: C.ochre }))), body: P.add(`<g>${lampBody(c)}</g>`) }));
    const mBody = P.add(`<g>${lampBody(c)}</g>`);
    const outL = S.layer({ par: 0.44, sh: 5 });
    const thief = S.puppet(outL.add(person(c, { ...THIEF, holdF: `<g transform="rotate(-30)">${mattock(c)}</g>` })));
    const fireL = S.layer({ par: 0.42, sh: 1, flat: true });
    const fires = [0, 1, 2, 3].map(() => fireL.add(`<g opacity="0">${lampFire(c, 0)}</g>`));
    const glowL = behindOf(S.layer({ par: 0.42, sh: 0, flat: true }), P);
    const glows = [0, 1, 2, 3].map(() => glowL.add(`<g opacity="0"><circle r="80" fill="url(#warm-glow)"/></g>`));
    const setFire = (i, x, y, k) => { pose(fires[i], { x, y, s: k * (1 + (time0 ? Math.sin(time0 * 9 + i) * 0.05 : 0)), o: k }); pose(glows[i], { x, y: y - 12, o: k }); };
    let time0 = 0;
    const WL = S.layer({ par: 0.2, sh: 6 });
    const mid = WL.add(`<g transform="translate(0 -1500)"><path d="M0 -2400V-56" stroke="rgba(230,210,180,.45)" stroke-width="1.2" fill="none"/><circle class="lit" r="100" fill="url(#halo-glow)" opacity="0"/>${watchPlate(c, 'mid', 'lk12-watch-clip2', rooster)}<g transform="translate(-24 40) scale(.2)">${person(c, THIEF).replace(/#[0-9a-fA-F]{6}\b/g, '#2b2130')}</g></g>`);
    const midLit = mid.querySelector('.lit');

    return (t, time) => {
      const T = time;
      time0 = time;
      /* v39 — had he known the hour */
      const wk = es(t, 0.05, 0.3, ease.out) * (1 - es(t, 1.0, 1.3, ease.in));
      pose(mid, { x: 800, y: lerp(-1500, 200, wk), r: time ? Math.sin(T * 0.8) * 1.5 : 0, oy: 0 });
      fade(midLit, es(t, 0.3, 0.45));
      const creep = es(t, 0.12, 0.45);
      const [tx, ty] = alongPts(ROAD, creep);
      const dig = bump(t, 0.42, 0.6);
      const flee = PO ? es(t, 0.66, 1.0, (u) => u * u) : es(t, 0.66, 0.98);
      const [fx, fy] = alongPts(ROAD, 1 - flee);
      const thX = flee > 0 ? fx : tx, thY = flee > 0 ? fy : ty;
      thief.set({ x: thX, y: thY + 6, s: lerp(0.7, 0.96, flee > 0 ? 1 - flee : creep), flip: flee <= 0, walk: (creep > 0 && creep < 1) || (flee > 0 && flee < 1) ? thX * 0.05 : undefined, armF: 40 + dig * 60, armB: 20 + bump(t, 0.7, 0.85) * 60, head: flee > 0 ? -6 : 8, lean: flee > 0 ? -6 : 8, o: seg(t, 0.12, 0.16) * (1 - es(t, 1.0, 1.06)) });
      const up = es(t, 0.46, 0.52);
      sleeper.set({ x: 900, y: F + 6, s: 0.94, o: 1 - up, armF: 10, armB: 0, head: 24, lean: -10 });
      pose(mat, { x: 900, y: F + 8, o: 1 });
      const toGate = es(t, 0.5, 0.64);
      const mx = lerp(900, 1030, toGate);
      const raise = es(t, 0.58, 0.66);
      master.set({ x: mx, y: F + 4, s: 0.96, o: up, walk: toGate > 0 && toGate < 1 ? mx * 0.05 : undefined, armF: 40 + raise * 60, armB: 30 + raise * 20, head: -4, blink: blinkAt(T, 3) });
      const [mpx, mpy] = palm(mx, F + 4, 0.96, false, 40 + raise * 60);
      pose(mBody, { x: mpx, y: mpy, o: up });
      setFire(3, mpx + WICK[0], mpy + WICK[1], up);
      pose(H.gateDoor, { x: HOUSE.GATE - 36, y: F + 38, sx: 1 - es(t, 0.62, 0.72) * 0.8 });

      /* v40 — be ready: an hour you do not expect */
      const wake = es(t, 1.05, 1.2);
      const turn = es(t, 1.5, 1.6);
      serv.forEach((s) => {
        s.sit.set({ x: s.x, y: F + 8, s: 0.94, o: 1 - wake, armF: 10, head: 22, lean: -6 });
        const armF = 60 + turn * 30;
        s.st.set({ x: s.x, y: F + (s.i % 2) * 6, s: 0.94, flip: false, o: wake, armF, armB: 10 + turn * 60, head: -turn * 20, blink: blinkAt(T, s.seed) });
        const [px, py] = palm(s.x, F + (s.i % 2) * 6, 0.94, false, armF);
        pose(s.body, { x: px, y: py, o: wake });
        setFire(s.i, px + WICK[0], py + WICK[1], wake);
      });
      const rk = es(t, 1.35, 1.8);
      pose(rise, { x: 700, y: lerp(560, 260, rk), s: 0.6 + rk * 0.6, r: T * 2, o: rk });
      starL.fade(1 - rk * 0.7);

      S.cam.x = lerp(20, CX, es(t, 0.1, 0.4)) - es(t, 1.0, 1.3) * CX;
      S.cam.y = -es(t, 1.3, 1.7) * 50;
      S.cam.z = 1.06 - es(t, 1.3, 1.7) * 0.05;
    };
  },
};
