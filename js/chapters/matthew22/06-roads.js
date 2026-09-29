// Mt 22,10 — the crossroads, a painted flat, the palace small on its hill. The servants stand by the signpost
// and beckon, and they come from every road: a lame beggar on his crutch, a blind man with his stick, a mother
// with her baby, a tax man, an old woman, a shepherd lad — and some hard, hooded faces too, bad and good. They
// all go up the road to the palace; evening falls, and its windows fill with light and with guests.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { crossSet, CROSS, SERVANTS, ROADFOLK, heldInvite, crutchHeld, stickHeld, babyHeld, baked, along, kf } from './lib.js';
import { makeCutter } from '../../core/paper.js';

const UP = [[770, 640], [716, 590], [650, 530], [568, 468]];      // the road up to the palace gate
// home spots at the crossroads, and where each one comes from
const FOLK = [
  { home: [1040, 708], from: [1500, 690], hold: 'crutch', armF: 20 },
  { home: [930, 734], from: [1000, 1000], hold: 'stick', armF: 30 },
  { home: [626, 714], from: [-200, 700], hold: 'baby', armF: 70 },
  { home: [1116, 724], from: [1560, 730], flip: true },
  { home: [528, 728], from: [-260, 734] },
  { home: [836, 748], from: [900, 1060] },
  { home: [706, 738], from: [-320, 744], armF: 40 },
  { home: [990, 748], from: [1620, 760], flip: true },
];

export default {
  id: 'mt22-roads',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 10, text: 'Słudzy ci wyszli na drogi i sprowadzili wszystkich, których napotkali: złych i dobrych.' },
    { v: 10, cont: true, text: 'I sala zapełniła się biesiadnikami.' },
  ],
  cam: { x: [-60, 20], y: [-20, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = crossSet(S);

    const pl = S.layer({ par: 0.42, sh: 5 });
    const folk = FOLK.map((f, i) => {
      const cc = makeCutter('mt22-folk' + i);
      const holdF = f.hold === 'crutch' ? crutchHeld(cc) : f.hold === 'stick' ? stickHeld(cc) : f.hold === 'baby' ? babyHeld(cc) : '';
      const flipped = f.from[0] > f.home[0] + 100;
      const m = baked(cc, [{ x: 0, y: 0, s: 0.92, flip: flipped, o: { ...ROADFOLK[i], holdF }, armF: f.armF || 10, head: i === 3 || i === 7 ? 6 : -2 }]);
      return { ...f, i, sp: pl.sprite(m, f.home[0], f.home[1]), d: i * 0.045 };
    });
    const serv = [0, 1].map((i) => ({ i, p: S.puppet(pl.add(person(c, { ...SERVANTS[i + 1], holdF: heldInvite(c) }))), x: [770, 880][i], y: [700, 690][i] }));

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);
      const eve = es(t, 1.2, 1.8);
      set.eve.layer.fade(eve * 0.85);
      pose(set.lights, { x: CROSS.PAL[0], y: CROSS.PAL[1] + 16, o: es(t, 1.45, 1.85) });

      /* v10a — they come from every road to the crossroads */
      folk.forEach((f) => {
        const k = es(t, 0.05 + f.d, 0.5 + f.d, ease.out);
        let x = lerp(f.from[0], f.home[0], k), y = lerp(f.from[1], f.home[1], k), s = 1;
        const walking = k > 0 && k < 1;
        // v10b — up the road to the palace
        const u = es(t, 1.02 + f.d * 0.8, 1.62 + f.d * 0.8, ease.io);
        if (u > 0) {
          const [ux, uy] = along([[f.home[0], f.home[1]], ...UP], u);
          x = ux; y = uy; s = lerp(1, 0.34, Math.pow(u, 0.8));
        }
        const bob = walking || (u > 0 && u < 1) ? -Math.abs(Math.sin(T * 7 + f.i)) * 3 : 0;
        f.sp.set({ x, y: y + bob, s, o: k > 0.01 ? 1 - es(t, 1.55 + f.d * 0.8, 1.64 + f.d * 0.8) : 0 });
      });
      serv.forEach((s) => {
        const beck = es(t, 0.35, 0.5) * (1 - es(t, 0.95, 1.05));
        const u = es(t, 1.0 + s.i * 0.05, 1.6 + s.i * 0.05, ease.io);
        const [ux, uy] = u > 0 ? along([[s.x, s.y], ...UP], u) : [s.x, s.y];
        s.p.set({ x: ux, y: uy, s: 0.96 * lerp(1, 0.34, Math.pow(u, 0.8)), flip: s.i === 1 ? u > 0 || t < 0.3 : u > 0, walk: u > 0 && u < 1 ? ux * 0.06 + s.i : undefined, armF: 30 + beck * 60, armB: beck * 100 * (s.i ? 1 : 0.4) + bump(t, 0.3, 0.8) * 30, head: -beck * 4, blink: blinkAt(T, s.i + 3), o: 1 - es(t, 1.55 + s.i * 0.05, 1.62 + s.i * 0.05) });
      });

      S.cam.x = -es(t, 1.0, 1.6) * 40;
      S.cam.y = 10 - es(t, 1.0, 1.6) * 20;
      S.cam.z = 1.04 + es(t, 1.0, 1.6) * 0.06;
    };
  },
};
