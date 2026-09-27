// J 20,24–25 — The same room by day, shutters closed. The door opens and Thomas comes in — "Thomas, called Didymus,
// the Twin" (a tag with two little faces). He was not there when Jesus came: a round memory-plate shows that evening,
// the light in the middle of the room, and a dotted empty outline where he should have stood. The others crowd round
// him: "We have seen the Lord!" He folds his arms and names his conditions, one picture-card at a time: to see the
// marks in His hands (only a small light on a palm), to put his finger there, to put his hand into His side — "I will
// not believe": he turns his face away, a little grey cloud over his head, and a grey veil falls over the cards.
import { C, person, blinkAt, pose, lerp, hanging, swing, mix, shade } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  THOMAS, CAST, eveningRoom, RDOOR, MID, headAt, nameTag, miniHead, vignette, bubble, risenIcon, speech, card, conditionIcon,
  foldedArms, withFolded, withFace, faceBits, worryCloud, question, markLight, tr, PI,
} from './lib.js';

const TX = 800, TY = 754;

export default {
  id: 'j20-thomas',
  beats: [
    { v: 24, text: 'Ale Tomasz, jeden z Dwunastu, zwany Didymos,' },
    { v: 24, cont: true, text: 'nie był razem z nimi, kiedy przyszedł Jezus.' },
    { v: 25, text: 'Inni więc uczniowie mówili do niego: «Widzieliśmy Pana!»' },
    { v: 25, cont: true, text: 'Ale on rzekł do nich: «Jeżeli na rękach Jego nie zobaczę śladu gwoździ' },
    { v: 25, cont: true, text: 'i nie włożę palca mego w miejsce gwoździ,' },
    { v: 25, cont: true, text: 'i nie włożę ręki mojej do boku Jego,' },
    { v: 25, cont: true, text: 'nie uwierzę».' },
  ],
  cam: { x: [0, 120], y: [-30, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const E = eveningRoom(S, { night: false });
    const { door, crew, jesus } = E;
    const tEl = E.PL.add(withFolded(withFace(person(c, { ...THOMAS }), faceBits(c)), foldedArms(c, THOMAS)));
    const thomas = S.puppet(tEl);
    const fold = tEl.querySelector('.fold');
    const tSad = tEl.querySelector('[data-part="angry"]');

    const fx = S.layer({ par: 0.56, sh: 5 });
    const twins = `<g transform="translate(-20 -26)">${miniHead(c, THOMAS, 11)}</g><g transform="translate(20 -26) scale(-1 1)">${miniHead(c, THOMAS, 11)}</g>`;
    const tag = fx.add(`<g>${nameTag(c, tr(['Tomasz, zwany', 'Didymos – Bliźniak'], ['Thomas, called', 'Didymus – the Twin']), { size: 16 })}${twins}</g>`);
    // the memory: that evening, and the empty place
    const mem = sheetMemory(c);
    const plate = hanging(fx, vignette(S, mem, { r: 118, fill: '#2b3060', k: 'mem' }), { x: 0, y: 0, len: 700 });
    // "We have seen the Lord!"
    const seen = fx.add(`<g>${bubble(c, tr('Widzieliśmy Pana!', 'We have seen the Lord!'), { size: 21, tail: 1 })}</g>`);
    const seen2 = [0, 1, 2].map(() => fx.add(`<g>${speech(c, `<g transform="scale(.62)">${risenIcon(c)}</g>`, { w: 58, h: 52 })}</g>`));
    // the three conditions
    const CARDS = ['see', 'finger', 'side'].map((k, i) => {
      const el = hanging(fx, card(c, `${conditionIcon(c, k)}<g class="veil" opacity="0"><rect x="-54" y="-58" width="108" height="116" fill="${mix(C.storm, C.stone2, 0.4)}" opacity=".7"/></g>`, { w: 118, h: 124 }), { x: 0, y: 0, len: 700 });
      return { el, veil: el.querySelector('.veil'), i, x: [600, 800, 1000][i] };
    });
    const cloud = fx.add(`<g>${worryCloud(c, 70)}</g>`);
    const q = fx.add(`<g>${question(c)}</g>`);

    function sheetMemory(cc) {
      const fig = (o, x, sc = 0.28, flip = false) => `<g transform="translate(${x} 70) scale(${flip ? -sc : sc} ${sc})">${person(cc, { ...o })}</g>`;
      const ghost = `<g transform="translate(42 70) scale(.28)"><path d="M-30 0L-26 -140L0 -150L26 -140L32 0Z M-18 -150a20 20 0 1 1 40 0a20 20 0 1 1 -40 0" fill="none" stroke="${C.cream}" stroke-width="6" stroke-dasharray="14 12"/></g>`;
      return `<rect x="-130" y="40" width="260" height="100" fill="#4a3f5e"/><circle cx="0" cy="10" r="90" fill="url(#halo-glow)"/>`
        + fig(CAST.peter, -80) + fig(CAST.john, -46) + fig(CAST.andrew, 82, 0.28, true) + fig(CAST.james, 110, 0.26, true)
        + fig(CAST.jesus, 0, 0.32) + ghost;
    }

    return (t, T) => {
      E.R.update(T, 0);
      jesus.set({ x: MID.x, y: MID.y, s: MID.s, o: 0 });
      /* v24a: Thomas comes in */
      const open = es(t, 0.02, 0.2, ease.out) * (1 - es(t, 0.75, 0.95));
      door.set(open);
      door.bolt(es(t, 0.85, 1.0));
      const walk = es(t, 0.1, 0.7, ease.out);
      const tx = lerp(RDOOR.d0 + 50 + S.cam.x * 0.22, TX, walk);
      const folded = es(t, 3.1, 3.25) * (1 - es(t, 6.9, 7));
      const away = es(t, 6.05, 6.25);
      const faceLeft = t < 2.9 ? true : away < 0.5;
      const hearTurn = bump(t, 2.05, 2.95);
      thomas.set({ x: tx, y: TY, s: 1.02, flip: hearTurn > 0.5 ? false : faceLeft, o: seg(t, 0.1, 0.16), walk: walk > 0 && walk < 1 ? tx * 0.06 : undefined, amt: 0.9, armF: 20 + bump(t, 1.2, 1.9) * 20, armB: 12, head: -es(t, 1.1, 1.4) * 14 * (1 - es(t, 1.9, 2.1)) + folded * 4 + (T ? Math.sin(T * 5) * 5 * bump(t, 3.2, 3.9) : 0) + away * 6, lean: -folded * 3, blink: blinkAt(T, 5) });
      fade(thomas.armF, 1 - folded); fade(thomas.armB, 1 - folded); fade(fold, folded);
      fade(tSad, folded * 0.8);
      const [thx, thy] = headAt(tx, TY, 1.02, faceLeft);
      const tg = es(t, 0.45, 0.65, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(tag, { x: thx, y: thy - 150, s: tg, o: tg > 0.01 ? 1 : 0 });

      /* v24b: he was not with them when Jesus came */
      const mk = es(t, 1.05, 1.3, ease.back) * (1 - es(t, 1.9, 2.1, ease.in));
      swing(plate, TX, lerp(-700, 300, mk), mk > 0.001 ? T : 0, 1, 0.6);
      fade(plate, mk > 0.001 ? 1 : 0);

      /* v25a: "We have seen the Lord!" — they crowd round him */
      const tell = es(t, 2.05, 2.3) * (1 - es(t, 3.0, 3.3) * 0.7);
      crew.forEach((m, i) => {
        const flip = m.x > TX;
        const lean = tell * (flip ? -1 : 1) * 6;
        m.p.set({ x: m.x + (flip ? -1 : 1) * tell * 26, y: m.y, s: m.s, flip, lean, armF: 30 + tell * 50, armB: 12 + tell * (i % 3 === 0 ? 110 : 30), head: -tell * 4 + es(t, 6.05, 6.3) * 8, blink: blinkAt(T, m.seed) });
        fade(m.sad, es(t, 6.05, 6.3) * 0.6);
      });
      const P = E.by.peter;
      const [phx, phy] = headAt(P.x + tell * 26, P.y, P.s, false);
      const sk = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.92, 3.02));
      pose(seen, { x: phx + 20, y: phy - 30, s: sk, o: sk > 0.01 ? 1 : 0 });
      [E.by.john, E.by.philip, E.by.james].forEach((m, i) => {
        const flip = m.x > TX;
        const [hx, hy] = headAt(m.x + (flip ? -1 : 1) * tell * 26, m.y, m.s, flip);
        const k = es(t, 2.2 + i * 0.1, 2.4 + i * 0.1, ease.back) * (1 - es(t, 2.92, 3.02));
        pose(seen2[i], { x: hx + (flip ? -10 : 10), y: hy - 30, s: k, sx: flip ? -1 : 1, o: k > 0.01 ? 1 : 0 });
      });

      /* v25b–d: his three conditions, card by card */
      CARDS.forEach((cd) => {
        const k = es(t, 3.1 + cd.i, 3.4 + cd.i, ease.back) * (1 - es(t, 6.85, 7));
        swing(cd.el, cd.x, lerp(-700, 250, k), k > 0.001 ? T : 0, 1.2, 0.8, cd.i);
        fade(cd.veil, es(t, 6.1 + cd.i * 0.08, 6.3 + cd.i * 0.08));
      });

      /* v25e: "I will not believe" */
      const ck = es(t, 6.1, 6.35, ease.back);
      pose(cloud, { x: thx + (faceLeft ? 10 : -10), y: thy - 50 + (T ? Math.sin(T * 1.4) * 2 : 0), s: ck, o: ck > 0.01 ? 1 : 0 });
      const qk = es(t, 6.2, 6.4, ease.back);
      pose(q, { x: thx + (faceLeft ? -50 : 50), y: thy - 70, s: qk * 1.2, r: -8, o: qk > 0.01 ? 1 : 0 });

      S.cam.x = 60 - es(t, 0.3, 0.8) * 40;
      S.cam.y = 30 - es(t, 1.0, 1.3) * 40 * (1 - es(t, 1.9, 2.2)) - es(t, 3.0, 3.3) * 30;
      S.cam.z = 1.04 + es(t, 2, 2.3) * 0.04 * (1 - es(t, 2.9, 3.1));
    };
  },
};
