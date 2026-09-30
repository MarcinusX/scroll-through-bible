// Łk 14,23–24 — the country outside the city at dusk, a painted flat; the master's house stands high on its hill with
// the road winding up to it between green hedgerows. His voice comes from the house: "Go out into the highways and
// hedges and compel them to come in, that my house may be filled." The servant with his lantern calls the wanderers
// off the road — a shepherd lad, an old woman, a traveller with his bundle, a hooded stranger — and they go up the road;
// an old man sitting under a hedge shakes his head, but the servant takes him by the hand and pulls him up and along.
// Night falls; the windows of the house fill with light and with guests, the door shuts — and at the foot of the hill,
// outside in the dark, stand the three who were invited, looking up at the feast they will not taste.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { hedgeFlat, HG, along, SERVANT, FIELDMAN, OXMAN, NEWLY, WIFE, ROADFOLK, bubble, pose3, headAt, hand, kf, moving, popAt, deed, goad, makeCutter, tr, mix } from './lib.js';
import { lantern as handLantern } from '../matthew11/lib.js';
import { bundle } from '../mark8/lib.js';

const OLD = { robe: mix(C.stone2, C.sand2, 0.4), hair: C.greyHair, hairStyle: 'short', beard: 'wild', beardColor: C.greyHair, skin: C.skin2, belt: C.rope };

export default {
  id: 'lk14-hedges',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 23 },
    { v: 24 },
  ],
  cam: { x: [-60, 100], y: [0, 120], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const H = hedgeFlat(S);
    // wanderers on the road (still figures that glide along it)
    const WF = [ROADFOLK[6], ROADFOLK[5], { ...ROADFOLK[3] }, ROADFOLK[2]].map((o, i) => {
      const cc = makeCutter('lk14-wander' + i);
      const holdB = i === 2 ? bundle(cc) : '';
      return { i, sp: H.walkL.sprite(pose3(cc, [{ x: 0, y: 0, s: 1, flip: false, head: -4, armF: 16 + i * 4, armB: 10, o: { ...o, holdB } }]), 600, 720) };
    });
    const oldSit = S.puppet(H.frontL.add(person(c, { ...OLD, pose: 'sit' })));
    const oldUp = S.puppet(H.frontL.add(person(c, OLD)));
    const svt = S.puppet(H.frontL.add(person(c, { ...SERVANT, holdB: `<g transform="translate(0 4)">${handLantern(c, 14, C.apricot)}</g>` })));
    const three = H.frontL.sprite(pose3(makeCutter('lk14-three'), [
      { x: -110, y: 0, s: 0.96, flip: false, head: -14, armF: 40, armB: 10, o: { ...FIELDMAN, holdF: `<g transform="translate(2 10) rotate(-60)">${deed(c)}</g>` } },
      { x: -20, y: 6, s: 0.96, flip: false, head: -16, armF: 20, armB: 10, o: { ...OXMAN, holdF: `<g transform="rotate(-20)">${goad(c)}</g>` } },
      { x: 60, y: 2, s: 0.96, flip: false, head: -12, armF: 60, armB: 20, o: NEWLY },
      { x: 110, y: 8, s: 0.9, flip: false, head: -10, armF: 30, armB: 10, o: WIFE },
    ]), 600, 796);
    const voice = H.fx.add(`<g opacity="0">${bubble(c, [tr('Wyjdź na drogi i między opłotki', 'Go out into the highways and hedges'), tr('i zmuszaj do wejścia!', 'and compel them to come in!')], { size: 19, dir: 1, fill: C.halo })}</g>`);
    const none = H.fx.add(`<g opacity="0">${bubble(c, [tr('Żaden z zaproszonych', 'None of those invited'), tr('nie skosztuje mojej uczty!', 'will taste my supper!')], { size: 19, dir: 1, fill: C.halo })}</g>`);

    return (t, time) => {
      const T = time;
      const night = es(t, 1.0, 1.4);
      H.nightL.fade(night * 0.85);
      popAt(voice, t, 0.08, 0.9, HG.HOUSE[0] - 40, HG.HOUSE[1] - 170, { d: 0.12 });
      /* v23 — the wanderers go up the road; the old man is compelled */
      const road = HG.ROAD.concat([[HG.DOOR[0] + 24, HG.HOUSE[1] - 2]]);
      WF.forEach(({ i, sp }) => {
        const u = seg(t, 0.12 + i * 0.1, 1.2 + i * 0.06) * 0.98 + [0.02, 0.08, 0, 0.12][i];
        const [x, y] = along(road, u);
        const s = lerp(0.9, 0.46, Math.min(1, u));
        sp.set({ x: x + (i % 2 ? 14 : -10), y: y + (T ? Math.abs(Math.sin(T * 6 + i)) * -2 : 0), s, o: seg(t, 0, 0.1) * (1 - seg(t, 1.12 + i * 0.05, 1.2 + i * 0.05)) });
      });
      const SK = [[0, 900], [0.4, 730], [0.6, 730]];
      const pulled = es(t, 0.58, 0.62);
      const up = es(t, 0.62, 1.2);
      const [ux, uy] = along(road, 0.35 + up * 0.6);
      const sx = t < 0.6 ? kf(t, SK) : ux + 40;
      const sy = t < 0.6 ? 774 : uy;
      const ss = t < 0.6 ? 1.0 : lerp(0.9, 0.5, up);
      svt.set({ x: sx, y: sy, s: ss, flip: t < 0.62, o: 1 - seg(t, 1.14, 1.2), walk: (t < 0.4 && t > 0) || (up > 0 && up < 1) ? sx * 0.06 : undefined, armF: 30 + bump(t, 0.1, 0.4) * 60 + es(t, 0.42, 0.52) * 50, armB: 20 + bump(t, 0.1, 0.4) * 100, lean: pulled < 1 && t > 0.5 ? -8 : 0, head: -4, blink: blinkAt(T, 5) });
      const refuse = bump(t, 0.3, 0.52);
      oldSit.set({ x: 640, y: 778, s: 0.96, flip: false, o: 1 - pulled, armF: 40 + es(t, 0.44, 0.56) * 40, armB: 20 + refuse * 100, head: 10 - refuse * 20, blink: blinkAt(T, 7) });
      const [ox_, oy_] = along(road, 0.33 + up * 0.6);
      oldUp.set({ x: t < 0.62 ? 660 : lerp(660, ox_, es(t, 0.62, 0.72)), y: t < 0.62 ? 778 : lerp(778, oy_, es(t, 0.62, 0.72)), s: t < 0.62 ? 0.96 : lerp(0.92, 0.48, up), flip: false, o: pulled * (1 - seg(t, 1.14, 1.2)), walk: up > 0 && up < 1 ? ox_ * 0.06 : undefined, amt: 0.6, armF: 70, armB: 10, lean: 6, head: 4, blink: blinkAt(T, 7) });
      /* v24 — the house full, the door shut; the invited left outside */
      pose(H.lit, { o: es(t, 1.1, 1.4) });
      pose(H.doorLeaf, { x: HG.DOOR[0], y: HG.HOUSE[1], sx: Math.max(0.05, es(t, 1.3, 1.42)), sy: 1 });
      three.set({ x: 600, y: 796, o: es(t, 1.36, 1.5) });
      popAt(none, t, 1.5, undefined, HG.HOUSE[0] - 40, HG.HOUSE[1] - 190, { d: 0.12 });

      S.cam.x = kf(t, [[-0.5, 0], [0.4, -30], [1.0, 20], [1.4, 0]]);
      S.cam.y = kf(t, [[-0.5, 60], [0.3, 80], [1.4, 60]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.3, 1.08], [1.4, 1.04]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, 60], [0.4, -40], [1.0, 60], [1.4, 30]]); S.cam.z = 1.0; }
      void hand; void headAt; void ease;
    };
  },
};
