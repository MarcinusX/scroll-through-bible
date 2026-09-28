// English (World English Bible) wording for beats that split a verse into sentences.
// Keyed by scene id → beat index. Beats not listed show the whole verse.
// `node tools/check.mjs matthew 8` verifies these pieces rebuild each WEB verse exactly.
export const BEATS_EN = {
  'mt8-leper': {
    2: 'Behold, a leper came to him and worshiped him,',
    3: 'saying, “Lord, if you want to, you can make me clean.”',
    4: 'Jesus stretched out his hand, and touched him, saying, “I want to. Be made clean.”',
    5: 'Immediately his leprosy was cleansed.',
    6: 'Jesus said to him, “See that you tell nobody,',
    7: 'but go, show yourself to the priest, and offer the gift that Moses commanded, as a testimony to them.”',
  },
  'mt8-centurion': {
    3: 'The centurion answered, “Lord, I’m not worthy for you to come under my roof.',
    4: 'Just say the word, and my servant will be healed.',
  },
  'mt8-authority': {
    0: 'For I am also a man under authority, having under myself soldiers.',
    1: 'I tell this one, ‘Go,’ and he goes;',
    2: 'and tell another, ‘Come,’ and he comes;',
    3: 'and tell my servant, ‘Do this,’ and he does it.”',
  },
  'mt8-faith': {
    0: 'When Jesus heard it, he marveled, and said to those who followed,',
    1: '“Most certainly I tell you, I haven’t found so great a faith, not even in Israel.',
  },
  'mt8-feast': {
    0: 'I tell you that many will come from the east and the west,',
    1: 'and will sit down with Abraham, Isaac, and Jacob in the Kingdom of Heaven,',
    2: 'but the children of the Kingdom will be thrown out into the outer darkness.',
    3: 'There will be weeping and gnashing of teeth.”',
  },
  'mt8-hour': {
    0: 'Jesus said to the centurion, “Go your way. Let it be done for you as you have believed.”',
    1: 'His servant was healed in that hour.',
  },
  'mt8-fever': {
    1: 'He touched her hand, and the fever left her.',
    2: 'She got up and served him.',
  },
  'mt8-evening': {
    0: 'When evening came, they brought to him many possessed with demons.',
    1: 'He cast out the spirits with a word, and healed all who were sick;',
    2: 'that it might be fulfilled which was spoken through Isaiah the prophet, saying,',
    3: '“He took our infirmities, and bore our diseases.”',
  },
  'mt8-scribe': {
    1: 'A scribe came, and said to him,',
    2: '“Teacher, I will follow you wherever you go.”',
  },
  'mt8-foxes': {
    0: 'Jesus said to him, “The foxes have holes,',
    1: 'and the birds of the sky have nests,',
    2: 'but the Son of Man has nowhere to lay his head.”',
  },
  'mt8-dead': {
    1: 'But Jesus said to him,',
    2: '“Follow me, and leave the dead to bury their own dead.”',
  },
  'mt8-storm': {
    1: 'Behold, a violent storm came up on the sea,',
    2: 'so much that the boat was covered with the waves,',
    3: 'but he was asleep.',
    4: 'They came to him, and woke him up, saying,',
    5: '“Save us, Lord! We are dying!”',
  },
  'mt8-calm': {
    0: 'He said to them, “Why are you fearful, O you of little faith?”',
    1: 'Then he got up, rebuked the wind and the sea,',
    2: 'and there was a great calm.',
  },
  'mt8-tombs': {
    0: 'When he came to the other side, into the country of the Gergesenes,',
    1: 'two people possessed by demons met him there, coming out of the tombs,',
    2: 'exceedingly fierce, so that nobody could pass that way.',
    3: 'Behold, they cried out, saying, “What do we have to do with you, Jesus, Son of God?',
    4: 'Have you come here to torment us before the time?”',
  },
  'mt8-pigs': {
    2: 'He said to them, “Go!”',
    3: 'They came out, and went into the herd of pigs:',
    4: 'and behold, the whole herd of pigs rushed down the cliff into the sea, and died in the water.',
  },
  'mt8-town': {
    0: 'Those who fed them fled,',
    1: 'and went away into the city, and told everything, including what happened to those who were possessed with demons.',
    2: 'Behold, all the city came out to meet Jesus.',
    3: 'When they saw him, they begged that he would depart from their borders.',
  },
};
