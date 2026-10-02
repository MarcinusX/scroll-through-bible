// Mt 21,37–41 — the son. The far-away plate comes close: father and son, a heart between them — "they will respect
// my son". He walks in at the gate; the farmers whisper "this is the heir", plot over the key and the tower — and the
// light turns to dusk. They seize him, drag him out through the gate, and outside the vineyard he falls: a shadow
// play against the setting sun, a white cloth lowered. "When the lord of the vineyard comes, what will he do?" The
// owner comes, the wicked farmers are lifted off the stage on their strings, new farmers take the key — and bring
// him a basket of grapes in its season.
import { C, person, blinkAt, pose, lerp, hanging, mix, sky } from '../kit.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { vineyardSet, VY, VINE_DUSK, VINE_NIGHT, L12 as LOOK, tenant, newTenant, hoe, bigKey, basketCut, bubble, thought, moodPuppet, drapeCloth, shadowPerson, bigQuestion, towerParts, tr } from './lib.js';
import { glowHeart, wisp } from '../mark12/lib.js';

const G = VY.G;
const TX = [724, 792, 860];
const SX = 968;                 // where the son stops
const OUT0 = 1140;              // where he falls, outside the gate
const SHADOW = '#3a2630';

export default {
  id: 'mt21-son',
  parable: true,
  beats: [
    { v: 37 },
    { v: 38, text: 'Lecz rolnicy zobaczywszy syna mówili do siebie: "To jest dziedzic;' },
    { v: 38, cont: true, text: 'chodźcie zabijmy go, a posiądziemy jego dziedzictwo".' },
    { v: 39 },
    { v: 40 },
    { v: 41, text: 'Rzekli Mu: «Nędzników marnie wytraci,' },
    { v: 41, cont: true, text: 'a winnicę odda w dzierżawę innym rolnikom, takim, którzy mu będą oddawali plon we właściwej porze».' },
  ],
  cam: { x: [-20, 260], y: [0, 40], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    // phone: the far land and the tower kept inside the frame
    const ABROAD = S.portrait ? [975, 250] : VY.ABROAD, TOWER = S.portrait ? 545 : VY.TOWER;
    // phone: he falls just at the gate and both farmers stand left of him, all inside the frame
    const OUT = S.portrait ? 1080 : OUT0, DRAG_TO = S.portrait ? [-170, -90] : [-70, 60];
    const set = vineyardSet(S);
    // dusk and night: two more skies, faded over the day sky (straight after it in the stack)
    const duskL = sky(S, VINE_DUSK, { name: 'dusk', rise: 0 }).layer;
    const nightL = sky(S, VINE_NIGHT, { name: 'night', rise: 0 }).layer;
    set.sk.layer.el.after(duskL.el);
    duskL.el.after(nightL.el);
    // the vineyard is complete: pose everything once (still pieces stay cached)
    set.wallB.forEach((w) => pose(w.el, { x: w.x, y: w.y }));
    set.tower.forEach((el) => pose(el, { x: TOWER, y: 606 }));
    pose(set.gateBack, { x: VY.GATE0, y: VY.WALL_F - 4 });
    set.grapesB.forEach((g) => pose(g.el, { x: g.x, y: g.y }));
    set.backRow.forEach((v) => pose(v.el, { x: v.x, y: v.y }));

    /* dusk: a plum veil over the back of the set; a big low sun for the shadow play */
    const veil1 = S.layer({ par: 0.4, sh: 1, flat: true });
    veil1.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.plumRobe, 0.4)}" opacity=".42"/>`);
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
    const fresh = [0, 1, 2].map((i) => ({ i, p: S.puppet(pl.add(person(c, { ...newTenant(i), holdB: i === 2 ? `<g transform="translate(-4 -14)">${basketCut(c, { full: true })}</g>` : '' }))), seed: c.rr(0, 9) }));
    const keyEl = pl.add(`<g>${bigKey(c)}</g>`);
    const whisper = pl.add(`<g>${bubble(c, tr('To jest dziedzic!', 'This is the heir!'), { size: 18, tail: -1 })}</g>`);
    const plot = pl.add(`<g>${thought(c, `<g transform="translate(-14 14) scale(.28)">${towerParts(c, 90, 236).join('')}</g><g transform="translate(6 -4) scale(.8)">${bigKey(c)}</g>`, { w: 96, h: 74 })}</g>`);
    const smoke = [0, 1].map(() => pl.add(`<g>${wisp(c, 1.4, '#4a3a4a')}</g>`));
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
      // light: day → dusk (whispers) → deep dusk (the killing) → day again (the owner comes)
      const dusk = es(t, 1.2, 2.6), deep = es(t, 2.8, 3.1), dawn = es(t, 5.1, 5.6);
      const k1 = dusk * (1 - dawn), k2 = deep * (1 - es(t, 4.0, 4.6)) * (1 - dawn);
      duskL.fade(k1);
      nightL.fade(k2);
      veil1.fade(Math.max(k1 * 0.6, k2));
      veil2.fade(k2 * 0.9);
      sunL.fade(Math.min(1, deep * 1.2) * (1 - es(t, 4.0, 4.6)));
      pose(bigSun, { x: 830, y: lerp(560, 600, seg(t, 3, 4)) });
      set.update(t, T, { sunX: 560 - es(t, 0, 3) * 200, sunY: 180 + es(t, 0.5, 2.8) * 300 - dawn * 300 });

      /* v37 — the plate comes close: father and son, a heart between them; he sends him */
      const big = es(t, 0.05, 0.35) * (1 - es(t, 0.8, 1.0));
      pose(set.plateEl, { x: lerp(ABROAD[0], 800, big), y: lerp(ABROAD[1], 300, big), s: 1 + big * 1.1, r: Math.sin(T * 0.8) * 1.2 * (1 - big) });
      const sonGone = seg(t, 0.5, 0.55);
      const sendOut = bump(t, 0.4, 0.7);
      set.pOwner.set({ x: 0, y: 0, s: 1, flip: false, armF: 40 + big * 50 + sendOut * 40, armB: 20, head: big * 8, blink: blinkAt(T, 4) });
      set.pSon.set({ x: 0, y: 0, s: 1, flip: true, o: (1 - sonGone) * es(t, 0.1, 0.18), armF: big * 30, head: -big * 6, blink: blinkAt(T, 7) });
      const hk = es(t, 0.2, 0.38, ease.back) * (1 - es(t, 0.8, 0.95));
      pose(heartEl, { x: 790, y: 150 + Math.sin(T * 2) * 3, s: hk * (1 + Math.sin(T * 3) * 0.05), o: hk > 0.02 ? 1 : 0 });
      const sk = es(t, 0.3, 0.45, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(says, { x: lerp(620, ABROAD[0] - 150, es(t, 0.8, 1.0)), y: lerp(210, ABROAD[1] + 30, es(t, 0.8, 1.0)), s: sk, o: sk > 0.02 ? 1 : 0 });

      /* the son walks in at the gate */
      const inK = es(t, 0.5, 0.95);
      const shadow = seg(t, 3.02, 3.08) * (1 - seg(t, 4.02, 4.08));
      const seize = es(t, 3.1, 3.25);
      const drag = es(t, 3.25, 3.6);
      const fall = es(t, 3.62, 3.75, ease.in);
      const sonX = lerp(1420, SX, inK);
      son.set({ x: sonX, y: G + 2, s: 0.98, flip: true, walk: inK > 0 && inK < 1 ? sonX * 0.05 : undefined, armF: 20 + bump(t, 0.95, 1.3) * 40, head: -es(t, 1.2, 1.5) * 6, blink: blinkAt(T, 3), o: (inK > 0 ? 1 : 0) * (1 - shadow) * (t < 3.5 ? 1 : 0) });
      son.mood({ sad: es(t, 2.2, 2.6) });
      // shadow play: seized, dragged out through the gate, and killed outside the vineyard
      const sx = lerp(SX, OUT, drag);
      sonSh.set({ x: sx + fall * 20, y: G + 2, s: 0.98, flip: drag > 0 ? false : true, walk: drag > 0 && drag < 1 ? sx * 0.05 : undefined, r: fall * 82, armF: 30 + seize * 40 + fall * 40, armB: seize * 60, lean: -seize * 8, o: shadow * (1 - es(t, 3.88, 3.95)) });
      const ck = es(t, 3.78, 3.96, ease.out);
      pose(cloth, { x: OUT + 30, y: lerp(G - 420, G + 6, ck), o: ck > 0.001 ? 1 - (S.portrait ? es(t, 4.05, 4.3) : es(t, 4.9, 5.1)) : 0 });   // phone: gone as the camera leaves it, not left half at the edge

      /* the farmers: whisper, plot, seize — then are lifted away */
      const huddle = es(t, 1.05, 1.3) * (1 - es(t, 2.9, 3.05));
      const lift = es(t, 5.3, 5.95, ease.in);
      ten.forEach((m) => {
        let x = TX[m.i] + huddle * [30, 0, -30][m.i] + seize * [180, 140, 90][m.i];
        const y = G + (m.i === 1 ? 6 : 0);
        if (drag > 0 && m.i < 2) x = lerp(TX[m.i] + [180, 140][m.i], OUT + DRAG_TO[m.i], drag);
        const back = es(t, 3.9, 4.2);
        if (t > 3.9) x = lerp(m.i < 2 ? OUT + DRAG_TO[m.i] : TX[m.i] + 90, TX[m.i], back);
        const flip = m.i === 2 && huddle > 0.5 ? true : (t > 3.9 && t < 4.2);
        const walking = (drag > 0 && drag < 1 && m.i < 2) || (back > 0 && back < 1) || (seize > 0 && seize < 1);
        const common = {
          x, y: y - lift * 520, s: 0.96, flip, walk: walking ? x * 0.05 + m.i : undefined, blink: blinkAt(T, m.seed),
          armF: 20 + bump(t, 1.3, 1.9) * (m.i === 0 ? 80 : 0) + seize * 60 * (1 - back) + lift * 40, armB: seize * 40 * (1 - back) + lift * 60,
          head: huddle * [8, 14, -8][m.i] + es(t, 4.1, 4.4) * -14, lean: huddle * [10, 0, -10][m.i],
        };
        m.p.set({ ...common, o: 1 - shadow });
        m.p.mood({ angry: es(t, 1.9, 2.1) * (1 - es(t, 4.05, 4.2)), sad: es(t, 4.2, 4.4) });
        m.sh.set({ ...common, o: shadow });
        pose(strings[m.i], { x: x + 2, y: y - lift * 520, o: es(t, 5.1, 5.2) * (1 - seg(t, 5.95, 5.97)) });
      });
      const wk = es(t, 1.2, 1.4, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(whisper, { x: TX[0] + 40, y: G - 212, s: wk, o: wk > 0.02 ? 1 : 0 });
      const pk = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(plot, { x: TX[1] + 6, y: G - 200, s: pk, o: pk > 0.02 ? 1 : 0 });
      smoke.forEach((el, i) => {
        const k = ((T * 0.35 + i * 0.5) % 1);
        const on = es(t, 2.1, 2.3) * (1 - es(t, 2.95, 3.05));
        pose(el, { x: TX[i * 2] + 10, y: G - 200 - k * 60, s: 0.6 + k * 0.6, o: on * (1 - k) });
      });

      /* v40 — what will the owner do? */
      const qk = es(t, 4.05, 4.4, ease.out) * (1 - es(t, 4.9, 5.1));
      pose(qEl, { x: 800, y: lerp(-800, 250, qk), r: Math.sin(T * 1.2) * 3 });

      /* v41 — he comes; the wicked are lifted off; new farmers take the key and bring the fruit in its season */
      const oin = es(t, 5.02, 5.3);
      const ox = lerp(1420, 1000, oin);
      owner.set({ x: ox, y: G + 2, s: 1.04, flip: true, walk: oin > 0 && oin < 1 ? ox * 0.05 : undefined, armF: 30 + bump(t, 5.2, 5.5) * 60 + es(t, 6.3, 6.45) * 40 + es(t, 6.6, 6.8) * 20, armB: bump(t, 5.25, 5.55) * 120, head: -bump(t, 5.2, 5.5) * 8, blink: blinkAt(T, 1), o: oin > 0 ? 1 : 0 });
      fresh.forEach((m) => {
        const k = es(t, 6.02 + m.i * 0.05, 6.3 + m.i * 0.05);
        const bring = m.i === 2 ? es(t, 6.55, 6.75) : 0;
        const x = lerp(180 - m.i * 60, TX[m.i] + 30, k) + bring * 50;
        m.p.set({ x, y: G + (m.i === 1 ? 6 : 0), s: 0.96, walk: (k > 0 && k < 1) || (bring > 0 && bring < 1) ? x * 0.05 + m.i : undefined, armF: 20 + bump(t, 6.3, 6.5) * 40, armB: bump(t, 6.3, 6.5) * 70 + (m.i === 2 ? 60 * es(t, 6.6, 6.75) : 0), head: -4, blink: blinkAt(T, m.seed), o: k > 0 ? 1 : 0 });
      });
      const kk = es(t, 6.32, 6.47);
      pose(keyEl, { x: lerp(ox - 44, TX[0] + 70, kk), y: G - 104 - Math.sin(kk * Math.PI) * 30, r: 20 - kk * 30, s: 0.9, o: t > 6.25 ? 1 : 0 });

      S.cam.z = 1.12 + big * 0.02 + es(t, 2.9, 3.2) * 0.04 * (1 - es(t, 4, 4.4));
      S.cam.y = 40;
      S.cam.x = -10 + es(t, 2.9, 3.2) * 20 * (1 - es(t, 4, 4.4));
      if (S.portrait) S.cam.x = -10 + es(t, 3.2, 3.5) * 260 * (1 - es(t, 3.95, 4.3));   // phone: follow the shadow play out through the gate
    };
  },
};
