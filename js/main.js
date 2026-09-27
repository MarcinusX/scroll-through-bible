import { MARK } from '../data/mark.js';
import { startTheatre } from './core/engine.js';
import { makeCutter } from './core/paper.js';
import { SCENES } from './chapters/mark4/index.js';

/* ---------- the box frame: dark board + deckle-edged mat ---------- */
function drawFrame() {
  const svg = document.getElementById('frame');
  const W = innerWidth, H = innerHeight;
  const f = Math.max(10, Math.min(24, W * 0.016));
  const c = makeCutter(7);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const rr = (x, y, w, h, r, n = 6) => {
    const p = [];
    const corner = (cx, cy, a0) => { for (let i = 0; i <= n; i++) { const a = a0 + (i / n) * Math.PI / 2; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    corner(x + w - r, y + r, -Math.PI / 2); corner(x + w - r, y + h - r, 0); corner(x + r, y + h - r, Math.PI / 2); corner(x + r, y + r, Math.PI);
    return p;
  };
  const outer = `M-10 -10H${W + 10}V${H + 10}H-10Z`;
  const r = Math.min(W, H) * 0.035;
  const mat = c.hole(rr(f + 7, f + 7, W - 2 * f - 14, H - 2 * f - 14, r), 1.2, 6);
  const board = c.hole(rr(f, f, W - 2 * f, H - 2 * f, r + 6), 0.8, 10);
  svg.innerHTML = `<path d="${outer}${mat}" fill="#efe3c9"/><path d="${outer}${mat}" class="grain"/><path d="${outer}${board}" fill="#1f3a3c"/><path d="${outer}${board}" class="grain" opacity=".5"/>`;
  document.documentElement.style.setProperty('--frame', f + 7 + 'px');
}
drawFrame();
addEventListener('resize', drawFrame);

// ?only=lamp,measure — render just these scenes (handy while drawing a new one)
const only = new URLSearchParams(location.search).get('only');
const scenes = only ? SCENES.filter((s) => only.split(',').includes(s.id)) : SCENES;
const theatre = startTheatre({ book: MARK, chapter: 4, scenes });
document.getElementById('again').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
window.__theatre = theatre;
