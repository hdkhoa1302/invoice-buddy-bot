import { Schema, model, Document } from 'mongoose';

export interface IInvoice extends Document {
  amount: number;
  payer: string;
  debtor: string;
  description: string;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
  amount: { type: Number, required: true },
  payer: { type: String, required: true },
  debtor: { type: String, required: true },
  description: { type: String, required: true },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

export default model<IInvoice>('Invoice', InvoiceSchema);
