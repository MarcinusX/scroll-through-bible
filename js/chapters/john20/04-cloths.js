// J 20,6–10 — Inside the tomb. Peter stands in the dim chamber; the morning comes in low through the doorway.
// On the ledge, in a soft light: the linen cloths lying flat and empty — and, a little apart, the cloth that was on
// His head, rolled up in a place by itself (the camera leans in close; a thin dotted gap marks "not with the
// linen"). The other disciple stoops in after him. He sees — and a small light kindles in his heart and slowly
// warms the whole chamber: he believed. A scroll comes down under a veil of gauze: they did not yet understand the
// Scripture that He must rise. Then the two go out again into the morning, and the light stays on the cloths.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix, hanging, swing } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { PETER, BELOVED, IN, tombInside, headAt, soulLight, rayBurst, sparkle, question, nameTag, tombIcon, withFace, faceBits, bodyAt, vignette, linenLying, faceCloth, tr, PI } from './lib.js';

const { FLOOR, DOOR_X, LEDGE } = IN;
const PX = 700, JX = 596;

export default {
  id: 'j20-cloths',
  beats: [
    { v: 6, cont: true, text: 'i ujrzał leżące płótna' },
    { v: 7, text: 'oraz chustę, która była na Jego głowie,' },
    { v: 7, cont: true, text: 'leżącą nie razem z płótnami, ale oddzielnie zwiniętą na jednym miejscu.' },
    { v: 8, text: 'Wtedy wszedł do wnętrza także i ów drugi uczeń, który przybył pierwszy do grobu.' },
    { v: 8, cont: true, text: 'Ujrzał i uwierzył.' },
    { v: 9 },
    { v: 10 },
  ],
  cam: { x: [-200, 260], y: [-40, 60], z: [0.96, 1.2] },
  build(S) {
    const c = S.c;
    const T0 = tombInside(S);
    // John outside, seen through the doorway, then inside
    const jOut = S.puppet(T0.outFig.person(person(c, { ...BELOVED })));
    const PL = S.layer({ par: 0.52, sh: 5 });
    const peterEl = PL.add(withFace(person(c, { ...PETER }), faceBits(c)));
    const peter = S.puppet(peterEl);
    const johnEl = PL.add(withFace(person(c, { ...BELOVED }), faceBits(c)));
    const john = S.puppet(johnEl);

    /* the close-up plate: the end of the linen and the rolled face cloth, apart */
    const fx = S.layer({ par: 0.55, sh: 6 });
    const dk = mix(C.soilDark, C.storm2, 0.3);
    const inner = `<rect x="-200" y="-200" width="400" height="400" fill="${dk}"/>`
      + `<path d="${c.cut([[-200, 40], [200, 34], [200, 200], [-200, 200]], 0.6, 8)}" fill="${mix(C.rock, C.soilDark, 0.3)}"/>`
      + `<path d="${c.cut([[-200, 34], [200, 28], [200, 46], [-200, 50]], 0.4, 8)}" fill="${mix(C.rock, C.cream, 0.12)}"/>`
      + `<path d="${c.poly([[-200, -170], [-120, -190], [60, 60], [-60, 70]])}" fill="${C.lampGlow}" opacity=".22"/>`
      + `<ellipse cx="60" cy="20" rx="120" ry="60" fill="url(#halo-glow)"/>`
      + `<g transform="translate(-170 36) scale(1.3)">${linenLying(c)}</g><g transform="translate(110 36) scale(2)">${faceCloth(c)}</g>`;
    const plate = hanging(fx, vignette(S, inner, { r: 150, k: 'close' }), { x: 0, y: 0, len: 700 });
    const gap = fx.add(`<g opacity="0"><path d="${c.ribbon([[0, 0], [0, 30]], 2.4)}${c.ribbon([[38, 0], [38, 30]], 2.4)}" fill="${C.cream}"/><path d="M5 15H33" stroke="${C.cream}" stroke-width="2.4" stroke-dasharray="6 6" fill="none"/></g>`);
    const ring = fx.add(`<g opacity="0"><ellipse rx="58" ry="34" fill="none" stroke="${C.halo}" stroke-width="3" stroke-dasharray="7 7"/></g>`);
    const sp = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));
    // John's faith: a small light in his heart
    const warmL = S.layer({ par: 0.5, sh: 0, flat: true });
    const warm = warmL.add(`<g><ellipse cx="0" cy="0" rx="700" ry="420" fill="url(#warm-glow)" opacity=".45"/></g>`);
    const heartL = S.layer({ par: 0.52, sh: 3 });
    const rays = heartL.add(`<g>${rayBurst(c, { n: 14, r0: 14, r1: 90, spread: 0.06, o: 0.5 })}</g>`);
    const faith = heartL.add(`<g>${soulLight(c, 12)}</g>`);
    // the scroll of the Scripture, under a veil
    const scL = S.layer({ par: 0.56, sh: 6 });
    const sW = 230, sH = 130;
    const ss = sheet();
    ss.p(c.cut(c.rect(-sW / 2, -sH / 2, sW, sH), 0.4, 6), C.parchment);
    let ln = '';
    for (let i = 0; i < 6; i++) ln += c.ribbon([[-sW / 2 + 22, -sH / 2 + 22 + i * 17], [i % 2 ? 0 : 20, -sH / 2 + 22 + i * 17]], 2);
    ss.x(ln, C.inkSoft, 'opacity=".45"');
    const rod = (x) => sheet().p(c.cut(c.rect(x - 9, -sH / 2 - 14, 18, sH + 28), 0.3, 4), C.wood3).p(c.cut(c.rect(x - 5, -sH / 2 - 24, 10, sH + 48), 0.3, 4), C.wood2).out();
    const emblem = `<g transform="translate(62 18) scale(.9)"><path d="${c.poly(c.circ(0, -24, 22, 20))}" fill="${C.sun}" opacity=".7"/>${tombIcon(c, { open: true })}</g>`;
    const veil = `<path d="${c.cut([[-sW / 2 - 6, -sH / 2 - 10], [sW / 2 + 8, -sH / 2 - 4], [sW / 2 + 4, sH / 2 + 12], [-sW / 2 - 8, sH / 2 + 6]], 1.2, 10)}" fill="#e6def0" opacity=".78"/><path d="${c.ribbon([[-sW / 2, -10], [sW / 2, 6]], 1.2) + c.ribbon([[-sW / 2, 30], [sW / 2, 44]], 1.2)}" fill="#cfc6de" opacity=".7"/>`;
    const scroll = hanging(scL, `${rod(-sW / 2 - 6)}${ss.out()}${emblem}${rod(sW / 2 + 6)}<g class="veil">${veil}</g>`, { x: 0, y: 0, len: 700 });
    const scTag = scL.add(`<g>${nameTag(c, tr('Pismo', 'the Scripture'), { size: 15 })}</g>`);
    const q = scL.add(`<g>${question(c)}</g>`);

    return (t, T) => {
      /* v6c: he sees the linen cloths lying */
      const lg = es(t, 0.15, 0.6);
      pose(T0.linenGlow, { x: IN.LINEN, y: LEDGE.top - 4, s: 0.9 + lg * 0.2, o: lg * (1 - es(t, 1.0, 1.4) * 0.4) });
      fade(T0.shaft, 0.26 + (T ? Math.sin(T * 0.5) * 0.03 : 0));
      /* v7a–b: the face cloth, apart, rolled up in a place by itself */
      const hg = es(t, 1.1, 1.5);
      pose(T0.headGlow, { x: IN.HEAD, y: LEDGE.top - 4, s: 0.9 + hg * 0.3, o: hg });
      const pk = es(t, 1.02, 1.3, ease.back) * (1 - es(t, 2.95, 3.2, ease.in));
      const PXc = 930, PYc = 330;
      swing(plate, PXc, lerp(-800, PYc, pk), pk > 0.001 ? T : 0, 0.8, 0.6);
      fade(plate, pk > 0.001 ? 1 : 0);
      sp.forEach((el, i) => {
        const b = bump(t, 1.35 + i * 0.12, 1.95 + i * 0.12);
        pose(el, { x: PXc + 60 + i * 36, y: PYc - 40 - (i % 2) * 20, s: b, r: T * 30 + i * 40, o: b * pk });
      });
      const gp = es(t, 2.1, 2.35) * (1 - es(t, 2.9, 3.0));
      pose(gap, { x: PXc + 13, y: PYc - 22, o: gp });
      pose(ring, { x: PXc + 104, y: PYc + 16, s: 0.8 + es(t, 2.3, 2.6) * 0.2, o: es(t, 2.3, 2.55) * (1 - es(t, 2.9, 3.0)) });

      /* Peter: looks at the linen, then at the rolled cloth; scratches his head at the Scripture */
      const toHead = es(t, 1.05, 1.4);
      const out = es(t, 6.05, 6.9, ease.sine);
      const puzzled = bump(t, 5.1, 5.95);
      const px = PX - out * 330;
      peter.set({ x: px, y: FLOOR, s: 1.02, flip: out > 0, o: 1 - es(t, 6.6, 6.9), walk: out > 0 && out < 1 ? px * 0.05 : undefined, amt: 0.8, lean: 6 * (1 - out), armF: 30 + lg * 20 * (1 - toHead) + toHead * 10, armB: 12 + puzzled * 150, head: 8 - toHead * 4 + puzzled * -8, blink: blinkAt(T, 1) });

      /* v8a: the other disciple comes in — stooping under the lintel */
      const jOutK = es(t, 3.0, 3.35);
      const jIn = es(t, 3.3, 3.8);
      const jOx = lerp(250, DOOR_X, jOutK);
      jOut.set({ x: jOx, y: FLOOR - 2, s: 0.96, walk: jOutK > 0 && jOutK < 1 ? jOx * 0.05 : undefined, amt: 0.7, lean: jOutK * 18, armF: 20, armB: 10, o: seg(t, 3.0, 3.05) * (1 - seg(t, 3.3, 3.34)) });
      const see = es(t, 4.05, 4.4);
      const jx = lerp(DOOR_X + 10, JX, jIn) - out * 230;
      john.set({ x: jx, y: FLOOR + 4, s: 1.0, flip: out > 0.02, o: seg(t, 3.3, 3.34) * (1 - es(t, 6.75, 6.98)), walk: (jIn > 0 && jIn < 1) || (out > 0 && out < 1) ? jx * 0.05 : undefined, amt: 0.8, lean: (1 - jIn) * 20 + see * -4 * (1 - out), armF: 24 + see * 30 * (1 - out), armB: 12 + see * 14, head: -see * 10 * (1 - out) + bump(t, 5.1, 5.9) * 6, blink: blinkAt(T, 4) });

      /* v8b: he saw and believed — a light in his heart */
      const bel = es(t, 4.25, 4.6);
      const [fx0, fy0] = bodyAt(jx, FLOOR + 4, 1.0, out > 0.02, 6, -104);
      pose(faith, { x: fx0, y: fy0 + (T ? Math.sin(T * 2) * 1.2 : 0), s: bel * (1 + bump(t, 4.3, 4.8) * 0.4), o: bel > 0.01 ? 1 - es(t, 6.7, 6.95) : 0 });
      pose(rays, { x: fx0, y: fy0, s: 0.4 + bel * 0.8, r: T * 6, o: bel * 0.8 * (1 - es(t, 5.0, 5.4) * 0.5) * (1 - es(t, 6.6, 6.9)) });
      pose(warm, { x: fx0 + 200, y: fy0, s: 0.4 + bel * 0.6, o: bel * 0.7 });

      /* v9: the Scripture they did not yet understand */
      const sc = es(t, 5.02, 5.3, ease.back) * (1 - es(t, 5.95, 6.2, ease.in));
      swing(scroll, 760, lerp(-700, 330, sc), sc > 0.001 ? T : 0, 1, 0.6);
      fade(scroll, sc > 0.001 ? 1 : 0);
      pose(scTag, { x: 760, y: 214, s: sc, o: sc > 0.01 ? 1 : 0 });
      const [phx, phy] = headAt(px, FLOOR, 1.02, false);
      const qq = es(t, 5.3, 5.5, ease.back) * (1 - es(t, 5.9, 6.05));
      pose(q, { x: phx + 10, y: phy - 60, s: qq * 1.1, o: qq > 0.01 ? 1 : 0 });

      // phone: from v8 on the camera moves over to the two disciples and the doorway
      S.cam.x = lerp(150, 190, es(t, 0, 1)) - (S.portrait ? es(t, 2.9, 3.4) * 380 : es(t, 2.9, 3.4) * 60 + es(t, 6, 6.8) * 80);
      S.cam.y = 20 - es(t, 1.0, 1.3) * 30 * (1 - es(t, 2.9, 3.3)) - es(t, 4.9, 5.2) * 30 * (1 - es(t, 6, 6.3));
      S.cam.z = (1.08 + es(t, 3.9, 4.4) * 0.08 * (1 - es(t, 4.9, 5.2))) * (S.portrait ? 0.92 : 1);
    };
  },
};
