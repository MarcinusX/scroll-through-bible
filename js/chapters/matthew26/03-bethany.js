// Mt 26,6–13 — supper in the house of Simon the leper at Bethany (Mark 14's room and people). A woman comes in with an
// alabaster flask and pours the ointment on His head; a golden mist fills the house. The disciples are indignant — "why
// this waste?" — it could have been sold (coins fly off to the poor at the door). "Why do you trouble the woman?" — a
// good work: a heart over her. The poor always with you (bread for them), but not always Me (an hourglass). For My
// burial (a shroud and spices on a plate); and wherever the Good News goes in the whole world, she is remembered.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { room } from '../mark7/lib.js';
import {
  LOOK, TW, kf, moving, hand, headAt, withFace, faceBits, alabaster, nardMist, lowTable, bowl, loaf, cup, grapes, coin, coinStack,
  speech, thought, GLYPH, heart, discPlate, worldMap, MAP_SPOTS, womanCameo, wordTag, hourglassParts, vignette, tr, vis, PI,
} from './lib.js';

const SEAT = 706, FLOOR = 646, JX = 790;

export default {
  id: 'mt26-bethany',
  beats: [
    { v: 6 },
    { v: 7, text: 'podeszła do Niego kobieta z alabastrowym flakonikiem drogiego olejku' },
    { v: 7, cont: true, text: 'i wylała Mu olejek na głowę, gdy spoczywał przy stole.' },
    { v: 8 },
    { v: 9 },
    { v: 10, text: 'Lecz Jezus zauważył to i rzekł do nich: «Czemu sprawiacie przykrość tej kobiecie?' },
    { v: 10, cont: true, text: 'Dobry uczynek spełniła względem Mnie.' },
    { v: 11 },
    { v: 12 },
    { v: 13 },
  ],
  cam: { x: [-60, 520], y: [-80, 260], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    const EVE = ['#8f86ad', '#d9a693', '#efc4a3'];
    const R = room(S, { sky: EVE });

    /* the poor at the door (outside, in the street) */
    const poor = [
      { x: 1190, y: 648, o: { robe: '#b7ab96', mantle: '#9d917c', hair: C.greyHair, hairStyle: 'wrap', veil: '#a39b8b', beard: 'full', beardColor: C.greyHair, skin: C.skin3 }, pose: 'sit', s: 0.72 },
      { x: 1236, y: 646, o: { robe: '#c3b49c', hairStyle: 'veil', veil: '#b5aa98', skin: C.skin2, hair: C.hair, beard: 'none' }, pose: 'stand', s: 0.74 },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(R.street.add(person(c, { ...m.o, pose: m.pose, holdF: i === 0 ? bowl(c, { w: 26, color: C.clay, food: null }) : '' }))) }));

    /* the woman */
    const wL = S.layer({ par: 0.48, sh: 5 });
    const womanP = S.puppet(wL.add(withFace(person(c, LOOK.woman), faceBits(c))));
    const wSad = womanP.el.querySelector('[data-part="sad"]');

    /* the guests at table */
    const tabL = S.layer({ par: 0.52, sh: 5 });
    const G = [
      { k: 'john', o: TW.john, x: 540 }, { k: 'peter', o: TW.peter, x: 620 }, { k: 'simon', o: LOOK.simon, x: 700 },
      { k: 'judas', o: TW.judas, x: 955, cross: true }, { k: 'thomas', o: TW.thomas, x: 1035, cross: true }, { k: 'philip', o: TW.philip, x: 1112, cross: true },
    ].map((g0, i) => {
      const g = { ...g0, x: PH ? JX + (g0.x - JX) * 0.85 : g0.x };   // phone: the guests sit a little closer, so the ends of the table are not cut
      const el = tabL.add(withFace(person(c, { ...g.o, pose: 'sit' }), faceBits(c)));
      return { ...g, i, s: 0.9, flip: g.x > JX, seed: c.rr(0, 9), p: S.puppet(el), angry: el.querySelector('[data-part="angry"]'), sadF: el.querySelector('[data-part="sad"]') };
    });
    const jesus = S.puppet(tabL.add(withFace(person(c, { ...CAST.jesus, pose: 'sit' }), faceBits(c))));
    const jSad = jesus.el.querySelector('[data-part="sad"]');
    const frontL = S.layer({ par: 0.55, sh: 6 });
    frontL.add(`<g transform="translate(820 ${SEAT + 8})">${lowTable(c, 700, 46)}</g>`);
    const TOP = SEAT + 8 - 46;
    frontL.add([[530, bowl(c, { food: 'bread' })], [600, loaf(c, 16)], [660, cup(c)], [720, grapes(c)], [880, cup(c, C.clay)], [940, bowl(c, { food: 'fruit', color: C.skyVeil })], [1010, loaf(c, 15)], [1080, cup(c)]]
      .map(([x, m]) => `<g transform="translate(${x} ${TOP + 2})">${m}</g>`).join(''));

    S.layer({ par: 0.56, sh: 0, flat: true }).add(vignette(S, { cx: 800, cy: 560, r: 820, o: 0.4 }));
    /* the flask, the ointment, the scent */
    const fx = S.layer({ par: 0.56, sh: 4 });
    const jar = alabaster(c, 40);
    const jarBody = fx.add(`<g>${jar.body}</g>`);
    const jarNeck = fx.add(`<g>${jar.neck}</g>`);
    const stream = fx.add(`<g><path d="${c.ribbon([[0, 0], [1, 30], [-1, 60], [0, 90]], (u) => 4 - u * 1.5)}" fill="#f2cf7d"/><path d="${c.ribbon([[0, 0], [0.5, 90]], 1.2)}" fill="#fff4d2"/></g>`);
    const mist = fx.add(`<g>${nardMist(c, 56, { n: 6 })}</g>`);
    const drifts = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(`<g>${nardMist(c, c.rr(20, 30), { n: 3 })}</g>`), x: 440 + i * 76 + c.rr(-20, 20), y: c.rr(420, 520), ph: c.rr(0, 6) }));
    const bWaste = fx.add(`<g>${speech(c, `<g transform="translate(-14 12) rotate(-60)">${jar.body}</g><g transform="translate(14 0)">${GLYPH.q(c)}</g>`, { w: 70, h: 54, flip: false })}</g>`);
    const coinsTh = fx.add(`<g>${thought(c, `<g transform="translate(-22 14)">${coinStack(c, 6, 9)}</g><g transform="translate(0 14)">${coinStack(c, 8, 9)}</g><g transform="translate(22 14)">${coinStack(c, 5, 9)}</g>`, { w: 104, h: 70 })}</g>`);
    const flying = Array.from({ length: 8 }, (_, i) => ({ i, el: fx.add(`<g>${coin(c, 7)}</g>`) }));
    const grumbles = [0, 1, 2].map(() => fx.add(`<g>${speech(c, GLYPH.storm(c), { w: 50, h: 40, flip: true })}</g>`));
    const goodHeart = fx.add(`<g>${heart(c, 16)}</g>`);
    const hg = hourglassParts(c, 70);
    const hour = hanging(fx, `<g transform="scale(1.5)">${hg.frame}<g class="top">${hg.top}</g><g class="bot" transform="translate(0 ${hg.h / 2 - 12})">${hg.bottom}</g>${hg.stream}</g>`, { x: JX, y: -1500, len: 600 });
    const hTop = hour.querySelector('.top'), hBot = hour.querySelector('.bot');
    const shroud = (() => {
      const s = sheet();
      s.p(c.cut([[-40, 8], [40, 8], [34, -6], [-34, -6]], 0.4, 6) + c.cut([[-36, -6], [36, -6], [30, -18], [-30, -18]], 0.4, 6), C.linen);
      s.x(c.ribbon([[-36, -6], [36, -6]], 1.2), C.linen2);
      s.p(c.cut(c.blob(-18, -26, 9, 7, 8, 0.2), 0.3, 3) + c.cut(c.blob(4, -28, 8, 6, 8, 0.2), 0.3, 3), C.sageRobe);
      s.p(c.cut(c.blob(22, -24, 7, 6, 8, 0.2), 0.3, 3), C.ochre);
      return s.out();
    })();
    const burial = hanging(fx, `<g transform="scale(1.35)">${discPlate(c, `<g transform="translate(0 14)">${shroud}</g><g transform="translate(0 -18) scale(.55)">${nardMist(c, 40)}</g>`, { r: 52, rim: C.stone2, fill: mix(C.parchment, C.stone, 0.4) })}</g>`, { x: JX, y: -1500, len: 600 });
    const mapEl = hanging(fx, `<g>${worldMap(c, 440, 250)}</g>`, { x: JX, y: -1500, len: 700 });
    const cameos = MAP_SPOTS.map(([mx, my], i) => ({ i, mx, my, el: fx.add(`<g>${discPlate(c, `<g transform="scale(.62)">${womanCameo(c)}</g>`, { r: 18, rim: C.sun })}</g>`) }));
    const gospel = hanging(fx, wordTag(c, tr('Ewangelia', 'the Good News'), { size: 18 }), { x: JX - 150, y: -1500, len: 600 });

    return (t, time) => {
      const T = time;
      pose(R.lamp.flame, { x: 35, y: -16, sx: 1 + Math.sin(T * 7) * 0.08, sy: 1 + Math.sin(T * 5.3) * 0.1 });

      /* the woman: in from the street, along behind the guests, pours; she shrinks at their anger; she bows */
      const wK = [[0.95, [1330, FLOOR + 4]], [1.35, [1200, FLOOR + 30]], [1.85, [858, 690]], [4.95, [858, 690]], [5.3, [905, 690]]];
      const [wx, wy] = kf(t, wK);
      const wWalk = moving(t, wK, 1);
      const pour = es(t, 2.05, 2.4);
      const shrink = es(t, 3.3, 3.6) * (1 - es(t, 5.2, 5.6));
      const bow = es(t, 8.0, 8.3) * (1 - es(t, 9.2, 9.6));
      const lookUp = es(t, 9.2, 9.6);
      const wArm = t < 2 ? 70 : 70 + pour * 80 * (1 - es(t, 2.7, 3.0)) - es(t, 2.9, 3.3) * 34 - shrink * 10 - bow * 6;
      womanP.set({ x: wx + shrink * 20, y: wy, s: 0.92, flip: true, o: seg(t, 0.95, 1.05), walk: wWalk ? wx * 0.05 : undefined, armF: wArm, armB: 20 + shrink * 40 + bow * 40, head: shrink * 16 - pour * 6 + bow * 14 - lookUp * 10, lean: shrink * 6 + bow * 5, blink: blinkAt(T, 4) });
      fade(wSad, shrink);

      const [hx, hy] = hand(wx + shrink * 20, wy, 0.92, true, wArm);
      const tilt = pour * 110 * (1 - es(t, 2.75, 3.0) * 0.8);
      const jarShow = seg(t, 0.95, 1.05);
      vis(jarBody, { x: hx, y: hy + 16, r: -tilt, ox: 0, oy: -20, o: jarShow });
      const snap = es(t, 2.05, 2.2);
      const fall = es(t, 2.2, 2.7, ease.in);
      vis(jarNeck, { x: hx + fall * -18, y: hy + 16 - 38 * (1 - snap) + fall * 120 - snap * 20 * (1 - fall), r: -tilt * (1 - snap) + snap * 60 + fall * 120, o: jarShow * (1 - es(t, 2.9, 3.1)) });
      const [jhx, jhy] = headAt(JX, SEAT, 1.02, false, 62);
      const flow = es(t, 2.25, 2.45) * (1 - es(t, 2.8, 2.95));
      vis(stream, { x: jhx + 6, y: hy - 12, sy: Math.max(0.01, (jhy - 18 - (hy - 12)) / 90) * flow, o: flow > 0.02 ? 1 : 0 });
      const scent = es(t, 2.4, 2.9);
      vis(mist, { x: jhx, y: jhy - 24, s: 0.5 + scent * 0.7 + Math.sin(T * 1.3) * 0.03, sy: 1 + Math.sin(T * 0.9) * 0.05, o: scent * (1 - es(t, 8.2, 8.6) * 0.4) });
      drifts.forEach((d) => {
        const k = es(t, 2.6 + d.i * 0.04, 3.3 + d.i * 0.04);
        vis(d.el, { x: lerp(jhx, d.x, k) + Math.sin(T * 0.6 + d.ph) * 10, y: lerp(jhy - 30, d.y, k) + Math.cos(T * 0.5 + d.ph) * 6, s: 0.6 + k * 0.5, r: Math.sin(T * 0.7 + d.ph) * 6, o: k * 0.85 * (1 - es(t, 8.9, 9.3)) });
      });

      /* Jesus */
      const defend = es(t, 5.02, 5.3) * (1 - es(t, 6.9, 7.2));
      const toHer = es(t, 6.0, 6.3) * (1 - es(t, 6.9, 7.2)) + es(t, 8.1, 8.4) * (1 - es(t, 8.9, 9.2));
      const burialK = es(t, 8.05, 8.4) * (1 - es(t, 9.0, 9.3));
      const world = es(t, 9.0, 9.4);
      jesus.set({
        x: JX, y: SEAT, s: 1.02, flip: false,
        armF: 30 + bump(t, 0.1, 0.9) * 20 + defend * 50 + toHer * 30 + world * 40 + es(t, 7.1, 7.4) * (1 - es(t, 7.9, 8.1)) * 40,
        armB: 16 + defend * 110 + toHer * 60 + world * 120,
        head: -pour * 10 * (1 - es(t, 3, 3.3)) + burialK * 14 - world * 8, blink: blinkAt(T), lean: burialK * 4,
      });
      fade(jSad, burialK);

      /* the guests */
      const angry = es(t, 3.05, 3.3) * (1 - es(t, 5.2, 5.5));
      const grumble = es(t, 3.4, 3.6) * (1 - es(t, 3.9, 4.1));
      G.forEach((g) => {
        let armF = 38, armB = 18, head = 0, lean = 0, flip = g.flip;
        const wonder = bump(t, 2.3, 3.2);
        head -= wonder * 8;
        armF += wonder * 30;
        if (g.cross) {
          flip = true;
          armF += angry * 30 + grumble * 30 * (g.k === 'judas' ? 1.5 : 1);
          armB += angry * (g.k === 'judas' ? 50 : 10);
          lean = angry * 5 + grumble * 4;
          head += bump(t, 3.2, 3.9) * (g.k === 'thomas' ? -8 : 6) + es(t, 5.2, 5.5) * 10 * (1 - world);
          fade(g.angry, angry);
          fade(g.sadF, es(t, 5.2, 5.6) * (1 - world));
        } else {
          armF += angry * (g.k === 'peter' ? 30 : 0);
          head += burialK * 12;
          fade(g.angry, angry * (g.k === 'peter' ? 0.7 : 0));
          fade(g.sadF, burialK);
        }
        if (g.k === 'john') armF += bump(t, 7.1, 7.9) * 50;          // bread for the poor at the door (v11)
        head -= world * 10;
        g.p.set({ x: g.x, y: SEAT + (g.i % 2) * 4, s: g.s, flip, armF, armB, head, lean, blink: blinkAt(T, g.seed) });
      });
      const [jdx, jdy] = headAt(G[3].x, SEAT, 0.9, true, 62);
      const bw = es(t, 3.15, 3.35, ease.back) * (1 - es(t, 3.85, 4.0));
      vis(bWaste, { x: jdx - 6, y: jdy - 30, s: bw, o: bw > 0.01 ? 1 : 0 });
      grumbles.forEach((b, i) => {
        const g = [G[1], G[4], G[5]][i];
        const [gx, gy] = headAt(g.x, SEAT, 0.9, g.cross, 62);
        const k = es(t, 3.35 + i * 0.1, 3.55 + i * 0.1, ease.back) * (1 - es(t, 3.9, 4.05, ease.in));
        vis(b, { x: gx + (g.cross ? -16 : PH ? 40 : 16),   // phone: Peter's bubble clear of the left edge
         y: gy - 20 + Math.sin(T * 5 + i) * 3, s: k, o: k > 0.01 ? 1 : 0, r: -8 + i * 6 });
      });
      const [thx, thy] = headAt(G[4].x, SEAT, 0.9, true, 62);
      const ct = es(t, 4.05, 4.3, ease.back) * (1 - es(t, 4.9, 5.05));
      vis(coinsTh, { x: thx - 4, y: thy - 20, s: ct, o: ct > 0.01 ? 1 : 0 });
      flying.forEach((f) => {
        const k = seg(t, 4.35 + f.i * 0.05, 4.75 + f.i * 0.05);
        vis(f.el, { x: lerp(thx + 20, 1200, k), y: lerp(thy - 70, 600, k) - Math.sin(k * PI) * 60, r: k * 360, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const gh = es(t, 6.1, 6.4, ease.back) * (1 - es(t, 6.9, 7.1));
      const [whx, why] = headAt(wx + shrink * 20, wy, 0.92, true);
      vis(goodHeart, { x: whx, y: why - 50 + Math.sin(T * 2) * 4, s: gh * (1 + Math.sin(T * 3) * 0.05), o: gh > 0.01 ? 1 : 0 });

      /* v11 — the poor at the door; the hourglass above Him */
      poor.forEach((m) => {
        const on = es(t, 4.3 + m.i * 0.1, 4.6 + m.i * 0.1) * (1 - es(t, 7.9, 8.2));
        m.p.set({ x: m.x + (1 - on) * 80, y: m.y, s: m.s, flip: true, o: on, armF: 40 + bump(t, 7.2, 7.9) * 40, head: 6, blink: blinkAt(T, m.seed) });
      });
      const hIn = es(t, 7.35, 7.65, ease.out) * (1 - es(t, 7.95, 8.1));
      vis(hour, { x: PH ? JX + 90 : JX, y: 420 - (1 - hIn) * 700, r: Math.sin(T * 0.9) * 2, o: hIn > 0.01 ? 1 : 0 });
      const sand = seg(t, 7.4, 8.0);
      pose(hTop, { x: 0, y: -4, sy: 1 - sand * 0.8, oy: -4 });
      pose(hBot, { x: 0, y: hg.h / 2 - 12, sy: 0.2 + sand * 0.8 });

      /* v12 — for My burial */
      const bIn = es(t, 8.05, 8.4, ease.out) * (1 - es(t, 8.9, 9.1));
      vis(burial, { x: JX, y: 420 - (1 - bIn) * 700, r: Math.sin(T * 0.9 + 1) * 2, o: bIn > 0.01 ? 1 : 0 });

      /* v13 — the whole world */
      const mIn = es(t, 9.02, 9.35, ease.out);
      vis(mapEl, { x: JX, y: 310 - (1 - mIn) * 800, r: Math.sin(T * 0.7) * 1, o: mIn > 0.01 ? 1 : 0 });
      vis(gospel, { x: JX - 170, y: 160 - (1 - es(t, 9.1, 9.4, ease.out)) * 700, r: Math.sin(T * 1.1) * 3, o: mIn > 0.01 ? 1 : 0 });
      cameos.forEach((m) => {
        const k = es(t, 9.3 + m.i * 0.05, 9.45 + m.i * 0.05, ease.back);
        vis(m.el, { x: JX + m.mx, y: 310 + m.my, s: k, o: k > 0.01 ? 1 : 0 });
      });

      // phone: for the poor at the door (v9, v11) the camera goes further right and a little wider, so the doorway is on screen
      S.cam.x = PH
        ? kf(t, [[0, 0], [0.9, 0], [1.4, 160], [1.9, 40], [2.3, 0], [3.0, 0], [3.3, 200], [3.95, 200], [4.25, 520], [4.8, 520], [5.2, 60], [6.8, 60], [7.2, 520], [7.9, 520], [8.2, 40], [8.8, 0]])
        : kf(t, [[0, 0], [0.9, 0], [1.4, 160], [1.9, 40], [2.3, 0], [3.0, 0], [3.3, 200], [4.8, 200], [5.2, 60], [6.8, 60], [7.2, 240], [7.9, 240], [8.2, 40], [8.8, 0]]);
      S.cam.z = PH
        ? kf(t, [[-0.5, 1.26], [1.0, 1.32], [2.0, 1.38], [2.4, 1.52], [3.0, 1.46], [3.3, 1.4], [3.95, 1.4], [4.25, 1.06], [4.8, 1.06], [5.2, 1.4], [5.4, 1.46], [6.8, 1.38], [7.2, 1.06], [7.9, 1.06], [8.2, 1.5], [8.6, 1.34], [8.95, 1.14]])
        : kf(t, [[-0.5, 1.26], [1.0, 1.32], [2.0, 1.38], [2.4, 1.52], [3.0, 1.46], [3.3, 1.4], [5.0, 1.4], [5.4, 1.46], [7.0, 1.36], [8.2, 1.5], [8.6, 1.34], [8.95, 1.14]]);
      S.cam.y = kf(t, [[-0.5, 170], [2.0, 200], [2.4, 210], [3.2, 200], [8.2, 210], [8.6, 90], [8.95, -20]]);
    };
  },
};
