#!/bin/sh
# Contact sheets of every beat of a chapter (at x.75), for review.
# Usage: [PORT=5178] tools/review.sh [book:]<chapter> <outDir> [lang] [size]     e.g. tools/review.sh john:3 /tmp/j3
# Phone: tools/review.sh john:3 /tmp/j3p pl 390x844   (portrait sheets, 8 shots each; see docs/PHONE-REVIEW.md)
case "$1" in *:*) BOOK=${1%%:*}; CH=${1##*:};; *) BOOK=mark; CH=$1;; esac
OUT=$2; LANG=${3:-pl}; SIZE=${4:-1440x900}
rm -rf "$OUT"; mkdir -p "$OUT"
node -e "import('./js/chapters/$BOOK$CH/index.js').then(({SCENES})=>console.log(SCENES.flatMap(s=>s.beats.map((b,i)=>s.id+':'+(i+0.75))).join('\n')))" > "$OUT/spots.txt"
xargs node tools/shot.mjs "$OUT" "http://localhost:${PORT:-5178}/?book=$BOOK&ch=$CH&lang=$LANG" --size=$SIZE < "$OUT/spots.txt" | grep -i error
python3 - "$OUT" <<'PY'
import sys, glob, os
from PIL import Image, ImageDraw
S = sys.argv[1]
files = sorted(glob.glob(S + '/*.jpg'), key=os.path.getmtime)
w0, h0 = Image.open(files[0]).size if files else (1440, 900)
# landscape shots: 3 x 3 per sheet; phone (portrait) shots: 4 x 2, tall tiles
tw, th, cols, per = (640, 400, 3, 9) if w0 > h0 else (360, 780, 4, 8)
for k in range(0, len(files), per):
    chunk = files[k:k + per]; rows = (len(chunk) + cols - 1) // cols
    sheet = Image.new('RGB', (tw * cols, th * rows), 'white'); d = ImageDraw.Draw(sheet)
    for i, f in enumerate(chunk):
        sheet.paste(Image.open(f).resize((tw, th)), ((i % cols) * tw, (i // cols) * th))
        d.text(((i % cols) * tw + 6, (i // cols) * th + 4), os.path.basename(f), fill='red')
    sheet.save(f'{S}/sheet-{k // per:02d}.jpg', quality=78)
print(len(files), 'shots')
PY
