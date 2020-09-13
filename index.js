require('dotenv').config();

const fs = require('fs')
const fetch = require('node-fetch')
const telegram = require('node-telegram-bot-api')

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// path to the files in which errors needs to be checked
const ERROR_LOGS = [
  {
    name: 'nginx',
    path: '/var/log/nginx/error.log' 
  },
  {
    name: 'nginx+1',
    path: '/var/log/nginx/error.log.1'
  }
];

// setup bot with token ID
const bot = new telegram(TELEGRAM_TOKEN)

const main = async () => {
  // the main error object
  const errors = {};

  for (let error_log of ERROR_LOGS) {
    // checks for possible errors in the logs
    const error_logs = fs.readFileSync(error_log.path, {
      encoding: 'utf-8',
      flag: 'r',
    })
  
    // regex for YYYY/MM/DD
    const date_regex = /\d{4}\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])/g
    // regex for HH:MM:SS
    const time_regex = /(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/g
  
    const now = new Date().getTime();
    const lines = error_logs.split('\n')
  
    // will be changed if an error is detected
    let error = null;
  
    for (const line of lines) {
      // we check for a data within the line
      const date = line.match(date_regex)
      const time = line.match(time_regex)
  
      if (date && time) { // a resut was found
        let timestamp = new Date(`${date[0]} ${time[0]}`).getTime();
        let hours_diff = (now - timestamp) / 1000 / 3600;
  
        // if an error was spotted in the last 4 hours, we want to add it to the report
        if (hours_diff <= 1) {
          error = line;
          break;
        }
  
        // if the difference is greater than what's required, we just discard everything, it means no error was found
        if (hours_diff > 1) {
          break;
        }
      }
    }
  
    // do we have an error ?
    if (error) {
      errors[error_log.name] = error;
    }
  }


  // generic message composition
  let error_message = null;
  if (Object.keys(errors).length > 0) {
    error_message = 'Error(s) were found during the monitoring\n--------------\n--------------\n'
    for (let origin in errors) {
      error_message+= `<b>${origin}</b>\n--------------\n${errors[origin]}\n--------------\n`
    }
  }

  // if there are errors, we send it via the bot
  const nowDate = new Date();
  if (error_message) {
    const body = await bot.sendMessage(TELEGRAM_CHAT_ID, error_message, { parse_mode: 'HTML' })
    console.log(`Error message was sent the ${nowDate.toISOString().split('T')[0]} at ${nowDate.getHours()}:${nowDate.getMinutes()}\n${error_message}\n\n`);
  } 
  else {
    console.log(`${nowDate.toISOString().split('T')[0]} at ${nowDate.getHours()}:${nowDate.getMinutes()}\nNo error found\n\n`)
  }
}

main();
