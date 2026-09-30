// Łk 23,50–52 — evening in Pilate's hall (Mark 15's hall): the sun sinks behind the city and the lamps are lit.
// A man comes in, Joseph, a member of the council, "a good and righteous man" — his tags come down. He had not
// consented to their decision: a small plate shows the council raising their hands, and one of them — he — with his
// hands down. He came from Arimathea, a town of the Jews (its little picture), and he was waiting for the kingdom of
// God: in his thought a gate of light. He goes up to Pilate and asks for the body of Jesus (a small cross with a
// linen cloth over its arms); Pilate nods.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { town } from '../../assets/nature.js';
import { kf, moving, headAt, speech, thought, nameTag, strip, pilate, priest, elder, shroudCross, hallSet, lampSet, hanging, swing, pose3, LOOK, SKIES, tr, PI } from './lib.js';

const GY = 690;

export default {
  id: 'lk23-joseph',
  beats: [
    { v: 50 },
    { v: 51, text: 'Nie przystał on na ich uchwałę i postępowanie.' },
    { v: 51, cont: true, text: 'Był z miasta żydowskiego Arymatei, i oczekiwał królestwa Bożego.' },
    { v: 52 },
  ],
  cam: { x: [-60, 200], y: [-20, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const H = hallSet(S, { evening: true });
    const P = H.charL;
    const pil = S.puppet(P.add(pilate(c, { pose: 'sit' })));
    const jos = S.puppet(P.add(person(c, LOOK.joseph)));
    const fx = H.fxL;
    const flies = S.layer({ par: 0.22, sh: 5 });
    const jTag = hanging(flies, `${nameTag(c, tr(['Józef', 'członek Rady'], ['Joseph', 'a council member']), { size: 17 })}<g transform="translate(0 84)">${strip(c, tr('dobry i sprawiedliwy', 'a good and righteous man'), { size: 14, fill: C.stone })}</g>`, { x: 0, y: -1500, len: 900 });
    /* the council plate: hands raised — and his down */
    const pw = 300, ph = 170;
    const cid = S.id('council');
    const plate = sheet().p(c.cut(c.rect(-pw / 2 - 10, 0, pw + 20, ph + 20), 0.6, 8), mix(C.wood3, C.parchment, 0.3)).p(c.cut(c.rect(-pw / 2, 10, pw, ph), 0.5, 8), mix(C.stone, C.plaster2, 0.4)).out();
    const mem = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => ({ x: k * 32, y: 170 - (Math.abs(k) % 2) * 6, s: 0.5, flip: k > 0, o: k === 1 ? LOOK.joseph : k % 2 ? { robe: C.linen, mantle: [C.plumRobe, C.mauve, C.indigo][(k + 9) % 3], hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin2 } : { robe: [C.stone2, C.wheatRobe, C.linen2][(k + 9) % 3], mantle: [C.wood3, C.sageRobe, C.clayMantle][(k + 9) % 3], hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin3 }, armF: k === 1 ? 10 : 100, armB: k === 1 ? 8 : 150, head: k === 1 ? 10 : -8 }));
    const council = hanging(flies, `${plate}<clipPath id="${cid}"><rect x="${-pw / 2}" y="10" width="${pw}" height="${ph}"/></clipPath><g clip-path="url(#${cid})"><ellipse cx="32" cy="110" rx="36" ry="70" fill="url(#halo-glow)"/>${pose3(c, mem)}</g><g transform="translate(0 ${ph + 44})">${strip(c, tr('nie przystał na ich uchwałę', 'he had not consented'), { size: 14 })}</g>`, { x: 0, y: -1500, len: 900 });
    /* Arimathea */
    const aw = 220, ah = 120;
    const aid = S.id('arim');
    const arim = hanging(flies, `${sheet().p(c.cut(c.rect(-aw / 2 - 8, 0, aw + 16, ah + 16), 0.5, 7), mix(C.wood3, C.parchment, 0.3)).p(c.cut(c.rect(-aw / 2, 8, aw, ah), 0.4, 7), mix(C.skyBlue, C.dawn, 0.5)).out()}<clipPath id="${aid}"><rect x="${-aw / 2}" y="8" width="${aw}" height="${ah}"/></clipPath><g clip-path="url(#${aid})"><path d="${c.ridge(c.wave(92, [8, 3], [200, 70]), -aw, aw, 200, 10, 0.8)}" fill="${C.hillMid}"/>${town(c, { x: 0, y: 96, n: 6, spread: 140, sc: 0.5 })}</g><g transform="translate(0 ${ah + 34})">${strip(c, tr('Arymatea', 'Arimathaea'), { size: 16 })}</g>`, { x: 0, y: -1500, len: 900 });
    const hope = fx.add(`<g>${thought(c, `<circle r="30" fill="url(#halo-glow)"/><path d="${c.poly([[-13, 14], [-13, -4], ...c.arc(0, -4, 13, 13, PI, 2 * PI, 10), [13, 14]])}" fill="#fff6d8"/><path d="${c.ribbon([[-18, 14], [-18, -6]], 3) + c.ribbon([[18, 14], [18, -6]], 3) + c.ribbon(c.arc(0, -6, 18, 18, PI, 2 * PI, 10), 3)}" fill="${C.sun}"/>`, { w: 84, h: 66 })}</g>`);
    const ask = fx.add(`<g>${speech(c, `<g transform="scale(1.1)">${shroudCross(c)}</g>`, { w: 64, h: 70 })}</g>`);

    return (t, time) => {
      const T = time;
      H.sk.blend(SKIES.dusk, SKIES.night, 0.1 + es(t, 0, 4) * 0.3);
      pose(H.orb, { x: 800, y: 380 + es(t, 0, 3) * 120, o: 1 - es(t, 2.5, 3.2) });
      pose(H.cl, { x: 610 + Math.sin(T * 0.1) * 20, y: 250 });
      H.lamps.forEach((l, i) => lampSet(l, es(t, 0.1 + i * 0.2, 0.4 + i * 0.2), T));

      /* Joseph comes in; waits; goes up to Pilate */
      const jK = [[-0.2, [120, GY]], [0.6, [560, GY]], [2.95, [560, GY]], [3.4, [880, GY]]];
      const [jx, jy] = kf(t, jK);
      const up = es(t, 2.1, 2.35) * (1 - es(t, 2.9, 3.05));
      const bowK = es(t, 3.35, 3.55);
      jos.set({ x: jx, y: jy, s: 1.04, flip: false, walk: moving(t, jK) ? jx * 0.05 : undefined, armF: 14 + bowK * 50, armB: 8 + up * 20 + bowK * 20, head: -up * 16 + bowK * 12, lean: bowK * 8, blink: blinkAt(T, 2) });
      const [jhx, jhy] = headAt(jx, jy, 1.04, false);
      const tk = es(t, 0.3, 0.6) * (1 - es(t, 1.9, 2.1));
      swing(jTag, 560, 230 - (1 - tk) * 900, T, 1.2, 0.9, 1);
      /* v51a — the council plate */
      const ck = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 1.9, 2.15));
      swing(council, 820, 130 - (1 - ck) * 900, T, 0.8, 0.7, 2);
      /* v51b — Arimathea; the kingdom of God */
      const ak = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.9, 3.15));
      swing(arim, 900, 190 - (1 - ak) * 900, T, 0.9, 0.7, 3);
      const hk = es(t, 2.2, 2.45, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(hope, { x: jhx + 4, y: jhy - 14, s: hk * 1.2, o: hk > 0.02 ? 1 : 0 });
      /* v52 — he asks Pilate for the body */
      const bk = es(t, 3.5, 3.7, ease.back);
      pose(ask, { x: jhx + 20, y: jhy - 20, s: bk, o: bk > 0.02 ? 1 : 0 });
      const nod = bump(t, 3.7, 3.95);
      pil.set({ x: 1116, y: 566, s: 1, flip: true, armF: 30 + es(t, 3.75, 3.95) * 40, armB: 10, head: -4 + nod * 12, blink: blinkAt(T, 1) });

      S.cam.x = -20 + es(t, 2.9, 3.5) * 110;
      S.cam.y = 10 + es(t, 2.9, 3.5) * 20;
      S.cam.z = 1.02 + es(t, 2.9, 3.5) * 0.06;
      if (S.portrait) S.cam.x += 60;
    };
  },
};
