// routes/notes.js
import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
  getNoteById,
} from "../controllers/notesController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protect all note routes (requiring a valid Bearer token)
router.use(protect);

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
