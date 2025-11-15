// controllers/notesController.js
import Note from "../models/Note.js";

/**
 * Helper to ensure req.user is present (set by your auth middleware)
 */
function ensureAuth(req, res) {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }
  return true;
}

export async function getAllNotes(req, res) {
  try {
    if (!ensureAuth(req, res)) return;

    // fetch notes only for the logged-in user, newest first
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getNoteById(req, res) {
  try {
    if (!ensureAuth(req, res)) return;

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // ownership check
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: you do not own this note" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById controller :", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createNote(req, res) {
  try {
    if (!ensureAuth(req, res)) return;

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = new Note({
      user: req.user.id, // important: attach owner
      title,
      content,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote controller :", error);
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateNote(req, res) {
  try {
    if (!ensureAuth(req, res)) return;

    const { title, content } = req.body;

    // find first to verify existence and ownership
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: you do not own this note" });
    }

    // update only provided fields
    if (typeof title !== "undefined") note.title = title;
    if (typeof content !== "undefined") note.content = content;

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote controller :", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Note not found" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteNote(req, res) {
  try {
    if (!ensureAuth(req, res)) return;

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: you do not own this note" });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    console.error("Error in deleteNote controller :", error);
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}
