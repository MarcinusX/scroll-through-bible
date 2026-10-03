// Mk 12,10–12 — back in the Temple court. A painted panel comes down: builders turn a stone over and
// throw it aside — and that very stone rises and becomes the keystone of the arch, in a burst of light.
// The leaders want to seize Jesus, but the crowd closes round him; they see the parable was about them, and go.
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging, mix, shade } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { templeCourt, LOOK, voiceRings, moodPuppet, servant, scrollOpen, archStones, keystone, stoneBlock, glory, sparkle, thought, towerParts, grapeBunch, sheet } from './lib.js';

const PX0 = 560, PX1 = 1040, PY0 = 150, PY1 = 428;      // the painted panel
const AX = 800, AY = 392;                               // arch springing line (panel coords = world)

export default {
  id: 'm12-stone',
  beats: [
    { v: 10, text: 'Nie czytaliście tych słów w Piśmie:' },
    { v: 10, cont: true, text: 'Właśnie ten kamień, który odrzucili budujący, stał się głowicą węgła.' },
    { v: 11 },
    { v: 12, text: 'I starali się Go ująć, lecz bali się tłumu.' },
    { v: 12, cont: true, text: 'Zrozumieli bowiem, że przeciw nim powiedział tę przypowieść.' },
    { v: 12, cont: true, text: 'Zostawili więc Go i odeszli.' },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const set = templeCourt(S);
    const F = set.FLOOR;

    /* the crowd on the steps and standing about */
    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 5, x0: 400, x1: 660, pose: 'sit' }, { y: 604, s: 0.66, n: 3, x0: 1000, x1: 1200, pose: 'sit' }]);

    /* the painted panel with the arch */
    const panL = S.layer({ par: 0.3, sh: 6 });
    const ps = sheet();
    ps.p(c.cut([[PX0 - 10, PY0 - 10], [PX1 + 10, PY0 - 12], [PX1 + 12, PY1 + 10], [PX0 - 12, PY1 + 12]], 0.6, 10), C.wood3);
    ps.p(c.cut([[PX0, PY0], [PX1, PY0], [PX1, PY1], [PX0, PY1]], 0.5, 10), mix(C.skyBlue2, C.parchment, 0.35));
    ps.p(c.ridge(c.wave(372, [10, 4], [300, 90]), PX0, PX1 - 12, PY1, 10, 0.8), mix(C.hillMid, C.parchment, 0.3));
    // half-built walls either side, a heap of stones
    ps.p(c.cut([[PX0, 414], [PX0, 330], [PX0 + 40, 330], [PX0 + 40, 350], [PX0 + 80, 350], [PX0 + 80, 380], [PX0 + 110, 380], [PX0 + 110, 414]], 0.5, 6) + c.cut([[PX1, 414], [PX1, 316], [PX1 - 36, 316], [PX1 - 36, 344], [PX1 - 76, 344], [PX1 - 76, 384], [PX1 - 100, 384], [PX1 - 100, 414]], 0.5, 6), mix(C.stone2, C.sand2, 0.3));
    ps.p(c.cut([[PX0, 414], [PX1, 410], [PX1, PY1], [PX0, PY1]], 0.5, 10), mix(C.sand, C.dune, 0.3));
    const panelBg = panL.add(`<g><path d="M${PX0 - 40} -1400V${PY0 - 10}M${PX1 + 40} -1400V${PY0 - 10}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none" transform="translate(0 0)"/><path d="M${PX0 - 40} ${PY0 - 10}L${PX0} ${PY0}M${PX1 + 40} ${PY0 - 10}L${PX1} ${PY0}" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${ps.out()}</g>`);
    const rays = panL.add(`<g opacity="0">${glory(c, 230, 18)}</g>`);
    const arch = archStones(c, AX, AY, 100, 46, 8, mix(C.stone2, C.sand2, 0.45));
    const pierC = mix(C.stone, C.plaster, 0.4);
    const piers = panL.add(`<g>${sheet().p(c.cut(c.rect(AX - 146, AY, 46, 22), 0.4, 5) + c.cut(c.rect(AX + 100, AY, 46, 22), 0.4, 5), pierC).out()}${arch.stones.join('')}</g>`);
    // the builders and their stone
    const bl = [0, 1].map((i) => ({ i, p: S.puppet(panL.add(person(c, { ...servant(i + 3), belt: C.leather }))) }));
    const stone = panL.add(`<g>${keystone(c, 44, 46, mix(C.stone, C.sand, 0.4))}</g>`);
    const glowK = panL.add(`<g opacity="0"><circle r="60" fill="url(#warm-glow)"/></g>`);
    const sparks = [0, 1, 2, 3].map(() => panL.add(`<g>${sparkle(c, 9)}</g>`));

    /* Jesus, the disciples, the leaders, the standing crowd */
    const people = S.layer({ par: 0.5, sh: 5 });
    const standers = crowd(S, people, [{ y: F + 4, s: 0.84, n: 3, x0: 300, x1: 450 }, { y: F + 10, s: 0.84, n: 3, x0: 1250, x1: 1420 }]);
    const dis = [CAST.john, CAST.peter, CAST.james, CAST.andrew].map((o, i) => ({ p: S.puppet(people.add(person(c, o))), x: 640 - i * 58, y: F + 10 + (i % 2) * 8, i }));
    const leaders = [LOOK.elder, LOOK.priest, LOOK.lscribe].map((o, i) => ({ p: moodPuppet(S, people, c, o), x: (P ? 960 : 1000) + i * (P ? 58 : 66), y: F + 6 + (i % 2) * 8, i, seed: c.rr(0, 9) }));
    const jesus = S.puppet(people.add(person(c, { ...CAST.jesus, holdF: `<g transform="translate(0 6) rotate(90) scale(.42)">${scrollOpen(c, 90, 60)}</g>` })));
    const voice = voiceRings(people, c, { n: 3, r: 26, w: 4 });
    const thinks = people.add(`<g>${thought(c, `<g transform="translate(-12 28) scale(.26)">${towerParts(c, 90, 236).join('')}</g><g transform="translate(16 -8) scale(1.6)">${grapeBunch(c, 3.4)}</g>`, { w: 104, h: 84 })}</g>`);

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v10a — "Have you not read…": the panel comes down */
      const down = es(t, 0.15, 0.7, ease.out) * (1 - es(t, 3.0, 3.4, ease.in));
      const dy = lerp(-900, 0, down);
      pose(panelBg, { y: dy }); pose(piers, { y: dy }); pose(rays, { y: dy });
      const speak = es(t, 0.05, 0.3) * (1 - es(t, 3.0, 3.2)) + es(t, 5.5, 5.7) * 0.4;
      jesus.set({ x: 800, y: F, s: 1.02, blink: blinkAt(T), armF: 40 + speak * 40 + bump(t, 1.45, 2.0) * 50, armB: 20 + speak * 30 + bump(t, 2.0, 2.8) * 60, head: -bump(t, 1.5, 2.9) * 12 });
      voice(826, F - 176, es(t, 0.05, 0.3) * (1 - es(t, 2.8, 3.0)), T, { dir: 1 });

      /* v10b — the builders reject the stone; it rises into the keystone */
      const look = bump(t, 1.02, 1.3), toss = es(t, 1.28, 1.44, ease.in);
      bl.forEach((b) => {
        const x = b.i ? 940 : 660;
        b.p.set({ x, y: 416 + dy, s: 0.5, flip: b.i === 1, armF: b.i === 0 ? 70 + look * 30 - toss * 10 : 30 + look * 40, armB: b.i === 0 ? toss * 90 : 20, head: b.i === 1 ? look * 18 - toss * 10 : -look * 6, lean: b.i === 0 ? -toss * 10 : 0, blink: blinkAt(T, b.i) });
      });
      // path: in the builder's hands → thrown to the ground on the right → up, glowing, into the arch
      let sx, sy, sr = 0;
      const rise = es(t, 1.55, 1.9, ease.io);
      if (t < 1.28) { sx = 690 + look * 6; sy = 350 - look * 8; sr = look * 30; }
      else if (rise <= 0) { sx = lerp(690, 860, toss); sy = lerp(342, 398, toss) - Math.sin(toss * Math.PI) * 36; sr = 30 + toss * 170; }
      else { sx = lerp(860, AX, rise); sy = lerp(398, arch.key[1], rise) - Math.sin(rise * Math.PI) * 60; sr = lerp(200, 360, rise); }
      pose(stone, { x: sx, y: sy + dy, r: sr });
      pose(glowK, { x: sx, y: sy + dy, s: 0.6 + rise * 0.8, o: rise * (1 - es(t, 3.0, 3.2)) });
      const click = es(t, 1.9, 2.1);
      sparks.forEach((el, i) => {
        const a = (i / 4) * Math.PI * 2 + 0.6, k = seg(t, 1.9, 2.4);
        pose(el, { x: AX + Math.cos(a) * (20 + k * 50), y: arch.key[1] + dy + Math.sin(a) * (20 + k * 40), s: 1 - k * 0.5, o: bump(t, 1.9, 2.5) });
      });
      /* v11 — "a marvel in our eyes": light pours from the keystone */
      pose(rays, { x: AX, y: arch.key[1] + dy, s: 0.6 + es(t, 1.95, 2.6) * 0.5, r: T * 2, o: Math.max(click * 0.5, es(t, 2.0, 2.4)) * (1 - es(t, 2.95, 3.1)) });

      /* the crowd looks up in wonder, then closes round Jesus */
      const wonder = bump(t, 2.0, 3.0);
      const guard = es(t, 3.3, 3.6) * (1 - es(t, 5.4, 5.8));
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, head: -wonder * 16 - 4, armF: wonder * (m.i % 2 ? 60 : 0), blink: blinkAt(T, m.seed) }));
      standers.forEach((m) => {
        const x = m.x + guard * (m.x < 800 ? 90 : -300);
        m.p.set({ x, y: m.y, s: m.s, flip: m.x > 800, walk: guard > 0.02 && guard < 0.98 ? x * 0.05 : undefined, head: -wonder * 14, armF: wonder * 50 + guard * 40, blink: blinkAt(T, m.seed) });
      });
      dis.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.92, head: -wonder * 16, armF: wonder * (d.i % 2 ? 70 : 20), armB: wonder * 40, blink: blinkAt(T, d.i + 2) }));

      /* v12 — they reach for him, stop, understand, leave */
      const reach = es(t, 3.05, 3.3) * (1 - es(t, 3.5, 3.75));
      const recoil = es(t, 3.5, 3.75);
      const go = es(t, 5.1, 5.85);
      leaders.forEach((l) => {
        const x = l.x - reach * 60 + recoil * 10 * (1 - go) + go * (480 + l.i * 40);
        const walking = (reach > 0 && reach < 1 && t < 3.5) || (go > 0 && go < 1);
        l.p.set({
          x, y: l.y, s: 0.94, flip: go > 0 ? false : true, walk: walking ? x * 0.05 + l.i : undefined, blink: blinkAt(T, l.seed),
          armF: 36 + reach * 60 - recoil * 20, armB: 40 - reach * 30, head: -wonder * 10 + bump(t, 4.1, 4.9) * [12, -12, 10][l.i] + recoil * 6, lean: reach * -8,
        });
        l.p.mood({ angry: es(t, 3.0, 3.2) * (1 - es(t, 3.6, 3.8)) + es(t, 4.2, 4.4), sad: es(t, 3.6, 3.8) * (1 - es(t, 4.2, 4.4)) });
      });
      const th = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.85, 5.0));
      pose(thinks, { x: P ? 1010 : 1060, y: F - 216, s: th, o: th > 0.02 ? 1 : 0 });

      S.cam.z = 1 + es(t, 0.8, 1.6) * 0.04 * (1 - es(t, 2.9, 3.4));
      S.cam.y = 0;
      S.cam.x = es(t, 3.0, 3.6) * 20 * (1 - es(t, 5.1, 5.8));
    };
  },
};
