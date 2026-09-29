// Mt 10,34–36 — on the hill, Jesus with a family gathered on either side of Him. A round plate comes down: the
// earth with a white dove and an olive branch — and the dove lifts off and flies away. In its place a long sword
// of light comes down and hangs, point down. Then, one after another, its light falls between father and son,
// mother and daughter, mother-in-law and daughter-in-law: each pair, who were facing one another, turn back to
// back. Last, the son stands alone in the middle and the whole household turns away from him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { hill, SPRING, globe, dove, flapWings, oliveBranch, folk, headAt, PI } from './lib.js';

const JX = 800;

/** a long sword of light, point down; origin: the hilt (0,0), the blade runs down to +len */
function lightSword(c, len = 300) {
  const s = sheet();
  s.p(c.cut([[-9, 20], [9, 20], [7, len - 30], [0, len], [-7, len - 30]], 0.3, 8), mix(C.stone, C.star, 0.6));
  s.x(c.ribbon([[0, 26], [0, len - 20]], 1.6), '#fffdf4', 'opacity=".9"');
  s.p(c.cut(c.rect(-34, 8, 68, 12), 0.3, 5), C.sun);
  s.p(c.cut(c.rect(-5, -40, 10, 48), 0.3, 5), C.wood2);
  s.p(c.cut(c.circ(0, -46, 9, 12), 0.3, 3), C.sun);
  return `<ellipse cx="0" cy="${len / 2}" rx="60" ry="${len * 0.6}" fill="url(#halo-glow)"/>${s.out()}`;
}

export default {
  id: 'mt10-sword',
  beats: [
    { v: 34, text: 'Nie sądźcie, że przyszedłem pokój przynieść na ziemię.' },
    { v: 34, cont: true, text: 'Nie przyszedłem przynieść pokoju, ale miecz.' },
    { v: 35 },
    { v: 36 },
  ],
  cam: { x: [-30, 30], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const H = hill(S, { skyCols: SPRING });
    const c = S.c;
    const { gfn } = H;

    /* the plate of the earth and the dove of peace; the sword */
    const flies = S.layer({ par: 0.22, sh: 6 });
    const earth = flies.add(`<g><path d="M0 -70V-2000" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${globe(c, 66)}</g>`);
    const dv = flies.add(`<g>${dove(c)}<g transform="translate(34 -8) rotate(70) scale(.5)">${oliveBranch(c, 70)}</g></g>`);
    const swordEl = flies.add(`<g><path d="M0 -86V-2000" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${lightSword(c, 300)}</g>`);

    /* the family on either side of Jesus */
    const P = S.layer({ par: 0.5, sh: 5 });
    const F = [
      { k: 'father', o: { robe: C.wheatRobe, mantle: C.clayMantle, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather }, x: 470, pair: 0 },
      { k: 'son', o: { robe: C.dustyBlue, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather }, x: 548, pair: 0 },
      { k: 'mother', o: { robe: C.mauve, hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.greyHair, skin: C.skin2, beard: 'none' }, x: 626, pair: 1 },
      { k: 'daughter', o: { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.1), hair: C.hair2, skin: C.skin2, beard: 'none' }, x: 700, pair: 1 },
      { k: 'mil', o: { robe: C.tealRobe, mantle: C.stone2, hairStyle: 'veil', veil: C.linen2, veil2: C.stone, hair: C.greyHair, skin: C.skin, beard: 'none' }, x: 930, pair: 2 },
      { k: 'dil', o: { robe: C.ochreRobe, hairStyle: 'veil', veil: C.skyVeil, veil2: shade(C.skyVeil, -0.1), hair: C.hair3, skin: C.skin4, beard: 'none' }, x: 1008, pair: 2 },
      { k: 'brother', o: { robe: C.sageRobe, hair: C.hair3, hairStyle: 'curly', beard: 'short', skin: C.skin3, belt: C.leather }, x: 1086, pair: 3 },
    ].map((m, i) => ({ ...m, i, y: gfn(m.x) + 40 + (i % 2) * 6, first: m.pair < 3 && (i % 2 === 0), seed: c.rr(0, 9), p: S.puppet(P.add(person(c, m.o))) }));
    const slits = [0, 1, 2].map(() => P.add(`<g><path d="${c.poly([[-3, -260], [3, -260], [10, 0], [-10, 0]])}" fill="${C.star}" opacity=".85"/><ellipse cx="0" cy="-120" rx="26" ry="160" fill="url(#halo-glow)"/></g>`));
    const jGlow = P.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));

    return (t, time) => {
      const T = time;
      H.update(T);
      /* v34a — not peace on earth: the dove flies away */
      const ek = es(t, 0.05, 0.35, ease.back) * (1 - es(t, 1.0, 1.3));
      const EX = 800, EY = lerp(-400, 220, ek);
      pose(earth, { x: EX, y: EY, r: Math.sin(T * 0.8) * 1.5, o: ek > 0.002 ? 1 : 0 });
      const off = es(t, 0.8, 1.25);
      pose(dv, { x: EX + 10 + off * 520, y: EY - 76 - off * 240 + Math.sin(off * PI) * -40, s: 1.2, o: ek > 0.002 && off < 0.99 ? 1 : 0 });
      flapWings(dv, off > 0.01 && off < 0.99 ? T * 0.8 + t * 30 : 0, off > 0.01 ? 34 : 8, 7);
      /* v34b — a sword */
      const sk = es(t, 1.05, 1.4, ease.back);
      const SY = lerp(-500, 130, sk);
      pose(swordEl, { x: EX, y: SY, r: Math.sin(T * 0.7) * 1.2, o: sk > 0.002 ? 1 : 0 });
      jesus.set({ x: JX, y: gfn(JX) + 10, s: 1.04, armF: 20 + bump(t, 0.1, 0.9) * 50 + bump(t, 1.1, 1.9) * 70, armB: 10 + bump(t, 1.2, 1.9) * 120, head: -2 - bump(t, 3.0, 3.9) * 6, blink: blinkAt(T, 1) });
      pose(jGlow, { x: JX, y: gfn(JX) - 170, o: 0.5 });

      /* v35 — the light falls between each pair and they turn back to back */
      const CUT = [2.08, 2.34, 2.6];
      slits.forEach((sl, i) => {
        const a = F[i * 2], b = F[i * 2 + 1];
        const k = bump(t, CUT[i], CUT[i] + 0.5);
        pose(sl, { x: (a.x + b.x) / 2, y: Math.max(a.y, b.y) + 4, sy: Math.max(0.01, es(t, CUT[i], CUT[i] + 0.12)), o: k });
      });
      // v36 — the son alone; the household turns from him
      const alone = es(t, 3.05, 3.35);
      const SONX = F[1].x;
      F.forEach((m) => {
        const i = m.pair < 3 ? m.pair : -1;
        const split = i >= 0 ? es(t, CUT[i] + 0.05, CUT[i] + 0.2) : 0;
        const faceIn = m.pair < 3 ? m.first : true;             // facing right (towards the partner) before the split
        let flip = split > 0.5 ? faceIn : !faceIn;
        let x = m.x + (split * 12) * (m.first ? -1 : 1);
        let armF = 20 + (1 - split) * 30 * (t > 0.5 ? 1 : 0), head = split * 8, armB = 0;
        if (m.k === "son") { flip = alone > 0.5 ? false : flip; armF = 20 + alone * 70; head = split * 8 * (1 - alone) - alone * 4; }
        else if (alone > 0) {
          const turn = es(t, 3.2 + m.i * 0.04, 3.4 + m.i * 0.04);
          flip = turn > 0.5 ? m.x < SONX : flip;
          armF = lerp(armF, 60, turn); armB = turn * 50; head = lerp(head, 10, turn);
        }
        m.p.set({ x, y: m.y, s: 0.9, flip, walk: m.k === 'son' && alone > 0 && alone < 1 ? x * 0.06 : undefined, armF, armB, head, blink: blinkAt(T, m.seed) });
      });

      S.cam.y = -bump(t, 0, 2.0) * 30;
      S.cam.z = 1 + es(t, 2.0, 2.3) * 0.04;
    };
  },
};
