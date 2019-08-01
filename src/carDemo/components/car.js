const car = ({ name, engine }) =>
  (distance) => `The ${name} drove ${distance}km using ${engine(distance)}l of fuel.`;

module.exports = car;
