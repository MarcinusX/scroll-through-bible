// Mk 10,41–45 — the ten are indignant with James and John (frowns, fists, little puffs of steam).
// Jesus calls them together. A picture board comes down: a ruler on a high seat, people bowed under him,
// his great men with rods. "It shall not be so among you" — the board folds shut and flies away.
// James and John pick up the jug and the cups and serve the others; then Jesus himself ties on a towel,
// kneels with a basin before Peter. "Not to be served but to serve — and to give his life as a ransom
// for many": he stands with open arms and his light runs out along the road to a great many people.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, hanging, swing, crowdPerson } from '../kit.js';
import { bush, rock, olive } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { roadSet, shadeTree, TWELVE, LOOK, highSeat, crown, addToHead, withFace, faceBits, face, basinBowl, towel, ewer, cup, headAt, bang, heart } from './lib.js';

const GY = 676;
const JX = 780;

/** a puff of steam (indignation); origin centre */
function puff(c) {
  let d = '';
  for (let i = 0; i < 4; i++) d += c.cut(c.circ(i * 7 - 10, -i * 5, 6 + i, 10), 0.3, 3);
  return `<path d="${d}" fill="${C.cream}" opacity=".9"/>`;
}
function rod(c) { return `<path d="${c.ribbon([[0, 30], [0, -70]], 4)}" fill="${C.wood2}"/>`; }

export default {
  id: 'm10-servant',
  beats: [
    { v: 41 },
    { v: 42, text: 'A Jezus przywołał ich do siebie i rzekł do nich:' },
    { v: 42, cont: true, text: '«Wiecie, że ci, którzy uchodzą za władców narodów, uciskają je, a ich wielcy dają im odczuć swą władzę.' },
    { v: 43, text: 'Nie tak będzie między wami.' },
    { v: 43, cont: true, text: 'Lecz kto by między wami chciał się stać wielkim, niech będzie sługą waszym.' },
    { v: 44 },
    { v: 45, text: 'Bo i Syn Człowieczy nie przyszedł, aby Mu służono, lecz żeby służyć' },
    { v: 45, cont: true, text: 'i dać swoje życie na okup za wielu».' },
  ],
  cam: { x: [-30, 30], y: [-60, 30], z: [0.94, 1.12] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.72, jerX: 1220, farY: 420, roadX: 840, trees: 14, clouds: [[450, 150, 160], [1080, 120, 120]] });
    const glowL = S.layer({ par: 0.08, sh: 1, flat: true });
    const burst = glowL.add(`<g opacity="0">${rays(c, { n: 24, r0: 60, r1: 1100, spread: 0.045, color: '#fff3cf' })}<circle r="300" fill="url(#halo-glow)"/></g>`);
    const back = S.layer({ par: 0.35, sh: 3 });
    back.add(shadeTree(c, 330, 640, 1.1) + olive(c, 1400, 610, 0.9));
    // the many, far along the road and the hills (verse 45)
    const manyL = S.layer({ par: 0.3, sh: 2 });
    const MANY = Array.from({ length: 22 }, (_, i) => {
      const x = 380 + (i % 11) * 82 + c.rr(-20, 20), y = 588 + Math.floor(i / 11) * 18 + c.rr(-4, 4);
      return { i, x, y, p: S.puppet(manyL.add(person(c, crowdPerson(c)))), glow: manyL.add(`<g opacity="0"><circle r="26" fill="url(#halo-glow)"/></g>`), seed: c.rr(0, 9) };
    });

    /* the picture board: rulers who lord it over the nations */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const BW = 400, BH = 230;
    const board = sheet().p(c.cut(c.rect(-BW / 2, 0, BW, BH), 0.6, 8), C.wood2).p(c.cut(c.rect(-BW / 2 + 10, 10, BW - 20, BH - 20), 0.5, 8), mix(C.parchment, C.dune, 0.4)).out();
    const k = 0.44;
    const king = person(c, { ...LOOK.king, pose: 'sit' });
    const kingM = addToHead(king, crown(c));
    const bowed = (i) => person(c, { ...crowdPerson(c), pose: 'kneel' });
    const guard = () => person(c, { robe: mix(C.storm, C.clay, 0.3), mantle: C.terracotta, belt: C.leather, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, holdF: rod(c) });
    const boardEl = hanging(hangL, `<g class="fold">${board}
      <g transform="translate(0 ${BH - 14}) scale(.5)">${highSeat(c, 150)}</g>
      <g transform="translate(-2 ${BH - 14 - 104}) scale(${k})"><g class="king">${kingM}</g></g>
      ${[-150, -110, 100, 140].map((x, i) => `<g transform="translate(${x} ${BH - 14}) scale(${k * 0.9}) ${x > 0 ? 'scale(-1 1)' : ''}"><g class="bow" data-i="${i}">${bowed(i)}</g></g>`).join('')}
      ${[-70, 64].map((x) => `<g transform="translate(${x} ${BH - 14}) scale(${k}) ${x > 0 ? 'scale(-1 1)' : ''}"><g class="guard">${guard()}</g></g>`).join('')}
    </g>`, { x: 800, y: 110, len: 800 });
    const fold = boardEl.querySelector('.fold');
    const kingP = S.puppet(boardEl.querySelector('.king .fig'));
    const bowP = Array.from(boardEl.querySelectorAll('.bow .fig')).map((el) => S.puppet(el));
    const guardP = Array.from(boardEl.querySelectorAll('.guard .fig')).map((el) => S.puppet(el));

    /* the Twelve and Jesus */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const POS = {
      peter: [640, GY + 6], andrew: [575, GY - 30], philip: [515, GY - 10], bartholomew: [455, GY - 34], matthew: [505, GY + 22], thomas: [575, GY + 26],
      jamesA: [1000, GY - 30], thaddaeus: [1060, GY - 8], simonZ: [1120, GY - 32], judas: [1110, GY + 20],
      james: [930, GY + 10], john: [985, GY + 26],
    };
    const ORDER = [...TWELVE.filter((d) => d.k !== 'james' && d.k !== 'john'), TWELVE[1], TWELVE[2]];
    const DIS = ORDER.map((d, i) => {
      const el = pL.add(withFace(person(c, { ...d.o, holdF: d.k === 'john' ? `<g transform="translate(0 8) rotate(-20) scale(1.25)">${ewer(c)}</g>` : d.k === 'james' ? `<g transform="translate(0 4) rotate(-10) scale(1.7)">${cup(c)}</g>` : '' }), faceBits(c)));
      const [x, y] = POS[d.k];
      return { ...d, i, el, p: S.puppet(el), x, y, seed: c.rr(0, 9), flip: x > JX };
    });
    const byK = Object.fromEntries(DIS.map((d) => [d.k, d]));
    const jStandEl = pL.add(person(c, { ...CAST.jesus, holdF: '' }));
    const jKneelEl = pL.add(person(c, { ...CAST.jesus, pose: 'kneel' }));
    const jStand = S.puppet(jStandEl), jKneel = S.puppet(jKneelEl);
    const fxL = S.layer({ par: 0.5, sh: 6 });
    const basinEl = fxL.add(`<g opacity="0">${basinBowl(c, 80)}</g>`);
    const towelEl = fxL.add(`<g opacity="0">${towel(c, 70)}</g>`);
    const puffs = DIS.map(() => fxL.add(`<g opacity="0">${puff(c)}</g>`));
    const hearts = DIS.map(() => fxL.add(`<g opacity="0">${heart(c, 10)}</g>`));
    const serveGlow = fxL.add(`<g opacity="0"><circle r="170" fill="url(#warm-glow)"/></g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 210, 990, 220, C.sage, C.moss) + rock(c, 1400, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 8) * 40 });
      R.sk.blend(['#cfe0da', '#efe6cd', '#f6e8cf'], ['#dcd6c8', '#f6dcb4', '#f8e0bf'], es(t, 5, 8));

      /* beat 0: the ten are indignant */
      const angry = es(t, 0.05, 0.3) * (1 - es(t, 1.05, 1.3));
      const gather = es(t, 1.05, 1.6);
      const serve = es(t, 4.05, 4.4) * (1 - es(t, 5.0, 5.3));
      const kneel = es(t, 5.02, 5.1) * (1 - es(t, 6.95, 7.02));
      const open = es(t, 7.05, 7.4);
      DIS.forEach((d) => {
        const isJJ = d.k === 'james' || d.k === 'john';
        let x = lerp(d.x, lerp(d.x, JX, 0.18), gather), y = d.y;
        // James & John go round the others with the jug and a cup
        const route = isJJ ? serve : 0;
        if (isJJ) {
          x = lerp(x, d.k === 'john' ? 560 : 1030, route);
          y = lerp(y, GY + 44, route);
        }
        const amazed = es(t, 5.1, 5.4) * (1 - open);
        const walking = (gather > 0 && gather < 1) || (route > 0 && route < 1);
        const flipNow = isJJ && route > 0.02 ? (d.k === 'john' ? true : false) : d.flip;
        d.p.set({ x, y, s: 0.9 + (y - GY) / 500, flip: flipNow, walk: walking ? x * 0.07 + d.i : undefined,
          armF: isJJ ? (18 + route * 70 - angry * 10) : angry * (40 + Math.sin(T * 6 + d.i) * 12) + amazed * 40 + open * 30,
          armB: isJJ ? route * 30 : angry * (d.i % 2 ? 100 : 20) + amazed * (d.i % 3 === 0 ? 90 : 0),
          head: isJJ ? angry * 10 - route * 3 : -angry * 4 - open * 10, lean: isJJ ? angry * 5 : -angry * 2,
          blink: blinkAt(T, d.seed) });
        face(d.el, 'angry', isJJ ? 0 : angry);
        face(d.el, 'sad', isJJ ? angry : 0);
        const [hx, hy] = headAt(x, y, 0.9, flipNow);
        pose(puffs[d.i], { x: hx + (d.i % 2 ? 22 : -22), y: hy - 30 - (T ? (T * 30) % 20 : 8), s: 0.9, o: isJJ ? 0 : angry * (T ? 0.5 + 0.5 * Math.sin(T * 5 + d.i) : 1) });
        pose(hearts[d.i], { x: hx, y: hy - 44 - es(t, 7.2, 8) * 20, s: es(t, 7.15 + d.i * 0.03, 7.35 + d.i * 0.03, ease.back), o: t > 7.15 ? 1 : 0 });
      });

      /* Jesus: calls them (1), speaks of rulers (2), not so (3) — kneels with basin and towel (5–6), opens his arms (7) */
      const call = es(t, 1.02, 1.3) * (1 - es(t, 1.9, 2.05));
      const notSo = bump(t, 3.02, 3.9);
      jStand.set({ x: JX, y: GY, s: 1.04, o: 1 - kneel, armF: 16 + call * 110 + es(t, 2.05, 2.3) * 40 * (1 - es(t, 2.9, 3.05)) + notSo * 70 + open * 90, armB: call * 30 + notSo * 20 + open * 140 + es(t, 4.4, 4.9) * 30 * (1 - kneel), head: -notSo * 4 * Math.sin(t * 22) - open * 10 + Math.sin(T * 0.6), blink: blinkAt(T) });
      const pet = byK.peter;
      jKneel.set({ x: pet.x + 70, y: pet.y + 4, s: 1, flip: true, o: kneel, armF: 60 + Math.sin(T * 1.5) * 8, armB: 40, head: 12, blink: blinkAt(T, 1) });
      pose(basinEl, { x: pet.x + 22, y: pet.y + 8, o: es(t, 5.05, 5.2) * (1 - es(t, 6.95, 7.05)) });
      const towelOn = es(t, 4.45, 4.7) * (1 - es(t, 6.95, 7.05));
      pose(towelEl, { x: kneel > 0.5 ? pet.x + 84 : JX + 18, y: kneel > 0.5 ? pet.y - 76 : GY - 132, r: 8, o: towelOn });
      pose(serveGlow, { x: pet.x + 40, y: pet.y - 60, s: 0.8 + es(t, 6.0, 6.5) * 0.3, o: es(t, 5.1, 5.4) * (1 - es(t, 6.95, 7.2)) * 0.7 });

      /* the board: rulers lord it over them (2), folded away (3) */
      const bd = es(t, 2.02, 2.35, ease.back), shut = es(t, 3.05, 3.35), fly = es(t, 3.3, 3.7);
      swing(boardEl, 800, 110 - (1 - bd) * 1100 - fly * 1100, T, 0.8, 0.6);
      pose(fold, { sy: 1 - shut * 0.94 });
      kingP.set({ x: 0, y: 0, s: 1, armF: 70 + Math.sin(T * 2) * 8 * bd, armB: 40, head: -6 });
      bowP.forEach((b, i) => b.set({ x: 0, y: 0, s: 1, lean: 24, head: 20, armF: 70 }));
      guardP.forEach((g) => g.set({ x: 0, y: 0, s: 1, armF: 60 + Math.sin(T * 3) * 20 * bd, armB: 10 }));

      /* verse 45b: a ransom for many — light pours out from him along the road to many */
      pose(burst, { x: JX, y: GY - 150, s: 0.3 + open * 0.8, r: t * 6, o: open * 0.8 });
      MANY.forEach((m) => {
        const reach = es(t, 7.2 + Math.abs(m.x - JX) / 1400, 7.5 + Math.abs(m.x - JX) / 1400);
        m.p.set({ x: m.x, y: m.y, s: 0.36, flip: m.x > JX, o: es(t, 6.9, 7.2), armF: reach * 60, armB: reach * 90, head: -reach * 8, blink: blinkAt(T, m.seed) });
        pose(m.glow, { x: m.x, y: m.y - 40, o: reach * 0.9 });
      });

      S.cam.z = 1 + es(t, 0.9, 1.5) * 0.05 + es(t, 4.9, 5.3) * 0.05 - es(t, 6.9, 7.4) * 0.12;
      S.cam.y = -es(t, 1.9, 2.3) * 40 * (1 - es(t, 3.3, 3.7)) + es(t, 4.9, 5.3) * 20 - es(t, 6.9, 7.4) * 40;
      S.cam.x = -es(t, 4.9, 5.3) * 20 * (1 - es(t, 6.9, 7.4));
    };
  },
};
