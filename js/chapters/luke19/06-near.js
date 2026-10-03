// Łk 19,11 — on the road up from Jericho: Jerusalem now close on its hills ahead, golden in the afternoon. The crowd
// that heard Him at Zacchaeus' house walks with Him; He turns to them as they go and tells them one more story
// (the voice rings, and little slips of words fly). Why a parable? Because they were near Jerusalem, and they thought
// the kingdom of God would appear at once: the city's glow brightens, over it a great golden crown comes swinging down
// out of the sky on its strings, and over the disciples' heads little thought-clouds fill with crowns and thrones —
// one of them points eagerly at the city.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { roadSet } from '../mark10/lib.js';
import { jerusalem, TWELVE, still, folk, thought, crown, voiceRings, wordSlip, headAt, hand, kf, es, ease, bump, seg, PI, GOLDEN, mix, STRING } from './lib.js';
import { throne } from '../mark12/lib.js';

const WALK = 700, JX = 760;

export default {
  id: 'lk19-near',
  beats: [
    { v: 11, text: 'Gdy słuchali tych rzeczy, dodał jeszcze przypowieść,' },
    { v: 11, cont: true, text: 'dlatego że był blisko Jerozolimy, a oni myśleli, że królestwo Boże zaraz się zjawi.' },
  ],
  cam: { x: [-60, 120], y: [-60, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { skyCols: GOLDEN, jerusalem: false, jer: 1, jerX: 1150, farY: 420, hillY: 500, groundY: 590, trees: 14, treeCol: C.olive, sunAt: [S.portrait ? 500 : 420, 150], clouds: [[700, 110, 160]] });

    /* Jerusalem close now, on its hill across the last valley (its glow can brighten) */
    const glowL = S.layer({ par: 0.1, sh: 0, flat: true });
    const cityGlow = glowL.add(`<g><circle r="360" fill="url(#halo-glow)"/></g>`);
    const cityL = S.layer({ par: 0.12, sh: 3 });
    cityL.add(`<g transform="translate(1120 520)">${jerusalem(c, 0.46)}</g>`);
    /* the golden crown the disciples expect (on strings, over the city) */
    const skyL = S.layer({ par: 0.1, sh: 4 });
    const bigCrown = skyL.add(`<g><path d="M-40 -1800V-40M40 -1800V-40" stroke="${STRING}" stroke-width="1.4" fill="none"/><circle r="120" cy="-20" fill="url(#warm-glow)" opacity=".8"/><g transform="scale(3.2)">${crown(c)}</g></g>`);

    /* the crowd (one still sheet), the disciples, Jesus */
    const crowdL = S.layer({ par: 0.45, sh: 4 });
    const crowd = crowdL.sprite(still(c, Array.from({ length: 12 }, (_, i) => ({ x: -i * 42 - (i % 2) * 14, y: (i % 3) * 8 - 10, s: 0.8 - (i % 3) * 0.03, head: -3, armF: (i % 4) * 10, o: folk(c) }))), 420, WALK - 20);
    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = [0, 2, 1, 3, 6].map((k, i) => ({ i, p: S.puppet(L.add(person(c, TWELVE[k].o))), dx: -90 - i * 50, dy: (i % 2) * 12 - 8 }));
    const jesus = S.puppet(L.add(person(c, CAST.jesus)));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const rings = voiceRings(fx, c, { n: 3, r: 30, w: 4 });
    const slips = [0, 1, 2].map(() => fx.add(wordSlip(c, 30)));
    const dreams = [0, 1, 2].map((i) => fx.add(`<g>${thought(c, i === 1 ? `<g transform="translate(0 16) scale(.24)">${throne(c)}</g>` : `<g transform="translate(0 10) scale(1.2)">${crown(c)}</g>`, { w: 70, h: 54 })}</g>`));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 2) * 30 });
      /* v11a — while they listen, He tells them a parable (walking on) */
      const jx = lerp(620, JX, es(t, -0.5, 0.6)) + es(t, 1.0, 2.0) * 30;
      const walking = t < 0.6 || (t > 1.0 && t < 1.95);
      const turn = es(t, 0.3, 0.4) * (1 - es(t, 1.05, 1.15));
      jesus.set({ x: jx, y: WALK, s: 1.02, flip: turn > 0.5, walk: walking && turn < 0.5 ? jx * 0.05 : undefined, armF: 14 + turn * 60, armB: turn * 110, head: turn * 4, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const x = jx + d.dx + es(t, 0.3, 0.6) * 20;
        const point = d.i === 0 ? es(t, 1.35, 1.55) : 0;
        d.p.set({ x, y: WALK + d.dy, s: 0.9, walk: walking && turn < 0.5 ? x * 0.05 + d.i : undefined, head: -turn * 6 - es(t, 1.1, 1.4) * 8, armF: 10 + point * 90, armB: point * 30, blink: blinkAt(T, d.i + 2) });
      });
      crowd.set({ x: jx - 360, y: WALK - 20 });
      const [jhx, jhy] = headAt(jx, WALK, 1.02, turn > 0.5);
      rings(jhx - 14, jhy + 6, turn, T, { spread: 1.6, dir: -1 });
      slips.forEach((sl, i) => { const k = seg(t, 0.4 + i * 0.12, 0.95 + i * 0.12); pose(sl, { x: jhx - 30 - k * 170, y: jhy - 10 - Math.sin(k * PI) * 60 - i * 12, r: -10 + i * 8, o: k > 0 && k < 1 ? Math.sin(k * PI) : 0 }); });

      /* v11b — near Jerusalem, they thought the kingdom would appear at once */
      const cr = es(t, 1.05, 1.5, ease.back);
      pose(cityGlow, { x: 1120, y: 420, s: 0.8 + es(t, 1.0, 1.4) * 0.4, o: 0.35 + es(t, 1.0, 1.4) * 0.5 });
      pose(bigCrown, { x: S.portrait ? 980 : 1120, y: lerp(-1300, 330, cr) + (T ? Math.sin(T * 0.8) * 4 : 0), r: T ? Math.sin(T * 0.6) * 1.5 : 0, o: cr > 0.001 ? 1 : 0 });
      dreams.forEach((d, i) => {
        const m = DIS[[0, 1, 3][i]];
        const x = jx + m.dx + 20;
        const k = es(t, 1.2 + i * 0.1, 1.4 + i * 0.1, ease.back);
        const [hx, hy] = headAt(x, WALK + m.dy, 0.9, false);
        pose(d, { x: hx + 6, y: hy - 30, s: k * 0.9, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, 0], [0.6, -20], [1.1, 20], [1.6, 60]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.6, 30], [1.2, -30]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.6, 1.1], [1.2, 1.04]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, -20], [0.6, -40], [1.1, 20], [1.6, 90]]); S.cam.z = 1.0; }
      void hand; void mix;
    };
  },
};
