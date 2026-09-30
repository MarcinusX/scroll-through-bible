#!/bin/sh
# Pixel comparison of every beat of a chapter between two builds (e.g. the untouched HEAD and the working tree),
# to prove a change left one orientation alone. Serve the other build yourself, e.g.
#   git archive HEAD | tar -x -C /tmp/head && (cd /tmp/head && python3 -m http.server 5191 &)
# Usage: tools/compare.sh [book:]<chapter> <outDir> <urlA> <urlB> [size]     (size default 1440x900; 390x844 for a phone)
# Prints the changed fraction of every beat, largest first; the tag and caption areas are ignored, since they settle at their own pace.
case "$1" in *:*) BOOK=${1%%:*}; CH=${1##*:};; *) BOOK=mark; CH=$1;; esac
OUT=$2; A=$3; B=$4; SIZE=${5:-1440x900}
rm -rf "$OUT"; mkdir -p "$OUT/a" "$OUT/b"
node -e "import('./js/chapters/$BOOK$CH/index.js').then(({SCENES})=>console.log(SCENES.flatMap(s=>s.beats.map((b,i)=>s.id+':'+(i+0.75))).join('\n')))" > "$OUT/spots.txt"
xargs node tools/shot.mjs "$OUT/a" "$A/?book=$BOOK&ch=$CH&lang=pl" --size=$SIZE < "$OUT/spots.txt" | grep -i error
xargs node tools/shot.mjs "$OUT/b" "$B/?book=$BOOK&ch=$CH&lang=pl" --size=$SIZE < "$OUT/spots.txt" | grep -i error
python3 - "$OUT" <<'PY'
import sys
from PIL import Image, ImageChops
O = sys.argv[1]
rows = []
for l in open(O + '/spots.txt'):
    n = l.strip().replace(':', '-') + '.jpg'
    if n == '.jpg': continue
    a, b = Image.open(f'{O}/a/{n}').convert('L'), Image.open(f'{O}/b/{n}').convert('L')
    w, h = a.size
    d = ImageChops.difference(a, b).point(lambda v: 255 if v > 40 else 0)
    d.paste(0, (0, 0, int(w * 0.27), int(h * 0.24)))                 # the hanging tag
    d.paste(0, (int(w * 0.05), int(h * 0.8), int(w * 0.95), h))       # the caption card
    small = d.resize((w // 4, h // 4))
    rows.append((sum(1 for v in small.getdata() if v) / (small.width * small.height), n))
for frac, n in sorted(rows, reverse=True): print(f'{frac * 100:6.2f}%  {n}')
PY
