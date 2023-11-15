import express from "express";
import { PrismaClient } from "@prisma/client";
import { IContentRepository, IUserRepository } from "./repositories";
import UserRepository from "./repositories/user";
import { IContentHandler, IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";
import JWTMiddleware from "./middleware/jwt";
import ContentRepository from "./repositories/content";
import ContentHandler from "./handlers/content";
import cors from "cors";
import { RedisClientType, createClient } from "redis";
import { REDIS_URL } from "./const";
import BlacklistRepository from "./repositories/blacklist";

const PORT = Number(process.env.PORT || 8888);
const app = express();
const client = new PrismaClient();
const redisClient: RedisClientType = createClient({
  url: REDIS_URL,
});

client
  .$connect()
  .then(() => redisClient.connect())
  .catch((err) => {
    console.error("Error", err);
  });

const blacklistRepo = new BlacklistRepository(redisClient);

app.use(cors());
app.use(express.json());

const userRepo: IUserRepository = new UserRepository(client);
const contentRepo: IContentRepository = new ContentRepository(client);

const userHandler: IUserHandler = new UserHandler(userRepo, blacklistRepo);
const contentHandler: IContentHandler = new ContentHandler(contentRepo);

const jwtMiddleware = new JWTMiddleware(blacklistRepo);

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
authRouter.get("/logout", jwtMiddleware.auth, userHandler.logout);
authRouter.get("/me", jwtMiddleware.auth, userHandler.getPersonalInfo);

const contentRouter = express.Router();

app.use("/content", contentRouter);
contentRouter.get("/", contentHandler.getAllContents);
contentRouter.get("/:id", contentHandler.getContentById);
contentRouter.patch(
  "/:id",
  jwtMiddleware.auth,
  contentHandler.updateContentById
);
contentRouter.delete(
  "/:id",
  jwtMiddleware.auth,
  contentHandler.deleteContentById
);
contentRouter.post("/", jwtMiddleware.auth, contentHandler.createContent);

app.listen(PORT, () => {
  console.log(`LearnHub API is up at ${PORT}`);
});
