import express from "express";
import * as path from "path";

const app = express();
const PORT = 8000;

app.get("/api", (req, res) => res.send("Expressss + TypeScript Server"));

app.use(express.static(path.join(__dirname, "web", "build")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "web", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
