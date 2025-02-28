import { Router } from 'express';
import Invoice from '../models/Invoice';

const router = Router();

// Tạo hóa đơn mới
router.post('/invoices', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Lấy danh sách hóa đơn (có thể thêm bộ lọc theo query)
router.get('/invoices', async (req, res) => {
  try {
    const query = req.query;
    const invoices = await Invoice.find(query);
    res.json(invoices);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Cập nhật hóa đơn
router.put('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!invoice) return res.status(404).json({ error: 'Hóa đơn không tồn tại' });
    res.json(invoice);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Xóa hóa đơn
router.delete('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Hóa đơn không tồn tại' });
    res.json({ message: 'Xóa hóa đơn thành công' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Thống kê hóa đơn (ví dụ: tổng số tiền và số lượng hóa đơn)
router.get('/invoices/stats', async (req, res) => {
  try {
    const stats = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(stats);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
