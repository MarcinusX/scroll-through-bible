#!/usr/bin/env python3
"""Pobiera ewangelię (Biblia Tysiąclecia, biblia.deon.pl) do data/<book>.js.
Użycie: python3 tools/fetch_bt.py mark|john"""
import re, html, json, subprocess, pathlib, sys

BOOKS = {
    # deon.pl chapter page ids, the export name, title, and the site's short name (used in its navigation)
    'mark': dict(ids=[267, 268] + list(range(302, 316)), var='MARK', title='Ewangelia według św. Marka', abbr='Mk',
                 # obvious typos on the source site, corrected: (chapter, verse): (wrong, right)
                 errata={(3, 27): ('Nie nikt nie może', 'Nikt nie może')}),
    'john': dict(ids=list(range(340, 361)), var='JOHN', title='Ewangelia według św. Jana', abbr='J', errata={}),
}
BOOK = sys.argv[1] if len(sys.argv) > 1 else 'mark'
CFG = BOOKS[BOOK]
IDS, ERRATA = CFG['ids'], CFG['errata']
OUT = pathlib.Path(__file__).resolve().parent.parent / 'data' / f'{BOOK}.js'

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
    s = re.sub(r'\s*«« ?(?:Mk|J) ?\d+ ?»».*$', '', s)
    return s

def parse(page):
    body = page.split('<div class="tresc">', 1)[1]
    body = body.split('<div class="chapter-nav">', 1)[0]
    body = re.split(r'<div class="footnote|<a name="P1"', body, 1)[0]
    # split on the verse-number markers (some verses have no <a name="W…"> anchor)
    body = re.sub(r'<a name="W\d+"></a>', '', body)
    tokens = re.split(r'(<div class=(?:tytul\d|miedzytytul\d)>.*?</div>|<span class="werset">\d+&nbsp;</span>)', body, flags=re.S)
    verses, headings, cur, pending, pending_bare = {}, [], None, [], []
    for t in tokens:
        m = re.match(r'<span class="werset">(\d+)&nbsp;</span>', t)
        h = re.match(r'<div class=(tytul\d|miedzytytul\d)>(.*?)</div>', t, re.S)
        if m:
            cur = int(m.group(1)); verses[cur] = ''; pending_bare = []
            for kind, title in pending: headings.append({'before': cur, 'kind': kind, 'title': title})
            pending = []
        elif h:
            title = clean(h.group(2))
            kind = "section" if h.group(1).startswith("miedzy") else "part"
            pending.append((kind, title))
            if cur is not None: pending_bare = pending
        elif cur is not None:
            # right after a heading a verse number is sometimes plain text ("9 A gdy…", Mk 9,9)
            bare = re.match(r'^\s*(?:<br\s*/?>\s*)*(\d+)\s+', t) if pending_bare else None
            if bare and int(bare.group(1)) == cur + 1:
                cur = int(bare.group(1)); verses[cur] = ''
                for kind, title in pending_bare: headings.append({'before': cur, 'kind': kind, 'title': title})
                pending = []
                t = t[bare.end():]
            pending_bare = []
            verses[cur] += t
    # index = verse number - 1; verses this translation omits (e.g. Mk 9,44; 11,26) stay empty
    out = [''] * max(verses)
    for n in verses:
        out[n - 1] = clean(verses[n])
    return {'verses': out, 'headings': headings}

chapters = []
for i, cid in enumerate(IDS, 1):
    ch = parse(fetch(cid))
    for (c, v), (wrong, right) in ERRATA.items():
        if c == i: ch['verses'][v - 1] = ch['verses'][v - 1].replace(wrong, right)
    print(f'{CFG["abbr"]} {i}: {len(ch["verses"])} wersetów, {len(ch["headings"])} nagłówków')
    chapters.append(ch)

OUT.write_text(
    f'// {CFG["title"]} — Biblia Tysiąclecia (wyd. V), źródło: biblia.deon.pl\n'
    f'// Wygenerowane przez tools/fetch_bt.py {BOOK} — nie edytować ręcznie.\n'
    f'export const {CFG["var"]} = ' + json.dumps({'book': CFG['title'], 'translation': 'Biblia Tysiąclecia', 'chapters': chapters}, ensure_ascii=False, indent=1) + ';\n',
    encoding='utf-8')
print('zapisano', OUT)
