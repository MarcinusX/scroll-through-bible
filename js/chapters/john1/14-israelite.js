// J 1,47–50 — Nathanael comes with Philip. "Behold, a true Israelite, in whom there is no deceit" — a clear,
// bright heart. "How do you know me?" — a round memory plate: Nathanael under the fig tree, and a golden ray of
// Jesus' gaze resting on him. Nathanael kneels: "Rabbi, you are the Son of God, the King of Israel!" — a crown
// of gold comes down above Jesus. "You will see greater things than these" — Jesus points to the sky.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { DAY, LOOK, fieldSet, bubble, hungGold, hungWord, heart, glowDisc, rayBurst, crown, figTree, figs, SEPIA, scrollRoll, headAt, sparkle, PI } from './lib.js';

const PY = 770, JX = 800, NX = 985;

export default {
  id: 'j1-israelite',
  beats: [
    { v: 47, text: 'Jezus ujrzał, jak Natanael zbliżał się do Niego, i powiedział o nim:' },
    { v: 47, cont: true, text: '«Patrz, to prawdziwy Izraelita, w którym nie ma podstępu».' },
    { v: 48, text: 'Powiedział do Niego Natanael: «Skąd mnie znasz?»' },
    { v: 48, cont: true, text: 'Odrzekł mu Jezus: «Widziałem cię, zanim cię zawołał Filip, gdy byłeś pod drzewem figowym».' },
    { v: 49, text: 'Odpowiedział Mu Natanael: «Rabbi, Ty jesteś Synem Bożym,' },
    { v: 49, cont: true, text: 'Ty jesteś Królem Izraela!»' },
    { v: 50, text: 'Odparł mu Jezus: «Czy dlatego wierzysz, że powiedziałem ci: Widziałem cię pod drzewem figowym?' },
    { v: 50, cont: true, text: 'Zobaczysz jeszcze więcej niż to».' },
  ],
  cam: { x: [-30, 60], y: [-60, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const PT = S.portrait;             // phone: the disciples stand closer; the plates and words hang further in
    const LATE = ['#d9dccd', '#f3dfbe', '#f7e5c6'];
    const F = fieldSet(S, { skyCols: DAY, sunAt: [1200, 170] });
    const skyGlow = S.layer({ par: 0.03, sh: 1, flat: true });
    const sg = skyGlow.add(`<g>${glowDisc(420, 'halo-glow', 1)}${rayBurst(c, { n: 20, r0: 60, r1: 800, spread: 0.025, o: 0.22 })}</g>`);

    const P = S.layer({ par: 0.45, sh: 4 });
    const jGlow = P.add(`<g>${glowDisc(230, 'halo-glow', 1)}</g>`);
    const andrew = S.puppet(P.add(person(c, { ...CAST.andrew })));
    const peter = S.puppet(P.add(person(c, { ...CAST.peter })));
    const jn = S.puppet(P.add(person(c, { ...CAST.john })));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const philip = S.puppet(P.add(person(c, { ...LOOK.philip })));
    const nat = S.puppet(P.add(person(c, { ...LOOK.bartholomew })));
    const natK = S.puppet(P.add(person(c, { ...LOOK.bartholomew, pose: 'kneel' })));
    const clearHeart = P.add(`<g>${glowDisc(60, 'halo-glow', 1)}${heart(c, 22, mix(C.jesusMantle, C.cream, 0.35))}<path d="${c.cut(c.ell(-6, -8, 5, 3, 8, -0.6), 0.2, 3)}" fill="#fff" opacity=".9"/></g>`);
    const crownL = S.layer({ par: 0.45, sh: 6 });
    const crownEl = crownL.add(`<g>${glowDisc(70, 'warm-glow', 1)}<g transform="scale(2.2)">${crown(c)}</g></g>`);

    /* ---------- words ---------- */
    const T = S.layer({ par: 0.45, sh: 6 });
    const isr = T.add(hungWord(c, tr('prawdziwy Izraelita', 'an Israelite indeed'), { size: 20 }));
    const how = T.add(`<g>${bubble(c, tr('Skąd mnie znasz?', 'How do you know me?'), { size: 21, tail: 1 })}</g>`);
    const son = T.add(hungGold(c, tr('Syn Boży', 'the Son of God'), { size: 24 }));
    const king = T.add(hungGold(c, tr('Król Izraela', 'King of Israel'), { size: 24 }));
    const more = T.add(`<g>${bubble(c, tr('Zobaczysz więcej!', 'You will see greater things!'), { size: 21, tail: -1 })}</g>`);
    const sparks = [0, 1, 2, 3, 4, 5].map(() => T.add(`<g>${sparkle(c, 14)}</g>`));

    /* ---------- the memory plate: under the fig tree ---------- */
    const fig = figTree(c, 0.42);
    const R = 132;
    S.defs(`<clipPath id="${S.id('fc')}"><circle r="${R - 8}"/></clipPath>`);
    const plateM = `<g class="hang"><path d="M0 -1600V${-R}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">`
      + sheet().p(c.cut(c.circ(0, 0, R + 6, 40), 0.6, 6), C.wood3).p(c.cut(c.circ(0, 0, R - 2, 40), 0.5, 6), SEPIA.sky[1]).out()
      + `<g clip-path="url(#${S.id('fc')})"><path d="${c.ridge(c.wave(60, [4, 2], [120, 60]), -140, 140, 200, 8, 0.6)}" fill="${SEPIA.wall}"/>`
      + `<path data-k="gaze" d="${c.poly([[-140, -140], [-110, -140], [44, 40], [-10, 60]])}" fill="#ffe7a0" opacity="0"/>`
      + `<g transform="translate(40 64)">${fig.trunk}${fig.leaves}<g transform="translate(-10 -92)">${figs(c, 2, 5)}</g></g>`
      + `<g transform="translate(18 70) scale(.44)">${person(c, { ...LOOK.bartholomew, pose: 'sit', holdF: `<g transform="translate(4 2) rotate(70)">${scrollRoll(c)}</g>` })}</g>`
      + `<g data-k="eye" transform="translate(-96 -86)"><path d="${c.cut(c.ell(0, 0, 18, 10, 16), 0.3, 3)}" fill="${C.cream}"/><path d="${c.cut(c.circ(0, 0, 6, 10), 0.2, 3)}" fill="${C.ochre}"/><path d="${c.poly(c.circ(0, 0, 2.6, 8))}" fill="${C.ink}"/></g>`
      + `</g><text x="0" y="${R - 18}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="17" font-style="italic" fill="${C.inkSoft}">${tr('pod drzewem figowym', 'under the fig tree')}</text></g></g>`;
    const memEl = T.add(plateM);
    const gazeEl = S.$('gaze');

    return (t, time) => {
      const eve = es(t, 5.5, 8);
      F.sk.blend(DAY, LATE, eve);
      F.update(t, time, { sunY: lerp(170, 230, eve) });

      /* v47a: Nathanael comes with Philip */
      const come = es(t, 0.05, 0.8);
      const nx = lerp(1500, NX, come), px = lerp(1640, PT ? 1085 : 1130, come);
      const kneel = es(t, 4.1, 4.25) * (1 - es(t, 6.1, 6.25));
      nat.set({ x: nx, y: PY + 2, s: 1.0, flip: true, o: 1 - kneel, walk: come > 0 && come < 1 ? nx * 0.06 : undefined, armF: 10 + bump(t, 2.05, 2.9) * 70 + es(t, 6.2, 6.5) * 20, armB: bump(t, 2.05, 2.9) * 90, head: -bump(t, 3.1, 3.9) * 8, blink: blinkAt(time, 7) });
      natK.set({ x: NX - 20, y: PY + 2, s: 1.0, flip: true, o: kneel, armF: 60 + es(t, 5.05, 5.3) * 40, armB: 90 + es(t, 5.05, 5.3) * 50, head: -10, blink: blinkAt(time, 7) });
      philip.set({ x: px, y: PY + 6, s: 0.98, flip: true, walk: come > 0 && come < 1 ? px * 0.06 : undefined, armF: 10 + bump(t, 1.1, 1.8) * 40, head: -es(t, 7.1, 7.4) * 12, blink: blinkAt(time, 6) });
      /* Jesus: sees him, speaks; raises him; points to the sky */
      const pointUp = es(t, 7.05, 7.35);
      jesus.set({ x: JX, y: PY, s: 1.05, flip: false, armF: 12 + es(t, 0.3, 0.6) * 50 * (1 - es(t, 1.9, 2.1)) + es(t, 3.05, 3.3) * 40 * (1 - es(t, 3.9, 4.1)) + es(t, 6.05, 6.3) * 50 * (1 - pointUp) + pointUp * 20, armB: pointUp * 150, head: -pointUp * 10, blink: blinkAt(time, 2) });
      const awe = es(t, 4.1, 4.5);
      [[andrew, PT ? 500 : 440, 3], [peter, PT ? 585 : 560, 4], [jn, PT ? 675 : 660, 5]].forEach(([p, x, i]) => p.set({ x, y: PY + (i % 2) * 6, s: 1.0, flip: false, armF: 12 + awe * 30, armB: es(t, 7.1, 7.4) * (i === 4 ? 140 : 40), head: -es(t, 7.1, 7.4) * 12, blink: blinkAt(time, i) }));
      pose(jGlow, { x: JX, y: PY - 110, s: 0.6 + awe * 0.5, o: Math.max(0.25, awe * (1 - es(t, 6.9, 7.2) * 0.4)) });

      /* v47b: an Israelite indeed, in whom is no deceit — a clear heart */
      const [nhx, nhy] = headAt(NX, PY + 2, 1, true);
      const hk = es(t, 1.1, 1.35, ease.back) * (1 - es(t, 1.95, 2.1));
      pose(clearHeart, { x: NX - 4, y: PY - 108, s: hk, o: hk > 0.01 ? 1 : 0 });
      const ik = es(t, 1.2, 1.5, ease.out) * (1 - es(t, 1.95, 2.15, ease.in));
      pose(isr, { x: PT ? NX - 25 : NX + 10, y: lerp(-500, 380, ik), r: Math.sin(t * 4.0) * 1.5, o: ik > 0.01 ? 1 : 0 });
      /* v48a: how do you know me? */
      pose(how, { x: nhx - 70, y: nhy - 24, s: es(t, 2.05, 2.25, ease.back), o: seg(t, 2.03, 2.07) * (1 - seg(t, 2.93, 2.98)) });
      /* v48b: I saw you under the fig tree — the memory plate; v50a it returns; v50b it floats away */
      const mk = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 3.95, 4.15, ease.in)) + es(t, 6.05, 6.35, ease.out) * (1 - es(t, 7.05, 7.4, ease.in));
      const small = es(t, 6.0, 6.1);
      pose(memEl, { x: PT ? lerp(955, 1010, small) : lerp(1010, 1060, small), y: lerp(-500, lerp(300, 280, small), mk) - es(t, 7.05, 7.4) * 0, s: lerp(1, 0.72, small), r: Math.sin(t * 2.8) * 1.2, o: mk > 0.01 ? 1 : 0 });
      pose(gazeEl, { o: es(t, 3.3, 3.6) * 0.7 });
      /* v49: Son of God, King of Israel */
      const sk = es(t, 4.2, 4.5, ease.out) * (1 - es(t, 5.9, 6.1, ease.in));
      pose(son, { x: 610, y: lerp(-500, 350, sk), r: Math.sin(t * 3.2) * 1.4, o: sk > 0.01 ? 1 : 0 });
      const kk = es(t, 5.1, 5.45, ease.out) * (1 - es(t, 5.9, 6.1, ease.in));
      pose(king, { x: PT ? 965 : 990, y: lerp(-500, 330, kk), r: Math.sin(t * 3.2 + 1) * 1.4, o: kk > 0.01 ? 1 : 0 });
      const ck = es(t, 5.05, 5.45, ease.out);
      const [jhx, jhy] = headAt(JX, PY, 1.05, false);
      pose(crownEl, { x: jhx, y: lerp(-200, jhy - 62, ck), s: 1, o: ck * (1 - es(t, 6.9, 7.2)) });

      /* v50b: you will see greater things — the sky begins to glow */
      pose(more, { x: jhx + 60, y: jhy - 30, s: es(t, 7.1, 7.3, ease.back), o: seg(t, 7.08, 7.12) });
      const glow = es(t, 7.1, 7.6);
      pose(sg, { x: 800, y: 60, s: 0.5 + glow * 0.6, r: t * 3, o: glow });
      sparks.forEach((sp, i) => {
        const k = seg(t, 7.2 + i * 0.05, 7.8 + i * 0.05);
        pose(sp, { x: 560 + i * 90, y: 260 - (i % 2) * 70 - k * 30, s: bump(t, 7.2 + i * 0.05, 7.9 + i * 0.05) + k * 0.4, r: time * 30, o: k > 0 ? 1 : 0 });
      });

      S.cam.y = -40 * glow;
      S.cam.z = 1.03 + 0.05 * es(t, 3.0, 3.4) * (1 - es(t, 3.9, 4.2)) - 0.02 * glow;
    };
  },
};
