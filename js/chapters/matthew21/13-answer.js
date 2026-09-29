// Mt 21,25b–27 — the leaders huddle and reason: "If we say 'From heaven', he will ask: 'Why then did you not believe
// him?'" — "If we say 'From men'…" — but the crowd's shadows loom on the colonnade, all holding John for a prophet.
// "We don't know." "Neither will I tell you by what authority I do these things" — the answer stays sealed.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { templeCourt, courtFront, priest, elder, heavenIcon, peopleIcon, TWELVE_O, headAt, bubble, card, withFace, faceBits, townsfolk, thought, scrollRolled, strip, shadowPerson, JOHN_B, tr, DAY, FONT } from './lib.js';

const FLOOR = 676;
const JX = 560;

/** a thought cloud with a picture and two short lines of words */
function musing(c, icon, lines, w = 250, h = 150) {
  const txt = lines.map((l, i) => `<text x="16" y="${-58 + 26 + i * 22}" text-anchor="middle" font-family="${FONT}" font-size="18" font-style="italic" fill="${C.ink}">${l}</text>`).join('');
  return thought(c, `<g transform="translate(0 -34) scale(.55)">${icon}</g>`, { w, h }) + txt;
}

export default {
  id: 'mt21-answer',
  beats: [
    { v: 25, cont: true, text: 'Oni zastanawiali się między sobą: «Jeśli powiemy: "z nieba", to nam zarzuci: "Dlaczego więc nie uwierzyliście mu?"' },
    { v: 26 },
    { v: 27, text: 'Odpowiedzieli więc Jezusowi: «Nie wiemy».' },
    { v: 27, cont: true, text: 'On również im odpowiedział: «Więc i Ja wam nie powiem, jakim prawem to czynię.' },
  ],
  cam: { x: [-60, 140], y: [-70, 40], z: [0.95, 1.14] },
  build(S) {
    const c = S.c;
    const { sunEl, cl1 } = templeCourt(S, { skyCols: DAY, floorY: FLOOR + 40, sanctX: 800, sunAt: [1230, 140] });

    /* ---------- the crowd's shadows on the colonnade ---------- */
    const shL = S.layer({ par: 0.34, sh: 1, flat: true });
    shL.add(`<g>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<g transform="translate(${760 + i * 110 + c.rr(-20, 20)} ${FLOOR - 40}) scale(${1.9 + c.rr(-0.2, 0.2)})${i % 2 ? ' scale(-1 1)' : ''}">${shadowPerson(c, townsfolk(c, { armF: 0 }), '#3a2e3c')}</g>`).join('')}</g>`);

    /* ---------- the crowd who held John for a prophet ---------- */
    const crowdL = S.layer({ par: 0.44, sh: 4 });
    const CROWD = [[780, -34], [860, -38], [1320, -30], [1400, -36], [1470, -30]].map(([x, dy], i) => ({ x, y: FLOOR + dy, i, seed: c.rr(0, 9), p: S.puppet(crowdL.add(person(c, townsfolk(c)))) }));
    const prophet = crowdL.add(`<g>${sheet().p(c.ribbon([[0, 0], [0, 190]], 5), C.wood2).out()}<g transform="translate(0 -6)">${sheet().p(c.cut(c.circ(0, 0, 50, 34), 0.5, 5), C.ochre).p(c.cut(c.circ(0, 0, 44, 34), 0.5, 5), C.skyBlue).out()}<g transform="translate(0 36) scale(.3)">${person(c, { ...JOHN_B, halo: false })}</g></g><g transform="translate(0 56)">${strip(c, tr('prorok', 'a prophet'), { size: 17 })}</g></g>`);

    /* ---------- the leaders, huddled ---------- */
    const LD = S.layer({ par: 0.48, sh: 4 });
    const LEADERS = [
      { m: priest(c, 0), x: 900 }, { m: elder(c, 0), x: 1060 }, { m: priest(c, 1), x: 960 },
      { m: elder(c, 1), x: 1120 }, { m: priest(c, 2), x: 1010 }, { m: elder(c, 2), x: 1180 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), y: FLOOR - (i % 2 ? 18 : 4), p: S.puppet(LD.add(withFace(d.m, faceBits(c)))) }));
    LEADERS.forEach((d) => { d.sad = d.p.el.querySelector('[data-part="sad"]'); d.angry = d.p.el.querySelector('[data-part="angry"]'); });

    /* ---------- Jesus and the disciples ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = [0, 2, 1, 3].map((k, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, TWELVE_O[k]))) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));

    /* ---------- cards, thoughts, words ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const skyCard = hanging(fx, card(c, heavenIcon(c), tr('z nieba?', 'from heaven?'), { w: 128, h: 140, face: C.skyVeil }), { x: 610, y: 190, len: 800 });
    const menCard = hanging(fx, card(c, peopleIcon(c), tr('od ludzi?', 'from men?'), { w: 128, h: 140 }), { x: 990, y: 190, len: 800 });
    const think1 = fx.add(`<g>${musing(c, heavenIcon(c), [tr('«Z nieba»? — On powie:', '“From heaven”? — he’ll say:'), tr('„Czemu mu nie uwierzyliście?”', '“Why did you not believe him?”')], 300, 150)}</g>`);
    const think2 = fx.add(`<g>${musing(c, peopleIcon(c), [tr('«Od ludzi»…?', '“From men”…?'), ''], 220, 130)}</g>`);
    const dunno = fx.add(`<g>${bubble(c, [tr('Nie wiemy.', 'We don’t know.')], { size: 20, tail: -1 })}</g>`);
    const sealed = hanging(fx, `<g transform="scale(2.8) rotate(90)">${scrollRolled(c, 50)}</g><g transform="translate(0 -2) scale(1.3)">${sheet().p(c.cut(c.circ(0, 0, 13, 16), 0.5, 3), C.terracotta).p(c.cut(c.star(0, 0, 8, 5, 8, 0), 0.3, 2), shade(C.terracotta, -0.2)).out()}</g><g transform="translate(0 50)">${strip(c, tr('jakim prawem?', 'by what authority?'), { size: 17 })}</g>`, { x: 700, y: 300, len: 800 });
    courtFront(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 140, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);

      /* v25b — they reason among themselves: "From heaven"? */
      const huddle = es(t, 0.0, 0.3) * (1 - es(t, 1.95, 2.15));
      const fear = es(t, 1.2, 1.5) * (1 - es(t, 2.9, 3.2));
      const turnBack = es(t, 2.0, 2.15);
      const shrug = es(t, 2.1, 2.35) * (1 - es(t, 2.9, 3.2));
      LEADERS.forEach((d) => {
        const cx = 1040;
        const x = lerp(d.x, cx + (d.x - cx) * 0.55, huddle) + fear * 30;
        const faceIn = d.x < cx;
        d.p.set({ x, y: d.y, s: 0.9, flip: turnBack > 0.5 ? true : faceIn ? false : true, lean: huddle * (faceIn ? 8 : -8) - fear * 4, head: huddle * 10 - fear * 6, armF: huddle * (d.i % 3 === 0 ? 40 : 10) + shrug * 70 + fear * 20, armB: shrug * 60, blink: blinkAt(T, d.seed) });
        fade(d.angry, huddle * (1 - fear));
        fade(d.sad, fear + shrug * 0.6);
      });
      const t1 = es(t, 0.12, 0.35, ease.back) * (1 - es(t, 0.95, 1.08));
      pose(think1, { x: S.portrait ? 930 : 1000, y: 470, s: t1, o: t1 > 0.02 ? 1 : 0 });
      const t2 = es(t, 1.05, 1.25, ease.back) * (1 - es(t, 1.6, 1.75));
      pose(think2, { x: 1030, y: 470, s: t2, o: t2 > 0.02 ? 1 : 0 });
      swing(skyCard, 610, 190 - bump(t, 0.1, 1.0) * 30 - es(t, 2.2, 2.6) * 700, T, 1.2 + bump(t, 0.1, 1.0) * 2, 1.1, 1);
      swing(menCard, 990, 190 - bump(t, 1.05, 1.95) * 30 - es(t, 2.2, 2.6) * 700, T, 1.2 + bump(t, 1.05, 1.6) * 2, 1.1, 2);

      /* v26 — "From men" — but they fear the crowd, who all hold John to be a prophet */
      const loom = es(t, 1.2, 1.55) * (1 - es(t, 3.1, 3.5));
      shL.fade(loom * 0.3);
      CROWD.forEach((m) => {
        const inK = es(t, 1.2 + m.i * 0.04, 1.55 + m.i * 0.04, ease.out);
        const x = m.x + (m.x < 1100 ? -1 : 1) * (1 - inK) * 500;
        m.p.set({ x, y: m.y, s: 0.86, flip: m.x > 1100, o: seg(t, 1.15, 1.2), walk: inK > 0 && inK < 1 ? x * 0.06 : undefined, armB: inK * (m.i === 1 ? 150 : 60 + (m.i % 2) * 60), armF: inK * 40, head: -inK * 6, blink: blinkAt(T, m.seed) });
      });
      const pk = es(t, 1.3, 1.6, ease.back);
      pose(prophet, { x: 830, y: 330 + (1 - pk) * 500 + es(t, 2.9, 3.25, ease.in) * 520, r: Math.sin(t * 3) * 3, o: seg(t, 1.25, 1.3) * (1 - es(t, 3.0, 3.2)) });

      /* v27a — "We don't know"; v27b — "Neither will I tell you": the answer stays sealed */
      const [lx, ly] = headAt(LEADERS[0].x, LEADERS[0].y, 0.9, true);
      const dk = es(t, 2.12, 2.32, ease.back) * (1 - es(t, 2.95, 3.1));
      pose(dunno, { x: lx + 20, y: ly - 34, s: dk, o: dk > 0.02 ? 1 : 0 });
      const speak = es(t, 3.05, 3.3);
      jesus.set({ x: JX, y: FLOOR, s: 1.04, armF: bump(t, 0.1, 0.9) * 30 + speak * 60, armB: speak * 30, head: speak * 4, blink: blinkAt(T) });
      DIS.forEach((d) => d.p.set({ x: JX - 110 - d.i * 56, y: FLOOR - 12 + (d.i % 2) * 10, s: 0.88, head: bump(t, 2.1, 2.9) * 8, armF: bump(t, 2.2, 2.9) * (d.i === 0 ? 50 : 0), blink: blinkAt(T, d.seed) }));
      const sd = es(t, 3.1, 3.45, ease.back);
      swing(sealed, 700, 300 - (1 - sd) * 700, T, 1.2, 0.8, 3);

      S.cam.x = 60 + es(t, 0, 0.4) * 30 - es(t, 1.2, 1.6) * 10 - es(t, 2.9, 3.3) * 90;
      if (S.portrait) S.cam.x = S.cam.x * 0.3 - 40;
      S.cam.y = -20 + es(t, 1.2, 1.6) * 10;
      S.cam.z = 1.04 + es(t, 0, 0.4) * 0.04 - es(t, 1.2, 1.6) * 0.06;
    };
  },
};
