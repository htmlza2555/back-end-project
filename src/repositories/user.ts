import { Prisma, PrismaClient, User } from "@prisma/client";
import { IUser, IUserRepository } from ".";
import { ICreateUserDto } from "../dto/user";
import { DEFAULT_USER_SELECT } from "../const";

export default class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  public async createUser(user: ICreateUserDto): Promise<IUser> {
    return await this.prisma.user.create({
      data: user,
      select: DEFAULT_USER_SELECT,
    });
  }

  public async findByUsername(username: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { username },
    });
  }

  public async findById(id: string): Promise<IUser> {
    return await this.prisma.user.findUniqueOrThrow({
      select: DEFAULT_USER_SELECT,
      where: { id },
    });
  }
}
