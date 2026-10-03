// Mk 6,35–38 — late in the day on the lonely hillside: "send them away"; "you give them something to eat";
// two hundred denarii?; "go and see" — five loaves and two fish.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, palm, rock, town, sun, cloud, grass, flowers, bush, olive } from '../../assets/nature.js';
import { bird, paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, hand, speech, GLYPH, coin, coinStack, loaf, fishCut, basket, purse, labelTag, disc, man, woman, LOOK } from './lib.js';

const PI = Math.PI;
const Y = 700;

/** a still group of people as one cut-out (no per-person motion) */
function group(c, members) {
  return members.map((m) => `<g transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) scale(${m.flip ? -m.s : m.s} ${m.s})">${person(c, m.o)}</g>`).join('');
}

export default {
  id: 'm6-evening',
  beats: [
    { v: 35 },
    { v: 36 },
    { v: 37, text: 'Lecz On im odpowiedział: «Wy dajcie im jeść!»' },
    { v: 37, cont: true, text: 'Rzekli Mu: «Mamy pójść i za dwieście denarów kupić chleba, żeby im dać jeść?»' },
    { v: 38, text: 'On ich spytał: «Ile macie chlebów? Idźcie, zobaczcie!»' },
    { v: 38, cont: true, text: 'Gdy się upewnili, rzekli: «Pięć i dwie ryby».' },
  ],
  cam: { x: [-60, 60], y: [0, 70], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const DAY = ['#c9dcd6', '#efe3c6', '#f6e6c9'];
    const LATE = ['#c7a9bd', '#efbf94', '#f6d9ae'];
    const sk = sky(S, DAY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep, disc: '#f0b060', inner: '#f5ca8a' }), { x: 0, y: 0, len: 900 });
    const cl1 = hanging(hangL, cloud(c, 200, C.cream, C.peach), { x: 520, y: 150, len: 600 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 240, speed: 30, scale: 0.5 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [18, 8, 3], lens: [1100, 400, 140], color: mix(C.hillFar, C.duskViolet, 0.15) }).markup);
    const lakeL = S.layer({ par: 0.1, sh: 1 });
    lakeL.add(waterBand(c, { y: 440, color: C.lake, foamN: 16, bottom: 900 }).markup);
    const farL = S.layer({ par: 0.18, sh: 3 });
    const fh = hillsWith(c, { y: 480, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 });
    farL.add(fh.markup);
    farL.add(town(c, { x: 330, y: fh.fn(330) + 16, n: 5, spread: 160, sc: 0.5 }) + town(c, { x: 1260, y: fh.fn(1260) + 16, n: 5, spread: 160, sc: 0.5 }));
    const villageGlow = [330, 1260].map((x) => farL.add(`<g transform="translate(${x} ${fh.fn(x) + 4})"><circle r="70" fill="url(#warm-glow)"/></g>`));

    /* ---------- the hillside and its crowd ---------- */
    const hill = S.layer({ par: 0.35, sh: 3 });
    const hfn = c.wave(560, [10, 5], [700, 220]);
    hill.add(sheet().p(c.ridge(hfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.3)).out());
    hill.add(grass(c, { x0: -600, x1: 2200, y: 570, fn: hfn, n: 50, h: 12, color: C.moss }));
    const people = [];
    for (let i = 0; i < 26; i++) {
      const x = c.rr(260, 1340), y = hfn(x) + c.rr(8, 60);
      people.push({ x, y, s: 0.36 + (y - 560) * 0.004, flip: x > 800, o: { ...(c.chance(0.5) ? man(c) : woman(c)), pose: c.pick(['stand', 'sit', 'sit']) } });
    }
    people.sort((a, b) => a.y - b.y);
    hill.add(group(c, people));
    hill.add(olive(c, 180, 600, 0.8) + olive(c, 1440, 610, 0.9));
    // long evening shadow tint
    const warm = S.layer({ par: 0, sh: 1, flat: true });
    warm.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#e79a5f"/>`);

    /* ---------- the foreground where Jesus and the Twelve stand ---------- */
    const ground = S.layer({ par: 0.5, sh: 3 });
    const gfn = c.wave(650, [5, 2], [700, 180]);
    ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.5)).out());
    ground.add(grass(c, { x0: -600, x1: 2200, y: 650, fn: gfn, n: 40, h: 14, color: C.moss }) + flowers(c, { x0: 300, x1: 1300, y: 660, n: 18, fn: gfn }));
    const act = S.layer({ par: 0.55, sh: 5 });
    const DIS = [
      { o: CAST.peter, x: 640, from: 300 }, { o: LOOK.philip, x: 580, from: 240 }, { o: CAST.john, x: 520, from: 200 },
      { o: CAST.andrew, x: 960, from: 1300, andrew: true }, { o: CAST.james, x: 1030, from: 1360 }, { o: LOOK.judas, x: 1100, from: 1420, purse: true },
    ].map((d) => (S.portrait && d.x > 800 ? { ...d, x: d.x - 20 - (d.x - 960) * 0.3 } : d)).map((d, i) => ({ ...d, i, left: d.x < 800, seed: c.rr(0, 6) }));
    DIS.forEach((d) => {
      const extra = d.purse ? { holdB: `<g transform="translate(0 10) scale(.8)">${purse(c)}</g>` } : d.andrew ? { holdF: `<g transform="translate(0 4) rotate(80)"><g transform="translate(0 22)">${basket(c, { w: 44, h: 24 })}</g></g>` } : {};
      const el = act.add(person(c, { ...d.o, ...extra }));
      d.p = S.puppet(el); d.hold = el.querySelector('.hold');
    });
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));

    /* ---------- bubbles & the count ---------- */
    const fx = S.layer({ par: 0.6, sh: 4 });
    const late = fx.add(`<g>${speech(c, `<path d="${c.cut([[-20, 8], ...c.arc(0, 8, 20, 18, PI, 2 * PI, 10), [20, 8]], 0.3, 4)}" fill="${C.sunDeep}"/><path d="${c.ribbon([[-26, 9], [26, 9]], 3)}" fill="${C.moss}"/>`, { w: 62, h: 48 })}</g>`);
    const buy = fx.add(`<g>${speech(c, `<g transform="translate(-16 2)">${coin(c, 9)}</g><path d="${c.ribbon([[-4, 2], [6, 2]], 2.4)}" fill="${C.ink}"/><path d="M6 -3L12 2L6 7Z" fill="${C.ink}"/><g transform="translate(22 8)">${loaf(c, 11)}</g>`, { w: 76, h: 48, flip: true })}</g>`);
    const give = fx.add(`<g>${speech(c, `<g transform="translate(0 10)">${loaf(c, 16)}</g>`, { w: 52, h: 46, flip: true })}</g>`);
    const money = hanging(fx, `<g transform="translate(-26 34)">${coinStack(c, 7, 11)}</g><g transform="translate(4 34)">${coinStack(c, 9, 11)}</g><g transform="translate(32 34)">${coinStack(c, 6, 11)}</g><g transform="translate(0 64)">${labelTag(tr('200 denarów?', '200 denarii?'), 18)}</g>`, { x: 0, y: 0, len: 600 });
    const q = fx.add(`<g>${speech(c, GLYPH.q(c), { w: 42, h: 40, flip: true })}</g>`);
    const loaves = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${loaf(c, 16)}</g>`));
    const fishes = [0, 1].map((i) => fx.add(`<g>${fishCut(c, { color: i ? C.lake3 : C.teal2, r: 0.9 })}</g>`));
    const n5 = fx.add(`<g>${paperLabel('5', { size: 30 })}</g>`);
    const n2 = fx.add(`<g>${paperLabel('2', { size: 30 })}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 80, 880, 240, C.sage, C.moss) + bush(c, 1560, 880, 240, C.moss, C.sage) + rock(c, 380, 900, 130, 50, C.rock2) + flowers(c, { x0: 1150, x1: 1500, y: 866, n: 12 }));

    return (t, time) => {
      const T = time;
      const lateK = es(t, -0.3, 1.2);
      sk.blend(DAY, LATE, lateK);
      warm.fade(lateK * 0.1);
      swing(sunEl, S.portrait ? 680 : 1160, 150 + lateK * 230, T, 1.1, 0.6);   // phone: the sun clear of the thread and of the 200 denarii
      swing(cl1, 520 + Math.sin(T * 0.1) * 30, 150, T, 1.4, 0.6, 1);
      birds(T, 1);
      villageGlow.forEach((g) => fade(g, bump(t, 1.05, 1.95)));

      /* v35 — the disciples come: "the place is deserted and it's late" */
      const ask = bump(t, 1.05, 1.95);
      const count = es(t, 4.05, 4.3) * (1 - es(t, 4.75, 5.0));
      DIS.forEach((d) => {
        const inK = es(t, 0.05 + d.i * 0.05, 0.4 + d.i * 0.05);
        const away = count;
        const back = es(t, 4.8, 5.05);
        const tx = d.left ? d.x - away * 380 : d.x + away * 380;
        const x = lerp(d.from, tx, inK);
        const walk = (inK > 0 && inK < 1) || (count > 0 && count < 1);
        const shrug = bump(t, 3.05, 3.95);
        const surprised = bump(t, 2.05, 2.9);
        const faceAway = count > 0.02 && count < 0.98 ? !d.left : false;
        d.p.set({
          x, y: Y + (d.i % 3) * 6, s: 0.9, flip: d.left ? faceAway : !faceAway, walk: walk ? x * 0.05 + d.i : undefined,
          armF: 20 + (d.i === 0 ? bump(t, 0.4, 1.0) * 60 : 0) + (d.i === 1 ? ask * 90 : 0) + shrug * 60 + (d.andrew ? es(t, 5.0, 5.2) * 60 : 0),
          armB: shrug * 60 + (d.purse ? shrug * 60 : 0), lean: -surprised * 6 * (d.left ? 1 : -1), head: -surprised * 6 + shrug * 6, blink: blinkAt(T, d.seed),
        });
        if (d.hold && d.andrew) d.hold.setAttribute('opacity', String(es(t, 4.95, 5.0)));
      });
      const point = bump(t, 2.05, 2.95);
      const go = bump(t, 4.05, 4.95);
      jesus.set({ x: 800, y: Y - 4, s: 1.0, flip: false, armF: 20 + point * 60 + go * 90 + bump(t, 5.2, 5.95) * 40, armB: point * 90 + go * 30, head: -go * 4, blink: blinkAt(T) });

      const b = (el, x, y, a, z) => { const k = es(t, a, a + 0.2, ease.back) * (1 - es(t, z, z + 0.1)); pose(el, { x, y, s: k, o: k > 0.01 ? 1 : 0 }); };
      b(late, 660, 470, 0.45, 0.92);
      b(buy, 560, 470, 1.15, 1.92);
      b(give, 790, 450, 2.15, 2.92);
      b(q, 790, 450, 4.15, 4.92);
      const mk = es(t, 3.1, 3.4, ease.back) * (1 - es(t, 3.9, 4.05));
      pose(money, { x: 960, y: lerp(-500, 340, mk), s: 1.3, r: Math.sin(T * 1.1) * 2.5, o: mk > 0.01 ? 1 : 0 });

      /* v38b — five loaves and two fish rise out of Andrew's basket */
      const [bx, by] = hand(DIS[3].x, Y, 0.9, true, 80);
      loaves.forEach((l, i) => {
        const k = es(t, 5.15 + i * 0.06, 5.4 + i * 0.06, ease.back);
        const a = PI * (1.15 + i * 0.12);
        pose(l, { x: lerp(bx, 900 + Math.cos(a) * 120, k), y: lerp(by, 520 + Math.sin(a) * 60, k), s: k * 1.3, o: k > 0.01 ? 1 : 0 });
      });
      fishes.forEach((f, i) => {
        const k = es(t, 5.5 + i * 0.08, 5.75 + i * 0.08, ease.back);
        pose(f, { x: lerp(bx, (S.portrait ? 990 : 1050) + i * (S.portrait ? 60 : 70), k), y: lerp(by, 500 - i * 12, k), s: k * 1.3, r: -10 + i * 20, o: k > 0.01 ? 1 : 0 });
      });
      const k5 = es(t, 5.45, 5.6, ease.back), k2 = es(t, 5.75, 5.9, ease.back);
      pose(n5, { x: 750, y: 470, s: k5, o: k5 > 0.01 ? 1 : 0 });
      pose(n2, { x: S.portrait ? 1090 : 1170, y: S.portrait ? 420 : 450, s: k2, o: k2 > 0.01 ? 1 : 0 });

      S.cam.z = kf(t, [[0, 1.06], [1, 1.1], [3, 1.08], [4, 1.04], [5, 1.12]]);
      S.cam.y = kf(t, [[0, 30], [1, 40], [4, 20], [5, 50]]);
      S.cam.x = kf(t, [[0, 0], [1, -30], [2, 0], [3, 30], [4, 0], [5, 30]]);
    };
  },
};
