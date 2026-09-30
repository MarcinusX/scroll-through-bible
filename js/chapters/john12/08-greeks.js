// J 12,20–23 — the Court of the Gentiles at the feast, pilgrims bowing towards the sanctuary. Three Greeks come in
// — short cloaks pinned at the shoulder, a wide sun-hat, a fillet — and a little plate of a ship over the sea comes
// down. They go up to Philip of Bethsaida: "Sir, we want to see Jesus" (an open eye in the bubble). Philip goes and
// tells Andrew, and the two of them go and tell Jesus. And Jesus answers: "The hour has come" — an hourglass comes
// down from the flies, its last grains run out, and a slow radiance opens behind Him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { courtStage, CT, DAY, PHILIP, ANDREW, greek, man, crowdPerson, people, place, bubble, nameTag, hanging, swing, kf, vis, hangGlass, shipIcon, eyeIcon, glory, headAt, voiceRings, tr, PI, FONT } from './lib.js';

export default {
  id: 'j12-greeks',
  beats: [
    { v: 20 },
    { v: 21, text: 'Oni więc przystąpili do Filipa, pochodzącego z Betsaidy Galilejskiej, i prosili go mówiąc:' },
    { v: 21, cont: true, text: '«Panie, chcemy ujrzeć Jezusa».' },
    { v: 22, text: 'Filip poszedł i powiedział Andrzejowi.' },
    { v: 22, cont: true, text: 'Z kolei Andrzej i Filip poszli i powiedzieli Jezusowi.' },
    { v: 23 },
  ],
  cam: { x: [-220, 80], y: [-80, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const st = courtStage(S, { skyCols: DAY });
    const F = CT.FLOOR;
    const glowEl = st.glowL.add(`<g>${glory(c, 520, 26)}</g>`);
    // pilgrims bowing towards the sanctuary
    const pil = people(S, st.back, [[560, 0], [690, 1], [1150, 2], [1230, 3]].map(([x, i]) => ({ x, y: F - 58, s: 0.7, flip: x > 800, look: i % 2 ? crowdPerson(c) : man(c) })), 'pil');
    const greeks = [0, 1, 2].map((i) => ({ i, p: S.puppet(st.act.add(greek(c, i))) }));
    const philip = S.puppet(st.act.add(person(c, PHILIP)));
    const andrew = S.puppet(st.act.add(person(c, ANDREW)));
    const others = people(S, st.act, [{ x: 1000, y: F + 4, s: 0.96, flip: true, look: CAST.peter }, { x: 1070, y: F - 2, s: 0.94, flip: true, look: CAST.john }], 'd');
    const jesus = S.puppet(st.act.add(person(c, CAST.jesus)));
    const fx = st.fx;
    const tagG = hanging(fx, nameTag(c, tr('Grecy', 'Greeks'), { size: 17 }), { x: 460, y: 400, len: 600 });
    const ship = hanging(fx, `${sheet().p(c.cut(c.circ(0, 0, 66, 34), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 60, 34), 0.5, 5), mix(C.skyBlue, C.cream, 0.5)).out()}<g transform="translate(0 12)">${shipIcon(c)}</g>`, { x: 580, y: 250, len: 700 });
    const tagP = hanging(fx, nameTag(c, [tr('Filip', 'Philip'), tr('z Betsaidy', 'of Bethsaida')], { size: 15 }), { x: 650, y: 420, len: 600 });
    const tagA = hanging(fx, nameTag(c, tr('Andrzej', 'Andrew'), { size: 15 }), { x: 780, y: 420, len: 600 });
    const ask = fx.add(`<g>${bubble(c, [tr('Panie, chcemy', 'Sir, we want'), tr('ujrzeć Jezusa', 'to see Jesus')], { size: 18, tail: -1 })}<g transform="translate(92 -50)">${eyeIcon(c, true, 18)}</g></g>`);
    const whisper = fx.add(`<g>${bubble(c, [tr('Grecy chcą', 'Greeks want'), tr('Go ujrzeć!', 'to see Him!')], { size: 16, tail: -1 })}</g>`);
    const tell = fx.add(`<g>${bubble(c, [tr('Chcą Cię ujrzeć…', 'They want to see You…')], { size: 16, tail: -1 })}</g>`);
    const hgL = S.layer({ par: 0.3, sh: 5 });
    const hg = hangGlass(hgL, c, 140);
    const hourTag = hanging(hgL, nameTag(c, [tr('Nadeszła', 'The hour'), tr('godzina', 'has come')], { size: 16 }), { x: 820, y: 330, len: 600 });
    const vL = S.layer({ par: 0.52, sh: 2 });
    const rings = voiceRings(vL, c, { n: 3, r: 34, w: 5, color: shade(C.haloRim, 0.1) });
    st.front();

    return (t, time) => {
      const T = time;
      swing(st.sunEl, 1220, 150, T, 1, 0.7);
      swing(st.cl1, 470, 140, T, 1.2, 0.6, 1);
      pil.forEach((m, i) => place(m, T, { lean: 8 + bump(t, 0.1 + i * 0.05, 0.9) * 14, head: 10, armF: 30 + bump(t, 0.1, 0.9) * 40, armB: 20 }));
      /* v20 — Greeks among the worshippers */
      const gin = es(t, 0.1, 0.8, ease.out);
      const toP = es(t, 1.05, 1.5);
      greeks.forEach((g) => {
        const x = lerp(160 + g.i * 70, 380 + g.i * 70, gin) + toP * 60;
        const walking = (gin > 0 && gin < 1) || (toP > 0 && toP < 1);
        g.p.set({ x, y: F + [4, -6, 8][g.i], s: 0.96, walk: walking ? x * 0.06 + g.i : undefined, armF: 12 + (g.i === 2 ? bump(t, 2.05, 2.9) * 70 : 0) + (g.i === 1 ? bump(t, 1.4, 1.9) * 30 : 0), armB: g.i === 2 ? bump(t, 2.1, 2.9) * 40 : 0, head: -2, blink: blinkAt(T, g.i + 2) });
      });
      const gk = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      swing(tagG, 460, 400 - (1 - gk) * 600, gk > 0.001 ? T : 0, 1.2, 0.8); fade(tagG, gk > 0.001 ? 1 : 0);
      const sk = es(t, 0.4, 0.75, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      swing(ship, 580, 240 - (1 - sk) * 700, sk > 0.001 ? T : 0, 1.4, 0.7, 2); fade(ship, sk > 0.001 ? 1 : 0);
      /* v21 — to Philip */
      const p1 = es(t, 3.05, 3.55);            // Philip goes to Andrew
      const p2 = es(t, 4.05, 4.6);             // both go to Jesus
      const px = lerp(lerp(640, 700, p1), 720, p2);
      philip.set({ x: px, y: F + 6, s: 0.98, flip: t < 2.95, walk: (p1 > 0 && p1 < 1) || (p2 > 0 && p2 < 1) ? px * 0.06 : undefined, armF: 12 + bump(t, 3.5, 3.95) * 50 + bump(t, 4.6, 4.95) * 50, armB: bump(t, 3.55, 3.95) * 30, head: bump(t, 2.1, 2.8) * 4, blink: blinkAt(T, 6) });
      const ax = lerp(770, 780, p2);
      andrew.set({ x: ax, y: F - 4, s: 0.96, flip: t < 3.4, walk: p2 > 0 && p2 < 1 ? ax * 0.06 + 1 : undefined, armF: 12 + bump(t, 4.6, 4.95) * 60, head: bump(t, 3.5, 3.95) * -8, blink: blinkAt(T, 7) });
      const pk = es(t, 1.1, 1.4, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      swing(tagP, 650, 420 - (1 - pk) * 600, pk > 0.001 ? T : 0, 1.2, 0.8, 1); fade(tagP, pk > 0.001 ? 1 : 0);
      const ak = es(t, 3.2, 3.5, ease.out) * (1 - es(t, 3.95, 4.15, ease.in));
      swing(tagA, 800, 420 - (1 - ak) * 600, ak > 0.001 ? T : 0, 1.2, 0.8, 2); fade(tagA, ak > 0.001 ? 1 : 0);
      const qk = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.9, 3.05));
      vis(ask, { x: 610, y: 470, s: qk, o: qk > 0.01 ? 1 : 0 });
      const wk = es(t, 3.4, 3.55, ease.back) * (1 - es(t, 3.95, 4.05));
      vis(whisper, { x: 760, y: 470, s: wk, o: wk > 0.01 ? 1 : 0 });
      const tk = es(t, 4.55, 4.7, ease.back) * (1 - es(t, 4.98, 5.08));
      vis(tell, { x: 820, y: 470, s: tk, o: tk > 0.01 ? 1 : 0 });
      /* Jesus */
      const hour = es(t, 5.05, 5.5);
      jesus.set({ x: 880, y: F + 8, s: 1.04, flip: true, armF: 16 + bump(t, 0.2, 1.5) * 30 + hour * 50, armB: 10 + hour * 100, head: -hour * 10 + bump(t, 4.6, 5.0) * 4, blink: blinkAt(T) });
      others.forEach((m) => place(m, T, { head: hour * -6, armF: 10 }));
      const [jhx, jhy] = headAt(880, F + 8, 1.04, true);
      rings(jhx - 14, jhy + 6, bump(t, 5.1, 5.95), T, { dir: -1 });
      /* v23 — the hour has come */
      const hk = es(t, 5.05, 5.35, ease.out);
      const level = 0.22 * (1 - es(t, 5.3, 5.75));
      hg.set(880, 250 - (1 - hk) * 600, level, level > 0.005 ? 1 : 0, hk > 0.001 ? T : 0, hk > 0.001 ? 1 : 0);
      const tg = es(t, 5.6, 5.85, ease.back);
      swing(hourTag, 1040, 230 - (1 - tg) * 600, tg > 0.001 ? T : 0, 1.2, 0.8); fade(hourTag, tg > 0.001 ? 1 : 0);
      const glo = es(t, 5.55, 5.95);
      pose(glowEl, { x: 880, y: 360, s: 0.4 + glo * 0.8, r: T ? T * 2 : 0, o: glo * 0.8 });

      // phone: the camera starts further left, with the Greeks, and follows the message to Jesus
      S.cam.x = S.portrait ? kf(t, [[0, -220], [1, -180], [2.1, -180], [3.1, -100], [4.1, -60], [5.0, 20], [6, 40]]) : kf(t, [[0, -100], [1, -60], [2.1, -60], [3.1, -20], [4.1, 20], [5.0, 40], [6, 50]]);
      S.cam.y = kf(t, [[0, 0], [2, 10], [5.0, 0], [5.6, -50], [6, -50]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.06], [2.1, 1.1], [3.1, 1.06], [4.6, 1.08], [5.6, 1.02]]);
    };
  },
};
