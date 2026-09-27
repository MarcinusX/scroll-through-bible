// J 13,16–20 — words at the table, shown on hanging plates. A card of two steps: the master stands on the upper
// step, the servant kneels with the basin below — then the sender above and the one he sends, setting out, below.
// "Blessed are you if you do it": gentle petals of light fall over the table. "Not all of you": the petals pass
// Judas by. "I know whom I have chosen": a little star over each of the Twelve, Judas too. The Scripture: a psalm
// scroll comes down — "he who eats bread with me has lifted his heel against me" — while He and Judas reach into
// the same dish. "That you may believe that I AM": gold on dark, in a glory. And whoever receives the one I send
// receives Me — and the One who sent Me: three plates linked by gold (a messenger, the Master, the light of the Father).
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableSet, EVE, JX, DISH, JESUS, CAST, C, tr, sheet, mix, shade, mini, basinParts, footIcon, loaf, iAm, glory, radiance, hungPlate, lightDrop,
  sparkle, kf, headAt, vis, pose, fade, lerp, blinkAt, PI, FONT,
} from './lib.js';

const MASTER = { robe: C.plumRobe, mantle: C.ochre, belt: C.sun, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2 };
const SERVANT = { robe: C.stone2, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather };
const ENVOY = { robe: C.sageRobe, mantle: C.clayMantle, hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, beard: 'short', skin: C.skin2, belt: C.leather };

/** a card with two steps (origin: top centre); two alternative casts: .a (master / servant), .b (sender / sent) */
function stepsCard(c, w = 400, h = 236) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.6, 8), C.cream).p(c.cut(c.rect(-w / 2 + 6, 6, w - 12, h - 12), 0.4, 8), mix(C.parchment, C.halo, 0.2));
  s.p(c.cut([[-w / 2 + 10, h - 10], [-w / 2 + 10, h - 52], [-4, h - 52], [-4, h - 98], [w / 2 - 10, h - 98], [w / 2 - 10, h - 10]], 0.5, 6), mix(C.stone2, C.clay, 0.25));
  s.x(c.ribbon([[-w / 2 + 12, h - 52], [-4, h - 52]], 2) + c.ribbon([[-4, h - 98], [w / 2 - 12, h - 98]], 2), '#fff', 'opacity=".45"');
  const lab = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="16" font-style="italic" fill="${C.ink}">${t}</text>`;
  const b = basinParts(c, 36);
  const a = `<g class="a"><g transform="translate(${-w / 4 + 6} ${h - 52})">${mini(c, SERVANT, { pose: 'kneel', sc: 0.5 })}</g><g transform="translate(${-w / 4 - 44} ${h - 52})">${b.back}${b.water}${b.front}</g><g transform="translate(${w / 4} ${h - 98}) scale(-1 1)">${mini(c, MASTER, { sc: 0.5 })}</g>${lab(-w / 4, h - 24, tr('sługa', 'servant'))}${lab(w / 4, h - 70, tr('pan', 'lord'))}</g>`;
  const staff = `<path d="${c.ribbon([[22, 2], [30, -110]], 3)}" fill="${C.wood2}"/>`;
  const bb = `<g class="b" opacity="0"><g transform="translate(${-w / 4} ${h - 52})">${mini(c, ENVOY, { sc: 0.5 })}${staff}</g><g transform="translate(${w / 4} ${h - 98}) scale(-1 1)">${mini(c, MASTER, { sc: 0.5 })}</g>${lab(-w / 4, h - 24, tr('wysłannik', 'the one sent'))}${lab(w / 4, h - 70, tr('posyłający', 'the sender'))}</g>`;
  return `<path d="M${-w * 0.35} -1600V0M${w * 0.35} -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}${a}${bb}`;
}
/** the psalm scroll: two lines, a loaf and a lifted heel (origin centre) */
function psalm(c, w = 330, h = 128) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.5, 8), C.parchment);
  s.p(c.cut(c.rect(-w / 2 - 12, -h / 2 - 8, 14, h + 16), 0.3, 5) + c.cut(c.rect(w / 2 - 2, -h / 2 - 8, 14, h + 16), 0.3, 5), C.wood2);
  const t = (y, str, size = 19, col = C.ink) => `<text x="-26" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${col}">${str}</text>`;
  return `<path d="M${-w * 0.3} -1600V${-h / 2}M${w * 0.3} -1600V${-h / 2}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}${t(-26, tr('Ps 41,10', 'Ps 41:9'), 15, C.terracotta)}${t(4, tr('Kto ze Mną spożywa chleb,', 'He who eats bread with me'))}${t(30, tr('podniósł na Mnie piętę', 'has lifted his heel against me'))}<g transform="translate(${w / 2 - 44} -10)">${loaf(c, 14)}</g><g transform="translate(${w / 2 - 44} 30) rotate(-26) scale(1.5)">${footIcon(c, C.skin3)}</g>`;
}

export default {
  id: 'j13-servant',
  beats: [
    { v: 16, text: 'Zaprawdę, zaprawdę, powiadam wam: Sługa nie jest większy od swego pana' },
    { v: 16, cont: true, text: 'ani wysłannik od tego, który go posłał.' },
    { v: 17 },
    { v: 18, text: 'Nie mówię o was wszystkich.' },
    { v: 18, cont: true, text: 'Ja wiem, których wybrałem;' },
    { v: 18, cont: true, text: 'lecz [potrzeba], aby się wypełniło Pismo: Kto ze Mną spożywa chleb, ten podniósł na Mnie swoją piętę.' },
    { v: 19 },
    { v: 20, text: 'Zaprawdę, zaprawdę, powiadam wam: Kto przyjmuje tego, którego Ja poślę, Mnie przyjmuje.' },
    { v: 20, cont: true, text: 'A kto Mnie przyjmuje, przyjmuje Tego, który Mnie posłał».' },
  ],
  cam: { x: [-20, 60], y: [0, 200], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: EVE });
    const { R, at, by, SEAT, TOP } = T0;
    const JU = by.judas;
    S.defs(`<radialGradient id="${S.id('hush')}"><stop offset="0" stop-color="#1d1628" stop-opacity=".5"/><stop offset="1" stop-color="#1d1628" stop-opacity="0"/></radialGradient>`);
    const hush = T0.wallFx.add(`<g><circle r="150" fill="url(#${S.id('hush')})"/></g>`);
    const fx = S.layer({ par: 0.52, sh: 2 });
    const petals = Array.from({ length: 18 }, (_, i) => ({ i, x: 380 + (i / 17) * 840 + c.rr(-20, 20), d: c.rr(0, 0.3), el: fx.add(`<g>${lightDrop(c, 7)}</g>`) }))
      .filter((p) => Math.abs(p.x - JU.x) > 40);
    const stars = at.filter((m) => m.k !== 'jesus').map((m) => ({ m, el: fx.add(`<g>${sparkle(c, 11)}</g>`) }));
    const spot = fx.add(`<g><circle r="70" fill="url(#halo-glow)"/></g>`);
    const hang = S.layer({ par: 0.5, sh: 4 });
    const card = hang.add(`<g>${stepsCard(c)}</g>`);
    const cA = card.querySelector('.a'), cB = card.querySelector('.b');
    const scroll = hang.add(`<g>${psalm(c)}</g>`);
    const iam = hang.add(`<g>${glory(c, 260, 22)}<g>${iAm(c, tr('JA JESTEM', 'I AM'), { size: 40 })}</g></g>`);
    // the chain: a messenger — the Master — the light of the One who sent Him
    const pA = hang.add(`<g>${hungPlate(c, `<g transform="translate(0 40)">${mini(c, ENVOY, { sc: 0.34 })}<path d="${c.ribbon([[16, 2], [22, -70]], 2.4)}" fill="${C.wood2}"/></g>`, { r: 58 })}</g>`);
    const pB = hang.add(`<g>${hungPlate(c, `<g transform="translate(0 42)">${mini(c, { ...JESUS, halo: false }, { sc: 0.36 })}</g>`, { r: 58 })}</g>`);
    const pC = hang.add(`<g>${hungPlate(c, `<circle r="52" fill="url(#halo-glow)"/><g transform="scale(.3)">${radiance(c, 150)}</g>`, { r: 58, face: mix(C.halo, C.cream, 0.4) })}</g>`);
    const link = (w) => hang.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [w / 2, 14], [w, 0], 10), 4)}" fill="${C.haloRim}"/></g>`);
    const l1 = link(74), l2 = link(74);

    return (t, time) => {
      const T = time;
      T0.idle(t, T, 0);
      R.stars.fade(0.6);
      const drop = (k, a, b) => es(k, a, a + 0.35, ease.out) * (1 - es(k, b, b + 0.25, ease.in));

      /* b0–b1 — the steps: master and servant; sender and sent */
      const ck = drop(t, 0.05, 1.85);
      vis(card, { x: JX, y: 250 - (1 - ck) * 700, r: T ? Math.sin(T * 0.7) * 1 : 0, o: ck > 0.01 ? 1 : 0 });
      const sw = es(t, 1.05, 1.3);
      fade(cA, 1 - sw); fade(cB, sw);

      /* b2 — blessed: petals of light; b3 — not all (none on Judas) */
      petals.forEach((p) => {
        const u = seg(t, 2.1 + p.d, 3.3 + p.d);
        const y = lerp(260, SEAT - 90, ease.out(u)), x = p.x + Math.sin(u * PI * 3 + p.i) * 16;
        vis(p.el, { x, y, s: 0.8, r: Math.sin(u * PI * 4 + p.i) * 20, o: u > 0 ? 1 - es(t, 3.8, 4.1) : 0 });
      });
      const notAll = es(t, 3.05, 3.4) * (1 - es(t, 5.9, 6.2));
      pose(hush, { x: JU.x + 10, y: SEAT - 100, s: 0.5 + notAll * 0.7, o: notAll });
      fade(hush, notAll);

      /* b4 — chosen: a star over each of the Twelve */
      stars.forEach(({ m, el }) => {
        const d = Math.abs(m.x - JX) / 62;
        const k = es(t, 4.1 + d * 0.07, 4.3 + d * 0.07, ease.back) * (1 - es(t, 4.95, 5.15));
        const [hx, hy] = headAt(m.x, SEAT, m.s, m.flip, 62);
        vis(el, { x: hx, y: hy - 42, s: k * 0.9, r: t * 60, o: k > 0.01 ? 1 : 0 });
      });

      /* b5 — the Scripture; He and Judas at the one dish */
      const sk = drop(t, 5.05, 5.9);
      vis(scroll, { x: JX, y: 340 - (1 - sk) * 700, r: T ? Math.sin(T * 0.7) * 0.8 : 0, o: sk > 0.01 ? 1 : 0 });
      const dish = bump(t, 5.3, 5.95);
      vis(spot, { x: DISH, y: TOP - 14, s: 0.6 + dish * 0.5, o: dish });

      /* b6 — I AM */
      const ik = es(t, 6.05, 6.4, ease.out) * (1 - es(t, 6.9, 7.1, ease.in));
      vis(iam, { x: JX, y: 330 - (1 - ik) * 60, s: 0.6 + ik * 0.4, o: ik });

      /* b7 — the messenger and the Master; b8 — and the One who sent Him */
      const ak = drop(t, 7.05, 8.95), bk = drop(t, 7.15, 8.95), cc = drop(t, 8.1, 8.95);
      const Y = 340;
      vis(pA, { x: 610, y: Y - (1 - ak) * 700, r: T ? Math.sin(T * 0.8) * 1 : 0, o: ak > 0.01 ? 1 : 0 });
      vis(pB, { x: JX, y: Y - (1 - bk) * 700, r: T ? Math.sin(T * 0.8 + 1) * 1 : 0, o: bk > 0.01 ? 1 : 0 });
      vis(pC, { x: 990, y: Y - (1 - cc) * 700, r: T ? Math.sin(T * 0.8 + 2) * 1 : 0, o: cc > 0.01 ? 1 : 0 });
      const k1 = es(t, 7.45, 7.75), k2 = es(t, 8.45, 8.75);
      vis(l1, { x: 668, y: Y, sx: Math.max(0.02, k1), o: k1 > 0.01 ? 1 : 0 });
      vis(l2, { x: 858, y: Y, sx: Math.max(0.02, k2), o: k2 > 0.01 ? 1 : 0 });

      /* the table */
      const talk = [[0.1, 0.9], [1.1, 1.9], [2.1, 2.9], [3.1, 3.9], [4.1, 4.9], [5.1, 5.9], [6.1, 6.9], [7.1, 7.9], [8.1, 8.9]].reduce((a, [p, q]) => a + bump(t, p, q), 0);
      at.forEach((m) => {
        if (m.k === 'jesus') {
          T0.sit(m, T, { armF: 30 + talk * 22 + dish * 20, armB: 14 + talk * 50, head: -talk * 3 + es(t, 3.1, 3.4) * (1 - es(t, 4, 4.2)) * 8 - ik * 8 });
          return;
        }
        const judas = m.k === 'judas';
        const look = es(t, 2.2, 2.6) * (1 - es(t, 3.7, 4)) * -8 - ik * 10;
        T0.sit(m, T, { head: look + (judas ? notAll * 14 : 0), armF: 36 + (judas ? dish * 26 : 0) });
      });

      S.cam.y = kf(t, [[0, 60], [2.0, 60], [2.4, 110], [3.2, 120], [3.6, 130], [4.2, 130], [5.0, 90], [6, 80], [7, 70], [9, 70]]);
      S.cam.x = kf(t, [[0, 0], [3.0, 0], [3.4, 20], [4.0, 0], [5.2, 10], [6, 0]]);
      S.cam.z = kf(t, [[0, 1.2], [2.0, 1.2], [2.4, 1.15], [3.2, 1.2], [3.6, 1.35], [4.2, 1.2], [5.0, 1.25], [6, 1.25], [7, 1.2], [9, 1.2]]);
    };
  },
};
