// Mk 9,38–41 — in the courtyard. John tells what happened, and it plays on a backlit sheet as shadow
// theatre: a stranger drives out a dark spirit in Jesus' name (a little golden star in his hand);
// the disciples' shadows step in to stop him. "Do not forbid him" — the shadows step back; the stranger
// bows (a heart). Whoever is not against us is for us: a golden ring on the ground widens and takes him in.
// And a cup of water given in his name will not lose its reward: the child brings a clay cup.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { rock, olive, sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK, TWELVE, hang2, shadowPerson, wisp, heart, spark, bubble, clayCup, kf, sparkle } from './lib.js';

const PI = Math.PI;
const P = 0.45;
const FEET = 700;
const SCR = { x: 800, y: 150, w: 560, h: 250 };      // the shadow screen (top-centre)
const SF = SCR.y + SCR.h - 26;                         // feet of the shadow figures

export default {
  id: 'm9-name',
  beats: [
    { v: 38, text: 'Wtedy Jan rzekł do Niego: «Nauczycielu, widzieliśmy kogoś, kto nie chodzi z nami, jak w Twoje imię wyrzucał złe duchy,' },
    { v: 38, cont: true, text: 'i zabranialiśmy mu, bo nie chodził z nami».' },
    { v: 39, text: 'Lecz Jezus odrzekł: «Nie zabraniajcie mu,' },
    { v: 39, cont: true, text: 'bo nikt, kto czyni cuda w imię moje, nie będzie mógł zaraz źle mówić o Mnie.' },
    { v: 40 },
    { v: 41 },
  ],
  cam: { x: [-20, 40], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#c9dcd8', '#eee4cb', '#f6e3c4']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 38), { x: 1260, y: 130, len: 800 });

    // courtyard walls, an olive tree, a well
    const wallL = S.layer({ par: 0.25, sh: 3 });
    const w = sheet();
    w.p(c.cut([[-900, 470], [2500, 470], [2500, 1700], [-900, 1700]], 1, 20), C.plaster);
    let blocks = '';
    for (let y = 480; y < 620; y += 34) for (let x = -900 + ((y / 34) % 2) * 40; x < 2500; x += 80) blocks += c.cut(c.rect(x, y, 74, 28), 0.6, 10);
    w.x(blocks, C.plaster2, 'opacity=".5"');
    w.p(c.cut([[-900, 610], [2500, 610], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.stone2, 0.4));
    wallL.add(w.out());
    wallL.add(olive(c, 250, 620, 1.2) + olive(c, 1400, 624, 1));
    const well = sheet().p(c.cut(c.rect(-50, -60, 100, 64), 0.6, 8), C.stone).p(c.cut(c.ell(0, -60, 52, 10, 16), 0.5, 6), C.stone2).p(c.ribbon([[-44, -60], [-44, -130], [44, -130], [44, -60]], 6), C.wood2).out();
    wallL.add(`<g transform="translate(1250 650)">${well}</g>`);

    /* ---------- the shadow screen ---------- */
    const scrL = S.layer({ par: 0.3, sh: 5 });
    const screen = sheet().p(c.cut(c.rect(-SCR.w / 2, 0, SCR.w, SCR.h), 0.8, 12), '#fbf1d8').p(c.cut(c.rect(-SCR.w / 2 - 8, -8, SCR.w + 16, 14), 0.4, 8), C.wood2).out();
    const scrEl = hanging(scrL, `<g><ellipse cx="0" cy="${SCR.h / 2}" rx="${SCR.w * 0.42}" ry="${SCR.h * 0.42}" fill="url(#warm-glow)" opacity="0"/>${screen}<ellipse cx="0" cy="${SCR.h / 2}" rx="${SCR.w * 0.4}" ry="${SCR.h * 0.38}" fill="url(#warm-glow)" opacity=".7"/><path d="M${-SCR.w / 2 + 20} ${SCR.h - 26}H${SCR.w / 2 - 20}" stroke="#3b2a22" stroke-width="3" opacity=".6"/></g>`, { x: SCR.x, y: SCR.y, len: 800 });
    const shL = S.layer({ par: 0.3, sh: 1, flat: true });
    const SH = '#3b2a22';
    const sStranger = S.puppet(shL.add(shadowPerson(c, LOOK.stranger, SH)));
    const sSick = S.puppet(shL.add(shadowPerson(c, { ...LOOK.boy, pose: 'kneel' }, SH)));
    const sWisp = shL.add(`<g opacity="0">${wisp(c, 0.9, SH)}</g>`);
    const sStar = shL.add(`<g opacity="0">${spark(c, 8)}</g>`);
    const sBlock = [CAST.john, CAST.peter].map((o) => S.puppet(shL.add(shadowPerson(c, o, SH))));
    const sHeart = shL.add(`<g opacity="0">${heart(c, 12)}</g>`);

    /* ---------- the golden ring on the ground (who is not against us) ---------- */
    const ringL = S.layer({ par: P, sh: 1, flat: true });
    const ring = ringL.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 300, 44, 0, PI * 2, 60), 5)}" fill="${C.haloRim}"/></g>`);

    /* ---------- Jesus, the child, the disciples ---------- */
    const mainL = S.layer({ par: P, sh: 5 });
    // phone: the right-hand group drawn in, so the stranger who joins them (v40) is on the screen
    const PH = S.portrait;
    const AX = PH ? 985 : 1080, JX = PH ? 925 : 1000, SX = PH ? 1045 : 1180;
    const bench = sheet().p(c.cut(c.rect(-70, -40, 140, 40), 0.5, 8), C.stone).p(c.cut(c.rect(-76, -46, 152, 10), 0.4, 8), C.stone2).out();
    mainL.add(`<g transform="translate(800 ${FEET + 2})">${bench}</g>`);
    const peter = S.puppet(mainL.add(person(c, { ...CAST.peter, pose: 'sit' })));
    const andrew = S.puppet(mainL.add(person(c, { ...CAST.andrew, pose: 'sit' })));
    const james = S.puppet(mainL.add(person(c, { ...CAST.james, pose: 'sit' })));
    const jesus = S.puppet(mainL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const john = S.puppet(mainL.add(person(c, CAST.john)));
    const stranger = S.puppet(mainL.add(person(c, LOOK.stranger)));
    const child = S.puppet(mainL.add(person(c, LOOK.child)));
    const cup = mainL.add(`<g opacity="0">${clayCup(c, 24)}</g>`);
    const reward = mainL.add(`<g opacity="0"><circle r="40" fill="url(#halo-glow)"/>${sparkle(c, 18)}</g>`);
    const stop = mainL.add(`<g opacity="0">${bubble(c, tr('Nie zabraniajcie mu!', 'Don’t forbid him!'), { size: 19, tail: -1 })}</g>`);
    const strangerHeart = mainL.add(`<g opacity="0">${heart(c, 14)}</g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1260, 130, T, 1, 0.6);
      /* the screen comes down while John speaks */
      const scr = es(t, 0, 0.3, ease.back) * (1 - es(t, 4.1, 4.5));
      swing(scrEl, SCR.x, lerp(-1000, SCR.y, scr), T, 0.4, 0.5);
      const sy = lerp(-1000, SCR.y, scr) - SCR.y;      // shadows move with the screen
      shL.fade(scr);

      /* the shadow play */
      const cast = es(t, 0.35, 0.7);
      const flee = es(t, 0.6, 0.95);
      sSick.set({ x: 880, y: SF + sy, s: 0.5, flip: true, head: -4 + flee * 8, armF: 20 + flee * 40 });
      sStranger.set({ x: 760, y: SF + sy, s: 0.52, armF: 30 + cast * 60, armB: 10 + cast * 40 - es(t, 3.05, 3.4) * 40, head: -2 + es(t, 3.1, 3.4) * 14, lean: es(t, 3.1, 3.4) * 14 });
      pose(sWisp, { x: 900 + flee * 60, y: SF - 90 + sy - flee * 60, r: flee * 40, s: 1 - flee * 0.4, o: (1 - flee) * es(t, 0.3, 0.45) });
      pose(sStar, { x: 760 + 36, y: SF - 104 + sy, s: 0.6 + cast * 0.4, r: T * 20, o: cast * (1 - es(t, 1.2, 1.5) * 0.5) });
      sBlock.forEach((p, i) => {
        const inn = es(t, 1.05 + i * 0.1, 1.4 + i * 0.1);
        const out = es(t, 2.1, 2.5);
        p.set({ x: lerp(560 - i * 60, 660 - i * 58, inn) - out * 180, y: SF + sy, s: 0.52, o: inn * (1 - out), armF: inn * 90 * (1 - out), armB: inn * 60 * (1 - out), blink: 0 });
      });
      pose(sHeart, { x: 740, y: SF - 120 + sy - es(t, 3.2, 3.6) * 10, s: es(t, 3.15, 3.4, ease.back), o: es(t, 3.1, 3.2) * scr });

      /* John tells; Jesus answers */
      const tell = (t < 2 ? 1 : 0) * (Math.sin(T * 1.8) * 0.5 + 0.5);
      john.set({ x: 640, y: FEET, s: 0.96, armF: 30 + tell * 40 + bump(t, 1.05, 1.9) * 40, armB: 10 + tell * 30 * (t < 1 ? 1 : 0) + bump(t, 1.05, 1.9) * 50, head: -4 - es(t, 2.1, 2.4) * 8 * (1 - es(t, 4.1, 4.4)), blink: blinkAt(T, 2) });
      const answer = es(t, 2.05, 2.3) * (1 - es(t, 3.9, 4.1));
      const welcome = es(t, 4.2, 4.6) * (1 - es(t, 5.1, 5.3));
      jesus.set({ x: 800, y: FEET - 30, s: 1, armF: 20 + answer * 50 + welcome * 60 + es(t, 5.4, 5.7) * 20, armB: 10 + answer * 120 + welcome * 60, head: -4, blink: blinkAt(T, 1) });
      pose(stop, { x: 850, y: FEET - 250, s: es(t, 2.1, 2.3, ease.back), o: bump(t, 2.05, 2.95) > 0.05 ? 1 : 0 });
      peter.set({ x: 520, y: FEET, s: 0.94, head: -6 - bump(t, 0.1, 2) * 4, armF: 20, blink: blinkAt(T, 4) });
      andrew.set({ x: AX, y: FEET + 4, s: 0.9, flip: true, head: -4, armF: 14, blink: blinkAt(T, 6) });

      /* v40: the ring widens; the stranger comes and stands with them */
      const widen = es(t, 4.1, 4.8);
      pose(ring, { x: 800, y: FEET + 4, sx: 0.8 + widen * (PH ? 0.5 : 0.62), sy: 0.9 + widen * 0.25, o: es(t, 4.05, 4.3) * (1 - es(t, 5.6, 6) * 0.5) });
      const come = es(t, 4.25, 4.85);
      const sx = lerp(SX + 180, SX, come);
      stranger.set({ x: sx, y: FEET - 4, s: 0.94, flip: true, o: es(t, 4.2, 4.3), walk: come > 0 && come < 1 ? sx * 0.06 : undefined, armF: 20 + es(t, 4.8, 5) * 30, head: -4, blink: blinkAt(T, 7) });
      pose(strangerHeart, { x: SX - 4, y: FEET - 250, s: es(t, 4.8, 5, ease.back), o: es(t, 4.75, 4.85) * (1 - es(t, 5.3, 5.5)) });

      /* v41: the child brings a cup of water to a disciple; a little reward shines */
      const walk = es(t, 5.05, 5.45);
      const cx = PH ? lerp(840, 882, walk) : lerp(880, 950, walk);
      child.set({ x: cx, y: FEET + 4, s: 0.56, flip: false, walk: walk > 0 && walk < 1 ? cx * 0.1 : undefined, armF: 20 + es(t, 5.05, 5.2) * 50, head: -4, blink: blinkAt(T, 8) });
      const [hx, hy] = [cx + 36 * 0.56 + 26 * es(t, 5.05, 5.2), FEET - 110];
      pose(cup, { x: hx, y: hy + 12, o: es(t, 5.02, 5.12) });
      james.set({ x: JX, y: FEET, s: 0.94, flip: true, head: -6 + es(t, 5.4, 5.6) * 6, armF: 20 + bump(t, 1.2, 2) * 20 + es(t, 5.4, 5.6) * 50, blink: blinkAt(T, 5) });
      pose(reward, { x: hx + 6, y: FEET - 200 - es(t, 5.5, 5.9) * 30, s: es(t, 5.5, 5.75, ease.back), r: T * 15, o: es(t, 5.5, 5.6) });

      S.cam.z = 1 + es(t, 4.1, 4.8) * 0.04 + es(t, 5, 5.6) * 0.04;
      S.cam.y = -20 + es(t, 4.1, 4.8) * 40;
      S.cam.x = es(t, 5, 5.6) * 30;
    };
  },
};
