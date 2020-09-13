require('dotenv').config();

const fs = require('fs')
const fetch = require('node-fetch')
const telegram = require('node-telegram-bot-api')

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// path to the files in which errors needs to be checked
const ERROR_LOGS = [
  '/var/log/nginx/error.log.1'
];

// setup bot with token ID
const bot = new telegram(TELEGRAM_TOKEN)

const main = async () => {
  // checks for possible errors in the logs
  const error_logs = fs.readFileSync(ERROR_LOGS[0], {
    encoding: 'utf-8',
    flag: 'r',
  })

  // regex for YYYY/MM/DD
  const date_regex = /\d{4}\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])/g
  // regex for HH:MM:SS
  const time_regex = /(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/g

  const now = new Date().getTime();
  const lines = error_logs.split('\n')

  for (const line of lines) {
    // we check for a data within the line
    const date = line.match(date_regex)
    const time = line.match(time_regex)

    if (date && time) { // a resut was found
      let timestamp = new Date(`${date[0]} ${time[0]}`).getTime();
      console.log((now - timestamp) / 3600);
    }

    console.log('--------------------')
    console.log(line)
  }

  // send a message with the bot
  //const body = await bot.sendMessage(TELEGRAM_CHAT_ID, "coucou mec 2")
  //console.log(body);
}

main();
