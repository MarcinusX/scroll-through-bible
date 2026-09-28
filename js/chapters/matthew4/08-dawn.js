// Mt 4,16–17 — night over Galilee. People sit on the hillsides with bowed heads, and ragged sheets of shadow
// with claws lie over the land. A great light: Jesus comes up onto the hill in a burst of radiance and the people
// lift their heads. "Light has dawned": the sun rises behind Him, the sky turns from night to dawn to morning and
// the shadows of death are pulled away. "From that time Jesus began to preach": He opens His arms, the people
// stand up. "Repent, for the kingdom of heaven is at hand": those walking off turn round and come back, and a
// golden gate of the kingdom comes down right beside Him, light pouring through it.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, olive, cypress, grass, flowers, sun, stars, town, bush } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { NIGHT, DAWN, DAY, darkSheet, rayBurst, kingdomGate, voiceRings, headAt, pose3, folk4, PI } from './lib.js';

const P = 0.5;
const JX = 800, JY = 664;       // Jesus on the hilltop
const hfn = (x) => 700 - Math.max(0, 1 - Math.abs(x - JX) / 420) ** 1.6 * 44 + Math.sin(x * 0.011) * 4;

export default {
  id: 'mt4-dawn',
  beats: [
    { v: 16, text: 'Lud, który siedział w ciemności, ujrzał światło wielkie,' },
    { v: 16, cont: true, text: 'i mieszkańcom cienistej krainy śmierci światło wzeszło.' },
    { v: 17, text: 'Odtąd począł Jezus nauczać i mówić:' },
    { v: 17, cont: true, text: '«Nawracajcie się, albowiem bliskie jest królestwo niebieskie».' },
  ],
  cam: { x: [-20, 20], y: [0, 50], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const dawnL = sky(S, DAWN, { name: 'dawn' }).layer;
    const nightL = sky(S, NIGHT, { name: 'night' }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -600, y1: 460, n: 140 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 58, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: JX, y: 700, len: 900 });
    const sunGlow = hangL.add(`<circle r="420" fill="url(#warm-glow)" opacity="0"/>`);

    /* ---------- Galilee: the lake, hills, the hill where He stands ---------- */
    const far = S.layer({ par: 0.08, sh: 2 });
    const fb = band(c, { y: 470, amps: [14, 6, 3], lens: [1000, 330, 120], color: C.hillFar });
    far.add(fb.markup + town(c, { x: 330, y: fb.fn(330) + 12, n: 6, spread: 220, sc: 0.4 }));
    far.add(waterBand(c, { y: 500, color: C.lake, foamN: 14, bottom: 900 }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    mid.add(hillsWith(c, { y: 560, amps: [18, 8, 3], lens: [900, 300, 110], color: C.hillMid, trees: 24, treeColor: C.sage, treeH: 20 }).markup);
    const hill = S.layer({ par: P, sh: 3 });
    hill.add(sheet().p(c.ridge(hfn, -900, 2500, 1700, 12, 1), C.hillNear).out());
    hill.add(grass(c, { x0: -900, x1: 2500, y: 700, fn: hfn, n: 60, h: 14, color: C.moss }) + olive(c, 300, hfn(300) + 30, 1.0) + olive(c, 1330, hfn(1330) + 30, 0.95) + cypress(c, 1180, hfn(1180) + 20, 130) + bush(c, 470, hfn(470) + 26, 60, C.sage, C.moss) + flowers(c, { x0: 380, x1: 1250, y: 760, fn: (x) => hfn(x) + 50, n: 18 }));

    /* ---------- the gate of the kingdom (behind Him) ---------- */
    const gateL = S.layer({ par: 0.45, sh: 6 });
    const KG = kingdomGate(c, 170, 250);
    const gateLight = gateL.add(`<g opacity="0"><circle cy="-130" r="260" fill="url(#halo-glow)"/>${KG.light}</g>`);
    const gate = gateL.add(`<g class="hang"><path d="M-90 -1800V-200M90 -1800V-200" stroke="rgba(233,196,111,.6)" stroke-width="1.4" fill="none"/><g class="obj">${KG.frame}</g></g>`);

    /* ---------- the people on the hillsides: sprites (sitting, looking up, standing) ---------- */
    const crowdL = S.layer({ par: P, sh: 4 });
    const GROUPS = [{ x: 520, n: 6, side: -1 }, { x: 1080, n: 6, side: 1 }].map((g, gi) => {
      const mem = Array.from({ length: g.n }, (_, k) => {
        const row = k % 2;
        const dx = (Math.floor(k / 2) - 1) * 92 + row * 40 + c.rr(-10, 10);
        return { dx, dy: row * 50, s: row ? 0.96 : 0.84, o: folk4(c, null) };
      });
      const flip = g.side > 0;                        // face Jesus (who is in the middle)
      const build = (poseName, head, armF = 0, armB = 0) => pose3(c, mem.map((m) => ({ x: m.dx, y: m.dy, s: m.s, flip, head: head + c.rr(-3, 3), armF, armB, o: { ...m.o, pose: poseName } })));
      const baseY = hfn(g.x) + 44;
      return {
        g, baseY,
        bowed: crowdL.sprite(build('sit', 22, 10, 0), g.x, baseY),
        up: crowdL.sprite(build('sit', -12, 30, 10), g.x, baseY),
        stand: crowdL.sprite(build('stand', -6, 40, 20), g.x, baseY),
      };
    });
    // four who walk off and turn back at "repent"
    const TURN = [[400, -1, 0], [1210, 1, 1], [640, -1, 2], [965, 1, 3]].map(([x, dir, i]) => ({ x, dir, i, p: S.puppet(crowdL.add(person(c, folk4(c, i % 2 === 0)))) }));

    /* ---------- night: a tint and the ragged shadow of death ---------- */
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d2349"/>`);
    const shL = S.layer({ par: 0.55, sh: 6, pad: 460 });
    shL.add(`<g transform="translate(420 760)">${darkSheet(c, -1, { w: 1800, h: 900, col: '#1c1f45' })}</g>`);
    const shR = S.layer({ par: 0.55, sh: 6, pad: 460 });
    shR.add(`<g transform="translate(1180 760)">${darkSheet(c, 1, { w: 1800, h: 900, col: '#1c1f45' })}</g>`);

    /* ---------- the great light, Jesus ---------- */
    const glowL = S.layer({ par: P, sh: 0, flat: true });
    const burst = glowL.add(`<g opacity="0"><circle r="300" fill="url(#halo-glow)"/>${rayBurst(c, { n: 22, r0: 60, r1: 640, spread: 0.035, o: 0.32 })}</g>`);
    const JL = S.layer({ par: P, sh: 5 });
    const jesus = S.puppet(JL.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(JL, c, { n: 3, color: C.clay, r: 40, w: 6 });

    return (t, time) => {
      /* v16a: the people sit in darkness; a great light */
      const dawn = es(t, 1.05, 1.6), day = es(t, 1.5, 2.2);
      nightL.fade(1 - dawn);
      starL.fade(1 - dawn);
      dawnL.fade(1 - day);
      tint.fade(0.42 * (1 - es(t, 1.05, 1.7)));
      const sunK = es(t, 1.1, 1.8, ease.out);
      swing(sunEl, JX, lerp(700, 380, sunK), time, 0.8, 0.5);
      pose(sunGlow, { x: JX, y: lerp(700, 380, sunK), s: 0.5 + sunK * 0.8, o: sunK * 0.8 * (1 - es(t, 2.2, 2.8) * 0.5) });
      const shoo = es(t, 1.08, 1.75, ease.in);
      shL.shift(-shoo * 440, 0);
      shR.shift(shoo * 440, 0);
      shL.fade(0.72 * (1 - es(t, 1.2, 1.75))); shR.fade(0.72 * (1 - es(t, 1.2, 1.75)));

      const comeUp = es(t, 0.05, 0.5, ease.out);
      const light = es(t, 0.3, 0.7);
      const b = light * (1 - es(t, 1.4, 2.0) * 0.8);
      pose(burst, { x: JX, y: JY - 110, s: 0.3 + light * 0.8 + Math.sin(time * 1.1) * 0.02, r: t * 6, o: b });

      /* people: bowed → heads up → standing */
      const lookK = es(t, 0.55, 0.62);
      const standK = es(t, 2.25, 2.32);
      GROUPS.forEach((G) => {
        G.bowed.set({ x: G.g.x, y: G.baseY, o: 1 - lookK });
        G.up.set({ x: G.g.x, y: G.baseY, o: lookK * (1 - standK) });
        G.stand.set({ x: G.g.x, y: G.baseY - 2, o: standK });
      });

      /* v17a: He begins to preach */
      const open = es(t, 2.05, 2.3);
      const call = es(t, 3.05, 3.3);
      jesus.set({ x: JX, y: JY + (1 - comeUp) * 90, s: 1.04, o: seg(t, 0.02, 0.12), armF: 14 + light * 30 * (1 - open) + open * 50 + call * 30, armB: 10 + light * 20 * (1 - open) + open * 70 - call * 20, head: -open * 4, blink: blinkAt(time) });
      const [hx, hy] = headAt(JX, JY, 1.04);
      voice(hx, hy, open * (1 - es(t, 3.85, 4.0)), time, { spread: 2.6 });

      /* v17b: they turn back; the gate of the kingdom comes near */
      TURN.forEach((m) => {
        const turn = es(t, 3.1 + m.i * 0.06, 3.18 + m.i * 0.06);
        const back = es(t, 3.18 + m.i * 0.06, 3.7 + m.i * 0.06);
        const x = m.x - m.dir * back * 90;
        const flip = turn < 0.5 ? m.dir < 0 : m.dir > 0;
        m.p.set({ x, y: hfn(x) + 76, s: 0.98, flip, o: seg(t, 2.3, 2.4), walk: back > 0 && back < 1 ? x * 0.06 : undefined, armF: back * 50, armB: back * 60, head: turn < 0.5 ? 8 : -6, blink: blinkAt(time, m.i + 2) });
      });
      const gk = es(t, 3.15, 3.55, ease.out);
      pose(gate, { x: JX, y: lerp(-500, JY + 6, gk), r: Math.sin(time * 0.7) * 0.6 * (1 - gk * 0.8), o: gk > 0.01 ? 1 : 0 });
      pose(gateLight, { x: JX, y: JY + 6, o: es(t, 3.45, 3.7) * (0.9 + Math.sin(time * 1.3) * 0.08) });

      S.cam.z = 1.02 + es(t, 0.2, 0.8) * 0.04 - es(t, 1.1, 1.7) * 0.04 + es(t, 3.0, 3.6) * 0.03;
      S.cam.y = 30;
    };
  },
};
