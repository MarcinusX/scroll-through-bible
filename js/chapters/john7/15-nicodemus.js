// J 7,50–53 — the same chamber. Nicodemus, one of them, steps forward; over him hangs a small night picture:
// the rooftop where he once came to Jesus by lamplight. "Does our Law judge a man without first hearing him?" —
// he raises the scroll of the Law; a plate with an ear and a balance. "Are you from Galilee too?" — a mocking tag
// swings at him. "Search and see: no prophet arises from Galilee" — a scroll is unrolled, Galilee crossed out.
// And they went each to his own house: dusk turns to night, one by one they leave through the door; Nicodemus is
// the last, pausing at the window where the lamps of the booths glow over the city.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { stars, moon } from '../../assets/nature.js';
import { ear } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { bubble as bubble5 } from '../mark5/lib.js';
import { scrollParts } from '../mark1/lib.js';
import { NIGHT as NIGHT14, DUSK as DUSK14 } from '../mark14/lib.js';
import {
  councilSet, COUNCIL, NICO, nicodemus, headAt, hand, strip, nameTag, roundel, bigBalance, scrollOpen, landMap, LANDMAP,
  hangAt, vpose, tr, PI,
} from './lib.js';

const NX1 = 1010;              // where Nicodemus stands to speak
const DOORX = 1265;

export default {
  id: 'j7-nicodemus',
  beats: [
    { v: 50 },
    { v: 51 },
    { v: 52, text: 'Odpowiedzieli mu: «Czy i ty jesteś z Galilei?' },
    { v: 52, cont: true, text: 'Zbadaj, zobacz, że żaden prorok nie powstaje z Galilei».' },
    { v: 53 },
  ],
  cam: { x: [-40, 80], y: [-60, 60], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const K = councilSet(S);
    const F = K.F;

    /* Nicodemus with the Law in his hand (swapped in when he raises it) */
    const NL = S.layer({ par: 0.56, sh: 5 });
    const nicoLaw = S.puppet(NL.add(nicodemus(c, { holdF: `<g transform="rotate(100) translate(0 -8) rotate(-100)">${scrollOpen(c, 56, 36)}</g>` })));

    /* the night falls over the room */
    const nightL = S.layer({ par: 0, sh: 1, flat: true });
    nightL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".42"/><ellipse cx="${COUNCIL.TX}" cy="420" rx="260" ry="220" fill="url(#warm-glow)" opacity=".5"/>`);
    nightL.fade(0);

    /* plates */
    const X = S.layer({ par: 0.56, sh: 6 });
    const nightIn = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-100, -100, 200, 200), 0, 20), mix(C.night, C.indigo, 0.3));
      s.p(c.cut(c.rect(-100, 40, 200, 60), 0.4, 10), mix(C.plaster2, C.indigo, 0.45));
      return s.out() + stars(c, { x0: -90, x1: 90, y0: -90, y1: 10, n: 22 }) + `<g transform="translate(56 -60)">${moon(c, 14)}</g><circle cx="0" cy="10" r="50" fill="url(#warm-glow)"/>` +
        `<g transform="translate(34 44) scale(.42) scale(-1 1)">${person(c, { ...CAST.jesus, pose: 'sit' })}</g><g transform="translate(-36 44) scale(.42)">${nicodemus(c, { pose: 'sit' })}</g><path d="${c.cut([[-8, 40], [8, 40], [4, 34], [-4, 34]], 0.2, 2)}" fill="${C.pot}"/><path d="M4 34C1 30 2 26 4 22C6 26 7 30 4 34Z" fill="${C.lampFlame}"/>`;
    })();
    const nightP = hanging(X, roundel(c, nightIn, { r: 76, face: C.night, rim: C.haloRim, id: S.id('nightvisit') }) + `<g transform="translate(0 94)">${strip(c, tr('ten, który przyszedł do Niego nocą', 'who came to him by night'), { size: 14 })}</g>`, { x: 1010, y: 280, len: 600 });
    const nameT = X.add(`<g>${strip(c, tr('Nikodem', 'Nicodemus'), { size: 18 })}</g>`);
    const hearIn = (() => {
      const B = bigBalance(c, 50);
      return `<rect x="-100" y="-100" width="200" height="200" fill="${mix(C.parchment, C.sage3, 0.3)}"/><g transform="translate(-40 -2) scale(.9)">${ear(c, C.skin2)}</g><g transform="translate(40 -52) scale(.7)">${B.stand}<g transform="translate(0 44)">${B.beam}</g><g transform="translate(-50 44)">${B.pan}</g><g transform="translate(50 44)">${B.pan}</g></g>`;
    })();
    const hearP = hanging(X, roundel(c, hearIn, { r: 72, face: C.parchment, id: S.id('hear') }) + `<g transform="translate(0 90)">${strip(c, tr('najpierw wysłuchać i zbadać', 'first hear, and know what he does'), { size: 14 })}</g>`, { x: 1010, y: 280, len: 600 });
    const mockB = X.add(`<g>${bubble5(c, tr(['Czy i ty jesteś', 'z Galilei?'], ['Are you also', 'from Galilee?']), { size: 19, dir: -1, jag: true, fill: '#4a3f52', ink: C.cream })}</g>`);
    const galTag = X.add(`<g>${nameTag(c, tr('Galilejczyk?', 'a Galilean?'), { size: 15 })}</g>`);
    const sp = scrollParts(c, { w: 190, h: 110, lines: 5 });
    const scrTop = X.add(`<g>${sp.rod}</g>`), scrSheet = X.add(`<g>${sp.sheet}</g>`), scrBot = X.add(`<g>${sp.rod}</g>`);
    const galMap = X.add(`<g><g transform="scale(.36)">${landMap(c)}</g><path d="${c.ribbon([[-70, -110], [70, -40]], 7) + c.ribbon([[70, -110], [-70, -40]], 7)}" fill="${C.terracotta}" opacity=".85"/></g>`);
    const noProphetT = X.add(`<g>${strip(c, tr('żaden prorok z Galilei', 'no prophet from Galilee'), { size: 16 })}</g>`);
    const homeT = hanging(X, nameTag(c, tr(['każdy', 'do swego domu'], ['each one', 'to his own house']), { size: 18 }), { x: 820, y: 300, len: 600 });

    return (t, time) => {
      const T = time;
      K.update(t, T);

      /* v50 — Nicodemus steps forward */
      const step = es(t, 0.05, 0.6, ease.sine);
      const raise = es(t, 1.05, 1.12);
      /* v53 — they leave, one by one */
      const leave = (d) => es(t, 4.05 + d, 4.6 + d, ease.sine);
      const nlv = es(t, 4.55, 4.95, ease.sine);
      const nx = lerp(COUNCIL.NX, NX1, step) + nlv * 250;
      const mocked = es(t, 2.1, 2.3) * (1 - es(t, 4.0, 4.2));
      const nicoArgs = { x: nx, y: F - 10 + step * 38, s: 0.98 + step * 0.06, flip: step > 0.97 && nlv < 0.02, walk: (step > 0 && step < 1) || (nlv > 0 && nlv < 1) ? nx * 0.05 : undefined, head: -bump(t, 0.2, 0.9) * 4 + mocked * 10 - nlv * 8, blink: blinkAt(T, 5) };
      K.nico.set({ ...nicoArgs, o: 1 - raise + es(t, 2.9, 3.0), armF: 16 + bump(t, 0.3, 0.9) * 40, armB: 10 });
      nicoLaw.set({ ...nicoArgs, o: raise * (1 - es(t, 2.9, 3.0)), armF: 100 - es(t, 2.0, 2.3) * 40, armB: 20 + bump(t, 1.2, 1.9) * 40 });
      const [nhx, nhy] = headAt(nx, F - 10 + step * 38, 0.98 + step * 0.06, step > 0.97 && nlv < 0.02);
      vpose(nameT, { x: nhx, y: nhy - 44, o: es(t, 0.3, 0.45) * (1 - es(t, 0.9, 1.0)) });
      const pk = es(t, 0.3, 0.6, ease.out), pu = es(t, 0.95, 1.1, ease.in);
      hangAt(nightP, 1010, lerp(-300, 280, pk) - pu * 700, T, pk > 0 && pu < 1 ? 1 : 0, 1.2, 0.8, 1);

      /* v51 — does our Law condemn a man without hearing him? */
      const hk = es(t, 1.2, 1.5, ease.out), hu = es(t, 1.95, 2.1, ease.in);
      hangAt(hearP, 1010, lerp(-300, 280, hk) - hu * 700, T, hk > 0 && hu < 1 ? 1 : 0, 1.2, 0.8, 2);

      /* the council answers (v52) and then leaves (v53) */
      const jeer = bump(t, 2.05, 2.95);
      const search = es(t, 3.05, 3.3) * (1 - es(t, 3.95, 4.1));
      const L1 = leave(0), L2 = leave(0.12), L3 = leave(0.24), L4 = leave(0.34);
      const walker = (p, x0, y0, s, k, o) => {
        const x = lerp(x0, DOORX, k), y = lerp(y0, F + 4, k);
        p.set({ ...o, x, y, s, flip: k > 0 ? false : o.flip, walk: k > 0 && k < 1 ? x * 0.05 : undefined, o: x < DOORX - 10 ? 1 : 0, blink: blinkAt(T, o.seed || 0) });
      };
      walker(K.phB, COUNCIL.PHB, F + 8, 1, L1, { flip: true, armF: 20 + jeer * 70, armB: 10 + jeer * 30, head: -jeer * 6, seed: 4 });
      walker(K.pr, COUNCIL.PRX, F - 26, 0.94, L2, { flip: true, armF: 20 + jeer * 30, armB: 10, head: jeer * 8, seed: 2 });
      walker(K.hp, COUNCIL.HPX, F - 26, 0.98, L3, { flip: false, armF: 20, armB: 10, head: jeer * 6, seed: 1 });
      walker(K.phA, COUNCIL.PHA + 180, F + 8, 1, L4, { flip: false, armF: 20 + search * 50, armB: 10 + search * 50, head: search * 8, seed: 3 });
      const [bx, by] = headAt(COUNCIL.PHB, F + 8, 1, true);
      vpose(mockB, { x: bx - 20, y: by - 16, s: es(t, 2.1, 2.3, ease.back), o: seg(t, 2.1, 2.15) * (1 - es(t, 2.95, 3.05)) });
      const tg = es(t, 2.3, 2.6, ease.out);
      vpose(galTag, { x: lerp(bx - 60, nhx + 30, tg), y: lerp(by - 40, nhy + 70, tg) + Math.sin(T * 2) * 2, r: lerp(-20, 8, tg) + Math.sin(T * 1.6) * 3, o: seg(t, 2.3, 2.35) * (1 - es(t, 3.9, 4.05)) });

      /* v52b — search and see: a scroll unrolled, Galilee crossed out */
      const ux = COUNCIL.PHA + 250, uy = 320;
      const un = es(t, 3.05, 3.3);
      const sOn = seg(t, 3.02, 3.06) * (1 - es(t, 3.95, 4.1));
      vpose(scrTop, { x: ux, y: uy, o: sOn });
      vpose(scrSheet, { x: ux, y: uy, sy: Math.max(0.02, un), o: sOn });
      vpose(scrBot, { x: ux, y: uy + 110 * un, o: sOn });
      const mk = es(t, 3.3, 3.5, ease.back);
      vpose(galMap, { x: ux + 200, y: 390, s: mk, o: seg(t, 3.3, 3.35) * (1 - es(t, 3.95, 4.1)) });
      vpose(noProphetT, { x: ux + 200, y: 470, o: es(t, 3.45, 3.6) * (1 - es(t, 3.95, 4.05)) });

      /* v53 — night; each to his own house */
      const night = es(t, 4.0, 4.7);
      K.R.sky.blend(DUSK14, NIGHT14, night);
      nightL.fade(night);
      K.R.crowd.fade(0.6 + night * 0.4);
      const tk = es(t, 4.3, 4.6, ease.out);
      hangAt(homeT, 820, lerp(-300, 300, tk), T, tk > 0 ? 1 : 0, 1.2, 0.8, 3);

      S.cam.x = 50 - es(t, 4.1, 4.95) * 10;
      S.cam.y = 10 - es(t, 4.1, 4.95) * 30;
      S.cam.z = 1.1 + es(t, 4.2, 4.95) * 0.12;
    };
  },
};
