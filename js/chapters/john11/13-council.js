// J 11,47–48 — the chief priests' chamber at dusk (the same room as in Mark). The chief priests and the Pharisees
// come in and take their places round the table under the hanging lamp; the tag "the Council" comes down. "What are
// we doing? This man does many signs": seven little sign-medallions swing into a row above them, and they throw up
// their hands. "If we let Him go on, all will believe in Him": in the window the city's crowd appears and little
// hearts light over it. "And the Romans will come and take away our place and our nation": the shadow of a Roman
// eagle-standard climbs the wall, and a small Temple and a little crowd tremble under it.
import { C, blinkAt } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { councilSet, eagleStandard, peopleIcon, signBadge, templeMini, heart, wordTag, hang2, vis, kf, moving, pose, attr, sheet, shade, mix, lerp, tr, PI } from './lib.js';

export default {
  id: 'j11-council',
  beats: [
    { v: 47, text: 'Wobec tego arcykapłani i faryzeusze zwołali Wysoką Radę i rzekli:' },
    { v: 47, cont: true, text: '«Cóż my robimy wobec tego, że ten człowiek czyni wiele znaków?' },
    { v: 48, text: 'Jeżeli Go tak pozostawimy, to wszyscy uwierzą w Niego,' },
    { v: 48, cont: true, text: 'i przyjdą Rzymianie, i zniszczą nasze miejsce święte i nasz naród».' },
  ],
  cam: { x: [-40, 40], y: [-80, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const K = councilSet(S);
    const { R, FLOOR } = K;
    // the eagle's shadow on the wall
    const eagle = K.fxBack.add(`<g clip-path="url(#${R.clipId})"><g class="e" opacity="0">${eagleStandard(c, '#2a2034', 320)}</g></g>`);
    const eagleIn = eagle.firstElementChild;
    // hearts over the crowd in the window
    const winHearts = [0, 1, 2, 3, 4, 5, 6].map((i) => R.crowd.add(`<g>${heart(c, 11, C.jesusMantle)}</g>`));
    const X = S.layer({ par: 0.6, sh: 6 });
    const tag = X.add(`<g>${hang2(wordTag(c, tr('Wysoka Rada', 'the Council'), { size: 22 }), 0.01, 300)}</g>`);
    const signs = [1, 2, 3, 4, 5, 6, 7].map((n, i) => ({ i, el: X.add(`<g>${hang2(`<g transform="scale(.42)">${signBadge(c, n, { r: 58, icon: n === 1 ? 'jar' : '' })}</g>`, 0.01, 300)}</g>`) }));
    const temple = X.add(`<g>${templeMini(c, 0.9)}</g>`);
    const nation = X.add(`<g>${peopleIcon(c, 9, mix(C.plumRobe, C.ink, 0.3), 110)}</g>`);

    return (t, time) => {
      const T = time;
      R.sky.blend(['#5b5a8c', '#b58a9b', '#e7ae93'], ['#343a6e', '#6d5f8a', '#b88592'], es(t, 0, 4));
      R.stars.fade(es(t, 1, 3.5) * 0.8);
      R.crowd.fade(es(t, 2.0, 2.3));
      K.idle(T, 0.4 + es(t, 0.1, 0.6) * 0.5);

      /* v47a — the council gathers */
      const agit = es(t, 1.1, 1.35) * (1 - es(t, 1.9, 2.1));
      const fear = es(t, 3.2, 3.5);
      K.cast.forEach((m) => {
        const from = m.x < 800 ? m.x - 380 : m.x + 380;
        const KF = [[0.0 + m.i * 0.06, from], [0.6 + m.i * 0.06, m.x]];
        const x = kf(t, KF, ease.out);
        let armF = 12, armB = 6, head = 0;
        if (m.k === 'ph0' || m.k === 'ph1') { armF += agit * 70 + fear * 30; armB += agit * 110; head = -agit * 8 + fear * 6; }
        if (m.k === 'pr1' || m.k === 'pr2') { armF += agit * 50 + bump(t, 2.1, 2.9) * 60; armB += fear * 60; head = -agit * 6 - es(t, 2.1, 2.4) * 10 * (1 - fear); }
        if (m.k === 'hp') { armF += bump(t, 1.1, 1.9) * 30; head = 6 + fear * 4; }
        K.pose(m, { x, walk: moving(t, KF) ? x * 0.1 : undefined, armF, armB, head, blink: blinkAt(T, m.seed) }, fear * 0.15);
      });
      const tk = es(t, 0.35, 0.7, ease.back) * (1 - es(t, 1.0, 1.2));
      vis(tag, { x: 800, y: 250 - (1 - tk) * 420, r: Math.sin(T * 0.8) * 1.5, o: tk > 0.01 ? 1 : 0 });

      /* v47b — many signs */
      signs.forEach((s) => {
        const k = es(t, 1.05 + s.i * 0.07, 1.35 + s.i * 0.07, ease.back) * (1 - es(t, 1.95, 2.2));
        vis(s.el, { x: 800 + (s.i - 3) * 64, y: 250 - (1 - k) * 420 + (s.i % 2) * 14, r: Math.sin(T * 0.9 + s.i) * 3, o: k > 0.01 ? 1 : 0 });
      });

      /* v48a — all will believe: hearts over the crowd in the window */
      winHearts.forEach((h, i) => {
        const k = es(t, 2.2 + i * 0.07, 2.45 + i * 0.07, ease.back) * (1 - es(t, 3.2, 3.5));
        vis(h, { x: 640 + i * 54, y: 500 - (i % 2) * 14 + Math.sin(T * 2 + i) * 3, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v48b — the Romans: the eagle's shadow climbs the wall; the Temple and the nation tremble */
      const ek = es(t, 3.05, 3.55, ease.out);
      pose(eagleIn, { x: 1060, y: lerp(1100, 700, ek), s: 1 + ek * 0.25, o: ek * 0.26 });
      const pk = es(t, 3.2, 3.5, ease.out);
      const shake = Math.sin(T * 16) * 1.6 * es(t, 3.5, 3.7);
      vis(temple, { x: 720 + shake, y: FLOOR - 100 + 2, s: pk, o: pk > 0.01 ? 1 : 0 });
      vis(nation, { x: 880 - shake, y: FLOOR - 100 - 22, s: pk * 0.8, o: pk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 30]]);
      S.cam.y = kf(t, [[0, 10], [1, -50], [2, -10], [3, 0], [4, -10]]);
      S.cam.z = S.portrait ? kf(t, [[0, 1.0], [4, 1.03]]) : kf(t, [[0, 1.0], [1, 1.02], [2, 1.06], [3, 1.08], [4, 1.1]]);
    };
  },
};
