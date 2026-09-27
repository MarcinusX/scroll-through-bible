// J 3,29–30 — A wedding at dusk: a canopy, garlands and paper lanterns come down from the flies. The bride
// (veiled) comes to the bridegroom — Jesus. John stands at the side as the bridegroom's friend, hand to his ear:
// the Bridegroom's voice reaches him and he glows with joy; his golden cup fills and brims over.
// "He must increase": the sun rises behind Jesus and His light grows. "I must decrease": John steps back,
// smaller and smaller into the distance, bowing, his little lamp fading gently like the morning star.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix, sky } from '../kit.js';
import { band, hillsWith, sun, grass, olive, flowers } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { handLamp } from '../mark13/lib.js';
import { JOHN_B, canopy, garland, lantern, voiceRings, joyCup, sparkle, spark, glory, headAt, hand, word, tambourine, tr, PI, vpose } from './lib.js';

const GY = 700, JX = 820, BX = 925;

export default {
  id: 'j3-bridegroom',
  beats: [
    { v: 29, text: 'Ten, kto ma oblubienicę, jest oblubieńcem;' },
    { v: 29, cont: true, text: 'a przyjaciel oblubieńca, który stoi i słucha go, doznaje najwyższej radości na głos oblubieńca.' },
    { v: 29, cont: true, text: 'Ta zaś moja radość doszła do szczytu.' },
    { v: 30, text: 'Potrzeba, by On wzrastał,' },
    { v: 30, cont: true, text: 'a ja się umniejszał.' },
  ],
  cam: { x: [-60, 40], y: [-40, 60], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    const DUSK = ['#4a4f86', '#a98aa6', '#e5b39a'];
    const DAWN = ['#f1cda9', '#f6dfc0', '#fbeed6'];
    const sk = sky(S, DUSK);
    // the sun that rises behind Him
    const SL = S.layer({ par: 0.06, sh: 3 });
    const glo = SL.add(`<g>${glory(c, 520, 30)}</g>`);
    const sunEl = SL.add(`<g>${sun(c, 70)}</g>`);
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 500, amps: [20, 8, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.3) }).markup);
    const Hl = S.layer({ par: 0.25, sh: 3 });
    const hh = hillsWith(c, { y: 560, amps: [16, 7, 3], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 22 });
    Hl.add(hh.markup);
    const tint = S.layer({ par: 0.3, sh: 0, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#3a3060" opacity=".22"/>`);

    /* ---------- the courtyard ---------- */
    const G = S.layer({ par: 0.5, sh: 3 });
    G.add(sheet().p(c.ridge(c.wave(GY - 40, [4, 2], [500, 150]), -900, 2500, 1700, 12, 1), mix(C.sand, C.sage3, 0.3)).out());
    G.add(grass(c, { x0: -900, x1: 2500, y: GY - 40, n: 40, h: 12, color: C.moss }) + olive(c, 230, GY - 36, 1) + olive(c, 1420, GY - 36, 0.9) + flowers(c, { x0: 350, x1: 1300, y: GY - 36, n: 30 }));
    // guests at the back
    const Gu = S.layer({ par: 0.45, sh: 4 });
    const guests = [[400, false], [705, false], [1040, true], [1110, true], [1180, true]].map(([x, flip], i) => {
      const o = crowdPerson(c);
      return { p: S.puppet(Gu.add(person(c, { ...o, holdF: i === 1 || i === 3 ? tambourine(c) : '' }))), x, flip, i, seed: c.rr(0, 9) };
    });
    // the canopy on four poles
    const Cn = S.layer({ par: 0.5, sh: 4 });
    const poles = sheet().p(c.cut(c.rect(636, 330, 8, GY - 330), 0.3, 8) + c.cut(c.rect(1006, 330, 8, GY - 330), 0.3, 8), C.wood2).out();
    const canEl = Cn.add(`<g>${poles}<g transform="translate(825 320)">${canopy(c, 420, 46)}</g></g>`);
    const gar = [hanging(Cn, garland(c, 300, 40), { x: 330, y: 250, len: 700 }), hanging(Cn, garland(c, 300, 40), { x: 1030, y: 250, len: 700 })];
    const lans = [460, 560, 1080, 1190].map((x, i) => ({ el: hanging(Cn, lantern(c, { col: [C.apricot, C.sun, C.roseRobe, C.apricot][i] }), { x, y: 250 + (i % 2) * 40, len: 700 }), x, i }));
    lans.forEach((l) => { l.glow = l.el.querySelector('.glow'); });

    /* ---------- the couple and the friend ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const Jg = S.layer({ par: 0.5, sh: 0, flat: true });
    const jGlow = Jg.add(`<g><circle r="220" fill="url(#halo-glow)"/></g>`);
    const P2 = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(P2.add(person(c, { ...CAST.jesus })));
    const bride = S.puppet(P2.add(person(c, { robe: C.linen, mantle: C.roseRobe, hairStyle: 'veil', veil: '#fbf6ea', veil2: C.sun, skin: C.skin, hair: C.hair2, belt: C.sun })));
    const jEl = P2.add(person(c, { ...JOHN_B, holdF: `<g class="cupH" transform="translate(0 6)">${joyCup(c, 40, 34)}</g>`, holdB: `<g class="lampH" transform="translate(-4 4) scale(.8)">${handLamp(c, { glowR: 70 })}</g>` }));
    const john = S.puppet(jEl);
    const cupFill = jEl.querySelector('.fill'), cupSpill = jEl.querySelector('.spill'), cupGlow = jEl.querySelector('.cupH .glow');
    const lampFl = jEl.querySelector('.lampH .flame'), lampGl = jEl.querySelector('.lampH .glow');
    const voice = voiceRings(P2, c, { n: 3, color: C.halo, r: 30, w: 5, both: false });

    const X = S.layer({ par: 0.5, sh: 5 });
    const tBG = X.add(`<g>${word(c, tr('oblubieniec', 'the bridegroom'), { size: 17 })}</g>`);
    const tBR = X.add(`<g>${word(c, tr('oblubienica', 'the bride'), { size: 17 })}</g>`);
    const tFR = X.add(`<g>${word(c, tr('przyjaciel', 'the friend'), { size: 17 })}</g>`);
    const joySp = Array.from({ length: 7 }, (_, i) => ({ i, el: X.add(`<g>${spark(c, 9)}</g>`) }));
    const confetti = Array.from({ length: 18 }, (_, i) => ({ i, x: c.rr(420, 1200), sp: c.rr(0.7, 1.2), col: [C.sun, C.roseRobe, C.cream, C.lavender, C.apricot][i % 5], el: null }));
    confetti.forEach((f) => { f.el = X.add(`<g><path d="${c.cut(c.star(0, 0, 7, 3, 5, c.rr(0, 6)), 0.2, 2)}" fill="${f.col}"/></g>`); });
    const incT = X.add(`<g>${word(c, tr('On wzrasta', 'He increases'), { size: 19 })}</g>`);
    const decT = X.add(`<g>${word(c, tr('ja się umniejszam', 'I decrease'), { size: 14 })}</g>`);

    return (t, time) => {
      const T = time;
      const rise = es(t, 3.05, 3.9);
      sk.blend(DUSK, DAWN, rise);
      tint.fade(1 - rise);
      vpose(sunEl, { x: JX, y: lerp(640, 250, rise), s: 1 + rise * 0.2 });
      vpose(glo, { x: JX, y: lerp(640, 250, rise), s: 0.5 + rise * 0.6, r: rise * 15, o: rise * 0.8 });

      /* the set comes down */
      const down = es(t, -0.4, 0.3, ease.out);
      vpose(canEl, { x: 0, y: -(1 - down) * 500 });
      gar.forEach((g, i) => vpose(g, { x: i ? 1030 : 330, y: 250 - (1 - down) * 500 }));
      lans.forEach((l) => {
        vpose(l.el, { x: l.x, y: 250 + (l.i % 2) * 40 - (1 - down) * 500, r: (1 - down) * (l.i % 2 ? 6 : -6) });
        fade(l.glow, (1 - rise * 0.8) * 0.85);
      });

      /* v29a — the bride comes to the bridegroom */
      const bw = es(t, 0.05, 0.55);
      const bx = lerp(1300, BX, bw);
      bride.set({ x: bx, y: GY, s: 0.98, flip: true, walk: bw > 0 && bw < 1 ? bx * 0.05 : undefined, armF: 20 + es(t, 0.5, 0.7) * 40, head: -4, blink: blinkAt(T, 3) });
      const grow = es(t, 3.1, 3.8);
      const speak = bump(t, 1.05, 1.95);
      jesus.set({ x: JX, y: GY, s: 1.05 + grow * 0.1, armF: 20 + es(t, 0.5, 0.7) * 40 * (1 - grow) + grow * 50, armB: 10 + speak * 60 + grow * 100, head: -2, blink: blinkAt(T, 1) });
      vpose(jGlow, { x: JX, y: GY - 120, s: 0.5 + grow * 1.1 + speak * 0.2, o: 0.3 + speak * 0.4 + grow * 0.7 });
      vpose(tBG, { x: JX, y: GY - 290 - grow * 20, s: es(t, 0.3, 0.5, ease.back), o: seg(t, 0.3, 0.35) * (1 - es(t, 1.0, 1.15)) });
      vpose(tBR, { x: BX + 50, y: GY - 240, s: es(t, 0.5, 0.7, ease.back), o: seg(t, 0.5, 0.55) * (1 - es(t, 1.0, 1.15)) });

      guests.forEach((g) => g.p.set({ x: g.x, y: GY - 34, s: 0.78, flip: g.flip, armF: 30 + bump(t, 2.1, 2.9) * 70 + Math.sin(T * 6 + g.i) * 10 * bump(t, 2.1, 2.9), armB: 10 + bump(t, 2.1, 2.9) * 100 * (g.i % 2), blink: blinkAt(T, g.seed) }));

      /* v29b — the friend who stands and hears Him rejoices */
      const listen = es(t, 1.1, 1.3) * (1 - es(t, 1.95, 2.1));
      const joy = es(t, 1.4, 1.7);
      const lift = es(t, 2.05, 2.3) * (1 - es(t, 2.95, 3.1));
      const back = es(t, 4.05, 4.8, ease.sine);
      const jx = lerp(560, 470, back), jy = lerp(GY + 6, GY - 36, back), js = lerp(1.0, 0.7, back);
      const bounce = Math.abs(Math.sin(T * 5)) * 5 * joy * (1 - es(t, 2.9, 3.1));
      john.set({ x: jx, y: jy - bounce, s: js, walk: back > 0 && back < 1 ? jx * 0.08 : undefined, flip: false, armF: 20 + lift * 110 + joy * 10, armB: 20 + listen * 150 + back * 30, head: -listen * 10 - joy * 6 + es(t, 4.6, 4.9) * 14, lean: es(t, 4.6, 4.9) * 10, blink: blinkAt(T, 5) });
      const [hx, hy] = headAt(JX, GY, 1.05 + grow * 0.1, false);
      voice(hx - 30, hy + 6, speak, T, { spread: 3.2, dir: -1, speed: 0.6 });
      vpose(tFR, { x: 560, y: GY - 270, s: es(t, 1.2, 1.4, ease.back), o: seg(t, 1.2, 1.25) * (1 - es(t, 1.9, 2.05)) });
      const [jhx, jhy] = headAt(jx, jy, js, false);
      joySp.forEach((sp) => {
        const a = (sp.i / 7) * PI * 2 + T * 0.8;
        vpose(sp.el, { x: jhx + Math.cos(a) * 60 * js, y: jhy + Math.sin(a) * 50 * js, s: joy * (0.7 + Math.sin(T * 5 + sp.i) * 0.3) * (1 - back * 0.6), o: joy > 0.01 ? 1 - es(t, 4.2, 4.6) * 0.7 : 0 });
      });

      /* v29c — joy made full: the cup fills and brims over; confetti */
      const fill = es(t, 2.15, 2.55);
      vpose(cupFill, { x: 0, y: -34 * 0.25, sy: 0.05 + fill * 0.95 });
      fade(cupSpill, es(t, 2.5, 2.65));
      fade(cupGlow, es(t, 2.4, 2.6));
      confetti.forEach((f) => {
        const k = seg(t, 2.3 + (f.i % 6) * 0.05, 3.3 + (f.i % 6) * 0.05);
        vpose(f.el, { x: f.x + Math.sin(k * 8 + f.i) * 20, y: lerp(150, 680, k * f.sp), r: k * 400, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* v30 — He must increase, I must decrease */
      vpose(incT, { x: JX, y: 250, s: es(t, 3.35, 3.6, ease.back), o: seg(t, 3.35, 3.4) });
      vpose(decT, { x: jx - 20, y: jy - 250 * js, s: es(t, 4.4, 4.6, ease.back) * 0.9, o: seg(t, 4.4, 4.45) });
      const dim = 1 - es(t, 4.3, 4.9) * 0.75;
      vpose(lampFl, { x: 27, y: -12, s: dim });
      fade(lampGl, dim * 0.9);

      S.cam.x = -es(t, 1.0, 1.4) * 50 * (1 - es(t, 2.9, 3.2)) - es(t, 4.0, 4.6) * 30;
      S.cam.y = 10 - es(t, 3.0, 3.8) * 30;
      S.cam.z = 1.08;
    };
  },
};
