// J 8,46–51 — "Which of you convicts Me of sin?" — a pair of scales comes down; He opens His hands; the leaders look
// for something to lay on the pan and find nothing — it stays empty. "Whoever is of God hears God's words" — an ear
// on a string, rings of the word coming down; the listeners lean in, the leaders turn aside. "A Samaritan! A demon!"
// — two paper tags are flung at Him and flutter down short of Him. "I honour My Father" — He lifts His hands to the
// light. "I do not seek My own glory" — a crown comes down to Him; He does not take it, and it rises back into the
// light of the One who seeks and judges. "Whoever keeps My word will never see death" — a listener holds the scroll
// to his heart; a little flame over him stays alight while a dark wind blows past, and a ring without end draws round it.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { ear } from '../../assets/things.js';
import { crown } from '../mark6/lib.js';
import { nightStage, DC, NIGHT, voiceRings, radiance, scalesParts, poseScales, question, strip, soulLight, scrollOpen, eternityRing, drawRing, hand, kf, vis, tr, PI } from './lib.js';

export default {
  id: 'j8-honour',
  beats: [
    { v: 46 },
    { v: 47 },
    { v: 48 },
    { v: 49 },
    { v: 50 },
    { v: 51 },
  ],
  cam: { x: [-80, 100], y: [-120, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const st = nightStage(S, { skyCols: NIGHT });
    const K = st.cast;
    const fx = st.fx;
    const rings = voiceRings(fx, c, { n: 3, r: 36, w: 5, both: false, color: shade(C.halo, -0.05) });
    const ringsDown = voiceRings(fx, c, { n: 3, r: 26, w: 4, both: false, color: shade(C.halo, -0.05) });
    const SP = scalesParts(c, { arm: 100, drop: 60 });
    const sc = { frame: fx.add(`<g>${SP.frame}</g>`), beam: fx.add(`<g>${SP.beam}</g>`), panL: fx.add(`<g>${SP.pan}</g>`), panR: fx.add(`<g>${SP.pan}</g>`) };
    const q = fx.add(`<g>${question(c)}</g>`);
    const earEl = fx.add(`<g><path d="M0 -1600V-40" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><circle r="70" fill="url(#halo-glow)"/>${ear(c, C.skin2)}</g>`);
    const tags = [tr('Samarytanin!', 'Samaritan!'), tr('opętany!', 'a demon!')].map((w) => fx.add(`<g>${strip(c, w, { size: 18, fill: mix(C.stone2, C.cream, 0.4) })}</g>`));
    const lightL = S.layer({ par: 0.5, sh: 1 });
    const rad = lightL.add(`<g><circle r="200" fill="url(#halo-glow)"/>${radiance(c, 52)}</g>`);
    const crn = fx.add(`<g><circle r="60" fill="url(#halo-glow)"/><g transform="scale(1.6)">${crown(c)}</g></g>`);
    // the one who keeps the word
    const keeper = K.lis[3];
    const scr = fx.add(`<g transform="scale(.6)">${scrollOpen(c, 90, 60)}</g>`);
    const flame = fx.add(`<g>${soulLight(c, 14)}</g>`);
    const ring = fx.add(`<g>${eternityRing(c, 70, 6, 24)}</g>`);
    const wind = fx.add(`<g>${[0, 1, 2].map((i) => `<path d="${c.ribbon(c.cbez([0, i * 26], [80, i * 26 - 30], [160, i * 26 + 30], [260, i * 26], 20), (u) => 2 + Math.sin(u * PI) * 5)}" fill="#2a2548" opacity=".75"/>`).join('')}</g>`);

    return (t, time) => {
      const T = time;
      st.set.update(t, T, { lit: 1, moonY: 150, glowO: 0.7, gate: 0.6 });
      /* v46 — the empty pan */
      const sk = es(t, 0.05, 0.4, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      poseScales(sc, 980, 300 - (1 - sk) * 700, 0, sk > 0.001 ? 1 : 0, 1, 100);
      const qk = es(t, 0.45, 0.65, ease.back) * (1 - es(t, 0.95, 1.05));
      vis(q, { x: 880, y: 330, s: qk, o: qk > 0.01 ? 1 : 0 });
      /* v47 — the ear and the word from above */
      const ek = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      vis(earEl, { x: 560, y: 340 - (1 - ek) * 700, s: 1.5, o: ek > 0.001 ? 1 : 0 });
      ringsDown(560, 230, bump(t, 1.3, 1.95), T, { dir: 1, s0: 0.6, spread: 1.2 });
      /* v48 — the tags flung, falling short */
      tags.forEach((el, i) => {
        const k = seg(t, 2.25 + i * 0.12, 2.75 + i * 0.12);
        const x = lerp(1000 - i * 20, 880 - i * 30, k), y = lerp(DC.FLOOR - 230 - i * 20, DC.FLOOR - 10 + i * 8, k * k) - Math.sin(k * PI) * 60;
        vis(el, { x, y, r: k * (i ? -40 : 30) + Math.sin(k * 8) * 10 * (1 - k), o: k > 0 ? 1 - es(t, 3.6, 3.9) : 0 });
      });
      /* v49 — honour to the Father; v50 — the crown not taken */
      const rk = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 5.0, 5.3));
      vis(rad, { x: DC.JX, y: 120 - (1 - es(t, 3.05, 3.4, ease.out)) * 400, o: rk });
      const down = es(t, 4.1, 4.45), back = es(t, 4.6, 4.95);
      const cy = lerp(lerp(160, DC.FLOOR - 250, down), 150, back);
      vis(crn, { x: DC.JX, y: cy, s: 1.3, o: down > 0 ? 1 - es(t, 4.85, 5.0) : 0 });
      /* v51 — the flame that does not go out */
      const kk = es(t, 5.05, 5.35);
      const [hx, hy] = hand(keeper.x, keeper.y, keeper.s, false, 20 + kk * 60);
      vis(scr, { x: hx + 4, y: hy - 6, s: 0.6, o: kk });
      const fx0 = keeper.x + 6, fy0 = keeper.y - 250;
      vis(flame, { x: fx0, y: fy0 + (T ? Math.sin(T * 2) * 2 : 0), s: kk, o: kk > 0.01 ? 1 : 0 });
      const wk = seg(t, 5.35, 5.8);
      vis(wind, { x: lerp(200, 700, wk), y: fy0 - 40, o: wk > 0 && wk < 1 ? Math.sin(wk * PI) : 0 });
      vis(ring, { x: fx0, y: fy0, o: kk });
      drawRing(ring, es(t, 5.5, 5.95));

      const open = bump(t, 0.1, 0.95);
      const honour = bump(t, 3.1, 3.95);
      const decline = bump(t, 4.35, 4.95);
      const talk = Math.max(bump(t, 0.05, 1.95), bump(t, 3.05, 5.95));
      K.set(T, {
        j: { armF: 16 + talk * 20 + open * 50 + decline * 50, armB: 10 + open * 60 + honour * 150, head: -honour * 14 + decline * 6 },
        lisF: (m) => ({ head: -4 + bump(t, 1.2, 1.95) * 8, lean: bump(t, 1.2, 1.95) * 5, armF: 14 + (m === keeper ? kk * 60 : 0) }),
        leadF: (m) => {
          const seek = bump(t, 0.3, 0.95);
          const aside = bump(t, 1.2, 1.95);
          const fling = m.i < 2 ? bump(t, 2.15 + m.i * 0.12, 2.6 + m.i * 0.12) : 0;
          return { flip: !(aside > 0.5 && m.i % 2), head: seek * 12 * (m.i % 2 ? 1 : -1), armF: 20 + seek * 30 + fling * 110, armB: 10 + fling * 40, angry: 0.4 + bump(t, 2.05, 2.95) * 0.6 };
        },
      });
      rings(DC.JX + 6, DC.FLOOR - 172, talk, T, { dir: 1, s0: 0.7, spread: 1.8 });

      S.cam.x = kf(t, [[0, 60], [1.0, 40], [1.3, -40], [2.0, -20], [2.3, 50], [3.0, 40], [3.3, 0], [5.0, 0], [5.3, -80]]);
      S.cam.y = kf(t, [[0, -60], [1.0, -40], [1.3, -60], [2.0, -20], [3.0, 0], [3.3, -60], [5.0, -40], [5.3, -60]]);
      S.cam.z = kf(t, [[0, 1.06], [2.3, 1.1], [3.3, 1.04], [5.0, 1.06], [5.3, 1.14]]);
    };
  },
};
