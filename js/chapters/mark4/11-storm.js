// Mk 4,35–41 — the storm on the lake, and the great calm.
// Skies, darkness, waves and rain are whole sheets that fade and slide on the compositor;
// only the boat and the people in it are redrawn while the storm rages.
import { C, person, CAST, blinkAt, pose, lerp, sky, crowd, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waveStrip, stars, moon, sun, rock, reeds, palm } from '../../assets/nature.js';
import { boat, stormCloud, lightning, rain, rays, paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';

const BOAT_PAR = 0.6;

/** tall, peaked storm waves with curling foam caps; one period = len */
function stormWaves(c, { y, len = 220, amp = 70, x0 = -1400, x1 = 3000, color, cap = C.foam }) {
  const s = sheet();
  const pts = [[x0, y + 400]];
  let caps = '';
  for (let x = x0; x <= x1; x += len) {
    const h = amp * c.rr(0.8, 1.15);
    pts.push([x, y], [x + len * 0.35, y - h * 0.55], [x + len * 0.52, y - h], [x + len * 0.6, y - h * 0.82], [x + len * 0.72, y - h * 0.35], [x + len, y]);
    caps += c.ribbon([[x + len * 0.3, y - h * 0.46], [x + len * 0.42, y - h * 0.8], [x + len * 0.52, y - h + 2], [x + len * 0.6, y - h * 0.84], [x + len * 0.64, y - h * 0.62], [x + len * 0.6, y - h * 0.5]], (u) => 2 + Math.sin(u * Math.PI) * 7);
  }
  pts.push([x1 + len, y + 400], [x1 + len, 1900], [x0, 1900]);
  s.p(c.cut(pts, 1.2, 14), color);
  s.x(caps, cap, 'opacity=".85"');
  return s.out();
}
function bucket(c) {
  return sheet().p(c.cut([[-11, -2], [11, -2], [8, 18], [-8, 18]], 0.3, 4), C.wood3).x(c.ribbon(c.arc(0, -2, 11, 9, Math.PI, 2 * Math.PI, 8), 1.4), C.wood2).out();
}

export default {
  id: 'storm',
  beats: [
    { v: 35 },
    { v: 36, text: 'Zostawili więc tłum, a Jego zabrali, tak jak był w łodzi.' },
    { v: 36, cont: true, text: 'Także inne łodzie płynęły z Nim.' },
    { v: 37, text: 'Naraz zerwał się gwałtowny wicher.' },
    { v: 37, cont: true, text: 'Fale biły w łódź, tak że łódź już się napełniała.' },
    { v: 38, text: 'On zaś spał w tyle łodzi na wezgłowiu.' },
    { v: 38, cont: true, text: 'Zbudzili Go i powiedzieli do Niego: «Nauczycielu, nic Cię to nie obchodzi, że giniemy?»' },
    { v: 39, text: 'On wstał, rozkazał wichrowi i rzekł do jeziora: «Milcz, ucisz się!».' },
    { v: 39, cont: true, text: 'Wicher się uspokoił i nastała głęboka cisza.' },
    { v: 40 },
    { v: 41 },
  ],
  cam: { x: [-260, 420], y: [-60, 90], z: [0.78, 1.42] },
  build(S) {
    const c = S.c;
    // phone: the sun and moon (and the moon's path on the water) hang inward, and the camera does not turn
    // towards the stern (the sleeper is already central) so the disciples at the bow stay clear of the thread
    const P = S.portrait, SUNX = P ? 1040 : 1180, MOONX = P ? 990 : 1120, STERN = P ? 0 : 210;
    /* ---------- three skies, crossfaded on the compositor ---------- */
    sky(S, ['#8f86ad', '#e3a58e', '#f3c79e'], { name: 'dusk' });
    const stormSky = sky(S, ['#2f3653', '#4a5373', '#6b7390'], { name: 'storm' }).layer;
    const nightSky = sky(S, ['#141a3d', '#26306a', '#4b5791'], { name: 'night' }).layer;

    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 420, n: 140 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: SUNX, y: 330, len: 900 });
    const moonEl = hanging(hangL, `<circle r="120" fill="url(#halo-glow)" opacity=".55"/>${moon(c, 42)}`, { x: MOONX, y: 170, len: 900 });

    // storm clouds come down on strings
    const cloudL = S.layer({ par: 0.08, sh: 7 });
    const clouds = [[250, 90, 520], [700, 40, 620], [1150, 110, 560], [1550, 60, 520], [-150, 70, 480], [950, 190, 380]].map(([x, y, w], i) => ({ el: hanging(cloudL, stormCloud(c, w, i % 2 ? '#7a82a2' : '#687092', i % 2 ? '#5f6789' : '#555d7e'), { x, y, len: 1200 }), x, y, i }));
    const boltEl = cloudL.add(`<g>${lightning(c, 330)}</g>`);

    /* ---------- far shore & departing shore ---------- */
    const far = S.layer({ par: 0.12, sh: 2 });
    far.add(band(c, { y: 440, amps: [14, 7, 3], lens: [1100, 380, 140], color: '#b9a7b4', x0: -1400, x1: 3000 }).markup);
    const shoreL = S.layer({ par: 0.3, sh: 3 });
    const sfn = (x) => 520 + Math.max(0, x - 260) * 0.5;
    const shorePts = [];
    for (let x = -1400; x <= 480; x += 14) shorePts.push([x, Math.min(640, sfn(x)) + c.rr(-1.5, 1.5)]);
    shorePts.push([480, 1900], [-1400, 1900]);
    shoreL.add(sheet().p(c.poly(shorePts), C.sand).out());
    shoreL.add(palm(c, 60, 522, 190) + palm(c, -180, 520, 170) + rock(c, 330, 560, 60, 24));
    const people = crowd(S, shoreL, [{ y: 520, s: 0.34, n: 12, x0: -420, x1: 240 }, { y: 545, s: 0.4, n: 7, x0: -300, x1: 330 }]);

    /* ---------- water, the other boats ---------- */
    const water = S.layer({ par: 0.34, sh: 2 });
    water.add(band(c, { y: 505, amps: [3, 1.5], lens: [300, 90], color: C.lake2, x0: -1400, x1: 3200, step: 10, j: 0.6 }).markup);
    const glitter = water.add(`<g>${Array.from({ length: 22 }, (_, i) => `<path d="${c.cut([[-26 + c.rr(-10, 10), 0], [0, -2], [26 + c.rr(-10, 10), 0], [0, 1.6]], 0.2, 6)}" fill="#fff1c4" transform="translate(${1120 + c.rr(-30, 30) * (1 + i * 0.1)} ${520 + i * 16})"/>`).join('')}</g>`);
    // phone: the other boats sail inside the narrow frame (on desktop they sit beyond its edges)
    const others = (P ? [[455, 554, 0.3], [960, 546, 0.28], [540, 594, 0.36]] : [[-60, 560, 0.34], [1520, 548, 0.28], [300, 585, 0.4]]).map(([x, y, s], i) => {
      const b = boat(c, { mast: true, hull: i === 1 ? C.wood2 : C.wood3, stripe: i === 2 ? C.dustyBlue : C.terracotta });
      return { el: water.add(`<g>${b.back}${b.front}</g>`), x, y, s, i };
    });
    const tintBack = S.layer({ par: 0.35, sh: 1, flat: true });
    tintBack.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1c2250"/>`);

    /* ---------- waves behind the boat ---------- */
    const wBackCalm = S.layer({ par: 0.5, sh: 3, pad: 200 });
    wBackCalm.add(waveStrip(c, { y: 640, len: 170, amp: 10, color: C.lake3 }));
    const wBackStorm = S.layer({ par: 0.5, sh: 5, pad: 260 });
    wBackStorm.add(stormWaves(c, { y: 660, len: 240, amp: 90, color: C.waveStorm }));

    /* ---------- the boat ---------- */
    const boatL = S.layer({ par: BOAT_PAR, sh: 5 });
    const burst = boatL.add(`<g>${rays(c, { n: 18, r0: 40, r1: 620, spread: 0.05, color: '#fff3cf' })}<circle r="150" fill="url(#halo-glow)"/></g>`);
    const B = boat(c, { cushion: true, mast: true });
    const water_in = sheet().p(c.cut([[-165, -8], ...Array.from({ length: 12 }, (_, i) => [-160 + i * 29, -14 + Math.sin(i * 1.3) * 4]), [172, -8], [150, 6], [-150, 6]], 0.6, 8), C.waveStorm).x(c.ribbon(Array.from({ length: 13 }, (_, i) => [-170 + i * 29, -15 + Math.sin(i * 1.3) * 4]), 3), C.foam, 'opacity=".8"').out();
    const dis = [
      { k: 'john', x: -38, cast: CAST.john },
      { k: 'james', x: 25, cast: CAST.james, bail: true },
      { k: 'peter', x: 78, cast: CAST.peter },
      { k: 'andrew', x: 128, cast: CAST.andrew, bail: true },
    ];
    const boatG = boatL.add(`<g>
      <g>${B.back}</g>
      <g data-k="lie">${person(c, { ...CAST.jesus, eyes: 'closed' })}</g>
      <g data-k="water">${water_in}</g>
      <g data-k="jstand">${person(c, { ...CAST.jesus })}</g>
      ${dis.map((d) => `<g data-k="d-${d.k}">${person(c, { ...d.cast, holdF: d.bail ? `<g transform="translate(0 4)">${bucket(c)}</g>` : '' })}</g>`).join('')}
      <g>${B.front}</g>
      <g data-k="zzz">${['z', 'z', 'Z'].map((z, i) => `<g class="z" data-i="${i}">${paperLabel(z, { size: 18 + i * 5 })}</g>`).join('')}</g>
    </g>`);
    const jLie = S.puppet(S.$('lie').firstElementChild);
    const jStand = S.puppet(S.$('jstand').firstElementChild);
    const waterIn = S.$('water');
    const zs = Array.from(S.$('zzz').querySelectorAll('.z'));
    dis.forEach((d) => { d.p = S.puppet(S.$('d-' + d.k).firstElementChild); d.seed = c.rr(0, 6); });

    /* ---------- front waves, rain, darkness, lightning ---------- */
    const wFrontCalm = S.layer({ par: 0.75, sh: 4, pad: 200 });
    wFrontCalm.add(waveStrip(c, { y: 770, len: 160, amp: 11, color: C.lake2 }));
    const moonPath = water.add(`<g>${Array.from({ length: 12 }, (_, i) => `<path d="${c.cut([[-40, 0], [0, -2.4], [40, 0], [0, 1.8]], 0.2, 8)}" fill="#f5ecd6" transform="translate(${c.rr(-20, 20)} ${i * 22}) scale(${1 - i * 0.05} 1)"/>`).join('')}</g>`);
    const wFrontStorm = S.layer({ par: 0.8, sh: 6, pad: 300 });
    wFrontStorm.add(stormWaves(c, { y: 780, len: 280, amp: 120, color: C.waveStorm2 }));
    const wFrontStorm2 = S.layer({ par: 0.95, sh: 7, pad: 320 });
    wFrontStorm2.add(stormWaves(c, { y: 900, len: 320, amp: 130, color: shade(C.waveStorm2, -0.15) }));
    const rainL = S.layer({ par: 0.9, sh: 1, flat: true, pad: 420 });
    rainL.add(rain(c, { x0: -1400, x1: 3000, y0: -900, y1: 1500, n: 420, slant: -46 }));
    const tintFront = S.layer({ par: 0, sh: 1, flat: true });
    tintFront.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#141a40"/>`);
    const flashL = S.layer({ par: 0, sh: 1, flat: true });
    flashL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#f4f1ff"/>`);

    return (t, time) => {
      /* how stormy / how night is it? */
      const storm = es(t, 3, 3.6) * (1 - es(t, 8, 8.7));
      const night = es(t, 7.9, 8.8);
      const dusk = 1 - es(t, 2, 3.4);
      stormSky.fade(storm);
      nightSky.fade(night);
      starL.fade(night * (1 - storm));
      tintBack.fade(Math.min(0.62, 0.12 + (1 - dusk) * 0.15 + storm * 0.4 + night * 0.28));
      tintFront.fade(storm * 0.26 + night * 0.16);
      const T = time;
      const flicker = Math.pow(Math.max(0, Math.sin(T * 1.9) * Math.sin(T * 0.7)), 30);
      const flash = Math.max(bump(t, 3.25, 3.4), bump(t, 3.7, 3.8) * 0.7, bump(t, 4.45, 4.55) * 0.8, flicker * storm * 0.8);
      flashL.fade(flash * 0.5);
      pose(boltEl, { x: 620 + Math.round(t * 3) % 3 * 180, y: 140, o: flash > 0.25 ? 1 : 0 });

      /* the sun goes down, the moon comes out after the storm */
      swing(sunEl, SUNX, 330 + es(t, 0, 3) * 330, T, 1, 0.6);
      swing(moonEl, MOONX, 170 - (1 - night) * 700, T, 0.8, 0.5, 1);
      clouds.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.3 + cl.i) * 30 * storm, cl.y - (1 - storm) * 900 + cl.i * 5, T, 2.5 * storm + 0.3, 0.9, cl.i));

      /* camera: sail away from the shore, zoom in on the sleeper, pull back into the calm */
      const travel = es(t, 1, 2.6) * 380;
      const toStern = es(t, 4.8, 5.4) - es(t, 9.2, 9.8) * 0.4;
      S.cam.x = travel + toStern * -STERN;
      S.cam.z = 1.05 + es(t, 4.8, 5.4) * 0.33 - es(t, 6.6, 7.1) * 0.18 - es(t, 9.9, 10.9) * 0.4;
      S.cam.y = 30 + es(t, 4.8, 5.4) * 40 - es(t, 9.9, 10.9) * 60;

      /* the crowd on the shore waves goodbye */
      people.forEach((m, i) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: false, armF: bump(t, 0.9 + (i % 5) * 0.08, 2.4) * (100 + Math.sin(T * 5 + i) * 25), blink: blinkAt(T, m.seed) }));
      fade(glitter, dusk * 0.8);
      others.forEach((o) => {
        const inn = es(t, 1.9 + o.i * 0.12, 2.5 + o.i * 0.12), lost = es(t, 3.1, 3.7);
        pose(o.el, { x: o.x + travel * 0.55 + (1 - inn) * -260, y: o.y + Math.sin(T * 1.3 + o.i) * 2 + storm * Math.sin(T * 2 + o.i) * 10, s: o.s, r: storm * Math.sin(T * 1.6 + o.i) * 7, o: inn * (1 - lost * 0.8) });
      });

      /* waves: calm strips give way to storm crests that rise from below */
      const rise = storm;
      wBackCalm.shift(((T * 20) % 170) - 85, rise * 60);
      wBackStorm.shift(((T * 90 * (0.3 + storm)) % 240) - 120, (1 - rise) * 260 - Math.sin(T * 1.5) * 12 * rise);
      wFrontCalm.shift(85 - ((T * 16) % 160), rise * 80);
      wFrontStorm.shift(140 - ((T * 120 * (0.3 + storm)) % 280), (1 - rise) * 320 - Math.sin(T * 1.8 + 1) * 18 * rise);
      wFrontStorm2.shift(((T * 150 * (0.3 + storm)) % 320) - 160, (1 - es(t, 3.9, 4.5) * (1 - es(t, 8, 8.7))) * 360 - Math.sin(T * 2.1) * 20 * rise);
      const wv = Math.min(1, rise * 4);
      wBackStorm.fade(wv); wFrontStorm.fade(wv); wFrontStorm2.fade(wv);
      rainL.shift(-((T * 260) % 400) * 0.8 + 200, ((T * 900) % 400) - 200);
      rainL.fade(es(t, 3.4, 4) * (1 - es(t, 7.9, 8.4)));
      fade(moonPath, night * (1 - storm));
      pose(moonPath, { x: MOONX + S.cam.x * 0.3, y: 514 });

      /* the boat rocks with the storm */
      const bx = 800 + travel * BOAT_PAR, by = 700;
      const rock_ = storm * (Math.sin(T * 1.7) * 7 + Math.sin(T * 0.9) * 4) + (1 - storm) * Math.sin(T * 1.1) * 0.8;
      const heave = storm * Math.sin(T * 1.3) * 16 + Math.sin(T * 1.4) * 2;
      pose(boatG, { x: bx, y: by + heave, s: 1.15, r: rock_ + storm * 4 });
      const fill = es(t, 4.1, 4.9) * (1 - es(t, 8.2, 9.4));
      pose(waterIn, { y: 30 - fill * 62 + Math.sin(T * 3) * 2 * storm, o: fill > 0.02 ? 1 : 0 });

      /* Jesus: standing at the stern → asleep on the cushion → standing, commanding → calm */
      const asleep = es(t, 2.55, 2.62) * (1 - es(t, 7.02, 7.09)); // swap the cut-outs quickly, like a puppeteer
      const cmd = es(t, 7.05, 7.5) * (1 - es(t, 8.6, 9.2));
      const turn = es(t, 9, 9.4);
      jStand.set({
        x: -118, y: -8, s: 0.98, o: 1 - asleep, flip: false,
        armF: bump(t, -0.2, 1.6) * 90 + cmd * 85 + turn * 55,
        armB: cmd * 150 + turn * 10, head: -cmd * 8 + turn * 4, blink: blinkAt(T),
      });
      jLie.set({ x: 4, y: -36 + Math.sin(T * 1.2) * 0.6, s: 0.84, r: -90, o: asleep, armF: 20, armB: 10 });
      zs.forEach((z, i) => {
        const k = ((T * 0.45 + i / 3) % 1);
        pose(z, { x: -160 + i * 16 + k * 20, y: -110 - k * 60 - i * 10, s: 1, o: asleep * es(t, 4.8, 5.2) * (1 - es(t, 5.9, 6.2)) * Math.sin(k * Math.PI) });
      });
      pose(burst, { x: bx - 118 * 1.15, y: by - 190 * 1.15 + heave, s: 0.25 + es(t, 7.2, 7.8) * 0.75, r: T * 5, o: bump(t, 7.15, 8.9) * 0.38 });

      /* the disciples: row, bail, panic, wake Him, then whisper in awe */
      dis.forEach((d, i) => {
        const bail = d.bail ? es(t, 4.1, 4.4) * (1 - es(t, 6.2, 6.5)) : 0;
        const panic = es(t, 6, 6.3) * (1 - es(t, 8.2, 8.7));
        const wake = d.k === 'peter' ? bump(t, 6, 7.1) : 0;
        const awe = es(t, 9.8, 10.3);
        const lean = storm * Math.sin(T * 1.7 + d.seed) * 6;
        d.p.set({
          x: d.x - wake * 30, y: 4, s: 0.95, flip: panic > 0.5 || turn > 0.5 || awe > 0.5 ? true : false,
          armF: 20 + bail * (60 + Math.sin(T * 7 + d.seed) * 60) + panic * (d.bail ? 0 : 55 + Math.sin(T * 9 + i) * 12) + wake * 35 + awe * (i % 2 ? 70 : 20),
          armB: 10 + panic * (d.bail ? 40 : 150 + Math.sin(T * 8 + i) * 10) + awe * (i % 2 ? 0 : 60),
          head: -panic * 8 + awe * (i % 2 ? 10 : -6) + lean * 0.5, lean: lean - awe * (i % 2 ? 5 : -5), blink: blinkAt(T, d.seed),
        });
      });
    };
  },
};
