// Mt 13,13–15 — close on a knot of people on the beach (Jesus small in His boat out on the water). They look with
// wide-open paper eyes and cupped ears, but the parable plate floats right past them and question marks rise.
// Isaiah's sepia cameo comes down with his scroll: hearing they will not understand, seeing they will not
// perceive. A warm heart over them turns to stone, their ears are stopped, their eyes close; a healing light comes
// towards them and waits — but they turn away from it.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, palm, olive, rock, grass, sun, cloud } from '../../assets/nature.js';
import { ear, sprout, seedPath } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { boatIn, placeBoat, prophetCameo, ISAIAH, scrollOpen, paperEye, heart, stoneHeart, radiance, spark, speech, GLYPH, discPlate, headAt, hangAt, manOf, womanOf, tr, PI } from './lib.js';

const FEET = 716, PS = 1.0;

export default {
  id: 'mt13-isaiah',
  beats: [
    { v: 13 },
    { v: 14, text: 'Tak spełnia się na nich przepowiednia Izajasza:' },
    { v: 14, cont: true, text: 'Słuchać będziecie, a nie zrozumiecie, patrzeć będziecie, a nie zobaczycie.' },
    { v: 15, text: 'Bo stwardniało serce tego ludu, ich uszy stępiały i oczy swe zamknęli, żeby oczami nie widzieli ani uszami nie słyszeli, ani swym sercem nie rozumieli:' },
    { v: 15, cont: true, text: 'i nie nawrócili się, abym ich uzdrowił.' },
  ],
  cam: { x: [-30, 30], y: [-20, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const SK = ['#d2e3dc', '#f2e8cf', '#f8ecd6'], GREY = ['#b9bcc4', '#dcd6c8', '#ece3d0'];
    sky(S, SK);
    const greyL = sky(S, GREY, { name: 'grey' }).layer;
    greyL.fade(0);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1250, y: 150, len: 700 });
    const cl = hanging(hangL, cloud(c, 200), { x: 980, y: 210, len: 700 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 380, amps: [16, 8, 3], lens: [1000, 400, 150], color: C.hillFar }).markup);
    const lakeL = S.layer({ par: 0.2, sh: 2 });
    lakeL.add(waterBand(c, { y: 420, color: C.lake, foamN: 26 }).markup);
    // Jesus, small, in the boat out on the water
    const farBoat = S.layer({ par: 0.22, sh: 3 });
    const B = boatIn(farBoat, c, () => S.puppet(farBoat.add(person(c, { ...CAST.jesus, pose: 'sit' }))));
    const beach = S.layer({ par: 0.4, sh: 3 });
    const bfn = c.wave(560, [6, 3], [600, 170]);
    beach.add(sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), C.sand).out() + grass(c, { x0: -600, x1: 2200, y: 560, fn: bfn, n: 30, h: 12, color: C.olive }));
    beach.add(palm(c, 200, 566, 260) + olive(c, 1480, 566, 1) + rock(c, 380, 590, 60, 22, C.rock2) + rock(c, 1260, 594, 70, 26));

    /* the people: open eyes, then closed; they turn away at the end */
    const peopleL = S.layer({ par: 0.5, sh: 5 });
    const LOOKS = [manOf(c, { robe: C.ochreRobe }), womanOf(c, { robe: C.dustyBlue }), manOf(c, { robe: C.sageRobe, hairStyle: 'wrap', veil: C.linen2 }), womanOf(c, { robe: C.mauve, veil: C.blushVeil }), manOf(c, { robe: C.clayMantle, hairStyle: 'curly' })];
    const P = LOOKS.map((o, i) => {
      const x = 560 + i * 118 + (i % 2) * 8, y = FEET + (i % 2) * 14, s = PS * (0.96 + (i % 2) * 0.05);
      return { i, x, y, s, o, seed: c.rr(0, 6), open: S.puppet(peopleL.add(person(c, o))), shut: S.puppet(peopleL.add(person(c, { ...o, eyes: 'closed' }))) };
    });
    const fx = S.layer({ par: 0.52, sh: 5 });
    P.forEach((p) => {
      const [hx, hy] = headAt(p.x, p.y, p.s, false);
      p.hx = hx; p.hy = hy;
      p.eye = fx.add(`<g>${paperEye(c, 44)}</g>`);
      p.ear = fx.add(`<g>${ear(c, p.o.skin)}</g>`);
      p.plug = fx.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 9, 7, 8, 0.2), 0.4, 3), mix(C.stone2, C.rock2, 0.4)).out()}</g>`);
      p.q = fx.add(`<g>${speech(c, GLYPH.q(c), { w: 42, h: 38 })}</g>`);
    });
    // the parable plate that floats past their eyes
    const seedIc = `<g transform="translate(0 20)">${sprout(c, { h: 40 })}</g><path d="${seedPath(c, -20, 20, 4, 0.4) + seedPath(c, 18, 22, 4, 2)}" fill="${C.wheat2}"/>`;
    const plate = fx.add(`<g>${discPlate(c, seedIc, { r: 46 })}</g>`);
    // sound arriving at their ears and bouncing off
    const waves = [0, 1, 2, 3].map((i) => ({ i, el: fx.add(`<path d="${c.ribbon(c.arc(0, 0, 26, 26, -0.8, 0.8, 10), 4.4)}" fill="${C.cream}" opacity="0"/>`) }));

    /* Isaiah's cameo and scroll; the heart; the healing light */
    const top = S.layer({ par: 0.3, sh: 6 });
    const isa = hanging(top, `<g transform="scale(1.9)">${prophetCameo(c, S.id('isa'), ISAIAH, tr('Izajasz', 'Isaiah'))}</g>`, { x: 0, y: 0, len: 900 });
    const scroll = hanging(top, `<g transform="scale(1.9 1.5)">${scrollOpen(c, 90, 56)}</g>`, { x: 0, y: 0, len: 900 });
    const warm = hanging(top, heart(c, 56), { x: 0, y: 0, len: 900 });
    const cold = top.add(`<g>${stoneHeart(c, 64)}</g>`);
    const light = S.layer({ par: 0.52, sh: 3 });
    const heal = light.add(`<g><circle r="220" fill="url(#warm-glow)"/><g transform="scale(.42)">${radiance(c, 110)}</g></g>`);
    const hsparks = [0, 1, 2, 3, 4].map((i) => ({ i, el: light.add(`<g>${spark(c, 8)}</g>`) }));

    /* front */
    const fg = S.layer({ par: 0.8, sh: 6 });
    fg.add(waveStrip(c, { y: 930, len: 190, amp: 12, color: mix(C.sand2, C.sand, 0.5), crests: false }));

    return (t, time) => {
      const T = time;
      const grey = es(t, 3.0, 3.8) * (1 - es(t, 4.0, 4.6) * 0.5);
      greyL.fade(grey);
      swing(sunEl, 1250, 150, T, 1, 0.6);
      swing(cl, 980 + Math.sin(T * 0.1) * 20, 210 + grey * 0, T, 1.2, 0.6, 1);
      const bob = Math.sin(T * 1.4) * 1.5;
      placeBoat(B, 1270, 470 + bob, 0.34, Math.sin(T * 1.1) * 0.8);
      B.inside.set({ x: 1270 - 3.4, y: 470 + bob - 4, s: 0.34, flip: true, armF: 40 + es(t, 0, 0.3) * 30, armB: 20, blink: blinkAt(T) });

      /* v13: open eyes, open ears — but the plate goes by unseen */
      const close = es(t, 3.3, 3.45);
      const away = es(t, 4.35, 4.5);
      P.forEach((p) => {
        const look = bump(t, 0.2, 2.9);
        const turn = away > 0.5;
        const st = { x: p.x, y: p.y, s: p.s, flip: turn, armF: 10 + bump(t, 2.1, 2.9) * 26 * (p.i % 2), armB: 0, head: -look * 4 - close * 8 + (turn ? 6 : 0), blink: blinkAt(T, p.seed) };
        p.open.set({ ...st, o: 1 - close });
        p.shut.set({ ...st, o: close, blink: 0 });
        // the eye glyph above the head: wide open, then shut
        const e = es(t, 0.1 + p.i * 0.05, 0.3 + p.i * 0.05, ease.back) * (1 - es(t, 3.6, 3.9));
        pose(p.eye, { x: p.hx + 4, y: p.hy - 70 + Math.sin(T * 1.4 + p.i) * 2, s: e * 0.9, sy: e * 0.9 * (1 - close * 0.92), o: e > 0.01 ? 1 : 0 });
        const er = es(t, 2.1 + p.i * 0.04, 2.3 + p.i * 0.04, ease.back) * (1 - es(t, 4.3, 4.5));
        pose(p.ear, { x: p.hx - 22, y: p.hy - 4, s: er * 0.42, o: er > 0.01 ? 1 : 0 });
        const plug = es(t, 3.25 + p.i * 0.04, 3.4 + p.i * 0.04, ease.back) * (1 - es(t, 4.3, 4.5));
        pose(p.plug, { x: p.hx - 20, y: p.hy - 6, s: plug, o: plug > 0.01 ? 1 : 0 });
        const q = Math.max(es(t, 0.55 + p.i * 0.05, 0.72 + p.i * 0.05, ease.back) * (1 - es(t, 1.0, 1.15)), es(t, 2.5 + p.i * 0.05, 2.68 + p.i * 0.05, ease.back) * (1 - es(t, 2.95, 3.1)));
        pose(p.q, { x: p.hx + 16, y: p.hy - 24, s: q * 0.8, r: Math.sin(T * 2 + p.i) * 5, o: q > 0.02 ? 1 : 0 });
      });
      const pp = seg(t, 0.15, 0.9);
      pose(plate, { x: lerp(1300, 300, pp), y: 480 + Math.sin(pp * PI * 2) * 16, r: pp * 30 - 15, o: pp > 0 && pp < 1 ? 1 : 0 });
      waves.forEach((w) => {
        const on = es(t, 2.1, 2.25) * (1 - es(t, 2.95, 3.05));
        const k = ((T * 0.55 + w.i / 4) % 1) || w.i / 4 + 0.1;
        const tx = P[4].hx + 40;
        const inb = k < 0.55, u = inb ? k / 0.55 : (k - 0.55) / 0.45;
        pose(w.el, { x: inb ? lerp(tx + 150, tx, u) : lerp(tx, tx + 90, u), y: P[4].hy - 10 - (inb ? 0 : u * 30), sx: inb ? -1 : 1, s: 1, r: inb ? 0 : -u * 30, o: on * (inb ? Math.min(1, u * 3) : 1 - u) });
      });

      /* v14: Isaiah's cameo and scroll come down */
      const iz = es(t, 1.0, 1.35, ease.out) * (1 - es(t, 3.0, 3.3));
      hangAt(isa, 590, lerp(-300, 270, iz), T, 1, 0.7);
      const sc = es(t, 1.4, 1.75, ease.out) * (1 - es(t, 3.0, 3.3));
      hangAt(scroll, 900, lerp(-300, 262, sc), T, 1, 0.7, 1);

      /* v15a: the heart hardens */
      const hIn = es(t, 3.0, 3.25, ease.out);
      const stone = es(t, 3.2, 3.4);
      hangAt(warm, 800, lerp(-300, 300, hIn), T, 1, 0.6, 2);
      fade(warm, (1 - stone) * (hIn > 0.01 ? 1 : 0));
      pose(cold, { x: 800, y: lerp(-300, 300, hIn) + 8, s: 0.8 + stone * 0.25, o: stone });

      /* v15b: the healing light comes and waits; they turn away */
      const lk = es(t, 4.05, 4.4);
      pose(heal, { x: lerp(1500, 1210, lk), y: 470, s: 0.7 + Math.sin(T * 1.5) * 0.03, o: lk * 0.95 });
      hsparks.forEach((h) => {
        const a = T * 0.8 + h.i * 1.25;
        pose(h.el, { x: lerp(1500, 1210, lk) + Math.cos(a) * 70, y: 470 + Math.sin(a) * 60, s: 0.8, o: lk * 0.9 });
      });

      S.cam.z = 1.04 + es(t, 0, 1) * 0.04 + es(t, 3, 3.5) * 0.04;
      S.cam.y = 20 + es(t, 0.9, 1.3) * -30 + es(t, 3, 3.5) * 30;
      S.cam.x = es(t, 4, 4.4) * 20;
    };
  },
};
