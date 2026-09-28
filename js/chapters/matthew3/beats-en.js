// English (World English Bible) wording for beats that split a verse into sentences.
// Keyed by scene id → beat index. Beats not listed show the whole verse.
// `node tools/check.mjs matthew 3` verifies these pieces rebuild each WEB verse exactly.
export const BEATS_EN = {
  'mt3-desert': {
    2: '“Repent,',
    3: 'for the Kingdom of Heaven is at hand!”',
  },
  'mt3-voice': {
    0: 'For this is he who was spoken of by Isaiah the prophet, saying,',
    1: '“The voice of one crying in the wilderness,',
    2: 'make ready the way of the Lord. Make his paths straight.”',
  },
  'mt3-camel': {
    0: 'Now John himself wore clothing made of camel’s hair, with a leather belt around his waist.',
    1: 'His food was locusts and wild honey.',
  },
  'mt3-jordan': {
    1: 'They were baptized by him in the Jordan,',
    2: 'confessing their sins.',
  },
  'mt3-vipers': {
    0: 'But when he saw many of the Pharisees and Sadducees coming for his baptism, he said to them,',
    1: '“You offspring of vipers, who warned you to flee from the wrath to come?',
  },
  'mt3-stones': {
    1: 'Don’t think to yourselves, ‘We have Abraham for our father,’',
    2: 'for I tell you that God is able to raise up children to Abraham from these stones.',
  },
  'mt3-axe': {
    0: '“Even now the ax lies at the root of the trees.',
    1: 'Therefore every tree that doesn’t produce good fruit is cut down, and cast into the fire.',
  },
  'mt3-mightier': {
    0: 'I indeed baptize you in water for repentance,',
    1: 'but he who comes after me is mightier than I,',
    2: 'whose shoes I am not worthy to carry.',
    3: 'He will baptize you in the Holy Spirit.',
  },
  'mt3-winnow': {
    0: 'His winnowing fork is in his hand, and he will thoroughly cleanse his threshing floor.',
    1: 'He will gather his wheat into the barn,',
    2: 'but the chaff he will burn up with unquenchable fire.”',
  },
  'mt3-comes': {
    1: 'But John would have hindered him, saying,',
    2: '“I need to be baptized by you, and you come to me?”',
    3: 'But Jesus, answering, said to him, “Allow it now, for this is the fitting way for us to fulfill all righteousness.”',
    4: 'Then he allowed him.',
  },
  'mt3-heavens': {
    0: 'Jesus, when he was baptized, went up directly from the water:',
    1: 'and behold, the heavens were opened to him.',
    2: 'He saw the Spirit of God descending as a dove, and coming on him.',
    3: 'Behold, a voice out of the heavens said,',
    4: '“This is my beloved Son, with whom I am well pleased.”',
  },
};
