// Mt 23,33–34 — back in the Temple court, the afternoon light turning gold. Jesus faces the scribes and Pharisees:
// "You serpents, brood of vipers!" — on the wall of the porch behind them their shadows stretch and curl into snakes.
// "I send you prophets, wise men and scribes": from behind Him three messengers come out into the light — a prophet in a
// rough cloak with a staff, a wise man, a scribe with his scroll — and go towards them. Then, told only in shadow-play on
// a paper screen that comes down from the flies: a cross on a hill, a whip raised over a bowed back, a man running from
// one town to the next. Jesus bows His head.
import { C, person, CAST, blinkAt, pose, lerp, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { templeCourt, EVENING, voiceRings, pose3, folk, vain, PH, SC, pharisees, scribes, snakeShadow, shadowPerson, bakeArms, scrollOpen, stick, TWELVE, PI } from './lib.js';
import { shadowScreen } from '../mark13/lib.js';

const JX0 = 780;
const INK = '#3b2a22';
const PROPHET = { robe: mix(C.clay, C.wood3, 0.5), mantle: C.wood2, hair: C.greyHair, hairStyle: 'wild', beard: 'wild', beardColor: C.greyHair, skin: C.skin3, belt: C.rope };
const WISE = { robe: C.tealRobe, mantle: C.ochreRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.cream, veil2: C.ochre, beard: 'full', beardColor: '#e9e2d6', skin: C.skin2 };
const GOOD = { robe: C.dustyBlue, mantle: C.linen2, hair: C.hair2, hairStyle: 'wrap', veil: C.linen, beard: 'short', skin: C.skin };

export default {
  id: 'mt23-sent',
  beats: [
    { v: 33 },
    { v: 34, text: 'Dlatego oto Ja posyłam do was proroków, mędrców i uczonych.' },
    { v: 34, cont: true, text: 'Jednych z nich zabijecie i ukrzyżujecie; innych będziecie biczować w swych synagogach i przepędzać z miasta do miasta.' },
  ],
  cam: { x: [-10, 30], y: [-40, 10], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    // phone: the four leaders (the "brood of vipers" and their serpent shadows) stand inside the screen instead of
    // off its right edge; Jesus, His three and the messengers move left with them
    const PH_ = S.portrait;
    const JX = PH_ ? 735 : JX0;
    const LX = PH_ ? [935, 985, 1035, 1080] : [1060, 1140, 1220, 1300];
    const SS = PH_ ? 0.92 : 1;   // phone: the shadow-play screen a little narrower, its right end clear of the progress thread
    const set = templeCourt(S, { skyCols: EVENING, sunY: 250 });
    const F = set.FLOOR;

    /* the serpents: the leaders' shadows on the porch wall */
    const wall = S.layer({ par: 0.45, sh: 1, flat: true });
    const SNAKES = LX.map((x, i) => ({ x, i, el: wall.add(`<g>${snakeShadow(c, 230, INK)}</g>`) }));

    const stepL = S.layer({ par: 0.45, sh: 4 });
    stepL.sprite(pose3(c, Array.from({ length: 5 }, (_, i) => ({ x: i * 52 + c.rr(-6, 6), y: c.rr(-3, 3), s: 0.66, flip: false, head: c.rr(-6, 2), o: { ...folk(c), pose: 'sit' } }))), 330, 604);

    /* the leaders */
    const P = S.layer({ par: 0.5, sh: 5 });
    const LEAD = [[LX[0], PH, 0], [LX[1], SC, 8], [LX[2], pharisees(2), 2], [LX[3], scribes(1), 10]].map(([x, o, dy], i) => ({ x, y: F + dy, i, seed: c.rr(0, 9), p: S.puppet(P.add(vain(c, o))) }));
    P.sprite(pose3(c, [TWELVE[0].o, TWELVE[2].o, TWELVE[1].o].map((o, i) => ({ x: -i * 64, y: (i % 2) * 10, s: 0.92, flip: false, head: -4, o }))), PH_ ? 590 : 560, F + 10);
    /* the three sent */
    const SENT = [[PROPHET, { holdF: `<g transform="translate(0 -6)">${stick(c, 170)}</g>` }], [WISE, {}], [GOOD, { holdF: `<g transform="translate(4 8) rotate(-70)">${scrollOpen(c, 44, 30)}</g>` }]].map(([o, x], i) => ({ i, p: S.puppet(P.add(person(c, { ...o, ...x }))) }));
    const light = P.add(`<g><circle r="160" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, r: 30, w: 5, color: C.clay });

    /* the shadow-play screen */
    const scrL = S.layer({ par: 0.3, sh: 5 });
    const W = 640, H = 190;
    const sil = (o, arms = [0, 0], extra = '') => bakeArms(shadowPerson(c, o, INK), arms[0], arms[1]) + extra;
    const cross = `<path d="${c.cut([[-4, 0], [-4, -120], [4, -120], [4, 0]], 0.3, 4) + c.cut([[-34, -96], [34, -96], [34, -88], [-34, -88]], 0.3, 4)}" fill="${INK}"/><path d="${c.cut([[-70, 6], [-30, -14], [30, -16], [70, 6]], 0.8, 6)}" fill="${INK}"/>`;
    const whip = `<path d="${c.ribbon([[0, 0], [30, -40], [60, -30], [80, -4]], 2.6)}" fill="${INK}"/>`;
    const town = (x) => `<path d="${c.cut([[x - 36, 0], [x - 36, -26], [x - 20, -26], [x - 20, -40], [x + 4, -40], [x + 4, -30], [x + 34, -30], [x + 34, 0]], 0.3, 4)}" fill="${INK}"/>`;
    const inner = shadowScreen(c, W, H)
      + `<g transform="translate(${-W / 2 + 90} ${H - 14})">${cross}</g>`
      + `<g transform="translate(-40 ${H - 14}) scale(.5)">${sil({ robe: INK, hairStyle: 'short', beard: 'full' }, [120, 150])}</g>`
      + `<g transform="translate(30 ${H - 14}) scale(-.5 .5)">${sil({ robe: INK, hairStyle: 'wild', beard: 'wild', pose: 'kneel' }, [20, 10])}</g>`
      + `<g transform="translate(-40 ${H - 110})">${whip}</g>`
      + `<g transform="translate(0 ${H - 14})">${town(W / 2 - 170)}${town(W / 2 - 40)}</g>`;
    const screen = scrL.add(`<g>${inner}</g>`);
    const runner = scrL.add(`<g>${sil({ robe: INK, hairStyle: 'wild', beard: 'short' }, [60, 60])}</g>`);

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v33 — Jesus rebukes; the shadows on the wall become serpents */
      const rebuke = es(t, 0.05, 0.3) * (1 - es(t, 0.95, 1.15));
      const send = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.1));
      const grief = es(t, 2.3, 2.6);
      jesus.set({ x: JX, y: F, s: 1.04, armF: 30 + rebuke * 60 + send * 40 - grief * 20, armB: 10 + rebuke * 20 + send * 60, head: -rebuke * 4 + grief * 16, blink: blinkAt(T) });
      voice(JX + 28, F - 182, rebuke + send * 0.7 + bump(t, 2.02, 2.6) * 0.5, T, { dir: 1 });
      SNAKES.forEach((s) => {
        const k = es(t, 0.2 + s.i * 0.08, 0.5 + s.i * 0.08);
        pose(s.el, { x: s.x + 30, y: F - 10, sx: -1, sy: 0.4 + k * 0.6, o: k * 0.45 * (1 - es(t, 1.2, 1.5)) });
      });
      LEAD.forEach((l) => {
        const hiss = bump(t, 0.3, 0.95);
        l.p.set({ x: l.x, y: l.y, s: 0.94, flip: true, armF: 30 + hiss * 30, armB: 20, head: -hiss * 8, lean: -hiss * 4, blink: blinkAt(T, l.seed) });
      });

      /* v34a — the three sent come out from behind Him into the light and go towards them */
      SENT.forEach((m) => {
        const k = es(t, 1.08 + m.i * 0.1, 1.6 + m.i * 0.1);
        const x = lerp(JX - 40, PH_ ? 805 + m.i * 45 : 880 + m.i * 50, k);
        const fade = es(t, 2.04, 2.14);
        m.p.set({ x, y: F + 14 + m.i * 4, s: 0.9, walk: k > 0.02 && k < 0.98 ? x * 0.05 + m.i : undefined, armF: 30 + (m.i === 1 ? 40 : 10), head: -4 + fade * 16, o: es(t, 1.05 + m.i * 0.1, 1.15 + m.i * 0.1) * (1 - fade), blink: blinkAt(T, m.i + 3) });
      });
      pose(light, { x: PH_ ? 830 : 890, y: F - 110, o: bump(t, 1.05, 2.2) * 0.8 });

      /* v34b — the shadow-play */
      const sk = es(t, 2.02, 2.28, ease.out);
      pose(screen, { x: 800, y: lerp(-500, 140, sk), s: SS, o: sk > 0.01 ? 1 : 0 });
      const run = seg(t, 2.35, 2.95);
      pose(runner, { x: 800 + (W / 2 - 165 + run * 120) * SS, y: lerp(-500, 140, sk) + (H - 14) * SS, s: 0.42 * SS, o: sk > 0.9 ? 1 : 0 });

      S.cam.y = -es(t, 1.9, 2.3) * 30;
      S.cam.x = 10;
      S.cam.z = 1.02;
    };
  },
};
