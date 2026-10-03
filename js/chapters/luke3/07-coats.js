// Łk 3,10–11 — "What then shall we do?": the people on the meadow raise their hands, question marks above them.
// John's answer is shown by two of them. A man wearing a tunic and a warm mantle over it takes the mantle off
// and lays it round the shoulders of a poor man shivering in thin rags. A woman with a basket of bread breaks
// off loaves and gives them to a hungry mother and her little boy, who lifts his loaf high.
import { C, person, blinkAt, sheet, shade, mix } from '../kit.js';
import {
  JOHN_B, headAt, hand, voiceRings, meadowSet, question, folk, group, cloak, flatbread, breadBasket, standRock,
  es, ease, bump, seg, fade, pose, lerp, PI,
} from './lib.js';

const JX0 = 530;
const RICH = { robe: C.wheatRobe, mantle: C.clayMantle, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather };
const POOR = { robe: mix(C.stone2, C.rock2, 0.4), hair: C.hair3, hairStyle: 'wild', beard: 'short', skin: C.skin3 };
const WOMAN = { robe: C.roseRobe, hairStyle: 'veil', veil: C.linen2, veil2: C.stone2, skin: C.skin, hair: C.hair, belt: C.ochre };
const MOTHER = { robe: mix(C.stone2, C.dustyBlue, 0.3), hairStyle: 'veil', veil: C.stone, veil2: C.stone2, skin: C.skin3, hair: C.hair3 };
const BOY = { robe: mix(C.stone, C.sand2, 0.4), hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin3 };

export default {
  id: 'lk3-coats',
  beats: [
    { v: 10 },
    { v: 11, text: 'On im odpowiadał: «Kto ma dwie suknie, niech [jedną] da temu, który nie ma;' },
    { v: 11, cont: true, text: 'a kto ma żywność, niech tak samo czyni».' },
  ],
  cam: { x: [-20, 40], y: [0, 60], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    const JX = PH ? 552 : JX0;   // phone: the whole row comes inward, the boy clear of the thread
    const M = meadowSet(S, { sunAt: [1260, 150] });
    const { GY } = M;
    /* the crowd behind (one still sheet) */
    const mem = Array.from({ length: 9 }, (_, k) => ({ x: (k - 4) * 70 + c.rr(-10, 10), y: c.rr(-6, 6), s: 1, flip: k > 4, o: folk(c) }));
    const crowdSp = M.back.sprite(`<g transform="scale(.5)">${group(c, mem)}</g>`, 820, 630);

    const warmL = S.layer({ par: 0.35, sh: 1, flat: true });
    const warmGlow = warmL.add(`<circle r="110" fill="url(#warm-glow)"/>`);
    const breadGlow = warmL.add(`<circle r="110" fill="url(#warm-glow)"/>`);
    const act = S.layer({ par: 0.35, sh: 5 });
    act.add(`<g transform="translate(${JX} ${GY + 6})">${standRock(c, 170, 60)}</g>`);
    const john = S.puppet(act.add(person(c, { ...JOHN_B })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5, both: false });

    /* the two coats */
    const rich = S.puppet(act.add(person(c, RICH)));
    const richOne = S.puppet(act.add(person(c, { ...RICH, mantle: null })));
    const poor = S.puppet(act.add(person(c, POOR)));
    const poorWarm = S.puppet(act.add(person(c, { ...POOR, mantle: C.clayMantle })));
    const coat = act.add(`<g>${cloak(c, C.clayMantle)}</g>`);

    /* the bread */
    const woman = S.puppet(act.add(person(c, { ...WOMAN, holdB: `<g transform="translate(0 6)">${breadBasket(c)}</g>` })));
    const mother = S.puppet(act.add(person(c, MOTHER)));
    const boy = S.puppet(act.add(person(c, BOY)));
    const loaves = [0, 1].map(() => act.add(`<g>${flatbread(c, 20)}</g>`));

    /* the question marks */
    const fx = S.layer({ par: 0.35, sh: 5 });
    const Q = [[660, 380], [840, 370], [PH ? 980 : 1040, 390], [860, 220]].map(([x, y], i) => ({ x, y, i, el: fx.add(`<g>${question(c)}</g>`) }));

    const [RX, PX, WX, MX, BX2] = PH ? [678, 800, 915, 1005, 1060] : [670, 810, 945, 1050, 1112];

    return (t, time) => {
      M.update(time);
      crowdSp.set({ x: 820, y: 630, o: 1 });

      /* v10 — "What then shall we do?" — hands go up */
      const ask = es(t, 0.1, 0.3) * (1 - es(t, 0.9, 1.05));
      Q.forEach((q) => {
        const k = es(t, 0.2 + q.i * 0.08, 0.36 + q.i * 0.08, ease.back) * (1 - es(t, 1.0, 1.1));
        pose(q.el, { x: q.x, y: q.y + Math.sin(time * 1.4 + q.i) * 4, s: k * (q.i === 3 ? 1.3 : 1), r: Math.sin(time + q.i) * 6, o: k > 0.01 ? 1 : 0 });
      });
      const answer = es(t, 1.03, 1.2) * (1 - es(t, 2.85, 3.0));
      john.set({ x: JX, y: GY, s: 1.22, armF: 20 + answer * 60 + bump(t, 2.0, 2.4) * 20, armB: 10 + answer * 30, head: -answer * 4, blink: blinkAt(time) });
      const [hx, hy] = headAt(JX, GY, 1.22);
      voice(hx + 14, hy, answer, time, { spread: 2.4, dir: 1 });

      /* v11a — two coats: he takes off his mantle and puts it on the man who has none */
      const off = es(t, 1.22, 1.28);
      const give = es(t, 1.3, 1.55);
      const on = es(t, 1.55, 1.61);
      const shiver = time && t < 1.55 ? Math.sin(time * 30) * 1.2 : 0;
      rich.set({ x: RX, y: GY, s: 1.2, o: 1 - off, armF: 20 + ask * 100, armB: 10 + ask * 20 + bump(t, 1.1, 1.26) * 80, head: -ask * 8, blink: blinkAt(time, 1) });
      richOne.set({ x: RX + give * 40, y: GY, s: 1.2, o: off, armF: 30 + give * 60 * (1 - on) + on * 50, armB: 20 + give * 60 * (1 - on), head: 6, lean: give * 4 * (1 - on), walk: give > 0 && give < 1 ? t * 30 : undefined, blink: blinkAt(time, 1) });
      const [cx0, cy0] = hand(RX, GY, 1.2, false, 60);
      const cx = lerp(cx0 + 10, PX - 4, give), cy = lerp(cy0, GY - 140, give) - Math.sin(give * PI) * 30;
      pose(coat, { x: cx, y: cy, r: lerp(-20, 0, give), s: lerp(0.95, 1.4, give), o: off > 0.5 && on < 0.5 ? 1 : 0 });
      poor.set({ x: PX, y: GY + 4, s: 1.18, flip: true, o: 1 - on, r: shiver, lean: 8, head: 12 - ask * 16, armF: 60 + ask * 30, armB: 70, blink: blinkAt(time, 3) });
      const warm = es(t, 1.6, 1.8);
      poorWarm.set({ x: PX, y: GY + 4, s: 1.18, flip: true, o: on, lean: 8 - warm * 8, head: 12 - warm * 18, armF: 60 - warm * 10, armB: 70 + warm * 40, blink: blinkAt(time, 3) });

      /* v11b — food: bread from the basket for the hungry mother and her boy */
      const hand1 = bump(t, 2.12, 2.5), hand2 = bump(t, 2.36, 2.74);
      woman.set({ x: WX, y: GY - 2, s: 1.15, flip: false, armF: 20 + ask * 90 + Math.max(hand1, hand2) * 70, armB: 30 + ask * 10, head: -ask * 8 + 4, blink: blinkAt(time, 5) });
      const got = es(t, 2.46, 2.52), got2 = es(t, 2.7, 2.76);
      const eat = es(t, 2.52, 2.72);
      const mArm = 30 + ask * 70 + hand1 * 50 + got * 20;
      mother.set({ x: MX, y: GY + 2, s: 1.13, flip: true, armF: mArm, armB: 20, head: 10 - ask * 16 - got * 8, lean: 6 * (1 - got), blink: blinkAt(time, 6) });
      boy.set({ x: BX2, y: GY + 6, s: 0.72, flip: true, armF: 30 + ask * 100 + got2 * 120, armB: 20 + got2 * 30, head: 6 - ask * 18 - got2 * 12, blink: blinkAt(time, 7) });
      const [wx, wy] = hand(WX, GY - 2, 1.15, false, 90);
      const [mx, my] = hand(MX, GY + 2, 1.13, true, mArm);
      const [bx, by] = hand(BX2, GY + 6, 0.72, true, 150);
      const k1 = seg(t, 2.18, 2.46), k2 = seg(t, 2.42, 2.7);
      pose(loaves[0], { x: lerp(wx, mx, k1), y: lerp(wy, my, k1) - Math.sin(k1 * PI) * 30, r: k1 * 30, o: k1 > 0 ? 1 : 0 });
      pose(loaves[1], { x: lerp(wx, bx, k2), y: lerp(wy, by - 6, k2) - Math.sin(k2 * PI) * 40, r: k2 * -20, o: k2 > 0 ? 1 : 0 });

      pose(warmGlow, { x: PX, y: GY - 130, o: es(t, 1.6, 1.85) * 0.8 });
      pose(breadGlow, { x: (MX + BX2) / 2, y: GY - 110, o: es(t, 2.5, 2.75) * 0.8 });
      S.cam.x = es(t, 1.0, 1.3) * 10 + es(t, 1.9, 2.2) * 30;
      S.cam.z = 1.02 + es(t, 1.0, 1.3) * 0.07;
      S.cam.y = 30;
    };
  },
};
