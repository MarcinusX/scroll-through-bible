// Łk 12,35–38 — the master's house (Mark 13's), cut open, at night; far up the hill a house is lit for a wedding.
// "Let your waist be dressed and your lamps burning": in the courtyard the servants pull their robes up into their belts,
// and one by one their little clay lamps are lit. "Be like men watching for their lord, when he returns from the
// marriage feast": down the hill road from the lit wedding house comes the master; he knocks — rings at the gate — and
// the doorkeeper swings it open at once. "Blessed are those servants whom the lord will find watching": he comes in and
// finds them all awake, lamps in hand, and a warm light spreads round them. "He will dress himself, and make them
// recline, and will come and serve them": he lays aside his mantle, ties a towel round his waist, sits them down at the
// low table and goes round it with the dish. "In the second or third watch": the plates of midnight and cockcrow come
// down and light in turn — and they are still awake, their lamps still burning.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { moon, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { lowTable, grapes } from '../mark2/lib.js';
import { houseSet, HOUSE, MASTER, SERVANTS, DOORKEEPER, SKIES, lampBody, lampFire, WICK, watchPlate, rooster, palm, headAt, hand, alongPts, loaf, bowl, halo, warm, voiceRings, PI } from './lib.js';

const F = HOUSE.FLOOR;
const SV = [{ o: SERVANTS[0], x: 520 }, { o: SERVANTS[1], x: 610 }, { o: SERVANTS[2], x: 700 }, { o: DOORKEEPER, x: 1000 }];
const SEAT = [{ x: 560, flip: false }, { x: 640, flip: false }, { x: 820, flip: true }, { x: 900, flip: true }];
const TX = 730;
const ROAD = [[1400, 580], [1360, 614], [1250, 656], [1150, 684], [1100, 694]];

export default {
  id: 'lk12-ready',
  enter: 'fly',
  beats: [
    { v: 35 },
    { v: 36 },
    { v: 37, text: 'Szczęśliwi owi słudzy, których pan zastanie czuwających, gdy nadejdzie.' },
    { v: 37, cont: true, text: 'Zaprawdę, powiadam wam: Przepasze się i każe im zasiąść do stołu, a obchodząc będzie im usługiwał.' },
    { v: 38 },
  ],
  cam: { x: [-40, 200], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const PO = S.portrait;   // phone: the doorkeeper waits a step further in; the camera goes further right for the knock
    const NIGHTC = mix(C.night, C.duskViolet, 0.3);
    S.defs(`<clipPath id="lk12-watch-clip"><circle r="47"/></clipPath>`);
    sky(S, SKIES.night);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -600, y1: 440, n: 110 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    hanging(hangL, `${halo(100, 0.5)}${moon(c, 30)}`, { x: 300, y: 170, len: 800 });
    const H = houseSet(S, { tintCol: NIGHTC, tintK: 0.35 });
    /* the wedding house up the hill, lit */
    const wed = S.layer({ par: 0.2, sh: 3 });
    wed.add(`<g transform="translate(1390 572) scale(.8)"><circle cy="-40" r="120" fill="url(#warm-glow)" opacity=".8"/>${sheet().p(c.cut(c.rect(-50, -60, 100, 60), 0.4, 5), mix(C.plaster, NIGHTC, 0.3)).p(c.cut(c.rect(-56, -66, 112, 8), 0.3, 5), mix(C.roof, NIGHTC, 0.3)).out()}<path d="${c.poly(c.rect(-34, -44, 16, 16)) + c.poly(c.rect(10, -44, 16, 16)) + c.poly(c.rect(-8, -30, 18, 30))}" fill="${C.lampGlow}"/>${[-40, -16, 8, 32].map((x) => `<circle cx="${x}" cy="-72" r="4" fill="${C.lampFlame}"/>`).join('')}</g>`);

    /* the servants, standing and (later) reclining; their lamps */
    const P = S.layer({ par: 0.42, sh: 5 });
    const tableEl = P.add(`<g opacity="0"><g transform="scale(.7)">${lowTable(c, 380, 60)}</g><g transform="translate(-60 -44)">${loaf(c, 16)}</g><g transform="translate(-10 -40)">${grapes(c, 5)}</g><g transform="translate(40 -42)">${bowl(c, { w: 34, food: 'stew' })}</g></g>`);
    const sv = SV.map((s, i) => ({ ...s, i, seed: c.rr(0, 9),
      loose: S.puppet(P.add(person(c, { ...s.o, belt: null }))),
      tied: S.puppet(P.add(person(c, { ...s.o, belt: C.ochre }))),
      sit: S.puppet(P.add(person(c, { ...s.o, belt: C.ochre, pose: 'sit' }))),
      body: P.add(`<g>${lampBody(c)}</g>`),
    }));
    const master = S.puppet(P.add(person(c, MASTER)));
    const master2 = S.puppet(P.add(person(c, { ...MASTER, mantle: null, belt: C.linen2, holdF: `<g transform="translate(0 2)">${bowl(c, { w: 30, food: 'stew' })}</g>` })));
    const towel = P.add(`<g opacity="0">${sheet().p(c.cut([[-30, 0], [30, 0], [26, 40], [-26, 40]], 0.4, 5), C.linen2).out()}</g>`);
    const fireL = S.layer({ par: 0.42, sh: 1, flat: true });
    const fires = sv.map(() => fireL.add(`<g opacity="0">${lampFire(c, 0)}</g>`));
    const glowL = S.layer({ par: 0.42, sh: 0, flat: true });
    P.el.parentNode.insertBefore(glowL.el, P.el);
    const glows = sv.map(() => glowL.add(`<g opacity="0"><circle r="70" fill="url(#warm-glow)"/></g>`));
    const blessL = S.layer({ par: 0.42, sh: 0, flat: true });
    P.el.parentNode.insertBefore(blessL.el, P.el);
    const bless = blessL.add(`<g opacity="0"><ellipse rx="360" ry="200" fill="url(#warm-glow)"/></g>`);
    const knock = voiceRings(P, c, { n: 3, color: C.sun, r: 26, w: 4, both: false });
    /* the watches */
    const WL = S.layer({ par: 0.2, sh: 6 });
    const W = ['mid', 'cock'].map((k, i) => ({ k, i, el: WL.add(`<g transform="translate(0 -1500)"><path d="M0 -2400V-56" stroke="rgba(230,210,180,.45)" stroke-width="1.2" fill="none"/><circle class="lit" r="100" fill="url(#halo-glow)" opacity="0"/>${watchPlate(c, k, 'lk12-watch-clip', rooster)}</g>`) }));
    W.forEach((w) => { w.lit = w.el.querySelector('.lit'); });

    return (t, time) => {
      const T = time;
      pose(H.ovenEl.querySelector('.glow'), { x: 0, y: 0, o: 0.3 });
      /* v35 — belts tied, lamps lit */
      const recline = es(t, 3.3, 3.45);
      sv.forEach((s) => {
        const tie = es(t, 0.08 + s.i * 0.05, 0.28 + s.i * 0.05);
        const lit = es(t, 0.45 + s.i * 0.08, 0.55 + s.i * 0.08);
        const st = SEAT[s.i];
        const look = s.i === 3 ? 0 : es(t, 1.2, 1.4);
        const x = s.i === 3 ? lerp(PO ? 950 : s.x, 980, es(t, 1.4, 1.6)) : s.x;
        const armF = 30 + bump(t, 0.05 + s.i * 0.05, 0.35 + s.i * 0.05) * 20 + lit * 20 + bump(t, 2.05, 2.5) * 20;
        const armB = 10 + bump(t, 0.05 + s.i * 0.05, 0.35 + s.i * 0.05) * 40 + (s.i === 3 ? es(t, 1.6, 1.75) * 60 * (1 - es(t, 2.0, 2.2)) : 0);
        const flip = s.i === 3 ? es(t, 1.4, 1.5) < 0.5 : false;
        const pose0 = { x, y: F + (s.i % 2) * 6, s: 0.94, flip, armF, armB, head: -look * 6, blink: blinkAt(T, s.seed) };
        s.loose.set({ ...pose0, o: (1 - seg(t, 0.15 + s.i * 0.05, 0.2 + s.i * 0.05)) * (1 - recline) });
        s.tied.set({ ...pose0, o: seg(t, 0.15 + s.i * 0.05, 0.2 + s.i * 0.05) * (1 - recline) });
        s.sit.set({ x: st.x, y: F + 10, s: 0.94, flip: st.flip, o: recline, armF: 40 + bump(t, 3.5, 3.9) * 30, armB: 14, head: st.flip ? -4 : 6, blink: blinkAt(T, s.seed) });
        const [px, py] = recline > 0.5 ? [st.x + (st.flip ? -44 : 44), F + 6] : palm(x, F + (s.i % 2) * 6, 0.94, flip, armF);
        pose(s.body, { x: px, y: py, sx: flip && recline < 0.5 ? -1 : 1 });
        const wx = px + (flip && recline < 0.5 ? -1 : 1) * WICK[0], wy = py + WICK[1];
        pose(fires[s.i], { x: wx, y: wy, s: lit * (1 + (time ? Math.sin(T * 9 + s.i) * 0.05 : 0)), o: lit });
        pose(glows[s.i], { x: wx, y: wy - 12, o: lit });
      });

      /* v36 — the master comes home from the wedding; he knocks, the door opens at once */
      const walk = es(t, 1.02, 1.55, (u) => u);
      const inside = es(t, 2.05, 2.4);
      let [mx, my] = alongPts(ROAD, walk);
      const ms = lerp(0.6, 0.96, walk);
      if (inside > 0) { mx = lerp(1100, 900, inside); my = F + 2; }
      const rap = bump(t, 1.55, 1.7) + bump(t, 1.7, 1.85);
      const serve = es(t, 3.05, 3.3);
      const blessK = bump(t, 2.4, 2.95);
      const mSet = { x: serve > 0 ? lerp(900, kfServe(t), es(t, 3.3, 3.9)) : mx, y: my, s: ms, flip: true, walk: (walk > 0 && walk < 1) || (inside > 0 && inside < 1) ? mx * 0.05 : undefined, armF: 20 + rap * 60 + blessK * 70, armB: 10 + blessK * 110, head: -blessK * 4, blink: blinkAt(T, 7) };
      master.set({ ...mSet, o: seg(t, 1.0, 1.04) * (1 - serve) });
      master2.set({ ...mSet, o: serve, armF: 60, armB: 20, head: 10 });
      pose(towel, { x: mSet.x, y: F - 96 * 0.96, s: 0.96, o: serve });
      knock(1060, 610, rap, T, { spread: 2, dir: 1 });
      const open = es(t, 1.75, 1.95);
      pose(H.gateDoor, { x: HOUSE.GATE - 36, y: F + 38, sx: 1 - open * 0.8 });

      /* v37a — blessed, awake */
      pose(bless, { x: 640, y: F - 120, o: es(t, 2.35, 2.6) * (0.9 - es(t, 3.2, 3.4) * 0.3) });
      /* v37b — he serves them at table */
      pose(tableEl, { x: TX, y: F + 14, o: es(t, 3.25, 3.4) });

      /* v38 — the second or third watch */
      W.forEach((w) => {
        const k = es(t, 4.05 + w.i * 0.12, 4.3 + w.i * 0.12, ease.out);
        pose(w.el, { x: 620 + w.i * 190, y: lerp(-1500, 210, k), r: time ? Math.sin(T * 0.8 + w.i) * 1.5 : 0, oy: 0 });
        fade(w.lit, w.i ? es(t, 4.55, 4.7) : es(t, 4.3, 4.45) * (1 - es(t, 4.55, 4.7) * 0.6));
      });

      S.cam.x = (lerp(0, 150, es(t, 0.95, 1.25)) - es(t, 1.9, 2.3) * 150) * (PO ? 1.3 : 1);
      S.cam.y = 10 + es(t, 3.05, 3.3) * 30 - es(t, 3.95, 4.3) * 70;
      S.cam.z = 1.06 + es(t, 0.95, 1.25) * 0.04 - es(t, 1.9, 2.3) * 0.04;
    };
  },
};
/** where the serving master walks round the table */
function kfServe(t) { const u = es(t, 3.3, 3.9); return lerp(900, 600, u) + Math.sin(u * PI) * 0; }
