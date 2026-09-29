// Łk 6,46–47 — back on the level place. "Why do you call me 'Lord, Lord', and do not do what I tell you?": two men in
// the front stand up, lift their hands and call out "Lord, Lord!" — and as soon as He points them to the work, they
// sit down again, one yawns and stretches out on the grass, the other turns his back. "Everyone who comes to me, hears
// my words and does them — I will show you what he is like": a third man comes up through the crowd, stands before
// Him and listens (a golden word comes to him and lights on his heart), then shoulders a spade and picks up a stone —
// and Jesus points up: a picture comes down on its strings, a man digging deep by the river.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { plainSet, PL, kf, moving, headAt, handAt, bubble, heart, sparkle, WISE, tr, PI } from './lib.js';
import { makeCutter } from '../../core/paper.js';

const IDLE = [{ x: 560, o: { robe: C.roseRobe, mantle: C.ochre, hair: C.hair, hairStyle: 'curly', beard: 'short', skin: C.skin2, belt: C.sun } }, { x: 1050, o: { robe: C.tealRobe, mantle: C.linen2, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.ochre } }];

function spade(c) { return sheet().p(c.ribbon([[0, 0], [0, 150]], 5), C.wood).p(c.cut([[-12, 150], [12, 150], [10, 180], [0, 188], [-10, 180]], 0.3, 4), C.stone2).out(); }
function stoneBlock(c) { return sheet().p(c.cut(c.rect(-16, -12, 32, 24), 0.8, 5), mix(C.stone, C.rock, 0.5)).out(); }
/** a small preview picture: a man digging deep by a river (origin: the picture's centre) */
function preview(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-110, -76, 220, 152), 0.6, 8), C.wood3).p(c.cut(c.rect(-100, -66, 200, 132), 0.5, 8), C.cream);
  const p = sheet();
  p.p(c.poly(c.rect(-96, -62, 192, 70)), mix(C.skyBlue, C.cream, 0.3));
  p.p(c.cut([[-96, 0], [96, 0], [96, 62], [-96, 62]], 0.4, 6), mix(C.soil, C.clay, 0.4));
  p.p(c.cut([[-96, 40], [96, 40], [96, 62], [-96, 62]], 0.4, 6), C.rock2);
  p.p(c.cut([[-96, -4], [-40, -4], [-40, 6], [-96, 6]], 0.3, 4), C.lake2);
  p.p(c.cut([[0, 0], [0, 40], [44, 40], [44, 0]], 0.3, 4), mix(C.soilDark, C.night2, 0.2));
  const man = `<g transform="translate(22 36) scale(.28)">${person(makeCutter('lk6-prev'), { ...WISE, holdF: `<g transform="rotate(-20)">${spade(c)}</g>` })}</g>`;
  return `<path d="M-70 -2000V-76M70 -2000V-76" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/>${s.out()}${p.out()}${man}`;
}

export default {
  id: 'lk6-lordlord',
  beats: [
    { v: 46 },
    { v: 47 },
  ],
  cam: { x: [-20, 20], y: [-40, 50], z: [1, 1.1] },
  build(S) {
    const P = plainSet(S, { dis: false });
    const c = S.c;
    const L = P.act;
    const idle = IDLE.map((m, i) => ({ ...m, i, seed: c.rr(0, 9), st: S.puppet(L.add(person(c, m.o))), sit: S.puppet(L.add(person(c, { ...m.o, pose: 'sit' }))) }));
    const hearer = S.puppet(L.add(person(c, WISE)));
    const doer = S.puppet(L.add(person(c, { ...WISE, holdB: `<g transform="rotate(160)">${spade(c)}</g>` })));
    const stone = L.add(`<g>${stoneBlock(c)}</g>`);
    const fx = P.fx;
    const cries = idle.map((m) => fx.add(`<g opacity="0">${bubble(c, tr('Panie, Panie!', 'Lord, Lord!'), { size: 20, tail: m.x > 800 ? -1 : 1 })}</g>`));
    const zz = fx.add(`<g opacity="0"><text x="0" y="0" font-family="EB Garamond, Georgia, serif" font-size="26" font-style="italic" fill="${C.inkSoft}">z z z</text></g>`);
    const word = fx.add(`<g opacity="0"><circle r="30" fill="url(#halo-glow)"/>${sheet().p(c.cut([[-22, -8], [22, -9], [23, 8], [-22, 9]], 0.4, 4), C.halo).x(c.ribbon([[-14, 0], [14, -1]], 1.8), C.sunDeep, 'opacity=".8"').out()}</g>`);
    const heartLit = fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`);
    const hangL = S.layer({ par: 0.2, sh: 6 });
    const pic = hanging(hangL, preview(c), { x: 0, y: -400, len: 0 });
    const jesus = P.jesus;

    return (t, time) => {
      const T = time;
      P.update(T);

      /* v46 — "Lord, Lord!" — and they do nothing */
      const point = es(t, 0.42, 0.55) * (1 - es(t, 0.95, 1.05));
      const showK = es(t, 1.62, 1.8);
      jesus.set({ x: PL.JX, y: PL.JY, s: PL.JS, flip: t < 1.0 ? idle[0].x < 800 && t < 0.7 : false, armF: 16 + point * 70 + bump(t, 1.2, 1.6) * 40 + showK * 60, armB: 10 + showK * 100, head: -2 - showK * 8, blink: blinkAt(T) });
      idle.forEach((m) => {
        const up = es(t, 0.02, 0.06) * (1 - es(t, 0.6, 0.64));
        const call = bump(t, 0.05, 0.6);
        const flip = m.x > 800;
        m.st.set({ x: m.x, y: 770, s: 0.92, flip, o: up, armF: 40 + call * 80, armB: 20 + call * 120, head: -call * 8, blink: blinkAt(T, m.seed) });
        const lazy = es(t, 0.66, 0.8);
        m.sit.set({ x: m.x, y: 776, s: 0.92, flip: m.i ? !flip : flip, o: 1 - up, armF: m.i === 0 ? 160 * lazy : 20, armB: m.i === 0 ? 150 * lazy : 30, head: m.i === 0 ? 14 * lazy : 6, lean: m.i === 0 ? -8 * lazy : 0, blink: m.i === 0 ? lazy : blinkAt(T, m.seed) });
        const [hx, hy] = headAt(m.x, 770, 0.92, flip);
        const k = es(t, 0.08, 0.22, ease.back) * (1 - es(t, 0.55, 0.62));
        pose(cries[m.i], { x: hx + (flip ? -20 : 20), y: hy - 40, s: k, o: k > 0.01 ? 1 : 0 });
      });
      pose(zz, { x: idle[0].x + 10, y: 610 - ((T * 12) % 20), o: es(t, 0.8, 0.9) * (1 - es(t, 1.9, 2.0) * 0.5) });

      /* v47 — one who comes, hears, and does */
      const hK = [[1.0, 1300], [1.3, 900]];
      const hx = kf(t, hK);
      const does = es(t, 1.55, 1.6);
      const hearK = es(t, 1.3, 1.48);
      hearer.set({ x: hx, y: 760, s: 0.94, flip: true, walk: moving(t, hK) ? hx * 0.05 : undefined, armF: 20 + hearK * 30, armB: 10, head: -4 + hearK * 6, o: seg(t, 0.98, 1.02) * (1 - does), blink: blinkAt(T, 3) });
      doer.set({ x: 900, y: 760, s: 0.94, flip: true, armF: 60, armB: 150, head: -6, o: does, blink: blinkAt(T, 3) });
      const [whx, why] = headAt(PL.JX, PL.JY, PL.JS, false);
      const wk = seg(t, 1.3, 1.48);
      pose(word, { x: lerp(whx + 30, 890, wk), y: lerp(why - 10, 660, wk) - Math.sin(wk * PI) * 40, s: 1 - wk * 0.4, o: wk > 0 && wk < 1 ? 1 : 0 });
      pose(heartLit, { x: 896, y: 650, s: bump(t, 1.45, 1.85), r: T * 40, o: bump(t, 1.45, 1.85) });
      const [shx, shy] = handAt(900, 760, 0.94, true, 60);
      pose(stone, { x: shx, y: shy - 6, o: does });
      const pd = es(t, 1.62, 1.9, ease.back);
      pose(pic, { x: 800, y: lerp(-400, 290, pd), r: Math.sin(T * 0.8) * 1, oy: 0, o: pd > 0.01 ? 1 : 0 });

      S.cam.z = kf(t, [[-0.5, 1.02], [0.3, 1.06], [1.6, 1.06], [1.9, 1.02]]);
      S.cam.y = kf(t, [[-0.5, 10], [0.3, 30], [1.6, 30], [1.9, -10]]);
    };
  },
};
