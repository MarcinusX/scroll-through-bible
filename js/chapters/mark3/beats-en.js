// English (World English Bible) wording for beats that split a verse into sentences.
// Keyed by scene id → beat index. Beats not listed show the whole verse.
// `node tools/check.mjs 3` verifies these pieces rebuild each WEB verse exactly.
export const BEATS_EN = {
  'm3-synagogue': {
    1: 'He entered again into the synagogue,',
    2: 'and there was a man there who had his hand withered.',
    5: 'He said to them, “Is it lawful on the Sabbath day to do good, or to do harm?',
    6: 'To save a life, or to kill?”',
    7: 'But they were silent.',
    8: 'When he had looked around at them with anger, being grieved at the hardening of their hearts,',
    9: 'he said to the man, “Stretch out your hand.”',
    10: 'He stretched it out, and his hand was restored as healthy as the other.',
  },
  'm3-multitude': {
    0: 'Jesus withdrew to the sea with his disciples,',
    1: 'and a great multitude followed him from Galilee,',
    2: 'from Judea,',
    3: 'from Jerusalem, from Idumaea, beyond the Jordan, and those from around Tyre and Sidon.',
    4: 'A great multitude, hearing what great things he did, came to him.',
  },
  'm3-shore': {},
  'm3-mountain': {
    0: 'He went up into the mountain,',
    1: 'and called to himself those whom he wanted,',
    2: 'and they went to him.',
    3: 'He appointed twelve, that they might be with him,',
    4: 'and that he might send them out to preach,',
  },
  'm3-twelve': {
    1: 'James the son of Zebedee; John, the brother of James,',
    2: 'and he called them Boanerges, which means, Sons of Thunder;',
    3: 'Andrew; Philip; Bartholomew; Matthew;',
    4: 'Thomas; James, the son of Alphaeus; Thaddaeus; Simon the Zealot;',
  },
  'm3-house': {
    1: 'When his friends heard it, they went out to seize him:',
    2: 'for they said, “He is insane.”',
  },
  'm3-scribes': {
    0: 'The scribes who came down from Jerusalem said,',
    1: '“He has Beelzebul,” and, “By the prince of the demons he casts out the demons.”',
    2: 'He summoned them, and said to them in parables,',
    3: '“How can Satan cast out Satan?',
  },
  'm3-strongman': {
    0: 'But no one can enter into the house of the strong man to plunder,',
    1: 'unless he first binds the strong man;',
    2: 'and then he will plunder his house.',
  },
  'm3-spirit': {
    0: 'Most certainly I tell you,',
    1: 'all sins of the descendants of man will be forgiven, including their blasphemies with which they may blaspheme;',
  },
  'm3-family': {
    1: 'A multitude was sitting around him,',
    2: 'and they told him, “Behold, your mother, your brothers, and your sisters are outside looking for you.”',
    4: 'Looking around at those who sat around him, he said,',
    5: '“Behold, my mother and my brothers!',
  },
};
