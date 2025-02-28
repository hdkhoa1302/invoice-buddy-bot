import { Schema, model } from 'mongoose';

interface IBill {
    amount: number;
    description: string;
    payer: number;
    debtors: Array<{
        userId: number;
        amount: number;
        paid: boolean;
    }>;
    date: Date;
    isPaid: boolean;
}

const billSchema = new Schema<IBill>({
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    payer: { type: Number, required: true },
    debtors: [{
        userId: Number,
        amount: Number,
        paid: { type: Boolean, default: false }
    }],
    date: { type: Date, default: Date.now },
    isPaid: { type: Boolean, default: false }
});

export const Bill = model<IBill>('Bill', billSchema);