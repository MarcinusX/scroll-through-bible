// Łk 23,13–16 — Pilate's hall again, later in the morning. Jesus stands in the middle in Herod's gleaming robe.
// Pilate beckons: the chief priests, the rulers and people of the city come in. "You brought me this man as one
// who stirs up the people" — the grey card of that charge floats up over Him. "I examined Him before you and
// found no guilt": the empty balance comes down; the card is laid on its pan — the pan does not move, and the
// card crumbles to dust. "Neither has Herod": Herod's portrait comes down, the same empty balance on its tag.
// "Nothing deserving death": in Pilate's bubble a small dark cross, struck through. "I will chastise Him and let
// Him go": a whip, then a key — in words only; the soldier stands by.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { withFace } from '../mark6/lib.js';
import { whip } from '../mark10/lib.js';
import { smallCross } from '../mark8/lib.js';
import { crossX } from '../mark6/lib.js';
import { kf, moving, hand, headAt, speech, GLYPH, priest, elder, soldier, pilate, bonds, hallSet, lampSet, noGuilt, keyGlyph, chargeCard, stirIcon, bustPortrait, herodCrown, strip, dust, HEROD, JESUS_GLEAM, tr, PI } from './lib.js';

const JX = 800, JY = 690;
const BX = 960, BY = 290;       // the balance hangs here (pivot)

export default {
  id: 'lk23-again',
  beats: [
    { v: 13 },
    { v: 14, text: 'i rzekł do nich: «Przywiedliście mi tego człowieka pod zarzutem, że podburza lud.' },
    { v: 14, cont: true, text: 'Otóż ja przesłuchałem Go wobec was i nie znalazłem w Nim żadnej winy w sprawach, o które Go oskarżacie.' },
    { v: 15, text: 'Ani też Herod - bo odesłał Go do nas;' },
    { v: 15, cont: true, text: 'a oto nie popełnił On nic godnego śmierci.' },
    { v: 16 },
  ],
  cam: { x: [-40, 240], y: [-40, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const H = hallSet(S);
    if (S.portrait) { const std = H.props.el.querySelector('g[transform="translate(1236 612)"]'); if (std) std.style.display = 'none'; }   // phone: the eagle standard right of the seat would only peep out under the thread
    const P = H.charL;
    const shine = P.add(`<g><circle r="110" fill="url(#halo-glow)"/></g>`);
    const folk = [[300, 668], [380, 662], [220, 664], [460, 670]].map(([x, y], i) => ({ i, x, y, p: S.puppet(P.add(person(c, crowdPerson(c)))), seed: c.rr(0, 9) }));
    const council = [
      { el: priest(c, 0), x: 620 }, { el: elder(c, 1), x: 545 }, { el: priest(c, 1), x: 470 }, { el: elder(c, 2), x: 395 }, { el: priest(c, 2), x: 320 },
    ].map((m, i) => ({ ...m, i, p: S.puppet(P.add(m.el)), seed: c.rr(0, 9), y: 694 + (i % 2) * 8 }));
    if (S.portrait) {   // phone: two of the council whole in the frame, the rest and the people clear of its edge
      council.forEach((m, i) => { m.x = [665, 600, 440, 370, 300][i]; });
      folk.forEach((m) => { m.x -= 120; });
    }
    const sol = S.puppet(P.add(soldier(c, 0)));
    const sol2 = S.puppet(P.add(soldier(c, 1)));
    const pSit = S.puppet(P.add(pilate(c, { pose: 'sit' })));
    const pSt = S.puppet(P.add(pilate(c)));
    const jes = S.puppet(P.add(person(c, { ...JESUS_GLEAM, holdF: bonds(c) })));
    const fx = H.fxL;

    const flies = S.layer({ par: 0.3, sh: 5 });
    const card = flies.add(chargeCard(c, stirIcon(c), tr('podburza lud', 'perverts the people')));
    const bal = flies.add(`<g><path d="M0 -1500V-60" stroke="rgba(74,54,34,.55)" stroke-width="1.4" fill="none"/><circle r="90" fill="url(#halo-glow)" opacity=".5"/><g transform="scale(3.4)">${noGuilt(c, 22)}</g></g>`);
    const balTag = flies.add(`<g>${strip(c, tr('żadnej winy', 'no basis for a charge'), { size: 17 })}</g>`);
    const dusts = Array.from({ length: 8 }, (_, i) => ({ i, el: flies.add(`<g>${dust(c, 5)}</g>`), dx: c.rr(-40, 40), dy: c.rr(20, 90) }));
    const hB = withFace(person(c, { ...HEROD }), herodCrown(c));
    const por = flies.add(`<g><path d="M-40 0V-1500M40 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/>${bustPortrait(c, S.id('hp'), hB, { w: 104, h: 120, bg: mix(C.parchment, C.apricot, 0.3), label: tr('Herod', 'Herod') })}<g transform="translate(0 214)"><path d="M0 -26V-10" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/><circle r="30" fill="${C.cream}"/><g transform="scale(1.1)">${noGuilt(c, 22)}</g></g></g>`);

    const death = `<g transform="translate(-2 16) scale(.46)">${smallCross(c, 80, '#3b2a22')}</g><g transform="scale(.62)">${crossX(c, 24)}</g>`;
    const b15 = fx.add(`<g>${speech(c, death, { w: 70, h: 64, flip: true })}</g>`);
    const b16 = fx.add(`<g>${speech(c, `<g transform="translate(-26 18) rotate(-20) scale(.42)">${whip(c)}</g><path d="${c.ribbon([[-6, 0], [8, 0]], 2.4) + c.poly([[8, -5], [15, 0], [8, 5]])}" fill="${C.inkSoft}"/><g transform="translate(30 0) scale(1.2)">${keyGlyph(c)}</g>`, { w: 104, h: 62, flip: true })}</g>`);
    const point = fx.add(`<g>${speech(c, `<g transform="scale(.36)">${stirIcon(c)}</g><g transform="translate(24 0) scale(.9)">${GLYPH.q(c)}</g>`, { w: 84, h: 56, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      H.lamps.forEach((l) => lampSet(l, 0, T));
      pose(H.orb, { x: 690, y: 300 - es(t, 0, 6) * 60 });
      pose(H.cl, { x: 610 + Math.sin(T * 0.1) * 20, y: 250 });
      H.sk.set('#b7cbd0', '#efdcc0', '#f6e0c0');

      /* Jesus in the gleaming robe, quiet in the middle */
      jes.set({ x: JX, y: JY, s: 1.02, flip: false, armF: 30, armB: 28, head: 4, blink: blinkAt(T) });
      const inn = es(t, 2.05, 2.4) + es(t, 3.05, 3.4) * 0.3;
      pose(shine, { x: JX, y: JY - 170, s: 0.7 + inn * 0.3, o: Math.min(0.75, inn * 0.6) });
      sol.set({ x: 930, y: JY, s: 1, flip: true, armF: 34 + bump(t, 5.1, 5.9) * 20, armB: 10, lean: -bump(t, 5.1, 5.9) * 3, blink: blinkAt(T, 6) });
      sol2.set({ x: 1350, y: 668, s: 0.98, flip: true, armF: 34, armB: 6, blink: blinkAt(T, 7) });

      /* v13 — Pilate calls them together: the council and the people come in */
      council.forEach((m) => {
        const K = [[0.05 + m.i * 0.06, [m.x - 520, m.y]], [0.7 + m.i * 0.06, [m.x, m.y]]];
        const [x, y] = kf(t, K);
        const wince = es(t, 2.1, 2.4) * (1 - es(t, 2.9, 3.1));
        m.p.set({ x, y, s: 0.96, flip: false, walk: moving(t, K) ? x * 0.05 : undefined, armF: 22 + wince * 40, armB: 10 + (m.i % 2) * wince * 60, head: -3 + wince * 5, blink: blinkAt(T, m.seed) });
      });
      folk.forEach((m) => {
        const K = [[0.2 + m.i * 0.07, [m.x - 480, m.y]], [0.85 + m.i * 0.07, [m.x, m.y]]];
        const [x, y] = kf(t, K);
        m.p.set({ x, y, s: 0.86, flip: false, walk: moving(t, K) ? x * 0.06 : undefined, armF: 14, armB: 8, head: -4, blink: blinkAt(T, m.seed) });
      });

      /* Pilate: beckons seated, then stands to speak */
      const rise = es(t, 1.0, 1.08);
      const beck = es(t, 0.05, 0.25) * (1 - es(t, 0.8, 1.0));
      pSit.set({ x: 1116, y: 566, s: 1, flip: true, o: 1 - rise, armF: 30 + beck * (60 + (T ? Math.sin(T * 5) * 12 : 0)), armB: 10, head: -4, blink: blinkAt(T, 1) });
      const pt = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const open = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const toH = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1));
      const say = es(t, 4.05, 4.3) * (1 - es(t, 4.9, 5.1)) + es(t, 5.05, 5.3) * (1 - es(t, 5.9, 6.1));
      pSt.set({ x: 1060, y: 600, s: 1, flip: true, o: rise, armF: 30 + pt * 60 + open * 40 + say * 30, armB: 10 + open * 110 + toH * 120, head: -2 - toH * 8, lean: -pt * 4, blink: blinkAt(T, 1) });
      const [p2x, p2y] = headAt(1060, 600, 1, true);
      const bp = es(t, 1.1, 1.35, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(point, { x: p2x - 26, y: p2y - 16, s: bp, o: bp > 0.02 ? 1 : 0 });
      const k15 = es(t, 4.1, 4.35, ease.back) * (1 - es(t, 4.9, 5.05));
      pose(b15, { x: p2x - 26, y: p2y - 16, s: k15, o: k15 > 0.02 ? 1 : 0 });
      const k16 = es(t, 5.1, 5.35, ease.back);
      pose(b16, { x: p2x - 26, y: p2y - 16, s: k16, o: k16 > 0.02 ? 1 : 0 });

      /* v14 — the card of the charge; the balance; the card crumbles */
      const ck = es(t, 1.1, 1.45, ease.out);
      const toPan = es(t, 2.3, 2.6);
      const crumble = es(t, 2.6, 2.8);
      const panX = BX - 22 * 0.86 * 3.4, panY = BY - 22 * 0.1 * 3.4 - 20;
      pose(card, { x: lerp(JX, panX, toPan), y: lerp(lerp(700, 330, ck), panY - 30, toPan), s: lerp(0.5 + ck * 0.5, 0.45, toPan), r: lerp(-5, 0, toPan), o: ck > 0.01 ? 1 - crumble : 0 });
      dusts.forEach((d) => { const k = seg(t, 2.62, 3.1); pose(d.el, { x: panX + d.dx * k, y: panY - 30 + d.dy * k, s: 1 - k * 0.5, o: k > 0 && k < 1 ? 1 - k : 0 }); });
      const bk = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 3.9, 4.2, ease.in));
      pose(bal, { x: BX, y: lerp(-400, BY, bk), r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: bk > 0.01 ? 1 : 0 });
      const tk = es(t, 2.65, 2.85, ease.back) * (1 - es(t, 3.9, 4.05));
      pose(balTag, { x: BX, y: BY + 92, s: tk, o: tk > 0.02 ? 1 : 0 });

      /* v15a — Herod's portrait, the same empty balance on its tag */
      const hk = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 4.9, 5.2, ease.in));
      pose(por, { x: 720, y: lerp(-600, 150, hk), r: T ? Math.sin(T * 0.9 + 1) * 1.4 : 0, s: 0.95, o: hk > 0.01 ? 1 : 0 });

      S.cam.x = 20 + es(t, 0.9, 1.3) * 30 - es(t, 2.9, 3.3) * 40 * (1 - es(t, 3.9, 4.3)) + es(t, 3.9, 4.3) * 20;
      S.cam.y = 10 + es(t, 0, 0.8) * 10;
      S.cam.z = 1.02 + es(t, 3.9, 4.4) * 0.05;
      if (S.portrait) S.cam.x += 150;   // phone: Pilate on his seat clear of the thread
    };
  },
};
