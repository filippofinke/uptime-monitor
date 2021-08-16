const fetch = require("node-fetch");

const ENDPOINT = process.env.IFTTT_ENDPOINT;

if (!ENDPOINT) {
  console.log(`Please specify your IFTTT Endpoint in your .env variables.`);
  console.log(`IFTTT_ENDPOINT=`);
}

module.exports = ({ name, lastStatus, status }) => {
  fetch(`${ENDPOINT}?value1=${name}&value2=${lastStatus}&value3=${status}`);
};
