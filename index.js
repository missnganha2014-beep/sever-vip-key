const TelegramBot = require('node-telegram-bot-api');
const express = require("express");

const token = "8489744162:AAFH-E-uteqz0-Tv2QcRWq6UgEAOab8q8Z0";
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(express.json());

const keys = {};

console.log("Bot + Server running...");

function generateKey() {
  return "Kayros-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function createKey(days) {
  const key = generateKey();
  const expire = Date.now() + days * 24 * 60 * 60 * 1000;

  keys[key] = {
    expire: expire,
    usedDevice: null
  };

  return key;
}

bot.onText(/\/key1day/, (msg) => {
  const key = createKey(1);
  bot.sendMessage(msg.chat.id, "🔑 KEY 1 DAY:\n" + key);
});

bot.onText(/\/key7day/, (msg) => {
  const key = createKey(7);
  bot.sendMessage(msg.chat.id, "🔑 KEY 7 DAYS:\n" + key);
});

bot.onText(/\/key30day/, (msg) => {
  const key = createKey(30);
  bot.sendMessage(msg.chat.id, "🔑 KEY 30 DAYS:\n" + key);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
    "Kayros Key Bot đang hoạt động 🔥\n\nDùng:\n/key1day\n/key7day\n/key30day"
  );
});

app.post("/verify", (req, res) => {

  const { key, device } = req.body;

  if (!keys[key]) {
    return res.json({ status: false, message: "Key không tồn tại" });
  }

  if (Date.now() > keys[key].expire) {
    return res.json({ status: false, message: "Key đã hết hạn" });
  }

  if (keys[key].usedDevice && keys[key].usedDevice !== device) {
    return res.json({ status: false, message: "Key đã dùng ở thiết bị khác" });
  }

  keys[key].usedDevice = device;

  res.json({
    status: true,
    expire: keys[key].expire
  });

});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server chạy cổng " + PORT));