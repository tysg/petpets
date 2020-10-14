import express from "express";
import cors from "cors";
import { apiRouter } from "./routes/api";

import * as path from "path";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(cors());
app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, "web", "build")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "web", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
