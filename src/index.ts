import express from "express";
import { PrismaClient } from "@prisma/client";
import { IContentRepository, IUserRepository } from "./repositories";
import UserRepository from "./repositories/user";
import { IContentHandler, IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";
import JWTMiddleware from "./middleware/jwt";
import ContentRepository from "./repositories/content";
import ContentHandler from "./handlers/content";

const PORT = Number(process.env.PORT || 8888);
const app = express();
const client = new PrismaClient();

const userRepo: IUserRepository = new UserRepository(client);
const contentRepo: IContentRepository = new ContentRepository(client);

const userHandler: IUserHandler = new UserHandler(userRepo);
const contentHandler: IContentHandler = new ContentHandler(contentRepo);

const jwtMiddleware = new JWTMiddleware();

app.use(express.json());

app.get("/", jwtMiddleware.auth, (req, res) => {
  console.log(res.locals);
  return res.status(200).send("Welcome To LearnHub");
});

const userRouter = express.Router();

app.use("/user", userRouter);

userRouter.post("/", userHandler.registration);

const authRouter = express.Router();

app.use("/auth", authRouter);
authRouter.post("/login", userHandler.login);
authRouter.get("/me", jwtMiddleware.auth, userHandler.selfcheck);

const contentRouter = express.Router();

app.use("/content", contentRouter);

contentRouter.post("/", jwtMiddleware.auth, contentHandler.createContent);

app.listen(PORT, () => {
  console.log(`LearHub API is up at ${PORT}`);
});
