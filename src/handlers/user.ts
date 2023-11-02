import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IUserHandler } from ".";
import { IUserDto } from "../dto/user";
import { IUserRepository } from "../repositories";
import { hashPassword } from "../utils/bcrypt";

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
      const result = await this.repo.create({
        name,
        username,
        password: hashPassword(password),
      });

      const userResponse: IUserDto = {
        ...result,
        registeredAt: result.registeredAt.toUTCString(),
      };

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
}
