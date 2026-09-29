// Łk 11,24–26 — a saying told on two painted flats. First the waterless places: cracked ground, a dry cistern, a dead
// thorn tree. A man stands up free as a little dark spirit curls out of him (the shadow that clung to him drops away)
// and drifts off over the dry land: it tries the rim of the empty cistern, then the dead tree — no rest. "I will
// return to my house from which I came": a thought of the little house, and off it goes. The second flat is that
// house, cut open: swept clean — the broom still leaning by the door, fresh sweep-marks on the floor — and put in
// order, a garland over the shelf, flowers in a jar; the spirit peers in at the window. It goes and brings seven others
// worse than itself; they pour in by door and window and settle everywhere, and the room goes dark. "The last state
// of that man is worse than the first": the man himself stands in the doorway — the shadow on him again, bigger and
// darker than before, the garland fallen, cracks running down the walls.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, rock } from '../../assets/nature.js';
import { thornBush } from '../../assets/things.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { houseSection, spirit, shadowCloak, broom, garland, thought, glow, sparkle, headP, kf, PI, EVENING } from './lib.js';

const Y = 690;
const H = { x0: 560, x1: 1040, floor: 640, ceil: 330 };
const MAN = { robe: C.tealRobe, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather };

/** a dry cistern: a stone ring with its dark empty mouth (origin: centre of the rim, front) */
function cistern(c) {
  const s = sheet();
  s.p(c.cut(c.ell(0, -8, 70, 18, 22), 0.5, 5), mix(C.rock2, C.sand2, 0.3));
  s.p(c.cut(c.ell(0, -10, 52, 11, 20), 0.4, 5), mix(C.soilDark, C.soil, 0.3));
  s.p(c.cut([[-70, -8], [70, -8], [66, 20], [-66, 20]], 0.5, 6), mix(C.rock2, C.sand2, 0.45));
  s.x(c.ribbon([[-40, 4], [-20, 10], [-26, 18]], 1.4) + c.ribbon([[30, 2], [42, 14]], 1.4), shade(C.rock2, -0.3), 'opacity=".6"');
  return s.out();
}

export default {
  id: 'lk11-unclean',
  enter: 'fly',
  beats: [
    { v: 24, text: 'Gdy duch nieczysty opuści człowieka, błąka się po miejscach bezwodnych, szukając spoczynku.' },
    { v: 24, cont: true, text: 'A gdy go nie znajduje, mówi: "Wrócę do swego domu, skąd wyszedłem".' },
    { v: 25 },
    { v: 26, text: 'Wtedy idzie i bierze siedem innych duchów złośliwszych niż on sam; wchodzą i mieszkają tam.' },
    { v: 26, cont: true, text: 'I stan późniejszy owego człowieka staje się gorszy niż poprzedni».' },
  ],
  cam: { x: [-40, 40], y: [-30, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, ['#e2cfa6', '#f0dcb2', '#f6e4c0']);
    const dusk = sky(S, EVENING, { name: 'dusk', rise: 0 });
    dusk.layer.fade(0);
    /* flat 1: the waterless places */
    const d1 = S.layer({ par: 0.12, sh: 2 });
    d1.add(band(c, { y: 470, amps: [24, 10, 3], lens: [900, 330, 120], color: mix(C.dune, C.parchment, 0.3) }).markup);
    const d2 = S.layer({ par: 0.3, sh: 3 });
    const ds = sheet().p(c.ridge(c.wave(610, [6, 3], [700, 180]), -900, 2500, 1700, 12, 1), mix(C.sand2, C.dune, 0.4));
    let cracks = '';
    for (let i = 0; i < 26; i++) { const x = c.rr(-300, 1900), y = c.rr(650, 900); cracks += c.ribbon([[x, y], [x + c.rr(-30, 30), y + c.rr(6, 16)], [x + c.rr(-40, 40), y + c.rr(14, 28)]], 1.6); }
    ds.x(cracks, shade(C.dune, -0.3), 'opacity=".55"');
    d2.add(ds.out() + `<g transform="translate(800 660)">${cistern(c)}</g>` + thornBush(c, 1030, 650, 150, C.thorn2) + rock(c, 1330, 650, 90, 30, C.rock3) + rock(c, 360, 690, 80, 26, C.rock2));
    const d3 = S.layer({ par: 0.34, sh: 5 });
    const cloak0 = d3.add(`<g>${shadowCloak(c, 150, 250)}</g>`);
    const man = S.puppet(d3.add(person(c, MAN)));
    const freeGlow = d3.add(`<g opacity="0">${glow(120, 0.9)}</g>`);
    const desertL = [d1, d2, d3];

    /* flat 2: the house, cut open */
    const hs = houseSection(c, H);
    const hBack = S.layer({ par: 0.3, sh: 3 });
    hBack.add(`<g>${sheet().p(c.ridge(c.wave(H.floor + 20, [4, 2], [700, 180]), -900, 2500, 1700, 12, 1), mix(C.sand, C.hillNear, 0.3)).out()}</g>`);
    hBack.add(hs.back);
    const sweep = hBack.add(`<g opacity="0">${[0, 1, 2, 3, 4].map((i) => `<path d="${c.ribbon(c.arc(660 + i * 70, H.floor + 16, 30, 6, PI * 0.1, PI * 0.9, 8), 1.6)}" fill="${shade(C.sand2, -0.2)}"/>`).join('')}</g>`);
    const gar = hBack.add(`<g>${garland(c, 300, 50)}</g>`);
    const br = hBack.add(`<g>${broom(c)}</g>`);
    const vase = hBack.add(`<g>${sheet().p(c.cut([[-10, 0], [-14, -24], [-8, -34], [8, -34], [14, -24], [10, 0]], 0.3, 4), C.pot).out()}${[[-8, -58, C.jesusMantle], [4, -64, C.cream], [12, -54, C.lavender]].map(([x, y, col]) => `<path d="${c.ribbon([[0, -34], [x, y]], 1.6)}" fill="${C.moss}"/><path d="${c.cut(c.star(x, y, 6, 3, 5, 0), 0.2, 3)}" fill="${col}"/>`).join('')}</g>`);
    const shine = hBack.add(`<g opacity="0">${[0, 1, 2].map((i) => `<g transform="translate(${660 + i * 150} ${H.floor - 30 - (i % 2) * 40})">${sparkle(c, 12)}</g>`).join('')}</g>`);
    const dark = hBack.add(`<g opacity="0"><path d="${c.poly([[H.x0, H.ceil], [H.x1, H.ceil], [H.x1, H.floor + 30], [H.x0, H.floor + 30]])}" fill="#2a2338" opacity=".62"/></g>`);
    const cracksEl = hBack.add(`<g opacity="0"><path d="${c.ribbon([[700, H.ceil + 10], [720, H.ceil + 70], [704, H.ceil + 120], [730, H.ceil + 190]], 3) + c.ribbon([[960, H.ceil + 20], [940, H.ceil + 90], [968, H.ceil + 150]], 3)}" fill="#2a2338"/></g>`);
    const hFront = S.layer({ par: 0.3, sh: 5 });
    hFront.add(hs.front + hs.stairs);
    const manL = S.layer({ par: 0.32, sh: 5 });
    const cloak1 = manL.add(`<g>${shadowCloak(c, 190, 300)}</g>`);
    const man2 = S.puppet(manL.add(person(c, { ...MAN, robe: mix(C.tealRobe, C.storm2, 0.3), eyes: 'closed' })));
    const houseL = [hBack, hFront, manL];

    /* the spirits */
    const sL = S.layer({ par: 0.36, sh: 4 });
    const lead = sL.add(`<g>${spirit(c, 1.6, '#3d3346')}</g>`);
    const seven = Array.from({ length: 7 }, (_, i) => ({ i, el: sL.add(`<g opacity="0">${spirit(c, 1.3 + (i % 3) * 0.2)}</g>`) }));
    const home = sL.add(`<g opacity="0">${thought(c, `<g transform="translate(-14 12) scale(.5)">${sheet().p(c.cut([[0, 0], [0, -40], [30, -64], [60, -40], [60, 0]], 0.4, 4), C.plaster).p(c.cut(c.rect(22, -24, 16, 24), 0.2, 3), C.wood2).out()}</g>`, { w: 70, h: 54 })}</g>`);
    const SEAT = [[620, 460], [700, 540], [790, 420], [860, 560], [930, 470], [990, 600], [660, 610]];

    return (t, time) => {
      const T = time;
      const toHouse = es(t, 1.9, 2.1);
      desertL.forEach((L) => L.fade(1 - toHouse));
      houseL.forEach((L) => L.fade(toHouse));
      dusk.layer.fade(es(t, 3.1, 3.8) * 0.8);

      /* v24a — the spirit leaves the man, the shadow drops, it wanders the dry land */
      const out = es(t, -0.3, 0.25);
      man.set({ x: 560, y: Y, s: 1.0, armF: 20 + out * 50, armB: 10 + out * 120, head: 10 - out * 18, lean: 6 - out * 8, blink: blinkAt(T, 3) });
      pose(cloak0, { x: 556, y: Y + 2, o: 1 - out });
      pose(freeGlow, { x: 562, y: Y - 110, o: out * (1 - es(t, 0.9, 1.2)) });
      const wob = T ? Math.sin(T * 2.2) * 6 : 0;
      let lx, ly, lr = 0;
      if (t < 1.1) {
        const a = es(t, 0.05, 0.4), b = es(t, 0.5, 0.85);
        const jit = (bump(t, 0.38, 0.55) + bump(t, 0.85, 1.05)) * Math.sin(t * 90) * 6;
        lx = lerp(lerp(580, 790, a), 1020, b) + jit; ly = lerp(lerp(Y - 140, 630, a), 560, b) - Math.sin(a * PI) * 90 - Math.sin(b * PI) * 70 + wob; lr = jit * 2 + (T ? Math.sin(T * 1.5) * 10 : 0);
      } else {
        const k = es(t, 1.45, 1.95, ease.in);
        lx = lerp(1020, 1500, k); ly = lerp(560, 360, k) + wob; lr = k * 30;
      }
      if (t > 2) {
        const a = es(t, 2.05, 2.4), b = es(t, 3.05, 3.4);
        lx = lerp(lerp(1400, H.x1 - 150, a), 800, b); ly = lerp(lerp(300, 410, a), 500, b) + wob * 0.5; lr = 0;
      }
      pose(lead, { x: lx, y: ly, r: lr, o: t < 1.9 || t > 2.02 ? 1 : 0 });
      const hk = es(t, 1.08, 1.22, ease.back) * (1 - es(t, 1.85, 1.95));
      pose(home, { x: lx + 20, y: ly - 10, s: hk, o: hk > 0.01 ? 1 : 0 });

      /* v25 — swept and put in order */
      const neat = es(t, 2.05, 2.3);
      pose(sweep, { o: neat * (1 - es(t, 3.3, 3.6)) });
      pose(shine, { o: bump(t, 2.2, 3.0) });
      const drop = es(t, 4.1, 4.35, ease.in);
      pose(gar, { x: 800 + drop * 10, y: H.ceil + 100 + drop * 180, r: drop * 20, o: 1 - drop * 0.3 });
      pose(br, { x: H.x0 + 170, y: H.floor - 70 + drop * 40, r: 10 + drop * 70 });
      pose(vase, { x: 930, y: H.floor - 44, r: drop * -80, o: 1 });

      /* v26a — the seven worse spirits pour in and dwell */
      seven.forEach((sp) => {
        const k = es(t, 3.05 + sp.i * 0.05, 3.5 + sp.i * 0.05);
        const [sx, sy] = SEAT[sp.i];
        const from = sp.i % 2 ? [1500, 250 + sp.i * 20] : [H.x1 + 220, H.floor - 40];
        pose(sp.el, { x: lerp(from[0], sx, k) + (T ? Math.sin(T * 1.6 + sp.i) * 4 : 0) * k, y: lerp(from[1], sy, k) - Math.sin(k * PI) * 60, r: (1 - k) * 40, s: 1 + es(t, 4.05, 4.4) * 0.2, o: es(t, 3.05 + sp.i * 0.05, 3.12 + sp.i * 0.05) });
      });
      pose(dark, { o: es(t, 3.4, 3.8) * 0.7 + es(t, 4.05, 4.4) * 0.3 });
      pose(cracksEl, { o: es(t, 4.1, 4.35) });

      /* v26b — the man in his doorway, worse than before */
      const mk = es(t, 4.02, 4.2);
      man2.set({ x: H.x0 + 110, y: H.floor + 4, s: 0.96, o: mk, armF: 10, armB: 4, head: 16, lean: 10, blink: 0 });
      pose(cloak1, { x: H.x0 + 106, y: H.floor + 6, s: 0.6 + es(t, 4.1, 4.4) * 0.5, o: es(t, 4.1, 4.3) * 0.95 });

      S.cam.x = kf(t, [[-0.5, -30], [0.5, 0], [1.1, 30], [1.9, 30], [2.1, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.1], [1.9, 1.12], [2.1, 1.04], [3.9, 1.06], [4.2, 1.08]]);
      S.cam.y = kf(t, [[-0.5, 50], [1.9, 56], [2.1, 10], [3.9, 10], [4.2, 20]]);
    };
  },
};
