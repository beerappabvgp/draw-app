import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import roomRoutes from "./routes/roomRoutes";

const app = express();

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
    console.log("from index.ts req.body = ", req.body);
    next();
});
// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/rooms", roomRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`HTTP backend running on port ${PORT}`);
});
