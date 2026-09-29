// English (World English Bible) wording for beats that split a verse into sentences.
// Keyed by scene id → beat index. Beats not listed show the whole verse.
// `node tools/check.mjs matthew 10` verifies these pieces rebuild each WEB verse exactly.
export const BEATS_EN = {
  'mt10-call': {
    1: "He called to himself his twelve disciples,",
    2: "and gave them authority over unclean spirits, to cast them out, and to heal every disease and every sickness.",
  },
  'mt10-names': {
    0: "Now the names of the twelve apostles are these.",
    1: "The first, Simon, who is called Peter; Andrew, his brother;",
    2: "James the son of Zebedee; John, his brother;",
    3: "Philip; Bartholomew;",
    4: "Thomas; Matthew the tax collector;",
    5: "James the son of Alphaeus; Lebbaeus, who was also called Thaddaeus;",
  },
  'mt10-lost': {
    0: "Jesus sent these twelve out, and commanded them, saying,",
    1: "“Don’t go among the Gentiles, and don’t enter into any city of the Samaritans.",
  },
  'mt10-heal': {
    1: "Heal the sick, cleanse the lepers, and cast out demons.",
    2: "Freely you received, so freely give.",
  },
  'mt10-pack': {
    1: "Take no bag for your journey, neither two coats, nor shoes, nor staff:",
    2: "for the laborer is worthy of his food.",
  },
  'mt10-house': {
    0: "Into whatever city or village you enter, find out who in it is worthy;",
    1: "and stay there until you go on.",
    3: "If the household is worthy, let your peace come on it,",
    4: "but if it isn’t worthy, let your peace return to you.",
  },
  'mt10-dust': {
    0: "Whoever doesn’t receive you, nor hear your words,",
    1: "as you go out of that house or that city, shake off the dust from your feet.",
  },
  'mt10-wolves': {
    0: "“Behold, I send you out as sheep among wolves.",
    1: "Therefore be wise as serpents, and harmless as doves.",
  },
  'mt10-courts': {
    0: "But beware of men:",
    1: "for they will deliver you up to councils, and in their synagogues they will scourge you.",
    3: "But when they deliver you up, don’t be anxious how or what you will say,",
    4: "for it will be given you in that hour what you will say.",
  },
  'mt10-family': {
    0: "“Brother will deliver up brother to death, and the father his child.",
    1: "Children will rise up against parents, and cause them to be put to death.",
    2: "You will be hated by all men for my name’s sake,",
    3: "but he who endures to the end will be saved.",
  },
  'mt10-flee': {
    0: "But when they persecute you in this city, flee into the next,",
    1: "for most certainly I tell you, you will not have gone through the cities of Israel, until the Son of Man has come.",
  },
  'mt10-teacher': {
    1: "It is enough for the disciple that he be like his teacher, and the servant like his lord.",
    2: "If they have called the master of the house Beelzebul, how much more those of his household!",
  },
  'mt10-housetops': {
    0: "Therefore don’t be afraid of them,",
    1: "for there is nothing covered that will not be revealed; and hidden that will not be known.",
    2: "What I tell you in the darkness, speak in the light;",
    3: "and what you hear whispered in the ear, proclaim on the housetops.",
  },
  'mt10-fear': {
    0: "Don’t be afraid of those who kill the body, but are not able to kill the soul.",
    1: "Rather, fear him who is able to destroy both soul and body in Gehenna.",
  },
  'mt10-sparrows': {
    0: "“Aren’t two sparrows sold for an assarion coin?",
    1: "Not one of them falls on the ground apart from your Father’s will,",
  },
  'mt10-sword': {
    0: "“Don’t think that I came to send peace on the earth.",
    1: "I didn’t come to send peace, but a sword.",
  },
  'mt10-cross': {
    0: "He who loves father or mother more than me is not worthy of me;",
    1: "and he who loves son or daughter more than me isn’t worthy of me.",
    3: "He who seeks his life will lose it;",
    4: "and he who loses his life for my sake will find it.",
  },
  'mt10-receive': {
    0: "He who receives you receives me,",
    1: "and he who receives me receives him who sent me.",
    2: "He who receives a prophet in the name of a prophet will receive a prophet’s reward.",
    3: "He who receives a righteous man in the name of a righteous man will receive a righteous man’s reward.",
  },
};
