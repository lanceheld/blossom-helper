const compact = require('lodash/fp/compact');
const compose = require('lodash/fp/compose');
const filter = require('lodash/fp/filter');
const forEach = require('lodash/fp/forEach');
const includes = require('lodash/fp/includes');
const isEqual = require('lodash/fp/isEqual');
const join = require('lodash/fp/join');
const map = require('lodash/fp/map');
const orderBy = require('lodash/fp/orderBy');
const size = require('lodash/fp/size');

const words = require('an-array-of-english-words');

const centerLetter = 'o';
const petalLetters = ['b', 'r', 'e', 'n', 's', 'w'];

const regexCenter = new RegExp(centerLetter, 'i');
const regexWord = new RegExp(`^[${centerLetter}${petalLetters.join('')}]{4,}$`, 'i');

const blossomWords = compose(
  orderBy(size, 'desc'),
  filter((w) => regexWord.test(w)),
  filter((w) => regexCenter.test(w)),
)(words);

const score = (word, bonusLetter) => {
  const s = size(word);
  const baseScore = (s < 7) ? ((s - 3) * 2) : (12 + ((s - 7) * 3));
  const panagramScore = (compose(
    size,
    compact,
    map((l) => includes(l, word)),
  )([centerLetter, ...petalLetters]) === 7) ? 7 : 0;
  const bonusLetterScore = size(filter(isEqual(bonusLetter), word.split(''))) * 5;
  return `(${bonusLetter}: ${baseScore + panagramScore + bonusLetterScore})`;
};

forEach((w) => {
  console.log(`${w} - ${join(' ', map((l) => score(w, l), petalLetters))}`)
}, blossomWords);
