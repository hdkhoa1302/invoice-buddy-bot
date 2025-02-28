import { Telegraf } from 'telegraf';
import { Bill } from './models/Bill';
import mongoose from 'mongoose';
import { scheduleJob } from 'node-schedule';
import 'dotenv/config'; // Thêm dòng này ở đầu file
// Thêm type assertion và kiểm tra env variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const MONGODB_URI = process.env.MONGODB_URI;

if (!BOT_TOKEN || !MONGODB_URI) {
    throw new Error('Missing required environment variables');
}

const bot = new Telegraf(BOT_TOKEN);

// Kết nối MongoDB với type assertion
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
// Web App integration
bot.command('add', (ctx) => {
    ctx.reply('Open bill form:', {
        reply_markup: {
            inline_keyboard: [[{
                text: 'Create New Bill',
                web_app: { url: process.env.WEBAPP_URL! }
            }]]
        }
    });
});

// Xử lý data từ web app
bot.on('web_app_data', async (ctx) => {
    if (!ctx.webAppData) {
        return ctx.reply('Invalid data received');
    }

    try {
        const rawData = ctx.webAppData.data.json() as any;
        const data = JSON.parse(rawData);

        // Thêm validation cơ bản
        if (!data.amount || !data.description || !data.participants) {
            return ctx.reply('Invalid bill format');
        }

        const bill = new Bill({
            amount: data.amount,
            description: data.description,
            payer: ctx.from.id,
            debtors: data.participants.map((id: number) => ({
                userId: id,
                amount: data.amount / data.participants.length,
                paid: false
            }))
        });

        await bill.save();
        ctx.reply('Bill created successfully!');
    } catch (error) {
        console.error('Error processing web app data:', error);
        ctx.reply('Error processing your request');
    }
});

// Các commands khác
bot.command('search', async (ctx) => {
    // Logic tìm kiếm
});

bot.command('stats', async (ctx) => {
    // Logic thống kê
});

// Lập lịch nhắc nợ
scheduleJob('0 18 * * 5', async () => { // 6pm Friday
    const unpaidBills = await Bill.find({ isPaid: false });
    // Gửi thông báo cho người dùng
});

// Webhook config cho Vercel
module.exports = async (req: any, res: any) => {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
};

// Local development
if (process.env.NODE_ENV === 'development') {
    bot.launch();
    console.log('Bot is running in development mode');
}