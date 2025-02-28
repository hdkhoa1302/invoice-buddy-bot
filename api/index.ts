// api/index.ts
import express from 'express';
import { Telegraf } from 'telegraf';
import mongoose from 'mongoose';
import path from 'path';
import serverless from 'serverless-http';
import invoiceRoutes from '../src/routes/webApp';
import './jobs/reminderJob'; // Nếu bạn vẫn muốn chạy cron job (lưu ý: các job dài hạn có thể không chạy liên tục trên môi trường serverless)

const app = express();
app.use(express.json());

// Kết nối tới Mongo Atlas
const MONGO_URI = process.env.MONGO_URI || 'mongodb://your-mongo-uri';
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Cấu hình webhook cho bot Telegram thay vì polling
const BOT_TOKEN = process.env.BOT_TOKEN || 'your-telegram-bot-token';
const bot = new Telegraf(BOT_TOKEN);

// Cấu hình webhook: Đảm bảo bạn gọi bot.telegram.setWebhook sau khi có domain của Vercel
if (process.env.WEBHOOK_URL) {
  bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/api/telegram`);
}

// Thêm route cho mini-app API
app.use('/webapp', invoiceRoutes);

// Phục vụ static files (mini-app giao diện)
app.use(express.static(path.join(__dirname, '../public')));

// Xuất Express app dưới dạng hàm serverless
export default serverless(app);
