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
import helmet from "helmet";

const app = express();
const allowedOrigins = [
  "https://trello-2frontend2.onrender.com",
  "http://localhost:3000" // Add localhost for testing
];

// Apply CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    console.log(`Origin: ${origin}`); // Log the origin for debugging

    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Apply Helmet for security headers

// Adjust referrer policy if needed
// app.use(helmet.referrerPolicy({ policy: 'no-referrer-when-downgrade' })); // Change this policy as needed

// Middleware
app.use(express.json());

// CORS configuration


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
