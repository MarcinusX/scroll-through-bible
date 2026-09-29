// Mt 23,8–10 — back in the court, Jesus among six of the Twelve. A tag that says "Rabbi" comes down on its string to
// Peter, who reaches for it — Jesus shakes His head and it flies away; the disciples take one another's hands, and
// above them a strip of folded paper opens into a chain of paper dolls holding hands: "you are all brothers", with one
// Teacher in the middle. Then light pours down from above and they look up: "one is your Father, He who is in heaven"
// (light only). Last, they all turn to Him; His halo glows: "one is your Master, the Christ".
import { C, person, CAST, blinkAt, pose, lerp, hanging } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { secretShaft } from '../matthew6/lib.js';
import { templeCourt, voiceRings, nameTag, pose3, folk, dollChain, hang2, TWELVE, glory, tr } from './lib.js';

const JX = 800;

export default {
  id: 'mt23-brothers',
  beats: [
    { v: 8 },
    { v: 9 },
    { v: 10 },
  ],
  cam: { x: [-20, 20], y: [-60, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;

    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitRow = (n, flip) => pose3(c, Array.from({ length: n }, (_, i) => ({ x: i * 52 + c.rr(-6, 6), y: c.rr(-3, 3), s: 0.66 * c.rr(0.94, 1.05), flip, head: c.rr(-6, 2), o: { ...folk(c), pose: 'sit' } })));
    stepL.sprite(sitRow(5, false), 360, 604);
    stepL.sprite(sitRow(5, true), 1010, 604);

    /* the paper-doll chain, folded up at first */
    const flyL = S.layer({ par: 0.3, sh: 5 });
    const chain = flyL.add(`<g>${hang2(`<g transform="translate(0 96)"><g data-k="dolls">${dollChain(c, 7, { w: 52, h: 104, col: C.cream })}</g></g>`, 150, 700)}</g>`);
    const dolls = S.$('dolls');
    const rabbi = hanging(flyL, nameTag(c, 'Rabbi', { size: 19 }), { x: 640, y: -400, len: 900 });

    /* Jesus and six of the Twelve */
    const P = S.layer({ par: 0.5, sh: 5 });
    const SPOT = [[500, 12, 2], [585, 4, 0], [665, 16, 3], [935, 16, 1], [1015, 4, 6], [1100, 12, 7]];
    const dis = SPOT.map(([x, dy, k], i) => ({ i, x, y: F + dy, left: x < JX, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, TWELVE[k].o))) }));
    const glow = P.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, r: 26, w: 4 });

    const heaven = S.layer({ par: 0.5, sh: 1, flat: true });
    const beam = heaven.add(`<g>${secretShaft(c, { w0: 160, w1: 820, h: 1500 })}</g>`);
    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v8 — the "Rabbi" tag comes to Peter and is sent away; they join hands; the doll chain opens */
      const tagIn = es(t, 0.05, 0.25, ease.out), tagOut = es(t, 0.38, 0.55, ease.in);
      pose(rabbi, { x: 640 - tagOut * 60, y: lerp(-400, F - 250, tagIn) - tagOut * 700, r: T ? Math.sin(T * 1.2) * 3 : 0, o: tagIn > 0.01 && tagOut < 0.99 ? 1 : 0 });
      const hold = es(t, 0.45, 0.65);
      const open = es(t, 0.5, 0.8);
      pose(chain, { x: JX, y: lerp(-500, 185, es(t, 0.4, 0.6, ease.out)), r: T ? Math.sin(T * 0.8) * 0.8 : 0 });
      pose(dolls, { sx: 0.14 + open * 0.86, sy: 1 });

      /* v9 — light from above */
      const light = es(t, 1.05, 1.4) * (1 - es(t, 2.0, 2.4) * 0.7);
      pose(beam, { x: JX, y: F + 30, o: light * 0.6 });
      const up = es(t, 1.1, 1.35) * (1 - es(t, 1.95, 2.15));
      /* v10 — all turn to Him; His halo glows */
      const master = es(t, 2.05, 2.35);
      pose(glow, { x: JX + 2, y: F - 172, s: 1 + master * 0.9 + (T ? Math.sin(T * 1.6) * 0.04 : 0), o: master });

      const shake = bump(t, 0.28, 0.45) * (T ? Math.sin(T * 12) : 0.5);
      jesus.set({
        x: JX, y: F, s: 1.04, flip: t < 0.5 ? true : false,
        armF: 30 + bump(t, 0.25, 0.5) * 30 + hold * 40 * (1 - up) + master * 20, armB: 20 + hold * 40 * (1 - up) + up * 130 + master * 40,
        head: shake * 8 - up * 18 + master * 2, blink: blinkAt(T),
      });
      voice(JX + (t < 0.5 ? -26 : 26), F - 180, bump(t, 0.02, 0.5) + bump(t, 1.02, 1.6) + bump(t, 2.02, 2.7), T, { dir: t < 0.5 ? -1 : 1 });
      dis.forEach((d) => {
        const reach = d.i === 1 ? bump(t, 0.15, 0.45) : 0;
        const turnIn = master;
        d.p.set({
          x: d.x, y: d.y, s: 0.92, flip: !d.left,
          armF: 10 + reach * 110 + hold * 60 * (1 - up * 0.7) * (1 - turnIn) + turnIn * 40, armB: hold * 50 * (1 - up) * (1 - turnIn) + up * 30 + turnIn * 20,
          head: -up * 22 - turnIn * 4 + reach * -10, lean: -up * 4 + turnIn * 6, blink: blinkAt(T, d.seed),
        });
      });

      S.cam.y = -es(t, 0.3, 0.7) * 30 - es(t, 1.0, 1.4) * 30 + es(t, 2.0, 2.4) * 30;
      S.cam.z = 1.02 + es(t, 2.0, 2.4) * 0.05;
    };
  },
};
