// Łk 23,32–34 — Golgotha from afar (Mark 15's hill). Along the road come two others, criminals, their hands
// bound, led out with Him between soldiers; ahead Simon carries the cross and Jesus walks. At the place called
// the Skull (its name comes down), everything is seen quietly from far away: the cross is raised on the bare hill,
// a small dark silhouette with a thin ring of light — and two more, one on His right, one on His left.
// "Father, forgive them, for they know not what they do": the words hang in the sky in gold, and a soft light
// runs down the hill towards the people below. In the foreground the soldiers kneel round His garments and cast
// lots: the dice tumble on the cloth.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, headAt, soldier, carriedCross, bonds, garments, dice, nameTag, wordCard, voiceRings, hanging, swing, golgothaSet, setCrosses, driftClouds, crossHead, THIEF_L, THIEF_R, LOOK, GOL, SKIES, tr, PI } from './lib.js';

const RY = 700;

export default {
  id: 'lk23-skull',
  beats: [
    { v: 32 },
    { v: 33, text: 'Gdy przyszli na miejsce, zwane «Czaszką»,' },
    { v: 33, cont: true, text: 'ukrzyżowali tam Jego i złoczyńców, jednego po prawej, drugiego po lewej Jego stronie.' },
    { v: 34, text: 'Lecz Jezus mówił: «Ojcze, przebacz im, bo nie wiedzą, co czynią».' },
    { v: 34, cont: true, text: 'Potem rozdzielili między siebie Jego szaty, rzucając losy.' },
  ],
  cam: { x: [-40, 60], y: [-60, 120], z: [0.98, 1.2] },
  build(S) {
    const c = S.c;
    const G = golgothaSet(S);
    const P = G.P;
    /* the procession on the road */
    const proc = [
      { el: soldier(c, 1), dx: 0, k: 'sol' }, { el: person(c, { ...THIEF_L, holdF: bonds(c) }), dx: -120, k: 'th' },
      { el: soldier(c, 3), dx: -230, k: 'sol' }, { el: person(c, { ...THIEF_R, holdF: bonds(c) }), dx: -340, k: 'th' },
      { el: soldier(c, 2), dx: -450, k: 'sol' },
    ].map((m, i) => ({ ...m, i, p: S.puppet(P.add(m.el)), seed: c.rr(0, 9) }));
    const simon = S.puppet(P.add(person(c, LOOK.simon)));
    const cross = P.add(`<g>${carriedCross(c)}</g>`);
    const jes = S.puppet(P.add(person(c, CAST.jesus)));
    /* the soldiers at the foot, dividing the garments */
    const kneel = [[610, 712, false], [700, 724, false], [900, 724, true], [990, 712, true]].map(([x, y, f], i) => ({ x, y, f, i, p: S.puppet(P.add(soldier(c, i, { pose: 'kneel', spear: false }))), seed: c.rr(0, 9) }));
    const g = garments(c);
    const fx = G.fx;
    const cloth = fx.add(`<g>${sheet().p(c.cut([[-110, -8], [104, -12], [118, 10], [-114, 12]], 0.8, 8), C.stone2).out()}</g>`);
    const tunic = fx.add(`<g>${g.tunic}</g>`);
    const mantle = fx.add(`<g>${g.mantle}</g>`);
    const dz = fx.add(`<g>${dice(c)}</g>`);
    const d0 = dz.querySelector('.d0'), d1 = dz.querySelector('.d1');
    /* the name, the words, the light */
    const tagL = S.layer({ par: 0.12, sh: 5 });
    const skullTag = hanging(tagL, nameTag(c, tr('«Czaszka»', 'The Skull'), { size: 22 }), { x: 0, y: -1500, len: 900 });
    const words = hanging(tagL, wordCard(c, tr(['«Ojcze, przebacz im,', 'bo nie wiedzą, co czynią»'], ['“Father, forgive them,', 'for they don’t know what they are doing.”']), { size: 23, fill: '#fff6dc' }), { x: 0, y: -1500, len: 900 });
    const [chx, chy] = crossHead(GOL.H);
    const HX = GOL.x + chx, HY = GOL.top + chy;
    // light behind the crosses (a sheet slipped in behind the hill), never over them
    const behind = S.layer({ par: 0.16, sh: 1, flat: true });
    G.hillL.el.parentNode.insertBefore(behind.el, G.hillL.el);
    const light = behind.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    const wash = G.onHill.add(`<g><ellipse rx="520" ry="120" fill="url(#halo-glow)"/></g>`);
    const rings = voiceRings(behind, c, { n: 3, color: C.halo, r: 22, w: 3 });

    return (t, time) => {
      const T = time;
      G.sk.blend(SKIES.storm, SKIES.grey, 0.3 + es(t, 0, 5) * 0.3);
      driftClouds(G, T);

      /* v32 — the procession: Jesus, Simon with the cross, the two criminals between soldiers */
      const walk = seg(t, -0.4, 1.0);
      const gone = es(t, 1.95, 2.15);
      const lead = lerp(240, 680, ease.out(walk));
      jes.set({ x: lead + 170, y: RY, s: 0.86, flip: false, walk: walk > 0 && walk < 1 ? lead * 0.05 : undefined, amt: 0.6, armF: 14, armB: 8, head: 6, o: 1 - gone, blink: blinkAt(T) });
      simon.set({ x: lead + 60, y: RY - 4, s: 0.86, flip: false, walk: walk > 0 && walk < 1 ? lead * 0.05 : undefined, amt: 0.7, armF: 70, armB: 40, lean: 8, head: 8, o: 1 - gone, blink: blinkAt(T, 2) });
      pose(cross, { x: lead + 50, y: RY - 4 - 118 + 20, s: 0.86, r: 60, o: 1 - gone });
      proc.forEach((m) => {
        const x = lead + m.dx;
        m.p.set({ x, y: RY + (m.i % 2) * 6, s: 0.86, flip: false, walk: walk > 0 && walk < 1 ? x * 0.05 + m.i : undefined, amt: m.k === 'th' ? 0.7 : 1, armF: m.k === 'th' ? 30 : 34, armB: m.k === 'th' ? 28 : 10, head: m.k === 'th' ? 8 : 0, o: 1 - gone, blink: blinkAt(T, m.seed) });
      });

      /* v33 — the Skull; the three crosses are raised */
      const tk = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 2.9, 3.2));
      swing(skullTag, S.portrait ? 920 : 1080, 250 - (1 - tk) * 900, T, 1.1, 0.8, 1);
      setCrosses(G, es(t, 2.05, 2.45), es(t, 2.3, 2.65), es(t, 2.4, 2.75));
      const up = es(t, 2.05, 2.45);
      pose(light, { x: HX, y: HY + 20, s: 0.5 + up * 0.5 + es(t, 3.05, 3.4) * 0.3, o: up * (0.4 + es(t, 3.05, 3.4) * 0.35) });

      /* v34a — "Father, forgive them" */
      const fk = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 3.95, 4.2));
      swing(words, 800, 150 - (1 - fk) * 900, T, 0.8, 0.6, 2);
      rings(HX + 6, HY, bump(t, 3.05, 3.9), T, { spread: 2.4, speed: 0.6 });
      const wk = es(t, 3.15, 3.7) * (1 - es(t, 3.9, 4.15));
      pose(wash, { x: GOL.x, y: GOL.top + 170 + wk * 40, s: 0.4 + wk * 0.6, o: wk * 0.55 });

      /* v34b — the garments divided, lots cast */
      const div = es(t, 3.95, 4.2);
      kneel.forEach((k) => {
        const lean = bump(t, 4.2 + k.i * 0.06, 4.6 + k.i * 0.06);
        k.p.set({ x: k.x, y: k.y, s: 0.95, flip: k.f, o: div, armF: 50 + lean * 40 + (k.i === 1 ? bump(t, 4.25, 4.55) * 60 : 0), armB: 20 + (k.i === 3 ? es(t, 4.55, 4.8) * 90 : 0), lean: 8 + lean * 6, head: 12, blink: blinkAt(T, k.seed) });
      });
      pose(cloth, { x: 800, y: 712, o: div });
      pose(tunic, { x: 770, y: 700, o: div });
      const lift = es(t, 4.55, 4.8);
      pose(mantle, { x: lerp(830, 950, lift), y: lerp(702, 612, lift), r: lift * -20, o: div });
      const roll = seg(t, 4.2, 4.6);
      pose(d0, { x: lerp(-60, -12, roll), y: -Math.sin(roll * PI) * 70, r: roll * 540 });
      pose(d1, { x: lerp(-50, 14, roll), y: -Math.sin(roll * PI) * 90 + 4, r: -roll * 480 });
      pose(dz, { x: 800, y: 702, o: roll > 0 ? div : 0 });

      S.cam.x = lerp(-20, 30, walk) * (1 - gone);
      S.cam.z = lerp(1.14, 1.0, es(t, 1.8, 2.6)) + es(t, 3.9, 4.4) * 0.06;
      S.cam.y = lerp(90, -20, es(t, 1.8, 2.6)) + es(t, 3.9, 4.4) * 60;
    };
  },
};
