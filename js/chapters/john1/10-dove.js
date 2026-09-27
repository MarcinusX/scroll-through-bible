// J 1,32–34 — John testifies: "I saw the Spirit come down like a dove and remain on Him" — the sky glows open
// and the dove settles above Jesus and stays. A sepia memory: John alone in the wilderness, a voice as rings of
// light; on a shadow screen, the sign — a dove resting on a figure, and tongues of light falling from Him.
// Back at the river: "I have seen, and I testify: He is the Son of God."
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { DAY, JOHN_B, jordanSet, headAt, hand, dove, flapWings, glowDisc, rayBurst, radiance, storyFrame, SEPIA, shadowPerson, hungGold, hungPlate, tongue, voiceRings, scrub, acacia, figureIcon, tint, PI } from './lib.js';

const BANK = 770, JX = 820, JOX = 560;

export default {
  id: 'j1-dove',
  beats: [
    { v: 32, text: 'Jan dał takie świadectwo:' },
    { v: 32, cont: true, text: '«Ujrzałem Ducha, który jak gołębica zstępował z nieba i spoczął na Nim.' },
    { v: 33, text: 'Ja Go przedtem nie znałem, ale Ten, który mnie posłał, abym chrzcił wodą, powiedział do mnie:' },
    { v: 33, cont: true, text: '"Ten, nad którym ujrzysz Ducha zstępującego i spoczywającego nad Nim, jest Tym, który chrzci Duchem Świętym".' },
    { v: 34 },
  ],
  cam: { x: [-30, 30], y: [-50, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const J = jordanSet(S, { skyCols: DAY, sunAt: [1230, 150] });
    const opening = S.layer({ par: 0.04, sh: 1, flat: true });
    const openGlow = opening.add(`<g>${glowDisc(360, 'halo-glow', 1)}</g>`);
    const openRays = opening.add(`<g>${rayBurst(c, { n: 24, r0: 40, r1: 900, spread: 0.03, o: 0.45 })}</g>`);
    const farPeople = crowd(S, J.far, [{ y: 584, s: 0.4, n: 9, x0: 150, x1: 1450 }]);
    const R = J.riverLayer();
    J.waterFront(R);
    const { N } = J.nearBank();
    const beam = N.add(`<path d="${c.poly([[JX - 30, -300], [JX + 30, -300], [JX + 110, BANK], [JX - 110, BANK]])}" fill="#fff4cf" opacity="0"/>`);
    const jGlow = N.add(`<g>${glowDisc(210, 'halo-glow', 1)}</g>`);
    const people = crowd(S, N, [{ y: 790, s: 0.88, n: 2, x0: 260, x1: 420 }, { y: 790, s: 0.88, n: 3, x0: 1060, x1: 1320 }]);
    const john = S.puppet(N.add(person(c, { ...JOHN_B })));
    const jesus = S.puppet(N.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(N, c, { n: 3, color: C.clay, r: 38, w: 6, both: false });
    const D = S.layer({ par: 0.45, sh: 5 });
    const doveEl = D.add(dove(c));
    const sonTag = D.add(hungGold(c, tr('Syn Boży', 'the Son of God'), { size: 26 }));

    J.foreground();

    /* ---------- the memory: the wilderness, in sepia ---------- */
    const mem = [];
    const mSky = sky(S, SEPIA.sky, { name: 'mem' });
    mem.push(mSky.layer);
    const mLand = S.layer({ par: 0.2, sh: 3 });
    mLand.add(band(c, { y: 470, amps: [16, 7, 3], lens: [900, 330, 120], color: mix(SEPIA.wall2, C.duskViolet, 0.25) }).markup);
    mLand.add(sheet().p(c.ridge(c.wave(610, [10, 4], [700, 200]), -900, 2500, 1700, 12, 1), SEPIA.wall).out());
    mLand.add(tint(scrub(c, 380, 612, 40) + acacia(c, 1240, 620, 1) + scrub(c, 980, 614, 34), SEPIA.wall2, 0.5));
    mem.push(mLand);
    const mL = S.layer({ par: 0.2, sh: 1, flat: true });
    const voiceGlow = mL.add(`<g>${glowDisc(260, 'halo-glow', 1)}</g>`);
    const rings = [0, 1, 2, 3].map(() => mL.add(`<g><path d="${c.ribbon(c.arc(0, 0, 90, 36, PI * 0.08, PI * 0.92, 18), 8)}" fill="#fffaf0"/></g>`));
    mem.push(mL);
    const mP = S.layer({ par: 0.2, sh: 4 });
    mP.add(`<g transform="translate(800 190)">${radiance(c, 54)}</g>`);
    const mJohn = S.puppet(mP.add(person(c, { ...JOHN_B, robe: mix(JOHN_B.robe, SEPIA.wall2, 0.3) })));
    // the sign, shown on a round shadow screen
    const screen = `<path d="${c.cut(c.circ(0, 0, 118, 40), 0.6, 6)}" fill="${C.wood3}"/><path d="${c.cut(c.circ(0, 0, 108, 40), 0.4, 6)}" fill="#f7e6c4"/><path class="grain" d="${c.cut(c.circ(0, 0, 108, 40), 0.4, 6)}"/>`;
    const scrEl = mP.add(`<g class="hang"><path d="M0 -1600V-118" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${screen}<g clip-path="url(#${S.id('sc')})"><g transform="translate(0 92) scale(.62)">${shadowPerson(c, CAST.jesus, '#4a3a33')}</g><g data-k="sdove" transform="translate(0 -70)"><g transform="scale(.7)">${dove(c, { color: '#4a3a33', shadow: '#3b2e28' })}</g></g>${[-60, -30, 30, 60].map((x, i) => `<g data-k="tg${i}" transform="translate(${x} 40)">${tongue(c, 18)}</g>`).join('')}${[-70, -38, 38, 70].map((x) => `<g transform="translate(${x} 96) scale(.8)">${figureIcon(c, '#4a3a33', '#4a3a33', 44)}</g>`).join('')}</g></g></g>`);
    S.defs(`<clipPath id="${S.id('sc')}"><circle r="106"/></clipPath>`);
    const sDove = S.$('sdove'), tgs = [0, 1, 2, 3].map((i) => S.$('tg' + i));
    mem.push(mP);
    const frame = storyFrame(S);
    mem.push(frame);

    return (t, time0) => {
      // while the memory covers the river, the river's idle life stands still
      const memK = es(t, 2.02, 2.3) * (1 - es(t, 3.95, 4.15));
      const time = memK > 0.98 ? 0 : time0;
      J.update(t, time);
      /* v32a: John testifies */
      const testify = es(t, 0.1, 0.4);
      /* v32b: the Spirit comes down like a dove — and remains on Him */
      const open = es(t, 1.05, 1.4);
      const dv = es(t, 1.15, 1.8);
      pose(openGlow, { x: JX, y: 40, s: 0.6 + open * 0.6, o: open * (1 - es(t, 2.0, 2.3) * 0.5) });
      pose(openRays, { x: JX, y: 40, s: 0.5 + open * 0.5, r: t * 3, o: open * 0.8 * (1 - es(t, 2.0, 2.3) * 0.5) });
      const [hx, hy] = headAt(JX, BANK, 1.05, false);
      const dy = lerp(-160, hy - 70, ease.out(dv));
      pose(doveEl, { x: JX + Math.sin(dv * PI * 2) * 40 * (1 - dv), y: dy + (time ? Math.sin(time * 2) * 4 : 0) * dv, s: 1.2, o: seg(t, 1.1, 1.2) });
      flapWings(doveEl, time, 30 + (1 - dv) * 10, 7 - dv * 3, -10);
      pose(beam, { o: dv * 0.3 * (1 - es(t, 2.0, 2.3) * 0.5) + es(t, 4.1, 4.4) * 0.2 });
      pose(jGlow, { x: hx, y: hy + 20, s: 0.7 + dv * 0.5 + es(t, 4.1, 4.4) * 0.4, o: Math.max(0.3, dv) });

      john.set({ x: JOX, y: BANK + 4, s: 1.03, flip: false, armF: 20 + testify * 60 + es(t, 4.05, 4.3) * 30, armB: testify * 120 * (1 - es(t, 1.2, 1.5)) + es(t, 1.3, 1.6) * 60, head: -testify * 6 - es(t, 1.2, 1.6) * 10, blink: blinkAt(time, 1) });
      const [jhx, jhy] = headAt(JOX, BANK + 4, 1.03, false);
      voice(jhx + 24, jhy + 4, testify * (1 - es(t, 1.9, 2.1)) + es(t, 4.05, 4.3), time, { spread: 2.4, s0: 0.6, dir: 1 });
      jesus.set({ x: JX, y: BANK, s: 1.05, flip: true, armF: 14 + dv * 20, armB: 8 + dv * 30, head: -dv * 10, blink: blinkAt(time, 2) });
      const awe = es(t, 1.3, 1.6);
      people.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: 20 + awe * (m.i % 2 ? 70 : 20), armB: awe * (m.i % 2 ? 10 : 130), head: -awe * 10, blink: blinkAt(time, m.seed) }));
      farPeople.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, head: -awe * 6, blink: blinkAt(time, m.seed) }));

      /* v33: the memory */
      mem.forEach((L) => L.fade(memK));
      const hear = es(t, 2.3, 2.5);
      mJohn.set({ x: 640, y: 700, s: 1.0, flip: false, armF: 20 + hear * 50, armB: hear * 60, head: -hear * 18, blink: blinkAt(time0, 3) });
      pose(voiceGlow, { x: 800, y: 190, s: 0.6 + hear * 0.5, o: hear });
      rings.forEach((r, i) => {
        const k = (t * 1.2 + i / 4) % 1;
        pose(r, { x: 800, y: 210 + k * 260, s: 0.6 + k * 2.2, sy: 0.6 + k * 1.5, o: hear * (1 - k) * 0.9 });
      });
      const sk = es(t, 3.05, 3.3, ease.out);
      pose(scrEl, { x: 1010, y: lerp(-400, 400, sk), r: (1 - sk) * 4, o: sk > 0.01 ? 1 : 0 });
      const sd = es(t, 3.2, 3.55, ease.out);
      pose(sDove, { x: 0, y: lerp(-160, -72, sd), o: 1 });
      flapWings(sDove.firstElementChild.firstElementChild, t * 6, 24 * (1 - sd) + 6, 7, -10);
      tgs.forEach((g, i) => {
        const k = seg(t, 3.5 + i * 0.07, 3.85 + i * 0.07);
        pose(g, { x: [-60, -30, 30, 60][i] * (0.3 + k * 0.7), y: lerp(-20, 50, k), s: 0.4 + k * 0.6, o: k > 0 ? 1 - k * 0.2 : 0 });
      });

      /* v34: I have seen and testify: He is the Son of God */
      const son = es(t, 4.15, 4.45, ease.out);
      pose(sonTag, { x: JX, y: lerp(-500, 330, son), r: Math.sin(t * 3.2) * 1.4, o: son > 0.01 ? 1 : 0 });

      S.cam.y = -30 * es(t, 1.0, 1.4) * (1 - es(t, 2.0, 2.3));
      S.cam.z = 1.02 + 0.04 * es(t, 4.0, 4.4);
    };
  },
};
