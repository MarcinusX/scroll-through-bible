// Mt 25,10–12 — while the foolish are down at the oil-seller's stall, the bridegroom comes down the street with his
// torch-bearers, a wreath on his head. The door of the house swings open on warm light and the feast; he goes in and
// the five wise follow him with their bright lamps — and the door is shut, the bar drops across it. Later the foolish
// come back with their lamps lit and knock: "Lord, lord, open to us!" The little shutter opens on the lit room; the
// bridegroom looks out and shakes his head: "I do not know you." Their lamps sink.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { weddingSet, WD, spotsFor, STALL_P, maidens, setMaiden, GROOM, FRIENDS, torch, wreath, addToHead, say, voiceRings, kf, moving, tr } from './lib.js';

const D = WD.DOOR;
const BACK = [806, 866, 926, 986, 1044];      // where the foolish stand knocking

export default {
  id: 'mt25-door',
  parable: true,
  beats: [
    { v: 10, text: 'Gdy one szły kupić, nadszedł pan młody.' },
    { v: 10, cont: true, text: 'Te, które były gotowe, weszły z nim na ucztę weselną,' },
    { v: 10, cont: true, text: 'i drzwi zamknięto.' },
    { v: 11 },
    { v: 12 },
  ],
  cam: { x: [-40, 100], y: [-30, 30], z: [1, 1.12] },
  build(S) {
    const W = weddingSet(S, { moonAt: [1000, 100], stall: S.portrait ? STALL_P : WD.STALL });
    const P = S.portrait;
    const SPOTS = spotsFor(S);
    const c = W.c;
    // the bridegroom at the little window (inside, behind the wall)
    const inGroom = S.puppet(W.inside.add(addToHead(person(c, GROOM), `<g transform="translate(0 -4)">${wreath(c)}</g>`)));
    const act = S.layer({ par: 0.45, sh: 5 });
    const fireL = S.layer({ par: 0.45, sh: 0, flat: true });
    const M = maidens(S, act, { fireL, sit: false });
    const groom = S.puppet(act.add(addToHead(person(c, GROOM), `<g transform="translate(0 -4)">${wreath(c)}</g>`)));
    const fr = FRIENDS.map((o) => S.puppet(act.add(person(c, { ...o, holdF: `<g transform="rotate(180)">${torch(c, 50)}</g>` }))));
    const fx = S.layer({ par: 0.45, sh: 4 });
    const knockW = fx.add(`<g>${say(c, [tr('Panie, panie,', 'Lord, Lord,'), tr('otwórz nam!', 'open to us!')], { size: 20, side: -1 })}</g>`);
    const noW = fx.add(`<g>${say(c, tr('Nie znam was.', 'I don’t know you.'), { size: 20, side: -1 })}</g>`);
    const knocks = voiceRings(fx, c, { n: 2, r: 12, w: 3, color: C.cream, both: false });

    return (t, time) => {
      const T = time;
      W.night.layer.fade(1);
      W.update(T, { moonY: 100, moonX: 1000 });
      W.torches.forEach((el) => pose(el, { o: 0 }));
      pose(W.stallGlow, { x: W.STALL + 70, y: 530, s: 1.3, o: 1 });
      W.seller.set({ x: W.STALL - 10, y: 640, s: 0.62, armF: 60 * (1 - es(t, 2.6, 3)), blink: blinkAt(T, 4) });

      /* v10a — the bridegroom comes with his torch-bearers */
      const GK = [[0.05, 1620], [0.75, 1040], [1.08, 1040], [1.35, D + 6]];
      const gx = kf(t, GK, (u) => u);
      const gin = es(t, 1.3, 1.42);
      groom.set({ x: gx, y: WD.G + 4, s: 0.88, flip: true, o: 1 - gin, walk: moving(t, GK) ? gx * 0.07 : undefined, armF: bump(t, 0.75, 1.1) * 60, armB: bump(t, 0.75, 1.1) * 40, head: -2, blink: blinkAt(T, 3) });
      fr.forEach((p, i) => {
        const FX = P ? 1078 + i * 40 : 1170 + i * 64;   // phone: the torch-bearers wait inside the screen
        const FK = [[0.12 + i * 0.08, 1720 + i * 70], [(P ? 0.62 : 0.85) + i * 0.05, FX], [1.65 + i * 0.1, FX], [1.9 + i * 0.05, D + 4]];
        const x = kf(t, FK, (u) => u);
        p.set({ x, y: WD.G + 2 - i * 4, s: 0.82, flip: true, o: 1 - es(t, 1.85 + i * 0.05, 1.95 + i * 0.05), walk: moving(t, FK) ? x * 0.07 : undefined, armF: 150, armB: 10, blink: blinkAt(T, 5 + i) });
      });
      /* v10b — the door opens; the ready go in with him — v10c the door is shut */
      const open = es(t, 1.02, 1.22) * (1 - es(t, 2.05, 2.3));
      W.door(open);
      const barK = es(t, 2.3, 2.45, ease.in);
      pose(W.bar, { x: D, y: lerp(380, WD.G - 92, barK), o: barK > 0.01 ? 1 : 0 });
      M.forEach((m) => {
        const j = m.i % 5;
        if (m.wise) {
          const go = es(t, 1.3 + (4 - j) * 0.1, 1.6 + (4 - j) * 0.1, (u) => u);
          const x = lerp(SPOTS[m.i] + 16, D, go);
          const greet = es(t, 0.6, 0.9);
          setMaiden(m, { x, y: WD.G + (m.i % 2) * 6, s: 0.8, walk: go > 0 && go < 1 ? x * 0.07 : 0, armF: 46 + greet * 36, armB: 6, head: -greet * 6, blink: blinkAt(T, m.seed), fire: 1.3, time: T, o: 1 - seg(t, 1.55 + (4 - j) * 0.1, 1.62 + (4 - j) * 0.1) });
        } else {
          /* at the stall, buying (v10) — then back to the shut door (v11) */
          const back = es(t, 3.02, 3.45 + j * 0.04, (u) => u);
          const x = lerp((P ? 300 : 318) + j * 36, BACK[j], ease.io(back));   // phone: out of sight at the stall until they come back
          const knocker = j === 4;
          const knock = knocker ? es(t, 3.5, 3.6) * (1 - es(t, 4.0, 4.1)) : 0;
          const tap = knock * Math.abs(Math.sin(T ? T * 9 : 1.2)) * 18;
          const plead = es(t, 3.5, 3.7) * (1 - es(t, 4.2, 4.4));
          const sorrow = es(t, 4.35, 4.6);
          setMaiden(m, {
            x, y: WD.G + (m.i % 2) * 6, s: 0.8, flip: back < 0.02, walk: back > 0 && back < 1 ? x * 0.07 : 0,
            armF: knocker ? 46 + plead * 10 - sorrow * 20 : 46 + plead * 30 - sorrow * 26, armB: knocker ? 6 + knock * 80 + tap : 6 + plead * 60 * (j % 2),
            head: -plead * 8 + sorrow * 16, blink: blinkAt(T, m.seed), fire: seg(t, 0.4 + j * 0.1, 0.5 + j * 0.1) * (0.9 - sorrow * 0.35), time: T,
          });
        }
      });
      const kk = es(t, 3.55, 3.8, ease.back) * (1 - es(t, 4.0, 4.1));
      pose(knockW, { x: 1010, y: WD.G - 190, s: kk, o: kk > 0.01 ? 1 : 0 });
      knocks(D - 52, WD.G - 110, es(t, 3.5, 3.6) * (1 - es(t, 4.0, 4.1)), T, { dir: 1, s0: 0.6, spread: 1.4 });

      /* v12 — the shutter opens: "I do not know you" */
      const sh = es(t, 4.02, 4.15) * (1 - es(t, 4.88, 4.98));
      pose(W.shutter, { x: WD.WIN[0] - 26, y: WD.WIN[1] - 2, sx: 1 - sh * 0.9 });
      const shake = es(t, 4.2, 4.3) * Math.sin(t * 24) * 10 * (1 - es(t, 4.6, 4.7));
      inGroom.set({ x: WD.WIN[0] - 4, y: WD.WIN[1] + 150 * 0.8 + 8, s: 0.8, flip: true, o: sh > 0.02 ? 1 : 0, head: shake, blink: blinkAt(T, 3) });
      const nk = es(t, 4.2, 4.45, ease.back) * (1 - es(t, 4.88, 4.98));
      pose(noW, { x: WD.WIN[0] - 30, y: WD.WIN[1] - 34, s: nk, o: nk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 30], [1.0, 40], [2.0, 50], [2.9, 20], [3.3, 20]]) + (P ? 40 : 0);   // phone: the door is not under the thread
      S.cam.z = 1 + es(t, 1.9, 2.3) * 0.06 * (1 - es(t, 2.9, 3.2)) + es(t, 3.9, 4.2) * 0.05;
      S.cam.y = es(t, 3.9, 4.2) * -20;
    };
  },
};
