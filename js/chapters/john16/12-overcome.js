// J 16,31–33 — "Do you now believe?": He turns to them gently, a small question over Him. "The hour comes, yes, has
// now come": an hourglass is lowered and its last sand runs out; the night deepens. "You will be scattered, everyone
// to his own place, and you will leave Me alone": the eleven lanterns go off in eleven directions, down the valley,
// up the slope, towards the city — small lights far apart — and He stands alone on the path. "Yet I am not alone,
// because the Father is with Me": light comes down from above (never a figure) and surrounds Him. "I have told you
// these things, that in Me you may have peace": golden threads reach from Him to every far lantern. "In the world you
// have oppression": a paper globe is lowered, grey storm clouds wheel round it, lightning. "But cheer up! I have
// overcome the world": His light rises behind the globe like the sun, the storm breaks up and flies apart, dawn
// comes, and the eleven lanterns are drawn back together around Him.
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  pathSet, cast, put, lampK, hourglassRig, fatherLight, globe, greyCloud, radiance, rayBurst, speech, question,
  arcThreads, hand, headAt, hanging, sheet, shade, mix, kf, vis, pose, lerp, C, PI, JX, NIGHT, DEEP, STORM, DAWN, LINE,
} from './lib.js';
import { lightning } from '../../assets/things.js';

const WG = [JX, 290];
// where each one goes (x, dy relative to the feet line, scale factor)
const AWAY = {
  andrew: [-120, -30, 0.7], james: [150, -150, 0.42], thomas: [330, -120, 0.4], john: [520, -170, 0.36], peter: [40, 60, 1.05],
  matthew: [1070, -170, 0.36], philip: [1260, -130, 0.4], bartholomew: [1480, -150, 0.42], jamesA: [1720, -40, 0.7], thaddaeus: [1600, 60, 1.05], simonZ: [960, -210, 0.3],
};

export default {
  id: 'j16-overcome',
  beats: [
    { v: 31 },
    { v: 32, text: 'Oto nadchodzi godzina, a nawet już nadeszła,' },
    { v: 32, cont: true, text: 'że się rozproszycie - każdy w swoją stronę, a Mnie zostawicie samego.' },
    { v: 32, cont: true, text: 'Ale Ja nie jestem sam, bo Ojciec jest ze Mną.' },
    { v: 33, text: 'To wam powiedziałem, abyście pokój we Mnie mieli.' },
    { v: 33, cont: true, text: 'Na świecie doznacie ucisku,' },
    { v: 33, cont: true, text: 'ale miejcie odwagę: Jam zwyciężył świat».' },
  ],
  cam: { x: [-30, 30], y: [-90, 40], z: [0.94, 1.14] },
  build(S) {
    const c = S.c;
    let sunL = null;
    const P = pathSet(S, {
      beyond(S2) {
        sunL = S2.layer({ par: 0.12, sh: 0, flat: true });
        sunL.add(`<ellipse cx="800" cy="480" rx="1000" ry="320" fill="url(#halo-glow)"/><ellipse cx="800" cy="470" rx="500" ry="160" fill="url(#halo-glow)"/>`);
        return sunL;
      },
    });
    const GY = P.GY;

    // the light above Him
    const hiL = S.layer({ par: 0.12, sh: 2 });
    const high = hiL.add(`<g>${fatherLight(c, 60, { ray: [1.5, 2.2], glow: 2.6 })}</g>`);
    const beamL = S.layer({ par: 0.4, sh: 0, flat: true });
    const gid = S.id('beam');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6dc" stop-opacity=".0"/><stop offset=".25" stop-color="#fff6dc" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9b0" stop-opacity=".1"/></linearGradient>`);
    const beam = beamL.add(`<g><path d="${c.poly([[-40, 0], [40, 0], [150, 600], [-150, 600]])}" fill="url(#${gid})"/></g>`);

    // the rising light behind the globe
    const riseL = S.layer({ par: 0.16, sh: 2 });
    const rise = riseL.add(`<g>${rayBurst(c, { n: 24, r0: 60, r1: 330, spread: 0.04, o: 0.4 })}<g transform="scale(.8)">${radiance(c, 120)}</g></g>`);
    // the globe, its storm and lightning
    const gL = S.layer({ par: 0.2, sh: 5 });
    const world = hanging(gL, globe(c, 62), { x: WG[0], y: WG[1], len: 700 });
    const stormL = S.layer({ par: 0.21, sh: 4 });
    const clouds = Array.from({ length: 6 }, (_, i) => ({ i, a: (i / 6) * PI * 2, el: stormL.add(`<g>${greyCloud(c, c.rr(80, 105), mix(C.storm2, C.night2, 0.2 + (i % 2) * 0.15))}</g>`) }));
    const bolts = [0, 1].map((i) => stormL.add(`<g>${lightning(c, 120)}</g>`));
    // the hourglass
    const HX = S.portrait ? 985 : 1040;        // phone: its string clear of the moon
    const hgL = S.layer({ par: 0.2, sh: 4 });
    const hg = hourglassRig(hgL, c, 120);
    const hgStr = hgL.add(`<g><path d="M0 -1600V-60" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/></g>`);

    const thrL = S.layer({ par: 0.5, sh: 0, flat: true });
    const setThread = arcThreads(thrL, 11, { w: 2 });
    const peopleL = S.layer({ par: 0.52, sh: 5 });
    const { J, D } = cast(S, peopleL, { gy: GY, pos: LINE });
    const fx = S.layer({ par: 0.56, sh: 4 });
    const ask = fx.add(`<g>${speech(c, `<g transform="scale(.7)">${question(c)}</g>`, { w: 46, h: 44 })}</g>`);
    const ringJ = fx.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      P.update(T);

      /* v31 — "Do you now believe?" */
      const [jhx, jhy] = headAt(JX, J.y, J.s, false);
      const q = es(t, 0.15, 0.35, ease.back) * (1 - es(t, 0.9, 1.05));
      vis(ask, { x: jhx + 14, y: jhy - 30, s: q, o: q > 0.01 ? 1 : 0 });

      /* v32a — the hour has come */
      const hIn = es(t, 0.95, 1.25, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      vis(hg.el, { x: HX, y: 300 - (1 - hIn) * 700, r: T ? Math.sin(T * 0.9) * 1 : 0, o: hIn > 0.01 ? 1 : 0 });
      vis(hgStr, { x: HX, y: 300 - (1 - hIn) * 700, o: hIn > 0.01 ? 1 : 0 });
      hg.set(0.35 - es(t, 1.2, 1.7) * 0.34, t > 1.2 && t < 1.75 ? 1 : 0);
      const night = es(t, 1.2, 1.7) * (1 - es(t, 3.05, 3.4) * 0.4);
      const storm = es(t, 5.05, 5.35) * (1 - es(t, 6.1, 6.5));
      const dawn = es(t, 6.1, 6.8);
      if (dawn > 0.001) P.sky.blend(STORM, DAWN, dawn);
      else if (storm > 0.001) P.sky.blend(DEEP, STORM, storm);
      else P.sky.blend(NIGHT, DEEP, night);
      P.stars.fade(1 - dawn * 0.9);
      fade(P.moon, 1 - Math.max(storm * 0.8, dawn * 0.7));
      sunL.fade(dawn);

      /* v32b — scattered; v33c — drawn back together */
      const back = es(t, 6.25, 6.7);
      D.forEach((m) => {
        const [ax, ady, as] = AWAY[m.k];
        const d = Math.abs(m.x - JX);
        const go = es(t, 2.05 + d * 0.0003, 2.7 + d * 0.0003, ease.in) * (1 - back);
        const x = lerp(m.x, ax, go), y = lerp(m.y, m.y + ady, go), s = m.s * lerp(1, as, go);
        const moving = (t > 2.05 && t < 2.8) || (t > 6.25 && t < 6.7);
        const away = ax > m.x;
        const face = t > 2.05 && t < 6.25 ? !away : t >= 6.25 && t < 6.7 ? away : m.flip;
        lampK(m, 0.9 - night * 0.1 + dawn * 0.1, 0, T);
        fade(m.sad, bump(t, 1.2, 3.0) * (1 - go * 0.5));
        m.p.set({ x, y, s, flip: face, walk: moving ? x * 0.06 : undefined, armF: m.arm, armB: 8 + back * (m.i % 2 ? 60 : 0), head: bump(t, 1.2, 2.2) * 10, blink: 0 });
        m.cur = [x, y, s];
      });
      /* v32c — the light with Him */
      const w = es(t, 3.1, 3.5);
      vis(high, { x: JX, y: 110 - (1 - es(t, 3.05, 3.3)) * 250, s: 0.9, o: w * (1 - es(t, 4.9, 5.1)) });
      vis(beam, { x: JX, y: 150, sy: Math.max(0.02, w), o: w * (1 - es(t, 4.95, 5.1)) });
      vis(ringJ, { x: JX, y: J.y - 110, s: 0.6 + w * 0.8, o: w * (1 - storm * 0.5) });
      /* v33a — threads of peace to every far lantern */
      D.forEach((m, i) => {
        const [x, y, s] = m.cur;
        const [lx, ly] = hand(x, y, s, m.flip, m.arm);
        const k = es(t, 4.1 + (i % 6) * 0.04, 4.45 + (i % 6) * 0.04) * (1 - es(t, 5.0, 5.2) * 0.6) * (1 - back);
        setThread(i, JX, J.y - 120, lerp(JX, lx, k), lerp(J.y - 120, ly + 20, k), 30, k * 0.9);
      });
      /* v33b — the globe in the storm; v33c — His light rises, the storm flies apart */
      const gIn = es(t, 4.95, 5.25, ease.out);
      vis(world, { x: WG[0], y: WG[1] - (1 - gIn) * 700, r: T ? Math.sin(T * 0.7) * 1 : 0, o: gIn > 0.01 ? 1 : 0 });
      const blow = es(t, 6.15, 6.6);
      clouds.forEach((cl) => {
        const a = cl.a + t * 1.2;
        const R = 118 + blow * 700;
        vis(cl.el, { x: WG[0] + Math.cos(a) * R, y: WG[1] + 24 + Math.sin(a) * R * 0.55, s: 0.9, o: es(t, 5.1, 5.3) * (1 - blow) });
      });
      bolts.forEach((b, i) => {
        const fl = bump(t, 5.4 + i * 0.25, 5.5 + i * 0.25);
        vis(b, { x: WG[0] + (i ? 100 : -110), y: WG[1] + 10, r: i ? -12 : 14, s: 0.8, o: fl * (1 - blow) });
      });
      const up = es(t, 6.05, 6.6, ease.out);
      vis(rise, { x: WG[0], y: lerp(560, WG[1], up), s: 0.6 + up * 0.5, r: T * 2, o: up });

      /* Jesus */
      put(J, T, { armF: 20 + bump(t, 0.1, 0.9) * 40 + bump(t, 4.1, 4.9) * 60 + es(t, 6.1, 6.5) * 50, armB: 10 + bump(t, 3.1, 3.9) * 30 + es(t, 6.1, 6.5) * 140, head: bump(t, 2.3, 2.9) * 10 - bump(t, 3.2, 3.9) * 12 - es(t, 6.2, 6.5) * 8 });
      fade(J.sad, bump(t, 2.2, 3.1) * 0.8);

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 0], [1, -10], [2, 0], [2.8, 20], [3.2, -20], [4, 10], [5, -50], [6, -60], [7, -50]]);
      S.cam.z = kf(t, [[0, 1.08], [1, 1.04], [2, 1.0], [2.8, 0.96], [3.5, 1.02], [4.2, 0.96], [5, 1.0], [7, 1.0]]);
    };
  },
};
