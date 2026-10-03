// Łk 17,24–25 — night on the road to Jerusalem; heavy dark sky. "For as the lightning, when it flashes out of the one
// part under the sky, shines to the other part under the sky; so will the Son of Man be in His day": a bolt of
// lightning runs across the whole width of the sky, from the far left to the far right, and the sky flashes white —
// and the light round Jesus flares up with it. "But first, He must suffer many things and be rejected by this
// generation": the flash dies; a dim red dawn comes up behind the city, and on a hill outside its wall three small
// crosses stand dark against it. The people of the village who had gathered on the road turn their backs on Him and
// walk away; Jesus bows His head, and the four look to Him.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { roadSet, ROAD9, roadFour, figure, folk, manO, womanO, halo, behindOf, voiceRings, headAt, kf, es, ease, bump, seg, PI } from './lib.js';
import { makeCutter } from '../../core/paper.js';
import { sky } from '../kit.js';

const JX = 740, JY = 716;
const SPOT0 = { peter: [590, 726, false], andrew: [516, 738, false], john: [880, 726, true], james: [440, 746, false] };
const GX0 = 1110, GYY = 700;    // the people who turn away

function bolt(c, len = 2200) {
  const pts = [[0, 0]];
  let y = 0;
  for (let i = 1; i <= 22; i++) { y += c.rr(-26, 26); y = Math.max(-60, Math.min(60, y)); pts.push([(len * i) / 22, y]); }
  let branches = '';
  [4, 9, 15, 19].forEach((k) => { const [x0, y0] = pts[k]; branches += c.ribbon([[x0, y0], [x0 + c.rr(20, 50), y0 + c.rr(30, 60)], [x0 + c.rr(40, 90), y0 + c.rr(70, 110)]], (u) => 4 - u * 3); });
  return `<path d="${c.ribbon(pts, (u) => 8 - Math.abs(u - 0.5) * 6)}" fill="#fff6d8"/><path d="${branches}" fill="#fff6d8" opacity=".85"/>`;
}
function smallCross(c, h = 30) {
  return sheet().p(c.cut([[-2.4, 0], [-2.4, -h], [2.4, -h], [2.4, 0]], 0.2, 4) + c.cut([[-h * 0.32, -h * 0.72], [h * 0.32, -h * 0.72], [h * 0.32, -h * 0.6], [-h * 0.32, -h * 0.6]], 0.2, 4), '#2c2533').out();
}

export default {
  id: 'lk17-lightning',
  beats: [
    { v: 24 },
    { v: 25 },
  ],
  cam: { x: [-40, 80], y: [-60, 40], z: [0.98, 1.1] },
  build(S) {
    // phone: the people who turn away stand clear of the thread and walk off a shorter way (still on the screen at
    // 1.75); James a step in from the edge
    const GX = S.portrait ? 990 : GX0, WALK = S.portrait ? 30 : 160;
    const SPOT = S.portrait ? { ...SPOT0, peter: [616, 726, false], andrew: [562, 738, false], james: [510, 746, false] } : SPOT0;
    const R = roadSet(S, { village: true });
    const c = S.c;
    const dawn = sky(S, ['#3b3150', '#8f5a5e', '#c98a74'], { name: 'dawn', rise: 0 });
    behindOf(dawn.layer, R.starL);
    dawn.layer.fade(0);
    const flash = S.layer({ par: 0, sh: 0, flat: true, rise: 0 });
    flash.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#fff4dc"/>`);
    behindOf(flash, R.far);
    flash.fade(0);
    const boltL = S.layer({ par: 0.05, sh: 0, flat: true });
    behindOf(boltL, R.far);
    const B = boltL.add(`<g opacity="0">${bolt(c)}</g>`);
    const crossL = S.layer({ par: 0.07, sh: 2 });
    behindOf(crossL, R.mid);
    const crosses = [-26, 0, 26].map((dx, i) => ({ dx, i, el: crossL.add(`<g opacity="0">${smallCross(c, i === 1 ? 30 : 24)}</g>`) }));
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const act = S.layer({ par: 0.45, sh: 5 });
    const aura = glowL.add(`<g>${halo(130, 0.6)}</g>`);
    /* the people of this generation: facing Him, then with their backs turned (two sprites) */
    const pc = makeCutter('lk17-generation');
    const MEM = Array.from({ length: 6 }, (_, i) => ({ x: (i % 3) * 44 + (i > 2 ? 22 : 0) - 44, y: i > 2 ? 12 : 0, o: i % 2 ? womanO(pc) : manO(pc), head: pc.rr(-4, 4) }));
    const draw = (fl, armF) => MEM.slice().sort((a, b) => a.y - b.y).map((m) => figure(pc, m.o, { x: m.x, y: m.y, s: 0.9, flip: fl, armF: armF + m.head * 2, armB: 6, head: m.head })).join('');
    const faceIn = act.sprite(draw(true, 20), GX, GYY);
    const away = act.sprite(draw(false, 8), GX, GYY);
    const F = roadFour(S, act, c);
    const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 38, w: 5 });

    return (t, time) => {
      const T = time;
      const dk = es(t, 1.2, 1.7);
      R.update(T, { eveK: 0.3, nightK: 1 - dk * 0.6, moonK: 0 });
      dawn.layer.fade(dk * 0.9);

      /* v24 — the lightning runs across the whole sky */
      const run = es(t, 0.25, 0.5, ease.in);
      const fl = es(t, 0.45, 0.55) * (1 - es(t, 0.9, 1.0));
      pose(B, { x: -300, y: 200, sx: Math.max(0.001, run), o: run > 0.001 ? 1 - es(t, 0.92, 1.0) : 0 });
      flash.fade(fl * 0.55);
      pose(aura, { x: JX, y: JY - 150, s: 1 + fl * 0.35, o: 0.6 + fl * 0.4 });
      pose(R.cityGlow, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 20, o: 0.3 + dk * 0.3 });

      /* v25 — three crosses on the hill against the red dawn; the people turn away */
      crosses.forEach((k) => { const q = es(t, 1.3 + k.i * 0.06, 1.5 + k.i * 0.06); pose(k.el, { x: 880 + k.dx, y: 432, s: 0.8 + q * 0.2, o: q }); });
      const turn = es(t, 1.35, 1.45);
      const walk = es(t, 1.45, 1.95);
      faceIn.set({ x: GX, y: GYY, s: 1, o: 1 - turn });
      away.set({ x: GX + walk * WALK, y: GYY - walk * 30 - (walk > 0 && walk < 1 ? Math.abs(Math.sin(walk * 20)) * 3 : 0), s: 1 - walk * 0.18, o: turn * (1 - es(t, 1.8, 1.98)) });

      const lookUp = bump(t, 0.35, 0.95);
      const bowed = es(t, 1.4, 1.7);
      F.jesus.set({ x: JX, y: JY, s: 1.04, armF: 16 + bump(t, 0.05, 0.9) * 50, armB: 8 + bump(t, 0.05, 0.9) * 50, head: -lookUp * 12 + bowed * 16, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, JY, 1.04, false);
      voice(jhx + 14, jhy, es(t, 0.02, 0.12) * (1 - es(t, 0.3, 0.4)) + es(t, 1.02, 1.1) * (1 - es(t, 1.4, 1.5)), T, { dir: 1, spread: 2 });
      F.ds.forEach((d) => {
        const [x, y, f] = SPOT[d.k];
        d.p.set({ x, y, s: 0.96, flip: f, armF: 14 + lookUp * 40 + bowed * 10, armB: 6 + lookUp * (d.k === 'peter' ? 110 : 30), head: -lookUp * 14 + bowed * 8, lean: -lookUp * 4, blink: blinkAt(T, d.seed) });
      });

      S.cam.x = kf(t, [[0, 20], [1, 20], [1.6, 40], [2, 40]]);
      S.cam.y = kf(t, [[0, -40], [0.9, -40], [1.3, 20], [2, 20]]);
      S.cam.z = kf(t, [[0, 0.98], [0.9, 1.0], [1.3, 1.06], [2, 1.08]]);
    };
  },
};
