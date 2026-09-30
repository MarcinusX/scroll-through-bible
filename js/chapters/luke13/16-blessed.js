// Łk 13,35 — dusk on the same ridge. "Behold, your house is left to you": far across the valley the glow goes out of
// the Temple, and a grey dusk settles over the city. "I tell you, you will not see me until you say: Blessed is he who
// comes in the name of the Lord!": Jesus turns and sets off down the road towards it, the disciples after Him, and high
// above, in the last warm light, a cloth banner comes down with those words on it and palm branches at its ends —
// the song of the day He will ride in.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { TWELVE } from '../mark3/lib.js';
import { viewSet, VW, still, clothBanner, frond, headAt, kf, moving, SUNSET, NIGHT13, es, ease, bump, seg, tr, PI } from './lib.js';

const GY = VW.GY, JX = 730;

export default {
  id: 'lk13-blessed',
  beats: [
    { v: 35, text: 'Oto dom wasz [tylko] dla was pozostanie.' },
    { v: 35, cont: true, text: 'Albowiem powiadam wam, nie ujrzycie Mnie, aż <nadejdzie czas, gdy> powiecie: Błogosławiony Ten, który przychodzi w imię Pańskie».' },
  ],
  cam: { x: [-20, 60], y: [-30, 20], z: [1, 1.08] },
  build(S) {
    const V = viewSet(S, {
      skyCols: ['#8c7fab', '#dd9c86', '#efc293'], sky2: ['#4b4a7d', '#8d7aa3', '#d49b8b'], sunAt: [1320, 380],
      // the dusk that settles over the city (a soft sheet just over the far city, behind everything nearer)
      overCity: (S2) => {
        const gid = S2.id('dusk');
        S2.defs(`<radialGradient id="${gid}"><stop offset="0" stop-color="#34304f" stop-opacity=".62"/><stop offset=".6" stop-color="#34304f" stop-opacity=".42"/><stop offset="1" stop-color="#34304f" stop-opacity="0"/></radialGradient>`);
        const L = S2.layer({ par: 0.1, sh: 0, flat: true });
        L.add(`<g transform="translate(${VW.CX} ${VW.CY - 50})"><ellipse rx="420" ry="170" fill="url(#${gid})"/></g>`);
        L.fade(0);
        return L;
      },
    });
    const c = S.c;
    const dimL = V.over;

    const disL = S.layer({ par: 0.4, sh: 4 });
    const dis = [0, 1].map((g) => ({ g, sp: disL.sprite(still(c, [0, 1, 2].map((k) => ({ x: -k * 44, y: (k % 2) * 8, s: 0.9, flip: false, armF: 14 + k * 6, armB: 8, head: -2, o: TWELVE[3 + g * 3 + k].o }))), 560 - g * 140, GY - 4) }));
    const jesus = S.puppet(V.act.add(person(c, { ...CAST.jesus })));
    const bGlow = S.layer({ par: 0.18, sh: 0, flat: true });
    const bg = bGlow.add(`<g opacity="0"><ellipse rx="420" ry="120" fill="url(#halo-glow)"/></g>`);
    const bL = S.layer({ par: 0.2, sh: 6 });
    const banner = bL.add(`<g><path d="M-240 -1600V2M240 -1600V2" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${clothBanner(c, tr('Błogosławiony, który przychodzi w imię Pańskie!', 'Blessed is he who comes in the name of the Lord!'), { size: 20, w: 540 })}<g transform="translate(-282 26) rotate(-150)">${frond(c, 90)}</g><g transform="translate(282 26) rotate(-30)">${frond(c, 90)}</g></g>`);

    const JK = [[1.0, JX], [1.1, JX], [1.9, 930]];

    return (t, time) => {
      const T = time;
      V.update(T, { sunY: 380 + es(t, 0, 1.6) * 80 });
      V.sk2.fade(es(t, 0.1, 1.7));

      /* v35a — your house is left to you: the light goes out of the city */
      const dim = es(t, 0.15, 0.7);
      dimL.fade(dim);

      /* v35b — He turns and walks on towards it; the banner comes down */
      const jx = kf(t, JK);
      const walking = moving(t, JK);
      jesus.set({ x: jx, y: GY, s: 1.04 - es(t, 1.1, 1.9) * 0.06, flip: false, walk: walking ? jx * 0.05 : undefined, armF: 20 + bump(t, 0.1, 0.9) * 30 + bump(t, 1.0, 1.4) * 30, armB: 10 + bump(t, 1.0, 1.4) * 80, head: bump(t, 0.2, 0.9) * 10 - es(t, 1.2, 1.4) * 6, blink: blinkAt(T) });
      dis.forEach((d) => {
        const k = es(t, 1.2 + d.g * 0.1, 1.95);
        d.sp.set({ x: 560 - d.g * 140 + k * 200, y: GY - 4 - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 30 + d.g)) * 3 : 0), s: 1 - k * 0.05 });
      });
      const bk = es(t, 1.2, 1.5, ease.out);
      pose(banner, { x: 860, y: lerp(-900, 236, bk) + (T ? Math.sin(T * 0.7) * 2 : 0), r: T ? Math.sin(T * 0.5) * 0.6 : 0 });
      pose(bg, { x: 860, y: 270, o: es(t, 1.4, 1.7) * 0.8 });

      S.cam.x = kf(t, [[0, 10], [1.0, 20], [1.9, 50]]);
      S.cam.y = kf(t, [[0, 0], [1.2, -10], [1.9, -20]]);
      S.cam.z = 1.03;
      void headAt; void seg; void mix; void shade; void sheet; void lerp; void PI; void NIGHT13; void SUNSET;
    };
  },
};
