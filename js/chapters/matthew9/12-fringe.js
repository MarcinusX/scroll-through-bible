// Mt 9,20–22 — in the street the crowd walks along with Jesus behind the ruler. A woman in grey, a little rain
// cloud over her head and twelve grey moons on a string for her twelve years of bleeding, creeps up behind Him
// and touches the tassel of His cloak — a warm spark. "If I only touch His cloak, I shall be well," she thinks.
// Jesus turns and sees her: "Take heart, daughter! Your faith has made you well." And from that hour she is well:
// she stands up in warm colours, the rain cloud lifts and the twelve moons turn to gold.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { streetSet, L5, RULER, jesusWithFringe, sorrowCloud, thinkBubble, bubble, spark, heart, mob, hand, headAt, kf, moving, tr, DAY } from './lib.js';

const FEET = 722;

export default {
  id: 'mt9-fringe',
  beats: [
    { v: 20, text: 'Wtem jakaś kobieta, która dwanaście lat cierpiała na krwotok,' },
    { v: 20, cont: true, text: 'podeszła z tyłu i dotknęła się frędzli Jego płaszcza.' },
    { v: 21 },
    { v: 22, text: 'Jezus obrócił się, i widząc ją, rzekł: «Ufaj, córko! Twoja wiara cię ocaliła».' },
    { v: 22, cont: true, text: 'I od tej chwili kobieta była zdrowa.' },
  ],
  cam: { x: [-80, 40], y: [0, 60], z: [1, 1.16] },
  build(S) {
    const set = streetSet(S, { skyCols: DAY, sunAt: [1250, 130] });
    const c = S.c;

    /* the crowd walking along (still sprites that slide), behind */
    const backL = S.layer({ par: 0.5, sh: 4 });
    const backs = [[330, -30, 'a', 4], [930, -34, 'b', 5], [1200, -26, 'c', 5]].map(([x, dy, k, n], i) => ({ i, x, y: FEET + dy, sp: backL.sprite(mob(makeCutter('mt9-fringe-' + k), n, { s: 0.86, spread: 44, rows: 2, flip: false, arms: 20 }), x, FEET + dy) }));

    /* the people of the story */
    const L = S.layer({ par: 0.5, sh: 5 });
    const ruler = S.puppet(L.add(person(c, RULER)));
    const peter = S.puppet(L.add(person(c, { ...CAST.peter })));
    const jesus = S.puppet(L.add(jesusWithFringe(c)));
    const john = S.puppet(L.add(person(c, { ...CAST.john })));
    const wWalk = S.puppet(L.add(person(c, L5.ill)));
    const wKneel = S.puppet(L.add(person(c, { ...L5.ill, pose: 'kneel' })));
    const wWell = S.puppet(L.add(person(c, L5.well)));

    /* her sorrow, her years, her thought; the spark; His words */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const cloudEl = fx.add(`<g>${sorrowCloud(c, 84)}</g>`);
    const drops = [...cloudEl.querySelectorAll('.drop')];
    const thread = fx.add(`<g><path d="${c.ribbon(Array.from({ length: 12 }, (_, i) => [500 + i * 22, 380 + Math.sin(i * 0.6) * 5]), 1.4)}" fill="rgba(74,54,34,.5)"/><path d="M500 380V-1400M742 ${380 + Math.sin(11 * 0.6) * 5}V-1400" stroke="rgba(74,54,34,.45)" stroke-width="1.2"/></g>`);
    const moons = Array.from({ length: 12 }, (_, i) => ({ i, grey: fx.add(`<g><circle r="9" fill="${mix(C.stone2, C.storm, 0.35)}"/><circle cx="3" cy="-2" r="7.5" fill="${mix(C.stone, C.stone2, 0.5)}"/></g>`), gold: fx.add(`<g><circle r="20" fill="url(#warm-glow)"/><circle r="9" fill="${C.sun}"/><circle cx="-2" cy="-2" r="4" fill="${C.star}"/></g>`) }));
    const years = fx.add(`<g opacity="0"><text x="0" y="0" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="22" font-style="italic" fill="${C.ink}">${tr('dwanaście lat', 'twelve years')}</text></g>`);
    const think = fx.add(`<g opacity="0">${thinkBubble(c, [tr('Żebym się choć Jego', 'If I just touch'), tr('płaszcza dotknęła…', 'his garment…')], { size: 20, dir: -1 })}</g>`);
    const sp = fx.add(`<g>${spark(c, 14)}</g>`);
    const say = fx.add(`<g opacity="0">${bubble(c, [tr('Ufaj, córko!', 'Daughter, cheer up!'), tr('Twoja wiara cię ocaliła', 'Your faith has made you well')], { size: 20, dir: 1 })}</g>`);
    const warm = fx.add(`<g>${heart(c, 14)}</g>`);

    // the procession: everybody walks on, then stops when He turns
    const WK = [[-0.3, -140], [1.3, 0]];
    return (t, time) => {
      const T = time;
      set.update(t, T);
      const d = kf(t, WK, ease.out);
      const walking = moving(t, WK, 0.3);
      backs.forEach((b) => b.sp.set({ x: b.x + d * 0.8, y: b.y - (walking ? Math.abs(Math.sin((b.x + d) * 0.05 + b.i)) * 2 : 0) }));

      const JX = 800 + d;
      const turn = es(t, 3.05, 3.15);
      ruler.set({ x: JX + 250, y: FEET - 8, s: 0.98, flip: es(t, 3.2, 3.4) > 0.5, walk: walking ? (JX + 250) * 0.05 : undefined, armF: 20 + es(t, 3.3, 3.6) * 40, armB: 10, blink: blinkAt(T, 4) });
      peter.set({ x: JX + 110, y: FEET - 14, s: 0.96, flip: es(t, 1.9, 2.1) > 0.5, walk: walking ? (JX + 110) * 0.05 + 1 : undefined, armF: 14 + bump(t, 3.2, 4.2) * 40, blink: blinkAt(T, 2) });
      jesus.set({ x: JX, y: FEET, s: 1.04, flip: turn > 0.5, walk: walking ? JX * 0.05 : undefined, armF: 14 + es(t, 3.2, 3.45) * 60, armB: 8 + es(t, 3.2, 3.45) * 20, head: turn * 10, blink: blinkAt(T) });
      john.set({ x: JX + 60, y: FEET + 16, s: 1, walk: walking ? (JX + 60) * 0.05 + 2 : undefined, flip: turn > 0.5, armF: 16, blink: blinkAt(T, 6) });

      /* v20a — the woman, grey, with her cloud and twelve moons */
      const WX = kf(t, [[0.1, 420], [1.05, 560], [1.4, JX - 116]]);
      const kneel = es(t, 1.4, 1.46);
      const healed = es(t, 4.1, 4.2);
      const inWalk = seg(t, 0.05, 0.15);
      wWalk.set({ x: WX, y: FEET + 10, s: 0.96, walk: t > 0.1 && t < 1.4 ? WX * 0.06 : undefined, armF: 20 + es(t, 1.1, 1.4) * 40, lean: 6 + es(t, 1.05, 1.4) * 8, head: 8, o: inWalk * (1 - kneel), blink: blinkAt(T, 5) });
      const reach = es(t, 1.45, 1.7) * (1 - es(t, 3.3, 3.6));
      wKneel.set({ x: JX - 116, y: FEET + 12, s: 0.96, o: kneel * (1 - healed), armF: 30 + reach * 60, armB: 20, lean: reach * 24, head: 10 - es(t, 3.2, 3.5) * 22, blink: blinkAt(T, 5) });
      wWell.set({ x: JX - 110, y: FEET + 12, s: 0.96, o: healed, armF: 50, armB: 80, head: -8, blink: blinkAt(T, 5) });
      const [hx, hy] = hand(JX - 116, FEET + 12, 0.96, false, 30 + reach * 60, reach * 24, 46);
      pose(sp, { x: hx + 4, y: hy, s: 0.8 + bump(t, 1.6, 2.6) * 0.5, r: T * 30, o: bump(t, 1.55, 3.0) });

      // the rain cloud follows her head, then lifts away
      const [whx, why] = t < 1.4 ? headAt(WX, FEET + 10, 0.96, false) : headAt(JX - 116, FEET + 12, 0.96, false, 46);
      const lift = es(t, 4.1, 4.5);
      const rain = 1 - es(t, 1.7, 1.9) * 0.7 - lift;
      pose(cloudEl, { x: whx, y: why - 70 - lift * 300, o: inWalk * (1 - lift) });
      drops.forEach((dr, i) => {
        const k = T ? ((T * 1.4 + i / 5) % 1) : i / 5;
        pose(dr, { x: -30 + i * 15, y: 6 + k * 34, o: Math.max(0, rain) * (1 - k) });
      });
      moons.forEach((m) => {
        const x = 500 + m.i * 22, y = 380 + Math.sin(m.i * 0.6) * 5;
        const on = es(t, 0.2 + m.i * 0.04, 0.35 + m.i * 0.04);
        const g = es(t, 4.1 + m.i * 0.03, 4.25 + m.i * 0.03);
        pose(m.grey, { x, y, s: on, o: on > 0.02 ? 1 - g : 0 });
        pose(m.gold, { x, y: y - g * 10, s: g, o: g > 0.02 ? 1 : 0 });
      });
      pose(thread, { o: es(t, 0.15, 0.3) });
      pose(years, { x: 500 + 11 * 11, y: 420, o: es(t, 0.6, 0.8) * (1 - es(t, 1.9, 2.1)) });

      /* v21 — her thought */
      const tk = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(think, { x: whx - 10, y: why - 30, s: tk, o: tk > 0.02 ? 1 : 0 });

      /* v22 — He turns: "Take heart, daughter" */
      const sk = es(t, 3.2, 3.4, ease.back) * (1 - es(t, 4.0, 4.1));
      pose(say, { x: JX - 20, y: FEET - 226, s: sk, o: sk > 0.02 ? 1 : 0 });
      const hk = es(t, 4.2, 4.45, ease.back);
      pose(warm, { x: JX - 100, y: FEET - 230 - hk * 16, s: hk, o: hk > 0.02 ? 1 : 0 });

      S.cam.x = -50 + es(t, 0.3, 1.4) * 40 + es(t, 3.0, 3.4) * 20;
      S.cam.z = 1.04 + es(t, 1.2, 1.6) * 0.08;
      S.cam.y = 20 + es(t, 1.2, 1.6) * 30;
    };
  },
};
