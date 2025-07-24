import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db";
import csvRoutes from "./routes/csv.routes";
import userRouter from "./routes/user.routes";

dotenv.config({ quiet: true });

const app = express();

app.use(express.json());

app.use("/api/csv", csvRoutes);
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 8080;

initDB().then(() => {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});
