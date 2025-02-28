import cron from 'node-cron';
import Invoice from '../models/Invoice';
import { Telegraf } from 'telegraf';

const BOT_TOKEN = process.env.BOT_TOKEN || 'your-telegram-bot-token';
const bot = new Telegraf(BOT_TOKEN);

// Lên lịch chạy vào cuối tuần (ví dụ: Chủ nhật nửa đêm)
cron.schedule('0 0 * * 0', async () => {
  try {
    // Tìm các hóa đơn chưa thanh toán
    const unpaidInvoices = await Invoice.find({ isPaid: false });
    // Gửi tin nhắn nhắc nợ đến từng debtor
    unpaidInvoices.forEach(invoice => {
      // Giả sử trường debtor chứa username Telegram của người nợ
      bot.telegram.sendMessage(`@${invoice.debtor}`, 
        `Nhắc nhở: Bạn đang nợ ${invoice.amount} cho mục "${invoice.description}". Vui lòng thanh toán sớm.`);
    });
    console.log('Đã gửi tin nhắc nợ.');
  } catch (err) {
    console.error("Lỗi khi gửi nhắc nợ:", err);
  }
});

