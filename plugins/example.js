module.exports = ({ name, lastStatus, status }) => {
  console.log(`The service ${name} went from ${lastStatus} to ${status}`);
};
