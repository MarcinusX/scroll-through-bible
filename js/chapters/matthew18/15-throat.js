// Mt 18,28–30 — outside the king's house. The forgiven servant comes out of the gate swinging his arms, free — and
// meets a poor fellow servant who owes him a hundred denarii: a little tag, a little heap of silver (the mountain of
// gold is gone). He seizes him by the collar and shakes him — "Pay what you owe!" — in a jagged bubble. The fellow
// falls at his feet, bows down and begs in the very same words: "Have patience with me!" He will not: he shakes his
// head, drags him off by a rope to the prison across the street; the jailer opens the door, pushes him in, and the
// heavy door swings shut. A sad face looks out between the bars.
import { C, person, blinkAt, pose, lerp, swing, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { palaceStreet, PS, windowBars, behindWindow, moody, DEBTOR, FELLOW, JAILER, denarHeap, hungWords, bubble, shout, crossX, speech, bigKey, ropeLine, kf, hand, headAt, hanging, tr, PI } from './lib.js';

const P = 0.45, FY = PS.FY;

export default {
  id: 'mt18-throat',
  parable: true,
  beats: [
    { v: 28, text: 'Lecz gdy sługa ów wyszedł, spotkał jednego ze współsług, który mu był winien sto denarów.' },
    { v: 28, cont: true, text: 'Chwycił go i zaczął dusić, mówiąc: "Oddaj, coś winien!"' },
    { v: 29 },
    { v: 30 },
  ],
  cam: { x: [-40, 90], y: [0, 40], z: [1, 1.08] },
  build(S) {
    const V = palaceStreet(S, { P });
    const c = S.c;
    const flies = S.layer({ par: 0.3, sh: 6 });
    const tag = hanging(flies, `<g>${hungWords(c, tr('100 denarów', '100 denarii'), { size: 24 })}<g transform="translate(0 70)">${denarHeap(c, 60)}</g></g>`, { x: 0, y: 0, len: 900 });

    S.layer({ par: P, sh: 4 }).add(V.balFront);
    const L = S.layer({ par: P, sh: 5 });
    // the fellow's face at the prison window (behind the bars)
    const face = behindWindow(S, L, FELLOW, [PS.PX + PS.PW * 0.12, PS.FY - 18 - PS.PH * 0.72, PS.PX + PS.PW * 0.4, PS.FY - 18 - PS.PH * 0.46], 'cell');
    const bars = L.add(`<g>${windowBars(c)}</g>`);
    const jailer = S.puppet(L.add(person(c, { ...JAILER, holdB: `<g transform="rotate(90) scale(.6)">${bigKey(c, 60)}</g>` })));
    const fellow = moody(S, L, FELLOW);
    const fellowK = moody(S, L, { ...FELLOW, pose: 'kneel' });
    const debtor = moody(S, L, DEBTOR);
    const rope = L.add(`<g opacity="0">${ropeLine(c)}</g>`);

    const fx = S.layer({ par: P, sh: 4 });
    const pay = fx.add(`<g opacity="0">${shout(c, `<text x="0" y="8" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="24" font-style="italic" fill="${C.terracotta}">${tr('Oddaj!', 'Pay!')}</text>`, { w: 96, h: 54 })}</g>`);
    const plea = fx.add(`<g opacity="0">${bubble(c, tr(['Miej', 'cierpliwość!'], ['Have', 'patience!']), { size: 19, tail: 1 })}</g>`);
    const no = fx.add(`<g opacity="0">${speech(c, crossX(c, 14), { w: 44, h: 38, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      V.update(T);

      /* v28a — out of the gate, free; he meets the one who owes him a hundred denarii */
      const outK = es(t, 0.0, 0.4, (x) => x);
      const dxW = lerp(PS.GATE, 700, outK);
      const fIn = es(t, 0.1, 0.45, (x) => x);
      const fx0 = lerp(1060, 830, fIn);
      const tk = es(t, 0.45, 0.7, ease.back) * (1 - es(t, 1.9, 2.1));
      swing(tag, 880, lerp(-900, 240, tk), T, 1.2, 0.8, 1);

      /* v28b — seizes him by the throat; v29 — he falls and begs; v30 — to prison */
      const grab = es(t, 1.05, 1.2);
      const shake = grab * (1 - es(t, 1.9, 2.0)) * Math.sin(t * 60) * 5;
      const fall = es(t, 2.02, 2.08);
      const bow = es(t, 2.08, 2.35);
      const drag = es(t, 3.12, 3.48, (x) => x);
      const inPrison = es(t, 3.46, 3.52);
      const refuse = bump(t, 3.0, 3.3);

      const dx = t < 3.15 ? dxW + grab * 60 : lerp(760, 950, drag);
      debtor.set({ x: dx, y: FY + 4, s: 0.94, flip: t > 3.15 ? false : false, walk: (outK > 0 && outK < 1) || (drag > 0 && drag < 1) ? dx * 0.06 : undefined, lean: grab * 8 * (1 - fall), armF: t < 0.4 ? 20 + Math.sin(outK * 20) * 20 : 20 + grab * 70 * (1 - fall) + es(t, 3.15, 3.25) * 50, armB: t < 0.4 ? 20 - Math.sin(outK * 20) * 20 : 30 * grab * (1 - fall) + refuse * 70, head: -4 + Math.sin(t * 40) * 6 * refuse, blink: blinkAt(T, 2) });
      debtor.mood({ angry: es(t, 1.0, 1.15) });
      const [fhx, fhy] = headAt(fx0, FY + 2, 0.9, true);
      fellow.set({ x: fx0 + shake * 0.4, y: FY + 2, s: 0.9, flip: true, o: 1 - fall, walk: fIn > 0 && fIn < 1 ? fx0 * 0.06 : undefined, lean: -grab * 12, head: grab * -12 + shake, armF: 20 + grab * 50, armB: grab * 80, blink: blinkAt(T, 5) });
      fellow.mood({ sad: es(t, 0.8, 1.0), tear: es(t, 1.4, 1.6) });
      fellowK.set({ x: t < 3.15 ? 812 : lerp(812, 1010, drag), y: FY + 6, s: 0.9, flip: true, o: fall * (1 - inPrison), lean: bow * 30 * (1 - es(t, 3.1, 3.2)), armF: 60 + bow * 40, armB: 50 + bow * 60, head: -bow * 8, blink: blinkAt(T, 5) });
      fellowK.mood({ sad: 1, tear: 1 });
      const [dhx, dhy] = headAt(dx, FY + 4, 0.94, false);
      const pk = es(t, 1.15, 1.3, ease.back) * (1 - es(t, 1.95, 2.02));
      pose(pay, { x: dhx + 10, y: dhy - 24, s: pk, o: pk > 0.01 ? 1 : 0 });
      const plk = es(t, 2.3, 2.45, ease.back) * (1 - es(t, 2.98, 3.02));
      pose(plea, { x: 846, y: FY - 170, s: plk, o: plk > 0.01 ? 1 : 0 });
      pose(no, { x: dhx - 22, y: dhy - 16, s: refuse > 0.05 ? 1 : 0, o: refuse > 0.05 ? 1 : 0 });
      const [rx, ry] = hand(dx, FY + 4, 0.94, false, 70);
      pose(rope, { x: rx, y: ry, sx: 0.9, r: 20, o: drag > 0 && inPrison < 1 ? 1 : 0 });

      /* the jailer opens, pushes him in, shuts the door; the face at the window */
      const open = es(t, 3.22, 3.36) * (1 - es(t, 3.5, 3.62));
      pose(V.door, { x: V.doorX, y: FY - 18, sx: 1 - open * 1.1 });
      jailer.set({ x: 1238, y: FY + 2, s: 0.92, flip: true, o: es(t, 3.0, 3.1), armF: 20 + bump(t, 3.3, 3.7) * 60, armB: 30, blink: blinkAt(T, 8) });
      const peer = es(t, 3.6, 3.7);
      face.set({ x: V.win[0] - 2, y: V.win[1] + 167 * 0.8 + 6, s: 0.8, flip: true, o: peer, head: 8, blink: blinkAt(T, 5) });
      face.mood({ sad: 1, tear: 1 });
      pose(bars, { x: V.win[0], y: V.win[1] });
      fade(bars, peer);

      S.cam.x = kf(t, [[0, -20], [0.5, 20], [2.0, 20], [3.1, 30], [3.6, 70]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.04], [1.2, 1.07], [2.0, 1.07], [3.0, 1.04]]);
    };
  },
};
