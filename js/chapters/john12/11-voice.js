// J 12,28–30 — "Father, glorify Your name!": Jesus lifts His arms and a column of light rises from Him. Then the
// voice from heaven — never a figure: the sky opens in great rings of light that roll down over the court, and the
// whole set shivers as with thunder. "I have glorified it, and I will glorify it again" — a golden ring stands
// complete, and a second one draws itself. The crowd on the left: "It thundered!" (a jagged bubble with a storm
// cloud); others on the right: "An angel spoke to Him!" (a little angel). Jesus turns to them: "This voice came
// not for My sake, but for yours" — and the rings of light roll out over the people.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { lightning } from '../../assets/things.js';
import { thunderCloud } from '../mark3/lib.js';
import { courtStage, CT, GOLDEN, man, crowdPerson, people, place, bubble, smallAngel, eternityRing, drawRing, glowDisc, rayBurst, goldWord, headAt, voiceRings, kf, vis, hanging, swing, tr, PI } from './lib.js';

export default {
  id: 'j12-voice',
  beats: [
    { v: 28, text: 'Ojcze, wsław Twoje imię!».' },
    { v: 28, cont: true, text: 'Wtem rozległ się głos z nieba:' },
    { v: 28, cont: true, text: '«Już wsławiłem i jeszcze wsławię».' },
    { v: 29, text: 'Tłum stojący [to] usłyszał i mówił: «Zagrzmiało!»' },
    { v: 29, cont: true, text: 'Inni mówili: «Anioł przemówił do Niego».' },
    { v: 30 },
  ],
  cam: { x: [-60, 60], y: [-120, 40], z: [0.96, 1.14] },
  build(S) {
    const c = S.c;
    const st = courtStage(S, { skyCols: ['#e0c8a6', '#f0d4a6', '#f6e3bf'], sunAt: [1220, 240] });
    const F = CT.FLOOR;
    /* heaven opening: rays + rings (flat, high) */
    const heav = S.layer({ par: 0.02, sh: 0, flat: true });
    const burst = heav.add(`<g>${rayBurst(c, { n: 30, r0: 40, r1: 1300, spread: 0.04, color: '#fff3cf', o: 0.7 })}${glowDisc(320, 'halo-glow', 1)}</g>`);
    const ringsL = S.layer({ par: 0.2, sh: 0, flat: true });
    const bigRings = Array.from({ length: 5 }, (_, i) => ringsL.add(`<g><ellipse rx="200" ry="70" fill="none" stroke="${C.haloRim}" stroke-width="${12 - i}" opacity=".85"/><ellipse rx="200" ry="70" fill="none" stroke="#fff6d8" stroke-width="${5 - i * 0.6}"/></g>`));
    // slip the heavens behind the court and the rolling rings just in front of the paving (DOM order = depth)
    st.sk.layer.el.after(heav.el);
    st.floorL.el.after(ringsL.el);
    const wash = st.glowL.add(`<g>${glowDisc(520, 'halo-glow', 1)}</g>`);
    const column = st.glowL.add(`<g><path d="M-60 0L60 0L30 -900L-30 -900Z" fill="#fff3cf" opacity=".45"/></g>`);
    const left = people(S, st.act, [[440, 4], [510, -8], [570, 8], [630, -4]].map(([x, dy], i) => ({ x, y: F + dy, s: 0.96, look: i % 2 ? crowdPerson(c) : man(c) })), 'l');
    const right = people(S, st.act, [[990, -6], [1050, 6], [1120, -4], [1180, 8]].map(([x, dy], i) => ({ x, y: F + dy, s: 0.96, flip: true, look: i % 2 ? man(c) : crowdPerson(c) })), 'r');
    const jesus = S.puppet(st.act.add(person(c, CAST.jesus)));
    const fx = st.fx;
    const done = fx.add(`<g>${glowDisc(110, 'halo-glow', 0.8)}${eternityRing(c, 62, 6, 24, C.haloRim)}</g>`);
    const again = fx.add(`<g>${glowDisc(110, 'halo-glow', 0.8)}${eternityRing(c, 62, 6, 24, C.haloRim)}</g>`);
    const words = fx.add(`<g>${goldWord(c, tr('Już wsławiłem i jeszcze wsławię', 'I have glorified it, and will glorify it again'), { size: 22 })}</g>`);
    const thunder = fx.add(`<g>${bubble(c, [tr('Zagrzmiało!', 'It thundered!')], { size: 22, tail: 1 })}<g transform="translate(0 -104)">${thunderCloud(c, 90)}</g><g transform="translate(4 -96) scale(.16)">${lightning(c, 360)}</g></g>`);
    const angel = fx.add(`<g>${bubble(c, [tr('Anioł przemówił', 'An angel has'), tr('do Niego!', 'spoken to him!')], { size: 19, tail: -1 })}<g transform="translate(0 -128) scale(.8)">${smallAngel(c).replace(/<path d="M0 -1600V-30"[^>]*>/, '')}</g></g>`);
    const vL = S.layer({ par: 0.52, sh: 2 });
    const up = voiceRings(vL, c, { n: 3, r: 36, w: 6, both: false, color: shade(C.halo, -0.05) });
    const outL = voiceRings(vL, c, { n: 3, r: 40, w: 6, both: false, color: shade(C.halo, -0.05) });
    const outR = voiceRings(vL, c, { n: 3, r: 40, w: 6, both: false, color: shade(C.halo, -0.05) });
    const jolt = [st.back, st.act, st.floorL];
    st.front();

    return (t, time) => {
      const T = time;
      swing(st.sunEl, 1220, 240, T, 1, 0.7);
      swing(st.cl1, 470, 140, T, 1.2, 0.6, 1);
      /* v28a — "Father, glorify Your name" */
      const pray = es(t, 0.1, 0.4) * (1 - es(t, 4.9, 5.2));
      const turnL = es(t, 5.05, 5.15);
      jesus.set({ x: 800, y: F + 8, s: 1.06, flip: turnL > 0.5, armF: 20 + pray * 110 - bump(t, 5.2, 5.9) * 0 + turnL * 60, armB: 20 + pray * 130, head: -pray * 18, blink: pray > 0.5 && t < 1 ? 1 : blinkAt(T) });
      vis(column, { x: 800, y: F, sx: 0.6 + es(t, 0.2, 0.7) * 0.6, o: es(t, 0.2, 0.6) * (1 - es(t, 2.9, 3.3)) });
      const [jhx, jhy] = headAt(800, F + 8, 1.06, false);
      up(jhx, jhy - 60, bump(t, 0.3, 0.95), T, { dir: 1, spread: 1.4 });
      /* v28b — the voice from heaven */
      const open = es(t, 1.05, 1.4);
      vis(burst, { x: 800, y: -120, s: 0.4 + open * 0.8, r: T ? T * 3 : t * 20, o: open * (1 - es(t, 5.6, 6)) * 0.9 });
      bigRings.forEach((el, i) => {
        const k = T ? (T * 0.35 + i / 5) % 1 : (i + 0.5) / 5;
        const on = es(t, 1.1, 1.3) * (1 - es(t, 2.9, 3.2)) + bump(t, 5.1, 6) * 0.8;
        vis(el, { x: 800, y: lerp(-40, 420, k), s: 0.6 + k * 2.4, o: on * (1 - k) * 0.9 });
      });
      vis(wash, { x: 800, y: 140, s: 0.6 + open * 0.6, o: open * (1 - es(t, 2.9, 3.3)) * 0.9 });
      const shake = bump(t, 1.15, 1.9);
      jolt.forEach((L, i) => L.shift(T ? Math.sin(T * 38 + i) * 5 * shake : 0, T ? Math.cos(T * 31 + i) * 3 * shake : 0));
      st.sk.blend(['#e0c8a6', '#f0d4a6', '#f6e3bf'], ['#f4e8c8', '#fbefd2', '#fdf5e0'], open * (1 - es(t, 5.6, 6)));
      /* v28c — "I have glorified it, and will glorify it again" */
      const wk = es(t, 2.05, 2.3, ease.back) * (1 - es(t, 2.95, 3.1));
      vis(words, { x: 800, y: 250, s: wk, o: wk > 0.01 ? 1 : 0 });
      const dk = es(t, 2.1, 2.3) * (1 - es(t, 2.95, 3.1));
      vis(done, { x: 620, y: 330, o: dk, r: T ? T * 5 : 0 });
      drawRing(done, 1);
      vis(again, { x: 980, y: 330, o: dk, r: T ? -T * 5 : 0 });
      drawRing(again, es(t, 2.3, 2.85));
      /* the crowd */
      const hear = es(t, 1.1, 1.4);
      left.forEach((m, i) => place(m, T, { armF: 20 + hear * 30 + (i === 1 ? bump(t, 3.1, 3.9) * 70 : 0) + bump(t, 5.2, 5.95) * 20, armB: hear * (i === 1 ? bump(t, 3.1, 3.9) * 140 : 20), head: -hear * 10 + bump(t, 1.2, 1.9) * 6 * (i % 2 ? -1 : 1), lean: -shake * 4 }));
      right.forEach((m, i) => place(m, T, { armF: 20 + hear * 30 + (i === 1 ? bump(t, 4.1, 4.9) * 80 : 0) + bump(t, 5.2, 5.95) * 20, armB: hear * 20, head: -hear * 10, lean: shake * 4 }));
      const tk = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.95, 4.1));
      vis(thunder, { x: 560, y: 450, s: tk, o: tk > 0.01 ? 1 : 0, r: tk > 0.01 && T ? Math.sin(T * 30) * 1.5 : 0 });
      const ak = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.95, 5.1));
      vis(angel, { x: 1040, y: 450, s: ak, o: ak > 0.01 ? 1 : 0 });
      /* v30 — "not for My sake but for yours" */
      outL(jhx - 20, jhy + 20, bump(t, 5.15, 5.95), T, { dir: -1, spread: 3 });
      outR(jhx + 20, jhy + 20, bump(t, 5.2, 5.98), T, { dir: 1, spread: 3 });

      S.cam.x = kf(t, [[0, 0], [1, 0], [2, 0], [3, -60], [4, 50], [5, 0]]);
      S.cam.y = kf(t, [[0, -20], [0.6, -60], [1.2, -110], [2.0, -60], [3, -10], [5, 0]]);
      S.cam.z = kf(t, [[0, 1.06], [1, 1.02], [1.4, 0.98], [2.1, 1.02], [3, 1.08], [4, 1.08], [5, 1.02]]);
    };
  },
};
