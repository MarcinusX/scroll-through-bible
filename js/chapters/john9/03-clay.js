// J 9,6–7a — close by the gate. Jesus kneels beside the man, spits on the ground and works the dust into a
// little mound of clay with His fingers; He lifts a pinch of it and lays it gently on the closed eyes — two brown
// dabs, a warm glow. Then He stands and sends him: "Go, wash in the pool of Siloam" — a tag comes down with the
// name, and turns over to show what it means: "Sent". The man gets up with his stick and turns to go.
import { C, person, CAST, blinkAt, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  gateSet, beggarPlace, G, DAY, BLIND, DISC, manPuppet, stick, clayLump, poolIcon, nameTag, voiceRings, spark, hanging, drop,
  kf, hand, headAt, vis, tr, pose, mix, sheet, PI, DY, FONT,
} from './lib.js';

const KX = 800, KX2 = 876;   // where Jesus kneels to make the clay, and beside the man

export default {
  id: 'j9-clay',
  beats: [
    { v: 6, text: 'To powiedziawszy splunął na ziemię, uczynił błoto ze śliny' },
    { v: 6, cont: true, text: 'i nałożył je na oczy niewidomego,' },
    { v: 7, text: 'i rzekł do niego: «Idź, obmyj się w sadzawce Siloam» - co się tłumaczy: Posłany.' },
  ],
  cam: { x: [0, 230], y: [0, 260], z: [1, 2] },
  build(S) {
    const c = S.c;
    const set = gateSet(S, { skyCols: DAY });

    const act = S.layer({ par: 0.52, sh: 5 });
    const dis = DISC.slice(0, 3).map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, o))) }));
    const { mat, bowl } = beggarPlace(S, act);
    const lump = act.add(`<g>${clayLump(c, 19)}</g>`);
    const man = manPuppet(S, act, BLIND, { pose: 'sit', clay: true });
    const manUp = manPuppet(S, act, BLIND, { clay: true, holdB: stick(c, 104) });
    const jKneel = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const jStand = S.puppet(act.add(person(c, CAST.jesus)));

    const fx = S.layer({ par: 0.52, sh: 3 });
    const spit = fx.add(`<g opacity="0"><path d="${c.cut(c.ell(0, 0, 2.6, 3.4, 8), 0.1, 2)}" fill="#e8f2f2"/></g>`);
    const pinch = fx.add(`<g opacity="0"><path d="${c.cut(c.blob(0, 0, 5, 4, 8, 0.2), 0.3, 2)}" fill="${mix(C.soil, C.clay, 0.35)}"/></g>`);
    const touch = fx.add(`<g opacity="0">${spark(c, 10)}</g>`);
    const rings = voiceRings(fx, c, { n: 3, r: 30, w: 4, both: false, color: mix(C.halo, C.ochre, 0.3) });
    const dustD = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g opacity="0"><path d="${c.cut(c.circ(0, 0, c.rr(2, 3.4), 6), 0.2, 2)}" fill="${mix(C.sand2, C.soil, 0.3)}"/></g>`), a: c.rr(-2.4, -0.7) }));

    /* the tag: the name, and on its back the meaning */
    const tagL = S.layer({ par: 0.3, sh: 5 });
    const nameSide = `<g class="n">${nameTag(c, tr('sadzawka Siloam', 'the pool of Siloam'), { size: 20 })}<g transform="translate(0 64)">${poolIcon(c, 22)}</g></g>`;
    const meanSide = `<g class="m">${nameTag(c, [tr('co się tłumaczy:', 'which means:'), tr('„Posłany”', '“Sent”')], { size: 20 })}</g>`;
    const tag = hanging(tagL, `<g class="flipper">${nameSide}${meanSide}</g>`, { x: 0, y: 0, len: 900 });
    const flipper = tag.querySelector('.flipper'), nS = tag.querySelector('.n'), mS = tag.querySelector('.m');

    set.front();
    const P = S.portrait;

    return (t, time) => {
      const T = time;
      set.update(T);

      /* Jesus: kneels (v6a), works the clay, lays it on the eyes (v6b), stands and sends him (v7) */
      const kneel = t < 2.05 ? es(t, -0.2, -0.13) : 1 - es(t, 2.05, 2.12);
      const spitK = bump(t, 0.12, 0.4);
      const knead = t > 0.4 && t < 0.95 ? Math.sin((t - 0.4) * PI * 8) : 0;
      const reach = es(t, 1.05, 1.4) * (1 - es(t, 1.85, 2.02));
      const bend = es(t, 0.3, 0.45) * (1 - es(t, 1.0, 1.25));
      const aF = 16 + bend * 24 + knead * 7 * bend + reach * 84;
      const jl = 4 + bend * 24;
      const kx = lerp(KX, KX2, es(t, 1.0, 1.3));
      jKneel.set({ x: kx, y: G.FLOOR + 6 - bump(t, 1.0, 1.3) * 6, s: 1.02, o: kneel, armF: aF, armB: 16 + spitK * 10, head: 10 * seg(t, 0.1, 0.4) * (1 - reach) - spitK * 4 - reach * 2, lean: jl, blink: blinkAt(T, 1) });
      const send = es(t, 2.2, 2.5);
      const point = bump(t, 2.25, 3.0);
      jStand.set({ x: KX2 - 40, y: G.FLOOR + 8, s: 1.02, o: 1 - kneel, armF: 16 + send * 20 + point * 60, armB: 10 + point * 110, head: -point * 8, blink: blinkAt(T, 1) });
      const [jhx, jhy] = headAt(KX2 - 40, G.FLOOR + 8, 1.02, false);
      rings(jhx + 16, jhy + 8, bump(t, 2.05, 2.9), T);

      /* the spit, the dust made into clay */
      const [khx, khy] = headAt(kx, G.FLOOR + 6, 1.02, false, DY.kneel);
      const sk = seg(t, 0.16, 0.36);
      vis(spit, { x: khx + 26 + sk * 22, y: khy + 18 + sk * sk * 120, o: sk > 0 && sk < 1 ? 1 : 0 });
      const lx = KX + 50, ly = G.FLOOR + 10;
      const grow = es(t, 0.4, 0.9);
      const [fx_, fy_] = hand(kx, G.FLOOR + 6, 1.02, false, aF, jl, DY.kneel);
      pose(lump, { x: lx, y: ly, s: 0.1 + grow * 0.9 - es(t, 1.05, 1.3) * 0.35, o: grow > 0.02 ? 1 : 0 });
      dustD.forEach((d) => {
        const k = t > 0.45 && t < 0.95 ? ((T * 1.2 + d.i / 6) % 1) : 0;
        vis(d.el, { x: lx + Math.cos(d.a) * k * 30, y: ly - 6 + Math.sin(d.a) * k * 24, o: k ? (1 - k) * 0.9 : 0 });
      });
      const carry = t > 1.05 && t < 1.8;
      vis(pinch, { x: fx_, y: fy_ - 3, o: carry ? 1 : 0 });

      /* the man: sits, face lifted; the clay on his eyes; gets up with his stick (v7) */
      const on = es(t, 1.55, 1.75);
      const rise = es(t, 2.55, 2.62);
      const [mhx, mhy] = headAt(G.BEGX, G.FLOOR + 4, 1, true, DY.sit);
      vis(touch, { x: mhx - 12, y: mhy - 2, s: bump(t, 1.5, 1.95) * 1.2, r: T * 40, o: t > 1.5 && t < 1.95 ? 1 : 0 });
      man.p.set({ x: G.BEGX, y: G.FLOOR + 4, s: 1, flip: true, o: 1 - rise, armF: 30 + bump(t, 1.4, 2.0) * 20, armB: 10, head: -10 + reach * 4, blink: 0 });
      fade(man.clay, on);
      const turn = es(t, 2.9, 3.0);
      manUp.p.set({ x: G.BEGX + 4 + es(t, 2.9, 3.4) * 40, y: G.FLOOR + 6, s: 1, flip: turn < 0.5, o: rise, armF: 20 + bump(t, 2.6, 2.95) * 30, armB: 26, head: -8 + turn * 4, walk: t > 2.95 ? (t - 2.95) * 30 : undefined, amt: 0.6, blink: 0 });
      fade(manUp.clay, 1);

      /* the disciples watch */
      dis.forEach((d) => {
        // phone: the close-up is too narrow for them, so they wait just out of view and step up as the camera pulls back
        const wait = P ? 1 - es(t, 1.95, 2.35) : 0;
        const x = 690 - d.i * 58 - wait * 100;
        d.p.set({ x, y: G.FLOOR + 12 - d.i * 6, s: 0.96 - d.i * 0.03, walk: wait > 0.01 && wait < 0.99 ? x * 0.07 : undefined, armF: 18 + bump(t, 0.3, 1.2) * (d.i === 1 ? 26 : 0), head: 8 * es(t, 0.1, 0.4) * (1 - es(t, 2.1, 2.4)) - bump(t, 2.4, 3.0) * 10, lean: 3 * es(t, 0.1, 0.4), blink: blinkAt(T, d.seed) });
      });

      /* v7 — the tag comes down with the name; it turns over: "which means: Sent" */
      const tk = es(t, 2.15, 2.5, ease.out);
      drop(tag, P ? 1010 : 1080, 330, tk, T, { amp: 1.1 });   // phone: the whole tag inside the screen
      const fl = es(t, 2.55, 2.8);
      const sx = Math.cos(fl * PI);
      pose(flipper, { sx: Math.max(0.02, Math.abs(sx)) });
      fade(nS, sx > 0 ? 1 : 0); fade(mS, sx > 0 ? 0 : 1);

      S.cam.x = kf(t, [[-0.3, 150], [0.3, 190], [1.0, 200], [1.9, 210], [2.3, 110], [3, 100]]);
      S.cam.y = kf(t, [[-0.3, 160], [0.3, 230], [1.0, 240], [1.9, 220], [2.3, 40], [3, 40]]);
      S.cam.z = kf(t, [[-0.3, 1.4], [0.3, 1.8], [1.0, 1.85], [1.9, 1.95], [2.3, 1.2], [3, 1.16]]);
    };
  },
};
