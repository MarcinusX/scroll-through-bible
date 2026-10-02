// Mt 5,13 — "You are the salt of the earth": Jesus lifts a bowl of white salt and scatters it; it glitters on
// each of the four, and falls like sparks on a round painted earth that hangs above them. "If the salt loses
// its flavour…": the salt in His bowl goes dull and grey, and the earth's sparkle goes out — with what could it be
// salted? "Good for nothing but to be thrown out and trodden down": a plate of a village street comes down; a
// woman tips grey salt out of her door onto the road, and people walk over it.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { house } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { mountSet, SKY, JX, JY, JS, teach, medallion, picture, paintedLand, hand, saltBowl, saltGrains, sparkle, question, folk, LOOK, PI, DY, STRING } from './lib.js';

const EARTH = [800, 290];
const PLATE = [800, 310];

export default {
  id: 'mt5-salt',
  beats: [
    { v: 13, text: 'Wy jesteście solą dla ziemi.' },
    { v: 13, cont: true, text: 'Lecz jeśli sól utraci swój smak, czymże ją posolić?' },
    { v: 13, cont: true, text: 'Na nic się już nie przyda, chyba na wyrzucenie i podeptanie przez ludzi.' },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const set = mountSet(S, { skyCols: SKY.day, sunXY: [1300, 120] });

    /* the earth: a round painted land hung above them */
    const fly = S.layer({ par: 0.3, sh: 6 });
    const land = paintedLand(c, { w: 240, h: 240, skyCol: mix(C.skyBlue, C.cream, 0.3), far: C.hillMid, near: mix(C.hillNear, C.wheatGreen, 0.3), horizon: -6 }) +
      `<g transform="translate(-40 30)">${house(c, -20, 0, 40, 30)}${house(c, 30, 8, 34, 26)}</g>` +
      `<path d="${c.ribbon([[-120, 70], [-40, 52], [40, 60], [120, 44]], 6)}" fill="${C.wheat}" opacity=".8"/><path d="${c.ribbon([[-120, 96], [-30, 80], [60, 90], [120, 78]], 6)}" fill="${C.wheat2}" opacity=".7"/>`;
    const earth = fly.add(`<g>${medallion(c, S.id('earth'), 110, land, { rim: C.ochre })}</g>`);
    const glints = Array.from({ length: 9 }, (_, i) => ({ i, a: c.rr(0, PI * 2), r: c.rr(20, 90), el: fly.add(`<g>${sparkle(c, 15)}</g>`) }));

    /* the street plate (beat 2) */
    const PW = 520, PH = 240;
    const streetIn = (() => {
      const s = sheet();
      s.p(c.poly(c.rect(-PW / 2 - 10, -PH / 2 - 10, PW + 20, PH + 20)), mix(C.dawn, C.skyBlue, 0.5));
      s.p(c.cut([[-PW / 2 - 10, 40], [PW / 2 + 10, 34], [PW / 2 + 10, PH / 2 + 10], [-PW / 2 - 10, PH / 2 + 10]], 0.6, 10), mix(C.sand, C.stone, 0.35));
      s.x(c.ribbon([[-PW / 2, 58], [PW / 2, 52]], 1.4), shade(C.sand, -0.2), 'opacity=".5"');
      return s.out() + house(c, -236, 40, 130, 130, { stairs: false }) + house(c, 100, 34, 100, 96, { stairs: false }) + house(c, 206, 36, 70, 80, { stairs: false });
    })();
    const plateEl = fly.add(`<g>${picture(c, S.id('street'), PW, PH, streetIn)}</g>`);
    const heap = fly.add(`<g><path d="${c.cut(c.blob(0, 0, 40, 9, 12, 0.25), 0.8, 4)}" fill="${mix(C.stone2, C.rock2, 0.4)}"/>${saltGrains(c, 30, 40, mix(C.stone, C.rock2, 0.3))}</g>`);
    const toss = fly.add(`<g>${saltGrains(c, 22, 18, mix(C.stone2, C.rock2, 0.4))}</g>`);
    const dust = [0, 1, 2].map(() => fly.add(`<g>${saltGrains(c, 8, 10, mix(C.stone2, C.rock2, 0.4))}</g>`));
    const wife = S.puppet(fly.add(person(c, { ...LOOK.girl, robe: C.ochreRobe, veil: C.stone })));
    const tossBowl = fly.add(`<g>${saltBowl(c, 40, { dull: true })}</g>`);
    const WALK = [0, 1, 2].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(fly.add(person(c, folk(c, i !== 1)))) }));

    /* Jesus and the four; the bowl of salt */
    const { jesus, four } = set.circle();
    const P = set.L;
    const bowlGood = P.add(`<g><circle cy="-30" r="56" fill="url(#halo-glow)"/>${saltBowl(c, 64)}</g>`);
    const bowlDull = P.add(`<g>${saltBowl(c, 64, { dull: true })}</g>`);
    const q = P.add(`<g>${question(c)}</g>`);
    const pinch = P.add(`<g>${saltGrains(c, 16, 20)}</g>`);
    const spray = four.map(() => P.add(`<g>${saltGrains(c, 10, 16)}</g>`));
    const gl4 = four.map((f) => P.add(`<g>${sparkle(c, 16)}</g>`));
    set.front();

    return (t, time) => {
      const T = time;
      set.update(T);

      /* beat 0 — the salt of the earth */
      const lift = es(t, 0.05, 0.3) * (1 - es(t, 2.05, 2.3) * 0.6);
      const throwK = bump(t, 0.28, 0.5);
      const a = 40 + lift * 42 + throwK * 30;
      teach(jesus, T, { armF: a - 28, armB: 10 + throwK * 90, head: -4 - throwK * 6 + es(t, 1.1, 1.4) * 10 * (1 - es(t, 2.1, 2.3)), blink: blinkAt(T, 1) });
      const [hx, hy] = hand(JX, JY, JS, false, a, 0, DY.sit);
      const dull = es(t, 1.08, 1.4);
      pose(bowlGood, { x: hx + 12, y: hy + 14, s: 1, o: 1 - dull });
      pose(bowlDull, { x: hx + 12, y: hy + 14, s: 1, o: dull });
      // the pinch arcs up and spreads over the four and up to the earth
      const fl = es(t, 0.32, 0.62, (x) => x);
      pose(pinch, { x: lerp(hx + 12, EARTH[0], fl), y: lerp(hy - 30, EARTH[1] + 40, fl) - Math.sin(fl * PI) * 60, s: 0.6 + fl, r: fl * 90, o: fl > 0.01 && fl < 0.99 ? 1 : 0 });
      spray.forEach((sp, i) => {
        const f = four[i];
        const k = es(t, 0.36 + i * 0.04, 0.62 + i * 0.04, (x) => x);
        pose(sp, { x: lerp(hx + 12, f.hx, k), y: lerp(hy - 30, f.hy - 40, k) - Math.sin(k * PI) * 80, s: 0.6 + k * 0.4, o: k > 0.01 && k < 0.99 ? 1 : 0 });
      });
      gl4.forEach((g, i) => {
        const f = four[i];
        const k = es(t, 0.6 + i * 0.04, 0.72 + i * 0.04, ease.back) * (1 - es(t, 1.3, 1.5));
        pose(g, { x: f.hx + f.dir * 22, y: f.hy - 30, s: k, r: T * 30 + i * 20, o: k > 0.01 ? 1 : 0 });
      });

      /* the earth: comes down (beat 0), sparkles; the sparkle dies (beat 1); lifts away (beat 2) */
      const ek = es(t, -0.2, 0.25, ease.out) * (1 - es(t, 2.02, 2.3));
      const ey = lerp(-500, EARTH[1], ek);
      pose(earth, { x: EARTH[0], y: ey, o: ek > 0.01 ? 1 : 0 });
      glints.forEach((g) => {
        const k = es(t, 0.56 + g.i * 0.02, 0.7 + g.i * 0.02, ease.back) * (1 - es(t, 1.35 + g.i * 0.02, 1.55 + g.i * 0.02));
        pose(g.el, { x: EARTH[0] + Math.cos(g.a) * g.r, y: ey + Math.sin(g.a) * g.r * 0.9, s: k * (0.8 + Math.sin(T * 3 + g.i) * 0.15), r: T * 20, o: k > 0.01 ? 1 : 0 });
      });

      /* beat 1 — the salt goes dull: with what shall it be salted? */
      const qk = es(t, 1.4, 1.6, ease.back) * (1 - es(t, 2.0, 2.2));
      pose(q, { x: hx + 40, y: hy - 70 + Math.sin(T * 2) * 3, s: qk * 0.9, r: Math.sin(T * 1.6) * 6, o: qk > 0.01 ? 1 : 0 });

      /* beat 2 — thrown out and trodden down (the street plate) */
      const pk = es(t, 2.12, 2.4, ease.out);
      const px = PLATE[0], py = lerp(-500, PLATE[1], pk);
      const on = pk > 0.01 ? 1 : 0;
      const PS = S.portrait ? 1.0 : 1.16;   // phone: the street plate a little smaller, its frame clear of the progress thread
      pose(plateEl, { x: px, y: py, s: PS, o: on });
      const L = (lx, ly) => [px + lx * PS, py + ly * PS];
      // the woman at her door tips out the salt
      const tip = es(t, 2.34, 2.5);
      const [wx, wy] = L(-150, 50);
      wife.set({ x: wx, y: wy, s: 0.56 * PS, armF: 40 + tip * 50, armB: 10 + tip * 30, head: 6, o: on, blink: blinkAt(T, 4) });
      const [bx, by] = L(-150 + 36, 50 - 78 - tip * 12);
      pose(tossBowl, { x: bx, y: by, s: 0.8 * PS, r: tip * 70, o: on });
      const tk = es(t, 2.42, 2.56, (x) => x);
      const [tx, ty] = L(lerp(-100, -40, tk), lerp(-30, 64, tk) - Math.sin(tk * PI) * 30);
      pose(toss, { x: tx, y: ty, s: PS, o: on * (tk > 0.01 && tk < 0.99 ? 1 : 0) });
      const [hx2, hy2] = L(-40, 70);
      pose(heap, { x: hx2, y: hy2, s: PS, sy: 0.5, o: on * es(t, 2.5, 2.56) });
      // passers-by walk over it
      WALK.forEach((w) => {
        const k = es(t, 2.36 + w.i * 0.1, 2.9 + w.i * 0.06, (x) => x);
        const lx = lerp(230, -230, k);
        const [x, y] = L(lx, 86 + w.i * 4);
        const edge = Math.min(1, (230 - Math.abs(lx)) / 30);
        const onHeap = Math.max(0, 1 - Math.abs(lx + 40) / 40);
        const [dx, dy] = L(lx, 80);
        pose(dust[w.i], { x: dx, y: dy - onHeap * 10, s: (0.5 + onHeap * 0.5) * PS, o: on * onHeap * (k > 0 && k < 1 ? 1 : 0) });
        w.p.set({ x, y, s: 0.5 * PS, flip: true, walk: k > 0 && k < 1 ? lx * 0.12 : undefined, o: on * Math.max(0, edge) * (k > 0 ? 1 : 0), blink: blinkAt(T, w.seed) });
      });

      /* the four: look at the salt, up at the earth, down at the dull bowl */
      four.forEach((f) => {
        const look = es(t, 0.5, 0.8) * (1 - es(t, 1.9, 2.2));
        f.p.set({ x: f.x, y: f.y, s: f.s, flip: f.flip, lean: f.dir * 2, head: -6 - look * 8 + es(t, 1.1, 1.4) * 10 * (1 - es(t, 1.9, 2.1)) - es(t, 2.2, 2.5) * 8, armF: 20 + bump(t, 0.6, 1.2) * 40, blink: blinkAt(T, f.seed) });
      });

      S.cam.y = -24;
      S.cam.z = 1.02 + es(t, 1.0, 1.4) * 0.03 - es(t, 2, 2.4) * 0.03;
    };
  },
};
