// Mt 21,28–30 — the parable of the two sons flies in as a painted flat: a farmhouse, a bench in the shade, and the
// walled vineyard with its gate. "What do you think?" — a question comes down. A man had two sons; he asks the first,
// then the second, to go and work in the vineyard today. One says yes and sits down on the bench; the other says no,
// then thinks again (a little light in his thought), picks up his hoe and goes in at the gate, and is seen working
// among the vines over the wall. (The Polish and the English tell the sons in opposite order, so who does what
// follows the language.)
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, olive, cypress, grass, flowers, bush, rock } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { vineGate, vineStock, grapeBunch, FATHER, SONS, bubble, thought, headAt, hoe, bench, sparkle, spark, withFace, faceBits, hungPlate, tr, DAY, FONT, PI } from './lib.js';

const G = 690;
const GATE = 1190;
const FX = 760;                            // the father
const SX = [600, 900];                     // the sons' places
const HOE = GATE - 90;                     // where the hoe leans
const A_OBEYS = tr(false, true);           // PL: the first says "I go" and does not; EN: the first says "I will not" and goes

export default {
  id: 'mt21-twosons',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 28, text: 'Co myślicie?' },
    { v: 28, cont: true, text: 'Pewien człowiek miał dwóch synów.' },
    { v: 28, cont: true, text: 'Zwrócił się do pierwszego i rzekł: "Dziecko, idź dzisiaj i pracuj w winnicy!"' },
    { v: 29 },
    { v: 30, text: 'Zwrócił się do drugiego i to samo powiedział.' },
    { v: 30, cont: true, text: 'Ten odparł: "Nie chcę".' },
    { v: 30, cont: true, text: 'Później jednak opamiętał się i poszedł.' },
  ],
  cam: { x: [-180, 90], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1260, y: 140, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 180), { x: 480, y: 120, len: 700 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [16, 7, 3], lens: [1100, 400, 140], color: C.hillFar, x0: -1400, x1: 3000 }).markup);
    const midL = S.layer({ par: 0.18, sh: 3 });
    const mb = hillsWith(c, { y: 500, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.olive, treeH: 18, x0: -1400, x1: 3000 });
    midL.add(mb.markup + cypress(c, 980, mb.fn(980) + 8, 120) + olive(c, 1480, mb.fn(1480) + 10, 0.8));

    /* ---------- the vineyard behind its wall ---------- */
    const vineL = S.layer({ par: 0.36, sh: 4 });
    let vines = '';
    for (let x = GATE - 300; x < GATE + 560; x += 66) if (Math.abs(x - GATE) > 50) vines += `<g transform="translate(${x} ${G - 36})">${vineStock(c, 110)}</g><g transform="translate(${x - 16} ${G - 116})">${grapeBunch(c, 3.8)}</g><g transform="translate(${x + 18} ${G - 112})">${grapeBunch(c, 3.6)}</g>`;
    vineL.add(sheet().p(c.cut([[GATE - 330, G - 30], [GATE + 700, G - 34], [GATE + 700, G], [GATE - 330, G]], 0.6, 10), mix(C.hillNear, C.soil, 0.25)).out() + vines);
    const worker = S.puppet(vineL.add(person(c, { ...SONS[0], holdF: hoe(c) })));   // the obedient son at work (look set below)
    const worker2 = S.puppet(vineL.add(person(c, { ...SONS[1], holdF: hoe(c) })));
    const wallL = S.layer({ par: 0.4, sh: 4 });
    wallL.add(`<g transform="translate(${GATE} ${G - 8})">${vineGate(c, 120, 180)}</g>`);

    /* ---------- the farmhouse and its bench ---------- */
    const houseL = S.layer({ par: 0.4, sh: 4 });
    const hs = sheet();
    const wall = mix(C.plaster, C.sand, 0.25);
    hs.p(c.cut([[150, G - 4], [150, 440], [470, 434], [470, G - 4]], 0.8, 10), wall);
    hs.p(c.cut([[140, 444], [480, 438], [480, 424], [140, 430]], 0.5, 10), C.roof);
    hs.p(c.cut([[250, G - 4], [250, 570], ...c.arc(290, 570, 40, 38, PI, 2 * PI, 10), [330, G - 4]], 0.4, 6), C.wood2);
    hs.p(c.cut([[380, 540], [380, 500], ...c.arc(408, 500, 28, 24, PI, 2 * PI, 8), [436, 540]], 0.4, 5), C.soilDark);
    hs.p(c.ribbon([[374, 542], [442, 542]], 6), C.wood2);
    houseL.add(hs.out());
    const BX = S.portrait ? 525 : 470;   // phone: the bench (and the son idling on it) stays whole at the left edge in the later beats
    houseL.add(olive(c, 520, G - 4, 1.05) + `<g transform="translate(${BX} ${G})">${bench(c, 130, 40)}</g>`);

    const groundL = S.layer({ par: 0.44, sh: 3 });
    const gs = sheet();
    gs.p(c.ridge(c.wave(G - 10, [3, 1.5], [700, 180]), -1400, 3000, 1800, 12, 1), mix(C.sand, C.hillNear, 0.35));
    groundL.add(gs.out() + grass(c, { x0: -900, x1: 2500, y: G - 8, n: 36, h: 12, color: C.olive }) + flowers(c, { x0: -600, x1: 1000, y: G - 6, n: 14 }));

    /* ---------- the father and his sons ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const father = S.puppet(P.add(person(c, { ...FATHER })));
    const sons = SONS.map((o, i) => {
      const obeys = i === 0 ? A_OBEYS : !A_OBEYS;
      const st = S.puppet(P.add(withFace(person(c, { ...o }), faceBits(c))));
      return { i, o, obeys, seed: c.rr(0, 9), st, si: S.puppet(P.add(person(c, { ...o, pose: 'sit' }))), sad: st.el.querySelector('[data-part="sad"]'), angry: st.el.querySelector('[data-part="angry"]') };
    });
    const hoeEl = P.add(`<g>${hoe(c)}</g>`);   // leaning at the house wall, picked up by the one who goes
    // the working son inside the vineyard wears the right look
    const inside = sons.find((s) => s.obeys);
    const W = inside.i === 0 ? worker : worker2, Woff = inside.i === 0 ? worker2 : worker;

    /* ---------- words ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const whatQ = fx.add(hungPlate(c, `<text x="0" y="20" text-anchor="middle" font-family="${FONT}" font-size="54" fill="${C.terracotta}">?</text>`, { r: 50 }));
    const whatW = fx.add(`<g>${bubble(c, [tr('Co myślicie?', 'What do you think?')], { size: 20, tail: 0 })}</g>`);
    const go1 = fx.add(`<g>${bubble(c, [tr('Dziecko, idź dzisiaj', 'Son, go work today'), tr('pracuj w winnicy!', 'in my vineyard!')], { size: 18, tail: -1 })}</g>`);
    const go2 = fx.add(`<g>${bubble(c, [tr('Dziecko, idź dzisiaj', 'Son, go work today'), tr('pracuj w winnicy!', 'in my vineyard!')], { size: 18, tail: 1 })}</g>`);
    const YES = tr('Idę, panie!', 'I go, sir!'), NO = tr('Nie chcę.', 'I will not.');
    const replies = sons.map((s) => fx.add(`<g>${bubble(c, [s.obeys ? NO : YES], { size: 20, tail: s.i === 0 ? 1 : -1 })}</g>`));
    const change = fx.add(`<g>${thought(c, `<g transform="translate(0 6) scale(.9)">${spark(c, 12)}</g>`, { w: 60, h: 48 })}</g>`);
    const joy = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 9)}</g>`));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 90, 900, 230, C.sage, C.moss) + bush(c, 1500, 890, 210, C.moss, C.sage) + rock(c, 1340, 910, 150, 50, C.rock2));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1260, 140, T, 1, 0.7);
      swing(cl1, 480 + Math.sin(T * 0.1) * 26, 120, T, 1.3, 0.6, 1);

      /* v28a — "What do you think?" */
      const qk = es(t, 0.1, 0.45, ease.out) * (1 - es(t, 0.9, 1.1, ease.in));
      pose(whatQ, { x: 800, y: lerp(-800, 230, qk), r: T ? Math.sin(T * 1.1) * 2 : 0 });
      const wk = es(t, 0.3, 0.45, ease.back) * (1 - es(t, 0.9, 1.0));
      pose(whatW, { x: 800, y: 350, s: wk, o: wk > 0.02 ? 1 : 0 });

      /* v28b — a man had two sons: they come out of the house */
      const fIn = es(t, 0.95, 1.3, ease.out);
      const fx_ = lerp(330, FX, fIn);
      const speak1 = es(t, 2.05, 2.2) * (1 - es(t, 2.85, 3.0));
      const speak2 = es(t, 4.05, 4.2) * (1 - es(t, 4.85, 5.0));
      const faceB = t > 3.95;
      father.set({ x: fx_, y: G, s: 1.02, flip: fIn < 1 ? false : faceB ? false : true, walk: fIn > 0 && fIn < 1 ? fx_ * 0.05 : undefined, armF: speak1 * 80 + speak2 * 80 + bump(t, 1.35, 1.9) * 40, armB: bump(t, 1.35, 1.9) * 40 + (speak1 + speak2) * 20, head: -bump(t, 3.3, 3.9) * 6 * (A_OBEYS ? 0 : 1), o: seg(t, 0.93, 0.97), blink: blinkAt(T, 1) });
      const [fhx, fhy] = headAt(fx_, G, 1.02, !faceB);
      const b1 = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(go1, { x: fhx - 70, y: fhy - 40, s: b1, o: b1 > 0.02 ? 1 : 0 });
      const b2 = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.9, 5.0));
      pose(go2, { x: fhx + 60, y: fhy - 40, s: b2, o: b2 > 0.02 ? 1 : 0 });

      // each son: comes out (v28b), is asked (A: v28c, B: v30a), replies, and does — or doesn't
      let hoeAt = null;
      sons.forEach((s) => {
        const tReply = s.i === 0 ? 3.05 : 5.05;              // the reply beat
        const tAct = s.i === 0 ? 3.3 : 6.05;                // what he does afterwards
        const inK = es(t, 1.0 + s.i * 0.1, 1.45 + s.i * 0.1, ease.out);
        let x = lerp(330, SX[s.i], inK);
        let walk = inK > 0 && inK < 1;
        let flip = s.i === 1;                                // both face the father
        const reply = es(t, tReply, tReply + 0.15) * (1 - es(t, tReply + 0.8, tReply + 0.95));
        const rEnd = s.obeys ? tAct - 0.02 : tReply + 0.9;   // the one who repents drops his "no" as he thinks again
        const rk = es(t, tReply + 0.02, tReply + 0.2, ease.back) * (1 - es(t, rEnd - 0.1, rEnd));
        let armF = 0, armB = 0, head = 0, sit = 0, o = seg(t, 0.98 + s.i * 0.1, 1.02 + s.i * 0.1), lean = 0;
        if (s.obeys) {
          // "I will not": he turns his back … later he thinks again, takes the hoe and goes in at the gate
          const turn = reply > 0.3 && t < tAct + 0.3;
          flip = turn ? !flip : flip;
          armF = reply * 20; armB = reply * 30; head = reply * 10;
          fade(s.angry, reply);
          const think = es(t, tAct, tAct + 0.12) * (1 - es(t, tAct + 0.3, tAct + 0.38));
          fade(s.sad, think);
          const go = es(t, tAct + 0.12, tAct + 0.4);
          if (go > 0) {
            x = lerp(SX[s.i], GATE, go); flip = false; walk = go < 1;
            if (x > HOE - 10) hoeAt = [x, go];
            o *= 1 - seg(t, tAct + 0.36, tAct + 0.4);
            armF = x > HOE - 10 ? 30 : 0;
          }
          const [tx, ty] = headAt(x, G, 0.98, flip);
          pose(change, { x: tx + (flip ? -10 : 10), y: ty - 14, s: think, o: think > 0.02 ? 1 : 0 });
          // at work in the vineyard, over the wall
          const work = seg(t, tAct + 0.4, tAct + 0.46);
          W.set({ x: GATE - 170, y: G - 30, s: 0.84, flip: false, armF: 40 + Math.abs(Math.sin((t - tAct) * 14)) * 50 * work, armB: 20, head: 8, o: work, blink: blinkAt(T, s.seed) });
          joy.forEach((j, i) => { const k = bump(t, tAct + 0.55 + i * 0.03, tAct + 0.95); pose(j, { x: GATE - 200 + i * 40, y: G - 230 - k * 30, s: k + 0.001, r: T * 40, o: k }); });
        } else {
          // "I go, sir!": a bow … and he sits down on the bench in the shade
          armF = reply * 60; head = reply * 12; lean = reply * (s.i === 0 ? 6 : -6);
          const idle = es(t, tAct, tAct + 0.35);
          if (t > tAct) {
            x = lerp(SX[s.i], BX, idle); flip = true; walk = idle > 0 && idle < 1;
            sit = seg(t, tAct + 0.36, tAct + 0.42);
          }
          s.si.set({ x: BX, y: G - 38, s: 0.98, flip: false, armF: 20, armB: 10, head: 14, o: o * sit, blink: T ? blinkAt(T, s.seed) : 0 });
        }
        s.st.set({ x, y: G + 4 - s.i * 4, s: 0.98, flip, walk: walk ? x * 0.05 + s.i : undefined, armF, armB, head, lean, o: o * (1 - sit), blink: blinkAt(T, s.seed) });
        const [rx, ry] = headAt(x, G + 4, 0.98, flip);
        pose(replies[s.i], { x: rx + (s.i === 0 ? 40 : -40), y: ry - 40, s: rk, o: rk > 0.02 ? 1 : 0 });
      });
      Woff.set({ x: -900, y: G, o: 0 });
      // the hoe: leaning at the vineyard wall until he picks it up on his way in
      if (hoeAt) pose(hoeEl, { x: hoeAt[0] + 34, y: G - 80, r: 10, o: 1 - seg(t, (A_OBEYS ? 3.3 : 6.05) + 0.36, (A_OBEYS ? 3.3 : 6.05) + 0.4) });
      else pose(hoeEl, { x: HOE, y: G - 90, r: -14, o: 1 });

      S.cam.x = 10 + es(t, 0.9, 1.3) * 10 + (A_OBEYS ? es(t, 3.6, 3.9) * (1 - es(t, 4.0, 4.3)) : es(t, 6.2, 6.5)) * 50;
      if (S.portrait) {
        // the narrow stage: look at the bench when a son sits down, at the gate when one goes in
        const winA = es(t, 3.1, 3.4) * (1 - es(t, 3.95, 4.2)), winB = es(t, 6.0, 6.3);
        S.cam.x = A_OBEYS ? winA * 60 + winB * -170 : winA * -170 + winB * 60;
      }
      S.cam.y = 10;
      S.cam.z = 1.12;
    };
  },
};
