import { IUser } from "../repositories";

export interface Id {
  id: string;
}
export interface IUserDto {
  id: string;
  username: string;
  name: string;
  registeredAt: string;
}

export interface ICreateUserDto {
  name: string;
  username: string;
  password: string;
}

export const toUserDto = (user: IUser): IUserDto => {
  const userDTO: IUserDto = {
    ...user,
    registeredAt: user.registeredAt.toISOString(),
  };

  return userDTO;
};
