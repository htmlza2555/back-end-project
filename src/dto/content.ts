import { IContent } from "../repositories";
import { IUserDto, toUserDto } from "./user";

export interface IContentDto {
  id: number;
  videoTitle: string;
  videoUrl: string;
  comment: string;
  rating: number;
  thumbnailUrl: string;
  creatorName: string;
  creatorUrl: string;
  postedBy: IUserDto;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateContentDto {
  videoUrl: string;
  comment: string;
  rating: number;
}
