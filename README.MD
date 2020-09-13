# Server Monitoring Telegram

A very simple utility I wrote to get monitoring status report from a server.

This utility is expected to be run at a regular interval and checks for errors in the following log files:

* nginx

# Configuration

Some steps are required for configuration. A telegram api bot token is required as well as your chat id so that the bot can send message to a telegram account.

These informations need to be stored in a `.env` file at the root of this project.

| Variable name | Description |
|---------------|-------------|
| TELEGRAM_CHAT_ID | *string* The ID of your chat |
| TELEGRAM_TOKEN | *string* The token to interact with your Telegram bot |