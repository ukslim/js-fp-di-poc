module.exports = ({picture, greet}) =>
  (props) => `${picture}\n\n${greet(props)}`;
