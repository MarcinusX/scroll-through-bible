// Mt 26,51–54 — one of those with Jesus (Peter, as John names him) pulls a sword and strikes the high priest's servant:
// one bright arc, the servant claps his hand to his head and a tiny paper ear drops away — a moment only. "Put your
// sword back into its place": the blade goes home at his belt. "All who take the sword will die by the sword": on a
// hanging plate a sword cracks in two. "Do you think I could not ask my Father, and He would send me more than twelve
// legions of angels?" — He looks up, and the night sky fills with rank upon rank of little angels of light, waiting.
// "How then would the Scriptures be fulfilled?" — the legions fade; an open scroll comes down; He bows His head.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  nightSet, gardenTrees, eleven, makeBand, bandPose, hanging, vis, kf, hand, headAt, withFace, faceBits, person, pose, fade, lerp, mix, tr, blinkAt, C,
  TW, PI, say, sword, sheathed, paperEar, shadowPerson, guardOpts, cord, discPlate, swordHalves, legions, scrollOpen, MALCHUS, BAND_INK, MOB, ELEVEN,
} from './lib.js';
import { addToBody as addBody } from '../mark2/lib.js';

const GY = 700, JX = 820, MX = 640, PX0 = 900, PX1 = 730;

export default {
  id: 'mt26-sword',
  beats: [
    { v: 51 },
    { v: 52, text: 'Wtedy Jezus rzekł do niego: «Schowaj miecz swój do pochwy,' },
    { v: 52, cont: true, text: 'bo wszyscy, którzy za miecz chwytają, od miecza giną.' },
    { v: 53 },
    { v: 54 },
  ],
  cam: { x: [-80, 60], y: [-120, 160], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const N = nightSet(S, { moonAt: [1250, 130] });
    // the twelve legions, waiting in the sky (one sheet)
    const angL = S.layer({ par: 0.06, sh: 1, flat: true });
    angL.add(`<g><ellipse cx="790" cy="290" rx="620" ry="200" fill="url(#halo-glow)" opacity=".45"/>${legions(c, 790, 300, { cols: 11, rows: 4, dx: 74, dy: 62 })}</g>`);
    angL.fade(0);
    const treesL = S.layer({ par: 0.5, sh: 3 });
    gardenTrees(S, treesL, GY);
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    glowL.add(`<g transform="translate(470 ${GY})"><ellipse cx="0" cy="-110" rx="420" ry="270" fill="url(#warm-glow)" opacity=".55"/></g>`);

    const bandL = S.layer({ par: 0.5, sh: 5 });
    const flameL = S.layer({ par: 0.5, sh: 0, flat: true });
    const band = makeBand(S, bandL, flameL, MOB);
    const holdL = S.layer({ par: 0.5, sh: 5 });                  // the two who hold Him, behind Him
    const grab = [0, 1].map((i) => S.puppet(holdL.add(shadowPerson(c, guardOpts(c), BAND_INK))));
    const peopleL = S.layer({ par: 0.5, sh: 5 });
    const judas = S.puppet(peopleL.add(withFace(person(c, TW.judas), faceBits(c))));
    const malEl = peopleL.add(withFace(person(c, MALCHUS), faceBits(c)));
    const malchus = S.puppet(malEl);
    const malSad = malEl.querySelector('[data-part="sad"]');
    const { J, D } = eleven(S, peopleL, { gy: GY, pos: ELEVEN.filter((d) => d.k !== 'peter'), lamps: false, arm: 16 });
    const cordEl = peopleL.add(`<g>${cord(c)}</g>`);
    const pDraw = S.puppet(peopleL.add(withFace(person(c, { ...TW.peter, holdF: `<g transform="rotate(-100)">${sword(c, 58)}</g>` }), faceBits(c))));
    const pSheathEl = peopleL.add(withFace(addBody(person(c, { ...TW.peter }), sheathed(c)), faceBits(c)));
    const pSheath = S.puppet(pSheathEl);
    const pSad = pSheathEl.querySelector('[data-part="sad"]');

    const fx = S.layer({ par: 0.54, sh: 4 });
    const flash = fx.add(`<g><path d="${c.ribbon(c.arc(0, 0, 70, 70, -2.5, -0.5, 16), (u) => 1 + Math.sin(u * PI) * 8)}" fill="#fff8e8"/><circle r="40" fill="url(#halo-glow)"/></g>`);
    const earEl = fx.add(`<g>${paperEar(c, C.skin3)}</g>`);
    const putBack = fx.add(`<g>${say(c, tr('Schowaj miecz!', 'Put your sword back!'), { size: 20, side: 1 })}</g>`);
    const SH = swordHalves(c, 190);
    const plate = hanging(fx, discPlate(c, '', { r: 92, rim: C.wood2, fill: mix(C.storm2, C.indigo, 0.25) }) + `<g class="sa">${SH.a}</g><g class="sb">${SH.b}</g>`, { x: 0, y: -1500, len: 700 });
    const sa = plate.querySelector('.sa'), sb = plate.querySelector('.sb');
    const scroll = hanging(fx, `<g transform="scale(1.4)"><circle r="70" fill="url(#halo-glow)"/>${scrollOpen(c, 110, 60)}</g>`, { x: 0, y: -1500, len: 700 });

    return (t, time) => {
      const T = time;
      N.update(T);
      band.forEach((m) => bandPose(m, { x: m.x - 20 + (m.i < 4 ? 40 : 20), y: GY + m.y, s: m.s ?? 1, head: bump(t, 0.3, 1.2) * -6, lean: -bump(t, 0.25, 0.9) * 5 }, T));
      judas.set({ x: 560, y: GY + 10, s: 1.0, flip: false, armF: 16, armB: 8, head: 12, blink: blinkAt(T, 2) });

      /* v51 — the sword */
      const step = es(t, -0.2, 0.3, ease.out);
      const px = lerp(PX0, PX1, step);
      const draw = es(t, 0.05, 0.3);
      const strike = es(t, 0.5, 0.64);
      const after = es(t, 0.78, 1.0);
      const put = es(t, 1.05, 1.3);
      const swap = es(t, 1.3, 1.36);
      const back = es(t, 1.15, 1.5, ease.sine);
      pDraw.set({ x: px, y: GY + 4, s: 0.94, flip: true, o: 1 - swap, walk: step > 0 && step < 1 ? px * 0.06 : undefined, armF: 20 + draw * 30 + strike * 90 - after * 60 - put * 30, armB: 20 + strike * 20, lean: strike * 8 * (1 - after) - put * 3, head: -4 + put * 10, blink: blinkAt(T, 3) });
      const pxb = lerp(PX1, PX1 - 60, back);
      pSheath.set({ x: pxb, y: GY + 4, s: 0.94, flip: true, o: swap, walk: back > 0 && back < 1 ? pxb * 0.06 : undefined, armF: 18, armB: 10, head: 12, blink: blinkAt(T, 3) });
      fade(pSad, swap);
      const hurt = es(t, 0.6, 0.7);
      malchus.set({ x: MX - hurt * 16, y: GY + 8, s: 0.98, flip: false, armF: 26 - hurt * 10, armB: 10 + hurt * 150, head: -hurt * 14, lean: -hurt * 7, blink: blinkAt(T, 6) });
      fade(malSad, hurt);
      vis(flash, { x: MX + 50, y: GY - 170, s: 0.6 + strike * 0.5, r: -30, o: bump(t, 0.56, 0.98) });
      const fall = es(t, 0.66, 1.2, ease.in);
      const [mhx, mhy] = headAt(MX, GY + 8, 0.98, false);
      vis(earEl, { x: mhx + 10 + fall * 18, y: mhy + fall * 150, s: 1.1, r: fall * 160, o: t > 0.64 && t < 1.4 ? 1 : 0 });

      /* Jesus, held */
      const turn = es(t, 1.05, 1.2) * (1 - es(t, 1.9, 2.05));
      const sky = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1));
      const bow = es(t, 4.05, 4.3);
      J.p.set({ x: JX, y: GY + 6, s: 1.04, flip: true, armF: 20 + bump(t, 2.1, 2.9) * 20, armB: 14 + turn * 70 + sky * 30, head: turn * 4 - sky * 20 + bow * 14, blink: blinkAt(T) });
      fade(J.sad, 0.5 + bow * 0.5);
      const [chx, chy] = hand(JX, GY + 6, 1.04, true, 20);
      vis(cordEl, { x: chx, y: chy, s: 1.1, sx: -1, o: 1 });
      grab.forEach((g, i) => g.set({ x: i ? 740 : 770, y: GY + 2 + i * 4, s: 0.98, flip: false, armF: 70 - sky * 20, armB: 40, lean: 4 - sky * 6, head: -sky * 10 }));
      const [jhx, jhy] = headAt(JX, GY + 6, 1.04, true);
      const pb = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(putBack, { x: jhx + 10, y: jhy - 34, s: pb, o: pb > 0.01 ? 1 : 0 });

      /* v52b — the sword that turns on the one who takes it */
      const pin = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 2.9, 3.1, ease.in));
      vis(plate, { x: 800, y: 300 - (1 - pin) * 800, r: Math.sin(T * 0.8) * 1.5, o: pin > 0.01 ? 1 : 0 });
      const crack = es(t, 2.4, 2.6);
      pose(sa, { x: -crack * 22, y: 16 - crack * 8, r: -crack * 30 });
      pose(sb, { x: crack * 16, y: 16 + crack * 10, r: crack * 24 });

      /* v53 — twelve legions; v54 — the Scriptures */
      angL.fade(es(t, 3.1, 3.45) * (1 - es(t, 4.05, 4.4)));
      D.forEach((m) => {
        const fear = 0.7;
        m.p.set({ x: m.x + 26, y: m.y, s: m.s, flip: true, armF: m.arm, armB: 8 + fear * 30 + bump(t, 0.4, 1.2) * 40, head: -fear * 4 - sky * 14, blink: blinkAt(T, m.seed) });
        fade(m.sad, fear * (1 - sky * 0.5));
      });
      const sIn = es(t, 4.05, 4.35, ease.out);
      vis(scroll, { x: 800, y: 300 - (1 - sIn) * 800, r: Math.sin(T * 0.8) * 1.5, o: sIn > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, 0], [0.4, -30], [1.0, -20], [1.3, 0], [2.0, 0], [3.0, 0], [4.0, 0]]);
      S.cam.y = kf(t, [[-0.5, 60], [0.4, 80], [1.0, 70], [2.0, 30], [3.0, 30], [3.3, -100], [4.0, -100], [4.3, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.16], [0.4, 1.3], [1.0, 1.26], [2.0, 1.1], [3.0, 1.1], [3.3, 1.0], [4.0, 1.0], [4.3, 1.08]]);
    };
  },
};
