import { Content, User } from "@prisma/client";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { ICreateContentDto, IUpdateContentDto } from "../dto/content";

export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}
export interface IUserRepository {
  createUser(user: ICreateUserDto): Promise<IUser>;
  findByUsername(username: string): Promise<User>;
  findById(id: string): Promise<IUser>;
}

export interface IContent extends Omit<Content, "ownerId"> {
  User: IUser;
}

export interface ICreateContent
  extends Omit<Content, "id" | "createdAt" | "updatedAt" | "ownerId"> {}

export interface IContentRepository {
  createContent(content: ICreateContent, ownerId: string): Promise<IContent>;
  getContentById(id: number): Promise<IContent>;
  getAllContents(): Promise<IContent[]>;
  updateContentById(id: number, content: IUpdateContentDto): Promise<IContent>;
  deleteContentById(id: number): Promise<IContent>;
}
