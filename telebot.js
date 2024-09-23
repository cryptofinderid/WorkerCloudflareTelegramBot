const TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'; // Ganti dengan token bot Anda
const API_URL = `https://api.telegram.org/bot${TOKEN}`;
const WEBHOOK_URL = 'https://your-cloudflare-worker-url.workers.dev'; // Ganti dengan URL Cloudflare Worker Anda

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === 'GET') {
    if (url.pathname === '/registerWebhook') {
      return await registerWebhook();
    } else if (url.pathname === '/unregisterWebhook') {
      return await unregisterWebhook();
    }
  }

  if (request.method === 'POST') {
    const update = await request.json();
    if (update.message) {
      await onMessage(update.message);
    } else if (update.callback_query) {
      await onCallback(update.callback_query);
    }
    return new Response('OK', { status: 200 });
  }

  return new Response('This is a Telegram bot webhook endpoint.', { status: 200 });
}

// Fungsi untuk mengatur webhook
async function registerWebhook() {
  const response = await fetch(`${API_URL}/setWebhook?url=${WEBHOOK_URL}`, {
    method: 'GET'
  });
  const result = await response.json();
  return new Response(JSON.stringify(result), { status: 200 });
}

// Fungsi untuk menghapus webhook
async function unregisterWebhook() {
  const response = await fetch(`${API_URL}/deleteWebhook`, {
    method: 'GET'
  });
  const result = await response.json();
  return new Response(JSON.stringify(result), { status: 200 });
}

// Fungsi untuk menangani pesan teks
async function onMessage(message) {
  const chatId = message.chat.id;
  const text = message.text;

  if (text === '/start') {
    await sendMessage(chatId, "Selamat datang! Pilih opsi:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'SEND', callback_data: 'send' }],
          [{ text: 'EDIT', callback_data: 'edit' }],
          [{ text: 'DELETE', callback_data: 'delete' }]
        ]
      }
    });
  }
}

// Fungsi untuk menangani callback query
async function onCallback(callbackQuery) {
  const callbackQueryId = callbackQuery.id;
  const callbackData = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;

  if (callbackData === 'send') {
    await answerCallbackQuery(callbackQueryId, "Pesan biasa!");
    await sendMessage(chatId, "Pesan biasa.");
  } else if (callbackData === 'edit') {
    await answerCallbackQuery(callbackQueryId, "Pesan di edit!");
    await editMessage(chatId, messageId, "Pesan di edit.");
  } else if (callbackData === 'delete') {
    await answerCallbackQuery(callbackQueryId, "Pesan di hapus!");
    await deleteMessage(chatId, messageId);
  }
}

// Fungsi untuk mengirim pesan
async function sendMessage(chatId, text, options = {}) {
  const body = JSON.stringify({
    chat_id: chatId,
    text: text,
    ...options
  });

  const response = await fetch(`${API_URL}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  });

  return response.json();
}

// Fungsi untuk mengedit pesan
async function editMessage(chatId, messageId, newText, options = {}) {
  const body = JSON.stringify({
    chat_id: chatId,
    message_id: messageId,
    text: newText,
    ...options
  });

  const response = await fetch(`${API_URL}/editMessageText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  });

  return response.json();
}

// Fungsi untuk menghapus pesan
async function deleteMessage(chatId, messageId) {
  const body = JSON.stringify({
    chat_id: chatId,
    message_id: messageId
  });

  const response = await fetch(`${API_URL}/deleteMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  });

  return response.json();
}

// Fungsi untuk menjawab callback query
async function answerCallbackQuery(callbackQueryId, text) {
  const body = JSON.stringify({
    callback_query_id: callbackQueryId,
    text: text
  });

  const response = await fetch(`${API_URL}/answerCallbackQuery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  });

  return response.json();
}
