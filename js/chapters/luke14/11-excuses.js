// Łk 14,18–20 — the edge of the town at dusk, a painted flat. The servant comes along the road with his lantern and holds
// up an invitation: and all three at once lift their hands and turn their heads away — "Excuse me…". The first stands
// by his new field with its boundary stones, waves his deed of sale — "I have bought a field, I must go and see it" —
// and strides off across the furrows. The second, goad in hand, has five yoke of oxen in his yard — "I must go and try
// them out" — and the ten oxen lumber off. The third stands in his doorway under a wedding garland with his bride on his
// arm — "I have married a wife, and therefore I cannot come" — and they go in, and the door shuts.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { excuseFlat, EX, SERVANT, FIELDMAN, OXMAN, NEWLY, WIFE, fiveYoke, deed, goad, invitation, bubble, headAt, hand, kf, moving, popAt, tr, sheet, mix, shade } from './lib.js';
import { lantern as handLantern } from '../matthew11/lib.js';

const FL = EX.FL;
const F1 = EX.FIELD + 120, F2 = EX.YARD + 200, F3 = EX.DOOR[0] - 40, W3 = EX.DOOR[1] + 10;

export default {
  id: 'lk14-excuses',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 18, text: 'Wtedy zaczęli się wszyscy jednomyślnie wymawiać.' },
    { v: 18, cont: true, text: 'Pierwszy kazał mu powiedzieć: "Kupiłem pole, muszę wyjść, aby je obejrzeć; proszę cię, uważaj mnie za usprawiedliwionego!"' },
    { v: 19 },
    { v: 20 },
  ],
  cam: { x: [-720, 880], y: [0, 100], z: [0.8, 1.12] },
  build(S) {
    const c = S.c;
    const X = excuseFlat(S);
    const oxen = X.yardL.add(`<g>${fiveYoke(c, 0.44)}</g>`);
    const door = X.doorL.add(`<g>${sheet().p(c.cut([[0, 0], [0, -182], [EX.DOOR[1] - EX.DOOR[0], -182], [EX.DOOR[1] - EX.DOOR[0], 0]], 0.3, 5), C.wood).x(c.ribbon([[20, -10], [20, -172]], 2) + c.ribbon([[50, -10], [50, -172]], 2), shade(C.wood, -0.2), 'opacity=".6"').out()}</g>`);
    const p1 = S.puppet(X.frontL.add(person(c, { ...FIELDMAN, holdF: `<g transform="translate(2 10) rotate(-60)">${deed(c)}</g>` })));
    const p2 = S.puppet(X.frontL.add(person(c, { ...OXMAN, holdF: `<g transform="rotate(-20)">${goad(c)}</g>` })));
    const wife = S.puppet(X.frontL.add(person(c, WIFE)));
    const p3 = S.puppet(X.frontL.add(person(c, NEWLY)));
    const svt = S.puppet(X.frontL.add(person(c, { ...SERVANT, holdB: `<g transform="translate(0 4)">${handLantern(c, 14, C.apricot)}</g>`, holdF: `<g transform="rotate(90)">${invitation(c, 30)}</g>` })));
    const ex = [0, 1, 2].map(() => X.fx.add(`<g opacity="0">${bubble(c, tr('Wybacz…', 'Excuse me…'), { size: 18, dir: -1 })}</g>`));
    const b1 = X.fx.add(`<g opacity="0">${bubble(c, [tr('Kupiłem pole,', 'I have bought a field,'), tr('muszę je obejrzeć!', 'I must go and see it.')], { size: 19, dir: -1 })}</g>`);
    const b2 = X.fx.add(`<g opacity="0">${bubble(c, [tr('Kupiłem pięć par wołów,', 'I have bought five yoke of oxen,'), tr('idę je wypróbować!', 'I must go try them out.')], { size: 19, dir: 1 })}</g>`);
    const b3 = X.fx.add(`<g opacity="0">${bubble(c, [tr('Poślubiłem żonę,', 'I have married a wife,'), tr('nie mogę przyjść!', 'I can’t come.')], { size: 19, dir: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      X.update(T);
      /* v18a — all at once they begin to make excuses */
      const no = es(t, 0.3, 0.42) * (1 - es(t, 0.95, 1.05));
      const SK = [[0, 560], [0.3, 680], [1.0, 680], [1.22, F1 + 110], [2.0, F1 + 110], [2.25, F2 - 120], [3.0, F2 - 120], [3.3, F3 - 110]];
      const sx = kf(t, SK);
      const offer = es(t, 0.28, 0.36) * (1 - es(t, 3.9, 4.0));
      svt.set({ x: sx, y: FL + 6, s: 0.98, flip: false, walk: moving(t, SK) ? sx * 0.05 : undefined, armF: 30 + offer * 70, armB: 30, head: -2, blink: blinkAt(T, 5) });
      /* v18b — the field */
      const go1 = es(t, 1.62, 1.95);
      const show = es(t, 1.08, 1.2) * (1 - go1);
      p1.set({ x: lerp(F1, F1 - 150, go1), y: FL - lerp(0, 90, go1), s: 1.0 - go1 * 0.15, flip: go1 > 0.05, walk: go1 > 0 && go1 < 1 ? t * 40 : undefined, armF: 20 + show * 110 + no * 60, armB: 10 + no * 130 + show * 60, head: -no * 16 + show * 4, blink: blinkAt(T, 2) });
      /* v19 — the oxen */
      const drive = es(t, 2.55, 2.95);
      p2.set({ x: F2 + drive * 40, y: FL, s: 1.0, flip: true, walk: drive > 0 && drive < 1 ? t * 40 : undefined, armF: 20 + bump(t, 2.1, 2.9) * 50 + no * 60, armB: 10 + no * 130, head: -no * 16, blink: blinkAt(T, 3) });
      pose(oxen, { x: EX.YARD + drive * 36, y: 690 - drive * 2 });
      /* v20 — the new wife; the door shuts */
      const inK = es(t, 3.8, 3.92);
      const shut = es(t, 3.9, 3.98);
      p3.set({ x: lerp(F3, EX.DOOR[0] + 30, inK), y: FL, s: 1.0, flip: t > 3.5, o: 1 - seg(t, 3.9, 3.94), armF: 30 + no * 60 + bump(t, 3.1, 3.7) * 40, armB: 10 + no * 130, head: -no * 16, blink: blinkAt(T, 4) });
      wife.set({ x: lerp(W3, EX.DOOR[0] + 50, inK), y: FL - 6, s: 0.94, flip: true, o: 1 - seg(t, 3.86, 3.9), armF: 30, armB: 20, head: 6, blink: blinkAt(T, 6) });
      pose(door, { x: EX.DOOR[0], y: FL - 104, sx: Math.max(0.06, shut), sy: 1, o: 1 });
      /* the bubbles */
      const P = [[F1, 1.0, false], [F2, 1.0, true], [F3, 1.0, false]];
      ex.forEach((e, i) => { const [hx, hy] = headAt(P[i][0], FL, 1, P[i][2]); popAt(e, t, 0.36 + i * 0.03, 1.0, hx + (P[i][2] ? -10 : 10), hy - 40, { d: 0.1 }); });
      const [h1x, h1y] = headAt(F1, FL, 1, false);
      popAt(b1, t, 1.12, 1.9, h1x + 10, h1y - 36, { d: 0.12 });
      const [h2x, h2y] = headAt(F2, FL, 1, true);
      popAt(b2, t, 2.1, 2.95, h2x - 10, h2y - 36, { d: 0.12 });
      const [h3x, h3y] = headAt(F3, FL, 1, false);
      popAt(b3, t, 3.1, 3.9, h3x - 6, h3y - 36, { d: 0.12 });

      S.cam.x = kf(t, [[-0.5, 0], [1.0, 0], [1.25, -700], [2.0, -700], [2.25, 180], [3.0, 180], [3.25, 820]]);
      S.cam.y = kf(t, [[-0.5, 40], [1.0, 40], [1.25, 80]]);
      S.cam.z = kf(t, [[-0.5, 0.86], [1.0, 0.86], [1.25, 1.1]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, 60], [1.0, 60], [1.25, -700], [2.0, -700], [2.25, 220], [3.0, 220], [3.25, 860]]); S.cam.z = kf(t, [[0, 0.8], [1.0, 0.8], [1.25, 0.94]]); }
      void mix; void hand; void ease;
    };
  },
};
