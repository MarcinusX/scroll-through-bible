// Łk 11,29–30 — the village square as more and more people crowd in from both sides. "This generation is an evil
// generation": Jesus lifts His hand over them, and the day darkens a little. "It seeks a sign": hands go up all over the
// crowd, and the empty frame they want comes down, a question in it — "but no sign will be given to it except the sign
// of Jonah": the question is gone and the frame is filled — the great fish in the waves casting Jonah out onto the
// shore. "As Jonah became a sign to the people of Nineveh": the picture turns to Nineveh — Jonah preaching before its
// walls and the Ninevites kneeling in sackcloth — "so will the Son of Man be to this generation": the light round
// Jesus grows, rays go out from Him over the crowd.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { villageSet, VQ, panel, panelSky, panelGround, greatFish, JONAH, SACK, figure, crowdMarkup, qMark, glow, rayBurst, kf, PI, GLOOM } from './lib.js';

const F = VQ.FEET;
const PX = 800, PY = 290, PW = 330, PH = 200;

/** Nineveh: walls and towers across the back of a panel (panel coords) */
function nineveh(c) {
  const s = sheet();
  const col = mix(C.sand2, C.clay, 0.3);
  s.p(c.cut([[-170, 40], [-170, -30], [170, -30], [170, 40]], 0.5, 8), col);
  let bat = '';
  for (let x = -168; x < 168; x += 16) bat += c.cut(c.rect(x, -38, 9, 9), 0.2, 3);
  s.p(bat, col);
  [[-120, -80], [-30, -96], [60, -84], [140, -70]].forEach(([x, top]) => { s.p(c.cut(c.rect(x - 16, top, 32, 40 - top), 0.4, 5), shade(col, -0.08)); s.p(c.cut([[x - 18, top], [x + 18, top], [x, top - 20]], 0.3, 4), C.terracotta); });
  s.p(c.cut([[-12, 40], [-12, 6], ...c.arc(0, 6, 12, 10, PI, 2 * PI, 6), [12, 6], [12, 40]], 0.3, 4), C.soilDark);
  return s.out();
}

export default {
  id: 'lk11-jonah',
  beats: [
    { v: 29, text: 'A gdy tłumy się gromadziły, zaczął mówić: «To plemię jest plemieniem przewrotnym.' },
    { v: 29, cont: true, text: 'Żąda znaku, ale żaden znak nie będzie mu dany, prócz znaku Jonasza.' },
    { v: 30 },
  ],
  cam: { x: [-20, 40], y: [-70, 50], z: [1, 1.12] },
  build(S) {
    const Q = villageSet(S, { sky2: GLOOM, dis: ['peter', 'john'], ph: 3 });
    const c = Q.c;
    const q = makeCutter('lk11-jonah-p');
    /* more people crowding in from both sides (sprites) */
    const more = [['lk11-jmL', -1], ['lk11-jmR', 1]].map(([seed, d]) => ({ d, calm: Q.crowdL.sprite(crowdMarkup(seed, 8, { s: 0.66, spread: 44, rows: 2, flip: d > 0 }), 800 + d * 520, 660), up: Q.crowdL.sprite(crowdMarkup(seed, 8, { s: 0.66, spread: 44, rows: 2, flip: d > 0, armF: [100, 150], armB: [20, 60], head: [-14, -6] }), 800 + d * 520, 660) }));
    /* the panels: the empty frame with the question; the fish and Jonah; Jonah at Nineveh */
    const p0 = Q.flyL.add(panel(S, panelSky(S, PW, PH, ['#c9dcd8', '#f3e6c8']), { w: PW, h: PH, face: C.cream }));
    const qm = Q.flyL.add(`<g opacity="0">${qMark(q, 90)}</g>`);
    const sea = panelSky(S, PW, PH, ['#bcd6d6', '#f1e6cc']) + sheet().p(q.cut([[-PW / 2 - 4, 20], [-60, 10], [-PW / 2 - 4, 110]], 0.5, 6), C.lake2).out()
      + sheet().p(q.cut([[-PW / 2 - 4, 30], [0, 26], [PW / 2 + 4, 36], [PW / 2 + 4, PH / 2 + 4], [-PW / 2 - 4, PH / 2 + 4]], 0.6, 8), C.lake).out()
      + sheet().p(q.cut([[20, 60], [80, 40], [PW / 2 + 4, 36], [PW / 2 + 4, PH / 2 + 4], [0, PH / 2 + 4]], 0.6, 8), mix(C.sand, C.dune, 0.3)).out()
      + `<g transform="translate(-60 40) scale(.62)">${greatFish(q, { w: 300 })}</g>`
      + figure(q, { ...JONAH, pose: 'kneel' }, { x: 70, y: 76, s: 0.46, armF: 60, armB: 90, head: -14 });
    const p1 = Q.flyL.add(panel(S, sea, { w: PW, h: PH }));
    const nin = panelSky(S, PW, PH, ['#d8c9a8', '#f2e2c2']) + `<g transform="translate(20 10) scale(.9)">${nineveh(q)}</g>` + panelGround(q, PW, 50, mix(C.sand, C.dune, 0.35))
      + figure(q, JONAH, { x: -118, y: 96, s: 0.5, armF: 60, armB: 150, head: -6 })
      + [[-30, 92], [14, 96], [58, 92], [100, 96], [140, 92]].map(([x, y], i) => figure(q, { robe: mix(SACK, C.sand2, 0.2), hair: C.hair3, hairStyle: i % 2 ? 'veil' : 'wrap', veil: mix(SACK, C.stone, 0.3), beard: i % 2 ? 'none' : 'full', skin: [C.skin2, C.skin3, C.skin4][i % 3], belt: C.rope, pose: 'kneel' }, { x, y, s: 0.4, flip: true, armF: 40, armB: 60, head: 16 })).join('');
    const p2 = Q.flyL.add(panel(S, nin, { w: PW, h: PH }));
    /* the light of the Son of Man */
    const rays = Q.rayFx.add(`<g opacity="0">${rayBurst(c, { n: 20, r0: 50, r1: 420, spread: 0.04, color: '#fff3cf', o: 0.5 })}</g>`);
    const halo = Q.rayFx.add(`<g opacity="0">${glow(190, 1, 'halo-glow')}</g>`);

    return (t, time) => {
      const T = time;
      /* v29a — the crowds gather; "an evil generation" */
      const gather = es(t, -0.3, 0.5);
      const demand = es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.1));
      more.forEach((m) => {
        const x = 800 + m.d * lerp(900, 560, gather);
        m.calm.set({ x, y: 668, o: gather * (1 - demand) });
        m.up.set({ x, y: 668, o: gather * demand });
      });
      Q.amaze(demand);
      Q.sk2.layer.fade(es(t, 0.3, 0.7) * 0.5 * (1 - es(t, 2.3, 2.6)));
      const lift = es(t, 0.3, 0.5);
      const glowK = es(t, 2.4, 2.7);
      Q.pose(t, T,
        { armF: 16 + lift * 50 + glowK * 20, armB: 8 + lift * 80 * (1 - glowK) + glowK * 110, head: -4, blink: blinkAt(T, 2) },
        (d) => ({ head: -4, blink: blinkAt(T, d.seed) }),
        (m) => ({ armF: 8 + demand * 120, armB: 4 + demand * 30, head: -demand * 16, blink: blinkAt(T, m.seed) }));

      /* v29b — the sign they want; the sign of Jonah */
      const drop = (a, b) => es(t, a, a + 0.28, ease.out) * (1 - es(t, b - 0.2, b, ease.in));
      const k0 = drop(1.05, 1.62), k1 = drop(1.5, 2.2), k2 = drop(2.05, 9);
      const Y = (k) => lerp(-1500, PY, k);
      [[p0, k0], [p1, k1], [p2, k2]].forEach(([el, k], i) => pose(el, { x: PX, y: Y(k), r: T ? Math.sin(T * 0.7 + i) * 0.5 * k : 0, o: k > 0.002 ? 1 : 0 }));
      const qk = es(t, 1.2, 1.3, ease.back) * (1 - es(t, 1.4, 1.46));
      pose(qm, { x: PX, y: PY, s: qk, o: qk > 0.01 && k0 > 0.9 ? 1 : 0 });

      /* v30 — so the Son of Man to this generation */
      pose(halo, { x: VQ.JX, y: F - 120, s: 0.6 + glowK * 0.6, o: glowK });
      pose(rays, { x: VQ.JX, y: F - 120, s: 0.5 + glowK * 0.6, r: T * 3, o: glowK * 0.9 });

      S.cam.y = kf(t, [[-0.5, 20], [0.6, 10], [1.0, -40]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.6, 1.04], [1.0, 1.02]]);
      S.cam.x = kf(t, [[-0.5, 0]]);
    };
  },
};
