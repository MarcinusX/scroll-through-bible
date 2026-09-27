// J 18,10–11 — Simon Peter pulls a sword from under his cloak (a glint in the torchlight) and steps in front of his
// Master; one quick bright arc — the servant claps his hand to his head and a tiny paper ear drops away (no blood, a
// moment only). "The servant's name was Malchus": a tag with his name comes down beside him. Jesus turns to Peter:
// "Put the sword into its sheath" — Peter's arm sinks and the blade goes home at his belt. "The cup which the Father
// has given Me, shall I not drink it?": out of the dark above, on a beam of light, a cup of light comes down to Him,
// and He lifts His open hands to receive it.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  nightSet, gardenTrees, BAND, DIS, ARREST, eleven, lamp, makeBand, bandPose, say, nameTag, sword, sheathed, paperEar, cupOfLight, radiance, hanging, vis, kf,
  headAt, hand, addToBody, withFace, faceBits, person, pose, fade, lerp, tr, blinkAt, C, TW, MALCHUS, PI, nt,
} from './lib.js';

const { GY } = ARREST;
const JX = 830, JDX = 560, MX = 660, PX0 = 900, PX1 = 748;

export default {
  id: 'j18-malchus',
  beats: [
    { v: 10, text: 'Wówczas Szymon Piotr, mając przy sobie miecz, dobył go,' },
    { v: 10, cont: true, text: 'uderzył sługę arcykapłana i odciął mu prawe ucho.' },
    { v: 10, cont: true, text: 'A słudze było na imię Malchos.' },
    { v: 11, text: 'Na to rzekł Jezus do Piotra: «Schowaj miecz do pochwy.' },
    { v: 11, cont: true, text: 'Czyż nie mam pić kielicha, który Mi podał Ojciec?»' },
  ],
  cam: { x: [-120, 80], y: [-120, 80], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const N = nightSet(S, { zigzag: true, cityX: 520, moonAt: [1250, 130] });
    const treesL = S.layer({ par: 0.5, sh: 3 });
    gardenTrees(S, treesL, GY);
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    glowL.add(`<g transform="translate(430 ${GY})"><ellipse cx="0" cy="-110" rx="380" ry="260" fill="url(#warm-glow)" opacity=".55"/></g>`);
    const aura = glowL.add(`<g><circle r="240" fill="url(#halo-glow)"/>${radiance(c, 110)}</g>`);
    const beam = glowL.add(`<g><path d="${c.poly([[-26, -1400], [26, -1400], [110, 0], [-110, 0]])}" fill="#fff3cf" opacity=".18"/></g>`);

    const bandL = S.layer({ par: 0.5, sh: 5 });
    const flameL = S.layer({ par: 0.5, sh: 0, flat: true });
    const band = makeBand(S, bandL, flameL, BAND);
    const peopleL = S.layer({ par: 0.5, sh: 5 });
    const judas = S.puppet(peopleL.add(withFace(person(c, TW.judas), faceBits(c))));
    const malEl = peopleL.add(withFace(person(c, MALCHUS), faceBits(c)));
    const malchus = S.puppet(malEl);
    const malSad = malEl.querySelector('[data-part="sad"]');
    const { J, D } = eleven(S, peopleL, { gy: GY, pos: DIS.filter((d) => d.k !== 'peter') });
    // Peter: with the drawn sword / with it sheathed at his belt
    const pDraw = S.puppet(peopleL.add(withFace(person(c, { ...TW.peter, holdF: `<g transform="rotate(-100)">${sword(c, 58)}</g>` }), faceBits(c))));
    const pSheathEl = peopleL.add(withFace(addToBody(person(c, { ...TW.peter }), sheathed(c)), faceBits(c)));
    const pSheath = S.puppet(pSheathEl);
    const pSad = pSheathEl.querySelector('[data-part="sad"]');

    const fx = S.layer({ par: 0.52, sh: 4 });
    const glint = fx.add(`<g><circle r="26" fill="url(#halo-glow)"/><path d="${c.poly([[0, -14], [3, -3], [14, 0], [3, 3], [0, 14], [-3, 3], [-14, 0], [-3, -3]])}" fill="#fffaf0"/></g>`);
    const flash = fx.add(`<g><path d="${c.ribbon(c.arc(0, 0, 70, 70, -2.5, -0.5, 16), (u) => 1 + Math.sin(u * PI) * 8)}" fill="#fff8e8"/><circle r="40" fill="url(#halo-glow)"/></g>`);
    const earEl = fx.add(`<g>${paperEar(c, C.skin3)}</g>`);
    const name = hanging(fx, nameTag(c, [tr('Malchos', 'Malchus'), tr('sługa arcykapłana', 'the high priest’s servant')], { size: 16 }), { x: 0, y: 0, len: 700 });
    const sheathW = fx.add(`<g>${say(c, tr('Schowaj miecz do pochwy', 'Put the sword into its sheath'), { size: 19, side: -1 })}</g>`);
    const cup = hanging(fx, `<g transform="scale(.8)">${cupOfLight(c, 60)}</g>`, { x: 0, y: 0, len: 900 });

    return (t, time) => {
      const T = time;
      N.update(T);
      band.forEach((m) => bandPose(m, { x: m.x - 40 - (m.i < 2 ? 30 : 0), y: GY + m.y, s: m.s ?? 1, head: bump(t, 1.1, 2.0) * -6, lean: -bump(t, 1.05, 1.6) * 4 }, T));
      judas.set({ x: JDX, y: GY + 10, s: 1.0, flip: false, armF: 16, armB: 8, head: 10, blink: blinkAt(T, 2) });

      /* v10 — Peter draws, strikes; Malchus */
      const step = es(t, 0.1, 0.6, ease.out);
      const px = lerp(PX0, PX1, step);
      const draw = es(t, 0.35, 0.6);
      const strike = es(t, 1.1, 1.3);
      const after = es(t, 1.3, 1.55);
      const put = es(t, 3.2, 3.6);                          // the sword goes home
      const swap = es(t, 3.55, 3.62);
      const back = es(t, 3.7, 4.2, ease.sine);
      pDraw.set({ x: px, y: GY + 4, s: 0.94, flip: true, o: 1 - swap, walk: step > 0 && step < 1 ? px * 0.06 : undefined, armF: 20 + draw * 30 + strike * 90 - after * 60 - put * 30, armB: 20 + strike * 20, lean: strike * 8 * (1 - after) - put * 3, head: -4 + put * 10, blink: blinkAt(T, 3) });
      const pxb = lerp(PX1, PX1 - 14, back);
      pSheath.set({ x: pxb, y: GY + 4, s: 0.94, flip: true, o: swap, walk: back > 0 && back < 1 ? pxb * 0.06 : undefined, armF: 18, armB: 10, head: 12 + back * 4, blink: blinkAt(T, 3) });
      fade(pSad, swap);
      const aF = 20 + draw * 30;
      const [gx, gy] = hand(px, GY + 4, 0.94, true, aF);
      const ar = (-aF * PI) / 180, bx0 = -0.985 * 58, by0 = 0.174 * 58;
      const tipX = -(bx0 * Math.cos(ar) - by0 * Math.sin(ar)) * 0.94, tipY = (bx0 * Math.sin(ar) + by0 * Math.cos(ar)) * 0.94;
      const gl = bump(t, 0.5, 0.95);
      vis(glint, { x: gx + tipX * 0.8, y: gy + tipY * 0.8, s: 0.6 + gl * 0.6, r: T ? T * 40 : 0, o: gl });
      const hurt = es(t, 1.22, 1.35);
      malchus.set({ x: MX - hurt * 16, y: GY + 8, s: 0.98, flip: false, armF: 26 - hurt * 10, armB: 10 + hurt * 150, head: -hurt * 14, lean: -hurt * 7, blink: blinkAt(T, 6) });
      fade(malSad, hurt);
      vis(flash, { x: MX + 50, y: GY - 170, s: 0.6 + strike * 0.5, r: -30, o: bump(t, 1.15, 1.45) });
      const fall = es(t, 1.25, 1.75, ease.in);
      const [mhx, mhy] = headAt(MX, GY + 8, 0.98, false);
      vis(earEl, { x: mhx + 10 + fall * 18, y: mhy + fall * 150, s: 1.1, r: fall * 160, o: t > 1.24 && t < 2.3 ? 1 : 0 });
      const nk = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 2.9, 3.1, ease.in));
      vis(name, { x: MX - 10, y: 330 - (1 - nk) * 700, r: T ? Math.sin(T * 0.9) * 1.4 : 0, o: nk > 0.01 ? 1 : 0 });

      /* Jesus */
      const turn = es(t, 3.05, 3.2) * (1 - es(t, 3.95, 4.05));
      const recv = es(t, 4.35, 4.75);
      J.p.set({ x: JX, y: GY + 6, s: 1.04, flip: true, armF: 20 + turn * 60 + recv * 50, armB: 10 + recv * 70, head: turn * 8 - recv * 16, blink: blinkAt(T) });
      fade(J.sad, bump(t, 4.1, 5.0) * 0.5);
      vis(aura, { x: JX, y: GY - 120, s: 0.5 + recv * 0.3, r: T ? T * 2 : 0, o: 0.3 + recv * 0.5 });
      const [jhx, jhy] = headAt(JX, GY + 6, 1.04, true);
      const w1 = es(t, 3.15, 3.35, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(sheathW, { x: jhx - 16, y: jhy - 22, s: w1, o: w1 > 0.01 ? 1 : 0 });

      /* the cup of light */
      const ck = es(t, 4.1, 4.6, ease.out);
      vis(cup, { x: JX - 20, y: lerp(-300, 400, ck), r: T ? Math.sin(T * 0.8) * 1.5 : 0, o: ck > 0.01 ? 1 : 0 });
      vis(beam, { x: JX - 20, y: 420, o: es(t, 4.05, 4.4) });

      D.forEach((m) => {
        const fear = 0.6 + bump(t, 1.1, 2.4) * 0.4;
        m.p.set({ x: m.x + 26, y: m.y, s: m.s, flip: true, armF: m.arm, armB: 8 + fear * 20 + bump(t, 1.1, 1.9) * 40, head: -fear * 4 + recv * 6, blink: blinkAt(T, m.seed) });
        fade(m.sad, fear * 0.7 * (1 - recv * 0.5));
        lamp(m, 0.9, 0, T);
      });

      S.cam.x = kf(t, [[0, 10], [0.9, -20], [1.4, -60], [2.0, -80], [2.9, -80], [3.2, -20], [4.0, 0], [4.4, 20], [5, 20]]);
      S.cam.y = kf(t, [[0, 40], [1, 60], [2, 50], [3, 40], [4, 20], [4.4, -80], [5, -90]]);
      S.cam.z = kf(t, [[0, 1.14], [1, 1.3], [2, 1.3], [3, 1.22], [4, 1.14], [4.4, 1.1], [5, 1.12]]);
    };
  },
};
