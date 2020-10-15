import express from "express";
import { apiRouter } from "./routes/api";
import passport from "passport";
import bodyParser from "body-parser";

import * as path from "path";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, "web", "build")));
app.get("/*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "web", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
