#!/usr/bin/env python3
"""Downloads a Gospel from the World English Bible (public domain) into data/<book>-en.js.
Usage: python3 tools/fetch_web.py matthew|mark|john"""
import html, json, pathlib, re, subprocess, sys


# Section headings, mirroring the Biblia Tysiąclecia structure so both languages share the same scenes.
MARK_HEADINGS = {
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


def _h(items):
    return [{'before': b, 'kind': 'part' if k == 'p' else 'section', 'title': t} for b, k, t in items]

# Section headings mirroring the Biblia Tysiąclecia structure, in English.
JOHN_HEADINGS = {
    1: _h([(1, 'p', 'JESUS CHRIST AS THE WORD, THE LIGHT AND THE LIFE'), (1, 'p', 'THE WORD'), (1, 's', 'Prologue'),
           (19, 'p', 'THE FIRST PASSOVER — TESTIMONIES AND SIGNS'), (19, 's', 'The Testimony of John the Baptist'), (35, 's', 'The Testimony of the Disciples')]),
    2: _h([(1, 's', 'The First Sign at Cana in Galilee'), (13, 's', 'The Sign of the Cleansing of the Temple'), (23, 's', 'Jesus’ Reserve')]),
    3: _h([(1, 'p', 'THE LIFE-GIVING WATER'), (1, 's', 'Nicodemus'), (22, 's', 'Jesus and John the Baptist')]),
    4: _h([(1, 's', 'Jesus and the Samaritan Woman'), (43, 's', 'The Return to Galilee'), (46, 's', 'The Official’s Son')]),
    5: _h([(1, 'p', 'THE SECOND FEAST IN JERUSALEM'), (1, 's', 'The Healing at the Pool'), (19, 's', 'Jesus’ Defence')]),
    6: _h([(1, 'p', 'THE LIVING BREAD'), (1, 's', 'The Multiplication of the Loaves'), (16, 's', 'Jesus Walks on the Lake'), (22, 's', 'The Bread of Life Discourse')]),
    7: _h([(1, 'p', 'LIVING WATER AND LIGHT'), (1, 's', 'On the Way to the Feast of Tabernacles'), (14, 's', 'Disputes during the Feast'), (37, 's', 'The Spring of Living Water')]),
    8: _h([(1, 's', 'The Woman Caught in Adultery'), (12, 's', 'Light against Darkness')]),
    9: _h([(1, 's', 'The Healing of the Man Born Blind')]),
    10: _h([(1, 's', 'The Good Shepherd'), (22, 'p', 'AT THE FEAST OF DEDICATION'), (22, 's', 'Christ, One with the Father'), (40, 's', 'Beyond the Jordan')]),
    11: _h([(1, 'p', 'THE LAST JOURNEY TO JERUSALEM'), (1, 's', 'The Raising of Lazarus'), (45, 's', 'The Council of the Priests'), (54, 's', 'In Ephraim')]),
    12: _h([(1, 'p', 'THE PASSION AND RESURRECTION OF JESUS CHRIST'), (1, 'p', 'THE EVENTS BEFORE'), (1, 's', 'The Supper at Bethany'),
            (12, 's', 'The Triumphal Entry into Jerusalem'), (20, 's', 'The Hour of the Son of Man'), (37, 's', 'The Unbelief of the People')]),
    13: _h([(1, 'p', 'THE LAST SUPPER'), (1, 's', 'The Love and Humility of the Son of God'), (21, 's', 'The Betrayer Revealed'),
            (31, 'p', 'THE FAREWELL DISCOURSE'), (31, 's', 'Facing the Parting'), (36, 's', 'The Dialogue with Peter')]),
    14: _h([(1, 's', 'To the Father’s House'), (15, 's', 'The Promise of the Comforter'), (21, 's', 'Love Revealed'), (25, 's', 'The Mission of the Spirit. Peace')]),
    15: _h([(1, 's', 'Union with Christ'), (12, 's', 'The Laws of Friendship with Christ'), (18, 's', 'The Hatred of the World. The Witness of the Holy Spirit')]),
    16: _h([(1, 's', 'A Warning'), (5, 's', 'The Judgement of the Holy Spirit'), (16, 's', 'The Promise of His Return')]),
    17: _h([(1, 'p', 'THE PRIESTLY PRAYER OF CHRIST'), (1, 's', 'The Finished Work'), (6, 's', 'Prayer for the Disciples'), (20, 's', 'Prayer for the Church to Come')]),
    18: _h([(1, 'p', 'JESUS IN THE GARDEN'), (1, 's', 'The Arrest'), (12, 'p', 'JESUS BEFORE HIS JUDGES'), (12, 's', 'Before Annas. Peter’s Denial'),
            (28, 's', 'Before Pilate'), (33, 's', 'The Interrogation')]),
    19: _h([(1, 's', '“Behold the Man”'), (13, 's', 'The Sentence'), (17, 's', 'The Way of the Cross and the Crucifixion'), (25, 's', 'The Testament from the Cross'),
            (28, 's', 'The Death'), (38, 's', 'The Burial of Jesus')]),
    20: _h([(1, 'p', 'AFTER THE RESURRECTION'), (1, 's', 'Mary Magdalene, Peter and John at the Tomb'), (19, 's', 'The Risen One Appears to the Apostles'),
            (24, 's', 'Doubting Thomas'), (30, 's', 'The First Epilogue — the Evangelist’s')]),
    21: _h([(1, 's', 'The Risen One Appears in Galilee'), (15, 's', 'Peter Receives the Shepherd’s Charge'), (20, 's', 'The Other Lot of the Beloved Disciple'),
            (24, 's', 'The Second Epilogue — the Gospel’s')]),
}

MATTHEW_HEADINGS = {
    1: _h([(1, 'p', 'THE CHILDHOOD OF JESUS'), (1, 's', 'The Genealogy of Jesus'), (18, 's', 'The Birth of Jesus')]),
    2: _h([(1, 's', 'The Magi from the East'), (13, 's', 'The Flight into Egypt'), (16, 's', 'The Massacre of the Infants'), (19, 's', 'The Return to Nazareth')]),
    3: _h([(1, 'p', 'PREPARING FOR THE MINISTRY OF JESUS'), (1, 's', 'John the Baptist'), (13, 's', 'The Baptism of Jesus')]),
    4: _h([(1, 's', 'The Temptation of Jesus'), (12, 'p', 'THE MINISTRY OF JESUS IN GALILEE'), (12, 'p', 'THE BEGINNING OF THE MINISTRY'),
           (12, 's', 'The Field of His Work'), (18, 's', 'The Call of the First Disciples'), (23, 's', 'Jesus’ Further Ministry')]),
    5: _h([(1, 'p', 'THE SERMON ON THE MOUNT'), (3, 's', 'The Eight Beatitudes'), (13, 's', 'The Task of the Disciples'), (17, 's', 'Jesus and the Law'),
           (21, 's', 'The Fifth Commandment'), (27, 's', 'The Sixth Commandment'), (33, 's', 'The Eighth Commandment'), (38, 's', 'The Law of Retaliation'),
           (43, 's', 'Love of Enemies')]),
    6: _h([(1, 's', 'Purity of Intention'), (2, 's', 'Almsgiving'), (5, 's', 'Prayer'), (16, 's', 'Fasting'), (19, 's', 'Lasting Treasure'),
           (25, 's', 'Excessive Anxiety')]),
    7: _h([(1, 's', 'Restraint in Judging. Hypocrisy'), (7, 's', 'Persistence in Prayer'), (12, 's', 'The Golden Rule'), (13, 's', 'The Narrow Gate'),
           (15, 's', 'A Warning against False Prophets'), (21, 's', 'Self-Deception'), (24, 's', 'Building Well or Badly')]),
    8: _h([(1, 'p', 'JESUS THE WORKER OF WONDERS'), (1, 's', 'The Healing of a Leper'), (5, 's', 'The Centurion of Capernaum'),
           (14, 's', 'In Peter’s House. Many Healings'), (18, 's', 'The Cost of Following'), (23, 's', 'The Calming of the Storm'), (28, 's', 'Two Men Possessed')]),
    9: _h([(1, 's', 'The Healing of a Paralytic'), (9, 's', 'The Call of Matthew'), (14, 's', 'The Question of Fasting'),
           (18, 's', 'Jairus’ Daughter and the Woman with a Haemorrhage'), (27, 's', 'The Healing of Two Blind Men'), (32, 's', 'A Man Freed from a Demon, and the Sick Healed')]),
    10: _h([(1, 'p', 'THE SENDING OF THE TWELVE APOSTLES'), (1, 's', 'The Choosing of the Twelve'), (5, 's', 'The Missionary Discourse'),
            (17, 's', 'Persecutions Foretold'), (24, 's', 'Courage under Trial'), (34, 's', 'For Jesus or against Him. Renunciation'),
            (40, 's', 'The Reward for Giving Oneself to Jesus')]),
    11: _h([(2, 's', 'The Message of John the Baptist'), (7, 's', 'Jesus’ Testimony about John'), (16, 's', 'Jesus’ Verdict on His Generation'),
            (20, 's', 'Woe to the Unrepentant Towns'), (25, 's', 'The Revelation of the Father and the Son'), (28, 's', 'The Call to the Weary')]),
    12: _h([(1, 's', 'Plucking Grain on the Sabbath'), (9, 's', 'Healing on the Sabbath'), (15, 's', 'Jesus, “the Servant of the Lord”'),
            (22, 's', 'The Pharisees’ Charge and Jesus’ Defence'), (31, 's', 'The Sin against the Holy Spirit'), (38, 's', 'The Sign of Jonah'),
            (43, 's', 'Relapse into Sin'), (46, 's', 'The True Family of Jesus')]),
    13: _h([(1, 'p', 'TEACHING IN PARABLES'), (1, 's', 'The Parable of the Sower'), (10, 's', 'The Purpose of the Parables'), (18, 's', 'The Sower Explained'),
            (24, 's', 'The Parable of the Weeds'), (31, 's', 'The Parables of the Mustard Seed and the Yeast'), (36, 's', 'The Weeds Explained'),
            (44, 's', 'The Parables of the Treasure and the Pearl'), (47, 's', 'The Parable of the Net'), (53, 's', 'Jesus in Nazareth')]),
    14: _h([(1, 'p', 'FORMING THE APOSTLES IN GALILEE AND ON ITS BORDERS'), (1, 's', 'The Beheading of John the Baptist'),
            (13, 's', 'The First Multiplication of Loaves'), (22, 's', 'Jesus Walks on the Lake'), (34, 's', 'Healings in Gennesaret')]),
    15: _h([(1, 's', 'The Dispute about Tradition'), (10, 's', 'True Uncleanness'), (21, 's', 'The Faith of the Canaanite Woman'),
            (29, 's', 'Healings by the Lake'), (32, 's', 'The Second Multiplication of Loaves')]),
    16: _h([(1, 's', 'Another Demand for a Sign'), (5, 's', 'The Leaven of the Pharisees and Sadducees'), (13, 's', 'Peter’s Confession'),
            (21, 's', 'The First Prediction of the Passion and Resurrection'), (24, 's', 'The Conditions of Following Jesus')]),
    17: _h([(1, 's', 'The Transfiguration'), (9, 's', 'The Coming of Elijah'), (14, 's', 'The Healing of a Boy with Epilepsy'),
            (22, 's', 'The Second Prediction of the Passion and Resurrection'), (24, 's', 'The Temple Tax')]),
    18: _h([(1, 's', 'Who Is the Greatest'), (6, 's', 'Causing Others to Stumble'), (12, 's', 'The Lost Sheep'), (15, 's', 'Correcting a Brother'),
            (21, 's', 'The Duty to Forgive'), (23, 's', 'The Unmerciful Servant')]),
    19: _h([(1, 'p', 'THE MINISTRY OF JESUS IN JUDEA AND JERUSALEM'), (1, 'p', 'THE LAST JOURNEY TO JERUSALEM'), (1, 's', 'Marriage Cannot Be Dissolved'),
            (10, 's', 'Celibacy Freely Chosen'), (13, 's', 'Jesus Blesses the Children'), (16, 's', 'The Rich Young Man'), (23, 's', 'The Danger of Riches'),
            (27, 's', 'The Reward of Poverty Freely Chosen')]),
    20: _h([(1, 's', 'The Parable of the Labourers in the Vineyard'), (17, 's', 'The Third Prediction of the Passion and Resurrection'),
            (20, 's', 'The Sons of Zebedee'), (24, 's', 'Leadership as Service'), (29, 's', 'The Blind Men at Jericho')]),
    21: _h([(1, 'p', 'THE MINISTRY OF JESUS IN JERUSALEM'), (1, 's', 'The Triumphal Entry into Jerusalem'), (12, 's', 'Jesus in the Temple'),
            (18, 's', 'The Barren Fig Tree'), (23, 'p', 'DISPUTES WITH OPPONENTS IN THE TEMPLE'), (23, 's', 'The Question of Authority'),
            (28, 's', 'The Parable of the Two Sons'), (33, 's', 'The Parable of the Wicked Tenants')]),
    22: _h([(1, 's', 'The Parable of the Royal Wedding Feast'), (15, 's', 'The Question of Taxes'), (23, 's', 'The Question of the Resurrection'),
            (34, 's', 'The Greatest Commandment'), (41, 's', 'The Messiah, Son of God')]),
    23: _h([(1, 'p', 'THE DISCOURSE AGAINST THE SCRIBES AND PHARISEES'), (1, 's', 'A Warning against the Scribes'), (13, 's', 'Woe to the Hypocrites'),
            (37, 's', 'Jesus Turns Away from the City')]),
    24: _h([(1, 'p', 'THE DISCOURSE ON THE END OF JERUSALEM AND THE COMING OF CHRIST'), (1, 's', 'The Destruction of the Temple'),
            (4, 's', 'The Beginning of Sorrows'), (9, 's', 'The Persecution of the Disciples'), (15, 's', 'Signs of the Fall of Jerusalem'),
            (23, 's', 'The Coming of Christ'), (32, 's', 'The Lesson of the Fig Tree'), (36, 's', 'The Unknown Hour of His Coming'),
            (42, 's', 'The Need to Keep Watch'), (45, 's', 'The Parable of the Faithful and Unfaithful Servant')]),
    25: _h([(1, 's', 'The Parable of the Wise and Foolish Virgins'), (14, 's', 'The Parable of the Talents'), (31, 's', 'The Last Judgement')]),
    26: _h([(1, 's', 'The Last Prediction of the Passion'), (3, 's', 'The Decision of the Council'), (6, 's', 'The Anointing at Bethany'),
            (14, 's', 'The Betrayal of Judas'), (17, 'p', 'THE LAST SUPPER'), (17, 's', 'Preparing the Passover'), (20, 's', 'The Betrayer Revealed'),
            (26, 's', 'The Institution of the Eucharist'), (31, 's', 'Peter’s Denial Foretold'), (36, 'p', 'JESUS IN GETHSEMANE'),
            (36, 's', 'Prayer and Agony'), (47, 's', 'The Arrest of Jesus'), (57, 'p', 'JESUS BEFORE HIS JUDGES'), (57, 's', 'Before the Council'),
            (69, 's', 'Peter’s Denial')]),
    27: _h([(1, 's', 'Jesus Handed Over to Pilate'), (3, 's', 'The End of the Betrayer'), (11, 's', 'Jesus before Pilate'),
            (15, 's', 'Jesus Rejected by His People'), (27, 's', 'The King Mocked'), (32, 'p', 'JESUS ON GOLGOTHA'), (32, 's', 'The Way of the Cross'),
            (35, 's', 'The Crucifixion'), (39, 's', 'Mocked on the Cross'), (45, 's', 'The Death of Jesus'), (51, 's', 'After the Death of Jesus'),
            (57, 's', 'The Burial of Jesus'), (62, 's', 'The Guard at the Tomb')]),
    28: _h([(1, 'p', 'THE RESURRECTION OF JESUS CHRIST'), (1, 's', 'The Empty Tomb'), (9, 's', 'Jesus Appears to the Women'),
            (11, 's', 'The Guards Bribed'), (16, 'p', 'JESUS APPEARS TO THE DISCIPLES'), (16, 's', 'The Final Command')]),
}

BOOKS = {
    'matthew': dict(num=40, chapters=28, var='MATTHEW_EN', title='The Gospel according to Matthew', headings=MATTHEW_HEADINGS,
                    # WEB numbers Mt 23,13–14 as the KJV does; the Biblia Tysiąclecia's 23,13 is WEB's 23,14 (and it omits the other)
                    swap={23: (13, 14)}),
    'mark': dict(num=41, chapters=16, var='MARK_EN', title='The Gospel according to Mark', headings=MARK_HEADINGS),
    'john': dict(num=43, chapters=21, var='JOHN_EN', title='The Gospel according to John', headings=JOHN_HEADINGS),
}
BOOK = sys.argv[1] if len(sys.argv) > 1 else 'mark'
CFG = BOOKS[BOOK]
OUT = pathlib.Path(__file__).resolve().parent.parent / 'data' / f'{BOOK}-en.js'

def clean(s):
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s).replace('\xa0', ' ')
    return re.sub(r'\s+', ' ', s).strip()

chapters = []
for ch in range(1, CFG['chapters'] + 1):
    raw = subprocess.run(['curl', '-sL', f'https://bolls.life/get-text/WEB/{CFG["num"]}/{ch}/'], capture_output=True, check=True).stdout
    verses = [clean(v['text']) for v in sorted(json.loads(raw), key=lambda v: v['verse'])]
    if ch in CFG.get('swap', {}):
        a, b = CFG['swap'][ch]
        verses[a - 1], verses[b - 1] = verses[b - 1], verses[a - 1]
    print(f'{BOOK} {ch}: {len(verses)} verses')
    chapters.append({'verses': verses, 'headings': CFG['headings'].get(ch, [])})

OUT.write_text(
    f'// {CFG["title"]} — World English Bible (public domain), via bolls.life\n'
    f'// Generated by tools/fetch_web.py {BOOK} — do not edit by hand.\n'
    f'export const {CFG["var"]} = ' + json.dumps({'book': CFG['title'], 'translation': 'World English Bible', 'chapters': chapters}, ensure_ascii=False, indent=1) + ';\n',
    encoding='utf-8')
print('wrote', OUT)
