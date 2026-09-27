// Mk 1,9–11 — Jesus walks from green Galilee down to the desert Jordan and is baptised by John;
// as He comes up out of the water the paper sky tears open onto gold, the Spirit comes down like a dove,
// and the voice from heaven rolls down in rings of light.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, reeds, rock, sun, cloud, grass, flowers, olive, house, cypress } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { JOHN_B, hand, headAt, shell, drops, dove, flapWings, signpost, tearLine, scrub, acacia } from './lib.js';

const PI = Math.PI;
const P = 0.5;
const BANK = 748, WADE = 702, JX = 800, JOX = 690;
const START = -450;       // Jesus leaves Nazareth here

export default {
  id: 'm1-baptism',
  beats: [
    { v: 9, text: 'W owym czasie przyszedł Jezus z Nazaretu w Galilei' },
    { v: 9, cont: true, text: 'i przyjął od Jana chrzest w Jordanie.' },
    { v: 10, text: 'W chwili gdy wychodził z wody, ujrzał rozwierające się niebo' },
    { v: 10, cont: true, text: 'i Ducha jak gołębicę zstępującego na siebie.' },
    { v: 11 },
  ],
  cam: { x: [(START - 800) / P, 0], y: [-60, 30], z: [0.96, 1.08] },
  build(S) {
    const c = S.c;

    /* ---------- behind the sky: gold ---------- */
    sky(S, ['#f4c877', '#f9dca0', '#fcebc6'], { name: 'gold' });
    const burstL = S.layer({ par: 0, sh: 1, flat: true });
    burstL.add(`<g transform="translate(800 120)">${rays(c, { n: 22, r0: 30, r1: 1100, spread: 0.04, color: '#fff6dc' })}</g><circle cx="800" cy="120" r="420" fill="url(#halo-glow)"/>`);

    /* ---------- the paper sky, in two halves that can tear apart ---------- */
    const gid = S.id('daysky');
    const y0 = Math.min(-200, S.view().y0);
    S.defs(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="${y0.toFixed(0)}" x2="0" y2="700"><stop offset="0" stop-color="#bcd8d6"/><stop offset=".55" stop-color="#e3ecdd"/><stop offset="1" stop-color="#f4ecd4"/></linearGradient>`);
    const tear = tearLine(c, -2600, 720).map(([x, y]) => [x + 800, y]);
    const half = (dir) => {
      const outer = dir < 0 ? [[800, 720], [-3000, 720], [-3000, -2600], [800, -2600]] : [[800, 720], [4600, 720], [4600, -2600], [800, -2600]];
      const pts = [...tear, ...outer.slice(1, 3)];
      const d = c.poly(dir < 0 ? pts : pts);
      const edge = c.ribbon(tear.map(([x, y]) => [x + dir * 3, y]), 5, 1.5);
      return `<path d="${d}" fill="url(#${gid})"/><path class="grain" d="${d}"/><path d="${edge}" fill="#fbf6ea" opacity=".9"/>`;
    };
    const skyL = S.layer({ par: 0, sh: 6, pad: 420 });
    skyL.add(half(-1));
    const skyR = S.layer({ par: 0, sh: 6, pad: 420 });
    skyR.add(half(1));
    // the whole, untorn sky on top (no seam, no shadow) until the moment it tears
    const skyWhole = S.layer({ par: 0, sh: 1, flat: true });
    skyWhole.add(`<rect x="-3000" y="-3000" width="8000" height="3720" fill="url(#${gid})"/><rect class="grain" x="-3000" y="-3000" width="8000" height="3720"/>`);

    /* ---------- sun & clouds on strings ---------- */
    const hangL = S.layer({ par: 0.03, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1230, y: 160, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 520, y: 170, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 1040, y: 120, len: 700 });

    /* ---------- hills: green Galilee on the left, desert on the right ---------- */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [18, 8, 3], lens: [1000, 360, 130], color: mix(C.duskViolet, C.hillFar, 0.4), x0: -1500 }).markup);
    const hills = S.layer({ par: 0.25, sh: 3 });
    const hd = sheet();
    hd.p(c.ridge(c.wave(505, [22, 9, 3], [900, 300, 110]), 200, 2600, 1700, 12, 1), mix(C.dune, C.sand2, 0.4));
    hills.add(hd.out());
    const hg = sheet();
    const gpts = [];
    for (let x = -1500; x <= 420; x += 12) gpts.push([x, 470 + Math.sin(x / 260) * 26 + Math.sin(x / 90) * 6 + Math.max(0, x - 250) * 0.5]);
    gpts.push([520, 700], [-1500, 700]);
    hg.p(c.cut(gpts, 1, 12), C.hillMid);
    hills.add(hg.out());
    hills.add(town(c, 60, 470) + olive(c, -120, 480, 0.6) + olive(c, 330, 520, 0.55) + cypress(c, 250, 505, 90) + cypress(c, -40, 470, 110));
    function town(c2, x, y) {
      let o = '';
      [[-90, 12, 52, 38], [-30, 0, 60, 44], [36, 8, 48, 34], [90, 18, 56, 40], [-60, 34, 50, 36], [20, 38, 62, 42]].forEach(([dx, dy, w, h]) => { o += house(c2, x + dx, y + dy, w * 0.8, h * 0.8, { stairs: false }); });
      return o;
    }

    /* ---------- far bank, river ---------- */
    const L = S.layer({ par: P, sh: 3 });
    const fbFn = c.wave(578, [5, 2], [600, 170]);
    L.add(sheet().p(c.ridge(fbFn, -1900, 2600, 1700, 12, 1), mix(C.sand, C.sage3, 0.35)).out());
    const green = [];
    for (let x = -1900; x <= 330; x += 14) green.push([x, fbFn(x) - 1]);
    green.push([380, 640], [330, 1700], [-1900, 1700]);
    L.add(sheet().p(c.cut(green, 1.2, 10), C.hillNear).out());
    L.add(grass(c, { x0: -1900, x1: 320, y: 578, fn: fbFn, n: 60, h: 16, color: C.moss }) + flowers(c, { x0: -1800, x1: 250, y: 578, fn: fbFn, n: 30 }));
    L.add(reeds(c, 1350, 606, 10, 80) + reeds(c, 520, 598, 7, 60) + acacia(c, 1420, 582, 0.8));
    const riverPts = [];
    for (let x = 2600; x >= 520; x -= 12) riverPts.push([x, 600 + Math.sin(x / 70) * 2]);
    riverPts.push([505, 597], [462, 590], [428, 586], [446, 598], [470, 630], [482, 700], [2600, 700]);
    L.add(sheet().p(c.cut(riverPts, 0.6, 10), C.lake).out());
    const people = crowd(S, L, [{ y: 584, s: 0.42, n: 7, x0: 930, x1: 1440 }]).filter((m) => Math.abs(m.x - 1420) > 40);

    /* ---------- people in the river ---------- */
    const R = S.layer({ par: P, sh: 4 });
    const beam = R.add(`<path d="${c.poly([[770, 150], [830, 150], [880, 700], [720, 700]])}" fill="#fff4cf" opacity="0"/>`);
    const glow = R.add(`<circle r="170" fill="url(#halo-glow)" opacity="0"/>`);
    const jesusW = S.puppet(R.add(person(c, { ...CAST.jesus })));
    const john = S.puppet(R.add(person(c, { ...JOHN_B, holdF: `<g transform="rotate(-20)">${shell(c, 15)}</g>` })));
    const pourEl = R.add(`<g>${drops(c, 5, C.lake2)}</g>`);
    const dripEl = R.add(`<g>${drops(c, 7, C.lake)}</g>`);
    const ripples = [0, 1, 2].map((i) => R.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 60, 12, 0, PI * 2, 30), 3)}" fill="${C.foam}"/></g>`));
    const wl = sheet();
    const wpts = [];
    for (let x = 2600; x >= 470; x -= 10) wpts.push([x, 650 + Math.sin(x / 40) * 1.6]);
    wpts.push([450, 700], [2600, 700]);
    wl.p(c.cut(wpts, 0.4, 8), mix(C.lake, C.lake2, 0.4));
    let fl = '';
    for (let x = 480; x < 2600; x += c.rr(40, 90)) fl += c.cut([[x, 651], [x + 20, 648], [x + 42, 651], [x + 20, 653]], 0.2, 6);
    wl.x(fl, C.foam, 'opacity=".7"');
    R.add(wl.out());
    const splash = R.add(`<g opacity="0">${[-1, 1].map((sd) => `<path d="${c.cut([[0, 0], [sd * 20, -30], [sd * 30, -26], [sd * 12, 2]], 0.4, 4)}" fill="${C.foam}"/>`).join('')}</g>`);

    /* ---------- near bank: the road from Nazareth ---------- */
    const N = S.layer({ par: P, sh: 4 });
    const nbFn = c.wave(708, [4, 2], [500, 150]);
    N.add(sheet().p(c.ridge(nbFn, -1900, 2600, 1700, 12, 1), C.sand2).out());
    const ng = [];
    for (let x = -1900; x <= 250; x += 14) ng.push([x, nbFn(x) - 1]);
    ng.push([340, 760], [300, 1700], [-1900, 1700]);
    N.add(sheet().p(c.cut(ng, 1.2, 10), C.sage).out());
    N.add(sheet().p(c.ribbon([[-1900, 772], [-600, 766], [0, 770], [500, 764], [700, 758], [735, 752]], 34, 2), mix(C.sand, C.cream, 0.4)).out());
    N.add(grass(c, { x0: -1900, x1: 240, y: 708, fn: nbFn, n: 50, h: 18, color: C.moss }) + flowers(c, { x0: -1800, x1: 200, y: 712, fn: nbFn, n: 24, h: 26 }) + rock(c, 1080, 740, 60, 22, C.rock2));
    N.add(reeds(c, 478, 716, 12, 90) + reeds(c, 440, 712, 8, 70, C.moss));
    N.add(`<g transform="translate(-300 758)">${signpost(c, tr('Nazaret', 'Nazareth'), { dir: -1 })}</g>` + `<g transform="translate(420 752)">${signpost(c, tr('Jordan', 'Jordan'))}</g>`);
    const nearCrowd = crowd(S, N, [{ y: 770, s: 0.8, n: 3, x0: 1000, x1: 1220 }]);
    const jesusB = S.puppet(N.add(person(c, { ...CAST.jesus })));

    /* ---------- the dove and the voice ---------- */
    const V = S.layer({ par: P, sh: 5 });
    const doveEl = V.add(dove(c));
    const rings = [0, 1, 2, 3].map((i) => V.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 90, 36, PI * 0.08, PI * 0.92, 18), 8)}" fill="#fffaf0"/></g>`));

    const fg = S.layer({ par: 0.9, sh: 7 });
    fg.add(reeds(c, -1500, 960, 14, 240, C.moss) + reeds(c, -900, 970, 10, 200, C.moss) + reeds(c, 1480, 960, 14, 240, C.moss) + rock(c, 1360, 985, 220, 90, C.rock) + reeds(c, 60, 970, 12, 230, C.moss));

    return (t, time) => {
      /* v9a: from Nazareth down to the Jordan */
      const walk = seg(t, 0.03, 0.97);
      const jx = lerp(START, 760, ease.sine(walk));
      const inRiver = es(t, 1.08, 1.14);
      jesusB.set({ x: jx + es(t, 1.0, 1.1) * 30, y: BANK - es(t, 1.0, 1.1) * 20, s: 1.05, o: 1 - inRiver, walk: walk > 0 && walk < 1 ? jx * 0.045 : undefined, armF: 12, blink: blinkAt(time) });

      /* v9b: baptism */
      const pour = es(t, 1.25, 1.45) * (1 - es(t, 1.8, 1.95));
      const up = es(t, 2.0, 2.3);                   // coming up out of the water
      const look = es(t, 2.2, 2.45);
      const dv = es(t, 3.05, 3.8);                  // the dove comes down
      const voice = es(t, 4.05, 4.3);
      jesusW.set({
        x: JX, y: WADE - up * 12, s: 1.05, o: inRiver,
        head: bump(t, 1.2, 2.0) * 14 - look * 14 + voice * 4, armF: 14 + bump(t, 1.2, 2.0) * 30 + look * 24 + voice * 50, armB: 10 + look * 30 + voice * 110,
        blink: blinkAt(time, 3),
      });
      const [hx, hy] = headAt(JX, WADE - up * 12, 1.05);
      const awe = es(t, 2.35, 2.6);
      const kneelish = es(t, 4.1, 4.4);
      john.set({
        x: JOX, y: WADE + kneelish * 16, s: 1.03, flip: false,
        armF: 20 + pour * 95 + awe * 40 - kneelish * 30, armB: 10 + awe * 100 + kneelish * 40, head: pour * 6 - awe * 14 + kneelish * 16, lean: kneelish * 12,
        blink: blinkAt(time, 1),
      });
      const [px, py] = hand(JOX, WADE, 1.03, false, 20 + pour * 95);
      const fall = time ? (time * 1.6) % 1 : 0.5;
      pose(pourEl, { x: px + 14 + fall * 12, y: py + 4 + fall * 44, o: seg(t, 1.4, 1.5) * (1 - seg(t, 1.78, 1.85)) });
      pose(dripEl, { x: JX + 10, y: hy + 30 + ((time * 1.3) % 1) * 90, o: bump(t, 2.0, 2.6) * 0.9 });
      pose(splash, { x: JX, y: 652, s: bump(t, 1.05, 1.3) * 1.3, o: bump(t, 1.05, 1.3) });
      ripples.forEach((r, i) => {
        const k = time ? ((time * 0.4 + i / 3) % 1) : (i + 1) / 3.5;
        const on = Math.max(bump(t, 1.35, 2.5), bump(t, 1.95, 2.6));
        pose(r, { x: JX + 6, y: 656, s: 0.6 + k * 1.6, o: on * (1 - k) * 0.8 });
      });

      /* v10a: the heavens tear open */
      const tearK = es(t, 2.35, 2.95, ease.out);
      skyL.shift(-tearK * 380 - bump(t, 2.3, 2.5) * 6, -tearK * 30);
      skyR.shift(tearK * 380 + bump(t, 2.3, 2.5) * 6, -tearK * 20);
      burstL.fade(tearK);
      skyWhole.fade(1 - seg(t, 2.33, 2.37));
      swing(sunEl, 1230 + tearK * 300, 160, time, 1, 0.6);
      swing(cl1, 520 - tearK * 350 + Math.sin(time * 0.1) * 20, 170, time, 1.2, 0.6, 1);
      swing(cl2, 1040 + tearK * 300 + Math.sin(time * 0.12 + 1) * 20, 120, time, 1.2, 0.7, 2);

      /* v10b: the Spirit like a dove */
      const dy = lerp(-120, hy - 72, ease.out(dv));
      pose(doveEl, { x: JX + Math.sin(dv * PI * 2) * 40 * (1 - dv), y: dy + Math.sin(time * 2) * 4 * dv, s: 1.25, o: seg(t, 3.0, 3.1) });
      flapWings(doveEl, time, 30 + (1 - dv) * 10, 7 - dv * 3, -10);
      pose(beam, { o: tearK * 0.1 + dv * 0.25 });
      pose(glow, { x: hx, y: hy + 10, s: 0.8 + dv * 0.8 + voice * 0.8, o: Math.max(dv, voice) * 0.9 });

      /* v11: the voice from heaven */
      rings.forEach((r, i) => {
        const k = time ? ((time * 0.35 + i / 4) % 1) : (i + 1) / 4.5;
        pose(r, { x: JX, y: 120 + k * 360, s: 0.8 + k * 3, sy: 0.8 + k * 2, o: voice * (1 - k) * 0.9 });
      });

      /* the onlookers */
      people.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: awe * (m.i % 2 ? 90 : 30), armB: awe * (m.i % 2 ? 20 : 120), head: -awe * 10, blink: blinkAt(time, m.seed) }));
      nearCrowd.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: true, armF: 20 + awe * 50, armB: awe * (m.i % 2 ? 140 : 0), head: -awe * 12, blink: blinkAt(time, m.seed) }));

      /* camera follows Jesus from Nazareth, then looks up at the opened sky */
      const follow = Math.min(0, (jx - 800) / P) * (1 - es(t, 0.95, 1.25));
      S.cam.x = follow;
      S.cam.y = -es(t, 2.2, 2.7) * 50 + es(t, 3.6, 4.2) * 30;
      S.cam.z = 1.04 - es(t, 2.2, 2.7) * 0.07 + es(t, 3.6, 4.2) * 0.05;
    };
  },
};
