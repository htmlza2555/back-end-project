import { Prisma, PrismaClient, User } from "@prisma/client";
import { IUser, IUserRepository } from ".";
import { ICreateUserDto } from "../dto/user";

export default class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  public async createUser(user: ICreateUserDto): Promise<IUser> {
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

  public async findByUsername(username: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { username },
    });
  }

  public async findById(id: string): Promise<IUser> {
    return await this.prisma.user.findUniqueOrThrow({
      select: {
        id: true,
        name: true,
        username: true,
        registeredAt: true,
      },
      where: { id },
    });
  }
}
