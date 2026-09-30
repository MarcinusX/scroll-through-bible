// J 8,21–24 — "I am going away": Jesus climbs the fifteen steps toward the shining gate; below, the leaders lift
// little lamps and search, a grey cloud over them. "Where I go you cannot come" — a bar of light lies across the
// lowest step and they stop at it. "Will He kill Himself?" — they put their heads together, puzzled. "You are from
// below, I am from above" — the stage becomes two storeys: light opens above the gate, shadow gathers over the floor.
// "You are of this world" — a paper world hangs low among them. "Unless you believe that I AM" — the I AM shines over
// Him and a ray of light runs down the steps to them; one of them turns and looks up.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { nightStage, DC, LC, NIGHT, voiceRings, handLamp, thought, question, globe, iAm, rayBurst, strip, hand, hanging, swing, vis, tr, PI } from './lib.js';
import { sorrowCloud } from '../mark5/lib.js';

const UP = { x: 800, y: 548, s: 0.8 };

export default {
  id: 'j8-going',
  beats: [
    { v: 21, text: 'A oto znowu innym razem rzekł do nich: «Ja odchodzę, a wy będziecie Mnie szukać i w grzechu swoim pomrzecie.' },
    { v: 21, cont: true, text: 'Tam, gdzie Ja idę, wy pójść nie możecie».' },
    { v: 22 },
    { v: 23, text: 'A On rzekł do nich: «Wy jesteście z niskości, a Ja jestem z wysoka.' },
    { v: 23, cont: true, text: 'Wy jesteście z tego świata, Ja nie jestem z tego świata.' },
    { v: 24, text: 'Powiedziałem wam, że pomrzecie w grzechach swoich.' },
    { v: 24, cont: true, text: 'Tak, jeżeli nie uwierzycie, że JA JESTEM, pomrzecie w grzechach swoich».' },
  ],
  cam: { x: [0, 0], y: [-20, 0], z: [1, 1.04] },
  build(S) {
    const c = S.c;
    const st = nightStage(S, { skyCols: NIGHT });
    const K = st.cast;
    // above: the light over the gate
    const above = st.glowL.add(`<g><ellipse rx="520" ry="260" fill="url(#halo-glow)"/>${rayBurst(c, { n: 16, r0: 60, r1: 380, spread: 0.04, o: 0.3 })}</g>`);
    const bar = st.glowL.add(`<g><path d="M-250 0L250 0L262 10L-262 10Z" fill="#fff3cf" opacity=".9"/><ellipse rx="300" ry="26" fill="url(#halo-glow)"/></g>`);
    const rayDown = st.glowL.add(`<g><path d="M-20 0L20 0L120 170L40 170Z" fill="#fff3cf" opacity=".5"/></g>`);
    // below: shadow gathering over the floor (a flat sheet faded on the compositor)
    const gid = S.id('below');
    S.defs(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="600" x2="0" y2="820"><stop offset="0" stop-color="#0d0e2a" stop-opacity="0"/><stop offset=".5" stop-color="#0d0e2a" stop-opacity=".5"/><stop offset="1" stop-color="#0d0e2a" stop-opacity=".78"/></linearGradient>`);
    const belowL = S.layer({ par: 0.55, sh: 0, flat: true });
    belowL.add(`<rect x="-3000" y="560" width="8000" height="3000" fill="url(#${gid})"/>`);
    const fx = S.layer({ par: 0.58, sh: 5 });
    const rings = voiceRings(fx, c, { n: 3, r: 30, w: 4, both: false, color: shade(C.halo, -0.05) });
    const lamps = K.lead.slice(0, 4).map(() => fx.add(`<g>${handLamp(c, { glowR: 60 })}</g>`));
    const cloud = fx.add(`<g>${sorrowCloud(c, 220)}</g>`);
    const drops = Array.from(cloud.querySelectorAll('.drop'));
    const thinkQ = fx.add(`<g>${thought(c, `<g transform="scale(.8)">${question(c)}</g>`, { w: 70, h: 56 })}</g>`);
    const world = hanging(fx, globe(c, 52), { x: 1080, y: 470, len: 600 });
    const lblUp = hanging(fx, strip(c, tr('z wysoka', 'from above'), { size: 20 }), { x: 800, y: 180, len: 700 });
    const lblDown = fx.add(`<g>${strip(c, tr('z niskości', 'from beneath'), { size: 20, fill: mix(C.stone2, C.indigo, 0.3), ink: C.cream })}</g>`);
    const am = hanging(fx, iAm(c, tr('JA JESTEM', 'I AM'), { size: 30 }), { x: 800, y: 250, len: 700 });

    const DLX = S.portrait ? 1030 : 1070, WX = S.portrait ? 1050 : 1080;      // phone: whole, clear of the edge

    return (t, time) => {
      const T = time;
      /* two storeys: light above, shadow below */
      const two = es(t, 3.05, 3.5);
      st.set.update(t, T, { lit: 1 - two * 0.35, moonY: 150, glowO: 0.7 + two * 0.3, gate: 0.6 + two * 0.4 });
      vis(above, { x: 800, y: 330, s: 0.8 + two * 0.3, o: 0.25 + two * 0.75 });
      belowL.fade(Math.max(two * 0.9, es(t, 5.05, 5.4) * 1) * (1 - es(t, 6.2, 6.6) * 0.4));

      /* v21a — He goes up the steps */
      const go = es(t, 0.15, 0.9);
      const jx = 800, jy = lerp(DC.FLOOR + 8, UP.y, go), js = lerp(1.06, UP.s, go);
      const turnBack = t > 0.95;
      const talk = Math.max(bump(t, 0.9, 1.95), bump(t, 3.05, 3.95), bump(t, 4.05, 4.95), bump(t, 5.05, 5.95), bump(t, 6.05, 6.95));
      const ray = es(t, 6.2, 6.5);
      K.set(T, {
        j: {
          x: jx, y: jy, s: js, flip: false, walk: go > 0 && go < 1 ? t * 40 : undefined, o: 1,
          armF: 14 + talk * 26 + ray * 40, armB: 10 + bump(t, 3.1, 3.9) * 150 + ray * 30, head: turnBack ? 10 : -4,
        },
        lisF: (m) => ({ head: -10 * go - two * 4, flip: false }),
        leadF: (m) => {
          const search = bump(t, 0.3, 1.2) + bump(t, 1.0, 1.4) * 0.5;
          const step = m.i < 4 ? es(t, 1.2, 1.5) * 26 * (1 - es(t, 1.65, 1.9)) : 0;
          const huddle = bump(t, 2.05, 2.95);
          const look = m.i === 3 ? es(t, 6.35, 6.6) : 0;
          return {
            x: m.x - step - huddle * (m.i % 2 ? 14 : -6), flip: m.i === 1 && huddle > 0.4 ? false : true,
            armF: 20 + (m.i < 4 ? search * 50 : 0) + (m.i < 4 ? es(t, 5.05, 5.3) * -10 : 0), armB: 10, head: -search * 10 + huddle * (m.i % 2 ? 10 : -6) - look * 20 + two * 6 * (1 - look),
            angry: 0.25 + huddle * 0.3, sad: es(t, 5.1, 5.4) * 0.8 * (1 - look),
          };
        },
      });
      rings(jx + 4 * js, jy - 170 * js, talk, T, { dir: -1, s0: 0.6, spread: 1.6 });
      // their little lamps: searching; they gutter at "you will die in your sins"
      K.lead.slice(0, 4).forEach((m, i) => {
        const search = bump(t, 0.3, 1.2) + bump(t, 1.0, 1.4) * 0.5;
        const step = es(t, 1.2, 1.5) * 26 * (1 - es(t, 1.65, 1.9));
        const [hx, hy] = hand(m.x - step, m.y, m.s, true, 20 + search * 50 - es(t, 5.05, 5.3) * 10);
        const on = es(t, 0.2 + i * 0.05, 0.35 + i * 0.05) * (1 - es(t, 5.3 + i * 0.1, 5.6 + i * 0.1) * 0.85) * (1 - es(t, 2.05, 2.15) * 0.0);
        vis(lamps[i], { x: hx, y: hy, s: 0.8, o: on });
      });
      /* the cloud of sin over them */
      const ck = Math.max(es(t, 0.55, 0.85) * (1 - es(t, 1.9, 2.1)), es(t, 5.1, 5.4) * (1 - es(t, 6.5, 6.8) * 0.5));
      vis(cloud, { x: 1060, y: 470, s: 0.9, o: ck });
      drops.forEach((d, i) => { const k = ((T * 0.9 + i / 5) % 1); pose(d, { x: -80 + i * 40, y: 12 + k * 60, o: ck > 0.05 && T ? 1 - k : 0 }); });
      /* v21b — the threshold of light */
      const bk = es(t, 1.1, 1.4);
      vis(bar, { x: 800, y: LC.STEP0 - 4, s: 1, o: bk * (1 - es(t, 2.9, 3.1) * 0.5) });
      /* v22 — "Will He kill Himself?" */
      const tq = es(t, 2.15, 2.35, ease.back) * (1 - es(t, 2.9, 3.0));
      vis(thinkQ, { x: 1060, y: 470, s: tq * 1.3, o: tq > 0.01 ? 1 : 0 });
      /* v23a — the labels of the two storeys; v23b — the world, low among them */
      const ul = es(t, 3.15, 3.5, ease.out) * (1 - es(t, 4.9, 5.1, ease.in));
      swing(lblUp, 800, 170 - (1 - ul) * 600, ul > 0.001 ? T : 0, 1, 0.7);
      fade(lblUp, ul > 0.001 ? 1 : 0);
      const dl = es(t, 3.3, 3.55, ease.out) * (1 - es(t, 4.0, 4.15));
      vis(lblDown, { x: DLX, y: 500 - dl * 40, r: 3, o: dl });
      const wk = es(t, 4.1, 4.5, ease.out) * (1 - es(t, 5.0, 5.3, ease.in));
      swing(world, WX, 470 - (1 - wk) * 700, wk > 0.001 ? T : 0, 1.2, 0.8, 1);
      fade(world, wk > 0.001 ? 1 : 0);
      /* v24b — the I AM, and a ray down to them */
      const ak = es(t, 6.1, 6.45, ease.out);
      swing(am, 800, 290 - (1 - ak) * 700, ak > 0.001 ? T : 0, 0.8, 0.6);
      fade(am, ak > 0.001 ? 1 : 0);
      vis(rayDown, { x: 830, y: 560, s: 1.6, o: ray * 0.9 });

      S.cam.x = 0;
      S.cam.y = -es(t, 3.0, 3.5) * 20 * (1 - es(t, 4.8, 5.2));
      S.cam.z = 1.02 + es(t, 0.1, 0.9) * 0.02;
    };
  },
};
