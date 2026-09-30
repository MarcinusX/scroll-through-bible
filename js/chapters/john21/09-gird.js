// J 21,18–19 — "Truly, truly: when you were young you girded yourself and walked where you would": a hanging picture
// frame — young Peter ties his own belt and strides off down the road. "But when you grow old you will stretch out
// your hands": a second frame — Peter white-haired, arms open wide; "and another will gird you and lead you where you
// do not wish" — a plain grey figure ties a cord round him and leads him along the road to a far city. Restraint: no
// more is shown. "This He said to show by what death he would glorify God": golden light pours into the second
// picture, a crown of light over the old man. The frames lift away; "Follow Me!" — Jesus turns to go along the shore,
// footprints of light appear on the sand, and Peter, staff in hand, follows.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  beachSet, ringFor, SEVEN, JESUS, PETER, PETER_OLD, OTHER, MORNING, pictureFrame, girdle, farWalls, lightSteps, lightCrown, speech, rayBurst,
  withFace, faceBits, skyKeys, kf, moving, headAt, vis, pose, fade, attr, person, sheet, shade, mix, C, lerp, blinkAt, tr, FONT, PI,
} from './lib.js';

const J0 = { x: 716, y: 694 }, P0 = { x: 894, y: 700 };
const FW = 300, FH = 190;
const SEPIA = (col) => mix(col, '#c9ae86', 0.35);
const YOUNG = { ...PETER, hair: C.hair2, beardColor: C.hair2, mantle: null, belt: null };

export default {
  id: 'j21-gird',
  beats: [
    { v: 18, text: 'Zaprawdę, zaprawdę, powiadam ci: Gdy byłeś młodszy, opasywałeś się sam i chodziłeś, gdzie chciałeś.' },
    { v: 18, cont: true, text: 'Ale gdy się zestarzejesz, wyciągniesz ręce swoje,' },
    { v: 18, cont: true, text: 'a inny cię opasze i poprowadzi, dokąd nie chcesz».' },
    { v: 19, text: 'To powiedział, aby zaznaczyć, jaką śmiercią uwielbi Boga.' },
    { v: 19, cont: true, text: 'A wypowiedziawszy to rzekł do niego: «Pójdź za Mną!»' },
  ],
  cam: { x: [-40, 200], y: [-80, 160], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const PT = S.portrait;
    const BS = beachSet(S, { skyCols: MORNING, sunY: 170, deferFire: true, fishOn: false });
    const { K } = BS;
    const PL = S.layer({ par: 0.55, sh: 5 });
    const sitters = SEVEN.filter((m) => m.k !== 'peter').map((m) => ({ ...m, ...ringFor(S)[m.k], seed: c.rr(0, 9) }));
    sitters.sort((a, b) => a.y - b.y).forEach((m) => { m.p = S.puppet(PL.add(person(c, { ...m.o, pose: 'sit' }))); });
    BS.makeFire();

    /* footprints of light along the shore (to the right) */
    const stepsL = S.layer({ par: 0.58, sh: 0, flat: true });
    const STEP_PTS = [[780, 752], [920, 756], [1060, 754], [1200, 750], [1340, 746]];
    const steps = Array.from(stepsL.add(`<g>${lightSteps(c, STEP_PTS, { n: 12, s0: 1.6, s1: 1.4, col: mix(C.sun, C.sunDeep, 0.25) })}</g>`).querySelectorAll('[data-i]'));

    const QL = S.layer({ par: 0.6, sh: 5 });
    const staffM = `<g transform="rotate(20)">${sheet().p(c.ribbon([[0, -120], [1.5, 0], [0, 70]], 5.5), C.wood2).p(c.ribbon(c.arc(-10, -120, 10, 12, 0, -PI, 8), 5), C.wood2).out()}</g>`;
    const peter = S.puppet(QL.add(withFace(person(c, { ...PETER, holdF: staffM }), faceBits(c))));
    const jesus = S.puppet(QL.add(person(c, JESUS)));

    /* the two pictures */
    const hangL = S.layer({ par: 0.5, sh: 5 });
    const id1 = S.id('f1'), id2 = S.id('f2');
    S.defs(`<clipPath id="${id1}"><rect x="${-FW / 2}" y="0" width="${FW}" height="${FH}"/></clipPath><clipPath id="${id2}"><rect x="${-FW / 2}" y="0" width="${FW}" height="${FH}"/></clipPath>`);
    const land = (rd) => sheet().p(c.cut([[0, FH * 0.62], [FW * 0.3, FH * 0.56], [FW * 0.7, FH * 0.6], [FW, FH * 0.55], [FW, FH], [0, FH]], 0.6, 8), SEPIA(C.hillNear)).p(c.ribbon(rd, (u) => 16 - u * 12), SEPIA(C.sand)).out();
    const road1 = [[40, FH], [120, FH * 0.8], [230, FH * 0.66], [300, FH * 0.6]];
    const road2 = [[20, FH], [120, FH * 0.82], [210, FH * 0.7], [262, FH * 0.6]];
    const f1inner = `<rect width="${FW}" height="${FH}" fill="${SEPIA(C.skyBlue)}"/>${land(road1)}<g data-k="y1"></g>`;
    const f2inner = `<rect width="${FW}" height="${FH}" fill="${SEPIA(mix(C.dusk, C.cream, 0.5))}"/><g transform="translate(262 ${FH * 0.6})">${farWalls(c, 0.55, SEPIA(C.stone2))}</g>${land(road2)}`;
    const frame1 = hangL.add(`<g>${pictureFrame(c, f1inner, { w: FW, h: FH, clipId: id1 })}</g>`);
    const frame2 = hangL.add(`<g>${pictureFrame(c, f2inner, { w: FW, h: FH, clipId: id2 })}</g>`);
    // puppets inside the pictures (added into the clipped groups)
    const in1 = frame1.querySelector(`[clip-path="url(#${id1})"] > g`);
    const in2 = frame2.querySelector(`[clip-path="url(#${id2})"] > g`);
    const addIn = (host, markup) => { host.insertAdjacentHTML('beforeend', markup); return host.lastElementChild; };
    const young = S.puppet(addIn(in1, person(c, { ...YOUNG, robe: SEPIA(YOUNG.robe) })));
    const youngBelt = S.puppet(addIn(in1, person(c, { ...YOUNG, robe: SEPIA(YOUNG.robe), belt: C.leather })));
    const beltPiece = addIn(in1, `<g>${girdle(c, C.leather, 50)}</g>`);
    const glowIn = addIn(in2, `<g>${rayBurst(c, { n: 16, r0: 30, r1: 260, spread: 0.05, o: 0.6 })}<circle r="120" fill="url(#halo-glow)"/></g>`);
    const other = S.puppet(addIn(in2, person(c, { ...OTHER, robe: SEPIA(OTHER.robe), mantle: SEPIA(OTHER.mantle) })));
    const cord = addIn(in2, `<path d="M0 0H1" stroke="${C.rope}" stroke-width="2.4" vector-effect="non-scaling-stroke" fill="none"/>`);
    const old = S.puppet(addIn(in2, person(c, { ...PETER_OLD, robe: SEPIA(PETER_OLD.robe), mantle: SEPIA(PETER_OLD.mantle) })));
    const oldGird = addIn(in2, `<g>${girdle(c, C.rope, 50)}</g>`);
    const crown = addIn(in2, `<g>${lightCrown(c, 22)}</g>`);

    const fx = S.layer({ par: 0.62, sh: 3 });
    const truly = fx.add(`<g>${speech(c, `<text x="0" y="6" text-anchor="middle" font-family="${FONT}" font-size="16" font-style="italic" fill="${C.ink}">${tr('Zaprawdę, zaprawdę…', 'Most certainly…')}</text>`, { w: 170, h: 44 })}</g>`);
    const follow = fx.add(`<g>${speech(c, `<text x="0" y="7" text-anchor="middle" font-family="${FONT}" font-size="21" font-style="italic" fill="${C.ink}">${tr('Pójdź za Mną!', 'Follow me!')}</text>`, { w: 160, h: 50, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      skyKeys(K.sk, t, [[0, MORNING], [5, MORNING]]);
      K.idle(T, { sunY: 170 - es(t, 0, 5) * 20 });
      pose(K.sunPath, { x: 1250, y: 450, o: 0.4 });
      BS.idle(T, 0.2, { breadO: 0.3, smokeO: 0.5 });
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: 0.9, flip: m.flip, armF: 24, armB: 14, head: -es(t, 4.1, 4.4) * 6, blink: blinkAt(T, m.seed) }));

      /* the frames */
      const f1k = es(t, 0.1, 0.45, ease.out) * (1 - es(t, 4.0, 4.3, ease.in));
      const f2k = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 4.05, 4.35, ease.in));
      vis(frame1, { x: PT ? lerp(700, 640, es(t, 1.05, 1.4)) : 620,   // phone: both pictures inside the narrow screen
        y: lerp(-500, 150, f1k), r: T ? Math.sin(T * 0.7) * 1 : 0, s: 1 - es(t, 1.05, 1.4) * 0.12, o: f1k > 0.01 ? 1 - es(t, 1.2, 1.5) * 0.35 : 0 });
      vis(frame2, { x: PT ? 962 : 980, y: lerp(-500, 150, f2k), r: T ? Math.sin(T * 0.7 + 2) * 1 : 0, o: f2k > 0.01 ? 1 : 0 });

      /* 1 — young: he girds himself and walks where he wants */
      const tie = es(t, 0.35, 0.55);
      const go = es(t, 0.6, 0.95);
      const [yx, yy] = [lerp(70, 250, go), lerp(FH * 0.93, FH * 0.66, go)];
      const ys = lerp(0.62, 0.36, go);
      young.set({ x: yx, y: yy, s: ys, o: 1 - seg(t, 0.53, 0.56), armF: 20 + bump(t, 0.3, 0.56) * 50, armB: 10 + bump(t, 0.3, 0.56) * 40, head: 6 });
      youngBelt.set({ x: yx, y: yy, s: ys, o: seg(t, 0.53, 0.56), walk: go > 0 && go < 1 ? go * 30 : undefined, armF: 14, head: -4 });
      pose(beltPiece, { x: yx + 2 * ys, y: yy - 96 * ys - (1 - tie) * 30 * ys, s: ys, o: tie < 0.99 && t > 0.3 ? 1 : 0 });

      /* 2 — old: hands stretched out; another girds him and leads him */
      const stretch = es(t, 1.35, 1.6);
      const gird = es(t, 2.1, 2.4);
      const lead = es(t, 2.45, 2.95);
      const ox = lerp(160, 222, lead), oy = lerp(FH * 0.93, FH * 0.74, lead), os = lerp(0.62, 0.42, lead);
      old.set({ x: ox, y: oy, s: os, flip: false, armF: 20 + stretch * 70, armB: -stretch * 70, head: -stretch * 6 + lead * 4, walk: lead > 0 && lead < 1 ? lead * 24 : undefined, amt: 0.5 });
      const ax = lerp(70, 200, gird) + lead * 60, ay = lerp(FH * 0.97, FH * 0.93, gird) - lead * 26;
      other.set({ x: lerp(ox - 70 * os, ox + 60 * os, gird) + lead * 20, y: oy + 4, s: os, flip: gird > 0.5 ? false : false, armF: 60 + bump(t, 2.1, 2.45) * 40, armB: 20, o: es(t, 2.05, 2.15), walk: lead > 0 && lead < 1 ? lead * 24 : undefined });
      void ax; void ay;
      pose(oldGird, { x: ox + 2 * os, y: oy - 96 * os, s: os, o: gird });
      const hx = ox + 30 * os, hy = oy - 98 * os, ex = ox + 60 * os + lead * 20 + 30 * os, ey = oy - 100 * os;
      pose(cord, { x: hx, y: hy, sx: Math.max(1, Math.hypot(ex - hx, ey - hy)), r: Math.atan2(ey - hy, ex - hx) * 180 / PI, o: lead > 0.02 ? 1 : 0 });

      /* v19a — the glory: light in the second picture, a crown of light */
      const gl = es(t, 3.05, 3.4);
      pose(glowIn, { x: ox, y: oy - 120 * os, s: 0.5 + gl * 0.5, r: T * 3, o: gl * 0.85 });
      pose(crown, { x: ox + 2 * os, y: oy - 214 * os, s: os * 1.4, o: es(t, 3.2, 3.5) });

      /* Jesus & Peter */
      const speak = bump(t, 0.05, 0.9);
      const followK = es(t, 4.1, 4.4);
      const jKeys = [[4.3, J0.x], [5.0, 1120]];
      const jx = kf(t, jKeys);
      const pKeys = [[4.62, P0.x], [5.0, 990]];
      const px = kf(t, pKeys);
      jesus.set({ x: jx, y: J0.y + es(t, 4.3, 4.6) * 52, s: 1.0, flip: false, walk: moving(t, jKeys) ? jx * 0.05 : undefined, armF: 20 + speak * 40 + bump(t, 1.1, 1.9) * 40 + bump(t, 2.1, 2.9) * 30 + bump(t, 3.1, 3.9) * 30 + followK * 50 * (1 - es(t, 4.4, 4.6)), armB: 10 + speak * 100 + followK * 30, head: -speak * 4, blink: blinkAt(T) });
      const sorrow = es(t, 2.2, 2.6) * (1 - es(t, 3.3, 3.7));
      peter.set({ x: px, y: P0.y + es(t, 4.62, 4.9) * 50, s: 0.96, flip: t < 4.3, walk: moving(t, pKeys) ? px * 0.05 : undefined, armF: 34, armB: 14 + followK * 20, head: -es(t, 0.2, 0.5) * 8 + sorrow * 8 - es(t, 3.1, 3.4) * 6, blink: blinkAt(T, 2) });
      fade(peter.el.querySelector('[data-part="sad"]'), sorrow * 0.8);
      const [jhx, jhy] = headAt(J0.x, J0.y, 1.0, false);
      const tk = es(t, 0.1, 0.3, ease.back) * (1 - es(t, 0.85, 1.0));
      vis(truly, { x: jhx + 20, y: jhy - 20, s: tk, o: tk > 0.01 ? 1 : 0 });
      const fk = es(t, 4.12, 4.32, ease.back);
      vis(follow, { x: jx - 10, y: jhy - 30, s: fk, o: fk > 0.01 ? 1 : 0 });
      steps.forEach((el, i) => fade(el, es(t, 4.35 + i * 0.04, 4.45 + i * 0.04) * 0.9));

      S.cam.x = kf(t, PT ? [[0, 10], [1, 10], [1.4, 24], [3, 24], [4, 24], [4.4, 90], [5, 170]] : [[0, -20], [1, -10], [1.4, 30], [3, 40], [4, 30], [4.4, 80], [5, 140]]);
      S.cam.y = kf(t, [[0, 0], [1, 0], [3, 0], [4, 10], [4.4, 80], [5, 100]]);
      S.cam.z = kf(t, PT ? [[0, 1.1], [1, 1.1], [1.4, 1.05], [3, 1.06], [4, 1.06], [4.4, 1.06], [5, 1.08]] : [[0, 1.12], [1, 1.12], [1.4, 1.1], [3, 1.14], [4, 1.1], [4.4, 1.06], [5, 1.08]]);
    };
  },
};
