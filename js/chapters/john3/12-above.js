// J 3,31–36 — Heaven and earth. Jesus comes down in light onto a high hill, above everyone gathered below.
// A man "from the earth" speaks of earthly things (bread, a coin, a sheep in his bubble). He who comes from
// heaven testifies to what He has seen and heard — but His glowing words fall to the ground unreceived; one
// woman catches one and sets her seal to it: God is true. He speaks God's words, and the Spirit pours on Him
// without measure — the measuring bowl brims over and the dove comes down. The Father loves the Son and gives
// all things into His hands: the world comes down into them. Whoever believes has eternal life — a young tree
// blossoms by the one who comes to Him; whoever will not believe turns away under a dark cloud.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix, sky } from '../kit.js';
import { band, cloud, grass, olive, rock, flowers } from '../../assets/nature.js';
import { stormCloud, ear } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  say, word, wordSlip, seal, measureBowl, dove, flapWings, globe, heart, glory, soulLight, spark, loaf, coin, sheep, beamGrad, lightBeam,
  roundel, headAt, hand, voiceRings, tr, PI, DAY,
  hangAt,
  vpose,
} from './lib.js';

const HX = 800, HY = 560, GY = 724;

export default {
  id: 'j3-above',
  beats: [
    { v: 31, text: 'Kto przychodzi z wysoka, panuje nad wszystkimi,' },
    { v: 31, cont: true, text: 'a kto z ziemi pochodzi, należy do ziemi i po ziemsku przemawia.' },
    { v: 31, cont: true, text: 'Kto z nieba pochodzi, Ten jest ponad wszystkim.' },
    { v: 32, text: 'Świadczy On o tym, co widział i słyszał,' },
    { v: 32, cont: true, text: 'a świadectwa Jego nikt nie przyjmuje.' },
    { v: 33 },
    { v: 34, text: 'Ten bowiem, kogo Bóg posłał, mówi słowa Boże:' },
    { v: 34, cont: true, text: 'a z niezmierzonej obfitości udziela [mu] Ducha.' },
    { v: 35 },
    { v: 36, text: 'Kto wierzy w Syna, ma życie wieczne;' },
    { v: 36, cont: true, text: 'kto zaś nie wierzy Synowi, nie ujrzy życia, lecz grozi mu gniew Boży».' },
  ],
  cam: { x: [-60, 60], y: [-200, 80], z: [0.95, 1.3] },
  build(S) {
    const c = S.c;
    const HEAV = ['#f3dcae', '#f6e6c6', '#eef0dc'];
    const sk = sky(S, DAY);
    /* ---------- heaven: golden clouds and the light above (never a figure) ---------- */
    const Hv = S.layer({ par: 0.12, sh: 3 });
    const above = Hv.add(`<g>${glory(c, 420, 28)}<circle r="140" fill="url(#halo-glow)"/></g>`);
    const clouds = [[330, 90, 240], [600, 50, 280], [1000, 60, 300], [1260, 100, 240], [800, 120, 200]].map(([x, y, w], i) => ({ el: Hv.add(`<g>${cloud(c, w, mix(C.cream, C.halo, 0.35), mix(C.halo, C.sun, 0.3))}</g>`), x, y, i }));
    S.layer({ par: 0.15, sh: 2 }).add(band(c, { y: 520, amps: [20, 8, 3], lens: [1000, 360, 130], color: C.hillFar }).markup);
    /* ---------- the high hill ---------- */
    const Hl = S.layer({ par: 0.5, sh: 3 });
    Hl.add(sheet().p(c.ridge(c.wave(GY - 60, [4, 2], [600, 160]), -900, 2500, 1700, 12, 1), mix(C.sage3, C.sand, 0.35)).out());
    Hl.add(sheet().p(c.cut([[560, GY - 50], [650, HY + 40], [720, HY + 6], [800, HY - 4], [880, HY + 6], [950, HY + 40], [1040, GY - 50]], 1, 8), mix(C.rock, C.sand2, 0.4)).x(c.cut([[680, HY + 40], [760, HY + 8], [800, HY + 20], [720, HY + 50]], 0.5, 6), C.cream, 'opacity=".4"').out());
    Hl.add(grass(c, { x0: -900, x1: 2500, y: GY - 58, n: 40, h: 12, color: C.moss }) + olive(c, 220, GY - 54, 0.9) + rock(c, 1400, GY - 40, 140, 50, C.rock2));
    // the young tree of life and the withered stalk (v36)
    const Tr = S.layer({ par: 0.5, sh: 4 });
    const tree = Tr.add(`<g>${olive(c, 0, 0, 0.8, { leaf: C.leaf, leaf2: C.sage })}${flowers(c, { x0: -50, x1: 50, y: -90, n: 12, colors: [C.cream, C.jesusMantle], h: 6 })}</g>`);
    const wither = Tr.add(`<g>${sheet().p(c.ribbon(c.qbez([0, 0], [4, -40], [22, -56], 10), (u) => 3 - u * 1.6), C.wood3).p(c.cut([[22, -56], [30, -50], [26, -44]], 0.3, 3) + c.cut([[10, -30], [22, -26], [14, -22]], 0.3, 3), mix(C.wood3, C.sand2, 0.4)).out()}</g>`);

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const eartherO = { robe: C.clay, mantle: C.wood3, hairStyle: 'short', hair: C.hair3, beard: 'full', skin: C.skin3, belt: C.rope };
    const earther = S.puppet(P.add(person(c, eartherO)));
    const PEOPLE = [[460, false], [560, false], [1030, true], [1130, true], [1290, true], [360, false]].map(([x, flip], i) => {
      const o = crowdPerson(c);
      return { x, flip, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, o))) };
    });
    const believer = PEOPLE[1], sealer = PEOPLE[2], refuser = PEOPLE[3];
    const voice = voiceRings(P, c, { n: 3, color: C.halo, r: 30, w: 5 });

    /* ---------- words, signs ---------- */
    const X = S.layer({ par: 0.5, sh: 5 });
    const bid = beamGrad(S, 'beam');
    const beam = X.add(`<g>${lightBeam(bid, 50, 170, 520)}</g>`);
    const pour = X.add(`<g>${lightBeam(bid, 90, 240, 520)}</g>`);
    const upT = X.add(`<g>${word(c, tr('z wysoka', 'from above'), { size: 18 })}</g>`);
    const earthSay = X.add(`<g>${say(c, [' '], { size: 40, side: -1, w: 170 })}<g transform="translate(-100 -52) scale(1.5)"><g transform="translate(-26 0)">${loaf(c, 11)}</g><g transform="translate(2 2) scale(1.3)">${coin(c, 8)}</g><g transform="translate(32 12) scale(.36)">${sheep(c)}</g></g></g>`);
    const earthT = X.add(`<g>${word(c, tr('z ziemi', 'from the earth'), { size: 16 })}</g>`);
    const heavT = X.add(`<g>${word(c, tr('ponad wszystkim', 'above all'), { size: 19 })}</g>`);
    const eyeIn = (() => {
      const s = sheet();
      s.p(c.cut([...c.arc(0, 0, 30, 16, PI, 2 * PI, 12), ...c.arc(0, 0, 30, 16, 0, PI, 12)], 0.3, 3), C.cream);
      s.p(c.cut(c.circ(0, 0, 10, 14), 0.2, 2), C.teal).x(c.poly(c.circ(0, 0, 4.6, 10)), C.ink);
      return s.out();
    })();
    const eyeP = X.add(`<g>${roundel(c, eyeIn, { r: 44 })}</g>`);
    const earP = X.add(`<g>${roundel(c, `<g transform="translate(-4 0) scale(.9)">${ear(c)}</g>`, { r: 44 })}</g>`);
    const slips = Array.from({ length: 6 }, (_, i) => ({ i, el: X.add(`<g><circle r="30" fill="url(#warm-glow)" opacity=".6"/>${wordSlip(c, 38)}</g>`) }));
    const sealEl = X.add(`<g>${sheet().p(c.cut(c.rect(-44, -26, 88, 52), 0.4, 6), C.parchment).out()}<text x="0" y="-4" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="12" font-style="italic" fill="${C.ink}">${tr('Bóg jest', 'God')}</text><text x="0" y="12" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="12" font-style="italic" fill="${C.ink}">${tr('prawdomówny', 'is true')}</text><g class="stamp" transform="translate(30 16) scale(.5)">${seal(c)}</g></g>`);
    const stamp = sealEl.querySelector('.stamp');
    const words = Array.from({ length: 7 }, (_, i) => ({ i, el: X.add(`<g><circle r="26" fill="url(#halo-glow)"/>${wordSlip(c, 34)}</g>`) }));
    const bowl = hanging(X, `<g transform="translate(0 60) scale(1.4)">${measureBowl(c, 90)}</g>`, { x: 1010, y: 250, len: 700 });
    const spill = X.add(`<g>${sheet().p(c.cut([[-50, 0], [-40, -8], [40, -8], [50, 0], [60, 60], [48, 60], [42, 6], [-42, 6], [-48, 60], [-60, 60]], 0.4, 5), C.halo).out()}</g>`);
    const doveEl = X.add(dove(c));
    const loveH = X.add(`<g>${heart(c, 30, C.jesusMantle)}</g>`);
    const world = X.add(`<g><circle r="90" fill="url(#halo-glow)"/>${globe(c, 44)}</g>`);
    const allT = X.add(`<g>${word(c, tr('wszystko w Jego ręce', 'all things into His hand'), { size: 16 })}</g>`);
    const lifeT = X.add(`<g>${word(c, tr('życie wieczne', 'eternal life'), { size: 17 })}</g>`);
    const bHeart = X.add(`<g>${heart(c, 10)}</g>`);
    const storm = X.add(`<g>${stormCloud(c, 180)}</g>`);

    return (t, time) => {
      const T = time;
      const gold = es(t, 1.9, 2.5) * (1 - es(t, 3.0, 3.4) * 0.5) + es(t, 6.9, 7.4) * 0.5 + es(t, 7.9, 8.4) * 0.3;
      sk.blend(DAY, HEAV, Math.min(1, gold));
      vpose(above, { x: HX, y: -110, s: 0.7 + gold * 0.4, r: gold * 10, o: 0.4 + Math.min(1, gold) * 0.6 });
      clouds.forEach((cl) => vpose(cl.el, { x: cl.x + gold * (cl.x < 800 ? -30 : 30), y: cl.y }));

      /* v31a — He comes from above onto the high place */
      const come = es(t, 0.05, 0.6, ease.out);
      const bm = es(t, 0.02, 0.2) * (1 - es(t, 0.8, 1.1));
      vpose(beam, { x: HX, y: HY - 520, sx: 0.5 + bm * 0.5, o: bm });
      const speak = bump(t, 3.05, 3.9) + bump(t, 6.05, 6.9);
      const recvSp = es(t, 7.1, 7.4) * (1 - es(t, 7.9, 8.05));
      const take = es(t, 8.3, 8.6);
      jesus.set({ x: HX, y: lerp(120, HY, come), s: 1.05, o: seg(t, 0.02, 0.1), armF: 20 + come * 20 + speak * 50 + recvSp * 40 + take * 60 + bump(t, 9.1, 9.8) * 40, armB: 10 + bump(t, 2.1, 2.9) * 120 + recvSp * 100 + take * 60, head: -recvSp * 10 + take * 8, blink: blinkAt(T, 2) });
      vpose(upT, { x: HX + 150, y: HY - 250, s: es(t, 0.4, 0.6, ease.back), r: 4, o: seg(t, 0.4, 0.45) * (1 - es(t, 0.95, 1.1)) });
      const [jhx, jhy] = headAt(HX, HY, 1.05, false);

      /* everybody below looks up */
      PEOPLE.forEach((m) => {
        let x = m.x, flip = m.flip, walk, armF = 20, armB = 10, head = -es(t, 0.3, 0.7) * 12, o = 1;
        if (m === sealer) { const k = es(t, 5.0, 5.3); armF += k * 50 + bump(t, 5.4, 5.8) * 30; armB += k * 40; }
        if (m === believer) {
          const k = es(t, 9.05, 9.5);
          x = lerp(m.x, 650, k); if (k > 0 && k < 1) walk = x * 0.05;
          armF += es(t, 9.4, 9.6) * 60;
        }
        if (m === refuser) {
          const k = es(t, 10.05, 10.5);
          flip = !(k > 0.02); x = lerp(m.x, m.x + 25, k); if (k > 0 && k < 1) walk = x * 0.05;
          head = -12 + k * 22;
        }
        if (m.i < 4 && m !== sealer && m !== believer) { const turn = es(t, 4.35, 4.5) * (1 - es(t, 5.9, 6.1)); flip = turn > 0.5 ? !m.flip : flip; head = head + turn * 14; }
        m.p.set({ x, y: GY, s: 0.95, flip, walk, armF, armB, head, o, blink: blinkAt(T, m.seed) });
      });

      /* v31b — the man from the earth speaks of earthly things */
      const ek = es(t, 1.0, 1.25);
      earther.set({ x: 650 - (1 - ek) * 400, y: GY + 34, s: 1.05, flip: false, walk: ek > 0 && ek < 1 ? ek * 30 : undefined, armF: 20 + bump(t, 1.3, 1.95) * 60, armB: 10, head: 4, o: seg(t, 1.0, 1.05) * (1 - es(t, 2.1, 2.4)), blink: blinkAt(T, 7) });
      vpose(earthSay, { x: 660, y: GY - 190, s: es(t, 1.3, 1.5, ease.back), o: seg(t, 1.3, 1.35) * (1 - es(t, 1.95, 2.05)) });
      vpose(earthT, { x: 560, y: GY - 60, s: es(t, 1.25, 1.4, ease.back), o: seg(t, 1.25, 1.3) * (1 - es(t, 1.95, 2.05)) });
      /* v31c — above all */
      vpose(heavT, { x: HX, y: jhy - 120, s: es(t, 2.3, 2.5, ease.back), o: seg(t, 2.3, 2.35) * (1 - es(t, 2.95, 3.05)) });

      /* v32 — He testifies to what He has seen and heard; no one receives it */
      const sk2 = es(t, 3.05, 3.3, ease.back), su = es(t, 3.9, 4.05);
      vpose(eyeP, { x: HX - 130, y: jhy - 60, s: sk2 * (1 - su), o: seg(t, 3.05, 3.1) * (1 - su) });
      vpose(earP, { x: HX + 130, y: jhy - 60, s: es(t, 3.2, 3.45, ease.back) * (1 - su), o: seg(t, 3.2, 3.25) * (1 - su) });
      voice(jhx, jhy + 4, bump(t, 3.05, 3.9) + bump(t, 6.05, 6.95), T, { spread: 2 });
      slips.forEach((sl) => {
        const k = seg(t, 4.05 + sl.i * 0.05, 4.45 + sl.i * 0.05), fall = es(t, 4.45 + sl.i * 0.05, 4.8 + sl.i * 0.05, ease.in);
        const tgt = PEOPLE[sl.i % 6];
        const x = lerp(jhx, tgt.x, ease.out(k)), y = lerp(jhy, GY - 190, ease.out(k)) - Math.sin(k * PI) * 60 + fall * 180;
        const keep = sl.i === 2 && t > 4.7;   // the one that is caught (v33)
        vpose(sl.el, { x: keep ? sealer.x - 50 : x, y: keep ? GY - 120 : y, r: fall * 80 + sl.i * 10, s: 1.5, o: k > 0 ? (keep ? 1 - es(t, 5.3, 5.4) : 1 - es(t, 4.8, 5.0)) : 0 });
      });

      /* v33 — she received it, and sets her seal: God is true */
      const sk3 = es(t, 5.25, 5.45, ease.back);
      vpose(sealEl, { x: sealer.x - 90, y: GY - 170, s: sk3 * 1.5, o: seg(t, 5.25, 5.3) * (1 - es(t, 5.95, 6.1)) });
      const press = es(t, 5.5, 5.62, ease.in);
      vpose(stamp, { x: 30, y: 16 - (1 - press) * 30, s: 0.5 + (1 - press) * 0.3, o: seg(t, 5.45, 5.5) });

      /* v34 — words of God; the Spirit without measure */
      words.forEach((w) => {
        const k = ((t - 6.1) * 0.9 + w.i / 7) % 1;
        const on = es(t, 6.1, 6.3) * (1 - es(t, 6.95, 7.1));
        const a = -PI / 2 + (w.i - 3) * 0.35;
        vpose(w.el, { x: jhx + Math.cos(a) * (40 + k * 250), y: jhy + Math.sin(a) * (40 + k * 190) + 60, s: 1 + k * 0.6, r: (w.i - 3) * 8, o: on * Math.sin(Math.max(0, k) * PI) });
      });
      const po = es(t, 7.1, 7.35) * (1 - es(t, 8.05, 8.3));
      vpose(pour, { x: HX, y: jhy - 540, sx: 0.5 + po * 0.5 + Math.sin(T * 3) * 0.02, o: po });
      const bk = es(t, 7.05, 7.3, ease.out), bu = es(t, 8.0, 8.2, ease.in);
      const by = lerp(-300, 250, bk) - bu * 700;
      hangAt(bowl, 1010, by, T, bk > 0 && bu < 1 ? 1 : 0, 3, 1.2, 1);
      vpose(spill, { x: 1010, y: by + 6, s: 1.4, sy: 1.4 * es(t, 7.3, 7.6), o: (bk > 0 && bu < 1 ? 1 : 0) * seg(t, 7.3, 7.35) });
      const dk = es(t, 7.25, 7.8, ease.out);
      vpose(doveEl, { x: HX + 20, y: lerp(-80, jhy - 70, dk), s: 0.8, o: seg(t, 7.2, 7.3) * (1 - es(t, 8.0, 8.15)) });
      flapWings(doveEl, T || 1, 30, 9);

      /* v35 — the Father loves the Son and gives all into His hands */
      const lk = es(t, 8.05, 8.35, ease.back);
      vpose(loveH, { x: HX, y: jhy - 150 + Math.sin(T * 2) * 3, s: lk * (1 + Math.sin(T * 3) * 0.05), o: seg(t, 8.05, 8.1) * (1 - es(t, 9.0, 9.2)) });
      const wk = es(t, 8.25, 8.65, ease.out);
      const [hx, hy] = hand(HX, HY, 1.05, false, 20 + take * 60);
      vpose(world, { x: lerp(HX + 20, hx + 6, wk), y: lerp(-100, hy - 30, wk), s: 0.8 + wk * 0.3, r: T * 6, o: seg(t, 8.2, 8.25) * (1 - es(t, 9.0, 9.2)) });
      vpose(allT, { x: HX + 190, y: jhy + 40, s: es(t, 8.55, 8.75, ease.back), r: 3, o: seg(t, 8.55, 8.6) * (1 - es(t, 9.0, 9.1)) });

      /* v36 — eternal life; and the one who turns away */
      const tk = es(t, 9.3, 9.8, ease.back);
      vpose(tree, { x: 575, y: GY + 12, s: tk * 1.3, o: seg(t, 9.3, 9.35) });
      const [bhx, bhy] = headAt(650, GY, 0.95, false);
      vpose(bHeart, { x: bhx, y: bhy - 40, s: es(t, 9.45, 9.65, ease.back) * (1 + Math.sin(T * 3) * 0.06), o: seg(t, 9.45, 9.5) });
      vpose(lifeT, { x: 560, y: GY - 330, s: es(t, 9.5, 9.7, ease.back), o: seg(t, 9.5, 9.55) });
      vpose(wither, { x: refuser.x + 90, y: GY + 10, s: es(t, 10.2, 10.4), o: seg(t, 10.2, 10.25) });
      const [rhx, rhy] = headAt(refuser.x + 25, GY, 0.95, false);
      vpose(storm, { x: rhx, y: lerp(rhy - 220, rhy - 80, es(t, 10.2, 10.6)) + Math.sin(T * 1.2) * 3, s: 0.9, o: es(t, 10.2, 10.4) * 0.95 });

      S.cam.x = -es(t, 0.95, 1.3) * 50 * (1 - es(t, 2.0, 2.3)) + es(t, 10.0, 10.4) * 60;
      S.cam.y = -es(t, 2.0, 2.4) * 110 * (1 - es(t, 2.9, 3.2)) - es(t, 7.0, 7.4) * 100 * (1 - es(t, 8.7, 9.1)) + 20;
      S.cam.z = 1.05 - es(t, 2.0, 2.4) * 0.05 * (1 - es(t, 2.9, 3.2));
    };
  },
};
