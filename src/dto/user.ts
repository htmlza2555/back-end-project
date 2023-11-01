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
