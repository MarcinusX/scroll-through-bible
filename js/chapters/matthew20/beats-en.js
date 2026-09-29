// English (World English Bible) wording for beats that split a verse into sentences.
// Keyed by scene id → beat index. Beats not listed show the whole verse.
// `node tools/check.mjs matthew 20` verifies these pieces rebuild each WEB verse exactly.
export const BEATS_EN = {
  'mt20-eleventh': {
    0: 'About the eleventh hour he went out, and found others standing idle.',
    1: 'He said to them, ‘Why do you stand here all day idle?’',
    2: '“They said to him, ‘Because no one has hired us.’',
    3: '“He said to them, ‘You also go into the vineyard, and you will receive whatever is right.’',
  },
  'mt20-evening': {
    0: 'When evening had come, the lord of the vineyard said to his manager,',
    1: '‘Call the laborers and pay them their wages, beginning from the last to the first.’',
  },
  'mt20-grumble': {
    0: 'When the first came, they supposed that they would receive more;',
    1: 'and they likewise each received a denarius.',
  },
  'mt20-friend': {
    0: '“But he answered one of them, ‘Friend, I am doing you no wrong.',
    1: 'Didn’t you agree with me for a denarius?',
    2: 'Take that which is yours, and go your way.',
    3: 'It is my desire to give to this last just as much as to you.',
    4: 'Isn’t it lawful for me to do what I want to with what I own?',
    5: 'Or is your eye evil, because I am good?’',
  },
  'mt20-ascent': {
    1: '“Behold, we are going up to Jerusalem,',
    2: 'and the Son of Man will be delivered to the chief priests and scribes,',
    3: 'and they will condemn him to death,',
    4: 'and will hand him over to the Gentiles to mock, to scourge, and to crucify;',
    5: 'and the third day he will be raised up.”',
  },
  'mt20-mother': {
    1: 'He said to her, “What do you want?”',
    2: 'She said to him, “Command that these, my two sons, may sit, one on your right hand, and one on your left hand, in your Kingdom.”',
    3: 'But Jesus answered, “You don’t know what you are asking.',
    4: 'Are you able to drink the cup that I am about to drink, and be baptized with the baptism that I am baptized with?”',
    5: 'They said to him, “We are able.”',
    6: 'He said to them, “You will indeed drink my cup, and be baptized with the baptism that I am baptized with,',
    7: 'but to sit on my right hand and on my left hand is not mine to give; but it is for whom it has been prepared by my Father.”',
  },
  'mt20-ten': {
    1: 'But Jesus summoned them, and said,',
    2: '“You know that the rulers of the nations lord it over them, and their great ones exercise authority over them.',
  },
  'mt20-serve': {
    0: 'It shall not be so among you,',
    1: 'but whoever desires to become great among you shall be your servant.',
    3: 'even as the Son of Man came not to be served, but to serve,',
    4: 'and to give his life as a ransom for many.”',
  },
  'mt20-jericho': {
    1: 'Behold, two blind men sitting by the road, when they heard that Jesus was passing by,',
    2: 'cried out, “Lord, have mercy on us, you son of David!”',
    3: 'The multitude rebuked them, telling them that they should be quiet,',
    4: 'but they cried out even more, “Lord, have mercy on us, you son of David!”',
  },
  'mt20-sight': {
    0: 'Jesus stood still, and called them,',
    1: 'and asked, “What do you want me to do for you?”',
    3: 'Jesus, being moved with compassion, touched their eyes;',
    4: 'and immediately their eyes received their sight, and they followed him.',
  },
};
