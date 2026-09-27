// J 9,3–5 — "Neither he sinned, nor his parents": Jesus lifts His hand, the dark scraps under the two plates drop
// and crumble, and the plates fly up. "…that the works of God might be revealed in him": sparks of light gather
// from all around and settle on the blind man, a gold word hangs above him. "We must work the works of Him who
// sent Me while it is day" — a day-dial comes down, its little sun climbing; "the night is coming, when no one
// can work" — the sun on its string sinks behind the wall, the dial runs out, dusk, then night creeps over the
// street. "As long as I am in the world, I am the light of the world" — Jesus shines in the dark: a lit globe
// comes down above Him and the night draws back from the light around Him.
import { C, person, CAST, blinkAt, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  gateSet, beggarPlace, G, DAY, EVE, DUSK, NIGHTS, BLIND, FATHER, MOTHER, DISC, manPuppet, hungPlate, iconWord, medallion, question, darkScrap,
  hungGold, dayArc, hourAt, sunToken, globe, radiance, spark, voiceRings, hanging, drop, kf, headAt, vis, tr, pose, mix, PI,
} from './lib.js';

export default {
  id: 'j9-works',
  beats: [
    { v: 3, text: 'Jezus odpowiedział: «Ani on nie zgrzeszył, ani rodzice jego,' },
    { v: 3, cont: true, text: 'ale [stało się tak], aby się na nim objawiły sprawy Boże.' },
    { v: 4, text: 'Potrzeba nam pełnić dzieła Tego, który Mnie posłał, dopóki jest dzień.' },
    { v: 4, cont: true, text: 'Nadchodzi noc, kiedy nikt nie będzie mógł działać.' },
    { v: 5 },
  ],
  cam: { x: [-40, 80], y: [-80, 30], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const set = gateSet(S, { skyCols: DAY, starsN: 90, moonAt: [470, 170] });

    /* night over the street (flat, faded on the compositor), and the light around Him */
    const nightL = S.layer({ par: 0.48, sh: 0, flat: true });
    nightL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.indigo, 0.3)}" opacity=".5"/>`);
    nightL.fade(0);
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const jGlow = glowL.add(`<g><circle r="330" fill="url(#halo-glow)"/><circle r="170" fill="url(#warm-glow)" opacity=".7"/></g>`);

    const act = S.layer({ par: 0.52, sh: 5 });
    const manGlow = act.add(`<g opacity="0">${radiance(c, 90)}</g>`);
    beggarPlace(S, act);
    const man = manPuppet(S, act, BLIND, { pose: 'sit' });
    const dis = DISC.slice(0, 3).map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, o))) }));
    const jesus = S.puppet(act.add(person(c, CAST.jesus)));

    /* voice, sparks */
    const fxA = S.layer({ par: 0.52, sh: 3 });
    const rings = voiceRings(fxA, c, { n: 3, r: 34, w: 4.5, both: false, color: mix(C.halo, C.ochre, 0.3) });
    const sparks = Array.from({ length: 12 }, (_, i) => ({ i, a: (i / 12) * PI * 2 + c.rr(-0.2, 0.2), d: c.rr(260, 420), el: fxA.add(`<g opacity="0">${spark(c, c.rr(8, 12))}</g>`) }));
    const crumbs = Array.from({ length: 8 }, (_, i) => ({ i, el: fxA.add(`<g opacity="0">${darkScrap(c, c.rr(4, 7))}</g>`), dx: c.rr(-24, 24), side: i % 2 }));

    /* the plates from the question, the gold word, the day-dial, the globe */
    const fx = S.layer({ par: 0.2, sh: 5 });
    const pl1 = hanging(fx, hungPlate(c, iconWord(`<g transform="translate(0 -6)">${medallion(c, BLIND, { r: 30 })}</g>`, tr('on?', 'this man?'), { y: 44 }), { r: 64 }), { x: 0, y: 0, len: 900 });
    const pl2 = hanging(fx, hungPlate(c, iconWord(`<g transform="translate(-22 -6)">${medallion(c, FATHER, { r: 22 })}</g><g transform="translate(22 -6)">${medallion(c, MOTHER, { r: 22 })}</g>`, tr('rodzice?', 'his parents?'), { y: 44 }), { r: 64 }), { x: 0, y: 0, len: 900 });
    const scr = [0, 1].map(() => fx.add(`<g><path d="M0 -60V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${darkScrap(c, 16)}</g>`));
    const works = hanging(fx, hungGold(c, tr('sprawy Boże', 'the works of God'), { size: 26 }), { x: 0, y: 0, len: 900 });
    const dial = hanging(fx, dayArc(c, 96, { marks: [12], label: tr('dzień', 'day') }), { x: 0, y: 0, len: 900 });
    const tok = fx.add(`<g>${sunToken(c, 12)}</g>`);
    const world = hanging(fx, `<circle r="140" fill="url(#halo-glow)" class="wg"/>${globe(c, 58)}`, { x: 0, y: 0, len: 900 });
    const wGlow = world.querySelector('.wg');
    const light = hanging(fx, hungGold(c, tr('światłość świata', 'the light of the world'), { size: 28 }), { x: 0, y: 0, len: 900 });

    set.front();

    return (t, time) => {
      const T = time;
      /* the day goes: beat 3 sunset → dusk → night; beat 4 night stays, the light shines */
      const dusk = es(t, 3.0, 3.55), night = es(t, 3.45, 3.95);
      if (night > 0) set.sk.blend(DUSK, NIGHTS, night);
      else if (dusk > 0) set.sk.blend(DAY, DUSK, dusk);
      else set.sk.set(...DAY);
      const sunY = lerp(150, 620, es(t, 2.95, 3.7, ease.in));
      set.update(T, { sunY, sunO: 1 - seg(t, 3.6, 3.75) });
      set.starsL.fade(es(t, 3.5, 4.0));
      if (set.moonEl) { drop(set.moonEl, 470, 170, es(t, 3.55, 4.1, ease.out), T, { amp: 0.8 }); }
      nightL.fade(es(t, 3.2, 3.9) * (1 - es(t, 4.2, 4.7) * 0.45));
      glowL.fade(es(t, 4.1, 4.6));
      pose(jGlow, { x: G.JX + 2, y: G.FLOOR - 120, s: 0.8 + es(t, 4.1, 4.7) * 0.5 });

      /* Jesus: lifts His hand (v3a), turns the hand to the man (v3b), upward (v4a), still (v4b), shining (v5) */
      const lift = bump(t, 0.1, 0.95), toMan = bump(t, 1.05, 1.95), up = bump(t, 2.05, 2.95), shine = es(t, 4.05, 4.4);
      jesus.set({ x: G.JX, y: G.FLOOR + 8, s: 1.02, armF: 16 + toMan * 64 + shine * 40, armB: 10 + lift * 130 + up * 150 + shine * 120, head: -up * 12 + toMan * 6 - shine * 4, blink: blinkAt(T, 1) });
      const [hx, hy] = headAt(G.JX, G.FLOOR + 8, 1.02, false);
      rings(hx + 16, hy + 8, Math.max(bump(t, 0.05, 0.9), bump(t, 2.05, 2.9) * 0.8, bump(t, 4.05, 4.95)), T);

      /* the man: face lifted; the light gathers on him (v3b); turns his face to the warmth (v5) */
      const gather = es(t, 1.1, 1.7);
      man.p.set({ x: G.BEGX, y: G.FLOOR + 4, s: 1, flip: true, armF: 30 + gather * 20, armB: 10 + gather * 30, head: -10 - gather * 6 + es(t, 4.2, 4.6) * 8, blink: 0 });
      fade(man.sad, 0.3 * (1 - gather));
      const [mx, my] = headAt(G.BEGX, G.FLOOR + 4 + 62, 1, true);
      vis(manGlow, { x: mx + 4, y: my + 40, s: 0.4 + gather * 0.8, o: gather * (1 - es(t, 2.6, 3.2)) * 0.55 });
      sparks.forEach((sp) => {
        const k = es(t, 1.05 + sp.i * 0.025, 1.65 + sp.i * 0.025, ease.in);
        const r = sp.d * (1 - k), a = sp.a + k * 1.6;
        const on = k > 0 && k < 1 ? 1 : 0;
        vis(sp.el, { x: mx + Math.cos(a) * r, y: my + 30 + Math.sin(a) * r * 0.7, s: 0.6 + (1 - k) * 0.5, r: T * 60, o: on * Math.min(1, k * 5) });
      });

      /* disciples listen; they look up at the dial, then close in as it grows dark */
      dis.forEach((d) => {
        const x = 704 - d.i * 60 + es(t, 3.4, 3.9) * 14;
        d.p.set({ x, y: G.FLOOR + 12 - d.i * 6, s: 0.96 - d.i * 0.03, armF: 18 + bump(t, 1.2, 1.9) * (d.i === 0 ? 30 : 0), head: -bump(t, 2.1, 3.3) * 14 - es(t, 4.1, 4.5) * 6, blink: blinkAt(T, d.seed) });
      });

      /* v3a — the plates: scraps fall and crumble, the plates fly up */
      const up1 = 1 - es(t, 0.55, 0.95, ease.in);
      drop(pl1, 960, 250, up1, T, { amp: 1.4, seed: 1 });
      drop(pl2, 610, 250, up1, T, { amp: 1.4, seed: 2 });
      const fall = es(t, 0.2, 0.5, ease.in);
      [960, 610].forEach((x, i) => vis(scr[i], { x, y: 386 + fall * 160, r: fall * (i ? -30 : 30), o: (1 - seg(t, 0.4, 0.52)) * (t > -0.5 ? 1 : 0) }));
      crumbs.forEach((cr) => {
        const k = seg(t, 0.45, 0.9);
        const x0 = cr.side ? 610 : 960;
        vis(cr.el, { x: x0 + cr.dx * (1 + k * 2), y: 546 + k * 40 + cr.i * 3, r: k * 200, s: 1 - k * 0.6, o: k > 0 && k < 1 ? (1 - k) : 0 });
      });

      /* v3b — the works of God, in gold above him */
      const wk = es(t, 1.25, 1.6, ease.out) * (1 - es(t, 2.0, 2.3, ease.in));
      drop(works, G.BEGX, 330, wk, T, { amp: 1 });

      /* v4 — the day-dial: the little sun climbs, then runs down to the end of the day */
      const dk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 3.9, 4.15, ease.in));
      drop(dial, 800, 300, dk, T, { amp: 0.6 });
      const hour = lerp(3, 7, es(t, 2.2, 2.9)) + es(t, 3.0, 3.75) * 5.6;
      const [tx, ty] = hourAt(84, hour);
      vis(tok, { x: 800 + tx, y: 300 - (1 - dk) * 700 + ty, s: 1 - seg(hour, 11.6, 12.4) * 0.6, o: dk > 0.01 ? 1 - seg(hour, 11.9, 12.5) : 0 });

      /* v5 — the light of the world */
      const gk = es(t, 4.1, 4.5, ease.out);
      drop(world, 800, 250, gk, T, { amp: 1.1 });
      fade(wGlow, es(t, 4.3, 4.7));
      const lk = es(t, 4.2, 4.6, ease.out);
      drop(light, 800, 138, lk, T, { amp: 0.8, seed: 1 });

      S.cam.x = kf(t, [[0, 30], [0.9, 40], [1.2, 70], [2.0, 70], [2.3, 20], [4, 20], [5, 10]]);
      S.cam.y = kf(t, [[0, -50], [0.9, -40], [1.3, 0], [2.0, 0], [2.3, -60], [4, -50], [4.4, -70], [5, -70]]);
      S.cam.z = kf(t, [[0, 1.03], [1.2, 1.12], [2.0, 1.12], [2.4, 1.02], [4, 1.04], [5, 1.02]]);
    };
  },
};
