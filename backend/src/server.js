import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routesFolder/notesRoutes.js";
import authRoutes from "./routesFolder/authRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// // ---- Global Middleware ----
// if (process.env.NODE_ENV !== "production") {
//   app.use(
//     cors({
//       origin: "http://localhost:5173", // frontend dev URL
//       credentials: true,
//     })
//   );
// }

app.use(cors());

app.use(express.json()); // parse JSON bodies
app.use(rateLimiter); // rate limiter early

// ---- API Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// ---- Health Check ----
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// ---- Serve React Build in Production ----
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// ---- Error Handler ----
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// ---- Start Server after DB Connection ----
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server started on port", PORT);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });
