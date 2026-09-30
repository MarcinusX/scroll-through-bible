// J 3,18–21 — Light and darkness on a village square at night. One man comes to Jesus: the dark sentence he
// carried crumbles and a heart glows in him; another turns his back and walks off under his own small dark
// cloud. "The light came into the world": a great lamp is let down over Jesus and makes a pool of light.
// "But people loved the darkness more": they shrink back into the shadows, "because their deeds were evil" —
// a purse, a club, dark scraps in their hands. "Whoever does evil hates the light": a man shields his eyes and
// hides his sack behind his back, and slips indoors, shutting the door. "Whoever does the truth comes to
// the light": two others step into the pool, and the bread and water they give shine out, done in God.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix, sky } from '../kit.js';
import { band, stars, moon, house, olive } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { purse, club } from '../mark14/lib.js';
import { darkPool, heart, scrap, loaf, spark, word, headAt, hand, glory, tr, PI , hangAt, vpose } from './lib.js';
import { cloud } from '../../assets/nature.js';

const GY = 700, JX = 800;

export default {
  id: 'j3-light',
  beats: [
    { v: 18, text: 'Kto wierzy w Niego, nie podlega potępieniu;' },
    { v: 18, cont: true, text: 'a kto nie wierzy, już został potępiony, bo nie uwierzył w imię Jednorodzonego Syna Bożego.' },
    { v: 19, text: 'A sąd polega na tym, że światło przyszło na świat,' },
    { v: 19, cont: true, text: 'lecz ludzie bardziej umiłowali ciemność aniżeli światło:' },
    { v: 19, cont: true, text: 'bo złe były ich uczynki.' },
    { v: 20, text: 'Każdy bowiem, kto się dopuszcza nieprawości, nienawidzi światła i nie zbliża się do światła,' },
    { v: 20, cont: true, text: 'aby nie potępiono jego uczynków.' },
    { v: 21, text: 'Kto spełnia wymagania prawdy, zbliża się do światła,' },
    { v: 21, cont: true, text: 'aby się okazało, że jego uczynki są dokonane w Bogu».' },
  ],
  cam: { x: [-60, 100], y: [0, 120], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    const NIGHT = ['#191c3e', '#2b3160', '#474a78'];
    sky(S, NIGHT);
    const H = S.layer({ par: 0.03, sh: 3 });
    H.add(`<g>${stars(c, { x0: -900, x1: 2500, y0: -700, y1: 420, n: 120 })}</g>`);
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [20, 8, 3], lens: [1000, 360, 130], color: mix(C.indigo, C.storm2, 0.5) }).markup);

    /* ---------- the square ---------- */
    const dim = (col, k = 0.45) => mix(col, C.indigo, k);
    const B = S.layer({ par: 0.3, sh: 3 });
    let hs = '';
    [[-600, 120, 150], [-420, 140, 170], [-240, 110, 140], [-80, 140, 160], [100, 120, 150], [260, 110, 130], [1330, 120, 140], [1480, 140, 170], [1660, 120, 150]].forEach(([x, w, h]) => { hs += house(c, x, 612, w, h, { wall: dim(C.plaster), shadow: dim(C.plaster2), roofEdge: dim(C.roof), door: dim(C.wood2), win: dim(C.soilDark, 0.2), stairs: false }); });
    B.add(hs + olive(c, 440, 612, 0.9, { leaf: dim(C.olive, 0.35), leaf2: dim(C.sage, 0.35), trunk: dim(C.wood2, 0.35) }));
    const L = S.layer({ par: 0.5, sh: 4 });
    L.add(sheet().p(c.ridge(c.wave(GY - 60, [3, 1.5], [500, 140]), -900, 2500, 1700, 12, 0.8), dim(C.sand2, 0.35)).out());
    let cob = '';
    for (let i = 0; i < 80; i++) cob += c.cut(c.ell(c.rr(-900, 2500), c.rr(GY - 40, 1000), c.rr(8, 18), c.rr(3, 5), 8), 0.3, 4);
    L.add(`<path d="${cob}" fill="${dim(C.sand, 0.3)}" opacity=".55"/>`);
    // the house on the right with a door that shuts
    const hx = 1060, hw = 250, hh = 230;
    L.add(sheet().p(c.cut(c.rect(hx, GY - 20 - hh, hw, hh), 0.5, 10), dim(C.plaster, 0.35)).p(c.cut(c.rect(hx - 6, GY - 26 - hh, hw + 12, 10), 0.3, 8), dim(C.roof, 0.3))
      .p(c.cut(c.rect(hx + 40, GY - 150, 64, 130), 0.3, 6), '#15122a').x(c.poly(c.rect(hx + 170, GY - 170, 34, 28)), '#15122a').out());
    const door = L.add(`<g>${sheet().p(c.cut(c.rect(0, -130, 64, 130), 0.3, 6), dim(C.wood2, 0.2)).x(c.ribbon([[8, -110], [56, -110]], 2) + c.ribbon([[8, -30], [56, -30]], 2), dim(C.wood, 0.1), 'opacity=".7"').out()}</g>`);

    /* ---------- the light ---------- */
    const Gl = S.layer({ par: 0.5, sh: 0, flat: true });
    const poolGlow = Gl.add(`<g><circle r="330" fill="url(#halo-glow)"/><ellipse cy="150" rx="260" ry="46" fill="#fff1c4" opacity=".35"/></g>`);
    const lampL = S.layer({ par: 0.5, sh: 5 });
    const bigLamp = hanging(lampL, `<g><circle r="120" fill="url(#halo-glow)"/>${glory(c, 150, 16)}${sheet().p(c.cut(c.circ(0, 0, 34, 30), 0.4, 5), C.halo).p(c.cut(c.circ(-6, -6, 22, 24), 0.3, 4), C.star).out()}</g>`, { x: JX, y: 250, len: 700 });
    const lightT = lampL.add(`<g>${word(c, tr('światło', 'the light'), { size: 20 })}</g>`);

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const mk = (o, extra = {}) => ({ ...crowdPerson(c), ...o, ...extra });
    // v18: the one who believes, the one who does not
    const aO = mk({}, { hairStyle: 'short', beard: 'short', robe: C.dustyBlue });
    const A = { p: S.puppet(P.add(person(c, aO))), k: S.puppet(P.add(person(c, { ...aO, pose: 'kneel' }))) };
    const sentence = P.add(`<g>${sheet().p(c.cut(c.rect(-18, -12, 36, 24), 0.8, 4), '#2f2a3e').x(c.ribbon([[-10, -6], [10, 6]], 2.4) + c.ribbon([[10, -6], [-10, 6]], 2.4), '#6b6280').out()}</g>`);
    const aHeart = P.add(`<g>${heart(c, 11)}</g>`);
    const bO = mk({}, { hairStyle: 'wrap', robe: C.mauve, beard: 'full' });
    const Bp = S.puppet(P.add(person(c, bO)));
    const bCloud = P.add(`<g>${cloud(c, 80, '#4a4262', '#2c2842')}</g>`);
    const nameT = P.add(`<g>${word(c, tr('Syn Boży', 'the Son of God'), { size: 17 })}</g>`);
    // v19: those who shrink back into the dark, with their deeds
    const DEEDS = [purse(c, { col: shade(C.leather, -0.2) }), `<g transform="rotate(20)">${club(c)}</g>`, `<g transform="translate(0 10)">${scrap(c, 14)}</g>`, `<g transform="translate(0 10)">${scrap(c, 16)}</g>`];
    // phone: they step back, but stay in sight
    const SH = (PH ? [[600, 530], [660, 595], [960, 1030], [1020, 1095]] : [[600, 360], [660, 440], [960, 1180], [1020, 1250]]).map(([x0, x1], i) => {
      const o = mk({}, i % 2 ? { hairStyle: 'short', beard: 'short' } : {});
      return { x0, x1, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...o, holdF: `<g class="deed" opacity="0"><g transform="scale(1.35)">${DEEDS[i]}</g></g>` }))) };
    });
    SH.forEach((s) => { s.deed = s.p.el.querySelector('.deed'); });
    const scraps = Array.from({ length: 6 }, (_, i) => ({ i, el: P.add(`<g>${scrap(c, 14 + (i % 3) * 4)}</g>`) }));
    // v20: the one who hates the light and hides
    const gO = mk({}, { hairStyle: 'curly', beard: 'full', robe: C.plumRobe, mantle: C.stone2 });
    const G = { p: S.puppet(P.add(person(c, { ...gO, holdB: `<g transform="translate(-6 -4)">${sheet().p(c.cut(c.blob(0, 18, 18, 22, 10, 0.2), 0.6, 4), shade(C.basket, -0.3)).p(c.ribbon([[-8, 0], [8, 0]], 3), C.rope).out()}</g>` }))) };
    // v21: those who do the truth
    const giveBread = `<g class="work" transform="translate(0 4)"><circle r="30" fill="url(#warm-glow)" class="wg" opacity="0"/>${loaf(c, 14)}</g>`;
    const giveJug = `<g class="work" transform="translate(0 6)"><circle r="30" fill="url(#warm-glow)" class="wg" opacity="0"/>${sheet().p(c.cut([[-9, 0], [-12, -14], [-8, -24], [-4, -30], [4, -30], [8, -24], [12, -14], [9, 0]], 0.3, 4), C.pot).out()}</g>`;
    const TR = [[260, 610, giveBread, { robe: C.sageRobe, hairStyle: 'veil', veil: C.cream, beard: 'none' }], [1320, 985, giveJug, { robe: C.ochreRobe, hairStyle: 'short', beard: 'short' }]].map(([x0, x1, w, o], i) => {
      const el = P.add(person(c, { ...mk({}, o), holdF: w }));
      return { x0, x1, i, p: S.puppet(el), wg: el.querySelector('.wg'), seed: c.rr(0, 9) };
    });

    /* ---------- the darkness (a sheet with a clear pool in the middle) ---------- */
    const D = S.layer({ par: 0.5, sh: 0, flat: true, pad: 40 });
    D.add(darkPool(S, { cx: JX, cy: 560, r0: 190, r1: 620 }));
    const D0 = S.layer({ par: 0.5, sh: 0, flat: true });
    D0.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#120f24" opacity=".32"/>`);

    /* ---------- lights above the darkness ---------- */
    const X = S.layer({ par: 0.5, sh: 5 });
    const works = X.add(`<g>${word(c, tr('dokonane w Bogu', 'done in God'), { size: 18 })}</g>`);
    const sparks = Array.from({ length: 8 }, (_, i) => ({ i, el: X.add(`<g>${spark(c, 8)}</g>`) }));
    const evilT = X.add(`<g>${word(c, tr('złe uczynki', 'evil works'), { size: 16, fill: '#4a4466', ink: C.cream })}</g>`);
    const hateEl = X.add(`<g>${word(c, tr('nienawidzi światła', 'hates the light'), { size: 15, fill: '#4a4466', ink: C.cream })}</g>`);

    return (t, time) => {
      const T = time;
      /* the light comes; the darkness gathers around it */
      const lamp = es(t, 2.05, 2.55, ease.out);
      hangAt(bigLamp, JX, lerp(-300, 240, lamp), T, lamp > 0 ? 1 : 0, 0.8, 0.6);
      vpose(lightT, { x: JX + 130, y: 250 + Math.sin(T) * 4, s: es(t, 2.4, 2.6, ease.back), o: seg(t, 2.4, 2.45) * (1 - es(t, 3.9, 4.05)) });
      vpose(poolGlow, { x: JX, y: 560, s: 0.7 + lamp * 0.4, o: 0.35 + lamp * 0.65 });
      D.fade(es(t, 2.2, 2.7) * 0.75 + es(t, 3.0, 3.6) * 0.25);
      D0.fade(1 - es(t, 2.1, 2.6) * 0.6);

      jesus.set({ x: JX, y: GY, s: 1.05, armF: 20 + bump(t, 0.1, 0.9) * 50 + bump(t, 1.2, 1.9) * 20 + bump(t, 7.05, 7.9) * 70 + es(t, 8.1, 8.4) * 60, armB: 10 + bump(t, 0.1, 0.9) * 40 + es(t, 8.1, 8.4) * 60, head: bump(t, 0.3, 0.9) * -6, blink: blinkAt(T, 2) });

      /* v18a — A comes and kneels; his sentence crumbles; a heart glows */
      const aw = es(t, 0.02, 0.35), kn = es(t, 0.35, 0.42);
      const ax = lerp(430, 690, aw);
      A.p.set({ x: ax, y: GY + 4, s: 0.98, o: 1 - kn, walk: aw > 0 && aw < 1 ? ax * 0.05 : undefined, armF: 40, blink: blinkAt(T, 1) });
      A.k.set({ x: 690, y: GY + 4, s: 0.98, o: kn, armF: 50 + es(t, 0.45, 0.65) * 40, armB: 30 + es(t, 0.45, 0.65) * 60, head: -10, blink: blinkAt(T, 1) });
      const crumble = es(t, 0.42, 0.65);
      const [ahx, ahy] = hand(ax, GY + 4, 0.98, false, 40);
      vpose(sentence, { x: kn > 0.5 ? 720 : ahx, y: kn > 0.5 ? GY - 70 - crumble * 30 : ahy, s: 1 - crumble * 0.8, r: crumble * 90, o: 1 - crumble });
      vpose(aHeart, { x: 700, y: GY - 175, s: 1.3 * es(t, 0.5, 0.7, ease.back) * (1 + Math.sin(T * 3) * 0.06), o: seg(t, 0.5, 0.55) });

      /* v18b — B turns his back and goes, under his own small cloud */
      const bw = es(t, 1.15, 1.8);
      const bx = lerp(960, PH ? 1075 : 1230, bw);
      Bp.set({ x: bx, y: GY + 6, s: 0.98, flip: !(bw > 0), walk: bw > 0 && bw < 1 ? bx * 0.05 : undefined, armF: 10, head: bw > 0 ? 8 : 0, o: 1 - es(t, 2.5, 2.8), blink: blinkAt(T, 3) });
      const [bhx, bhy] = headAt(bx, GY + 6, 0.98, false);
      vpose(bCloud, { x: bhx, y: bhy - 48 + Math.sin(T * 1.5) * 3, s: es(t, 1.3, 1.6, ease.back), o: seg(t, 1.3, 1.35) * (1 - es(t, 2.5, 2.8)) });
      vpose(nameT, { x: JX, y: GY - 270, s: es(t, 1.4, 1.6, ease.back), o: seg(t, 1.4, 1.45) * (1 - es(t, 1.95, 2.1)) });

      /* v19b–c — they shrink back into the dark, with their deeds in hand */
      SH.forEach((s) => {
        const back = es(t, 3.05 + s.i * 0.05, 3.55 + s.i * 0.05);
        const x = lerp(s.x0, s.x1, back);
        const right = s.x0 > JX;
        const show = es(t, 4.05 + s.i * 0.06, 4.25 + s.i * 0.06);
        s.p.set({ x, y: GY + 10 + (s.i % 2) * 14, s: 0.95, flip: back > 0 && back < 1 ? !right : right, walk: back > 0 && back < 1 ? x * 0.05 : undefined, armF: 20 + show * 50, armB: 20 + bump(t, 3.1, 3.6) * 60, head: back * 12 - show * 4, lean: back * 6, o: seg(t, 2.6, 2.8) * (1 - (PH ? es(t, 4.9, 5.05) : es(t, 6.9, 7.2))), blink: blinkAt(T, s.seed) });   // phone: they make room for the one who hides
        fade(s.deed, show);
      });
      scraps.forEach((sp) => {
        const k = seg(t, 4.3 + sp.i * 0.05, 5.0 + sp.i * 0.05);
        const s = SH[sp.i % 4];
        vpose(sp.el, { x: s.x1 + Math.sin(k * PI * 2 + sp.i) * 20, y: GY - 150 - k * 140, r: k * 200, s: 0.8 + k * 0.4, o: Math.sin(k * PI) * (1 - es(t, 6.8, 7)) });
      });

      vpose(evilT, { x: PH ? 570 : 470, y: GY - 290, s: es(t, 4.1, 4.3, ease.back), r: 3, o: seg(t, 4.1, 4.15) * (1 - es(t, 4.95, 5.1)) });

      /* v20 — the evildoer hates the light: shields his eyes, hides his sack, slips inside and shuts the door */
      const gIn = es(t, 5.0, 5.3), shield = es(t, 5.3, 5.5) * (1 - es(t, 6.2, 6.4));
      const gGo = es(t, 6.2, 6.7);
      const gx = lerp(980, 1100, gIn) + gGo * 30;
      G.p.set({ x: gx, y: GY - 18, s: 0.92, flip: !(gGo > 0), walk: (gIn > 0 && gIn < 1) || (gGo > 0 && gGo < 1) ? gx * 0.05 : undefined, armF: 30 + shield * 110, armB: 20 + es(t, 6.0, 6.2) * 20, head: shield * 16, lean: -shield * 6, o: seg(t, 4.95, 5.0) * (1 - es(t, 6.6, 6.8)), blink: blinkAt(T, 7) });
      vpose(hateEl, { x: PH ? 1040 : 1060, y: GY - 300, s: es(t, 5.3, 5.5, ease.back), r: -4, o: seg(t, 5.3, 5.35) * (1 - es(t, 6.8, 7)) });
      const shut = es(t, 6.65, 6.9);
      vpose(door, { x: hx + 40, y: GY - 20, sx: 0.08 + shut * 0.92 });

      /* v21 — those who do the truth come to the light, and their works shine */
      TR.forEach((tr_) => {
        const k = es(t, 7.05 + tr_.i * 0.1, 7.7 + tr_.i * 0.1);
        const x = lerp(tr_.x0, tr_.x1, k);
        const lift = es(t, 8.1, 8.4);
        tr_.p.set({ x, y: GY + 8, s: 0.98, flip: tr_.x0 > JX, walk: k > 0 && k < 1 ? x * 0.05 : undefined, armF: 40 + lift * 70, armB: 10 + lift * 30, head: -lift * 6, blink: blinkAt(T, tr_.seed), o: seg(t, 6.9, 7.05) });
        fade(tr_.wg, lift * 0.85);
      });
      vpose(works, { x: JX, y: GY - 300, s: es(t, 8.25, 8.45, ease.back), o: seg(t, 8.25, 8.3) });
      sparks.forEach((sp) => {
        const a = (sp.i / 8) * PI * 2 + T * 0.5;
        const w = TR[sp.i % 2];
        const [wx, wy] = hand(w.x1, GY + 8, 0.98, w.x0 > JX, 110);
        vpose(sp.el, { x: wx + Math.cos(a) * 34, y: wy + Math.sin(a) * 22, s: es(t, 8.2, 8.4) * (0.7 + Math.sin(T * 4 + sp.i) * 0.3), o: seg(t, 8.2, 8.25) });
      });

      S.cam.x = -es(t, 0, 0.5) * 40 * (1 - es(t, 1.1, 1.5)) + es(t, 1.1, 1.5) * 40 * (1 - es(t, 2, 2.4)) + es(t, 5, 5.4) * (PH ? 90 : 50) * (1 - es(t, 6.8, 7.1));
      S.cam.y = 60;
      S.cam.z = 1.14 - es(t, 2.0, 2.5) * 0.08 + es(t, 7.9, 8.5) * 0.06;
    };
  },
};
