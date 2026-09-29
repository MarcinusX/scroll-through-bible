// Mt 28,15 — In a street of Jerusalem the soldiers, the bags of silver at their belts, do as they were told: they lean
// to a man's ear, and a grey slip of paper hops from ear to ear down the street. Then the whisper spreads: grey slips
// fly out over the roofs to the far towns and the hills, more and more of them, while a disc of day and night turns
// over and over on its string — "to this day".
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, mix } from '../kit.js';
import { band, hillsWith, house, town, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { DAY, soldier, silverBag, folk, group, rumourSlip, whisper, dayNightDisc, headAt, PI } from './lib.js';

const FLOOR = 740;

export default {
  id: 'mt28-rumour',
  beats: [
    { v: 15, text: 'Ci więc wzięli pieniądze i uczynili, jak ich pouczono.' },
    { v: 15, cont: true, text: 'I tak rozniosła się ta pogłoska między Żydami i trwa aż do dnia dzisiejszego.' },
  ],
  cam: { x: [-40, 40], y: [-80, 40], z: [0.94, 1.06] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const cl = hanging(hangL, cloud(c, 200), { x: 560, y: 150, len: 700 });
    const D = dayNightDisc(c, 46);
    const disc = hanging(hangL, `<g data-k="dnD">${D.day}</g><g data-k="dnN" opacity="0">${D.night}</g>`, { x: 0, y: -1500, len: 900 });
    const dDay = S.$('dnD'), dNight = S.$('dnN');
    /* the far land, with towns */
    const far = S.layer({ par: 0.1, sh: 2 });
    const h1 = band(c, { y: 450, amps: [18, 7, 3], lens: [1000, 340, 120], color: C.hillFar });
    far.add(h1.markup + town(c, { x: -150, y: h1.fn(-150) + 12, n: 5, spread: 220, sc: 0.4 }) + town(c, { x: 330, y: h1.fn(330) + 12, n: 4, spread: 160, sc: 0.36 }) + town(c, { x: 1320, y: h1.fn(1320) + 12, n: 5, spread: 200, sc: 0.4 }) + town(c, { x: 1800, y: h1.fn(1800) + 12, n: 4, spread: 200, sc: 0.36 }));
    const mid = S.layer({ par: 0.2, sh: 3 });
    mid.add(hillsWith(c, { y: 520, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 20, treeColor: C.sage, treeH: 20 }).markup);
    /* the street: a row of houses, the paving */
    const street = S.layer({ par: 0.4, sh: 3 });
    let hs = '';
    [[-300, 150, 190], [-120, 170, 220], [80, 150, 180], [250, 190, 230], [470, 160, 200], [660, 180, 250], [880, 150, 190], [1060, 200, 230], [1290, 160, 200], [1480, 170, 240], [1680, 150, 190]].forEach(([x, w, h]) => {
      hs += house(c, x, 640, w, h, { wall: mix(C.plaster, C.sand, (x % 3) * 0.1 + 0.05), shadow: C.plaster2, stairs: false });
    });
    street.add(hs);
    const pv = sheet();
    pv.p(c.cut([[-1400, 636], [2800, 636], [2800, 1700], [-1400, 1700]], 1, 20), mix(C.stone, C.sand, 0.4));
    let jn = '';
    for (let i = 0; i < 7; i++) jn += c.ribbon([[-1400, 650 + i * i * 7 + i * 12], [2800, 650 + i * i * 7 + i * 12]], 1.3);
    pv.x(jn, shade2(C.stone), 'opacity=".45"');
    street.add(pv.out());
    /* the townsfolk, in groups (sprites: drawn once, never repainted) */
    const crowdL = S.layer({ par: 0.45, sh: 4 });
    const GR = [[700, 690], [900, 700], [1110, 694], [1300, 704], [270, 700], [80, 690]].map(([x, y], i) => {
      const mem = Array.from({ length: 3 }, (_, k) => ({ x: (k - 1) * 34 + c.rr(-6, 6), y: c.rr(-6, 6), s: 1, flip: k === 0 ? x > 600 : k === 2 ? false : x > 800, o: folk(c) }));
      return { i, x, y, sp: crowdL.sprite(`<g transform="scale(.84)">${group(c, mem)}</g>`, x, y) };
    });
    /* the soldiers with their silver */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const man = S.puppet(PL.add(person(c, folk(c, true))));
    const SO = [{ i: 0, x: 480 }, { i: 1, x: 360 }].map((s) => ({ ...s, seed: c.rr(0, 9), p: S.puppet(PL.add(soldier(c, s.i, { spear: false, extra: s.i ? { holdF: `<g transform="translate(0 40) scale(.9)">${silverBag(c, 1)}</g>` } : { holdB: `<g transform="translate(0 40) scale(.9)">${silverBag(c, 1)}</g>` } }))) }));
    const curl = PL.add(`<g>${whisper(c)}</g>`);
    /* the slips */
    const fx = S.layer({ par: 0.5, sh: 3 });
    const hop = fx.add(`<g>${rumourSlip(c, 40)}</g>`);
    const curls = GR.map(() => fx.add(`<g>${whisper(c)}</g>`));
    const fly = Array.from({ length: 22 }, (_, i) => {
      const a = PI * (1.05 + (i / 21) * 0.9);
      return { i, el: fx.add(`<g>${rumourSlip(c, 36)}</g>`), tx: 800 + Math.cos(a) * c.rr(900, 1300), ty: 420 + Math.sin(a) * c.rr(120, 260), d: c.rr(0, 0.4) };
    });

    return (t, time) => {
      swing(cl, 560 + (time ? Math.sin(time * 0.1) * 30 : 0), 150, time, 1.2, 0.6, 1);
      /* v15a: they took the money and did as they were told */
      const lean = es(t, 0.15, 0.4);
      SO.forEach((s, k) => s.p.set({ x: s.x, y: FLOOR + k * 6, s: 1.02, armF: 16 + (k === 0 ? lean * 8 : 0), armB: 14, head: k === 0 ? lean * 12 : -4, lean: k === 0 ? lean * 12 : 0, blink: blinkAt(time, s.seed) }));
      const listen = es(t, 0.4, 0.6);
      man.set({ x: 600, y: FLOOR, s: 1.0, flip: true, armF: 20 + listen * 30, armB: 10, head: -listen * 8 + listen * 14 * (t > 0.7 ? 1 : 0), blink: blinkAt(time, 4) });
      const [sx, sy] = headAt(480, FLOOR, 1.02, false);
      const ck = es(t, 0.25, 0.4) * (1 - es(t, 0.95, 1.1));
      pose(curl, { x: sx + 52, y: sy + 14, s: ck * 1.4, o: ck });
      // the slip hops along the heads down the street
      const chain = [[sx + 40, sy], [600 - 20, sy - 6], [GR[0].x, GR[0].y - 160], [GR[1].x, GR[1].y - 160], [GR[2].x, GR[2].y - 160], [GR[3].x, GR[3].y - 160]];
      const u = seg(t, 0.45, 1.0) * (chain.length - 1);
      const k = Math.min(chain.length - 2, Math.floor(u)), f = u - k;
      const [ax, ay] = chain[k], [bx, by] = chain[k + 1];
      pose(hop, { x: lerp(ax, bx, f), y: lerp(ay, by, f) - Math.sin(f * PI) * 60, r: f * 30 - 15, o: seg(t, 0.45, 0.5) * (1 - seg(t, 1.1, 1.2)) });
      GR.forEach((g, i) => {
        const b = es(t, 0.6 + i * 0.1, 0.75 + i * 0.1) * (1 - es(t, 1.8, 2));
        pose(curls[i], { x: g.x + 30, y: g.y - 150, s: b * 1.3, r: -10, o: b });
      });
      /* v15b: the story spreads, and lasts to this day */
      fly.forEach((f2) => {
        const v = es(t, 1.05 + f2.d, 1.75 + f2.d, ease.out);
        pose(f2.el, { x: lerp(800, f2.tx, v), y: lerp(560, f2.ty, v) - Math.sin(v * PI) * 180, s: lerp(1.1, 0.45, v), r: v * 400 * (f2.i % 2 ? 1 : -1), o: v > 0 ? (1 - es(t, 1.85 + f2.d * 0.2, 2.0)) * 0.9 + 0.1 * seg(t, 1.05, 1.1) : 0 });
      });
      const dk = es(t, 1.05, 1.3, ease.back);
      const spin = seg(t, 1.2, 1.95) * 4;       // four days and nights … and on
      const cs = Math.cos(spin * PI);
      swing(disc, 1080, lerp(-900, 250, dk), time, 1, 0.7, 2);
      pose(disc.querySelector('.obj'), { sx: Math.max(0.03, Math.abs(cs)) });
      fade(dDay, Math.floor(spin + 0.5) % 2 === 0 ? 1 : 0);
      fade(dNight, Math.floor(spin + 0.5) % 2 === 1 ? 1 : 0);

      S.cam.x = -20 + es(t, 1.0, 1.5) * 30;
      S.cam.y = 20 - es(t, 1.0, 1.5) * 60;
      S.cam.z = 1.04 - es(t, 1.0, 1.5) * 0.08;
    };
  },
};
function shade2(col) { return mix(col, '#2a1d12', 0.16); }
