#!/usr/bin/env python3
"""Downloads the Gospel of Mark, World English Bible (public domain), into data/mark-en.js."""
import html, json, pathlib, re, subprocess

OUT = pathlib.Path(__file__).resolve().parent.parent / 'data' / 'mark-en.js'

# Section headings, mirroring the Biblia Tysiąclecia structure so both languages share the same scenes.
HEADINGS = {
    1: [
        {'before': 1, 'kind': 'part', 'title': 'PREPARING FOR THE MINISTRY OF JESUS'},
        {'before': 1, 'kind': 'section', 'title': 'John the Baptist'},
        {'before': 9, 'kind': 'section', 'title': 'The Baptism of Jesus'},
        {'before': 12, 'kind': 'section', 'title': 'The Temptation of Jesus'},
        {'before': 14, 'kind': 'part', 'title': 'THE MINISTRY OF JESUS IN GALILEE'},
        {'before': 14, 'kind': 'part', 'title': 'THE BEGINNING OF THE MINISTRY'},
        {'before': 14, 'kind': 'section', 'title': 'The First Proclamation'},
        {'before': 16, 'kind': 'section', 'title': 'The Call of the First Disciples'},
        {'before': 21, 'kind': 'section', 'title': 'Teaching in Capernaum'},
        {'before': 23, 'kind': 'section', 'title': 'A Man Set Free'},
        {'before': 29, 'kind': 'section', 'title': 'In Peter’s House'},
        {'before': 32, 'kind': 'section', 'title': 'Many Healings'},
        {'before': 35, 'kind': 'section', 'title': 'Around Capernaum'},
        {'before': 40, 'kind': 'section', 'title': 'The Healing of a Leper'},
    ],
    2: [
        {'before': 1, 'kind': 'part', 'title': 'FIRST DISPUTES WITH THE LEADERS'},
        {'before': 1, 'kind': 'section', 'title': 'The Healing of a Paralytic'},
        {'before': 13, 'kind': 'section', 'title': 'The Call of Levi'},
        {'before': 18, 'kind': 'section', 'title': 'The Question of Fasting'},
        {'before': 23, 'kind': 'section', 'title': 'Grain Picked on the Sabbath'},
    ],
    3: [
        {'before': 1, 'kind': 'section', 'title': 'Healing on the Sabbath'},
        {'before': 7, 'kind': 'part', 'title': 'JESUS, WORKER OF WONDERS AND TEACHER'},
        {'before': 7, 'kind': 'section', 'title': 'The Crowds Flock to Him'},
        {'before': 13, 'kind': 'section', 'title': 'The Choosing of the Twelve'},
        {'before': 20, 'kind': 'section', 'title': 'The Crowd Presses In'},
        {'before': 22, 'kind': 'section', 'title': 'The Scribes’ Slander'},
        {'before': 31, 'kind': 'section', 'title': 'The True Family of Jesus'},
    ],
    4: [
        {'before': 1, 'kind': 'part', 'title': 'TEACHING IN PARABLES'},
        {'before': 1, 'kind': 'section', 'title': 'The Parable of the Sower'},
        {'before': 10, 'kind': 'section', 'title': 'The Purpose of the Parables'},
        {'before': 14, 'kind': 'section', 'title': 'The Sower Explained'},
        {'before': 21, 'kind': 'section', 'title': 'The Parable of the Lamp'},
        {'before': 24, 'kind': 'section', 'title': 'The Parable of the Measure'},
        {'before': 26, 'kind': 'section', 'title': 'The Growing Seed'},
        {'before': 30, 'kind': 'section', 'title': 'The Mustard Seed'},
        {'before': 33, 'kind': 'section', 'title': 'The End of the Parables'},
        {'before': 35, 'kind': 'part', 'title': 'PREPARING THE DISCIPLES'},
        {'before': 35, 'kind': 'section', 'title': 'The Storm on the Lake'},
    ],
    5: [
        {'before': 1, 'kind': 'section', 'title': 'A Man Freed from Demons'},
        {'before': 21, 'kind': 'section', 'title': 'The Woman with a Haemorrhage'},
        {'before': 35, 'kind': 'section', 'title': 'The Daughter of Jairus'},
    ],
    6: [
        {'before': 1, 'kind': 'section', 'title': 'Jesus in Nazareth'},
        {'before': 7, 'kind': 'section', 'title': 'The Sending of the Twelve'},
        {'before': 14, 'kind': 'section', 'title': 'Herod’s Verdict on Jesus'},
        {'before': 17, 'kind': 'section', 'title': 'The Death of John the Baptist'},
        {'before': 30, 'kind': 'section', 'title': 'The Apostles Return. The First Multiplication of Loaves'},
        {'before': 45, 'kind': 'section', 'title': 'Jesus Walks on the Lake'},
        {'before': 53, 'kind': 'section', 'title': 'Healings in Gennesaret'},
    ],
    7: [
        {'before': 1, 'kind': 'section', 'title': 'The Dispute about Tradition'},
        {'before': 14, 'kind': 'section', 'title': 'True Uncleanness'},
        {'before': 24, 'kind': 'part', 'title': 'THE MINISTRY OF JESUS BEYOND GALILEE'},
        {'before': 24, 'kind': 'part', 'title': 'BEFORE THE JOURNEY TO JERUSALEM'},
        {'before': 24, 'kind': 'section', 'title': 'The Faith of the Syrophoenician Woman'},
        {'before': 31, 'kind': 'section', 'title': 'The Healing of a Deaf Man'},
    ],
    8: [
        {'before': 1, 'kind': 'section', 'title': 'The Second Multiplication of Loaves'},
        {'before': 10, 'kind': 'section', 'title': 'Another Demand for a Sign'},
        {'before': 14, 'kind': 'section', 'title': 'The Leaven of the Pharisees'},
        {'before': 22, 'kind': 'section', 'title': 'The Healing of a Blind Man'},
        {'before': 27, 'kind': 'section', 'title': 'Peter’s Confession'},
        {'before': 31, 'kind': 'section', 'title': 'The First Prediction of the Passion and Resurrection'},
        {'before': 34, 'kind': 'section', 'title': 'The Conditions of Following Jesus'},
    ],
    9: [
        {'before': 2, 'kind': 'section', 'title': 'The Transfiguration'},
        {'before': 9, 'kind': 'section', 'title': 'The Coming of Elijah'},
        {'before': 14, 'kind': 'section', 'title': 'The Healing of a Boy with Epilepsy'},
        {'before': 30, 'kind': 'section', 'title': 'The Second Prediction of the Passion and Resurrection'},
        {'before': 33, 'kind': 'section', 'title': 'Who Is the Greatest'},
        {'before': 38, 'kind': 'section', 'title': 'In the Name of Jesus'},
        {'before': 42, 'kind': 'section', 'title': 'Causing Others to Stumble'},
    ],
    10: [
        {'before': 1, 'kind': 'part', 'title': 'THE JOURNEY TO JERUSALEM'},
        {'before': 1, 'kind': 'section', 'title': 'Marriage and Divorce'},
        {'before': 13, 'kind': 'section', 'title': 'Jesus Blesses the Children'},
        {'before': 17, 'kind': 'section', 'title': 'The Rich Young Man'},
        {'before': 23, 'kind': 'section', 'title': 'The Danger of Riches'},
        {'before': 28, 'kind': 'section', 'title': 'The Reward of Leaving Everything'},
        {'before': 32, 'kind': 'section', 'title': 'The Third Prediction of the Passion and Resurrection'},
        {'before': 35, 'kind': 'section', 'title': 'The Sons of Zebedee'},
        {'before': 41, 'kind': 'section', 'title': 'Leadership as Service'},
        {'before': 46, 'kind': 'section', 'title': 'The Blind Man at Jericho'},
    ],
    11: [
        {'before': 1, 'kind': 'part', 'title': 'THE MINISTRY OF JESUS IN JERUSALEM'},
        {'before': 1, 'kind': 'part', 'title': 'TEACHING AND DISPUTES WITH OPPONENTS'},
        {'before': 1, 'kind': 'section', 'title': 'The Triumphal Entry into Jerusalem'},
        {'before': 12, 'kind': 'section', 'title': 'The Barren Fig Tree'},
        {'before': 15, 'kind': 'section', 'title': 'The Cleansing of the Temple'},
        {'before': 20, 'kind': 'section', 'title': 'Faith and Prayer'},
        {'before': 27, 'kind': 'section', 'title': 'The Question of Authority'},
    ],
    12: [
        {'before': 1, 'kind': 'section', 'title': 'The Parable of the Wicked Tenants'},
        {'before': 13, 'kind': 'section', 'title': 'The Question of Taxes'},
        {'before': 18, 'kind': 'section', 'title': 'The Question of the Resurrection'},
        {'before': 28, 'kind': 'section', 'title': 'The Greatest Commandment'},
        {'before': 35, 'kind': 'section', 'title': 'The Messiah, Son of God'},
        {'before': 38, 'kind': 'section', 'title': 'A Warning against the Scribes'},
        {'before': 41, 'kind': 'section', 'title': 'The Widow’s Mite'},
    ],
    13: [
        {'before': 1, 'kind': 'part', 'title': 'THE DISCOURSE ON THE END OF JERUSALEM AND THE COMING OF CHRIST'},
        {'before': 1, 'kind': 'section', 'title': 'The Destruction of the Temple'},
        {'before': 5, 'kind': 'section', 'title': 'The Beginning of Sorrows'},
        {'before': 9, 'kind': 'section', 'title': 'The Persecution of the Disciples'},
        {'before': 14, 'kind': 'section', 'title': 'Signs of the Fall of Jerusalem'},
        {'before': 24, 'kind': 'section', 'title': 'The Coming of Christ'},
        {'before': 28, 'kind': 'section', 'title': 'The Lesson of the Fig Tree'},
        {'before': 33, 'kind': 'section', 'title': 'The Need to Keep Watch'},
    ],
    14: [
        {'before': 1, 'kind': 'part', 'title': 'THE PASSION AND RESURRECTION OF JESUS CHRIST'},
        {'before': 1, 'kind': 'section', 'title': 'The Plot against Jesus'},
        {'before': 3, 'kind': 'section', 'title': 'The Anointing at Bethany'},
        {'before': 10, 'kind': 'section', 'title': 'The Betrayal of Judas'},
        {'before': 12, 'kind': 'part', 'title': 'THE LAST SUPPER'},
        {'before': 12, 'kind': 'section', 'title': 'Preparing the Passover'},
        {'before': 17, 'kind': 'section', 'title': 'The Betrayal Foretold'},
        {'before': 22, 'kind': 'section', 'title': 'The Institution of the Eucharist'},
        {'before': 26, 'kind': 'part', 'title': 'JESUS IN GETHSEMANE'},
        {'before': 26, 'kind': 'section', 'title': 'Peter’s Denial Foretold'},
        {'before': 32, 'kind': 'section', 'title': 'Prayer and Agony'},
        {'before': 43, 'kind': 'section', 'title': 'The Arrest of Jesus'},
        {'before': 53, 'kind': 'part', 'title': 'JESUS BEFORE HIS JUDGES'},
        {'before': 53, 'kind': 'section', 'title': 'Before the Council'},
        {'before': 66, 'kind': 'section', 'title': 'Peter’s Denial'},
    ],
    15: [
        {'before': 1, 'kind': 'section', 'title': 'Jesus before Pilate'},
        {'before': 6, 'kind': 'section', 'title': 'Jesus Rejected by His People'},
        {'before': 16, 'kind': 'section', 'title': 'The King Mocked'},
        {'before': 21, 'kind': 'part', 'title': 'JESUS ON GOLGOTHA'},
        {'before': 21, 'kind': 'section', 'title': 'The Way of the Cross'},
        {'before': 23, 'kind': 'section', 'title': 'The Crucifixion'},
        {'before': 29, 'kind': 'section', 'title': 'Mocked on the Cross'},
        {'before': 33, 'kind': 'section', 'title': 'The Death of Jesus'},
        {'before': 38, 'kind': 'section', 'title': 'After the Death of Jesus'},
        {'before': 42, 'kind': 'section', 'title': 'The Burial of Jesus'},
    ],
    16: [
        {'before': 1, 'kind': 'part', 'title': 'THE RESURRECTION OF JESUS CHRIST'},
        {'before': 1, 'kind': 'section', 'title': 'The Empty Tomb'},
        {'before': 9, 'kind': 'section', 'title': 'Jesus Appears to His Own'},
        {'before': 15, 'kind': 'section', 'title': 'The Final Command'},
        {'before': 19, 'kind': 'section', 'title': 'The Ascension'},
    ],
}

def clean(s):
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s).replace('\xa0', ' ')
    return re.sub(r'\s+', ' ', s).strip()

chapters = []
for ch in range(1, 17):
    raw = subprocess.run(['curl', '-sL', f'https://bolls.life/get-text/WEB/41/{ch}/'], capture_output=True, check=True).stdout
    verses = [clean(v['text']) for v in sorted(json.loads(raw), key=lambda v: v['verse'])]
    print(f'Mark {ch}: {len(verses)} verses')
    chapters.append({'verses': verses, 'headings': HEADINGS.get(ch, [])})

OUT.write_text(
    '// The Gospel according to Mark — World English Bible (public domain), via bolls.life\n'
    '// Generated by tools/fetch_mark_en.py — do not edit by hand.\n'
    'export const MARK_EN = ' + json.dumps({'book': 'The Gospel according to Mark', 'translation': 'World English Bible', 'chapters': chapters}, ensure_ascii=False, indent=1) + ';\n',
    encoding='utf-8')
print('wrote', OUT)
