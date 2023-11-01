import { PrismaClient } from "@prisma/client";
import { IUser, IUserRepository } from ".";
import { ICreateUserDto } from "../dto/user";

export default class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  public async create(user: ICreateUserDto): Promise<IUser> {
    return await this.prisma.user.create({
      data: user,
      select: {
        id: true,
        name: true,
        username: true,
        registeredAt: true,
      },
    });
  }
}
