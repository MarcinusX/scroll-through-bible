// Łk 20,45–46 — "In the hearing of all the people He said to His disciples": He turns to Peter and John, and the whole
// court leans in to listen. "Beware of the scribes": a warning tag with a red "!" drops beside Him, and the scribes on
// the right lift their chins. "Who like to walk about in long robes, and love greetings in the marketplaces": a painted
// flat of a market street comes down — a scribe sails through it, his mantle trailing far behind him on the ground, and
// the people at the stall bow low: "Peace, Rabbi!". "The best seats in the synagogues and the places of honour at
// feasts": he settles into the highest of the first chairs, and at the other end of the street a feast is laid, where
// he sits at the head of the table.
import { C, person, blinkAt, pose, lerp, sheet, mix, crowdPerson } from '../kit.js';
import { courtSet, CQ, scribeOpts, panel, panelSky, panelGround, figure, bake, warnTag, robeTrain, firstChairs, stall, plainTable, bubble, popAt, dropIn, makeCutter, kf, tr, es, ease, bump, seg } from './lib.js';
import { bowl, cup, loaf } from '../mark2/lib.js';

const PW = 420, PH = 220, PX = 800, PY = 300, GY = 84;
const SC = scribeOpts(0);

function streetInner(S, c) {
  let m = panelSky(S, PW, PH, ['#d4dfd8', '#f2e4c6']);
  const s = sheet();
  let hs = '', wins = '';
  for (let x = -PW / 2 - 10; x < PW / 2; x += 78) { const h = 80 + ((x * 13) % 50 + 50) % 50; hs += c.cut(c.rect(x, 50 - h, 72, h + 40), 0.4, 6); wins += c.cut(c.rect(x + 28, 60 - h, 14, 18), 0.2, 3); }
  s.p(hs, mix(C.plaster2, C.sand, 0.3)).x(wins, mix(C.soilDark, C.plaster2, 0.5));
  m += s.out() + panelGround(c, PW, GY - 6, mix(C.sand, C.stone, 0.45), 2);
  m += `<g transform="translate(-150 ${GY}) scale(.62)">${stall(c, 150)}</g>`;
  const k = makeCutter('lk20-bowers');
  m += figure(c, { ...crowdPerson(k), hairStyle: 'veil', beard: 'none' }, { x: -118, y: GY + 4, s: 0.44, flip: true, lean: -24, head: 20, armF: 50 });
  m += figure(c, { ...crowdPerson(k), hairStyle: 'short', beard: 'full' }, { x: -64, y: GY + 6, s: 0.46, flip: true, lean: -26, head: 22, armF: 60 });
  return m;
}

export default {
  id: 'lk20-beware',
  beats: [
    { v: 45 },
    { v: 46, text: '«Strzeżcie się uczonych w Piśmie,' },
    { v: 46, cont: true, text: 'którzy z upodobaniem chodzą w powłóczystych szatach, lubią pozdrowienia na rynku,' },
    { v: 46, cont: true, text: 'pierwsze krzesła w synagogach i zaszczytne miejsca na ucztach.' },
  ],
  cam: { x: [-60, 40], y: [-80, 30], z: [1, 1.1] },
  build(S) {
    const Q = courtSet(S, { opp: [scribeOpts(0), scribeOpts(1), scribeOpts(2)] });
    const c = Q.c;
    const tag = Q.flyL.add(`<g><path d="M0 -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${warnTag(c)}</g>`);
    const pan = Q.flyL.add(panel(S, streetInner(S, c), { w: PW, h: PH, word: tr('uczeni w Piśmie', 'the scribes') }));
    const walker = S.puppet(Q.flyL.add(person(c, { ...SC, holdF: '' }).replace('<g class="body">', `<g class="body">${robeTrain(c, 150, SC.mantle || SC.robe)}`)));
    const peace = Q.flyL.add(`<g opacity="0">${bubble(c, tr('Pokój, Rabbi!', 'Peace, Rabbi!'), { size: 15, tail: -1 })}</g>`);
    const chairs = Q.flyL.add(`<g>${firstChairs(c)}</g>`);
    const seated = Q.flyL.add(`<g>${bake(person(c, { ...SC, holdF: '', pose: 'sit' }), { s: 0.5, head: -10, armF: 30, lean: -4 })}</g>`);
    const feast = Q.flyL.add(`<g>${plainTable(c, 150, 44)}<g transform="translate(-40 -44)">${bowl(c, { w: 26 })}</g><g transform="translate(10 -44)">${cup(c)}</g><g transform="translate(46 -44)">${loaf(c)}</g>${bake(person(c, { ...SC, holdF: '', pose: 'sit' }), { x: -96, y: -4, s: 0.5, armF: 70, head: -12 })}${bake(person(c, { ...crowdPerson(makeCutter('lk20-g1')), pose: 'sit', hairStyle: 'short', beard: 'full' }), { x: 96, y: -2, s: 0.46, flip: true, armF: 50 })}</g>`);

    return (t, time) => {
      const T = time;
      /* v45 — to the disciples, in the hearing of all */
      const turn = es(t, 0.1, 0.25);
      /* v46a — beware */
      dropIn(tag, t, 1.05, 2.2, CQ.JX - 150, 320, { T, d: 0.25 });
      const preen = es(t, 1.3, 1.5);
      /* v46b — the long robes, the greetings */
      const pk = dropIn(pan, t, 2.0, undefined, PX, PY, { d: 0.25 });
      const py = lerp(-1500, PY, pk), on = pk > 0.002 ? 1 : 0;
      const w = es(t, 2.2, 2.75);
      const wx = lerp(PX - 190, PX + 10, w);
      const sitK = seg(t, 3.12, 3.16);
      walker.set({ x: wx, y: py + GY + 4, s: 0.5, walk: w > 0 && w < 1 ? wx * 0.08 : undefined, head: -12, lean: -4, armF: 20, armB: 30, o: on * (1 - sitK), blink: blinkAt(T, 3) });
      popAt(peace, t, 2.45, 3.1, PX - 90, py + GY - 90, { d: 0.08 });
      /* v46c — the first chairs; the place of honour at the feast */
      const ck = es(t, 3.02, 3.15, ease.back);
      pose(chairs, { x: PX - 20, y: py + GY + 2, s: 0.62 * Math.max(0.001, ck), o: ck > 0.01 && on ? 1 : 0 });
      pose(seated, { x: PX - 20 + 70 * 0.62, y: py + GY + 2 - 58 * 0.62 + 30, o: sitK * on });
      const fk = es(t, 3.35, 3.5, ease.back);
      pose(feast, { x: PX + 120, y: py + GY + 2, s: 0.9 * Math.max(0.001, fk), o: fk > 0.01 && on ? 1 : 0 });
      Q.pose(t, T,
        { flip: turn > 0.5, armF: 16 + es(t, 0.2, 0.4) * 50, armB: 8 + es(t, 1.1, 1.3) * 60 * (1 - es(t, 2.0, 2.2)), head: -es(t, 2.0, 2.3) * 8, blink: blinkAt(T, 2) },
        (d) => ({ x: d.x + turn * 20, head: 2 - es(t, 2.0, 2.3) * 10, blink: blinkAt(T, d.seed) }),
        (m) => ({ head: -preen * 12, lean: -preen * 4, armB: 4 + preen * 30, blink: blinkAt(T, m.seed) }));
      Q.amaze(es(t, 0.2, 0.4) * 0.8 * (1 - es(t, 2.0, 2.3) * 0.5));
      void mix;

      S.cam.x = kf(t, [[0, -30], [1.0, -30], [2.0, 0]]);
      S.cam.y = kf(t, [[0, 10], [1.0, -10], [2.2, -50]]);
      S.cam.z = kf(t, [[0, 1.08], [1.0, 1.06], [2.2, 1.02]]);
    };
  },
};
