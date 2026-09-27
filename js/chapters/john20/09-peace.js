// J 20,19–20 — Evening of that first day. The upper room by lamplight, the shutters fastened; the door swings shut
// and the heavy bar drops into its brackets — they are afraid, and every face turns to the door. Then, in the empty
// middle of the room, a point of light, and Jesus is standing among them — the bar still across the door. "Peace
// be with you": a dove with an olive sprig flies out over them and the fear leaves their faces. He shows them His
// hands and His side — only small lights shine there. And the disciples were glad: arms go up, hearts, the lamps
// burn brighter.
import { C, blinkAt, pose, lerp, hanging, swing } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { eveningRoom, MID, headAt, handAt, handB, bodyAt, markLight, peaceDove, flapWings, goldWord, nameTag, heart, sparkle, tr } from './lib.js';

export default {
  id: 'j20-peace',
  beats: [
    { v: 19, text: 'Wieczorem owego pierwszego dnia tygodnia, tam gdzie przebywali uczniowie, gdy drzwi były zamknięte z obawy przed Żydami,' },
    { v: 19, cont: true, text: 'przyszedł Jezus, stanął pośrodku' },
    { v: 19, cont: true, text: 'i rzekł do nich: «Pokój wam!»' },
    { v: 20, text: 'A to powiedziawszy, pokazał im ręce i bok.' },
    { v: 20, cont: true, text: 'Uradowali się zatem uczniowie ujrzawszy Pana.' },
  ],
  cam: { x: [0, 140], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const E = eveningRoom(S);
    const { door, crew, jesus, gl } = E;
    const fx = S.layer({ par: 0.56, sh: 5 });
    const eve = hanging(fx, nameTag(c, tr('wieczór', 'evening'), { size: 17 }), { x: 0, y: 0, len: 700 });
    const dove = fx.add(`<g>${peaceDove(c)}</g>`);
    const word = fx.add(`<g>${goldWord(c, tr('Pokój wam!', 'Peace be to you!'), { size: 30 })}</g>`);
    const ring = fx.add(`<g><ellipse rx="100" ry="30" fill="none" stroke="${C.halo}" stroke-width="4"/></g>`);
    const lights = [0, 1, 2].map(() => fx.add(`<g>${markLight(c, 6)}</g>`));
    const hearts = crew.map(() => fx.add(`<g>${heart(c, 11, C.jesusMantle)}</g>`));
    const sp = crew.map(() => fx.add(`<g>${sparkle(c, 9)}</g>`));
    const shiver = crew.map(() => fx.add(`<g>${[-1, 1].map((d) => `<path d="${c.ribbon([[d * 14, -4], [d * 20, -12], [d * 16, -18], [d * 22, -26]], 2)}" fill="${C.cream}"/>`).join('')}</g>`));

    return (t, T) => {
      const bright = es(t, 4.05, 4.5);
      E.R.update(T, 0.85 + bright * 0.25);
      /* v19a: evening; the door shut and barred for fear */
      door.set(1 - es(t, 0.05, 0.3));
      door.bolt(es(t, 0.3, 0.6, ease.in));
      const tg = es(t, 0.05, 0.3, ease.back) * (1 - es(t, 0.9, 1.1, ease.in));
      swing(eve, 640, lerp(-700, 250, tg), tg > 0.001 ? T : 0, 1.2, 0.8); fade(eve, tg > 0.001 ? 1 : 0);
      const fear = es(t, 0.2, 0.5) * (1 - es(t, 2.1, 2.5));
      const come = es(t, 1.05, 1.5);
      const startle = bump(t, 1.2, 1.9);
      const peace = es(t, 2.05, 2.4);
      const show = es(t, 3.05, 3.35) * (1 - es(t, 4.8, 5));
      const joy = es(t, 4.05, 4.35);
      crew.forEach((m, i) => {
        const toDoor = fear * (1 - come);
        const faceJ = come > 0.5;
        const flip = faceJ ? m.x > MID.x : false;
        const tremble = fear * (1 - come) * (T ? Math.sin(T * 30 + i) * 1.2 : 0);
        m.p.set({ x: m.x + tremble, y: m.y, s: m.s, flip, lean: -startle * 8, armF: 24 + toDoor * 20 + startle * 50 + joy * 50, armB: 12 + startle * 60 + joy * (i % 2 ? 120 : 60), head: toDoor * -6 - startle * 6 - show * 4 + joy * -6, blink: blinkAt(T, m.seed) });
        fade(m.sad, fear > 0.02 ? Math.min(1, fear * 1.4) : 0);
        const [hx, hy] = headAt(m.x, m.y, m.s, flip);
        pose(shiver[i], { x: hx, y: hy - 4, o: startle * 0.9 });
        const hk = es(t, 4.2 + (i % 4) * 0.06, 4.45 + (i % 4) * 0.06, ease.back);
        pose(hearts[i], { x: hx + (flip ? -18 : 18), y: hy - 44 - hk * 8, s: hk, o: hk > 0.01 ? 1 : 0 });
        const b = bump(t, 4.3 + (i % 5) * 0.07, 4.9 + (i % 5) * 0.07);
        pose(sp[i], { x: hx + (flip ? 24 : -24), y: hy - 20, s: b, r: T * 30, o: b });
      });

      /* v19b: a light in the middle — He stands among them */
      pose(gl, { x: MID.x, y: MID.y - 120, s: 0.3 + come * 0.8, r: t * 4, o: come * (1 - es(t, 2.6, 3) * 0.4) });
      const lift = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const aF = 20 + lift * 40 + show * 55, aB = 14 + lift * 110 + show * 70;
      jesus.set({ x: MID.x, y: MID.y, s: MID.s, o: es(t, 1.2, 1.55), armF: aF, armB: aB, head: -show * 4, blink: blinkAt(T) });

      /* v19c: "Peace be with you" */
      const dv = es(t, 2.1, 2.9, ease.out);
      pose(dove, { x: lerp(MID.x + 10, 1060, dv), y: lerp(560, 330, dv) + Math.sin(dv * 6) * 20, s: 0.4 + dv * 0.6, o: dv > 0.01 ? 1 - es(t, 3.0, 3.2) : 0 });
      if (T) flapWings(dove, T, 30, 9);
      const wk = es(t, 2.2, 2.45, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(word, { x: MID.x, y: 400, s: wk, o: wk > 0.01 ? 1 : 0 });
      const rk = seg(t, 2.1, 2.7);
      pose(ring, { x: MID.x, y: MID.y - 10, s: 0.5 + rk * 5, o: rk > 0 && rk < 1 ? (1 - rk) * 0.8 : 0 });

      /* v20a: He shows them His hands and His side — only light */
      const [fx1, fy1] = handAt(MID.x, MID.y, MID.s, false, aF);
      const [bx1, by1] = handB(MID.x, MID.y, MID.s, false, aB);
      const [sx1, sy1] = bodyAt(MID.x, MID.y, MID.s, false, 16, -96);
      [[fx1, fy1], [bx1, by1], [sx1, sy1]].forEach(([x, y], i) => pose(lights[i], { x, y, s: show * (1 + (T ? Math.sin(T * 3 + i) * 0.08 : 0)), o: show }));

      S.cam.x = 60 + es(t, 0, 0.6) * 60 * (1 - es(t, 0.9, 1.3)) - es(t, 0.9, 1.3) * 40;
      S.cam.y = 30 - es(t, 3, 3.3) * 10 * (1 - es(t, 4, 4.3));
      S.cam.z = (1.04 + es(t, 3, 3.3) * 0.08 * (1 - es(t, 4, 4.3))) * (S.portrait ? 0.94 : 1);
    };
  },
};
