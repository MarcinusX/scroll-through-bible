// English (World English Bible) wording for beats that split a verse into sentences.
// Keyed by scene id → beat index. Beats not listed show the whole verse.
// `node tools/check.mjs matthew 7` verifies these pieces rebuild each WEB verse exactly.
export const BEATS_EN = {
  'mt7-judge': {
    2: 'For with whatever judgment you judge, you will be judged;',
    3: 'and with whatever measure you measure, it will be measured to you.',
  },
  'mt7-pearls': {
    0: '“Don’t give that which is holy to the dogs,',
    1: 'neither throw your pearls before the pigs, lest perhaps they trample them under their feet, and turn and tear you to pieces.',
  },
  'mt7-ask': {
    0: '“Ask, and it will be given you.',
    1: 'Seek, and you will find.',
    2: 'Knock, and it will be opened for you.',
  },
  'mt7-golden': {
    0: 'Therefore whatever you desire for men to do to you, you shall also do to them;',
    1: 'for this is the law and the prophets.',
  },
  'mt7-gates': {
    0: '“Enter in by the narrow gate;',
    1: 'for wide is the gate and broad is the way that leads to destruction, and many are those who enter in by it.',
  },
  'mt7-thorns': {
    0: 'By their fruits you will know them.',
    1: 'Do you gather grapes from thorns, or figs from thistles?',
  },
  'mt7-lord': {
    0: 'Not everyone who says to me, ‘Lord, Lord,’ will enter into the Kingdom of Heaven;',
    1: 'but he who does the will of my Father who is in heaven.',
    3: 'Then I will tell them, ‘I never knew you.',
    4: 'Depart from me, you who work iniquity.’',
  },
  'mt7-rock': {
    1: 'The rain came down, the floods came, and the winds blew, and beat on that house;',
    2: 'and it didn’t fall, for it was founded on the rock.',
  },
  'mt7-sand': {
    1: 'The rain came down, the floods came, and the winds blew, and beat on that house;',
    2: 'and it fell — and great was its fall.”',
  },
};
