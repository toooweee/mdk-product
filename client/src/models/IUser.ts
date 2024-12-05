export interface IUser {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
  password: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
}
