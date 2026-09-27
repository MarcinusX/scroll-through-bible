// J 20,16–17 — "Mary!" One word — her name — and the veil of tears tears in two and falls away, and the whole
// garden bursts into bloom around Him in a wave: every bud opens, the olive is white with blossom. She turns, sinks to
// her knees: "Rabbouni!" — which means Teacher. She reaches out to hold Him; gently He lifts His hand: do not hold
// Me — I have not yet gone up to the Father (a stair of light rises from Him to the great light above). Go to my
// brothers: He points to the city, and the faces of the disciples come down on their strings; golden threads run
// from the light above to Him and to each of them — my Father and your Father, my God and your God.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, flock } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import {
  MAGD, GJ, GM, ELEVEN, easterGarden, DOOR, STONE, GOLD, headAt, voiceRings, bubble, strip, tearVeil, withFace, faceBits, glory, heart,
  radiance, glowDisc, threads, medallion, sparkle, goldWord, tr, sky,
} from './lib.js';

export default {
  id: 'j20-rabbuni',
  beats: [
    { v: 16, text: 'Jezus rzekł do niej: «Mario!»' },
    { v: 16, cont: true, text: 'A ona obróciwszy się powiedziała do Niego po hebrajsku: «Rabbuni»,' },
    { v: 16, cont: true, text: 'to znaczy: Nauczycielu!' },
    { v: 17, text: 'Rzekł do niej Jezus: «Nie zatrzymuj Mnie,' },
    { v: 17, cont: true, text: 'jeszcze bowiem nie wstąpiłem do Ojca.' },
    { v: 17, cont: true, text: 'Natomiast udaj się do moich braci i powiedz im:' },
    { v: 17, cont: true, text: '"Wstępuję do Ojca mego i Ojca waszego oraz do Boga mego i Boga waszego"».' },
  ],
  cam: { x: [-320, 220], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const sk = sky(S, GOLD);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep }), { x: 1230, y: 170, len: 900 });
    const cl = hanging(hangL, cloud(c, 160), { x: 560, y: 150, len: 700 });
    const birds = flock(S, hangL, 6, (cc) => bird(cc, { color: C.bird }), { y: 220, speed: 55, scale: 0.5 });

    const E = easterGarden(S);
    const G = E.G, L = G.walkL;
    const gl = L.add(`<g>${glory(c, 190, 20)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const mk = (P) => { const el = L.add(withFace(person(c, { ...MAGD, pose: P }), faceBits(c))); return { p: S.puppet(el), sad: el.querySelector('[data-part="sad"]'), tear: el.querySelector('[data-part="tear"]') }; };
    const mS = mk('stand'), mK = mk('kneel');
    const rings = voiceRings(L, c, { n: 4, color: C.halo, r: 34, w: 5, both: false });

    // the veil, in two halves
    const vL = S.layer({ par: 0.53, sh: 3 });
    const V = tearVeil(c, 200, 320);
    const veilL = vL.add(`<g><path d="M-60 -1600V-160" stroke="rgba(74,54,34,.45)" stroke-width="1.2" fill="none"/>${V.l}</g>`);
    const veilR = vL.add(`<g><path d="M60 -1600V-160" stroke="rgba(74,54,34,.45)" stroke-width="1.2" fill="none"/>${V.r}</g>`);

    // the light above, the stair of light, the brothers, the threads
    const up = S.layer({ par: 0.5, sh: 3 });
    const TOP = { x: GJ.x + 40, y: 150 };
    const above = up.add(`<g>${glowDisc(200, 'halo-glow', 0.9)}<g transform="scale(.36)">${radiance(c, 150)}</g></g>`);
    const stair = up.add(`<path d="M${GJ.x + 6} ${GJ.y - 200}C${GJ.x - 30} 380 ${TOP.x + 40} 300 ${TOP.x} ${TOP.y + 50}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" stroke="${C.halo}" stroke-width="14" stroke-linecap="round" fill="none" opacity=".85"/>`);
    const steps = up.add(`<path d="M${GJ.x + 6} ${GJ.y - 200}C${GJ.x - 30} 380 ${TOP.x + 40} 300 ${TOP.x} ${TOP.y + 50}" pathLength="1" stroke-dasharray=".012 .03" stroke="#fffaf0" stroke-width="16" fill="none" opacity="0"/>`);
    const setThread = threads(up, 12, { color: C.haloRim, w: 2 });
    const fx = S.layer({ par: 0.54, sh: 5 });
    const MED = ELEVEN.map((m, i) => {
      const row = i < 6 ? 0 : 1;
      const x = row ? 496 + (i - 6) * 52 : 470 + i * 52, y = row ? 398 : 334;
      return { i, x, y, el: hanging(fx, medallion(c, m.o, { r: 21, back: C.parchment }), { x, y: -900, len: 700 }) };
    });
    const bros = fx.add(`<g>${strip(c, tr('do moich braci', 'to my brothers'), { size: 18 })}</g>`);
    const name = fx.add(`<g>${goldWord(c, tr('Mario!', 'Mary!'), { size: 34, fill: C.cream, ink: C.terracotta })}</g>`);
    const rab = fx.add(`<g>${bubble(c, tr('Rabbuni!', 'Rabboni!'), { size: 26, tail: -1 })}</g>`);
    const teach = fx.add(`<g>${strip(c, tr('= Nauczycielu!', '= Teacher!'), { size: 19, fill: C.halo })}</g>`);
    const love = fx.add(`<g>${heart(c, 15, C.jesusMantle)}</g>`);
    const sp = [0, 1, 2, 3].map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));

    return (t, T) => {
      swing(sunEl, 1230, 170, T, 0.8, 0.5);
      swing(cl, 560 + (T ? Math.sin(T * 0.1) * 30 : 0), 150, T, 1.2, 0.6, 1);
      birds(T, es(t, 0.4, 0.9));
      pose(G.stone, { x: STONE.x, y: DOOR.y - STONE.r + 2 });
      pose(G.doorGlow, { x: DOOR.x, y: DOOR.y, o: 0 });
      pose(G.doorRays, { x: DOOR.x, y: DOOR.y, o: 0 });

      /* v16a: "Mary!" — the veil tears and falls, the garden blooms */
      const call = es(t, 0.05, 0.3);
      const tear = es(t, 0.3, 0.75, ease.in);
      pose(veilL, { x: GJ.x + 16 - tear * 120, y: 560 + tear * 500, r: -tear * 18, o: tear < 0.98 ? 1 : 0 });
      pose(veilR, { x: GJ.x + 16 + tear * 90, y: 560 + tear * 520, r: tear * 14, o: tear < 0.98 ? 1 : 0 });
      E.bloom(es(t, 0.3, 1.0, ease.out));
      const shine = es(t, 0.25, 0.7);
      pose(gl, { x: GJ.x, y: GJ.y - 110, s: 0.6 + shine * 0.5, r: t * 5, o: 0.25 + shine * 0.5 - es(t, 3.9, 4.3) * 0.25 });
      const [jhx, jhy] = headAt(GJ.x, GJ.y, 1.08, false);
      rings(jhx + 22, jhy, bump(t, 0.02, 0.95) + bump(t, 3.02, 3.95) * 0.6, T, { dir: 1, spread: 1.8 });
      const nk = es(t, 0.1, 0.3, ease.back) * (1 - es(t, 0.92, 1.05));
      pose(name, { x: (jhx + GM.x) / 2 + 20, y: jhy - 70, s: nk, r: -3, o: nk > 0.01 ? 1 : 0 });

      /* v16b–c: she turns, kneels: "Rabbouni!" — Teacher */
      const turn = seg(t, 1.05, 1.12);
      const kneel = seg(t, 1.32, 1.39);
      const rise = seg(t, 5.08, 5.15);
      const reach = es(t, 3.05, 3.3) * (1 - es(t, 3.8, 4.05));
      const point = es(t, 5.05, 5.3);
      const stand = rise;
      mS.p.set({ x: GM.x - (stand ? 30 : 0), y: GM.y, s: 1.02, flip: turn > 0.5, o: (1 - kneel) + stand, armF: turn > 0.5 ? 30 + point * 10 : 18, armB: turn > 0.5 ? 16 : 140, head: turn > 0.5 ? -4 - point * 4 : 12, blink: blinkAt(T, 3) });
      fade(mS.sad, 1 - turn); fade(mS.tear, 1 - turn);
      const kx = GM.x - 60;
      mK.p.set({ x: kx, y: GM.y, s: 1.02, flip: true, o: kneel * (1 - stand), armF: 60 + reach * 40 + (T ? Math.sin(T * 1.2) * 2 : 0), armB: 40 + reach * 50, head: -10 + reach * 4, lean: reach * 8, blink: blinkAt(T, 3) });
      fade(mK.sad, 0); fade(mK.tear, 0);
      const [mhx, mhy] = headAt(kx, GM.y, 1.02, true, 46);
      const rb = es(t, 1.4, 1.6, ease.back) * (1 - es(t, 2.92, 3.02));
      pose(rab, { x: mhx + 40, y: mhy - 30, s: rb, o: rb > 0.01 ? 1 : 0 });
      const tc = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.92, 3.02));
      pose(teach, { x: mhx + 20, y: mhy - 20, s: tc, r: -2, o: tc > 0.01 ? 1 : 0 });
      const hb = es(t, 2.2, 2.45, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(love, { x: (jhx + mhx) / 2 + 10, y: jhy - 10 - hb * 10, s: hb, o: hb > 0.01 ? 1 : 0 });
      sp.forEach((el, i) => {
        const b = bump(t, 1.45 + i * 0.1, 2.1 + i * 0.1);
        pose(el, { x: mhx - 40 + i * 30, y: mhy - 60 - (i % 2) * 24, s: b, r: T * 30 + i * 30, o: b });
      });

      /* v17a–b: do not hold Me — I have not yet ascended to the Father */
      const hold = es(t, 3.05, 3.3);
      const upK = es(t, 4.05, 4.7);
      const lookUp = es(t, 4.05, 4.35) * (1 - es(t, 5.0, 5.2));
      jesus.set({
        x: GJ.x, y: GJ.y, s: 1.08, flip: point > 0.5 && t < 6.05,
        armF: 20 + hold * 30 * (1 - upK) + point * 60 * (1 - es(t, 6.0, 6.3)) + es(t, 6.05, 6.4) * 30, armB: 10 + hold * 70 * (1 - lookUp) + lookUp * 130 * (1 - point) + es(t, 6.05, 6.4) * 90,
        head: 4 - lookUp * 18 - es(t, 6.05, 6.4) * 10, blink: blinkAt(T),
      });
      const ab = es(t, 4.0, 4.5);
      pose(above, { x: TOP.x, y: TOP.y, s: 0.4 + ab * 0.6 + (T ? Math.sin(T * 1.3) * 0.02 : 0), o: ab });
      attr(stair, 'stroke-dashoffset', (1 - upK).toFixed(3));
      fade(stair, upK > 0.001 ? 0.85 * (1 - es(t, 5.0, 5.4) * 0.5) : 0);
      fade(steps, es(t, 4.55, 4.8) * 0.8 * (1 - es(t, 5.0, 5.4) * 0.5));

      /* v17c: go to my brothers */
      MED.forEach((m) => {
        const k = es(t, 5.1 + m.i * 0.03, 5.45 + m.i * 0.03, ease.back);
        swing(m.el, m.x, lerp(-900, m.y, k), k > 0.001 ? T : 0, 1.2, 0.8, m.i);
      });
      const bk = es(t, 5.4, 5.6, ease.back) * (1 - es(t, 5.95, 6.05));
      pose(bros, { x: 600, y: 450, s: bk, r: -2, o: bk > 0.01 ? 1 : 0 });

      /* v17d: my Father and your Father — threads of light from above to Him and to each of them */
      const th = es(t, 6.05, 6.6);
      MED.forEach((m, i) => {
        const k = es(t, 6.1 + i * 0.025, 6.45 + i * 0.025);
        setThread(i, TOP.x, TOP.y + 30, lerp(TOP.x, m.x, k), lerp(TOP.y + 30, m.y - 24, k), k * 0.8);
      });
      setThread(11, TOP.x, TOP.y + 30, lerp(TOP.x, jhx, th), lerp(TOP.y + 30, jhy - 30, th), th * 0.9);

      S.cam.x = 190 - es(t, 5.0, 5.5) * (S.portrait ? 490 : 70);
      S.cam.y = 24 - lookUp * 60 - es(t, 5.0, 5.5) * 20 * (1 - lookUp);
      S.cam.z = 1.06 - es(t, 4.0, 4.5) * 0.06 + es(t, 1.2, 1.6) * 0.04 * (1 - es(t, 3.9, 4.2));
    };
  },
};
