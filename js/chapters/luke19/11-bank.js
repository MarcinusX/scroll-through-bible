// Łk 19,22–23 — the king rises from his throne. "Out of your own mouth I judge you, wicked servant!": the servant's
// own words fly up out of his mouth on a strip of paper and land in the king's hand, and he holds them up over him.
// "You knew that I am a severe man, taking up what I did not lay down, reaping what I did not sow" — the dark shadow
// flickers again on the wall. "Then why did you not put my money in the bank?" — at the side of the hall a money
// changer's table slides in, with its scales and stacks; the dull mina hops out of the handkerchief onto it. "And at my
// coming I would have collected it with interest": on the banker's table the one coin grows into a little shining stack.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { hallSet, storyFrame, KH, NOBLE, SERV, crown, addToHead, mina, kerchief, kingShadow, bankTable, lowTable, minaPile, say, label, strip, sparkle, headAt, hand, kf, tr, es, ease, bump, seg, PI, mix } from './lib.js';
import { BANKER } from '../matthew25/lib.js';

const FL = KH.FL, KX = KH.THX, KY = FL - KH.DAIS * 2 - 58, KS = FL - KH.DAIS * 2;
const TX = 596, PX = 760, BX = 1060;
const DARK = mix(C.soilDark, C.plumRobe, 0.3);

export default {
  id: 'lk19-bank',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 22, text: 'Odpowiedział mu: "Według słów twoich sądzę cię, zły sługo!' },
    { v: 22, cont: true, text: 'Wiedziałeś, że jestem człowiekiem surowym: chcę brać, gdzie nie położyłem, i żąć, gdziem nie posiał.' },
    { v: 23, text: 'Czemu więc nie dałeś moich pieniędzy do banku?' },
    { v: 23, cont: true, text: 'A ja po powrocie byłbym je z zyskiem odebrał".' },
  ],
  cam: { x: [-300, 120], y: [-60, 60], z: [1, 1.24] },
  build(S) {
    const H = hallSet(S);
    const c = S.c;
    const BXP = S.portrait ? 960 : BX;   // phone: the banker's table inside the screen
    const shadow = H.shadowL.add(`<g>${kingShadow(c, DARK, { armF: 90, armB: 20 })}</g>`);
    const A = H.act;
    const kSit = S.puppet(A.add(addToHead(person(c, { ...NOBLE, pose: 'sit' }), crown(c))));
    const kUp = S.puppet(A.add(addToHead(person(c, NOBLE), crown(c))));
    A.add(`<g transform="translate(${TX} ${FL + 4})">${lowTable(c, 130, 40)}</g><g transform="translate(${TX - 30} ${FL - 40})">${minaPile(c, 11, 10)}</g><g transform="translate(${TX + 36} ${FL - 40})">${minaPile(c, 6, 10)}</g>`);
    const others = A.sprite(`<g transform="translate(-50 0) scale(-.86 .86)">${person(c, SERV[0])}</g><g transform="translate(20 6) scale(-.86 .86)">${person(c, SERV[1])}</g>`, 1260, FL + 8);
    const s3k = S.puppet(A.add(person(c, { ...SERV[2], pose: 'kneel' })));
    const kOpen = A.add(`<g>${kerchief(c).open}</g>`);
    const coin = A.add(`<g>${mina(c, 11)}</g>`);
    /* the banker's table, which slides in */
    const bankL = S.layer({ par: 0.5, sh: 5 });
    const banker = S.puppet(bankL.add(person(c, BANKER)));
    const bank = bankL.add(`<g>${bankTable(c, 170)}</g>`);
    const gain = [0, 1, 2].map(() => bankL.add(`<g>${mina(c, 11)}</g>`));
    const fx = H.fx;
    const words = fx.add(`<g>${strip(c, tr('«jesteś człowiekiem surowym»', '“you are an exacting man”'), { size: 17 })}</g>`);
    const judge = fx.add(`<g>${say(c, tr(['Według słów twoich', 'sądzę cię, zły sługo!'], ['Out of your own mouth', 'I judge you, wicked servant!']), { size: 18, side: 1 })}</g>`);
    const why = fx.add(`<g>${say(c, tr(['Czemu nie dałeś', 'moich pieniędzy do banku?'], ['Why didn’t you deposit', 'my money in the bank?']), { size: 18, side: 1 })}</g>`);
    const interest = fx.add(`<g>${label(c, tr('z zyskiem', 'with interest'), { size: 19, fill: C.halo })}</g>`);
    const shine = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 9)}</g>`));
    storyFrame(S);

    const pop = (el, t, a, b, x, y, s = 1) => { const k = es(t, a, a + 0.14, ease.back) * (b === undefined ? 1 : 1 - es(t, b - 0.1, b)); pose(el, { x, y, s: k * s, o: k > 0.02 ? 1 : 0 }); };

    return (t, time) => {
      const T = time;
      /* v22a — he rises: by your own words I judge you */
      const up = es(t, -0.1, 0.02);
      const point = es(t, 0.1, 0.3);
      const hold = es(t, 0.5, 0.7) * (1 - es(t, 1.9, 2.1));
      kSit.set({ x: KX + 4, y: KY, s: 1.02, o: 1 - up, armF: 30, armB: 20, head: 6, blink: blinkAt(T) });
      kUp.set({ x: KX + 16, y: KS, s: 1.04, flip: false, o: up, armF: 30 + point * 60 - hold * 20 + es(t, 2.05, 2.3) * 40 * (1 - es(t, 3.0, 3.2)) + es(t, 3.3, 3.5) * 50, armB: 10, head: 2, blink: blinkAt(T) });
      const cow = 1 - es(t, 2.9, 3.1) * 0.3;
      s3k.set({ x: PX + (T ? Math.sin(T * 28) * 0.8 : 0), y: FL + 12, s: 0.9, flip: true, armF: 50, armB: 20 + cow * 100, head: 16, lean: 10 * cow, blink: blinkAt(T, 8) });
      const [hx, hy] = hand(PX, FL + 12, 0.9, true, 50, 0, 46);
      pose(kOpen, { x: hx - 16, y: hy + 8, s: 0.9 });
      // his own words go up to the king's raised hand
      const [shx, shy] = headAt(PX, FL + 12, 0.9, true, 46);
      const [kbx, kby] = hand(KX + 16, KS, 1.04, false, 30 + point * 60 - hold * 20, 0);
      const wk = es(t, 0.3, 0.6);
      pose(words, { x: lerp(shx - 20, kbx + 90, wk), y: lerp(shy - 20, kby - 16, wk) - Math.sin(wk * PI) * 60, r: lerp(-6, 4, wk), s: 0.9 + wk * 0.2, o: wk > 0.01 && t < 2.05 ? 1 - es(t, 1.9, 2.05) : 0 });
      const [khx, khy] = headAt(KX + 16, KS, 1.04, false);
      pop(judge, t, 0.12, 0.98, khx + 20, khy - 20);
      /* v22b — you knew I am severe (the shadow on the wall again) */
      const sh = bump(t, 1.05, 1.95);
      pose(shadow, { x: KX + 150, y: FL + 30, s: 1.2 + sh * 1.5, o: Math.min(1, sh * 2) });
      /* v23a — why not the bank? */
      const slide = es(t, 2.02, 2.3);
      const bx = lerp(1500, BXP, slide);
      banker.set({ x: bx + 80, y: FL + 6, s: 0.92, flip: true, o: slide > 0.01 ? 1 : 0, armF: 50 + es(t, 3.1, 3.3) * 40, armB: 10, head: 6, blink: blinkAt(T, 12) });
      pose(bank, { x: bx, y: FL + 10, o: slide > 0.01 ? 1 : 0 });
      pop(why, t, 2.05, 2.98, khx + 20, khy - 20);
      const hop = es(t, 2.4, 2.7);
      const top = FL + 10 - 60;
      pose(coin, { x: lerp(hx - 16, bx - 44, hop), y: lerp(hy - 2, top - 10, hop) - Math.sin(hop * PI) * 90, s: 1, o: 1 });
      /* v23b — with interest */
      gain.forEach((g, i) => { const k = es(t, 3.1 + i * 0.1, 3.25 + i * 0.1, ease.back); pose(g, { x: bx - 44 + (i + 1) * 20 - (i === 2 ? 30 : 0), y: top - 10 - (i === 2 ? 20 : 0), s: k, o: k > 0.02 ? 1 : 0 }); });
      pop(interest, t, 3.3, undefined, bx - 20, top - 80);
      shine.forEach((e, i) => { const k = bump(t, 3.2 + i * 0.1, 3.9 + i * 0.1); pose(e, { x: bx - 60 + i * 40, y: top - 40 - (i % 2) * 20, s: k, r: T * 30, o: k > 0.02 ? 1 : 0 }); });
      others.set({ x: 1260, y: FL + 8, o: 1 - slide });

      S.cam.x = kf(t, [[-0.5, -180], [0.5, -160], [1.9, -120], [2.4, 40], [3.2, 60]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.5, 10], [1.1, -20], [2.3, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.14], [0.5, 1.18], [1.1, 1.08], [2.3, 1.16]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, -200], [1.9, -200], [2.4, -80], [3.2, -60]]); S.cam.z = 1.0; }
    };
  },
};
