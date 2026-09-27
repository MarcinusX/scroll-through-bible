// J 20,5–6 — At the tomb in the gold of the morning. The younger disciple stoops at the low doorway: a round
// peep-plate comes down and shows what he sees in the dark — the linen cloths lying in a thin beam of light. He does
// not go in; he straightens and waits on the threshold, looking back along the path. Peter comes up behind him,
// out of breath, and — as Peter always does — goes straight in: he bends under the lintel and is swallowed by the
// dark, and a soft light answers from inside.
import { C, person, blinkAt, pose, lerp, hanging, swing, mix, shade } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { PETER, BELOVED, gardenSet, GARDEN_PATH, pathS, DOOR, STONE, GOLD, headAt, linenLying, faceCloth, vignette, withFace, faceBits, sparkle, tr, sky, PI } from './lib.js';

const P = GARDEN_PATH;
function yAt(x) {
  if (x <= P[0][0]) return P[0][1];
  for (let i = 1; i < P.length; i++) if (x <= P[i][0]) { const u = (x - P[i - 1][0]) / (P[i][0] - P[i - 1][0]); return lerp(P[i - 1][1], P[i][1], u); }
  return P[P.length - 1][1];
}

export default {
  id: 'j20-stoop',
  beats: [
    { v: 5, text: 'A kiedy się nachylił, zobaczył leżące płótna,' },
    { v: 5, cont: true, text: 'jednakże nie wszedł do środka.' },
    { v: 6, text: 'Nadszedł potem także Szymon Piotr, idący za nim.' },
    { v: 6, cont: true, text: 'Wszedł on do wnętrza grobu' },
  ],
  cam: { x: [380, 560], y: [0, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const sk = sky(S, GOLD);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep }), { x: 1100, y: 170, len: 900 });
    const cl = hanging(hangL, cloud(c, 150), { x: 760, y: 150, len: 700 });

    const G = gardenSet(S);
    const L = G.walkL;
    const john = S.puppet(L.add(withFace(person(c, { ...BELOVED }), faceBits(c))));
    const peterEl = L.add(withFace(person(c, { ...PETER }), faceBits(c)));
    const peter = S.puppet(peterEl);
    const drops = [0, 1].map(() => L.add(`<path d="${c.cut([[0, -8], [4, 0], [0, 4], [-4, 0]], 0.2, 2)}" fill="#bfe0ee"/>`));

    /* the peep-plate: what he sees through the doorway */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const dark = mix(C.soilDark, C.storm2, 0.35);
    const beamPts = [[-150, -140], [-90, -150], [60, 60], [-40, 70]];
    const inner = `<rect x="-160" y="-160" width="320" height="320" fill="${dark}"/>`
      + `<path d="${c.cut([[-160, 30], [160, 24], [160, 160], [-160, 160]], 0.6, 8)}" fill="${mix(C.rock, C.soilDark, 0.35)}"/>`
      + `<path d="${c.cut([[-160, 24], [160, 18], [160, 34], [-160, 38]], 0.4, 8)}" fill="${mix(C.rock, C.cream, 0.1)}"/>`
      + `<path d="${c.poly(beamPts)}" fill="${C.lampGlow}" opacity=".32"/>`
      + `<ellipse cx="-10" cy="16" rx="120" ry="36" fill="url(#halo-glow)" opacity=".8"/>`
      + `<g transform="translate(-34 26) scale(.72)">${linenLying(c)}</g><g transform="translate(96 26) scale(.72)">${faceCloth(c)}</g>`;
    const peep = hanging(fx, vignette(S, inner, { r: 118, k: 'peep' }), { x: 0, y: 0, len: 700 });
        const glowIn = fx.add(`<g opacity="0"><circle r="120" fill="url(#halo-glow)"/></g>`);
    const wonder = fx.add(`<g>${sparkle(c, 12)}</g>`);

    return (t, T) => {
      swing(sunEl, 1100, 170, T, 0.8, 0.5);
      swing(cl, 760 + (T ? Math.sin(T * 0.1) * 30 : 0), 150, T, 1.2, 0.6, 1);
      pose(G.stone, { x: STONE.x, y: DOOR.y - STONE.r + 2 });
      pose(G.doorGlow, { x: DOOR.x, y: DOOR.y, o: 0 });
      pose(G.doorRays, { x: DOOR.x, y: DOOR.y, o: 0 });

      /* v5a: he stoops at the doorway */
      const stoop = es(t, 0.1, 0.45) * (1 - es(t, 1.05, 1.35));
      const aside = es(t, 1.1, 1.5);            // he steps back from the threshold
      const makeWay = es(t, 2.3, 2.7);
      const jx = 1088 - aside * 26 - makeWay * 70;
      const jy = yAt(jx) + 10 + makeWay * 26;
      const js = pathS(jy) * 1.02;
      const backLook = bump(t, 1.75, 2.35);        // looks back along the path for Peter
      john.set({ x: jx, y: jy, s: js, flip: backLook > 0.5 || (t > 2.3 && t < 2.8 && makeWay < 0.5), walk: (aside > 0 && aside < 1) || (makeWay > 0 && makeWay < 1) ? jx * 0.05 : undefined, amt: 0.6, lean: stoop * 22, armF: 22 + stoop * 26 + aside * (1 - makeWay) * 18 + es(t, 3.1, 3.4) * 20, armB: 10 + stoop * 20, head: stoop * 12 + aside * (1 - makeWay) * 8 - es(t, 3.1, 3.4) * 4, blink: blinkAt(T, 4) });

      const pk = es(t, 0.3, 0.55, ease.back) * (1 - es(t, 2.05, 2.35, ease.in));
      swing(peep, 930, lerp(-700, 300, pk), pk > 0.001 ? T : 0, 1, 0.6);
      fade(peep, pk > 0.001 ? 1 : 0);
      const [hx, hy] = headAt(jx, jy, js, false);

      /* v6a: Peter comes, following him; v6b: he goes straight in */
      const come = es(t, 2.0, 2.85, ease.out);
      const inside = es(t, 3.05, 3.65);
      const px = lerp(620, 1080, come) + inside * 100;
      const py = yAt(px) - 2;
      const ps = pathS(py) * 1.04 * (1 - inside * 0.12);
      const walking = (t > 2.0 && t < 2.85) || (t > 3.05 && t < 3.65);
      peter.set({ x: px, y: py, s: ps, o: seg(t, 2.0, 2.1) * (1 - es(t, 3.72, 3.96) * 0.999), walk: walking ? px * (t < 2.85 ? 0.08 : 0.05) : undefined, amt: t < 2.85 ? 1.2 : 0.7, lean: (t < 2.85 ? 8 : 0) + inside * 24, armF: 30 + inside * 30, armB: 20, head: inside * 10, blink: blinkAt(T, 1) });
      const [pbx, pby] = headAt(px, py, ps, false);
      drops.forEach((d, i) => {
        const k = T ? (T * 1.3 + i * 0.5) % 1 : 0.4 + i * 0.3;
        pose(d, { x: pbx - 16 - i * 10, y: pby - 16 + k * 20, o: es(t, 2.1, 2.3) * (1 - es(t, 2.9, 3.05)) * (1 - k) });
      });
      const gi = es(t, 3.3, 3.7);
      pose(glowIn, { x: DOOR.x, y: DOOR.y - 60, s: 0.6 + gi * 0.5, o: gi * 0.9 });
      pose(G.doorGlow, { x: DOOR.x, y: DOOR.y, o: gi * 0.35 });
      const w = bump(t, 3.55, 3.95);
      pose(wonder, { x: hx + 26, y: hy - 30, s: w, r: T * 30, o: w });

      S.cam.x = lerp(420, 540, es(t, 0, 1)) - es(t, 1.9, 2.5) * 110 + es(t, 2.8, 3.4) * 110;
      S.cam.y = 30 - stoop * 10;
      S.cam.z = (1.08 + es(t, 0, 0.6) * 0.06 - es(t, 1.9, 2.5) * 0.06 + es(t, 2.9, 3.4) * 0.06) * (S.portrait ? 0.96 : 1);
    };
  },
};
