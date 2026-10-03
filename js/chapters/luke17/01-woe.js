// Łk 17,1 — the curtains open on Luke 9's road to Jerusalem in the afternoon, the city far off on its height. Jesus
// walks with Peter, Andrew, John and James, and a little boy from the fields comes down the road towards them with a
// small clay lamp. "It is impossible that no occasions of stumbling should come": Jesus turns to the four and sweeps
// His hand over the way ahead — and dark jagged stones spring up in the road, here, there, all the way up the hill.
// "But woe to him through whom they come!": at the roadside a man in shadow pushes one more stone into the little
// one's path; the boy stops short and his flame shivers. Jesus points at the man; a grey cloud gathers over him and a
// dark tag comes down on its string: "woe!"
import { C, person, blinkAt, pose, lerp, curtains, sheet, mix } from '../kit.js';
import { stormCloud } from '../../assets/things.js';
import { roadSet, ROAD9, roadFour, child, clayLamp, stumbleStone, shadowPerson, strung, strip, flyIn, voiceRings, headAt, hand, halo, warm, behindOf, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const JX = 700, JY = 718;
const KID = { x0: 1200, x1: 980, y: 684 };      // the boy walks down the road
const MAN = { x: 1090, y: 694 };                 // the man in shadow at the roadside (phone: MANX)
const NEAR = [[880, 692, 0.9], [960, 670, 0.86], [1010, 656, 0.8], [800, 716, 1]];   // stones on the near road
const FAR = [[1110, 610, 0.5], [1160, 572, 0.42], [1090, 526, 0.34], [1020, 486, 0.3]];  // and on up the hill

export default {
  id: 'lk17-woe',
  beats: [
    { cover: true },
    { v: 1, text: 'Rzekł znowu do swoich uczniów: «Niepodobna, żeby nie przyszły zgorszenia;' },
    { v: 1, cont: true, text: 'lecz biada temu, przez którego przychodzą.' },
  ],
  cam: { x: [-20, 120], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const MANX = S.portrait ? 1066 : MAN.x;        // phone: a step nearer, clear of the progress thread
    const R = roadSet(S, { village: false });
    const c = S.c;
    /* stones far up the road (on the far road's sheet) */
    const farL = S.layer({ par: 0.2, sh: 2 });
    behindOf(farL, R.G);
    const farStones = FAR.map(([x, y, s], i) => ({ x, y, s, i, el: farL.add(`<g>${stumbleStone(c, 16)}</g>`) }));
    /* people */
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const act = S.layer({ par: 0.45, sh: 5 });
    const aura = glowL.add(`<g>${halo(130, 0.6)}</g>`);
    const lampGlow = glowL.add(`<g>${warm(46, 0.9)}</g>`);
    const nearStones = NEAR.map(([x, y, s], i) => ({ x, y, s, i, el: act.add(`<g>${stumbleStone(c, 18)}</g>`) }));
    const man = S.puppet(act.add(shadowPerson(c, { hairStyle: 'wrap', beard: 'short', mantle: true }, '#3b3148')));
    const pushed = act.add(`<g>${stumbleStone(c, 18)}</g>`);
    const kid = S.puppet(act.add(child(c, { holdF: `<g transform="rotate(75) translate(-2 4)">${clayLamp(c)}</g>` })));
    const flameEl = kid.el.querySelector('.fl');
    const F = roadFour(S, act, c);
    const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 38, w: 5 });
    /* the cloud and the tag over the man */
    const fx = S.layer({ par: 0.45, sh: 6 });
    const cloudEl = fx.add(`<g opacity="0">${stormCloud(c, 150, mix(C.storm, C.stone2, 0.3), mix(C.storm2, C.stone2, 0.2))}</g>`);
    const woe = fx.add(`<g transform="translate(0 -1500)">${strung(strip(c, tr('biada!', 'woe!'), { size: 24, fill: mix(C.storm, C.stone2, 0.35), ink: C.cream }), 18)}</g>`);
    const cur = curtains(S);
    const SPOT = [[-150, 18, 'peter', false], [-80, 8, 'andrew', false], [150, 4, 'john', true], [226, 14, 'james', true]];

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      R.update(T, { eveK: 0.12 });

      /* Jesus and the four; He turns to them, then sweeps His hand over the road ahead */
      const speak = es(t, 1.05, 1.3);
      const sweep = es(t, 1.3, 1.7);
      const point = es(t, 2.35, 2.6);
      F.jesus.set({ x: JX, y: JY, s: 1.04, flip: speak > 0.3 && sweep < 0.4, armF: 16 + sweep * 60 * (1 - point) + point * 78, armB: 8 + bump(t, 1.05, 1.5) * 50, head: -2 + point * 2, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 150 });
      F.ds.forEach((d) => {
        const [dx, dy, , fl] = SPOT[d.i];
        const look = es(t, 1.4 + d.i * 0.05, 1.7 + d.i * 0.05);
        d.p.set({ x: JX + dx, y: JY + dy, s: 0.96, flip: fl ? look < 0.5 : false, armF: 14 + (d.i === 2 ? bump(t, 2.4, 2.9) * 40 : 0), armB: 6 + (d.i === 0 ? es(t, 2.5, 2.8) * 30 : 0), head: -2 - look * 4, blink: blinkAt(T, d.seed) });
      });
      const [jhx, jhy] = headAt(JX, JY, 1.04, false);
      voice(jhx + 14, jhy, es(t, 1.05, 1.2) * (1 - es(t, 1.8, 1.95)) + es(t, 2.1, 2.2) * (1 - es(t, 2.85, 3.0)), T, { dir: 1, spread: 2 });

      /* v1a — stones of stumbling spring up all along the way */
      nearStones.forEach((st) => {
        const k = es(t, 1.4 + st.i * 0.08, 1.55 + st.i * 0.08, ease.back);
        pose(st.el, { x: st.x, y: st.y, s: Math.max(0.001, k) * st.s, o: k > 0.01 ? 1 : 0 });
      });
      farStones.forEach((st) => {
        const k = es(t, 1.62 + st.i * 0.06, 1.76 + st.i * 0.06, ease.back);
        pose(st.el, { x: st.x, y: st.y, s: Math.max(0.001, k) * st.s, o: k > 0.01 ? 1 : 0 });
      });

      /* the boy with his lamp comes down the road */
      const walk = es(t, 0.3, 1.9, (u) => u);
      const stop = es(t, 2.45, 2.55);
      const kx = lerp(S.portrait ? 1120 : KID.x0, KID.x1, walk) + stop * 10;
      const ky = KID.y + (1 - walk) * -14;
      const walking = walk > 0 && walk < 1;
      kid.set({ x: kx, y: ky, s: 0.62, flip: true, walk: walking ? kx * 0.09 : undefined, armF: 70 + stop * 30, armB: stop * 60, lean: -stop * 8, head: 4 + stop * 10, blink: blinkAt(T, 6) });
      const shiver = stop * (1 - es(t, 2.8, 2.95) * 0.5);
      pose(flameEl, { x: 19, y: -9, sx: 1 - shiver * 0.3, sy: 1 - shiver * 0.45 + (T ? Math.sin(T * 9) * 0.06 : 0), r: T ? Math.sin(T * 13) * 12 * shiver : 0 });
      const [lx, ly] = hand(kx, ky, 0.62, true, 70 + stop * 30);
      pose(lampGlow, { x: lx - 14, y: ly - 22, s: 1 - shiver * 0.4, o: 0.9 - shiver * 0.3 });

      /* v1b — the man in shadow pushes a stone into the little one's path */
      const mIn = es(t, 1.9, 2.15);
      const push = es(t, 2.2, 2.45);
      const recoil = es(t, 2.6, 2.85);
      man.set({ x: MANX + (1 - mIn) * 120 + recoil * 20, y: MAN.y, s: 0.94, flip: true, o: seg(t, 1.9, 1.95), walk: mIn > 0 && mIn < 1 ? t * 30 : undefined, armF: 20 + push * 50 * (1 - recoil), armB: recoil * 60, lean: push * 16 * (1 - recoil) - recoil * 6, head: 6 - recoil * 14, blink: 0 });
      const [mhx, mhy] = hand(MANX, MAN.y, 0.94, true, 70);
      const sx = lerp(mhx, KID.x1 - 50, push), sy = lerp(MAN.y - 4, KID.y + 6, push);
      pose(pushed, { x: sx, y: sy, s: 0.95, r: -push * 200, o: seg(t, 2.1, 2.15) });

      /* the cloud gathers over him; "woe!" */
      const ck = es(t, 2.5, 2.8, ease.out);
      pose(cloudEl, { x: MANX - 10 + (T ? Math.sin(T * 0.8) * 4 : 0), y: lerp(420, 484, ck), s: 0.72, o: ck });
      flyIn(woe, es(t, 2.45, 2.75, ease.back), MANX - 10, 318, T, 1, 1.4);

      // phone: the camera goes on to the right so the man, his cloud and "woe!" clear the progress thread
      S.cam.x = kf(t, S.portrait ? [[0, 20], [0.9, 20], [1.4, 60], [2.1, 90], [2.6, 110]] : [[0, 20], [0.9, 20], [1.4, 50], [2.1, 60], [2.6, 70]]);
      S.cam.y = kf(t, [[0, 40], [1.4, 30], [2.6, 20]]);
      S.cam.z = kf(t, [[0, 1.04], [1.4, 1.06], [2.6, 1.1]]);
    };
  },
};
