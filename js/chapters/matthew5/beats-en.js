// English (World English Bible) wording for beats that split a verse into sentences.
// Keyed by scene id → beat index. Beats not listed show the whole verse.
// `node tools/check.mjs matthew 5` verifies these pieces rebuild each WEB verse exactly.
export const BEATS_EN = {
  'mt5-mount': {
    1: 'Seeing the multitudes, he went up onto the mountain.',
    2: 'When he had sat down, his disciples came to him.',
  },
  'mt5-blessed': {
    9: 'Rejoice, and be exceedingly glad, for great is your reward in heaven.',
    10: 'For that is how they persecuted the prophets who were before you.',
  },
  'mt5-salt': {
    0: '“You are the salt of the earth,',
    1: 'but if the salt has lost its flavor, with what will it be salted?',
    2: 'It is then good for nothing, but to be cast out and trodden under the feet of men.',
  },
  'mt5-city': {
    0: 'You are the light of the world.',
    1: 'A city located on a hill can’t be hidden.',
  },
  'mt5-law': {
    0: '“Don’t think that I came to destroy the law or the prophets.',
    1: 'I didn’t come to destroy, but to fulfill.',
  },
  'mt5-least': {
    0: 'Whoever, therefore, shall break one of these least commandments, and teach others to do so, shall be called least in the Kingdom of Heaven;',
    1: 'but whoever shall do and teach them shall be called great in the Kingdom of Heaven.',
  },
  'mt5-anger': {
    1: 'But I tell you, that everyone who is angry with his brother without a cause will be in danger of the judgment;',
    2: 'and whoever says to his brother, ‘Raca!’ will be in danger of the council;',
    3: 'and whoever says, ‘You fool!’ will be in danger of the fire of Gehenna.',
  },
  'mt5-altar': {
    1: 'leave your gift there before the altar, and go your way. First be reconciled to your brother,',
    2: 'and then come and offer your gift.',
  },
  'mt5-heart': {
    2: 'If your right eye causes you to stumble, pluck it out and throw it away from you.',
    3: 'For it is more profitable for you that one of your members should perish, than for your whole body to be cast into Gehenna.',
    4: 'If your right hand causes you to stumble, cut it off, and throw it away from you.',
    5: 'For it is more profitable for you that one of your members should perish, than for your whole body to be cast into Gehenna.',
  },
  'mt5-divorce': {
    1: 'but I tell you that whoever puts away his wife, except for the cause of sexual immorality, makes her an adulteress;',
    2: 'and whoever marries her when she is put away commits adultery.',
  },
  'mt5-oaths': {
    2: 'nor by the earth, for it is the footstool of his feet;',
    3: 'nor by Jerusalem, for it is the city of the great King.',
  },
  'mt5-yes': {
    1: 'But let your ‘Yes’ be ‘Yes’ and your ‘No’ be ‘No.’',
    2: 'Whatever is more than these is of the evil one.',
  },
  'mt5-cheek': {
    1: 'But I tell you, don’t resist him who is evil;',
    2: 'but whoever strikes you on your right cheek, turn to him the other also.',
  },
  'mt5-enemies': {
    2: 'that you may be children of your Father who is in heaven.',
    3: 'For he makes his sun to rise on the evil and the good,',
    4: 'and sends rain on the just and the unjust.',
  },
  'mt5-tax': {
    0: 'For if you love those who love you, what reward do you have?',
    1: 'Don’t even the tax collectors do the same?',
    2: 'If you only greet your friends, what more do you do than others?',
    3: 'Don’t even the tax collectors do the same?',
  },
};
