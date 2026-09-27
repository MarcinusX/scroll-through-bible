// J 6,31–34 — "Our fathers ate manna in the wilderness": a sepia flashback — a desert camp of tents, Moses with
// his staff, manna falling like snow and the people gathering it in baskets; the psalm unrolls: "He gave them
// bread from heaven to eat." "It was not Moses…" — Moses turns and points up, and the old picture lifts away:
// we are in the synagogue at Capernaum. "…my Father gives you the true bread from heaven": a loaf of light comes
// down from the radiance, onto Jesus, and light runs out over a small paper world. "Lord, give us this bread always!"
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { synagogueInterior, storyFrame, SEPIA, desertCamp, MOSES, mannaField, folk, basket, breadOfLight, radiance, globe, verseScroll, sparkle, headAt, hand, kf, tr, PI } from './lib.js';

const JX = 800, FEET = 742;
const SEP = (a) => (a ? mix(a, '#c9ae86', 0.55) : a);
const sepia = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'string' && v[0] === '#' ? SEP(v) : v]));

export default {
  id: 'j6-manna',
  beats: [
    { v: 31, text: 'Ojcowie nasi jedli mannę na pustyni,' },
    { v: 31, cont: true, text: 'jak napisano: Dał im do jedzenia chleb z nieba».' },
    { v: 32, text: 'Rzekł do nich Jezus: «Zaprawdę, zaprawdę, powiadam wam: Nie Mojżesz dał wam chleb z nieba,' },
    { v: 32, cont: true, text: 'ale dopiero Ojciec mój da wam prawdziwy chleb z nieba.' },
    { v: 33 },
    { v: 34 },
  ],
  cam: { x: [-20, 20], y: [-20, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    /* the present: the synagogue at Capernaum (hidden while the flashback covers it) */
    const room = [];
    const mk = S.layer;
    S.layer = (o) => { const Ly = mk(o); room.push(Ly); return Ly; };
    const I = synagogueInterior(S);
    const hi = S.layer({ par: 0.3, sh: 4 });
    const rad = hi.add(`<g><circle r="240" fill="url(#halo-glow)"/>${radiance(c, 60)}</g>`);
    const world = hanging(hi, `<circle r="110" fill="url(#halo-glow)" class="wglow"/>${globe(c, 54)}`, { x: 0, y: 0, len: 900 });
    const sparks = [0, 1, 2, 3, 4, 5].map(() => hi.add(`<g>${sparkle(c, 10)}</g>`));
    const L = S.layer({ par: I.P, sh: 4 });
    const cong = I.congregation(L);
    const jGlow = L.add(`<g><circle r="170" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const bread = L.add(`<g>${breadOfLight(c, 30)}</g>`);
    I.addColumns();
    S.layer = mk;

    /* the flashback on top: sepia desert, Moses, the manna */
    const flash = [];
    const fsk = sky(S, SEPIA.sky, { name: 'sepia' }); flash.push(fsk.layer);
    const hv = S.layer({ par: 0.04, sh: 1, flat: true }); flash.push(hv);
    hv.add(`<g transform="translate(700 40)"><circle r="260" fill="url(#halo-glow)" opacity=".8"/></g>`);
    const D = desertCamp(S); flash.push(...D.layers);
    const mannaL = S.layer({ par: 0.3, sh: 1, flat: true, pad: 400 }); flash.push(mannaL);
    mannaL.add(mannaField(c, { x0: -600, x1: 2200, y0: -800, y1: 900, n: 520, r: 4 }));
    const ground = S.layer({ par: 0.42, sh: 1, flat: true }); flash.push(ground);
    ground.add(mannaField(c, { x0: -600, x1: 2200, y0: 700, y1: 1000, n: 260, r: 4 }));
    const P = S.layer({ par: 0.45, sh: 4 }); flash.push(P);
    const moses = S.puppet(P.add(person(c, { ...sepia(MOSES), holdB: `<g transform="rotate(20)"><path d="${c.ribbon([[0, -150], [1, 0], [0, 70]], 5)}" fill="${SEP(C.wood2)}"/></g>` })));
    const GAT = [[380, 0], [480, 1], [1060, 2], [1170, 3], [1270, 4]].map(([x, i]) => {
      const o = sepia(folk(c, i % 2 === 0));
      const kneel = i % 2 === 1;
      return { x, i, seed: c.rr(0, 9), kneel, p: S.puppet(P.add(person(c, { ...o, pose: kneel ? 'kneel' : 'stand', holdF: `<g transform="translate(-36 13) rotate(70)">${basket(c, { w: 36, h: 20, full: true }).replace(/fill="#[0-9a-f]{6}"/g, (m) => `fill="${SEP(m.slice(6, 13))}"`)}</g>` }))) };
    });
    const V = verseScroll(c, tr(['Dał im do jedzenia', 'chleb z nieba'], ['He gave them', 'bread out of heaven to eat']), { w: 330, size: 22, title: tr('PS 78,24', 'PSALM 78:24') });
    const scrollG = P.add(`<g>${V.sheet}</g>`);
    const rodT = hanging(P, V.rodTop, { x: 0, y: 0, len: 900 });
    const rodB = P.add(`<g>${V.rodBottom}</g>`);
    const frame = storyFrame(S); flash.push(frame);

    return (t, time) => {
      const T = time;
      /* the flashback lifts away at the start of v32b */
      const out = es(t, 2.95, 3.3);
      if (out > 0) I.flicker(T);
      room.forEach((Ly) => Ly.fade(out > 0 ? 1 : 0));
      flash.forEach((Ly) => Ly.fade(1 - out));
      frame.shift(0, -out * 300);

      /* v31a — manna falls like snow; they gather it */
      mannaL.shift(0, (t * 160) % 400);
      GAT.forEach((g) => {
        const bend = (Math.sin(t * 5 + g.i) * 0.5 + 0.5) * (1 - out);
        g.p.set({ x: g.x, y: 770 + (g.i % 2) * 10, s: 0.9, flip: g.x > 800, armF: g.kneel ? 60 + bend * 20 : 40 + bend * 30, armB: g.kneel ? 20 : 30 + (g.i === 2 ? bump(t, 0.3, 1.0) * 100 : 0), head: -10 + bump(t, 1.05, 1.9) * -10, lean: g.kneel ? 0 : bend * 8, blink: blinkAt(T, g.seed) });
      });
      /* v31b — "He gave them bread from heaven to eat" */
      const sc = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 2.0, 2.2));
      const un = es(t, 1.3, 1.6);
      pose(rodT, { x: 1080, y: lerp(-500, 150, sc), o: sc > 0.01 ? 1 : 0 });
      pose(scrollG, { x: 1080, y: lerp(-500, 150, sc), sy: Math.max(0.02, un), o: sc > 0.01 ? 1 : 0 });
      pose(rodB, { x: 1080, y: lerp(-500, 150, sc) + V.h * un, o: sc > 0.01 ? 1 : 0 });
      /* v32a — "It was not Moses…": Moses turns and points up */
      const up = es(t, 2.05, 2.3);
      moses.set({ x: 640, y: 764, s: 1.0, flip: false, armF: 30 + bump(t, 0.1, 1.9) * 40 + up * 100, armB: 30 - up * 10, head: -up * 18, blink: blinkAt(T, 3) });

      /* v32b — "my Father gives you the true bread from heaven" */
      const rk = es(t, 3.2, 3.45) * (1 - es(t, 5.05, 5.3) * 0.6);
      pose(rad, { x: JX, y: 170, s: 0.8 + rk * 0.3, r: T * 3, o: rk });
      const desc = es(t, 3.4, 4.6, ease.io);
      const [jhx, jhy] = headAt(JX, FEET, 1.06, false);
      const into = es(t, 4.45, 4.65);
      pose(bread, { x: JX + 4, y: lerp(230, jhy + 10, desc), s: 1 - into * 0.6, r: Math.sin(T) * 4, o: seg(t, 3.35, 3.45) * (1 - into) });
      /* v33 — the bread of God comes down and gives life to the world */
      const life = es(t, 4.5, 4.8);
      pose(jGlow, { x: JX, y: FEET - 130, s: 0.6 + life * 0.8, o: 0.2 + life * 0.7 });
      const wk = es(t, 4.4, 4.7, ease.out);
      pose(world, { x: 1080, y: lerp(-500, 260, wk), r: Math.sin(T * 0.7) * 2, o: wk > 0.01 ? 1 : 0 });
      sparks.forEach((sp, i) => {
        const k = es(t, 4.6 + i * 0.05, 4.8 + i * 0.05);
        const a = (i / 6) * PI * 2 + T * 0.5;
        pose(sp, { x: 1080 + Math.cos(a) * 80, y: 260 + Math.sin(a) * 80, s: k * 0.8, r: T * 40, o: k * (0.7 + Math.sin(T * 3 + i) * 0.3) });
      });
      jesus.set({ x: JX, y: FEET, s: 1.06, armF: 20 + es(t, 3.05, 3.3) * 60 + life * 20, armB: 10 + bump(t, 3.0, 4.0) * 130 + life * 60, head: -bump(t, 3.0, 4.2) * 10, blink: blinkAt(T, 1) });

      /* v34 — "Lord, give us this bread always!" */
      const ask = es(t, 5.05, 5.35);
      cong.forEach((m, i) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: 30 + ask * (60 + (i % 2) * 30), armB: ask * (i % 3 ? 120 : 40), head: -ask * 8 - es(t, 3.0, 3.3) * 6 * (1 - ask), lean: -ask * 4, blink: blinkAt(T, m.seed) }));

      S.cam.z = kf(t, [[0, 1.04], [2.0, 1.02], [3.0, 1.02], [4.0, 1.06], [5.0, 1.04]]);
      S.cam.y = kf(t, [[0, 20], [2.4, 20], [3.0, 10], [5.0, 20]]);
    };
  },
};
