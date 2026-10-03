// Łk 1,56–58 — three moons come out over Zechariah's house; Mary embraces Elizabeth and sets off for home. Then
// Elizabeth's time comes: at night the window glows, and she sits in her doorway with her newborn son in her arms,
// old Zechariah beside her. In the morning the neighbours and relatives come up the road, lifting their hands,
// and rejoice with her.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun } from '../../assets/nature.js';
import {
  MARY, ELIZABETH, zechMute, HILLDAY, HILLEVE, HILLNIGHT, hillHome, homeLight, hillFront, HGY, moonDisc, johnInArms, glowDisc, rayBurst, sparkle,
  heart, plainHeart, folk, tr, es, ease, bump, seg, PI,
} from './lib.js';

const EX = 740;

export default {
  id: 'lk1-born',
  beats: [
    { v: 56 },
    { v: 57 },
    { v: 58 },
  ],
  cam: { x: [-30, 30], y: [-30, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;   // phone: Mary is still seen leaving; the neighbours stop inside the screen
    const MORN = ['#d7e0d8', '#f5e2c4', '#f8ead2'];
    const W = hillHome(S, HILLEVE);
    const sunEl = hanging(W.hangL, sun(c, 42), { x: 1180, y: -1500, len: 800 });
    const moons = [0, 1, 2].map((i) => ({ i, el: hanging(W.G, moonDisc(c, 22), { x: 0, y: -1500, len: 800 }) }));
    const bGlow = W.G.add(`<g>${glowDisc(160, 'warm-glow', 0.85)}${rayBurst(c, { n: 16, r0: 60, r1: 170, spread: 0.03, color: '#fff0c8', o: 0.18 })}</g>`);
    const P = W.P;
    const m = S.puppet(P.add(person(c, MARY)));
    const e = S.puppet(P.add(person(c, ELIZABETH)));
    const eB = S.puppet(P.add(person(c, { ...ELIZABETH, pose: 'sit', holdF: johnInArms(c) })));
    const z = S.puppet(P.add(zechMute(c)));
    // neighbours and relatives, hands lifted (whole groups), coming along the road
    const crowdL = S.layer({ par: 0.45, sh: 5 });
    const raise = (mk) => mk.replace(/class="armBr"/, 'class="armBr" transform="rotate(-150)"').replace(/class="armFr"/, 'class="armFr" transform="rotate(-70)"');
    const grp = (n, dir) => { const mem = []; for (let i = 0; i < n; i++) mem.push({ x: i * (PH ? 42 : 58) + c.rr(-8, 8), y: (i % 2) * 20, s: 0.86 * c.rr(0.94, 1.04), flip: dir < 0, o: folk(c) }); return mem.sort((a, b) => a.y - b.y).map((mm) => `<g transform="translate(${mm.x.toFixed(1)} ${mm.y.toFixed(1)}) scale(${mm.flip ? -mm.s : mm.s} ${mm.s})">${raise(person(c, { ...mm.o, holdF: '', holdB: '' }))}</g>`).join(''); };
    const left = crowdL.sprite(grp(3, -1), 760, 770);
    const right = crowdL.sprite(grp(3, -1), 1080, 770);
    const up = S.layer({ par: 0.3, sh: 6 });
    const hearts = [0, 1, 2, 3, 4, 5].map((i) => up.add(`<g>${plainHeart(c, 10, [C.jesusMantle, C.roseRobe][i % 2])}</g>`));
    hillFront(S);

    return (t, time) => {
      const T = time;
      /* v56: three months; Mary goes home */
      const night = es(t, 1.0, 1.25), morn = es(t, 2.0, 2.3);
      if (morn > 0) W.sk.blend(HILLNIGHT, MORN, morn); else W.sk.blend(HILLEVE, HILLNIGHT, night);
      W.starL.fade(night * (1 - morn));
      W.dim.fade(night * (1 - morn));
      swing(sunEl, PH ? 1020 : 1180, lerp(-1500, 170, morn), T, 1, 0.7);   // phone: the sun inside the screen, clear of the thread
      moons.forEach((mo) => { const k = es(t, 0.05 + mo.i * 0.12, 0.25 + mo.i * 0.12, ease.out) * (1 - es(t, 1.9, 2.1, ease.in)); swing(mo.el, 680 + mo.i * 120, lerp(-1500, 190 + (mo.i % 2) * 22, k), T, 1.2, 0.7, mo.i); });
      const go = PH ? es(t, 0.6, 1.0) : es(t, 0.5, 0.95);
      const hug = bump(t, 0.1, 0.5);
      m.set({ x: lerp(880, 1450, go), y: HGY, s: 0.96, flip: go > 0.02 ? false : true, walk: go > 0 && go < 1 ? t * 28 : undefined, armF: 20 + hug * 60, armB: 10, blink: blinkAt(T, 3) });
      const born = es(t, 1.25, 1.35);
      e.set({ x: EX, y: HGY, s: 0.96, flip: false, o: 1 - born, armF: 20 + hug * 60 + bump(t, 0.6, 1.0) * 60, armB: 10 + bump(t, 0.6, 1.0) * 40, blink: blinkAt(T, 1) });

      /* v57: she gives birth to a son */
      homeLight(W.H, { open: born, lit: es(t, 1.05, 1.3) });
      eB.set({ x: W.H.doorX + (PH ? 140 : 90), y: HGY, s: 0.96, flip: false, o: born, armF: 70, armB: 30, head: 12, blink: blinkAt(T, 1) });
      z.set({ x: W.H.doorX + (PH ? 240 : 190), y: HGY, s: 1, flip: true, o: born, armF: 30 + es(t, 2.3, 2.6) * 30, armB: 10, head: 10, blink: blinkAt(T, 2) });
      pose(bGlow, { x: W.H.doorX + (PH ? 160 : 110), y: HGY - 70, s: 0.5 + born * 0.6, r: t * 3, o: born });

      /* v58: the neighbours and relatives come and rejoice with her */
      const come = es(t, 2.1, 2.5, ease.out);
      left.set({ x: lerp(1900, PH ? 805 : 830, come), y: 770, o: come > 0.01 ? 1 : 0 });
      right.set({ x: lerp(2200, PH ? 945 : 1110, come), y: 770, o: come > 0.01 ? 1 : 0 });
      hearts.forEach((h, i) => { const kk = seg(t, 2.4 + i * 0.06, 2.95 + i * 0.06); pose(h, { x: 520 + i * 100, y: 520 - kk * 120, s: 0.6 + bump(t, 2.4 + i * 0.06, 2.95 + i * 0.06) * 0.6, o: bump(t, 2.4 + i * 0.06, 2.95 + i * 0.06) }); });

      S.cam.z = 1.03 + es(t, 1.1, 1.5) * 0.03;
      S.cam.y = 20;
    };
  },
};
