// Mt 5,38–39 — a painted flat. "An eye for an eye and a tooth for a tooth": the old tablet, and under it a pair of
// scales with an eye in each pan and a tooth in each pan, evenly balanced, while two men below raise their fists
// at each other (the scene in old sepia). "But I tell you, do not resist the evildoer": the scales are taken up,
// and the man on the right lowers his fist and opens his hand. "If anyone strikes you on the right cheek": a lit
// shadow-play screen comes down — a shadow hand strikes a shadow face; the man does not strike back, but calmly
// turns and offers the other cheek.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, grass, house } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { SKY, LOOK, oldTablet, goldAnswer, shadowScreen, shadowPerson, paperEye, man, tr, PI, STRING } from './lib.js';

const G = 690;
const AX = 640, BX = 960;
const SCR = [800, 150], SW = 460, SH = 270;

function tooth(c) {
  return sheet().p(c.cut([[-10, -12], [10, -12], [12, -2], [8, 12], [4, 4], [0, 10], [-4, 4], [-8, 12], [-12, -2]], 0.3, 3), C.linen).out();
}
function scalesBeam(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-120, -4, 240, 8), 0.3, 6), C.sun);
  s.x('M-112 0L-138 60M-112 0L-86 60M112 0L86 60M112 0L138 60', 'none', `stroke="${STRING}" stroke-width="1.2"`);
  s.p(c.cut(c.arc(-112, 60, 32, 14, 0, PI, 10), 0.3, 4) + c.cut(c.arc(112, 60, 32, 14, 0, PI, 10), 0.3, 4), C.sun);
  s.p(c.cut(c.circ(0, 0, 8, 10), 0.2, 3), shade(C.sun, -0.2));
  return `<path d="M0 -2400V-6" stroke="${STRING}" stroke-width="1.3" fill="none"/>${s.out()}<g transform="translate(-122 50) scale(.9)">${paperEye(c, 26)}</g><g transform="translate(-98 50) scale(.8)">${tooth(c)}</g><g transform="translate(102 50) scale(.9)">${paperEye(c, 26)}</g><g transform="translate(126 50) scale(.8)">${tooth(c)}</g>`;
}

export default {
  id: 'mt5-cheek',
  enter: 'fly',
  beats: [
    { v: 38 },
    { v: 39, text: 'A Ja wam powiadam: Nie stawiajcie oporu złemu.' },
    { v: 39, cont: true, text: 'Lecz jeśli cię kto uderzy w prawy policzek, nadstaw mu i drugi!' },
  ],
  cam: { x: [-20, 20], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, SKY.gold);
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 480, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.dune, 0.25), x0: -1400, x1: 3000 }).markup);
    const mid = S.layer({ par: 0.16, sh: 3 });
    mid.add(hillsWith(c, { y: 540, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.dune, 0.2), trees: 14, treeColor: C.olive, treeH: 18, x0: -1400, x1: 3000 }).markup + house(c, 250, 560, 80, 56) + house(c, 1300, 556, 90, 60));
    const ground = S.layer({ par: 0.3, sh: 3 });
    ground.add(sheet().p(c.cut([[-1400, 620], [3000, 612], [3000, 1800], [-1400, 1800]], 1, 14), mix(C.sand, C.hillNear, 0.35)).out() + olive(c, 380, 650, 0.9) + cypress(c, 1240, 640, 120) + grass(c, { x0: -600, x1: 2200, y: 620, n: 40, h: 12, color: C.olive }));

    /* the two men */
    const P = S.layer({ par: 0.34, sh: 5 });
    const A = S.puppet(P.add(person(c, man(c, { robe: C.clayMantle, mantle: C.plumRobe }))));
    const B = S.puppet(P.add(person(c, LOOK.shepherd)));

    /* the shadow screen (v39b) */
    const fly = S.layer({ par: 0.3, sh: 6 });
    const scr = fly.add(`<g>${shadowScreen(c, SW, SH)}</g>`);
    const SHC = mix(C.soilDark, C.ink, 0.4);
    const sA = S.puppet(fly.add(shadowPerson(c, { hairStyle: 'short', beard: 'full' }, SHC)));
    const sB = S.puppet(fly.add(shadowPerson(c, { hairStyle: 'curly', beard: 'none' }, SHC)));
    const arrow = fly.add(`<g>${sheet().p(c.ribbon(c.arc(0, 0, 30, 22, PI * 1.15, PI * 1.85, 12), 5), C.halo).p(c.cut([[22, -24], [36, -10], [16, -8]], 0.2, 3), C.halo).out()}</g>`);
    const star = fly.add(`<g><path d="${c.poly(c.star(0, 0, 18, 6, 8, 0.2))}" fill="${C.sunDeep}" opacity=".8"/></g>`);

    /* the old wash, the tablet and the scales, the answer */
    const wash = S.layer({ par: 0, sh: 1, flat: true });
    wash.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#c9ae86"/>`);
    const top = S.layer({ par: 0.3, sh: 6 });
    const tab = top.add(`<g>${oldTablet(c, tr(['Oko za oko,', 'ząb za ząb'], ['An eye for an eye,', 'a tooth for a tooth']), { w: 320, size: 24 })}</g>`);
    const sc = top.add(`<g>${scalesBeam(c)}</g>`);
    const ans = top.add(`<g>${goldAnswer(c, tr('Nie stawiajcie oporu złemu', 'Don’t resist him who is evil'), { size: 22 })}</g>`);

    return (t, time) => {
      const T = time;
      /* v38 — the old law, the even scales, fists raised */
      wash.fade(0.34 * (1 - es(t, 0.9, 1.2)));
      const tk = es(t, -0.1, 0.3, ease.out) * (1 - es(t, 1.0, 1.2));
      pose(tab, { x: 800, y: lerp(-500, 130, tk) - es(t, 1.0, 1.2) * 300, r: Math.sin(T * 0.8) * 1.2, o: tk > 0.01 ? 1 : 0 });
      const sk = es(t, 0.15, 0.45, ease.out) * (1 - es(t, 1.1, 1.35));
      pose(sc, { x: 800, y: lerp(-400, 340, sk) - es(t, 1.1, 1.35) * 400, r: Math.sin(T * 1.3) * 3 * sk, o: sk > 0.01 ? 1 : 0 });
      const ak = es(t, 1.06, 1.3, ease.out) * (1 - es(t, 1.9, 2.1));
      pose(ans, { x: 800, y: lerp(-300, 200, ak) - es(t, 1.9, 2.1) * 300, r: Math.sin(T * 0.9) * 1.2, o: ak > 0.01 ? 1 : 0 });

      /* v39a — he lowers his fist and opens his hand */
      const fist = es(t, 0.3, 0.5);
      const lower = es(t, 1.3, 1.55);
      A.set({ x: AX, y: G, s: 1.0, armB: fist * 112, armF: 30 + fist * 30, lean: fist * 4, head: -2, blink: blinkAt(T, 1) });
      B.set({ x: BX, y: G + 4, s: 1.0, flip: true, armB: fist * 112 * (1 - lower), armF: 30 + fist * 30 * (1 - lower) + lower * 40, lean: fist * 4 * (1 - lower), head: lower * 6, blink: blinkAt(T, 2) });

      /* v39b — the shadow screen: struck on the cheek, he turns the other */
      const dk = es(t, 2.04, 2.3, ease.out);
      const sy = lerp(-500, SCR[1], dk) + Math.sin(T * 0.8) * 2;
      const on = dk > 0.01 ? 1 : 0;
      pose(scr, { x: SCR[0], y: sy, o: on });
      const strike = bump(t, 2.28, 2.46);
      const turn = es(t, 2.52, 2.62);
      sA.set({ x: SCR[0] - 80, y: sy + SH - 10, s: 1.02, armF: 20 + strike * 80, lean: strike * 8, o: on });
      sB.set({ x: SCR[0] + 70, y: sy + SH - 10, s: 1.02, flip: true, head: -strike * 16 + turn * 14, lean: -strike * 6, armF: 20 + turn * 30, armB: turn * 20, o: on });
      pose(arrow, { x: SCR[0] + 60, y: sy + SH - 220, s: turn, o: turn > 0.01 ? on : 0 });
      pose(star, { x: SCR[0] + 44, y: sy + SH - 180, s: strike * 1.2, r: T * 30, o: strike > 0.05 ? on : 0 });

      S.cam.z = 1.02;
      S.cam.y = -14;
    };
  },
};
