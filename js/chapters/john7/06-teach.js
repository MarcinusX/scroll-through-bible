// J 7,14–18 — the Temple court in festival dress: garlands along the porch, willow branches, the great golden
// lampstands. A string of seven little booths counts the days of the feast; the fourth lights up — the middle of
// the feast — and Jesus walks in and teaches. The scholars marvel: "How does He know the Scriptures, never
// having studied?" — a plate of a rabbi's school, with a question mark. "My teaching is not mine": light falls from
// above and a scroll comes down in it into His hands (the One who sent Him is light, never a figure). "Whoever wants
// to do His will shall know": a listener's heart-window opens to the light. A plate: a man crowning himself
// (his own glory) — then the crown is lifted up into the light: the one who seeks the glory of the One who sent him
// is true.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix, crowd } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { scrollParts } from '../mark1/lib.js';
import {
  feastCourt, PH, councilScribe, pilgrim, townMan, headAt, hand, voiceRings, say, strip, nameTag, roundel, bigQuestion, sukkah,
  beamGrad, lightBeam, heartWindow, openWindow, glory, crown, spark, hangAt, vpose, FEAST, tr, PI,
} from './lib.js';

const JX = 800;

export default {
  id: 'j7-teach',
  beats: [
    { v: 14 },
    { v: 15 },
    { v: 16, text: 'Odpowiedział im Jezus mówiąc:' },
    { v: 16, cont: true, text: '«Moja nauka nie jest moją, lecz Tego, który Mnie posłał.' },
    { v: 17 },
    { v: 18, text: 'Kto mówi we własnym imieniu, ten szuka własnej chwały.' },
    { v: 18, cont: true, text: 'Kto zaś szuka chwały Tego, który go posłał, ten godzien jest wiary i nie ma w nim nieprawości.' },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [0.85, 1.16] },
  build(S) {
    const c = S.c;
    const ph = (wide, phone) => (S.portrait ? phone : wide);   // phone: plates and people at the sides come inward
    const set = feastCourt(S, { skyCols: FEAST });
    const F = set.F + 20;

    /* the light from above (behind the people) */
    const LL = S.layer({ par: 0.45, sh: 0, flat: true });
    const bid = beamGrad(S, 'sent', '#fff3cf');
    const beam = LL.add(`<g>${lightBeam(bid, 60, 240, 560)}</g>`);
    const glo = LL.add(`<g>${glory(c, 260, 18)}</g>`);

    /* listeners seated on the paving; scholars standing on the right */
    const sitL = S.layer({ par: 0.48, sh: 4 });
    const sitters = crowd(S, sitL, [{ y: F + 30, s: 0.84, n: 4, x0: 400, x1: 650, pose: 'sit' }]);
    const P = S.layer({ par: 0.5, sh: 5 });
    const listener = S.puppet(P.add(person(c, { ...townMan(c), pose: 'kneel' })));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, r: 30, w: 4 });
    const SX = ph([1010, 1090, 1170], [990, 1058, 1126]);
    const scholars = SX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(i === 1 ? councilScribe(c, 1, {}) : person(c, PH(c, i + 2)))) }));
    const scrollInHand = P.add(`<g>${sheet().p(c.cut(c.rect(-30, -18, 60, 36), 0.4, 5), C.parchment).p(c.cut(c.rect(-38, -22, 9, 44), 0.3, 4) + c.cut(c.rect(29, -22, 9, 44), 0.3, 4), C.wood2).x(c.ribbon([[-22, -8], [20, -8]], 1.6) + c.ribbon([[-22, 0], [16, 0]], 1.6) + c.ribbon([[-22, 8], [18, 8]], 1.6), C.ink, 'opacity=".45"').out()}</g>`);

    set.front();

    /* the days of the feast, words and plates */
    const X = S.layer({ par: 0.5, sh: 6 });
    const days = Array.from({ length: 7 }, (_, i) => {
      const el = X.add(`<g><path d="M0 -1400V-30" stroke="rgba(74,54,34,.5)" stroke-width="1.1" fill="none"/><g class="lit" opacity="0"><circle cy="-10" r="40" fill="url(#warm-glow)"/></g><g transform="scale(.2)">${sukkah(c, { w: 180, h: 150, fruit: false })}</g><text x="0" y="22" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="15" font-style="italic" fill="${C.inkSoft}">${i + 1}</text></g>`);
      return { el, lit: el.querySelector('.lit'), i, x: 560 + i * 80, y: 200 + Math.abs(i - 3) * -6 };
    });
    const midT = X.add(`<g>${strip(c, tr('w połowie święta', 'the middle of the feast'), { size: 17 })}</g>`);
    // "how does He know the Scriptures?" — a rabbi's school with a question mark
    const school = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-110, -110, 220, 220), 0, 20), mix(C.parchment, C.sand, 0.3));
      s.p(c.cut(c.rect(-110, 40, 220, 80), 0.4, 10), mix(C.sand2, C.clay, 0.2));
      const rabbi = `<g transform="translate(-50 62) scale(.46)">${person(c, { robe: C.linen2, mantle: C.teal2, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, beard: 'full', beardColor: C.greyHair, skin: C.skin2, pose: 'sit', holdF: `<g transform="rotate(90)">${sheet().p(c.cut(c.rect(-14, -10, 28, 20), 0.2, 3), C.parchment).out()}</g>` })}</g>`;
      const pupils = [0, 1].map((i) => `<g transform="translate(${20 + i * 44} 64) scale(.4) scale(-1 1)">${person(c, { ...townMan(c), pose: 'sit' })}</g>`).join('');
      return s.out() + rabbi + pupils;
    })();
    const schoolP = hanging(X, roundel(c, school, { r: 92, face: C.parchment, id: S.id('school') }) + `<g transform="translate(70 -64)">${sheet().p(c.cut(c.circ(0, 0, 30, 20), 0.3, 4), C.cream).out()}<g transform="translate(0 -2)">${bigQuestion(c, 22, C.terracotta)}</g></g>`, { x: ph(1080, 1020), y: 250, len: 600 });
    const howB = X.add(`<g>${say(c, tr(['Skąd zna Pisma,', 'skoro się nie uczył?'], ['How does he know letters,', 'having never studied?']), { size: 19, side: -1 })}</g>`);
    // the scroll that comes down in the light
    const sp = scrollParts(c, { w: 150, h: 100, lines: 5 });
    const scrollTop = X.add(`<g>${sp.rod}</g>`);
    const scrollSheet = X.add(`<g>${sp.sheet}</g>`);
    const scrollBot = X.add(`<g>${sp.rod}</g>`);
    const notMine = X.add(`<g>${strip(c, tr('nie moja — Tego, który Mnie posłał', 'not mine — His who sent me'), { size: 17 })}</g>`);
    // v17: a heart-window that opens
    const hw = X.add(`<g>${heartWindow(c, 'bright', 22)}</g>`);
    const knowT = X.add(`<g>${strip(c, tr('pozna', 'he will know'), { size: 17 })}</g>`);
    // v18a: the self-crowned speaker
    const selfIn = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-100, -100, 200, 200), 0, 20), mix(C.parchment, C.dusk, 0.25));
      return s.out() + `<g transform="translate(-6 82) scale(.62)">${person(c, { robe: C.plumRobe, mantle: C.ochre, belt: C.sun, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2 }).replace('class="armFr"', 'class="armFr" transform="rotate(-150)"').replace('class="armBr"', 'class="armBr" transform="rotate(-40)"')}</g>`;
    })();
    const selfP = hanging(X, roundel(c, selfIn, { r: 80, face: C.parchment, rim: C.clay, id: S.id('self') }), { x: 1060, y: 240, len: 600 });
    const selfCrown = X.add(`<g>${crown(c, C.sun)}</g>`);
    const ownT = X.add(`<g>${strip(c, tr('własna chwała', 'his own glory'), { size: 17 })}</g>`);
    const trueT = X.add(`<g>${strip(c, tr('godzien wiary', 'true'), { size: 18 })}</g>`);

    return (t, time) => {
      const T = time;
      set.update(t, T, { lit: 0.2 });

      /* v14 — the middle of the feast; He comes to the Temple and teaches */
      days.forEach((d) => {
        const k = es(t, 0.0 + d.i * 0.04, 0.3 + d.i * 0.04, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
        pose(d.el, { x: d.x, y: lerp(-300, d.y, k) + Math.sin(T * 0.8 + d.i) * 2, o: k > 0 ? 1 : 0 });
        fade(d.lit, d.i <= 3 ? es(t, 0.25 + d.i * 0.08, 0.35 + d.i * 0.08) * (d.i === 3 ? 1 : 0.35) : 0);
      });
      vpose(midT, { x: 800, y: 262, o: es(t, 0.5, 0.6) * (1 - es(t, 1.0, 1.1)) });
      const walkIn = es(t, 0.1, 0.65, ease.sine);
      const jx = lerp(420, JX, walkIn);
      const talking = es(t, 0.6, 0.75);
      const answer = bump(t, 2.05, 2.95) + bump(t, 3.05, 3.5);
      const receive = es(t, 3.35, 3.6) * (1 - es(t, 4.0, 4.2));
      const up = es(t, 6.1, 6.4);
      jesus.set({
        x: jx, y: F, s: 1.04, flip: t > 1.9 && t < 3.1, walk: walkIn > 0 && walkIn < 1 ? jx * 0.05 : undefined,
        armF: 20 + talking * 30 * (1 - receive) * (1 - up) + answer * 30 + receive * 60 + bump(t, 4.1, 4.9) * 40 + bump(t, 5.1, 5.9) * 30 + up * 95, armB: 10 + receive * 50 + bump(t, 0.7, 1.0) * 30,
        head: -up * 10 - receive * 6, blink: blinkAt(T, 1),
      });
      const [hx, hy] = headAt(jx, F, 1.04, t > 1.9 && t < 3.1);
      voice(hx + (t > 1.9 && t < 3.1 ? -26 : 26), hy + 4, talking * (bump(t, 0.6, 1.0) + bump(t, 2.05, 2.95) + bump(t, 4.05, 4.9) * 0.7 + bump(t, 5.05, 6.9) * 0.6), T, { dir: t > 1.9 && t < 3.1 ? -1 : 0 });
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: false, head: -4 - bump(t, 3.2, 4.0) * 8, armF: bump(t, 0.6, 1.2) * 20, blink: blinkAt(T, m.seed) }));

      /* v15 — the scholars marvel */
      const mar = bump(t, 1.05, 2.0);
      scholars.forEach((m) => m.p.set({ x: m.x, y: F + (m.i % 2) * 6, s: 0.98, flip: true, armF: 24 + mar * (m.i === 0 ? 70 : 30), armB: 10 + mar * 40 * (m.i === 2 ? 1 : 0), head: mar * (m.i === 1 ? -8 : 6) - bump(t, 3.2, 4.0) * 8, lean: -mar * 3, blink: blinkAt(T, m.seed) }));
      const [sx0, sy0] = headAt(SX[0], F, 0.98, true);
      vpose(howB, { x: sx0 - 24, y: sy0 - 20, s: es(t, 1.1, 1.3, ease.back), o: seg(t, 1.1, 1.15) * (1 - es(t, 1.9, 2.0)) });
      const sk = es(t, 1.25, 1.55, ease.out), su = es(t, 1.95, 2.15, ease.in);
      hangAt(schoolP, ph(1080, 1020), lerp(-300, 320, sk) - su * 800, T, sk > 0 && su < 1 ? 1 : 0, 1.2, 0.8, 1);

      /* v16b — the light, and the scroll coming down into His hands */
      const bm = es(t, 3.05, 3.3) * (1 - es(t, 4.0, 4.2)) + es(t, 6.2, 6.5) * 0.8;
      vpose(beam, { x: JX + 4, y: -60, sx: 0.5 + bm * 0.5, o: bm * 0.85 });
      vpose(glo, { x: JX, y: -10, s: 0.6 + bm * 0.5, r: T * 2, o: bm * 0.7 });
      const dk = es(t, 3.1, 3.5, ease.sine);
      const unroll = es(t, 3.05, 3.25);
      const sy = lerp(-120, F - 280, dk);
      const inHand = es(t, 3.5, 3.58) * (1 - es(t, 4.05, 4.15));
      const sOn = seg(t, 3.02, 3.06) * (1 - inHand) * (t < 3.6 ? 1 : 0);
      vpose(scrollTop, { x: JX, y: sy, o: sOn });
      vpose(scrollSheet, { x: JX, y: sy, sy: Math.max(0.02, unroll), o: sOn });
      vpose(scrollBot, { x: JX, y: sy + 100 * unroll, o: sOn });
      const [shx, shy] = hand(JX, F, 1.04, false, 20 + 30 + 60);
      vpose(scrollInHand, { x: shx + 16, y: shy - 10, r: -6, o: inHand });
      vpose(notMine, { x: JX, y: 218, o: es(t, 3.4, 3.55) * (1 - es(t, 3.95, 4.05)) });

      /* v17 — whoever does His will shall know: a listener kneels, his heart opens to the light */
      const kneel = es(t, 4.05, 4.3);
      listener.set({ x: 640, y: F + 10, s: 0.95, o: kneel, armF: 60 + bump(t, 4.4, 4.9) * 30, armB: 40, head: -8, blink: blinkAt(T, 7) });
      const [lhx, lhy] = headAt(640, F + 10 + 46 * 0.95, 0.95, false);
      const hk = es(t, 4.2, 4.4, ease.back) * (1 - es(t, 4.95, 5.1));
      vpose(hw, { x: lhx + 4, y: lhy - 72, s: hk, o: hk > 0.01 ? 1 : 0 });
      openWindow(hw, es(t, 4.4, 4.7), 22);
      vpose(knowT, { x: lhx + 4, y: lhy - 128, o: es(t, 4.55, 4.7) * (1 - es(t, 4.95, 5.05)) });

      /* v18 — his own glory / the glory of the One who sent him */
      const pk = es(t, 5.05, 5.35, ease.out), pu = es(t, 6.85, 7.0, ease.in);
      const py = lerp(-300, 310, pk) - pu * 800;
      hangAt(selfP, ph(1060, 1030), py, T, pk > 0 && pu < 1 ? 1 : 0, 1.2, 0.8, 2);
      const lift = es(t, 6.1, 6.55, ease.sine);
      const cx = lerp(ph(1054, 1024), JX, lift), cy = lerp(py - 44, 190, lift);
      vpose(selfCrown, { x: cx, y: cy + Math.sin(T * 2) * 2, s: 0.9 + lift * 0.5, o: pk > 0.3 ? 1 : 0 });
      vpose(ownT, { x: ph(1060, 1030), y: py + 104, o: pk > 0 ? seg(t, 5.3, 5.4) * (1 - seg(t, 6.05, 6.15)) : 0 });
      vpose(trueT, { x: JX, y: F - 250, s: es(t, 6.35, 6.55, ease.back), o: seg(t, 6.35, 6.4) });

      S.cam.y = 30 - bump(t, 2.9, 4.1) * 60 - es(t, 6.0, 6.5) * 50;
      S.cam.z = (1.12 + bump(t, 0.4, 3.0) * 0.03 - bump(t, 2.9, 4.1) * 0.06) * (S.portrait ? 0.85 : 1);   // phone: a wider view, so the plates and the people at the sides fit
    };
  },
};
