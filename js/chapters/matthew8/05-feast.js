// Mt 8,11–12 — a painted flat flies in: the feast of the kingdom of heaven. Under a golden sky a long table is laid;
// Abraham, Isaac and Jacob sit at its middle. From the east (the rising sun, on the right) and from the west (the
// setting sun, on the left) people stream in along two roads, and sit down at the table with them. But the "sons of
// the kingdom", who stood so sure in front, are put out: darkness closes round the lit table like a cut-out frame,
// and out there they bow their heads into their hands and weep.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, sun, grass, flowers, olive } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { L12, SONS, mob, pose3, folk4, hungWord, hangAt, bowl, loaf, cup, radiance, tr, PI, KINGDOM } from './lib.js';
import { lowTable, grapes } from '../mark2/lib.js';

const TY = 566;                  // the foot of the table
const SY = 780;                  // where the sons stand

export default {
  id: 'mt8-feast',
  enter: 'fly',
  beats: [
    { v: 11, text: 'Lecz powiadam wam: Wielu przyjdzie ze Wschodu i Zachodu' },
    { v: 11, cont: true, text: 'i zasiądą do stołu z Abrahamem, Izaakiem i Jakubem w królestwie niebieskim.' },
    { v: 12, text: 'A synowie królestwa zostaną wyrzuceni na zewnątrz - w ciemność;' },
    { v: 12, cont: true, text: 'tam będzie płacz i zgrzytanie zębów».' },
  ],
  cam: { x: [-20, 20], y: [0, 60], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, KINGDOM);
    const glowL = S.layer({ par: 0.06, sh: 2 });
    glowL.add(`<g transform="translate(800 330)"><circle r="520" fill="url(#halo-glow)" opacity=".8"/><g opacity=".55">${radiance(c, 190)}</g></g>`);
    const hangL = S.layer({ par: 0.08, sh: 5 });
    const east = hanging(hangL, `<circle r="90" fill="url(#warm-glow)"/>${sun(c, 40)}`, { x: 1500, y: -600, len: 900 });
    const west = hanging(hangL, `<circle r="90" fill="url(#warm-glow)"/>${sun(c, 40, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' })}`, { x: 100, y: -600, len: 900 });
    const eastW = hangL.add(hungWord(c, tr('ze Wschodu', 'from the east'), { size: 22 }));
    const westW = hangL.add(hungWord(c, tr('z Zachodu', 'from the west'), { size: 22 }));

    /* ---------- the hills of the kingdom and two roads ---------- */
    S.layer({ par: 0.14, sh: 2 }).add(band(c, { y: 450, amps: [16, 7, 3], lens: [1000, 360, 120], color: mix(C.hillFar, C.halo, 0.35) }).markup);
    const G = S.layer({ par: 0.3, sh: 3 });
    const gfn = c.wave(540, [6, 3], [800, 200]);
    const gs = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.halo, 0.3));
    gs.p(c.ribbon([[-900, 664], [0, 656], [300, 646], [520, 636]], (u) => 40 - u * 16, 2) + c.ribbon([[2500, 668], [1600, 656], [1300, 646], [1080, 636]], (u) => 40 - u * 16, 2), mix(C.sand, C.cream, 0.4));
    G.add(gs.out());
    G.add(grass(c, { x0: -800, x1: 2400, y: 600, fn: gfn, n: 40, h: 12, color: C.moss }) + olive(c, 200, 570, 0.9) + olive(c, 1420, 568, 0.85) + flowers(c, { x0: 250, x1: 1350, y: 550, fn: gfn, n: 16 }));

    /* ---------- the guests streaming in (sprites) ---------- */
    const walkL = S.layer({ par: 0.3, sh: 4 });
    const streams = [-1, 1].map((side) => [0, 1].map((k) => ({ side, k, sp: walkL.sprite(mob(makeCutter(`mt8-feast-w${side}${k}`), 4, { s: 0.74, spread: 42, rows: 1, flip: side > 0 }), 800, 680) })));

    /* ---------- the table: guests seated behind it, the patriarchs at the middle ---------- */
    const tableL = S.layer({ par: 0.32, sh: 4 });
    const seat = (side) => pose3(makeCutter('mt8-feast-s' + side), Array.from({ length: 5 }, (_, i) => ({ x: side * (130 + i * 62), y: 0, s: 0.72, flip: side > 0, head: -4, armF: 40 + (i % 2) * 30, o: { ...folk4(makeCutter(`mt8-f${side}${i}`), null), pose: 'sit' } })));
    const seatedL = tableL.sprite(seat(-1), 800, TY - 8);
    const seatedR = tableL.sprite(seat(1), 800, TY - 8);
    const PAT = [[L12.isaac, 710, false], [L12.abraham, 800, false], [L12.jacob, 890, true]].map(([o, x, flip], i) => ({ i, x, flip, p: S.puppet(tableL.add(person(c, { ...o, pose: 'sit' }))) }));
    let food = '';
    [-300, -200, -90, 60, 170, 290].forEach((x, i) => { food += `<g transform="translate(${x} -52)">${i % 3 === 0 ? loaf(c, 16) : i % 3 === 1 ? bowl(c, { w: 34, food: 'fruit' }) : cup(c)}</g>`; });
    food += `<g transform="translate(-20 -54)">${grapes(c, 5)}</g><g transform="translate(20 -52)">${loaf(c, 20)}</g>`;
    tableL.add(`<g transform="translate(800 ${TY + 6})">${lowTable(c, 760, 58)}${food}</g>`);
    const names = hangL.add(hungWord(c, tr('Abraham · Izaak · Jakub', 'Abraham · Isaac · Jacob'), { size: 22 }));

    /* ---------- the sons of the kingdom, then the darkness outside ---------- */
    const sonsL = S.layer({ par: 0.36, sh: 5 });
    const sons = SONS.map((o, i) => ({ i, p: S.puppet(sonsL.add(person(c, o))), home: 690 + i * 80, out: (S.portrait ? [570, 1030, 650] : [500, 1100, 580])[i],   // phone: put out, but still inside the screen
      seed: c.rr(0, 9) }));
    const tears = Array.from({ length: 9 }, (_, i) => ({ i, s: i % 3, el: sonsL.add(`<path d="${c.cut([[0, -6], [3, 1], [0, 4], [-3, 1]], 0.1, 2)}" fill="${C.skyVeil}"/>`) }));
    const dark = S.layer({ par: 0.36, sh: 1, flat: true });
    dark.add(`<path d="${c.cut([[-3000, -3000], [5000, -3000], [5000, 5000], [-3000, 5000]], 0, 400) + c.hole(c.blob(800, 440, 420, 215, 26, 0.04), 1.5, 10)}" fill="#1b1a33"/>`);

    return (t, time) => {
      const T = time;
      /* v11a — many come from the east and the west */
      const sk = es(t, 0.02, 0.3, ease.out);
      hangAt(east, S.portrait ? 1020 : 1110, lerp(-600, 210, sk), T, 1, 0.6);
      hangAt(west, S.portrait ? 580 : 490, lerp(-600, 210, sk), T, 1, 0.6, 1);
      const wk = es(t, 0.1, 0.35, ease.out) * (1 - es(t, 1.0, 1.2));
      hangAt(eastW, S.portrait ? 1000 : 1080, lerp(-600, 330, wk), T, 1, 0.7, 2);
      hangAt(westW, S.portrait ? 600 : 520, lerp(-600, 330, wk), T, 1, 0.7, 3);
      streams.forEach((row) => row.forEach((g) => {
        const k = es(t, 0.08 + g.k * 0.15, 0.85 + g.k * 0.12, (u) => u);
        const x0 = g.side < 0 ? -500 - g.k * 220 : 2100 + g.k * 220, x1 = g.side < 0 ? 470 - g.k * 140 : 1130 + g.k * 140;
        const x = lerp(x0, x1, k), y = 650 - k * 6 - (k > 0 && k < 1 ? Math.abs(Math.sin(x * 0.04 + g.k)) * 3 : 0);
        g.sp.set({ x, y, s: 1 - g.k * 0.08, o: 1 - es(t, 1.05 + g.k * 0.05, 1.25 + g.k * 0.05) });
      }));

      /* v11b — they sit down at table with Abraham, Isaac and Jacob */
      const sit = es(t, 1.1, 1.4);
      seatedL.set({ o: sit });
      seatedR.set({ o: sit });
      const welcome = es(t, 1.15, 1.5);
      PAT.forEach((p) => p.p.set({ x: p.x, y: TY - 8, s: 0.8, flip: p.flip, armF: 30 + welcome * (p.i === 1 ? 70 : 40), armB: 10 + welcome * (p.i === 1 ? 90 : 20), head: -welcome * 4, blink: blinkAt(T, p.i + 2) }));
      const nk = es(t, 1.15, 1.45, ease.out) * (1 - es(t, 1.95, 2.15));
      hangAt(names, 800, lerp(-600, 290, nk), T, 1, 0.7, 4);

      /* v12a — the sons of the kingdom are put outside, into the darkness */
      const out = es(t, 2.1, 2.6);
      const night = es(t, 2.05, 2.45);
      dark.fade(night * 0.66);
      const weep = es(t, 3.05, 3.35);
      sons.forEach((sn) => {
        const x = lerp(sn.home, sn.out, out);
        const moving = out > 0 && out < 1;
        const sure = 1 - out;
        sn.p.set({
          x, y: SY + (sn.i === 2 ? 20 : 0), s: 1.0, flip: moving ? sn.out < sn.home : sn.i === 1,
          walk: moving ? x * 0.05 : undefined, amt: 0.6,
          armF: sure * 30 + weep * 125, armB: sure * 20 + weep * 40, lean: -sure * 4 + weep * 14, head: -sure * 6 + weep * 22, blink: blinkAt(T, sn.seed),
        });
      });
      /* v12b — weeping */
      tears.forEach((d) => {
        const sn = sons[d.s];
        const k = T ? ((T * 0.9 + d.i * 0.37) % 1) : ((d.i % 3) + 0.5) / 3;
        const fx = sn.out + (sn.i === 1 ? -22 : 22);
        pose(d.el, { x: fx + (d.i % 2 ? 4 : -4), y: SY - 150 + k * 60, o: weep * (1 - k) });
      });

      S.cam.z = 1.02 + es(t, 1.0, 1.4) * 0.04 - es(t, 2.0, 2.5) * 0.02;
      S.cam.y = 10 + es(t, 2.0, 2.5) * 20;
      S.cam.x = 0;
    };
  },
};
