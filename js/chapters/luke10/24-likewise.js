// Łk 10,36–37 — back under the terebinth. "Which of these three, do you think, proved to be a neighbour to the man who
// fell among the robbers?": three small portraits come down on strings — the priest, the Levite, the Samaritan — and
// Jesus looks at the lawyer. "He answered: The one who showed him mercy": he cannot bring himself to say "the
// Samaritan", but his finger goes to the third portrait: it warms and glows, and the other two go grey. "And Jesus said
// to him: Go, and do likewise!": Jesus stretches His hand out toward the road; the circle the lawyer drew in the dust is
// gone, and he turns and goes down the road — where a poor man sits at the roadside — and he stops and bends to him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { shadeSet, SHADE, lawyer, stillGroup, folk, cameo, glow, heart, kf, moving, handAt, headAt, tr, MORNING, PRIEST, LEVITE, SAMARITAN, STRING, es, ease, bump, seg, PI } from './lib.js';
import { scrollRolled } from '../mark2/lib.js';

const { JX, JY } = SHADE;
const LX = 1000, LY = 716;
const POOR = { robe: mix(C.stone2, C.sand2, 0.4), hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.rope, pose: 'sit' };

export default {
  id: 'lk10-likewise',
  beats: [
    { v: 36 },
    { v: 37, text: 'On odpowiedział: «Ten, który mu okazał miłosierdzie».' },
    { v: 37, cont: true, text: 'Jezus mu rzekł: «Idź, i ty czyń podobnie!»' },
  ],
  cam: { x: [-20, 120], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const V = shadeSet(S, { skyCols: MORNING });
    const c = S.c;
    const pc = makeCutter('lk10-shade-people');

    /* the three portraits (warm and grey faces) */
    const flies = S.layer({ par: 0.3, sh: 6 });
    const samGlow = flies.add(`<g>${glow(150, 1)}</g>`);
    const PORT = [[PRIEST, ['kapłan', 'priest']], [LEVITE, ['lewita', 'Levite']], [SAMARITAN, ['Samarytanin', 'Samaritan']]].map(([o, n], i) => ({
      i, x: 640 + i * 180, y: 230 + (i === 1 ? -20 : 0),
      warm: flies.add(`<g><path d="M0 -2000V-50" stroke="${STRING}" stroke-width="1.4"/>${i === 2 ? glow(130, 0) : ''}${cameo(makeCutter('lk10-p' + i), S.id('pw' + i), o, tr(n[0], n[1]))}</g>`),
      grey: flies.add(`<g><path d="M0 -2000V-50" stroke="${STRING}" stroke-width="1.4"/>${cameo(makeCutter('lk10-p' + i), S.id('pg' + i), o, tr(n[0], n[1]), { grey: true })}</g>`),
    }));
    const hrt = flies.add(`<g>${heart(c, 16)}</g>`);

    /* the listeners, Jesus, the lawyer, and the poor man down the road */
    const crowdL = S.layer({ par: 0.4, sh: 4 });
    const PT = S.portrait;
    (PT ? [[470, 752, false], [590, 758, false], [1290, 756, true]] : [[400, 752, false], [540, 758, false], [1290, 756, true]]).forEach(([x, y, flip]) => {
      crowdL.sprite(stillGroup(pc, [0, 1].map((k) => ({ x: (k - 0.5) * 60, y: k * 6, s: 0.9, flip, o: { ...folk(pc), pose: 'sit' }, armF: 30, armB: 10, head: -4 }))), x, y);
    });
    const road = S.layer({ par: 0.2, sh: 4 });
    const poor = S.puppet(road.add(person(c, { ...POOR, holdF: `<g transform="translate(0 -4)"><path d="${c.cut([[-9, -8], [9, -8], [6, 2], [-6, 2]], 0.2, 3)}" fill="${C.clay}"/></g>` })));
    const lwFar = S.puppet(road.add(lawyer(c)));
    const P = S.layer({ par: 0.42, sh: 5 });
    const aura = P.add(`<g>${glow(160, 0.5)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const held = `<g transform="rotate(80) translate(0 -6)">${scrollRolled(c, 40)}</g>`;
    const lw = S.puppet(P.add(lawyer(c, { holdF: held })));

    return (t, time) => {
      const T = time;
      V.update(T);

      /* v36 — the three portraits */
      PORT.forEach((p) => {
        const k = es(t, 0.05 + p.i * 0.1, 0.4 + p.i * 0.1, ease.out);
        const chosen = p.i === 2;
        const g = chosen ? 0 : es(t, 1.35, 1.5);
        const sway = T ? Math.sin(T * 0.8 + p.i) * 1.4 : 0;
        const y = lerp(-500, p.y, k) - (chosen ? es(t, 1.3, 1.5) * 20 : 0);
        pose(p.warm, { x: p.x, y, r: sway, s: 1 + (chosen ? es(t, 1.3, 1.5) * 0.15 : 0), o: k > 0.01 ? 1 - g : 0 });
        pose(p.grey, { x: p.x, y, r: sway, o: k > 0.01 ? g : 0 });
      });
      const sg = es(t, 1.3, 1.55);
      pose(samGlow, { x: PORT[2].x, y: PORT[2].y - 20, s: 0.6 + sg * 0.6, o: sg });
      const hk = es(t, 1.45, 1.6, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(hrt, { x: PORT[2].x + 50, y: PORT[2].y - 70, s: hk, o: hk > 0.01 ? 1 : 0 });

      /* v37a — his finger goes to the Samaritan */
      const point = es(t, 1.1, 1.3) * (1 - es(t, 1.9, 2.05));
      /* v37b — "Go and do likewise": he goes down the road to the poor man */
      const go = es(t, 2.25, 2.3);
      const gK = PT ? [[2.3, 1180], [2.7, 1035]] : [[2.3, 1250], [2.7, 1110]];   // phone: the poor man and the lawyer inside the screen
      const gx = kf(t, gK);
      lw.set({ x: LX, y: LY, s: 1.0, flip: true, armF: 40 + point * 110, armB: 20, head: -point * 20 + bump(t, 2.05, 2.25) * 10, o: 1 - go, blink: blinkAt(T, 5) });
      lwFar.set({ x: gx, y: 530, s: 0.46, flip: true, walk: moving(t, gK) ? gx * 0.1 : undefined, armF: 20 + es(t, 2.72, 2.85) * 70, armB: 10, lean: es(t, 2.72, 2.85) * 16, head: es(t, 2.72, 2.85) * 12, o: go, blink: blinkAt(T, 5) });
      poor.set({ x: PT ? 980 : 1050, y: 546, s: 0.46, flip: false, armF: 50 + es(t, 2.75, 2.9) * 30, armB: 10, head: -4 - es(t, 2.75, 2.9) * 10, blink: blinkAt(T, 8) });
      const send = es(t, 2.05, 2.25);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: false, armF: 30 + es(t, 0.1, 0.3) * 30 * (1 - send) + send * 70, armB: 10 + send * 30, head: -2 - send * 4, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 110, o: 0.5 + send * 0.2 });

      S.cam.x = kf(t, [[0, 20], [1, 20], [2.0, 20], [2.4, 100], [3, 100]]);
      S.cam.y = kf(t, [[0, -40], [1.9, -40], [2.3, 0], [3, 0]]);
      S.cam.z = kf(t, [[0, 1.0], [2, 1.0], [2.4, 1.04], [3, 1.04]]);
    };
  },
};
