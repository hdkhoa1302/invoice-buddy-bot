import express from 'express';
import { Telegraf } from 'telegraf';
import mongoose from 'mongoose';
import path from 'path';
import invoiceRoutes from './routes/webApp';
import './jobs/reminderJob'; // Khởi chạy cron job

const app = express();
app.use(express.json());

// Kết nối tới Mongo Atlas
const MONGO_URI = process.env.MONGO_URI || 'mongodb://your-mongo-uri';
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

// Khởi tạo Telegraf bot
const BOT_TOKEN = process.env.BOT_TOKEN || 'your-telegram-bot-token';
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  // Gửi tin nhắn kèm inline button mở mini-app
  ctx.reply('Chào mừng bạn! Hãy sử dụng nút bên dưới để mở ứng dụng quản lý hóa đơn.',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Mở Invoice App', web_app: { url: 'https://your-domain.com' } }]
        ]
      }
    }
  );
});

bot.launch();

// Dùng Express để phục vụ API cho mini-app
app.use('/webapp', invoiceRoutes);
// Phục vụ static files cho giao diện mini-app
app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại cổng ${PORT}`);
});

