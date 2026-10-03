// Łk 16,1 — the curtains open on the village square in the gold of the afternoon: Jesus on the low step by the well,
// Peter and John beside Him, the people all round, and on the right the Pharisees, listening from the edge. "He also
// said to His disciples: There was a rich man who had a manager, and charges were brought to him that this man was
// wasting his possessions": Jesus turns to the disciples, and a painted panel comes down over the square — the rich
// man in his chair under his portico; on the left his manager with his arms flung wide and the coins flying out of his
// hands into the dust; and at the master's ear a tale-bearer, whispering, with a picture of the spilt purse in his
// little bubble. The master's head turns.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix, curtains } from '../kit.js';
import { villageSet, VQ, panel, panelSky, panelGround, figure, speech, coin, purse, headAt, kf, tr, es, ease, bump, seg, PI, AFTER, MASTER, STEWARD } from './lib.js';

const F = VQ.FEET;
const PW = 330, PH = 190;          // the panel
const PX = 800, PY = 290;          // where it hangs

/** the estate in little: a portico, the master in his chair, the tale-bearer; the manager flinging coins (panel coords) */
function estateLittle(S, c) {
  const G = 44;
  let m = panelSky(S, PW, PH, ['#cfe0da', '#f5e6c6']);
  m += sheet().p(c.cut([[-PW / 2, -10], [-40, -20], [60, -6], [PW / 2, -16], [PW / 2, 20], [-PW / 2, 20]], 0.8, 10), mix(C.hillMid, C.sand, 0.2)).out();
  m += panelGround(c, PW, G - 4, mix(C.sand, C.stone, 0.45), 2);
  // the portico on the right
  const p = sheet();
  p.p(c.cut([[40, G], [40, -64], [PW / 2 + 10, -64], [PW / 2 + 10, G]], 0.4, 6), mix(C.plaster, C.cream, 0.3));
  p.p(c.cut([[30, -64], [PW / 2 + 10, -64], [PW / 2 + 10, -78], [30, -78]], 0.3, 6), mix(C.wood3, C.ochre, 0.2));
  [52, 150].forEach((x) => p.p(c.cut([[x - 6, G], [x - 5, -64], [x + 5, -64], [x + 6, G]], 0.2, 5), mix(C.stone, C.cream, 0.4)));
  p.p(c.cut([[84, G], [84, 6], [128, 6], [128, G]], 0.3, 4), C.wood);
  m += p.out();
  m += figure(c, { ...MASTER, pose: 'sit' }, { x: 106, y: G + 8, s: 0.5, flip: true, armF: 20, armB: 8, head: -4 });
  // the tale-bearer at his ear
  m += figure(c, { robe: mix(C.stone2, C.plumRobe, 0.3), hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin4, belt: C.leather }, { x: 58, y: G, s: 0.46, armF: 100, armB: 20, head: 14, lean: 10 });
  // the manager, arms wide
  m += figure(c, STEWARD, { x: -84, y: G, s: 0.5, armF: 120, armB: 130, head: -8 });
  return m;
}

export default {
  id: 'lk16-disciples',
  beats: [
    { cover: true },
    { v: 1 },
  ],
  cam: { x: [-20, 80], y: [-60, 40], z: [0.94, 1.1] },
  build(S) {
    const Q = villageSet(S, { skyCols: AFTER, dis: ['peter', 'john'], ph: 3, crowdSeeds: ['lk16-vL', 'lk16-vR'], sunAt: [1250, 190] });
    const c = Q.c;
    const pan = Q.flyL.add(panel(S, estateLittle(S, c), { w: PW, h: PH, word: tr('bogacz i jego rządca', 'a rich man and his manager') }));
    /* the coins flung from the manager's hands (in front of the panel) */
    const coins = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: Q.flyL.add(`<g opacity="0">${coin(c, 5)}</g>`) }));
    const tale = Q.flyL.add(`<g opacity="0">${speech(c, `<g transform="translate(-8 -14) scale(.5)">${purse(c)}</g><g transform="translate(10 6)">${coin(c, 4)}</g><g transform="translate(-14 10)">${coin(c, 4)}</g>`, { w: 58, h: 42, flip: false })}</g>`);
    const cur = curtains(S);
    const PS = S.portrait ? [-20, -40, -60] : [0, 0, 0];   // phone: the Pharisees drawn in from under the thread

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      /* v1 — He turns to the disciples; the panel of the parable comes down */
      const turn = es(t, 1.02, 1.15);
      const speak = es(t, 1.1, 1.3);
      Q.pose(t, T,
        { flip: turn > 0.5, armF: 16 + speak * 56, armB: 8 + speak * 20, head: -2 - speak * 4, blink: blinkAt(T, 2) },
        (d) => ({ x: d.x - 40, flip: false, armF: 10, armB: 6, head: -4 + es(t, 1.3, 1.5) * -6, blink: blinkAt(T, d.seed) }),
        (m) => ({ x: m.x + PS[m.i], head: 2 + es(t, 1.4, 1.6) * 4, lean: -es(t, 1.4, 1.6) * 3, blink: blinkAt(T, m.seed) }));
      const pk = es(t, 1.08, 1.4, ease.out);
      const px = PX, py = lerp(-500, PY, pk);
      pose(pan, { x: px, y: py, r: T ? Math.sin(T * 0.7) * 0.6 * pk : 0, o: pk > 0.004 ? 1 : 0 });
      // coins fly up from the manager's hands and fall in the dust
      const G = 44;
      coins.forEach((cn) => {
        const a = 1.35 + cn.i * 0.07;
        const k = seg(t, a, a + 0.32);
        const dir = cn.i % 2 ? 1 : -1;
        const x = px - 84 + dir * (14 + k * (20 + cn.i * 7));
        const y = py - 70 + k * (G + 70) - Math.sin(k * PI) * (30 + (cn.i % 3) * 10);
        pose(cn.el, { x, y, r: k * 300, o: k > 0 && pk > 0.98 ? 1 : 0 });
      });
      // the whisper at the master's ear
      const wk = es(t, 1.5, 1.62, ease.back);
      pose(tale, { x: px + 70, y: py - 50, s: wk, o: wk > 0.01 ? 1 : 0 });
      Q.amaze(0);

      S.cam.z = kf(t, [[0, 1.08], [1.0, 1.08], [1.4, 1.02]]);
      S.cam.y = kf(t, [[0, 30], [1.0, 30], [1.4, -40]]);
      S.cam.x = kf(t, [[0, 0], [1.0, 0], [1.4, 0]]);
      if (S.portrait) { S.cam.x += 50; S.cam.z -= 0.06; }
    };
  },
};
