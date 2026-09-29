// Łk 10,13b–14 — a painted flat of the bright Phoenician coast: Tyre on its island with the purple-sailed ships in its
// harbour, Sidon further up the shore. On a terrace over the sea stand four of its people in purple and gold. "If the
// mighty works done in you had been done in Tyre and Sidon": golden medallions of those works come drifting down over
// the harbour — the people look up; "they would have repented long ago, sitting in sackcloth and ashes": they strip off
// the purple, stand in rough sackcloth, and sit down in heaps of ash, grey flakes falling on their bowed heads.
// "But it will be more bearable for Tyre and Sidon in the judgment than for you": a great balance comes down in the
// golden light — Tyre and Sidon on one pan, Chorazin and Bethsaida on the other — and the pan of the unrepentant sinks.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, waterBand, sun, cloud, rock } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { medallion, workIcon, penitent, ashPile, ashFlake, ship, cityIcon, balance, strip, glow, STRING, kf, tr, es, ease, bump, seg, PI } from './lib.js';

const GY = 696;
const SEA = ['#bcd8d8', '#e6ecdc', '#f5ead0'];
const PURPLE = mix(C.plumRobe, '#8e3e6e', 0.35);
const RICH = [
  { robe: PURPLE, mantle: C.sun, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin2, belt: C.sun },
  { robe: C.linen, mantle: PURPLE, hairStyle: 'veil', veil: mix(PURPLE, C.roseRobe, 0.4), veil2: C.sun, hair: C.hair2, skin: C.skin, beard: 'none', belt: C.sun },
  { robe: mix(PURPLE, C.roseRobe, 0.3), mantle: C.ochre, hair: C.hair, hairStyle: 'wrap', veil: C.sun, veil2: PURPLE, beard: 'short', skin: C.skin3, belt: C.sun },
  { robe: PURPLE, hairStyle: 'veil', veil: C.linen, veil2: C.sun, hair: C.hair3, skin: C.skin2, beard: 'none', belt: C.sun },
];
const SPOTS = [470, 610, 990, 1130];

export default {
  id: 'lk10-tyre',
  enter: 'fly',
  beats: [
    { v: 13, text: 'Bo gdyby w Tyrze i Sydonie działy się cuda, które u was się dokonały, już dawno by się nawróciły, siedząc w worze pokutnym i w popiele.' },
    { v: 14 },
  ],
  cam: { x: [-20, 20], y: [-120, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, SEA);
    const gold = sky(S, ['#e7c894', '#f4ddb0', '#f8ead0'], { name: 'judg', rise: 0 });
    gold.layer.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1250, y: 160, len: 900 });
    const cl = hanging(hangL, cloud(c, 170), { x: 560, y: 190, len: 900 });
    S.layer({ par: 0.06, sh: 2 }).add(band(c, { y: 400, amps: [18, 7, 3], lens: [900, 330, 120], color: mix(C.hillFar, C.duskViolet, 0.25) }).markup + `<g transform="translate(380 420)">${cityIcon(makeCutter('lk10-sidon'), 110)}</g>`);
    const sea = S.layer({ par: 0.1, sh: 2 });
    sea.add(waterBand(c, { y: 440, color: mix(C.lake, C.skyBlue, 0.35), foamN: 26, bottom: 900 }).markup);
    const isle = S.layer({ par: 0.14, sh: 3 });
    isle.add(sheet().p(c.cut([[900, 560], [960, 520], [1320, 516], [1380, 560]], 0.8, 8), C.rock).out() + `<g transform="translate(1140 530)">${cityIcon(makeCutter('lk10-tyrecity'), 220, { dome: true })}</g>`);
    const ships = [[760, 548, 0.5], [1420, 560, 0.45], [600, 520, 0.3]].map(([x, y, s], i) => ({ i, x, y, s, el: isle.add(`<g>${ship(makeCutter('lk10-ship' + i), 200)}</g>`) }));
    isle.add(`<g transform="translate(380 470)">${strip(c, tr('Sydon', 'Sidon'), { size: 17 })}</g><g transform="translate(1140 424)">${strip(c, tr('Tyr', 'Tyre'), { size: 17 })}</g>`);

    /* the terrace */
    const T_ = S.layer({ par: 0.4, sh: 3 });
    const tfn = (x) => GY - 34 + 3 * Math.sin(x / 200);
    T_.add(sheet().p(c.ridge(tfn, -900, 2500, 1800, 12, 0.6), mix(C.stone, C.sand, 0.35)).x(c.ribbon([[-900, GY - 30], [2500, GY - 30]], 3), C.stone2, 'opacity=".7"').out());
    T_.add(rock(c, 180, GY - 20, 150, 50, C.rock2) + rock(c, 1440, GY - 20, 160, 50, C.rock));
    const P = S.layer({ par: 0.4, sh: 5 });
    const piles = SPOTS.map((x) => P.add(`<g>${ashPile(c, 130)}</g>`));
    const ppl = SPOTS.map((x, i) => ({
      i, x, flip: x > 800,
      rich: S.puppet(P.add(person(c, RICH[i]))),
      sack: S.puppet(P.add(person(c, penitent(c, i)))),
      sit: S.puppet(P.add(person(c, { ...penitent(c, i), pose: 'sit' }))),
    }));
    const fx = S.layer({ par: 0.42, sh: 4 });
    const meds = ['eye', 'crutch', 'loaves', 'hand', 'eye'].map((k, i) => ({ i, el: fx.add(`<g>${medallion(c, workIcon(c, k), { r: 22 })}</g>`), x: 480 + i * 160 }));
    const flakes = Array.from({ length: 22 }, (_, i) => ({ i, el: fx.add(ashFlake(c, 5)), x: SPOTS[i % 4] + c.rr(-50, 50), ph: c.rr(0, 1) }));

    /* the balance of judgment */
    const BL = S.layer({ par: 0.2, sh: 6, rise: 0 });
    const bal = balance(c, { arm: 190, drop: 110, pan: 130, col: mix(C.ochre, C.sun, 0.3) });
    const bGlow = BL.add(`<g>${glow(260, 0.9)}</g>`);
    const frame = BL.add(`<g><path d="M0 -2000V-80" stroke="${STRING}" stroke-width="1.6"/>${bal.frame}</g>`);
    const beam = BL.add(`<g>${bal.beam}</g>`);
    const pc = makeCutter('lk10-tyre-pans');
    const tyreM = `<g transform="translate(-26 96)">${cityIcon(pc, 60, { dome: true })}</g><g transform="translate(34 104) scale(.3)">${ship(pc, 200)}</g><g transform="translate(0 132)">${strip(c, tr('Tyr i Sydon', 'Tyre and Sidon'), { size: 15 })}</g>`;
    const galM = `<g transform="translate(-30 100)">${cityIcon(pc, 56, { wall: mix(C.rock3, C.storm, 0.2), wall2: mix(C.rock3, C.storm2, 0.35), tower: false })}</g><g transform="translate(30 100)">${cityIcon(pc, 56, { wall: mix(C.plaster2, C.stone2, 0.5), wall2: C.stone2 })}</g><g transform="translate(0 132)">${strip(c, tr('Korozain i Betsaida', 'Chorazin and Bethsaida'), { size: 15 })}</g>`;
    const panL = BL.add(`<g>${bal.panL}${tyreM}</g>`);
    const panR = BL.add(`<g>${bal.panR}${galM}</g>`);

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1250, y: 160, r: T ? Math.sin(T * 0.6) : 0, o: 1 - es(t, 1.0, 1.3) });
      pose(cl, { x: 560 + (T ? Math.sin(T * 0.1) * 20 : 0), y: 190, r: T ? Math.sin(T * 0.6 + 1) : 0 });
      ships.forEach((s) => pose(s.el, { x: s.x + (T ? Math.sin(T * 0.3 + s.i) * 10 : 0), y: s.y + (T ? Math.sin(T * 1.2 + s.i) * 2 : 0), s: s.s, r: T ? Math.sin(T * 0.9 + s.i) * 1.2 : 0 }));
      gold.layer.fade(es(t, 1.0, 1.35) * 0.9);

      /* v13b — the mighty works drift down; purple off, sackcloth on; they sit in the ashes */
      meds.forEach((m) => {
        const k = es(t, 0.03 + m.i * 0.04, 0.4 + m.i * 0.04);
        pose(m.el, { x: m.x + Math.sin(k * 4 + m.i) * 20, y: lerp(-100, 420 + (m.i % 2) * 40, k), r: Math.sin(k * 3 + m.i) * 20, s: 0.9, o: seg(t, 0.03 + m.i * 0.04, 0.08 + m.i * 0.04) * (1 - es(t, 0.5, 0.6)) });
      });
      ppl.forEach((p) => {
        const look = es(t, 0.15, 0.3);
        const strip_ = es(t, 0.44 + p.i * 0.03, 0.48 + p.i * 0.03);
        const down = es(t, 0.58 + p.i * 0.03, 0.62 + p.i * 0.03);
        const base = { x: p.x, y: GY, s: 1.0, flip: p.flip, blink: blinkAt(T, p.i + 1) };
        p.rich.set({ ...base, o: 1 - strip_, armF: 20 + look * 40, armB: 10 + look * 60, head: -look * 14 });
        p.sack.set({ ...base, o: strip_ * (1 - down), armF: 40, armB: 60, head: 6 });
        p.sit.set({ ...base, y: GY + 4, o: down, armF: 150, armB: 145, head: 24, blink: 0 });
        pose(piles[p.i], { x: p.x + (p.flip ? -6 : 6), y: GY + 8, s: 0.4 + es(t, 0.56, 0.7) * 0.6, o: es(t, 0.56, 0.62) });
      });
      flakes.forEach((f) => {
        const k = ((T * 0.18 + f.ph) % 1);
        const on = es(t, 0.62, 0.72) * (1 - es(t, 1.9, 2.0));
        pose(f.el, { x: f.x + Math.sin(k * 6 + f.i) * 10, y: lerp(420, GY - 60, k), r: k * 200, o: on * (k < 0.9 ? 1 : (1 - k) * 10) });
      });

      /* v14 — the balance of the judgment */
      const dk = es(t, 1.02, 1.3, ease.out);
      const tilt = es(t, 1.32, 1.7, ease.back) * 15;
      const by = lerp(-900, 236, dk);
      const on = dk > 0.001 ? 1 : 0;
      pose(bGlow, { x: 800, y: by + 80, o: dk * 0.8 });
      pose(frame, { x: 800, y: by, o: on });
      pose(beam, { x: 800, y: by, r: tilt, o: on });
      const r = (tilt * PI) / 180;
      pose(panL, { x: 800 - Math.cos(r) * 190, y: by - Math.sin(r) * 190, o: on });
      pose(panR, { x: 800 + Math.cos(r) * 190, y: by + Math.sin(r) * 190, o: on });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -60], [0.4, -40], [0.6, 20], [1.0, 20], [1.3, -100], [2, -100]]);
      S.cam.z = kf(t, [[0, 1.0], [0.6, 1.06], [1.0, 1.06], [1.3, 1.0], [2, 1.0]]);
    };
  },
};
