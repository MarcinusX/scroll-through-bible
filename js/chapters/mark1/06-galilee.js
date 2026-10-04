// Mk 1,14–15 — John is shut behind bars; the prison flat flies up and Jesus walks into green Galilee,
// proclaiming: the hourglass runs full, the light of the Kingdom rises, flowers open,
// and people who were walking away turn around and come to Him.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, olive, cypress, grass, flowers, sun, cloud, town, bush } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { JOHN_B, headAt, voiceRings, prisonWall, bars, hourglassParts, hang2, sparkle } from './lib.js';

const PI = Math.PI;
const P = 0.5;
const GY = 742;
const JX = 800;

export default {
  id: 'm1-galilee',
  beats: [
    { v: 14, text: 'Gdy Jan został uwięziony,' },
    { v: 14, cont: true, text: 'Jezus przyszedł do Galilei i głosił Ewangelię Bożą. Mówił:' },
    { v: 15, text: '«Czas się wypełnił i bliskie jest królestwo Boże.' },
    { v: 15, cont: true, text: 'Nawracajcie się i wierzcie w Ewangelię!»' },
  ],
  cam: { x: [-30, 30], y: [-20, 50], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;   // phone: the hourglass and the listeners come inward
    const HGX = PH ? 965 : 1040;
    sky(S, ['#c4dcd6', '#e9eed8', '#f4ecd2']);

    /* ---------- the light of the Kingdom rises behind the hills ---------- */
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const kGlow = hangL.add(`<circle r="420" fill="url(#warm-glow)" opacity="0"/>`);
    const kRays = hangL.add(`<g opacity="0">${rays(c, { n: 18, r0: 60, r1: 900, spread: 0.045, color: '#fff3cf' })}</g>`);
    const sunEl = hanging(hangL, sun(c, 60), { x: 800, y: 560, len: 900 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 480, y: 160, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 1130, y: 200, len: 700 });
    const hg = hourglassParts(c, 130);
    const glassEl = hanging(hangL, `<g>${hg.frame}<g data-k="hgTop">${hg.top}</g><g data-k="hgBot" transform="translate(0 ${hg.h / 2 - 10})">${hg.bottom}</g><g data-k="hgStream">${hg.stream}</g></g><g data-k="hgShine" opacity="0">${sparkle(c, 22)}</g>`, { x: HGX, y: 250, len: 700 });
    const hgTop = S.$('hgTop'), hgBot = S.$('hgBot'), hgStream = S.$('hgStream'), hgShine = S.$('hgShine');

    /* ---------- Galilee: the lake far off, hills, a village ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [14, 6, 3], lens: [1000, 330, 120], color: C.hillFar }).markup);
    const lakeL = S.layer({ par: 0.12, sh: 2 });
    lakeL.add(waterBand(c, { y: 470, color: C.lake, foamN: 14 }).markup);
    const hills = S.layer({ par: 0.22, sh: 3 });
    const h2 = hillsWith(c, { y: 530, amps: [22, 9, 3], lens: [900, 300, 110], color: C.hillMid, trees: 26, treeColor: C.sage, treeH: 24 });
    hills.add(h2.markup + town(c, { x: 360, y: h2.fn(360) + 10, n: 7, spread: 260, sc: 0.55 }) + town(c, { x: 1300, y: h2.fn(1300) + 10, n: 5, spread: 200, sc: 0.5 }));
    const G = S.layer({ par: P, sh: 3 });
    const gfn = c.wave(626, [8, 3], [800, 200]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.hillNear).out());
    G.add(grass(c, { x0: -900, x1: 2500, y: 626, fn: gfn, n: 60, h: 18, color: C.moss }) + olive(c, 260, 650, 1.1) + olive(c, 1370, 656, 1) + cypress(c, 1180, 640, 150) + bush(c, 480, 650, 70, C.sage, C.moss));
    // flowers that open while He speaks
    const blooms = Array.from({ length: 22 }, (_, i) => {
      const x = c.rr(260, 1360), y = c.rr(650, 770);
      return { el: G.add(`<g>${flowers(c, { x0: -6, x1: 6, y: 0, n: 3, h: 22 })}</g>`), x, y, d: c.rr(0, 0.5), i };
    });

    /* ---------- people ---------- */
    const PL = S.layer({ par: P, sh: 4 });
    const folk = crowd(S, PL, [{ y: 700, s: 0.72, n: 6, x0: 330, x1: 700 }, { y: 706, s: 0.72, n: 6, x0: 900, x1: 1290 }, { y: 760, s: 0.86, n: 4, x0: 400, x1: 1220 }])
      .filter((m) => Math.abs(m.x - JX) > 110);
    if (PH) folk.forEach((m) => { const d = Math.abs(m.x - JX); m.x = JX + Math.sign(m.x - JX) * (92 + (d - 110) * 0.42); });
    folk.forEach((m, i) => { m.away = i % 3 === 0; m.side = m.x < JX ? -1 : 1; m.d = c.rr(0, 0.4); });
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(PL, c, { n: 3, color: C.clay, r: 40, w: 6 });

    /* ---------- darkness while John is in prison ---------- */
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#2a2338"/>`);
    const prison = S.layer({ par: 0.3, sh: 8, pad: 1400 });
    const at = (m) => prison.add(`<g transform="translate(${JX} 470)">${m}</g>`).firstElementChild;
    prison.add(`<g transform="translate(${JX} 470)">${hang2(`<rect x="-100" y="-150" width="200" height="190" fill="#231d2c"/>`, 300, 900)}</g>`);
    const lightPatch = at(`<path d="${c.poly([[-60, -140], [-20, -140], [40, 40], [0, 40]])}" fill="#f7e2a6" opacity=".18"/>`);
    const john = S.puppet(at(`<g transform="translate(0 ${-60 + 175 * 1.1})">${person(c, { ...JOHN_B })}</g>`).firstElementChild);
    at(prisonWall(c, { w: 720, h: 560, win: { x: 0, y: -60, w: 190, h: 170 } }));
    const barsEl = at(`<g>${bars(c, 190, 190)}</g>`);
    const dust = at(`<g opacity="0">${[-1, 1].map((sd) => `<path d="${c.cut(c.blob(sd * 70, 0, 26, 9, 9, 0.3), 0.6, 4)}" fill="${C.stone}"/>`).join('')}</g>`);

    const fg = S.layer({ par: 0.9, sh: 7 });
    fg.add(bush(c, 140, 980, 220, C.moss, C.sage) + bush(c, 1470, 985, 200, C.moss2, C.sage) + grass(c, { x0: -600, x1: 400, y: 960, n: 20, h: 40, color: C.moss2 }) + grass(c, { x0: 1250, x1: 2200, y: 960, n: 20, h: 40, color: C.moss2 }));

    return (t, time) => {
      /* v14a: John behind bars */
      const slam = es(t, 0.12, 0.34, ease.in);
      pose(barsEl, { x: 0, y: lerp(-190, 31, slam), o: 1 });
      pose(dust, { x: 0, y: 36, s: 0.5 + bump(t, 0.32, 0.6), o: bump(t, 0.32, 0.6) });
      const sad = es(t, 0.4, 0.8);
      john.set({ x: 0, y: 0, s: 1.1, flip: false, armF: 20 + bump(t, 0.3, 0.6) * 60, armB: 10, head: sad * 16, blink: blinkAt(time, 1) });
      fade(lightPatch, 0.18 - sad * 0.08);
      const lift = es(t, 1.0, 1.3, ease.in);
      prison.shift(0, -lift * 1350 + bump(t, 0.3, 0.42) * 6);
      prison.fade(1 - seg(t, 1.25, 1.3));
      tint.fade(0.62 * (1 - es(t, 0.95, 1.3)));

      /* v14b: Jesus comes into Galilee and proclaims */
      const walk = es(t, 1.1, 1.6);
      const jx = lerp(1330, JX, walk);
      const speak = es(t, 1.62, 1.8);
      const lift2 = es(t, 2.1, 2.35);
      const call = es(t, 3.05, 3.3);
      jesus.set({
        x: jx, y: GY, s: 1.08, flip: walk < 1 && walk > 0, o: seg(t, 1.05, 1.12),
        walk: walk > 0 && walk < 1 ? jx * 0.045 : undefined,
        armF: 16 + speak * 50 + lift2 * 30 - call * 10 + Math.sin(time * 1.4) * 5 * speak, armB: 10 + speak * 30 + lift2 * 100 - call * 40,
        head: -speak * 4, blink: blinkAt(time),
      });
      const [hx, hy] = headAt(jx, GY, 1.08);
      voice(hx, hy, speak * (1 - es(t, 3.9, 4.1)), time, { spread: 2.8 });

      /* people gather; at "repent" those walking away turn around and come */
      folk.forEach((m) => {
        const arrive = es(t, 1.3 + m.d, 1.8 + m.d);
        const turn = es(t, 3.15 + m.d * 0.6, 3.3 + m.d * 0.6);
        let x = m.x + (1 - arrive) * m.side * 500, flip = m.x > JX, walk;
        if (arrive > 0 && arrive < 1) { flip = m.side < 0 ? false : true; walk = x * 0.06; }
        if (m.away) {
          // they listen with their backs turned… until the call to turn around
          flip = m.side < 0 ? turn < 0.5 : turn >= 0.5 ? true : false;
          if (m.side < 0) flip = turn < 0.5; else flip = turn >= 0.5;
          const come = es(t, 3.3 + m.d * 0.6, 3.75 + m.d * 0.6);
          x = m.x + m.side * ((PH ? 30 : 60) - come * (PH ? 60 : 90)) + (1 - arrive) * m.side * 500;
          if ((come > 0 && come < 1) || (arrive > 0 && arrive < 1)) walk = x * 0.06;
        }
        const glad = es(t, 3.5, 3.9);
        m.p.set({ x, y: m.y, s: m.s, flip, o: seg(t, 1.25 + m.d, 1.35 + m.d), walk, armF: m.away ? glad * 60 : bump(t, 2.3 + m.d, 2.9) * 30 + glad * 20, armB: m.away ? glad * 40 : 0, head: m.away && turn < 0.5 ? 6 : -glad * 6, blink: blinkAt(time, m.seed) });
      });

      /* v15a: the time is fulfilled — the hourglass runs full; the Kingdom's light rises */
      const hgIn = es(t, 1.9, 2.15, ease.out);
      swing(glassEl, HGX, lerp(-300, 250, hgIn), time, 1.2, 0.7);
      fade(glassEl, hgIn > 0 ? 1 : 0);
      const run = es(t, 2.1, 2.6);
      pose(hgTop, { s: 1 - run, ox: 0, oy: -4, x: 0, y: -4 });
      pose(hgBot, { x: 0, y: hg.h / 2 - 10, s: 0.05 + run * 0.95 });
      fade(hgStream, run > 0 && run < 1 ? 1 : 0);
      const shine = bump(t, 2.55, 3.1);
      pose(hgShine, { x: 30, y: -40, s: shine * 1.4, r: time * 40, o: shine });
      const dawn = es(t, 2.35, 2.9);
      swing(sunEl, 800, lerp(620, 470, dawn), time, 0.8, 0.5);
      pose(kGlow, { x: 800, y: lerp(620, 470, dawn), s: 0.5 + dawn * 0.9, o: dawn * 0.9 });
      pose(kRays, { x: 800, y: lerp(620, 470, dawn), s: 0.4 + dawn * 0.7, r: t * 5, o: dawn * 0.35 });
      swing(cl1, 480 - dawn * 60 + Math.sin(time * 0.1) * 20, 160, time, 1.2, 0.6, 1);
      swing(cl2, 1130 + dawn * 60 + Math.sin(time * 0.12 + 1) * 20, 200, time, 1.2, 0.7, 2);
      blooms.forEach((b) => {
        const k = es(t, 2.4 + b.d, 2.65 + b.d, ease.back);
        pose(b.el, { x: b.x, y: b.y, s: k * 1.4, o: k > 0 ? 1 : 0 });
      });

      S.cam.z = 1.04 + es(t, 1.6, 2.0) * 0.04 - es(t, 3.0, 3.5) * 0.04;
      S.cam.y = 20;
    };
  },
};
