// Łk 4,25–27 — two old stories as painted flats in a sepia frame. Israel in Elijah's day: a row of widows with
// empty jars; the sky is shut — two great painted shutters slide across the rain clouds and a bolt drops — for
// three years and six months: the earth cracks, the green goes brown, famine. Elijah is sent to none of them: he
// walks past them to the gate of Zarephath by the sea of Sidon, where one widow is gathering sticks, and her jar
// of flour and jug of oil glow. Then Elisha's day: lepers ringing their bells, grey, uncleansed — and Naaman the
// Syrian going down into the Jordan, seven times, and coming up clean.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, rock, olive, palm, grass, waterBand } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  DROUGHT, DAY, ELIJAH, ELISHA, NAAMAN, NAAMAN_CLEAN, SAREPTA, WIDOW, LEPER, storyFrame, figure, jar, jug, paperLabel, labelTag, hangAt,
  sparkle, village, headAt, tr, PI,
} from './lib.js';
import { bell } from '../mark1/lib.js';

const GY = 700;

export default {
  id: 'lk4-elijah',
  enter: 'fly',
  beats: [
    { v: 25, text: 'Naprawdę, mówię wam: Wiele wdów było w Izraelu za czasów Eliasza,' },
    { v: 25, cont: true, text: 'kiedy niebo pozostawało zamknięte przez trzy lata i sześć miesięcy, tak że wielki głód panował w całym kraju;' },
    { v: 26 },
    { v: 27, text: 'I wielu trędowatych było w Izraelu za proroka Elizeusza,' },
    { v: 27, cont: true, text: 'a żaden z nich nie został oczyszczony, tylko Syryjczyk Naaman».' },
  ],
  cam: { x: [-20, 420], y: [0, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    sky(S, DROUGHT);
    const skyB = sky(S, ['#cfe0d8', '#efe6cf', '#f6e9cf'], { name: 'jordan' }).layer;
    skyB.fade(0);
    const A = [], B = [];
    const L = (o, set) => { const Ly = S.layer(o); set.push(Ly); return Ly; };

    /* ================= set A: Israel in the drought ================= */
    const aHang = L({ par: 0.05, sh: 5 }, A);
    const rain = [[560, 250, 230], [860, 200, 250], [1180, 262, 200]].map(([x, y, w], i) => ({ x, y, i, el: hanging(aHang, cloud(c, w, mix(C.storm, C.cream, 0.35), mix(C.storm2, C.cream, 0.3)), { x, y, len: 700 }) }));
    const shutter = (dir) => {
      const s = sheet();
      const x0 = dir < 0 ? -1200 : 800, x1 = dir < 0 ? 800 : 2800;
      s.p(c.cut([[x0, -1200], [x1, -1200], [x1, 330], [x0, 330]], 1, 30), mix(C.sunDeep, C.sand2, 0.55));
      let pl = '';
      for (let x = x0 + 60; x < x1; x += 120) pl += c.ribbon([[x, -1200], [x + c.rr(-4, 4), 330]], 4);
      s.x(pl, shade(C.sunDeep, -0.15), 'opacity=".35"');
      s.p(c.cut([[x0, 310], [x1, 310], [x1, 336], [x0, 336]], 0.6, 20), shade(C.wood2, 0.1));
      let rv = '';
      for (let x = x0 + 30; x < x1; x += 60) rv += c.cut(c.circ(x, 323, 4, 8), 0.2, 3);
      s.x(rv, C.sun);
      return s.out();
    };
    const shutL = aHang.add(`<g>${shutter(-1)}</g>`);
    const shutR = aHang.add(`<g>${shutter(1)}</g>`);
    const bolt = aHang.add(`<g>${sheet().p(c.cut(c.rect(-90, -12, 180, 24), 0.4, 6), C.rock3).p(c.cut(c.rect(-20, -26, 40, 52), 0.4, 5), C.rock2).p(c.cut(c.circ(0, 0, 8, 10), 0.2, 3), C.soilDark).out()}</g>`);
    const sunEl = hanging(aHang, `<circle r="130" fill="url(#warm-glow)"/>${sun(c, 50, { rays: C.sunRay, disc: C.sunDeep, inner: C.sun })}`, { x: 1000, y: 200, len: 700 });
    const years = hanging(aHang, paperLabel(tr('3 lata i 6 miesięcy', '3 years and 6 months'), { size: 26 }), { x: 0, y: -1500, len: 600 });
    const aFar = L({ par: 0.12, sh: 2 }, A);
    aFar.add(band(c, { y: 470, amps: [16, 7, 3], lens: [900, 300, 110], color: mix(C.dune, C.hillFar, 0.4) }).markup);
    aFar.add(village(c, 300, 476, { n: 5, spread: 160, sc: 0.5 }) + village(c, 640, 470, { n: 4, spread: 120, sc: 0.45 }));
    // Zarephath by the sea of Sidon, on the right
    const sea = L({ par: 0.25, sh: 2 }, A);
    sea.add(waterBand(c, { y: 560, x0: 1080, x1: 2500, color: C.lake2, foamN: 10 }).markup);
    const gate = sheet();
    gate.p(c.cut(c.rect(1120, 470, 190, 200), 0.5, 8), mix(C.stone, C.sand, 0.3));
    gate.p(c.cut([[1180, 670], [1180, 560], ...c.arc(1215, 560, 35, 30, PI, 2 * PI, 8), [1250, 670]], 0.3, 5), C.soilDark);
    let crn = '';
    for (let x = 1120; x < 1310; x += 30) crn += c.cut(c.rect(x, 454, 18, 18), 0.2, 3);
    gate.p(crn, mix(C.stone, C.sand, 0.3));
    sea.add(PH ? `<g transform="translate(-100 0)">${gate.out() + palm(c, 1360, 680, 200)}</g>` : gate.out() + palm(c, 1360, 680, 200));   // phone: the gate of Zarephath stands inside the screen
    const zSign = hanging(sea, labelTag(tr('Sarepta Sydońska', 'Zarephath of Sidon'), 20), { x: 0, y: -1500, len: 600 });
    const aGround = L({ par: 0.5, sh: 3 }, A);
    const gfn = c.wave(GY - 40, [6, 3], [700, 200]);
    aGround.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand2, C.dune, 0.4)).out());
    const green = aGround.add(`<g>${grass(c, { x0: -500, x1: 2100, y: GY - 36, fn: gfn, n: 50, h: 16, color: C.olive })}</g>`);
    const dry = aGround.add(`<g opacity="0">${grass(c, { x0: -500, x1: 2100, y: GY - 36, fn: gfn, n: 50, h: 10, color: C.wood3 })}</g>`);
    let cr = '';
    for (let i = 0; i < 26; i++) { let x = c.rr(-300, 1900), y = c.rr(GY - 20, 900); const pts = [[x, y]]; for (let k = 0; k < 4; k++) { x += c.rr(14, 34); y += c.rr(-10, 10); pts.push([x, y]); } cr += c.ribbon(pts, 2.2); }
    const cracks = aGround.add(`<g opacity="0"><path d="${cr}" fill="${shade(C.dune, -0.35)}"/></g>`);
    const aPeople = L({ par: 0.5, sh: 5 }, A);
    const WV = [WIDOW, { ...WIDOW, veil: C.stone2, robe: mix(C.stone, C.mauve, 0.3) }, { ...WIDOW, veil: mix(C.storm, C.plumRobe, 0.3) }, { ...WIDOW, robe: mix(C.stone2, C.sageRobe, 0.3), veil: C.stone }, { ...WIDOW, skin: C.skin3 }];
    const widows = aPeople.add(`<g${PH ? ' transform="translate(55 0)"' : ''}>${WV.map((o, i) => figure(c, o, { x: 420 + i * 62, y: GY + (i % 2) * 8, s: 0.82, flip: false, armF: i % 2 ? 50 : 20, head: 8 })).join('')}${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${452 + i * 62} ${GY + 4 + (i % 2) * 8}) rotate(${i % 2 ? 80 : 0})">${jar(c, C.pot, 26)}</g>`).join('')}</g>`);
    const elijah = S.puppet(aPeople.add(person(c, { ...ELIJAH })));
    const sarepta = S.puppet(aPeople.add(person(c, { ...SAREPTA, pose: 'kneel', holdF: `<g transform="rotate(70)"><path d="${c.ribbon([[-20, 0], [24, 2]], 4)}" fill="${C.wood2}"/><path d="${c.ribbon([[-18, 8], [22, 6]], 4)}" fill="${C.wood}"/></g>` })));
    const store = aPeople.add(`<g><circle r="60" cy="-16" fill="url(#warm-glow)" data-k="lk4-el-glow"/><g transform="translate(-16 0)">${jar(c, C.plaster2, 30)}</g><g transform="translate(18 2) scale(.8)">${jug(c)}</g></g>`);
    const storeGlow = S.$('lk4-el-glow');
    const aSparks = [0, 1, 2].map(() => aPeople.add(`<g opacity="0">${sparkle(c, 10)}</g>`));

    /* ================= set B: Elisha's day, the Jordan ================= */
    const bFar = L({ par: 0.12, sh: 2 }, B);
    bFar.add(hillsWith(c, { y: 470, amps: [16, 7, 3], lens: [900, 300, 110], color: C.hillMid, trees: 22, treeColor: C.sage, treeH: 18 }).markup);
    const bGround = L({ par: 0.5, sh: 3 }, B);
    const hfn = c.wave(GY - 40, [6, 3], [700, 200]);
    bGround.add(sheet().p(c.ridge(hfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.35)).out());
    bGround.add(rock(c, 780, GY + 6, 140, 44, C.rock2) + olive(c, 250, GY - 20, 0.8));
    const bPeople = L({ par: 0.5, sh: 5 }, B);
    const LV = [LEPER, { ...LEPER, robe: mix(LEPER.robe, C.mauve, 0.2) }, { ...LEPER, hairStyle: 'veil', veil: '#a8a397', beard: 'none' }, { ...LEPER, robe: mix(LEPER.robe, C.sageRobe, 0.25) }];
    const lepers = bPeople.add(`<g>${LV.map((o, i) => figure(c, { ...o, holdF: `<g transform="translate(0 4)">${bell(c)}</g>` }, { x: 400 + i * 66, y: GY + (i % 2) * 8, s: 0.82, armF: 40 + (i % 2) * 20, head: 10 })).join('')}</g>`);
    const elisha = S.puppet(bPeople.add(person(c, { ...ELISHA })));
    const naaman = S.puppet(bPeople.add(person(c, { ...NAAMAN, pose: 'kneel' })));
    const clean = S.puppet(bPeople.add(person(c, { ...NAAMAN_CLEAN })));
    const river = L({ par: 0.52, sh: 3 }, B);
    const rfn = c.wave(GY + 6, [4, 2], [300, 90]);
    const rs = sheet().p(c.ridge(rfn, 900, 2500, 1700, 10, 0.8), mix(C.lake, C.lake2, 0.3));
    let fo = '';
    for (let x = 920; x < 1500; x += c.rr(40, 80)) fo += c.cut([[x, rfn(x) + 4], [x + 24, rfn(x) + 1], [x + 48, rfn(x) + 4], [x + 24, rfn(x) + 6]], 0.2, 6);
    rs.x(fo, C.foam, 'opacity=".8"');
    river.add(rs.out());
    // phone: the tall screen shows the river's straight left edge running down to the caption; a sloping bank closes it
    if (PH) river.add(sheet().p(c.cut([[892, GY + 2], [930, GY + 40], [990, GY + 120], [1050, GY + 260], [1090, 1700], [300, 1700], [520, GY + 240], [760, GY + 90]], 1, 12), mix(C.hillNear, C.sand, 0.35)).out());
    const counts = [1, 2, 3, 4, 5, 6, 7].map((k) => hanging(river, `<circle r="44" fill="url(#warm-glow)" opacity=".6"/>` + paperLabel(String(k), { size: 34, w: 44 }), { x: 0, y: -1500, len: 500 }));
    const splashes = [0, 1, 2].map(() => river.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 30, 14, PI, 2 * PI, 10), 4)}" fill="${C.foam}"/></g>`));
    const bSparks = [0, 1, 2, 3].map(() => river.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    const bTag = hanging(river, labelTag(tr('Jordan', 'the Jordan'), 20), { x: 0, y: -1500, len: 500 });

    storyFrame(S);

    return (t, time) => {
      const swap = es(t, 2.92, 3.12);
      A.forEach((Ly) => { Ly.fade(1 - swap); Ly.shift(0, -swap * 80); });
      B.forEach((Ly) => { Ly.fade(swap); Ly.shift(0, (1 - swap) * -80); });
      skyB.fade(swap);

      /* v25a: many widows in Israel in Elijah's day */
      rain.forEach((r) => swing(r.el, r.x + Math.sin(time * 0.1 + r.i) * 16, r.y - es(t, 1.1, 1.5) * 60, time, 1.2, 0.6, r.i));
      /* v25b: the sky shut, three years and six months, famine */
      const shut = es(t, 1.05, 1.4);
      pose(shutL, { x: -(1 - shut) * 2100 });
      pose(shutR, { x: (1 - shut) * 2100 });
      const bk = es(t, 1.38, 1.5, ease.in);
      pose(bolt, { x: 800, y: lerp(-400, 323, bk), o: bk > 0.01 ? 1 : 0 });
      swing(sunEl, 1000, 200, time, 1, 0.6);
      const yk = es(t, 1.5, 1.75, ease.back) * (1 - es(t, 2.9, 3.0));
      hangAt(years, PH ? 690 : 560, lerp(-500, 420, yk), time, 1.4, 0.8);
      const drought = es(t, 1.5, 1.9);
      pose(green, { o: 1 - drought });
      pose(dry, { o: drought });
      pose(cracks, { o: drought });

      /* v26: Elijah is sent to none of them, only to the widow of Zarephath */
      const go = es(t, 2.08, 2.75);
      const ex = lerp(820, 1080, go);
      elijah.set({ x: ex, y: GY + 4, s: 0.92, flip: false, walk: go > 0 && go < 1 ? ex * 0.05 : undefined, armF: 14 + es(t, 2.7, 2.9) * 40, head: bump(t, 0.3, 0.9) * -6, blink: blinkAt(time, 2) });
      const meet = es(t, 2.6, 2.85);
      sarepta.set({ x: 1190, y: GY + 10, s: 0.9, flip: true, armF: 50 + meet * 30, armB: 20 + meet * 50, head: 10 - meet * 18, blink: blinkAt(time, 4) });
      pose(store, { x: 1240, y: GY + 14 });
      fade(storeGlow, meet);
      aSparks.forEach((sp, i) => { const k = bump(t, 2.65 + i * 0.08, 3.0); pose(sp, { x: 1226 + i * 18, y: GY - 40 - (i % 2) * 20, s: k, r: time * 50, o: k }); });
      const zk = es(t, 2.1, 2.4, ease.back);
      hangAt(zSign, PH ? 1115 : 1215, lerp(-500, 420, zk), time, 1.3, 0.8, 2);

      /* v27a: many lepers in Israel in Elisha's day */
      elisha.set({ x: PH ? 815 : 790, y: GY - 8, s: 0.92, flip: false, armF: 14 + es(t, 4.1, 4.3) * 60, armB: 10, head: 4, blink: blinkAt(time, 6) });
      pose(lepers, { x: PH ? 105 : 0 });
      /* v27b: none cleansed but Naaman the Syrian — seven times in the Jordan */
      const nx = 1060;
      const dips = seg(t, 4.08, 4.62) * 7;
      const dip = t > 4.08 && t < 4.62 ? Math.sin((dips % 1) * PI) : 0;
      const up = es(t, 4.64, 4.7);
      const nIn = es(t, 3.9, 4.08);
      naaman.set({ x: nx + (1 - nIn) * 200, y: GY + 30 + dip * 70, s: 0.92, flip: true, o: nIn * (1 - up), walk: nIn > 0 && nIn < 1 ? t * 30 : undefined, armF: 60, armB: 40, head: 10, blink: blinkAt(time, 7) });
      const joy = es(t, 4.7, 4.9);
      clean.set({ x: nx, y: GY + 24, s: 0.92, flip: true, o: up, armF: 60 + joy * 40, armB: 60 + joy * 100, head: -joy * 10, blink: blinkAt(time, 7) });
      const n = Math.min(7, Math.floor(dips) + (t >= 4.62 ? 1 : 0));
      const ck = es(t, 4.05, 4.2, ease.back);
      counts.forEach((el, i) => pose(el, { x: PH ? 1105 : 1180, y: lerp(-500, 460, ck), r: Math.sin(time * 1) * 1.5, oy: 0, o: ck > 0.01 && i === Math.max(1, n) - 1 ? 1 : 0 }));
      splashes.forEach((sp, i) => { const k = t > 4.08 && t < 4.66 ? ((dips + i / 3) % 1) : 0; pose(sp, { x: nx - 10 + i * 10, y: GY + 10, s: 0.6 + k, o: k > 0 ? (1 - k) * 0.9 : 0 }); });
      bSparks.forEach((sp, i) => { const k = bump(t, 4.68 + i * 0.05, 5.0); pose(sp, { x: nx - 40 + i * 28, y: GY - 150 - (i % 2) * 40, s: k, r: time * 50, o: k }); });
      const bt = es(t, 3.1, 3.4, ease.back);
      hangAt(bTag, PH ? 960 : 1250, lerp(-500, PH ? 790 : 560, bt), time, 1.3, 0.8, 5);

      S.cam.x = es(t, 2.0, 2.7) * (S.portrait ? 400 : 110) * (1 - swap) + swap * es(t, 3.9, 4.3) * 80;
      S.cam.y = 20;
      S.cam.z = 1.02 + es(t, 1.0, 1.4) * -0.02 + es(t, 3.9, 4.3) * 0.04;
    };
  },
};
