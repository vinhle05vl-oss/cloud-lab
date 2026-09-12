const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ KHAI BÁO BIẾN db Ở PHẠM VI MODULE (ngoài hàm)
let db;

// ✅ HÀM KẾT NỐI MONGODB
async function connectDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db('cloud_lab');  // ✅ Gán vào biến toàn cục
    console.log('Connected to MongoDB Atlas successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

// ✅ GỌI HÀM KẾT NỐI TRƯỚC KHI LISTEN
connectDB().then(() => {
  // ✅ ROUTE GET /api/students
  app.get('/api/students', async (req, res) => {
    try {
      const students = await db.collection('students').find().toArray();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  });

  // ✅ ROUTE POST /api/students
  app.post('/api/students', async (req, res) => {
    try {
      const student = req.body;
      const result = await db.collection('students').insertOne(student);
      res.status(201).json({
        message: 'Thêm sinh viên thành công',
        insertedId: result.insertedId
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  });

  // ✅ ROUTE /api/hello (tùy chọn)
  app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express Backend!' });
  });
// ✅ Route PUT /api/students/:id - Cập nhật sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: 'Database chưa kết nối' });
    }
    const { id } = req.params;
    const { mssv, hoTen, email } = req.body;

    console.log('PUT request:', { id, mssv, hoTen, email });

    const result = await db.collection('students').updateOne(
      { _id: new ObjectId(id) },
      { $set: { mssv, hoTen, email } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }

    res.json({ 
      message: 'Cập nhật sinh viên thành công',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Lỗi PUT:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// ✅ Route DELETE /api/students/:id - Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: 'Database chưa kết nối' });
    }
    const { id } = req.params;

    const result = await db.collection('students').deleteOne(
      { _id: new ObjectId(id) }
    );

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }

    res.json({ message: 'Xóa sinh viên thành công' });
  } catch (error) {
    console.error('Lỗi DELETE:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});
  // ✅ LISTEN SAU KHI KẾT NỐI XONG
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});