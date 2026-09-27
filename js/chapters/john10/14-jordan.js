// J 10,40–42 — beyond the Jordan at sunset, the place of John 1: the river, the reeds, the far hills. Jesus comes
// along the bank; over the water hangs a sepia picture of John baptising here at the beginning. He sits down by a
// small fire on the bank and stays. Many come along the paths and gather round Him. "John did no sign" — the picture
// comes back beside an empty, dashed medallion; "but all that John said about this man was true" — in the picture
// John points, and a thread of light runs from his hand to Jesus; a tick. "And many believed in Him there" — one by
// one small lights kindle over the people as the first stars come out.
import { C, person, blinkAt, pose, lerp, shade, mix, sheet, swing } from '../kit.js';
import { es, ease, bump, fade, attr } from '../../core/anim.js';
import { rock } from '../../assets/nature.js';
import {
  jordanSet, JESUS, JOHN_B, villager, framed, sepia, soulLight, tick, nameTag, bubble, hanging, kf, vis, tr, GOLDEN, DUSK, TWILIGHT, SEPIA, FONT, PI,
} from './lib.js';
import { makeCutter } from '../../core/paper.js';

const PW = 500, PH = 250;
const PEOPLE = [
  { from: [140, 732], to: [590, 732], s: 0.98 },
  { from: [60, 720], to: [660, 716], s: 0.9, sit: true },
  { from: [1500, 734], to: [980, 732], s: 1.0 },
  { from: [1560, 720], to: [920, 716], s: 0.9, sit: true },
  { from: [200, 706], to: [520, 706], s: 0.88 },
  { from: [1440, 706], to: [1060, 706], s: 0.9 },
  { from: [260, 746], to: [700, 752], s: 1.02, sit: true },
  { from: [1400, 748], to: [1110, 746], s: 1.02 },
];

export default {
  id: 'j10-jordan',
  beats: [
    { v: 40, text: 'I powtórnie udał się za Jordan, na miejsce, gdzie Jan poprzednio udzielał chrztu,' },
    { v: 40, cont: true, text: 'i tam przebywał.' },
    { v: 41, text: 'Wielu przybyło do Niego,' },
    { v: 41, cont: true, text: 'mówiąc, iż Jan wprawdzie nie uczynił żadnego znaku,' },
    { v: 41, cont: true, text: 'ale że wszystko, co Jan o Nim powiedział, było prawdą.' },
    { v: 42 },
  ],
  cam: { x: [-60, 60], y: [-120, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const set = jordanSet(S, { skyCols: GOLDEN, sunAt: [1180, 250], sunR: 50, city: false, clouds: true, path: true });
    const R = set.riverLayer();
    set.waterFront(R);
    const { N } = set.nearBank();
    N.add(rock(c, 820, 738, 90, 30, C.rock2));
    // the fire on the bank
    const fireL = S.layer({ par: 0.45, sh: 3 });
    fireL.add(sheet().p(c.ribbon([[870, 740], [910, 734]], 5) + c.ribbon([[874, 732], [908, 742]], 5), C.wood2).out());
    const fire = fireL.add(`<g><circle r="80" fill="url(#warm-glow)"/><path d="${c.cut([[-12, 0], [-8, -18], [-2, -10], [2, -30], [8, -12], [12, 0]], 0.4, 3)}" fill="${C.lampFlame}"/><path d="${c.cut([[-5, 0], [-2, -10], [2, -16], [5, 0]], 0.3, 3)}" fill="#fff4d2"/></g>`);
    // the plate of John baptising (sepia), with John as a puppet so he can point
    const plL = S.layer({ par: 0.3, sh: 6 });
    const SK = mix(C.parchment, C.dune, 0.35);
    const inner = `<rect width="${PW}" height="${PH}" fill="${SK}"/><path d="M0 ${PH - 70}Q${PW / 2} ${PH - 80} ${PW} ${PH - 70}V${PH}H0Z" fill="${mix(C.lake, C.dune, 0.5)}"/><path d="M0 ${PH - 96}Q${PW * 0.3} ${PH - 120} ${PW} ${PH - 100}V${PH - 70}H0Z" fill="${mix(C.dune, C.parchment, 0.3)}"/>`;
    const plate = plL.add(`<g>${framed(S, inner, { w: PW, h: PH, rim: C.wood3, k: 'jb' })}</g>`);
    const cc = makeCutter('j10-jordan-john');
    const john = S.puppet(plL.add(person(cc, sepia(JOHN_B, 0.35))));
    const baptized = S.puppet(plL.add(person(cc, sepia({ robe: C.linen2, hairStyle: 'short', hair: C.hair2, beard: 'short', skin: C.skin2, pose: 'kneel' }, 0.4))));
    const words = plL.add(`<g>${nameTag(c, tr('«Oto Baranek Boży»', '“Behold, the Lamb of God!”'), { size: 16 })}</g>`);
    const medal = plL.add(`<g><circle r="44" fill="${mix(C.parchment, C.dune, 0.2)}" stroke="${C.ochre}" stroke-width="3" stroke-dasharray="7 6"/><text x="0" y="8" text-anchor="middle" font-family="${FONT}" font-size="18" font-style="italic" letter-spacing="2" fill="${C.inkSoft}" opacity=".7">${tr('ZNAK', 'SIGN')}</text><path d="${c.ribbon([[-24, -24], [24, 24]], 4) + c.ribbon([[24, -24], [-24, 24]], 4)}" fill="${C.terracotta}" opacity=".75"/></g>`);
    const ok = plL.add(`<g>${tick(c, 22)}</g>`);
    const threadL = S.layer({ par: 0.4, sh: 0, flat: true });
    const thread = threadL.add(`<path d="M0 0L0 1" stroke="${C.halo}" stroke-width="4" stroke-linecap="round" fill="none" opacity="0"/>`);
    // people and Jesus
    const act = S.layer({ par: 0.45, sh: 5 });
    const vc = makeCutter('j10-jordan-people');
    const folk = PEOPLE.map((p, i) => ({ ...p, i, seed: vc.rr(0, 9), st: S.puppet(act.add(person(vc, villager(vc, i)))), sit: p.sit ? S.puppet(act.add(person(vc, { ...villager(makeCutter('j10-jv' + i), i), pose: 'sit' }))) : null }));
    const jWalk = S.puppet(act.add(person(c, JESUS)));
    const jSit = S.puppet(act.add(person(c, { ...JESUS, pose: 'sit' })));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const lights = folk.map(() => fx.add(`<g>${soulLight(c, 8)}</g>`));
    const says = fx.add(`<g>${bubble(c, tr('Jan nie uczynił znaku…', 'John did no sign…'), { size: 18, tail: 1 })}</g>`);
    const tag = hanging(fx, nameTag(c, tr('za Jordanem', 'beyond the Jordan'), { size: 18 }), { x: 520, y: 260, len: 700 });
    const fg = set.foreground();

    return (t, time) => {
      const T = time;
      const dusk = es(t, 0.5, 4.5), tw = es(t, 4.4, 6);
      if (tw <= 0) set.sk.blend(GOLDEN, DUSK, dusk); else set.sk.blend(DUSK, TWILIGHT, tw);
      set.update(t, T, { sunX: 1180, sunY: lerp(250, 520, es(t, 0.3, 5.8)), glow: 0.5 + dusk * 0.5 });
      /* v40a — He comes to where John baptised; the memory */
      const walk = es(t, 0.05, 0.95);
      const sit = es(t, 1.3, 1.4);
      const jx = lerp(260, 790, walk);
      jWalk.set({ x: jx, y: 732, s: 1.02, walk: walk > 0 && walk < 1 ? jx * 0.07 : undefined, o: 1 - sit, armF: 12, blink: blinkAt(T, 1) });
      jSit.set({ x: 800, y: 732, s: 1.02, o: sit, armF: 30 + bump(t, 2.1, 5.9) * 20, armB: 20 + es(t, 5.1, 5.5) * 60, head: -4, blink: blinkAt(T, 2) });
      const tk = es(t, 0.15, 0.45, ease.out) * (1 - es(t, 0.9, 1.1, ease.in));
      swing(tag, 520, 260 - (1 - tk) * 700, tk > 0.001 ? T : 0, 1.2, 0.8);
      fade(tag, tk > 0.001 ? 1 : 0);
      const pk = Math.max(es(t, 0.3, 0.6, ease.out) * (1 - es(t, 1.05, 1.3, ease.in)), es(t, 3.1, 3.4, ease.out) * (1 - es(t, 5.1, 5.4, ease.in)));
      const PX = 780, PY = 110 - (1 - pk) * 700;
      vis(plate, { x: PX, y: PY, o: pk > 0.001 ? 1 : 0 });
      const on = pk > 0.001 ? 1 : 0;
      const pour = bump(t, 0.5, 1.0);
      const point = es(t, 4.1, 4.35);
      john.set({ x: PX - 80, y: PY + PH - 50, s: 0.72, o: on, armF: 30 + pour * 80 + point * 60, armB: 10 + pour * 30, head: point * -6, blink: 0 });
      baptized.set({ x: PX + 20, y: PY + PH - 34, s: 0.64, flip: true, o: on * (1 - es(t, 2, 2.2)), armF: 60, head: 14 });
      vis(words, { x: PX, y: PY + PH + 18, s: 0.9, o: on * es(t, 4.15, 4.35) });
      vis(medal, { x: PX + 280, y: PY + 110, s: es(t, 3.3, 3.5, ease.back), o: on * es(t, 3.3, 3.4) * (1 - es(t, 4.1, 4.3) * 0.5) });
      vis(ok, { x: PX + 280, y: PY + 110, s: es(t, 4.4, 4.55, ease.back) * 1.4, o: on * es(t, 4.4, 4.5) });
      // the thread from John's hand to Jesus
      const th = es(t, 4.25, 4.6) * (1 - es(t, 5.1, 5.3));
      const hx = PX - 80 + 46, hy = PY + PH - 50 - 110;
      attr(thread, 'd', `M${hx} ${hy}L${lerp(hx, 800, th)} ${lerp(hy, 560, th)}`);
      attr(thread, 'opacity', th > 0.01 ? 0.9 : 0);
      /* the fire */
      const fk = es(t, 1.2, 1.5);
      vis(fire, { x: 890, y: 736, s: 0.6 + fk * 0.4 + (T ? Math.sin(T * 8) * 0.04 : 0), sy: 1 + (T ? Math.sin(T * 11) * 0.06 : 0), o: fk });
      /* v41a — many came; v41b — "John did no sign"; v42 — many believed */
      folk.forEach((m) => {
        const k = es(t, 2.05 + (m.i % 4) * 0.12, 2.8 + (m.i % 4) * 0.08);
        const x = lerp(m.from[0], m.to[0], k), y = lerp(m.from[1], m.to[1], k);
        const faceL = m.to[0] > 800;
        const sat = m.sit ? es(t, 2.85 + m.i * 0.02, 2.95 + m.i * 0.02) : 0;
        const speak = m.i === 2 ? bump(t, 3.05, 4.9) : 0;
        const lookUp = es(t, 3.2, 3.5) * (1 - es(t, 5.1, 5.4));
        m.st.set({ x, y, s: m.s, flip: faceL, walk: k > 0 && k < 1 ? x * 0.07 : undefined, o: k > 0.001 ? 1 - sat : 0, armF: 14 + speak * 40, armB: 8 + speak * 60, head: -lookUp * 14, blink: blinkAt(T, m.seed) });
        if (m.sit) m.sit.set({ x: m.to[0], y: m.to[1], s: m.s, flip: faceL, o: sat, armF: 30, head: -lookUp * 10 - 4, blink: blinkAt(T, m.seed + 1) });
        const lk = es(t, 5.15 + m.i * 0.07, 5.4 + m.i * 0.07);
        const hy2 = m.to[1] - (m.sit ? 150 : 210) * m.s;
        vis(lights[m.i], { x: m.to[0] + (faceL ? -6 : 6), y: hy2 - 20 + (T ? Math.sin(T * 2 + m.i) * 3 : 0), s: 0.8 + lk * 0.3, o: lk });
      });
      const sb = es(t, 3.15, 3.3, ease.back) * (1 - es(t, 3.95, 4.1));
      vis(says, { x: 1000, y: 470, s: sb, o: sb > 0.01 ? 1 : 0 });
      S.cam.x = kf(t, [[0, -60], [1, 0], [2, 0], [2.8, 0], [5, 0]]);
      S.cam.y = kf(t, [[0, -20], [1, -20], [1.8, 30], [3, -40], [5, -40], [5.5, 30], [6, 30]]);
      S.cam.z = kf(t, [[0, 1.08], [1.8, 1.14], [3, 1.04], [5, 1.04], [6, 1.12]]);
    };
  },
};
