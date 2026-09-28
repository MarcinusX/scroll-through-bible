// Mt 4,1–2 — the curtains open on the Judean desert. The dove of the Spirit flies ahead and Jesus follows it
// in from the Jordan; far off on a dune a shadowy figure watches (He goes out "to be tempted by the devil").
// Forty days and forty nights: He sits in prayer on a rock while sun and moon swing across the sky four
// times and the marks on a flat stone count up to forty. At last, at dusk, He is hungry: head bowed, the
// bowl empty, round desert stones at His feet, and the thought of a loaf of bread.
import { C, person, CAST, blinkAt, pose, lerp, curtains, swing, sheet, shade, mix } from '../kit.js';
import { rock } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { desertSet, desertFront, TEMPTER, tempterAura, stoneLoaf, dove, flapWings, tallyStone, paperLabel, thought, loaf, emptyBowl, headAt, PI } from './lib.js';

const GY = 742;
const JX = 800;
const SEAT = 726;

export default {
  id: 'mt4-desert',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'A gdy przepościł czterdzieści dni i czterdzieści nocy,' },
    { v: 2, cont: true, text: 'odczuł w końcu głód.' },
  ],
  cam: { x: [-40, 40], y: [-20, 50], z: [1, 1.14] },
  build(S) {
    const D = desertSet(S);
    const c = D.c;

    /* ---------- the tally stone, the stones, the empty bowl ---------- */
    const G = D.G;
    const tally = G.add(`<g transform="translate(560 722)">${tallyStone(c, 190, 70)}</g>`);
    const marks = Array.from(tally.querySelectorAll('.tally'));
    const forty = G.add(`<g opacity="0">${paperLabel('40', { size: 30 })}</g>`);
    const stonesL = S.layer({ par: 0.5, sh: 3 });
    [[918, 738, 16], [958, 745, 20], [998, 735, 14], [1034, 742, 12]].forEach(([x, y, r]) => stonesL.add(`<g transform="translate(${x} ${y})">${stoneLoaf(c, r)}</g>`));

    /* ---------- far off: a shadow watching from the dunes ---------- */
    const far = S.layer({ par: 0.25, sh: 3 });
    const watcherAura = far.add(`<g opacity="0">${tempterAura(c, 120)}</g>`);
    const watcher = S.puppet(far.add(person(c, { ...TEMPTER })));

    /* ---------- Jesus and the Spirit ---------- */
    const JL = S.layer({ par: 0.5, sh: 5 });
    const seat = JL.add(rock(c, JX - 4, SEAT + 20, 124, 48, C.rock2));
    const jWalk = S.puppet(JL.add(person(c, { ...CAST.jesus })));
    const jSit = S.puppet(JL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const bowlEl = JL.add(`<g>${emptyBowl(c, 34)}</g>`);
    const doveEl = JL.add(dove(c));
    const glowEl = JL.add(`<circle r="120" fill="url(#halo-glow)" opacity="0"/>`);
    const thinkEl = JL.add(`<g opacity="0">${thought(c, `<g transform="translate(0 10)">${loaf(c, 20)}</g>`, { w: 84, h: 62 })}</g>`);

    desertFront(S);
    const cur = curtains(S);

    return (t, time) => {
      cur.set(es(t, 0.05, 0.85), time);

      /* ---------- forty days and nights: four swings of sun and moon ---------- */
      const cyc = seg(t, 2.05, 2.95) * 4;
      const ph = cyc % 1;
      let night = 0;
      const arc = (f, y0) => [lerp(260, 1340, f), y0 - Math.sin(Math.max(0, Math.min(1, f)) * PI) * 300];
      let sunXY, moonXY = [260, 900];
      if (t < 2.05) sunXY = arc(0.6 + seg(t, 0, 2.05) * 0.1, 480);
      else if (t < 2.95) {
        night = es(ph, 0.4, 0.55) * (1 - es(ph, 0.88, 1.0));
        sunXY = ph < 0.5 ? arc(ph / 0.5, 480) : [1340, 900];
        if (ph >= 0.5) moonXY = arc((ph - 0.5) / 0.5, 470);
        if (cyc >= 3.999) { sunXY = arc(0.05, 480); night = 0; }
      } else sunXY = arc(lerp(0.2, 0.9, es(t, 2.95, 3.9)), 480 + es(t, 3.0, 3.9) * 80);
      if (t >= 2.95) night = 0;
      D.nightL.fade(night);
      D.starL.fade(night);
      D.duskL.fade(es(t, 3.0, 3.6) * 0.95);
      swing(D.sunEl, sunXY[0], sunXY[1], time, 1, 0.6);
      swing(D.moonEl, moonXY[0], moonXY[1], time, 0.8, 0.5, 1);

      const shown = Math.floor(seg(t, 2.05, 2.93) * 40 + 0.001);
      marks.forEach((m, i) => fade(m, i < shown ? 1 : 0));
      const f40 = es(t, 2.88, 3.0, ease.back);
      pose(forty, { x: 560, y: 628 + Math.sin(time * 1.5) * 3, s: f40, r: Math.sin(time) * 3, o: f40 > 0 ? 1 - es(t, 3.3, 3.6) * 0.4 : 0 });

      /* ---------- v1: the Spirit leads Him out into the desert ---------- */
      const w = es(t, 1.02, 1.85);
      const jx = lerp(330, JX, w);
      const sitK = es(t, 2.0, 2.07);
      jWalk.set({ x: jx, y: GY, s: 1.05, o: 1 - sitK, walk: w > 0 && w < 1 ? jx * 0.045 : undefined, armF: 14 + es(t, 1.8, 1.95) * 20, head: -6 + es(t, 1.8, 1.95) * 2, blink: blinkAt(time) });
      const pray = es(t, 2.1, 2.3) * (1 - es(t, 3.0, 3.2));
      const hungry = es(t, 3.05, 3.4);
      jSit.set({ x: JX - 16, y: SEAT, s: 1.05, o: sitK, armF: 30 + pray * 30 - hungry * 10, armB: 20 + pray * 40 - hungry * 10, head: pray * 10 + hungry * 16, lean: hungry * 5, blink: hungry > 0.5 ? 0.5 : blinkAt(time, 2) });
      pose(seat, { o: 1 });
      // the dove flies ahead of Him and rises into the light
      const df = es(t, 0.9, 1.9, ease.sine);
      const dx = lerp(470, 1080, df), dy = lerp(420, 330, df) - Math.sin(df * PI * 2.2) * 26 - es(t, 1.8, 2.1) * 520;
      pose(doveEl, { x: dx, y: dy, s: 1.1, o: t < 2.1 ? 1 : 0 });
      flapWings(doveEl, time, 30, 7);
      pose(glowEl, { x: dx, y: dy - 10, s: 1, o: t < 2.1 ? 0.8 : 0 });
      // the watcher on the dune
      const wk = es(t, 1.45, 1.7) * (1 - es(t, 1.95, 2.15));
      watcher.set({ x: 1130, y: 582, s: 0.5, flip: true, o: wk, armF: 10, head: 4, blink: blinkAt(time, 5) });
      pose(watcherAura, { x: 1130, y: 592, s: 0.5 * (1 + Math.sin(time * 2) * 0.03), o: wk * 0.9 });

      /* ---------- v2b: hunger ---------- */
      const bk = es(t, 3.15, 3.35);
      pose(bowlEl, { x: JX - 96, y: GY - 2, r: -20 * bk, o: sitK });
      const tk = es(t, 3.3, 3.5, ease.back);
      const [hx, hy] = headAt(JX - 16, SEAT, 1.05, false, 62);
      pose(thinkEl, { x: hx + 28, y: hy - 30 + Math.sin(time * 1.2) * 3, s: tk * 1.2, o: tk > 0 ? 0.92 : 0 });

      S.cam.z = 1.02 + es(t, 1.0, 1.9) * 0.04 + es(t, 3.0, 3.5) * 0.06;
      S.cam.x = lerp(-30, 0, es(t, 1.0, 1.9));
      S.cam.y = 30 + es(t, 3.0, 3.5) * 20;
    };
  },
};
