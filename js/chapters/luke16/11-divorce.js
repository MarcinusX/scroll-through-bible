// Łk 16,18 — a quiet painted flat: a village street at the door of a house, a vine over the doorway. A husband and
// his wife stand at their door, and a golden cord runs between their hands: the bond that the Law does not let fall.
// "Everyone who divorces his wife and marries another commits adultery": he lets go of her hand, turns his back and
// goes to another woman down the street and takes her hand — but the golden cord does not come undone: it stretches
// after him from his wife's hand to his, and over the new pair a golden ring hangs, and cracks. "And he who marries a
// woman divorced from her husband commits adultery": another man comes up the street to the wife left at the door
// and takes her hand — the cord still runs from her to her husband — and over them too a ring hangs, and cracks.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, house } from '../../assets/nature.js';
import { cord, ring, handAt, kf, moving, es, ease, bump, seg, PI, STRING } from './lib.js';

const GY = 712;
const DOORX = 900;
const HUSBAND = { robe: C.dustyBlue, mantle: C.clayMantle, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.leather };
const WIFE = { robe: C.roseRobe, mantle: null, hairStyle: 'veil', veil: C.linen2, veil2: C.stone2, hair: C.hair, skin: C.skin2, beard: 'none', belt: C.plumRobe };
const OTHER_W = { robe: C.wheatRobe, hairStyle: 'veil', veil: C.skyVeil, veil2: shade(C.skyVeil, -0.14), hair: C.hair3, skin: C.skin, beard: 'none', belt: C.ochre };
const OTHER_M = { robe: C.sageRobe, mantle: C.mauve, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, veil2: C.mauve, beard: 'short', skin: C.skin2, belt: C.rope };

/** a hung ring that can crack: whole (gold) or cracked (grey, in two) — origin centre */
function hungRing(c, cracked) {
  const col = cracked ? mix(C.stone2, C.rock3, 0.5) : C.sun;
  const r = 20;
  const s = sheet();
  if (!cracked) s.p(c.ribbon(c.arc(0, 0, r, r, 0, PI * 2, 28), 5), col);
  else {
    s.p(c.ribbon(c.arc(-3, 2, r, r, PI * 0.55, PI * 1.45, 14), 5), col);
    s.p(c.ribbon(c.arc(3, -2, r, r, PI * 1.6, PI * 2.4, 14), 5), col);
    s.x(c.ribbon([[-4, -26], [2, -18], [-3, -12]], 1.6) + c.ribbon([[4, 12], [-2, 18], [3, 26]], 1.6), C.rock3);
  }
  return `<path d="M0 -1600V${-r - 2}" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}`;
}

export default {
  id: 'lk16-divorce',
  enter: 'fly',
  beats: [
    { v: 18, text: 'Każdy, kto oddala swoją żonę, a bierze inną, popełnia cudzołóstwo;' },
    { v: 18, cont: true, text: 'i kto oddaloną przez męża bierze za żonę, popełnia cudzołóstwo.' },
  ],
  cam: { x: [-40, 20], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#cad9d6', '#efe5cc', '#f6e8cf']);
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(band(c, { y: 450, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.sand, 0.2) }).markup);
    const street = S.layer({ par: 0.26, sh: 3 });
    let hs = '';
    [[-200, 200], [60, 180], [1260, 210], [1500, 180]].forEach(([x, w]) => { hs += house(c, x, GY - 20, w, 220, { stairs: false }); });
    street.add(hs);
    const G = S.layer({ par: 0.3, sh: 3 });
    G.add(sheet().p(c.cut([[-1100, GY - 12], [2700, GY - 12], [2700, 1900], [-1100, 1900]], 0.6, 16), mix(C.sand, C.stone, 0.45)).out());
    /* their house with the vine over the door */
    const home = S.layer({ par: 0.32, sh: 4 });
    const h = sheet();
    h.p(c.cut([[DOORX - 150, GY], [DOORX - 150, 420], [DOORX + 190, 420], [DOORX + 190, GY]], 0.6, 12), mix(C.plaster, C.blushVeil, 0.2));
    h.p(c.cut([[DOORX - 164, 420], [DOORX + 204, 420], [DOORX + 204, 400], [DOORX - 164, 400]], 0.4, 10), C.roof);
    h.p(c.cut([[DOORX - 44, GY], [DOORX - 44, 560], ...c.arc(DOORX, 560, 44, 34, PI, 2 * PI, 10), [DOORX + 44, 560], [DOORX + 44, GY]], 0.4, 6), mix(C.soilRich, C.plumRobe, 0.2));
    h.p(c.ribbon([[DOORX - 70, GY], [DOORX - 64, 520], [DOORX - 20, 490], [DOORX + 40, 494], [DOORX + 76, 530], [DOORX + 70, GY]], 3.4), C.wood2);
    let lv = '';
    for (let i = 0; i < 18; i++) { const a = PI + (i / 17) * PI; lv += c.cut(c.blob(DOORX + Math.cos(a) * 74, 530 + Math.sin(a) * 44, 12, 9, 8, 0.25), 0.4, 4); }
    h.p(lv, mix(C.moss, C.leaf, 0.5));
    home.add(h.out());
    const act = S.layer({ par: 0.36, sh: 5 });
    const w2 = S.puppet(act.add(person(c, OTHER_W)));
    const m2 = S.puppet(act.add(person(c, OTHER_M)));
    const wife = S.puppet(act.add(person(c, WIFE)));
    const husband = S.puppet(act.add(person(c, HUSBAND)));
    const cordEl = act.add(`<g>${cord(c)}</g>`);
    const hang = S.layer({ par: 0.38, sh: 4, rise: 0 });
    const rings = [0, 1].map(() => ({ whole: hang.add(`<g opacity="0">${hungRing(c, false)}</g>`), cracked: hang.add(`<g opacity="0">${hungRing(c, true)}</g>`) }));

    return (t, time) => {
      const T = time;
      /* v18a — he lets go and goes to another; the cord stretches after him */
      const HK = [[0.12, 820], [0.45, 630]];
      const hx = kf(t, HK);
      const turned = t > 0.12;
      const join1 = es(t, 0.45, 0.55);
      husband.set({ x: hx, y: GY, s: 1.0, flip: turned, walk: moving(t, HK) ? hx * 0.06 : undefined, armF: 40 + join1 * 20, armB: 30, head: -2, blink: blinkAt(T, 1) });
      w2.set({ x: 545, y: GY, s: 0.96, o: es(t, -0.5, -0.2), armF: 20 + join1 * 40, armB: 6, head: -4, blink: blinkAt(T, 3) });
      /* the wife at the door: dismissed; then (v18b) another man takes her hand */
      const MK = [[1.05, 1280], [1.4, 1010]];
      const mx = kf(t, MK);
      const join2 = es(t, 1.4, 1.5);
      const sad = es(t, 0.2, 0.4);
      wife.set({ x: 920, y: GY, s: 0.96, flip: t > 1.3, armF: 40 - sad * 10 + join2 * 30, armB: 10, head: sad * 12 - join2 * 8, blink: blinkAt(T, 2) });
      m2.set({ x: mx, y: GY, s: 1.0, flip: true, o: es(t, 1.0, 1.1), walk: moving(t, MK) ? mx * 0.06 : undefined, armF: 20 + join2 * 40, armB: 8, head: -2, blink: blinkAt(T, 4) });
      /* the cord: from her hand to his (it never comes undone) */
      const [wx, wy] = handAt(920, GY, 0.96, t > 1.3, t > 1.3 ? 10 : 40 - sad * 10);
      const [bx, by] = handAt(hx, GY, 1.0, !turned ? false : true, 30);
      const backX = turned ? hx + 16 : bx, backY = turned ? by + 4 : by;
      const dx = backX - wx, dy = backY - wy;
      pose(cordEl, { x: wx, y: wy, r: (Math.atan2(dy, dx) * 180) / PI, sx: Math.max(0.05, Math.hypot(dx, dy) / 100) });
      /* the rings over each new pair: whole, then cracked */
      [[0.5, 590, 360], [1.45, 965, 360]].forEach(([a, x, y], i) => {
        const k = es(t, a, a + 0.18, ease.out);
        const cr = es(t, a + 0.22, a + 0.28);
        const yy = lerp(-400, y, k);
        pose(rings[i].whole, { x, y: yy, o: k > 0.004 ? 1 - cr : 0 });
        pose(rings[i].cracked, { x, y: yy, o: k > 0.004 ? cr : 0 });
      });

      S.cam.x = kf(t, [[-0.5, 0], [0.4, -30], [1.0, -30], [1.4, 10]]);
      S.cam.y = kf(t, [[-0.5, 30], [2, 20]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [2, 1.06]]);
    };
  },
};
