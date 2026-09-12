const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

require("dotenv").config({
  path: require("path").join(__dirname, "../.env")
});
const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

let db;

async function connectMongoDB() {
  try {
    await client.connect();

    db = client.db("student_management");

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connectMongoDB();

app.get("/", (req, res) => {
  res.json({
    message: "Student Management API"
  });
});

app.get("/api/students", async (req, res) => {
  try {
    const students = await db
      .collection("students")
      .find({})
      .toArray();

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message
    });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const student = req.body;

    const result = await db
      .collection("students")
      .insertOne(student);

    res.status(201).json({
      message: "Thêm sinh viên thành công",
      insertedId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});