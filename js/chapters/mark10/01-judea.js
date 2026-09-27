// Mk 10,1 — the road to Jerusalem begins. Jesus and the disciples walk out of green Galilee into the
// dry hills of Judea, down to the Jordan; tags drop in on strings: Judea, beyond the Jordan.
// Far away on the right, very small, Jerusalem glints on its hill — the goal of the whole chapter.
// Crowds stream in from every side and he teaches them again, as he always did.
import { C, person, CAST, blinkAt, pose, lerp, curtains, crowd, flock, sheet, mix, hanging, swing } from '../kit.js';
import { olive, palm, rock, bush, reeds } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { roadSet, TWELVE, wordSlip, slip, footprint } from './lib.js';

const PAR = 0.5;               // the people's layer
const WALK0 = 560, WALK1 = 1040; // Jesus walks from here to here (world x on the people's layer)
const CAM0 = -480, CAM1 = 480;
const GY = 668;                // feet

export default {
  id: 'm10-judea',
  beats: [
    { cover: true },
    { v: 1, text: 'Wybrał się stamtąd i przyszedł w granice Judei i Zajordania.' },
    { v: 1, cont: true, text: 'Tłumy znowu ściągały do Niego' },
    { v: 1, cont: true, text: 'i znowu je nauczał, jak miał zwyczaj.' },
  ],
  cam: { x: [CAM0, CAM1], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { road: false, jer: 0.05, jerX: 1190, trees: 26, hillCol: mix(C.hillMid, C.sage2, 0.3), clouds: [[330, 150, 200], [900, 110, 150], [1450, 200, 170]], sunAt: [1300, 160] });
    const birds = flock(S, R.hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 240, speed: 50, scale: 0.5 });

    // the dry hills of Judea rise on the right
    const jfn = c.wave(505, [26, 10, 3], [700, 260, 90]);
    const jh = (x) => jfn(x) + Math.max(0, 1100 - x) * 0.45;
    R.hillL.add(sheet().p(c.ridge(jh, 700, 2600, 1700, 12, 1.1), mix(C.sand2, C.hillMid, 0.35)).out());
    let jt = '';
    for (let i = 0; i < 9; i++) { const x = c.rr(1150, 2400), y = jh(x) + 3, h = c.rr(12, 20); jt += c.cut([[x, y - h * 1.2], [x + h * 0.22, y - h * 0.3], [x + h * 0.12, y], [x - h * 0.12, y], [x - h * 0.22, y - h * 0.3]], 0.4, 5); }
    R.hillL.add(sheet().p(jt, C.olive).out());

    // the ground: green on the left, sand on the right; the road runs across; the Jordan winds towards us
    const G = R.groundL;
    const dry = [];
    for (let i = 0; i <= 24; i++) { const u = i / 24; dry.push([lerp(1150, 560, u) + Math.sin(u * 9) * 30, lerp(R.gy(1150) + 1, 1700, u)]); }
    dry.push([2500, 1700]);
    for (let x = 2500; x > 1150; x -= 20) dry.push([x, R.gy(x) + 1]);
    G.add(sheet().p(c.cut(dry, 2, 14), mix(C.sand, C.dune, 0.22)).out());
    const road = [];
    for (let i = 0; i <= 30; i++) { const x = -700 + i * 110; road.push([x, 700 + Math.sin(x / 260) * 10]); }
    G.add(sheet().p(c.ribbon(road, 70), mix(C.sand2, C.dune, 0.2)).out());
    const riv = [];
    for (let i = 0; i <= 22; i++) { const u = i / 22; riv.push([1230 + Math.sin(u * 5.5) * 70 * (0.3 + u) + u * 40, lerp(588, 1700, Math.pow(u, 1.25))]); }
    G.add(sheet().p(c.ribbon(riv, (u) => 16 + u * 190), C.lake).x(c.ribbon(riv.slice(2), (u) => 3 + u * 30), C.lake2, 'opacity=".6"').out());
    G.add(reeds(c, 1130, 720, 8, 70) + reeds(c, 1360, 760, 9, 80) + reeds(c, 1290, 640, 6, 40));
    let steps = '';
    for (let i = 0; i < 5; i++) steps += c.cut(c.blob(1190 + i * 26, 704 + (i % 2) * 6, 12, 6, 8, 0.2), 0.4, 3);
    G.add(sheet().p(steps, C.rock2).out());
    // Galilee's lake peeks in on the far left
    G.add(sheet().p(c.cut([[-900, 592], [-120, 590], [-60, 605], [-200, 626], [-900, 630]], 0.6, 10), C.lake).out());
    G.add(olive(c, -30, 640, 1) + olive(c, 250, 630, 0.85) + palm(c, 440, 640, 190) + palm(c, 1560, 640, 180) + palm(c, 1660, 652, 150) + bush(c, 640, 650, 70, C.sage, C.moss) + rock(c, 1020, 660, 60, 22));
    // footprints on the road behind them

    // hanging place names
    const tagL = S.layer({ par: 0.12, sh: 4 });
    const TAGS = [
      { text: tr('Galilea', 'Galilee'), x: 640, y: 250, on: [-1, -0.5], off: [1.1, 1.4] },
      { text: tr('Judea', 'Judea'), x: 800, y: 265, on: [1.15, 1.45], off: [9, 9] },
      { text: tr('Zajordanie', 'Beyond the Jordan'), x: 1085, y: 240, on: [1.35, 1.65], off: [9, 9] },
    ].map((g) => ({ ...g, el: hanging(tagL, slip(c, g.text, { size: 26 }), { x: g.x, y: g.y, len: 700 }) }));

    // the crowd that gathers
    const crowdL = S.layer({ par: PAR, sh: 3 });
    const people = crowd(S, crowdL, [
      { y: 612, s: 0.5, n: 9, x0: WALK1 + 90, x1: WALK1 + 470 },
      { y: 634, s: 0.56, n: 7, x0: WALK1 + 110, x1: WALK1 + 440 },
      { y: 624, s: 0.52, n: 5, x0: WALK1 - 470, x1: WALK1 - 300 },
    ]);
    people.forEach((m) => { m.from = m.x < WALK1 ? m.x - c.rr(420, 700) : m.x + c.rr(420, 700); });

    // Jesus and the disciples
    const walkL = S.layer({ par: PAR, sh: 5 });
    const stone = walkL.add(`<g>${sheet().p(c.cut(c.blob(0, -10, 60, 18, 12, 0.15), 0.8, 6), C.rock).out()}</g>`);
    const DIS = TWELVE.slice(0, 8).map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(walkL.add(person(c, d.o))) }));
    const jesus = S.puppet(walkL.add(person(c, { ...CAST.jesus })));
    const frontL = S.layer({ par: PAR, sh: 4 });
    const front = crowd(S, frontL, [{ y: 706, s: 0.7, n: 3, x0: WALK1 + 150, x1: WALK1 + 420 }, { y: 712, s: 0.72, n: 3, x0: WALK1 - 440, x1: WALK1 - 240 }]);
    front.forEach((m) => { m.from = m.x < WALK1 ? m.x - c.rr(500, 800) : m.x + c.rr(500, 800); });
    const prints = [];
    for (let i = 0; i < 14; i++) prints.push({ el: walkL.add(`<g opacity="0">${footprint(c, i % 2 === 0)}</g>`), x: WALK0 - 40 + i * 36, y: GY + 4 + (i % 2) * 8 });
    const words = Array.from({ length: 5 }, (_, i) => ({ el: walkL.add(`<g opacity="0">${wordSlip(c, 30 + (i % 3) * 6)}</g>`), i, a: -0.9 + i * 0.45 }));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 240, 990, 240, C.sage, C.moss) + rock(c, 1360, 990, 220, 70, C.rock2) + reeds(c, 1500, 1000, 12, 190, C.moss));

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      R.sk.blend(['#cfe0da', '#efe6cd', '#f6e8cf'], ['#d7ded2', '#f3e2c2', '#f6dfbd'], es(t, 1, 3.5));
      R.update(t, T, { sunY: es(t, 1, 4) * 30 });
      birds(T, 1);

      /* beat 1: the walk south — the camera travels with them */
      const w = es(t, 1.0, 1.95, ease.sine);
      const walking = t > 1.0 && t < 1.95;
      const jx = lerp(WALK0, WALK1, w);
      S.cam.x = lerp(CAM0, CAM1, w);
      S.cam.z = 1.04 + es(t, 2, 2.8) * -0.04 + es(t, 3, 3.6) * 0.06;
      S.cam.y = 20 + es(t, 3, 3.6) * 30;

      const teach = es(t, 3.0, 3.3);
      const onStone = es(t, 2.9, 3.1);
      pose(stone, { x: WALK1 + 4, y: GY + 6, s: 1, o: 1 });
      jesus.set({
        x: jx, y: GY - onStone * 14, s: 0.98, flip: t > 1.95 && t < 2.9 ? bump(t, 2.1, 2.8) > 0.5 : false,
        walk: walking ? w * 52 : undefined,
        armF: bump(t, 1.95, 2.9) * 40 + teach * (55 + Math.sin(T * 1.4) * 12), armB: teach * 60 + bump(t, 2.05, 2.9) * 30,
        head: -teach * 4 + Math.sin(T * 0.7) * 1.5, blink: blinkAt(T),
      });
      DIS.forEach((d) => {
        const gap = 62 + d.i * 58;
        const lag = Math.min(1, w * (1 + d.i * 0.02));
        const settle = es(t, 2.05 + d.i * 0.04, 2.55 + d.i * 0.04);
        const x0 = lerp(WALK0 - gap, WALK1 - gap, lag);
        const x = lerp(x0, WALK1 - 250 + d.i * 44, settle);
        const moving = walking || (settle > 0 && settle < 1);
        d.p.set({
          x, y: GY - 34 - (d.i % 2) * 18 - settle * (18 - (d.i % 2) * 10), s: 0.84 - (d.i % 2) * 0.05 - settle * 0.06, flip: false,
          walk: moving ? (walking ? w * 52 + d.i : x * 0.07) : undefined, armF: 10 + teach * (d.i % 3 === 0 ? 30 : 0), head: -teach * 5, blink: blinkAt(T, d.seed),
        });
      });
      prints.forEach((p, i) => {
        pose(p.el, { x: p.x, y: p.y, s: 0.6, o: seg(jx, p.x + 20, p.x + 60) * 0.55 * (1 - es(t, 2.1, 2.6)) });
      });

      /* place names */
      TAGS.forEach((g, i) => {
        const on = es(t, g.on[0], g.on[1], ease.back) * (1 - es(t, g.off[0], g.off[1]));
        swing(g.el, g.x, g.y - (1 - on) * 1100, T, 2.2, 0.9, i);
      });

      /* beat 2: crowds stream in from every side */
      const gather = (m, rowT) => {
        const pr = seg(t, rowT + m.delay * 0.5, rowT + 0.4 + m.delay * 0.5);
        const x = lerp(m.from, m.x, ease.out(pr));
        return { x, pr };
      };
      people.forEach((m) => {
        const { x, pr } = gather(m, 2.0);
        const listen = es(t, 3.0 + m.delay * 0.3, 3.3 + m.delay * 0.3);
        m.p.set({ x, y: m.y, s: m.s, flip: x > WALK1, o: pr > 0 ? 1 : 0, walk: pr > 0 && pr < 1 ? x * 0.06 : undefined, armF: listen * (m.i % 4 === 0 ? 24 : 0), head: -listen * 6, blink: blinkAt(T, m.seed) });
      });
      front.forEach((m) => {
        const { x, pr } = gather(m, 2.15);
        const listen = es(t, 3.0 + m.delay * 0.3, 3.3 + m.delay * 0.3);
        m.p.set({ x, y: m.y, s: m.s, flip: x > WALK1, o: pr > 0 ? 1 : 0, walk: pr > 0 && pr < 1 ? x * 0.06 : undefined, armF: listen * (m.i % 3 === 0 ? 20 : 0), head: -listen * 8, blink: blinkAt(T, m.seed) });
      });

      /* beat 3: he teaches them — words fly out over the listeners */
      words.forEach((wd) => {
        const k = T ? ((T * 0.28 + wd.i / words.length) % 1) : 0.3 + wd.i * 0.12;
        const on = teach * (1 - es(t, 4.2, 4.5));
        const x = WALK1 + 40 + Math.cos(wd.a) * (30 + k * 260), y = GY - 190 - k * 60 + Math.sin(wd.a) * 40 * k;
        pose(wd.el, { x, y, s: 0.8 + k * 0.5, r: Math.sin(T * 1.2 + wd.i) * 8, o: on * Math.sin(k * Math.PI) });
      });
    };
  },
};
