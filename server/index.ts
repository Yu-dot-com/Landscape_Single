import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes";
import  { NextFunction, Request, Response } from "express";
import cors from "cors";
import projectRoutes from "./src/routes/project.routes";
import memberRoutes from "./src/routes/member.route";
import assetRoutes from "./src/routes/asset.routes";
import canvasRoute from "./src/routes/canvas.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
  })
);

app.use("/", authRoutes);
app.use("/project", projectRoutes)
app.use("/projects/:projectId/member", memberRoutes);
app.use("/", assetRoutes)
app.use("/", canvasRoute)

// health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});