// Mk 14,60–65 — the high priest rises into the middle: "Have you no answer?" — He is silent; the lamps hold still.
// "Are you the Christ, the Son of the Blessed?" — "I am": light breaks out around Him, and a vision is lowered from
// the flies: the throne of Power, the Son of Man at its right hand, the clouds rolling in. The high priest tears his
// robe (a paper tear); "blasphemy" — all condemn Him, a seal is pressed, a lamp goes out. Then a cloth comes down
// over the hall: we see only shadows on it — a covered face, raised hands, "Prophesy!" — and the lamp behind it flickering.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  palace, TW, kf, moving, hand, headAt, withFace, faceBits, priest, highPriest, HP, scribe, guardOpts, man, cord, speech, say, GLYPH, question,
  glory, seal, crookedScroll, shadowPerson, silhouette, heavenPanel, PI,
vis, } from './lib.js';

const INK = '#2b2138';

export default {
  id: 'm14-iam',
  beats: [
    { v: 60 },
    { v: 61, text: 'Lecz On milczał i nic nie odpowiedział.' },
    { v: 61, cont: true, text: 'Najwyższy kapłan zapytał Go ponownie: «Czy Ty jesteś Mesjasz, Syn Błogosławionego?»' },
    { v: 62, text: 'Jezus odpowiedział: «Ja jestem.' },
    { v: 62, cont: true, text: 'Ujrzycie Syna Człowieczego, siedzącego po prawicy Wszechmocnego i nadchodzącego z obłokami niebieskimi».' },
    { v: 63, text: 'Wówczas najwyższy kapłan rozdarł swoje szaty' },
    { v: 63, cont: true, text: 'i rzekł: «Na cóż nam jeszcze potrzeba świadków?' },
    { v: 64, text: 'Słyszeliście bluźnierstwo. Cóż wam się zdaje?»' },
    { v: 64, cont: true, text: 'Oni zaś wszyscy wydali wyrok, że winien jest śmierci.' },
    { v: 65, text: 'I niektórzy zaczęli pluć na Niego; zakrywali Mu twarz, policzkowali Go i mówili: «Prorokuj!»' },
    { v: 65, cont: true, text: 'Także słudzy bili Go pięściami po twarzy.' },
  ],
  cam: { x: [-100, 500], y: [-460, 100], z: [1, 1.8] },
  build(S) {
    const c = S.c;
    const R = palace(S);
    const { HALL, YARD, SEATX } = R;
    const JX = 1030;

    // the light of "I am" is a sheet behind the people in the hall (it used to be laid over Him)
    const glowL = S.layer({ par: R.P, sh: 0, flat: true });
    const hallL = S.layer({ par: R.P, sh: 5 });
    const burst = glowL.add(`<g><circle r="150" fill="url(#halo-glow)"/><g opacity=".4">${glory(c, 200, 22)}</g></g>`);
    // (phone: the two beyond the high priest's seat would only show as slivers under the thread, so they are left out)
    const COUNCIL = [
      { m: () => scribe(c, 0), x: 680 }, { m: () => priest(c, 1), x: 738 }, { m: () => scribe(c, 3), x: 796 },
      { m: () => priest(c, 3), x: 1310, flip: true }, { m: () => scribe(c, 2), x: 1375, flip: true },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(hallL.add(d.m())), s: 0.7 }));
    const WIT = [0, 1].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(hallL.add(person(c, man(c)))) }));
    const hpSit = S.puppet(hallL.add(highPriest(c, { pose: 'sit' })));
    const hpEl = hallL.add(withFace(highPriest(c), faceBits(c)));
    const hp = S.puppet(hpEl);
    const hpAngry = hpEl.querySelector('[data-part="angry"]');
    const jEl = hallL.add(withFace(person(c, { ...CAST.jesus, holdF: cord(c) }), faceBits(c)));
    const jesus = S.puppet(jEl);
    const jSad = jEl.querySelector('[data-part="sad"]');
    // the torn robe: two halves of the high priest's mantle front, torn apart at the chest
    const tearL = S.layer({ par: R.P, sh: 3 });
    const tear = (() => {
      const edge = [[0, 0], [3, 10], [-3, 20], [4, 30], [-2, 42], [3, 54], [-3, 66], [2, 78]];
      const L = sheet().p(c.poly([[-18, 0], ...edge, [-20, 78], [-24, 40]]), shade(HP.mantle, 0.05)).x(c.ribbon(edge, 1.6), C.linen).out();
      const Rr = sheet().p(c.poly([...edge, [22, 78], [24, 40], [18, 0]]), shade(HP.mantle, 0.05)).x(c.ribbon(edge, 1.6), C.linen).out();
      const bits = [0, 1, 2, 3].map((i) => tearL.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 6, 4, 7, 0.4), 0.8, 3), shade(HP.mantle, 0.05)).out()}</g>`));
      return { l: tearL.add(`<g>${L}</g>`), r: tearL.add(`<g>${Rr}</g>`), bits };
    })();
    R.yard();
    R.porch();

    const fx = S.layer({ par: R.P, sh: 4 });
    const q1 = fx.add(`<g>${speech(c, `<g transform="translate(-12 0)">${GLYPH.q(c)}</g><path d="${c.ribbon([[6, -8], [20, -8]], 2) + c.ribbon([[6, 0], [24, 0]], 2) + c.ribbon([[6, 8], [16, 8]], 2)}" fill="${C.inkSoft}" opacity=".6"/>`, { w: 64, h: 46, flip: true })}</g>`);
    const hush = fx.add(`<g>${speech(c, `<path d="${c.poly(c.circ(-12, 0, 3, 8)) + c.poly(c.circ(0, 0, 3, 8)) + c.poly(c.circ(12, 0, 3, 8))}" fill="${C.stone2}"/>`, { w: 52, h: 32, fill: mix(C.cream, C.stone, 0.3) })}</g>`);
    const q2 = fx.add(`<g>${speech(c, `<g transform="translate(-14 4)"><circle cy="-6" r="16" fill="url(#halo-glow)"/><path d="${c.cut(c.star(0, -6, 12, 5, 5, -PI / 2), 0.2, 3)}" fill="${C.sun}"/></g><g transform="translate(16 0)">${GLYPH.q(c)}</g>`, { w: 76, h: 52, flip: true })}</g>`);
    const iam = fx.add(`<g>${say(c, tr('Ja jestem', 'I am'), { size: 24, side: 1 })}</g>`);
    // the vision
    const PW = 520, PH = 250;
    const visClip = S.id('vis');
    const throne = (() => {
      const s = sheet();
      s.p(c.cut([[-46, 0], [-46, -90], [-30, -110], [30, -110], [46, -90], [46, 0]], 0.5, 6), C.sun);
      s.p(c.cut(c.rect(-56, -40, 112, 16), 0.3, 6), shade(C.sun, -0.15));
      return `<circle cy="-60" r="120" fill="url(#halo-glow)"/>${s.out()}`;
    })();
    const sonM = `<g transform="translate(96 -2) scale(.46)">${person(c, { ...CAST.jesus, pose: 'sit' })}</g>`;
    const visionEl = hanging(fx, `${sheet().p(c.cut(c.rect(-PW / 2 - 10, -10, PW + 20, PH + 20), 0.6, 8), C.wood2).out()}<defs><clipPath id="${visClip}"><rect x="${-PW / 2}" y="0" width="${PW}" height="${PH}"/></clipPath></defs><g clip-path="url(#${visClip})"><rect x="${-PW / 2}" y="0" width="${PW}" height="${PH}" fill="${C.night}"/>${heavenPanel(c, PW, PH + 30)}<g transform="translate(-20 ${PH - 40})">${throne}${sonM}</g><g data-k="clL">${cloud(c, 220)}</g><g data-k="clR">${cloud(c, 240)}</g><g data-k="clM">${cloud(c, 180)}</g></g>`, { x: JX, y: 110, len: 800 });
    const clL = S.$('clL'), clR = S.$('clR'), clM = S.$('clM');
    // the verdict
    const verdict = fx.add(`<g>${crookedScroll(c, 90, 56)}</g>`);
    const stamp = fx.add(`<g>${seal(c, 20)}</g>`);

    // the cloth that comes down over the hall — shadows on it
    const SW = 760, SH2 = 280;
    const scrClip = S.id('scr');
    const pts = [[-SW / 2, 0], [SW / 2, 0], [SW / 2, SH2]];
    for (let x = SW / 2; x > -SW / 2; x -= 38) pts.push(...c.arc(x - 19, SH2, 19, 10, 0, PI, 4));
    const clothShape = c.cut(pts, 0.8, 10);
    const sj = `<g data-k="sj">${shadowPerson(c, { ...CAST.jesus, pose: 'sit' }, INK)}</g>`;
    const drape = `<g data-k="drape"><path d="${c.cut([[-24, -40], [0, -48], [24, -40], [30, -10], [26, 20], [-26, 20], [-30, -10]], 0.8, 5)}" fill="#4a3d5c"/></g>`;
    const mockers = [0, 1, 2, 3, 4].map((i) => `<g data-k="sm${i}">${shadowPerson(c, guardOpts(c), INK)}</g>`).join('');
    const scr = hanging(fx, `<g clip-path="url(#${scrClip})"><defs><clipPath id="${scrClip}"><path d="${clothShape}"/></clipPath></defs><path d="${clothShape}" fill="#efd7ad"/><circle data-k="sglow" cx="0" cy="${SH2 * 0.55}" r="${SW * 0.55}" fill="url(#warm-glow)" opacity=".8"/>${mockers}${sj}${drape}<path d="${c.cut(c.rect(-SW / 2, SH2 - 26, SW, 40), 0.6, 10)}" fill="#3a2d46" opacity=".5"/></g><path d="${c.ribbon([[-SW / 2 - 8, 2], [SW / 2 + 8, 2]], 9)}" fill="${C.wood2}"/>`, { x: JX - 20, y: 100, len: 800 });
    const sjP = S.puppet(S.$('sj').firstElementChild), drapeEl = S.$('drape'), sGlow = S.$('sglow');
    const smP = [0, 1, 2, 3, 4].map((i) => S.puppet(S.$('sm' + i).firstElementChild));
    const prophesy = [0, 1].map((i) => fx.add(`<g>${say(c, tr('Prorokuj!', 'Prophesy!'), { size: 20, side: i ? -1 : 1, jag: true })}</g>`));

    return (t, time) => {
      const T = time;
      swing(R.moon, 380, 150, T, 1, 0.6);
      const silence = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.05));
      R.hallLamps.forEach((l, i) => {
        swing(l.el, l.x, l.y, T * (1 - silence), 0.8, 0.7, i);
        const out = i === 1 ? es(t, 8.4, 8.7) : 0;
        pose(l.fl, { x: 26, y: 36, s: 1 - out, sx: (1 - out) * (1 + Math.sin(T * 7 + i) * 0.08 * (1 - silence)), sy: (1 - out) * (1 + Math.sin(T * 5.3 + i) * 0.1 * (1 - silence)) });
        fade(l.gl, 0.8 * (1 - out));
      });

      /* v60 — the high priest stands up into the middle */
      const rise = es(t, 0.05, 0.12);
      const hpK = [[0.1, [SEATX, HALL]], [0.6, [JX + 100, HALL]], [5.9, [JX + 100, HALL]], [6.3, [JX + 150, HALL]]];
      const [hx, hy] = kf(t, hpK, ease.sine);
      const torn = es(t, 5.1, 5.35);
      const toCouncil = es(t, 7.05, 7.3);
      hpSit.set({ x: SEATX, y: HALL - 16, s: 0.74, flip: true, o: 1 - rise, armF: 30, blink: blinkAt(T, 3) });
      hp.set({
        x: hx, y: hy, s: 0.76, flip: toCouncil < 0.5, o: rise, walk: moving(t, hpK, 1) ? hx * 0.05 : undefined,
        armF: 20 + bump(t, 0.5, 1.0) * 60 + es(t, 2.05, 2.3) * 40 * (1 - es(t, 2.9, 3.05)) + torn * 50 * (1 - es(t, 5.6, 5.9)) + bump(t, 6.05, 6.9) * 60 + toCouncil * 50,
        armB: 10 + torn * 90 * (1 - es(t, 5.6, 5.9)) + toCouncil * 100 * (1 - es(t, 8.05, 8.3)) + bump(t, 6.05, 6.9) * 30,
        head: -bump(t, 2.05, 2.9) * 6 + torn * 8 * (1 - toCouncil), lean: -torn * 6 * (1 - es(t, 5.6, 5.9)) + bump(t, 2.1, 2.9) * 6, blink: blinkAt(T, 3),
      });
      fade(hpAngry, es(t, 5.05, 5.3));
      // the tear across his chest
      const [chx, chy] = [hx + (toCouncil < 0.5 ? -6 : 6) * 0.76, hy - 138 * 0.76];
      vis(tear.l, { x: chx - torn * 12, y: chy, s: 1.05, r: -torn * 22, o: rise > 0.5 ? torn > 0.01 ? 1 : 0 : 0 });
      vis(tear.r, { x: chx + torn * 12, y: chy, s: 1.05, r: torn * 22, o: rise > 0.5 ? torn > 0.01 ? 1 : 0 : 0 });
      tear.bits.forEach((b, i) => {
        const k = es(t, 5.15 + i * 0.04, 5.8 + i * 0.04);
        vis(b, { x: chx + (i - 1.5) * 18 + k * (i - 1.5) * 30, y: chy + 20 + k * 150 - Math.sin(k * PI) * 40, r: k * 300 * (i % 2 ? 1 : -1), o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* Jesus: silent; "I am" */
      const iamK = es(t, 3.05, 3.3);
      const vision = es(t, 4.05, 4.4) * (1 - es(t, 4.95, 5.15));
      jesus.set({ x: JX, y: HALL, s: 0.76, flip: false, armF: 24, armB: 14 + iamK * 10 * (1 - es(t, 5.05, 5.3)), head: 12 * (1 - iamK) - iamK * 8 * (1 - es(t, 5.05, 5.4)) + es(t, 9.05, 9.5) * 14, blink: silence ? 0 : blinkAt(T) });
      fade(jSad, es(t, 8.05, 8.4));
      const glow = iamK * (1 - es(t, 4.95, 5.2));
      vis(burst, { x: JX + 2, y: HALL - 128, s: 0.4 + glow * 0.6, r: T * 3, o: glow });

      /* the council, the witnesses */
      const condemn = es(t, 8.05, 8.35);
      COUNCIL.forEach((m) => {
        const shock = es(t, 3.1, 3.4);
        // phone: when they condemn Him, the three on the left step in from the edge of the screen
        const step = S.portrait && m.x < 1000 ? es(t, 7.1, 7.6) * 90 : 0;
        m.p.set({ x: m.x + step, y: HALL, walk: step > 0 && step < 90 ? (m.x + step) * 0.05 : undefined, s: m.s, flip: !!m.flip, o: S.portrait && m.x > 1250 ? 0 : 1, armF: 16 + shock * 30 * (1 - condemn) + condemn * 60, armB: condemn * 150 + shock * 20 * (1 - condemn), head: 4 - shock * 6 - condemn * 6, lean: -shock * 4, blink: blinkAt(T, m.seed) });
      });
      WIT.forEach((w) => {
        const go = es(t, 6.2 + w.i * 0.08, 6.9 + w.i * 0.08);
        const x = lerp(866 + w.i * 40, 480, go);
        w.p.set({ x, y: HALL, s: 0.7, flip: go > 0.02, o: 1 - es(t, 6.75, 6.95), walk: go > 0 && go < 1 ? x * 0.05 : undefined, armF: 20, blink: blinkAt(T, w.seed) });
      });

      /* bubbles */
      const [bx, by] = headAt(hx, hy, 0.76, true);
      const b1 = es(t, 0.45, 0.65, ease.back) * (1 - es(t, 0.95, 1.05));
      vis(q1, { x: bx - 16, y: by - 20, s: b1, o: b1 > 0.01 ? 1 : 0 });
      const [jhx, jhy] = headAt(JX, HALL, 0.76, false);
      const b2 = es(t, 1.2, 1.4, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(hush, { x: jhx + 10, y: jhy - 30, s: b2, o: b2 > 0.01 ? 0.8 : 0 });
      const b3 = es(t, 2.3, 2.5, ease.back) * (1 - es(t, 2.95, 3.05));
      vis(q2, { x: bx - 16, y: by - 20, s: b3, o: b3 > 0.01 ? 1 : 0 });
      const b4 = es(t, 3.15, 3.35, ease.back) * (1 - es(t, 3.9, 4.05));
      vis(iam, { x: jhx + 8, y: jhy - 30, s: b4, o: b4 > 0.01 ? 1 : 0 });
      // the vision comes down from the flies
      // phone: the vision a little to the left and smaller, so its frame is clear of the progress thread
      vis(visionEl, { x: S.portrait ? JX - 25 : JX, y: 70 - (1 - vision) * 700, s: S.portrait ? 0.94 : 1, r: Math.sin(T * 0.6) * 1, o: vision > 0.01 ? 1 : 0 });
      const roll = es(t, 4.1, 4.9);
      const bobV = vision > 0.01 ? 1 : 0;
      pose(clL, { x: lerp(-PW / 2 - 200, -150, roll), y: PH - 6 + Math.sin(T * 0.8) * 3 * bobV });
      pose(clR, { x: lerp(PW / 2 + 200, 170, roll), y: PH - 16 + Math.sin(T * 0.7 + 1) * 3 * bobV });
      pose(clM, { x: lerp(0, 30, roll), y: lerp(PH + 120, PH + 10, roll) });
      // the verdict
      const vIn = es(t, 8.1, 8.35, ease.back) * (1 - es(t, 8.9, 9.05));
      vis(verdict, { x: 900, y: 200, s: vIn * 1.2, o: vIn > 0.01 ? 1 : 0 });
      const st = es(t, 8.35, 8.45);
      vis(stamp, { x: 900, y: 200 - (1 - st) * 40, s: 1.2 + (1 - st) * 0.8, r: -12, o: vIn > 0.01 && st > 0.01 ? 1 : 0 });

      /* v65 — the cloth comes down; shadows on it */
      const down = es(t, 9.05, 9.45, ease.out);
      vis(scr, { x: JX - 20, y: 96 - (1 - down) * 700, o: down > 0.01 ? 1 : 0 });
      const cover = es(t, 9.4, 9.6);
      sjP.set({ x: 0, y: 250, s: 0.8, flip: false, head: 14, armF: 24, armB: 14 });
      vis(drapeEl, { x: 2, y: 250 - (167 - 62) * 0.8 - 6 - (1 - cover) * 60, s: 0.8, o: cover });
      smP.forEach((p, i) => {
        const side = i % 2 ? 1 : -1;
        const x0 = side * (90 + Math.floor(i / 2) * 90);
        const hit = i < 3 ? bump(t, 9.5 + i * 0.12, 9.85 + i * 0.12) : bump(t, 10.2 + (i - 3) * 0.15, 10.55 + (i - 3) * 0.15);
        const on = i < 3 ? es(t, 9.2, 9.4) : es(t, 10.05, 10.25);
        p.set({ x: x0 * 1.1, y: 262, s: 0.84, flip: side > 0, o: on, armF: 30 + hit * 90, armB: 20 + hit * 60, lean: hit * 8, head: -hit * 6 });
      });
      fade(sGlow, 0.8 - bump(t, 10.1, 10.9) * 0.3 * (0.5 + 0.5 * Math.sin(T * 9)));
      prophesy.forEach((p, i) => {
        const k = es(t, 9.55 + i * 0.2, 9.75 + i * 0.2, ease.back) * (1 - es(t, 10.9, 11.05));
        vis(p, { x: JX - 20 + (i ? 140 : -150), y: 160 + i * 20, s: k * 0.9, r: i ? 6 : -6, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, 400], [0.6, 420], [2.9, 420], [3.3, 440], [4.05, 420], [4.4, 440], [5.05, 440], [5.3, 480], [6.0, 440], [9.0, 420]]);
      S.cam.y = kf(t, [[-0.5, -380], [0.6, -380], [2.9, -390], [3.3, -410], [4.05, -440], [4.9, -440], [5.05, -390], [9.0, -390], [9.4, -420]]);
      S.cam.z = kf(t, [[-0.5, 1.5], [0.6, 1.6], [1.1, 1.72], [2.0, 1.6], [3.1, 1.72], [4.05, 1.4], [4.9, 1.4], [5.05, 1.7], [5.5, 1.62], [7.0, 1.5], [9.0, 1.44], [9.4, 1.4]]);
    };
  },
};
