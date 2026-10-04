// Mk 14,43–50 — torches among the olive trees: Judas comes, and behind him a band with swords and clubs
// (dark paper silhouettes). The sign; "Rabbi!" and the kiss — a single held moment. They lay hands on Him and
// bind Him; a sword flashes and the servant clutches his ear. "Have you come out as against a robber?" —
// every day in the Temple… but the Scriptures must be fulfilled. And they all left Him and fled.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { ear } from '../../assets/things.js';
import {
  garden, TW, LOOK, kf, moving, hand, headAt, withFace, faceBits, shadowPerson, guardOpts, torch, sword, club, cord, seal, speech, say,
  scrollOpen, discPlate, templeMini, vignette, PI,
vis, } from './lib.js';

const GY = 700, JX = 800;
const INK = '#1d1830';

export default {
  id: 'm14-arrest',
  beats: [
    { v: 43, text: 'I zaraz, gdy On jeszcze mówił, zjawił się Judasz, jeden z Dwunastu,' },
    { v: 43, cont: true, text: 'a z nim zgraja z mieczami i kijami wysłana przez arcykapłanów, uczonych w Piśmie i starszych.' },
    { v: 44 },
    { v: 45 },
    { v: 46 },
    { v: 47 },
    { v: 48 },
    { v: 49, text: 'Codziennie nauczałem u was w świątyni, a nie pojmaliście Mnie.' },
    { v: 49, cont: true, text: 'Ale Pisma muszą się wypełnić».' },
    { v: 50 },
  ],
  cam: { x: [-260, 160], y: [-40, 220], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    const G = garden(S, { moonAt: [1240, 150], rockX: 1400, city: false });
    const darkL = S.layer({ par: 0.4, sh: 0, flat: true });
    darkL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#120f24" opacity=".38"/>`);
    // the torchlight pool that comes with them
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const pool = glowL.add(`<g><ellipse cx="0" cy="-120" rx="420" ry="300" fill="url(#warm-glow)" opacity=".55"/></g>`);

    // the band: silhouettes with torches, swords and clubs
    const mobL = S.layer({ par: 0.5, sh: 5 });
    const kinds = ['torch', 'sword', 'club', 'torch', 'club', 'sword', 'torch', 'club', 'sword'];
    const mob = kinds.map((k, i) => {
      const prop = k === 'torch' ? torch(c, 54) : k === 'sword' ? sword(c, 56) : club(c, 60);
      const el = mobL.add(`<g>${shadowPerson(c, guardOpts(c), INK)}<g class="prop" transform="translate(30 -96) rotate(${k === 'torch' ? -8 : 10})">${prop.replace(/fill="(#[0-9a-f]{6})"/g, (m, col) => k === 'torch' ? m : `fill="${mix(col, INK, 0.5)}"`)}</g></g>`);
      const x = 180 + i * 50 + (i % 2) * 14;   // phone: the band closer together (below)
      return { i, k, el, fl: el.querySelector('.flame'), x: S.portrait ? 150 + x * 0.75 : x, y: GY - 14 + (i % 3) * 10, s: 0.9 + (i % 2) * 0.06, from: -300 - i * 60 };
    });
    // the high priest's servant (in colour), and Judas
    const P = S.layer({ par: 0.52, sh: 5 });
    const servantEl = P.add(person(c, LOOK.servant));
    const servant = S.puppet(servantEl);
    const jdEl = P.add(withFace(person(c, TW.judas), faceBits(c)));
    const judas = S.puppet(jdEl);
    // the disciples on the right
    const DIS = [{ k: 'peter', x: 900 }, { k: 'john', x: 965 }, { k: 'james', x: 1030 }, { k: 'andrew', x: 1095 }, { k: 'thomas', x: 1160 }, { k: 'philip', x: 1225 }]
      .map((d, i) => ({ ...d, x: S.portrait ? 900 + (d.x - 900) * 0.45 : d.x, i, seed: c.rr(0, 9), p: S.puppet(P.add(withFace(person(c, TW[d.k]), faceBits(c)))) }));   // phone: the six closer together, the last not under the thread
    DIS.forEach((d) => { d.sad = d.p.el.querySelector('[data-part="sad"]'); });
    const peterSword = S.puppet(P.add(person(c, { ...TW.peter, holdF: `<g transform="rotate(-100)">${sword(c, 56)}</g>` })));
    const jEl = P.add(withFace(person(c, { ...CAST.jesus }), faceBits(c)));
    const jesus = S.puppet(jEl);
    const jSad = jEl.querySelector('[data-part="sad"]');
    // the seizing hands (two of the band step close, in front)
    const front = S.layer({ par: 0.54, sh: 5 });
    const grab = [0, 1].map((i) => ({ i, p: S.puppet(front.add(shadowPerson(c, guardOpts(c), INK))) }));

    // effects
    const spotL = S.layer({ par: 0.56, sh: 0, flat: true });
    spotL.add(vignette(S, { cx: 770, cy: 520, r: 300, col: '#0c0a18', o: 0.75 }));
    const fx = S.layer({ par: 0.58, sh: 4 });
    const AX = S.portrait ? 540 : 420;   // phone: the high priests' seal over the band, inside the screen
    const authority = hanging(fx, discPlate(c, seal(c, 26), { r: 34, rim: C.stone2, fill: C.parchment }), { x: S.portrait ? AX : 520, y: 300, len: 600 });
    const sign = fx.add(`<g>${speech(c, (() => {
      const s = sheet();
      s.p(c.cut(c.circ(-10, 0, 9, 12), 0.2, 3), C.skin2).p(c.cut(c.circ(10, 0, 9, 12), 0.2, 3), C.skin);
      s.x(c.poly(c.circ(10, 0, 13, 14)), 'none');
      return `<circle cx="10" cy="0" r="16" fill="url(#halo-glow)"/>${s.out()}<path d="${c.ribbon(c.arc(0, 14, 8, 5, 0.3, PI - 0.3, 6), 2.4)}" fill="${C.terracotta}"/>`;
    })(), { w: 64, h: 46, flip: false })}</g>`);
    const rabbi = fx.add(`<g>${say(c, tr('Rabbi!', 'Rabbi!'), { size: 22, side: 1 })}</g>`);
    const cordEl = fx.add(`<g>${cord(c)}</g>`);
    const flash = fx.add(`<g><path d="${c.ribbon(c.arc(0, 0, 70, 70, -2.4, -0.4, 16), (u) => 1 + Math.sin(u * PI) * 9)}" fill="#fff8e8"/><circle r="40" fill="url(#halo-glow)"/></g>`);
    const earEl = fx.add(`<g transform="scale(.3)">${ear(c, C.skin3)}</g>`);
    const robber = hanging(fx, discPlate(c, `<g transform="translate(0 40) scale(.36)">${shadowPerson(c, { ...guardOpts(c), hairStyle: 'wrap' }, INK)}</g><path d="${c.ribbon([[-40, 36], [40, -36]], 6)}" fill="${C.terracotta}" opacity=".9"/>`, { r: 50, rim: C.stone2 }), { x: 620, y: 300, len: 700 });
    const temple = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-90, -60, 180, 120), 0.5, 8), mix(C.parchment, C.sun, 0.25));
      const people = [-60, -40, 40, 60].map((x) => `<path d="${c.cut([[x - 6, 44], [x - 5, 24], [x + 5, 24], [x + 6, 44]], 0.2, 3) + c.cut(c.circ(x, 18, 5, 10), 0.2, 3)}" fill="${mix(C.wood3, C.ink, 0.2)}"/>`).join('');
      return `${s.out()}<g transform="translate(0 46)">${templeMini(c, 0.7, { col: mix(C.cream, C.sun, 0.15) })}</g>${people}<g transform="translate(0 44)"><circle cy="-22" r="16" fill="url(#halo-glow)"/><path d="${c.cut([[-6, 0], [-5, -18], [5, -18], [6, 0]], 0.2, 3) + c.cut(c.circ(0, -22, 5, 10), 0.2, 3)}" fill="${C.linen}"/></g>`;
    })();
    const templePlate = hanging(fx, `${sheet().p(c.cut(c.rect(-100, -70, 200, 140), 0.6, 8), C.wood3).out()}${temple}`, { x: JX, y: 330, len: 700 });
    const scroll = hanging(fx, `<g transform="scale(1.4)"><circle r="70" fill="url(#halo-glow)"/>${scrollOpen(c, 110, 60)}</g>`, { x: JX, y: 320, len: 700 });

    return (t, time) => {
      const T = time;
      swing(G.moon, 1240, 150, T, 1, 0.6);

      /* v43 — Judas; the band */
      const jdK = [[-0.3, [-120, GY]], [0.8, [560, GY]], [2.05, [560, GY]], [2.3, [590, GY]], [3.05, [590, GY]], [3.45, [735, GY]], [4.05, [735, GY]], [4.4, [520, GY]]];
      const [jdx, jdy] = kf(t, jdK, ease.sine);
      const toBand = es(t, 2.05, 2.15) * (1 - es(t, 2.9, 3.0));
      const kiss = es(t, 3.45, 3.65) * (1 - es(t, 3.95, 4.1));
      judas.set({ x: jdx, y: jdy, s: 1.0, flip: toBand > 0.5 || t > 4.1, walk: moving(t, jdK, 1) ? jdx * 0.05 : undefined, armF: 20 + toBand * 40 + kiss * 40, armB: 8 + bump(t, 3.1, 3.5) * 60, head: kiss * 10 - toBand * 4, lean: kiss * 8, blink: blinkAt(T, 2) });
      fade(jdEl.querySelector('[data-part="angry"]'), toBand * 0.6);
      const band = es(t, 0.95, 1.7, ease.out);
      const surge = es(t, 4.05, 4.5);
      const flee = es(t, 9.05, 9.5);
      mob.forEach((m) => {
        const k = es(t, 0.95 + m.i * 0.04, 1.6 + m.i * 0.04, ease.out);
        const x = lerp(m.from, m.x, k) + surge * (m.i > 5 ? 180 : 90);
        vis(m.el, { x, y: m.y, s: m.s, o: k > 0.001 ? 1 : 0 });
        if (m.fl && k > 0.001) pose(m.fl, { x: 0, y: -64, sy: 1 + Math.sin(T * 8 + m.i) * 0.1, sx: 1 + Math.sin(T * 6 + m.i) * 0.06 });
      });
      vis(pool, { x: lerp(-200, 420, band) + surge * 200, y: GY, o: 1 });
      darkL.fade(0.7 + es(t, 3.05, 3.4) * 0.3);
      const aIn = es(t, 1.2, 1.5, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      vis(authority, { x: AX, y: 330 - (1 - aIn) * 600, r: Math.sin(T) * 3, o: aIn > 0.01 ? 1 : 0 });
      const sg = es(t, 2.2, 2.4, ease.back) * (1 - es(t, 2.85, 2.95));
      const [jhx, jhy] = headAt(jdx, jdy, 1.0, true);
      vis(sign, { x: jhx - 8, y: jhy - 24, s: sg, o: sg > 0.01 ? 1 : 0 });
      const rb = es(t, 3.2, 3.4, ease.back) * (1 - es(t, 3.5, 3.6));
      vis(rabbi, { x: jhx + 10, y: jhy - 18, s: rb, o: rb > 0.01 ? 1 : 0 });
      spotL.fade(es(t, 3.4, 3.6) * (1 - es(t, 4.0, 4.2)));

      /* v46 — they seize Him; His hands are bound */
      grab.forEach((g) => {
        const k = es(t, 4.05 + g.i * 0.08, 4.4 + g.i * 0.08, ease.out);
        const x = g.i === 0 ? lerp(420, 720, k) : lerp(300, 690, k);
        g.p.set({ x: x - flee * 0, y: GY + 10 + g.i * 6, s: 0.98, flip: false, o: k > 0.01 ? 1 : 0, armF: 20 + k * 60, armB: k * 40, lean: k * 6 });
      });
      // the servant comes round to His other side with the ones who seize Him
      const svK = [[1.0, [-200, GY]], [1.8, [470, GY + 6]], [4.05, [470, GY + 6]], [4.5, [870, GY + 6]]];
      const [svx, svy] = kf(t, svK, ease.sine);
      const hurt = es(t, 5.2, 5.35);
      servant.set({ x: svx, y: svy, s: 0.96, flip: t > 4.5, walk: moving(t, svK, 1) ? svx * 0.05 : undefined, armF: 30 + es(t, 4.3, 4.5) * 50 * (1 - hurt), armB: hurt * 150, head: hurt * -14, lean: -hurt * 8, blink: blinkAt(T, 6) });

      /* Jesus */
      const bound = es(t, 4.35, 4.6);
      const speak = es(t, 6.05, 6.3) * (1 - es(t, 8.9, 9.1));
      const alone = es(t, 9.3, 9.8);
      jesus.set({ x: JX, y: GY + 4, s: 1.04, flip: t < 5.8 || t > 6.05, armF: bound ? 24 + bump(t, 0.05, 0.9) * 40 * (1 - bound) : 20 + bump(t, 0.05, 0.9) * 40, armB: 10 + bound * 16 + speak * 20 * (1 - bound), head: kiss * 6 + bound * 8 - speak * 6 + alone * 12, blink: blinkAt(T) });
      fade(jSad, kiss * 0.8 + alone);
      const [chx, chy] = hand(JX, GY + 4, 1.04, true, 24 + bump(t, 0.05, 0.9) * 40 * (1 - bound));
      vis(cordEl, { x: chx, y: chy, s: bound * 1.1, sx: -1, o: bound > 0.01 ? 1 : 0 });

      /* the disciples: shock, Peter's sword, flight */
      const draw = es(t, 5.05, 5.12) * (1 - es(t, 5.9, 5.97));
      DIS.forEach((d) => {
        const run = es(t, 9.05 + d.i * 0.04, 9.5 + d.i * 0.04, ease.in);
        const x = d.x + run * (700 + d.i * 60);
        const fear = es(t, 4.05, 4.4);
        // phone: only the four nearest Him stand in the picture (the last two would stand under the thread); all flee at v50
        const off = S.portrait && d.i >= 4 ? 1 - es(t, 9.05, 9.1) : 0;
        d.p.set({ x, y: GY + (d.i % 2) * 6, s: 0.94, flip: run > 0.05 ? false : true, o: (d.k === 'peter' ? 1 - draw : 1) * (1 - off), walk: run > 0 && run < 1 ? x * 0.09 : undefined, amt: 1.6, armF: 20 + fear * 10 + run * 30, armB: fear * 110 * (1 - run) + run * 60, head: fear * -6 + run * -6, lean: run * 12, blink: blinkAt(T, d.seed) });
        fade(d.sad, fear * (1 - run));
      });
      const strike = es(t, 5.12, 5.3);
      peterSword.set({ x: 900 - strike * 10, y: GY, s: 0.94, flip: true, o: draw, armF: 40 + strike * 110 - es(t, 5.3, 5.5) * 40, armB: 20, lean: strike * 8, head: -4 });
      vis(flash, { x: 868, y: 540, s: 0.6 + strike * 0.6, r: -20, o: bump(t, 5.15, 5.45) });
      const fallE = es(t, 5.25, 5.7, ease.in);
      const [shx, shy] = headAt(870, GY + 6, 0.96, true);
      vis(earEl, { x: shx - 20 - fallE * 20, y: shy - 4 + fallE * 150, s: 0.26, r: fallE * 200, o: t > 5.24 && t < 5.9 ? 1 : 0 });

      /* v48–49 — the robber plate, the Temple, the Scriptures */
      const rIn = es(t, 6.2, 6.5, ease.out) * (1 - es(t, 6.9, 7.1, ease.in));
      vis(robber, { x: 640, y: 320 - (1 - rIn) * 700, r: Math.sin(T) * 2, o: rIn > 0.01 ? 1 : 0 });
      mob.forEach((m) => { if (m.k !== 'torch') pose(m.el.querySelector('.prop'), { x: 30, y: -96 - bump(t, 6.2, 6.95) * 20, r: m.k === 'sword' ? 10 - bump(t, 6.2, 6.95) * 20 : 10 }); });
      const tIn = es(t, 7.05, 7.4, ease.out) * (1 - es(t, 7.9, 8.1, ease.in));
      vis(templePlate, { x: JX, y: 320 - (1 - tIn) * 700, r: Math.sin(T * 0.8) * 1.5, o: tIn > 0.01 ? 1 : 0 });
      const sIn = es(t, 8.05, 8.4, ease.out) * (1 - es(t, 8.9, 9.1, ease.in));
      vis(scroll, { x: JX, y: 320 - (1 - sIn) * 700, r: Math.sin(T * 0.8) * 1.5, o: sIn > 0.01 ? 1 : 0 });

      // phone: the camera stands further left while the band arrives, so it (and the seal that sent it) is in the picture
      S.cam.x = kf(t, S.portrait ? [[-0.5, -100], [0.8, -20], [1.8, -250], [2.9, -110], [3.4, -30], [4.0, -30], [4.5, 0], [5.0, 40], [5.9, 40], [6.3, 0], [9.0, 0], [9.6, 40]]
        : [[-0.5, -60], [0.8, -40], [1.8, -80], [2.9, -60], [3.4, -30], [4.0, -30], [4.5, 0], [5.0, 40], [5.9, 40], [6.3, 0], [9.0, 0], [9.6, 40]]);
      // phone: a little wider while they seize Him and Peter strikes, so the six by Him are not under the thread
      S.cam.z = kf(t, S.portrait ? [[-0.5, 1.06], [0.8, 1.16], [1.8, 1.06], [2.9, 1.2], [3.4, 1.5], [4.0, 1.5], [4.5, 1.08], [5.0, 1.2], [5.9, 1.16], [6.3, 1.14], [9.0, 1.14], [9.6, 1.08]]
        : [[-0.5, 1.06], [0.8, 1.16], [1.8, 1.06], [2.9, 1.2], [3.4, 1.5], [4.0, 1.5], [4.5, 1.2], [5.0, 1.36], [5.9, 1.3], [6.3, 1.14], [9.0, 1.14], [9.6, 1.08]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.8, 90], [1.8, 50], [2.9, 120], [3.4, 200], [4.0, 200], [4.5, 110], [5.0, 150], [5.9, 140], [6.3, 60], [9.0, 60], [9.6, 40]]);
    };
  },
};
