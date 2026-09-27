#!/bin/sh
# Contact sheets of every beat of a chapter (at x.75), for review.
# Usage: tools/review.sh <chapter> <outDir> [lang] [size]
CH=$1; OUT=$2; LANG=${3:-pl}; SIZE=${4:-1440x900}
rm -rf "$OUT"; mkdir -p "$OUT"
node -e "import('./js/chapters/mark$CH/index.js').then(({SCENES})=>console.log(SCENES.flatMap(s=>s.beats.map((b,i)=>s.id+':'+(i+0.75))).join('\n')))" > "$OUT/spots.txt"
xargs node tools/shot.mjs "$OUT" "http://localhost:5178/?ch=$CH&lang=$LANG" --size=$SIZE < "$OUT/spots.txt" | grep -i error
python3 - "$OUT" <<'PY'
import sys, glob, os
from PIL import Image, ImageDraw
S = sys.argv[1]
files = sorted(glob.glob(S + '/*.jpg'), key=os.path.getmtime)
tw, th, cols = 640, 400, 3
for k in range(0, len(files), 9):
    chunk = files[k:k + 9]; rows = (len(chunk) + cols - 1) // cols
    sheet = Image.new('RGB', (tw * cols, th * rows), 'white'); d = ImageDraw.Draw(sheet)
    for i, f in enumerate(chunk):
        sheet.paste(Image.open(f).resize((tw, th)), ((i % cols) * tw, (i // cols) * th))
        d.text(((i % cols) * tw + 6, (i // cols) * th + 4), os.path.basename(f), fill='red')
    sheet.save(f'{S}/sheet-{k // 9:02d}.jpg', quality=78)
print(len(files), 'shots')
PY
