// Mk 4,1–3a — Jesus teaches from a boat; the crowd gathers on the shore.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, crowd, hanging, swing, flock, sheet } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, palm, reeds, rock, town, sun, cloud, olive, grass } from '../../assets/nature.js';
import { boat, bird, ripples, oilLamp, sprout, sickle, mustardTree } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';

export default {
  id: 'lake',
  beats: [
    { cover: true },
    { v: 1, text: 'Znowu zaczął nauczać nad jeziorem i bardzo wielki tłum ludzi zebrał się przy Nim.' },
    { v: 1, cont: true, text: 'Dlatego wszedł do łodzi i usiadł w niej [pozostając] na jeziorze, a cały lud stał na brzegu jeziora.' },
    { v: 2 },
    { v: 3, text: '«Słuchajcie:' },
  ],
  cam: { x: [-40, 40], y: [-40, 140], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const SUNX = P ? 1020 : 1190, SUNY = P ? 70 : 170;   // phone: the sun clear of the thread, above the plates
    const SKY = ['#cadfdb', '#eee5cc', '#f7ead3'];
    const sk = sky(S, SKY);

    // sun & clouds hang on strings
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 52), { x: SUNX, y: SUNY, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 220), { x: 520, y: 150, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 150), { x: 960, y: 245, len: 700 });
    const birds = flock(S, hangL, 5, (cc) => bird(cc, { color: C.bird }), { y: 250, speed: 55, scale: 0.55 });

    // far shore across the lake, then the near hills with a town
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 395, amps: [18, 8, 3], lens: [1100, 420, 150], color: C.hillFar }).markup);
    const hills = S.layer({ par: 0.2, sh: 3 });
    const h2 = hillsWith(c, { y: 440, amps: [22, 9, 3], lens: [900, 300, 110], color: C.hillMid, trees: 22, treeColor: C.sage, treeH: 24 });
    hills.add(h2.markup);
    hills.add(town(c, { x: 330, y: h2.fn(330) + 10, n: 8, spread: 300, sc: 0.55 }));
    hills.add(town(c, { x: 1320, y: h2.fn(1320) + 12, n: 5, spread: 200, sc: 0.5 }));

    // the beach
    const beach = S.layer({ par: 0.3, sh: 3 });
    const bfn = c.wave(505, [5, 2], [700, 160]);
    beach.add(sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), C.sand).out());
    beach.add(olive(c, 120, 506, 0.9) + olive(c, 1500, 508, 0.8));
    beach.add(palm(c, 250, 510, 200) + palm(c, 1390, 512, 170));
    beach.add(rock(c, 560, 520, 50, 20) + rock(c, 1080, 522, 40, 16, C.rock2));
    beach.add(grass(c, { x0: -400, x1: 2000, y: 505, fn: bfn, n: 40, h: 12, color: C.olive }));

    // crowd on the beach
    const crowdL = S.layer({ par: 0.34, sh: 3 });
    const people = crowd(S, crowdL, [
      { y: 506, s: 0.34, n: 26, x0: 60, x1: 1540 },
      { y: 522, s: 0.41, n: 22, x0: 100, x1: 1500 },
      { y: 544, s: 0.49, n: 16, x0: 140, x1: 1460 },
    ]).filter((m) => Math.abs(m.x - 800) > 70 || m.y < 515);
    people.forEach((m) => { m.from = m.x < 800 ? c.rr(-500, -150) : c.rr(1750, 2100); });

    // water
    const lake = S.layer({ par: 0.42, sh: 2 });
    lake.add(waterBand(c, { y: 560, color: C.lake, foamN: 30 }).markup);
    lake.add(reeds(c, 90, 572, 10, 70) + reeds(c, 1540, 574, 8, 60));
    const ripL = lake.add(`<g>${ripples(c, 4, 60, C.foam)}</g>`);
    const rips = Array.from(ripL.querySelectorAll('.ripple'));

    // the boat and Jesus
    const boatL = S.layer({ par: 0.6, sh: 5 });
    const jStand = S.puppet(boatL.add(person(c, { ...CAST.jesus })));
    const b = boat(c, { cushion: false });
    const boatG = boatL.add(`<g><g>${b.back}</g><g data-k="jsit">${person(c, { ...CAST.jesus, pose: 'sit' })}</g><g>${b.front}</g></g>`);
    const jSit = S.puppet(S.$('jsit').firstElementChild);

    // parable images rising from the boat like soap-bubbles of paper
    const plates = [
      { icon: `<g transform="translate(0 16)">${sprout(c, { h: 30 })}</g>`, x: P ? 595 : 575, y: 340 },
      { icon: `<g transform="translate(-4 10) scale(.8)">${oilLamp(c)}</g>`, x: P ? 730 : 725, y: 300 },
      { icon: `<g transform="translate(0 30) scale(.12)">${mustardTree(c, { h: 420 }).replace(/class="grow"/g, '')}</g>`, x: P ? 870 : 895, y: 300 },
      { icon: `<g transform="translate(6 2) scale(.55) rotate(20)">${sickle(c)}</g>`, x: P ? 1005 : 1050, y: 340 },
    ].map((pl) => {
      const disc = sheet().p(c.cut(c.circ(0, 0, 42, 30), 0.6, 5), C.cream).out();
      pl.el = hanging(boatL, `<g transform="translate(0 0)">${disc}${pl.icon}</g>`, { x: pl.x, y: pl.y, len: 500 });
      return pl;
    });

    // near waves & foreground
    // waves slide on the compositor (layer.shift) — no repainting
    const w1 = S.layer({ par: 0.72, sh: 4, pad: 160 });
    w1.add(waveStrip(c, { y: 770, len: 150, amp: 11, color: C.lake2 }));
    const w2 = S.layer({ par: 0.8, sh: 4, pad: 200 });
    w2.add(waveStrip(c, { y: 845, len: 190, amp: 14, color: C.lake3 }));
    const fg = S.layer({ par: 1, sh: 6 });
    fg.add(reeds(c, 200, 930, 14, 230, C.moss) + reeds(c, 1420, 940, 12, 200, C.moss) + rock(c, 1330, 950, 200, 80, C.rock2) + rock(c, 260, 955, 150, 60, C.rock));

    const cur = curtains(S);

    return (t, time) => {
      const hush = 1 - es(t, 4, 4.6) * 0.75; // on "Słuchajcie" the world holds its breath
      const tt = time * hush;
      cur.set(es(t, 0.05, 0.85), time);
      sk.blend(SKY, ['#d8e6df', '#f4ead2', '#f9efdc'], seg(t, 1, 5));

      swing(sunEl, SUNX, SUNY - es(t, 0, 2) * 30, tt, 1.2, 0.7);
      swing(cl1, 520 + Math.sin(tt * 0.1) * 30, 150, tt, 1.5, 0.6, 1);
      swing(cl2, 960 + Math.sin(tt * 0.13 + 2) * 30, 245, tt, 1.5, 0.8, 2);
      birds(tt, 1 - es(t, 4, 4.4));

      // crowd gathers during beat 1
      people.forEach((m) => {
        const pr = seg(t, 1 + m.delay * 0.45, 1.45 + m.delay * 0.45);
        const x = lerp(m.from, m.x, ease.out(pr));
        const moving = pr > 0 && pr < 1;
        const listen = es(t, 4, 4.4);
        m.p.set({
          x, y: m.y, s: m.s, flip: m.x > 800,
          walk: moving ? x * 0.05 : undefined,
          armF: listen * (m.i % 3 === 0 ? 30 : 0) + bump(t, 3.2 + m.delay * 0.4, 3.9 + m.delay * 0.4) * 12,
          head: -listen * 6,
          blink: blinkAt(time, m.seed),
        });
      });

      // Jesus walks to the boat, steps in, the boat pushes out towards us
      const walk = seg(t, 2, 2.3);
      const inBoat = seg(t, 2.28, 2.36);
      const push = es(t, 2.35, 2.95);
      const bob = Math.sin(time * 1.4) * 2.5;
      const bx = lerp(935, 800, push), by = lerp(588, 725, push), bs = lerp(0.5, 1.05, push);
      pose(boatG, { x: bx, y: by + bob * bs, s: bs, r: Math.sin(time * 1.1) * 0.8 });
      jStand.set({
        x: lerp(800, 930, walk), y: 556 - bump(t, 2.2, 2.34) * 16, s: 0.5, o: 1 - inBoat,
        walk: walk > 0 && walk < 1 ? walk * 18 : undefined,
        armF: bump(t, 1.2, 1.9) * 40 + Math.sin(time * 0.9) * 3, blink: blinkAt(time),
      });
      const teach = seg(t, 3, 4);
      const listen = es(t, 4, 4.35);
      jSit.set({
        x: -10, y: -10, s: 1, o: inBoat,
        armF: 30 + Math.sin(time * 1.6) * 16 * teach * (1 - listen) + teach * 30 + listen * 90,
        armB: 10 + teach * 12 * Math.sin(time * 1.1 + 1) + listen * 20,
        head: -4 + Math.sin(time * 0.7) * 2 * teach, blink: blinkAt(time, 3),
      });

      // plates rise out of the boat during the teaching
      plates.forEach((pl, i) => {
        const r = es(t, 3.05 + i * 0.16, 3.6 + i * 0.16, ease.back);
        const x = lerp(bx, pl.x, r), y = lerp(by - 160, pl.y, r) + Math.sin(tt * 1.2 + i) * 4;
        pose(pl.el, { x, y, s: 0.2 + 0.8 * r, o: seg(t, 3.02 + i * 0.16, 3.2 + i * 0.16) * (1 - seg(t, 4.3, 4.6) * 0.5), r: Math.sin(tt * 0.9 + i * 2) * 3 });
      });

      // listen — ripples spread from the boat
      rips.forEach((rp, i) => {
        const k = ((time * 0.35 + i / rips.length) % 1);
        const on = es(t, 4, 4.25);
        pose(rp, { x: 800, y: 598, s: 0.6 + k * 5, sy: 0.28, o: on * (1 - k) * 0.9 });
      });

      w1.shift((tt * 22) % 150 - 75);
      w2.shift(95 - ((tt * 16) % 190));

      S.cam.z = 1 + es(t, 0.6, 1.8) * 0.08 + es(t, 2.2, 3) * 0.1 + es(t, 4, 4.8) * 0.06;
      S.cam.y = es(t, 0.6, 1.8) * 40 + es(t, 2.2, 3) * 80 + es(t, 4, 4.8) * 20;
    };
  },
};
