import express from "express";
import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "./repositories";
import UserRepository from "./repositories/user";
import { IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";

const PORT = Number(process.env.PORT || 8888);
const app = express();
const client = new PrismaClient();

const userRepo: IUserRepository = new UserRepository(client);

const userHandler: IUserHandler = new UserHandler(userRepo);

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).send("Welcome To LearnHub");
});

const userRouter = express.Router();

app.use("/user", userRouter);

userRouter.post("/", userHandler.registration);

app.listen(PORT, () => {
  console.log(`LearHub API is up at ${PORT}`);
});
