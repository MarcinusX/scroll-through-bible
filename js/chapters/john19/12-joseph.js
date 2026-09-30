// J 19,38a — evening in Pilate's hall; the lamps are lit. Joseph of Arimathea comes in, his mantle drawn close,
// glancing back over his shoulder: a disciple of Jesus, but a hidden one, for fear — his name-tag says so, and
// a small light glows under his mantle, half covered. Now he takes courage: the light shows, he bows before Pilate
// and asks for the body of Jesus (a little cross with a linen cloth over its arms). Pilate nods and hands him
// the sealed permission.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, hand, headAt, speech, nameTag, strip, pilate, sealedScroll, shroudCross, hallSet, lampSet, hanging, swing, LOOK, tr, J19 } from './lib.js';

const GY = 690;

export default {
  id: 'j19-joseph',
  beats: [
    { v: 38, text: 'Potem Józef z Arymatei, który był uczniem Jezusa, lecz ukrytym z obawy przed Żydami,' },
    { v: 38, cont: true, text: 'poprosił Piłata, aby mógł zabrać ciało Jezusa.' },
    { v: 38, cont: true, text: 'A Piłat zezwolił.' },
  ],
  cam: { x: [-60, 160], y: [-20, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const ph = S.portrait;   // phone: Joseph and Pilate both in view from the start
    const H = hallSet(S, { evening: true });
    const P = H.charL;
    const pil = S.puppet(P.add(pilate(c, { pose: 'sit' })));
    const jos = S.puppet(P.add(person(c, { ...LOOK.joseph, mantleArm: true })));
    const fx = H.fxL;
    const heartL = fx.add(`<g><circle r="46" fill="url(#warm-glow)"/><path d="M0 8C-10 0 -14 -6 -9 -11C-5 -14 -1 -12 0 -8C1 -12 5 -14 9 -11C14 -6 10 0 0 8Z" fill="${C.lampFlame}"/></g>`);
    const tagL = S.layer({ par: 0.58, sh: 5 });
    const jTag = hanging(tagL, `${nameTag(c, tr(['Józef', 'z Arymatei'], ['Joseph', 'of Arimathaea']), { size: 17 })}<g transform="translate(0 76)">${strip(c, tr('uczeń — w ukryciu', 'a disciple — in secret'), { size: 14, fill: C.stone })}</g>`, { x: 0, y: 0, len: 900 });
    const ask = fx.add(`<g>${speech(c, `<g transform="scale(1.15)">${shroudCross(c)}</g>`, { w: 64, h: 70 })}</g>`);
    const yes = fx.add(`<g>${speech(c, `<path d="${c.ribbon([[-12, 0], [-3, 9], [13, -11]], 4.5)}" fill="${C.moss}"/>`, { w: 50, h: 48, flip: true })}</g>`);
    const perm = fx.add(`<g>${sealedScroll(c, 54)}</g>`);

    return (t, time) => {
      const T = time;
      H.sk.blend(J19.eve, J19.night, 0.25 + es(t, 0, 3) * 0.2);
      pose(H.orb, { x: 800, y: 470 });
      pose(H.cl, { x: 610 + Math.sin(T * 0.1) * 20, y: 250 });
      H.lamps.forEach((l) => lampSet(l, 1, T));

      /* v38a — Joseph comes in, looking back over his shoulder */
      const jK = [[-0.3, [120, GY]], [0.7, [ph ? 600 : 560, GY]], [1.05, [ph ? 600 : 560, GY]], [1.5, [930, GY]]];
      const [jx, jy] = kf(t, jK);
      const glance = bump(t, 0.35, 0.9);
      const brave = es(t, 1.05, 1.3);
      const bowK = es(t, 1.45, 1.65) * (1 - es(t, 1.95, 2.1)) + bump(t, 2.3, 2.8) * 0.7;
      const receive = es(t, 2.2, 2.45);
      jos.set({ x: jx, y: jy, s: 1.04, flip: glance > 0.5, walk: moving(t, jK) ? jx * 0.05 : undefined, amt: lerp(0.5, 0.8, brave), armF: lerp(60, 14, brave) + bowK * 50 + receive * 40, armB: 8 + bowK * 20, head: lerp(8, 0, brave) + bowK * 14, lean: bowK * 10 + (1 - brave) * 4, blink: blinkAt(T, 2) });
      // the hidden light under his mantle
      pose(heartL, { x: jx + (glance > 0.5 ? -6 : 6), y: jy - 112, s: 0.45 + brave * 0.35, o: 0.3 + brave * 0.7 });
      const tk = es(t, 0.1, 0.45) * (1 - es(t, 1.2, 1.45));
      swing(jTag, jx + 10, 330 - (1 - tk) * 700, T, 1.2, 0.9, 1);
      /* v38b — he asks for the body */
      const [jhx, jhy] = headAt(jx, jy, 1.04, false);
      const ak = es(t, 1.5, 1.7, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(ask, { x: jhx + 12, y: jhy - 18, s: ak, o: ak > 0.02 ? 1 : 0 });
      /* v38c — Pilate permits it */
      const nod = bump(t, 2.05, 2.35);
      const give = es(t, 2.05, 2.3);
      pil.set({ x: 1116, y: 566, s: 1, flip: true, armF: 30 + give * 50 * (1 - es(t, 2.5, 2.7)), armB: 10, head: -4 + nod * 10, blink: blinkAt(T, 1) });
      const yk = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.8, 2.95));
      const [phx, phy] = headAt(1116, 566, 1, true, 62);
      pose(yes, { x: phx - 22, y: phy - 18, s: yk, o: yk > 0.02 ? 1 : 0 });
      const [px, py] = hand(1116, 566, 1, true, 80, 0, 62);
      const [hx, hy] = hand(jx, jy, 1.04, false, 14 + 40);
      const pk = es(t, 2.2, 2.5);
      pose(perm, { x: lerp(px, hx + 6, pk), y: lerp(py, hy - 4, pk) - Math.sin(pk * Math.PI) * 30, r: -10, o: give > 0.02 ? 1 : 0 });

      S.cam.x = lerp(ph ? 60 : -40, 120, es(t, 0.3, 1.6));
      S.cam.y = 10;
      S.cam.z = 1.02 + es(t, 1.2, 1.7) * 0.06;
    };
  },
};
