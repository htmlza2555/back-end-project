"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const user_1 = __importDefault(require("./repositories/user"));
const user_2 = __importDefault(require("./handlers/user"));
const jwt_1 = __importDefault(require("./middleware/jwt"));
const content_1 = __importDefault(require("./repositories/content"));
const content_2 = __importDefault(require("./handlers/content"));
const cors_1 = __importDefault(require("cors"));
const redis_1 = require("redis");
const const_1 = require("./const");
const blacklist_1 = __importDefault(require("./repositories/blacklist"));
const PORT = Number(process.env.PORT || 8888);
const app = (0, express_1.default)();
const client = new client_1.PrismaClient();
const redisClient = (0, redis_1.createClient)({
    url: const_1.REDIS_URL,
});
client
    .$connect()
    .then(() => redisClient.connect())
    .catch((err) => {
    console.error("Error", err);
});
const blacklistRepo = new blacklist_1.default(redisClient);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const userRepo = new user_1.default(client);
const contentRepo = new content_1.default(client);
const userHandler = new user_2.default(userRepo, blacklistRepo);
const contentHandler = new content_2.default(contentRepo);
const jwtMiddleware = new jwt_1.default(blacklistRepo);
app.get("/", jwtMiddleware.auth, (req, res) => {
    console.log(res.locals);
    return res.status(200).send("Welcome To LearnHub");
});
const userRouter = express_1.default.Router();
app.use("/user", userRouter);
userRouter.post("/", userHandler.registration);
const authRouter = express_1.default.Router();
app.use("/auth", authRouter);
authRouter.post("/login", userHandler.login);
authRouter.get("/logout", jwtMiddleware.auth, userHandler.logout);
authRouter.get("/me", jwtMiddleware.auth, userHandler.getPersonalInfo);
const contentRouter = express_1.default.Router();
app.use("/content", contentRouter);
contentRouter.get("/", contentHandler.getAllContents);
contentRouter.get("/:id", contentHandler.getContentById);
contentRouter.patch("/:id", jwtMiddleware.auth, contentHandler.updateContentById);
contentRouter.delete("/:id", jwtMiddleware.auth, contentHandler.deleteContentById);
contentRouter.post("/", jwtMiddleware.auth, contentHandler.createContent);
app.listen(PORT, () => {
    console.log(`LearnHub API is up at ${PORT}`);
});
