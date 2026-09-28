// Mt 5,25–26 — a painted flat: a road to town in the afternoon. Two men walk along it, one waving the note of
// a debt at the other. Above them a warning plate lights up, step by step: the judge's seat — the officer with his
// key — the barred window of the prison. On the way, while there is still time, the debtor turns and holds out his
// hand, and they are reconciled; the warning dims. "You will not get out until you have paid the last penny":
// a plate of the prison comes down — behind the bars a man pays coin after coin into the gaoler's bowl, and only
// when the last little coin drops does the door swing open.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, grass, rock, sun, cloud, house } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { SKY, LOOK, judgeSeat, bigKey, prisonHouse, doorLeaf, picture, coin, lepton, bowl, soldier, bars, STRING, PI, tr } from './lib.js';

const G = 676;

export default {
  id: 'mt5-road',
  enter: 'fly',
  beats: [
    { v: 25 },
    { v: 26 },
  ],
  cam: { x: [-30, 30], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, SKY.gold);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 42, { rays: C.sunDeep }), { x: 1260, y: 170, len: 800 });
    const cl = hanging(hangL, cloud(c, 150), { x: 1080, y: 130, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.dune, 0.3), x0: -1400, x1: 3000 }).markup);
    const mid = S.layer({ par: 0.16, sh: 3 });
    const mh = hillsWith(c, { y: 530, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.dune, 0.2), trees: 16, treeColor: C.olive, treeH: 18, x0: -1400, x1: 3000 });
    mid.add(mh.markup + house(c, 1180, 548, 70, 50) + house(c, 1260, 540, 90, 60) + house(c, 1370, 548, 60, 44));
    const ground = S.layer({ par: 0.3, sh: 3 });
    ground.add(sheet().p(c.cut([[-1400, 610], [3000, 600], [3000, 1800], [-1400, 1800]], 1, 14), mix(C.sand, C.hillNear, 0.4)).p(c.ribbon([[-1400, 700], [400, 690], [1000, 670], [1400, 640], [2000, 610]], (u) => 70 - u * 40, 3), mix(C.sand, C.cream, 0.35)).out());
    ground.add(olive(c, 250, 640, 0.9) + cypress(c, 1330, 620, 120) + rock(c, 1080, 690, 60, 20) + grass(c, { x0: -600, x1: 2200, y: 610, n: 40, h: 12, color: C.olive }));

    /* the two men on the road */
    const P = S.layer({ par: 0.34, sh: 5 });
    const adv = S.puppet(P.add(person(c, { robe: C.plumRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin3, belt: C.sun })));
    const deb = S.puppet(P.add(person(c, LOOK.brotherA)));
    const note = P.add(`<g>${sheet().p(c.cut(c.rect(-14, -18, 28, 36), 0.4, 4), C.parchment).x(c.ribbon([[-8, -8], [8, -8]], 1.4) + c.ribbon([[-8, 0], [8, 0]], 1.4) + c.ribbon([[-8, 8], [4, 8]], 1.4), C.ink, 'opacity=".5"').out()}</g>`);

    /* the warning plate: judge → officer → prison */
    const fly = S.layer({ par: 0.3, sh: 6 });
    const WW = 420, WH = 130;
    const warn = fly.add(`<g><path d="M${-WW * 0.32} -2400V${-WH / 2}M${WW * 0.32} -2400V${-WH / 2}" stroke="${STRING}" stroke-width="1.3" fill="none"/>${sheet().p(c.cut(c.rect(-WW / 2 - 10, -WH / 2 - 10, WW + 20, WH + 20), 0.6, 10), C.wood2).p(c.cut(c.rect(-WW / 2, -WH / 2, WW, WH), 0.5, 10), C.parchment).out()}</g>`);
    const glows = [-140, 0, 140].map(() => fly.add(`<g><circle r="64" fill="url(#warm-glow)"/></g>`));
    const icons = [
      `<g transform="translate(0 42) scale(.44)">${judgeSeat(c)}</g>`,
      `<g transform="translate(-6 46) scale(.4)">${soldier(c, 0, { spear: 0 })}</g><g transform="translate(18 -8) scale(.7)">${bigKey(c, 40)}</g>`,
      `<g transform="translate(0 0)">${sheet().p(c.cut(c.rect(-40, -38, 80, 76), 0.5, 6), C.stone2).p(c.cut(c.rect(-22, -22, 44, 40), 0.3, 4), C.soilDark).out()}<g transform="translate(0 18) scale(.28)">${bars(c, 160, 150, 4)}</g></g>`,
    ].map((m, i) => fly.add(`<g>${m}</g>`));
    const arrows = [0, 1].map(() => fly.add(`<g>${sheet().p(c.cut([[-18, -4], [8, -4], [8, -10], [20, 0], [8, 10], [8, 4], [-18, 4]], 0.3, 4), C.terracotta).out()}</g>`));

    /* the prison plate (v26) */
    const PW = 440, PH = 230;
    const prisonIn = (() => {
      const s = sheet();
      s.p(c.poly(c.rect(-PW / 2 - 10, -PH / 2 - 10, PW + 20, PH + 20)), mix(C.dawn, C.skyBlue, 0.4));
      s.p(c.cut([[-PW / 2 - 10, 80], [PW / 2 + 10, 76], [PW / 2 + 10, PH / 2 + 10], [-PW / 2 - 10, PH / 2 + 10]], 0.5, 10), mix(C.sand, C.stone, 0.4));
      return s.out() + `<g transform="translate(40 86)">${prisonHouse(c, 260, 190)}</g>`;
    })();
    const prison = fly.add(`<g>${picture(c, S.id('prison'), PW, PH, prisonIn, { frame: C.wood2 })}</g>`);
    const door = fly.add(`<g>${doorLeaf(c, 52, 94)}</g>`);
    const face = fly.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 12, 16), 0.2, 3), C.skin2).p(c.cut([...c.arc(0, 0, 13, 13, PI, 2 * PI, 8), [9, -4], [-9, 2]], 0.3, 3), C.hair).out()}<path d="${c.poly(c.circ(4, -1, 1.4, 6))}" fill="${C.inkSoft}"/></g>`);
    const winBars = fly.add(`<g>${(() => { let d = ''; for (let i = 0; i < 4; i++) d += c.cut(c.rect(-30 + i * 19, -26, 4, 52), 0.1, 4); return `<path d="${d}" fill="#4c4452"/>`; })()}</g>`);
    const gaoler = S.puppet(fly.add(person(c, { robe: mix(C.terracotta, C.clay, 0.5), hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather })));
    const freed = S.puppet(fly.add(person(c, { ...LOOK.poor, robe: C.stone2 })));
    const gBowl = fly.add(`<g>${bowl(c, { w: 34, food: null, color: C.pot })}</g>`);
    const coins = Array.from({ length: 5 }, (_, i) => fly.add(`<g>${i < 4 ? coin(c, 7) : lepton(c, 4.4)}</g>`));
    const lastGlint = fly.add(`<g><circle r="20" fill="url(#halo-glow)"/></g>`);
    const counter = fly.add(`<g>${(() => { const s = sheet().p(c.cut(c.rect(-34, -14, 68, 28), 0.3, 4), C.cream).out(); return s; })()}${[0, 1, 2, 3, 4, 5].map((n) => `<text class="n${n}" x="0" y="7" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="19" font-style="italic" fill="${C.terracotta}" opacity="${n === 5 ? 1 : 0}">${n}</text>`).join('')}</g>`);
    const nEls = [0, 1, 2, 3, 4, 5].map((n) => counter.querySelector('.n' + n));

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1260, y: 170, r: Math.sin(T * 0.6) });
      pose(cl, { x: 1080 + Math.sin(T * 0.1) * 20, y: 130, r: Math.sin(T * 0.6 + 1) });

      /* v25 — on the road; the warning lights up; they are reconciled */
      const walk = es(t, -0.1, 0.46, (x) => x);
      const ax = lerp(420, 700, walk), dx = lerp(560, 840, walk);
      const turn = es(t, 0.46, 0.54), shake = es(t, 0.52, 0.66);
      const argue = (1 - shake) * (0.5 + 0.5 * Math.sin(T * 4));
      adv.set({ x: ax + shake * 8, y: G + 6, s: 1.0, walk: walk > 0 && walk < 1 ? ax * 0.05 : undefined, armF: 40 + argue * 40 * (1 - shake) + shake * 40, armB: 20 + (1 - shake) * 90, head: -2, blink: blinkAt(T, 1) });
      deb.set({ x: dx - shake * 10, y: G + 10, s: 1.0, flip: turn > 0.5, walk: walk > 0 && walk < 1 ? dx * 0.05 : undefined, armF: 20 + shake * 60, head: 6 * (1 - turn), blink: blinkAt(T, 2) });
      pose(note, { x: ax + 34, y: G - 178 - argue * 6 + shake * 30, r: -10 + argue * 10, o: 1 - es(t, 0.66, 0.76) });
      const wk = es(t, 0.05, 0.3, ease.out) * (1 - es(t, 1.0, 1.25));
      const wy = lerp(-400, 190, wk) - es(t, 1.0, 1.25) * 200;
      const dim = 1 - es(t, 0.6, 0.72) * 0.55;
      pose(warn, { x: 800, y: wy, o: wk > 0.01 ? 1 : 0 });
      icons.forEach((ic, i) => {
        const lit = es(t, 0.22 + i * 0.1, 0.32 + i * 0.1);
        pose(glows[i], { x: 800 + (i - 1) * 140, y: wy, s: 0.6 + lit * 0.4, o: lit * dim * (wk > 0.01 ? 1 : 0) });
        pose(ic, { x: 800 + (i - 1) * 140, y: wy, s: 0.9 + lit * 0.1, o: (wk > 0.01 ? 1 : 0) * (0.45 + lit * 0.55 * dim) });
      });
      arrows.forEach((a, i) => pose(a, { x: 800 - 70 + i * 140, y: wy, o: (wk > 0.01 ? 1 : 0) * es(t, 0.3 + i * 0.1, 0.36 + i * 0.1) * dim }));

      /* v26 — the prison: coin after coin, until the last one; then the door opens */
      const pk = es(t, 1.06, 1.34, ease.out);
      const PS = 1.1;
      const px = 800, py = lerp(-500, 300, pk) + Math.sin(T * 0.7) * 2;
      const on = pk > 0.01 ? 1 : 0;
      const L = (lx, ly) => [px + lx * PS, py + ly * PS];
      pose(prison, { x: px, y: py, s: PS, o: on });
      const open = es(t, 1.62, 1.74);
      const [dX, dY] = L(40 - 260 * 0.36 + 4, 86);
      pose(door, { x: dX, y: dY, s: PS, sx: Math.max(0.1, 1 - open * 0.9), o: on });
      const [wX, wY] = L(40 + 260 * 0.26, 86 - 190 * 0.59);
      pose(face, { x: wX + 6, y: wY + 6 - open * 30, s: PS, o: on * (1 - open) });
      pose(winBars, { x: wX, y: wY, s: PS, o: on });
      const out = es(t, 1.66, 1.9, (x) => x);
      const [fX, fY] = L(lerp(-60, -100, out), 90);
      freed.set({ x: fX, y: fY, s: 0.44 * PS, flip: true, walk: out > 0 && out < 1 ? out * 20 : undefined, head: -6, armF: 20, o: on * es(t, 1.64, 1.7), blink: blinkAt(T, 6) });
      const [gx, gy] = L(-150, 94);
      gaoler.set({ x: gx, y: gy, s: 0.5 * PS, armF: 70, head: 4, o: on, blink: blinkAt(T, 3) });
      const [bwx, bwy] = L(-150 + 30, 94 - 64);
      pose(gBowl, { x: bwx, y: bwy, s: PS, o: on });
      let left = 5;
      coins.forEach((cn, i) => {
        const k = es(t, 1.34 + i * 0.05, 1.42 + i * 0.05, (x) => x);
        if (k >= 1) left -= 1;
        const [x0, y0] = L(40 + 260 * 0.26 - 20, 86 - 190 * 0.45);
        const [x1, y1] = L(-120, 94 - 72);
        pose(cn, { x: lerp(x0, x1, k), y: lerp(y0, y1, k) - Math.sin(k * PI) * 40, s: PS * (i === 4 ? 1.2 : 1), o: on * (k > 0.001 && k < 0.999 ? 1 : 0) });
      });
      const [lgx, lgy] = L(-120, 94 - 72);
      pose(lastGlint, { x: lgx, y: lgy, s: 0.5 + bump(t, 1.55, 1.75), o: on * bump(t, 1.55, 1.8) });
      nEls.forEach((e, n) => fade(e, n === left ? 1 : 0));
      const [cx_, cy_] = L(150, -80);
      pose(counter, { x: cx_, y: cy_, s: PS, o: on * es(t, 1.3, 1.36) });

      S.cam.y = -10;
      S.cam.z = 1.02;
    };
  },
};
