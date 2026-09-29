// Łk 18,24–27 — the same wayside; the young man stands there sad beside his laden cart. "Jesus, seeing that he became
// very sad, said: How hard it is for those who have riches to enter into God's Kingdom!": a narrow little gate of
// light opens on the road, and the cart, heaped high, rolls up to it and jams — it will not go through. "It is easier
// for a camel to enter in through a needle's eye": a giant needle is let down and a camel, loaded with the same goods,
// marches up and pushes its nose into the eye — squash, and bounce. "Those who heard it said: Then who can be
// saved?" — the disciples throw up their hands. "The things which are impossible with men are possible with God":
// light comes down over the needle, the eye shines, and the camel is lifted, made small, floats through the eye and
// lands on the other side.
import { C, CAST, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  waySet, WY, L10, disciples, cart, camel, walkCamel, camelLoad, bigNeedle, kingdomGate, godLight, words, sparkle, halo, withFace, faceBits, face,
  headAt, kf, es, ease, bump, seg, tr, PI,
} from './lib.js';

const { GY } = WY;
const JX = 600, RX = 760;
const NX = 960, NH = 380, NTIP = GY + 160, EYE_Y = NTIP - NH + 63;
const GATE = [990, GY - 30];
const DK = ['peter', 'andrew', 'james', 'john', 'philip', 'bartholomew'];

export default {
  id: 'lk18-camel',
  beats: [
    { v: 24 },
    { v: 25 },
    { v: 26 },
    { v: 27 },
  ],
  cam: { x: [-20, 80], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const W = waySet(S, { jesus: false });
    const c = S.c;
    const L = W.crowdL;
    const calm = L.sprite(disciples(c, DK, { s: 0.86, spread: 46, rows: 2 }), 390, GY + 4);
    const amazed = L.sprite(disciples(c, DK, { s: 0.86, spread: 46, rows: 2, arms: [130, 110, 150], heads: [-10, -6, -12] }), 390, GY + 4);
    const B = W.behind;
    const gateEl = B.add(`<g opacity="0">${kingdomGate(c, 44, 108)}</g>`);
    const A = W.act;
    const K = cart(c, 180);
    const cartEl = A.add(`<g>${K.body}<g transform="translate(-45 0)">${K.wheel}</g><g transform="translate(50 0)">${K.wheel}</g></g>`);
    const rulerEl = A.add(withFace(person(c, L10.rich), faceBits(c)));
    const ruler = S.puppet(rulerEl);
    const J = S.puppet(A.add(person(c, CAST.jesus)));
    // the needle and the camel (in front of the people)
    const NL = S.layer({ par: 0.5, sh: 5 });
    const light = NL.add(`<g opacity="0"><path d="M0 -1600V-50" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${godLight(c, 34)}</g>`);
    const needle = NL.add(`<g><path d="M0 ${-NH - 1400}V${-NH}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${bigNeedle(c, NH, mix(C.storm, C.skyBlue2, 0.45))}</g>`);
    const eyeGlow = NL.add(`<g opacity="0">${halo(60)}</g>`);
    const cam_ = NL.add(`<g><g class="cm">${camel(c)}${camelLoad(c)}</g></g>`);
    const cm = cam_.querySelector('.cm');
    const sparks = [0, 1, 2, 3].map(() => NL.add(`<g opacity="0">${sparkle(c, 10)}</g>`));
    const fx = W.fx;
    const who = fx.add(`<g opacity="0">${words(c, tr(['Któż więc może', 'być zbawiony?'], ['Then who', 'can be saved?']), { size: 19, side: 1 })}</g>`);
    const possible = fx.add(`<g opacity="0">${words(c, tr(['U Boga', 'to możliwe!'], ['Possible', 'with God!']), { size: 18, side: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      W.update(T);

      /* v24 — the narrow gate; the cart jams against it */
      const gk = es(t, 0.1, 0.35, ease.back) * (1 - es(t, 1.0, 1.2));
      pose(gateEl, { x: GATE[0], y: GATE[1], s: gk * 1.1, o: gk > 0.02 ? 1 : 0 });
      const roll = es(t, 0.35, 0.6);
      const jam = bump(t, 0.6, 0.8) * Math.sin(t * 60) * 5;
      const cx = lerp(1400, GATE[0] + 150, roll) + jam + es(t, 0.95, 1.3) * 500;
      pose(cartEl, { x: cx, y: GY - 20, s: 0.9, r: bump(t, 0.6, 0.75) * -2 });

      /* the young man, sad, a little aside */
      ruler.set({ x: RX, y: GY - 4, s: 0.98, flip: true, armF: 50, armB: 30, head: 14 - bump(t, 3.5, 3.95) * 20, lean: 4, blink: blinkAt(T, 3) });
      face(rulerEl, 'sad', 1 - bump(t, 3.5, 4.0));

      /* Jesus looks at him (v24), speaks (v25), turns to them (v26–27), points up to the light (v27) */
      const toThem = es(t, 2.05, 2.25);
      const up = es(t, 3.05, 3.25);
      J.set({ x: JX, y: GY, s: 1.06, flip: toThem > 0.5 && up < 0.5, armF: 20 + bump(t, 0.2, 0.9) * 60 + bump(t, 1.1, 1.8) * 60 + up * 40, armB: 10 + up * 160, head: -up * 14, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, GY, 1.06, false);
      W.voice(jhx, jhy, Math.max(bump(t, 0.05, 1.9), bump(t, 3.02, 3.95)) * 0.7, T, { dir: 1, spread: 1.6 });
      pose(possible, { x: jhx - 20, y: jhy - 42, s: es(t, 3.1, 3.28, ease.back), o: t > 3.1 ? 1 : 0 });

      /* v26 — the disciples */
      const amaze = es(t, 2.05, 2.15) * (1 - es(t, 3.3, 3.4));
      calm.set({ x: 390, y: GY + 4, o: 1 - amaze });
      amazed.set({ x: 390, y: GY + 4, o: amaze });
      pose(who, { x: 450, y: GY - 230, s: es(t, 2.1, 2.28, ease.back), o: t > 2.1 && t < 3.1 ? 1 - es(t, 3.0, 3.1) : 0 });

      /* v25 — the needle comes down; the camel tries */
      const nd = es(t, 0.95, 1.2, ease.out);
      pose(needle, { x: NX, y: lerp(-1400, NTIP, nd) + (T ? Math.sin(T * 0.8) * 2 : 0), r: T ? Math.sin(T * 0.6) * 0.6 : 0 });
      const walkIn = es(t, 1.1, 1.45);
      const push = es(t, 1.45, 1.6) * (1 - es(t, 1.92, 2.02));
      const bounce = es(t, 1.95, 2.12, ease.back);
      const lift = es(t, 3.15, 3.45), through = es(t, 3.45, 3.6), land = es(t, 3.6, 3.85);
      const nose = 128;
      let x = lerp(1600, NX + nose, walkIn) - push * (16 + (T ? Math.sin(T * 9) * 4 : 0)) + bounce * 60, y = GY + 10, s = 0.84;
      x = lerp(x, NX + 30, lift); y = lerp(y, EYE_Y + 12, lift); s = lerp(s, 0.1, lift);
      x = lerp(x, NX - 30, through);
      x = lerp(x, NX - 90, land); y = lerp(y, GY + 50, land); s = lerp(s, 0.55, land);
      pose(cam_, { x, y: y - Math.sin(through * PI) * 6, s });
      pose(cm, { sx: -1 + push * 0.16, sy: 1 + push * 0.06 });
      const walking = (walkIn > 0 && walkIn < 1) || (bounce > 0.02 && bounce < 0.98);
      walkCamel(cam_, walking ? T * 7 + t * 20 : 0, walking ? 1 : 0);

      /* v27 — the light over the needle, the shining eye */
      const lk = es(t, 3.02, 3.25, ease.out);
      pose(light, { x: NX, y: lerp(-1500, 190, lk) + (T ? Math.sin(T * 0.8) * 2 : 0), o: lk > 0.01 ? 1 : 0 });
      pose(eyeGlow, { x: NX, y: EYE_Y, s: 0.6 + lift * 0.6, o: es(t, 3.1, 3.3) });
      sparks.forEach((sp, i) => {
        const k = T ? (T * 0.5 + i / 4) % 1 : 0.4;
        pose(sp, { x: NX - 150 + i * 36, y: GY - 40 - k * 100, s: 0.7, o: es(t, 3.7, 3.9) * Math.sin(k * PI) });
      });

      S.cam.x = kf(t, [[0, 20], [1.0, 40], [2.0, 20], [3.0, 30]]);
      S.cam.y = kf(t, [[0, 0], [1.0, -10], [3.0, -20]]);
      S.cam.z = 1.04;
      void shade; void mix; void sheet; void seg;
    };
  },
};
