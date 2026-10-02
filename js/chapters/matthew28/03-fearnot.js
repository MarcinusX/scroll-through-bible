// Mt 28,5–6a — Morning in the garden: the sun is up, the soldiers lie where they fell, the angel sits on the stone.
// He speaks to the women: "Do not be afraid!" — a warm light comes over them and they get up from their knees
// (only the guards stay down). "I know that you seek Jesus who was crucified": a disc on a string comes down with the
// cross on its hill at dusk. "He is not here, for he has risen": the disc turns over to the sunrise over an empty tomb,
// the angel points to the open doorway, and a medallion of Jesus recalls His own words — "on the third day he will rise".
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, flock } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  MAGD, MARYJ, ANGEL, GOLD, tombGarden, soldier, angelPerson, OPEN, SR, STONE_Y, DX, DYD, GUARD, WOMEN_AT, discFaces, medallion,
  strip, bubble, headAt, voiceRings, withFace, faceBits, sparkle, rays, bird, spearLying, tr, PI,
} from './lib.js';
import { CAST } from '../kit.js';
import { FALL } from './02-quake.js';

const SEAT = { x: OPEN - 6, y: STONE_Y - SR + 10 };
const MX = 800, MY = 300;           // the disc

export default {
  id: 'mt28-fearnot',
  beats: [
    { v: 5, text: 'Anioł zaś przemówił do niewiast: «Wy się nie bójcie!' },
    { v: 5, cont: true, text: 'Gdyż wiem, że szukacie Jezusa Ukrzyżowanego.' },
    { v: 6, text: 'Nie ma Go tu, bo zmartwychwstał, jak powiedział.' },
  ],
  cam: { x: [20, 210], y: [-20, 40], z: [0.88, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, GOLD);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep }), { x: 1300, y: 150, len: 900 });
    const cl = hanging(hangL, cloud(c, 180), { x: 560, y: 170, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 220, speed: 50, scale: 0.45 });

    const G = tombGarden(S);
    const L = G.P;
    /* the guards, lying like dead men, their spears beside them */
    // phone: the two on the far side of the stone lie off-screen to the right, as they fell in the quake scene
    const lying = GUARD.map((g0, k) => {
      const g = S.portrait && g0.i ? { ...g0, x: g0.x + 200 } : g0;
      L.add(`<g transform="translate(${g.x + FALL[k] * 60} ${g.y + 14})">${spearLying(c, 220)}</g>`);
      return { g, k, p: S.puppet(L.add(soldier(c, g.i, { spear: false }))) };
    });

    /* the angel on the stone */
    const aura = L.add(`<g><circle r="210" fill="url(#halo-glow)"/><g opacity=".22">${rays(c, { n: 20, r0: 60, r1: 280, spread: 0.04, color: '#fff3cf' })}</g></g>`);
    const angel = S.puppet(L.add(angelPerson(c, ANGEL, 'sit')));
    const voice = voiceRings(L, c, { n: 3, color: C.halo, r: 34, w: 5, both: false });
    const [ahx, ahy] = headAt(SEAT.x, SEAT.y, 1.02, true, 62);

    /* the two women */
    const warm = G.front.add(`<g opacity="0"><ellipse cx="0" cy="-90" rx="170" ry="150" fill="url(#halo-glow)"/></g>`);
    const W = [MAGD, MARYJ].map((o, i) => {
      const mk = (P) => { const el = G.front.add(withFace(person(c, { ...o, pose: P }), faceBits(c))); return { p: S.puppet(el), sad: el.querySelector('[data-part="sad"]') }; };
      return { i, x: WOMEN_AT[i][0] + (S.portrait ? 100 : 0), y: WOMEN_AT[i][1],   // phone: a step in from the left edge
        seed: c.rr(0, 9), k: mk('kneel'), s: mk('stand') };
    });

    /* the disc: crucified → risen; His own word */
    const fx = S.layer({ par: 0.55, sh: 6 });
    const faces = discFaces(c, 92);
    const disc = hanging(fx, `<g data-k="f28F">${faces.front}</g><g data-k="f28B" opacity="0">${faces.back}</g>`, { x: 0, y: -1500, len: 900 });
    const dF = S.$('f28F'), dB = S.$('f28B');
    const name = fx.add(`<g>${strip(c, tr('Jezus Ukrzyżowany', 'Jesus, who was crucified'), { size: 20 })}</g>`);
    const risen = fx.add(`<g>${strip(c, tr('Zmartwychwstał!', 'He has risen!'), { size: 24, fill: C.halo })}</g>`);
    const said = hanging(fx, `<g>${medallion(c, CAST.jesus, { r: 30, back: C.halo })}</g>`, { x: 0, y: -1500, len: 900 });
    const saidB = fx.add(`<g>${bubble(c, [tr('…a trzeciego dnia', '…and the third day'), tr('zmartwychwstanie', 'he will be raised up')], { size: 16, tail: -1 })}</g>`);
    const empty = fx.add(`<g>${sparkle(c, 16)}</g>`);

    return (t, time) => {
      pose(G.stone, { x: OPEN, y: STONE_Y, r: ((OPEN - DX) / SR) * 57.3 });
      pose(G.cord, { o: 0 });
      swing(sunEl, 1300, 150, time, 0.8, 0.5);
      swing(cl, 560 + (time ? Math.sin(time * 0.1) * 30 : 0), 170, time, 1.2, 0.6, 1);
      birds(time, 1);
      lying.forEach(({ g, k, p }) => p.set({ x: g.x, y: g.y - 34, s: 0.98, flip: g.x > DX, r: FALL[k] * 84, armF: 10, armB: 20, head: -4, blink: 1 }));

      /* v5a: "Do not be afraid!" — light over the women; they get up */
      const speak = es(t, 0.05, 0.25);
      const point = es(t, 2.05, 2.3);
      angel.set({ x: SEAT.x, y: SEAT.y, s: 1.02, flip: true, armF: 20 + speak * 50 - point * 10 + point * 40, armB: 12 + speak * 40 * (1 - point), head: -4 + point * 10, blink: blinkAt(time, 2) });
      pose(aura, { x: ahx, y: ahy + 50, s: 1 + (time ? Math.sin(time * 1.2) * 0.02 : 0), r: t * 4 });
      voice(ahx - 26, ahy, bump(t, 0.02, 0.95) + bump(t, 1.02, 1.95) * 0.6 + bump(t, 2.02, 2.95) * 0.6, time, { spread: 2, dir: -1 });
      const lift = es(t, 0.2, 0.55);
      pose(warm, { x: S.portrait ? 648 : 548, y: 736, s: 0.7 + lift * 0.4, o: lift * (1 - es(t, 1.6, 2.2) * 0.5) });
      const stand = seg(t, 0.5, 0.56);
      W.forEach((w) => {
        const bow = bump(t, 1.2, 2.0);
        const glad = es(t, 2.3, 2.6);
        w.k.p.set({ x: w.x, y: w.y, s: 1.02, o: 1 - stand, armF: 70 - lift * 20, armB: 60, head: -10 + lift * 6, lean: -4, blink: blinkAt(time, w.seed) });
        w.s.p.set({ x: w.x, y: w.y, s: 1.02, o: stand, armF: 26 + glad * 30 + (w.i === 0 ? glad * 30 : 0), armB: 10 + glad * (w.i === 1 ? 60 : 20), head: bow * 14 - glad * 8, blink: blinkAt(time, w.seed) });
        fade(w.k.sad, 1 - lift);
        fade(w.s.sad, bow * 0.9);
      });

      /* v5b: "you seek Jesus who was crucified" — the disc with the cross */
      const dIn = es(t, 1.05, 1.4, ease.back);
      const flip = es(t, 2.08, 2.35);
      const sx = Math.cos(flip * PI);
      swing(disc, MX, lerp(-1000, MY, dIn), time, 1, 0.7);
      pose(disc.querySelector('.obj'), { sx: Math.max(0.03, Math.abs(sx)) });
      fade(dF, sx >= 0 ? 1 : 0);
      fade(dB, sx < 0 ? 1 : 0);
      const nk = es(t, 1.3, 1.5, ease.back) * (1 - es(t, 2.0, 2.1));
      pose(name, { x: MX, y: MY + 124, s: nk, r: -2, o: nk > 0.01 ? 1 : 0 });

      /* v6a: "He is not here, for he has risen, as he said" */
      const rk = es(t, 2.3, 2.5, ease.back);
      pose(risen, { x: MX, y: MY + 124, s: rk, r: 2, o: rk > 0.01 ? 1 : 0 });
      pose(G.doorGlow, { x: DX, y: DYD, o: 0.3 + point * 0.4 });
      const eb = bump(t, 2.3, 2.95);
      pose(empty, { x: DX, y: DYD - 70, s: eb * 1.3, r: time * 30, o: eb });
      const sk = es(t, 2.45, 2.75, ease.back);
      swing(said, S.portrait ? 650 : 470, lerp(-900, S.portrait ? 180 : 330, sk), time, 1, 0.8, 2);
      const bb = es(t, 2.6, 2.78, ease.back);
      pose(saidB, { x: S.portrait ? 770 : 590, y: S.portrait ? 168 : 318, s: bb, o: bb > 0.01 ? 1 : 0 });

      S.cam.x = S.portrait ? 210 : 100;   // phone: the angel on the stone clear of the progress thread
      S.cam.y = 20 - es(t, 1.0, 1.4) * 20;
      S.cam.z = S.portrait ? 0.88 : 1.02;
    };
  },
};
