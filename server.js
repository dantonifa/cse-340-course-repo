import express from "express";
import dotenv from "dotenv";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const app = express();

app.get("/", (req, res) => {
  res.send("Nodemon is working perfectly!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
