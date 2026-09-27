// J 6,61–63 — outside the synagogue at evening. Jesus knows that His disciples are grumbling: He turns to them,
// and the grey bubbles hang in the air. "Does this make you stumble?" — a stone lies on the road and one of them
// trips on it. "What if you see the Son of Man going up to where He was before?" — a plate: the Son rising on a
// cloud into light. "The Spirit gives life; the flesh profits nothing": a white dove passes and a bare sprig
// bursts into leaf. "The words I have spoken are spirit and life": the paper slips of His words turn to light.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { rock, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { synagogueFacade, folk, murmur, speech, GLYPH, dove, flapWings, wordSlip, soulLight, hungGold, hungPlate, glowDisc, rayBurst, headAt, kf, tr, PI } from './lib.js';

const JX = 800, FEET = 752;

export default {
  id: 'j6-spirit',
  beats: [
    { v: 61, text: 'Jezus jednak świadom tego, że uczniowie Jego na to szemrali, rzekł do nich:' },
    { v: 61, cont: true, text: '«To was gorszy?' },
    { v: 62 },
    { v: 63, text: 'Duch daje życie; ciało na nic się nie przyda.' },
    { v: 63, cont: true, text: 'Słowa, które Ja wam powiedziałem, są duchem i są życiem.' },
  ],
  cam: { x: [-20, 20], y: [-30, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const back = S.layer({ par: 0.25, sh: 3 });
    back.add(synagogueFacade(S, { signText: tr('Kafarnaum', 'Capernaum') }));
    const eve = S.layer({ par: 0, sh: 1, flat: true });
    eve.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#d98b5f"/>`);

    const L = S.layer({ par: 0.5, sh: 5 });
    const stone = L.add(`<g>${rock(c, 0, 0, 56, 26, C.rock2)}</g>`);
    const DIS = [[390, 0], [470, 1], [560, 2], [1060, 3], [1150, 4], [1240, 5]].map(([x, i]) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, folk(c, i % 3 !== 1)))) }));
    const jGlow = L.add(`<g>${glowDisc(150, 'halo-glow', 1)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    // the bare sprig in a pot by the door
    const pot = L.add(`<g transform="translate(680 ${FEET - 6})">${sheet().p(c.cut([[-22, 0], [22, 0], [16, -30], [-16, -30]], 0.3, 4), C.pot).out()}<path d="${c.ribbon(c.qbez([0, -30], [4, -70], [-6, -110], 8), 3)}" fill="${C.wood2}"/><path d="${c.ribbon([[2, -64], [18, -84]], 2)}" fill="${C.wood2}"/></g>`);
    const leaves = Array.from({ length: 8 }, (_, i) => ({ i, el: L.add(`<g><path d="${c.cut(c.ell(0, 0, 9, 4, 10, c.rr(-1, 1)), 0.2, 3)}" fill="${i % 2 ? C.leaf : C.moss}"/></g>`), x: 680 + c.rr(-14, 18), y: FEET - 6 - c.rr(50, 112) }));
    const bloom = L.add(`<g><path d="${c.cut(c.star(0, 0, 11, 5, 8, 0), 0.2, 3)}" fill="${C.cream}"/><path d="${c.poly(c.circ(0, 0, 4, 8))}" fill="${C.sun}"/></g>`);

    const fx = S.layer({ par: 0.56, sh: 5 });
    const MUR = DIS.map((d) => fx.add(`<g>${murmur(c, { side: d.x > JX ? -1 : 1 })}</g>`));
    const stumble = fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 40, h: 40 })}</g>`);
    // the plate of the ascension: the Son rising on a cloud into the light
    const asc = (() => {
      const s = sheet().p(c.cut(c.circ(0, 0, 84, 40), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 77, 40), 0.5, 5), mix(C.skyBlue, C.cream, 0.3)).out();
      return `${s}<g transform="translate(0 -30)">${rayBurst(c, { n: 14, r0: 10, r1: 70, spread: 0.06, o: 0.8 })}</g><circle cy="-30" r="40" fill="url(#halo-glow)"/><g class="rise"><g transform="translate(-2 36) scale(.38)">${person(c, { ...CAST.jesus })}</g><g transform="translate(0 46) scale(.5)">${cloud(c, 120)}</g></g>`;
    })();
    const ascEl = fx.add(`<g><path d="M0 -1600V-84" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${asc}</g>`);
    const riseEl = ascEl.querySelector('.rise');
    const dv = fx.add(`<g>${dove(c)}</g>`);
    const slips = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${wordSlip(c, 34)}</g>`), l: fx.add(`<g>${soulLight(c, 8)}</g>`), a: -0.9 + i * 0.36 }));
    const words = fx.add(hungGold(c, tr('duch i życie', 'spirit and life'), { size: 30 }));

    return (t, time) => {
      const T = time;
      eve.fade(0.1);
      /* v61a — He knows they are grumbling */
      const know = es(t, 0.3, 0.6);
      DIS.forEach((d, i) => {
        const grumble = es(t, 0.05, 0.3) * (1 - es(t, 1.9, 2.1));
        const trip = d.i === 2 ? bump(t, 1.2, 1.8) : 0;
        const look = es(t, 2.1, 2.4) * (1 - es(t, 2.9, 3.1));
        d.p.set({ x: d.x + (d.i === 2 ? es(t, 1.05, 1.3) * 40 : 0), y: FEET + (i % 2) * 8, s: 0.94, flip: grumble > 0.4 && i % 2 === 0 ? d.x < JX : d.x > JX, walk: d.i === 2 && t > 1.05 && t < 1.3 ? d.x * 0.06 + t * 20 : undefined, armF: 20 + grumble * 30 + trip * 80 + look * 20, armB: 10 + grumble * (i % 3 ? 40 : 0) + trip * 120 + es(t, 3.1, 3.4) * (i % 2 ? 60 : 0), head: grumble * (i % 2 ? 6 : -6) - look * 12 + trip * -10, lean: trip * 16, blink: blinkAt(T, d.seed) });
        const [hx, hy] = headAt(d.x, FEET + (i % 2) * 8, 0.94, d.x > JX);
        const k = es(t, 0.08 + i * 0.05, 0.25 + i * 0.05, ease.back) * (1 - es(t, 1.05, 1.2));
        pose(MUR[i], { x: hx + (d.x > JX ? -8 : 8), y: hy - 18, s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* v61b — does this make you stumble? */
      pose(stone, { x: 612, y: FEET - 2, o: es(t, 1.0, 1.1) * (1 - es(t, 2.9, 3.1)) });
      const sk = es(t, 1.35, 1.5, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(stumble, { x: 610, y: FEET - 190, s: sk, o: sk > 0.01 ? 1 : 0 });
      /* v62 — the Son of Man going up where He was before */
      const ak = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.95, 3.1));
      pose(ascEl, { x: 1000, y: lerp(-500, 260, ak), r: Math.sin(T * 0.8), o: ak > 0.01 ? 1 : 0 });
      pose(riseEl, { y: -es(t, 2.3, 2.9) * 40 });
      /* v63a — the Spirit gives life: a dove passes, the sprig bursts into leaf */
      const fly = es(t, 3.05, 3.7, (u) => u);
      pose(dv, { x: lerp(300, 1300, fly), y: 420 - Math.sin(fly * PI) * 120, s: 1.1, o: fly > 0 && fly < 1 ? 1 : 0 });
      if (fly > 0 && fly < 1) flapWings(dv, T || t * 20, 34, 7);
      leaves.forEach((lf) => {
        const k = es(t, 3.35 + lf.i * 0.04, 3.55 + lf.i * 0.04, ease.back);
        pose(lf.el, { x: lf.x, y: lf.y, s: k, o: k > 0.01 ? 1 : 0 });
      });
      const bk = es(t, 3.7, 3.9, ease.back);
      pose(bloom, { x: 674, y: FEET - 118, s: bk, o: bk > 0.01 ? 1 : 0 });
      /* v63b — My words are spirit and life */
      const [jhx, jhy] = headAt(JX, FEET, 1.08, false);
      slips.forEach((s) => {
        const k = es(t, 4.05 + s.i * 0.06, 4.45 + s.i * 0.06);
        const turn = es(t, 4.4 + s.i * 0.05, 4.6 + s.i * 0.05);
        const x = jhx + 30 + Math.cos(s.a) * k * 260, y = jhy + Math.sin(s.a) * k * 180 - k * 40;
        pose(s.el, { x, y, r: k * 30, o: seg(t, 4.05, 4.1) * (1 - turn) });
        pose(s.l, { x, y, s: 0.5 + turn * 0.6, o: turn * (0.8 + Math.sin(T * 2 + s.i) * 0.2) });
      });
      const wk = es(t, 4.3, 4.6, ease.out);
      pose(words, { x: JX, y: lerp(-500, 200, wk), r: Math.sin(T * 0.8), o: wk > 0.01 ? 1 : 0 });
      pose(jGlow, { x: JX, y: FEET - 130, s: 0.8 + es(t, 4.1, 4.5) * 0.6, o: 0.25 + know * 0.2 + es(t, 4.1, 4.5) * 0.4 });

      jesus.set({ x: JX, y: FEET, s: 1.08, flip: know > 0.5 && t < 1.0 ? true : false, armF: 20 + es(t, 0.9, 1.2) * 50 + bump(t, 2.05, 2.95) * 30 + bump(t, 3.05, 3.9) * 40 + es(t, 4.05, 4.3) * 40, armB: 10 + bump(t, 2.05, 2.95) * 140 + es(t, 4.05, 4.3) * 90, head: -bump(t, 2.05, 2.95) * 12, blink: blinkAt(T, 1) });

      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.08], [2.0, 1.04], [3.0, 1.02], [4.0, 1.06]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 30], [2.0, 0], [3.0, 10], [4.0, 10]]);
    };
  },
};
