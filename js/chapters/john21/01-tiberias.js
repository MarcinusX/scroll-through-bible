// J 21,1–3b — The curtains open on the Sea of Tiberias at evening. A round plate of light comes down over the
// water: the Risen Lord, "again" — the lake's name hangs beside it; "and this is how": the plate lifts away and the
// story starts on the beach. Seven disciples walk in along the shore and stand together by the beached boat; name
// tags drop onto them one by one (Simon Peter; Thomas called Didymus; Nathanael of Cana; the sons of Zebedee; two
// others). Peter shoulders the net: "I am going fishing" — and the others raise their hands: "We are coming too."
import { curtains, flock } from '../kit.js';
import { bird } from '../../assets/things.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  shoreSet, netBundle, addToBody, EVENING, DUSK, SEVEN, TAGS, PETER_BARE, JESUS, fishingBoat, foldedMantle, netDrape, nameTag, portraitPlate, speech, fishIcon,
  hungWord, rayBurst, glowDisc, skyKeys, kf, moving, headAt, hand, vis, pose, fade, person, sheet, shade, mix, C, lerp, blinkAt, tr, FONT, PI,
} from './lib.js';

const GY = 706;                      // where they stand on the beach
const POS = [940, 600, 680, 760, 840, 450, 525];   // x by SEVEN index (Peter nearest the boat)
const POS_P = [1016, 728, 800, 872, 944, 584, 656]; // phone: closer together, so all seven and their tags fit
const BOAT = [1210, 700];

export default {
  id: 'j21-tiberias',
  beats: [
    { cover: true },
    { v: 1, text: 'Potem znowu ukazał się Jezus nad Morzem Tyberiadzkim.' },
    { v: 1, cont: true, text: 'A ukazał się w ten sposób:' },
    { v: 2 },
    { v: 3, text: 'Szymon Piotr powiedział do nich: «Idę łowić ryby».' },
    { v: 3, cont: true, text: 'Odpowiedzieli mu: «Idziemy i my z tobą».' },
  ],
  cam: { x: [-40, 110], y: [-80, 120], z: [1, 1.28] },
  build(S) {
    const c = S.c;
    const K = shoreSet(S, { skyCols: EVENING, sunAt: [420, 300], cloudAt: [1120, 160], beachFn: c.wave(640, [5, 2], [600, 170]) });

    const birds = flock(S, K.hangL, 4, (cc) => bird(cc, { color: mix(C.bird, C.duskViolet, 0.3) }), { y: 190, speed: 40, scale: 0.45 });

    /* the beached boat with its net on the gunwale */
    const boatL = S.layer({ par: 0.45, sh: 4 });
    boatL.add(`<g transform="translate(${BOAT[0]} ${BOAT[1]}) rotate(-3) scale(.82)">${fishingBoat(c, `<g transform="translate(-60 -46)">${foldedMantle(c, C.clay)}</g>`, { lantern: true })}</g>`);
    const netOnBoat = boatL.add(`<g>${netDrape(c, 110, 40)}</g>`);

    /* the vision: the Risen One on a plate of light, the lake's name */
    const fx = S.layer({ par: 0.3, sh: 4 });
    const burst = fx.add(`<g>${rayBurst(c, { n: 18, r0: 70, r1: 380, spread: 0.025, o: 0.35 })}</g>`);
    const plate = fx.add(portraitPlate(S, JESUS, { r: 74, sc: 1.15, dy: 26 }));
    const lakeName = fx.add(hungWord(c, tr('Morze Tyberiadzkie', 'the Sea of Tiberias'), { size: 24 }));

    /* the seven */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const XS = S.portrait ? POS_P : POS;
    const M = SEVEN.map((m, i) => ({ ...m, i, x: XS[i], seed: c.rr(0, 9), from: -260 - i * 70 }));
    const order = [...M].sort((a, b) => a.x - b.x);
    order.forEach((m) => { m.p = S.puppet(PL.add(person(c, m.o))); });
    // Peter with the net over his shoulder (swap)
    const pNet = S.puppet(PL.add(addToBody(person(c, M[0].o), netBundle(c))));

    /* name tags */
    const tagL = S.layer({ par: 0.52, sh: 4 });
    const TG = TAGS();
    const tagAt = [[XS[0]], [XS[1]], [XS[2]], [XS[3], XS[4]], [XS[5], XS[6]]];
    const tagStep = 58;   // neighbouring tags hang on two clear levels, the lower one clear of the heads
    const tags = TG.map((txt, i) => {
      const xs = tagAt[i];
      const x = xs.reduce((a, b) => a + b, 0) / xs.length;
      return { i, x, el: tagL.add(`<g>${xs.length > 1 ? `<path d="M${-(xs[1] - xs[0]) / 2} 60L0 12L${(xs[1] - xs[0]) / 2} 60" stroke="${C.wood2}" stroke-width="1.4" fill="none" opacity=".6"/>` : ''}<path d="M0 -1400V12" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, txt, { size: 15 })}</g>`) };
    });

    /* words */
    const say1 = PL.add(`<g>${speech(c, `<g transform="translate(-6 0)">${fishIcon(c, 1, 0.8)}</g><path d="${c.ribbon([[18, 4], [30, 4]], 2.4)}" fill="${C.inkSoft}"/><path d="${c.poly([[30, -2], [38, 4], [30, 10]])}" fill="${C.inkSoft}"/>`, { w: 92, h: 50 })}</g>`);
    const say2 = PL.add(`<g>${speech(c, `<text x="0" y="6" text-anchor="middle" font-family="${FONT}" font-size="19" font-style="italic" fill="${C.ink}">${tr('i my z tobą!', 'we’re coming too!')}</text>`, { w: 150, h: 46, flip: true })}</g>`);

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      skyKeys(K.sk, t, [[0.5, EVENING], [5.8, mix3(EVENING, DUSK, 0.6)]]);
      const sunY = lerp(300, 400, es(t, 0.5, 5.9));
      K.idle(T, { sunY });
      birds(T, 1 - es(t, 5.2, 5.9));

      /* v1a — the plate of the Risen One comes down; the lake is named */
      const pk = es(t, 1.05, 1.5, ease.out) * (1 - es(t, 2.1, 2.55, ease.in));
      vis(plate, { x: 800, y: lerp(-420, 290, pk), r: T ? Math.sin(T * 0.7) * 1.2 : 0, o: pk > 0.01 ? 1 : 0 });
      vis(burst, { x: 800, y: lerp(-420, 290, pk), s: 0.6 + pk * 0.5, r: T * 3, o: pk * 0.55 });
      const nk = es(t, 1.3, 1.65, ease.out) * (1 - es(t, 2.05, 2.4, ease.in));
      vis(lakeName, { x: 800, y: lerp(-300, 430, nk), r: T ? Math.sin(T * 0.9 + 1) * 1.5 : 0, o: nk > 0.01 ? 1 : 0 });

      /* v1b — "this is how": they walk in along the shore; v2 — together */
      const lift = es(t, 3.3, 3.5);
      const shoulder = es(t, 4.35, 4.45);
      const agree = es(t, 5.1, 5.4);
      M.forEach((m) => {
        const a = 2.15 + m.i * 0.07;
        const keys = [[a, m.from], [a + 0.75, m.x]];
        const x = kf(t, keys, ease.out);
        const walking = moving(t, keys);
        const flip = m.i === 0 ? false : m.x > 800;
        const isP = m.i === 0;
        const toP = !isP && es(t, 4.1, 4.3);
        const raise = !isP ? agree * (m.i % 2 ? 1 : 0.75) : 0;
        const po = {
          x, y: GY + (m.i % 2) * 6, s: 0.84, flip: walking ? false : (isP ? es(t, 4.05, 4.15) > 0.5 : flip), walk: walking ? x * 0.06 : undefined,
          armF: 12 + raise * 30, armB: 8 + raise * 140, head: (toP ? 4 : 0) - raise * 4, blink: blinkAt(T, m.seed),
        };
        if (isP) {
          m.p.set({ ...po, o: 1 - shoulder });
          pNet.set({ ...po, flip: true, armF: 30 + bump(t, 4.4, 4.95) * 50, armB: 70, o: shoulder, head: -4 });
        } else m.p.set(po);
        m.cx = x;
      });
      fade(netOnBoat, 1 - shoulder);
      pose(netOnBoat, { x: BOAT[0] - 40, y: BOAT[1] - 52 });

      tags.forEach((g) => {
        const k = es(t, 3.05 + g.i * 0.14, 3.35 + g.i * 0.14, ease.back) * (1 - es(t, 4.05, 4.35, ease.in));
        vis(g.el, { x: g.x, y: lerp(-200, GY - 262 - (g.i % 2) * tagStep, k), r: T ? Math.sin(T * 0.9 + g.i) * 2 : 0, o: k > 0.01 ? 1 : 0 });
      });

      /* v3a — "I am going fishing" */
      const [px, py] = headAt(M[0].x, GY, 0.84, false);
      const s1 = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.95, 5.05));
      vis(say1, { x: px + 16, y: py - 20, s: s1, o: s1 > 0.01 ? 1 : 0 });
      /* v3b — "we are coming with you" */
      const s2 = es(t, 5.12, 5.35, ease.back);
      vis(say2, { x: S.portrait ? 800 : 700, y: GY - 200, s: s2, o: s2 > 0.01 ? 1 : 0 });

      // phone: towards Peter while he speaks, so his bubble is clear of the screen edge
      S.cam.x = kf(t, [[0, 0], [1, 0], [2.2, 0], [3.2, S.portrait ? 10 : -10], [4.2, S.portrait ? 100 : 40], [5.2, S.portrait ? 30 : 10]]);
      S.cam.y = kf(t, [[0, 10], [1.0, -60], [2.0, -50], [2.6, 80], [4.2, 110], [5.2, 100]]);
      S.cam.z = kf(t, [[0, 1.0], [1.0, 1.03], [2.2, 1.02], [3.2, 1.14], [4.2, 1.26], [5.2, 1.2]]);
    };
  },
};

function mix3(a, b, k) { return a.map((x, i) => mix(x, b[i], k)); }
