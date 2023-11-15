import { IErrorDto } from "./error";

export interface ILoginDto {
  username: string;
  password: string;
}

export interface ICredentialDto {
  accessToken: string;
}

export interface ILogoutDto extends IErrorDto {}
