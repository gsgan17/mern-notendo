import express from "express"
import { createNote, deleteNote, getAllNotes, updateNote, getNoteById } from "../controllers/notesController.js";

const router = express.Router();

router.get("/", getAllNotes);

router.get("/:id", getNoteById);

router.post("/", createNote);

router.put("/:id", updateNote);

router.delete("/:id", deleteNote);

export default router;

// app.get("/api/notes", (req, res) => {
//     res.status(200).send("10 notes.");
// });

// app.post("/api/notes", (req, res) => {
//     res.status(201).json({message: "Note created successfully!"});
// });

// app.put("/api/notes/:id", (req, res) => {
//     res.status(200).json({message: "Note updated successfully!"});
// });

// app.delete("/api/notes/:id", (req, res) => {
//     res.status(200).json({message: "Note deleted successfully!"});
// });