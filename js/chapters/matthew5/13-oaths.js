// Mt 5,33–35 — a painted flat. "You shall not swear falsely, but perform your vows to the Lord": the old tablet,
// and a man raising his hand to swear (the scene in old sepia). "But I tell you, do not swear at all": he raises
// his hand to the sky — the clouds part and there, in the light, stands an empty throne of gold: heaven is God's
// throne (no figure, only light). He lowers his hand. He points down — and the round earth comes up under the
// throne as its footstool. He points to Jerusalem on its hill — a crown of light comes down over the city of the
// great King. Each time his hand sinks again.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, cloud, olive, grass, rock } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { SKY, LOOK, oldTablet, goldAnswer, throne, globe, jerusalem, lightCrown, tagWord, man, tr, PI } from './lib.js';

const G = 690;
const THRONE = [800, 350];
const EARTH = [800, 444];
const CITY0 = [1050, 616];

export default {
  id: 'mt5-oaths',
  enter: 'fly',
  beats: [
    { v: 33 },
    { v: 34 },
    { v: 35, text: 'ani na ziemię, bo jest podnóżkiem stóp Jego;' },
    { v: 35, cont: true, text: 'ani na Jerozolimę, bo jest miastem wielkiego Króla.' },
  ],
  cam: { x: [-20, 40], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    // phone: Jerusalem a little smaller and further in, the man off the left edge, the tag parked out of sight
    const CITY = PH ? [940, 616] : CITY0;
    const sk = sky(S, ['#b9cbd4', '#e6e2cf', '#f3e4c6']);
    /* heaven: rays and the throne of light (behind the clouds) */
    const heavenL = S.layer({ par: 0.06, sh: 4 });
    const glow = heavenL.add(`<g><circle r="330" fill="url(#halo-glow)"/><g opacity=".55">${rays(c, { n: 18, r0: 60, r1: 520, spread: 0.045, color: '#fff3cf' })}</g></g>`);
    const thr = heavenL.add(`<g>${throne(c)}</g>`);
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(band(c, { y: 500, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.lavender, 0.2), x0: -1400, x1: 3000 }).markup);
    /* the earth, the footstool */
    const earthL = S.layer({ par: 0.12, sh: 5 });
    const earth = earthL.add(`<g><circle r="120" fill="url(#halo-glow)" opacity=".7"/>${globe(c, 62)}</g>`);
    /* Jerusalem on its hill */
    const cityL = S.layer({ par: 0.2, sh: 3 });
    cityL.add(hillsWith(c, { y: 580, amps: [12, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 18, x0: -1400, x1: 3000 }).markup);
    const cityGlow = cityL.add(`<g><circle r="220" fill="url(#warm-glow)"/></g>`);
    cityL.add(`<g transform="translate(${CITY[0]} ${CITY[1]})">${jerusalem(c, PH ? 0.27 : 0.34, { tglow: false })}</g>`);
    const crown = cityL.add(`<g>${lightCrown(c, 30)}</g>`);
    const cTag = cityL.add(`<g>${tagWord(c, tr('Jerozolima', 'Jerusalem'), { size: 17 })}</g>`);
    const ground = S.layer({ par: 0.3, sh: 3 });
    ground.add(sheet().p(c.cut([[-1400, 650], [3000, 644], [3000, 1800], [-1400, 1800]], 1, 14), mix(C.sand, C.hillNear, 0.4)).out() + olive(c, 280, 680, 0.9) + rock(c, 700, 700, 60, 20) + grass(c, { x0: -600, x1: 2200, y: 650, n: 40, h: 12, color: C.olive }));

    /* the clouds that hide heaven, two banks that part */
    const bank = (dir) => {
      const L = S.layer({ par: 0.08, sh: 5, pad: 700 });
      let m = `<path d="${c.poly(dir < 0 ? [[-1400, -1400], [800, -1400], [800, 330], [-1400, 330]] : [[800, -1400], [3000, -1400], [3000, 330], [800, 330]])}" fill="${mix(C.cream, C.skyBlue, 0.3)}"/>`;
      for (let i = 0; i < 6; i++) m += `<g transform="translate(${800 + dir * (60 + i * 150)} ${370 + (i % 2) * 36}) scale(1.6)">${cloud(c, 200, mix(C.cream, C.skyBlue, 0.25), mix(C.stone, C.skyBlue, 0.3))}</g>`;
      L.add(m);
      return L;
    };
    const bankL = bank(-1), bankR = bank(1);

    /* the man who would swear */
    const P = S.layer({ par: 0.34, sh: 5 });
    const M = S.puppet(P.add(person(c, man(c, { robe: C.ochreRobe, mantle: C.sageRobe }))));

    /* the old wash, the tablet, the answer */
    const wash = S.layer({ par: 0, sh: 1, flat: true });
    wash.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#c9ae86"/>`);
    const top = S.layer({ par: 0.3, sh: 6 });
    const tab = top.add(`<g>${oldTablet(c, tr(['Nie będziesz fałszywie przysięgał,', 'lecz dotrzymasz Panu przysięgi'], ['You shall not make false vows,', 'but shall perform to the Lord your vows']), { w: 440, size: 21 })}</g>`);
    const ans = top.add(`<g>${goldAnswer(c, tr('Wcale nie przysięgajcie', 'Don’t swear at all'), { size: 24 })}</g>`);

    return (t, time) => {
      const T = time;
      /* v33 — the old saying; he swears with his hand raised */
      wash.fade(0.34 * (1 - es(t, 0.9, 1.2)));
      const tk = es(t, -0.1, 0.3, ease.out) * (1 - es(t, 1.0, 1.2));
      pose(tab, { x: 800, y: lerp(-500, 150, tk) - es(t, 1.0, 1.2) * 300, r: Math.sin(T * 0.8) * 1.2, o: tk > 0.01 ? 1 : 0 });
      const ak = es(t, 1.04, 1.26, ease.out) * (1 - es(t, 1.62, 1.85));
      pose(ans, { x: 800, y: lerp(-300, 460, ak) - es(t, 1.62, 1.85) * 500, r: Math.sin(T * 0.9) * 1.2, o: ak > 0.01 ? 1 : 0 });

      /* v34 — heaven opens: the throne of light */
      const part = es(t, 1.3, 1.62);
      bankL.shift(-part * 900, -part * 60);
      bankR.shift(part * 900, -part * 60);
      pose(thr, { x: THRONE[0], y: THRONE[1], s: 0.95, o: 1 });
      pose(glow, { x: THRONE[0], y: THRONE[1] - 100, s: 0.8 + part * 0.2, o: part });
      /* v35a — the earth, His footstool */
      const ek = es(t, 2.1, 2.44, ease.out);
      pose(earth, { x: EARTH[0], y: lerp(640, EARTH[1], ek), r: T * 3, o: ek > 0.01 ? 1 : 0 });
      /* v35b — Jerusalem, the city of the great King */
      const ck = es(t, 3.1, 3.4, ease.out);
      pose(crown, { x: CITY[0] + 40, y: lerp(-200, CITY[1] - 150, ck), s: 0.9 + Math.sin(T * 1.4) * 0.03, o: ck > 0.01 ? 1 : 0 });
      pose(cityGlow, { x: CITY[0] + 40, y: CITY[1] - 60, o: ck * 0.8 });
      pose(cTag, { x: CITY[0] + 40, y: lerp(PH ? -600 : -300, CITY[1] - 214,   // above the crown, not behind the ground
         es(t, 3.2, 3.45, ease.back)), r: Math.sin(T * 1.1) * 2 });

      /* the man: swears (v33); begins to swear by heaven / earth / Jerusalem and each time lowers his hand */
      const oath = es(t, 0.2, 0.4) * (1 - es(t, 0.9, 1.1));
      const byHeaven = bump(t, 1.12, 1.66), byEarth = bump(t, 2.1, 2.62), byCity = bump(t, 3.12, 3.62);
      M.set({ x: PH ? 576 : 540, y: G + 6, s: 1.02, armB: oath * 150 + byHeaven * 140 + byCity * 30, armF: 20 + byEarth * 30 + byCity * 80, head: -oath * 6 - byHeaven * 18 + byEarth * 12 - byCity * 4 + es(t, 1.6, 1.8) * 6 * (1 - es(t, 2.0, 2.1)), blink: blinkAt(T, 1) });

      S.cam.y = -30 * es(t, 1.2, 1.6) + es(t, 2.9, 3.4) * 20;
      S.cam.x = es(t, 2.9, 3.4) * 30;
      S.cam.z = 1.02;
    };
  },
};
