// J 20,21–23 — Still that evening, in the lamplit room. "Peace be with you" again: a ring of calm goes out from
// Him. "As the Father has sent Me": a beam comes down from the great light above onto Him; "so I send you": golden
// threads run from Him to each of them and a small flame kindles above every head. He breathes on them — soft
// ribbons of light flow out over the room — "Receive the Holy Spirit!": a white dove comes down and rests in the
// light above them. Two plates come down on strings: a heart bound with dark cords — a key of light turns and the
// cords fall away (forgiven); and a heart whose knot stays tied (retained).
import { C, person, blinkAt, pose, lerp, hanging, swing } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import {
  eveningRoom, MID, headAt, bodyAt, radiance, glowDisc, threads, soulLight, breath, dove, flapWings, goldWord, heart, cords, lightKey,
  heartPlate, sparkle, tr,
} from './lib.js';

export default {
  id: 'j20-sent',
  beats: [
    { v: 21, text: 'A Jezus znowu rzekł do nich: «Pokój wam!' },
    { v: 21, cont: true, text: 'Jak Ojciec Mnie posłał, tak i Ja was posyłam».' },
    { v: 22, text: 'Po tych słowach tchnął na nich' },
    { v: 22, cont: true, text: 'i powiedział im: «Weźmijcie Ducha Świętego!' },
    { v: 23, text: 'Którym odpuścicie grzechy, są im odpuszczone,' },
    { v: 23, cont: true, text: 'a którym zatrzymacie, są im zatrzymane».' },
  ],
  cam: { x: [-20, 60], y: [-40, 50], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const E = eveningRoom(S);
    const { door, crew, jesus, gl } = E;
    // the light above and its beam
    const hi = S.layer({ par: 0.34, sh: 0, flat: true });
    const gid = S.id('beam');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6dc" stop-opacity=".0"/><stop offset=".2" stop-color="#fff6dc" stop-opacity=".6"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></linearGradient>`);
    const beam = hi.add(`<g><path d="${c.poly([[770, 200], [830, 200], [900, 740], [700, 740]])}" fill="url(#${gid})"/></g>`);
    const lightL = S.layer({ par: 0.34, sh: 3 });
    const above = lightL.add(`<g>${glowDisc(190, 'halo-glow', 0.9)}<g transform="scale(.4)">${radiance(c, 150)}</g></g>`);
    const thrL = S.layer({ par: 0.52, sh: 0, flat: true });
    const setThread = threads(thrL, crew.length, { color: C.haloRim, w: 2 });
    const fx = S.layer({ par: 0.56, sh: 4 });
    const word = fx.add(`<g>${goldWord(c, tr('Pokój wam!', 'Peace be to you!'), { size: 28 })}</g>`);
    const ring = fx.add(`<g><ellipse rx="100" ry="30" fill="none" stroke="${C.halo}" stroke-width="4"/></g>`);
    const flames = crew.map(() => fx.add(`<g>${soulLight(c, 9)}</g>`));
    const glows = crew.map(() => fx.add(`<g><circle r="44" fill="url(#halo-glow)"/></g>`));
    const brR = fx.add(`<g>${breath(c, 400)}</g>`);
    const brL = fx.add(`<g><g transform="scale(-1 1)">${breath(c, 400)}</g></g>`);
    const spirit = fx.add(`<g><circle r="70" fill="url(#halo-glow)"/>${dove(c)}</g>`);
    // forgiven / retained
    const pl = S.layer({ par: 0.58, sh: 6 });
    const glowA = pl.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    const plateA = hanging(pl, `${heartPlate(c, 62, true)}<g class="hrt">${heart(c, 26, C.jesusMantle)}</g><g class="crd">${cords(c, 26)}</g>`, { x: 0, y: 0, len: 700 });
    const plateB = hanging(pl, `${heartPlate(c, 62, false)}<g class="hrt">${heart(c, 26, C.jesusMantle)}</g><g class="crd">${cords(c, 26)}</g>`, { x: 0, y: 0, len: 700 });
    const crdA = plateA.querySelector('.crd');
    const keyA = pl.add(`<g>${lightKey(c, 64)}</g>`);
    const keyB = pl.add(`<g>${lightKey(c, 64)}</g>`);
    const spA = [0, 1, 2].map(() => pl.add(`<g>${sparkle(c, 12)}</g>`));

    return (t, T) => {
      E.R.update(T, 1);
      door.set(0); door.bolt(1);
      pose(gl, { x: MID.x, y: MID.y - 120, s: 0.9, r: t * 4, o: 0.5 + bump(t, 0.05, 0.9) * 0.3 });
      /* v21a: "Peace be with you" again */
      const lift = es(t, 0.05, 0.3) * (1 - es(t, 0.9, 1.1));
      const send = es(t, 1.4, 1.7) * (1 - es(t, 1.95, 2.1));
      const breathe = es(t, 2.05, 2.5);
      const spiritK = es(t, 3.05, 3.5);
      const bless = es(t, 4.0, 4.3);
      jesus.set({ x: MID.x, y: MID.y, s: MID.s, armF: 20 + lift * 40 + send * 70 + breathe * 20 * (1 - spiritK) + bless * 40, armB: 14 + lift * 110 + send * 60 + spiritK * 60 * (1 - bless), head: -breathe * 6 * (1 - spiritK) - spiritK * 8 * (1 - bless), lean: breathe * 4 * (1 - spiritK), blink: blinkAt(T) });
      const wk = es(t, 0.12, 0.35, ease.back) * (1 - es(t, 0.92, 1.02));
      pose(word, { x: MID.x, y: 400, s: wk, o: wk > 0.01 ? 1 : 0 });
      const rk = seg(t, 0.1, 0.8);
      pose(ring, { x: MID.x, y: MID.y - 10, s: 0.5 + rk * 5, o: rk > 0 && rk < 1 ? (1 - rk) * 0.8 : 0 });

      /* v21b: as the Father sent Me — the beam from above; so I send you — threads, flames */
      const ab = es(t, 1.02, 1.3) * (1 - es(t, 3.9, 4.2) * 0.6);
      pose(above, { x: 800, y: 190, s: 0.5 + ab * 0.5 + (T ? Math.sin(T * 1.3) * 0.02 : 0), o: ab });
      fade(beam, es(t, 1.1, 1.35) * (1 - es(t, 2.0, 2.4) * 0.7));
      const [jhx, jhy] = headAt(MID.x, MID.y, MID.s, false);
      crew.forEach((m, i) => {
        const d = Math.abs(m.x - MID.x);
        const k = es(t, 1.4 + d * 0.0005, 1.7 + d * 0.0005);
        const flip = m.x > MID.x;
        const [hx, hy] = headAt(m.x, m.y, m.s, flip);
        const hxx = hx, hyy = hy + 70 * m.s;
        setThread(i, MID.x, MID.y - 110, lerp(MID.x, hxx, k), lerp(MID.y - 110, hyy, k), k * 0.8 * (1 - es(t, 2.2, 2.6)));
        pose(flames[i], { x: hx, y: hy - 42 + (T ? Math.sin(T * 2 + i) * 1.2 : 0), s: es(t, 1.6 + d * 0.0005, 1.8 + d * 0.0005, ease.back), o: k > 0.02 ? 1 : 0 });
        const g = es(t, 3.3 + d * 0.0006, 3.6 + d * 0.0006);
        pose(glows[i], { x: hx, y: hy, s: 0.6 + g * 0.5, o: g * 0.8 });
        const breeze = bump(t, 2.1 + d * 0.0012, 2.9 + d * 0.0012);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip, armF: 30 + k * 20 + bless * 10, armB: 14 + breeze * 30, head: -g * 6 + breeze * 4, lean: breeze * 4 * (flip ? -1 : 1), blink: blinkAt(T, m.seed) });
        fade(m.sad, 0);
      });

      /* v22a: He breathes on them */
      const bk = es(t, 2.05, 2.6, ease.out);
      const bo = bk * (1 - es(t, 3.3, 3.7));
      pose(brR, { x: jhx + 20, y: jhy + 10, sx: bk, sy: 0.6 + bk * 0.4, o: bo });
      pose(brL, { x: jhx - 16, y: jhy + 10, sx: bk, sy: 0.6 + bk * 0.4, o: bo });
      /* v22b: "Receive the Holy Spirit" — the dove comes down */
      const dv = es(t, 3.02, 3.5, ease.out);
      pose(spirit, { x: 800 + Math.sin(dv * 3) * 20, y: lerp(120, 330, dv) + (T ? Math.sin(T * 2) * 4 : 0), s: 0.8, o: dv > 0.01 ? 1 - es(t, 3.95, 4.2) * 0.6 : 0 });
      if (T) flapWings(spirit, T, 26, 8);

      /* v23a: forgiven — the key turns, the cords fall away */
      const pa = es(t, 4.02, 4.3, ease.back);
      const PA = { x: S.portrait ? 640 : 520, y: 360 }, PB = { x: S.portrait ? 960 : 1080, y: 360 };
      swing(plateA, PA.x, lerp(-800, PA.y, pa), pa > 0.001 ? T : 0, 1, 0.7);
      const turn = es(t, 4.35, 4.6);
      const free = es(t, 4.55, 4.9, ease.in);
      pose(keyA, { x: PA.x - 40 + turn * 10, y: PA.y + 70, r: -30 + turn * 90, s: 0.8, o: pa > 0.01 ? 1 - es(t, 5.9, 6) : 0 });
      pose(crdA, { y: free * 90, r: free * 20, o: 1 - free });
      pose(glowA, { x: PA.x, y: PA.y, s: 0.5 + free * 0.7, o: free });
      spA.forEach((el, i) => {
        const b = bump(t, 4.7 + i * 0.1, 5.3 + i * 0.1);
        pose(el, { x: PA.x - 50 + i * 50, y: PA.y - 60 - (i % 2) * 20, s: b, r: T * 30, o: b });
      });
      /* v23b: retained — the knot stays tied */
      const pb = es(t, 5.02, 5.3, ease.back);
      swing(plateB, PB.x, lerp(-800, PB.y, pb), pb > 0.001 ? T : 0, 1, 0.7, 2);
      pose(keyB, { x: PB.x - 40, y: PB.y + 70, r: -30 + bump(t, 5.4, 5.8) * 12, s: 0.8, o: pb > 0.01 ? 0.75 : 0 });

      S.cam.x = 20;
      S.cam.y = 30 - es(t, 1.0, 1.3) * 50 * (1 - es(t, 1.9, 2.2)) - es(t, 3.0, 3.3) * 40 * (1 - es(t, 3.9, 4.2));
      S.cam.z = 1.04 + es(t, 2.0, 2.3) * 0.06 * (1 - es(t, 2.9, 3.2));
    };
  },
};
