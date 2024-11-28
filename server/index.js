const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("./models/user.model");
const Note = require("./models/note.model");
const { authenticateToken } = require("./utilities");
const { error } = require("console");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/notesapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Define port
const port = 8000;

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  try {
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists" });
    }

    const user = new User({ fullName, email, password });
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ error: true, message: "Failed to create account" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const userInfo = await User.findOne({ email });
    if (!userInfo || userInfo.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", userId: userInfo._id });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Add Notes
app.post("/add-notes", async (req, res) => {
  const { title, content, tags, userId } = req.body;

  if (!title || !content || !userId) {
    return res
      .status(400)
      .json({ message: "Title, content, and userId are required" });
  }

  try {
    const note = new Note({ title, content, tags: tags || [], userId });
    await note.save();
    res.json({ message: "Note added successfully", note });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ message: "Failed to add note" });
  }
});

//get notes
app.get("/notes/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const notes = await Note.find({ userId });
    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// get user
app.get("/get-user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const isUser = await User.findOne({ _id: userId });
    if (!isUser) {
      return res.sendStatus(401);
    }

    return res.json({
      user: {
        fullName: isUser.fullName,
        email: isUser.email,
        _id: isUser._id,
        createdOn: isUser.createdOn,
      },
      message: "",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//delete notes
app.delete("/delete-note/:noteId", async (req, res) => {
  const { noteId } = req.params;

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    await Note.deleteOne({ _id: noteId });
    return res.json({ error: false, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

// Get Note Details
app.get("/note/:noteId", async (req, res) => {
  const { noteId } = req.params;
  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ note });
  } catch (error) {
    console.error("Error fetching note details:", error);
    return res.status(500).json({ message: "Failed to fetch note details" });
  }
});

//edit notes
app.patch("/edit-note/:noteId", async (req, res) => {
  const { noteId } = req.params;
  const { title, content, tags, isPinned } = req.body;

  try {
    // Find note by noteId
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update fields
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (typeof isPinned === "boolean") note.isPinned = isPinned;

    await note.save();
    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Failed to update note" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
