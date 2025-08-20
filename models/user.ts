export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}
