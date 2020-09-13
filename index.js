require('dotenv').config();

const fetch = require('node-fetch')
const telegram = require('node-telegram-bot-api')

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// setup bot with token ID
const bot = new telegram(TELEGRAM_TOKEN)

const main = async () => {
  // send a message with the bot
  const body = await bot.sendMessage(TELEGRAM_CHAT_ID, "coucou mec 2")
  console.log(body);
}

main();