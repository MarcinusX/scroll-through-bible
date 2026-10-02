// Mt 11,28–30 — a golden evening on a country road between the fields. "Come to me, all who labour and are heavily
// burdened": Jesus opens His arms, and from both sides the weary come slowly, bent under their loads — a sack of grain,
// a water jar, a bundle of firewood, a basket of stones, a grey bundle of sorrows, a heavy pack. "And I will give you
// rest": the loads slide off their backs to the ground, they straighten up and sit down in the grass round Him.
// "Take my yoke upon you… for I am gentle and humble of heart": He lifts a wooden yoke, lays one side on His own
// shoulders and the other on the stone-carrier's, and a warm heart glows in Him; a lamb lies at His feet. "You will
// find rest for your souls": small lights kindle in each of the resting people. "My yoke is easy and my burden
// light": the two walk on together lightly under the yoke, and the heavy loads left on the ground turn into paper
// lanterns and float up into the evening sky.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { hillsSet, bigJar, woodLoad, stoneBasket, greyBundle, yoke, lantern, soulLight, heart, sheep, manOf, womanOf, headAt, kf, moving, EVENING, HEAVEN, PI } from './lib.js';
import { sack as sack3 } from '../matthew3/lib.js';

const GY = 740, JX = 800;
const PARTNER = 3;                         // the stone-carrier takes the other side of the yoke

export default {
  id: 'mt11-rest',
  beats: [
    { v: 28, text: 'Przyjdźcie do Mnie wszyscy, którzy utrudzeni i obciążeni jesteście,' },
    { v: 28, cont: true, text: 'a Ja was pokrzepię.' },
    { v: 29, text: 'Weźcie moje jarzmo na siebie i uczcie się ode Mnie, bo jestem cichy i pokorny sercem,' },
    { v: 29, cont: true, text: 'a znajdziecie ukojenie dla dusz waszych.' },
    { v: 30 },
  ],
  cam: { x: [-40, 160], y: [-60, 50], z: [1, 1.24] },
  build(S) {
    const H = hillsSet(S, { skyCols: EVENING, sky2: HEAVEN, sunAt: [1240, 330], gy: GY - 30, midY: 540, meadow: mix(C.wheatGreen, C.hillNear, 0.5) });
    const c = H.c;
    // the road
    const road = S.layer({ par: 0.5, sh: 2 });
    road.add(sheet().p(c.ribbon([[-900, 790], [300, 776], [800, 770], [1300, 776], [2500, 790]], 70, 2), mix(C.sand, C.cream, 0.3)).out());

    /* the weary and their loads */
    const WEARY = [
      { o: manOf(c, { robe: C.ochreRobe, mantle: null, belt: C.rope }), from: -150, to: 600, load: sack3(c, 60, 76), lx: -30, ly: -96, side: -1 },
      { o: womanOf(c, { robe: C.roseRobe }), from: -300, to: 480, load: bigJar(c, 66), lx: 0, ly: -190, side: -1 },
      { o: manOf(c, { robe: C.stone2, hair: C.greyHair, beard: 'full', beardColor: C.greyHair }), from: -450, to: 360, load: woodLoad(c, 110), lx: -26, ly: -140, side: -1 },
      { o: manOf(c, { robe: C.dustyBlue, mantle: null, belt: C.leather }), from: 1650, to: 1000, load: stoneBasket(c, 70), lx: -30, ly: -118, side: 1 },
      { o: manOf(c, { robe: C.mauve, mantle: C.stone }), from: 1800, to: 1120, load: greyBundle(c, 34), lx: -30, ly: -118, side: 1 },
      { o: womanOf(c, { robe: C.tealRobe }), from: 1950, to: 1240, load: greyBundle(c, 30, mix(C.wood3, C.stone2, 0.4)), lx: -28, ly: -120, side: 1 },
    ];
    const GO = S.portrait ? 60 : 130;   // how far the two walk on under the yoke (phone: not over the resting people)
    if (S.portrait) WEARY.forEach((w) => { w.to = 800 + (w.to - 800) * 0.68; });   // phone: all the weary inside the screen
    const act = S.layer({ par: 0.5, sh: 5 });
    const lamb = act.add(`<g>${sheep(c)}</g>`);
    const ppl = WEARY.map((w, i) => ({
      ...w, i,
      walkP: S.puppet(act.add(person(c, w.o))),
      sitP: S.puppet(act.add(person(c, { ...w.o, pose: 'sit' }))),
      soul: act.add(`<g>${soulLight(c, 9)}</g>`),
    }));
    const loadL = S.layer({ par: 0.5, sh: 5 });
    ppl.forEach((p) => { p.loadEl = loadL.add(`<g>${p.load}</g>`); p.lan = loadL.add(`<g>${lantern(c, 18, [C.apricot, C.sun, C.peach][p.i % 3])}</g>`); });
    const extra = Array.from({ length: 8 }, (_, i) => ({ i, el: loadL.add(`<g>${lantern(makeCutter('mt11-ln' + i), 12 + (i % 3) * 3, [C.apricot, C.sun, C.peach][i % 3])}</g>`), x: S.portrait ? 440 + ((i * 3) % 8) * 95 : [180, 330, 1270, 1420, 260, 1350, 120, 1500][i] }));

    /* Jesus, the yoke */
    const jL = S.layer({ par: 0.5, sh: 5 });
    const glow = jL.add(`<circle r="200" fill="url(#halo-glow)" opacity="0"/>`);
    const jesus = S.puppet(jL.add(person(c, { ...CAST.jesus })));
    const hrt = jL.add(`<g><circle r="46" fill="url(#warm-glow)"/>${heart(c, 12)}</g>`);
    const yk = jL.add(`<g>${yoke(c, 170)}</g>`);

    return (t, time) => {
      const T = time;
      const eve = es(t, 3.9, 4.6);
      H.update(T, { sunY: 330 + eve * 60 });
      H.sk2.fade(eve * 0.7);

      /* v28a — "come to me": He opens His arms; the weary come slowly */
      const open = es(t, 0.05, 0.3);
      const lift = es(t, 2.05, 2.25);          // He bends for the yoke
      const onSh = es(t, 2.3, 2.5);
      const go = es(t, 4.05, 4.7, (u) => u);
      const jx = JX + go * GO;
      const bob = go > 0 && go < 1 ? Math.abs(Math.sin(jx * 0.05)) * 3 : 0;
      jesus.set({
        x: jx, y: GY - bob, s: 1.06, walk: go > 0 && go < 1 ? jx * 0.05 : undefined,
        armF: 20 + open * 70 * (1 - es(t, 1.9, 2.05)) + lift * 60 * (1 - onSh) + onSh * 40, armB: 10 + open * 110 * (1 - es(t, 1.9, 2.05)) + onSh * 150 * (1 - go * 0.2),
        head: -open * 6 + lift * 16 * (1 - onSh) + es(t, 3.05, 3.3) * 6, lean: lift * 12 * (1 - onSh), blink: blinkAt(T),
      });
      pose(glow, { x: jx, y: GY - 120, s: 1, o: 0.3 + open * 0.3 + es(t, 1.05, 1.3) * 0.3 });
      const hk = es(t, 2.4, 2.6);
      pose(hrt, { x: jx + 12, y: GY - 124 - bob, s: 0.4 + hk * 0.7 + (T ? Math.sin(T * 4) * 0.04 * hk : 0), o: hk });
      pose(lamb, { x: 700, y: GY + 18, sx: -0.9, sy: 0.9, o: es(t, 2.4, 2.6) });

      ppl.forEach((p) => {
        const arrive = es(t, 0.02 + p.i * 0.03, 0.72 + p.i * 0.03, (u) => u);
        const x0 = lerp(p.from, p.to, arrive);
        const drop = seg(t, 1.05 + p.i * 0.03, 1.3 + p.i * 0.03);
        const sit = es(t, 1.45 + p.i * 0.03, 1.5 + p.i * 0.03);
        const partner = p.i === PARTNER;
        const walking = arrive > 0 && arrive < 1;
        const lean = 16 * (1 - es(t, 1.2, 1.4));
        const face = p.side < 0 ? false : true;
        let x = x0, flip = face;
        if (partner) {
          const step = es(t, 2.05, 2.3);
          x = lerp(x0, JX + 116, step) + go * GO;
          if (step > 0 && step < 1) flip = true;
          if (step >= 1) flip = false;
        }
        const pb = partner && go > 0 && go < 1 ? Math.abs(Math.sin(x * 0.05 + 1)) * 3 : 0;
        p.walkP.set({
          x, y: GY + (p.i % 3) * 6 - pb, s: 0.96, flip, walk: walking || (partner && ((t > 2.05 && t < 2.3) || (go > 0 && go < 1))) ? x * 0.04 + p.i : undefined, amt: 0.6,
          armF: 30 + (partner ? onSh * 120 : 0), armB: 20 + (partner ? onSh * 110 : 0), head: 10 * (1 - es(t, 1.2, 1.4)) - (partner ? onSh * 4 : 0), lean: partner ? lean : lean, blink: blinkAt(T, p.i + 2),
          o: partner ? 1 : 1 - sit,
        });
        const calm = es(t, 3.05 + p.i * 0.04, 3.3 + p.i * 0.04);
        p.sitP.set({ x: x0, y: GY + (p.i % 3) * 6, s: 0.96, flip: face, armF: 30, armB: 20 + calm * 20, head: -4 + calm * 14, blink: calm > 0.5 ? 1 : blinkAt(T, p.i + 2), o: partner ? 0 : sit });
        // the load: on the back, then slipping to the ground; at the end it turns into a lantern
        const lr = (lean * PI) / 180, fwd = flip ? -1 : 1;
        const onBack = [x0 + fwd * p.lx * 0.96 + fwd * Math.sin(lr) * -p.ly * 0.96, GY + p.ly * 0.96 * Math.cos(lr) + (p.i % 3) * 6 - pb];
        const ground = [x0 + (p.side < 0 ? -58 : 58), GY + 16 + (p.i % 3) * 6];
        const k = ease.io(drop);
        const rise = es(t, 4.1 + p.i * 0.05, 4.85, ease.out);
        pose(p.loadEl, { x: lerp(onBack[0], ground[0], k), y: lerp(onBack[1], ground[1], k) - Math.sin(k * PI) * 20, r: k * (p.side < 0 ? -12 : 12), s: 0.96, o: 1 - es(t, 4.05, 4.15) });
        const ly = lerp(ground[1] - 30, (p.side < 0 ? 300 : 110) + (p.i % 3) * 50, rise);
        const lx = S.portrait ? lerp(ground[0], 470 + p.i * 125, rise) : ground[0] + (p.side < 0 ? -1 : 1) * rise * 90;
        pose(p.lan, { x: lx + Math.sin(rise * 5 + p.i) * 30 * rise, y: S.portrait ? lerp(ground[1] - 30, 160 + (p.i % 3) * 90, rise) : ly, s: 0.6 + es(t, 4.05, 4.15) * 0.6, r: T ? Math.sin(T * 1.3 + p.i) * 5 : 0, o: es(t, 4.05, 4.15) });
        // rest for the soul
        const [hx, hy] = headAt(x0, GY + (p.i % 3) * 6, 0.96, face, 62);
        pose(p.soul, { x: hx + (face ? -6 : 6), y: hy + 62, s: 0.6 + calm * 0.5, o: partner ? 0 : calm * 0.95 });
      });
      extra.forEach((e) => {
        const k = es(t, 4.2 + e.i * 0.06, 4.95, ease.out);
        pose(e.el, { x: e.x + Math.sin(k * 4 + e.i) * 20, y: lerp(640, S.portrait ? 60 + (e.i % 4) * 70 : (e.x < 800 ? 300 : 110) + (e.i % 4) * 50, k), r: T ? Math.sin(T * 1.2 + e.i) * 5 : 0, o: k > 0.01 ? 1 : 0 });
      });

      /* the yoke: lying by Him, lifted, laid across both their shoulders */
      const ps = ppl[PARTNER];
      const pX = lerp(lerp(ps.from, ps.to, 1), JX + 116, es(t, 2.05, 2.3)) + go * GO;
      const shJ = [jx + 2, GY - 124 * 1.06 - bob], shP = [pX + 2, GY + 18 - 124 * 0.96];
      const onGround = [JX + 60, GY + 22];
      const held = [jx + 56, GY - 90];
      const y1 = es(t, 2.05, 2.28), y2 = onSh;
      const mid = [(shJ[0] + shP[0]) / 2, (shJ[1] + shP[1]) / 2 - 8];
      const yx = lerp(lerp(onGround[0], held[0], y1), mid[0], y2), yy = lerp(lerp(onGround[1], held[1], y1), mid[1], y2) - bump(t, 4.1, 4.7) * 6;
      const ang = Math.atan2(shP[1] - shJ[1], shP[0] - shJ[0]) * 180 / PI;
      pose(yk, { x: yx, y: yy, r: lerp(0, ang, y2), s: 0.62, o: es(t, 1.9, 2.05) });

      /* camera */
      S.cam.x = kf(t, [[0, 0], [3.9, 20], [4.6, S.portrait ? 60 : 120]]);
      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.06], [1.4, 1.14], [2.0, 1.2], [3.9, 1.2], [4.5, 1.08]]);
      S.cam.y = kf(t, [[0, 10], [1.4, 30], [3.9, 30], [4.5, -30]]);
    };
  },
};
