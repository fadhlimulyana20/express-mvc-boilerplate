import { Role } from "./role";

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  roles?: Array<Role>;
  created_at?: Date;
  updated_at?: Date;
}