// J 17,24–26 — "Father, I desire that those You gave Me be with Me where I am": high above, the door of light that
// stayed shut (17,15) swings open, and a path of light climbs to it from the group. "To see My glory, which You gave
// Me": glory streams out of the open door and lights their upturned faces. "For You loved Me before the foundation
// of the world": a round plate hangs down — in the timeless dark, the Word's flame within a heart of light, and only
// then a small world set beneath it. "Righteous Father, the world has not known You": grey mist rolls over the city
// and the far hills, veiling them. "But I have known You": a bright beam joins Him to the radiance, sparks running
// both ways. "And these have known that You sent Me": threads of light from each of the Eleven to Him. "I made
// Your name known to them, and will make it known": the Name shines again and its light runs on and on, far away over
// the hills. "That the love with which You loved Me may be in them, and I in them": the close — the Eleven have fallen
// asleep under the stars, each with a small heart of light; He stands among them with lifted hands, and a great
// heart of light hangs over the whole sleeping world.
import { es, ease, bump } from '../../core/anim.js';
import {
  slopeSet, eleven, jesusOn, put, lampK, headOf, chestOf, fatherLight, skyDoor17, goldWord, wordFlame, lightHeart, heart,
  spark, lightPath, drawPath, lineD, curves, arcAt, lower, sheet, globe, vis, kf, pose, fade, tr, mix, C, JX, JY, NIGHT, HOLY,
  DEEP, PRAY, PI, lerp,
} from './lib.js';

const RY = 150;
const DOOR = [800, 330];
const STEPS = (() => { const p = []; for (let i = 0; i <= 30; i++) { const u = i / 30; p.push([JX + 70 * Math.sin(u * PI * 1.5) * (1 - u * 0.5), lerp(JY - 190, DOOR[1] + 2, u)]); } return p; })();
const FAR = (() => { const p = []; for (let i = 0; i <= 30; i++) { const u = i / 30; p.push([lerp(JX + 60, 1560, u), 330 + u * 120 - Math.sin(u * PI) * 90]); } return p; })();

export default {
  id: 'j17-love',
  beats: [
    { v: 24, text: 'Ojcze, chcę, aby także ci, których Mi dałeś, byli ze Mną tam, gdzie Ja jestem,' },
    { v: 24, cont: true, text: 'aby widzieli chwałę moją, którą Mi dałeś,' },
    { v: 24, cont: true, text: 'bo umiłowałeś Mnie przed założeniem świata.' },
    { v: 25, text: 'Ojcze sprawiedliwy! Świat Ciebie nie poznał,' },
    { v: 25, cont: true, text: 'lecz Ja Ciebie poznałem' },
    { v: 25, cont: true, text: 'i oni poznali, żeś Ty Mnie posłał.' },
    { v: 26, text: 'Objawiłem im Twoje imię i nadal będę objawiał,' },
    { v: 26, cont: true, text: 'aby miłość, którą Ty Mnie umiłowałeś, w nich była i Ja w nich».' },
  ],
  cam: { x: [-20, 40], y: [-80, 30], z: [0.94, 1.14] },
  build(S) {
    const c = S.c;
    const P = slopeSet(S, { skyCols: NIGHT, starsN: 150 });
    // grey mist over the city and the far hills
    const mistL = S.layer({ par: 0.12, sh: 1, pad: 300 });
    let mist = '';
    for (let i = 0; i < 16; i++) mist += `<path d="${c.cut(c.blob(c.rr(-300, 1900), c.rr(330, 480), c.rr(160, 300), c.rr(26, 50), 18, 0.25), 1.4, 9)}" fill="${mix(C.storm, C.lavender, 0.2 + (i % 3) * 0.1)}" opacity=".32"/>`;
    mistL.add(mist);

    const hiL = S.layer({ par: 0.08, sh: 3 });
    const high = hiL.add(`<g>${fatherLight(c, 54)}</g>`);
    const bigH = hiL.add(`<g><circle r="330" fill="url(#halo-glow)"/><g transform="scale(1)">${lightHeart(c, 96)}</g></g>`);
    const hStr = hiL.add(`<g><path d="M0 -1600V-60" stroke="rgba(233,210,160,.5)" stroke-width="1.2" fill="none"/></g>`);
    const doorL = S.layer({ par: 0.12, sh: 4 });
    const dm = skyDoor17(c, 92, 146);
    const glowOut = doorL.add(`<g><circle r="300" fill="url(#halo-glow)"/><path d="${(() => { let d = ''; for (let i = 0; i < 16; i++) { const a = PI * (0.1 + (i / 15) * 0.8); d += c.poly([[0, 0], [Math.cos(a - 0.03) * 600, Math.sin(a - 0.03) * 600], [Math.cos(a + 0.03) * 600, Math.sin(a + 0.03) * 600]]); } return d; })()}" fill="#fff3cf" opacity=".22"/></g>`);
    const doorBack = doorL.add(`<g>${dm.back}</g>`);
    const leaf = doorL.add(`<g>${dm.leaf}</g>`);

    // the plate: before the world
    const plL = S.layer({ par: 0.2, sh: 4 });
    const plate = plL.add(`<g><path d="M0 -1600V-92" stroke="rgba(233,210,160,.5)" stroke-width="1.2" fill="none"/>${sheet().p(c.cut(c.circ(0, 0, 92, 44), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 84, 44), 0.5, 5), '#171a3a').out()}<g transform="translate(0 -6)">${lightHeart(c, 44)}</g><g transform="translate(0 4)">${wordFlame(c, 44)}</g></g>`);
    const plWorld = plL.add(`<g>${globe(c, 16)}</g>`);
    // the name
    const name = plL.add(`<g><path d="M-60 -1600V-18M60 -1600V-18" stroke="rgba(233,210,160,.5)" stroke-width="1.2" fill="none"/>${goldWord(c, tr('Abba — Ojcze', 'Abba — Father'), { size: 26 })}</g>`);

    const thL = S.layer({ par: 0.3, sh: 0, flat: true });
    const steps = thL.add(`<g>${lightPath(lineD(STEPS), { w: 7, col: C.halo })}</g>`);
    const stepsP = steps.firstElementChild;
    const far = thL.add(`<g>${lightPath(lineD(FAR), { w: 4, col: C.halo })}</g>`);
    const farP = far.firstElementChild;
    const farSparks = [0, 1, 2, 3, 4].map(() => thL.add(`<g>${spark(4)}</g>`));
    const beam = thL.add(`<g><path d="M-6 0L6 0L16 1L-16 1Z" fill="#fff6dc" opacity=".75"/></g>`);
    const beamSparks = [0, 1, 2, 3].map(() => thL.add(`<g>${spark(4)}</g>`));
    const knew = curves(thL, 11, { color: C.halo, w: 1.6 });

    const faceL = S.layer({ par: 0.38, sh: 0, flat: true });
    const faceGlows = Array.from({ length: 11 }, () => faceL.add(`<g><circle r="46" fill="url(#halo-glow)"/></g>`));
    const peopleL = S.layer({ par: 0.4, sh: 5 });
    const J = jesusOn(S, peopleL);
    const D = eleven(S, peopleL);
    const Z = eleven(S, peopleL, { eyes: 'closed', lamps: false, face: false });
    const fx = S.layer({ par: 0.42, sh: 3 });
    const hearts = D.map(() => fx.add(`<g><circle r="26" fill="url(#halo-glow)"/>${heart(c, 9, C.jesusMantle)}</g>`));

    const JH = [JX + 2, JY - 176];
    const PLX = S.portrait ? 995 : 1030;   // phone: the plate clear of the screen edge
    return (t, time) => {
      const T = time;
      P.update(T);
      const dim = es(t, 3.05, 3.4) * (1 - es(t, 4.1, 4.5));
      if (t > 6.9) P.sky.blend(NIGHT, DEEP, es(t, 7.0, 7.5) * 0.8);
      else P.sky.blend(NIGHT, HOLY, 0.4 - dim * 0.4);
      vis(high, { x: JX, y: RY, r: T * 1.5, s: 1 + bump(t, 4.05, 4.9) * 0.15, o: 1 - es(t, 7.1, 7.5) * 0.4 });

      /* v24a — the door opens; the path climbs to it */
      const dk = es(t, 0.05, 0.35) * (1 - es(t, 2.9, 3.2));
      const open = es(t, 0.35, 0.8);
      vis(doorBack, { x: DOOR[0], y: DOOR[1], o: dk });
      vis(leaf, { x: DOOR[0] - 46, y: DOOR[1], sx: 1 - open * 0.86, o: dk });
      drawPath(stepsP, es(t, 0.5, 0.95));
      fade(steps, 1 - es(t, 2.8, 3.1));
      /* v24b — glory streams out on their faces */
      const gl = es(t, 1.05, 1.45) * (1 - es(t, 2.8, 3.1));
      vis(glowOut, { x: DOOR[0], y: DOOR[1] - 60, o: gl });
      /* v24c — loved before the world: the plate */
      const pk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      lower(plate, pk, PLX, 290, { len: 700, r: T ? Math.sin(T * 0.7) : 0 });
      const wk = es(t, 2.45, 2.7, ease.back);
      vis(plWorld, { x: PLX, y: 290 - (1 - pk) * 700 + 60, s: wk, o: wk > 0.01 && pk > 0.01 ? 1 : 0 });

      /* v25a — the world has not known You: mist */
      mistL.fade(dim + es(t, 4.1, 4.5) * 0.35 * (1 - es(t, 6.05, 6.5)));
      mistL.shift(-120 + es(t, 3.0, 3.8) * 120, 0);
      /* v25b — I have known You: the beam */
      const bk = es(t, 4.05, 4.35) * (1 - es(t, 5.9, 6.2));
      vis(beam, { x: JX, y: RY + 40, sy: Math.max(1, bk * (JH[1] - 50 - RY)), o: bk });
      beamSparks.forEach((el, i) => {
        const u = ((T * 0.3 + i * 0.25) % 1), y = i % 2 ? lerp(RY + 50, JH[1] - 40, u) : lerp(JH[1] - 40, RY + 50, u);
        vis(el, { x: JX, y, o: bk > 0.95 ? Math.sin(u * PI) : 0 });
      });
      /* v25c — they have known: threads to Him */
      D.forEach((m, i) => {
        const [hx, hy] = headOf(m);
        const d = Math.abs(m.x - JX) / 400;
        knew(i, [hx, hy - 20], [JX, JY - 130], -50, es(t, 5.05 + d * 0.2, 5.4 + d * 0.2), 0.85 * (1 - es(t, 6.0, 6.3)));
      });
      /* v26a — the Name, made known and still to be made known: its light runs far away */
      const nk = es(t, 6.05, 6.35, ease.out) * (1 - es(t, 6.95, 7.2, ease.in));
      lower(name, nk, JX, 318, { len: 600, r: T ? Math.sin(T * 0.7) * 0.8 : 0 });
      drawPath(farP, es(t, 6.3, 6.85));
      fade(far, 1 - es(t, 7.0, 7.3));
      farSparks.forEach((el, i) => {
        const u = ((T * 0.18 + i * 0.2) % 1);
        const p = FAR[Math.round(u * 30)];
        vis(el, { x: p[0], y: p[1], s: 1 - u * 0.6, o: t > 6.85 && t < 7.1 ? Math.sin(u * PI) : 0 });
      });

      /* v26b — the close: asleep under the stars, hearts of light, the great heart over the world */
      const sleep = es(t, 7.05, 7.12);
      const hk = es(t, 7.2, 7.6, ease.out);
      vis(bigH, { x: JX, y: 250 - (1 - hk) * 600, s: 1, r: T ? Math.sin(T * 0.6) * 1.2 : 0, o: hk > 0.01 ? 1 : 0 });
      vis(hStr, { x: JX, y: 250 - (1 - hk) * 600 - 34, o: hk > 0.01 ? 1 : 0 });
      D.forEach((m, i) => {
        const z = Z[i];
        const [hx, hy] = headOf(m);
        const look = es(t, 0.3, 0.8) * (1 - es(t, 2.9, 3.2));
        vis(faceGlows[i], { x: hx, y: hy, s: m.s, o: gl * 0.9 });
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, o: 1 - sleep, head: -8 - look * 16 - bump(t, 4.1, 4.8) * 6, armF: 14 + bump(t, 1.1, 2.9) * 30, armB: 6, blink: 0 });
        z.p.set({ x: z.x, y: z.y, s: z.s, flip: z.flip, o: sleep, head: 16 + (i % 3) * 5, armF: 10, armB: 4 });
        lampK(m, 0.85 - sleep * 0.3);
        const [cx, cy] = chestOf(m);
        const k = es(t, 7.3 + (i % 5) * 0.05, 7.55 + (i % 5) * 0.05, ease.back);
        vis(hearts[i], { x: cx + (m.flip ? -3 : 3), y: cy + 8, s: k * m.s * (1 + (T ? Math.sin(T * 2 + i) * 0.04 : 0)), o: k > 0.01 ? 1 : 0 });
      });

      put(J, T, {
        head: PRAY.head - bump(t, 0.1, 1.9) * 6 + bump(t, 5.05, 5.9) * 20 + es(t, 7.1, 7.5) * 4,
        armF: PRAY.armF + bump(t, 0.1, 1.0) * 10 + es(t, 7.1, 7.5) * 20,
        armB: PRAY.armB + es(t, 7.1, 7.5) * 20,
      });

      S.cam.x = kf(t, [[0, 0], [2, 0], [2.4, 20], [3, 20], [3.5, 0], [6.2, 0], [6.8, 30], [7.1, 0]]);
      S.cam.y = kf(t, [[0, -50], [1, -60], [2, -50], [3, -30], [4, -40], [5, -10], [6, -30], [7, -30], [8, -50]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [2, 1.0], [3, 0.98], [4, 1.02], [5, 1.06], [6, 1.0], [7, 1.0], [8, 0.96]]);
    };
  },
};
