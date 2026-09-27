// J 15,15–17 — "No longer do I call you servants, for the servant does not know what his master does": a picture hangs
// down — a servant with an apron and a tray waits outside a shut door, puzzled; and the eleven, too, stand in
// servants' aprons. "But I have called you friends, for all that I heard from My Father I have made known to you":
// the door in the picture opens on Jesus at a lit table, welcoming him in; the aprons fly off the eleven, light comes
// down from above into Jesus and His words go out to them. "You did not choose Me, but I chose you": a ray from His hand
// finds each one in turn. "And appointed you that you should go and bear fruit, and your fruit should remain": roads open
// out from the vineyard over the hills, a bunch of grapes comes into every hand and turns to gold. "Whatever you ask the
// Father in My name": little lights sealed with His seal rise to the light, and light falls softly back on them all.
// "This I command you: love one another": one garland of light runs from hand to hand through them all.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableau, placeM, lampsAll, framed, question, apron, person, roadStrip, radiance, lightCone, bunch, GRAPE, sparkle, heartLight, threads,
  lightPath, drawPath, vis, kf, pose, attr, lerp, blinkAt, mix, shade, sheet, tr, C, P, PI, JESUS, WARMNIGHT, NIGHT,
} from './lib.js';

export default {
  id: 'j15-chosen',
  beats: [
    { v: 15, text: 'Już was nie nazywam sługami, bo sługa nie wie, co czyni pan jego,' },
    { v: 15, cont: true, text: 'ale nazwałem was przyjaciółmi, albowiem oznajmiłem wam wszystko, co usłyszałem od Ojca mego.' },
    { v: 16, text: 'Nie wyście Mnie wybrali, ale Ja was wybrałem' },
    { v: 16, cont: true, text: 'i przeznaczyłem was na to, abyście szli i owoc przynosili, i by owoc wasz trwał -' },
    { v: 16, cont: true, text: 'aby wszystko dał wam Ojciec, o cokolwiek Go poprosicie w imię moje.' },
    { v: 17 },
  ],
  cam: { x: [-40, 40], y: [-100, 60], z: [0.96, 1.3] },
  build(S) {
    const c = S.c;
    const tb = tableau(S, { skyCols: WARMNIGHT, vine: false, before: () => {
      const upL = S.layer({ par: 0.1, sh: 0, flat: true });
      const cone = upL.add(`<g>${lightCone(c, { w0: 60, w1: 300, h: 720, o: 0.2 })}</g>`);
      const rad = upL.add(`<g><circle r="220" fill="url(#halo-glow)"/>${radiance(c, 56)}</g>`);
      // the roads going out from the vineyard over the hills
      const rL = S.layer({ par: 0.3, sh: 2 });
      const roads = [[560, 606, -560, -170], [680, 604, -230, -150], [920, 604, 230, -150], [1040, 606, 560, -170], [800, 604, 0, -140]].map(([x, y, dx, dy]) => ({ el: rL.add(`<g opacity=".85">${roadStrip(c, dx, dy, 50, 8, mix(C.sand, C.halo, 0.35))}</g>`), x, y }));
      return { cone, rad, roads };
    } });
    const { ms, jesus, JX, JY } = tb;
    const { cone, rad, roads } = tb.pre;
    const fx = S.layer({ par: P, sh: 4 });
    const aprons = ms.map(() => fx.add(`<g>${apron(c)}</g>`));
    const glows = ms.map(() => fx.add(`<g><circle r="46" fill="url(#halo-glow)"/>${sparkle(c, 12)}</g>`));
    const fruits = ms.map(() => fx.add(`<g><circle cy="14" r="22" fill="url(#halo-glow)" opacity=".6"/><g class="pur">${bunch(c, 3.8, GRAPE)}</g><g class="gold" opacity="0">${bunch(c, 3.8, C.sun)}</g></g>`));
    const fruitGold = fruits.map((el) => el.querySelector('.gold'));
    const slips = ms.map(() => fx.add(`<g><circle r="14" fill="url(#warm-glow)" opacity=".8"/>${sheet().p(c.cut([[-10, -5], [10, -6], [11, 5], [-10, 6]], 0.4, 5), C.cream).x(c.ribbon([[-6, 0], [6, 0]], 1.3), C.inkSoft, 'opacity=".5"').out()}</g>`));
    const seals = ms.map(() => fx.add(`<g><circle r="16" fill="url(#warm-glow)"/><path d="${c.cut(c.star(0, 0, 8, 6, 10, 0), 0.2, 2)}" fill="${C.sun}"/><path d="${c.poly(c.star(0, 0, 4, 1.6, 5, 0))}" fill="${C.star}"/></g>`));
    const rain = Array.from({ length: 22 }, (_, i) => ({ el: fx.add(`<g>${sparkle(c, 8)}</g>`), x: 440 + ((i * 37) % 720), ph: (i * 0.29) % 1 }));
    const thL = S.layer({ par: P, sh: 0, flat: true });
    const ray = threads(thL, 1, { color: C.halo, w: 3 });
    const garlandEl = thL.add(`<g>${lightPath('M0 0L1 0', { w: 3.4, col: C.halo })}</g>`);
    const gPath = garlandEl.firstElementChild;
    // the picture: a servant outside a shut door; the door opens on Jesus at a lit table
    const PW = 440, PH = 230;
    const hangL = S.layer({ par: 0.12, sh: 6 });
    const doorX = 250, doorW = 90, doorH = 150, fl = PH - 24;
    const inner = `<rect x="0" y="0" width="${PW}" height="${PH}" fill="${mix(C.plaster, C.plaster2, 0.4)}"/>`
      + `<path d="${c.cut(c.rect(0, fl, PW, 24), 0.4, 8)}" fill="${mix(C.wood3, C.sand2, 0.4)}"/>`
      + `<rect x="${doorX}" y="${fl - doorH}" width="${doorW + 150}" height="${doorH}" fill="${C.lampGlow}"/>`
      + `<circle cx="${doorX + 110}" cy="${fl - 90}" r="120" fill="url(#warm-glow)"/>`
      + `<path d="${c.cut(c.rect(doorX + 70, fl - 50, 110, 12), 0.3, 5) + c.cut(c.rect(doorX + 80, fl - 40, 8, 40), 0.2, 4) + c.cut(c.rect(doorX + 164, fl - 40, 8, 40), 0.2, 4)}" fill="${C.wood2}"/>`
      + `<g data-k="pj">${person(c, { ...JESUS })}</g>`
      + `<g data-k="facade"><path d="${c.cut(c.rect(doorX - 10, -10, PW - doorX + 20, fl - doorH + 10), 0.3, 6) + c.cut(c.rect(doorX + doorW, fl - doorH - 2, PW - doorX - doorW + 10, doorH + 4), 0.3, 6)}" fill="${mix(C.plaster, C.plaster2, 0.6)}"/>`
      + `<path d="${c.ribbon([[doorX + doorW + 20, 30], [PW, 30]], 2) + c.ribbon([[doorX + doorW + 20, 110], [PW, 110]], 2)}" fill="${C.plaster2}" opacity=".6"/>`
      + `<path d="${c.cut(c.rect(doorX - 6, fl - doorH - 8, doorW + 12, 8), 0.3, 4)}" fill="${C.wood2}"/>`
      + `<rect x="${doorX}" y="${fl - doorH}" width="${doorW}" height="${doorH}" fill="${C.soilDark}" opacity=".5"/>`
      + `<g data-k="door"><path d="${c.cut(c.rect(0, 0, doorW, doorH), 0.4, 6)}" fill="${C.wood}"/><path d="${c.ribbon([[doorW * 0.33, 6], [doorW * 0.33, doorH - 6]], 2) + c.ribbon([[doorW * 0.66, 6], [doorW * 0.66, doorH - 6]], 2)}" fill="${C.wood2}"/><circle cx="${doorW - 14}" cy="${doorH / 2}" r="4" fill="${C.sun}"/></g></g>`
      + `<g data-k="ps">${person(c, { robe: C.stone2, hair: C.hair3, hairStyle: 'short', beard: 'none', skin: C.skin3, belt: C.leather, holdF: `<g transform="rotate(-60)"><path d="${c.cut(c.ell(0, 2, 22, 4, 12), 0.3, 3)}" fill="${C.pot}"/></g>` })}</g>`
      + `<g data-k="pa">${apron(c)}</g>`
      + `<g data-k="pq">${question(c)}</g>`;
    const plate = hangL.add(`<g>${framed(S, inner, { w: PW, h: PH, rim: C.wood3 })}</g>`);
    const pj = S.puppet(plate.querySelector('[data-k="pj"]').firstElementChild);
    const ps = S.puppet(plate.querySelector('[data-k="ps"]').firstElementChild);
    const pa = plate.querySelector('[data-k="pa"]'), pq = plate.querySelector('[data-k="pq"]'), door = plate.querySelector('[data-k="door"]'), facade = plate.querySelector('[data-k="facade"]');
    tb.set.front();

    const hand = (m, x = m.x) => [x + (m.flip ? -34 : 34) * m.s, m.y - 118 * m.s];
    // the order in which He turns to them: left side from the middle outwards, then the right side
    const CHOOSE = ['john', 'simonZ', 'peter', 'nathanael', 'andrew', 'philip', 'james', 'jamesA', 'thomas', 'thaddaeus', 'matthew'];
    return (t, time) => {
      const T = time;
      tb.set.update(T);
      /* the picture */
      const pk = es(t, 0.05, 0.35, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      vis(plate, { x: 800, y: 108 - (1 - pk) * 620 + (T ? Math.sin(T * 0.9) * 2 : 0), o: pk > 0.001 ? 1 : 0 });
      if (pk > 0.001) {
        const open = es(t, 1.08, 1.25), rise = es(t, 1.22, 1.5, ease.in), inK = es(t, 1.4, 1.8);
        pose(door, { x: doorX, y: fl - doorH, sx: 1 - open * 0.85 });
        pose(facade, { y: -rise * (PH + 20) });
        ps.set({ x: lerp(150, doorX + 60, inK), y: fl, s: 0.62, walk: inK > 0 && inK < 1 ? inK * 16 : undefined, armF: 60 * (1 - es(t, 1.35, 1.45)), head: -4 });
        pj.set({ x: doorX + 140, y: fl, s: 0.62, flip: true, armF: bump(t, 1.2, 1.9) * 90 + es(t, 1.7, 1.9) * 60, armB: bump(t, 1.2, 1.9) * 60 });
        pose(pa, { x: lerp(150, doorX + 60, inK) + es(t, 1.2, 1.45) * 20, y: fl - es(t, 1.2, 1.45) * 130, r: es(t, 1.2, 1.45) * 60, s: 0.62, o: 1 - es(t, 1.3, 1.45) });
        pose(pq, { x: 170, y: fl - 140 + (T ? Math.sin(T * 2) * 2 : 0), s: 0.8, o: es(t, 0.3, 0.45) * (1 - es(t, 1.1, 1.25)) });
      }
      /* the Father's light */
      const fa = bump(t, 1.05, 2.0) + bump(t, 4.05, 5.0);
      vis(rad, { x: 800, y: 128, s: 1 + (T ? Math.sin(T * 1.3) * 0.02 : 0), o: Math.min(1, fa * 1.4) });
      vis(cone, { x: 800, y: 128, o: Math.min(1, fa * 1.2) });
      /* v16a — He chooses each in turn */
      const ch = seg(t, 2.1, 2.9);
      const ci = Math.min(10, Math.floor(ch * 11));
      const cm = ms.find((m) => m.k === CHOOSE[ci]);
      const pointing = ch > 0 && ch < 1;
      const faceLeft = pointing && cm.x < JX;
      /* v17 — draw close for the garland */
      const draw = es(t, 5.05, 5.4);
      jesus.set({ x: JX, y: JY, s: 1.05, flip: faceLeft, armF: bump(t, 0.05, 0.9) * 50 + bump(t, 1.1, 1.95) * 90 + (pointing ? 80 : 0) + bump(t, 3.1, 3.9) * 60 + draw * 70,
        armB: bump(t, 1.1, 1.95) * 110 + bump(t, 4.1, 4.9) * 120 + draw * 90, head: -bump(t, 4.1, 4.9) * 10, blink: blinkAt(T, 1) });
      
      const pts = [];
      ms.forEach((m, i) => {
        const x = lerp(m.x, 800 + (m.x - 800) * 0.85, draw);
        const [hx, hy] = hand(m, x);
        /* aprons on — then off */
        const off = es(t, 1.15 + (i % 4) * 0.04, 1.45 + (i % 4) * 0.04, ease.in);
        vis(aprons[i], { x: m.x + off * (m.flip ? 60 : -60), y: m.y - off * 260, sx: (m.flip ? -1 : 1) * m.s, sy: m.s, s: m.s, r: off * (m.flip ? -50 : 50), o: es(t, 0.02, 0.12) * (1 - off) });
        /* words made known */
        const w = es(t, 1.45 + i * 0.03, 1.8 + i * 0.03);
        vis(slips[i], { x: lerp(JX, hx, w), y: lerp(JY - 190, m.y - 150 * m.s, w) - Math.sin(w * PI) * 60, r: (1 - w) * 20, o: w > 0 && w < 1 ? 1 : 0 });
        /* chosen */
        const ord = CHOOSE.indexOf(m.k);
        const gk = es(t, 2.1 + (ord / 11) * 0.8, 2.2 + (ord / 11) * 0.8);
        vis(glows[i], { x, y: m.y - 150 * m.s, s: 0.7 + bump(t, 2.1 + (ord / 11) * 0.8, 2.4 + (ord / 11) * 0.8) * 0.6, r: T * 20, o: gk * (1 - es(t, 3.0, 3.3) * 0.7) * (1 - draw) });
        /* fruit in every hand, turning gold */
        const fk = es(t, 3.2 + i * 0.03, 3.4 + i * 0.03, ease.back);
        vis(fruits[i], { x: hx, y: hy + 4, s: fk * m.s * 1.1, o: fk > 0.01 ? 1 : 0 });
        attr(fruitGold[i], 'opacity', es(t, 3.6 + i * 0.02, 3.8 + i * 0.02));
        /* sealed prayers rise */
        const up = seg(t, 4.2 + (i % 4) * 0.05, 4.72 + (i % 4) * 0.05);
        vis(seals[i], { x: lerp(hx, 800 + (hx - 800) * 0.2, ease.io(up)), y: lerp(hy - 30, 150, ease.io(up)), s: 1 - up * 0.3, o: up > 0 && up < 1 ? 1 : 0 });
        const lift = bump(t, 4.1, 4.95);
        placeM(m, T, { x, walk: draw > 0 && draw < 1 ? draw * 14 + i : undefined, head: -es(t, 0.1, 0.4) * 12 * (1 - es(t, 2, 2.2)) + (m.k === cm?.k && pointing ? -8 : 0) - lift * 12,
          armF: fk * 60 * (1 - draw * 0.2) + lift * 20 + draw * 15 });
        pts.push([hx, hy]);
      });
      /* the roads open */
      roads.forEach((r, j) => vis(r.el, { x: r.x, y: r.y, s: es(t, 3.1 + j * 0.06, 3.5 + j * 0.06), o: es(t, 3.1, 3.2) * (1 - es(t, 5.0, 5.3) * 0.5) }));
      /* light falls back on them all */
      rain.forEach((r) => { const u = T ? (T * 0.25 + r.ph) % 1 : r.ph; vis(r.el, { x: r.x + Math.sin(u * 8) * 8, y: 180 + u * 420, s: 0.8, o: bump(t, 4.55, 5.05) * Math.sin(u * PI) }); });
      /* v17 — one garland of light through all their hands */
      const gk = es(t, 5.2, 5.6);
      if (gk > 0) {
        // one closed loop through every hand: the front row (and His hand) left→right, the back row right→left
        const front = ms.filter((m) => m.s > 0.85).map((m) => pts[m.i]).concat([[JX + 40, JY - 128]]).sort((a, b) => a[0] - b[0]);
        const back = ms.filter((m) => m.s < 0.85).map((m) => pts[m.i]).sort((a, b) => b[0] - a[0]);
        const loop = front.concat(back);
        const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        let d = 'M' + mid(loop[loop.length - 1], loop[0]).map((v) => v.toFixed(0)).join(' ');
        loop.forEach((p, i) => { const q = mid(p, loop[(i + 1) % loop.length]); d += `Q${p[0].toFixed(0)} ${(p[1] + 4).toFixed(0)} ${q[0].toFixed(0)} ${q[1].toFixed(0)}`; });
        attr(gPath, 'd', d);
        drawPath(gPath, gk);
        pose(garlandEl, { o: 1 });
      } else pose(garlandEl, { o: 0 });
      lampsAll(ms, 0.8 + gk * 0.2);
      S.cam.y = kf(t, [[0, -60], [1, -60], [2, -40], [2.2, 10], [3, 10], [3.3, -30], [4, -30], [4.3, -60], [5, -40], [5.5, 10], [6, 10]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [2, 1.02], [2.2, 1.1], [3, 1.1], [3.3, 0.98], [4, 1.0], [5, 1.0], [5.6, 1.14], [6, 1.14]]);
    };
  },
};
