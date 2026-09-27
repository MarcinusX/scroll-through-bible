// Mk 14,26–31 — after the hymn (notes rise from the lit window of the upper room) they go out under the moon
// to the Mount of Olives. "You will all fall away": on a hanging night-panel the shepherd is struck and the paper
// sheep scatter; at sunrise He goes ahead of them to Galilee. Peter: "Not I!" — a rooster is lowered from the flies,
// two cries, three dark marks. "Even if I must die with you…" — and they all say the same.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  garden, TW, kf, moving, hand, headAt, withFace, faceBits, note, sheep, shadowPerson, rooster, tally, discPlate, wordTag, signpost,
  speech, GLYPH, voiceRings, PI,
vis, } from './lib.js';

const GY = 700, JX = 800;
const PW = 440, PH = 220;           // the hanging night panel

export default {
  id: 'm14-olives',
  beats: [
    { v: 26 },
    { v: 27, text: 'Wtedy Jezus im rzekł: «Wszyscy zwątpicie we Mnie.' },
    { v: 27, cont: true, text: 'Jest bowiem napisane: Uderzę pasterza, a rozproszą się owce.' },
    { v: 28 },
    { v: 29 },
    { v: 30 },
    { v: 31, text: 'Lecz on tym bardziej zapewniał: «Choćby mi przyszło umrzeć z Tobą, nie wyprę się Ciebie».' },
    { v: 31, cont: true, text: 'I wszyscy tak samo mówili.' },
  ],
  cam: { x: [-80, 80], y: [-40, 200], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const G = garden(S, { moonAt: [1180, 170], rockX: 1320 });

    // the upper room far off on the left: a lit window, notes rising
    const noteL = S.layer({ par: 0.12, sh: 1 });
    noteL.add(`<g><path d="${c.cut(c.rect(250, 430, 70, 50), 0.4, 5)}" fill="${mix(C.plaster2, C.indigo, 0.45)}"/><path d="${c.cut(c.rect(272, 442, 20, 16), 0.2, 3)}" fill="${C.lampFlame}"/><circle cx="282" cy="450" r="40" fill="url(#warm-glow)"/></g>`);
    const notes = Array.from({ length: 6 }, (_, i) => ({ i, el: noteL.add(`<g>${note(c, C.star)}</g>`) }));

    // the night panel: shepherd and sheep
    const pL = S.layer({ par: 0.2, sh: 6 });
    const clip = S.id('pan');
    const INK = '#231d3a';
    const frame = sheet().p(c.cut(c.rect(-PW / 2 - 10, -10, PW + 20, PH + 20), 0.6, 8), C.wood2).out();
    const bg = `<rect x="${-PW / 2}" y="0" width="${PW}" height="${PH}" fill="#34386a"/>`;
    const dawnBg = `<rect data-k="pdawn" x="${-PW / 2}" y="0" width="${PW}" height="${PH}" fill="#f0c9a2" opacity="0"/>`;
    const sunP = `<g data-k="psun"><circle r="46" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(0, 0, 22, 24), 0.3, 3)}" fill="${C.sun}"/></g>`;
    const hill = sheet().p(c.cut([[-PW / 2 - 6, PH], [-PW / 2 - 6, 176], [-100, 168], [40, 172], [160, 160], [PW / 2 + 6, 164], [PW / 2 + 6, PH]], 1, 10), '#4c5a6e').out(false);
    const staff = `<path d="${c.ribbon(c.qbez([0, 20], [2, -60], [-10, -72], 10), 3)}" fill="${INK}"/>`;
    const shep = `<g data-k="shep">${shadowPerson(c, { robe: INK, hairStyle: 'wrap', beard: 'full' }, INK).replace('<g class="hold"', '<g class="holdx"')}</g>`;
    const staffEl = `<g data-k="pstaff">${staff}</g>`;
    const flock = Array.from({ length: 9 }, (_, i) => `<g data-k="psh${i}">${sheep(c)}</g>`).join('');
    const post = `<g data-k="ppost">${signpost(c, tr('Galilea', 'Galilee'), { size: 16 })}</g>`;
    const slash = `<g data-k="pslash"><path d="${c.ribbon([[-40, -60], [0, -10], [30, 30]], (u) => 2 + Math.sin(u * PI) * 8)}" fill="#e9e2f0"/></g>`;
    const panel = hanging(pL, `${frame}<defs><clipPath id="${clip}"><rect x="${-PW / 2}" y="0" width="${PW}" height="${PH}"/></clipPath></defs><g clip-path="url(#${clip})">${bg}${dawnBg}${sunP}${hill}${post}${flock}${shep}${staffEl}${slash}</g>`, { x: JX, y: 170, len: 700 });
    const shepP = S.puppet(S.$('shep').firstElementChild);
    const pStaff = S.$('pstaff'), pSlash = S.$('pslash'), pDawn = S.$('pdawn'), pSun = S.$('psun'), pPost = S.$('ppost');
    const pSheep = Array.from({ length: 9 }, (_, i) => ({ i, el: S.$('psh' + i), x0: -120 + (i % 5) * 36 + c.rr(-6, 6), y0: 180 + Math.floor(i / 5) * 12, a: c.rr(0, PI * 2), d: c.rr(160, 260) }));

    // the rooster and three dark marks
    const rL = S.layer({ par: 0.3, sh: 5 });
    const RX = 950;
    const roost = hanging(rL, discPlate(c, `<g transform="translate(-4 36) scale(.9)">${rooster(c)}</g>`, { r: 58, fill: mix(C.dawn, C.peach, 0.3), rim: C.ochre }), { x: 1030, y: 250, len: 700 });
    const cry = voiceRings(rL, c, { n: 3, color: C.cream, r: 28, w: 4, both: false });
    const marks = hanging(rL, `${sheet().p(c.cut(c.rect(-44, 0, 88, 50), 0.5, 6), C.cream).out()}<g transform="translate(-12 40)">${tally(c, 3, C.ink, 28)}</g>`, { x: 1030, y: 350, len: 700 });

    // the eleven and Jesus
    const P = S.layer({ par: 0.52, sh: 5 });
    const DIS = [
      { k: 'andrew', x: 450, y: GY - 16 }, { k: 'james', x: 525, y: GY - 10 }, { k: 'thomas', x: 590, y: GY - 22 }, { k: 'john', x: 650, y: GY },
      { k: 'peter', x: 690, y: GY + 6 }, { k: 'matthew', x: 890, y: GY - 20 }, { k: 'philip', x: 945, y: GY }, { k: 'bartholomew', x: 1010, y: GY - 14 },
      { k: 'jamesA', x: 1070, y: GY - 4 }, { k: 'thaddaeus', x: 1125, y: GY - 18 }, { k: 'simonZ', x: 1180, y: GY - 2 },
    ].sort((a, b) => a.y - b.y).map((d, i) => {
      const el = P.add(withFace(person(c, TW[d.k]), faceBits(c)));
      return { ...d, i, seed: c.rr(0, 9), p: S.puppet(el), sad: el.querySelector('[data-part="sad"]'), from: c.rr(-420, -80) };
    });
    const jesus = S.puppet(P.add(withFace(person(c, CAST.jesus), faceBits(c))));
    const jSad = jesus.el.querySelector('[data-part="sad"]');
    const PE = DIS.find((d) => d.k === 'peter');
    const fx = S.layer({ par: 0.55, sh: 4 });
    const bangP = fx.add(`<g>${speech(c, `<g transform="translate(-10 0) scale(1.1)">${GLYPH.bang(c)}</g><g transform="translate(12 0) scale(1.1)">${GLYPH.bang(c)}</g>`, { w: 60, h: 50, flip: false })}</g>`);
    const bangs = DIS.filter((d) => d.k !== 'peter').map((d) => ({ d, el: fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 34, h: 38, flip: d.x > JX })}</g>`) }));

    return (t, time) => {
      const T = time;
      swing(G.moon, 1180, 170, T, 1, 0.6);

      /* v26 — the hymn, then out to the Mount of Olives */
      notes.forEach((n) => {
        const k = seg(t, -0.3 + n.i * 0.08, 0.5 + n.i * 0.08);
        vis(n.el, { x: 282 + Math.sin(k * 6 + n.i) * 16 + k * 30, y: 440 - k * 160, s: 0.8 + k * 0.4, r: Math.sin(T * 2 + n.i) * 10, o: k > 0 && k < 1 ? Math.min(1, (1 - k) * 3) : 0 });
      });
      const walkK = (d) => [[0.3 + d * 0.0005, -1], [1.0, 0]];
      const fall = es(t, 1.05, 1.35) * (1 - es(t, 3.05, 3.4));
      const struck = es(t, 2.2, 2.45);
      const ahead = es(t, 3.05, 3.5);
      const insist = es(t, 6.05, 6.3);
      const all = es(t, 7.05, 7.3);
      DIS.forEach((d) => {
        const u = es(t, 0.25 + (d.x - 400) / 2400, 0.9 + (d.x - 400) / 2400, ease.out);
        const x = lerp(d.from, d.x, u);
        const moving_ = u > 0.001 && u < 0.999;
        const isP = d.k === 'peter';
        const step = isP ? es(t, 4.05, 4.3) * 26 : 0;
        let armF = 12 + all * 60, armB = 6 + all * (d.i % 2 ? 110 : 20), head = fall * 14 + struck * 6 * (1 - ahead) - ahead * 8 - all * 6;
        if (isP) {
          const boast = es(t, 4.05, 4.3);
          armF = 12 + boast * 70 * (1 - es(t, 5.05, 5.3)) + insist * 80 + all * 20;
          armB = 6 + boast * 40 + insist * 60;
          head = fall * 14 * (1 - boast) - boast * 10 + es(t, 5.3, 5.6) * 12 * (1 - insist) - insist * 8;
        }
        fade(d.sad, fall * (1 - ahead * 0.7) + (isP ? es(t, 5.3, 5.6) * (1 - insist) : 0));
        d.p.set({ x: x + step, y: d.y, s: 0.92, flip: d.x > JX && u >= 0.999, o: seg(t, 0.2, 0.3), walk: moving_ ? x * 0.05 : undefined, armF, armB, head, lean: isP ? insist * 6 : 0, blink: blinkAt(T, d.seed) });
      });
      const ju = es(t, 0.2, 0.85, ease.out);
      const jx = lerp(-200, JX, ju);
      const toPeter = es(t, 4.1, 4.3) * (1 - es(t, 7.0, 7.2));
      jesus.set({ x: jx, y: GY + 4, s: 1.04, flip: toPeter > 0.5, o: seg(t, 0.15, 0.25), walk: ju > 0.001 && ju < 0.999 ? jx * 0.05 : undefined, armF: 20 + bump(t, 1.1, 1.9) * 40 + bump(t, 2.1, 2.9) * 50 + bump(t, 3.1, 3.9) * 60 + toPeter * 50, armB: 10 + bump(t, 3.2, 3.9) * 90, head: fall * 6 - bump(t, 3.2, 3.9) * 10 + toPeter * 4, blink: blinkAt(T) });
      fade(jSad, es(t, 1.05, 1.3) * (1 - es(t, 3.1, 3.3)) + es(t, 5.1, 5.4) * 0.8);

      /* v27b–28 — the panel: the shepherd struck, the sheep scattered; then He goes ahead to Galilee */
      const pin = es(t, 1.95, 2.3, ease.out) * (1 - es(t, 3.9, 4.2, ease.in));
      vis(panel, { x: JX, y: 170 - (1 - pin) * 700, r: Math.sin(T * 0.7) * 1, o: pin > 0.01 ? 1 : 0 });
      const rise = es(t, 3.1, 3.5);
      const go = es(t, 3.4, 3.95);
      const fallS = struck * (1 - rise);
      shepP.set({ x: lerp(0, 150, go), y: 184 - fallS * 6 + go * -14, s: 0.42, r: -fallS * 70, o: 1, walk: go > 0 && go < 1 ? go * 30 : undefined, armF: 30 });
      vis(pStaff, { x: lerp(8, 158, go) + fallS * 30, y: 150 + fallS * 34 - go * 14, r: fallS * 80, o: 1 });
      vis(pSlash, { x: 0, y: 140, s: es(t, 2.2, 2.3), o: bump(t, 2.2, 2.6) });
      fade(pDawn, rise * 0.9);
      vis(pSun, { x: 120, y: lerp(230, 90, rise), o: rise > 0.01 ? 1 : 0 });
      vis(pPost, { x: 190, y: 172, s: 0.8, o: rise });
      pSheep.forEach((sp) => {
        const sc = es(t, 2.3 + sp.i * 0.02, 2.75 + sp.i * 0.02) * (1 - rise);
        const follow = go;
        const x = sp.x0 + Math.cos(sp.a) * sp.d * sc + follow * (110 + (sp.i % 5) * -14), y = sp.y0 + Math.sin(sp.a) * 30 * sc - follow * 10;
        vis(sp.el, { x, y, s: 0.42, sx: Math.cos(sp.a) < 0 && sc > 0.3 ? -1 : 1, o: 1 });
      });

      /* v30 — the rooster: two cries, three marks */
      const rin = es(t, 5.1, 5.4, ease.out) * (1 - es(t, 7.6, 7.9, ease.in) * 0);
      vis(roost, { x: RX, y: 250 - (1 - rin) * 700, r: Math.sin(T * 0.9) * 2, o: rin > 0.01 ? 1 : 0 });
      const crow1 = bump(t, 5.35, 5.6), crow2 = bump(t, 5.6, 5.85);
      cry(RX + 44, 222 - (1 - rin) * 700, Math.max(crow1, crow2), T);
      const mk = es(t, 5.5, 5.8, ease.out);
      vis(marks, { x: RX, y: 350 - (1 - mk) * 700, r: Math.sin(T * 1.1 + 1) * 2, o: mk > 0.01 ? 1 : 0 });

      const [px, py] = headAt(PE.x + es(t, 4.05, 4.3) * 26, PE.y, 0.92, false);
      const bp = es(t, 4.15, 4.35, ease.back) * (1 - es(t, 4.9, 5.05)) + es(t, 6.15, 6.35, ease.back) * (1 - es(t, 6.9, 7.05));
      vis(bangP, { x: px + 16, y: py - 24, s: bp * (1 + insist * 0.2), o: bp > 0.01 ? 1 : 0 });
      bangs.forEach((b, i) => {
        const [bx, by] = headAt(b.d.x, b.d.y, 0.92, b.d.x > JX);
        const k = es(t, 7.1 + i * 0.03, 7.3 + i * 0.03, ease.back);
        vis(b.el, { x: bx + (b.d.x > JX ? -10 : 10), y: by - 22, s: k * 0.9, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, -60], [0.9, 0], [4.0, 0], [4.3, -30], [5.0, 0], [5.3, 40], [6.0, 0], [6.3, -30], [7.0, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.0], [0.9, 1.12], [1.9, 1.16], [2.3, 1.04], [4.0, 1.04], [4.3, 1.3], [5.0, 1.2], [5.3, 1.14], [6.0, 1.2], [6.3, 1.36], [7.0, 1.12]]);
      S.cam.y = kf(t, [[-0.5, 0], [0.9, 90], [1.9, 110], [2.3, 20], [4.0, 20], [4.3, 150], [5.0, 120], [5.3, 60], [6.0, 120], [6.3, 180], [7.0, 90]]);
    };
  },
};
