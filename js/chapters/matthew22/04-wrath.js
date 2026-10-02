// Mt 22,7 — the palace terrace over the valley. A servant kneels before the king with the news (two white
// cloths in his words); the king's brows draw together, he raises his fist and the sky turns the colour of
// wrath. He points: his troops march out along the valley road, and far off, small on its hill, the city of the
// murderers glows and smokes — told from a distance, nothing closer.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { terraceSet, TERRACE, kingPuppet, SERVANTS, troop, speech, drapeCloth, withFace, faceBits, along, sheet } from './lib.js';

const KY = 716;
const SK = 1.3;

export default {
  id: 'mt22-wrath',
  parable: true,
  beats: [
    { v: 7, text: 'Na to król uniósł się gniewem.' },
    { v: 7, cont: true, text: 'Posłał swe wojska i kazał wytracić owych zabójców, a miasto ich spalić.' },
  ],
  cam: { x: [-20, 70], y: [-20, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const set = terraceSet(S);
    const KX = S.portrait ? 630 : TERRACE.KX;   // phone: the king stands inside the screen

    /* the troops on the road */
    const tr1 = set.troopL.sprite(troop('mt22-troop1', 6, { s: 0.5 }), 800, 600);
    const tr2 = set.troopL.sprite(troop('mt22-troop2', 6, { s: 0.5 }), 800, 600);

    /* the king, the servant with the news */
    const glowL = S.layer({ par: 0.5, sh: 1 });
    const redGlow = glowL.add(`<g opacity="0"><circle r="260" fill="url(#warm-glow)"/></g>`);
    const pl = S.layer({ par: 0.52, sh: 5 });
    const kEl = pl.add(withFace(kingPuppet(c), faceBits(c)));
    const king = S.puppet(kEl);
    const angry = kEl.querySelector('[data-part="angry"]');
    const serv = S.puppet(pl.add(person(c, { ...SERVANTS[1], pose: 'kneel' })));
    const cl = sheet().p(c.cut([[-24, 8], [-20, -4], [-8, -14], [6, -12], [20, -2], [24, 8]], 0.4, 4), C.linen).p(c.cut([[4, 10], [8, -2], [20, -10], [32, -8], [42, 2], [44, 10]], 0.4, 4), C.linen).out();
    const news = pl.add(`<g>${speech(c, `<g transform="translate(-6 4)">${cl}</g>`, { w: 96, h: 58, flip: true })}</g>`);

    set.front();

    return (t, time) => {
      const T = time;
      const wr = es(t, 0.3, 0.75);
      set.wrath.layer.fade(wr);
      const burn = es(t, 1.35, 1.8);
      set.update(t, T, { burn, sunY: 170 + wr * 60 });

      /* v7a — the news; the king's anger */
      const nk = es(t, 0.08, 0.22, ease.back) * (1 - es(t, 0.55, 0.65));
      pose(news, { x: 800, y: KY - 150, s: nk, o: nk > 0.02 ? 1 : 0 });
      serv.set({ x: 790, y: KY + 6, s: 1.14, flip: true, armF: 30 + bump(t, 0.05, 0.6) * 60, head: 8 + es(t, 0.5, 0.7) * 14, lean: es(t, 0.5, 0.7) * 10, blink: blinkAt(T, 3), o: 1 - es(t, 1.2, 1.35) });
      const rage = es(t, 0.35, 0.55);
      const point = es(t, 1.02, 1.2);
      king.set({ x: KX, y: KY, s: SK, blink: blinkAt(T, 1), head: -rage * 8 + point * 4, lean: -rage * 4, armB: rage * 150 * (1 - point * 0.6), armF: 20 + rage * 20 + point * 80 });
      fade(angry, rage);
      pose(redGlow, { x: KX + 10, y: KY - 190, s: 0.7 + rage * 0.4, o: rage * 0.9 });

      /* v7b — the troops march down the valley road; the far city burns */
      [tr1, tr2].forEach((tp, i) => {
        const k = es(t, 1.05 + i * 0.14, 1.75 + i * 0.1, ease.io);
        const [x, y] = along(set.ROAD, 0.22 + k * (S.portrait ? 0.56 : 0.7));   // phone: they stop short of the thread, still on the road to the city
        tp.set({ x: x - i * 30, y: y + 4 + Math.abs(Math.sin(T * 6 + i)) * -2, s: lerp(1, 0.5, k), o: es(t, 1.05 + i * 0.14, 1.12 + i * 0.14) });
      });

      S.cam.x = es(t, 1.0, 1.6) * (S.portrait ? 60 : 30);
      S.cam.z = 1 + es(t, 0.2, 0.7) * 0.04;
    };
  },
};
