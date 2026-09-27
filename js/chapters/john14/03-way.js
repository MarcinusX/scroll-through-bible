// J 14,6–7 — the great I AM on the dark stage. He stands in a tall arched doorway in a dark wall. "I am the way,
// the truth and the life": the words JA JESTEM come down from the flies, a road of light runs up to His feet, a lamp
// kindles on a golden lampstand, a small tree of life grows and bears golden fruit — and a spark from each of the
// three flies into Him. "No one comes to the Father except through Me": the doors behind Him swing open on the
// Father's light (never a figure) and small travellers walk up the road, reach Him and pass as little lights into
// the radiance. "If you had known Me you would have known My Father": a pale veil hangs before the light while the
// disciples look on. "From now on you know Him and have seen Him": the veil lifts and the light falls on their faces.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { stars } from '../../assets/nature.js';
import { oilLamp, lampstand } from '../../assets/things.js';
import {
  TW, DEEP, iAm, archWall, doorLeaf, lifeTree, radiance, rayBurst, glowDisc, nameTag, hanging, swing, soulLight, arcThreads,
  kf, vis, headAt, hand, tr, PI,
} from './lib.js';

const FL = 662, JX = 800;

export default {
  id: 'j14-way',
  beats: [
    { v: 6, text: 'Odpowiedział mu Jezus: «Ja jestem drogą i prawdą, i życiem.' },
    { v: 6, cont: true, text: 'Nikt nie przychodzi do Ojca inaczej jak tylko przeze Mnie.' },
    { v: 7, text: 'Gdybyście Mnie poznali, znalibyście i mojego Ojca.' },
    { v: 7, cont: true, text: 'Ale teraz już Go znacie i zobaczyliście».' },
  ],
  cam: { x: [-40, 40], y: [-120, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DEEP);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -700, x1: 2300, y0: -700, y1: 640, n: 120 }));
    // the Father's light behind the doorway
    const lightL = S.layer({ par: 0.2, sh: 0, flat: true });
    lightL.add(`<g transform="translate(${JX} 400)">${glowDisc(420, 'halo-glow', 1)}${rayBurst(c, { n: 30, r0: 90, r1: 360, spread: 0.035, o: 0.3 })}</g>`);
    lightL.add(`<g transform="translate(${JX} 400)">${radiance(c, 150)}</g>`);
    lightL.add(`<path d="${c.ribbon([[JX, FL], [JX, 560], [JX, 470]], (u) => 40 - u * 30)}" fill="#fff6dc" opacity=".8"/>`);
    // the dark wall with the doorway, the two door leaves
    const wallL = S.layer({ par: 0.25, sh: 4 });
    wallL.add(archWall(c, { cx: JX, w: 300, top: 170, bottom: FL }));
    const leafCol = mix('#1f2350', C.indigo, 0.35);
    const leafL = wallL.add(`<g>${doorLeaf(c, -1, 150, FL - 170).replace(new RegExp(C.wood3, 'g'), leafCol)}</g>`);
    const leafR = wallL.add(`<g>${doorLeaf(c, 1, 150, FL - 170).replace(new RegExp(C.wood3, 'g'), leafCol)}</g>`);
    // the veil (v7a)
    const veilL = S.layer({ par: 0.26, sh: 2, pad: 520 });
    const vs = sheet().p(c.cut([[JX - 170, 130], [JX + 170, 130], [JX + 176, FL - 20], [JX + 90, FL - 6], [JX, FL - 24], [JX - 90, FL - 8], [JX - 176, FL - 22]], 0.8, 10), '#e9e2f0');
    veilL.add(`<g opacity=".74">${vs.out()}</g><path d="M${JX - 120} -1400V132M${JX + 120} -1400V132" stroke="rgba(233,196,111,.6)" stroke-width="1.4" fill="none"/>`);
    // the ground and the road of light
    const ground = S.layer({ par: 0.4, sh: 3 });
    const gs = sheet();
    gs.p(c.cut([[-1400, FL - 4], [3200, FL - 4], [3200, 1800], [-1400, 1800]], 1, 20), mix(C.indigo, C.night2, 0.45));
    gs.p(c.cut([[JX - 44, FL], [JX + 44, FL], [JX + 330, 1100], [JX - 330, 1100]], 0.6, 10), mix(C.sand, C.indigo, 0.35));
    ground.add(gs.out());
    const roadGlow = ground.add(`<g><path d="${c.cut([[JX - 40, FL + 2], [JX + 40, FL + 2], [JX + 300, 1100], [JX - 300, 1100]], 0.5, 10)}" fill="${C.halo}" opacity=".8"/><path d="${c.poly([[JX - 8, FL + 4], [JX + 8, FL + 4], [JX + 60, 1100], [JX - 60, 1100]])}" fill="#fffaf0" opacity=".7"/></g>`);
    const dashes = Array.from({ length: 6 }, (_, i) => { const u = i / 6; const y = lerp(1000, FL + 14, u); return { u, y, el: ground.add(`<g><path d="${c.poly(c.ell(0, 0, 16, 4, 10))}" fill="#fffaf0"/></g>`) }; });
    // the lamp (truth) and the tree (life)
    const props = S.layer({ par: 0.42, sh: 5 });
    const LX = 560, TX = 1040;
    props.add(`<g transform="translate(${LX} ${FL + 4})">${lampstand(c, 130)}</g>`);
    const lamp = props.add(`<g>${oilLamp(c)}</g>`);
    const lampFl = lamp.querySelector('.flame'), lampGl = lamp.querySelector('.glow');
    const tree = props.add(`<g>${lifeTree(c, 170)}</g>`);
    // travellers on the road
    const walkL = S.layer({ par: 0.45, sh: 4 });
    const pilgrims = Array.from({ length: 4 }, (_, i) => ({ i, p: S.puppet(walkL.add(person(c, crowdPerson(c)))), side: i % 2 ? 1 : -1 }));
    const souls = pilgrims.map(() => walkL.add(`<g>${soulLight(c, 7)}</g>`));
    // Jesus
    const act = S.layer({ par: 0.5, sh: 6 });
    const J = S.puppet(act.add(person(c, CAST.jesus)));
    const fx = S.layer({ par: 0.5, sh: 0, flat: true });
    const halo = fx.add(`<g>${glowDisc(120, 'halo-glow', 1)}</g>`);
    const thr = arcThreads(fx, 3, { w: 2.4, color: C.halo });
    const sparks = [0, 1, 2].map(() => fx.add(`<g>${soulLight(c, 8)}</g>`));
    const tagL = S.layer({ par: 0.5, sh: 4 });
    const plaque = hanging(tagL, iAm(c, tr('JA JESTEM', 'I AM'), { size: 36 }), { x: JX, y: 196, len: 700 });
    const tagWay = hanging(tagL, nameTag(c, tr('drogą', 'the way'), { size: 20 }), { x: JX - 175, y: 540, len: 700 });
    const tagTruth = hanging(tagL, nameTag(c, tr('prawdą', 'the truth'), { size: 20 }), { x: LX, y: 380, len: 700 });
    const tagLife = hanging(tagL, nameTag(c, tr('życiem', 'the life'), { size: 20 }), { x: TX, y: 380, len: 700 });
    // the disciples looking on
    const faceL = S.layer({ par: 0.6, sh: 0, flat: true });
    const faceGlow = [0, 1, 2, 3].map(() => faceL.add(`<g>${glowDisc(110, 'warm-glow', 0.7)}</g>`));
    const front = S.layer({ par: 0.6, sh: 6 });
    const D = [['thomas', 470, false], ['philip', 580, false], ['peter', 1020, true], ['john', 1130, true]].map(([k, x, flip], i) => ({ k, x, flip, seed: c.rr(0, 9), p: S.puppet(front.add(person(c, TW[k]))) }));

    return (t, time) => {
      const T = time;
      /* v6a — I AM: the way, the truth, the life */
      const pk = es(t, 0.02, 0.3, ease.out) * (1 - es(t, 1.05, 1.3, ease.in));
      swing(plaque, JX, 196 - (1 - pk) * 700, pk > 0.001 ? T : 0, 0.8, 0.7); fade(plaque, pk > 0.001 ? 1 : 0);
      const way = es(t, 0.2, 0.42), truth = es(t, 0.36, 0.56), life = es(t, 0.5, 0.72);
      fade(roadGlow, way * 0.9 + es(t, 1.1, 1.4) * 0.1);
      dashes.forEach((d, i) => { const k = es(t, 0.2 + i * 0.035, 0.26 + i * 0.035); const s = lerp(1.6, 0.4, d.u); vis(d.el, { x: JX, y: d.y + ((T ? T * 0.3 : 0) % 1) * 0, s: s * k, o: k }); });
      swing(tagWay, JX - 170, 540 - (1 - way) * 700 - es(t, 1.05, 1.3, ease.in) * 700, way > 0.001 ? T : 0, 1, 0.8, 3);
      swing(tagTruth, LX, 380 - (1 - truth) * 700 * (1 - es(t, 1.05, 1.3) * 0) - es(t, 1.05, 1.3, ease.in) * 700, truth > 0.001 ? T : 0, 1, 0.8, 1);
      swing(tagLife, TX, 380 - (1 - life) * 700 - es(t, 1.05, 1.3, ease.in) * 700, life > 0.001 ? T : 0, 1, 0.8, 2);
      pose(lamp, { x: LX - 2, y: FL + 4 - 136 });
      const lf = truth * (1 + (T ? Math.sin(T * 7) * 0.06 : 0));
      pose(lampFl, { x: 35, y: -16, s: lf });
      fade(lampGl, truth * 0.9);
      vis(tree, { x: TX, y: FL + 6, s: 0.2 + life * 0.8, sy: 1, o: life > 0.01 ? 1 : 0 });
      // three sparks converge into Him
      const conv = seg(t, 0.72, 0.92);
      const heart = [JX + 2, FL - 128];
      [[JX, FL + 40], [LX + 33, FL - 170], [TX, FL - 115]].forEach(([x, y], i) => {
        const k = ease.io(seg(conv, i * 0.12, 0.6 + i * 0.12));
        vis(sparks[i], { x: lerp(x, heart[0], k), y: lerp(y, heart[1], k) - Math.sin(k * PI) * 60, s: 1, o: k > 0 && k < 1 ? 1 : 0 });
        thr(i, x, y, lerp(x, heart[0], k), lerp(y, heart[1], k), 60, k > 0 ? (1 - es(t, 1.0, 1.2)) * 0.6 : 0);
      });
      const shine = es(t, 0.85, 1.0) * (1 - es(t, 1.1, 1.3) * 0.4) + es(t, 3.1, 3.4) * 0.3;
      vis(halo, { x: JX + 2, y: FL - 150, s: 0.8 + shine * 0.8, o: 0.4 + shine * 0.6 });

      /* v6b — the doors open on the Father's light; travellers come through Him */
      const open = es(t, 1.08, 1.45);
      lightL.fade(open);
      pose(leafL, { x: JX - 150, y: FL, sx: 1 - open * 0.88 });
      pose(leafR, { x: JX + 150, y: FL, sx: 1 - open * 0.88 });
      pilgrims.forEach((m, i) => {
        const u = seg(t, 1.08 + i * 0.1, 1.62 + i * 0.1);
        const x = JX + m.side * lerp(250 - i * 26, 40, ease.out(u)), y = lerp(960, FL + 8, ease.out(u)), s = lerp(0.8, 0.42, u);
        const gone = seg(u, 0.85, 1);
        m.p.set({ x, y, s, flip: m.side > 0, o: (u > 0 ? 1 : 0) * (1 - gone), walk: u > 0 && u < 1 ? t * 26 + i : undefined, blink: blinkAt(T, i) });
        const r = seg(t, 1.55 + i * 0.1, 1.85 + i * 0.1);
        vis(souls[i], { x: JX + m.side * 40 * (1 - r), y: lerp(FL - 40, 400, ease.out(r)), s: 1 - r * 0.4, o: r > 0 && r < 1 ? 1 : 0 });
      });

      /* v7 — the veil before the light, then lifted */
      const veil = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 3.05, 3.45, ease.in));
      veilL.shift(0, -(1 - veil) * 520);
      veilL.fade(veil > 0.001 ? 1 : 0);
      J.set({ x: JX, y: FL + 2, s: 1.15, armF: 20 + bump(t, 0.1, 0.95) * 30 + bump(t, 1.1, 1.9) * 20 + es(t, 2.1, 2.4) * (1 - es(t, 3.05, 3.3)) * 45 + es(t, 3.1, 3.4) * 40, armB: 12 + bump(t, 0.1, 0.95) * 140 + bump(t, 1.1, 1.9) * 140 + es(t, 3.1, 3.4) * 120, head: -bump(t, 1.1, 1.9) * 8, blink: blinkAt(T) });
      const see = es(t, 3.1, 3.5);
      const look = es(t, 1.9, 2.2);
      D.forEach((m, i) => {
        m.p.set({ x: m.x, y: 790, s: 0.95, flip: m.flip, o: look, armF: 16 + see * 50, armB: 8 + see * (i % 2 ? 40 : 90), head: -6 - see * 8, blink: blinkAt(T, m.seed) });
        const [hx, hy] = headAt(m.x, 790, 0.95, m.flip);
        vis(faceGlow[i], { x: hx, y: hy + 20, s: 0.6 + see * 0.6, o: see * look });
      });
      faceL.fade(1);

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -60], [1, -40], [1.4, -20], [2, 40], [3, 50], [4, 40]]);
      S.cam.z = kf(t, [[0, 1.08], [1, 1.04], [1.5, 1.0], [2.1, 1.02], [4, 1.06]]);
    };
  },
};
