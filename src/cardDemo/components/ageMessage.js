module.exports = ({greet}) =>
  (props) => `You're ${props.age} today!\n${greet(props)}\n`;
