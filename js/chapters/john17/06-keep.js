// J 17,11–13 — "I am no longer in the world, but they are in the world, and I am coming to You": a path of light
// unrolls from His rock up to the radiance and a spark climbs it, while the Eleven stay below on the ground. "Holy
// Father, keep them in Your name": an oval ring of light draws itself round the whole group, the Name hung over it;
// "that they may be one, as We are": a thread of light links every one of them to the next, and a beam joins Him to
// the light above. "While I was with them I kept them": a hanging plate shows the Shepherd at the gate of a round
// fold, His sheep safe inside; "none of them was lost, except the son of perdition": in the fold one place is left
// empty and dark — and at the foot of the rock a dark patch, a single lantern lying unlit; "that the Scripture might be
// fulfilled": a scroll unrolls and a line on it glows. "But now I am coming to You": the path shines again. "I say
// these things in the world, that they may have My joy made full in themselves": a heart in each of them fills
// with light to the brim.
import { es, ease, bump } from '../../core/anim.js';
import {
  slopeSet, eleven, jesusOn, put, lampK, headOf, chestOf, lifeFlames, fatherLight, goldWord, spark, lightPath, drawPath,
  lineD, curves, lower, ovalRing, drawRing, joyHeart, fillHeart, lantern, scrollOpen, strip, sheet, vis, kf, pose, fade, tr,
  mix, shade, C, JX, JY, NIGHT, HOLY, PRAY, PI, lerp,
} from './lib.js';

const RY = 150;
const PATH = (() => { const p = []; for (let i = 0; i <= 40; i++) { const u = i / 40; p.push([JX + 60 * Math.sin(u * PI * 1.6) * (1 - u * 0.7), lerp(JY - 20, RY + 50, u)]); } return p; })();

function fold(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 92, 40), 0.4, 5), mix(C.hillNear, C.sage3, 0.4));
  // the round stone wall with a gate at the bottom
  let stones = '';
  for (let i = 0; i < 30; i++) { const a = PI * 0.62 + (i / 29) * PI * 1.76; stones += c.cut(c.blob(Math.cos(a) * 72, Math.sin(a) * 60, 9, 6, 8, 0.25), 0.4, 3); }
  s.p(stones, C.rock2);
  return s.out();
}
function lamb(c, dark = false) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 0, 10, 7, 10, 0.25), 0.4, 3), dark ? '#3a3350' : C.linen);
  s.p(c.cut(c.ell(9, -3, 4, 3.4, 8), 0.2, 2), dark ? '#2a2438' : mix(C.inkSoft, C.stone2, 0.35));
  return s.out();
}
const FLOCK = [[-40, -30], [-18, -38], [6, -34], [30, -28], [-48, -6], [-24, -12], [2, -10], [26, -6], [-36, 16], [-12, 12], [14, 16], [38, 12]];

export default {
  id: 'j17-keep',
  beats: [
    { v: 11, text: 'Już nie jestem na świecie, ale oni są jeszcze na świecie, a Ja idę do Ciebie.' },
    { v: 11, cont: true, text: 'Ojcze Święty, zachowaj ich w Twoim imieniu, które Mi dałeś,' },
    { v: 11, cont: true, text: 'aby tak jak My stanowili jedno.' },
    { v: 12, text: 'Dopóki z nimi byłem, zachowywałem ich w Twoim imieniu, które Mi dałeś, i ustrzegłem ich,' },
    { v: 12, cont: true, text: 'a nikt z nich nie zginął z wyjątkiem syna zatracenia,' },
    { v: 12, cont: true, text: 'aby się spełniło Pismo.' },
    { v: 13, text: 'Ale teraz idę do Ciebie' },
    { v: 13, cont: true, text: 'i tak mówię, będąc jeszcze na świecie, aby moją radość mieli w sobie w całej pełni.' },
  ],
  cam: { x: [-20, 20], y: [-70, 30], z: [0.96, 1.14] },
  build(S) {
    const c = S.c;
    const P = slopeSet(S, { skyCols: NIGHT });
    const hiL = S.layer({ par: 0.08, sh: 3 });
    const high = hiL.add(`<g>${fatherLight(c, 54)}</g>`);

    // the path up, the beam, the links
    const thL = S.layer({ par: 0.3, sh: 0, flat: true });
    const path = thL.add(`<g>${lightPath(lineD(PATH), { w: 6, col: C.halo })}</g>`);
    const pathP = path.firstElementChild;
    const climber = thL.add(`<g>${spark(6)}</g>`);
    const beam = thL.add(`<g><path d="M-10 0L10 0L22 1L-22 1Z" fill="#fff3cf" opacity=".55"/></g>`);

    // hung: the Name, the fold, the scroll
    const hangL = S.layer({ par: 0.2, sh: 4 });
    const name = hangL.add(`<g><path d="M-60 -1600V-18M60 -1600V-18" stroke="rgba(233,210,160,.5)" stroke-width="1.2" fill="none"/>${goldWord(c, tr('Abba — Ojcze', 'Abba — Father'), { size: 26 })}</g>`);
    const plateM = sheet().p(c.cut(c.circ(0, 0, 112, 44), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 104, 44), 0.5, 5), C.cream).out();
    const plate = hangL.add(`<g><path d="M0 -1600V-112" stroke="rgba(233,210,160,.5)" stroke-width="1.2" fill="none"/>${plateM}${fold(c)}</g>`);
    const sheepEls = FLOCK.map((_, i) => hangL.add(`<g>${lamb(c)}</g>`));
    const hole = hangL.add(`<g><ellipse rx="11" ry="7" fill="#231d30" opacity=".75"/></g>`);
    const shepherd = hangL.add(`<g><circle cy="-30" r="30" fill="url(#halo-glow)"/>${sheet().p(c.cut([[-9, 0], [-7, -24], [7, -24], [9, 0]], 0.3, 3), C.linen).p(c.cut([[-8, -22], [2, -25], [8, -20], [0, -6], [-9, -2]], 0.3, 3), C.jesusMantle).p(c.cut(c.circ(0, -30, 6, 10), 0.2, 3), C.skin).p(c.ribbon([[12, 2], [12, -34], [10, -40], [5, -40]], 2.4), C.wood2).out()}</g>`);
    const scroll = hangL.add(`<g><path d="M-40 -1600V-34M40 -1600V-34" stroke="rgba(233,210,160,.5)" stroke-width="1.2" fill="none"/><g transform="scale(1.6)">${scrollOpen(c, 110, 60)}</g></g>`);
    const line = hangL.add(`<g><path d="M-60 0H60" stroke="${C.sunDeep}" stroke-width="5" stroke-linecap="round"/></g>`);
    const scrTag = hangL.add(`<g>${strip(c, tr('Pismo', 'Scripture'), { size: 16 })}</g>`);

    // the ring on the ground (behind them: back half; before them: front half)
    const ringBackL = S.layer({ par: 0.38, sh: 0, flat: true });
    const ringB = ringBackL.add(`<g>${ovalRing(c, 440, 74, 7, 44)}</g>`);
    const peopleL = S.layer({ par: 0.4, sh: 5 });
    const J = jesusOn(S, peopleL);
    const D = eleven(S, peopleL);
    // the one empty place: a dark patch, a lantern lying unlit
    const empty = peopleL.add(`<g><ellipse cx="0" cy="2" rx="42" ry="9" fill="#1a1626" opacity=".55"/><g transform="rotate(-78)">${lantern(c, { glowR: 1 })}</g></g>`);
    pose(empty, { x: 792, y: 686, s: 0.85 });
    const emptyFl = empty.querySelector('.lfl');
    fade(emptyFl, 0);
    const fx = S.layer({ par: 0.42, sh: 3 });
    const links = curves(fx, 11, { color: C.halo, w: 2 });
    const flames = lifeFlames(S, fx, D, 16);
    const hearts = D.map(() => fx.add(`<g>${joyHeart(c, 14)}</g>`));
    const burst = D.map(() => fx.add(`<g>${spark(3)}</g>`));
    // the links go round the group in order of x
    const ORDER = D.slice().sort((a, b) => a.x - b.x);

    return (t, time) => {
      const T = time;
      P.update(T);
      vis(high, { x: JX, y: RY, r: T * 1.5, o: 1 });

      /* v11a — I go to You: the path of light and a spark climbing it; v13a again */
      const pk = es(t, 0.1, 0.6) * (1 - es(t, 1.0, 1.2) * 0.7) + es(t, 6.05, 6.35) * 0.7;
      drawPath(pathP, Math.min(1, es(t, 0.1, 0.6) + es(t, 6.0, 6.1)));
      fade(path, pk);
      const cl = t < 3 ? es(t, 0.3, 0.95) : es(t, 6.15, 6.8);
      const cp = PATH[Math.round(cl * 40)];
      vis(climber, { x: cp[0], y: cp[1], s: 1, o: cl > 0.01 && cl < 0.99 ? 1 : 0 });

      /* v11b — keep them in Your name: the ring and the Name */
      const rk = es(t, 1.1, 1.7);
      vis(ringB, { x: JX, y: 664, sx: S.portrait ? 0.84 : 1, o: rk > 0.01 ? 1 - es(t, 7.0, 7.3) * 0.5 : 0 });
      drawRing(ringB, rk);
      lower(name, es(t, 1.05, 1.4, ease.out) * (1 - es(t, 2.9, 3.15, ease.in)), JX, 318, { len: 600, r: T ? Math.sin(T * 0.7) * 0.8 : 0 });

      /* v11c — one as We are one: links from each to the next; a beam between Him and the light */
      ORDER.forEach((m, i) => {
        const n = ORDER[i + 1];
        const [ax, ay] = headOf(m);
        if (!n) { links(i, [ax, ay], [ax, ay], 0, 0, 0); return; }
        const [bx, by] = headOf(n);
        const k = es(t, 2.05 + i * 0.04, 2.35 + i * 0.04);
        links(i, [ax, ay + 12], [bx, by + 12], 14, k, 0.9 * (1 - es(t, 3.0, 3.3) * 0.7));
      });
      const bk = es(t, 2.1, 2.4) * (1 - es(t, 3.0, 3.3));
      vis(beam, { x: JX, y: RY + 50, sx: 1, sy: Math.max(1, bk * (JY - 230 - RY)), o: bk });

      /* v12a — the Shepherd kept His fold; v12b — one place empty; v12c — the Scripture */
      const plk = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 5.95, 6.2, ease.in));
      const PX = 985, PY = 290 - (1 - plk) * 700, rr = T ? Math.sin(T * 0.7) * 1.2 : 0;
      lower(plate, plk, PX, 290, { len: 700, r: rr });
      vis(shepherd, { x: PX + 2, y: PY + 78, s: 1.1, o: plk > 0.01 ? 1 : 0 });
      FLOCK.forEach(([x, y], i) => {
        const gone = i === 7 ? es(t, 4.2, 4.6) : 0;
        vis(sheepEls[i], { x: PX + x, y: PY + y - 4, s: 1.1, o: plk > 0.01 ? 1 - gone : 0 });
      });
      vis(hole, { x: PX + FLOCK[7][0], y: PY + FLOCK[7][1] + 2, o: plk > 0.01 ? es(t, 4.3, 4.7) : 0 });
      fade(empty, es(t, 4.35, 4.8) * (1 - es(t, 7.0, 7.4) * 0.5));
      const sk = es(t, 5.05, 5.4, ease.out) * (1 - es(t, 5.95, 6.2, ease.in));
      lower(scroll, sk, 600, 290, { len: 700, r: T ? Math.sin(T * 0.6 + 1) : 0 });
      vis(line, { x: 600, y: 290 - (1 - sk) * 700 + 4, sx: es(t, 5.4, 5.7), o: sk > 0.01 ? 1 : 0 });
      vis(scrTag, { x: 600, y: 290 - (1 - sk) * 700 + 70, o: sk > 0.01 ? 1 : 0 });

      /* v13b — My joy made full in them */
      D.forEach((m, i) => {
        const [cx, cy] = chestOf(m);
        const d = Math.abs(m.x - JX) / 400;
        const k = es(t, 7.05 + d * 0.3, 7.6 + d * 0.3);
        vis(hearts[i], { x: cx + (m.flip ? -3 : 3), y: cy + 4, s: m.s * 1.1, o: es(t, 6.95, 7.1) });
        fillHeart(hearts[i], k);
        const b = es(t, 7.55 + d * 0.3, 7.9 + d * 0.3);
        vis(burst[i], { x: cx + (i % 2 ? 10 : -10) * b, y: cy - 20 - b * 40, s: 1 - b * 0.5, o: b > 0.01 && b < 0.99 ? 1 : 0 });
        const joy = es(t, 7.4, 7.8);
        put(m, T, { head: -8 - bump(t, 0.2, 1.0) * 14 - joy * 8 - bump(t, 6.1, 6.9) * 10, armF: 14 + joy * 30, armB: 6 + joy * 50 * (i % 2) });
        lampK(m, 0.85, joy * 0.3);
      });
      flames(1, T, { boost: es(t, 7.5, 7.9) * 0.6 });

      put(J, T, { head: PRAY.head - bump(t, 0.2, 1.0) * 6 - bump(t, 6.1, 6.9) * 6 + bump(t, 3.1, 4.0) * 14, armF: PRAY.armF + bump(t, 1.1, 1.9) * 20, armB: PRAY.armB + bump(t, 1.1, 1.9) * 16 });

      S.cam.x = kf(t, [[0, 0], [3, 0], [3.6, 10], [5.5, 10], [6.2, 0]]);
      S.cam.y = kf(t, [[0, -50], [1, -40], [1.6, 0], [2.5, -10], [3.5, -40], [5.5, -40], [6.4, -50], [7.2, 10], [8, 20]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.0], [2, 0.97], [3, 1.0], [4, 1.04], [6, 1.02], [7, 1.06], [8, 1.12]]);
    };
  },
};
