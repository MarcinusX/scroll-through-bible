// Mt 6,13 — the Our Father, the last petitions. Night on a road through dark hills; far off, one lit window of home.
// The quiet man walks with his little lamp. At a fork a side-track runs up into the thorns: coins and a cup of wine
// glitter on a rock there, a net hangs over them from the flies, and a shadow hand beckons. "Lead us not into
// temptation": a strip of light falls along the right road, he walks on past the fork without turning, and the net is
// hauled back up empty. "Deliver us from evil": a jagged darkness gathers behind him and reaches for him — a bell of
// light comes down over him, and the darkness tears apart into scraps and is gone.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, moon, stars, rock } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { NIGHT, QUIET, coin, cup, shadowHand, secretShaft, headAt, kf, moving, tr, PI } from './lib.js';
import { shadowShards, handLamp } from '../mark1/lib.js';
import { snare } from '../mark14/lib.js';
import { thornBush } from '../../assets/things.js';

const ROAD = [[180, 790], [420, 760], [640, 735], [860, 712], [1060, 690], [1260, 664], [1500, 640]];
const FORK = [[760, 720], [680, 676], [600, 646], [540, 626]];
const BAIT = [560, 624];

function roadY(x) {
  for (let i = 1; i < ROAD.length; i++) if (x <= ROAD[i][0]) { const [x0, y0] = ROAD[i - 1], [x1, y1] = ROAD[i]; return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0); }
  return ROAD[ROAD.length - 1][1];
}

export default {
  id: 'mt6-evil',
  beats: [
    { v: 13, text: 'i nie dopuść, abyśmy ulegli pokusie,' },
    { v: 13, cont: true, text: 'ale nas zachowaj od złego!' },
  ],
  cam: { x: [-40, 40], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, NIGHT);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -700, x1: 2300, y0: -600, y1: 420, n: 120 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const moonEl = hanging(hangL, moon(c, 30), { x: 1180, y: 150, len: 800 });

    /* dark hills, the lit house far off */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [18, 8, 3], lens: [1000, 340, 120], color: mix(C.night, C.indigo, 0.5) }).markup);
    const hill = S.layer({ par: 0.2, sh: 3 });
    const hb = band(c, { y: 540, amps: [22, 8, 3], lens: [900, 300, 110], color: mix(C.indigo, C.moss2, 0.3) });
    hill.add(hb.markup);
    const hs = sheet().p(c.cut(c.rect(1270, hb.fn(1300) - 40, 60, 44), 0.4, 5), mix(C.plaster2, C.indigo, 0.45)).p(c.cut([[1262, hb.fn(1300) - 40], [1338, hb.fn(1300) - 40], [1334, hb.fn(1300) - 48], [1266, hb.fn(1300) - 48]], 0.3, 4), mix(C.roof, C.indigo, 0.4)).out();
    hill.add(hs + `<g transform="translate(1300 ${hb.fn(1300) - 22})"><circle r="40" fill="url(#warm-glow)"/><path d="${c.poly(c.rect(-6, -6, 12, 10))}" fill="${C.lampFlame}"/></g>`);

    /* the near ground, the road, the fork into the thorns */
    const ground = S.layer({ par: 0.4, sh: 3 });
    const gs = sheet();
    gs.p(c.ridge(c.wave(600, [16, 6], [700, 220]), -900, 2500, 1900, 12, 1), mix(C.moss2, C.night, 0.45));
    gs.p(c.ribbon(ROAD, 70, 2), mix(C.sand2, C.indigo, 0.45));
    gs.p(c.ribbon(FORK, (u) => 46 - u * 26, 2), mix(C.sand2, C.indigo, 0.55));
    ground.add(gs.out());
    ground.add(rock(c, BAIT[0] + 10, BAIT[1] + 4, 110, 40, mix(C.rock2, C.indigo, 0.4)));
    ground.add(thornBush(c, 440, 640, 140, mix(C.thorn2, C.night, 0.3)) + thornBush(c, 680, 612, 100, mix(C.thorn2, C.night, 0.3)) + thornBush(c, 500, 590, 90, mix(C.thorn2, C.night, 0.4)));
    const pathLight = S.layer({ par: 0.4, sh: 0, flat: true });
    const strip = pathLight.add(`<path d="${c.ribbon(ROAD.slice(2), 44, 1)}" fill="#fff3cf" opacity=".42"/>`);

    /* the bait, the net, the beckoning hand */
    const bait = S.layer({ par: 0.4, sh: 5 });
    bait.add(`<g transform="translate(${BAIT[0]} ${BAIT[1] - 34})"><circle r="60" fill="url(#warm-glow)" opacity=".55"/>${[[-20, 0], [-6, -4], [8, 0], [-12, -12], [2, -14]].map(([x, y]) => `<g transform="translate(${x} ${y})">${coin(c, 8)}</g>`).join('')}<g transform="translate(30 4) scale(1.3)">${cup(c, C.sun)}</g></g>`);
    const glints = [0, 1, 2].map(() => bait.add(`<path d="${c.poly(c.star(0, 0, 8, 1.8, 4, 0))}" fill="${C.star}"/>`));
    const net = bait.add(`<g>${snare(c, 150, 100)}</g>`);
    const beck = bait.add(`<g>${shadowHand(c, '#231d31', 1.3)}</g>`);

    /* the traveller */
    const act = S.layer({ par: 0.4, sh: 5 });
    const man = S.puppet(act.add(person(c, { ...QUIET, holdF: `<g transform="translate(6 2)">${handLamp(c)}</g>` })));

    /* the darkness, and the bell of light */
    const dark = S.layer({ par: 0.4, sh: 6 });
    const SH = shadowShards(c, { n: 13, r: 140, color: '#1f1a2d' }).map((sh) => ({ ...sh, el: dark.add(`<g>${sh.m}</g>`), drift: c.rr(0.7, 1.3) }));
    const grab = dark.add(`<g>${shadowHand(c, '#1f1a2d', 2.2)}</g>`);
    const eyes = dark.add(`<g><path d="${c.poly(c.ell(-16, 0, 7, 3, 8, 0.2)) + c.poly(c.ell(16, 0, 7, 3, 8, -0.2))}" fill="#e7b25e"/></g>`);
    const bellL = S.layer({ par: 0.4, sh: 0, flat: true });
    const bell = bellL.add(`<g><path d="${c.poly([...c.arc(0, 0, 130, 240, PI, 2 * PI, 30), [130, 10], [-130, 10]])}" fill="#fff3cf" opacity=".28"/><path d="${c.ribbon(c.arc(0, 0, 130, 240, PI, 2 * PI, 30), 5)}" fill="${C.halo}" opacity=".8"/><ellipse cy="4" rx="140" ry="22" fill="url(#halo-glow)"/></g>`);
    const beam = bellL.add(`<g>${secretShaft(c, { w0: 40, w1: 240, h: 1300 })}</g>`);

    const fg = S.layer({ par: 0.8, sh: 6 });
    fg.add(thornBush(c, 100, 980, 260, mix(C.thorn2, C.night, 0.5)) + rock(c, 1500, 990, 260, 110, mix(C.rock3, C.night, 0.5)));

    const MK = [[0.0, 380], [0.55, 700], [1.0, 860], [1.55, 940], [2.0, 1020]];
    return (t, time) => {
      const T = time;
      pose(moonEl, { x: 1180, y: 150, r: T ? Math.sin(T * 0.6) : 0 });
      const x = kf(t, MK, (u) => u);
      const walking = t > 0 && t < 1.55 || (t > 1.8 && t < 2.0);
      const scared = bump(t, 1.2, 1.55);
      const turnAway = es(t, 0.4, 0.55) * (1 - es(t, 0.95, 1.05));
      man.set({ x, y: roadY(x) + 8, s: 0.96, walk: walking ? x * 0.05 : undefined, armF: 64 - scared * 10, armB: 10 + scared * 40, head: turnAway * 16 - es(t, 1.5, 1.7) * 14, lean: scared * -6, blink: blinkAt(T, 2) });

      /* v13a — the bait glitters, the hand beckons; light falls along the right road; the net goes up empty */
      glints.forEach((g, i) => {
        const k = T ? Math.abs(Math.sin(T * 2 + i * 2)) : 0.6;
        pose(g, { x: BAIT[0] - 20 + i * 24, y: BAIT[1] - 60 - (i % 2) * 12, s: k, r: T * 30, o: 1 - es(t, 0.8, 1.0) * 0.7 });
      });
      const up = es(t, 0.72, 0.95, ease.in);
      pose(net, { x: BAIT[0], y: BAIT[1] - 150 - up * 600, r: T ? Math.sin(T * 0.8) * 2 : 0 });
      const bk = T ? Math.sin(T * 3) : 0;
      pose(beck, { x: BAIT[0] - 80, y: BAIT[1] - 16, r: -20 + bk * 14, o: 0.9 * (1 - es(t, 0.75, 0.95)) });
      const lk = es(t, 0.3, 0.6);
      fade(strip, lk * (1 - es(t, 1.9, 2.0) * 0.3));

      /* v13b — the darkness gathers behind him and reaches; the bell of light; it tears apart */
      const gather = es(t, 1.02, 1.3);
      const tearK = es(t, 1.55, 1.98);
      const cx = x - 210, cy = roadY(x) - 170;
      SH.forEach((sh) => {
        const d = tearK * 360 * sh.drift;
        pose(sh.el, { x: cx + Math.cos(sh.a) * d, y: cy + Math.sin(sh.a) * d - tearK * 40, r: tearK * 120 * (sh.i % 2 ? 1 : -1), s: 0.4 + gather * 0.6, o: gather * (1 - tearK) });
      });
      const reach = es(t, 1.2, 1.42) * (1 - tearK);
      pose(grab, { x: cx + 60 + reach * 90, y: cy + 20, r: 60 + reach * 10, s: 0.7 + reach * 0.3, o: gather * (1 - tearK) });
      pose(eyes, { x: cx, y: cy - 30, o: gather * (1 - tearK) * (T ? 1 - blinkAt(T, 4) : 1) });
      const bl = es(t, 1.38, 1.58, ease.out);
      pose(bell, { x, y: roadY(x) + 10, sx: 0.6 + bl * 0.4, sy: bl, o: bl * (1 - es(t, 1.9, 2.0) * 0.4) });
      pose(beam, { x, y: roadY(x) + 10, o: bl * 0.9 });

      S.cam.z = 1.03 + es(t, 0.0, 0.6) * 0.04 + es(t, 1.0, 1.4) * 0.04;
      S.cam.x = lerp(-30, 30, es(t, 0.0, 2.0, (u) => u));
      S.cam.y = 10;
    };
  },
};
