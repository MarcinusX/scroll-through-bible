// Mk 12,6–9 — the beloved son. The far-away plate comes close: father and son, a heart between them.
// The son walks in at the gate; the tenants whisper "this is the heir" — and the light turns to dusk.
// The killing is a shadow play against the setting sun; a white cloth is lowered outside the gate.
// Then the owner comes, the wicked tenants are lifted off the stage on their strings, and new ones come in.
import { C, person, blinkAt, pose, lerp, hanging, mix } from '../kit.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { vineyardSet, VY, VINE_DAY, VINE_DUSK, VINE_NIGHT, LOOK, tenant, newTenant, hoe, bigKey, bubble, thought, moodPuppet, drapeCloth, shadowPerson, glowHeart, bigQuestion, towerParts, wisp, sheet, shade } from './lib.js';

const G = VY.G;
const TX = [724, 792, 860];
const SX = 968;                 // where the son stops
const SHADOW = '#3a2630';

export default {
  id: 'm12-son',
  parable: true,
  beats: [
    { v: 6, text: 'Miał jeszcze jednego, ukochanego syna.' },
    { v: 6, cont: true, text: 'Posłał go jako ostatniego do nich, bo sobie mówił: "Uszanują mojego syna".' },
    { v: 7, text: 'Lecz owi rolnicy mówili nawzajem do siebie: "To jest dziedzic.' },
    { v: 7, cont: true, text: 'Chodźcie, zabijmy go, a dziedzictwo będzie nasze".' },
    { v: 8 },
    { v: 9, text: 'Cóż uczyni właściciel winnicy?' },
    { v: 9, cont: true, text: 'Przyjdzie i wytraci rolników, a winnicę odda innym.' },
  ],
  cam: { x: [-20, 130], y: [0, 40], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const set = vineyardSet(S);
    // phone: the tower, the far-land plate and the sun come in from the edges (as in m12-vineyard)
    const TOWER = P ? 560 : VY.TOWER;
    const AB = P ? [990, 290] : VY.ABROAD;
    // the vineyard is complete: pose everything once (still pieces stay cached)
    const stocks = [...set.backRow];
    set.wallB.forEach((w) => pose(w.el, { x: w.x, y: w.y }));
    set.tower.forEach((el) => pose(el, { x: TOWER, y: 606 }));
    pose(set.gateBack, { x: VY.GATE0, y: VY.WALL_F - 4 });
    set.grapesB.forEach((g) => pose(g.el, { x: g.x, y: g.y }));
    stocks.forEach((v) => pose(v.el, { x: v.x, y: v.y }));

    /* dusk: a plum veil over the back of the set */
    const veil1 = S.layer({ par: 0.4, sh: 1, flat: true });
    veil1.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.plumRobe, 0.4)}" opacity=".42"/>`);
    // a big low sun for the shadow play
    const sunL = S.layer({ par: 0.3, sh: 2, flat: true });
    const bigSun = sunL.add(`<g><circle r="330" fill="url(#warm-glow)"/><path d="${c.cut(c.circ(0, 0, 150, 60), 0.6, 6)}" fill="${mix(C.sunDeep, C.dusk, 0.3)}"/><path d="${c.cut(c.circ(-10, -10, 118, 50), 0.5, 6)}" fill="${mix(C.sun, C.apricot, 0.5)}"/></g>`);

    /* the far-away plate (father & son), the heart, his words */
    const near = S.layer({ par: 0.12, sh: 5 });
    const heartEl = near.add(`<g>${glowHeart(c, 20)}</g>`);
    const says = near.add(`<g>${bubble(c, tr(['Uszanują', 'mojego syna'], ['They will respect', 'my son']), { size: 19, tail: 1 })}</g>`);
    const qEl = hanging(near, bigQuestion(c, 58, C.cream), { x: 800, y: -300, len: 500 });

    /* the people: colour cut-outs and their shadow-play twins */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const ten = [0, 1, 2].map((i) => ({ i, p: moodPuppet(S, pl, c, { ...tenant(i), holdF: hoe(c) }), sh: S.puppet(pl.add(shadowPerson(c, { ...tenant(i) }, SHADOW))), seed: c.rr(0, 9) }));
    const son = moodPuppet(S, pl, c, { ...LOOK.son });
    const sonSh = S.puppet(pl.add(shadowPerson(c, LOOK.son, SHADOW)));
    const owner = S.puppet(pl.add(person(c, { ...LOOK.owner, holdF: `<g transform="rotate(-10)"><path d="${c.ribbon([[0, -60], [2, 80]], 5)}" fill="${C.wood2}"/></g>` })));
    const fresh = [0, 1, 2].map((i) => ({ i, p: S.puppet(pl.add(person(c, newTenant(i)))), seed: c.rr(0, 9) }));
    const keyEl = pl.add(`<g>${bigKey(c)}</g>`);
    const whisper = pl.add(`<g>${bubble(c, tr('To jest dziedzic!', 'This is the heir!'), { size: 18, tail: -1 })}</g>`);
    const plot = pl.add(`<g>${thought(c, `<g transform="translate(-14 14) scale(.28)">${towerParts(c, 90, 236).join('')}</g><g transform="translate(6 -4) scale(.8)">${bigKey(c)}</g>`, { w: 96, h: 74 })}</g>`);
    const smoke = [0, 1].map(() => pl.add(`<g>${wisp(c, 1.4, '#4a3a4a')}</g>`));
    // strings that lift the wicked tenants away
    const strings = ten.map(() => pl.add(`<path d="M0 -1600V-190" stroke="rgba(74,54,34,.6)" stroke-width="1.4" fill="none"/>`));

    const fr = set.front();
    fr.frontRow.forEach((v) => pose(v.el, { x: v.x, y: v.y }));
    fr.grapesF.forEach((g) => pose(g.el, { x: g.x, y: g.y }));
    pose(fr.press, { x: VY.PRESS, y: 720, s: 1.25 });
    fr.wallF.forEach((w) => pose(w.el, { x: w.x, y: w.y }));
    pose(fr.gateFront, { x: VY.GATE1, y: VY.WALL_F });
    pose(fr.lintel, { x: VY.GATE0 - 12, y: VY.WALL_F - 170 });
    const clothL = S.layer({ par: 0.55, sh: 5 });
    const cloth = clothL.add(`<g>${drapeCloth(c, 110, 92)}</g>`);
    const veil2 = S.layer({ par: 0.6, sh: 1, flat: true });
    veil2.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.plumRobe, 0.5)}" opacity=".3"/>`);

    return (t, time) => {
      const T = time;
      // light: day → dusk (whispers) → deep dusk (the killing) → day again (the vineyard given to others)
      const dusk = es(t, 2.2, 3.6), deep = es(t, 3.8, 4.1), dawn = es(t, 6.35, 6.8);
      const k1 = dusk * (1 - dawn), k2 = deep * (1 - es(t, 5.0, 5.6)) * (1 - dawn);
      set.sk.blend(VINE_DAY, VINE_DUSK, k1);
      if (k2 > 0) set.sk.blend(VINE_DUSK, VINE_NIGHT, k2);
      veil1.fade(Math.max(k1 * 0.6, k2));
      veil2.fade(k2 * 0.9);
      sunL.fade(Math.min(1, deep * 1.2) * (1 - es(t, 5.0, 5.6)));
      pose(bigSun, { x: 830, y: lerp(560, 600, seg(t, 4, 5)) });
      set.update(t, T, { sunX: (P ? 600 : 560) - es(t, 0, 4) * 200, sunY: 180 + es(t, 1, 3.8) * 300 - dawn * 300 });

      /* v6a — the plate comes close: father and son, a heart between them */
      const big = es(t, 0.05, 0.4) * (1 - es(t, 1.3, 1.6));
      pose(set.plateEl, { x: lerp(AB[0], 800, big), y: lerp(AB[1], 300, big), s: 1 + big * 1.1, r: Math.sin(T * 0.8) * 1.2 * (1 - big) });
      const sonGone = seg(t, 1.45, 1.5);
      const sendOut = bump(t, 1.2, 1.7);
      set.pOwner.set({ x: 0, y: 0, s: 1, flip: false, armF: 40 + big * 50 + sendOut * 40, armB: 20, head: big * 8, blink: blinkAt(T, 4) });
      set.pSon.set({ x: 0, y: 0, s: 1, flip: true, o: (1 - sonGone) * es(t, 0.2, 0.3), armF: big * 30, head: -big * 6, blink: blinkAt(T, 7) });
      const hk = es(t, 0.35, 0.55, ease.back) * (1 - es(t, 1.2, 1.35));
      pose(heartEl, { x: 790, y: 150 + Math.sin(T * 2) * 3, s: hk * (1 + Math.sin(T * 3) * 0.05), o: hk > 0.02 ? 1 : 0 });
      const sk = es(t, 1.05, 1.2, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(says, { x: lerp(620, AB[0] - (P ? 165 : 150), es(t, 1.3, 1.6)), y: lerp(210, AB[1] + 30, es(t, 1.3, 1.6)), s: sk, o: sk > 0.02 ? 1 : 0 });

      /* v6b — the son walks in at the gate */
      const inK = P ? es(t, 1.45, 1.8) : es(t, 1.5, 1.95);   // phone: he is through the gate by the pause
      const shadow = seg(t, 4.02, 4.08) * (1 - seg(t, 5.02, 5.08));
      const seize = es(t, 4.12, 4.3) * (1 - es(t, 4.9, 5.2)), fall = es(t, 4.32, 4.46, ease.in), carry = es(t, 4.5, 4.86);
      const sonX = lerp(1420, SX, inK);
      son.set({ x: sonX, y: G + 2, s: 0.98, flip: true, walk: inK > 0 && inK < 1 ? sonX * 0.05 : undefined, armF: 20 + bump(t, 1.95, 2.3) * 40, head: -es(t, 2.2, 2.5) * 6, blink: blinkAt(T, 3), o: (inK > 0 ? 1 : 0) * (1 - shadow) * (t < 4.5 ? 1 : 0) });
      son.mood({ sad: es(t, 3.2, 3.6) });
      // shadow play: he is seized, falls, is carried out through the gate
      const cx = lerp(SX + 40, P ? 1075 : 1210, carry);
      sonSh.set({
        x: carry > 0 ? cx : SX + fall * 20, y: carry > 0 ? G - 70 : G + 2, s: 0.98, flip: true,
        r: carry > 0 ? 88 : fall * 80, armF: 20 + fall * 60, o: shadow * (1 - es(t, 4.84, 4.9)),
      });
      const ck = es(t, 4.82, 5.0, ease.out);
      pose(cloth, { x: P ? 1095 : 1188, y: lerp(G - 420, G + 6, ck), o: (ck > 0.001 ? 1 : 0) * (P ? 1 - es(t, 5.0, 5.3) : 1) });   // phone: it fades as the camera swings back (it would sit at the edge)

      /* the tenants: whisper, plot, seize — then are lifted away */
      const huddle = es(t, 2.05, 2.3) * (1 - es(t, 3.9, 4.05));
      const lift = es(t, 6.28, 6.6, ease.in);
      const OUT = P ? [1045, 1100] : [1150, 1280];   // where the two carry him (phone: the camera follows them to the gate)
      ten.forEach((m) => {
        let x = TX[m.i] + huddle * [30, 0, -30][m.i] + seize * [180, 140, 90][m.i];
        let y = G + (m.i === 1 ? 6 : 0);
        // two carry him out
        if (carry > 0 && m.i < 2) x = lerp(TX[m.i] + [180, 140][m.i], OUT[m.i], carry);
        const back = es(t, 4.9, 5.2);
        if (t > 4.9) x = lerp(m.i < 2 ? OUT[m.i] : TX[m.i] + 90, TX[m.i], back);
        const flip = m.i === 2 && huddle > 0.5 ? true : (t > 4.9 && t < 5.2 ? true : false);
        const walking = (carry > 0 && carry < 1 && m.i < 2) || (back > 0 && back < 1) || (seize > 0 && seize < 1);
        const common = {
          x, y: y - lift * 520, s: 0.96, flip, walk: walking ? x * 0.05 + m.i : undefined, blink: blinkAt(T, m.seed),
          armF: 20 + bump(t, 2.3, 2.9) * (m.i === 0 ? 80 : 0) + seize * 60 + (carry > 0 && m.i < 2 ? 70 : 0) + lift * 40, armB: seize * 40 + lift * 60,
          head: huddle * [8, 14, -8][m.i] + es(t, 5.1, 5.4) * -14, lean: huddle * [10, 0, -10][m.i],
        };
        m.p.set({ ...common, o: 1 - shadow });
        m.p.mood({ angry: es(t, 2.9, 3.1) * (1 - es(t, 5.05, 5.2)), sad: es(t, 5.2, 5.4) });
        m.sh.set({ ...common, o: shadow });
        pose(strings[m.i], { x: x + 2, y: y - lift * 520 - 0, o: es(t, 6.05, 6.2) * (1 - seg(t, 6.6, 6.62)) });
      });
      const wk = es(t, 2.2, 2.4, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(whisper, { x: TX[0] + 40, y: G - 212, s: wk, o: wk > 0.02 ? 1 : 0 });
      const pk = es(t, 3.05, 3.25, ease.back) * (1 - es(t, 3.9, 4.0));
      pose(plot, { x: TX[1] + 6, y: G - 200, s: pk, o: pk > 0.02 ? 1 : 0 });
      smoke.forEach((el, i) => {
        const k = ((T * 0.35 + i * 0.5) % 1);
        const on = es(t, 3.1, 3.3) * (1 - es(t, 3.95, 4.05));
        pose(el, { x: TX[i * 2] + 10, y: G - 200 - k * 60, s: 0.6 + k * 0.6, o: on * (1 - k) });
      });

      /* v9a — what will the owner do? */
      const qk = es(t, 5.05, 5.4, ease.out) * (1 - es(t, 5.9, 6.1));
      pose(qEl, { x: 800, y: lerp(-800, 250, qk), r: Math.sin(T * 1.2) * 3 });

      /* v9b — he comes; the tenants are lifted off; new tenants take the key */
      const oin = es(t, 6.0, 6.3);
      const ox = lerp(1420, 1000, oin);
      owner.set({ x: ox, y: G + 2, s: 1.04, flip: true, walk: oin > 0 && oin < 1 ? ox * 0.05 : undefined, armF: 30 + bump(t, 6.2, 6.5) * 60 + es(t, 6.75, 6.9) * 40, armB: bump(t, 6.25, 6.55) * 120, head: -bump(t, 6.2, 6.5) * 8, blink: blinkAt(T, 1), o: oin > 0 ? 1 : 0 });
      fresh.forEach((m) => {
        const k = es(t, 6.5 + m.i * 0.06, 6.85 + m.i * 0.06);
        const x = lerp(180 - m.i * 60, TX[m.i] + 30, k);
        m.p.set({ x, y: G + (m.i === 1 ? 6 : 0), s: 0.96, walk: k > 0 && k < 1 ? x * 0.05 + m.i : undefined, armF: 20 + es(t, 6.85, 6.95) * (m.i === 2 ? 60 : 0) + bump(t, 6.8, 7) * 40, armB: bump(t, 6.8, 7.0) * 70, head: -4, blink: blinkAt(T, m.seed), o: k > 0 ? 1 : 0 });
      });
      const kk = es(t, 6.82, 6.97);
      pose(keyEl, { x: lerp(ox - 44, TX[2] + 70, kk), y: G - 104 - Math.sin(kk * Math.PI) * 30, r: 20 - kk * 30, s: 0.9, o: t > 6.75 ? 1 : 0 });

      S.cam.z = 1.12 + big * 0.02 + es(t, 3.9, 4.2) * 0.04 * (1 - es(t, 5, 5.4));
      S.cam.y = 40;
      S.cam.x = -10 + es(t, 3.9, 4.2) * (P ? 140 : 20) * (1 - es(t, 5, 5.4));
    };
  },
};
