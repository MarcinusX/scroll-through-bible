// Mt 2,15 — Egypt: palms along the Nile, pyramids on the horizon, a small house of mud brick. The sun crosses the
// sky again and again, the hourglass runs; Joseph works at his bench, and the Child grows from the baby in Mary's arms
// to a little boy on His own feet. Then a warm light from the East and the Lord's word through the prophet comes
// down: "Out of Egypt I called my Son." The Child turns towards it.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { sun } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  LOOK, GY, egyptSet, childPerson, infant, workbench, hourglass, prophecyPlate, beamGrad, placeTag, glory,
  hangAt, vpose, kf, sparkle, tr, PI,
} from './lib.js';

const Y = GY + 6;
const CX = 820;             // the Child

export default {
  id: 'mt2-egypt',
  beats: [
    { v: 15, text: 'tam pozostał aż do śmierci Heroda.' },
    { v: 15, cont: true, text: 'Tak miało się spełnić słowo, które Pan powiedział przez Proroka: Z Egiptu wezwałem Syna mego.' },
  ],
  cam: { x: [-40, 60], y: [0, 60], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = egyptSet(S, { houseX: 280 });
    const sunEl = set.hangL.add(`<g>${sun(c, 40)}</g>`);

    const P = S.layer({ par: 0.45, sh: 5 });
    P.add(`<g transform="translate(${S.portrait ? 590 : 520} ${Y})">${workbench(c, S.portrait ? 140 : 180)}</g>`);   // phone: a shorter bench further in, so Joseph stands inside the frame
    const joseph = S.puppet(P.add(person(c, { ...LOOK.joseph })));
    const marySit = S.puppet(P.add(person(c, { ...LOOK.mary, pose: 'sit' })));
    const babyEl = P.add(`<g>${infant(c)}</g>`);
    const maryUp = S.puppet(P.add(person(c, { ...LOOK.mary })));
    const kidSit = S.puppet(P.add(childPerson(c, { ...LOOK.child, pose: 'sit' })));
    const kid = S.puppet(P.add(childPerson(c, { ...LOOK.child })));

    /* time passing; the word from the Lord */
    const X = S.layer({ par: 0.3, sh: 5 });
    const glassEl = hanging(X, hourglass(c, 80), { x: 0, y: 0, len: 700 });
    const sandT = glassEl.querySelector('.sandT'), sandB = glassEl.querySelector('.sandB');
    const tagH = hanging(X, placeTag(c, tr('aż do śmierci Heroda', 'until the death of Herod'), 17), { x: 0, y: 0, len: 700 });
    const light = S.layer({ par: 0.35, sh: 0, flat: true });
    const bid = beamGrad(S, 'beam');
    const beam = light.add(`<g><path d="M-60 0L60 0L200 620L-180 620Z" fill="url(#${bid})"/></g>`);
    const gl = light.add(`<g>${glory(c, 260, 18)}</g>`);
    const path = light.add(`<g><path d="${c.ribbon([[0, 0], [200, -10], [420, -24], [640, -44]], (u) => 26 - u * 20)}" fill="#fff3cf" opacity=".6"/></g>`);
    const word = hanging(X, prophecyPlate(c, tr(['Z Egiptu wezwałem', 'Syna mego'], ['Out of Egypt', 'I called my son']), { size: 24 }), { x: 0, y: 0, len: 700 });
    const sparks = [0, 1, 2, 3].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      /* v15a — days and years pass in Egypt */
      const days = seg(t, 0.0, 0.95) * 2.4;
      const f = days % 1;
      const up = Math.sin(f * PI);
      pose(sunEl, { x: lerp(300, 1320, f), y: 470 - up * 330, r: T * 3, o: t < 1.0 ? (up > 0.05 ? 1 : 0) : 1 });
      if (t >= 1.0) pose(sunEl, { x: 1200, y: 170, r: T * 3, o: 1 });
      const run = es(t, 0.0, 0.95, (u) => u);
      hangAt(glassEl, S.portrait ? 990 : 1080, lerp(-400, 300, es(t, -0.1, 0.2, ease.out)) - es(t, 1.0, 1.2, ease.in) * 800, T, t < 1.2 ? 1 : 0, 1.2, 0.9, 1);
      pose(sandT, { x: 0, y: -3, sy: 1 - run * 0.9, oy: 0 });
      pose(sandB, { x: 0, y: 40, sy: 0.15 + run * 0.85 });
      const hk = es(t, 0.2, 0.45, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      hangAt(tagH, S.portrait ? 990 : 1080, lerp(-500, 400, hk), T, hk > 0.001 ? 1 : 0, 1.2, 0.9, 2);

      // Joseph at his bench; Mary with the baby, then standing as the boy plays and walks
      const turn = es(t, 1.2, 1.45);
      const plane = t < 1.1 ? Math.sin(t * 40) : 0;
      joseph.set({ x: S.portrait ? 525 : 440, y: Y, s: 0.92, flip: turn > 0.5 ? false : false, armF: 60 + plane * 12 + turn * 30, armB: 50 + plane * 10, lean: 8 - turn * 8, head: 8 - turn * 14, blink: blinkAt(T, 2) });
      const g1 = es(t, 0.32, 0.38), g2 = es(t, 0.62, 0.68);
      marySit.set({ x: 700, y: Y + 4, s: 1.0, o: 1 - g1, armF: 56, armB: 40, head: 12, blink: blinkAt(T, 1) });
      pose(babyEl, { x: 738, y: Y - 60, s: 0.85, r: -10, o: 1 - g1 });
      maryUp.set({ x: 690, y: Y + 2, s: 0.98, o: g1, armF: 30 + bump(t, 0.4, 0.62) * 40 + turn * 20, armB: 10 + turn * 40, head: 10 - turn * 12, blink: blinkAt(T, 1) });
      kidSit.set({ x: 790, y: Y + 8, s: 0.5, o: g1 * (1 - g2), armF: 40 + Math.sin(t * 20) * 10, armB: 20, head: -6, blink: blinkAt(T, 4) });
      const kx = lerp(760, CX, es(t, 0.68, 0.95));
      const walk = t > 0.68 && t < 0.95;
      const reach = es(t, 1.25, 1.55);
      kid.set({ x: kx, y: Y + 8, s: 0.56, o: g2, walk: walk ? kx * 0.12 : undefined, armF: 20 + reach * 70, armB: 10 + reach * 120, head: -reach * 12, blink: blinkAt(T, 4) });

      /* v15b — "Out of Egypt I called my Son": light from the East, the word comes down */
      const lk = es(t, 1.05, 1.4);
      vpose(beam, { x: 1180, y: 60, r: 18, o: lk * 0.8 });
      vpose(gl, { x: 1220, y: 160, s: 0.5 + lk * 0.5, r: T * 3, o: lk * 0.55 });
      vpose(path, { x: CX + 30, y: Y - 4, sx: es(t, 1.4, 1.8), o: es(t, 1.4, 1.6) });
      const wk = es(t, 1.2, 1.55, ease.out);
      hangAt(word, 860, lerp(-500, 250, wk), T, wk > 0.001 ? 1 : 0, 1.1, 0.8, 3);
      sparks.forEach((sp, i) => {
        const k = es(t, 1.5 + i * 0.05, 1.7 + i * 0.05), a = T * 0.7 + i * 1.6;
        vpose(sp, { x: 860 + Math.cos(a) * 190, y: 250 + Math.sin(a) * 80, s: k * 0.8, r: T * 30, o: k });
      });

      S.cam.x = lerp(-20, S.portrait ? 0 : 30, es(t, 1.0, 1.5));   // phone: the pan stops short, so Joseph stays in the frame
      S.cam.y = 30;
      S.cam.z = 1.04 + es(t, 0.6, 1.0) * 0.03;
    };
  },
};
