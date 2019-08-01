const engine = ({ cc }) =>
  (distance) => distance * cc * 0.1;

module.exports = engine;
