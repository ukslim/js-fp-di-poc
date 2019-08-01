const { val, ref, makeBeans } = require('../container/beanFactory');
const prefixGreet = require('./components/prefixGreet');
const asciiArtCard = require('./components/asciiArtCard');
const ageMessage = require('./components/ageMessage');
const art = require('./assets/art');

const hr = () => console.log('\n\n---------------------------------\n\n');

const config = [
  {
    id: 'cakeBirthdayCard',
    builder: asciiArtCard,
    props: {
      picture: val(art.cake),
      greet: ref('birthdayGreet'),
    }
  },
  {
    id: 'birthdayGreet',
    builder: prefixGreet,
    props: {
      prefix: val('Happy Birthday'),
    }
  },
  {
    id: 'ageBirthdayGreet',
    builder: ageMessage,
    props: {
      greet: ref('birthdayGreet'),
    }
  },
  {
    id: 'cakeBirthdayCardWithAge',
    builder: asciiArtCard,
    props: {
      picture: val(art.cake),
      greet: ref('ageBirthdayGreet'),
    }
  },
  {
    id: 'carBirthdayCardWithAge',
    builder: asciiArtCard,
    props: {
      picture: val(art.car),
      greet: ref('ageBirthdayGreet'),
    }
  },
];


const beans = makeBeans(config);

// Note that there's only one of each bean, even when multiple
// other beans reference it. This safe because the functions are all
// pure and therefore stateless, and good because it saves memory and
// initialisation time.
console.log(Object.keys(beans));

hr();

console.log(beans['cakeBirthdayCard']({name: 'Oscar'}));

hr();

console.log(beans['cakeBirthdayCardWithAge']({name: 'William', age: 50}));

hr();

console.log(beans['carBirthdayCardWithAge']({name: 'Liam', age: 14}));
