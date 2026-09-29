// English (World English Bible) wording for beats that split a verse into sentences.
// Keyed by scene id → beat index. Beats not listed show the whole verse.
// `node tools/check.mjs matthew 16` verifies these pieces rebuild each WEB verse exactly.
export const BEATS_EN = {
  'mt16-test': {
    1: 'The Pharisees and Sadducees came,',
    2: 'and testing him, asked him to show them a sign from heaven.',
  },
  'mt16-sky': {
    1: 'In the morning, ‘It will be foul weather today, for the sky is red and threatening.’',
    2: 'Hypocrites! You know how to discern the appearance of the sky, but you can’t discern the signs of the times!',
  },
  'mt16-jonah': {
    0: 'An evil and adulterous generation seeks after a sign,',
    1: 'and there will be no sign given to it, except the sign of the prophet Jonah.”',
    2: 'He left them, and departed.',
  },
  'mt16-caesarea': {
    0: 'Now when Jesus came into the parts of Caesarea Philippi,',
    1: 'he asked his disciples, saying, “Who do men say that I, the Son of Man, am?”',
    2: 'They said, “Some say John the Baptizer, some, Elijah,',
    3: 'and others, Jeremiah, or one of the prophets.”',
  },
  'mt16-confess': {
    1: 'Simon Peter answered, “You are the Christ,',
    2: 'the Son of the living God.”',
  },
  'mt16-blessed': {
    0: 'Jesus answered him, “Blessed are you, Simon Bar Jonah,',
    1: 'for flesh and blood has not revealed this to you, but my Father who is in heaven.',
  },
  'mt16-rock': {
    0: 'I also tell you that you are Peter,',
    1: 'and on this rock I will build my assembly,',
    2: 'and the gates of Hades will not prevail against it.',
  },
  'mt16-keys': {
    0: 'I will give to you the keys of the Kingdom of Heaven,',
    1: 'and whatever you bind on earth will have been bound in heaven;',
    2: 'and whatever you release on earth will have been released in heaven.”',
  },
  'mt16-passion': {
    0: 'From that time, Jesus began to show his disciples that he must go to Jerusalem',
    1: 'and suffer many things from the elders, chief priests, and scribes,',
    2: 'and be killed,',
    3: 'and the third day be raised up.',
  },
  'mt16-rebuke': {
    0: 'Peter took him aside, and began to rebuke him, saying, “Far be it from you, Lord!',
    1: 'This will never be done to you.”',
    2: 'But he turned, and said to Peter, “Get behind me, Satan!',
    3: 'You are a stumbling block to me, for you are not setting your mind on the things of God, but on the things of men.”',
  },
  'mt16-cross': {
    0: 'Then Jesus said to his disciples, “If anyone desires to come after me, let him deny himself,',
    1: 'and take up his cross, and follow me.',
    2: 'For whoever desires to save his life will lose it,',
    3: 'and whoever will lose his life for my sake will find it.',
  },
  'mt16-world': {
    0: 'For what will it profit a man, if he gains the whole world, and forfeits his life?',
    1: 'Or what will a man give in exchange for his life?',
  },
  'mt16-glory': {
    0: 'For the Son of Man will come in the glory of his Father with his angels,',
    1: 'and then he will render to everyone according to his deeds.',
  },
};
