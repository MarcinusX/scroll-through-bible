// Łk 12,2–3 — a painted town street at night; a house with its front wall shut, a chink of lamplight at the shutter.
// "Nothing is covered up that will not be revealed": the whole front wall lifts away into the flies, and there they
// sit at the lamp, two men plotting, their golden masks laid on the table beside them. "What you have said in the
// darkness will be heard in the light": their dark scraps of talk float out over the street as the dawn comes up, turn
// to plain white slips in the light, and the neighbours stop and turn, a hand to the ear. "What you whispered in the
// ear in the inner rooms will be proclaimed on the housetops": one leans and whispers into the other's ear — and a
// crier is already running up the outside stair; on the roof he lifts both arms and calls it out over the town, the
// whisper hung up above him as a great open scroll, and the street looks up.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, house, moon, sun, stars, palm, cypress } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { cutHouse, HS, NIGHT, MORNING, mask, wordSlip, lampBody, lampFire, WICK, voiceRings, headAt, hand, alongPts, darkKnot, halo, sparkle, pharisee, manO, womanO, tr, PI } from './lib.js';

const F = HS.FLOOR, R = HS.ROOF;
const PA = { x: 670, look: pharisee(2) }, PB = { x: 800, look: pharisee(4) };
const NB = [{ x: 1010, y: 720, flip: true }, { x: 1092, y: 714, flip: true }, { x: 1170, y: 724, flip: true }];

function scroll(c, w = 150) {
  const s = sheet().p(c.cut([[-w / 2, -30], [w / 2, -32], [w / 2 + 2, 30], [-w / 2 - 1, 32]], 0.5, 8), C.parchment);
  let d = '';
  for (let y = -16; y <= 16; y += 10) { let x = -w / 2 + 14; while (x < w / 2 - 16) { const l = c.rr(8, 22); d += c.ribbon([[x, y + c.rr(-1, 1)], [Math.min(x + l, w / 2 - 14), y + c.rr(-1, 1)]], 2); x += l + 5; } }
  s.x(d, C.ink, 'opacity=".6"');
  s.p(c.cut(c.rect(-w / 2 - 10, -36, 12, 72), 0.3, 4) + c.cut(c.rect(w / 2 - 2, -36, 12, 72), 0.3, 4), C.wood3);
  return s.out();
}

export default {
  id: 'lk12-light',
  enter: 'fly',
  beats: [
    { v: 2 },
    { v: 3, text: 'Dlatego wszystko, co powiedzieliście w mroku, w świetle będzie słyszane,' },
    { v: 3, cont: true, text: 'a coście w izbie szeptali do ucha, głosić będą na dachach.' },
  ],
  cam: { x: [-40, 60], y: [-80, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const PO = S.portrait;   // phone: the neighbours and the words in the light come in from under the thread
    const NBX = PO ? [925, 995, 1065] : NB.map((n) => n.x);
    const TO = PO ? [[900, 450], [968, 415], [1032, 460]] : [[1000, 470], [1090, 430], [1170, 480]];
    sky(S, NIGHT);
    const morn = sky(S, MORNING, { name: 'morn', rise: 0 });
    morn.layer.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -600, y1: 420, n: 120 }));
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const moonEl = hanging(hangL, `${halo(100, 0.5)}${moon(c, 32)}`, { x: 1210, y: 160, len: 800 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1230, y: -600, len: 800 });
    /* the town behind */
    const far = S.layer({ par: 0.1, sh: 2 });
    const fb = hillsWith(c, { y: 440, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 18 });
    far.add(band(c, { y: 400, amps: [16, 7, 3], lens: [1000, 380, 130], color: C.hillFar }).markup + fb.markup + town(c, { x: 1250, y: fb.fn(1250) + 12, n: 6, spread: 300, sc: 0.55 }) + town(c, { x: 200, y: fb.fn(200) + 12, n: 5, spread: 260, sc: 0.5 }));
    const row = S.layer({ par: 0.25, sh: 3 });
    let hs = '';
    [[-300, 150, 120], [-120, 130, 150], [1080, 140, 130], [1250, 160, 110], [1440, 130, 140]].forEach(([x, w, h]) => { hs += house(c, x, 612, w, h, { stairs: false }); });
    row.add(hs + palm(c, 1030, 614, 170) + cypress(c, 240, 610, 120));
    const street = S.layer({ par: 0.4, sh: 3 });
    street.add(sheet().p(c.cut([[-1400, 606], [3000, 606], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.sand, C.stone, 0.3)).out());
    const nightWash = S.layer({ par: 0.25, sh: 0, flat: true });
    nightWash.add(`<rect x="-3000" y="300" width="8000" height="3000" fill="#1f2350" opacity=".55"/>`);

    /* the house */
    let inL;
    const H = cutHouse(S, { inside: () => { inL = S.layer({ par: 0.45, sh: 5 }); } });
    inL.add(`<g transform="translate(735 ${F})">${sheet().p(c.cut(c.rect(-70, -44, 140, 10), 0.3, 5), C.wood).p(c.cut(c.rect(-60, -34, 8, 34), 0.2, 4) + c.cut(c.rect(52, -34, 8, 34), 0.2, 4), C.wood2).out()}</g>`);
    inL.add(`<g transform="translate(700 ${F - 44}) scale(.9)">${lampBody(c)}</g><g transform="translate(748 ${F - 62}) rotate(-70)">${mask(c, { r: 17, stick: true })}</g>`);
    const fire = inL.add(`<g>${lampFire(c, 60)}</g>`);
    const pa = S.puppet(inL.add(person(c, { ...PA.look, pose: 'sit' })));
    const pb = S.puppet(inL.add(person(c, { ...PB.look, pose: 'sit' })));

    /* the street: neighbours, the crier */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const nb = NB.map((n, i) => ({ ...n, x: NBX[i], i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, i === 1 ? womanO(c, { robe: C.roseRobe }) : manO(c)))) }));
    const crier = S.puppet(pL.add(person(c, manO(c, { robe: C.ochreRobe, mantle: C.tealRobe, belt: C.leather }))));
    const voice = voiceRings(pL, c, { n: 3, color: C.sun, r: 40, w: 6 });

    /* words */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const WORDS = [0, 1, 2].map((i) => ({ i, dark: fx.add(`<g opacity="0">${darkKnot(c, 14)}</g>`), light: fx.add(`<g opacity="0">${wordSlip(c, 44)}</g>`), to: TO[i] }));
    const whisper = fx.add(`<g opacity="0">${darkKnot(c, 8)}</g>`);
    const big = fx.add(`<g transform="translate(0 -1500)"><path d="M-60 -2400V-36M60 -2400V-36" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/>${scroll(c, 180)}</g>`);
    const sparks = [0, 1, 2].map(() => fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    const dim = S.layer({ par: 0, sh: 0, flat: true });
    dim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#161a3c"/>`);

    return (t, time) => {
      const T = time;
      /* v2 — the front wall lifts away: it was all covered, now it is seen */
      const lift = es(t, 0.18, 0.6, ease.in);
      pose(H.front, { x: 0, y: -lift * 1100, r: Math.sin(lift * PI) * 1.2 });
      pose(H.front.querySelector('.chinks path'), { o: 0.9 * (1 - lift) });
      fade(H.glow, 0.25 + lift * 0.55);
      pose(fire, { x: 700 + WICK[0] * 0.9, y: F - 44 + WICK[1] * 0.9, s: 1 + (time ? Math.sin(T * 9) * 0.05 : 0), o: 1 - es(t, 1.4, 1.8) * 0.5 });

      /* v3a — the dawn: what was said in the dark is heard in the light */
      const dawn = es(t, 1.05, 1.6);
      morn.layer.fade(dawn);
      starL.fade(1 - dawn);
      nightWash.fade(1 - dawn);
      dim.fade(0.34 * (1 - dawn) * (1 - lift * 0.35));
      pose(moonEl, { x: 1210, y: 160 + dawn * 500, r: Math.sin(T * 0.6), oy: 0, o: dawn < 0.99 ? 1 : 0 });
      pose(sunEl, { x: 1230, y: lerp(-600, 140, es(t, 1.2, 1.8)), r: Math.sin(T * 0.6), oy: 0 });
      const talk = bump(t, 0.55, 1.2) + bump(t, 1.0, 1.5) * 0.6;
      const lean = es(t, 2.02, 2.2) * (1 - es(t, 2.5, 2.7));
      pa.set({ x: PA.x, y: F + 4, s: 0.92, armF: 40 + talk * 30 + lean * 30, armB: 20 + talk * 30, head: 6 + lean * 14, lean: lean * 12, blink: blinkAt(T, 1) });
      pb.set({ x: PB.x, y: F + 4, s: 0.92, flip: true, armF: 36 + bump(t, 0.7, 1.3) * 40, armB: 14, head: 4 - lean * 6, blink: blinkAt(T, 2) });
      const [ha, hya] = headAt(PA.x, F + 4, 0.92, false, 62);
      WORDS.forEach((w) => {
        const out = seg(t, 0.62 + w.i * 0.12, 1.25 + w.i * 0.12);
        const [x, y] = alongPts([[ha + 20, hya], [880, 470 - w.i * 20], w.to], ease.io(out));
        const lit = es(t, 1.35 + w.i * 0.06, 1.55 + w.i * 0.06);
        const bob = time ? Math.sin(T * 1.3 + w.i) * 4 : 0;
        const on = out > 0 ? 1 : 0;
        const gone = es(t, 2.05, 2.3);
        pose(w.dark, { x, y: y + bob, r: out * 60, s: 0.8 + out * 0.3, o: on * (1 - lit) * (1 - gone) });
        pose(w.light, { x, y: y + bob, r: Math.sin(w.i * 2) * 8, s: 1.1, o: on * lit * (1 - gone) });
        const sp = bump(t, 1.4 + w.i * 0.06, 1.8 + w.i * 0.06);
        pose(sparks[w.i], { x: w.to[0], y: w.to[1] - 30, s: sp, r: T * 40, o: sp });
      });
      const hear = es(t, 1.45, 1.7), up = es(t, 2.45, 2.7);
      nb.forEach((n) => {
        const k = es(t, 0.9 + n.i * 0.06, 1.35 + n.i * 0.06);
        const x = lerp(n.x + 240, n.x, k);
        n.p.set({ x, y: n.y, s: 0.94, flip: n.flip, walk: k > 0 && k < 1 ? x * 0.05 : undefined, o: seg(t, 0.88, 0.94), armF: 10 + hear * 20 * (1 - up) + up * (n.i === 1 ? 70 : 30), armB: 10 + hear * 150 * (1 - up) + up * (n.i === 0 ? 120 : 20), head: -hear * 8 - up * 18, blink: blinkAt(T, n.seed) });
      });

      /* v3b — the whisper in the ear; the crier on the housetop */
      const [hb, hyb] = headAt(PB.x, F + 4, 0.92, true, 62);
      const wk = seg(t, 2.12, 2.32), wu = es(t, 2.32, 2.6);
      pose(whisper, { x: lerp(lerp(ha + 18, hb - 12, wk), 820, wu), y: lerp(hyb - 4, R - 200, wu), s: 1 + wu * 0.4, o: wk > 0 && wu < 1 ? 1 : 0 });
      const climb = es(t, 2.0, 2.4);
      const [cx, cy] = climb < 1 ? alongPts(HS.STAIR, climb) : [lerp(900, 830, es(t, 2.4, 2.5)), R];
      const onRoof = es(t, 2.38, 2.42);
      const cry = es(t, 2.5, 2.65);
      crier.set({ x: cx, y: cy, s: 0.9, flip: climb < 1 || es(t, 2.4, 2.5) < 1, walk: climb > 0 && (climb < 1 || es(t, 2.4, 2.5) < 1) ? cy * 0.08 + cx * 0.03 : undefined, o: seg(t, 1.95, 2.0), armF: 30 + cry * 50, armB: 20 + cry * 140, head: -cry * 14, blink: blinkAt(T, 7) });
      const [chx, chy] = headAt(830, R, 0.9, false);
      voice(chx, chy, cry * onRoof, T, { spread: 3.4 });
      const bk = es(t, 2.55, 2.85, ease.out);
      pose(big, { x: 610, y: lerp(-1500, R - 116, bk), r: Math.sin(T * 0.7) * 1.2 * bk, oy: 0, o: bk > 0.01 ? 1 : 0 });

      S.cam.z = 1.04 + es(t, 0.2, 0.7) * 0.06 - es(t, 0.95, 1.4) * 0.08 + es(t, 2.0, 2.3) * 0.02;
      S.cam.x = -20 + es(t, 0.95, 1.4) * 60 - es(t, 2.0, 2.4) * 50;
      S.cam.y = 10 - es(t, 2.1, 2.5) * 80;
    };
  },
};
