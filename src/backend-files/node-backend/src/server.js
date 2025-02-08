import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes.js"; // Single import
import dotenv from "dotenv";
import authRoutes from "./auth.js"; // Import Google Auth routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
