// Mk 16,2–4 — The book's sunrise. In the indigo before dawn the three women walk the garden path with
// their jars and a lantern; the sun rises behind Jerusalem as they come to the tomb. They talk on the way:
// "Who will roll away the stone for us?" — then they look up: the flowering hedge is pulled aside like a
// stage flat, and the huge stone already stands rolled back, light pouring from the doorway.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, flock, shade, mix } from '../kit.js';
import { sun, moon, stars } from '../../assets/nature.js';
import { rays, bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { WOMEN, gardenSet, GARDEN_PATH, pathS, DOOR, STONE, spiceJar, lantern, along, headAt, speech, thought, GLYPH, talkDots, pushIcon, skyKeys, upright, sparkle, PI } from './lib.js';

const NIGHT = [C.night2, C.indigo, mix(C.indigo, C.duskViolet, 0.6)];
const PRE = [C.indigo, C.duskViolet, C.dusk];
const ROSE = [mix(C.duskViolet, C.skyBlue2, 0.45), mix(C.dusk, C.peach, 0.4), C.dawn];
const GOLD = [C.skyBlue, mix(C.dawn, C.skyBlue, 0.3), '#f8e6bd'];

export default {
  id: 'm16-garden',
  beats: [
    { v: 2, text: 'Wczesnym rankiem w pierwszy dzień tygodnia' },
    { v: 2, cont: true, text: 'przyszły do grobu, gdy słońce wzeszło.' },
    { v: 3, text: 'A mówiły między sobą:' },
    { v: 3, cont: true, text: '«Kto nam odsunie kamień od wejścia do grobu?»' },
    { v: 4 },
  ],
  cam: { x: [-1600, 600], y: [-20, 40], z: [0.8, 1.1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, NIGHT);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const starEl = hangL.add(`<g>${stars(c, { x0: -800, x1: 2400, y0: -400, y1: 380, n: 90 })}</g>`);
    const morning = hangL.add(`<g>${sparkle(c, 16)}</g>`);
    const moonEl = hanging(hangL, moon(c, 30), { x: 240, y: 170, len: 700 });
    const sunGlow = hangL.add(`<g opacity="0"><circle r="520" fill="url(#warm-glow)"/></g>`);
    const sunRays = hangL.add(`<g opacity="0">${rays(c, { n: 20, r0: 70, r1: 1300, spread: 0.05, color: '#fff1c8' })}</g>`);
    const sunEl = hanging(hangL, sun(c, 62, { rays: C.sunDeep }), { x: 900, y: 560, len: 900 });
    const birds = flock(S, hangL, 5, (cc) => bird(cc, { color: C.bird }), { y: 230, speed: 50, scale: 0.5 });

    const G = gardenSet(S, { hedge: true });
    const L = G.walkL;
    const W = WOMEN.map((w, i) => {
      const holdF = `<g transform="translate(2 8)">${spiceJar(c, [C.cream, C.blushVeil, C.linen2][i], [C.clay, C.plumRobe, C.teal2][i])}</g>`;
      const holdB = i === 1 ? `<g transform="translate(0 -2) scale(.8)">${lantern(c, { col: C.apricot })}</g>` : '';
      return { ...w, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...w.o, holdF, holdB }))) };
    });
    const lanternGlow = W[1].p.armB.querySelector('.glow');
    const talk = [0, 1, 2].map(() => L.add(`<g>${speech(c, talkDots(c), { w: 52, h: 34 })}</g>`));
    const ask = L.add(`<g>${thought(c, `<g transform="translate(8 14)">${pushIcon(c)}</g><g transform="translate(-36 -18) scale(1.1)">${GLYPH.q(c)}</g>`, { w: 150, h: 100 })}</g>`);
    const wonder = [0, 1, 2].map(() => L.add(`<g>${sparkle(c, 12)}</g>`));

    return (t, time) => {
      /* the sky: indigo → violet → rose → gold */
      skyKeys(sk, t, [[-0.5, NIGHT], [0.6, PRE], [1.3, ROSE], [2.2, GOLD]]);
      fade(starEl, 1 - es(t, 0.5, 1.6));
      pose(morning, { x: 1000, y: 180, s: 1 + Math.sin(time * 2) * 0.1, o: 1 - es(t, 1.2, 1.7) });
      swing(moonEl, 240 - es(t, 0, 1.5) * 60, 170 + es(t, 0, 1.6) * 360, time, 1, 0.6, 1);
      const rise = es(t, 0.9, 2.0, ease.out);
      const sy = lerp(600, 250, rise);
      swing(sunEl, 900, sy, time, 0.8, 0.5);
      pose(sunGlow, { x: 900, y: sy, s: 0.5 + rise * 0.8, o: es(t, 0.7, 1.4) * 0.9 });
      pose(sunRays, { x: 900, y: sy, s: 0.6 + rise * 0.5, r: t * 4, o: es(t, 1.1, 1.8) * 0.45 });
      birds(time, es(t, 1.2, 1.8));

      /* the walk along the garden path */
      // phone: at the look-up they come a few steps nearer, so they and the whole stone share the screen
      const lead = lerp(0.3, 0.45, es(t, 0, 1, ease.sine)) + es(t, 1, 2, ease.sine) * 0.17 + es(t, 2, 3.9, ease.sine) * 0.15 + es(t, 4, 4.3) * (S.portrait ? 0.085 : 0.02);
      const walking = t < 3.95 || (t > 4 && t < 4.3);
      const up = es(t, 4.02, 4.2);
      const heads = [];
      W.forEach((w) => {
        const [x, y] = along(GARDEN_PATH, lead - w.i * (S.portrait ? 0.055 - es(t, 4, 4.3) * 0.015 : 0.055));
        const s = pathS(y) * 1.02;
        const turnBack = w.i === 0 ? bump(t, 2.05, 2.95) : 0; // Mary Magdalene turns to talk to the others
        const say = bump(t, 2.05 + w.i * 0.25, 2.5 + w.i * 0.25);
        const armF = 22 + say * 16 + up * 10;
        const armB = w.i === 1 ? 30 - up * 10 : 8 + up * 90 * (w.i === 0 ? 1 : 0.6);
        w.p.set({ x, y, s, flip: turnBack > 0.5, walk: walking ? x * 0.05 + w.i : undefined, amt: 0.8, armF, armB, head: -up * 14 + bump(t, 3.1, 3.9) * 6, blink: blinkAt(time, w.seed) });
        upright(w.p, 'F', armF);
        if (w.i === 1) upright(w.p, 'B', armB);
        heads.push(headAt(x, y, s, turnBack > 0.5));
        w.cx = x;
      });
      fade(lanternGlow, 1 - es(t, 1.2, 1.9));

      /* v3a: they talk among themselves */
      talk.forEach((el, i) => {
        const [hx, hy] = heads[i];
        const b = es(t, 2.05 + i * 0.25, 2.2 + i * 0.25, ease.back) * (1 - es(t, 2.45 + i * 0.25, 2.55 + i * 0.25));
        pose(el, { x: hx + 16, y: hy - 22, s: b * 0.9, o: b > 0.01 ? 1 : 0 });
      });
      /* v3b: "Who will roll away the stone?" */
      const q = es(t, 3.05, 3.3, ease.back) * (1 - es(t, 3.95, 4.05));
      const [qx, qy] = heads[1];
      pose(ask, { x: qx + 20, y: qy - 26, s: q, o: q > 0.01 ? 1 : 0 });

      /* v4: they look up — the hedge flat is pulled away: the stone is already rolled back */
      const pull = es(t, 4.02, 4.35, ease.in);
      pose(G.hedge, { x: 1300 + pull * 900, y: 780 + pull * 60, ox: 1300, oy: 780, r: pull * 8, o: 1 - seg(t, 4.3, 4.35) });
      const shine = es(t, 4.15, 4.5);
      pose(G.doorGlow, { x: DOOR.x, y: DOOR.y, o: shine });
      pose(G.doorRays, { x: DOOR.x, y: DOOR.y - 60, s: 0.6 + shine * 0.4, r: Math.sin(time * 0.3) * 1.5, o: shine * 0.8 });
      pose(G.stone, { x: STONE.x, y: DOOR.y - STONE.r + 2 });
      wonder.forEach((el, i) => {
        const [hx, hy] = heads[i];
        const b = bump(t, 4.2 + i * 0.08, 4.8 + i * 0.08);
        pose(el, { x: hx + 20, y: hy - 30, s: b, r: time * 30, o: b });
      });

      const camL = lerp(-380, -170, es(t, 0, 1.2)) + es(t, 1, 3.6) * 140 + es(t, 4.0, 4.5) * 450;
      // phones see a narrow slice: follow the three women until they look up
      const gx = (W[0].cx + W[1].cx + W[2].cx) / 3;
      // (and at the start they are further left than -800 allowed; at the end the camera takes in the stone)
      S.cam.x = S.portrait ? lerp(Math.max(-1600, Math.min(440, (gx - 800) / 0.52 + 40)), camL + 170, es(t, 3.9, 4.5)) : camL;
      S.cam.y = 30 - es(t, 0.8, 2) * 30 + es(t, 4.0, 4.5) * 20;
      S.cam.z = (1 + es(t, 2, 3.6) * 0.04 + es(t, 4.0, 4.6) * 0.04) * (S.portrait ? 1 - es(t, 3.9, 4.5) * 0.25 : 1);
    };
  },
};
