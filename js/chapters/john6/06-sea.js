// J 6,16–21 — at dusk the disciples go down to the shore, push off and set out across the sea for Capernaum.
// Night falls; Jesus is not with them (far away on the mountain, alone, a small light). A strong wind; the sea
// rises. They row — cork floats count off twenty-five, thirty stadia — and they see Jesus walking on the sea,
// coming near: terror. "It is I — do not be afraid": a great golden light, the words hung in gold, the storm
// lies down. They want to take Him in — and at once the boat is at the shore where they were going.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, waveStrip, stars, moon, cloud, house, cypress, grass } from '../../assets/nature.js';
import { boat, rays } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { DUSK, NIGHT, LOOK, TW, oar, floatTag, labelTag, speech, GLYPH, heart, hungGold, glowDisc, rayBurst, headAt, kf, moving, tr, PI } from './lib.js';

const BX = 760, BY = 704;       // the boat at sea
const JY = 712;                  // Jesus' feet on the water

function windLines(c, n = 60) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = c.rr(-1400, 3000), y = c.rr(-200, 1100), l = c.rr(60, 160);
    d += c.ribbon(c.qbez([x, y], [x + l / 2, y - c.rr(4, 10)], [x + l, y], 8), (u) => Math.sin(u * PI) * 4 + 0.5);
  }
  return `<path d="${d}" fill="#e8eef6" opacity=".7"/>`;
}

export default {
  id: 'j6-sea',
  beats: [
    { v: 16 },
    { v: 17, text: 'i wsiadłszy do łodzi przeprawili się przez nie do Kafarnaum.' },
    { v: 17, cont: true, text: 'Nastały już ciemności, a Jezus jeszcze do nich nie przyszedł;' },
    { v: 18 },
    { v: 19, text: 'Gdy upłynęli około dwudziestu pięciu lub trzydziestu stadiów,' },
    { v: 19, cont: true, text: 'ujrzeli Jezusa kroczącego po jeziorze i zbliżającego się do łodzi.' },
    { v: 19, cont: true, text: 'I przestraszyli się.' },
    { v: 20 },
    { v: 21, text: 'Chcieli Go zabrać do łodzi,' },
    { v: 21, cont: true, text: 'ale łódź znalazła się natychmiast przy brzegu, do którego zdążali.' },
  ],
  cam: { x: [-40, 60], y: [-20, 60], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DUSK, { name: 'dusk' });
    const night = sky(S, NIGHT, { name: 'night' });
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -400, y1: 430, n: 150 }));
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const moonEl = hanging(hangL, `<circle r="120" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 36)}`, { x: 0, y: 0, len: 900 });
    const clouds = [[420, 130, 380], [1120, 100, 420], [780, 180, 320]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, sheet().p(c.cut(c.blob(0, 0, w / 2, w * 0.13, 14, 0.2), 1.2, 8), i % 2 ? '#3d4670' : '#4a5380').out(), { x, y, len: 900 }) }));

    /* far hills; the mountain where He prays alone; Capernaum far off */
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 452, amps: [12, 6, 3], lens: [1100, 380, 140], color: '#8a7f98' }).markup);
    far.add(sheet().p(c.cut([[180, 470], [420, 336], [480, 318], [540, 336], [760, 470]], 1.2, 10), '#6f6886').out());
    const farJ = S.puppet(far.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const farGlow = far.add(`<g>${glowDisc(60, 'halo-glow', 1)}</g>`);
    const capLights = far.add(`<g>${[1180, 1230, 1270, 1320].map((x, i) => `<g transform="translate(${x} ${448 - (i % 2) * 6})"><circle r="16" fill="url(#warm-glow)"/><rect x="-3" y="-3" width="6" height="6" fill="${C.lampGlow}"/></g>`).join('')}</g>`);
    const capName = far.add(`<g>${labelTag(tr('Kafarnaum', 'Capernaum'), 16)}</g>`);

    const water = S.layer({ par: 0.3, sh: 2 });
    water.add(band(c, { y: 482, amps: [3, 1.5], lens: [300, 90], color: '#5f7f98', x0: -1400, x1: 3200, step: 10, j: 0.6 }).markup);
    const moonPath = water.add(`<g>${Array.from({ length: 10 }, (_, i) => `<path d="${c.cut([[-40, 0], [0, -2.4], [40, 0], [0, 1.8]], 0.2, 8)}" fill="#f5ecd6" transform="translate(${c.rr(-20, 20)} ${i * 22}) scale(${1 - i * 0.05} 1)"/>`).join('')}</g>`);
    const wBack = S.layer({ par: 0.5, sh: 4, pad: 300 });
    wBack.add(waveStrip(c, { y: 640, len: 190, amp: 22, color: '#5d7896', x0: -1400, x1: 3000 }));

    /* the near shore we leave (left) and the Capernaum shore we reach (right) */
    const shoreL = S.layer({ par: 0.55, sh: 4, pad: 1400 });
    const sh = sheet();
    sh.p(c.cut([[-1400, 650], [540, 656], [660, 690], [730, 760], [760, 1700], [-1400, 1700]], 1, 12), mix(C.sand, C.dune, 0.35));
    sh.x(c.ribbon([[540, 656], [660, 690], [730, 760]], 4), C.foam, 'opacity=".8"');
    shoreL.add(sh.out() + cypress(c, 440, 676, 150) + grass(c, { x0: -400, x1: 400, y: 668, n: 20, h: 12, color: C.moss }));
    const capL = S.layer({ par: 0.55, sh: 4, pad: 1400 });
    const cs = sheet();
    cs.p(c.cut([[2600, 1700], [900, 1700], [950, 780], [1030, 720], [1140, 690], [2600, 680]], 1, 12), mix(C.sand, C.stone, 0.35));
    cs.x(c.ribbon([[950, 780], [1030, 720], [1140, 690]], 4), C.foam, 'opacity=".8"');
    let hs = '';
    [[1080, 60, 44], [1150, 70, 52], [1240, 56, 40], [1310, 66, 48]].forEach(([x, w, h]) => { hs += house(c, x, 692, w, h, { stairs: false, lit: true }); });
    capL.add(cs.out() + hs + `<g transform="translate(1180 650)"><circle r="120" fill="url(#warm-glow)" opacity=".6"/></g>`);

    /* the boat, the oars, the disciples; Jesus on the water */
    const boatL = S.layer({ par: 0.6, sh: 5 });
    const B = boat(c, {});
    const DIS = [{ o: TW.andrew, x: -110 }, { o: TW.john, x: -50 }, { o: TW.peter, x: 20 }, { o: TW.james, x: 80 }, { o: TW.thomas, x: 140 }];
    const glow = boatL.add(`<g>${rays(c, { n: 16, r0: 40, r1: 520, spread: 0.03, color: '#fff3cf' })}<circle r="190" fill="url(#halo-glow)"/></g>`);
    const boatG = boatL.add(`<g><g>${B.back}</g><g data-k="oarB">${oar(c, 180)}</g>${DIS.map((d, i) => `<g data-k="w${i}">${person(c, d.o)}</g>`).join('')}<g data-k="jin">${person(c, { ...CAST.jesus })}</g><g>${B.front}</g><g data-k="oarF">${oar(c, 180)}</g></g>`);
    const dis = DIS.map((d, i) => ({ ...d, i, p: S.puppet(S.$('w' + i).firstElementChild), seed: c.rr(0, 6) }));
    const jIn = S.puppet(S.$('jin').firstElementChild);
    const oarB = S.$('oarB'), oarF = S.$('oarF');
    // on the shore at first: the disciples walk down to the boat
    const walkers = DIS.map((d, i) => ({ i, p: S.puppet(boatL.add(person(c, d.o))), seed: c.rr(0, 6) }));
    const jesus = S.puppet(boatL.add(person(c, { ...CAST.jesus })));
    const ripples = [0, 1, 2].map(() => boatL.add(`<path d="${c.ribbon(c.arc(0, 0, 30, 6, 0, PI * 2, 20), 2)}" fill="${C.foam}" opacity=".8"/>`));
    const floats = ['25', '30'].map((n, i) => ({ i, el: boatL.add(`<g>${floatTag(c, n)}</g>`) }));

    /* the words */
    const fx = S.layer({ par: 0.62, sh: 4 });
    const stadia = fx.add(hangWordPlain(c, tr('25–30 stadiów · ok. 5 km', '25–30 stadia · about 5 km')));
    const cries = [0, 1, 2].map(() => fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 40, h: 42 })}</g>`));
    const iam = fx.add(hungGold(c, tr('To Ja jestem', 'It is I'), { size: 42 }));
    const noFear = fx.add(`<g>${speech(c, `<g transform="scale(.9)">${heart(c, 14)}</g>`, { w: 56, h: 50, flip: true })}</g>`);
    const reach = [0, 1].map(() => fx.add(`<g>${heart(c, 10)}</g>`));

    const wFront = S.layer({ par: 0.8, sh: 6, pad: 300 });
    wFront.add(waveStrip(c, { y: 800, len: 260, amp: 30, color: '#4a6784', x0: -1400, x1: 3000 }));
    const windL = S.layer({ par: 0.85, sh: 1, flat: true, pad: 400 });
    windL.add(windLines(c));
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#141a40"/>`);

    return (t, time) => {
      const T = time;
      /* dusk → dark */
      const dark = es(t, 1.9, 2.5);
      night.layer.fade(dark);
      starL.fade(dark * (1 - es(t, 3.0, 3.4) * 0.7 + es(t, 7.2, 7.8) * 0.7));
      tint.fade(0.05 + dark * 0.2 - es(t, 7.1, 7.6) * 0.08);
      pose(moonEl, { x: 1040, y: lerp(560, 150, es(t, 1.9, 2.8)), r: Math.sin(T * 0.5) * 0.8, o: seg(t, 1.85, 1.95) });
      pose(moonPath, { x: 1040, y: 494, o: dark * (1 - es(t, 3.0, 3.3) * 0.7 + es(t, 7.2, 7.6) * 0.7) });

      /* wind and waves */
      const wind = es(t, 3.0, 3.4) * (1 - es(t, 7.1, 7.5));
      clouds.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(T * 0.4 + cl.i) * 40 * wind - es(t, 7.1, 7.6) * 0, y: cl.y - (1 - wind) * 260 * (1 - seg(t, 2.9, 3.0)) - es(t, 7.1, 7.6) * 300, r: Math.sin(T * 0.9 + cl.i) * 1.4 * wind, o: seg(t, 2.9, 3.0) }));
      const sp = 0.2 + wind;
      wBack.shift(-((T * 70 * sp) % 190) + 95, (1 - wind) * 30 - Math.sin(T * 1.3) * 8 * wind);
      wFront.shift(-((T * 110 * sp) % 260) + 130, (1 - wind) * 40 - Math.sin(T * 1.7 + 1) * 12 * wind);
      windL.shift(-((T * 700) % 800) + 400, 0);
      windL.fade(wind * 0.85);

      /* the mountain far off: He prays there alone */
      const alone = es(t, 2.1, 2.4) * (1 - es(t, 3.1, 3.4));
      farJ.set({ x: 480, y: 322, s: 0.14, flip: false, armF: 60, armB: 120, head: -10, o: 1 - es(t, 3.1, 3.4), blink: 0 });
      pose(farGlow, { x: 482, y: 302, s: 0.6 + alone * 0.6, o: 0.4 + alone * 0.6 });
      pose(capLights, { o: 0.3 + dark * 0.7 });
      const ck = es(t, 1.1, 1.4, ease.back) * (1 - es(t, 1.95, 2.1));
      pose(capName, { x: 1250, y: 410, s: ck, o: ck > 0.01 ? 1 : 0 });

      /* v16 — they go down to the sea; v17a — into the boat and away */
      const push = es(t, 1.05, 1.9);
      shoreL.shift(-push * 1200, 0);
      const arrive = es(t, 9.05, 9.3, ease.out);
      capL.shift((1 - arrive) * 1300, 0);
      capL.fade(seg(t, 9.0, 9.05));
      walkers.forEach((w) => {
        const k = es(t, 0.05 + w.i * 0.06, 0.72 + w.i * 0.04);
        const x = lerp(200 - w.i * 90, BX + DIS[w.i].x, k);
        const y = lerp(664, BY - 30, es(t, 0.6 + w.i * 0.03, 0.9));
        w.p.set({ x, y, s: 0.95, walk: k > 0 && k < 1 ? x * 0.06 : undefined, armF: 10, o: 1 - seg(t, 0.92, 0.98), blink: blinkAt(T, w.seed) });
      });
      const inBoat = seg(t, 0.92, 0.98);

      /* the boat rocks; rowing */
      const rockA = wind * (Math.sin(T * 1.6) * 5 + Math.sin(T * 0.8) * 3);
      const heave = wind * Math.sin(T * 1.2) * 10;
      const bump_ = bump(t, 9.2, 9.45) * 10;
      pose(boatG, { x: BX + es(t, 9.05, 9.3) * 60, y: BY + heave + (1 - seg(t, 0.9, 1.1)) * 0, s: 1, r: rockA - bump_ * 0.4, o: 1 });
      const row = es(t, 1.0, 1.2) * (1 - es(t, 5.9, 6.1)) + es(t, 8.9, 9.0) * 0;
      const stroke = Math.sin(T * 2.6 + t * 3) * row;
      pose(oarB, { x: -40, y: -60, r: 50 + stroke * 22, o: inBoat });
      pose(oarF, { x: 70, y: -54, r: 50 + stroke * 22, o: inBoat });

      const see = es(t, 5.1, 5.3);
      const fear = es(t, 6.05, 6.25) * (1 - es(t, 7.2, 7.5));
      const want = es(t, 8.05, 8.3);
      const land = es(t, 9.3, 9.6);
      dis.forEach((d) => {
        const shake = fear * Math.sin(T * 22 + d.i * 2) * 4;
        d.p.set({
          x: d.x, y: 4, s: 0.95, flip: false, o: inBoat,
          armF: 40 + stroke * 30 * (1 - fear) + fear * (d.i % 2 ? 110 : 60) + want * 50 * (1 - land) + land * 20, armB: 20 + stroke * 20 * (1 - fear) + fear * (d.i % 2 ? 60 : 150) + want * (d.i % 2 ? 60 : 20) * (1 - land),
          lean: -stroke * 8 * (1 - fear) + shake - want * 6 * (1 - land), head: -fear * 6 + shake * 0.6 + see * 6 * (1 - fear) - bump(t, 7.1, 7.9) * 8, blink: blinkAt(T, d.seed),
        });
      });

      /* v19a — 25, 30 stadia go by */
      floats.forEach((f) => {
        const a = 4.05 + f.i * 0.4, k = es(t, a, a + 0.55, (u) => u);
        const x = lerp(1400, 200, k);
        pose(f.el, { x, y: 712 + Math.sin(T * 1.6 + f.i) * 6 * (0.3 + wind), r: Math.sin(T * 1.3 + f.i) * 6, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const stk = es(t, 4.1, 4.35, ease.out) * (1 - es(t, 4.9, 5.1));
      pose(stadia, { x: 800, y: lerp(-500, 250, stk), r: Math.sin(T) * 1.5, o: stk > 0.01 ? 1 : 0 });

      /* v19b — Jesus comes walking on the sea */
      const jKeys = [[5.05, 1500], [5.9, 1080], [7.9, 1040], [8.4, 960], [8.95, BX + 190]];
      const jx = kf(t, jKeys, (u) => u);
      const inK = seg(t, 8.92, 8.98);
      const speak = bump(t, 7.05, 7.95);
      jesus.set({ x: jx, y: JY - bump(t, 8.8, 8.98) * 20, s: 1.0, flip: true, o: seg(t, 5.05, 5.15) * (1 - inK), walk: moving(t, jKeys) ? jx * 0.05 : undefined, armF: 20 + speak * 70 + es(t, 8.1, 8.4) * 40 * (1 - inK), armB: 10 + speak * 140, head: speak * -4, blink: blinkAt(T) });
      ripples.forEach((r, i) => {
        const k = (T * 0.6 + i / 3) % 1;
        pose(r, { x: jx, y: JY + 2, s: 0.4 + k * 1.2, sy: 0.9, o: (1 - k) * seg(t, 5.05, 5.15) * (1 - inK) });
      });
      jIn.set({ x: 190, y: -8, s: 0.98, flip: true, o: inK, armF: 30 + bump(t, 9.1, 9.9) * 50, armB: 10 + bump(t, 9.1, 9.9) * 90, blink: blinkAt(T, 4) });
      const shine = Math.max(seg(t, 5.1, 5.4) * 0.35 * (1 - es(t, 6.9, 7.05)), speak, es(t, 7.9, 8.2) * 0.3 * (1 - es(t, 9.1, 9.5)));
      pose(glow, { x: lerp(jx, BX + 190, inK), y: JY - 120, s: 0.35 + shine * 0.8, r: T * 4, o: shine * 0.36 });

      /* v19c — they were afraid */
      cries.forEach((cr, i) => {
        const d = dis[[0, 2, 4][i]];
        const k = es(t, 6.1 + i * 0.08, 6.28 + i * 0.08, ease.back) * (1 - es(t, 6.95, 7.05));
        const [hx, hy] = headAt(BX + d.x, BY + 4 + heave, 0.95, false);
        pose(cr, { x: hx + 12, y: hy - 22, s: k * (1 + Math.sin(T * 12) * 0.05), o: k > 0.01 ? 1 : 0 });
      });
      /* v20 — "It is I; do not be afraid" */
      const ik = es(t, 7.1, 7.45, ease.out) * (1 - es(t, 8.0, 8.2));
      pose(iam, { x: 1000, y: lerp(-500, 250, ik), r: Math.sin(T * 0.8) * 1.2, o: ik > 0.01 ? 1 : 0 });
      const nk = es(t, 7.35, 7.55, ease.back) * (1 - es(t, 7.95, 8.05));
      pose(noFear, { x: jx - 20, y: JY - 210, s: nk, o: nk > 0.01 ? 1 : 0 });
      /* v21a — they want to take Him in */
      reach.forEach((h, i) => {
        const k = es(t, 8.2 + i * 0.1, 8.4 + i * 0.1, ease.back) * (1 - es(t, 8.9, 9.0));
        pose(h, { x: BX + 150 + i * 30, y: BY - 190 - i * 14 + Math.sin(T * 2 + i) * 4, s: k, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, -30], [1.0, 0], [4.9, 0], [5.4, 40], [8.9, 40], [9.4, 20]]);
      S.cam.z = kf(t, [[0, 1.04], [1.9, 1.02], [3.2, 1.06], [5.3, 1.04], [6.2, 1.12], [7.1, 1.06], [8.2, 1.1], [9.4, 1.04]]);
      S.cam.y = kf(t, [[0, 30], [2.0, 20], [6.2, 40], [9.4, 30]]);
    };
  },
};

/** a word on a hanging strip (plain cream) */
function hangWordPlain(c, text) {
  const size = 22, ww = text.length * size * 0.5 + size * 1.3, hh = size * 1.45;
  const d = c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6);
  return `<g class="hang"><path d="M${-ww * 0.3} -1600V${-hh / 2}M${ww * 0.3} -1600V${-hh / 2}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><path d="${d}" fill="${C.cream}"/><path class="grain" d="${d}"/><text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text></g>`;
}
