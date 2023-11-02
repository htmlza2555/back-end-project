import { ICreateUserDto } from "../dto/user";

export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}

export interface IUserRepository {
  create(user: ICreateUserDto): Promise<IUser>;
}
