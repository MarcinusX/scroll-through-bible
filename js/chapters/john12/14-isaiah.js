// J 12,37–41 — a night stage. The seven signs hang in an arc of golden medallions — and beneath them the people stand
// with their backs turned, arms folded: they did not believe. Isaiah steps in with his scroll: "Lord, who has believed
// our report?" — his voice goes out and hardly anyone turns. "To whom has the arm of the Lord been revealed?" — a
// long arm of light reaches down from the heights, unheeded. Isaiah turns his scroll: dark bands settle over their
// eyes and their hearts turn to stone; above them four pale plates of what might have been — to see, to understand,
// to turn, to be healed — stay unlit. Then Isaiah's vision: high and lifted up, a throne of light with seraphim, the
// glory he saw — His glory — and the old prophet kneels.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  darkStage, ISAIAH, man, crowdPerson, addToHead, signBadge, verseScroll, voiceRings, headAt, hand, nameTag, hanging, swing, kf, vis, blindBand, stoneHeart, heart,
  eyeIcon, seraph, throneOfLight, glowDisc, soulLight, spark, tr, PI, FONT,
} from './lib.js';

export default {
  id: 'j12-isaiah',
  beats: [
    { v: 37 },
    { v: 38, text: 'aby się spełniło słowo proroka Izajasza, który rzekł:' },
    { v: 38, cont: true, text: 'Panie, któż uwierzył naszemu głosowi?' },
    { v: 38, cont: true, text: 'A ramię Pańskie komu zostało objawione?' },
    { v: 39 },
    { v: 40, text: 'Zaślepił ich oczy i twardym uczynił ich serce,' },
    { v: 40, cont: true, text: 'żeby nie widzieli oczami oraz nie poznali sercem i nie nawrócili się, ażebym ich uzdrowił.' },
    { v: 41 },
  ],
  cam: { x: [-60, 80], y: [-140, 40], z: [0.98, 1.14] },
  build(S) {
    const c = S.c;
    const st = darkStage(S);
    const F = st.FLOOR;
    /* the vision (behind everything, in the heights) */
    const vis0 = st.heav.add(`<g>${throneOfLight(c)}</g>`);
    const sera = [0, 1].map(() => st.heav.add(`<g>${seraph(c, 0.9)}</g>`));
    const arm = st.glowL.add(`<g><path d="M-40 0L40 0L90 640L-90 640Z" fill="#fff3cf" opacity=".6"/><path d="M-14 0L14 0L40 640L-40 640Z" fill="#fff8e2" opacity=".8"/><circle cy="640" r="120" fill="url(#halo-glow)"/></g>`);
    /* the people, turned away */
    const blind = `<g class="blind" opacity="0">${blindBand(c)}</g>`;
    const folk = [[740, 6], [805, -8], [870, 8], [935, -4], [1000, 6], [1065, -6], [1130, 4]].map(([x, dy], i) => {
      const o = i % 2 ? crowdPerson(c) : man(c);
      const p = S.puppet(st.act.add(addToHead(person(c, o), blind)));
      return { i, x, y: F + dy, s: 0.94, p, band: p.el.querySelector('.blind'), seed: c.rr(0, 9) };
    });
    const isa = S.puppet(st.act.add(person(c, { ...ISAIAH, holdF: `<g transform="rotate(70)"><path d="${c.cut(c.rect(-8, -30, 16, 60), 0.3, 4)}" fill="${C.parchment}"/></g>` })));
    const isaK = S.puppet(st.act.add(person(c, { ...ISAIAH, pose: 'kneel' })));
    const spot = st.glowL.add(`<g>${glowDisc(200, 'warm-glow', 0.9)}</g>`);
    const fx = st.fx;
    /* the seven signs */
    const badges = Array.from({ length: 7 }, (_, i) => ({ i, a: PI * (1.1 + (i / 6) * 0.8), el: hanging(fx, signBadge(c, i + 1, { r: 26, icon: '' }), { x: 800, y: 200, len: 800 }) }));
    const tagI = hanging(fx, nameTag(c, tr('Izajasz', 'Isaiah'), { size: 17 }), { x: 470, y: 360, len: 700 });
    // the prophet's scroll
    const sc = verseScroll(c, [tr('Panie, któż uwierzył', 'Lord, who has believed'), tr('naszemu głosowi?', 'our report?')], { w: 300, size: 19 });
    const scroll1 = fx.add(`<g><g>${sc.sheet}</g><g>${sc.rodTop}</g><g transform="translate(0 ${sc.h})">${sc.rodBottom}</g></g>`);
    const sc2 = verseScroll(c, [tr('Zaślepił ich oczy', 'He has blinded their eyes'), tr('i twardym uczynił', 'and he hardened'), tr('ich serce…', 'their heart…')], { w: 300, size: 19 });
    const scroll2 = fx.add(`<g><g>${sc2.sheet}</g><g>${sc2.rodTop}</g><g transform="translate(0 ${sc2.h})">${sc2.rodBottom}</g></g>`);
    const vL = S.layer({ par: 0.52, sh: 2 });
    const rings = voiceRings(vL, c, { n: 3, r: 34, w: 5, both: false, color: shade(C.haloRim, 0.1) });
    const one = fx.add(`<g>${soulLight(c, 9)}</g>`);
    const stones = folk.map(() => fx.add(`<g>${stoneHeart(c, 12)}</g>`));
    // what might have been: see, understand, turn, be healed — pale and unlit
    const turnIcon = sheet().p(c.ribbon(c.arc(0, 0, 14, 14, PI * 0.2, PI * 1.7, 12), 4), C.inkSoft).p(c.cut([[10, -16], [20, -4], [4, -4]], 0.2, 3), C.inkSoft).out();
    const icons = [eyeIcon(c, true, 18), heart(c, 14, C.jesusMantle), turnIcon, spark(c, 12)];
    const might = icons.map((ic, i) => fx.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 30, 24), 0.4, 4), C.stone2).p(c.cut(c.circ(0, 0, 26, 24), 0.4, 4), mix(C.parchment, C.indigo, 0.25)).out()}<g opacity=".55">${ic}</g></g>`));

    return (t, time) => {
      const T = time;
      /* v37 — the signs, and backs turned */
      badges.forEach((b) => {
        const k = es(t, 0.05 + b.i * 0.06, 0.4 + b.i * 0.06, ease.out);
        const x = 820 + Math.cos(b.a) * 330, y = 320 + Math.sin(b.a) * 160;
        const glow = 1 + bump(t, 7.1, 7.9) * 0.15;
        swing(b.el, x, y - (1 - k) * 700 - es(t, 6.95, 7.35, ease.in) * 700, k > 0.001 ? T : 0, 1.4, 0.7, b.i);
        pose(b.el.querySelector('.obj') || b.el, { s: glow });
        fade(b.el, k > 0.001 ? 1 - es(t, 1.9, 2.2) * 0.35 + es(t, 7.1, 7.5) * 0.35 : 0);
      });
      const blindK = es(t, 5.1, 5.45);
      folk.forEach((m, i) => {
        const fold = es(t, 0.4 + i * 0.04, 0.7 + i * 0.04);
        const glance = i === 3 ? bump(t, 2.2, 2.9) : 0;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: glance > 0.5 ? true : false, armF: 20 + fold * 30, armB: 10 + fold * 30, head: -2 + blindK * 6 + (i % 2 ? 2 : -2), blink: blinkAt(T, m.seed) });
        fade(m.band, blindK);
        const [hx, hy] = headAt(m.x, m.y, m.s, false);
        const sk = es(t, 5.2 + i * 0.03, 5.45 + i * 0.03, ease.back);
        vis(stones[i], { x: hx - 4, y: hy + 64, s: sk, o: sk > 0.01 ? 1 : 0 });
      });
      /* v38a — Isaiah */
      const isIn = es(t, 1.05, 1.45);
      const kneel = es(t, 7.2, 7.28);
      const ix = lerp(260, 450, isIn);
      isa.set({ x: ix, y: F + 6, s: 1.0, o: (isIn > 0 ? 1 : 0) * (1 - kneel), walk: isIn > 0 && isIn < 1 ? ix * 0.05 : undefined, armF: 60 + bump(t, 2.1, 2.9) * 20 + bump(t, 4.1, 4.9) * 20, armB: 10 + bump(t, 2.1, 2.9) * 110 + bump(t, 3.1, 3.9) * 130, head: -2 - bump(t, 3.1, 3.9) * 14 + bump(t, 4.2, 4.9) * 8, blink: blinkAt(T, 4) });
      isaK.set({ x: 450, y: F + 6, s: 1.0, o: kneel, armF: 80, armB: 120, lean: 10, head: -18, blink: 1 });
      vis(spot, { x: 450, y: F - 90, s: 1, o: isIn * 0.8 });
      const ik = es(t, 1.2, 1.5, ease.out) * (1 - es(t, 1.95, 2.15, ease.in));
      swing(tagI, 450, 400 - (1 - ik) * 700, ik > 0.001 ? T : 0, 1.2, 0.8); fade(tagI, ik > 0.001 ? 1 : 0);
      /* v38b — "who has believed our report?" */
      const s1 = es(t, 1.4, 1.75) * (1 - es(t, 3.95, 4.1));
      vis(scroll1, { x: 640, y: 360, sy: Math.max(0.02, s1), o: s1 > 0.02 ? 1 : 0 });
      const [ihx, ihy] = headAt(ix, F + 6, 1, false);
      rings(ihx + 14, ihy + 4, bump(t, 2.05, 2.95), T, { dir: 1, spread: 3.4 });
      const ok = es(t, 2.5, 2.7) * (1 - es(t, 4.9, 5.1));
      const [ohx, ohy] = headAt(folk[3].x, folk[3].y, folk[3].s, false);
      vis(one, { x: ohx, y: ohy - 40, s: ok * 0.8, o: ok * 0.7 });
      /* v38c — the arm of the Lord */
      const ak = es(t, 3.05, 3.5) * (1 - es(t, 3.95, 4.2));
      vis(arm, { x: 1250, y: -120, r: 36, sy: Math.max(0.02, ak), o: ak > 0.02 ? 0.9 : 0 });
      /* v39–40 — the second passage */
      const s2 = es(t, 4.1, 4.45) * (1 - es(t, 6.95, 7.1));
      vis(scroll2, { x: 640, y: 350, sy: Math.max(0.02, s2), o: s2 > 0.02 ? 1 : 0 });
      might.forEach((el, i) => {
        const k = es(t, 6.1 + i * 0.1, 6.35 + i * 0.1, ease.back) * (1 - es(t, 6.95, 7.1));
        vis(el, { x: 860 + i * 84, y: 425, s: k, o: k > 0.01 ? 0.85 : 0 });
      });
      /* v41 — Isaiah saw His glory */
      const gk = es(t, 7.05, 7.5);
      vis(vis0, { x: 820, y: 250, s: 0.45 + gk * 0.15, o: gk });
      sera.forEach((el, i) => vis(el, { x: 820 + (i ? 170 : -170), y: 170 + (T ? Math.sin(T * 1.4 + i * 2) * 6 : 0), s: 0.7, o: gk }));
      st.sk.blend(['#171a38', '#22284f', '#2f335f'], ['#2b2f63', '#4a4a7e', '#6d628a'], gk);

      S.cam.x = kf(t, [[0, 60], [1, 40], [1.6, -30], [2.4, 0], [3.2, 60], [4.1, -20], [5.2, 60], [6.2, 60], [7.1, 0]]);
      S.cam.y = kf(t, [[0, -60], [1, -20], [2.2, -40], [3.2, -80], [4.1, -40], [5.2, 0], [6.2, -20], [7.1, -130]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.04], [2.2, 1.06], [3.2, 1.0], [5.2, 1.08], [6.2, 1.04], [7.1, 0.98]]);
    };
  },
};
