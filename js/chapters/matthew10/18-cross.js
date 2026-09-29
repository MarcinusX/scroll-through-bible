// Mt 10,37–39 — the road out of the village runs up a hill; Jesus stands on it, turned back, calling. On the left
// a young man's father and mother hold his hands at their door; he looks up the road, and lets go — they bless him —
// and he comes. On the right a father kneels to hug his little son and daughter, then rises and comes too. By the
// roadside lie two rough wooden crosses: each takes one onto his shoulder, and they follow Jesus up the road.
// Then two small flames: a man who clutches his to his chest — it gutters out in smoke; and one of the two who
// opens his hands and lets his go for Jesus' sake — it flies up to Him and comes back to him bigger and brighter.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { rock, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { hill, SPRING, openHouse, carryCross, flame, child, heart, sparkle, kf, moving, hand, headAt, PI } from './lib.js';

const ROAD = [[620, 790], [740, 736], [840, 690], [930, 650], [1010, 612], [1080, 580]];
const JX = 820;

export default {
  id: 'mt10-cross',
  beats: [
    { v: 37, text: 'Kto kocha ojca lub matkę bardziej niż Mnie, nie jest Mnie godzien.' },
    { v: 37, cont: true, text: 'I kto kocha syna lub córkę bardziej niż Mnie, nie jest Mnie godzien.' },
    { v: 38 },
    { v: 39, text: 'Kto chce znaleźć swe życie, straci je.' },
    { v: 39, cont: true, text: 'a kto straci swe życie z mego powodu, znajdzie je.' },
  ],
  cam: { x: [-40, 60], y: [-50, 20], z: [1, 1.08] },
  build(S) {
    const H = hill(S, { skyCols: SPRING, sunAt: [1250, 180] });
    const c = S.c;

    /* the road up the hill, the parents' house */
    const R = S.layer({ par: 0.46, sh: 3 });
    const L2 = [], R2 = [];
    ROAD.forEach(([x, y], i) => { const w = lerp(56, 14, i / (ROAD.length - 1)); L2.push([x - w, y]); R2.unshift([x + w, y]); });
    R.add(sheet().p(c.cut([...L2, ...R2], 0.6, 8), C.sand).out());
    const o = openHouse(c, { w: 200, h: 200, dw: 60, dh: 124 });
    R.add(`<g transform="translate(330 700)">${o.inside}</g><g transform="translate(330 700)">${o.glow}</g><g transform="translate(330 700)">${o.wall}</g>`);
    const crosses = [[700, 770, -70], [960, 648, 70]].map(([x, y, r], i) => ({ x, y, r, i, el: R.add(`<g>${carryCross(c, 150)}</g>`) }));
    R.add(rock(c, 1150, 720, 120, 40, C.rock2) + grass(c, { x0: 300, x1: 1300, y: 760, n: 20, h: 12, color: C.moss }));

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const FA = S.puppet(P.add(person(c, { robe: C.wheatRobe, mantle: C.clayMantle, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather })));
    const MO = S.puppet(P.add(person(c, { robe: C.mauve, hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.greyHair, skin: C.skin2, beard: 'none' })));
    const kids = [0, 1].map((i) => S.puppet(P.add(person(c, child(c, i + 2)))));
    const clutcher = S.puppet(P.add(person(c, { robe: C.plumRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.sun })));
    const young = S.puppet(P.add(person(c, { robe: C.dustyBlue, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather })));
    const dad = S.puppet(P.add(person(c, { robe: C.sageRobe, mantle: C.wood3, hair: C.hair, hairStyle: 'curly', beard: 'full', skin: C.skin4, belt: C.leather })));
    const dadK = S.puppet(P.add(person(c, { robe: C.sageRobe, mantle: C.wood3, hair: C.hair, hairStyle: 'curly', beard: 'full', skin: C.skin4, belt: C.leather, pose: 'kneel' })));
    const jGlow = P.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));

    const fx = S.layer({ par: 0.52, sh: 4 });
    const hearts = [0, 1].map(() => fx.add(`<g>${heart(c, 11)}</g>`));
    const fl1 = fx.add(`<g><circle r="30" fill="url(#warm-glow)"/><g transform="translate(0 12)">${flame(c, 28)}</g></g>`);
    const smoke = fx.add(`<g><path d="${c.ribbon(c.cbez([0, 0], [-10, -20], [10, -40], [-4, -70], 12), (u) => 7 - u * 5)}" fill="${C.rock3}" opacity=".6"/></g>`);
    const fl2 = fx.add(`<g><circle r="46" fill="url(#warm-glow)"/><g transform="translate(0 16)">${flame(c, 36)}</g></g>`);
    const stars = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));

    // the two who follow: from their homes to the crosses, then up the road behind Jesus
    const YK = [[0.35, [470, 712]], [0.9, [650, 762]], [2.0, [650, 762]], [2.12, [700, 760]], [2.3, [700, 760]], [2.9, [880, 670]]];
    const DK = [[1.4, [1120, 736]], [1.85, [1000, 700]], [2.0, [980, 672]], [2.12, [960, 660]], [2.3, [960, 660]], [2.9, [960, 632]]];

    return (t, time) => {
      const T = time;
      H.update(T);
      /* v37a — father and mother */
      const [yx, yy] = kf(t, YK);
      const letgo = es(t, 0.3, 0.45);
      FA.set({ x: 400, y: 706, s: 0.9, flip: false, armF: 60 * (1 - letgo) + bump(t, 0.45, 1.0) * 100, armB: bump(t, 0.45, 1.0) * 60, head: bump(t, 0.4, 1.0) * -6, blink: blinkAt(T, 3) });
      MO.set({ x: 540, y: 710, s: 0.86, flip: true, armF: 60 * (1 - letgo) + bump(t, 0.45, 1.0) * 110, head: bump(t, 0.4, 1.0) * -8, blink: blinkAt(T, 4) });
      const yCarry = es(t, 2.12, 2.3);
      young.set({ x: yx, y: yy, s: lerp(0.9, 0.7, es(t, 2.3, 2.9)), flip: false, walk: moving(t, YK) ? yx * 0.06 : undefined, armF: 40 * (1 - letgo) + 20 + yCarry * 120, armB: 10 + (t > 3.0 ? es(t, 4.05, 4.25) * 140 : 0), head: -bump(t, 0.0, 0.4) * 10, blink: blinkAt(T, 1) });
      /* v37b — a father and his children */
      const kneel = es(t, 1.08, 1.15) * (1 - es(t, 1.45, 1.52));
      const [dx, dy] = kf(t, DK);
      const dCarry = es(t, 2.12, 2.3);
      dadK.set({ x: 1130, y: 736, s: 0.9, flip: true, o: kneel, armF: 80, armB: 60, head: 8, blink: blinkAt(T, 5) });
      dad.set({ x: t < 1.4 ? 1130 : dx, y: t < 1.4 ? 736 : dy, s: lerp(0.9, 0.7, es(t, 2.3, 2.9)), flip: true, o: 1 - kneel, walk: moving(t, DK) ? dx * 0.06 : undefined, armF: 20 + dCarry * 120, armB: 10, blink: blinkAt(T, 5) });
      kids.forEach((k, i) => k.set({ x: 1190 + i * 40, y: 740 + i * 4, s: 0.56, flip: true, armF: 70 * kneel + bump(t, 1.5, 2.0) * 120, head: -6, o: 1 - es(t, 2.3, 2.6) * 0.3, blink: blinkAt(T, 6 + i) }));
      hearts.forEach((h, i) => {
        const k = bump(t, i ? 1.1 : 0.4, i ? 1.7 : 1.0);
        pose(h, { x: i ? 1170 : 470, y: (i ? 620 : 560) - k * 20, s: k, o: k });
      });
      /* v38 — the crosses taken up; Jesus leads up the road */
      crosses.forEach((cr, i) => {
        const pick = es(t, 2.1, 2.28);
        const [px, py] = i === 0 ? [yx, yy] : [t < 1.4 ? 1130 : dx, t < 1.4 ? 736 : dy];
        const sc = lerp(0.9, 0.7, es(t, 2.3, 2.9));
        const [sx, sy] = [px + (i ? -6 : 6) * sc, py - 138 * sc];
        pose(cr.el, { x: lerp(cr.x, sx, pick), y: lerp(cr.y, sy, pick), r: lerp(cr.r, i ? -30 : 30, pick), s: lerp(1, sc, pick), o: 1 });
      });
      const lead = es(t, 2.35, 2.9);
      const jx = lerp(JX, 1000, lead), jy = lerp(682, 600, lead);
      jesus.set({ x: jx, y: jy, s: lerp(1.0, 0.82, lead), flip: t < 2.3 ? (t < 1.0 ? true : t < 2.0 ? false : true) : t > 3.0 ? true : false, walk: lead > 0.01 && lead < 0.99 ? jx * 0.06 : undefined, armF: 20 + bump(t, 0.1, 1.9) * 40 + (t > 3 ? 40 : 0), armB: 10 + bump(t, 0.1, 1.9) * 100 + es(t, 4.3, 4.5) * 90, head: -2, blink: blinkAt(T, 2) });
      pose(jGlow, { x: jx, y: jy - 170 * lerp(1.0, 0.82, lead), o: 0.5 });

      /* v39a — the man who clutches his life: the flame goes out */
      const cIn = es(t, 2.95, 3.15);
      const cx = 540;
      const clutch = es(t, 3.1, 3.3);
      clutcher.set({ x: cx, y: 742, s: 0.92, flip: false, o: cIn, armF: 60 + clutch * 20, armB: 50 + clutch * 30, head: 10 + clutch * 6, lean: clutch * 4, blink: blinkAt(T, 7) });
      const [chx, chy] = hand(cx, 742, 0.92, false, 80);
      const out = es(t, 3.35, 3.6);
      pose(fl1, { x: chx + 6, y: chy - 16, s: (1 - out) * (0.9 + Math.sin(T * 6) * 0.05), o: cIn * (1 - out) });
      pose(smoke, { x: chx + 6, y: chy - 20 - out * 20, s: 0.5 + out * 0.6, o: cIn * bump(t, 3.35, 3.95) });
      /* v39b — the one who gives it up for Him finds it */
      const [yhx, yhy] = hand(yx, yy, lerp(0.9, 0.7, es(t, 2.3, 2.9)), false, 20 + yCarry * 120);
      const give = seg(t, 4.1, 4.8);
      const upk = Math.min(1, give * 2), back = Math.max(0, give * 2 - 1);
      const tx = jx + 30, ty = jy - 200;
      const fx2 = give < 0.5 ? lerp(yhx, tx, ease.io(upk)) : lerp(tx, yhx, ease.io(back));
      const fy2 = give < 0.5 ? lerp(yhy - 30, ty, ease.io(upk)) - Math.sin(upk * PI) * 60 : lerp(ty, yhy - 60, ease.io(back)) - Math.sin(back * PI) * 60;
      pose(fl2, { x: fx2, y: fy2, s: 0.6 + back * 0.9, o: t > 4.02 ? 1 : 0 });
      stars.forEach((st, i) => {
        const k = bump(t, 4.55 + i * 0.05, 5.0);
        pose(st, { x: yhx - 30 + i * 30, y: yhy - 110 - (i % 2) * 20, s: k, r: T * 40, o: k });
      });

      S.cam.x = kf(t, [[0, -30], [0.9, -30], [1.2, 40], [2.0, 40], [2.5, 20], [3.0, 0]]);
      S.cam.y = -es(t, 2.3, 2.9) * 30;
      S.cam.z = 1 + bump(t, 0, 2) * 0.04;
    };
  },
};
