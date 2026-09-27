// Mk 1,4–6 — John the Baptist at the Jordan: he steps out of the wilderness and calls people to turn around;
// all Judea and Jerusalem stream down to the river; confessed sins float away downstream;
// then a close-up: camel-hair robe, leather belt, locusts and wild honey.
import { C, person, crowd, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, reeds, rock, sun, cloud, town, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { JOHN_B, hand, headAt, voiceRings, walledCity, camel, walkCamel, honeycomb, bee, locust, shell, scrap, drops, tagOnString, scrub } from './lib.js';

const PI = Math.PI;
const P = 0.45;            // everything by the river shares one depth
const BANK = 752;          // John on the near bank
const WADE = 702;          // people standing in the river (feet)
const JX = 800;

export default {
  id: 'm1-john',
  beats: [
    { v: 4, text: 'Wystąpił Jan Chrzciciel na pustyni' },
    { v: 4, cont: true, text: 'i głosił chrzest nawrócenia na odpuszczenie grzechów.' },
    { v: 5, text: 'Ciągnęła do niego cała judzka kraina oraz wszyscy mieszkańcy Jerozolimy' },
    { v: 5, cont: true, text: 'i przyjmowali od niego chrzest w rzece Jordan, wyznając [przy tym] swe grzechy.' },
    { v: 6, text: 'Jan nosił odzienie z sierści wielbłądziej i pas skórzany około bioder,' },
    { v: 6, cont: true, text: 'a żywił się szarańczą i miodem leśnym.' },
  ],
  cam: { x: [-150, 60], y: [-20, 270], z: [0.92, 2.35] },
  build(S) {
    const c = S.c;
    const SKY = ['#cfe0da', '#f1e5c9', '#f7e9cf'];
    sky(S, SKY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50), { x: 1180, y: 170, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 560, y: 150, len: 700 });

    /* ---------- the mountains of Moab, Jerusalem on its hill ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [22, 9, 3], lens: [1000, 360, 130], color: mix(C.duskViolet, C.dune, 0.5), x0: -1300 }).markup);
    const hill = S.layer({ par: 0.16, sh: 3 });
    const hs = sheet();
    hs.p(c.cut([[-1300, 700], [-1300, 470], [-600, 440], [80, 400], [380, 352], [570, 352], [700, 420], [860, 470], [1100, 480], [1500, 460], [2600, 470], [2600, 700]], 1.2, 12), mix(C.dune, C.sand2, 0.4));
    hs.x(c.cut([[700, 420], [860, 470], [800, 480], [680, 440]], 0.6, 8), C.sand, 'opacity=".6"');
    // the path from the city gate down to the river
    const PATH = [[480, 360], [585, 390], [455, 420], [615, 452], [505, 486], [700, 520]];
    hs.p(c.ribbon(PATH, (u) => 5 + u * 10, 0.6), C.sand);
    hill.add(hs.out());
    hill.add(walledCity(c, 475, 358, 0.95));
    hill.add(town(c, { x: 1250, y: 478, n: 5, spread: 160, sc: 0.4 }) + town(c, { x: -200, y: 450, n: 4, spread: 140, sc: 0.4 }));
    // pilgrims walking down the path
    const segLen = PATH.slice(1).map((p, i) => Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1]));
    const total = segLen.reduce((a, b) => a + b, 0);
    const along = (u) => {
      let d = u * total;
      for (let i = 0; i < segLen.length; i++) {
        if (d <= segLen[i] || i === segLen.length - 1) { const k = Math.min(1, d / segLen[i]); const a = PATH[i], b = PATH[i + 1]; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), b[0] < a[0]]; }
        d -= segLen[i];
      }
      return PATH[PATH.length - 1];
    };
    const pilgrims = crowd(S, hill, [{ y: 0, s: 0.13, n: 10, x0: 0, x1: 10 }]).map((m, i) => ({ ...m, i }));

    /* ---------- far bank, camel, honey tree ---------- */
    const L = S.layer({ par: P, sh: 3 });
    const fbFn = c.wave(578, [5, 2], [600, 170]);
    const fb = sheet();
    fb.p(c.ridge(fbFn, -1300, 2600, 1700, 12, 1), mix(C.sand, C.sage3, 0.35));
    L.add(fb.out());
    L.add(grass(c, { x0: -1300, x1: 2600, y: 578, fn: fbFn, n: 50, h: 14, color: C.olive }));
    L.add(reeds(c, 260, 604, 9, 70) + reeds(c, 1350, 606, 10, 80) + reeds(c, 560, 602, 6, 50));
    // honey tree: a gnarled trunk with a hollow, the comb hanging in it
    const tree = sheet();
    tree.p(c.cut([[-16, 0], [-12, -90], [-40, -150], [-30, -156], [-4, -116], [0, -170], [12, -168], [10, -110], [44, -160], [54, -152], [16, -90], [18, 0]], 0.8, 6), C.wood2);
    tree.p(c.cut(c.blob(-40, -170, 34, 18, 10, 0.2), 0.8, 5) + c.cut(c.blob(52, -168, 30, 16, 10, 0.2), 0.8, 5) + c.cut(c.blob(4, -186, 34, 18, 10, 0.2), 0.8, 5), C.olive);
    tree.x(c.cut(c.ell(2, -70, 9, 16, 12), 0.3, 4), C.soilDark);
    L.add(`<g transform="translate(975 ${fbFn(975) + 4})">${tree.out()}<g transform="translate(2 -64) scale(.42)">${honeycomb(c)}</g></g>`);
    const camelEl = L.add(`<g>${camel(c)}</g>`);
    const locusts = [0, 1, 2, 3].map((i) => ({ el: L.add(`<g>${locust(c, { color: i % 2 ? C.olive : C.wheatGreen })}</g>`), x: 600 + i * 42, y: fbFn(600 + i * 42) + 6, i }));
    const bees = [0, 1, 2, 3, 4].map((i) => ({ el: L.add(`<g>${bee(c)}</g>`), i, r: 22 + i * 7, ph: i * 1.3 }));

    /* ---------- people arriving on the far bank ---------- */
    const farCrowd = crowd(S, L, [{ y: 584, s: 0.4, n: 14, x0: 120, x1: 1480 }]).filter((m) => Math.abs(m.x - JX) > 90 && (m.x < 900 || m.x > 1060));
    farCrowd.forEach((m, i) => { m.from = m.x - 700 - i * 20; m.d = (m.x - 120) / 1400; });

    /* ---------- the river ---------- */
    L.add(waterBand(c, { y: 600, color: C.lake, foamN: 26 }).markup);
    const flow = S.layer({ par: P, sh: 1, flat: true, pad: 200 });
    let st = '';
    for (let i = 0; i < 26; i++) { const x = c.rr(-1300, 2600), y = c.rr(612, 700), w = c.rr(30, 90); st += c.cut([[x, y], [x + w * 0.5, y - 1.6], [x + w, y], [x + w * 0.5, y + 1.2]], 0.2, 8); }
    flow.add(`<path d="${st}" fill="${C.foam}" opacity=".55"/>`);
    const R = S.layer({ par: P, sh: 4 });
        // John in the river, pouring water from a shell / later holding honeycomb and a locust
    const johnW = S.puppet(R.add(person(c, { ...JOHN_B, holdF: `<g data-k="shell" transform="rotate(-20)">${shell(c, 15)}</g><g data-k="comb" opacity="0" transform="translate(4 6) scale(.45)">${honeycomb(c)}</g>`, holdB: `<g data-k="loc" opacity="0" transform="translate(0 2) scale(.6)">${locust(c)}</g>` })));
    const shellEl = S.$('shell'), combEl = S.$('comb'), locEl = S.$('loc');
    const pourEl = R.add(`<g>${drops(c, 5, C.lake2)}</g>`);
    const kneel = S.puppet(R.add(person(c, { robe: C.dustyBlue, hairStyle: 'short', hair: C.hair2, beard: 'short', skin: C.skin2, pose: 'kneel' })));
    const queue = [{ robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin }, { robe: C.sageRobe, hairStyle: 'curly', hair: C.hair3, beard: 'full', skin: C.skin4, belt: C.leather }]
      .map((o, i) => ({ p: S.puppet(R.add(person(c, o))), x: 1035 + i * 95, i }));
    const wl = sheet();
    wl.p(c.ridge(c.wave(648, [2.5, 1.2], [160, 60]), -1300, 2600, 1700, 10, 0.6), mix(C.lake, C.lake2, 0.4));
    let fl = '';
    for (let x = -1300; x < 2600; x += c.rr(40, 90)) fl += c.cut([[x, 649], [x + 20, 646], [x + 42, 649], [x + 20, 651]], 0.2, 6);
    wl.x(fl, C.foam, 'opacity=".7"');
    R.add(wl.out());
    const scraps = [0, 1, 2, 3, 4].map((i) => ({ el: R.add(`<g>${scrap(c, 12 + (i % 2) * 4)}</g>`), i }));
    const splash = R.add(`<g opacity="0">${[-1, 1].map((sd) => `<path d="${c.cut([[0, 0], [sd * 20, -30], [sd * 30, -26], [sd * 12, 2]], 0.4, 4)}" fill="${C.foam}"/>`).join('')}</g>`);

    /* ---------- near bank ---------- */
    const N = S.layer({ par: P, sh: 4 });
    const nbFn = c.wave(708, [4, 2], [500, 150]);
    N.add(sheet().p(c.ridge(nbFn, -1300, 2600, 1700, 12, 1), C.sand2).out());
    N.add(grass(c, { x0: -1300, x1: 2600, y: 708, fn: nbFn, n: 40, h: 16, color: C.olive }) + rock(c, 640, 760, 70, 24, C.rock2));
    const nearL = crowd(S, N, [{ y: 772, s: 0.82, n: 3, x0: 400, x1: 640 }]);
    const nearR = crowd(S, N, [{ y: 774, s: 0.82, n: 3, x0: 980, x1: 1210 }]);
    nearL.forEach((m, i) => { m.from = m.x - 600; m.flip = false; });
    nearR.forEach((m, i) => { m.from = m.x + 600; m.flip = true; });
    const johnB = S.puppet(N.add(person(c, { ...JOHN_B })));
    const voice = voiceRings(N, c, { n: 3, color: C.clay, r: 40, w: 6 });

    /* ---------- labels ---------- */
    const T = S.layer({ par: P, sh: 5 });
    const tags = [
      { el: T.add(tagOnString(tr('sierść wielbłądzia', 'camel’s hair'), { size: 17, dx: 116, dy: 58 })), x: 660, y: 500, a: 4.15, b: 5.05 },
      { el: T.add(tagOnString(tr('pas skórzany', 'leather belt'), { size: 17, dx: -120, dy: 70 })), x: 960, y: 530, a: 4.35, b: 5.05 },
      { el: T.add(tagOnString(tr('szarańcza', 'locusts'), { size: 17, dx: 0, dy: 46 })), x: 655, y: 520, a: 5.15, b: 9 },
      { el: T.add(tagOnString(tr('miód leśny', 'wild honey'), { size: 17, dx: 0, dy: 36 })), x: 978, y: 452, a: 5.35, b: 9 },
    ];

    /* ---------- foreground reeds ---------- */
    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(reeds(c, 150, 960, 16, 260, C.moss) + reeds(c, 1480, 950, 14, 240, C.moss) + rock(c, 1360, 980, 220, 90, C.rock2));

    return (t, time) => {
      swing(sunEl, 1180, 170, time, 1, 0.6);
      swing(cl1, 560 + Math.sin(time * 0.1) * 25, 150, time, 1.2, 0.6, 1);
      flow.shift((time * 18) % 200 - 100, 0);

      /* v4: John comes out of the wilderness and preaches */
      const inW = es(t, 3.05, 3.12);       // swap to the John standing in the river
      const walkIn = es(t, 0.05, 0.75);
      const jbx = lerp(1260, JX, walkIn);
      const preach = es(t, 1.0, 1.25) * (1 - es(t, 2.9, 3.05));
      johnB.set({
        x: jbx, y: BANK, s: 1.05, flip: true, o: 1 - inW,
        walk: walkIn > 0 && walkIn < 1 ? jbx * 0.05 : undefined,
        armF: bump(t, 0.75, 1.1) * 40 + preach * (70 + Math.sin(time * 1.5) * 8), armB: preach * 150,
        head: -preach * 6, blink: blinkAt(time),
      });
      const [hx, hy] = headAt(jbx, BANK, 1.05, true);
      voice(hx, hy, preach * (1 - es(t, 2.2, 2.6)), time, { spread: 2.6 });

      /* the near crowds: first two travellers turn around, then everybody comes */
      nearL.forEach((m, i) => {
        let x, flip, walk;
        if (i < 2) {
          const away = seg(t, 0.2, 1.3), back = es(t, 1.45, 1.6);
          x = lerp(m.x + 60, m.x - 90, away) + back * 90 * es(t, 1.55, 2.2);
          flip = back < 0.5;
          walk = (away > 0 && away < 1 && back < 0.5) || (t > 1.55 && t < 2.2) ? x * 0.06 : undefined;
          flip = back < 0.5 ? true : false;
          const aside = es(t, 3.95, 4.45);
          x -= aside * 300;
          if (aside > 0 && aside < 1) { flip = true; walk = x * 0.06; }
          m.p.set({ x, y: m.y, s: m.s, flip, o: 1, walk, head: back * -4 + bump(t, 1.35, 1.6) * 10, armF: bump(t, 1.4, 1.8) * 40, blink: blinkAt(time, m.seed) });
          return;
        }
        const k = es(t, 2.05, 2.7);
        x = lerp(m.from, m.x, k);
        const aside = es(t, 3.95, 4.45);
        x -= aside * 300;
        m.p.set({ x, y: m.y, s: m.s, flip: aside > 0 && aside < 1, o: seg(t, 2.0, 2.1), walk: (k > 0 && k < 1) || (aside > 0 && aside < 1) ? x * 0.06 : undefined, blink: blinkAt(time, m.seed) });
      });
      nearR.forEach((m) => {
        const k = es(t, 2.1, 2.8);
        const aside = es(t, 3.95, 4.45);
        const x = lerp(m.from, m.x, k) + aside * 300;
        m.p.set({ x, y: m.y, s: m.s, flip: !(aside > 0 && aside < 1), o: seg(t, 2.05, 2.15), walk: (k > 0 && k < 1) || (aside > 0 && aside < 1) ? x * 0.06 : undefined, armF: es(t, 3.5, 3.9) * 20, head: es(t, 3.3, 3.6) * 6, blink: blinkAt(time, m.seed) });
      });

      /* v5: all Judea and Jerusalem come down to the river */
      pilgrims.forEach((m) => {
        const u = seg(t, 1.95 + m.i * 0.08, 2.75 + m.i * 0.08);
        const [x, y, back] = along(u);
        m.p.set({ x, y: y + 2, s: 0.13, flip: back, o: u > 0 && u < 1 ? 1 : 0, walk: u * 60 });
      });
      farCrowd.forEach((m) => {
        const k = es(t, 2.15 + m.d * 0.5, 2.75 + m.d * 0.5);
        const x = lerp(m.from, m.x, k);
        m.p.set({ x, y: m.y, s: m.s, flip: m.x > JX, o: seg(t, 2.1, 2.2), walk: k > 0 && k < 1 ? x * 0.06 : undefined, blink: blinkAt(time, m.seed) });
      });

      /* baptism in the Jordan; the confessed sins drift away downstream */
      const pour = bump(t, 3.25, 3.75);
      const outW = es(t, 4.0, 4.4);
      const comb = es(t, 5.1, 5.3), eat = es(t, 5.45, 5.75);
      johnW.set({
        x: JX, y: WADE, s: 1.05, flip: false, o: inW,
        armF: 30 + pour * 80 + comb * 40 + eat * 25, armB: 10 + comb * 50, head: pour * 8 + eat * 4 - bump(t, 4.2, 4.9) * 4,
        blink: blinkAt(time, 2),
      });
      fade(shellEl, 1 - es(t, 4.4, 4.6));
      fade(combEl, comb); fade(locEl, comb);
      pose(splash, { x: JX, y: 650, s: bump(t, 3.02, 3.3) * 1.3, o: bump(t, 3.02, 3.3) });
      const [px, py] = hand(JX, WADE, 1.05, false, 30 + pour * 80);
      const fall = (time * 1.6) % 1;
      pose(pourEl, { x: px + 12 + fall * 10, y: py + 6 + fall * 50, o: seg(t, 3.35, 3.45) * (1 - seg(t, 3.7, 3.78)) });
      const kIn = es(t, 3.0, 3.2);
      kneel.set({ x: 905 + outW * 400, y: WADE, s: 1, flip: true, o: kIn * (1 - outW), head: 10 + bump(t, 3.3, 3.8) * 6, armF: 60 - bump(t, 3.3, 3.8) * 30, armB: 40, blink: blinkAt(time, 4) });
      queue.forEach((q) => {
        const k = es(t, 3.05 + q.i * 0.08, 3.3 + q.i * 0.08);
        const x = q.x + (1 - k) * 200 + outW * 400;
        q.p.set({ x, y: WADE, s: 0.96, flip: true, o: k * (1 - outW), head: 8, armF: 40 + bump(t, 3.45 + q.i * 0.15, 3.8 + q.i * 0.15) * 50, walk: (k > 0 && k < 1) || (outW > 0 && outW < 1) ? x * 0.05 : undefined, blink: blinkAt(time, q.i + 5) });
      });
      scraps.forEach((sc) => {
        const from = sc.i === 0 ? [915, 600] : sc.i < 3 ? [queue[sc.i - 1].x + 20, 570] : [sc.i === 3 ? 560 : 1060, 660];
        const a = sc.i === 0 ? 3.35 : sc.i < 3 ? 3.5 + (sc.i - 1) * 0.15 : 3.6 + (sc.i - 3) * 0.1;
        const drop = es(t, a, a + 0.12, ease.in), drift = seg(t, a + 0.1, a + 1.3);
        const x = from[0] + drift * (700 + sc.i * 60), y = lerp(from[1], 664 + (sc.i % 3) * 8, drop) + Math.sin(drift * 12 + sc.i) * 3;
        pose(sc.el, { x, y, r: drift * 160 + sc.i * 40, s: seg(t, a - 0.05, a) * (1 - drift * 0.5), o: seg(t, a - 0.05, a) * (1 - seg(t, a + 0.9, a + 1.3)) });
      });

      /* v6: camel's hair and a leather belt — a camel ambles past; locusts and wild honey */
      const cw = seg(t, 3.95, 5.1);
      const cx = lerp(1500, 180, cw);
      pose(camelEl, { x: cx, y: fbFn(cx) + 8, s: 0.72, sx: -0.72, sy: 0.72, o: cw > 0 && cw < 1 ? 1 : 0 });
      walkCamel(camelEl, cx * 0.06, cw > 0 && cw < 1 ? 1 : 0);
      tags.forEach((tg) => {
        const k = es(t, tg.a, tg.a + 0.3, ease.out), up = es(t, tg.b, tg.b + 0.3, ease.in);
        swing(tg.el, tg.x, lerp(-300, tg.y, k) - up * 700, time, 1.4, 0.9, tg.a);
        fade(tg.el, k > 0 && up < 1 ? 1 : 0);
      });
      locusts.forEach((l) => {
        const hop = Math.max(0, Math.sin((t - 5.05) * 9 + l.i * 1.7)) * es(t, 5.05, 5.2);
        const on = seg(t, 5.0, 5.1);
        pose(l.el, { x: l.x + Math.sin((t - 5) * 3 + l.i) * 20 * on, y: l.y - hop * 22, r: -hop * 20, s: 0.55, o: on });
      });
      bees.forEach((b) => {
        const on = seg(t, 5.2, 5.35);
        const a = time * (1.6 + b.i * 0.2) + b.ph;
        pose(b.el, { x: 977 + Math.cos(a) * b.r, y: fbFn(975) - 60 + Math.sin(a * 1.3) * b.r * 0.6, s: 1.1, o: on });
      });

      /* camera: widen for the crowds, close in on John for his clothes and food */
      const close = es(t, 4.0, 4.6);
      S.cam.z = 1.02 - es(t, 1.9, 2.4) * 0.1 + es(t, 2.9, 3.3) * 0.1 + close * 1.3;
      S.cam.x = -es(t, 1.9, 2.4) * 140 * (1 - es(t, 2.9, 3.3)) + close * 20;
      S.cam.y = 30 + close * 190 - es(t, 5.0, 5.4) * 50;
    };
  },
};
