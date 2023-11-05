import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IUserHandler } from ".";
import { IUserDto, toUserDto } from "../dto/user";
import { IUserRepository } from "../repositories";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../const";

export default class UserHandler implements IUserHandler {
  constructor(private repo: IUserRepository) {}

  public registration: IUserHandler["registration"] = async (req, res) => {
    const { name, username, password } = req.body;

    if (typeof name !== "string" || name.length === 0) {
      return res.status(400).json({ message: "name is invalid" });
    }
    if (typeof username !== "string" || username.length === 0) {
      return res.status(400).json({ message: "username is invalid" });
    }
    if (typeof password !== "string" || password.length < 5) {
      return res.status(400).json({ message: "password is invalid" });
    }
    try {
      const result = await this.repo.createUser({
        name,
        username,
        password: hashPassword(password),
      });

      const userResponse: IUserDto = toUserDto(result);

      return res.status(201).json(userResponse).end();
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.status(400).json({
          message: `Name is invalid`,
        });
      }
      return res.status(500).json({
        message: `Internal Server Error`,
      });
    }
  };

  public getPersonalInfo: IUserHandler["getPersonalInfo"] = async (
    req,
    res
  ) => {
    try {
      const { registeredAt, ...others } = await this.repo.findById(
        res.locals.user.id
      );

      return res
        .status(200)
        .json({
          ...others,
          registeredAt: registeredAt.toISOString(),
        })
        .end();
    } catch (error) {
      console.error(error);

      return res.status(500).send({ message: "Internal in expected" }).end();
    }
  };

  public login: IUserHandler["login"] = async (req, res) => {
    const { username, password: plaintext } = req.body;
    try {
      const { password, id } = await this.repo.findByUsername(username);

      if (!verifyPassword(plaintext, password))
        throw new Error("Invalid username or password");

      const accessToken = sign({ id }, JWT_SECRET, {
        algorithm: "HS512",
        expiresIn: "12h",
        issuer: "Learnhub-api",
        subject: "user-credential",
      });

      return res.status(200).json({ accessToken }).end();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Invalid username or password" })
        .end();
    }
  };
}
