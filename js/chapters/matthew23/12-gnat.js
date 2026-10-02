// Mt 23,24 — a painted flat, gently comic. At a table the Pharisee pours his wine through a cloth, so carefully — and
// there, caught in the cloth, is a gnat. He picks it out between finger and thumb and holds it up to look at it (a
// little lens shows how tiny it is) and flicks it away. Then he lifts his cup to drink — and a whole camel, strolling in
// from the side, shrinks and slips over the rim, and he swallows it down in one gulp without noticing a thing.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, mix } from '../kit.js';
import { sun, cloud, grass } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vain, PH, table, strainer, wineCup, gnat, peepRing, camel, walkCamel, jug, handAt, streetFlat, tr, PI } from './lib.js';

const GY = 660;
const PX = 600;                    // the Pharisee
const TX = 730;                    // the table

export default {
  id: 'mt23-gnat',
  enter: 'fly',
  beats: [
    { v: 24 },
  ],
  cam: { x: [0, 80], y: [-40, 30], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    sky(S, ['#d4e1d6', '#f1e7cc', '#f6e3c3']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 38), { x: 1210, y: 140, len: 800 });
    const cl = hanging(hangL, cloud(c, 150), { x: 520, y: 150, len: 800 });
    const back = S.layer({ par: 0.2, sh: 3 });
    back.add(streetFlat(c, { gy: GY - 40, wall: mix(C.plaster2, C.parchment, 0.4) }));
    const G = S.layer({ par: 0.35, sh: 3 });
    G.add(sheet().p(c.cut([[-900, GY - 40], [2500, GY - 42], [2500, 1700], [-900, 1700]], 1, 16), mix(C.sand, C.stone, 0.35)).out() + grass(c, { x0: -600, x1: 2200, y: GY - 40, n: 14, h: 9, color: C.olive }));

    const P = S.layer({ par: 0.45, sh: 5 });
    const cam_ = P.add(`<g><g class="cm">${camel(c)}</g></g>`);
    const cm = cam_.querySelector('.cm');
    P.add(`<g transform="translate(${TX} ${GY + 8})">${table(c, 190, 80)}<g transform="translate(-30 -72)">${strainer(c, 64)}</g></g>`);
    const phar = S.puppet(P.add(vain(c, PH)));
    const jugEl = P.add(`<g>${jug(c, C.pot)}</g>`);
    const cup = P.add(`<g>${wineCup(c, 46)}</g>`);
    const fx = S.layer({ par: 0.45, sh: 4 });
    const drip = fx.add(`<g><path d="${c.ribbon([[0, 0], [1, 20], [0, 40]], (u) => 3 - u)}" fill="${mix(C.plumRobe, C.curtain2, 0.4)}"/></g>`);
    const gn = fx.add(`<g>${gnat(c, 1.2)}</g>`);
    const ring = fx.add(`<g>${peepRing(c, 30)}</g>`);
    const big = fx.add(`<g>${gnat(c, 3.2)}</g>`);
    const gulp = fx.add(`<g><text x="0" y="0" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="30" font-style="italic" fill="${C.terracotta}">${tr('gul!', 'gulp!')}</text></g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1210, 140, T, 1, 0.6);
      swing(cl, 520 + (T ? Math.sin(T * 0.1) * 20 : 0), 150, T, 1.2, 0.7, 1);

      /* 0–0.26: pouring through the cloth; 0.3–0.5: the gnat picked out and looked at; 0.5–0.56 flicked away */
      const pour = es(t, 0.02, 0.08) * (1 - es(t, 0.22, 0.28));
      const pickK = es(t, 0.3, 0.38) * (1 - es(t, 0.5, 0.56));
      const drink = es(t, 0.58, 0.68) * (1 - es(t, 0.88, 0.95));
      const holdCup = es(t, 0.52, 0.58);
      const pat = bump(t, 0.86, 1.0);
      const armF = 40 + pour * 42 + pickK * 60 + holdCup * 20 * (1 - drink) + drink * 58 - pat * 30;
      phar.set({
        x: PX, y: GY + 2, s: 1.02, armF, armB: 20 + pour * 30 + pat * 20, head: -pickK * 8 - drink * 24 + pour * 12, lean: pour * 8 - drink * 6, blink: blinkAt(T, 2),
      });
      const [hx, hy] = handAt(PX, GY + 2, 1.02, false, armF);
      // the jug in his hand while he pours, then set down on the table
      const jugDown = es(t, 0.24, 0.3);
      pose(jugEl, { x: lerp(hx + 6, TX + 80, jugDown), y: lerp(hy + 30, GY - 72, jugDown), r: pour * 80 - 6 * (1 - jugDown), s: 0.72 });
      pose(drip, { x: TX - 30, y: GY - 112, sy: pour, o: pour > 0.05 ? 0.9 : 0 });
      // the gnat on the cloth, then in his fingers, then flicked away
      const inHand = es(t, 0.32, 0.36);
      const flick = seg(t, 0.52, 0.6);
      pose(gn, { x: lerp(TX - 30, hx + 6, inHand) + flick * 160, y: lerp(GY - 70, hy - 4, inHand) - flick * 120, r: flick * 300, o: es(t, 0.12, 0.2) * (1 - flick) });
      const look = bump(t, 0.36, 0.56);
      pose(ring, { x: hx + 4, y: hy - 6, s: look, o: look > 0.05 ? 1 : 0 });
      pose(big, { x: hx + 4, y: hy - 6, s: look, o: look > 0.05 ? 1 : 0 });

      /* a camel strolls in (0.3–0.58), shrinks and slips over the rim of the cup at his lips (0.6–0.8); gulp */
      pose(cup, { x: lerp(TX - 70, hx + 8, holdCup), y: lerp(GY - 72, hy + 12, holdCup) - drink * 6, r: -drink * 55, o: 1 });
      const walkIn = es(t, 0.3, 0.58);
      const suck = es(t, 0.6, 0.86);
      const camX = lerp(1420, 960, walkIn), camY = GY + 6;
      const cupX = hx + 12, cupY = hy - 30;
      pose(cam_, { x: lerp(camX, cupX, suck), y: lerp(camY, cupY, suck), s: lerp(0.9, 0.12, suck), r: -suck * 30, o: suck < 0.99 ? 1 : 0 });
      pose(cm, { sx: -1, sy: 1 });
      walkCamel(cam_, walkIn > 0.02 && walkIn < 0.98 ? T * 7 + t * 20 : 0, walkIn > 0.02 && walkIn < 0.98 ? 1 : 0);
      const g = bump(t, 0.86, 0.99);
      pose(gulp, { x: PX + 80, y: GY - 240 - g * 14, s: 0.8 + g * 0.3, o: g });

      S.cam.x = (S.portrait ? 5 : 40) + es(t, 0.35, 0.6) * 30;   // phone: a little to the left, so the Pharisee is not cut by the edge
      S.cam.z = 1.2;
      S.cam.y = 25;
    };
  },
};
