const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./models/Task"); // Import Task Model

const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/taskmanager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Middleware
app.use(cors());
app.use(express.json()); // Allow JSON request bodies

// 🚀 POST: Add a new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({ title, description });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// 🚀 GET: Fetch all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// 🚀 GET: Fetch a single task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id.trim()); // Trim in case of extra spaces
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
  }
});

// 🚀 PUT: Replace a task by ID
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id.trim(), req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// 🚀 PATCH: Partially update a task by ID
app.patch("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id.trim(), req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task partially updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// 🚀 DELETE: Remove a task by ID
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id.trim());
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

// 🚀 HEAD: Check if a task exists
app.head("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id.trim());
    if (!task) return res.sendStatus(404);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// 🚀 OPTIONS: Show allowed HTTP methods for /tasks
app.options("/tasks", (req, res) => {
  res.set("Allow", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS").sendStatus(200);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
