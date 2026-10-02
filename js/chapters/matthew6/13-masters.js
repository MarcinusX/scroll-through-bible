// Mt 6,24 — a servant with a jug stands between two masters, one on each side of the stage, and each has him on a
// cord tied to his wrist: pulled both ways, he is stretched and cannot go. "He will hate the one and love the
// other": he turns to one — a heart — and his back to the other, then the other way round. "You cannot serve God and
// Mammon": the masters fade, and in their places stand what they were — on the left the light of God, on the right
// Mammon, a fat gilded idol of money-bags and coins; the gold chain to his wrist snaps, and he turns to the light.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { QUIET, heart, coin, fatherLight, rayBurst, handAt, headAt, tr, PI } from './lib.js';
import { jug } from '../mark2/lib.js';

const GY = 712;
const SX = 800;                 // the servant
const LM0 = 560, RM0 = 1040;    // the two masters

/** a cord (unit length 100 along +x); pose it with r and sx = len / 100 */
function cord(c, col = C.rope, w = 4) { return `<path d="${c.ribbon([[0, 0], [100, 0]], w)}" fill="${col}"/>`; }
function goldChain(c) {
  let d = '';
  for (let i = 0; i < 10; i++) d += c.cut(c.ell(i * 10 + 5, 0, 7, 4, 10), 0.1, 3) + c.hole(c.ell(i * 10 + 5, 0, 3.6, 1.6, 8), 0.1, 3);
  return sheet().p(d, C.sun).out();
}
/** Mammon: a squat gilded idol of money-bags with coin eyes and a crown (origin: its plinth's foot) */
function mammon(c) {
  const g = mix(C.sun, C.ochre, 0.35), g2 = shade(g, -0.18);
  const s = sheet();
  s.p(c.cut(c.rect(-90, -50, 180, 50), 0.4, 6), mix(C.rock2, C.plumRobe, 0.2));
  s.p(c.cut([[-24, -50], [-80, -80], [-96, -140], [-70, -210], [-30, -236], [30, -236], [70, -210], [96, -140], [80, -80], [24, -50]], 0.8, 6), g);
  s.p(c.ribbon([[-40, -232], [40, -232]], 12), g2);
  s.p(c.cut(c.ell(0, -276, 44, 40, 20), 0.5, 5), g);
  s.p(c.cut([[-34, -306], [-38, -338], [-22, -318], [-10, -344], [0, -320], [10, -344], [22, -318], [38, -338], [34, -306]], 0.4, 4), shade(C.sun, 0.1));
  s.x(c.poly(c.circ(-16, -280, 9, 12)) + c.poly(c.circ(16, -280, 9, 12)), C.sun);
  s.x(c.poly(c.circ(-16, -280, 4, 8)) + c.poly(c.circ(16, -280, 4, 8)), g2);
  s.x(c.ribbon([[-14, -258], [14, -258]], 2.6), g2);
  let coins = '';
  for (let i = 0; i < 14; i++) coins += c.cut(c.circ(c.rr(-70, 70), c.rr(-200, -70), c.rr(6, 10), 10), 0.2, 3);
  s.x(coins, shade(C.sun, 0.2), 'opacity=".8"');
  s.x(c.ribbon([[-60, -120], [60, -118]], 3) + c.ribbon([[-70, -170], [70, -168]], 3), g2, 'opacity=".6"');
  return s.out();
}

export default {
  id: 'mt6-masters',
  enter: 'fly',
  beats: [
    { v: 24, text: 'Nikt nie może dwom panom służyć.' },
    { v: 24, cont: true, text: 'Bo albo jednego będzie nienawidził, a drugiego będzie miłował; albo z jednym będzie trzymał, a drugim wzgardzi.' },
    { v: 24, cont: true, text: 'Nie możecie służyć Bogu i Mamonie.' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [0.98, 1.16] },
  build(S) {
    const c = S.c;
    // phone: the masters (and the light and Mammon in their places) stand closer in, Mammon clear of the thread
    const LM = S.portrait ? 610 : LM0, RM = S.portrait ? 985 : RM0;
    sky(S, ['#d6cdbd', '#efe0c4', '#f6e7cc']);
    const back = S.layer({ par: 0.1, sh: 2 });
    const bs = sheet();
    for (let i = 0; i < 9; i++) bs.p(c.cut([[-900 + i * 420, -900], [-700 + i * 420, -900], [-680 + i * 420, 760], [-900 + i * 420, 760]], 1, 30), i % 2 ? mix(C.parchment, C.dawn, 0.35) : mix(C.parchment, C.sand, 0.3));
    back.add(bs.out());
    const floor = S.layer({ par: 0.3, sh: 3 });
    floor.add(sheet().p(c.cut([[-1100, GY - 30], [2700, GY - 30], [2700, 1900], [-1100, 1900]], 0.5, 20), mix(C.wood3, C.sand, 0.4)).out());

    /* what they really are: the light of God (left), Mammon (right) */
    const trueL = S.layer({ par: 0.3, sh: 5 });
    const godLight = trueL.add(`<g><g transform="scale(1.4)">${rayBurst(c, { n: 22, r0: 50, r1: 420, spread: 0.05, color: '#fff3cf', o: 0.6 })}</g>${fatherLight(c, 64)}</g>`);
    const idol = trueL.add(`<g><circle cy="-200" r="200" fill="url(#warm-glow)" opacity=".35"/>${mammon(c)}</g>`);

    /* the masters, the servant, the cords */
    const act = S.layer({ par: 0.3, sh: 5 });
    const mL = S.puppet(act.add(person(c, { robe: C.tealRobe, mantle: C.dustyBlue, skin: C.skin2, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.teal2, beard: 'full', beardColor: C.greyHair, belt: C.leather })));
    const mR = S.puppet(act.add(person(c, { robe: C.wheatRobe, mantle: C.terracotta, skin: C.skin3, hair: C.hair3, hairStyle: 'short', beard: 'full', belt: C.sun })));
    const cordL = act.add(`<g>${cord(c)}</g>`), cordR = act.add(`<g>${cord(c)}</g>`);
    const chainR = act.add(`<g>${goldChain(c)}</g>`);
    const chainBits = [0, 1].map(() => act.add(`<g>${goldChain(c)}</g>`));
    const sv = S.puppet(act.add(person(c, { ...QUIET, robe: C.linen2, holdB: `<g transform="translate(0 10) rotate(-20)">${jug(c)}</g>` })));
    const love = act.add(`<g>${heart(c, 16)}</g>`);
    const scorn = act.add(`<g>${sheet().p(c.cut([[-18, 0], [-6, -10], [6, -4], [18, -12], [12, 6], [-10, 8]], 0.6, 4), mix(C.storm, C.stone2, 0.3)).out()}</g>`);

    return (t, time) => {
      const T = time;
      /* v24a — pulled both ways */
      const pull = es(t, 0.15, 0.45) * (1 - es(t, 0.95, 1.1));
      const tug = T ? Math.sin(T * 2.2) : 0;
      const side = t < 1 ? 0 : t < 1.5 ? -1 : 1;              // v24b: whom he turns to
      const sw = es(t, 1.05, 1.2) - es(t, 1.45, 1.6) * 2 + es(t, 1.45, 1.6) * 0;
      const lean = pull * tug * 6 + (t > 1 && t < 2 ? (t < 1.5 ? -1 : 1) * 10 * es(t, 1.05, 1.2) : 0);
      const godK = es(t, 2.05, 2.4);
      const snap = es(t, 2.45, 2.55);
      const toLight = es(t, 2.55, 2.8);
      const flip = t < 1 ? false : t < 1.5 ? true : t < 2.5 ? false : true;
      const svx = SX + (t < 1 ? pull * tug * 14 : (t < 1.5 ? -40 : 40) * es(t, 1.05, 1.25)) - toLight * 90;
      sv.set({ x: svx, y: GY, s: 1.02, flip, armF: 70 + pull * 20, armB: 70 + pull * 20, lean: -lean * (flip ? -1 : 1), head: pull * tug * 6 - toLight * 10, blink: blinkAt(T, 2), walk: toLight > 0 && toLight < 1 ? t * 30 : undefined });
      const fade1 = 1 - godK;
      mL.set({ x: LM, y: GY, s: 1.02, flip: false, armF: 60 + pull * 20 + bump(t, 1.05, 1.45) * 20, armB: 20, lean: -pull * 8, blink: blinkAt(T, 1), o: fade1 });
      mR.set({ x: RM, y: GY, s: 1.02, flip: true, armF: 60 + pull * 20 + bump(t, 1.5, 1.95) * 20, armB: 20, lean: -pull * 8, blink: blinkAt(T, 3), o: fade1 });
      // the cords run from each master's hand (or the light / the idol) to the servant's wrists
      const [lx, ly] = handAt(LM, GY, 1.02, false, 60 + pull * 20);
      const [rx, ry] = handAt(RM, GY, 1.02, true, 60 + pull * 20);
      const [ax, ay] = handAt(svx, GY, 1.02, flip, 70 + pull * 20);
      const [bx, by] = [svx + (flip ? 16 : -16), ay + 4];
      const wl = flip ? [ax, ay] : [bx, by], wr = flip ? [bx, by] : [ax, ay];
      const L0 = [lerp(lx, LM, godK), lerp(ly, 360, godK)], R0 = [lerp(rx, RM - 30, godK), lerp(ry, GY - 150, godK)];
      const put = (el, [x0, y0], [x1, y1], o) => pose(el, { x: x0, y: y0, r: (Math.atan2(y1 - y0, x1 - x0) * 180) / PI, sx: Math.hypot(x1 - x0, y1 - y0) / 100, o });
      put(cordL, L0, wl, 1 - godK * 0.2);
      put(cordR, R0, wr, fade1);
      put(chainR, R0, wr, godK * (1 - snap));
      chainBits.forEach((b, i) => {
        const k = es(t, 2.5, 2.9, ease.in);
        const [x0, y0] = i ? R0 : wr;
        pose(b, { x: x0 + (i ? -10 : 10) * k * 10, y: y0 + k * 120, r: (i ? 60 : -80) * k, sx: 0.5, o: snap * (1 - es(t, 2.85, 2.95)) });
      });
      // love and scorn
      const [hx, hy] = headAt(svx, GY, 1.02, flip);
      const lk = t > 1 && t < 2 ? bump(t, side < 0 ? 1.08 : 1.52, side < 0 ? 1.48 : 1.96) : bump(t, 2.6, 2.98);
      pose(love, { x: hx + (flip ? -46 : 46), y: hy - 30 - lk * 10, s: lk, o: lk > 0.02 ? 1 : 0 });
      const sk = t > 1 && t < 2 ? lk : 0;
      pose(scorn, { x: hx + (flip ? 50 : -50), y: hy - 20, s: sk, o: sk > 0.02 ? 1 : 0 });

      /* v24c — God (light) and Mammon (the idol) */
      pose(godLight, { x: LM, y: 360, s: 0.5 + godK * 0.5, o: godK });
      pose(idol, { x: RM + 10, y: GY, s: 0.6 + godK * 0.4, o: godK });

      S.cam.z = 1.1 + pull * 0.03 - godK * 0.06;
      S.cam.y = 30 - godK * 30;
      S.cam.x = (t > 1 && t < 2 ? (t < 1.5 ? -1 : 1) * 14 * es(t, 1.05, 1.25) : 0);
    };
  },
};
