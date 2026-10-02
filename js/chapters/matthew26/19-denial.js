// Mt 26,69–75 — below, in the courtyard by the fire, at the end of the night. Peter sits outside among the servants; a
// servant girl lifts her lamp to his face — "You too were with Jesus the Galilean" — and before them all he denies it.
// He goes out to the gateway; another girl sees him and tells those standing there — "This man was with Jesus of
// Nazareth" — and again he denies it with an oath: "I do not know the man" (a second mark). A little later the
// bystanders come up to him: "your speech gives you away" (a bubble of the Galilean lake and a boat). He curses and
// swears — "I do not know the man!" — and at once, on the wall, against the first grey of dawn, the rooster crows.
// Peter remembers the word (a sepia memory: the two of them under the moon, the rooster, three marks), goes out through
// the gate, and weeps bitterly.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  palaceDawn, palaceIdle, TW, LOOK, kf, moving, hand, headAt, withFace, faceBits, guardOpts, man, cord, speech, say, GLYPH, rooster, tally, oilLamp, voiceRings,
  discPlate, SEPIA, tr, PI, vis,
} from './lib.js';
import { boat } from '../../assets/things.js';

const ROO = { x: 318, y: 458 };      // the rooster on the courtyard wall, near the gate

export default {
  id: 'mt26-denial',
  beats: [
    { v: 69, text: 'Piotr zaś siedział zewnątrz na dziedzińcu.' },
    { v: 69, cont: true, text: 'Podeszła do niego jedna służąca i rzekła: «I ty byłeś z Galilejczykiem Jezusem».' },
    { v: 70 },
    { v: 71, text: 'A gdy wyszedł ku bramie, zauważyła go inna' },
    { v: 71, cont: true, text: 'i rzekła do tych, co tam byli: «Ten był z Jezusem Nazarejczykiem».' },
    { v: 72 },
    { v: 73, text: 'Po chwili ci, którzy tam stali, zbliżyli się i rzekli do Piotra:' },
    { v: 73, cont: true, text: '«Na pewno i ty jesteś jednym z nich, bo i twoja mowa cię zdradza».' },
    { v: 74, text: 'Wtedy począł się zaklinać i przysięgać: «Nie znam tego Człowieka».' },
    { v: 74, cont: true, text: 'I w tej chwili kogut zapiał.' },
    { v: 75, text: 'Wspomniał Piotr na słowo Jezusa, który mu powiedział: «Zanim kogut zapieje, trzy razy się Mnie wyprzesz».' },
    { v: 75, cont: true, text: 'Wyszedł na zewnątrz i gorzko zapłakał.' },
  ],
  cam: { x: [-1700, 300], y: [-260, 360], z: [1, 1.7] },
  build(S) {
    const c = S.c;
    const R = palaceDawn(S);
    const { HALL, YARD, FIRE, GATE } = R;

    // up in the hall: Jesus among the guards (seen from below)
    const hallL = S.layer({ par: R.P, sh: 5 });
    const jEl = hallL.add(withFace(person(c, { ...CAST.jesus, holdF: cord(c) }), faceBits(c)));
    const jesus = S.puppet(jEl);
    const jSad = jEl.querySelector('[data-part="sad"]');
    // phone: He stands a little further left with one guard, so neither He nor a half guard sits under the thread;
    // while the camera is at the gateway that guard steps back (he would peep in at the edge)
    const hallG = [0, 1].map((i) => S.puppet(hallL.add(person(c, guardOpts(c)))));
    hallG.forEach((g, i) => g.set({ x: 670 + i * 130 - (S.portrait ? 30 : 0), y: HALL, s: 0.72, flip: i === 1, armF: 20, o: S.portrait && i === 1 ? 0 : 1 }));

    const Y = R.yard();
    // the rooster on the wall
    const rL = S.layer({ par: R.P, sh: 4 });
    const roEl = rL.add(`<g>${rooster(c)}</g>`);
    const roHead = roEl.querySelector('.rhead'), beakL = roEl.querySelector('.beakL');
    const cry = voiceRings(rL, c, { n: 3, color: C.cream, r: 26, w: 4, both: false });

    // people round the fire (behind the porch)
    const P = S.layer({ par: R.P, sh: 5 });
    const BY = (S.portrait ? [{ x: FIRE + 84 }, { x: FIRE + 140 }, { x: FIRE + 196 }] : [{ x: FIRE + 90 }, { x: FIRE + 160 }, { x: FIRE + 230 }]).map(   // phone: closer round the fire, clear of the thread
      (d, i) => {
      const o = guardOpts(c);
      return { ...d, i, seed: c.rr(0, 9), sit: S.puppet(P.add(person(c, { ...o, pose: 'sit' }))), stand: S.puppet(P.add(person(c, o))) };
    });
    const pSitEl = P.add(withFace(person(c, { ...TW.peter, pose: 'sit' }), faceBits(c)));
    const pSit = S.puppet(pSitEl);
    const pStEl = P.add(withFace(person(c, TW.peter), faceBits(c)));
    const pSt = S.puppet(pStEl);
    const maid = S.puppet(P.add(person(c, { ...LOOK.maid, holdF: `<g transform="translate(-2 6) scale(.42)">${oilLamp(c, { r: 90 })}</g>` })));
    const mLampFl = maid.el.querySelector('.flame');
    const maid2 = S.puppet(P.add(person(c, { ...LOOK.maid, robe: C.roseRobe, veil: C.stone, veil2: C.stone2, skin: C.skin3, hair: C.hair })));
    R.porch();
    // outside the gate: Peter weeping
    const outL = S.layer({ par: R.P, sh: 5 });
    const pKnEl = outL.add(withFace(person(c, { ...TW.peter, pose: 'kneel' }), faceBits(c)));
    const pKn = S.puppet(pKnEl);
    const face = (el) => ({ sad: el.querySelector('[data-part="sad"]'), angry: el.querySelector('[data-part="angry"]'), tear: el.querySelector('[data-part="tear"]') });
    const fS = face(pSitEl), fT = face(pStEl), fK = face(pKnEl);

    // bubbles, marks, the memory
    const fx = S.layer({ par: R.P, sh: 4 });
    const halo = (x, y) => `<g transform="translate(${x} ${y})"><circle cy="-6" r="14" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(0, -6, 8, 12), 0.2, 3)}" fill="${C.halo}"/><path d="${c.cut(c.circ(0, -5, 5, 10), 0.2, 3)}" fill="${C.skin}"/><path d="${c.cut([[-6, 12], [-5, 0], [5, 0], [6, 12]], 0.2, 3)}" fill="${C.linen}"/></g>`;
    const withJ = `${halo(-14, 4)}<g transform="translate(14 4)"><path d="${c.cut(c.circ(0, -5, 5.5, 10), 0.2, 3)}" fill="${C.skin2}"/><path d="${c.cut([[-6, 12], [-5, 0], [5, 0], [6, 12]], 0.2, 3)}" fill="${C.dustyBlue}"/></g>`;
    const accuse1 = fx.add(`<g>${speech(c, withJ, { w: 70, h: 50, flip: true })}</g>`);
    const accuse2 = fx.add(`<g>${speech(c, withJ, { w: 70, h: 50, flip: false })}</g>`);
    const no = () => `<path d="${c.ribbon([[-14, -14], [14, 14]], 5) + c.ribbon([[14, -14], [-14, 14]], 5)}" fill="${C.terracotta}"/>`;
    const deny1 = fx.add(`<g>${speech(c, `<g transform="translate(-10 0)">${no()}</g><g transform="translate(18 0) scale(.9)">${GLYPH.q(c)}</g>`, { w: 70, h: 48 })}</g>`);
    const deny2 = fx.add(`<g>${say(c, tr('Nie znam tego Człowieka', 'I don’t know the man'), { size: 18, side: -1, fill: mix(C.cream, C.storm, 0.2) })}</g>`);
    const b = boat(c);
    const galilee = fx.add(`<g>${speech(c, `<path d="${c.cut(c.ell(0, 10, 34, 8, 16), 0.3, 3)}" fill="${C.lake}"/><g transform="translate(0 12) scale(.16)">${b.back}${b.front}</g><path d="${c.ribbon(c.qbez([-30, -14], [-10, -26], [8, -14], 8), 2) + c.ribbon(c.qbez([4, -16], [20, -28], [34, -16], 8), 2)}" fill="${C.lake3}"/>`, { w: 90, h: 60, flip: true })}</g>`);
    const swear = fx.add(`<g>${say(c, tr('Nie znam tego Człowieka!', 'I don’t know the man!'), { size: 18, side: -1, fill: mix(C.cream, C.storm, 0.35) })}</g>`);
    const marks = hanging(fx, `${sheet().p(c.cut(c.rect(-50, 0, 100, 52), 0.5, 6), C.cream).out()}${[0, 1, 2].map((i) => `<g class="mk" transform="translate(${-16 + i * 16} 42)">${tally(c, 1, C.ink, 30)}</g>`).join('')}`, { x: 0, y: -1500, len: 700 });
    const mks = Array.from(marks.querySelectorAll('.mk'));
    const memClip = S.id('mem');
    const memory = hanging(fx, `${sheet().p(c.cut(c.ell(0, 0, 150, 100, 40), 0.6, 6), SEPIA.wall2).out()}<defs><clipPath id="${memClip}"><ellipse cx="0" cy="0" rx="138" ry="90"/></clipPath></defs><g clip-path="url(#${memClip})"><rect x="-150" y="-100" width="300" height="200" fill="${mix(C.parchment, C.duskViolet, 0.35)}"/><circle cx="90" cy="-50" r="18" fill="${C.moon}"/><path d="${c.cut([[-160, 100], [-160, 50], [0, 40], [160, 52], [160, 100]], 1, 10)}" fill="${mix(C.sage, C.parchment, 0.4)}"/><g transform="translate(-30 64) scale(.5)">${person(c, CAST.jesus)}</g><g transform="translate(40 66) scale(.48) scale(-1 1)">${person(c, TW.peter)}</g><g transform="translate(-100 -14) scale(.42)">${rooster(c)}</g><g transform="translate(96 30)">${tally(c, 3, C.ink, 22)}</g></g><path d="${c.ribbon(c.ell(0, 0, 144, 95, 44).concat([c.ell(0, 0, 144, 95, 44)[0]]), 5)}" fill="${C.wood3}"/>`, { x: 0, y: -1500, len: 800 });
    const tears = [0, 1, 2, 3].map(() => fx.add(`<g><path d="${c.cut([[0, -5], [3, 1], [0, 4], [-3, 1]], 0.1, 2)}" fill="#bfe0ee"/></g>`));

    return (t, time) => {
      const T = time;
      const dawn = es(t, 8.9, 11.5);
      R.dawn.fade(dawn);
      R.dawnGlow.fade(dawn * 0.7);
      R.stars.fade(1 - dawn * 0.8);
      palaceIdle(R, Y, T, es(t, 10.5, 11.6));
      jesus.set({ x: S.portrait ? 700 : 730, y: HALL, s: 0.72, flip: true, armF: 24, armB: 14, head: 12 - es(t, 8.1, 8.4) * 10, blink: blinkAt(T) });
      fade(jSad, 0.8);
      if (S.portrait) hallG[0].set({ x: 640, y: HALL, s: 0.72, flip: false, armF: 20, o: 1 - es(t, 3.1, 3.5) + es(t, 7.9, 8.15) });

      /* the first servant girl: comes with her lamp, looks, speaks */
      const mK = [[-0.4, [880, YARD]], [0.8, [FIRE - 20, YARD]], [3.05, [FIRE - 20, YARD]], [3.7, [1000, YARD]]];
      const [mx, my] = kf(t, mK, ease.sine);
      const look = es(t, 1.05, 1.3) * (1 - es(t, 2.9, 3.05));
      const point1 = es(t, 1.35, 1.55) * (1 - es(t, 1.95, 2.1));
      maid.set({ x: mx, y: my, s: 0.84, flip: t < 3.05, o: 1 - es(t, 3.5, 3.7), walk: moving(t, mK, 1) ? mx * 0.05 : undefined, armF: 50 + look * 50 + point1 * 30, armB: 0, head: -look * 6, lean: look * 8, blink: blinkAt(T, 8) });
      pose(mLampFl, { x: 35, y: -16, sy: 1 + Math.sin(T * 7) * 0.1 });
      // the second girl, at the gateway
      const m2 = es(t, 3.05, 3.3);
      const point2 = es(t, 4.05, 4.25) * (1 - es(t, 4.9, 5.05));
      maid2.set({ x: GATE + 260, y: YARD, s: 0.82, flip: t < 4.0 || t > 5.0, o: m2 * (1 - es(t, 6.0, 6.3)), armF: 20 + point2 * 70, armB: point2 * 40, head: -point2 * 4, blink: blinkAt(T, 5) });

      /* Peter: at the fire; stands; to the gateway; the oath; the curse; out of the gate; weeps */
      const up = es(t, 2.95, 3.02);
      const pK = [[3.0, [FIRE - 108, YARD]], [3.05, [FIRE - 108, YARD]], [3.7, [GATE + 160, YARD + 8]], [11.05, [GATE + 160, YARD + 8]], [11.45, [GATE - 200, YARD + 8]]];
      const [px, py] = kf(t, pK, ease.sine);
      const deny1K = es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.05));
      const deny2K = es(t, 5.05, 5.25) * (1 - es(t, 5.9, 6.05));
      const swearK = es(t, 8.05, 8.3) * (1 - es(t, 8.95, 9.1));
      const hear = es(t, 9.05, 9.2);
      const remember = es(t, 10.05, 10.3);
      const weep = es(t, 11.42, 11.5);
      pSit.set({ x: FIRE - 108, y: YARD + 6, s: 0.86, flip: false, o: 1 - up, armF: 70 - look * 20 + deny1K * 20, armB: 50 - look * 20 + deny1K * 40, head: 8 - look * 14 - deny1K * 6 * Math.sin(T * 8), lean: -look * 4, blink: blinkAt(T, 3) });
      fade(fS.sad, look);
      fade(fS.angry, deny1K * 0.6);
      const faceL = t > 3.05 && t < 3.75 ? true : t > 11.05;
      pSt.set({
        x: px, y: py, s: 0.86, flip: faceL, o: up * (1 - weep), walk: moving(t, pK, 1) ? px * 0.05 : undefined,
        armF: 20 + deny2K * 70 + swearK * 40 + bump(t, 7.2, 7.9) * 20, armB: deny2K * 90 + swearK * 150, head: -deny2K * 8 * Math.sin(T * 9) - swearK * 8 + hear * 20 * (1 - remember) + remember * 14,
        lean: swearK * -6 + remember * 6, blink: blinkAt(T, 3),
      });
      fade(fT.angry, swearK + deny2K * 0.6);
      fade(fT.sad, remember);
      pKn.set({ x: GATE - 230, y: YARD + 12, s: 0.86, flip: true, o: weep, armF: 64, armB: 40, head: 34, lean: 36 + (T ? Math.sin(T * 2.6) * 2 : 0), bob: T ? Math.abs(Math.sin(T * 2.6)) * -2 : 0, blink: 0 });
      fade(fK.sad, 1);
      fade(fK.tear, 1);
      tears.forEach((d, i) => {
        const k = ((T * 0.6 + i / 4) % 1);
        vis(d, { x: GATE - 230 - 70 + (i % 2 ? -7 : 6), y: YARD + 12 - 62 + k * 56, s: 1.3, o: weep * (1 - k) * (T ? 1 : (i === 0 ? 1 : 0)) });
      });

      /* the bystanders: at the fire; they rise and gather at the gateway; they come up to Peter */
      BY.forEach((d) => {
        const GX = S.portrait ? GATE + 320 + d.i * 45 : GATE + 350 + d.i * 55;   // phone: they gather a little nearer, clear of the thread
        const rise = es(t, 4.1 + d.i * 0.08, 4.18 + d.i * 0.08);
        const bK = [[4.15 + d.i * 0.08, [d.x, YARD]], [4.8 + d.i * 0.08, [GX, YARD]], [6.05, [GX, YARD]], [6.5, [GATE + 250 + d.i * 50, YARD]], [11.05, [GATE + 250 + d.i * 50, YARD]], [11.5, [GATE + 520 + d.i * 70, YARD]]];
        const [bx, by] = kf(t, bK, ease.sine);
        const talk = d.i === 0 ? es(t, 7.05, 7.3) * (1 - es(t, 7.9, 8.05)) : bump(t, 7.1 + d.i * 0.1, 7.9);
        d.sit.set({ x: d.x, y: YARD + 8, s: 0.84, flip: true, o: 1 - rise, armF: 64, armB: 40, head: 6 - look * 10, blink: blinkAt(T, d.seed) });
        d.stand.set({ x: bx, y: by, s: 0.84, flip: t < 11.05, o: rise * (1 - es(t, 11.2, 11.6)), walk: moving(t, bK, 1) ? bx * 0.05 : undefined, armF: 20 + talk * 70, armB: talk * 30, head: -talk * 6, blink: blinkAt(T, d.seed) });
      });

      /* the rooster: at once, as he swears the third time */
      const crow = bump(t, 9.05, 9.7);
      vis(roEl, { x: ROO.x, y: ROO.y, s: 0.9, o: 1 });
      pose(roHead, { x: 16, y: -58, r: -crow * 28, ox: 16, oy: -58 });
      pose(beakL, { x: 33, y: -79, r: crow * 22, ox: 33, oy: -79 });
      cry(ROO.x + 40, ROO.y - 80, crow, T, { spread: 2.8 });

      /* bubbles */
      const [mhx, mhy] = headAt(mx, my, 0.84, true);
      const a1 = es(t, 1.4, 1.6, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(accuse1, { x: mhx - 14, y: mhy - 20, s: a1, o: a1 > 0.01 ? 1 : 0 });
      const d1 = es(t, 2.15, 2.35, ease.back) * (1 - es(t, 2.9, 3.0));
      const [shx, shy] = headAt(FIRE - 108, YARD + 6, 0.86, false, 62);
      vis(deny1, { x: shx + 20, y: shy - 24, s: d1, o: d1 > 0.01 ? 1 : 0 });
      const [m2x, m2y] = headAt(GATE + 260, YARD, 0.82, false);
      const a2 = es(t, 4.15, 4.35, ease.back) * (1 - es(t, 4.9, 5.0));
      vis(accuse2, { x: m2x + 14, y: m2y - 20, s: a2, o: a2 > 0.01 ? 1 : 0 });
      const [phx, phy] = headAt(px, py, 0.86, faceL);
      const d2 = es(t, 5.15, 5.35, ease.back) * (1 - es(t, 5.9, 6.0));
      vis(deny2, { x: phx - 10, y: phy - 24, s: d2, o: d2 > 0.01 ? 1 : 0 });
      const [bhx, bhy] = headAt(GATE + 250, YARD, 0.84, true);
      const g1 = es(t, 7.2, 7.4, ease.back) * (1 - es(t, 7.9, 8.0));
      vis(galilee, { x: bhx - 10, y: bhy - 20, s: g1, o: g1 > 0.01 ? 1 : 0 });
      const sw = es(t, 8.15, 8.35, ease.back) * (1 - es(t, 8.9, 9.0));
      vis(swear, { x: phx - 10 + (S.portrait ? 30 : 0), y: phy - 20, s: sw * (S.portrait ? 0.88 : 1), o: sw > 0.01 ? 1 : 0, r: (T ? Math.sin(T * 12) * 1.5 : 0) * sw });
      // the three marks, one per denial
      const mIn = es(t, 2.1, 2.4, ease.out) * (1 - es(t, 2.9, 3.1)) + es(t, 5.1, 5.4, ease.out) * (1 - es(t, 5.9, 6.1)) + es(t, 8.1, 8.4, ease.out) * (1 - es(t, 9.9, 10.1));
      const mX = t < 4 ? FIRE - 30 : GATE + 190;
      vis(marks, { x: mX, y: (t < 4 ? 420 : S.portrait ? 280 : 330) -   // phone: above the rooster's comb
        (1 - Math.min(1, mIn)) * 800, r: Math.sin(T) * 2, o: mIn > 0.01 ? 1 : 0 });
      mks.forEach((m, i) => fade(m, [es(t, 2.3, 2.4), es(t, 5.3, 5.4), es(t, 8.3, 8.4)][i]));
      const memK = es(t, 10.05, 10.4, ease.out) * (1 - es(t, 10.9, 11.15, ease.in));
      vis(memory, { x: GATE + (S.portrait ? 150 : 200), y: 420 - (1 - memK) * 800, r: Math.sin(T * 0.7) * 1.5, o: memK > 0.01 ? 1 : 0 });

      /* camera: the fire; the gateway; a look up at Him as Peter swears; the dawn at the end */
      // phone: a little to the right at the fire (He stays in sight up in the hall), at the gateway (the bystanders) and on the look up at Him
      S.cam.x = S.portrait
        ? kf(t, [[-0.5, -460], [0.9, -570], [3.0, -570], [3.7, -800], [7.9, -800], [8.2, -690], [8.9, -690], [9.3, -910], [10.9, -915], [11.3, -1400], [11.8, -1640]])
        : kf(t, [[-0.5, -500], [0.9, -680], [3.0, -680], [3.7, -900], [7.9, -900], [8.2, -860], [8.9, -860], [9.3, -960], [10.9, -1000], [11.3, -1400], [11.8, -1640]]);
      S.cam.y = kf(t, [[-0.5, 200], [0.9, 290], [3.0, 290], [3.7, 280], [7.9, 280], [8.2, 60], [8.9, 60], [9.3, 250], [10.9, 280], [11.3, 150], [11.8, 180]]);
      S.cam.z = kf(t, [[-0.5, 1.4], [0.9, 1.5], [1.2, 1.6], [2.9, 1.56], [3.7, 1.5], [7.9, 1.56], [8.2, 1.14], [8.9, 1.14], [9.3, 1.5], [10.9, 1.56], [11.3, 1.2], [11.8, 1.16]]);
    };
  },
};
