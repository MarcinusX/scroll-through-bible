// Łk 23,39–43 — the good thief (Luke's own; the centrepiece). Near the cross: the three crosses as quiet dark
// silhouettes. From the cross on the right grey scraps fly at Him — "Aren't You the Christ? Save Yourself and us!"
// — and fall away. The man on the left turns his head and rebukes him: "Don't you even fear God?" A balance comes
// down: on one pan two dark stones — we, justly, for our deeds; the other pan empty — He has done nothing wrong.
// Then he turns to Jesus: "Jesus, remember me when You come into Your kingdom" — a thin thread of light runs from
// his cross to Jesus. And the answer: "Truly I tell you, today you will be with Me in Paradise" — behind the hill a
// garden of light opens: trees in leaf, flowers, a gate standing open in the light, and the sky turns to gold.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { olive, palm, cypress, flowers, grass } from '../../assets/nature.js';
import { taunt, bubble, guiltStone, wordPlate, wordCard, crossNearSet, crossHead, glory, strip, hanging, swing, NEAR, J19, tr, PI } from './lib.js';

const PAL = ['#a7a9ba', '#ddd0bd', '#ecd9bb'];
const GOLD = ['#c9b89a', '#f2d9a6', '#f8e6bd'];

/** a hanging balance: beam pivot at the origin; .beam turns; pans hang from its ends (.panL, .panR) */
function balanceM(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-3, -2, 6, 30), 0.2, 3), C.wood2);
  const beam = sheet().p(c.cut(c.rect(-120, -5, 240, 10), 0.3, 6), C.sun).p(c.cut(c.circ(0, 0, 9, 12), 0.2, 3), shade(C.sun, -0.15)).out();
  const pan = (inner, lab) => {
    const p = sheet();
    p.x(c.ribbon([[0, 0], [-34, 80]], 1) + c.ribbon([[0, 0], [34, 80]], 1), C.inkSoft, 'opacity=".7"');
    p.p(c.cut([[-44, 80], [44, 80], ...c.arc(0, 80, 44, 16, 0, PI, 10)], 0.3, 4), shade(C.sun, -0.08));
    return `${p.out()}${inner}<g transform="translate(0 126)">${strip(c, lab, { size: 14 })}</g>`;
  };
  const stones = `<g transform="translate(-14 80)">${guiltStone(c, 17, true)}</g><g transform="translate(15 80)">${guiltStone(c, 14, true)}</g>`;
  const light = `<circle cx="0" cy="66" r="30" fill="url(#halo-glow)"/>`;
  return `<path d="M0 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/>${s.out()}<g class="beam">${beam}<g class="panL" transform="translate(-112 0)">${pan(stones, tr('my — sprawiedliwie', 'we — justly'))}</g><g class="panR" transform="translate(112 0)">${pan(light, tr('On — nic złego', 'He — nothing wrong'))}</g></g>`;
}

export default {
  id: 'lk23-thief',
  beats: [
    { v: 39 },
    { v: 40 },
    { v: 41 },
    { v: 42 },
    { v: 43 },
  ],
  cam: { x: [-160, 110], y: [-60, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const N = crossNearSet(S, { pal: PAL });
    const goldSky = (() => { const L = S.layer({ par: 0, sky: true, rise: 0 }); const id = S.id('gold'); S.defs(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${Math.min(0, S.view().y0).toFixed(0)}" x2="0" y2="760"><stop offset="0" stop-color="${GOLD[0]}"/><stop offset=".55" stop-color="${GOLD[1]}"/><stop offset="1" stop-color="${GOLD[2]}"/></linearGradient>`); L.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${id})"/>`); return L; })();
    N.sk.layer.el.parentNode.insertBefore(goldSky.el, N.sk.layer.el.nextSibling);

    /* the garden of light, behind the hill */
    const garden = S.layer({ par: 0.14, sh: 2, rise: 0 });
    N.hillL.el.parentNode.insertBefore(garden.el, N.hillL.el);
    const GX = 600, GB = 600;
    garden.add(`<g><ellipse cx="${GX}" cy="${GB - 120}" rx="520" ry="240" fill="url(#halo-glow)" opacity=".9"/></g>`);
    garden.add(`<g transform="translate(${GX} ${GB - 170})">${glory(c, 210, 18)}</g>`);
    const gfn = c.wave(GB - 40, [10, 4], [500, 160]);
    let trees = sheet().p(c.ridge(gfn, -300, 1900, 1200, 12, 1), mix(C.leaf, C.cream, 0.35)).out();
    trees += palm(c, 250, GB - 40, 190, { frond: mix(C.moss, C.cream, 0.3), frond2: mix(C.leaf, C.cream, 0.35) }) + olive(c, 420, GB - 36, 1.0, { leaf: mix(C.olive, C.cream, 0.3), leaf2: mix(C.sage, C.cream, 0.35) }) + cypress(c, 860, GB - 40, 190, mix(C.moss2, C.cream, 0.3)) + olive(c, 1020, GB - 38, 1.1, { leaf: mix(C.olive, C.cream, 0.3), leaf2: mix(C.sage, C.cream, 0.35) }) + palm(c, 1290, GB - 40, 210, { frond: mix(C.moss, C.cream, 0.3), frond2: mix(C.leaf, C.cream, 0.35) });
    trees += flowers(c, { x0: 150, x1: 1450, y: GB - 38, fn: gfn, n: 40, h: 26, colors: [C.cream, C.jesusMantle, C.lavender, C.wheat, '#fffdf6'] });
    garden.add(trees);
    // the open gate, full of light
    const gw = 96, gh = 170;
    const arch = [[GX - gw / 2, GB - 40], [GX - gw / 2, GB - 40 - gh + gw / 2], ...c.arc(GX, GB - 40 - gh + gw / 2, gw / 2, gw / 2, PI, 2 * PI, 12), [GX + gw / 2, GB - 40]];
    garden.add(`<g><path d="${c.poly(arch)}" fill="#fffbe8"/>${sheet().p(c.ribbon([[GX - gw / 2 - 6, GB - 36], [GX - gw / 2 - 6, GB - 40 - gh + gw / 2], ...c.arc(GX, GB - 40 - gh + gw / 2, gw / 2 + 6, gw / 2 + 6, PI, 2 * PI, 12), [GX + gw / 2 + 6, GB - 36]], 9), C.sun).out()}</g>`);
    garden.fade(0);

    const [HX, HY] = N.head;
    const glow = N.glowL.add(`<g><circle r="110" fill="url(#halo-glow)"/></g>`);
    const hdL = N.crossL.querySelector('.hd'), hdR = N.crossR.querySelector('.hd');
    const uS = NEAR.L[2] / 240;
    const HDYS = -NEAR.L[2] + 52 * uS - 2 * uS;
    const [lhx, lhy] = [NEAR.L[0], NEAR.L[1] + crossHead(NEAR.L[2])[1]];
    const [rhx, rhy] = [NEAR.R[0], NEAR.R[1] + crossHead(NEAR.R[2])[1]];
    /* a faint light behind the good thief, growing as he turns to Jesus */
    const behind = S.layer({ par: 0.2, sh: 1, flat: true });
    N.hillL.el.parentNode.insertBefore(behind.el, N.hillL.el);
    const lglow = behind.add(`<g><circle r="90" fill="url(#halo-glow)"/></g>`);

    const fx = N.fx;
    const scraps = [0, 1, 2].map((i) => fx.add(`<g>${taunt(c, i === 0 ? tr('Czy Ty nie jesteś Mesjaszem?', 'Aren’t you the Christ?') : i === 1 ? tr('Wybaw siebie i nas!', 'Save yourself and us!') : '…!', { size: i === 2 ? 14 : 18, side: 1, w: i === 2 ? 40 : undefined })}</g>`));
    const rebuke = fx.add(`<g>${bubble(c, tr(['Ty nawet Boga', 'się nie boisz?'], ['Don’t you even', 'fear God?']), { size: 18, dir: -1 })}</g>`);
    const balL = S.layer({ par: 0.26, sh: 5 });
    const bal = balL.add(`<g>${balanceM(c)}</g>`);
    const beam = bal.querySelector('.beam'), panL = bal.querySelector('.panL'), panR = bal.querySelector('.panR');
    const remember = fx.add(`<g>${bubble(c, tr(['Jezu, wspomnij na mnie', 'w swoim królestwie'], ['Jesus, remember me', 'in your Kingdom']), { size: 18, dir: -1, fill: '#fff6dc' })}</g>`);
    const thD = c.qbez([lhx + 34, lhy - 10], [(lhx + HX) / 2, lhy - 150], [HX - 40, HY - 6], 16).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
    const thread = N.glowL.add(`<g><path d="M${thD}" fill="none" stroke="${C.haloRim}" stroke-width="3.4" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/></g>`).firstElementChild;
    const plL = S.layer({ par: 0.3, sh: 6 });
    const promise = hanging(plL, wordPlate(c, tr(['«Zaprawdę, powiadam ci:', 'Dziś ze Mną będziesz w raju»'], ['“Assuredly I tell you,', 'today you will be with me in Paradise.”']), { size: 25, fill: '#fff8e2' }), { x: 0, y: -1500, len: 900 });

    return (t, time) => {
      const T = time;
      N.sk.set(...PAL);
      const open = es(t, 4.1, 4.6);
      goldSky.fade(open);
      garden.fade(open);
      garden.shift(0, (1 - open) * 140);
      pose(glow, { x: HX, y: HY + 10, s: 1 + open * 0.2, o: 0.55 + open * 0.2 });

      /* v39 — the one on the right rails at Him */
      const railR = es(t, 0.05, 0.3) * (1 - es(t, 1.2, 1.5));
      pose(hdR, { x: 0, y: HDYS, r: -railR * 18 + bump(t, 1.05, 1.9) * 10 });
      scraps.forEach((sc, i) => {
        const k = seg(t, 0.08 + i * 0.22, 0.95 + i * 0.22);
        const fly = Math.min(1, k / 0.55), fall = Math.max(0, (k - 0.55) / 0.45);
        const tx = HX + [110, 150, 120][i], ty = HY + [60, 110, 30][i];
        pose(sc, { x: lerp(rhx - 30, tx, ease.out(fly)), y: lerp(rhy - 20, ty, ease.out(fly)) - Math.sin(fly * PI) * 40 + fall * fall * 240, s: 1 - fly * 0.1, r: fall * 40, o: k > 0 && k < 1 ? Math.min(1, k * 8) * (1 - fall) : 0 });
      });

      /* v40 — the other rebukes him */
      const rb = es(t, 1.05, 1.3, ease.back) * (1 - es(t, 1.9, 2.05));
      const turnL = es(t, 1.05, 1.3) * (1 - es(t, 2.9, 3.2)) ;
      const toJ = es(t, 2.95, 3.3);
      pose(hdL, { x: 0, y: HDYS, r: turnL * 16 - toJ * 14 });
      pose(rebuke, { x: lhx + 20, y: lhy - 36, s: rb, o: rb > 0.02 ? 1 : 0 });

      /* v41 — the balance: we justly, He nothing wrong */
      const bk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      const tilt = es(t, 2.3, 2.6) * 14;
      pose(bal, { x: 610, y: lerp(-400, 236, bk), s: 0.8, o: bk > 0.01 ? 1 : 0 });
      pose(beam, { r: -tilt });
      const a = (-tilt * PI) / 180;
      pose(panL, { x: -112 * Math.cos(a), y: -112 * Math.sin(a) });
      pose(panR, { x: 112 * Math.cos(a), y: 112 * Math.sin(a) });

      /* v42 — "Jesus, remember me" */
      const rk = es(t, 3.05, 3.3, ease.back) * (1 - es(t, 3.95, 4.1));
      pose(remember, { x: lhx + 24, y: lhy - 40, s: rk, o: rk > 0.02 ? 1 : 0 });
      const th = es(t, 3.2, 3.7);
      fade(thread.parentNode, th > 0.001 ? 1 : 0);
      attr(thread, 'stroke-dashoffset', 1 - th);
      pose(lglow, { x: lhx, y: lhy + 6, s: 0.8 + open * 0.4, o: toJ * 0.45 + open * 0.3 });

      /* v43 — "Today you will be with Me in Paradise" */
      const pk = es(t, 4.05, 4.4, ease.out);
      swing(promise, 800, 130 - (1 - pk) * 900, T, 0.7, 0.6, 1);

      S.cam.x = -es(t, 0.9, 1.3) * 40 * (1 - es(t, 4.0, 4.4)) + es(t, 0, 0.5) * 20 * (1 - es(t, 0.9, 1.3));
      S.cam.y = 10 - es(t, 3.9, 4.4) * 40;
      S.cam.z = 1.04 - es(t, 3.9, 4.4) * 0.04;
      if (S.portrait) S.cam.x += 80 * (1 - es(t, 0.9, 1.3)) - 110 * es(t, 0.9, 1.3) * (1 - es(t, 3.95, 4.4));
    };
  },
};
