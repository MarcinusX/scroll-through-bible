// Mk 8,36–38 — the whole world on one pan of a great balance, a small glowing soul on the other:
// the world is gained and the soul floats away; nothing piled on the pan can buy it back.
// Then a man ashamed of His words before a grey, faithless crowd — and the Son of Man coming
// in the glory of His Father with the holy angels, let down on their strings.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, rock, cloud, grass, house } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { headAt, balance, globe, soulLight, coin, coinStack, crown, angel, glory, speech, GLYPH, man, PI } from './lib.js';
import { scrollRolled } from '../mark2/lib.js';

const GY = 690, JX = 800;
const PX = 800, PY = 235, ARM = 190;   // the balance pivot

export default {
  id: 'm8-glory',
  beats: [
    { v: 36 },
    { v: 37 },
    { v: 38, text: 'Kto się bowiem Mnie i słów moich zawstydzi przed tym pokoleniem wiarołomnym i grzesznym,' },
    { v: 38, cont: true, text: 'tego Syn Człowieczy wstydzić się będzie, gdy przyjdzie w chwale Ojca swojego razem z aniołami świętymi».' },
  ],
  cam: { x: [-20, 20], y: [-120, 60], z: [0.92, 1.14] },
  build(S) {
    const c = S.c;
    const DAY = ['#cfe0dc', '#efe6cd', '#f6e8cf'];
    const sk = sky(S, DAY);
    const greyL = sky(S, ['#8d8f98', '#b3b0aa', '#cfc7b8'], { name: 'grey' }).layer;
    const goldL = sky(S, ['#f3cf7e', '#fbe7b0', '#fdf3d6'], { name: 'gold' }).layer;

    /* ---------- land ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [16, 7, 3], lens: [1100, 380, 140], color: C.hillFar }).markup);
    const hills = S.layer({ par: 0.18, sh: 2 });
    const h2 = hillsWith(c, { y: 520, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 });
    hills.add(h2.markup + house(c, 1250, h2.fn(1250) + 8, 40, 28) + house(c, 1300, h2.fn(1300) + 6, 30, 22));
    const groundL = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(GY - 60, [4, 2], [600, 160]);
    groundL.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand).out() + grass(c, { x0: -600, x1: 2200, y: GY - 60, fn: gfn, n: 30, h: 12, color: C.olive }) + olive(c, 300, GY - 56, 1) + cypress(c, 1330, GY - 54, 170));

    /* ---------- the glory ---------- */
    const glL = S.layer({ par: 0.3, sh: 1, flat: true });
    const gl = glL.add(`<g>${glory(c, 700, 28)}</g>`);

    /* ---------- the balance, hanging from the flies ---------- */
    const balL = S.layer({ par: 0.1, sh: 7 });
    const B = balance(c, { arm: ARM, drop: 100 });
    const beam = hanging(balL, B.beam, { x: PX, y: PY, len: 900 });
    const beamObj = beam.querySelector('.obj');
    const panL = balL.add(`<g>${B.pan}</g>`), panR = balL.add(`<g>${B.pan}</g>`);
    const world = balL.add(`<g>${globe(c, 46)}</g>`);
    const soul = balL.add(`<g>${soulLight(c, 20)}</g>`);
    const riches = [
      balL.add(`<g>${coinStack(c, 6, 11)}</g>`), balL.add(`<g>${crown(c, 42)}</g>`), balL.add(`<g>${coinStack(c, 4, 10)}</g>`),
      balL.add(`<g transform="scale(.6)">${house(c, -30, 0, 60, 44, { stairs: false })}</g>`),
    ];

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const scoffers = [0, 1, 2, 3, 4].map((i) => ({ i, p: S.puppet(P.add(person(c, { ...crowdPerson(c), robe: [C.stone2, C.storm, C.plumRobe, C.rock2, C.wood3][i], mantle: null }))), x: 1010 + i * 52, y: GY - 16 + (i % 2) * 12, seed: c.rr(0, 9) }));
    const holder = { ...man(c), robe: C.tealRobe, mantle: C.ochreRobe, belt: C.leather };
    const manA = S.puppet(P.add(person(c, { ...holder, holdB: `<g transform="rotate(80)">${scrollRolled(c, 40)}</g>` })));
    const jCloud = P.add(`<g>${cloud(c, 260, C.cream, C.halo)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const jeers = [0, 1, 2].map((i) => fx.add(`<g>${speech(c, i === 1 ? GLYPH.q(c) : GLYPH.bang(c), { w: 38, h: 38, flip: true })}</g>`));

    /* ---------- the holy angels ---------- */
    const angL = S.layer({ par: 0.2, sh: 6 });
    const angels = [[430, 250, false], [590, 170, false], [1010, 170, true], [1170, 250, true]].map(([x, y, flip], i) => {
      const el = hanging(angL, `<g data-k="ang${i}">${angel(c)}</g>`, { x, y, len: 1100 });
      return { i, x, y, flip, el, p: S.puppet(S.$('ang' + i).firstElementChild), wings: S.$('ang' + i).querySelector('.wings') };
    });

    return (t, time) => {
      const T = time;
      const grey = es(t, 2.05, 2.4) * (1 - es(t, 3.05, 3.3));
      const gold = es(t, 3.05, 3.4);
      greyL.fade(grey);
      goldL.fade(gold);

      /* the balance: v36 — the world gained, the soul lost; v37 — nothing can buy it back */
      const on = es(t, -0.3, 0.15, ease.back) * (1 - es(t, 2.0, 2.35));
      const by = PY - (1 - on) * 700;
      const worldIn = es(t, 0.1, 0.4);
      const soulOff = es(t, 0.5, 0.95) * (1 - es(t, 1.05, 1.25));
      const richesIn = es(t, 1.2, 1.6);
      const outweigh = es(t, 1.55, 1.9);
      const tilt = -worldIn * 12 * (1 - outweigh) + outweigh * 14 + Math.sin(T * 1.2) * 0.8;
      pose(beam, { x: PX, y: by });
      pose(beamObj, { r: tilt });
      const a = (tilt * PI) / 180;
      const lx = PX - Math.cos(a) * ARM, ly = by - Math.sin(a) * ARM, rx = PX + Math.cos(a) * ARM, ry = by + Math.sin(a) * ARM;
      pose(panL, { x: lx, y: ly, r: Math.sin(T * 1.4) * 1.5 });
      pose(panR, { x: rx, y: ry, r: Math.sin(T * 1.4 + 1) * 1.5 });
      const panTop = 100 - 2;
      pose(world, { x: lerp(460, lx, worldIn), y: lerp(560, ly + panTop - 44, worldIn) - Math.sin(worldIn * PI) * 80, r: T * 6, s: 1, o: on > 0.02 ? 1 : 0 });
      pose(soul, { x: rx + soulOff * 60, y: ry + panTop - 26 - soulOff * 260, s: 1 - soulOff * 0.5 + outweigh * 0.25 + Math.sin(T * 4) * 0.04, o: (on > 0.02 ? 1 : 0) * (1 - soulOff * 0.9) });
      riches.forEach((r, i) => {
        const k = es(t, 1.2 + i * 0.09, 1.45 + i * 0.09);
        pose(r, { x: lerp(430 - i * 30, lx - 40 + i * 26, k), y: lerp(620, ly + panTop - 6 - (i === 3 ? 10 : 0), k) - Math.sin(k * PI) * 90, s: i === 3 ? 0.6 : 1, o: k > 0.01 && on > 0.02 ? 1 : 0 });
      });

      /* the man who wants the world; later ashamed of the words */
      const reach = bump(t, 0.05, 0.9);
      const pile = bump(t, 1.1, 1.8);
      const ashamed = es(t, 2.1, 2.4);
      manA.set({ x: 540, y: GY + 10, s: 0.92, flip: ashamed > 0.5, armF: 20 + reach * 120 + pile * 90 + ashamed * 150, armB: 10 + reach * 100 + pile * 60 - ashamed * 50, head: -reach * 20 - pile * 10 + ashamed * 30, lean: ashamed * 12, blink: blinkAt(T, 3) });

      /* the faithless generation jeers */
      scoffers.forEach((s) => {
        const come = es(t, 2.0 + s.i * 0.05, 2.3 + s.i * 0.05) * (1 - es(t, 3.1, 3.4));
        s.p.set({ x: s.x + (1 - come) * 400, y: s.y, s: 0.84, flip: true, o: come, armF: come * (60 + Math.sin(T * 4 + s.i) * 20), armB: come * 20, head: -6 + gold * 20, blink: blinkAt(T, s.seed) });
      });
      jeers.forEach((j, i) => {
        const k = es(t, 2.25 + i * 0.08, 2.4 + i * 0.08, ease.back) * (1 - es(t, 2.95, 3.05));
        pose(j, { x: 1040 + i * 60, y: GY - 210, s: k, o: k > 0.02 ? 1 : 0, r: Math.sin(T * 3 + i) * 5 });
      });

      /* Jesus: teaching; then coming in glory, raised on a cloud */
      const rise = es(t, 3.1, 3.6);
      const jy = GY - rise * 150;
      jesus.set({ x: JX, y: jy, s: 0.98 + rise * 0.1, flip: false, armF: 20 + bump(t, 0.05, 0.9) * 50 + bump(t, 1.1, 1.9) * 50 + bump(t, 2.05, 2.95) * 40 + rise * 60, armB: 10 + rise * 140, head: -rise * 6, blink: blinkAt(T) });
      pose(jCloud, { x: JX, y: jy + 14, s: 0.9, o: rise });
      const [hx, hy] = headAt(JX, jy, 0.98 + rise * 0.1, false);
      pose(gl, { x: hx, y: hy + 40, s: 0.6 + rise * 0.6, r: T * 2, o: gold });

      angels.forEach((an) => {
        const d = es(t, 3.15 + an.i * 0.08, 3.6 + an.i * 0.08, ease.back);
        swing(an.el, an.x, an.y - (1 - d) * 700, T, 1.4, 0.7, an.i);
        an.p.set({ x: 0, y: 150, s: 0.72, flip: an.flip, armF: 60 + Math.sin(T * 1.5 + an.i) * 10, armB: 140, head: -8, blink: blinkAt(T, an.i) });
        pose(an.wings, { x: 0, y: -128, sy: 1 + Math.sin(T * 3 + an.i) * 0.08, oy: -128 });
      });

      S.cam.z = 1.02 - es(t, 0, 0.3) * 0.08 + es(t, 1.95, 2.3) * 0.12 - es(t, 3.0, 3.5) * 0.12;
      S.cam.y = -50 + es(t, 1.95, 2.3) * 90 - es(t, 3.0, 3.5) * 100;
    };
  },
};
