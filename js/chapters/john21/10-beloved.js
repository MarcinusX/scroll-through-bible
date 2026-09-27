// J 21,20–22 — Along the shore, Jesus ahead, Peter following. Peter turns round and sees the disciple whom Jesus loved
// coming after them (a soft heart glows over him). A picture frame remembers who he is: at the supper, leaning on
// Jesus' breast, asking "Lord, who is it that will betray You?" Peter points back at him: "Lord, and what about him?"
// Jesus: "If I want him to remain until I come, what is that to you?" — a round plate: a long road to a dawn on the
// horizon, a small figure waiting on it. "You — follow Me!" — footprints of light run on along the sand, and Peter
// turns and follows; the beloved disciple comes after.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  beachSet, JESUS, PETER, CAST, MORNING, pictureFrame, mini, lightSteps, speech, GLYPH, heart, lightHeart, hungPlate, miniHead, dawnDisc,
  withFace, faceBits, skyKeys, kf, moving, headAt, vis, pose, fade, person, sheet, shade, mix, C, lerp, blinkAt, tr, FONT, PI,
} from './lib.js';

const GY = 700;
const JX = 920, PX = 760, JOX = 560;
const FW = 280, FH = 170;

function supperPic(c) {
  const s = sheet();
  s.p(c.cut(c.rect(0, 0, FW, FH), 0, 20), mix(C.night, C.duskViolet, 0.35));
  s.p(c.cut(c.rect(0, FH * 0.72, FW, FH * 0.28), 0.4, 8), mix(C.wood3, C.night, 0.4));
  // window with the evening, a hanging lamp
  s.p(c.cut(c.rect(FW * 0.72, 22, 44, 46), 0.3, 5), mix(C.dusk, C.duskViolet, 0.4));
  const table = sheet().p(c.cut([[30, FH * 0.7], [FW - 30, FH * 0.7], [FW - 36, FH * 0.78], [36, FH * 0.78]], 0.4, 6), C.wood).out();
  const lamp = `<g transform="translate(${FW * 0.5} 26)"><circle r="46" fill="url(#warm-glow)"/><path d="${c.cut([[-9, 0], [9, 0], [5, 7], [-5, 7]], 0.2, 3)}" fill="${C.sun}"/><path d="${c.cut([[-2, 0], [0, -7], [2, 0]], 0.1, 2)}" fill="${C.lampFlame}"/></g>`;
  return s.out() + lamp
    + `<g transform="translate(${FW * 0.42} ${FH * 0.74})">${mini(c, CAST.jesus, { pose: 'sit', sc: 0.42 })}</g>`
    + `<g transform="translate(${FW * 0.5} ${FH * 0.76}) rotate(-16)">${mini(c, CAST.john, { pose: 'sit', sc: 0.4 })}</g>`
    + `<g transform="translate(${FW * 0.24} ${FH * 0.74})">${mini(c, CAST.peter, { pose: 'sit', sc: 0.4 })}</g>`
    + `<g transform="translate(${FW * 0.7} ${FH * 0.74})">${mini(c, CAST.james, { pose: 'sit', sc: 0.4 })}</g>`
    + table;
}
function roadPlate(c, r = 70) {
  const s = sheet();
  s.p(c.cut([[-r, r * 0.05], [-r * 0.3, -r * 0.05], [r * 0.3, 0], [r, -r * 0.08], [r, r], [-r, r]], 0.5, 6), mix(C.hillNear, C.sage2, 0.4));
  s.p(c.ribbon(c.cbez([-r * 0.5, r], [-r * 0.1, r * 0.5], [r * 0.4, r * 0.3], [r * 0.05, 0], 18), (u) => 22 - u * 20), mix(C.sand, C.cream, 0.3));
  return `<circle cx="0" cy="-6" r="${r * 0.7}" fill="url(#halo-glow)"/><g transform="translate(0 -4)">${sheet().p(c.cut(c.arc(0, 0, r * 0.2, r * 0.2, PI, 2 * PI, 12).concat([[r * 0.2, 0], [-r * 0.2, 0]]), 0.2, 3), C.sun).out()}</g>` + s.out()
    + `<g transform="translate(${-r * 0.12} ${r * 0.62})">${mini(c, CAST.john, { sc: 0.16 })}</g>`;
}

export default {
  id: 'j21-beloved',
  beats: [
    { v: 20, text: 'Piotr obróciwszy się zobaczył idącego za sobą ucznia, którego miłował Jezus,' },
    { v: 20, cont: true, text: 'a który to w czasie uczty spoczywał na Jego piersi i powiedział: «Panie, kto jest ten, który Cię zdradzi?»' },
    { v: 21 },
    { v: 22, text: 'Odpowiedział mu Jezus: «Jeżeli chcę, aby pozostał, aż przyjdę, co tobie do tego?' },
    { v: 22, cont: true, text: 'Ty pójdź za Mną!»' },
  ],
  cam: { x: [-40, 200], y: [-40, 140], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const BS = beachSet(S, { skyCols: MORNING, sunY: 150, sunX: 1300, deferFire: true, boat: false });
    const { K } = BS;
    const stepsL = S.layer({ par: 0.55, sh: 0, flat: true });
    const steps = Array.from(stepsL.add(`<g>${lightSteps(c, [[960, GY + 8], [1100, GY + 4], [1240, GY], [1400, GY - 4]], { n: 9, s0: 1.5, s1: 1.3, col: mix(C.sun, C.sunDeep, 0.25) })}</g>`).querySelectorAll('[data-i]'));
    const QL = S.layer({ par: 0.58, sh: 5 });
    const staffM = `<g transform="rotate(20)">${sheet().p(c.ribbon([[0, -120], [1.5, 0], [0, 70]], 5.5), C.wood2).p(c.ribbon(c.arc(-10, -120, 10, 12, 0, -PI, 8), 5), C.wood2).out()}</g>`;
    const john = S.puppet(QL.add(withFace(person(c, CAST.john), faceBits(c))));
    const peter = S.puppet(QL.add(withFace(person(c, { ...PETER, holdF: staffM }), faceBits(c))));
    const jesus = S.puppet(QL.add(person(c, JESUS)));

    const hangL = S.layer({ par: 0.5, sh: 5 });
    const fid = S.id('sup');
    S.defs(`<clipPath id="${fid}"><rect x="${-FW / 2}" y="0" width="${FW}" height="${FH}"/></clipPath>`);
    const frame = hangL.add(`<g>${pictureFrame(c, supperPic(c), { w: FW, h: FH, clipId: fid, bg: C.night })}</g>`);
    const rid = S.id('road');
    S.defs(`<clipPath id="${rid}"><circle r="70"/></clipPath>`);
    const road = hangL.add(hungPlate(c, `<g clip-path="url(#${rid})">${roadPlate(c, 70)}</g>`, { r: 76, face: mix(C.dawn, C.skyBlue, 0.4) }));

    const fx = S.layer({ par: 0.6, sh: 3 });
    const love = fx.add(`<g>${lightHeart(c, 12)}</g>`);
    const who = fx.add(`<g>${speech(c, `<g transform="scale(.8)">${GLYPH.q(c)}</g>`, { w: 40, h: 36 })}</g>`);
    const what = fx.add(`<g>${speech(c, `<g transform="translate(-12 2)">${miniHead(c, CAST.john, 12)}</g><g transform="translate(14 0) scale(.75)">${GLYPH.q(c)}</g>`, { w: 76, h: 50, flip: false })}</g>`);
    const follow = fx.add(`<g>${speech(c, `<text x="0" y="7" text-anchor="middle" font-family="${FONT}" font-size="21" font-style="italic" fill="${C.ink}">${tr('Ty pójdź za Mną!', 'You follow me!')}</text>`, { w: 180, h: 50, flip: true })}</g>`);
    const toYou = fx.add(`<g>${speech(c, `<text x="0" y="6" text-anchor="middle" font-family="${FONT}" font-size="16" font-style="italic" fill="${C.ink}">${tr('co tobie do tego?', 'what is that to you?')}</text>`, { w: 170, h: 44, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      skyKeys(K.sk, t, [[0, MORNING], [5, MORNING]]);
      K.idle(T, { sunY: 150, sunX: 1300 });
      pose(K.sunPath, { x: 1300, y: 450, o: 0.4 });

      /* walking along the shore; Peter turns and sees John following */
      const jKeys = [[0, JX - 60], [0.5, JX], [4.3, JX], [5.0, JX + 260]];
      const pKeys = [[0, PX - 60], [0.5, PX], [4.35, PX], [5.0, PX + 230]];
      const oKeys = [[0, JOX - 240], [0.8, JOX], [4.5, JOX], [5.0, JOX + 180]];
      const jx = kf(t, jKeys), px = kf(t, pKeys), ox = kf(t, oKeys);
      const ask = bump(t, 2.05, 2.95);
      const say = bump(t, 3.05, 3.95), say2 = bump(t, 4.05, 4.6);
      jesus.set({ x: jx, y: GY - 4, s: 1.0, flip: t > 0.5 && t < 4.3, walk: moving(t, jKeys) ? jx * 0.05 : undefined, armF: 16 + say * 50 + say2 * 70, armB: 10 + say * 60 + say2 * 20, head: say * 4, blink: blinkAt(T) });
      peter.set({ x: px, y: GY, s: 0.96, flip: t > 0.35 && t < 2.02, walk: moving(t, pKeys) ? px * 0.05 : undefined, armF: 34 + ask * 20, armB: 14 - ask * 90, head: -es(t, 0.4, 0.6) * 4, blink: blinkAt(T, 2) });
      john.set({ x: ox, y: GY + 6, s: 0.94, flip: false, walk: moving(t, oKeys) ? ox * 0.05 : undefined, armF: 16, armB: 10, head: -4, blink: blinkAt(T, 5) });

      /* the heart over the beloved */
      const [ohx, ohy] = headAt(ox, GY + 6, 0.94, false);
      const lk = es(t, 0.45, 0.7, ease.back) * (1 - es(t, 1.9, 2.1));
      vis(love, { x: ohx, y: ohy - 50 + (T ? Math.sin(T * 2) * 3 : 0), s: lk, o: lk > 0.01 ? 1 : 0 });

      /* the supper remembered */
      const fk = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      const fy = lerp(-500, 230, fk);
      vis(frame, { x: 740, y: fy, s: 1.15, r: T ? Math.sin(T * 0.7) : 0, o: fk > 0.01 ? 1 : 0 });
      const wk = es(t, 1.35, 1.55, ease.back) * (1 - es(t, 1.95, 2.05));
      vis(who, { x: 740 + 10, y: fy + 80, s: wk * 1.15, o: wk > 0.01 ? 1 : 0 });

      /* v21 — "and what about him?" */
      const [phx, phy] = headAt(px, GY, 0.96, false);
      const qk = es(t, 2.15, 2.35, ease.back) * (1 - es(t, 2.9, 3.05));
      vis(what, { x: phx + 20, y: phy - 20, s: qk, o: qk > 0.01 ? 1 : 0 });

      /* v22a — the road to the dawn: if I want him to remain until I come */
      const rk = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 3.95, 4.2, ease.in));
      vis(road, { x: 740, y: lerp(-400, 330, rk), s: 1.2, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: rk > 0.01 ? 1 : 0 });
      const [jhx, jhy] = headAt(jx, GY - 4, 1.0, true);
      const tk = es(t, 3.5, 3.7, ease.back) * (1 - es(t, 3.95, 4.05));
      vis(toYou, { x: jhx - 16, y: jhy - 24, s: tk, o: tk > 0.01 ? 1 : 0 });
      /* v22b — "You follow Me!" */
      const fl = es(t, 4.08, 4.28, ease.back);
      vis(follow, { x: jhx - 16, y: jhy - 24, s: fl, o: fl > 0.01 ? 1 : 0 });
      steps.forEach((el, i) => fade(el, es(t, 4.3 + i * 0.05, 4.4 + i * 0.05) * 0.9));

      S.cam.x = kf(t, [[0, 0], [0.5, -20], [1, -20], [2, 0], [3, 10], [4, 20], [5, 120]]);
      S.cam.y = kf(t, [[0, 60], [1, 20], [2, 70], [3, 20], [4, 60], [5, 80]]);
      S.cam.z = kf(t, [[0, 1.1], [1, 1.08], [2, 1.16], [3, 1.08], [4, 1.14], [5, 1.08]]);
    };
  },
};
