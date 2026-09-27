// J 11,32–37 — on the road below Bethany. Mary runs up and falls at Jesus's feet: "Lord, if You had been here, my
// brother would not have died" — the same little frame her sister held up: the bed and the dotted outline of the One
// who was not there. The mourners weep; Jesus is deeply moved — His heart trembles and soft rings of sorrow spread —
// and He asks, "Where have you laid him?" "Lord, come and see": a mourner points up the road to the tomb. Then the
// shortest verse: everything goes still, the light narrows to His face, and a single tear falls. "See how He loved
// him!" — a great heart rises with the friend's portrait in it. But two whisper: "Could not He who opened the blind
// man's eyes…?" — an eye opening, then a question mark beside the closed cave.
import { C, person, CAST, blinkAt } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  bethanySet, SOFT, DISC, LAZARUS, mournerOpts, martha, mary, withFace, faceBits, framed, bedIcon, absentOutline, heart, medallion, question, thought,
  caveIcon, iconBubble, signpost, voiceRings, hang2, vis, kf, moving, headAt, pose, attr, sheet, shade, mix, lerp, tr, PI,
} from './lib.js';

const F = 706;

/** an eye that opens (origin centre); .lid scales from shut to open */
function eyeIcon(c, r = 26) {
  const s = sheet();
  s.p(c.cut([...c.arc(0, 0, r, r * 0.62, PI, 2 * PI, 12), ...c.arc(0, 0, r, r * 0.62, 0, PI, 12)], 0.3, 4), C.cream);
  s.p(c.cut(c.circ(0, 0, r * 0.42, 16), 0.2, 3), C.teal2).p(c.cut(c.circ(0, 0, r * 0.2, 10), 0.1, 2), C.ink);
  s.x(c.poly(c.circ(-r * 0.12, -r * 0.14, r * 0.08, 6)), '#fff');
  const lid = sheet().p(c.cut([...c.arc(0, 0, r + 1, r * 0.64, PI, 2 * PI, 12), [r + 1, 2], [-r - 1, 2]], 0.3, 4), C.skin2).out();
  return `${s.out()}<g class="lid">${lid}</g><path d="${c.ribbon(c.arc(0, 0, r + 1, r * 0.64, PI, 2 * PI, 12), 2.2)}" fill="${C.inkSoft}"/>`;
}

export default {
  id: 'j11-wept',
  beats: [
    { v: 32, text: 'A gdy Maria przyszła do miejsca, gdzie był Jezus, ujrzawszy Go upadła Mu do nóg i rzekła do Niego:' },
    { v: 32, cont: true, text: '«Panie, gdybyś tu był, mój brat by nie umarł».' },
    { v: 33 },
    { v: 34 },
    { v: 35 },
    { v: 36 },
    { v: 37 },
  ],
  cam: { x: [-40, 120], y: [-80, 150], z: [1, 2.3] },
  build(S) {
    const c = S.c;
    const set = bethanySet(S, { skyCols: SOFT, sunAt: [560, 170], tint: 0.12 });
    const A = S.layer({ par: 0.52, sh: 5 });
    const DP = [[640, F + 4], [575, F + 16], [515, F + 6], [455, F + 18], [395, F + 8], [335, F + 14]];
    const disc = DISC.map((o, i) => ({ i, x: DP[i][0], y: DP[i][1], p: S.puppet(A.add(person(c, o))) }));
    const MO = [
      { x: 1040, y: F + 4 }, { x: 1110, y: F + 14 }, { x: 1180, y: F + 2 }, { x: 1250, y: F + 12 }, { x: 1320, y: F + 6 },
    ].map((m, i) => ({ ...m, i, p: S.puppet(A.add(withFace(person(c, mournerOpts(i + 3)), faceBits(c)))) }));
    MO.forEach((m) => { m.tear = m.p.el.querySelector('[data-part="tear"]'); });
    const mt = S.puppet(A.add(martha(c)));
    const jesus = S.puppet(A.add(withFace(person(c, CAST.jesus), faceBits(c))));
    const jTear = jesus.el.querySelector('[data-part="tear"]'), jSad = jesus.el.querySelector('[data-part="sad"]');
    const maryRun = S.puppet(A.add(mary(c)));
    const maryK = S.puppet(A.add(mary(c, { pose: 'kneel' }, faceBits(c))));
    const mTear = maryK.el.querySelector('[data-part="tear"]');
    set.front();
    // the stillness of v35: the world dims around Him
    const hush = S.layer({ par: 0.6, sh: 0, flat: true });
    const hid = S.id('hush');
    S.defs(`<radialGradient id="${hid}" gradientUnits="userSpaceOnUse" cx="805" cy="545" r="330"><stop offset="0" stop-color="${C.night2}" stop-opacity="0"/><stop offset=".45" stop-color="${C.night2}" stop-opacity=".12"/><stop offset="1" stop-color="${C.night2}" stop-opacity=".55"/></radialGradient>`);
    hush.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${hid})"/>`);
    const tearL = S.layer({ par: 0.52, sh: 0, flat: true });
    const hushGlow = tearL.add(`<g><circle r="160" fill="url(#halo-glow)" opacity=".7"/></g>`);
    const drop = tearL.add(`<g><path d="${c.cut([[0, -5], [3, 1], [2, 4], [-2, 4], [-3, 1]], 0.1, 2)}" fill="#bfe0ee"/><circle cx="-0.6" cy="1" r=".9" fill="#fff"/></g>`);
    const X = S.layer({ par: 0.62, sh: 6 });
    const PW = 280, PH = 170;
    const inner = `<rect x="${-PW / 2}" y="${-PH / 2}" width="${PW}" height="${PH}" fill="${mix(C.plaster, C.parchment, 0.4)}"/><rect x="${-PW / 2}" y="${PH / 2 - 28}" width="${PW}" height="28" fill="${mix(C.sand2, C.stone2, 0.4)}"/>` +
      `<g transform="translate(40 ${PH / 2 - 26}) scale(1.4)">${bedIcon(c, LAZARUS)}</g><g class="ghost" transform="translate(-66 ${PH / 2 - 24}) scale(.64)"><circle cy="-100" r="90" fill="url(#halo-glow)"/>${absentOutline(c, 1.1, C.terracotta)}</g>`;
    const ifP = X.add(`<g>${framed(S, inner, { w: PW, h: PH, rim: C.wood3, k: 'if2' })}</g>`);
    const ghost = ifP.querySelector('.ghost');
    const jHeart = X.add(`<g>${heart(c, 14, C.jesusMantle)}</g>`);
    const rings = voiceRings(X, c, { n: 3, r: 30, w: 4, color: mix(C.roseRobe, C.lavender, 0.4) });
    const where = X.add(`<g>${iconBubble(c, `<g transform="translate(-14 22) scale(.7)">${caveIcon(c)}</g><g transform="translate(26 2) scale(.7)">${question(c)}</g>`, { w: 110, h: 80, side: 1 })}</g>`);
    const post = X.add(`<g>${signpost(c, tr('grób', 'the tomb'), { size: 22, dir: 1 })}</g>`);
    const big = X.add(`<g>${hang2(`${heart(c, 60, C.jesusMantle)}<g transform="translate(0 -6)">${medallion(c, LAZARUS, { r: 28, rim: C.cream, back: C.blushVeil })}</g>`, 0.01, 300)}</g>`);
    const eye = X.add(`<g>${thought(c, `<g transform="translate(-24 0)">${eyeIcon(c, 22)}</g><g transform="translate(34 22) scale(.62)">${caveIcon(c)}</g><g transform="translate(34 -26) scale(.6)">${question(c)}</g>`, { w: 150, h: 100 })}</g>`);
    const lid = eye.querySelector('.lid');

    const RK = [[0, 1400], [0.5, 900]];
    return (t, time) => {
      const T = time;
      pose(set.sunEl, { x: 560, y: 170, r: Math.sin(T * 0.6) * 1.5 });
      pose(set.cl, { x: 900 + Math.sin(T * 0.1) * 20, y: 170, r: 0 });

      /* v32a — Mary comes and falls at His feet */
      const rx = kf(t, RK, ease.out);
      const fall = seg(t, 0.52, 0.58);
      maryRun.set({ x: rx, y: F + 12, s: 0.96, flip: true, walk: moving(t, RK) ? rx * 0.13 : undefined, amt: 1.5, lean: -6, armF: 40, blink: blinkAt(T, 4), o: 1 - fall });
      const bow = es(t, 0.55, 0.8);
      maryK.set({ x: 880, y: F + 14, s: 0.96, flip: true, armF: 60 + bow * 40 - es(t, 1.1, 1.3) * 30, armB: 30 + bow * 30, lean: -bow * 22 + es(t, 1.05, 1.3) * 16, head: bow * 10 - es(t, 1.05, 1.3) * 16, blink: blinkAt(T, 4), o: fall });
      if (mTear) attr(mTear, 'opacity', es(t, 1.1, 1.3));

      /* the mourners come after her and weep */
      MO.forEach((m) => {
        const K = [[0.2 + m.i * 0.07, m.x + 520], [0.95 + m.i * 0.07, m.x]];
        const x = kf(t, K, ease.out);
        const weep = es(t, 2.05 + m.i * 0.05, 2.3 + m.i * 0.05) * (1 - es(t, 3.0, 3.2));
        const point = m.i === 0 ? es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.05)) : 0;
        const talk = m.i >= 3 ? es(t, 6.05, 6.3) : 0;
        const say = m.i < 3 ? es(t, 5.05, 5.3) * (1 - es(t, 5.9, 6.05)) : 0;
        m.p.set({ x: x - talk * (m.i === 4 ? 40 : 0), y: m.y, s: 0.9, flip: m.i === 3 && talk > 0.5 ? false : true, walk: moving(t, K) ? x * 0.11 : undefined, armF: 12 + weep * 30 + point * 100 + say * 50 + talk * 30, armB: 8 + weep * 20, head: 6 + weep * 12 - point * 6 - say * 8, lean: -point * 4, blink: blinkAt(T, m.i + 6) });
        if (m.tear) attr(m.tear, 'opacity', weep * (m.i % 2 ? 1 : 0.6));
      });
      mt.set({ x: 960, y: F + 8, s: 0.98, flip: true, armF: 20 + es(t, 2.1, 2.3) * 20, armB: 10, head: 10, blink: blinkAt(T, 2) });

      /* v32b — the frame again */
      const fk = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 1.95, 2.15));
      vis(ifP, { x: 900, y: 320 - (1 - fk) * 520, r: Math.sin(T * 0.7) * 0.8, o: fk > 0.01 ? 1 : 0 });
      if (ghost) attr(ghost, 'opacity', 0.6 + 0.3 * Math.sin(T * 2));

      /* v33 — deeply moved; "where have you laid him?" */
      const moved = es(t, 2.1, 2.4) * (1 - es(t, 3.0, 3.2));
      const [hx, hy] = headAt(800, F + 12, 1.04, false);
      vis(jHeart, { x: 800 + 4, y: F + 12 - 118, s: moved * (1 + Math.sin(T * 7) * 0.06), o: moved > 0.01 ? 1 : 0 });
      rings(800 + 4, F + 12 - 118, moved, T, { spread: 2.6, speed: 0.35 });
      const wq = es(t, 2.6, 2.85, ease.back) * (1 - es(t, 3.2, 3.35));
      vis(where, { x: hx + 26, y: hy - 30, s: wq, o: wq > 0.01 ? 1 : 0 });

      /* v34 — "come and see" */
      const pk = es(t, 3.1, 3.4, ease.back) * (1 - es(t, 3.9, 4.05));
      vis(post, { x: 1110, y: 520 - (1 - pk) * 520, r: Math.sin(T * 0.8) * 1.2, o: pk > 0.01 ? 1 : 0 });

      /* v35 — Jesus wept */
      const still = es(t, 4.05, 4.35) * (1 - es(t, 4.85, 5.1));
      hush.fade(still);
      vis(hushGlow, { x: hx, y: hy, s: 1, o: still });
      if (jTear) attr(jTear, 'opacity', es(t, 4.3, 4.45) * (1 - es(t, 5.4, 5.7)));
      if (jSad) attr(jSad, 'opacity', es(t, 2.1, 2.4) * (1 - es(t, 5.4, 5.7)));
      const df = es(t, 4.5, 4.95, ease.in);
      vis(drop, { x: hx + 15 * 1.04, y: hy + 10 + df * 70, s: 1.4, o: df > 0.01 && df < 0.98 ? 1 - df * 0.4 : 0 });
      jesus.set({ x: 800, y: F + 12, s: 1.04, armF: 16 + bump(t, 2.55, 3.1) * 50, armB: 10, head: moved * 8 + still * 10, blink: still > 0.5 ? 0 : blinkAt(T, 1) });
      disc.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.92, armF: 10, head: 6 + still * 4, blink: blinkAt(T, d.i + 4) }));

      /* v36 — "see how He loved him" */
      const bk = es(t, 5.1, 5.45, ease.back) * (1 - es(t, 5.95, 6.15));
      vis(big, { x: 800, y: 300 - (1 - bk) * 520 + Math.sin(T * 1.4) * 4, r: Math.sin(T * 0.8) * 2, o: bk > 0.01 ? 1 : 0 });

      /* v37 — "could not He who opened the eyes of the blind…?" */
      const ek = es(t, 6.1, 6.4, ease.back);
      vis(eye, { x: 1150, y: 470, s: ek, o: ek > 0.01 ? 1 : 0 });
      if (lid) pose(lid, { sy: Math.max(0.05, 1 - es(t, 6.35, 6.6)), oy: -2 });

      S.cam.x = kf(t, [[0, 80], [1, 40], [2, 40], [3, 60], [4.02, 20], [4.4, 8], [4.9, 8], [5.2, 0], [6, 20], [7, 100]]);
      S.cam.y = kf(t, [[0, 0], [1, -40], [2, -30], [3, -20], [4.02, -10], [4.4, 138], [4.9, 138], [5.2, -60], [6, -60], [7, -20]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.04], [2, 1.02], [3, 1.04], [4.02, 1.02], [4.4, 2.2], [4.9, 2.2], [5.2, 1.1], [6, 1.0], [7, 1.08]]);
    };
  },
};
