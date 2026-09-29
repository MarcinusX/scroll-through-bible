// Łk 20,16b–17 — back in the Temple court. "When they heard this, they said: Surely not!": the people throw up their
// hands, "Never!" on both sides of the court, and the leaders stiffen. "But He looked at them and said": the court
// goes still and we come close to Him as He looks at them. "What then is this that is written: The stone which the
// builders rejected has become the head of the corner?": a painted panel comes down — an arch going up on its piers,
// two builders turning a stone over; one shakes his head and they throw it aside onto the rubble; and that very stone
// rises, a little light round it, and drops into the top of the arch as its keystone.
import { C, blinkAt, pose, lerp, sheet, mix, shade } from '../kit.js';
import { courtSet, CQ, panel, panelSky, panelGround, figure, archStones, keystone, crossX, bubble, glowDisc, popAt, dropIn, kf, tr, es, ease, bump, seg, PI } from './lib.js';

const PW = 360, PH = 200, PX = 800, PY = 300;
const AX = 40, AY = 44, AR = 56, AT = 24;

function archInner(S, c) {
  let m = panelSky(S, PW, PH, ['#cfe0dc', '#f4e6c6']);
  m += sheet().p(c.cut([[-PW / 2 - 10, 10], [-60, -6], [80, 4], [PW / 2 + 10, -8], [PW / 2 + 10, 60], [-PW / 2 - 10, 60]], 0.8, 10), mix(C.hillMid, C.sand, 0.3)).out();
  m += panelGround(c, PW, 68, mix(C.sand, C.dune, 0.3), 2);
  const a = archStones(c, AX, AY, AR, AT, 8, mix(C.stone2, C.sand2, 0.45));
  const pier = mix(C.stone, C.plaster2, 0.4);
  m += sheet().p(c.cut(c.rect(AX - AR - AT, AY, AT, 26), 0.4, 5) + c.cut(c.rect(AX + AR, AY, AT, 26), 0.4, 5), pier).out() + a.stones.join('');
  // the rubble heap on the right
  let rub = '';
  for (let i = 0; i < 7; i++) rub += c.cut(c.blob(140 + c.rr(-26, 26), 68 - c.rr(0, 14), c.rr(8, 13), c.rr(5, 8), 7, 0.3), 0.6, 3);
  m += sheet().p(rub, mix(C.rock2, C.stone2, 0.5)).out();
  // two builders on the left
  const B1 = { robe: C.clay, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin4, belt: C.leather };
  const B2 = { robe: C.olive, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope };
  m += figure(c, B1, { x: -130, y: 72, s: 0.46, armF: 70, armB: 40, head: 10 });
  m += figure(c, B2, { x: -62, y: 74, s: 0.46, flip: true, armF: 60, armB: 20, head: 8 });
  return { m, key: a.key };
}

export default {
  id: 'lk20-never',
  beats: [
    { v: 16, cont: true, text: 'Gdy to usłyszeli, zawołali: «Nie, nigdy!»' },
    { v: 17, text: 'On zaś spojrzał na nich i rzekł:' },
    { v: 17, cont: true, text: '«Cóż więc znaczy to słowo Pisma: Właśnie ten kamień, który odrzucili budujący, stał się głowicą węgła?' },
  ],
  cam: { x: [-20, 40], y: [-80, 60], z: [1, 1.24] },
  build(S) {
    const Q = courtSet(S);
    const c = Q.c;
    const inner = archInner(S, c);
    const pan = Q.flyL.add(panel(S, inner.m, { w: PW, h: PH, word: tr('kamień węgielny', 'the cornerstone') }));
    const glowEl = Q.flyL.add(`<g opacity="0">${glowDisc(70, 'halo-glow', 1)}</g>`);
    const stone = Q.flyL.add(`<g>${keystone(c, 34, 36, mix(C.stone, C.sand, 0.4))}</g>`);
    const no = Q.flyL.add(`<g opacity="0">${crossX(c, 16)}</g>`);
    const cries = [0, 1].map((i) => Q.W.add(`<g opacity="0">${bubble(c, tr('Nie, nigdy!', 'May it never be!'), { size: 20, tail: i ? 1 : -1 })}</g>`));

    return (t, time) => {
      const T = time;
      /* v16b — "Never!" */
      const cry = es(t, 0.1, 0.25) * (1 - es(t, 0.95, 1.15));
      cries.forEach((el, i) => popAt(el, t, 0.15 + i * 0.08, 1.05, i ? 1150 : 450, 470 + (T ? Math.sin(T * 2 + i) * 3 : 0), { d: 0.1 }));
      /* v17a — He looks at them */
      const look = es(t, 1.05, 1.3);
      /* v17b — the panel of the rejected stone */
      const pk = dropIn(pan, t, 2.0, undefined, PX, PY, { d: 0.22 });
      const py = lerp(-1500, PY, pk);
      Q.pose(t, T,
        { armF: 16 + es(t, 2.0, 2.2) * 50, armB: 8 + es(t, 2.05, 2.25) * 30, head: -look * 4 + es(t, 2.0, 2.2) * 2, blink: blinkAt(T, 2) },
        (d) => ({ head: -4 + cry * 6, armF: 10 + cry * 50, blink: blinkAt(T, d.seed) }),
        (m) => ({ head: cry * 8 - look * 6, lean: -cry * 5, armF: 8 + cry * 40, armB: 4 + cry * 30, blink: blinkAt(T, m.seed) }));
      Q.amaze(cry);
      // the stone: in the builders' hands → thrown on the rubble → up into the arch
      const toss = es(t, 2.32, 2.44, ease.in), rise = es(t, 2.46, 2.7);
      const [kx, ky] = inner.key;
      let sx = -96, sy = 0, sr = 0;
      if (t > 2.32) { sx = lerp(-96, 140, toss); sy = lerp(0, 50, toss) - Math.sin(toss * PI) * 40; sr = toss * 200; }
      if (t > 2.46) { sx = lerp(140, kx, rise); sy = lerp(50, ky, rise) - Math.sin(rise * PI) * 50; sr = lerp(200, 360, rise); }
      pose(stone, { x: PX + sx, y: py + sy, r: sr, o: pk > 0.98 ? 1 : 0 });
      popAt(no, t, 2.24, 2.42, PX - 96, py - 34, { d: 0.06 });
      const gk = es(t, 2.6, 2.75);
      pose(glowEl, { x: PX + kx, y: py + ky, s: 0.6 + gk * 0.4, o: gk * 0.9 * (pk > 0.98 ? 1 : 0) });

      S.cam.x = kf(t, [[0, 10], [1.0, 10], [1.3, 0], [2.0, 0], [2.3, 0]]);
      S.cam.y = kf(t, [[0, -10], [1.0, -10], [1.3, 40], [2.0, 40], [2.3, -40]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.04], [1.3, 1.22], [2.0, 1.22], [2.3, 1.04]]);
      void seg; void shade; void CQ;
    };
  },
};
