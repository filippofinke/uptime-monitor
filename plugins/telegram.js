const fetch = require("node-fetch");

const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ENDPOINT = `https://api.telegram.org/bot${TOKEN}`;

if (!TOKEN || !CHAT_ID) {
  console.log(
    `Please specify your Telegram Bot Token and ChatId in your .env variables.`
  );
  console.log(`TELEGRAM_TOKEN=`);
  console.log(`TELEGRAM_CHAT_ID=`);
}

module.exports = ({ name, lastStatus, status }) => {
  let text = `The service ${name} went from ${lastStatus} to ${status}`;

  fetch(`${ENDPOINT}/sendMessage?chat_id=${CHAT_ID}&text=${text}`);
};
