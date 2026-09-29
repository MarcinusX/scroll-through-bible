// Mt 12,22–24 — a town square in Galilee, the crowd all round. Two friends lead in a man who is blind and mute: his
// eyes shut, his mouth taped over, a dark shadow clinging behind him and a little dark spirit on his shoulder. Jesus
// lays His hand on him — the spirit shoots off and fades, the shadow drops away, the tape falls, his eyes open and he
// speaks. The whole crowd throws up its hands: "Can this be the Son of David?" — a golden crown with a question
// mark hangs over Jesus. But the Pharisees put their heads together and mutter: "Beelzebul!" — a dark bubble with
// the horned prince of demons and his flies.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { squareSet, SQ, MUTE, MUTE_OK, manOf, womanOf, withFace, tapeX, spirit, shadowCloak, handAt, headAt, kf, moving, speech, shout, crown, qMark, darkPrince, flyBug, tagText, sparkle, glow, tr, PI } from './lib.js';

const F = SQ.FEET;
const MX = 690;       // where the man stands before Jesus

export default {
  id: 'mt12-demoniac',
  beats: [
    { v: 22, text: 'Wówczas przyprowadzono Mu opętanego, który był niewidomy i niemy.' },
    { v: 22, cont: true, text: 'Uzdrowił go, tak że niemy mógł mówić i widzieć.' },
    { v: 23 },
    { v: 24 },
  ],
  cam: { x: [-30, 50], y: [-20, 50], z: [1, 1.14] },
  build(S) {
    const Q = squareSet(S, { dis: ['peter', 'john'] });
    const c = Q.c;
    const act = Q.act;
    /* the man and his two friends (added to the act layer, in front of the disciples) */
    const cloak = act.add(`<g>${shadowCloak(c, 150, 250)}</g>`);
    const friends = [manOf(c, { robe: C.ochreRobe, belt: C.leather }), womanOf(c, { robe: C.sageRobe, veil: C.blushVeil })].map((o, i) => ({ i, p: S.puppet(act.add(person(c, o))) }));
    const mute = S.puppet(act.add(withFace(person(c, MUTE), `<g transform="translate(9 9)">${tapeX(c, 18)}</g>`)));
    const healed = S.puppet(act.add(person(c, MUTE_OK)));
    const imp = act.add(`<g>${spirit(c, 1.3, '#3d3346')}</g>`);
    const heal = act.add(`<g opacity="0">${glow(140, 1)}${sparkle(c, 18)}</g>`);
    const tapeFall = act.add(`<g opacity="0">${tapeX(c, 18)}</g>`);

    /* words */
    const fx = S.layer({ par: 0.52, sh: 4 });
    const talk = fx.add(`<g opacity="0">${speech(c, `${sparkle(c, 10, C.sun)}<g transform="translate(16 2)">${sparkle(c, 7, C.sun)}</g>`, { w: 56, h: 44 })}</g>`);
    const hangL = S.layer({ par: 0.2, sh: 6 });
    const son = hanging(hangL, `${glow(90, 0.8)}<g transform="translate(-22 18) scale(2.4)">${crown(c)}</g><g transform="translate(46 -8)">${qMark(c, 54)}</g><g transform="translate(0 62)">${tagText(c, tr('Syn Dawida?', 'Son of David?'), { size: 20 })}</g>`, { x: SQ.JX, y: -300, len: 900 });
    const whisper = fx.add(`<g opacity="0">${shout(c, `<g transform="scale(.9)">${darkPrince(c, 34)}</g>`, { w: 140, h: 116, fill: mix(C.stone2, C.storm, 0.35), flip: true })}<g transform="translate(-70 -22)">${tagText(c, tr('Belzebub!', 'Beelzebul!'), { size: 18, fill: mix(C.cream, C.rock2, 0.35) })}</g></g>`);
    const flies = [0, 1, 2, 3, 4].map(() => fx.add(`<g opacity="0">${flyBug(c)}</g>`));

    const mK = [[-0.7, 330], [0.6, MX]];

    return (t, time) => {
      const T = time;

      /* v22a — they bring him */
      const mx = kf(t, mK, (u) => ease.sine(u));
      const walking = moving(t, mK);
      const well = es(t, 1.3, 1.36);
      const touch = bump(t, 1.05, 1.5);
      Q.pose(t, T,
        { flip: t > 0.2 && t < 2.2 && t > 0.25, armF: 16 + touch * 70 + es(t, 2.1, 2.3) * 20, armB: 8 + es(t, 2.1, 2.3) * 30, head: -2 + es(t, 0.3, 0.6) * (1 - es(t, 2.0, 2.2)) * 6, blink: blinkAt(T, 2) },
        (d) => ({ x: d.x - 70, y: F - 26, s: 0.9, armF: 10 + es(t, 2.05, 2.3) * 40, armB: 6 + es(t, 2.05, 2.3) * (d.i ? 110 : 20), head: -2 - es(t, 2.05, 2.3) * 6, blink: blinkAt(T, d.seed) }),
        (m) => {
          const plot = es(t, 3.05 + m.i * 0.05, 3.25 + m.i * 0.05);
          return { x: m.x + (m.i === 0 ? plot * 30 : m.i === 2 ? -plot * 26 : 0), armF: 8 + plot * (m.i === 1 ? 60 : 20), armB: plot * 20, head: plot * (m.i === 0 ? -14 : 14), lean: plot * (m.i === 0 ? -8 : 8), flip: m.i === 0 ? plot < 0.5 : true, blink: Math.max(plot * 0.5, blinkAt(T, m.seed)) };
        });
      const cured = well;
      const my = F + 4;
      mute.set({ x: mx, y: my, s: 0.98, flip: false, o: 1 - cured, walk: walking ? mx * 0.05 : undefined, armF: 50, armB: 10, head: 8, lean: 4, blink: 0 });
      healed.set({ x: mx, y: my, s: 0.98, flip: false, o: cured, armF: 30 + es(t, 1.45, 1.7) * 60, armB: es(t, 1.45, 1.7) * 130, head: -6 - es(t, 1.45, 1.7) * 6, blink: blinkAt(T, 5) });
      friends.forEach((f) => {
        const x = mx - 90 - f.i * 74;
        const glad = es(t, 1.5, 1.75);
        f.p.set({ x, y: my + (f.i ? 8 : 2), s: 0.95, flip: false, walk: walking ? x * 0.05 + f.i : undefined, armF: (f.i ? 20 : 60) + glad * 60, armB: glad * (f.i ? 140 : 40), head: -glad * 8, blink: blinkAt(T, 7 + f.i) });
      });
      pose(cloak, { x: mx - 6, y: my + 2, s: 1 + bump(t, 1.2, 1.4) * 0.2, o: 1 - es(t, 1.22, 1.45) });

      /* v22b — the spirit flees, he sees and speaks */
      const flee = es(t, 1.15, 1.6, ease.in);
      const [shx, shy] = headAt(mx, my, 0.98, false);
      pose(imp, { x: lerp(shx - 24, shx - 360, flee), y: lerp(shy + 30, shy - 260, flee), r: flee * -140 + Math.sin(T * 3) * 6 * (1 - flee), s: 1 - flee * 0.4, o: 1 - es(t, 1.4, 1.62) });
      pose(heal, { x: shx, y: shy + 20, o: bump(t, 1.1, 1.8), r: T * 10 });
      const tf = es(t, 1.3, 1.6, ease.in);
      pose(tapeFall, { x: shx + 9, y: shy + 9 + tf * 150, r: tf * 200, o: well * (1 - es(t, 1.55, 1.62)) });
      const tk = es(t, 1.55, 1.7, ease.back) * (1 - es(t, 2.4, 2.6));
      pose(talk, { x: shx + 16, y: shy - 14, s: tk, o: tk > 0.01 ? 1 : 0 });

      /* v23 — the crowd is amazed: "the Son of David?" */
      const wow = es(t, 2.05, 2.25) * (1 - es(t, 3.05, 3.3) * 0.7);
      Q.amaze(wow);
      const sd = es(t, 2.2, 2.55, ease.back) * (1 - es(t, 3.1, 3.35));
      pose(son, { x: SQ.JX, y: lerp(-300, 240, sd), r: Math.sin(T * 0.9) * 1, oy: 0, o: sd > 0.01 ? 1 : 0 });

      /* v24 — the Pharisees mutter "Beelzebul" */
      const wk = es(t, 3.25, 3.45, ease.back);
      const [px, py] = headAt(SQ.PX[1], F, 0.96, true);
      pose(whisper, { x: px - 30, y: py - 30, s: wk, o: wk > 0.01 ? 1 : 0 });
      flies.forEach((f, i) => {
        const a = T * (1.4 + i * 0.2) + i * 1.3;
        pose(f, { x: px - 110 + Math.cos(a) * (70 + i * 6), y: py - 110 + Math.sin(a * 1.3) * 40, r: Math.sin(a) * 30, o: es(t, 3.35 + i * 0.03, 3.5 + i * 0.03) });
      });

      S.cam.x = kf(t, [[-0.6, -30], [0.6, -20], [1.0, -10], [2.0, -10], [2.2, 0], [3.05, 0], [3.3, 40]]);
      S.cam.z = kf(t, [[-0.6, 1.08], [0.6, 1.1], [1.0, 1.14], [2.0, 1.14], [2.2, 1.08], [3.05, 1.08], [3.3, 1.12]]);
      S.cam.y = kf(t, [[-0.6, 36], [1.0, 50], [2.0, 50], [2.2, 30], [3.05, 30], [3.3, 44]]);
    };
  },
};
