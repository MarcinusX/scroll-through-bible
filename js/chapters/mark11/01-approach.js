// Mk 11,1–3 — on the Mount of Olives, Jerusalem gleaming across the valley. Jesus sends two
// disciples to the village opposite: a paper plate comes down showing what they will find —
// a colt tied at a door — and what to say if anyone asks.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, sun, cloud, olive, cypress, grass, rock, bush } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { jerusalem, colt, coltRig, grove, TWO, plate, question, bubble, tagOnString, signpost, hand, headAt, sparkle, FONT } from './lib.js';

const PI = Math.PI;
const ROAD = 676;
const VIL = [1130, 548];   // Bethphage, the village "opposite you"

export default {
  id: 'm11-approach',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'i rzekł im: «Idźcie do wsi, która jest przed wami,' },
    { v: 2, cont: true, text: 'a zaraz przy wejściu do niej znajdziecie oślę uwiązane, na którym jeszcze nikt z ludzi nie siedział.' },
    { v: 2, cont: true, text: 'Odwiążcie je i przyprowadźcie tutaj!' },
    { v: 3, text: 'A gdyby was kto pytał, dlaczego to robicie,' },
    { v: 3, cont: true, text: 'powiedzcie: Pan go potrzebuje i zaraz odeśle je tu z powrotem».' },
  ],
  cam: { x: [-40, 90], y: [-50, 50], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    // phone: Bethphage, its name tag and the dotted way to it stand inside the narrow screen
    const P = S.portrait;
    const VX = P ? 1000 : VIL[0];
    const SKY = ['#e3d9c2', '#f3e3c4', '#f8ead3'];
    const sk = sky(S, SKY);

    /* ---------- heavens ---------- */
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 48), { x: 1230, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 210), { x: 470, y: 130, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 820, y: 96, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 210, speed: 40, scale: 0.45 });

    /* ---------- Jerusalem across the valley ---------- */
    const cityL = S.layer({ par: 0.1, sh: 3 });
    cityL.add(band(c, { y: 420, amps: [10, 5, 2], lens: [900, 300, 120], color: mix(C.hillFar, C.dune, 0.25), x0: -1400, x1: 3000 }).markup);
    const city = cityL.add(`<g transform="translate(900 404)">${jerusalem(c, 0.6)}</g>`);
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
    hillL.add(town(c, { x: VX, y: hb.fn(VX) + 8, n: 7, spread: 220, sc: 0.62 }));
    hillL.add(cypress(c, 980, hb.fn(980) + 6, 110) + cypress(c, 1290, hb.fn(1290) + 6, 96));
    hillL.add(olive(c, 640, hb.fn(640) + 8, 0.7) + olive(c, 760, hb.fn(760) + 10, 0.55) + olive(c, 880, hb.fn(880) + 8, 0.62));
    let terr = '';
    for (let i = 0; i < 5; i++) { const y = 560 + i * 16, x0 = -600 + c.rr(0, 200); terr += c.ribbon([[x0, y], [x0 + c.rr(700, 1100), y + c.rr(-4, 4)]], 2.2); }
    hillL.add(`<path d="${terr}" fill="${shade(C.hillMid, -0.12)}" opacity=".6"/>`);
    const vilGlow = hillL.add(`<g><circle r="120" fill="url(#warm-glow)"/></g>`);
    // the way to the village: a dotted path that draws itself
    const dots = [];
    const path = c.qbez([880, 640], [P ? 950 : 1010, 600], [VX - 20, hb.fn(VX) + 6], 16);
    path.forEach(([x, y], i) => { if (i % 1 === 0) dots.push(hillL.add(`<path d="${c.poly(c.ell(x, y, 5, 2.6, 8))}" fill="${C.cream}" opacity="0"/>`)); });

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
      { el: tagL.add(`<g>${tagOnString(tr('Betania', 'Bethany'), { size: 19, len: 500, dx: 0, dy: 60 })}</g>`), x: 440, y: 320, t0: 1.05 },
      { el: tagL.add(`<g>${tagOnString(tr('Betfage', 'Bethphage'), { size: 19, len: 500, dx: 0, dy: 70 })}</g>`), x: VX, y: 400, t0: 1.2 },
      { el: tagL.add(`<g>${tagOnString(tr('Jerozolima', 'Jerusalem'), { size: 22, len: 500, dx: 0, dy: 0 })}</g>`), x: 640, y: 200, t0: 1.35 },
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
    const ground = sheet().p(c.cut([[-66, 48], [66, 48], [58, 62], [-58, 62]], 0.4, 6), C.sand2).out();
    const plateM = plate(c, `<g transform="scale(1.2)">${ground}${doorM}<g data-k="prope"><path d="${c.ribbon([[0, 0], [9, 6], [17, 9]], 2.2)}" fill="${C.rope}"/></g><g data-k="pcolt">${colt(c, { halter: true })}</g><g data-k="pstar">${sparkle(c, 9)}</g><g data-k="parrow" opacity="0"><path d="${c.ribbon(c.qbez([30, -44], [-10, -64], [-50, -38], 10), 3)}" fill="${C.terracotta}"/><path d="${c.poly([[-58, -34], [-44, -30], [-50, -44]])}" fill="${C.terracotta}"/></g></g>`, { r: 96 });
    const plateEl = hanging(fx, plateM, { x: 800, y: 250, len: 900 });
    const pColt = coltRig(S.$('pcolt').firstElementChild);
    const pRope = S.$('prope'), pStar = S.$('pstar'), pArrow = S.$('parrow');
    // "if anyone asks you, why?"
    const askEl = hanging(fx, `<g transform="scale(1.2)">${question(c)}</g>`, { x: 990, y: 230, len: 900 });
    // "The Lord needs him"
    const sayEl = fx.add(`<g>${bubble(c, [tr('Pan go potrzebuje', 'The Lord needs him'), tr('i zaraz go odeśle', 'and will send him back')], { size: 19, tail: -1 })}</g>`);

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(olive(c, 120, 900, 1.5) + olive(c, 1520, 910, 1.4) + bush(c, 1300, 880, 200, C.sage, C.moss) + bush(c, 330, 890, 180, C.moss, C.sage));

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      sk.blend(SKY, ['#d9e3d9', '#f2e8cc', '#f8edd8'], seg(t, 0.5, 6));
      swing(sunEl, 1230, 150 - es(t, 0, 3) * 26, T, 1.1, 0.7);
      swing(cl1, 470 + Math.sin(T * 0.1) * 28, 130, T, 1.3, 0.6, 1);
      swing(cl2, 820 + Math.sin(T * 0.13 + 2) * 28, 96, T, 1.3, 0.8, 2);
      birds(T, 1);

      // the Temple gleams as they come near
      const gleam = es(t, 1.2, 1.6);
      pose(templeGlow, { x: 1072, y: 250, s: 0.6 + gleam * 0.5, o: 0.25 + gleam * 0.55 });
      pose(glint, { x: 1080, y: 205, s: bump(t, 1.25, 1.9) * 1.2 + 0.001, r: t * 90, o: bump(t, 1.25, 1.9) });

      tags.forEach((g, i) => {
        const d = es(t, g.t0, g.t0 + 0.35, ease.back) * (1 - es(t, 2.6, 3.0));
        swing(g.el, g.x, g.y - (1 - d) * (P ? 1100 : 520), T, 1.2, 0.8, i);
      });

      /* v1 — they come along the road; two are called forward */
      const arrive = es(t, 1.0, 1.65, ease.out);
      const walking = t > 1.0 && t < 1.65;
      const jx = lerp(420, 800, arrive);
      const turnBack = es(t, 1.66, 1.8) * (1 - es(t, 2.0, 2.12));
      const point = es(t, 2.05, 2.4) * (1 - es(t, 4.1, 4.4));
      const beckon = bump(t, 4.05, 4.95);
      const speak = es(t, 6.0, 6.2) * (1 - es(t, 6.5, 6.7));
      jesus.set({
        x: jx, y: ROAD, s: 1.0, flip: turnBack > 0.5,
        walk: walking ? jx * 0.045 : undefined,
        armF: point * 88 + turnBack * 40 + beckon * (40 + Math.sin(T * 4) * 20) + speak * 50,
        armB: bump(t, 1.7, 2.0) * 30 + speak * 20, head: -point * 4, blink: blinkAt(T),
      });
      DIS.forEach((d) => {
        const x = lerp(d.x - 380, d.x, arrive);
        const listen = es(t, 2.1, 2.4);
        d.p.set({ x, y: d.y, s: d.s, flip: false, walk: walking ? x * 0.045 + d.i : undefined, head: -listen * 4 + (d.i === 3 ? bump(t, 5.1, 5.9) * 10 : 0), armF: d.i === 3 ? bump(t, 5.1, 5.9) * 30 : 0, blink: blinkAt(T, d.seed) });
      });
      // the two sent: they step forward on v1, listen, then set off towards the village
      two.forEach((m) => {
        const step = es(t, 1.7, 2.0);
        const go = es(t, 6.35 + m.i * 0.08, 6.95 + m.i * 0.08, ease.in);
        const x0 = lerp(880 - 380 + m.i * 70, 880 + m.i * 70, arrive);
        const x = x0 + step * 14 + go * 520;
        const nod = bump(t, 6.1, 6.35);
        m.p.set({
          x, y: ROAD + 2 - m.i * 10, s: 0.94 - m.i * 0.04, flip: step > 0.4 && go < 0.02,
          walk: (t > 1 && t < 1.65) || (step > 0 && step < 1) || (go > 0 && go < 1) ? x * 0.05 + m.i : undefined,
          head: nod * 10 - bump(t, 3.2, 4.8) * 10, armF: bump(t, 1.72, 2.0) * 30 + (m.i === 0 ? bump(t, 2.3, 2.9) * 70 : 0),
          blink: blinkAt(T, m.seed), o: 1 - seg(t, 6.85, 6.99),
        });
      });

      /* v2a — "the village opposite you": the path draws itself, the village glows */
      const drawn = es(t, 2.2, 2.75);
      dots.forEach((d, i) => fade(d, drawn * dots.length > i ? 0.9 * (1 - es(t, 6.8, 7)) : 0));
      pose(vilGlow, { x: VX, y: VIL[1] - 20, s: 1, o: es(t, 2.3, 2.6) * (1 - es(t, 3.3, 3.8)) * 0.9 });

      /* v2b — the plate: a colt tied at the door, that no one has ever sat on */
      const down = es(t, 3.0, 3.5, ease.back) * (1 - es(t, 6.6, 7.0));
      swing(plateEl, 800, 250 - (1 - down) * 700, T, 1.3, 0.7);
      pose(pStar, { x: -2, y: 4 - bump(t, 3.4, 4.0) * 6, s: bump(t, 3.35, 4.0) * 1.2 + 0.001, r: t * 80, o: bump(t, 3.35, 4.0) });
      // v2c — untie it and bring it here
      const untie = es(t, 4.05, 4.35);
      const lead = es(t, 4.3, 4.9);
      const back = es(t, 6.2, 6.6);
      pose(pRope, { x: 19, y: 11, r: untie * 70, o: 1 - untie });
      const turn = lead > 0.02 && back < 0.5;
      pColt.set({
        x: -18 - lead * 26 + back * 26, y: 46, s: 0.32, flip: turn,
        walk: (lead > 0 && lead < 1) || (back > 0 && back < 1) ? t * 30 : undefined, amt: 0.8,
        nod: bump(t, 3.5, 3.9) * 8, ear: Math.sin(T * 1.6) * 6 * (1 - untie * 0.5),
      });
      fade(pArrow, es(t, 4.4, 4.7) * (1 - es(t, 6.1, 6.3)));

      /* v3 — "if anyone asks you why…" — "The Lord needs him" */
      const ask = es(t, 5.05, 5.45, ease.back) * (1 - es(t, 6.6, 6.9));
      swing(askEl, 1000, 250 - (1 - ask) * 700, T, 2.4, 1.1, 3);
      const [hx, hy] = headAt(jx, ROAD, 1, false);
      const say = es(t, 6.0, 6.25, ease.back) * (1 - es(t, 6.8, 7));
      pose(sayEl, { x: hx + 24, y: hy - 36, s: say, o: say > 0.02 ? 1 : 0 });

      S.cam.z = 1 + es(t, 0.3, 1.6) * 0.06 + es(t, 2.9, 3.5) * 0.04 - es(t, 6.3, 6.9) * 0.04;
      S.cam.x = es(t, 0.3, 1.6) * 30 + es(t, 2.1, 2.6) * 30 - es(t, 2.9, 3.4) * 30 + es(t, 6.3, 6.9) * 50;
      S.cam.y = es(t, 0.3, 1.6) * 20 - es(t, 2.9, 3.4) * 40 + es(t, 6.3, 6.9) * 20;
    };
  },
};
