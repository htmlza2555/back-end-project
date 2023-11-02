"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const user_1 = __importDefault(require("./repositories/user"));
const user_2 = __importDefault(require("./handlers/user"));
const PORT = Number(process.env.PORT || 8888);
const app = (0, express_1.default)();
const client = new client_1.PrismaClient();
const userRepo = new user_1.default(client);
const userHandler = new user_2.default(userRepo);
app.use(express_1.default.json());
app.get("/", (req, res) => {
    return res.status(200).send("Welcome To LearnHub");
});
const userRouter = express_1.default.Router();
app.use("/user", userRouter);
userRouter.post("/", userHandler.registration);
app.listen(PORT, () => {
    console.log(`LearHub API is up at ${PORT}`);
});
