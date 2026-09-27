// J 14,2–5 — the Father's house of many rooms. A painted flat of the night: a hill of light, a path of light winding
// up it, and at the top — rising slowly behind the brow — a great house of cream and gold whose windows kindle one
// after another. "If it were not so, I would have told you": the great door swings open and its light runs down the
// path to the Eleven's feet. "I go to prepare a place for you": He climbs the path; at the house a small flame goes
// from window to window and under each lit window a name tag drops. "I will come again and take you to Myself": He
// comes back down to them and eleven small lights rise up the path into their windows. "You know the way": footprints
// of light shine on the path. Thomas steps out: "we do not know where You are going" — mist rolls over the hill and
// the house dims; "how can we know the way?" — the path forks in the fog, a signpost has lost its words.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { stars, olive, cypress } from '../../assets/nature.js';
import {
  TW, short, fatherHouse, winLight, doorLeaf, miniTag, blankSign, mistBank, polyAt, lightPath, drawPath, rayBurst, glowDisc,
  question, soulLight, kf, vis, headAt, hand, tr, PI,
} from './lib.js';

const HX = 800, HY = 418, SC = 0.85;
const ORDER = ['simonZ', 'thaddaeus', 'philip', 'andrew', 'peter', 'john', 'jesus', 'james', 'thomas', 'matthew', 'bartholomew', 'jamesA'];
// which window (index into fatherHouse().wins) is prepared for whom
const ROOM = { peter: 4, andrew: 5, james: 6, john: 7, philip: 8, matthew: 9, thomas: 10, jamesA: 11, thaddaeus: 12, bartholomew: 13, simonZ: 14 };
const SKY = ['#171b3e', '#2a2f62', '#5d5588'];

export default {
  id: 'j14-house',
  enter: 'fly',
  beats: [
    { v: 2, text: 'W domu Ojca mego jest mieszkań wiele.' },
    { v: 2, cont: true, text: 'Gdyby tak nie było, to bym wam powiedział.' },
    { v: 2, cont: true, text: 'Idę przecież przygotować wam miejsce.' },
    { v: 3, text: 'A gdy odejdę i przygotuję wam miejsce,' },
    { v: 3, cont: true, text: 'przyjdę powtórnie i zabiorę was do siebie, abyście i wy byli tam, gdzie Ja jestem.' },
    { v: 4 },
    { v: 5, text: 'Odezwał się do Niego Tomasz: «Panie, nie wiemy, dokąd idziesz.' },
    { v: 5, cont: true, text: 'Jak więc możemy znać drogę?»' },
  ],
  cam: { x: [-40, 140], y: [-440, 40], z: [1, 2] },
  build(S) {
    const c = S.c;
    const sk = sky(S, SKY);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -700, x1: 2300, y0: -700, y1: 480, n: 110 }));
    // the glow of the house (flat, behind everything)
    const glowL = S.layer({ par: 0.05, sh: 0, flat: true });
    glowL.add(`<g transform="translate(${HX} 290)">${glowDisc(520, 'halo-glow', 0.8)}${rayBurst(c, { n: 36, r0: 120, r1: 900, spread: 0.03, o: 0.16 })}</g>`);

    // the house (rises from behind the brow of the hill), its windows and its door
    const houseL = S.layer({ par: 0.4, sh: 4, pad: 400 });
    const H = fatherHouse(c);
    houseL.add(`<g transform="translate(${HX} ${HY}) scale(${SC})">${H.markup}</g>`);
    const W = H.wins.map((w, i) => ({ ...w, i, wx: HX + w.x * SC, wy: HY + w.y * SC, el: houseL.add(`<g>${winLight(c, w.w, w.h)}</g>`) }));
    const dw = H.door.w / 2;
    const doorGlow = houseL.add(`<g><circle r="120" fill="url(#warm-glow)"/><path d="${c.poly([[-dw, 0], [-dw, -H.door.h + dw], ...c.arc(0, -H.door.h + dw, dw, dw, PI, 2 * PI, 10), [dw, 0]])}" fill="#fff1c4"/></g>`);
    const leafL = houseL.add(`<g>${doorLeaf(c, -1, dw, H.door.h)}</g>`);
    const leafR = houseL.add(`<g>${doorLeaf(c, 1, dw, H.door.h)}</g>`);
    const tags = Object.entries(ROOM).map(([k, wi]) => ({ k, w: W[wi], el: houseL.add(`<g>${miniTag(c, short(k), { size: 11 })}</g>`) }));
    const spark = houseL.add(`<g>${soulLight(c, 5)}</g>`);

    // the hill, the path of light, a few trees
    const hillL = S.layer({ par: 0.4, sh: 3 });
    const hs = sheet();
    const top = [];
    for (let x = -1400; x <= 3200; x += 40) { const d = Math.max(0, Math.abs(x - HX) - 250); top.push([x, 422 + Math.pow(d / 420, 2) * 260 + c.rr(-2, 2)]); }
    hs.p(c.cut([...top, [3200, 1800], [-1400, 1800]], 0.8, 14), mix(C.hillNear, C.indigo, 0.52));
    const PATH = [...c.cbez([800, 752], [590, 736], [580, 640], [790, 614], 18), ...c.cbez([790, 614], [1010, 592], [1000, 498], [800, 428], 18).slice(1)];
    hs.p(c.ribbon(PATH, (u) => 64 - u * 50), mix(C.sand, C.halo, 0.35));
    hs.x(c.ribbon(PATH, (u) => 20 - u * 16), '#fff3cf', 'opacity=".55"');
    hs.p(c.cut([[-1400, 742], [3200, 742], [3200, 1800], [-1400, 1800]], 0.8, 18), mix(C.hillNear, C.indigo, 0.64));
    const tree = (x, y, sc) => olive(c, x, y, sc, { leaf: mix(C.olive, C.night, 0.5), leaf2: mix(C.sage, C.night, 0.5), trunk: mix(C.wood2, C.night, 0.45) });
    hillL.add(hs.out() + tree(470, 560, 0.7) + tree(1150, 520, 0.6) + cypress(c, 1060, 470, 110, mix(C.moss2, C.night, 0.5)) + cypress(c, 540, 480, 90, mix(C.moss2, C.night, 0.5)));
    // the stream of light from the door down to their feet, the footprints, the forks in the fog
    const flowL = S.layer({ par: 0.4, sh: 0, flat: true });
    const down = [...PATH].reverse();
    const stream = flowL.add(lightPath(`M${down.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}`, { w: 9, col: '#fff1c4' }));
    const steps = Array.from({ length: 12 }, (_, i) => {
      const u = 0.04 + i * 0.08;
      const [x, y] = polyAt(PATH, u);
      const s = 1 - u * 0.6;
      return { u, x: x + (i % 2 ? 7 : -7) * s, y, s, el: flowL.add(`<g><circle r="20" fill="url(#warm-glow)"/><path d="${c.poly(c.ell(0, 0, 9, 4.4, 10))}" fill="${C.ochre}"/><path d="${c.poly(c.ell(1, -0.5, 5, 2.2, 8))}" fill="#fff3cf"/></g>`) };
    });
    const forkL = S.layer({ par: 0.4, sh: 0, flat: true });
    const fcol = mix(C.sand, C.lavender, 0.5);
    forkL.add(`<path d="${c.ribbon([[700, 640], [560, 600], [430, 610]], 12) + c.ribbon([[930, 560], [1080, 520], [1230, 540]], 10) + c.ribbon([[640, 700], [520, 690], [400, 720]], 14) + c.ribbon([[880, 500], [960, 470], [1100, 450]], 8) + c.ribbon([[980, 590], [1120, 600], [1250, 640]], 12)}" fill="${fcol}" opacity=".7"/>`);

    // the walker on the path
    const walkL = S.layer({ par: 0.4, sh: 4 });
    const walker = S.puppet(walkL.add(person(c, CAST.jesus)));
    const mistL = S.layer({ par: 0.41, sh: 0, flat: true, pad: 320 });
    mistL.add(`<g transform="translate(1500 560)">${mistBank(c, { w: 2200, h: 200 })}</g><g transform="translate(1300 450)">${mistBank(c, { w: 1600, h: 120 })}</g>`);
    const sign = mistL.add(`<g>${blankSign(c, 110)}</g>`);
    const arms = sign.querySelector('.arms');

    // the Eleven and Jesus at the foot of the hill
    const act = S.layer({ par: 0.44, sh: 5 });
    const G = 742;
    const cast = ORDER.map((k, i) => {
      const x = 800 + (i - 6) * 56;
      const o = k === 'jesus' ? CAST.jesus : TW[k];
      return { k, x, i, flip: x > 800, p: S.puppet(act.add(person(c, o))), s: k === 'jesus' ? 0.72 : 0.62, seed: c.rr(0, 9) };
    });
    const J = cast.find((m) => m.k === 'jesus'), TH = cast.find((m) => m.k === 'thomas');
    const fx = S.layer({ par: 0.44, sh: 4 });
    const rise = cast.filter((m) => m.k !== 'jesus').map((m) => ({ m, el: fx.add(`<g>${soulLight(c, 7)}</g>`) }));
    const qs = [TH, cast[1], cast[4], cast[9], cast[10]].map((m) => ({ m, el: fx.add(`<g>${question(c)}</g>`) }));

    return (t, time) => {
      const T = time;
      /* v2a — the house rises and its windows kindle */
      const up = es(t, 0.02, 0.6, ease.out);
      houseL.shift(0, (1 - up) * 380);
      houseL.fade(es(t, 0.02, 0.25));
      const dimmed = es(t, 6.1, 6.5) * (1 - es(t, 7.9, 8) * 0);
      glowL.fade(up * (1 - dimmed * 0.6));
      W.forEach((w) => {
        const prepared = Object.values(ROOM).includes(w.i);
        // the four wing windows and all rooms kindle faintly first (many rooms); the Eleven's rooms fully later
        const faint = es(t, 0.3 + w.i * 0.03, 0.45 + w.i * 0.03);
        const mine = prepared ? es(t, 3.08 + (w.i - 4) * 0.055, 3.18 + (w.i - 4) * 0.055) : 1;
        const o = prepared ? faint * 0.72 + mine * 0.28 : faint;
        vis(w.el, { x: w.wx, y: w.wy, s: SC, o: o * (1 - dimmed * 0.5) });
      });
      /* v2b — the door opens; its light runs down the path */
      const open = es(t, 1.1, 1.4) * (1 - es(t, 6.1, 6.4) * 0.6);
      const dx = HX, dy = HY - 30 * SC;
      vis(doorGlow, { x: dx, y: dy, s: SC, o: open });
      pose(leafL, { x: dx - H.door.w / 2 * SC, y: dy, s: SC, sx: 1 - open * 0.85 });
      pose(leafR, { x: dx + H.door.w / 2 * SC, y: dy, s: SC, sx: 1 - open * 0.85 });
      drawPath(stream, es(t, 1.2, 1.8));
      fade(stream, 1 - es(t, 2.9, 3.2) * 0.6 + es(t, 5.05, 5.3) * 0.6 - dimmed * 0.8);
      /* v2c / v3 — He climbs to the house, prepares, comes back */
      const upU = es(t, 2.08, 2.92, ease.inOut), downU = es(t, 4.02, 4.42, ease.inOut);
      const u = upU * (1 - downU);
      const onPath = seg(t, 2.02, 2.08) * (1 - seg(t, 4.42, 4.48));
      const [wx, wy, dir] = polyAt(PATH, u);
      const moving = (upU > 0 && upU < 1) || (downU > 0 && downU < 1);
      walker.set({ x: wx, y: wy, s: lerp(0.68, 0.22, u), flip: downU > 0 ? dir > 0 : dir < 0, o: onPath, walk: moving ? t * 30 : undefined, armF: 14 + es(t, 3.05, 3.3) * (1 - downU) * 60, armB: 10, blink: blinkAt(T) });
      // the flame goes from window to window
      const sp = seg(t, 3.02, 3.7);
      const order = Object.values(ROOM);
      const at = Math.min(order.length - 1, Math.floor(sp * order.length)), f = sp * order.length - at;
      const w0 = W[order[at]], w1 = W[order[Math.min(order.length - 1, at + 1)]];
      vis(spark, { x: lerp(w0.wx, w1.wx, ease.io(f)), y: lerp(w0.wy, w1.wy, ease.io(f)) - 24 - Math.sin(f * PI) * 16, s: 1 + (T ? Math.sin(T * 6) * 0.08 : 0), o: sp > 0 && sp < 1 ? 1 : 0 });
      tags.forEach(({ w, el }, n) => {
        const k = es(t, 3.1 + n * 0.055, 3.24 + n * 0.055, ease.back);
        vis(el, { x: w.wx, y: w.wy + 12 + (1 - k) * -20, s: SC, r: (T ? Math.sin(T * 1.2 + n) * 3 : 0), o: k > 0.02 ? 1 - dimmed * 0.5 : 0 });
      });

      /* people at the foot of the hill */
      const back = es(t, 4.4, 4.5);
      const thomas = es(t, 6.05, 6.35);
      cast.forEach((m) => {
        const [hx] = [m.x];
        if (m.k === 'jesus') {
          const here = 1 - seg(t, 2.0, 2.06) + back;
          const embrace = es(t, 4.45, 4.7) * (1 - es(t, 5.0, 5.2));
          const point = es(t, 5.05, 5.3);
          m.p.set({ x: m.x, y: G + 4, s: m.s, o: Math.min(1, here), flip: thomas > 0.5, armF: 20 + bump(t, 1.05, 1.9) * 50 + embrace * 70 + point * 60 * (1 - thomas) + thomas * 40, armB: 10 + bump(t, 1.05, 1.9) * 30 + embrace * 110 + point * 30, head: -bump(t, 0.1, 0.9) * 12 - point * 14, blink: blinkAt(T) });
          return;
        }
        const lookUp = Math.max(bump(t, 0.05, 1.0), es(t, 2.0, 2.3) * (1 - es(t, 4.4, 4.6)), es(t, 5.1, 5.4) * (1 - thomas));
        const toward = m.x < 800 ? 1 : -1;
        let x = m.x, y = G, armF = 14, armB = 8, head = -lookUp * 14, walk;
        if (m.k === 'thomas') {
          x = lerp(m.x, 868, thomas); y = G + thomas * 28;
          armF = 14 + thomas * 70 + es(t, 7.05, 7.3) * -30; armB = 8 + thomas * 50 + es(t, 7.05, 7.3) * 90;
          head = -lookUp * 14 - thomas * 6 + es(t, 7.05, 7.3) * 10;
          walk = thomas > 0 && thomas < 1 ? t * 20 : undefined;
        } else {
          head += es(t, 7.05, 7.3) * 8;
        }
        m.p.set({ x, y, s: m.s * (m.k === 'thomas' ? 1 + thomas * 0.08 : 1), flip: m.k === 'thomas' ? true : toward < 0, armF, armB, head, walk, blink: blinkAt(T, m.seed) });
      });
      // eleven small lights rise up the path to their rooms
      rise.forEach(({ m, el }, n) => {
        const k = es(t, 4.5 + n * 0.03, 4.95 + n * 0.03, ease.inOut);
        const w = W[ROOM[m.k]];
        const [px, py] = headAt(m.x, G, m.s, m.flip);
        const x = lerp(px, w.wx, k), y = lerp(py - 30, w.wy - 20, k) - Math.sin(k * PI) * 80;
        vis(el, { x, y, s: 1 - k * 0.4, o: k > 0.01 && k < 0.99 ? 1 : 0 });
      });
      /* v4 — footprints of light on the path */
      steps.forEach((st, i) => { const k = es(t, 5.1 + i * 0.04, 5.2 + i * 0.04); vis(st.el, { x: st.x, y: st.y, s: st.s * (0.9 + k * 0.5), o: k * (1 - dimmed * 0.8) }); });
      /* v5 — mist and the forks */
      mistL.fade(dimmed);
      mistL.shift(-300 * (1 - dimmed) + (T ? Math.sin(T * 0.3) * 20 : 0) * dimmed, 0);
      const forks = es(t, 7.05, 7.4);
      forkL.fade(forks * 0.8);
      vis(sign, { x: 1090 + 300 * (1 - dimmed), y: 598, o: forks });
      pose(arms, { x: 0, y: -96, r: (t - 7) * 60 + (T ? Math.sin(T * 0.7) * 6 : 0) });
      qs.forEach(({ m, el }, i) => {
        const k = (i === 0 ? es(t, 6.2, 6.4, ease.back) : es(t, 7.1 + i * 0.05, 7.3 + i * 0.05, ease.back));
        const x = m.k === 'thomas' ? lerp(m.x, 868, thomas) : m.x;
        const [hx, hy] = m.k === 'thomas' ? headAt(x, G + thomas * 28, m.s * (1 + thomas * 0.08), true) : headAt(x, G, m.s, m.flip);
        vis(el, { x: hx + (i % 2 ? -8 : 8), y: hy - 44, s: k * 0.7, r: T ? Math.sin(T * 1.4 + i) * 6 : 0, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 0], [5.5, 0], [6.3, 90], [7.2, 40], [8, 20]]);
      S.cam.y = kf(t, [[0, -60], [0.8, -40], [1.5, 0], [2.1, -40], [2.9, -300], [3.1, -425], [3.95, -425], [4.3, -60], [4.6, 0], [5.3, -40], [6, 0], [8, -20]]);
      S.cam.z = kf(t, [[0, 1.0], [1.5, 1.0], [2.1, 1.02], [2.9, 1.5], [3.1, 2], [3.95, 2], [4.3, 1.1], [4.6, 1.0], [6.2, 1.12], [8, 1.06]]);
    };
  },
};
