// Łk 10,18–19 — night has come over the knoll; the village lamps glow far off. "I saw Satan fall like lightning from
// heaven": high in the sky the dark tempter stands on a black cloud in his jagged shadow — Jesus lifts His hand, the
// sky flashes white, and he drops like a bolt of lightning, a crooked streak down to the far hills, and is gone.
// "Behold, I have given you authority to tread on serpents and scorpions, and over all the power of the enemy": on the
// path at their feet snakes and scorpions come crawling, and a long dark shadow reaches out over the ground — the two
// walk on barefoot, and under their steps the snakes go flat, the scorpions curl up and the shadow tears into scraps
// that blow away. "And nothing shall hurt you": a ring of warm light closes round the two and all the seventy-two.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { countrySet, KN, glow, folk, stillGroup, barefoot, TEMPTER, tempterAura, lightning, snake, scorpion, shadowShards, sparkle, kf, moving, EVENING, NIGHT, SENT_A, SENT_B, es, ease, bump, seg, PI } from './lib.js';
import { stormCloud } from '../../assets/things.js';

const JX = KN.X, JY = 688;
const SKY = [800, 300];
const PATHY = 716;

export default {
  id: 'lk10-satan',
  beats: [
    { v: 18 },
    { v: 19, text: 'Oto dałem wam władzę stąpania po wężach i skorpionach, i po całej potędze przeciwnika,' },
    { v: 19, cont: true, text: 'a nic wam nie zaszkodzi.' },
  ],
  cam: { x: [-30, 30], y: [-140, 90], z: [1, 1.12] },
  build(S) {
    const K = countrySet(S, { skyCols: EVENING, sky2: NIGHT, sunAt: [1260, 330] });
    const c = S.c;
    const pc = makeCutter('lk10-satan-people');
    K.trails.forEach((el) => pose(el, { o: 0.6 }));

    /* the tempter on his cloud, the flash, the bolt */
    const flash = S.layer({ par: 0, sh: 1, flat: true, rise: 0 });
    flash.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#fffbe8"/>`);
    const TL = S.layer({ par: 0.05, sh: 5, rise: 0 });
    const aura = TL.add(`<g>${tempterAura(c, 150)}</g>`);
    const cl = TL.add(`<g>${stormCloud(makeCutter('lk10-tcloud'), 360, C.storm2, '#2d334d')}</g>`);
    const tempter = S.puppet(TL.add(person(c, TEMPTER)));
    const bolt = TL.add(`<g>${lightning(c, 420)}</g>`);
    const impact = TL.add(`<g>${glow(80, 1, 'warm-glow')}</g>`);

    /* Jesus and the seventy-two on the knoll */
    const P = S.layer({ par: 0.45, sh: 5 });
    const jGlow = P.add(`<g>${glow(170, 0.7)}</g>`);
    const ring = P.add(`<g><ellipse rx="330" ry="120" fill="url(#halo-glow)"/><path d="${c.ribbon(c.arc(0, 0, 300, 90, 0, PI * 2, 60), 5)}" fill="${C.halo}" opacity=".8"/></g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const crowdL = S.layer({ par: 0.45, sh: 4 });
    [[330, 702, 0.74], [430, 708, 0.76], [1170, 708, 0.76], [1270, 702, 0.74]].forEach(([x, y, s], i) => {
      const left = x > 800;
      crowdL.sprite(stillGroup(pc, [{ x: -30, y: -4, s, flip: left, o: folk(pc, true), armF: 30, armB: 60, head: -16 }, { x: 30, y: 2, s: s * 0.97, flip: left, o: folk(pc, true), armF: 60, armB: 20, head: -14 }]), x, y);
    });
    const A = S.puppet(P.add(barefoot(person(c, SENT_A), SENT_A.skin)));
    const B = S.puppet(P.add(barefoot(person(c, SENT_B), SENT_B.skin)));

    /* the creeping things and the enemy's shadow on the path */
    const G = S.layer({ par: 0.47, sh: 3 });
    const shadow = G.add(`<g><path d="${c.cut([[-40, 0], [-10, -14], [60, -22], [160, -18], [260, -30], [330, -12], [300, 4], [200, 10], [80, 14], [-20, 10]], 2, 8)}" fill="#241e33" opacity=".7"/><path d="${c.cut([[250, -30], [300, -60], [320, -54], [290, -26]], 1, 4) + c.cut([[280, -22], [340, -40], [350, -30], [300, -14]], 1, 4)}" fill="#241e33" opacity=".7"/></g>`);
    const shards = shadowShards(c, { n: 8, r: 70 }).map((sh) => ({ ...sh, el: G.add(`<g>${sh.m}</g>`) }));
    const CR = [
      { k: 'snake', x: 560, dir: 1 }, { k: 'scorpion', x: 620, dir: 1 }, { k: 'snake', x: 1040, dir: -1 }, { k: 'scorpion', x: 980, dir: -1 },
    ].map((q, i) => ({ ...q, i, el: G.add(`<g>${q.k === 'snake' ? snake(c) : scorpion(c)}</g>`) }));
    const sparks = [0, 1, 2, 3].map(() => G.add(`<g>${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      const night = es(t, -0.5, 0.3);
      K.sk2.layer.fade(night);
      K.starL.fade(night);
      K.dim.fade(night * 0.9);
      K.update(T, { sunY: 330 + night * 500, sunO: 1 - night });
      K.lampsOn([1, 1, 1, 1, 1, 1], T);

      /* v18 — he falls like lightning */
      const fall = es(t, 0.42, 0.62, ease.in);
      const [bx, by] = [SKY[0] + 70 * fall, lerp(SKY[1], 470, fall)];
      pose(cl, { x: SKY[0], y: SKY[1] + 14, s: 1, o: 1 - es(t, 0.6, 0.85) });
      tempter.set({ x: bx, y: by, s: 0.8 * (1 - fall * 0.6), r: fall * 40, armF: 60 - fall * 40, armB: 120, head: -6, o: 1 - seg(t, 0.58, 0.64) });
      pose(aura, { x: bx, y: by, s: 1 - fall * 0.5, o: 1 - seg(t, 0.5, 0.62) });
      const fl = bump(t, 0.4, 0.52);
      flash.fade(fl * 0.8);
      pose(bolt, { x: SKY[0] + 10, y: SKY[1] - 20, sy: 0.45, r: -22, o: es(t, 0.42, 0.46) * (1 - es(t, 0.85, 1.0)) });
      const im = bump(t, 0.6, 0.9);
      pose(impact, { x: SKY[0] + 80, y: 470, s: 0.6 + im, o: im });
      const point = es(t, 0.1, 0.3) * (1 - es(t, 0.95, 1.1));

      /* v19a — tread on them; the shadow tears */
      const walk = [[1.05, 0], [1.75, 150]];
      const w = kf(t, walk, (x) => x);
      const walking = moving(t, walk);
      A.set({ x: 470 + w, y: PATHY, s: 0.98, flip: false, walk: walking ? w * 0.06 : undefined, armF: 14 + es(t, 2.05, 2.2) * 20, armB: 10, head: 4, blink: blinkAt(T, 2) });
      B.set({ x: 1130 - w, y: PATHY + 4, s: 0.95, flip: true, walk: walking ? w * 0.06 + 1 : undefined, armF: 14 + es(t, 2.05, 2.2) * 20, armB: 10, head: 4, blink: blinkAt(T, 3) });
      CR.forEach((q) => {
        const come = es(t, 1.0 + q.i * 0.05, 1.3 + q.i * 0.05);
        const stepped = es(t, 1.42 + q.i * 0.06, 1.5 + q.i * 0.06);
        const x = q.x + q.dir * (1 - come) * -120;
        pose(q.el, { x, y: PATHY + 4, s: 1, sx: q.dir, sy: 1 - stepped * 0.55, o: seg(t, 0.98 + q.i * 0.05, 1.04 + q.i * 0.05) * (1 - es(t, 1.7, 1.9)) });
        const sk = bump(t, 1.44 + q.i * 0.06, 1.7 + q.i * 0.06);
        pose(sparks[q.i], { x, y: PATHY - 20, s: sk, r: T * 40, o: sk });
      });
      const creep = es(t, 1.05, 1.45);
      const tear = es(t, 1.55, 1.95);
      pose(shadow, { x: lerp(1400, 700, creep), y: PATHY + 8, s: 1, o: creep * (1 - seg(t, 1.55, 1.6)) });
      shards.forEach((sh) => {
        const ex = Math.cos(sh.a) * tear * 180, ey = Math.sin(sh.a) * tear * 60 - tear * 160;
        pose(sh.el, { x: 860 + ex, y: PATHY + ey, r: tear * 180 * (sh.i % 2 ? 1 : -1), s: 0.8, o: seg(t, 1.55, 1.58) * (1 - tear) });
      });

      /* v19b — nothing shall hurt you */
      const safe = es(t, 2.05, 2.4);
      pose(ring, { x: 800, y: PATHY - 60, s: 0.6 + safe * 0.5, o: safe });
      jesus.set({ x: JX, y: JY, s: 1.04, flip: false, armF: 20 + point * 130 + safe * 50, armB: 10 + safe * 110, head: -point * 22 - safe * 6, blink: blinkAt(T) });
      pose(jGlow, { x: JX, y: JY - 120, o: 0.7 });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -120], [0.8, -120], [1.1, 80], [2.0, 80], [2.3, 30], [3, 30]]);
      S.cam.z = kf(t, [[0, 1.0], [0.8, 1.0], [1.1, 1.1], [2.0, 1.1], [2.4, 1.02], [3, 1.02]]);
    };
  },
};
