// Mt 12,43–45 — a saying told as a shadow-story, on two painted flats. First the dry wilderness: a man stands up
// free as a little dark spirit curls out of him and drifts away over the cracked ground. It tries to settle on a rock,
// then on a dead thorn tree — it finds no rest. "I will return to my house": a thought of the little house, and off it
// goes. The second flat is that house, cut open like a doll's house: empty, swept clean, a garland over the shelf —
// and the spirit peers in at the window. It goes and brings seven others worse than itself; they pour in by door and
// window and settle everywhere, and the room goes dark; the garland drops, the walls crack: the last state worse than
// the first. "So it will be with this evil generation": the dark spreads over a row of Pharisees in front.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix, sky } from '../kit.js';
import { band, hillsWith, rock, bush } from '../../assets/nature.js';
import { thornBush } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { DESERT, DUSK, houseSection, spirit, broom, garland, manOf, phOpts, scribeOpts, headAt, kf, thought, glow, sparkle, PI } from './lib.js';

const Y = 690;
const H = { x0: 560, x1: 1040, floor: 640, ceil: 330 };

export default {
  id: 'mt12-return',
  enter: 'fly',
  beats: [
    { v: 43, text: 'Gdy duch nieczysty opuści człowieka, błąka się po miejscach bezwodnych,' },
    { v: 43, cont: true, text: 'szukając spoczynku, ale nie znajduje.' },
    { v: 44, text: 'Wtedy mówi: "Wrócę do swego domu, skąd wyszedłem";' },
    { v: 44, cont: true, text: 'a przyszedłszy zastaje go niezajętym, wymiecionym i przyozdobionym.' },
    { v: 45, text: 'Wtedy idzie i bierze z sobą siedmiu innych duchów złośliwszych niż on sam; wchodzą i mieszkają tam.' },
    { v: 45, cont: true, text: 'I staje się późniejszy stan owego człowieka gorszy, niż był poprzedni.' },
    { v: 45, cont: true, text: 'Tak będzie i z tym przewrotnym plemieniem».' },
  ],
  cam: { x: [-40, 40], y: [-30, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const TX = P ? 960 : 1030;     // the dead thorn tree (phone: inside the screen)
    sky(S, DESERT);
    const dusk = sky(S, DUSK, { name: 'dusk' });
    dusk.layer.fade(0);
    /* flat 1: the waterless places */
    const d1 = S.layer({ par: 0.12, sh: 2 });
    d1.add(band(c, { y: 470, amps: [24, 10, 3], lens: [900, 330, 120], color: mix(C.dune, C.parchment, 0.3) }).markup);
    const d2 = S.layer({ par: 0.3, sh: 3 });
    const ds = sheet().p(c.ridge(c.wave(610, [6, 3], [700, 180]), -900, 2500, 1700, 12, 1), mix(C.sand2, C.dune, 0.4));
    let cracks = '';
    for (let i = 0; i < 26; i++) { const x = c.rr(-300, 1900), y = c.rr(650, 900); cracks += c.ribbon([[x, y], [x + c.rr(-30, 30), y + c.rr(6, 16)], [x + c.rr(-40, 40), y + c.rr(14, 28)]], 1.6); }
    ds.x(cracks, shade(C.dune, -0.3), 'opacity=".55"');
    d2.add(ds.out() + rock(c, 640, 690, 150, 60, C.rock2) + thornBush(c, TX, 660, 150, C.thorn2) + rock(c, 1300, 650, 90, 30, C.rock3));
    const desertL = [d1, d2];
    const man = S.puppet(d2.add(person(c, manOf(c, { robe: C.tealRobe, belt: C.leather, beard: 'short' }))));
    const freeGlow = d2.add(`<g opacity="0">${glow(120, 0.9)}</g>`);

    /* flat 2: the house, cut open */
    const hs = houseSection(c, H);
    const hBack = S.layer({ par: 0.3, sh: 3 });
    hBack.add(`<g>${sheet().p(c.ridge(c.wave(H.floor + 20, [4, 2], [700, 180]), -900, 2500, 1700, 12, 1), mix(C.sand, C.hillNear, 0.3)).out()}</g>`);
    hBack.add(hs.back);
    const sweep = hBack.add(`<g opacity="0">${[0, 1, 2, 3, 4].map((i) => `<path d="${c.ribbon(c.arc(640 + i * 80, H.floor + 16, 34, 6, PI * 0.1, PI * 0.9, 8), 1.6)}" fill="${shade(C.sand2, -0.2)}"/>`).join('')}</g>`);
    const gar = hBack.add(`<g>${garland(c, 300, 50)}</g>`);
    const br = hBack.add(`<g>${broom(c)}</g>`);
    const shine = hBack.add(`<g opacity="0">${[0, 1, 2].map((i) => `<g transform="translate(${660 + i * 150} ${H.floor - 20 - (i % 2) * 40})">${sparkle(c, 12)}</g>`).join('')}</g>`);
    const dark = hBack.add(`<g opacity="0"><path d="${c.poly([[H.x0, H.ceil], [H.x1, H.ceil], [H.x1, H.floor + 30], [H.x0, H.floor + 30]])}" fill="#2a2338" opacity=".6"/></g>`);
    const cracksEl = hBack.add(`<g opacity="0"><path d="${c.ribbon([[700, H.ceil + 10], [720, H.ceil + 70], [704, H.ceil + 120], [730, H.ceil + 190]], 3) + c.ribbon([[960, H.ceil + 20], [940, H.ceil + 90], [968, H.ceil + 150]], 3)}" fill="#2a2338"/></g>`);
    const hFront = S.layer({ par: 0.3, sh: 5 });
    hFront.add(hs.front + hs.stairs);
    const houseL = [hBack, hFront];
    const phL = S.layer({ par: 0.42, sh: 5 });
    const PH = [phOpts(0), scribeOpts(1), phOpts(2)].map((o, i) => ({ i, p: S.puppet(phL.add(person(c, o))) }));
    const phShL = S.layer({ par: 0.42, sh: 1, flat: true });
    const dg = S.id('dark');
    S.defs(`<radialGradient id="${dg}"><stop offset="0" stop-color="#2a2338" stop-opacity=".6"/><stop offset=".6" stop-color="#2a2338" stop-opacity=".35"/><stop offset="1" stop-color="#2a2338" stop-opacity="0"/></radialGradient>`);
    const phShadow = phShL.add(`<g opacity="0"><ellipse cy="-100" rx="280" ry="170" fill="url(#${dg})"/></g>`);
    phL.fade(0);

    /* the spirits */
    const sL = S.layer({ par: 0.34, sh: 4 });
    const lead = sL.add(`<g>${spirit(c, 1.6, '#3d3346')}</g>`);
    const seven = Array.from({ length: 7 }, (_, i) => ({ i, el: sL.add(`<g opacity="0">${spirit(c, 1.3 + (i % 3) * 0.2)}</g>`) }));
    const home = sL.add(`<g opacity="0">${thought(c, `<g transform="translate(-14 12) scale(.5)">${sheet().p(c.cut([[0, 0], [0, -40], [30, -64], [60, -40], [60, 0]], 0.4, 4), C.plaster).p(c.cut(c.rect(22, -24, 16, 24), 0.2, 3), C.wood2).out()}</g>`, { w: 70, h: 54 })}</g>`);

    // where each of the seven settles in the house
    const SEAT = [[620, 460], [700, 540], [790, 420], [860, 560], [930, 470], [990, 600], [660, 610]];

    return (t, time) => {
      const T = time;
      const toHouse = es(t, 2.95, 3.2);
      desertL.forEach((L) => L.fade(1 - toHouse));
      houseL.forEach((L) => L.fade(toHouse));
      dusk.layer.fade(es(t, 4.2, 5.0));

      /* v43a — the spirit leaves the man, wanders the dry land */
      const out = es(t, -0.2, 0.3);
      man.set({ x: 560, y: Y, s: 1.0, flip: false, armF: 20 + out * 50, armB: 10 + out * 120, head: 10 - out * 18, lean: 6 - out * 8, blink: blinkAt(T, 3) });
      pose(freeGlow, { x: 562, y: Y - 110, o: out * (1 - es(t, 1.0, 1.3)) });
      const wob = Math.sin(T * 2.2) * 6;
      let lx, ly, lr = 0;
      if (t < 1) { const k = es(t, 0.1, 0.9); lx = lerp(580, 840, k); ly = lerp(Y - 140, 520, k) - Math.sin(k * PI) * 80 + wob; lr = Math.sin(T * 1.5) * 10; }
      else if (t < 2) {
        // tries the rock, then the thorn tree
        const a = es(t, 1.0, 1.3), b = es(t, 1.45, 1.75);
        const jitter = (bump(t, 1.25, 1.45) + bump(t, 1.7, 1.95)) * Math.sin(t * 90) * 6;
        lx = lerp(lerp(840, 650, a), TX, b) + jitter; ly = lerp(lerp(520, 610, a), 540, b) - Math.sin(b * PI) * 70; lr = jitter * 2;
      } else if (t < 3) {
        const k = P ? es(t, 2.6, 2.98, ease.in) : es(t, 2.3, 2.98, ease.in);   // phone: lingers so its thought of home is seen
        lx = lerp(TX, 1400, k); ly = lerp(540, 380, k) + wob; lr = k * 30;
      } else {
        // arrives at the window, then leads the seven in
        const a = es(t, 3.0, 3.4), b = es(t, 4.1, 4.45);
        lx = lerp(lerp(1400, H.x1 - 150, a), 800, b); ly = lerp(lerp(300, 400, a), 500, b) + wob * 0.5; lr = 0;
      }
      pose(lead, { x: lx, y: ly, r: lr, o: t < 2.9 || t > 3.0 ? 1 : 0 });
      const hk = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.88, 2.96));
      pose(home, { x: lx + 20, y: ly - 10, s: hk, o: hk > 0.01 ? 1 : 0 });

      /* v44b — empty, swept, adorned */
      const neat = es(t, 3.2, 3.5);
      pose(sweep, { o: neat * (1 - es(t, 4.3, 4.6)) });
      pose(shine, { o: bump(t, 3.3, 4.0) });
      const drop = es(t, 5.1, 5.35, ease.in);
      pose(gar, { x: 800 + drop * 10, y: H.ceil + 100 + drop * 180, r: drop * 20, o: 1 - drop * 0.3 });
      pose(br, { x: H.x1 - 60 + es(t, 3.15, 3.4) * -10, y: H.floor - 70 + drop * 40, r: 10 + drop * 70 });

      /* v45a — seven worse spirits pour in and dwell */
      seven.forEach((sp) => {
        const k = es(t, 4.05 + sp.i * 0.05, 4.5 + sp.i * 0.05);
        const [sx, sy] = SEAT[sp.i];
        const from = sp.i % 2 ? [1500, 250 + sp.i * 20] : [H.x1 + 200, H.floor - 40];
        pose(sp.el, { x: lerp(from[0], sx, k) + Math.sin(T * 1.6 + sp.i) * 4 * k, y: lerp(from[1], sy, k) - Math.sin(k * PI) * 60, r: (1 - k) * 40, s: 1 + es(t, 5.05, 5.4) * 0.2, o: es(t, 4.05 + sp.i * 0.05, 4.12 + sp.i * 0.05) });
      });
      const darkK = es(t, 4.4, 4.8) * 0.7 + es(t, 5.05, 5.4) * 0.3;
      pose(dark, { o: darkK });
      pose(cracksEl, { o: es(t, 5.1, 5.35) });

      /* v45c — so with this generation */
      const gen = es(t, 6.0, 6.3);
      phL.fade(gen);
      PH.forEach((m) => m.p.set({ x: 700 + m.i * 100, y: 760 + (m.i % 2) * 8, s: 0.98, flip: m.i === 2, armF: 10, armB: 4, head: 6, blink: 0.4 }));
      pose(phShadow, { x: 800, y: 770, o: es(t, 6.2, 6.5) });

      S.cam.x = kf(t, [[-0.5, -30], [1.0, -10], [2.0, 30], [2.9, 30], [3.1, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.1], [2.9, 1.12], [3.1, 1.04], [5.9, 1.06], [6.2, 1.0]]);
      S.cam.y = kf(t, [[-0.5, 50], [2.9, 56], [3.1, 10], [5.9, 10], [6.2, 60]]);
    };
  },
};
