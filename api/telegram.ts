// api/telegram.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { Telegraf } from 'telegraf';

const BOT_TOKEN = process.env.BOT_TOKEN || 'your-telegram-bot-token';
const bot = new Telegraf(BOT_TOKEN);

// Xử lý update từ Telegram webhook
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    await bot.handleUpdate(req.body, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
};
