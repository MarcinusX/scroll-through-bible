// Mk 14,66–72 — below, in the courtyard, by the fire: a servant girl lifts her lamp to Peter's face — "You too were with
// the Nazarene". "I don't know what you mean." He goes out to the porch — and on the wall a rooster crows. Again, to the
// bystanders: "He is one of them." Again he denies. "You are a Galilean!" — he swears: "I do not know the man."
// At once the rooster crows a second time against the first grey of dawn; Peter remembers the word — and weeps.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  palace, TW, LOOK, kf, moving, hand, headAt, withFace, faceBits, guardOpts, man, cord, speech, say, GLYPH, rooster, tally, oilLamp, voiceRings,
  discPlate, SEPIA, NIGHT, DAWN, PI,
vis, } from './lib.js';
import { boat } from '../../assets/things.js';

const ROO = { x: 318, y: 458 };      // the rooster on the courtyard wall, near the gate

export default {
  id: 'm14-denial',
  beats: [
    { v: 66 },
    { v: 67, text: 'Zobaczywszy Piotra grzejącego się [przy ogniu], przypatrzyła mu się' },
    { v: 67, cont: true, text: 'i rzekła: «I tyś był z Nazarejczykiem Jezusem».' },
    { v: 68, text: 'Lecz on zaprzeczył temu, mówiąc: «Nie wiem i nie rozumiem, co mówisz».' },
    { v: 68, cont: true, text: 'I wyszedł na zewnątrz do przedsionka, a kogut zapiał.' },
    { v: 69 },
    { v: 70, text: 'A on ponownie zaprzeczył.' },
    { v: 70, cont: true, text: 'Po chwili ci, którzy tam stali, mówili znowu do Piotra: «Na pewno jesteś jednym z nich, jesteś także Galilejczykiem».' },
    { v: 71 },
    { v: 72, text: 'I w tej chwili kogut powtórnie zapiał.' },
    { v: 72, cont: true, text: 'Wspomniał Piotr na słowa, które mu powiedział Jezus: «Pierwej, nim kogut dwa razy zapieje, trzy razy Mnie się wyprzesz».' },
    { v: 72, cont: true, text: 'I wybuchnął płaczem.' },
  ],
  cam: { x: [-1250, 300], y: [-200, 360], z: [1, 2.2] },
  build(S) {
    const c = S.c;
    const R = palace(S, { skyCols: NIGHT });
    const { HALL, YARD, FIRE, GATE, SEATX } = R;
    // dawn glow low on the horizon
    const dawnL = S.layer({ par: 0.12, sh: 0, flat: true });
    dawnL.add(`<ellipse cx="200" cy="560" rx="1200" ry="300" fill="url(#warm-glow)" opacity=".9"/>`);

    // up in the hall: Jesus among the guards (seen from below)
    const hallL = S.layer({ par: R.P, sh: 5 });
    const jEl = hallL.add(withFace(person(c, { ...CAST.jesus, holdF: cord(c) }), faceBits(c)));
    const jesus = S.puppet(jEl);
    const jSad = jEl.querySelector('[data-part="sad"]');
    [0, 1].forEach((i) => S.puppet(hallL.add(person(c, guardOpts(c)))).set({ x: 670 + i * 130, y: HALL, s: 0.72, flip: i === 1, armF: 20 }));

    const Y = R.yard();
    // the rooster on the wall
    const rL = S.layer({ par: R.P, sh: 4 });
    const roEl = rL.add(`<g>${rooster(c)}</g>`);
    const roHead = roEl.querySelector('.rhead'), beakL = roEl.querySelector('.beakL');
    const cry = voiceRings(rL, c, { n: 3, color: C.cream, r: 26, w: 4, both: false });

    R.porch();
    // people in the yard (in front of the gate)
    const P = S.layer({ par: R.P, sh: 5 });
    const BY = [{ x: FIRE + 90, seed: c.rr(0, 9) }, { x: FIRE + 160, seed: c.rr(0, 9) }, { x: FIRE + 230, seed: c.rr(0, 9) }].map((d, i) => {
      const o = guardOpts(c);
      return { ...d, i, sit: S.puppet(P.add(person(c, { ...o, pose: 'sit' }))), stand: S.puppet(P.add(person(c, o))) };
    });
    const pSitEl = P.add(withFace(person(c, { ...TW.peter, pose: 'sit' }), faceBits(c)));
    const pSit = S.puppet(pSitEl);
    const pStEl = P.add(withFace(person(c, TW.peter), faceBits(c)));
    const pSt = S.puppet(pStEl);
    const pKnEl = P.add(withFace(person(c, { ...TW.peter, pose: 'kneel' }), faceBits(c)));
    const pKn = S.puppet(pKnEl);
    const face = (el) => ({ sad: el.querySelector('[data-part="sad"]'), angry: el.querySelector('[data-part="angry"]'), tear: el.querySelector('[data-part="tear"]') });
    const fS = face(pSitEl), fT = face(pStEl), fK = face(pKnEl);
    const maid = S.puppet(P.add(person(c, { ...LOOK.maid, holdF: `<g transform="translate(-2 6) scale(.42)">${oilLamp(c, { r: 90 })}</g>` })));
    const mLampFl = maid.el.querySelector('.flame');

    // effects: bubbles, marks, the memory
    const fx = S.layer({ par: R.P, sh: 4 });
    const halo = (x, y) => `<g transform="translate(${x} ${y})"><circle cy="-6" r="14" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(0, -6, 8, 12), 0.2, 3)}" fill="${C.halo}"/><path d="${c.cut(c.circ(0, -5, 5, 10), 0.2, 3)}" fill="${C.skin}"/><path d="${c.cut([[-6, 12], [-5, 0], [5, 0], [6, 12]], 0.2, 3)}" fill="${C.linen}"/></g>`;
    const accuse1 = fx.add(`<g>${speech(c, `${halo(-14, 4)}<g transform="translate(14 4)"><path d="${c.cut(c.circ(0, -5, 5.5, 10), 0.2, 3)}" fill="${C.skin2}"/><path d="${c.cut([[-6, 12], [-5, 0], [5, 0], [6, 12]], 0.2, 3)}" fill="${C.dustyBlue}"/></g>`, { w: 70, h: 50, flip: true })}</g>`);
    const no = () => `<path d="${c.ribbon([[-14, -14], [14, 14]], 5) + c.ribbon([[14, -14], [-14, 14]], 5)}" fill="${C.terracotta}"/>`;
    const deny1 = fx.add(`<g>${speech(c, `<g transform="translate(-10 0)">${no()}</g><g transform="translate(18 0) scale(.9)">${GLYPH.q(c)}</g>`, { w: 70, h: 48 })}</g>`);
    const accuse2 = fx.add(`<g>${speech(c, `<g transform="translate(0 4)"><path d="${c.cut([[-18, 12], [-14, -4], [-4, -8], [2, 0], [12, -6], [18, 12]], 0.3, 3)}" fill="${C.dustyBlue}"/></g><g transform="translate(-24 -16) scale(.6)">${GLYPH.bang(c)}</g>`, { w: 64, h: 46, flip: true })}</g>`);
    const deny2 = fx.add(`<g>${speech(c, no(), { w: 50, h: 44 })}</g>`);
    const b = boat(c);
    const galilee = fx.add(`<g>${speech(c, `<path d="${c.cut(c.ell(0, 10, 34, 8, 16), 0.3, 3)}" fill="${C.lake}"/><g transform="translate(0 12) scale(.16)">${b.back}${b.front}</g>`, { w: 90, h: 56, flip: true })}</g>`);
    const swear = fx.add(`<g>${say(c, tr('Nie znam tego człowieka!', 'I don’t know this man!'), { size: 18, side: 1, fill: mix(C.cream, C.storm, 0.35) })}</g>`);
    const marks = hanging(fx, `${sheet().p(c.cut(c.rect(-50, 0, 100, 52), 0.5, 6), C.cream).out()}${[0, 1, 2].map((i) => `<g class="mk" transform="translate(${-16 + i * 16} 42)">${tally(c, 1, C.ink, 30)}</g>`).join('')}`, { x: 0, y: 0, len: 700 });
    const mks = Array.from(marks.querySelectorAll('.mk'));
    // the memory: a sepia oval — Him and Peter under the moon, the rooster, three marks
    const memClip = S.id('mem');
    const memJ = person(c, CAST.jesus), memP = person(c, TW.peter);
    const memory = hanging(fx, `${sheet().p(c.cut(c.ell(0, 0, 150, 100, 40), 0.6, 6), SEPIA.wall2).out()}<defs><clipPath id="${memClip}"><ellipse cx="0" cy="0" rx="138" ry="90"/></clipPath></defs><g clip-path="url(#${memClip})"><rect x="-150" y="-100" width="300" height="200" fill="${mix(C.parchment, C.duskViolet, 0.35)}"/><circle cx="90" cy="-50" r="18" fill="${C.moon}"/><path d="${c.cut([[-160, 100], [-160, 50], [0, 40], [160, 52], [160, 100]], 1, 10)}" fill="${mix(C.sage, C.parchment, 0.4)}"/><g transform="translate(-30 64) scale(.5)">${memJ}</g><g transform="translate(40 66) scale(.48) scale(-1 1)">${memP}</g><g transform="translate(-100 -14) scale(.42)">${rooster(c)}</g></g><path d="${c.ribbon(c.ell(0, 0, 144, 95, 44).concat([c.ell(0, 0, 144, 95, 44)[0]]), 5)}" fill="${C.wood3}"/>`, { x: 0, y: 0, len: 800 });
    const tears = [0, 1, 2, 3].map((i) => fx.add(`<g><path d="${c.cut([[0, -5], [3, 1], [0, 4], [-3, 1]], 0.1, 2)}" fill="#bfe0ee"/></g>`));

    return (t, time) => {
      const T = time;
      const dawn = es(t, 8.9, 11.5);
      R.sky.blend(NIGHT, DAWN, dawn);
      R.stars.fade(1 - dawn * 0.8);
      dawnL.fade(dawn * 0.7);
      R.hallLamps.forEach((l, i) => { swing(l.el, l.x, l.y, T, 0.8, 0.7, i); pose(l.fl, { x: 26, y: 36, sx: 1 + Math.sin(T * 7 + i) * 0.08, sy: 1 + Math.sin(T * 5.3 + i) * 0.1 }); });
      const ember = es(t, 10.9, 11.8);
      Y.tongues.forEach((tg, i) => pose(tg, { x: [-30, 22, -8, 14, -22, 2][i], y: -16, sy: (1 - ember * 0.75) * (0.85 + Math.sin(T * (6 + i) + i) * 0.15), sx: 1 + Math.sin(T * 5 + i * 2) * 0.06 }));
      Y.glowL.fade((0.85 + Math.sin(T * 4) * 0.08) * (1 - ember * 0.6));
      jesus.set({ x: 730, y: HALL, s: 0.72, flip: true, armF: 24, armB: 14, head: 12 - es(t, 8.1, 8.4) * 14, blink: blinkAt(T) });
      fade(jSad, 0.8);

      /* the maid comes; looks; speaks; follows him to the porch; speaks to the bystanders */
      const mK = [[-0.4, [880, YARD]], [0.8, [FIRE - 20, YARD]], [4.05, [FIRE - 20, YARD]], [4.7, [GATE + 150, YARD]], [10.9, [GATE + 150, YARD]], [11.5, [GATE + 480, YARD]]];
      const [mx, my] = kf(t, mK, ease.sine);
      const look = es(t, 1.05, 1.3) * (1 - es(t, 2.9, 3.05));
      const point1 = es(t, 2.05, 2.25) * (1 - es(t, 2.95, 3.1));
      const point2 = es(t, 5.05, 5.25) * (1 - es(t, 5.9, 6.05));
      const mArm = 50 + look * 50 + point1 * 30 + point2 * 20;
      maid.set({ x: mx, y: my, s: 0.84, flip: t < 10.9, o: 1 - es(t, 11.2, 11.5), walk: moving(t, mK, 1) ? mx * 0.05 : undefined, armF: mArm, armB: point2 * 90, head: -look * 6 + look * Math.sin(T * 1.2) * 2, lean: look * 8, blink: blinkAt(T, 8) });
      pose(mLampFl, { x: 35, y: -16, sy: 1 + Math.sin(T * 7) * 0.1 });

      /* Peter: at the fire; stands; to the porch; swears; kneels and weeps */
      const up = es(t, 3.05, 3.12);
      const pK = [[3.1, [FIRE - 108, YARD]], [4.05, [FIRE - 108, YARD]], [4.7, [GATE + 20, YARD + 8]]];
      const [px, py] = kf(t, pK, ease.sine);
      const deny1K = es(t, 3.1, 3.3) * (1 - es(t, 3.9, 4.05));
      const deny2K = es(t, 6.05, 6.25) * (1 - es(t, 6.9, 7.05));
      const swearK = es(t, 8.05, 8.3) * (1 - es(t, 8.95, 9.1));
      const hear = es(t, 9.05, 9.2);
      const remember = es(t, 10.05, 10.3);
      const weep = es(t, 11.05, 11.12);
      pSit.set({ x: FIRE - 108, y: YARD + 6, s: 0.86, flip: false, o: 1 - up, armF: 70 - look * 20, armB: 50 - look * 20, head: 8 - look * 14, lean: -look * 4, blink: blinkAt(T, 3) });
      fade(fS.sad, look);
      pSt.set({
        x: px, y: py, s: 0.86, flip: t > 4.05 && t < 4.75 ? true : t > 4.75, o: up * (1 - weep), walk: moving(t, pK, 1) ? px * 0.05 : undefined,
        armF: 20 + deny1K * 60 + deny2K * 70 + swearK * 40 + bump(t, 7.2, 7.9) * 20, armB: deny1K * 50 + deny2K * 90 + swearK * 150, head: -deny1K * 6 * Math.sin(T * 8) - deny2K * 8 * Math.sin(T * 9) - swearK * 8 + hear * 20 * (1 - remember) + remember * 14,
        lean: swearK * -6 + remember * 6, blink: blinkAt(T, 3),
      });
      fade(fT.angry, swearK + deny2K * 0.6);
      fade(fT.sad, remember);
      pKn.set({ x: px - 10, y: py + 4, s: 0.86, flip: true, o: weep, armF: 64, armB: 40, head: 34, lean: 36 + Math.sin(T * 2.6) * 2 * (T ? 1 : 0), bob: Math.abs(Math.sin(T * 2.6)) * -2, blink: 0 });
      fade(fK.sad, 1);
      fade(fK.tear, 1);
      const [khx, khy] = headAt(px - 10, py + 4, 0.86, true, 46);
      tears.forEach((d, i) => {
        const k = ((T * 0.6 + i / 4) % 1);
        vis(d, { x: px - 10 - 70 + (i % 2 ? -7 : 6), y: py - 62 + k * 56, s: 1.3, o: weep * (1 - k) * (T ? 1 : (i === 0 ? 1 : 0)) });
      });

      /* the bystanders: at the fire; they rise and gather at the porch */
      BY.forEach((d) => {
        const rise = es(t, 5.1 + d.i * 0.08, 5.18 + d.i * 0.08);
        const bK = [[5.15 + d.i * 0.08, [d.x, YARD]], [5.8 + d.i * 0.08, [GATE + 190 + d.i * 55, YARD]], [10.9, [GATE + 190 + d.i * 55, YARD]], [11.5, [GATE + 520 + d.i * 70, YARD]]];
        const [bx, by] = kf(t, bK, ease.sine);
        const talk = d.i === 0 ? es(t, 7.05, 7.3) * (1 - es(t, 7.9, 8.05)) : bump(t, 7.1 + d.i * 0.1, 7.9);
        d.sit.set({ x: d.x, y: YARD + 8, s: 0.84, flip: true, o: 1 - rise, armF: 64, armB: 40, head: 6 - look * 10, blink: blinkAt(T, d.seed) });
        d.stand.set({ x: bx, y: by, s: 0.84, flip: t < 10.9, o: rise * (1 - es(t, 11.2, 11.6)), walk: moving(t, bK, 1) ? bx * 0.05 : undefined, armF: 20 + talk * 70, armB: talk * 30, head: -talk * 6, blink: blinkAt(T, d.seed) });
      });

      /* the rooster: first crow (v68b), second crow (v72a) */
      const crowA = bump(t, 4.35, 4.85), crowB = bump(t, 9.1, 9.7);
      const crow = Math.max(crowA, crowB);
      vis(roEl, { x: ROO.x, y: ROO.y, s: 0.9, o: 1 });
      pose(roHead, { x: 16, y: -58, r: -crow * 28, ox: 16, oy: -58 });
      pose(beakL, { x: 33, y: -79, r: crow * 22, ox: 33, oy: -79 });
      cry(ROO.x + 40, ROO.y - 80, crow, T, { spread: 2.8 });

      /* bubbles */
      const [mhx, mhy] = headAt(mx, my, 0.84, true);
      const a1 = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.0));
      vis(accuse1, { x: mhx - 14, y: mhy - 20, s: a1, o: a1 > 0.01 ? 1 : 0 });
      const [phx, phy] = headAt(px, py, 0.86, t > 4.05);
      const d1 = es(t, 3.2, 3.4, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(deny1, { x: headAt(FIRE - 108, YARD, 0.86, false)[0] + 20, y: phy - 24, s: d1, o: d1 > 0.01 ? 1 : 0 });
      const a2 = es(t, 5.2, 5.4, ease.back) * (1 - es(t, 5.9, 6.0));
      vis(accuse2, { x: mhx - 14, y: mhy - 20, s: a2, o: a2 > 0.01 ? 1 : 0 });
      const d2 = es(t, 6.15, 6.35, ease.back) * (1 - es(t, 6.9, 7.0));
      vis(deny2, { x: phx + 20, y: phy - 24, s: d2, o: d2 > 0.01 ? 1 : 0 });
      const [bhx, bhy] = headAt(GATE + 190, YARD, 0.84, true);
      const g1 = es(t, 7.2, 7.4, ease.back) * (1 - es(t, 7.9, 8.0));
      vis(galilee, { x: bhx - 10, y: bhy - 20, s: g1, o: g1 > 0.01 ? 1 : 0 });
      const sw = es(t, 8.15, 8.35, ease.back) * (1 - es(t, 8.9, 9.0));
      vis(swear, { x: phx + 20, y: phy - 20, s: sw, o: sw > 0.01 ? 1 : 0, r: Math.sin(T * 12) * 1.5 * sw });
      // the three marks, one per denial
      const mIn = es(t, 3.1, 3.4, ease.out) * (1 - es(t, 4.3, 4.6)) + es(t, 6.1, 6.4, ease.out) * (1 - es(t, 6.9, 7.1)) + es(t, 8.1, 8.4, ease.out) * (1 - es(t, 9.9, 10.1));
      const mX = t < 5 ? FIRE - 60 : GATE + 170;
      vis(marks, { x: mX, y: 330 - (1 - Math.min(1, mIn)) * 700, r: Math.sin(T) * 2, o: mIn > 0.01 ? 1 : 0 });
      mks.forEach((m, i) => fade(m, [es(t, 3.3, 3.4), es(t, 6.3, 6.4), es(t, 8.3, 8.4)][i]));
      // the memory
      const memK = es(t, 10.05, 10.4, ease.out) * (1 - es(t, 10.9, 11.15, ease.in));
      vis(memory, { x: GATE + 330, y: 420 - (1 - memK) * 700, r: Math.sin(T * 0.7) * 1.5, o: memK > 0.01 ? 1 : 0 });

      /* camera: the courtyard; a look up at Him when Peter swears; the dawn at the end */
      S.cam.x = kf(t, [[-0.5, -500], [0.9, -680], [4.05, -680], [4.7, -920], [7.9, -920], [8.2, -860], [8.9, -860], [9.3, -940], [10.9, -1000], [11.3, -1160], [11.8, -1180]]);
      S.cam.y = kf(t, [[-0.5, 200], [0.9, 290], [4.05, 290], [4.7, 280], [7.9, 280], [8.2, 60], [8.9, 60], [9.3, 250], [10.9, 280], [11.3, 300], [11.8, 310]]);
      S.cam.z = kf(t, [[-0.5, 1.4], [0.9, 1.56], [1.2, 1.7], [2.9, 1.66], [4.05, 1.56], [4.7, 1.5], [7.9, 1.6], [8.2, 1.14], [8.9, 1.14], [9.3, 1.5], [10.9, 1.6], [11.3, 1.95], [11.8, 2.1]]);
    };
  },
};
