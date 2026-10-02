// Mt 20,17–19 — going up to Jerusalem at sunset. Pilgrims stream on along the road towards the city on its hill,
// where a great low sun hangs behind the walls. Jesus stops and takes the Twelve aside. "Behold, we are going up to
// Jerusalem" — he points, and the city glows. Then, on the skyline against the sun, a shadow play: the Son of Man
// (a thin ring for his halo) is handed over to chief priests and scribes coming out of the gate; they condemn him —
// a hand raised, the sun reddens; he is handed to the Gentiles, helmets and spears: a reed, a crown of thorns, a
// whip's shadow — and a cross stands on the hill as the sun goes down and night falls. Three nights pass (three small
// moons), and on the third day the sun rises again, rays breaking out: the cross is empty, and he stands in the light.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, stars, moon as moonCut, olive, cypress, bush, rock, grass } from '../../assets/nature.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { TWELVE, INK, bigSun, walledCity, shadowPerson, addToHead, priestHat, helmet, thornCrown, whip, pharisee, man, hillCross, spear, reed, rays, mob, slip, tr, makeCutter } from './lib.js';

const GY = 700, JX = 700;
const SUN = [900, 372];            // the great sun behind the city
const RIDGE = 452;                 // the skyline the shadow figures stand on
const SS = 0.54;                   // their scale

export default {
  id: 'mt20-ascent',
  beats: [
    { v: 17 },
    { v: 18, text: '«Oto idziemy do Jerozolimy:' },
    { v: 18, cont: true, text: 'tam Syn Człowieczy zostanie wydany arcykapłanom i uczonym w Piśmie.' },
    { v: 18, cont: true, text: 'Oni skażą Go na śmierć' },
    { v: 19, text: 'i wydadzą Go poganom na wyszydzenie, ubiczowanie i ukrzyżowanie;' },
    { v: 19, cont: true, text: 'a trzeciego dnia zmartwychwstanie».' },
  ],
  cam: { x: [-60, 80], y: [-60, 20], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const EVE = ['#c3a1a7', '#f0bd8c', '#f7d8a6'];
    sky(S, EVE);
    const nightL = sky(S, ['#2c2f55', '#4f4a72', '#8d6f7f'], { name: 'night' }).layer;
    const dawnL = sky(S, ['#e9cfa8', '#fbe3b4', '#fdf0d2'], { name: 'dawn' }).layer;
    nightL.fade(0); dawnL.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 430, n: 90 }));
    starL.fade(0);

    /* the great sun (it sinks, and rises again) */
    const sunL = S.layer({ par: 0.06, sh: 1, flat: true });
    const sunEl = sunL.add(`<g>${bigSun(S, 190)}</g>`);
    const redEl = sunL.add(`<g><circle r="176" fill="${C.sunRay}" opacity=".55"/></g>`);
    const rayEl = sunL.add(`<g>${rays(c, { n: 26, r0: 170, r1: 1100, spread: 0.04, color: '#fff3cf' })}</g>`);
    const MOONS = [0, 1, 2].map((i) => ({ i, el: sunL.add(`<g><circle r="46" fill="url(#halo-glow)" opacity=".5"/>${moonCut(c, 20)}</g>`), tag: sunL.add(`<g>${slip(c, String(i + 1), { size: 16, w: 28 })}</g>`) }));

    /* the far hill, the city, the shadow players on the skyline */
    const farL = S.layer({ par: 0.1, sh: 2 });
    const fb = band(c, { y: RIDGE, amps: [5, 2, 1], lens: [900, 300, 120], color: mix(C.hillFar, C.dusk, 0.25) });
    const cityEl = farL.add(`<g><circle cx="1090" cy="${RIDGE - 40}" r="110" fill="url(#halo-glow)" class="cg"/>${walledCity(c, 1090, RIDGE + 6, 0.62)}</g>`);
    const cityGlow = cityEl.querySelector('.cg');
    farL.add(fb.markup);
    const sh = S.layer({ par: 0.1, sh: 1, flat: true });
    const ringHalo = `<path d="${c.ribbon(c.arc(0, 0, 30, 30, 0, Math.PI * 2, 30), 2.6)}" fill="${INK}"/>`;
    const sonEl = sh.add(addToHead(shadowPerson(c, { ...CAST.jesus, halo: false }), ringHalo + `<g class="thorns" opacity="0" transform="translate(0 -14)">${thornCrown(c, 22, INK)}</g>`));
    const son = S.puppet(sonEl);
    const thorns = sonEl.querySelector('.thorns');
    const priests = [0, 1, 2].map((i) => { const el = sh.add(addToHead(shadowPerson(c, pharisee(c, i)), i < 2 ? priestHat(c, INK) : '')); return { i, el, p: S.puppet(el) }; });
    const soldiers = [0, 1].map((i) => { const el = sh.add(addToHead(shadowPerson(c, { ...man(c, { beard: 'short' }), holdF: '' }), helmet(c, INK))); return { i, el, p: S.puppet(el), sp: sh.add(`<g>${i ? reed(c) : spear(c)}</g>`) }; });
    const whipEl = sh.add(`<g>${whip(c, INK)}</g>`);
    const crossEl = sh.add(`<g>${hillCross(c)}</g>`);
    const risenEl = sh.add(person(c, { ...CAST.jesus, robe: '#fffaf0', mantle: '#fbe3b0' }));
    const risen = S.puppet(risenEl);
    const risenGlow = sh.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    const jerTag = sh.add(`<g>${slip(c, tr('Jerozolima', 'Jerusalem'), { size: 20 })}</g>`);

    /* the near land and the road up */
    const midL = S.layer({ par: 0.2, sh: 3 });
    midL.add(hillsWith(c, { y: 540, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.dune, 0.3), trees: 12, treeColor: C.olive, treeH: 20 }).markup);
    const G = S.layer({ par: 0.35, sh: 3 });
    const gfn = c.wave(606, [5, 2], [700, 170]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.dune, 0.3)).out());
    const road = [];
    for (let i = 0; i <= 20; i++) { const u = i / 20; road.push([lerp(300, 1500, u), lerp(760, 616, Math.pow(u, 0.8)) + Math.sin(u * 6) * 8]); }
    G.add(sheet().p(c.ribbon(road, (u) => 90 - u * 60), mix(C.sand2, C.dune, 0.15)).out());
    G.add(olive(c, 250, 640, 0.9) + cypress(c, 1330, 612, 110) + cypress(c, 1370, 610, 90) + grass(c, { x0: -300, x1: 1900, y: 610, fn: gfn, n: 26, h: 12, color: C.olive }));

    /* the pilgrims going on ahead, Jesus and the Twelve */
    const P = S.layer({ par: 0.5, sh: 5 });
    const pilgrims = [0, 1].map((i) => P.sprite(mob(makeCutter('mt20-pilgrims' + i), 5, { s: 0.62 - i * 0.08, spread: 40, rows: 2, arms: 10 }), 700 + i * 160, 660 - i * 18));
    const RING = [[500, GY - 20], [560, GY - 34], [620, GY - 42], [800, GY - 42], [860, GY - 34], [920, GY - 20], [470, GY + 14], [545, GY + 22], [880, GY + 22], [950, GY + 12], [610, GY + 34], [800, GY + 34]];
    // phone: the ring of the Twelve drawn a little closer, so the outermost stay whole at the left edge
    const dis = TWELVE.map((d, i) => ({ i, p: S.puppet(P.add(person(c, d.o))), at: S.portrait ? [JX + 8 + (RING[i][0] - JX) * 0.86, RING[i][1]] : RING[i], seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 170, 1010, 230, C.olive, C.moss) + rock(c, 1460, 1000, 210, 70, C.rock2));

    const ry = (x) => fb.fn(x) + 2;
    return (t, time) => {
      const T = time;
      /* light: evening → the sun reddens (3) → sets, night (4) → three nights → dawn (5) */
      const set = es(t, 4.35, 4.8);
      const rise = es(t, 5.45, 5.75);
      nightL.fade(set * (1 - rise));
      starL.fade(set * (1 - rise));
      dawnL.fade(rise);
      pose(sunEl, { x: SUN[0], y: SUN[1] + set * 330 * (1 - rise) - rise * 30, s: 1 - set * 0.1 + rise * 0.1 });
      pose(redEl, { x: SUN[0], y: SUN[1] + set * 330 * (1 - rise) - rise * 30, o: es(t, 3.1, 3.5) * (1 - rise) });
      pose(rayEl, { x: SUN[0], y: SUN[1] - 30, r: t * 6, o: rise * 0.8 });
      MOONS.forEach((m) => {
        const k = seg(t, 5.0 + m.i * 0.14, 5.16 + m.i * 0.14);
        pose(m.el, { x: lerp(560, 1160, k), y: 330 - Math.sin(k * Math.PI) * 170, o: k > 0 && k < 1 ? 1 : 0 });
        pose(m.tag, { x: 800 + m.i * 60, y: 170, o: es(t, 5.08 + m.i * 0.14, 5.16 + m.i * 0.14) * (1 - rise) });
      });

      /* v18a — Jerusalem glows */
      const jer = es(t, 1.05, 1.3);
      pose(cityGlow, { o: 0.3 + jer * 0.7 * (1 - es(t, 4.4, 4.7)) + rise * 0.5 });
      if (S.portrait) pose(cityEl, { x: -70 });   // phone: the city and its slip come in from under the progress thread
      pose(jerTag, { x: S.portrait ? 1005 : 1090, y: lerp(-200, 300, es(t, 1.1, 1.35, ease.back)) - es(t, 1.9, 2.1) * 500, r: Math.sin(T) * 2, o: t > 1.1 && t < 2.1 ? 1 : 0 });

      /* the shadow play */
      const on = es(t, 2.02, 2.2);
      const led = es(t, 2.3, 2.7);
      const toG = es(t, 4.05, 4.3);
      const sx = lerp(740, 850, led) + toG * 30;
      const bowed = es(t, 3.2, 3.5);
      son.set({ x: sx, y: ry(sx), s: SS, walk: (led > 0 && led < 1) || (toG > 0 && toG < 1) ? sx * 0.1 : undefined, head: 6 + bowed * 14, lean: bowed * 6, o: on * (1 - es(t, 4.5, 4.62)) });
      fade(thorns, es(t, 4.2, 4.3));
      priests.forEach((pr) => {
        const x = lerp(1060, 910 + pr.i * 58, es(t, 2.1 + pr.i * 0.06, 2.4 + pr.i * 0.06)) + toG * 140;
        const judge = pr.i === 0 ? es(t, 3.05, 3.2) * (1 - toG) : 0;
        pr.p.set({ x, y: ry(x), s: SS, flip: toG < 0.5, walk: (t > 2.1 && t < 2.5) || (toG > 0 && toG < 1) ? x * 0.1 : undefined, armF: 30 + led * 40 * (1 - judge) + judge * 110, armB: judge * 60, o: es(t, 2.1, 2.2) * (1 - es(t, 4.1, 4.25)) });
      });
      soldiers.forEach((so) => {
        const x = lerp(1100 + so.i * 60, 924 + so.i * 70, es(t, 4.05, 4.3));
        const lash = so.i === 0 ? bump(t, 4.2, 4.4) : 0;
        so.p.set({ x, y: ry(x), s: SS, flip: true, walk: t > 4.05 && t < 4.3 ? x * 0.1 : undefined, armF: 40 + lash * 80, o: es(t, 4.05, 4.15) * (1 - es(t, 4.5, 4.62)) });
        pose(so.sp, { x: x - 14 * SS * 2, y: ry(x) - 100 * SS * 2 + 30, s: SS * 1.6, o: es(t, 4.05, 4.15) * (1 - es(t, 4.5, 4.62)) });
      });
      pose(whipEl, { x: 930, y: ry(930) - 40, s: 0.7, r: -40 + bump(t, 4.2, 4.42) * 60, o: bump(t, 4.18, 4.44) });
      const cr = es(t, 4.45, 4.62);
      pose(crossEl, { x: 870, y: ry(870) + 4 + (1 - cr) * 40, s: 0.8, o: cr });
      const up = es(t, 5.55, 5.75);
      risen.set({ x: 870, y: ry(870) - 26 - (1 - up) * 20, s: 0.48, o: up, armF: 90, armB: 150, head: -8 });
      pose(risenGlow, { x: 870, y: ry(870) - 80, s: 0.8 + up * 0.5, o: up });

      /* the road: pilgrims go on; Jesus stops and takes the Twelve aside */
      const walk = es(t, -0.3, 0.55, ease.sine);
      pilgrims.forEach((sp, i) => { const x = lerp(700 + i * 160, 1260 + i * 120, es(t, -0.3, 0.9)); sp.set({ x, y: 660 - i * 18 - (x - 700) * 0.08, s: 1 - es(t, -0.3, 0.9) * 0.2, o: 1 - es(t, 0.7, 0.95) }); });
      const jx = lerp(560, JX, walk);
      const aside = es(t, 0.45, 0.75);
      const point = es(t, 1.04, 1.2) * (1 - es(t, 1.9, 2.05));
      const look = es(t, 2.0, 2.3);
      const grief = es(t, 3.1, 3.4) * (1 - rise);
      jesus.set({ x: jx, y: GY, s: 1.02, flip: aside > 0.5 && point < 0.5 && look < 0.5, walk: walk > 0 && walk < 1 ? jx * 0.05 : undefined, armF: 14 + aside * 30 * (1 - point) + point * 110 + rise * 40, armB: point * 30 + rise * 80, head: -point * 10 - look * 8 + grief * 12 - rise * 6, blink: blinkAt(T) });
      dis.forEach((d) => {
        const trail = [jx - 70 - (d.i % 6) * 44, GY + (d.i < 6 ? -24 : 16)];
        const x = lerp(trail[0], d.at[0], aside), y = lerp(trail[1], d.at[1], aside);
        const walking = (walk > 0 && walk < 1) || (aside > 0 && aside < 1);
        d.p.set({ x, y, s: 0.9 + (y - GY) / 500, flip: aside > 0.5 && x > jx, walk: walking ? x * 0.05 + d.i : undefined, armF: 14 + grief * (d.i % 2 ? 50 : 10) + rise * (d.i % 3 === 0 ? 60 : 20), armB: rise * (d.i % 3 === 0 ? 120 : 0), head: -look * 10 + grief * 12 - rise * 8, blink: blinkAt(T, d.seed) });
      });

      S.cam.x = lerp(-40, 0, walk) + es(t, 1.05, 1.5) * 40;
      S.cam.y = -es(t, 1.9, 2.4) * 50;
      S.cam.z = 1 + es(t, 1.9, 2.4) * 0.08;
    };
  },
};
