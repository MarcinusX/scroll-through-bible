// Mt 21,1–3 — on the Mount of Olives, Jerusalem gleaming across the valley. Jesus sends two disciples to the
// village opposite: a paper plate comes down showing what they will find — a she-donkey tied at a door and her
// colt beside her — the rope comes undone and an arrow brings them here; and what to say if anyone asks.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, sun, cloud, olive, cypress, grass, rock, bush } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { jerusalem, colt, jenny, coltRig, grove, TWO, plate, question, bubble, tagOnString, signpost, headAt, sparkle, tr, DAY, PI } from './lib.js';

const ROAD = 676;
const VIL = [1130, 548];   // Bethphage, the village "opposite you"

export default {
  id: 'mt21-bethphage',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'i rzekł im: «Idźcie do wsi, która jest przed wami, a zaraz znajdziecie oślicę uwiązaną i źrebię z nią.' },
    { v: 2, cont: true, text: 'Odwiążcie je i przyprowadźcie do Mnie!' },
    { v: 3 },
  ],
  cam: { x: [-40, 90], y: [-50, 50], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    sky(S, ['#e3d9c2', '#f3e3c4', '#f8ead3']);
    const dayL = sky(S, DAY, { name: 'sky2', rise: 0 }).layer;

    /* ---------- heavens ---------- */
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 48), { x: 1230, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 210), { x: 470, y: 130, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 820, y: 96, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 210, speed: 40, scale: 0.45 });

    /* ---------- Jerusalem across the valley ---------- */
    const cityL = S.layer({ par: 0.1, sh: 3 });
    cityL.add(band(c, { y: 420, amps: [10, 5, 2], lens: [900, 300, 120], color: mix(C.hillFar, C.dune, 0.25), x0: -1400, x1: 3000 }).markup);
    cityL.add(`<g transform="translate(900 404)">${jerusalem(c, 0.6)}</g>`);
    const templeGlow = cityL.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);
    const glint = cityL.add(`<g>${sparkle(c, 16)}</g>`);

    /* ---------- the Kidron valley, the far slopes with Bethany ---------- */
    const valL = S.layer({ par: 0.16, sh: 3 });
    const vb = hillsWith(c, { y: 452, amps: [14, 6, 2], lens: [800, 300, 120], color: mix(C.hillMid, C.sage, 0.35), trees: 30, treeColor: mix(C.olive, C.moss, 0.3), treeH: 18, x0: -1400, x1: 3000 });
    valL.add(vb.markup);
    valL.add(town(c, { x: 440, y: vb.fn(440) + 10, n: 5, spread: 150, sc: 0.42 }));

    /* ---------- the Mount of Olives: groves, Bethphage ---------- */
    const hillL = S.layer({ par: 0.26, sh: 3 });
    const hb = hillsWith(c, { y: 548, amps: [16, 7, 3], lens: [1000, 360, 130], color: C.hillMid, x0: -1400, x1: 3000 });
    hillL.add(hb.markup);
    hillL.add(grove(c, hb.fn, -500, 560, 9, 0.62) + grove(c, hb.fn, 1380, 2200, 6, 0.6));
    hillL.add(town(c, { x: VIL[0], y: hb.fn(VIL[0]) + 8, n: 7, spread: 220, sc: 0.62 }));
    hillL.add(cypress(c, 980, hb.fn(980) + 6, 110) + cypress(c, 1290, hb.fn(1290) + 6, 96));
    hillL.add(olive(c, 640, hb.fn(640) + 8, 0.7) + olive(c, 760, hb.fn(760) + 10, 0.55) + olive(c, 880, hb.fn(880) + 8, 0.62));
    let terr = '';
    for (let i = 0; i < 5; i++) { const y = 560 + i * 16, x0 = -600 + c.rr(0, 200); terr += c.ribbon([[x0, y], [x0 + c.rr(700, 1100), y + c.rr(-4, 4)]], 2.2); }
    hillL.add(`<path d="${terr}" fill="${shade(C.hillMid, -0.12)}" opacity=".6"/>`);
    const vilGlow = hillL.add(`<g><circle r="120" fill="url(#warm-glow)"/></g>`);
    // the way to the village: a dotted path that draws itself
    const path = c.qbez([880, 640], [1010, 600], [VIL[0] - 20, hb.fn(VIL[0]) + 6], 16);
    const dots = path.map(([x, y]) => hillL.add(`<path d="${c.poly(c.ell(x, y, 5, 2.6, 8))}" fill="${C.cream}" opacity="0"/>`));

    /* ---------- the road over the Mount ---------- */
    const roadL = S.layer({ par: 0.5, sh: 4 });
    const rfn = c.wave(620, [6, 3], [800, 200]);
    const rs = sheet();
    rs.p(c.ridge(rfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.4));
    rs.p(c.cut([[-1400, 652], [-400, 646], [400, 650], [1200, 646], [3000, 640], [3000, 720], [1200, 726], [400, 730], [-400, 724], [-1400, 728]], 1.4, 14), mix(C.sand, C.sand2, 0.35));
    let ruts = '';
    for (let i = 0; i < 26; i++) { const x = c.rr(-600, 2200), y = c.rr(660, 716); ruts += c.poly(c.ell(x, y, c.rr(4, 9), 2, 8)); }
    rs.x(ruts, shade(C.sand2, -0.18), 'opacity=".5"');
    roadL.add(rs.out());
    roadL.add(grass(c, { x0: -800, x1: 2400, y: 640, fn: (x) => rfn(x) + 18, n: 34, h: 13, color: C.olive }));
    roadL.add(`<g transform="translate(1190 652)">${signpost(c, tr('Góra Oliwna', 'Mount of Olives'), { size: 17, dir: 1 })}</g>`);
    roadL.add(rock(c, 360, 668, 60, 22, C.rock) + rock(c, 1260, 664, 46, 18, C.rock2));

    /* ---------- place names hang from the flies ---------- */
    const tagL = S.layer({ par: 0.2, sh: 4 });
    const tags = [
      { el: tagL.add(`<g>${tagOnString(tr('Betfage', 'Bethphage'), { size: 19, len: 500, dx: 0, dy: 70 })}</g>`), x: S.portrait ? 1040 : VIL[0], y: 400, t0: 1.1 },   // phone: clear of the thread
      { el: tagL.add(`<g>${tagOnString(tr('Jerozolima', 'Jerusalem'), { size: 22, len: 500, dx: 0, dy: 0 })}</g>`), x: 640, y: 200, t0: 1.3 },
    ];

    /* ---------- Jesus and the disciples ---------- */
    const peopleL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [
      { o: CAST.thomas, x: 500, y: ROAD - 16, s: 0.86 }, { o: CAST.james, x: 616, y: ROAD - 18, s: 0.86 },
      { o: CAST.matthew, x: 450, y: ROAD + 2, s: 0.93 }, { o: CAST.peter, x: 566, y: ROAD + 4, s: 0.94 }, { o: CAST.john, x: 680, y: ROAD + 2, s: 0.93 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(peopleL.add(person(c, d.o))) }));
    const jesus = S.puppet(peopleL.add(person(c, { ...CAST.jesus })));
    const two = TWO.map((o, i) => ({ o, i, seed: c.rr(0, 9), p: S.puppet(peopleL.add(person(c, o))) }));

    /* ---------- what they will find: a plate lowered from the flies ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const doorM = sheet()
      .p(c.cut(c.rect(22, -34, 56, 84), 0.4, 6), C.plaster)
      .p(c.cut([[34, 50], [34, 0], ...c.arc(48, 0, 14, 14, PI, 2 * PI, 6), [62, 50]], 0.3, 4), C.wood2)
      .p(c.cut(c.circ(36, 20, 3.4, 8), 0.2, 2), C.sun).out();
    const ground = sheet().p(c.cut([[-72, 48], [72, 48], [64, 62], [-64, 62]], 0.4, 6), C.sand2).out();
    const arrow = `<g data-k="parrow" opacity="0"><path d="${c.ribbon(c.qbez([36, -48], [-10, -70], [-56, -40], 10), 3)}" fill="${C.terracotta}"/><path d="${c.poly([[-64, -36], [-50, -32], [-56, -46]])}" fill="${C.terracotta}"/></g>`;
    const plateM = plate(c, `<g transform="scale(1.32)">${ground}${doorM}<g data-k="prope"><path d="${c.ribbon([[0, 0], [9, 6], [17, 9]], 2.2)}" fill="${C.rope}"/></g><g data-k="pjenny">${jenny(c, { halter: true })}</g><g data-k="pcolt">${colt(c, { halter: false })}</g><g data-k="pstar">${sparkle(c, 9)}</g>${arrow}</g>`, { r: 112 });
    const plateEl = hanging(fx, plateM, { x: 800, y: 250, len: 900 });
    const pJenny = coltRig(S.$('pjenny').firstElementChild);
    const pColt = coltRig(S.$('pcolt').firstElementChild);
    const pRope = S.$('prope'), pStar = S.$('pstar'), pArrow = S.$('parrow');
    // "if anyone says anything to you…"
    const askEl = hanging(fx, `<g transform="scale(1.2)">${question(c)}</g>`, { x: 1000, y: 230, len: 900 });
    // "The Lord needs them"
    const sayEl = fx.add(`<g>${bubble(c, [tr('Pan ich potrzebuje', 'The Lord needs them'), tr('i zaraz je puści', 'and will send them at once')], { size: 19, tail: -1 })}</g>`);

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    const FR = S.portrait ? 150 : 0;   // phone: the right-hand foreground plants stay out of the corner instead of peeping in
    fg.add(olive(c, 120, 900, 1.5) + olive(c, 1520 + FR, 910, 1.4) + bush(c, 1300 + FR, 880, 200, C.sage, C.moss) + bush(c, 330, 890, 180, C.moss, C.sage));

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      dayL.fade(es(t, 0.5, 3));
      swing(sunEl, 1230, 150 - es(t, 0, 3) * 26, T, 1.1, 0.7);
      swing(cl1, 470 + Math.sin(T * 0.1) * 28, 130, T, 1.3, 0.6, 1);
      swing(cl2, 820 + Math.sin(T * 0.13 + 2) * 28, 96, T, 1.3, 0.8, 2);
      birds(T, 1);

      // the Temple gleams as they come near
      const gleam = es(t, 1.2, 1.6);
      pose(templeGlow, { x: 1072, y: 250, s: 0.6 + gleam * 0.5, o: 0.25 + gleam * 0.55 });
      pose(glint, { x: 1080, y: 205, s: bump(t, 1.25, 1.9) * 1.2 + 0.001, r: t * 90, o: bump(t, 1.25, 1.9) });
      tags.forEach((g, i) => {
        const d = es(t, g.t0, g.t0 + 0.35, ease.back) * (1 - es(t, 2.1, 2.5));
        swing(g.el, g.x, g.y - (1 - d) * (S.portrait ? 1000 : 520), T, 1.2, 0.8, i);   // phone: parked out of sight
      });

      /* v1 — they come near along the road; two are called forward */
      const arrive = es(t, 1.0, 1.55, ease.out);
      const walking = t > 1.0 && t < 1.55;
      const jx = lerp(420, 800, arrive);
      const turnBack = es(t, 1.56, 1.7) * (1 - es(t, 1.95, 2.08));
      const point = es(t, 2.05, 2.35) * (1 - es(t, 3.1, 3.3));
      const beckon = bump(t, 3.05, 3.95);
      const speak = es(t, 4.05, 4.2) * (1 - es(t, 4.5, 4.65));
      jesus.set({
        x: jx, y: ROAD, s: 1.0, flip: turnBack > 0.5,
        walk: walking ? jx * 0.045 : undefined,
        armF: point * 88 + turnBack * 40 + beckon * 70 + speak * 50,
        armB: bump(t, 1.6, 1.95) * 30 + speak * 20, head: -point * 4, blink: blinkAt(T),
      });
      DIS.forEach((d) => {
        const x = lerp(d.x - 380, d.x, arrive);
        const listen = es(t, 2.1, 2.4);
        d.p.set({ x, y: d.y, s: d.s, flip: false, walk: walking ? x * 0.045 + d.i : undefined, head: -listen * 4 + (d.i === 3 ? bump(t, 4.1, 4.8) * 10 : 0), armF: d.i === 3 ? bump(t, 4.1, 4.8) * 30 : 0, blink: blinkAt(T, d.seed) });
      });
      // the two sent: they step forward on v1, listen, then set off towards the village
      two.forEach((m) => {
        const step = es(t, 1.6, 1.9);
        const go = es(t, 4.45 + m.i * 0.06, 4.95 + m.i * 0.04, ease.in);
        const x0 = lerp(880 - 380 + m.i * 70, 880 + m.i * 70, arrive);
        const x = x0 + step * 14 + go * 520;
        const nod = bump(t, 4.25, 4.5);
        m.p.set({
          x, y: ROAD + 2 - m.i * 10, s: 0.94 - m.i * 0.04, flip: step > 0.4 && go < 0.02,
          walk: (t > 1 && t < 1.55) || (step > 0 && step < 1) || (go > 0 && go < 1) ? x * 0.05 + m.i : undefined,
          head: nod * 10 - bump(t, 2.2, 3.8) * 10, armF: bump(t, 1.62, 1.9) * 30 + (m.i === 0 ? bump(t, 2.3, 2.9) * 70 : 0),
          blink: blinkAt(T, m.seed), o: 1 - seg(t, 4.88, 4.99),
        });
      });

      /* v2a — "the village opposite you": the path draws itself, the village glows; the plate comes down */
      const drawn = es(t, 2.05, 2.45);
      dots.forEach((d, i) => fade(d, drawn * dots.length > i ? 0.9 * (1 - es(t, 4.8, 5)) : 0));
      pose(vilGlow, { x: VIL[0], y: VIL[1] - 20, s: 1, o: es(t, 2.1, 2.35) * (1 - es(t, 2.9, 3.3)) * 0.9 });
      const down = es(t, 2.25, 2.6, ease.back) * (1 - es(t, 4.1, 4.45));
      swing(plateEl, 800, 270 - (1 - down) * 700, T, 1.3, 0.7);
      pose(pStar, { x: -30, y: -20 - bump(t, 2.5, 2.95) * 6, s: bump(t, 2.5, 2.95) * 1.2 + 0.001, r: t * 80, o: bump(t, 2.5, 2.95) });
      // v2b — untie them and bring them to me: the rope falls, both walk out of the plate towards Jesus (left)
      const untie = es(t, 3.05, 3.3);
      const lead = es(t, 3.3, 3.85);
      pose(pRope, { x: 19, y: 11, r: untie * 70, o: 1 - untie });
      const turned = lead > 0.02;
      const wk = lead > 0 && lead < 1 ? t * 30 : undefined;
      pJenny.set({ x: -2 - lead * 16, y: 54, s: 0.34, flip: turned, walk: wk, amt: 0.8, nod: bump(t, 2.6, 2.95) * 8, ear: Math.sin(T * 1.6) * 6, tail: Math.sin(T * 1.4) * 6 });
      pColt.set({ x: -50 - lead * 12, y: 58, s: 0.25, flip: turned, walk: wk !== undefined ? wk + 1 : undefined, amt: 0.9, nod: bump(t, 2.7, 3.0) * 10, ear: Math.sin(T * 2 + 1) * 8, tail: Math.sin(T * 1.8) * 8 });
      fade(pArrow, es(t, 3.4, 3.65) * (1 - es(t, 4.05, 4.2)));

      /* v3 — "if anyone says anything…" — "The Lord needs them" */
      const ask = es(t, 4.02, 4.3, ease.back) * (1 - es(t, 4.7, 4.9));
      swing(askEl, 1000, 250 - (1 - ask) * 700, T, 2.4, 1.1, 3);
      const [hx, hy] = headAt(jx, ROAD, 1, false);
      const say = es(t, 4.15, 4.35, ease.back) * (1 - es(t, 4.82, 4.97));
      pose(sayEl, { x: hx + 24, y: hy - 36, s: say, o: say > 0.02 ? 1 : 0 });

      S.cam.z = 1 + es(t, 0.3, 1.5) * 0.06 + es(t, 2.2, 2.6) * 0.04 - es(t, 4.3, 4.9) * 0.04;
      S.cam.x = es(t, 0.3, 1.5) * 30 + es(t, 2.0, 2.3) * 30 - es(t, 2.2, 2.6) * 30 + es(t, 4.3, 4.9) * 50;
      S.cam.y = es(t, 0.3, 1.5) * 20 - es(t, 2.2, 2.6) * 40 + es(t, 4.3, 4.9) * 20;
    };
  },
};
