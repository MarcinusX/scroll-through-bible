// J 1,23–28 — "I am the voice of one crying in the wilderness": John's cry rings out and the crooked road
// from Jerusalem is made straight while Isaiah's scroll hangs open. The envoys are Pharisees: why then baptise?
// "I baptise with water" — and among them, unnoticed under a plain mantle, stands the One they do not know.
// A great sandal comes down: John is not worthy to untie its strap. All this in Bethany beyond the Jordan.
import { C, person, crowd, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { DAY, JOHN_B, LEVITE, JESUS_HOODED, jordanSet, priest, bubble, hungPlate, iconWord, crossOut, crown, oilHorn, fireWheel, headAt, hand, drops, shell, voiceRings, hang2, scrollParts, sandalBig, signpost, landMap, LAND, pin, nameTag, glowDisc, sparkle, man as manOpts, woman as womanOpts, PI } from './lib.js';
import { scrollRoll } from '../mark3/lib.js';

const BANK = 772, WADE = 702, JX = 930;

export default {
  id: 'j1-baptize',
  beats: [
    { v: 23, text: 'Odpowiedział: «Jam głos wołającego na pustyni:' },
    { v: 23, cont: true, text: 'Prostujcie drogę Pańską, jak powiedział prorok Izajasz».' },
    { v: 24 },
    { v: 25 },
    { v: 26, text: 'Jan im tak odpowiedział: «Ja chrzczę wodą.' },
    { v: 26, cont: true, text: 'Pośród was stoi Ten, którego wy nie znacie,' },
    { v: 27 },
    { v: 28 },
  ],
  cam: { x: [-60, 60], y: [-80, 60], z: [0.9, 1.2] },
  build(S) {
    const c = S.c;
    const J = jordanSet(S, { skyCols: DAY, sunAt: [1230, 150], city: true, path: false });

    /* ---------- the road from Jerusalem: crooked, then straight ---------- */
    const crookedL = S.layer({ par: 0.16, sh: 2 });
    crookedL.add(sheet().p(c.ribbon(J.PATH, (u) => 5 + u * 10, 0.6), C.sand).out());
    const straightL = S.layer({ par: 0.16, sh: 2 });
    straightL.add(sheet().p(c.ribbon([[450, 362], [570, 440], [690, 522]], (u) => 6 + u * 12, 0.6), mix(C.sand, C.cream, 0.4)).out());
    straightL.fade(0);
    const dust = [0, 1, 2, 3, 4].map((i) => straightL.add(`<g>${sparkle(c, 10 + (i % 2) * 4)}</g>`));
    const bethany = J.far.add(`<g>${signpost(c, tr('Betania', 'Bethany'), { size: 18 })}</g>`);
    const fbPeople = crowd(S, J.far, [{ y: 584, s: 0.4, n: 8, x0: 150, x1: 1450 }]).filter((m) => Math.abs(m.x - JX) > 120 && Math.abs(m.x - 560) > 60);

    /* ---------- John in the river ---------- */
    const R = J.riverLayer();
    const john = S.puppet(R.add(person(c, { ...JOHN_B, holdF: `<g transform="rotate(-20)">${shell(c, 15)}</g>` })));
    const pourEl = R.add(`<g>${drops(c, 6, C.lake2)}</g>`);
    const splash = R.add(`<g opacity="0">${[-1, 1].map((sd) => `<path d="${c.cut([[0, 0], [sd * 20, -30], [sd * 30, -26], [sd * 12, 2]], 0.4, 4)}" fill="${C.foam}"/>`).join('')}</g>`);
    J.waterFront(R);

    /* ---------- the near bank: the envoys, and the people — with Him among them ---------- */
    const { N } = J.nearBank();
    const DEL = [
      { m: priest(c, 0), x: 440, s: 1.0 },
      { m: priest(c, 1), x: 560, s: 0.98 },
      { m: person(c, { ...LEVITE(0), holdF: `<g transform="translate(2 4) rotate(80)">${scrollRoll(c)}</g>` }), x: 330, s: 0.95 },
    ].map((d, i) => ({ ...d, i, p: S.puppet(N.add(d.m)) }));
    const glowJ = N.add(`<g>${glowDisc(150, 'halo-glow', 1)}${glowDisc(90, 'warm-glow', 0.8)}</g>`);
    const others = [
      { o: womanOpts(c, { robe: C.ochreRobe, veil: C.stone }), x: 690, s: 0.9, flip: true },
      { o: manOpts(c, { robe: C.sageRobe }), x: 830, s: 0.92, flip: true },
    ].map((m, i) => ({ ...m, i, p: S.puppet(N.add(person(c, m.o))) }));
    const JESX = 760;
    const jesus = S.puppet(N.add(person(c, JESUS_HOODED)));
    const voice = voiceRings(N, c, { n: 4, color: C.clay, r: 44, w: 7, both: false });

    /* ---------- from the flies ---------- */
    const T = S.layer({ par: 0.3, sh: 6 });
    const voicePlate = T.add(hungPlate(c, iconWord(`<g transform="translate(-14 0)">${[0, 1, 2].map((i) => `<path d="${c.ribbon(c.arc(0, 0, 12 + i * 10, 12 + i * 10, -0.6, 0.6, 8), 4)}" fill="${C.clay}"/>`).join('')}<path d="${c.cut(c.ell(-8, 0, 8, 10, 10), 0.2, 3)}" fill="${C.clay}"/></g>`, tr('głos', 'a voice')), { r: 58 }));
    const sp = scrollParts(c, { w: 300, h: 150, title: tr('Izajasz', 'Isaiah'), lines: 4 });
    const scrollEl = T.add(hang2(`<g data-k="sheet">${sp.sheet}</g><g data-k="rodB">${sp.rod}</g><g>${sp.rod}</g>`, 140, 600));
    const sheetEl = S.$('sheet'), rodB = S.$('rodB');
    const phTag = T.add(`<g class="hang"><path d="M0 -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${nameTag(c, tr('faryzeusze', 'Pharisees'), { size: 19 })}</g></g>`);
    const mini = [
      `<g transform="translate(-6 6) scale(1.2)">${crown(c)}</g>`,
      `<g transform="scale(.45)">${fireWheel(c, 40)}</g>`,
      `<g transform="scale(1.3)">${scrollRoll(c)}</g>`,
    ].map((icon, i) => ({ i, el: T.add(hungPlate(c, icon, { r: 40 })), cr: T.add(`<g>${crossOut(c, 26)}</g>`) }));
    const whyEl = T.add(`<g>${bubble(c, [tr('Czemu zatem', 'Why then do'), tr('chrzcisz?', 'you baptize?')], { size: 20, tail: -1 })}</g>`);
    const waterEl = T.add(`<g>${bubble(c, tr('Ja chrzczę wodą', 'I baptize in water'), { size: 20, tail: 1 })}</g>`);
    const sandalEl = T.add(`<g class="hang"><path d="M-40 -1600V-300M40 -1600V-300" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${sandalBig(c, 300)}</g></g>`);
    const thong = sandalEl.querySelector('.thong');
    const mapEl = T.add(hang2(`<g transform="scale(.56)">${landMap(c)}<g transform="translate(${LAND.beth[0]} ${LAND.beth[1]})" data-k="pin">${pin(c)}</g></g>`, 130, 500));
    const pinEl = S.$('pin');

    J.foreground();

    return (t, time) => {
      J.update(t, time);

      /* v23a: I am the voice */
      const cry = es(t, 0.1, 0.3) * (1 - es(t, 1.8, 2.0));
      const vp = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 1.9, 2.2, ease.in));
      pose(voicePlate, { x: 1110, y: lerp(280, 280, vp) - (1 - vp) * 700, r: Math.sin(t * 3.6) * 1.5, o: vp > 0.01 ? 1 : 0 });
      /* v23b: make straight the way — Isaiah's scroll; the crooked road is straightened */
      const down = es(t, 1.02, 1.3, ease.out), unroll = es(t, 1.2, 1.45), up = es(t, 1.9, 2.2, ease.in);
      pose(scrollEl, { x: 800, y: lerp(-420, 110, down) - up * 600, r: Math.sin(t * 2.4) * 0.6, o: down > 0.01 && up < 1 ? 1 : 0 });
      pose(sheetEl, { sy: 0.03 + unroll * 0.97 });
      pose(rodB, { y: unroll * 150 });
      const st = es(t, 1.4, 1.8);
      straightL.fade(st);
      crookedL.fade(1 - es(t, 1.55, 1.85));
      dust.forEach((d, i) => { const k = bump(t, 1.4 + i * 0.05, 1.8 + i * 0.05); pose(d, { x: 470 + i * 50, y: 380 + i * 34, s: k, r: t * 120, o: k }); });

      /* v24: the envoys were Pharisees */
      const ph = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 2.9, 3.1, ease.in));
      pose(phTag, { x: 450, y: lerp(-500, 470, ph), r: Math.sin(t * 4.4) * 2, o: ph > 0.01 ? 1 : 0 });
      /* v25: why then do you baptise? — the three crossed plates, once more */
      mini.forEach((m) => {
        const k = es(t, 3.1 + m.i * 0.08, 3.35 + m.i * 0.08, ease.out) * (1 - es(t, 3.85, 4.05, ease.in));
        const x = 560 + m.i * 110, y = lerp(-400, 330, k);
        pose(m.el, { x, y, r: Math.sin(t * 4.0 + m.i) * 2, o: k > 0.01 ? 1 : 0 });
        pose(m.cr, { x, y, s: 0.9, o: k > 0.01 ? 1 : 0 });
      });

      /* the envoys */
      DEL.forEach((d) => {
        const ask = d.i === 1 ? bump(t, 3.05, 3.9) : 0;
        const look = es(t, 5.2, 5.5) * (1 - es(t, 6.0, 6.2));
        d.p.set({ x: d.x, y: BANK + (d.i % 2) * 6, s: d.s, flip: false, armF: 12 + ask * 80 + (d.i === 2 ? bump(t, 2.1, 2.8) * 40 : 0), armB: d.i === 0 ? bump(t, 0.2, 1.0) * 30 : 0, head: -6 - bump(t, 0.2, 1.0) * 6 + look * Math.sin(time * 1.3 + d.i * 2) * 14, blink: blinkAt(time, d.i) });
      });
      const [ax, ay] = headAt(DEL[1].x, BANK, 1, false);
      pose(whyEl, { x: ax + 50, y: ay - 16, s: es(t, 3.1, 3.3, ease.back), o: seg(t, 3.08, 3.12) * (1 - seg(t, 3.9, 3.98)) });

      /* John */
      const scoop = bump(t, 4.1, 4.95);
      const bow = es(t, 6.1, 6.45) * (1 - es(t, 7.0, 7.3));
      const reach = bump(t, 6.35, 6.85);
      john.set({ x: JX, y: WADE, s: 1.05, flip: true, armF: 20 + cry * 60 + scoop * 90 + reach * 60 + es(t, 5.1, 5.4) * (1 - es(t, 6.0, 6.2)) * 70, armB: cry * 140 + scoop * 20, head: -cry * 12 + scoop * 8 + bow * 18, lean: -bow * 14, blink: blinkAt(time, 1) });
      const [jhx, jhy] = headAt(JX, WADE, 1.05, true);
      voice(jhx - 26, jhy + 4, cry * seg(t, 0.15, 0.3), time, { spread: 4, s0: 0.6, dir: -1 });
      const [px, py] = hand(JX, WADE, 1.05, true, 20 + scoop * 90);
      const fall = time ? (time * 1.6) % 1 : 0.5;
      pose(pourEl, { x: px - 10 - fall * 10, y: py + 6 + fall * 60, o: seg(t, 4.4, 4.5) * (1 - seg(t, 4.85, 4.9)) });
      pose(splash, { x: JX - 40, y: 652, s: bump(t, 4.5, 4.9) * 1.2, o: bump(t, 4.5, 4.9) });
      pose(waterEl, { x: jhx - 70, y: jhy - 30, s: es(t, 4.1, 4.3, ease.back), o: seg(t, 4.08, 4.12) * (1 - seg(t, 4.93, 4.99)) });

      /* v26b: among you stands One you do not know */
      const seen = es(t, 5.1, 5.45) * (1 - es(t, 7.1, 7.4) * 0.5);
      jesus.set({ x: JESX, y: BANK - 4, s: 1.0, flip: true, head: -4, blink: blinkAt(time, 5) });
      pose(glowJ, { x: JESX, y: BANK - 120, s: 0.7 + seen * 0.7, o: seen });
      others.forEach((m) => m.p.set({ x: m.x, y: BANK + 2, s: m.s, flip: m.flip, head: m.i ? -4 : 4, blink: blinkAt(time, 6 + m.i) }));

      /* v27: the sandal whose strap he is not worthy to untie */
      const sk = es(t, 6.05, 6.4, ease.out) * (1 - es(t, 7.0, 7.3, ease.in));
      pose(sandalEl, { x: 1110, y: lerp(-400, 520, sk), r: Math.sin(t * 2.4) * 1.2, s: 0.8, o: sk > 0.01 ? 1 : 0 });
      pose(thong, { x: -300 * 0.4 * 0.46, y: -300 * 0.4, r: Math.sin(t * 5.2) * 8 });

      /* v28: in Bethany beyond the Jordan */
      const mk = es(t, 7.05, 7.4, ease.out);
      pose(mapEl, { x: 1110, y: lerp(-500, 300, mk), r: Math.sin(t * 2.8) * 0.8, o: mk > 0.01 ? 1 : 0 });
      pose(pinEl, { x: LAND.beth[0], y: LAND.beth[1], s: es(t, 7.35, 7.55, ease.back), o: seg(t, 7.35, 7.4) });
      const bk = es(t, 7.15, 7.45, ease.back);
      pose(bethany, { x: 560, y: J.fbFn(560) + 6, s: 0.9, sy: 0.9 * Math.max(0.001, bk), o: bk > 0.001 ? 1 : 0 });
      fbPeople.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, head: 4, blink: blinkAt(time, m.seed) }));

      const toRoad = es(t, 1.05, 1.35) * (1 - es(t, 1.9, 2.2));
      S.cam.x = -60 * toRoad + 30 * es(t, 6.0, 6.3) * (1 - es(t, 7.0, 7.3));
      S.cam.y = -60 * toRoad;
      S.cam.z = 1.04 + 0.1 * toRoad - es(t, 7.0, 7.4) * 0.1;
    };
  },
};
