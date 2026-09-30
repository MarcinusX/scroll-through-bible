// J 3,9–13 — "How can these things be?" A big question hangs over Nicodemus. "You are the teacher of Israel":
// his pile of scrolls and a tag drop beside him, and he lowers his head. "We speak what we know and testify
// to what we have seen" — an eye and a speaking light; "but you do not receive our testimony": a sealed
// letter flies to a row of shadowy figures on the next roof, they turn their backs and it falls.
// Earthly things (a plate with the leaf, the water and the cradle) — heavenly things (a sheet of the night
// sky with a crown of light, far up). "No one has gone up to heaven but He who came down": a ladder of
// light reaches the roof and a light comes down it to Jesus, the Son of Man.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  roofSet, ROOF, ROOFCAM, roofX, flicker, nicodemus, headAt, hand, voiceRings, bigQuestion, nameTag, scrollRolled, scrollOpen,
  roundel, speech, spark, pharisee, shadowPerson, heavenPanel, lightCrown, ladder, leaf, cradle, word, seal, soulLight, tr, PI,
  hangAt,
  vpose,
} from './lib.js';

const F = ROOF.FLOOR, JX = ROOF.JX, NX = ROOF.NX;

export default {
  id: 'j3-teacher',
  beats: [
    { v: 9 },
    { v: 10, text: 'Odpowiadając na to rzekł mu Jezus:' },
    { v: 10, cont: true, text: '«Ty jesteś nauczycielem Izraela, a tego nie wiesz?' },
    { v: 11, text: 'Zaprawdę, zaprawdę, powiadam ci, że to mówimy, co wiemy, i o tym świadczymy, cośmy widzieli,' },
    { v: 11, cont: true, text: 'a świadectwa naszego nie przyjmujecie.' },
    { v: 12, text: 'Jeżeli wam mówię o tym, co jest ziemskie, a nie wierzycie,' },
    { v: 12, cont: true, text: 'to jakżeż uwierzycie temu, co wam powiem o sprawach niebieskich?' },
    { v: 13 },
  ],
  cam: { x: [-90, 60], y: [-40, 180], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    // phone: the scrolls, the tag and the two sheets of v. 12 further in
    const SCX = PH ? 512 : 470, TGX = PH ? 560 : 470, EAX = PH ? 620 : 700, HVX = PH ? 840 : 960;
    const R = roofSet(S);

    /* ---------- the neighbours who do not receive it (on the next roof, behind our parapet) ---------- */
    const N = S.layer({ par: 0.45, sh: 3 });
    const dark = mix(C.night, C.indigo, 0.55);
    const shadows = [0, 1, 2, 3].map((i) => ({ p: S.puppet(N.add(shadowPerson(c, pharisee(c, i), dark))), x: 420 + i * 95, i }));
    // our parapet again, in front of them
    const Pp = S.layer({ par: 0.5, sh: 4 });
    Pp.add(sheet().p(c.cut([[-900, F - 118], [2500, F - 118], [2500, F - 64], [-900, F - 64]], 0.6, 12), mix(C.plaster2, C.indigo, 0.5)).p(c.cut([[-900, F - 126], [2500, F - 126], [2500, F - 114], [-900, F - 114]], 0.4, 12), mix(C.roof, C.indigo, 0.3)).out());

    /* ---------- the ladder of light ---------- */
    const Lg = S.layer({ par: 0.5, sh: 2 });
    const lad = Lg.add(`<g>${ladder(c, 760, 70)}</g>`);
    const desc = Lg.add(`<g>${soulLight(c, 24)}</g>`);

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const scrolls = P.add(`<g>${[[-18, -6, 0], [18, -6, 0], [0, -20, 0], [-8, -34, 10]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${90 + r})">${scrollRolled(c, 44)}</g>`).join('')}<g transform="translate(40 -10)">${scrollOpen(c, 60, 34)}</g></g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const nico = S.puppet(P.add(nicodemus(c, { pose: 'sit' })));
    const voice = voiceRings(P, c, { n: 3, color: C.halo, r: 34, w: 5, both: false });

    /* ---------- words and plates ---------- */
    const X = S.layer({ par: 0.5, sh: 5 });
    const bigQ = X.add(`<g>${bigQuestion(c, 46)}</g>`);
    const tTag = hanging(X, nameTag(c, tr(['nauczyciel', 'Izraela'], ['the teacher', 'of Israel']), { size: 16 }), { x: TGX, y: 420, len: 600 });
    const eye = (() => {
      const s = sheet();
      s.p(c.cut([...c.arc(0, 0, 34, 18, PI, 2 * PI, 12), ...c.arc(0, 0, 34, 18, 0, PI, 12)], 0.3, 3), C.cream);
      s.p(c.cut(c.circ(0, 0, 12, 14), 0.2, 2), C.teal);
      s.x(c.poly(c.circ(0, 0, 5.5, 10)), C.ink).x(c.poly(c.circ(3, -3, 2, 6)), '#fff');
      return s.out();
    })();
    const eyeP = hanging(X, roundel(c, eye, { r: 54, face: mix(C.parchment, C.skyBlue, 0.3) }), { x: 720, y: 360, len: 700 });
    const mouthP = hanging(X, roundel(c, `<g transform="translate(-8 26)">${speech(c, `<g transform="scale(1.2)">${spark(c, 10)}</g>`, { w: 66, h: 46 })}</g>`, { r: 54, face: mix(C.parchment, C.halo, 0.25) }), { x: 880, y: 330, len: 700 });
    const seenT = X.add(`<g>${word(c, tr('widzieliśmy', 'we have seen'), { size: 14 })}</g>`);
    const saidT = X.add(`<g>${word(c, tr('świadczymy', 'we testify'), { size: 14 })}</g>`);
    // the sealed testimony
    const letter = X.add(`<g>${sheet().p(c.cut(c.rect(-24, -16, 48, 32), 0.4, 5), C.cream).x(c.ribbon([[-24, -16], [0, 2], [24, -16]], 1.4), C.ink, 'opacity=".4"').out()}<g transform="scale(.36)">${seal(c)}</g></g>`);
    // earthly things / heavenly things
    const earthIn = `<g transform="translate(-32 -8) scale(1.3)">${leaf(c, C.leaf, 12)}</g><path d="${c.cut([[0, -24], [9, -6], [0, 2], [-9, -6]], 0.2, 3)}" fill="${C.lake}" transform="translate(34 -4)"/><g transform="translate(2 44) scale(.5)">${cradle(c, 80)}</g>`;
    const earthP = hanging(X, roundel(c, earthIn, { r: 62, face: mix(C.sand, C.sage3, 0.35), rim: C.clay }), { x: 700, y: 420, len: 700 });
    const earthT = X.add(`<g>${word(c, tr('ziemskie', 'earthly things'), { size: 15 })}</g>`);
    const heaven = hanging(X, `<g>${heavenPanel(c, 400, 200)}<g transform="translate(0 110)">${lightCrown(c, 30)}</g></g>`, { x: 900, y: -40, len: 400 });
    const heavT = X.add(`<g>${word(c, tr('niebieskie', 'heavenly things'), { size: 15 })}</g>`);
    const sonT = X.add(`<g>${word(c, tr('Syn Człowieczy', 'the Son of Man'), { size: 18 })}</g>`);

    return (t, time) => {
      const T = time;
      swing(R.moon, 1210, 150, T, 1, 0.5);
      flicker(R.lamp, T);

      /* v9 — how can this be? */
      const how = es(t, 0.1, 0.35) * (1 - es(t, 0.95, 1.15));
      const humble = es(t, 2.35, 2.6) * (1 - es(t, 3.0, 3.2));
      const noShake = bump(t, 5.2, 5.9);
      const lookUp = es(t, 6.1, 6.4) * (1 - es(t, 7.9, 8));
      nico.set({ x: NX, y: F + 2, s: 1.02, armF: 30 + how * 60 + noShake * 20, armB: 10 + how * 80, head: -how * 8 + humble * 18 + Math.sin(T * 7) * 6 * noShake - lookUp * 14 - bump(t, 7.3, 7.9) * 6, blink: blinkAt(T, 1) });
      const [nx, ny] = headAt(NX, F + 2, 1.02, false, 62);
      const qk = es(t, 0.15, 0.45, ease.back);
      vpose(bigQ, { x: nx + 40, y: ny - 90 + Math.sin(T * 1.5) * 4, s: qk, r: Math.sin(T * 1.2) * 6, o: seg(t, 0.15, 0.2) * (1 - es(t, 1.0, 1.15)) });

      /* v10 — Jesus answers; the teacher of Israel */
      const speak = es(t, 1.05, 1.3);
      const testify = bump(t, 3.05, 3.95);
      const send = bump(t, 4.05, 4.5);
      const point = bump(t, 5.1, 5.9), up = bump(t, 6.1, 6.95) + es(t, 7.2, 7.5);
      jesus.set({ x: JX, y: F + 2, s: 1.05, flip: true, armF: 24 + speak * 20 + bump(t, 2.05, 2.8) * 40 + testify * 50 + send * 70 + point * 40, armB: 10 + up * 140 + testify * 30, head: -3 - Math.min(1, up) * 6, blink: blinkAt(T, 4) });
      const [hx, hy] = headAt(JX, F + 2, 1.05, true, 62);
      voice(hx - 26, hy + 4, bump(t, 1.05, 2.0) + testify * 0.8, T, { spread: 1.6, dir: -1 });
      const sk = es(t, 2.1, 2.4, ease.out), su = es(t, 2.95, 3.15, ease.in);
      vpose(scrolls, { x: SCX, y: F + 4, s: es(t, 2.05, 2.3, ease.back), o: seg(t, 2.05, 2.1) * (1 - es(t, 7.0, 7.2)) });
      hangAt(tTag, TGX, lerp(-300, 440, sk) - su * 800, T, sk > 0 && su < 1 ? 1 : 0, 1.4, 0.9, 1);

      /* v11 — what we have seen, we testify; you do not receive it */
      const ek = es(t, 3.05, 3.35, ease.out), mk = es(t, 3.2, 3.5, ease.out), eu = es(t, 4.9, 5.1, ease.in);
      const ey = lerp(-300, 360, ek) - eu * 800, my = lerp(-300, 330, mk) - eu * 800;
      hangAt(eyeP, 720, ey, T, ek > 0 && eu < 1 ? 1 : 0, 1.3, 0.8, 1);
      hangAt(mouthP, 880, my, T, mk > 0 && eu < 1 ? 1 : 0, 1.3, 0.8, 2);
      vpose(seenT, { x: 720, y: ey + 76, o: ek > 0 && eu < 1 ? seg(t, 3.3, 3.4) : 0 });
      vpose(saidT, { x: 880, y: my + 76, o: mk > 0 && eu < 1 ? seg(t, 3.45, 3.55) : 0 });
      const shIn = es(t, 3.95, 4.2), shOut = es(t, 5.0, 5.3);
      const turn = es(t, 4.45, 4.55);
      shadows.forEach((m) => {
        m.p.set({ x: m.x + (1 - shIn) * -200 - shOut * 300, y: 630, s: 0.8, flip: turn > 0.5, o: shIn > 0 && shOut < 1 ? 1 : 0, head: -turn * 6, blink: 0 });
      });
      const fly = seg(t, 4.12, 4.45), drop = es(t, 4.45, 4.85, ease.in);
      const [lx, ly] = hand(JX, F + 2, 1.05, true, 94, 0, 62);
      const tx = 560, ty = 470;
      const x = lerp(lx, tx, ease.out(fly)) - drop * 40, y = lerp(ly - 20, ty, ease.out(fly)) - Math.sin(fly * PI) * 90 + drop * 170;
      vpose(letter, { x, y, r: fly * 20 + drop * 120, s: 0.9, o: fly > 0 ? 1 - es(t, 4.8, 4.95) : 0 });

      /* v12 — earthly things, heavenly things */
      const ak = es(t, 5.05, 5.35, ease.out), au = es(t, 6.9, 7.1, ease.in);
      const ay = lerp(-300, 420, ak) - au * 800;
      hangAt(earthP, EAX, ay, T, ak > 0 && au < 1 ? 1 : 0, 1.2, 0.8, 3);
      vpose(earthT, { x: EAX, y: ay + 84, o: ak > 0 && au < 1 ? seg(t, 5.3, 5.4) : 0 });
      const hk = es(t, 6.05, 6.5, ease.out), hu = es(t, 7.0, 7.3, ease.in);
      const hy2 = lerp(-500, 150, hk) - hu * 700;
      hangAt(heaven, HVX, hy2, T, hk > 0 && hu < 1 ? 1 : 0, 0.8, 0.6, 4);
      vpose(heavT, { x: HVX, y: hy2 + 222, o: hk > 0 && hu < 1 ? seg(t, 6.4, 6.5) : 0 });

      /* v13 — the ladder, and the One who came down */
      const lk = es(t, 7.0, 7.35);
      vpose(lad, { x: JX + 110, y: F - 780, sy: lk, o: seg(t, 7.0, 7.05) });
      const dk = es(t, 7.3, 7.75, ease.in);
      vpose(desc, { x: JX + 110 + dk * -90, y: lerp(F - 700, hy - 10, dk), s: 1 - dk * 0.5, o: bump(t, 7.3, 7.85) * 1.4 });
      const st = es(t, 7.6, 7.9, ease.back);
      vpose(sonT, { x: JX, y: hy - 100, s: st, o: seg(t, 7.6, 7.65) });

      S.cam.x = roofX(S);
      S.cam.y = ROOFCAM.y - es(t, 6.0, 6.5) * 120 * (1 - es(t, 7.35, 7.8) * 0.4);
      S.cam.z = ROOFCAM.z - es(t, 6.0, 6.5) * 0.25;
    };
  },
};
