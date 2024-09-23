# Telegram Bot with Cloudflare Worker

Welcome to the Telegram Bot project! This guide will walk you through creating and deploying a Telegram bot using Cloudflare Workers.

## Features

- **Webhook Management**: Set and remove webhooks easily.
- **Interactive Commands**: Respond to user commands with inline buttons.
- **Message Handling**: Send, edit, and delete messages based on user interactions.

## Prerequisites

- A **Telegram account** and a bot created using the [BotFather](https://core.telegram.org/bots#botfather).
- A **Cloudflare account** to host the worker.

## Setup Instructions

### Step 1: Create a Telegram Bot

1. Open Telegram and search for **BotFather**.
2. Start a chat and use the command `/newbot` to create a new bot.
3. Follow the prompts to set your bot's name and username.
4. After creation, you will receive a token. Save it for later.

### Step 2: Create a Cloudflare Worker

1. Log in to your Cloudflare account.
2. Go to the **Workers** section and create a new worker.
3. Replace the default code with the code provided below.

### Step 3: Update the Code

Replace the `YOUR_TELEGRAM_BOT_TOKEN` and `your-cloudflare-worker-url.workers.dev` placeholders in the code with your actual bot token and the Cloudflare Worker URL.

```javascript
const TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'; // Ganti dengan token bot Anda
const API_URL = `https://api.telegram.org/bot${TOKEN}`;
const WEBHOOK_URL = 'https://your-cloudflare-worker-url.workers.dev'; // Ganti dengan URL Cloudflare Worker Anda

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// ... (rest of your code)
```

### Step 4: Deploy the Webhook

To set the webhook for your bot, send a GET request to the following URL:

```
https://api.telegram.org/botYOUR_TELEGRAM_BOT_TOKEN/setWebhook?url=https://your-cloudflare-worker-url.workers.dev
```

You can use a tool like Postman or your browser to make this request.

### Step 5: Test Your Bot

1. Open Telegram and start a chat with your bot.
2. Type `/start` to see the bot's response.
3. Interact with the buttons to test sending, editing, and deleting messages.

## Code Overview

Here's the complete code for your Telegram bot, which handles webhooks, messages, and callback queries.


### Functions:

- **registerWebhook()**: Sets the webhook for your bot.
- **unregisterWebhook()**: Removes the webhook from your bot.
- **onMessage(message)**: Handles incoming messages.
- **onCallback(callbackQuery)**: Responds to callback queries from inline buttons.
- **sendMessage(chatId, text, options)**: Sends a message to a chat.
- **editMessage(chatId, messageId, newText, options)**: Edits an existing message.
- **deleteMessage(chatId, messageId)**: Deletes a message from a chat.
- **answerCallbackQuery(callbackQueryId, text)**: Answers a callback query.

## Conclusion

You've successfully created a Telegram bot using Cloudflare Workers! You can now expand its functionality by adding more commands and features as needed. If you have any questions or suggestions, feel free to open an issue.

Happy coding!
