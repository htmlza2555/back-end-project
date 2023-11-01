import { IUserHandler } from ".";
import { IUserRepository } from "../repositories";
import { hashPassword } from "../utils/bcrypt";

export default class UserHandler implements IUserHandler {
  constructor(private repo: IUserRepository) {}

  public registration: IUserHandler["registration"] = async (req, res) => {
    const { name, username, password: plainPassword } = req.body;

    const {
      id: registeredId,
      name: registeredName,
      registeredAt,
      username: registeredUsername,
    } = await this.repo.create({
      name,
      username,
      password: hashPassword(plainPassword),
    });

    return res
      .status(200)
      .json({
        id: registeredId,
        name: registeredName,
        registeredAt: `${registeredAt}`,
        username: registeredUsername,
      })
      .end();
  };
}
