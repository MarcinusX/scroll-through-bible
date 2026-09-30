// Łk 22,27–30 — "Who is greater, the one at table or the one who serves?" A little balance comes down: on one pan a
// guest reclining, on the other a servant with a jug — and it tips towards the guest: surely the one at table. "But I am
// among you as the one who serves": He rises, a towel tied at His waist, and goes round the front of the table pouring
// into their cups. "You have stayed with me in my trials": a sepia picture of the boat in the storm and the long road.
// "I confer on you a kingdom, as my Father conferred it on me": from the light above (never a figure) a gold crown comes
// down into His hands, and He sets a small one before each of them. "You will eat and drink at my table in my Kingdom
// and sit on thrones judging the twelve tribes": a golden flat — the table of the Kingdom, twelve thrones round it,
// and the banners of the twelve tribes below.
import { es, ease, bump, seg } from '../../core/anim.js';
import { boat } from '../../assets/things.js';
import {
  tableSet, NIGHTROOM, TW, JESUS_TUNIC, CAST, kf, hand, headAt, towelWrap, ewer, waterStream, addToBody, person, mini, paperCrown, smallThrone,
  radiance, memoryOval, lowTable, chalice, sheet, hanging, vis, pose, fade, attr, lerp, mix, shade, blinkAt, tr, C, PI,
} from './lib.js';

const CUPS = [[650, 'peter'], [590, 'andrew'], [490, 'thaddaeus']];

export default {
  id: 'lk22-serve',
  beats: [
    { v: 27, text: 'Któż bowiem jest większy? Czy ten, kto siedzi za stołem, czy ten, kto służy?' },
    { v: 27, cont: true, text: 'Czyż nie ten, kto siedzi za stołem?' },
    { v: 27, cont: true, text: 'Otóż Ja jestem pośród was jak ten, kto służy.' },
    { v: 28 },
    { v: 29 },
    { v: 30 },
  ],
  cam: { x: [-80, 40], y: [0, 220], z: [1, 1.45] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: NIGHTROOM });
    const { R, at, by, SEAT, TOP } = T0;
    const J = by.jesus;
    // the light above (the Father: light only), on the wall behind
    const lightL = T0.wallFx;
    const above = lightL.add(`<g><circle r="120" fill="url(#halo-glow)"/><g transform="scale(.42)">${radiance(c, 150)}</g></g>`);

    // Jesus standing, girded with the towel, with a jug — in front of the table
    const frontL = S.layer({ par: 0.56, sh: 5 });
    const jS = S.puppet(frontL.add(addToBody(person(c, JESUS_TUNIC), towelWrap(c, 'stand'))));
    const jugEl = frontL.add(`<g>${ewer(c, C.pot)}</g>`);
    const stream = frontL.add(`<g>${waterStream(c, 40).replace(/#bcdfe4/g, mix(C.plumRobe, C.terracotta, 0.4))}</g>`);

    const fx = S.layer({ par: 0.58, sh: 4 });
    // the balance card
    const guest = mini(c, { robe: C.plumRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin2 }, { pose: 'sit', sc: 0.26 });
    const servant = mini(c, { robe: C.stone2, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather }, { sc: 0.26 });
    const panM = (inner) => `${sheet().x(c.ribbon([[0, 0], [-30, 70]], 1.1) + c.ribbon([[0, 0], [30, 70]], 1.1), C.ink, 'opacity=".55"').p(c.cut([[-40, 70], [40, 70], [28, 82], [-28, 82]], 0.3, 5), C.sun).out()}<g transform="translate(0 70)">${inner}</g>`;
    const bal = hanging(fx, `${sheet().p(c.cut(c.rect(-6, 0, 12, 150), 0.3, 6), C.wood2).p(c.cut([[-40, 150], [40, 150], [26, 136], [-26, 136]], 0.3, 5), C.wood2).out()}<g class="beam">${sheet().p(c.cut(c.rect(-120, -5, 240, 10), 0.3, 8), C.wood).p(c.cut(c.circ(0, 0, 9, 12), 0.2, 3), C.sun).out()}</g><g class="pl">${panM(guest)}</g><g class="pr">${panM(`${servant}<g transform="translate(12 -30) scale(.4)">${ewer(c)}</g>`)}</g>`, { x: 0, y: -1500, len: 700 });
    const beam = bal.querySelector('.beam'), pL = bal.querySelector('.pl'), pR = bal.querySelector('.pr');
    // the trials: a sepia picture
    const b = boat(c);
    const trialM = memoryOval(S, `<rect x="-150" y="20" width="300" height="80" fill="${mix(C.lake3, C.parchment, 0.35)}"/><path d="${c.cut([[-150, 30], [-110, 14], [-70, 30], [-30, 12], [10, 30], [50, 12], [90, 30], [150, 12], [150, 100], [-150, 100]], 0.6, 6)}" fill="${mix(C.lakeDeep, C.parchment, 0.3)}"/><g transform="translate(-40 34) scale(.42) rotate(-8)">${b.back}${b.front}</g><path d="${c.ribbon([[60, -80], [44, -40], [62, -36], [40, 4]], 4)}" fill="${C.halo}"/><path d="${c.ribbon(c.qbez([-150, -30], [-60, -60], [40, -90], 10), 10)}" fill="${mix(C.storm, C.parchment, 0.4)}" opacity=".6"/>`, { w: 300, h: 190 });
    const trial = hanging(fx, trialM, { x: 0, y: -1500, len: 700 });
    // the crown of the Kingdom, and one small crown before each
    const bigCrown = fx.add(`<g>${paperCrown(c, 44)}</g>`);
    const others = at.filter((m) => m.k !== 'jesus');
    const small = others.map((m) => ({ m, el: fx.add(`<g>${paperCrown(c, 20)}</g>`) }));
    // the Kingdom: the table, twelve thrones, the tribes
    const KW = 520, KH = 250;
    const kingdomM = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-KW / 2 - 12, -12, KW + 24, KH + 24), 0.6, 8), C.sun);
      s.p(c.cut(c.rect(-KW / 2, 0, KW, KH), 0.5, 8), mix(C.cream, C.halo, 0.45));
      let thr = '';
      for (let i = 0; i < 12; i++) {
        const a = PI * (0.08 + (i / 11) * 0.84), x = -Math.cos(a) * 200, y = 150 - Math.sin(a) * 70;
        thr += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${x < 0 ? 1 : -1} 1)">${smallThrone(c, 0.7)}</g>`;
      }
      let tribes = '';
      const cols = [C.terracotta, C.teal2, C.ochre, C.plumRobe, C.moss, C.dustyBlue, C.clay, C.mauve, C.sageRobe, C.duskViolet, C.wood3, C.roseRobe];
      for (let i = 0; i < 12; i++) {
        const x = -KW / 2 + 26 + i * ((KW - 52) / 11);
        tribes += `<path d="${c.ribbon([[x, KH - 8], [x, KH - 58]], 2)}" fill="${C.wood2}"/><path d="${c.cut([[x, KH - 58], [x + 20, KH - 52], [x, KH - 42]], 0.2, 3)}" fill="${cols[i]}"/>`;
      }
      return `${s.out()}<circle cx="0" cy="110" r="150" fill="url(#halo-glow)" opacity=".7"/>${thr}<g transform="translate(0 150) scale(.7)">${lowTable(c, 160, 40)}</g><g transform="translate(0 120)">${chalice(c, 34, { dark: false })}</g>${tribes}`;
    })();
    const kingdom = hanging(fx, `<path d="M${-KW * 0.35} -1600V-12M${KW * 0.35} -1600V-12" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${kingdomM}`, { x: 0, y: -1500, len: 0 });

    return (t, time) => {
      const T = time;
      T0.idle(t, T, 0.1);
      R.stars.fade(1);

      /* v27a,b — the balance tips to the one at table */
      const bIn = es(t, 0.1, 0.4, ease.out) * (1 - es(t, 1.9, 2.15, ease.in));
      vis(bal, { x: 800, y: 260 - (1 - bIn) * 700, s: 1.4, r: T ? Math.sin(T * 0.7) * 1 : 0, o: bIn > 0.01 ? 1 : 0 });
      const tilt = es(t, 1.1, 1.4, ease.back) * 14 * (1 - es(t, 2.05, 2.4));
      pose(beam, { r: -tilt });
      const dy = Math.sin((tilt * PI) / 180) * 120;
      pose(pL, { x: -Math.cos((tilt * PI) / 180) * 120, y: dy });
      pose(pR, { x: Math.cos((tilt * PI) / 180) * 120, y: -dy });

      /* v27c — He rises and serves them */
      const rise = es(t, 2.05, 2.15);
      const sitBack = es(t, 2.95, 3.05);
      const standK = rise * (1 - sitBack);
      const walkK = [[2.1, 800], [2.35, 700], [2.55, 700], [2.65, 640], [2.8, 640], [2.9, 560]];
      const jx = kf(t, walkK, ease.sine);
      const pour = t > 2.35 && t < 2.9 ? 1 : 0;
      jS.set({ x: jx, y: 760, s: 1.04, flip: false, o: standK, walk: (t > 2.1 && t < 2.35) || (t > 2.55 && t < 2.65) || (t > 2.8 && t < 2.9) ? jx * 0.05 : undefined, armF: 30 + pour * 50, armB: 10, head: 12, blink: blinkAt(T) });
      const [hx, hy] = hand(jx, 760, 1.04, false, 30 + pour * 50);
      vis(jugEl, { x: hx - 6, y: hy + 30, r: pour * 60, o: standK > 0.5 ? 1 : 0 });
      vis(stream, { x: hx + 22, y: hy + 14, o: pour * standK });

      /* v28–29 — the trials; the Kingdom conferred */
      const trK = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 3.95, 4.2, ease.in));
      vis(trial, { x: 800, y: 330 - (1 - trK) * 700, r: T ? Math.sin(T * 0.7) * 1.5 : 0, o: trK > 0.01 ? 1 : 0 });
      const lightK = es(t, 4.05, 4.3) * (1 - es(t, 5.0, 5.3) * 0.6);
      vis(above, { x: 800, y: 300, s: 0.8 + lightK * 0.3, o: lightK });
      const cDown = es(t, 4.15, 4.5);
      const give = es(t, 4.55, 4.9);
      const [jhx, jhy] = hand(800, SEAT, J.s, false, 36 + cDown * 50, 0, 62);
      vis(bigCrown, { x: lerp(800, jhx, cDown), y: lerp(330, jhy - 6, cDown), s: 1, o: cDown > 0.01 ? 1 - give : 0 });
      small.forEach((sm) => {
        const d = Math.abs(sm.m.i - 6);
        const k = es(t, 4.55 + d * 0.03, 4.78 + d * 0.03);
        const [tx] = hand(sm.m.x, SEAT, sm.m.s, sm.m.flip, 60, 0, 62);
        vis(sm.el, { x: lerp(jhx, tx, k), y: lerp(jhy, TOP - 2, k) - Math.sin(k * PI) * 40, o: k > 0.001 ? 1 : 0 });
      });

      /* v30 — the table of the Kingdom, the thrones, the twelve tribes */
      const kIn = es(t, 5.05, 5.45, ease.out);
      vis(kingdom, { x: 800, y: 170 - (1 - kIn) * 800, r: T ? Math.sin(T * 0.6) * 0.8 : 0, o: kIn > 0.01 ? 1 : 0 });

      at.forEach((m) => {
        if (m.k === 'jesus') {
          T0.sit(m, T, { o: 1 - standK, armF: 36 + bump(t, 0.2, 1.8) * 30 + cDown * 50 * (1 - give) + give * 40, armB: 14 + bump(t, 3.1, 3.9) * 40 + lightK * 20, head: -lightK * 10 * (1 - give) - es(t, 5.1, 5.4) * 8 });
          fade(m.sad, 0);
          return;
        }
        const served = CUPS.find(([, k]) => k === m.k);
        const surprise = standK * (served ? 1 : 0.5);
        const got = es(t, 4.6 + Math.abs(m.i - 6) * 0.03, 4.8 + Math.abs(m.i - 6) * 0.03);
        T0.sit(m, T, { armF: 36 + surprise * 20 + got * 20, armB: 14 + surprise * 30, head: -surprise * 8 + trK * 8 - es(t, 5.1, 5.4) * 12 });
        fade(m.sad, trK * 0.5);
      });

      S.cam.x = kf(t, [[-0.3, 0], [2.0, 0], [2.3, -60], [2.9, -70], [3.1, 0]]);
      S.cam.z = kf(t, [[-0.3, 1.02], [1.9, 1.02], [2.2, 1.34], [2.9, 1.34], [3.1, 1.06], [4.0, 1.06], [4.3, 1.3], [4.95, 1.3], [5.2, 1.0]]);
      S.cam.y = kf(t, [[-0.3, 20], [1.9, 20], [2.2, 150], [2.9, 150], [3.1, 30], [4.0, 30], [4.3, 140], [4.95, 140], [5.2, 0]]);
    };
  },
};
