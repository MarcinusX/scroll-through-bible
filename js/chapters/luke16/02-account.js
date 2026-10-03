// Łk 16,2 — the parable flies in: the rich man's estate in the morning — the walled court with its gateway and garden
// bed, his olive groves and fields over the wall, and on the right his house with its portico, where he sits in his
// chair on the dais. "He called him and said to him: What is this I hear about you?": the manager comes in through
// the court with his account book and the great key of the house at his belt; the master beckons him and points —
// and over the master hangs the tale he has heard: the spilt purse and the scattered coins. "Give an account of your
// management, for you can no longer be manager": the master holds out his hand; the account book goes up to him and
// the key comes off the manager's belt and into the master's hand; the manager's head sinks.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { estateSet, ES, say, speech, purse, coin, ledger, bigKey, handAt, headAt, kf, moving, tr, es, ease, bump, seg, PI, MASTER, STEWARD } from './lib.js';

const GY = ES.GY, DAIS = ES.DAIS;
const SX = 850;          // where the manager stands before the dais

export default {
  id: 'lk16-account',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 2, text: 'Przywołał go do siebie i rzekł mu: "Cóż to słyszę o tobie?' },
    { v: 2, cont: true, text: 'Zdaj sprawę z twego zarządu, bo już nie będziesz mógł być rządcą".' },
  ],
  cam: { x: [-20, 230], y: [-20, 40], z: [1, 1.14] },
  build(S) {
    const E = estateSet(S);
    const c = E.c;
    const master = S.puppet(E.act.add(person(c, MASTER)));
    const stew = S.puppet(E.act.add(person(c, STEWARD)));
    const book = E.front.add(`<g>${ledger(c, 56)}</g>`);
    const key = E.front.add(`<g>${bigKey(c)}</g>`);
    const what = E.W.add(`<g opacity="0">${say(c, tr('Cóż to słyszę o tobie?', 'What is this I hear about you?'), { size: 19, side: -1 })}</g>`);
    const tale = E.W.add(`<g opacity="0">${speech(c, `<g transform="translate(-10 -18) scale(.6)">${purse(c)}</g><g transform="translate(14 8)">${coin(c, 5)}</g><g transform="translate(-20 12)">${coin(c, 5)}</g><g transform="translate(2 16)">${coin(c, 4)}</g>`, { w: 70, h: 52, flip: false })}</g>`);
    const give = E.W.add(`<g opacity="0">${say(c, [tr('Zdaj sprawę z zarządu,', 'Give an account of your management,'), tr('już nie będziesz rządcą!', 'you can no longer be manager!')], { size: 18, side: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      E.update(T);
      /* v2a — he is called in; "What is this I hear?" */
      const SK = [[-0.4, 470], [0.3, SX]];
      const sx = kf(t, SK);
      const shame = es(t, 1.4, 1.6);
      const hand = es(t, 1.2, 1.35) * (1 - es(t, 1.6, 1.7));
      stew.set({ x: sx, y: GY, s: 1.0, walk: moving(t, SK) ? sx * 0.06 : undefined, armF: 20 + hand * 60, armB: 10, head: shame * 14, lean: shame * 4, blink: blinkAt(T, 3) });
      const beckon = bump(t, 0.05, 0.4);
      const point = es(t, 0.35, 0.5) * (1 - es(t, 0.95, 1.1));
      const holdOut = es(t, 1.15, 1.3);
      master.set({ x: ES.CHAIR - 90, y: DAIS, s: 1.02, flip: true, armF: 30 + beckon * 50 + point * 50 + holdOut * 40, armB: 10 + point * 20, head: -4 + point * 4, blink: blinkAt(T, 1) });
      const [mhx, mhy] = headAt(ES.CHAIR - 90, DAIS, 1.02, true);
      const wk = es(t, 0.3, 0.42, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(what, { x: mhx - 14, y: mhy - 22, s: wk, o: wk > 0.01 ? 1 : 0 });
      const tk = es(t, 0.5, 0.62, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(tale, { x: mhx + 22, y: mhy - 22, s: tk, o: tk > 0.01 ? 1 : 0 });
      const gk = es(t, 1.08, 1.2, ease.back) * (1 - es(t, 1.92, 2.0));
      pose(give, { x: mhx - 14, y: mhy - 22, s: gk, o: gk > 0.01 ? 1 : 0 });

      /* v2b — the account book goes up; the key comes off his belt into the master's hand */
      const [shx, shy] = handAt(sx, GY, 1.0, false, 20 + hand * 60);
      const [mx, my] = handAt(ES.CHAIR - 90, DAIS, 1.02, true, 30 + holdOut * 40);
      const bk = es(t, 1.3, 1.55);
      const lapX = ES.CHAIR + 26, lapY = DAIS - 44;
      pose(book, { x: lerp(shx + 6, lapX, bk), y: lerp(shy + 8, lapY, bk) - Math.sin(bk * PI) * 40, r: -bk * 10 });
      const kk = es(t, 1.5, 1.75);
      const beltX = sx + 14, beltY = GY - 92;
      pose(key, { x: lerp(beltX, mx - 4, kk), y: lerp(beltY, my - 4, kk) - Math.sin(kk * PI) * 70, r: lerp(90, -30, kk), s: 0.9 });

      S.cam.x = kf(t, [[-0.5, 30], [1.0, 40], [1.4, 50]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.4, 30], [1.4, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.4, 1.12], [1.2, 1.12], [1.6, 1.14]]);
      if (S.portrait) S.cam.x += 170;   // phone: the master, his words and the tale over him clear of the thread
    };
  },
};
