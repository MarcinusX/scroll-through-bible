// Łk 10,25–26 — morning under the great terebinth at the edge of a village; the road runs down between the hills and
// Jerusalem stands on the far horizon. Jesus sits on a stone and teaches, the people sit round Him in the grass. "And
// behold, a lawyer stood up to test Him": a man in a deep blue robe and a white prayer shawl, the little box of the
// Law on his brow, gets up among them with his scroll — and over his head, on a thread, comes a sealed scroll with a big red "?" on its seal: a trick question. "Teacher,
// what shall I do to inherit eternal life?": his question comes out in a bubble with a picture in it — a gate of light,
// and a question mark. "What is written in the Law? How do you read it?": Jesus lifts His hand, and the great scroll
// of the Law comes down between them and opens; the lawyer looks up at it.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { shadeSet, SHADE, lawyer, lawScroll, stillGroup, folk, bubble, question, glow, kf, handAt, headAt, MORNING, STRING, es, ease, bump, seg, PI } from './lib.js';
import { scrollRolled } from '../mark2/lib.js';
import { lifeGate } from '../mark9/lib.js';

const { JX, JY } = SHADE;
const LX = 1040, LY = 722;

export default {
  id: 'lk10-lawyer',
  beats: [
    { v: 25, text: 'A oto powstał jakiś uczony w Prawie i wystawiając Go na próbę, zapytał:' },
    { v: 25, cont: true, text: '«Nauczycielu, co mam czynić, aby osiągnąć życie wieczne?»' },
    { v: 26 },
  ],
  cam: { x: [-30, 60], y: [-80, 40], z: [1, 1.1] },
  build(S) {
    const V = shadeSet(S, { skyCols: MORNING });
    const c = S.c;
    const pc = makeCutter('lk10-shade-people');

    /* the Law, coming down */
    const flies = S.layer({ par: 0.3, sh: 6 });
    const law = flies.add(`<g>${lawScroll(c, 280, 150)}</g>`);

    /* the listeners (still), Jesus, the lawyer */
    const crowdL = S.layer({ par: 0.4, sh: 4 });
    // phone: the listeners on the grass drawn in from the edges
    (S.portrait ? [[505, 748, false], [615, 756, false], [1045, 756, true], [1420, 748, true]] : [[430, 748, false], [560, 756, false], [1180, 756, true], [1300, 748, true]]).forEach(([x, y, flip]) => {
      crowdL.sprite(stillGroup(pc, [0, 1].map((k) => ({ x: (k - 0.5) * 60, y: k * 6, s: 0.9, flip, o: { ...folk(pc), pose: 'sit' }, armF: 30, armB: 10, head: -4 }))), x, y);
    });
    const P = S.layer({ par: 0.42, sh: 5 });
    const aura = P.add(`<g>${glow(160, 0.5)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const tq = sheet().p(c.cut(c.rect(-46, -14, 92, 28), 0.4, 5), C.parchment).p(c.cut(c.ell(-48, 0, 7, 16, 10), 0.2, 3) + c.cut(c.ell(48, 0, 7, 16, 10), 0.2, 3), C.wood2).p(c.ribbon([[-8, -15], [-8, 15]], 5), C.terracotta).p(c.cut(c.circ(-8, 4, 20, 18), 0.3, 3), C.terracotta).out();
    const trap = P.add(`<g><path d="M0 -2000V-14" stroke="rgba(74,54,34,.55)" stroke-width="1.3"/>${tq}<text x="-8" y="13" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="28" font-weight="600" fill="${C.cream}">?</text></g>`);
    const held = `<g transform="rotate(80) translate(0 -6)">${scrollRolled(c, 40)}</g>`;
    const lawSit = S.puppet(P.add(lawyer(c, { pose: 'sit', holdF: held })));
    const lawStand = S.puppet(P.add(lawyer(c, { holdF: held })));

    /* his question */
    const W = S.layer({ par: 0.44, sh: 5 });
    const g = lifeGate(c, { w: 56, h: 74 });
    const ask = W.add(`<g>${bubble(c, ['          ', '          ', '          '], { size: 20, tail: 1, w: 150 })}<g transform="translate(-16 -24)">${g.light}${g.arch}</g><g transform="translate(40 -62) scale(.62)">${question(c)}</g></g>`);

    return (t, time) => {
      const T = time;
      V.update(T);

      /* v25a — he stands up to test Him */
      const up = es(t, 0.12, 0.2);
      const step = es(t, 0.2, 0.5);
      const lx = LX - step * 40;
      lawSit.set({ x: LX, y: LY, s: 0.94, flip: true, armF: 40, armB: 10, head: 0, o: 1 - up, blink: blinkAt(T, 5) });
      lawStand.set({ x: lx, y: LY - 4, s: 1.0, flip: true, walk: step > 0 && step < 1 ? step * 12 : undefined, armF: 40 + bump(t, 1.0, 1.9) * 40 + es(t, 2.2, 2.4) * 20, armB: 20 + bump(t, 1.1, 1.8) * 60, head: -4 - es(t, 2.3, 2.5) * 16, o: up, blink: blinkAt(T, 5) });
      const tk = es(t, 0.35, 0.6, ease.out) * (1 - es(t, 1.9, 2.1));
      pose(trap, { x: lx - 40, y: lerp(-300, 470, tk), r: T ? Math.sin(T * 1.2) * 3 : 0, o: tk > 0.01 ? 1 : 0 });

      /* v25b — "Teacher, what shall I do to inherit eternal life?" */
      const [hx, hy] = headAt(lx, LY - 4, 1.0, true);
      const ak = es(t, 1.05, 1.2, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(ask, { x: hx - 80, y: hy - 30, s: ak, o: ak > 0.01 ? 1 : 0 });

      /* v26 — "What is written in the Law?" */
      const point = es(t, 2.05, 2.25);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: false, armF: 30 + bump(t, 0.0, 0.9) * 30 + point * 100, armB: 10 + point * 20, head: -2 - point * 10, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 110, o: 0.5 });
      const lk = es(t, 2.1, 2.45, ease.out);
      pose(law, { x: 930, y: lerp(-600, 250, lk), r: T ? Math.sin(T * 0.8) * lk : 0, o: lk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [0.4, 40], [1.9, 40], [2.2, 20], [3, 20]]);
      S.cam.y = kf(t, [[0, 20], [1.9, 20], [2.3, -40], [3, -40]]);
      S.cam.z = kf(t, [[0, 1.02], [0.5, 1.06], [1.9, 1.06], [2.3, 1.02], [3, 1.02]]);
    };
  },
};
