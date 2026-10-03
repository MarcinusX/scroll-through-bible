// Mk 12,18–23 — the Sadducees' puzzle. They come, sure there is no resurrection (a sealed tomb, crossed out).
// Moses' law is shown in a little hanging picture; then seven portraits of seven brothers come down on strings.
// Thread by thread each is joined to the woman's portrait and turns over, grey, a candle out — gently.
// At last hers too. "In the resurrection, whose wife?" — all turn back, seven threads pull at one portrait.
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging, mix, shade } from '../kit.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { templeCourt, sadducee, moodPuppet, voiceRings, bubble, thought, scrollOpen, flipPortrait, vignette, bigQuestion, sparkle, FONT, sheet } from './lib.js';

const PX0 = [540, 644, 748, 852, 956, 1060, 1164], PY = 200;    // the brothers' portraits
const PXP = [508, 602, 696, 790, 884, 978, 1072];             // … on a phone: the whole row inside the screen
const WY = 346;                                                // the woman's portrait
const JX = 640;
const SX = [900, 972, 1044];
const BRO = (i) => ({ robe: [C.dustyBlue, C.sageRobe, C.ochreRobe, C.tealRobe, C.mauve, C.wheatRobe, C.clayMantle][i], hair: [C.hair2, C.hair, C.hair2, C.hair3, C.hair2, C.hair, C.hair3][i], hairStyle: i % 3 === 2 ? 'curly' : 'short', beard: i < 2 ? 'full' : i < 5 ? 'short' : 'none', skin: [C.skin2, C.skin, C.skin3][i % 3], belt: C.leather });
const WOMAN = { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), skin: C.skin, hair: C.hair };

export default {
  id: 'm12-sadducees',
  beats: [
    { v: 18 },
    { v: 19, text: '«Nauczycielu, Mojżesz tak nam przepisał:' },
    { v: 19, cont: true, text: 'Jeśli umrze czyjś brat i pozostawi żonę, a nie zostawi dziecka, niech jego brat weźmie ją za żonę i wzbudzi potomstwo swemu bratu.' },
    { v: 20, text: 'Otóż było siedmiu braci.' },
    { v: 20, cont: true, text: 'Pierwszy wziął żonę i umierając nie zostawił potomstwa.' },
    { v: 21 },
    { v: 22, text: 'I siedmiu ich nie zostawiło potomstwa.' },
    { v: 22, cont: true, text: 'W końcu po wszystkich umarła ta kobieta.' },
    { v: 23, text: 'Przy zmartwychwstaniu więc, gdy powstaną, którego z nich będzie żoną?' },
    { v: 23, cont: true, text: 'Bo siedmiu miało ją za żonę».' },
  ],
  cam: { x: [-30, 30], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const PX = P ? PXP : PX0, WX = P ? 790 : 852;
    // phone: Moses' scroll and the little law picture hang inside the screen
    const SCX = P ? 960 : 1060, LAWX = P ? 880 : 1010;
    const set = templeCourt(S);
    const F = set.FLOOR;

    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 4, x0: 380, x1: 600, pose: 'sit' }, { y: 604, s: 0.66, n: 3, x0: 1080, x1: 1240, pose: 'sit' }]);

    /* the gallery on strings */
    const gal = S.layer({ par: 0.32, sh: 6 });
    // threads (drawn first, behind the frames): from each brother down to the woman
    const threads = PX.map((x) => gal.add(`<g><path d="${c.ribbon([[x, PY + 50], [WX + (x - WX) * 0.12, WY - 44]], 2.2)}" fill="${C.terracotta}"/></g>`));
    const mkP = (look, i, o) => {
      const fp = flipPortrait(c, S.id('por' + i), look, o);
      const el = gal.add(`<g><path d="M0 -1400V${-(o.h || 88) / 2 - 6}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${fp.defs}<g class="card"><g data-part="front">${fp.front}</g><g data-part="back" opacity="0">${fp.back}</g></g>${fp.label}</g>`);
      return { el, card: el.querySelector('.card'), front: el.querySelector('[data-part="front"]'), back: el.querySelector('[data-part="back"]') };
    };
    const bros = PX.map((x, i) => ({ ...mkP(BRO(i), i, { w: 62, h: 78, label: String(i + 1) }), x, i }));
    const wife = { ...mkP(WOMAN, 9, { w: 74, h: 92, frame: C.jesusMantle }), x: WX };
    const wifeGlow = gal.add(`<g opacity="0"><circle r="90" fill="url(#warm-glow)"/></g>`);
    const qEl = hanging(gal, bigQuestion(c, 40, C.cream), { x: 1000, y: -300, len: 500 });

    /* Moses' law: a little picture that comes down beside them */
    const law = S.layer({ par: 0.34, sh: 6 });
    const scrollEl = hanging(law, `<g transform="scale(1.5)">${scrollOpen(c, 90, 60)}</g>`, { x: 1010, y: -300, len: 500 });
    const vid = S.id('law');
    const inner = `<rect x="-140" y="10" width="280" height="150" fill="${mix(C.sand, C.parchment, 0.5)}"/><g data-k="lawA" transform="translate(-70 150) scale(.5)">${person(c, BRO(0))}</g><g data-k="lawW" transform="translate(-10 150) scale(.5)">${person(c, { ...WOMAN, k: 'lawWf' })}</g><g data-k="lawB" transform="translate(60 150) scale(.5)">${person(c, BRO(1))}</g><g data-k="lawC"><circle r="26" fill="url(#warm-glow)"/><path d="${c.cut(c.ell(0, 0, 9, 11, 12), 0.2, 3)}" fill="${C.linen}"/><path d="${c.cut(c.circ(0, -12, 6.5, 10), 0.2, 3)}" fill="${C.skin}"/></g>`;
    const lawPic = law.add(`<g><path d="M-100 -1400V0M100 -1400V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${vignette(c, vid, inner, { w: 280, h: 150 })}</g>`);
    const lawA = lawPic.querySelector('[data-k="lawA"]'), lawB = lawPic.querySelector('[data-k="lawB"]'), lawC = lawPic.querySelector('[data-k="lawC"]');

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const dis = [CAST.peter, CAST.john].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: (P ? 530 : 500) - i * (P ? 58 : 60), i }));
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const sad = [0, 1, 2].map((i) => ({ i, p: moodPuppet(S, pl, c, { ...sadducee(i), holdF: '' }), seed: c.rr(0, 9) }));
    const voice = voiceRings(pl, c, { n: 3, r: 24, w: 4 });
    const tombIcon = sheet().p(c.cut([[-26, 16], [-26, -6], ...c.arc(0, -6, 26, 22, Math.PI, 2 * Math.PI, 10), [26, 16]], 0.6, 5), C.rock2).p(c.cut(c.circ(6, 4, 13, 14), 0.4, 4), C.rock).x(c.ribbon([[-24, -22], [22, 18]], 5) + c.ribbon([[22, -22], [-24, 18]], 5), C.terracotta).out();
    const noRes = pl.add(`<g>${thought(c, tombIcon, { w: 90, h: 72 })}</g>`);
    const moses = pl.add(`<g>${bubble(c, tr(['Nauczycielu,', 'Mojżesz przepisał…'], ['Teacher,', 'Moses wrote…']), { size: 18, tail: -1 })}</g>`);
    const whose = pl.add(`<g>${bubble(c, tr('Którego żoną?', 'Whose wife?'), { size: 20, tail: -1 })}</g>`);

    set.front();
    const flipK = [4.45, 5.2, 5.6, 6.1, 6.25, 6.4, 6.55];  // when each brother's portrait turns over

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v18 — the Sadducees come in; no resurrection, they say */
      sad.forEach((m) => {
        const k = es(t, 0.05 + m.i * 0.06, 0.5 + m.i * 0.06);
        const x = lerp(1440 + m.i * 60, SX[m.i], k);
        const smug = es(t, 9.05, 9.3);
        m.p.set({ x, y: F + 4 + (m.i % 2) * 8, s: 0.93, flip: true, walk: k > 0 && k < 1 ? x * 0.05 + m.i : undefined, blink: blinkAt(T, m.seed),
          armF: 26 + (m.i === 0 ? bump(t, 1.05, 2.9) * 70 + bump(t, 8.1, 8.9) * 60 : 0) + smug * 20, armB: smug * 40 + (m.i === 1 ? bump(t, 3.1, 3.9) * 90 : 0), head: -bump(t, 3.0, 8.0) * 10 + smug * 6, lean: smug * 5 });
      });
      const nk = es(t, 0.55, 0.7, ease.back) * (1 - es(t, 0.9, 1.0));
      pose(noRes, { x: SX[1] - 6, y: F - 204, s: nk, o: nk > 0.02 ? 1 : 0 });
      const mk = es(t, 1.08, 1.22, ease.back) * (1 - es(t, 1.85, 1.95));
      pose(moses, { x: SX[0] - 16, y: F - 206, s: mk, o: mk > 0.02 ? 1 : 0 });
      const wk = es(t, 8.2, 8.35, ease.back) * (1 - es(t, 8.9, 9.0));
      pose(whose, { x: SX[0] - 16, y: F - 206, s: wk, o: wk > 0.02 ? 1 : 0 });

      /* v19 — the scroll of Moses; the law in a little picture */
      const sd = es(t, 1.1, 1.5, ease.out) * (1 - es(t, 1.9, 2.15, ease.in));
      pose(scrollEl, { x: SCX, y: lerp(-800, 250, sd), r: Math.sin(T * 0.9) * 1.5 });
      const ld = es(t, 2.0, 2.3, ease.out) * (1 - es(t, 2.85, 3.05, ease.in));
      pose(lawPic, { x: LAWX, y: lerp(-900, 130, ld), s: 1.3 });
      const aGo = es(t, 2.3, 2.45), bIn = es(t, 2.45, 2.6), child = es(t, 2.62, 2.75, ease.back);
      pose(lawA, { x: -70, y: 150, s: 0.5, o: 1 - aGo });
      pose(lawB, { x: lerp(150, 50, bIn), y: 150, s: 0.5 });
      pose(lawC, { x: 16, y: 120, s: child, o: child > 0.01 ? 1 : 0 });

      /* v20–22 — seven brothers, one after another */
      const down = (i) => es(t, 3.05 + i * 0.07, 3.4 + i * 0.07, ease.out);
      const rise = es(t, 8.1, 8.45);
      bros.forEach((b) => {
        const k = down(b.i);
        pose(b.el, { x: b.x, y: lerp(-800, PY, k) });
        const f = seg(t, flipK[b.i], flipK[b.i] + 0.22) * (1 - seg(t, 8.1 + b.i * 0.03, 8.32 + b.i * 0.03));
        pose(b.card, { sx: Math.max(0.02, Math.abs(Math.cos(f * Math.PI))) });
        fade(b.front, f < 0.5 ? 1 : 0); fade(b.back, f < 0.5 ? 0 : 1);
        // his thread to her: while he is her husband
        const th = es(t, flipK[b.i] - 0.35, flipK[b.i] - 0.2) * (1 - es(t, flipK[b.i] + 0.15, flipK[b.i] + 0.25));
        pose(threads[b.i], { o: Math.max(th, rise) });
      });
      const wd = es(t, 4.02, 4.25, ease.out);
      pose(wife.el, { x: WX, y: lerp(-800, WY, wd) + bump(t, 9.1, 9.9) * Math.sin(T * 9) * 3, r: bump(t, 9.1, 9.9) * Math.sin(T * 7) * 4 });
      const wf = seg(t, 7.3, 7.55) * (1 - seg(t, 8.25, 8.5));
      pose(wife.card, { sx: Math.max(0.02, Math.abs(Math.cos(wf * Math.PI))) });
      fade(wife.front, wf < 0.5 ? 1 : 0); fade(wife.back, wf < 0.5 ? 0 : 1);
      pose(wifeGlow, { x: WX, y: WY, o: rise * (1 - es(t, 9.0, 9.2)) * 0.8 });
      const qk = es(t, 8.4, 8.7, ease.out);
      pose(qEl, { x: 980, y: lerp(-800, 340, qk), s: 0.9, r: Math.sin(T) * 3 });

      /* Jesus listens quietly; the crowd follows the pictures */
      const look = es(t, 3.0, 3.3) * (1 - es(t, 9.0, 9.4));
      jesus.set({ x: JX, y: F, s: 1.02, blink: blinkAt(T), head: -look * 12, armF: 24 + look * 10, armB: 16 });
      voice(JX + 26, F - 176, 0, T);
      dis.forEach((d) => d.p.set({ x: d.x, y: F + 10 + d.i * 8, s: 0.9, head: -look * 14, blink: blinkAt(T, d.i + 3) }));
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, head: -look * 16 - 3, blink: blinkAt(T, m.seed) }));

      S.cam.z = 1 + es(t, 2.9, 3.4) * 0.03;
      S.cam.y = -es(t, 2.9, 3.4) * 26;
    };
  },
};
