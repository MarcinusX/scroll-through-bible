// Łk 23,47–49 — after His death: Golgotha from afar in the pale after-light (Mark 15's cut), the crosses small
// and still, His head bowed. In front stands the centurion: seeing what has happened he takes off his helmet and
// lifts his hand to heaven, glorifying God, then lays it on his heart: "Certainly this man was righteous." The
// crowds who had come to watch go home along the road towards the city, beating their breasts. Further off on a
// rise stand all who knew Him, at a distance; and the women who had followed Him from Galilee stand watching.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { headAt, centurion, romanHelmet, bubble, strip, withFace, faceBits, face, golgothaSet, setCrosses, driftClouds, crossHead, pose3, folkO, hanging, swing, MAGD, MARYJ, SALOME, GOL, SKIES, tr, PI } from './lib.js';

const GY = 716;

export default {
  id: 'lk23-centurion',
  beats: [
    { v: 47, text: 'Na widok tego, co się działo, setnik oddał chwałę Bogu' },
    { v: 47, cont: true, text: 'i mówił: «Istotnie, człowiek ten był sprawiedliwy».' },
    { v: 48 },
    { v: 49, text: 'Wszyscy Jego znajomi stali z daleka;' },
    { v: 49, cont: true, text: 'a również niewiasty, które Mu towarzyszyły od Galilei, przypatrywały się temu.' },
  ],
  cam: { x: [-40, 60], y: [-40, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const G = golgothaSet(S, { pal: SKIES.after });
    const hd = G.crossC.querySelector('.hd'), hl = G.crossC.querySelector('.hl');
    const u = GOL.H / 240;
    pose(hd, { x: 0, y: -GOL.H + 50 * u, r: 28 });
    fade(hl, 0.45);
    const behind = S.layer({ par: 0.12, sh: 1, flat: true });
    G.hillL.el.parentNode.insertBefore(behind.el, G.hillL.el);
    const [chx, chy] = crossHead(GOL.H);
    behind.add(`<g transform="translate(${GOL.x + chx} ${GOL.top + chy + 30})"><circle r="150" fill="url(#halo-glow)" opacity=".6"/></g>`);
    const P = G.P;
    /* the acquaintances, far off on a rise (one still group) */
    const knownL = S.layer({ par: 0.3, sh: 4 });
    const known = knownL.sprite(pose3(c, [0, 1, 2, 3, 4].map((i) => ({ x: i * 34 + c.rr(-4, 4), y: (i % 2) * 8, s: 0.62, flip: true, o: folkO(c, i !== 2), armF: [10, 40, 90, 14, 20][i], armB: 8, head: -8 }))), S.portrait ? 480 : 300, 600);
    /* the crowds going home, beating their breasts: each group drawn twice (fists at the chest / raised) */
    const walkers = [0, 1, 2, 3, 4].map((i) => {
      const mem = (beat) => [0, 1, 2].map((k) => ({ x: k * 46 + (i * 7 % 11), y: (k % 2) * 12, s: 0.9, flip: true, o: folkO(c), armF: beat ? 92 : 60, armB: beat ? 40 : 20, head: 12 }));
      const x0 = 1150 + i * 150, y = GY - 22 + (i % 2) * 12;
      return { i, a: P.sprite(pose3(c, mem(0)), x0, y), b: P.sprite(pose3(c, mem(1)), x0, y), x0, y };
    });
    /* the women from Galilee */
    const W = [[MAGD, 610], [MARYJ, 530], [SALOME, 455]].map(([o, x], i) => ({ i, x, p: S.puppet(P.add(withFace(person(c, o), faceBits(c)))), seed: c.rr(0, 9) }));
    /* the centurion */
    const faceLight = P.add(`<g><circle r="110" fill="url(#warm-glow)"/></g>`);
    const cHelm = S.puppet(P.add(centurion(c, { holdF: `<path d="${c.ribbon([[0, -20], [0, 150]], 3.4)}" fill="${C.wood2}"/>` })));
    const cBare = S.puppet(P.add(centurion(c, { helmet: false, holdF: `<g transform="translate(4 6) rotate(90) scale(.9)">${romanHelmet(c, { transverse: true })}</g>` })));
    const fx = G.fx;
    const say = fx.add(`<g>${bubble(c, tr(['Istotnie, człowiek ten', 'był sprawiedliwy'], ['Certainly this', 'was a righteous man']), { size: 21, dir: 1, fill: C.cream })}</g>`);
    const tagL = S.layer({ par: 0.4, sh: 5 });
    const farTag = tagL.add(`<g>${strip(c, tr('z daleka', 'at a distance'), { size: 15 })}</g>`);
    const galTag = hanging(tagL, strip(c, tr('od Galilei', 'from Galilee'), { size: 16 }), { x: 0, y: -1500, len: 900 });

    return (t, time) => {
      const T = time;
      G.sk.blend(SKIES.after, SKIES.dusk, es(t, 0, 5) * 0.35);
      driftClouds(G, T);
      setCrosses(G, 1, 1, 1);

      /* v47 — the centurion glorifies God */
      const bare = es(t, 0.1, 0.18);
      const praise = es(t, 0.2, 0.5) * (1 - es(t, 1.0, 1.3));
      const heart = es(t, 1.05, 1.35);
      const cx = S.portrait ? 1005 : 1090, cy = 708, cs = 1.1;   // phone: the centurion whole, clear of the thread
      cHelm.set({ x: cx, y: cy, s: cs, flip: true, o: 1 - bare, armF: 24, armB: 10, head: -14, blink: blinkAt(T) });
      cBare.set({ x: cx, y: cy, s: cs, flip: true, o: bare, armF: 16 + heart * 20, armB: 10 + praise * 150 + heart * 62 * (1 - praise), head: -18 - praise * 6, lean: -heart * 3, blink: blinkAt(T) });
      const [hx, hy] = headAt(cx, cy, cs, true);
      pose(faceLight, { x: hx - 20, y: hy + 10, s: 0.6 + heart * 0.4, o: 0.25 + praise * 0.3 + heart * 0.25 });
      const k = es(t, 1.1, 1.4, ease.back) * (1 - es(t, 1.95, 2.1));
      pose(say, { x: hx - 34, y: hy - 30, s: k, o: k > 0.02 ? 1 : 0 });

      /* v48 — the crowds go home beating their breasts */
      const go = seg(t, 1.95, 3.5);
      const beat = T ? Math.floor(t * 14) % 2 : 0;
      walkers.forEach((w) => {
        const x = lerp(w.x0, w.x0 - 1500, go);
        const on = go > 0 && x > -300 ? 1 : 0;
        w.a.set({ x, y: w.y, o: on && !beat ? 1 : 0 });
        w.b.set({ x, y: w.y, o: on && beat ? 1 : 0 });
      });

      /* v49a — those who knew Him, at a distance */
      const kk = es(t, 3.0, 3.35);
      known.set({ x: S.portrait ? 480 : 300, y: 600, o: kk });
      const ft = es(t, 3.2, 3.45, ease.back) * (1 - es(t, 4.9, 5));
      pose(farTag, { x: S.portrait ? 550 : 370, y: 450, s: ft, o: ft > 0.02 ? 1 : 0 });

      /* v49b — the women from Galilee */
      W.forEach((w) => {
        const K = es(t, 3.9 + w.i * 0.08, 4.35 + w.i * 0.08);
        w.p.set({ x: w.x - (1 - K) * 200, y: GY, s: 1.02, flip: false, walk: K > 0 && K < 1 ? w.x * 0.05 - K * 10 : undefined, armF: 14 + (w.i === 0 ? 126 : 16) * K, armB: 8, head: w.i === 0 ? 10 : -10, o: K > 0 ? 1 : 0, blink: blinkAt(T, w.seed) });
        face(w.p.el, 'sad', 1);
        face(w.p.el, 'tear', w.i === 0 ? 1 : 0);
      });
      const gt = es(t, 4.2, 4.5);
      swing(galTag, 540, 440 - (1 - gt) * 900, T, 1, 0.8, 2);

      S.cam.x = 30 - es(t, 2.9, 3.4) * 50;
      S.cam.y = 0 + es(t, 0, 1) * 10;
      S.cam.z = 1.03 + es(t, 0.9, 1.4) * 0.03 * (1 - es(t, 1.9, 2.3));
    };
  },
};
