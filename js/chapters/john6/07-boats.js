// J 6,22–25 — the next morning on the far shore: the crowd looks at the empty beach. A sepia memory card:
// there was only one boat, and the disciples sailed off in it alone — Jesus did not go with them. Boats come
// in from Tiberias near the place where they ate the bread. No Jesus, no disciples: the people climb into the
// boats and sail for Capernaum — and there, on the other shore, they find Him. "Rabbi, when did you get here?"
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, waterBand, hillsWith, town, olive, grass, rock } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { capShore, MORNING, TW, LOOK, folk, smallSail, hull, basket, labelTag, say, speech, GLYPH, headAt, kf, moving, tr, PI } from './lib.js';
import { moon } from '../../assets/nature.js';

const JX = 800;
const SEP = (a) => mix(a, '#c9ae86', 0.55);

export default {
  id: 'j6-boats',
  beats: [
    { v: 22, text: 'Nazajutrz lud, stojąc po drugiej stronie jeziora, spostrzegł, że poza jedną łodzią nie było tam żadnej innej' },
    { v: 22, cont: true, text: 'oraz że Jezus nie wsiadł do łodzi razem ze swymi uczniami, lecz że Jego uczniowie odpłynęli sami.' },
    { v: 23 },
    { v: 24, text: 'A kiedy ludzie z tłumu zauważyli, że nie ma tam Jezusa, a także Jego uczniów,' },
    { v: 24, cont: true, text: 'wsiedli do łodzi, przybyli do Kafarnaum i tam szukali Jezusa.' },
    { v: 25, text: 'Gdy zaś odnaleźli Go na przeciwległym brzegu,' },
    { v: 25, cont: true, text: 'rzekli do Niego: «Rabbi, kiedy tu przybyłeś?»' },
  ],
  cam: { x: [-40, 40], y: [-20, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    /* underneath: the Capernaum shore (revealed at v25) */
    const K = capShore(S, { skyCols: MORNING, sunAt: [420, 190], beachY: 650 });
    const capLayers = [K.hangL, K.far, K.lakeL, K.townL, K.beachL];

    /* on top: the far shore where they ate — green hill, trampled grass, an empty beach */
    const top = [];
    const sk = sky(S, MORNING, { name: 'far' }); top.push(sk.layer);
    const far = S.layer({ par: 0.08, sh: 2 }); top.push(far);
    const fb = band(c, { y: 400, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.1) });
    far.add(fb.markup + town(c, { x: 330, y: fb.fn(330) + 14, n: 7, spread: 220, sc: 0.44 }));
    const tib = far.add(`<g>${labelTag(tr('Tyberiada', 'Tiberias'), 15)}</g>`);
    const lake = S.layer({ par: 0.12, sh: 1 }); top.push(lake);
    lake.add(waterBand(c, { y: 426, color: mix(C.lake, C.skyBlue, 0.3), foamN: 20, bottom: 1200 }).markup);
    const hillL = S.layer({ par: 0.3, sh: 3 }); top.push(hillL);
    const hfn = (x) => 640 - Math.max(0, 1 - Math.abs(x - 1180) / 520) ** 1.4 * 190;
    hillL.add(sheet().p(c.ridge(hfn, 600, 2500, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.3)).out() + olive(c, 1400, hfn(1400) + 20, 0.7));
    hillL.add(rock(c, 1180, hfn(1180) + 22, 120, 30, C.rock2) + grass(c, { x0: 700, x1: 2400, y: 600, fn: hfn, n: 40, h: 16, color: C.leaf }));
    const empty = hillL.add(`<g><circle r="70" fill="url(#halo-glow)" opacity=".7"/><path d="${c.ribbon(c.arc(0, -40, 26, 44, 0, PI * 2, 24), 2)}" fill="${C.sun}" opacity=".7"/></g>`);
    const beachL = S.layer({ par: 0.4, sh: 3 }); top.push(beachL);
    const bfn = (x) => 650 + Math.sin(x * 0.006) * 5;
    const b = sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.stone, 0.3));
    b.x(c.ribbon([[380, 690], [560, 700], [760, 702]], 6), shade(C.sand, -0.12), 'opacity=".7"');   // the keel mark of the one boat
    let fp = '';
    for (let i = 0; i < 10; i++) fp += c.cut(c.ell(420 + i * 30, 716 + (i % 2) * 10, 6, 3, 8, 0.2), 0.1, 2);
    b.x(fp, shade(C.sand, -0.18), 'opacity=".7"');
    beachL.add(b.out() + `<path d="${c.ribbon(Array.from({ length: 40 }, (_, i) => [-900 + i * 90, bfn(-900 + i * 90) + 2]), 4)}" fill="${C.foam}" opacity=".8"/>`);

    /* the boats from Tiberias */
    const boatL = S.layer({ par: 0.36, sh: 4 });
    const BOATS = [0, 1, 2].map((i) => ({ i, el: boatL.add(`<g>${smallSail(c, { w: 150, col: [C.wood, C.wood2, C.wood3][i] })}</g>`), people: boatL.add(`<g>${[0, 1, 2].map((k) => `<g transform="translate(${(k - 1) * 28} -30) scale(.42)">${person(c, folk(c))}</g>`).join('')}</g>`) }));

    /* the people (the same ones on both shores), Jesus at Capernaum */
    const L = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const PEO = [[380, true], [470, false], [560, true], [650, false], [980, true], [1070, false], [1160, true], [1250, false]].map(([x, man], i) => ({ i, x, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, folk(c, man)))) }));

    /* the memory card, question marks, the question */
    const fx = S.layer({ par: 0.56, sh: 5 });
    const card = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-167, -7, 334, 214), 0.6, 8), C.wood3);
      s.p(c.cut(c.rect(-160, 0, 320, 200), 0.6, 8), '#efe2c6');
      s.p(c.cut([[-160, 120], [160, 116], [160, 200], [-160, 200]], 0.5, 8), SEP(C.lake));
      s.p(c.cut([[-160, 120], [-60, 60], [-20, 50], [30, 70], [60, 120]], 0.6, 6), SEP(C.hillMid));
      return `<g class="hang"><path d="M-110 -1600V0M110 -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}</g>`;
    })();
    const cardEl = fx.add(`<g>${card}</g>`);
    const H = hull(c, { w: 220, col: SEP(C.wood), stripe: SEP(C.terracotta) });
    const memBoat = fx.add(`<g><g>${H.back}</g>${[-50, -10, 30, 70].map((x, k) => `<g transform="translate(${x} -30) scale(.8)">${person(c, { ...[TW.peter, TW.andrew, TW.john, TW.james][k], robe: SEP([TW.peter, TW.andrew, TW.john, TW.james][k].robe) })}</g>`).join('')}<g>${H.front}</g></g>`);
    const memJesus = fx.add(`<g>${person(c, { ...CAST.jesus, pose: 'kneel', robe: SEP(C.linen), mantle: SEP(C.jesusMantle) })}</g>`);
    const oneTag = fx.add(`<g>${labelTag(tr('jedna łódź', 'one boat'), 17)}</g>`);
    const qs = PEO.map(() => fx.add(`<g>${labelTag('?', 18)}</g>`));
    const askB = fx.add(`<g>${speech(c, `<g transform="translate(-16 4)">${moon(c, 11)}</g><g transform="translate(14 8) scale(.28)">${smallSail(c, { w: 110 })}</g><g transform="translate(30 -4) scale(.6)">${GLYPH.q(c)}</g>`, { w: 96, h: 56 })}</g>`);
    const rabbi = fx.add(`<g>${labelTag('Rabbi', 18)}</g>`);

    return (t, time) => {
      const T = time;
      K.update(T);
      /* the far shore fades away when they reach Capernaum */
      const cross = es(t, 4.85, 5.15);
      top.forEach((Ly) => Ly.fade(1 - cross));
      capLayers.forEach((Ly) => Ly.fade(seg(t, 4.8, 4.85)));
      pose(tib, { x: 330, y: 360, o: 1 - cross });

      /* v22a — only one boat was there (a memory card) */
      const ck = es(t, 0.1, 0.4, ease.out) * (1 - es(t, 1.9, 2.1));
      const CX = 800, CY = lerp(-500, 150, ck);
      pose(cardEl, { x: CX, y: CY, r: Math.sin(T * 0.8) * 0.8, o: ck > 0.01 ? 1 : 0 });
      const leave = es(t, 1.1, 1.8);
      pose(memBoat, { x: CX - 40 + leave * 150, y: CY + 150 + Math.sin(T * 1.2) * 1.5, s: 0.5 - leave * 0.14, o: ck > 0.01 ? 1 - es(t, 1.7, 1.85) : 0 });
      const mj = es(t, 1.2, 1.4);
      pose(memJesus, { x: CX - 40, y: CY + 60, s: 0.26, o: ck > 0.01 ? mj : 0 });
      const ok = es(t, 0.35, 0.55, ease.back) * (1 - es(t, 1.0, 1.1));
      pose(oneTag, { x: CX, y: CY + 226, s: ok, o: ok > 0.01 ? 1 : 0 });

      /* v23 — boats come from Tiberias */
      BOATS.forEach((bt) => {
        const come = es(t, 2.05 + bt.i * 0.12, 2.8 + bt.i * 0.1, ease.out);
        const go = es(t, 4.2 + bt.i * 0.05, 5.0, ease.in);
        const land = es(t, 5.0 + bt.i * 0.06, 5.5 + bt.i * 0.05, ease.out);
        let x = lerp(-300 - bt.i * 160, 420 + bt.i * 200, come) + go * 1000;
        let y = 520 + bt.i * 30, s = 0.8;
        if (t > 5.0) { x = lerp(1900 + bt.i * 200, 1000 + bt.i * 130, land); y = 560 + bt.i * 22; s = 0.62; }
        pose(bt.el, { x, y: y + Math.sin(T * 1.2 + bt.i) * 2, s, r: Math.sin(T * 0.9 + bt.i) * 1.5 });
        pose(bt.people, { x, y, s, o: seg(t, 4.2, 4.3) * (1 - seg(t, 5.5, 5.6)) });
      });

      /* v24a — no Jesus there, nor His disciples */
      const look = es(t, 3.05, 3.3) * (1 - es(t, 4.0, 4.2));
      pose(empty, { x: 1180, y: hfn(1180) + 6, o: look * (0.6 + Math.sin(T * 2) * 0.2) });

      /* the people: on the beach, into the boats; at Capernaum they gather round Him */
      const board = es(t, 4.05, 4.3);
      const cap = es(t, 5.3, 5.7);
      PEO.forEach((m) => {
        const left = m.x < JX;
        const turn = look > 0.3 ? (m.i % 2 ? 1 : 0) : 0;
        let x = m.x + board * (bt0(m) - m.x);
        let y = 700 + (m.i % 2) * 10;
        let o = 1 - seg(t, 4.25, 4.32);
        let flip = t < 0.2 ? !left : (turn ? left : !left);
        if (t > 5.2) {
          const tx = left ? JX - 150 - (3 - m.i) * 80 : JX + 140 + (m.i - 4) * 80;
          x = lerp(1250 + m.i * 40, tx, cap); y = 712 + (m.i % 2) * 10; o = seg(t, 5.3, 5.35); flip = tx > JX;
        }
        const walking = (board > 0.02 && board < 0.98) || (cap > 0.02 && cap < 0.98);
        const peer = bump(t, 0.2, 1.9) + look;
        const ask = bump(t, 6.05, 6.95);
        m.p.set({ x, y, s: 0.94, flip, walk: walking ? x * 0.06 + m.i : undefined, armF: 20 + peer * 40 * (m.i % 3 === 0 ? 1 : 0.3) + ask * 50 * (m.i === 3 ? 1 : 0.4), armB: 10 + (m.i % 3 === 1 ? peer * 120 : 0), head: -peer * 6 * (m.i % 2 ? 1 : -1), o, blink: blinkAt(T, m.seed) });
        const qk = es(t, 3.1 + m.i * 0.04, 3.3 + m.i * 0.04, ease.back) * (1 - es(t, 3.95, 4.05));
        const [hx, hy] = headAt(x, y, 0.94, flip);
        pose(qs[m.i], { x: hx, y: hy - 44, s: qk, r: Math.sin(T * 2 + m.i) * 8, o: qk > 0.01 ? 1 : 0 });
      });

      /* v25a — they find Him on the other shore */
      jesus.set({ x: JX, y: 718, s: 1.06, flip: false, o: seg(t, 4.9, 5.0), armF: 20 + es(t, 5.4, 5.8) * 40 + bump(t, 6.2, 6.95) * 20, armB: 10 + es(t, 5.4, 5.8) * 30, head: bump(t, 6.2, 6.95) * 4, blink: blinkAt(T, 1) });
      /* v25b — "Rabbi, when did you come here?" */
      const m3 = PEO[3];
      const ak = es(t, 6.1, 6.3, ease.back);
      const [ax, ay] = headAt(JX - 150, 718, 0.94, false);
      pose(askB, { x: ax + 16, y: ay - 20, s: ak, o: ak > 0.01 ? 1 : 0 });
      const rk = es(t, 6.2, 6.4, ease.back);
      pose(rabbi, { x: ax - 50, y: ay - 90, s: rk, r: -6, o: rk > 0.01 ? 1 : 0 });

      S.cam.z = kf(t, [[0, 1.02], [0.5, 1.02], [2.0, 1.0], [3.0, 1.04], [4.6, 1.0], [5.3, 1.08], [6.3, 1.12]]);
      S.cam.y = kf(t, [[0, 10], [0.5, -10], [1.9, -10], [2.3, 20], [4.6, 20], [5.3, 40], [6.3, 50]]);
      S.cam.x = kf(t, [[0, 0], [3.0, 30], [3.6, 30], [4.2, 0]]);
    };
    function bt0(m) { return 420 + (m.i % 3) * 200; }
  },
};
