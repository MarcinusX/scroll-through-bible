#!/usr/bin/env python3
"""Pobiera Ewangelię wg św. Marka (Biblia Tysiąclecia, biblia.deon.pl) do data/mark.js."""
import re, html, json, subprocess, pathlib

IDS = [267, 268] + list(range(302, 316))  # Mk 1..16
OUT = pathlib.Path(__file__).resolve().parent.parent / 'data' / 'mark.js'

def fetch(cid):
    url = f'https://biblia.deon.pl/rozdzial.php?id={cid}'
    raw = subprocess.run(['curl', '-sL', url], capture_output=True, check=True).stdout
    return raw.decode('iso-8859-2')

def clean(s):
    s = re.sub(r'<sup>.*?</sup>', '', s, flags=re.S)
    s = re.sub(r'<br\s*/?>', ' ', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s).replace('\xa0', ' ')
    s = re.sub(r'\s+', ' ', s).strip()
    s = re.sub(r'\s+([,.;:!?»])', r'\1', s)
    s = re.sub(r'\s*«« ?Mk ?\d+ ?»».*$', '', s)
    return s

def parse(page):
    body = page.split('<div class="tresc">', 1)[1]
    body = body.split('<div class="chapter-nav">', 1)[0]
    body = re.split(r'<div class="footnote|<a name="P1"', body, 1)[0]
    tokens = re.split(r'(<div class=(?:tytul\d|miedzytytul\d)>.*?</div>|<a name="W\d+"></a>)', body, flags=re.S)
    verses, headings, cur, pending = {}, [], None, []
    for t in tokens:
        m = re.match(r'<a name="W(\d+)"></a>', t)
        h = re.match(r'<div class=(tytul\d|miedzytytul\d)>(.*?)</div>', t, re.S)
        if m:
            cur = int(m.group(1)); verses[cur] = ''
            for kind, title in pending: headings.append({'before': cur, 'kind': kind, 'title': title})
            pending = []
        elif h:
            title = clean(h.group(2))
            kind = "section" if h.group(1).startswith("miedzy") else "part"
            pending.append((kind, title))
        elif cur is not None:
            verses[cur] += t
    out = []
    for n in sorted(verses):
        txt = re.sub(r'^<span class="werset">\d+&nbsp;</span>', '', verses[n].strip())
        out.append(clean(txt))
    return {'verses': out, 'headings': headings}

chapters = []
for i, cid in enumerate(IDS, 1):
    ch = parse(fetch(cid))
    print(f'Mk {i}: {len(ch["verses"])} wersetów, {len(ch["headings"])} nagłówków')
    chapters.append(ch)

OUT.write_text(
    '// Ewangelia wg św. Marka — Biblia Tysiąclecia (wyd. V), źródło: biblia.deon.pl\n'
    '// Wygenerowane przez tools/fetch_mark.py — nie edytować ręcznie.\n'
    'export const MARK = ' + json.dumps({'book': 'Ewangelia według św. Marka', 'translation': 'Biblia Tysiąclecia', 'chapters': chapters}, ensure_ascii=False, indent=1) + ';\n',
    encoding='utf-8')
print('zapisano', OUT)
