// J 12,47–50 — the last words of His public teaching, on the night stage. "If anyone hears My words and does not keep
// them, I do not judge him": His words fly to a listener as paper slips and slide from his hands; a balance comes down
// beside Jesus and He sends it back up. "I came not to judge the world but to save it": the globe comes down into His
// hands and warms with light. "Who rejects Me has a judge": a man pushes the slips away — "the word I have spoken will
// judge him on the last day": the fallen slips gather into a glowing scroll above him. "I did not speak on My own":
// rings come down from the radiance. "The Father gave Me a command": a golden page comes down into His hands; "His
// command is eternal life": it opens into a scroll of light ringed by eternity. "What I say, I say as the Father told
// Me" — the stage darkens to a single lamp in His hand and the scroll of light above: the end of His public ministry.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { darkStage, man, crowdPerson, people, place, wordSlip, globe, radiance, voiceRings, headAt, hand, nameTag, hanging, swing, kf, vis, glowDisc, eternityRing, drawRing, handLamp, verseScroll, tr, PI, FONT } from './lib.js';

export default {
  id: 'j12-word',
  beats: [
    { v: 47, text: 'A jeżeli ktoś posłyszy słowa moje, ale ich nie zachowa, to Ja go nie sądzę.' },
    { v: 47, cont: true, text: 'Nie przyszedłem bowiem po to, aby świat sądzić, ale aby świat zbawić.' },
    { v: 48, text: 'Kto gardzi Mną i nie przyjmuje słów moich, ten ma swego sędziego:' },
    { v: 48, cont: true, text: 'słowo, które powiedziałem, ono to będzie go sądzić w dniu ostatecznym.' },
    { v: 49, text: 'Nie mówiłem bowiem sam od siebie,' },
    { v: 49, cont: true, text: 'ale Ten, który Mnie posłał, Ojciec, On Mi nakazał, co mam powiedzieć i oznajmić.' },
    { v: 50, text: 'A wiem, że przykazanie Jego jest życiem wiecznym.' },
    { v: 50, cont: true, text: 'To, co mówię, mówię tak, jak Mi Ojciec powiedział».' },
  ],
  cam: { x: [-60, 80], y: [-120, 40], z: [0.98, 1.2] },
  build(S) {
    const c = S.c;
    const st = darkStage(S, { skyCols: ['#1d2147', '#2a2f5c', '#3c3d6c'] });
    const F = st.FLOOR;
    const fin = S.layer({ par: 0.43, sh: 0, flat: true });
    fin.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#0f1230" opacity=".7"/>`);
    st.glowL.el.before(fin.el);
    const rad = st.heav.add(`<g><circle r="220" fill="url(#halo-glow)"/>${radiance(c, 60)}</g>`);
    const pool = st.glowL.add(`<g>${glowDisc(240, 'halo-glow', 1)}</g>`);
    const hearer = people(S, st.act, [{ x: 1060, y: F + 6, s: 0.98, flip: true, look: man(c, { robe: C.tealRobe }) }], 'h')[0];
    const scorner = people(S, st.act, [{ x: 540, y: F + 4, s: 0.98, look: man(c, { robe: C.clayMantle, mantle: C.plumRobe, beard: 'full' }), face: true }], 's')[0];
    const jesus = S.puppet(st.act.add(person(c, CAST.jesus)));
    const fx = st.fx;
    const slipsA = Array.from({ length: 4 }, () => fx.add(wordSlip(c, 30)));
    const slipsB = Array.from({ length: 5 }, () => fx.add(wordSlip(c, 30)));
    // a balance, sent back up
    const bal = sheet();
    bal.p(c.ribbon([[0, -70], [0, -20]], 3), C.ochre).p(c.ribbon([[-60, -66], [60, -66]], 4), C.ochre);
    bal.x(c.ribbon([[-60, -66], [-74, -34]], 1) + c.ribbon([[-60, -66], [-46, -34]], 1) + c.ribbon([[60, -66], [46, -34]], 1) + c.ribbon([[60, -66], [74, -34]], 1), shade(C.ochre, -0.3));
    bal.p(c.cut([[-78, -34], [-42, -34], [-50, -26], [-70, -26]], 0.3, 4) + c.cut([[42, -34], [78, -34], [70, -26], [50, -26]], 0.3, 4), C.sun);
    const balance = hanging(fx, `<g transform="translate(0 70)">${bal.out()}</g><g transform="translate(0 60)">${nameTag(c, tr('sąd', 'judgment'), { size: 14 })}</g>`, { x: 960, y: 260, len: 800 });
    const world = fx.add(`<g><circle r="120" fill="url(#halo-glow)"/>${globe(c, 50)}</g>`);
    const js_ = verseScroll(c, [tr('słowo', 'the word')], { w: 150, size: 18, ink: C.terracotta });
    const judge = fx.add(`<g>${glowDisc(110, 'halo-glow', 0.9)}<g transform="translate(0 -30)">${js_.sheet}${js_.rodTop}<g transform="translate(0 ${js_.h})">${js_.rodBottom}</g></g><g transform="translate(0 ${js_.h - 20})">${nameTag(c, tr('w dniu ostatecznym', 'in the last day'), { size: 13 })}</g></g>`);
    const vL = S.layer({ par: 0.52, sh: 2 });
    const downs = [0, 1, 2].map(() => vL.add(`<g><ellipse rx="70" ry="20" fill="none" stroke="${C.halo}" stroke-width="5"/></g>`));
    const page = fx.add(`<g><circle r="60" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.rect(-30, -38, 60, 76), 0.4, 5), C.halo).x((() => { let d = ''; for (let i = 0; i < 6; i++) d += c.ribbon([[-20, -26 + i * 10], [20 - (i % 2) * 8, -26 + i * 10]], 1.6); return d; })(), C.haloRim).out()}</g>`);
    const sc = verseScroll(c, [tr('życie wieczne', 'eternal life')], { w: 260, size: 22, ink: C.terracotta });
    const scrollL = fx.add(`<g>${glowDisc(220, 'halo-glow', 1)}<g transform="translate(0 -40)">${sc.sheet}</g><g transform="translate(0 -40)">${sc.rodTop}</g><g transform="translate(0 ${sc.h - 40})">${sc.rodBottom}</g></g>`);
    const ring = fx.add(`<g>${eternityRing(c, 170, 6, 30, C.haloRim)}</g>`);
    const lamp = fx.add(`<g>${handLamp(c, { glowR: 160 })}</g>`);

    return (t, time) => {
      const T = time;
      /* v47a — heard but not kept; I do not judge him */
      const speak = bump(t, 0.1, 0.9) + bump(t, 2.1, 2.9) * 0.6;
      slipsA.forEach((el, i) => {
        const k = seg(t, 0.15 + i * 0.08, 0.55 + i * 0.08);
        const x = lerp(840, 1030, Math.min(1, k / 0.6)), y = k < 0.6 ? 500 - Math.sin((k / 0.6) * PI) * 50 : lerp(500, F + 4, (k - 0.6) / 0.4);
        vis(el, { x: x + i * 6, y, r: k * 180 + i * 30, o: k > 0 ? 1 - es(t, 1.9, 2.1) : 0 });
      });
      place(hearer, T, { armF: 50 - es(t, 0.5, 0.8) * 30, head: 4 + es(t, 0.6, 0.9) * 8, armB: 10, o: 1 - es(t, 7.1, 7.6) * 0.6 });
      const bk = es(t, 0.45, 0.75, ease.out) * (1 - es(t, 0.8, 1.05, ease.in));
      swing(balance, 960, 250 - (1 - bk) * 700 + 0, bk > 0.001 ? T : 0, 1, 0.7);
      fade(balance, bk > 0.001 ? 1 : 0);
      /* v47b — to save the world */
      const wk = es(t, 1.1, 1.45);
      const [hx, hy] = hand(800, F + 10, 1.08, false, 60);
      vis(world, { x: lerp(820, hx + 20, wk), y: lerp(180, hy - 40, wk), s: 0.8 + wk * 0.2, o: wk > 0.01 ? 1 - es(t, 1.95, 2.15) : 0 });
      /* v48 — the one who rejects; the word will judge */
      const push = bump(t, 2.3, 2.95);
      place(scorner, T, { o: 1 - es(t, 7.1, 7.6) * 0.6, armF: 20 + push * 80, armB: push * 40, head: -push * 10 + es(t, 3.2, 3.5) * 10, flip: push > 0.3 && t > 2.6 });
      fade(scorner.angry, es(t, 2.1, 2.3) * (1 - es(t, 3.9, 4.1)));
      slipsB.forEach((el, i) => {
        const k = seg(t, 2.1 + i * 0.07, 2.5 + i * 0.07);
        const back = es(t, 2.55 + i * 0.03, 2.8 + i * 0.03);
        const gather = es(t, 3.15, 3.5);
        const x0 = lerp(760, 600, k), y0 = 500 - Math.sin(k * PI) * 40;
        const x1 = lerp(x0, 500 - i * 30, back), y1 = lerp(y0, F + 4, back);
        vis(el, { x: lerp(x1, 540, gather), y: lerp(y1, 330, gather), s: 1 - gather * 0.6, r: k * 180 + i * 40 + back * 90, o: k > 0 ? 1 - es(t, 3.45, 3.55) : 0 });
      });
      const jk = es(t, 3.45, 3.7) * (1 - es(t, 3.95, 4.15));
      vis(judge, { x: 540, y: 330, s: 0.8 + jk * 0.2, o: jk });
      /* v49 — not from Myself: from the One who sent Me */
      const rk = es(t, 4.05, 4.4) * (1 - es(t, 7.2, 7.6) * 0.4);
      vis(rad, { x: 800, y: lerp(60, 120, rk), s: 1 + (T ? Math.sin(T * 1.2) * 0.02 : 0), o: rk });
      const [jhx, jhy] = headAt(800, F + 10, 1.08, false);
      const on = bump(t, 4.15, 4.95);
      downs.forEach((el, i) => { const k = T ? (T * 0.4 + i / 3) % 1 : (i + 0.5) / 3; vis(el, { x: 800, y: lerp(170, jhy - 50, k), s: 1.4 - k * 0.8, o: on * Math.sin(k * PI) }); });
      const pg = es(t, 5.1, 5.6);
      const [px, py] = hand(800, F + 10, 1.08, false, 70);
      vis(page, { x: lerp(800, px + 10, pg), y: lerp(160, py - 30, pg), s: 0.7 + pg * 0.3, r: (1 - pg) * 20, o: pg > 0 ? 1 - es(t, 6.0, 6.2) : 0 });
      /* v50a — His command is eternal life */
      const sk = es(t, 6.05, 6.4);
      vis(scrollL, { x: 800, y: 300, sy: Math.max(0.02, sk), o: sk > 0.02 ? 1 : 0 });
      vis(ring, { x: 800, y: 300, o: sk > 0.02 ? 1 : 0, r: T ? T * 3 : 0 });
      drawRing(ring, es(t, 6.3, 6.85));
      /* v50b — a lamp in the dark */
      const dark = es(t, 7.1, 7.6);
      fin.fade(dark);
      const lk = es(t, 7.2, 7.5);
      const [lx, ly] = hand(800, F + 10, 1.08, false, 64);
      vis(lamp, { x: lx - 6, y: ly + 4, s: 1.1, o: lk });
      if (lk > 0) fade(lamp.querySelector('.glow'), 0.9 + (T ? Math.sin(T * 5) * 0.08 : 0));
      vis(pool, { x: 800, y: F - 120, s: 1 - dark * 0.3, o: 0.5 + bump(t, 1.2, 2) * 0.4 + dark * 0.2 });
      jesus.set({ x: 800, y: F + 10, s: 1.08, armF: 20 + speak * 40 + wk * 40 * (1 - es(t, 1.95, 2.15)) + bump(t, 4.1, 4.9) * 0 + es(t, 5.3, 5.6) * 50 * (1 - es(t, 6.0, 6.2)) + lk * 44, armB: 10 + bump(t, 0.5, 1.0) * 90 + bump(t, 4.05, 4.95) * 130 + bump(t, 6.1, 6.9) * 90, head: -2 - bump(t, 4.05, 4.95) * 14 + wk * 6 * (1 - es(t, 1.95, 2.1)) - bump(t, 6.1, 6.9) * 8, blink: blinkAt(T) });

      S.cam.x = kf(t, [[0, 60], [1, 40], [1.9, 0], [2.2, -40], [3.4, -60], [4.1, 0], [6, 0], [7.2, 0]]);
      S.cam.y = kf(t, [[0, 0], [1.2, -20], [2.2, 0], [3.4, -40], [4.1, -100], [5.1, -60], [6.1, -80], [7.2, -40], [8, -30]]);
      S.cam.z = kf(t, [[0, 1.06], [1.2, 1.1], [2.2, 1.04], [3.4, 1.06], [4.1, 0.98], [5.1, 1.04], [6.1, 1.0], [7.2, 1.1], [8, 1.16]]);
    };
  },
};
