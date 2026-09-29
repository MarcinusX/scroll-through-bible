// English (World English Bible) wording for beats that split a verse into sentences.
// Keyed by scene id → beat index. Beats not listed show the whole verse.
// `node tools/check.mjs matthew 11` verifies these pieces rebuild each WEB verse exactly.
export const BEATS_EN = {
  'mt11-signs': {
    2: 'the blind receive their sight, the lame walk, the lepers are cleansed,',
    3: 'the deaf hear, the dead are raised up, and the poor have good news preached to them.',
  },
  'mt11-reed': {
    0: 'As these went their way, Jesus began to say to the multitudes concerning John,',
    1: '“What did you go out into the wilderness to see? A reed shaken by the wind?',
  },
  'mt11-soft': {
    0: 'But what did you go out to see? A man in soft clothing?',
    1: 'Behold, those who wear soft clothing are in kings’ houses.',
  },
  'mt11-prophet': {
    0: 'But why did you go out? To see a prophet?',
    1: 'Yes, I tell you, and much more than a prophet.',
    2: 'For this is he, of whom it is written,',
    3: '‘Behold, I send my messenger before your face, who will prepare your way before you.’',
  },
  'mt11-greatest': {
    0: 'Most certainly I tell you, among those who are born of women there has not arisen anyone greater than John the Baptizer;',
    1: 'yet he who is least in the Kingdom of Heaven is greater than he.',
  },
  'mt11-violence': {
    0: 'From the days of John the Baptizer until now, the Kingdom of Heaven suffers violence,',
    1: 'and the violent take it by force.',
  },
  'mt11-market': {
    0: '“But to what shall I compare this generation?',
    1: 'It is like children sitting in the marketplaces, who call to their companions',
    2: 'and say, ‘We played the flute for you, and you didn’t dance.',
    3: 'We mourned for you, and you didn’t lament.’',
  },
  'mt11-fast': {
    0: 'For John came neither eating nor drinking,',
    1: 'and they say, ‘He has a demon.’',
    2: 'The Son of Man came eating and drinking,',
    3: 'and they say, ‘Behold, a gluttonous man and a drunkard, a friend of tax collectors and sinners!’',
    4: 'But wisdom is justified by her children.”',
  },
  'mt11-woe': {
    1: '“Woe to you, Chorazin! Woe to you, Bethsaida!',
  },
  'mt11-tyre': {
    0: 'For if the mighty works had been done in Tyre and Sidon which were done in you, they would have repented long ago in sackcloth and ashes.',
  },
  'mt11-capernaum': {
    0: 'You, Capernaum, who are exalted to heaven, you will go down to Hades.',
    1: 'For if the mighty works had been done in Sodom which were done in you, it would have remained until today.',
  },
  'mt11-praise': {
    0: 'At that time, Jesus answered,',
    1: '“I thank you, Father, Lord of heaven and earth,',
    2: 'that you hid these things from the wise and understanding, and revealed them to infants.',
  },
  'mt11-known': {
    0: 'All things have been delivered to me by my Father.',
    1: 'No one knows the Son, except the Father; neither does anyone know the Father, except the Son, and he to whom the Son desires to reveal him.',
  },
  'mt11-rest': {
    0: '“Come to me, all you who labor and are heavily burdened,',
    1: 'and I will give you rest.',
    2: 'Take my yoke upon you, and learn from me, for I am gentle and humble in heart;',
    3: 'and you will find rest for your souls.',
  },
};
