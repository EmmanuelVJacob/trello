import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectMongoDB } from "./config/db.config";
import authRouter from "./routes/authRoute";
import productsRouter from "./routes/productsRoute";
import morgan from "morgan";
import path from "path";
import taskRouter from "./routes/taskRoutes";

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = ["https://trello-2backend2.onrender.com"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

app.use(morgan("common"));

// Connect mongodb
connectMongoDB();

app.use("/api", authRouter);
app.use("/api", productsRouter);
app.use("/api/task", taskRouter);

// Serve static files from the 'upload' directory
app.use("/upload", express.static(path.join(__dirname, "../upload")));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
