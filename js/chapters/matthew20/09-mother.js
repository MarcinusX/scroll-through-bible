// Mt 20,20–23 — resting by the road under a broad tree, the Ten sit in the shade. The mother of the sons of Zebedee
// comes with James and John and kneels before Jesus, asking something. "What do you want?" — "Say that these two sons
// of mine may sit in your Kingdom, one at your right and one at your left": three thrones of light are let down, the
// side ones named James and John. "You don't know what you are asking": the thrones grow dim, a question hangs. "Are
// you able to drink the cup that I am to drink?" — a dark cup comes down in front of him. "We are able!" "My cup you
// will indeed drink" — it swings over to the brothers and a warm light falls on them. "But to sit at my right and my
// left is not mine to give; it is for those for whom my Father has prepared it": linen cloths veil the two thrones and
// they are drawn up into a light that opens above (the Father is never shown — only the light).
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, hanging, swing } from '../kit.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { roadSet, shadeTree, TWELVE, MOTHER, lightThrone, chalice, say, nameTag, qmark, rays, olive, bush, rock, tr } from './lib.js';

const GY = 684;
const JX = 720;
const MX = 850, JAX = 944, JOX = 1010;

/** a cloth that veils a throne; origin top-centre */
function veil(c, w = 120, h = 150) {
  const s = sheet();
  const pts = [[-w * 0.2, 0], [w * 0.2, 0], [w / 2, h * 0.5], [w / 2 + 6, h]];
  for (let x = w / 2; x > -w / 2; x -= 20) pts.push(...c.arc(x - 10, h, 10, 6, 0, Math.PI, 4));
  pts.push([-w / 2 - 6, h], [-w / 2, h * 0.5]);
  s.p(c.cut(pts, 0.8, 7), C.linen);
  s.x(c.ribbon([[-w * 0.1, 10], [-w * 0.3, h - 10]], 2) + c.ribbon([[w * 0.1, 10], [w * 0.25, h - 10]], 2), C.linen2);
  return s.out();
}

export default {
  id: 'mt20-mother',
  beats: [
    { v: 20 },
    { v: 21, text: 'On ją zapytał: «Czego pragniesz?»' },
    { v: 21, cont: true, text: 'Rzekła Mu: «Powiedz, żeby ci dwaj moi synowie zasiedli w Twoim królestwie jeden po prawej, a drugi po lewej Twej stronie».' },
    { v: 22, text: 'Odpowiadając Jezus rzekł: «Nie wiecie, o co prosicie.' },
    { v: 22, cont: true, text: 'Czy możecie pić kielich, który Ja mam pić?»' },
    { v: 22, cont: true, text: 'Odpowiedzieli Mu: «Możemy».' },
    { v: 23, text: 'On rzekł do nich: «Kielich mój pić będziecie.' },
    { v: 23, cont: true, text: 'Nie do Mnie jednak należy dać miejsce po mojej stronie prawej i lewej, ale [dostanie się ono] tym, dla których mój Ojciec je przygotował».' },
  ],
  cam: { x: [-30, 60], y: [-60, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.66, jerX: 1220, farY: 420, roadX: 860, trees: 14, clouds: [[450, 150, 160], [1080, 120, 120]] });
    const lightL = S.layer({ par: 0.03, sh: 1, flat: true, rise: 0 });
    const heaven = lightL.add(`<g><circle r="330" fill="url(#halo-glow)"/><g opacity=".55">${rays(c, { n: 18, r0: 40, r1: 380, spread: 0.05, color: '#fff3cf' })}</g></g>`);
    const back = S.layer({ par: 0.35, sh: 3 });
    back.add(shadeTree(c, 380, 650, 1.1) + olive(c, 1400, 612, 0.9));
    const restL = S.layer({ par: 0.4, sh: 4 });
    const TEN = [0, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k, i) => ({ i, p: S.puppet(restL.add(person(c, { ...TWELVE[k].o, pose: 'sit' }))), x: 262 + i * 36 + (i % 2) * 8, y: 652 + (i % 2) * 12, seed: c.rr(0, 9) }));

    /* the thrones, the cup */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const THR = [[800, 1, 0], [630, 0.72, -1], [970, 0.72, 1]].map(([x, s, side], i) => {
      const el = hanging(hangL, `<g transform="translate(0 ${190 * s})">${lightThrone(c, s)}</g>`, { x, y: -1500, len: 900 });
      const tag = side ? hangL.add(`<g>${nameTag(c, side < 0 ? tr('Jakub', 'James') : tr('Jan', 'John'), { size: 16 })}</g>`) : null;
      const vl = side ? hangL.add(`<g>${veil(c, 110, 150)}</g>`) : null;
      return { el, tag, vl, x, s, side, i };
    });
    const cupEl = hanging(hangL, `<g transform="translate(0 110)"><circle cy="-40" r="70" fill="url(#halo-glow)" opacity=".35"/>${chalice(c, 90)}</g>`, { x: 800, y: -1500, len: 900 });

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const james = S.puppet(P.add(person(c, CAST.james)));
    const john = S.puppet(P.add(person(c, CAST.john)));
    const motherS = S.puppet(P.add(person(c, MOTHER)));
    const motherK = S.puppet(P.add(person(c, { ...MOTHER, pose: 'kneel' })));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));

    const fx = S.layer({ par: 0.5, sh: 6 });
    const W = [
      [1, say(c, tr('Czego pragniesz?', 'What do you want?'), { size: 20, side: 1 }), 'j'],
      [2, say(c, tr(['Niech moi dwaj synowie zasiądą', 'jeden po prawej, drugi po lewej!'], ['Let my two sons sit,', 'one on your right, one on your left!']), { size: 18, side: 1 }), 'm'],
      [3, say(c, tr('Nie wiecie, o co prosicie.', 'You don’t know what you are asking.'), { size: 19, side: 1 }), 'j'],
      [4, say(c, tr(['Czy możecie pić kielich,', 'który Ja mam pić?'], ['Are you able to drink', 'the cup that I am to drink?']), { size: 19, side: 1 }), 'j'],
      [5, say(c, tr('Możemy!', 'We are able!'), { size: 24, side: -1, jag: true }), 'b'],
      [6, say(c, tr('Kielich mój pić będziecie.', 'You will indeed drink my cup.'), { size: 19, side: 1 }), 'j'],
    ].map(([b, m, who]) => ({ b, who, el: fx.add(`<g>${m}</g>`) }));
    const q = fx.add(`<g><g transform="scale(1.4)">${qmark(c)}</g></g>`);
    const warm = fx.add(`<g><ellipse rx="130" ry="170" fill="url(#warm-glow)"/></g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 190, 1000, 220, C.sage, C.moss) + rock(c, 1420, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 8) * 20 });
      TEN.forEach((m) => m.p.set({ x: m.x, y: m.y, s: 0.6, flip: false, head: -4 + es(t, 5.0, 5.3) * 6, blink: blinkAt(T, m.seed) }));

      /* v20 — she comes with her sons and kneels */
      const come = es(t, -0.3, 0.45);
      const kneel = es(t, 0.5, 0.56);
      const bow = es(t, 0.56, 0.75) * (1 - es(t, 2.02, 2.15)) + es(t, 7.1, 7.3) * 0.5;
      const mx = lerp(MX + 420, MX, come);
      motherS.set({ x: mx, y: GY, s: 0.95, flip: true, o: 1 - kneel, walk: come > 0 && come < 1 ? mx * 0.06 : undefined, blink: blinkAt(T, 4) });
      const ask = es(t, 2.04, 2.2) * (1 - es(t, 2.9, 3.05));
      motherK.set({ x: MX, y: GY, s: 0.95, flip: true, o: kneel, lean: -bow * 10, armF: 50 + bow * 20 + ask * 30, armB: bow * 60 + ask * 90, head: bow * 12 - ask * 10, blink: blinkAt(T, 4) });

      const able = es(t, 5.04, 5.2) * (1 - es(t, 5.9, 6.05));
      const receive = es(t, 6.1, 6.5);
      const jaX = lerp(JAX + 440, JAX, come), joX = lerp(JOX + 460, JOX, come);
      const wk = come > 0 && come < 1;
      james.set({ x: jaX, y: GY - 8, s: 0.96, flip: true, walk: wk ? jaX * 0.06 : undefined, lean: -receive * 5, armF: 16 + bump(t, 2.2, 2.9) * 40 + able * 90 + receive * 50, armB: able * 150, head: -es(t, 2.3, 2.6) * 8 * (1 - es(t, 3, 3.3)) + receive * 10, blink: blinkAt(T, 1) });
      john.set({ x: joX, y: GY - 2, s: 0.92, flip: true, walk: wk ? joX * 0.06 + 1 : undefined, lean: -receive * 5, armF: 14 + able * 100 + receive * 50, armB: able * 130 + bump(t, 2.2, 2.9) * 60, head: -es(t, 2.3, 2.6) * 10 * (1 - es(t, 3, 3.3)) + receive * 10, blink: blinkAt(T, 2) });

      /* Jesus */
      const shake = bump(t, 3.02, 3.9);
      const offer = es(t, 4.04, 4.3) * (1 - es(t, 6.9, 7.05));
      const upw = es(t, 7.05, 7.3);
      jesus.set({ x: JX, y: GY, s: 1.02, armF: 20 + es(t, 1.04, 1.2) * 40 * (1 - es(t, 1.9, 2.05)) + offer * 70 + upw * 70, armB: offer * 40 + upw * 150, head: Math.sin(t * 20) * 5 * shake - upw * 12, blink: blinkAt(T) });

      W.forEach((w) => {
        const k = es(t, w.b + 0.05, w.b + 0.2, ease.back) * (1 - es(t, w.b + 0.9, w.b + 1.0));
        const x = w.who === 'j' ? JX + 28 : w.who === 'm' ? MX - 10 : JAX + 10;
        const y = w.who === 'm' ? GY - 140 : GY - 222;
        pose(w.el, { x, y, s: k, o: k > 0.02 ? 1 : 0 });
      });
      pose(q, { x: 800, y: 380, s: es(t, 3.1, 3.3, ease.back), r: Math.sin(T) * 6, o: t > 3.1 && t < 4.05 ? 1 - es(t, 3.9, 4.05) : 0 });

      /* the thrones: down (2), dim (3), aside for the cup (4–6), veiled and drawn up into the light (7) */
      const dim = es(t, 3.05, 3.4);
      const aside = es(t, 3.9, 4.2) * (1 - es(t, 6.9, 7.1));
      const veiled = es(t, 7.15, 7.4), gone = es(t, 7.4, 7.75);
      THR.forEach((th) => {
        const d = es(t, 2.1 + th.i * 0.08, 2.45 + th.i * 0.08, ease.back);
        const y = 150 - (1 - d) * 1100 - aside * 1100 - gone * 30;
        swing(th.el, th.x, y, 0, 0, 0);
        fade(th.el, th.side ? 1 - dim * 0.55 * (1 - gone) : 1);
        if (th.tag) pose(th.tag, { x: th.x + th.side * 4, y: y + 190 * th.s + 6, o: es(t, 2.4, 2.55) * (1 - dim) });
        if (th.vl) pose(th.vl, { x: th.x, y: y + 4 - (1 - veiled) * 100, s: 0.95, o: veiled });
      });
      pose(heaven, { x: 800, y: 40, s: 0.8 + gone * 0.3, r: t * 4, o: es(t, 7.1, 7.5) });
      /* the cup */
      const cd = es(t, 4.1, 4.45, ease.back), cu = es(t, 7.05, 7.35);
      const cx = lerp(800, (JAX + JOX) / 2, receive);
      swing(cupEl, cx, 230 - (1 - cd) * 1100 - cu * 1100 + receive * 50, T, 1, 0.7, 5);
      pose(warm, { x: (JAX + JOX) / 2, y: GY - 110, o: receive * (1 - cu) * 0.8 });

      S.cam.y = -es(t, 1.9, 2.4) * 50 * (1 - es(t, 3.8, 4.2)) - es(t, 6.9, 7.3) * 50;
      S.cam.z = 1 + es(t, 0.4, 1.1) * 0.05;
      S.cam.x = es(t, 0.4, 1.1) * 40;
    };
  },
};
