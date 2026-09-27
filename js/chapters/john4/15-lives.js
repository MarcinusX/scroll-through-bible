// J 4,50b–54 — the man believes the word (a small light kept at his heart) and goes down the road towards the lake;
// evening comes, and night. In the morning his servants come running up to meet him: "Your child lives!" He asks the
// hour — "Yesterday at the seventh hour the fever left him": a day-arc marked Capernaum comes down, its little sun at
// the seventh hour, and the fever flickers out. Beside it a second arc, Cana, stands at the very same hour — a golden
// thread joins the two suns: that was the hour Jesus said "Your son lives". At the house by the lake the family comes
// out, the boy runs into his father's arms, and a light kindles over every one of them. The second sign: two tags.
import { C, person, blinkAt, lerp, mix } from '../kit.js';
import { moon, stars, house } from '../../assets/nature.js';
import { es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  galileeSet, GAL, OFFICIAL, SON, MOTHER, SERVANTS, dayArc, hourAt, sunToken, feverWaves, soulLight, say, speech, GLYPH, signTag, stoneJar, strip, hanging, swing, vis, kf, headAt,
} from './lib.js';

const FLOOR = 720;
const DUSK = ['#8f7fa8', '#e2a88e', '#f3cfa8'];
const NIGHT = ['#27305e', '#3a3f72', '#5d5a86'];
const A1L = { x: 620, y: 350, r: 80 }, A2L = { x: 1060, y: 350, r: 80 };

export default {
  id: 'j4-lives',
  beats: [
    { v: 50, cont: true, text: 'Uwierzył człowiek słowu, które Jezus powiedział do niego, i szedł z powrotem.' },
    { v: 51 },
    { v: 52, text: 'Zapytał ich o godzinę, o której mu się polepszyło.' },
    { v: 52, cont: true, text: 'Rzekli mu: «Wczoraj około godziny siódmej opuściła go gorączka».' },
    { v: 53, text: 'Poznał więc ojciec, że było to o tej godzinie, o której Jezus rzekł do niego: «Syn twój żyje».' },
    { v: 53, cont: true, text: 'I uwierzył on sam i cała jego rodzina.' },
    { v: 54 },
  ],
  cam: { x: [-60, 160], y: [-60, 80], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const A1 = S.portrait ? { ...A1L, x: 640, y: 250 } : A1L, A2 = S.portrait ? { ...A2L, x: 960, y: 250 } : A2L;
    const W = galileeSet(S, { lakeX: 1000 });
    const nightL = S.layer({ par: 0.02, sh: 0, flat: true });
    nightL.el.parentNode.insertBefore(nightL.el, W.hangL.el);
    nightL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${NIGHT[1]}"/>${stars(c, { x0: -600, x1: 2200, y0: -400, y1: 420, n: 80 })}`);
    const moonEl = hanging(W.hangL, moon(c, 34), { x: 640, y: 170, len: 700 });
    const L = W.actL;
    // the house by the lake in Capernaum
    const H = { x: 1190, w: 170, h: 150 };
    L.add(house(c, H.x, FLOOR - 6, H.w, H.h, { wall: mix(C.plaster, C.blushVeil, 0.2), shadow: C.plaster2, door: C.wood2, lit: true, stairs: false }));
    const doorDark = L.add(`<path d="${c.poly([[H.x + H.w * 0.2, FLOOR - 4], [H.x + H.w * 0.2, FLOOR - 6 - H.h * 0.42], [H.x + H.w * 0.38, FLOOR - 6 - H.h * 0.42], [H.x + H.w * 0.38, FLOOR - 4]])}" fill="${C.soilDark}" opacity="0"/>`);
    const dad = S.puppet(L.add(person(c, OFFICIAL)));
    const serv = SERVANTS.map((o, i) => ({ i, p: S.puppet(L.add(person(c, o))) }));
    const mom = S.puppet(L.add(person(c, MOTHER)));
    const boy = S.puppet(L.add(person(c, SON)));
    const extra = [0, 1].map((i) => ({ i, p: S.puppet(L.add(person(c, { ...SERVANTS[i], robe: [C.linen2, C.tealRobe][i], hairStyle: ['veil', 'short'][i], veil: C.skyVeil, beard: 'none' }))) }));
    const tintL = S.layer({ par: 0, sh: 0, flat: true });
    tintL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${NIGHT[0]}"/>`);

    const fx = S.layer({ par: 0.55, sh: 5 });
    const word = fx.add(`<g>${soulLight(c, 9)}</g>`);
    const news = fx.add(`<g>${say(c, tr('Syn twój żyje!', 'Your child lives!'), { size: 22, side: -1 })}</g>`);
    const hourQ = fx.add(`<g>${speech(c, `<g transform="translate(-14 6)">${sunToken(c, 9)}</g><g transform="translate(16 0)">${GLYPH.q(c)}</g>`, { w: 74, h: 50 })}</g>`);
    const yest = fx.add(`<g>${say(c, tr('Wczoraj, o siódmej godzinie', 'Yesterday, at the seventh hour'), { size: 19, side: -1 })}</g>`);
    const arcK = fx.add(`<g>${dayArc(c, A2.r, { label: tr('Kafarnaum', 'Capernaum'), marks: [7] })}</g>`);
    const arcC = fx.add(`<g>${dayArc(c, A1.r, { label: tr('Kana', 'Cana'), marks: [7] })}</g>`);
    const tokK = fx.add(`<g>${sunToken(c, 11)}</g>`);
    const tokC = fx.add(`<g>${sunToken(c, 11)}</g>`);
    const fever = fx.add(`<g>${feverWaves(c, 44)}</g>`);
    const thread = fx.add(`<g><path d="" class="th" pathLength="1" stroke="${C.halo}" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 1" stroke-dashoffset="1" fill="none"/></g>`);
    const thP = thread.querySelector('.th');
    const lights = [0, 1, 2, 3, 4, 5, 6].map(() => fx.add(`<g>${soulLight(c, 8)}</g>`));
    const tag1 = hanging(fx, `<g transform="scale(1.25)">${signTag(c, '1', `<g transform="translate(0 56) scale(.34)">${stoneJar(c, 96, C.stone)}</g>`)}</g>`, { x: 680, y: 170, len: 600 });
    const tag2 = hanging(fx, `<g transform="scale(1.8)">${signTag(c, '2', `<g transform="translate(0 60) scale(.24)">${person(c, SON)}</g>`)}</g>`, { x: 900, y: 140, len: 600 });
    const sTxt = fx.add(`<g>${strip(c, tr('drugi znak', 'the second sign'), { size: 22 })}</g>`);

    return (t, time) => {
      const T = time;
      /* sky: afternoon → evening → night (v50b) → morning (v51) */
      const dusk = es(t, 0.2, 0.7) * (1 - es(t, 1.0, 1.3));
      const dusk0 = dusk;
      const night = es(t, 0.65, 0.95) * (1 - es(t, 1.0, 1.35));
      W.sk.blend(GAL, DUSK, dusk);
      nightL.fade(night * 0.85);
      nightL.shift(0, night > 0.001 ? 0 : 6000);
      tintL.shift(0, night > 0.001 || dusk0 > 0.001 ? 0 : 6000);
      tintL.fade(night * 0.4 + dusk * 0.08);
      W.update(t, T, { sunX: lerp(1180, 1500, Math.max(dusk, night)), sunY: 170 + Math.max(dusk * 0.6, night) * 520 });
      swing(moonEl, 640, 170 + (1 - night) * 600, night > 0.001 ? T : 0, 1, 0.6, 1);
      fade(moonEl, night > 0.001 ? 1 : 0);
      /* v50b — he believes and goes his way */
      const go = es(t, 0.0, 1.0, ease.sine);
      const dx = lerp(420, 820, go);
      const meet = es(t, 1.4, 1.6);
      const heart = es(t, 4.1, 4.3) * (1 - es(t, 5.05, 5.2));
      const hug = es(t, 5.4, 5.6);
      dad.set({ x: dx, y: FLOOR, s: 1.02, flip: false, walk: go > 0 && go < 1 ? dx * 0.05 : undefined, armF: 30 + meet * 40 * (1 - es(t, 1.9, 2.0)) + bump(t, 2.05, 2.8) * 40 + heart * 30 + hug * 50, armB: 10 + meet * 60 * (1 - es(t, 1.9, 2.0)) + heart * 10 + hug * 60, head: -meet * 4 + heart * 8 + hug * 10, blink: blinkAt(T, 4) });
      const [dhx, dhy] = headAt(dx, FLOOR, 1.02, false);
      vis(word, { x: dx + 14, y: FLOOR - 118 + Math.sin(T * 2) * 2, s: 0.8 + heart * 0.5, o: es(t, 0.05, 0.25) * (1 - es(t, 5.3, 5.5)) });
      /* v51 — the servants meet him */
      const run = es(t, 1.05, 1.5, ease.out);
      serv.forEach((s) => {
        const x = lerp(1500 + s.i * 60, 940 + s.i * 70, run);
        s.p.set({ x, y: FLOOR + 4 + s.i * 6, s: 0.98, flip: true, walk: run > 0 && run < 1 ? x * 0.07 : undefined, armB: 20 + bump(t, 1.2, 1.95) * 120, armF: 20 + bump(t, 1.3, 1.95) * 60 + bump(t, 3.1, 3.9) * 40, head: -bump(t, 1.2, 1.9) * 6, blink: blinkAt(T, s.i + 2) });
      });
      const [shx, shy] = headAt(940, FLOOR + 4, 0.98, true);
      const nk = es(t, 1.4, 1.6, ease.back) * (1 - es(t, 1.95, 2.05));
      vis(news, { x: shx - 10, y: shy - 22, s: nk, o: nk > 0.01 ? 1 : 0 });
      /* v52a — at what hour? */
      const qk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.0));
      vis(hourQ, { x: dhx + 14, y: dhy - 22, s: qk, o: qk > 0.01 ? 1 : 0 });
      /* v52b — yesterday at the seventh hour the fever left him */
      const yk = es(t, 3.05, 3.25, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(yest, { x: shx - 10, y: shy - 22, s: yk, o: yk > 0.01 ? 1 : 0 });
      const kk = es(t, 3.1, 3.45, ease.out) * (1 - es(t, 5.9, 6.2, ease.in));
      const ky = A2.y - (1 - kk) * 700;
      vis(arcK, { x: A2.x, y: ky, o: kk > 0.01 ? 1 : 0 });
      const [kx, kyy] = hourAt(A2.r, lerp(5.2, 7, es(t, 3.3, 3.6)));
      vis(tokK, { x: A2.x + kx, y: ky + kyy, s: 1 + bump(t, 4.3, 4.8) * 0.5, o: kk > 0.01 ? 1 : 0 });
      vis(fever, { x: A2.x + 110, y: ky - 20 - ((T * 12) % 6), s: 0.7 * (1 - es(t, 3.6, 3.9)), o: kk > 0.01 ? 1 - es(t, 3.6, 3.9) : 0 });
      /* v53a — the same hour in Cana: a golden thread joins them */
      const ck = es(t, 4.05, 4.35, ease.out) * (1 - es(t, 5.9, 6.2, ease.in));
      const cy = A1.y - (1 - ck) * 700;
      vis(arcC, { x: A1.x, y: cy, o: ck > 0.01 ? 1 : 0 });
      const [cx, cyy] = hourAt(A1.r, 7);
      vis(tokC, { x: A1.x + cx, y: cy + cyy, s: 1 + bump(t, 4.3, 4.8) * 0.5, o: ck > 0.01 ? 1 : 0 });
      const th = es(t, 4.35, 4.7) * (1 - es(t, 5.9, 6.1));
      attr(thP, 'd', `M${A1.x + cx} ${cy + cyy}Q${(A1.x + A2.x) / 2} ${Math.min(cy, ky) - 110} ${A2.x + kx} ${ky + kyy}`);
      attr(thP, 'stroke-dashoffset', 1 - th);
      fade(thread, th > 0 ? 1 : 0);
      /* v53b — the whole household believes */
      const out = es(t, 5.05, 5.4, ease.out);
      fade(doorDark, es(t, 5.0, 5.1));
      const bx = lerp(H.x + 50, dx + 60, es(t, 5.1, 5.5, ease.out));
      boy.set({ x: bx, y: FLOOR + 2, s: 0.55, flip: true, o: es(t, 5.02, 5.1), walk: t > 5.1 && t < 5.5 ? bx * 0.1 : undefined, armF: 40 + hug * 80, armB: 30 + hug * 90, blink: blinkAt(T, 6) });
      const mx = lerp(H.x + 50, 1100, out);
      mom.set({ x: mx, y: FLOOR - 4, s: 0.98, flip: true, o: es(t, 5.1, 5.2), walk: out > 0 && out < 1 ? mx * 0.05 : undefined, armF: 20 + hug * 50, armB: 20 + es(t, 5.6, 5.8) * 100, blink: blinkAt(T, 5) });
      extra.forEach((e) => { const x = lerp(H.x + 50, 1160 + e.i * 56, es(t, 5.15 + e.i * 0.1, 5.5 + e.i * 0.1)); e.p.set({ x, y: FLOOR - 8 + e.i * 4, s: 0.94, flip: true, o: es(t, 5.15 + e.i * 0.1, 5.25 + e.i * 0.1), blink: blinkAt(T, e.i + 8) }); });
      const who = [[dx, 1.02, false], [bx, 0.55, true], [mx, 0.98, true], [940, 0.98, true], [1010, 0.98, true], [1160, 0.94, true], [1216, 0.94, true]];
      lights.forEach((l, i) => {
        const [x, s, f] = who[i];
        const [hx, hy] = headAt(x, FLOOR, s, f);
        const k = es(t, 5.55 + i * 0.05, 5.75 + i * 0.05, ease.back);
        vis(l, { x: hx, y: hy - 30 - s * 14 + Math.sin(T * 2 + i) * 2, s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* v54 — the second sign */
      const g1 = es(t, 6.05, 6.35, ease.out), g2 = es(t, 6.2, 6.5, ease.out);
      swing(tag1, 680, 190 - (1 - g1) * 600, g1 > 0.001 ? T : 0, 1.4, 0.8, 1);
      fade(tag1, g1 > 0.001 ? 1 : 0);
      swing(tag2, 900, 140 - (1 - g2) * 600, g2 > 0.001 ? T : 0, 1.4, 0.8, 2);
      fade(tag2, g2 > 0.001 ? 1 : 0);
      vis(sTxt, { x: 900, y: 330, s: es(t, 6.4, 6.6, ease.back), o: es(t, 6.4, 6.5) });

      S.cam.x = kf(t, [[-0.5, -40], [1.0, 40], [2.0, 60], [3.0, 60], [4.0, 20], [5.0, 60], [6.0, 60], [6.5, 20]]);
      S.cam.y = kf(t, [[-0.5, 40], [1.0, 40], [2.0, 40], [3.0, -10], [4.0, -30], [5.0, 30], [6.0, -30]]);
      S.cam.z = kf(t, [[-0.5, 1.1], [1.0, 1.1], [2.0, 1.16], [3.0, 1.04], [4.0, 1.02], [5.0, 1.12], [6.0, 1.02]]);
    };
  },
};
