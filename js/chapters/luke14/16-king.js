// Łk 14,31–32 — a painted flat of a wide plain. On the near hill a king has pitched his tent; his ten thousand stand
// under their standards, and far off across the plain another king comes against him with twenty thousand — twice as
// many, a long column raising dust. The first king sits down at his camp table with his counsellor and weighs it on the
// map: one token against two. Then, while the other is still a great way off, he sends out an embassy: two elders
// walk out across the plain with an olive branch and a sealed scroll, to ask for terms of peace.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, olive, cypress, grass, sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { KING1, KING2, ENVOY, troop, warMap, token, oliveBranch, invitation, label, nameTag, question, storyFrame, headAt, hand, kf, moving, popAt, addToHead, dust, makeCutter, tr, sheet, mix, shade, WAR, PI } from './lib.js';
import { crown } from '../mark6/lib.js';

const GY = 716, KX = 620, MAPX = 740, FARY = 548;

export default {
  id: 'lk14-king',
  enter: 'fly',
  beats: [
    { v: 31 },
    { v: 32 },
  ],
  cam: { x: [-60, 80], y: [0, 120], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    sky(S, WAR);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const SUNX = S.portrait ? 1050 : 1160;   // phone: the sun clear of the progress thread
    const sunEl = hanging(hangL, sun(c, 38), { x: SUNX, y: 190, len: 800 });
    const cls = [[560, 170, 170], [900, 120, 130]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 430, amps: [18, 8, 3], lens: [1000, 360, 120], color: mix(C.hillFar, C.duskViolet, 0.15) }).markup);
    const plain = S.layer({ par: 0.16, sh: 2 });
    plain.add(band(c, { y: 500, amps: [4, 2], lens: [900, 300], color: mix(C.sand, C.hillNear, 0.35) }).markup);
    // the far army: two long companies with their standards, and their dust
    const farL = S.layer({ par: 0.18, sh: 3 });
    const farArmy = farL.sprite(troop('lk14-far1', 14, { s: 0.3, spread: 16, rows: 2 }) + `<g transform="translate(150 6)">${troop('lk14-far2', 14, { s: 0.3, spread: 16, rows: 2 })}</g>` + `<g transform="translate(-60 4) scale(-.36 .36)">${addToHead(person(makeCutter('lk14-k2'), { ...KING2 }), crown(makeCutter('lk14-k2c')))}</g>`, 1020, FARY);
    const dusts = [0, 1, 2].map((i) => farL.add(`<g opacity="0">${dust(c, 40)}</g>`));
    const hillL = S.layer({ par: 0.36, sh: 3 });
    const hfn = (x) => 640 - Math.max(0, 800 - x) * 0.12 + Math.sin(x / 80) * 3;
    hillL.add(sheet().p(c.ridge(hfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sage, 0.3)).out() + grass(c, { x0: -600, x1: 2200, y: 640, fn: hfn, n: 40, h: 12, color: C.moss }) + olive(c, 1250, 650, 0.7) + cypress(c, 200, 700, 130));
    // the king's tent and his ten thousand
    const campL = S.layer({ par: 0.38, sh: 4 });
    campL.add(tentM(c, 330, GY - 16));
    const near = campL.sprite(troop('lk14-near', 10, { s: 0.46, spread: 26, rows: 2 }), 470, GY - 26);
    const pL = S.layer({ par: 0.42, sh: 5 });
    const table = pL.add(`<g>${warMap(c, 170)}</g>`);
    const mine = pL.add(`<g>${token(c, C.teal2)}</g>`);
    const theirs = [0, 1].map(() => pL.add(`<g opacity="0">${token(c, C.curtain2)}</g>`));
    const king = S.puppet(pL.add(addToHead(person(c, { ...KING1, pose: 'sit' }), crown(c))));
    const counsel = S.puppet(pL.add(person(c, { ...ENVOY, pose: 'sit' })));
    const envoys = [0, 1].map((i) => S.puppet(pL.add(person(c, { ...ENVOY, robe: i ? C.linen2 : ENVOY.robe, mantle: i ? C.dustyBlue : ENVOY.mantle, holdF: i ? `<g transform="rotate(90)">${invitation(c, 30)}</g>` : `<g transform="rotate(-80)">${oliveBranch(c, 56)}</g>` }))));
    const tagL = S.layer({ par: 0.3, sh: 4 });
    const t10 = tagL.add(`<g opacity="0">${label(c, tr('10 000', '10,000'), { size: 22 })}</g>`);
    const t20 = tagL.add(`<g opacity="0">${label(c, tr('20 000', '20,000'), { size: 22, fill: mix(C.curtain, C.cream, 0.6) })}</g>`);
    const q = pL.add(`<g opacity="0">${question(c)}</g>`);
    const peace = pL.add(`<g opacity="0">${label(c, tr('warunki pokoju', 'conditions of peace'), { size: 18, fill: C.halo })}</g>`);
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, SUNX, 190, T, 1, 0.6);
      cls.forEach((k) => swing(k.el, k.x + (T ? Math.sin(T * 0.1 + k.i) * 16 : 0), k.y, T, 1.2, 0.6, k.i));
      /* the other king comes against him — and halts while still far off */
      const adv = es(t, -0.3, 1.2, (x) => x) ;
      const halt = es(t, 1.5, 1.8);
      const FA = S.portrait ? -130 : 0;   // phone: the twenty thousand come on inside the screen
      farArmy.set({ x: 1060 + FA - adv * 70, y: FARY, o: 1 });
      dusts.forEach((d, i) => pose(d, { x: 1000 + FA - adv * 70 + i * 140, y: FARY + 4, s: 0.9 + (T ? Math.sin(T * 2 + i) * 0.1 : 0), o: 0.6 * (1 - halt) }));
      near.set({ x: 470, y: GY - 26 });
      /* v31 — he sits down first and considers: ten thousand against twenty */
      pose(table, { x: MAPX, y: GY - 60 });
      pose(mine, { x: MAPX - 40, y: GY - 64, o: 1 });
      theirs.forEach((e, i) => { const k = es(t, 0.3 + i * 0.1, 0.4 + i * 0.1, ease.back); pose(e, { x: MAPX + 26 + i * 22, y: GY - 64 - (1 - k) * 30, o: k > 0.01 ? 1 : 0 }); });
      const think = es(t, 0.45, 0.6) * (1 - es(t, 1.0, 1.1));
      const send = es(t, 1.04, 1.16) * (1 - es(t, 1.6, 1.8));
      king.set({ x: KX, y: GY, s: 1.02, flip: false, armF: 40 + think * 80 + send * 60, armB: 20 + send * 30, head: 10 - think * 4 - send * 8, blink: blinkAt(T, 2) });
      counsel.set({ x: MAPX + 130, y: GY, s: 0.98, flip: true, armF: 40 + bump(t, 0.2, 0.6) * 40, armB: 10, head: 10, blink: blinkAt(T, 4) });
      const P = S.portrait;   // phone: both numbers inside the screen
      popAt(t10, t, 0.08, undefined, P ? 560 : 480, 510, { d: 0.12 });
      popAt(t20, t, 0.16, undefined, P ? 1040 : 1150, 470, { d: 0.12 });
      popAt(q, t, 0.5, 1.05, MAPX, 520 + (T ? Math.sin(T * 1.6) * 4 : 0), { d: 0.12 });
      /* v32 — while the other is yet far off, he sends an embassy for terms of peace */
      envoys.forEach((p, i) => {
        const u = es(t, 1.12 + i * 0.04, 1.8 + i * 0.04);
        const x = lerp(KX + 40 + i * 50, 900 + i * 40, u), y = lerp(GY + 10 - i * 6, 604 - i * 6, u), s = lerp(1.0, 0.5, u);
        p.set({ x, y, s, flip: false, o: seg(t, 1.06, 1.12), walk: u > 0 && u < 1 ? x * 0.08 : undefined, amt: 0.8, armF: 40 + es(t, 1.8, 1.9) * 50, armB: 10, head: -2, blink: blinkAt(T, 6 + i) });
      });
      popAt(peace, t, 1.62, undefined, 930, 470, { d: 0.12 });

      S.cam.x = kf(t, [[-0.5, 0], [0.4, -20], [1.1, 0], [1.6, 40]]);
      S.cam.y = kf(t, [[-0.5, 50], [0.4, 90], [1.1, 70]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.4, 1.12], [1.1, 1.06]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, -60], [0.4, -40], [1.1, 0], [1.6, 80]]); S.cam.z = 1.0; }
      void headAt; void hand; void moving; void nameTag; void PI; void shade;
    };
  },
};
function tentM(c, x, y) {
  const s = sheet();
  s.p(c.cut([[x - 110, y], [x - 70, y - 120], [x, y - 150], [x + 70, y - 120], [x + 110, y]], 0.6, 8), C.wheatRobe);
  s.p(c.cut([[x - 24, y], [x, y - 110], [x + 24, y]], 0.4, 5), mix(C.soilDark, C.wood2, 0.4));
  let st = '';
  for (let k = -2; k <= 2; k++) st += c.ribbon([[x + k * 36, y - 4], [x + k * 14, y - 140]], 5);
  s.x(st, C.terracotta, 'opacity=".45"');
  s.p(c.ribbon([[x, y - 150], [x, y - 200]], 3), C.wood2);
  s.p(c.cut([[x, y - 200], [x + 34, y - 192], [x, y - 182]], 0.3, 3), C.teal2);
  return s.out();
}
