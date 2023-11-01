import express from "express";
import { PrismaClient } from "@prisma/client";

const PORT = Number(process.env.PORT || 8888);
const app = express();
const client = new PrismaClient();

app.get("/", (req, res) => {
  return res.status(200).send("Welcome To LearnHub");
});

app.listen(PORT, () => {
  console.log(`LearHub API is up at ${PORT}`);
});
