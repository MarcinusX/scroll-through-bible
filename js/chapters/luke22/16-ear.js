// Łk 22,49–53 — "Lord, shall we strike with the sword?" — and before He answers, one of them (Peter, as John names
// him) strikes the high priest's servant: one bright arc, and a tiny paper ear falls. "No more of this!" — He lifts His
// hand, the sword goes back into its sheath; He steps to the servant, touches his ear — a small light — and the ear is
// back where it was: healed. To the chief priests, the captains of the Temple and the elders who have come out with the
// crowd (in colour among the shadows): "Have you come out as against a robber?" — a plate of a robber, struck through;
// "Day after day I was with you in the Temple" — the Temple court with Him teaching; "but this is your hour, and the
// power of darkness": dark sheets close in from both sides, the moon goes under a cloud, and only His light is left.
import { es, ease, bump, seg } from '../../core/anim.js';
import { cloud } from '../../assets/nature.js';
import { addToBody as addBody } from '../mark2/lib.js';
import {
  nightSet, gardenTrees, elevenL as eleven, lamp, makeBand, bandPose, TW, MOB, ELEVEN, MALCHUS, kf, moving, hand, headAt, withFace, faceBits, say, speech, GLYPH,
  sword, sheathed, paperEar, priest, scribe, captain, discPlate, shadowPerson, guardOpts, BAND_INK, templeMini, darkSheet, miniJesus, person, sheet,
  hanging, vis, pose, fade, lerp, mix, nt, blinkAt, tr, C, PI,
} from './lib.js';

const GY = 700, JX = 820, MX = 650, PX0 = 900, PX1 = 740;

export default {
  id: 'lk22-ear',
  beats: [
    { v: 49 },
    { v: 50 },
    { v: 51, text: 'Lecz Jezus odpowiedział: «Przestańcie, dosyć!»' },
    { v: 51, cont: true, text: 'I dotknąwszy ucha, uzdrowił go.' },
    { v: 52 },
    { v: 53, text: 'Gdy codziennie bywałem u was w świątyni, nie podnieśliście rąk na Mnie,' },
    { v: 53, cont: true, text: 'lecz to jest wasza godzina i panowanie ciemności».' },
  ],
  cam: { x: [-120, 160], y: [-120, 180], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const N = nightSet(S, { moonAt: [1250, 130] });
    const clL = S.layer({ par: 0.05, sh: 3 });
    const cl = clL.add(`<g>${cloud(c, 280, nt(C.storm, 0.4), nt(C.storm2, 0.5))}</g>`);
    const treesL = S.layer({ par: 0.5, sh: 3 });
    gardenTrees(S, treesL, GY);
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const pool = glowL.add(`<g transform="translate(470 ${GY})"><ellipse cx="0" cy="-110" rx="420" ry="270" fill="url(#warm-glow)" opacity=".55"/></g>`);
    const bandL = S.layer({ par: 0.5, sh: 5 });
    const flameL = S.layer({ par: 0.5, sh: 0, flat: true });
    const band = makeBand(S, bandL, flameL, MOB);
    // the leaders who came out with them, in colour
    const LD = [{ m: () => priest(c, 1), x: 400, y: GY - 22 }, { m: () => captain(c), x: 330, y: GY - 16 }, { m: () => scribe(c, 3), x: 470, y: GY - 26 }]
      .map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(bandL.add(withFace(d.m(), faceBits(c)))) }));
    if (S.portrait) LD.forEach((d) => { d.x += 90; });   // phone: the leaders He speaks to come in from the left edge
    LD.forEach((d) => { d.angry = d.p.el.querySelector('[data-part="angry"]'); });
    const peopleL = S.layer({ par: 0.5, sh: 5 });
    const judas = S.puppet(peopleL.add(withFace(person(c, TW.judas), faceBits(c))));
    const malEl = peopleL.add(withFace(person(c, MALCHUS), faceBits(c)));
    const malchus = S.puppet(malEl);
    const malSad = malEl.querySelector('[data-part="sad"]');
    const { J, D } = eleven(S, peopleL, { gy: GY, pos: ELEVEN.filter((d) => d.k !== 'peter'), lamps: true, arm: 20 });
    const pDraw = S.puppet(peopleL.add(withFace(person(c, { ...TW.peter, holdF: `<g transform="rotate(-100)">${sword(c, 58)}</g>` }), faceBits(c))));
    const pSheathEl = peopleL.add(withFace(addBody(person(c, { ...TW.peter }), sheathed(c)), faceBits(c)));
    const pSheath = S.puppet(pSheathEl);
    const pSad = pSheathEl.querySelector('[data-part="sad"]');

    const fx = S.layer({ par: 0.54, sh: 4 });
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(-14 16) rotate(-30) scale(.8)">${sword(c, 50)}</g><g transform="translate(18 0)">${GLYPH.q(c)}</g>`, { w: 80, h: 58, flip: true })}</g>`);
    const flash = fx.add(`<g><path d="${c.ribbon(c.arc(0, 0, 70, 70, -2.5, -0.5, 16), (u) => 1 + Math.sin(u * PI) * 8)}" fill="#fff8e8"/></g>`);
    const earEl = fx.add(`<g>${paperEar(c, MALCHUS.skin)}</g>`);
    const heal = fx.add(`<g><circle r="28" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 11, 3, 4, 0))}" fill="#fff6dc"/></g>`);
    const stop = fx.add(`<g>${say(c, tr('Przestańcie, dosyć!', 'Let me at least do this'), { size: 19, side: -1, fill: mix(C.cream, C.halo, 0.25) })}</g>`);
    const robber = hanging(fx, discPlate(c, `<g transform="translate(0 40) scale(.36)">${shadowPerson(c, { ...guardOpts(c), hairStyle: 'wrap' }, BAND_INK)}</g><path d="${c.ribbon([[-40, 36], [40, -36]], 6)}" fill="${C.terracotta}" opacity=".9"/>`, { r: 56, rim: C.stone2 }), { x: 0, y: -1500, len: 700 });
    const temple = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-110, -76, 220, 152), 0.6, 8), C.wood3).p(c.cut(c.rect(-100, -66, 200, 132), 0.5, 8), mix(C.parchment, C.sun, 0.25));
      const people = [-70, -50, 50, 72].map((x) => `<g transform="translate(${x} 56)">${`<path d="${c.cut([[-6, 0], [-5, -20], [5, -20], [6, 0]], 0.2, 3) + c.cut(c.circ(0, -26, 5, 10), 0.2, 3)}" fill="${mix(C.wood3, C.ink, 0.2)}"/>`}</g>`).join('');
      return `${s.out()}<g transform="translate(0 50)">${templeMini(c, 0.72, { col: mix(C.cream, C.sun, 0.15) })}</g>${people}<g transform="translate(0 58)">${miniJesus(c, 0.7)}</g>`;
    })();
    const templePlate = hanging(fx, temple, { x: 0, y: -1500, len: 700 });
    // the power of darkness
    const darkL = S.layer({ par: 0.55, sh: 0, flat: true });
    const dL = darkL.add(`<g>${darkSheet(c, -1, { col: '#15122a' })}</g>`);
    const dR = darkL.add(`<g>${darkSheet(c, 1, { col: '#15122a' })}</g>`);

    return (t, time) => {
      const T = time;
      N.update(T);
      band.forEach((m) => bandPose(m, { x: m.x - 20 + (m.i < 4 ? 40 : 20), y: GY + m.y, s: m.s ?? 1, head: bump(t, 1.3, 2.0) * -6, lean: -bump(t, 1.25, 1.9) * 5 }, T));
      judas.set({ x: 560, y: GY + 10, s: 1.0, flip: false, armF: 16, armB: 8, head: 12, blink: blinkAt(T, 2) });

      /* v49 — "shall we strike?" */
      const fear = 0.6;
      D.forEach((m) => {
        m.p.set({ x: S.portrait ? 974 + (m.x - 948) * 0.4 : m.x + 26, y: m.y,   // phone: the Eleven closer, none under the thread
 s: m.s, flip: true, armF: m.arm, armB: 8 + fear * 30 + bump(t, 0.1, 0.9) * 50, head: -fear * 4, blink: blinkAt(T, m.seed) });
        fade(m.sad, fear);
        lamp(m, 1, 0, T);
      });
      const ak = es(t, 0.15, 0.35, ease.back) * (1 - es(t, 0.9, 1.0));
      const [ax, ay] = headAt(990, GY + 8, 0.9, true);
      vis(ask, { x: ax - 14, y: ay - 24, s: ak, o: ak > 0.01 ? 1 : 0 });

      /* v50 — the sword */
      const step = es(t, 0.9, 1.3, ease.out);
      const px = lerp(PX0, PX1, step);
      const draw = es(t, 1.0, 1.2), strike = es(t, 1.35, 1.48), after = es(t, 1.6, 1.8);
      const put = es(t, 2.1, 2.3), swap = es(t, 2.3, 2.36), back = es(t, 2.3, 2.6, ease.sine);
      pDraw.set({ x: px, y: GY + 4, s: 0.94, flip: true, o: 1 - swap, walk: step > 0 && step < 1 ? px * 0.06 : undefined, armF: 20 + draw * 30 + strike * 90 - after * 60 - put * 30, armB: 20 + strike * 20, lean: strike * 8 * (1 - after) - put * 3, head: -4 + put * 10, blink: blinkAt(T, 3) });
      const pxb = lerp(PX1, PX1 + 190, back);
      pSheath.set({ x: pxb, y: GY + 4, s: 0.94, flip: true, o: swap, walk: back > 0 && back < 1 ? pxb * 0.06 : undefined, armF: 18, armB: 10, head: 12, blink: blinkAt(T, 3) });
      fade(pSad, swap);
      const hurt = es(t, 1.42, 1.52) * (1 - es(t, 3.3, 3.5));
      const healed = es(t, 3.3, 3.5);
      malchus.set({ x: MX - hurt * 16, y: GY + 8, s: 0.98, flip: false, armF: 26 - hurt * 10, armB: 10 + hurt * 150, head: -hurt * 14 + healed * 6, lean: -hurt * 7, blink: blinkAt(T, 6) });
      fade(malSad, hurt);
      vis(flash, { x: MX + 50, y: GY - 170, s: 0.6 + strike * 0.5, r: -30, o: bump(t, 1.38, 1.75) });
      // the ear: falls, lies there, then flies back to its place
      const fall = es(t, 1.48, 1.9, ease.in);
      const [mhx, mhy] = headAt(MX - hurt * 16, GY + 8, 0.98, false);
      const ground = [mhx + 28, GY + 4];
      const home = [mhx - 6, mhy + 2];
      const ret = es(t, 3.2, 3.42);
      const ex = ret > 0 ? lerp(ground[0], home[0], ret) : lerp(mhx - 6, ground[0], fall);
      const ey = ret > 0 ? lerp(ground[1], home[1], ret) - Math.sin(ret * PI) * 30 : lerp(mhy + 2, ground[1], fall) - Math.sin(fall * PI) * 20;
      vis(earEl, { x: ex, y: ey, s: 1.2, r: ret > 0 ? (1 - ret) * 160 : fall * 160, o: t > 1.46 && t < 3.45 ? 1 : 0 });
      vis(heal, { x: home[0], y: home[1], s: 0.7 + bump(t, 3.25, 3.9) * 0.6, o: bump(t, 3.2, 3.95) });

      /* v51 — "No more!" — He touches the ear */
      const hk = [[2.05, JX], [3.0, JX], [3.2, MX + 70], [3.9, MX + 70], [4.2, JX]];
      const jx = kf(t, hk, ease.sine);
      const lift = es(t, 2.05, 2.2) * (1 - es(t, 2.9, 3.0));
      const touch = es(t, 3.18, 3.3) * (1 - es(t, 3.8, 3.95));
      const speak = es(t, 4.05, 4.3);
      const night = es(t, 6.05, 6.5);
      J.p.set({ x: jx, y: GY + 6, s: 1.04, flip: true, walk: moving(t, hk, 1) ? jx * 0.05 : undefined, armF: 20 + lift * 30 + touch * 75 + speak * 30 * (1 - night), armB: 10 + lift * 110 + speak * 20, head: -lift * 4 + touch * 6 + night * 10, blink: blinkAt(T) });
      fade(J.sad, 0.5 + night * 0.5);
      const [jhx, jhy] = headAt(JX, GY + 6, 1.04, true);
      const sk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.0));
      vis(stop, { x: jhx - 4, y: jhy - 30, s: sk, o: sk > 0.01 ? 1 : 0 });

      /* v52 — the leaders; "as against a robber?" */
      const ldOn = es(t, 3.95, 4.3);
      LD.forEach((d) => {
        d.p.set({ x: d.x + ldOn * 60, y: d.y, s: 0.92, flip: false, o: ldOn, armF: 20 + bump(t, 4.2, 4.9) * 20, armB: 8, head: -es(t, 4.3, 4.6) * 6, blink: blinkAt(T, d.seed) });
        fade(d.angry, ldOn * 0.8);
      });
      const rIn = es(t, 4.2, 4.5, ease.out) * (1 - es(t, 4.9, 5.1, ease.in));
      vis(robber, { x: 640, y: 320 - (1 - rIn) * 700, r: T ? Math.sin(T) * 2 : 0, o: rIn > 0.01 ? 1 : 0 });
      /* v53a — the Temple, every day */
      const tIn = es(t, 5.05, 5.4, ease.out) * (1 - es(t, 5.9, 6.1, ease.in));
      vis(templePlate, { x: JX, y: 320 - (1 - tIn) * 700, r: T ? Math.sin(T * 0.8) * 1.5 : 0, o: tIn > 0.01 ? 1 : 0 });
      /* v53b — your hour, and the power of darkness */
      pose(cl, { x: lerp(900, 1250, night), y: 140, o: night });
      vis(dL, { x: lerp(-700, 600, night), y: 480, o: night > 0.01 ? 0.82 : 0 });
      vis(dR, { x: lerp(2300, 1060, night), y: 480, o: night > 0.01 ? 0.82 : 0 });
      vis(pool, { x: 470, y: GY, o: 1 - night * 0.5 });

      S.cam.x = kf(t, [[-0.5, S.portrait ? 160 : 60], [0.9, S.portrait ? 140 : 40], [1.3, -40], [2.0, -40], [3.0, -60], [3.9, -60], [4.3, S.portrait ? -100 : -40], [6.9, S.portrait ? -50 : 0]]);
      S.cam.y = kf(t, [[-0.5, 60], [0.9, 70], [1.3, 100], [2.0, 90], [3.0, 150], [3.9, 150], [4.3, 40], [6.9, 40]]);
      S.cam.z = kf(t, [[-0.5, 1.16], [0.9, 1.2], [1.3, 1.3], [2.0, 1.26], [3.0, 1.46], [3.9, 1.46], [4.3, 1.08], [6.9, 1.08]]);
    };
  },
};
